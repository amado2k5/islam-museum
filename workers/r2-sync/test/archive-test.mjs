// Archive-only test of the Worker logic, against an in-memory bucket.
// Run 1: a 101-file archive (100 COPY files + manifest), then the archive is removed.
// Run 2: a 4-file archive (1 new + 2 modified + manifest) with COPY and DELETE ops.
// Run 3: a bad archive (destination outside the allowed prefix) that must be kept.
// Run 4: bucket-root data files (llms.txt, sitemap) pass only when root files are allowed.
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { unzipSync } from "fflate";
import { processArchive } from "../src/index.js";
import { packArchives } from "../batch/pack.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "../../..");
const TARGET = "_sync-test/run1/";
const ALLOWED = ["_sync-test/"];
const ARCHIVE_KEY = "_staging/archive.zip";

// In-memory stand-in for an R2 bucket binding (only what the Worker uses)
function memoryBucket() {
  const objects = new Map();
  return {
    objects,
    async get(key) {
      const data = objects.get(key);
      return data ? { arrayBuffer: async () => data.slice().buffer } : null;
    },
    async put(key, data) {
      objects.set(key, typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data));
    },
    async delete(keys) {
      for (const k of Array.isArray(keys) ? keys : [keys]) objects.delete(k);
    },
  };
}

const sha = (b) => createHash("sha256").update(b).digest("hex");
const failures = [];
const check = (cond, msg) => {
  console.log(`${cond ? "ok  " : "FAIL"} ${msg}`);
  if (!cond) failures.push(msg);
};
const quiet = () => {};

// Run 1: 100 files from git plus manifest, as one archive
const bucket = memoryBucket();
const sampleKeys = execFileSync("bash", ["-c", "git ls-files -- data content/en | awk 'BEGIN{srand(20261019)} {print rand()\"\\t\"$0}' | sort | head -100 | cut -f2"], {
  cwd: repo,
  encoding: "utf8",
}).split("\n").filter(Boolean);
check(sampleKeys.length === 100, `sample has 100 git files (got ${sampleKeys.length})`);

const ops1 = sampleKeys.map((k) => ({
  op: "COPY",
  localBytes: readFileSync(join(repo, k)),
  dst: TARGET + k,
}));
const [arc1] = packArchives(ops1, { namePrefix: "run1" });
check(arc1 && Object.keys(unzipSync(arc1.bytes)).length === 101, "archive 1 holds 100 files and a manifest (101 entries)");
await bucket.put(ARCHIVE_KEY, arc1.bytes);

const r1 = await processArchive({ bucket, archiveKey: ARCHIVE_KEY, allowedPrefixes: ALLOWED, log: quiet });
check(r1.summary.copied === 100 && r1.summary.failed === 0, `run 1: 100 copied, 0 failed (${JSON.stringify(r1.summary)})`);
check(!bucket.objects.has(ARCHIVE_KEY), "run 1: archive deleted after success");
const status1 = JSON.parse(new TextDecoder().decode(bucket.objects.get("_r2-sync/status.json")));
check(status1.state === "done" && status1.done === 100 && status1.total === 100 && status1.copied === 100, `run 1: status written as done (${status1.state}, ${status1.done}/${status1.total})`);
let run1Ok = true;
for (const k of sampleKeys) {
  const want = readFileSync(join(repo, k));
  const got = bucket.objects.get(TARGET + k);
  if (!got || sha(got) !== sha(want)) run1Ok = false;
}
check(run1Ok, "run 1: every target matches its git file byte for byte");
check(r1.folders.length > 0, `run 1: folders created reported (${r1.folders.length})`);

// Run 2: 3 files (1 new, 2 modified) plus manifest. The manifest also deletes one existing key.
const modifiedA = Buffer.from(readFileSync(join(repo, sampleKeys[0])).toString() + "\n<!-- test edit A -->\n");
const modifiedB = Buffer.from(readFileSync(join(repo, sampleKeys[1])).toString() + "\n<!-- test edit B -->\n");
const newKey = "data/test-new-file-for-sync.yaml";
const newBytes = Buffer.from("id: test-new\nlabel:\n  en: Test new file\n");
const deleteKey = TARGET + sampleKeys[2];

