// Captures rendered pages as screenshots for the vision pass (statement 8).
//
//   sh scripts/fable/scoped-build.sh && node scripts/fable/capture.mjs --dist .cache/fable-dist docs/fable-run/vision/shots
//   node scripts/fable/capture.mjs <base-url> <out-dir> [--only tour|site]
//
// Pages: the Tour (river, three rooms, completion room), the homepage and the nine wing landings, in Arabic
// (right-to-left) and English, at phone (390), tablet (820) and desktop (1280) widths: 90 screenshots.
// JPEG, capped at 2,600 px of height so the set stays small enough to commit; the cap and the full page height are
// recorded for every file in index.json, with the horizontal overflow measured in the page (0 means no sideways scroll).
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { extname, join, resolve } from "node:path";

const args = process.argv.slice(2);
const flag = (n) => (args.includes(n) ? args.splice(args.indexOf(n), 2)[1] : null);
const dist = flag("--dist"), only = flag("--only");
const [baseArg, outArg] = dist ? [null, args[0]] : args;
if ((!dist && !baseArg) || !(dist ? args[0] : outArg)) { console.error("usage: node scripts/fable/capture.mjs (--dist <built-dir> | <base-url>) <out-dir> [--only tour|site]"); process.exit(2); }
const out = dist ? args[0] : outArg;
const sh = (c) => execSync(c, { encoding: "utf8" }).trim();
let base = baseArg, srv = null;
if (dist) {
  const DIST = resolve(dist);
  const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".woff2": "font/woff2", ".woff": "font/woff" };
  srv = createServer(async (req, res) => { try { const p = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname); const f = join(DIST, p.endsWith("/") ? p + "index.html" : p); if (!f.startsWith(DIST)) throw 0; const body = await readFile(f); res.writeHead(200, { "content-type": MIME[extname(f)] ?? "application/octet-stream" }); res.end(body); } catch { if (!res.headersSent) res.writeHead(404); res.end(); } });
  await new Promise((r) => srv.listen(48233, r));
  base = "http://127.0.0.1:48233";
}
const manifest = [...readFileSync("tour/grand-tour.yaml", "utf8").matchAll(/^\s*-\s*id:\s*[a-z]+\/([a-z0-9-]+)\s*$/gm)].map((m) => m[1]);
const WIDTHS = { phone: [390, 844], tablet: [820, 1180], desktop: [1280, 800] };
const WINGS = ["time", "place", "people", "ideas", "objects", "words", "living", "today", "made"];
const TOUR = [["river", "grand-tour/"], ["room-first", `grand-tour/${manifest[0]}/`], ["room-badr", "grand-tour/battle-of-badr/"], ["room-last", `grand-tour/${manifest[manifest.length - 1]}/`], ["complete", "grand-tour/complete/"]];
const SITE = [["home", ""], ...WINGS.map((w) => [`wing-${w}`, `${w}/`])];
const pages = [...(only === "site" ? [] : TOUR), ...(only === "tour" ? [] : SITE)];
const CAP = 2600;
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const shots = [];
for (const lang of ["ar", "en"]) for (const [name, path] of pages) for (const [size, [w, h]] of Object.entries(WIDTHS)) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: "light", reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const res = await page.goto(`${base.replace(/\/$/, "")}/${lang}/${path}`, { waitUntil: "load", timeout: 180000 });
  await page.addStyleTag({ content: "astro-dev-toolbar{display:none!important}" }).catch(() => {}); // a dev server's own overlay is not part of the page
  await page.waitForTimeout(900);
  const m = await page.evaluate(() => ({ h: document.documentElement.scrollHeight, w: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  const file = `${lang}-${name}-${size}.jpg`;
  await page.screenshot({ path: join(out, file), type: "jpeg", quality: 50, clip: { x: 0, y: 0, width: w, height: Math.min(m.h, CAP) }, fullPage: true });
  shots.push({ file, url: `/${lang}/${path}`, lang, page: name, size, status: res?.status() ?? 0, width: w, pageHeight: m.h, shotHeight: Math.min(m.h, CAP), horizontalOverflowPx: Math.max(0, m.w - m.cw) });
  console.log(`${file}  status ${res?.status()}  page ${w}x${m.h}  overflow ${Math.max(0, m.w - m.cw)}px`);
  await ctx.close();
}
await browser.close();
srv?.close();
writeFileSync(join(out, "index.json"), JSON.stringify({ captured_at_commit: sh("git rev-parse HEAD"), uncommitted_measured_paths: sh("git status --porcelain -- data content tour schema scripts site i18n").split("\n").filter(Boolean).length, source: dist ? `scoped production build (${dist})` : baseArg, cap_px: CAP, shots }, null, 1) + "\n");
console.log(`${shots.length} screenshots -> ${out}`);
