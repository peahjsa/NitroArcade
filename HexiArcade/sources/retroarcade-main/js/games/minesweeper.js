/* ============================================================
   RetroArcade — 扫雷 Minesweeper
   ============================================================ */
(function (global) {
  "use strict";

  const COLS = 12;
  const ROWS = 12;
  const MINES = 18;
  const CELL = 34;

  function setup(opts) {
    const { mount, hud, sfx, engine } = opts;
    const canvas = document.createElement("canvas");
    canvas.width = COLS * CELL;
    canvas.height = ROWS * CELL;
    canvas.style.width = COLS * CELL + "px";
    canvas.style.height = ROWS * CELL + "px";
    mount.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let grid, revealed, flagged, mines, score, running, over, won, paused, firstClick;

    function reset() {
      grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
      revealed = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
      flagged = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
      mines = [];
      score = 0;
      running = false;
      over = false;
      won = false;
      paused = false;
      firstClick = true;
      hud.setScore(0);
      hud.setBest(engine.bestScore("minesweeper"));
      draw();
    }

    function placeMines(safeX, safeY) {
      let placed = 0;
      while (placed < MINES) {
        const x = engine.randInt(0, COLS - 1);
        const y = engine.randInt(0, ROWS - 1);
        if (x === safeX && y === safeY) continue;
        if (grid[y][x] === -1) continue;
        grid[y][x] = -1;
        mines.push({ x, y });
        placed++;
      }
      // 计算数字
      for (const m of mines) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = m.x + dx;
            const ny = m.y + dy;
            if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
            if (grid[ny][nx] !== -1) grid[ny][nx]++;
          }
        }
      }
    }

    function reveal(x, y) {
      if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return;
      if (revealed[y][x] || flagged[y][x]) return;
      revealed[y][x] = true;
      if (grid[y][x] === -1) return gameOver();
      score += 1;
      hud.setScore(score);
      if (grid[y][x] === 0) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            reveal(x + dx, y + dy);
          }
        }
      }
      checkWin();
    }

    function checkWin() {
      const totalCells = COLS * ROWS;
      const revealedCount = revealed.flat().filter(Boolean).length;
      if (revealedCount === totalCells - MINES) {
        won = true;
        running = false;
        sfx.win();
        const isBest = engine.saveScore("minesweeper", score);
        hud.setBest(engine.bestScore("minesweeper"));
        hud.showOverlay("🎉 你赢了！", "成功排雷 " + score + " 格" + (isBest ? " · 🏆 新纪录！" : ""), "再来一局");
      }
    }

    function gameOver() {
      running = false;
      over = true;
      sfx.gameover();
      for (const m of mines) revealed[m.y][m.x] = true;
      const isBest = engine.saveScore("minesweeper", score);
      hud.setBest(engine.bestScore("minesweeper"));
      hud.showOverlay("💥 踩雷了", "得分 " + score + (isBest ? " · 🏆 新纪录！" : ""), "再来一局");
      draw();
    }

    function draw() {
      ctx.fillStyle = "#0a0a18";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const px = x * CELL;
          const py = y * CELL;
          if (revealed[y][x]) {
            ctx.fillStyle = "#12122a";
            ctx.fillRect(px + 1, py + 1, CELL - 2, CELL - 2);
            if (grid[y][x] === -1) {
              ctx.fillStyle = "#ff3d8f";
              ctx.shadowColor = "#ff3d8f";
              ctx.shadowBlur = 8;
              ctx.beginPath();
              ctx.arc(px + CELL / 2, py + CELL / 2, 8, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0;
            } else if (grid[y][x] > 0) {
              ctx.font = "bold 15px monospace";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillStyle = NUM_COLORS[grid[y][x]] || "#e8e8ff";
              ctx.fillText(grid[y][x], px + CELL / 2, py + CELL / 2 + 1);
              ctx.textAlign = "left";
              ctx.textBaseline = "alphabetic";
            }
          } else {
            ctx.fillStyle = "#1c1c3e";
            ctx.fillRect(px + 1, py + 1, CELL - 2, CELL - 2);
            ctx.fillStyle = "rgba(255,255,255,0.05)";
            ctx.fillRect(px + 1, py + 1, CELL - 2, 3);
            if (flagged[y][x]) {
              ctx.font = "16px monospace";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillStyle = "#ffd93d";
              ctx.fillText("🚩", px + CELL / 2, py + CELL / 2 + 1);
              ctx.textAlign = "left";
              ctx.textBaseline = "alphabetic";
            }
          }
        }
      }
    }

    const NUM_COLORS = {
      1: "#22e4ff",
      2: "#3dff8f",
      3: "#ff3d8f",
      4: "#b44dff",
      5: "#ff8a3d",
      6: "#ffd93d",
      7: "#4d9bff",
      8: "#e8e8ff",
    };

    function cellFromEvent(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = Math.floor((e.clientX - rect.left) * scaleX / CELL);
      const y = Math.floor((e.clientY - rect.top) * scaleY / CELL);
      return { x, y };
    }

    canvas.addEventListener("click", (e) => {
      if (paused) return;
      const { x, y } = cellFromEvent(e);
      if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return;
      if (over || won) return;
      if (flagged[y][x]) return;
      if (firstClick) {
        firstClick = false;
        placeMines(x, y);
        running = true;
      }
      reveal(x, y);
      sfx.click();
      draw();
    });

    canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (paused) return;
      const { x, y } = cellFromEvent(e);
      if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return;
      if (over || won) return;
      if (revealed[y][x]) return;
      flagged[y][x] = !flagged[y][x];
      sfx.move();
      draw();
    });

    engine.bindKey("Space", () => { if (!running && !over) { running = true; } else togglePause(); });
    engine.bindKey("Enter", () => { if (over) play(); });

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

    const controls = document.createElement("div");
    const btn = (label, fn, wide) => {
      const b = document.createElement("button");
      b.className = "ctrl-btn" + (wide ? " wide" : "");
      b.textContent = label;
      b.addEventListener("click", fn);
      controls.appendChild(b);
      return b;
    };
    btn("开始", play, true);
    btn("暂停", togglePause, true);
    opts.controls.appendChild(controls);

    reset();
    hud.showOverlay("扫雷", "左键翻开 · 右键插旗 · 避开全部地雷", "开始游戏");

    return {
      destroy() {
        engine.clearKeys();
        mount.innerHTML = "";
        opts.controls.innerHTML = "";
      },
    };
  }

  global.RetroArcade.register({
    id: "minesweeper",
    name: "扫雷",
    icon: "💣",
    desc: "经典扫雷，翻开无雷格，用数字推理地雷位置，右键插旗。",
    tags: ["经典", "推理", "鼠标"],
    accent: "#3dff8f",
    glow: "rgba(61,255,143,0.25)",
    setup,
  });
})(typeof window !== "undefined" ? window : globalThis);
