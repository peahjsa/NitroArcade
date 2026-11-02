/* ============================================================
   RetroArcade — 贪吃蛇 Snake
   ============================================================ */
(function (global) {
  "use strict";

  const COLS = 20;
  const ROWS = 20;
  const CELL = 22;

  function setup(opts) {
    const { mount, hud, sfx, engine } = opts;
    const canvas = document.createElement("canvas");
    canvas.width = COLS * CELL;
    canvas.height = ROWS * CELL;
    canvas.style.width = COLS * CELL + "px";
    canvas.style.height = ROWS * CELL + "px";
    mount.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let snake, dir, nextDir, food, score, running, over, timer, speed, paused;

    function reset() {
      snake = [{ x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }];
      dir = { x: 1, y: 0 };
      nextDir = { x: 1, y: 0 };
      score = 0;
      speed = 140;
      running = false;
      over = false;
      paused = false;
      spawnFood();
      hud.setScore(0);
      hud.setBest(engine.bestScore("snake"));
      draw();
    }

    function spawnFood() {
      let p;
      do {
        p = { x: engine.randInt(0, COLS - 1), y: engine.randInt(0, ROWS - 1) };
      } while (snake.some((s) => s.x === p.x && s.y === p.y));
      food = p;
    }

    function step() {
      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      const hitWall = head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS;
      const hitSelf = snake.some((s) => s.x === head.x && s.y === head.y);
      if (hitWall || hitSelf) return gameOver();

      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        hud.setScore(score);
        sfx.score();
        if (speed > 60) speed -= 2;
        spawnFood();
      } else {
        snake.pop();
      }
      draw();
    }

    function gameOver() {
      running = false;
      over = true;
      clearInterval(timer);
      sfx.gameover();
      const isBest = engine.saveScore("snake", score);
      hud.setBest(engine.bestScore("snake"));
      hud.showOverlay(
        "游戏结束",
        "得分 " + score + (isBest ? " · 🏆 新纪录！" : ""),
        "再来一局"
      );
    }

    function draw() {
      ctx.fillStyle = "#0a0a18";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // 网格
      ctx.strokeStyle = "rgba(34,228,255,0.06)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= COLS; i++) {
        ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, canvas.height); ctx.stroke();
      }
      for (let j = 0; j <= ROWS; j++) {
        ctx.beginPath(); ctx.moveTo(0, j * CELL); ctx.lineTo(canvas.width, j * CELL); ctx.stroke();
      }
      // 食物
      ctx.fillStyle = "#ff3d8f";
      ctx.shadowColor = "#ff3d8f";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      // 蛇
      snake.forEach((s, i) => {
        const isHead = i === 0;
        ctx.fillStyle = isHead ? "#22e4ff" : "#0f9bb5";
        ctx.shadowColor = "#22e4ff";
        ctx.shadowBlur = isHead ? 10 : 4;
        const pad = 2;
        ctx.fillRect(s.x * CELL + pad, s.y * CELL + pad, CELL - pad * 2, CELL - pad * 2);
      });
      ctx.shadowBlur = 0;
    }

    function startLoop() {
      clearInterval(timer);
      timer = setInterval(() => { if (running && !paused) step(); }, speed);
    }

    function play() {
      if (over) reset();
      running = true;
      paused = false;
      hud.hideOverlay();
      startLoop();
    }

    function togglePause() {
      if (over) return;
      paused = !paused;
      if (paused) hud.showOverlay("已暂停", "按空格或点击继续", "继续");
      else hud.hideOverlay();
    }

    engine.bindKey("ArrowUp", () => { if (dir.y !== 1) nextDir = { x: 0, y: -1 }; });
    engine.bindKey("ArrowDown", () => { if (dir.y !== -1) nextDir = { x: 0, y: 1 }; });
    engine.bindKey("ArrowLeft", () => { if (dir.x !== 1) nextDir = { x: -1, y: 0 }; });
    engine.bindKey("ArrowRight", () => { if (dir.x !== -1) nextDir = { x: 1, y: 0 }; });
    engine.bindKey("Space", () => { if (!running && !over) play(); else togglePause(); });
    engine.bindKey("Enter", () => { if (over) play(); });

    // 触屏方向按钮
    const controls = document.createElement("div");
    const btn = (label, fn, wide) => {
      const b = document.createElement("button");
      b.className = "ctrl-btn" + (wide ? " wide" : "");
      b.textContent = label;
      b.addEventListener("click", fn);
      controls.appendChild(b);
      return b;
    };
    btn("◀", () => { if (dir.x !== 1) nextDir = { x: -1, y: 0 }; });
    btn("▲", () => { if (dir.y !== 1) nextDir = { x: 0, y: -1 }; });
    btn("▼", () => { if (dir.y !== -1) nextDir = { x: 0, y: 1 }; });
    btn("▶", () => { if (dir.x !== -1) nextDir = { x: 1, y: 0 }; });
    btn("开始", play, true);
    btn("暂停", togglePause, true);
    opts.controls.appendChild(controls);

    reset();
    hud.showOverlay("贪吃蛇", "方向键/滑动控制移动 · 空格暂停", "开始游戏");

    return {
      destroy() {
        clearInterval(timer);
        engine.clearKeys();
        mount.innerHTML = "";
        opts.controls.innerHTML = "";
      },
    };
  }

  global.RetroArcade.register({
    id: "snake",
    name: "贪吃蛇",
    icon: "🐍",
    desc: "经典贪吃蛇，吃下光点不断变长，避开墙壁与自身。",
    tags: ["经典", "键盘", "触屏"],
    accent: "#22e4ff",
    glow: "rgba(34,228,255,0.25)",
    setup,
  });
})(typeof window !== "undefined" ? window : globalThis);
