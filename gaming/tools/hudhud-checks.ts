// Things about Hudhud that only a real browser can show, each checked and reported: a quest left in the middle comes
// back after the page is loaded again; a key can be given to an action and then works; a redraw of the picture keeps
// the quest; and with WebGL refused the whole quest can still be finished from the list in words.
// Usage: npx tsx --tsconfig tsconfig.json tools/hudhud-checks.ts [out dir]
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type BrowserContext, type Page } from "playwright-core";
import { serveWorkspace } from "./serve";

const outDir = process.argv[2] ? resolve(process.argv[2]) : null;
const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--window-size=1300,900", "--force-device-scale-factor=1"] });
const errors: string[] = [];
const results: { check: string; pass: boolean; detail: unknown }[] = [];
const record = (check: string, pass: boolean, detail: unknown) => results.push({ check, pass, detail });
const open = async (ctx: BrowserContext, query: string): Promise<Page> => {
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${served.base}/games/hudhud/index.html?lang=en&music=off${query}`);
  await page.waitForFunction("window.__HH__ && (window.__HH__.ready || window.__HH__.error)");
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
  const page = await open(ctx, "&fresh=1");
  await page.keyboard.press("Tab");
  const link = await ev<string>(page, "document.activeElement.className");
  await page.keyboard.press("Enter");
  const landed = await ev<string>(page, "document.activeElement.id || location.hash");
  await page.keyboard.press("Tab");
  const next = await ev<boolean>(page, "!!document.activeElement.closest('#play')");
  record("the skip link lands on the game", link === "skip" && /play/.test(landed) && next, { link, landed, next });
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
  await page.locator(".sheet button", { hasText: "Import save" }).last().click();
  await page.waitForTimeout(600);
  const imported = await ev<{ progress: string; toast: string | null }>(page, "({ progress: document.querySelector('.hub .progress').textContent, toast: document.querySelector('.toast') ? document.querySelector('.toast').textContent : null })");
  // A file that is not a save is refused and changes nothing.
  await page.getByRole("button", { name: "Settings" }).click().catch(() => undefined);
  await page.locator(".sheet input[type=file]").first().setInputFiles({ name: "x.json", mimeType: "application/json", buffer: Buffer.from(text.replace('"done": true', '"done": false')) });
  await page.locator(".sheet button", { hasText: "Import save" }).last().click();
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
  record(`the Atlas shows ten worlds and fifty pages, and one comes home (${lang})`, before.worlds === 10 && before.pages === 50 && before.open === 1 && before.stageHidden && /\D0\D|٠/.test(` ${before.progress} `) && /\D1\D|١/.test(` ${after.progress} `) && after.hubShown && after.canvases === 0 && !after.started && again.turns === 0 && !again.done, { before, after, again });
  await ctx.close();
}
await browser.close();
await served.close();
const report = { ran: new Date().toISOString(), results, errors };
if (outDir) writeFileSync(resolve(outDir, "hudhud-checks.json"), `${JSON.stringify(report, null, 1)}\n`);
console.log(JSON.stringify(report, null, 1));
if (errors.length || results.some((r) => !r.pass)) process.exit(1);
