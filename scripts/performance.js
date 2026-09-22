/* Lightweight FPS + adaptive quality helper */
(() => {
  const N=window.NitroArcade=window.NitroArcade||{};
  let frames=0,last=performance.now(),fps=60,quality="high";
  function tick(t){
    frames++;
    if(t-last>=1000){
      fps=Math.round(frames*1000/(t-last)); frames=0; last=t;
      quality=fps<35?"low":fps<52?"medium":"high";
      document.documentElement.dataset.nitroQuality=quality;
      N.emit?.("performance",{fps,quality});
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  N.performance={get fps(){return fps},get quality(){return quality}};
})();