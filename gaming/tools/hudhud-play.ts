// Plays Hudhud's golden scene from start to finish in real Chrome and writes down what happened: the route, the
// state after every step, pictures, console errors, frame times, calls to the graphics card, texture memory, the
// saved file, what a second and a tenth run of the scene leave behind, and what a lost graphics context does.
//
// Usage: npx tsx --tsconfig tsconfig.json tools/hudhud-play.ts <out dir> [lang] [quality] [width] [height] [style]
// It measures the machine it runs on. A pass here is not a pass on the museum's two reference machines.
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type Page } from "playwright-core";
import { solve, type LightPuzzle } from "../games/hudhud/src/sim/light";
import { leaveOpening } from "./hudhud-opening";
import { serveWorkspace } from "./serve";

const [outArg, lang = "en", quality = "medium", w = "1920", h = "1080", style = "explorer"] = process.argv.slice(2);
if (!outArg) throw new Error("usage: hudhud-play.ts <out dir> [lang] [quality] [width] [height] [style]");
const out = resolve(outArg);
mkdirSync(out, { recursive: true });
const tag = `${lang}-${quality}-${w}x${h}`;

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

const report: Record<string, unknown> = { tag, lang, quality, style, viewport: [Number(w), Number(h)], ran: new Date().toISOString(), browser: `chrome ${browser.version()}`, machine: `${process.platform} ${process.arch}` };
try {
  await page.goto(`${served.base}/games/hudhud/index.html?lang=${lang}&q=${quality}&style=${style}&music=off&perf=1`);
  await page.waitForFunction("window.__HH__ && (window.__HH__.ready || window.__HH__.error)", undefined, { timeout: 60000 });
  // The opening story comes first; a visitor reads or skips it. It is captured, then skipped by its button.
  if (await page.locator(".prologue").isVisible()) {
    await shot("opening");
    await leaveOpening(page);
  }
  await shot("cover");
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
} catch (e) {
  report.failed = String(e);
  await page.screenshot({ path: resolve(out, `${tag}-failure.png`) }).catch(() => undefined);
}
report.route = route;
report.shots = shots;
report.errors = errors;
writeFileSync(resolve(out, `${tag}-report.json`), `${JSON.stringify(report, null, 1)}\n`);
await browser.close();
await served.close();
console.log(JSON.stringify({ out, tag, failed: report.failed ?? null, errors, shots: shots.length, firstFlight: report.firstFlight, goals: report.goals, benchmark: report.benchmark, lifecycle: report.lifecycle, contextLoss: report.contextLoss }, null, 1));
if (report.failed || errors.length) process.exit(1);
