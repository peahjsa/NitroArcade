/* NitroArcade Game Studio add-ons: project presets, backup, snapshots, grid, shortcuts */
(()=>{'use strict';
const $=id=>document.getElementById(id);
function download(filename,data,type='application/json'){
 const blob=new Blob([data],{type}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(u),1500)
}
const ids=['ngsName','ngsMode','ngsTheme','ngsRule','ngsTimer','ngsSpeed','ngsLives','ngsGravity','ngsJump','ngsDescription'];
function snapshot(){let fields={};for(const id of ids){const e=$(id);if(e)fields[id]=e.value}return {format:'nitro-studio-settings-v1',date:new Date().toISOString(),fields}}
function restore(data){if(!data||data.format!=='nitro-studio-settings-v1'||typeof data.fields!=='object')throw Error('Not a Nitro Studio settings backup');for(const id of ids){const el=$(id);if(el&&typeof data.fields[id]==='string'){el.value=data.fields[id];el.dispatchEvent(new Event('change',{bubbles:true}));el.dispatchEvent(new Event('input',{bubbles:true}))}}}
function addButton(parent,label,fn){const b=document.createElement('button');b.type='button';b.className='ngs-btn';b.textContent=label;b.onclick=fn;parent.append(b);return b}
function init(){const bar=document.querySelector('#ngsOverlay .ngs-stagebar');if(!bar||$('ngsExtraTools'))return;
 const box=document.createElement('div');box.id='ngsExtraTools';box.style.cssText='display:inline-flex;align-items:center;gap:5px;flex-wrap:wrap';
 addButton(box,'GRID',()=>{const c=$('ngsCanvas');if(!c)return;c.classList.toggle('nitro-studio-grid');});
 addButton(box,'EXPORT SETTINGS',()=>download('nitrostudio-settings.json',JSON.stringify(snapshot(),null,2)));
 const input=document.createElement('input');input.type='file';input.accept='.json,application/json';input.style.display='none';input.onchange=async()=>{try{const f=input.files?.[0];if(!f)return;restore(JSON.parse(await f.text()));alert('Studio settings restored. Existing level tiles were not overwritten.')}catch(e){alert('Import failed: '+e.message)}input.value=''};box.append(input);
 addButton(box,'IMPORT SETTINGS',()=>input.click());
 addButton(box,'SAVE CANVAS',()=>{const c=$('ngsCanvas');if(!c)return;try{c.toBlob(blob=>{if(!blob)return;const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='nitro-game-studio.png';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)},'image/png')}catch(e){alert('Cannot export this canvas: '+e.message)}});
 const preset=document.createElement('select');preset.setAttribute('aria-label','Game Studio quick preset');preset.className='ngs-btn';
 for(const [value,text] of [['','QUICK PRESETS'],['arcade','Arcade platformer'],['float','Low gravity'],['speed','Speed run'],['survival','Survival mode']]){let o=document.createElement('option');o.value=value;o.textContent=text;preset.append(o)}
 preset.onchange=()=>{const x=preset.value;if(!x)return;const set=(id,val)=>{let e=$(id);if(e){e.value=val;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}))}};
 if(x==='arcade'){set('ngsMode','platformer');set('ngsSpeed','1');set('ngsGravity','1350');set('ngsJump','520');set('ngsTheme','neon')}
 if(x==='float'){set('ngsMode','platformer');set('ngsSpeed','1.1');set('ngsGravity','500');set('ngsJump','700');set('ngsTheme','ice')}
 if(x==='speed'){set('ngsMode','platformer');set('ngsSpeed','1.8');set('ngsGravity','1350');set('ngsJump','600');set('ngsTimer','45')}
 if(x==='survival'){set('ngsMode','dodge');set('ngsRule','survive');set('ngsTimer','90');set('ngsLives','5')}
 preset.value='';};box.append(preset);bar.append(box);
 const style=document.createElement('style');style.textContent='#ngsCanvas.nitro-studio-grid{outline:2px solid #78d9ff;outline-offset:1px;background-image:linear-gradient(#85cfff18 1px,transparent 1px),linear-gradient(90deg,#85cfff18 1px,transparent 1px);background-size:40px 40px}#ngsExtraTools .ngs-btn{font-size:10px;padding:6px}';document.head.append(style);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();