(function(){
'use strict';
const HEXI_COUNTS = {"90s-games-main": 113, "arcade-portal-main": 96, "retroarcade-main": 1, "gh-arcade": 7};
const HEXI_TOTAL = 217;
const MACRO_INDIVIDUAL = 285; // 120 ALIN + 165 ULTRA, as stated by the MacroArcade section
const labels={small:'Small Games',big:'Big Games',challenge:'Challenges',macro:'MacroArcade',fnaf:'FNAF Games',cool:'HexiArcade'};
function update(){
 const cards=[...document.querySelectorAll('#gameGrid .game-card[data-game-id]')];
 const counts={small:0,big:0,challenge:0,macro:0,fnaf:0,cool:0};
 const unique=new Set();
 cards.forEach(card=>{const id=card.dataset.gameId;if(unique.has(id))return;unique.add(id);const p=card.dataset.arcadePart||(id==='hackerchallenge'?'challenge':'small');if(p in counts)counts[p]++;});
 counts.fnaf=document.querySelectorAll('#nitroFnafGames .nf-card').length;
 counts.macro=document.querySelectorAll('#nmWorldGrid .nmWorldCard').length;
 counts.cool=HEXI_TOTAL;
 Object.entries(counts).forEach(([k,n])=>{const btn=document.getElementById('part'+k[0].toUpperCase()+k.slice(1));if(btn){let badge=btn.querySelector('.nitro-count-badge');if(!badge){badge=document.createElement('span');badge.className='nitro-count-badge';badge.style.cssText='display:inline-block;margin-left:6px;padding:1px 6px;border-radius:9px;background:#593388;color:#fff;font:700 11px system-ui';btn.appendChild(badge);}badge.textContent=n;}});
 const el=document.getElementById('nitro-count-report');if(el){
 const sum=counts.small+counts.big+counts.challenge+counts.fnaf+HEXI_TOTAL+MACRO_INDIVIDUAL;
 el.innerHTML='<strong>GAME COUNTS — EACH SECTION</strong><div class="nitro-count-grid">'+Object.entries(counts).map(([k,n])=>'<span>'+labels[k]+': <b>'+n+'</b></span>').join('')+'</div><small>MacroArcade: '+counts.macro+' world/collection launchers, with '+MACRO_INDIVIDUAL+' individual games advertised inside the ALIN/ULTRA collections. HexiArcade: '+HEXI_TOTAL+' individual games ('+Object.entries(HEXI_COUNTS).map(([k,v])=>k+': '+v).join(', ')+'). Main sections count distinct game cards. Counts may overlap where a collection also has a shortcut elsewhere. <b>Do not add these into a unique overall total without deduplicating.</b></small>';
 }
}
function init(){const anchor=document.querySelector('.arcade-part-tabs');if(!anchor)return;const report=document.createElement('section');report.id='nitro-count-report';report.style.cssText='margin:12px 0;padding:14px 16px;border:1px solid #8453d6;border-radius:14px;background:#141025;color:#e8dfff;font:13px/1.65 system-ui';anchor.insertAdjacentElement('afterend',report);update();setTimeout(update,600);setTimeout(update,2000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();