// Plays Hudhud's golden scene from start to finish in real Chrome and writes down what happened: the route, the
// state after every step, pictures, console errors, frame times, calls to the graphics card, texture memory, the
// saved file, what a second and a tenth run of the scene leave behind, and what a lost graphics context does.
//
// Usage: npx tsx --tsconfig tsconfig.json tools/hudhud-play.ts <out dir> [lang] [quality] [width] [height] [style] [scene]
// The scene is "workshop" (the default: Ibn al-Haytham's workshop), "jazari" (al-Jazari's workshop and the elephant
// clock, the second room on the room engine, 27 November 2026), "tusi" (al-Tusi's observatory and the two circles, the
// third room), "khwarizmi" (al-Khwarizmi's room and the locked box, the fourth room) or "kindi" (al-Kindi's room and the
// secret page, the fifth room).
// It measures the machine it runs on. A pass here is not a pass on the museum's two reference machines.
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type Page } from "playwright-core";
import { solve, type LightPuzzle } from "../games/hudhud/src/sim/light";
import { leaveOpening } from "./hudhud-opening";
import { serveWorkspace } from "./serve";

const [outArg, lang = "en", quality = "medium", w = "1920", h = "1080", style = "explorer", scene = "workshop"] = process.argv.slice(2);
if (!outArg) throw new Error("usage: hudhud-play.ts <out dir> [lang] [quality] [width] [height] [style] [scene]");
if (scene !== "workshop" && scene !== "jazari" && scene !== "tusi" && scene !== "khwarizmi" && scene !== "kindi") throw new Error(`hudhud-play.ts: no scene called ${scene} (workshop, jazari, tusi, khwarizmi or kindi)`);
const out = resolve(outArg);
mkdirSync(out, { recursive: true });
const tag = `${scene === "workshop" ? "" : `${scene}-`}${lang}-${quality}-${w}x${h}`;

interface Hook {
  ready: boolean;
  error: string | null;
  state(): { puzzle: LightPuzzle; turns: number; flags: string[]; talk: unknown; restored: boolean; dark: boolean; done: boolean };
  goals(): Record<string, unknown>;
  where(): { x: number; y: number; grounded: boolean; near: string | null } | null;
  info(): Record<string, unknown>;
  resetFrames(): void;
  goTo(id: string): void;
  restart(rebuild: boolean): void;
}
const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: [`--window-size=${w},${Number(h) + 90}`, "--window-position=0,0", "--force-device-scale-factor=1", "--enable-precise-memory-info"] });
const context = await browser.newContext({ viewport: { width: Number(w), height: Number(h) }, deviceScaleFactor: 1 });
const page: Page = await context.newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
const route: { step: string; at: number; where: unknown; turns: number; flags: string[]; restored: boolean; dark: boolean; done: boolean }[] = [];
const shots: string[] = [];
const t0 = Date.now();
const hk = <T>(body: string): Promise<T> => page.evaluate(`(() => { const h = window.__HH__; ${body} })()`) as Promise<T>;
const note = async (step: string) => {
  const s = await hk<{ where: unknown; turns: number; flags: string[]; restored: boolean; dark: boolean; done: boolean }>("const s = h.state(); return { where: h.where(), turns: s.turns, flags: s.flags, restored: s.restored, dark: s.dark, done: s.done };");
  route.push({ step, at: Date.now() - t0, ...s });
};
const shot = async (name: string) => {
  const file = `${tag}-${String(shots.length + 1).padStart(2, "0")}-${name}.png`;
  await page.screenshot({ path: resolve(out, file) });
  shots.push(file);
};
const talking = () => hk<boolean>("return h.state().talk !== null;");
/** Goes on through a conversation with the keyboard, as a player would, until control comes back. */
const talkThrough = async (pick?: number[]) => {
  const picks = [...(pick ?? [])];
  for (let i = 0; i < 20 && (await talking()); i++) {
    await page.waitForTimeout(350);
    const choices = page.locator(".talk .choices button");
    if ((await choices.count()) > 0) await choices.nth(picks.shift() ?? (await choices.count()) - 1).click();
    else await page.keyboard.press("Enter");
  }
  await page.waitForTimeout(250);
};
const arrive = async (id: string) => {
  await hk(`h.goTo(${JSON.stringify(id)});`);
  await page.waitForTimeout(1100);
};

const report: Record<string, unknown> = { tag, scene, lang, quality, style, viewport: [Number(w), Number(h)], ran: new Date().toISOString(), browser: `chrome ${browser.version()}`, machine: `${process.platform} ${process.arch}` };
try {
  await page.goto(`${served.base}/games/hudhud/index.html?lang=${lang}&q=${quality}&style=${style}&music=off&perf=1`);
  await page.waitForFunction("window.__HH__ && (window.__HH__.ready || window.__HH__.error)", undefined, { timeout: 60000 });
  // The opening story comes first; a visitor reads or skips it. It is captured, then skipped by its button.
  if (await page.locator(".prologue").isVisible()) {
    await shot("opening");
    await leaveOpening(page);
  }
  await shot("cover");
  if (scene === "jazari") await playJazari();
  else if (scene === "tusi") await playTusi();
  else if (scene === "khwarizmi") await playKhwarizmi();
  else if (scene === "kindi") await playKindi();
  else await playWorkshop();
} catch (e) {
  report.failed = String(e);
  await page.screenshot({ path: resolve(out, `${tag}-failure.png`) }).catch(() => undefined);
}

