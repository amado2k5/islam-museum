// Plays Granada's first scenario in real Chrome, in a chosen language, and keeps the screenshots. It checks that the
// page can be played with the mouse and with the keyboard alone, that the days pass and stop when told, that a
// reload resumes the same day, that a damaged save is set aside, that the land is not mirrored for a right-to-left
// language, and that a whole campaign can be carried to its end through the page. It is a functional check and not
// a judgement of whether the game is any good. The checks of the page are made on the plan (view=plan); the 3D valley
// has its own part near the end: that it starts, shows, opens a field when one is clicked, and is steered by keys.
// Usage: npx tsx --tsconfig tsconfig.json tools/granada-play.ts <out dir> [lang=en]
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
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
// The authored models are media and are on a machine only if the art scripts were run there. Where they are, the
// valley must take them up; where they are not, the page is told not to ask for them, and draws its own shapes.
const haveModels = existsSync(resolve(import.meta.dirname, "../media/models/granada/2/mill.gltf"));
const url = (extra = "", view = "&view=plan") => `${served.base}/games/granada/index.html?lang=${lang}&seed=7&music=off${haveModels ? "" : "&models=off"}${view}${extra}`;
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
// A signed change keeps its sign before its digits in every language, a right-to-left one included.
const signed = await game<string[]>("[...document.querySelectorAll('.delta')].map((e) => getComputedStyle(e).direction)");
if (signed.some((d) => d !== "ltr")) await fail(`a signed figure in the top bar is laid out ${signed.join(", ")}`);
if ((await page.locator("dialog.help .langs a").count()) !== 7) await fail("the help does not offer the seven languages");
if ((await page.locator("dialog.help #help-more li").count()) !== 6) await fail("the help does not explain building, trade, what lies ahead, choosing, the years and the keys");
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

// ---- The valley in 3D: the same game, seen and steered in it ----
await page.goto(url("&fresh=1&no3d=1", ""));
await ready();
if ((await game<string>("window.__GR__.threeD")) !== "off" || (await page.locator("canvas.scene").count()) !== 0 || !(await page.locator("svg.map").isVisible())) await fail("asked for no 3D, the page did not keep to its plan");
await page.goto(url("&fresh=1", ""));
await ready();
await page.locator("#brief-start").click();
for (const end = Date.now() + 120_000; (await game<string>("window.__GR__.threeD")) === "pending"; ) {
  if (Date.now() > end) await fail("the 3D valley was still starting after two minutes");
  await page.waitForTimeout(200);
}
const threeD = await game<string>("window.__GR__.threeD");
log.threeD = threeD;
if (threeD !== "on") {
  // A machine without WebGPU keeps the plan; say so with ALLOW_NO_3D=1 to pass this part there.
  if (!process.env.ALLOW_NO_3D) await fail(`the 3D valley did not start: ${threeD}`);
} else {
  if ((await game<string>("window.__GR__.view()")) !== "3d") await fail("the 3D valley started but is not the view");
  if (!(await page.locator("canvas.scene").isVisible()) || (await page.locator("svg.map").isVisible())) await fail("the 3D valley and the plan are not shown one at a time");
  await page.waitForTimeout(9500);
  const info = await game<{ triangles: number; drawCalls: number; engine: string; pixels: [number, number] }>("window.__GR__.stage().info()");
  if (!(info.triangles > 100_000)) await fail(`the 3D valley drew ${info.triangles} triangles`);
  const models = await game<{ models: string[]; modelFailures: string[] }>("(() => { const i = window.__GR__.stage().info(); return { models: i.models, modelFailures: i.modelFailures }; })()");
  log.models = haveModels ? models : "none on this machine: the valley drew its own shapes";
  for (const wanted of ["granada/town", "granada/landmarks", "granada/mill"]) if (haveModels && !models.models.includes(wanted)) await fail(`the authored model ${wanted} did not load: ${models.modelFailures.join("; ") || "no reason given"}`);
  if (!haveModels && models.models.length) await fail("told not to fetch models, the valley fetched one");
  await shot("7-valley-3d");
  // A click on the mill field in the valley opens it, as a click on the plan does.
  const at = await game<[number, number] | null>("window.__GR__.stage().screenOf(-204, 3, 125)");
  if (!at) await fail("the mill field is not in the first view");
  await page.mouse.click(at![0], at![1]);
  if ((await game<string>("window.__GR__.tab()")) !== "fields") await fail("clicking the mill field in the valley did not open the fields");
  // The keyboard steers it: sideways, the whole valley, and home again.
  type P = { tx: number; tz: number; pitch: number; distance: number };
  const pose = () => game<P>("(() => { const p = window.__GR__.stage().getPose(); return { tx: p.tx, tz: p.tz, pitch: p.pitch, distance: p.distance }; })()");
  const home = await pose();
  await page.locator("canvas.scene").focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(900);
  const moved = await pose();
  if (!(Math.hypot(moved.tx - home.tx, moved.tz - home.tz) > 20)) await fail("the arrow key did not move the view");
  await page.keyboard.press("o");
  await page.waitForTimeout(1600);
  const whole = await pose();
  if (!(whole.pitch > home.pitch + 0.4 && whole.distance > home.distance)) await fail("the key o did not show the whole valley");
  await shot("8-whole-valley-3d");
  await page.keyboard.press("Home");
  await page.waitForTimeout(1600);
  const back = await pose();
  if (Math.abs(back.distance - home.distance) > 5 || Math.hypot(back.tx - home.tx, back.tz - home.tz) > 5) await fail("the Home key did not return to the first view");
  // The game goes on under it: orders and days change what the valley is asked to show, without an error.
  await game("(() => { const g = window.__GR__; g.order({ kind: 'harvest', plot: 'mill-field', rest: 'sell' }); g.order({ kind: 'build', what: 'house' }); g.order({ kind: 'repair' }); g.days(14); })()");
  await page.waitForTimeout(700);
  await shot("9-two-weeks-on-3d");
  // Frame times while the valley stands still: measured for the record on this machine, not a pass mark.
  await game("window.__GR__.stage().takeFrameStats()");
  await page.waitForTimeout(3000);
  log.valley3d = { ...info, frames: await game("window.__GR__.stage().takeFrameStats()") };
  // The plan and the valley change places from the bar above them.
  await page.locator("#view-plan").click();
  if (!(await page.locator("svg.map").isVisible()) || (await page.locator("canvas.scene").isVisible())) await fail("the plan did not take the valley's place");
  await page.locator("#view-3d").click();
  if (!(await page.locator("canvas.scene").isVisible())) await fail("the valley did not come back");
}

