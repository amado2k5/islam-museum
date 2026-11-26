// Opens the packaged games in a real browser, each in a fresh context, and writes down what each does: whether it
// starts, whether it draws in 3D, whether the forced modes do what they say, whether a saved game resumes, and
// above all that NOTHING is asked of any address but this computer's. It is a functional check, not a review.
//
// It installs nothing. It needs Node and a Playwright that is already there ("playwright" or "playwright-core").
// Start the server first (python3 serve.py), then:
//     node tests/qa-check.mjs [base=http://localhost:8765] [lang=en] [folder for captures]
// BROWSER_CHANNEL=chrome uses an installed Chrome; HEADLESS=0 shows the window; CHROMIUM_ARGS="--flag --flag" adds
// flags (for example ones that turn on WebGPU where the browser has it off). A flag may hold spaces: a new flag
// begins at each "--".
import { mkdirSync, writeFileSync } from "node:fs";

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  ({ chromium } = await import("playwright-core"));
}
const base = (process.argv[2] ?? "http://localhost:8765").replace(/\/$/, "");
const lang = process.argv[3] ?? "en";
const shots = process.argv[4];
if (shots) mkdirSync(shots, { recursive: true });
const origin = new URL(base).origin;

const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || undefined, headless: process.env.HEADLESS !== "0", args: ["--mute-audio", ...(process.env.CHROMIUM_ARGS ? process.env.CHROMIUM_ARGS.trim().split(/\s+(?=--)/) : [])] });
const report = { base, lang, browser: browser.version(), release: null, gpu: null, pages: [], asked_elsewhere: [], problems: [] };
const problem = (where, what) => report.problems.push(`${where}: ${what}`);

/** A page in a context of its own, with every request watched: one to any other address is refused and written down. */
async function open(path, label) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  const tracks = [];
  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (url.startsWith(origin) || url.startsWith("data:") || url.startsWith("blob:")) return route.continue();
    report.asked_elsewhere.push(`${label}: ${url}`);
    return route.abort();
  });
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("response", (r) => {
    if (r.url().endsWith(".m4a")) tracks.push(r.status());
    else if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
  });
  await page.goto(`${base}${path}`);
  return { context, page, errors, tracks };
}
const until = async (page, expression, ms = 90_000) => {
  for (const end = Date.now() + ms; Date.now() < end; ) {
    if (await page.evaluate(expression)) return true;
    await page.waitForTimeout(200);
  }
  return false;
};
const capture = async (page, name) => shots && page.screenshot({ path: `${shots}/${name}-${lang}.png` });

report.release = await (await fetch(`${base}/_channel`)).json();

// ---- Granada ----
{
  const label = "granada";
  const { context, page, errors, tracks } = await open(`/granada/?lang=${lang}&fresh=1&seed=7`, label);
  const row = { page: label, started: false };
  if (!(await until(page, "Boolean(window.__GR__ && (window.__GR__.ready || window.__GR__.error))"))) problem(label, "did not start");
  else {
    row.started = (await page.evaluate("window.__GR__.ready")) === true;
    report.gpu = await page.evaluate("(async () => { if (!navigator.gpu) return 'no navigator.gpu'; const a = await navigator.gpu.requestAdapter(); if (!a) return 'no adapter'; const i = a.info ?? {}; return { vendor: i.vendor ?? '', architecture: i.architecture ?? '' }; })()");
    // Nothing sounds, and no track is asked for, until the first click.
    await page.waitForTimeout(1500);
    const askedBeforeAClick = tracks.length;
    if (askedBeforeAClick !== 0) problem(label, "a track was asked for before any click");
    // A new game opens on its brief. If it is not there, say what is, and go on.
    const brief = await page.evaluate("({ open: document.querySelectorAll('dialog.brief[open]').length, button: Boolean(document.getElementById('brief-start')), dialogs: [...document.querySelectorAll('dialog[open]')].map((d) => d.className), ready: window.__GR__.ready, error: window.__GR__.error ?? null, day: window.__GR__.ready ? window.__GR__.state().day : null })");
    row.brief = brief;
    if (brief.button) await page.locator("#brief-start").click();
    else problem(label, `a new game did not open on its brief: ${JSON.stringify(brief)}`);
    row.day = await page.evaluate("window.__GR__.state().day");
    await page.locator("#step").click();
    row.dayAfterOneStep = await page.evaluate("window.__GR__.state().day");
    if (row.dayAfterOneStep !== row.day + 1) problem(label, `a day did not pass (${row.day} then ${row.dayAfterOneStep})`);
    await until(page, "window.__GR__.threeD !== 'pending'", 120_000);
    row.threeD = await page.evaluate("window.__GR__.threeD");
    if (row.threeD === "on") {
      await until(page, "(() => { const i = window.__GR__.stage().info(); return i.models.length + i.modelFailures.length > 0; })()", 30_000);
      const info = await page.evaluate("(() => { const i = window.__GR__.stage().info(); return { models: i.models, modelFailures: i.modelFailures, triangles: i.triangles, engine: i.engine }; })()");
      Object.assign(row, info);
      if (!info.models.includes("granada/mill")) problem(label, `the authored mill did not load: ${info.modelFailures.join("; ") || "no reason given"}`);
      await page.waitForTimeout(9000);
    } else if (String(row.threeD).startsWith("failed")) problem(label, `3D failed: ${row.threeD}`);
    await capture(page, "granada");
    // After a click a track is asked for, from this computer, and plays (the browser is muted).
    await page.waitForTimeout(2000);
    row.music = { askedBeforeAClick, responses: [...tracks], playing: await page.evaluate("window.__GR__.music.state().playing") };
    if (!tracks.some((s) => s === 206 || s === 200)) problem(label, "no track arrived after a click");
    // A reload without `fresh` resumes the same day.
    const saved = await page.evaluate("window.__GR__.state().day");
    await page.goto(`${base}/granada/?lang=${lang}&seed=7`);
    await until(page, "Boolean(window.__GR__ && window.__GR__.ready)");
    row.resumedDay = await page.evaluate("window.__GR__.state().day");
    if (row.resumedDay !== saved) problem(label, `a reload resumed day ${row.resumedDay}, not ${saved}`);
  }
  row.consoleErrors = errors;
  for (const e of errors) problem(label, e);
  report.pages.push(row);
  await context.close();
}
// Granada with 3D refused: the plan alone.
{
  const label = "granada no3d";
  const { context, page, errors } = await open(`/granada/?lang=${lang}&fresh=1&seed=7&no3d=1`, label);
  await until(page, "Boolean(window.__GR__ && window.__GR__.ready)");
  const row = { page: label, threeD: await page.evaluate("window.__GR__.threeD"), canvas: await page.locator("canvas.scene").count(), planShown: await page.locator("svg.map").isVisible() };
  if (row.threeD !== "off" || row.canvas !== 0 || !row.planShown) problem(label, `asked for no 3D, got ${JSON.stringify(row)}`);
  for (const e of errors) problem(label, e);
  report.pages.push(row);
  await context.close();
}

