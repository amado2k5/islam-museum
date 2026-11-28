// Visual check of the painted skies: one wide view per season, the golden evening, and a rainy day.
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { serveWorkspace } from "./serve";
const out = resolve("/tmp/granada-skies"); mkdirSync(out, { recursive: true });
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
const pose = JSON.stringify({ tx: 300, ty: 30, tz: 0, yaw: -1.2, pitch: 0.16, distance: 700 });
const skyPose = JSON.stringify({ tx: 300, ty: 30, tz: 0, yaw: -1.5708, pitch: 0.122, distance: 500 });
await page.evaluate("window.__GR__.stage().setPose(" + pose + ", true)");
// A look that keeps the valley alive while the season and the rain are chosen for the picture.
const setSeason = async (season: number, rain = false, name = "") => {
  await page.evaluate(`(() => {
    const s = window.__GR__.stage();
    s.setLook({ season: ${season}, rain: ${rain}, pool: 0.8, branches: { intake: "flowing", main: "flowing", west: "flowing", meadow: "flowing" }, fields: {}, houses: 12, housesUnderWay: 0, granary: "built", busy: 12, selected: null, placed: [] });
  })()`);
  await page.evaluate(`window.__GR__.stage().setPose(${skyPose}, true)`);
  await page.waitForTimeout(3500);
  await page.screenshot({ path: `${out}/${name || "season-" + season}.png` });
};
for (const [i, name] of [[0, "spring"], [1, "summer"], [2, "autumn"], [3, "winter"]] as const) await setSeason(i, false, name);
await page.evaluate(`window.__GR__.stage().previewLight("evening")`);
await page.waitForTimeout(500);
await setSeason(2, false, "evening-golden");
await page.evaluate(`window.__GR__.stage().previewLight(null)`);
await setSeason(1, true, "rain-summer");
const info = await page.evaluate("(() => { const i = window.__GR__.stage().info(); return { drawCalls: i.drawCalls, triangles: i.triangles, textures: i.textures, geometries: i.geometries, models: i.models, failures: i.modelFailures }; })()");
const heap = await page.evaluate("performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : null");
console.log(JSON.stringify({ info, heapMb: heap, errors }));
await browser.close(); await served.close();
