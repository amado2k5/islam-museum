// Publishes the built search indexes and API JSON from dist/ to the production
// R2 bucket through the r2-sync Worker. Only files whose SHA-256 differs from the
// last publish are sent. The last publish is kept in R2 at _r2-sync/manifest.json.
//
// Usage: node workers/r2-sync/batch/publish.mjs --dist dist [--dry-run]
// Env (dry-run needs none): SYNC_URL, SYNC_TOKEN, ENDPOINT, BUCKET (default islam-museum-search).
//
// The manifest is written after every batch, so a failed run resumes from the
// batch that failed on the next run. Applying an operation twice is harmless.
import { readFileSync, readdirSync, statSync, writeFileSync, mkdtempSync, existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { join, relative, sep, resolve as resolvePath } from "node:path";
import { tmpdir } from "node:os";
import { packArchives } from "./pack.mjs";
import { request as httpsRequest } from "node:https";
import { request as httpRequest } from "node:http";

const TARGETS = [
  { dir: "pagefind-ar", prefix: "pagefind-ar", cacheControl: "public, max-age=31536000, immutable" },
  { dir: "pagefind-en", prefix: "pagefind-en", cacheControl: "public, max-age=31536000, immutable" },
  { dir: "pagefind-ur", prefix: "pagefind-ur", cacheControl: "public, max-age=31536000, immutable" },
  { dir: "api", prefix: "api", cacheControl: "public, max-age=3600, stale-while-revalidate=86400" },
  // Founder rule (28 Oct 2026): data, content, maps, images and video live on R2, not on Pages. Keep in step with
  // workers/site/src/route.js (R2_DATA_DIRS).
  ...["media", "edu", "timeline-data", "gift-shop", "brand", "openapi"].map((d) => ({ dir: d, prefix: d, cacheControl: "public, max-age=86400, stale-while-revalidate=604800" })),
];
// HTML pages served by workers/site. Off unless PUBLISH_HTML=1, so the default publish is unchanged.
const HTML_TARGETS = [
  { dir: "ar", prefix: "ar", cacheControl: "public, max-age=60, s-maxage=3600" },
  { dir: "en", prefix: "en", cacheControl: "public, max-age=60, s-maxage=3600" },
  { dir: "ur", prefix: "ur", cacheControl: "public, max-age=60, s-maxage=3600" },
];
const activeTargets = process.env.PUBLISH_HTML === "1" ? [...TARGETS, ...HTML_TARGETS] : TARGETS;
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
// SYNC_URLS: comma-separated Worker URLs. Falls back to SYNC_URL (one Worker).
const workerUrls = (process.env.SYNC_URLS ?? process.env.SYNC_URL ?? "").split(",").filter(Boolean);
const parallel = Number(process.env.PARALLEL ?? workerUrls.length * 6);
// Operations per batch. After each batch the publish closes its connections and pauses,
// so the Workers and the runner can release resources. A single run of the full site
// (about 210,000 files) was stopped by the runner partway through.
const BATCH_OPS = Number(process.env.BATCH_OPS ?? 20000);
const BATCH_PAUSE_MS = Number(process.env.BATCH_PAUSE_MS ?? 5000);
const log = (msg) => console.log(`[r2-publish] ${msg}`);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

// key -> { path, sha, md5, cacheControl } for every file the site serves from R2.
// Only the hashes are kept: holding the bytes of the whole site (about 300,000 files)
// ran the runner out of memory, so each batch reads its own files when it is packed.
function desiredFiles() {
  const files = new Map();
  for (const t of activeTargets) {
    const root = join(distRoot, t.dir);
    if (!existsSync(root)) throw new Error(`missing build output: ${root}`);
    for (const full of walk(root)) {
      const rel = relative(root, full).split(sep).join("/");
      const bytes = readFileSync(full);
      files.set(`${t.prefix}/${rel}`, { path: full, sha: sha(bytes), md5: createHash("md5").update(bytes).digest("hex"), cacheControl: t.cacheControl });
    }
  }
  if (files.size === 0) throw new Error("no files to publish: refusing to delete the whole bucket section");
  return files;
}

// Previous state: key -> sha. Returns null when no manifest exists yet.
function readPrevious() {
  try {
    const out = execFileSync("aws", ["s3", "cp", `s3://${bucket}/${MANIFEST_KEY}`, "-", "--endpoint-url", endpoint, "--only-show-errors"], {
      encoding: "utf8",
      maxBuffer: 256 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"],
    });
    return JSON.parse(out).files;
  } catch (err) {
    if (/NoSuchKey|404|Not Found/.test(String(err.stderr))) return null;
    throw err;
  }
}

// key -> ETag for every stored object under the given prefixes.
function listBucket(prefixes) {
  const stored = new Map();
  for (const prefix of prefixes) {
    let token;
    do {
      const args = ["s3api", "list-objects-v2", "--bucket", bucket, "--prefix", `${prefix}/`, "--endpoint-url", endpoint, "--output", "json"];
      if (token) args.push("--continuation-token", token);
      const page = JSON.parse(execFileSync("aws", args, { encoding: "utf8", maxBuffer: 512 * 1024 * 1024 }));
      for (const obj of page.Contents ?? []) stored.set(obj.Key, String(obj.ETag ?? "").replace(/"/g, ""));
      token = page.IsTruncated ? page.NextContinuationToken : undefined;
    } while (token);
  }
  return stored;
}

// A stored object whose ETag equals the MD5 of the local file already holds the build's
// bytes. An ETag is an MD5 only for single-part uploads, which is how the sync Worker
// writes every file; anything else counts as a difference and is simply uploaded again.
const sameBytes = (local, etag) => Boolean(local) && local.md5 === etag;

// Bootstrap when no manifest exists: the bucket already holds the files from an earlier
// publish. Matching objects are recorded as published, so only different or missing files
// are uploaded. Stored objects that are not in the build are recorded with an empty sha,
// so the diff deletes them.
export function bootstrapPrevious(desired, stored = listBucket(activeTargets.map((t) => t.prefix))) {
  const previous = {};
  for (const [key, etag] of stored) previous[key] = sameBytes(desired.get(key), etag) ? desired.get(key).sha : "";
  const matched = Object.values(previous).filter(Boolean).length;
  log(`no manifest yet: ${Object.keys(previous).length} objects in the bucket, ${matched} already match the build`);
  return previous;
}

// A run that failed part-way left files in the bucket that the manifest does not know
// about. Before a large publish, compare the bucket with the build and record every file
// that is already there, so the run resumes instead of re-sending them. Small publishes
// skip the listing: it costs about one request per thousand stored objects.
const RECONCILE_MIN = Number(process.env.RECONCILE_MIN ?? 2000);
export function reconcile(desired, previous, stored) {
  let matched = 0;
  for (const [key, etag] of stored) {
    const local = desired.get(key);
    if (local && previous[key] !== local.sha && sameBytes(local, etag)) {
      previous[key] = local.sha;
      matched += 1;
    }
  }
  return matched;
}

export function diff(desired, previous) {
  const ops = [];
  for (const [key, f] of desired) {
    if (previous[key] !== f.sha) ops.push({ op: "COPY", localPath: f.path, dst: key, cacheControl: f.cacheControl });
  }
  for (const key of Object.keys(previous)) {
    if (!desired.has(key)) ops.push({ op: "DELETE", dst: key });
  }
  return ops;
}

// Reads the bytes of a batch's COPY operations, just before the batch is packed.
export function loadBatch(batchOps) {
  return batchOps.map((op) => (op.op === "COPY" ? { ...op, localBytes: readFileSync(op.localPath) } : op));
}

// Node's AggregateError (from a failed connect across several addresses) has an empty
// message, so take the error code, or the codes of its inner errors, instead.
function describeError(err) {
  if (err?.code) return err.code;
  if (Array.isArray(err?.errors) && err.errors.length) return `${err.name} [${err.errors.map(describeError).join(", ")}]`;
  return err?.message || err?.name || String(err);
}

async function applyArchive(archive, dir, workerUrl, progress) {
  const started = Date.now();
  const file = join(dir, archive.name);
  writeFileSync(file, archive.bytes);
  const stagedKey = `${STAGING_PREFIX}${archive.name}`;
  try {
    await withRetry(archive.name, "staging upload", () => {
      execFileSync("aws", ["s3", "cp", file, `s3://${bucket}/${stagedKey}`, "--endpoint-url", endpoint, "--only-show-errors"], { stdio: "inherit" });
    });
  } finally {
    // The Worker reads the staged copy, so the local zip is not needed once it is uploaded.
    rmSync(file, { force: true });
  }
  // Retries below resend only the staged key; drop the archive's bytes now.
  archive.bytes = null;
  const { status, report } = await postWithRetry(workerUrl, stagedKey, archive.name);
  if (status !== 200) throw new Error(`${archive.name}: worker answered ${status} ${JSON.stringify(report)}`);
  log(`${progress} ${archive.name} via ${workerUrl} in ${Date.now() - started} ms: ${JSON.stringify(report.summary)}`);
}

// A connection can time out or reset before the Worker answers. Retrying the same archive
// is safe: operations are idempotent, and a retry that finds the archive already deleted
// means an earlier attempt applied it.
const ATTEMPTS = 5;

// Runs fn up to ATTEMPTS times with a growing pause. The S3 endpoint answers a burst of
// "internal server error" now and then; a staging upload that fails is simply repeated.
export async function withRetry(name, what, fn, { attempts = ATTEMPTS, pauseMs = 5000 } = {}) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= attempts) throw new Error(`${name}: ${what} failed on attempt ${attempt} of ${attempts}: ${describeError(err)}`, { cause: err });
      log(`${name}: ${what} attempt ${attempt} of ${attempts} failed (${describeError(err)}); retrying in ${(pauseMs * attempt) / 1000} s`);
      await sleep(pauseMs * attempt);
    }
  }
}

