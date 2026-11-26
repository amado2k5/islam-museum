// The device check on every game: a phone is told plainly, in Arabic and English, and none of the game's engine is
// fetched; a desktop gets the game. In real Chrome, against the workspace's own files.
// Usage: npx tsx --tsconfig tsconfig.json tools/platform-gate.ts [out dir]
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { serveWorkspace } from "./serve";

const outDir = process.argv[2] ? resolve(process.argv[2]) : null;
if (outDir) mkdirSync(outDir, { recursive: true });
const registry = JSON.parse(readFileSync(fileURLToPath(new URL("../games/registry.json", import.meta.url)), "utf8")) as { games: { id: string; page: string | null }[] };
// How each game shows that it has started.
const STARTED: Record<string, string> = {
  granada: "Boolean(window.__GR__ && (window.__GR__.ready || window.__GR__.error))",
  "golden-age": "Boolean(window.__GA__ && (window.__GA__.ready || window.__GA__.error))",
  atlas: "Boolean(document.querySelector('#panel h2'))",
  hudhud: "Boolean(window.__HH__ && window.__HH__.ready)",
};
const heavy = (urls: string[]) => urls.filter((u) => /\/three|babylon|phaser|\/ui\/app\.ts|\/view\/|\/scenes\//.test(u));
const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--window-size=1500,950", "--force-device-scale-factor=1"] });
const results: { check: string; pass: boolean; detail: unknown }[] = [];
const errors: string[] = [];
for (const game of registry.games.filter((g) => g.page)) {
  if (!STARTED[game.id]) {
    results.push({ check: `${game.id}: known to this tool`, pass: false, detail: "a game is in the registry and this tool does not know how it starts" });
    continue;
  }
  const refused: Record<string, unknown> = {};
  let ok = true;
  for (const lang of ["ar", "en"]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, screen: { width: 390, height: 844 }, hasTouch: true, isMobile: true, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Mobile/15E148 Safari/604.1" });
    const page = await ctx.newPage();
    const urls: string[] = [];
    page.on("request", (r) => urls.push(r.url()));
    page.on("pageerror", (e) => errors.push(`${game.id} ${lang}: ${e}`));
    await page.goto(`${served.base}/games/${game.id}/index.html?lang=${lang}&music=off`);
    const shown = await page.waitForSelector(".im-unsupported h1", { timeout: 20000 }).then(() => true, () => false);
    const seen = (await page.evaluate("({ h1: document.querySelector('.im-unsupported h1')?.textContent ?? null, reasons: (window.__IM_PREFLIGHT__ || {}).reasons || [], dir: document.documentElement.dir, appShown: getComputedStyle(document.getElementById('app')).display !== 'none' && !document.getElementById('app').classList.contains('im-unsupported'), about: document.querySelectorAll('.im-unsupported section p').length, link: document.querySelector('.im-unsupported a')?.getAttribute('href') ?? null })")) as { h1: string | null; reasons: string[]; dir: string; appShown: boolean; about: number; link: string | null };
    const good = shown && seen.reasons.includes("phone") && heavy(urls).length === 0 && seen.dir === (lang === "ar" ? "rtl" : "ltr") && !seen.appShown && seen.about >= 1 && seen.link === `https://islam.museum/${lang}/`;
    refused[lang] = { ...seen, heavy: heavy(urls), requests: urls.length };
    ok &&= good;
    if (outDir) await page.screenshot({ path: resolve(outDir, `gate-${game.id}-phone-${lang}.png`) });
    await ctx.close();
  }
  results.push({ check: `${game.id}: a phone is told it is not supported and none of the game is fetched`, pass: ok, detail: refused });

  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`${game.id} desktop: ${e}`));
  await page.goto(`${served.base}/games/${game.id}/index.html?lang=en&music=off&fresh=1`);
  let started = false;
  for (const end = Date.now() + 90_000; Date.now() < end; ) {
    if ((await page.evaluate(STARTED[game.id]!)) as boolean) {
      started = true;
      break;
    }
    await page.waitForTimeout(200);
  }
  const state = (await page.evaluate("({ pre: window.__IM_PREFLIGHT__ || null, left: document.querySelectorAll('.im-unsupported').length, appShown: getComputedStyle(document.getElementById('app')).display !== 'none', lang: document.documentElement.lang })")) as { pre: { ok: boolean } | null; left: number; appShown: boolean; lang: string };
  results.push({ check: `${game.id}: a desktop gets the game`, pass: started && state.pre?.ok === true && state.left === 0 && state.appShown && state.lang === "en", detail: state });
  await ctx.close();

  // A game that still saves to localStorage: what it keeps is copied to the vault, and comes back after the
  // storage is cleared, before the game reads it. Hudhud keeps its own progress in the vault and is not in this.
  if (game.id !== "hudhud") {
    const c2 = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    let p2 = await c2.newPage();
    p2.on("pageerror", (e) => errors.push(`${game.id} backup: ${e}`));
    const wait = async () => {
      for (const end = Date.now() + 90_000; Date.now() < end; ) {
        if ((await p2.evaluate(STARTED[game.id]!)) as boolean) return true;
        await p2.waitForTimeout(200);
      }
      return false;
    };
    await p2.goto(`${served.base}/games/${game.id}/index.html?lang=en&music=off`);
    await wait();
    const kept = (await p2.evaluate(`(async () => { localStorage.setItem('im.${game.id}.probe.v1', 'kept by the vault'); const r = await window.__IM_BACKUP__.save(); const keys = Object.keys(localStorage).filter((k) => k.startsWith('im.${game.id}.')).sort(); const values = Object.fromEntries(keys.map((k) => [k, localStorage.getItem(k)])); localStorage.clear(); return { saved: r && r.ok, keys, values }; })()`)) as { saved: boolean; keys: string[]; values: Record<string, string> };
    await p2.close();
    p2 = await c2.newPage();
    await p2.goto(`${served.base}/games/${game.id}/index.html?lang=en&music=off`);
    const startedAgain = await wait();
    const back = (await p2.evaluate(`({ restored: window.__IM_BACKUP__ ? window.__IM_BACKUP__.restored : null, probe: localStorage.getItem('im.${game.id}.probe.v1') })`)) as { restored: string[] | null; probe: string | null };
    results.push({ check: `${game.id}: what it keeps in localStorage is backed up, and comes back after the storage is cleared`, pass: kept.saved === true && startedAgain && back.probe === "kept by the vault" && JSON.stringify(back.restored) === JSON.stringify(kept.keys), detail: { keys: kept.keys, back } });
    await p2.evaluate(`(async () => { localStorage.removeItem('im.${game.id}.probe.v1'); })()`);
    await c2.close();
  }
}
await browser.close();
await served.close();
const report = { ran: new Date().toISOString(), browser: "chrome", results, errors };
if (outDir) writeFileSync(resolve(outDir, "platform-gate.json"), `${JSON.stringify(report, null, 1)}\n`);
console.log(JSON.stringify(report, null, 1));
if (errors.length || results.some((r) => !r.pass)) process.exit(1);
