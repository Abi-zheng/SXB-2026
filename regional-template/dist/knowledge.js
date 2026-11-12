/* Deterministic lookup: reuse published service and stage content. */
(function(root){
 const normalize=t=>String(t||'').toLowerCase().replace(/[\s，。？！、,.?!：:；;“”"'（）()]/g,'');
 function answer(question,site,journey){
  const q=normalize(question),result=(text,sources=[])=>({answer:text,sources,kind:'knowledge'});
  const faq=id=>{const f=site.faqs.find(f=>f.id===id);return result(f.a,[{label:f.q,url:'/help/'+id}])};
  if(!q)return result('请输入你想了解的问题，例如担保材料、保函期限或机构合作。');
  if(/^(你好|您好|嗨|hello|hi)$/.test(q))return result('你好，我是'+site.assistant.name+'，可以帮助你查找站内的场景指引、材料准备和常见问题。');
  if(/^(谢谢|感谢|多谢|thanks)/.test(q))return result('不客气。你还可以查询担保材料、保函期限或平台使用问题。');
  const exact=site.faqs.find(f=>normalize(f.q)===q);if(exact)return faq(exact.id);
  if(/(这份|本案|这个案件|一定|保证|会判|能胜诉|肯定|会接受|会不会接受|批准吗|通过吗)/.test(q))return result('目前站内没有足够的资料判断这个具体问题。法院是否接受担保、机构是否出函及案件结果，需要结合材料依法审查，不能仅凭提问作出判断。',[{label:'出函与法院审查的区别',url:'/help/h6'},{label:'了解适用场景',url:'/scenarios'}]);
  if(/(已入驻|已经入驻|哪些机构|机构名单|入驻状态|合作状态)/.test(q))return site.institutions.length?result(site.faqs.find(f=>f.id==='h9').a,[{label:'查看机构信息',url:'/institutions'}]):faq('h9');
  if(/(入驻|合作|加盟|加入平台)/.test(q))return faq('h3');
  if(/(电话|联系|客服|人工|地址|邮箱|工作时间)/.test(q)){const c=site.contact,lines=[];if(c.phone)lines.push('联系电话：'+c.phone);if(c.hours&&c.phone)lines.push('服务时间：'+c.hours);if(c.email)lines.push('电子邮箱：'+c.email);if(c.address)lines.push('联系地址：'+c.address);return lines.length?result(lines.join('\n'),[{label:'关于平台',url:'/about'}]):faq('h5')}
  if(/(二审|上诉)/.test(q)&&journey){const s=journey.stages.find(s=>s.id==='appeal');return result(s.intro+'\n\n'+s.needs[0].direction+'\n\n'+s.note,[{label:'查看二审阶段指引',url:'/scenarios?stage=appeal'},{label:'区分保全期限与保函期限',url:'/help/h7'}])}
  const alias=/(解封|解除保全|反担保)/.test(q)?'release-preservation':null;
  const scenario=site.scenarios.find(s=>s.id===alias||q.includes(normalize(s.title)));
  if(scenario){const d=journey?.services[scenario.id];const materials=/(资料|材料|准备|清单)/.test(q);return result(d?(materials?d.guarantee+'可先准备：\n'+d.materials.map((m,i)=>(i+1)+'. '+m).join('\n')+'\n\n最终清单以法院与出函机构要求为准。':scenario.detail+'\n\n'+d.condition):scenario.detail,[{label:'查看'+(d?.guarantee||scenario.title)+'适用条件与材料',url:'/scenarios/'+scenario.id}])}
  if(/律师/.test(q)&&/(代办|当事人|材料|准备)/.test(q))return faq('h10');
  if(/(多久|多长时间|出函时间|加急)/.test(q))return faq('h11');
  if(/(材料|资料|准备|证件)/.test(q))return faq('h2');
  if(/(期限|到期|续保)/.test(q))return faq('h7');
  if(/(贷款|放款|利率|融资)/.test(q))return result('本站提供诉讼保全及相关担保的信息与准备指引，不提供贷款申请或融资撮合服务。',[{label:'了解平台服务范围',url:'/help/h1'}]);
  if(/(费用|费率|多少钱|收费|报价)/.test(q))return result('目前尚未公布收费标准。询价时请说明保函类型、金额、期限和法院名称，并确认报价包含哪些费用。',[{label:'了解担保场景',url:'/scenarios'}]);
  if(/(阶段|进度|立案|一审|诉前|执行)/.test(q)&&journey){const id=/一审|开庭/.test(q)?'trial':/诉前|没起诉/.test(q)?'before':/执行/.test(q)?'execution':'filing';const s=journey.stages.find(s=>s.id===id);return result(s.intro+'\n\n'+s.note,[{label:'按阶段查看具体情况',url:'/scenarios?stage='+id}])}
  if(/(政策|资讯|新闻|动态|指南|公告)/.test(q))return result('在「最新资讯」页面搜索关键词，查看服务指引与平台使用说明。法律政策信息请同时核对原文及适用范围。',[{label:'查看服务资讯',url:'/news'},...site.news.slice(0,2).map(n=>({label:n.title,url:'/news/'+n.id}))]);
  if(/(隐私|数据|记录|保存|安全)/.test(q))return result('当前问答不向外部模型发送提问。对话仅保留在页面会话中，刷新或点击「新对话」即可清除。机构准入表单仅演示提交。',[{label:'合作资料保存说明',url:'/help/h3'}]);
  if(/(你是|模型|人工智能|ai|机器人)/.test(q))return result('我是'+site.assistant.name+'，根据站内内容匹配相关指引，尚未连接外部 AI 模型，不作个案法律判断。',[{label:'了解平台',url:'/about'}]);
  if(/(机构|银行|服务伙伴)/.test(q))return faq('h9');
  if(/(平台|诉讼保|服务|功能|介绍|能做|帮助|场景|担保|保函)/.test(q))return result(site.faqs.find(f=>f.id==='h1').a,[{label:'查看保函用途',url:'/scenarios'},{label:'了解诉讼保',url:'/about'}]);
  return result('暂未找到准确匹配的站内内容。可以说明担保类型或案件阶段，也可以查看场景指引。',[{label:'查看场景指引',url:'/scenarios'},{label:'查看帮助中心',url:'/help'}]);
 }
 root.SiteKnowledge={answer};if(typeof module!=='undefined'&&module.exports)module.exports={answer};
})(typeof window==='undefined'?globalThis:window);
