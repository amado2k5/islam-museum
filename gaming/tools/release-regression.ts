// Runs, against a deployed host (UAT by default), the scenarios of the outside reviewer's regression matrix that can
// be played by a script on a host: docs/gaming/spec-production/PRODUCTION_GAME_STANDARDS.md, section 9, as mapped in
// docs/gaming/regression/matrix.json. It reads only: every page is opened in a fresh browser context with fresh=1,
// so no saved game of anyone's is touched, and nothing is written to the host.
//
// What it plays: the release pointer at the start and at the end (REL-01); the five English addresses, each in 3D
// and then deliberately without it (REL-02, REL-03); and one whole Atlas daily game played as a person plays it,
// with no reload to help it (AT-01, AT-02, AT-03, AT-04, AT-07), then a reload in the middle and at the end (AT-08).
// The Atlas game is the one the reviewer played on 26 November 2026, whose second round, answered close to the
// place, left the next round opening on a screen of nothing but land.
//
// It is the author's script, not a person: it shows that these things still work, and nothing about whether a game
// is any good.
// Usage: [BROWSER=chrome|msedge] npx tsx --tsconfig tsconfig.json tools/release-regression.ts [base] [out dir]
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type Page } from "playwright-core";

const base = process.argv[2] ?? "https://uat-games.islam.museum";
const out = process.argv[3] ? resolve(process.argv[3]) : null;
if (out) mkdirSync(out, { recursive: true });
const channelName = process.env.BROWSER ?? "chrome";
const ATLAS_DATE = "2026-11-26";

type Outcome = "pass" | "fail";
const results: { id: string; outcome: Outcome; saw: string }[] = [];
const record = (id: string, ok: boolean, saw: string) => {
  results.push({ id, outcome: ok ? "pass" : "fail", saw });
  console.error(`${ok ? "pass" : "FAIL"} ${id}: ${saw}`);
};
const pointer = async () => (await (await fetch(`${base}/_channel`, { cache: "no-store" })).json()) as { current: string; previous: string | null; commit: string };

