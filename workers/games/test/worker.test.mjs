// The request handler against a bucket held in memory. Run: node --test workers/games/test/
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import worker, { forgetChannel } from "../src/index.js";
import { memoryBucket } from "./fake-bucket.mjs";

const A = "20261124-0123456789a";
const B = "20261125-a707db02d7f";
const channel = (current, previous = null) => JSON.stringify({ format: "im.play.channel", version: 1, current, previous, commit: current.slice(9), updatedAt: "2026-11-25T20:00:00Z" });
const release = (id, files) => Object.fromEntries(Object.entries(files).map(([path, body]) => [`games/r/${id}/${path}`, body]));
const filesOf = (tag) => ({ "index.html": "<a href=\"https://islam.museum/\">islam.museum</a>", "404.html": "<p>404</p>", "granada/index.html": `<title>Granada ${tag}</title>`, [`assets/granada-${tag}.js`]: `console.log("${tag}")`, "release.json": `{"release":"${tag}"}` });
const ask = (bucket, path, init = {}, env = {}) => worker.fetch(new Request(`https://games.islam.museum${path}`, init), { GAMES_BUCKET: bucket, ...env });

beforeEach(() => forgetChannel());

test("serves the live release with the host's headers", async () => {
  const bucket = memoryBucket({ "games/channel.json": channel(B, A), ...release(A, filesOf("old")), ...release(B, filesOf("new")) });
  const page = await ask(bucket, "/granada/");
  assert.equal(page.status, 200);
  assert.equal(await page.text(), "<title>Granada new</title>");
  assert.equal(page.headers.get("content-type"), "text/html; charset=utf-8");
  assert.equal(page.headers.get("cache-control"), "public, max-age=60");
  assert.ok(page.headers.get("content-security-policy").startsWith("default-src 'none'"));
  assert.equal(page.headers.get("x-content-type-options"), "nosniff");
  assert.equal(page.headers.get("x-robots-tag"), "noindex");
  const script = await ask(bucket, "/assets/granada-new.js");
  assert.equal(script.headers.get("content-type"), "text/javascript; charset=utf-8");
  assert.equal(script.headers.get("cache-control"), "public, max-age=31536000, immutable");
  assert.equal((await ask(bucket, "/granada")).headers.get("location"), "/granada/");
  assert.equal((await ask(bucket, "/granada?lang=ar")).headers.get("location"), "/granada/?lang=ar");
  // Every object read was under games/.
  assert.ok(bucket.reads.every((key) => key.startsWith("games/")), bucket.reads.join(", "));
});

test("a page from the release before still gets its own scripts, and only its scripts", async () => {
  const bucket = memoryBucket({ "games/channel.json": channel(B, A), ...release(A, filesOf("old")), ...release(B, filesOf("new")) });
  const old = await ask(bucket, "/assets/granada-old.js");
  assert.equal(old.status, 200);
  assert.equal(await old.text(), 'console.log("old")');
  // A page that exists only in the release before is not served: pages come from the live release alone.
  const only = memoryBucket({ "games/channel.json": channel(B, A), ...release(A, { ...filesOf("old"), "atlas/index.html": "old atlas" }), ...release(B, filesOf("new")) });
  assert.equal((await ask(only, "/atlas/")).status, 404);
});

test("what is not there is a 404 with the release's own page, and nothing outside the release is reachable", async () => {
  const bucket = memoryBucket({ "games/channel.json": channel(B), ...release(B, filesOf("new")), "ar/index.html": "the museum's Arabic home page", "api/v1/meta/counts.json": "{}" });
  const missing = await ask(bucket, "/nothing/here.js");
  assert.equal(missing.status, 404);
  assert.equal(await missing.text(), "<p>404</p>");
  assert.equal(missing.headers.get("cache-control"), "no-store");
  for (const path of ["/../ar/index.html", "/..%2f..%2far/index.html", "/.env", "//ar/index.html", "/a b"]) {
    const response = await ask(bucket, path);
    assert.equal(response.status, 404, path);
    assert.notEqual(await response.text(), "the museum's Arabic home page");
  }
  assert.ok(bucket.reads.every((key) => key.startsWith("games/")), bucket.reads.join(", "));
});

