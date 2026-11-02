
(()=>{
const $=id=>document.getElementById(id), root=document.body, status=t=>$('nsStatus').textContent=t;
const themeNames=['dark','light','blue','ruffle','neon','sunset','matrix'];
const themeLabels=['🌑 Dark','☀️ Light','🔵 Blue','🟨 Ruffle','💜 Neon','🌅 Sunset','💚 Matrix'];
const colors={'--bg':'Background','--panel':'Panels','--panel-2':'Secondary panels','--line':'Borders','--text':'Text','--muted':'Muted text','--accent':'Accent','--orange':'Buttons'};
const defaultColors={'--bg':'#070809','--panel':'#0d0f12','--panel-2':'#12151a','--line':'#22262d','--text':'#f3f5f7','--muted':'#8b949e','--accent':'#8fc7cb','--orange':'#ff6a1a'};
const keyTheme='nitroarcade:style-custom-theme',keyDisplay='nitroarcade:style-display';
function download(filename,obj){const u=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function cleanName(v){return (v||'custom').replace(/[^a-z0-9_-]+/gi,'-').slice(0,60)}
function readJSON(k){try{return JSON.parse(localStorage.getItem(k))}catch{return null}}
function setThemeCustom(data,save=true){if(!data||!data.colors)return;root.classList.remove(...themeNames.filter(x=>x!=='dark').map(x=>'theme-'+x));$('nsCustomThemeRules').textContent='body{'+Object.entries(data.colors).filter(([k,v])=>k in colors && /^#[0-9a-f]{6}$/i.test(v)).map(([k,v])=>k+':'+v+'!important').join(';')+'}';$('nsThemeName').value=data.name||'Custom theme';Object.keys(colors).forEach(k=>{const input=document.querySelector('[data-nscolor="'+k+'"]');if(input&&data.colors[k])input.value=data.colors[k]});paintTheme();if(save)localStorage.setItem(keyTheme,JSON.stringify(data));status('Custom theme applied');}
function applyPreset(name){root.classList.remove('nitro-color-custom');$('nsCustomThemeRules').textContent='';localStorage.removeItem(keyTheme);if(typeof window.setTheme==='function')window.setTheme(name);else{root.classList.remove(...themeNames.map(x=>'theme-'+x));if(name!=='dark')root.classList.add('theme-'+name)};requestAnimationFrame(()=>{Object.keys(colors).forEach(k=>{const v=getComputedStyle(root).getPropertyValue(k).trim();if(/^#[0-9a-f]{6}$/i.test(v))document.querySelector('[data-nscolor="'+k+'"]').value=v})});status('Theme: '+name)}
function getColors(){const o={};Object.keys(colors).forEach(k=>o[k]=document.querySelector('[data-nscolor="'+k+'"]').value);return o}
const crtCSS=(()=>{const src=document.querySelector('style#crtStyles,style#crt-style,style#crtCSS');return src?src.textContent:''})();
const displays=[['normal','🖥️ Normal'],['crt','📺 CRT'],['dither','▦ Dithering'],['mono','⬛ Monochrome'],['vintage','📼 Vintage'],['custom','🧪 Custom CSS']];
function setDisplay(mode,css='',name='Custom display',save=true){root.classList.remove('crt','nitro-custom-display');let rule='';if(mode==='crt')root.classList.add('crt');if(mode==='dither')rule='body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:4000;opacity:.22;background-image:repeating-conic-gradient(#000 0 25%,transparent 0 50%);background-size:4px 4px}';if(mode==='mono')rule='html{filter:grayscale(1)!important}';if(mode==='vintage')rule='html{filter:sepia(.22) saturate(.85)}';if(mode==='custom'){root.classList.add('nitro-custom-display');rule=css;$('nsCode').value=css;$('nsDisplayName').value=name;}$('nsDisplayRules').textContent=rule;if(save)localStorage.setItem(keyDisplay,JSON.stringify({mode,css:mode==='custom'?css:'',name}));status('Display: '+(displays.find(d=>d[0]===mode)?.[1]||mode));}
function openFile(ext,callback){const i=$('nsFile');i.value='';i.accept=ext;i.onchange=async()=>{const f=i.files?.[0];if(!f)return;try{const data=JSON.parse(await f.text());callback(data)}catch(e){status('Could not import file: '+e.message)}};i.click()}
const nsThemePaint=document.createElement('style');nsThemePaint.id='nsThemePaint';document.head.appendChild(nsThemePaint);
function paintTheme(){nsThemePaint.textContent=`
body.nitro-color-custom{background:var(--bg)!important}
body.nitro-color-custom .navbar{background:var(--panel)!important}
body.nitro-color-custom .hero,body.nitro-color-custom .game-card,body.nitro-color-custom .game-topbar,body.nitro-color-custom .stat,body.nitro-color-custom .modal,body.nitro-color-custom .about-feature,body.nitro-color-custom .team-card,body.nitro-color-custom .recent-item{background:var(--panel)!important;border-color:var(--line)!important}
body.nitro-color-custom .btn-primary,body.nitro-color-custom .play-pill,body.nitro-color-custom .hero-play{background:var(--orange)!important}
body.nitro-color-custom .btn,body.nitro-color-custom .filter-chip{border-color:var(--line)!important}
body.nitro-color-custom .hero-copy,body.nitro-color-custom .game-meta p{color:var(--muted)!important}
`;root.classList.add('nitro-color-custom')}
Object.entries(colors).forEach(([key,label])=>{const wrap=document.createElement('label');wrap.className='nsField';wrap.textContent=label;const i=document.createElement('input');i.type='color';i.dataset.nscolor=key;i.value=defaultColors[key];i.addEventListener('input',()=>setThemeCustom({format:'nitrotheme',version:1,name:$('nsThemeName').value||'Custom theme',colors:getColors()}));wrap.append(i);$('nsColors').append(wrap)});
themeNames.forEach((name,i)=>{const b=document.createElement('button');b.className='nsPreset';b.innerHTML='<strong>'+themeLabels[i]+'</strong><small>Apply preset</small>';b.onclick=()=>applyPreset(name);$('nsThemePresets').append(b)});
displays.forEach(([mode,label])=>{const b=document.createElement('button');b.className='nsPreset';b.innerHTML='<strong>'+label+'</strong><small>Apply display</small>';b.onclick=()=>{const d=readJSON(keyDisplay);setDisplay(mode,mode==='custom'?($('nsCode').value||d?.css||''):'',$('nsDisplayName').value)};$('nsDisplayPresets').append(b)});
$('nitroStyleClose').onclick=()=>{ $('nitroStyleOverlay').classList.remove('open'); if(document.documentElement.style.filter)document.documentElement.style.filter=''; };$('nitroStyleOverlay').onclick=e=>{if(e.target===$('nitroStyleOverlay'))$('nitroStyleOverlay').classList.remove('open')};document.addEventListener('keydown',e=>{if(e.key==='Escape')$('nitroStyleOverlay').classList.remove('open')});
document.querySelectorAll('[data-style-tab]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-style-tab]').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('[data-style-section]').forEach(x=>x.classList.toggle('active',x.dataset.styleSection===b.dataset.styleTab))});
$('nsApplyTheme').onclick=()=>setThemeCustom({format:'nitrotheme',version:1,name:$('nsThemeName').value||'Custom theme',colors:getColors()});
$('nsSaveTheme').onclick=()=>{const d={format:'nitrotheme',version:1,name:$('nsThemeName').value||'Custom theme',colors:getColors()};setThemeCustom(d);download(cleanName(d.name)+'.nitrotheme',d)};
$('nsLoadTheme').onclick=()=>openFile('.nitrotheme',d=>{if(d.format!=='nitrotheme'||!d.colors||typeof d.colors!=='object')throw Error('Invalid .nitrotheme');setThemeCustom(d)});
$('nsApplyDisplay').onclick=()=>setDisplay('custom',$('nsCode').value,$('nsDisplayName').value);
$('nsSaveDisplay').onclick=()=>{const d={format:'nitrodisplay',version:1,name:$('nsDisplayName').value||'Custom display',css:$('nsCode').value};setDisplay('custom',d.css,d.name);download(cleanName(d.name)+'.nitrodisplay',d)};
$('nsLoadDisplay').onclick=()=>openFile('.nitrodisplay',d=>{if(d.format!=='nitrodisplay'||typeof d.css!=='string')throw Error('Invalid .nitrodisplay');setDisplay('custom',d.css,d.name)});
$('nsClearDisplay').onclick=()=>setDisplay('normal');
window.NitroStyle={open(){ $('nitroStyleOverlay').classList.add('open');status('Choose a theme or display');}};
const t=readJSON(keyTheme);if(t)setThemeCustom(t,false);localStorage.removeItem(keyDisplay);setDisplay('normal','','',false);
})();
