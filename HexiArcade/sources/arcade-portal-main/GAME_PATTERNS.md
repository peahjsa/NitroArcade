# Game Implementation Patterns & Analysis

## TARGET GAME STATUS

All target games are **MISSING** (empty directories):
- ✗ solitaire
- ✗ freecell
- ✗ chess
- ✗ reversi
- ✗ mahjong
- ✗ video-poker
- ✗ go
- ✗ chinese-chess

**Directory Paths:**
```
/Users/jimmy/Documents/jimmy-github/game/games/{solitaire,freecell,chess,reversi,mahjong,video-poker,go,chinese-chess}/
```

---

## CORE IMPLEMENTATION PATTERNS

### 1. HTML Structure (Universal Template)

All games follow this consistent pattern:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>[Name] — Game Portal</title>
  <style>/* Minified CSS */</style>
</head>
<body>
  <nav><a href="../../">← Back to Portal</a></nav>
  <h1>[Emoji] [Title]</h1>
  <p class="sub">[One-line description]</p>
  
  <div class="score-bar"><!-- Stats boxes --></div>
  <div class="game"><!-- Game board/canvas --></div>
  <div class="controls"><!-- Buttons --></div>
  <p class="hint">[Control instructions]</p>
  
  <script>/* Entire game logic --></script>
</body>
</html>
```

### 2. Stats & Score Tracking

**Pattern (Universal):**
```html
<div class="score-bar">
  <div class="score-box">
    <div class="score-label">LABEL</div>
    <div class="score-val" id="stat-id">0</div>
  </div>
</div>
```

**CSS (Minified):**
```css
.score-bar{display:flex;gap:12-16px;flex-wrap:wrap;justify-content:center;margin-bottom:16px}
.score-box{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:8px 16px;
  text-align:center;box-shadow:0 1px 3px rgba(0,0,0,.06);min-width:92px}
.score-label{font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em}
.score-val{font-size:20px;font-weight:700;color:#6c63ff}
```

**Typical Stats Tracked:**
- Turn/Current Player
- Piece counts (for board games)
- Time elapsed
- Wins/Match score
- Best time/streak
- Game phase indicator

### 3. localStorage Usage Pattern

**Standard Keys:** `{gameName}{Metric}` (e.g., `tttBestStreak`, `minesweeperWins`)

**Examples from codebase (31 games use localStorage):**
- `tttBestStreak` - Tic-tac-toe best streak
- `checkersWins` - JSON: `{"r": 0, "b": 0}`
- `minesweeperWins` - Integer
- `minesweeperBestTime` - String time
- `sudokuBestTime` - String seconds

**Implementation Pattern:**
```javascript
const KEY = 'gameName{Metric}';
let value = localStorage.getItem(KEY);

// Save
localStorage.setItem(KEY, String(value));

// Load persistent data
let value = +(localStorage.getItem(KEY) || 0);  // Numbers
let value = JSON.parse(localStorage.getItem(KEY) || '{"a":0,"b":0}');  // Objects
```

### 4. Overlay System (Modal)

**Purpose:** Start screen, end game, game over messages

**CSS Pattern:**
```css
.overlay{
  position:absolute;
  inset:0;  /* Cover entire game container */
  background:rgba(245,245,247,.94);
  border-radius:18px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:10px;
  padding:24px;
  text-align:center;
}
.overlay h2{font-size:28px}
.overlay p{color:#6b7280;max-width:280px;line-height:1.5}
```

**JS Pattern:**
```javascript
const overlay = document.getElementById('overlay');

// Show overlay
overlay.innerHTML = `<h2>${title}</h2><p>${text}</p><button class="btn" id="overlay-btn">Action</button>`;
overlay.style.display = 'flex';
document.getElementById('overlay-btn').addEventListener('click', callback);

// Hide overlay
overlay.style.display = 'none';

// Toggle on overlay in keyboard event
if(overlay.style.display !== 'none' && (e.key === 'Enter' || e.key === ' ')){
  e.preventDefault();
  document.getElementById('overlay-btn')?.click();
}
```

### 5. Keyboard & Touch Control Pattern

**Keyboard (Desktop):**
```javascript
document.addEventListener('keydown', e => {
  // Overlay interaction
  if(overlay.style.display !== 'none' && (e.key === 'Enter' || e.key === ' ')){
    e.preventDefault();
    document.getElementById('overlay-btn').click();
    return;
  }
  
  // Arrow navigation
  const moveMap = { 
    ArrowUp: [-1, 0], 
    ArrowDown: [1, 0], 
    ArrowLeft: [0, -1], 
    ArrowRight: [0, 1] 
  };
  if(moveMap[e.key]){
    e.preventDefault();
    cursor.r = (cursor.r + moveMap[e.key][0] + SIZE) % SIZE;
    cursor.c = (cursor.c + moveMap[e.key][1] + SIZE) % SIZE;
    render();
    return;
  }
  
  // Number shortcuts (e.g., 1-9)
  if(/^[1-9]$/.test(e.key)) {
    e.preventDefault();
    handleNumber(+e.key);
  }
  
  // Action keys
  if(e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    performAction();
  }
  
  // Mode toggles
  if(e.key.toLowerCase() === 'f') {
    e.preventDefault();
    toggleFlagMode();
  }
});
```

**Touch (Mobile):**
```javascript
// Click/Tap handlers on buttons
button.addEventListener('click', () => handleAction());

// Right-click for secondary action (flag, etc.)
button.addEventListener('contextmenu', e => {
  e.preventDefault();
  secondaryAction();
});

// Touch with special modes
// Example: Toggle flag mode, then tap cells
const flagModeBtn = document.getElementById('mode-btn');
flagModeBtn.onclick = () => {
  flagMode = !flagMode;
  flagModeBtn.textContent = 'Flag Mode: ' + (flagMode ? 'On' : 'Off');
};
```

**Cursor/Focus Pattern:**
```javascript
let cursor = {r: 0, c: 0};
let focusIndex = 4;  // For 1D grids

function focusCell() {
  const target = cells[focusIndex];
  if(target) target.focus();
}

// Update focus in keyboard handler
render();
focusCell();

// Visual indicator in render
cell.classList.toggle('focused', i === focusIndex && active && !board[i]);
cell.classList.toggle('cursor', cursor.r === r && cursor.c === c);
```

### 6. Board/Grid Rendering Pattern

**Common Structures:**
```javascript
// 1D Array (Tic-tac-toe)
let board = Array(9).fill('');

// 2D Array (Checkers, Battleship)
let board = Array.from({length:8}, (_,r) => 
  Array.from({length:8}, (_,c) => initialValue)
);

// Custom objects (Minesweeper)
let board = Array.from({length:SIZE}, () =>
  Array.from({length:SIZE}, () => ({
    mine: false,
    revealed: false,
    flagged: false,
    count: 0
  }))
);
```

**Render Function (Universal):**
```javascript
function render(){
  boardEl.innerHTML = '';
  for(let r=0; r<ROWS; r++){
    for(let c=0; c<COLS; c++){
      const cell = board[r][c];
      const btn = document.createElement('button');
      btn.className = 'cell' 
        + (cursor.r === r && cursor.c === c ? ' cursor' : '')
        + (cell.state ? ' ' + cell.state : '');
      btn.textContent = cell.display;
      btn.addEventListener('click', () => selectCell(r, c));
      boardEl.appendChild(btn);
    }
  }
}
```

**CSS for Grid:**
```css
.board{
  display: grid;
  grid-template-columns: repeat(COLS, SIZE);
  gap: 4-10px;
  border-radius: 14px;
  overflow: hidden;
}
.cell{
  width: SIZE;
  height: SIZE;
  border: none;
  border-radius: 8-16px;
  background: #fff;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: transform .12s, border-color .12s, box-shadow .12s;
}
.cell:hover:not(:disabled), .cell.focused{
  transform: translateY(-2px);
  border-color: #6c63ff;
  box-shadow: 0 8px 18px rgba(108,99,255,.18);
}
.cell.cursor{
  outline: 3px solid #6c63ff;
  outline-offset: -3px;
}
```

### 7. Game Phase Management

**Pattern:**
```javascript
let phase = 'init';  // 'init' | 'playing' | 'gameover'
let active = true;

// Control visibility
if(phase === 'init') overlay.style.display = 'flex';
if(phase === 'playing') overlay.style.display = 'none';

// Disable actions
function placeMove(index){
  if(!active || board[index]) return;
  // ... move logic
}
```

### 8. Color & Visual Scheme (Consistent)

**Primary:** `#6c63ff` (purple)
**Background:** `#f5f5f7` (light gray)
**Card/Cell:** `#fff` (white) with `1px solid #e5e7eb`
**Text:** `#374151` (dark) / `#6b7280` (medium) / `#9ca3af` (light)

**Player Colors (Card games):**
- Player 1: `#f59e0b` (amber/yellow)
- Player 2: `#ef4444` (red)
- Draws: `#6b7280` (gray)

**State Colors (Strategy games):**
- Red pieces: `#ef4444`
- Black pieces: `#111827`
- Selected: Outlined with `3px solid #93c5fd`
- Hover: `transform: translateY(-2px)` + shadow boost

### 9. AI Implementation Pattern

**Example (Tic-tac-toe minimax):**
```javascript
function findBestMove(){
  let bestScore = -Infinity;
  let move = -1;
  for(let i=0; i<board.length; i++){
    if(board[i]) continue;
    board[i] = 'O';
    const score = minimax(board, 0, false);
    board[i] = '';
    if(score > bestScore){
      bestScore = score;
      move = i;
    }
  }
  return move;
}

function minimax(state, depth, isMax){
  const result = checkWinner(state);
  if(result === 'O') return 10 - depth;
  if(result === 'X') return depth - 10;
  if(result === 'draw') return 0;
  
  if(isMax){
    let bestScore = -Infinity;
    for(let i=0; i<state.length; i++){
      if(state[i]) continue;
      state[i] = 'O';
      bestScore = Math.max(bestScore, minimax(state, depth+1, false));
      state[i] = '';
    }
    return bestScore;
  }
  // ... minimizing branch
}
```

**Example (Battleship random + targeting):**
```javascript
function aiTurn(){
  let target = aiTargets.shift();
  while(target && isAlreadyShot(target)) target = aiTargets.shift();
  if(!target){
    // Random shot if no targets queued
    do {
      target = [Math.floor(Math.random()*SIZE), Math.floor(Math.random()*SIZE)];
    } while(isAlreadyShot(target));
  }
  const result = markShot(playerState, target[0], target[1]);
  if(result.hit){
    // Queue neighbors if hit
    neighbors(target[0], target[1]).forEach(n => aiTargets.push(n));
    setTimeout(aiTurn, 260);
  }
}
```

### 10. Game Loop & Timing

**Pattern:**
```javascript
let timer = null;
let time = 0;

function startTimer(){
  clearInterval(timer);
  timer = setInterval(() => {
    time++;
    document.getElementById('time').textContent = String(time);
  }, 1000);
}

function stopTimer(){
  clearInterval(timer);
}

// Async moves with delays
function placeMove(index){
  // ... player logic
  active = false;
  statusEl.textContent = 'AI is thinking...';
  setTimeout(aiMove, 220);  // Debounce for perceived difficulty
}
```

---

## BEST REFERENCE GAMES BY TARGET

### **Solitaire** (Card Layout + Deck Management)
**Best Reference:** 
- **Primary:** `/Users/jimmy/Documents/jimmy-github/game/games/blackjack/index.html` (Lines 228)
  - Card rendering, deck building, hand management, scoring, chip betting system
- **Secondary:** `/Users/jimmy/Documents/jimmy-github/game/games/tic-tac-toe/index.html`
  - Overlay system, move validation, game phases

**Key Patterns:**
- Card deck: `SUITS × RANKS` array with shuffle
- Hand objects: `{suit, rank, hidden}`
- Card render: DOM elements or canvas
- Multiple zones: Deck, tableau, foundation
- Drag-and-drop with snap validation

---

### **FreeCell** (Grid + Drag/Drop + Move Validation)
**Best Reference:**
- **Primary:** `/Users/jimmy/Documents/jimmy-github/game/games/checkers/index.html` (243 lines)
  - Complex move validation, piece selection, board state, multi-capture logic
- **Secondary:** `/Users/jimmy/Documents/jimmy-github/game/games/minesweeper/index.html`
  - Grid rendering, cursor navigation, cell selection

**Key Patterns:**
- 8×8 grid with alternating colors
- Piece selection highlighting
- Forced capture detection (adapt for move legality)
- Multi-step moves with state tracking
- Board state: `Array[8][8]` with piece objects

---

### **Chess** (8×8 Grid + Complex Rules + Move Validation)
**Best Reference:**
- **Primary:** `/Users/jimmy/Documents/jimmy-github/game/games/checkers/index.html`
  - Board structure, piece types (king promotion analog), selection/move logic, AI strategy
- **Secondary:** `/Users/jimmy/Documents/jimmy-github/game/games/tic-tac-toe/index.html`
  - AI minimax (can adapt for piece evaluation), overlay system

**Key Patterns:**
- 8×8 board with light/dark squares
- Piece types: Pawn, Rook, Knight, Bishop, Queen, King
- Move validation: Piece-specific movement rules
- Special moves: Castling, en passant, pawn promotion
- Board state: `Array[8][8]` with piece encoding
- AI: Minimax with piece values (Queen=9, Rook=5, Knight=3, etc.)

---

### **Reversi (Othello)** (8×8 Grid + Piece Flipping)
**Best Reference:**
- **Primary:** `/Users/jimmy/Documents/jimmy-github/game/games/tic-tac-toe/index.html`
  - Turn system, AI minimax, overlay management, keyboard/touch controls
- **Secondary:** `/Users/jimmy/Documents/jimmy-github/game/games/connect-four/index.html`
  - Score tracking for 2 players, game state management

**Key Patterns:**
- 8×8 board, pieces: Black/White
- Move validation: Check directions for opponent pieces to flip
- Automatic flipping: `Array.flip()` after valid move
- AI: Minimax with position weighting (corners valuable)
- Game end: When no legal moves exist

---

### **Mahjong** (Tile Grid + Matching + Stacking)
**Best Reference:**
- **Primary:** `/Users/jimmy/Documents/jimmy-github/game/games/match3/index.html` (204 lines)
  - Tile matching, grid collapse, score animation, state tracking
- **Secondary:** `/Users/jimmy/Documents/jimmy-github/game/games/jigsaw/index.html` (233 lines)
  - Canvas rendering, piece positioning, snap detection

**Key Patterns:**
- 3D-like stacking: Layer detection before matching
- Tile types: 34 unique tiles (usually 4 copies each)
- Matching rule: Any 2 identical tiles if path between them has ≤2 turns
- Grid state: 3D array for layers
- Canvas rendering for layered visualization
- No AI (typically 1-player)

---

### **Video Poker** (Card Variants + Hold/Draw + Payouts)
**Best Reference:**
- **Primary:** `/Users/jimmy/Documents/jimmy-github/game/games/blackjack/index.html` (228 lines)
  - Card rendering, deck management, betting system, hand evaluation, balance tracking
- **Secondary:** `/Users/jimmy/Documents/jimmy-github/game/games/rock-paper-scissors/index.html` (182 lines)
  - Simple turn structure, balance/chip system

**Key Patterns:**
- Deck: Standard 52 cards
- Hand: 5 cards with hold/draw mechanic
- Payout table: Hand rank → multiplier
- Chip system: Balance, current bet, winnings
- Hand evaluation: Pair, Two Pair, Three of a Kind, Straight, Flush, etc.
- Draw logic: Replace unheld cards
- UI: Cards + Hold buttons per card + Draw button

---

### **Go** (19×19 Grid + Territory + Capture + Ko Rule)
**Best Reference:**
- **Primary:** `/Users/jimmy/Documents/jimmy-github/game/games/tic-tac-toe/index.html`
  - Turn system, game phase management, keyboard/touch navigation, overlay
- **Secondary:** `/Users/jimmy/Documents/jimmy-github/game/games/minesweeper/index.html`
  - 2D grid with cursor, group selection pattern (flood fill)

**Key Patterns:**
- 19×19 board (or 9×9/13×13 for variants)
- Pieces: Black/White on intersections
- Captures: Groups with no liberties removed automatically
- Flood fill for group detection
- Territory: Count empty points after game
- Ko rule: Simple state hash to prevent immediate recapture
- AI: Pattern-based or Monte Carlo Tree Search (complex)
- Board state: `Array[19][19]` with color/empty

---

### **Chinese Chess (Xiangqi)** (10×9 Grid + Palace + Piece Rules)
**Best Reference:**
- **Primary:** `/Users/jimmy/Documents/jimmy-github/game/games/checkers/index.html` (243 lines)
  - Board grid, piece types, movement validation, turn system, AI
- **Secondary:** `/Users/jimmy/Documents/jimmy-github/game/games/tic-tac-toe/index.html`
  - AI minimax adaptation

**Key Patterns:**
- 10×9 board with 3×3 palace zones
- Piece types: General, Advisors, Elephants, Horses, Chariots, Cannons, Soldiers
- Piece-specific movement rules (Elephant confined to half-board, etc.)
- Cannon capture (jump over exactly 1 piece)
- Move validation: Piece → legal destination algorithm
- AI: Minimax with piece values
- Board state: `Array[10][9]` with piece encoding

---

## REUSABLE UI COMPONENTS

### 1. Score Bar
**File:** `/Users/jimmy/Documents/jimmy-github/game/games/tic-tac-toe/index.html` (Lines 42-45)
- Flexbox layout with gap
- Multiple score boxes
- Color-coded values

### 2. Button Styles
**Variants:**
- `.btn` - Primary (purple, full-width in flexbox)
- `.btn-outline` - Secondary (transparent, bordered)
- `.btn-alt` - Tertiary (white, bordered)
- `.chip-btn` - Radial gradient (e.g., blackjack chips)

**CSS:**
```css
.btn{padding:9px 18px;background:#6c63ff;color:#fff;border:none;
  border-radius:8px;font-size:14px;font-weight:600;cursor:pointer}
.btn:hover{background:#574fd6}
.btn:disabled{opacity:.4;cursor:default}
```

### 3. Grid Systems
**CSS Grid:**
```css
.board{display:grid;grid-template-columns:repeat(COLS,SIZE);gap:4px}
```
- Adapt `COLS` and `SIZE` per game
- Gap typically 3-10px

### 4. Overlay Modal
**Reuse:** `/Users/jimmy/Documents/jimmy-github/game/games/tic-tac-toe/index.html` (Lines 31-32)
- Copy `.overlay` CSS
- Template: `overlay.innerHTML = `<h2>${title}</h2><p>${text}</p><button class="btn">Action</button>`;`

### 5. Status Bar
**Pattern:**
```html
<div class="status" id="status">Current message</div>
```
**CSS:**
```css
.status{margin:14px 0 10px;font-size:16px;font-weight:600;color:#374151;
  min-height:24px;text-align:center}
```

### 6. Hint Text
**Pattern:**
```html
<p class="hint">Arrow keys move · Enter places · F flags</p>
```
**CSS:**
```css
.hint{margin-top:14px;font-size:12px;color:#9ca3af;text-align:center;padding:0 16px}
```

---

## KEY IMPLEMENTATION TIPS

### Storage
- Use keys: `{gameName}{Stat}` (e.g., `chessElo`, `goWins`)
- For complex data: `JSON.stringify()` / `JSON.parse()`
- Always provide fallback: `localStorage.getItem(KEY) || 'default'`

### Keyboard
- Always prevent default on handled keys: `e.preventDefault()`
- Arrow keys: Mod by grid size for wrap: `(cursor + delta + SIZE) % SIZE`
- Overlay: Check display status before handling game keys

### Touch
- Use `onclick` for all interactions
- Provide toggle modes (flag mode in Minesweeper) for secondary actions
- Right-click (`contextmenu`) for mobile: prevent default

### AI Difficulty
- Minimax for small grids (3×3, 8×8)
- Random moves for simple games
- Delay AI by 200-260ms for perceived difficulty

### Performance
- Keep board state as simple arrays/objects
- Only re-render on state change
- Use `clearInterval()` before `setInterval()` for timers

### Accessibility
- `aria-label` on cells: `Cell ${i+1}`
- Semantic HTML: Use `<button>` not `<div>`
- Focus management in keyboard controls

---

## SUMMARY TABLE

| Game | Target Grid | Complexity | Best Ref | Special Pattern |
|------|-----------|-----------|----------|-----------------|
| Solitaire | N/A (Tableau) | High | Blackjack | Deck, multiple zones |
| FreeCell | 4×4 (8 cells) | High | Checkers | Drag/drop, move validation |
| Chess | 8×8 | Very High | Checkers + TTT | Piece types, special moves |
| Reversi | 8×8 | Medium | TTT + Connect4 | Auto-flip, minimax |
| Mahjong | 8×16 (stacked) | Medium | Match3 + Jigsaw | 3D tiles, canvas |
| Video Poker | N/A (5 cards) | Medium | Blackjack | Hand ranking, hold/draw |
| Go | 19×19 | Very High | TTT + Minesweeper | Flood fill, ko rule |
| Chinese Chess | 10×9 | High | Checkers | Palace zones, piece rules |

All games use:
- Single HTML file with embedded CSS/JS
- localStorage for stats
- Overlay modal system
- Keyboard + touch controls
- Score bar with stats
- "Back to Portal" nav link

