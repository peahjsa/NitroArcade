/* NitroArcade graphics upgrade: reversible GPU shader overlay, canvas filters,
   studio grid, snapshot export and live graphics profiles. No external dependencies. */
(()=>{"use strict";
const KEY="nitro-graphics-v1";
const defaults={preset:"vivid",shader:true,glow:true,grid:false,scanlines:false,particles:true};
let cfg={...defaults};try{cfg={...cfg,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(cfg))}catch{}};
const css=document.createElement("style");css.id="nitro-graphics-styles";document.head.append(css);
const styles={
  off:"none",crisp:"contrast(1.04) saturate(1.08)",vivid:"contrast(1.09) saturate(1.26) brightness(1.04)",
  neon:"contrast(1.15) saturate(1.45) brightness(1.06)",retro:"contrast(1.18) saturate(.83) sepia(.12)"
};
function apply(){
 const filter=styles[cfg.preset]||styles.vivid;
 css.textContent=`
 .native-game-canvas,.mega-canvas,.ultra-canvas,.premium-canvas,.runner-canvas,
 #sncv,#nwfCanvas,#ngsCanvas,.bm95-stage canvas{
   filter:${filter}!important;
   ${cfg.glow?"box-shadow:0 10px 35px #0009,0 0 25px #65cfff28!important;":""}
 }
 #ngsCanvas{${cfg.grid?"background-image:linear-gradient(#9ceaff24 1px,transparent 1px),linear-gradient(90deg,#9ceaff24 1px,transparent 1px)!important;background-size:40px 40px!important;":""}}
 ${cfg.scanlines?`.native-game-canvas-wrap,.ngs-stagehost{background:repeating-linear-gradient(0deg,#0000 0px,#0000 3px,#0003 4px);}`:""}
 `;
 document.querySelectorAll(".nitro-gl-shader").forEach(x=>x.style.display=cfg.shader?"block":"none");
 save();
}
const shaderInstances=new WeakMap();
function shaderBackground(canvas){
 if(!cfg.shader||shaderInstances.has(canvas))return;
 const host=canvas.parentElement;
 if(!host||!host.isConnected||!canvas.width||!canvas.height)return;
 // Only decorate dedicated arcade canvas containers; no change to game rendering context.
 if(!host.matches(".native-game-canvas-wrap,.ngs-stagehost,.mega-panel,.ultra-panel,.premium-panel"))return;
 const layer=document.createElement("canvas");layer.className="nitro-gl-shader";
 Object.assign(layer.style,{position:"absolute",inset:"0",width:"100%",height:"100%",pointerEvents:"none",opacity:".22",zIndex:"0"});
 const oldPosition=getComputedStyle(host).position;if(oldPosition==="static")host.style.position="relative";
 canvas.style.position="relative";canvas.style.zIndex="1";
 host.insertBefore(layer,host.firstChild);
 const gl=layer.getContext("webgl",{alpha:true,antialias:false,powerPreference:"low-power"});
 if(!gl){layer.remove();return}
 const vs=`attribute vec2 p;varying vec2 uv;void main(){uv=(p+1.0)*0.5;gl_Position=vec4(p,0.,1.);}`;
 const fs=`precision mediump float;varying vec2 uv;uniform float t;void main(){vec2 q=uv-.5;float a=atan(q.y,q.x);float r=length(q);float waves=sin(11.*a+3.*t+18.*r)*.5+.5;float halo=pow(max(0.,1.-r*1.8),3.);vec3 col=mix(vec3(.03,.17,.33),vec3(.38,.13,.65),waves);gl_FragColor=vec4(col,(.12+.65*halo)*.7);}`;
 function compile(type,source){let s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
 try{
 const prog=gl.createProgram();gl.attachShader(prog,compile(gl.VERTEX_SHADER,vs));gl.attachShader(prog,compile(gl.FRAGMENT_SHADER,fs));gl.linkProgram(prog);
 if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(prog));
 gl.useProgram(prog);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 const pos=gl.getAttribLocation(prog,"p");gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
 const time=gl.getUniformLocation(prog,"t");
 let raf=0,frames=0;
 function render(){
  if(!layer.isConnected){cancelAnimationFrame(raf);gl.deleteBuffer(b);gl.deleteProgram(prog);return}
  if(!cfg.shader||document.hidden){raf=requestAnimationFrame(render);return}
  if(frames++%5===0){const w=Math.max(1,Math.round(layer.clientWidth/4)),h=Math.max(1,Math.round(layer.clientHeight/4));if(layer.width!==w||layer.height!==h){layer.width=w;layer.height=h;gl.viewport(0,0,w,h)}gl.uniform1f(time,performance.now()*.0004);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
  raf=requestAnimationFrame(render);
 }
 shaderInstances.set(canvas,layer);render();
 }catch(e){layer.remove();console.warn("Nitro graphics shader disabled:",e)}
}
function scan(){document.querySelectorAll("#ngsCanvas,.native-game-canvas,.mega-canvas,.ultra-canvas,.premium-canvas").forEach(shaderBackground)}
const mo=new MutationObserver(()=>{if(cfg.shader)scan()});
function init(){apply();scan();mo.observe(document.body,{subtree:true,childList:true})}
function button(text,click){let b=document.createElement("button");b.textContent=text;b.type="button";b.onclick=click;b.style.cssText="background:#273355;color:#f1f6ff;border:1px solid #5268a3;border-radius:8px;padding:8px 10px;cursor:pointer;font:600 12px system-ui";return b}
function addControls(){
 const floating=button("✦ Graphics",openPanel);floating.id="nitro-graphics-button";
 floating.style.cssText+=";position:fixed;right:15px;bottom:115px;z-index:99999;background:linear-gradient(120deg,#542ea0,#147b99)";
 document.body.append(floating);
}
function exportCanvas(canvas){if(!canvas)return alert("Open a canvas game or Game Studio first.");try{canvas.toBlob(blob=>{if(!blob)return alert("Canvas export unavailable.");const u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download="nitroarcade-screenshot.png";a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)},"image/png")}catch(e){alert("This game blocks screenshots because it uses cross-origin media.")}}
function openPanel(){
 document.getElementById("nitro-graphics-panel")?.remove();
 const overlay=document.createElement("div");overlay.id="nitro-graphics-panel";overlay.style.cssText="position:fixed;inset:0;background:#000b;z-index:2147483001;display:grid;place-items:center;padding:12px";
 const card=document.createElement("section");card.style.cssText="width:min(650px,100%);max-height:90vh;overflow:auto;background:#101627;color:#eef5ff;border:1px solid #5268a3;border-radius:15px;padding:20px;font:13px system-ui;box-shadow:0 16px 70px #000b";
 const heading=document.createElement("h2");heading.textContent="✦ NitroArcade Graphics Lab";heading.style.margin="0 0 9px";
 const note=document.createElement("p");note.textContent="Visual enhancements for NitroArcade's built-in canvas games. The WebGL shader decorates the canvas background; it does not convert Canvas 2D games to 3D. External iframe games keep their own graphics.";note.style.cssText="opacity:.85;line-height:1.5";
 const row=document.createElement("div");row.style.cssText="display:flex;gap:8px;flex-wrap:wrap;margin:14px 0";
 const preset=document.createElement("select");for(const k of Object.keys(styles)){const o=document.createElement("option");o.value=k;o.textContent=k.toUpperCase();preset.append(o)}preset.value=cfg.preset;preset.style.cssText="background:#202b48;color:white;padding:9px;border-radius:8px";preset.onchange=()=>{cfg.preset=preset.value;apply()};row.append(preset);
 const toggles=document.createElement("div");toggles.style.cssText="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:12px 0";
 for(const [key,label] of [["shader","WebGL animated background"],["glow","Canvas glow"],["grid","Game Studio grid"],["scanlines","Retro scanline styling"]]){
  const wrap=document.createElement("label");wrap.style.cssText="display:flex;gap:7px;align-items:center";
  const check=document.createElement("input");check.type="checkbox";check.checked=cfg[key];check.onchange=()=>{cfg[key]=check.checked;apply();scan()};wrap.append(check,document.createTextNode(label));toggles.append(wrap)
 }
 row.append(button("Screenshot Game Studio",()=>exportCanvas(document.getElementById("ngsCanvas"))));
 row.append(button("Screenshot active canvas",()=>{const candidates=[...document.querySelectorAll("canvas")].filter(x=>x.offsetWidth>300&&x.offsetHeight>180&&x.getBoundingClientRect().top<innerHeight&&x.getBoundingClientRect().bottom>0);exportCanvas(candidates.at(-1))}));
 row.append(button("Reset graphics",()=>{cfg={...defaults};apply();overlay.remove()}));
 row.append(button("Close",()=>overlay.remove()));
 const info=document.createElement("p");info.style.opacity=".7";info.textContent="WebGL shader: "+(!!document.createElement("canvas").getContext("webgl")?"supported":"not available")+". Presets save in this browser. Use the Studio's built-in art and code editors for actual gameplay changes.";
 card.append(heading,note,toggles,row,info);overlay.append(card);overlay.addEventListener("click",e=>{if(e.target===overlay)overlay.remove()});document.body.append(overlay)
}
window.NitroGraphics={open:openPanel,config:()=>({...cfg}),exportCanvas};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
