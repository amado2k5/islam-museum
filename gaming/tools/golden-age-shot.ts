// Captures stills of the Golden Age board in real Chrome.
// Usage: npx tsx tools/golden-age-shot.ts <out dir> [query] [width] [height]
// The page's own test hook sets the camera; each named pose below becomes one PNG.
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { serveWorkspace } from "./serve";

const [outArg, query = "", w = "1920", h = "1080"] = process.argv.slice(2);
if (!outArg) throw new Error("usage: golden-age-shot.ts <out dir> [query] [w] [h]");
const out = resolve(outArg);
mkdirSync(out, { recursive: true });
const deg = Math.PI / 180;
const POSES: Record<string, { tx: number; tz: number; yaw: number; pitch: number; distance: number }> = {
  start: { tx: -66, tz: -88, yaw: 0.32, pitch: 38 * deg, distance: 330 },
  overview: { tx: 0, tz: -118, yaw: 0, pitch: 52 * deg, distance: 540 },
  close: { tx: -88, tz: -60, yaw: -0.5, pitch: 30 * deg, distance: 130 },
  top: { tx: -66, tz: -66, yaw: 0, pitch: 78 * deg, distance: 260 },
  river: { tx: -100, tz: -20, yaw: 1.1, pitch: 25 * deg, distance: 170 },
};
const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: [`--window-size=${w},${Number(h) + 90}`, "--window-position=0,0", "--force-device-scale-factor=1"] });
const page = await (await browser.newContext({ viewport: { width: Number(w), height: Number(h) }, deviceScaleFactor: 1 })).newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
await page.goto(`${served.base}/games/golden-age/index.html?${query}`);
try {
  await page.waitForFunction(() => (window as unknown as { __GA__?: { ready?: boolean } }).__GA__?.ready, undefined, { timeout: 60000 });
} catch (e) {
  console.log("errors:", errors.join("\n"));
  await page.screenshot({ path: resolve(out, "failure.png") });
  await browser.close();
  await served.close();
  throw e;
}
for (const [name, pose] of Object.entries(POSES)) {
  await page.evaluate((p) => (window as unknown as { __GA__: { stage: { setPose(p: unknown): void } } }).__GA__.stage.setPose(p), pose);
  await page.waitForTimeout(700);
  await page.screenshot({ path: resolve(out, `${name}.png`) });
}
const info = await page.evaluate(() => (window as unknown as { __GA__: { stage: { info(): unknown } } }).__GA__.stage.info());
await browser.close();
await served.close();
console.log(JSON.stringify({ out, info, errors }));
