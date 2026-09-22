/* No-library celebration particles */
(() => {
  const N=window.NitroArcade=window.NitroArcade||{};
  N.confetti=(x=innerWidth/2,y=innerHeight/3,count=45)=>{
    for(let i=0;i<count;i++){
      const p=document.createElement("i");
      Object.assign(p.style,{position:"fixed",left:x+"px",top:y+"px",width:"7px",height:"7px",
        zIndex:99999,pointerEvents:"none",background:`hsl(${Math.random()*360} 90% 60%)`,
        transform:`rotate(${Math.random()*360}deg)`});
      document.body.appendChild(p);
      const dx=(Math.random()-.5)*420,dy=100+Math.random()*360,rot=(Math.random()-.5)*900;
      p.animate([{transform:"translate(0,0)",opacity:1},{transform:`translate(${dx}px,${dy}px) rotate(${rot}deg)`,opacity:0}],
        {duration:900+Math.random()*900,easing:"cubic-bezier(.15,.7,.3,1)",fill:"forwards"});
      setTimeout(()=>p.remove(),1900);
    }
  };
})();