// The rules of releasing and rolling back, without a bucket. Run: node --test workers/games/test/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { nextPointer, releaseIdOf, rollbackPointer } from "../publish.mjs";
import { parseChannel } from "../src/route.js";

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
