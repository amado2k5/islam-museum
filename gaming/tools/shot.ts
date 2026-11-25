// Captures one still of the lab in real Chrome. Usage: npx tsx tools/shot.ts <out.png> "<query string>" [width] [height]
import { chromium } from "playwright-core";
import { serveWorkspace } from "./serve";

const [out, query, w = "1920", h = "1080"] = process.argv.slice(2);
if (!out || !query) throw new Error("usage: shot.ts <out.png> <query> [w] [h]");
const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: [`--window-size=${w},${Number(h) + 90}`, "--window-position=0,0", "--force-device-scale-factor=1"] });
const page = await (await browser.newContext({ viewport: { width: Number(w), height: Number(h) }, deviceScaleFactor: 1 })).newPage();
await page.goto(`${served.base}/labs/graphics/district.html?${query}&w=${w}&h=${h}&hud=0&freeze=20`);
await page.waitForFunction(() => (window as unknown as { __LAB__?: { ready?: boolean; error?: string } }).__LAB__?.ready || (window as unknown as { __LAB__?: { error?: string } }).__LAB__?.error, undefined, { timeout: 120000 });
await page.waitForTimeout(2500);
await page.locator("#view").screenshot({ path: out });
await browser.close();
await served.close();
console.log(out);
