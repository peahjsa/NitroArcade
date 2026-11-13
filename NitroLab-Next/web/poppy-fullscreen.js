(()=>{
const $=id=>document.getElementById(id);
const stage=$('stage'),game=$('game'),scale=$('scale'),x=$('offsetx'),y=$('offsety');
function apply(){game.style.transform='translate('+x.value+'px,'+y.value+'px) scale('+scale.value+')'}
function setView(s,dx,dy){scale.value=s;x.value=dx;y.value=dy;apply()}
[scale,x,y].forEach(el=>el.addEventListener('input',apply));
$('normal').onclick=()=>setView(1,0,0);
$('crop').onclick=()=>setView(1.35,0,0);
$('adjust').onclick=()=>{$('settings').hidden=!$('settings').hidden};
$('fullscreen').onclick=async()=>{
try{
 if(document.fullscreenElement)await document.exitFullscreen();
 else await stage.requestFullscreen();
}catch(e){alert('Fullscreen unavailable. Try F11 in Chrome.')}
};
document.addEventListener('fullscreenchange',()=>{
$('fullscreen').textContent=document.fullscreenElement?'Exit Fullscreen':'⛶ Fullscreen'
});
apply();
})();