async function postWithRetry(workerUrl, stagedKey, name) {
  for (let attempt = 1; ; attempt += 1) {
    const started = Date.now();
    try {
      const result = await postProcess(workerUrl, stagedKey);
      // A 5xx reply means the Worker or the edge failed, not the archive: retry it like a
      // dropped connection. A 207 means some operations failed (e.g. a transient R2
      // "internal error 10001"); the Worker keeps the archive staged in that case, so
      // re-sending it re-applies the idempotent operations. A 4xx reply is final and is
      // reported by applyArchive.
      if (result.status >= 500 || result.status === 207) throw new Error(`worker answered ${result.status} ${JSON.stringify(result.report)}`);
      if (attempt > 1 && result.status === 400 && /archive not found/.test(JSON.stringify(result.report))) {
        log(`${name}: already applied by an earlier attempt`);
        return { status: 200, report: { summary: { already_applied: true } } };
      }
      return result;
    } catch (err) {
      const reason = `${describeError(err)} after ${Date.now() - started} ms`;
      if (attempt >= ATTEMPTS) {
        throw new Error(`${name} via ${workerUrl} failed on attempt ${attempt} of ${ATTEMPTS}: ${reason}`, { cause: err });
      }
      log(`${name}: attempt ${attempt} of ${ATTEMPTS} via ${workerUrl} failed (${reason}); retrying in ${5 * attempt} s`);
      await new Promise((resolve) => setTimeout(resolve, 5000 * attempt));
    }
  }
}

