// Opens Granada on a deployed host (UAT by default) in real Chrome and tries, under the host's own headers, the
// systems a release may carry: the contract, the oil's road, a building placed on the land, the neighbours'
// question, Photo Mode and its saved picture, and the second year. It reads only: it runs in a fresh browser
// context, so the only saved game it touches is its own, and nothing on the host is changed.
// A check that cannot run because the release on the host does not yet have that system is reported as "absent",
// not as a failure: the report says what the live release has.
// Usage: npx tsx --tsconfig tsconfig.json tools/granada-uat.ts [base=https://uat-games.islam.museum] [lang=en] [out dir]
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "https://uat-games.islam.museum";
const lang = process.argv[3] ?? "en";
const out = process.argv[4] ? resolve(process.argv[4]) : null;
if (out) mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--window-size=1500,1000", "--window-position=0,0", "--force-device-scale-factor=1"] });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, acceptDownloads: true });
const page = await context.newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("response", (r) => {
  if (r.status() >= 400 && !r.url().endsWith(".m4a")) errors.push(`${r.status()} ${r.url()}`);
});
const game = <T>(expression: string) => page.evaluate(expression) as Promise<T>;
/** Waits for something to be true in the page by asking again and again: the host's policy forbids a page-side wait written as text. */
const until = async (expression: string, ms: number) => {
  for (const end = Date.now() + ms; !(await game<boolean>(expression)); ) {
    if (Date.now() > end) throw new Error(`waited ${ms} ms for ${expression}`);
    await page.waitForTimeout(200);
  }
};
const channel = (await (await fetch(`${base}/_channel`)).json()) as { current: string };
const checks: Array<{ check: string; result: "pass" | "fail" | "absent"; detail?: unknown }> = [];
const note = (check: string, result: "pass" | "fail" | "absent", detail?: unknown) => checks.push({ check, result, ...(detail === undefined ? {} : { detail }) });
const open = async (extra = "") => {
  await page.goto(`${base}/granada/?lang=${lang}&seed=7&music=off&fresh=1${extra}`);
  await until("Boolean(window.__GR__ && (window.__GR__.ready || window.__GR__.error))", 90_000);
  if (!(await game<boolean>("window.__GR__.ready"))) throw new Error(`the game did not start: ${await game<string>("window.__GR__.error")}`);
  await page.locator("#brief-start").click();
};

await open("&view=plan");
note("the game starts on the host", "pass", { release: channel.current });

// ---- The contract and the oil's road ----
await page.keyboard.press("4");
if ((await page.locator("[data-part='contract']").count()) === 0) note("a contract with the port", "absent");
else {
  await page.locator("[data-act='accept-oil-for-the-port']").click();
  const held = await game<number>("window.__GR__.state().economy.treasury.reserved");
  note("a contract with the port can be taken, and its costs are set aside", held === 5200 ? "pass" : "fail", { held });
}
note("the oil's road has five steps", (await page.locator("[data-part='chain']").count()) === 0 ? "absent" : (await page.locator("[data-part='chain'] [data-step]").count()) === 5 ? "pass" : "fail");

// ---- A building placed on the land, and refused on a field ----
await page.keyboard.press("3");
if ((await page.locator("[data-act='place-garden']").count()) === 0) note("a building placed on the land", "absent");
else {
  const refused = await game<boolean>(`window.__GR__.order({ kind: "place", what: "garden", x: 300, z: 120 })`);
  const placed = await game<boolean>(`window.__GR__.order({ kind: "place", what: "garden", x: 300, z: 262 })`);
  await game("window.__GR__.days(3)");
  const done = await game<boolean>("Boolean(window.__GR__.state().placed[0]?.done)");
  note("a garden is refused on a field, placed on open ground, and finished in its days", !refused && placed && done ? "pass" : "fail", { refused, placed, done });
}

// ---- The region ----
await page.keyboard.press("1");
note("the region shows the museum's places", (await page.locator("[data-part='region']").count()) === 0 ? "absent" : (await page.locator("svg.region [data-place]").count()) === 5 ? "pass" : "fail");
note("what lies ahead is listed", (await page.locator("[data-part='warnings']").count()) === 0 ? "absent" : "pass", await page.locator("[data-part='warnings'] li").allTextContents());

// ---- The neighbours' question ----
const hasDecisions = await game<boolean>("Boolean(window.__GR__.state().decisions)");
if (!hasDecisions) note("a decision is put to the steward", "absent");
else {
  await game(`(() => { const g = window.__GR__; g.order({ kind: "harvest", plot: "mill-field", rest: "wait" }); g.order({ kind: "repair" }); while (Object.values(g.state().decisions)[0].state === "ahead") g.days(1); })()`);
  const shown = await page.locator("[data-decision] button").count();
  if (shown === 2) await page.locator("[data-decision] button").first().click();
  note("a decision is put on its day with two answers, and one can be given", shown === 2 && (await page.locator("[data-decision]").count()) === 0 ? "pass" : "fail", { shown });
}
if (out) await page.screenshot({ path: resolve(out, `granada-uat-${lang}-plan.png`) });

