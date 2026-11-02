(()=>{'use strict';
const status=document.getElementById('status'),play=document.getElementById('play'),host=document.getElementById('nes-player');
let player=null,loading=null;
const urls=[
 'https://cdn.jsdelivr.net/npm/jsnes@2.1.0/dist/jsnes.min.js',
 'https://unpkg.com/jsnes@2.1.0/dist/jsnes.min.js',
 'https://cdnjs.cloudflare.com/ajax/libs/jsnes/2.1.0/jsnes.min.js'
];
function setStatus(s){status.textContent=s;}
function loadScript(url){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=url;s.async=true;s.onload=()=>window.jsnes&&window.jsnes.Browser?resolve():reject(Error('Invalid emulator build'));s.onerror=()=>reject(Error('Network failed'));document.head.appendChild(s);});}
async function engine(){if(window.jsnes&&window.jsnes.Browser)return;if(loading)return loading;loading=(async()=>{for(const url of urls){try{setStatus('Connecting to NES emulator…');await loadScript(url);return;}catch(e){console.warn('NES CDN failed:',url,e);}}throw Error('All emulator CDNs failed. Check the internet or Firefox tracking restrictions.');})();try{await loading;}finally{loading=null;}}
function romBytes(){const encoded=document.getElementById('rom-data').textContent.replace(/\s+/g,'');const binary=atob(encoded);const bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);if(binary.slice(0,4)!=='NES\x1a')throw Error('Embedded ROM header invalid');return bytes;}
async function start(){play.disabled=true;try{await engine();const bytes=romBytes();if(player){player.destroy();player=null;}host.replaceChildren();player=new window.jsnes.Browser({container:host,onError:e=>setStatus('Emulator error: '+(e?.message||e))});player.loadROM(bytes);setStatus('Mario is running! Click the game and press Enter to start.');play.textContent='↻ RESTART MARIO';}catch(e){setStatus('Could not start: '+e.message);console.error(e);}finally{play.disabled=false;}}
play.addEventListener('click',start);
setStatus('Ready to load automatically when you click Play. No separate files required.');
})();