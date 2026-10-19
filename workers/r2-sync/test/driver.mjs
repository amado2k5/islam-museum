// Driver for the R2 sync test. It runs outside the Worker and does the work
// that the batch side would do:
//   1. list the git-tracked files under the given folders and hash them
//   2. export the whole remote collection from the Worker as zip parts
//   3. extract locally and compare by SHA-256
//   4. send a delete list and zip parts of new or changed files to /apply
//   5. export again and check the remote now equals the local collection
// Exit code 0 only if the final check passes.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { zipSync, unzipSync } from "fflate";

const PART_BYTES = 20 * 1024 * 1024;
const REMOTE_PREFIX = "sync-test/repo/";
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, all) => {
    if (cur.startsWith("--")) acc.push([cur.slice(2), all[i + 1]]);
    return acc;
  }, []),
);
const url = args.url;
const token = args.token;
const folders = (args.folders ?? "data,content/en").split(",").map((f) => f.trim());
if (!url || !token) {
  console.error("usage: driver.mjs --url <worker url> --token <token> [--folders a,b]");
  process.exit(2);
}

const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const log = (msg) => console.log(`[r2-sync-test] ${msg}`);
const auth = { authorization: `Bearer ${token}` };

// 1. Local collection from git
const tracked = execFileSync("git", ["ls-files", "--", ...folders], {
  cwd: repoRoot,
  encoding: "utf8",
  maxBuffer: 256 * 1024 * 1024,
})
  .split("\n")
  .filter(Boolean);
const local = new Map();
for (const rel of tracked) {
  const bytes = readFileSync(resolve(repoRoot, rel));
  local.set(rel, { sha: sha(bytes), bytes });
}
log(`local: ${local.size} files from git under ${folders.join(", ")}`);

// 2. Export the whole remote collection
async function exportAll() {
  const remote = new Map();
  let after = "";
  let parts = 0;
  while (true) {
    const q = new URLSearchParams({ prefix: REMOTE_PREFIX, after });
    const res = await fetch(`${url}/export?${q}`, { headers: auth });
    if (!res.ok) throw new Error(`export failed: ${res.status} ${await res.text()}`);
    const entries = unzipSync(new Uint8Array(await res.arrayBuffer()));
    for (const [name, data] of Object.entries(entries)) remote.set(name, sha(data));
    parts += 1;
    if (res.headers.get("x-done") === "true") break;
    after = res.headers.get("x-next-after") ?? "";
  }
  return { remote, parts };
}

const first = await exportAll();
log(`remote before: ${first.remote.size} files in ${first.parts} export part(s)`);

// 3. Compare
const toUpload = [...local.keys()].filter((k) => first.remote.get(k) !== local.get(k).sha);
const toDelete = [...first.remote.keys()].filter((k) => !local.has(k));
log(`diff: ${toUpload.length} to upload or replace, ${toDelete.length} to delete`);

// 4. Send deletes, then zipped parts of new or changed files
async function apply(entries) {
  const res = await fetch(`${url}/apply?prefix=${encodeURIComponent(REMOTE_PREFIX)}`, {
    method: "POST",
    headers: { ...auth, "content-type": "application/zip" },
    body: zipSync(entries, { level: 0 }),
  });
  if (!res.ok) throw new Error(`apply failed: ${res.status} ${await res.text()}`);
  return res.json();
}

if (toDelete.length) {
  const r = await apply({ "__delete.json": new TextEncoder().encode(JSON.stringify(toDelete)) });
  log(`deleted ${r.deleted} remote files`);
}

let batch = {};
let batchBytes = 0;
let parts = 0;
let written = 0;
async function flush() {
  if (!Object.keys(batch).length) return;
  parts += 1;
  written += (await apply(batch)).written;
  batch = {};
  batchBytes = 0;
}
for (const k of toUpload) {
  const { bytes } = local.get(k);
  if (batchBytes > 0 && batchBytes + bytes.byteLength > PART_BYTES) await flush();
  batch[k] = bytes;
  batchBytes += bytes.byteLength;
}
await flush();
log(`uploaded ${written} files in ${parts} apply part(s)`);

// 5. Verify
const after = await exportAll();
const mismatches = [];
for (const [k, v] of local) if (after.remote.get(k) !== v.sha) mismatches.push(`differs: ${k}`);
for (const k of after.remote.keys()) if (!local.has(k)) mismatches.push(`extra: ${k}`);

if (mismatches.length) {
  console.error(`[r2-sync-test] FAIL: ${mismatches.length} mismatch(es)`);
  for (const m of mismatches.slice(0, 50)) console.error(`  ${m}`);
  process.exit(1);
}
log(`PASS: remote matches git exactly (${after.remote.size} files, ${after.parts} export part(s))`);