// ---- Photo Mode, in the 3D valley, and its saved picture under the host's headers ----
await open();
await until("window.__GR__.threeD !== 'pending'", 120_000);
const threeD = await game<string>("window.__GR__.threeD");
if (threeD !== "on") note("the 3D valley", "fail", threeD);
else if ((await page.locator("#view-photo").count()) === 0) note("Photo Mode", "absent");
else {
  await page.waitForTimeout(2500);
  const before = await game<string>("JSON.stringify(window.__GR__.state())");
  await page.locator("#view-photo").click();
  await page.locator("#photo-light").selectOption("evening");
  await page.waitForTimeout(800);
  let saved: { bytes: number; png: boolean } | string;
  try {
    const [download] = await Promise.all([page.waitForEvent("download", { timeout: 20_000 }), page.locator("#photo-capture").click()]);
    const file = resolve(out ?? ".", `granada-uat-${lang}-photo.png`);
    await download.saveAs(file);
    saved = { bytes: statSync(file).size, png: readFileSync(file).subarray(0, 8).toString("hex") === "89504e470d0a1a0a" };
  } catch (e) {
    saved = `no picture was saved: ${e instanceof Error ? e.message.split("\n")[0] : String(e)}`;
  }
  await page.keyboard.press("Escape");
  const same = (await game<string>("JSON.stringify(window.__GR__.state())")) === before;
  note("Photo Mode saves a real picture under the host's headers", typeof saved === "object" && saved.png && saved.bytes > 200_000 ? "pass" : "fail", saved);
  note("Photo Mode leaves the game exactly as it was", same ? "pass" : "fail");
}

// ---- The second year ----
await open("&view=plan");
const won = await game<boolean>(`(() => {
  const g = window.__GR__;
  const stock = (good) => g.state().economy.stock[good]?.quantity ?? 0;
  while (!g.state().outcome) {
    const s = g.state();
    for (const [id, p] of Object.entries(s.plots)) if (p.ripeSince !== null && p.standing > 0 && p.harvesting === null) g.order({ kind: "harvest", plot: id, rest: "wait" });
    if (!s.built.repaired && !s.works.some((w) => w.kind === "repair")) g.order({ kind: "repair" });
    if (!s.built.granary && !s.works.some((w) => w.kind === "granary")) g.order({ kind: "build", what: "granary" });
    if (s.plots["mill-field"].crop === null && Math.floor(((s.day - 1) % 120) / 30) <= 1) g.order({ kind: "plant", plot: "mill-field", crop: "vegetables" });
    if (s.built.house + s.works.filter((w) => w.kind === "house").length < 1) g.order({ kind: "build", what: "house" });
    if (stock("olives") > 0) g.order({ kind: "sell", good: "olives", quantity: stock("olives") });
    const days = Math.floor((stock("wheat") + stock("vegetables")) / Math.ceil(s.households / 10));
    if (days < 25 && g.state().economy.treasury.available > (100 + 26 * 20) * 100) g.order({ kind: "buy", good: "wheat", quantity: 20 });
    g.days(1);
  }
  return g.state().outcome.won;
})()`);
if (!won) note("the first year can be won through the page", "fail");
else if ((await page.locator("#go-on").count()) === 0) note("a second year", "absent");
else {
  await page.locator("#go-on").click();
  const two = await game<{ year: number; day: number; scenario: string }>("(() => { const s = window.__GR__.state(); return { year: s.year, day: s.day, scenario: s.scenario }; })()");
  note("a won first year goes on to the second, with its own brief and tasks", two.year === 2 && two.day === 1 && (await page.locator("dialog.brief[open]").count()) === 1 ? "pass" : "fail", two);
  await page.locator("#brief-start").click();
  if (out) await page.screenshot({ path: resolve(out, `granada-uat-${lang}-year-two.png`) });
}

note("the console stayed empty", errors.length === 0 ? "pass" : "fail", errors.slice(0, 6));
const report = { base, lang, release: channel.current, browser: `chrome ${browser.version()}`, checks, problems: checks.filter((c) => c.result === "fail").map((c) => c.check) };
console.log(JSON.stringify(report, null, 1));
if (out) writeFileSync(resolve(out, `granada-uat-${lang}.json`), `${JSON.stringify(report, null, 1)}\n`);
await browser.close();
if (report.problems.length) process.exit(1);