// A Worker that cannot be reached fails the TCP connect after the OS default (about a
// minute per address). Fail faster than that so the retry can try again.
const CONNECT_TIMEOUT_MS = 20000;

// POST /process and wait for the reply. Node's global fetch gives up after 5 minutes
// without response headers, but the Worker answers only when the archive is fully
// applied, which can take longer. node:https/http has no such default timeout, so only
// the connect phase is bounded here.
function postProcess(workerUrl, archive) {
  const url = new URL(`${workerUrl}/process`);
  const body = JSON.stringify({ archive });
  const send = url.protocol === "http:" ? httpRequest : httpsRequest;
  return new Promise((resolve, reject) => {
    const req = send(url, {
      method: "POST",
      // agent: false opens a new connection per request and closes it after the reply,
      // so no idle sockets stay open between batches.
      agent: false,
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
    req.on("socket", (socket) => {
      const timer = setTimeout(() => {
        const err = new Error(`no TCP connection within ${CONNECT_TIMEOUT_MS} ms`);
        err.code = "ECONNECT_TIMEOUT";
        req.destroy(err);
      }, CONNECT_TIMEOUT_MS);
      socket.once("connect", () => clearTimeout(timer));
      socket.once("close", () => clearTimeout(timer));
    });
    req.on("error", reject);
    req.end(body);
  });
}

function clearStaging() {
  execFileSync("aws", ["s3", "rm", `s3://${bucket}/${STAGING_PREFIX}`, "--recursive", "--endpoint-url", endpoint, "--only-show-errors"], { stdio: "inherit" });
  log(`cleared s3://${bucket}/${STAGING_PREFIX}`);
  abortStagingMultipartUploads();
}

// A staging upload that dies part-way (the S3 endpoint's "internal server error" burst
// of 21 October 2026) leaves an incomplete multipart upload behind. It is not an
// object, so "s3 rm" never touches it, and R2 keeps charging for its parts until it is
// aborted. Listing or aborting may itself fail; that must not fail the publish.
export function abortStagingMultipartUploads(run = (args) => execFileSync("aws", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] })) {
  let aborted = 0;
  try {
    const out = run(["s3api", "list-multipart-uploads", "--bucket", bucket, "--prefix", STAGING_PREFIX, "--endpoint-url", endpoint, "--output", "json"]);
    const uploads = out.trim() ? JSON.parse(out).Uploads ?? [] : [];
    for (const u of uploads) {
      run(["s3api", "abort-multipart-upload", "--bucket", bucket, "--key", u.Key, "--upload-id", u.UploadId, "--endpoint-url", endpoint]);
      aborted += 1;
    }
    log(`aborted ${aborted} incomplete multipart upload(s) in ${STAGING_PREFIX}`);
  } catch (err) {
    log(`could not abort incomplete multipart uploads in ${STAGING_PREFIX} (${describeError(err)}); ${aborted} aborted so far`);
  }
  return aborted;
}

