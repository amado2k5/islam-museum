// Statement 9: the flagship degrades honestly, proven by a run with JavaScript disabled.
//
//   sh scripts/fable/scoped-build.sh && node scripts/fable/o09_nojs.mjs
//
// Serves the scoped production build (.cache/fable-dist) on a loopback port and, in Arabic and English:
//   1. with JavaScript DISABLED: opens the River and checks it is a list (not a horizontal band), that every stop of the
//      manifest is a visible link in manifest order, and that the river's script-only controls are not shown;
//   2. with JavaScript DISABLED: walks the Tour by following the "next" link from the first room to the completion room,
//      checking at each room that the page loads, names the right record, carries a readable narrative, a ribbon and the
//      "why this stop matters" line, and that the walk visits every stop exactly once, in order;
//   3. checks no stop is unreachable: each is linked from the River, from its neighbours, and from the completion room;
//   4. checks the completion room states the same count the coverage oracle computes from the graph;
//   5. with JavaScript ENABLED: runs axe-core (WCAG 2.0/2.1/2.2 A and AA, the site's own standard) on the River, three rooms
//      and the completion room, light and dark, and records that no Tour page requests anything from another origin.
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DIST = join(ROOT, ".cache", "fable-dist");
const PORT = 48231;
const sh = (c) => execSync(c, { cwd: ROOT, encoding: "utf8" }).trim();
const head = sh("git rev-parse HEAD");
const manifest = [...readFileSync(join(ROOT, "tour", "grand-tour.yaml"), "utf8").matchAll(/^\s*-\s*id:\s*([a-z]+\/[a-z0-9-]+)\s*$/gm)].map((m) => m[1]);
const slugs = manifest.map((id) => id.split("/")[1]);

console.log("ORACLE 09: the flagship degrades honestly with JavaScript disabled (statement 9)");
console.log("file: scripts/fable/o09_nojs.mjs");
console.log(`HEAD: ${head}`);
console.log(`uncommitted paths under data/ content/ tour/ schema/ scripts/ site/ i18n/: ${sh("git status --porcelain -- data content tour schema scripts site i18n").split("\n").filter(Boolean).length}`);
if (!existsSync(join(DIST, "ar", "grand-tour", "index.html"))) { console.log("built pages: MISSING. Run `sh scripts/fable/scoped-build.sh` first."); console.log("RESULT: NOT-GREEN (no built pages)"); process.exit(1); }
console.log(`built pages: .cache/fable-dist (scoped production build: homepage, wing landings and the Tour, rendered by the real site source)`);
console.log("-".repeat(78));
let ok = true; const failed = [];
const check = (name, pass, detail = "") => { if (!pass) { ok = false; failed.push(name); } console.log(`[${pass ? "PASS" : "FAIL"}] ${name}${detail ? ": " + detail : ""}`); };

