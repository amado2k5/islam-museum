// Runs the graphics lab in a real, installed browser on this machine's GPU and writes the evidence: one JSON file of
// measurements and one PNG capture per run. Nothing here is simulated; if the browser cannot give a hardware WebGPU
// adapter the run fails and says why.
//
// Usage:
//   npx tsx tools/bench.ts --out ../docs/gaming/evidence/m1 [--channel chrome|msedge] [--engines three,babylon]
//       [--presets parity] [--size 2560x1440] [--seconds 30] [--uncapped] [--stills establishing,market]
//
// The tool serves the workspace itself on a free port (pass --base <url> to use a server that is already running).
// --uncapped starts the browser with frame-rate limiting off, which is
// a measurement mode only (it needs command-line switches, so it is never a requirement for players).
import { mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import type {} from "../labs/graphics/src/main";
import { serveWorkspace } from "./serve";

const args = new Map<string, string>();
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i]!;
  if (!a.startsWith("--")) continue;
  const next = process.argv[i + 1];
  if (next && !next.startsWith("--")) {
    args.set(a.slice(2), next);
    i++;
  } else args.set(a.slice(2), "1");
}
const out = resolve(args.get("out") ?? "bench-out");
const channel = args.get("channel") ?? "chrome";
const engines = (args.get("engines") ?? "three,babylon").split(",");
const presets = (args.get("presets") ?? "parity").split(",");
const [w, h] = (args.get("size") ?? "2560x1440").split("x").map(Number) as [number, number];
const seconds = Number(args.get("seconds") ?? 30);
const uncapped = args.has("uncapped");
const stills = (args.get("stills") ?? "").split(",").filter(Boolean);
const tod = args.get("tod") ?? "golden";
const own = args.has("base") ? null : await serveWorkspace();
const base = args.get("base") ?? own!.base;
const headless = args.has("headless");
mkdirSync(out, { recursive: true });

const git = (...a: string[]) => {
  try {
    return execFileSync("git", a, { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
};

async function main(): Promise<void> {
  const browser = await chromium.launch({
    channel,
    headless,
    args: [
      `--window-size=${w},${h + 90}`,
      "--window-position=0,0",
      "--force-device-scale-factor=1",
      "--hide-scrollbars",
      ...(uncapped ? ["--disable-gpu-vsync", "--disable-frame-rate-limit"] : []),
    ],
  });
  const context = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const version = browser.version();
  const results: unknown[] = [];
  const meta = { commit: git("rev-parse", "HEAD"), dirty: git("status", "--porcelain", "--", ".").length > 0, browserChannel: channel, browserVersion: version, headless, uncapped, requested: { w, h, seconds, tod }, startedAt: new Date().toISOString() };

  const open = async (query: string) => {
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.goto(`${base}/labs/graphics/district.html?${query}`, { waitUntil: "load" });
    await page.waitForFunction(() => window.__LAB__ && (window.__LAB__.ready || window.__LAB__.error), undefined, { timeout: 120_000 });
    const err = await page.evaluate(() => window.__LAB__?.error ?? null);
    if (err) throw new Error(`lab failed (${query}): ${err}`);
    return { page, errors };
  };

  for (const engine of engines) {
    for (const preset of presets) {
      const name = `${engine}-${preset}-${w}x${h}${uncapped ? "-uncapped" : ""}`;
      console.log(`bench ${name} …`);
      const { page, errors } = await open(`engine=${engine}&preset=${preset}&tod=${tod}&view=loop&w=${w}&h=${h}&bench=${seconds}&warmup=5&hud=0`);
      await page.waitForFunction(() => Boolean(window.__LAB__?.bench), undefined, { timeout: (seconds + 60) * 1000 });
      const bench = await page.evaluate(() => window.__LAB__!.bench);
      results.push({ name, ...bench, consoleErrors: errors });
      await page.close();
    }
    for (const view of stills) {
      for (const preset of presets) {
        const { page } = await open(`engine=${engine}&preset=${preset}&tod=${tod}&view=${view}&w=${w}&h=${h}&hud=0&freeze=20`);
        await page.waitForTimeout(2500);
        const file = `${engine}-${preset}-${tod}-${view}-${w}x${h}.png`;
        await page.locator("#view").screenshot({ path: resolve(out, file) });
        console.log(`still ${file}`);
        await page.close();
      }
    }
  }
  await browser.close();
  await own?.close();
  const file = resolve(out, `bench-${channel}-${w}x${h}${uncapped ? "-uncapped" : ""}.json`);
  writeFileSync(file, JSON.stringify({ meta, results }, null, 1) + "\n");
  console.log(`wrote ${file}`);
}

main().catch(async (e) => {
  console.error(e);
  await own?.close();
  process.exit(1);
});

