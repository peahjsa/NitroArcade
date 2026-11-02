
(function(){
'use strict';
window.startHackerChallenge=function(host){
if(typeof window.stopNativeGame==='function')window.stopNativeGame();
host.innerHTML='<div class="challenge-shell"><div class="challenge-panel"><div class="challenge-kicker">CYBERARCADE // EIGHT TRIALS</div><div class="challenge-title">ARE YOU A HACKER?</div><div class="challenge-sub">EIGHT ARCADE CHALLENGES • UNLOCK WINDOSILL</div><div class="nh-progress" id="nhProgress"></div><div class="nh-stage" id="nhStage"></div></div></div>';
const progress=host.querySelector('#nhProgress'),stage=host.querySelector('#nhStage');
let n=0,timer=null,stopped=false;
function clear(){if(timer!==null){clearTimeout(timer);timer=null}}
window.activeNativeCleanup=()=>{stopped=true;clear()};
const names=['Cipher','Binary','Memory','Logic','Final Lock','Reaction Test','Number Guess','50 Clicks'];
function paint(){progress.innerHTML=names.map((name,i)=>`<span class="${i<n?'done':i===n?'now':''}">${i+1} ${name}</span>`).join('')}
function view(title,desc){clear();paint();stage.replaceChildren();const h=document.createElement('h3');h.textContent='TEST '+(n+1)+' / 5 — '+title;const p=document.createElement('p');p.textContent=desc;stage.append(h,p)}
function answer(correct){const input=document.createElement('input');input.placeholder='Enter your answer';input.autocomplete='off';const msg=document.createElement('p');const btn=document.createElement('button');btn.textContent='SUBMIT';function submit(){if(input.value.trim().toUpperCase().replace(/\s+/g,'')===String(correct).toUpperCase().replace(/\s+/g,'')){next()}else{msg.textContent='Incorrect. Try again.';input.value='';input.focus()}}btn.onclick=submit;input.onkeydown=e=>{if(e.key==='Enter')submit()};stage.append(input,btn,msg);input.focus()}
function next(){clear();n++;if(n>=8){paint();if(typeof window.unlockWindosill==='function')window.unlockWindosill();stage.innerHTML='<h2>🔓 ACCESS GRANTED!</h2><p>ALL EIGHT TESTS COMPLETE. WINDOSILL UNLOCKED!</p><button id="nhReplay">PLAY AGAIN</button>';stage.querySelector('button').onclick=()=>window.startHackerChallenge(host);return}run()}
function run(){if(stopped)return;switch(n){
case 0:view('Caesar Cipher','Decode: QLWURDUFDGH. Each letter was shifted 3 positions forward.');answer('NITROARCADE');break;
case 1:view('Binary Decoder','Decode ASCII binary: 01010010 01010101 01000110 01000110 01001100 01000101');answer('RUFFLE');break;
case 2:{view('Memory Sequence','Memorize the six digits. They disappear after 4 seconds.');const code=Array.from({length:6},()=>Math.floor(Math.random()*10)).join('');const display=document.createElement('h2');display.textContent=code;stage.append(display);timer=setTimeout(()=>{display.textContent='••••••';answer(code)},4000);break}
case 3:view('Logic Gate','A=1 and B=0. Calculate (A XOR B) AND (NOT B). Answer 0 or 1.');answer('1');break;
case 4:view('Final Lock','Combine: decimal value of hex 0F, followed immediately by the number of letters in RUFFLE.');answer('156');break;
case 5:{view('Reaction Test','Wait until the panel turns GREEN, then click. Clicking early resets the test.');const b=document.createElement('button');b.textContent='WAIT FOR GREEN';b.style.cssText='padding:24px;background:#9a263e;color:white;cursor:pointer';stage.append(b);let ready=false,done=false,started=0;const arm=()=>{ready=false;b.textContent='WAIT FOR GREEN';b.style.background='#9a263e';timer=setTimeout(()=>{if(stopped||done)return;ready=true;started=performance.now();b.textContent='CLICK NOW!';b.style.background='#157c43'},1200+Math.random()*2600)};b.onclick=()=>{if(done)return;if(!ready){clear();b.textContent='TOO EARLY! TRY AGAIN';timer=setTimeout(arm,800);return}done=true;const ms=Math.round(performance.now()-started);b.textContent=ms+' ms — PASSED';timer=setTimeout(next,900)};arm();break}
case 6:{view('Number Guess','Guess the secret integer from 1 to 20. You get six attempts.');const secret=1+Math.floor(Math.random()*20);let tries=0;const input=document.createElement('input');input.type='number';input.min=1;input.max=20;input.placeholder='1–20';const b=document.createElement('button');b.textContent='GUESS';const msg=document.createElement('p');stage.append(input,b,msg);b.onclick=()=>{const value=Number(input.value);if(!Number.isInteger(value)||value<1||value>20){msg.textContent='Enter a whole number from 1 to 20';return}tries++;if(value===secret){next();return}if(tries>=6){msg.textContent='Out of guesses! The answer was '+secret+'. Try again.';tries=0;return}msg.textContent=(value<secret?'Higher':'Lower')+' — '+(6-tries)+' guesses left';input.select()};input.onkeydown=e=>{if(e.key==='Enter')b.click()};break}
case 7:{view('Click Speed','Click 50 times within 60 seconds. Timer starts on first click.');let count=0,start=0;const b=document.createElement('button');b.textContent='CLICK 0 / 50';const p=document.createElement('p');p.textContent='60 seconds';stage.append(b,p);b.onclick=()=>{if(!start)start=performance.now();if(performance.now()-start>60000){count=0;start=performance.now();p.textContent='Time expired — restarted'}count++;b.textContent='CLICK '+count+' / 50';if(count>=50)next()};break}
}}
run();
};
})();