const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2" };
const srv = createServer(async (req, res) => {
  try {
    const p = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
    const file = join(DIST, p.endsWith("/") ? p + "index.html" : p);
    if (!file.startsWith(DIST)) throw 0;
    const body = await readFile(file);
    res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch { if (!res.headersSent) res.writeHead(404); res.end(); }
});
await new Promise((r) => srv.listen(PORT, r));
const base = `http://127.0.0.1:${PORT}`;
const browser = await chromium.launch();
const words = (s) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

// Positive control: the check "the River is a list" means nothing unless the same page IS a band when scripts run.
for (const lang of ["ar", "en"]) {
  const ctx = await browser.newContext({ javaScriptEnabled: true, viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(`${base}/${lang}/grand-tour/`, { waitUntil: "load" });
  await page.waitForTimeout(500);
  const on = await page.evaluate(() => { const r = document.querySelector("[data-gt-river]"); const cs = getComputedStyle(r); const ctl = document.querySelector("[data-gt-ctl]"); return { styled: getComputedStyle(document.querySelector(".wrap")).maxWidth !== "none", display: cs.display, scrolls: r.scrollWidth > r.clientWidth + 50, ctl: ctl.getClientRects().length > 0, pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }; });
  check(`[${lang}] control: with JavaScript on, the same list is the band (a flex row that scrolls inside itself, controls shown, page still not scrolling sideways)`, on.styled && on.display === "flex" && on.scrolls && on.ctl && on.pageOverflow <= 0, `stylesheet applied ${on.styled}; display ${on.display}; band scrolls ${on.scrolls}; controls ${on.ctl}; page overflow ${on.pageOverflow}px`);
  await ctx.close();
}

for (const lang of ["ar", "en"]) {
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const res = await page.goto(`${base}/${lang}/grand-tour/`);
  const river = await page.evaluate(() => {
    const r = document.querySelector("[data-gt-river]");
    const cs = r ? getComputedStyle(r) : null;
    const links = [...document.querySelectorAll("[data-gt-river] a[data-gt-stop]")];
    const ctl = document.querySelector("[data-gt-ctl]");
    return { js: document.documentElement.classList.contains("js"), styled: getComputedStyle(document.querySelector(".wrap")).maxWidth !== "none", display: cs?.display, overflowX: cs?.overflowX, tag: r?.tagName,
      stops: links.map((a) => ({ slug: a.getAttribute("data-gt-stop"), href: a.getAttribute("href"), visible: a.getClientRects().length > 0 && getComputedStyle(a).visibility !== "hidden", top: a.getBoundingClientRect().top + scrollY, text: a.textContent.trim() })),
      ctlShown: ctl ? ctl.getClientRects().length > 0 : false, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      mainOverflow: Math.max(0, ...[...document.querySelectorAll("main *")].map((el) => { const b = el.getBoundingClientRect(); return b.width > 0 ? Math.max(b.right - document.documentElement.clientWidth, -b.left) : 0; })) };
  });
  check(`[${lang}] the River page loads without JavaScript, with the site's stylesheet applied`, res?.status() === 200 && !river.js && river.styled, `status ${res?.status()}; stylesheet applied ${river.styled}`);
  check(`[${lang}] the River is a list, not a band: an <ol> laid out as a block with no sideways scroll`, river.tag === "OL" && river.display !== "flex" && river.overflowX === "visible", `display ${river.display}, overflow-x ${river.overflowX}`);
  check(`[${lang}] every stop of the manifest is a visible link in the list, in manifest order`, river.stops.length === slugs.length && river.stops.every((s, i) => s.slug === slugs[i] && s.visible && s.text.length > 0), `${river.stops.filter((s) => s.visible).length} visible of ${slugs.length}`);
  check(`[${lang}] the stops read top to bottom`, river.stops.every((s, i) => i === 0 || s.top >= river.stops[i - 1].top));
  // Without JavaScript the site's own header menu is wider than a phone screen on every page, existing ones included.
  // That is measured here on the existing homepage, so the Tour is held to the site's standard and not blamed for it.
  await page.goto(`${base}/${lang}/`);
  const siteOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await page.goto(`${base}/${lang}/grand-tour/`);
  check(`[${lang}] the river's script-only controls are not shown, and nothing in the Tour's own content runs off a phone screen`, !river.ctlShown && river.mainOverflow <= 1, `content overflow ${Math.round(river.mainOverflow)}px`);
  check(`[${lang}] the page scrolls sideways no more than the existing homepage does without JavaScript (the site's header menu, a defect that predates the Tour)`, river.overflow <= siteOverflow, `River ${river.overflow}px; existing homepage ${siteOverflow}px`);

  // walk the tour by its own "next" links
  const visited = []; const thin = []; const missing = [];
  let url = river.stops[0]?.href;
  let prevHref = null;
  for (let i = 0; i < slugs.length + 2 && url; i++) {
    const r = await page.goto(base + url);
    if (url.endsWith("/grand-tour/complete/")) break;
    const room = await page.evaluate(() => ({ slug: document.querySelector("[data-gt-room]")?.getAttribute("data-gt-room"), h1: document.querySelector("h1")?.textContent.trim() ?? "", narrative: document.querySelector(".gt-narrative")?.textContent ?? "",
      ribbon: !!document.querySelector(".gt-ribbon ol li[aria-current]"), why: document.querySelector(".gt-why")?.textContent.trim() ?? "", next: document.querySelector("[data-gt-next]")?.getAttribute("href"), prev: document.querySelector("[data-gt-prev]")?.getAttribute("href"), full: !!document.querySelector(".gt-full a") }));
    visited.push(room.slug);
    if (r?.status() !== 200 || !room.h1 || !room.ribbon || !/\d/.test(room.why) || !room.full) missing.push(`${room.slug}: status ${r?.status()}, h1 ${!!room.h1}, ribbon ${room.ribbon}, why ${/\d/.test(room.why)}`);
    if (words(room.narrative) < 100) thin.push(`${room.slug} (${words(room.narrative)} words)`);
    if (i > 0 && room.prev !== prevHref) missing.push(`${room.slug}: its "previous" link does not lead back to the room before it`);
    prevHref = url; url = room.next;
  }
  check(`[${lang}] following "next" from the first room visits every stop once, in order, and ends in the completion room`, visited.length === slugs.length && visited.every((s, i) => s === slugs[i]) && url?.endsWith("/grand-tour/complete/"), `${visited.length} rooms walked of ${slugs.length}`);
  check(`[${lang}] every room loads and shows its name, ribbon, counted line and door to the full record`, missing.length === 0, missing.slice(0, 4).join("; "));
  check(`[${lang}] every room's narrative is readable without JavaScript (100 words or more on the page)`, thin.length === 0, thin.join(", "));
  const done = await page.evaluate(() => ({ n: document.querySelector("[data-gt-hanging]")?.getAttribute("data-gt-hanging"), key: [...document.querySelectorAll(".gt-key a")].map((a) => a.getAttribute("href")), wings: document.querySelectorAll(".gt-complete .grid-cards a").length, graph: !!document.querySelector(`a[href$="/graph/"]`), svg: document.querySelectorAll(".gt-route [data-gt-node]").length }));
  const expected = (sh("python3 scripts/fable/o02_tour_coverage.py || true").match(/hang directly off this path[^:]*: (\d+)/) ?? [])[1];
  check(`[${lang}] the completion room states the count the coverage oracle computes from the graph`, !!expected && done.n === expected, `page ${done.n}, oracle ${expected}`);
  check(`[${lang}] the completion room draws every stop, links every stop, and opens the nine wings and the graph explorer`, done.svg === slugs.length && done.key.length === slugs.length && done.wings === 9 && done.graph, `${done.svg} drawn, ${done.key.length} linked, ${done.wings} wing doors`);
  const fromRiver = new Set(river.stops.map((s) => s.href)), fromDone = new Set(done.key);
  const unreachable = slugs.filter((s) => !fromRiver.has(`/${lang}/grand-tour/${s}/`) || !fromDone.has(`/${lang}/grand-tour/${s}/`) || !visited.includes(s));
  check(`[${lang}] no stop is unreachable: each is linked from the River, from the walk and from the completion room`, unreachable.length === 0, unreachable.join(", "));
  await ctx.close();
}

// the site's own accessibility standard, and no request to another origin
const samples = ["grand-tour/", `grand-tour/${slugs[0]}/`, `grand-tour/${slugs[Math.floor(slugs.length / 2)]}/`, `grand-tour/${slugs[slugs.length - 1]}/`, "grand-tour/complete/"];
let violations = 0, foreign = 0; const lines = [];
for (const lang of ["ar", "en"]) for (const scheme of ["light", "dark"]) {
  const ctx = await browser.newContext({ colorScheme: scheme, viewport: { width: 1280, height: 900 } });
  for (const path of samples) {
    const page = await ctx.newPage();
    page.on("request", (rq) => { if (!rq.url().startsWith(base) && !rq.url().startsWith("data:")) { foreign++; lines.push(`  request to another origin from /${lang}/${path}: ${rq.url()}`); } });
    await page.goto(`${base}/${lang}/${path}`, { waitUntil: "load" });
    await page.waitForTimeout(300);
    const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    for (const v of r.violations) { violations++; lines.push(`  axe ${v.impact} ${v.id} on /${lang}/${path} (${scheme}): ${v.nodes.length} node(s): ${v.nodes[0].target.join(" ")}`); }
    await page.close();
  }
  await ctx.close();
}
for (const l of lines.slice(0, 30)) console.log(l);
check(`axe-core finds no WCAG A or AA violation on the Tour's pages (${samples.length} pages, two languages, light and dark)`, violations === 0, `${violations} violation(s)`);
check("no Tour page requests anything from another origin", foreign === 0, `${foreign} request(s)`);
await browser.close();
srv.close();
console.log("-".repeat(78));
console.log(ok ? "RESULT: GREEN" : `RESULT: NOT-GREEN (${failed.length} failed: ${failed.join("; ")})`);
process.exit(ok ? 0 : 1);