async function playWorkshop(): Promise<void> {
  const tStart = Date.now();
  await page.locator(".hub button.primary").click();
  await page.waitForFunction("window.__HH__.where() !== null", undefined, { timeout: 30000 });
  report.msFromPlayToScene = Date.now() - tStart;
  await page.waitForTimeout(900);
  await shot("intro-talk");
  await note("scene open");
  await talkThrough();

  // The first minute: fly, with the keyboard, and see that the bird left the ground and moved.
  const before = await hk<{ x: number; y: number }>("return h.where();");
  await page.locator("#stage").focus();
  await page.keyboard.down("ArrowRight");
  let highest = before.y;
  let airborne = false;
  for (let i = 0; i < 5; i++) {
    await page.keyboard.down("Space");
    await page.waitForTimeout(90);
    await page.keyboard.up("Space");
    await page.waitForTimeout(210);
    const at = await hk<{ y: number; grounded: boolean }>("return h.where();");
    highest = Math.min(highest, at.y);
    airborne ||= !at.grounded;
    if (i === 2) await shot("flying");
  }
  await page.keyboard.down("Space");
  await page.waitForTimeout(700);
  await shot("gliding");
  await page.keyboard.up("Space");
  await page.keyboard.up("ArrowRight");
  await page.waitForTimeout(1200);
  const after = await hk<{ x: number; y: number }>("return h.where();");
  report.firstFlight = { from: before, to: after, climbed: Math.round(before.y - highest), airborne, secondsAfterPlay: (Date.now() - tStart) / 1000 };
  await note("first flight");

  await arrive("scholar");
  await shot("scholar-talk");
  await talkThrough([0, 0, 1]);
  await note("asked the scholar for more");
  await arrive("cat");
  await shot("cat");
  await talkThrough();
  await note("greeted the cat");

  // The mirrors: the fewest turns, found by the same solver the tests use.
  const puzzle = await hk<LightPuzzle>("return h.state().puzzle;");
  const plan = solve(puzzle);
  report.puzzle = { mirrors: puzzle.mirrors.length, fewestTurns: plan.turns, settingsThatWork: plan.settings };
  for (const [i, id] of plan.ids.entries()) {
    await arrive(`mirror-${id}`);
    await note(`turned mirror ${id}`);
    if (i === 0) await shot("first-mirror");
  }
  await page.waitForTimeout(1300);
  await shot("page-lit");
  await talkThrough();
  await note("page restored");
  await page.waitForTimeout(1200);
  await shot("workshop-solved");

  await arrive("cord");
  await page.waitForTimeout(1200);
  await shot("dark-room-secret");
  await talkThrough();
  await page.waitForTimeout(600);
  await shot("dark-room");
  await note("found the dark room");
  await arrive("cord");
  await arrive("feather");
  await shot("garden-feather");
  await talkThrough();
  await note("found the feather");
  await page.waitForTimeout(600);
  await shot("garden");

  // Frame times while the bird crosses the whole place and back, with every effect running.
  await hk("h.resetFrames();");
  for (const key of ["ArrowLeft", "ArrowRight"]) {
    await page.keyboard.down(key);
    for (let i = 0; i < 14; i++) {
      await page.keyboard.down("Space");
      await page.waitForTimeout(120);
      await page.keyboard.up("Space");
      await page.waitForTimeout(380);
    }
    await page.keyboard.up(key);
  }
  const heap = () => page.evaluate("performance.memory ? performance.memory.usedJSHeapSize : null") as Promise<number | null>;
  report.benchmark = { route: "the whole width and back, hopping and flapping, 14 seconds", info: await hk("return h.info();"), heapBytes: await heap() };

  await arrive("page");
  await page.waitForTimeout(700);
  await shot("results");
  await note("finished at the page");
  report.goals = await hk("return h.goals();");
  report.save = await page.evaluate("JSON.parse(localStorage.getItem('im.hudhud.save.v1') || 'null')");

  // Leaving and coming back: the scene is started again ten times; what it holds must not grow. Since the journey
  // (27 November 2026) the end is a panel beside the stage, not a sheet, so there is nothing to close first.
  const cycle = async () => ({ ...(await hk<Record<string, unknown>>("const i = h.info(); return { textures: i.textures, textureBytes: i.textureBytes, objects: i.objects, tweens: i.tweens };")), heapBytes: await heap() });
  await hk("h.restart(false);");
  await page.waitForTimeout(800);
  const first = await cycle();
  for (let i = 0; i < 9; i++) {
    await hk("h.restart(false);");
    await page.waitForTimeout(500);
  }
  await page.waitForTimeout(800);
  const tenth = await cycle();
  await hk("h.restart(true);");
  await page.waitForTimeout(1200);
  report.lifecycle = { afterOneRestart: first, afterTenRestarts: tenth, afterRebuild: await cycle() };

  // A lost graphics context: what the player sees, and whether the scene comes back.
  const lost = await page.evaluate(`(async () => {
    const canvas = document.querySelector('#stage canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const ext = gl && gl.getExtension('WEBGL_lose_context');
    if (!ext) return { tried: false };
    ext.loseContext();
    await new Promise((r) => setTimeout(r, 600));
    const toast = document.querySelector('.toast') ? document.querySelector('.toast').textContent : null;
    ext.restoreContext();
    await new Promise((r) => setTimeout(r, 2500));
    return { tried: true, toast, sceneBack: window.__HH__.where() !== null };
  })()`);
  await shot("after-context-loss");
  report.contextLoss = lost;
}

