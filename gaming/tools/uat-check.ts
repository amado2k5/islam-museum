// Opens the games on a deployed host (UAT by default) in real Chrome, muted, and checks what a visitor would meet:
// each game starts, the music control is there, nothing sounds before a click, a track plays after one, and the
// console stays empty. It reads only; it changes nothing on the host.
// It also says whether each game came up in 3D, and keeps a capture of each if a folder is named.
// Usage: npx tsx --tsconfig tsconfig.json tools/uat-check.ts [base=https://uat-games.islam.museum] [lang=ar] [captures dir]
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "https://uat-games.islam.museum";
const lang = process.argv[3] ?? "ar";
const shots = process.argv[4];
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--window-size=1500,1000", "--window-position=0,0"] });
const report: Record<string, unknown> = { base, lang, games: [] as unknown[] };
const problems: string[] = [];
const channel = await (await fetch(`${base}/_channel`)).json();
report.live = channel.current;
for (const game of ["granada", "golden-age", "atlas"]) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const errors: string[] = [];
  const tracks: number[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("response", (r) => {
    if (r.url().endsWith(".m4a")) tracks.push(r.status());
    else if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
  });
  await page.goto(`${base}/${game}/?lang=${lang}&fresh=1`);
  const hook = game === "granada" ? "__GR__" : game === "golden-age" ? "__GA__" : null;
  if (hook) {
    for (const end = Date.now() + 90_000; !(await page.evaluate(`Boolean(window.${hook} && (window.${hook}.ready || window.${hook}.error))`)); ) {
      if (Date.now() > end) throw new Error(`${game} did not start`);
      await page.waitForTimeout(200);
    }
  } else await page.waitForSelector("#panel h2", { timeout: 60_000 });
  const control = await page.locator("details.music").count();
  const before = tracks.length;
  await page.mouse.click(720, 520);
  await page.waitForTimeout(2500);
  const playing = hook ? ((await page.evaluate(`window.${hook}.music.state().playing`)) as boolean) : null;
  // Each game says in its own way whether it is drawing in 3D; Granada and Atlas come up in it a moment after they start.
  let threeD: boolean;
  if (game === "golden-age") threeD = ((await page.evaluate("window.__GA__.no3d ?? null")) as string | null) === null;
  else {
    const state = game === "granada" ? "window.__GR__.threeD" : "document.documentElement.dataset.globe";
    const settled = (v: string) => (game === "granada" ? v !== "pending" : v === "3d");
    for (const end = Date.now() + 120_000; !settled((await page.evaluate(state)) as string); ) {
      if (Date.now() > end) break;
      await page.waitForTimeout(200);
    }
    const now = (await page.evaluate(state)) as string;
    threeD = now === "on" || now === "3d";
    if (!threeD) problems.push(`${game}: not in 3D (${now})`);
  }
  if (shots) {
    if (game === "granada") await page.locator("#brief-start").click().catch(() => {});
    await page.waitForTimeout(game === "granada" ? 9500 : 1500);
    await page.screenshot({ path: `${shots}/uat-${game}-${lang}.png` });
  }
  if (!control) problems.push(`${game}: no music control`);
  if (before !== 0) problems.push(`${game}: a track was asked for before any click`);
  if (!tracks.some((s) => s === 206 || s === 200)) problems.push(`${game}: no track arrived after a click (${tracks.join(", ") || "none asked for"})`);
  if (playing === false) problems.push(`${game}: the music did not start after a click`);
  for (const e of errors) problems.push(`${game}: ${e}`);
  (report.games as unknown[]).push({ game, musicControl: Boolean(control), trackResponses: tracks, playing, in3d: threeD, consoleErrors: errors.length });
  await context.close();
}
await browser.close();
report.problems = problems;
console.log(JSON.stringify(report, null, 1));
if (problems.length) process.exit(1);
