// Statement 6: canon-first is a test. Runs the fixed query set (scripts/fable/search-queries.json) against a built site,
// through the site's own search page, exactly as a visitor would: it opens /<lang>/search/?q=<query>, lets the page
// expand spellings and query its Pagefind index, and reads the first result. The first result must be the canon record.
//
//   node scripts/fable/o06_search.mjs <base-url-of-a-built-site>
//
// A built site is one with Pagefind indexes: `npm run build` then `npm --prefix site run preview`, the UAT deploy, or
// production. The dev server has no index and cannot run this test. The oracle states which site it measured: a run
// against production measures what visitors see today (the baseline deploy), never this branch.
import { chromium } from "playwright";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const base = (process.argv[2] ?? "").replace(/\/$/, "");
if (!base) { console.error("usage: node scripts/fable/o06_search.mjs <base-url-of-a-built-site>"); process.exit(2); }
const { queries } = JSON.parse(readFileSync(join(here, "search-queries.json"), "utf8"));
const SEG = { question: "questions", exhibit: "exhibits" };
const pathOf = (lang, id) => { const [c, s] = id.split("/"); return `/${lang}/${SEG[c] ?? c}/${s}/`; };
const head = execSync("git rev-parse HEAD", { cwd: here, encoding: "utf8" }).trim();

console.log("ORACLE 06: canon-first search, a fixed query set against a built site (statement 6)");
console.log("file: scripts/fable/o06_search.mjs (queries: scripts/fable/search-queries.json)");
console.log(`HEAD: ${head}`);
console.log(`site measured: ${base}`);
let deploy = null;
try { deploy = await (await fetch(`${base}/api/v1/meta/deploy.json`)).json(); } catch { /* a local preview has no deploy stamp */ }
console.log(`that site's own deploy stamp: ${deploy ? `commit ${deploy.commit ?? deploy.sha ?? "?"}, version ${deploy.version ?? "?"}, deployed ${deploy.deployed_at ?? "?"}` : "none (a local build)"}`);
console.log("-".repeat(78));
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
let pass = 0, fail = 0, broken = 0;
for (const { lang, q, expect } of queries) {
  const page = await ctx.newPage();
  let first = null, err = "";
  try {
    await page.goto(`${base}/${lang}/search/?q=${encodeURIComponent(q)}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    // the message line appears first ("searching"); a common name can take many seconds to rank, so wait for a result link
    await page.waitForSelector(".pagefind-ui__message", { timeout: 30000 });
    await page.waitForSelector(".pagefind-ui__result-link", { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(1500); // the page re-runs the search once its spelling shards arrive
    first = await page.evaluate(() => { const a = document.querySelector(".pagefind-ui__result-link"); return a ? new URL(a.href).pathname : null; });
  } catch (e) { err = String(e.message).split("\n")[0]; }
  await page.close();
  const want = expect.map((id) => pathOf(lang, id));
  const ok = first !== null && want.includes(first);
  if (err) broken++; else if (ok) pass++; else fail++;
  console.log(`[${err ? "ERR " : ok ? "PASS" : "FAIL"}] ${lang} "${q}"  first result: ${first ?? (err || "none")}${ok ? "" : `  expected: ${want.join(" or ")}`}`);
}
await browser.close();
console.log("-".repeat(78));
console.log(`${pass} of ${queries.length} queries return the canon record first; ${fail} do not; ${broken} could not be run`);
const green = pass === queries.length;
console.log(green ? `RESULT: GREEN (${pass} of ${queries.length}) for the site measured: ${base}` : `RESULT: NOT-GREEN (${fail + broken} of ${queries.length} queries do not return the canon record first) for the site measured: ${base}`);
process.exit(green ? 0 : 1);
