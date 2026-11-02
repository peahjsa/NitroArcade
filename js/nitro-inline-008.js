
(()=>{
  function enhance(root=document){
    root.querySelectorAll?.('canvas').forEach(c=>{
      if(c.dataset.nitroDetailed)return;c.dataset.nitroDetailed='1';
      c.style.imageRendering='auto';c.style.outline='none';
      c.addEventListener('pointerdown',()=>{try{NitroArcade?.sfx?.(430,.025)}catch(e){}},{passive:true});
    });
    root.querySelectorAll?.('.mega-panel,.nova-panel,.native-game-shell,.bm95-shell,.nwf').forEach(x=>x.classList.add('nitro-detailed-game'));
  }
  enhance();new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)enhance(n)}))).observe(document.body,{childList:true,subtree:true});
  addEventListener('nitro:gameopen',e=>{let eng=e.detail?.engine;if(['voxel3d','football3d','flight3d','brickmaze3d','theday','nightwatch'].includes(eng))setTimeout(()=>{
    const host=document.getElementById('playerContainer');if(!host||host.querySelector('.nitro-detail-badge'))return;let b=document.createElement('div');b.className='nitro-detail-badge';b.textContent='✦ ENHANCED GRAPHICS';Object.assign(b.style,{position:'absolute',right:'14px',top:'14px',zIndex:50,padding:'6px 9px',border:'1px solid #ffffff25',borderRadius:'999px',background:'#07101bbb',backdropFilter:'blur(8px)',color:'#dff9ff',font:'800 9px system-ui',letterSpacing:'1px',pointerEvents:'none'});host.appendChild(b)
  },80)});
})();
