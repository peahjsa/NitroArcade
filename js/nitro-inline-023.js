
(function(){
const history=document.getElementById('ntHistory');
const update=()=>{
const cards=document.querySelectorAll('.game-card[data-game-id]');
const count=document.getElementById('ntGamesCount');if(count)count.textContent=new Set([...cards].map(c=>c.dataset.gameId)).size;
const favorites=document.querySelectorAll('.favorite-btn.active');const fav=document.getElementById('ntFavCount');if(fav)fav.textContent=favorites.length;
const status=document.getElementById('ntChallengeStatus');if(status){let unlocked=false;try{unlocked=typeof isWindosillUnlocked==='function'&&isWindosillUnlocked()}catch(e){}status.textContent=unlocked?'Windosill unlocked':'Challenge awaits'}
};
window.NitroTen={
openHistory(){history.classList.add('active');history.scrollTop=0;document.body.style.overflow='hidden'},
closeHistory(){history.classList.remove('active');document.body.style.overflow=''},
togglePerformance(){document.body.classList.toggle('ntLowMotion');const on=document.body.classList.contains('ntLowMotion');try{localStorage.setItem('nitro_performance_mode',on?'1':'0')}catch(e){}document.getElementById('nitroPerfBtn').textContent=on?'⚡ Motion off':'⚡ Performance'},
refresh:update
};
document.getElementById('ntHistoryClose').onclick=window.NitroTen.closeHistory;
history.addEventListener('click',e=>{if(e.target===history)window.NitroTen.closeHistory()});
document.addEventListener('keydown',e=>{
if(e.key==='Escape'&&history.classList.contains('active'))window.NitroTen.closeHistory();
if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!document.querySelector('#nfOverlay.active')&&!history.classList.contains('active')){const search=document.getElementById('gameSearch');if(search){e.preventDefault();search.focus()}}
});
try{if(localStorage.getItem('nitro_performance_mode')==='1'){document.body.classList.add('ntLowMotion');document.getElementById('nitroPerfBtn').textContent='⚡ Motion off'}}catch(e){}
document.addEventListener('click',()=>setTimeout(update,100));
setTimeout(update,500);setTimeout(update,2500);
})();