// ---- People at the harvest: they come when it is ordered, and are gone when it is done ----
if (threeD === "on") {
  const context2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p2 = await context2.newPage();
  await p2.goto(`${served.base}/games/granada/index.html?lang=${lang}&fresh=1&seed=7&music=off`);
  await p2.waitForFunction("Boolean(window.__GR__ && window.__GR__.ready)");
  await p2.locator("#brief-start").click();
  await p2.waitForFunction("window.__GR__.threeD === 'on'", undefined, { timeout: 120_000 });
  const atWork = () => p2.evaluate("window.__GR__.stage().info().atWork") as Promise<number>;
  const before = await atWork();
  await p2.evaluate("window.__GR__.order({ kind: 'harvest', plot: 'mill-field', rest: 'sell' })");
  await p2.waitForTimeout(400);
  const during = await atWork();
  await p2.evaluate("window.__GR__.days(3)");
  await p2.waitForTimeout(400);
  const after = await atWork();
  if (before !== 0 || during < 16 || after !== 0) await fail(`people at the harvest: ${before} before it was ordered, ${during} while it went on, ${after} three days after`);
  log.harvestPeople = { before, during, after };
  await context2.close();
}

// ---- Building on the land, in the 3D valley: the ring at the middle of the view, moved by the keys, built with Enter ----
if ((await game<string>("window.__GR__.threeD")) === "on") {
  await page.goto(url("&fresh=1", ""));
  await ready();
  await page.locator("#brief-start").click();
  await page.waitForFunction("window.__GR__.threeD !== 'pending'", undefined, { timeout: 60_000 });
  await page.waitForTimeout(1500);
  // Open ground east of the village, seen from close by.
  await game("window.__GR__.stage().setPose({ tx: 600, ty: 8, tz: 250, yaw: 1.2, pitch: 0.5, distance: 120 }, true)");
  await page.keyboard.press("3");
  await page.locator("[data-act='place-granary']").click();
  await page.locator("canvas.scene").focus();
  if ((await page.locator("#site-status").getAttribute("class")) !== "site-ok") await fail(`open ground in the 3D valley refused the granary: ${await page.locator("#site-status").textContent()}`);
  await shot("9a-ring-3d");
  await page.keyboard.press("Enter");
  const placed3d = await game<Array<{ what: string; x: number; z: number; done: boolean }>>("window.__GR__.state().placed");
  if (placed3d.length !== 1 || placed3d[0]!.what !== "granary" || Math.hypot(placed3d[0]!.x - 600, placed3d[0]!.z - 250) > 2) await fail(`Enter did not build at the middle of the view: ${JSON.stringify(placed3d)}`);
  // The pointer names the ground too: over what was just placed, the ground refuses.
  const cv = (await page.locator("canvas.scene").boundingBox())!;
  await page.locator("[data-act='place-house']").click();
  await page.mouse.move(cv.x + cv.width / 2, cv.y + cv.height / 2);
  await page.waitForTimeout(200);
  if ((await page.locator("#site-status").getAttribute("class")) === "site-ok") await fail("a house can be put on the granary being built");
  await page.keyboard.press("Escape");
  await game("window.__GR__.days(6)");
  await page.waitForTimeout(600);
  if (!(await game<boolean>("window.__GR__.state().placed[0].done"))) await fail("the granary placed in 3D was not finished in six days");
  await shot("9a-built-3d");
  log.building3d = placed3d;
}

