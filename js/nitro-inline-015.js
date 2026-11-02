
(()=>{
'use strict';

const $=s=>document.querySelector(s);
const overlay=$('#ngsOverlay'),canvas=$('#ngsCanvas'),g=canvas.getContext('2d');
const spriteCanvas=$('#ngsSpriteCanvas'),sg=spriteCanvas.getContext('2d');
const W=24,H=14,S=40,STORE='nitroarcade:user-games:v2',DRAFT='nitroarcade:studio-draft:v2',FORMAT='NITROGAME2';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),pick=a=>a[Math.floor(Math.random()*a.length)];

const FEATURES=[
'Platformer template','Maze Quest template','Survival Dodge template','24×14 level grid','Brush tool','Rectangle tool','Flood-fill tool','Eyedropper tool',
'Undo history','Redo history','Right-click erase','Drag painting','Start tile','Goal tile','Solid blocks','Hazard tiles','Coins','Enemy A','Enemy B','Turrets',
'Bounce pads','Checkpoints','Keys','Locked doors','Portal A','Portal B','Health pickups','Slow zones','Decoration tiles','Custom background color','Custom grid color',
'Custom block color','Custom accent color','Custom player color','Custom Enemy A color','Custom Enemy B color','Custom hazard color','Custom coin color','Custom goal color',
'Neon theme','Sunset theme','Matrix theme','Ice theme','Candy theme','Custom-color theme','16×16 player sprite editor','16×16 Enemy A sprite editor',
'16×16 Enemy B sprite editor','16×16 turret sprite editor','Pixel pencil','Pixel eraser','Pixel flood fill','Sprite mirror X','Sprite mirror Y','Sprite presets',
'Sprite palette','NitroScript for Enemy A','NitroScript for Enemy B','NitroScript for Turrets','CHASE behavior','PATROL behavior','WANDER behavior','FLEE behavior',
'SENTRY behavior','ORBIT behavior','Custom enemy speed','Custom detection range','Custom fire interval','Custom projectile speed','Projectile burst count',
'Custom contact damage','Enemy teleport interval','Projectile spread','Safe script compiler','Script presets','Script validation','Keyboard play controls',
'Physical-key input handling','Arrow-key input handling','On-screen virtual controls','Canvas focus lock','Play-test HP','Play-test lives','Invulnerability frames',
'Coin collection','Checkpoint respawn','Key collection','Door unlocking','Portal teleportation','Healing pickups','Slow zones','Bounce physics','Enemy projectiles',
'Turret projectiles','Custom gravity','Custom jump power','Custom player speed','Custom timer','Three win rules','Live play-test HUD','Game-over state',
'Win state','Procedural level generator','Build validator','Start-count validation','Goal validation','Portal-pair validation','Reachability estimate',
'Complexity score','Local creation library','Mini level thumbnails','Duplicate saved game','Delete saved game','Autosave draft','Unsaved-change indicator',
'Share code','Share URL','Auto-import share URL','.nitrogame export','.nitrogame import','PNG level export','Game description','Saved custom colors',
'Saved custom sprites','Saved NitroScripts','Sandboxed JavaScript editor','Worker-isolated JavaScript runtime','JavaScript onStart event','JavaScript onTick event','JavaScript onCoin event','JavaScript onDamage event','JavaScript onWin event','JavaScript game API','Shared JavaScript code','Backward import normalization','Maximum 24 saved creations','Feature counter','Engine-function counter'
];

const tileDefs=[
{id:0,name:'Erase',icon:'⌫',hint:'Remove tile'},
{id:1,name:'Block',icon:'■',hint:'Solid terrain'},
{id:2,name:'Start',icon:'◆',hint:'Player spawn'},
{id:3,name:'Goal',icon:'⚑',hint:'Finish point'},
{id:4,name:'Hazard',icon:'▲',hint:'Deals damage'},
{id:5,name:'Coin',icon:'●',hint:'Collectible'},
{id:6,name:'Enemy A',icon:'A',hint:'Scripted character'},
{id:17,name:'Enemy B',icon:'B',hint:'Second character'},
{id:8,name:'Turret',icon:'✦',hint:'Scripted shooter'},
{id:7,name:'Bounce',icon:'↥',hint:'Launch pad'},
{id:9,name:'Checkpoint',icon:'◇',hint:'Respawn point'},
{id:10,name:'Key',icon:'⚿',hint:'Unlocks door'},
{id:11,name:'Door',icon:'▥',hint:'Needs a key'},
{id:12,name:'Portal A',icon:'A↻',hint:'Teleporter entrance'},
{id:13,name:'Portal B',icon:'B↻',hint:'Teleporter exit'},
{id:14,name:'Heal',icon:'+',hint:'Restore health'},
{id:15,name:'Slow',icon:'≈',hint:'Slows player'},
{id:16,name:'Decor',icon:'✧',hint:'Non-solid detail'}
];

const themes={
neon:{bg:'#071019',grid:'#122638',block:'#38546a',accent:'#69e8ff',player:'#eafaff',enemyA:'#b48cff',enemyB:'#ff83b7',hazard:'#ff6178',coin:'#ffd66b',goal:'#7cefa5'},
sunset:{bg:'#21131b',grid:'#3b2029',block:'#704353',accent:'#ff8c68',player:'#fff1dc',enemyA:'#ffb05f',enemyB:'#ff6f9b',hazard:'#ff5e70',coin:'#ffd36b',goal:'#8cf0b0'},
matrix:{bg:'#06100a',grid:'#102a19',block:'#1d5032',accent:'#6dff9b',player:'#dffff0',enemyA:'#9cff69',enemyB:'#4cdba4',hazard:'#ff6178',coin:'#d7ff6b',goal:'#6dff9b'},
ice:{bg:'#0a1620',grid:'#173044',block:'#2f617c',accent:'#9beaff',player:'#effcff',enemyA:'#9bbcff',enemyB:'#c9a9ff',hazard:'#ff7188',coin:'#fff1a6',goal:'#a2ffd2'},
candy:{bg:'#211423',grid:'#3a203e',block:'#704f79',accent:'#ff86c8',player:'#fff1fb',enemyA:'#a892ff',enemyB:'#ff80ab',hazard:'#ff5e78',coin:'#ffe36f',goal:'#7ff0c1'}
};

const colorFields=[
['bg','Background'],['grid','Grid'],['block','Block'],['accent','Accent'],['player','Player'],['enemyA','Enemy A'],['enemyB','Enemy B'],['hazard','Hazard'],['coin','Coin'],['goal','Goal']
];

const scriptDefaults={
enemyA:'# Enemy A\nMODE CHASE\nSPEED 85\nRANGE 360\nSHOOT 1.8\nPROJECTILE_SPEED 240\nBURST 1\nCONTACT 22\nTELEPORT 0\nSPREAD 0',
enemyB:'# Enemy B\nMODE PATROL\nSPEED 105\nRANGE 300\nSHOOT 0\nPROJECTILE_SPEED 230\nBURST 1\nCONTACT 28\nTELEPORT 0\nSPREAD 0',
turret:'# Turret\nMODE SENTRY\nSPEED 0\nRANGE 500\nSHOOT 1.4\nPROJECTILE_SPEED 260\nBURST 1\nCONTACT 0\nTELEPORT 0\nSPREAD 0'
};

const jsDefault=`// NitroJS example
Nitro.onStart(() => {
  Nitro.say("My custom JavaScript is running!");
  Nitro.enemyA.speed(120);
});

Nitro.onCoin(e => {
  if (e.coins >= 3) Nitro.player.speed(1.35);
});

Nitro.onDamage(e => {
  if (e.hp < 40) Nitro.player.jump(640);
});

Nitro.onTick(e => {
});
`;

const scriptPresets={
chaser:'MODE CHASE\nSPEED 110\nRANGE 420\nSHOOT 1.6\nPROJECTILE_SPEED 250\nBURST 1\nCONTACT 25\nTELEPORT 0\nSPREAD 0',
patrol:'MODE PATROL\nSPEED 90\nRANGE 260\nSHOOT 2.2\nPROJECTILE_SPEED 220\nBURST 1\nCONTACT 20\nTELEPORT 0\nSPREAD 0',
sniper:'MODE SENTRY\nSPEED 0\nRANGE 650\nSHOOT 1.1\nPROJECTILE_SPEED 360\nBURST 1\nCONTACT 12\nTELEPORT 0\nSPREAD 2',
chaos:'MODE WANDER\nSPEED 125\nRANGE 520\nSHOOT 1.25\nPROJECTILE_SPEED 290\nBURST 3\nCONTACT 30\nTELEPORT 3.5\nSPREAD 12'
};

const input={keys:new Set(),virtual:new Set()};
let current=newGame(),selected=1,editTool='brush',painting=false,rectStart=null,play=false,runtime=null,undo=[],redo=[],raf=0,last=0,dirty=false,autosaveTimer=0;
let scriptTarget='enemyA',spriteTarget='player',spriteTool='pencil',spritePainting=false;
let jsWorker=null,jsTickClock=0;

function uid(){return 'ng_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,7)}
function blankSprite(){return Array(256).fill(null)}
function presetSprite(kind,color){
 const a=blankSprite(),set=(x,y,c=color)=>{if(x>=0&&y>=0&&x<16&&y<16)a[y*16+x]=c};
 if(kind==='player'){
  for(let y=4;y<13;y++)for(let x=5;x<11;x++)set(x,y,color);
  for(let y=1;y<5;y++)for(let x=6;x<10;x++)set(x,y,'#e1b091');
  set(6,2,'#172030');set(9,2,'#172030');for(let x=4;x<7;x++)set(x,13,'#36455f');for(let x=9;x<12;x++)set(x,13,'#36455f');
 }else if(kind==='turret'){
  for(let y=7;y<13;y++)for(let x=4;x<12;x++)set(x,y,color);
  for(let x=7;x<15;x++)set(x,6,color);set(14,5,color);set(14,7,color);
 }else{
  for(let y=4;y<13;y++)for(let x=4;x<12;x++)set(x,y,color);
  for(let x=5;x<11;x++)set(x,3,color);set(6,6,'#071019');set(9,6,'#071019');
  if(kind==='enemyB'){set(3,4,color);set(12,4,color);set(2,3,color);set(13,3,color)}
 }
 return a
}
function newGame(){
 const tiles=Array(W*H).fill(0);for(let x=0;x<W;x++)tiles[(H-1)*W+x]=1;tiles[(H-2)*W+2]=2;tiles[(H-2)*W+(W-3)]=3;
 const colors={...themes.neon};
 return {format:FORMAT,id:uid(),name:'Untitled Nitro Game',description:'',mode:'platformer',theme:'neon',rule:'goal',timer:60,speed:1,lives:3,gravity:1350,jump:520,w:W,h:H,tiles,colors,
  sprites:{player:presetSprite('player',colors.accent),enemyA:presetSprite('enemyA',colors.enemyA),enemyB:presetSprite('enemyB',colors.enemyB),turret:presetSprite('turret','#ff77bd')},
  scripts:{...scriptDefaults},jsCode:jsDefault,updatedAt:Date.now()};
}
function clone(v){return JSON.parse(JSON.stringify(v))}
function idx(x,y){return y*W+x}
function xy(i){return {x:i%W,y:Math.floor(i/W)}}
function tileAt(x,y){if(x<0||y<0||x>=W||y>=H)return 1;return current.tiles[idx(x,y)]||0}
function markDirty(){
 dirty=true;current.updatedAt=Date.now();$('#ngsSaveState').textContent='UNSAVED • AUTOSAVING';
 clearTimeout(autosaveTimer);autosaveTimer=setTimeout(()=>{try{localStorage.setItem(DRAFT,JSON.stringify(current));dirty=false;$('#ngsSaveState').textContent='DRAFT AUTOSAVED'}catch(e){}},700)
}
function pushUndo(){undo.push(current.tiles.slice());if(undo.length>50)undo.shift();redo=[]}
function setTile(x,y,v){
 if(x<0||y<0||x>=W||y>=H)return;
 if(v===2)for(let i=0;i<current.tiles.length;i++)if(current.tiles[i]===2)current.tiles[i]=0;
 if(v===3)for(let i=0;i<current.tiles.length;i++)if(current.tiles[i]===3)current.tiles[i]=0;
 current.tiles[idx(x,y)]=v;markDirty()
}
function activeColors(){return current.theme==='custom'?current.colors:{...themes[current.theme]||themes.neon,...current.colorsOverride}}
function tileColor(t){
 const c=activeColors();
 return ({1:c.block,2:c.accent,3:c.goal,4:c.hazard,5:c.coin,6:c.enemyA,17:c.enemyB,8:'#ff77bd',7:'#ff9c68',9:'#7ed9ff',10:'#ffe28a',11:'#7b5b46',12:'#7b8dff',13:'#b078ff',14:'#72ee9c',15:'#68b9ff',16:c.accent})[t]||c.bg
}
function buildPalette(){
 const box=$('#ngsPalette');box.innerHTML='';
 tileDefs.forEach(t=>{
  const b=document.createElement('button');b.className='ngs-tool'+(t.id===selected?' active':'');b.dataset.tile=t.id;
  b.innerHTML='<strong><span class="ngs-swatch" style="background:'+tileColor(t.id)+'">'+t.icon+'</span>'+t.name+'</strong><span>'+t.hint+'</span>';
  b.onclick=()=>{selected=t.id;buildPalette()};box.appendChild(b)
 })
}
function buildColors(){
 const box=$('#ngsColorGrid');box.innerHTML='';
 colorFields.forEach(([key,label])=>{
  const row=document.createElement('label');row.className='ngs-color';const inp=document.createElement('input');inp.type='color';inp.value=current.colors[key]||themes.neon[key];
  const span=document.createElement('span');span.textContent=label;inp.oninput=()=>{current.colors[key]=inp.value;current.theme='custom';$('#ngsTheme').value='custom';markDirty();buildPalette();drawEditor()};
  row.append(inp,span);box.appendChild(row)
 })
}
function syncForm(){
 $('#ngsName').value=current.name;$('#ngsMode').value=current.mode;$('#ngsTheme').value=current.theme;$('#ngsRule').value=current.rule;$('#ngsTimer').value=current.timer;
 $('#ngsSpeed').value=String(current.speed);$('#ngsLives').value=current.lives;$('#ngsGravity').value=current.gravity;$('#ngsJump').value=current.jump;$('#ngsDescription').value=current.description||'';
 buildColors();buildPalette();updateStats()
}
function readForm(){
 current.name=($('#ngsName').value||'Untitled Nitro Game').trim().slice(0,42);current.mode=$('#ngsMode').value;current.theme=$('#ngsTheme').value;current.rule=$('#ngsRule').value;
 current.timer=Math.max(10,Math.min(600,Number($('#ngsTimer').value)||60));current.speed=Math.max(.6,Math.min(1.8,Number($('#ngsSpeed').value)||1));
 current.lives=Math.max(1,Math.min(20,Number($('#ngsLives').value)||3));current.gravity=Math.max(500,Math.min(2200,Number($('#ngsGravity').value)||1350));
 current.jump=Math.max(250,Math.min(900,Number($('#ngsJump').value)||520));current.description=$('#ngsDescription').value.slice(0,260);current.updatedAt=Date.now()
}
function toast(t){if(window.showToast)window.showToast(t);else{$('#ngsHint').textContent=t;clearTimeout($('#ngsHint')._t);$('#ngsHint')._t=setTimeout(()=>$('#ngsHint').textContent=play?'Play test running.':'Choose a tile, then paint your level.',1400)}}
function drawSprite(ctx,sprite,x,y,size){
 if(!Array.isArray(sprite))return;const ps=size/16;ctx.save();ctx.imageSmoothingEnabled=false;
 for(let i=0;i<256;i++){const col=sprite[i];if(!col)continue;ctx.fillStyle=col;ctx.fillRect(x+(i%16)*ps,y+Math.floor(i/16)*ps,Math.ceil(ps),Math.ceil(ps))}
 ctx.restore()
}
function drawTileIcon(t,px,py){
 const c=activeColors();
 const base=tileColor(t);g.save();g.globalAlpha=t===16?.28:1;
 const grad=g.createLinearGradient(px,py,px+S,py+S);grad.addColorStop(0,'#ffffff35');grad.addColorStop(.24,base);grad.addColorStop(1,'#050917');
 g.fillStyle=grad;g.fillRect(px+2,py+2,S-4,S-4);
 g.fillStyle='#ffffff2e';g.fillRect(px+3,py+3,S-6,2);g.fillRect(px+3,py+3,2,S-6);
 g.fillStyle='#00000060';g.fillRect(px+3,py+S-5,S-6,2);g.fillRect(px+S-5,py+3,2,S-6);
 if(t===1){g.fillStyle='#ffffff10';for(let q=7;q<S-4;q+=8)g.fillRect(px+q,py+6,2,S-12)}
 if(t===4){g.fillStyle='#ffdb6c50';g.beginPath();g.moveTo(px+S/2,py+5);g.lineTo(px+S-7,py+S-6);g.lineTo(px+7,py+S-6);g.closePath();g.fill()}
 g.restore();
 if(t===6){drawSprite(g,current.sprites.enemyA,px+6,py+6,S-12);return}
 if(t===17){drawSprite(g,current.sprites.enemyB,px+6,py+6,S-12);return}
 if(t===8){drawSprite(g,current.sprites.turret,px+6,py+6,S-12);return}
 if([2,3,5,7,9,10,11,12,13,14,15,16].includes(t)){const d=tileDefs.find(x=>x.id===t);g.fillStyle=t===5?'#1a1605':'#061019';g.font='900 15px Inter,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(d?d.icon:'?',px+S/2,py+S/2+1)}
}
function drawEditor(){
 const c=activeColors();g.fillStyle=c.bg;g.fillRect(0,0,canvas.width,canvas.height);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){
   if((x+y)%2===0){g.fillStyle='#ffffff06';g.fillRect(x*S,y*S,S,S)}
   const t=current.tiles[idx(x,y)];if(t)drawTileIcon(t,x*S,y*S)
 }
 const ambient=g.createRadialGradient(canvas.width*.42,canvas.height*.3,50,canvas.width*.5,canvas.height*.5,canvas.width*.8);
 ambient.addColorStop(0,'#ffffff07');ambient.addColorStop(1,'#00000045');g.fillStyle=ambient;g.fillRect(0,0,canvas.width,canvas.height);
 g.strokeStyle=c.grid;g.lineWidth=1;for(let x=0;x<=W;x++){g.beginPath();g.moveTo(x*S,0);g.lineTo(x*S,H*S);g.stroke()}for(let y=0;y<=H;y++){g.beginPath();g.moveTo(0,y*S);g.lineTo(W*S,y*S);g.stroke()}
 updateStats()
}
function complexity(){
 const counts={};current.tiles.forEach(t=>counts[t]=(counts[t]||0)+1);const scripted=(current.scripts.enemyA.length+current.scripts.enemyB.length+current.scripts.turret.length)/80;
 return Math.round(Math.min(999,(counts[1]||0)*.25+(counts[4]||0)*2+(counts[5]||0)+(counts[6]||0)*5+(counts[17]||0)*5+(counts[8]||0)*4+(counts[10]||0)*2+(counts[11]||0)*3+(counts[12]||0)*4+(counts[13]||0)*4+scripted))
}
function updateStats(){
 const count=v=>current.tiles.filter(x=>x===v).length;$('#ngsCountCoins').textContent=count(5);$('#ngsCountEnemies').textContent=count(6)+count(17)+count(8);$('#ngsCountHazards').textContent=count(4);$('#ngsComplexity').textContent=complexity();
 $('#ngsFeatureCount').textContent=FEATURES.length
}
function pointerCell(e){const r=canvas.getBoundingClientRect();return{x:clamp(Math.floor((e.clientX-r.left)/r.width*W),0,W-1),y:clamp(Math.floor((e.clientY-r.top)/r.height*H),0,H-1)}}
function floodFill(x,y,newValue){
 const old=tileAt(x,y);if(old===newValue)return;const q=[[x,y]],seen=new Set();
 while(q.length){const [cx,cy]=q.pop(),k=cx+','+cy;if(seen.has(k)||cx<0||cy<0||cx>=W||cy>=H||tileAt(cx,cy)!==old)continue;seen.add(k);setTile(cx,cy,newValue);q.push([cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1])}
}
function paintCell(e,erase=false){
 if(play)return;const p=pointerCell(e),v=erase?0:selected;
 if(editTool==='pick'){selected=tileAt(p.x,p.y);buildPalette();return}
 if(editTool==='fill'){pushUndo();floodFill(p.x,p.y,v);drawEditor();return}
 if(editTool==='rect'){if(!rectStart){pushUndo();rectStart=p;toast('Rectangle start set. Click the opposite corner.')}else{const a=rectStart;rectStart=null;for(let y=Math.min(a.y,p.y);y<=Math.max(a.y,p.y);y++)for(let x=Math.min(a.x,p.x);x<=Math.max(a.x,p.x);x++)setTile(x,y,v);drawEditor()}return}
 setTile(p.x,p.y,v);drawEditor()
}
canvas.addEventListener('pointerdown',e=>{if(play){canvas.focus({preventScroll:true});return}e.preventDefault();if(editTool==='brush'){painting=true;pushUndo()}paintCell(e,e.button===2);try{canvas.setPointerCapture(e.pointerId)}catch(_){}});
canvas.addEventListener('pointermove',e=>{if(painting&&!play&&editTool==='brush')paintCell(e,(e.buttons&2)!==0);const p=pointerCell(e);$('#ngsPointerInfo').textContent='X '+p.x+' • Y '+p.y});
canvas.addEventListener('pointerup',()=>painting=false);canvas.addEventListener('pointercancel',()=>painting=false);canvas.addEventListener('contextmenu',e=>{e.preventDefault();if(!play){pushUndo();paintCell(e,true)}});

function undoPaint(){if(!undo.length)return;redo.push(current.tiles.slice());current.tiles=undo.pop();markDirty();drawEditor()}
function redoPaint(){if(!redo.length)return;undo.push(current.tiles.slice());current.tiles=redo.pop();markDirty();drawEditor()}
function clearLevel(){if(!confirm('Clear the whole level?'))return;pushUndo();current.tiles=Array(W*H).fill(0);markDirty();drawEditor()}
function generateLevel(){
 if(!confirm('Generate a new level for the selected game type?'))return;pushUndo();current.tiles=Array(W*H).fill(0);
 if(current.mode==='platformer'){
  for(let x=0;x<W;x++)current.tiles[idx(x,H-1)]=1;setTile(1,H-2,2);setTile(W-2,H-2,3);
  for(let x=4;x<W-3;x+=4){const y=H-3-Math.floor(Math.random()*5);for(let k=0;k<3;k++)setTile(x+k,y,1);if(Math.random()<.7)setTile(x+1,y-1,5);if(Math.random()<.45)setTile(x+2,y-1,Math.random()<.5?6:17)}
  setTile(Math.floor(W/2),H-2,9);setTile(W-5,H-2,10);setTile(W-3,H-2,11)
 }else{
  for(let x=0;x<W;x++){setTile(x,0,1);setTile(x,H-1,1)}for(let y=0;y<H;y++){setTile(0,y,1);setTile(W-1,y,1)}setTile(1,1,2);setTile(W-2,H-2,3);
  for(let i=0;i<52;i++){const x=2+Math.floor(Math.random()*(W-4)),y=2+Math.floor(Math.random()*(H-4));if(Math.random()<.62)setTile(x,y,1)}
  for(let i=0;i<10;i++){const x=2+Math.floor(Math.random()*(W-4)),y=2+Math.floor(Math.random()*(H-4));setTile(x,y,pick([5,6,17,4]))}
  setTile(2,1,12);setTile(W-3,H-2,13)
 }
 markDirty();drawEditor();validateGame();toast('Generated a fresh level.')
}
function screenshot(){drawEditor();const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download=(current.name||'nitro-game').replace(/[^a-z0-9_-]+/gi,'_')+'_level.png';a.click()}

function games(){try{return JSON.parse(localStorage.getItem(STORE)||'[]')}catch(e){return[]}}
function writeGames(a){localStorage.setItem(STORE,JSON.stringify(a.slice(0,24)))}
function saveCurrent(){
 readForm();const a=games(),i=a.findIndex(x=>x.id===current.id);if(i>=0)a[i]=clone(current);else a.unshift(clone(current));writeGames(a);dirty=false;$('#ngsSaveState').textContent='SAVED';renderLibrary();toast('Game saved locally.')
}
function normalise(game){
 const base=newGame(),g2={...base,...clone(game)};g2.format=FORMAT;g2.w=W;g2.h=H;if(!Array.isArray(g2.tiles))g2.tiles=Array(W*H).fill(0);g2.tiles=g2.tiles.slice(0,W*H);while(g2.tiles.length<W*H)g2.tiles.push(0);
 g2.colors={...base.colors,...(g2.colors||{})};g2.sprites={...base.sprites,...(g2.sprites||{})};g2.scripts={...scriptDefaults,...(g2.scripts||{})};g2.jsCode=typeof g2.jsCode==='string'?g2.jsCode:jsDefault;return g2
}
function renderMini(cv,game){
 const c=cv.getContext('2d'),cw=cv.width/game.w,ch=cv.height/game.h,col=game.theme==='custom'?game.colors:(themes[game.theme]||themes.neon);c.fillStyle=col.bg;c.fillRect(0,0,cv.width,cv.height);
 game.tiles.forEach((t,i)=>{if(!t)return;const x=i%game.w,y=Math.floor(i/game.w);c.fillStyle=({1:col.block,2:col.accent,3:col.goal,4:col.hazard,5:col.coin,6:col.enemyA,17:col.enemyB,8:'#ff77bd'})[t]||col.accent;c.fillRect(x*cw,y*ch,Math.max(1,cw),Math.max(1,ch))})
}
function renderLibrary(){
 const box=$('#ngsLibrary'),a=games();box.innerHTML='';if(!a.length){box.innerHTML='<div class="ngs-empty">No saved games yet. Build something, play-test it, then press SAVE.</div>';return}
 a.forEach(game=>{
  const card=document.createElement('div');card.className='ngs-libcard';const cv=document.createElement('canvas');cv.width=128;cv.height=84;const meta=document.createElement('div');meta.innerHTML='<b></b><span></span>';meta.querySelector('b').textContent=game.name;meta.querySelector('span').textContent=(game.mode||'game').toUpperCase()+' • '+new Date(game.updatedAt||Date.now()).toLocaleDateString();
  const acts=document.createElement('div');acts.className='ngs-libactions';const load=document.createElement('button');load.textContent='LOAD';load.onclick=()=>loadGame(game);
  const copy=document.createElement('button');copy.textContent='CLONE';copy.onclick=()=>{const cp=normalise(game);cp.id=uid();cp.name=(cp.name+' Copy').slice(0,42);cp.updatedAt=Date.now();const arr=games();arr.unshift(cp);writeGames(arr);renderLibrary();toast('Game cloned.')};
  const del=document.createElement('button');del.textContent='DELETE';del.onclick=()=>{if(confirm('Delete "'+game.name+'"?')){writeGames(games().filter(x=>x.id!==game.id));renderLibrary()}};
  acts.append(load,copy,del);card.append(cv,meta,acts);box.appendChild(card);renderMini(cv,game)
 })
}
function loadGame(game){stopTest();current=normalise(game);undo=[];redo=[];dirty=false;syncForm();drawEditor();toast('Loaded '+current.name)}
function loadDraft(){try{const d=JSON.parse(localStorage.getItem(DRAFT)||'null');if(d&&d.format)current=normalise(d)}catch(e){}}

function compileScript(text){
 const cfg={mode:'PATROL',speed:80,range:360,shoot:0,projectileSpeed:240,burst:1,contact:20,teleport:0,spread:0},errors=[],validModes=['CHASE','PATROL','WANDER','FLEE','SENTRY','ORBIT'];
 String(text||'').split(/\r?\n/).forEach((raw,lineNo)=>{
  const line=raw.trim();if(!line||line.startsWith('#'))return;const parts=line.split(/\s+/),cmd=parts.shift().toUpperCase(),arg=parts.join(' ');
  const num=(lo,hi,def)=>{const n=Number(arg);if(!Number.isFinite(n)){errors.push('Line '+(lineNo+1)+': '+cmd+' needs a number');return def}return clamp(n,lo,hi)};
  if(cmd==='MODE'){const m=arg.toUpperCase();if(validModes.includes(m))cfg.mode=m;else errors.push('Line '+(lineNo+1)+': unknown MODE '+arg)}
  else if(cmd==='SPEED')cfg.speed=num(0,300,cfg.speed);
  else if(cmd==='RANGE')cfg.range=num(40,1000,cfg.range);
  else if(cmd==='SHOOT')cfg.shoot=num(0,20,cfg.shoot);
  else if(cmd==='PROJECTILE_SPEED')cfg.projectileSpeed=num(50,800,cfg.projectileSpeed);
  else if(cmd==='BURST')cfg.burst=Math.round(num(1,5,cfg.burst));
  else if(cmd==='CONTACT')cfg.contact=num(0,100,cfg.contact);
  else if(cmd==='TELEPORT')cfg.teleport=num(0,30,cfg.teleport);
  else if(cmd==='SPREAD')cfg.spread=num(0,60,cfg.spread);
  else errors.push('Line '+(lineNo+1)+': unknown command '+cmd)
 });
 return {cfg,errors}
}
function openScripts(){scriptTarget='enemyA';$('#ngsScriptEditor').value=current.scripts[scriptTarget];updateScriptButtons();compileCurrentScript();$('#ngsScriptModal').classList.add('open')}
function updateScriptButtons(){document.querySelectorAll('[data-script]').forEach(b=>b.classList.toggle('active',b.dataset.script===scriptTarget))}
function saveScriptEditor(){current.scripts[scriptTarget]=$('#ngsScriptEditor').value;markDirty()}
function switchScript(target){saveScriptEditor();scriptTarget=target;$('#ngsScriptEditor').value=current.scripts[target]||scriptDefaults[target];updateScriptButtons();compileCurrentScript()}
function compileCurrentScript(){const r=compileScript($('#ngsScriptEditor').value);$('#ngsScriptResult').textContent=r.errors.length?'SCRIPT ERRORS\n'+r.errors.join('\n'):'COMPILED OK\n'+JSON.stringify(r.cfg,null,2);$('#ngsScriptResult').style.color=r.errors.length?'#ff9fb0':'#a9efc2';return r}
function applyScriptPreset(name){$('#ngsScriptEditor').value=scriptPresets[name]||scriptPresets.patrol;compileCurrentScript()}

function openSpriteLab(){spriteTarget='player';spriteTool='pencil';$('#ngsSpriteTarget').value=spriteTarget;drawSpriteEditor();$('#ngsSpriteModal').classList.add('open')}
function spriteCell(e){const r=spriteCanvas.getBoundingClientRect();return{x:clamp(Math.floor((e.clientX-r.left)/r.width*16),0,15),y:clamp(Math.floor((e.clientY-r.top)/r.height*16),0,15)}}
function drawSpriteEditor(){
 sg.fillStyle='#071019';sg.fillRect(0,0,320,320);drawSprite(sg,current.sprites[spriteTarget],0,0,320);sg.strokeStyle='#1d3041';sg.lineWidth=1;for(let i=0;i<=16;i++){sg.beginPath();sg.moveTo(i*20,0);sg.lineTo(i*20,320);sg.stroke();sg.beginPath();sg.moveTo(0,i*20);sg.lineTo(320,i*20);sg.stroke()}
}
function spriteFlood(x,y,newColor){
 const arr=current.sprites[spriteTarget],old=arr[y*16+x]||null;if(old===newColor)return;const q=[[x,y]],seen=new Set();
 while(q.length){const [cx,cy]=q.pop(),k=cx+','+cy;if(seen.has(k)||cx<0||cy<0||cx>=16||cy>=16||(arr[cy*16+cx]||null)!==old)continue;seen.add(k);arr[cy*16+cx]=newColor;q.push([cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1])}
}
function spritePaint(e){
 const p=spriteCell(e),arr=current.sprites[spriteTarget],i=p.y*16+p.x,col=$('#ngsSpriteColor').value;if(spriteTool==='eraser')arr[i]=null;else if(spriteTool==='fill')spriteFlood(p.x,p.y,col);else arr[i]=col;markDirty();drawSpriteEditor();drawEditor()
}
function mirrorSprite(axis){const a=current.sprites[spriteTarget],b=blankSprite();for(let y=0;y<16;y++)for(let x=0;x<16;x++){const nx=axis==='x'?15-x:x,ny=axis==='y'?15-y:y;b[ny*16+nx]=a[y*16+x]}current.sprites[spriteTarget]=b;markDirty();drawSpriteEditor();drawEditor()}
function buildSpritePalette(){const box=$('#ngsSpritePalette'),cols=['#69e8ff','#8d83ff','#ff6f9b','#ff6178','#ffd66b','#7cefa5','#ffffff','#d6aa8d','#263149','#111722'];box.innerHTML='';cols.forEach(c=>{const b=document.createElement('button');b.style.background=c;b.onclick=()=>{$('#ngsSpriteColor').value=c};box.appendChild(b)})}

function solidType(t,i){return t===1||(t===11&&runtime&&!runtime.openDoors.has(i))}
function rectHitsSolid(x,y,w,h){
 const l=Math.floor((x-w/2)/S),r=Math.floor((x+w/2-1)/S),t=Math.floor((y-h/2)/S),b=Math.floor((y+h/2-1)/S);
 for(let yy=t;yy<=b;yy++)for(let xx=l;xx<=r;xx++){if(xx<0||yy<0||xx>=W||yy>=H)return true;const i=idx(xx,yy);if(solidType(current.tiles[i],i))return true}return false
}
function touchTile(type){
 const r=runtime,cx=Math.floor(r.px/S),cy=Math.floor(r.py/S);
 for(let y=cy-1;y<=cy+1;y++)for(let x=cx-1;x<=cx+1;x++){if(x<0||y<0||x>=W||y>=H)continue;const i=idx(x,y);if(current.tiles[i]!==type)continue;const tx=(x+.5)*S,ty=(y+.5)*S;if(Math.abs(r.px-tx)<S*.48&&Math.abs(r.py-ty)<S*.48)return{x,y,i}}
 return null
}
function held(...names){return names.some(n=>input.keys.has(n)||input.virtual.has(n))}
function resetPlayer(full=false){
 const r=runtime,start=current.tiles.findIndex(v=>v===2),spawn=r&&r.respawnIndex>=0?r.respawnIndex:start,pos=xy(spawn);r.px=(pos.x+.5)*S;r.py=(pos.y+.5)*S;r.vx=r.vy=0;r.inv=1.0;if(full)r.hp=100
}
function damagePlayer(amount){
 const r=runtime;if(!r||r.inv>0||r.dead||r.won)return;r.hp-=amount;r.inv=.65;jsEvent('damage',{amount:Number(amount)||0,hp:r.hp,lives:r.lives});if(r.hp<=0){r.lives--;if(r.lives<=0){r.dead=true;toast('GAME OVER — press STOP TEST to edit.')}else{r.hp=100;resetPlayer();toast('Life lost. '+r.lives+' left.')}}
}
function openJsLab(){
 $('#ngsJsEditor').value=current.jsCode||jsDefault;$('#ngsJsResult').textContent='JavaScript has not been checked yet.';$('#ngsJsModal').classList.add('open')
}
function saveJsCode(){current.jsCode=$('#ngsJsEditor').value;markDirty()}
function makeJsWorker(code){
 const source=`"use strict";
self.fetch=undefined;self.XMLHttpRequest=undefined;self.WebSocket=undefined;self.EventSource=undefined;self.importScripts=undefined;self.indexedDB=undefined;self.caches=undefined;
const H={start:[],tick:[],coin:[],damage:[],win:[]};
const send=(action,value)=>postMessage({type:"action",action,value});
const add=(name,fn)=>{if(typeof fn==="function")H[name].push(fn)};
const Nitro=Object.freeze({
 onStart:fn=>add("start",fn),onTick:fn=>add("tick",fn),onCoin:fn=>add("coin",fn),onDamage:fn=>add("damage",fn),onWin:fn=>add("win",fn),
 say:text=>send("say",String(text).slice(0,140)),
 player:Object.freeze({speed:v=>send("player.speed",v),jump:v=>send("player.jump",v)}),
 world:Object.freeze({gravity:v=>send("world.gravity",v)}),
 enemyA:Object.freeze({speed:v=>send("enemyA.speed",v)}),
 enemyB:Object.freeze({speed:v=>send("enemyB.speed",v)}),
 turret:Object.freeze({fireEvery:v=>send("turret.fireEvery",v)}),
 complete:()=>send("complete",1)
});
onmessage=e=>{const m=e.data||{};if(m.type!=="event"||!H[m.name])return;for(const fn of H[m.name]){try{fn(Object.freeze(m.data||{}))}catch(err){postMessage({type:"error",message:"Runtime "+m.name+": "+err.message})}}};
try{(0,eval)(${JSON.stringify(code).replace(/</g,'\\u003c')});postMessage({type:"ready"})}catch(err){postMessage({type:"error",message:err.name+": "+err.message})}`;
 const blob=new Blob([source],{type:'text/javascript'}),url=URL.createObjectURL(blob),w=new Worker(url);setTimeout(()=>URL.revokeObjectURL(url),1000);return w
}
function applyJsAction(action,value){
 if(!runtime)return;const n=Number(value);
 if(action==='say')return toast(String(value).slice(0,140));
 if(action==='player.speed'&&Number.isFinite(n))runtime.jsSpeed=clamp(n,.25,3);
 if(action==='player.jump'&&Number.isFinite(n))runtime.jsJump=clamp(n,100,1200);
 if(action==='world.gravity'&&Number.isFinite(n))runtime.jsGravity=clamp(n,100,3200);
 if(action==='enemyA.speed'&&Number.isFinite(n))runtime.enemyCfgA.speed=clamp(n,0,350);
 if(action==='enemyB.speed'&&Number.isFinite(n))runtime.enemyCfgB.speed=clamp(n,0,350);
 if(action==='turret.fireEvery'&&Number.isFinite(n))runtime.turretCfg.shoot=clamp(n,.15,20);
 if(action==='complete')testWin()
}
function startJsRuntime(){
 stopJsRuntime();const code=String(current.jsCode||'').trim();if(!code)return;
 try{new Function(code)}catch(err){toast('JavaScript syntax error: '+err.message);return}
 jsWorker=makeJsWorker(code);jsWorker.onmessage=e=>{const m=e.data||{};if(m.type==='action')applyJsAction(m.action,m.value);if(m.type==='error')toast('JS: '+m.message)};jsWorker.onerror=e=>toast('JS worker error: '+e.message);jsTickClock=0
}
function jsEvent(name,data={}){if(jsWorker)try{jsWorker.postMessage({type:'event',name,data})}catch(e){}}
function stopJsRuntime(){if(jsWorker){try{jsWorker.terminate()}catch(e){}jsWorker=null}}
function testJsSandbox(){
 saveJsCode();let code=current.jsCode||'';try{new Function(code)}catch(err){$('#ngsJsResult').textContent='SYNTAX ERROR\\n'+err.message;$('#ngsJsResult').style.color='#ff9fb0';return}
 const w=makeJsWorker(code);let done=false,t=setTimeout(()=>{if(done)return;done=true;w.terminate();$('#ngsJsResult').textContent='Sandbox timed out. Check for an infinite loop.';$('#ngsJsResult').style.color='#ff9fb0'},700);
 w.onmessage=e=>{if(done)return;const m=e.data||{};if(m.type==='ready'){done=true;clearTimeout(t);w.terminate();$('#ngsJsResult').textContent='COMPILED + SANDBOX STARTED OK\\nThe code is isolated in a Worker and can use the NitroJS API.';$('#ngsJsResult').style.color='#a9efc2'}else if(m.type==='error'){done=true;clearTimeout(t);w.terminate();$('#ngsJsResult').textContent='SANDBOX ERROR\\n'+m.message;$('#ngsJsResult').style.color='#ff9fb0'}}
 w.onerror=e=>{if(done)return;done=true;clearTimeout(t);w.terminate();$('#ngsJsResult').textContent='WORKER ERROR\\n'+e.message;$('#ngsJsResult').style.color='#ff9fb0'}
}

function startTest(){
 readForm();const start=current.tiles.findIndex(v=>v===2);if(start<0){toast('Place a START tile first.');return}if(current.mode!=='dodge'&&current.tiles.findIndex(v=>v===3)<0){toast('Place a GOAL tile first.');return}
 const scA=compileScript(current.scripts.enemyA),scB=compileScript(current.scripts.enemyB),scT=compileScript(current.scripts.turret);if(scA.errors.length||scB.errors.length||scT.errors.length){toast('Fix NitroScript errors before testing.');openScripts();return}
 play=true;input.keys.clear();input.virtual.clear();canvas.focus({preventScroll:true});$('#ngsPlay').style.display='none';$('#ngsStop').style.display='inline-block';$('#ngsStatus').textContent='PLAY TEST';$('#ngsHint').textContent='Keyboard fixed: WASD/arrows work. Click canvas if needed.';$('#ngsVirtual').classList.add('show');
 const pos=xy(start),totalCoins=current.tiles.filter(v=>v===5).length;
 runtime={px:(pos.x+.5)*S,py:(pos.y+.5)*S,vx:0,vy:0,w:22,h:30,onGround:false,lives:current.lives,hp:100,inv:0,coins:0,totalCoins,time:current.timer,won:false,dead:false,respawnIndex:start,keys:0,
  collected:new Set(),openDoors:new Set(),portalCd:0,enemyShots:[],enemyCfgA:scA.cfg,enemyCfgB:scB.cfg,turretCfg:scT.cfg,
  enemies:current.tiles.map((v,i)=>(v===6||v===17)?makeEnemy(v,i):null).filter(Boolean),turrets:current.tiles.map((v,i)=>v===8?makeTurret(i):null).filter(Boolean)};
 startJsRuntime();jsEvent('start',{mode:current.mode,name:current.name});
 last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(playLoop)
}
function makeEnemy(type,i){const p=xy(i),cfg=type===6?compileScript(current.scripts.enemyA).cfg:compileScript(current.scripts.enemyB).cfg;return{type,x:(p.x+.5)*S,y:(p.y+.5)*S,baseX:(p.x+.5)*S,baseY:(p.y+.5)*S,dir:Math.random()<.5?-1:1,angle:Math.random()*Math.PI*2,turn:1,shoot:Math.random()*Math.max(.1,cfg.shoot),tele:cfg.teleport||999,inv:0}}
function makeTurret(i){const p=xy(i),cfg=compileScript(current.scripts.turret).cfg;return{x:(p.x+.5)*S,y:(p.y+.5)*S,shoot:Math.random()*Math.max(.1,cfg.shoot)}}
function stopTest(){stopJsRuntime();play=false;runtime=null;input.keys.clear();input.virtual.clear();cancelAnimationFrame(raf);$('#ngsPlay').style.display='inline-block';$('#ngsStop').style.display='none';$('#ngsStatus').textContent='EDIT MODE';$('#ngsPlayHud').classList.remove('show');$('#ngsVirtual').classList.remove('show');drawEditor()}
function fireFrom(x,y,cfg){
 if(!runtime||cfg.shoot<=0)return;const base=Math.atan2(runtime.py-y,runtime.px-x),burst=Math.max(1,cfg.burst),spread=cfg.spread*Math.PI/180;
 for(let k=0;k<burst;k++){const off=burst===1?0:(k/(burst-1)-.5)*spread;runtime.enemyShots.push({x,y,vx:Math.cos(base+off)*cfg.projectileSpeed,vy:Math.sin(base+off)*cfg.projectileSpeed,life:5})}
}
function updateEnemy(e,cfg,dt){
 const r=runtime,dx=r.px-e.x,dy=r.py-e.y,dist=Math.hypot(dx,dy),mode=cfg.mode;
 e.turn-=dt;if(e.turn<=0){e.turn=1+Math.random()*1.6;e.angle=Math.random()*Math.PI*2}
 let vx=0,vy=0;
 if(mode==='CHASE'&&dist<cfg.range){vx=dx/dist*cfg.speed;vy=dy/dist*cfg.speed}
 else if(mode==='FLEE'&&dist<cfg.range){vx=-dx/dist*cfg.speed;vy=-dy/dist*cfg.speed}
 else if(mode==='WANDER'){vx=Math.cos(e.angle)*cfg.speed;vy=Math.sin(e.angle)*cfg.speed}
 else if(mode==='ORBIT'){e.angle+=dt*Math.max(.4,cfg.speed/70);const rad=Math.min(120,Math.max(35,cfg.range*.25));e.x=e.baseX+Math.cos(e.angle)*rad;e.y=e.baseY+Math.sin(e.angle)*rad}
 else if(mode==='PATROL'){vx=e.dir*cfg.speed;if(Math.abs(e.x-e.baseX)>S*2.2)e.dir*=-1}
 if(mode!=='ORBIT'){
  if(current.mode==='platformer'){const nx=e.x+vx*dt;if(!rectHitsSolid(nx,e.y,24,24))e.x=nx;else e.dir*=-1}
  else{const nx=e.x+vx*dt,ny=e.y+vy*dt;if(!rectHitsSolid(nx,e.y,24,24))e.x=nx;if(!rectHitsSolid(e.x,ny,24,24))e.y=ny}
 }
 if(cfg.teleport>0){e.tele-=dt;if(e.tele<=0){e.tele=cfg.teleport;e.x=clamp(r.px+(Math.random()<.5?-1:1)*S*3,S,W*S-S);e.y=clamp(r.py+(Math.random()-.5)*S*4,S,H*S-S)}}
 if(cfg.shoot>0&&dist<cfg.range){e.shoot-=dt;if(e.shoot<=0){e.shoot=cfg.shoot;fireFrom(e.x,e.y,cfg)}}
 if(dist<25)damagePlayer(cfg.contact)
}
function updateTurrets(dt){const cfg=runtime.turretCfg;runtime.turrets.forEach(t=>{const d=Math.hypot(runtime.px-t.x,runtime.py-t.y);if(cfg.shoot>0&&d<cfg.range){t.shoot-=dt;if(t.shoot<=0){t.shoot=cfg.shoot;fireFrom(t.x,t.y,cfg)}}})}
function updateProjectiles(dt){const r=runtime;r.enemyShots.forEach(s=>{s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;if(Math.hypot(r.px-s.x,r.py-s.y)<18){s.life=0;damagePlayer(18)}});r.enemyShots=r.enemyShots.filter(s=>s.life>0&&s.x>0&&s.y>0&&s.x<canvas.width&&s.y<canvas.height)}
function nearbyDoor(){
 const r=runtime,cx=Math.floor(r.px/S),cy=Math.floor(r.py/S);for(let y=cy-1;y<=cy+1;y++)for(let x=cx-1;x<=cx+1;x++){if(x<0||y<0||x>=W||y>=H)continue;const i=idx(x,y);if(current.tiles[i]===11&&!r.openDoors.has(i)&&Math.hypot(r.px-(x+.5)*S,r.py-(y+.5)*S)<S*1.25)return i}return-1
}
function updateSpecialTiles(){
 const r=runtime;if(r.portalCd>0)return;
 const hazard=touchTile(4);if(hazard)damagePlayer(35);
 const coin=touchTile(5);if(coin&&!r.collected.has(coin.i)){r.collected.add(coin.i);r.coins++;toast('Coin '+r.coins+'/'+r.totalCoins);jsEvent('coin',{coins:r.coins,total:r.totalCoins})}
 const cp=touchTile(9);if(cp&&r.respawnIndex!==cp.i){r.respawnIndex=cp.i;toast('Checkpoint activated.')}
 const key=touchTile(10);if(key&&!r.collected.has(key.i)){r.collected.add(key.i);r.keys++;toast('Key collected.')}
 const heal=touchTile(14);if(heal&&!r.collected.has(heal.i)){r.collected.add(heal.i);r.hp=Math.min(100,r.hp+45);toast('Health restored.')}
 const door=nearbyDoor();if(door>=0&&r.keys>0){r.keys--;r.openDoors.add(door);toast('Door unlocked.')}
 const pa=touchTile(12),pb=touchTile(13);if(pa||pb){const targetType=pa?13:12,target=current.tiles.findIndex(v=>v===targetType);if(target>=0){const p=xy(target);r.px=(p.x+.5)*S;r.py=(p.y+.5)*S;r.portalCd=.8;toast('Portal jump.')}}
 const goal=touchTile(3);if(goal&&current.mode!=='dodge'){if(current.rule==='coins'&&r.coins<r.totalCoins){}else testWin()}
}
function movementMultiplier(){return touchTile(15)?.55:1}
function updatePlatformer(dt){
 const r=runtime,mul=movementMultiplier(),sp=250*(r.jsSpeed??current.speed)*mul,left=held('KeyA','a','ArrowLeft','arrowleft'),right=held('KeyD','d','ArrowRight','arrowright'),jump=held('KeyW','w','ArrowUp','arrowup','Space',' ');
 r.vx=((right?1:0)-(left?1:0))*sp;if(jump&&r.onGround&&!r.jumpLock){r.vy=-(r.jsJump??current.jump);r.onGround=false;r.jumpLock=true}if(!jump)r.jumpLock=false;r.vy+=(r.jsGravity??current.gravity)*dt;
 let nx=r.px+r.vx*dt;if(!rectHitsSolid(nx,r.py,r.w,r.h))r.px=nx;let ny=r.py+r.vy*dt;r.onGround=false;
 if(!rectHitsSolid(r.px,ny,r.w,r.h))r.py=ny;else{if(r.vy>0)r.onGround=true;r.vy=0}
 if(touchTile(7)){r.vy=-Math.max((r.jsJump??current.jump)*1.3,650);r.onGround=false}
}
function updateTopdown(dt){
 const r=runtime,mul=movementMultiplier(),sp=(current.mode==='dodge'?300:235)*(r.jsSpeed??current.speed)*mul,dx=(held('KeyD','d','ArrowRight','arrowright')?1:0)-(held('KeyA','a','ArrowLeft','arrowleft')?1:0),dy=(held('KeyS','s','ArrowDown','arrowdown')?1:0)-(held('KeyW','w','ArrowUp','arrowup')?1:0),m=Math.hypot(dx,dy)||1;
 const nx=r.px+dx/m*sp*dt,ny=r.py+dy/m*sp*dt;if(!rectHitsSolid(nx,r.py,22,22))r.px=nx;if(!rectHitsSolid(r.px,ny,22,22))r.py=ny
}
function playUpdate(dt){
 const r=runtime;if(!r||r.dead||r.won)return;r.time-=dt;r.inv=Math.max(0,r.inv-dt);r.portalCd=Math.max(0,r.portalCd-dt);jsTickClock+=dt;if(jsTickClock>=.1){jsTickClock=0;jsEvent('tick',{time:current.timer-r.time,remaining:r.time,hp:r.hp,lives:r.lives,coins:r.coins})}
 if(current.mode==='platformer')updatePlatformer(dt);else updateTopdown(dt);
 r.enemies.forEach(e=>updateEnemy(e,e.type===6?r.enemyCfgA:r.enemyCfgB,dt));updateTurrets(dt);updateProjectiles(dt);updateSpecialTiles();
 if(r.py>canvas.height+60){damagePlayer(999);return}
 if((current.rule==='survive'||current.mode==='dodge')&&r.time<=0)testWin();else if(current.rule!=='survive'&&current.mode!=='dodge'&&r.time<=0){r.dead=true;toast('Time up.')}
}
function testWin(){if(runtime.won)return;runtime.won=true;jsEvent('win',{coins:runtime.coins,time:runtime.time});toast('PLAY TEST COMPLETE — your game can be beaten!')}
function drawPlay(){
 drawEditor();const r=runtime;if(!r)return;
 r.collected.forEach(i=>{const p=xy(i);g.fillStyle=activeColors().bg;g.fillRect(p.x*S+3,p.y*S+3,S-6,S-6)});
 r.openDoors.forEach(i=>{const p=xy(i);g.fillStyle=activeColors().bg;g.fillRect(p.x*S+3,p.y*S+3,S-6,S-6)});
 r.enemies.forEach(e=>drawSprite(g,e.type===6?current.sprites.enemyA:current.sprites.enemyB,e.x-16,e.y-16,32));
 r.turrets.forEach(t=>drawSprite(g,current.sprites.turret,t.x-16,t.y-16,32));
 r.enemyShots.forEach(s=>{g.fillStyle='#ff6b79';g.beginPath();g.arc(s.x,s.y,5,0,Math.PI*2);g.fill()});
 drawSprite(g,current.sprites.player,r.px-17,r.py-17,34);if(r.inv>0){g.strokeStyle='#fff';g.globalAlpha=.35;g.beginPath();g.arc(r.px,r.py,20,0,Math.PI*2);g.stroke();g.globalAlpha=1}
 const hud=$('#ngsPlayHud');hud.classList.add('show');hud.innerHTML='<div class="ngs-playchip">HP '+Math.ceil(r.hp)+'</div><div class="ngs-playchip">LIVES '+r.lives+'</div><div class="ngs-playchip">COINS '+r.coins+'/'+r.totalCoins+'</div><div class="ngs-playchip">KEYS '+r.keys+'</div><div class="ngs-playchip">TIME '+Math.max(0,r.time).toFixed(1)+'</div><div class="ngs-playchip">'+(current.mode==='platformer'?'A/D + W/SPACE':'WASD / ARROWS')+'</div>'
}
function playLoop(t){if(!play)return;const dt=Math.min(.033,(t-last)/1000||0);last=t;playUpdate(dt);drawPlay();raf=requestAnimationFrame(playLoop)}

function reachableEstimate(){
 const start=current.tiles.findIndex(v=>v===2),goal=current.tiles.findIndex(v=>v===3);if(start<0||goal<0)return false;const q=[start],seen=new Set([start]);
 while(q.length){const i=q.shift();if(i===goal)return true;const p=xy(i);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=p.x+dx,y=p.y+dy;if(x<0||y<0||x>=W||y>=H)continue;const ni=idx(x,y),t=current.tiles[ni];if(seen.has(ni)||t===1||t===11)continue;seen.add(ni);q.push(ni)}}
 return false
}
function validateGame(){
 readForm();const issues=[],starts=current.tiles.filter(v=>v===2).length,goals=current.tiles.filter(v=>v===3).length,a=current.tiles.filter(v=>v===12).length,b=current.tiles.filter(v=>v===13).length;
 if(starts!==1)issues.push('Need exactly 1 Start tile.');
 if(current.mode!=='dodge'&&goals!==1)issues.push('Need exactly 1 Goal tile.');
 if((a>0||b>0)&&(a!==1||b!==1))issues.push('Portals require exactly one A and one B.');
 for(const k of ['enemyA','enemyB','turret']){const r=compileScript(current.scripts[k]);if(r.errors.length)issues.push(k+': '+r.errors[0])}
 if(current.mode==='maze'&&starts===1&&goals===1&&!reachableEstimate())issues.push('Maze reachability check cannot find a path to the goal.');
 const el=$('#ngsCheck');if(issues.length){el.className='ngs-check bad';el.textContent='BUILD CHECK: '+issues.join(' • ')}else{el.className='ngs-check good';el.textContent='BUILD CHECK PASSED • Start/goal valid • scripts compile • portals valid'+(current.mode==='maze'?' • route reachable':'')}
 return issues
}

function rleEncode(a){let out=[],last=a[0]||0,count=0;for(const v of a){if(v===last)count++;else{out.push(last.toString(36)+'.'+count.toString(36));last=v;count=1}}out.push(last.toString(36)+'.'+count.toString(36));return out.join('_')}
function rleDecode(s){const out=[];String(s||'').split('_').forEach(p=>{const q=p.split('.'),v=parseInt(q[0]||'0',36),n=parseInt(q[1]||'0',36);for(let i=0;i<n;i++)out.push(v)});return out}
function pack(game){return{v:2,id:game.id,n:game.name,d:game.description,m:game.mode,h:game.theme,r:game.rule,ti:game.timer,s:game.speed,l:game.lives,g:game.gravity,j:game.jump,t:rleEncode(game.tiles),c:game.colors,sp:game.sprites,sc:game.scripts,js:game.jsCode||''}}
function unpack(p){if(!p||!p.v)throw new Error('Unsupported Nitro game version');return normalise({format:FORMAT,id:uid(),name:p.n||'Shared Nitro Game',description:p.d||'',mode:p.m||'platformer',theme:p.h||'neon',rule:p.r||'goal',timer:p.ti||60,speed:p.s||1,lives:p.l||3,gravity:p.g||1350,jump:p.j||520,tiles:rleDecode(p.t),colors:p.c,sprites:p.sp,scripts:p.sc,jsCode:p.js||jsDefault,updatedAt:Date.now()})}
function b64e(s){const b=new TextEncoder().encode(s);let x='';for(const n of b)x+=String.fromCharCode(n);return btoa(x).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function b64d(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const x=atob(s),b=Uint8Array.from(x,c=>c.charCodeAt(0));return new TextDecoder().decode(b)}
function shareCode(){readForm();return 'NAG2-'+b64e(JSON.stringify(pack(current)))}
function importCode(code){code=String(code||'').trim();if(code.startsWith('NAG1-'))throw new Error('This new Studio uses NAG2 share codes. Import the old game as a .nitrogame file or rebuild it.');if(!code.startsWith('NAG2-'))throw new Error('Not a Nitro Game Studio share code');current=unpack(JSON.parse(b64d(code.slice(5))));stopTest();syncForm();drawEditor();toast('Shared game imported.')}
async function copyText(t){try{await navigator.clipboard.writeText(t);toast('Copied.')}catch(e){$('#ngsShareCode').focus();$('#ngsShareCode').select();toast('Select the text and copy manually.')}}
function exportGame(){readForm();const data={format:'NitroArcadeGame',version:2,game:pack(current)},blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(current.name||'nitro-game').replace(/[^a-z0-9_-]+/gi,'_')+'.nitrogame';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
async function importFile(file){const txt=await file.text(),j=JSON.parse(txt);if(j.format!=='NitroArcadeGame'||!j.game)throw new Error('Not a NitroArcade .nitrogame file');current=unpack(j.game);stopTest();syncForm();drawEditor();toast('Game imported.')}

function showFeatures(){const list=$('#ngsFeatureList');list.innerHTML=FEATURES.map((f,i)=>'<div><b>'+(i+1)+'.</b> '+f+'</div>').join('');$('#ngsFeatureIntro').textContent='This build currently exposes '+FEATURES.length+' counted Studio features. The engine function counter is calculated from the shipped Studio source.';$('#ngsFeaturesModal').classList.add('open')}
function countEngineFunctions(){
 const node=document.getElementById('nitroGameStudioScript'),src=node?node.textContent:'';const declared=(src.match(/\bfunction\s+[A-Za-z_$][\w$]*\s*\(/g)||[]).length;$('#ngsFunctionCount').textContent=declared;return declared
}
function open(){overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';syncForm();renderLibrary();drawEditor();countEngineFunctions();$('#ngsFeatureCount').onclick=showFeatures}
function close(){stopTest();overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');document.body.style.overflow=''}

window.NitroGameStudio={open,close,importCode,features:FEATURES.slice()};

document.querySelectorAll('[data-edittool]').forEach(b=>b.onclick=()=>{editTool=b.dataset.edittool;document.querySelectorAll('[data-edittool]').forEach(x=>x.classList.toggle('active',x===b));rectStart=null});
$('#ngsClose').onclick=close;
$('#ngsNew').onclick=()=>{if(confirm('Start a new game? Unsaved changes will be lost.')){stopTest();current=newGame();undo=[];redo=[];dirty=false;syncForm();drawEditor()}};
$('#ngsGenerate').onclick=generateLevel;$('#ngsSave').onclick=saveCurrent;$('#ngsPlay').onclick=startTest;$('#ngsStop').onclick=stopTest;$('#ngsUndo').onclick=undoPaint;$('#ngsRedo').onclick=redoPaint;$('#ngsClear').onclick=clearLevel;$('#ngsValidate').onclick=validateGame;$('#ngsShot').onclick=screenshot;
$('#ngsSpriteBtn').onclick=openSpriteLab;$('#ngsScriptBtn').onclick=openScripts;$('#ngsJsBtn').onclick=openJsLab;$('#ngsJsExample').onclick=()=>{$('#ngsJsEditor').value=jsDefault};$('#ngsJsCheck').onclick=testJsSandbox;$('#ngsJsDone').onclick=()=>{saveJsCode();$('#ngsJsModal').classList.remove('open');toast('JavaScript saved in this game.')};
$('#ngsName').oninput=()=>{current.name=$('#ngsName').value;markDirty()};$('#ngsMode').onchange=()=>{current.mode=$('#ngsMode').value;if(current.mode==='dodge'){$('#ngsRule').value='survive';current.rule='survive'}markDirty();drawEditor()};
$('#ngsTheme').onchange=()=>{current.theme=$('#ngsTheme').value;if(current.theme!=='custom')current.colors={...themes[current.theme]};buildColors();buildPalette();markDirty();drawEditor()};
$('#ngsRule').onchange=()=>{current.rule=$('#ngsRule').value;markDirty()};$('#ngsTimer').onchange=()=>{current.timer=Number($('#ngsTimer').value)||60;markDirty()};$('#ngsSpeed').oninput=()=>{current.speed=Number($('#ngsSpeed').value)||1;markDirty()};$('#ngsLives').onchange=()=>{current.lives=Number($('#ngsLives').value)||3;markDirty()};$('#ngsGravity').oninput=()=>{current.gravity=Number($('#ngsGravity').value)||1350;markDirty()};$('#ngsJump').oninput=()=>{current.jump=Number($('#ngsJump').value)||520;markDirty()};$('#ngsDescription').oninput=()=>{current.description=$('#ngsDescription').value;markDirty()};$('#ngsJsEditor').oninput=()=>{current.jsCode=$('#ngsJsEditor').value;markDirty()};

document.querySelectorAll('[data-script]').forEach(b=>b.onclick=()=>switchScript(b.dataset.script));
document.querySelectorAll('[data-scriptpreset]').forEach(b=>b.onclick=()=>applyScriptPreset(b.dataset.scriptpreset));
$('#ngsCompileScript').onclick=()=>{saveScriptEditor();compileCurrentScript()};$('#ngsScriptDone').onclick=()=>{saveScriptEditor();compileCurrentScript();$('#ngsScriptModal').classList.remove('open')};

buildSpritePalette();$('#ngsSpriteTarget').onchange=()=>{spriteTarget=$('#ngsSpriteTarget').value;drawSpriteEditor()};
document.querySelectorAll('[data-spritetool]').forEach(b=>b.onclick=()=>{spriteTool=b.dataset.spritetool});
spriteCanvas.addEventListener('pointerdown',e=>{spritePainting=true;spritePaint(e);try{spriteCanvas.setPointerCapture(e.pointerId)}catch(_){}});spriteCanvas.addEventListener('pointermove',e=>{if(spritePainting&&spriteTool!=='fill')spritePaint(e)});spriteCanvas.addEventListener('pointerup',()=>spritePainting=false);spriteCanvas.addEventListener('pointercancel',()=>spritePainting=false);
$('#ngsMirrorX').onclick=()=>mirrorSprite('x');$('#ngsMirrorY').onclick=()=>mirrorSprite('y');$('#ngsSpriteClear').onclick=()=>{current.sprites[spriteTarget]=blankSprite();markDirty();drawSpriteEditor();drawEditor()};
$('#ngsSpritePreset').onclick=()=>{const col=$('#ngsSpriteColor').value;current.sprites[spriteTarget]=presetSprite(spriteTarget,col);markDirty();drawSpriteEditor();drawEditor()};$('#ngsSpriteDone').onclick=()=>$('#ngsSpriteModal').classList.remove('open');

const shareBox=$('#ngsShareBox');$('#ngsShare').onclick=()=>{$('#ngsShareCode').value=shareCode();shareBox.classList.add('open')};$('#ngsShareClose').onclick=()=>shareBox.classList.remove('open');$('#ngsCopyCode').onclick=()=>copyText(shareCode());$('#ngsCopyLink').onclick=()=>{const u=new URL(location.href);u.hash='nitrogame='+encodeURIComponent(shareCode());copyText(u.toString())};$('#ngsExport').onclick=exportGame;$('#ngsImportBtn').onclick=()=>$('#ngsImportFile').click();$('#ngsImportFile').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{await importFile(file);shareBox.classList.remove('open')}catch(err){alert(err.message)}e.target.value=''};$('#ngsPaste').onclick=()=>{const code=prompt('Paste Nitro Game share code:');if(!code)return;try{importCode(code);shareBox.classList.remove('open')}catch(err){alert(err.message)}};
$('#ngsFeaturesClose').onclick=()=>$('#ngsFeaturesModal').classList.remove('open');$('#ngsFeatureCount').style.cursor='pointer';

const blockedCodes=new Set(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space']);
window.addEventListener('keydown',e=>{
 if(!overlay.classList.contains('open'))return;
 if(play&&blockedCodes.has(e.code)){e.preventDefault();input.keys.add(e.code);input.keys.add(String(e.key).toLowerCase());canvas.focus({preventScroll:true})}
 if(e.key==='Escape'){if($('#ngsFeaturesModal').classList.contains('open'))$('#ngsFeaturesModal').classList.remove('open');else if($('#ngsSpriteModal').classList.contains('open'))$('#ngsSpriteModal').classList.remove('open');else if($('#ngsScriptModal').classList.contains('open'))$('#ngsScriptModal').classList.remove('open');else if($('#ngsJsModal').classList.contains('open'))$('#ngsJsModal').classList.remove('open');else if(shareBox.classList.contains('open'))shareBox.classList.remove('open');else if(play)stopTest();else close()}
});
window.addEventListener('keyup',e=>{input.keys.delete(e.code);input.keys.delete(String(e.key).toLowerCase())});
window.addEventListener('blur',()=>input.keys.clear());

document.querySelectorAll('[data-vkey]').forEach(b=>{
 const k=b.dataset.vkey;const down=e=>{e.preventDefault();input.virtual.add(k);canvas.focus({preventScroll:true})};const up=e=>{e.preventDefault();input.virtual.delete(k)};
 b.addEventListener('pointerdown',down);b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('pointerleave',up)
});

try{if(location.hash.startsWith('#nitrogame=')){const code=decodeURIComponent(location.hash.slice('#nitrogame='.length));importCode(code);open();history.replaceState(null,'',location.pathname+location.search)}}catch(err){console.warn('NitroGame share import failed',err)}

loadDraft();buildPalette();buildColors();renderLibrary();drawEditor();countEngineFunctions();
})();
