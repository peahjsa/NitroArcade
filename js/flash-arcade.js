(()=>{'use strict';
const games=[["Windosill", "games/windosill.swf", "swf"], ["Hexanaut", "https://hexanaut.io/", "web"], ["Plants vs. Zombies", "FlashGames/plants-vs-zombies.swf", "swf"], ["Red Ball 4", "FlashGames/redball4.swf", "swf"], ["Snoring", "FlashGames/snoring.swf", "swf"], ["The Impossible Quiz 2", "FlashGames/theimpossiblequiz2.swf", "swf"], ["Hungry Pumkin", "FlashGames/hungry-pumkin.swf", "swf"], ["Escaping the Prison", "FlashGames/Escaping The Prison.swf", "swf"], ["Papa’s Donuteria", "FlashGames/papas donuteria.swf", "swf"], ["Papa’s Donuteria (Alternate)", "FlashGames/papasdonuteria_102.swf", "swf"], ["Papa’s Pizzeria", "FlashGames/papaspizzeria_v2.swf", "swf"], ["Papa’s Wingeria", "FlashGames/papaswingeria_v2.swf", "swf"], ["Bad Piggies", "FlashGames/BadPiggies.swf", "swf"], ["Papa’s Hot Doggeria","FlashGames/papas-hot-doggeria.swf","swf"], ["Papa’s Freezeria","FlashGames/papas-freezeria.swf","swf"], ["Papa’s Cupcakeria","FlashGames/papas-cupcakeria.swf","swf"], ["Papa’s Sushiria","FlashGames/papas-sushiria.swf","swf"], ["Papa’s Pastaria","FlashGames/papas-pastaria.swf","swf"], ["Papa’s Burgeria","FlashGames/papas-burgeria.swf","swf"], ["Papa’s Taco Mia","FlashGames/papas-taco-mia.swf","swf"], ["Papa’s Pancakeria","FlashGames/papas-pancakeria.swf","swf"]];
const key='crazyarcade-secret-windosill';
function unlocked(){try{return localStorage.getItem(key)==='unlocked'}catch(e){return false}}
function refresh(){const b=document.getElementById('partFlash');if(!b)return;const ok=unlocked();b.textContent=ok?'⚡ Flash Games 🔓':'🔒 Flash Games';b.title=ok?'Hacker Challenge completed':'Beat Hacker Challenge to unlock';}
window.openFlashGame=function(i){if(!unlocked()){alert('Beat the Hacker Challenge first!');return}const g=games[i];if(!g)return;
 if(g[2]==='swf'){
  if(typeof cleanupPlayer==='function')cleanupPlayer();
  const view=document.getElementById('gameView'),dash=document.getElementById('dashboardView'),host=document.getElementById('playerContainer'),title=document.getElementById('activeGameTitle');
  if(!view||!host)return;
  if(dash)dash.style.display='none';view.style.display='flex';if(title)title.textContent='FLASH // '+g[0];
  if(typeof currentGame!=='undefined')currentGame={id:'flash_'+i,name:g[0],category:'secret',type:'swf'};
  host.replaceChildren();const status=document.createElement('p');status.textContent='Loading '+g[0]+' through Ruffle…';status.style.cssText='padding:25px;color:#eee';host.append(status);
  (async()=>{try{if(!window.RufflePlayer?.newest)throw Error('Ruffle is unavailable. Connect to the internet and reload.');const p=window.RufflePlayer.newest().createPlayer();p.config={allowScriptAccess:false,autoplay:'auto',menu:false};p.style.cssText='width:100%;height:100%;min-height:450px;display:block';if(typeof activeRufflePlayer!=='undefined')activeRufflePlayer=p;host.replaceChildren(p);const encoded=window.NITRO_FLASH_BYTES?.[g[1]];
    if(encoded){const bin=atob(encoded),data=new Uint8Array(bin.length);for(let k=0;k<bin.length;k++)data[k]=bin.charCodeAt(k);await p.load({data});}
    else {await p.load({url:g[1]});}}catch(e){host.replaceChildren();const m=document.createElement('p');m.style.cssText='padding:24px;color:#fff';m.textContent='Could not load '+g[0]+': '+(e.message||e);host.append(m)}})();
 }else{
  if(typeof cleanupPlayer==='function')cleanupPlayer();
  const view=document.getElementById('gameView'),dash=document.getElementById('dashboardView'),host=document.getElementById('playerContainer'),title=document.getElementById('activeGameTitle');if(!view||!host)return;
  if(dash)dash.style.display='none';view.style.display='flex';if(title)title.textContent='FLASH // '+g[0];
  if(typeof currentGame!=='undefined')currentGame={id:'flash_'+i,name:g[0],category:'secret',type:'iframe'};
  host.replaceChildren();const f=document.createElement('iframe');f.src=g[1];f.title=g[0];f.allow='fullscreen; autoplay; gamepad';f.allowFullscreen=true;f.referrerPolicy='no-referrer-when-downgrade';f.style.cssText='width:100%;height:100%;min-height:540px;border:0;background:#090b19';host.append(f);
 }
};
window.openFlashArcade=function(){refresh();if(!unlocked()){if(typeof showToast==='function')showToast('Beat the Hacker Challenge to unlock Flash Games!');else alert('Beat the Hacker Challenge first!');return}showArcadePart('flash')};
const oldShow=window.showArcadePart;
window.showArcadePart=function(part){if(part!=='flash'){document.getElementById('flashArcadeSection')?.style.setProperty('display','none');return oldShow(part)}if(!unlocked())return window.openFlashArcade();oldShow('challenge');const panel=document.getElementById('flashArcadeSection');if(panel)panel.style.display='block';const grid=document.getElementById('gameGrid');if(grid)grid.style.display='none';document.getElementById('partChallenge')?.classList.remove('active');document.getElementById('partFlash')?.classList.add('active');const title=document.getElementById('libraryPartTitle'),sub=document.getElementById('libraryPartSubtitle');if(title)title.textContent='Flash Games';if(sub)sub.textContent='Secret games unlocked by completing the Hacker Challenge';panel?.scrollIntoView({behavior:'smooth',block:'start'});};
window.addEventListener('storage',refresh);document.addEventListener('DOMContentLoaded',refresh);refresh();
})();