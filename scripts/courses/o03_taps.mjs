// Statements 2 and 3: every lesson of every course is served by the new surface in Arabic and English, and from the
// courses home every lesson is at most three interactions away, measured on the built site at phone width.
//
//   python3 scripts/courses/scoped_build.py && node scripts/courses/o03_taps.mjs [--save]
//
// What counts as one interaction: one tap or click on a control a student can see: a link, or the summary of a closed
// <details> (opening a school system). Scrolling is not counted. The measurement is done twice, independently:
//   1. by search: a breadth-first walk from the home over the links each page actually shows in a real browser at 390 px,
//      where a link inside a closed <details> costs one extra interaction;
//   2. by doing it: for every lesson, a fresh browser starts at the home and performs the taps of the shortest path found,
//      and the oracle checks it landed on that lesson's page and counts the taps it performed.
// The lesson list comes from data/course/*.yaml, not from the pages, so a lesson the surface forgot fails the check.
import { chromium } from "playwright";
import { Oracle, serve, courseTree } from "./oracle.mjs";

const o = new Oracle("03", "every lesson is served in Arabic and English, at most three interactions from the courses home (statements 2 and 3)");
const { lessons } = courseTree();
const srv = await serve(48242);
const base = "http://127.0.0.1:48242";
const browser = await chromium.launch();
const LIMIT = 3;
let worst = 0, served = 0, walked = 0, missing = [], far = [], wrong = [];
const hist = {};

// what a student can tap on a page: [{href, cost}] where cost is 1, or 2 if the link sits inside a closed <details>
const tappable = () => [...document.querySelectorAll("main a[href], #main a[href], .cx a[href]")].filter((a) => {
  const r = a.getBoundingClientRect(); const closed = a.closest("details:not([open])");
  return closed ? true : r.width > 0 && r.height > 0 && getComputedStyle(a).visibility !== "hidden";
}).map((a) => ({ href: new URL(a.href).pathname, cost: a.closest("details:not([open])") ? 2 : 1 }));

for (const lang of ["ar", "en"]) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const home = `/${lang}/learn/courses/`;
  const prefix = home;
  // 1. search
  const dist = new Map([[home, 0]]), via = new Map();
  let frontier = [home];
  while (frontier.length) {
    const nextF = [];
    for (const u of frontier) {
      if (dist.get(u) >= LIMIT) continue;
      const r = await page.goto(base + u, { waitUntil: "load" });
      if (!r || r.status() !== 200) continue;
      for (const { href, cost } of await page.evaluate(tappable)) {
        if (!href.startsWith(prefix)) continue;
        const d = dist.get(u) + cost;
        if (d <= LIMIT && (!dist.has(href) || d < dist.get(href))) { dist.set(href, d); via.set(href, u); nextF.push(href); }
      }
    }
    frontier = [...new Set(nextF)];
  }
  o.note(`/${lang}/: pages of the courses surface reached from the home within ${LIMIT} interactions: ${dist.size}`);
  // 2. every lesson from the data: served, within the limit, and the path really works
  for (const l of lessons) {
    const url = `${home}${l.subject}/${l.slug}/`;
    const r = await page.goto(base + url, { waitUntil: "load" });
    const ok = r && r.status() === 200 && (await page.locator("[data-cx='lesson']").count()) === 1 && (await page.locator("h1").innerText()).trim().length > 0;
    if (!ok) { missing.push(`${lang}:${l.slug}`); continue; }
    served++;
    const d = dist.get(url);
    if (d === undefined) { far.push(`${lang}:${l.slug} (not reached within ${LIMIT})`); continue; }
    hist[d] = (hist[d] ?? 0) + 1; worst = Math.max(worst, d);
    // do it: replay the path with real taps in a fresh context (no stored state)
    const path = []; for (let u = url; u !== home; u = via.get(u)) path.unshift(u);
    const c2 = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const p2 = await c2.newPage();
    await p2.goto(base + home, { waitUntil: "load" });
    let taps = 0;
    for (const step of path) {
      const a = p2.locator(`.cx a[href="${step}"]`).first();
      const closed = await a.evaluate((el) => !!el.closest("details:not([open])"));
      if (closed) { await a.evaluate((el) => el.closest("details").querySelector("summary").click()); taps++; }
      await a.scrollIntoViewIfNeeded();
      await Promise.all([p2.waitForURL(base + step), a.tap ? a.click() : a.click()]);
      taps++;
    }
    const landed = new URL(p2.url()).pathname === url && (await p2.locator("[data-cx-lesson='" + l.slug + "']").first().count()) > 0;
    if (!landed || taps !== d || taps > LIMIT) wrong.push(`${lang}:${l.slug} (taps ${taps}, expected ${d}, landed ${landed})`); else walked++;
    await c2.close();
  }
  await ctx.close();
}
await browser.close(); srv.close();
const total = lessons.length * 2;
o.note(`lessons in data/course: ${lessons.length}; lesson pages expected (Arabic + English): ${total}`);
o.note(`interactions from the home to a lesson, by search: ${Object.entries(hist).sort().map(([d, n]) => `${n} lessons at ${d}`).join(", ")}; the most: ${worst}`);
o.note(`paths replayed with real taps in a fresh browser at 390 px: ${walked} of ${total}`);
o.check("every lesson in the data is served by the new surface in Arabic and in English", served === total, missing.length ? `missing: ${missing.join(", ")}` : `${served} of ${total}`);
o.check(`every lesson is at most ${LIMIT} interactions from the courses home (by search)`, far.length === 0 && worst <= LIMIT && served === total, far.join(", ") || `the most is ${worst}`);
o.check("every shortest path was performed with real taps and landed on its lesson", walked === total, wrong.join(", ") || `${walked} of ${total}`);
o.done("o03-taps");
