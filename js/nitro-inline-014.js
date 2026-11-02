
(() => {
  function ensureGlueInput(){
    let input=document.getElementById('nitroGlueImport');
    if(!input){
      input=document.createElement('input');
      input.type='file';
      input.id='nitroGlueImport';
      input.accept='.nitrosave,.gluestick';
      input.style.display='none';
      input.addEventListener('change',e=>{
        const file=e.target.files && e.target.files[0];
        if(file && window.NitroGlue) window.NitroGlue.importFile(file);
        e.target.value='';
      });
      document.body.appendChild(input);
    }
    return input;
  }
  window.nitroExportGlue=()=>window.NitroGlue?.export();
  window.nitroImportGlue=()=>ensureGlueInput().click();
  document.readyState==='loading'
    ? document.addEventListener('DOMContentLoaded',ensureGlueInput)
    : ensureGlueInput();
})();
