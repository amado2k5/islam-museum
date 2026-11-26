// Opens a built release in real Chrome, served by the games Worker's own code (workers/games) from a folder laid
// out exactly like the bucket, and fails on anything a visitor would hit: a console error, a blocked request, a
// content security policy violation, a request to another origin, a game that does not start.
// It is the last check before a release is published, and it needs no Cloudflare account.
// Usage: npx tsx --tsconfig tsconfig.json tools/release-smoke.ts [release dir=dist/release] [out dir]
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { chromium } from "playwright-core";
import { leaveOpening } from "./hudhud-opening";
// @ts-expect-error plain JavaScript modules of the Worker, with no type declarations
import worker from "../../workers/games/src/index.js";
// @ts-expect-error
import { folderBucket } from "../../workers/games/test/fake-bucket.mjs";

const releaseDir = resolve(process.argv[2] ?? "dist/release");
const outDir = process.argv[3] ? resolve(process.argv[3]) : null;
const manifest = JSON.parse(readFileSync(join(releaseDir, "release.json"), "utf8")) as { commit: string; commitDate: string; musicBase: string; games: Array<{ id: string; status: string; page: string | null }> };
const releaseId = `${manifest.commitDate.slice(0, 10).replaceAll("-", "")}-${manifest.commit.slice(0, 11)}`;

// A bucket on disk: games/channel.json and games/r/<release>/…
const bucketDir = mkdtempSync(join(tmpdir(), "im-games-bucket-"));
cpSync(releaseDir, join(bucketDir, "games", "r", releaseId), { recursive: true });
writeFileSync(join(bucketDir, "games", "channel.json"), JSON.stringify({ format: "im.play.channel", version: 1, current: releaseId, previous: null, commit: manifest.commit, updatedAt: manifest.commitDate }));
// The music lives beside the releases, as in the real bucket, when this machine has the tracks.
const localMusic = resolve(releaseDir, "../../media/music");
const withMusic = manifest.musicBase !== "off" && existsSync(localMusic);
if (withMusic) cpSync(localMusic, join(bucketDir, "games", "media", "music"), { recursive: true });
// And so do the authored models, when the release was built to look for them: the entry file, its data and its textures.
const localModels = resolve(releaseDir, "../../media/models");
const withModels = (manifest as { modelsBase?: string }).modelsBase !== undefined && (manifest as { modelsBase?: string }).modelsBase !== "off" && existsSync(localModels);
if (withModels) cpSync(localModels, join(bucketDir, "games", "media", "models"), { recursive: true, filter: (src) => !src.includes("/_work") });
const bucket = folderBucket(bucketDir);
const env = { GAMES_BUCKET: bucket, ROBOTS: "disallow", MUSIC_ORIGIN: "" };

