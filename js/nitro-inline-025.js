
(function(){
const KEY='nitroarcade-game-colors-v1';
const $=id=>document.getElementById(id);
const palette=['#a54cff','#e34fd8','#58b9ff','#32e5cc','#5ee585','#f2cd54','#ff9355','#ff567e','#ffffff','#6d83ff','#7d49e3','#a1d4ff'];
let chosen=null,selected='#a54cff',tint=false;
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){return {}}}
function store(data){try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){}}
function valid(c){return /^#[a-f0-9]{6}$/i.test(c||'')}
function apply(){
 const all=load();
 document.querySelectorAll('.game-card[data-game-id]').forEach(card=>{
  const id=card.dataset.gameId;
  const value=all[id];
  const c=value&&valid(value.color)?value.color:'#a54cff';
  card.style.setProperty('--gameTint',c);
  let button=card.querySelector('.nxGameColorButton');
  if(!button){button=document.createElement('button');button.type='button';button.className='nxGameColorButton';button.textContent='🎨 COLOR';button.title='Customize this game’s color';button.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();open(id)});card.appendChild(button)}
 });
 const active=window.currentGame?.id||window.activeGame?.id||null;
 if(active)applyPlayer(active);
}
function applyPlayer(id){
 const host=document.getElementById('playerContainer')||document.querySelector('.player-wrap');
 if(!host)return;
 const value=load()[id];
 host.style.filter=value?.tint&&valid(value.color)?'hue-rotate('+hue(value.color)+'deg) saturate(1.22)':'';
}
function hue(hex){const r=parseInt(hex.slice(1,3),16)/255,g=parseInt(hex.slice(3,5),16)/255,b=parseInt(hex.slice(5,7),16)/255;const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;let h=0;if(d){if(max===r)h=((g-b)/d)%6;else if(max===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60}return Math.round((h+360)%360)-275}
function open(id){
 chosen=id;const data=load()[id]||{};selected=valid(data.color)?data.color:'#a54cff';tint=!!data.tint;
 const card=[...document.querySelectorAll('.game-card[data-game-id]')].find(x=>x.dataset.gameId===id);
 $('nxColorPreview').textContent=card?.querySelector('h3')?.textContent?.trim()||id;
 $('nxCustomGameColor').value=selected;$('nxTintGameplay').checked=tint;preview();$('nxColorOverlay').classList.add('open')
}
function preview(){$('nxColorPreview').style.setProperty('--nxPreviewColor',selected)}
function close(){$('nxColorOverlay').classList.remove('open');chosen=null}
$('nxColorSwatches').replaceChildren();
palette.forEach(c=>{const b=document.createElement('button');b.type='button';b.className='nxSwatch';b.style.background=c;b.title=c;b.setAttribute('aria-label','Choose '+c);b.onclick=()=>{selected=c;$('nxCustomGameColor').value=c;preview()};$('nxColorSwatches').appendChild(b)});
$('nxCustomGameColor').oninput=e=>{selected=e.target.value;preview()};
$('nxColorSave').onclick=()=>{if(!chosen)return;const data=load();data[chosen]={color:selected,tint:$('nxTintGameplay').checked};store(data);apply();close()};
$('nxColorReset').onclick=()=>{if(!chosen)return;const data=load();delete data[chosen];store(data);apply();close()};
$('nxColorClose').onclick=$('nxColorCancel').onclick=close;
$('nxColorOverlay').onclick=e=>{if(e.target===$('nxColorOverlay'))close()};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('nxColorOverlay').classList.contains('open'))close()});
window.NitroGameColors={refresh:apply,open};
const obs=new MutationObserver(()=>{clearTimeout(obs.timer);obs.timer=setTimeout(apply,100)});
const grid=document.getElementById('gameGrid');if(grid)obs.observe(grid,{childList:true});
setTimeout(apply,350);setTimeout(apply,1800);
if(typeof window.launchGame==='function'){
 const originalLaunch=window.launchGame;
 window.launchGame=function(game,...args){
   const result=originalLaunch.call(this,game,...args);
   if(game?.id)setTimeout(()=>applyPlayer(game.id),80);
   return result;
 };
}

})();
