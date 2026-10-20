// Publishes the built search indexes and API JSON from dist/ to the production
// R2 bucket through the r2-sync Worker. Only files whose SHA-256 differs from the
// last publish are sent. The last publish is kept in R2 at _r2-sync/manifest.json.
//
// Usage: node workers/r2-sync/batch/publish.mjs --dist dist [--dry-run]
// Env (dry-run needs none): SYNC_URLS (comma-separated Worker URLs, archives are spread
// across them round-robin; SYNC_URL with one URL still works), SYNC_TOKEN, ENDPOINT,
// BUCKET (default islam-museum-search).
//
// The manifest is written only after every archive was applied, so a failed run
// is repeated in full on the next run. Applying an operation twice is harmless.
import { readFileSync, readdirSync, statSync, writeFileSync, mkdtempSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { join, relative, sep } from "node:path";
import { tmpdir } from "node:os";
import { packArchives } from "./pack.mjs";
import { request as httpsRequest } from "node:https";
import { request as httpRequest } from "node:http";

const TARGETS = [
  { dir: "pagefind-ar", prefix: "pagefind-ar", cacheControl: "public, max-age=31536000, immutable" },
  { dir: "pagefind-en", prefix: "pagefind-en", cacheControl: "public, max-age=31536000, immutable" },
  { dir: "pagefind-ur", prefix: "pagefind-ur", cacheControl: "public, max-age=31536000, immutable" },
  { dir: "api", prefix: "api", cacheControl: "public, max-age=3600, stale-while-revalidate=86400" },
];
const MANIFEST_KEY = "_r2-sync/manifest.json";
const STAGING_PREFIX = "_staging/";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, all) => {
    if (cur.startsWith("--")) acc.push([cur.slice(2), all[i + 1] ?? true]);
    return acc;
  }, []),
);
const distRoot = args.dist ?? "dist";
const dryRun = args["dry-run"] === true;
const bucket = process.env.BUCKET ?? "islam-museum-search";
const endpoint = process.env.ENDPOINT;
const log = (msg) => console.log(`[r2-publish] ${msg}`);
const syncUrls = (process.env.SYNC_URLS ?? process.env.SYNC_URL ?? "").split(",").map((u) => u.trim()).filter(Boolean);

const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

// key -> { bytes, sha, cacheControl } for every file the site serves from R2
function desiredFiles() {
  const files = new Map();
  for (const t of TARGETS) {
    const root = join(distRoot, t.dir);
    if (!existsSync(root)) throw new Error(`missing build output: ${root}`);
    for (const full of walk(root)) {
      const rel = relative(root, full).split(sep).join("/");
      const bytes = readFileSync(full);
      files.set(`${t.prefix}/${rel}`, { bytes, sha: sha(bytes), cacheControl: t.cacheControl });
    }
  }
  if (files.size === 0) throw new Error("no files to publish: refusing to delete the whole bucket section");
  return files;
}

// Previous state: key -> sha. A missing manifest means nothing was published yet.
function readPrevious() {
  try {
    const out = execFileSync("aws", ["s3", "cp", `s3://${bucket}/${MANIFEST_KEY}`, "-", "--endpoint-url", endpoint, "--only-show-errors"], {
      encoding: "utf8",
      maxBuffer: 256 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"],
    });
    return JSON.parse(out).files;
  } catch (err) {
    if (/NoSuchKey|404|Not Found/.test(String(err.stderr))) return {};
    throw err;
  }
}

function diff(desired, previous) {
  const ops = [];
  for (const [key, f] of desired) {
    if (previous[key] !== f.sha) ops.push({ op: "COPY", localBytes: f.bytes, dst: key, cacheControl: f.cacheControl });
  }
  for (const key of Object.keys(previous)) {
    if (!desired.has(key)) ops.push({ op: "DELETE", dst: key });
  }
  return ops;
}

function applyArchive(archive, dir, syncUrl) {
  const file = join(dir, archive.name);
  writeFileSync(file, archive.bytes);
  const stagedKey = `${STAGING_PREFIX}${archive.name}`;
  execFileSync("aws", ["s3", "cp", file, `s3://${bucket}/${stagedKey}`, "--endpoint-url", endpoint, "--only-show-errors"], { stdio: "inherit" });
  return postProcess(stagedKey, syncUrl).then(({ status, report }) => {
    if (status !== 200) throw new Error(`${archive.name}: worker answered ${status} ${JSON.stringify(report)}`);
    log(`${archive.name}: ${JSON.stringify(report.summary)}`);
  });
}

// POST /process and wait for the reply. Node's global fetch gives up after 5 minutes
// without response headers, but the Worker answers only when the archive is fully
// applied, which can take longer. node:https/http has no such default timeout.
function postProcess(archive, syncUrl) {
  const url = new URL(`${syncUrl}/process`);
  const body = JSON.stringify({ archive });
  const send = url.protocol === "http:" ? httpRequest : httpsRequest;
  return new Promise((resolve, reject) => {
    const req = send(url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.SYNC_TOKEN}`,
        "content-type": "application/json",
        "content-length": Buffer.byteLength(body),
      },
    }, (res) => {
      let text = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (text += chunk));
      res.on("end", () => {
        let report = {};
        try {
          report = JSON.parse(text);
        } catch {
          report = { raw: text.slice(0, 500) };
        }
        resolve({ status: res.statusCode, report });
      });
      res.on("error", reject);
    });
    req.on("error", reject);
    req.end(body);
  });
}

function clearStaging() {
  execFileSync("aws", ["s3", "rm", `s3://${bucket}/${STAGING_PREFIX}`, "--recursive", "--endpoint-url", endpoint, "--only-show-errors"], { stdio: "inherit" });
  log(`cleared s3://${bucket}/${STAGING_PREFIX}`);
}

async function main() {
  const desired = desiredFiles();
  const previous = dryRun ? {} : readPrevious();
  const ops = diff(desired, previous);
  const copies = ops.filter((o) => o.op === "COPY").length;
  const deletes = ops.length - copies;
  log(`${desired.size} files in dist, ${Object.keys(previous).length} in last publish: ${copies} to copy, ${deletes} to delete`);

  if (dryRun) return;
  // Clear archives left by earlier runs that timed out before the Worker applied them.
  // Runs never overlap (deploy.yml concurrency group "pages"), so nothing in staging is in use.
  clearStaging();
  if (ops.length === 0) {
    log("nothing changed");
    return;
  }

  if (syncUrls.length === 0) throw new Error("SYNC_URLS is not set");
  const dir = mkdtempSync(join(tmpdir(), "r2-publish-"));
  let i = 0;
  for (const archive of packArchives(ops, { namePrefix: `publish-${Date.now()}` })) {
    await applyArchive(archive, dir, syncUrls[i++ % syncUrls.length]);
  }

  const next = { version: 1, files: Object.fromEntries([...desired].map(([key, f]) => [key, f.sha])) };
  const manifestFile = join(dir, "manifest.json");
  writeFileSync(manifestFile, JSON.stringify(next));
  execFileSync("aws", ["s3", "cp", manifestFile, `s3://${bucket}/${MANIFEST_KEY}`, "--endpoint-url", endpoint, "--only-show-errors"], { stdio: "inherit" });
  clearStaging();
  log(`published ${desired.size} files; manifest updated`);
}

main().catch((err) => {
  console.error(`[r2-publish] FAILED: ${err.message}`);
  process.exit(1);
});
