// A rehearsal of a whole release cycle: publish a release, publish a second, roll back, with the publisher's real
// code, a stand-in for the AWS CLI (fake-aws.mjs) and a folder for the bucket; then the Worker's real code serves
// that folder. It proves the steps fit together. It does not prove anything about R2 itself.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import worker, { forgetChannel } from "../src/index.js";
import { folderBucket } from "./fake-bucket.mjs";

const publisher = fileURLToPath(new URL("../publish.mjs", import.meta.url));
const work = mkdtempSync(join(tmpdir(), "im-games-e2e-"));
const bucketDir = join(work, "bucket");
const bin = join(work, "bin");
mkdirSync(bucketDir);
mkdirSync(bin);
cpSync(fileURLToPath(new URL("./fake-aws.mjs", import.meta.url)), join(bin, "aws"));
chmodSync(join(bin, "aws"), 0o755);
const env = { ...process.env, PATH: `${bin}:${process.env.PATH}`, FAKE_S3_ROOT: bucketDir, FAKE_S3_BUCKET: "test-bucket", FAKE_S3_LOG: join(work, "aws.log"), GITHUB_OUTPUT: "" };
const publish = (...args) => spawnSync("node", [publisher, ...args, "--bucket", "test-bucket", "--endpoint", "https://example.invalid"], { env, encoding: "utf8" });

/** A small release folder with a correct manifest, as the build makes it. */
function makeRelease(name, commit, date, text) {
  const dir = join(work, name);
  mkdirSync(join(dir, "granada"), { recursive: true });
  mkdirSync(join(dir, "assets"));
  const files = { "index.html": '<a href="https://islam.museum/">islam.museum</a>', "404.html": "<p>404</p>", "granada/index.html": `<title>${text}</title><script type="module" src="../assets/granada-${name}.js"></script>`, [`assets/granada-${name}.js`]: `console.log("${text}")` };
  const listed = [];
  for (const [path, body] of Object.entries(files)) {
    writeFileSync(join(dir, path), body);
    listed.push({ path, bytes: Buffer.byteLength(body), sha256: createHash("sha256").update(body).digest("hex") });
  }
  listed.sort((a, b) => (a.path < b.path ? -1 : 1));
  const manifest = { format: "im.play.release", version: 1, commit, commitDate: date, dirty: false, musicBase: "off", games: [{ id: "granada", status: "prototype", page: "granada/" }], totalBytes: listed.reduce((n, f) => n + f.bytes, 0), files: listed };
  writeFileSync(join(dir, "release.json"), `${JSON.stringify(manifest, null, 1)}\n`);
  return dir;
}
const first = makeRelease("one", "0123456789abcdef0123456789abcdef01234567", "2026-11-24T10:00:00Z", "first");
const second = makeRelease("two", "a707db02d7fe3919a07fa35d7541ea99e3ff065a", "2026-11-25T10:00:00Z", "second");
const A = "20261124-0123456789a";
const B = "20261125-a707db02d7f";
const pointer = () => JSON.parse(readFileSync(join(bucketDir, "games/channel.json"), "utf8"));
const page = async () => {
  forgetChannel();
  return (await worker.fetch(new Request("https://games.islam.museum/granada/"), { GAMES_BUCKET: folderBucket(bucketDir) })).text();
};

test("a dry run writes nothing", () => {
  const out = publish("release", "--release", first, "--dry-run");
  assert.equal(out.status, 0, out.stderr);
  assert.match(out.stdout, /nothing has been released/);
  assert.match(out.stdout, /would upload 4 files/);
  assert.match(out.stdout, new RegExp(`would make ${A} live`));
  assert.deepEqual(readdirSync(bucketDir), []);
});

