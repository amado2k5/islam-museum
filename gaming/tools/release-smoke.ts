// Opens a built release in real Chrome, served by the games Worker's own code (workers/games) from a folder laid
// out exactly like the bucket, and fails on anything a visitor would hit: a console error, a blocked request, a
// content security policy violation, a request to another origin, a game that does not start.
// It is the last check before a release is published, and it needs no Cloudflare account.
// Usage: npx tsx --tsconfig tsconfig.json tools/release-smoke.ts [release dir=dist/release] [out dir]
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { chromium } from "playwright-core";
// @ts-expect-error plain JavaScript modules of the Worker, with no type declarations
import worker from "../../workers/games/src/index.js";
// @ts-expect-error
import { folderBucket } from "../../workers/games/test/fake-bucket.mjs";

const releaseDir = resolve(process.argv[2] ?? "dist/release");
const outDir = process.argv[3] ? resolve(process.argv[3]) : null;
const manifest = JSON.parse(readFileSync(join(releaseDir, "release.json"), "utf8")) as { commit: string; commitDate: string; games: Array<{ id: string; status: string; page: string | null }> };
const releaseId = `${manifest.commitDate.slice(0, 10).replaceAll("-", "")}-${manifest.commit.slice(0, 11)}`;

// A bucket on disk: games/channel.json and games/r/<release>/…
const bucketDir = mkdtempSync(join(tmpdir(), "im-games-bucket-"));
cpSync(releaseDir, join(bucketDir, "games", "r", releaseId), { recursive: true });
writeFileSync(join(bucketDir, "games", "channel.json"), JSON.stringify({ format: "im.play.channel", version: 1, current: releaseId, previous: null, commit: manifest.commit, updatedAt: manifest.commitDate }));
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
    page.on("response", async (r) => {
      const body = await r.body().catch(() => Buffer.alloc(0));
      requests.push({ url: r.url(), status: r.status(), bytes: body.length });
    });
    const started = Date.now();
    await page.goto(`${base}/${game.id}/?lang=${lang}`);
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
    } else {
      await page.waitForSelector("#panel h2", { timeout: 60_000 });
    }
    const ready = Date.now() - started;
    await page.waitForTimeout(800);
    if (await page.locator("details.music").count()) errors.push("a music control is shown in a release built without music");
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
    (report.pages as unknown[]).push({ game: game.id, lang, readyMs: ready, requests: requests.length, bytes: requests.reduce((n, r) => n + r.bytes, 0), startedIn3d: started3d, problems: errors });
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
