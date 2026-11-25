// Plays one full Atlas daily game in real Chrome, in a chosen language, and keeps the screenshots.
// It is a functional check (the game can be started, played with the mouse and the keyboard, finished, and resumed
// after a reload) and it is not a judgement of whether the game is any good.
// Usage: npx tsx tools/atlas-play.ts <out dir> [lang=en] [date=2026-12-01]
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { serveWorkspace } from "./serve";

const [outArg, lang = "en", date = "2026-12-01"] = process.argv.slice(2);
if (!outArg) throw new Error("usage: atlas-play.ts <out dir> [lang] [date]");
const out = resolve(outArg);
mkdirSync(out, { recursive: true });

const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--window-size=1600,990", "--window-position=0,0", "--force-device-scale-factor=1"] });
const context = await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
const page = await context.newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error" && !m.text().includes("favicon")) errors.push(m.text());
});
const url = `${served.base}/games/atlas/index.html?lang=${lang}&date=${date}`;
await page.goto(url);
await page.waitForSelector("#panel h2");
const shot = (name: string) => page.screenshot({ path: resolve(out, `atlas-${lang}-${name}.png`) });
const fail = async (why: string): Promise<never> => {
  await shot("failure");
  await browser.close();
  await served.close();
  throw new Error(why);
};

const dir = await page.evaluate(() => document.documentElement.dir);
if ((lang === "ar" || lang === "ur") !== (dir === "rtl")) await fail(`direction is ${dir} for ${lang}`);
await shot("1-question");

for (let round = 1; round <= 5; round++) {
  const submit = page.locator("button.primary");
  if (!(await submit.isDisabled())) await fail(`round ${round}: submit is enabled before a pin is placed`);
  if (round === 1) {
    // By mouse: click a point on the globe.
    await page.mouse.click(1000, 430);
  } else if (round === 2) {
    // By keyboard only: focus the globe, turn it, drop the pin at the centre.
    await page.focus("#globe");
    for (let i = 0; i < 3; i++) await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
  } else if (round === 3) {
    // By typed coordinates, with the region hint and a century estimate.
    await page.fill("#lat", "33.3");
    await page.fill("#lon", "44.4");
    await page.locator("#panel .field button").first().click();
    await page.locator("#panel .field").nth(2).locator("button").click();
    await page.locator("#panel .field").nth(1).locator("button").nth(1).click();
    await shot("3-hint-and-century");
  } else {
    await page.mouse.click(900 + round * 30, 380 + round * 20);
  }
  if (await submit.isDisabled()) await fail(`round ${round}: submit is still disabled after placing a pin`);
  await submit.click();
  await page.waitForSelector("#panel .big");
  if (round === 1) await shot("2-reveal");
  if (round === 2) {
    // Reload in the middle of the game: the daily game must come back where it was.
    await page.reload();
    await page.waitForSelector("#panel h2");
    const done = await page.locator(".dot.done").count();
    if (done !== 2) await fail(`after a reload the game shows ${done} finished rounds, expected 2`);
  } else {
    await page.locator("button.primary").click();
  }
}
await page.waitForSelector(".marks");
await shot("4-summary");
const total = await page.locator("#panel .big").textContent();
// A corrupted save must not break the page.
await page.evaluate(() => localStorage.setItem("im.atlas.save.v1", "{not json"));
await page.reload();
await page.waitForSelector("#panel h2");
const kept = await page.evaluate(() => localStorage.getItem("im.atlas.save.v1.unreadable"));
if (kept !== "{not json") await fail("an unreadable save was not set aside");
await browser.close();
await served.close();
if (errors.length) throw new Error(`console errors:\n${errors.join("\n")}`);
console.log(JSON.stringify({ lang, date, total, direction: dir, consoleErrors: errors.length, screenshots: out }));