test("answers 304 to a matching ETag, nothing but headers to HEAD, and 405 to anything that writes", async () => {
  const bucket = memoryBucket({ "games/channel.json": channel(B), ...release(B, filesOf("new")) });
  const first = await ask(bucket, "/assets/granada-new.js");
  const again = await ask(bucket, "/assets/granada-new.js", { headers: { "if-none-match": first.headers.get("etag") } });
  assert.equal(again.status, 304);
  assert.equal(await again.text(), "");
  const head = await ask(bucket, "/granada/", { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
  for (const method of ["POST", "PUT", "DELETE", "PATCH"]) {
    const refused = await ask(bucket, "/granada/", { method });
    assert.equal(refused.status, 405, method);
    assert.equal(refused.headers.get("allow"), "GET, HEAD");
  }
});

test("with nothing released it says so, and a damaged pointer never replaces a good one", async () => {
  const empty = memoryBucket({});
  const none = await ask(empty, "/granada/");
  assert.equal(none.status, 503);
  assert.equal(none.headers.get("retry-after"), "60");
  assert.ok(none.headers.get("content-security-policy"));

  forgetChannel();
  const bucket = memoryBucket({ "games/channel.json": channel(B), ...release(B, filesOf("new")) });
  assert.equal((await ask(bucket, "/granada/")).status, 200);
  // The pointer is damaged, then the bucket fails altogether: the release already known keeps being served.
  bucket.objects["games/channel.json"] = '{"format":"im.play.channel","version":1,"current":"../../ar"}';
  const realNow = Date.now;
  try {
    Date.now = () => realNow() + 60_000;
    assert.equal(await (await ask(bucket, "/granada/")).text(), "<title>Granada new</title>");
  } finally {
    Date.now = realNow;
  }
});

test("a release goes live when the pointer changes, and rolls back the same way", async () => {
  const bucket = memoryBucket({ "games/channel.json": channel(A), ...release(A, filesOf("old")), ...release(B, filesOf("new")) });
  assert.equal(await (await ask(bucket, "/granada/")).text(), "<title>Granada old</title>");
  bucket.objects["games/channel.json"] = channel(B, A);
  // Within the pointer's lifetime a running copy still serves what it knew.
  assert.equal(await (await ask(bucket, "/granada/")).text(), "<title>Granada old</title>");
  const realNow = Date.now;
  try {
    Date.now = () => realNow() + 31_000;
    assert.equal(await (await ask(bucket, "/granada/")).text(), "<title>Granada new</title>");
    assert.deepEqual(JSON.parse(await (await ask(bucket, "/_channel")).text()).previous, A);
    bucket.objects["games/channel.json"] = channel(A, B);
    Date.now = () => realNow() + 62_000;
    assert.equal(await (await ask(bucket, "/granada/")).text(), "<title>Granada old</title>");
  } finally {
    Date.now = realNow;
  }
});

test("UAT and production both tell robots to stay out while every game is a prototype", async () => {
  const bucket = memoryBucket({ "games/channel.json": channel(B), ...release(B, filesOf("new")) });
  const robots = await ask(bucket, "/robots.txt", {}, { ROBOTS: "disallow" });
  assert.equal(await robots.text(), "User-agent: *\nDisallow: /\n");
  const allowed = await ask(bucket, "/granada/", {}, { ROBOTS: "allow" });
  assert.equal(allowed.headers.get("x-robots-tag"), null);
  const music = await ask(bucket, "/granada/", {}, { MUSIC_ORIGIN: "https://media.islam.museum" });
  assert.ok(music.headers.get("content-security-policy").includes("media-src 'self' https://media.islam.museum"));
});
