
(()=>{
const $=id=>document.getElementById(id);
function rescue(){
  localStorage.removeItem('nitroarcade:style-display');
  document.body.classList.remove('crt','nitro-custom-display');
  const rules=$('nsDisplayRules');if(rules)rules.textContent='';
  document.documentElement.style.filter='none';
  document.querySelectorAll('#ngsJsModal,#ngsScriptModal,#ngsSpriteModal,#ngsFeaturesModal,#ngsShareModal').forEach(el=>el.classList.remove('open'));
  const studio=$('ngsOverlay');if(studio){studio.style.display='none';studio.setAttribute('aria-hidden','true')}
  const style=$('nsOverlay');if(style)style.classList.remove('open');
  $('nitroMixPanel').classList.remove('open');
  location.reload();
}

document.addEventListener('keydown',e=>{
  if(e.ctrlKey&&e.altKey&&e.key.toLowerCase()==='d'){e.preventDefault();rescue();return}
  if(e.key==='Escape'){
    const js=$('ngsJsModal');
    if(js?.classList.contains('open')){js.classList.remove('open');e.stopImmediatePropagation();return}
    if($('nitroMixPanel').classList.contains('open')){$('nitroMixPanel').classList.remove('open');e.stopImmediatePropagation()}
  }
},true);
const bgm=$('musicToggle');
if(bgm){bgm.removeAttribute('onclick');bgm.title='Open Nitro Mixtape Studio';bgm.innerHTML='🎵 Mixtapes';bgm.onclick=()=>{$('nitroMixPanel').classList.add('open')}}
$('nitroMixClose').onclick=()=>$('nitroMixPanel').classList.remove('open');
let tracks=[],active=-1;
const audio=$('nitroMixAudio');
function draw(){
 const list=$('nitroMixTracks');list.replaceChildren();
 $('nitroMixInfo').textContent=tracks.length+' track(s) • Click a track to play';
 tracks.forEach((t,i)=>{
  const div=document.createElement('div');div.className='mixtrack';
  const name=document.createElement('span');name.textContent=(i===active?'▶ ':'')+t.name;
  const actions=document.createElement('span');
  for(const [label,fn] of [['▶',()=>play(i)],['↑',()=>move(i,-1)],['↓',()=>move(i,1)],['✕',()=>{tracks.splice(i,1);if(active===i){audio.pause();audio.removeAttribute('src');active=-1}else if(active>i)active--;draw()}]]){
   const b=document.createElement('button');b.textContent=label;b.onclick=fn;actions.append(b);
  }
  div.append(name,actions);list.append(div);
 });
}
function move(i,d){const j=i+d;if(j<0||j>=tracks.length)return;[tracks[i],tracks[j]]=[tracks[j],tracks[i]];if(active===i)active=j;else if(active===j)active=i;draw()}
function play(i){if(!tracks[i])return;active=i;audio.src=tracks[i].data;audio.play().catch(()=>{});draw()}
function next(d=1){if(!tracks.length)return;let i=active+d;if(i>=tracks.length){if(!$('nitroMixLoop').checked){audio.pause();return}i=0}if(i<0)i=tracks.length-1;play(i)}
$('nitroMixPrev').onclick=()=>next(-1);$('nitroMixNext').onclick=()=>next(1);
audio.onended=()=>next(1);
$('nitroMixFiles').onchange=async e=>{
 for(const f of Array.from(e.target.files||[])){
  if(!f.type.startsWith('audio/')&&!/\.(mp3|wav|ogg|m4a|flac)$/i.test(f.name))continue;
  const data=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(f)});
  tracks.push({name:f.name,data});
 }
 draw();e.target.value='';
};
$('nitroMixSave').onclick=()=>{
 const name=$('nitroMixName').value.trim()||'Mixtape';
 const obj={format:'nitromix',version:1,name,tracks};
 const blob=new Blob([JSON.stringify(obj)],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name.replace(/[^a-z0-9_-]/gi,'_')+'.nitromix';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
$('nitroMixLoad').onclick=()=>$('nitroMixImport').click();
$('nitroMixImport').onchange=async e=>{
 try{
 const obj=JSON.parse(await e.target.files[0].text());
 if(obj.format!=='nitromix'||!Array.isArray(obj.tracks)||obj.tracks.some(t=>typeof t.name!=='string'||typeof t.data!=='string'||!t.data.startsWith('data:audio/')))throw Error('Invalid mixtape');
 tracks=obj.tracks;$('nitroMixName').value=String(obj.name||'Imported Mixtape').slice(0,90);active=-1;audio.pause();audio.removeAttribute('src');draw();
 }catch(err){alert('Could not open mixtape: '+err.message)}
 e.target.value='';
};
$('nitroMixClear').onclick=()=>{audio.pause();audio.removeAttribute('src');tracks=[];active=-1;draw()};
draw();
})();
