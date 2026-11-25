// Captures the 3D valley of Granada in real Chrome at chosen moments, for looking at. It drives the page's own hook.
// Usage: npx tsx --tsconfig tsconfig.json tools/granada-shot.ts <out dir> [lang=en]
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { serveWorkspace } from "./serve";

const [outArg, lang = "en"] = process.argv.slice(2);
if (!outArg) throw new Error("usage: granada-shot.ts <out dir> [lang]");
const out = resolve(outArg);
mkdirSync(out, { recursive: true });
const served = await serveWorkspace();
// DPR=2 measures as a Retina screen would be drawn.
const dpr = Number(process.env.DPR ?? 1);
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--window-size=1960,1160", "--window-position=0,0", `--force-device-scale-factor=${dpr}`] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: dpr })).newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
await page.goto(`${served.base}/games/granada/index.html?lang=${lang}&fresh=1&seed=7&music=off`);
await page.waitForFunction("Boolean(window.__GR__ && window.__GR__.ready)");
await page.locator("#brief-start").click();
await page.waitForFunction("window.__GR__.threeD !== 'pending'", undefined, { timeout: 120_000 });
const threeD = await page.evaluate("window.__GR__.threeD");
console.log("3D:", threeD);
const shot = async (name: string, pose?: string) => {
  if (pose) await page.evaluate(`window.__GR__.stage().setPose(${pose}, true)`);
  await page.waitForTimeout(900);
  await page.locator("canvas.scene").screenshot({ path: resolve(out, `granada-3d-${name}.png`) });
};
if (threeD === "on" && process.env.MEASURE) {
  // Frame times only, several rounds at two places, to tell a real change from a busy machine.
  for (const [name, pose] of [["start", null], ["village", "{ tx: 110, ty: 6, tz: 150, yaw: 0.5, pitch: 0.36, distance: 190 }"], ["whole", "{ tx: 60, ty: 6, tz: 40, yaw: 1.5708, pitch: 0.9, distance: 860 }"]] as const) {
    if (pose) await page.evaluate(`window.__GR__.stage().setPose(${pose}, true)`);
    await page.waitForTimeout(1500);
    for (let round = 0; round < 3; round++) {
      await page.evaluate("window.__GR__.stage().takeFrameStats()");
      await page.waitForTimeout(3000);
      const f = (await page.evaluate("window.__GR__.stage().takeFrameStats()")) as { p50Ms: number; p95Ms: number; maxMs: number; avgFps: number };
      console.log(name, round, JSON.stringify({ p50: f.p50Ms, p95: f.p95Ms, max: f.maxMs, fps: Math.round(f.avgFps) }));
    }
  }
  console.log(JSON.stringify(await page.evaluate("window.__GR__.stage().info()")));
} else if (threeD === "on" && process.env.SEASONS) {
  // The first view in each season of the year, the days passed through the game itself.
  await page.waitForTimeout(8500);
  for (const season of ["spring", "summer", "autumn", "winter"]) {
    await shot(`season-${season}`);
    await page.evaluate("window.__GR__.days(30)");
  }
} else if (threeD === "on" && process.env.SWEEP) {
  // Light settings side by side, to choose by eye: SWEEP='{"a":{"environment":0.2},"b":{...}}'
  for (const [name, tune] of Object.entries(JSON.parse(process.env.SWEEP) as Record<string, unknown>)) {
    await page.evaluate(`window.__GR__.stage().tune(${JSON.stringify(tune)})`);
    await shot(`sweep-${name}`);
  }
} else if (threeD === "on") {
  // The boot message has gone by now; the whole page first, then the valley alone.
  await page.waitForTimeout(8500);
  await page.screenshot({ path: resolve(out, "granada-3d-0-page.png") });
  await shot("1-start");
  await shot("2-fields", "{ tx: -120, ty: 3, tz: 90, yaw: 1.2, pitch: 0.3, distance: 300 }");
  await shot("3-village", "{ tx: 110, ty: 6, tz: 150, yaw: 0.5, pitch: 0.36, distance: 190 }");
  await shot("4-pool", "{ tx: 130, ty: 7, tz: -60, yaw: 0.9, pitch: 0.42, distance: 180 }");
  await shot("5-overview", "{ tx: 60, ty: 6, tz: 40, yaw: 1.5708, pitch: 0.9, distance: 860 }");
  await shot("6-terraces", "{ tx: 330, ty: 14, tz: 100, yaw: 1.9, pitch: 0.34, distance: 230 }");
  await shot("7-channels", "{ tx: 120, ty: 4, tz: 30, yaw: 0.2, pitch: 0.5, distance: 110 }");
  await shot("8-hill-town", "{ tx: 540, ty: 20, tz: -60, yaw: 1.35, pitch: 0.16, distance: 330 }");
  console.log(JSON.stringify(await page.evaluate("window.__GR__.stage().info()")));
  await page.evaluate("window.__GR__.stage().takeFrameStats()");
  await page.waitForTimeout(4000);
  console.log(JSON.stringify(await page.evaluate("window.__GR__.stage().takeFrameStats()")));
}
console.log("errors:", JSON.stringify(errors.slice(0, 6)));
await browser.close();
await served.close();
