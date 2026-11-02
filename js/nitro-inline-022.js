
(()=>{
const $=id=>document.getElementById(id);
const DB='nitroarcade_forum_v1',STORE='posts';
let db=null,posts=[],urls=[];
const show=(message)=>{const t=$('nfToast');t.textContent=message;t.style.display='block';clearTimeout(show.timer);show.timer=setTimeout(()=>t.style.display='none',3500)};
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function openDB(){return new Promise((resolve,reject)=>{if(!indexedDB)return reject(Error('IndexedDB unavailable'));const q=indexedDB.open(DB,1);q.onupgradeneeded=()=>{if(!q.result.objectStoreNames.contains(STORE))q.result.createObjectStore(STORE,{keyPath:'id'})};q.onsuccess=()=>{db=q.result;resolve(db)};q.onerror=()=>reject(q.error)})}
function tx(mode,work){return new Promise((resolve,reject)=>{const t=db.transaction(STORE,mode),st=t.objectStore(STORE);let result;try{result=work(st)}catch(e){reject(e);return}t.oncomplete=()=>resolve(result);t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error)})}
function load(){return new Promise((resolve,reject)=>{const t=db.transaction(STORE,'readonly');const q=t.objectStore(STORE).getAll();q.onsuccess=()=>{posts=q.result.sort((a,b)=>b.created-a.created);render()};q.onerror=()=>reject(q.error);t.oncomplete=()=>resolve()})}
function clearUrls(){urls.forEach(u=>URL.revokeObjectURL(u));urls=[]}
function blobUrl(b){const u=URL.createObjectURL(b);urls.push(u);return u}
function render(){
 clearUrls();
 const query=$('nfSearch').value.toLowerCase().trim(),tag=$('nfTagFilter').value;
 const tags=[...new Set(posts.flatMap(p=>p.tags||[]))].sort();
 $('nfTagFilter').innerHTML='<option value="">All tags</option>'+tags.map(t=>'<option value="'+escapeHTML(t)+'">'+escapeHTML(t)+'</option>').join('');
 $('nfTagFilter').value=tags.includes(tag)?tag:'';
 const found=posts.filter(p=>(!tag||(p.tags||[]).includes(tag))&&(!query||[p.title,p.author,p.body,...(p.tags||[])].join(' ').toLowerCase().includes(query)));
 $('nfCount').textContent=found.length+' posts · '+posts.length+' stored';
 const container=$('nfPosts');container.replaceChildren();
 if(!found.length){container.textContent=posts.length?'No posts match your search.':'No posts yet. Create the first discussion!';return}
 for(const p of found){
 const article=document.createElement('article');article.className='nfPost';
 const meta=document.createElement('div');meta.className='nfMeta';meta.textContent=p.author+' · '+new Date(p.created).toLocaleString();article.appendChild(meta);
 const h=document.createElement('h3');h.textContent=p.title;article.appendChild(h);
 const tagsRow=document.createElement('div');tagsRow.style.marginBottom='10px';
 (p.tags||[]).forEach(t=>{const x=document.createElement('span');x.className='nfTag';x.textContent='#'+t;tagsRow.appendChild(x)});article.appendChild(tagsRow);
 const body=document.createElement('p');body.textContent=p.body||'';article.appendChild(body);
 if(p.files?.length){
 const area=document.createElement('div');area.className='nfAttachments';
 for(const f of p.files){
 const box=document.createElement('div');box.className='nfAttach';
 const name=document.createElement('span');name.textContent='📎 '+f.name+' ('+(f.blob.size/1024).toFixed(1)+' KB)';box.appendChild(name);
 const url=blobUrl(f.blob);
 if(f.type.startsWith('image/')){const el=document.createElement('img');el.src=url;el.alt=f.name;el.loading='lazy';box.appendChild(el)}
 else if(f.type.startsWith('audio/')){const el=document.createElement('audio');el.controls=true;el.src=url;box.appendChild(el)}
 else if(f.type.startsWith('video/')){const el=document.createElement('video');el.controls=true;el.src=url;box.appendChild(el)}
 else if(/^(text\/|application\/json|application\/javascript)/.test(f.type)||/\.(js|html|css|py|java|cpp|c|txt|json|md)$/i.test(f.name)){const pre=document.createElement('pre');f.blob.slice(0,15000).text().then(t=>{if(pre.isConnected)pre.textContent=t});box.appendChild(pre)}
 const link=document.createElement('a');link.href=url;link.download=f.name;link.textContent='⬇ Download file';box.appendChild(link);area.appendChild(box)
 }
 article.appendChild(area)
 }
 const actions=document.createElement('div');actions.className='nfActions';
 const del=document.createElement('button');del.textContent='🗑 Delete';del.onclick=async()=>{if(!confirm('Delete this post and its attachments from this browser?'))return;await tx('readwrite',st=>st.delete(p.id));await load();show('Post deleted')};actions.appendChild(del);article.appendChild(actions);
 container.appendChild(article)
 }
}
async function submit(e){
 e.preventDefault();
 if(!db){show('Storage unavailable. Cannot publish.');return}
 const files=[...$('nfFiles').files];if(files.length>8||files.some(f=>f.size>15*1024*1024)||files.reduce((n,f)=>n+f.size,0)>40*1024*1024){show('Maximum 8 files, 15 MB each, 40 MB total');return}
 const p={id:crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random(),created:Date.now(),author:$('nfAuthor').value.trim().slice(0,40),title:$('nfTitle').value.trim(),body:$('nfBody').value.trim(),tags:[...new Set($('nfTags').value.split(',').map(t=>t.trim().toLowerCase()).filter(Boolean))].slice(0,12),files:files.map(f=>({name:f.name,type:f.type,blob:f}))};
 if(!p.author||!p.title){show('Please enter a name and title');return}
 try{await tx('readwrite',st=>st.put(p));$('nfCompose').reset();$('nfAuthor').value=p.author;await load();show('Saved permanently in this browser!')}catch(e){show('Could not save: '+e.message)}
}
async function exportBackup(){
 if(!db)return show('Storage unavailable');
 await load();
 const data=[];
 for(const p of posts){const attachments=[];for(const f of p.files||[]){const buffer=await f.blob.arrayBuffer();const bytes=new Uint8Array(buffer);let str='';for(let i=0;i<bytes.length;i+=32768)str+=String.fromCharCode(...bytes.subarray(i,i+32768));attachments.push({name:f.name,type:f.type,data:btoa(str)})}data.push({...p,files:attachments})}
 const blob=new Blob([JSON.stringify({format:'NitroForumBackupV1',posts:data})],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='NitroArcade-Forum-Backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),15000);show('Backup downloaded — copy it to your USB drive')
}
async function importBackup(file){
 if(!db)return show('Storage unavailable');
 if(file.size>150*1024*1024)return show('Backup too large');
 try{
 const data=JSON.parse(await file.text());if(data.format!=='NitroForumBackupV1'||!Array.isArray(data.posts)||data.posts.length>5000)throw Error('Invalid forum backup');
 let count=0;
 for(const p of data.posts){
 if(typeof p.id!=='string'||typeof p.title!=='string'||!Array.isArray(p.files))continue;
 const files=[];
 for(const f of p.files.slice(0,8)){if(typeof f.data!=='string'||f.data.length>21e6)continue;const bin=atob(f.data),bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);files.push({name:String(f.name).slice(0,255),type:String(f.type||''),blob:new Blob([bytes],{type:f.type||''})})}
 await tx('readwrite',st=>st.put({id:p.id,created:Number(p.created)||Date.now(),author:String(p.author||'Guest').slice(0,40),title:p.title.slice(0,130),body:String(p.body||'').slice(0,12000),tags:(p.tags||[]).filter(t=>typeof t==='string').slice(0,12),files}));count++
 }
 await load();show('Imported '+count+' posts')
 }catch(e){show('Import failed: '+e.message)}
}
function tab(isISG){$('nfContent').style.display=isISG?'none':'block';$('nfISG').style.display=isISG?'block':'none';$('nfForumTab').classList.toggle('primary',!isISG);$('nfISGTab').classList.toggle('primary',isISG)}
window.NitroForum={open(){tab(false);$('nfOverlay').classList.add('active');document.body.style.overflow='hidden';if(db)load()},openISG(){tab(true);$('nfOverlay').classList.add('active');document.body.style.overflow='hidden'}};
function close(){$('nfOverlay').classList.remove('active');document.body.style.overflow=''}
$('nfClose').onclick=close;$('nfForumTab').onclick=()=>tab(false);$('nfISGTab').onclick=()=>tab(true);$('nfBackToPosts').onclick=()=>tab(false);
$('nfCompose').addEventListener('submit',submit);$('nfSearch').oninput=render;$('nfTagFilter').onchange=render;
$('nfBackup').onclick=exportBackup;$('nfRestore').onclick=()=>$('nfImportFile').click();
$('nfImportFile').onchange=async e=>{const f=e.target.files[0];if(f)await importBackup(f);e.target.value=''};
$('nfFiles').onchange=()=>{$('nfFileList').textContent=[...$('nfFiles').files].map(f=>f.name).join(', ')||'No files selected'};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('nfOverlay').classList.contains('active'))close()});
openDB().then(load).catch(e=>{$('nfSaveStatus').textContent='⚠ Storage unavailable: '+e.message;$('nfPosts').textContent='Forum storage could not initialize in this browser.'});
})();
