

(()=>{
  const N=window.NitroArcade=window.NitroArcade||{};
  const P="nitroarcade:";
  const read=(k,f)=>{try{const v=localStorage.getItem(P+k);return v===null?f:JSON.parse(v)}catch{return f}};
  const write=(k,v)=>{localStorage.setItem(P+k,JSON.stringify(v));return v};
  N.save=N.save||{get:read,set:write};
  N.emit=N.emit||((n,d={})=>dispatchEvent(new CustomEvent("nitro:"+n,{detail:d})));
  N.on=N.on||((n,f)=>addEventListener("nitro:"+n,e=>f(e.detail,e)));

  N.stats={
    inc(k,n=1){let s=read("stats",{});s[k]=(s[k]||0)+n;write("stats",s);return s[k]},
    all:()=>read("stats",{})
  };
  N.xp={
    get:()=>read("xp",0),
    level(x){x=x??N.xp.get();return Math.floor(Math.sqrt(x/100))+1},
    add(n,reason=""){const before=N.xp.level(),x=write("xp",N.xp.get()+Math.max(0,n));if(N.xp.level(x)>before)N.notify("LEVEL "+N.xp.level(x)+" UNLOCKED!","⚡ LEVEL UP");return x}
  };
  N.coins={
    get:()=>read("coins",0),
    add(n){const b=Math.max(0,N.coins.get()+Math.floor(n));write("coins",b);return b}
  };
  N.favorites={
    all:()=>read("favorites",[]),
    toggle(id){let a=N.favorites.all(),i=a.indexOf(id);i<0?a.push(id):a.splice(i,1);write("favorites",a);return i<0}
  };
  N.recent={
    all:()=>read("recent",[]),
    add(id){let a=[id,...N.recent.all().filter(x=>x!==id)].slice(0,12);write("recent",a);return a}
  };
  N.scores={
    submit(game,score){let a=read("scores:"+game,[]);a.push({score:Number(score)||0,date:Date.now()});a.sort((a,b)=>b.score-a.score);write("scores:"+game,a.slice(0,20));return a[0]},
    get:game=>read("scores:"+game,[])
  };

  N.notify=(message,title="NITROARCADE")=>{
    let d=document.createElement("div");
    d.innerHTML=`<b>${title}</b><div style="margin-top:4px">${message}</div>`;
    Object.assign(d.style,{position:"fixed",right:"18px",bottom:"18px",zIndex:100000,padding:"12px 15px",
      border:"1px solid #ffffff33",borderRadius:"12px",background:"#07101eee",color:"#fff",
      font:"12px system-ui",boxShadow:"0 10px 35px #0009",maxWidth:"320px"});
    document.body.appendChild(d);setTimeout(()=>d.remove(),2800);
  };

  let ac;
  N.sfx=(f=520,d=.05)=>{
    try{ac=ac||new (AudioContext||webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();
    o.frequency.value=f;o.type="square";g.gain.value=.018;o.connect(g);g.connect(ac.destination);o.start();
    g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+d);o.stop(ac.currentTime+d)}catch{}
  };
  N.shake=(el=document.body,p=6,ms=180)=>{if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
    el.animate([{transform:"translate(0)"},{transform:`translate(${p}px,${-p/2}px)`},{transform:`translate(${-p}px,${p/2}px)`},{transform:"translate(0)"}],{duration:ms})};
  N.flash=(color="#fff")=>{let x=document.createElement("div");Object.assign(x.style,{position:"fixed",inset:0,zIndex:99998,pointerEvents:"none",background:color});
    document.body.appendChild(x);x.animate([{opacity:.7},{opacity:0}],{duration:180,fill:"forwards"});setTimeout(()=>x.remove(),220)};
  N.confetti=(count=50)=>{for(let i=0;i<count;i++){let p=document.createElement("i");Object.assign(p.style,{position:"fixed",left:"50%",top:"12%",
    width:"7px",height:"7px",zIndex:99999,pointerEvents:"none",background:`hsl(${Math.random()*360} 90% 60%)`});document.body.appendChild(p);
    let x=(Math.random()-.5)*700,y=200+Math.random()*500;p.animate([{transform:"translate(0,0)",opacity:1},{transform:`translate(${x}px,${y}px) rotate(${Math.random()*900}deg)`,opacity:0}],
    {duration:1000+Math.random()*900,fill:"forwards"});setTimeout(()=>p.remove(),2000)}};

  N.daily=()=>{
    const list=(window.gamesDatabase||[]).filter(g=>g && g.id);
    if(!list.length)return null;
    const d=new Date(),key=`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
    let seed=[...key].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7);
    return {date:key,game:list[seed%list.length]};
  };

  N.backup={
    download(){const data={created:new Date().toISOString(),values:{}};
      for(let i=0;i<localStorage.length;i++){let k=localStorage.key(i);if(k.startsWith("nitroarcade:")||k.startsWith("crazyarcade-"))data.values[k]=localStorage.getItem(k)}
      const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));
      a.download="nitroarcade-save.json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
  };

  let fps=60,frames=0,last=performance.now(),dbg=null;
  function perf(t){frames++;if(t-last>=1000){fps=Math.round(frames*1000/(t-last));frames=0;last=t}if(dbg)dbg.textContent=`NITRO DEBUG\nFPS: ${fps}\nGames: ${(window.gamesDatabase||[]).length}\nXP: ${N.xp.get()}  LVL: ${N.xp.level()}\nCoins: ${N.coins.get()}`;requestAnimationFrame(perf)}
  requestAnimationFrame(perf);
  N.debug=()=>{if(dbg){dbg.remove();dbg=null;return}dbg=document.createElement("pre");Object.assign(dbg.style,{position:"fixed",left:"8px",top:"8px",zIndex:100002,
    background:"#000e",color:"#5ff",padding:"10px",borderRadius:"8px",font:"12px monospace",pointerEvents:"none"});document.body.appendChild(dbg)};
  addEventListener("keydown",e=>{if(e.code==="F3"){e.preventDefault();N.debug()}});

  addEventListener("error",e=>{console.error("[NitroArcade]",e.error||e.message)});
  addEventListener("unhandledrejection",e=>console.error("[NitroArcade Promise]",e.reason));

  function hook(){
    if(typeof window.launchGame==="function"&&!window.launchGame.__nitroWrapped){
      const old=window.launchGame;
      const wrapped=function(game){
        if(game?.id){N.stats.inc("gamesPlayed");N.stats.inc("played:"+game.id);N.recent.add(game.id);N.xp.add(2,"play");}
        return old.apply(this,arguments);
      };
      wrapped.__nitroWrapped=true;window.launchGame=wrapped;
    }
  }
  hook();setTimeout(hook,0);setTimeout(hook,1000);

  N.dashboard=()=>{
    let old=document.getElementById("nitroPlatformDash");if(old){old.remove();return}
    const d=N.daily(),s=N.stats.all(),box=document.createElement("div");box.id="nitroPlatformDash";
    Object.assign(box.style,{position:"fixed",inset:"8% 12%",zIndex:100003,overflow:"auto",padding:"24px",border:"1px solid #ffffff33",
      borderRadius:"18px",background:"#070b16f5",color:"#fff",font:"14px system-ui",boxShadow:"0 20px 80px #000"});
    box.innerHTML=`<button id="npClose" style="float:right">✕</button><h1>⚡ NITROARCADE PLAYER HUB</h1>
      <p>Level <b>${N.xp.level()}</b> • ${N.xp.get()} XP • ${N.coins.get()} coins • ${s.gamesPlayed||0} games played</p>
      <hr style="border-color:#ffffff22"><h3>📅 DAILY CHALLENGE</h3>
      <p>${d?`Play <b>${d.game.name}</b> today.`:"Game library is still loading."}</p>
      <h3>🕹 RECENT</h3><p>${N.recent.all().slice(0,8).join(" • ")||"Nothing yet"}</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">
        <button id="npGlueExport" class="btn btn-primary">🧷 Export .nitrosave</button>
        <button id="npGlueImport" class="btn">📂 Import .nitrosave</button>
        <button id="npConfetti" class="btn">✨ Test Confetti</button>
      </div>
      <p style="opacity:.65;margin-top:20px">SHISO v2 • NitroArcade's native save package • Ctrl+Alt+N: hub • F3: debug panel</p>`;
    document.body.appendChild(box);box.querySelector("#npClose").onclick=()=>box.remove();
    box.querySelector("#npGlueExport").onclick=()=>nitroExportGlue();
    box.querySelector("#npGlueImport").onclick=()=>nitroImportGlue();
    box.querySelector("#npConfetti").onclick=()=>N.confetti(70);
  };
  addEventListener("keydown",e=>{if(e.ctrlKey&&e.altKey&&e.code==="KeyN"){e.preventDefault();N.dashboard()}});

  console.info("[NitroArcade] Platform Layer loaded");
})();
