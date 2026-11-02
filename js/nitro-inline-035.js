
(function(){
 const features=[
  ['game','Is your character from a video game?'],['human','Is your character human?'],['animal','Is your character an animal or animal-like?'],['robot','Is your character a robot or animatronic?'],['horror','Is your character from a scary game or story?'],['hero','Is your character usually a hero?'],['red','Does your character usually wear red?'],['blue','Is blue a main color of your character?'],['green','Is green a main color of your character?'],['hat','Does your character wear a hat?'],['fast','Is your character known for moving very fast?'],['school','Is your character associated with a school?'],['space','Is your character associated with space?'],['yellow','Is yellow a main color of your character?'],['villain','Is your character usually an enemy?'],['plumber','Is your character a plumber?'],['cartoon','Is your character from an animated TV show?'],['bear','Is your character a bear?'],['block','Does your character have a blocky appearance?'],['electric','Does your character use electricity?']
 ];
 const chars=[
 ['Mario','game human hero red hat plumber'],['Luigi','game human hero green hat plumber'],['Sonic','game animal hero blue fast'],['Tails','game animal hero yellow fast'],['Knuckles','game animal hero red fast'],['Baldi','game human villain school horror green'],['Freddy Fazbear','game animal robot horror villain bear'],['Bonnie','game animal robot horror villain blue'],['Chica','game animal robot horror villain yellow'],['Foxy','game animal robot horror villain red fast'],['Pikachu','game animal hero yellow electric'],['Steve (Minecraft)','game human hero blue block'],['Creeper','game villain green block'],['Enderman','game villain block'],['Pac-Man','game hero yellow'],['Ghost (Pac-Man)','game villain'],['Among Us Crewmate','game space'],['Among Us Impostor','game space villain'],['Kirby','game hero'],['Link (Zelda)','game human hero green hat'],['Princess Peach','game human hero'],['Bowser','game animal villain'],['Sans (Undertale)','game hero blue'],['Cuphead','game hero'],['Bendy','game horror villain'],['SpongeBob','cartoon yellow hero'],['Patrick Star','cartoon hero'],['Squidward','cartoon blue'],['Tom (Tom and Jerry)','cartoon animal'],['Jerry (Tom and Jerry)','cartoon animal hero'],['Bugs Bunny','cartoon animal hero'],['Mickey Mouse','cartoon animal hero'],['Darth Vader','human villain space'],['R2-D2','robot hero space'],['Buzz Lightyear','hero space cartoon'],['Lightning McQueen','cartoon red fast'],['Shrek','green hero'],['Spider-Man','human hero red blue'],['Batman','human hero'],['Iron Man','human hero red robot'],['Homer Simpson','cartoon human yellow'],['Bart Simpson','cartoon human yellow'],['Gumball','cartoon animal blue'],['Darwin','cartoon animal'],['Doraemon','cartoon robot blue hero'],['Roblox Noob','game human yellow block']
 ].map(([name,flags])=>({name,flags:new Set(flags.split(' ')),score:0}));
 let answers=[],asked=[],done=false;
 const q=()=>document.getElementById('nitroGenieQuestion');
 const prog=()=>document.getElementById('nitroGenieProgress');
 const buttons=()=>document.getElementById('nitroGenieAnswers');
 const start=()=>document.getElementById('nitroGenieStart');
 function button(label,fn){const b=document.createElement('button');b.className='filter-chip';b.textContent=label;b.style.padding='10px 16px';b.onclick=fn;buttons().appendChild(b)}
 function ranked(){return chars.map(c=>({...c,score:answers.reduce((s,a)=>s+(a.value===0?0:((c.flags.has(a.key)?1:-1)*a.value)),0)})).sort((a,b)=>b.score-a.score)}
 function next(){
  const rankedChars=ranked();
  if(asked.length>=16 || (asked.length>=7 && rankedChars[0].score-rankedChars[1].score>=5))return guess();
  const unasked=features.filter(([key])=>!asked.includes(key));
  if(!unasked.length)return guess();
  const top=rankedChars.slice(0,Math.min(12,rankedChars.length));
  let best=unasked[0],bestScore=-1;
  for(const f of unasked){const n=top.filter(c=>c.flags.has(f[0])).length;const split=Math.min(n,top.length-n);if(split>bestScore){best=f;bestScore=split}}
  asked.push(best[0]);q().textContent=best[1];prog().textContent='Question '+asked.length+' of up to 16';buttons().replaceChildren();
  for(const [label,value] of [['Yes',1],['Probably',0.5],["Don't know",0],['Probably not',-0.5],['No',-1]])button(label,()=>{answers.push({key:best[0],value});next()});
 }
 function guess(){done=true;const names=ranked().slice(0,3).map(x=>x.name);q().textContent='Are you thinking of '+names[0]+'?';prog().textContent='My best guess after '+asked.length+' questions';buttons().replaceChildren();button('🎉 Yes!',()=>{q().textContent='YES! Nitro Genie got it! 🎉';buttons().replaceChildren()});button('No, try another',()=>{q().textContent='Maybe '+names[1]+' or '+names[2]+'?';buttons().replaceChildren();button('Play again',window.nitroGenieStart)});start().textContent='↻ Play again';}
 window.nitroGenieStart=function(){answers=[];asked=[];done=false;start().textContent='↻ Restart';next()};
})();