// ---- Photo mode: the page put away, the picture's own controls, a picture saved, nothing in the game changed, memory level ----
if ((await game<string>("window.__GR__.threeD")) === "on") {
  await page.goto(url("&fresh=1", ""));
  await ready();
  await page.locator("#brief-start").click();
  await page.waitForFunction("window.__GR__.threeD !== 'pending'", undefined, { timeout: 60_000 });
  await page.waitForTimeout(1500);
  await game(`(() => { const g = window.__GR__; g.order({ kind: "repair" }); g.days(3); })()`);
  await page.locator("#speed-1").click();
  const saved = () => game<string>("JSON.stringify(window.__GR__.state())");
  const beforePhoto = await saved();
  // In by the keyboard alone.
  await page.locator("#view-photo").focus();
  await page.keyboard.press("Enter");
  const photo = () => game<{ on: boolean; bare: boolean; shots: number }>("window.__GR__.photo()");
  if (!(await photo()).on) await fail("Enter on the photo button did not open photo mode");
  for (const sel of [".bar", ".rail", "#objectives", "#side", "#seasonbox", ".viewbar"]) if (await page.locator(sel).first().isVisible()) await fail(`photo mode leaves ${sel} on the page`);
  if (!(await page.locator("#photo-exit").isVisible())) await fail("photo mode shows no way out");
  if ((await game<string>("document.activeElement.id")) !== "photo-capture") await fail("the keyboard is not on the picture's controls");
  if ((await game<number>("window.__GR__.speed()")) !== 0) await fail("the game is not paused in photo mode");
  // Nothing in the game moves, by the clock or by an order.
  await page.waitForTimeout(2500);
  if (await game<boolean>(`window.__GR__.order({ kind: "expand" })`)) await fail("an order was taken in photo mode");
  await game("window.__GR__.days(3)");
  if ((await saved()) !== beforePhoto) await fail("the game changed in photo mode");
  await shot("9h-photo");
  // The picture's own season, weather, light and lens.
  await page.locator("#photo-season").selectOption("3");
  await page.locator("#photo-rain").selectOption("on");
  await page.locator("#photo-light").selectOption("evening");
  await page.locator("#photo-lens").focus();
  for (let i = 0; i < 14; i++) await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(700);
  await shot("9i-photo-winter-evening");
  // Camera by the keyboard.
  const poseBefore = await game<string>("JSON.stringify(window.__GR__.stage().getPose())");
  await page.locator("canvas.scene").focus();
  for (const key of ["ArrowRight", "q", "+", "r"]) await page.keyboard.press(key);
  await page.waitForTimeout(600);
  if ((await game<string>("JSON.stringify(window.__GR__.stage().getPose())")) === poseBefore) await fail("the camera did not move by keyboard in photo mode");
  // A click on the land while framing opens nothing behind the picture.
  const tabBefore = await game<string>("window.__GR__.tab()");
  const pv = (await page.locator("canvas.scene").boundingBox())!;
  for (const [fx, fy] of [[0.5, 0.5], [0.3, 0.7], [0.7, 0.6]] as const) await page.mouse.click(pv.x + pv.width * fx, pv.y + pv.height * fy);
  if ((await game<string>("window.__GR__.tab()")) !== tabBefore) await fail("a click on the land in photo mode changed the part in hand");
  // A picture saved: a real PNG of the view.
  const [download] = await Promise.all([page.waitForEvent("download"), page.locator("#photo-capture").click()]);
  const picture = resolve(out, `granada-${lang}-photo.png`);
  await download.saveAs(picture);
  const { statSync, readFileSync } = await import("node:fs");
  const head = readFileSync(picture).subarray(0, 8).toString("hex");
  if (head !== "89504e470d0a1a0a" || statSync(picture).size < 200_000) await fail(`the saved picture is not a full PNG: ${head}, ${statSync(picture).size} bytes`);
  // The controls put away and brought back.
  await page.keyboard.press("h");
  if (await page.locator("#photobar").isVisible()) await fail("H did not hide the picture's controls");
  await page.keyboard.press("Escape");
  if (!(await page.locator("#photo-exit").isVisible()) || !(await photo()).on) await fail("Escape did not bring the controls back");
  await page.keyboard.press("Escape");
  if ((await photo()).on || !(await page.locator(".bar").isVisible())) await fail("Escape did not leave photo mode");
  if ((await saved()) !== beforePhoto) await fail("the game was changed by photo mode");
  if ((await game<number>("window.__GR__.speed()")) !== 1) await fail("the game's speed did not come back");
  if ((await game<string>("document.activeElement.id")) !== "view-photo") await fail("the keyboard did not come back to where it was");
  await page.locator("#speed-0").click();
  // In and out fifty times: what the renderer holds, and the heap, before and after.
  const held = () => game<{ geometries: number; textures: number; heap: number }>("(() => { const i = window.__GR__.stage().info(); return { geometries: i.geometries, textures: i.textures, heap: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : -1 }; })()");
  const heldBefore = await held();
  for (let i = 0; i < 50; i++) {
    await page.locator("#view-photo").click();
    await page.locator("#photo-light").selectOption(["morning", "midday", "evening"][i % 3]!);
    await page.locator("#photo-exit").click();
  }
  await page.waitForTimeout(1500);
  const heldAfter = await held();
  if (heldAfter.geometries !== heldBefore.geometries || heldAfter.textures !== heldBefore.textures) await fail(`fifty visits to photo mode left ${JSON.stringify(heldAfter)} where there was ${JSON.stringify(heldBefore)}`);
  log.photo = { bytes: statSync(picture).size, before: heldBefore, after: heldAfter };
}

