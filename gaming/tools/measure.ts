// Opens one game in real Chrome, asks it to count itself (?counters=1), lets it run, and prints what it counted:
// frame times, the heap, the renderer's own figures, and what is alive. The machine, the browser and the size are
// written with it, because a figure without them is not evidence. It measures the machine it runs on and no other.
// Usage: npx tsx --tsconfig tsconfig.json tools/measure.ts <address or local:/games/granada/index.html?...> [seconds=20] [out.json]
//        WIDTH, HEIGHT and DPR set the window (1920, 1080, 1); BEGIN=1 presses Granada's Begin and lets the days run;
//        POSE (a JSON camera pose) and DAYS choose the view and the season to measure.
import { writeFileSync } from "node:fs";
import { chromium } from "playwright-core";
import { serveWorkspace } from "./serve";

const [target, secondsArg = "20", outFile] = process.argv.slice(2);
if (!target) throw new Error("usage: measure.ts <address or local:/path?query> [seconds] [out.json]");
const seconds = Number(secondsArg);
const width = Number(process.env.WIDTH ?? 1920);
const height = Number(process.env.HEIGHT ?? 1080);
const dpr = Number(process.env.DPR ?? 1);
const served = target.startsWith("local:") ? await serveWorkspace() : null;
const address = (served ? `${served.base}${target.slice(6)}` : target) + (target.includes("?") ? "&" : "?") + "counters=1&music=off";
const browser = await chromium.launch({ channel: process.env.BROWSER ?? "chrome", headless: false, args: ["--mute-audio", `--window-size=${width + 40},${height + 140}`, "--window-position=0,0", `--force-device-scale-factor=${dpr}`] });
const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr });
const page = await context.newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error" && !m.text().includes("favicon")) errors.push(m.text());
});
await page.goto(address);
const hook = "(window.__GR__ || window.__GA__)";
for (const end = Date.now() + 120_000; !(await page.evaluate(`Boolean(${hook} && ${hook}.ready && ${hook}.counters)`)); ) {
  if (Date.now() > end) throw new Error("the game did not start with its counters");
  await page.waitForTimeout(200);
}
// Granada draws in 3D a moment after it can be played; wait for that, then for its models.
if (await page.evaluate("Boolean(window.__GR__)")) {
  for (const end = Date.now() + 120_000; (await page.evaluate("window.__GR__.threeD")) === "pending" && Date.now() < end; ) await page.waitForTimeout(200);
  if (process.env.BEGIN) {
    await page.locator("#brief-start").click().catch(() => {});
    await page.keyboard.press("p").catch(() => {});
  }
  await page.waitForTimeout(6000);
}
// POSE sets Granada's camera first (a JSON pose), and DAYS lets that many days pass, to measure a chosen view.
if (process.env.DAYS) await page.evaluate(`window.__GR__.days(${Number(process.env.DAYS)})`);
if (process.env.POSE) {
  await page.evaluate(`window.__GR__.stage().setPose(${process.env.POSE}, true)`);
  await page.waitForTimeout(4000);
}
await page.evaluate(`${hook}.countersStartOver && ${hook}.countersStartOver()`);
await page.waitForTimeout(seconds * 1000);
const snapshot = await page.evaluate(`${hook}.counters()`);
const machine = await page.evaluate("(async () => { const a = navigator.gpu ? await navigator.gpu.requestAdapter() : null; const i = a ? a.info ?? {} : {}; return { userAgent: navigator.userAgent, cores: navigator.hardwareConcurrency, deviceMemoryGb: navigator.deviceMemory ?? null, gpu: a ? { vendor: i.vendor ?? '', architecture: i.architecture ?? '', description: i.description ?? '' } : 'no WebGPU adapter', devicePixelRatio, inner: [innerWidth, innerHeight] }; })()");
const report = { address, seconds, measured: new Date().toISOString(), browser: `${process.env.BROWSER ?? "chrome"} ${browser.version()}`, machine, snapshot, consoleErrors: errors, note: "Measured on the machine named here. It is not one of the minimum machines, and passes no performance gate." };
await browser.close();
await served?.close();
console.log(JSON.stringify(report, null, 1));
if (outFile) writeFileSync(outFile, `${JSON.stringify(report, null, 1)}\n`);