// ---- The Golden Age, three chapters ----
for (const [name, extra] of [["chapter 1", ""], ["chapter 2", "&scenario=house-of-books"], ["chapter 3", "&scenario=what-endures"]]) {
  const label = `golden-age ${name}`;
  const { context, page, errors } = await open(`/golden-age/?lang=${lang}${extra}&fresh=1&seed=7`, label);
  const row = { page: label, started: false };
  if (!(await until(page, "Boolean(window.__GA__ && (window.__GA__.ready || window.__GA__.error))"))) problem(label, "did not start");
  else {
    row.started = (await page.evaluate("window.__GA__.ready")) === true;
    row.threeD = (await page.evaluate("window.__GA__.no3d ?? null")) === null ? "on" : `plan view: ${await page.evaluate("String(window.__GA__.no3d)")}`;
    const season = await page.evaluate("window.__GA__.state().season");
    await page.evaluate("window.__GA__.dispatch({ type: 'end-season' })");
    row.seasons = [season, await page.evaluate("window.__GA__.state().season")];
    if (row.seasons[1] !== season + 1) problem(label, `ending a season moved it from ${season} to ${row.seasons[1]}`);
    await page.waitForTimeout(1500);
    await capture(page, `golden-age-${name.replace(" ", "-")}`);
  }
  row.consoleErrors = errors;
  for (const e of errors) problem(label, e);
  report.pages.push(row);
  await context.close();
}
{
  const label = "golden-age no3d";
  const { context, page, errors } = await open(`/golden-age/?lang=${lang}&fresh=1&seed=7&no3d=1`, label);
  await until(page, "Boolean(window.__GA__ && window.__GA__.ready)");
  const row = { page: label, no3d: await page.evaluate("String(window.__GA__.no3d ?? null)") };
  if (row.no3d === "null") problem(label, "asked for the plan view, the page says it is in 3D");
  for (const e of errors) problem(label, e);
  report.pages.push(row);
  await context.close();
}

// ---- Atlas ----
for (const [label, extra, want] of [["atlas", "", null], ["atlas no3d", "&no3d=1", "2d"]]) {
  const { context, page, errors } = await open(`/atlas/?lang=${lang}&date=2026-12-01${extra}`, label);
  const row = { page: label, started: false };
  try {
    await page.waitForSelector("#panel h2", { timeout: 60_000 });
    row.started = true;
    row.question = (await page.locator("#panel h2").first().textContent())?.trim();
    if (want === null) await until(page, "document.documentElement.dataset.globe === '3d'", 30_000);
    else await page.waitForTimeout(1500);
    row.globe = await page.evaluate("document.documentElement.dataset.globe");
    if (want && row.globe !== want) problem(label, `asked for the drawn globe, the page says ${row.globe}`);
    await capture(page, label.replace(" ", "-"));
  } catch (e) {
    problem(label, `did not start: ${e.message}`);
  }
  row.consoleErrors = errors;
  for (const e of errors) problem(label, e);
  report.pages.push(row);
  await context.close();
}

await browser.close();
for (const url of report.asked_elsewhere) problem("network", `asked another address: ${url}`);
console.log(JSON.stringify(report, null, 1));
if (shots) writeFileSync(`${shots}/qa-check-${lang}.json`, `${JSON.stringify(report, null, 1)}\n`);
console.log(report.problems.length ? `\n${report.problems.length} problem(s)` : "\nno problem found; nothing was asked of any address but this computer's");
process.exit(report.problems.length ? 1 : 0);
