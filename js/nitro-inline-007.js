

(()=>{
 const N=window.NitroArcade=window.NitroArcade||{}; if(N.__integrationV2)return; N.__integrationV2=true;
 const id=()=>{try{return typeof currentGame!=="undefined"&&currentGame?.id?currentGame.id:(window.currentGame?.id||"unknown")}catch{return window.currentGame?.id||"unknown"}}, name=()=>{try{return typeof currentGame!=="undefined"&&currentGame?.name?currentGame.name:(window.currentGame?.name||id())}catch{return window.currentGame?.name||id()}};
 if(!N.achievements)N.achievements={unlock(i,t=i,d=""){let a=N.save?.get?.("achievements",[])||[];if(a.includes(i))return false;a.push(i);N.save?.set?.("achievements",a);N.notify?.(d||t,"🏆 "+t);return true},all:()=>N.save?.get?.("achievements",[])||[]};
 if(!N.missions){const defs={play3:{goal:3,text:"Play 3 games"},win1:{goal:1,text:"Win a game"}};N.missions={progress(i,n=1){let p=N.save?.get?.("missions",{})||{};p[i]=Math.min(defs[i]?.goal||999,(p[i]||0)+n);N.save?.set?.("missions",p);if(defs[i]&&p[i]===defs[i].goal)N.notify?.(defs[i].text,"✅ MISSION COMPLETE");return p[i]},all:()=>N.save?.get?.("missions",{})||{}}}
 N.game={
   score(points=0){points=Number(points)||0;N.stats?.inc?.("scoreTotal",Math.max(0,points));N.emit?.("gamescore",{id:id(),points});return points},
   win(score=0,o={}){let gid=o.id||id(),gn=o.name||name();N.stats?.inc?.("wins");N.stats?.inc?.("wins:"+gid);N.xp?.add?.(o.xp??50,"Won "+gn);N.coins?.add?.(o.coins??3);N.scores?.submit?.(gid,score);N.confetti?.(70);N.flash?.("#b9ffcf");N.sfx?.(784,.12);N.achievements.unlock("first-win","FIRST VICTORY","Win a NitroArcade game");N.missions.progress("win1");N.notify?.(`${gn} completed! +${o.xp??50} XP • +${o.coins??3} coins`,"🏆 VICTORY");N.emit?.("gamewin",{id:gid,score})},
   lose(){N.stats?.inc?.("losses");N.shake?.(document.body,5,180);N.sfx?.(150,.12);N.emit?.("gamelose",{id:id()})}
 };
 function wireLaunch(){let f=window.launchGame;if(typeof f!=="function"||f.__nitroV2)return;let w=function(g){let r=f.apply(this,arguments);if(g?.id){N.emit?.("gameopen",{id:g.id,name:g.name,engine:g.engine});let u=N.save?.get?.("uniqueGames",[])||[];if(!u.includes(g.id)){u.push(g.id);N.save?.set?.("uniqueGames",u)}N.missions.progress("play3");if(u.length>=5)N.achievements.unlock("explorer-5","ARCADE EXPLORER","Play 5 different games");}return r};w.__nitroV2=true;window.launchGame=w}
 function wireSecret(){let f=window.unlockWindosill;if(typeof f!=="function"||f.__nitroV2)return;let w=function(){let r=f.apply(this,arguments);if(!N.save?.get?.("rewarded:windosill",false)){N.save?.set?.("rewarded:windosill",true);N.xp?.add?.(150,"Hacker Challenge");N.coins?.add?.(10);N.achievements.unlock("hacker-master","ACCESS GRANTED","Clear all five Hacker Challenge trials");N.confetti?.(120);N.notify?.("Windosill unlocked • +150 XP • +10 coins","🔐 SECRET FOUND")}return r};w.__nitroV2=true;window.unlockWindosill=w}
 function hubButton(){if(document.getElementById("nitroHubButton"))return;let b=document.createElement("button");b.id="nitroHubButton";b.textContent="⚡ PLAYER HUB";Object.assign(b.style,{position:"fixed",right:"18px",bottom:"72px",zIndex:99990,padding:"11px 14px",border:"1px solid #ffffff55",borderRadius:"12px",background:"linear-gradient(110deg,#18d5ff,#7457ff)",color:"#fff",font:"900 11px system-ui",cursor:"pointer",boxShadow:"0 8px 28px #0008"});b.onclick=()=>N.dashboard?.();document.body.appendChild(b)}
 wireLaunch();wireSecret();setTimeout(()=>{wireLaunch();wireSecret()},800);
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",hubButton);else hubButton();
 console.info("[NitroArcade] Gameplay Integration v2 ready");
})();
