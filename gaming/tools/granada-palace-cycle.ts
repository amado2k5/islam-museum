// A short repeated-state check of Granada with the Candidate C palace in place (the founder's fourth decision,
// instruction 8): for as many minutes as asked it moves the camera between three views, chooses a field in the
// valley, and every third round loads the page again, writing after each round what the game counts of itself.
// What is read from it is whether the counts come back to the same level round after round and load after load.
// It is not the one-hour or four-hour run, and it measures the machine it runs on and no other.
// Usage: npx tsx --tsconfig tsconfig.json tools/granada-palace-cycle.ts <out dir> [minutes=10] [set=c] [preset=medium]
// The set is default, a, c, c1 or c2; `default` alone means no art flag, and Set A is passed explicitly as art=a.
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { palaceArtQuery, parsePalaceMeasurementSets } from "./granada-palace-target";
import { serveWorkspace } from "./serve";

const [outArg, minutesArg = "10", setArgument = "c", preset = "medium"] = process.argv.slice(2);
if (!outArg) throw new Error("usage: granada-palace-cycle.ts <out dir> [minutes] [set] [preset]");
const parsedSets = parsePalaceMeasurementSets(setArgument);
if (parsedSets.length !== 1) throw new Error("granada-palace-cycle.ts measures one set in a run");
const set = parsedSets[0];
const out = resolve(outArg);
mkdirSync(out, { recursive: true });
const POSES = ['{ "tx": 640, "ty": 30, "tz": 0, "yaw": 1.07, "pitch": 0.17, "distance": 330 }', '{ "tx": 760, "ty": 30, "tz": -150, "yaw": 1.5708, "pitch": 0.1222, "distance": 160 }', '{ "tx": 30, "ty": 6, "tz": 70, "yaw": 1.41, "pitch": 0.17, "distance": 980 }'];
const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--window-size=1960,1160", "--window-position=0,0", "--force-device-scale-factor=1"] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })).newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error" && !m.text().includes("favicon")) errors.push(m.text());
});
const address = `${served.base}/games/granada/index.html?lang=en&fresh=1&seed=7&music=off&counters=1&q=${preset}${palaceArtQuery(set)}`;
const load = async (again: boolean): Promise<void> => {
  if (again) await page.reload();
  else await page.goto(address);
  await page.waitForFunction("Boolean(window.__GR__ && window.__GR__.ready)");
  await page.locator("#brief-start").click();
  await page.waitForFunction("window.__GR__.threeD === 'on'", undefined, { timeout: 180_000 });
  await page.waitForFunction("(() => { const i = window.__GR__.stage().info(); return i.models.includes('granada/mill') || i.modelFailures.length > 0; })()", undefined, { timeout: 60_000 });
};
await load(false);
const rounds: unknown[] = [];
let loads = 1;
const end = Date.now() + Number(minutesArg) * 60_000;
for (let round = 1; Date.now() < end; round++) {
  await page.evaluate("window.__GR__.countersStartOver()");
  let chosen = 0;
  for (const pose of POSES) {
    await page.evaluate(`window.__GR__.stage().setPose(${pose}, true)`);
    await page.waitForTimeout(4_000);
    // A field chosen in the valley and let go again: the card that opens is the selection the game has.
    const at = (await page.evaluate("window.__GR__.stage().fieldOnScreen('mill-field')")) as [number, number] | null;
    if (at && (await page.evaluate(`(() => { const el = document.elementFromPoint(${at[0]}, ${at[1]}); return Boolean(el && el.tagName === 'CANVAS'); })()`))) {
      await page.mouse.click(at[0], at[1]);
      await page.waitForTimeout(500);
      if (await page.locator("#field-pop").isVisible()) chosen++;
      await page.keyboard.press("Escape");
    }
    await page.waitForTimeout(3_000);
  }
  const c = (await page.evaluate("window.__GR__.counters()")) as { frames: Record<string, number>; heapMb: number | null; intervals: number; workers: number; listeners: number; audio: unknown; provided: { renderer: { drawCalls: number; triangles: number; geometries: number | null; textures: number | null; models: string[]; modelFailures: string[] } } };
  const r = c.provided.renderer;
  rounds.push({ round, load: loads, fieldsChosen: chosen, p50Ms: c.frames.p50Ms, p95Ms: c.frames.p95Ms, p99Ms: c.frames.p99Ms, over33: c.frames.over33_3, heapMb: c.heapMb, geometries: r.geometries, textures: r.textures, drawCalls: r.drawCalls, triangles: r.triangles, intervals: c.intervals, workers: c.workers, listeners: c.listeners, audio: c.audio, models: r.models.length, modelFailures: r.modelFailures.length });
  console.error(JSON.stringify(rounds[rounds.length - 1]));
  if (round % 3 === 0 && Date.now() < end) {
    await load(true);
    loads++;
  }
}
const machine = await page.evaluate("(async () => { const a = navigator.gpu ? await navigator.gpu.requestAdapter() : null; const i = a ? a.info ?? {} : {}; return { userAgent: navigator.userAgent, cores: navigator.hardwareConcurrency, deviceMemoryGb: navigator.deviceMemory ?? null, gpu: a ? { vendor: i.vendor ?? '', architecture: i.architecture ?? '' } : 'no WebGPU adapter' }; })()");
writeFileSync(`${out}/palace-cycle-${set}.json`, `${JSON.stringify({ taken: new Date().toISOString(), browser: `chrome ${browser.version()}`, set, preset, window: [1920, 1080], minutes: Number(minutesArg), loads, machine, rounds, consoleErrors: errors, note: "The developer's machine, serving itself. Not one of the minimum machines; passes no gate. The heap is the browser's own figure and falls when it chooses to collect." }, null, 1)}\n`);
await browser.close();
await served.close();
console.log(JSON.stringify({ out, rounds: rounds.length, loads }));
