// Hudhud quest/Atlas soak on a games host: finish the golden quest, return to the Atlas, start again, and sample
// heap, textures, DOM nodes, listener count and frame times once a minute. Default is ten minutes; pass 60 or 240
// only when that measurement has been asked for.
// Usage: npx tsx --tsconfig tsconfig.json tools/hudhud-soak.ts <base> <out dir> [minutes=10]
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { leaveOpening } from "./hudhud-opening";

const [base, outArg, minutesArg = "10"] = process.argv.slice(2);
if (!base || !outArg) throw new Error("usage: hudhud-soak.ts <base> <out dir> [minutes=10]");
const out = resolve(outArg);
mkdirSync(out, { recursive: true });
const minutes = Number(minutesArg);
if (!Number.isFinite(minutes) || minutes < 1) throw new Error("minutes must be a positive number");

const channel = (await (await fetch(`${base}/_channel`)).json()) as { current: string; commit: string };
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--enable-precise-memory-info", "--window-size=1500,950", "--force-device-scale-factor=1"] });
const context = await browser.newContext({ viewport: { width: 1440, height: 810 }, deviceScaleFactor: 1 });
const page = await context.newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.addInitScript(`(() => {
  const counts = new Map(); const live = new Map();
  const key = (t,type,capture) => (t===window?'window':t===document?'document':t?.constructor?.name||'object')+':'+type+':'+!!capture;
  const add = EventTarget.prototype.addEventListener, del = EventTarget.prototype.removeEventListener;
  EventTarget.prototype.addEventListener = function(type,fn,opt){const k=key(this,type,typeof opt==='object'?opt.capture:opt);counts.set(k,(counts.get(k)||0)+1);live.set(k,(live.get(k)||0)+1);return add.call(this,type,fn,opt)};
  EventTarget.prototype.removeEventListener = function(type,fn,opt){const k=key(this,type,typeof opt==='object'?opt.capture:opt);live.set(k,Math.max(0,(live.get(k)||0)-1));return del.call(this,type,fn,opt)};
  window.__LISTENERS__ = () => ({registered:[...counts.values()].reduce((a,b)=>a+b,0),live:[...live.values()].reduce((a,b)=>a+b,0),kinds:live.size});
})()`);
await page.goto(`${base}/hudhud/?lang=en&fresh=1&music=off&perf=1`);
await page.waitForFunction(() => (window as any).__HH__ && ((window as any).__HH__.ready || (window as any).__HH__.error), undefined, { timeout: 30000 });
await leaveOpening(page);

async function finishQuestOnce() {
  await page.locator(".hub button.primary").click();
  await page.waitForFunction(() => (window as any).__HH__.where() !== null, undefined, { timeout: 30000 });
  await page.waitForTimeout(400);
  await page.evaluate(() => (window as any).__HH__.command({ type: "skip" }));
  await page.locator(".words li button").first().click().catch(() => undefined);
  await page.evaluate(() => { (window as any).__HH__.touch("mirror-c"); (window as any).__HH__.touch("mirror-e"); });
  await page.waitForTimeout(2200);
  for (let i = 0; i < 12; i++) {
    if (!(await page.evaluate(() => (window as any).__HH__.state().talk !== null))) break;
    await page.evaluate(() => (window as any).__HH__.command({ type: "skip" }));
    await page.waitForTimeout(250);
  }
  await page.evaluate(() => (window as any).__HH__.touch("page"));
  await page.waitForTimeout(500);
  for (let i = 0; i < 12; i++) {
    if (!(await page.evaluate(() => (window as any).__HH__.state().talk !== null))) break;
    await page.evaluate(() => (window as any).__HH__.command({ type: "skip" }));
    await page.waitForTimeout(250);
  }
  const done = await page.evaluate(() => (window as any).__HH__.state().done);
  // The Atlas return destroys the Phaser game. Capture its measurements first; they belong to the quest just played.
  const info = await page.evaluate(() => (window as any).__HH__.info() || null);
  await page.evaluate(() => (window as any).__HH__.toAtlas());
  await page.waitForFunction(() => document.querySelectorAll(".hub .world").length === 10, undefined, { timeout: 10000 });
  return { done, info };
}

async function sample(minute: number, cycles: number, questInfo: Record<string, unknown> | null, lastQuestDone: boolean) {
  const value = (await page.evaluate((questInfo) => {
    const w = window as any;
    const info = questInfo || {};
    return {
      heapBytes: (performance as any).memory ? (performance as any).memory.usedJSHeapSize : null,
      heapLimitBytes: (performance as any).memory ? (performance as any).memory.jsHeapSizeLimit : null,
      domNodes: document.getElementsByTagName("*").length,
      listeners: w.__LISTENERS__ ? w.__LISTENERS__() : null,
      textures: info.textures ?? null,
      canvas: info.canvas ?? null,
      drawCalls: info.drawCalls ?? null,
      frames: info.frames ?? null,
      atlas: document.querySelectorAll(".hub .world").length,
    };
  }, questInfo)) as Record<string, unknown>;
  return { minute, cycles, questInfoCapturedAt: "end of last completed quest, before Atlas teardown", lastQuestDone, ...value };
}

