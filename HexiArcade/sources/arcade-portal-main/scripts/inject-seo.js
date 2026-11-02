#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// Load GAMES array from games.js
const src = fs.readFileSync(path.join(__dirname, '..', 'games.js'), 'utf8');
const GAMES = Function(src + '; return GAMES;')();

const BASE_URL = 'https://arcade.sotshau.fun';
const ROOT = path.join(__dirname, '..');

let injected = 0;
let skipped = 0;

for (const game of GAMES) {
  const { slug, name, description, category, difficulty, emoji } = game;
  const gameDir = path.join(ROOT, 'games', slug);
  const htmlPath = path.join(gameDir, 'index.html');

  if (!fs.existsSync(htmlPath)) {
    console.warn(`  MISSING: games/${slug}/index.html`);
    continue;
  }

  let html = fs.readFileSync(htmlPath, 'utf8');

  // Skip if already injected
  if (html.includes('og:title')) {
    console.log(`  SKIP (already has OG): games/${slug}/index.html`);
    skipped++;
    continue;
  }

  const gameUrl = `${BASE_URL}/games/${slug}/`;

  // Escape for HTML attribute values and JSON
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const escJson = (s) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

  const seoBlock = `
<meta name="description" content="Play ${esc(name)} free online — ${esc(description)} A ${esc(difficulty)} ${esc(category)} game."/>
<link rel="canonical" href="${gameUrl}"/>
<meta property="og:title" content="${esc(emoji + ' ' + name)} — Free Browser Game"/>
<meta property="og:description" content="Play ${esc(name)} free in your browser. ${esc(description)}"/>
<meta property="og:type" content="website"/>
<meta property="og:url" content="${gameUrl}"/>
<meta property="og:site_name" content="Arcade Portal"/>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "VideoGame",
  "name": "${escJson(name)}",
  "description": "${escJson(description)}",
  "url": "${gameUrl}",
  "gamePlatform": "Web Browser",
  "applicationCategory": "Game",
  "operatingSystem": "Any",
  "genre": "${escJson(category)}",
  "isAccessibleForFree": true
}
</script>`;

  // Insert after </title>
  if (!html.includes('</title>')) {
    console.warn(`  NO </title> tag: games/${slug}/index.html`);
    continue;
  }

  html = html.replace('</title>', '</title>' + seoBlock);
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log(`  OK: games/${slug}/index.html`);
  injected++;
}

console.log(`\nDone: ${injected} injected, ${skipped} skipped.\n`);

// Generate sitemap.xml
const now = new Date().toISOString().split('T')[0];

const urls = [
  { loc: `${BASE_URL}/`, priority: '1.0' },
  ...GAMES.map(g => ({ loc: `${BASE_URL}/games/${g.slug}/`, priority: '0.8' }))
];

const urlTags = urls.map(({ loc, priority }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlTags}
</urlset>
`;

const sitemapPath = path.join(ROOT, 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap, 'utf8');
console.log(`sitemap.xml generated with ${urls.length} URLs.`);
