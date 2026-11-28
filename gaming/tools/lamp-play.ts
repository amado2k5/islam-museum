// Plays The Lamp of the Ages from a fresh save to the end with the keyboard alone, on the local host: the century dial
// moved with the arrow keys, every button pressed with Enter. At each of the five places it meets the figure, answers
// wrongly once and then rightly, takes the record card and invites up to two companions, then goes back to the map.
// In every language, on a phone-sized and a desktop screen, in light and dark. Checks the page's direction, that focus
// lands on the view's heading after every action (and on the dial after it moves), that every card carried links to
// the museum, the end message, that the save survives a reload, no console error, no sideways scroll at phone width,
// every button at least 24×24 CSS pixels (WCAG 2.2 target size), and 4.5:1 contrast for every visible text. It reads
// only; hosted addresses are refused.
// Usage: npx tsx --tsconfig tsconfig.json tools/lamp-play.ts [local base] [captures dir]
import { writeFileSync } from "node:fs";
import { chromium, type Page } from "playwright-core";
import { localBase } from "./local-host";
import records from "../games/lamp/data/records.json";
import { DESTINATIONS } from "../games/lamp/src/content";
import { century } from "../games/lamp/src/sim";

const { base, close } = await localBase(process.argv[2]);
const shots = process.argv[3];
const LANGS = (process.env.LAMP_LANGS ? process.env.LAMP_LANGS.split(",") : ["ar", "en", "ur", "fr", "es", "tr", "id"]) as readonly string[];
const R = records as unknown as Record<string, { label: Record<string, string>; year: number | null }>;
const nameIn = (id: string, lang: string) => R[id]!.label[lang] ?? R[id]!.label.en!;
const centuryOf = (destId: string) => century(R[DESTINATIONS.find((d) => d.id === destId)!.when]!.year!);
const centuries = [...new Set(DESTINATIONS.map((d) => centuryOf(d.id)))].sort((a, b) => a - b);
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

const focusIs = (page: Page, id: string) => page.evaluate(`document.activeElement?.id === ${JSON.stringify(id)}`) as Promise<boolean>;
const smallTargets = (page: Page) => page.evaluate(`[...document.querySelectorAll("#main button, #main input, #main select")].filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.height && (r.width < 24 || r.height < 24); }).map((e) => e.tagName + " " + (e.textContent || e.id).slice(0, 20))`) as Promise<string[]>;

