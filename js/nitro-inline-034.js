
const NitroDevPortal=(()=>{
const key='nitroarcade-dev-games-v1';
const saved=()=>{try{return JSON.parse(localStorage.getItem(key)||'[]')}catch(e){return []}};
function safeURL(v){try{const u=new URL(v);return ['https:','http:'].includes(u.protocol)?u.href:null}catch(e){return null}}
function add(entry,persist){if(!entry||!safeURL(entry.url)||!entry.name)return false;
const id='dev_'+String(entry.id||Date.now());if(gamesDatabase.some(g=>g.id===id))return false;
const g={id,name:String(entry.name).slice(0,70),category:'arcade',type:'iframe',source:safeURL(entry.url),desc:String(entry.desc||'Community browser game').slice(0,180)};
gamesDatabase.push(g);const card=document.createElement('article');card.className='game-card';card.dataset.gameId=id;card.dataset.arcadePart='big';card.style.display='none';card.onclick=()=>launchGame(g);
const thumb=document.createElement('div');thumb.className='thumb';thumb.style.cssText='display:grid;place-items:center;background:radial-gradient(circle,#392063,#060816);min-height:190px';const symbol=document.createElement('span');symbol.textContent='🕹️';symbol.style.fontSize='80px';thumb.appendChild(symbol);
const meta=document.createElement('div');meta.className='game-meta';const inner=document.createElement('div');const h=document.createElement('h3');h.textContent=g.name;const d=document.createElement('p');d.textContent=g.desc;inner.append(h,d);const tag=document.createElement('div');tag.className='tag';tag.textContent='YOUR GAME';meta.append(inner,tag);card.append(thumb,meta);document.getElementById('gameGrid').appendChild(card);
if(persist){const list=saved();list.push({id:id.slice(4),name:g.name,url:g.source,desc:g.desc});localStorage.setItem(key,JSON.stringify(list))}updateCount();return true}
function updateCount(){const cards=document.querySelectorAll('#gameGrid .game-card');const unique=new Set([...cards].map(c=>c.dataset.gameId).filter(Boolean));const macro=document.querySelectorAll('#nmWorldGrid .nmWorldCard').length;const total=unique.size+macro;const count=document.getElementById('nitroTotalGames');if(count)count.textContent=total+' playable game entries';const sub=document.getElementById('nitroGameBreakdown');if(sub)sub.textContent=unique.size+' Small / Big / Challenge entries + '+macro+' MacroArcade games. Really Cool Games is a separate full-screen arcade portal, not counted as one individual game.';}
function open(){document.getElementById('nitroDevOverlay').style.display='flex';document.getElementById('nitroDevName').focus()}
function close(){document.getElementById('nitroDevOverlay').style.display='none'}
function exportGames(){const blob=new Blob([JSON.stringify(saved(),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='nitroarcade-my-games.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
document.getElementById('nitroDevForm').addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('nitroDevName').value.trim(),url=document.getElementById('nitroDevUrl').value.trim(),desc=document.getElementById('nitroDevDesc').value.trim();const ok=add({name,url,desc},true);document.getElementById('nitroDevMessage').textContent=ok?'Added! Open Playground → Big Games to play it.':'Could not add that URL.';if(ok)e.target.reset()});
document.getElementById('nitroDevOverlay').addEventListener('click',e=>{if(e.target.id==='nitroDevOverlay')close()});
saved().forEach(x=>add(x,false));updateCount();return {open,close,exportGames,updateCount};})();
