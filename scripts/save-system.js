/* NitroArcade save/settings wrapper */
(() => {
  const N = window.NitroArcade = window.NitroArcade || {};
  const PREFIX="nitroarcade:";
  const parse=(v,f)=>{try{return v==null?f:JSON.parse(v)}catch{return f}};
  N.save = {
    get:(key,fallback=null)=>parse(localStorage.getItem(PREFIX+key),fallback),
    set:(key,value)=>{localStorage.setItem(PREFIX+key,JSON.stringify(value)); N.emit?.("save",{key,value}); return value;},
    remove:key=>localStorage.removeItem(PREFIX+key),
    update:(key,fn,fallback={})=>N.save.set(key,fn(N.save.get(key,fallback))),
    export:()=>Object.fromEntries(Object.keys(localStorage).filter(k=>k.startsWith(PREFIX)).map(k=>[k,parse(localStorage.getItem(k),null)])),
    reset:()=>Object.keys(localStorage).filter(k=>k.startsWith(PREFIX)).forEach(k=>localStorage.removeItem(k))
  };
})();