/* Scoped, event-driven motion; route changes release observers and listeners. */
window.SceneMotion = (() => {
  let release = () => {};
  return {
    destroy() { release(); release = () => {}; },
    init() {
      const root = document.querySelector('.editorial-scenarios');
      if (!root) return;
      const reduced = matchMedia('(prefers-reduced-motion: reduce)');
      const fine = matchMedia('(hover: hover) and (pointer: fine)');
      const cleanups = [];
      const cards = [...root.querySelectorAll('.editorial-scene')];
      const targets = [...root.querySelectorAll('.editorial-hero-grid, .editorial-rule, .editorial-scene, .editorial-end')];
      let observer;
      const revealAll = () => { observer?.disconnect(); targets.forEach(el => el.classList.remove('scene-pending')); };
      if (!reduced.matches && 'IntersectionObserver' in window) {
        observer = new IntersectionObserver(entries => entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('scene-pending');
            entry.target.classList.add('scene-entered');
            observer.unobserve(entry.target);
          }
        }), { threshold: 0.08 });
        targets.forEach((el,i) => { el.style.setProperty('--entry-delay', `${i % 2 * 70}ms`); el.classList.add('scene-pending'); observer.observe(el); });
      }
      const listen = (el, name, fn, options) => { el.addEventListener(name,fn,options); cleanups.push(() => el.removeEventListener(name,fn,options)); };
      listen(reduced,'change',revealAll);
      cards.forEach(card => {
        const visual = card.querySelector('.scenario-visual');
        let frame = 0, x = 0, y = 0;
        const reset = () => { cancelAnimationFrame(frame); frame = 0; visual.style.removeProperty('--image-x'); visual.style.removeProperty('--image-y'); };
        listen(card,'pointermove',e => {
          if (reduced.matches || !fine.matches) return;
          const bounds = card.getBoundingClientRect();
          x = ((e.clientX-bounds.left)/bounds.width-.5)*7;
          y = ((e.clientY-bounds.top)/bounds.height-.5)*5;
          if (!frame) frame=requestAnimationFrame(() => { visual.style.setProperty('--image-x',`${x}px`); visual.style.setProperty('--image-y',`${y}px`); frame=0; });
        },{passive:true});
        listen(card,'pointerleave',reset);
        listen(reduced,'change',reset);
        cleanups.push(reset);
        listen(card,'focus',() => card.classList.remove('scene-pending'));
      });
      const browse = root.querySelector('[data-browse-scenes]');
      listen(browse,'click',() => {
        const first = cards[0];
        first.classList.remove('scene-pending');
        first.focus({preventScroll:true});
        first.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});
      });
      release = () => { revealAll(); cleanups.forEach(fn=>fn()); };
    }
  };
})();
