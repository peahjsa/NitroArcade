
(()=>{
const $=id=>document.getElementById(id);
const section=document.createElement('section');
section.id='nitroStreamSection';
section.innerHTML=`<h3>🌐 Spotify & SoundCloud</h3>
<p>Paste a public Spotify track/album/playlist link or a public SoundCloud track/playlist link. The official embedded player loads online; no login or API key is needed here.</p>
<div class="mixrow"><input id="nitroStreamInput" type="url" placeholder="https://open.spotify.com/track/... or https://soundcloud.com/..." aria-label="Music link"><button id="nitroStreamLoad">▶ Load player</button><button id="nitroStreamClear">✕ Remove</button></div>
<div id="nitroStreamMessage" role="status" style="color:#90c9e9;font-size:13px"></div><div id="nitroStreamPlayer"></div>
<small>Spotify and SoundCloud may limit playback or request a login depending on the track, region, or account. Requires internet. Embedded music is not included in .nitromix exports.</small>`;
const mixCard=$('nitroMixPanel')?.querySelector('.mixcard');if(mixCard)mixCard.append(section);
function musicURL(raw){
 let u;try{u=new URL(raw.trim())}catch{return null}
 if(u.protocol!=='https:')return null;
 const host=u.hostname.toLowerCase();
 if(host==='open.spotify.com'){
   const parts=u.pathname.split('/').filter(Boolean);
   const idx=parts[0]==='intl-en'?1:0;
   if(!['track','album','playlist','episode','show'].includes(parts[idx])||! /^[A-Za-z0-9]{15,30}$/.test(parts[idx+1]||''))return null;
   return {provider:'Spotify',src:'https://open.spotify.com/embed/'+parts[idx]+'/'+parts[idx+1],height:352};
 }
 if(host==='soundcloud.com'||host==='www.soundcloud.com'||host==='on.soundcloud.com'){
   return {provider:'SoundCloud',src:'https://w.soundcloud.com/player/?url='+encodeURIComponent(u.href)+'&color=%2300baff&auto_play=false&hide_related=false&show_comments=false',height:190};
 }
 return null;
}
$('nitroStreamLoad').onclick=()=>{
 const result=musicURL($('nitroStreamInput').value),holder=$('nitroStreamPlayer');
 holder.replaceChildren();
 if(!result){$('nitroStreamMessage').textContent='Please paste a valid Spotify or SoundCloud track/playlist URL.';return}
 const frame=document.createElement('iframe');frame.src=result.src;frame.height=String(result.height);frame.title=result.provider+' embedded music player';frame.loading='lazy';frame.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';frame.referrerPolicy='strict-origin-when-cross-origin';holder.append(frame);
 $('nitroStreamMessage').textContent=result.provider+' player loaded. If unavailable, check whether the link is public.';
};
$('nitroStreamClear').onclick=()=>{$('nitroStreamPlayer').replaceChildren();$('nitroStreamMessage').textContent='Player removed.'};


})();
