// Granada's proof frame, taken from the running game (docs/gaming/spec-production/proof-frames.json). For each of
// the three presets it starts a new game in real Chrome, plays it by the game's own orders until the olives are
// ripe, stands the camera at the proof view, and keeps: the page before the olive harvest is ordered; the page a
// moment after (the people who come are the visible change of state); the page with the olive terrace chosen in the
// valley; and what the game counted of itself for ten seconds. Nothing is composed, retouched or drawn elsewhere.
// It measures the machine it runs on, and no other.
// Usage: npx tsx --tsconfig tsconfig.json tools/granada-proof.ts <out dir> [presets=low,medium,high]
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { serveWorkspace } from "./serve";

const [outArg, presetsArg = "low,medium,high"] = process.argv.slice(2);
if (!outArg) throw new Error("usage: granada-proof.ts <out dir> [presets]");
const out = resolve(outArg);
mkdirSync(out, { recursive: true });
/** The proof view: the estate and its olives before, the lower town on the slope, the wall climbing to the palace, the range behind. */
export const PROOF_POSE = process.env.POSE ?? '{ "tx": 640, "ty": 30, "tz": 0, "yaw": 1.07, "pitch": 0.17, "distance": 330 }';
const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--window-size=1960,1160", "--window-position=0,0", "--force-device-scale-factor=1"] });
const report: Record<string, unknown> = { pose: JSON.parse(PROOF_POSE), taken: new Date().toISOString(), browser: `chrome ${browser.version()}`, presets: {} as Record<string, unknown> };
for (const preset of presetsArg.split(",")) {
  const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })).newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error" && !m.text().includes("favicon")) errors.push(m.text());
  });
  await page.goto(`${served.base}/games/granada/index.html?lang=en&fresh=1&seed=7&music=off&counters=1&q=${preset}`);
  await page.waitForFunction("Boolean(window.__GR__ && window.__GR__.ready)");
  await page.locator("#brief-start").click();
  await page.waitForFunction("window.__GR__.threeD !== 'pending'", undefined, { timeout: 120_000 });
  if ((await page.evaluate("window.__GR__.threeD")) !== "on") throw new Error("the valley did not start in 3D on this machine");
  await page.waitForFunction("(() => { const i = window.__GR__.stage().info(); return i.models.includes('granada/mill') || i.modelFailures.length > 0; })()", undefined, { timeout: 60_000 });
  // The game is played, not staged: the wheat is brought in, the branch mended, and the days pass until the olives are ripe.
  const played = (await page.evaluate("(() => { const g = window.__GR__; g.order({ kind: 'harvest', plot: 'mill-field', rest: 'sell' }); g.order({ kind: 'repair' }); let n = 0; while (n < 90 && g.state().plots['olive-terrace'].ripeSince === null && !g.state().outcome) { g.days(1); n++; } return { daysPassed: n, day: g.state().day }; })()")) as { daysPassed: number; day: number };
  await page.locator("#tab-market").click();
  await page.evaluate(`window.__GR__.stage().setPose(${PROOF_POSE}, true)`);
  // The messages of the days that have passed fade before the first picture is taken.
  await page.waitForTimeout(10_500);
  const stocks = "(() => { const s = window.__GR__.state(); const p = s.plots['olive-terrace']; return { day: s.day, standing: p.standing, brought: p.brought, sold: p.soldFromField, harvesting: p.harvesting, atWork: window.__GR__.stage().info().atWork }; })()";
  const before = await page.evaluate(stocks);
  await page.screenshot({ path: `${out}/proof-${preset}-1-before-the-order.png` });
  // The order, as a player gives it; and the picture a moment after.
  await page.evaluate("window.__GR__.order({ kind: 'harvest', plot: 'olive-terrace', rest: 'sell' })");
  await page.waitForTimeout(10_500);
  const during = await page.evaluate(stocks);
  await page.screenshot({ path: `${out}/proof-${preset}-2-the-harvest.png` });
  // The terrace chosen in the valley itself: its card stands beside it.
  // A point of the terrace that is in the picture and under no panel: found by asking the valley what lies under each of a grid of points.
  const at = (await page.evaluate("(() => { const st = window.__GR__.stage(); const box = document.querySelector('canvas.scene').getBoundingClientRect(); for (let y = box.bottom - 60; y > box.top + 200; y -= 30) for (let x = box.left + 460; x < box.right - 420; x += 40) { const el = document.elementFromPoint(x, y); if (el && el.tagName === 'CANVAS' && st.fieldAt(x, y) === 'olive-terrace') return [x, y]; } return null; })()")) as [number, number] | null;
  let selected = false;
  if (at) {
    await page.mouse.click(at[0], at[1]);
    await page.waitForTimeout(900);
    selected = await page.locator("#field-pop").isVisible();
    await page.locator("#tab-market").click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${out}/proof-${preset}-3-the-terrace-chosen.png` });
  }
  // What the game counts of itself over ten seconds at this view.
  await page.evaluate("window.__GR__.countersStartOver()");
  await page.waitForTimeout(10_000);
  const counted = await page.evaluate("window.__GR__.counters()");
  // The day after: the crop is in, and the people have gone.
  await page.evaluate("window.__GR__.days(3)");
  await page.waitForTimeout(800);
  const after = await page.evaluate(stocks);
  const machine = await page.evaluate("(async () => { const a = navigator.gpu ? await navigator.gpu.requestAdapter() : null; const i = a ? a.info ?? {} : {}; return { userAgent: navigator.userAgent, cores: navigator.hardwareConcurrency, deviceMemoryGb: navigator.deviceMemory ?? null, gpu: a ? { vendor: i.vendor ?? '', architecture: i.architecture ?? '' } : 'no WebGPU adapter', devicePixelRatio, inner: [innerWidth, innerHeight] }; })()");
  (report.presets as Record<string, unknown>)[preset] = { played, before, during, after, cardBesideTheTerrace: selected, counted, consoleErrors: errors };
  report.machine = machine;
  console.error(`${preset}: day ${played.day}; at work ${JSON.stringify([(before as { atWork: number }).atWork, (during as { atWork: number }).atWork, (after as { atWork: number }).atWork])}; card ${selected}; errors ${errors.length}`);
  await page.context().close();
}
await browser.close();
await served.close();
report.note = "Taken from the running game on the machine named here. It is not one of the minimum machines and passes no performance gate.";
writeFileSync(`${out}/proof.json`, `${JSON.stringify(report, null, 1)}\n`);
console.log(JSON.stringify({ out, presets: Object.keys(report.presets as object) }));
