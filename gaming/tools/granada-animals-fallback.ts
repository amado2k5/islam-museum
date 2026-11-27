// Checks the animals' fallback in the running game: when the authored animals cannot be fetched, every one of them
// must be named in modelFailures and the valley must go on drawing its code-made sheep, goats, horses, oxen and
// donkeys. The positive control is the same game with the files served: the five kinds must be reported loaded.
// It measures this machine and passes no gate.
// Usage: npx tsx --tsconfig tsconfig.json tools/granada-animals-fallback.ts [out.json]
import { writeFileSync } from "node:fs";
import { chromium, type Route } from "playwright-core";
import { serveWorkspace } from "./serve";

const [outFile] = process.argv.slice(2);
const SEED = 7;
const KINDS = ["sheep", "goat", "horse", "ox", "donkey"];
const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--window-size=1320,940", "--window-position=0,0", "--force-device-scale-factor=1"] });

async function run(kind: "control" | "withheld"): Promise<Record<string, unknown>> {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  if (kind === "withheld") await context.route("**/media/models/granada/animals/*", (route: Route) => route.fulfill({ status: 404, body: "withheld for the fallback check" }));
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${served.base}/games/granada/index.html?lang=en&fresh=1&seed=${SEED}&music=off&counters=1&q=medium`);
  await page.waitForFunction("Boolean(window.__GR__ && window.__GR__.ready)", undefined, { timeout: 120_000 });
  await page.waitForFunction("window.__GR__.threeD !== 'pending'", undefined, { timeout: 180_000 });
  if ((await page.evaluate("window.__GR__.threeD")) !== "on") throw new Error("the valley did not start in 3D on this machine");
  // Wait until every animal file has either arrived or failed: the check is meaningless before the fetches settle.
  await page.waitForFunction(
    `(() => { const i = window.__GR__.stage().info(); return ${KINDS.length} <= i.models.filter((m) => m.startsWith('granada/animals/')).length + i.modelFailures.filter((f) => f.startsWith('granada/animals/')).length; })()`,
    undefined,
    { timeout: 60_000 },
  );
  await page.waitForTimeout(1200);
  const read = await page.evaluate("(() => { const i = window.__GR__.stage().info(); return { models: i.models, modelFailures: i.modelFailures, triangles: i.triangles, drawCalls: i.drawCalls }; })()") as Record<string, unknown>;
  await context.close();
  return { ...read, pageErrors: errors };
}

const control = await run("control");
const withheld = await run("withheld");
const problems: string[] = [];
const failures = withheld.modelFailures as string[];
for (const kind of KINDS) {
  if (!failures.some((f) => f.startsWith(`granada/animals/${kind}:`))) problems.push(`the withheld ${kind} was not named in modelFailures`);
  if ((withheld.models as string[]).includes(`granada/animals/${kind}`)) problems.push(`granada/animals/${kind} was reported as loaded although its file was withheld`);
  if (!(control.models as string[]).includes(`granada/animals/${kind}`)) problems.push(`the control did not load granada/animals/${kind}: is the media in place?`);
}
if ((withheld.pageErrors as string[]).length) problems.push(`the page threw: ${(withheld.pageErrors as string[]).join(" | ")}`);
// The code-made animals still stand: the scene keeps the great part of its triangles. How many exactly depends on
// which machine draws it, so the band is wide; what matters is that the valley did not empty.
if ((withheld.triangles as number) < ((control.triangles as number) * 2) / 3) problems.push(`the fallback scene lost far more than the authored animals cost: control ${control.triangles}, withheld ${withheld.triangles}`);
const report = {
  measured: new Date().toISOString(),
  browser: `chrome ${browser.version()}`,
  seed: SEED,
  control,
  withheld,
  verdict: problems.length ? "fail" : "pass",
  problems,
  note: "Evidence that with the files withheld the failures are named and the game still draws its animals from code, and that with the files present all five kinds load. Not a visual or performance review.",
};
await browser.close();
await served.close();
if (outFile) writeFileSync(outFile, `${JSON.stringify(report, null, 1)}\n`);
console.log(JSON.stringify(report, null, 1));
if (problems.length) process.exit(1);
