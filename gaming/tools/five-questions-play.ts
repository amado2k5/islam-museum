// Plays whole days of Five Questions with the keyboard alone on the local host (Tab to an answer, Enter to choose it,
// Enter on "Next"), in every language, on a phone-sized and a desktop screen, in light and dark: once with every answer
// right and once with every answer wrong. Checks the score, that every question's record is linked to the museum,
// that the day is kept after a reload, no console error, no sideways scroll at phone width, and that every visible
// piece of text in the game has at least 4.5:1 contrast. It reads only; hosted addresses are refused.
// Usage: npx tsx --tsconfig tsconfig.json tools/five-questions-play.ts [local base] [captures dir]
import { readFileSync, writeFileSync } from "node:fs";
import { chromium, type Page } from "playwright-core";
import { localBase } from "./local-host";
import { dailyQuiz } from "../packages/daily/src/questions";
import type { PackFile } from "../packages/daily/src/pack";

const { base, close } = await localBase(process.argv[2]);
const shots = process.argv[3];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
const DATE = "2026-12-01";
const pack = JSON.parse(readFileSync(new URL("../packages/daily/data/pack.v1.json", import.meta.url), "utf8")) as PackFile;
const questions = dailyQuiz(pack, DATE);
const browser = await chromium.launch({ channel: process.env.BROWSER ?? "chrome", headless: true });
const problems: string[] = [];
const runs: unknown[] = [];

// Written as a string so the bundler adds nothing to it that the page does not have. Text against the first opaque
// background behind it; disabled answer buttons included, because their marks are what a player reads.
const contrast = (page: Page) => page.evaluate(`(() => {
  // Computed colours come as rgb()/rgba() or, from color-mix(), as color(srgb r g b / a) with channels from 0 to 1.
  const rgb = (c) => { const m = (c.match(/[\\d.]+/g) || []).map(Number); if (!m.length) return null; return c.startsWith("color(") ? [m[0] * 255, m[1] * 255, m[2] * 255, m.length > 3 ? m[3] : 1] : m; };
  const lum = (m) => { const v = m.slice(0, 3).map((x) => x / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
  const bg = (e) => { for (let n = e; n; n = n.parentElement) { const c = rgb(getComputedStyle(n).backgroundColor); if (c && (c.length < 4 || c[3] > 0.9)) return c; } return matchMedia("(prefers-color-scheme: dark)").matches ? [21, 19, 15] : [251, 248, 242]; };
  let worst = 99; let where = "";
  for (const e of document.querySelectorAll("#main *")) {
    if (![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const r = e.getBoundingClientRect(); if (!r.width || !r.height) continue;
    const cs = getComputedStyle(e);
    const fg = rgb(cs.color); if (!fg) continue;
    const a = lum(fg), b = lum(bg(e));
    let ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    if (Number(cs.opacity) < 1) ratio = 0;
    if (ratio < worst) { worst = ratio; where = e.tagName + "." + e.className + " " + JSON.stringify(e.textContent.slice(0, 30)) + " " + cs.color + " opacity " + cs.opacity; }
  }
  return { worst: Math.round(worst * 100) / 100, where };
})()`) as Promise<{ worst: number; where: string }>;

for (const scheme of ["light", "dark"] as const) for (const view of [{ name: "phone", width: 375, height: 812, mobile: true }, { name: "desktop", width: 1440, height: 900, mobile: false }]) for (const lang of LANGS) {
  for (const ending of ["all-right", "all-wrong"] as const) {
    const tag = `${lang} ${view.name} ${scheme} ${ending}`;
    const context = await browser.newContext({ viewport: { width: view.width, height: view.height }, isMobile: view.mobile, hasTouch: view.mobile, colorScheme: scheme });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    try {
      await page.goto(`${base}/five-questions/?lang=${lang}&date=${DATE}`);
      await page.waitForFunction("Boolean(window.__DAILY__)", null, { timeout: 30_000 });
      const dir = await page.evaluate("document.documentElement.dir");
      if (dir !== (lang === "ar" || lang === "ur" ? "rtl" : "ltr")) problems.push(`${tag}: direction ${dir}`);
      let worst = 99;
      for (const q of questions) {
        const pick = ending === "all-right" ? q.answer : (q.answer + 1) % q.options.length;
        // The first answer has focus when a question opens; Tab moves to the next answer.
        for (let k = 0; k < pick; k++) await page.keyboard.press("Tab");
        await page.keyboard.press("Enter");
        // The choice is marked and "Next" takes focus.
        await page.waitForSelector(".options button[disabled]");
        const c = await contrast(page);
        if (c.worst < worst) worst = c.worst;
        if (c.worst < 4.5) problems.push(`${tag}: contrast ${c.worst} at ${c.where}`);
        await page.keyboard.press("Enter");
      }
      await page.waitForSelector("#res", { timeout: 10_000 });
      const res = (await page.evaluate(`({ score: document.querySelector("#res").textContent, links: [...document.querySelectorAll("#main ol a[href]")].map((a) => a.href), wide: document.documentElement.scrollWidth > innerWidth + 1 })`)) as { score: string; links: string[]; wide: boolean };
      const want = ending === "all-right" ? questions.length : 0;
      if (!res.score.includes(String(want)) && !/[٠-٩۰-۹]/.test(res.score)) problems.push(`${tag}: score "${res.score}", expected ${want}`);
      if (res.links.length !== questions.length || !res.links.every((h) => /islam\.museum\//.test(h))) problems.push(`${tag}: ${res.links.length} museum links in the summary`);
      if (res.wide) problems.push(`${tag}: the page scrolls sideways`);
      const c = await contrast(page);
      if (c.worst < 4.5) problems.push(`${tag}: summary contrast ${c.worst} at ${c.where}`);
      if (shots && ending === "all-wrong" && (lang === "ar" || lang === "en")) await page.screenshot({ path: `${shots}/five-questions-${lang}-${view.name}-${scheme}.png`, fullPage: true });
      await page.reload();
      await page.waitForFunction("Boolean(window.__DAILY__)", null, { timeout: 30_000 });
      if (!(await page.$("#res"))) problems.push(`${tag}: the finished day was not kept after a reload`);
      if (errors.length) problems.push(`${tag}: ${errors.join(" | ")}`);
      runs.push({ tag, score: res.score, contrast: Math.min(worst, c.worst) });
    } catch (e) { problems.push(`${tag}: ${String(e).split("\n")[0]}`); }
    await context.close();
  }
}
await browser.close();
await close();
const report = { base, date: DATE, runs: runs.length, problems };
if (shots) writeFileSync(`${shots}/five-questions-play.json`, JSON.stringify({ ...report, detail: runs }, null, 1));
console.log(JSON.stringify(report, null, 1));
process.exit(problems.length ? 1 : 0);
