// Plays The Golden Age in real Chrome, in a chosen language, and keeps the screenshots and the numbers.
// It is a functional check: the game starts, a canal can be dug and a building placed with the mouse, with the
// keyboard alone and from the plan view, a refused action changes nothing, undo works, a season ends, the game
// survives a reload, plays without 3D, plays its music after a click (the browser is muted), and a whole campaign
// can be driven through the screen to its end. It is not a judgement of whether the game is any good: every move
// here is the author's script, not a person's.
// Usage: npx tsx --tsconfig tsconfig.json tools/golden-age-play.ts <out dir> [lang=en] [campaign=0|1]
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type Page } from "playwright-core";
import { Rng } from "@im/kernel/prng";
import { makePolicies } from "../games/golden-age/src/policies";
import { plotOf, step, type Command, type State } from "../games/golden-age/src/rules";
import { FAILING_CANAL } from "../games/golden-age/src/scenarios";
import { serveWorkspace } from "./serve";

const [outArg, lang = "en", campaign = "0"] = process.argv.slice(2);
if (!outArg) throw new Error("usage: golden-age-play.ts <out dir> [lang] [campaign]");
const out = resolve(outArg);
mkdirSync(out, { recursive: true });
const SEED = 3;
const W = 1920;
const H = 1080;

const served = await serveWorkspace();
// The browser is muted, so the music check makes no sound on the machine that runs it.
const browser = await chromium.launch({ channel: "chrome", headless: false, args: [`--window-size=${W},${H + 90}`, "--window-position=0,0", "--force-device-scale-factor=1", "--mute-audio"] });
const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const page = await context.newPage();
const errors: string[] = [];
const audioRequests: string[] = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("response", (r) => {
  if (r.url().endsWith(".m4a")) audioRequests.push(`${r.status()} ${r.url().split("/").pop()}`);
});
const url = (extra = "") => `${served.base}/games/golden-age/index.html?lang=${lang}&music=off${extra}`;
const shot = (name: string) => page.screenshot({ path: resolve(out, `golden-age-${lang}-${name}.png`) });
const fail = async (why: string): Promise<never> => {
  await shot("failure");
  await browser.close();
  await served.close();
  throw new Error(`${why}\nconsole: ${errors.join(" | ")}`);
};
type Hook = { ready?: boolean; no3d?: string; state(): State; tool(): string; dispatch(c: Command): void; screenOfPlot(p: number): [number, number] | null; screenOfLink(a: number, b: number): [number, number] | null; stage?: { takeFrameStats(): unknown; info(): unknown; setPose(p: unknown): void }; music: { state(): { on: boolean; playing: boolean; available: boolean; track: { title: string } } } };
const ga = <T>(fn: (h: Hook, arg: never) => T, arg?: unknown): Promise<T> => page.evaluate(([f, a]) => (0, eval)(`(${f})`)((window as unknown as { __GA__: Hook }).__GA__, a), [fn.toString(), arg] as const) as Promise<T>;
const state = () => ga((h) => h.state());
const ready = async (p: Page = page) => {
  await p.waitForFunction(() => (window as unknown as { __GA__?: { ready?: boolean; error?: string } }).__GA__?.ready || (window as unknown as { __GA__?: { error?: string } }).__GA__?.error, undefined, { timeout: 90000 });
  const err = await p.evaluate(() => (window as unknown as { __GA__?: { error?: string } }).__GA__?.error);
  if (err) await fail(`the page failed to start: ${err}`);
};
const settle = (ms = 500) => page.waitForTimeout(ms);
const log: Record<string, unknown> = { lang, seed: SEED, viewport: [W, H] };

// ---- 1. A new game ---------------------------------------------------------------------------------------------------
await page.goto(url(`&seed=${SEED}`));
await ready();
const dir = await page.evaluate(() => document.documentElement.dir);
if ((lang === "ar" || lang === "ur") !== (dir === "rtl")) await fail(`direction is ${dir} for ${lang}`);
const sideBox = await page.locator("#side").boundingBox();
if (!sideBox) await fail("the side panel is missing");
// The panel is at the start edge: left for left-to-right languages, right for right-to-left ones.
if (dir === "rtl" ? sideBox!.x < W / 2 : sideBox!.x > W / 2) await fail(`the side panel is on the wrong side for ${dir}`);
const missing = await page.evaluate(() => [...document.querySelectorAll("#hud *")].filter((n) => n.children.length === 0 && /^[a-z]+(_[a-z0-9-]+)+$/.test(n.textContent ?? "")).map((n) => n.textContent));
if (missing.length) await fail(`untranslated keys on screen: ${missing.join(", ")}`);
await settle(1200);
await shot("1-start");
const s0 = await state();
if (s0.season !== 0 || s0.treasury !== 130 || s0.canals.length !== 2) await fail("the new game is not the scenario's start");

