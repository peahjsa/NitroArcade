/* NitroArcade Web Platform 2 — optional utilities, no global API monkey-patching. */
(()=>{
"use strict";
const N=window.NitroArcade=window.NitroArcade||{};
const results=[];
const record=(name,ok,details="")=>({name,ok,details});
const available=(name,fn)=>{try{return record(name,!!fn())}catch(e){return record(name,false,e.message)}};
const supports=()=>[
 available("Fetch",()=>typeof fetch==="function"),
 available("XMLHttpRequest",()=>typeof XMLHttpRequest==="function"),
 available("WebSockets",()=>typeof WebSocket==="function"),
 available("Server-Sent Events",()=>typeof EventSource==="function"),
 available("WebAssembly",()=>typeof WebAssembly==="object"),
 available("Web Workers",()=>typeof Worker==="function"),
 available("IndexedDB",()=>!!indexedDB),
 available("Cache Storage",()=>!!window.caches),
 available("Service Workers",()=>"serviceWorker" in navigator),
 available("WebGL",()=>!!document.createElement("canvas").getContext("webgl")),
 available("WebGL2",()=>!!document.createElement("canvas").getContext("webgl2")),
 available("WebGPU",()=>!!navigator.gpu),
 available("Web Audio",()=>!!(window.AudioContext||window.webkitAudioContext)),
 available("WebRTC",()=>!!window.RTCPeerConnection),
 available("Gamepad API",()=>"getGamepads" in navigator),
 available("File System Access",()=>"showOpenFilePicker" in window),
 available("Clipboard API",()=>!!navigator.clipboard),
 available("Notifications",()=>"Notification" in window),
 available("Storage Estimate",()=>!!navigator.storage?.estimate),
 available("Compression Streams",()=>!!window.CompressionStream),
 available("BroadcastChannel",()=>!!window.BroadcastChannel),
 available("Web Crypto",()=>!!crypto?.subtle),
 available("Web Animations",()=>!!Element.prototype.animate),
 available("Performance Observer",()=>!!window.PerformanceObserver),
 available("OffscreenCanvas",()=>!!window.OffscreenCanvas),
 available("WebCodecs",()=>!!window.VideoDecoder),
 available("MediaDevices",()=>!!navigator.mediaDevices),
 available("WebTransport",()=>!!window.WebTransport),
 available("Manifest",()=>!!document.querySelector('link[rel="manifest"]'))
];
const history=[];
function log(kind,details){history.push({time:new Date().toLocaleTimeString(),kind,details:String(details).slice(0,300)});if(history.length>100)history.shift();}
function safeURL(url){const u=new URL(url,location.href);if(!["https:","http:"].includes(u.protocol))throw Error("Only HTTP(S) addresses are supported");return u.href;}
async function fetchJSON(url,{timeout=12000,method="GET",body,headers={}}={}){
 const ctrl=new AbortController(), timer=setTimeout(()=>ctrl.abort(),timeout);
 try{
  const response=await fetch(safeURL(url),{method,headers:{"Accept":"application/json",...headers},body,signal:ctrl.signal});
  if(!response.ok)throw Error("HTTP "+response.status);
  const data=await response.json();log("fetch","OK "+response.status+" "+url);return data;
 }catch(e){log("fetch",e.message);throw e}finally{clearTimeout(timer)}
}
function xhr(url,{timeout=12000,responseType="text"}={}){
 return new Promise((resolve,reject)=>{
  let x=new XMLHttpRequest();x.open("GET",safeURL(url));x.timeout=timeout;x.responseType=responseType;
  x.onload=()=>x.status>=200&&x.status<300?resolve(x.response):reject(Error("HTTP "+x.status));
  x.onerror=()=>reject(Error("Network or CORS error"));x.ontimeout=()=>reject(Error("Timed out"));x.send();
 });
}
function socket(url,{onMessage,onOpen,onClose,onError}={}){
 const u=new URL(url);if(!["ws:","wss:"].includes(u.protocol))throw Error("Use ws:// or wss://");
 const ws=new WebSocket(u.href);
 ws.onmessage=e=>{log("websocket","Message received");onMessage?.(e.data)};
 ws.onopen=e=>{log("websocket","Connected");onOpen?.(e)};
 ws.onclose=e=>{log("websocket","Closed");onClose?.(e)};
 ws.onerror=e=>{log("websocket","Connection error");onError?.(e)};
 return ws;
}
function events(url,onMessage){const e=new EventSource(safeURL(url));e.onmessage=m=>onMessage?.(m.data);return e}
async function wasm(source,imports={}){
 if(typeof WebAssembly!=="object")throw Error("WebAssembly unavailable");
 if(source instanceof Uint8Array||source instanceof ArrayBuffer)return WebAssembly.instantiate(source,imports);
 const response=await fetch(safeURL(source));if(!response.ok)throw Error("WASM HTTP "+response.status);
 if(WebAssembly.instantiateStreaming){try{return await WebAssembly.instantiateStreaming(response.clone(),imports)}catch{}}
 return WebAssembly.instantiate(await response.arrayBuffer(),imports);
}
const DB="nitroarcade-platform", STORE="records";
function openDB(){return new Promise((res,rej)=>{if(!window.indexedDB)return rej(Error("IndexedDB unavailable"));const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE)};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function db(op,key,value){
 const conn=await openDB();return new Promise((res,rej)=>{
 const tx=conn.transaction(STORE,op==="get"?"readonly":"readwrite"),s=tx.objectStore(STORE);
 const r=op==="get"?s.get(key):op==="set"?s.put(value,key):s.delete(key);
 r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);tx.oncomplete=()=>conn.close();tx.onabort=()=>conn.close();
 });
}
async function cache(url){if(!window.caches)throw Error("Cache Storage unavailable");const u=safeURL(url);const response=await fetch(u,{mode:"cors"});if(!response.ok)throw Error("HTTP "+response.status);const c=await caches.open("nitroarcade-manual-v2");await c.put(u,response.clone());return response}
async function storage(){return navigator.storage?.estimate?.()||null}
async function testWasm(){const bytes=new Uint8Array([0,97,115,109,1,0,0,0]);return WebAssembly.validate(bytes)}
async function testFetch(){const url=new URL(location.href);if(url.protocol==="file:")return {ok:false,message:"File mode: local fetch may be blocked. Host on localhost or HTTPS for network tests."};try{await fetch(location.href,{cache:"no-store"});return{ok:true,message:"Same-origin fetch succeeded"}}catch(e){return{ok:false,message:e.message}}}
async function diagnostics(){
 const rows=supports();const checks=await Promise.allSettled([testWasm(),storage()]);
 rows.push(record("WASM validation",checks[0].status==="fulfilled"&&checks[0].value===true));
 rows.push(record("Storage quota",checks[1].status==="fulfilled",checks[1].status==="fulfilled"&&checks[1].value?Math.round((checks[1].value.quota||0)/1048576)+" MB quota":"Not available"));
 return rows;
}
function escapeText(t){return String(t??"")}
function openPanel(){
 document.getElementById("nitro-platform-panel")?.remove();
 const overlay=document.createElement("div");overlay.id="nitro-platform-panel";
 overlay.style.cssText="position:fixed;inset:0;background:#000b;z-index:2147483000;display:grid;place-items:center;padding:14px;font:13px system-ui";
 const panel=document.createElement("section");panel.style.cssText="width:min(780px,100%);max-height:90vh;overflow:auto;background:#0e1020;color:#eaf0ff;border:1px solid #6656b9;border-radius:15px;padding:20px;box-shadow:0 15px 60px #000a";
 const h=document.createElement("h2");h.textContent="⚙ NitroArcade Web Platform";h.style.margin="0 0 10px";
 const note=document.createElement("p");note.textContent="Browser capabilities are not automatically enabled for third-party games. Some require HTTPS, permissions, CORS, or a backend.";note.style.cssText="opacity:.8;line-height:1.5";
 const buttons=document.createElement("div");buttons.style.cssText="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0";
 const b=(label,action)=>{const el=document.createElement("button");el.textContent=label;el.style.cssText="background:#45349a;color:white;border:1px solid #7463c6;padding:9px 12px;border-radius:8px;cursor:pointer";el.onclick=action;buttons.append(el);return el};
 const output=document.createElement("div");output.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:7px";
 const status=document.createElement("p");status.style.opacity=".85";
 const render=rows=>{output.replaceChildren();for(const r of rows){const item=document.createElement("div");item.style.cssText="padding:9px;background:#1a1b30;border:1px solid #323451;border-radius:8px";item.textContent=(r.ok?"✓ ":"— ")+r.name+(r.details?" · "+r.details:"");item.style.color=r.ok?"#a7f3c4":"#f8c3bd";output.append(item)}status.textContent=rows.filter(r=>r.ok).length+" / "+rows.length+" checks passed (availability ≠ permission)"};
 b("Run deeper tests",async()=>{status.textContent="Testing…";render(await diagnostics())});
 b("Copy report",()=>{const data=JSON.stringify({locationProtocol:location.protocol,results:supports(),history},null,2);if(navigator.clipboard&&isSecureContext)navigator.clipboard.writeText(data).catch(()=>prompt("Copy report:",data));else prompt("Copy report:",data)});
 b("Close",()=>overlay.remove());
 panel.append(h,note,buttons,status,output);overlay.append(panel);
 overlay.addEventListener("click",e=>{if(e.target===overlay)overlay.remove()});
 document.addEventListener("keydown",function close(e){if(e.key==="Escape"){overlay.remove();document.removeEventListener("keydown",close)}});
 document.body.append(overlay);render(supports());
}
N.platform={version:"2.0",supports,diagnostics,openPanel,fetchJSON,xhr,socket,events,wasm,db,cache,storage,history};
function addButton(){
 if(document.getElementById("nitro-platform-button"))return;
 const btn=document.createElement("button");btn.id="nitro-platform-button";btn.type="button";btn.textContent="⚙ Network / WASM";
 btn.title="Inspect NitroArcade browser capabilities";
 btn.style.cssText="position:fixed;bottom:68px;right:15px;z-index:100000;background:linear-gradient(120deg,#5633a3,#1989ad);border:1px solid #8f7ad9;color:white;border-radius:12px;padding:10px 13px;font:700 12px system-ui;cursor:pointer;box-shadow:0 5px 22px #0009";
 btn.addEventListener("click",openPanel);document.body.append(btn);
}
// Floating diagnostics button intentionally disabled for USB edition.
})();
