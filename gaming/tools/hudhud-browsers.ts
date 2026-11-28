// Hudhud's Atlas-to-finished-quest path in Firefox and WebKit, through playwright-core only.
// No browser binary is downloaded here. If Firefox/WebKit is not already installed for Playwright, that browser is
// recorded as blocked and the tool continues with the others.
// Usage: npx tsx --tsconfig tsconfig.json tools/hudhud-browsers.ts <base: "local" for the local host over dist/release (tools/local-host.ts); UAT and production are refused, or a local address> <out dir>
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { firefox, webkit, type BrowserType } from "playwright-core";
import { leaveOpening } from "./hudhud-opening";
import { localBase } from "./local-host";

const [baseArg, outArg] = process.argv.slice(2);
if (!baseArg || !outArg) throw new Error("usage: hudhud-browsers.ts <local|base> <out dir>");
const { base, close: closeHost } = await localBase(baseArg === "local" ? undefined : baseArg);
const out = resolve(outArg);
mkdirSync(out, { recursive: true });

async function one(name: "firefox" | "webkit", type: BrowserType) {
  const report: Record<string, unknown> = { browser: name, ran: new Date().toISOString(), base };
  let browser;
  try {
    browser = await type.launch({ headless: false });
  } catch (error) {
    report.blocked = `Playwright's ${name} browser binary is not installed or could not start. No binary was downloaded; install requires the founder's word. ${String(error).split("\n")[0]}`;
    return report;
  }
  try {
    report.version = browser.version();
    const context = await browser.newContext({ viewport: { width: 1440, height: 810 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];
    page.on("pageerror", (e) => consoleErrors.push(`page error: ${e}`));
    page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
    page.on("requestfailed", (r) => failedRequests.push(`${r.url()} ${r.failure()?.errorText ?? ""}`));
    const wait = async (kind: "ready" | "scene", ms: number) => {
      const fn = kind === "ready"
        ? () => (window as any).__HH__ && ((window as any).__HH__.ready || (window as any).__HH__.error)
        : () => (window as any).__HH__ && (window as any).__HH__.where() !== null;
      for (const end = Date.now() + ms; !(await page.evaluate(fn)); ) {
        if (Date.now() > end) return false;
        await page.waitForTimeout(150);
      }
      return true;
    };
    const t0 = Date.now();
    await page.goto(`${base}/hudhud/?lang=en&fresh=1&music=off`);
    report.atlasReady = await wait("ready", 30000);
    report.atlasReadyMs = Date.now() - t0;
    report.openingSkipped = await leaveOpening(page);
    await page.screenshot({ path: resolve(out, `hudhud-${name}-atlas.png`) });
    await page.locator(".hub button.primary").click();
    report.sceneOpened = await wait("scene", 30000);
    await page.waitForTimeout(900);
    report.info = await page.evaluate(() => (window as any).__HH__ ? (window as any).__HH__.info() : null);
    report.webglStarted = (report.info as { renderer?: string } | null)?.renderer === "webgl";
    await page.screenshot({ path: resolve(out, `hudhud-${name}-scene.png`) });
    if (report.sceneOpened) {
      await page.evaluate(() => (window as any).__HH__.command({ type: "skip" }));
      await page.locator(".words li button").first().click().catch(() => undefined);
      await page.evaluate(() => { (window as any).__HH__.touch("mirror-c"); (window as any).__HH__.touch("mirror-e"); });
      await page.waitForTimeout(2200);
      for (let i = 0; i < 12; i++) {
        if (!(await page.evaluate(() => (window as any).__HH__.state().talk !== null))) break;
        await page.evaluate(() => (window as any).__HH__.command({ type: "skip" }));
        await page.waitForTimeout(250);
      }
      await page.evaluate(() => (window as any).__HH__.touch("page"));
      await page.waitForTimeout(500);
      report.done = await page.evaluate(() => (window as any).__HH__.state().done);
      await page.screenshot({ path: resolve(out, `hudhud-${name}-results.png`) });
    }
    report.consoleErrors = consoleErrors;
    report.failedRequests = failedRequests;
    report.problems = [
      ...(report.atlasReady ? [] : ["Atlas did not become ready"]),
      ...(report.sceneOpened ? [] : ["quest scene did not open"]),
      ...(report.webglStarted ? [] : ["WebGL did not start"]),
      ...(report.done ? [] : ["quest did not finish"]),
      ...consoleErrors,
      ...failedRequests.map((x) => `failed request: ${x}`),
    ];
    await context.close();
  } finally {
    await browser.close();
  }
  return report;
}

const channel = (await (await fetch(`${base}/_channel`)).json()) as { current: string; commit: string };
const browsers = [await one("firefox", firefox), await one("webkit", webkit)];
const report = {
  base,
  release: channel.current,
  commit: channel.commit,
  ran: new Date().toISOString(),
  machine: `${process.platform} ${process.arch}`,
  note: "A pass on this machine is not a pass on the two reference machines (M1 Air 8 GB; Windows 11 i5-1135G7 8 GB).",
  browsers,
};
writeFileSync(resolve(out, "hudhud-browsers.json"), `${JSON.stringify(report, null, 1)}\n`);
console.log(JSON.stringify(report, null, 1));
closeHost();