test("the first release is uploaded, read back, checked, and only then made live", async () => {
  const out = publish("release", "--release", first, "--run", "11");
  assert.equal(out.status, 0, out.stderr + out.stdout);
  assert.match(out.stdout, /the bucket's copy of 20261124-0123456789a matches its manifest/);
  assert.deepEqual(pointer(), { format: "im.play.channel", version: 1, current: A, previous: null, commit: "0123456789abcdef0123456789abcdef01234567", updatedAt: pointer().updatedAt, run: "11" });
  assert.equal(await page(), '<title>first</title><script type="module" src="../assets/granada-one.js"></script>');
  // The manifest was the last file uploaded, and the pointer was written after everything else.
  const calls = readFileSync(env.FAKE_S3_LOG, "utf8").trim().split("\n").map((l) => JSON.parse(l).join(" "));
  const upload = calls.findIndex((c) => c.includes("--recursive") && c.includes("--exclude release.json") && c.includes(`s3://test-bucket/games/r/${A}/`));
  const manifestUp = calls.findIndex((c) => c.includes(`release.json s3://test-bucket/games/r/${A}/release.json`));
  const pointerUp = calls.findIndex((c) => c.includes("s3://test-bucket/games/channel.json --only-show-errors --content-type"));
  assert.ok(upload >= 0 && upload < manifestUp && manifestUp < pointerUp, calls.join("\n"));
});

test("releasing the same build again uploads nothing and moves nothing", () => {
  const before = readFileSync(join(bucketDir, "games/channel.json"), "utf8");
  const out = publish("release", "--release", first);
  assert.equal(out.status, 0, out.stderr);
  assert.match(out.stdout, /already in the bucket, identical: nothing to upload/);
  assert.match(out.stdout, /already the live release/);
  assert.equal(readFileSync(join(bucketDir, "games/channel.json"), "utf8"), before);
});

test("a second release goes live and the first stays in the bucket, untouched", async () => {
  const out = publish("release", "--release", second, "--run", "12");
  assert.equal(out.status, 0, out.stderr + out.stdout);
  assert.equal(pointer().current, B);
  assert.equal(pointer().previous, A);
  assert.match(await page(), /<title>second<\/title>/);
  assert.ok(existsSync(join(bucketDir, `games/r/${A}/granada/index.html`)));
  // A page of the first release still gets its own script from the release before.
  const old = await worker.fetch(new Request("https://games.islam.museum/assets/granada-one.js"), { GAMES_BUCKET: folderBucket(bucketDir) });
  assert.equal(await old.text(), 'console.log("first")');
});

test("a release whose files do not match its manifest is refused before anything is uploaded", () => {
  const broken = makeRelease("three", "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", "2026-11-26T10:00:00Z", "third");
  writeFileSync(join(broken, "assets/granada-three.js"), "tampered");
  const out = publish("release", "--release", broken);
  assert.notEqual(out.status, 0);
  assert.ok(!existsSync(join(bucketDir, "games/r/20261126-bbbbbbbbbbb")));
  assert.equal(pointer().current, B);
});

test("a release id already in the bucket with other contents is never overwritten", () => {
  const clash = makeRelease("four", "a707db02d7fe3919a07fa35d7541ea99e3ff065a", "2026-11-25T10:00:00Z", "an impostor");
  const out = publish("release", "--release", clash);
  assert.notEqual(out.status, 0);
  assert.match(out.stderr, /never overwritten/);
  assert.match(readFileSync(join(bucketDir, `games/r/${B}/granada/index.html`), "utf8"), /second/);
});

test("rolling back returns to the release before, and status reports it", async () => {
  const out = publish("rollback", "--run", "13");
  assert.equal(out.status, 0, out.stderr);
  assert.equal(pointer().current, A);
  assert.equal(pointer().previous, B);
  assert.match(await page(), /<title>first<\/title>/);
  const status = publish("status");
  assert.match(status.stdout, new RegExp(`live: ${A} \\(before it: ${B}\\)`));
});

test("a damaged pointer stops a release instead of being written over", () => {
  writeFileSync(join(bucketDir, "games/channel.json"), "{ not a pointer");
  const out = publish("release", "--release", second);
  assert.notEqual(out.status, 0);
  assert.match(out.stderr, /not a well-formed pointer/);
  assert.equal(readFileSync(join(bucketDir, "games/channel.json"), "utf8"), "{ not a pointer");
});

test("the music is uploaded only if it is exactly what the manifest records, once, and then served in spans", async () => {
  const dir = join(work, "music");
  mkdirSync(dir);
  const tracks = [["01-fourteen-centuries.m4a", "a".repeat(3000)], ["02-the-ancient-library.m4a", "b".repeat(2000)]];
  for (const [file, body] of tracks) writeFileSync(join(dir, file), body);
  const manifestFile = join(work, "music.json");
  const manifest = { tracks: tracks.map(([file, body]) => ({ file, bytes: body.length, sha256: createHash("sha256").update(body).digest("hex") })) };
  writeFileSync(manifestFile, JSON.stringify(manifest));
  const media = (...extra) => publish("media", "--dir", dir, "--manifest", manifestFile, ...extra);

  const dry = media("--dry-run");
  assert.equal(dry.status, 0, dry.stderr);
  assert.match(dry.stdout, /would upload/);
  assert.ok(!existsSync(join(bucketDir, "games/media")));

  const first = media();
  assert.equal(first.status, 0, first.stderr + first.stdout);
  assert.match(first.stdout, /2 tracks checked against the manifest; 2 uploaded/);
  assert.equal(readFileSync(join(bucketDir, "games/media/music/02-the-ancient-library.m4a"), "utf8"), "b".repeat(2000));
  const again = media();
  assert.match(again.stdout, /already in the bucket, identical/);
  assert.match(again.stdout, /0 uploaded/);

  // The Worker serves it, whole and in spans, from the same folder.
  const span = await worker.fetch(new Request("https://games.islam.museum/media/music/01-fourteen-centuries.m4a", { headers: { range: "bytes=0-9" } }), { GAMES_BUCKET: folderBucket(bucketDir) });
  assert.equal(span.status, 206);
  assert.equal(span.headers.get("content-range"), "bytes 0-9/3000");

  // A file that is not what the manifest records is refused before anything is sent.
  writeFileSync(join(dir, "02-the-ancient-library.m4a"), "something else");
  const wrong = media();
  assert.notEqual(wrong.status, 0);
  assert.match(wrong.stderr, /is not the file the manifest records/);
  assert.equal(readFileSync(join(bucketDir, "games/media/music/02-the-ancient-library.m4a"), "utf8"), "b".repeat(2000));
  // And a track already in the bucket with other contents is never written over.
  writeFileSync(join(dir, "02-the-ancient-library.m4a"), "b".repeat(2000));
  writeFileSync(join(bucketDir, "games/media/music/01-fourteen-centuries.m4a"), "tampered in the bucket");
  const clash = media();
  assert.notEqual(clash.status, 0);
  assert.match(clash.stderr, /not overwritten/);
});

test("no call ever left games/, and none removed anything", () => {
  const calls = readFileSync(env.FAKE_S3_LOG, "utf8").trim().split("\n").map((l) => JSON.parse(l));
  assert.ok(calls.length > 10);
  for (const call of calls) {
    assert.deepEqual(call.slice(0, 2), ["s3", "cp"]);
    for (const a of call.filter((x) => x.startsWith("s3://"))) assert.ok(a.startsWith("s3://test-bucket/games/"), a);
  }
});

test("the models are uploaded only as the art manifest records them, under their own paths, and served for what they are", async () => {
  const dir = join(work, "models-in");
  mkdirSync(dir);
  const files = [["granada/mill.gltf", '{"asset":{"version":"2.0"}}'], ["granada/mill.bin", "\u0000binary"], ["granada/textures/stone_base.jpg", "jpeg bytes"]];
  // As they come from a release's assets: flat names.
  for (const [path, body] of files) writeFileSync(join(dir, path.replaceAll("/", "__")), body);
  const manifestFile = join(work, "art-manifest.json");
  writeFileSync(manifestFile, JSON.stringify({ format: "im.play.art", assets: [{ id: "granada/mill", files: files.map(([path, body]) => ({ path, bytes: Buffer.byteLength(body), sha256: createHash("sha256").update(body).digest("hex") })) }] }));
  const media = (...extra) => publish("media", "--kind", "models", "--dir", dir, "--manifest", manifestFile, ...extra);

  const dry = media("--dry-run");
  assert.equal(dry.status, 0, dry.stderr);
  assert.ok(!existsSync(join(bucketDir, "games/media/models")));

  const first = media();
  assert.equal(first.status, 0, first.stderr + first.stdout);
  assert.match(first.stdout, /3 model files checked against the manifest; 3 uploaded/);
  assert.equal(readFileSync(join(bucketDir, "games/media/models/granada/textures/stone_base.jpg"), "utf8"), "jpeg bytes");
  assert.match(media().stdout, /0 uploaded/);

  // The Worker serves the entry file as a model, beside the releases.
  const entry = await worker.fetch(new Request("https://games.islam.museum/media/models/granada/mill.gltf"), { GAMES_BUCKET: folderBucket(bucketDir) });
  assert.equal(entry.status, 200);
  assert.equal(entry.headers.get("content-type"), "model/gltf+json");
  assert.equal(entry.headers.get("x-content-type-options"), "nosniff");

  // A file changed after the manifest was written is refused, and nothing in the bucket is touched.
  writeFileSync(join(dir, "granada__mill.bin"), "other bytes");
  const wrong = media();
  assert.notEqual(wrong.status, 0);
  assert.match(wrong.stderr, /is not the file the manifest records/);
  assert.equal(readFileSync(join(bucketDir, "games/media/models/granada/mill.bin"), "utf8"), "\u0000binary");
  // The wrong kind for the manifest is refused too.
  assert.notEqual(publish("media", "--dir", dir, "--manifest", manifestFile).status, 0);
});
