// Measures the renderer's draw calls in The Golden Age on a fixed developed district, in fixed poses, on High.
// The district is grown by the balanced policy for a fixed number of seasons, so the measurement before and after
// a change to the renderer is of the same picture. It measures this machine and passes no gate.
// Usage: npx tsx --tsconfig tsconfig.json tools/golden-age-drawcalls.ts [out.json] [seasons=20]
import { writeFileSync } from "node:fs";
import { chromium } from "playwright-core";
import { Rng } from "@im/kernel/prng";
import { makePolicies } from "../games/golden-age/src/policies";
import { step, type Command, type State } from "../games/golden-age/src/rules";
import { FAILING_CANAL } from "../games/golden-age/src/scenarios";
import { serveWorkspace } from "./serve";

const [outFile, seasonsArg = "20"] = process.argv.slice(2);
const SEED = 3;
const TARGET_SEASONS = Number(seasonsArg);
const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--window-size=1960,1160", "--window-position=0,0", "--force-device-scale-factor=1"] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })).newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(String(e)));
type Hook = { ready?: boolean; state(): State; dispatch(c: Command): void; stage?: { info(): { drawCalls: number; triangles: number }; setPose(p: unknown): void } };
const ga = <T>(fn: (h: Hook, arg: never) => T, arg?: unknown): Promise<T> => page.evaluate(([f, a]) => (0, eval)(`(${f})`)((window as unknown as { __GA__: Hook }).__GA__, a), [fn.toString(), arg] as const) as Promise<T>;

await page.goto(`${served.base}/games/golden-age/index.html?lang=en&music=off&q=high&seed=${SEED}`);
await page.waitForFunction(() => (window as unknown as { __GA__?: { ready?: boolean } }).__GA__?.ready, undefined, { timeout: 60000 });
// The brief is dismissed the way a player does.
const start = page.locator("#brief-start");
if (await start.count()) await start.click();
await page.waitForTimeout(800);
const policy = makePolicies(step).find((p) => p.name === "balanced")!;
const rng = new Rng(`lab:balanced:${SEED}`);
let cur = (await ga((h) => h.state())) as State;
let commands = 0;
const startSeason = cur.season;
while (cur.outcome === "playing" && cur.season - startSeason < TARGET_SEASONS) {
  for (const cmd of policy.plan(FAILING_CANAL, cur, rng)) {
    await ga((h, c: Command) => h.dispatch(c), cmd);
    commands++;
  }
  await page.waitForTimeout(120);
  cur = (await ga((h) => h.state())) as State;
}
// Everything the renderer is still bringing in must be standing before the measurement.
await page.waitForTimeout(2500);
const poses: Record<string, { tx: number; tz: number; yaw: number; pitch: number; distance: number }> = {
  overview: { tx: 0, tz: -118, yaw: 0, pitch: 0.9, distance: 540 },
  close: { tx: -88, tz: -60, yaw: -0.5, pitch: 0.52, distance: 130 },
  start: { tx: -66, tz: -88, yaw: 0.32, pitch: 0.66, distance: 330 },
};
const views: Record<string, unknown> = {};
for (const [name, pose] of Object.entries(poses)) {
  await ga((h, p) => h.stage?.setPose(p), pose);
  await page.waitForTimeout(1100);
  views[name] = await ga((h) => h.stage?.info());
}
const report = {
  measured: new Date().toISOString(),
  machine: "this machine",
  seed: SEED,
  seasonsPlayed: cur.season - startSeason,
  commands,
  outcome: cur.outcome,
  households: cur.households,
  quality: "high",
  poses,
  views,
  pageErrors: errors,
  note: "Draw calls and triangles as the renderer reports them in three fixed poses over the same policy-grown district. Frame times are not measured here.",
};
await browser.close();
await served.close();
if (outFile) writeFileSync(outFile, `${JSON.stringify(report, null, 1)}\n`);
console.log(JSON.stringify(report, null, 1));
