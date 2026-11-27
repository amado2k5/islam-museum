// Checks the palace's fallback in the running game: when granada/p1/palace.gltf is withheld, the model failure must
// be named and the scene must render exactly as `art=a`, whose palace is the first set's. The comparison is of the
// renderer's own triangle count in the same fixed view, not of pixels. It measures this machine and passes no gate.
// Usage: npx tsx --tsconfig tsconfig.json tools/granada-palace-fallback.ts [out.json]
import { writeFileSync } from "node:fs";
import { chromium, type Browser, type Route } from "playwright-core";
import { serveWorkspace } from "./serve";

const [outFile] = process.argv.slice(2);
const SEED = 7;
const POSE = '{ "tx": 30, "ty": 6, "tz": 70, "yaw": 1.41, "pitch": 0.17, "distance": 980 }';
const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--window-size=1320,940", "--window-position=0,0", "--force-device-scale-factor=1"] });

async function run(kind: "control" | "withheld"): Promise<Record<string, unknown>> {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  if (kind === "withheld") await context.route("**/media/models/granada/p1/palace.gltf", (route: Route) => route.fulfill({ status: 404, body: "withheld for the fallback check" }));
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${served.base}/games/granada/index.html?lang=en&fresh=1&seed=${SEED}&music=off&counters=1&q=medium${kind === "control" ? "&art=a" : ""}`);
  await page.waitForFunction("Boolean(window.__GR__ && window.__GR__.ready)", undefined, { timeout: 120_000 });
  await page.waitForFunction("window.__GR__.threeD !== 'pending'", undefined, { timeout: 180_000 });
  if ((await page.evaluate("window.__GR__.threeD")) !== "on") throw new Error("the valley did not start in 3D on this machine");
  await page.waitForFunction("(() => { const i = window.__GR__.stage().info(); return i.models.includes('granada/mill') || i.modelFailures.length > 0; })()", undefined, { timeout: 60_000 });
  await page.evaluate(`window.__GR__.stage().setPose(${POSE}, true)`);
  await page.waitForTimeout(1500);
  const read = await page.evaluate("(() => { const i = window.__GR__.stage().info(); return { models: i.models, modelFailures: i.modelFailures, triangles: i.triangles, drawCalls: i.drawCalls, textures: i.textures, geometries: i.geometries }; })()") as Record<string, unknown>;
  const fetchedPalace = await page.evaluate("performance.getEntriesByType('resource').filter((e) => e.name.includes('/media/models/granada/p1/palace.gltf')).length");
  await context.close();
  return { ...read, fetchedPalace, pageErrors: errors };
}

const control = await run("control");
const withheld = await run("withheld");
const failures = withheld.modelFailures as string[];
const problems: string[] = [];
if (!failures.some((f) => f.startsWith("granada/palace:"))) problems.push(`the withheld palace was not named in modelFailures: ${failures.join(" | ") || "none"}`);
if ((withheld.models as string[]).includes("granada/palace")) problems.push("granada/palace was reported as loaded although its file was withheld");
if (withheld.triangles !== control.triangles) problems.push(`the fallback scene did not match the first set's scene: control ${control.triangles} triangles, withheld ${withheld.triangles}`);
if ((withheld.pageErrors as string[]).length) problems.push(`the page threw: ${(withheld.pageErrors as string[]).join(" | ")}`);
const report = {
  measured: new Date().toISOString(),
  browser: `chrome ${browser.version()}`,
  seed: SEED,
  pose: JSON.parse(POSE),
  control,
  withheld,
  verdict: problems.length ? "fail" : "pass",
  problems,
  note: "The control is the same game with art=a. Equal renderer triangle counts in this fixed view are evidence that the first set's palace is still standing; they are not a visual or performance review.",
};
await browser.close();
await served.close();
if (outFile) writeFileSync(outFile, `${JSON.stringify(report, null, 1)}\n`);
console.log(JSON.stringify(report, null, 1));
if (problems.length) process.exit(1);
