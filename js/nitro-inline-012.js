
(() => {
  const G=window.NitroGlue={};
  const MAGIC='NITROARCADE_GLUESTICK_SHISO';
  const FORMAT_NAME='SHISO';
  const VERSION=2;
  function collect() {
    const storage={};
    for(let i=0;i<localStorage.length;i++) {
      const k=localStorage.key(i);
      if(k && (k.startsWith('nitroarcade:') || k.startsWith('crazyarcade-') || k.startsWith('ultraarcade-'))) storage[k]=localStorage.getItem(k);
    }
    return {
      magic:MAGIC,
      format:FORMAT_NAME,
      version:VERSION,
      mime:'application/x-nitro-save+json',
      createdAt:new Date().toISOString(),
      app:'NitroArcade',
      kind:'save',
      storage
    };
  }
  G.export=()=>{
    try {
      const payload=JSON.stringify(collect(),null,2);
      const filename='NitroArcade-SHISO-'+new Date().toISOString().slice(0,10)+'.nitrosave';
      const blob=new Blob([payload],{type:'application/octet-stream'});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');
      a.href=url;
      a.download=filename;
      a.style.display='none';
      document.body.appendChild(a);
      a.click();
      setTimeout(()=>{
        try { a.remove(); URL.revokeObjectURL(url); } catch(_) {}
      },1500);
      if(typeof showToast==='function') showToast('Exported '+filename);
      return true;
    } catch(e) {
      console.error('SHISO export failed',e);
      alert('SHISO export failed: '+(e?.message||e));
      return false;
    }
  };
  G.importFile=async(file)=>{
    if(!file)return;
    try {
      const data=JSON.parse(await file.text());
      const legacyV1 = data.magic==='NITROARCADE_GLUESTICK' && data.version===1;
      const shisoV2 = data.magic===MAGIC && data.format===FORMAT_NAME && data.version===VERSION;
      if((!legacyV1 && !shisoV2) || !data.storage || typeof data.storage!=='object') throw new Error('Not a valid NitroArcade .nitrosave / SHISO file');
      const count=Object.keys(data.storage).length;
      if(!confirm('Import '+count+' NitroArcade save entries? This will replace matching local save data.')) return;
      for(const [k,v] of Object.entries(data.storage)) {
        if(k.startsWith('nitroarcade:') || k.startsWith('crazyarcade-') || k.startsWith('ultraarcade-')) localStorage.setItem(k,String(v));
      }
      alert('NitroArcade .nitrosave imported successfully. The arcade will reload now.');
      location.reload();
    } catch(e) { alert('Could not import .nitrosave: '+e.message); }
  };
  G.inspect=async(file)=>JSON.parse(await file.text());
  Object.freeze(G);
})();