const samples: Record<string, unknown>[] = [];
const began = Date.now();
let cycles = 0;
let unfinished = 0;
let last = await finishQuestOnce();
cycles += 1;
samples.push(await sample(0, cycles, last.info as Record<string, unknown> | null, !!last.done));
for (let minute = 1; minute <= minutes; minute++) {
  const end = began + minute * 60_000;
  while (Date.now() < end) {
    last = await finishQuestOnce();
    if (!last.done) unfinished += 1;
    cycles += 1;
    await page.waitForTimeout(1000);
  }
  samples.push(await sample(minute, cycles, last.info as Record<string, unknown> | null, !!last.done));
}
await browser.close();

function numberSeries(key: string) {
  const settled = samples.slice(Math.min(3, Math.max(0, samples.length - 1)));
  const vals = settled.map((s) => s[key] as number | null).filter((x): x is number => typeof x === "number");
  if (vals.length < 2) return { measured: false, firstAfterWarmUp: vals[0] ?? null, last: vals.at(-1) ?? null, levelsOff: null };
  const first = vals[0];
  const last = vals.at(-1)!;
  const peak = Math.max(...vals);
  const growthPercent = first ? Math.round((1000 * (last - first)) / first) / 10 : null;
  return { measured: true, warmUpMinutesExcluded: Math.min(3, samples.length), firstAfterWarmUp: first, last, peak, delta: last - first, growthPercent, levelsOff: growthPercent !== null ? growthPercent <= 10 : null };
}
function listenerSeries() {
  const settled = samples.slice(Math.min(3, Math.max(0, samples.length - 1)));
  const vals = settled.map((s) => (s.listeners as { live?: number } | null)?.live).filter((x): x is number => typeof x === "number");
  if (vals.length < 2) return { measured: false, firstAfterWarmUp: vals[0] ?? null, last: vals.at(-1) ?? null, levelsOff: null };
  const first = vals[0];
  const last = vals.at(-1)!;
  return { measured: true, warmUpMinutesExcluded: Math.min(3, samples.length), firstAfterWarmUp: first, last, delta: last - first, levelsOff: last <= first + 5 };
}
function textureSeries() {
  const settled = samples.slice(Math.min(3, Math.max(0, samples.length - 1)));
  const vals = settled.map((s) => s.textures).filter((x): x is number => typeof x === "number");
  if (vals.length < 2) return { measured: false, firstAfterWarmUp: vals[0] ?? null, last: vals.at(-1) ?? null, levelsOff: null };
  const first = vals[0];
  const last = vals.at(-1)!;
  return { measured: true, warmUpMinutesExcluded: Math.min(3, samples.length), firstAfterWarmUp: first, last, delta: last - first, levelsOff: last === first };
}
const frameSamples = samples.map((s) => s.frames as { frames?: number; p95Ms?: number; p99Ms?: number; over33_3?: number; over50?: number } | null).filter((x): x is NonNullable<typeof x> => !!x && typeof x.frames === "number" && x.frames > 0);
const verdict = {
  heap: numberSeries("heapBytes"),
  domNodes: numberSeries("domNodes"),
  listeners: listenerSeries(),
  textures: textureSeries(),
  frameTimes: {
    measuredSamples: frameSamples.length,
    worstP95Ms: frameSamples.length ? Math.max(...frameSamples.map((x) => x.p95Ms ?? 0)) : null,
    worstP99Ms: frameSamples.length ? Math.max(...frameSamples.map((x) => x.p99Ms ?? 0)) : null,
    framesOver33Ms: frameSamples.reduce((n, x) => n + (x.over33_3 ?? 0), 0),
    framesOver50Ms: frameSamples.reduce((n, x) => n + (x.over50 ?? 0), 0),
    note: "frame samples come from the quest completed at each minute boundary; each covers only that scripted quest of a few seconds, not the whole minute",
  },
};
const level = [verdict.heap.levelsOff, verdict.domNodes.levelsOff, verdict.listeners.levelsOff, verdict.textures.levelsOff].filter((x) => x !== null);
const report = {
  base,
  release: channel.current,
  commit: channel.commit,
  ran: new Date().toISOString(),
  minutes,
  cycles,
  unfinished,
  machine: `${process.platform} ${process.arch}`,
  note: "A pass on this machine is not a pass on the two reference machines (M1 Air 8 GB; Windows 11 i5-1135G7 8 GB). The first three minutes are treated as warm-up, matching the Granada soak pattern; raw minute-zero samples remain in the evidence.",
  samples,
  verdict,
  levelsOff: level.length ? level.every(Boolean) : null,
  errors,
};
writeFileSync(resolve(out, "hudhud-soak.json"), `${JSON.stringify(report, null, 1)}\n`);
console.log(JSON.stringify(report, null, 1));
if (errors.length || unfinished) process.exit(1);
