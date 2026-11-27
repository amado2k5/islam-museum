// Opens the four daily games on a deployed host in real Chrome, on a phone-sized screen and a desktop one, in each of
// the seven languages, and checks what a visitor meets: the day's puzzle comes up, the prototype label shows, one move
// of play works, the page has the right direction, and the console stays empty. It reads only; it changes nothing.
// Usage: npx tsx --tsconfig tsconfig.json tools/daily-check.ts [base=https://games.islam.museum] [captures dir]
import { writeFileSync } from "node:fs";
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "https://games.islam.museum";
const shots = process.argv[3];
const GAMES = ["five-questions", "kalima", "thread", "lantern"];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"];
const VIEWS = [{ name: "phone", width: 375, height: 812, mobile: true }, { name: "desktop", width: 1440, height: 900, mobile: false }];
const browser = await chromium.launch({ channel: process.env.BROWSER ?? "chrome", headless: true });
const channel = await (await fetch(`${base}/_channel`)).json().catch(() => null);
const report: Record<string, unknown> = { base, live: channel?.current ?? null, browser: browser.version(), runs: [] as unknown[] };
const problems: string[] = [];
for (const view of VIEWS) for (const game of GAMES) for (const lang of LANGS) {
  const context = await browser.newContext({ viewport: { width: view.width, height: view.height }, isMobile: view.mobile, hasTouch: view.mobile });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("response", (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  const tag = `${game} ${lang} ${view.name}`;
  try {
    await page.goto(`${base}/${game}/?lang=${lang}`);
    await page.waitForFunction("Boolean(window.__DAILY__)", null, { timeout: 30_000 });
    const hook = (await page.evaluate("window.__DAILY__")) as { error?: string; records?: string[]; date?: string };
    if (hook.error) throw new Error(hook.error);
    const dir = await page.evaluate("document.documentElement.dir");
    if (dir !== (lang === "ar" || lang === "ur" ? "rtl" : "ltr")) problems.push(`${tag}: direction ${dir}`);
    if (!(await page.locator("h1 .chip.proto").isVisible())) problems.push(`${tag}: no prototype label`);
    const overflow = (await page.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1")) as boolean;
    if (overflow) problems.push(`${tag}: the page is wider than the screen`);
    if (game === "five-questions") {
      await page.locator(".options button").first().click();
      if ((await page.locator("a.record").count()) < 1) problems.push(`${tag}: no record link after an answer`);
    } else if (game === "thread") {
      await page.locator(".order .moves button.down").first().click();
      await page.locator("button.wide").first().click();
      if ((await page.locator(".order li.right, .order li.wrong").count()) !== 5) problems.push(`${tag}: the order was not marked`);
    } else {
      await page.locator(".keys button").first().click();
      const ok = game === "lantern" ? (await page.locator(".keys button:disabled").count()) > 0 : ((await page.locator(".tile").first().textContent()) ?? "").trim() !== "";
      if (!ok) problems.push(`${tag}: a key did not register`);
    }
    if (shots && (lang === "ar" || lang === "en")) await page.screenshot({ path: `${shots}/${game}-${lang}-${view.name}.png`, fullPage: false });
    (report.runs as unknown[]).push({ game, lang, view: view.name, date: hook.date, records: hook.records, consoleErrors: errors.length });
  } catch (e) {
    problems.push(`${tag}: ${String(e)}`);
  }
  for (const e of errors) problems.push(`${tag}: ${e}`);
  await context.close();
}
await browser.close();
report.problems = problems;
console.log(JSON.stringify({ base, live: report.live, runs: (report.runs as unknown[]).length, problems }, null, 1));
if (shots) writeFileSync(`${shots}/daily-check.json`, `${JSON.stringify(report, null, 1)}\n`);
if (problems.length) process.exit(1);
