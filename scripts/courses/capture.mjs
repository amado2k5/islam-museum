// Screenshots of the courses surface for the vision pass (statement 9), from the scoped production build.
//
//   python3 scripts/courses/scoped_build.py && node scripts/courses/capture.mjs docs/courses-mission/vision/round-1
//
// Pages: the courses home, the course map, three lessons (first, one with unwritten records, last), in Arabic
// (right-to-left) and English, at phone (390), tablet (820) and desktop (1280) widths; plus four states that only a
// click produces (a lesson marked done on the map, the home's resume banner, the self-check answered, classroom view)
// and two no-script pages. JPEG; tall pages are cut into slices of at most 2,400 px so nothing is left unseen.
// index.json records every file with its page, width, full height and the horizontal overflow measured in the page
// (0 means no sideways scroll).
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { mkdirSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { extname, join, resolve } from "node:path";

const args = process.argv.slice(2);
const flag = (n) => (args.includes(n) ? args.splice(args.indexOf(n), 2)[1] : null);
const DIST = resolve(flag("--dist") ?? ".cache/courses-dist");
const only = flag("--only");
const out = args[0];
if (!out) { console.error("usage: node scripts/courses/capture.mjs <out-dir> [--dist <built-dir>] [--only <substring>]"); process.exit(2); }
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".woff2": "font/woff2", ".jpg": "image/jpeg" };
const PUBLIC = resolve("site/public");
export const serve = (dist, port) => new Promise((ok) => {
  const srv = createServer(async (req, res) => {
    const p = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
    for (const root of [dist, PUBLIC]) {
      const f = join(root, p.endsWith("/") ? p + "index.html" : p);
      if (!f.startsWith(root)) continue;
      try { const b = await readFile(f); res.writeHead(200, { "content-type": MIME[extname(f)] ?? "application/octet-stream" }); res.end(b); return; } catch {}
    }
    res.writeHead(404); res.end("not found");
  });
  srv.listen(port, () => ok(srv));
});

const WIDTHS = { phone: [390, 844], tablet: [820, 1180], desktop: [1280, 800] };
const COURSE = "ca-on-g6-science";
const PAGES = [
  ["home", "learn/courses/"],
  ["map", `learn/courses/${COURSE}/`],
  ["lesson-first", `learn/courses/${COURSE}/ca-on-g6-sci-bio-1/`],
  ["lesson-stubs", `learn/courses/${COURSE}/ca-on-g6-sci-elec-2/`],
  ["lesson-last", `learn/courses/${COURSE}/ca-on-g6-sci-space-4/`],
];
const SLICE = 2400;

