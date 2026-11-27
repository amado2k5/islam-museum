// Soaks The Golden Age: the balanced policy plays on for a fixed number of minutes, so plots are built and rebuilt
// the whole time — the worst case the merged-static renderer's re-concatenation ever faces. Every half minute the
// renderer's own counts (draw calls, triangles, geometries and textures held) and the browser's heap and listeners
// are written down. The question it answers: does the district's constant rebuilding leak geometry, textures or
// memory, or do the counts level off? Evidence, not a gate: it measures this machine only.
// Usage: npx tsx --tsconfig tsconfig.json tools/golden-age-soak.ts <out dir> [minutes=10]
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { Rng } from "@im/kernel/prng";
import { makePolicies } from "../games/golden-age/src/policies";
import { step, type Command, type State } from "../games/golden-age/src/rules";
import { FAILING_CANAL } from "../games/golden-age/src/scenarios";
import { serveWorkspace } from "./serve";

const [outArg, minutesArg = "10"] = process.argv.slice(2);
if (!outArg) throw new Error("usage: golden-age-soak.ts <out dir> [minutes=10]");
const out = resolve(outArg);
mkdirSync(out, { recursive: true });
const SEED = 3;
const MINUTES = Number(minutesArg);
const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--window-size=1960,1160", "--window-position=0,0", "--force-device-scale-factor=1"] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })).newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(String(e)));
type Hook = {
  ready?: boolean;
  state(): State;
  dispatch(c: Command): void;
  counters?(): { heapMb: number | null; intervals: number; workers: number; listeners: number };
  stage?: { info(): { drawCalls: number; triangles: number; geometries: number | null; textures: number | null; modelFailures: string[] } };
};
const ga = <T>(fn: (h: Hook, arg: never) => T, arg?: unknown): Promise<T> => page.evaluate(([f, a]) => (0, eval)(`(${f})`)((window as unknown as { __GA__: Hook }).__GA__, a), [fn.toString(), arg] as const) as Promise<T>;

await page.goto(`${served.base}/games/golden-age/index.html?lang=en&music=off&q=high&seed=${SEED}&counters`);
await page.waitForFunction(() => (window as unknown as { __GA__?: { ready?: boolean } }).__GA__?.ready, undefined, { timeout: 60000 });
const begin = page.locator("#brief-begin");
if (await begin.count()) await begin.click();
await page.waitForTimeout(800);
const policy = makePolicies(step).find((p) => p.name === "balanced")!;
const rng = new Rng(`lab:soak:${SEED}`);
const sample = async (elapsed: number) => {
  const info = await ga((h) => h.stage?.info());
  const c = await ga((h) => h.counters?.() ?? { heapMb: null, intervals: -1, workers: -1, listeners: -1 });
  const st = await ga((h) => h.state());
  return { seconds: Math.round(elapsed), season: st.season, outcome: st.outcome, drawCalls: info?.drawCalls ?? -1, triangles: info?.triangles ?? -1, geometries: info?.geometries ?? null, textures: info?.textures ?? null, heapMb: c.heapMb, listeners: c.listeners, modelFailures: info?.modelFailures?.length ?? -1 };
};
const samples: unknown[] = [];
const started = Date.now();
let cur = (await ga((h) => h.state())) as State;
let commands = 0;
// The policy plays at a player's pace — one season about every twenty seconds — because scripted play wins the
// chapter in seconds and then builds nothing, which is no soak at all. When the chapter is won the building stops
// and the board renders on: the first minutes exercise the merge path with every construction, the rest are the
// steady state it settles into.
let lastSample = -30;
let seasonStarted = Date.now();
while ((Date.now() - started) / 60000 < MINUTES) {
  const elapsed = (Date.now() - started) / 1000;
  if (elapsed - lastSample >= 30) {
    samples.push(await sample(elapsed));
    lastSample = elapsed;
  }
  if (cur.outcome === "playing" && (Date.now() - seasonStarted) / 1000 >= 20) {
    seasonStarted = Date.now();
    for (const cmd of policy.plan(FAILING_CANAL, cur, rng)) {
      await ga((h, c: Command) => h.dispatch(c), cmd);
      commands++;
    }
  }
  await page.waitForTimeout(500);
  cur = (await ga((h) => h.state())) as State;
}
samples.push(await sample((Date.now() - started) / 1000));
const failures = await ga((h) => h.stage?.info().modelFailures ?? []);
const report = {
  taken: new Date().toISOString(),
  machine: "the developer's machine, serving itself; other work was running on it. Not one of the minimum machines; passes no gate.",
  seed: SEED,
  minutes: MINUTES,
  commands,
  outcome: cur.outcome,
  season: cur.season,
  samples,
  modelFailures: failures,
  pageErrors: errors,
  note: "The heap is the browser's own figure and falls when it chooses to collect. Geometries and textures are what the renderer says it holds: the merged-static rebuild disposes a material mesh and makes one again, so a leak would show as either count climbing without the district growing.",
};
writeFileSync(resolve(out, "golden-age-soak.json"), `${JSON.stringify(report, null, 1)}\n`);
await browser.close();
await served.close();
console.log(JSON.stringify(report, null, 1));
