
window.NitroNeo={
home(){if(document.getElementById('aboutPage')?.classList.contains('active'))closeAboutPage();if(typeof returnToDashboard==='function')returnToDashboard();else{document.getElementById('dashboardView').style.display='block';document.getElementById('gameView').style.display='none'}window.scrollTo({top:0,behavior:'smooth'})},
games(){if(typeof showArcadePart==='function')showArcadePart('small')},
refresh(){const cards=document.querySelectorAll('.game-card[data-game-id]');document.getElementById('nxGameTotal').textContent=new Set([...cards].map(x=>x.dataset.gameId)).size;document.getElementById('nxFavoriteTotal').textContent=document.querySelectorAll('.favorite-btn.active').length;let unlocked=false;try{unlocked=typeof isWindosillUnlocked==='function'&&isWindosillUnlocked()}catch(e){}document.getElementById('nxUnlockTotal').textContent=unlocked?'1':'0'}
};
setTimeout(NitroNeo.refresh,600);setTimeout(NitroNeo.refresh,2300);
document.addEventListener('click',()=>setTimeout(NitroNeo.refresh,200));
