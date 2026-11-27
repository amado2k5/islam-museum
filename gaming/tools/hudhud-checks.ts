// Things about Hudhud that only a real browser can show, each checked and reported: a quest left in the middle comes
// back after the page is loaded again; a key can be given to an action and then works; a redraw of the picture keeps
// the quest; and with WebGL refused the whole quest can still be finished from the list in words.
// Usage: npx tsx --tsconfig tsconfig.json tools/hudhud-checks.ts [out dir]
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type BrowserContext, type Page } from "playwright-core";
import { ATLASBOOK, worldCentre } from "../games/hudhud/src/art/atlasbook";
import { algebraStart } from "../games/hudhud/src/content/algebra";
import { moveName, shortest } from "../games/hudhud/src/sim/algebra";
import { SHEETS_ART, sheetOrigin, sheetsLayout } from "../games/hudhud/src/art/sheets";
import { PAPER_ART, placeX } from "../games/hudhud/src/art/paper";
import { ROUTE_ART, beadPos } from "../games/hudhud/src/art/route";
import { SORT_ART, cardRects, trayRects } from "../games/hudhud/src/art/sort";
import { CHANNELS_ART, channelsLayout, tileOrigin } from "../games/hudhud/src/art/channels";
import { COLLATE_ART, cellCentre } from "../games/hudhud/src/art/collate";
import { flow, period, type Kind, type Side } from "../games/hudhud/src/sim/channels";
import { clockPuzzle } from "../games/hudhud/src/content/clock";
import { applyClock, newClock } from "../games/hudhud/src/sim/clock";
import { coupleOffer } from "../games/hudhud/src/content/couple";
import { applyCouple, newCouple } from "../games/hudhud/src/sim/couple";
import { leaveOpening } from "./hudhud-opening";
import { serveWorkspace } from "./serve";

const outDir = process.argv[2] ? resolve(process.argv[2]) : null;
const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--window-size=1300,900", "--force-device-scale-factor=1"] });
const errors: string[] = [];
const results: { check: string; pass: boolean; detail: unknown }[] = [];
const record = (check: string, pass: boolean, detail: unknown) => results.push({ check, pass, detail });
// Every check but the one about the opening itself leaves the opening by its Skip button, as a visitor would.
const open = async (ctx: BrowserContext, query: string, keepOpening = false): Promise<Page> => {
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${served.base}/games/hudhud/index.html?lang=en&music=off${query}`);
  await page.waitForFunction("window.__HH__ && (window.__HH__.ready || window.__HH__.error)");
  if (!keepOpening) await leaveOpening(page);
  return page;
};
const playing = async (page: Page) => {
  await page.locator(".hub button.primary").click();
  await page.waitForFunction("window.__HH__.where() !== null", undefined, { timeout: 30000 });
};
const ev = <T>(page: Page, js: string) => page.evaluate(js) as Promise<T>;

// 1. Leave in the middle, load the page again, and find the room as it was.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  let page = await open(ctx, "");
  await playing(page);
  await ev(page, "window.__HH__.command({type:'skip'}); window.__HH__.touch('mirror-a'); window.__HH__.touch('cat'); window.__HH__.command({type:'skip'}); window.__HH__.touch('cord'); window.__HH__.command({type:'skip'});");
  const left = await ev<{ leans: unknown; turns: number; flags: string[]; dark: boolean }>(page, "(() => { const s = window.__HH__.state(); return { leans: s.puzzle.mirrors.map((m) => m.lean), turns: s.turns, flags: s.flags, dark: s.dark }; })()");
  await page.close();
  page = await open(ctx, "");
  const cover = await ev<{ resumed: boolean; button: string; again: number }>(page, "({ resumed: window.__HH__.resumed(), button: document.querySelector('.hub button.primary').textContent, again: document.querySelectorAll('.hub li.open button').length })");
  await playing(page);
  const back = await ev<typeof left & { talk: unknown }>(page, "(() => { const s = window.__HH__.state(); return { leans: s.puzzle.mirrors.map((m) => m.lean), turns: s.turns, flags: s.flags, dark: s.dark, talk: s.talk }; })()");
  if (outDir) (mkdirSync(outDir, { recursive: true }), await page.screenshot({ path: resolve(outDir, "resumed.png") }));
  record("a quest left in the middle comes back", cover.resumed && cover.button.startsWith("Continue: ") && JSON.stringify({ ...back, talk: undefined }) === JSON.stringify({ ...left, talk: undefined }) && back.talk === null, { left, cover, back });
  // Finishing clears it: the next visit starts fresh.
  await ev(page, "for (const id of ['mirror-c','mirror-e']) { window.__HH__.touch(id); } window.__HH__.command({type:'skip'}); window.__HH__.touch('page');");
  await page.close();
  page = await open(ctx, "");
  const kept = await ev<{ resume: unknown; quests: Record<string, { done: boolean }> }>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1')).slots[0]");
  record("a finished quest is recorded and not offered again as unfinished", (await ev<boolean>(page, "window.__HH__.resumed()")) === false && kept.resume === null && Object.values(kept.quests).some((q) => q.done), { resume: kept.resume, quests: kept.quests });
  await ctx.close();
}
// 2. Give the J key to flying, in the settings, with the keyboard; J then lifts the bird and Space no longer does.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await open(ctx, "");
  await playing(page);
  await ev(page, "window.__HH__.command({type:'skip'})");
  await page.getByRole("button", { name: "Settings" }).click();
  await page.locator(".sheet button", { hasText: /^Fly:/ }).click();
  await page.keyboard.press("KeyJ");
  const keys = await ev<Record<string, string[]>>(page, "window.__HH__.keys()");
  const label = await page.locator(".sheet button", { hasText: /^Fly:/ }).textContent();
  await page.locator(".sheet button.primary").click();
  await page.locator("#stage").focus();
  const y0 = (await ev<{ y: number }>(page, "window.__HH__.where()")).y;
  await page.keyboard.down("Space");
  await page.waitForTimeout(250);
  await page.keyboard.up("Space");
  const ySpace = (await ev<{ y: number }>(page, "window.__HH__.where()")).y;
  await page.keyboard.down("KeyJ");
  await page.waitForTimeout(250);
  await page.keyboard.up("KeyJ");
  const yJ = (await ev<{ y: number }>(page, "window.__HH__.where()")).y;
  record("a key can be given to an action, and works", keys.fly?.join() === "KeyJ" && ySpace === y0 && yJ < y0 - 20, { keys, label, y0, ySpace, yJ });
  await page.reload();
  await page.waitForFunction("window.__HH__ && window.__HH__.ready");
  record("the keys are remembered", (await ev<Record<string, string[]>>(page, "window.__HH__.keys()")).fly?.join() === "KeyJ", null);
  await ctx.close();
}
// 3. A redraw of the picture keeps the quest.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await open(ctx, "&fresh=1");
  await playing(page);
  await ev(page, "window.__HH__.command({type:'skip'}); window.__HH__.touch('mirror-a'); window.__HH__.touch('cat'); window.__HH__.command({type:'skip'}); window.__HH__.redraw();");
  await page.waitForTimeout(1200);
  const after = await ev<{ turns: number; flags: string[]; scene: boolean }>(page, "({ turns: window.__HH__.state().turns, flags: window.__HH__.state().flags, scene: window.__HH__.where() !== null })");
  record("a redraw keeps the quest", after.turns === 1 && after.flags.includes("metCat") && after.scene, after);
  await ctx.close();
}
// 4. With WebGL refused, the quest is finished from the list in words.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript("const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, ...a) { return /webgl/.test(t) ? null : g.call(this, t, ...a); };");
  // The device check would refuse a browser without WebGL 2 at the door; this check is of what the game does if
  // the graphics fail after the door, so the door is held open with the testing override.
  const page = await open(ctx, "&fresh=1&preflight=off");
  await page.locator(".hub button.primary").click();
  await page.waitForTimeout(1500);
  const told = await ev<{ scene: unknown; toast: string | null }>(page, "({ scene: window.__HH__.where(), toast: document.querySelector('.toast') ? document.querySelector('.toast').textContent : null })");
  const skipTalk = async () => {
    for (let i = 0; i < 8 && (await ev<boolean>(page, "window.__HH__.state().talk !== null")); i++) {
      await page.locator(".talk button", { hasText: "Skip the talk" }).click();
      await page.waitForTimeout(120);
    }
  };
  await skipTalk();
  for (const name of [/mirror 1/, /mirror 3/, /mirror 5/, /cat/]) {
    await page.locator(".words li button", { hasText: name }).first().click();
    await page.waitForTimeout(150);
    await skipTalk();
  }
  await page.locator(".words li button", { hasText: /Finish at the page/ }).click();
  await page.waitForTimeout(400);
  // Since the journey (27 November 2026) the end is not a sheet over the game but a panel beside it, and the list in
  // words then offers the door.
  const end = await ev<{ done: boolean; results: string | null; sheets: number; door: string[] }>(page, "({ done: window.__HH__.state().done, results: document.querySelector('.door-panel:not([hidden]) h3') ? document.querySelector('.door-panel h3').textContent : null, sheets: document.querySelectorAll('.sheet').length, door: [...document.querySelectorAll('.words li button')].map((b) => b.textContent) })");
  if (outDir) await page.screenshot({ path: resolve(outDir, "finished-in-words-without-webgl.png") });
  await page.locator(".words li button", { hasText: "Go through the door" }).click();
  const leftBy = await ev<{ hub: boolean; started: boolean }>(page, "({ hub: !document.querySelector('.hub').hidden, started: window.__HH__.started() })");
  record("without WebGL the quest is finished in words, and the door is gone through from the list", told.scene === null && !!told.toast && end.done && end.results === "The page is home" && end.sheets === 0 && end.door.join() === "Go through the door" && leftBy.hub && !leftBy.started, { told, end, leftBy });
  await ctx.close();
}
// 4b. Close the page while the words of praise are still on screen: the last mirror is not lost.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  let page = await open(ctx, "");
  await playing(page);
  await ev(page, "window.__HH__.command({type:'skip'}); for (const id of ['mirror-a','mirror-c','mirror-e']) window.__HH__.touch(id);");
  const talking = await ev<boolean>(page, "window.__HH__.state().talk !== null");
  await page.close();
  page = await open(ctx, "");
  await playing(page);
  const back = await ev<{ restored: boolean; turns: number; lit: boolean }>(page, "({ restored: window.__HH__.state().restored, turns: window.__HH__.state().turns, lit: window.__HH__.beam().lit })");
  record("a page closed in the middle of a talk keeps the last step", talking && back.restored && back.turns === 3 && back.lit, { talking, back });
  // 4c. Another save slot has its own place, and coming back to the first finds its place untouched.
  await page.getByRole("button", { name: "Settings" }).click();
  await page.locator(".sheet select").last().selectOption("1");
  await page.waitForTimeout(900);
  const second = await ev<{ turns: number; restored: boolean }>(page, "({ turns: window.__HH__.state().turns, restored: window.__HH__.state().restored })");
  await page.locator(".sheet select").last().selectOption("0");
  await page.waitForTimeout(900);
  const first = await ev<{ turns: number; restored: boolean }>(page, "({ turns: window.__HH__.state().turns, restored: window.__HH__.state().restored })");
  record("each save slot keeps its own place", second.turns === 0 && !second.restored && first.turns === 3 && first.restored, { second, first });
  await ctx.close();
}
// 4d. Two tabs: the one opened first takes up what the other saves, and wipes nothing by having been open.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const first = await open(ctx, "");
  const second = await open(ctx, "");
  await playing(second);
  await ev(second, "window.__HH__.command({type:'skip'}); window.__HH__.touch('mirror-a'); window.__HH__.touch('mirror-c');");
  await first.waitForTimeout(500);
  const seen = await ev<{ resumed: boolean; button: string }>(first, "({ resumed: window.__HH__.resumed(), button: document.querySelector('.hub button.primary').textContent })");
  await playing(first);
  await ev(first, "window.__HH__.command({type:'skip'})");
  const taken = await ev<{ turns: number }>(first, "({ turns: window.__HH__.state().turns })");
  const stored = await ev<{ snap: { turns: number } } | null>(first, "JSON.parse(localStorage.getItem('im.hudhud.save.v1')).slots[0].resume");
  record("a tab opened earlier takes up what another tab saved, and wipes nothing", seen.resumed && seen.button.startsWith("Continue: ") && taken.turns === 2 && stored?.snap.turns === 2, { seen, taken, stored });
  await ctx.close();
}
// 4e. The skip link lands on the game, whichever screen is showing.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  // First on the opening story, which a new visitor meets first; then on the Atlas, which a returning one meets.
  const landing = async (page: Page) => {
    await page.keyboard.press("Tab");
    const link = await ev<string>(page, "document.activeElement.className");
    await page.keyboard.press("Enter");
    const landed = await ev<string>(page, "document.activeElement.id || location.hash");
    await page.keyboard.press("Tab");
    const next = await ev<boolean>(page, "!!document.activeElement.closest('#play')");
    return { link, landed, next, ok: link === "skip" && /play/.test(landed) && next };
  };
  const story = await landing(await open(ctx, "&fresh=1", true));
  const seenCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const first = await open(seenCtx, "");
  await ev(first, "window.__HH__.saveReady()");
  await first.close();
  const atlas = await landing(await open(seenCtx, "", true));
  await seenCtx.close();
  record("the skip link lands on the game", story.ok && atlas.ok, { story, atlas });
  await ctx.close();
}
// 4f. Pause and go on, every way there is, and the game answers afterwards each time.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await open(ctx, "&fresh=1");
  await playing(page);
  await ev(page, "window.__HH__.command({type:'skip'})");
  const alive = async () => {
    const before = await ev<number>(page, "window.__HH__.state().turns");
    await page.locator(".words li button", { hasText: /mirror 1/ }).click();
    await page.waitForTimeout(120);
    const st = await ev<{ turns: number; sheets: number; disabled: boolean }>(page, "({ turns: window.__HH__.state().turns, sheets: document.querySelectorAll('.sheet').length, disabled: document.querySelector('.words li button').disabled })");
    return st.turns === before + 1 && st.sheets === 0 && !st.disabled;
  };
  // The pause button of the toolbar, whatever it says. While the pause sheet is up it lies under the sheet for a
  // mouse, but a keyboard or a screen reader still reaches and presses it: it is pressed here the way they do.
  const toolbar = { click: () => page.locator("header button").nth(-2).dispatchEvent("click") };
  const ways: Record<string, boolean> = {};
  await toolbar.click(); await toolbar.click(); ways["toolbar, then toolbar"] = await alive();
  await toolbar.click(); await page.keyboard.press("Escape"); ways["toolbar, then Escape"] = await alive();
  await page.locator("#stage").focus(); await page.keyboard.press("Escape"); await page.locator(".sheet.pause button.primary").click(); ways["Escape, then the sheet's own button"] = await alive();
  await toolbar.click(); await page.locator(".sheet.pause button", { hasText: "Settings" }).click(); await toolbar.click(); ways["settings opened from the pause, then toolbar"] = await alive();
  await toolbar.click(); await page.locator(".sheet.pause button", { hasText: "Settings" }).click(); await page.keyboard.press("Escape"); await page.keyboard.press("Escape"); ways["settings from the pause, closed one by one with Escape"] = await alive();
  await ev(page, "Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });");
  const hiddenPaused = await ev<number>(page, "document.querySelectorAll('.sheet.pause').length");
  await toolbar.click(); ways["a hidden tab pauses, then toolbar"] = hiddenPaused === 1 && (await alive());
  for (let i = 0; i < 6; i++) await toolbar.click();
  ways["six times in a row"] = await alive();
  record("pause and go on, every way, and the game still answers", Object.values(ways).every(Boolean), ways);
  await ctx.close();
}
// 4g. The explorer chosen in the settings is the explorer the Atlas shows, before a quest, after one, and after a reload.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  let page = await open(ctx, "");
  const shown = () => ev<{ pressed: string; kind: number }>(page, "({ pressed: [...document.querySelectorAll('.choose button')].map((b) => b.getAttribute('aria-pressed')).join(','), kind: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{\"slots\":[{\"keeper\":{\"kind\":1}}]}').slots[0].keeper.kind })");
  const first = await shown();
  await page.getByRole("button", { name: "Settings" }).click();
  await page.locator(".sheet select").nth(3).selectOption("0"); // the explorer: a boy
  await page.locator(".sheet button.primary").click();
  const afterSettings = await shown();
  await playing(page);
  await ev(page, "window.__HH__.command({type:'skip'})");
  await page.getByRole("button", { name: "Settings" }).click();
  await page.locator(".sheet select").nth(3).selectOption("1"); // back to a girl, in the middle of a quest
  await page.locator(".sheet button.primary").click();
  await page.getByRole("button", { name: "Back to the Atlas" }).click();
  const afterQuest = await shown();
  await page.reload();
  await page.waitForFunction("window.__HH__ && window.__HH__.ready");
  const afterReload = await shown();
  record("the explorer is the same in the settings and on the Atlas", first.pressed === "true,false" && afterSettings.pressed === "false,true" && afterSettings.kind === 0 && afterQuest.pressed === "true,false" && afterQuest.kind === 1 && afterReload.pressed === "true,false", { first, afterSettings, afterQuest, afterReload });
  await ctx.close();
}
// 4h. A controller, stood in for by the page's own gamepad interface: the lower button goes on in a talk and flies,
// the right one goes back a line, Start pauses and goes on, all while the world stands still. No real controller.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript("window.__pad = { index: 0, id: 'test pad', mapping: 'standard', connected: true, axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })) }; navigator.getGamepads = () => [window.__pad];");
  const page = await open(ctx, "");
  await playing(page);
  await ev(page, "window.dispatchEvent(Object.assign(new Event('gamepadconnected'), { gamepad: window.__pad }))");
  const tap = async (i: number) => {
    await ev(page, `window.__pad.buttons[${i}].pressed = true`);
    await page.waitForTimeout(80);
    await ev(page, `window.__pad.buttons[${i}].pressed = false`);
    await page.waitForTimeout(80);
  };
  const line = () => ev<number | null>(page, "window.__HH__.state().talk ? window.__HH__.state().talk.line : null");
  const l0 = await line();
  await tap(0);
  const l1 = await line();
  await tap(1);
  const l2 = await line();
  await tap(0); await tap(0); await tap(0);
  const over = await line();
  await tap(9);
  const paused = await ev<number>(page, "document.querySelectorAll('.sheet.pause').length");
  await tap(9);
  const resumed = await ev<number>(page, "document.querySelectorAll('.sheet').length");
  const y0 = (await ev<{ y: number }>(page, "window.__HH__.where()")).y;
  await ev(page, "window.__pad.buttons[0].pressed = true");
  await page.waitForTimeout(250);
  const y1 = (await ev<{ y: number }>(page, "window.__HH__.where()")).y;
  await ev(page, "window.__pad.buttons[0].pressed = false");
  // A talk with choices: the controller moves among them and picks one, with no keyboard or mouse.
  await ev(page, "window.__HH__.goTo('scholar')");
  await page.waitForTimeout(1200);
  await tap(0); // on to the line that offers the choices
  const offered = await ev<number>(page, "document.querySelectorAll('.talk .choices button').length");
  await tap(13); // down to the second choice
  const focused = await ev<number>(page, "[...document.querySelectorAll('.talk .choices button')].indexOf(document.activeElement)");
  await tap(0); // pick it
  const node = await ev<string | null>(page, "window.__HH__.state().talk ? window.__HH__.state().talk.node : null");
  // A remap begun and then abandoned must not swallow the next press.
  await ev(page, "window.__HH__.command({type:'skip'})");
  await page.getByRole("button", { name: "Settings" }).click();
  await page.locator(".sheet button", { hasText: /^Touch: button/ }).click();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);
  await tap(1);
  const map = await ev<{ touch: number }>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{\"slots\":[{\"settings\":{\"pad\":{\"touch\":2}}}]}').slots[0].settings.pad");
  record("a controller goes on and back in a talk, picks among choices, pauses and flies; an abandoned remap is not left armed (a stand-in pad, not a real one)", l0 === 0 && l1 === 1 && l2 === 0 && over === null && paused === 1 && resumed === 0 && y1 < y0 - 20 && offered === 3 && focused === 1 && node === "see" && map.touch === 2, { l0, l1, l2, over, paused, resumed, y0, y1, offered, focused, node, map });
  await ctx.close();
}
// 4i. The door. A phone is told plainly, in its language, and nothing of the game is fetched; a window too small
// is told so and the game starts by itself when it is made larger; a browser without WebGL 2 is told why.
{
  const heavy = (urls: string[]) => urls.filter((u) => /phaser|\/ui\/app\.ts|\/scenes\/|\/art\//.test(u));
  const refusedPage = async (page: Page) => ev<{ h1: string | null; reasons: string[]; items: number; dir: string; lang: string; hub: number; canvas: number; focus: string; retry: number; museum: string | null; about: number }>(page, "({ h1: document.querySelector('.im-unsupported h1')?.textContent ?? null, reasons: (window.__IM_PREFLIGHT__ || {}).reasons || [], items: document.querySelectorAll('.im-unsupported li').length, dir: document.documentElement.dir, lang: document.documentElement.lang, hub: document.querySelectorAll('.hub').length, canvas: document.querySelectorAll('canvas').length, focus: document.activeElement?.tagName ?? '', retry: document.querySelectorAll('.im-unsupported button').length, museum: document.querySelector('.im-unsupported a')?.getAttribute('href') ?? null, about: document.querySelectorAll('.im-unsupported section p').length })");
  const phones: Record<string, unknown> = {};
  let phonesOk = true;
  for (const lang of ["ar", "en", "ur", "fr", "es", "tr", "id"]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, screen: { width: 390, height: 844 }, hasTouch: true, isMobile: true, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Mobile/15E148 Safari/604.1" });
    const page = await ctx.newPage();
    const urls: string[] = [];
    page.on("request", (r) => urls.push(r.url()));
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(`${served.base}/games/hudhud/index.html?lang=${lang}&music=off`);
    await page.waitForSelector(".im-unsupported h1", { timeout: 20000 });
    const seen = await refusedPage(page);
    const good = seen.reasons.includes("phone") && !!seen.h1 && seen.items >= 1 && seen.hub === 0 && seen.canvas === 0 && heavy(urls).length === 0 && seen.dir === (lang === "ar" || lang === "ur" ? "rtl" : "ltr") && seen.focus === "MAIN" && seen.retry === 1 && seen.museum === `https://islam.museum/${lang}/` && seen.about === 3;
    phones[lang] = { ...seen, heavyRequests: heavy(urls), requests: urls.length };
    phonesOk &&= good;
    if (outDir && (lang === "ar" || lang === "en")) await page.screenshot({ path: resolve(outDir, `unsupported-phone-${lang}.png`) });
    await ctx.close();
  }
  record("a phone is told it is not supported, in seven languages, and none of the game is fetched", phonesOk, phones);

  let ctx = await browser.newContext({ viewport: { width: 1000, height: 700 }, screen: { width: 1920, height: 1080 } });
  let page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${served.base}/games/hudhud/index.html?lang=en&music=off&fresh=1`);
  await page.waitForSelector(".im-unsupported h1", { timeout: 20000 });
  const small = await refusedPage(page);
  await page.setViewportSize({ width: 1300, height: 850 });
  const started = await page.waitForFunction("window.__HH__ && window.__HH__.ready === true && document.querySelectorAll('.hub .world').length === 10", undefined, { timeout: 20000 }).then(() => true, () => false);
  const left = await ev<number>(page, "document.querySelectorAll('.im-unsupported').length");
  record("a window too small is told so, and the game starts by itself when it is made larger", small.reasons.join() === "window-small" && started && left === 0, { small, started, left });
  await ctx.close();

  ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript("const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, ...a) { return /webgl/.test(t) ? null : g.call(this, t, ...a); };");
  page = await ctx.newPage();
  const urls: string[] = [];
  page.on("request", (r) => urls.push(r.url()));
  await page.goto(`${served.base}/games/hudhud/index.html?lang=en&music=off&fresh=1`);
  await page.waitForSelector(".im-unsupported h1", { timeout: 20000 });
  const noGl = await refusedPage(page);
  await page.locator(".im-unsupported button").click();
  const still = await refusedPage(page);
  record("a browser without WebGL 2 is told why, before the engine is fetched, and trying again does not loop", noGl.reasons.join() === "webgl2" && heavy(urls).length === 0 && still.reasons.join() === "webgl2" && still.h1 !== null, { noGl, heavy: heavy(urls) });
  await ctx.close();
}
// 4j. With scripts off the page is not blank; and on a refused device the skip link has somewhere to land.
{
  let ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, javaScriptEnabled: false });
  let page = await ctx.newPage();
  await page.goto(`${served.base}/games/hudhud/index.html`);
  const lines = await page.locator("noscript p, main#play p").count();
  const links = await page.locator("main#play a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  const text = await page.locator("main#play").innerText().catch(() => "");
  await ctx.close();
  ctx = await browser.newContext({ viewport: { width: 1000, height: 700 }, screen: { width: 1920, height: 1080 } });
  page = await ctx.newPage();
  await page.goto(`${served.base}/games/hudhud/index.html?lang=en`);
  await page.waitForSelector(".im-unsupported h1");
  await page.locator("a.skip").focus();
  await page.keyboard.press("Enter");
  const landed = await ev<string>(page, "location.hash + '|' + (document.getElementById('play') ? document.getElementById('play').tagName : 'none')");
  record("with scripts off the page says why in seven languages; on a refused device the skip link lands", lines === 7 && links.length === 7 && links.every((h) => h === "../") && /JavaScript/.test(text) && landed === "#play|MAIN", { lines, links, landed });
  await ctx.close();
}
// 4k. The vault. A save that was only in localStorage is taken into IndexedDB; with localStorage wiped the progress is
// still there; "Saved" is shown after a step; a save exported from one browser is imported into a fresh one.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: true });
  let page = await open(ctx, "");
  await playing(page);
  await ev(page, "window.__HH__.command({type:'skip'}); for (const id of ['mirror-a','mirror-c','mirror-e']) window.__HH__.touch(id); window.__HH__.command({type:'skip'}); window.__HH__.touch('page');");
  const after = await ev<{ state: string; revision?: number }>(page, "window.__HH__.saveReady()");
  const chip = await page.locator(".save-state").textContent();
  // Wipe localStorage, as a browser's "clear cookies" for one kind of storage might: IndexedDB still has it.
  await ev(page, "localStorage.clear()");
  await page.close();
  page = await open(ctx, "");
  await ev(page, "window.__HH__.saveReady()");
  const back = await ev<{ progress: string; button: string; local: boolean }>(page, "({ progress: document.querySelector('.hub .progress').textContent, button: document.querySelector('.hub button.primary').textContent, local: !!localStorage.getItem('im.hudhud.save.v1') })");
  // Export, by the settings' own button.
  await page.getByRole("button", { name: "Settings" }).click();
  const [download] = await Promise.all([page.waitForEvent("download"), page.locator(".sheet button", { hasText: "Export save" }).click()]);
  const file = await download.path();
  const text = (await import("node:fs")).readFileSync(file!, "utf8");
  await ctx.close();
  // A fresh browser: nothing there; import the file; the page is home.
  const fresh = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  page = await open(fresh, "");
  await ev(page, "window.__HH__.saveReady()");
  const before = await ev<string>(page, "document.querySelector('.hub .progress').textContent");
  await page.getByRole("button", { name: "Settings" }).click();
  await page.locator(".sheet input[type=file]").setInputFiles({ name: "hudhud-save.json", mimeType: "application/json", buffer: Buffer.from(text) });
  await page.locator(".sheet [role=dialog][aria-label='Import save'] button", { hasText: "Import save" }).click();
  await page.waitForTimeout(600);
  const imported = await ev<{ progress: string; toast: string | null }>(page, "({ progress: document.querySelector('.hub .progress').textContent, toast: document.querySelector('.toast') ? document.querySelector('.toast').textContent : null })");
  // A file that is not a save is refused and changes nothing.
  await page.getByRole("button", { name: "Settings" }).click().catch(() => undefined);
  await page.locator(".sheet input[type=file]").first().setInputFiles({ name: "x.json", mimeType: "application/json", buffer: Buffer.from(text.replace('"done": true', '"done": false')) });
  await page.locator(".sheet [role=dialog][aria-label='Import save'] button", { hasText: "Import save" }).click();
  await page.waitForTimeout(500);
  const refused = await ev<{ progress: string; toast: string | null }>(page, "({ progress: document.querySelector('.hub .progress').textContent, toast: document.querySelector('.toast') ? document.querySelector('.toast').textContent : null })");
  record("progress is in the vault: it outlives a wiped localStorage, shows as saved, and travels by export and import", after.state === "saved" && (after.revision ?? 0) >= 1 && /Saved/.test(chip ?? "") && /\D1\D/.test(` ${back.progress} `) && back.button.startsWith("Play again") && back.local && text.includes('"im.play.save"') && /\D0\D/.test(` ${before} `) && /\D1\D/.test(` ${imported.progress} `) && imported.toast === "The save was imported." && /\D1\D/.test(` ${refused.progress} `) && /not a Hudhud save/.test(refused.toast ?? ""), { after, chip, back, exportBytes: text.length, before, imported, refused });
  await fresh.close();
}
// 4l. No texture is wider or taller than 2048 pixels at any effects preset; the scholar's words are marked as
// imagined; no prism is drawn; and the dark room's picture falls on the curtain, opposite the hole.
{
  const sizes: Record<string, unknown> = {};
  let texOk = true;
  for (const q of ["low", "medium", "high"]) {
    const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
    const page = await open(ctx, `&fresh=1&q=${q}`);
    await playing(page);
    await page.waitForTimeout(600);
    const info = await ev<{ largestTextures: { key: string; width: number; height: number }[]; textures: number; textureBytes: number }>(page, "window.__HH__.info()");
    const biggest = Math.max(...info.largestTextures.flatMap((t) => [t.width, t.height]));
    sizes[q] = { biggest, textures: info.textures, megabytes: Math.round(info.textureBytes / 104857.6) / 10, prism: info.largestTextures.some((t) => t.key === "prism") };
    texOk &&= biggest <= 2048;
    if (q === "high") {
      const all = await ev<string[]>(page, "window.__HH__.info().textureKeys || []");
      (sizes[q] as Record<string, unknown>).keys = all.length;
      texOk &&= !all.includes("prism") && !all.includes("rainbow-used");
      await ev(page, "window.__HH__.command({type:'skip'}); window.__HH__.goTo('scholar')");
      await page.waitForTimeout(1200);
      const mark = await page.locator(".talk .dramatized").textContent().catch(() => null);
      await ev(page, "window.__HH__.command({type:'skip'}); window.__HH__.goTo('cord')");
      await page.waitForTimeout(2200);
      if (outDir) await page.screenshot({ path: resolve(outDir, "dark-room-on-the-curtain.png") });
      (sizes[q] as Record<string, unknown>).mark = mark;
      texOk &&= mark === "Imagined words, not a quotation";
    }
    await ctx.close();
  }
  record("no texture exceeds 2048 pixels at any preset; no prism; the scholar's words are marked as imagined", texOk, sizes);
}
// 5. The Atlas: fifty named pages in ten worlds, one of them open; play it, come back, and find its page home.
for (const lang of ["en", "ar"]) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${served.base}/games/hudhud/index.html?lang=${lang}&music=off`);
  await page.waitForFunction("window.__HH__ && window.__HH__.ready");
  await leaveOpening(page);
  const before = await ev<{ worlds: number; pages: number; open: number; progress: string; stageHidden: boolean }>(page, "({ worlds: document.querySelectorAll('.hub .world').length, pages: document.querySelectorAll('.hub .world li').length, open: document.querySelectorAll('.hub .world li.open').length, progress: document.querySelector('.hub .progress').textContent, stageHidden: document.querySelector('.stage-wrap').hidden })");
  if (outDir) await page.screenshot({ path: resolve(outDir, `atlas-${lang}.png`), fullPage: true });
  await playing(page);
  await ev(page, "window.__HH__.command({type:'skip'}); for (const id of ['mirror-a','mirror-c','mirror-e']) window.__HH__.touch(id); window.__HH__.command({type:'skip'}); window.__HH__.touch('page');");
  await page.waitForTimeout(300);
  // Since the journey (27 November 2026) the results are a panel beside the stage, not a sheet; its "Back to the Atlas" is pressed.
  await page.locator(".door-panel button", { hasText: lang === "ar" ? "العودة إلى الأطلس" : "Back to the Atlas" }).click();
  await page.waitForTimeout(400);
  const after = await ev<{ progress: string; button: string; hubShown: boolean; canvases: number; started: boolean }>(page, "({ progress: document.querySelector('.hub .progress').textContent, button: document.querySelector('.hub button.primary').textContent, hubShown: !document.querySelector('.hub').hidden, canvases: document.querySelectorAll('#stage canvas').length, started: window.__HH__.started() })");
  if (outDir) await page.screenshot({ path: resolve(outDir, `atlas-${lang}-one-page-home.png`), fullPage: true });
  // And the quest can be entered again from there.
  await playing(page);
  const again = await ev<{ turns: number; done: boolean }>(page, "({ turns: window.__HH__.state().turns, done: window.__HH__.state().done })");
  record(`the Atlas shows ten worlds and fifty pages, thirteen of them open, and one comes home (${lang})`, before.worlds === 10 && before.pages === 50 && before.open === 13 && before.stageHidden && /\D0\D|٠/.test(` ${before.progress} `) && /\D1\D|١/.test(` ${after.progress} `) && after.hubShown && after.canvases === 0 && !after.started && again.turns === 0 && !again.done, { before, after, again });
  await ctx.close();
}
// The puzzle is not the same in the three ways of playing: five mirrors with two positions, six with three, seven with
// three and a page in words that says only where the beam ends.
{
  const seen: Record<string, { mirrors: number; leans: number; par: number; words: string; listed: number; third: string; floor: string }> = {};
  for (const style of ["story", "explorer", "challenge"]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await open(ctx, `&style=${style}`);
    await playing(page);
    await ev(page, "window.__HH__.command({type:'skip'}); window.__HH__.touch('mirror-a');");
    await page.waitForTimeout(300);
    const got = await ev<{ mirrors: number; leans: number; par: number; words: string; listed: number }>(page, "({ mirrors: window.__HH__.state().puzzle.mirrors.length, leans: (window.__HH__.state().puzzle.leans || []).length, par: window.__HH__.state().par, words: document.querySelector('.words section p[aria-live]').textContent, listed: [...document.querySelectorAll('section ul button')].filter((b) => /mirror/.test(b.textContent)).length })");
    // A mirror the room does not have cannot be touched; one it has, turned twice, lies flat where there are three positions.
    await ev(page, "window.__HH__.touch('mirror-g'); window.__HH__.touch('mirror-d'); window.__HH__.touch('mirror-d');");
    const third = await ev<string>(page, "window.__HH__.state().puzzle.mirrors.find((m) => m.id === 'd').lean");
    // With the third mirror laid flat the beam runs along the floor and meets the jar, and the words say so.
    const floor = style === "explorer" ? await ev<string>(page, "document.querySelector('.words section p[aria-live]').textContent") : "";
    seen[style] = { ...got, third, floor };
    await ctx.close();
  }
  const st = seen.story!, ex = seen.explorer!, ch = seen.challenge!;
  record("the three ways of playing are three puzzles: 5, 6 and 7 mirrors, a third position outside Story, and Challenge is told only where the beam ends",
    st.mirrors === 5 && st.leans === 2 && st.par === 3 && st.listed === 5 && st.third === "/" &&
    ex.mirrors === 6 && ex.leans === 3 && ex.par === 3 && ex.listed === 6 && ex.third === "-" && /mirror 1/.test(ex.words) && /tall jar/.test(ex.floor) &&
    ch.mirrors === 7 && ch.leans === 3 && ch.par === 10 && ch.listed === 7 && !/mirror/.test(ch.words), seen);
}
// The second quest, the elephant clock: a wrong row stops and says where, the four goals can all be met, the finish is
// written into the save, and the Atlas counts two pages home. Played with the page's own controls.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  // Since 27 November 2026 al-Jazari's scene is played in its room; `room=off` keeps this check on the clock's page, which stays as the way it is played without WebGL.
  const page = await open(ctx, "&style=explorer&room=off");
  const clockButton = page.locator(".hub button[data-quest='w02q1-al-jazari']");
  const label = await clockButton.textContent();
  await clockButton.click();
  await page.getByRole("button", { name: "Set the clock going" }).click();
  await page.waitForFunction("window.__HH__.clock() && !window.__HH__.clock().busy");
  const wrong = await ev<{ words: string; end: string; at: number; done: boolean }>(page, "({ words: document.querySelector('.bench .ran').textContent, end: window.__HH__.clock().last.end, at: window.__HH__.clock().last.at, done: window.__HH__.clock().done })");
  for (const name of ["Ask about the float", "Ask about the balls", "Talk to the apprentice"]) await page.getByRole("button", { name }).click();
  await page.getByRole("button", { name: "It is all right. We will find the order together." }).click();
  await page.getByRole("button", { name: "Look in the box of spare parts" }).click();
  // The keyboard alone: each place is an ordinary list of choices.
  for (const [place, part] of [[1, "falcon"], [2, "dragon"], [3, "vessel"]] as const) await page.locator(`.bench select[data-place='${place}']`).selectOption(part);
  const spareLine = await ev<string>(page, "[...document.querySelectorAll('.bench p.small')].map((p) => p.textContent).join(' | ')");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-clock-bench.png") });
  await page.getByRole("button", { name: "Set the clock going" }).click();
  await page.waitForSelector(".bench .results:not([hidden])");
  const end = await ev<{ done: boolean; moves: number; par: number; met: number; focus: string; links: string[]; pending: string; saved: boolean }>(page, "({ done: window.__HH__.clock().done, moves: window.__HH__.clock().moves, par: window.__HH__.clock().par, met: document.querySelectorAll('.bench .results .goals .met').length, focus: document.activeElement ? document.activeElement.textContent : '', links: [...document.querySelectorAll('.bench .results a')].map((a) => a.getAttribute('href')), pending: document.querySelector('.bench .results .pending').textContent, saved: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.quests?.['w02q1-al-jazari']?.done === true })");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-clock-results.png"), fullPage: true });
  await page.getByRole("button", { name: "Back to the Atlas" }).last().click();
  const back = await ev<{ progress: string; label: string; benchHidden: boolean; primary: string }>(page, "({ progress: document.querySelector('.hub .progress').textContent, label: document.querySelector(\".hub button[data-quest='w02q1-al-jazari']\").textContent, benchHidden: document.querySelector('.bench').hidden, primary: document.querySelector('.hub button.primary').textContent })");
  record("the elephant clock can be played to its end with the page's own controls, and the Atlas counts it",
    /^Play: /.test(label ?? "") && !wrong.done && wrong.end === "idle" && wrong.at === 2 && /bird turns and whistles/.test(wrong.words) && /What reached it: a whistle/.test(wrong.words) &&
    /Spare parts: the bird, the rider/.test(spareLine) && end.done && end.moves === 3 && end.par === 3 && end.met === 4 && end.focus === "The page is home" && end.saved &&
    end.links.join() === "https://islam.museum/en/person/al-jazari-engineer/,https://islam.museum/en/invention/elephant-clock/" && /Historical review pending/.test(end.pending) &&
    /\D1\D/.test(` ${back.progress} `) && /^Play again: /.test(back.label) && back.benchHidden && /Ibn al-Haytham/.test(back.primary), { label, wrong, spareLine, end, back });
  await ctx.close();
}
// The elephant clock is kept when left in the middle, and its picture can be played by a click or a touch. The slot
// holds one place: a clock with no progress leaves the flying quest's place alone, and a clock with progress keeps its own.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  // Since 27 November 2026 al-Jazari's scene is played in its room; `room=off` keeps this check on the clock's page, which stays as the way it is played without WebGL.
  const page = await open(ctx, "&style=explorer&room=off");
  const CLOCK = "w02q1-al-jazari";
  const kept = () => ev<{ quest: string; snap: { places: (string | null)[]; moves: number; flags: string[] } } | null>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null");
  const clockView = () => ev<{ places: (string | null)[]; moves: number; flags: string[]; done: boolean }>(page, "(() => { const c = window.__HH__.clock(); return { places: c.puzzle.places, moves: c.moves, flags: c.flags, done: c.done }; })()");
  // The flying quest is left in the middle first.
  await playing(page);
  await ev(page, "window.__HH__.command({type:'skip'}); window.__HH__.touch('mirror-a'); window.__HH__.touch('cat'); window.__HH__.command({type:'skip'});");
  await ev(page, "window.__HH__.toAtlas()");
  const flying0 = await ev<boolean>(page, "window.__HH__.resumed()");
  // A clock opened and left with nothing changed does not touch it.
  await page.locator(".hub button[data-quest='w02q1-al-jazari']").click();
  await ev(page, "window.__HH__.toAtlas()");
  const untouched = { resumed: await ev<boolean>(page, "window.__HH__.resumed()"), kept: (await kept())?.quest };
  // One move and one question: the clock's place is kept, and the flying quest's is given up for it.
  await page.locator(".hub button[data-quest='w02q1-al-jazari']").click();
  await page.locator(".bench select[data-place='1']").selectOption("falcon");
  await page.getByRole("button", { name: "Ask about the float" }).click();
  const before = await clockView();
  const slotNow = await kept();
  await ev(page, "window.__HH__.saveReady()");
  await page.reload();
  await page.waitForFunction("window.__HH__ && window.__HH__.ready");
  const labels = await ev<{ clock: string; primary: string; notes: number; flying: boolean }>(page, "({ clock: document.querySelector(\"button[data-quest='w02q1-al-jazari']\").textContent, primary: document.querySelector('.hub button.primary').textContent, notes: document.querySelectorAll('.hub li.open small').length, flying: window.__HH__.resumed() })");
  await page.locator(".hub button[data-quest='w02q1-al-jazari']").click();
  const after = await clockView();
  // The picture is played by a click: choose a place, choose another, and the two change places.
  const box = (await page.locator(".bench canvas").boundingBox())!;
  const at = (lx: number, ly: number) => ({ x: box.x + (lx / 1000) * box.width, y: box.y + (ly / 380) * box.height });
  const place = (i: number) => at(110 + 150 * i, 190);
  const moves0 = (await clockView()).moves;
  await page.mouse.click(place(0).x, place(0).y);
  const chosen = await page.locator(".bench .small[aria-live]").first().textContent();
  await page.mouse.click(place(2).x, place(2).y);
  const swapped = await clockView();
  // A spare part by click: the box holds the dragon and the rider's partner; choose place 3, then the first spare part.
  await page.mouse.click(place(3).x, place(3).y);
  await page.mouse.click(at(880, 125).x, at(880, 125).y);
  const stood = await clockView();
  // A place chosen and chosen again is let go: no move is counted.
  await page.mouse.click(place(4).x, place(4).y);
  await page.mouse.click(place(4).x, place(4).y);
  const letGo = await clockView();
  record("the elephant clock left in the middle is kept, comes back as it was, and its picture can be played by a click",
    flying0 && untouched.resumed && untouched.kept === "w03q1-ibn-al-haytham" && slotNow?.quest === CLOCK && before.moves === 1 && before.flags.join() === "askedFloat" &&
    /^Continue: /.test(labels.clock) && /^Play: /.test(labels.primary) && !labels.flying && labels.notes >= 2 &&
    after.moves === before.moves && after.places.join() === before.places.join() && after.flags.join() === "askedFloat" &&
    /Place 1 is chosen/.test(chosen ?? "") && swapped.moves === moves0 + 1 && swapped.places[0] === before.places[2] && swapped.places[2] === before.places[0] &&
    stood.moves === swapped.moves + 1 && stood.places[3] !== swapped.places[3] && letGo.moves === stood.moves,
    { flying0, untouched, slotNow, before, labels, after, chosen, moves0, swapped, stood, letGo });
  // Finished: the place is gone, and the flying quest can be started.
  for (const [i, part] of ["float", "falcon", "dragon", "vessel", "bowl"].entries()) await page.locator(`.bench select[data-place='${i}']`).selectOption(part);
  await page.getByRole("button", { name: "Set the clock going" }).click();
  await page.waitForSelector(".bench .results:not([hidden])");
  const done = { done: (await clockView()).done, kept: await kept() };
  await ev(page, "window.__HH__.saveReady()");
  await page.reload();
  await page.waitForFunction("window.__HH__ && window.__HH__.ready");
  const hub = await ev<{ clock: string }>(page, "({ clock: document.querySelector(\"button[data-quest='w02q1-al-jazari']\").textContent })");
  await playing(page);
  record("a finished elephant clock is not kept in the middle, and the flying quest can still be started", done.done && done.kept === null && /^Play again: /.test(hub.clock), { done, hub });
  await ctx.close();
}
// The third quest, al-Kindi and the secret page: two real tables with captions, a wrong reading says how many marks are
// right, both questions, the messenger and the feather, every mark given its sign by its own list of choices, the page
// read, four goals, the links, and the Atlas counts it. Then one sign given, the page loaded again, and "Continue".
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  let page = await open(ctx, "&style=explorer");
  const QUEST = "w02q3-al-kindi";
  const button = page.locator(`.hub button[data-quest='${QUEST}']`);
  const isPlain = await button.evaluate((b) => !b.classList.contains("primary"));
  const label = await button.textContent();
  await button.click();
  await page.waitForFunction("window.__HH__.cipher() !== null");
  const heading = await page.locator(".bench h2").textContent();
  const tables = await ev<{ captions: string[]; rows: number[]; headers: number[]; selects: number; labels: string[]; alt: string | null; role: string | null; inline: number }>(page, "(() => { const ts = [...document.querySelectorAll('.bench table')]; return { captions: ts.map((t) => t.querySelector('caption').textContent), rows: ts.map((t) => t.querySelectorAll('tbody tr').length), headers: ts.map((t) => t.querySelectorAll('thead th[scope=col]').length), selects: document.querySelectorAll('.bench select').length, labels: [...document.querySelectorAll('.bench select')].map((s) => s.closest('label').textContent), alt: document.querySelector('.bench canvas.cipher-art').getAttribute('aria-label'), role: document.querySelector('.bench canvas.cipher-art').getAttribute('role'), inline: document.querySelectorAll('.bench [style]:not(canvas)').length }; })()");
  const view = () => ev<{ key: Record<string, string>; message: string[]; guess: Record<string, string>; flags: string[]; fails: number; reads: number; done: boolean; marks: string[] }>(page, "(() => { const c = window.__HH__.cipher(); const used = [...document.querySelectorAll('.bench select')].map((s) => s.dataset.mark); return { key: c.puzzle.key, message: c.puzzle.message, guess: c.guess, flags: c.flags, fails: c.fails, reads: c.reads, done: c.done, marks: used }; })()");
  const v0 = await view();
  // A reading with a mark still without a sign counts nothing and says so.
  await page.getByRole("button", { name: "Read the page" }).click();
  const incomplete = { words: await page.locator(".bench .ran").textContent(), reads: (await view()).reads };
  // Two marks given each other's signs, the rest right: a wrong reading, and the Explorer is told how many are right.
  const [a, b] = v0.marks as [string, string];
  const wrongWay: Record<string, string> = { ...v0.key, [a]: v0.key[b]!, [b]: v0.key[a]! };
  for (const m of v0.marks) await page.locator(`.bench select[data-mark='${m}']`).selectOption(wrongWay[m]!);
  await page.getByRole("button", { name: "Read the page" }).click();
  const wrong = { words: await page.locator(".bench .ran").textContent(), v: await view() };
  for (const name of ["Ask how to begin", "Ask about short messages", "Talk to the messenger"]) await page.getByRole("button", { name }).click();
  await page.getByRole("button", { name: "It is all right. We will read it together." }).click();
  await page.getByRole("button", { name: "Look under the secret page" }).click();
  // A sign taken by another mark is freed: the live words say so.
  await page.locator(`.bench select[data-mark='${a}']`).selectOption(wrongWay[b]!);
  const freed = await page.locator(".bench .ran").textContent();
  // The keyboard alone: every mark gets its right sign from its own list.
  for (const m of v0.marks) await page.locator(`.bench select[data-mark='${m}']`).selectOption(v0.key[m]!);
  const live = await ev<{ ran: string | null; polite: boolean; given: string }>(page, "({ ran: document.querySelector('.bench .ran').getAttribute('aria-live'), polite: document.querySelector('.bench .said').getAttribute('aria-live') === 'polite', given: [...document.querySelectorAll('.bench p.small')].map((p) => p.textContent).join(' | ') })");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-cipher-bench.png"), fullPage: true });
  await page.getByRole("button", { name: "Read the page" }).click();
  await page.waitForSelector(".bench .results:not([hidden])");
  const end = await ev<{ done: boolean; fails: number; met: number; focus: string; links: string[]; pending: string; saved: boolean; resume: unknown }>(page, "({ done: window.__HH__.cipher().done, fails: window.__HH__.cipher().fails, met: document.querySelectorAll('.bench .results .goals .met').length, focus: document.activeElement ? document.activeElement.textContent : '', links: [...document.querySelectorAll('.bench .results a')].map((a) => a.getAttribute('href')), pending: document.querySelector('.bench .results .pending').textContent, saved: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.quests?.['w02q3-al-kindi']?.done === true, resume: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null })");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-cipher-results.png"), fullPage: true });
  await page.getByRole("button", { name: "Back to the Atlas" }).last().click();
  const back = await ev<{ progress: string; label: string; benchHidden: boolean; primary: string; clock: string }>(page, "({ progress: document.querySelector('.hub .progress').textContent, label: document.querySelector(\".hub button[data-quest='w02q3-al-kindi']\").textContent, benchHidden: document.querySelector('.bench').hidden, primary: document.querySelector('.hub button.primary').textContent, clock: document.querySelector(\".hub button[data-quest='w02q1-al-jazari']\").textContent })");
  record("al-Kindi's secret page can be played to its end with the page's own controls: two captioned tables with the right rows, a list of choices for each mark, a wrong reading that says how many are right, the four goals, the links, and the Atlas counts it",
    isPlain && /^Play: /.test(label ?? "") && heading === "al-Kindi" && tables.captions.join("|") === "Signs in the whole page, most to fewest|Marks in the secret message, most to fewest" && tables.rows.join() === "7,7" && tables.headers.join() === "3,3" && tables.selects === 7 &&
    tables.labels.every((l) => /^Sign for the /.test(l ?? "")) && tables.role === "img" && /24 marks/.test(tables.alt ?? "") && tables.inline === 0 &&
    /^Marks still without a sign: 7/.test(incomplete.words ?? "") && incomplete.reads === 0 &&
    /The page does not read yet\. Marks that are right: 5 of 7\./.test(wrong.words ?? "") && wrong.v.fails === 1 && wrong.v.reads === 1 && !wrong.v.done &&
    /That sign was taken from: /.test(freed ?? "") && live.ran === "polite" && live.polite && /Marks given a sign: 7 of 7/.test(live.given) &&
    end.done && end.fails === 1 && end.met === 4 && end.focus === "The page is home" && end.saved && end.resume === null &&
    end.links.join() === "https://islam.museum/en/person/al-kindi/,https://islam.museum/en/invention/frequency-analysis-al-kindi/" && /Historical review pending/.test(end.pending) &&
    /\D1\D/.test(` ${back.progress} `) && /^Play again: /.test(back.label) && back.benchHidden && /Ibn al-Haytham/.test(back.primary) && /^Play: /.test(back.clock),
    { label, isPlain, heading, tables, incomplete, wrong, freed, live, end, back });
  await ctx.close();
  // Left in the middle: one sign given, the page loaded again, and the Atlas says Continue; the sign is where it was.
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await open(ctx2, "&style=explorer");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  const first = await ev<{ mark: string; sign: string }>(page, "(() => { const c = window.__HH__.cipher(); const m = [...document.querySelectorAll('.bench select')][2].dataset.mark; return { mark: m, sign: c.puzzle.key[m] }; })()");
  await page.locator(`.bench select[data-mark='${first.mark}']`).selectOption(first.sign);
  const keptNow = await ev<{ quest: string; snap: { guess: Record<string, string> } } | null>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null");
  await ev(page, "window.__HH__.saveReady()");
  await page.reload();
  await page.waitForFunction("window.__HH__ && window.__HH__.ready");
  const hubLabels = await ev<{ cipher: string; restart: number; flying: boolean; primary: string }>(page, "({ cipher: document.querySelector(\"button[data-quest='w02q3-al-kindi']\").textContent, restart: [...document.querySelectorAll('.hub li.open button')].filter((b) => b.textContent === 'Start this quest again').length, flying: window.__HH__.resumed(), primary: document.querySelector('.hub button.primary').textContent })");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  const after = await ev<{ guess: Record<string, string>; value: string }>(page, `(() => { const c = window.__HH__.cipher(); return { guess: c.guess, value: document.querySelector(".bench select[data-mark='${first.mark}']").value }; })()`);
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-cipher-resumed.png"), fullPage: true });
  record("al-Kindi's secret page left in the middle is kept, the Atlas says Continue and offers a new start, and the sign comes back where it was",
    keptNow?.quest === QUEST && keptNow.snap.guess[first.mark] === first.sign && /^Continue: /.test(hubLabels.cipher) && hubLabels.restart === 1 && !hubLabels.flying && /^Play: /.test(hubLabels.primary) && JSON.stringify(after.guess) === JSON.stringify({ [first.mark]: first.sign }) && after.value === first.sign,
    { first, keptNow, hubLabels, after });
  await ctx2.close();
  // The page in Arabic runs right to left, with the marks' and signs' names in Arabic.
  const arCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const ar = await arCtx.newPage();
  ar.on("pageerror", (e) => errors.push(String(e)));
  await ar.goto(`${served.base}/games/hudhud/index.html?lang=ar&music=off&style=explorer`);
  await ar.waitForFunction("window.__HH__ && window.__HH__.ready");
  await leaveOpening(ar);
  await ar.locator(`.hub button[data-quest='${QUEST}']`).click();
  const arView = await ev<{ dir: string; heading: string; captions: string[]; first: string; options: string[]; alt: string | null }>(ar, "({ dir: document.documentElement.dir, heading: document.querySelector('.bench h2').textContent, captions: [...document.querySelectorAll('.bench caption')].map((c) => c.textContent), first: document.querySelector('.bench .places label').textContent, options: [...document.querySelector('.bench select').options].map((o) => o.textContent), alt: document.querySelector('.bench canvas.cipher-art').getAttribute('aria-label') })");
  if (outDir) await ar.screenshot({ path: resolve(outDir, "hudhud-cipher-bench-ar.png"), fullPage: true });
  record("al-Kindi's secret page in Arabic runs right to left and names every sign and mark in Arabic",
    arView.dir === "rtl" && arView.heading === "الكندي" && arView.captions.length === 2 && /الأكثر إلى الأقل/.test(arView.captions[0]!) && arView.options.length === 8 && arView.options[0] === "لم تُختر بعد" && arView.options.slice(1).every((o) => /^ال/.test(o)) && /^العلامة التي يدل عليها ال/.test(arView.first) && /٢٤ رمزًا/.test(arView.alt ?? ""),
    arView);
  await arCtx.close();
}
// The fourth quest, al-Khwarizmi and the locked box: the problem said in words at every step, a move that does not
// apply is a slip and says so, both questions, the child answered kindly, the feather, the fewest moves played by the
// page's own buttons, four goals, the links, and the Atlas counts it. Then one move, the page loaded again, and "Continue".
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  // Since 27 November 2026 al-Khwarizmi's scene is played in his room; `room=off` keeps this check on the locked box's page, which stays as the way it is played without WebGL.
  let page = await open(ctx, "&style=explorer&room=off");
  const QUEST = "w02q2-al-khwarizmi";
  const button = page.locator(`.hub button[data-quest='${QUEST}']`);
  const isPlain = await button.evaluate((b) => !b.classList.contains("primary"));
  const label = await button.textContent();
  const hubNote = await ev<string>(page, "[...document.querySelectorAll('.hub p.small')].map((p) => p.textContent).join(' | ')");
  await button.click();
  await page.waitForFunction("window.__HH__.algebra() !== null");
  const heading = await page.locator(".bench h2").textContent();
  const words = () => ev<string>(page, "document.querySelector('.bench .equation').textContent");
  const view = () => ev<{ moves: number; slips: number; flags: string[]; done: boolean; sentence: string }>(page, "(() => { const a = window.__HH__.algebra(); return { moves: a.moves, slips: a.slips, flags: a.flags, done: a.done, sentence: a.sentence }; })()");
  const first = await words();
  const page1 = await ev<{ live: string | null; alt: string | null; role: string | null; inline: number; buttons: { move: string | undefined; w: number; h: number; off: boolean }[]; trial: boolean; polite: string | null }>(page, "(() => ({ live: document.querySelector('.bench .equation').getAttribute('aria-live'), alt: document.querySelector('.bench canvas.algebra-art').getAttribute('aria-label'), role: document.querySelector('.bench canvas.algebra-art').getAttribute('role'), inline: document.querySelectorAll('.bench [style]:not(canvas)').length, buttons: [...document.querySelectorAll('.bench .moves button')].map((b) => ({ move: b.dataset.move, w: b.getBoundingClientRect().width, h: b.getBoundingClientRect().height, off: b.disabled })), trial: /first trial/.test(document.querySelector('.bench').textContent), polite: document.querySelector('.bench .ran').getAttribute('aria-live') }))()");
  // A move that does not apply changes nothing, is a slip, and the Explorer is told which kind of move does not apply here.
  await page.locator(".bench .moves button[data-move='balance-number']").click();
  const slip = { words: await page.locator(".bench .ran").textContent(), sentence: await words(), v: await view() };
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-algebra-bench.png"), fullPage: true });
  for (const name of ["Ask how he wrote problems", "Ask about the two operations", "Talk to the child who carries the box"]) await page.getByRole("button", { name }).click();
  await page.getByRole("button", { name: "It is all right. We will find the number together." }).click();
  await page.getByRole("button", { name: "Look under the box" }).click();
  const asked = await view();
  // The fewest moves, pressed on the page's own buttons; the sentence is checked after each.
  const path = shortest(algebraStart("explorer"))!.map(moveName);
  const said: string[] = [];
  const onRestoreFocus: string[] = [];
  for (const m of path) {
    await page.locator(`.bench .moves button[data-move='${m}']`).click();
    said.push(await words());
    if (m.startsWith("restore")) onRestoreFocus.push(await ev<string>(page, "document.activeElement && document.activeElement.closest('.bench') ? document.activeElement.tagName : 'lost'"));
  }
  await page.waitForSelector(".bench .results:not([hidden])");
  const end = await ev<{ done: boolean; moves: number; slips: number; met: number; focus: string; links: string[]; pending: string; saved: boolean; resume: unknown; notes: number }>(page, "({ done: window.__HH__.algebra().done, moves: window.__HH__.algebra().moves, slips: window.__HH__.algebra().slips, met: document.querySelectorAll('.bench .results .goals .met').length, focus: document.activeElement ? document.activeElement.textContent : '', links: [...document.querySelectorAll('.bench .results a')].map((a) => a.getAttribute('href')), pending: document.querySelector('.bench .results .pending').textContent, saved: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.quests?.['w02q2-al-khwarizmi']?.done === true, resume: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null, notes: document.querySelectorAll('.bench .results .note p').length })");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-algebra-results.png"), fullPage: true });
  await page.getByRole("button", { name: "Back to the Atlas" }).last().click();
  const back = await ev<{ progress: string; label: string; benchHidden: boolean; primary: string; cipher: string; open: number }>(page, "({ progress: document.querySelector('.hub .progress').textContent, label: document.querySelector(\"button[data-quest='w02q2-al-khwarizmi']\").textContent, benchHidden: document.querySelector('.bench').hidden, primary: document.querySelector('.hub button.primary').textContent, cipher: document.querySelector(\"button[data-quest='w02q3-al-kindi']\").textContent, open: document.querySelectorAll('.hub .world li.open').length })");
  record("al-Khwarizmi's locked box can be played with the page's own buttons: the problem said in words at every step in a polite live region, a move that does not apply is a slip that says so, both questions, the child, the feather, the fewest moves, four goals, the links, and the Atlas counts it",
    isPlain && /^Play: /.test(label ?? "") && /Thirteen quests are built/.test(hubNote) && heading === "al-Khwarizmi" && first === "3 things less 4 equal 1 thing and 6" && page1.live === "polite" && page1.polite === "polite" && page1.role === "img" && (page1.alt ?? "").includes(first) && page1.inline === 0 && page1.trial &&
    page1.buttons.map((b) => b.move).join() === "restore-left-number,balance-things,balance-number,share" && page1.buttons.every((b) => b.w >= 44 && b.h >= 44 && !b.off) &&
    /^Balancing does not apply here\.$/.test(slip.words ?? "") && slip.sentence === first && slip.v.slips === 1 && slip.v.moves === 0 &&
    asked.flags.slice().sort().join() === "answered,askedOps,askedWords,feather,kind" &&
    path.join() === "restore-left-number,balance-things,share" && said.join(" | ") === "3 things equal 1 thing and 10 | 2 things equal 10 | 1 thing equal 5" && onRestoreFocus.join() === "BUTTON" &&
    end.done && end.moves === 3 && end.slips === 1 && end.met === 4 && end.focus === "The page is home" && end.saved && end.resume === null && end.notes === 8 &&
    end.links.join() === "https://islam.museum/en/person/al-khwarizmi/,https://islam.museum/en/work/al-jabr-wal-muqabala/,https://islam.museum/en/invention/algebra/" && /Historical review pending/.test(end.pending) &&
    /\D1\D/.test(` ${back.progress} `) && /^Play again: /.test(back.label) && back.benchHidden && /Ibn al-Haytham/.test(back.primary) && /^Play: /.test(back.cipher) && back.open === 13,
    { label, isPlain, heading, first, page1, slip, asked, path, said, onRestoreFocus, end, back, hubNote });
  await ctx.close();
  // Left in the middle: one move made, the page loaded again, and the Atlas says Continue; the same sentence is there.
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  // Since 27 November 2026 al-Khwarizmi's scene is played in his room; `room=off` keeps this check on the locked box's page, which stays as the way it is played without WebGL.
  page = await open(ctx2, "&style=explorer&room=off");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  await page.locator(".bench .moves button[data-move='restore-left-number']").click();
  const mid = await words();
  const keptNow = await ev<{ quest: string; snap: { moves: number } } | null>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null");
  await ev(page, "window.__HH__.saveReady()");
  await page.reload();
  await page.waitForFunction("window.__HH__ && window.__HH__.ready");
  const hubLabels = await ev<{ label: string; restart: number; flying: boolean; primary: string }>(page, "({ label: document.querySelector(\"button[data-quest='w02q2-al-khwarizmi']\").textContent, restart: [...document.querySelectorAll('.hub li.open button')].filter((b) => b.textContent === 'Start this quest again').length, flying: window.__HH__.resumed(), primary: document.querySelector('.hub button.primary').textContent })");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  const after = await ev<{ sentence: string; moves: number; shown: string }>(page, "({ sentence: window.__HH__.algebra().sentence, moves: window.__HH__.algebra().moves, shown: document.querySelector('.bench .equation').textContent })");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-algebra-resumed.png"), fullPage: true });
  record("al-Khwarizmi's box left in the middle is kept, the Atlas says Continue and offers a new start, and the same problem in words is there when it is opened again",
    mid === "3 things equal 1 thing and 10" && keptNow?.quest === QUEST && keptNow.snap.moves === 1 && /^Continue: /.test(hubLabels.label) && hubLabels.restart === 1 && !hubLabels.flying && /^Play: /.test(hubLabels.primary) && after.sentence === mid && after.shown === mid && after.moves === 1,
    { mid, keptNow, hubLabels, after });
  await ctx2.close();
  // The page in Arabic runs right to left, with Arabic numerals and the right plural, and the first side on the right.
  const arCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const ar = await arCtx.newPage();
  ar.on("pageerror", (e) => errors.push(String(e)));
  // Since 27 November 2026 al-Khwarizmi's scene is played in his room; `room=off` keeps this check on the locked box's page, which stays as the way it is played without WebGL.
  await ar.goto(`${served.base}/games/hudhud/index.html?lang=ar&music=off&style=explorer&room=off`);
  await ar.waitForFunction("window.__HH__ && window.__HH__.ready");
  await leaveOpening(ar);
  await ar.locator(`.hub button[data-quest='${QUEST}']`).click();
  const arView = await ev<{ dir: string; heading: string; sentence: string; alt: string | null; buttons: string[]; first: number }>(ar, "({ dir: document.documentElement.dir, heading: document.querySelector('.bench h2').textContent, sentence: document.querySelector('.bench .equation').textContent, alt: document.querySelector('.bench canvas.algebra-art').getAttribute('aria-label'), buttons: [...document.querySelectorAll('.bench .moves button')].map((b) => b.textContent), first: 0 })");
  if (outDir) await ar.screenshot({ path: resolve(outDir, "hudhud-algebra-bench-ar.png"), fullPage: true });
  await ar.locator(".bench .moves button").first().click();
  const arAfter = await ev<string>(ar, "document.querySelector('.bench .equation').textContent");
  record("al-Khwarizmi's box in Arabic runs right to left, says the problem with Arabic numerals and the right plural (one, then two), and names the first side as the right one",
    arView.dir === "rtl" && arView.heading === "الخوارزمي" && arView.sentence === "٣ أشياء إلا ٤ تعدل شيئًا واحدًا و٦" && (arView.alt ?? "").includes(arView.sentence) && /الجهة اليمنى/.test(arView.buttons[0] ?? "") && /٤/.test(arView.buttons[0] ?? "") && arAfter === "٣ أشياء تعدل شيئًا واحدًا و١٠",
    { arView, arAfter });
  await arCtx.close();
}
// The fifth quest, al-Idrisi and the scattered sheets: a real button for every place in the same rows and columns, the
// page says how many seams do not match, two buttons and two touches on the picture each make one exchange, both
// questions, the helper answered kindly, the feather, the sheets put in order by exchanges worked out here from the
// page's own state, four goals, the links, and the Atlas counts it. Then one exchange, the page loaded again, and
// "Continue"; the Challenge way of playing, which shows nothing until the map is checked; and the page in Arabic.
{
  const QUEST = "w03q4-al-idrisi";
  /** The middle of a place, in the picture's space, turned into where to click on the canvas. */
  const spot = async (page: Page, p: number, rows: number, cols: number, rtl: boolean): Promise<[number, number]> => {
    // A touch needs the picture on the screen, as for a person: the Atlas may have been scrolled when the quest was opened.
    await page.locator(".bench canvas.sheets-art").scrollIntoViewIfNeeded();
    const box = (await page.locator(".bench canvas.sheets-art").boundingBox())!;
    const o = sheetOrigin(p, rows, cols);
    const { tile } = sheetsLayout(rows, cols);
    const x = rtl ? SHEETS_ART.w - (o.x + tile / 2) : o.x + tile / 2;
    return [box.x + (x / SHEETS_ART.w) * box.width, box.y + ((o.y + tile / 2) / SHEETS_ART.h) * box.height];
  };
  const view = (page: Page) => ev<{ moves: number; checks: number; flags: string[]; done: boolean; grid: number[]; solution: number[]; selected: number | null; status: string; rows: number; cols: number; start: number[] }>(page, "(() => { const a = window.__HH__.sheets(); return { moves: a.moves, checks: a.checks, flags: a.flags, done: a.done, grid: a.grid, solution: a.solution, selected: a.selected, status: a.status, rows: a.rows, cols: a.cols, start: a.start }; })()");
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  let page = await open(ctx, "&style=explorer");
  const button = page.locator(`.hub button[data-quest='${QUEST}']`);
  const isPlain = await button.evaluate((b) => !b.classList.contains("primary"));
  const label = await button.textContent();
  const hubNote = await ev<string>(page, "[...document.querySelectorAll('.hub p.small')].map((p) => p.textContent).join(' | ')");
  await button.click();
  await page.waitForFunction("window.__HH__.sheets() !== null");
  const heading = await page.locator(".bench h2").textContent();
  const v0 = await view(page);
  const page1 = await ev<{ rows: number; perRow: number[]; labels: string[]; sized: boolean; pressed: string[]; alt: string | null; role: string | null; inline: number; trial: boolean; live: string | null; edgeRows: number; caption: string; summary: string; status: string }>(page, "(() => ({ rows: document.querySelectorAll('.bench ol.sheet-row').length, perRow: [...document.querySelectorAll('.bench ol.sheet-row')].map((o) => o.querySelectorAll('button').length), labels: [...document.querySelectorAll('.bench .sheet-row button')].map((b) => b.textContent), sized: [...document.querySelectorAll('.bench .sheet-row button')].every((b) => b.getBoundingClientRect().width >= 44 && b.getBoundingClientRect().height >= 44), pressed: [...document.querySelectorAll('.bench .sheet-row button')].map((b) => b.getAttribute('aria-pressed')), alt: document.querySelector('.bench canvas.sheets-art').getAttribute('aria-label'), role: document.querySelector('.bench canvas.sheets-art').getAttribute('role'), inline: document.querySelectorAll('.bench [style]:not(canvas)').length, trial: /first trial/.test(document.querySelector('.bench').textContent), live: document.querySelector('.bench .ran').getAttribute('aria-live'), edgeRows: document.querySelectorAll('.bench details.edges tbody tr').length, caption: document.querySelector('.bench details.edges caption').textContent, summary: document.querySelector('.bench details.edges summary').textContent, status: document.querySelector('.bench .ran .status').textContent }))()");
  const matched = Number(/Seams that match: (\d+) of 31\./.exec(page1.alt ?? "")?.[1] ?? NaN);
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-sheets-bench.png"), fullPage: true });
  // One exchange by two buttons: the first is held (pressed), the second makes the exchange.
  const b = (p: number) => page.locator(`.bench .sheet-row button[data-place='${p}']`);
  await b(0).click();
  const held = await ev<{ pressed: string | null; selected: number | null; hint: string }>(page, "({ pressed: document.querySelector(\".bench .sheet-row button[data-place='0']\").getAttribute('aria-pressed'), selected: window.__HH__.sheets().selected, hint: [...document.querySelectorAll('.bench p.small')].map((p) => p.textContent).join(' | ') })");
  await b(1).click();
  const viaButtons = await view(page);
  const said1 = await page.locator(".bench .ran").textContent();
  // The held sheet pressed again is let go, with no exchange.
  await b(2).click();
  await b(2).click();
  const letGo = { v: await view(page), said: await page.locator(".bench .ran").textContent() };
  // One exchange by two touches on the picture.
  await page.mouse.click(...(await spot(page, 2, v0.rows, v0.cols, false)));
  const touched = await view(page);
  await page.mouse.click(...(await spot(page, 3, v0.rows, v0.cols, false)));
  const viaPicture = await view(page);
  for (const name of ["Ask about his book", "Ask about the maps", "Talk to the young helper"]) await page.getByRole("button", { name }).click();
  await page.getByRole("button", { name: "It is all right. We will put them in order together." }).click();
  await page.getByRole("button", { name: "Look under the sheets" }).click();
  const asked = await view(page);
  // The sheets put in order by exchanges worked out here from the page's own state: for the first wrong place, press it and then the place the right sheet is in.
  let exchanges = 0;
  for (;;) {
    const s = await view(page);
    if (s.done) break;
    const p = s.grid.findIndex((id, i) => id !== s.solution[i]);
    if (p < 0) break;
    const q = s.grid.indexOf(s.solution[p]!);
    await b(p).click();
    await b(q).click();
    exchanges++;
  }
  await page.waitForSelector(".bench .results:not([hidden])");
  const end = await ev<{ done: boolean; moves: number; met: number; focus: string; links: string[]; pending: string; saved: boolean; resume: unknown; notes: number; disabled: boolean }>(page, "({ done: window.__HH__.sheets().done, moves: window.__HH__.sheets().moves, met: document.querySelectorAll('.bench .results .goals .met').length, focus: document.activeElement ? document.activeElement.textContent : '', links: [...document.querySelectorAll('.bench .results a')].map((a) => a.getAttribute('href')), pending: document.querySelector('.bench .results .pending').textContent, saved: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.quests?.['w03q4-al-idrisi']?.done === true, resume: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null, notes: document.querySelectorAll('.bench .results .note p').length, disabled: [...document.querySelectorAll('.bench .sheet-row button')].every((x) => x.disabled) })");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-sheets-results.png"), fullPage: true });
  await page.getByRole("button", { name: "Back to the Atlas" }).last().click();
  const back = await ev<{ progress: string; label: string; benchHidden: boolean; primary: string; algebra: string; open: number }>(page, "({ progress: document.querySelector('.hub .progress').textContent, label: document.querySelector(\"button[data-quest='w03q4-al-idrisi']\").textContent, benchHidden: document.querySelector('.bench').hidden, primary: document.querySelector('.hub button.primary').textContent, algebra: document.querySelector(\"button[data-quest='w02q2-al-khwarizmi']\").textContent, open: document.querySelectorAll('.hub .world li.open').length })");
  const picture = await ev<{ home: number[]; open: number[] }>(page, "window.__HH__.atlasPicture()");
  const rowsOk = page1.rows === 3 && page1.perRow.join() === "4,4,4";
  record("al-Idrisi's scattered sheets can be played with the page's own buttons: a button for every place in the right rows and columns, the page says how many seams do not match, two buttons and two touches on the picture each make one exchange, both questions, the helper, the feather, the sheets put in order, four goals, the links, and the Atlas counts it",
    isPlain && /^Play: /.test(label ?? "") && /Thirteen quests are built/.test(hubNote) && heading === "al-Idrisi" && rowsOk && page1.labels[0] === `Row 1, place 1: sheet ${v0.grid[0]}` && page1.labels[11] === `Row 3, place 4: sheet ${v0.grid[11]}` && page1.sized && page1.pressed.every((x) => x === "false") &&
    page1.role === "img" && matched >= 0 && page1.status === `Seams that do not match: ${31 - matched} of 31.` && page1.live === "polite" && page1.inline === 0 && page1.trial && page1.edgeRows === 12 && /^What the edges of each sheet carry/.test(page1.caption) && page1.summary === "The edges of every sheet, in words" &&
    held.pressed === "true" && held.selected === 0 && new RegExp(`Row 1, place 1, sheet ${v0.grid[0]} is chosen`).test(held.hint) &&
    viaButtons.moves === 1 && viaButtons.selected === null && viaButtons.grid[0] === v0.grid[1] && viaButtons.grid[1] === v0.grid[0] && /Exchanged row 1, place 1 with row 1, place 2\./.test(said1 ?? "") &&
    letGo.v.moves === 1 && letGo.v.selected === null && /Let go/.test(letGo.said ?? "") && touched.selected === 2 && touched.moves === 1 && viaPicture.moves === 2 && viaPicture.selected === null && viaPicture.grid[2] === viaButtons.grid[3] && viaPicture.grid[3] === viaButtons.grid[2] &&
    asked.flags.slice().sort().join() === "answered,askedBook,askedMaps,feather,kind" && end.done && end.moves === 2 + exchanges && end.met === (end.moves <= 9 ? 4 : 3) && end.focus === "The page is home" && end.saved && end.resume === null && end.notes === 6 && end.disabled &&
    end.links.join() === "https://islam.museum/en/person/al-idrisi-muhammad-ibn-abd-allah/,https://islam.museum/en/work/nuzhat-al-mushtaq/" && /Historical review pending/.test(end.pending) &&
    /\D1\D/.test(` ${back.progress} `) && /^Play again: /.test(back.label) && back.benchHidden && /Ibn al-Haytham/.test(back.primary) && /^Play: /.test(back.algebra) && back.open === 13 && picture.open.join() === "1,2,3,4,5,6,7,8,9,10" && picture.home[2] === 1,
    { label, isPlain, heading, v0, page1, matched, held, viaButtons, said1, letGo, touched, viaPicture, asked, exchanges, end, back, picture, hubNote });
  await ctx.close();
  // Left in the middle: one exchange made, the page loaded again, and the Atlas says Continue; the sheets lie as they did.
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await open(ctx2, "&style=explorer");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  const w0 = await view(page);
  await page.locator(".bench .sheet-row button[data-place='0']").click();
  await page.locator(".bench .sheet-row button[data-place='5']").click();
  const mid = await view(page);
  const keptNow = await ev<{ quest: string; snap: { moves: number; grid: number[] } } | null>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null");
  await ev(page, "window.__HH__.saveReady()");
  await page.reload();
  await page.waitForFunction("window.__HH__ && window.__HH__.ready");
  const hubLabels = await ev<{ label: string; restart: number; flying: boolean; primary: string }>(page, "({ label: document.querySelector(\"button[data-quest='w03q4-al-idrisi']\").textContent, restart: [...document.querySelectorAll('.hub li.open button')].filter((b) => b.textContent === 'Start this quest again').length, flying: window.__HH__.resumed(), primary: document.querySelector('.hub button.primary').textContent })");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  const after = await view(page);
  const shown = await ev<string[]>(page, "[...document.querySelectorAll('.bench .sheet-row button')].map((x) => x.textContent)");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-sheets-resumed.png"), fullPage: true });
  record("al-Idrisi's sheets left in the middle are kept, the Atlas says Continue and offers a new start, and the sheets lie as they did when the quest is opened again",
    mid.moves === 1 && mid.grid[0] === w0.grid[5] && keptNow?.quest === QUEST && keptNow.snap.moves === 1 && keptNow.snap.grid.join() === mid.grid.join() && /^Continue: /.test(hubLabels.label) && hubLabels.restart === 1 && !hubLabels.flying && /^Play: /.test(hubLabels.primary) &&
    after.grid.join() === mid.grid.join() && after.moves === 1 && shown[0] === `Row 1, place 1: sheet ${mid.grid[0]}` && shown.length === 12,
    { w0, mid, keptNow, hubLabels, after, shown: shown.slice(0, 3) });
  await ctx2.close();
  // The Challenge way of playing shows nothing until the map is checked; the count is told then, a failed check is counted, and the map is done only on a check.
  const ctx3 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await open(ctx3, "&style=challenge");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  const c0 = await ev<{ alt: string | null; status: string; checkButtons: number; placeLabels: string[] }>(page, "({ alt: document.querySelector('.bench canvas.sheets-art').getAttribute('aria-label'), status: document.querySelector('.bench .ran .status').textContent, checkButtons: [...document.querySelectorAll('.bench button')].filter((x) => x.textContent === 'Check the map').length, placeLabels: [...document.querySelectorAll('.bench .sheet-row button')].map((x) => x.textContent) })");
  await page.getByRole("button", { name: "Check the map" }).click();
  const c1 = { v: await view(page), said: await page.locator(".bench .ran").textContent() };
  await page.locator(".bench .sheet-row button[data-place='0']").click();
  await page.locator(".bench .sheet-row button[data-place='1']").click();
  const c2 = { v: await view(page), said: await page.locator(".bench .ran").textContent() };
  // Put in order by exchanges: not done until it is checked.
  for (;;) {
    const s = await view(page);
    const p = s.grid.findIndex((id, i) => id !== s.solution[i]);
    if (p < 0) break;
    await page.locator(`.bench .sheet-row button[data-place='${p}']`).click();
    await page.locator(`.bench .sheet-row button[data-place='${s.grid.indexOf(s.solution[p]!)}']`).click();
  }
  const ordered = await ev<{ done: boolean; results: boolean }>(page, "({ done: window.__HH__.sheets().done, results: !document.querySelector('.bench .results').hidden })");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-sheets-challenge.png"), fullPage: true });
  await page.getByRole("button", { name: "Check the map" }).click();
  const c3 = await ev<{ done: boolean; checks: number; results: boolean; progress: string }>(page, "({ done: window.__HH__.sheets().done, checks: window.__HH__.sheets().checks, results: !document.querySelector('.bench .results').hidden, progress: document.querySelector('.bench .results > p').textContent })");
  record("al-Idrisi's Challenge sheets show no seam until Check the map is pressed, the count is told then and a failed check is counted, an exchange takes the count away, and a map put in order is done only when it is checked",
    /Which seams match is not shown/.test(c0.alt ?? "") && /Which seams match is not shown here/.test(c0.status) && c0.checkButtons === 1 && c0.placeLabels.length === 15 && c0.placeLabels.every((x) => /^Row \d, place \d: sheet \d+$/.test(x)) &&
    c1.v.checks === 1 && /^Seams that match: \d+ of 38\.$/.test((c1.said ?? "").trim()) && c2.v.moves === 1 && !/Seams that match/.test(c2.said ?? "") && /Which seams match is not shown here/.test(c2.said ?? "") &&
    !ordered.done && !ordered.results && c3.done && c3.checks === 1 && c3.results && /Checks that failed: 1/.test(c3.progress),
    { c0: { ...c0, placeLabels: c0.placeLabels.slice(0, 2) }, c1, c2, ordered, c3 });
  await ctx3.close();
  // The page in Arabic runs right to left with Arabic numerals; the first column is on the right in the button grid and in the picture's own touch, which is its mirror image.
  const arCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const ar = await arCtx.newPage();
  ar.on("pageerror", (e) => errors.push(String(e)));
  await ar.goto(`${served.base}/games/hudhud/index.html?lang=ar&music=off&style=explorer`);
  await ar.waitForFunction("window.__HH__ && window.__HH__.ready");
  await leaveOpening(ar);
  await ar.locator(`.hub button[data-quest='${QUEST}']`).click();
  const a0 = await view(ar);
  const arView = await ev<{ dir: string; heading: string; first: string; alt: string | null; x: number[]; table: string; edge: string[] }>(ar, "({ dir: document.documentElement.dir, heading: document.querySelector('.bench h2').textContent, first: document.querySelector('.bench .sheet-row button').textContent, alt: document.querySelector('.bench canvas.sheets-art').getAttribute('aria-label'), x: [...document.querySelectorAll('.bench ol.sheet-row')[0].querySelectorAll('button')].map((b) => Math.round(b.getBoundingClientRect().left)), table: document.querySelector('.bench details.edges summary').textContent, edge: [...document.querySelectorAll('.bench details.edges thead th')].map((t) => t.textContent) })");
  if (outDir) await ar.screenshot({ path: resolve(outDir, "hudhud-sheets-bench-ar.png"), fullPage: true });
  // Touch the first column in the picture (the right) and then the second (to its left): they are the first two places.
  await ar.mouse.click(...(await spot(ar, 0, a0.rows, a0.cols, true)));
  const t1 = await view(ar);
  await ar.mouse.click(...(await spot(ar, 1, a0.rows, a0.cols, true)));
  const t2 = await view(ar);
  record("al-Idrisi's sheets in Arabic run right to left with Arabic numerals, put the first column on the right in the button grid and in a touch on the picture, and name the edges from the right",
    arView.dir === "rtl" && arView.heading === "الإدريسي" && /^الصف ١، الموضع ١: الورقة /.test(arView.first) && /٣١/.test(arView.alt ?? "") && arView.x.length === 4 && arView.x[0]! > arView.x[1]! && arView.x[1]! > arView.x[2]! && arView.x[2]! > arView.x[3]! &&
    arView.table === "أطراف كل ورقة بالكلمات" && arView.edge.join("|") === "الورقة|الحافة العليا|الحافة السفلى|الحافة اليمنى|الحافة اليسرى" &&
    t1.selected === 0 && t2.moves === 1 && t2.selected === null && t2.grid[0] === a0.grid[1] && t2.grid[1] === a0.grid[0],
    { arView, t1: t1.selected, t2: { moves: t2.moves, grid: t2.grid.slice(0, 3) }, a0grid: a0.grid.slice(0, 3) });
  await arCtx.close();
}
// The sixth quest, al-Jahiz and the animal cards: a list of choices for every card and the key in words, a showing with a
// card unplaced refused and not counted, a wrong showing that says how many cards are right, both questions (and the
// hoopoe lines after the second), the girl answered kindly, the feather, a card put in a tray by two touches on the
// picture, the rest by the lists, four goals, the links, and the Atlas counts it (world 9 is open). Then a card placed,
// the page loaded again, and "Continue"; the Challenge way of playing, with five groups; the page in Arabic, with the
// trays from the right; and the page scrolled when a quest is opened and when the Atlas is returned to.
{
  const QUEST = "w09q1-al-jahiz";
  type SortView = { moves: number; shows: number; flags: string[]; done: boolean; placed: Record<string, string | null>; answer: Record<string, string>; selected: string | null; status: string; items: string[]; groups: string[] };
  const sv = (page: Page) => ev<SortView>(page, "(() => { const a = window.__HH__.sort(); return { moves: a.moves, shows: a.shows, flags: a.flags, done: a.done, placed: a.placed, answer: a.answer, selected: a.selected, status: a.status, items: a.items, groups: a.groups }; })()");
  /** The middle of a card, or of the top of a tray, in the picture's space, turned into where to click on the canvas. */
  const at = async (page: Page, s: SortView, what: { card: string } | { tray: number }, rtl: boolean): Promise<[number, number]> => {
    await page.locator(".bench canvas.sort-art").scrollIntoViewIfNeeded();
    const box = (await page.locator(".bench canvas.sort-art").boundingBox())!;
    const placed = s.items.map((i) => (s.placed[i] === null ? null : s.groups.indexOf(s.placed[i]!)));
    let x: number;
    let y: number;
    if ("card" in what) {
      const r = cardRects({ items: s.items, placed, groups: s.groups.length, rtl })[s.items.indexOf(what.card)]!;
      [x, y] = [r.x + r.w / 2, r.y + r.h / 2];
    } else {
      const r = trayRects(s.groups.length, rtl)[what.tray]!;
      [x, y] = [r.x + r.w / 2, r.y + 8];
    }
    return [box.x + (x / SORT_ART.w) * box.width, box.y + (y / SORT_ART.h) * box.height];
  };
  const pick = (page: Page, item: string, group: string) => page.locator(`.bench select[data-item='${item}']`).selectOption(group);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  let page = await open(ctx, "&style=explorer");
  const button = page.locator(`.hub button[data-quest='${QUEST}']`);
  const isPlain = await button.evaluate((b) => !b.classList.contains("primary"));
  const label = await button.textContent();
  const hubNote = await ev<string>(page, "[...document.querySelectorAll('.hub p.small')].map((p) => p.textContent).join(' | ')");
  await button.click();
  await page.waitForFunction("window.__HH__.sort() !== null");
  const heading = await page.locator(".bench h2").textContent();
  const page1 = await ev<{ selects: number; labels: string[]; options: string[]; key: string[]; alt: string | null; role: string | null; inline: number; trial: boolean; live: string | null; keyTitle: string; focus: string; sized: boolean; show: boolean }>(page, "(() => ({ selects: document.querySelectorAll('.bench select[data-item]').length, labels: [...document.querySelectorAll('.bench .places label > span')].map((s) => s.textContent), options: [...document.querySelector(\"select[data-item='bat']\").options].map((o) => o.textContent), key: [...document.querySelectorAll('.bench ol.tray-key li')].map((l) => l.textContent), alt: document.querySelector('.bench canvas.sort-art').getAttribute('aria-label'), role: document.querySelector('.bench canvas.sort-art').getAttribute('role'), inline: document.querySelectorAll('.bench [style]:not(canvas)').length, trial: /first trial/.test(document.querySelector('.bench').textContent), live: document.querySelector('.bench .ran').getAttribute('aria-live'), keyTitle: document.querySelector('.bench h3').textContent, focus: document.activeElement.tagName, sized: [...document.querySelectorAll('.bench select[data-item]')].every((s) => s.getBoundingClientRect().height >= 44), show: [...document.querySelectorAll('.bench button')].some((b) => b.textContent === 'Show al-Jahiz') }))()");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-sort-bench.png"), fullPage: true });
  const show = page.getByRole("button", { name: "Show al-Jahiz" });
  // A showing with every card unplaced is refused and not counted; so is one with a card unplaced.
  await show.click();
  const refused0 = { v: await sv(page), said: await page.locator(".bench .ran").textContent() };
  await pick(page, "eagle", "exp_in");
  await show.click();
  const refused1 = { v: await sv(page), said: await page.locator(".bench .ran").textContent() };
  // Every card in its group, but the bat outside the birds: a wrong showing that says how many are right, and is counted.
  for (const item of ["vulture", "crow", "ostrich", "locust", "bee", "fly"]) await pick(page, item, item === "vulture" || item === "crow" ? "exp_in" : "exp_out");
  await pick(page, "bat", "exp_out");
  await show.click();
  const wrong = { v: await sv(page), said: await page.locator(".bench .ran").textContent() };
  // Both questions, and the hoopoe after the second; the girl, kindly; the feather.
  await page.getByRole("button", { name: "Ask about his division of animals" }).click();
  const hoopoeBefore = await page.locator(".bench .said").textContent();
  await page.getByRole("button", { name: "Ask about the birds" }).click();
  const said2 = (await page.locator(".bench .said").textContent()) ?? "";
  await page.getByRole("button", { name: "Talk to the girl who carries the cards" }).click();
  await page.getByRole("button", { name: "It is all right. We will sort them together." }).click();
  await page.getByRole("button", { name: "Look among the cards" }).click();
  const asked = await sv(page);
  // The bat is put in the birds by two touches on the picture: the card, then the first tray.
  await page.mouse.click(...(await at(page, asked, { card: "bat" }, false)));
  const chose = { v: await sv(page), hint: await ev<string>(page, "[...document.querySelectorAll('.bench p.small')].map((p) => p.textContent).join(' | ')") };
  await page.mouse.click(...(await at(page, chose.v, { tray: 0 }, false)));
  const moved = await sv(page);
  const selectValue = await page.locator("select[data-item='bat']").inputValue();
  await show.click();
  await page.waitForSelector(".bench .results:not([hidden])");
  const end = await ev<{ done: boolean; shows: number; met: number; focus: string; links: string[]; pending: string; saved: boolean; resume: unknown; notes: number; disabled: boolean; progress: string }>(page, "({ done: window.__HH__.sort().done, shows: window.__HH__.sort().shows, met: document.querySelectorAll('.bench .results .goals .met').length, focus: document.activeElement ? document.activeElement.textContent : '', links: [...document.querySelectorAll('.bench .results a')].map((a) => a.getAttribute('href')), pending: document.querySelector('.bench .results .pending').textContent, saved: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.quests?.['w09q1-al-jahiz']?.done === true, resume: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null, notes: document.querySelectorAll('.bench .results .note p').length, disabled: [...document.querySelectorAll('.bench select[data-item]')].every((x) => x.disabled), progress: document.querySelector('.bench .results > p').textContent })");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-sort-results.png"), fullPage: true });
  await page.getByRole("button", { name: "Back to the Atlas" }).last().click();
  const back = await ev<{ progress: string; label: string; benchHidden: boolean; primary: string; open: number; headingInView: boolean; focus: string }>(page, "(() => { const h = document.querySelector('.hub h2'); const r = h.getBoundingClientRect(); return { progress: document.querySelector('.hub .progress').textContent, label: document.querySelector(\"button[data-quest='w09q1-al-jahiz']\").textContent, benchHidden: document.querySelector('.bench').hidden, primary: document.querySelector('.hub button.primary').textContent, open: document.querySelectorAll('.hub .world li.open').length, headingInView: r.top >= 0 && r.bottom <= innerHeight, focus: document.activeElement === h ? 'H2' : document.activeElement.tagName }; })()");
  const picture = await ev<{ home: number[]; open: number[] }>(page, "window.__HH__.atlasPicture()");
  const slotKept = await ev<string | null>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.quests?.['w09q1-al-jahiz'] ? 'recorded' : null");
  record("al-Jahiz's animal cards can be played with the page's own controls: a list of choices for every card and the key in words, a showing with a card unplaced is refused and not counted, a wrong showing says how many are right, both questions with the hoopoe after the second, the girl, the feather, a card put in a tray by two touches on the picture, four goals, the links, and the Atlas counts it with world 9 open",
    isPlain && /^Play: /.test(label ?? "") && /Thirteen quests are built/.test(hubNote) && heading === "al-Jahiz" && page1.selects === 8 && page1.labels[3] === "Where does the bat go?" && page1.options.join("|") === "not placed yet|Tray 1: counted among the birds|Tray 2: not counted among the birds" && page1.key.join("|") === "Tray 1: counted among the birds|Tray 2: not counted among the birds" && page1.keyTitle === "The trays, in words" &&
    page1.role === "img" && /Trays: 2/.test(page1.alt ?? "") && /Cards in a tray: 0 of 8/.test(page1.alt ?? "") && page1.live === "polite" && page1.inline === 0 && page1.trial && page1.sized && page1.show && page1.focus === "H2" &&
    refused0.v.shows === 0 && /Cards not placed: 8/.test(refused0.said ?? "") && refused1.v.shows === 0 && refused1.v.moves === 1 && /Cards not placed: 7/.test(refused1.said ?? "") &&
    wrong.v.shows === 1 && !wrong.v.done && wrong.v.moves === 8 && /Cards that are right: 7 of 8/.test(wrong.said ?? "") && !/hoopoe/i.test(hoopoeBefore ?? "") && /third part of his book/.test(said2) && /I am in his book!/.test(said2) &&
    asked.flags.slice().sort().join() === "answered,askedBirds,askedDivision,feather,kind" && chose.v.selected === "bat" && /The bat card is chosen/.test(chose.hint) && moved.placed.bat === "exp_in" && moved.selected === null && moved.moves === 9 && selectValue === "exp_in" &&
    end.done && end.shows === 1 && end.met === 4 && end.focus === "The page is home" && end.saved && end.resume === null && end.notes === 7 && end.disabled && /Cards placed: 8 of 8 · Showings that failed: 1/.test(end.progress) &&
    end.links.join() === "https://islam.museum/en/person/al-jahiz/,https://islam.museum/en/work/kitab-al-hayawan/" && /Historical review pending/.test(end.pending) &&
    /\D1\D/.test(` ${back.progress} `) && /^Play again: /.test(back.label) && back.benchHidden && /Ibn al-Haytham/.test(back.primary) && back.open === 13 && picture.open.join() === "1,2,3,4,5,6,7,8,9,10" && picture.home[8] === 1 && slotKept === "recorded" && back.headingInView && back.focus === "H2",
    { label, isPlain, heading, page1, refused0, refused1, wrong, hoopoeBefore: hoopoeBefore?.slice(-120), said2: said2.slice(-260), asked, chose, moved, selectValue, end, back, picture, hubNote });
  await ctx.close();
  // Left in the middle: one card placed, the page loaded again, and the Atlas says Continue; the card is where it was.
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await open(ctx2, "&style=explorer");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  await pick(page, "bat", "exp_in");
  await pick(page, "ostrich", "exp_out");
  const mid = await sv(page);
  const keptNow = await ev<{ quest: string; snap: { moves: number; placed: Record<string, string | null> } } | null>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null");
  await ev(page, "window.__HH__.saveReady()");
  await page.reload();
  await page.waitForFunction("window.__HH__ && window.__HH__.ready");
  const hubLabels = await ev<{ label: string; restart: number; flying: boolean; primary: string }>(page, "({ label: document.querySelector(\"button[data-quest='w09q1-al-jahiz']\").textContent, restart: [...document.querySelectorAll('.hub li.open button')].filter((b) => b.textContent === 'Start this quest again').length, flying: window.__HH__.resumed(), primary: document.querySelector('.hub button.primary').textContent })");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  const after = await sv(page);
  const shownValues = await ev<string[]>(page, "[...document.querySelectorAll('.bench select[data-item]')].map((s) => s.value)");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-sort-resumed.png"), fullPage: true });
  record("al-Jahiz's animal cards left in the middle are kept, the Atlas says Continue and offers a new start, and the cards stand where they were when the quest is opened again",
    mid.moves === 2 && keptNow?.quest === QUEST && keptNow.snap.moves === 2 && keptNow.snap.placed.bat === "exp_in" && /^Continue: /.test(hubLabels.label) && hubLabels.restart === 1 && !hubLabels.flying && /^Play: /.test(hubLabels.primary) &&
    after.placed.bat === "exp_in" && after.placed.ostrich === "exp_out" && after.placed.eagle === null && after.moves === 2 && shownValues.join() === ",,,exp_in,exp_out,,,",
    { mid, keptNow, hubLabels, after, shownValues });
  await ctx2.close();
  // The Challenge way of playing has five groups, each a phrase of the passage; a wrong showing says only that it is not yet his division.
  const ctx3 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await open(ctx3, "&style=challenge");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  const c0 = await ev<{ key: string[]; options: number; alt: string | null }>(page, "({ key: [...document.querySelectorAll('.bench ol.tray-key li')].map((l) => l.textContent), options: document.querySelector(\"select[data-item='bat']\").options.length, alt: document.querySelector('.bench canvas.sort-art').getAttribute('aria-label') })");
  const startC = await sv(page);
  for (const item of startC.items) await pick(page, item, item === "fly" ? "ch_talons" : startC.answer[item]!); // the fly in the wrong tray
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-sort-challenge.png"), fullPage: true });
  await page.getByRole("button", { name: "Show al-Jahiz" }).click();
  const cw = { v: await sv(page), said: await page.locator(".bench .ran").textContent() };
  await pick(page, "fly", "ch_wings");
  await page.getByRole("button", { name: "Show al-Jahiz" }).click();
  const cdone = await sv(page);
  record("al-Jahiz's Challenge cards have five groups in the key, each a phrase of the passage; a wrong showing says only that it is not yet his division and is counted; the right one ends it",
    c0.key.join("|") === "Tray 1: a bird of prey armed with talons|Tray 2: a bird of prey armed with a beak|Tray 3: counted among the birds, though it has no feathers|Tray 4: has feathers, but is not a bird|Tray 5: flies on two wings, but is not called a bird" && c0.options === 6 && /Trays: 5/.test(c0.alt ?? "") &&
    cw.v.shows === 1 && !cw.v.done && (cw.said ?? "").trim() === "This is not yet his division." && cdone.done && cdone.shows === 1,
    { c0, cw, cdone });
  await ctx3.close();
  // The page in Arabic runs right to left with Arabic numerals; the first tray and the first card are on the right, in the key and in a touch on the picture.
  const arCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const ar = await arCtx.newPage();
  ar.on("pageerror", (e) => errors.push(String(e)));
  await ar.goto(`${served.base}/games/hudhud/index.html?lang=ar&music=off&style=explorer`);
  await ar.waitForFunction("window.__HH__ && window.__HH__.ready");
  await leaveOpening(ar);
  await ar.locator(`.hub button[data-quest='${QUEST}']`).click();
  const a0 = await sv(ar);
  const arView = await ev<{ dir: string; heading: string; key: string[]; firstLabel: string; alt: string | null; keyTitle: string; show: string }>(ar, "({ dir: document.documentElement.dir, heading: document.querySelector('.bench h2').textContent, key: [...document.querySelectorAll('.bench ol.tray-key li')].map((l) => l.textContent), firstLabel: document.querySelector('.bench .places label > span').textContent, alt: document.querySelector('.bench canvas.sort-art').getAttribute('aria-label'), keyTitle: document.querySelector('.bench h3').textContent, show: [...document.querySelectorAll('.bench .row button.primary')].map((b) => b.textContent).join() })");
  if (outDir) await ar.screenshot({ path: resolve(outDir, "hudhud-sort-bench-ar.png"), fullPage: true });
  // Touch the first card (the right-most of the band) and then the first tray (the right-most of the two).
  await ar.mouse.click(...(await at(ar, a0, { card: "eagle" }, true)));
  const t1 = await sv(ar);
  await ar.mouse.click(...(await at(ar, t1, { tray: 0 }, true)));
  const t2 = await sv(ar);
  const trayX = trayRects(2, true).map((r) => r.x);
  record("al-Jahiz's animal cards in Arabic run right to left with Arabic numerals, put the first tray and the first card on the right in the picture and in a touch on it, and say the key in Arabic",
    arView.dir === "rtl" && arView.heading === "الجاحظ" && arView.key.join("|") === "الصينية ١: معدود في الطير|الصينية ٢: غير معدود في الطير" && arView.firstLabel === "أين توضع بطاقة العُقاب؟" && /٢/.test(arView.alt ?? "") && arView.keyTitle === "الصواني بالكلمات" && arView.show === "اعرض على الجاحظ" &&
    trayX[0]! > trayX[1]! && t1.selected === "eagle" && t2.placed.eagle === "exp_in" && t2.moves === 1 && t2.selected === null,
    { arView, t1: t1.selected, t2: { moves: t2.moves, placed: t2.placed.eagle }, trayX });
  await arCtx.close();
  // Opening any quest played on a page from a scrolled Atlas brings its heading into view at the top, with focus on it; and so does returning to the Atlas.
  const scrollCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  page = await open(scrollCtx, "&style=explorer");
  const scrolls: { quest: string; scrolledFrom: number; scrolledBack: number; inView: boolean; focused: boolean; atlasInView: boolean; atlasFocused: boolean }[] = [];
  for (const start of ["startClock", "startCipher", "startAlgebra", "startSheets", "startSort", "startPaper", "startRoute", "startCouple", "startCoffee", "startChannels", "startLeaves", "startCollate"]) {
    await ev(page, "window.scrollTo(0, document.body.scrollHeight)"); // the last world of the Atlas
    const scrolledFrom = await ev<number>(page, "window.scrollY");
    await ev(page, `window.__HH__.${start}()`);
    const here = await ev<{ inView: boolean; focused: boolean }>(page, "(() => { const h = document.querySelector('.bench h2'); const r = h.getBoundingClientRect(); return { inView: r.top >= 0 && r.bottom <= innerHeight, focused: document.activeElement === h }; })()");
    await ev(page, "window.scrollTo(0, document.body.scrollHeight)");
    const scrolledBack = await ev<number>(page, "window.scrollY");
    await ev(page, "window.__HH__.toAtlas()");
    const atlas = await ev<{ inView: boolean; focused: boolean }>(page, "(() => { const h = document.querySelector('.hub h2'); const r = h.getBoundingClientRect(); return { inView: r.top >= 0 && r.bottom <= innerHeight, focused: document.activeElement === h }; })()");
    scrolls.push({ quest: start, scrolledFrom, scrolledBack, inView: here.inView, focused: here.focused, atlasInView: atlas.inView, atlasFocused: atlas.focused });
  }
  record("opening any quest played on a page from the Atlas scrolled to its last world brings the quest's heading into view with focus on it, and returning to the Atlas does the same for its heading (all twelve page quests go through the one registry)",
    scrolls.length === 12 && scrolls.every((s) => s.scrolledFrom > 300 && s.inView && s.focused && s.atlasInView && s.atlasFocused), { scrolls });
  await scrollCtx.close();
}
// The seventh quest, the paper of Samarkand: a list of choices for every place, a wrong row that stops and says what
// reached the place where it stopped (Story says what the place needs, Challenge only where it stopped), both questions,
// the child answered kindly, the feather, one exchange by two touches on the picture, the rest by the lists, four goals,
// the links, and the Atlas counts it (world 10 is open). Then one card moved, the page loaded again, and "Continue"; and
// the page in Arabic, with the row from the right.
{
  const QUEST = "w10q5-samarqand";
  type PaperView = { moves: number; par: number; flags: string[]; done: boolean; places: string[]; selected: number | null; status: string; busy: boolean; runs: number };
  const pv = (page: Page) => ev<PaperView>(page, "(() => { const a = window.__HH__.paper(); return { moves: a.moves, par: a.par, flags: a.flags, done: a.done, places: a.puzzle.places, selected: a.selected, status: a.status, busy: a.busy, runs: a.runs }; })()");
  /** The middle of a place in the picture's space, turned into where to click on the canvas. */
  const at = async (page: Page, i: number, n: number, rtl: boolean): Promise<[number, number]> => {
    await page.locator(".bench canvas.paper-art").scrollIntoViewIfNeeded();
    const box = (await page.locator(".bench canvas.paper-art").boundingBox())!;
    return [box.x + (placeX(n, i, rtl) / PAPER_ART.w) * box.width, box.y + (PAPER_ART.y / PAPER_ART.h) * box.height];
  };
  const idle = (page: Page) => page.waitForFunction("window.__HH__.paper() && !window.__HH__.paper().busy");
  const pick = (page: Page, place: number, card: string) => page.locator(`.bench select[data-place='${place}']`).selectOption(card);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  let page = await open(ctx, "&style=explorer");
  const button = page.locator(`.hub button[data-quest='${QUEST}']`);
  const isPlain = await button.evaluate((b) => !b.classList.contains("primary"));
  const label = await button.textContent();
  const hubNote = await ev<string>(page, "[...document.querySelectorAll('.hub p.small')].map((p) => p.textContent).join(' | ')");
  await button.click();
  await page.waitForFunction("window.__HH__.paper() !== null");
  const heading = await page.locator(".bench h2").textContent();
  const page1 = await ev<{ selects: number; labels: string[]; options: string[]; alt: string | null; role: string | null; inline: number; trial: boolean; live: string | null; focus: string; sized: boolean; go: boolean; places: string[] }>(page, "(() => ({ selects: document.querySelectorAll('.bench select[data-place]').length, labels: [...document.querySelectorAll('.bench .places label > span')].map((s) => s.textContent.trim()), options: [...document.querySelector(\"select[data-place='0']\").options].map((o) => o.textContent), alt: document.querySelector('.bench canvas.paper-art').getAttribute('aria-label'), role: document.querySelector('.bench canvas.paper-art').getAttribute('role'), inline: document.querySelectorAll('.bench [style]:not(canvas)').length, trial: /first trial/.test(document.querySelector('.bench').textContent), live: document.querySelector('.bench .ran').getAttribute('aria-live'), focus: document.activeElement.tagName, sized: [...document.querySelectorAll('.bench select[data-place]')].every((s) => s.getBoundingClientRect().height >= 44), go: [...document.querySelectorAll('.bench button')].some((b) => b.textContent === 'Make a sheet'), places: window.__HH__.paper().puzzle.places }))()");
  // A wrong row: the cut card is put first (two cards change places), and the row stops at the second place.
  await pick(page, 0, "cut");
  await page.getByRole("button", { name: "Make a sheet" }).click();
  await idle(page);
  const wrong = { v: await pv(page), said: (await page.locator(".bench .ran").textContent()) ?? "" };
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-paper-bench.png"), fullPage: true });
  // Both questions; the child, kindly; the feather.
  await page.getByRole("button", { name: "Ask about the old report" }).click();
  const said1 = (await page.locator(".bench .said").textContent()) ?? "";
  await page.getByRole("button", { name: "Ask how paper was made" }).click();
  const said2 = (await page.locator(".bench .said").textContent()) ?? "";
  await page.getByRole("button", { name: "Talk to the child who helps" }).click();
  await page.getByRole("button", { name: "It is all right. We will put them in order together." }).click();
  await page.getByRole("button", { name: "Look in the mould" }).click();
  const asked = await pv(page);
  // The second place gets the joined card by a list, and the last two places are exchanged by two touches on the picture.
  await pick(page, 1, "clean-bleach");
  const chosenFrom = await pv(page);
  await page.mouse.click(...(await at(page, 4, 7, false)));
  const chose = await pv(page);
  await page.mouse.click(...(await at(page, 6, 7, false)));
  const moved = await pv(page);
  const selectValues = await ev<string[]>(page, "[...document.querySelectorAll('.bench select[data-place]')].map((s) => s.value)");
  await page.getByRole("button", { name: "Make a sheet" }).click();
  await page.waitForSelector(".bench .results:not([hidden])");
  const end = await ev<{ done: boolean; moves: number; par: number; met: number; focus: string; links: string[]; pending: string; saved: boolean; resume: unknown; notes: number; disabled: boolean; ran: string }>(page, "({ done: window.__HH__.paper().done, moves: window.__HH__.paper().moves, par: window.__HH__.paper().par, met: document.querySelectorAll('.bench .results .goals .met').length, focus: document.activeElement ? document.activeElement.textContent : '', links: [...document.querySelectorAll('.bench .results a')].map((a) => a.getAttribute('href')), pending: document.querySelector('.bench .results .pending').textContent, saved: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.quests?.['w10q5-samarqand']?.done === true, resume: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null, notes: document.querySelectorAll('.bench .results .note p').length, disabled: [...document.querySelectorAll('.bench select[data-place]')].every((x) => x.disabled), ran: document.querySelector('.bench .ran').textContent })");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-paper-results.png"), fullPage: true });
  await page.getByRole("button", { name: "Back to the Atlas" }).last().click();
  const back = await ev<{ progress: string; label: string; benchHidden: boolean; primary: string; open: number; headingInView: boolean; focus: string }>(page, "(() => { const h = document.querySelector('.hub h2'); const r = h.getBoundingClientRect(); return { progress: document.querySelector('.hub .progress').textContent, label: document.querySelector(\"button[data-quest='w10q5-samarqand']\").textContent, benchHidden: document.querySelector('.bench').hidden, primary: document.querySelector('.hub button.primary').textContent, open: document.querySelectorAll('.hub .world li.open').length, headingInView: r.top >= 0 && r.bottom <= innerHeight, focus: document.activeElement === h ? 'H2' : document.activeElement.tagName }; })()");
  const picture = await ev<{ home: number[]; open: number[] }>(page, "window.__HH__.atlasPicture()");
  const slotKept = await ev<string | null>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.quests?.['w10q5-samarqand'] ? 'recorded' : null");
  record("the paper of Samarkand can be played with the page's own controls: a list of choices for every place, a wrong row stops and says what reached the place where it stopped, both questions, the child, the feather, an exchange by two touches on the picture, four goals, the links, and the Atlas counts it with world 10 open",
    isPlain && /^Play: /.test(label ?? "") && /Thirteen quests are built/.test(hubNote) && heading === "Samarqand" && page1.selects === 7 && page1.labels.join("|") === "Place 1|Place 2|Place 3|Place 4|Place 5|Place 6|Place 7" && page1.options.length === 7 && page1.options.includes("Cut the rags small") && page1.options.includes("Clean and bleach the pieces") &&
    page1.role === "img" && /7 places in a row/.test(page1.alt ?? "") && page1.live === "polite" && page1.inline === 0 && page1.trial && page1.sized && page1.go && page1.focus === "H2" && page1.places.join() === "clean-bleach,pound,cut,size,polish,dry,lift" &&
    !wrong.v.done && wrong.v.runs === 1 && wrong.v.moves === 1 && wrong.v.busy === false && /The rags are cut into small pieces\./.test(wrong.said) && /The card in place 2 cannot take what reached it\. The work stops there\./.test(wrong.said) && /What reached it: rags cut small\./.test(wrong.said) && !/This place needs/.test(wrong.said) &&
    /The record gives the way it was made/.test(said2) && /report handed down, not a proved beginning/.test(said1) && asked.flags.slice().sort().join() === "answered,askedHow,askedStory,feather,kind" &&
    chosenFrom.moves === 2 && chose.selected === 4 && /Place 5 is chosen/.test(chose.status) && moved.selected === null && moved.moves === 3 && moved.places.join() === "cut,clean-bleach,pound,size,lift,dry,polish" && selectValues.join() === "cut,clean-bleach,pound,size,lift,dry,polish" &&
    end.done && end.moves === 3 && end.par === 3 && end.met === 4 && end.focus === "The page is home" && end.saved && end.resume === null && end.notes === 6 && end.disabled && /sheet is made, and it is smooth/.test(end.ran) &&
    end.links.join() === "https://islam.museum/en/invention/paper-mill-samarkand/,https://islam.museum/en/place/samarqand/" && /Historical review pending/.test(end.pending) &&
    /\D1\D/.test(` ${back.progress} `) && /^Play again: /.test(back.label) && back.benchHidden && /Ibn al-Haytham/.test(back.primary) && back.open === 13 && picture.open.join() === "1,2,3,4,5,6,7,8,9,10" && picture.home[9] === 1 && slotKept === "recorded" && back.headingInView && back.focus === "H2",
    { label, isPlain, heading, page1, wrong, said1: said1.slice(-160), said2: said2.slice(-160), asked, chosenFrom, chose, moved, selectValues, end, back, picture, hubNote });
  await ctx.close();
  // Left in the middle: one card moved and a question asked, the page loaded again, and the Atlas says Continue; the row and the question are where they were.
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await open(ctx2, "&style=explorer");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  await pick(page, 0, "cut");
  await page.getByRole("button", { name: "Ask how paper was made" }).click();
  const mid = await pv(page);
  const keptNow = await ev<{ quest: string; snap: { moves: number; places: string[]; flags: string[] } } | null>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null");
  await ev(page, "window.__HH__.saveReady()");
  await page.reload();
  await page.waitForFunction("window.__HH__ && window.__HH__.ready");
  const hubLabels = await ev<{ label: string; restart: number; flying: boolean; primary: string }>(page, "({ label: document.querySelector(\"button[data-quest='w10q5-samarqand']\").textContent, restart: [...document.querySelectorAll('.hub li.open button')].filter((b) => b.textContent === 'Start this quest again').length, flying: window.__HH__.resumed(), primary: document.querySelector('.hub button.primary').textContent })");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  const after = await pv(page);
  const shownValues = await ev<string[]>(page, "[...document.querySelectorAll('.bench select[data-place]')].map((s) => s.value)");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-paper-resumed.png"), fullPage: true });
  record("the paper of Samarkand left in the middle is kept, the Atlas says Continue and offers a new start, and the row stands where it was when the quest is opened again",
    mid.moves === 1 && keptNow?.quest === QUEST && keptNow.snap.moves === 1 && keptNow.snap.places.join() === "cut,pound,clean-bleach,size,polish,dry,lift" && keptNow.snap.flags.join() === "askedHow" && /^Continue: /.test(hubLabels.label) && hubLabels.restart === 1 && !hubLabels.flying && /^Play: /.test(hubLabels.primary) &&
    after.moves === 1 && after.flags.join() === "askedHow" && after.done === false && shownValues.join() === "cut,pound,clean-bleach,size,polish,dry,lift",
    { mid, keptNow, hubLabels, after, shownValues });
  await ctx2.close();
  // The three ways of playing explain a failed run differently: Story says what the place needs, Challenge only where it stopped.
  const ctx3 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const failed: Record<string, { places: number; selects: number; said: string; at: number }> = {};
  for (const style of ["story", "challenge"]) {
    page = await open(ctx3, `&style=${style}`);
    await page.locator(`.hub button[data-quest='${QUEST}']`).click();
    await page.getByRole("button", { name: "Make a sheet" }).click();
    await idle(page);
    failed[style] = await ev<{ places: number; selects: number; said: string; at: number }>(page, "({ places: window.__HH__.paper().puzzle.places.length, selects: document.querySelectorAll('.bench select[data-place]').length, said: document.querySelector('.bench .ran').textContent, at: window.__HH__.paper().last.at })");
    if (outDir && style === "challenge") await page.screenshot({ path: resolve(outDir, "hudhud-paper-challenge.png"), fullPage: true });
    await page.close();
  }
  record("the paper of Samarkand has five places in Story, which says what the place needs, and eight in Challenge, which says only where the work stopped",
    failed.story!.places === 5 && failed.story!.selects === 5 && failed.story!.at === 0 && /The card in place 1 cannot take what reached it\. The work stops there\./.test(failed.story!.said) && /This place needs the card that takes: worn-out rags\./.test(failed.story!.said) && !/What reached it/.test(failed.story!.said) &&
    failed.challenge!.places === 8 && failed.challenge!.selects === 8 && failed.challenge!.at === 0 && failed.challenge!.said.trim() === "The card in place 1 cannot take what reached it. The work stops there.",
    failed);
  await ctx3.close();
  // The page in Arabic runs right to left with Arabic numerals; the first place is on the right, in the list and in a touch on the picture.
  const arCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const ar = await arCtx.newPage();
  ar.on("pageerror", (e) => errors.push(String(e)));
  await ar.goto(`${served.base}/games/hudhud/index.html?lang=ar&music=off&style=explorer`);
  await ar.waitForFunction("window.__HH__ && window.__HH__.ready");
  await leaveOpening(ar);
  await ar.locator(`.hub button[data-quest='${QUEST}']`).click();
  const a0 = await pv(ar);
  const arView = await ev<{ dir: string; heading: string; firstLabel: string; alt: string | null; go: string; first: string }>(ar, "({ dir: document.documentElement.dir, heading: document.querySelector('.bench h2').textContent, firstLabel: document.querySelector('.bench .places label > span').textContent.trim(), alt: document.querySelector('.bench canvas.paper-art').getAttribute('aria-label'), go: [...document.querySelectorAll('.bench .row button.primary, .bench p button.primary')].map((b) => b.textContent).join(), first: document.querySelector(\"select[data-place='0'] option:checked\").textContent })");
  if (outDir) await ar.screenshot({ path: resolve(outDir, "hudhud-paper-bench-ar.png"), fullPage: true });
  // Touch the first place (the right-most) and then the third (the third from the right): the two cards change places.
  await ar.mouse.click(...(await at(ar, 0, 7, true)));
  const t1 = await pv(ar);
  await ar.mouse.click(...(await at(ar, 2, 7, true)));
  const t2 = await pv(ar);
  record("the paper of Samarkand in Arabic runs right to left with Arabic numerals, puts the first place on the right in the picture and in a touch on it, and says the steps in Arabic",
    arView.dir === "rtl" && arView.heading === "سمرقند" && arView.firstLabel === "المكان ١" && /٧/.test(arView.alt ?? "") && arView.go === "اصنع ورقة" && arView.first === "نظّف القطع وبيّضها" &&
    placeX(7, 0, true) > placeX(7, 6, true) && t1.selected === 0 && t2.selected === null && t2.moves === 1 && t2.places[0] === a0.places[2] && t2.places[2] === a0.places[0],
    { arView, a0: a0.places, t1: t1.selected, t2: { moves: t2.moves, places: t2.places } });
  await arCtx.close();
}
// The eighth quest, Ibn Battuta and the thread of the road: one bead for every stop of a stage, in the ring's own order and
// not the road's; the stage's sentence in words (always in Story, hidden once the thread begins in Explorer and Challenge);
// a wrong bead that is a slip and says so; both questions, the child answered kindly, the feather; a bead pressed by a click
// on the picture; four goals; the links; and the Atlas counts it (world 6 is open). Then the page loaded again and
// "Continue"; one Challenge page where a wrong stop sends the thread back and Baghdad is threaded twice; the Story page,
// which never hides its sentence; and the page in Arabic with the ring mirrored.
{
  const QUEST = "w06q1-ibn-battuta";
  type RouteView = { at: number; slips: number; showing: boolean; flags: string[]; done: boolean; last: { stop: string; right: boolean } | null; sentence: string; status: string; stops: string[] };
  const rv = (page: Page) => ev<RouteView>(page, "(() => { const a = window.__HH__.route(); return { at: a.at, slips: a.slips, showing: a.showing, flags: a.flags, done: a.done, last: a.last, sentence: a.sentence, status: a.status, stops: a.stage.stops }; })()");
  /** The middle of bead `i` of `n` in the picture's space, turned into where to click on the canvas. */
  const at = async (page: Page, i: number, n: number, rtl: boolean): Promise<[number, number]> => {
    await page.locator(".bench canvas.route-art").scrollIntoViewIfNeeded();
    const box = (await page.locator(".bench canvas.route-art").boundingBox())!;
    const p = beadPos(n, i, rtl);
    return [box.x + (p.x / ROUTE_ART.w) * box.width, box.y + (p.y / ROUTE_ART.h) * box.height];
  };
  const bead = (page: Page, stop: string) => page.locator(`.bench .route-beads button[data-stop='${stop}']`);
  const ranText = (page: Page) => ev<string>(page, "document.querySelector('.bench .ran').textContent");
  const sentenceText = (page: Page) => ev<string>(page, "document.querySelector('.bench .stage-text').textContent");
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  let page = await open(ctx, "&style=explorer");
  const button = page.locator(`.hub button[data-quest='${QUEST}']`);
  const isPlain = await button.evaluate((b) => !b.classList.contains("primary"));
  const label = await button.textContent();
  const hubNote = await ev<string>(page, "[...document.querySelectorAll('.hub p.small')].map((p) => p.textContent).join(' | ')");
  await button.click();
  await page.waitForFunction("window.__HH__.route() !== null");
  const heading = await page.locator(".bench h2").textContent();
  const page1 = await ev<{ beads: string[]; alt: string | null; role: string | null; inline: number; trial: boolean; live: string[]; focus: string; sized: boolean; peek: { hidden: boolean; disabled: boolean }; show: string; canvasText: boolean }>(page, "(() => ({ beads: [...document.querySelectorAll('.bench .route-beads button')].map((b) => b.textContent), alt: document.querySelector('.bench canvas.route-art').getAttribute('aria-label'), role: document.querySelector('.bench canvas.route-art').getAttribute('role'), inline: document.querySelectorAll('.bench [style]:not(canvas)').length, trial: /first trial/.test(document.querySelector('.bench').textContent), live: [...document.querySelectorAll('.bench [aria-live]')].map((e) => e.getAttribute('aria-live')), focus: document.activeElement.tagName, sized: [...document.querySelectorAll('.bench .route-beads button')].every((b) => b.getBoundingClientRect().height >= 44), peek: { hidden: [...document.querySelectorAll('.bench button')].find((b) => b.textContent === 'Show the stage again').hidden, disabled: [...document.querySelectorAll('.bench button')].find((b) => b.textContent === 'Show the stage again').disabled }, show: document.querySelector('.bench .stage-text').textContent, canvasText: false }))()");
  const first = await rv(page);
  // The first right stop hides the sentence and says so; a wrong bead is a slip and says only that it is not the next stop.
  await bead(page, "red-sea").click();
  const afterFirst = { v: await rv(page), ran: await ranText(page), sentence: await sentenceText(page), label: (await bead(page, "red-sea").textContent()) ?? "", on: await bead(page, "red-sea").evaluate((b) => b.classList.contains("on")) };
  await bead(page, "oman").click();
  const wrong = { v: await rv(page), ran: await ranText(page) };
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-route-bench.png"), fullPage: true });
  // Showing the stage again is free in Explorer.
  await page.getByRole("button", { name: "Show the stage again" }).click();
  const shownAgain = { v: await rv(page), sentence: await sentenceText(page) };
  // Both questions; the child, kindly; the feather.
  await page.getByRole("button", { name: "Ask when he set out" }).click();
  const said1 = (await page.locator(".bench .said").last().textContent()) ?? "";
  await page.getByRole("button", { name: "Ask who wrote his journey down" }).click();
  const said2 = (await page.locator(".bench .said").last().textContent()) ?? "";
  await page.getByRole("button", { name: "Talk to the child with the camel" }).click();
  await page.getByRole("button", { name: "Do not be afraid. We will follow the thread together." }).click();
  await page.getByRole("button", { name: "Look in the saddlebag" }).click();
  const asked = await rv(page);
  // The rest of the road: Yemen by a button, Aden by a click on the picture (the eighth bead of the ring), then the rest by buttons.
  await bead(page, "yemen").click();
  await page.mouse.click(...(await at(page, 7, 8, false)));
  const byPicture = await rv(page);
  for (const stop of ["zayla", "mogadishu", "east-africa-ports", "oman"]) await bead(page, stop).click();
  const nearEnd = await rv(page);
  await bead(page, "persian-gulf").click();
  await page.waitForSelector(".bench .results:not([hidden])");
  const end = await ev<{ done: boolean; at: number; slips: number; met: number; focus: string; links: string[]; pending: string; saved: boolean; resume: unknown; notes: number; disabled: boolean; ran: string; goals: string[] }>(page, "({ done: window.__HH__.route().done, at: window.__HH__.route().at, slips: window.__HH__.route().slips, met: document.querySelectorAll('.bench .results .goals .met').length, focus: document.activeElement ? document.activeElement.textContent : '', links: [...document.querySelectorAll('.bench .results a')].map((a) => a.getAttribute('href')), pending: document.querySelector('.bench .results .pending').textContent, saved: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.quests?.['w06q1-ibn-battuta']?.done === true, resume: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null, notes: document.querySelectorAll('.bench .results .note p').length, disabled: [...document.querySelectorAll('.bench .route-beads button')].every((x) => x.disabled), ran: document.querySelector('.bench .ran').textContent, goals: [...document.querySelectorAll('.bench .results .goals li')].map((l) => l.textContent) })");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-route-results.png"), fullPage: true });
  await page.getByRole("button", { name: "Back to the Atlas" }).last().click();
  const back = await ev<{ progress: string; label: string; benchHidden: boolean; primary: string; open: number; headingInView: boolean; focus: string }>(page, "(() => { const h = document.querySelector('.hub h2'); const r = h.getBoundingClientRect(); return { progress: document.querySelector('.hub .progress').textContent, label: document.querySelector(\"button[data-quest='w06q1-ibn-battuta']\").textContent, benchHidden: document.querySelector('.bench').hidden, primary: document.querySelector('.hub button.primary').textContent, open: document.querySelectorAll('.hub .world li.open').length, headingInView: r.top >= 0 && r.bottom <= innerHeight, focus: document.activeElement === h ? 'H2' : document.activeElement.tagName }; })()");
  const picture = await ev<{ home: number[]; open: number[] }>(page, "window.__HH__.atlasPicture()");
  const slotKept = await ev<string | null>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.quests?.['w06q1-ibn-battuta'] ? 'recorded' : null");
  const worldSix = await ev<string>(page, "[...document.querySelectorAll('.hub .world')][5].textContent");
  record("Ibn Battuta's thread can be played with the page's own controls: a button for every bead in the ring's order (not the road's), the stage's sentence in a polite live region that is hidden after the first right stop and shown again for nothing, a wrong bead is a slip that says only that it is not the next stop, both questions, the child, the feather, a bead pressed by a click on the picture, four goals, the three links, and the Atlas counts it with world 6 open",
    isPlain && /^Play: Ibn Battuta$/.test(label ?? "") && /Thirteen quests are built/.test(hubNote) && heading === "Ibn Battuta" &&
    page1.beads.length === 8 && page1.beads.join("|") === "Bead 1: Mogadishu|Bead 2: the Gulf|Bead 3: Yemen|Bead 4: Oman|Bead 5: Red Sea|Bead 6: Zayla|Bead 7: Ports of East Africa|Bead 8: Aden" &&
    page1.role === "img" && /8 beads/.test(page1.alt ?? "") && /not a map/.test(page1.alt ?? "") && /Stops threaded: 0 of 8/.test(page1.alt ?? "") && page1.live.length >= 3 && page1.live.every((l) => l === "polite") && page1.inline === 0 && page1.trial && page1.sized && page1.focus === "H2" &&
    /He went down the Red Sea to Yemen and Aden/.test(page1.show) && page1.peek.hidden === false && page1.peek.disabled === true && first.showing && first.at === 0 && first.stops.join() === "mogadishu,persian-gulf,yemen,oman,red-sea,zayla,east-africa-ports,aden" &&
    afterFirst.v.at === 1 && !afterFirst.v.showing && afterFirst.sentence === "The sentence of the stage is hidden." && afterFirst.ran === "The thread reaches Red Sea." && /already on the thread/.test(afterFirst.label) && afterFirst.on &&
    wrong.v.at === 1 && wrong.v.slips === 1 && wrong.v.last?.right === false && wrong.ran === "That is not the next stop." && !/next stop is/.test(wrong.ran) &&
    shownAgain.v.showing && shownAgain.v.slips === 1 && /He went down the Red Sea/.test(shownAgain.sentence) &&
    /Ibn Battuta left Tangier on Thursday the second of Rajab in the year 725/.test(said1) && /Sultan Abu Inan ordered it written, Ibn Battuta dictated it, and Ibn Juzayy edited it/.test(said2) && asked.flags.slice().sort().join() === "answered,askedLeft,askedWritten,feather,kind" &&
    byPicture.at === 3 && byPicture.last?.stop === "aden" && byPicture.last.right && nearEnd.at === 7 && !nearEnd.done &&
    end.done && end.at === 8 && end.slips === 1 && end.met === 4 && end.focus === "The page is home" && end.saved && end.resume === null && end.notes === 7 && end.disabled && /The thread has reached the last stop of the stage\./.test(end.ran) &&
    end.links.join() === "https://islam.museum/en/person/ibn-battuta-muhammad/,https://islam.museum/en/work/rihla-ibn-battuta/,https://islam.museum/en/question/credibility-of-ibn-battuta/" && /Historical review pending/.test(end.pending) &&
    /\D1\D/.test(` ${back.progress} `) && /^Play again: /.test(back.label) && back.benchHidden && /Ibn al-Haytham/.test(back.primary) && back.open === 13 && picture.open.join() === "1,2,3,4,5,6,7,8,9,10" && picture.home[5] === 1 && slotKept === "recorded" && /Play again: Ibn Battuta/.test(worldSix) && back.headingInView && back.focus === "H2",
    { label, isPlain, heading, page1, first, afterFirst, wrong, shownAgain, said1: said1.slice(-160), said2: said2.slice(-160), asked, byPicture, nearEnd, end, back, picture, hubNote });
  await ctx.close();
  // Left in the middle: two stops threaded and a question asked, the page loaded again, and the Atlas says Continue; the thread and the question are where they were, and the sentence is still hidden.
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await open(ctx2, "&style=explorer");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  await bead(page, "red-sea").click();
  await bead(page, "yemen").click();
  await page.getByRole("button", { name: "Ask when he set out" }).click();
  const mid = await rv(page);
  const keptNow = await ev<{ quest: string; snap: { at: number; slips: number; flags: string[]; style: string } } | null>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null");
  await ev(page, "window.__HH__.saveReady()");
  await page.reload();
  await page.waitForFunction("window.__HH__ && window.__HH__.ready");
  const hubLabels = await ev<{ label: string; restart: number; flying: boolean; primary: string }>(page, "({ label: document.querySelector(\"button[data-quest='w06q1-ibn-battuta']\").textContent, restart: [...document.querySelectorAll('.hub li.open button')].filter((b) => b.textContent === 'Start this quest again').length, flying: window.__HH__.resumed(), primary: document.querySelector('.hub button.primary').textContent })");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  const after = await rv(page);
  const onThread = await ev<string[]>(page, "[...document.querySelectorAll('.bench .route-beads button.on')].map((b) => b.dataset.stop)");
  const hiddenNow = await sentenceText(page);
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-route-resumed.png"), fullPage: true });
  record("Ibn Battuta's thread left in the middle is kept, the Atlas says Continue and offers a new start, and the thread stands where it was, with the sentence still hidden, when the quest is opened again",
    mid.at === 2 && keptNow?.quest === QUEST && keptNow.snap.at === 2 && keptNow.snap.slips === 0 && keptNow.snap.flags.join() === "askedLeft" && keptNow.snap.style === "explorer" && Object.keys(keptNow.snap).sort().join() === "at,flags,slips,style" &&
    /^Continue: /.test(hubLabels.label) && hubLabels.restart === 1 && !hubLabels.flying && /^Play: /.test(hubLabels.primary) &&
    after.at === 2 && after.flags.join() === "askedLeft" && !after.done && !after.showing && onThread.join() === "yemen,red-sea" && hiddenNow === "The sentence of the stage is hidden.",
    { mid, keptNow, hubLabels, after, onThread, hiddenNow });
  await ctx2.close();
  // Story never hides the sentence and says which stop is next; Challenge shows it before the first step, hides it once the thread begins, counts showing it again as a slip, and sends the thread back to the start on a wrong stop; Baghdad is threaded twice.
  const ctx3 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await open(ctx3, "&style=story");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  await bead(page, "tangier").click();
  await bead(page, "egypt").click();
  const story = { v: await rv(page), ran: await ranText(page), sentence: await sentenceText(page), peekHidden: await ev<boolean>(page, "[...document.querySelectorAll('.bench button')].find((b) => b.textContent === 'Show the stage again').hidden"), beads: await ev<number>(page, "document.querySelectorAll('.bench .route-beads button').length") };
  await ctx3.close();
  const ctx4 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await open(ctx4, "&style=challenge");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  const c0 = { v: await rv(page), sentence: await sentenceText(page), note: await ev<boolean>(page, "!document.querySelector('.bench .small:not([hidden])') ? false : [...document.querySelectorAll('.bench p.small')].some((p) => /counts as a slip/.test(p.textContent) && !p.hidden)"), beadNames: await ev<string[]>(page, "[...document.querySelectorAll('.bench .route-beads button')].map((b) => b.textContent)") };
  await bead(page, "mecca").click();
  const c1 = { v: await rv(page), sentence: await sentenceText(page) };
  await page.getByRole("button", { name: "Show the stage again" }).click();
  const c2 = { v: await rv(page), sentence: await sentenceText(page), ran: await ranText(page) };
  await bead(page, "iraq").click();
  await bead(page, "khuzistan").click();
  await bead(page, "fars").click();
  await bead(page, "tabriz").click(); // wrong: Jibal is next
  const c3 = { v: await rv(page), ran: await ranText(page), hidden: await sentenceText(page) };
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-route-challenge.png"), fullPage: true });
  for (const stop of ["mecca", "iraq", "khuzistan", "fars", "jibal", "tabriz", "baghdad"]) await bead(page, stop).click();
  const c4 = { v: await rv(page), baghdadOn: await bead(page, "baghdad").evaluate((b) => b.classList.contains("on")), baghdadLabel: (await bead(page, "baghdad").textContent()) ?? "" };
  await bead(page, "samarra").click();
  await bead(page, "mosul").click();
  await bead(page, "baghdad").click();
  await page.waitForSelector(".bench .results:not([hidden])");
  const c5 = await ev<{ v: boolean; at: number; slips: number; met: string[] }>(page, "({ v: window.__HH__.route().done, at: window.__HH__.route().at, slips: window.__HH__.route().slips, met: [...document.querySelectorAll('.bench .results .goals li')].map((l) => l.querySelector('.met') ? 'met' : 'open') })");
  record("Ibn Battuta's Story page never hides its sentence and says which stop is next; the Challenge page shows its sentence before the first step and hides it once the thread begins, counts showing it again as a slip, sends the thread back to the start on a wrong stop (and says so), and threads Baghdad twice",
    story.v.at === 1 && story.v.slips === 1 && story.sentence.includes("He left Tangier and crossed North Africa") && story.peekHidden && story.beads === 7 &&
    story.v.last?.right === false && story.ran === "That is not the next stop. The next stop is North Africa." &&
    c0.v.showing && /He left Mecca and went through Iraq/.test(c0.sentence) && c0.beadNames.length === 9 && c0.beadNames[5] === "Bead 6: Baghdad" &&
    !c1.v.showing && c1.sentence === "The sentence of the stage is hidden." && c2.v.showing && c2.v.slips === 1 && c2.v.at === 1 && /He left Mecca/.test(c2.sentence) && c2.ran === "The stage is shown again. That counts as a slip." &&
    c3.v.at === 0 && c3.v.slips === 2 && c3.ran === "That is not the next stop. The thread goes back to the start." && c3.hidden === "The sentence of the stage is hidden." && c3.v.last?.right === false &&
    c4.v.at === 7 && c4.baghdadOn && /already on the thread/.test(c4.baghdadLabel) && !c4.v.done &&
    c5.v && c5.at === 10 && c5.slips === 2 && c5.met.join() === "open,open,open,open",
    { story, c0, c1, c2, c3, c4, c5 });
  await ctx4.close();
  // The page in Arabic runs right to left with Arabic numerals; the ring is mirrored (the first bead stays at the top, the next goes to the left), the list of beads keeps the ring's order, and a click on the mirrored picture reaches the bead under it.
  const arCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const ar = await arCtx.newPage();
  ar.on("pageerror", (e) => errors.push(String(e)));
  await ar.goto(`${served.base}/games/hudhud/index.html?lang=ar&music=off&style=explorer`);
  await ar.waitForFunction("window.__HH__ && window.__HH__.ready");
  await leaveOpening(ar);
  await ar.locator(`.hub button[data-quest='${QUEST}']`).click();
  const a0 = await rv(ar);
  const arView = await ev<{ dir: string; heading: string; first: string; alt: string | null; sentence: string; show: string }>(ar, "({ dir: document.documentElement.dir, heading: document.querySelector('.bench h2').textContent, first: document.querySelector('.bench .route-beads button').textContent, alt: document.querySelector('.bench canvas.route-art').getAttribute('aria-label'), sentence: document.querySelector('.bench .stage-text').textContent, show: [...document.querySelectorAll('.bench button')].map((b) => b.textContent).find((x) => /أظهر المرحلة/.test(x)) })");
  if (outDir) await ar.screenshot({ path: resolve(outDir, "hudhud-route-bench-ar.png"), fullPage: true });
  // Touch the third bead of the ring (Yemen) where the mirrored ring has it: a slip, as Red Sea is next. The same point on the unmirrored ring is another bead.
  await ar.mouse.click(...(await at(ar, 2, 8, true)));
  const t1 = await rv(ar);
  record("Ibn Battuta's thread in Arabic runs right to left with Arabic numerals, mirrors the ring in the picture and in a touch on it, keeps the list of beads in the ring's order, and says the stage in Arabic",
    arView.dir === "rtl" && arView.heading === "ابن بطوطة" && arView.first === "الخرزة ١: مقديشو" && /٨/.test(arView.alt ?? "") && /ليست خريطة/.test(arView.alt ?? "") && /^نزل في البحر الأحمر إلى اليمن وعدن/.test(arView.sentence.replace(/^[^:]*: /, "")) && /أظهر المرحلة مرة أخرى/.test(arView.show ?? "") &&
    beadPos(8, 1, true).x < beadPos(8, 0, true).x && beadPos(8, 1, false).x > beadPos(8, 0, false).x && a0.stops[2] === "yemen" && t1.last?.stop === "yemen" && t1.last.right === false && t1.slips === 1 && t1.at === 0,
    { arView, a0: a0.stops, t1: { last: t1.last, slips: t1.slips, at: t1.at } });
  await arCtx.close();
}
// The ninth quest, al-Tusi and the two circles: groups of radio buttons with visible labels for what can be chosen (the
// direction and the speed in Explorer), a button that turns the circles, a turning that is shown and can be skipped, a
// wrong setting that is counted and named by its shape, both questions (neither answer gives the model away), the girl
// answered kindly, the feather, the line found with the keyboard only, four goals, the note with the model's sentence,
// the links, and the Atlas counting it (world 1 is open). Then the page loaded again and "Continue" (and a saved setting
// that is the answer comes back not yet turned); Story with one choice; Challenge with its eighteen settings; one run
// with reduced motion set in the game's own settings; and the page in Arabic, where the picture is not mirrored.
{
  const QUEST = "w01q3-al-tusi";
  type CoupleView = { setting: { r: number; k: number; d: number }; misses: number; turned: number; flags: string[]; done: boolean; last: { setting: { r: number; k: number; d: number }; shape: { kind: string; lobes: number; crossings: number } } | null; busy: boolean; status: string };
  const cv = (page: Page) => ev<CoupleView>(page, "(() => { const a = window.__HH__.couple(); return { setting: a.setting, misses: a.misses, turned: a.turned, flags: a.flags, done: a.done, last: a.last, busy: a.busy, status: a.status }; })()");
  const turnBtn = (page: Page) => page.getByRole("button", { name: /^(Turn the circles|أدِر الدائرتين)$/ });
  const idle = (page: Page) => page.waitForFunction("window.__HH__.couple().busy === false", undefined, { timeout: 15000 });
  const ranText = (page: Page) => ev<string>(page, "document.querySelector('.bench .ran').textContent");
  const picture = (page: Page) => ev<string>(page, "document.querySelector('.bench canvas.couple-art').toDataURL()");
  const alt = (page: Page) => ev<string>(page, "document.querySelector('.bench canvas.couple-art').getAttribute('aria-label')");
  const radio = (page: Page, field: string, value: number) => page.locator(`.bench input[name='couple-${field}'][data-value='${value}']`);
  // Since 27 November 2026 al-Tusi's scene is played in his observatory, a room; `room=off` keeps these checks on the two circles' page, which stays as the way they are played without WebGL.
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  let page = await open(ctx, "&style=explorer&room=off");
  const button = page.locator(`.hub button[data-quest='${QUEST}']`);
  const isPlain = await button.evaluate((b) => !b.classList.contains("primary"));
  const label = await button.textContent();
  const hubNote = await ev<string>(page, "[...document.querySelectorAll('.hub p.small')].map((p) => p.textContent).join(' | ')");
  await button.click();
  await page.waitForFunction("window.__HH__.couple() !== null");
  const heading = await page.locator(".bench h2").textContent();
  const page1 = await ev<{ groups: { legend: string; radios: { type: string; label: string; name: string; checked: boolean; h: number }[] }[]; hidden: number; alt: string | null; role: string | null; inline: number; trial: boolean; live: string[]; focus: string; turn: string | null; skipHidden: boolean; text: boolean }>(page, "(() => ({ groups: [...document.querySelectorAll('.bench fieldset.couple-group')].filter((f) => !f.hidden).map((f) => ({ legend: f.querySelector('legend').textContent, radios: [...f.querySelectorAll('input')].map((i) => ({ type: i.type, label: i.labels.length === 1 ? i.labels[0].textContent : '', name: i.name, checked: i.checked, h: i.labels[0].getBoundingClientRect().height })) })), hidden: [...document.querySelectorAll('.bench fieldset.couple-group')].filter((f) => f.hidden).length, alt: document.querySelector('.bench canvas.couple-art').getAttribute('aria-label'), role: document.querySelector('.bench canvas.couple-art').getAttribute('role'), inline: document.querySelectorAll('.bench [style]:not(canvas)').length, trial: /first trial/.test(document.querySelector('.bench').textContent), live: [...document.querySelectorAll('.bench [aria-live]')].map((e) => e.getAttribute('aria-live')), focus: document.activeElement.tagName, turn: [...document.querySelectorAll('.bench button')].find((b) => b.textContent === 'Turn the circles')?.textContent ?? null, skipHidden: [...document.querySelectorAll('.bench button')].find((b) => b.textContent === 'Skip the turning').hidden, text: !!document.querySelector('.bench canvas').textContent }))()");
  const first = await cv(page);
  const blank = await picture(page);
  // A wrong setting (the same speed, the same way) is turned: the circles go round and can be skipped; the page names the shape and the count goes up.
  await turnBtn(page).click();
  const during = { busy: (await cv(page)).busy, skipShown: await page.getByRole("button", { name: "Skip the turning" }).isVisible(), ran: await ranText(page), disabled: await ev<boolean>(page, "[...document.querySelectorAll('.bench input[type=radio]')].every((i) => i.disabled) && [...document.querySelectorAll('.bench button')].find((b) => b.textContent === 'Turn the circles').disabled") };
  await page.getByRole("button", { name: "Skip the turning" }).click();
  const wrong1 = { v: await cv(page), ran: await ranText(page), alt: await alt(page), drawn: (await picture(page)) !== blank, focus: await ev<string>(page, "document.activeElement.textContent") };
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-couple-bench.png"), fullPage: true });
  // Changing a control clears the path; a second wrong turning is let run to its end (the animation is not skipped).
  await radio(page, "speed", 3).check();
  const cleared = { v: await cv(page), alt: await alt(page), ran: await ranText(page) };
  await turnBtn(page).click();
  await idle(page);
  const wrong2 = { v: await cv(page), ran: await ranText(page), alt: await alt(page) };
  // Both questions: neither answer gives the model away; the girl, kindly; the feather.
  await page.getByRole("button", { name: "Ask why he looked for a model" }).click();
  const said1 = (await page.locator(".bench .said").last().textContent()) ?? "";
  await page.getByRole("button", { name: "Ask about the observatory" }).click();
  const said2 = (await page.locator(".bench .said").last().textContent()) ?? "";
  await page.getByRole("button", { name: "Talk to the girl who cleans the instruments" }).click();
  await page.getByRole("button", { name: "Do not be afraid. Go slowly and hold each ring gently." }).click();
  await page.getByRole("button", { name: "Look among the instruments" }).click();
  const asked = await cv(page);
  // The line, with the keyboard only: the speed group's checked radio is focused and the arrow moves to twice as fast; the direction group likewise to the other way; the turn button by Enter.
  await radio(page, "speed", 3).focus();
  await page.keyboard.press("ArrowUp");
  await radio(page, "dir", 1).focus();
  await page.keyboard.press("ArrowDown");
  const chosen = await cv(page);
  await turnBtn(page).focus();
  await page.keyboard.press("Enter");
  const turningNow = (await cv(page)).busy;
  await page.waitForSelector(".bench .results:not([hidden])", { timeout: 15000 });
  const end = await ev<{ done: boolean; turned: number; misses: number; met: number; focus: string; links: string[]; pending: string; saved: boolean; resume: unknown; notes: number; disabled: boolean; ran: string; goals: string[]; note2: boolean; alt: string }>(page, "({ done: window.__HH__.couple().done, turned: window.__HH__.couple().turned, misses: window.__HH__.couple().misses, met: document.querySelectorAll('.bench .results .goals .met').length, focus: document.activeElement ? document.activeElement.textContent : '', links: [...document.querySelectorAll('.bench .results a')].map((a) => a.getAttribute('href')), pending: document.querySelector('.bench .results .pending').textContent, saved: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.quests?.['w01q3-al-tusi']?.done === true, resume: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null, notes: document.querySelectorAll('.bench .results .note p').length, disabled: [...document.querySelectorAll('.bench input[type=radio]')].every((x) => x.disabled) && [...document.querySelectorAll('.bench button')].find((b) => b.textContent === 'Turn the circles').disabled, ran: document.querySelector('.bench .ran').textContent, goals: [...document.querySelectorAll('.bench .results .goals li')].map((l) => l.textContent), note2: [...document.querySelectorAll('.bench .results .note p')].some((p) => p.textContent === \"From the museum's record: al-Tusi's model of the planets' motion is called his most original achievement. It is a model of two spheres, the smaller turning twice as fast as the larger and the opposite way, so that a point on it moves along a straight line.\"), alt: document.querySelector('.bench canvas.couple-art').getAttribute('aria-label') })");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-couple-results.png"), fullPage: true });
  await page.getByRole("button", { name: "Back to the Atlas" }).last().click();
  const back = await ev<{ progress: string; label: string; benchHidden: boolean; primary: string; open: number; headingInView: boolean; focus: string }>(page, "(() => { const h = document.querySelector('.hub h2'); const r = h.getBoundingClientRect(); return { progress: document.querySelector('.hub .progress').textContent, label: document.querySelector(\"button[data-quest='w01q3-al-tusi']\").textContent, benchHidden: document.querySelector('.bench').hidden, primary: document.querySelector('.hub button.primary').textContent, open: document.querySelectorAll('.hub .world li.open').length, headingInView: r.top >= 0 && r.bottom <= innerHeight, focus: document.activeElement === h ? 'H2' : document.activeElement.tagName }; })()");
  const pic = await ev<{ home: number[]; open: number[] }>(page, "window.__HH__.atlasPicture()");
  const slotKept = await ev<string | null>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.quests?.['w01q3-al-tusi'] ? 'recorded' : null");
  const worldOne = await ev<string>(page, "[...document.querySelectorAll('.hub .world')][0].textContent");
  const radios1 = page1.groups.flatMap((g) => g.radios);
  record("al-Tusi's two circles can be played with the page's own controls: labelled groups of radio buttons (the direction and the speed in Explorer, no size), a turning that is shown, can be skipped and disables the controls while it runs, a wrong setting that is counted and named by its shape, a changed control that clears the path, both questions with answers that do not say twice or opposite, the girl, the feather, the line found with the keyboard alone, four goals, the museum note with the model's sentence, the two links, and the Atlas counting it with world 1 open",
    isPlain && /^Play: Nasir al-Din al-Tusi$/.test(label ?? "") && /Thirteen quests are built/.test(hubNote) && heading === "Nasir al-Din al-Tusi" &&
    page1.groups.length === 2 && page1.hidden === 1 && page1.groups.map((g) => g.legend).join("|") === "Which way does the small circle turn?|How fast does the small circle turn?" &&
    radios1.length === 5 && radios1.every((r) => r.type === "radio" && r.label.length > 0 && r.name.startsWith("couple-") && r.h >= 44) && page1.groups[0]!.radios.map((r) => r.label).join("|") === "The same way as the large circle|The other way from the large circle" &&
    page1.groups[1]!.radios.map((r) => r.label).join("|") === "As fast as the large circle|Twice as fast as the large circle|Three times as fast as the large circle" &&
    page1.groups.every((g) => g.radios.filter((r) => r.checked).length === 1) && page1.role === "img" && /No path has been drawn yet/.test(page1.alt ?? "") && page1.live.length >= 2 && page1.live.every((l) => l === "polite") && page1.inline === 0 && page1.trial && page1.focus === "H2" && page1.turn === "Turn the circles" && page1.skipHidden && !page1.text &&
    first.setting.r === 0.5 && first.setting.k === 1 && first.setting.d === 1 && first.turned === 0 && first.last === null &&
    during.busy && during.skipShown && during.ran === "The circles are turning." && during.disabled &&
    !wrong1.v.busy && wrong1.v.misses === 1 && wrong1.v.turned === 1 && !wrong1.v.done && wrong1.v.last?.shape.kind === "loops" && wrong1.v.last.shape.lobes === 1 && wrong1.ran === "The point traced a curve with a single loop." && /a curve with a single loop/.test(wrong1.alt) && wrong1.drawn && wrong1.focus === "Turn the circles" &&
    cleared.v.last === null && cleared.v.setting.k === 3 && cleared.v.misses === 1 && /No path has been drawn yet/.test(cleared.alt) &&
    !wrong2.v.busy && wrong2.v.misses === 2 && wrong2.v.turned === 2 && wrong2.v.last?.shape.lobes === 3 && wrong2.ran === "The point traced a flower of 3 loops." && /a flower of 3 loops/.test(wrong2.alt) &&
    /Ptolemy's system departed from steady circular motion/.test(said1) && /founded by the Mongol ruler Hulagu at al-Tusi's suggestion/.test(said2) && !/twice|opposite/i.test(said1) && !/twice|opposite/i.test(said2) && asked.flags.slice().sort().join() === "answered,askedObs,askedWhy,feather,kind" &&
    chosen.setting.k === 2 && chosen.setting.d === -1 && chosen.setting.r === 0.5 && !chosen.done && turningNow &&
    end.done && end.turned === 3 && end.misses === 2 && end.met === 4 && end.focus === "The page is home" && end.saved && end.resume === null && end.notes === 7 && end.disabled && end.note2 &&
    /The point went back and forth along a straight line\./.test(end.ran) && /The page has settled onto a straight line\./.test(end.ran) && /a straight line/.test(end.alt) &&
    end.links.join() === "https://islam.museum/en/person/nasir-al-din-al-tusi/,https://islam.museum/en/building/maragha-observatory/" && /Historical review pending/.test(end.pending) &&
    /\D1\D/.test(` ${back.progress} `) && /^Play again: /.test(back.label) && back.benchHidden && /Ibn al-Haytham/.test(back.primary) && back.open === 13 && pic.open.join() === "1,2,3,4,5,6,7,8,9,10" && pic.home[0] === 1 && slotKept === "recorded" && /Play again: Nasir al-Din al-Tusi/.test(worldOne) && back.headingInView && back.focus === "H2",
    { label, isPlain, heading, page1, first, during, wrong1, cleared, wrong2, said1: said1.slice(-160), said2: said2.slice(-160), asked, chosen, turningNow, end, back, pic, hubNote });
  await ctx.close();
  // Left in the middle: a wrong turning, a question, then the setting that is the answer chosen and not turned; the page loaded again, and the Atlas says Continue; the setting is where it was and not yet turned, and the line can be found.
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await open(ctx2, "&style=explorer&room=off");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  await turnBtn(page).click();
  await page.getByRole("button", { name: "Skip the turning" }).click();
  await page.getByRole("button", { name: "Ask about the observatory" }).click();
  await radio(page, "speed", 2).check();
  await radio(page, "dir", -1).check();
  const mid = await cv(page);
  const keptNow = await ev<{ quest: string; snap: Record<string, unknown> } | null>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null");
  await ev(page, "window.__HH__.saveReady()");
  await page.reload();
  await page.waitForFunction("window.__HH__ && window.__HH__.ready");
  const hubLabels = await ev<{ label: string; restart: number; flying: boolean; primary: string }>(page, "({ label: document.querySelector(\"button[data-quest='w01q3-al-tusi']\").textContent, restart: [...document.querySelectorAll('.hub li.open button')].filter((b) => b.textContent === 'Start this quest again').length, flying: window.__HH__.resumed(), primary: document.querySelector('.hub button.primary').textContent })");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  const after = await cv(page);
  const checked = await ev<string[]>(page, "[...document.querySelectorAll('.bench input[type=radio]:checked')].map((i) => i.name + '=' + i.dataset.value)");
  const afterAlt = await alt(page);
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-couple-resumed.png"), fullPage: true });
  await turnBtn(page).click();
  await page.getByRole("button", { name: "Skip the turning" }).click();
  const found = await cv(page);
  record("al-Tusi's two circles left in the middle are kept, the Atlas says Continue and offers a new start, and the circles stand as they were set, with no path and not turned, even when the setting is the answer, when the quest is opened again",
    mid.misses === 1 && mid.setting.k === 2 && mid.setting.d === -1 && keptNow?.quest === QUEST && Object.keys(keptNow.snap).sort().join() === "dir,flags,misses,size,speed,style,turned" && keptNow.snap.speed === 2 && keptNow.snap.dir === -1 && keptNow.snap.misses === 1 &&
    /^Continue: /.test(hubLabels.label) && hubLabels.restart === 1 && !hubLabels.flying && /^Play: /.test(hubLabels.primary) &&
    after.misses === 1 && after.turned === 1 && after.setting.k === 2 && after.setting.d === -1 && after.flags.join() === "askedObs" && !after.done && after.last === null && !after.busy && checked.sort().join() === "couple-dir=-1,couple-size=0.5,couple-speed=2" && /No path has been drawn yet/.test(afterAlt) &&
    found.done && found.misses === 1 && found.turned === 2,
    { mid, keptNow, hubLabels, after, checked, afterAlt, found });
  await ctx2.close();
  // Story offers one choice, the direction, and says which way to try; Challenge offers eighteen settings and says only that the path is not a line, while the picture and its description still show the shape.
  const ctx3 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await open(ctx3, "&style=story&room=off");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  const story = await ev<{ visible: string[]; radios: number }>(page, "({ visible: [...document.querySelectorAll('.bench fieldset.couple-group')].filter((f) => !f.hidden).map((f) => f.querySelector('legend').textContent), radios: document.querySelectorAll('.bench fieldset.couple-group:not([hidden]) input[type=radio]').length })");
  await turnBtn(page).click();
  await page.getByRole("button", { name: "Skip the turning" }).click();
  const storyWrong = { v: await cv(page), ran: await ranText(page), alt: await alt(page) };
  await radio(page, "dir", -1).check();
  await turnBtn(page).click();
  await page.getByRole("button", { name: "Skip the turning" }).click();
  const storyDone = await cv(page);
  await ctx3.close();
  const ctx4 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await open(ctx4, "&style=challenge&room=off");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  const c0 = await ev<{ groups: { legend: string; n: number }[]; settings: number; note: boolean }>(page, "(() => { const g = [...document.querySelectorAll('.bench fieldset.couple-group')].filter((f) => !f.hidden).map((f) => ({ legend: f.querySelector('legend').textContent, n: f.querySelectorAll('input').length })); return { groups: g, settings: g.reduce((a, x) => a * x.n, 1), note: true }; })()");
  const c0v = await cv(page);
  // The half size, the other way, the same speed: a wrong setting (a circle), counted, and the page says only that it is not a line.
  await radio(page, "size", 0.5).check();
  await radio(page, "dir", -1).check();
  await turnBtn(page).click();
  await page.getByRole("button", { name: "Skip the turning" }).click();
  const c1 = { v: await cv(page), ran: await ranText(page), alt: await alt(page) };
  // The half size with three times the speed, the other way: also not a line.
  await radio(page, "speed", 3).check();
  await turnBtn(page).click();
  await page.getByRole("button", { name: "Skip the turning" }).click();
  const c2 = { v: await cv(page), ran: await ranText(page), alt: await alt(page) };
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-couple-challenge.png"), fullPage: true });
  await radio(page, "speed", 2).check();
  await turnBtn(page).click();
  await page.getByRole("button", { name: "Skip the turning" }).click();
  const c3 = await cv(page);
  record("al-Tusi's Story page has the direction as its one choice and says which way to try after a wrong turning; the Challenge page has the size, the speed and the direction (eighteen settings), a half-size setting with the wrong speed is not a line, a wrong turning is counted and only said not to be a straight line (the picture's description still names the shape), and the line is found at the half size, twice the speed, the other way",
    story.visible.join("|") === "Which way does the small circle turn?" && story.radios === 2 &&
    storyWrong.v.misses === 1 && !storyWrong.v.done && storyWrong.ran === "The point traced a flower of 2 loops.That is not a straight line. Try turning the small circle the other way." && /a flower of 2 loops/.test(storyWrong.alt) && storyDone.done && storyDone.misses === 1 && storyDone.turned === 2 &&
    c0.groups.map((g) => g.legend).join("|") === "Which way does the small circle turn?|How fast does the small circle turn?|How wide is the small circle?" && c0.groups.map((g) => g.n).join() === "2,3,3" && c0.settings === 18 && c0v.setting.r === 1 / 3 && c0v.setting.k === 1 && c0v.setting.d === 1 &&
    c1.v.misses === 1 && c1.v.last?.shape.kind === "circle" && c1.ran === "The path is not a straight line." && /a circle/.test(c1.alt) &&
    c2.v.misses === 2 && c2.v.turned === 2 && c2.v.last?.setting.r === 0.5 && c2.v.last.setting.k === 3 && c2.v.last.setting.d === -1 && c2.v.last.shape.kind === "loops" && c2.ran === "The path is not a straight line." && !/flower|oval|circle|curve/.test(c2.ran) && /a flower of 3 loops/.test(c2.alt) && !c2.v.done &&
    c3.done && c3.misses === 2 && c3.turned === 3,
    { story, storyWrong, storyDone: { misses: storyDone.misses, turned: storyDone.turned }, c0, c0v: c0v.setting, c1, c2, c3: { done: c3.done, misses: c3.misses } });
  await ctx4.close();
  // Reduced motion, set through the game's own settings: the finished path is drawn at once, with no turning shown.
  const ctx5 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await open(ctx5, "&style=explorer&room=off");
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByLabel("Less motion").check();
  await page.locator(".sheet button.primary").click();
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  const calmBlank = await picture(page);
  await radio(page, "speed", 3).check();
  await turnBtn(page).click();
  const calm = { v: await cv(page), ran: await ranText(page), skipVisible: await page.getByRole("button", { name: "Skip the turning" }).isVisible(), drawn: (await picture(page)) !== calmBlank, alt: await alt(page) };
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-couple-calm.png"), fullPage: true });
  record("al-Tusi's two circles with reduced motion set in the game's own settings draw the finished path at once: the turning is never shown (the page is never busy and has no skip button) and the shape is named",
    !calm.v.busy && calm.v.turned === 1 && calm.v.misses === 1 && calm.v.last?.shape.lobes === 3 && calm.ran === "The point traced a flower of 3 loops." && !calm.skipVisible && calm.drawn && /a flower of 3 loops/.test(calm.alt),
    { calm });
  await ctx5.close();
  // The page in Arabic runs right to left with Arabic numerals, and the picture is the same as in English: it has no left-to-right order and is not mirrored.
  const arCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const ar = await arCtx.newPage();
  ar.on("pageerror", (e) => errors.push(String(e)));
  await ar.goto(`${served.base}/games/hudhud/index.html?lang=ar&music=off&style=explorer&room=off`);
  await ar.waitForFunction("window.__HH__ && window.__HH__.ready");
  await leaveOpening(ar);
  await ar.locator(`.hub button[data-quest='${QUEST}']`).click();
  const arBlank = await picture(ar);
  const arView = await ev<{ dir: string; heading: string; legends: string[]; labels: string[]; alt: string | null; turn: string; trial: string }>(ar, "({ dir: document.documentElement.dir, heading: document.querySelector('.bench h2').textContent, legends: [...document.querySelectorAll('.bench fieldset.couple-group legend')].filter((l) => !l.parentElement.hidden).map((l) => l.textContent), labels: [...document.querySelectorAll('.bench fieldset.couple-group label')].filter((l) => !l.closest('fieldset').hidden).map((l) => l.textContent), alt: document.querySelector('.bench canvas.couple-art').getAttribute('aria-label'), turn: [...document.querySelectorAll('.bench button')].find((b) => b.className === 'primary').textContent, trial: document.querySelector('.bench .small').textContent })");
  await radio(ar, "speed", 2).check();
  await radio(ar, "dir", -1).check();
  await turnBtn(ar).click();
  await ar.getByRole("button", { name: "تخطَّ الدوران" }).click();
  const arDone = { v: await cv(ar), ran: await ranText(ar), alt: await alt(ar) };
  if (outDir) await ar.screenshot({ path: resolve(outDir, "hudhud-couple-bench-ar.png"), fullPage: true });
  // The same picture in English, drawn by another page, is the same picture: compare the two blank pictures.
  const enCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const en = await open(enCtx, "&style=explorer&room=off");
  await en.locator(`.hub button[data-quest='${QUEST}']`).click();
  const enBlank = await picture(en);
  await enCtx.close();
  record("al-Tusi's two circles in Arabic run right to left with Arabic numerals, say the choices and the line in Arabic, and draw the same picture as the English page, not mirrored",
    arView.dir === "rtl" && arView.heading === "نصير الدين الطوسي" && arView.legends.join("|") === "في أي اتجاه تدور الدائرة الصغيرة؟|ما سرعة دوران الدائرة الصغيرة؟" && arView.labels.join("|") === "في اتجاه الدائرة الكبيرة نفسه|في الاتجاه الآخر من الدائرة الكبيرة|بسرعة الدائرة الكبيرة نفسها|بضعف سرعة الدائرة الكبيرة|بثلاثة أضعاف سرعة الدائرة الكبيرة" && /لم يُرسم أي مسار بعد/.test(arView.alt ?? "") && arView.turn === "أدِر الدائرتين" &&
    arBlank === enBlank && arDone.v.done && /راحت النقطة وجاءت على خط مستقيم/.test(arDone.ran) && /خطًا مستقيمًا/.test(arDone.alt),
    { arView, same: arBlank === enBlank, arDone });
  await arCtx.close();
}
// The tenth quest, coffee on three shelves, the second use of the sorting rules: opened in Explorer: six cards, each
// with its own list of choices in a numbered list of the cards' sentences, and the key in words; a showing with a card
// off the shelves is refused and not counted; a wrong showing (a tradition put on the first shelf) says how many are
// right and is counted; both questions, the child answered kindly, the feather; every card placed rightly through the
// lists and one by two touches on the picture; four goals, the note, the links, "Historical review pending", and the
// Atlas counts it with world 7 open. Then a card placed, the page loaded again, and "Continue"; the Challenge way of
// playing, with eight cards; and the page in Arabic, with the shelves from the right.
{
  const QUEST = "w07q3-coffee";
  type CView = { moves: number; shows: number; flags: string[]; done: boolean; placed: Record<string, string | null>; answer: Record<string, string>; selected: string | null; status: string; items: string[]; groups: string[] };
  const cvw = (page: Page) => ev<CView>(page, "(() => { const a = window.__HH__.coffee(); return { moves: a.moves, shows: a.shows, flags: a.flags, done: a.done, placed: a.placed, answer: a.answer, selected: a.selected, status: a.status, items: a.items, groups: a.groups }; })()");
  /** The middle of a card, or of the head of a shelf, in the picture's space, turned into where to click on the canvas. */
  const at = async (page: Page, s: CView, what: { card: string } | { tray: number }, rtl: boolean): Promise<[number, number]> => {
    await page.locator(".bench canvas.sort-art").scrollIntoViewIfNeeded();
    const box = (await page.locator(".bench canvas.sort-art").boundingBox())!;
    const placed = s.items.map((i) => (s.placed[i] === null ? null : s.groups.indexOf(s.placed[i]!)));
    let x: number;
    let y: number;
    if ("card" in what) {
      const r = cardRects({ items: s.items, placed, groups: s.groups.length, rtl })[s.items.indexOf(what.card)]!;
      [x, y] = [r.x + r.w / 2, r.y + r.h / 2];
    } else {
      const r = trayRects(s.groups.length, rtl)[what.tray]!;
      [x, y] = [r.x + r.w / 2, r.y + 8];
    }
    return [box.x + (x / SORT_ART.w) * box.width, box.y + (y / SORT_ART.h) * box.height];
  };
  const pick = (page: Page, item: string, group: string) => page.locator(`.bench select[data-item='${item}']`).selectOption(group);
  const SENTENCES = [
    "Card 1: The coffee tree grew wild in Ethiopia.",
    "Card 2: In Yemen people liked best a drink made from the dried husk of the bean.",
    "Card 3: The drink spread from Sufi circles, because it helped them stay awake through nights of devotion.",
    "Card 4: It was the jurist al-Dhabhani who brought coffee to Aden.",
    "Card 5: It was al-Shadhili of Mocha who began coffee.",
    "Card 6: A tale of a man called Omar, and of goats, is told about the start of coffee.",
  ];
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  let page = await open(ctx, "&style=explorer");
  const button = page.locator(`.hub button[data-quest='${QUEST}']`);
  const isPlain = await button.evaluate((b) => !b.classList.contains("primary"));
  const label = await button.textContent();
  const hubNote = await ev<string>(page, "[...document.querySelectorAll('.hub p.small')].map((p) => p.textContent).join(' | ')");
  await button.click();
  await page.waitForFunction("window.__HH__.coffee() !== null");
  const heading = await page.locator(".bench h2").textContent();
  const page1 = await ev<{ selects: number; items: string[]; options: string[]; key: string[]; alt: string | null; role: string | null; inline: number; trial: boolean; live: string | null; h3: string[]; focus: string; sized: boolean; show: boolean; ol: boolean; label0: string }>(page, "(() => ({ selects: document.querySelectorAll('.bench select[data-item]').length, items: [...document.querySelectorAll('.bench ol.places li label > span')].map((s) => s.textContent), options: [...document.querySelector(\"select[data-item='dhabhani']\").options].map((o) => o.textContent), key: [...document.querySelectorAll('.bench ol.tray-key li')].map((l) => l.textContent), alt: document.querySelector('.bench canvas.sort-art').getAttribute('aria-label'), role: document.querySelector('.bench canvas.sort-art').getAttribute('role'), inline: document.querySelectorAll('.bench [style]:not(canvas)').length, trial: /first trial/.test(document.querySelector('.bench').textContent), live: document.querySelector('.bench .ran').getAttribute('aria-live'), h3: [...document.querySelectorAll('.bench h3')].map((h) => h.textContent), focus: document.activeElement.tagName, sized: [...document.querySelectorAll('.bench select[data-item]')].every((s) => s.getBoundingClientRect().height >= 44), show: [...document.querySelectorAll('.bench button')].some((b) => b.textContent === 'Show the record'), ol: document.querySelector('.bench ol.places') !== null, label0: document.querySelector(\"select[data-item='ethiopia']\").closest('label').textContent }))()");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-coffee-bench.png"), fullPage: true });
  const show = page.getByRole("button", { name: "Show the record" });
  // A showing with every card off the shelves is refused and not counted; so is one with a card off them.
  await show.click();
  const refused0 = { v: await cvw(page), said: await page.locator(".bench .ran").textContent() };
  await pick(page, "ethiopia", "stated");
  await show.click();
  const refused1 = { v: await cvw(page), said: await page.locator(".bench .ran").textContent() };
  // Every card on its shelf but the jurist's tradition, put on the first shelf: a wrong showing that says how many are right, and is counted.
  for (const [item, shelf] of [["husk", "stated"], ["sufis", "stated"], ["shadhili", "tradition"], ["goats", "legend"], ["dhabhani", "stated"]] as const) await pick(page, item, shelf);
  await show.click();
  const wrong = { v: await cvw(page), said: await page.locator(".bench .ran").textContent() };
  // Both questions; the child, kindly; the feather.
  await page.getByRole("button", { name: "Ask who brought coffee" }).click();
  const names = (await page.locator(".bench .said").textContent()) ?? "";
  await page.getByRole("button", { name: "Ask about the tree and the name" }).click();
  const both = (await page.locator(".bench .said").textContent()) ?? "";
  await page.getByRole("button", { name: "Talk to the child who tidies the cards" }).click();
  await page.getByRole("button", { name: "It is all right. We will put them back together." }).click();
  await page.getByRole("button", { name: "Look among the cards" }).click();
  const asked = await cvw(page);
  // The jurist's card is put on the second shelf by two touches on the picture: the card, then the shelf.
  await page.mouse.click(...(await at(page, asked, { card: "dhabhani" }, false)));
  const chose = { v: await cvw(page), hint: await ev<string>(page, "[...document.querySelectorAll('.bench p.small')].map((p) => p.textContent).join(' | ')") };
  await page.mouse.click(...(await at(page, chose.v, { tray: 1 }, false)));
  const moved = await cvw(page);
  const selectValue = await page.locator("select[data-item='dhabhani']").inputValue();
  await show.click();
  await page.waitForSelector(".bench .results:not([hidden])");
  const end = await ev<{ done: boolean; shows: number; met: number; focus: string; links: string[]; pending: string; saved: boolean; resume: unknown; notes: number; disabled: boolean; progress: string; said: string }>(page, "({ done: window.__HH__.coffee().done, shows: window.__HH__.coffee().shows, met: document.querySelectorAll('.bench .results .goals .met').length, focus: document.activeElement ? document.activeElement.textContent : '', links: [...document.querySelectorAll('.bench .results a')].map((a) => a.getAttribute('href')), pending: document.querySelector('.bench .results .pending').textContent, saved: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.quests?.['w07q3-coffee']?.done === true, resume: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null, notes: document.querySelectorAll('.bench .results .note p').length, disabled: [...document.querySelectorAll('.bench select[data-item]')].every((x) => x.disabled), progress: document.querySelector('.bench .results > p').textContent, said: document.querySelector('.bench .ran').textContent })");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-coffee-results.png"), fullPage: true });
  await page.getByRole("button", { name: "Back to the Atlas" }).last().click();
  const back = await ev<{ progress: string; label: string; benchHidden: boolean; primary: string; open: number; headingInView: boolean; focus: string }>(page, "(() => { const h = document.querySelector('.hub h2'); const r = h.getBoundingClientRect(); return { progress: document.querySelector('.hub .progress').textContent, label: document.querySelector(\"button[data-quest='w07q3-coffee']\").textContent, benchHidden: document.querySelector('.bench').hidden, primary: document.querySelector('.hub button.primary').textContent, open: document.querySelectorAll('.hub .world li.open').length, headingInView: r.top >= 0 && r.bottom <= innerHeight, focus: document.activeElement === h ? 'H2' : document.activeElement.tagName }; })()");
  const picture = await ev<{ home: number[]; open: number[] }>(page, "window.__HH__.atlasPicture()");
  const slotKept = await ev<string | null>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.quests?.['w07q3-coffee'] ? 'recorded' : null");
  record("coffee on three shelves can be played with the page's own controls: six cards in a numbered list of their sentences, each with a list of choices, the key in words, a showing with a card off the shelves is refused and not counted, a wrong showing (a tradition on the first shelf) says how many are right, both questions, the child, the feather, a card put on a shelf by two touches on the picture, four goals, the note, the links, and the Atlas counts it with world 7 open",
    isPlain && /^Play: /.test(label ?? "") && /Thirteen quests are built/.test(hubNote) && heading === "Coffee's journey" && page1.selects === 6 && page1.ol && page1.items.join("|") === SENTENCES.join("|") && page1.label0.startsWith("Card 1: ") &&
    page1.options.join("|") === "not on a shelf yet|Shelf 1: the record states it plainly|Shelf 2: a tradition: one of several tellings that do not agree|Shelf 3: a legend: the record's source does not take it as history" &&
    page1.key.join("|") === "Shelf 1: the record states it plainly|Shelf 2: a tradition: one of several tellings that do not agree|Shelf 3: a legend: the record's source does not take it as history" && page1.h3[0] === "The shelves, in words" && page1.h3[1] === "The cards, in words" &&
    page1.role === "img" && /Shelves: 3/.test(page1.alt ?? "") && /Cards on a shelf: 0 of 6/.test(page1.alt ?? "") && page1.live === "polite" && page1.inline === 0 && page1.trial && page1.sized && page1.show && page1.focus === "H2" &&
    refused0.v.shows === 0 && refused0.v.moves === 0 && /Cards not on a shelf: 6/.test(refused0.said ?? "") && refused1.v.shows === 0 && refused1.v.moves === 1 && /Cards not on a shelf: 5/.test(refused1.said ?? "") &&
    wrong.v.shows === 1 && !wrong.v.done && wrong.v.moves === 6 && /Cards that are right: 5 of 6/.test(wrong.said ?? "") &&
    /more than one name is credited/.test(names) && /Kaffa/.test(both) && !/Aidarus|three/i.test(names) &&
    asked.flags.slice().sort().join() === "answered,askedBirds,askedDivision,feather,kind" && chose.v.selected === "dhabhani" && /Card chosen: al-Dhabhani at Aden/.test(chose.hint) && moved.placed.dhabhani === "tradition" && moved.selected === null && moved.moves === 7 && selectValue === "tradition" &&
    end.done && end.shows === 1 && end.met === 4 && end.focus === "The page is home" && end.saved && end.resume === null && end.notes === 7 && end.disabled && /Cards placed: 6 of 6 · Showings that failed: 1/.test(end.progress) && /The page of the Atlas is whole again/.test(end.said) &&
    end.links.join() === "https://islam.museum/en/invention/coffee-yemen/,https://islam.museum/en/invention/coffeehouse-yemen/" && /Historical review pending/.test(end.pending) &&
    /\D1\D/.test(` ${back.progress} `) && /^Play again: /.test(back.label) && back.benchHidden && /Ibn al-Haytham/.test(back.primary) && back.open === 13 && picture.open.join() === "1,2,3,4,5,6,7,8,9,10" && picture.home[6] === 1 && slotKept === "recorded" && back.headingInView && back.focus === "H2",
    { label, isPlain, heading, page1, refused0, refused1, wrong, names: names.slice(-200), both: both.slice(-200), asked, chose, moved, selectValue, end, back, picture, hubNote });
  await ctx.close();
  // Left in the middle: two cards placed, the page loaded again, and the Atlas says Continue; the cards are where they were.
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await open(ctx2, "&style=explorer");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  await pick(page, "goats", "legend");
  await pick(page, "shadhili", "tradition");
  const mid = await cvw(page);
  const keptNow = await ev<{ quest: string; snap: { moves: number; placed: Record<string, string | null> } } | null>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null");
  await ev(page, "window.__HH__.saveReady()");
  await page.reload();
  await page.waitForFunction("window.__HH__ && window.__HH__.ready");
  const hubLabels = await ev<{ label: string; restart: number; flying: boolean; primary: string }>(page, "({ label: document.querySelector(\"button[data-quest='w07q3-coffee']\").textContent, restart: [...document.querySelectorAll('.hub li.open button')].filter((b) => b.textContent === 'Start this quest again').length, flying: window.__HH__.resumed(), primary: document.querySelector('.hub button.primary').textContent })");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  const after = await cvw(page);
  const shownValues = await ev<string[]>(page, "[...document.querySelectorAll('.bench select[data-item]')].map((s) => s.value)");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-coffee-resumed.png"), fullPage: true });
  record("coffee on three shelves left in the middle is kept, the Atlas says Continue and offers a new start, and the cards stand where they were when the quest is opened again",
    mid.moves === 2 && keptNow?.quest === QUEST && keptNow.snap.moves === 2 && keptNow.snap.placed.goats === "legend" && /^Continue: /.test(hubLabels.label) && hubLabels.restart === 1 && !hubLabels.flying && /^Play: /.test(hubLabels.primary) &&
    after.placed.goats === "legend" && after.placed.shadhili === "tradition" && after.placed.ethiopia === null && after.moves === 2 && shownValues.join() === ",,,,tradition,legend",
    { mid, keptNow, hubLabels, after, shownValues });
  await ctx2.close();
  // The Challenge way of playing has all eight cards; a wrong showing says only that this is not how the record treats them.
  const ctx3 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await open(ctx3, "&style=challenge");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  const c0 = await ev<{ selects: number; items: number; key: number; alt: string | null }>(page, "({ selects: document.querySelectorAll('.bench select[data-item]').length, items: document.querySelectorAll('.bench ol.places li').length, key: document.querySelectorAll('.bench ol.tray-key li').length, alt: document.querySelector('.bench canvas.sort-art').getAttribute('aria-label') })");
  const startC = await cvw(page);
  for (const item of startC.items) await pick(page, item, item === "ban" ? "legend" : startC.answer[item]!); // the ban in the wrong place
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-coffee-challenge.png"), fullPage: true });
  await page.getByRole("button", { name: "Show the record" }).click();
  const cw = { v: await cvw(page), said: await page.locator(".bench .ran").textContent() };
  await pick(page, "ban", "stated");
  await page.getByRole("button", { name: "Show the record" }).click();
  const cdone = await cvw(page);
  record("coffee's Challenge page has all eight cards in the list and on the shelves; a wrong showing says only that this is not how the record treats them and is counted; the right one ends it",
    c0.selects === 8 && c0.items === 8 && c0.key === 3 && /Cards on a shelf: 0 of 8/.test(c0.alt ?? "") && startC.items.join() === "ethiopia,husk,sufis,spread,ban,dhabhani,shadhili,goats" &&
    cw.v.shows === 1 && !cw.v.done && (cw.said ?? "").trim() === "This is not how the record treats them." && cdone.done && cdone.shows === 1,
    { c0, cw, cdone });
  await ctx3.close();
  // The page in Arabic runs right to left with Arabic numerals; the first shelf and the first card are on the right, in the key and in a touch on the picture.
  const arCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const ar = await arCtx.newPage();
  ar.on("pageerror", (e) => errors.push(String(e)));
  await ar.goto(`${served.base}/games/hudhud/index.html?lang=ar&music=off&style=explorer`);
  await ar.waitForFunction("window.__HH__ && window.__HH__.ready");
  await leaveOpening(ar);
  await ar.locator(`.hub button[data-quest='${QUEST}']`).click();
  const a0 = await cvw(ar);
  const arView = await ev<{ dir: string; heading: string; key: string[]; firstLabel: string; alt: string | null; keyTitle: string; show: string }>(ar, "({ dir: document.documentElement.dir, heading: document.querySelector('.bench h2').textContent, key: [...document.querySelectorAll('.bench ol.tray-key li')].map((l) => l.textContent), firstLabel: document.querySelector('.bench .places label > span').textContent, alt: document.querySelector('.bench canvas.sort-art').getAttribute('aria-label'), keyTitle: document.querySelector('.bench h3').textContent, show: [...document.querySelectorAll('.bench .row button.primary')].map((b) => b.textContent).join() })");
  if (outDir) await ar.screenshot({ path: resolve(outDir, "hudhud-coffee-bench-ar.png"), fullPage: true });
  // Touch the first card (the right-most of the band) and then the first shelf (the right-most of the three).
  await ar.mouse.click(...(await at(ar, a0, { card: "ethiopia" }, true)));
  const t1 = await cvw(ar);
  await ar.mouse.click(...(await at(ar, t1, { tray: 0 }, true)));
  const t2 = await cvw(ar);
  const trayX = trayRects(3, true).map((r) => r.x);
  record("coffee on three shelves in Arabic runs right to left with Arabic numerals, puts the first shelf and the first card on the right in the picture and in a touch on it, and says the key and the cards in Arabic",
    arView.dir === "rtl" && arView.heading === "رحلة القهوة" && arView.key.join("|") === "الرف ١: ما يقوله السجل صريحًا|الرف ٢: رواية: واحدة من روايات عدة لا تتفق|الرف ٣: حكاية: مصدر السجل لا يعدّها تاريخًا" && arView.firstLabel === "البطاقة ١: كانت شجرة البن تنبت برّية في إثيوبيا." && /٣/.test(arView.alt ?? "") && arView.keyTitle === "الرفوف بالكلمات" && arView.show === "اعرض السجل" &&
    trayX[0]! > trayX[1]! && trayX[1]! > trayX[2]! && t1.selected === "ethiopia" && t2.placed.ethiopia === "stated" && t2.moves === 1 && t2.selected === null,
    { arView, t1: t1.selected, t2: { moves: t2.moves, placed: t2.placed.ethiopia }, trayX });
  await arCtx.close();
}
// The eleventh quest, the Alhambra and the dry fountain: opened in Explorer: a grid of buttons of four rows of four,
// each saying what the piece is and which sides it is open to; no basin has water at the start; one piece turned by
// its button and one by a click on the picture each count a move; both questions, the girl answered kindly, the
// feather; the pieces turned to the answer by turns computed here from the page's own state; four goals, the note, the
// links, "Historical review pending", and the Atlas counts it with world 8 open. Then two turns, the page loaded again,
// and "Continue"; the Challenge way of playing, which shows no water until the sluice is opened and refuses a leaking
// grid; the page in Arabic, with the grid from the right; and a run with movement kept still.
{
  const QUEST = "w08q2-alhambra";
  type Ch = { moves: number; openings: number; flags: string[]; done: boolean; cells: { kind: Kind; turn: number }[]; rows: number; cols: number; spout: { cell: number; side: Side }; basins: { cell: number; kind: string }[]; wet: Record<string, number>; status: string; busy: boolean; last: { type: string } | null; style: string };
  const chv = (page: Page) => ev<Ch>(page, "(() => { const a = window.__HH__.channels(); return { moves: a.moves, openings: a.openings, flags: a.flags, done: a.done, cells: a.cells, rows: a.rows, cols: a.cols, spout: a.spout, basins: a.basins, wet: Object.fromEntries(a.answer.wet), status: a.status, busy: a.busy, last: a.last, style: a.style }; })()");
  /** The middle of a piece, in the picture's space, turned into where to click on the canvas. */
  const spot = async (page: Page, p: number, rows: number, cols: number, rtl: boolean): Promise<[number, number]> => {
    await page.locator(".bench canvas.channels-art").scrollIntoViewIfNeeded();
    const box = (await page.locator(".bench canvas.channels-art").boundingBox())!;
    const o = tileOrigin(p, rows, cols);
    const { tile } = channelsLayout(rows, cols);
    const x = rtl ? CHANNELS_ART.w - (o.x + tile / 2) : o.x + tile / 2;
    return [box.x + (x / CHANNELS_ART.w) * box.width, box.y + ((o.y + tile / 2) / CHANNELS_ART.h) * box.height];
  };
  /** The presses that finish the grid, worked out from the page's own state: for each piece of the road, one press for each quarter turn it still needs. */
  const remaining = (s: Ch): number[] => {
    const out: number[] = [];
    s.cells.forEach((c, p) => {
      const want = s.wet[String(p)];
      if (want === undefined) return;
      let t = c.turn;
      while (t % period(c.kind) !== want) {
        out.push(p);
        t = (t + 1) % 4;
      }
    });
    return out;
  };
  const wetBasins = (s: Ch) => {
    const f = flow({ rows: s.rows, cols: s.cols, cells: s.cells, spout: s.spout });
    return { wet: s.basins.filter((b) => f.wet[b.cell]).length, leaks: f.leaks.length };
  };
  const btn = (page: Page, p: number) => page.locator(`.bench .channel-row button[data-place='${p}']`);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  let page = await open(ctx, "&style=explorer");
  const button = page.locator(`.hub button[data-quest='${QUEST}']`);
  const isPlain = await button.evaluate((b) => !b.classList.contains("primary"));
  const label = await button.textContent();
  const hubNote = await ev<string>(page, "[...document.querySelectorAll('.hub p.small')].map((p) => p.textContent).join(' | ')");
  await button.click();
  await page.waitForFunction("window.__HH__.channels() !== null");
  const heading = await page.locator(".bench h2").textContent();
  const v0 = await chv(page);
  const page1 = await ev<{ rows: number; perRow: number[]; labels: string[]; sized: boolean; alt: string | null; role: string | null; inline: number; trial: boolean; live: string | null; tableRows: number; caption: string; summary: string; status: string; sluice: number; texts: number }>(page, "(() => ({ rows: document.querySelectorAll('.bench ol.channel-row').length, perRow: [...document.querySelectorAll('.bench ol.channel-row')].map((o) => o.querySelectorAll('button').length), labels: [...document.querySelectorAll('.bench .channel-row button')].map((b) => b.textContent), sized: [...document.querySelectorAll('.bench .channel-row button')].every((b) => b.getBoundingClientRect().width >= 44 && b.getBoundingClientRect().height >= 44), alt: document.querySelector('.bench canvas.channels-art').getAttribute('aria-label'), role: document.querySelector('.bench canvas.channels-art').getAttribute('role'), inline: document.querySelectorAll('.bench [style]:not(canvas)').length, trial: /first trial/.test(document.querySelector('.bench').textContent), live: document.querySelector('.bench .ran').getAttribute('aria-live'), tableRows: document.querySelectorAll('.bench details.edges tbody tr').length, caption: document.querySelector('.bench details.edges caption').textContent, summary: document.querySelector('.bench details.edges summary').textContent, status: document.querySelector('.bench .ran .status').textContent, sluice: [...document.querySelectorAll('.bench button')].filter((x) => x.textContent === 'Open the sluice').length, texts: 0 }))()");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-channels-bench.png"), fullPage: true });
  const start = wetBasins(v0);
  // One turn by its button (the tee in the first row), one by a click on the picture (the bend beside it).
  await btn(page, 1).click();
  const viaButton = await chv(page);
  const said1 = await page.locator(".bench .ran").textContent();
  await page.mouse.click(...(await spot(page, 2, v0.rows, v0.cols, false)));
  const viaPicture = await chv(page);
  await page.waitForFunction("!window.__HH__.channels().busy");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-channels-water.png"), fullPage: true });
  // A piece that cannot be turned is told so and not counted (the Explorer has a plain stone in its first row's end).
  const blank = v0.cells.findIndex((c) => c.kind === "blank");
  await btn(page, blank).click();
  const fixedSaid = await page.locator(".bench .ran").textContent();
  const afterFixed = await chv(page);
  for (const name of ["Ask about the water", "Ask about the courts", "Talk to the girl who sweeps the court"]) await page.getByRole("button", { name }).click();
  const said = (await page.locator(".bench .said").textContent()) ?? "";
  await page.getByRole("button", { name: "Yes. We will turn the pieces together until the water runs." }).click();
  await page.getByRole("button", { name: "Look in the dry fountain" }).click();
  const asked = await chv(page);
  // The rest by turns worked out here from the page's own state.
  let presses = 0;
  for (;;) {
    const s = await chv(page);
    if (s.done) break;
    const todo = remaining(s);
    if (todo.length === 0) break;
    await btn(page, todo[0]!).click();
    presses++;
  }
  await page.waitForSelector(".bench .results:not([hidden])");
  const end = await ev<{ done: boolean; moves: number; met: number; focus: string; links: string[]; pending: string; saved: boolean; resume: unknown; notes: number; disabled: boolean; progress: string; said: string; alt: string | null; notesText: string }>(page, "({ done: window.__HH__.channels().done, moves: window.__HH__.channels().moves, met: document.querySelectorAll('.bench .results .goals .met').length, focus: document.activeElement ? document.activeElement.textContent : '', links: [...document.querySelectorAll('.bench .results a')].map((a) => a.getAttribute('href')), pending: document.querySelector('.bench .results .pending').textContent, saved: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.quests?.['w08q2-alhambra']?.done === true, resume: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null, notes: document.querySelectorAll('.bench .results .note p').length, disabled: [...document.querySelectorAll('.bench .channel-row button')].every((x) => x.disabled), progress: document.querySelector('.bench .results > p').textContent, said: document.querySelector('.bench .ran').textContent, alt: document.querySelector('.bench canvas.channels-art').getAttribute('aria-label'), notesText: [...document.querySelectorAll('.bench .results .note p')].map((p) => p.textContent).slice(0, 4).join(' | ') })");
  const final = await chv(page);
  const fin = wetBasins(final);
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-channels-results.png"), fullPage: true });
  await page.getByRole("button", { name: "Back to the Atlas" }).last().click();
  const back = await ev<{ progress: string; label: string; benchHidden: boolean; primary: string; open: number; headingInView: boolean; focus: string }>(page, "(() => { const h = document.querySelector('.hub h2'); const r = h.getBoundingClientRect(); return { progress: document.querySelector('.hub .progress').textContent, label: document.querySelector(\"button[data-quest='w08q2-alhambra']\").textContent, benchHidden: document.querySelector('.bench').hidden, primary: document.querySelector('.hub button.primary').textContent, open: document.querySelectorAll('.hub .world li.open').length, headingInView: r.top >= 0 && r.bottom <= innerHeight, focus: document.activeElement === h ? 'H2' : document.activeElement.tagName }; })()");
  const picture = await ev<{ home: number[]; open: number[] }>(page, "window.__HH__.atlasPicture()");
  const slotKept = await ev<string | null>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.quests?.['w08q2-alhambra'] ? 'recorded' : null");
  record("the Alhambra and the dry fountain can be played with the page's own controls: a grid of buttons of four rows of four that say what each piece is and which sides it is open to, no basin with water at the start, one piece turned by its button and one by a click on the picture each count a move, a piece that cannot be turned is told so and not counted, both questions, the girl, the feather, the pieces turned to the answer, four goals, the note, the links, and the Atlas counts it with world 8 open",
    isPlain && /^Play: The Alhambra$/.test(label ?? "") && /Thirteen quests are built/.test(hubNote) && heading === "The Alhambra" && page1.rows === 4 && page1.perRow.join() === "4,4,4,4" && page1.labels.length === 16 &&
    page1.labels[0] === "Row 1, place 1: a straight channel, open to the right, the left, spout side: the left, has water" && page1.labels[1] === "Row 1, place 2: a branching channel, open to the top, the right, the bottom, dry" &&
    page1.labels.every((x) => /^Row \d, place \d: /.test(x)) && page1.sized && page1.role === "img" && /Basins with water: 0 of 2\. Places where water spills: 1,/.test(page1.alt ?? "") && page1.live === "polite" && page1.inline === 0 && page1.trial &&
    page1.tableRows === 16 && /^What each piece is and which sides/.test(page1.caption) && page1.summary === "Every piece and the sides it is open to, in words" && page1.status === "Water reaches no basin yet. Water leaks at row 1, place 1." && page1.sluice === 0 &&
    start.wet === 0 && start.leaks === 1 && v0.moves === 0 && v0.basins.length === 2 &&
    viaButton.moves === 1 && viaButton.cells[1]!.turn === (v0.cells[1]!.turn + 1) % 4 && /^Row 1, place 2 turned\./.test(said1 ?? "") && viaPicture.moves === 2 && viaPicture.cells[2]!.turn === (v0.cells[2]!.turn + 1) % 4 &&
    blank >= 0 && /^Row 1, place 4 cannot be turned\.$/.test(fixedSaid ?? "") && afterFixed.moves === 2 &&
    /work on the Alhambra began with an aqueduct from the mountains/.test(said) && /Court of the Lions is divided by two paths that cross/.test(said) && /the girl who sweeps the court, an invented person/i.test(said) && asked.flags.slice().sort().join() === "answered,askedCourts,askedWater,feather,kind" &&
    end.done && end.moves === 2 + presses && end.moves === 11 && end.met === 4 && fin.wet === 2 && fin.leaks === 0 && /Basins with water: 2 of 2/.test(end.alt ?? "") && end.focus === "The page is home" && end.saved && end.resume === null && end.notes === 7 && end.disabled &&
    /Quarter turns made: 11/.test(end.progress) && /The water runs to every basin\./.test(end.said) && /^This is a game, not a history\./.test(end.notesText) &&
    end.links.join() === "https://islam.museum/en/building/alhambra/,https://islam.museum/en/building/nasrid-palaces-alhambra/" && /Historical review pending/.test(end.pending) &&
    /\D1\D/.test(` ${back.progress} `) && /^Play again: /.test(back.label) && back.benchHidden && /Ibn al-Haytham/.test(back.primary) && back.open === 13 && picture.open.join() === "1,2,3,4,5,6,7,8,9,10" && picture.home[7] === 1 && slotKept === "recorded" && back.headingInView && back.focus === "H2",
    { label, isPlain, heading, v0, page1: { ...page1, labels: page1.labels.slice(0, 3) }, start, viaButton: { moves: viaButton.moves }, said1, viaPicture: { moves: viaPicture.moves }, fixedSaid, afterFixed: afterFixed.moves, said: said.slice(0, 300), asked: asked.flags, presses, end, fin, back, picture, hubNote });
  await ctx.close();
  // Left in the middle: two turns made, the page loaded again, and the Atlas says Continue; the pieces lie as they did.
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await open(ctx2, "&style=explorer");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  const w0 = await chv(page);
  await btn(page, 1).click();
  await btn(page, 5).click();
  const mid = await chv(page);
  const keptNow = await ev<{ quest: string; snap: { moves: number; turns: number[] } } | null>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null");
  await ev(page, "window.__HH__.saveReady()");
  await page.reload();
  await page.waitForFunction("window.__HH__ && window.__HH__.ready");
  const hubLabels = await ev<{ label: string; restart: number; flying: boolean; primary: string }>(page, "({ label: document.querySelector(\"button[data-quest='w08q2-alhambra']\").textContent, restart: [...document.querySelectorAll('.hub li.open button')].filter((b) => b.textContent === 'Start this quest again').length, flying: window.__HH__.resumed(), primary: document.querySelector('.hub button.primary').textContent })");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  const after = await chv(page);
  const shown = await ev<string[]>(page, "[...document.querySelectorAll('.bench .channel-row button')].map((x) => x.textContent)");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-channels-resumed.png"), fullPage: true });
  record("the Alhambra's channels left in the middle are kept, the Atlas says Continue and offers a new start, and the pieces lie as they did when the quest is opened again",
    mid.moves === 2 && keptNow?.quest === QUEST && keptNow.snap.moves === 2 && keptNow.snap.turns.join() === mid.cells.map((c) => c.turn).join() && /^Continue: /.test(hubLabels.label) && hubLabels.restart === 1 && !hubLabels.flying && /^Play: /.test(hubLabels.primary) &&
    after.cells.map((c) => c.turn).join() === mid.cells.map((c) => c.turn).join() && after.moves === 2 && w0.cells[1]!.turn !== after.cells[1]!.turn && shown.length === 16,
    { w0: w0.cells.map((c) => c.turn).join(), mid: mid.cells.map((c) => c.turn).join(), keptNow, hubLabels, after: after.moves, shown: shown.slice(0, 2) });
  await ctx2.close();
  // The Challenge way of playing shows no water until the sluice is opened; a grid that leaks is refused and the opening is counted; the next turn hides the water again; and a grid turned to the answer is done only when the sluice is opened.
  const ctx3 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await open(ctx3, "&style=challenge");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  const c0 = await ev<{ alt: string | null; status: string; sluice: number; labels: string[]; rows: number; perRow: string; objective: string }>(page, "({ alt: document.querySelector('.bench canvas.channels-art').getAttribute('aria-label'), status: document.querySelector('.bench .ran .status').textContent, sluice: [...document.querySelectorAll('.bench button')].filter((x) => x.textContent === 'Open the sluice').length, labels: [...document.querySelectorAll('.bench .channel-row button')].map((x) => x.textContent), rows: document.querySelectorAll('.bench ol.channel-row').length, perRow: [...document.querySelectorAll('.bench ol.channel-row')].map((o) => o.querySelectorAll('button').length).join(), objective: document.querySelector('.bench .objective-line').textContent })");
  const cv0 = await chv(page);
  await page.getByRole("button", { name: "Open the sluice" }).click();
  const c1 = { v: await chv(page), said: await page.locator(".bench .ran").textContent(), alt: await page.locator(".bench canvas.channels-art").getAttribute("aria-label"), labels: await ev<string[]>(page, "[...document.querySelectorAll('.bench .channel-row button')].slice(10, 12).map((x) => x.textContent)") };
  await btn(page, 11).click();
  const c2 = { v: await chv(page), said: await page.locator(".bench .ran").textContent(), alt: await page.locator(".bench canvas.channels-art").getAttribute("aria-label") };
  // Turned to the answer by the page's own state: done only when the sluice is opened.
  for (;;) {
    const s = await chv(page);
    const todo = remaining(s);
    if (todo.length === 0) break;
    await btn(page, todo[0]!).click();
  }
  const ready = await ev<{ done: boolean; results: boolean; alt: string | null }>(page, "({ done: window.__HH__.channels().done, results: !document.querySelector('.bench .results').hidden, alt: document.querySelector('.bench canvas.channels-art').getAttribute('aria-label') })");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-channels-challenge.png"), fullPage: true });
  await page.getByRole("button", { name: "Open the sluice" }).click();
  const c3 = await ev<{ done: boolean; openings: number; results: boolean; progress: string; moves: number; met: number }>(page, "({ done: window.__HH__.channels().done, openings: window.__HH__.channels().openings, results: !document.querySelector('.bench .results').hidden, progress: document.querySelector('.bench .results > p').textContent, moves: window.__HH__.channels().moves, met: document.querySelectorAll('.bench .results .goals .met').length })");
  record("the Alhambra's Challenge page shows no water until the sluice is opened; a grid that spills is refused and the opening is counted; a turn hides the water again; and a grid turned to the answer is done only when the sluice is opened",
    /^The sluice is shut|sluice is shut/.test(c0.alt ?? "") && /The water is not shown until you open the sluice\./.test(c0.status) && c0.sluice === 1 && c0.rows === 5 && c0.perRow === "5,5,5,5,5" && c0.labels.length === 25 && c0.labels.every((x) => !/has water|, dry$/.test(x)) && /spills nowhere/.test(c0.objective) &&
    cv0.cells.length === 25 && cv0.basins.length === 2 && cv0.last === null &&
    c1.v.openings === 1 && !c1.v.done && c1.v.last?.type === "open" && /The sluice is open\./.test(c1.said ?? "") && /Water reaches no basin yet\./.test(c1.said ?? "") && /Water leaks at row 4, place 1\./.test(c1.said ?? "") && /Basins with water: 0 of 2/.test(c1.alt ?? "") && c1.labels.every((x) => /dry|has water/.test(x)) &&
    c2.v.moves === 1 && c2.v.last?.type === "turn" && /^Row 3, place 2 turned\./.test(c2.said ?? "") && /The water is not shown until you open the sluice\./.test(c2.said ?? "") && /sluice is shut/.test(c2.alt ?? "") &&
    !ready.done && !ready.results && /sluice is shut/.test(ready.alt ?? "") && c3.done && c3.openings === 1 && c3.results && c3.moves === 15 && /Times the sluice was opened in vain: 1/.test(c3.progress) && c3.met === 1,
    { c0: { ...c0, labels: c0.labels.slice(0, 2) }, c1, c2, ready, c3 });
  await ctx3.close();
  // The page in Arabic runs right to left with Arabic numerals; the first column is on the right in the button grid and in the picture's own touch, which is its mirror image.
  const arCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const ar = await arCtx.newPage();
  ar.on("pageerror", (e) => errors.push(String(e)));
  await ar.goto(`${served.base}/games/hudhud/index.html?lang=ar&music=off&style=explorer`);
  await ar.waitForFunction("window.__HH__ && window.__HH__.ready");
  await leaveOpening(ar);
  await ar.locator(`.hub button[data-quest='${QUEST}']`).click();
  const a0 = await chv(ar);
  const arView = await ev<{ dir: string; heading: string; first: string; second: string; alt: string | null; x: number[]; table: string; cols: string[] }>(ar, "({ dir: document.documentElement.dir, heading: document.querySelector('.bench h2').textContent, first: document.querySelector('.bench .channel-row button').textContent, second: document.querySelectorAll('.bench .channel-row button')[1].textContent, alt: document.querySelector('.bench canvas.channels-art').getAttribute('aria-label'), x: [...document.querySelectorAll('.bench ol.channel-row')[0].querySelectorAll('button')].map((b) => Math.round(b.getBoundingClientRect().left)), table: document.querySelector('.bench details.edges summary').textContent, cols: [...document.querySelectorAll('.bench details.edges thead th')].map((t) => t.textContent) })");
  if (outDir) await ar.screenshot({ path: resolve(outDir, "hudhud-channels-bench-ar.png"), fullPage: true });
  // Touch the second place in the picture (to the left of the first) and then the first (on the right).
  await ar.mouse.click(...(await spot(ar, 1, a0.rows, a0.cols, true)));
  const t1 = await chv(ar);
  await ar.mouse.click(...(await spot(ar, 0, a0.rows, a0.cols, true)));
  const t2 = await chv(ar);
  record("the Alhambra's channels in Arabic run right to left with Arabic numerals, put the first column on the right in the button grid and in a touch on the picture, and name the pieces and the sides from the right",
    arView.dir === "rtl" && arView.heading === "قصر الحمراء" && /^الصف ١، الموضع ١: ساقية مستقيمة، الجهات المفتوحة: /.test(arView.first) && /الموضع ٢: ساقية متفرعة/.test(arView.second) && /٢/.test(arView.alt ?? "") && arView.x.length === 4 && arView.x[0]! > arView.x[1]! && arView.x[1]! > arView.x[2]! && arView.x[2]! > arView.x[3]! &&
    arView.table === "كل قطعة والجهات المفتوحة منها بالكلمات" && arView.cols.join("|") === "الموضع|القطعة|الجهات المفتوحة|ملاحظة" &&
    t1.moves === 1 && t1.cells[1]!.turn === (a0.cells[1]!.turn + 1) % 4 && t1.cells[0]!.turn === a0.cells[0]!.turn && t2.moves === 2 && t2.cells[0]!.turn === (a0.cells[0]!.turn + 1) % 4,
    { arView: { ...arView, alt: (arView.alt ?? "").slice(0, 80) }, t1: t1.cells.slice(0, 2), t2: t2.cells.slice(0, 2) });
  await arCtx.close();
  // Movement kept still: with `motion=reduced` the water is simply there; without it the water is shown running, a step at a time.
  const calmCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const calmPage = await open(calmCtx, "&style=explorer&motion=reduced");
  await calmPage.locator(`.hub button[data-quest='${QUEST}']`).click();
  await calmPage.locator(".bench .channel-row button[data-place='1']").click();
  const calmBusy = await ev<boolean>(calmPage, "window.__HH__.channels().busy");
  await calmPage.locator(".bench .channel-row button[data-place='2']").click();
  const calmBusy2 = await ev<boolean>(calmPage, "window.__HH__.channels().busy");
  const calmWet = wetBasins(await chv(calmPage));
  if (outDir) await calmPage.screenshot({ path: resolve(outDir, "hudhud-channels-reduced.png"), fullPage: true });
  await calmCtx.close();
  const runCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const runPage = await open(runCtx, "&style=explorer");
  await runPage.locator(`.hub button[data-quest='${QUEST}']`).click();
  await runPage.locator(".bench .channel-row button[data-place='1']").click();
  await runPage.locator(".bench .channel-row button[data-place='2']").click();
  const sawRunning = await runPage.waitForFunction("window.__HH__.channels().busy === true", undefined, { timeout: 600, polling: 5 }).then(() => true, () => false);
  await runPage.waitForFunction("window.__HH__.channels().busy === false", undefined, { timeout: 3000 });
  await runCtx.close();
  record("the Alhambra's water follows the game's helper for movement kept still: with motion=reduced the water is never shown running, and without it a run is shown a step at a time and then stops",
    !calmBusy && !calmBusy2 && sawRunning,
    { calmBusy, calmBusy2, calmWet, sawRunning });
}
// The twelfth quest, al-Razi and the loose leaves: the row page shared with the paper of Samarkand. A list of choices for
// every place, ordered by name; a wrong row is bound and the page says, leaf by leaf, how far it held; both questions,
// the child answered kindly, the feather; the row put in order by the lists and one exchange by two touches on the
// picture; four goals, the note (which says there is no medical advice), the links, and the Atlas counts it (world 4 is
// open). Then one leaf moved, the page loaded again, and "Continue"; Story and Challenge; the page in Arabic, with the
// row from the right; and a binding shown a step at a time, or at once with motion=reduced.
{
  const QUEST = "w04q4-al-razi";
  const ANSWER = ["books-head", "own-head", "books-chest", "own-chest", "books-foot", "own-foot"];
  type LeavesView = { moves: number; par: number; flags: string[]; done: boolean; places: string[]; selected: number | null; status: string; busy: boolean; runs: number };
  const lv = (page: Page) => ev<LeavesView>(page, "(() => { const a = window.__HH__.leaves(); return { moves: a.moves, par: a.par, flags: a.flags, done: a.done, places: a.puzzle.places, selected: a.selected, status: a.status, busy: a.busy, runs: a.runs }; })()");
  /** The middle of a place in the picture's space (the paper's row, shared), turned into where to click on the canvas. */
  const at = async (page: Page, i: number, n: number, rtl: boolean): Promise<[number, number]> => {
    await page.locator(".bench canvas.leaves-art").scrollIntoViewIfNeeded();
    const box = (await page.locator(".bench canvas.leaves-art").boundingBox())!;
    return [box.x + (placeX(n, i, rtl) / PAPER_ART.w) * box.width, box.y + (PAPER_ART.y / PAPER_ART.h) * box.height];
  };
  const idle = (page: Page) => page.waitForFunction("window.__HH__.leaves() && !window.__HH__.leaves().busy");
  const pick = (page: Page, place: number, leaf: string) => page.locator(`.bench select[data-place='${place}']`).selectOption(leaf);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  let page = await open(ctx, "&style=explorer");
  const button = page.locator(`.hub button[data-quest='${QUEST}']`);
  const isPlain = await button.evaluate((b) => !b.classList.contains("primary"));
  const label = await button.textContent();
  const hubNote = await ev<string>(page, "[...document.querySelectorAll('.hub p.small')].map((p) => p.textContent).join(' | ')");
  await button.click();
  await page.waitForFunction("window.__HH__.leaves() !== null");
  const heading = await page.locator(".bench h2").textContent();
  const page1 = await ev<{ selects: number; labels: string[]; values: string[]; options: string[]; alt: string | null; role: string | null; inline: number; trial: boolean; live: string | null; focus: string; sized: boolean; go: boolean; places: string[] }>(page, "(() => ({ selects: document.querySelectorAll('.bench select[data-place]').length, labels: [...document.querySelectorAll('.bench .places label > span')].map((s) => s.textContent.trim()), values: [...document.querySelector(\"select[data-place='0']\").options].map((o) => o.value), options: [...document.querySelector(\"select[data-place='0']\").options].map((o) => o.textContent), alt: document.querySelector('.bench canvas.leaves-art').getAttribute('aria-label'), role: document.querySelector('.bench canvas.leaves-art').getAttribute('role'), inline: document.querySelectorAll('.bench [style]:not(canvas)').length, trial: /first trial/.test(document.querySelector('.bench').textContent), live: document.querySelector('.bench .ran').getAttribute('aria-live'), focus: document.activeElement.tagName, sized: [...document.querySelectorAll('.bench select[data-place]')].every((s) => s.getBoundingClientRect().height >= 44), go: [...document.querySelectorAll('.bench button')].some((b) => b.textContent === 'Bind the notebook'), places: window.__HH__.leaves().puzzle.places }))()");
  const byName = [...page1.options].sort((a, b) => a.localeCompare(b, "en")).join("|") === page1.options.join("|") && page1.values.join() !== ANSWER.join();
  // A wrong row, bound as it lies: the head's leaf of what the books say holds, and the second place stops it.
  await page.getByRole("button", { name: "Bind the notebook" }).click();
  await idle(page);
  const wrong = { v: await lv(page), said: (await page.locator(".bench .ran").textContent()) ?? "" };
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-leaves-bench.png"), fullPage: true });
  // Both questions; the child, kindly; the feather.
  await page.getByRole("button", { name: "Ask about his notebooks" }).click();
  const said1 = (await page.locator(".bench .said").textContent()) ?? "";
  await page.getByRole("button", { name: "Ask about what he saw himself" }).click();
  const said2 = (await page.locator(".bench .said").textContent()) ?? "";
  await page.getByRole("button", { name: "Talk to the child who helps" }).click();
  await page.getByRole("button", { name: "It is all right. We will put them back in order together." }).click();
  await page.getByRole("button", { name: "Look between the leaves" }).click();
  const asked = await lv(page);
  // Two leaves by the lists (each an exchange with the place it stood in), then the fourth and fifth places by two touches on the picture.
  await pick(page, 1, "own-head");
  await pick(page, 2, "books-chest");
  const byLists = await lv(page);
  await page.mouse.click(...(await at(page, 3, 6, false)));
  const chose = await lv(page);
  await page.mouse.click(...(await at(page, 4, 6, false)));
  const moved = await lv(page);
  const selectValues = await ev<string[]>(page, "[...document.querySelectorAll('.bench select[data-place]')].map((s) => s.value)");
  await page.getByRole("button", { name: "Bind the notebook" }).click();
  await page.waitForSelector(".bench .results:not([hidden])");
  const end = await ev<{ done: boolean; moves: number; par: number; met: number; focus: string; links: string[]; pending: string; saved: boolean; resume: unknown; notes: number; notesText: string; disabled: boolean; ran: string }>(page, "({ done: window.__HH__.leaves().done, moves: window.__HH__.leaves().moves, par: window.__HH__.leaves().par, met: document.querySelectorAll('.bench .results .goals .met').length, focus: document.activeElement ? document.activeElement.textContent : '', links: [...document.querySelectorAll('.bench .results a')].map((a) => a.getAttribute('href')), pending: document.querySelector('.bench .results .pending').textContent, saved: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.quests?.['w04q4-al-razi']?.done === true, resume: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null, notes: document.querySelectorAll('.bench .results .note p').length, notesText: [...document.querySelectorAll('.bench .results .note p')].map((p) => p.textContent).join(' | '), disabled: [...document.querySelectorAll('.bench select[data-place]')].every((x) => x.disabled), ran: document.querySelector('.bench .ran').textContent })");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-leaves-results.png"), fullPage: true });
  await page.getByRole("button", { name: "Back to the Atlas" }).last().click();
  const back = await ev<{ progress: string; label: string; benchHidden: boolean; primary: string; open: number; headingInView: boolean; focus: string }>(page, "(() => { const h = document.querySelector('.hub h2'); const r = h.getBoundingClientRect(); return { progress: document.querySelector('.hub .progress').textContent, label: document.querySelector(\"button[data-quest='w04q4-al-razi']\").textContent, benchHidden: document.querySelector('.bench').hidden, primary: document.querySelector('.hub button.primary').textContent, open: document.querySelectorAll('.hub .world li.open').length, headingInView: r.top >= 0 && r.bottom <= innerHeight, focus: document.activeElement === h ? 'H2' : document.activeElement.tagName }; })()");
  const picture = await ev<{ home: number[]; open: number[] }>(page, "window.__HH__.atlasPicture()");
  record("al-Razi's loose leaves can be played with the page's own controls: six places with choices ordered by name, a wrong row is bound and the page says how far it held, both questions, the child, the feather, the row put in order by the lists and one exchange by two touches on the picture, four goals, the note with no medical advice, the links, and the Atlas counts it with world 4 open",
    isPlain && /^Play: al-Razi$/.test(label ?? "") && /Thirteen quests are built/.test(hubNote) && heading === "al-Razi" && page1.selects === 6 && page1.labels.join("|") === "Place 1|Place 2|Place 3|Place 4|Place 5|Place 6" && page1.options.length === 6 && byName && page1.options.includes("Head: what the books say") && page1.options.includes("Foot: what he saw himself") &&
    page1.role === "img" && /6 places/.test(page1.alt ?? "") && /closed book/.test(page1.alt ?? "") && page1.live === "polite" && page1.inline === 0 && page1.trial && page1.sized && page1.go && page1.focus === "H2" && page1.places.join() === "books-head,own-chest,own-head,books-foot,books-chest,own-foot" &&
    !wrong.v.done && wrong.v.runs === 1 && wrong.v.moves === 0 && wrong.v.busy === false && /The leaf of the head with what the books say is bound in\./.test(wrong.said) && /The leaf in place 2 does not follow from what came before it\. The binding stops there\./.test(wrong.said) && /The notebook had been bound as far as: the head, what the books say\./.test(wrong.said) && !/This place needs/.test(wrong.said) &&
    /twenty-five volumes/.test(said1) && /usually closes the sections/.test(said2) && asked.flags.slice().sort().join() === "answered,askedNotes,askedOwn,feather,kind" &&
    byLists.moves === 2 && chose.selected === 3 && /Place 4 is chosen/.test(chose.status) && moved.selected === null && moved.moves === 3 && moved.places.join() === ANSWER.join() && selectValues.join() === ANSWER.join() &&
    end.done && end.moves === 3 && end.par === 3 && end.met === 4 && end.focus === "The page is home" && end.saved && end.resume === null && end.notes === 7 && end.disabled && /The notebook is bound, and every leaf is in its place\./.test(end.ran) && /There is no medical advice in this game\./.test(end.notesText) &&
    end.links.join() === "https://islam.museum/en/person/al-razi-abu-bakr/,https://islam.museum/en/work/al-hawi-fi-al-tibb/" && /Historical review pending/.test(end.pending) &&
    /\D1\D/.test(` ${back.progress} `) && /^Play again: /.test(back.label) && back.benchHidden && /Ibn al-Haytham/.test(back.primary) && back.open === 13 && picture.open.join() === "1,2,3,4,5,6,7,8,9,10" && picture.home[3] === 1 && back.headingInView && back.focus === "H2",
    { label, isPlain, heading, page1, byName, wrong, said1: said1.slice(-160), said2: said2.slice(-160), asked, byLists, chose, moved, selectValues, end: { ...end, notesText: end.notesText.slice(0, 200) }, back, picture, hubNote: hubNote.slice(0, 300) });
  await ctx.close();
  // Left in the middle: one leaf moved and a question asked, the page loaded again, and the Atlas says Continue; the row and the question are where they were.
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await open(ctx2, "&style=explorer");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  await pick(page, 1, "own-head");
  await page.getByRole("button", { name: "Ask about his notebooks" }).click();
  const mid = await lv(page);
  const keptNow = await ev<{ quest: string; snap: { moves: number; places: string[]; flags: string[] } } | null>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null");
  await ev(page, "window.__HH__.saveReady()");
  await page.reload();
  await page.waitForFunction("window.__HH__ && window.__HH__.ready");
  const hubLabels = await ev<{ label: string; restart: number; flying: boolean; primary: string }>(page, "({ label: document.querySelector(\"button[data-quest='w04q4-al-razi']\").textContent, restart: [...document.querySelectorAll('.hub li.open button')].filter((b) => b.textContent === 'Start this quest again').length, flying: window.__HH__.resumed(), primary: document.querySelector('.hub button.primary').textContent })");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  const after = await lv(page);
  const shownValues = await ev<string[]>(page, "[...document.querySelectorAll('.bench select[data-place]')].map((s) => s.value)");
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-leaves-resumed.png"), fullPage: true });
  const midRow = "books-head,own-head,own-chest,books-foot,books-chest,own-foot";
  record("al-Razi's loose leaves left in the middle are kept, the Atlas says Continue and offers a new start, and the row stands where it was when the quest is opened again",
    mid.moves === 1 && keptNow?.quest === QUEST && keptNow.snap.moves === 1 && keptNow.snap.places.join() === midRow && keptNow.snap.flags.join() === "askedNotes" && /^Continue: al-Razi$/.test(hubLabels.label) && hubLabels.restart === 1 && !hubLabels.flying && /^Play: /.test(hubLabels.primary) &&
    after.moves === 1 && after.flags.join() === "askedNotes" && after.done === false && shownValues.join() === midRow,
    { mid, keptNow, hubLabels, after, shownValues });
  await ctx2.close();
  // The three ways of playing explain a failed binding differently: Story says which part comes next, Challenge only where it stopped.
  const ctx3 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const failed: Record<string, { places: number; selects: number; said: string; at: number; alt: string | null }> = {};
  for (const style of ["story", "challenge"]) {
    page = await open(ctx3, `&style=${style}`);
    await page.locator(`.hub button[data-quest='${QUEST}']`).click();
    await page.getByRole("button", { name: "Bind the notebook" }).click();
    await idle(page);
    failed[style] = await ev<{ places: number; selects: number; said: string; at: number; alt: string | null }>(page, "({ places: window.__HH__.leaves().puzzle.places.length, selects: document.querySelectorAll('.bench select[data-place]').length, said: document.querySelector('.bench .ran').textContent, at: window.__HH__.leaves().last.at, alt: document.querySelector('.bench canvas.leaves-art').getAttribute('aria-label') })");
    if (outDir && style === "challenge") await page.screenshot({ path: resolve(outDir, "hudhud-leaves-challenge.png"), fullPage: true });
    await page.close();
  }
  record("al-Razi's loose leaves have four leaves in Story, which says which part comes next, and eight in Challenge, which says only where the binding stopped",
    failed.story!.places === 4 && failed.story!.selects === 4 && failed.story!.at === 0 && /The leaf in place 1 does not follow from what came before it\. The binding stops there\./.test(failed.story!.said) && /This place needs the leaf of the head\./.test(failed.story!.said) && !/bound as far as/.test(failed.story!.said) &&
    failed.challenge!.places === 8 && failed.challenge!.selects === 8 && /8 places/.test(failed.challenge!.alt ?? "") && failed.challenge!.at === 0 && failed.challenge!.said.trim() === "The leaf in place 1 does not follow from what came before it. The binding stops there.",
    failed);
  await ctx3.close();
  // The page in Arabic runs right to left with Arabic numerals; the first place is on the right, in the list and in a touch on the picture.
  const arCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const ar = await arCtx.newPage();
  ar.on("pageerror", (e) => errors.push(String(e)));
  await ar.goto(`${served.base}/games/hudhud/index.html?lang=ar&music=off&style=explorer`);
  await ar.waitForFunction("window.__HH__ && window.__HH__.ready");
  await leaveOpening(ar);
  await ar.locator(`.hub button[data-quest='${QUEST}']`).click();
  const a0 = await lv(ar);
  const arView = await ev<{ dir: string; heading: string; firstLabel: string; alt: string | null; go: string; first: string; x: number[] }>(ar, "({ dir: document.documentElement.dir, heading: document.querySelector('.bench h2').textContent, firstLabel: document.querySelector('.bench .places label > span').textContent.trim(), alt: document.querySelector('.bench canvas.leaves-art').getAttribute('aria-label'), go: [...document.querySelectorAll('.bench p button.primary')].map((b) => b.textContent).join(), first: document.querySelector(\"select[data-place='0'] option:checked\").textContent, x: [...document.querySelectorAll('.bench .places > li')].slice(0, 2).map((li) => Math.round(li.getBoundingClientRect().left)) })");
  if (outDir) await ar.screenshot({ path: resolve(outDir, "hudhud-leaves-bench-ar.png"), fullPage: true });
  // Touch the first place (the right-most) and then the third (the third from the right): the two leaves change places.
  await ar.mouse.click(...(await at(ar, 0, 6, true)));
  const t1 = await lv(ar);
  await ar.mouse.click(...(await at(ar, 2, 6, true)));
  const t2 = await lv(ar);
  record("al-Razi's loose leaves in Arabic run right to left with Arabic numerals, put the first place on the right in the list, in the picture and in a touch on it, and name the leaves in Arabic",
    arView.dir === "rtl" && arView.heading === "الرازي" && arView.firstLabel === "المكان ١" && /٦/.test(arView.alt ?? "") && arView.go === "اربط الدفتر" && arView.first === "الرأس: ما تقوله الكتب" && arView.x[0]! > arView.x[1]! &&
    placeX(6, 0, true) > placeX(6, 5, true) && t1.selected === 0 && t2.selected === null && t2.moves === 1 && t2.places[0] === a0.places[2] && t2.places[2] === a0.places[0],
    { arView, a0: a0.places, t1: t1.selected, t2: { moves: t2.moves, places: t2.places } });
  await arCtx.close();
  // A binding of the whole row is shown a leaf at a time; with motion=reduced it is bound at once.
  const bindFor = async (query: string) => {
    const c = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const p = await open(c, `&style=explorer${query}`);
    await p.locator(`.hub button[data-quest='${QUEST}']`).click();
    await ev(p, `(() => { const want = ${JSON.stringify(ANSWER)}; want.forEach((leaf, place) => window.__HH__.leavesCommand({ type: "put", place, part: leaf })); })()`);
    const t0 = Date.now();
    await p.getByRole("button", { name: "Bind the notebook" }).click();
    const sawRunning = query ? null : await p.waitForFunction("window.__HH__.leaves().busy === true", undefined, { timeout: 400, polling: 5 }).then(() => true, () => false);
    await p.waitForFunction("window.__HH__.leaves() && !window.__HH__.leaves().busy", undefined, { timeout: 30000 });
    const took = Date.now() - t0;
    const done = await ev<boolean>(p, "window.__HH__.leaves().done");
    if (outDir && query) await p.screenshot({ path: resolve(outDir, "hudhud-leaves-reduced.png"), fullPage: true });
    await c.close();
    return { took, sawRunning, done };
  };
  const plain = await bindFor("");
  const calm = await bindFor("&motion=reduced");
  record("al-Razi's loose leaves follow the game's helper for movement kept still: a binding is shown a leaf at a time, and with motion=reduced it is bound at once",
    plain.done && plain.sawRunning === true && plain.took >= 750 * 5 && calm.done && calm.took < 700,
    { plain, calm });
}
// The thirteenth quest, Karima and the copies: a table of real buttons, one for every sign of every copy, in the
// picture's rows and columns. Opened in Explorer: three rows of sixteen buttons; a wrong mark is refused, counted and
// said; both questions, the boy answered kindly, the feather; one slip marked by a click on the picture, then taken away
// and marked again by its button, and the rest by their buttons; four goals, the three notes, the link, "Historical
// review pending", and the Atlas counts it with every one of the ten worlds open. Then a mark and a question kept over a
// reload ("Continue"); the Challenge page, which never says how many slips remain; the page in Arabic, right to left,
// with place 1 on the right in the table and in the picture; and a run with motion=reduced, where nothing moves.
{
  const QUEST = "w05q3-karima-al-marwaziyya";
  // The Explorer's slips, (copy, place) from 0: copy 2 at place 2 is marked on the picture, the rest by their buttons.
  const SLIPS: [number, number][] = [[1, 1], [0, 4], [2, 7], [1, 9], [2, 12], [0, 14]];
  type CollateView = { marks: { copy: number; place: number }[]; wrong: number; flags: string[]; done: boolean; copies: string[][]; status: string; busy: boolean };
  const cv = (page: Page) => ev<CollateView>(page, "(() => { const a = window.__HH__.collate(); return { marks: a.marks, wrong: a.wrong, flags: a.flags, done: a.done, copies: a.puzzle.copies, status: a.status, busy: a.busy }; })()");
  /** The middle of a copy's sign in the picture's space, turned into where to click on the canvas. */
  const spot = async (page: Page, copy: number, place: number, copies: number, n: number, rtl: boolean): Promise<[number, number]> => {
    await page.locator(".bench canvas.collate-art").scrollIntoViewIfNeeded();
    const box = (await page.locator(".bench canvas.collate-art").boundingBox())!;
    const c = cellCentre(copy, place, copies, n, rtl);
    return [box.x + (c.x / COLLATE_ART.w) * box.width, box.y + (c.y / COLLATE_ART.h) * box.height];
  };
  const cell = (page: Page, copy: number, place: number) => page.locator(`.bench .collate-table button[data-copy='${copy}'][data-place='${place}']`);
  const label = (page: Page, copy: number, place: number) => cell(page, copy, place).getAttribute("aria-label");
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  let page = await open(ctx, "&style=explorer");
  const button = page.locator(`.hub button[data-quest='${QUEST}']`);
  const isPlain = await button.evaluate((b) => !b.classList.contains("primary"));
  const hubLabel = await button.textContent();
  const hubNote = await ev<string>(page, "[...document.querySelectorAll('.hub p.small')].map((p) => p.textContent).join(' | ')");
  await button.click();
  await page.waitForFunction("window.__HH__.collate() !== null");
  const heading = await page.locator(".bench h2").textContent();
  const page1 = await ev<{ rows: number; perRow: number[]; first: string | null; last: string | null; firstText: string; alt: string | null; role: string | null; live: string | null; inline: number; trial: boolean; focus: string; sized: boolean; pressed: string[]; caption: string; rowHeads: string[]; region: string | null; hers: boolean }>(page, "(() => { const bs = [...document.querySelectorAll('.bench .collate-table tbody button')]; return { rows: document.querySelectorAll('.bench .collate-table tbody tr').length, perRow: [...document.querySelectorAll('.bench .collate-table tbody tr')].map((tr) => tr.querySelectorAll('button').length), first: bs[0].getAttribute('aria-label'), last: bs[bs.length - 1].getAttribute('aria-label'), firstText: bs[0].textContent, alt: document.querySelector('.bench canvas.collate-art').getAttribute('aria-label'), role: document.querySelector('.bench canvas.collate-art').getAttribute('role'), live: document.querySelector('.bench .ran').getAttribute('aria-live'), inline: document.querySelectorAll('.bench [style]:not(canvas)').length, trial: /first trial/.test(document.querySelector('.bench').textContent), focus: document.activeElement.tagName, sized: bs.every((b) => { const r = b.getBoundingClientRect(); return r.height >= 44 && r.width >= 44; }), pressed: bs.map((b) => b.getAttribute('aria-pressed')), caption: document.querySelector('.bench .collate-table caption').textContent, rowHeads: [...document.querySelectorAll('.bench .collate-table tbody th')].map((t) => t.textContent), region: document.querySelector('.bench .collate-table').getAttribute('role'), hers: document.querySelector('.bench').textContent.includes('In this way of playing there are two copies') }; })()");
  // A wrong mark: copy 1 at place 2 agrees with copy 3, so it is not a slip; it is refused, counted and said.
  await cell(page, 0, 1).click();
  const wrong = { v: await cv(page), said: (await page.locator(".bench .ran").textContent()) ?? "", pressed: await cell(page, 0, 1).getAttribute("aria-pressed") };
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-collate-bench.png"), fullPage: true });
  // Both questions; the boy, kindly; the feather.
  await page.getByRole("button", { name: "Ask who Karima was" }).click();
  const said1 = (await page.locator(".bench .said").textContent()) ?? "";
  await page.getByRole("button", { name: "Ask about her book" }).click();
  const said2 = (await page.locator(".bench .said").textContent()) ?? "";
  await page.getByRole("button", { name: "Talk to the boy who carries the copies" }).click();
  await page.getByRole("button", { name: "You spoiled nothing. Slips happen when a page is copied. We will find them together." }).click();
  await page.getByRole("button", { name: "Look between the copies" }).click();
  const asked = await cv(page);
  // Copy 2, place 2 marked by a click on its sign in the picture.
  await page.mouse.click(...(await spot(page, 1, 1, 3, 16, false)));
  const byPicture = { v: await cv(page), said: (await page.locator(".bench .ran").textContent()) ?? "", label: await label(page, 1, 1), pressed: await cell(page, 1, 1).getAttribute("aria-pressed"), alt: await page.locator(".bench canvas.collate-art").getAttribute("aria-label") };
  // Its button takes the mark away, and marks it again.
  await cell(page, 1, 1).click();
  const unmarked = { v: await cv(page), said: (await page.locator(".bench .ran").textContent()) ?? "", label: await label(page, 1, 1) };
  await cell(page, 1, 1).click();
  // The rest by their buttons.
  for (const [c, p] of SLIPS.slice(1)) await cell(page, c, p).click();
  await page.waitForSelector(".bench .results:not([hidden])");
  const end = await ev<{ done: boolean; marks: number; wrong: number; met: number; focus: string; links: string[]; pending: string; saved: boolean; resume: unknown; notes: number; notesText: string; disabled: boolean; ran: string; said: string }>(page, `({ done: window.__HH__.collate().done, marks: window.__HH__.collate().marks.length, wrong: window.__HH__.collate().wrong, met: document.querySelectorAll('.bench .results .goals .met').length, focus: document.activeElement ? document.activeElement.textContent : '', links: [...document.querySelectorAll('.bench .results a')].map((a) => a.getAttribute('href')), pending: document.querySelector('.bench .results .pending').textContent, saved: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.quests?.['${QUEST}']?.done === true, resume: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null, notes: document.querySelectorAll('.bench .results .note p').length, notesText: [...document.querySelectorAll('.bench .results .note p')].map((p) => p.textContent).join(' | '), disabled: [...document.querySelectorAll('.bench .collate-table button')].every((x) => x.disabled), ran: document.querySelector('.bench .ran').textContent, said: document.querySelector('.bench .said').textContent })`);
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-collate-results.png"), fullPage: true });
  await page.getByRole("button", { name: "Back to the Atlas" }).last().click();
  const back = await ev<{ progress: string; label: string; benchHidden: boolean; primary: string; open: number; headingInView: boolean; focus: string; worldFive: string }>(page, `(() => { const h = document.querySelector('.hub h2'); const r = h.getBoundingClientRect(); return { progress: document.querySelector('.hub .progress').textContent, label: document.querySelector("button[data-quest='${QUEST}']").textContent, benchHidden: document.querySelector('.bench').hidden, primary: document.querySelector('.hub button.primary').textContent, open: document.querySelectorAll('.hub .world li.open').length, headingInView: r.top >= 0 && r.bottom <= innerHeight, focus: document.activeElement === h ? 'H2' : document.activeElement.tagName, worldFive: document.querySelector("h3[data-world='5']").closest('section').textContent }; })()`);
  const picture = await ev<{ home: number[]; open: number[] }>(page, "window.__HH__.atlasPicture()");
  record("Karima's copies can be played with the page's own controls: three rows of sixteen real buttons each labelled with its copy, place and sign, a wrong mark that is refused, counted and said, both questions, the boy, the feather, a slip marked by a click on the picture and taken away and marked again by its button, every slip marked, four goals, the three notes, the link, Historical review pending, and the Atlas counts it with all ten worlds open",
    isPlain && /^Play: Karima al-Marwaziyya$/.test(hubLabel ?? "") && /Thirteen quests are built/.test(hubNote) && heading === "Karima al-Marwaziyya" &&
    page1.rows === 3 && page1.perRow.join() === "16,16,16" && page1.first === "Copy 1, place 1: a star of six points" && page1.last === "Copy 3, place 16: a key" && page1.firstText === "a star of six points" && page1.caption.startsWith("The copies, sign by sign.") && page1.rowHeads.join("|") === "Copy 1, her copy|Copy 2|Copy 3" && page1.region === "region" && !page1.hers &&
    page1.role === "img" && /3 copies, each a row of 16 drawn signs/.test(page1.alt ?? "") && /Slips still to find: 6\./.test(page1.alt ?? "") && page1.live === "polite" && page1.inline === 0 && page1.trial && page1.focus === "H2" && page1.sized && page1.pressed.every((x) => x === "false") &&
    wrong.v.wrong === 1 && wrong.v.marks.length === 0 && wrong.pressed === "false" && /Copy 1, place 2 agrees with another copy: not a slip\./.test(wrong.said) && /Slips still to find: 6\./.test(wrong.said) &&
    /transmitted the Sahih on the authority of al-Kushmihani/.test(said1) && /leading scholars read hadith with her/.test(said2) && asked.flags.slice().sort().join() === "answered,askedBook,askedWho,feather,kind" &&
    byPicture.v.marks.length === 1 && byPicture.v.marks[0]!.copy === 1 && byPicture.v.marks[0]!.place === 1 && /Copy 2, place 2 marked: it differs from the other copies\./.test(byPicture.said) && /Slips still to find: 5\./.test(byPicture.said) && byPicture.label === "Copy 2, place 2: a leaf, marked as a slip" && byPicture.pressed === "true" && /Slips marked: 1\. Slips still to find: 5\./.test(byPicture.alt ?? "") &&
    unmarked.v.marks.length === 0 && unmarked.v.wrong === 1 && /Copy 2, place 2 is no longer marked\./.test(unmarked.said) && unmarked.label === "Copy 2, place 2: a leaf" &&
    end.done && end.marks === 6 && end.wrong === 1 && end.met === 4 && end.focus === "The page is home" && end.saved && end.resume === null && end.notes === 5 && end.disabled && /Every slip is marked, and the copies agree again\./.test(end.ran) && /Every slip is found, and the page of the Atlas is free again!/.test(end.said) &&
    /what two copies agree on is right, is the game's own/.test(end.notesText) && /among them al-Khatib\. She died at Mecca in 463 of the Hijra\./.test(end.notesText) &&
    end.links.join() === "https://islam.museum/en/person/karima-al-marwaziyya/" && /^Historical review pending/.test(end.pending) &&
    /\D1\D/.test(` ${back.progress} `) && /^Play again: Karima al-Marwaziyya$/.test(back.label) && back.benchHidden && /Ibn al-Haytham/.test(back.primary) && back.open === 13 && picture.open.join() === "1,2,3,4,5,6,7,8,9,10" && picture.home[4] === 1 && back.headingInView && back.focus === "H2" && /Play again: Karima al-Marwaziyya/.test(back.worldFive),
    { hubLabel, isPlain, heading, page1: { ...page1, pressed: page1.pressed.length }, wrong, said1: said1.slice(-200), said2: said2.slice(-160), asked: asked.flags, byPicture: { ...byPicture, v: byPicture.v.marks }, unmarked: { ...unmarked, v: unmarked.v.marks }, end: { ...end, notesText: end.notesText.slice(0, 300), said: end.said.slice(-120) }, back: { ...back, worldFive: back.worldFive.slice(0, 200) }, picture, hubNote: hubNote.slice(0, 300) });
  await ctx.close();
  // Left in the middle: one slip marked and a question asked, the page loaded again, and the Atlas says Continue; the mark and the question are where they were.
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await open(ctx2, "&style=explorer");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  await cell(page, 1, 9).click();
  await page.getByRole("button", { name: "Ask about her book" }).click();
  const mid = await cv(page);
  const keptNow = await ev<{ quest: string; snap: { marks: { copy: number; place: number }[]; wrong: number; flags: string[] } } | null>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null");
  await ev(page, "window.__HH__.saveReady()");
  await page.reload();
  await page.waitForFunction("window.__HH__ && window.__HH__.ready");
  const hubLabels = await ev<{ label: string; restart: number; flying: boolean; primary: string }>(page, `({ label: document.querySelector("button[data-quest='${QUEST}']").textContent, restart: [...document.querySelectorAll('.hub li.open button')].filter((b) => b.textContent === 'Start this quest again').length, flying: window.__HH__.resumed(), primary: document.querySelector('.hub button.primary').textContent })`);
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  const after = await cv(page);
  const keptLabel = await label(page, 1, 9);
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-collate-resumed.png"), fullPage: true });
  record("Karima's copies left in the middle are kept, the Atlas says Continue and offers a new start, and the mark and the question are where they were when the quest is opened again",
    mid.marks.length === 1 && keptNow?.quest === QUEST && JSON.stringify(keptNow.snap.marks) === JSON.stringify([{ copy: 1, place: 9 }]) && keptNow.snap.wrong === 0 && keptNow.snap.flags.join() === "askedBook" &&
    /^Continue: Karima al-Marwaziyya$/.test(hubLabels.label) && hubLabels.restart === 1 && !hubLabels.flying && /^Play: /.test(hubLabels.primary) &&
    JSON.stringify(after.marks) === JSON.stringify([{ copy: 1, place: 9 }]) && after.flags.join() === "askedBook" && after.done === false && keptLabel === "Copy 2, place 10: a ring, marked as a slip" && /Slips still to find: 5\./.test(after.status),
    { mid: mid.marks, keptNow, hubLabels, after: { marks: after.marks, flags: after.flags, status: after.status }, keptLabel });
  await ctx2.close();
  // The Challenge page never says how many slips remain: not before a mark, not after one, not after a wrong one.
  const ctx3 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await open(ctx3, "&style=challenge");
  await page.locator(`.hub button[data-quest='${QUEST}']`).click();
  await page.waitForFunction("window.__HH__.collate() !== null");
  const benchText = async () => (await page.locator(".bench").textContent()) ?? "";
  const ch0 = { text: await benchText(), alt: await page.locator(".bench canvas.collate-art").getAttribute("aria-label"), perRow: await ev<number[]>(page, "[...document.querySelectorAll('.bench .collate-table tbody tr')].map((tr) => tr.querySelectorAll('button').length)") };
  await cell(page, 2, 1).click();
  const ch1 = { text: await benchText(), ran: (await page.locator(".bench .ran").textContent()) ?? "", alt: await page.locator(".bench canvas.collate-art").getAttribute("aria-label") };
  await cell(page, 0, 1).click();
  const ch2 = { text: await benchText(), ran: (await page.locator(".bench .ran").textContent()) ?? "", v: await cv(page) };
  if (outDir) await page.screenshot({ path: resolve(outDir, "hudhud-collate-challenge.png"), fullPage: true });
  record("Karima's Challenge copies are three rows of twenty, and the page never says how many slips remain: not at the start, not after a slip is marked, not after a wrong mark (which is still refused and counted)",
    ch0.perRow.join() === "20,20,20" && /Find every slip\. In this way of playing the page does not say how many there are\./.test(ch0.text) && !/still to find/.test(ch0.text) && !/still to find/.test(ch0.alt ?? "") && /3 copies, each a row of 20 drawn signs/.test(ch0.alt ?? "") &&
    /Copy 3, place 2 marked: it differs from the other copies\./.test(ch1.ran) && !/still to find/.test(ch1.text) && /Slips marked: 1\.$/.test(ch1.alt ?? "") &&
    /Copy 1, place 2 agrees with another copy: not a slip\./.test(ch2.ran) && !/still to find/.test(ch2.text) && ch2.v.wrong === 1 && ch2.v.marks.length === 1 && !ch2.v.done,
    { ch0: { alt: ch0.alt, perRow: ch0.perRow }, ch1: { ran: ch1.ran, alt: ch1.alt }, ch2: { ran: ch2.ran, v: { wrong: ch2.v.wrong, marks: ch2.v.marks } } });
  await ctx3.close();
  // The page in Arabic runs right to left with Arabic numerals; place 1 is on the right, in the table and in the picture.
  const arCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const ar = await arCtx.newPage();
  ar.on("pageerror", (e) => errors.push(String(e)));
  await ar.goto(`${served.base}/games/hudhud/index.html?lang=ar&music=off&style=explorer`);
  await ar.waitForFunction("window.__HH__ && window.__HH__.ready");
  await leaveOpening(ar);
  await ar.locator(`.hub button[data-quest='${QUEST}']`).click();
  await ar.waitForFunction("window.__HH__.collate() !== null");
  const arView = await ev<{ dir: string; heading: string; firstHead: string; first: string | null; x: number[]; alt: string | null; rowHead: string }>(ar, "(() => ({ dir: document.documentElement.dir, heading: document.querySelector('.bench h2').textContent, firstHead: document.querySelectorAll('.bench .collate-table thead th')[1].textContent, first: document.querySelector(\".bench .collate-table button[data-copy='0'][data-place='0']\").getAttribute('aria-label'), x: [0, 1].map((p) => Math.round(document.querySelector(`.bench .collate-table button[data-copy='0'][data-place='${p}']`).getBoundingClientRect().left)), alt: document.querySelector('.bench canvas.collate-art').getAttribute('aria-label'), rowHead: document.querySelector('.bench .collate-table tbody th').textContent }))()");
  if (outDir) await ar.screenshot({ path: resolve(outDir, "hudhud-collate-bench-ar.png"), fullPage: true });
  // Copy 2, place 2 by a click on the picture: on a right to left page it lies second from the right.
  const arAt = await spot(ar, 1, 1, 3, 16, true);
  const canvasBox = (await ar.locator(".bench canvas.collate-art").boundingBox())!;
  await ar.mouse.click(...arAt);
  const arAfter = { v: await cv(ar), ran: (await ar.locator(".bench .ran").textContent()) ?? "" };
  record("Karima's copies in Arabic run right to left with Arabic numerals, put place 1 on the right in the table and in the picture, mark a slip by a click on the picture where the right to left page has it, and name the signs in Arabic",
    arView.dir === "rtl" && arView.heading === "كريمة المروزية" && arView.firstHead === "الموضع ١" && arView.first === "النسخة ١، الموضع ١: نجمة سداسية" && arView.x[0]! > arView.x[1]! && arView.rowHead === "النسخة ١، نسختها" && /١٦/.test(arView.alt ?? "") &&
    cellCentre(0, 0, 3, 16, true).x > cellCentre(0, 15, 3, 16, true).x && arAt[0] > canvasBox.x + canvasBox.width / 2 &&
    JSON.stringify(arAfter.v.marks) === JSON.stringify([{ copy: 1, place: 1 }]) && /عُلِّمت النسخة ٢ في الموضع ٢/.test(arAfter.ran),
    { arView, arAt, canvasBox, arAfter: { marks: arAfter.v.marks, ran: arAfter.ran } });
  await arCtx.close();
  // With motion=reduced the page plays the same way to its end, and nothing on it moves at any time, with or without it.
  const runFor = async (query: string) => {
    const c = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const p = await open(c, `&style=explorer${query}`);
    await p.locator(`.hub button[data-quest='${QUEST}']`).click();
    const animStart = await ev<number>(p, "document.getAnimations().length");
    for (const [copy, place] of SLIPS) await cell(p, copy, place).click();
    await p.waitForSelector(".bench .results:not([hidden])", { timeout: 10000 });
    const animEnd = await ev<number>(p, "document.getAnimations().length");
    const state = await cv(p);
    if (outDir && query) await p.screenshot({ path: resolve(outDir, "hudhud-collate-reduced.png"), fullPage: true });
    await c.close();
    return { animStart, animEnd, done: state.done, busy: state.busy };
  };
  const plain = await runFor("");
  const calm = await runFor("&motion=reduced");
  record("Karima's copies play the same with motion=reduced: nothing on the page is animated or shown step by step, with or without it, and the copies are finished either way",
    plain.done && calm.done && !plain.busy && !calm.busy && plain.animStart === 0 && plain.animEnd === 0 && calm.animStart === 0 && calm.animEnd === 0,
    { plain, calm });
}
// The leftovers of the ninth quest. (1) Every quest that animates a run follows the game's setting, the system
// preference and `motion=reduced`: the elephant clock's run takes a step a time (about three quarters of a second each)
// and, with any of the three set, finishes at once. (2) A finished quest's radio buttons are disabled, and the chosen
// one is drawn by shape (a ring with a solid disc, bold underlined words) with its contrast measured.
{
  const ranFor = async (ctx: BrowserContext, query: string) => {
    // Since 27 November 2026 al-Jazari's scene is played in its room; `room=off` keeps this check on the clock's page, which stays as the way it is played without WebGL.
    const page = await open(ctx, `&style=explorer&room=off${query}`);
    await page.locator(".hub button[data-quest='w02q1-al-jazari']").click();
    const t0 = Date.now();
    await page.getByRole("button", { name: "Set the clock going" }).click();
    await page.waitForFunction("window.__HH__.clock() && !window.__HH__.clock().busy", undefined, { timeout: 30000 });
    const took = Date.now() - t0;
    const at_ = await ev<number>(page, "window.__HH__.clock().last.at");
    await page.close();
    return { took, steps: at_ };
  };
  const plainCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const plainRun = await ranFor(plainCtx, "");
  await plainCtx.close();
  const askedCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const askedRun = await ranFor(askedCtx, "&motion=reduced");
  await askedCtx.close();
  const systemCtx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const systemRun = await ranFor(systemCtx, "");
  await systemCtx.close();
  const settingCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const sp = await open(settingCtx, "&style=explorer&room=off");
  await sp.getByRole("button", { name: "Settings" }).click();
  await sp.getByLabel("Less motion").check();
  await sp.locator(".sheet button.primary").click();
  await sp.locator(".hub button[data-quest='w02q1-al-jazari']").click();
  const t0 = Date.now();
  await sp.getByRole("button", { name: "Set the clock going" }).click();
  await sp.waitForFunction("window.__HH__.clock() && !window.__HH__.clock().busy", undefined, { timeout: 30000 });
  const settingRun = { took: Date.now() - t0 };
  await settingCtx.close();
  record("the elephant clock's run follows the same three signals as the two circles: with no signal it is shown a step at a time, and with the game's setting, the system preference or motion=reduced in the address it finishes at once",
    plainRun.steps >= 2 && plainRun.took >= 750 * (plainRun.steps - 1) && askedRun.took < 700 && systemRun.took < 700 && settingRun.took < 700,
    { plainRun, askedRun, systemRun, settingRun });
  // (2) The two circles, finished with reduced motion, through the hooks; the chosen radio button of each group is measured.
  const rctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  // Since 27 November 2026 al-Tusi's scene is played in his observatory; `room=off` keeps this check on the two circles' page, which stays as the way they are played without WebGL.
  const rp = await open(rctx, "&style=explorer&motion=reduced&room=off");
  await rp.locator(".hub button[data-quest='w01q3-al-tusi']").click();
  await ev(rp, "window.__HH__.coupleCommand({ type: 'set', field: 'speed', value: 2 }); window.__HH__.coupleCommand({ type: 'set', field: 'dir', value: -1 }); window.__HH__.coupleCommand({ type: 'turn' });");
  await rp.waitForSelector(".bench .results:not([hidden])");
  const radios = await ev<{ n: number; disabled: number; checked: number; rows: { checked: boolean; disabled: boolean; ring: string; disc: string; scale: string; bg: string; weight: string; underline: string; w: number; labelColor: string }[]; page: string }>(rp, `(() => {
    const rows = [...document.querySelectorAll('.bench .couple-group input[type=radio]')].map((i) => { const cs = getComputedStyle(i); const af = getComputedStyle(i, '::after'); const sp = getComputedStyle(i.parentElement.querySelector('span')); return { checked: i.checked, disabled: i.disabled, ring: cs.borderTopColor, disc: af.backgroundColor, scale: af.transform, bg: cs.backgroundColor, weight: sp.fontWeight, underline: sp.textDecorationLine, w: i.getBoundingClientRect().width, labelColor: sp.color }; });
    return { n: rows.length, disabled: rows.filter((r) => r.disabled).length, checked: rows.filter((r) => r.checked).length, rows, page: getComputedStyle(document.body).backgroundColor };
  })()`);
  const parse = (c: string) => (c.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number) as [number, number, number];
  const lum = ([r, g, b]: [number, number, number]) => { const f = (x: number) => { const v = x / 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a: string, b: string) => { const [x, y] = [lum(parse(a)), lum(parse(b))]; return Math.round(((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)) * 100) / 100; };
  const on = radios.rows.find((r) => r.checked)!;
  const off = radios.rows.find((r) => !r.checked)!;
  const measured = { ringOnPage: ratio(on.ring, radios.page), discOnRadio: ratio(on.disc, on.bg), unchosenRingOnPage: ratio(off.ring, radios.page), chosenLabelOnPage: ratio(on.labelColor, radios.page), unchosenLabelOnPage: ratio(off.labelColor, radios.page) };
  if (outDir) await rp.screenshot({ path: resolve(outDir, "hudhud-couple-finished-radios.png"), fullPage: true });
  record("a finished quest's disabled radio buttons keep the chosen one clear: each group's chosen button is a ring with a solid disc and bold underlined words, the others a plain muted ring, and every ring, disc and label measures at least 3 to 1 against what it sits on (measured, WCAG 1.4.11 asks 3 to 1 for a control and 1.4.3 asks 4.5 to 1 for text)",
    radios.n === 6 && radios.disabled === 6 && radios.checked === 3 && on.disabled && on.scale === "matrix(1, 0, 0, 1, 0, 0)" && off.scale === "matrix(0, 0, 0, 0, 0, 0)" && on.weight === "700" && on.underline.includes("underline") && !off.underline.includes("underline") && on.w >= 24 &&
    measured.ringOnPage >= 3 && measured.discOnRadio >= 3 && measured.unchosenRingOnPage >= 3 && measured.chosenLabelOnPage >= 4.5 && measured.unchosenLabelOnPage >= 4.5,
    { radios: { n: radios.n, disabled: radios.disabled, checked: radios.checked }, on, off, measured, page: radios.page });
  await rctx.close();
}
// 6. The opening story, not skipped: a fresh visitor meets it before the Atlas, reads it through by the buttons, and
// is not shown it again; it can be read again from the Atlas, and Escape leaves it. On an Arabic page the page runs
// right to left and the left arrow goes forward.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  let page = await open(ctx, "", true);
  const view = () => ev<{ shown: boolean; panel: number; hubHidden: boolean; count: string; text: string; button: string; backOff: boolean; alt: string | null; role: string | null; canvasW: number; canvasH: number; focus: string; live: string | null; box: number; buttons: number[] }>(page, "(() => { const q = (s) => document.querySelector(s); const p = window.__HH__.prologue(); const sizes = [...document.querySelectorAll('.prologue button')].map((b) => Math.min(b.getBoundingClientRect().width, b.getBoundingClientRect().height)); return { shown: p.shown, panel: p.panel, hubHidden: q('.hub').hidden, count: q('.pro-count').textContent, text: q('.pro-text').textContent, button: q('.pro-nav .primary').textContent, backOff: q('.pro-nav button').disabled, alt: q('.pro-art canvas').getAttribute('aria-label'), role: q('.pro-art canvas').getAttribute('role'), canvasW: q('.pro-art canvas').width, canvasH: q('.pro-art canvas').height, focus: document.activeElement.className, live: q('.pro-text').getAttribute('aria-live'), box: sizes.length, buttons: sizes }; })()");
  const first = await view();
  if (outDir) await page.screenshot({ path: resolve(outDir, "opening-1.png") });
  const startsOnIt = first.shown && first.panel === 1 && first.hubHidden && first.count === "Panel 1 of 5" && first.backOff && first.button === "Next" && first.role === "img" && !!first.alt && first.canvasW >= 1000 && first.canvasH >= 420 && first.focus !== "pro-count" && first.live === "polite" && first.text.startsWith("In a quiet museum sleeps a great book");
  // Next, four times, by the button: the fifth panel says the Atlas and the storm are invented, and offers Begin.
  const alts = [first.alt];
  let movedFocus = true; // focus goes to the panel's heading at each change
  for (let i = 0; i < 4; i++) {
    await page.locator(".pro-nav .primary").click();
    const now = await view();
    alts.push(now.alt);
    movedFocus &&= now.focus === "pro-count";
  }
  const last = await view();
  if (outDir) await page.screenshot({ path: resolve(outDir, "opening-5.png") });
  const reachesFive = movedFocus && last.panel === 5 && last.button === "Begin" && last.count === "Panel 5 of 5" && /The Atlas and the storm are invented/.test(last.text) && new Set(alts).size === 5;
  // Back goes to panel 4 and the button reads Next again; the keyboard does the same.
  await page.getByRole("button", { name: "Back" }).click();
  const back = await view();
  await page.keyboard.press("ArrowRight");
  const viaKey = await view();
  await page.keyboard.press("ArrowLeft");
  const viaKeyBack = await view();
  await page.keyboard.press("ArrowRight");
  // Every button is at least 44 pixels each way.
  const small = last.buttons.filter((n) => n < 44);
  // Begin shows the Atlas, and records it.
  await page.locator(".pro-nav .primary").click();
  const atlas = await ev<{ shown: boolean; panel: number; hubShown: boolean; storyHidden: boolean; seen: unknown }>(page, "(() => { const p = window.__HH__.prologue(); return { shown: p.shown, panel: p.panel, hubShown: !document.querySelector('.hub').hidden, storyHidden: document.querySelector('.prologue').hidden, seen: JSON.parse(localStorage.getItem('im.hudhud.save.v1')).slots[0].prologue }; })()");
  await ev(page, "window.__HH__.saveReady()");
  // A reload shows the Atlas at once.
  await page.reload();
  await page.waitForFunction("window.__HH__ && window.__HH__.ready");
  const reloaded = await ev<{ shown: boolean; hubShown: boolean }>(page, "({ shown: window.__HH__.prologue().shown, hubShown: !document.querySelector('.hub').hidden })");
  // "Read the opening again" shows panel 1; Escape leaves it for the Atlas.
  await page.locator(".hub button[data-opening='again']").click();
  const again = await view();
  await page.keyboard.press("Escape");
  const escaped = await ev<{ shown: boolean; hubShown: boolean }>(page, "({ shown: window.__HH__.prologue().shown, hubShown: !document.querySelector('.hub').hidden })");
  const readThrough = (
    startsOnIt && reachesFive && back.panel === 4 && back.button === "Next" && viaKey.panel === 5 && viaKeyBack.panel === 4 && small.length === 0 &&
    !atlas.shown && atlas.panel === 0 && atlas.hubShown && atlas.storyHidden && atlas.seen === true &&
    !reloaded.shown && reloaded.hubShown && again.shown && again.panel === 1 && again.hubHidden && !escaped.shown && escaped.hubShown
  );
  const readDetail = { first, last, back, viaKey, viaKeyBack, small, atlas, reloaded, again, escaped };
  // Skip at the first panel records it too: the next visit goes to the Atlas.
  await ctx.close();
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await open(ctx2, "", true);
  await page.getByRole("button", { name: "Skip the opening" }).click();
  await ev(page, "window.__HH__.saveReady()");
  await page.reload();
  await page.waitForFunction("window.__HH__ && window.__HH__.ready");
  const skippedThenReload = await ev<boolean>(page, "!window.__HH__.prologue().shown && !document.querySelector('.hub').hidden");
  await page.close();
  // The address that goes straight to the quest shows no opening and records nothing.
  const auto = await open(ctx2, "&autostart=1", true);
  const autoSeen = await ev<{ shown: boolean; started: boolean }>(auto, "({ shown: window.__HH__.prologue().shown, started: window.__HH__.started() })");
  const ctx3 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const auto2 = await open(ctx3, "&autostart=1", true);
  const stored = await ev<string | null>(auto2, "localStorage.getItem('im.hudhud.save.v1')");
  const noRecord = stored === null || JSON.parse(stored).slots[0].prologue === undefined;
  const skipping = skippedThenReload && !autoSeen.shown && autoSeen.started && (await ev<boolean>(auto2, "!window.__HH__.prologue().shown")) && noRecord;
  await ctx3.close();
  await ctx2.close();
  // An Arabic page runs right to left, and the left arrow goes forward, the right arrow back; Escape skips.
  const ctxAr = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const ar = await ctxAr.newPage();
  ar.on("pageerror", (e) => errors.push(String(e)));
  await ar.goto(`${served.base}/games/hudhud/index.html?lang=ar&music=off`);
  await ar.waitForFunction("window.__HH__ && window.__HH__.ready");
  const arView = () => ev<{ dir: string; panel: number; count: string; text: string }>(ar, "({ dir: document.documentElement.dir, panel: window.__HH__.prologue().panel, count: document.querySelector('.pro-count').textContent, text: document.querySelector('.pro-text').textContent })");
  const ar1 = await arView();
  if (outDir) await ar.screenshot({ path: resolve(outDir, "opening-ar-1.png") });
  await ar.keyboard.press("ArrowLeft");
  const ar2 = await arView();
  await ar.keyboard.press("ArrowLeft");
  await ar.keyboard.press("ArrowRight");
  const ar3 = await arView();
  await ar.keyboard.press("ArrowLeft");
  await ar.keyboard.press("ArrowLeft");
  await ar.keyboard.press("ArrowLeft");
  const ar5 = await arView();
  if (outDir) await ar.screenshot({ path: resolve(outDir, "opening-ar-5.png") });
  await ar.keyboard.press("Escape");
  const arAtlas = await ev<{ shown: boolean; hubShown: boolean }>(ar, "({ shown: window.__HH__.prologue().shown, hubShown: !document.querySelector('.hub').hidden })");
  const arabic = (
    ar1.dir === "rtl" && ar1.panel === 1 && ar1.count === "اللوحة ١ من ٥" && ar1.text.startsWith("في متحف هادئ ينام كتاب كبير") && ar2.panel === 2 && ar3.panel === 2 && ar5.panel === 5 && /الأطلس والعاصفة من الخيال/.test(ar5.text) && !arAtlas.shown && arAtlas.hubShown
  );
  await ctxAr.close();
  record("the opening story: a new visitor meets it before the Atlas and reads it by the buttons and the arrow keys; Begin and Skip record it; it can be read again; Escape leaves it; autostart shows none; on an Arabic page it runs right to left", readThrough && skipping && arabic, { read: readDetail, skippedThenReload, autoSeen, stored, ar: { ar1, ar2, ar3, ar5, arAtlas } });
}
// 7. The Atlas shows the Atlas: one picture of the open book that says in words how many pages are home, is also a way
// to go to a world's list (by a click on a medallion or by the numbered buttons under it), and is drawn again when the
// Atlas is. Also: the elephant clock's blunt answer is kept over a reload; the opening shows when the settings are
// closed on the Atlas after a change to a slot that has not seen it; and the same picture on an Arabic page.
{
  const bookView = (page: Page) => ev<{ alt: string | null; role: string | null; dir: string; buttons: { n: string; label: string | null; w: number; h: number; x: number }[]; hint: string; hasHeadings: number; picture: { worlds: number; home: number[]; open: number[] } }>(page, "(() => { const c = document.querySelector('.hub canvas.book-art'); return { alt: c ? c.getAttribute('aria-label') : null, role: c ? c.getAttribute('role') : null, dir: document.documentElement.dir, buttons: [...document.querySelectorAll('.hub .book-world')].map((b) => { const r = b.getBoundingClientRect(); return { n: b.textContent, label: b.getAttribute('aria-label'), w: r.width, h: r.height, x: r.left }; }), hint: document.querySelector('#book-hint').textContent, hasHeadings: document.querySelectorAll('.hub h3[data-world][tabindex=\"-1\"]').length, picture: window.__HH__.atlasPicture() }; })()");
  const focusedWorld = (page: Page) => ev<string | null>(page, "document.activeElement && document.activeElement.tagName === 'H3' ? document.activeElement.dataset.world : null");
  /** The page point (client pixels) of a world's medallion, from the canvas's box and the art file's own geometry. */
  const medallion = async (page: Page, order: number, rtl: boolean) => {
    const canvas = page.locator(".hub canvas.book-art");
    await canvas.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const box = (await canvas.boundingBox())!;
    const c = worldCentre(order, rtl)!;
    return { x: box.x + (c.x / ATLASBOOK.w) * box.width, y: box.y + (c.y / ATLASBOOK.h) * box.height, box };
  };
  // English, left to right.
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  // Since 27 November 2026 al-Jazari's scene is played in its room; `room=off` keeps this check on the clock's page, which stays as the way it is played without WebGL.
  let page = await open(ctx, "&style=explorer&room=off");
  const first = await bookView(page);
  if (outDir) (mkdirSync(outDir, { recursive: true }), await page.screenshot({ path: resolve(outDir, "atlas-picture-en.png"), fullPage: true }));
  const present = first.role === "img" && /^The open Atlas: ten worlds, five pages each\. 0 of 50 pages are home\.$/.test(first.alt ?? "") && first.picture.worlds === 10 && first.picture.home.length === 10 && first.picture.home.every((n) => n === 0) && first.picture.open.join() === "1,2,3,4,5,6,7,8,9,10";
  const buttonsOk = first.buttons.length === 10 && first.buttons.every((b, i) => b.n === String(i + 1) && (b.label ?? "").startsWith(`World ${i + 1}: `) && b.w >= 44 && b.h >= 44) && first.buttons[0]!.label === "World 1: Sky, Stars and Time" && first.hasHeadings === 10 && /numbered buttons/.test(first.hint);
  // A click on a far world's medallion moves focus to that world's heading, and brings it into view.
  const far = await medallion(page, 9, false);
  await page.mouse.click(far.x, far.y);
  await page.waitForTimeout(900);
  const clicked = { focus: await focusedWorld(page), inView: await ev<boolean>(page, "(() => { const r = document.activeElement.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; })()") };
  // A click between two medallions does nothing: the heading keeps no focus because nothing was chosen.
  const a = await medallion(page, 1, false);
  const b2 = worldCentre(2, false)!;
  const mid = { x: a.box.x + (((worldCentre(1, false)!.x + b2.x) / 2) / ATLASBOOK.w) * a.box.width, y: a.y };
  await page.mouse.click(mid.x, mid.y);
  await page.waitForTimeout(300);
  const between = await focusedWorld(page);
  // The numbered buttons work from the keyboard: Enter on one, Tab to the next and Space on it.
  await page.locator(".hub .book-world[data-world='6']").focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(700);
  const byEnter = await focusedWorld(page);
  await page.locator(".hub .book-world[data-world='6']").focus();
  await page.keyboard.press("Tab");
  const onNext = await ev<string>(page, "document.activeElement.dataset.world");
  await page.keyboard.press("Space");
  await page.waitForTimeout(700);
  const bySpace = await focusedWorld(page);
  // The elephant clock is finished through the hook; back on the Atlas the world's page is home and the sentence changed.
  await page.locator(".hub button[data-quest='w02q1-al-jazari']").click();
  for (const [i, part] of ["float", "falcon", "dragon", "vessel", "bowl"].entries()) await ev(page, `window.__HH__.clockCommand({ type: 'put', place: ${i}, part: '${part}' })`);
  await ev(page, "window.__HH__.clockCommand({ type: 'go' })");
  await page.waitForSelector(".bench .results:not([hidden])", { timeout: 20000 });
  await ev(page, "window.__HH__.toAtlas()");
  const after = await bookView(page);
  if (outDir) await page.screenshot({ path: resolve(outDir, "atlas-picture-en-one-home.png"), fullPage: true });
  const redrawn = after.picture.home[1] === 1 && after.picture.home.filter((n) => n > 0).length === 1 && /1 of 50 pages are home\./.test(after.alt ?? "") && after.alt !== first.alt && after.picture.open.join() === "1,2,3,4,5,6,7,8,9,10";
  await page.close();
  // Reduced motion: the world's list is there at once, not scrolled to smoothly.
  const calm = await open(ctx, "&motion=reduced");
  const spot = await medallion(calm, 9, false);
  await calm.mouse.click(spot.x, spot.y);
  const reduced = await ev<{ world: string | null; moved: boolean }>(calm, "({ world: document.activeElement.tagName === 'H3' ? document.activeElement.dataset.world : null, moved: window.scrollY > 0 && document.activeElement.getBoundingClientRect().top < innerHeight })");
  await calm.close();
  // The blunt answer to the apprentice is kept: after a reload the apprentice cannot be answered again.
  page = await open(ctx, "&style=explorer&room=off");
  await page.locator(".hub button[data-quest='w02q1-al-jazari']").click();
  await page.getByRole("button", { name: "Talk to the apprentice" }).click();
  await page.getByRole("button", { name: "You should have been more careful." }).click();
  const stored = await ev<{ flags: string[] }>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1')).slots[0].resume.snap");
  await ev(page, "window.__HH__.saveReady()");
  await page.reload();
  await page.waitForFunction("window.__HH__ && window.__HH__.ready");
  await page.locator(".hub button[data-quest='w02q1-al-jazari']").click();
  const bluntKept = { flags: stored.flags, disabled: await page.getByRole("button", { name: "Talk to the apprentice" }).isDisabled(), restartLabel: null as string | null };
  await ev(page, "window.__HH__.toAtlas()");
  bluntKept.restartLabel = await ev<string>(page, "[...document.querySelectorAll('.hub li.open button')].map((b) => b.textContent).filter((t) => /again|scene/.test(t)).join('|')");
  await page.close();
  // A slot that has not seen the opening shows it when the settings are closed on the Atlas; in a quest it waits.
  const fresh = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await open(fresh, "");
  const shown = () => ev<{ shown: boolean; panel: number; hubHidden: boolean }>(page, "({ shown: window.__HH__.prologue().shown, panel: window.__HH__.prologue().panel, hubHidden: document.querySelector('.hub').hidden })");
  await page.getByRole("button", { name: "Settings" }).click();
  await page.locator(".sheet select").last().selectOption("1");
  await page.waitForTimeout(500);
  const whileOpen = await shown();
  await page.locator(".sheet button.primary").click();
  const onClose = await shown();
  await page.getByRole("button", { name: "Skip the opening" }).click();
  await ev(page, "window.__HH__.saveReady()");
  const seen = await ev<boolean[]>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1')).slots.map((s) => !!(s && s.prologue))");
  // In the middle of a quest, switching to a slot that has not seen it shows nothing; back on the Atlas it does.
  await page.locator(".hub button.primary").click();
  await page.waitForFunction("window.__HH__.where() !== null", undefined, { timeout: 30000 });
  await page.getByRole("button", { name: "Settings" }).click();
  await page.locator(".sheet select").last().selectOption("2");
  await page.waitForTimeout(500);
  await page.locator(".sheet button.primary").click();
  const inQuest = { ...(await shown()), started: await ev<boolean>(page, "window.__HH__.started()") };
  await ev(page, "window.__HH__.toAtlas()");
  await page.getByRole("button", { name: "Settings" }).click();
  await page.locator(".sheet button.primary").click();
  const backOnAtlas = await shown();
  await fresh.close();
  const opening = !whileOpen.shown && onClose.shown && onClose.panel === 1 && onClose.hubHidden && seen[0] === true && seen[1] === true && !inQuest.shown && inQuest.started && backOnAtlas.shown;
  // Arabic: the page runs right to left, world 1 is on the right half, and the same clicks reach the same worlds.
  const arCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const ar = await arCtx.newPage();
  ar.on("pageerror", (e) => errors.push(String(e)));
  await ar.goto(`${served.base}/games/hudhud/index.html?lang=ar&music=off`);
  await ar.waitForFunction("window.__HH__ && window.__HH__.ready");
  await leaveOpening(ar);
  const arFirst = await bookView(ar);
  const one = await medallion(ar, 1, true);
  const ten = await medallion(ar, 10, true);
  if (outDir) await ar.screenshot({ path: resolve(outDir, "atlas-picture-ar.png"), fullPage: true });
  await ar.mouse.click(one.x, one.y);
  await ar.waitForTimeout(900);
  const arOne = await focusedWorld(ar);
  await ar.mouse.click((await medallion(ar, 10, true)).x, (await medallion(ar, 10, true)).y);
  await ar.waitForTimeout(900);
  const arTen = await focusedWorld(ar);
  const arabic = arFirst.dir === "rtl" && arFirst.role === "img" && /عشرة عوالم/.test(arFirst.alt ?? "") && /٠ من ٥٠/.test(arFirst.alt ?? "") && arFirst.picture.open.join() === "1,2,3,4,5,6,7,8,9,10" && arFirst.buttons.length === 10 && arFirst.buttons[0]!.x > arFirst.buttons[9]!.x && one.x > one.box.x + one.box.width / 2 && ten.x < ten.box.x + ten.box.width / 2 && arOne === "1" && arTen === "10" && arFirst.buttons.every((x) => x.w >= 44 && x.h >= 44 && (x.label ?? "").startsWith("العالم "));
  await arCtx.close();
  await ctx.close();
  record(
    "the Atlas page shows the open Atlas: a picture with an alt that counts the pages home, ten numbered buttons that do what it does (a click or the keyboard moves focus to the world's heading, at once when motion is reduced), a redraw after a quest; the blunt answer is kept; the opening shows after a slot change in Settings; and it all works right to left",
    present && buttonsOk && clicked.focus === "9" && clicked.inView && between !== "1" && between !== "2" && byEnter === "6" && onNext === "7" && bySpace === "7" && redrawn && reduced.world === "9" && reduced.moved &&
      bluntKept.flags.join() === "answered" && bluntKept.disabled && bluntKept.restartLabel === "Start this quest again" && opening && arabic,
    { first, present, buttonsOk, clicked, between, byEnter, onNext, bySpace, after: { alt: after.alt, picture: after.picture }, reduced, bluntKept, opening: { whileOpen, onClose, seen, inQuest, backOnAtlas }, arabic: { arFirst: { alt: arFirst.alt, dir: arFirst.dir, picture: arFirst.picture, firstX: arFirst.buttons[0]?.x, lastX: arFirst.buttons[9]?.x }, arOne, arTen } },
  );
}
// The lists of choices in the three row quests must not give the answer away: their order is by name, not the order
// that solves the row.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await open(ctx, "&style=challenge");
  const seen: Record<string, { options: string[]; sorted: boolean }> = {};
  for (const [name, start, road] of [["clock", "startClock", ["float", "falcon", "dragon", "vessel", "bowl"]], ["paper", "startPaper", ["cut", "clean", "bleach", "pound", "size", "lift", "dry", "polish"]], ["leaves", "startLeaves", ["books-head", "own-head", "books-chest", "own-chest", "books-belly", "own-belly", "books-foot", "own-foot"]]] as const) {
    await ev(page, `window.__HH__.${start}()`);
    const got = await ev<{ values: string[]; labels: string[] }>(page, "(() => { const o = [...document.querySelector('.bench select').options].filter((x) => x.value); return { values: o.map((x) => x.value), labels: o.map((x) => x.textContent) }; })()");
    const inRoadOrder = road.every((id, i) => got.values.filter((v) => (road as readonly string[]).includes(v))[i] === id);
    seen[name] = { options: got.values, sorted: !inRoadOrder && [...got.labels].sort((a, b) => a.localeCompare(b, "en")).join("|") === got.labels.join("|") };
    await ev(page, "window.__HH__.toAtlas()");
  }
  record("the lists of choices in the clock, the paper and the leaves quests are in order of name, not in the order that solves them", seen.clock!.sorted && seen.paper!.sorted && seen.leaves!.sorted, seen);
  await ctx.close();
}
// The journey and the door (asked for by the founder, 27 November 2026). Free play of the flying scene ends at a lit
// door beside a panel (no sheet), and walking the bird to it with real key presses goes back to the Atlas; the journey
// plays the workshop, then al-Tusi's page, then the elephant clock, each left through its door (the workshop's by
// walking, the page's corridor by walking), and a reload goes on with it; the corridor's button does the same from the
// keyboard; an Arabic corridor is mirrored and Left takes the bird to its door; and one run with movement kept still.
{
  const walkTo = async (page: Page, key: "ArrowRight" | "ArrowLeft", until: string, ms = 25000) => {
    await page.keyboard.down(key);
    try {
      await page.waitForFunction(until, undefined, { timeout: ms });
    } finally {
      await page.keyboard.up(key);
    }
  };
  const finishWorkshop = "window.__HH__.command({type:'skip'}); for (const id of ['mirror-a','mirror-c','mirror-e']) window.__HH__.touch(id); window.__HH__.command({type:'skip'}); window.__HH__.touch('page');";
  const finishCouple = "window.__HH__.coupleCommand({ type: 'set', field: 'speed', value: 2 }); window.__HH__.coupleCommand({ type: 'set', field: 'dir', value: -1 }); window.__HH__.coupleCommand({ type: 'turn' });";
  const finishClock = "['float','falcon','dragon','vessel','bowl'].forEach((part, place) => window.__HH__.clockCommand({ type: 'put', place, part })); window.__HH__.clockCommand({ type: 'go' });";
  const panelView = "(() => { const p = document.querySelector('.door-panel'); return { done: window.__HH__.state().done, sheets: document.querySelectorAll('.sheet').length, modal: document.querySelectorAll('[aria-modal=true]').length, shown: !!p && !p.hidden, heading: p.querySelector('h2') ? p.querySelector('h2').textContent : null, goals: p.querySelectorAll('.goals li').length, links: [...p.querySelectorAll('.note a')].map((a) => a.getAttribute('href')), pending: p.querySelector('.pending') ? p.querySelector('.pending').textContent : '', door: window.__HH__.door(), objective: document.querySelector('.objective').textContent, buttons: [...p.querySelectorAll('button')].map((b) => b.textContent), saved: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.quests?.['w03q1-ibn-al-haytham']?.done === true, journey: window.__HH__.journey() }; })()";
  type Panel = { done: boolean; sheets: number; modal: number; shown: boolean; heading: string | null; goals: number; links: string[]; pending: string; door: { lit: boolean; scene: string; where: { x: number } } | null; objective: string; buttons: string[]; saved: boolean; journey: { active: boolean; at: number | null; scene: number | null } };
  type Door = { lit: boolean; scene: string; where: { x: number; y: number; reach: number } | null; bird: { x: number; y: number } | null } | null;
  const panelOk = (p: Panel) => p.done && p.sheets === 0 && p.modal === 0 && p.shown && p.goals === 4 && p.links.length === 3 && /Historical review pending/.test(p.pending) && !!p.door?.lit && p.door.scene === "workshop" && p.objective.startsWith("Walk Hudhud to the lit door") && p.buttons.join("|") === "Go through the door|Play again|Back to the Atlas" && p.saved;
  const frame = (page: Page) => ev<string>(page, "document.querySelector('.bench canvas.corridor-art').toDataURL()");

  // (1) Free play of the flying scene.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await open(ctx, "");
    const hubBefore = await ev<{ primary: string; journey: string; journeyIsPrimary: boolean; beforeWorlds: boolean }>(page, "({ primary: document.querySelector('.hub button.primary').textContent, journey: document.querySelector('.hub button.journey-btn').textContent, journeyIsPrimary: document.querySelector('.hub button.journey-btn').classList.contains('primary'), beforeWorlds: (() => { const j = document.querySelector('.hub .journey'); const w = document.querySelector('.hub .worlds'); const b = document.querySelector('.hub canvas'); return !!j && !!w && !!(j.compareDocumentPosition(w) & 4) && (!b || !!(j.compareDocumentPosition(b) & 4)) && j.previousElementSibling === document.querySelector('.hub .progress'); })() })");
    await playing(page);
    await ev(page, finishWorkshop);
    await page.waitForTimeout(1200);
    const lit = await ev<Panel>(page, panelView);
    if (outDir) (mkdirSync(outDir, { recursive: true }), await page.screenshot({ path: resolve(outDir, "journey-workshop-door-lit.png"), fullPage: true }));
    await page.locator("#stage").focus();
    await walkTo(page, "ArrowRight", "!document.querySelector('.hub').hidden");
    const back = await ev<{ hub: boolean; started: boolean; stageHidden: boolean; panelHidden: boolean; last: Door; journey: { active: boolean } }>(page, "({ hub: !document.querySelector('.hub').hidden, started: window.__HH__.started(), stageHidden: document.querySelector('.stage-wrap').hidden, panelHidden: document.querySelector('.door-panel').hidden, last: window.__HH__.lastDoor(), journey: window.__HH__.journey() })");
    const reach = back.last?.where && back.last.bird ? Math.hypot(back.last.where.x - back.last.bird.x, back.last.where.y - (back.last.bird.y - 30)) : null;
    record("free play of the flying scene ends at a lit door: no modal sheet, a panel beside the stage with four goals, the three links and 'Historical review pending', the objective names the door, and holding the right arrow key walks the bird to it (it arrives) and back to the Atlas",
      hubBefore.primary.startsWith("Play: ") && hubBefore.journey === "Begin the journey" && !hubBefore.journeyIsPrimary && hubBefore.beforeWorlds && panelOk(lit) && !lit.journey.active &&
        back.hub && !back.started && back.stageHidden && back.panelHidden && back.last?.scene === "workshop" && reach !== null && reach < (back.last?.where?.reach ?? 0) && !back.journey.active,
      { hubBefore, lit, back, reach });
    await ctx.close();
  }
  // (2) The journey: three scenes, two doors walked through, and a reload that goes on with it.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    // Since 27 November 2026 al-Jazari's scene is played in its room; `room=off` keeps this check on the clock's page, which stays as the way it is played without WebGL.
    const page = await open(ctx, "&room=off");
    await page.locator(".hub button.journey-btn").click();
    await page.waitForFunction("window.__HH__.where() !== null", undefined, { timeout: 30000 });
    const first = await ev<{ active: boolean; at: number | null; scene: number | null; order: string[] }>(page, "window.__HH__.journey()");
    await ev(page, finishWorkshop);
    await page.waitForTimeout(1200);
    const lit = await ev<Panel>(page, panelView);
    await page.locator("#stage").focus();
    await walkTo(page, "ArrowRight", "window.__HH__.couple() !== null");
    const second = await ev<{ journey: { at: number; scene: number }; last: Door; heading: string; toast: string | null; stageHidden: boolean; canvases: number }>(page, "({ journey: window.__HH__.journey(), last: window.__HH__.lastDoor(), heading: document.querySelector('.bench h2').textContent, toast: document.querySelector('.toast') ? document.querySelector('.toast').textContent : null, stageHidden: document.querySelector('.stage-wrap').hidden, canvases: document.querySelectorAll('#stage canvas').length })");
    await ev(page, finishCouple);
    await page.waitForSelector(".bench .corridor canvas.corridor-art", { timeout: 20000 });
    await page.waitForTimeout(300);
    const corr = await ev<{ above: boolean; resultsShown: boolean; role: string | null; alt: string | null; regionRole: string | null; regionLabel: string | null; focused: boolean; door: Door; buttons: string[] }>(page, "(() => { const c = document.querySelector('.bench .corridor'); const r = c.querySelector('.corridor-region'); const cv = c.querySelector('canvas'); return { above: !!(c.compareDocumentPosition(document.querySelector('.bench .results')) & Node.DOCUMENT_POSITION_FOLLOWING), resultsShown: !document.querySelector('.bench .results').hidden, role: cv.getAttribute('role'), alt: cv.getAttribute('aria-label'), regionRole: r.getAttribute('role'), regionLabel: r.getAttribute('aria-label'), focused: document.activeElement === r, door: window.__HH__.door(), buttons: [...c.querySelectorAll('button')].map((b) => b.getAttribute('aria-label') || b.textContent) }; })()");
    const f1 = await frame(page);
    await page.waitForTimeout(450);
    const f2 = await frame(page);
    if (outDir) await page.locator(".bench .corridor").screenshot({ path: resolve(outDir, "journey-corridor-en.png") });
    await walkTo(page, "ArrowRight", "window.__HH__.clock() !== null");
    const third = await ev<{ journey: { at: number; scene: number }; last: Door; toast: string | null; corridors: number; heading: string }>(page, "({ journey: window.__HH__.journey(), last: window.__HH__.lastDoor(), toast: document.querySelector('.toast') ? document.querySelector('.toast').textContent : null, corridors: document.querySelectorAll('.corridor').length, heading: document.querySelector('.bench h2').textContent })");
    await page.reload();
    await page.waitForFunction("window.__HH__ && window.__HH__.ready");
    await leaveOpening(page);
    const label = await ev<string>(page, "document.querySelector('.hub button.journey-btn').textContent");
    if (outDir) await page.screenshot({ path: resolve(outDir, "journey-atlas-continue.png") });
    await page.locator(".hub button.journey-btn").click();
    await page.waitForFunction("window.__HH__.clock() !== null");
    const again = await ev<{ scene: number; at: number }>(page, "window.__HH__.journey()");
    record("the journey plays the workshop, al-Tusi's page and the elephant clock in turn: the bird walked to the workshop's lit door opens the second scene with Hudhud's line; the solved page shows the corridor above its results (a picture with its sentence, a labelled region that takes the focus, the door lit and breathing); walking to its door opens the third scene; and a reload offers 'Continue the journey' with the third figure's Atlas name and continues there",
      first.active && first.scene === 0 && first.at === 0 && first.order.length === 13 && panelOk(lit) && lit.journey.active &&
        second.journey.scene === 1 && second.journey.at === 1 && second.last?.scene === "workshop" && (second.last.bird?.x ?? 0) > 2200 && second.heading === "Nasir al-Din al-Tusi" && second.toast === "Hudhud: On to the next page of the Atlas: Nasir al-Din al-Tusi!" && second.stageHidden && second.canvases === 0 &&
        corr.above && corr.resultsShown && corr.role === "img" && corr.alt === "A corridor. Hudhud stands at one end; at the other end the door is lit." && corr.regionRole === "region" && corr.regionLabel === "The corridor to the door" && corr.focused && !!corr.door?.lit && corr.door.scene === "corridor" && corr.buttons.join("|") === "Left|Right|Go through the door" && f1 !== f2 &&
        third.journey.scene === 2 && third.journey.at === 2 && third.last?.scene === "corridor" && (third.last.bird?.x ?? 0) > 780 && third.corridors === 0 && third.heading === "al-Jazari and the elephant clock" && third.toast === "Hudhud: On to the next page of the Atlas: al-Jazari and the elephant clock!" &&
        label === "Continue the journey: al-Jazari and the elephant clock" && again.scene === 2 && again.at === 2,
      { first: { ...first, order: first.order.length }, lit: { shown: lit.shown, journey: lit.journey }, second, corr, breathing: f1 !== f2, third, label, again });
    await ctx.close();
  }
  // (3) The corridor's button, from the keyboard, on a fresh journey.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    // Since 27 November 2026 al-Jazari's scene is played in its room; `room=off` keeps this check on the clock's page, which stays as the way it is played without WebGL.
    const page = await open(ctx, "&room=off");
    await ev(page, "window.__HH__.beginJourney()");
    await page.waitForFunction("window.__HH__.where() !== null", undefined, { timeout: 30000 });
    await ev(page, finishWorkshop);
    const through = await ev<boolean>(page, "window.__HH__.goThroughDoor()");
    await page.waitForFunction("window.__HH__.couple() !== null");
    await ev(page, finishCouple);
    await page.waitForSelector(".bench .corridor button.door-go", { timeout: 20000 });
    await page.locator(".bench .corridor button.door-go").focus();
    await page.keyboard.press("Enter");
    await page.waitForFunction("window.__HH__.clock() !== null", undefined, { timeout: 10000 });
    const after = await ev<{ journey: { scene: number; at: number }; last: Door }>(page, "({ journey: window.__HH__.journey(), last: window.__HH__.lastDoor() })");
    record("on a fresh journey, 'Go through the door' under a solved page's corridor, pressed with the keyboard, opens the next scene without the bird walking",
      through && after.journey.scene === 2 && after.journey.at === 2 && after.last?.scene === "corridor" && (after.last.bird?.x ?? 1000) < 200, { through, after });
    await ctx.close();
  }
  // (4) An Arabic page: the corridor is mirrored, and the left arrow key takes the bird to the door (free play: back to the Atlas).
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => errors.push(String(e)));
    // Since 27 November 2026 al-Jazari's scene is played in its room; `room=off` keeps this check on the clock's page, which stays as the way it is played without WebGL.
    await page.goto(`${served.base}/games/hudhud/index.html?lang=ar&music=off&room=off`);
    await page.waitForFunction("window.__HH__ && window.__HH__.ready");
    await leaveOpening(page);
    const journeyLabel = await ev<string>(page, "document.querySelector('.hub button.journey-btn').textContent");
    await page.locator(".hub button[data-quest='w02q1-al-jazari']").click();
    await ev(page, finishClock);
    await page.waitForSelector(".bench .corridor canvas.corridor-art", { timeout: 20000 });
    const view = await ev<{ dir: string; door: Door; alt: string | null; focusIsHeading: boolean; label: string | null }>(page, "({ dir: document.documentElement.dir, door: window.__HH__.door(), alt: document.querySelector('.bench canvas.corridor-art').getAttribute('aria-label'), focusIsHeading: document.activeElement && document.activeElement.tagName === 'H3', label: document.querySelector('.bench .corridor-region').getAttribute('aria-label') })");
    if (outDir) await page.locator(".bench .corridor").screenshot({ path: resolve(outDir, "journey-corridor-ar.png") });
    // Right first, away from the door: it is not reached.
    await page.keyboard.down("ArrowRight");
    await page.waitForTimeout(500);
    await page.keyboard.up("ArrowRight");
    const away = await ev<Door>(page, "window.__HH__.door()");
    await walkTo(page, "ArrowLeft", "!document.querySelector('.hub').hidden");
    const back = await ev<{ hub: boolean; last: Door }>(page, "({ hub: !document.querySelector('.hub').hidden, last: window.__HH__.lastDoor() })");
    record("an Arabic page's corridor is mirrored (the bird on the right, the door on the left), its sentence and label are in Arabic, Right takes the bird away from the door, and holding Left walks it to the door and back to the Atlas",
      journeyLabel === "ابدأ الرحلة" && view.dir === "rtl" && !!view.door?.lit && view.door.scene === "corridor" && (view.door.where?.x ?? 1000) < 200 && (view.door.bird?.x ?? 0) > 800 && view.alt === "ممر. يقف هدهد عند طرف منه، وعند الطرف الآخر باب مضيء." && view.label === "الممر إلى الباب" && view.focusIsHeading &&
        (away?.bird?.x ?? 0) > (view.door.bird?.x ?? 0) && back.hub && back.last?.scene === "corridor" && (back.last.bird?.x ?? 1000) < 220,
      { journeyLabel, view, away, back });
    await ctx.close();
  }
  // (5) Movement kept still (motion=reduced): the workshop's door and a corridor both still work, and the corridor's picture does not change while the bird stands.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    // Since 27 November 2026 al-Jazari's scene is played in its room; `room=off` keeps this check on the clock's page, which stays as the way it is played without WebGL.
    const page = await open(ctx, "&motion=reduced&room=off");
    await playing(page);
    await ev(page, finishWorkshop);
    await page.waitForTimeout(400);
    const lit = await ev<Panel>(page, panelView);
    await page.locator("#stage").focus();
    await walkTo(page, "ArrowRight", "!document.querySelector('.hub').hidden");
    const workshopLast = await ev<Door>(page, "window.__HH__.lastDoor()");
    await page.locator(".hub button[data-quest='w02q1-al-jazari']").click();
    await ev(page, finishClock);
    await page.waitForSelector(".bench .corridor canvas.corridor-art", { timeout: 5000 });
    await page.waitForTimeout(200);
    const f1 = await frame(page);
    await page.waitForTimeout(450);
    const f2 = await frame(page);
    await walkTo(page, "ArrowRight", "!document.querySelector('.hub').hidden");
    const corridorLast = await ev<Door>(page, "window.__HH__.lastDoor()");
    record("with motion=reduced the workshop's lit door and a corridor's door are both reached by walking, and the corridor's picture stands still while the bird does",
      panelOk(lit) && workshopLast?.scene === "workshop" && (workshopLast.bird?.x ?? 0) > 2200 && f1 === f2 && corridorLast?.scene === "corridor" && (corridorLast.bird?.x ?? 0) > 780,
      { lit: lit.shown, workshopLast, still: f1 === f2, corridorLast });
    await ctx.close();
  }
}
// Al-Jazari's workshop, the second room on the room engine (asked for by the founder, 27 November 2026): opened from the
// Atlas it is a canvas scene with every thing in the list in words; a part is carried by real flight and the move is
// counted; a wrong row stops where the clock's page would; both questions, the kind answer and the feather by touching;
// the row put right, the lit door, the panel with four goals and the room's note, and the door walked to with real key
// presses; the journey leads into the room and on out of it, and a reload resumes in it with what Hudhud carried; an
// Arabic page; movement kept still; and without WebGL the scene is played on the clock's page.
{
  type Jr = { places: (string | null)[]; parts: { id: string }[]; moves: number; par: number; flags: string[]; last: { end: string; at: number; carrying: string; moved: unknown[] } | null; done: boolean; carrying: string | null; talk: { script: string } | null; busy: boolean; lit: number; stopped: number | null; doorLit: boolean };
  const jr = (page: Page) => ev<Jr | null>(page, "(() => { const j = window.__HH__.jazari(); return j ? { ...j, places: j.puzzle.places, parts: j.puzzle.parts } : null; })()");
  const ROOM = ".room-box";
  const openRoom = async (page: Page) => {
    await page.locator(".hub button[data-quest='w02q1-al-jazari']").click();
    await page.waitForFunction("window.__HH__.jazari() !== null && window.__HH__.where() !== null", undefined, { timeout: 30000 });
    await page.waitForTimeout(700);
  };
  const skipTalk = async (page: Page) => {
    for (let i = 0; i < 8 && (await jr(page))?.talk; i++) {
      await page.locator(`${ROOM} .talk button.quiet`).last().click();
      await page.waitForTimeout(150);
    }
  };
  /** Flies the bird to a thing by the engine's own flight (goTo), and waits until it has landed and touched it. */
  const fly = async (page: Page, id: string, until: string) => {
    await ev(page, `window.__HH__.goTo(${JSON.stringify(id)})`);
    await page.waitForFunction(until, undefined, { timeout: 8000 });
    await page.waitForTimeout(150);
  };
  const walkRight = async (page: Page, until: string) => {
    await page.keyboard.down("ArrowRight");
    try {
      await page.waitForFunction(until, undefined, { timeout: 25000 });
    } finally {
      await page.keyboard.up("ArrowRight");
    }
  };
  const words = (page: Page) => ev<string[]>(page, `[...document.querySelectorAll('${ROOM} .room-words li button')].map((b) => b.textContent)`);

  // (1) to (5): one play in Explorer, from the Atlas, by flight.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await open(ctx, "&style=explorer");
    const atlasItem = await ev<{ label: string; notes: number }>(page, "(() => { const b = document.querySelector(\".hub button[data-quest='w02q1-al-jazari']\"); return { label: b.textContent, notes: b.parentElement.querySelectorAll('small').length }; })()");
    await openRoom(page);
    const opened = await ev<{ canvases: number; benchHidden: boolean; roomShown: boolean; heading: string; alt: string | null; info: { renderer: string; largestTextures: { width: number; height: number }[] }; talk: string | null }>(page, `({ canvases: document.querySelectorAll('${ROOM} .stage canvas').length, benchHidden: document.querySelector('.bench').hidden, roomShown: !document.querySelector('${ROOM}').hidden, heading: document.querySelector('${ROOM} h2').textContent, alt: document.querySelector('${ROOM} .stage').getAttribute('aria-label'), info: window.__HH__.info(), talk: document.querySelector('${ROOM} .talk:not([hidden]) .who') ? document.querySelector('${ROOM} .talk .who').textContent : null })`);
    const firstWords = await words(page);
    if (outDir) (mkdirSync(outDir, { recursive: true }), await page.screenshot({ path: resolve(outDir, "jazari-room-start.png") }));
    record("al-Jazari's room opens from the Atlas as a canvas scene on the room engine: the Atlas names it as it names the workshop (no line about a page), the room speaks first, and every thing in the room is a button in the list in words (al-Jazari, the apprentice, the box, two spare parts, five places with what stands in each, the lever)",
      atlasItem.label === "Play: al-Jazari and the elephant clock" && atlasItem.notes === 0 && opened.canvases === 1 && opened.benchHidden && opened.roomShown && opened.heading === "al-Jazari and the elephant clock" && opened.alt === "Al-Jazari's workshop, as a picture. The list after it says the same in words." && opened.info.renderer === "webgl" && Math.max(...opened.info.largestTextures.flatMap((t) => [t.width, t.height])) <= 2048 && opened.talk === "Hudhud" &&
        firstWords.length === 11 && firstWords.join("|") === "Go to al-Jazari|Go to the apprentice|Go to the box on the high shelf|On the workbench: the falcon. Pick it up|On the workbench: the dragon. Pick it up|Place 1: the float. Pick it up|Place 2: the bird. Pick it up|Place 3: the rider. Pick it up|Place 4: the bowl. Pick it up|Place 5: the vessel with the gong. Pick it up|Pull the lever: set the clock going",
      { atlasItem, opened: { ...opened, info: { renderer: opened.info.renderer } }, firstWords });
    await skipTalk(page);

    // (2) The falcon carried from the workbench to place 2 by flight: first by its button in the list, then by goTo.
    const start = (await jr(page))!;
    await page.locator(`${ROOM} .room-words li button`, { hasText: "On the workbench: the falcon. Pick it up" }).click();
    await page.waitForFunction("window.__HH__.jazari().carrying === 'falcon'", undefined, { timeout: 8000 });
    const landed = await ev<{ x: number; y: number; near: string | null }>(page, "window.__HH__.where()");
    const carryingWords = { line: await ev<string>(page, `document.querySelector('${ROOM} .room-words .carrying').textContent`), list: await words(page) };
    if (outDir) await page.screenshot({ path: resolve(outDir, "jazari-room-carrying.png") });
    await fly(page, "place-2", "window.__HH__.jazari().moves === 1");
    const put = (await jr(page))!;
    record("a part is carried by real flight: its button in the list flies Hudhud to the workbench and the falcon is in its beak (the list says 'Carrying: the falcon'), then flying to place 2 and touching it puts the falcon there in one counted move, and the bird that stood there goes to the workbench",
      start.moves === 0 && start.carrying === null && landed.y === 470 && landed.near === "spare-1" && carryingWords.line === "Carrying: the falcon" && carryingWords.list.includes("Place 2: the bird. Put the falcon here") && carryingWords.list.includes("Put the falcon back on the workbench") &&
        put.moves === 1 && put.carrying === null && put.places.join() === "float,falcon,rider,bowl,vessel" && !put.done,
      { start: { moves: start.moves, places: start.places }, landed, carryingWords, put: { moves: put.moves, places: put.places } });

    // (3) Set going on a wrong row: the run is shown a place at a time and stops where the clock's own rules stop it.
    const expected = applyClock(applyClock(newClock("explorer", clockPuzzle("explorer")), { type: "put", place: 1, part: "falcon" }), { type: "go" }).last!;
    await fly(page, "lever", "window.__HH__.jazari().last !== null");
    const during = (await jr(page))!;
    await page.waitForTimeout(900);
    if (outDir) await page.screenshot({ path: resolve(outDir, "jazari-room-running.png") });
    await page.waitForFunction("!window.__HH__.jazari().busy", undefined, { timeout: 10000 });
    const after = (await jr(page))!;
    const ran = await ev<string>(page, `document.querySelector('${ROOM} .ran').textContent`);
    record("the lever sets the clock going on a wrong row: the run is shown a place at a time, the gong is not reached, and it stops at place 4 with what reached it, exactly where and as the clock's own rules (and so its page) stop it",
      during.busy && JSON.stringify(after.last) === JSON.stringify(expected) && after.last?.end === "idle" && after.last.at === 3 && after.stopped === 3 && !after.done && after.moves === 1 &&
        /The float fills and sinks\.The falcon lets a ball go\.The rider lifts his arm and strikes\.The part in place 4 does not answer\. The motion stops there\.What reached it: a blow of the rider's arm\./.test(ran) && !/gong sounds/.test(ran),
      { during: { busy: during.busy, lit: during.lit }, last: after.last, expected, stopped: after.stopped, ran });

    // (4) Al-Jazari, the apprentice and the box, by touching them.
    await fly(page, "jazari", "window.__HH__.jazari().talk !== null");
    const hello = await page.locator(`${ROOM} .talk .line + span`).textContent();
    await page.locator(`${ROOM} .talk .choices button`, { hasText: "Ask about the float" }).click();
    const floatLine = await page.locator(`${ROOM} .talk .line + span`).textContent();
    const floatWho = await page.locator(`${ROOM} .talk .who`).textContent();
    await page.locator(`${ROOM} .talk .choices button`, { hasText: "Ask about the balls" }).click();
    const ballsLine = await page.locator(`${ROOM} .talk .line + span`).textContent();
    await page.locator(`${ROOM} .talk .choices button`).last().click();
    await page.locator(`${ROOM} .talk button`, { hasText: "Next" }).click();
    await fly(page, "apprentice", "window.__HH__.jazari().talk !== null");
    await page.locator(`${ROOM} .talk .choices button`, { hasText: "It is all right. We will find the order together." }).click();
    for (let i = 0; i < 3 && (await jr(page))?.talk; i++) await page.locator(`${ROOM} .talk button`, { hasText: "Next" }).click();
    await fly(page, "box", "window.__HH__.jazari().flags.includes('feather')");
    const onShelf = await ev<{ y: number }>(page, "window.__HH__.where()");
    const boxLine = await page.locator(`${ROOM} .talk .line + span`).textContent();
    await skipTalk(page);
    const asked = (await jr(page))!;
    record("touching al-Jazari asks him about the float and the balls (the clock's own lines, said by the museum's record), the apprentice is answered kindly, and the feather is in the box on the high shelf, reached by flight; the four flags are the clock's own",
      hello === "Welcome to my workshop. Ask me what you like while you work." && floatWho === "From the museum's record" && /^Inside the elephant is a float/.test(floatLine ?? "") && /^The falcon lets a ball go, the dragon carries it down/.test(ballsLine ?? "") &&
        onShelf.y === 214 && boxLine === "A feather, under the spare parts! It is one of mine." && ["askedFloat", "askedBalls", "kind", "answered", "feather"].every((f) => asked.flags.includes(f)) && asked.moves === 1,
      { hello, floatWho, floatLine, ballsLine, onShelf, boxLine, flags: asked.flags });

    // (5) The row put right by flight, set going, the lit door, the panel, and the door walked to.
    await fly(page, "spare-1", "window.__HH__.jazari().carrying !== null");
    const took = (await jr(page))!.carrying;
    await fly(page, "place-3", "window.__HH__.jazari().moves === 2");
    await fly(page, "place-5", "window.__HH__.jazari().carrying === 'vessel'");
    await fly(page, "place-4", "window.__HH__.jazari().moves === 3");
    await fly(page, "lever", "window.__HH__.jazari().last !== null");
    await page.waitForFunction("window.__HH__.jazari().doorLit", undefined, { timeout: 15000 });
    await page.waitForTimeout(400);
    const panel = await ev<{ shown: boolean; modal: number; goals: number; met: number; notes: string[]; links: string[]; pending: string; buttons: string[]; door: { lit: boolean; scene: string }; list: string[]; objective: string; saved: boolean; done: Jr | null }>(page, `(() => { const p = document.querySelector('${ROOM} .door-panel'); return { shown: !p.hidden, modal: document.querySelectorAll('[aria-modal=true]').length, goals: p.querySelectorAll('.goals li').length, met: p.querySelectorAll('.goals .met').length, notes: [...p.querySelectorAll('.note p')].map((x) => x.textContent), links: [...p.querySelectorAll('.note a')].map((a) => a.getAttribute('href')), pending: p.querySelector('.pending').textContent, buttons: [...p.querySelectorAll('button')].map((b) => b.textContent), door: window.__HH__.door(), list: [...document.querySelectorAll('${ROOM} .room-words li button')].map((b) => b.textContent), objective: document.querySelector('${ROOM} .objective').textContent, saved: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.quests?.['w02q1-al-jazari']?.done === true, done: null }; })()`);
    const finished = (await jr(page))!;
    if (outDir) await page.screenshot({ path: resolve(outDir, "jazari-room-door-lit.png") });
    await skipTalk(page);
    await page.locator(`${ROOM} .stage`).focus();
    await walkRight(page, "!document.querySelector('.hub').hidden");
    const back = await ev<{ hub: boolean; roomHidden: boolean; last: { scene: string; where: { x: number; y: number; reach: number }; bird: { x: number; y: number } } | null; label: string; canvases: number }>(page, "({ hub: !document.querySelector('.hub').hidden, roomHidden: document.querySelector('.room-box').hidden, last: window.__HH__.lastDoor(), label: document.querySelector(\".hub button[data-quest='w02q1-al-jazari']\").textContent, canvases: document.querySelectorAll('.room-box canvas, #stage canvas').length })");
    const reach = back.last ? Math.hypot(back.last.where.x - back.last.bird.x, back.last.where.y - (back.last.bird.y - 30)) : null;
    record("the row put right by flight (the dragon from the workbench to place 3, the vessel from place 5 to place 4) works in the fewest moves; the clock tells the half hour, the door lights, the panel beside the stage (no modal sheet) shows four goals met, the clock's four notes, the room's note and 'Historical review pending', and the two links; the list then offers only the door; holding the right arrow key walks Hudhud to it and, in free play, back to the Atlas",
      took === "dragon" && finished.done && finished.moves === 3 && finished.par === 3 && finished.talk?.script === "done" && panel.shown && panel.modal === 0 && panel.goals === 4 && panel.met === 4 &&
        panel.notes.includes("The workshop, the workbench and the frame that holds the clock's parts are invented for play; they are not a picture of al-Jazari's clock.") && panel.notes.some((n) => /^This is a game, not a history\./.test(n)) && /Historical review pending/.test(panel.pending) &&
        panel.links.join() === "https://islam.museum/en/person/al-jazari-engineer/,https://islam.museum/en/invention/elephant-clock/" && panel.buttons.join("|") === "Go through the door|Play again|Back to the Atlas" && panel.door.lit && panel.door.scene === "jazari" &&
        panel.list.join() === "Go through the door" && panel.objective.startsWith("Walk Hudhud to the lit door at the end of the workshop.") && panel.saved &&
        back.hub && back.roomHidden && back.last?.scene === "jazari" && reach !== null && reach < back.last.where.reach && /^Play again: /.test(back.label) && back.canvases === 0,
      { took, finished: { done: finished.done, moves: finished.moves, par: finished.par }, panel, back: { ...back }, reach });
    await ctx.close();
  }

  // (6) The journey leads into the room and out of it, and a reload resumes in the room with what Hudhud carried.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await open(ctx, "&style=explorer");
    await ev(page, "window.__HH__.beginJourney()");
    await page.waitForFunction("window.__HH__.where() !== null", undefined, { timeout: 30000 });
    await ev(page, "window.__HH__.command({type:'skip'}); for (const id of ['mirror-a','mirror-c','mirror-e']) window.__HH__.touch(id); window.__HH__.command({type:'skip'}); window.__HH__.touch('page');");
    await ev(page, "window.__HH__.goThroughDoor()");
    // Since 27 November 2026 the second scene is al-Tusi's room: finished through its rules, and its lit door walked to.
    await page.waitForFunction("window.__HH__.tusi() !== null && window.__HH__.where() !== null", undefined, { timeout: 30000 });
    await ev(page, "window.__HH__.tusiCommand({ type: 'skip' }); for (const id of ['lever-speed', 'lever-dir', 'crank']) window.__HH__.tusiCommand({ type: 'touch', id });");
    await page.waitForFunction("window.__HH__.tusi().doorLit", undefined, { timeout: 15000 });
    await ev(page, "window.__HH__.tusiCommand({ type: 'skip' })");
    await page.locator(`${ROOM} .stage`).focus();
    await walkRight(page, "window.__HH__.jazari() !== null");
    await page.waitForFunction("window.__HH__.where() !== null", undefined, { timeout: 30000 });
    const entered = await ev<{ journey: { scene: number; at: number }; last: { scene: string } | null; toast: string | null; heading: string; corridors: number }>(page, `({ journey: window.__HH__.journey(), last: window.__HH__.lastDoor(), toast: document.querySelector('.toast') ? document.querySelector('.toast').textContent : null, heading: document.querySelector('${ROOM} h2').textContent, corridors: document.querySelectorAll('.corridor').length })`);
    await skipTalk(page);
    await fly(page, "place-2", "window.__HH__.jazari().carrying === 'bird'");
    await fly(page, "place-3", "window.__HH__.jazari().moves === 1");
    await fly(page, "place-1", "window.__HH__.jazari().carrying === 'float'");
    const left = (await jr(page))!;
    await ev(page, "window.__HH__.saveReady()");
    await page.reload();
    await page.waitForFunction("window.__HH__ && window.__HH__.ready");
    await leaveOpening(page);
    const label = await ev<string>(page, "document.querySelector('.hub button.journey-btn').textContent");
    await page.locator(".hub button.journey-btn").click();
    await page.waitForFunction("window.__HH__.jazari() !== null && window.__HH__.where() !== null", undefined, { timeout: 30000 });
    const resumed = (await jr(page))!;
    const again = await ev<{ scene: number; at: number }>(page, "window.__HH__.journey()");
    // Finished through the rules, and through the door: the journey goes on to the next scene.
    for (const id of ["place-1", "place-3", "spare-1", "place-2", "spare-1", "place-3", "place-5", "place-4", "lever"]) await ev(page, `window.__HH__.jazariCommand({ type: 'touch', id: '${id}' })`);
    await page.waitForFunction("window.__HH__.jazari().doorLit", undefined, { timeout: 15000 });
    const through = await ev<boolean>(page, "window.__HH__.goThroughDoor()");
    // Since 27 November 2026 the fourth scene is al-Khwarizmi's room: the door leads into it, not to the locked box's page.
    await page.waitForFunction("window.__HH__.khwarizmi() !== null && window.__HH__.where() !== null", undefined, { timeout: 30000 });
    const onward = await ev<{ journey: { scene: number; at: number }; last: { scene: string } | null; roomHidden: boolean; heading: string; page: unknown; corridors: number }>(page, `({ journey: window.__HH__.journey(), last: window.__HH__.lastDoor(), roomHidden: document.querySelector('.room-box').hidden, heading: document.querySelector('${ROOM} h2').textContent, page: window.__HH__.algebra(), corridors: document.querySelectorAll('.corridor').length })`);
    record("in the journey (played through: the workshop, then al-Tusi's room and its lit door walked to) the third scene is al-Jazari's room, not the clock's page and no corridor; a reload offers 'Continue the journey' with his name and resumes in the room with the clock as it was and the float still in Hudhud's beak; finished, its lit door leads on into the fourth scene, al-Khwarizmi's room (no page, no corridor)",
      entered.journey.scene === 2 && entered.journey.at === 2 && entered.last?.scene === "tusi" && entered.toast === "Hudhud: On to the next page of the Atlas: al-Jazari and the elephant clock!" && entered.heading === "al-Jazari and the elephant clock" && entered.corridors === 0 &&
        left.moves === 1 && left.carrying === "float" && label === "Continue the journey: al-Jazari and the elephant clock" && resumed.moves === 1 && resumed.carrying === "float" && resumed.places.join() === left.places.join() && resumed.talk === null && again.scene === 2 &&
        through && onward.journey.scene === 3 && onward.journey.at === 3 && onward.last?.scene === "jazari" && !onward.roomHidden && onward.heading === "al-Khwarizmi" && onward.page === null && onward.corridors === 0,
      { entered, left: { moves: left.moves, carrying: left.carrying, places: left.places }, label, resumed: { moves: resumed.moves, carrying: resumed.carrying, places: resumed.places }, again, through, onward });
    await ctx.close();
  }

  // (7) An Arabic page.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(`${served.base}/games/hudhud/index.html?lang=ar&music=off&style=explorer&fresh=1`);
    await page.waitForFunction("window.__HH__ && window.__HH__.ready");
    await leaveOpening(page);
    await openRoom(page);
    const ar = await ev<{ dir: string; alt: string | null; heading: string; who: string | null; list: string[]; objective: string }>(page, `({ dir: document.documentElement.dir, alt: document.querySelector('${ROOM} .stage').getAttribute('aria-label'), heading: document.querySelector('${ROOM} h2').textContent, who: document.querySelector('${ROOM} .talk .who') ? document.querySelector('${ROOM} .talk .who').textContent : null, list: [...document.querySelectorAll('${ROOM} .room-words li button')].map((b) => b.textContent), objective: document.querySelector('${ROOM} .objective').textContent })`);
    await skipTalk(page);
    await fly(page, "place-2", "window.__HH__.jazari().carrying === 'bird'");
    const carrying = await ev<string>(page, `document.querySelector('${ROOM} .room-words .carrying').textContent`);
    if (outDir) await page.screenshot({ path: resolve(outDir, "jazari-room-ar.png") });
    record("al-Jazari's room on an Arabic page runs right to left, says its picture, its list, what Hudhud carries and who speaks in Arabic, with Arabic numerals",
      ar.dir === "rtl" && ar.alt === "ورشة الجزري في صورة. والقائمة التي بعدها تقول الشيء نفسه بالكلمات." && ar.who === "هدهد" && ar.list.length === 11 && ar.list.some((x) => x.startsWith("المكان ١:")) && ar.list.includes("اسحب الذراع: شغّل الساعة") && carrying === "يحمل: الطائر" && !/[0-9]/.test(ar.list.join("")),
      { ar, carrying });
    await ctx.close();
  }

  // (8) Movement kept still: the bird is set down at once, the run is told at once, and the door is still walked to.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await open(ctx, "&style=story&motion=reduced&fresh=1");
    await openRoom(page);
    await skipTalk(page);
    await ev(page, "window.__HH__.goTo('place-1')");
    const atOnce = (await jr(page))!.carrying;
    await ev(page, "window.__HH__.goTo('place-2')");
    await ev(page, "window.__HH__.goTo('place-4')");
    await ev(page, "window.__HH__.goTo('place-5')");
    const t0 = Date.now();
    await ev(page, "window.__HH__.goTo('lever')");
    await page.waitForFunction("window.__HH__.jazari().doorLit", undefined, { timeout: 5000 });
    const took = Date.now() - t0;
    const calm = (await jr(page))!;
    await skipTalk(page);
    await page.locator(`${ROOM} .stage`).focus();
    await walkRight(page, "!document.querySelector('.hub').hidden");
    const last = await ev<{ scene: string } | null>(page, "window.__HH__.lastDoor()");
    record("al-Jazari's room with motion=reduced: flown to, the bird is set down and touches at once (a part is in its beak on the same step), Story's row is put right in its fewest two moves, the run is told at once, and the lit door is still reached by walking",
      atOnce === "falcon" && calm.done && calm.moves === 2 && calm.par === 2 && took < 1500 && last?.scene === "jazari", { atOnce, moves: calm.moves, took, last });
    await ctx.close();
  }

  // (9) Without WebGL the scene is played on the clock's page, and finished there.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await ctx.addInitScript("const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, ...a) { return /webgl/.test(t) ? null : g.call(this, t, ...a); };");
    const page = await open(ctx, "&fresh=1&preflight=off&style=explorer");
    const note = await ev<string>(page, "document.querySelector(\".hub button[data-quest='w02q1-al-jazari']\").parentElement.querySelector('small') ? document.querySelector(\".hub button[data-quest='w02q1-al-jazari']\").parentElement.querySelector('small').textContent : ''");
    await page.locator(".hub button[data-quest='w02q1-al-jazari']").click();
    await page.waitForFunction("window.__HH__.clock() !== null", undefined, { timeout: 10000 });
    const onPage = await ev<{ room: unknown; selects: number; roomHidden: boolean; benchShown: boolean }>(page, "({ room: window.__HH__.jazari(), selects: document.querySelectorAll('.bench select').length, roomHidden: document.querySelector('.room-box').hidden, benchShown: !document.querySelector('.bench').hidden })");
    await ev(page, "['float','falcon','dragon','vessel','bowl'].forEach((part, place) => window.__HH__.clockCommand({ type: 'put', place, part })); window.__HH__.clockCommand({ type: 'go' });");
    await page.waitForSelector(".bench .results:not([hidden])", { timeout: 20000 });
    const done = await ev<boolean>(page, "window.__HH__.clock().done");
    record("without WebGL al-Jazari's scene is played on the clock's page (its trial line on the Atlas, five lists of choices, no room), and is finished there",
      /first trial/.test(note) && onPage.room === null && onPage.selects === 5 && onPage.roomHidden && onPage.benchShown && done, { note, onPage, done });
    await ctx.close();
  }
}
// Al-Tusi's observatory, the third room on the room engine (asked for by the founder, 27 November 2026): opened from
// the Atlas it is a canvas scene with every thing in the list in words; a lever is moved by flight and by the touch
// button and key, and says its setting; the crank turns a wrong setting, the shape is named and the count goes up, as
// the page's rules say; both questions, the kind answer and the feather by touching; twice as fast and the other way,
// the line, the lit door, the panel with four goals, the room's note and the note that states the model (shown only
// now), and the door walked to with real key presses; the journey leads into the room and on out of it into
// al-Jazari's, and a reload resumes in it as it was; an Arabic page; movement kept still; and without WebGL the scene
// is played on the two circles' page.
{
  type Ts = { setting: { r: number; k: number; d: number }; turned: number; misses: number; flags: string[]; done: boolean; last: { setting: { r: number; k: number; d: number }; shape: { kind: string; lobes: number; crossings: number } } | null; talk: { script: string } | null; busy: boolean; progress: number; doorLit: boolean; shown: { setting: { r: number; k: number; d: number }; points: number; closed: boolean; levers: Record<string, { visible: boolean; angle: number }> } | null };
  const QUEST = "w01q3-al-tusi";
  const ROOM = ".room-box";
  const NOTE2 = "From the museum's record: al-Tusi's model of the planets' motion is called his most original achievement. It is a model of two spheres, the smaller turning twice as fast as the larger and the opposite way, so that a point on it moves along a straight line.";
  const NOTE_ROOM = "The observatory, the model on its stand, the levers and the crank are invented for play; they are not a picture of the Maragha observatory or of its instruments.";
  const ts = (page: Page) => ev<Ts | null>(page, "window.__HH__.tusi()");
  const openTusi = async (page: Page) => {
    await page.locator(`.hub button[data-quest='${QUEST}']`).click();
    await page.waitForFunction("window.__HH__.tusi() !== null && window.__HH__.where() !== null", undefined, { timeout: 30000 });
    await page.waitForTimeout(700);
  };
  const skipTalk = async (page: Page) => {
    for (let i = 0; i < 8 && (await ts(page))?.talk; i++) {
      await page.locator(`${ROOM} .talk button.quiet`).last().click();
      await page.waitForTimeout(150);
    }
  };
  /** Flies the bird to a thing by the engine's own flight (goTo), and waits until it has landed and touched it. */
  const fly = async (page: Page, id: string, until: string) => {
    await ev(page, `window.__HH__.goTo(${JSON.stringify(id)})`);
    await page.waitForFunction(until, undefined, { timeout: 8000 });
    await page.waitForTimeout(150);
  };
  const walkRight = async (page: Page, until: string) => {
    await page.keyboard.down("ArrowRight");
    try {
      await page.waitForFunction(until, undefined, { timeout: 25000 });
    } finally {
      await page.keyboard.up("ArrowRight");
    }
  };
  const words = (page: Page) => ev<string[]>(page, `[...document.querySelectorAll('${ROOM} .room-words li button')].map((b) => b.textContent)`);
  const ranText = (page: Page) => ev<string>(page, `document.querySelector('${ROOM} .ran').textContent`);
  const lastLine = (page: Page) => ev<string>(page, `document.querySelector('${ROOM} .room-words .carrying').textContent`);
  const note2Shown = (page: Page) => ev<boolean>(page, `document.body.textContent.includes(${JSON.stringify(NOTE2)})`);

  // (1) to (4): one play in Explorer, from the Atlas, by flight, touch and keys.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await open(ctx, "&style=explorer");
    const atlasItem = await ev<{ label: string; notes: number }>(page, `(() => { const b = document.querySelector(".hub button[data-quest='${QUEST}']"); return { label: b.textContent, notes: b.parentElement.querySelectorAll('small').length }; })()`);
    await openTusi(page);
    const opened = await ev<{ canvases: number; benchHidden: boolean; roomShown: boolean; heading: string; alt: string | null; info: { renderer: string; largestTextures: { width: number; height: number }[] }; talk: string | null }>(page, `({ canvases: document.querySelectorAll('${ROOM} .stage canvas').length, benchHidden: document.querySelector('.bench').hidden, roomShown: !document.querySelector('${ROOM}').hidden, heading: document.querySelector('${ROOM} h2').textContent, alt: document.querySelector('${ROOM} .stage').getAttribute('aria-label'), info: window.__HH__.info(), talk: document.querySelector('${ROOM} .talk:not([hidden]) .who') ? document.querySelector('${ROOM} .talk .who').textContent : null })`);
    const firstWords = await words(page);
    const first = (await ts(page))!;
    const firstLast = await lastLine(page);
    const noNote2 = !(await note2Shown(page));
    if (outDir) (mkdirSync(outDir, { recursive: true }), await page.screenshot({ path: resolve(outDir, "tusi-room-start.png") }));
    record("al-Tusi's room opens from the Atlas as a canvas scene on the room engine: the Atlas names it as it names the other rooms (no line about a page), the room speaks first, the model shows the circles as set with no path, Explorer's two levers stand on the stand (direction and speed, no size), the note that states the model is nowhere on the page, and every thing in the room is a button in the list in words (al-Tusi, the girl, the high shelf, each lever with its setting, the crank)",
      atlasItem.label === "Play: Nasir al-Din al-Tusi" && atlasItem.notes === 0 && opened.canvases === 1 && opened.benchHidden && opened.roomShown && opened.heading === "Nasir al-Din al-Tusi" && opened.alt === "Al-Tusi's observatory, as a picture. The list after it says the same in words." && opened.info.renderer === "webgl" && Math.max(...opened.info.largestTextures.flatMap((t) => [t.width, t.height])) <= 2048 && opened.talk === "Hudhud" &&
        first.setting.r === 0.5 && first.setting.k === 1 && first.setting.d === 1 && first.turned === 0 && first.shown?.points === 0 && first.shown.levers.dir?.visible === true && first.shown.levers.speed?.visible === true && first.shown.levers.size?.visible === false && firstLast === "No path has been drawn yet." && noNote2 &&
        firstWords.join("|") === "Go to al-Tusi|Go to the girl who cleans the instruments|Go to the instruments on the high shelf|Move the direction lever on. Now: The same way as the large circle|Move the speed lever on. Now: As fast as the large circle|Turn the crank: turn the circles",
      { atlasItem, opened: { ...opened, info: { renderer: opened.info.renderer } }, firstWords, first: { setting: first.setting, shown: first.shown }, firstLast, noNote2 });
    await skipTalk(page);

    // (2) A lever by flight (goTo flies the bird there and touches it), then by the touch button and by the touch key;
    // then the crank by its button in the list: a wrong setting is turned, shown to its end, named, and counted.
    await fly(page, "lever-speed", "window.__HH__.tusi().setting.k === 2");
    const landed = await ev<{ x: number; y: number; near: string | null }>(page, "window.__HH__.where()");
    const said1 = await ranText(page);
    await page.locator(`${ROOM} .pad button.wide`).click();
    const byButton = (await ts(page))!.setting.k;
    await page.locator(`${ROOM} .stage`).focus();
    await page.keyboard.press("KeyE");
    await page.waitForTimeout(150);
    const byKey = (await ts(page))!.setting.k;
    await page.keyboard.press("KeyE");
    await page.waitForTimeout(150);
    const back2 = (await ts(page))!;
    const leverWord = (await words(page)).find((w) => w.startsWith("Move the speed lever"));
    const expected = applyCouple(applyCouple(newCouple("explorer", coupleOffer("explorer")), { type: "set", field: "speed", value: 2 }), { type: "turn" }).last;
    await page.locator(`${ROOM} .room-words li button`, { hasText: "Turn the crank" }).click();
    await page.waitForFunction("window.__HH__.tusi().turned === 1", undefined, { timeout: 8000 });
    const during = { v: (await ts(page))!, ran: await ranText(page), list: await words(page), disabled: await ev<boolean>(page, `[...document.querySelectorAll('${ROOM} .room-words li button')].filter((b) => !b.classList.contains('skip-turning')).every((b) => b.disabled)`) };
    await page.waitForTimeout(1000);
    if (outDir) await page.screenshot({ path: resolve(outDir, "tusi-room-turning.png") });
    await page.waitForFunction("!window.__HH__.tusi().busy", undefined, { timeout: 10000 });
    const wrong = { v: (await ts(page))!, ran: await ranText(page), last: await lastLine(page), objective: await ev<string>(page, `document.querySelector('${ROOM} .objective').textContent`) };
    if (outDir) await page.screenshot({ path: resolve(outDir, "tusi-room-wrong-path.png") });
    record("a lever is moved by flight (landing on the stand's base by it and touching it), by the touch button and by the E key, going round Explorer's three speeds and saying its setting in words; the crank, from its button in the list, turns a wrong setting: the turning is shown (the list's other buttons wait, the page's 'Skip the turning' is offered), then the path is drawn whole in the air, named as the page names it, and counted, exactly as the two circles' own rules say",
      landed.near === "lever-speed" && landed.y === 570 && said1 === "Moved the speed lever: Twice as fast as the large circle." && byButton === 3 && byKey === 1 && back2.setting.k === 2 && back2.turned === 0 && leverWord === "Move the speed lever on. Now: Twice as fast as the large circle" &&
        during.v.busy && during.ran === "The circles are turning." && during.list.includes("Skip the turning") && during.disabled && (during.v.shown?.points ?? 999) < 360 &&
        !wrong.v.busy && wrong.v.turned === 1 && wrong.v.misses === 1 && !wrong.v.done && JSON.stringify(wrong.v.last) === JSON.stringify(expected) && wrong.v.last?.shape.kind === "loops" && wrong.v.last.shape.lobes === 2 && wrong.ran === "The point traced a flower of 2 loops." && wrong.last === "The last path: a flower of 2 loops." && wrong.v.shown?.points === 360 && wrong.v.shown.closed && wrong.objective.includes("Turnings: 1 · Not a straight line: 1"),
      { landed, said1, byButton, byKey, k: back2.setting.k, leverWord, during: { busy: during.v.busy, ran: during.ran, points: during.v.shown?.points, disabled: during.disabled }, wrong: { ...wrong, v: { turned: wrong.v.turned, misses: wrong.v.misses, last: wrong.v.last, shown: wrong.v.shown } }, expected });

    // (3) Al-Tusi, the girl and the high shelf, by touching them.
    await fly(page, "tusi", "window.__HH__.tusi().talk !== null");
    const hello = await page.locator(`${ROOM} .talk .line + span`).textContent();
    await page.locator(`${ROOM} .talk .choices button`, { hasText: "Ask why he looked for a model" }).click();
    const whyWho = await page.locator(`${ROOM} .talk .who`).textContent();
    const whyLine = await page.locator(`${ROOM} .talk .line + span`).textContent();
    await page.locator(`${ROOM} .talk .choices button`, { hasText: "Ask about the observatory" }).click();
    const obsLine = await page.locator(`${ROOM} .talk .line + span`).textContent();
    const thanks = await page.locator(`${ROOM} .talk .choices button`).last().textContent();
    await page.locator(`${ROOM} .talk .choices button`).last().click();
    const bye = await page.locator(`${ROOM} .talk .line + span`).textContent();
    await page.locator(`${ROOM} .talk button`, { hasText: "Next" }).click();
    await fly(page, "girl", "window.__HH__.tusi().talk !== null");
    await page.locator(`${ROOM} .talk .choices button`, { hasText: "Do not be afraid. Go slowly and hold each ring gently." }).click();
    for (let i = 0; i < 3 && (await ts(page))?.talk; i++) await page.locator(`${ROOM} .talk button`, { hasText: "Next" }).click();
    await fly(page, "shelf", "window.__HH__.tusi().flags.includes('feather')");
    const onShelf = await ev<{ y: number }>(page, "window.__HH__.where()");
    const shelfLine = await page.locator(`${ROOM} .talk .line + span`).textContent();
    await skipTalk(page);
    const asked = (await ts(page))!;
    record("touching al-Tusi greets and asks him why he looked for a model and about the observatory (the page's own lines, said by the museum's record), the girl is answered kindly, and the feather is among the instruments on the high shelf, reached by flight; the flags are the page quest's own and no turning is counted",
      hello === "Welcome to the observatory. Ask me what you like while the circles turn." && whyWho === "From the museum's record" && /Ptolemy's system departed from steady circular motion/.test(whyLine ?? "") && /founded by the Mongol ruler Hulagu at al-Tusi's suggestion/.test(obsLine ?? "") && thanks === "Thank you. We will try the circles." && bye === "Go well. The circles are waiting for you." &&
        onShelf.y === 214 && shelfLine === "A feather, fallen between two instruments! It is one of mine." && asked.flags.slice().sort().join() === "answered,askedObs,askedWhy,feather,kind" && asked.turned === 1,
      { hello, whyWho, whyLine, obsLine, thanks, bye, onShelf, shelfLine, flags: asked.flags });

    // (4) Twice as fast (it is) and the other way: the line, the lit door, the panel; then the door walked to.
    await fly(page, "lever-dir", "window.__HH__.tusi().setting.d === -1");
    const said2 = await ranText(page);
    const before = !(await note2Shown(page));
    await fly(page, "crank", "window.__HH__.tusi().turned === 2");
    await page.waitForFunction("!window.__HH__.tusi().busy", undefined, { timeout: 10000 });
    const ranLine = await ranText(page);
    if (outDir) await page.screenshot({ path: resolve(outDir, "tusi-room-line.png") });
    await page.waitForFunction("window.__HH__.tusi().doorLit", undefined, { timeout: 5000 });
    await page.waitForTimeout(400);
    const panel = await ev<{ shown: boolean; modal: number; goals: number; met: number; notes: string[]; links: string[]; pending: string; buttons: string[]; door: { lit: boolean; scene: string }; list: string[]; objective: string; saved: boolean }>(page, `(() => { const p = document.querySelector('${ROOM} .door-panel'); return { shown: !p.hidden, modal: document.querySelectorAll('[aria-modal=true]').length, goals: p.querySelectorAll('.goals li').length, met: p.querySelectorAll('.goals .met').length, notes: [...p.querySelectorAll('.note p')].map((x) => x.textContent), links: [...p.querySelectorAll('.note a')].map((a) => a.getAttribute('href')), pending: p.querySelector('.pending').textContent, buttons: [...p.querySelectorAll('button')].map((b) => b.textContent), door: window.__HH__.door(), list: [...document.querySelectorAll('${ROOM} .room-words li button')].map((b) => b.textContent), objective: document.querySelector('${ROOM} .objective').textContent, saved: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.quests?.['${QUEST}']?.done === true }; })()`);
    const finished = (await ts(page))!;
    if (outDir) await page.screenshot({ path: resolve(outDir, "tusi-room-door-lit.png") });
    await skipTalk(page);
    await page.locator(`${ROOM} .stage`).focus();
    await walkRight(page, "!document.querySelector('.hub').hidden");
    const back = await ev<{ hub: boolean; roomHidden: boolean; last: { scene: string; where: { x: number; y: number; reach: number }; bird: { x: number; y: number } } | null; label: string; canvases: number }>(page, `({ hub: !document.querySelector('.hub').hidden, roomHidden: document.querySelector('.room-box').hidden, last: window.__HH__.lastDoor(), label: document.querySelector(".hub button[data-quest='${QUEST}']").textContent, canvases: document.querySelectorAll('.room-box canvas, #stage canvas').length })`);
    const reach = back.last ? Math.hypot(back.last.where.x - back.last.bird.x, back.last.where.y - (back.last.bird.y - 30)) : null;
    record("twice as fast and the other way, turned with the crank by flight, is the line: the page's words for it, the door lights, the panel beside the stage (no modal sheet) shows four goals met, the quest's four notes with the one that states the model (shown only now), the room's note and 'Historical review pending', and the two links; the list then offers only the door; holding the right arrow key walks Hudhud to it and, in free play, back to the Atlas",
      said2 === "Moved the direction lever: The other way from the large circle." && before && finished.done && finished.turned === 2 && finished.misses === 1 && finished.talk?.script === "done" && finished.shown?.setting.k === 2 && finished.shown.setting.d === -1 &&
        /The point went back and forth along a straight line\./.test(ranLine) && /The page has settled onto a straight line\./.test(ranLine) &&
        panel.shown && panel.modal === 0 && panel.goals === 4 && panel.met === 4 && panel.notes.includes(NOTE2) && panel.notes.includes(NOTE_ROOM) && panel.notes.some((n) => /^This is a game, not a history\./.test(n)) && /Historical review pending/.test(panel.pending) &&
        panel.links.join() === "https://islam.museum/en/person/nasir-al-din-al-tusi/,https://islam.museum/en/building/maragha-observatory/" && panel.buttons.join("|") === "Go through the door|Play again|Back to the Atlas" && panel.door.lit && panel.door.scene === "tusi" &&
        panel.list.join() === "Go through the door" && panel.objective.startsWith("Walk Hudhud to the lit door at the end of the observatory.") && panel.saved &&
        back.hub && back.roomHidden && back.last?.scene === "tusi" && reach !== null && reach < back.last.where.reach && /^Play again: /.test(back.label) && back.canvases === 0,
      { said2, before, finished: { done: finished.done, turned: finished.turned, misses: finished.misses }, ranLine, panel, back: { ...back }, reach });
    await ctx.close();
  }

  // (5) The journey leads from the workshop into the room, a reload resumes in it as it was, and its door leads on into al-Jazari's room.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await open(ctx, "&style=explorer");
    await ev(page, "window.__HH__.beginJourney()");
    await page.waitForFunction("window.__HH__.where() !== null", undefined, { timeout: 30000 });
    await ev(page, "window.__HH__.command({type:'skip'}); for (const id of ['mirror-a','mirror-c','mirror-e']) window.__HH__.touch(id); window.__HH__.command({type:'skip'}); window.__HH__.touch('page');");
    await ev(page, "window.__HH__.goThroughDoor()");
    await page.waitForFunction("window.__HH__.tusi() !== null && window.__HH__.where() !== null", undefined, { timeout: 30000 });
    const entered = await ev<{ journey: { scene: number; at: number }; last: { scene: string } | null; toast: string | null; heading: string; corridors: number }>(page, `({ journey: window.__HH__.journey(), last: window.__HH__.lastDoor(), toast: document.querySelector('.toast') ? document.querySelector('.toast').textContent : null, heading: document.querySelector('${ROOM} h2').textContent, corridors: document.querySelectorAll('.corridor').length })`);
    await skipTalk(page);
    await fly(page, "crank", "window.__HH__.tusi().turned === 1");
    await page.waitForFunction("!window.__HH__.tusi().busy", undefined, { timeout: 10000 });
    await ev(page, "window.__HH__.tusiCommand({ type: 'touch', id: 'tusi' }); window.__HH__.tusiCommand({ type: 'choose', index: 1 }); window.__HH__.tusiCommand({ type: 'skip' }); window.__HH__.tusiCommand({ type: 'touch', id: 'lever-dir' });");
    const left = (await ts(page))!;
    const kept = await ev<{ quest: string; snap: Record<string, unknown> } | null>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null");
    await ev(page, "window.__HH__.saveReady()");
    await page.reload();
    await page.waitForFunction("window.__HH__ && window.__HH__.ready");
    await leaveOpening(page);
    const label = await ev<string>(page, "document.querySelector('.hub button.journey-btn').textContent");
    await page.locator(".hub button.journey-btn").click();
    await page.waitForFunction("window.__HH__.tusi() !== null && window.__HH__.where() !== null", undefined, { timeout: 30000 });
    await page.waitForTimeout(500);
    const resumed = (await ts(page))!;
    const again = await ev<{ scene: number; at: number }>(page, "window.__HH__.journey()");
    if (outDir) await page.screenshot({ path: resolve(outDir, "tusi-room-resumed.png") });
    // Finished through the rules (the speed lever once more to twice as fast, then the crank), and through the door by walking.
    await ev(page, "window.__HH__.tusiCommand({ type: 'touch', id: 'lever-speed' }); window.__HH__.tusiCommand({ type: 'touch', id: 'crank' });");
    await page.waitForFunction("window.__HH__.tusi().doorLit", undefined, { timeout: 15000 });
    await skipTalk(page);
    await page.locator(`${ROOM} .stage`).focus();
    await walkRight(page, "window.__HH__.jazari() !== null");
    await page.waitForFunction("window.__HH__.where() !== null", undefined, { timeout: 30000 });
    const onward = await ev<{ journey: { scene: number; at: number }; last: { scene: string } | null; heading: string; tusi: unknown; corridors: number }>(page, `({ journey: window.__HH__.journey(), last: window.__HH__.lastDoor(), heading: document.querySelector('${ROOM} h2').textContent, tusi: window.__HH__.tusi(), corridors: document.querySelectorAll('.corridor').length })`);
    record("in the journey the workshop's lit door leads into al-Tusi's room (the second scene: no page, no corridor); left in the middle the place kept is the two circles' own snapshot, a reload offers 'Continue the journey' with his name and resumes in the room as it was (the turning and the question counted, the lever where it was set, no path and no talk); finished, its lit door walked to leads on into al-Jazari's room, the third scene",
      entered.journey.scene === 1 && entered.journey.at === 1 && entered.last?.scene === "workshop" && entered.toast === "Hudhud: On to the next page of the Atlas: Nasir al-Din al-Tusi!" && entered.heading === "Nasir al-Din al-Tusi" && entered.corridors === 0 &&
        left.turned === 1 && left.misses === 1 && left.flags.join() === "askedObs" && left.setting.d === -1 && kept?.quest === QUEST && Object.keys(kept.snap).sort().join() === "dir,flags,misses,size,speed,style,turned" && kept.snap.dir === -1 &&
        label === "Continue the journey: Nasir al-Din al-Tusi" && resumed.turned === 1 && resumed.misses === 1 && resumed.flags.join() === "askedObs" && resumed.setting.d === -1 && resumed.setting.k === 1 && resumed.last === null && resumed.talk === null && resumed.shown?.points === 0 && again.scene === 1 &&
        onward.journey.scene === 2 && onward.journey.at === 2 && onward.last?.scene === "tusi" && onward.heading === "al-Jazari and the elephant clock" && onward.tusi === null && onward.corridors === 0,
      { entered, left: { turned: left.turned, flags: left.flags, setting: left.setting }, kept, label, resumed: { turned: resumed.turned, flags: resumed.flags, setting: resumed.setting, last: resumed.last }, again, onward });
    await ctx.close();
  }

  // (6) An Arabic page.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(`${served.base}/games/hudhud/index.html?lang=ar&music=off&style=explorer&fresh=1`);
    await page.waitForFunction("window.__HH__ && window.__HH__.ready");
    await leaveOpening(page);
    await openTusi(page);
    const ar = await ev<{ dir: string; alt: string | null; heading: string; who: string | null; list: string[] }>(page, `({ dir: document.documentElement.dir, alt: document.querySelector('${ROOM} .stage').getAttribute('aria-label'), heading: document.querySelector('${ROOM} h2').textContent, who: document.querySelector('${ROOM} .talk .who') ? document.querySelector('${ROOM} .talk .who').textContent : null, list: [...document.querySelectorAll('${ROOM} .room-words li button')].map((b) => b.textContent) })`);
    await skipTalk(page);
    await fly(page, "lever-speed", "window.__HH__.tusi().setting.k === 2");
    const said = await ranText(page);
    await fly(page, "crank", "window.__HH__.tusi().turned === 1");
    await page.waitForFunction("!window.__HH__.tusi().busy", undefined, { timeout: 10000 });
    const after = { last: await lastLine(page), objective: await ev<string>(page, `document.querySelector('${ROOM} .objective').textContent`), list: await words(page) };
    if (outDir) await page.screenshot({ path: resolve(outDir, "tusi-room-ar.png") });
    record("al-Tusi's room on an Arabic page runs right to left, says its picture, its list, each lever's setting, what a lever did and the last path in Arabic, with Arabic numerals",
      ar.dir === "rtl" && ar.alt === "مرصد الطوسي في صورة. والقائمة التي بعدها تقول الشيء نفسه بالكلمات." && ar.heading.includes("الطوسي") && ar.who === "هدهد" && ar.list.length === 6 && ar.list.includes("أدِر المقبض: أدِر الدائرتين") && ar.list.some((x) => x.startsWith("حرّك ذراع السرعة")) &&
        said.startsWith("تحرّك ذراع السرعة: ") && after.last.startsWith("آخر مسار: ") && after.last.includes("٢") && after.objective.includes("١") && !/[0-9]/.test(after.list.join("") + after.last + after.objective),
      { ar, said, after });
    await ctx.close();
  }

  // (7) Movement kept still: the bird is set down at once, the turning is not shown, the path is drawn whole at once, and the door is still walked to.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await open(ctx, "&style=story&motion=reduced&fresh=1");
    await openTusi(page);
    await skipTalk(page);
    const list = await words(page);
    await ev(page, "window.__HH__.goTo('crank')");
    const atOnce = (await ts(page))!;
    const ran = await ranText(page);
    await ev(page, "window.__HH__.goTo('lever-dir')");
    const t0 = Date.now();
    await ev(page, "window.__HH__.goTo('crank')");
    await page.waitForFunction("window.__HH__.tusi().doorLit", undefined, { timeout: 5000 });
    const took = Date.now() - t0;
    const calm = (await ts(page))!;
    await skipTalk(page);
    await page.locator(`${ROOM} .stage`).focus();
    await walkRight(page, "!document.querySelector('.hub').hidden");
    const last = await ev<{ scene: string } | null>(page, "window.__HH__.lastDoor()");
    record("al-Tusi's room with motion=reduced: Story has one lever (the direction); flown to, the bird is set down and touches at once, the turning is never shown (never busy) and its whole path is drawn on the same step, Story's words say which way to try, the line is found on the second turning, and the lit door is still reached by walking",
      list.length === 5 && list.filter((x) => x.startsWith("Move the")).length === 1 && atOnce.turned === 1 && !atOnce.busy && atOnce.shown?.points === 360 && atOnce.shown.closed && ran === "The point traced a flower of 2 loops.That is not a straight line. Try turning the small circle the other way." &&
        calm.done && calm.turned === 2 && calm.misses === 1 && took < 1500 && last?.scene === "tusi",
      { list, atOnce: { turned: atOnce.turned, busy: atOnce.busy, shown: atOnce.shown }, ran, took, calm: { done: calm.done, turned: calm.turned }, last });
    await ctx.close();
  }

  // (8) Without WebGL the scene is played on the two circles' page, and finished there.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await ctx.addInitScript("const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, ...a) { return /webgl/.test(t) ? null : g.call(this, t, ...a); };");
    const page = await open(ctx, "&fresh=1&preflight=off&style=explorer");
    const note = await ev<string>(page, `(() => { const s = document.querySelector(".hub button[data-quest='${QUEST}']").parentElement.querySelector('small'); return s ? s.textContent : ''; })()`);
    await page.locator(`.hub button[data-quest='${QUEST}']`).click();
    await page.waitForFunction("window.__HH__.couple() !== null", undefined, { timeout: 10000 });
    const onPage = await ev<{ room: unknown; groups: number; roomHidden: boolean; benchShown: boolean }>(page, "({ room: window.__HH__.tusi(), groups: [...document.querySelectorAll('.bench fieldset.couple-group')].filter((f) => !f.hidden).length, roomHidden: document.querySelector('.room-box').hidden, benchShown: !document.querySelector('.bench').hidden })");
    await ev(page, "window.__HH__.coupleCommand({ type: 'set', field: 'speed', value: 2 }); window.__HH__.coupleCommand({ type: 'set', field: 'dir', value: -1 }); window.__HH__.coupleCommand({ type: 'turn' });");
    await page.waitForSelector(".bench .results:not([hidden])", { timeout: 20000 });
    const done = await ev<boolean>(page, "window.__HH__.couple().done");
    record("without WebGL al-Tusi's scene is played on the two circles' page (its trial line on the Atlas, two groups of radio buttons in Explorer, no room), and is finished there",
      /first trial/.test(note) && onPage.room === null && onPage.groups === 2 && onPage.roomHidden && onPage.benchShown && done, { note, onPage, done });
    await ctx.close();
  }
}
// Al-Khwarizmi's room, the fourth room on the room engine (asked for by the founder, 27 November 2026): opened from the
// Atlas it is a canvas scene with the problem in words, what each tray holds and every thing in the list; a weight that
// does not apply is a slip by flight and by the touch key, counted and said as on the page; a hollow group restored by
// flight; both questions, the kind answer and the feather under the box by touching (and the Touch button); the fewest
// moves by flight, the box open, the lit door, the panel with four goals and the notes, and the door walked to with real
// key presses; a reload resumes in the room as it was; an Arabic page; movement kept still; and without WebGL the scene is
// played on the locked box's page.
{
  type Sh = { tray: number; box: number; coin: number; hollowBox: number; hollowCoin: number };
  type Kw = { eq: unknown; moves: number; slips: number; flags: string[]; done: boolean; talk: { script: string } | null; sentence: string; doorLit: boolean; shown: { left: Sh; right: Sh; boxOpen: boolean; feather: boolean } | null };
  const QUEST = "w02q2-al-khwarizmi";
  const ROOM = ".room-box";
  const NOTE_ROOM = "The room, the two trays on the table, the weights, the scoop and the locked box are invented for play; they are not a picture of where al-Khwarizmi worked.";
  const kw = (page: Page) => ev<Kw | null>(page, "window.__HH__.khwarizmi()");
  const openKw = async (page: Page) => {
    await page.locator(`.hub button[data-quest='${QUEST}']`).click();
    await page.waitForFunction("window.__HH__.khwarizmi() !== null && window.__HH__.where() !== null", undefined, { timeout: 30000 });
    await page.waitForTimeout(700);
  };
  const skipTalk = async (page: Page) => {
    for (let i = 0; i < 8 && (await kw(page))?.talk; i++) {
      await page.locator(`${ROOM} .talk button.quiet`).last().click();
      await page.waitForTimeout(150);
    }
  };
  /** Flies the bird to a thing by the engine's own flight (goTo), and waits until it has landed and touched it. */
  const fly = async (page: Page, id: string, until: string) => {
    await ev(page, `window.__HH__.goTo(${JSON.stringify(id)})`);
    await page.waitForFunction(until, undefined, { timeout: 8000 });
    await page.waitForTimeout(150);
  };
  const walkRight = async (page: Page, until: string) => {
    await page.keyboard.down("ArrowRight");
    try {
      await page.waitForFunction(until, undefined, { timeout: 25000 });
    } finally {
      await page.keyboard.up("ArrowRight");
    }
  };
  const words = (page: Page) => ev<string[]>(page, `[...document.querySelectorAll('${ROOM} .room-words li button')].map((b) => b.textContent)`);
  const trays = (page: Page) => ev<string[]>(page, `[...document.querySelectorAll('${ROOM} .room-words .trays li')].map((b) => b.textContent)`);
  const sentence = (page: Page) => ev<{ text: string; live: string | null }>(page, `({ text: document.querySelector('${ROOM} .room-words .equation').textContent, live: document.querySelector('${ROOM} .room-words .equation').getAttribute('aria-live') })`);
  const ranText = (page: Page) => ev<string>(page, `document.querySelector('${ROOM} .ran').textContent`);

  // (1) to (4): one play in Explorer, from the Atlas, by flight, touch and keys.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await open(ctx, "&style=explorer");
    const atlasItem = await ev<{ label: string; notes: number }>(page, `(() => { const b = document.querySelector(".hub button[data-quest='${QUEST}']"); return { label: b.textContent, notes: b.parentElement.querySelectorAll('small').length }; })()`);
    await openKw(page);
    const opened = await ev<{ canvases: number; benchHidden: boolean; roomShown: boolean; heading: string; alt: string | null; info: { renderer: string; largestTextures: { width: number; height: number }[] }; talk: string | null }>(page, `({ canvases: document.querySelectorAll('${ROOM} .stage canvas').length, benchHidden: document.querySelector('.bench').hidden, roomShown: !document.querySelector('${ROOM}').hidden, heading: document.querySelector('${ROOM} h2').textContent, alt: document.querySelector('${ROOM} .stage').getAttribute('aria-label'), info: window.__HH__.info(), talk: document.querySelector('${ROOM} .talk:not([hidden]) .who') ? document.querySelector('${ROOM} .talk .who').textContent : null })`);
    const first = (await kw(page))!;
    const firstWords = await words(page);
    const firstTrays = await trays(page);
    const firstSentence = await sentence(page);
    if (outDir) (mkdirSync(outDir, { recursive: true }), await page.screenshot({ path: resolve(outDir, "khwarizmi-room-start.png") }));
    record("al-Khwarizmi's room opens from the Atlas as a canvas scene on the room engine: the Atlas names it as it names the other rooms (no line about a page), the room speaks first, the trays hold the problem as the page's picture shows it (three closed boxes and four hollow coins on the left, one box and six coins on the right), the problem is said in words in a polite live region with what each tray holds, and every thing in the room is a button in the list in words (al-Khwarizmi, the child, the box, the two weights and the scoop with the page's words for their moves, and the one hollow group there is)",
      atlasItem.label === "Play: al-Khwarizmi" && atlasItem.notes === 0 && opened.canvases === 1 && opened.benchHidden && opened.roomShown && opened.heading === "al-Khwarizmi" && opened.alt === "Al-Khwarizmi's room, as a picture. The list after it says the same in words." && opened.info.renderer === "webgl" && Math.max(...opened.info.largestTextures.flatMap((t) => [t.width, t.height])) <= 2048 && opened.talk === "Hudhud" &&
        first.moves === 0 && first.slips === 0 && !first.done && JSON.stringify(first.shown?.left) === JSON.stringify({ tray: 0, box: 3, coin: 0, hollowBox: 0, hollowCoin: 4 }) && JSON.stringify(first.shown?.right) === JSON.stringify({ tray: 1, box: 1, coin: 6, hollowBox: 0, hollowCoin: 0 }) && first.shown?.boxOpen === false && first.shown.feather &&
        firstSentence.text === "3 things less 4 equal 1 thing and 6" && firstSentence.live === "polite" && firstTrays.join("|") === "The left tray: 3 things less 4|The right tray: 1 thing and 6" &&
        firstWords.join("|") === "Go to al-Khwarizmi|Go to the child who carries the box|Go to the locked box on its plinth|Go to the weight marked with a box: Balance the things|Go to the weight marked with a coin: Balance the numbers|Go to the scoop: Share the number among the things|Go to the hollow coins on the left tray: Restore the 4 taken from the left",
      { atlasItem, opened: { ...opened, info: { renderer: opened.info.renderer } }, first: { moves: first.moves, shown: first.shown }, firstSentence, firstTrays, firstWords });
    await skipTalk(page);

    // (2) A slip by flight (the weight marked with a coin, when the numbers do not stand on both sides), then the same by
    // the touch key; then the hollow coins restored by their button in the list (which flies the bird there and touches).
    await fly(page, "weight-number", "window.__HH__.khwarizmi().slips === 1");
    const landed = await ev<{ x: number; y: number; near: string | null }>(page, "window.__HH__.where()");
    const slip1 = { v: (await kw(page))!, ran: await ranText(page), sentence: await sentence(page) };
    await page.locator(`${ROOM} .stage`).focus();
    await page.keyboard.press("KeyE");
    await page.waitForFunction("window.__HH__.khwarizmi().slips === 2", undefined, { timeout: 4000 });
    const slip2 = (await kw(page))!;
    await page.locator(`${ROOM} .room-words li button`, { hasText: "Restore the 4 taken from the left" }).click();
    await page.waitForFunction("window.__HH__.khwarizmi().moves === 1", undefined, { timeout: 8000 });
    await page.waitForTimeout(300);
    const restored = { v: (await kw(page))!, ran: await ranText(page), sentence: await sentence(page), trays: await trays(page), list: await words(page), objective: await ev<string>(page, `document.querySelector('${ROOM} .objective').textContent`) };
    if (outDir) await page.screenshot({ path: resolve(outDir, "khwarizmi-room-restored.png") });
    record("a weight whose kind is not on both sides, touched by flight (the bird landing on the stand by it) and then by the E key, is a slip each time: counted, the problem unchanged, and Explorer told that balancing does not apply here, as on the page; the hollow coins, restored from their button in the list, are gone from the tray, the four added to both sides, the new problem said in words, and their button gone from the list",
      landed.near === "weight-number" && landed.y === 540 && slip1.v.slips === 1 && slip1.v.moves === 0 && slip1.ran === "Balancing does not apply here." && slip1.sentence.text === "3 things less 4 equal 1 thing and 6" && slip2.slips === 2 && slip2.moves === 0 &&
        restored.v.moves === 1 && restored.v.slips === 2 && restored.ran === "Restored. What was taken away there was added to both sides, so it is gone." && restored.sentence.text === "3 things equal 1 thing and 10" && restored.trays.join("|") === "The left tray: 3 things|The right tray: 1 thing and 10" &&
        JSON.stringify(restored.v.shown?.left) === JSON.stringify({ tray: 0, box: 3, coin: 0, hollowBox: 0, hollowCoin: 0 }) && JSON.stringify(restored.v.shown?.right) === JSON.stringify({ tray: 1, box: 1, coin: 10, hollowBox: 0, hollowCoin: 0 }) &&
        !restored.list.some((w) => w.includes("Restore")) && restored.list.length === 6 && restored.objective.includes("Moves: 1 · Slips: 2"),
      { landed, slip1: { slips: slip1.v.slips, ran: slip1.ran, sentence: slip1.sentence }, slip2: { slips: slip2.slips }, restored: { ...restored, v: { moves: restored.v.moves, shown: restored.v.shown } } });

    // (3) Al-Khwarizmi, the child and the box, by touching them; the Touch button touches the child again.
    await fly(page, "khwarizmi", "window.__HH__.khwarizmi().talk !== null");
    const hello = await page.locator(`${ROOM} .talk .line + span`).textContent();
    await page.locator(`${ROOM} .talk .choices button`, { hasText: "Ask how he wrote problems" }).click();
    const wordsWho = await page.locator(`${ROOM} .talk .who`).textContent();
    const wordsLine = await page.locator(`${ROOM} .talk .line + span`).textContent();
    await page.locator(`${ROOM} .talk .choices button`, { hasText: "Ask about the two operations" }).click();
    const opsLine = await page.locator(`${ROOM} .talk .line + span`).textContent();
    const thanks = await page.locator(`${ROOM} .talk .choices button`).last().textContent();
    await page.locator(`${ROOM} .talk .choices button`).last().click();
    const bye = await page.locator(`${ROOM} .talk .line + span`).textContent();
    await page.locator(`${ROOM} .talk button`, { hasText: "Next" }).click();
    await fly(page, "child", "window.__HH__.khwarizmi().talk !== null");
    const childLine = await page.locator(`${ROOM} .talk .line + span`).textContent();
    await page.locator(`${ROOM} .talk .choices button`, { hasText: "It is all right. We will find the number together." }).click();
    for (let i = 0; i < 3 && (await kw(page))?.talk; i++) await page.locator(`${ROOM} .talk button`, { hasText: "Next" }).click();
    await page.locator(`${ROOM} .pad button.wide`).click();
    const again = (await kw(page))!.talk?.script ?? null;
    await skipTalk(page);
    await fly(page, "box", "window.__HH__.khwarizmi().flags.includes('feather')");
    const onPlinth = await ev<{ y: number }>(page, "window.__HH__.where()");
    const boxLine = await page.locator(`${ROOM} .talk .line + span`).textContent();
    await skipTalk(page);
    const asked = (await kw(page))!;
    record("touching al-Khwarizmi greets and asks him how he wrote problems and about the two operations (the page's own lines, said by the museum's record), with a goodbye of the room's own; the child is answered kindly, and the Touch button touches the child again; the feather is under the locked box on its plinth, reached by flight; the flags are the page quest's own and no move is counted",
      hello === "Welcome. Ask me what you like; the problem will wait on the trays." && wordsWho === "From the museum's record" && /wrote everything in words, not symbols/.test(wordsLine ?? "") && /named after two operations/.test(opsLine ?? "") && thanks === "Thank you. Now to the trays." && bye === "Go well, and give the box its number." &&
        childLine === "I carried the box here and locked it so the page would not blow away, and now I have forgotten the number!" && again === "childKind" &&
        onPlinth.y === 330 && boxLine === "A feather, under the box! It is one of mine." && asked.flags.slice().sort().join() === "answered,askedOps,askedWords,feather,kind" && asked.moves === 1 && asked.shown?.feather === false,
      { hello, wordsWho, wordsLine, opsLine, thanks, bye, childLine, again, onPlinth, boxLine, flags: asked.flags });

    // (4) The weight marked with a box, then the scoop, by flight: one thing equals five, the box opens, the door lights,
    // the panel; then the bird is flown to the open box and walked to the door with real key presses.
    await fly(page, "weight-things", "window.__HH__.khwarizmi().moves === 2");
    const balanced = { sentence: await sentence(page), ran: await ranText(page) };
    await fly(page, "scoop", "window.__HH__.khwarizmi().done");
    await page.waitForFunction("window.__HH__.khwarizmi().doorLit", undefined, { timeout: 5000 });
    await page.waitForTimeout(400);
    const live = await ev<string>(page, `document.querySelector('${ROOM} .room > .visually-hidden[role=status]').textContent`);
    const panel = await ev<{ shown: boolean; modal: number; goals: number; met: number; notes: string[]; links: string[]; pending: string; buttons: string[]; door: { lit: boolean; scene: string }; list: string[]; objective: string; saved: boolean; resume: unknown }>(page, `(() => { const p = document.querySelector('${ROOM} .door-panel'); return { shown: !p.hidden, modal: document.querySelectorAll('[aria-modal=true]').length, goals: p.querySelectorAll('.goals li').length, met: p.querySelectorAll('.goals .met').length, notes: [...p.querySelectorAll('.note p')].map((x) => x.textContent), links: [...p.querySelectorAll('.note a')].map((a) => a.getAttribute('href')), pending: p.querySelector('.pending').textContent, buttons: [...p.querySelectorAll('button')].map((b) => b.textContent), door: window.__HH__.door(), list: [...document.querySelectorAll('${ROOM} .room-words li button')].map((b) => b.textContent), objective: document.querySelector('${ROOM} .objective').textContent, saved: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.quests?.['${QUEST}']?.done === true, resume: JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null }; })()`);
    const finished = (await kw(page))!;
    const done = { sentence: await sentence(page), ran: await ranText(page) };
    await skipTalk(page);
    // Flown to the open box (nothing is touched once it is open) for a picture of it, then walked to the door.
    await ev(page, "window.__HH__.goTo('box')");
    await page.waitForTimeout(1300);
    if (outDir) await page.screenshot({ path: resolve(outDir, "khwarizmi-room-box-open.png") });
    await page.locator(`${ROOM} .stage`).focus();
    await page.keyboard.down("ArrowRight");
    await page.waitForTimeout(700);
    if (outDir) await page.screenshot({ path: resolve(outDir, "khwarizmi-room-door-lit.png") });
    await page.keyboard.up("ArrowRight");
    await walkRight(page, "!document.querySelector('.hub').hidden");
    const back = await ev<{ hub: boolean; roomHidden: boolean; last: { scene: string; where: { x: number; y: number; reach: number }; bird: { x: number; y: number } } | null; label: string; canvases: number }>(page, `({ hub: !document.querySelector('.hub').hidden, roomHidden: document.querySelector('.room-box').hidden, last: window.__HH__.lastDoor(), label: document.querySelector(".hub button[data-quest='${QUEST}']").textContent, canvases: document.querySelectorAll('.room-box canvas, #stage canvas').length })`);
    const reach = back.last ? Math.hypot(back.last.where.x - back.last.bird.x, back.last.where.y - (back.last.bird.y - 30)) : null;
    record("the weight marked with a box and then the scoop, by flight, finish the fewest moves: the sentence says two things equal ten, then one thing equal five; the box opens, Hudhud says the page is home, the door lights, the panel beside the stage (no modal sheet) shows four goals met, the quest's four notes, the room's note and 'Historical review pending', and the three links; the list then offers only the door, the place kept is cleared, and holding the right arrow key walks Hudhud to it and, in free play, back to the Atlas",
      balanced.sentence.text === "2 things equal 10" && balanced.ran === "Balanced. The smaller amount of that kind was taken away from both sides." && done.sentence.text === "1 thing equal 5" && done.ran === "One thing equals a number. The box opens!" &&
        finished.done && finished.moves === 3 && finished.slips === 2 && finished.talk?.script === "done" && finished.shown?.boxOpen === true && JSON.stringify(finished.shown.left) === JSON.stringify({ tray: 0, box: 1, coin: 0, hollowBox: 0, hollowCoin: 0 }) && finished.shown.right.coin === 5 && /door is open/.test(live) &&
        panel.shown && panel.modal === 0 && panel.goals === 4 && panel.met === 4 && panel.notes.includes(NOTE_ROOM) && panel.notes.some((n) => /^This is a game, not a history\./.test(n)) && panel.notes.some((n) => /^From the museum's record: al-Khwarizmi's book/.test(n)) && /Historical review pending/.test(panel.pending) &&
        panel.links.join() === "https://islam.museum/en/person/al-khwarizmi/,https://islam.museum/en/work/al-jabr-wal-muqabala/,https://islam.museum/en/invention/algebra/" && panel.buttons.join("|") === "Go through the door|Play again|Back to the Atlas" && panel.door.lit && panel.door.scene === "khwarizmi" &&
        panel.list.join() === "Go through the door" && panel.objective.startsWith("Walk Hudhud to the lit door at the end of the room.") && panel.saved && panel.resume === null &&
        back.hub && back.roomHidden && back.last?.scene === "khwarizmi" && reach !== null && reach < back.last.where.reach && /^Play again: /.test(back.label) && back.canvases === 0,
      { balanced, done, finished: { done: finished.done, moves: finished.moves, slips: finished.slips, shown: finished.shown }, live, panel, back: { ...back }, reach });
    await ctx.close();
  }

  // (5) Left in the middle, the page loaded again: the Atlas says Continue, and the room comes back as it was.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await open(ctx, "&style=explorer");
    await openKw(page);
    await skipTalk(page);
    await fly(page, "restore-left-number", "window.__HH__.khwarizmi().moves === 1");
    await fly(page, "weight-number", "window.__HH__.khwarizmi().slips === 1");
    await fly(page, "khwarizmi", "window.__HH__.khwarizmi().talk !== null");
    await page.locator(`${ROOM} .talk .choices button`, { hasText: "Ask about the two operations" }).click();
    await skipTalk(page);
    const left = (await kw(page))!;
    const kept = await ev<{ quest: string; snap: Record<string, unknown> } | null>(page, "JSON.parse(localStorage.getItem('im.hudhud.save.v1') || '{}').slots?.[0]?.resume ?? null");
    await ev(page, "window.__HH__.saveReady()");
    await page.reload();
    await page.waitForFunction("window.__HH__ && window.__HH__.ready");
    await leaveOpening(page);
    const label = await ev<string>(page, `document.querySelector(".hub button[data-quest='${QUEST}']").textContent`);
    await page.locator(`.hub button[data-quest='${QUEST}']`).click();
    await page.waitForFunction("window.__HH__.khwarizmi() !== null && window.__HH__.where() !== null", undefined, { timeout: 30000 });
    await page.waitForTimeout(500);
    const resumed = (await kw(page))!;
    const resumedWords = { sentence: await sentence(page), trays: await trays(page) };
    if (outDir) await page.screenshot({ path: resolve(outDir, "khwarizmi-room-resumed.png") });
    record("al-Khwarizmi's room left in the middle keeps the locked box's own snapshot; the page loaded again, the Atlas says Continue, and the room comes back as it was (the move, the slip and the question counted, three boxes against one box and ten coins on the trays, the same sentence, no talk)",
      left.moves === 1 && left.slips === 1 && left.flags.join() === "askedOps" && kept?.quest === QUEST && Object.keys(kept.snap).sort().join() === "eq,flags,moves,slips,style" && kept.snap.moves === 1 &&
        /^Continue: /.test(label) && resumed.moves === 1 && resumed.slips === 1 && resumed.flags.join() === "askedOps" && resumed.talk === null && JSON.stringify(resumed.eq) === JSON.stringify(left.eq) &&
        resumedWords.sentence.text === "3 things equal 1 thing and 10" && resumedWords.trays.join("|") === "The left tray: 3 things|The right tray: 1 thing and 10" && JSON.stringify(resumed.shown?.right) === JSON.stringify({ tray: 1, box: 1, coin: 10, hollowBox: 0, hollowCoin: 0 }),
      { left: { moves: left.moves, slips: left.slips, flags: left.flags }, kept, label, resumed: { moves: resumed.moves, slips: resumed.slips, flags: resumed.flags, shown: resumed.shown }, resumedWords });
    await ctx.close();
  }

  // (5b) In the journey: al-Jazari's lit door leads into this room (the fourth scene), and this room's lit door, walked
  // to, leads on to the fifth scene, al-Kindi's page, which keeps its corridor until it has a room.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await open(ctx, "&style=explorer");
    await ev(page, "window.__HH__.beginJourney()");
    await page.waitForFunction("window.__HH__.where() !== null", undefined, { timeout: 30000 });
    await ev(page, "window.__HH__.command({type:'skip'}); for (const id of ['mirror-a','mirror-c','mirror-e']) window.__HH__.touch(id); window.__HH__.command({type:'skip'}); window.__HH__.touch('page');");
    await ev(page, "window.__HH__.goThroughDoor()");
    await page.waitForFunction("window.__HH__.tusi() !== null && window.__HH__.where() !== null", undefined, { timeout: 30000 });
    await ev(page, "window.__HH__.tusiCommand({ type: 'skip' }); for (const id of ['lever-speed', 'lever-dir', 'crank']) window.__HH__.tusiCommand({ type: 'touch', id });");
    await page.waitForFunction("window.__HH__.tusi().doorLit", undefined, { timeout: 15000 });
    await ev(page, "window.__HH__.goThroughDoor()");
    await page.waitForFunction("window.__HH__.jazari() !== null && window.__HH__.where() !== null", undefined, { timeout: 30000 });
    await ev(page, "window.__HH__.jazariCommand({ type: 'skip' })");
    for (const id of ["place-2", "place-3", "place-1", "place-1", "place-3", "spare-1", "place-2", "spare-1", "place-3", "place-5", "place-4", "lever"]) await ev(page, `window.__HH__.jazariCommand({ type: 'touch', id: '${id}' })`);
    await page.waitForFunction("window.__HH__.jazari().doorLit", undefined, { timeout: 15000 });
    await ev(page, "window.__HH__.goThroughDoor()");
    await page.waitForFunction("window.__HH__.khwarizmi() !== null && window.__HH__.where() !== null", undefined, { timeout: 30000 });
    const entered = await ev<{ journey: { scene: number; at: number }; last: { scene: string } | null; toast: string | null; heading: string; corridors: number; page: unknown }>(page, `({ journey: window.__HH__.journey(), last: window.__HH__.lastDoor(), toast: document.querySelector('.toast') ? document.querySelector('.toast').textContent : null, heading: document.querySelector('${ROOM} h2').textContent, corridors: document.querySelectorAll('.corridor').length, page: window.__HH__.algebra() })`);
    await skipTalk(page);
    for (const id of ["restore-left-number", "weight-things", "scoop"]) await ev(page, `window.__HH__.khwarizmiCommand({ type: 'touch', id: '${id}' })`);
    await page.waitForFunction("window.__HH__.khwarizmi().doorLit", undefined, { timeout: 15000 });
    await skipTalk(page);
    await page.locator(`${ROOM} .stage`).focus();
    await walkRight(page, "window.__HH__.cipher() !== null");
    const onward = await ev<{ journey: { scene: number; at: number }; last: { scene: string } | null; heading: string; room: unknown; roomHidden: boolean }>(page, "({ journey: window.__HH__.journey(), last: window.__HH__.lastDoor(), heading: document.querySelector('.bench h2').textContent, room: window.__HH__.khwarizmi(), roomHidden: document.querySelector('.room-box').hidden })");
    record("in the journey al-Jazari's lit door leads into al-Khwarizmi's room (the fourth scene: no page, no corridor, Hudhud's line naming him); finished, its lit door walked to with the right arrow key leads on to the fifth scene, al-Kindi's page",
      entered.journey.scene === 3 && entered.journey.at === 3 && entered.last?.scene === "jazari" && entered.toast === "Hudhud: On to the next page of the Atlas: al-Khwarizmi!" && entered.heading === "al-Khwarizmi" && entered.corridors === 0 && entered.page === null &&
        onward.journey.scene === 4 && onward.journey.at === 4 && onward.last?.scene === "khwarizmi" && onward.room === null && onward.roomHidden && /al-Kindi/.test(onward.heading),
      { entered, onward });
    await ctx.close();
  }

  // (6) An Arabic page: the first side on the right tray, Arabic numerals and the right plural.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(`${served.base}/games/hudhud/index.html?lang=ar&music=off&style=explorer&fresh=1`);
    await page.waitForFunction("window.__HH__ && window.__HH__.ready");
    await leaveOpening(page);
    await openKw(page);
    const ar = await ev<{ dir: string; alt: string | null; heading: string; who: string | null }>(page, `({ dir: document.documentElement.dir, alt: document.querySelector('${ROOM} .stage').getAttribute('aria-label'), heading: document.querySelector('${ROOM} h2').textContent, who: document.querySelector('${ROOM} .talk .who') ? document.querySelector('${ROOM} .talk .who').textContent : null })`);
    await skipTalk(page);
    const s0 = { sentence: await sentence(page), trays: await trays(page), list: await words(page), v: (await kw(page))! };
    await fly(page, "restore-left-number", "window.__HH__.khwarizmi().moves === 1");
    const s1 = await sentence(page);
    await fly(page, "weight-things", "window.__HH__.khwarizmi().moves === 2");
    const s2 = { sentence: await sentence(page), objective: await ev<string>(page, `document.querySelector('${ROOM} .objective').textContent`), list: await words(page) };
    if (outDir) await page.screenshot({ path: resolve(outDir, "khwarizmi-room-ar.png") });
    record("al-Khwarizmi's room on an Arabic page runs right to left, puts the first side on the right tray (as the page's picture does), says the problem in Arabic with Arabic numerals and the right plural (a few things, one thing, then two), names the hollow coins as on the right tray and the side as the right one, and shows no Latin digit",
      ar.dir === "rtl" && ar.alt === "غرفة الخوارزمي في صورة. والقائمة التي بعدها تقول الشيء نفسه بالكلمات." && ar.heading === "الخوارزمي" && ar.who === "هدهد" &&
        s0.sentence.text === "٣ أشياء إلا ٤ تعدل شيئًا واحدًا و٦" && s0.trays.join("|") === "الصينية اليمنى: ٣ أشياء إلا ٤|الصينية اليسرى: شيء واحد و٦" && s0.v.shown?.left.tray === 1 && s0.v.shown.right.tray === 0 &&
        s0.list.includes("اذهب إلى القطع النقدية المفرغة في الصينية اليمنى: اجبر ما نُقص من الجهة اليمنى، وهو ٤") &&
        s1.text === "٣ أشياء تعدل شيئًا واحدًا و١٠" && s2.sentence.text === "شيئان تعدل ١٠" && s2.objective.includes("٢") && !/[0-9]/.test(s0.list.join("") + s2.list.join("") + s2.objective + s2.sentence.text),
      { ar, s0: { sentence: s0.sentence.text, trays: s0.trays, list: s0.list }, s1, s2 });
    await ctx.close();
  }

  // (7) Movement kept still: the bird is set down at once and each touch takes effect on the same step; Story's two
  // balances open the box, and the door is still walked to.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await open(ctx, "&style=story&motion=reduced&fresh=1");
    await openKw(page);
    await skipTalk(page);
    const first = await sentence(page);
    await ev(page, "window.__HH__.goTo('scoop')");
    const slip = { v: (await kw(page))!, ran: await ranText(page) };
    const t0 = Date.now();
    await ev(page, "window.__HH__.goTo('weight-things')");
    const once = (await kw(page))!;
    await ev(page, "window.__HH__.goTo('weight-number')");
    await page.waitForFunction("window.__HH__.khwarizmi().doorLit", undefined, { timeout: 5000 });
    const took = Date.now() - t0;
    const calm = (await kw(page))!;
    await skipTalk(page);
    await page.locator(`${ROOM} .stage`).focus();
    await walkRight(page, "!document.querySelector('.hub').hidden");
    const last = await ev<{ scene: string } | null>(page, "window.__HH__.lastDoor()");
    record("al-Khwarizmi's room with motion=reduced: flown to, the bird is set down and touches at once; the scoop before the problem can be shared is a slip that Story explains with the moves that would work now; the two weights open the box with no wait, and the lit door is still reached by walking",
      first.text === "2 things and 3 equal 1 thing and 8" && slip.v.slips === 1 && slip.ran === "Sharing needs only things on one side and only a number, which divides evenly, on the other. Nothing changed. Moves that would work now: Balance the things, Balance the numbers." &&
        once.moves === 1 && calm.done && calm.moves === 2 && calm.slips === 1 && calm.sentence === "1 thing equal 5" && took < 1500 && last?.scene === "khwarizmi",
      { first, slip: { slips: slip.v.slips, ran: slip.ran }, once: once.moves, calm: { done: calm.done, moves: calm.moves, sentence: calm.sentence }, took, last });
    await ctx.close();
  }

  // (8) Without WebGL the scene is played on the locked box's page, and finished there.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await ctx.addInitScript("const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, ...a) { return /webgl/.test(t) ? null : g.call(this, t, ...a); };");
    const page = await open(ctx, "&fresh=1&preflight=off&style=explorer");
    const note = await ev<string>(page, `(() => { const s = document.querySelector(".hub button[data-quest='${QUEST}']").parentElement.querySelector('small'); return s ? s.textContent : ''; })()`);
    await page.locator(`.hub button[data-quest='${QUEST}']`).click();
    await page.waitForFunction("window.__HH__.algebra() !== null", undefined, { timeout: 10000 });
    const onPage = await ev<{ room: unknown; buttons: number; roomHidden: boolean; benchShown: boolean }>(page, "({ room: window.__HH__.khwarizmi(), buttons: document.querySelectorAll('.bench .moves button').length, roomHidden: document.querySelector('.room-box').hidden, benchShown: !document.querySelector('.bench').hidden })");
    for (const m of ["restore-left-number", "balance-things", "share"]) await page.locator(`.bench .moves button[data-move='${m}']`).click();
    await page.waitForSelector(".bench .results:not([hidden])", { timeout: 20000 });
    const done = await ev<boolean>(page, "window.__HH__.algebra().done");
    record("without WebGL al-Khwarizmi's scene is played on the locked box's page (its trial line on the Atlas, the page's move buttons, no room), and is finished there",
      /first trial/.test(note) && onPage.room === null && onPage.buttons === 4 && onPage.roomHidden && onPage.benchShown && done, { note, onPage, done });
    await ctx.close();
  }
}
await browser.close();
await served.close();
const report = { ran: new Date().toISOString(), results, errors };
if (outDir) writeFileSync(resolve(outDir, "hudhud-checks.json"), `${JSON.stringify(report, null, 1)}\n`);
console.log(JSON.stringify(report, null, 1));
if (errors.length || results.some((r) => !r.pass)) process.exit(1);
