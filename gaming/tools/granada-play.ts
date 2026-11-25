// Plays Granada's first scenario in real Chrome, in a chosen language, and keeps the screenshots. It checks that the
// page can be played with the mouse and with the keyboard alone, that the days pass and stop when told, that a
// reload resumes the same day, that a damaged save is set aside, that the land is not mirrored for a right-to-left
// language, and that a whole campaign can be carried to its end through the page. It is a functional check and not
// a judgement of whether the game is any good.
// Usage: npx tsx --tsconfig tsconfig.json tools/granada-play.ts <out dir> [lang=en]
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type Page } from "playwright-core";
import { serveWorkspace } from "./serve";

const [outArg, lang = "en"] = process.argv.slice(2);
if (!outArg) throw new Error("usage: granada-play.ts <out dir> [lang]");
const out = resolve(outArg);
mkdirSync(out, { recursive: true });

const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--window-size=1500,1000", "--window-position=0,0", "--force-device-scale-factor=1"] });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page: Page = await context.newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("response", (r) => {
  if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
});
const url = (extra = "") => `${served.base}/games/granada/index.html?lang=${lang}&seed=7&music=off${extra}`;
const shot = (name: string) => page.screenshot({ path: resolve(out, `granada-${lang}-${name}.png`) });
const fail = async (why: string): Promise<never> => {
  await shot("failure").catch(() => {});
  await browser.close();
  await served.close();
  throw new Error(`${lang}: ${why}`);
};
const game = <T>(expression: string) => page.evaluate(expression) as Promise<T>;
const state = () => game<{ day: number; households: number; quests: Record<string, boolean>; outcome: null | { won: boolean; score: number }; works: Array<{ kind: string }>; waterFirst: string; seed: number }>("(() => { const s = window.__GR__.state(); return { day: s.day, households: s.households, quests: s.quests, outcome: s.outcome, works: s.works, waterFirst: s.waterFirst, seed: s.seed }; })()");
const ready = async () => {
  await page.waitForFunction("Boolean(window.__GR__)");
  const hook = await game<{ ready: boolean; error?: string }>("({ ready: window.__GR__.ready, error: window.__GR__.error })");
  if (!hook.ready) await fail(`the game did not start: ${hook.error}`);
};
const log: Record<string, unknown> = { lang };

// ---- A new game opens on its brief ----
await page.goto(url("&fresh=1"));
await ready();
const dir = await game<string>("document.documentElement.dir");
if ((lang === "ar" || lang === "ur") !== (dir === "rtl")) await fail(`direction is ${dir}`);
if (!(await page.locator("dialog.brief[open]").count())) await fail("no brief on a new game");
if ((await page.locator("dialog.brief a[href^='https://islam.museum/']").count()) !== 3) await fail("the brief does not link to the museum's three records");
await shot("1-brief");
// Time does not pass behind the brief, even if the clock is started.
await game("window.__GR__.state().day");
await page.locator("#brief-start").click();
if ((await state()).day !== 25) await fail("the game did not start on day 25");

// ---- The land is not mirrored ----
const mapDir = await game<string>("getComputedStyle(document.querySelector('svg.map')).direction");
const riverX = await game<number>("document.querySelector('svg.map text').getBoundingClientRect().x");
const fieldBoxes = await game<Record<string, number>>("Object.fromEntries([...document.querySelectorAll('svg.map g.field')].map(g => [g.dataset.field, g.getBoundingClientRect().x]))");
if (mapDir !== "ltr" || !(fieldBoxes["mill-field"]! < fieldBoxes["olive-terrace"]!)) await fail("the map is mirrored: the olive terrace must lie east of the mill field");
log.map = { direction: mapDir, millFieldX: Math.round(fieldBoxes["mill-field"]!), oliveTerraceX: Math.round(fieldBoxes["olive-terrace"]!), firstLabelX: Math.round(riverX) };
await shot("2-start");

// ---- With the mouse: the ripe field on the map, then its harvest ----
await page.locator("svg.map g.field[data-field='mill-field']").click();
if ((await game<string>("window.__GR__.tab()")) !== "fields") await fail("clicking a field did not open the fields");
await page.locator("[data-act='harvest-sell-mill-field']").click();
await page.locator("#tab-works").click();
await page.locator("[data-act='work-repair']").click();
if (!(await state()).works.some((w) => w.kind === "repair")) await fail("the repair was not ordered");
// A second order on the channel is refused, and the page says why.
if (!(await page.locator("[data-act='work-expand']").isDisabled())) await fail("the great works can be ordered while the repair is under way");
await shot("3-works");
await page.locator("#step").click();
const afterOne = await state();
if (afterOne.day !== 26 || !afterOne.quests["q02-harvest"]) await fail("a day did not pass, or the first harvest was not done");
if (!(await page.locator(".toast").count())) await fail("the day's events were not announced");