// ---- Trade through the page: the contract taken, the olives pressed, the oil delivered, the rest sent ----
await page.goto(url("&fresh=1"));
await ready();
await page.locator("#brief-start").click();
await page.keyboard.press("4");
for (const part of ["press", "port", "contract"]) if ((await page.locator(`[data-part='${part}']`).count()) !== 1) await fail(`the economy panel has no ${part}`);
if (await page.locator("[data-act^='press-']").count()) await fail("the press can be ordered with no olives in the store");
await page.locator("[data-act='accept-oil-for-the-port']").click();
const held = await game<number>("window.__GR__.state().economy.treasury.reserved");
if (held !== 5200) await fail(`taking the contract set aside ${held}, not the 52 dinars of carriage and fees`);
// The olives are grown by the game's own orders: the branch mended, the terrace brought in when it is ripe.
await game(`(() => { const g = window.__GR__; g.order({ kind: "harvest", plot: "mill-field", rest: "wait" }); g.order({ kind: "repair" }); for (let i = 0; i < 90 && g.state().plots["olive-terrace"].ripeSince === null; i++) g.days(1); g.order({ kind: "harvest", plot: "olive-terrace", rest: "wait" }); g.days(4); })()`);
const olives = await game<number>("window.__GR__.state().economy.stock.olives?.quantity ?? 0");
if (olives < 40) await fail(`only ${olives} olives were brought in, too few for the contract`);
const runs = Math.floor(olives / 5);
await page.keyboard.press("4");
await page.locator(`[data-act='press-${runs}']`).click();
const oil = await game<number>("window.__GR__.state().economy.stock.oil.quantity");
if (oil !== runs) await fail(`pressing ${runs} times left ${oil} of oil`);
await shot("9b-trade");
// Eight are sent on the contract, and what is over to the port's open market. Nothing is paid while they travel.
await page.locator("[data-act='deliver-oil-for-the-port-8']").click();
if (runs > 8) await page.locator(`[data-act='send-oil-${runs - 8}']`).click();
const onRoad = await game<{ contract: string; loads: number; oil: number }>("(() => { const s = window.__GR__.state(); return { contract: s.economy.contracts['oil-for-the-port'].state, loads: s.shipments.length, oil: s.economy.stock.oil?.quantity ?? 0 }; })()");
if (onRoad.contract !== "accepted" || onRoad.loads !== (runs > 8 ? 2 : 1) || onRoad.oil !== 0) await fail(`the oil did not go on the road: ${JSON.stringify(onRoad)}`);
if ((await page.locator("[data-part='road'] li").count()) !== onRoad.loads) await fail("the loads on the road are not listed");
await shot("9b-on-the-road");
// The road is three days: on the fourth morning both loads are at the port.
await game("window.__GR__.days(3)");
if ((await game<number>("window.__GR__.state().shipments.length")) !== onRoad.loads) await fail("a load arrived before its day");
await game("window.__GR__.days(1)");
const arrived = await game<string[]>("window.__GR__.state().last.events");
const contract = await game<string>("window.__GR__.state().economy.contracts['oil-for-the-port'].state");
if (contract !== "settled" || !arrived.includes("delivered:oil-for-the-port:8") || (runs > 8 && !arrived.includes(`sold-at-port:oil:${runs - 8}:${(runs - 8) * 19000}`))) await fail(`the loads did not arrive as they should: ${contract}, ${JSON.stringify(arrived)}`);
if ((await page.locator("[data-part='contract'][data-state='settled']").count()) !== 1) await fail("the panel does not show the contract as kept");
if (await page.locator("[data-part='road']").count()) await fail("the road still lists loads that have arrived");
log.trade = { olives, runs, contract, arrived };

