// Scans Granada's page with axe-core in real Chrome, in each of the states a player meets (the brief, each of the
// five parts, a site being chosen, a question open, the help, Photo Mode's controls, a year's end), in a
// left-to-right and a right-to-left language, against the WCAG 2.2 A and AA rules axe can test by machine.
// A machine finds only part of what makes a page usable: a clean scan is not conformance, and says nothing of a
// screen reader's experience. It is a net for the faults a machine can catch.
//
// axe-core is not a dependency of the games. Give the path to its axe.min.js as AXE, or run from a checkout of the
// museum where it is installed (it is then found two folders up).
// Usage: [AXE=/path/to/axe.min.js] npx tsx --tsconfig tsconfig.json tools/granada-a11y.ts <out dir> [langs=en,ar]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type Page } from "playwright-core";
import { serveWorkspace } from "./serve";

const [outArg, langsArg = "en,ar"] = process.argv.slice(2);
if (!outArg) throw new Error("usage: granada-a11y.ts <out dir> [langs]");
const out = resolve(outArg);
mkdirSync(out, { recursive: true });
const axePath = process.env.AXE ?? resolve(import.meta.dirname, "../../node_modules/axe-core/axe.min.js");
if (!existsSync(axePath)) throw new Error(`axe-core was not found at ${axePath}; give its path as AXE`);
const axe = readFileSync(axePath, "utf8");

const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--window-size=1500,1000", "--window-position=0,0", "--force-device-scale-factor=1"] });
interface Finding {
  state: string;
  lang: string;
  rule: string;
  impact: string | null;
  help: string;
  nodes: Array<{ target: string; html: string; summary: string }>;
}
const findings: Finding[] = [];
const scanned: Array<{ lang: string; state: string; violations: number; passes: number }> = [];

async function scan(page: Page, lang: string, state: string): Promise<void> {
  if (!(await page.evaluate("Boolean(window.axe)"))) await page.addScriptTag({ content: axe });
  const result = (await page.evaluate(`window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] }, resultTypes: ["violations", "passes"] })`)) as {
    violations: Array<{ id: string; impact: string | null; help: string; nodes: Array<{ target: string[]; html: string; failureSummary?: string }> }>;
    passes: unknown[];
  };
  scanned.push({ lang, state, violations: result.violations.length, passes: result.passes.length });
  for (const v of result.violations) findings.push({ state, lang, rule: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 6).map((n) => ({ target: n.target.join(" "), html: n.html.slice(0, 220), summary: (n.failureSummary ?? "").replace(/\s+/g, " ").slice(0, 260) })) });
}

for (const lang of langsArg.split(",")) {
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })).newPage();
  const game = <T>(expression: string) => page.evaluate(expression) as Promise<T>;
  const open = async (extra: string) => {
    await page.goto(`${served.base}/games/granada/index.html?lang=${lang}&seed=7&music=off&fresh=1${extra}`);
    await page.waitForFunction("Boolean(window.__GR__ && window.__GR__.ready)");
  };
  // ---- On the plan: the page as it is for a player with no 3D, and for every assistive technology ----
  await open("&view=plan&no3d=1");
  await scan(page, lang, "the brief");
  await page.locator("#brief-start").click();
  for (const [key, name] of [["1", "overview"], ["2", "fields"], ["3", "construction"], ["4", "economy"], ["5", "ledger"]] as const) {
    await page.keyboard.press(key);
    await scan(page, lang, name);
  }
  await page.keyboard.press("3");
  await page.locator("[data-act='place-house']").click();
  await scan(page, lang, "a site being chosen");
  await page.keyboard.press("Escape");
  await page.locator("svg.map .store.opens").first().focus();
  await page.keyboard.press("Enter");
  await scan(page, lang, "a building chosen");
  await page.keyboard.press("h");
  await scan(page, lang, "the help");
  await page.keyboard.press("Escape");
  // A question open, a contract taken, olives pressed, a load on the road, a building going up.
  await game(`(() => { const g = window.__GR__; g.order({ kind: "harvest", plot: "mill-field", rest: "wait" }); g.order({ kind: "repair" }); g.order({ kind: "accept", contract: "oil-for-the-port" }); g.order({ kind: "place", what: "garden", x: 300, z: 262 }); g.order({ kind: "send", good: "wheat", quantity: 10 }); while (Object.values(g.state().decisions)[0].state === "ahead") g.days(1); })()`);
  await page.keyboard.press("1");
  await scan(page, lang, "a question open");
  await page.keyboard.press("4");
  await scan(page, lang, "economy with a contract and a load on the road");
  await page.keyboard.press("5");
  await scan(page, lang, "ledger with a journal");
  await game("(() => { const g = window.__GR__; while (!g.state().outcome) g.days(1); })()");
  await scan(page, lang, "a year's end");
  // ---- In the 3D valley: the panels round the land, and Photo Mode's controls ----
  await open("");
  await page.locator("#brief-start").click();
  for (const end = Date.now() + 120_000; (await game<string>("window.__GR__.threeD")) === "pending" && Date.now() < end; ) await page.waitForTimeout(200);
  if ((await game<string>("window.__GR__.threeD")) === "on") {
    await page.waitForTimeout(2000);
    await scan(page, lang, "the 3D valley, overview");
    await page.keyboard.press("3");
    await scan(page, lang, "the 3D valley, construction");
    await page.locator("#view-photo").click();
    await scan(page, lang, "photo mode");
    await page.keyboard.press("Escape");
  }
  await page.context().close();
}

// One line for each rule broken, with where, however many states it was seen in.
const byRule = new Map<string, { rule: string; impact: string | null; help: string; states: Set<string>; example: Finding["nodes"][number] | null; targets: Set<string> }>();
for (const f of findings) {
  const r = byRule.get(f.rule) ?? { rule: f.rule, impact: f.impact, help: f.help, states: new Set<string>(), example: f.nodes[0] ?? null, targets: new Set<string>() };
  r.states.add(`${f.lang}: ${f.state}`);
  for (const n of f.nodes) r.targets.add(n.target);
  byRule.set(f.rule, r);
}
const report = {
  tool: "granada-a11y",
  note: "Machine-testable WCAG 2.2 A and AA rules only, by axe-core. A clean scan is not conformance.",
  axe: (/axe v([0-9.]+)/.exec(axe) ?? [])[1] ?? "unknown",
  browser: `chrome ${browser.version()}`,
  scanned,
  rules: [...byRule.values()].map((r) => ({ rule: r.rule, impact: r.impact, help: r.help, seenIn: [...r.states], targets: [...r.targets].slice(0, 12), example: r.example })),
};
writeFileSync(resolve(out, "granada-a11y.json"), `${JSON.stringify(report, null, 1)}\n`);
console.log(JSON.stringify({ states: scanned.length, rulesBroken: report.rules.map((r) => `${r.rule} (${r.impact}): ${r.help} [${r.seenIn.length} states; e.g. ${r.targets.slice(0, 3).join(" | ")}]`) }, null, 1));
await browser.close();
await served.close();
if (report.rules.length) process.exit(1);
