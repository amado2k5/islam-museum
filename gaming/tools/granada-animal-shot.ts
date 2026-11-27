import { mkdirSync } from "node:fs";
import { chromium } from "playwright-core";
import { ROAD_EAST, ROAD_WEST, buildScenery, roadLine } from "../games/granada/src/view/valley";
import { serveWorkspace } from "./serve";
const out = "/tmp/granada-animals-close";
mkdirSync(out, { recursive: true });
const sc = buildScenery(7, { authoredTown: true, authoredHill: true });
const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--window-size=1960,1160", "--window-position=0,0", "--force-device-scale-factor=1"] });
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
const page = await context.newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(served.base + "/games/granada/index.html?lang=en&fresh=1&seed=7&music=off&q=high");
await page.waitForFunction("Boolean(window.__GR__ && window.__GR__.ready)");
await page.locator("#brief-start").click();
await page.waitForFunction("window.__GR__.threeD === 'on'", undefined, { timeout: 180000 });
await page.waitForFunction("(() => { const i = window.__GR__.stage().info(); return i.models.filter((m) => m.includes('animals')).length >= 5; })()", undefined, { timeout: 60000 });
const p0 = sc.pastures[2] ?? [0, 0];
await page.locator("#view-photo").click();
await page.locator("#photo-hide").click();
// close on the pasture: sheep, goats, the donkey
for (const [name, dist, yaw] of [["flock-close", 18, 0.9], ["flock-close2", 12, 2.4], ["flock-close3", 26, 5.2]] as const) {
  await page.evaluate(`window.__GR__.stage().setPose(${JSON.stringify({ tx: p0[0], ty: 4, tz: p0[1], yaw, pitch: 0.32, distance: dist })}, true)`);
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `${out}/${name}.png` });
}
// Ox-carts stand where motion held at nought puts them: their places are the game's own arithmetic at t=0.
const roads = [roadLine(ROAD_WEST), roadLine(ROAD_EAST)];
for (let i = 0; i < 2; i++) {
  const road = roads[i % roads.length]!;
  const last = road.length - 1;
  const u = ((i * 17.3) % (2 * last) + 2 * last) % (2 * last);
  const back = u > last;
  const at = back ? 2 * last - u : u;
  const k = Math.min(last - 1, Math.floor(at));
  const a = road[k]!;
  const b = road[k + 1]!;
  const s2 = at - k;
  const x = a[0] + (b[0] - a[0]) * s2;
  const z = a[1] + (b[1] - a[1]) * s2;
  const dir = back ? -1 : 1;
  const yaw = Math.atan2((b[0] - a[0]) * dir, (b[1] - a[1]) * dir);
  // Beside and a little behind the cart, looking at its ox head-on.
  await page.evaluate(`window.__GR__.stage().setPose(${JSON.stringify({ tx: x, ty: 3, tz: z, yaw: yaw + 2.4, pitch: 0.18, distance: 14 })}, true)`);
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${out}/cart-${i}.png` });
}
console.log(JSON.stringify({ errors }));
await browser.close();
await served.close();