// ---- 2. The first thirty seconds: dig a canal link with the mouse and watch water arrive -----------------------------------
await page.keyboard.press("c");
const link1 = await ga((h, [a, b]: [number, number]) => h.screenOfLink(a, b), [plotOf(1, 1), plotOf(2, 1)]);
if (!link1) await fail("the canal link is not on screen");
await page.mouse.move(link1![0], link1![1]);
await settle(300);
await shot("2-canal-aim");
await page.mouse.click(link1![0], link1![1]);
await settle(450);
await shot("3-canal-filling");
await settle(1600);
const s1 = await state();
if (s1.canals.length !== 3 || s1.treasury !== 118) await fail(`digging by mouse did not work: ${s1.canals.length} links, treasury ${s1.treasury}`);
// A link that starts in dry ground is refused and changes nothing.
const dry = await ga((h, [a, b]: [number, number]) => h.screenOfLink(a, b), [plotOf(5, 3), plotOf(6, 3)]);
await page.mouse.click(dry![0], dry![1]);
await settle(300);
if ((await state()).canals.length !== 3) await fail("a canal was dug in dry ground");

// ---- 3. Build with the mouse, be refused on a taken plot, undo ---------------------------------------------------------------
await page.keyboard.press("3");
if ((await ga((h) => h.tool())) !== "market") await fail("the 3 key did not choose the market");
const at = await ga((h, p: number) => h.screenOfPlot(p), plotOf(3, 2));
await page.mouse.move(at![0], at![1]);
await settle(300);
await shot("4-market-reach");
await page.mouse.click(at![0], at![1]);
await settle(400);
let s = await state();
if (s.plots[plotOf(3, 2)] !== "market" || s.treasury !== 78) await fail("building by mouse did not work");
await page.mouse.click(at![0], at![1]);
await settle(200);
if ((await state()).treasury !== 78) await fail("a taken plot was built on again");
await page.keyboard.press("u");
await settle(300);
s = await state();
if (s.plots[plotOf(3, 2)] !== null || s.treasury !== 118) await fail("undo did not take the market back");
await page.mouse.click(at![0], at![1]);
await settle(300);

// ---- 4. Keyboard alone: move the cursor, dig with Shift and an arrow, build with Enter -----------------------------------
await ga((h) => h.stage?.setPose({ tx: -66, tz: -88, yaw: 0, pitch: 0.75, distance: 360 }));
await page.focus("#board");
await page.keyboard.press("c");
// The cursor is on the market just built (D3). Walk to C2, which the mouse joined to the canal, and dig east from it.
await page.keyboard.press("ArrowLeft");
await page.keyboard.press("ArrowDown");
await page.keyboard.press("Shift+ArrowRight");
await settle(1700);
s = await state();
if (s.canals.length !== 4) await fail(`digging by keyboard did not work: ${s.canals.length} links`);
await page.keyboard.press("5");
await page.keyboard.press("ArrowUp");
await page.keyboard.press("ArrowUp");
await page.keyboard.press("Enter");
await settle(400);
s = await state();
const schoolAt = s.plots.indexOf("school");
if (schoolAt < 0) await fail("building by keyboard did not work");
await shot("5-keyboard");
log.keyboard = { canals: s.canals.length, schoolAt };

// ---- 5. End the season, read the ledger, reload ------------------------------------------------------------------------------
await page.locator("#end-season").click();
await settle(600);
s = await state();
if (s.season !== 1 || !s.last) await fail("the season did not end");
await page.locator("#tab-ledger").click();
await settle(200);
await shot("6-ledger");
await page.locator("#tab-research").click();
const firstResearch = page.locator(".research.open button").first();
if (await firstResearch.count()) await firstResearch.click();
await settle(200);
await shot("7-research");
const before = await state();
await page.goto(url());
await ready();
const after = await state();
if (after.season !== before.season || after.treasury !== before.treasury || after.canals.length !== before.canals.length || after.research !== before.research) await fail("the game did not come back after a reload");

// ---- 6. The plan view: the same game as buttons -----------------------------------------------------------------------------
await page.keyboard.press("m");
await page.waitForSelector("#pgrid");
await page.keyboard.press("1");
const free = plotOf(5, 1);
await page.locator(`#plot-${free}`).click();
await settle(300);
s = await state();
if (s.plots[free] !== "house") await fail("building from the plan did not work");
const planLink = page.locator(".plink.ok").first();
const canalsBefore = s.canals.length;
if (await planLink.count()) {
  await planLink.click();
  await settle(300);
  if ((await state()).canals.length !== canalsBefore + 1) await fail("digging from the plan did not work");
}
await shot("8-plan");
await page.keyboard.press("m");
log.afterPlan = { season: s.season, canals: (await state()).canals.length, treasury: (await state()).treasury };

