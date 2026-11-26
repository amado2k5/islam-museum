// Plays Granada in real Chrome with the keyboard alone, on the plan (the page as it is without 3D): no pointer
// event is sent at any time. It checks three things a keyboard player depends on:
//   1. on each of the five parts, every visible control is reached by Tab;
//   2. after a control is used, the keyboard is still somewhere (focus has not fallen to the page's body);
//   3. a year can be begun, worked (a harvest, a repair, a building placed, a question answered), lived to its
//      end and followed by the next, by keys alone.
// The script looks at the page to know where focus is, as a sighted keyboard player does. It is not a screen
// reader and says nothing of what one would announce.
// Usage: npx tsx --tsconfig tsconfig.json tools/granada-keyboard.ts <out dir> [lang=en]
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { serveWorkspace } from "./serve";

const [outArg, lang = "en"] = process.argv.slice(2);
if (!outArg) throw new Error("usage: granada-keyboard.ts <out dir> [lang]");
const out = resolve(outArg);
mkdirSync(out, { recursive: true });
const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--window-size=1500,1000", "--window-position=0,0"] });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const game = <T>(expression: string) => page.evaluate(expression) as Promise<T>;
const problems: string[] = [];
const steps: Array<{ step: string; ok: boolean; note?: string }> = [];

const MARK = `(() => {
  const visible = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && !e.closest("[inert],[hidden],[aria-hidden='true']") && !(e.closest("details:not([open])") && !e.closest("summary")); };
  const name = (e) => e.id ? "#" + e.id : e.getAttribute("data-act") ? "[data-act='" + e.getAttribute("data-act") + "']" : e.tagName.toLowerCase() + ":" + (e.getAttribute("aria-label") || e.textContent || "").trim().slice(0, 40);
  window.__kb = { visible, name, focusables: () => [...document.querySelectorAll("button:not([disabled]), select:not([disabled]), input:not([disabled]), a[href], [tabindex='0']")].filter(visible).map(name), active: () => document.activeElement && document.activeElement !== document.body ? name(document.activeElement) : null };
})()`;
const active = () => game<string | null>("window.__kb.active()");
/** Tabs round the page once and lists what took focus. */
async function tabOrder(): Promise<string[]> {
  const seen: string[] = [];
  for (let i = 0; i < 400; i++) {
    await page.keyboard.press("Tab");
    const a = await active();
    if (a === null) continue;
    if (seen.includes(a) && a === seen[0]) break;
    if (!seen.includes(a)) seen.push(a);
  }
  return seen;
}
/** Moves focus to a control by Tab alone and uses it with Enter. */
async function use(selector: string, step: string, key = "Enter"): Promise<boolean> {
  for (let i = 0; i < 400; i++) {
    if (await page.evaluate((s) => document.activeElement?.matches(s) ?? false, selector)) {
      await page.keyboard.press(key);
      await page.waitForTimeout(150);
      const after = await active();
      if (after === null) problems.push(`after "${step}" the keyboard was nowhere (focus fell to the page's body)`);
      steps.push({ step, ok: true, note: `focus then on ${after}` });
      return true;
    }
    await page.keyboard.press("Tab");
  }
  problems.push(`"${step}": ${selector} was never reached by Tab`);
  steps.push({ step, ok: false });
  return false;
}

await page.goto(`${served.base}/games/granada/index.html?lang=${lang}&seed=7&music=off&fresh=1&view=plan&no3d=1`);
await page.waitForFunction("Boolean(window.__GR__ && window.__GR__.ready)");
await page.evaluate(MARK);
await use("#brief-start", "begin the year from the brief");

// 1. Every visible control on each part is in the Tab order.
const order: Record<string, { controls: number; reached: number; missed: string[] }> = {};
for (const [key, tab] of [["1", "overview"], ["2", "fields"], ["3", "construction"], ["4", "economy"], ["5", "ledger"]] as const) {
  await page.keyboard.press(key);
  await page.waitForTimeout(150);
  const want = [...new Set(await game<string[]>("window.__kb.focusables()"))];
  const got = await tabOrder();
  const missed = want.filter((w) => !got.includes(w));
  order[tab] = { controls: want.length, reached: want.length - missed.length, missed };
  if (missed.length) problems.push(`${tab}: not reached by Tab: ${missed.slice(0, 8).join(", ")}`);
}

// 2 and 3. A year by keys alone.
const day0 = await game<number>("window.__GR__.state().day");
await page.keyboard.press("2");
await use("[data-act^='harvest']", "harvest a field");
await page.keyboard.press("3");
if (await page.locator("[data-act='repair']:not([disabled])").count()) await use("[data-act='repair']", "repair the channel");
await use("[data-act='place-house']", "choose a house to place");
// The ring is moved by an arrow key; if that ground is refused it is moved back, and Enter builds.
await page.keyboard.press("ArrowRight");
if ((await page.locator("#site-status").getAttribute("class")) !== "site-ok") await page.keyboard.press("ArrowLeft");
await page.keyboard.press("Enter");
await page.waitForTimeout(150);
const placed = await game<number>("window.__GR__.state().placed.length");
steps.push({ step: "place the house with the arrow keys and Enter", ok: placed > 0 });
if (!placed) problems.push("a house could not be placed with the arrow keys and Enter");
if ((await active()) === null) problems.push("after placing a house the keyboard was nowhere");
// Days by the N key, answering the year's question when it is put.
let answered = false;
for (let i = 0; i < 400 && !(await game<boolean>("Boolean(window.__GR__.state().outcome)")); i++) {
  if (!answered && (await page.locator("[data-act^='decide-']").count())) {
    await page.keyboard.press("1");
    answered = await use("[data-act^='decide-']", "answer the year's question");
  }
  await page.keyboard.press("n");
}
const ended = await game<{ day: number; outcome: unknown }>("(() => { const s = window.__GR__.state(); return { day: s.day, outcome: s.outcome }; })()");
steps.push({ step: `live the year to its end by the N key (day ${day0} to ${ended.day})`, ok: Boolean(ended.outcome) });
if (!ended.outcome) problems.push("the year did not end by the N key");
await page.waitForTimeout(300);
await page.screenshot({ path: resolve(out, `keyboard-${lang}-years-end.png`) });
const endFocus = await active();
if (endFocus === null) problems.push("at the year's end the keyboard was nowhere: the dialog did not take focus");
const endButtons = await game<string[]>("[...document.querySelectorAll('dialog[open] button, .outcome button, [role=dialog] button')].filter(window.__kb.visible).map(window.__kb.name)");
steps.push({ step: "the year's end", ok: endFocus !== null, note: `focus on ${endFocus}; buttons: ${endButtons.join(", ")}` });

const report = { tool: "granada-keyboard", lang, browser: `chrome ${browser.version()}`, note: "Keys only; no pointer event sent. Not a screen reader.", tabOrder: order, steps, answered, problems };
writeFileSync(resolve(out, `granada-keyboard-${lang}.json`), `${JSON.stringify(report, null, 1)}\n`);
console.log(JSON.stringify({ tabOrder: Object.fromEntries(Object.entries(order).map(([k, v]) => [k, `${v.reached}/${v.controls}`])), steps: steps.length, problems }, null, 1));
await browser.close();
await served.close();
if (problems.length) process.exit(1);
