// Granada's long run: the cycle of the hardware test package (a day's orders, a harvest, a sale, a camera move, a
// change of tab), repeated in real Chrome for as many minutes as asked, with the game counting itself and a line
// written every minute. Every half hour the tab is sent to the background and brought back; every hour the window
// is resized and put back. The game plays its years at its fast speed, in the 3D valley, by the steward's own
// orders, given about once a day; a won year goes on to the next, a lost one or the last begins the campaign afresh.
//
// It measures the machine it runs on and no other. A run on the developer's machine is not a hardware gate: those
// are run on the founder's minimum machines by a named person, who stays with the machine (see
// docs/gaming/qa/hardware-test-package.md). The operator's own notes are not written by this tool.
// Usage: npx tsx --tsconfig tsconfig.json tools/granada-soak.ts <out dir> [minutes=60] [address or local]
//        WIDTH, HEIGHT, DPR set the window (1920, 1080, 1); Q sets the picture preset (low, medium, high).
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { serveWorkspace } from "./serve";

const [outArg, minutesArg = "60", target = "local"] = process.argv.slice(2);
if (!outArg) throw new Error("usage: granada-soak.ts <out dir> [minutes] [address or local]");
const out = resolve(outArg);
mkdirSync(out, { recursive: true });
const minutes = Number(minutesArg);
const width = Number(process.env.WIDTH ?? 1920);
const height = Number(process.env.HEIGHT ?? 1080);
const dpr = Number(process.env.DPR ?? 1);
const served = target === "local" ? await serveWorkspace() : null;
const base = served ? `${served.base}/games/granada/index.html` : target;
const address = `${base}${base.includes("?") ? "&" : "?"}lang=en&seed=7&music=off&fresh=1&counters=1${process.env.Q ? `&q=${process.env.Q}` : ""}`;

const browser = await chromium.launch({ channel: process.env.BROWSER ?? "chrome", headless: false, args: ["--mute-audio", `--window-size=${width + 40},${height + 140}`, "--window-position=0,0", `--force-device-scale-factor=${dpr}`] });
const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr });
const page = await context.newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error" && !m.text().includes("favicon")) errors.push(m.text());
});
const game = <T>(expression: string) => page.evaluate(expression) as Promise<T>;
const until = async (expression: string, ms: number) => {
  for (const end = Date.now() + ms; !(await game<boolean>(expression)); ) {
    if (Date.now() > end) throw new Error(`waited ${ms} ms for ${expression}`);
    await page.waitForTimeout(200);
  }
};
await page.goto(address);
await until("Boolean(window.__GR__ && window.__GR__.ready && window.__GR__.counters)", 120_000);
await until("window.__GR__.threeD !== 'pending'", 120_000);
const threeD = await game<string>("window.__GR__.threeD");
await page.locator("#brief-start").click();
await page.waitForTimeout(5000);

/** One day's orders, as a steward would give them: said to the game through its own order hook, a refusal being an answer. */
const ORDERS = `(() => {
  const g = window.__GR__;
  const s = g.state();
  if (s.outcome) return "over";
  const stock = (good) => s.economy.stock[good]?.quantity ?? 0;
  for (const d of Object.entries(s.decisions)) if (d[1].state === "open") g.order({ kind: "decide", decision: d[0], option: "refuse" });
  for (const [id, p] of Object.entries(s.plots)) if (p.ripeSince !== null && p.standing > 0 && p.harvesting === null) g.order({ kind: "harvest", plot: id, rest: "wait" });
  g.order({ kind: "repair" });
  g.order({ kind: "expand" });
  for (const [id, p] of Object.entries(s.plots)) if (p.crop === null) { g.order({ kind: "plant", plot: id, crop: "vegetables" }); g.order({ kind: "plant", plot: id, crop: "wheat" }); }
  for (const c of Object.values(s.economy.contracts)) if (c.state === "offered") g.order({ kind: "accept", contract: c.id });
  if (stock("olives") >= 5) g.order({ kind: "press", runs: Math.floor(stock("olives") / 5) });
  for (const c of Object.values(s.economy.contracts)) {
    if (c.state !== "accepted") continue;
    const coming = s.shipments.reduce((n, sh) => n + (sh.contract === c.id ? sh.quantity : 0), 0);
    const n = Math.min(c.units - c.delivered - coming, c.good === "oil" ? stock("oil") : Math.max(0, stock(c.good) - 60));
    if (n > 0) g.order({ kind: "deliver", contract: c.id, quantity: n });
  }
  if (s.day % 9 === 0 && stock("timber") > 80) g.order({ kind: "sell", good: "timber", quantity: 5 });
  // What is built is what the year asks for: a house while there are fewer than the year wants housed, the cisterns
  // a later year names, a granary once; and grain before buildings when the store is thin.
  const asked = Object.keys(s.quests);
  const houses = s.placed.filter((p) => p.what === "house").length;
  const cisterns = s.placed.filter((p) => p.what === "cistern").length;
  const days = Math.floor((stock("wheat") + stock("vegetables")) / Math.ceil(s.households / 10));
  if (days < 26 && s.economy.treasury.available > 30000) g.order({ kind: "buy", good: "wheat", quantity: 20 });
  if (s.households >= s.housing && houses < s.year && days >= 20) g.order({ kind: "place", what: "house", x: 600 + 40 * houses, z: 250 });
  if (cisterns < (asked.includes("d1-cisterns") ? 2 : asked.includes("m4-cistern") ? 1 : 0)) {
    if (stock("stone") < 40) g.order({ kind: "buy", good: "stone", quantity: 40 - stock("stone") });
    g.order({ kind: "place", what: "cistern", x: 560, z: 60 + 30 * cisterns });
  }
  if (!s.placed.some((p) => p.what === "granary")) g.order({ kind: "place", what: "granary", x: -420, z: 60 });
  return "day " + s.day;
})()`;
const POSES = [
  { tx: 30, ty: 6, tz: 70, yaw: 1.41, pitch: 0.17, distance: 600 },
  { tx: 110, ty: 8, tz: 170, yaw: 1.2, pitch: 0.6, distance: 190 },
  { tx: 640, ty: 30, tz: 0, yaw: 1.07, pitch: 0.17, distance: 330 },
  { tx: 60, ty: 6, tz: 40, yaw: 1.57, pitch: 0.9, distance: 860 },
  { tx: 600, ty: 8, tz: 250, yaw: 1.2, pitch: 0.5, distance: 140 },
];