// ---- Buildings that can be chosen, and the oil's road worked step by step from one card ----
await page.goto(url("&fresh=1"));
await ready();
await page.locator("#brief-start").click();
// On the plan, by keyboard: the store opens its card, and the card leads into the Economy.
await page.locator("svg.map .store.opens").first().focus();
await page.keyboard.press("Enter");
if ((await page.locator("#place-card").count()) !== 1 || (await game<string>("document.activeElement.id")) !== "place-card") await fail("choosing the store on the plan did not open its card");
await shot("9l-store-card");
await page.locator("#place-card [data-pop='open-market']").click();
if ((await game<string>("window.__GR__.tab()")) !== "market" || (await page.locator("#place-card").count())) await fail("the store's card did not lead into the Economy");
const road = page.locator("[data-part='chain']");
if ((await road.locator("[data-step]").count()) !== 5) await fail("the oil's road does not have its five steps");
// The whole road from one card: the terrace brought in, pressed, delivered on the contract, the rest sent.
await game(`(() => { const g = window.__GR__; g.order({ kind: "harvest", plot: "mill-field", rest: "wait" }); g.order({ kind: "repair" }); g.order({ kind: "accept", contract: "oil-for-the-port" }); while (g.state().plots["olive-terrace"].ripeSince === null) g.days(1); })()`);
await road.locator("[data-act='chain-harvest']").click();
await game("window.__GR__.days(4)");
await road.locator("[data-act='chain-press']").click();
await road.locator("[data-act='chain-deliver']").click();
if (await road.locator("[data-act='chain-send']").count()) await road.locator("[data-act='chain-send']").click();
if ((await game<number>("window.__GR__.state().economy.stock.oil?.quantity ?? 0")) !== 0) await fail("oil is left in the store after the road was worked to its end");
if (!(await road.locator("[data-step='port']").textContent())?.match(/\d/)) await fail("the port's step says nothing");
await game("window.__GR__.days(4)");
if ((await game<string>("window.__GR__.state().economy.contracts['oil-for-the-port'].state")) !== "settled") await fail("the contract was not kept from the oil's road");
await shot("9m-chain");
// A placed building on the plan is a button too.
await game(`window.__GR__.order({ kind: "place", what: "garden", x: 300, z: 262 })`);
if (await game<number>("window.__GR__.state().placed.length")) {
  await page.locator("svg.map .placed.opens").first().focus();
  await page.keyboard.press("Enter");
  if ((await page.locator("#place-card progress").count()) !== 1) await fail("a building being built does not say how far it has got");
}
// In the 3D valley: a click on the store opens its card beside it.
await page.waitForFunction("window.__GR__.threeD !== 'pending'", undefined, { timeout: 120_000 });
if ((await game<string>("window.__GR__.threeD")) === "on") {
  await page.locator("#view-3d").click();
  await game("window.__GR__.stage().setPose({ tx: 30, ty: 8, tz: 104, yaw: 1.2, pitch: 0.7, distance: 150 }, true)");
  await page.waitForTimeout(500);
  const cv = (await page.locator("canvas.scene").boundingBox())!;
  await page.mouse.click(cv.x + cv.width / 2, cv.y + cv.height / 2);
  await page.waitForTimeout(300);
  if (!(await page.locator("#field-pop [data-pop='open-market']").isVisible())) await fail("a click on the store in the 3D valley did not open its card");
  // The card stands inside the valley's own frame in every language, a right-to-left one included.
  const pop = (await page.locator("#field-pop").boundingBox())!;
  if (pop.x < cv.x - 1 || pop.x + pop.width > cv.x + cv.width + 1 || pop.y < cv.y - 1 || pop.y + pop.height > cv.y + cv.height + 1) await fail(`the store's card is off the valley: ${JSON.stringify(pop)}`);
  await shot("9n-store-3d");
  await page.locator("#field-pop [data-pop='close']").click();
  await page.locator("#view-plan").click();
}
log.chosen = true;

