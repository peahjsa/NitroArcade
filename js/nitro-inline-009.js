

window.Nitro3DEngine={
  targetRevision:'186',
  get revision(){return window.NITRO_THREE_REVISION||window.THREE?.REVISION||'not loaded'},
  get renderer(){return 'WebGL2 / modern Three.js module with r160 fallback'},
  info(){return {target:this.targetRevision,revision:this.revision,renderer:this.renderer}}
};