// ---- 7. The saved game is not broken by rubbish in storage ---------------------------------------------------------------------
await page.evaluate(() => localStorage.setItem("im.golden-age.save.v1", "{not json"));
await page.goto(url());
await ready();
const kept = await page.evaluate(() => localStorage.getItem("im.golden-age.save.v1.unreadable"));
if (kept !== "{not json") await fail("an unreadable save was not set aside");
if ((await state()).season !== 0) await fail("after an unreadable save the game did not start afresh");

// ---- 8. Without 3D the plan is the whole game -------------------------------------------------------------------------------------
await page.goto(url(`&seed=${SEED}&no3d=1`));
await ready();
if (!(await ga((h) => h.no3d))) await fail("the no-3D path did not engage");
await page.waitForSelector("#pgrid");
await page.locator(".plink.ok").first().click();
await page.keyboard.press("2");
await page.locator(`#plot-${plotOf(0, 1)}`).click();
await settle(200);
s = await state();
if (s.canals.length !== 3 || s.plots[plotOf(0, 1)] !== "farm") await fail("the game cannot be played from the plan alone");
await page.locator("#end-season").click();
await settle(200);
if ((await state()).season !== 1) await fail("the season could not be ended without 3D");
await shot("9-no-3d");

// ---- 9. Music: silent until a click, then the suite plays (the browser itself is muted) ------------------------------------
await page.evaluate(() => localStorage.removeItem("im.play.audio.v1"));
await page.goto(`${served.base}/games/golden-age/index.html?lang=${lang}&seed=${SEED}`);
await ready();
await settle(800);
const quiet = await ga((h) => h.music.state());
if (quiet.playing) await fail("music played before any click");
await page.locator("#tab-ledger").click();
await settle(2600);
const sounding = await ga((h) => h.music.state());
log.music = { beforeClick: quiet.playing, afterClick: sounding.playing, available: sounding.available, track: sounding.track.title, requests: audioRequests.slice(0, 3) };
if (sounding.available && !sounding.playing) await fail("music did not start after a click");
await page.locator("details.music summary").click();
await settle(300);
await shot("10-music");
if (sounding.available) {
  await page.locator(".music-toggle").click();
  await settle(300);
  if ((await ga((h) => h.music.state())).playing) await fail("the music did not stop when turned off");
}
await page.locator("details.music summary").click();

// ---- 10. A whole campaign through the screen, and frame times while it runs ----------------------------------------------------
if (campaign === "1") {
  await page.goto(url(`&seed=${SEED}`));
  await ready();
  await settle(1500);
  await ga((h) => h.stage?.takeFrameStats());
  const policy = makePolicies(step).find((p) => p.name === "balanced")!;
  const rng = new Rng(`lab:balanced:${SEED}`);
  let cur = await state();
  let commands = 0;
  for (let guard = 0; cur.outcome === "playing" && guard < 60; guard++) {
    for (const cmd of policy.plan(FAILING_CANAL, cur, rng)) {
      await ga((h, c: Command) => h.dispatch(c), cmd);
      commands++;
    }
    await settle(350);
    cur = await state();
    if (cur.season === 8) await shot("11-year-3");
    if (cur.season === 16) await shot("12-year-5");
  }
  await settle(600);
  const frames = await ga((h) => h.stage?.takeFrameStats());
  const info = await ga((h) => h.stage?.info());
  if (cur.outcome === "playing") await fail("the campaign did not end");
  if (!(await page.locator("#outcome").evaluate((d) => (d as HTMLDialogElement).open))) await fail("the outcome was not shown");
  await shot("13-outcome");
  await page.locator("#outcome-close").click();
  await ga((h) => h.stage?.setPose({ tx: -30, tz: -110, yaw: 0.45, pitch: 0.62, distance: 420 }));
  await settle(900);
  await shot("14-final-city");
  await ga((h) => h.stage?.setPose({ tx: -60, tz: -70, yaw: -0.55, pitch: 0.5, distance: 150 }));
  await settle(900);
  await shot("15-final-close");
  log.campaign = { policy: "balanced", commands, outcome: cur.outcome, seasons: cur.season, households: cur.households, welfare: cur.welfare, treasury: cur.treasury, frames, info };
}

await browser.close();
await served.close();
log.consoleErrors = errors;
writeFileSync(resolve(out, `golden-age-${lang}.json`), `${JSON.stringify(log, null, 1)}\n`);
if (errors.length) throw new Error(`console errors:\n${errors.join("\n")}`);
console.log(JSON.stringify(log));