// ---- What lies ahead: warnings read from the forecast, gone when the steward acts; the season in figures; food to spare ----
await page.goto(url("&fresh=1"));
await ready();
await page.locator("#brief-start").click();
const ahead = page.locator("[data-part='warnings']");
if ((await ahead.locator("[data-warn='warn_spoil']").count()) < 1) await fail("no warning that the ripe wheat will spoil");
const warnedBefore = await ahead.locator("li").allTextContents();
await game(`window.__GR__.order({ kind: "harvest", plot: "mill-field", rest: "sell" })`);
const warnedAfter = await ahead.locator("li").allTextContents();
if (warnedAfter.length >= warnedBefore.length) await fail(`ordering the harvest did not take a warning away: ${JSON.stringify([warnedBefore, warnedAfter])}`);
if ((await page.locator("[data-part='season-figures'] li").count()) < 3) await fail("the season is not given in figures");
await page.keyboard.press("4");
if ((await page.locator("[data-part='food-to-spare']").count()) !== 1) await fail("the market does not say what food can be spared");
await page.keyboard.press("1");
await shot("9k-ahead");
log.ahead = { before: warnedBefore, after: warnedAfter };

// ---- The region: the museum's places and distances, and three layers of the game's own state ----
await page.goto(url("&fresh=1"));
await ready();
await page.locator("#brief-start").click();
const region = page.locator("[data-part='region']");
if ((await region.locator("svg.region [data-place]").count()) !== 5) await fail("the region does not show the city, the two ports, the mountain and the valley");
if (!(await region.locator("svg.region").getAttribute("aria-label"))?.includes("89")) await fail("the region does not say how far Málaga is");
if ((await region.locator("svg.region .region-route").count()) !== 1) await fail("the trade layer draws no route to the port");
const factsOf = async (layer: string) => {
  await region.locator(`#layer-${layer}`).focus();
  await page.keyboard.press("Enter");
  if ((await region.locator("ul").getAttribute("data-layer")) !== layer) await fail(`the ${layer} layer did not open by keyboard`);
  return region.locator("ul li").allTextContents();
};
const layers = { agriculture: await factsOf("agriculture"), infrastructure: await factsOf("infrastructure"), economy: await factsOf("economy") };
if (layers.agriculture.length !== 3 || layers.infrastructure.length !== 4 || layers.economy.length !== 3) await fail(`the layers do not hold what they should: ${JSON.stringify(layers)}`);
await game(`window.__GR__.order({ kind: "send", good: "wheat", quantity: 20 })`);
if (lang === "en" && !(await region.locator("ul li").first().textContent())?.includes("20 of 60")) await fail("the trade layer does not show the carts sent today");
await shot("9j-region");
log.region = layers;

// ---- A decision: put on its day, each answer's price shown, answered by a click, in force and in the journal ----
await page.goto(url("&fresh=1"));
await ready();
await page.locator("#brief-start").click();
if (await page.locator("[data-decision]").count()) await fail("a decision is shown before its day");
await game(`(() => { const g = window.__GR__; g.order({ kind: "harvest", plot: "mill-field", rest: "wait" }); g.order({ kind: "repair" }); while (Object.values(g.state().decisions)[0].state === "ahead") g.days(1); })()`);
const question = page.locator("[data-decision='water-for-the-neighbours']");
if ((await question.count()) !== 1 || (await question.locator("button").count()) !== 2) await fail("the decision is not shown with its two answers");
await shot("9f-decision");
const purse = await game<number>("window.__GR__.state().economy.treasury.available");
await question.locator("[data-act='decide-water-for-the-neighbours-share']").click();
if ((await game<number>("window.__GR__.state().economy.treasury.available")) - purse !== 22000) await fail("sharing the water did not bring its 220 dinars");
if (await page.locator("[data-decision]").count()) await fail("the decision is still shown after it was answered");
if ((await page.locator("[data-part='effects'] li").count()) !== 1) await fail("what is in force is not shown");
await page.keyboard.press("5");
const journal = await page.locator("[data-part='journal'] li").count();
if (journal < 2) await fail(`the journal has ${journal} lines after a question and its answer`);
await shot("9g-journal");
await game("window.__GR__.days(20)");
if (await page.locator("[data-part='effects']").count()) await fail("the effect is still shown after its days");
log.decision = { journal };