const server = createServer(async (req, res) => {
  try {
    const request = new Request(`http://${req.headers.host}${req.url}`, { method: req.method, headers: req.headers as Record<string, string> });
    const response: Response = await worker.fetch(request, env);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (e) {
    res.writeHead(500).end(String(e));
  }
});
await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
const address = server.address();
if (!address || typeof address === "string") throw new Error("no port");
const base = `http://127.0.0.1:${address.port}`;

const problems: string[] = [];
const report: Record<string, unknown> = { release: releaseId, base: "the games Worker's code over a folder bucket", pages: [] as unknown[] };

// The host's own answers, asked for directly.
const get = (path: string, init?: RequestInit) => fetch(`${base}${path}`, { redirect: "manual", ...init });
const root = await get("/");
if (root.status !== 200 || !(await root.text()).includes("https://islam.museum/")) problems.push("the root does not hand the visitor to the museum");
for (const [path, status] of [["/nothing-here.js", 404], ["/.env", 404], ["/release.json", 200], ["/_channel", 200], ["/robots.txt", 200]] as const) {
  const r = await get(path);
  if (r.status !== status) problems.push(`${path} answered ${r.status}, expected ${status}`);
  if (!r.headers.get("content-security-policy")?.startsWith("default-src 'none'")) problems.push(`${path} came without the content security policy`);
}
if ((await get("/x", { method: "POST" })).status !== 405) problems.push("a POST was not refused");

const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--window-size=1500,950", "--window-position=0,0", "--force-device-scale-factor=1"] });
for (const game of manifest.games.filter((g) => g.page)) {
  const redirect = await get(`/${game.id}`);
  if (redirect.status !== 301 || redirect.headers.get("location") !== `/${game.id}/`) problems.push(`/${game.id} is not redirected to its folder`);
  for (const lang of ["ar", "en"]) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 810 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const errors: string[] = [];
    const requests: Array<{ url: string; status: number; bytes: number }> = [];
    await page.addInitScript("window.__csp = []; document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.violatedDirective + ' ' + e.blockedURI));");
    page.on("pageerror", (e) => errors.push(`page error: ${e}`));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(`console: ${m.text()}`);
    });
    page.on("requestfailed", (r) => errors.push(`request failed: ${r.url()} ${r.failure()?.errorText ?? ""}`));
    page.on("response", (r) => {
      // Recorded at once: the body of a track arrives in spans and may still be arriving when the checks run.
      const entry = { url: r.url(), status: r.status(), bytes: 0 };
      requests.push(entry);
      r.body().then((body) => (entry.bytes = body.length), () => {});
    });
    const started = Date.now();
    await page.goto(`${base}/${game.id}/?lang=${lang}&fresh=1`);
    let started3d: unknown = null;
    if (game.id === "golden-age") {
      // Polled from here with plain evaluations: the page's own policy rightly refuses the eval that a string
      // predicate handed to waitForFunction would need.
      for (const end = Date.now() + 90_000; !(await page.evaluate("Boolean(window.__GA__ && (window.__GA__.ready || window.__GA__.error))")); ) {
        if (Date.now() > end) throw new Error("the game neither started nor reported an error in 90 seconds");
        await page.waitForTimeout(150);
      }
      const hook = (await page.evaluate("({ ready: window.__GA__.ready, error: window.__GA__.error ?? null, no3d: window.__GA__.no3d ?? null, season: window.__GA__.ready ? window.__GA__.state().season : null })")) as { ready: boolean; error: string | null; no3d: string | null; season: number | null };
      if (!hook.ready) errors.push(`the game did not start: ${hook.error}`);
      else {
        started3d = hook.no3d === null;
        await page.evaluate("window.__GA__.dispatch({ type: 'end-season' })");
        const after = (await page.evaluate("window.__GA__.state().season")) as number;
        if (after !== hook.season! + 1) errors.push(`ending a season moved the season from ${hook.season} to ${after}`);
      }
    } else if (game.id === "granada") {
      for (const end = Date.now() + 30_000; !(await page.evaluate("Boolean(window.__GR__)")); ) {
        if (Date.now() > end) throw new Error("Granada did not start in 30 seconds");
        await page.waitForTimeout(150);
      }
      const hook = (await page.evaluate("({ ready: window.__GR__.ready, error: window.__GR__.error ?? null })")) as { ready: boolean; error: string | null };
      if (!hook.ready) errors.push(`the game did not start: ${hook.error}`);
      else {
        await page.locator("#brief-start").click();
        await page.locator("#step").click();
        const day = (await page.evaluate("window.__GR__.state().day")) as number;
        if (day !== 26) errors.push(`a day did not pass: day ${day}`);
        if ((await page.locator("svg.map g.field").count()) !== 3) errors.push("the plan of the valley does not show its three fields");
        // The 3D valley comes up after the page is playable. On a machine that can draw it, it must; it is drawn
        // under the release's content security policy, which is what this run is for.
        for (const end = Date.now() + 120_000; (await page.evaluate("window.__GR__.threeD")) === "pending"; ) {
          if (Date.now() > end) break;
          await page.waitForTimeout(200);
        }
        const threeD = (await page.evaluate("window.__GR__.threeD")) as string;
        started3d = threeD === "on";
        if (threeD !== "on" && threeD !== "off") errors.push(`the 3D valley did not start: ${threeD}`);
        else if (threeD === "on") {
          if (withModels) {
            // The authored models are fetched from the host one after another; the mill is the last of them.
            for (const end = Date.now() + 30_000; !((await page.evaluate("(() => { const i = window.__GR__.stage().info(); return i.models.includes('granada/mill') || i.modelFailures.length > 0; })()")) as boolean); ) {
              if (Date.now() > end) break;
              await page.waitForTimeout(200);
            }
            const models = (await page.evaluate("window.__GR__.stage().info()")) as { models: string[]; modelFailures: string[] };
            for (const wanted of ["granada/town", "granada/landmarks", "granada/mill"]) if (!models.models.includes(wanted)) errors.push(`the authored model ${wanted} did not load: ${models.modelFailures.join("; ") || "no reason given"}`);
          }
          await page.waitForTimeout(1200);
          const info = (await page.evaluate("window.__GR__.stage().info()")) as { triangles: number };
          if (!(info.triangles > 100_000)) errors.push(`the 3D valley drew ${info.triangles} triangles`);
          if (!(await page.locator("canvas.scene").isVisible())) errors.push("the 3D valley is not shown");
        }
      }
    } else if (game.id === "hudhud") {
      // A 2D game: the page comes up, Play starts the scene on a WebGL canvas under the release's content security
      // policy, and one turn of a mirror reaches the rules and comes back.
      for (const end = Date.now() + 30_000; !(await page.evaluate("Boolean(window.__HH__ && (window.__HH__.ready || window.__HH__.error))")); ) {
        if (Date.now() > end) throw new Error("Hudhud did not start in 30 seconds");
        await page.waitForTimeout(150);
      }
      const hook = (await page.evaluate("({ ready: window.__HH__.ready, error: window.__HH__.error ?? null })")) as { ready: boolean; error: string | null };
      if (!hook.ready) errors.push(`the game did not start: ${hook.error}`);
      else {
        // The opening story comes first; a visitor skips it by its button.
        if (!(await leaveOpening(page)) && (await page.locator(".prologue").count()) > 0) errors.push("the opening story is on the page but was not showing");
        await page.locator(".hub button.primary").click();
        for (const end = Date.now() + 30_000; !(await page.evaluate("window.__HH__.where() !== null")); ) {
          if (Date.now() > end) break;
          await page.waitForTimeout(150);
        }
        const info = (await page.evaluate("window.__HH__.where() === null ? null : window.__HH__.info()")) as { renderer: string; textures: number } | null;
        if (!info) errors.push(`the scene did not open: ${(await page.evaluate("window.__HH__.error")) ?? "no reason given"}`);
        else {
          if (info.renderer !== "webgl") errors.push(`the scene is drawn with ${info.renderer}, not WebGL`);
          if (!(info.textures > 20)) errors.push(`the scene painted ${info.textures} pictures`);
          if (!(await page.locator("#stage canvas").isVisible())) errors.push("the scene's canvas is not shown");
          await page.evaluate("window.__HH__.command({ type: 'skip' }); window.__HH__.touch('mirror-a');");
          const turns = (await page.evaluate("window.__HH__.state().turns")) as number;
          if (turns !== 1) errors.push(`turning a mirror left the count at ${turns}`);
          if (!(await page.locator("header .chip.proto").isVisible())) errors.push("the prototype label is not shown");
        }
        started3d = "not a 3D game";
      }
    } else {
      await page.waitForSelector("#panel h2", { timeout: 60_000 });
      // Atlas's lit sphere comes up under its drawn globe; under the release's content security policy it must too.
      for (const end = Date.now() + 60_000; (await page.evaluate("document.documentElement.dataset.globe")) !== "3d"; ) {
        if (Date.now() > end) break;
        await page.waitForTimeout(150);
      }
      started3d = (await page.evaluate("document.documentElement.dataset.globe")) === "3d";
      if (!started3d) errors.push("Atlas's lit sphere did not start");
    }
    const ready = Date.now() - started;
    await page.waitForTimeout(800);
    const control = await page.locator("details.music").count();
    if (manifest.musicBase === "off" && control) errors.push("a music control is shown in a release built without music");
    if (withMusic) {
      // Nothing sounds before a click; after one, a track is asked for in spans and plays (the browser is muted).
      if (!control) errors.push("no music control in a release built with music");
      await page.mouse.click(700, 500);
      await page.waitForTimeout(1500);
      const hookName = game.id === "golden-age" ? "__GA__" : game.id === "granada" ? "__GR__" : null;
      const tracks = requests.filter((r) => r.url.endsWith(".m4a"));
      if (tracks.length === 0) errors.push("no track was asked for after a click");
      else if (!tracks.some((r) => r.status === 206 || r.status === 200)) errors.push(`the track answered ${tracks.map((r) => r.status).join(", ")}`);
      if (hookName) {
        const playing = (await page.evaluate(`window.${hookName}.music.state().playing`)) as boolean;
        if (!playing) errors.push("the music did not start after a click");
      }
    }
    const dir = await page.evaluate("document.documentElement.dir");
    if ((lang === "ar") !== (dir === "rtl")) errors.push(`direction is ${dir} for ${lang}`);
    const csp = (await page.evaluate("window.__csp")) as string[];
    for (const v of csp) errors.push(`content security policy: ${v}`);
    for (const r of requests) {
      if (!r.url.startsWith(base) && !r.url.startsWith("data:") && !r.url.startsWith("blob:")) errors.push(`asked another origin: ${r.url}`);
      if (r.status >= 400) errors.push(`${r.status} for ${r.url}`);
    }
    if (outDir) {
      mkdirSync(outDir, { recursive: true });
      await page.screenshot({ path: join(outDir, `release-${game.id}-${lang}.png`) });
    }
    (report.pages as unknown[]).push({ game: game.id, lang, music: withMusic ? requests.filter((r) => r.url.endsWith(".m4a")).map((r) => r.status) : "none", readyMs: ready, requests: requests.length, bytes: requests.reduce((n, r) => n + r.bytes, 0), startedIn3d: started3d, problems: errors });
    for (const e of errors) problems.push(`${game.id} (${lang}): ${e}`);
    await context.close();
  }
}
await browser.close();
server.close();
rmSync(bucketDir, { recursive: true, force: true });
report.bucketReads = bucket.reads.length;
report.readsOutsideGames = bucket.reads.filter((k: string) => !k.startsWith("games/")).length;
if (report.readsOutsideGames) problems.push("the Worker read an object outside games/");
report.problems = problems;
console.log(JSON.stringify(report, null, 1));
if (outDir) writeFileSync(join(outDir, "release-smoke.json"), `${JSON.stringify(report, null, 1)}\n`);
if (problems.length) {
  console.error(`${problems.length} problem(s): this release must not be published`);
  process.exit(1);
}
console.log("the release starts and plays behind the host's own headers");
