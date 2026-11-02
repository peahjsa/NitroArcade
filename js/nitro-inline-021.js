
(()=>{
const $=id=>document.getElementById(id),panel=$('nl'),canvas=$('nl-canvas'),ctx=canvas.getContext('2d');
let mode='nebula',palette=0,paused=false,ps=[],w=700,h=380,frame=0,last=0,mouse={x:-999,y:-999,down:false},running=false;
const palettes=[['#4af4ff','#a96cff','#ff56c9'],['#ffca38','#ff537c','#ff7926'],['#7cff93','#4af4ff','#efff77'],['#c5dfff','#769cff','#e8ecff']];
const rand=(a,b)=>a+Math.random()*(b-a);
function size(){const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;w=r.width;h=r.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0)}
function make(x=rand(0,w),y=rand(0,h)){const a=rand(0,Math.PI*2);return{x,y,vx:Math.cos(a)*rand(.3,2),vy:Math.sin(a)*rand(.3,2),r:rand(1,3),c:Math.floor(rand(0,3)),a,orbit:rand(20,Math.min(w,h)*.48),life:rand(40,150)}}
function reset(){size();ps=Array.from({length:Number($('nl-count').value)},()=>make());ctx.fillStyle='#050918';ctx.fillRect(0,0,w,h)}
function burst(x,y,n=45){for(let i=0;i<n;i++){const p=make(x,y),a=rand(0,Math.PI*2),v=rand(1,7);p.vx=Math.cos(a)*v;p.vy=Math.sin(a)*v;p.life=rand(20,85);ps.push(p)}if(ps.length>900)ps.splice(0,ps.length-900)}
function render(t){requestAnimationFrame(render);if(!panel.classList.contains('open')||paused){last=t;return}const dt=Math.min((t-last||16)/16,2);last=t;frame+=dt;const speed=Number($('nl-speed').value)*.25,glow=Number($('nl-glow').value);
ctx.fillStyle='rgba(3,7,19,.20)';ctx.fillRect(0,0,w,h);ctx.globalCompositeOperation='lighter';
for(let i=0;i<ps.length;i++){const p=ps[i],dx=mouse.x-p.x,dy=mouse.y-p.y,dist=Math.hypot(dx,dy);
if(mode==='orbit'){p.a+=.005*speed*dt*(i%2?1:-1);p.x=w/2+Math.cos(p.a+i*.1)*p.orbit*1.4;p.y=h/2+Math.sin(p.a+i*.1)*p.orbit*.8}
else if(mode==='vortex'){const a=Math.atan2(p.y-h/2,p.x-w/2)+.024*speed*dt,r=Math.hypot(p.x-w/2,p.y-h/2);p.x=w/2+Math.cos(a)*r;p.y=h/2+Math.sin(a)*r}
else if(mode==='rain'){p.y+=(3+p.r)*speed*dt;if(p.y>h+10){p.y=-10;p.x=rand(0,w)}}
else{p.x+=p.vx*speed*dt;p.y+=p.vy*speed*dt;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;if(mode==='fireworks'){p.life-=dt;if(p.life<0){ps[i]=make();continue}}}
if(dist<155&&mode!=='orbit'){const force=(155-dist)/155*(mouse.down?3:1)*speed;p.x+=dx/(dist||1)*force*dt;p.y+=dy/(dist||1)*force*dt}
ctx.fillStyle=palettes[palette][p.c];ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=glow;
if(mode==='rain')ctx.fillRect(p.x,p.y,p.r*.7,p.r*6);else{ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}}
ctx.globalCompositeOperation='source-over';ctx.shadowBlur=0}
$('nl-open').onclick=()=>{panel.classList.add('open');reset();if(!running){running=true;requestAnimationFrame(render)}};
$('nl-close').onclick=()=>panel.classList.remove('open');
document.querySelectorAll('#nl [data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;reset()});
$('nl-count').oninput=reset;$('nl-reset').onclick=reset;
$('nl-color').onclick=()=>{palette=(palette+1)%palettes.length;reset()};
$('nl-pause').onclick=()=>{paused=!paused;$('nl-pause').textContent=paused?'▶ Resume':'⏸ Pause'};
$('nl-save').onclick=()=>{const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='NitroLab-'+mode+'.png';a.click()};
function pos(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
canvas.addEventListener('pointermove',e=>{const p=pos(e);mouse.x=p.x;mouse.y=p.y;if(mouse.down)burst(p.x,p.y,3)});
canvas.addEventListener('pointerdown',e=>{mouse.down=true;const p=pos(e);mouse.x=p.x;mouse.y=p.y;burst(p.x,p.y);canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointerup',()=>mouse.down=false);canvas.addEventListener('pointerleave',()=>{mouse.down=false;mouse.x=-999;mouse.y=-999});
document.addEventListener('keydown',e=>{if(!panel.classList.contains('open')||['INPUT','TEXTAREA'].includes(document.activeElement.tagName))return;if(e.code==='Space'){e.preventDefault();$('nl-pause').click()}else if(e.key.toLowerCase()==='r')reset();else if('12345'.includes(e.key))document.querySelectorAll('#nl [data-mode]')[Number(e.key)-1]?.click();else if(e.key==='Escape')$('nl-close').click()});
window.addEventListener('resize',()=>{if(panel.classList.contains('open'))reset()});
})();