const lines: Array<Record<string, unknown>> = [];
const began = Date.now();
const startedAt = new Date().toISOString();
let years = 0;
let cycles = 0;
await game("window.__GR__.countersStartOver()");
await page.locator("#speed-2").click();
for (let minute = 1; minute <= minutes; minute++) {
  const end = began + minute * 60_000;
  while (Date.now() < end) {
    cycles += 1;
    // The steward gives the day's orders about as often as a day passes at this speed, so that the years can be won.
    let said = "";
    for (let i = 0; i < 6 && said !== "over"; i++) {
      said = await game<string>(ORDERS);
      await page.waitForTimeout(430);
    }
    if (said === "over") {
      // A year is over: on to the next where there is one and it was won, the campaign afresh otherwise.
      years += 1;
      if (await page.locator("#go-on").count()) {
        await page.locator("#go-on").click();
        await page.locator("#brief-start").click();
      } else await page.locator("#new-year").click();
      await page.locator("#speed-2").click();
    }
    // A camera move and a change of tab, as a person would make while the days pass.
    if (threeD === "on") await game(`window.__GR__.stage().setPose(${JSON.stringify(POSES[cycles % POSES.length])})`);
    await page.keyboard.press(String(1 + (cycles % 5)));
    // Now and then: a field chosen, and Photo Mode visited.
    if (threeD === "on" && cycles % 11 === 0 && (await page.locator("#view-photo").count())) {
      await page.locator("#view-photo").click();
      await page.locator("#photo-light").selectOption(["morning", "midday", "evening"][cycles % 3]!);
      await page.waitForTimeout(700);
      await page.locator("#photo-exit").click();
      await page.locator("#speed-2").click();
    }
  }
  // Each half hour the tab goes to the background for twenty seconds; each hour the window is resized and put back.
  if (minute % 30 === 0) {
    const other = await context.newPage();
    await other.goto("about:blank");
    await other.bringToFront();
    await other.waitForTimeout(20_000);
    await page.bringToFront();
    await other.close();
  }
  if (minute % 60 === 0) {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(3000);
    await page.setViewportSize({ width, height });
  }
  const c = await game<{ frames: { frames: number; p50Ms: number; p95Ms: number; p99Ms: number; over33_3: number; over50: number; longestUnder30FpsMs: number }; loops: number; heapMb: number | null; contexts: Record<string, number>; intervals: number; workers: number; listeners: number; provided?: { renderer?: { geometries: number; textures: number; triangles: number; drawCalls: number } | null } }>("window.__GR__.counters()");
  const line = {
    minute,
    frames: c.frames.frames,
    p50Ms: c.frames.p50Ms,
    p95Ms: c.frames.p95Ms,
    p99Ms: c.frames.p99Ms,
    over33Ms: c.frames.over33_3,
    over50Ms: c.frames.over50,
    longestUnder30FpsMs: c.frames.longestUnder30FpsMs,
    loops: c.loops,
    heapMb: c.heapMb,
    geometries: c.provided?.renderer?.geometries ?? null,
    textures: c.provided?.renderer?.textures ?? null,
    triangles: c.provided?.renderer?.triangles ?? null,
    contexts: c.contexts,
    intervals: c.intervals,
    workers: c.workers,
    listeners: c.listeners,
    year: await game<number>("window.__GR__.state().year"),
    day: await game<number>("window.__GR__.state().day"),
    yearsEnded: years,
    errors: errors.length,
  };
  lines.push(line);
  console.error(JSON.stringify(line));
  await game("window.__GR__.countersStartOver()");
}

