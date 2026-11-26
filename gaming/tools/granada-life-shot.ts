// Pictures of the valley's living things from the running game, for looking at: a flock at graze, the shops on the
// town's street, the watch at the hill's gate, the river's current, the road, and the proof view. Photo Mode, High.
// ART=c, c1 or c2 draws that palace. It measures nothing.
// Usage: npx tsx --tsconfig tsconfig.json tools/granada-life-shot.ts <out dir>
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { buildScenery, HILL, riverZ } from "../games/granada/src/view/valley";
import { serveWorkspace } from "./serve";
const [outArg] = process.argv.slice(2);
if (!outArg) throw new Error("usage: granada-life-shot.ts <out dir>");
const out = resolve(outArg); mkdirSync(out, { recursive: true });
const sc = buildScenery(7, { authoredTown: true, authoredHill: true });
console.log(JSON.stringify({ pastures: sc.pastures, walks: sc.guardWalks.length, gate: sc.gatePosts, stalls: sc.stalls.length }));
const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--window-size=1960,1160", "--window-position=0,0", "--force-device-scale-factor=1"] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })).newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("favicon")) errors.push(m.text()); });
await page.goto(served.base + "/games/granada/index.html?lang=en&fresh=1&seed=7&music=off&q=high" + (process.env.ART ? "&art=" + process.env.ART : ""));
await page.waitForFunction("Boolean(window.__GR__ && window.__GR__.ready)");
await page.locator("#brief-start").click();
await page.waitForFunction("window.__GR__.threeD === 'on'", undefined, { timeout: 180000 });
await page.waitForFunction("(() => { const i = window.__GR__.stage().info(); return i.models.includes('granada/mill') || i.modelFailures.length > 0; })()", undefined, { timeout: 60000 });
const p0 = sc.pastures[0] ?? [0, 0];
const g = sc.gatePosts[0]!;
const views: Array<[string, string]> = [
  ["pasture", JSON.stringify({ tx: p0[0], ty: 6, tz: p0[1], yaw: 0.6, pitch: 0.4, distance: 70 })],
  ["shops", JSON.stringify({ tx: 690, ty: 6, tz: 90, yaw: 0.9, pitch: 0.5, distance: 100 })],
  ["gate", JSON.stringify({ tx: Math.min(760, g[0]), ty: 30, tz: g[1], yaw: Math.atan2(HILL.x - g[0], -(HILL.z - g[1])), pitch: 0.2, distance: 120 })],
  ["river", JSON.stringify({ tx: 60, ty: 6, tz: riverZ(60) + 20, yaw: 0.2, pitch: 0.5, distance: 110 })],
  ["road", JSON.stringify({ tx: 600, ty: 6, tz: 170, yaw: 1.0, pitch: 0.3, distance: 110 })],
  ["proof", JSON.stringify({ tx: 640, ty: 30, tz: 0, yaw: 1.07, pitch: 0.17, distance: 330 })],
];
await page.locator("#view-photo").click();
await page.locator("#photo-hide").click();
for (const [name, pose] of views) {
  await page.evaluate("window.__GR__.stage().setPose(" + pose + ", true)");
  await page.waitForTimeout(2500);
  await page.screenshot({ path: out + "/" + name + ".png" });
}
console.log(JSON.stringify({ info: await page.evaluate("(() => { const i = window.__GR__.stage().info(); return { drawCalls: i.drawCalls, triangles: i.triangles, models: i.models, failures: i.modelFailures }; })()"), errors }));
await browser.close(); await served.close();
