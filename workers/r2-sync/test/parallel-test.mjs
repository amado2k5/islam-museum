// Parallel upload test against the TEST Worker and the test bucket. Never the production bucket.
// Builds FILES small files, packs them into archives of 500 operations each, stages
// every archive on the test bucket, then posts them to the Worker PARALLEL at a time.
// Checks: every archive applied, the peak number of requests in flight, every file
// present with the right bytes, the status endpoint answers, staging is cleared, and
// the test files are removed afterwards.
// Env: SYNC_URL, SYNC_TOKEN, ENDPOINT, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
//      AWS_DEFAULT_REGION, BUCKET (default islam-museum-sync-test), FILES (5000), PARALLEL (10).
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash, randomBytes } from "node:crypto";
import { packArchives } from "../batch/pack.mjs";

// Real file sizes from a build of this site (test/sizes.txt, one size in bytes per line).
// FILES=all uses every line; a number uses that many, in order.
const sizes = readFileSync(new URL("./sizes.txt", import.meta.url), "utf8").split("\n").filter(Boolean).map(Number);
const FILES = process.env.FILES === undefined || process.env.FILES === "all" ? sizes.length : Math.min(Number(process.env.FILES), sizes.length);
const PARALLEL = Number(process.env.PARALLEL ?? 10);
const bucket = process.env.BUCKET ?? "islam-museum-sync-test";
const endpoint = process.env.ENDPOINT;
const url = process.env.SYNC_URL;
const token = process.env.SYNC_TOKEN;
if (bucket === "islam-museum-search") throw new Error("refusing to run against the production bucket");

const runId = `${Date.now()}-${randomBytes(3).toString("hex")}`;
const PREFIX = `_sync-test/perf/${runId}/`;
const STAGING = "_staging/";
const failures = [];
const check = (ok, msg) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${msg}`);
  if (!ok) failures.push(msg);
};
const aws = (...args) =>
  execFileSync("aws", [...args, "--endpoint-url", endpoint, "--only-show-errors"], { encoding: "utf8", maxBuffer: 512 * 1024 * 1024 });
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");

// 1. Build the operations and pack them into archives
const expected = new Map();
const ops = [];
for (let i = 0; i < FILES; i += 1) {
  const key = `${PREFIX}f${String(i).padStart(5, "0")}.txt`;
  // Each file gets its real size from sizes.txt; the first line identifies the file.
  const header = new TextEncoder().encode(`file ${i} ${runId}\n`);
  const bytes = new Uint8Array(sizes[i]);
  bytes.fill(0x78);
  bytes.set(header.subarray(0, Math.min(header.length, bytes.length)));
  expected.set(key, sha(bytes));
  ops.push({ op: "COPY", localBytes: bytes, dst: key, cacheControl: "public, max-age=60" });
}
const archives = packArchives(ops, { namePrefix: `perf-${runId}` });
const totalBytes = sizes.slice(0, FILES).reduce((n, s) => n + s, 0);
console.log(`test set: ${FILES} files, ${(totalBytes / 1048576).toFixed(1)} MB, real sizes from test/sizes.txt`);
check(archives.length >= Math.ceil(FILES / 500), `${FILES} files packed into ${archives.length} archives of at most 500 operations`);

// 2. Stage every archive on the test bucket
const dir = mkdtempSync(join(tmpdir(), "r2-perf-"));
for (const [n, a] of archives.entries()) {
  const file = join(dir, a.name);
  writeFileSync(file, a.bytes);
  aws("s3", "cp", file, `s3://${bucket}/${STAGING}${a.name}`);
  console.log(`staged ${n + 1}/${archives.length}: ${a.name} (${(a.bytes.byteLength / 1024).toFixed(0)} KB, ${a.ops} operations)`);
}
check(true, `staged ${archives.length} archives under ${STAGING}`);

// 3. Post them to the Worker, PARALLEL at a time
let inflight = 0;
let peak = 0;
const results = [];
const queue = archives.map((a) => a.name);
const MAX_ATTEMPTS = 3;
// One archive: post it, and retry after a connection reset (ECONNRESET) or a
// transient response. A retry re-applies the same archive, which is harmless.
async function postArchive(name) {
  inflight += 1;
  peak = Math.max(peak, inflight);
  try {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      const began = Date.now();
      try {
        const res = await fetch(`${url}/process`, {
          method: "POST",
          headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
          body: JSON.stringify({ archive: `${STAGING}${name}` }),
          signal: AbortSignal.timeout(10 * 60 * 1000),
        });
        const report = await res.json();
        const secs = ((Date.now() - began) / 1000).toFixed(1);
        console.log(`[${name}] attempt ${attempt}: HTTP ${res.status} after ${secs} s: ${JSON.stringify(report.summary ?? report)}`);
        if (res.status === 200 || attempt === MAX_ATTEMPTS) {
          results.push({ name, status: res.status, report, attempts: attempt });
          return;
        }
      } catch (err) {
        const reason = err.cause?.code ?? err.cause?.message ?? err.message;
        const secs = ((Date.now() - began) / 1000).toFixed(1);
        console.log(`[${name}] attempt ${attempt}: NETWORK ERROR after ${secs} s: ${reason}`);
        if (attempt === MAX_ATTEMPTS) {
          results.push({ name, status: "network-error", report: { error: String(reason) }, attempts: attempt });
          return;
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  } finally {
    inflight -= 1;
  }
}
const started = Date.now();
await Promise.all(
  Array.from({ length: PARALLEL }, async () => {
    while (queue.length) await postArchive(queue.shift());
  }),
);
console.log(`posted ${results.length} archives in ${((Date.now() - started) / 1000).toFixed(1)} s`);

// 4. Checks
check(results.length === archives.length, `every archive was posted (${results.length}/${archives.length})`);
check(results.every((r) => r.status === 200), "every archive answered HTTP 200");
check(results.every((r) => r.report.summary?.failed === 0), "no operation failed");
const copied = results.reduce((n, r) => n + (r.report.summary?.copied ?? 0), 0);
check(copied === FILES, `Worker reports ${copied} copies for ${FILES} files`);
check(peak >= Math.min(PARALLEL, archives.length), `at least ${Math.min(PARALLEL, archives.length)} requests were in flight at once (peak ${peak})`);

const listing = aws("s3", "ls", `s3://${bucket}/${PREFIX}`, "--recursive").trim().split("\n").filter(Boolean);
check(listing.length === FILES, `bucket holds ${listing.length} of ${FILES} test files`);

const sample = [...expected.keys()].filter((_, i) => i % 200 === 0);
let sampleOk = 0;
for (const key of sample) {
  const bytes = new TextEncoder().encode(aws("s3", "cp", `s3://${bucket}/${key}`, "-"));
  if (sha(bytes) === expected.get(key)) sampleOk += 1;
}
check(sampleOk === sample.length, `content matches for ${sampleOk}/${sample.length} sampled files`);

const status = await fetch(`${url}/status`, { headers: { authorization: `Bearer ${token}` } });
check(status.status === 200, `GET /status answers HTTP ${status.status}`);

const staged = aws("s3", "ls", `s3://${bucket}/${STAGING}`).split("\n").filter((l) => l.includes(runId));
check(staged.length === 0, `no archives from this run left in ${STAGING} (${staged.length})`);

// 5. Clean up this run's files
aws("s3", "rm", `s3://${bucket}/${PREFIX}`, "--recursive");
console.log(`removed test files under ${PREFIX}`);

if (failures.length) {
  console.log(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log("\nall checks passed");