// What the lines say together. The first three minutes are warm-up; growth is the last minute beside the fourth.
const settled = lines.slice(Math.min(3, lines.length - 1));
const heaps = settled.map((l) => l.heapMb as number | null).filter((v): v is number => v !== null);
const steady = (key: "geometries" | "textures" | "intervals" | "workers" | "loops") => new Set(settled.map((l) => JSON.stringify(l[key]))).size === 1;
const report = {
  tool: "granada-soak",
  note: "Measured on the machine named here and no other. Not a hardware gate unless run on a minimum machine by a named operator.",
  address: served ? "the developer's own server" : target,
  browser: `${process.env.BROWSER ?? "chrome"} ${browser.version()}`,
  userAgent: await game<string>("navigator.userAgent"),
  gpu: await game<string>("(async () => { if (!navigator.gpu) return 'no navigator.gpu'; const a = await navigator.gpu.requestAdapter(); if (!a) return 'no adapter'; const i = a.info ?? {}; return [i.vendor, i.architecture, i.device, i.description].filter(Boolean).join(' ') || 'adapter without details'; })()"),
  window: [width, height],
  devicePixelRatio: dpr,
  preset: process.env.Q ?? (await game<string>("window.__GR__.quality")),
  threeD,
  minutes,
  cycles,
  yearsEnded: years,
  summary: {
    worstP95Ms: Math.max(...lines.map((l) => l.p95Ms as number)),
    framesOver33Ms: lines.reduce((n, l) => n + (l.over33Ms as number), 0),
    framesOver50Ms: lines.reduce((n, l) => n + (l.over50Ms as number), 0),
    longestUnder30FpsMs: Math.max(...lines.map((l) => l.longestUnder30FpsMs as number)),
    heapMbAfterWarmUp: heaps[0] ?? null,
    heapMbAtEnd: heaps.at(-1) ?? null,
    heapGrowthPercent: heaps.length > 1 ? Math.round((1000 * (heaps.at(-1)! - heaps[0]!)) / heaps[0]!) / 10 : null,
    geometriesSteady: steady("geometries"),
    texturesSteady: steady("textures"),
    intervalsSteady: steady("intervals"),
    workersSteady: steady("workers"),
    loopsSteady: steady("loops"),
    listenersFirstAndLast: [settled[0]?.listeners ?? null, settled.at(-1)?.listeners ?? null],
    consoleErrors: errors.slice(0, 10),
  },
  // The same run in the form of docs/gaming/qa/hardware-results.template.json, for an operator to put into that
  // file under "runs". Frame figures are the worst minute's, since the minutes are counted apart; what only a
  // person at the machine can say (a blank canvas, doubled sound, how the tab came back) is left for them.
  asHardwareRun: {
    game: "granada",
    preset: process.env.Q ?? "as chosen on the page",
    script: minutes >= 240 ? "four-hour" : minutes >= 60 ? "60-minute" : `${minutes}-minute trial`,
    started: startedAt,
    ended: new Date().toISOString(),
    completed: lines.length === minutes,
    frames: {
      medianMs: Math.max(...lines.map((l) => l.p50Ms as number)),
      p95Ms: Math.max(...lines.map((l) => l.p95Ms as number)),
      p99Ms: Math.max(...lines.map((l) => l.p99Ms as number)),
      over33ms: lines.reduce((n, l) => n + (l.over33Ms as number), 0),
      over50ms: lines.reduce((n, l) => n + (l.over50Ms as number), 0),
      longestRunUnder30fpsSeconds: Math.max(...lines.map((l) => l.longestUnder30FpsMs as number)) / 1000,
    },
    memoryMb: { afterWarmUp: heaps[0] ?? null, atEnd: heaps.at(-1) ?? null, growthPercentAcrossIdenticalCycles: heaps.length > 1 ? Math.round((1000 * (heaps.at(-1)! - heaps[0]!)) / heaps[0]!) / 10 : null, howMeasured: "performance.memory.usedJSHeapSize each minute, in browsers that report it: the JavaScript heap only, not graphics memory; the years played differ in weather, so the cycles are alike and not identical" },
    counts: { start: settled[0] ?? null, end: settled.at(-1) ?? null, note: "each minute's line: graphics contexts, textures, geometries, timers, workers, listeners" },
    seen: { blankCanvas: null, contextLostAndNotRecovered: null, secondRenderLoop: !steady("loops"), doubledSound: null, backgroundTabResumedSafely: null },
    operatorNotes: "",
  },
  lines,
};
writeFileSync(resolve(out, "granada-soak.json"), `${JSON.stringify(report, null, 1)}\n`);
console.log(JSON.stringify({ ...report, lines: `${lines.length} lines` }, null, 1));
await browser.close();
await served?.close();
