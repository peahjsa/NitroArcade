/* ============================================================
   RetroArcade — 打砖块 Breakout
   ============================================================ */
(function (global) {
  "use strict";

  const W = 480;
  const H = 560;
  const PADDLE_W = 84;
  const PADDLE_H = 12;
  const BALL_R = 7;
  const BRICK_ROWS = 6;
  const BRICK_COLS = 8;
  const BRICK_W = 52;
  const BRICK_H = 20;
  const BRICK_GAP = 6;
  const BRICK_TOP = 60;

  const BRICK_COLORS = ["#ff3d8f", "#ff8a3d", "#ffd93d", "#3dff8f", "#22e4ff", "#b44dff"];

  function setup(opts) {
    const { mount, hud, sfx, engine } = opts;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    mount.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let paddle, ball, bricks, score, lives, running, over, paused, timer, raf, last, keysHeld;

    function reset() {
      paddle = { x: (W - PADDLE_W) / 2, w: PADDLE_W };
      ball = { x: W / 2, y: H - 70, vx: 3.4, vy: -3.4, r: BALL_R };
      bricks = [];
      score = 0;
      lives = 3;
      running = false;
      over = false;
      paused = false;
      keysHeld = { left: false, right: false };
      buildBricks();
      hud.setScore(0);
      hud.setBest(engine.bestScore("breakout"));
      draw();
    }

    function buildBricks() {
      for (let r = 0; r < BRICK_ROWS; r++) {
        for (let c = 0; c < BRICK_COLS; c++) {
          bricks.push({
            x: 12 + c * (BRICK_W + BRICK_GAP),
            y: BRICK_TOP + r * (BRICK_H + BRICK_GAP),
            w: BRICK_W,
            h: BRICK_H,
            color: BRICK_COLORS[r],
            alive: true,
          });
        }
      }
    }

    function update(dt) {
      if (paddle.x < 0) paddle.x = 0;
      if (paddle.x + paddle.w > W) paddle.x = W - paddle.w;

      ball.x += ball.vx * dt * 60;
      ball.y += ball.vy * dt * 60;

      // 墙壁反弹
      if (ball.x - ball.r < 0) { ball.x = ball.r; ball.vx = Math.abs(ball.vx); sfx.move(); }
      if (ball.x + ball.r > W) { ball.x = W - ball.r; ball.vx = -Math.abs(ball.vx); sfx.move(); }
      if (ball.y - ball.r < 0) { ball.y = ball.r; ball.vy = Math.abs(ball.vy); sfx.move(); }

      // 挡板碰撞
      if (
        ball.vy > 0 &&
        ball.y + ball.r >= paddle.y &&
        ball.y + ball.r <= paddle.y + PADDLE_H + 6 &&
        ball.x >= paddle.x - ball.r &&
        ball.x <= paddle.x + paddle.w + ball.r
      ) {
        const hit = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
        ball.vy = -Math.abs(ball.vy);
        ball.vx = hit * 5.2;
        sfx.rotate();
      }

      // 砖块碰撞
      for (const b of bricks) {
        if (!b.alive) continue;
        if (
          ball.x + ball.r > b.x &&
          ball.x - ball.r < b.x + b.w &&
          ball.y + ball.r > b.y &&
          ball.y - ball.r < b.y + b.h
        ) {
          b.alive = false;
          ball.vy = -ball.vy;
          score += 10;
          hud.setScore(score);
          sfx.score();
          break;
        }
      }

      // 落底
      if (ball.y - ball.r > H) {
        lives--;
        if (lives <= 0) return gameOver();
        ball = { x: W / 2, y: H - 70, vx: 3.4, vy: -3.4, r: BALL_R };
        sfx.drop();
      }

      // 胜利
      if (bricks.every((b) => !b.alive)) {
        running = false;
        sfx.win();
        const isBest = engine.saveScore("breakout", score);
        hud.setBest(engine.bestScore("breakout"));
        hud.showOverlay("🎉 通关！", "得分 " + score + (isBest ? " · 🏆 新纪录！" : ""), "再来一局");
      }
    }

    function gameOver() {
      running = false;
      over = true;
      sfx.gameover();
      const isBest = engine.saveScore("breakout", score);
      hud.setBest(engine.bestScore("breakout"));
      hud.showOverlay("游戏结束", "得分 " + score + (isBest ? " · 🏆 新纪录！" : ""), "再来一局");
    }

    function draw() {
      ctx.fillStyle = "#0a0a18";
      ctx.fillRect(0, 0, W, H);

      // 砖块
      for (const b of bricks) {
        if (!b.alive) continue;
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 6;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.fillRect(b.x, b.y, b.w, 4);
      }

      // 挡板
      ctx.fillStyle = "#22e4ff";
      ctx.shadowColor = "#22e4ff";
      ctx.shadowBlur = 14;
      ctx.fillRect(paddle.x, paddle.y, paddle.w, PADDLE_H);
      ctx.shadowBlur = 0;

      // 球
      ctx.fillStyle = "#ffd93d";
      ctx.shadowColor = "#ffd93d";
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 生命
      ctx.font = "14px monospace";
      ctx.fillStyle = "#8a8ab8";
      ctx.fillText("♥".repeat(Math.max(0, lives)), 12, H - 14);
    }

    function loop(ts) {
      if (last === null) last = ts;
      const dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;
      if (running && !paused) {
        if (keysHeld.left) paddle.x -= 6.4;
        if (keysHeld.right) paddle.x += 6.4;
        update(dt);
      }
      draw();
      raf = requestAnimationFrame(loop);
    }

    function play() {
      if (over) reset();
      running = true;
      paused = false;
      hud.hideOverlay();
    }

    function togglePause() {
      if (over) return;
      paused = !paused;
      if (paused) hud.showOverlay("已暂停", "按空格或点击继续", "继续");
      else hud.hideOverlay();
    }

    engine.bindKey("ArrowLeft", () => { keysHeld.left = true; });
    engine.bindKey("ArrowRight", () => { keysHeld.right = true; });
    engine.bindKey("Space", () => { if (!running && !over) play(); else togglePause(); });
    engine.bindKey("Enter", () => { if (over) play(); });

    const controls = document.createElement("div");
    const btn = (label, fn, wide) => {
      const b = document.createElement("button");
      b.className = "ctrl-btn" + (wide ? " wide" : "");
      b.textContent = label;
      b.addEventListener("click", fn);
      controls.appendChild(b);
      return b;
    };
    const leftBtn = btn("◀", () => { keysHeld.left = true; setTimeout(() => (keysHeld.left = false), 180); });
    const rightBtn = btn("▶", () => { keysHeld.right = true; setTimeout(() => (keysHeld.right = false), 180); });
    btn("开始", play, true);
    btn("暂停", togglePause, true);
    opts.controls.appendChild(controls);

    reset();
    last = null;
    raf = requestAnimationFrame(loop);
    hud.showOverlay("打砖块", "←→ 移动挡板 · 空格暂停", "开始游戏");

    return {
      destroy() {
        cancelAnimationFrame(raf);
        engine.clearKeys();
        mount.innerHTML = "";
        opts.controls.innerHTML = "";
      },
    };
  }

  global.RetroArcade.register({
    id: "breakout",
    name: "打砖块",
    icon: "🧱",
    desc: "反弹小球击碎全部砖块，挡板接球，三条命挑战高分。",
    tags: ["经典", "反应", "键盘"],
    accent: "#ffd93d",
    glow: "rgba(255,217,61,0.25)",
    setup,
  });
})(typeof window !== "undefined" ? window : globalThis);