const srv = await serve(DIST, 48241);
const base = "http://127.0.0.1:48241";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const index = [];
async function shoot(page, name, meta, viewportOnly = false) {
  if (only && !name.includes(only)) return;
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  const m = await page.evaluate(() => ({ h: document.documentElement.scrollHeight, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
  const vw = page.viewportSize().width;
  if (viewportOnly) { const file = `${name}.jpg`; await page.screenshot({ path: join(out, file), type: "jpeg", quality: 62 }); index.push({ file, ...meta, slice: "viewport", full_height: m.h, overflow_px: m.overflow }); return; }
  const n = Math.max(1, Math.ceil(m.h / SLICE));
  for (let i = 0; i < n; i++) {
    const file = `${name}${n > 1 ? `-${i + 1}of${n}` : ""}.jpg`;
    await page.screenshot({ path: join(out, file), type: "jpeg", quality: 62, fullPage: true, clip: { x: 0, y: i * SLICE, width: vw, height: Math.min(SLICE, m.h - i * SLICE) } });
    index.push({ file, ...meta, slice: `${i + 1}/${n}`, full_height: m.h, overflow_px: m.overflow });
  }
}
for (const lang of ["ar", "en"]) {
  for (const [w, [vw, vh]] of Object.entries(WIDTHS)) {
    const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    for (const [key, path] of PAGES) {
      await page.goto(`${base}/${lang}/${path}`, { waitUntil: "load" });
      await shoot(page, `${lang}-${w}-${key}`, { lang, width: vw, page: key, path: `/${lang}/${path}`, state: "as loaded" });
    }
    if (w !== "tablet") {
      // states a click produces: answer the check, mark the lesson done, then look at the map and the home again
      await page.goto(`${base}/${lang}/${PAGES[2][1]}`, { waitUntil: "load" });
      const radios = page.locator(".cx-q input[type=radio]");
      if (await radios.count()) await radios.first().check();
      await page.locator(".cx-tell summary").first().click().catch(() => {});
      await page.locator("[data-cx-done]").click();
      await page.locator("#check").scrollIntoViewIfNeeded();
      await shoot(page, `${lang}-${w}-state-check-answered`, { lang, width: vw, page: "lesson-first", path: `/${lang}/${PAGES[2][1]}`, state: "first option chosen, first tell-it-back opened, lesson marked done" });
      await page.goto(`${base}/${lang}/${PAGES[1][1]}`, { waitUntil: "load" });
      await shoot(page, `${lang}-${w}-state-map-progress`, { lang, width: vw, page: "map", path: `/${lang}/${PAGES[1][1]}`, state: "one lesson done" });
      await page.goto(`${base}/${lang}/${PAGES[0][1]}`, { waitUntil: "load" });
      await shoot(page, `${lang}-${w}-state-home-resume`, { lang, width: vw, page: "home", path: `/${lang}/${PAGES[0][1]}`, state: "after visiting a lesson" });
      await page.goto(`${base}/${lang}/${PAGES[2][1]}`, { waitUntil: "load" });
      await page.locator("[data-cx-present]").click();
      await shoot(page, `${lang}-${w}-state-classroom-1`, { lang, width: vw, page: "lesson-first", path: `/${lang}/${PAGES[2][1]}`, state: "classroom view, first step" }, true);
      await page.keyboard.press("ArrowDown"); await page.keyboard.press("ArrowDown");
      await shoot(page, `${lang}-${w}-state-classroom-3`, { lang, width: vw, page: "lesson-first", path: `/${lang}/${PAGES[2][1]}`, state: "classroom view, third step (two presses of the down arrow)" }, true);
    }
    await ctx.close();
  }
  // no script: the phone width, the lesson and the home
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  for (const [key, path] of [PAGES[0], PAGES[2]]) {
    await page.goto(`${base}/${lang}/${path}`, { waitUntil: "load" });
    await shoot(page, `${lang}-phone-nojs-${key}`, { lang, width: 390, page: key, path: `/${lang}/${path}`, state: "JavaScript disabled" });
  }
  await ctx.close();
  // print layout of the first lesson
  const pctx = await browser.newContext({ viewport: { width: 794, height: 1123 } });
  const pp = await pctx.newPage();
  await pp.goto(`${base}/${lang}/${PAGES[2][1]}`, { waitUntil: "load" });
  await pp.emulateMedia({ media: "print" });
  await shoot(pp, `${lang}-print-lesson-first`, { lang, width: 794, page: "lesson-first", path: `/${lang}/${PAGES[2][1]}`, state: "print media (A4 width)" });
  await pctx.close();
}
await browser.close();
srv.close();
const commit = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
const dirty = execSync("git status --porcelain -- site data content i18n", { encoding: "utf8" }).split("\n").filter(Boolean).length;
if (!only) writeFileSync(join(out, "index.json"), JSON.stringify({ commit, uncommitted_paths: dirty, dist: DIST.replace(resolve(".") + "/", ""), captured: new Date().toISOString(), shots: index }, null, 1) + "\n");
const over = index.filter((s) => s.overflow_px > 0);
console.log(`captured ${index.length} files into ${out} at ${commit.slice(0, 10)}; pages with sideways scroll: ${new Set(over.map((s) => s.file.replace(/-\dof\d/, ""))).size}`);
for (const s of over) console.log(`  overflow ${s.overflow_px}px: ${s.file}`);
