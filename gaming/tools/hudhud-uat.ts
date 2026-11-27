// Hudhud on a games host (UAT, or production later): the page as a visitor gets it, under the host's own headers.
// In each language asked for it opens the Atlas, starts the quest, plays it to the end through the game's own
// commands, goes back to the Atlas, and reports console errors, content-security-policy violations, failed or
// foreign requests, the music, the labels a prototype must show, and what the host says it is serving.
// Usage: npx tsx --tsconfig tsconfig.json tools/hudhud-uat.ts <base, e.g. https://uat-games.islam.museum> <out dir> [langs, comma separated]
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { leaveOpening } from "./hudhud-opening";

const [base, outArg, langsArg = "en,ar"] = process.argv.slice(2);
if (!base || !outArg) throw new Error("usage: hudhud-uat.ts <base> <out dir> [langs]");
const out = resolve(outArg);
mkdirSync(out, { recursive: true });
const channel = (await (await fetch(`${base}/_channel`)).json()) as { current: string; commit: string };
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--window-size=1500,950", "--force-device-scale-factor=1"] });
const pages: Record<string, unknown>[] = [];
const problems: string[] = [];
for (const lang of langsArg.split(",")) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 810 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors: string[] = [];
  const requests: { url: string; status: number }[] = [];
  await page.addInitScript("window.__csp = []; document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.violatedDirective + ' ' + e.blockedURI));");
  page.on("pageerror", (e) => errors.push(`page error: ${e}`));
  page.on("console", (m) => m.type() === "error" && errors.push(`console: ${m.text()}`));
  page.on("requestfailed", (r) => errors.push(`request failed: ${r.url()} ${r.failure()?.errorText ?? ""}`));
  page.on("response", (r) => requests.push({ url: r.url(), status: r.status() }));
  const ev = <T>(js: string) => page.evaluate(js) as Promise<T>;
  const wait = async (js: string, ms: number) => {
    for (const end = Date.now() + ms; !(await ev<boolean>(js)); ) {
      if (Date.now() > end) return false;
      await page.waitForTimeout(150);
    }
    return true;
  };
  let pauseProblem: string | null = null;
  const t0 = Date.now();
  const response = await page.goto(`${base}/hudhud/?lang=${lang}&fresh=1`);
  const headers = response?.headers() ?? {};
  if (!(await wait("Boolean(window.__HH__ && (window.__HH__.ready || window.__HH__.error))", 30000))) errors.push("the page did not start in 30 seconds");
  const readyMs = Date.now() - t0;
  // A build with the opening story shows it first; a visitor skips it by its button. An older build has none.
  await leaveOpening(page);
  const atlas = await ev<Record<string, unknown>>("({ worlds: document.querySelectorAll('.hub .world').length, pages: document.querySelectorAll('.hub .world li').length, open: document.querySelectorAll('.hub .world li.open').length, proto: !!document.querySelector('header .chip.proto'), title: document.title, dir: document.documentElement.dir, music: document.querySelectorAll('details.music').length })");
  await page.screenshot({ path: resolve(out, `uat-hudhud-${lang}-atlas.png`) });
  await page.locator(".hub button.primary").click();
  const opened = await wait("window.__HH__.where() !== null", 30000);
  await page.waitForTimeout(1500);
  const info = opened ? await ev<Record<string, unknown>>("(() => { const i = window.__HH__.info(); return { renderer: i.renderer, textures: i.textures, canvas: i.canvas }; })()") : null;
  await page.screenshot({ path: resolve(out, `uat-hudhud-${lang}-scene.png`) });
  if (opened) {
    // The fault an independent player found on a host: pause, go on from the toolbar, and the game must still answer.
    await ev("window.__HH__.command({type:'skip'})");
    const pauseBtn = page.locator("header button").nth(-2);
    await pauseBtn.dispatchEvent("click");
    await pauseBtn.dispatchEvent("click");
    await page.locator(".words li button").first().click({ timeout: 5000 }).catch(() => undefined);
    await page.waitForTimeout(150);
    if ((await ev<number>("window.__HH__.state().turns")) !== 1) pauseProblem = "after pausing and going on from the toolbar, the list did not turn a mirror";
    await ev("for (const id of ['mirror-c','mirror-e']) window.__HH__.touch(id);");
    await page.waitForTimeout(1800);
    await page.screenshot({ path: resolve(out, `uat-hudhud-${lang}-lit.png`) });
    await ev("window.__HH__.command({type:'skip'}); window.__HH__.touch('page');");
    await page.waitForTimeout(500);
  }
  const end = await ev<Record<string, unknown>>("({ done: window.__HH__.state().done, review: [...document.querySelectorAll('.sheet .pending, .door-panel .pending')].map((p) => p.textContent.slice(0, 90)), links: [...document.querySelectorAll('.sheet .note a, .door-panel .note a')].map((a) => a.href) })");
  await page.screenshot({ path: resolve(out, `uat-hudhud-${lang}-results.png`) });
  // The second quest, where the host has it: back to the Atlas, the elephant clock put in order and set going.
  let clock: { done: boolean; moves: number; par: number; pending: boolean; links: number } | null = null;
  if (await ev<boolean>("typeof window.__HH__.startClock === 'function'")) {
    await ev("document.querySelectorAll('.sheet').forEach((x) => x.close && x.close()); window.__HH__.toAtlas(); window.__HH__.startClock();");
    await ev("['float','falcon','dragon','vessel','bowl'].forEach((part, place) => window.__HH__.clockCommand({ type: 'put', place, part })); window.__HH__.clockCommand({ type: 'go' });");
    await wait("window.__HH__.clock() && window.__HH__.clock().done && !window.__HH__.clock().busy", 15000);
    clock = await ev("({ done: window.__HH__.clock().done, moves: window.__HH__.clock().moves, par: window.__HH__.clock().par, pending: !!document.querySelector('.bench .results .pending'), links: document.querySelectorAll('.bench .results .note a').length })");
    await page.screenshot({ path: resolve(out, `uat-hudhud-${lang}-clock.png`), fullPage: true });
  }
  // A track is asked for after a press, if the host has the music.
  const tracks = requests.filter((r) => r.url.endsWith(".m4a")).map((r) => r.status);
  const csp = await ev<string[]>("window.__csp");
  const origin = new URL(base).origin;
  const foreign = requests.filter((r) => !r.url.startsWith(origin) && !r.url.startsWith("data:") && !r.url.startsWith("blob:")).map((r) => r.url);
  const bad = requests.filter((r) => r.status >= 400).map((r) => `${r.status} ${r.url}`);
  const mine: string[] = [...errors, ...csp.map((v) => `content security policy: ${v}`), ...foreign.map((u) => `asked another origin: ${u}`), ...bad];
  if (atlas.worlds !== 10 || atlas.pages !== 50 || atlas.open !== (clock ? 2 : 1)) mine.push(`the Atlas shows ${atlas.worlds} worlds, ${atlas.pages} pages, ${atlas.open} open`);
  if (!atlas.proto) mine.push("the prototype label is not shown");
  if ((lang === "ar" || lang === "ur") !== (atlas.dir === "rtl")) mine.push(`direction is ${atlas.dir}`);
  if (pauseProblem) mine.push(pauseProblem);
  if (!opened) mine.push("the scene did not open");
  else if (info?.renderer !== "webgl") mine.push(`drawn with ${info?.renderer}`);
  if (!end.done) mine.push("the quest did not finish");
  if (clock && !(clock.done && clock.pending && clock.links === 2)) mine.push(`the elephant clock: ${JSON.stringify(clock)}`);
  if (!(end.review as string[]).length) mine.push("the results do not carry the mark of historical review");
  if (!headers["content-security-policy"]?.startsWith("default-src 'none'")) mine.push("the page came without the content security policy");
  pages.push({ lang, readyMs, atlas, info, end, clock, requests: requests.length, tracks, robots: headers["x-robots-tag"] ?? null, problems: mine });
  for (const m of mine) problems.push(`${lang}: ${m}`);
  await ctx.close();
}
await browser.close();
const report = { base, release: channel.current, commit: channel.commit, ran: new Date().toISOString(), browser: "chrome", pages, problems };
writeFileSync(resolve(out, "hudhud-uat.json"), `${JSON.stringify(report, null, 1)}\n`);
console.log(JSON.stringify(report, null, 1));
if (problems.length) process.exit(1);
