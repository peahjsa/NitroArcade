(()=>{'use strict';
const $=s=>document.querySelector(s);let renderer,scene,camera,root,controls,stage,frame=0,raf=0,loaded=false,visible=false,lastSig='',watch=0;
let rot=.75,tilt=.78,zoom=34,drag=false,lastX=0,lastY=0,mode='orbit',details=true,animate=true,live=true;
const saved=()=>{try{return JSON.parse(localStorage.getItem('nitroarcade:studio-draft:v2')||'null')}catch{return null}};
const color=(s,fallback)=>{try{return new THREE.Color(s||fallback)}catch{return new THREE.Color(fallback)}};
function ui(){const bar=$('#ngsOverlay .ngs-stagebar');if(!bar||$('#ngs3dToggle'))return;
 const b=document.createElement('button');b.className='ngs-btn';b.id='ngs3dToggle';b.textContent='🧊 3D STUDIO';b.title='Open an editable 3D voxel view of your current level';b.onclick=open;bar.append(b);
}
function createUI(){if($('#ngs3dPanel'))return;
 const panel=document.createElement('div');panel.id='ngs3dPanel';panel.style.cssText='position:fixed;inset:0;z-index:2147483000;background:#050914f5;display:none;flex-direction:column;color:#eaf8ff;font:13px system-ui';
 const header=document.createElement('div');header.style.cssText='display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:10px 14px;background:#0c1930;border-bottom:1px solid #335072';
 const title=document.createElement('strong');title.textContent='🧊 NITRO GAME STUDIO — 3D LEVEL EDITOR';title.style.marginRight='auto';header.append(title);
 const btn=(txt,fn)=>{const b=document.createElement('button');b.textContent=txt;b.style.cssText='border:1px solid #5072a6;background:#1b3154;color:white;border-radius:7px;padding:8px;cursor:pointer';b.onclick=fn;header.append(b);return b};
 btn('⟳ Sync 2D level',()=>rebuild());btn('◉ Orbit / ⌖ Paint',()=>{mode=mode==='orbit'?'paint':'orbit';status('Mode: '+mode.toUpperCase()+' — '+(mode==='paint'?'click a voxel to add a block, Shift+click to erase':'drag to orbit, scroll to zoom'))});
 btn('✦ Detail '+(details?'ON':'OFF'),e=>{details=!details;e.target.textContent='✦ Detail '+(details?'ON':'OFF');rebuild()});
 btn('☀ Day / Night',()=>{night=!night;setLighting()});
 btn('📸 3D PNG',()=>{renderer.render(scene,camera);renderer.domElement.toBlob(blob=>{if(!blob)return;const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download='nitro-3d-studio.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1200)})});
 btn('Export 3D Level',()=>{const data=read();if(!data)return;const blob=new Blob([JSON.stringify({format:'nitro-studio-3d-level-v1',source:data,view:{rot,tilt,zoom}},null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='nitro-3d-level.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)});
 btn('✕ Close',close);
 const hint=document.createElement('div');hint.id='ngs3dHint';hint.style.cssText='padding:7px 14px;background:#12223a;color:#a9c7e2';hint.textContent='Orbit: drag mouse • Zoom: scroll • Paint: click to add blocks / Shift+click to erase • Changes sync to 2D editor';
 stage=document.createElement('div');stage.id='ngs3dStage';stage.style.cssText='flex:1;min-height:0;position:relative;overflow:hidden';
 panel.append(header,hint,stage);document.body.append(panel);
}
let night=false;
async function ensureThree(){if(window.THREE?.WebGLRenderer)return;
 await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='./scripts/three.min.js';s.onload=()=>window.THREE?.WebGLRenderer?resolve():reject(Error('Three.js renderer not available'));s.onerror=()=>reject(Error('Could not load local Three.js'));document.head.append(s)})}
function init3D(){const T=THREE;scene=new T.Scene();scene.background=new T.Color('#09172b');scene.fog=new T.Fog('#09172b',30,80);
 camera=new T.PerspectiveCamera(53,1,.1,150);renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 if('outputColorSpace'in renderer&&T.SRGBColorSpace)renderer.outputColorSpace=T.SRGBColorSpace;
 if('toneMapping'in renderer&&T.ACESFilmicToneMapping)renderer.toneMapping=T.ACESFilmicToneMapping;
 stage.append(renderer.domElement);renderer.domElement.style.cssText='width:100%;height:100%;display:block;touch-action:none';
 const ambient=new T.HemisphereLight(0xbedfff,0x1c264a,1.4);ambient.name='ambient';scene.add(ambient);
 const sun=new T.DirectionalLight(0xffe2bb,2.4);sun.name='sun';sun.position.set(9,18,12);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-25;sun.shadow.camera.right=25;sun.shadow.camera.top=25;sun.shadow.camera.bottom=-25;sun.shadow.normalBias=.03;scene.add(sun);
 const accent=new T.PointLight(0x45c9ff,18,38);accent.position.set(-11,8,-4);scene.add(accent);
 const ground=new T.Mesh(new T.PlaneGeometry(100,100),new T.MeshStandardMaterial({color:0x101b2a,roughness:.95}));ground.rotation.x=-Math.PI/2;ground.position.y=-.65;ground.receiveShadow=true;scene.add(ground);
 const grid=new T.GridHelper(100,100,0x35688b,0x22394d);grid.position.y=-.64;scene.add(grid);
 root=new T.Group();scene.add(root);setLighting();
 const el=renderer.domElement;
 el.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY;el.setPointerCapture(e.pointerId)});
 el.addEventListener('pointermove',e=>{if(!drag||mode!=='orbit')return;rot+=(e.clientX-lastX)*.009;tilt=Math.max(.15,Math.min(1.48,tilt+(e.clientY-lastY)*.007));lastX=e.clientX;lastY=e.clientY;cameraMove()});
 el.addEventListener('pointerup',e=>{if(mode==='paint'&&Math.abs(e.clientX-lastX)<7&&Math.abs(e.clientY-lastY)<7)paint(e);drag=false});
 el.addEventListener('pointercancel',()=>{drag=false});
 el.addEventListener('lostpointercapture',()=>{drag=false});
 el.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(8,Math.min(75,zoom+e.deltaY*.025));cameraMove()},{passive:false});
 window.addEventListener('resize',resize);resize();cameraMove();
}
function status(msg){const h=$('#ngs3dHint');if(h)h.textContent=msg}
function setLighting(){if(!scene)return;scene.background=new THREE.Color(night?'#040814':'#09172b');scene.fog.color.copy(scene.background);scene.getObjectByName('sun').intensity=night?.6:2.4;scene.getObjectByName('ambient').intensity=night?.8:1.4}
function cameraMove(){if(!camera)return;const target=new THREE.Vector3(0,1,0);camera.position.set(Math.sin(rot)*Math.cos(tilt)*zoom,Math.sin(tilt)*zoom+1,Math.cos(rot)*Math.cos(tilt)*zoom);camera.lookAt(target)}
function resize(){if(!renderer||!stage)return;const w=Math.max(1,stage.clientWidth),h=Math.max(1,stage.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
function read(){const d=saved();if(d?.tiles?.length)return d;return {w:24,h:14,tiles:Array.from({length:336},(_,i)=>Math.floor(i/24)===13?1:i===24*12+2?2:i===24*12+21?3:0),colors:{block:'#38546a',accent:'#69e8ff',hazard:'#ff6178',coin:'#ffd66b',goal:'#7cefa5',enemyA:'#b48cff',enemyB:'#ff83b7'}}}
function mat(c,metal=.1,rough=.6,emissive=0){return new THREE.MeshStandardMaterial({color:color(c,'#456a87'),metalness:metal,roughness:rough,emissive:color(c,'#456a87'),emissiveIntensity:emissive})}
const palette={1:'block',2:'accent',3:'goal',4:'hazard',5:'coin',6:'enemyA',7:'enemyB'};
function rebuild(){if(!root)return;const d=read(),T=THREE,w=d.w||24,h=d.h||14,c=d.colors||{},tiles=d.tiles||[];
 while(root.children.length){const ch=root.children[0];root.remove(ch);ch.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose())}})}
 const geo=new T.BoxGeometry(.94,.94,.94),edgeGeo=new T.EdgesGeometry(geo);
 const seamGeo=new T.BoxGeometry(.73,.04,.73),seamMat=mat('#90bbdb',.2,.5);
 const material={1:mat(c.block||'#38546a',.12,.52),2:mat(c.accent||'#69e8ff',.25,.28,.18),3:mat(c.goal||'#7cefa5',.1,.36,.25),4:mat(c.hazard||'#ff6178',.08,.42,.2),5:mat(c.coin||'#ffd66b',.7,.2,.25),6:mat(c.enemyA||'#b48cff',.12,.45),7:mat(c.enemyB||'#ff83b7',.12,.45)};
 const outlines=new T.LineBasicMaterial({color:0xa3d8ff,transparent:true,opacity:.17});
 const add=(mesh,x,y,z,t)=>{mesh.position.set(x,y,z);mesh.userData.tile=t;mesh.userData.cell=[Math.round(x+w/2-.5),Math.round((h-1)-(z+h/2-.5))];mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);return mesh};
 const box=(x,y,z,t,scale)=>{const mesh=new T.Mesh(geo,material[t]||material[1]);if(scale)mesh.scale.set(...scale);add(mesh,x,y,z,t);if(details&&t===1){const edges=new T.LineSegments(edgeGeo,outlines);mesh.add(edges)}return mesh};
 const coins=[];
 for(let i=0;i<Math.min(tiles.length,w*h);i++){
  const t=+tiles[i];if(!t)continue;const x=i%w-w/2+.5,z=(h-1-Math.floor(i/w))-h/2+.5;
  if(t===5){const coin=new T.Mesh(new T.TorusGeometry(.29,.09,8,18),material[5]);add(coin,x,.35,z,t);coins.push(coin);continue}
  if(t===4){const mesh=new T.Mesh(new T.ConeGeometry(.42,.9,4),material[4]);add(mesh,x,.0,z,t);mesh.rotation.y=Math.PI/4;continue}
  if(t===2){box(x,.0,z,2,[.8,.8,.8]);if(details&&root.children.filter(o=>o.isPointLight).length<12){const beacon=new T.PointLight(color(c.accent,'#69e8ff'),1.3,3);beacon.position.set(x,.9,z);root.add(beacon)}continue}
  if(t===3){box(x,0,z,3,[.85,.9,.85]);const cap=new T.Mesh(new T.ConeGeometry(.37,.6,5),material[3]);cap.position.set(x,.75,z);root.add(cap);continue}
  box(x,0,z,t,[.95,.95,.95]);
  if(details&&t===1){const seam=new T.Mesh(seamGeo,seamMat);seam.position.set(x,.49,z);root.add(seam)}
 }
 root.userData.coins=coins;
 root.userData.level=d;
 lastSig=JSON.stringify([d.tiles,d.colors,d.theme]);status(`3D preview: ${w} × ${h} level • ${tiles.filter(Boolean).length} placed tiles • Orbit or Paint mode • Save your 2D level to sync changes`)
}
function paint(e){const d=read(),rect=renderer.domElement.getBoundingClientRect(),mouse=new THREE.Vector2(((e.clientX-rect.left)/rect.width)*2-1,-((e.clientY-rect.top)/rect.height)*2+1),ray=new THREE.Raycaster();ray.setFromCamera(mouse,camera);
 const hits=ray.intersectObjects(root.children,true).filter(x=>x.object.userData.cell);let x,z;
 if(hits.length){const cell=hits[0].object.userData.cell;x=cell[0];z=cell[1];}
 else{const plane=new THREE.Plane(new THREE.Vector3(0,1,0),0),point=new THREE.Vector3();if(!ray.ray.intersectPlane(plane,point))return;x=Math.round(point.x+(d.w||24)/2-.5);z=Math.round((d.h||14)-1-(point.z+(d.h||14)/2-.5))}
 if(x<0||z<0||x>=d.w||z>=d.h)return;
 const idx=z*d.w+x;d.tiles[idx]=e.shiftKey?0:1;
 try{localStorage.setItem('nitroarcade:studio-draft:v2',JSON.stringify(d));status('3D block edited. Reopen Game Studio to refresh its 2D editor.');rebuild()}catch(err){status('Could not save block: '+err.message)}
}
function loop(){if(!visible)return;raf=requestAnimationFrame(loop);if(document.hidden)return;frame++;if(root&&animate&&frame%2===0){for(const coin of root.userData.coins||[]){coin.rotation.y+=.05;coin.position.y=.35+Math.sin(frame*.04+coin.position.x)*.12}}renderer.render(scene,camera)}
async function open(){createUI();const panel=$('#ngs3dPanel');panel.style.display='flex';visible=true;try{await ensureThree();if(!renderer)init3D();resize();rebuild();cameraMove();cancelAnimationFrame(raf);loop();clearInterval(watch);watch=setInterval(()=>{if(!visible||!live)return;const d=saved();if(!d)return;const sig=JSON.stringify([d.tiles,d.colors,d.theme]);if(sig!==lastSig)rebuild()},1200)}catch(e){status('3D preview unavailable: '+e.message);console.error(e)}}
function close(){visible=false;drag=false;cancelAnimationFrame(raf);clearInterval(watch);const panel=$('#ngs3dPanel');if(panel)panel.style.display='none'}
function init(){ui();new MutationObserver(ui).observe(document.body,{childList:true,subtree:true})}
window.NitroStudio3D={open,close,rebuild};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
