# Target Games: Implementation Reference Guide

## STATUS SUMMARY

All 8 target games are **MISSING** (empty directories exist):

```
/games/solitaire/      ✗ Empty
/games/freecell/       ✗ Empty
/games/chess/          ✗ Empty
/games/reversi/        ✗ Empty
/games/mahjong/        ✗ Empty
/games/video-poker/    ✗ Empty
/games/go/             ✗ Empty
/games/chinese-chess/  ✗ Empty
```

---

## SOLITAIRE (Klondike / Tableau)

**Type:** Single-player card game with tableau pile management

**Best Reference:** `/games/blackjack/index.html` (228 lines)

**Key Patterns Needed:**
- Deck rendering: `SUITS × RANKS` card objects with `{suit, rank, hidden}` properties
- Card HTML: `<div class="card-el red/black">♣A<span class="card-suit">♠</span></div>`
- Multiple zones: Stock, Waste, Foundations (4), Tableau (7)
- Drag-and-drop validation:
  - Tableau: Red on Black, descending sequence
  - Foundations: Same suit, ascending from Ace
  - Stock: Cycle through deck
- Game state: Track each zone's cards
- Win condition: All 52 cards in foundations

**Secondary Ref:** `/games/tic-tac-toe/index.html` (Overlay system)

**Estimated LOC:** 280-350

---

## FREECELL

**Type:** Solitaire variant with 4 free cells and open tableau

**Best Reference:** `/games/checkers/index.html` (243 lines)

**Key Patterns Needed:**
- 8 piles visible: 4 free cells (empty or 1 card), 4 foundations (empty), tableau cards
- 52 cards auto-dealt in 8 columns
- Complex move validation:
  - Drag card or sequence to valid destination
  - Can move to: free cell (if empty), foundation (if valid), tableau pile (if valid)
  - Move multiple cards only if free cells available
- Flood fill for card cascade detection
- Undo system recommended (track move history)
- Solver hint system (optional)

**Pattern:** 2D grid with custom cells (checkers pattern)

**Secondary Ref:** `/games/minesweeper/index.html` (Cursor navigation)

**Estimated LOC:** 320-400

---

## CHESS

**Type:** 2-player or vs-AI strategic board game (8×8, 32 pieces)

**Best Reference:** `/games/checkers/index.html` (243 lines) + `/games/tic-tac-toe/index.html`

**Key Patterns Needed:**
- 8×8 board with alternating light/dark squares
- 12 piece types (6 per side): Pawn, Rook, Knight, Bishop, Queen, King
- Board state: `Array[8][8]` with piece encoding (e.g., `'wP'` = white pawn)
- Move validation per piece:
  - Pawn: Forward 1 or 2 (initial), captures diagonal
  - Rook: Horizontal/vertical, max distance
  - Knight: L-shaped jumps (no blocking)
  - Bishop: Diagonals, max distance
  - Queen: Rook + Bishop
  - King: 1 square any direction
  - Special: Castling, en passant, pawn promotion
- Illegal move detection: King in check, pinned pieces
- Win condition: Checkmate, resignation, stalemate
- AI: Minimax with piece values (Q=9, R=5, N=3, B=3, P=1)
- Move notation: Algebraic (e.g., `e4`, `Nf3`)

**Secondary Refs:**
- Move validation: `/games/checkers/` (piece selection, legal moves)
- AI: `/games/tic-tac-toe/` (minimax adapter)

**Estimated LOC:** 500-700 (complex rule set)

---

## REVERSI (Othello)

**Type:** 2-player abstract game (8×8, piece flipping)

**Best Reference:** `/games/tic-tac-toe/index.html` (243 lines) + `/games/connect-four/index.html`

**Key Patterns Needed:**
- 8×8 board, pieces: Black/White discs
- Game mechanics:
  - Start: 4 pieces in center (2 black, 2 white, alternating)
  - Move: Place disc on empty square
  - Capture: Auto-flip all opponent pieces in 8 directions if enclosed
  - Mandatory: Must capture to make move, else pass
