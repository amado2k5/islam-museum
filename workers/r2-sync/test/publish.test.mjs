// Unit tests for the pure parts of the publish script.
// Run: node --test workers/r2-sync/test/publish.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { diff, reconcile, applyToPrevious, withRetry, bootstrapPrevious, abortStagingMultipartUploads, loadBatch, rootFiles } from "../batch/publish.mjs";

const dir = mkdtempSync(join(tmpdir(), "publish-test-"));
const file = (text) => {
  const bytes = Buffer.from(text);
  const path = join(dir, createHash("sha256").update(text).digest("hex"));
  writeFileSync(path, bytes);
  return { path, sha: createHash("sha256").update(bytes).digest("hex"), md5: createHash("md5").update(bytes).digest("hex"), cacheControl: "public" };
};
const md5 = (f) => f.md5;

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

test("diff keeps only paths; loadBatch reads the bytes of a batch's copies", () => {
  const a = file("aaa");
  const desired = new Map([["ar/a/index.html", a]]);
  const ops = diff(desired, { "ar/gone/index.html": "x" });
  assert.equal(ops[0].localBytes, undefined);
  const loaded = loadBatch(ops);
  assert.equal(Buffer.from(loaded[0].localBytes).toString(), "aaa");
  assert.deepEqual(loaded[1], { op: "DELETE", dst: "ar/gone/index.html" });
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

test("abortStagingMultipartUploads aborts every listed upload and survives a failing call", () => {
  const calls = [];
  const fake = (args) => {
    calls.push(args[1]);
    if (args[1] === "list-multipart-uploads") return JSON.stringify({ Uploads: [{ Key: "_staging/a.zip", UploadId: "u1" }, { Key: "_staging/b.zip", UploadId: "u2" }] });
    return "";
  };
  assert.equal(abortStagingMultipartUploads(fake), 2);
  assert.deepEqual(calls, ["list-multipart-uploads", "abort-multipart-upload", "abort-multipart-upload"]);
  assert.equal(abortStagingMultipartUploads(() => { throw new Error("AccessDenied"); }), 0);
});


test("rootFiles lists the root data files, including the nested .well-known/api-catalog", () => {
  const root = mkdtempSync(join(tmpdir(), "publish-root-"));
  for (const name of ["sitemap-index.xml", "feed.xml", "favicon.svg", "robots.txt", "404.html"]) writeFileSync(join(root, name), name);
  mkdirSync(join(root, ".well-known"));
  writeFileSync(join(root, ".well-known", "api-catalog"), "{}");
  writeFileSync(join(root, ".well-known", "security.txt"), "x");
  mkdirSync(join(root, "sitemap-dir.xml"));
  assert.deepEqual(rootFiles(root).sort(), [".well-known/api-catalog", "favicon.svg", "feed.xml", "sitemap-index.xml"]);
});

// ---- churn report -------------------------------------------------------------------------------------------------
import { churnGroup, churnReport, estimateCost, formatChurn, shellFilesChanged, SHELL_WARN_SHARE } from "../batch/publish.mjs";

test("churnGroup sorts keys into the report's groups", () => {
  assert.equal(churnGroup("ar/person/x/index.html"), "ar pages");
  assert.equal(churnGroup("ur/books/accessibility.epub"), "ur other");
  assert.equal(churnGroup("en/index.html"), "en other"); // a language home page has two parts: not an entity page
  assert.equal(churnGroup("pagefind-ar/index/ar_1.pf_index"), "pagefind-ar/index");
  assert.equal(churnGroup("pagefind-en/pagefind-entry.json"), "pagefind-en/top");
  assert.equal(churnGroup("api/v1/person/x.json"), "api");
  assert.equal(churnGroup("sitemap-index.xml"), "(root)");
  assert.equal(churnGroup(".well-known/api-catalog"), ".well-known");
});

const buildOf = (keys) => new Map(keys.map((k) => [k, { sha: k }]));

test("churnReport counts copies and deletes per group and the share of pages re-uploaded", () => {
  const keys = ["ar/a/index.html", "ar/b/index.html", "en/a/index.html", "en/b/index.html", "api/v1/a.json", "feed.xml"];
  const ops = [
    { op: "COPY", dst: "ar/a/index.html" }, { op: "COPY", dst: "en/a/index.html" }, { op: "COPY", dst: "feed.xml" },
    { op: "DELETE", dst: "ar/gone/index.html" },
  ];
  const r = churnReport(ops, buildOf(keys));
  assert.equal(r.pageFiles, 4);
  assert.equal(r.pageCopies, 2);
  assert.equal(r.pageShare, 0.5);
  const arPages = r.rows.find((x) => x.group === "ar pages");
  assert.deepEqual([arPages.files, arPages.copies, arPages.deletes], [2, 1, 1]);
  assert.equal(r.rows[0].copies, 1); // sorted by copies
});

test("estimateCost prices a write at the Class A rate", () => {
  const c = estimateCost(180000);
  assert.ok(c.classA > 180000 && c.classA < 190000);
  assert.ok(Math.abs(c.dollars - (c.classA / 1e6) * 4.5) < 1e-9);
  assert.equal(estimateCost(0).classA, 1);
});

test("formatChurn warns when most pages changed and names the shell files", () => {
  const keys = Array.from({ length: 10 }, (_, i) => `ar/p${i}/index.html`);
  const all = keys.map((k) => ({ op: "COPY", dst: k }));
  const report = churnReport(all, buildOf(keys));
  const { text, warning } = formatChurn(report, { copies: 10, deletes: 0, total: 10, prevCommit: "aaaaaaaaaaaa", curCommit: "bbbbbbbbbbbb", shellChanged: ["site/src/layouts/BaseLayout.astro"] });
  assert.match(warning, /100\.0 % of the HTML pages changed/);
  assert.match(warning, /site\/src\/layouts\/BaseLayout\.astro/);
  assert.match(text, /\*\*Warning:\*\*/);
  assert.match(text, /\| ar pages \| 10 \| 10 \| 0 \|/);
});

test("formatChurn stays quiet for a content-only publish", () => {
  const keys = Array.from({ length: 100 }, (_, i) => `ar/p${i}/index.html`);
  const report = churnReport([{ op: "COPY", dst: keys[0] }, { op: "COPY", dst: keys[1] }], buildOf(keys));
  assert.ok(report.pageShare < SHELL_WARN_SHARE);
  const { warning } = formatChurn(report, { copies: 2, deletes: 0, total: 100, prevCommit: null, curCommit: null, shellChanged: [] });
  assert.equal(warning, null);
});

test("formatChurn says so when the shell files could not be listed", () => {
  const keys = ["ar/a/index.html"];
  const report = churnReport([{ op: "COPY", dst: keys[0] }], buildOf(keys));
  const { warning } = formatChurn(report, { copies: 1, deletes: 0, total: 1, prevCommit: null, curCommit: "c", shellChanged: null });
  assert.match(warning, /could not be listed/);
});

test("shellFilesChanged diffs the listed paths between two commits and survives a failing git", () => {
  const calls = [];
  const fake = (cmd, args) => {
    calls.push([cmd, ...args.slice(0, 2)].join(" "));
    return args[0] === "diff" ? "site/src/layouts/BaseLayout.astro\n\nsite/astro.config.mjs\n" : "";
  };
  assert.deepEqual(shellFilesChanged("p1", "c1", fake, ["site/src/layouts"]), ["site/src/layouts/BaseLayout.astro", "site/astro.config.mjs"]);
  assert.deepEqual(calls, ["git fetch --quiet", "git diff --name-only"]);
  assert.equal(shellFilesChanged("p1", "c1", () => { throw new Error("no history"); }, ["x"]), null);
  assert.deepEqual(shellFilesChanged("same", "same", fake, ["x"]), []);
  assert.equal(shellFilesChanged(null, "c1", fake, ["x"]), null);
});
