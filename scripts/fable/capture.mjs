// Captures rendered pages as PNG screenshots for the vision pass (statement 8).
//   node scripts/fable/capture.mjs <base-url> <out-dir> [--only tour|site] [--nojs]
// Pages: the Tour (river, three rooms, completion room), the homepage and the nine wing landings, in Arabic and English,
// at phone (390), tablet (820) and desktop (1280) widths. Full-page shots are capped in height so the very long wing
// landings stay reviewable; the cap is printed with each file.
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [base, out] = process.argv.slice(2);
const only = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : null;
const nojs = process.argv.includes("--nojs");
if (!base || !out) { console.error("usage: node scripts/fable/capture.mjs <base-url> <out-dir> [--only tour|site] [--nojs]"); process.exit(2); }
const WIDTHS = { phone: [390, 844], tablet: [820, 1180], desktop: [1280, 800] };
const WINGS = ["time", "place", "people", "ideas", "objects", "words", "living", "today", "made"];
const TOUR = [["river", "grand-tour/"], ["room-first", "grand-tour/kaaba/"], ["room-badr", "grand-tour/battle-of-badr/"], ["room-last", "grand-tour/kiswa/"], ["complete", "grand-tour/complete/"]];
const SITE = [["home", ""], ...WINGS.map((w) => [`wing-${w}`, `${w}/`])];
const pages = [...(only === "site" ? [] : TOUR), ...(only === "tour" ? [] : SITE)];
const CAP = 5200;
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const index = [];
for (const lang of ["ar", "en"]) for (const [name, path] of pages) for (const [size, [w, h]] of Object.entries(WIDTHS)) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, javaScriptEnabled: !nojs, colorScheme: "light", reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const url = `${base.replace(/\/$/, "")}/${lang}/${path}`;
  const res = await page.goto(url, { waitUntil: "load", timeout: 120000 });
  await page.addStyleTag({ content: "astro-dev-toolbar{display:none!important}" }).catch(() => {}); // the dev server's own overlay is not part of the page
  await page.waitForTimeout(nojs ? 200 : 900);
  const full = await page.evaluate(() => ({ h: document.documentElement.scrollHeight, w: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth })).catch(() => ({ h: 0, w: 0, cw: 0 }));
  const file = `${lang}-${name}-${size}${nojs ? "-nojs" : ""}.png`;
  await page.screenshot({ path: join(out, file), clip: { x: 0, y: 0, width: w, height: Math.min(full.h || h, CAP) }, fullPage: true });
  const row = { file, url: `/${lang}/${path}`, status: res?.status(), width: w, pageHeight: full.h, shotHeight: Math.min(full.h || h, CAP), horizontalOverflowPx: Math.max(0, full.w - full.cw) };
  index.push(row);
  console.log(`${file}  status ${row.status}  page ${w}x${row.pageHeight}  shot height ${row.shotHeight}  horizontal overflow ${row.horizontalOverflowPx}px`);
  await ctx.close();
}
await browser.close();
writeFileSync(join(out, `index${nojs ? "-nojs" : ""}.json`), JSON.stringify(index, null, 1) + "\n");
console.log(`${index.length} screenshots -> ${out}`);