- Move validation: Check all 8 directions for opponent pieces with your piece at end
- Flood fill for direction detection (check each of 8 rays)
- Score: Count pieces at game end (64 total)
- Win: Most pieces
- AI: Minimax with position weighting:
  - Corners: High value (hard to flip)
  - Edges: Medium value
  - Center: Low value
  - Mobility: Control available moves

**Game State:** `Array[8][8]` with 0 (empty), 1 (black), 2 (white)

**Secondary Refs:**
- Turn system: `/games/tic-tac-toe/`
- Score tracking: `/games/connect-four/`

**Estimated LOC:** 280-350

---

## MAHJONG

**Type:** Single-player puzzle (tile matching with stacking)

**Best Reference:** `/games/match3/index.html` (204 lines) + `/games/jigsaw/index.html` (233 lines)

**Key Patterns Needed:**
- 144 tiles (34 types × 4 copies) arranged in stacked 3D layout
- 5 layers with varying widths (see pyramid/dragon/tower layouts)
- Game mechanics:
  - Matching rule: Click 2 identical, exposed tiles to remove
  - Exposed: Top face unblocked AND both left/right sides free
  - Layout: Pre-designed pyramid, dragon, turtle, etc.
- Canvas rendering for 3D perspective or DOM-based with CSS transforms
- Tile click detection: Check layer (top-down), then position
- Win: Clear all tiles
- Loss: No more moves available
- Timer/Score: Optional
- Common layouts: 8+ pre-defined patterns

**Tile Types:** 4 × (5 Honors + 4 Winds + 5 Dragons + bonus) = 144 total

**Storage:** 3D coordinate array or pre-serialized layout

**Secondary Ref:** Grid collapse: `/games/match3/` (DOM manipulation)

**Estimated LOC:** 350-450 (canvas + collision detection)

---

## VIDEO POKER

**Type:** Card game with hand ranking and hold/draw mechanic

**Best Reference:** `/games/blackjack/index.html` (228 lines)

**Key Patterns Needed:**
- Standard 52-card deck
- Hand mechanics:
  - Deal: 5 cards face-up
  - Hold: Select 0-5 cards to keep
  - Draw: Replace unheld cards
  - Score: Evaluate final 5-card hand
- Hand rankings (highest to lowest):
  - Royal Flush (A-K same suit)
  - Straight Flush (5 consecutive, same suit)
  - Four of a Kind
  - Full House (3 + 2)
  - Flush (5 same suit)
  - Straight (5 consecutive)
  - Three of a Kind
  - Two Pair
  - Pair of Jacks or higher
  - Nothing (bust)
- Payout table: Hand rank → multiplier (1× to 800×)
- Chip system: Balance, bet amount, winnings
- Game loop: Bet → Deal → Hold/Draw → Payout → Repeat
- UI: Card display + Hold checkbox per card + Draw button

**Payout Example (1-coin bet):**
```
Royal Flush: 250
Straight Flush: 50
Four of a Kind: 25
Full House: 9
Flush: 6
Straight: 4
Three of a Kind: 3
Two Pair: 2
Pair (J+): 1
```

**Secondary Refs:**
- Card rendering: `/games/blackjack/`
- Betting UI: Chip buttons, balance tracking

**Estimated LOC:** 300-380

---

## GO

**Type:** 2-player territorial game (19×19 intersections, no pieces captured outside scoring)

**Best Reference:** `/games/tic-tac-toe/index.html` (243 lines) + `/games/minesweeper/index.html`

**Key Patterns Needed:**
- 19×19 grid (or 9×9/13×13 for variants)
- Pieces: Black/White stones on intersections (not squares)
- Game mechanics:
  - Place stone on empty intersection
  - Auto-capture: Remove opponent groups with zero liberties
  - Suicide rule: Can't place stone that immediately dies
  - Ko rule: Can't replay position (simple: prevent immediate recapture)
  - Game end: Mutual agreement (both pass consecutively)
