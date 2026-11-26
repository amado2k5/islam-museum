// The rules of releasing and rolling back, without a bucket. Run: node --test workers/games/test/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { flatName, modelsToPublish, nextPointer, releaseIdOf, rollbackPointer, tracksToPublish } from "../publish.mjs";
import { createHash } from "node:crypto";
import { parseChannel } from "../src/route.js";
const tracksToPublishSha = (bytes) => createHash("sha256").update(bytes).digest("hex");

const A = "20261124-0123456789a";
const B = "20261125-a707db02d7f";
const NOW = "2026-11-25T21:00:00.000Z";

test("a release is named by its commit's date and hash", () => {
  assert.equal(releaseIdOf({ commit: "a707db02d7fe3919a07fa35d7541ea99e3ff065a", commitDate: "2026-11-25T15:39:32-05:00" }), B);
  for (const bad of [{}, { commit: "unknown", commitDate: "unknown" }, { commit: "a707db02d7f", commitDate: "" }, { commit: "../../ar", commitDate: "2026-11-25" }]) assert.throws(() => releaseIdOf(bad));
});

test("releasing remembers the release before, and releasing the live one again changes nothing", () => {
  const first = nextPointer(null, A, "0123456789a", NOW, "1");
  assert.deepEqual(first, { format: "im.play.channel", version: 1, current: A, previous: null, commit: "0123456789a", updatedAt: NOW, run: "1" });
  const second = nextPointer(first, B, "a707db02d7f", NOW, "2");
  assert.equal(second.current, B);
  assert.equal(second.previous, A);
  assert.equal(nextPointer(second, B, "a707db02d7f", "later"), second);
  assert.throws(() => nextPointer(second, "latest", "x", NOW));
  // What is written is what the Worker reads.
  assert.equal(parseChannel(JSON.stringify(second)).current, B);
});

test("rolling back swaps the two, so rolling back twice returns to where it began", () => {
  const live = nextPointer(nextPointer(null, A, "0123456789a", NOW), B, "a707db02d7f", NOW);
  const back = rollbackPointer(live, NOW, "3");
  assert.equal(back.current, A);
  assert.equal(back.previous, B);
  assert.equal(rollbackPointer(back, NOW).current, B);
  assert.throws(() => rollbackPointer(null, NOW), /nothing has been released/);
  assert.throws(() => rollbackPointer(nextPointer(null, A, "x", NOW), NOW), /no release before it/);
});

test("the publisher has no way to delete, and touches nothing outside games/", () => {
  const source = readFileSync(new URL("../publish.mjs", import.meta.url), "utf8");
  const code = source.split("\n").filter((line) => !line.trim().startsWith("//")).join("\n");
  assert.ok(!/"rm"|"rb"|delete-object|"mv"|"sync"/.test(code), "no command that removes or moves objects");
  assert.ok(code.includes("if (!key.startsWith(PREFIX)) throw"), "every key is checked against the games/ prefix");
  // Every address handed to the AWS CLI goes through that check.
  assert.equal((code.match(/s3:\/\//g) ?? []).length, 1);
});

test("only the tracks the manifest names, byte for byte, can be published as the music", () => {
  const body = Buffer.from("the first light");
  const sha256 = "9b1e9b0a";
  const files = { "/m/03-the-first-light.m4a": body };
  const read = (p) => files[p];
  const exists = (p) => p in files;
  const real = { tracks: [{ file: "03-the-first-light.m4a", bytes: body.length, sha256: "" }] };
  real.tracks[0].sha256 = tracksToPublishSha(body);
  assert.deepEqual(tracksToPublish(real, "/m", read, exists).map((t) => t.key), ["games/media/music/03-the-first-light.m4a"]);
  assert.throws(() => tracksToPublish({ tracks: [{ file: "03-the-first-light.m4a", bytes: body.length, sha256 }] }, "/m", read, exists), /not the file the manifest records/);
  assert.throws(() => tracksToPublish({ tracks: [{ file: "04-missing.m4a", bytes: 1, sha256 }] }, "/m", read, exists), /is not in/);
  for (const file of ["../../ar/index.html", "x.mp3", "a/b.m4a", ".hidden.m4a", "X.m4a"]) assert.throws(() => tracksToPublish({ tracks: [{ file, bytes: 1, sha256 }] }, "/m", read, exists), /not a track file name/, file);
  assert.throws(() => tracksToPublish({ tracks: [] }, "/m", read, exists), /names no track/);
});

test("only the model files the art manifest names, byte for byte, can be published as models", () => {
  const sha = (b) => createHash("sha256").update(b).digest("hex");
  const gltf = Buffer.from('{"asset":{"version":"2.0"}}');
  const stone = Buffer.from("stone");
  const entry = (path, body) => ({ path, bytes: body.length, sha256: sha(body) });
  const manifest = { format: "im.play.art", assets: [{ id: "granada/mill", files: [entry("granada/mill.gltf", gltf), entry("granada/textures/stone_base.jpg", stone)] }, { id: "granada/house", files: [entry("granada/textures/stone_base.jpg", stone)] }] };
  // Found under their own paths, as on the machine that made them...
  const nested = { "/m/granada/mill.gltf": gltf, "/m/granada/textures/stone_base.jpg": stone };
  const out = modelsToPublish(manifest, "/m", (p) => nested[p], (p) => p in nested);
  assert.deepEqual(out.map((f) => [f.key, f.contentType]), [["games/media/models/granada/mill.gltf", "model/gltf+json"], ["games/media/models/granada/textures/stone_base.jpg", "image/jpeg"]]);
  // ...or under flat names, as in a release's assets. A texture two assets share is published once.
  assert.equal(flatName("granada/textures/stone_base.jpg"), "granada__textures__stone_base.jpg");
  const flat = { "/d/granada__mill.gltf": gltf, "/d/granada__textures__stone_base.jpg": stone };
  assert.equal(modelsToPublish(manifest, "/d", (p) => flat[p], (p) => p in flat).length, 2);
  // Not what the manifest records, missing, or recorded twice with different contents: refused.
  const tampered = { ...nested, "/m/granada/mill.gltf": Buffer.from("something else") };
  assert.throws(() => modelsToPublish(manifest, "/m", (p) => tampered[p], (p) => p in tampered), /not the file the manifest records/);
  assert.throws(() => modelsToPublish(manifest, "/m", () => gltf, () => false), /is not in/);
  const twice = { format: "im.play.art", assets: [{ id: "a", files: [entry("granada/mill.gltf", gltf)] }, { id: "b", files: [entry("granada/mill.gltf", stone)] }] };
  assert.throws(() => modelsToPublish(twice, "/m", (p) => nested[p], (p) => p in nested), /recorded twice/);
  // A path that could leave the models folder, or name some other kind of file, is refused before anything is read.
  for (const path of ["../../ar/index.html", "/etc/passwd.jpg", "granada/../x.jpg", "granada/mill.js", "granada/mill.html", "mill.gltf", "granada__mill.gltf", "granada/Mill.gltf", "granada/.hidden.jpg", "granada//x.jpg"]) {
    assert.throws(() => modelsToPublish({ format: "im.play.art", assets: [{ id: "x", files: [{ path, bytes: 1, sha256: "0" }] }] }, "/m", () => gltf, () => true), /not a model file's path/, path);
  }
  assert.throws(() => modelsToPublish({ format: "im.play.art", assets: [] }, "/m"), /names no asset/);
  assert.throws(() => modelsToPublish({ tracks: [] }, "/m"), /names no asset/);
});
