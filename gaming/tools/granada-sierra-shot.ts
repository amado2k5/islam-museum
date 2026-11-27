// Quick visual check of the painted ground detail: a close view of the worked fields and a wide proof view.
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { serveWorkspace } from "./serve";
const out = resolve("/tmp/granada-sierra"); mkdirSync(out, { recursive: true });
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
await page.locator("#view-photo").click();
await page.locator("#photo-hide").click();
const views: Array<[string, string]> = [
  ["sierra-east", JSON.stringify({ tx: 900, ty: 60, tz: 0, yaw: -1.5708, pitch: 0.08, distance: 500 })],
  ["sierra-proof", JSON.stringify({ tx: 640, ty: 30, tz: 0, yaw: 1.07, pitch: 0.17, distance: 330 })],
  ["sierra-wide", JSON.stringify({ tx: 300, ty: 40, tz: 0, yaw: -1.2, pitch: 0.12, distance: 900 })],
];
for (const [name, pose] of views) {
  await page.evaluate("window.__GR__.stage().setPose(" + pose + ", true)");
  await page.waitForTimeout(2500);
  await page.screenshot({ path: out + "/" + name + ".png" });
}
const info = await page.evaluate("(() => { const i = window.__GR__.stage().info(); return { drawCalls: i.drawCalls, triangles: i.triangles, textures: i.textures, geometries: i.geometries, models: i.models, failures: i.modelFailures }; })()");
const heap = await page.evaluate("performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : null");
console.log(JSON.stringify({ info, heapMb: heap, errors }));
await browser.close(); await served.close();
