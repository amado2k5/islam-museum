// Stills of other browsers and explorers, for the tiles behind the number card. One still each, from the live site.
//   node scripts/stills.mjs en|ar
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { ROOT } from "./units.mjs";
const lang = process.argv[2];
const out = `${ROOT}footage/${lang}/stills/`; mkdirSync(out, { recursive: true });
// page, and how far down its signature view sits (pixels, at 1280 x 720)
const PAGES = [["asma", 560], ["battles", 560], ["companions", 600], ["khulafa", 600], ["nature", 640], ["screen", 260], ["journeys", 600], ["modern", 640],
  ["art", 600], ["calendar", 60], ["inventions", 600], ["graph", 250], ["words/hadith", 420], ["words/quran", 520], ["grand-tour", 470], ["time-browser", 560]];
const b = await chromium.launch({ headless: true, args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"] });
const p = await (await b.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1, colorScheme: "dark" })).newPage();
let i = 0;
for (const [path, y] of PAGES) {
  await p.goto(`https://islam.museum/${lang}/${path}/`, { waitUntil: "networkidle", timeout: 90000 });
  await p.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y);
  await p.waitForTimeout(900);
  // the site's header stays at the top of every page; the tile shows the page under it
  const top = await p.evaluate(() => { const h = document.querySelector("header.site"); return h ? Math.ceil(h.getBoundingClientRect().bottom) : 0; });
  await p.screenshot({ path: `${out}${String(i++).padStart(2, "0")}-${path.replace(/\//g, "_")}.jpg`, type: "jpeg", quality: 86, clip: { x: 0, y: top, width: 1280, height: 720 - top } });
  console.log(path);
}
await b.close();
