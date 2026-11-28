// The mill's automatic LOD, seen from the running game: the same view once near the mill (the whole making) and
// once far past the 140-metre mark (the distance making). Photo Mode, High. It measures nothing.
// Usage: npx tsx --tsconfig tsconfig.json tools/granada-lod-shot.ts <out dir>
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { MILL } from "../games/granada/src/view/valley";
import { serveWorkspace } from "./serve";
const [outArg] = process.argv.slice(2);
if (!outArg) throw new Error("usage: granada-lod-shot.ts <out dir>");
const out = resolve(outArg);
mkdirSync(out, { recursive: true });
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
await page.waitForFunction("(() => { const i = window.__GR__.stage().info(); return i.models.includes('granada/mill') && i.models.includes('granada/mill-lod1'); })()", undefined, { timeout: 60000 });
await page.locator("#view-photo").click();
await page.locator("#photo-hide").click();
// Near: the camera almost over the mill's own ground, the whole making in frame.
await page.evaluate(`window.__GR__.stage().setPose(${JSON.stringify({ tx: MILL[0], ty: 14, tz: MILL[1] - 30, yaw: 0.4, pitch: 0.3, distance: 60 })}, true)`);
await page.waitForTimeout(2000);
await page.screenshot({ path: `${out}/mill-near.png` });
// Far: well past the 140-metre mark, the distance making should stand.
await page.evaluate(`window.__GR__.stage().setPose(${JSON.stringify({ tx: MILL[0], ty: 120, tz: MILL[1] - 260, yaw: 0.4, pitch: 0.42, distance: 330 })}, true)`);
await page.waitForTimeout(2000);
await page.screenshot({ path: `${out}/mill-far-lod1.png` });
console.log(JSON.stringify({ errors, mill: MILL, out }));
await browser.close();
await served.close();
