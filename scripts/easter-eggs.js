/* Harmless NitroArcade easter eggs */
(() => {
  const N=window.NitroArcade=window.NitroArcade||{};
  let seq=[], konami=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","KeyB","KeyA"];
  addEventListener("keydown",e=>{
    seq.push(e.code); if(seq.length>konami.length)seq.shift();
    if(seq.join("|")===konami.join("|")){
      N.confetti?.(innerWidth/2,80,90);
      N.achievements?.unlock("secret-code","Secret Code","You found the classic arcade code.");
      N.emit?.("secret",{id:"konami"});
      seq=[];
    }
  });
})();