// Diagnostic for ar + JavaScript disabled: does tapping a lesson link navigate? mobile-emulated vs plain 390px viewport; click vs keyboard Enter.
import http from "node:http"; import fs from "node:fs"; import path from "node:path"; import { chromium } from "playwright";
const D = process.env.DIST;
const s = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p.endsWith("/")) p += "index.html"; for (const root of [D, "site/public"]) { const f = path.join(root, p); if (fs.existsSync(f) && fs.statSync(f).isFile()) { r.writeHead(200, { "content-type": p.endsWith(".html") ? "text/html" : p.endsWith(".js") ? "text/javascript" : "application/octet-stream" }); return fs.createReadStream(f).pipe(r); } } r.writeHead(404); r.end(); }).listen(0);
const b = await chromium.launch(); const base = `http://127.0.0.1:${s.address().port}`;
for (const [name, opts] of [["mobile+touch", { isMobile: true, hasTouch: true }], ["desktop-390", {}]]) for (const lang of ["ar", "en"]) {
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false, ...opts }); const pg = await c.newPage();
  await pg.goto(`${base}/${lang}/learn/courses/ca-on-g6-science/`);
  const l = pg.locator('main a[href$="ca-on-g6-sci-bio-1/"]').first();
  await l.evaluate((el) => { document.documentElement.style.scrollBehavior = "auto"; el.scrollIntoView({ block: "center", behavior: "instant" }); });
  const box = await l.boundingBox(); const info = await pg.evaluate(() => ({ iw: innerWidth, cw: document.documentElement.clientWidth, sw: document.documentElement.scrollWidth, sx: scrollX, vv: visualViewport?.width, dir: document.dir }));
  let res = "";
  try { await l.click({ timeout: 4000, noWaitAfter: true }); await pg.waitForTimeout(1500); res = "click -> " + pg.url(); } catch (e) { res = "click ERR " + String(e).split("\n").slice(0, 3).join(" | ").slice(0, 300); }
  console.log(name, lang, JSON.stringify({ box, ...info }), res);
  if (!pg.url().includes("bio-1")) { await l.focus(); await pg.keyboard.press("Enter"); await pg.waitForTimeout(1500); console.log("   keyboard Enter ->", pg.url()); }
  await c.close();
}
await b.close(); s.close();
