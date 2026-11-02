
(()=>{
'use strict';
const $=s=>document.querySelector(s);
const overlay=$('#nitroVaultOverlay');
const NETWORK_KEY='nitroarcade:secret-network-v1',ROOM_KEY='nitroarcade:prize-room-v1',CARD_KEY='nitroarcade:nitro-cards-v1';

const fallbackToys=[
{id:'rubber_duck',name:'Pixel Duck',icon:'🐤'},{id:'robot',name:'Pocket Bot',icon:'🤖'},{id:'ufo',name:'Mini UFO',icon:'🛸'},{id:'bear',name:'Arcade Bear',icon:'🐻'},
{id:'rocket',name:'Desk Rocket',icon:'🚀'},{id:'dino',name:'Neon Dino',icon:'🦖'},{id:'crystal',name:'Mystery Crystal',icon:'💎'},{id:'crown',name:'Arcade Crown',icon:'👑'}
];
const toyList=()=>typeof TOYS!=='undefined'?TOYS:fallbackToys;
const owned=()=>{try{return JSON.parse(localStorage.getItem(typeof TOY_KEY!=='undefined'?TOY_KEY:'crazyarcade-owned-toys')||'[]')}catch(e){return[]}};
const plays=()=>{try{return JSON.parse(localStorage.getItem('crazyarcade-play-counts')||'{}')}catch(e){return{}}};
const totalPlays=()=>Object.values(plays()).reduce((a,b)=>a+(Number(b)||0),0);
const hasPlayed=id=>(plays()[id]||0)>0;
const bigPlayTotal=()=>['ultra_voxel_frontier','ultra_stadium_strike','ultra_sky_pilot','ultra_brick_maze_90s','ultra_night_watch','enemies_and_you'].reduce((n,id)=>n+(plays()[id]||0),0);
const secretWindosill=()=>localStorage.getItem('crazyarcade-secret-windosill')==='unlocked';
const currentTheme=()=>localStorage.getItem('ultraarcade-theme')||localStorage.getItem('crazyarcade-theme')||'dark';
const safeRead=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(e){return f}};
const safeWrite=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const hue=s=>{let h=0;for(const ch of String(s))h=(h*31+ch.charCodeAt(0))>>>0;return h%360};
const toast=t=>typeof showToast==='function'?showToast(t):(window.NitroArcade?.notify?window.NitroArcade.notify(t,'NITRO VAULT'):console.log(t));
function rewardPrizes(n,reason){
 if(typeof awardPrizes==='function')return awardPrizes(n,reason);
 const k='crazyarcade-prizes',v=Math.max(0,parseInt(localStorage.getItem(k)||'0',10)||0)+n;localStorage.setItem(k,String(v));if(typeof updatePrizeCounter==='function')updatePrizeCounter();toast('🏆 +'+n+' prizes • '+reason)
}


const networkNodes=[
{id:'boot',title:'BOOT ECHO',condition:'Open the Secret Network.',signal:'NV://BOOT-READY',check:()=>true},
{id:'plays',title:'ARCADE TRACE',condition:'Reach 10 total game launches.',signal:'TRACE://10-PLAY-HANDSHAKE',check:()=>totalPlays()>=10},
{id:'hacker',title:'CHALLENGE PULSE',condition:'Launch Hacker Challenge at least once.',signal:'CHALLENGE://GREEN-PULSE',check:()=>hasPlayed('hackerchallenge')},
{id:'big',title:'LARGE SIGNAL',condition:'Launch Big Games at least 3 times total.',signal:'BIG://THREE-DOORS-OPEN',check:()=>bigPlayTotal()>=3},
{id:'theme',title:'MATRIX ECHO',condition:'Switch NitroArcade to the Matrix theme.',signal:'THEME://00FF66',check:()=>currentTheme()==='matrix'},
{id:'crystal',title:'CRYSTAL HANDSHAKE',condition:'Own the Mystery Crystal from the Prize Shop.',signal:'PRIZE://CRYSTAL-15',check:()=>owned().includes('crystal')},
{id:'windosill',title:'GREEN DOOR',condition:'Unlock the secret Windosill reward.',signal:'SECRET://WINDOW-IS-OPEN',check:()=>secretWindosill()}
];
function networkState(){const s=safeRead(NETWORK_KEY,{seen:[],final:false});if(!Array.isArray(s.seen))s.seen=[];return s}
function refreshNetwork(){
 const s=networkState();let newly=0;
 networkNodes.forEach(n=>{if(n.check()&&!s.seen.includes(n.id)){s.seen.push(n.id);newly++}});
 safeWrite(NETWORK_KEY,s);
 const grid=$('#nvNetworkGrid');grid.innerHTML='';
 networkNodes.forEach((n,i)=>{
  const unlocked=s.seen.includes(n.id),el=document.createElement('article');el.className='nv-node '+(unlocked?'complete':'locked');
  el.innerHTML='<div class="nv-num">NODE '+String(i+1).padStart(2,'0')+'</div><h3>'+n.title+'</h3><p>'+n.condition+'</p><span class="nv-condition">'+(unlocked?'SIGNAL RECOVERED':'SIGNAL LOCKED')+'</span>'+(unlocked?'<div class="nv-signal">'+n.signal+'</div>':'');
  grid.appendChild(el)
 });
 $('#nvNetworkCount').textContent=s.seen.length+' / '+networkNodes.length;
 const ready=s.seen.length===networkNodes.length,final=$('#nvNetworkFinal'),btn=$('#nvClaimFinal');
 final.classList.toggle('ready',ready);btn.disabled=!ready||s.final;btn.textContent=s.final?'ROOT SIGNAL CLAIMED':ready?'DECODE ROOT SIGNAL':'LOCKED';
 $('#nvFinalText').textContent=s.final?'ROOT://NITRO-VAULT-13 • Your Windosill Nitro Card was upgraded to FOIL.':ready?'All seven nodes agree. Decode the root transmission for a one-time reward.':'Recover every network signal to reveal the root transmission.';
 if(newly)toast(newly+' new Secret Network signal'+(newly===1?'':'s')+' recovered.');
}
function claimNetworkFinal(){
 const s=networkState();if(s.seen.length!==networkNodes.length||s.final)return;s.final=true;safeWrite(NETWORK_KEY,s);rewardPrizes(5,'Secret Network completed');const cs=cardState();cs.root=true;safeWrite(CARD_KEY,cs);refreshNetwork();renderCards();toast('ROOT SIGNAL DECODED: NITRO-VAULT-13')
}


let selectedToy=null,drag=null,zCounter=20;
function defaultRoom(){return{theme:'neon',items:{}}}
function roomState(){const s=safeRead(ROOM_KEY,defaultRoom());s.items=s.items||{};s.theme=s.theme||'neon';return s}
function roomSave(s){safeWrite(ROOM_KEY,s)}
function renderRoom(){
 const s=roomState(),room=$('#nvPrizeRoom');room.dataset.theme=s.theme;$('#nvRoomTheme').value=s.theme;
 const ids=owned();$('#nvOwnedToyCount').textContent=ids.length+' / '+toyList().length;
 room.querySelectorAll('.nv-toy-object').forEach(x=>x.remove());
 ids.forEach((id,i)=>{
  const toy=toyList().find(t=>t.id===id);if(!toy)return;
  if(!s.items[id])s.items[id]={x:10+(i%4)*21,y:30+Math.floor(i/4)*34,r:0,scale:1,z:i+1};
  const p=s.items[id],el=document.createElement('div');el.className='nv-toy-object'+(selectedToy===id?' selected':'');el.dataset.toy=id;
  el.style.left=p.x+'%';el.style.top=p.y+'%';el.style.transform='translate(-50%,-50%) rotate('+p.r+'deg) scale('+p.scale+')';el.style.zIndex=p.z||1;
  el.innerHTML=toy.art||toy.icon;el.title=toy.name;el.addEventListener('pointerdown',startDrag);room.appendChild(el)
 });
 roomSave(s);renderRoomInventory();updateSelectedToy()
}
function renderRoomInventory(){
 const box=$('#nvRoomInventory'),ids=owned();box.innerHTML='';
 toyList().forEach(t=>{
  const has=ids.includes(t.id),el=document.createElement('div');el.className='nv-inv-item'+(has?'':' locked');
  el.innerHTML='<div class="nv-inv-icon">'+(t.icon||'◆')+'</div><div><b>'+t.name+'</b><span>'+(has?'OWNED • click to select':'LOCKED • buy in Prize Shop')+'</span></div>';
  if(has)el.onclick=()=>{selectedToy=t.id;renderRoom()};box.appendChild(el)
 })
}
function startDrag(e){
 e.preventDefault();selectedToy=e.currentTarget.dataset.toy;const room=$('#nvPrizeRoom'),r=room.getBoundingClientRect();drag={room,r,id:selectedToy};e.currentTarget.setPointerCapture?.(e.pointerId);document.addEventListener('pointermove',moveDrag);document.addEventListener('pointerup',endDrag,{once:true});
 room.querySelectorAll('.nv-toy-object').forEach(el=>el.classList.toggle('selected',el.dataset.toy===selectedToy));updateSelectedToy()
}
function moveDrag(e){
 if(!drag)return;const s=roomState(),p=s.items[drag.id]||{};p.x=Math.max(4,Math.min(96,(e.clientX-drag.r.left)/drag.r.width*100));p.y=Math.max(8,Math.min(93,(e.clientY-drag.r.top)/drag.r.height*100));p.z=++zCounter;s.items[drag.id]=p;roomSave(s);
 const el=drag.room.querySelector('[data-toy="'+drag.id+'"]');if(el){el.style.left=p.x+'%';el.style.top=p.y+'%';el.style.zIndex=p.z}
}
function endDrag(){document.removeEventListener('pointermove',moveDrag);drag=null;updateSelectedToy()}
function updateSelectedToy(){const toy=toyList().find(t=>t.id===selectedToy);$('#nvSelectedToyText').textContent=toy?'Editing '+toy.name+'. Drag it in the room or use the controls below.':'Select a placed toy to edit it.'}
function editToy(action){
 if(!selectedToy)return toast('Select a toy first.');const s=roomState(),p=s.items[selectedToy];if(!p)return;
 if(action==='left')p.r=(p.r||0)-15;if(action==='right')p.r=(p.r||0)+15;if(action==='smaller')p.scale=Math.max(.45,(p.scale||1)-.1);if(action==='bigger')p.scale=Math.min(1.8,(p.scale||1)+.1);if(action==='front')p.z=++zCounter;if(action==='remove'){delete s.items[selectedToy];selectedToy=null}
 roomSave(s);renderRoom()
}
function autoArrange(){
 const s=roomState(),ids=owned(),spots=[[18,28],[34,28],[66,41],[82,41],[38,70],[50,70],[62,70],[50,87]];
 ids.forEach((id,i)=>s.items[id]={x:spots[i%spots.length][0],y:spots[i%spots.length][1],r:0,scale:1,z:i+1});roomSave(s);renderRoom();toast('Prize Room auto-arranged.')
}
function resetRoom(){if(!confirm('Reset your Prize Room layout?'))return;safeWrite(ROOM_KEY,defaultRoom());selectedToy=null;renderRoom();toast('Prize Room reset.')}


const cardDefs=[
{id:'g_hacker',type:'game',name:'Hacker Challenge',icon:'⌨️',rarity:'RARE',desc:'The challenge that hides a second game behind three completed trials.',unlock:'Play Hacker Challenge.',check:()=>hasPlayed('hackerchallenge'),foil:()=>plays().hackerchallenge>=5,atk:74,skill:92},
{id:'g_voxel',type:'game',name:'Voxel Frontier',icon:'⛏️',rarity:'EPIC',desc:'A blocky expedition of landmarks, relics, trails, caves and discoveries.',unlock:'Play Voxel Frontier.',check:()=>hasPlayed('ultra_voxel_frontier'),foil:()=>plays().ultra_voxel_frontier>=5,atk:82,skill:88},
{id:'g_sky',type:'game',name:'Sky Pilot',icon:'✈️',rarity:'RARE',desc:'Airport flight missions, rings, drones and a landing challenge.',unlock:'Play Sky Pilot.',check:()=>hasPlayed('ultra_sky_pilot'),foil:()=>plays().ultra_sky_pilot>=5,atk:79,skill:90},
{id:'g_maze',type:'game',name:'Brick Maze 95',icon:'🧱',rarity:'RARE',desc:'A procedural 90s brick labyrinth with souvenirs, enemies and an exit race.',unlock:'Play Brick Maze 95.',check:()=>hasPlayed('ultra_brick_maze_90s'),foil:()=>plays().ultra_brick_maze_90s>=5,atk:70,skill:94},
{id:'g_night',type:'game',name:'Night Watch',icon:'📹',rarity:'EPIC',desc:'Camera management, roaming mascots, doors, lights and limited power.',unlock:'Play Night Watch.',check:()=>hasPlayed('ultra_night_watch'),foil:()=>plays().ultra_night_watch>=5,atk:88,skill:86},
{id:'g_eay',type:'game',name:'Enemies and You',icon:'⚡',rarity:'EPIC',desc:'Twenty enemy powers, bosses and upgrades in one of NitroArcade’s largest combat games.',unlock:'Play Enemies and You.',check:()=>hasPlayed('enemies_and_you'),foil:()=>plays().enemies_and_you>=5,atk:96,skill:84},
{id:'g_tech',type:'game',name:'Tech Quiz',icon:'🧠',rarity:'UNCOMMON',desc:'Computers, AI, web, hardware and cybersecurity knowledge in a quick quiz.',unlock:'Play Tech Quiz.',check:()=>hasPlayed('nitro_tech_quiz'),foil:()=>plays().nitro_tech_quiz>=5,atk:58,skill:99},
{id:'g_snake',type:'game',name:'Crazy Snake',icon:'🐍',rarity:'COMMON',desc:'Classic growing-snake pressure inside NitroArcade’s Small Games library.',unlock:'Play Crazy Snake.',check:()=>hasPlayed('crazysnake'),foil:()=>plays().crazysnake>=5,atk:61,skill:76},
{id:'g_brick',type:'game',name:'Brick Breaker',icon:'🟦',rarity:'COMMON',desc:'Paddle angles, rebounds and a wall of bricks.',unlock:'Play Brick Breaker.',check:()=>hasPlayed('brickbreaker'),foil:()=>plays().brickbreaker>=5,atk:65,skill:72},

{id:'t_duck',type:'toy',name:'Pixel Duck',icon:'🐤',rarity:'COMMON',desc:'The smallest prize-room resident and an arcade desk classic.',unlock:'Own Pixel Duck.',check:()=>owned().includes('rubber_duck'),foil:()=>owned().includes('rubber_duck')&&totalPlays()>=20,atk:42,skill:81},
{id:'t_bot',type:'toy',name:'Pocket Bot',icon:'🤖',rarity:'UNCOMMON',desc:'Compact robot prize with suspiciously serious arcade energy.',unlock:'Own Pocket Bot.',check:()=>owned().includes('robot'),foil:()=>owned().includes('robot')&&totalPlays()>=25,atk:71,skill:83},
{id:'t_ufo',type:'toy',name:'Mini UFO',icon:'🛸',rarity:'RARE',desc:'A tiny spacecraft from somewhere that the Prize Shop refuses to explain.',unlock:'Own Mini UFO.',check:()=>owned().includes('ufo'),foil:()=>owned().includes('ufo')&&totalPlays()>=30,atk:77,skill:88},
{id:'t_bear',type:'toy',name:'Arcade Bear',icon:'🐻',rarity:'RARE',desc:'Soft collectible. Extremely serious expression.',unlock:'Own Arcade Bear.',check:()=>owned().includes('bear'),foil:()=>owned().includes('bear')&&totalPlays()>=35,atk:68,skill:74},
{id:'t_rocket',type:'toy',name:'Desk Rocket',icon:'🚀',rarity:'RARE',desc:'Built for imaginary launches from the Prize Room desk.',unlock:'Own Desk Rocket.',check:()=>owned().includes('rocket'),foil:()=>owned().includes('rocket')&&totalPlays()>=40,atk:89,skill:79},
{id:'t_dino',type:'toy',name:'Neon Dino',icon:'🦖',rarity:'EPIC',desc:'A prehistoric prize-counter legend with maximum shelf presence.',unlock:'Own Neon Dino.',check:()=>owned().includes('dino'),foil:()=>owned().includes('dino')&&totalPlays()>=45,atk:91,skill:72},
{id:'t_crystal',type:'toy',name:'Mystery Crystal',icon:'💎',rarity:'EPIC',desc:'The crystal that also activates a Secret Network handshake.',unlock:'Own Mystery Crystal.',check:()=>owned().includes('crystal'),foil:()=>owned().includes('crystal')&&networkState().seen.includes('crystal'),atk:84,skill:96},
{id:'t_crown',type:'toy',name:'Arcade Crown',icon:'👑',rarity:'LEGENDARY',desc:'The final Prize Shop shelf flex.',unlock:'Own Arcade Crown.',check:()=>owned().includes('crown'),foil:()=>owned().includes('crown')&&owned().length===toyList().length,atk:98,skill:93},
{id:'s_wind',type:'secret',name:'Windosill',icon:'🪟',rarity:'LEGENDARY',desc:'The hidden reward behind Hacker Challenge.',unlock:'Unlock Windosill.',check:()=>secretWindosill(),foil:()=>networkState().final,atk:100,skill:100}
];
function cardState(){const s=safeRead(CARD_KEY,{seen:[],root:false,allReward:false});if(!Array.isArray(s.seen))s.seen=[];return s}
let cardFilter='all';
function renderCards(){
 const s=cardState();let changed=false;
 cardDefs.forEach(card=>{if(card.check()&&!s.seen.includes(card.id)){s.seen.push(card.id);changed=true}});
 if(changed)safeWrite(CARD_KEY,s);
 const unlockedCount=cardDefs.filter(x=>s.seen.includes(x.id)).length;$('#nvCardCount').textContent=unlockedCount+' / '+cardDefs.length;$('#nvCardProgress').style.width=(unlockedCount/cardDefs.length*100)+'%';
 if(unlockedCount===cardDefs.length&&!s.allReward){s.allReward=true;safeWrite(CARD_KEY,s);rewardPrizes(3,'Nitro Cards collection complete');toast('FULL NITRO CARD COLLECTION COMPLETE!')}
 const grid=$('#nvCardGrid');grid.innerHTML='';
 cardDefs.filter(card=>cardFilter==='all'||cardFilter===card.type||(cardFilter==='unlocked'&&s.seen.includes(card.id))).forEach(card=>{
  const unlocked=s.seen.includes(card.id),foil=unlocked&&card.foil(),h=hue(card.id),el=document.createElement('article');el.className='nv-collect-card '+(unlocked?'unlocked ':'')+(foil?'nv-foil':'');el.style.setProperty('--h',h);
  el.innerHTML='<div class="nv-card-inner"><div class="nv-card-face"><div class="nv-card-art">'+(unlocked?card.icon:'◆')+'</div><div class="nv-card-info"><div class="nv-card-rarity">'+card.rarity+' // '+card.type.toUpperCase()+'</div><h3>'+(unlocked?card.name:'LOCKED CARD')+'</h3><p>'+(unlocked?card.desc:card.unlock)+'</p></div><div class="nv-card-lock">🔒</div></div><div class="nv-card-face nv-card-back"><div class="nv-card-rarity">'+card.rarity+'</div><h3>'+card.name+'</h3><p>'+card.desc+'</p><p><b>UNLOCK:</b> '+card.unlock+'</p><div class="nv-card-stat"><span>POWER <b>'+card.atk+'</b></span><span>SKILL <b>'+card.skill+'</b></span><span>FOIL <b>'+(foil?'YES':'NO')+'</b></span><span>TYPE <b>'+card.type.toUpperCase()+'</b></span></div></div></div>';
  if(unlocked)el.onclick=()=>el.classList.toggle('flipped');grid.appendChild(el)
 });
}


function showPage(name){
 document.querySelectorAll('.nv-tab').forEach(b=>b.classList.toggle('active',b.dataset.nvtab===name));document.querySelectorAll('.nv-page').forEach(p=>p.classList.remove('active'));$('#nvPage'+name[0].toUpperCase()+name.slice(1)).classList.add('active');
 if(name==='network')refreshNetwork();if(name==='room')renderRoom();if(name==='cards')renderCards()
}
function open(page='network'){overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';showPage(page)}
function close(){overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');document.body.style.overflow=''}
window.NitroVault={open,close,refresh:()=>{refreshNetwork();renderRoom();renderCards()}};

document.querySelectorAll('.nv-tab').forEach(b=>b.onclick=()=>showPage(b.dataset.nvtab));$('#nvClose').onclick=close;$('#nvClaimFinal').onclick=claimNetworkFinal;
$('#nvRoomTheme').onchange=()=>{const s=roomState();s.theme=$('#nvRoomTheme').value;roomSave(s);renderRoom()};
$('#nvRoomSave').onclick=()=>{roomSave(roomState());toast('Prize Room layout saved.')};$('#nvRoomAuto').onclick=autoArrange;$('#nvRoomReset').onclick=resetRoom;
document.querySelectorAll('[data-nvaction]').forEach(b=>b.onclick=()=>editToy(b.dataset.nvaction));
document.querySelectorAll('[data-nvfilter]').forEach(b=>b.onclick=()=>{cardFilter=b.dataset.nvfilter;document.querySelectorAll('[data-nvfilter]').forEach(x=>x.classList.toggle('active',x===b));renderCards()});
window.addEventListener('keydown',e=>{if(overlay.classList.contains('open')&&e.key==='Escape')close()});

document.addEventListener('click',e=>{
 if(e.target?.id==='prizeShopBtn'||e.target?.closest?.('#prizeShopBtn'))setTimeout(()=>{renderRoom();renderCards();refreshNetwork()},50)
});
setInterval(()=>{if(overlay.classList.contains('open')){refreshNetwork();renderCards()}},2500);
})();