- Flood fill for group detection (connected same-color stones)
- Liberty count: Empty adjacent intersections in each group
- Territory: Count empty points at game end (adjusted for captured groups)
- Scoring: Territory + Captured stones
- AI: Pattern-based or Monte Carlo Tree Search (complex)
  - Basic: Influence maps, corner/edge heuristics
  - Advanced: MCTS simulation

**Board State:** `Array[19][19]` with 0 (empty), 1 (black), 2 (white)

**Move Validation:** Check liberties before placement, capture after

**Secondary Ref:**
- Turn system: `/games/tic-tac-toe/`
- Cursor navigation: `/games/minesweeper/`
- Group detection: Flood fill algorithm

**Estimated LOC:** 380-480

---

## CHINESE CHESS (Xiangqi)

**Type:** 2-player strategic board game (10×9, 16 pieces, palace zones)

**Best Reference:** `/games/checkers/index.html` (243 lines)

**Key Patterns Needed:**
- 10×9 board with 3×3 palace zones (red and black)
- 16 pieces per side (8 types):
  - General (king) - only in palace
  - 2 Advisors - only in palace
  - 2 Elephants - confined to home half
  - 2 Horses - orthogonal + diagonal (jump blocked by orthogonal neighbor)
  - 2 Chariots (rook-like) - horizontal/vertical, no distance limit
  - 2 Cannons - move like chariot, but jump exactly 1 piece to capture
  - 5 Soldiers - forward until reaching river (then sideways allowed)
- Piece-specific movement validation:
  - General/Advisor: Palace movement only
  - Elephant: 5-point diamond, blocked by center point, home half only
  - Horse: 4-option movement blocked by orthogonal neighbor
  - Chariot: Straight lines, max distance
  - Cannon: Straight lines + jump-capture mechanic
  - Soldier: Forward advancing, sideways after river
- Win: Checkmate (general captured or trapped)
- Notation: Cartesian (column/row from home perspective)
- AI: Minimax with piece values (G=∞, A=2, E=2, H=4, C=4.5, R=9, S=2)

**Board State:** `Array[10][9]` with piece encoding

**Movement Validation:** Piece-specific direction + distance checks

**Secondary Ref:** `/games/checkers/` (piece selection, movement logic, AI)

**Estimated LOC:** 380-480

---

## SUMMARY TABLE

| Game | Grid | Players | Complexity | Ref File | Lines | Key Challenge |
|------|------|---------|-----------|----------|-------|----------------|
| Solitaire | N/A (7 zones) | 1 | Medium | Blackjack | 228 | Multi-zone validation |
| FreeCell | 8 cells+4+4 | 1 | High | Checkers | 243 | Move legality complex |
| Chess | 8×8 | 2 | Very High | Checkers+TTT | 243+ | Piece rules, checkmate |
| Reversi | 8×8 | 2 | Medium | TTT+C4 | 243+ | Direction check, flip |
| Mahjong | 3D stacked | 1 | Medium | Match3+Jigsaw | 204+233 | 3D collision, exposure |
| Video Poker | N/A (5 cards) | 1 | Medium | Blackjack | 228 | Hand ranking, payouts |
| Go | 19×19 | 2 | Very High | TTT+MS | 243+ | Flood fill, MCTS AI |
| Chinese Chess | 10×9 | 2 | High | Checkers | 243 | Piece-specific rules |

---

## IMPLEMENTATION PRIORITY RECOMMENDATION

**Easy (Start Here):**
1. **Reversi** - Small board, simple rules, good AI baseline
2. **Video Poker** - Linear flow, hand ranking logic clear

**Medium:**
3. **Solitaire** - More zones but clear validation rules
4. **FreeCell** - Move validation complexity higher
5. **Mahjong** - Layer detection if using DOM, simpler if custom

**Hard:**
6. **Chinese Chess** - Many piece types, unique movement rules
7. **Chess** - Complex rule set, special moves, checkmate detection
8. **Go** - Flood fill required, AI much harder, territory scoring

---

**Full Patterns Reference:** See `GAME_PATTERNS.md`
**Quick Copy-Paste Template:** See `GAME_PATTERNS_QUICK_REF.md`

