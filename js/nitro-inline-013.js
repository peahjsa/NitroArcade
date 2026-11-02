
(() => {
  const addBadge=()=>{
    const hub=[...document.querySelectorAll('*')].find(el =>
      el.children.length===0 && /PLAYER HUB/i.test(el.textContent||'')
    );
    if(hub && !document.getElementById('nitroShisoBadge')){
      const b=document.createElement('span');
      b.id='nitroShisoBadge';
      b.textContent=' .NITROSAVE // SHISO v2';
      b.style.cssText='display:inline-block;margin-left:10px;padding:4px 7px;border:1px solid var(--line);border-radius:999px;font:800 9px Inter,sans-serif;letter-spacing:.08em;color:var(--accent);vertical-align:middle';
      hub.appendChild(b);
    }
  };
  document.addEventListener('click',()=>setTimeout(addBadge,20));
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',addBadge):addBadge();
})();