async function main() {
  const desired = desiredFiles();
  // The manifest is the record of what is published. Without one, a publish would
  // upload everything, so that case needs an explicit one-time --seed run.
  const stored = dryRun ? {} : readPrevious();
  const seeding = process.argv.includes("--seed");
  if (!dryRun && stored === null && !seeding) {
    throw new Error("no manifest in the bucket: run once with --seed to record the files already published");
  }
  const previous = stored ?? (dryRun ? {} : bootstrapPrevious(desired));
  let ops = diff(desired, previous);
  let copies = ops.filter((o) => o.op === "COPY").length;
  if (!dryRun && stored !== null && copies >= RECONCILE_MIN) {
    const prefixes = [...new Set(ops.filter((o) => o.op === "COPY").map((o) => o.dst.split("/")[0]))];
    const matched = reconcile(desired, previous, listBucket(prefixes));
    log(`reconciled with the bucket: ${matched} of ${copies} files to copy are already there (skipped)`);
    ops = diff(desired, previous);
    copies = ops.filter((o) => o.op === "COPY").length;
  }
  const deletes = ops.length - copies;
  log(`${desired.size} files in dist, ${Object.keys(previous).length} in last publish: ${copies} to copy, ${deletes} to delete`);

  if (dryRun) return;
  // Archives left in staging by a failed run are not touched here: nothing is deleted
  // before the resume, and the cleanup happens only after a successful publish below.
  // Archive names carry the run's timestamp, so old ones never clash with new ones.
  if (ops.length === 0) {
    log("nothing changed");
    clearStaging();
    return;
  }

  // Archives go to the Workers in SYNC_URLS in turn, PARALLEL at a time.
  // PARALLEL defaults to six per Worker: each Worker invocation can hold six R2 connections.
  // Operations are published in batches of BATCH_OPS. Each batch is packed into archives
  // only when it starts, so memory holds one batch of archives at a time.
  // Archives go to the Workers in SYNC_URLS in turn, PARALLEL at a time.
  // PARALLEL defaults to six per Worker: each Worker invocation can hold six R2 connections.
  const dir = mkdtempSync(join(tmpdir(), "r2-publish-"));
  const stamp = Date.now();
  const batches = Math.ceil(ops.length / BATCH_OPS);
  let applied = 0;
  for (let b = 0; b < batches; b += 1) {
    const batchOps = ops.slice(b * BATCH_OPS, (b + 1) * BATCH_OPS);
    const archives = packArchives(loadBatch(batchOps), { namePrefix: `publish-${stamp}-b${b}` });
    const total = archives.length;
    let nextArchive = 0;
    log(`batch ${b + 1}/${batches}: ${batchOps.length} operations in ${total} archives, ${parallel} in parallel across ${workerUrls.length} workers`);
    const runner = async () => {
      while (nextArchive < archives.length) {
        const i = nextArchive;
        nextArchive += 1;
        const progress = `[batch ${b + 1}/${batches} ${i + 1}/${total}]`;
        try {
          await applyArchive(archives[i], dir, workerUrls[i % workerUrls.length], progress);
        } catch (err) {
          // Other archives may still be in flight, so say how far the run got before rethrowing.
          log(`${progress} ${archives[i].name} failed; ${applied} archives applied so far in this run`);
          throw err;
        }
        applied += 1;
      }
    };
    await Promise.all(Array.from({ length: Math.min(parallel, archives.length) }, runner));
    // Record this batch, so a failure in a later batch does not send it again.
    applyToPrevious(previous, batchOps, desired);
    writeManifest(dir, previous, b + 1 < batches);
    if (b + 1 < batches) {
      log(`batch ${b + 1}/${batches} applied and recorded; pausing ${BATCH_PAUSE_MS / 1000}s before the next batch`);
      await sleep(BATCH_PAUSE_MS);
    }
  }

  // Only now: every archive of this run and of any earlier failed run is either applied
  // or superseded, so staging can be emptied.
  clearStaging();
  log(`published ${desired.size} files; manifest updated`);
}

