// Reads a running Golden Age back: do the five authored buildings arrive whole, or is a failure named in
// modelFailures? Against the live host it is the release's read-back; against a workspace server it is the
// fallback check when the files are withheld. Usage: npx tsx --tsconfig tsconfig.json tools/golden-age-models-check.ts [base url: a local address; default the local host over dist/release (tools/local-host.ts); UAT and production are refused]
import { chromium } from "playwright-core";
import { localBase } from "./local-host";

const { base, close: closeHost } = await localBase(process.argv[2], "/golden-age/");
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--window-position=0,0"] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(`${base}?lang=en&music=off&q=high&seed=3`);
await page.waitForFunction(() => (window as unknown as { __GA__?: { ready?: boolean } }).__GA__?.ready, undefined, { timeout: 90000 });
// The buildings load one file at a time; six seconds is far beyond a healthy fetch and short enough for a check.
await page.waitForTimeout(6000);
const info = await page.evaluate(() => {
  const h = (window as unknown as { __GA__: { stage?: { info(): Record<string, unknown> } } }).__GA__;
  return h.stage?.info() ?? null;
});
await browser.close();
closeHost();
console.log(JSON.stringify({ base, modelFailures: info?.modelFailures ?? "the build does not count them", drawCalls: info?.drawCalls, triangles: info?.triangles, pageErrors: errors }));
