
function startNitroDino(host) {
    const wrap=document.createElement('div');
    wrap.style.cssText='width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:#f7f7f7;color:#333;font:16px monospace;padding:16px';
    const info=document.createElement('div');
    info.textContent='CHROME DINO · SPACE / ↑ TO JUMP · R TO RESTART';
    const canvas=document.createElement('canvas');
    canvas.width=900;canvas.height=300;
    canvas.style.cssText='width:min(100%,900px);aspect-ratio:3/1;border:1px solid #bbb;background:#fff;touch-action:manipulation';
    const score=document.createElement('div');score.textContent='SCORE 00000';
    wrap.append(info,canvas,score);host.appendChild(wrap);
    const ctx=canvas.getContext('2d');
    let y=0,vy=0,obs=[],ticks=0,points=0,over=false,raf=0,last=0;
    const ground=252;
    function jump(){if(over){reset();return;}if(y===0)vy=-13.5;}
    function key(e){if(!wrap.isConnected)return;if(['Space','ArrowUp'].includes(e.code)){e.preventDefault();jump();}if(e.code==='KeyR')reset();}
    function reset(){y=0;vy=0;obs=[];ticks=0;points=0;over=false;last=0;cancelAnimationFrame(raf);raf=requestAnimationFrame(frame);}
    document.addEventListener('keydown',key);
    canvas.addEventListener('pointerdown',jump);
    function frame(time){
      if(!wrap.isConnected){document.removeEventListener('keydown',key);return;}
      if(!last)last=time;
      const dt=Math.min((time-last)/16.67,2);last=time;
      if(!over){
        ticks+=dt;points+=dt*.16;
        vy+=.65*dt;y=Math.min(0,y+vy*dt);if(y===0)vy=0;
        if(!obs.length || obs[obs.length-1].x<580){if(Math.random()<.015*dt)obs.push({x:920,w:18+Math.random()*18,h:32+Math.random()*28});}
        for(const o of obs)o.x-=(6+Math.min(points/80,6))*dt;
        obs=obs.filter(o=>o.x>-60);
        for(const o of obs)if(92<o.x+o.w && 128>o.x && ground+y-43<ground && ground+y>ground-o.h+5)over=true;
      }
      ctx.clearRect(0,0,900,300);ctx.strokeStyle='#777';ctx.beginPath();ctx.moveTo(0,ground+1);ctx.lineTo(900,ground+1);ctx.stroke();
      ctx.fillStyle='#555';ctx.fillRect(95,ground+y-43,30,43);ctx.fillRect(116,ground+y-38,19,13);ctx.fillRect(100,ground+y-52,26,15);ctx.fillStyle='white';ctx.fillRect(118,ground+y-48,4,4);
      ctx.fillStyle='#666';for(const o of obs){ctx.fillRect(o.x,ground-o.h,o.w,o.h);ctx.fillRect(o.x-8,ground-o.h+15,8,6);ctx.fillRect(o.x+o.w,ground-o.h+9,8,6);}
      score.textContent='SCORE '+String(Math.floor(points)).padStart(5,'0');
      if(over){ctx.fillStyle='#333';ctx.font='bold 25px monospace';ctx.textAlign='center';ctx.fillText('GAME OVER — SPACE TO RESTART',450,100);ctx.textAlign='left';}
      else raf=requestAnimationFrame(frame);
    }
    reset();
}

