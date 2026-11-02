(()=>{
'use strict';
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function allGames(){try{return typeof gamesDatabase!=='undefined'?gamesDatabase:[]}catch(e){return []}}
function launch(g){try{launchGame(g)}catch(e){console.warn('Game launch unavailable',e)}}
function boot(){
 if($('#nitroNeoButton'))return;
 const btn=document.createElement('button');btn.id='nitroNeoButton';btn.type='button';btn.textContent='⚡ GAME FINDER';btn.title='Open game finder (Ctrl+K)';document.body.appendChild(btn);
 const overlay=document.createElement('div');overlay.id='nitroNeoOverlay';overlay.hidden=true;overlay.innerHTML='<section id="nitroNeoPanel" role="dialog" aria-modal="true" aria-label="Nitro game finder"><header><strong>⚡ NITRO GAME FINDER</strong><button id="nitroNeoClose" type="button" aria-label="Close">✕</button></header><p>Find any game across every arcade section. Press Ctrl + K to open.</p><input id="nitroNeoSearch" placeholder="Search Angry Birds, Football, Mario..." autocomplete="off" aria-label="Search all games"><div id="nitroNeoResults"></div><footer>↑ ↓ Choose · Enter Play · Esc Close <span>PIXIE POWER SEARCH</span></footer></section>';document.body.appendChild(overlay);
 const inp=$('#nitroNeoSearch'),results=$('#nitroNeoResults');let found=[],chosen=0;
 function paint(){const q=inp.value.trim().toLowerCase();found=allGames().filter(g=>!q||String(g.name+' '+(g.desc||'')).toLowerCase().includes(q)).slice(0,30);chosen=0;draw()}
 function draw(){results.innerHTML=found.length?found.map((g,i)=>'<button class="nitroNeoResult '+(i===chosen?'selected':'')+'" data-index="'+i+'"><span>🎮 '+esc(g.name)+'</span><small>'+esc((g.desc||'').slice(0,100))+'</small></button>').join(''):'<p>No matching games. Try a shorter name.</p>';results.querySelectorAll('button').forEach(b=>b.onclick=()=>pick(Number(b.dataset.index)))}
 function pick(i){const g=found[i];if(!g)return;close();launch(g)}
 function open(){overlay.hidden=false;inp.value='';paint();inp.focus()}
 function close(){overlay.hidden=true}
 btn.onclick=open;$('#nitroNeoClose').onclick=close;overlay.addEventListener('click',e=>{if(e.target===overlay)close()});inp.oninput=paint;
 document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();overlay.hidden?open():close();return}if(overlay.hidden)return;if(e.key==='Escape'){close();return}if(e.key==='ArrowDown'){e.preventDefault();chosen=Math.min(found.length-1,chosen+1);draw()}if(e.key==='ArrowUp'){e.preventDefault();chosen=Math.max(0,chosen-1);draw()}if(e.key==='Enter'){e.preventDefault();pick(chosen)}});
 const search=$('#gameSearch');if(search){let switching=false;search.addEventListener('input',()=>{if(switching)return;const q=search.value.trim().toLowerCase();if(!q)return;const cards=[...document.querySelectorAll('#gameGrid .game-card')];const matching=cards.filter(c=>{const g=allGames().find(x=>x.id===c.dataset.gameId);return (g?.name+' '+g?.desc+' '+c.textContent).toLowerCase().includes(q)});const sections=[...new Set(matching.map(c=>c.dataset.arcadePart))];if(sections.length===1&&['small','big','challenge'].includes(sections[0])&&typeof currentArcadePart!=='undefined'&&currentArcadePart!==sections[0]){switching=true;try{showArcadePart(sections[0])}finally{switching=false}}},true)}
 const help=document.createElement('div');help.id='nitroNeoHelp';help.hidden=true;help.innerHTML='<strong>👾 Pixie & OmetoByte Tips</strong><p>⚡ Ctrl+K searches every game, even outside your current section.</p><p>⭐ Favorite games to find them faster.</p><p>🎮 Some web games need internet and may block iframe loading.</p><p>⌨️ Esc closes the game finder.</p><button type="button">Got it!</button>';document.body.appendChild(help);help.querySelector('button').onclick=()=>help.hidden=true;
 document.querySelectorAll('.nitro-mascot-float a').forEach((a,i)=>{a.title=i===0?'Pixie: arcade tips':'OmetoByte: open game finder';a.addEventListener('click',e=>{e.preventDefault();i===0?(help.hidden=!help.hidden):open()})});
 const banner=document.createElement('div');banner.id='nitroNeoBanner';banner.innerHTML='<span>✦ NITROARCADE <b>NEON UPDATE</b></span><span>🐦 Angry Birds · ⚽ Football · 🎮 250+ adventures</span><button type="button">⚡ FIND A GAME</button>';const grid=$('#gameGrid');if(grid&&grid.parentNode){grid.parentNode.insertBefore(banner,grid);banner.querySelector('button').onclick=open}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();