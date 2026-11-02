
(()=>{
'use strict';
const $=id=>document.getElementById(id), key='nitroFamilyV1', usageKey='nitroFamilyUsageV1';
const defaults={enabled:false,start:'07:00',end:'20:30',minutes:90,forceRest:false,pinHash:''};
let config={...defaults},unlocked=false,bookIndex=0,pageIndex=0,puzzleAnswer='',failures=0,lockedUntil=0;
const safeJSON=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))||fallback}catch{return fallback}};
config={...defaults,...safeJSON(key,{})};
const save=()=>localStorage.setItem(key,JSON.stringify(config));
const hash=async text=>{if(crypto?.subtle){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return [...new Uint8Array(b)].map(v=>v.toString(16).padStart(2,'0')).join('')}return 'local:'+text.split('').map(x=>x.charCodeAt(0).toString(16)).join('')};
const today=()=>new Date().toLocaleDateString('en-CA');
let usage=safeJSON(usageKey,{day:today(),seconds:0});if(usage.day!==today())usage={day:today(),seconds:0};
const minuteOf=t=>{let [h,m]=t.split(':').map(Number);return h*60+m};
const withinWindow=()=>{let d=new Date(),now=d.getHours()*60+d.getMinutes(),a=minuteOf(config.start),b=minuteOf(config.end);return a===b?false:a<b?(now>=a&&now<b):(now>=a||now<b)};
function reason(){if(!config.enabled)return '';if(config.forceRest)return 'Family rest mode is on. Reading and homework are still available.';if(!withinWindow())return `Games are available from ${config.start} until ${config.end}.`;if(config.minutes>0&&usage.seconds>=config.minutes*60)return 'Your daily game time is finished. Come back tomorrow!';return ''}
function refresh(){const why=reason();$('nfGate').classList.toggle('nf-on',!!why);$('nfReason').textContent=why||'Games are available right now.';const side=$('nfSidebarButton');if(side)side.title=config.enabled?'Family Mode ON':'Family Mode OFF';if(why){document.querySelectorAll('canvas').forEach(c=>{try{c.blur()}catch{}})}}
function showPanel(id){['nfBooks','nfHomework','nfQuiet'].forEach(x=>$(x).classList.toggle('nf-hidden',x!==id));$('nfGate').scrollTop=0}
$('nfShowBooks').onclick=()=>showPanel('nfBooks');$('nfShowHomework').onclick=()=>showPanel('nfHomework');$('nfShowQuiet').onclick=()=>showPanel('nfQuiet');
document.querySelectorAll('[data-nf-back]').forEach(b=>b.onclick=()=>showPanel(''));
const books=[
{title:'Barnaby Goes to the Moon!',pages:[
['Barnaby Goes to the Moon!','Barnaby was a small, round bear with a very large telescope. Each night he waved to the Moon from his bedroom window. “I wonder if the Moon ever feels lonely,” he whispered.'],
['A Most Unusual Invitation','One evening, a silver envelope floated down onto his pillow. It read: DEAR BARNABY, THE MOON LIBRARY NEEDS A NEW BOOK. PLEASE BRING A STORY. — THE MOONKEEPER. Barnaby packed a notebook, two biscuits, and his favorite red scarf.'],
['The Paper Rocket','Barnaby folded a rocket from the biggest sheet of paper he could find. He drew stars on its wings and wrote one word on the nose: IMAGINE. The rocket trembled, shimmered, and lifted gently into the night.'],
['A Very Quiet Landing','The Moon was quieter than a snow day. Barnaby hopped over tiny craters until he found a door shaped like a crescent. Behind it stood shelves filled with stories that twinkled like constellations.'],
['The Moonkeeper','A rabbit in spectacles greeted him. “Our books have all been read,” said the Moonkeeper. “We need a brand-new adventure.” Barnaby opened his notebook, but every page was blank. He had been too busy traveling to write!'],
['A Story Worth Telling','Then Barnaby smiled. He wrote about a bear who was brave enough to ask a question, a paper rocket powered by imagination, and a rabbit who loved stories. The Moonkeeper laughed with delight.'],
['Home Before Sunrise','As the first sunlight reached the Moon, Barnaby climbed into his rocket. “Come back soon!” called the Moonkeeper. Back in bed, Barnaby looked up at the sky. The Moon seemed to shine a little brighter. THE END.']
]},
{title:'The Clockwork Garden',pages:[
['The Clockwork Garden','Mira discovered a garden where every flower had tiny golden gears. The daisies ticked softly, and the sunflowers turned like clock hands.'],
['The Missing Minute','One morning, the garden stopped. A little mechanical ladybird explained that someone had misplaced the garden’s most important minute.'],
['The Gentle Fix','Mira searched beneath leaves and beside the fountain. She found a minute trapped in a dewdrop and carefully returned it to the clock tower.'],
['Time for Kindness','The garden began to tick again. The ladybird thanked Mira. “The best minutes,” it said, “are the ones we share.” THE END.']
]},
{title:'The Lighthouse in the Clouds',pages:[
['The Lighthouse in the Clouds','Noah lived in a village above the clouds, where floating boats sailed on winds instead of water.'],
['A Lost Star','One night, a small star lost its way. Noah lit the cloud lighthouse and guided the star between silver mountains.'],
['A Bright Return','The star found its constellation and blinked three times in thanks. Noah waved from the lighthouse balcony. THE END.']
]}];
$('nfBookChoice').innerHTML=books.map((b,i)=>`<option value="${i}">${b.title}</option>`).join('');
function renderBook(){const b=books[bookIndex],p=b.pages[pageIndex];$('nfBookPage').replaceChildren();const h=document.createElement('h2'),txt=document.createElement('p');h.textContent=p[0];txt.textContent=p[1];$('nfBookPage').append(h,txt);$('nfPageCount').textContent=`Page ${pageIndex+1} of ${b.pages.length}`;$('nfPrevPage').disabled=pageIndex===0;$('nfNextPage').disabled=pageIndex===b.pages.length-1}
$('nfBookChoice').onchange=e=>{bookIndex=+e.target.value;pageIndex=0;renderBook()};$('nfPrevPage').onclick=()=>{pageIndex=Math.max(0,pageIndex-1);renderBook()};$('nfNextPage').onclick=()=>{pageIndex=Math.min(books[bookIndex].pages.length-1,pageIndex+1);renderBook()};renderBook();
let tasks=safeJSON('nitroFamilyTasksV1',[]);if(!Array.isArray(tasks))tasks=[];
function renderTasks(){const list=$('nfTaskList');list.replaceChildren();tasks.forEach((task,i)=>{const line=document.createElement('div');line.className='nf-row';line.style.margin='12px 0';const check=document.createElement('input');check.type='checkbox';check.checked=!!task.done;check.onchange=()=>{task.done=check.checked;storeTasks()};const name=document.createElement('span');name.textContent=task.text;name.style.textDecoration=task.done?'line-through':'none';const del=document.createElement('button');del.textContent='REMOVE';del.onclick=()=>{tasks.splice(i,1);storeTasks()};line.append(check,name,del);list.append(line)})}
function storeTasks(){localStorage.setItem('nitroFamilyTasksV1',JSON.stringify(tasks));renderTasks()}
$('nfAddTask').onclick=()=>{const t=$('nfTaskInput').value.trim();if(t&&tasks.length<100){tasks.push({text:t,done:false});$('nfTaskInput').value='';storeTasks()}};renderTasks();
$('nfStudyNotes').value=localStorage.getItem('nitroFamilyStudyNotesV1')||'';$('nfStudyNotes').oninput=e=>localStorage.setItem('nitroFamilyStudyNotesV1',e.target.value.slice(0,10000));
function section(id){['nfSetup','nfUnlock','nfPuzzle','nfControls'].forEach(x=>$(x).classList.toggle('nf-hidden',x!==id))}
function openSettings(){unlocked=false;$('nfSettings').classList.add('nf-on');$('nfStatus').textContent='';section(config.pinHash?'nfUnlock':'nfSetup')}
$('nfParentGate').onclick=openSettings;
$('nfCloseSettings').onclick=()=>{$('nfSettings').classList.remove('nf-on');unlocked=false};
$('nfSavePin').onclick=async()=>{const a=$('nfNewPin').value,b=$('nfConfirmPin').value;if(!/^\d{4,8}$/.test(a)||a!==b){$('nfStatus').textContent='Choose 4–8 digits and confirm the same PIN.';return}config.pinHash=await hash(a);save();$('nfNewPin').value='';$('nfConfirmPin').value='';section('nfControls');unlocked=true;$('nfStatus').textContent='Parent PIN created. Configure the schedule below.';loadControls()};
const puzzles=[
()=>{const word='MOON';return {q:`Decode this Base64 word: ${btoa(word)}`,a:word}},
()=>({q:'Decode this hexadecimal ASCII: 53 54 41 52',a:'STAR'}),
()=>({q:'Decode the emoji initials: 🐻 Bear + 🌙 Moon + 🚀 Rocket. Type the three first letters together.',a:'BMR'}),
()=>{let a=7,b=6;return{q:`Magical math: (${a} × ${b}) + 8 − 5 = ?`,a:String(a*b+8-5)}},
()=>({q:'Repair the corrupted sentence: "Th_ m__n gl_ws". Type the missing word between "The" and "glows".',a:'MOON'})
];
$('nfCheckPin').onclick=async()=>{if(Date.now()<lockedUntil){$('nfStatus').textContent='Please wait before trying again.';return}const input=$('nfPinEntry').value;$('nfPinEntry').value='';if(await hash(input)!==config.pinHash){failures++;if(failures>=5){lockedUntil=Date.now()+60000;failures=0}$('nfStatus').textContent='Incorrect PIN.';return}failures=0;const p=puzzles[Math.floor(Math.random()*puzzles.length)]();puzzleAnswer=p.a;$('nfPuzzleQuestion').textContent=p.q;$('nfPuzzleAnswer').value='';section('nfPuzzle');$('nfStatus').textContent=''};
$('nfCheckPuzzle').onclick=()=>{if($('nfPuzzleAnswer').value.trim().toUpperCase()!==puzzleAnswer){$('nfStatus').textContent='Not quite. Try decoding it again.';return}unlocked=true;loadControls();section('nfControls');$('nfStatus').textContent='Parent controls unlocked.'};
function loadControls(){$('nfModeState').textContent=config.enabled?'Family Mode is ON — games follow your schedule.':'Family Mode is OFF — games remain available until a parent turns it on.';$('nfStart').value=config.start;$('nfEnd').value=config.end;$('nfMinutes').value=config.minutes;$('nfForceRest').checked=config.forceRest}
function applyControls(){if(!unlocked)return;config.start=$('nfStart').value||'07:00';config.end=$('nfEnd').value||'20:30';config.minutes=Math.max(0,Math.min(1440,Number($('nfMinutes').value)||0));config.forceRest=$('nfForceRest').checked;save();refresh();$('nfStatus').textContent='Family settings saved.'}
$('nfSaveControls').onclick=applyControls;
$('nfTurnOn').onclick=()=>{if(!unlocked)return;applyControls();config.enabled=true;save();loadControls();refresh();$('nfStatus').textContent='Family Mode is ON.'};
$('nfTurnOff').onclick=()=>{if(!unlocked)return;config.enabled=false;config.forceRest=false;save();loadControls();refresh();$('nfStatus').textContent='Family Mode is OFF.'};
$('nfLockNow').onclick=()=>{if(!unlocked)return;$('nfForceRest').checked=true;applyControls();config.enabled=true;save();refresh();$('nfSettings').classList.remove('nf-on');unlocked=false};
let last=Date.now();setInterval(()=>{const now=Date.now(),delta=Math.max(0,Math.min(5,(now-last)/1000));last=now;if(usage.day!==today())usage={day:today(),seconds:0};if(config.enabled&&!reason()&&document.visibilityState==='visible'){usage.seconds+=delta;localStorage.setItem(usageKey,JSON.stringify(usage))}refresh()},1000);
refresh();
window.NitroFamily={refresh,openSettings};
})();
