// Things about Hudhud that only a real browser can show, each checked and reported: a quest left in the middle comes
// back after the page is loaded again; a key can be given to an action and then works; a redraw of the picture keeps
// the quest; and with WebGL refused the whole quest can still be finished from the list in words.
// Usage: npx tsx --tsconfig tsconfig.json tools/hudhud-checks.ts [out dir]
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type BrowserContext, type Page } from "playwright-core";
import { ATLASBOOK, worldCentre } from "../games/hudhud/src/art/atlasbook";
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
  const end = await ev<{ done: boolean; results: string | null }>(page, "({ done: window.__HH__.state().done, results: document.querySelector('.sheet h2') ? document.querySelector('.sheet h2').textContent : null })");
  if (outDir) await page.screenshot({ path: resolve(outDir, "finished-in-words-without-webgl.png") });
  record("without WebGL the quest is finished in words", told.scene === null && !!told.toast && end.done && end.results === "The page is home", { told, end });
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
  await page.locator(".sheet button").first().click(); // "Back to the Atlas" is the first button of the results
  await page.waitForTimeout(400);
  const after = await ev<{ progress: string; button: string; hubShown: boolean; canvases: number; started: boolean }>(page, "({ progress: document.querySelector('.hub .progress').textContent, button: document.querySelector('.hub button.primary').textContent, hubShown: !document.querySelector('.hub').hidden, canvases: document.querySelectorAll('#stage canvas').length, started: window.__HH__.started() })");
  if (outDir) await page.screenshot({ path: resolve(outDir, `atlas-${lang}-one-page-home.png`), fullPage: true });
  // And the quest can be entered again from there.
  await playing(page);
  const again = await ev<{ turns: number; done: boolean }>(page, "({ turns: window.__HH__.state().turns, done: window.__HH__.state().done })");
  record(`the Atlas shows ten worlds and fifty pages, two of them open, and one comes home (${lang})`, before.worlds === 10 && before.pages === 50 && before.open === 2 && before.stageHidden && /\D0\D|٠/.test(` ${before.progress} `) && /\D1\D|١/.test(` ${after.progress} `) && after.hubShown && after.canvases === 0 && !after.started && again.turns === 0 && !again.done, { before, after, again });
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
  const page = await open(ctx, "&style=explorer");
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
  const page = await open(ctx, "&style=explorer");
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
  let page = await open(ctx, "&style=explorer");
  const first = await bookView(page);
  if (outDir) (mkdirSync(outDir, { recursive: true }), await page.screenshot({ path: resolve(outDir, "atlas-picture-en.png"), fullPage: true }));
  const present = first.role === "img" && /^The open Atlas: ten worlds, five pages each\. 0 of 50 pages are home\.$/.test(first.alt ?? "") && first.picture.worlds === 10 && first.picture.home.length === 10 && first.picture.home.every((n) => n === 0) && first.picture.open.join() === "2,3";
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
  const redrawn = after.picture.home[1] === 1 && after.picture.home.filter((n) => n > 0).length === 1 && /1 of 50 pages are home\./.test(after.alt ?? "") && after.alt !== first.alt && after.picture.open.join() === "2,3";
  await page.close();
  // Reduced motion: the world's list is there at once, not scrolled to smoothly.
  const calm = await open(ctx, "&motion=reduced");
  const spot = await medallion(calm, 9, false);
  await calm.mouse.click(spot.x, spot.y);
  const reduced = await ev<{ world: string | null; moved: boolean }>(calm, "({ world: document.activeElement.tagName === 'H3' ? document.activeElement.dataset.world : null, moved: window.scrollY > 0 && document.activeElement.getBoundingClientRect().top < innerHeight })");
  await calm.close();
  // The blunt answer to the apprentice is kept: after a reload the apprentice cannot be answered again.
  page = await open(ctx, "&style=explorer");
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
  const arabic = arFirst.dir === "rtl" && arFirst.role === "img" && /عشرة عوالم/.test(arFirst.alt ?? "") && /٠ من ٥٠/.test(arFirst.alt ?? "") && arFirst.picture.open.join() === "2,3" && arFirst.buttons.length === 10 && arFirst.buttons[0]!.x > arFirst.buttons[9]!.x && one.x > one.box.x + one.box.width / 2 && ten.x < ten.box.x + ten.box.width / 2 && arOne === "1" && arTen === "10" && arFirst.buttons.every((x) => x.w >= 44 && x.h >= 44 && (x.label ?? "").startsWith("العالم "));
  await arCtx.close();
  await ctx.close();
  record(
    "the Atlas page shows the open Atlas: a picture with an alt that counts the pages home, ten numbered buttons that do what it does (a click or the keyboard moves focus to the world's heading, at once when motion is reduced), a redraw after a quest; the blunt answer is kept; the opening shows after a slot change in Settings; and it all works right to left",
    present && buttonsOk && clicked.focus === "9" && clicked.inView && between !== "1" && between !== "2" && byEnter === "6" && onNext === "7" && bySpace === "7" && redrawn && reduced.world === "9" && reduced.moved &&
      bluntKept.flags.join() === "answered" && bluntKept.disabled && bluntKept.restartLabel === "Start this quest again" && opening && arabic,
    { first, present, buttonsOk, clicked, between, byEnter, onNext, bySpace, after: { alt: after.alt, picture: after.picture }, reduced, bluntKept, opening: { whileOpen, onClose, seen, inQuest, backOnAtlas }, arabic: { arFirst: { alt: arFirst.alt, dir: arFirst.dir, picture: arFirst.picture, firstX: arFirst.buttons[0]?.x, lastX: arFirst.buttons[9]?.x }, arOne, arTen } },
  );
}
await browser.close();
await served.close();
const report = { ran: new Date().toISOString(), results, errors };
if (outDir) writeFileSync(resolve(outDir, "hudhud-checks.json"), `${JSON.stringify(report, null, 1)}\n`);
console.log(JSON.stringify(report, null, 1));
if (errors.length || results.some((r) => !r.pass)) process.exit(1);
