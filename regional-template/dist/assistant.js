(function(){
  const config=window.SITE_CONFIG,settings=config.assistant;
  const escape=text=>String(text??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const arrow='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6"/></svg>';
  const spark='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"/></svg>';
  let messages=[],draft='',pending=false,error='',controller=null,sequence=0;
  const local=()=>settings.mode!=='remote';
  const selector=s=>document.querySelector(s);
  function validSource(source){return source&&typeof source.label==='string'&&typeof source.url==='string'&&/^\/(?:help|news|scenarios|institutions|about)(?:\/[\w-]+)?(?:\?stage=(?:before|filing|trial|appeal|execution))?$/.test(source.url)}
  function messageHTML(message){return `<div class="chat-message ${message.role}"><span class="message-speaker">${message.role==='user'?'你':escape(settings.name)}</span><div class="message-content">${escape(message.content).replace(/\n/g,'<br>')}</div>${message.sources?.length?`<div class="answer-sources"><span>相关入口</span>${message.sources.filter(validSource).map(s=>`<a href="#${escape(s.url)}">${escape(s.label)}<span aria-hidden="true">↗</span></a>`).join('')}</div>`:''}</div>`}
  function html(){return `<section class="assistant-panel" aria-labelledby="assistant-heading" aria-busy="${pending}"><div class="assistant-topbar"><div class="assistant-identity"><span class="assistant-symbol">${spark}</span><h2 id="assistant-heading">${escape(settings.name)}</h2><span class="assistant-mode">${local()?'站内问答':'AI 对话'}</span></div><button class="new-conversation" aria-label="开始新对话" ${!messages.length&&!draft?'disabled':''}><span aria-hidden="true">＋</span>新对话</button></div><div class="assistant-intro" ${messages.length?'hidden':''}><span class="welcome-mark">${spark}</span><h3>办保函，你想先问什么？</h3><p>可以问材料、费用和期限，也可以先选下面的常见问题。</p></div><div class="chat-transcript" role="log" aria-label="对话记录" aria-live="polite" aria-relevant="additions" ${!messages.length?'hidden':''}>${messages.map(messageHTML).join('')}</div><form class="assistant-form"><label for="assistant-question">向诉讼保提问</label><div class="composer"><textarea id="assistant-question" rows="2" maxlength="2000" placeholder="输入你的问题，例如：保函需要准备哪些材料？" aria-describedby="assistant-note" ${pending?'readonly':''}>${escape(draft)}</textarea><div class="composer-bottom"><span>${local()?'站内知识 · 即时查找':'AI 助手 · 为你解答'}</span><button type="submit" class="send-question" aria-label="发送问题" ${!draft.trim()||pending?'disabled':''}>${arrow}</button><button type="button" class="stop-answer" ${pending?'':'hidden'}>停止</button></div></div><div class="assistant-pending" role="status" ${pending?'':'hidden'}>正在查找回答…</div><div class="assistant-error" role="alert" ${error?'':'hidden'}>${escape(error)}</div></form><div class="question-suggestions" aria-label="推荐问题">${settings.suggestions.map((q,i)=>`<button type="button" data-chat-suggestion="${escape(q)}">${escape(q.replace('诉讼保可以提供哪些服务？','了解平台服务').replace('金融机构如何申请入驻？','机构如何入驻').replace('如何查找资讯和办理指南？','查找资讯指南'))}<span aria-hidden="true">↗</span></button>`).join('')}</div><div class="assistant-note" id="assistant-note">${local()?'回答来自站内资料，不提供个案法律判断。':'回答仅供信息参考，具体事项请向相关机构核实。'}</div></section>`}
  function update(){const host=selector('.assistant-shell');if(!host)return;host.innerHTML=html();bind();const transcript=selector('.chat-transcript');if(transcript)transcript.scrollTop=transcript.scrollHeight}
  async function reply(question,signal){
    if(local())return window.SiteKnowledge.answer(question,config,window.COURT_JOURNEY);
    // Only a same-origin service endpoint is allowed. Provider secrets belong on the server.
    if(!settings.endpoint||!/^\/api\/[\w/-]+$/.test(settings.endpoint))throw new Error('回答服务尚未开通，请稍后再试。');
    const response=await fetch(settings.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:messages.slice(-12).map(m=>({role:m.role,content:m.content}))}),signal});
    if(!response.ok)throw new Error('回答服务暂时不可用，请稍后重试。');
    const data=await response.json();if(typeof data.answer!=='string'||!data.answer.trim())throw new Error('暂未收到有效回答，请重新提问。');
    return {answer:data.answer,sources:Array.isArray(data.sources)?data.sources.filter(validSource):[]};
  }
  async function ask(question){
    if(!selector('.assistant-panel')){location.hash='/';requestAnimationFrame(()=>requestAnimationFrame(()=>ask(question)));return}
    const q=String(question||'').trim();if(!q||pending)return;if(q.length>2000){error='问题请控制在 2000 字以内。';update();return}
    const current=++sequence;pending=true;error='';draft='';messages.push({role:'user',content:q});controller=new AbortController();update();
    const id=setTimeout(()=>controller?.abort(),30000);
    try{const result=await reply(q,controller.signal);if(current!==sequence)return;messages.push({role:'assistant',content:result.answer,sources:result.sources})}
    catch(e){if(current!==sequence)return;error=e.name==='AbortError'?'本次回答已停止或等待超时。你可以重新发送问题。':e.message;draft=q}
    finally{clearTimeout(id);if(current===sequence){pending=false;controller=null;update();selector('#assistant-question')?.focus({preventScroll:true})}}
  }
  function focus(){if(!selector('#assistant-question')){location.hash='/';requestAnimationFrame(()=>requestAnimationFrame(focus));return}selectHomeSlide('chat');selector('.assistant-shell').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});selector('#assistant-question').focus({preventScroll:true})}
  function bind(){const form=selector('.assistant-form');if(!form)return;const input=selector('#assistant-question');form.onsubmit=e=>{e.preventDefault();ask(input.value)};input.oninput=()=>{draft=input.value;selector('.send-question').disabled=!draft.trim()||pending;selector('.new-conversation').disabled=!messages.length&&!draft};input.onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&e.keyCode!==229){e.preventDefault();ask(input.value)}};selector('.new-conversation').onclick=()=>{sequence++;controller?.abort();controller=null;pending=false;messages=[];draft='';error='';update();selector('#assistant-question')?.focus()};selector('.stop-answer').onclick=()=>controller?.abort();document.querySelectorAll('[data-chat-suggestion]').forEach(b=>b.onclick=()=>ask(b.dataset.chatSuggestion))}
  window.SiteAssistant={html,bind,ask:question=>{focus();ask(question)},focus};
})();
