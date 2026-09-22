/* Achievement unlocker with tiny toast */
(() => {
  const N=window.NitroArcade=window.NitroArcade||{};
  const KEY="achievements";
  function toast(title,desc){
    const d=document.createElement("div");
    d.textContent="🏆 "+title+(desc?" — "+desc:"");
    Object.assign(d.style,{position:"fixed",right:"18px",top:"18px",zIndex:100000,padding:"12px 16px",
      borderRadius:"12px",background:"#111827",color:"#fff",font:"700 13px system-ui",boxShadow:"0 8px 30px #0008",
      maxWidth:"340px",transition:"opacity .3s,transform .3s"});
    document.body.appendChild(d);
    setTimeout(()=>{d.style.opacity="0";d.style.transform="translateY(-8px)"},2600);
    setTimeout(()=>d.remove(),3000);
  }
  N.achievements={
    unlock(id,title=id,desc=""){
      const got=N.save?.get(KEY,[])||[];
      if(got.includes(id)) return false;
      got.push(id); N.save?.set(KEY,got); toast(title,desc); N.emit?.("achievement",{id,title,desc}); return true;
    },
    has:id=>(N.save?.get(KEY,[])||[]).includes(id),
    all:()=>N.save?.get(KEY,[])||[]
  };
})();