// Updates the record of the bucket with the operations of an applied batch.
export function applyToPrevious(previous, batchOps, desired) {
  for (const op of batchOps) {
    if (op.op === "COPY") previous[op.dst] = desired.get(op.dst).sha;
    else delete previous[op.dst];
  }
  return previous;
}

// commit: the build this manifest describes, recorded for tracing (null outside CI).
// partial: true while later batches of the same run are still to come.
function writeManifest(dir, files, partial) {
  const next = { version: 1, commit: process.env.GITHUB_SHA ?? null, partial, files };
  const manifestFile = join(dir, "manifest.json");
  writeFileSync(manifestFile, JSON.stringify(next));
  execFileSync("aws", ["s3", "cp", manifestFile, `s3://${bucket}/${MANIFEST_KEY}`, "--endpoint-url", endpoint, "--only-show-errors"], { stdio: "inherit" });
}

const isMain = process.argv[1] && resolvePath(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) main().catch((err) => {
  // Print everything we can: some errors have an empty message, and the cause and the
  // command's stderr are often where the real reason is.
  const detail = [err?.stack ?? String(err)];
  if (err?.cause) detail.push(`cause: ${describeError(err.cause)}`, `cause stack: ${err.cause?.stack ?? "(none)"}`);
  if (err?.stderr) detail.push(`stderr: ${String(err.stderr).trim()}`);
  const message = err?.message || describeError(err);
  console.error(`[r2-publish] FAILED: ${message}\n${detail.join("\n")}`);
  // Shows the failure in the job summary and on the run page, not only in the raw log.
  console.log(`::error title=R2 publish failed::${message.replace(/\r?\n/g, " ")}`);
  console.log("[r2-publish] the next run resumes: batches already recorded in the manifest are not sent again, and files found in the bucket are skipped");
  process.exit(1);
});
