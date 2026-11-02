/* ============================================================
   RetroArcade — 共享游戏引擎
   提供：游戏注册、主循环、键盘/触屏输入、WebAudio 音效、本地最高分存储
   ============================================================ */
(function (global) {
  "use strict";

  const STORAGE_KEY = "retroarcade.scores.v1";

  /* ---------- 游戏注册表 ---------- */
  const registry = [];
  let current = null;

  function register(game) {
    if (!game || !game.id || !game.name || !game.setup) {
      throw new Error("[RetroArcade] 无效的游戏定义: " + (game && game.id));
    }
    registry.push(game);
  }

  function list() {
    return registry.slice();
  }

  function get(id) {
    return registry.find((g) => g.id === id) || null;
  }

  /* ---------- 本地最高分（localStorage + 内存回退） ---------- */
  const memoryStore = {};

  function hasStorage() {
    try { return typeof localStorage !== "undefined" && localStorage; } catch (e) { return false; }
  }

  function loadScores() {
    if (hasStorage()) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (e) { /* 忽略 */ }
    }
    return { ...memoryStore };
  }

  function persistScores(scores) {
    Object.assign(memoryStore, scores);
    if (hasStorage()) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(scores)); } catch (e) { /* 忽略 */ }
    }
  }

  function bestScore(gameId) {
    const scores = loadScores();
    return scores[gameId] || 0;
  }

  function saveScore(gameId, score) {
    const scores = loadScores();
    if (score > (scores[gameId] || 0)) {
      scores[gameId] = score;
      persistScores(scores);
      return true; // 新纪录
    }
    return false;
  }

  function totalBest() {
    const scores = loadScores();
    return Object.values(scores).reduce((a, b) => a + b, 0);
  }

  /* ---------- WebAudio 音效（零外部资源） ---------- */
  let audioCtx = null;
  let soundOn = true;

  function ensureAudio() {
    if (!audioCtx) {
      try {
        audioCtx = new (global.AudioContext || global.webkitAudioContext)();
      } catch (e) {
        audioCtx = null;
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
  }

  function beep(freq, duration, type, volume, when) {
    if (!soundOn || !audioCtx) return;
    try {
      const t0 = audioCtx.currentTime + (when || 0);
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type || "square";
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(volume || 0.06, t0);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + (duration || 0.1));
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t0);
      osc.stop(t0 + (duration || 0.1) + 0.02);
    } catch (e) { /* 忽略音频异常 */ }
  }

  const sfx = {
    move: () => beep(220, 0.03, "square", 0.03),
    rotate: () => beep(320, 0.04, "square", 0.04),
    drop: () => beep(520, 0.06, "triangle", 0.06),
    score: () => { beep(660, 0.06, "square", 0.05); beep(880, 0.08, "square", 0.05, 0.06); },
    line: () => { beep(523, 0.08, "square", 0.06); beep(659, 0.08, "square", 0.06, 0.07); beep(784, 0.1, "square", 0.06, 0.14); },
    gameover: () => { beep(400, 0.12, "sawtooth", 0.06); beep(300, 0.14, "sawtooth", 0.06, 0.12); beep(200, 0.2, "sawtooth", 0.06, 0.26); },
    win: () => { [523, 659, 784, 1047].forEach((f, i) => beep(f, 0.12, "triangle", 0.07, i * 0.09)); },
    click: () => beep(180, 0.03, "square", 0.04),
  };

  function setSound(on) {
    soundOn = on;
    if (on) ensureAudio();
  }
  function isSoundOn() { return soundOn; }

  /* ---------- 输入管理 ---------- */
  const keys = {};
  const keyHandlers = {};

  function bindKey(code, handler) {
    keyHandlers[code] = handler;
  }

  function clearKeys() {
    for (const k in keyHandlers) delete keyHandlers[k];
    for (const k in keys) delete keys[k];
  }

  function isDown(code) { return !!keys[code]; }

  function initInput() {
    global.addEventListener("keydown", (e) => {
      keys[e.code] = true;
      if (keyHandlers[e.code]) {
        e.preventDefault();
        keyHandlers[e.code](e);
      }
      // 防止方向键/空格滚动页面
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
      }
    });
    global.addEventListener("keyup", (e) => { keys[e.code] = false; });
    global.addEventListener("blur", () => { for (const k in keys) keys[k] = false; });
  }

  /* ---------- 游戏生命周期 ---------- */
  function start(gameId, mount, hud) {
    const game = get(gameId);
    if (!game) return null;
    if (current && current.destroy) current.destroy();
    current = game;
    ensureAudio();
    return game.setup({ mount, hud, sfx, engine: api });
  }

  function stop() {
    if (current && current.destroy) current.destroy();
    current = null;
  }

  /* ---------- 工具 ---------- */
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const api = {
    register,
    list,
    get,
    bestScore,
    saveScore,
    totalBest,
    sfx,
    setSound,
    isSoundOn,
    bindKey,
    clearKeys,
    isDown,
    start,
    stop,
    randInt,
  };

  global.RetroArcade = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
