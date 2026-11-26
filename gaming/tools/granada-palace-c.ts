// Granada's palace, Set A beside Candidate C, taken from the running game for the owner's evaluation
// (docs/gaming/spec-production/owner-decisions-2026-11-26-d.md, instructions 7 and 8). For each art set, window size
// and preset it starts a new game in real Chrome, plays it by the game's own orders to the olive harvest, and at
// each of five views keeps the page and what the game counted of itself for ten seconds, with the size the palace
// has on the screen. The two sets are the same game in the same state; only `art=c` differs.
// It measures the machine it runs on, and no other. Models are read from the workspace's media folder.
// Usage: npx tsx --tsconfig tsconfig.json tools/granada-palace-c.ts <out dir> [presets=low,medium,high] [sizes=1920x1080,1280x800] [sets=a,c]
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { HILL, heightAt } from "../games/granada/src/view/valley";
import { serveWorkspace } from "./serve";

const [outArg, presetsArg = "low,medium,high", sizesArg = "1920x1080,1280x800", setsArg = "a,c"] = process.argv.slice(2);
if (!outArg) throw new Error("usage: granada-palace-c.ts <out dir> [presets] [sizes] [sets]");
const out = resolve(outArg);
mkdirSync(out, { recursive: true });
const SEED = 7;
const base = heightAt(HILL.x, HILL.z, SEED) - 0.4;
const YAW = -Math.PI / 2 - 0.25;
const media = resolve(import.meta.dirname, "../media/models/granada");
const footprint = (file: string): [number, number, number] => (JSON.parse(readFileSync(file, "utf8")) as { pieces: { palace: { footprint: [number, number, number] } } }).pieces.palace.footprint;
const FOOT = { a: footprint(`${media}/2/landmarks.kit.json`), c: footprint(`${media}/c/palace.kit.json`) };
/** The eight corners of the palace's box as it stands on the hill. The box is taken to be centred on the piece's origin. */
const corners = (f: [number, number, number]): Array<[number, number, number]> => {
  const pts: Array<[number, number, number]> = [];
  for (const sx of [-0.5, 0.5]) for (const sz of [-0.5, 0.5]) for (const sy of [0, 1]) {
    const lx = sx * f[0];
    const lz = sz * f[1];
    pts.push([HILL.x + lx * Math.cos(YAW) + lz * Math.sin(YAW), base + sy * f[2], HILL.z - lx * Math.sin(YAW) + lz * Math.cos(YAW)]);
  }
  return pts;
};
/** The views. `lens` is Photo Mode's lens in degrees, where the view is one only Photo Mode can take. */
// The camera's target cannot leave the worked ground (BOUNDS, x up to 760), and the palace stands at x = 930. Looking
// east from the edge of that ground at the lowest tilt allowed, the tool comes back from the nearest zoom ten metres
// at a time until the whole of the palace's box is in the picture: that is the nearest view the game gives of it.
const nearAt = (distance: number): string => `{ "tx": 760, "ty": 30, "tz": ${HILL.z}, "yaw": 1.5708, "pitch": 0.1222, "distance": ${distance} }`;
const NEAR = "nearest";
const FAR = '{ "tx": 30, "ty": 6, "tz": 70, "yaw": 1.41, "pitch": 0.17, "distance": 980 }';
const VIEWS: Array<{ id: string; pose: string; lens?: number }> = [
  { id: "1-proof", pose: '{ "tx": 640, "ty": 30, "tz": 0, "yaw": 1.07, "pitch": 0.17, "distance": 330 }' },
  { id: "2-nearest-strategic", pose: NEAR },
  { id: "3-farthest-strategic", pose: FAR },
  // Photo Mode's lens runs from 16 degrees (narrow, which brings things nearer) to 70 (wide).
  { id: "4-photo-farthest", pose: FAR, lens: 70 },
  { id: "5-photo-nearest", pose: NEAR, lens: 16 },
];
const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--window-size=1960,1160", "--window-position=0,0", "--force-device-scale-factor=1"] });
const report: Record<string, unknown> = { taken: new Date().toISOString(), browser: `chrome ${browser.version()}`, seed: SEED, footprints: FOOT, views: VIEWS, runs: [] as unknown[] };
for (const size of sizesArg.split(",")) {
  const [width, height] = size.split("x").map(Number) as [number, number];
  for (const preset of presetsArg.split(",")) {
    for (const set of setsArg.split(",") as Array<"a" | "c">) {
      const page = await (await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 })).newPage();
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      page.on("console", (m) => {
        if (m.type() === "error" && !m.text().includes("favicon")) errors.push(m.text());
      });
      const t0 = Date.now();
      await page.goto(`${served.base}/games/granada/index.html?lang=en&fresh=1&seed=${SEED}&music=off&counters=1&q=${preset}${set === "c" ? "&art=c" : ""}`);
      await page.waitForFunction("Boolean(window.__GR__ && window.__GR__.ready)");
      await page.locator("#brief-start").click();
      await page.waitForFunction("window.__GR__.threeD !== 'pending'", undefined, { timeout: 180_000 });
      if ((await page.evaluate("window.__GR__.threeD")) !== "on") throw new Error("the valley did not start in 3D on this machine");
      await page.waitForFunction("(() => { const i = window.__GR__.stage().info(); return i.models.includes('granada/mill') || i.modelFailures.length > 0; })()", undefined, { timeout: 60_000 });
      const readyMs = Date.now() - t0;
      // What was fetched of the models: bytes and time, as the browser's own record has them.
      const fetched = await page.evaluate("performance.getEntriesByType('resource').filter((e) => e.name.includes('/media/models/')).map((e) => ({ file: e.name.slice(e.name.indexOf('/media/models/') + 14), bytes: e.encodedBodySize, ms: Math.round(e.duration) }))") as Array<{ file: string; bytes: number; ms: number }>;
      // The same play as the proof frame: wheat in, the branch mended, the days until the olives are ripe, the olive harvest ordered.
      const played = await page.evaluate("(() => { const g = window.__GR__; g.order({ kind: 'harvest', plot: 'mill-field', rest: 'sell' }); g.order({ kind: 'repair' }); let n = 0; while (n < 90 && g.state().plots['olive-terrace'].ripeSince === null && !g.state().outcome) { g.days(1); n++; } g.order({ kind: 'harvest', plot: 'olive-terrace', rest: 'sell' }); return { daysPassed: n, day: g.state().day }; })()");
      await page.locator("#tab-market").click();
      const views: Record<string, unknown> = {};
      for (const view of VIEWS) {
        if (view.lens) {
          await page.locator("#view-photo").click();
          await page.evaluate(`(() => { const l = document.getElementById('photo-lens'); l.value = '${view.lens}'; l.dispatchEvent(new Event('input')); })()`);
        }
        const project = `(() => { const st = window.__GR__.stage(); return ${JSON.stringify(corners(FOOT[set]))}.map((p) => st.screenOf(p[0], p[1], p[2])); })()`;
        let nearestDistance: number | null = null;
        if (view.pose === NEAR) {
          const canvas = (await page.evaluate("(() => { const r = document.querySelector('canvas.scene').getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom]; })()")) as [number, number, number, number];
          for (let d = 70; d <= 980 && nearestDistance === null; d += 10) {
            await page.evaluate(`window.__GR__.stage().setPose(${nearAt(d)}, true)`);
            await page.waitForTimeout(120);
            const at = (await page.evaluate(project)) as Array<[number, number] | null>;
            if (at.every((q) => q !== null && q[0] >= canvas[0] && q[0] <= canvas[2] && q[1] >= canvas[1] && q[1] <= canvas[3])) nearestDistance = d;
          }
          // Where no zoom holds all of it, the picture is taken from the nearest zoom, and the record says so.
          await page.evaluate(`window.__GR__.stage().setPose(${nearAt(nearestDistance ?? 70)}, true)`);
        } else await page.evaluate(`window.__GR__.stage().setPose(${view.pose}, true)`);
        await page.waitForTimeout(view.id === "1-proof" ? 10_500 : 2_500);
        const pts = (await page.evaluate(project)) as Array<[number, number] | null>;
        const seen = pts.filter((p): p is [number, number] => p !== null);
        const box = seen.length === 8 ? { width: Math.round(Math.max(...seen.map((p) => p[0])) - Math.min(...seen.map((p) => p[0]))), height: Math.round(Math.max(...seen.map((p) => p[1])) - Math.min(...seen.map((p) => p[1]))) } : null;
        await page.screenshot({ path: `${out}/${set}-${size}-${preset}-${view.id}.png` });
        await page.evaluate("window.__GR__.countersStartOver()");
        await page.waitForTimeout(10_000);
        const counted = await page.evaluate("window.__GR__.counters()");
        views[view.id] = { palaceBoxPixels: box, ...(view.pose === NEAR ? { nearestDistanceHoldingThePalace: nearestDistance } : {}), pose: await page.evaluate("window.__GR__.stage().getPose()"), counted };
        if (view.lens) await page.locator("#photo-exit").click();
      }
      const info = (await page.evaluate("window.__GR__.stage().info()")) as { models: string[]; modelFailures: string[] };
      (report.runs as unknown[]).push({ set, size, preset, readyMs, fetched, played, models: info.models, modelFailures: info.modelFailures, views, consoleErrors: errors });
      console.error(`${set} ${size} ${preset}: ready in ${readyMs} ms; models ${info.models.join(",")}; failures ${info.modelFailures.length}; errors ${errors.length}`);
      await page.context().close();
      writeFileSync(`${out}/palace-c.json`, `${JSON.stringify(report, null, 1)}\n`);
    }
  }
}
report.machine = await (async () => {
  const page = await browser.newPage();
  // WebGPU is offered only to a page with an address of its own: a blank page has no adapter to name.
  await page.goto(`${served.base}/games/granada/index.html?no3d`);
  const m = await page.evaluate("(async () => { const a = navigator.gpu ? await navigator.gpu.requestAdapter() : null; const i = a ? a.info ?? {} : {}; return { userAgent: navigator.userAgent, cores: navigator.hardwareConcurrency, deviceMemoryGb: navigator.deviceMemory ?? null, gpu: a ? { vendor: i.vendor ?? '', architecture: i.architecture ?? '' } : 'no WebGPU adapter' }; })()");
  await page.close();
  return m;
})();
await browser.close();
await served.close();
report.note = "Taken from the running game on the machine named here, served from that machine. It is not one of the minimum machines and passes no performance gate. The palace's box on the screen is the projection of its bounding box, not of what is visible of it.";
writeFileSync(`${out}/palace-c.json`, `${JSON.stringify(report, null, 1)}\n`);
console.log(JSON.stringify({ out, runs: (report.runs as unknown[]).length }));
