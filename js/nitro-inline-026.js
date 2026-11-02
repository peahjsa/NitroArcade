
(function(){
'use strict';
const byId=id=>document.getElementById(id);
const overlay=byId('npOverlay');
const content=byId('npContent');
const names={command:'Command Center',quests:'Daily Quests',notes:'Arcade Notebook',stats:'Player Statistics',settings:'Personalize NitroArcade',help:'Help & Shortcuts'};
const K={notes:'nitroplus_notes_v2',quests:'nitroplus_quests_v2',settings:'nitroplus_settings_v2',events:'nitroplus_events_v2',sessions:'nitroplus_sessions_v2'};
let currentTab='command';
let activeSearch='';
let openedAt=Date.now();
let toastTimer;
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function read(key,fallback){try{const raw=localStorage.getItem(key);return raw===null?fallback:JSON.parse(raw)}catch(e){return fallback}}
function write(key,val){try{localStorage.setItem(key,JSON.stringify(val));return true}catch(e){toast('Storage is unavailable or full');return false}}
function toast(message){const el=byId('npToast');el.textContent=message;el.style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.style.display='none',2800)}
function el(tag,attrs={},text){const n=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>{if(k==='class')n.className=v;else if(k==='onclick')n.addEventListener('click',v);else n.setAttribute(k,v)});if(text!==undefined)n.textContent=text;return n}
function close(){overlay.classList.remove('open');document.body.style.overflow=''}
function open(tab='command'){
currentTab=names[tab]?tab:'command';
overlay.classList.add('open');
document.body.style.overflow='hidden';
render();
}
function navigate(action){
close();
try{
switch(action){
case 'home': if(typeof NitroNeo!=='undefined')NitroNeo.home();break;
case 'small': if(typeof showArcadePart==='function')showArcadePart('small');break;
case 'big': if(typeof showArcadePart==='function')showArcadePart('big');break;
case 'challenge': if(typeof showArcadePart==='function')showArcadePart('challenge');break;
case 'forum': NitroForum.open();break;
case 'isg': NitroForum.openISG();break;
case 'about': openAboutPage();break;
case 'history': NitroTen.openHistory();break;
case 'lab': if(typeof openNitroLab==='function')openNitroLab();else document.querySelector('[onclick*="openNitroLab"]')?.click();break;
case 'studio': NitroGameStudio.open();break;
case 'style': NitroStyle.open();break;
case 'shop': openToyShop();break;
case 'achievements': NitroSystems.open('trophies');break;
case 'profile': if(typeof toggleFeatureDrawer==='function')toggleFeatureDrawer();break;
case 'vault': NitroVault.open('network');break;
case 'quests':open('quests');break;
case 'notes':open('notes');break;
case 'stats':open('stats');break;
case 'settings':open('settings');break;
case 'help':open('help');break;
default:toast('Unknown command');
}
}catch(e){toast('This tool could not open: '+e.message)}
}
const COMMANDS=[{"title": "Arcade dashboard", "action": "home", "description": "Return to the main dashboard", "icon": "\u2302"}, {"title": "Small games", "action": "small", "description": "Open quick arcade games", "icon": "\u25a3"}, {"title": "Big games", "action": "big", "description": "Open larger games", "icon": "\u25c8"}, {"title": "Hacker Challenge", "action": "challenge", "description": "Play the original CyberArcade legacy challenge", "icon": "\u2318"}, {"title": "Community forum", "action": "forum", "description": "Write posts and attach media", "icon": "\u2637"}, {"title": "ISG Forum tribute", "action": "isg", "description": "Read the student-made ISG tribute", "icon": "\u25a4"}, {"title": "About and team", "action": "about", "description": "Meet the NitroArcade team", "icon": "\u24d8"}, {"title": "Arcade history", "action": "history", "description": "Explore five arcade eras", "icon": "\u25f7"}, {"title": "NitroLab", "action": "lab", "description": "Open visual effects experiments", "icon": "\u2726"}, {"title": "Game Studio", "action": "studio", "description": "Create games and prototypes", "icon": "\u2b21"}, {"title": "Style Studio", "action": "style", "description": "Customize the arcade appearance", "icon": "\u2699"}, {"title": "Prize Shop", "action": "shop", "description": "Browse the arcade prize shop", "icon": "\u25c9"}, {"title": "Achievements", "action": "achievements", "description": "View trophies and progress", "icon": "\ud83c\udfc6"}, {"title": "Player Hub", "action": "profile", "description": "See local player information", "icon": "\u2605"}, {"title": "Vault", "action": "vault", "description": "Explore the vault tools", "icon": "\u25c7"}, {"title": "Daily Quests", "action": "quests", "description": "Track your daily arcade goals", "icon": "\u2691"}, {"title": "Arcade Notebook", "action": "notes", "description": "Save your project ideas", "icon": "\u25a4"}, {"title": "Player Statistics", "action": "stats", "description": "Review activity on this browser", "icon": "\u25a5"}, {"title": "Settings", "action": "settings", "description": "Configure dashboard preferences", "icon": "\u2699"}, {"title": "Help and shortcuts", "action": "help", "description": "Learn keyboard shortcuts", "icon": "?"}];
function render(){
byId('npTitle').textContent=names[currentTab];
document.querySelectorAll('[data-np-tab]').forEach(b=>b.classList.toggle('active',b.dataset.npTab===currentTab));
content.replaceChildren();
switch(currentTab){
case 'command':renderCommands();break;
case 'quests':renderQuests();break;
case 'notes':renderNotes();break;
case 'stats':renderStats();break;
case 'settings':renderSettings();break;
case 'help':renderHelp();break;
}
}
function heading(text,desc){
content.append(el('h3',{},text));
content.append(el('p',{class:'npIntro'},desc));
}
function renderCommands(){
heading('EVERYTHING. ONE PLACE.','Search for games, tools, pages and shortcuts. Select a command to launch it.');
const input=el('input',{type:'search',placeholder:'Search commands…',style:'width:100%;font-size:15px;padding:15px',id:'npCommandInput'});
input.value=activeSearch;
content.append(input);
const results=el('div',{class:'npSearchList'});
content.append(results);
function filter(){
activeSearch=input.value;
results.replaceChildren();
const q=activeSearch.trim().toLowerCase();
const matching=COMMANDS.filter(x=>(x.title+' '+x.description).toLowerCase().includes(q));
if(!matching.length){results.append(el('p',{class:'npIntro'},'No matching commands.'));return}
matching.forEach(item=>{
const b=el('button',{class:'npSearchResult',onclick:()=>navigate(item.action)});
const info=el('span');
info.append(el('strong',{},item.icon+' '+item.title),el('br'),el('small',{},item.description));
b.append(info,el('span',{class:'npTag'},'OPEN ↗'));
results.append(b);
});
}
input.addEventListener('input',filter);
filter();
if(document.getElementById('npOverlay')?.classList.contains('open'))setTimeout(()=>input.focus({preventScroll:true}),40);
}
const QUESTS=[
{id:'explore',icon:'🎮',title:'Explore the arcade',detail:'Open a game category from the dashboard'},
{id:'legacy',icon:'⌘',title:'Visit the CyberArcade legacy',detail:'Check out the five-test Hacker Challenge'},
{id:'create',icon:'🛠',title:'Create something',detail:'Open NitroLab or Game Studio'},
{id:'community',icon:'💬',title:'Join the discussion',detail:'Visit the community forum'},
{id:'history',icon:'◷',title:'Explore our history',detail:'Read the five-era arcade timeline'},
{id:'style',icon:'🎨',title:'Customize your experience',detail:'Try the color editor or Style Studio'},
{id:'note',icon:'▤',title:'Write a new idea',detail:'Add an idea to your arcade notebook'},
{id:'isg',icon:'🏫',title:'Celebrate ISG',detail:'Visit the ISG Forum tribute page'}
];
function day(){return new Date().toLocaleDateString('en-CA')}
function questState(){const state=read(K.quests,{});return state.date===day()?state:{date:day(),done:{}}}
function renderQuests(){
const state=questState();
const completed=QUESTS.filter(q=>state.done[q.id]).length;
heading('DAILY ARCADE MISSIONS','Optional creative goals. Your checklist resets each calendar day on this computer.');
const summary=el('div',{class:'npCard'});
summary.append(el('small',{},'TODAY / '+day()),el('div',{class:'npStatBig'},completed+' / '+QUESTS.length+' COMPLETE'));
const bar=el('div',{class:'npProgress'});bar.append(el('span',{style:'width:'+(completed/QUESTS.length*100)+'%'}));summary.append(bar);
summary.append(el('p',{},'No pressure, no streaks — just fun ideas for exploring your arcade.'));
content.append(summary);
QUESTS.forEach(q=>{
const done=!!state.done[q.id];
const row=el('div',{class:'npQuest'+(done?' done':'')});
row.append(el('span',{},q.icon));
const detail=el('div');detail.append(el('b',{},q.title),el('small',{},q.detail));row.append(detail);
row.append(el('button',{onclick:()=>{const next=questState();next.done[q.id]=!next.done[q.id];write(K.quests,next);renderQuests()}},done?'✓ Done':'Mark done'));
content.append(row);
});
const reset=el('button',{class:'npAction',onclick:()=>{if(confirm('Reset today’s checklist?')){write(K.quests,{date:day(),done:{}});renderQuests()}}},'↻ Reset today');
content.append(reset);
}
function renderNotes(){
heading('ARCADE NOTEBOOK','Keep ideas for games, music, effects and future updates. Notes are saved automatically in this browser.');
const saved=read(K.notes,{title:'My arcade ideas',body:''});
const title=el('input',{type:'text',maxlength:'100',placeholder:'Notebook title',style:'width:100%;margin-bottom:12px',id:'npNoteTitle'});
title.value=saved.title||'';
const area=el('textarea',{placeholder:'Game ideas, music ideas, things to fix, presentation notes…',id:'npNoteArea'});
area.value=saved.body||'';
const status=el('div',{class:'npNotesSaved'},'✓ Ready to write');
let timer;
function save(){const ok=write(K.notes,{title:title.value,body:area.value,updated:Date.now()});status.textContent=ok?'✓ Saved locally at '+new Date().toLocaleTimeString():'Unable to save'}
function changed(){status.textContent='Saving…';clearTimeout(timer);timer=setTimeout(save,500)}
title.addEventListener('input',changed);
area.addEventListener('input',changed);
content.append(title,area,status);
const controls=el('div',{class:'npRow'});
controls.append(el('button',{class:'npAction',onclick:()=>{save();toast('Notebook saved')}},'SAVE NOW'));
controls.append(el('button',{class:'npAction',onclick:()=>{const data={title:title.value,body:area.value};download('NitroArcade-Notebook.txt',data.title+'\\n\\n'+data.body,'text/plain')}},'EXPORT TEXT'));
controls.append(el('button',{class:'npAction',onclick:()=>{if(confirm('Clear this notebook?')){title.value='';area.value='';save()}}},'CLEAR'));
content.append(controls);
}
function download(name,body,type){
const blob=new Blob([body],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');
a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),12000);
}
function renderStats(){
heading('YOUR ARCADE IN NUMBERS','A quick snapshot of local activity and customization. These values are browser-specific.');
const cards=Array.from(document.querySelectorAll('.game-card[data-game-id]'));
const games=new Set(cards.map(c=>c.dataset.gameId)).size;
const favorites=document.querySelectorAll('.favorite-btn.active').length;
const colorCount=Object.keys(read('nitroarcade-game-colors-v1',{})).length;
const notes=read(K.notes,{body:''});
let unlocked=false;try{unlocked=typeof isWindosillUnlocked==='function'&&isWindosillUnlocked()}catch(e){}
const stats=[
['🎮','Games available',games],
['★','Favorite games',favorites],
['🎨','Custom game colors',colorCount],
['🏆','Windosill secret',unlocked?'Unlocked':'Locked'],
['▤','Notebook characters',(notes.body||'').length],
['⚑','Daily quests',QUESTS.filter(q=>questState().done[q.id]).length+' / '+QUESTS.length]
];
const grid=el('div',{class:'npGrid'});
stats.forEach(([icon,label,value])=>{const card=el('div',{class:'npCard'});card.append(el('small',{},icon+' '+label.toUpperCase()),el('div',{class:'npStatBig'},String(value)));grid.append(card)});
content.append(grid);
const button=el('button',{class:'npAction',onclick:()=>{const payload={exported:new Date().toISOString(),games,favorites,colorCount,unlocked,quests:questState()};download('NitroArcade-Stats.json',JSON.stringify(payload,null,2),'application/json')}},'⬇ EXPORT STATS');
content.append(button);
}
function renderSettings(){
heading('MAKE NITROARCADE YOURS','Adjust presentation-friendly preferences. These settings affect this browser only.');
const config=read(K.settings,{accent:'#a54cff',compact:false,contrast:false,reduceMotion:false});
const wrap=el('div',{class:'npGrid'});
const theme=el('div',{class:'npCard'});theme.append(el('h3',{},'✦ Accent color'),el('p',{},'Pick a highlight color for the sidebar, quick actions and control center.'));
const color=el('input',{type:'color'});color.value=config.accent||'#a54cff';theme.append(color);
const swatches=el('div',{class:'npColorStrip'});
['#a54cff','#5bb8ff','#36dfbb','#ff68c6','#ffb85e','#9dff69','#ff6767','#ffffff'].forEach(c=>{const b=el('button',{style:'background:'+c,'aria-label':'Use '+c,onclick:()=>{color.value=c;update()} });swatches.append(b)});
theme.append(swatches);wrap.append(theme);
const accessibility=el('div',{class:'npCard'});
accessibility.append(el('h3',{},'⚡ Presentation mode'),el('p',{},'Disable animated effects when the school computer needs extra performance.'));
const motion=el('input',{type:'checkbox'});motion.checked=!!config.reduceMotion;
const label=el('label',{class:'npRow'},'');label.append(motion,el('span',{},'Reduce motion'));accessibility.append(label);
wrap.append(accessibility);
const density=el('div',{class:'npCard'});
density.append(el('h3',{},'▦ Compact cards'),el('p',{},'Fit more games on screen when browsing the arcade library.'));
const compact=el('input',{type:'checkbox'});compact.checked=!!config.compact;
const compactLabel=el('label',{class:'npRow'});compactLabel.append(compact,el('span',{},'Compact game cards'));density.append(compactLabel);
wrap.append(density);
content.append(wrap);
const contrast=el('input',{type:'checkbox'});contrast.checked=!!config.contrast;
const contrastLabel=el('label',{class:'npRow'});contrastLabel.append(contrast,el('span',{},'Increase panel contrast'));content.append(contrastLabel);
const reset=el('button',{class:'npAction',onclick:()=>{write(K.settings,{accent:'#a54cff',compact:false,contrast:false,reduceMotion:false});applySettings();renderSettings()}},'RESET PREFERENCES');content.append(reset);
function update(){write(K.settings,{accent:color.value,compact:compact.checked,contrast:contrast.checked,reduceMotion:motion.checked});applySettings()}
[color,compact,contrast,motion].forEach(x=>x.addEventListener('input',update));
}
function applySettings(){
const cfg=read(K.settings,{});
const accent=/^#[0-9a-f]{6}$/i.test(cfg.accent)?cfg.accent:'#a54cff';
document.documentElement.style.setProperty('--nxCustomAccent',accent);
document.body.classList.toggle('npCompact',!!cfg.compact);
document.body.classList.toggle('npContrast',!!cfg.contrast);
document.body.classList.toggle('npReduceMotion',!!cfg.reduceMotion);
}
function renderHelp(){
heading('GETTING AROUND','Quick tips for using NitroArcade at home and during the ISG Forum.');
const tips=[
['⌘ / Ctrl + K','Open the Command Center from anywhere'],
['/','Focus the arcade search field'],
['Escape','Close open NitroArcade utility dialogs'],
['🎨 COLOR','Change an individual game card’s accent color'],
['⚡ Performance','Reduce animation on slower computers'],
['💬 Community','Posts are saved locally; export a backup before moving computers'],
['🏆 Hacker Challenge','Finish all five tests once to unlock Windosill on this browser'],
['▤ Notebook','Save ideas automatically, then export them as a text file'],
['🏫 ISG Forum','Open the student-created thank-you and project history page'],
['★ Favorites','Mark games you want to find again'],
['📁 Game assets','Keep referenced games, images and audio beside the HTML file'],
['🔐 Local saves','Browser storage can be erased; save important backups separately']
];
tips.forEach(([shortcut,desc])=>{const row=el('div',{class:'npQuest'});row.append(el('span',{class:'npKbd'},shortcut),el('div',{},desc));content.append(row)});

const guide=[{"topic": "Keyboard", "tip": "Use Ctrl+K to open Command Center even when you are deep in the arcade."}, {"topic": "Navigation", "tip": "The sidebar remains visible while you explore the main dashboard."}, {"topic": "Search", "tip": "Use the large top search field to narrow the game library."}, {"topic": "Game cards", "tip": "Each game can have its own color without changing other cards."}, {"topic": "Color palettes", "tip": "Select a preset or choose a custom HEX color using the picker."}, {"topic": "Screen tint", "tip": "A visual hue filter changes appearance, not the game\u2019s mechanics."}, {"topic": "Local storage", "tip": "Browser saves persist after refresh but not across different computers."}, {"topic": "Backups", "tip": "Export your forum data before switching school computers."}, {"topic": "Attachments", "tip": "Audio and video previews depend on the browser supporting the file format."}, {"topic": "Image uploads", "tip": "Smaller images load and export faster than huge images."}, {"topic": "Code uploads", "tip": "Text code attachments can be previewed without executing them."}, {"topic": "Forum tags", "tip": "Use short consistent tags such as games, music and feedback."}, {"topic": "Forum search", "tip": "Search titles, authors, messages and tags."}, {"topic": "Hacker challenge", "tip": "The CyberArcade challenge now has five arcade puzzle tests."}, {"topic": "Windosill", "tip": "Complete the challenge once to save the secret-game unlock locally."}, {"topic": "Achievements", "tip": "Check the player hub to review unlocked awards."}, {"topic": "NitroLab", "tip": "Visual effects tools are useful for experimenting with graphics."}, {"topic": "Music studio", "tip": "Try different rhythms and effects, and keep copies of your work."}, {"topic": "Performance", "tip": "Turn down animations before presenting on slower hardware."}, {"topic": "Presentation", "tip": "Practice launching your favorite game before your audience arrives."}, {"topic": "School credits", "tip": "The ISG page thanks the school without implying official endorsement."}, {"topic": "Team credits", "tip": "Check the About page to verify the whole team is included."}, {"topic": "History", "tip": "The archive documents CyberArcade, CrazyArcade and UltraArcade."}, {"topic": "MacroArcade", "tip": "The successor is a separate upcoming team project."}, {"topic": "Fullscreen", "tip": "Use the game\u2019s fullscreen button for a more immersive view."}, {"topic": "Game controls", "tip": "Read the quick brief if a game uses unfamiliar controls."}, {"topic": "Favorites", "tip": "Mark games you want to revisit during the showcase."}, {"topic": "Quick launch", "tip": "Dashboard cards provide shortcuts to frequently used tools."}, {"topic": "Arcade notebook", "tip": "Store your next feature ideas without needing a login."}, {"topic": "Notebook export", "tip": "Export notes to TXT for use outside the browser."}, {"topic": "Daily quests", "tip": "Quest checkboxes are optional and reset by date."}, {"topic": "Statistics", "tip": "Player statistics describe the current browser\u2019s local data."}, {"topic": "Compact mode", "tip": "Compact cards show more games per row on a large screen."}, {"topic": "Contrast mode", "tip": "High-contrast panels can improve readability."}, {"topic": "Accent colors", "tip": "Personalize the sidebar accent from the settings tab."}, {"topic": "Touchscreens", "tip": "Some keyboard-driven games are better played with a keyboard."}, {"topic": "Game files", "tip": "SWF games may depend on neighboring files and Ruffle."}, {"topic": "External assets", "tip": "Some resources require a network connection."}, {"topic": "File paths", "tip": "Relative file paths depend on where you save the HTML file."}, {"topic": "USB presentation", "tip": "Test the exact USB folder on the intended computer."}, {"topic": "School Wi-Fi", "tip": "Do not assume every external link will load on school Wi-Fi."}, {"topic": "Sound levels", "tip": "Test the speakers at a comfortable volume before presenting."}, {"topic": "Browser support", "tip": "Chrome and Edge may handle local storage differently."}, {"topic": "Private mode", "tip": "Incognito browsing may discard saved settings when closed."}, {"topic": "Storage limits", "tip": "Large forum attachments may hit browser storage quotas."}, {"topic": "Accessibility", "tip": "Reduced motion is useful for anyone who prefers calmer visuals."}, {"topic": "Game design", "tip": "Give each game a clear objective and instructions."}, {"topic": "Bug reports", "tip": "Write down steps to reproduce issues in the notebook."}, {"topic": "Team collaboration", "tip": "Keep a shared list of changes before merging edits."}, {"topic": "Version control", "tip": "Save dated copies before large edits."}, {"topic": "Presentation backup", "tip": "Keep a stable version alongside the newest version."}, {"topic": "Visual polish", "tip": "Consistency matters more than adding random animations."}, {"topic": "Loading speed", "tip": "Avoid huge assets when a smaller file works."}, {"topic": "Font fallback", "tip": "A fallback system font keeps text readable offline."}, {"topic": "Responsive layout", "tip": "Try a smaller browser window to spot clipping."}, {"topic": "Sidebar", "tip": "On narrow screens the sidebar collapses to icons."}, {"topic": "About layout", "tip": "The About page must reserve space for the fixed sidebar."}, {"topic": "Player layout", "tip": "The game player should fill available space without horizontal clipping."}, {"topic": "Dashboard columns", "tip": "The right column should stack below the main content on narrow screens."}, {"topic": "Color persistence", "tip": "Individual game colors are saved using game IDs."}, {"topic": "Exporting", "tip": "Always keep a copy of your original file before making changes."}];
const guideHeading=el('h3',{style:'margin-top:30px'},'NITROARCADE FIELD GUIDE');
content.append(guideHeading);
content.append(el('p',{class:'npIntro'},'Practical tips for creators, players and school presentations.'));
const search=el('input',{type:'search',placeholder:'Search the field guide…',style:'width:100%;margin-bottom:14px'});
content.append(search);
const results=el('div',{class:'npGrid'});
content.append(results);
function drawGuide(){
results.replaceChildren();
const query=search.value.toLowerCase().trim();
guide.filter(x=>(x.topic+' '+x.tip).toLowerCase().includes(query)).forEach(x=>{
const card=el('article',{class:'npCard'});
card.append(el('h3',{},x.topic),el('p',{},x.tip));
results.append(card);
});
}
search.addEventListener('input',drawGuide);
drawGuide();

}
byId('npClose').addEventListener('click',close);
overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
document.querySelectorAll('[data-np-tab]').forEach(button=>button.addEventListener('click',()=>{currentTab=button.dataset.npTab;render()}));
document.addEventListener('keydown',e=>{
if(e.key==='Escape'&&overlay.classList.contains('open'))close();
if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();open('command')}
});
window.NitroPlus={open,close,navigate,refresh:render};
applySettings();
})();
