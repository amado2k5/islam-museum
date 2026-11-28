// Measures draw calls and triangles before and after town kit LOD kicks in.
// Usage: npx tsx --tsconfig tsconfig.json tools/granada-lod-measure.ts <out dir>
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { serveWorkspace } from "./serve";
const [outArg] = process.argv.slice(2);
if (!outArg) throw new Error("usage: granada-lod-measure.ts <out dir>");
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
await page.waitForFunction("(() => { const i = window.__GR__.stage().info(); return i.models.includes('granada/town'); })()", undefined, { timeout: 60000 });
await page.locator("#view-photo").click();
await page.locator("#photo-hide").click();
// Near: camera close to town, LOD0 should be active
await page.evaluate(`window.__GR__.stage().setPose(${JSON.stringify({ tx: 0, ty: 20, tz: 0, yaw: 0.5, pitch: 0.4, distance: 80 })}, true)`);
await page.waitForTimeout(2000);
const near = await page.evaluate(`(() => { const s = window.__GR__.stage(); return s.info(); })()`);
// Far: camera far from town, LOD1 should be active
await page.evaluate(`window.__GR__.stage().setPose(${JSON.stringify({ tx: 0, ty: 200, tz: -300, yaw: 0.5, pitch: 0.5, distance: 500 })}, true)`);
await page.waitForTimeout(2000);
const far = await page.evaluate(`(() => { const s = window.__GR__.stage(); return s.info(); })()`);
const result = { near, far, errors, out };
writeFileSync(`${out}/lod-measure.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result));
await browser.close();
await served.close();
