/* ============================================================
   RetroArcade — 2048
   ============================================================ */
(function (global) {
  "use strict";

  const SIZE = 4;
  const CELL = 110;
  const GAP = 12;
  const PAD = 14;

  const TILE_COLORS = {
    2: "#1c1c3e", 4: "#2a2a55", 8: "#4d9bff", 16: "#22e4ff",
    32: "#3dff8f", 64: "#ffd93d", 128: "#ff8a3d", 256: "#ff3d8f",
    512: "#b44dff", 1024: "#ff4d5e", 2048: "#ffd93d", 4096: "#22e4ff",
  };

  function setup(opts) {
    const { mount, hud, sfx, engine } = opts;
    const canvas = document.createElement("canvas");
    canvas.width = SIZE * CELL + (SIZE + 1) * GAP;
    canvas.height = SIZE * CELL + (SIZE + 1) * GAP;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
    mount.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let board, score, running, over, won, paused;

    function reset() {
      board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
      score = 0;
      running = false;
      over = false;
      won = false;
      paused = false;
      addTile();
      addTile();
      hud.setScore(0);
      hud.setBest(engine.bestScore("g2048"));
      draw();
    }

    function addTile() {
      const empty = [];
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (board[r][c] === 0) empty.push({ r, c });
        }
      }
      if (empty.length === 0) return;
      const cell = empty[engine.randInt(0, empty.length - 1)];
      board[cell.r][cell.c] = Math.random() < 0.9 ? 2 : 4;
    }

    function slideRow(row) {
      const vals = row.filter((v) => v !== 0);
      const out = [];
      let gained = 0;
      for (let i = 0; i < vals.length; i++) {
        if (i + 1 < vals.length && vals[i] === vals[i + 1]) {
          out.push(vals[i] * 2);
          gained += vals[i] * 2;
          i++;
        } else {
          out.push(vals[i]);
        }
      }
      while (out.length < SIZE) out.push(0);
      return { out, gained };
    }

    function move(dir) {
      let moved = false;
      let gained = 0;
      for (let i = 0; i < SIZE; i++) {
        let row;
        if (dir === "left") row = board[i].slice();
        else if (dir === "right") row = board[i].slice().reverse();
        else if (dir === "up") row = board.map((r) => r[i]);
        else row = board.map((r) => r[i]).reverse();

        const { out, gained: g } = slideRow(row);
        gained += g;

        if (dir === "left") {
          if (out.join() !== board[i].join()) { board[i] = out; moved = true; }
        } else if (dir === "right") {
          const rev = out.reverse();
          if (rev.join() !== board[i].join()) { board[i] = rev; moved = true; }
        } else if (dir === "up") {
          for (let r = 0; r < SIZE; r++) {
            if (board[r][i] !== out[r]) { board[r][i] = out[r]; moved = true; }
          }
        } else {
          const rev = out.reverse();
          for (let r = 0; r < SIZE; r++) {
            if (board[r][i] !== rev[r]) { board[r][i] = rev[r]; moved = true; }
          }
        }
      }
      if (moved) {
        score += gained;
        hud.setScore(score);
        sfx.move();
        addTile();
        draw();
        checkState();
      }
    }

    function checkState() {
      // 检查是否达成 2048
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (board[r][c] >= 2048 && !won) {
            won = true;
            sfx.win();
            const isBest = engine.saveScore("g2048", score);
            hud.setBest(engine.bestScore("g2048"));
            hud.showOverlay("🎉 达成 2048！", "得分 " + score + (isBest ? " · 🏆 新纪录！" : "") + "，继续挑战更高数字？", "继续挑战");
          }
        }
      }
      // 检查是否无路可走
      if (!canMove()) {
        running = false;
        over = true;
        sfx.gameover();
        const isBest = engine.saveScore("g2048", score);
        hud.setBest(engine.bestScore("g2048"));
        hud.showOverlay("游戏结束", "最终得分 " + score + (isBest ? " · 🏆 新纪录！" : ""), "再来一局");
      }
    }

    function canMove() {
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (board[r][c] === 0) return true;
          if (c + 1 < SIZE && board[r][c] === board[r][c + 1]) return true;
          if (r + 1 < SIZE && board[r][c] === board[r + 1][c]) return true;
        }
      }
      return false;
    }

    function draw() {
      ctx.fillStyle = "#0a0a18";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // 背景格
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          const x = PAD + c * (CELL + GAP);
          const y = PAD + r * (CELL + GAP);
          ctx.fillStyle = "rgba(28,28,62,0.6)";
          ctx.fillRect(x, y, CELL, CELL);
        }
      }
      // 数字块
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          const v = board[r][c];
          if (v === 0) continue;
          const x = PAD + c * (CELL + GAP);
          const y = PAD + r * (CELL + GAP);
          const color = TILE_COLORS[v] || "#ffd93d";
          ctx.fillStyle = color;
          ctx.shadowColor = color;
          ctx.shadowBlur = 10;
          ctx.fillRect(x, y, CELL, CELL);
          ctx.shadowBlur = 0;
          ctx.fillStyle = v >= 128 ? "#0a0a18" : "#e8e8ff";
          ctx.font = (v >= 1024 ? "bold 26px" : "bold 34px") + " monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(v, x + CELL / 2, y + CELL / 2 + 1);
          ctx.textAlign = "left";
          ctx.textBaseline = "alphabetic";
        }
      }
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

    engine.bindKey("ArrowLeft", () => { if (running && !paused) move("left"); });
    engine.bindKey("ArrowRight", () => { if (running && !paused) move("right"); });
    engine.bindKey("ArrowUp", () => { if (running && !paused) move("up"); });
    engine.bindKey("ArrowDown", () => { if (running && !paused) move("down"); });
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
    btn("◀", () => move("left"));
    btn("▲", () => move("up"));
    btn("▼", () => move("down"));
    btn("▶", () => move("right"));
    btn("开始", play, true);
    btn("暂停", togglePause, true);
    opts.controls.appendChild(controls);

    reset();
    hud.showOverlay("2048", "方向键/滑动合并相同数字 · 目标 2048", "开始游戏");

    return {
      destroy() {
        engine.clearKeys();
        mount.innerHTML = "";
        opts.controls.innerHTML = "";
      },
    };
  }

  global.RetroArcade.register({
    id: "g2048",
    name: "2048",
    icon: "🔢",
    desc: "合并相同数字，不断翻倍，向 2048 发起冲击。",
    tags: ["益智", "滑动", "键盘"],
    accent: "#ff8a3d",
    glow: "rgba(255,138,61,0.25)",
    setup,
  });
})(typeof window !== "undefined" ? window : globalThis);