const ops2 = [
  { op: "COPY", localBytes: newBytes, dst: TARGET + newKey },
  { op: "COPY", localBytes: modifiedA, dst: TARGET + sampleKeys[0] },
  { op: "COPY", localBytes: modifiedB, dst: TARGET + sampleKeys[1] },
  { op: "DELETE", dst: deleteKey },
];
const [arc2] = packArchives(ops2, { namePrefix: "run2" });
check(arc2 && Object.keys(unzipSync(arc2.bytes)).length === 4, "archive 2 holds 3 files and a manifest (4 entries)");
await bucket.put(ARCHIVE_KEY, arc2.bytes);

const r2 = await processArchive({ bucket, archiveKey: ARCHIVE_KEY, allowedPrefixes: ALLOWED, log: quiet });
check(r2.summary.copied === 3 && r2.summary.deleted === 1 && r2.summary.failed === 0, `run 2: 3 copied, 1 deleted, 0 failed (${JSON.stringify(r2.summary)})`);
check(!bucket.objects.has(ARCHIVE_KEY), "run 2: archive deleted after success");
check(sha(bucket.objects.get(TARGET + newKey)) === sha(newBytes), "run 2: new file written");
check(sha(bucket.objects.get(TARGET + sampleKeys[0])) === sha(modifiedA), "run 2: modified file A overwritten");
check(sha(bucket.objects.get(TARGET + sampleKeys[1])) === sha(modifiedB), "run 2: modified file B overwritten");
check(!bucket.objects.has(deleteKey), "run 2: deleted key removed");

// Run 3: bad archive. The destination is outside the allowed prefix and must fail and be kept.
const bad = packArchives([{ op: "COPY", localBytes: Buffer.from("x"), dst: "api/hijack.json" }], { namePrefix: "bad" })[0];
await bucket.put("_staging/bad.zip", bad.bytes);
const r3 = await processArchive({ bucket, archiveKey: "_staging/bad.zip", allowedPrefixes: ALLOWED, log: quiet });
check(r3.summary.failed === 1 && bucket.objects.has("_staging/bad.zip"), "run 3: bad destination rejected and archive kept");
check(!bucket.objects.has("api/hijack.json"), "run 3: nothing written outside the allowed prefix");

// Run 4: root data files. Refused without allowRootFiles, written with it; other root names stay refused.
const rootOps = [
  { op: "COPY", localBytes: Buffer.from("# llms\n"), dst: "llms.txt" },
  { op: "COPY", localBytes: Buffer.from("<urlset/>"), dst: "sitemap-0.xml" },
];
const rootArc = packArchives(rootOps, { namePrefix: "root" })[0];
await bucket.put("_staging/root.zip", rootArc.bytes);
const r4a = await processArchive({ bucket, archiveKey: "_staging/root.zip", allowedPrefixes: ALLOWED, log: quiet });
check(r4a.summary.failed === 2 && !bucket.objects.has("llms.txt"), "run 4: root files refused when root files are not allowed");
const r4b = await processArchive({ bucket, archiveKey: "_staging/root.zip", allowedPrefixes: ALLOWED, allowRootFiles: true, log: quiet });
check(r4b.summary.copied === 2 && r4b.summary.failed === 0, `run 4: root files written when allowed (${JSON.stringify(r4b.summary)})`);
check(bucket.objects.has("llms.txt") && bucket.objects.has("sitemap-0.xml"), "run 4: llms.txt and sitemap-0.xml stored at the bucket root");
const strayArc = packArchives([{ op: "COPY", localBytes: Buffer.from("x"), dst: "index.html" }], { namePrefix: "stray" })[0];
await bucket.put("_staging/stray.zip", strayArc.bytes);
const r4c = await processArchive({ bucket, archiveKey: "_staging/stray.zip", allowedPrefixes: ALLOWED, allowRootFiles: true, log: quiet });
check(r4c.summary.failed === 1 && !bucket.objects.has("index.html"), "run 4: an unlisted root name is still refused");

console.log(failures.length ? `\n${failures.length} check(s) failed` : "\nall checks passed");
process.exit(failures.length ? 1 : 0);
