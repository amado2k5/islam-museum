// Rebuilds Hudhud's scene from nothing, again and again, and reads the memory after a forced collection each time:
// the whole game is destroyed and started anew, as a change of effects preset does. What it holds must level off.
// Usage: npx tsx --tsconfig tsconfig.json tools/hudhud-rebuild.ts [times] [quality]
import { chromium } from "playwright-core";
import { serveWorkspace } from "./serve";

const [times = "12", quality = "medium"] = process.argv.slice(2);
const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--window-size=1500,950", "--force-device-scale-factor=1", "--enable-precise-memory-info", "--js-flags=--expose-gc"] });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 810 }, deviceScaleFactor: 1 })).newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(`${served.base}/games/hudhud/index.html?lang=en&q=${quality}&music=off&fresh=1&autostart=1`);
await page.waitForFunction("window.__HH__ && window.__HH__.where && window.__HH__.where() !== null", undefined, { timeout: 60000 });
const read = async () => {
  await page.evaluate("window.gc && window.gc()");
  await page.waitForTimeout(300);
  return (await page.evaluate("({ heapMB: Math.round(performance.memory.usedJSHeapSize / 104857.6) / 10, canvases: document.querySelectorAll('canvas').length, textures: window.__HH__.info().textures })")) as { heapMB: number; canvases: number; textures: number };
};
const samples = [await read()];
for (let i = 0; i < Number(times); i++) {
  await page.evaluate("window.__HH__.restart(true)");
  await page.waitForTimeout(900);
  samples.push(await read());
}
await browser.close();
await served.close();
console.log(JSON.stringify({ quality, rebuilds: Number(times), samples, errors, ran: new Date().toISOString() }));
