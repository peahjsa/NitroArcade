
(()=>{const panel=document.getElementById('nitroMacroWorlds');const grid=document.getElementById('gameGrid');if(panel&&grid)grid.parentNode.insertBefore(panel,grid);})();
window.NitroMacro=(()=>{
 const names=['Neon Rail Grinder','Voxel Vault Heist','Orbital Forge','Prism Wing','Labyrinth Shift','Titan Steps','Zero-G Cargo','Holo Pinball Reactor'];
 let ready=false,pending=-1;
 const get=id=>document.getElementById(id);
 function open(){
   if(typeof showArcadePart==='function')showArcadePart('macro');
 }
 function play(index){if(!Number.isInteger(index)||index<0||index>=names.length)return;open();get('nmPlayerShell').style.display='block';get('nmNowPlaying').textContent='NOW PLAYING / '+names[index];
  const frame=get('nmGameFrame');if(ready)frame.contentWindow.postMessage({macroNitro:true,action:'play',index},'*');else pending=index;
  get('nmPlayerShell').scrollIntoView({behavior:'smooth',block:'start'});
 }
 function exitGame(){get('nmGameFrame').contentWindow.postMessage({macroNitro:true,action:'stop'},'*');get('nmPlayerShell').style.display='none';}
 function close(){exitGame();if(typeof showArcadePart==='function')showArcadePart('small')}
 window.addEventListener('message',event=>{if(event.source!==get('nmGameFrame')?.contentWindow||!event.data?.macroNitro)return;
  if(event.data.action==='ready'){ready=true;if(pending>=0){const n=pending;pending=-1;get('nmGameFrame').contentWindow.postMessage({macroNitro:true,action:'play',index:n},'*')}}
  if(event.data.action==='exit')exitGame();
 });
 return{open,play,close,exitGame};
})();
