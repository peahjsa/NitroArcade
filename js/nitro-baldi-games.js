(function(){
 const additions=[
  {id:'baldi_fns_ultimate',name:"Baldi's Fun New School Plus Ultimate Edition",category:'arcade',type:'iframe',source:'https://html-classic.itch.zone/html/9131604/index.html',desc:'Baldi HTML5 game · Internet required; embedding may be restricted'},
  {id:'baldi_fns_remastered',name:"Baldi's Fun New School Remastered",category:'arcade',type:'iframe',source:'https://html-classic.itch.zone/html/7228562/index.html',desc:'Baldi HTML5 game · Internet required; embedding may be restricted'},
  {id:'zombie_tsunami_html',name:'Zombie Tsunami',category:'arcade',type:'iframe',source:'https://gameshost.io/HTML5GAMES/zombi-tsunami-html',desc:'Zombie Tsunami · Internet required; embedding may be restricted'}
 ];
 function register(){
  if(typeof gamesDatabase==='undefined'||!Array.isArray(gamesDatabase))return false;
  for(const g of additions)if(!gamesDatabase.some(x=>x.id===g.id))gamesDatabase.push(g);
  return true;
 }
 function install(){
  if(!register())return false;
  if(typeof window.showArcadePart!=='function')return false;
  if(window.showArcadePart.__baldiInstalled)return true;
  const original=window.showArcadePart;
  function extended(part){
   if(part!=='baldi')return original.apply(this,arguments);
   original.call(this,'big');
   document.querySelectorAll('#gameGrid .game-card').forEach(card=>{
    card.style.display=card.dataset.arcadePart==='baldi'?'':'none';
   });
   const title=document.getElementById('libraryPartTitle');
   const subtitle=document.getElementById('libraryPartSubtitle');
   if(title)title.textContent='Baldi Games';
   if(subtitle)subtitle.textContent='Baldi games collection — play inside NitroArcade.';
   document.querySelectorAll('.arcade-part-tabs .filter-chip').forEach(btn=>btn.classList.toggle('active',btn.id==='partBaldi'));
   const noResults=document.getElementById('noResults');if(noResults)noResults.style.display='none';
   document.getElementById('featuredSection')?.scrollIntoView({behavior:'smooth',block:'start'});
  }
  extended.__baldiInstalled=true;
  window.showArcadePart=extended;
  return true;
 }
 if(!install())document.addEventListener('DOMContentLoaded',()=>{if(!install())window.addEventListener('load',install,{once:true});});
})();