for (const scheme of ["light", "dark"] as const) for (const view of [{ name: "phone", width: 375, height: 812, mobile: true }, { name: "desktop", width: 1440, height: 900, mobile: false }]) for (const lang of LANGS) {
  const tag = `${lang} ${view.name} ${scheme}`;
  const context = await browser.newContext({ viewport: { width: view.width, height: view.height }, isMobile: view.mobile, hasTouch: view.mobile, colorScheme: scheme });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  let worst = 99; let where = ""; let lostFocus = 0; const small = new Set<string>(); let wide = false;
  const look = async () => {
    const c = await contrast(page);
    if (c.worst < worst) { worst = c.worst; where = c.where; }
    for (const x of await smallTargets(page)) small.add(x);
    if (await page.evaluate("document.documentElement.scrollWidth > innerWidth + 1")) wide = true;
  };
  const act = async (selector: string) => {
    await page.focus(selector, { timeout: 5000 }).catch(async () => { const state = await page.evaluate(`[...document.querySelectorAll(".view > *")].map((e) => e.tagName + (e.className ? "." + e.className : "") + (e.disabled ? "[disabled]" : "") + " " + (e.textContent || "").slice(0, 50)).join(" | ")`); throw new Error(`no element for ${selector}; the view holds: ${state}`); });
    await page.keyboard.press("Enter");
    if (!(await focusIs(page, "view-h"))) lostFocus++;
    await look();
  };
  try {
    await page.goto(`${base}/lamp/?lang=${lang}`);
    await page.waitForFunction("Boolean(window.__DAILY__)", null, { timeout: 30_000 });
    const dir = await page.evaluate("document.documentElement.dir");
    if (dir !== (lang === "ar" || lang === "ur" ? "rtl" : "ltr")) problems.push(`${tag}: direction ${dir}`);
    await look();
    const done = new Set<string>();
    let companions = 0;
    for (let guard = 0; done.size < DESTINATIONS.length && guard < 10; guard++) {
      const cards = new Set(DESTINATIONS.filter((d) => done.has(d.id)).map((d) => d.gives));
      const next = DESTINATIONS.find((d) => !done.has(d.id) && (d.needs === null || cards.has(d.needs)))!;
      // The dial: Home, then the up arrow to the century, as a keyboard player moves a slider. (In a right-to-left page
      // the right arrow lowers a slider, as browsers intend; the up arrow raises it in either direction.)
      await page.focus("#dial");
      await page.keyboard.press("Home");
      for (let k = 0; k < centuries.indexOf(centuryOf(next.id)); k++) await page.keyboard.press("ArrowUp");
      if (!(await focusIs(page, "dial"))) lostFocus++;
      const at = Number(await page.evaluate(`document.getElementById("dial").value`));
      if (at !== centuries.indexOf(centuryOf(next.id))) throw new Error(`the dial stands at ${at}, not ${centuries.indexOf(centuryOf(next.id))}`);
      const here = DESTINATIONS.filter((d) => centuryOf(d.id) === centuryOf(next.id));
      await act(`ul.dests > li:nth-child(${here.indexOf(next) + 1}) > button`);
      await act(".view > button:not(.secondary)"); // meet
      const q = next.question;
      const wrong = q.options[0]!;
      const pick = async (id: string) => {
        const k = (await page.evaluate(`[...document.querySelectorAll("fieldset.q button")].map((b) => b.textContent)`)) as string[];
        const i = k.indexOf(nameIn(id, lang));
        if (i < 0) throw new Error(`no answer button for ${id} at ${next.id}`);
        await act(`fieldset.q button:nth-of-type(${i + 1})`);
      };
      await pick(wrong);
      if (!(await page.$("fieldset.q"))) problems.push(`${tag}: a wrong answer at ${next.id} ended the question`);
      await pick(q.answer);
      await act(".view > button:not(.secondary)"); // take the card
      if (companions < 2) { await act(".view > button:not(.secondary)"); companions++; } // invite along
      done.add(next.id);
      await act(".view > button.secondary"); // back to the map
    }
    const end = (await page.evaluate(`({ done: !!document.querySelector(".view .done"), cards: [...document.querySelectorAll("#satchel-h + ul a[href]")].map((a) => a.href), companions: document.querySelectorAll("#comp-h + ul li").length })`)) as { done: boolean; cards: string[]; companions: number };
    if (!end.done) problems.push(`${tag}: no end message after five missions`);
    if (end.cards.length !== DESTINATIONS.length || !end.cards.every((h) => /islam\.museum\//.test(h))) problems.push(`${tag}: ${end.cards.length} cards with museum links`);
    if (end.companions !== 2) problems.push(`${tag}: ${end.companions} companions`);
    if (lostFocus) problems.push(`${tag}: focus missed its place ${lostFocus} times`);
    if (worst < 4.5) problems.push(`${tag}: contrast ${worst} at ${where}`);
    if (small.size) problems.push(`${tag}: targets under 24px: ${[...small].join(", ")}`);
    if (wide) problems.push(`${tag}: the page scrolls sideways`);
    if (shots && view.name === "phone" && (lang === "ar" || lang === "en" || lang === "ur")) await page.screenshot({ path: `${shots}/lamp-${lang}-${view.name}-${scheme}-end.png`, fullPage: true });
    await page.reload();
    await page.waitForFunction("Boolean(window.__DAILY__)", null, { timeout: 30_000 });
    const kept = (await page.evaluate(`document.querySelectorAll("#satchel-h + ul a[href]").length`)) as number;
    if (kept !== DESTINATIONS.length) problems.push(`${tag}: ${kept} cards after a reload`);
    if (errors.length) problems.push(`${tag}: ${errors.join(" | ")}`);
    runs.push({ tag, cards: end.cards.length, companions: end.companions, lostFocus, contrast: worst });
  } catch (e) { problems.push(`${tag}: ${String(e).split("\n")[0]}`); }
  await context.close();
}
await browser.close();
await close();
const report = { base, runs: runs.length, problems };
if (shots) writeFileSync(`${shots}/lamp-play.json`, JSON.stringify({ ...report, detail: runs }, null, 1));
console.log(JSON.stringify(report, null, 1));
process.exit(problems.length ? 1 : 0);
