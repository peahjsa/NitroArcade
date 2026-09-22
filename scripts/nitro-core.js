/* NitroArcade shared core */
(() => {
  const N = window.NitroArcade = window.NitroArcade || {};
  N.version = "1.0.0";
  N.clamp = (n,min,max) => Math.max(min, Math.min(max,n));
  N.random = (min,max) => Math.random()*(max-min)+min;
  N.randomInt = (min,max) => Math.floor(N.random(min,max+1));
  N.pick = arr => arr[Math.floor(Math.random()*arr.length)];
  N.$ = (q,root=document) => root.querySelector(q);
  N.$$ = (q,root=document) => [...root.querySelectorAll(q)];
  N.emit = (name,detail={}) => window.dispatchEvent(new CustomEvent("nitro:"+name,{detail}));
  N.on = (name,fn) => window.addEventListener("nitro:"+name,e=>fn(e.detail,e));
  N.debounce = (fn,ms=150) => { let t; return (...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}; };
  console.info("[NitroArcade] core ready");
})();