// ---- An estate's card: its figures are the rules' forecast, and putting it first is an order that holds ----
await page.goto(url("&fresh=1"));
await ready();
await page.locator("#brief-start").click();
await game(`(() => { const g = window.__GR__; g.order({ kind: "harvest", plot: "mill-field", rest: "wait" }); g.order({ kind: "repair" }); g.days(6); })()`);
await page.keyboard.press("2");
const card = page.locator("#card-olive-terrace");
for (const part of ["hands", "expected", "store", "value"]) if ((await card.locator(`[data-estate='${part}']`).count()) !== 1) await fail(`the olive terrace's card has no ${part}`);
const saidLine = (await card.locator("[data-estate='expected']").textContent()) ?? "";
const said = (saidLine.match(/\d+/g) ?? []).map(Number);
await card.locator("[data-act='first-olive-terrace']").click();
if ((await game<string | null>("window.__GR__.state().fieldFirst")) !== "olive-terrace" || (await card.locator("[data-act='first-olive-terrace']").getAttribute("aria-pressed")) !== "true") await fail("putting the terrace first did not hold");
await shot("9e-estate");
await card.locator("[data-act='first-olive-terrace']").click();
if ((await game<string | null>("window.__GR__.state().fieldFirst")) !== null) await fail("the terrace could not be put back in its usual place");
const came = await game<{ units: number; days: number }>(`(() => { const g = window.__GR__; const from = g.state().day; while (g.state().plots["olive-terrace"].ripeSince === null && !g.state().outcome) g.days(1); return { units: g.state().plots["olive-terrace"].yielded, days: g.state().day - from }; })()`);
if (lang === "en" && (said[0] !== came.units || said[1] !== came.days)) await fail(`the card said ${saidLine} and ${JSON.stringify(came)} came`);
log.estate = { said: saidLine, came };