const browser = await chromium.launch({ channel: channelName, headless: false, args: ["--mute-audio", "--window-size=1500,1000", "--window-position=0,0"] });
const errors: string[] = [];
const open = async (path: string): Promise<Page> => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(`${path}: ${String(e)}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`${path}: ${m.text()}`);
  });
  page.on("response", (r) => {
    if (r.status() >= 400) errors.push(`${path}: ${r.status()} ${r.url()}`);
  });
  await page.goto(`${base}${path}`);
  return page;
};
const waitFor = async (page: Page, expression: string, ms: number): Promise<boolean> => {
  for (const end = Date.now() + ms; Date.now() < end; ) {
    if (await page.evaluate(expression)) return true;
    await page.waitForTimeout(200);
  }
  return false;
};

// REL-01, first half.
const atStart = await pointer();

// REL-02 and REL-03: each address starts, draws in 3D, and when asked draws without it.
const ADDRESSES = [
  ["granada", ""],
  ["golden-age", ""],
  ["golden-age", "&scenario=house-of-books"],
  ["golden-age", "&scenario=what-endures"],
  ["atlas", ""],
] as const;
const started: string[] = [];
const in3d: string[] = [];
const without: string[] = [];
for (const [game, extra] of ADDRESSES) {
  const name = `${game}${extra.replace("&scenario=", " ")}`;
  const ready = game === "atlas" ? "Boolean(document.querySelector('#panel h2'))" : `Boolean(window.${game === "granada" ? "__GR__" : "__GA__"} && (window.${game === "granada" ? "__GR__" : "__GA__"}.ready || window.${game === "granada" ? "__GR__" : "__GA__"}.error))`;
  const is3d = game === "granada" ? "window.__GR__.threeD === 'on'" : game === "golden-age" ? "window.__GA__.ready === true && (window.__GA__.no3d ?? null) === null" : "document.documentElement.dataset.globe === '3d'";
  const isPlain = game === "granada" ? "window.__GR__.threeD === 'off'" : game === "golden-age" ? "Boolean(window.__GA__.no3d)" : "document.documentElement.dataset.globe === '2d'";
  let page = await open(`/${game}/?lang=en${extra}&fresh=1&music=off`);
  if (await waitFor(page, ready, 90_000)) started.push(name);
  if (await waitFor(page, is3d, 120_000)) in3d.push(name);
  if (out) await page.screenshot({ path: `${out}/${game}${extra.replace(/[&=]/g, "-")}-3d.png` });
  await page.context().close();
  page = await open(`/${game}/?lang=en${extra}&fresh=1&music=off&no3d=1`);
  if ((await waitFor(page, ready, 90_000)) && (await waitFor(page, isPlain, 20_000))) without.push(name);
  await page.context().close();
}
record("REL-02", started.length === ADDRESSES.length, `${started.length} of ${ADDRESSES.length} addresses started: ${started.join(", ")}`);
record("REL-03", in3d.length === ADDRESSES.length && without.length === ADDRESSES.length, `in 3D: ${in3d.length} of ${ADDRESSES.length}; without it when asked (no3d=1): ${without.length} of ${ADDRESSES.length}`);

// Atlas, one whole daily game with no reload between rounds.
const page = await open(`/atlas/?lang=en&date=${ATLAS_DATE}&fresh=1&music=off`);
await page.waitForSelector("#panel h2", { timeout: 60_000 });
await waitFor(page, "document.documentElement.dataset.globe === '3d'", 60_000);
const zoom = async () => Number(await page.evaluate("document.getElementById('globe').dataset.zoom"));
const kind = async () => (await page.evaluate("document.documentElement.dataset.globe")) as string;
const typed = async (lat: string, lon: string) => {
  await page.fill("#lat", lat);
  await page.fill("#lon", lon);
  await page.locator("#panel .field button").first().click();
};
const opened: { round: number; zoom: number; globe: string }[] = [];
const ways: string[] = [];
let hintTaken = false;
let centuryGiven = false;
let closeReveal = 0;
for (let round = 1; round <= 5; round++) {
  await page.waitForSelector("#panel h2");
  await page.waitForTimeout(1800);
  opened.push({ round, zoom: await zoom(), globe: await kind() });
  if (out) await page.screenshot({ path: `${out}/atlas-round-${round}-opens.png` });
  const submit = page.locator("button.primary");
  if (round === 1) {
    // By keyboard alone, as the reviewer did: turn the globe, drop the pin at its centre.
    await page.focus("#globe");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
    ways.push("keyboard");
  } else if (round === 2) {
    // The reviewer's close answer, deep inland: the reveal comes in close.
    await typed("42.8", "74.3");
    ways.push("typed coordinates");
  } else if (round === 3) {
    // By mouse, with the region hint and a century estimate.
    await page.mouse.click(1000, 430);
    await page.locator("#panel .field").nth(2).locator("button").click();
    hintTaken = true;
    await page.locator("#panel .field").nth(1).locator("button").nth(1).click();
    centuryGiven = true;
    ways.push("mouse");
  } else await typed(round === 4 ? "29.97" : "12.97", round === 4 ? "77.55" : "77.59");
  if (await submit.isDisabled()) record(`AT-02 round ${round}`, false, "submit stayed disabled after a pin was placed");
  await submit.click();
  await page.waitForSelector("#panel .big");
  if (round === 2) {
    await page.waitForTimeout(1800);
    closeReveal = await zoom();
  }
  if (round === 3) {
    // AT-08, first half: a reload in the middle brings the game back where it was. Made after the transitions that
    // AT-07 is about (1 to 2, 2 to 3) have been crossed with no reload.
    await page.reload();
    await page.waitForSelector("#panel h2");
    const done = await page.locator(".dot.done").count();
    record("AT-08 mid-game", done === 3, `after a reload in the middle the game shows ${done} finished rounds (3 were played)`);
    await waitFor(page, "document.documentElement.dataset.globe === '3d'", 60_000);
  } else await page.locator("button.primary").click();
}
await page.waitForSelector(".marks");
if (out) await page.screenshot({ path: `${out}/atlas-summary.png` });
const saved = (await page.evaluate(`(() => { const s = JSON.parse(localStorage.getItem('im.atlas.save.v1') || '{}'); const g = s.daily && s.daily['${ATLAS_DATE}']; return g ? { at: g.at, results: g.results } : null; })()`)) as { at: number; results: { points: number; km: number; regionHint: boolean; centuryGuess: number | null }[] } | null;
// The summary shows the total as "2,612 of 5,000": the first figure is the total.
const shownText = (await page.locator("#panel .big").first().textContent()) ?? "";
const shown = Number((/\d[\d,.]*/.exec(shownText)?.[0] ?? "").replace(/[^\d]/g, ""));
const sum = saved ? saved.results.reduce((a, r) => a + r.points, 0) : -1;
record("AT-01", saved !== null && saved.results.length === 5 && saved.at === 5, `five rounds played to the summary (${saved ? saved.results.map((r) => r.points).join(", ") : "no saved game"})`);
record("AT-02", new Set(ways).size === 3, `pins placed by ${[...new Set(ways)].join(", ")}`);
record("AT-03", hintTaken && centuryGiven && saved !== null && saved.results[2]!.regionHint === true && saved.results[2]!.centuryGuess !== null, `round 3 kept its region hint (${saved?.results[2]?.regionHint}) and its century estimate (${saved?.results[2]?.centuryGuess})`);
record("AT-04", saved !== null && sum === shown, `the total shown, ${shown} (the page says "${shownText.trim()}"), against the sum of the five rounds, ${sum}`);
const worst = Math.max(...opened.map((o) => o.zoom));
const lost = opened.filter((o) => o.globe !== "3d").map((o) => o.round);
record("AT-07", closeReveal > 5 && worst <= 1.5 && lost.length === 0, `the close reveal of round 2 came in ${closeReveal} times; every round opened on the whole globe (widest zoom ${worst}); the lit sphere was there at every round${lost.length ? ` except ${lost.join(", ")}` : ""}`);
await page.reload();
await page.waitForSelector("#panel h2, .marks");
const after = await page.locator(".marks").count();
record("AT-08 finished", after === 1, after === 1 ? "after a reload the finished game is still finished" : "after a reload the finished game was not shown as finished");
await page.context().close();
await browser.close();

// REL-01, second half.
const atEnd = await pointer();
record("REL-01", atStart.current === atEnd.current, `release ${atStart.current} at the start, ${atEnd.current} at the end`);
record("console", errors.length === 0, errors.length ? errors.slice(0, 8).join(" | ") : "no console error and no failed request on any page");

const report = { base, release: atStart.current, commit: atStart.commit, browser: `${channelName} ${browser.version()}`, viewport: [1440, 900], atlasDate: ATLAS_DATE, ran: new Date().toISOString(), results };
console.log(JSON.stringify(report, null, 1));
if (out) writeFileSync(`${out}/release-regression.json`, `${JSON.stringify(report, null, 1)}\n`);
if (results.some((r) => r.outcome === "fail")) process.exit(1);
