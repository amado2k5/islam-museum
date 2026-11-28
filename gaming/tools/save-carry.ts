// Carries a player's saved games across a change of release on a deployed host, to see what a rollback or a new
// release does to them. "make" plays a little of each game in one browser profile of its own and keeps that
// profile's storage in a file. "check" opens the games again with that storage, on whatever release the host now
// serves, and says whether each game came back where it was left.
//
// It touches nobody's saved game: the profile is made here and lives only in the file. It writes nothing to the host.
// Usage: npx tsx --tsconfig tsconfig.json tools/save-carry.ts make|check [base] <storage file>
import { existsSync } from "node:fs";
import { chromium, type Page } from "playwright-core";
import { localBase } from "./local-host";

const [mode, baseArg, fileArg] = process.argv.slice(2);
// base: a local address; default the local host over dist/release (tools/local-host.ts); UAT and production are refused.
const { base, close: closeHost } = await localBase(fileArg ? baseArg : undefined);
const file = fileArg ?? baseArg;
if ((mode !== "make" && mode !== "check") || !file) throw new Error("usage: save-carry.ts make|check [base] <storage file>");
if (mode === "check" && !existsSync(file)) throw new Error(`no storage file at ${file}: run "make" first`);
const ATLAS_DATE = "2026-11-26";

const browser = await chromium.launch({ channel: process.env.BROWSER ?? "chrome", headless: false, args: ["--mute-audio", "--window-size=1500,1000", "--window-position=0,0"] });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...(mode === "check" ? { storageState: file } : {}) });
const errors: string[] = [];
const open = async (path: string): Promise<Page> => {
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(`${path}: ${String(e)}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`${path}: ${m.text()}`);
  });
  await page.goto(`${base}${path}`);
  return page;
};
const until = async (page: Page, expression: string, ms = 90_000) => {
  for (const end = Date.now() + ms; Date.now() < end; ) {
    if (await page.evaluate(expression)) return;
    await page.waitForTimeout(200);
  }
  throw new Error(`timed out waiting for ${expression}`);
};
const kept = (page: Page) => page.evaluate("Object.keys(localStorage).filter((k) => k.includes('unreadable') || k.includes('newer'))") as Promise<string[]>;
const pointer = (await (await fetch(`${base}/_channel`, { cache: "no-store" })).json()) as { current: string };
const report: Record<string, unknown> = { mode, base, release: pointer.current, ran: new Date().toISOString() };

// Granada: begin, let three days pass. Left on day 28 of the scenario's calendar.
{
  const page = await open("/granada/?lang=en&music=off&no3d=1");
  await until(page, "Boolean(window.__GR__ && window.__GR__.ready)");
  if (mode === "make") {
    await page.locator("#brief-start").click();
    await page.evaluate("window.__GR__.days(3)");
    await page.waitForTimeout(500);
  }
  report.granada = { day: await page.evaluate("window.__GR__.state().day"), saved: await page.evaluate("window.__GR__.saveOk()"), setAside: await kept(page) };
  await page.close();
}
// The Golden Age: end two seasons.
{
  const page = await open("/golden-age/?lang=en&music=off&no3d=1");
  await until(page, "Boolean(window.__GA__ && (window.__GA__.ready || window.__GA__.error || window.__GA__.no3d))");
  if (mode === "make") {
    await page.evaluate("(() => { window.__GA__.dispatch({ type: 'end-season' }); window.__GA__.dispatch({ type: 'end-season' }); })()");
    await page.waitForTimeout(500);
  }
  report.goldenAge = { season: await page.evaluate("window.__GA__.state().season"), treasury: await page.evaluate("window.__GA__.state().treasury"), setAside: await kept(page) };
  await page.close();
}
// Atlas: two rounds of one day's game.
{
  const page = await open(`/atlas/?lang=en&date=${ATLAS_DATE}&music=off&no3d=1`);
  await page.waitForSelector("#panel h2, .marks", { timeout: 60_000 });
  if (mode === "make") {
    for (const [lat, lon] of [["30", "40"], ["42.8", "74.3"]] as const) {
      await page.fill("#lat", lat);
      await page.fill("#lon", lon);
      await page.locator("#panel .field button").first().click();
      await page.locator("button.primary").click();
      await page.waitForSelector("#panel .big");
      await page.locator("button.primary").click();
      await page.waitForSelector("#panel h2");
    }
  }
  report.atlas = { roundsDone: await page.locator(".dot.done").count(), points: await page.evaluate(`(() => { const s = JSON.parse(localStorage.getItem('im.atlas.save.v1') || '{}'); const g = s.daily && s.daily['${ATLAS_DATE}']; return g ? g.results.map((r) => r.points) : null; })()`), setAside: await kept(page) };
  await page.close();
}
if (mode === "make") await context.storageState({ path: file });
await browser.close();
closeHost();
report.consoleErrors = errors;
console.log(JSON.stringify(report, null, 1));
if (errors.length) process.exit(1);