/**
 * Al-Jazari's workshop, played to its end by flight as a player would: the talks gone through with the keyboard, both
 * questions, the kind answer and the feather, every part carried to its place by the shortest row, the lever, frame
 * times while the bird crosses the room and back, a lost graphics context, the lit door walked to, and what opening
 * the room ten times leaves behind.
 */
async function playJazari(): Promise<void> {
  type Jr = { puzzle: { places: (string | null)[]; parts: { id: string }[] }; moves: number; par: number; flags: string[]; done: boolean; carrying: string | null; talk: unknown; busy: boolean; doorLit: boolean; last: unknown };
  const jr = () => hk<Jr>("return h.jazari();");
  const noteJr = async (step: string) => {
    const s = await jr();
    route.push({ step, at: Date.now() - t0, where: await hk("return h.where();"), turns: s.moves, flags: s.flags, restored: s.done, dark: false, done: s.doorLit });
  };
  const roomTalking = async () => (await jr()).talk !== null;
  const roomTalk = async (pick: string[] = []) => {
    const picks = [...pick];
    for (let i = 0; i < 20 && (await roomTalking()); i++) {
      await page.waitForTimeout(350);
      const choices = page.locator(".room-box .talk .choices button");
      if ((await choices.count()) > 0) {
        const want = picks.shift();
        await (want ? choices.filter({ hasText: want }).first() : choices.last()).click();
      } else await page.keyboard.press("Enter");
    }
    await page.waitForTimeout(250);
  };
  const fly = async (id: string, until: string) => {
    await hk(`h.goTo(${JSON.stringify(id)});`);
    await page.waitForFunction(`(() => { const h = window.__HH__; return ${until}; })()`, undefined, { timeout: 8000 });
    await page.waitForTimeout(200);
  };
  const tStart = Date.now();
  await page.locator(".hub button[data-quest='w02q1-al-jazari']").click();
  await page.waitForFunction("window.__HH__.jazari() !== null && window.__HH__.where() !== null", undefined, { timeout: 30000 });
  report.msFromPlayToScene = Date.now() - tStart;
  await page.waitForTimeout(900);
  await shot("intro-talk");
  await noteJr("room open");
  await roomTalk();

  await fly("jazari", "h.jazari().talk !== null");
  await shot("jazari-talk");
  await roomTalk(["Ask about the float", "Ask about the balls"]);
  await noteJr("asked al-Jazari both questions");
  await fly("apprentice", "h.jazari().talk !== null");
  await roomTalk(["It is all right"]);
  await noteJr("answered the apprentice kindly");
  await fly("box", "h.jazari().flags.includes('feather')");
  await shot("feather-on-the-high-shelf");
  await roomTalk();
  await noteJr("found the feather");

  // Every part of the road carried to its place, in order: from a place or from the workbench, then to its place.
  const road = ["float", "falcon", "dragon", "vessel", "bowl"];
  const before = await jr();
  report.puzzle = { places: before.puzzle.places, parts: before.puzzle.parts.length, fewestMoves: before.par };
  for (const [place, part] of road.entries()) {
    const s = await jr();
    if (s.puzzle.places[place] === part) continue;
    const at = s.puzzle.places.indexOf(part);
    const spares = s.puzzle.parts.map((x) => x.id).filter((id) => !s.puzzle.places.includes(id));
    const from = at >= 0 ? `place-${at + 1}` : `spare-${spares.indexOf(part) + 1}`;
    await fly(from, `h.jazari().carrying === ${JSON.stringify(part)}`);
    if (place === 1 || (await jr()).moves === 0) await shot("carrying");
    await fly(`place-${place + 1}`, `h.jazari().moves === ${s.moves + 1}`);
    await noteJr(`put the ${part} in place ${place + 1}`);
  }

  // Frame times while the bird crosses the whole room and back, with everything running.
  await hk("h.resetFrames();");
  await page.locator(".room-box .stage").focus();
  for (const key of ["ArrowLeft", "ArrowRight"]) {
    await page.keyboard.down(key);
    for (let i = 0; i < 14; i++) {
      await page.keyboard.down("Space");
      await page.waitForTimeout(120);
      await page.keyboard.up("Space");
      await page.waitForTimeout(380);
    }
    await page.keyboard.up(key);
  }
  const heap = () => page.evaluate("performance.memory ? performance.memory.usedJSHeapSize : null") as Promise<number | null>;
  report.benchmark = { route: "the whole width and back, hopping and flapping, 14 seconds", info: await hk("return h.info();"), heapBytes: await heap() };

  // A lost graphics context, before the clock is set going: what the player sees, and whether the room comes back.
  report.contextLoss = await page.evaluate(`(async () => {
    const canvas = document.querySelector('.room-box .stage canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const ext = gl && gl.getExtension('WEBGL_lose_context');
    if (!ext) return { tried: false };
    ext.loseContext();
    await new Promise((r) => setTimeout(r, 600));
    const toast = document.querySelector('.toast') ? document.querySelector('.toast').textContent : null;
    ext.restoreContext();
    await new Promise((r) => setTimeout(r, 2500));
    return { tried: true, toast, sceneBack: window.__HH__.where() !== null, moves: window.__HH__.jazari().moves };
  })()`);

  await fly("lever", "h.jazari().last !== null");
  await page.waitForTimeout(1600);
  await shot("clock-running");
  await page.waitForFunction("window.__HH__.jazari().doorLit", undefined, { timeout: 15000 });
  await page.waitForTimeout(600);
  await shot("door-lit");
  await roomTalk();
  await noteJr("the clock tells the half hour");
  report.goals = await page.evaluate("JSON.parse(localStorage.getItem('im.hudhud.save.v1') || 'null')?.slots?.[0]?.quests?.['w02q1-al-jazari'] ?? null");
  await shot("results");
  await page.locator(".room-box .stage").focus();
  await page.keyboard.down("ArrowRight");
  await page.waitForFunction("!document.querySelector('.hub').hidden", undefined, { timeout: 25000 }).finally(() => page.keyboard.up("ArrowRight"));
  report.door = await hk("return h.lastDoor();");
  report.save = await page.evaluate("JSON.parse(localStorage.getItem('im.hudhud.save.v1') || 'null')");

  // Opening the room again and again: what it holds must not grow.
  const cycle = async () => ({ ...(await hk<Record<string, unknown>>("const i = h.info(); return { textures: i.textures, textureBytes: i.textureBytes, objects: i.objects, tweens: i.tweens };")), heapBytes: await heap() });
  const reopen = async () => {
    await hk("h.toAtlas(); h.startJazari();");
    await page.waitForFunction("window.__HH__.jazari() !== null && window.__HH__.where() !== null", undefined, { timeout: 30000 });
  };
  await reopen();
  await page.waitForTimeout(800);
  const first = await cycle();
  for (let i = 0; i < 9; i++) {
    await reopen();
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(800);
  report.lifecycle = { afterOneOpening: first, afterTenOpenings: await cycle(), canvases: await page.evaluate("document.querySelectorAll('canvas').length") };
}
/**
 * Al-Tusi's observatory, played to its end by flight as a player would: the talks gone through with the keyboard, both
 * questions, the kind answer and the feather, one wrong setting turned and shown to its end, the levers moved to the
 * line, frame times while the bird crosses the room and back, a lost graphics context, the crank, the lit door walked
 * to, and what opening the room ten times leaves behind.
 */
async function playTusi(): Promise<void> {
  type Ts = { setting: { r: number; k: number; d: number }; offer: { sizes: number[]; speeds: number[]; dirs: number[] }; turned: number; misses: number; flags: string[]; done: boolean; talk: unknown; busy: boolean; doorLit: boolean; last: unknown };
  const ts = () => hk<Ts>("return h.tusi();");
  const noteTs = async (step: string) => {
    const s = await ts();
    route.push({ step, at: Date.now() - t0, where: await hk("return h.where();"), turns: s.turned, flags: s.flags, restored: s.done, dark: false, done: s.doorLit });
  };
  const roomTalk = async (pick: string[] = []) => {
    const picks = [...pick];
    for (let i = 0; i < 20 && (await ts()).talk !== null; i++) {
      await page.waitForTimeout(350);
      const choices = page.locator(".room-box .talk .choices button");
      if ((await choices.count()) > 0) {
        const want = picks.shift();
        await (want ? choices.filter({ hasText: want }).first() : choices.last()).click();
      } else await page.keyboard.press("Enter");
    }
    await page.waitForTimeout(250);
  };
  const fly = async (id: string, until: string) => {
    await hk(`h.goTo(${JSON.stringify(id)});`);
    await page.waitForFunction(`(() => { const h = window.__HH__; return ${until}; })()`, undefined, { timeout: 8000 });
    await page.waitForTimeout(200);
  };
  const tStart = Date.now();
  await page.locator(".hub button[data-quest='w01q3-al-tusi']").click();
  await page.waitForFunction("window.__HH__.tusi() !== null && window.__HH__.where() !== null", undefined, { timeout: 30000 });
  report.msFromPlayToScene = Date.now() - tStart;
  await page.waitForTimeout(900);
  await shot("intro-talk");
  await noteTs("room open");
  await roomTalk();

  await fly("tusi", "h.tusi().talk !== null");
  await shot("tusi-talk");
  await roomTalk(["Ask why he looked for a model", "Ask about the observatory"]);
  await noteTs("asked al-Tusi both questions");
  await fly("girl", "h.tusi().talk !== null");
  await roomTalk(["Do not be afraid"]);
  await noteTs("answered the girl kindly");
  await fly("shelf", "h.tusi().flags.includes('feather')");
  await shot("feather-on-the-high-shelf");
  await roomTalk();
  await noteTs("found the feather");

  // One wrong setting turned and shown to its end: the speed lever moved once, then the crank.
  await fly("lever-speed", "h.tusi().setting.k === 2");
  await fly("crank", "h.tusi().turned === 1");
  await page.waitForTimeout(1200);
  await shot("turning");
  await page.waitForFunction("!window.__HH__.tusi().busy", undefined, { timeout: 10000 });
  await shot("wrong-path");
  await noteTs("turned a wrong setting");
  report.puzzle = { offer: (await ts()).offer, wrong: (await ts()).last };

  // Frame times while the bird crosses the whole room and back, with everything running.
  await hk("h.resetFrames();");
  await page.locator(".room-box .stage").focus();
  for (const key of ["ArrowLeft", "ArrowRight"]) {
    await page.keyboard.down(key);
    for (let i = 0; i < 14; i++) {
      await page.keyboard.down("Space");
      await page.waitForTimeout(120);
      await page.keyboard.up("Space");
      await page.waitForTimeout(380);
    }
    await page.keyboard.up(key);
  }
  const heap = () => page.evaluate("performance.memory ? performance.memory.usedJSHeapSize : null") as Promise<number | null>;
  report.benchmark = { route: "the whole width and back, hopping and flapping, 14 seconds", info: await hk("return h.info();"), heapBytes: await heap() };

  // A lost graphics context, before the line is found: what the player sees, and whether the room comes back.
  report.contextLoss = await page.evaluate(`(async () => {
    const canvas = document.querySelector('.room-box .stage canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const ext = gl && gl.getExtension('WEBGL_lose_context');
    if (!ext) return { tried: false };
    ext.loseContext();
    await new Promise((r) => setTimeout(r, 600));
    const toast = document.querySelector('.toast') ? document.querySelector('.toast').textContent : null;
    ext.restoreContext();
    await new Promise((r) => setTimeout(r, 2500));
    return { tried: true, toast, sceneBack: window.__HH__.where() !== null, turned: window.__HH__.tusi().turned };
  })()`);

  // The levers to the line, then the crank.
  await fly("lever-dir", "h.tusi().setting.d === -1");
  await shot("levers-set");
  await fly("crank", "h.tusi().turned === 2");
  await page.waitForTimeout(1200);
  await shot("line-turning");
  await page.waitForFunction("window.__HH__.tusi().doorLit", undefined, { timeout: 15000 });
  await page.waitForTimeout(600);
  await shot("door-lit");
  await roomTalk();
  await noteTs("the line is found");
  report.goals = await page.evaluate("JSON.parse(localStorage.getItem('im.hudhud.save.v1') || 'null')?.slots?.[0]?.quests?.['w01q3-al-tusi'] ?? null");
  await shot("results");
  await page.locator(".room-box .stage").focus();
  await page.keyboard.down("ArrowRight");
  await page.waitForFunction("!document.querySelector('.hub').hidden", undefined, { timeout: 25000 }).finally(() => page.keyboard.up("ArrowRight"));
  report.door = await hk("return h.lastDoor();");
  report.save = await page.evaluate("JSON.parse(localStorage.getItem('im.hudhud.save.v1') || 'null')");

  // Opening the room again and again: what it holds must not grow.
  const cycle = async () => ({ ...(await hk<Record<string, unknown>>("const i = h.info(); return { textures: i.textures, textureBytes: i.textureBytes, objects: i.objects, tweens: i.tweens };")), heapBytes: await heap() });
  const reopen = async () => {
    await hk("h.toAtlas(); h.startTusi();");
    await page.waitForFunction("window.__HH__.tusi() !== null && window.__HH__.where() !== null", undefined, { timeout: 30000 });
  };
  await reopen();
  await page.waitForTimeout(800);
  const first = await cycle();
  for (let i = 0; i < 9; i++) {
    await reopen();
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(800);
  report.lifecycle = { afterOneOpening: first, afterTenOpenings: await cycle(), canvases: await page.evaluate("document.querySelectorAll('canvas').length") };
}
/**
 * Al-Khwarizmi's room, played to its end by flight as a player would: the talks gone through with the keyboard, both
 * questions, the kind answer and the feather under the box, one slip at a weight, frame times while the bird crosses the
 * room and back, a lost graphics context, the fewest moves (restore, balance, share), the lit door walked to, and what
 * opening the room ten times leaves behind.
 */
async function playKhwarizmi(): Promise<void> {
  type Kw = { moves: number; slips: number; flags: string[]; done: boolean; talk: unknown; doorLit: boolean; sentence: string };
  const kw = () => hk<Kw>("return h.khwarizmi();");
  const noteKw = async (step: string) => {
    const s = await kw();
    route.push({ step, at: Date.now() - t0, where: await hk("return h.where();"), turns: s.moves, flags: s.flags, restored: s.done, dark: false, done: s.doorLit });
  };
  const roomTalk = async (pick: string[] = []) => {
    const picks = [...pick];
    for (let i = 0; i < 20 && (await kw()).talk !== null; i++) {
      await page.waitForTimeout(350);
      const choices = page.locator(".room-box .talk .choices button");
      if ((await choices.count()) > 0) {
        const want = picks.shift();
        await (want ? choices.filter({ hasText: want }).first() : choices.last()).click();
      } else await page.keyboard.press("Enter");
    }
    await page.waitForTimeout(250);
  };
  const fly = async (id: string, until: string) => {
    await hk(`h.goTo(${JSON.stringify(id)});`);
    await page.waitForFunction(`(() => { const h = window.__HH__; return ${until}; })()`, undefined, { timeout: 8000 });
    await page.waitForTimeout(200);
  };
  const tStart = Date.now();
  await page.locator(".hub button[data-quest='w02q2-al-khwarizmi']").click();
  await page.waitForFunction("window.__HH__.khwarizmi() !== null && window.__HH__.where() !== null", undefined, { timeout: 30000 });
  report.msFromPlayToScene = Date.now() - tStart;
  await page.waitForTimeout(900);
  await shot("intro-talk");
  await noteKw("room open");
  await roomTalk();

  await fly("khwarizmi", "h.khwarizmi().talk !== null");
  await shot("khwarizmi-talk");
  await roomTalk(["Ask how he wrote problems", "Ask about the two operations"]);
  await noteKw("asked al-Khwarizmi both questions");
  await fly("child", "h.khwarizmi().talk !== null");
  await roomTalk(["It is all right"]);
  await noteKw("answered the child kindly");
  await fly("box", "h.khwarizmi().flags.includes('feather')");
  await shot("feather-under-the-box");
  await roomTalk();
  await noteKw("found the feather");

  // One slip: the weight marked with a coin, when the numbers do not stand on both sides.
  await fly("weight-number", "h.khwarizmi().slips === 1");
  await shot("slip-at-a-weight");
  await noteKw("a slip at a weight");

  // Frame times while the bird crosses the whole room and back, with everything running.
  await hk("h.resetFrames();");
  await page.locator(".room-box .stage").focus();
  for (const key of ["ArrowRight", "ArrowLeft"]) {
    await page.keyboard.down(key);
    for (let i = 0; i < 14; i++) {
      await page.keyboard.down("Space");
      await page.waitForTimeout(120);
      await page.keyboard.up("Space");
      await page.waitForTimeout(380);
    }
    await page.keyboard.up(key);
  }
  const heap = () => page.evaluate("performance.memory ? performance.memory.usedJSHeapSize : null") as Promise<number | null>;
  report.benchmark = { route: "the whole width and back, hopping and flapping, 14 seconds", info: await hk("return h.info();"), heapBytes: await heap() };

  // A lost graphics context, before the box is open: what the player sees, and whether the room comes back.
  report.contextLoss = await page.evaluate(`(async () => {
    const canvas = document.querySelector('.room-box .stage canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const ext = gl && gl.getExtension('WEBGL_lose_context');
    if (!ext) return { tried: false };
    ext.loseContext();
    await new Promise((r) => setTimeout(r, 600));
    const toast = document.querySelector('.toast') ? document.querySelector('.toast').textContent : null;
    ext.restoreContext();
    await new Promise((r) => setTimeout(r, 2500));
    return { tried: true, toast, sceneBack: window.__HH__.where() !== null, slips: window.__HH__.khwarizmi().slips, sentence: window.__HH__.khwarizmi().sentence };
  })()`);

  // The fewest moves: restore the four taken from the first side, balance the things, share.
  await fly("restore-left-number", "h.khwarizmi().moves === 1");
  await shot("restored");
  await fly("weight-things", "h.khwarizmi().moves === 2");
  await shot("balanced");
  await fly("scoop", "h.khwarizmi().done");
  await page.waitForFunction("window.__HH__.khwarizmi().doorLit", undefined, { timeout: 15000 });
  await page.waitForTimeout(600);
  await shot("box-open");
  await roomTalk();
  await noteKw("the box is open");
  report.puzzle = { sentence: (await kw()).sentence, moves: (await kw()).moves, slips: (await kw()).slips };
  report.goals = await page.evaluate("JSON.parse(localStorage.getItem('im.hudhud.save.v1') || 'null')?.slots?.[0]?.quests?.['w02q2-al-khwarizmi'] ?? null");
  await shot("results");
  await page.locator(".room-box .stage").focus();
  await page.keyboard.down("ArrowRight");
  await page.waitForFunction("!document.querySelector('.hub').hidden", undefined, { timeout: 25000 }).finally(() => page.keyboard.up("ArrowRight"));
  report.door = await hk("return h.lastDoor();");
  report.save = await page.evaluate("JSON.parse(localStorage.getItem('im.hudhud.save.v1') || 'null')");

  // Opening the room again and again: what it holds must not grow.
  const cycle = async () => ({ ...(await hk<Record<string, unknown>>("const i = h.info(); return { textures: i.textures, textureBytes: i.textureBytes, objects: i.objects, tweens: i.tweens };")), heapBytes: await heap() });
  const reopen = async () => {
    await hk("h.toAtlas(); h.startKhwarizmi();");
    await page.waitForFunction("window.__HH__.khwarizmi() !== null && window.__HH__.where() !== null", undefined, { timeout: 30000 });
  };
  await reopen();
  await page.waitForTimeout(800);
  const first = await cycle();
  for (let i = 0; i < 9; i++) {
    await reopen();
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(800);
  report.lifecycle = { afterOneOpening: first, afterTenOpenings: await cycle(), canvases: await page.evaluate("document.querySelectorAll('canvas').length") };
}
/**
 * Al-Kindi's room, played to its end by flight as a player would: the talks gone through with the keyboard, both
 * questions, the kind answer and the feather under the torn page, the bell rung too soon, frame times while the bird
 * crosses the room and back, a lost graphics context, one wrong reading, every mark given its sign by carrying, the page
 * read, the lit door walked to, and what opening the room ten times leaves behind.
 */
async function playKindi(): Promise<void> {
  type Kd = { guess: Record<string, string>; reads: number; fails: number; flags: string[]; done: boolean; talk: unknown; doorLit: boolean; carrying: string | null; puzzle: { key: Record<string, string>; message: string[] } };
  const kd = () => hk<Kd>("return h.kindi();");
  const noteKd = async (step: string) => {
    const s = await kd();
    route.push({ step, at: Date.now() - t0, where: await hk("return h.where();"), turns: s.reads, flags: s.flags, restored: s.done, dark: false, done: s.doorLit });
  };
  const roomTalk = async (pick: string[] = []) => {
    const picks = [...pick];
    for (let i = 0; i < 20 && (await kd()).talk !== null; i++) {
      await page.waitForTimeout(350);
      const choices = page.locator(".room-box .talk .choices button");
      if ((await choices.count()) > 0) {
        const want = picks.shift();
        await (want ? choices.filter({ hasText: want }).first() : choices.last()).click();
      } else await page.keyboard.press("Enter");
    }
    await page.waitForTimeout(250);
  };
  const fly = async (id: string, until: string) => {
    await hk(`h.goTo(${JSON.stringify(id)});`);
    await page.waitForFunction(`(() => { const h = window.__HH__; return ${until}; })()`, undefined, { timeout: 8000 });
    await page.waitForTimeout(200);
  };
  const carry = async (sign: string, mark: string) => {
    await fly(`token-${sign}`, `h.kindi().carrying === ${JSON.stringify(sign)}`);
    await fly(`slot-${mark}`, `h.kindi().carrying === null && h.kindi().guess[${JSON.stringify(mark)}] === ${JSON.stringify(sign)}`);
  };
  const tStart = Date.now();
  await page.locator(".hub button[data-quest='w02q3-al-kindi']").click();
  await page.waitForFunction("window.__HH__.kindi() !== null && window.__HH__.where() !== null", undefined, { timeout: 30000 });
  report.msFromPlayToScene = Date.now() - tStart;
  await page.waitForTimeout(900);
  await shot("intro-talk");
  await noteKd("room open");
  await roomTalk();

  await fly("kindi", "h.kindi().talk !== null");
  await shot("kindi-talk");
  await roomTalk(["Ask how to begin", "Ask about short messages"]);
  await noteKd("asked al-Kindi both questions");
  await fly("messenger", "h.kindi().talk !== null");
  await roomTalk(["It is all right"]);
  await noteKd("answered the messenger kindly");
  await fly("page", "h.kindi().flags.includes('feather')");
  await shot("feather-under-the-page");
  await roomTalk();
  await noteKd("found the feather");

  // The bell rung too soon: a reading refused, not counted.
  await fly("bell", "h.kindi().last !== null");
  await noteKd("the bell rung with marks still empty");

  // Frame times while the bird crosses the whole room and back, with everything running.
  await hk("h.resetFrames();");
  await page.locator(".room-box .stage").focus();
  for (const key of ["ArrowRight", "ArrowLeft"]) {
    await page.keyboard.down(key);
    for (let i = 0; i < 14; i++) {
      await page.keyboard.down("Space");
      await page.waitForTimeout(120);
      await page.keyboard.up("Space");
      await page.waitForTimeout(380);
    }
    await page.keyboard.up(key);
  }
  const heap = () => page.evaluate("performance.memory ? performance.memory.usedJSHeapSize : null") as Promise<number | null>;
  report.benchmark = { route: "the whole width and back, hopping and flapping, 14 seconds", info: await hk("return h.info();"), heapBytes: await heap() };

  // A lost graphics context, before the page reads: what the player sees, and whether the room comes back.
  report.contextLoss = await page.evaluate(`(async () => {
    const canvas = document.querySelector('.room-box .stage canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const ext = gl && gl.getExtension('WEBGL_lose_context');
    if (!ext) return { tried: false };
    ext.loseContext();
    await new Promise((r) => setTimeout(r, 600));
    const toast = document.querySelector('.toast') ? document.querySelector('.toast').textContent : null;
    ext.restoreContext();
    await new Promise((r) => setTimeout(r, 2500));
    return { tried: true, toast, sceneBack: window.__HH__.where() !== null, reads: window.__HH__.kindi().reads, guess: window.__HH__.kindi().guess };
  })()`);

  // Every mark given its sign by carrying, by the ranking of the two count boards first (the commonest mark the commonest
  // sign), then the bell: in Explorer the sun and the feather are tied, so ranking alone gives a wrong reading. Then the
  // two marks of the tie exchanged, as the opening says, and the bell again.
  const s0 = await kd();
  const marks = await page.evaluate("[...document.querySelectorAll('.room-box .room-words li button')].map((b) => b.dataset.thing).filter((id) => id && id.startsWith('slot-')).map((id) => id.slice(5))") as string[];
  const signs = await page.evaluate("[...document.querySelectorAll('.room-box table.counts')[0].querySelectorAll('tbody tr')].map((r) => r.children[1].textContent)") as string[];
  const signIds: Record<string, string> = { "the sun": "sun", "the moon": "moon", "the star": "star", "the wave": "wave", "the leaf": "leaf", "the key": "key", "the feather": "feather", "the lamp": "lamp" };
  for (const [i, m] of marks.entries()) await carry(signIds[signs[i]!] ?? s0.puzzle.key[m]!, m);
  await shot("ranked");
  await fly("bell", "h.kindi().reads === 1");
  await shot("wrong-reading");
  await noteKd("a reading by ranking alone");
  for (const m of marks) if ((await kd()).guess[m] !== s0.puzzle.key[m]) await carry(s0.puzzle.key[m]!, m);
  await fly("bell", "h.kindi().done");
  await page.waitForFunction("window.__HH__.kindi().doorLit", undefined, { timeout: 15000 });
  await page.waitForTimeout(600);
  await shot("page-reads");
  await roomTalk();
  await noteKd("the page reads");
  report.puzzle = { reads: (await kd()).reads, fails: (await kd()).fails };
  report.goals = await page.evaluate("JSON.parse(localStorage.getItem('im.hudhud.save.v1') || 'null')?.slots?.[0]?.quests?.['w02q3-al-kindi'] ?? null");
  await shot("results");
  await page.locator(".room-box .stage").focus();
  await page.keyboard.down("ArrowRight");
  await page.waitForFunction("!document.querySelector('.hub').hidden", undefined, { timeout: 25000 }).finally(() => page.keyboard.up("ArrowRight"));
  report.door = await hk("return h.lastDoor();");
  report.save = await page.evaluate("JSON.parse(localStorage.getItem('im.hudhud.save.v1') || 'null')");

  // Opening the room again and again: what it holds must not grow.
  const cycle = async () => ({ ...(await hk<Record<string, unknown>>("const i = h.info(); return { textures: i.textures, textureBytes: i.textureBytes, objects: i.objects, tweens: i.tweens };")), heapBytes: await heap() });
  const reopen = async () => {
    await hk("h.toAtlas(); h.startKindi();");
    await page.waitForFunction("window.__HH__.kindi() !== null && window.__HH__.where() !== null", undefined, { timeout: 30000 });
  };
  await reopen();
  await page.waitForTimeout(800);
  const first = await cycle();
  for (let i = 0; i < 9; i++) {
    await reopen();
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(800);
  report.lifecycle = { afterOneOpening: first, afterTenOpenings: await cycle(), canvases: await page.evaluate("document.querySelectorAll('canvas').length") };
}
report.route = route;
report.shots = shots;
report.errors = errors;
writeFileSync(resolve(out, `${tag}-report.json`), `${JSON.stringify(report, null, 1)}\n`);
await browser.close();
await served.close();
console.log(JSON.stringify({ out, tag, failed: report.failed ?? null, errors, shots: shots.length, firstFlight: report.firstFlight, goals: report.goals, benchmark: report.benchmark, lifecycle: report.lifecycle, contextLoss: report.contextLoss }, null, 1));
if (report.failed || errors.length) process.exit(1);
