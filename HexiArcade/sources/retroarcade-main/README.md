<div align="center">

# 🕹️ RetroArcade · Retro Arcade Game Collection

**Zero-Dependency · Offline-Ready · Pure Frontend Classic Games**

[English](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Zero Dependency](https://img.shields.io/badge/dependencies-0-brightgreen.svg)
![Offline](https://img.shields.io/badge/offline-ready-yes-orange.svg)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Desktop%20%7C%20Mobile-lightgrey.svg)

</div>

---

## 🎉 Introduction

RetroArcade is a **zero-dependency, offline-ready** collection of retro arcade games featuring 6 timeless classics: Snake, Tetris, Breakout, Pong, Minesweeper, and 2048. Everything is built with native HTML5 Canvas and JavaScript — **no dependencies, no network, no backend required**. Just open your browser and play.

**Pain points it solves:**
- 😫 Wanting to play classic games without downloading apps, signing up, or enduring ads
- 😫 Online mini-game sites that are slow, network-dependent, and privacy-invasive
- 😫 Developers looking for zero-dependency, reusable game source code to learn from

**Differentiation highlights:**
- ✨ **100% native implementation**: no frameworks, no build deps, no CDN — single-file build is only ~65KB
- ✨ **Retro CRT aesthetic**: scanlines, neon glow, pixel rendering that recreates the arcade vibe
- ✨ **Local high scores**: persisted via localStorage — private, secure, and offline
- ✨ **Keyboard + touch support**: desktop keyboard controls, mobile swipe/buttons
- ✨ **WebAudio synthesized SFX**: zero audio assets, all sound generated in real time

---

## ✨ Core Features

| Feature | Description |
| --- | --- |
| 🐍 **Snake** | Classic gameplay — eat dots, grow longer, speed increases with score |
| 🧱 **Tetris** | Rotate and stack 7 tetrominoes; clear more lines for higher scores |
| 🏓 **Pong** | Player vs. AI; responsive opponent; first to 7 points wins |
| 💣 **Minesweeper** | 12×12 grid with 18 mines; left-click to reveal, right-click to flag |
| 🔢 **2048** | Merge matching numbers and push toward 2048 and beyond |
| 🎮 **Unified engine** | Shared game loop, input, SFX, and save modules |
| 📱 **Responsive layout** | Adaptive on desktop and mobile; swipe controls on touch |
| 🔊 **Synthesized SFX** | Real-time WebAudio sound with one-click mute |

---

## 🚀 Quick Start

### Requirements

- A modern browser (Chrome / Edge / Firefox / Safari)
- Optional: Node.js ≥ 18 (for local server and build)

### Option 1: Open directly (zero install)

Clone or download the project, then open `index.html` in your browser.

```bash
git clone https://github.com/gitstq/retroarcade.git
cd retroarcade
# Double-click index.html or drag it into your browser
```

### Option 2: Local server (recommended)

```bash
git clone https://github.com/gitstq/retroarcade.git
cd retroarcade
npm start          # Starts local server at http://localhost:8080
```

### Option 3: Play online

Deploy to GitHub Pages or any static host — no configuration needed.

---

## 📖 Detailed Usage Guide

### Controls at a glance

| Game | Keyboard | Touch |
| --- | --- | --- |
| Snake | Arrow keys to move · Space to pause | Swipe to steer · on-screen buttons |
| Tetris | ←→ move · ↑ rotate · ↓ soft drop · Space hard drop | On-screen buttons |
| Breakout | ←→ move paddle · Space to pause | On-screen buttons |
| Pong | ↑↓ move paddle · Space to pause | On-screen buttons |
| Minesweeper | Left-click reveal · Right-click flag | Tap to reveal · long-press to flag |
| 2048 | Arrow keys to merge · Space to pause | Swipe to merge |

### High scores & sound

- Each game's best score is saved automatically to `localStorage` and survives page refreshes
- Toggle sound anytime with the 🔊 button in the top-right corner
- The menu shows the cumulative best score across all games

### Build a single-file bundle

```bash
npm run build     # Generates dist/index.html single-file build (~65KB)
npm run preview   # Builds and previews the single-file version
```

The single-file build is perfect for offline distribution, USB drives, or embedding in other pages.

### Run tests

```bash
npm test          # Runs engine unit tests
```

---

## 💡 Design Philosophy & Roadmap

### Design philosophy

- **Minimalism**: committed to zero dependencies; everything uses native Web APIs for portability and maintainability
- **Modular architecture**: the shared engine (`engine.js`) handles registration, loop, input, SFX, and saves; each game is an independent module that only needs to implement the `setup` interface
- **Retro aesthetic**: CRT scanlines, neon glows, and pixel rendering recreate the immersive arcade experience

### Roadmap

- [ ] Add more classic games (Whack-a-Mole, Memory Match, Racing, etc.)
- [ ] Gamepad support via the Gamepad API
- [ ] Local two-player hot-seat mode
- [ ] Achievement system and badges
- [ ] PWA support for installable desktop experience

### Community contribution areas

Feel free to submit new games, tune AI difficulty, improve visual effects, or fix bugs. See the [Contributing Guide](CONTRIBUTING.md).

---

## 📦 Packaging & Deployment

This is a **pure frontend web app**, so deployment is extremely flexible:

| Method | Steps |
| --- | --- |
| GitHub Pages | Repo Settings → Pages → select the main branch |
| Any static host | Upload all files to Nginx / Vercel / Netlify, etc. |
| Single-file distribution | Run `npm run build` and distribute `dist/index.html` |
| Local offline | Just double-click `index.html` |

**Compatibility:** any modern browser supporting HTML5 Canvas and WebAudio — Windows / macOS / Linux / Android / iOS.

---

## 🤝 Contributing

1. Fork this repository and create a feature branch
2. Follow the Angular commit convention: `feat:` / `fix:` / `docs:` / `refactor:`
3. To add a game, create a module under `js/games/` and include it in `index.html`
4. Run `npm test` before submitting to ensure tests pass
5. Open a Pull Request describing your changes

Found a bug or have a suggestion? Open an [Issue](https://github.com/gitstq/retroarcade/issues).

---

## 📄 License

This project is open-sourced under the [MIT License](LICENSE). You are free to use, modify, and distribute it commercially as long as the copyright notice is retained.

<div align="center">

**⭐ If this project helps you, please give it a Star!**

</div>
