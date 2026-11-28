// A short walking sequence of every animal kind in the valley, for looking at: three frames a moment apart at a
// pasture (sheep, goats, the donkey) and on the road (the camel caravan, the ox-carts, the riders' horses).
// Photo Mode, High, motion on. It measures nothing.
// Usage: npx tsx --tsconfig tsconfig.json tools/granada-animals-walk-shot.ts <out dir>
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { buildScenery, roadLine, ROAD_EAST, ROAD_WEST } from "../games/granada/src/view/valley";
import { serveWorkspace } from "./serve";
const [outArg] = process.argv.slice(2);
if (!outArg) throw new Error("usage: granada-animals-walk-shot.ts <out dir>");
const out = resolve(outArg);
mkdirSync(out, { recursive: true });
const sc = buildScenery(7, { authoredTown: true, authoredHill: true });
const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--window-size=1960,1160", "--window-position=0,0", "--force-device-scale-factor=1"] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })).newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("favicon")) errors.push(m.text()); });
await page.goto(served.base + "/games/granada/index.html?lang=en&fresh=1&seed=7&music=off&q=high");
await page.waitForFunction("Boolean(window.__GR__ && window.__GR__.ready)");
await page.locator("#brief-start").click();
await page.waitForFunction("window.__GR__.threeD === 'on'", undefined, { timeout: 180000 });
await page.waitForFunction("(() => { const i = window.__GR__.stage().info(); return i.models.filter((m) => m.includes('animals')).length >= 6; })()", undefined, { timeout: 60000 });
await page.locator("#view-photo").click();
await page.locator("#photo-hide").click();
const shots: Array<[string, unknown]> = [];
const p0 = sc.pastures[2] ?? [0, 0];
shots.push(["pasture", { tx: p0[0], ty: 4, tz: p0[1], yaw: 0.9, pitch: 0.3, distance: 16 }]);
// A camel's place on its road at this moment, from the game's own arithmetic (u = t*0.16 + i*31.7, i = 0).
// The pose is set a beat ahead so the sequence catches it mid-stride.
const road = roadLine(ROAD_WEST);
const last = road.length - 1;
const camels: Array<[number, number, number]> = [];
for (let i = 0; i < 2; i++) {
  const u = ((30 * 0.16 + i * 31.7) % (2 * last) + 2 * last) % (2 * last);
  const back = u > last;
  const at = back ? 2 * last - u : u;
  const k = Math.min(last - 1, Math.floor(at));
  const a = road[k]!;
  const b = road[k + 1]!;
  const s = at - k;
  const dir = back ? -1 : 1;
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  camels.push([a[0] + (b[0] - a[0]) * s + ((b[1] - a[1]) / l) * dir * 3.4, a[1] + (b[1] - a[1]) * s - ((b[0] - a[0]) / l) * dir * 3.4, Math.atan2((b[0] - a[0]) * dir, (b[1] - a[1]) * dir)]);
}
shots.push(["caravan", { tx: camels[0]![0], ty: 3.4, tz: camels[0]![1], yaw: camels[0]![2]! + 2.6, pitch: 0.16, distance: 15 }]);
for (const [name, pose] of shots) {
  await page.evaluate(`window.__GR__.stage().setPose(${JSON.stringify(pose)}, true)`);
  for (let f = 0; f < 3; f++) {
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${out}/${name}-${f}.png` });
  }
}
console.log(JSON.stringify({ errors, out }));
await browser.close();
await served.close();
