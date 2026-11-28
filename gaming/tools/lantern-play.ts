// Plays whole days of the Lantern with the keyboard alone on the local host. The first letter is typed on the
// keyboard (a keydown carrying the letter, as a keyboard in the page's language sends it); every other guess is Enter
// on the on-screen key, and after each one focus must sit on a key still free, or on the end card, so a keyboard player
// never loses their place. In every language, on a phone-sized and a desktop screen, in light and dark: once lit by
// guessing the name's letters and once burnt out by seven wrong ones. Checks the end card and its museum link, that the
// day is kept after a reload, no console error, no sideways scroll at phone width, and 4.5:1 contrast for every visible
// text (WCAG exempts the disabled keys). It reads only; hosted addresses are refused.
// Usage: npx tsx --tsconfig tsconfig.json tools/lantern-play.ts [local base] [captures dir]
import { readFileSync, writeFileSync } from "node:fs";
import { chromium, type Page } from "playwright-core";
import { localBase } from "./local-host";
import { LANTERN_DROPS, dailyPhrase } from "../packages/daily/src/words";
import { fold } from "../packages/daily/src/text";
import type { Lang, WordFile } from "../packages/daily/src/pack";

const { base, close } = await localBase(process.argv[2]);
const shots = process.argv[3];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
const DATE = "2026-12-01";
const words = (l: string) => JSON.parse(readFileSync(new URL(`../packages/daily/data/words.v1.${l}.json`, import.meta.url), "utf8")) as WordFile;
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
    // Decoration hidden from assistive technology whose meaning is also given as text: the oil drops, whose count the
    // "drops left" line states (and is itself checked).
    if (e.closest('[aria-hidden="true"]')) continue;
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
  const w = words(lang);
  const entry = dailyPhrase(w, lang as Lang, DATE);
  const keyAlphabet = [...new Set([...w.alphabet].map((c) => fold(c, lang as Lang)))];
  const inName = new Set([...entry.p].filter((c) => /\p{L}/u.test(c)).map((c) => fold(c, lang as Lang)));
  for (const ending of ["lit", "burnt-out"] as const) {
    const tag = `${lang} ${view.name} ${scheme} ${ending}`;
    const context = await browser.newContext({ viewport: { width: view.width, height: view.height }, isMobile: view.mobile, hasTouch: view.mobile, colorScheme: scheme });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    try {
      await page.goto(`${base}/lantern/?lang=${lang}&date=${DATE}`);
      await page.waitForFunction("Boolean(window.__DAILY__)", null, { timeout: 30_000 });
      const dir = await page.evaluate("document.documentElement.dir");
      if (dir !== (lang === "ar" || lang === "ur" ? "rtl" : "ltr")) problems.push(`${tag}: direction ${dir}`);
      const plan = ending === "lit" ? keyAlphabet.filter((c) => inName.has(c)) : keyAlphabet.filter((c) => !inName.has(c)).slice(0, LANTERN_DROPS);
      if (plan.length < (ending === "lit" ? 1 : LANTERN_DROPS)) throw new Error(`cannot plan a ${ending} game`);
      let lostFocus = 0;
      for (let k = 0; k < plan.length; k++) {
        const c = plan[k]!;
        if (k === 0) {
          if (/^[a-z]$/.test(c)) await page.keyboard.press(c);
          else await page.evaluate(`document.dispatchEvent(new KeyboardEvent("keydown", { key: ${JSON.stringify(c)}, bubbles: true }))`);
          continue;
        }
        await page.focus(`.keys button:nth-child(${keyAlphabet.indexOf(c) + 1})`);
        await page.keyboard.press("Enter");
        const ok = (await page.evaluate(`(() => { const a = document.activeElement; return !!a && a !== document.body && !a.disabled && a.offsetParent !== null; })()`)) as boolean;
        if (!ok) lostFocus++;
      }
      if (lostFocus) problems.push(`${tag}: focus was lost ${lostFocus} times after a guess`);
      await page.waitForSelector("#main .card h2", { timeout: 10_000 });
      const res = (await page.evaluate(`({ head: document.querySelector("#main .card h2").textContent, link: document.querySelector("#main .card a[href]")?.href ?? "", wide: document.documentElement.scrollWidth > innerWidth + 1 })`)) as { head: string; link: string; wide: boolean };
      if (!/islam\.museum\//.test(res.link)) problems.push(`${tag}: the end card has no museum link (${res.link})`);
      if (res.wide) problems.push(`${tag}: the page scrolls sideways`);
      const c = await contrast(page);
      if (c.worst < 4.5) problems.push(`${tag}: contrast ${c.worst} at ${c.where}`);
      if (shots && (lang === "ar" || lang === "en" || lang === "ur") && view.name === "phone") await page.screenshot({ path: `${shots}/lantern-${lang}-${view.name}-${scheme}-${ending}.png`, fullPage: true });
      await page.reload();
      await page.waitForFunction("Boolean(window.__DAILY__)", null, { timeout: 30_000 });
      if (!(await page.$("#main .card h2"))) problems.push(`${tag}: the finished day was not kept after a reload`);
      if (errors.length) problems.push(`${tag}: ${errors.join(" | ")}`);
      runs.push({ tag, head: res.head, guesses: plan.length, lostFocus, contrast: c.worst });
    } catch (e) { problems.push(`${tag}: ${String(e).split("\n")[0]}`); }
    await context.close();
  }
}
await browser.close();
await close();
const report = { base, date: DATE, runs: runs.length, problems };
if (shots) writeFileSync(`${shots}/lantern-play.json`, JSON.stringify({ ...report, detail: runs }, null, 1));
console.log(JSON.stringify(report, null, 1));
process.exit(problems.length ? 1 : 0);
