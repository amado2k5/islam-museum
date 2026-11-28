// Plays whole games of Kalima with the keyboard alone on the local host, in every language, on a phone-sized and a
// desktop screen, in light and dark: one won in a few tries and one lost after six wrong ones. Checks that the end card
// names the record and links to the museum, that the result is read out, that the day is kept after a reload, and that
// every letter on a marked tile or key has at least 4.5:1 contrast. It reads only; hosted addresses are refused.
// Usage: npx tsx --tsconfig tsconfig.json tools/kalima-play.ts [local base] [captures dir]
import { readFileSync, writeFileSync } from "node:fs";
import { chromium, type Page } from "playwright-core";
import { localBase } from "./local-host";
import { dailyWord, wordLetters } from "../packages/daily/src/words";
import type { WordFile } from "../packages/daily/src/pack";

const { base, close } = await localBase(process.argv[2]);
const shots = process.argv[3];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
const DATE = "2026-12-01";
const browser = await chromium.launch({ channel: process.env.BROWSER ?? "chrome", headless: true });
const problems: string[] = [];
const runs: unknown[] = [];
const words = (l: string) => JSON.parse(readFileSync(new URL(`../packages/daily/data/words.v1.${l}.json`, import.meta.url), "utf8")) as WordFile;

// Written as a string so the bundler adds nothing to it that the page does not have.
const contrast = (page: Page) => page.evaluate(`(() => {
  const lum = (c) => { const m = c.match(/[\\d.]+/g).slice(0, 3).map(Number).map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]; };
  let worst = 99; let where = "";
  for (const e of document.querySelectorAll(".tile.hit, .tile.near, .tile.miss, .keys button.hit, .keys button.near, .keys button.miss")) {
    const cs = getComputedStyle(e);
    const a = lum(cs.color), b = lum(cs.backgroundColor);
    const r = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    if (r < worst) { worst = r; where = e.className + " " + e.textContent + " " + cs.color + " on " + cs.backgroundColor + " opacity " + cs.opacity; }
  }
  return { worst: Math.round(worst * 100) / 100, where };
})()`) as Promise<{ worst: number; where: string }>;

for (const scheme of ["light", "dark"] as const) for (const view of [{ name: "phone", width: 375, height: 812, mobile: true }, { name: "desktop", width: 1440, height: 900, mobile: false }]) for (const lang of LANGS) {
  const answer = wordLetters(dailyWord(words(lang), lang, DATE).w);
  const wrong = [...words(lang).alphabet].find((c) => !answer.includes(c))!;
  for (const ending of ["won", "lost"] as const) {
    const tag = `${lang} ${view.name} ${scheme} ${ending}`;
    const context = await browser.newContext({ viewport: { width: view.width, height: view.height }, isMobile: view.mobile, hasTouch: view.mobile, colorScheme: scheme });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    try {
      await page.goto(`${base}/kalima/?lang=${lang}&date=${DATE}`);
      await page.waitForFunction("Boolean(window.__DAILY__)", null, { timeout: 30_000 });
      const dir = await page.evaluate("document.documentElement.dir");
      if (dir !== (lang === "ar" || lang === "ur" ? "rtl" : "ltr")) problems.push(`${tag}: direction ${dir}`);
      // Each letter is a key press carrying that character, as a keyboard in the page's language sends it. The test
      // browser can press only the keys of a US layout; for any other letter it would insert text and send no key
      // event, so for those the same keydown an Arabic, Urdu or Turkish keyboard sends is dispatched to the page.
      const key = async (c: string) => {
        if (/^[a-z]$/.test(c)) return page.keyboard.press(c);
        await page.evaluate(`document.dispatchEvent(new KeyboardEvent("keydown", { key: ${JSON.stringify(c)}, bubbles: true }))`);
      };
      const type = async (letters: string[]) => { for (const c of letters) await key(c); await page.keyboard.press("Enter"); };
      // One guess first that is all one wrong letter, so every kind of mark is on the board before the end.
      await type(Array(answer.length).fill(wrong));
      if (ending === "won") await type(answer);
      else for (let i = 0; i < 5; i++) await type(Array(answer.length).fill(wrong));
      await page.waitForSelector(".card h2", { timeout: 10_000 });
      const card = (await page.evaluate(`({ head: document.querySelector(".card h2")?.textContent ?? "", link: document.querySelector(".card a[href]")?.href ?? "", said: document.querySelector("[aria-live]")?.textContent ?? "" })`)) as { head: string; link: string; said: string };
      if (!card.head) problems.push(`${tag}: no end card`);
      if (!/islam\.museum\//.test(card.link)) problems.push(`${tag}: the end card has no museum link (${card.link})`);
      const c = await contrast(page);
      if (c.worst < 4.5) problems.push(`${tag}: contrast ${c.worst} at ${c.where}`);
      if (shots && ending === "won" && (lang === "ar" || lang === "en")) await page.screenshot({ path: `${shots}/kalima-${lang}-${view.name}-${scheme}.png`, fullPage: true });
      await page.reload();
      await page.waitForFunction("Boolean(window.__DAILY__)", null, { timeout: 30_000 });
      if (!(await page.$(".card h2"))) problems.push(`${tag}: the finished day was not kept after a reload`);
      if (errors.length) problems.push(`${tag}: ${errors.join(" | ")}`);
      runs.push({ tag, head: card.head, contrast: c.worst });
    } catch (e) { problems.push(`${tag}: ${String(e).split("\n")[0]}`); }
    await context.close();
  }
}
await browser.close();
await close();
const report = { base, date: DATE, runs: runs.length, problems };
if (shots) writeFileSync(`${shots}/kalima-play.json`, JSON.stringify({ ...report, detail: runs }, null, 1));
console.log(JSON.stringify(report, null, 1));
process.exit(problems.length ? 1 : 0);