// ---- Building on the land, on the plan: a thing chosen, bad ground refused, good ground built on, by keyboard and by mouse ----
await page.goto(url("&fresh=1"));
await ready();
await page.locator("#brief-start").click();
await page.keyboard.press("3");
if (await page.locator("[data-act='work-house'], [data-act='work-granary']").count()) await fail("houses and granaries are still ordered from the list as well as placed");
for (const what of ["house", "granary", "cistern", "garden"]) if ((await page.locator(`[data-act='place-${what}']`).count()) !== 1) await fail(`the catalogue has no ${what}`);
await page.locator("[data-act='place-house']").focus();
await page.keyboard.press("Enter");
if ((await page.locator("#site-status").getAttribute("class")) !== "site-ok" || (await page.locator("svg.map .ghost.ok").count()) !== 1) await fail("choosing a house did not offer ground that takes it");
// By keyboard: on to a field, where the ground refuses and says why; then back, and built.
const offered = await game<string>("document.getElementById('site-status').textContent");
let onField = false;
for (let i = 0; i < 40 && !onField; i++) {
  await page.keyboard.press("Shift+ArrowUp");
  onField = (await page.locator("svg.map .ghost.bad").count()) === 1;
}
if (!onField || (await page.locator("#site-build").isEnabled())) await fail("no ground refused the house, or bad ground can be built on");
const refusedWords = await game<string>("document.getElementById('site-status').textContent");
if (refusedWords === offered) await fail("the refusal is not said in words");
await shot("9c-site-refused");
const moneyBefore = await game<number>("window.__GR__.state().economy.treasury.available");
await page.locator("svg.map").focus().catch(() => {});
await page.keyboard.press("Enter");
if ((await game<number>("window.__GR__.state().placed.length")) !== 0 || (await game<number>("window.__GR__.state().economy.treasury.available")) !== moneyBefore) await fail("building on refused ground changed the game");
await page.keyboard.press("Escape");
if (await page.locator("[data-part='siting']").count()) await fail("Escape did not stop the choosing");
await page.locator("[data-act='place-house']").click();
await page.locator("#site-build").click();
const first = await game<{ what: string; done: boolean }[]>("window.__GR__.state().placed");
if (first.length !== 1 || first[0]!.what !== "house" || first[0]!.done) await fail(`the house was not started: ${JSON.stringify(first)}`);
if ((await game<number>("window.__GR__.state().economy.treasury.available")) !== moneyBefore - 16000) await fail("the house did not cost its 160 dinars");
if ((await page.locator("svg.map .placed.house.building").count()) !== 1) await fail("the plan does not show the house being built");
// By mouse: a garden, on the ground the plan offers, by a click on the plan itself.
await page.locator("[data-act='place-garden']").click();
const ring = (await page.locator("svg.map .ghost circle").boundingBox())!;
await page.mouse.click(ring.x + ring.width / 2, ring.y + ring.height / 2);
if ((await game<number>("window.__GR__.state().placed.length")) !== 2) await fail("a click on the plan did not place the garden");
await game("window.__GR__.days(5)");
const built = await game<{ what: string; done: boolean }[]>("window.__GR__.state().placed");
if (!built.every((p) => p.done) || (await game<number>("window.__GR__.state().housing")) !== 70) await fail(`the buildings were not finished, or the house houses nobody: ${JSON.stringify(built)}`);
if ((await page.locator("svg.map .placed:not(.building)").count()) !== 2) await fail("the plan does not show the finished buildings");
await shot("9d-built");
log.building = { refused: refusedWords, built };

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
await shot("10-outcome");
// ---- On to the second year: the valley as it stands, a new year's title, brief, tasks and offers ----
if ((await page.locator("#go-on").count()) !== 1) await fail("a won first year does not offer the second");
if ((await page.locator("#carry").count()) !== 1) await fail("a won first year does not say what goes on into the second");
const carried = await game<{ households: number; treasury: number; placed: number; capacity: number }>("(() => { const s = window.__GR__.state(); return { households: s.households, treasury: s.economy.treasury.available, placed: s.placed.length, capacity: s.economy.capacity }; })()");
await page.locator("#go-on").click();
const two = await game<{ year: number; day: number; scenario: string; households: number; treasury: number; placed: number; capacity: number; outcome: unknown; quests: string[] }>("(() => { const s = window.__GR__.state(); return { year: s.year, day: s.day, scenario: s.scenario, households: s.households, treasury: s.economy.treasury.available, placed: s.placed.length, capacity: s.economy.capacity, outcome: s.outcome, quests: Object.keys(s.quests) }; })()");
if (two.year !== 2 || two.day !== 1 || two.scenario !== "merchants-of-malaga" || two.outcome !== null) await fail(`going on did not begin the second year: ${JSON.stringify(two)}`);
if (two.households !== carried.households || two.treasury !== carried.treasury || two.placed !== carried.placed || two.capacity !== carried.capacity) await fail(`the valley was not carried as it stood: ${JSON.stringify([carried, two])}`);
if (!(await page.locator("dialog.brief[open]").count())) await fail("the second year has no brief");
await shot("12-year-two-brief");
await page.locator("#brief-start").click();
if ((await page.locator("[data-quest]").count()) !== 5 || (await page.locator("[data-quest='m1-trade']").count()) !== 1) await fail("the second year's tasks are not shown");
await page.keyboard.press("4");
if ((await page.locator("[data-part='contract']").count()) < 2) await fail("the second year's two contracts are not offered");
await page.keyboard.press("1");
await shot("13-year-two");
// A reload resumes the second year; played to its end by the trading steward's way, it is judged; a lost year can be played again from its start.
// (The page is opened again without "fresh", which is this script's way of asking for a new game.)
await page.goto(url());
await ready();
if ((await game<number>("window.__GR__.state().year")) !== 2 || (await game<string>("window.__GR__.scenario")) !== "merchants-of-malaga") await fail("a reload did not resume the second year");
await page.locator("#brief-start").click();
const yearTwo = await game<{ day: number; won: boolean; reasons: string[] }>(`(() => { const g = window.__GR__; g.order({ kind: "decide", decision: "x", option: "y" }); while (!g.state().outcome) g.days(1); const o = g.state().outcome; return { day: g.state().day, won: o.won, reasons: o.reasons }; })()`);
if (yearTwo.day !== 121) await fail(`the second year did not run its 120 days: ${JSON.stringify(yearTwo)}`);
if (!(await page.locator("dialog.outcome[open]").count())) await fail("the second year's end is not shown");
if (await page.locator("#go-on").count()) await fail("a lost year offers the year after it");
await shot("14-year-two-end");
await page.locator("#again").click();
const againState = await game<{ year: number; day: number; treasury: number }>("(() => { const s = window.__GR__.state(); return { year: s.year, day: s.day, treasury: s.economy.treasury.available }; })()");
if (againState.year !== 2 || againState.day !== 1 || againState.treasury !== carried.treasury) await fail(`playing the year again did not go back to its first morning: ${JSON.stringify(againState)}`);
await game("(() => { const g = window.__GR__; while (!g.state().outcome) g.days(1); })()");
log.yearTwo = { carried, two, end: yearTwo };
await page.locator("#new-year").click();
const next = await state();
// From the second year, "begin again" is the first year afresh, with weather neither year has had.
if (next.day !== 25 || next.seed === 7 || next.seed === 8 || next.outcome !== null || (await game<number>("window.__GR__.state().year")) !== 1 || (await game<string>("window.__GR__.scenario")) !== "water-for-the-valley") await fail(`beginning again did not start the first year afresh: ${JSON.stringify(next)}`);
await shot("11-another-year");

log.consoleErrors = errors;
log.screenshots = out;
console.log(JSON.stringify(log));
writeFileSync(resolve(out, `granada-${lang}.json`), `${JSON.stringify(log, null, 1)}\n`);
await browser.close();
await served.close();
if (errors.length) throw new Error(`${lang}: ${errors.length} console or network error(s): ${errors.slice(0, 3).join(" | ")}`);
