
(function(){
 function add(){const studio=document.getElementById('ngsCanvas');if(!studio||document.getElementById('ngs-hires-export'))return;
 const b=document.createElement('button');b.id='ngs-hires-export';b.type='button';b.textContent='📸 Export 2× Studio Art';
 b.style.cssText='margin:8px;padding:9px 12px;background:#2b386a;color:white;border:1px solid #9bbaff;border-radius:9px;cursor:pointer';
 b.onclick=()=>{const out=document.createElement('canvas');out.width=studio.width*2;out.height=studio.height*2;const g=out.getContext('2d');g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(studio,0,0,out.width,out.height);out.toBlob(blob=>{if(!blob)return;const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download='nitro-studio-2x.png';a.click();setTimeout(()=>URL.revokeObjectURL(u),1500)})};
 studio.closest('.ngs-stagehost')?.after(b);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add);else add();
})();
