// Captures the Golden Age's authored public buildings in a policy-grown district, in real Chrome, with the
// renderer's own counts. Evidence for the buildings work, not a gate.
// Usage: npx tsx --tsconfig tsconfig.json tools/golden-age-buildings-shot.ts <out dir> [seasons=20]
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { Rng } from "@im/kernel/prng";
import { makePolicies } from "../games/golden-age/src/policies";
import { step, type Command, type State } from "../games/golden-age/src/rules";
import { FAILING_CANAL } from "../games/golden-age/src/scenarios";
import { serveWorkspace } from "./serve";

const [outArg, seasonsArg = "20"] = process.argv.slice(2);
if (!outArg) throw new Error("usage: golden-age-buildings-shot.ts <out dir> [seasons]");
const out = resolve(outArg);
mkdirSync(out, { recursive: true });
const SEED = 3;
const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--window-size=1960,1160", "--window-position=0,0", "--force-device-scale-factor=1"] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })).newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(String(e)));
type Hook = {
  ready?: boolean;
  state(): State;
  dispatch(c: Command): void;
  stage?: { info(): { drawCalls: number; triangles: number }; setPose(p: unknown): void; renderer?: { modelFailures?: string[] } };
};
const ga = <T>(fn: (h: Hook, arg: never) => T, arg?: unknown): Promise<T> => page.evaluate(([f, a]) => (0, eval)(`(${f})`)((window as unknown as { __GA__: Hook }).__GA__, a), [fn.toString(), arg] as const) as Promise<T>;

await page.goto(`${served.base}/games/golden-age/index.html?lang=en&music=off&q=high&seed=${SEED}`);
await page.waitForFunction(() => (window as unknown as { __GA__?: { ready?: boolean } }).__GA__?.ready, undefined, { timeout: 60000 });
const begin = page.locator("#brief-begin");
if (await begin.count()) await begin.click();
await page.waitForTimeout(800);
const policy = makePolicies(step).find((p) => p.name === "balanced")!;
const rng = new Rng(`lab:balanced:${SEED}`);
let cur = (await ga((h) => h.state())) as State;
const startSeason = cur.season;
while (cur.outcome === "playing" && cur.season - startSeason < Number(seasonsArg)) {
  for (const cmd of policy.plan(FAILING_CANAL, cur, rng)) {
    await ga((h, c: Command) => h.dispatch(c), cmd);
  }
  await page.waitForTimeout(120);
  cur = (await ga((h) => h.state())) as State;
}
await page.waitForTimeout(3000);
const poses: Record<string, { tx: number; tz: number; yaw: number; pitch: number; distance: number }> = {
  overview: { tx: 0, tz: -118, yaw: 0, pitch: 0.9, distance: 540 },
  close: { tx: -88, tz: -60, yaw: -0.5, pitch: 0.52, distance: 130 },
  market: { tx: -66, tz: -66, yaw: 2.6, pitch: 0.45, distance: 95 },
  river: { tx: -100, tz: -20, yaw: 1.1, pitch: 0.44, distance: 170 },
};
const views: Record<string, unknown> = {};
for (const [name, pose] of Object.entries(poses)) {
  await ga((h, p) => h.stage?.setPose(p), pose);
  await page.waitForTimeout(1100);
  views[name] = await ga((h) => h.stage?.info());
  await page.screenshot({ path: resolve(out, `${name}.png`) });
}
const failures = await ga((h) => h.stage?.renderer?.modelFailures ?? []);
const report = { measured: new Date().toISOString(), seed: SEED, seasonsPlayed: cur.season - startSeason, outcome: cur.outcome, households: cur.households, views, modelFailures: failures, pageErrors: errors };
writeFileSync(resolve(out, "report.json"), `${JSON.stringify(report, null, 1)}\n`);
await browser.close();
await served.close();
console.log(JSON.stringify(report, null, 1));