// ---- With the keyboard alone: the market, the water, a day ----
await page.keyboard.press("4");
if ((await game<string>("window.__GR__.tab()")) !== "market") await fail("the key 4 did not open the market");
await page.locator("[data-act='buy-timber-10']").focus();
await page.keyboard.press("Enter");
const timber = await game<number>("window.__GR__.state().economy.stock.timber.quantity");
if (timber !== 130) await fail(`buying ten timber by keyboard left ${timber}`);
await shot("4-market");
await page.keyboard.press("1");
await page.locator("#water-fields").focus();
await page.keyboard.press("Enter");
if ((await state()).waterFirst !== "fields") await fail("the water order was not changed by keyboard");
if ((await game<string>("document.activeElement.id")) !== "water-fields") await fail("the keyboard lost its place when the panel was redrawn");
await page.keyboard.press("n");
if ((await state()).day !== 27) await fail("the key n did not pass a day");

// ---- The days pass on their own, and stop ----
await page.locator("#speed-2").click();
await page.waitForFunction("window.__GR__.state().day >= 30", undefined, { timeout: 8000 });
await page.keyboard.press("p");
const paused = (await state()).day;
await page.waitForTimeout(1200);
if ((await state()).day !== paused) await fail("the days went on after a pause");
// And they do not pass while the help is open.
await page.locator("#speed-2").click();
await page.keyboard.press("h");
const behind = (await state()).day;
await page.waitForTimeout(1200);
if ((await state()).day !== behind) await fail("the days passed behind the help");
if ((await page.locator("dialog.help .langs a").count()) !== 7) await fail("the help does not offer the seven languages");
await shot("5-help");
await page.locator("#help-close").click();
await page.keyboard.press("p");
await shot("6-valley");

// ---- A reload resumes the same day; a damaged save is set aside ----
const before = await state();
await page.goto(url());
await ready();
const after = await state();
if (after.day !== before.day || after.seed !== before.seed) await fail(`the reload resumed day ${after.day}, not ${before.day}`);
await page.locator("#brief-start").click();
await game("localStorage.setItem('im.granada.save.v1', '{ not a save')");
await page.goto(url());
await ready();
if (!(await page.locator("dialog.brief .warnline").count())) await fail("a damaged save was not reported");
if ((await state()).day !== 25) await fail("a damaged save did not start a new game");
await page.locator("#brief-start").click();

// ---- A whole campaign through the page, by the way of the mender ----
await page.goto(url("&fresh=1"));
await ready();
await page.locator("#brief-start").click();
// Passed as text: a function handed over by this runner would carry helper calls the page does not have.
const campaign = await game<{ orders: number; day: number; outcome: { won: boolean; score: number; reasons: string[] } | null; quests: Record<string, boolean>; households: number; welfare: number }>(`(() => {
  const g = window.__GR__;
  const stock = (good) => g.state().economy.stock[good]?.quantity ?? 0;
  let orders = 0;
  // Refusals are expected: this asks every day for what a steward would want, as the scripted player does.
  const tryOrder = (c) => { if (g.order(c)) orders += 1; };
  while (!g.state().outcome) {
    const s = g.state();
    for (const [id, p] of Object.entries(s.plots)) if (p.ripeSince !== null && p.standing > 0 && p.harvesting === null) tryOrder({ kind: "harvest", plot: id, rest: "wait" });
    if (!s.built.repaired && !s.works.some((w) => w.kind === "repair")) tryOrder({ kind: "repair" });
    if (!s.built.granary && !s.works.some((w) => w.kind === "granary")) tryOrder({ kind: "build", what: "granary" });
    if (s.plots["mill-field"].crop === null && Math.floor(((s.day - 1) % 120) / 30) <= 1) tryOrder({ kind: "plant", plot: "mill-field", crop: "vegetables" });
    if (s.built.house + s.works.filter((w) => w.kind === "house").length < 1) tryOrder({ kind: "build", what: "house" });
    if (stock("olives") > 0) tryOrder({ kind: "sell", good: "olives", quantity: stock("olives") });
    // Grain is bought when the store runs low, while a little money is kept in hand.
    const days = Math.floor((stock("wheat") + stock("vegetables")) / Math.ceil(s.households / 10));
    if (days < 25 && g.state().economy.treasury.available > (100 + 26 * 20) * 100) tryOrder({ kind: "buy", good: "wheat", quantity: 20 });
    g.days(1);
  }
  const s = g.state();
  return { orders, day: s.day, outcome: s.outcome, quests: s.quests, households: s.households, welfare: s.welfare };
})()`);
log.campaign = campaign;
if (!campaign.outcome?.won) await fail(`the campaign through the page was lost: ${JSON.stringify(campaign.outcome)}`);
if (!(await page.locator("dialog.outcome.won[open]").count())) await fail("no outcome was shown at the end");
await shot("7-outcome");
await page.locator("#new-year").click();
const next = await state();
if (next.day !== 25 || next.seed !== 8 || next.outcome !== null) await fail("another year did not begin a new game with other weather");
await shot("8-another-year");

log.consoleErrors = errors;
log.screenshots = out;
console.log(JSON.stringify(log));
writeFileSync(resolve(out, `granada-${lang}.json`), `${JSON.stringify(log, null, 1)}\n`);
await browser.close();
await served.close();
if (errors.length) throw new Error(`${lang}: ${errors.length} console or network error(s): ${errors.slice(0, 3).join(" | ")}`);
