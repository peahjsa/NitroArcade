#!/usr/bin/env node
/**
 * RetroArcade 构建脚本
 * 将 index.html + css + js 合并为单文件 dist/index.html，便于离线分发与单文件部署。
 * 用法: node scripts/build.js
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(root, "dist");

function read(rel) {
  return readFileSync(join(root, rel), "utf-8");
}

function build() {
  if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });

  const html = read("index.html");
  const css = read("css/style.css");
  const jsFiles = [
    "js/engine.js",
    "js/games/snake.js",
    "js/games/tetris.js",
    "js/games/breakout.js",
    "js/games/pong.js",
    "js/games/minesweeper.js",
    "js/games/g2048.js",
    "js/main.js",
  ];
  const js = jsFiles.map(read).join("\n");

  // 内联 CSS
  let out = html.replace(
    /<link rel="stylesheet" href="css\/style.css" \/>/,
    "<style>\n" + css + "\n</style>"
  );

  // 移除外部脚本标签，替换为内联脚本
  const scriptTags = jsFiles
    .map((f) => `<script src="${f}"></script>`)
    .join("|");
  const re = new RegExp(
    "\\s*<script src=\"(js/(?:engine|main|games/[a-z0-9]+)\\.js)\"></script>",
    "g"
  );
  out = out.replace(re, "");
  out = out.replace("</body>", "<script>\n" + js + "\n</script>\n</body>");

  const target = join(distDir, "index.html");
  writeFileSync(target, out, "utf-8");

  const sizeKB = (Buffer.byteLength(out, "utf-8") / 1024).toFixed(1);
  console.log(`✅ 构建完成: dist/index.html (${sizeKB} KB)`);
}

build();
