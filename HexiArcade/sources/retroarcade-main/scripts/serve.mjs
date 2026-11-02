#!/usr/bin/env node
/**
 * RetroArcade 本地开发服务器（零依赖）
 * 用法: node scripts/serve.js [目录] [端口]
 * 默认目录为项目根目录，默认端口 8080。
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, normalize } from "node:path";

const root = process.argv[2] ? join(process.cwd(), process.argv[2]) : join(process.cwd());
const port = Number(process.argv[3]) || 8080;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8",
};

const server = createServer((req, res) => {
  let pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (pathname === "/") pathname = "/index.html";

  const filePath = normalize(join(root, pathname));
  if (!filePath.startsWith(normalize(root))) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end("404 Not Found");
    return;
  }

  const type = MIME[extname(filePath)] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type });
  res.end(readFileSync(filePath));
});

server.listen(port, () => {
  console.log(`🕹️  RetroArcade 已启动: http://localhost:${port}`);
  console.log(`   目录: ${root}`);
});
