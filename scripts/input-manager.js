/* Unified keyboard/mouse/gamepad input */
(() => {
  const N=window.NitroArcade=window.NitroArcade||{};
  const down=new Set(), pressed=new Set();
  addEventListener("keydown",e=>{if(!down.has(e.code))pressed.add(e.code);down.add(e.code)});
  addEventListener("keyup",e=>down.delete(e.code));
  addEventListener("blur",()=>{down.clear();pressed.clear()});
  N.input={
    down:code=>down.has(code),
    pressed:code=>{const yes=pressed.has(code);pressed.delete(code);return yes;},
    axis:(neg,pos)=>(down.has(pos)?1:0)-(down.has(neg)?1:0),
    gamepad(index=0){return navigator.getGamepads?.()[index]||null},
    gpButton:(button,index=0)=>!!N.input.gamepad(index)?.buttons?.[button]?.pressed,
    gpAxis:(axis,index=0,dead=.15)=>{let v=N.input.gamepad(index)?.axes?.[axis]||0;return Math.abs(v)<dead?0:v}
  };
})();