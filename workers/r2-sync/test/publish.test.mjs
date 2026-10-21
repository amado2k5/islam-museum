// Unit tests for the pure parts of the publish script.
// Run: node --test workers/r2-sync/test/publish.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { diff, reconcile, applyToPrevious, withRetry, bootstrapPrevious } from "../batch/publish.mjs";

const file = (text) => {
  const bytes = Buffer.from(text);
  return { bytes, sha: createHash("sha256").update(bytes).digest("hex"), cacheControl: "public" };
};
const md5 = (f) => createHash("md5").update(f.bytes).digest("hex");

test("diff copies new or changed files and deletes stale ones", () => {
  const desired = new Map([["ar/a/index.html", file("a")], ["ar/b/index.html", file("b")]]);
  const previous = { "ar/a/index.html": desired.get("ar/a/index.html").sha, "ar/b/index.html": "old", "ar/c/index.html": "gone" };
  const ops = diff(desired, previous);
  assert.deepEqual(ops.map((o) => [o.op, o.dst]), [["COPY", "ar/b/index.html"], ["DELETE", "ar/c/index.html"]]);
});

test("reconcile records files already in the bucket so they are not sent again", () => {
  const a = file("a"), b = file("b"), c = file("c");
  const desired = new Map([["ar/a/index.html", a], ["ar/b/index.html", b], ["ar/c/index.html", c]]);
  const previous = {}; // the manifest knows nothing (a run failed part-way)
  const stored = new Map([
    ["ar/a/index.html", md5(a)], // already uploaded by the failed run
    ["ar/b/index.html", "0123456789abcdef0123456789abcdef"], // different bytes
    ["ar/zzz/index.html", md5(a)], // not in the build: left alone here, deleted only if the manifest lists it
  ]);
  assert.equal(reconcile(desired, previous, stored), 1);
  assert.deepEqual(diff(desired, previous).map((o) => [o.op, o.dst]), [["COPY", "ar/b/index.html"], ["COPY", "ar/c/index.html"]]);
});

test("bootstrapPrevious marks stored objects that are not in the build for deletion", () => {
  const a = file("a");
  const desired = new Map([["ar/a/index.html", a]]);
  const previous = bootstrapPrevious(desired, new Map([["ar/a/index.html", md5(a)], ["ar/old/index.html", md5(a)]]));
  assert.deepEqual(diff(desired, previous).map((o) => [o.op, o.dst]), [["DELETE", "ar/old/index.html"]]);
});

test("applyToPrevious records a batch so the next diff skips it", () => {
  const a = file("a");
  const desired = new Map([["ar/a/index.html", a]]);
  const previous = { "ar/gone/index.html": "x" };
  const ops = diff(desired, previous);
  applyToPrevious(previous, ops, desired);
  assert.deepEqual(previous, { "ar/a/index.html": a.sha });
  assert.deepEqual(diff(desired, previous), []);
});

test("withRetry repeats a failing step and gives up after the attempts", async () => {
  let calls = 0;
  const value = await withRetry("x.zip", "upload", () => {
    calls += 1;
    if (calls < 3) throw new Error("internal server error");
    return "ok";
  }, { attempts: 3, pauseMs: 1 });
  assert.equal(value, "ok");
  assert.equal(calls, 3);
  await assert.rejects(
    withRetry("y.zip", "upload", () => { throw new Error("still down"); }, { attempts: 2, pauseMs: 1 }),
    /y\.zip: upload failed on attempt 2 of 2: still down/,
  );
});
