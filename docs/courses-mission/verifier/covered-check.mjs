// Diagnostic: is any lesson link on the subject page covered by another element after scrollIntoView? (JS on/off, ar/en)
import http from "node:http"; import fs from "node:fs"; import path from "node:path"; import { chromium } from "playwright";
const D = process.env.DIST || ".cache/courses-dist";
const s = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p.endsWith("/")) p += "index.html"; for (const root of [D, "site/public"]) { const f = path.join(root, p); if (fs.existsSync(f) && fs.statSync(f).isFile()) { r.writeHead(200, { "content-type": p.endsWith(".html") ? "text/html" : p.endsWith(".js") ? "text/javascript" : "application/octet-stream" }); return fs.createReadStream(f).pipe(r); } } r.writeHead(404); r.end(); }).listen(0);
const b = await chromium.launch(); const base = `http://127.0.0.1:${s.address().port}`;
for (const lang of ["ar", "en"]) for (const js of [false, true]) {
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: js, isMobile: true, hasTouch: true }); const pg = await c.newPage();
  await pg.goto(`${base}/${lang}/learn/courses/ca-on-g6-science/`);
  const res = await pg.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; const out = []; for (const a of document.querySelectorAll('main a[href*="sci-"][href$="/"]')) { a.scrollIntoView({ block: "center" }); const r = a.getBoundingClientRect(); const e = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); out.push([a.getAttribute("href").split("/").slice(-2, -1)[0], Math.round(r.y), Math.round(r.height), (e === a || a.contains(e)) ? "ok" : "COVERED by " + e?.className + " " + e?.tagName]); } return out; });
  const wide = await pg.evaluate(() => { const W = document.documentElement.clientWidth; const o = []; for (const el of document.querySelectorAll("body *")) { const r = el.getBoundingClientRect(); if (r.right > W + 1 && r.width > 0) o.push(el.tagName + "." + (el.className || "").toString().slice(0, 30) + " right=" + Math.round(r.right)); } return o.slice(0, 5); });
  console.log("overflowers:", JSON.stringify(wide));
  console.log(lang, "js=" + js, "covered:", JSON.stringify(res.filter((x) => x[3] !== "ok")), "links:", res.length, "scrollW:", await pg.evaluate(() => document.documentElement.scrollWidth), "header position:", await pg.evaluate(() => getComputedStyle(document.querySelector("header.site")).position));
  await c.close();
}
await b.close(); s.close();
