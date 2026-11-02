
(function(){
const modal=document.getElementById('ndModal');
function open(which){modal.classList.add('open');modal.setAttribute('aria-hidden','false');if(which==='ideas')setTimeout(()=>document.getElementById('ndIdea')?.focus(),60);if(which==='random')document.getElementById('ndPick')?.focus();if(which==='queue')document.getElementById('ndQueueClear')?.focus()}
function close(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}
window.NitroDiscoveryUI={open,close};
document.getElementById('ndModalClose').addEventListener('click',close);
modal.addEventListener('click',e=>{if(e.target===modal)close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))close()});
})();
