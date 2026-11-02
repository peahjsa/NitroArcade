# Quick Reference: Game Implementation Patterns

## TARGET GAMES STATUS ✗ ALL MISSING

```
solitaire/    → Empty (dir exists)
freecell/     → Empty
chess/        → Empty
reversi/      → Empty
mahjong/      → Empty
video-poker/  → Empty
go/           → Empty
chinese-chess/→ Empty
```

---

## UNIVERSAL STRUCTURE (Copy-Paste Template)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>GAMENAME — Game Portal</title>
  <style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    display:flex;flex-direction:column;align-items:center;min-height:100vh;padding-bottom:40px}
  nav{width:100%;background:#fff;border-bottom:1px solid #e5e7eb;padding:0 24px;height:50px;
    display:flex;align-items:center}
  nav a{color:#6c63ff;text-decoration:none;font-size:14px;font-weight:500}
  h1{margin:20px 0 4px;font-size:24px;font-weight:700}
  .sub{color:#6b7280;font-size:14px;margin-bottom:16px;text-align:center}
  .score-bar{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;margin-bottom:16px}
  .score-box{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:8px 16px;
    text-align:center;box-shadow:0 1px 3px rgba(0,0,0,.06);min-width:92px}
  .score-label{font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em}
  .score-val{font-size:20px;font-weight:700;color:#6c63ff}
  .game{position:relative;background:#fff;border:1px solid #e5e7eb;border-radius:18px;
    padding:18px;box-shadow:0 8px 20px rgba(0,0,0,.08)}
  .board{display:grid;grid-template-columns:repeat(COLS,SIZEpx);gap:4px}
  .cell{width:SIZEpx;height:SIZEpx;border:none;border-radius:10px;background:#fff;
    border:1px solid #e5e7eb;font-weight:700;cursor:pointer;
    transition:transform .12s,border-color .12s,box-shadow .12s}
  .cell:hover:not(:disabled),.cell.focused,.cell.cursor{transform:translateY(-2px);
    border-color:#6c63ff;box-shadow:0 8px 18px rgba(108,99,255,.18)}
  .overlay{position:absolute;inset:0;background:rgba(245,245,247,.94);border-radius:18px;
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
    padding:24px;text-align:center}
  .overlay h2{font-size:28px}
  .overlay p{color:#6b7280;max-width:280px;line-height:1.5}
  .controls{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:14px}
  .btn{padding:9px 22px;background:#6c63ff;color:#fff;border:none;border-radius:8px;
    font-size:14px;font-weight:600;cursor:pointer}
  .btn:hover{background:#574fd6}
  .hint{margin-top:14px;font-size:12px;color:#9ca3af;text-align:center}
  </style>
</head>
<body>
<nav><a href="../../">← Back to Portal</a></nav>
<h1>EMOJI GAMENAME</h1>
<p class="sub">One-line description.</p>

<div class="score-bar">
  <div class="score-box"><div class="score-label">Stat 1</div><div class="score-val" id="stat1">0</div></div>
  <div class="score-box"><div class="score-label">Stat 2</div><div class="score-val" id="stat2">0</div></div>
</div>

<div class="game">
  <div class="board" id="board"></div>
  <div class="overlay" id="overlay">
    <h2>EMOJI GAMENAME</h2>
    <p>How to play with keyboard and touch.</p>
    <button class="btn" id="overlay-btn" onclick="startGame()">Start Game</button>
  </div>
  <div style="margin-top:12px;text-align:center;color:#374151;font-weight:700;min-height:24px" id="status">Press Start to begin.</div>
</div>

<div class="controls">
  <button class="btn" onclick="startGame()">New Game</button>
</div>
<p class="hint">Arrow keys move · Enter selects · Click/tap on mobile</p>

<script>
const boardEl = document.getElementById('board');
const overlay = document.getElementById('overlay');
const statusEl = document.getElementById('status');
const STORAGE_KEY = 'gameName{Metric}';

let board, active = false, cursor = {r:0, c:0};
let stats = +(localStorage.getItem(STORAGE_KEY) || 0);
document.getElementById('stat1').textContent = stats;

function startGame(){
  board = Array.from({length:ROWS}, (_,r) => 
    Array.from({length:COLS}, (_,c) => initialValue));
  cursor = {r:0, c:0};
  active = true;
  overlay.style.display = 'none';
  statusEl.textContent = 'Your turn.';
  render();
}

function render(){
  boardEl.innerHTML = '';
  for(let r=0; r<ROWS; r++){
    for(let c=0; c<COLS; c++){
      const cell = board[r][c];
      const btn = document.createElement('button');
      btn.className = 'cell' + (cursor.r===r && cursor.c===c ? ' cursor' : '');
      btn.textContent = cell;
      btn.addEventListener('click', () => selectCell(r, c));
      boardEl.appendChild(btn);
    }
  }
}

function selectCell(r, c){
  cursor = {r, c};
  // Game logic here
  render();
}

document.addEventListener('keydown', e => {
  // Overlay interaction
  if(overlay.style.display !== 'none' && (e.key === 'Enter' || e.key === ' ')){
    e.preventDefault();
    document.getElementById('overlay-btn')?.click();
    return;
  }
  
  // Arrow navigation
  const moveMap = {ArrowUp:[-1,0],ArrowDown:[1,0],ArrowLeft:[0,-1],ArrowRight:[0,1]};
  if(moveMap[e.key]){
    e.preventDefault();
    cursor.r = (cursor.r + moveMap[e.key][0] + ROWS) % ROWS;
    cursor.c = (cursor.c + moveMap[e.key][1] + COLS) % COLS;
    render();
    return;
  }
  
  // Action key
  if(e.key === 'Enter'){
    e.preventDefault();
    selectCell(cursor.r, cursor.c);
  }
});

render();
</script>
</body>
</html>
```

---

## KEY PATTERNS BY ASPECT

### localStorage
```javascript
const KEY = 'gameName{Metric}';  // e.g., 'chessMoves', 'goWins'

// Load
let val = +(localStorage.getItem(KEY) || 0);  // Numbers
let val = JSON.parse(localStorage.getItem(KEY) || '{"r":0,"b":0}');  // Objects

// Save
localStorage.setItem(KEY, String(val));
localStorage.setItem(KEY, JSON.stringify(val));
```

### Overlay Modal
```javascript
// Show
overlay.innerHTML = `<h2>Title</h2><p>Message</p><button class="btn" id="overlay-btn">OK</button>`;
overlay.style.display = 'flex';
document.getElementById('overlay-btn').addEventListener('click', callback);

// Hide
overlay.style.display = 'none';
```

### Board Rendering (Grid)
```javascript
let board = Array.from({length:ROWS}, () => Array(COLS).fill(0));

function render(){
  boardEl.innerHTML = '';
  for(let r=0; r<ROWS; r++){
    for(let c=0; c<COLS; c++){
      const btn = document.createElement('button');
      btn.className = 'cell' + (selected?.[0]===r && selected?.[1]===c ? ' cursor' : '');
      btn.textContent = board[r][c];
      btn.onclick = () => selectCell(r, c);
      boardEl.appendChild(btn);
    }
  }
}
```

### Keyboard Handling
```javascript
document.addEventListener('keydown', e => {
  // Overlay priority
  if(overlay.style.display !== 'none'){
    if(e.key === 'Enter' || e.key === ' ') document.getElementById('overlay-btn')?.click();
    return;
  }
  
  // Arrow keys with wrapping
  const arrows = {ArrowUp:[-1,0],ArrowDown:[1,0],ArrowLeft:[0,-1],ArrowRight:[0,1]};
  if(arrows[e.key]){
    e.preventDefault();
    cursor.r = (cursor.r + arrows[e.key][0] + SIZE) % SIZE;
    cursor.c = (cursor.c + arrows[e.key][1] + SIZE) % SIZE;
    render();
    return;
  }
  
  // Numbers
  if(/^[1-9]$/.test(e.key)) { e.preventDefault(); handleNumber(+e.key); }
  
  // Function keys
  if(e.key === 'Enter') { e.preventDefault(); selectCell(cursor.r, cursor.c); }
  if(e.key.toLowerCase() === 'f') { e.preventDefault(); toggleFlag(); }
});
```

### AI (Minimax for small boards)
```javascript
function findBestMove(){
  let bestScore = -Infinity, move = -1;
  for(let i=0; i<board.length; i++){
    if(board[i]) continue;
    board[i] = 'AI';
    const score = minimax(board, 0, false);
    board[i] = '';
    if(score > bestScore) { bestScore = score; move = i; }
  }
  return move;
}

function minimax(state, depth, isMax){
  const result = checkWinner(state);
  if(result === 'AI') return 10 - depth;
  if(result === 'HUMAN') return depth - 10;
  if(result === 'draw') return 0;
  
  if(isMax){
    let best = -Infinity;
    for(let i=0; i<state.length; i++){
      if(state[i]) continue;
      state[i] = 'AI';
      best = Math.max(best, minimax(state, depth+1, false));
      state[i] = '';
    }
    return best;
  }else{
    let best = Infinity;
    for(let i=0; i<state.length; i++){
      if(state[i]) continue;
      state[i] = 'HUMAN';
      best = Math.min(best, minimax(state, depth+1, true));
      state[i] = '';
    }
    return best;
  }
}
```

---

## BEST REFERENCE BY TARGET GAME

| Game | File | Size | Key Features |
|------|------|------|--------------|
| **Solitaire** | blackjack | 228L | Deck, card render, zones, payout |
| **FreeCell** | checkers | 243L | Move validation, selection, rules |
| **Chess** | checkers | 243L | Piece types, validation, AI |
| **Reversi** | tic-tac-toe | 243L | AI minimax, turn system |
| **Mahjong** | match3 + jigsaw | 204L+233L | Grid collapse, canvas, layers |
| **Video Poker** | blackjack | 228L | Cards, hand rank, betting, balance |
| **Go** | tic-tac-toe | 243L | Board, capture (flood fill), AI |
| **Chinese Chess** | checkers | 243L | Piece rules, movement, palace |

---

## COLOR PALETTE

```css
Primary: #6c63ff (Purple)
BG: #f5f5f7 (Light gray)
Card: #fff (White) + 1px solid #e5e7eb

Text:
  Dark: #374151
  Medium: #6b7280
  Light: #9ca3af

Player colors:
  P1: #f59e0b (Amber)
  P2: #ef4444 (Red)
  Black: #111827 (Near-black)
```

---

## CRITICAL CHECKLIST FOR NEW GAME

- [ ] Single `index.html` file, minified CSS
- [ ] Nav link back to `../../`
- [ ] Score bar with `id="stat*"` elements
- [ ] Overlay with `#overlay` and `#overlay-btn`
- [ ] Status bar: `#status`
- [ ] Board: `#board` (grid or canvas)
- [ ] Keyboard handler: arrows + Enter + F
- [ ] Touch: `onclick` on all interactive elements
- [ ] localStorage for persistent stats
- [ ] `startGame()` function initializes
- [ ] `render()` refreshes board display
- [ ] Hint text with control instructions

---

**Document Location:** `/Users/jimmy/Documents/jimmy-github/game/GAME_PATTERNS.md` (full)
