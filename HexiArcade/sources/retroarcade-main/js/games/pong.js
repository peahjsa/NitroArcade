/* ============================================================
   RetroArcade — 乒乓 Pong（人机对战）
   ============================================================ */
(function (global) {
  "use strict";

  const W = 560;
  const H = 420;
  const PADDLE_W = 10;
  const PADDLE_H = 72;
  const BALL_R = 8;
  const WIN_SCORE = 7;

  function setup(opts) {
    const { mount, hud, sfx, engine } = opts;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    mount.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let player, ai, ball, scoreP, scoreA, running, over, paused, raf, last, aiSpeed;

    function reset() {
      player = { x: 24, y: (H - PADDLE_H) / 2, w: PADDLE_W, h: PADDLE_H };
      ai = { x: W - 24 - PADDLE_W, y: (H - PADDLE_H) / 2, w: PADDLE_W, h: PADDLE_H };
      scoreP = 0;
      scoreA = 0;
      aiSpeed = 3.2;
      running = false;
      over = false;
      paused = false;
      serve();
      hud.setScore(0);
      hud.setBest(engine.bestScore("pong"));
      draw();
    }

    function serve() {
      const dir = Math.random() < 0.5 ? 1 : -1;
      const ang = (Math.random() * 0.6 - 0.3) * Math.PI / 4;
      ball = { x: W / 2, y: H / 2, vx: dir * 4.4, vy: Math.sin(ang) * 4.4 };
    }

    function update(dt) {
      // 玩家
      if (engine.isDown("ArrowUp")) player.y -= 6.4;
      if (engine.isDown("ArrowDown")) player.y += 6.4;
      player.y = Math.max(0, Math.min(H - player.h, player.y));

      // AI
      const target = ball.vy > 0 ? ball.y : ball.y;
      if (ai.y + ai.h / 2 < target - 6) ai.y += aiSpeed;
      else if (ai.y + ai.h / 2 > target + 6) ai.y -= aiSpeed;
      ai.y = Math.max(0, Math.min(H - ai.h, ai.y));

      ball.x += ball.vx * dt * 60;
      ball.y += ball.vy * dt * 60;

      // 上下反弹
      if (ball.y - BALL_R < 0) { ball.y = BALL_R; ball.vy = Math.abs(ball.vy); sfx.move(); }
      if (ball.y + BALL_R > H) { ball.y = H - BALL_R; ball.vy = -Math.abs(ball.vy); sfx.move(); }

      // 玩家挡板
      if (
        ball.vx < 0 &&
        ball.x - BALL_R <= player.x + player.w &&
        ball.x - BALL_R >= player.x - 4 &&
        ball.y >= player.y - BALL_R &&
        ball.y <= player.y + player.h + BALL_R
      ) {
        const hit = (ball.y - (player.y + player.h / 2)) / (player.h / 2);
        ball.vx = Math.abs(ball.vx);
        ball.vy = hit * 5.6;
        sfx.rotate();
      }

      // AI 挡板
      if (
        ball.vx > 0 &&
        ball.x + BALL_R >= ai.x &&
        ball.x + BALL_R <= ai.x + ai.w + 4 &&
        ball.y >= ai.y - BALL_R &&
        ball.y <= ai.y + ai.h + BALL_R
      ) {
        const hit = (ball.y - (ai.y + ai.h / 2)) / (ai.h / 2);
        ball.vx = -Math.abs(ball.vx);
        ball.vy = hit * 5.6;
        sfx.rotate();
      }

      // 得分
      if (ball.x - BALL_R < 0) {
        scoreA++;
        hud.setScore(scoreP);
        sfx.score();
        if (scoreA >= WIN_SCORE) return gameOver();
        serve();
      }
      if (ball.x + BALL_R > W) {
        scoreP++;
        hud.setScore(scoreP);
        sfx.score();
        if (scoreP >= WIN_SCORE) return gameOver();
        serve();
      }
    }

    function gameOver() {
      running = false;
      over = true;
      const win = scoreP >= WIN_SCORE;
      sfx.win();
      const isBest = engine.saveScore("pong", scoreP);
      hud.setBest(engine.bestScore("pong"));
      hud.showOverlay(
        win ? "🏆 你赢了！" : "🤖 AI 获胜",
        "比分 " + scoreP + " : " + scoreA + (isBest ? " · 🏆 新纪录！" : ""),
        "再来一局"
      );
    }

    function draw() {
      ctx.fillStyle = "#0a0a18";
      ctx.fillRect(0, 0, W, H);

      // 中线
      ctx.strokeStyle = "rgba(138,138,184,0.25)";
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.stroke();
      ctx.setLineDash([]);

      // 玩家
      ctx.fillStyle = "#22e4ff";
      ctx.shadowColor = "#22e4ff";
      ctx.shadowBlur = 12;
      ctx.fillRect(player.x, player.y, player.w, player.h);
      ctx.shadowBlur = 0;

      // AI
      ctx.fillStyle = "#ff3d8f";
      ctx.shadowColor = "#ff3d8f";
      ctx.shadowBlur = 12;
      ctx.fillRect(ai.x, ai.y, ai.w, ai.h);
      ctx.shadowBlur = 0;

      // 球
      ctx.fillStyle = "#ffd93d";
      ctx.shadowColor = "#ffd93d";
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 比分
      ctx.font = "bold 26px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "#e8e8ff";
      ctx.fillText(scoreP + "  :  " + scoreA, W / 2, 36);
      ctx.textAlign = "left";
    }

    function loop(ts) {
      if (last === null) last = ts;
      const dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;
      if (running && !paused) update(dt);
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

    engine.bindKey("ArrowUp", () => {});
    engine.bindKey("ArrowDown", () => {});
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
    btn("▲", () => { player.y -= 40; });
    btn("▼", () => { player.y += 40; });
    btn("开始", play, true);
    btn("暂停", togglePause, true);
    opts.controls.appendChild(controls);

    reset();
    last = null;
    raf = requestAnimationFrame(loop);
    hud.showOverlay("乒乓对战", "↑↓ 移动球拍 · 空格暂停 · 先得 7 分获胜", "开始游戏");

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
    id: "pong",
    name: "乒乓对战",
    icon: "🏓",
    desc: "经典乒乓人机对战，先得 7 分者获胜，AI 会逐渐变强。",
    tags: ["对战", "反应", "键盘"],
    accent: "#ff3d8f",
    glow: "rgba(255,61,143,0.25)",
    setup,
  });
})(typeof window !== "undefined" ? window : globalThis);
