(function(){
'use strict';
try{history.scrollRestoration='manual'}catch(e){}
window.__nitroInitialScrollLock=true;
let userInteracted=false;
const unlock=()=>{userInteracted=true;window.__nitroInitialScrollLock=false};
['wheel','touchstart','pointerdown','keydown'].forEach(t=>window.addEventListener(t,unlock,{once:true,passive:true,capture:true}));
function top(){if(!userInteracted){window.scrollTo({top:0,left:0,behavior:'instant'});document.documentElement.scrollTop=0;if(document.body)document.body.scrollTop=0}}
window.addEventListener('DOMContentLoaded',()=>{top();requestAnimationFrame(top);setTimeout(top,100);setTimeout(top,350);setTimeout(top,900);setTimeout(()=>{top();window.__nitroInitialScrollLock=false},1600)},{once:true});
window.addEventListener('load',()=>{top();setTimeout(top,50)},{once:true});
})();