// End-to-end check of the Graph Explorer's controls (audit of 13 November 2026, S25), so a dead button cannot come back
// unnoticed. Drives a built site the way a visitor does and fails on the first control that does nothing.
//   node scripts/audit/e2e-graph.mjs <base-url-of-a-built-site>      (npm run build, then npm --prefix site run preview)
// The site must serve /api/v1/graph/** and /api/v1/meta/search-canon.<lang>.json (a full build does).
import { chromium } from "playwright";
const base = (process.argv[2] ?? "").replace(/\/$/, "");
if (!base) { console.error("usage: node scripts/audit/e2e-graph.mjs <base-url-of-a-built-site>"); process.exit(2); }
const checks = [];
const check = (name, ok, detail = "") => { checks.push(ok); console.log(`[${ok ? "PASS" : "FAIL"}] ${name}${detail ? `: ${detail}` : ""}`); };
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
const centre = () => page.locator(".gx-node.hop-0").getAttribute("data-id");
await page.goto(`${base}/en/graph/`, { waitUntil: "domcontentloaded" });
await page.waitForSelector(".gx-node.hop-0", { timeout: 20000 });
const start = await centre();
check("a constellation renders on arrival", !!start, String(start));

await page.fill("#gx-from", "Saladin");
await page.waitForSelector("#gx-suggest button", { timeout: 15000 }).catch(() => {});
check("typing a name offers suggestions", (await page.locator("#gx-suggest button").count()) > 0);
await page.press("#gx-from", "Enter");
await page.waitForFunction((s) => document.querySelector(".gx-node.hop-0")?.getAttribute("data-id") !== s, start, { timeout: 15000 }).catch(() => {});
const named = await centre();
check("a typed name becomes the centre", named === "person/salah-al-din-yusuf-ibn-ayyub", String(named));

const star = page.locator(".gx-node.hop-1").first();
const starId = await star.getAttribute("data-id");
await star.click();
await page.waitForFunction((s) => document.querySelector(".gx-node.hop-0")?.getAttribute("data-id") === s, starId, { timeout: 15000 }).catch(() => {});
check("clicking a star makes it the centre", (await centre()) === starId, String(starId));

check("the centres visited are shown", (await page.locator("[data-gx-trail-list] li").count()) >= 3 && !(await page.locator("[data-gx-trail]").getAttribute("hidden")));
await page.locator("[data-gx-trail-list] button").first().click();
await page.waitForFunction((s) => document.querySelector(".gx-node.hop-0")?.getAttribute("data-id") === s, start, { timeout: 15000 }).catch(() => {});
check("the trail leads back", (await centre()) === start);

const btn = page.locator("[data-recentre]").first();
const target = await btn.getAttribute("data-recentre");
await btn.click();
await page.waitForFunction((s) => document.querySelector(".gx-node.hop-0")?.getAttribute("data-id") === s, target, { timeout: 15000 }).catch(() => {});
check("\"Make it the centre\" in the list re-centres", (await centre()) === target, String(target));

await page.locator("[data-filter]:not([disabled])").first().click();
check("a filter in force is badged beside the search box", !(await page.locator("[data-gx-badge]").getAttribute("hidden")));
await page.locator("[data-gx-badge-clear]").click();
check("one click clears the filter", (await page.locator("[data-gx-badge]").getAttribute("hidden")) !== null);

await page.fill("#gx-from", "zzzz nobody at all");
await page.press("#gx-from", "Enter");
await page.waitForFunction(() => { const m = document.querySelector("[data-gx-msg]"); return m && !m.hidden && /zzzz/.test(m.textContent ?? ""); }, null, { timeout: 15000 }).catch(() => {});
const box = await page.locator("[data-gx-msg]").boundingBox();
check("an unknown name is reported at the control, in view", !!box && box.y > 0 && box.y < 900, box ? `y=${Math.round(box.y)}` : "no message");
check("no script error on the page", errors.length === 0, errors.slice(0, 2).join(" | "));
await browser.close();
const failed = checks.filter((c) => !c).length;
console.log(failed ? `RESULT: NOT-GREEN (${failed} of ${checks.length} checks failed) for ${base}` : `RESULT: GREEN (${checks.length} checks) for ${base}`);
process.exit(failed ? 1 : 0);
