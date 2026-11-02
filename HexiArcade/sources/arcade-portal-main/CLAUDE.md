# Game Portal — CLAUDE.md

## Project Overview
110-game pure web portal. No build tools, no npm, no external dependencies.
Pure HTML + CSS + JS only. Works at `file://` URLs.

## Resuming Work
**ALWAYS read `PROGRESS.md` first.** Find the first `[ ]` and continue from there.
Mark items `[x]` immediately after completing each game.

## File Structure
```
/
├── index.html       ← main portal
├── style.css        ← portal styles
├── games.js         ← 110 game metadata (GAMES array + CATEGORIES)
├── PROGRESS.md      ← completion checklist
└── games/
    └── [slug]/index.html   ← each game (self-contained)
```

## Visual Style (Clean Light)
- Background: `#f5f5f7`, Cards: `#fff` + shadow
- Primary: `#6c63ff` (purple), Primary dark: `#574fd6`
- Font: system-ui (no external fonts)
- Difficulty: Easy=`#10b981` (green), Medium=`#f59e0b` (amber), Hard=`#ef4444` (red)

## Every Game Page Must Have
1. `<nav>` with `← Back to Portal` link (`href="../../"`)
2. `<h1>` with emoji + game name
3. Score/stats display
4. Start overlay (game doesn't start until user clicks)
5. Keyboard controls + touch/swipe support
6. LocalStorage for high score where appropriate

## Game Page CSS Template (copy for each new game)
```css
*{margin:0;padding:0;box-sizing:border-box}
body{background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;display:flex;flex-direction:column;align-items:center;min-height:100vh}
nav{width:100%;background:#fff;border-bottom:1px solid #e5e7eb;padding:0 24px;height:50px;display:flex;align-items:center}
nav a{color:#6c63ff;text-decoration:none;font-size:14px;font-weight:500}
.score-box{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:8px 18px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,.06)}
canvas{background:#fff;border-radius:14px;border:1px solid #e5e7eb;box-shadow:0 4px 12px rgba(0,0,0,.08)}
.btn{padding:9px 22px;background:#6c63ff;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer}
```

## Art Strategy
- Default: Canvas 2D API (draw shapes, gradients, emoji as characters)
- Complex shapes: inline SVG
- Polished art needed: decide case-by-case (Kenney.nl CC0 → base64 embed, or AI-generated)
- Never link to external image URLs

## Build Order
Easy difficulty first, then Medium, then Hard within each category.
Category order: Classic Arcade → Puzzle → Card & Board → Word & Trivia →
Action & Shooter → Platform & Adventure → Strategy → Physics & Simulation →
Creative & Art → Memory & Reflex → 2-Player Local
