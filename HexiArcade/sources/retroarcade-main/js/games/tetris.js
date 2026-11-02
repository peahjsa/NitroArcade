/* ============================================================
   RetroArcade — 俄罗斯方块 Tetris
   ============================================================ */
(function (global) {
  "use strict";

  const COLS = 10;
  const ROWS = 20;
  const CELL = 26;

  const SHAPES = [
    { m: [[1,1,1,1]], color: "#22e4ff" },            // I
    { m: [[1,1],[1,1]], color: "#ffd93d" },          // O
    { m: [[0,1,0],[1,1,1]], color: "#b44dff" },      // T
    { m: [[1,0,0],[1,1,1]], color: "#ff3d8f" },      // L
    { m: [[0,0,1],[1,1,1]], color: "#3dff8f" },      // J
    { m: [[0,1,1],[1,1,0]], color: "#ff8a3d" },      // S
    { m: [[1,1,0],[0,1,1]], color: "#4d9bff" },      // Z
  ];

  function setup(opts) {
    const { mount, hud, sfx, engine } = opts;
    const canvas = document.createElement("canvas");
    canvas.width = COLS * CELL;
    canvas.height = ROWS * CELL;
    canvas.style.width = COLS * CELL + "px";
    canvas.style.height = ROWS * CELL + "px";
    mount.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let board, piece, score, lines, running, over, paused, timer, dropInterval, lastDrop;

    function emptyBoard() {
      return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    }

    function reset() {
      board = emptyBoard();
      score = 0;
      lines = 0;
      dropInterval = 700;
      running = false;
      over = false;
      paused = false;
      hud.setScore(0);
      hud.setBest(engine.bestScore("tetris"));
      spawnPiece();
      draw();
    }

    function spawnPiece() {
      const idx = engine.randInt(0, SHAPES.length - 1);
      const shape = SHAPES[idx];
      piece = {
        m: shape.m.map((r) => r.slice()),
        color: shape.color,
        x: Math.floor((COLS - shape.m[0].length) / 2),
        y: 0,
      };
      if (collides(piece)) gameOver();
    }

    function collides(p) {
      for (let r = 0; r < p.m.length; r++) {
        for (let c = 0; c < p.m[r].length; c++) {
          if (!p.m[r][c]) continue;
          const nx = p.x + c;
          const ny = p.y + r;
          if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
          if (ny >= 0 && board[ny][nx]) return true;
        }
      }
      return false;
    }

    function lock() {
      for (let r = 0; r < piece.m.length; r++) {
        for (let c = 0; c < piece.m[r].length; c++) {
          if (!piece.m[r][c]) continue;
          const ny = piece.y + r;
          if (ny < 0) { gameOver(); return; }
          board[ny][piece.x + c] = piece.color;
        }
      }
      clearLines();
      spawnPiece();
    }

    function clearLines() {
      let cleared = 0;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r].every((v) => v !== 0)) {
          board.splice(r, 1);
          board.unshift(Array(COLS).fill(0));
          cleared++;
          r++;
        }
      }
      if (cleared > 0) {
        const pts = [0, 100, 300, 500, 800][cleared] || 1000;
        score += pts;
        lines += cleared;
        hud.setScore(score);
        sfx.line();
        if (dropInterval > 200) dropInterval = Math.max(200, dropInterval - 30 * cleared);
      }
    }

    function rotate() {
      const m = piece.m;
      const rotated = m[0].map((_, i) => m.map((row) => row[i]).reverse());
      const test = { ...piece, m: rotated };
      if (!collides(test)) {
        piece.m = rotated;
        sfx.rotate();
      }
    }

    function move(dx) {
      const test = { ...piece, x: piece.x + dx };
      if (!collides(test)) {
        piece.x += dx;
        sfx.move();
      }
    }

    function hardDrop() {
      while (!collides({ ...piece, y: piece.y + 1 })) piece.y++;
      sfx.drop();
      lock();
      draw();
    }

    function step() {
      if (!running || paused) return;
      const now = performance.now();
      if (now - lastDrop >= dropInterval) {
        lastDrop = now;
        const test = { ...piece, y: piece.y + 1 };
        if (!collides(test)) {
          piece.y++;
        } else {
          lock();
        }
        draw();
      }
    }

    function gameOver() {
      running = false;
      over = true;
      clearInterval(timer);
      sfx.gameover();
      const isBest = engine.saveScore("tetris", score);
      hud.setBest(engine.bestScore("tetris"));
      hud.showOverlay("游戏结束", "得分 " + score + " · 消除 " + lines + " 行" + (isBest ? " · 🏆 新纪录！" : ""), "再来一局");
    }

    function draw() {
      ctx.fillStyle = "#0a0a18";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // 网格
      ctx.strokeStyle = "rgba(180,77,255,0.07)";
      for (let i = 0; i <= COLS; i++) {
        ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, canvas.height); ctx.stroke();
      }
      for (let j = 0; j <= ROWS; j++) {
        ctx.beginPath(); ctx.moveTo(0, j * CELL); ctx.lineTo(canvas.width, j * CELL); ctx.stroke();
      }
      // 已锁定方块
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (board[r][c]) drawCell(c, r, board[r][c]);
        }
      }
      // 当前方块
      if (piece) {
        for (let r = 0; r < piece.m.length; r++) {
          for (let c = 0; c < piece.m[r].length; c++) {
            if (piece.m[r][c]) drawCell(piece.x + c, piece.y + r, piece.color);
          }
        }
      }
    }

    function drawCell(x, y, color) {
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      const pad = 1;
      ctx.fillRect(x * CELL + pad, y * CELL + pad, CELL - pad * 2, CELL - pad * 2);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(x * CELL + pad, y * CELL + pad, CELL - pad * 2, 3);
    }

    function startLoop() {
      clearInterval(timer);
      lastDrop = performance.now();
      timer = setInterval(step, 16);
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

    engine.bindKey("ArrowLeft", () => { if (running && !paused) move(-1); });
    engine.bindKey("ArrowRight", () => { if (running && !paused) move(1); });
    engine.bindKey("ArrowDown", () => { if (running && !paused) { piece.y++; lastDrop = performance.now(); sfx.move(); } });
    engine.bindKey("ArrowUp", () => { if (running && !paused) rotate(); });
    engine.bindKey("Space", () => { if (running && !paused) hardDrop(); });
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
    btn("◀", () => move(-1));
    btn("旋转", () => rotate());
    btn("▶", () => move(1));
    btn("▼", () => { piece.y++; lastDrop = performance.now(); });
    btn("硬降", hardDrop, true);
    btn("开始", play, true);
    btn("暂停", togglePause, true);
    opts.controls.appendChild(controls);

    reset();
    hud.showOverlay("俄罗斯方块", "←→ 移动 · ↑ 旋转 · ↓ 加速 · 空格硬降", "开始游戏");

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
    id: "tetris",
    name: "俄罗斯方块",
    icon: "🧱",
    desc: "经典消除玩法，旋转与堆叠，消除行数越多得分越高。",
    tags: ["经典", "消除", "键盘"],
    accent: "#b44dff",
    glow: "rgba(180,77,255,0.25)",
    setup,
  });
})(typeof window !== "undefined" ? window : globalThis);
