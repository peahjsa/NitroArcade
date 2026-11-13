(()=>{
const el=id=>document.getElementById(id);
const stage=el('stage'),frame=el('game');
const z=el('zoom'),x=el('x'),y=el('y');
function apply(){frame.style.transform='translate('+x.value+'px,'+y.value+'px) scale('+z.value+')'}
function view(n){z.value=n;x.value=0;y.value=0;apply()}
[z,x,y].forEach(t=>t.addEventListener('input',apply));
el('full').onclick=()=>view(1);
el('crop').onclick=()=>view(1.35);
el('adjust').onclick=()=>el('settings').hidden=!el('settings').hidden;
el('fs').onclick=async()=>{
try{
 if(document.fullscreenElement)await document.exitFullscreen();
 else await stage.requestFullscreen();
}catch(e){alert('Fullscreen unavailable. Try F11.')}
};
apply();
})();