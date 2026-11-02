
/* NitroArcade cosmetic ad cleanup (only elements on NitroArcade's own page). */
(function(){
  const unwanted=['[data-nitro-ad]','.nitro-ad-slot','.nitro-sponsored-banner'];
  function clean(){for(const selector of unwanted){document.querySelectorAll(selector).forEach(el=>el.remove());}}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',clean,{once:true}); else clean();
  const watcher=new MutationObserver(clean);
  watcher.observe(document.documentElement,{childList:true,subtree:true});
})();
