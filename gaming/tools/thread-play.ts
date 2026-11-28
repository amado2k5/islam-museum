// Plays whole days of the Thread of Time with the keyboard alone on the local host: each event is moved with Enter on
// its ▲ button, then the order is checked. Every move is checked to leave focus on an enabled button of the list, so a
// keyboard player never loses their place. In every language, on a phone-sized and a desktop screen, in light and dark:
// once put in the right order and once in the reverse. Checks the result, that every event links to the museum, that
// the day is kept after a reload, no console error, no sideways scroll at phone width, and 4.5:1 contrast for every
// visible text. It reads only; hosted addresses are refused.
// Usage: npx tsx --tsconfig tsconfig.json tools/thread-play.ts [local base] [captures dir]
import { readFileSync, writeFileSync } from "node:fs";
import { chromium, type Page } from "playwright-core";
import { localBase } from "./local-host";
import { dailyThread } from "../packages/daily/src/thread";
import type { PackFile } from "../packages/daily/src/pack";

const { base, close } = await localBase(process.argv[2]);
const shots = process.argv[3];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
const DATE = "2026-12-01";
const pack = JSON.parse(readFileSync(new URL("../packages/daily/data/pack.v1.json", import.meta.url), "utf8")) as PackFile;
const puzzle = dailyThread(pack, DATE);
const browser = await chromium.launch({ channel: process.env.BROWSER ?? "chrome", headless: true });
const problems: string[] = [];
const runs: unknown[] = [];

const contrast = (page: Page) => page.evaluate(`(() => {
  // Computed colours come as rgb()/rgba() or, from color-mix(), as color(srgb r g b / a) with channels from 0 to 1.
  const rgb = (c) => { const m = (c.match(/[\\d.]+/g) || []).map(Number); if (!m.length) return null; return c.startsWith("color(") ? [m[0] * 255, m[1] * 255, m[2] * 255, m.length > 3 ? m[3] : 1] : m; };
  const lum = (m) => { const v = m.slice(0, 3).map((x) => x / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
  const bg = (e) => { for (let n = e; n; n = n.parentElement) { const c = rgb(getComputedStyle(n).backgroundColor); if (c && (c.length < 4 || c[3] > 0.9)) return c; } return matchMedia("(prefers-color-scheme: dark)").matches ? [21, 19, 15] : [251, 248, 242]; };
  let worst = 99; let where = "";
  for (const e of document.querySelectorAll("#main *")) {
    if (![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    // WCAG 1.4.3 exempts inactive controls: the ▲ of the first event and the ▼ of the last.
    if (e.tagName === "BUTTON" && e.disabled) continue;
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
  for (const ending of ["right", "reversed"] as const) {
    const tag = `${lang} ${view.name} ${scheme} ${ending}`;
    const context = await browser.newContext({ viewport: { width: view.width, height: view.height }, isMobile: view.mobile, hasTouch: view.mobile, colorScheme: scheme });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    try {
      await page.goto(`${base}/thread/?lang=${lang}&date=${DATE}`);
      await page.waitForFunction("Boolean(window.__DAILY__)", null, { timeout: 30_000 });
      const dir = await page.evaluate("document.documentElement.dir");
      if (dir !== (lang === "ar" || lang === "ur" ? "rtl" : "ltr")) problems.push(`${tag}: direction ${dir}`);
      const target = ending === "right" ? puzzle.order : puzzle.order.slice().reverse();
      const mine = puzzle.shown.map((e) => e.id);
      let lostFocus = 0;
      // Insertion sort with ▲ only: each event is raised to its place, one Enter per step, from wherever focus is left.
      for (let k = 0; k < target.length; k++) {
        let i = mine.indexOf(target[k]!);
        if (i === k) continue;
        await page.focus(`ol.order > li:nth-child(${i + 1}) button.up`);
        while (i > k) {
          await page.keyboard.press("Enter");
          [mine[i - 1], mine[i]] = [mine[i]!, mine[i - 1]!];
          i--;
          const ok = (await page.evaluate(`(() => { const a = document.activeElement; return !!a && a.tagName === "BUTTON" && !a.disabled && !!a.closest("ol.order"); })()`)) as boolean;
          if (!ok) lostFocus++;
          // Keep going from the moved event's own ▲, as a player would after finding their place again.
          if (i > k) await page.focus(`ol.order > li:nth-child(${i + 1}) button.up`);
        }
      }
      if (lostFocus) problems.push(`${tag}: focus was lost ${lostFocus} times after a move`);
      const c0 = await contrast(page);
      if (c0.worst < 4.5) problems.push(`${tag}: contrast ${c0.worst} at ${c0.where}`);
      await page.focus("button.wide:not(.secondary)");
      await page.keyboard.press("Enter");
      await page.waitForSelector("#main .card h2", { timeout: 10_000 });
      const res = (await page.evaluate(`({ head: document.querySelector("#main .card h2").textContent, links: [...document.querySelectorAll("ol.order a[href]")].map((a) => a.href), right: document.querySelectorAll("ol.order li.right").length, wide: document.documentElement.scrollWidth > innerWidth + 1 })`)) as { head: string; links: string[]; right: number; wide: boolean };
      if (ending === "right" && res.right !== target.length) problems.push(`${tag}: ${res.right} of ${target.length} marked right`);
      if (ending === "reversed" && res.right === target.length) problems.push(`${tag}: the reversed order was marked all right`);
      if (res.links.length !== target.length || !res.links.every((h) => /islam\.museum\//.test(h))) problems.push(`${tag}: ${res.links.length} museum links`);
      if (res.wide) problems.push(`${tag}: the page scrolls sideways`);
      const c = await contrast(page);
      if (c.worst < 4.5) problems.push(`${tag}: result contrast ${c.worst} at ${c.where}`);
      if (shots && ending === "reversed" && (lang === "ar" || lang === "en")) await page.screenshot({ path: `${shots}/thread-${lang}-${view.name}-${scheme}.png`, fullPage: true });
      await page.reload();
      await page.waitForFunction("Boolean(window.__DAILY__)", null, { timeout: 30_000 });
      if (!(await page.$("#main .card h2"))) problems.push(`${tag}: the finished day was not kept after a reload`);
      if (errors.length) problems.push(`${tag}: ${errors.join(" | ")}`);
      runs.push({ tag, head: res.head, right: res.right, lostFocus, contrast: Math.min(c0.worst, c.worst) });
    } catch (e) { problems.push(`${tag}: ${String(e).split("\n")[0]}`); }
    await context.close();
  }
}
await browser.close();
await close();
const report = { base, date: DATE, runs: runs.length, problems };
if (shots) writeFileSync(`${shots}/thread-play.json`, JSON.stringify({ ...report, detail: runs }, null, 1));
console.log(JSON.stringify(report, null, 1));
process.exit(problems.length ? 1 : 0);
