/* ============================================================
   RetroArcade — 主入口
   负责：菜单渲染、游戏切换、HUD 管理、触屏滑动支持
   ============================================================ */
(function () {
  "use strict";

  const engine = window.RetroArcade;
  if (!engine) {
    throw new Error("[RetroArcade] 引擎加载失败，请检查 js/engine.js");
  }

  const $ = (id) => document.getElementById(id);
  const screenMenu = $("screen-menu");
  const screenGame = $("screen-game");
  const gameGrid = $("game-grid");
  const gameStage = $("game-stage");
  const gameControls = $("game-controls");
  const gameTitle = $("game-title");
  const hudScore = $("hud-score");
  const hudBest = $("hud-best");
  const overlay = $("game-overlay");
  const overlayTitle = $("overlay-title");
  const overlayDesc = $("overlay-desc");
  const btnPrimary = $("btn-primary");
  const btnRestart = $("btn-restart");
  const btnBack = $("btn-back");
  const btnSound = $("btn-sound");
  const statBest = $("stat-best");

  let currentGame = null;
  let currentInstance = null;
  let primaryAction = null;

  /* ---------- HUD 接口 ---------- */
  const hud = {
    setScore(v) { hudScore.textContent = v; },
    setBest(v) { hudBest.textContent = v; },
    showOverlay(title, desc, primaryLabel) {
      overlayTitle.textContent = title;
      overlayDesc.textContent = desc || "";
      btnPrimary.textContent = primaryLabel || "继续";
      primaryAction = primaryLabel === "继续挑战" ? "continue" : "primary";
      overlay.classList.add("show");
    },
    hideOverlay() { overlay.classList.remove("show"); },
  };

  /* ---------- 菜单渲染 ---------- */
  function renderMenu() {
    gameGrid.innerHTML = "";
    const games = engine.list();
    games.forEach((g) => {
      const card = document.createElement("button");
      card.className = "game-card";
      card.style.setProperty("--accent", g.accent || "#22e4ff");
      card.style.setProperty("--accent-glow", g.glow || "rgba(34,228,255,0.25)");
      card.innerHTML =
        '<span class="card-icon">' + g.icon + "</span>" +
        '<span class="card-name">' + g.name + "</span>" +
        '<p class="card-desc">' + g.desc + "</p>" +
        '<div class="card-meta">' +
        g.tags.map((t) => '<span class="chip">' + t + "</span>").join("") +
        '<span class="chip highlight">🏆 ' + engine.bestScore(g.id) + "</span>" +
        "</div>";
      card.addEventListener("click", () => openGame(g.id));
      gameGrid.appendChild(card);
    });
    statBest.textContent = engine.totalBest();
  }

  /* ---------- 游戏切换 ---------- */
  function openGame(id) {
    const game = engine.get(id);
    if (!game) return;
    currentGame = game;
    screenMenu.classList.remove("active");
    screenGame.classList.add("active");
    gameTitle.textContent = game.icon + " " + game.name;
    gameStage.innerHTML = "";
    gameControls.innerHTML = "";
    hud.setScore(0);
    hud.setBest(engine.bestScore(id));
    engine.sfx.click();
    currentInstance = engine.start(id, gameStage, {
      mount: gameStage,
      controls: gameControls,
      hud,
      sfx: engine.sfx,
      engine,
    });
  }

  function backToMenu() {
    engine.stop();
    currentInstance = null;
    currentGame = null;
    overlay.classList.remove("show");
    screenGame.classList.remove("active");
    screenMenu.classList.add("active");
    renderMenu();
  }

  /* ---------- 按钮事件 ---------- */
  btnBack.addEventListener("click", backToMenu);

  btnPrimary.addEventListener("click", () => {
    if (primaryAction === "continue") {
      // 2048 达成后继续挑战：关闭覆盖层继续
      overlay.classList.remove("show");
      return;
    }
    // 触发当前游戏的主操作（开始/继续）
    const ev = new KeyboardEvent("keydown", { code: "Enter", bubbles: true });
    window.dispatchEvent(ev);
  });

  btnRestart.addEventListener("click", () => {
    if (currentGame) openGame(currentGame.id);
  });

  btnSound.addEventListener("click", () => {
    const on = !engine.isSoundOn();
    engine.setSound(on);
    btnSound.textContent = on ? "🔊" : "🔇";
    if (on) engine.sfx.click();
  });

  /* ---------- 触屏滑动支持（2048 / 贪吃蛇） ---------- */
  let touchStart = null;
  gameStage.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    touchStart = { x: t.clientX, y: t.clientY };
  }, { passive: true });

  gameStage.addEventListener("touchend", (e) => {
    if (!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
    const code = Math.abs(dx) > Math.abs(dy)
      ? (dx > 0 ? "ArrowRight" : "ArrowLeft")
      : (dy > 0 ? "ArrowDown" : "ArrowUp");
    const ev = new KeyboardEvent("keydown", { code, bubbles: true });
    window.dispatchEvent(ev);
  }, { passive: true });

  /* ---------- 初始化 ---------- */
  engine.initInput();
  renderMenu();
})();
