/* NitroArcade audio manager */
(() => {
  const N = window.NitroArcade = window.NitroArcade || {};
  let current=null;
  const state={muted:false,volume:0.65};
  N.audio = {
    state,
    play(src,{loop=true,volume=state.volume,restart=false}={}) {
      if(current && current.src.endsWith(src) && !restart){ current.play().catch(()=>{}); return current; }
      if(current) current.pause();
      current=new Audio(src); current.loop=loop; current.volume=state.muted?0:volume;
      current.play().catch(()=>console.info("[NitroArcade] Audio waits for user interaction."));
      return current;
    },
    stop(){ if(current){current.pause();current.currentTime=0;} },
    pause(){ current?.pause(); },
    resume(){ current?.play().catch(()=>{}); },
    mute(v=true){state.muted=v;if(current)current.muted=v;N.emit?.("audiochange",{...state});},
    toggleMute(){N.audio.mute(!state.muted);return state.muted;},
    setVolume(v){state.volume=Math.max(0,Math.min(1,v));if(current)current.volume=state.volume;N.emit?.("audiochange",{...state});},
    get current(){return current;}
  };
  document.addEventListener("visibilitychange",()=>{ if(document.hidden && current && !current.paused) current.pause(); });
})();