// Independent three-tap / no-JS check. Run from repo root: node docs/courses-mission/verifier/three-tap-check.mjs
import http from "node:http"; import fs from "node:fs"; import path from "node:path";
import { chromium } from "playwright";
const DIST = process.env.DIST || ".cache/courses-dist", PUB = "site/public";
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".json": "application/json", ".png": "image/png", ".woff2": "font/woff2" };
const srv = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split("?")[0]); if (p.endsWith("/")) p += "index.html";
  for (const root of [DIST, PUB]) { const f = path.join(root, p); if (fs.existsSync(f) && fs.statSync(f).isFile()) { r.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); return fs.createReadStream(f).pipe(r); } }
  r.writeHead(404); r.end("nf");
}).listen(0);
const base = `http://127.0.0.1:${srv.address().port}`;
// ---- data: lessons and their subject, from data/course
const recs = {};
for (const f of fs.readdirSync("data/course")) { const t = fs.readFileSync("data/course/" + f, "utf8"); const g = (k) => (t.match(new RegExp("^" + k + ": (.*)$", "m")) || [])[1]?.trim(); recs[f.replace(/\.yaml$/, "")] = { kind: g("kind"), part: g("part_of")?.replace("course/", ""), title: { en: (t.match(/^label:\n  en: (.*)$/m) || [])[1], ar: (t.match(/^  ar: (.*)$/m) || [])[1] } }; }
const subjOf = (id) => { let c = recs[id]; while (c && c.kind !== "subject") c = recs[c.part]; return c ? Object.keys(recs).find((k) => recs[k] === c) : null; };
const lessons = Object.keys(recs).filter((k) => recs[k].kind === "lesson").map((id) => ({ id, subject: subjOf(id), title: recs[id].title }));
const unq = (s) => (s || "").replace(/^['"]|['"]$/g, "");
const browser = await chromium.launch();
const VP = { width: 390, height: 844 };
// one honest tap: click only what is actually visible; a closed <details> costs one tap on its summary
const covered = [];
async function tapTo(page, want) { // want: array of hrefs in preference order; returns taps spent on this page, or -1
  let taps = 0;
  for (let guard = 0; guard < 6; guard++) {
    for (const href of want) {
      const loc = page.locator(`main a[href="${href}"], #main a[href="${href}"], .cx a[href="${href}"]`).first();
      if (await loc.count() === 0) continue;
      if (await loc.isVisible()) { await loc.evaluate((el) => { document.documentElement.style.scrollBehavior = 'auto'; el.scrollIntoView({ block: 'center', behavior: 'instant' }); }); const hit = await loc.evaluate((el) => { const r = el.getBoundingClientRect(); const e = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return e === el || el.contains(e); }); if (!hit) covered.push(href); await Promise.all([page.waitForURL((u) => u.pathname === href, { timeout: 5000 }), loc.click()]); return taps + 1; }
      // hidden: find closed ancestor details
      const sum = await loc.evaluateHandle((el) => { const d = el.closest("details:not([open])"); return d ? d.querySelector(":scope > summary") : null; });
      const s = sum.asElement(); if (!s) return -1;
      await s.click(); taps++; continue;
    }
    return -1;
  }
  return -1;
}
async function run(lang, ls, js, storage) {
  const out = [];
  for (const L of ls) {
    const ctx = await browser.newContext({ viewport: VP, javaScriptEnabled: js, isMobile: js && !process.env.NOMOBILE_NOJS ? true : (js ? true : process.env.NOJS_MOBILE === '1'), hasTouch: js || process.env.NOJS_MOBILE === '1' });
    if (storage && js) await ctx.addInitScript((s) => { try { for (const k in s) localStorage.setItem(k, s[k]); } catch (e) {} }, storage(L));
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
    const home = `/${lang}/learn/courses/`, sub = `${home}${L.subject}/`, les = `${sub}${L.id}/`;
    let taps = 0, ok = false, why = "";
    try {
      await page.goto(base + home, { waitUntil: "load" });
      const a = await tapTo(page, [les, sub]);
      if (a < 0) why = "no tappable route on home";
      else { taps += a; if (page.url().endsWith(les)) ok = true; else { const b = await tapTo(page, [les]); if (b < 0) why = "lesson link not reachable on subject page"; else { taps += b; ok = page.url().endsWith(les); } } }
      let titleOK = false, textLen = 0, hiddenBits = 0;
      if (ok) { const h1 = (await page.locator("h1").first().innerText()).trim(); const want = unq(L.title[lang]); titleOK = !!want && (await page.locator("body").innerText()).includes(want); const mainTxt = await page.locator("main, #main").first().innerText(); textLen = mainTxt.length; hiddenBits = await page.locator("main [hidden], #main [hidden]").count(); out.push({ id: L.id, taps, ok, titleOK, textLen, hiddenBits, h1, errs: errs.length }); }
      else out.push({ id: L.id, taps, ok, why, errs: errs.length });
    } catch (e) { out.push({ id: L.id, taps, ok: false, why: String(e).slice(0, 120) }); }
    await ctx.close();
  }
  return out;
}
const report = {}; const modes = [["plain", true, null], ["nojs", false, null],
  ["storage-done-last", true, (L) => ({ "courses:done": JSON.stringify(Object.fromEntries(lessons.map((l) => [`${l.subject}/${l.id}`, "2026-11-01"]))), "courses:last": JSON.stringify({ course: L.subject, lesson: L.id, title: "x", href: "/en/learn/courses/", nextHref: "/en/learn/courses/", nextTitle: "y" }) })],
  ["storage-garbage", true, () => ({ "courses:done": "{not json", "courses:last": "[1,2" })]];
for (const lang of ["en", "ar"]) for (const [name, js, st] of modes.filter((m) => !process.env.ONLY || m[0] === process.env.ONLY)) report[`${lang}/${name}`] = await run(lang, lessons, js, st);
// home state with storage: does the resume banner appear/does the list change?
const ctx = await browser.newContext({ viewport: VP }); await ctx.addInitScript(() => { localStorage.setItem("courses:last", JSON.stringify({ course: "ca-on-g6-science", lesson: "ca-on-g6-sci-bio-1", title: "T", href: "/en/learn/courses/ca-on-g6-science/ca-on-g6-sci-bio-1/", nextHref: "/en/learn/courses/ca-on-g6-science/ca-on-g6-sci-bio-2/", nextTitle: "N" })); });
const pg = await ctx.newPage(); await pg.goto(base + "/en/learn/courses/"); await new Promise((r) => setTimeout(r, 500));
report.homeWithLast = { resumeVisible: await pg.locator("[data-cx-resume]").isVisible(), links: await pg.locator(".cx-subject").count(), jurOpen: await pg.locator("details.cx-jur[open]").count() };
const summary = {};
for (const [k, v] of Object.entries(report)) { if (!Array.isArray(v)) continue; const d = {}; v.forEach((x) => { const key = x.ok ? x.taps : "FAIL"; d[key] = (d[key] || 0) + 1; }); summary[k] = { n: v.length, dist: d, titleMissing: v.filter((x) => x.ok && !x.titleOK).map((x) => x.id), shortText: v.filter((x) => x.ok && x.textLen < 500).map((x) => x.id), minText: Math.min(...v.filter((x) => x.ok).map((x) => x.textLen)), hiddenMax: Math.max(...v.filter((x) => x.ok).map((x) => x.hiddenBits)), pageErrors: v.reduce((a, x) => a + (x.errs || 0), 0), fails: v.filter((x) => !x.ok) }; }
console.log("coveredTargets", covered.length);
console.log(JSON.stringify({ commit: process.env.C, lessonsInData: lessons.length, subjects: [...new Set(lessons.map((l) => l.subject))], summary, homeWithLast: report.homeWithLast }, null, 1));
fs.writeFileSync(process.env.RAW || "docs/courses-mission/verifier/three-tap-raw.json", JSON.stringify(report, null, 1));
await browser.close(); srv.close();
