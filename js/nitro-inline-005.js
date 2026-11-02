
window.addEventListener("beforeunload",()=>ultraStop3DMusic(false));
document.addEventListener("keydown",(e)=>{
  if(e.key==="Escape" && ultra3DAudio){
    setTimeout(()=>{
      const visibleGame = document.querySelector('.game-modal.active, .modal.active, [data-game-open="true"]');
      if(!visibleGame) ultraStop3DMusic(true);
    },120);
  }
});
