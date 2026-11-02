

const ULTRA_3D_TRACKS = {
  flight3d:   "audio/plane.mp3",
  brickmaze3d:"audio/maze.wav",
  voxel3d:    "audio/voxels.mp3",
  football3d: "audio/football.mp3"
};
let ultra3DAudio = null;
let ultra3DPreviousMenuPlaying = false;

function ultraFindMenuMusic(){
  return document.querySelector('audio[src*="audio/music.mp3"], audio[src$="music.mp3"]');
}
function ultraStop3DMusic(resumeMenu=true){
  if(ultra3DAudio){
    ultra3DAudio.pause();
    ultra3DAudio.currentTime = 0;
    ultra3DAudio.remove();
    ultra3DAudio = null;
  }
  if(resumeMenu && ultra3DPreviousMenuPlaying){
    const menu = ultraFindMenuMusic();
    if(menu) menu.play().catch(()=>{});
  }
  ultra3DPreviousMenuPlaying = false;
}
function ultraStart3DMusic(engine){
  const src = ULTRA_3D_TRACKS[engine];
  if(!src) return;
  ultraStop3DMusic(false);

  const menu = ultraFindMenuMusic();
  ultra3DPreviousMenuPlaying = !!(menu && !menu.paused);
  if(menu) menu.pause();

  const a = document.createElement("audio");
  a.id = "ultra3DGameMusic";
  a.src = src;
  a.loop = true;
  a.preload = "auto";
  a.volume = 0.72;
  document.body.appendChild(a);
  ultra3DAudio = a;
  a.play().catch(err => console.warn("3D game music waiting for browser interaction:", err));
}
