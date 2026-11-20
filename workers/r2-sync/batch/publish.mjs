// Publishes the built search indexes and API JSON from dist/ to the production
// R2 bucket through the r2-sync Worker. Only files whose SHA-256 differs from the
// last publish are sent. The last publish is kept in R2 at _r2-sync/manifest.json.
//
// Usage: node workers/r2-sync/batch/publish.mjs --dist dist [--dry-run]
// Env (dry-run needs none): SYNC_URL, SYNC_TOKEN, ENDPOINT, BUCKET (default islam-museum-search).
//
// The manifest is written after every batch, so a failed run resumes from the
// batch that failed on the next run. Applying an operation twice is harmless.
import { readFileSync, readdirSync, statSync, writeFileSync, mkdtempSync, existsSync, rmSync, appendFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { execFileSync, spawn } from "node:child_process";
import { join, relative, sep, resolve as resolvePath } from "node:path";
import { tmpdir } from "node:os";
import { packArchives } from "./pack.mjs";
import { contentType } from "../src/index.js";
import { shellPaths } from "../../../tools/deploy/shell-paths.mjs";
import { request as httpsRequest } from "node:https";
import { request as httpRequest } from "node:http";

const TARGETS = [
  { dir: "pagefind-ar", prefix: "pagefind-ar", cacheControl: "public, max-age=31536000, immutable" },
  { dir: "pagefind-en", prefix: "pagefind-en", cacheControl: "public, max-age=31536000, immutable" },
  { dir: "pagefind-ur", prefix: "pagefind-ur", cacheControl: "public, max-age=31536000, immutable" },
  { dir: "pagefind-fr", prefix: "pagefind-fr", cacheControl: "public, max-age=31536000, immutable" },
  { dir: "pagefind-es", prefix: "pagefind-es", cacheControl: "public, max-age=31536000, immutable" },
  { dir: "api", prefix: "api", cacheControl: "public, max-age=3600, stale-while-revalidate=86400" },
  // Founder rule (28 Oct 2026): data, content, maps, images and video live on R2, not on Pages. Keep in step with
  // workers/site/src/route.js (R2_DATA_DIRS).
  ...["media", "edu", "timeline-data", "gift-shop", "brand", "openapi", "podcast"].map((d) => ({ dir: d, prefix: d, cacheControl: "public, max-age=86400, stale-while-revalidate=604800" })),
];
// Data files at the dist root (sitemaps, feed, llms.txt, search synonyms, favicons), published under their own
// names. Keep in step with R2_ROOT_FILES in workers/site/src/route.js and ROOT_FILES in ../src/index.js.
const ROOT_FILES = [/^sitemap[\w-]*\.xml$/, /^feed\.xml$/, /^llms(-full)?\.txt$/, /^search-synonyms\.\w+\.json$/, /^favicon[\w-]*\.(png|svg|ico)$/, /^apple-touch-icon\.png$/, /^\.well-known\/api-catalog$/];
const ROOT_CACHE = "public, max-age=3600, stale-while-revalidate=86400";
// HTML pages served by workers/site. Off unless PUBLISH_HTML=1, so the default publish is unchanged.
const HTML_TARGETS = [
  { dir: "ar", prefix: "ar", cacheControl: "public, max-age=60, s-maxage=3600" },
  { dir: "en", prefix: "en", cacheControl: "public, max-age=60, s-maxage=3600" },
  { dir: "ur", prefix: "ur", cacheControl: "public, max-age=60, s-maxage=3600" },
  { dir: "fr", prefix: "fr", cacheControl: "public, max-age=60, s-maxage=3600" },
  { dir: "es", prefix: "es", cacheControl: "public, max-age=60, s-maxage=3600" },
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
// One language (deploy-lang-env.yml, docs/engineering/06-deployment.md section 9): `--only-lang es` publishes that
// language's pages (es/) and search index (pagefind-es/) and nothing else. The diff is taken against that language's
// part of the manifest only, so no file of another language, of the API or of the shared data is copied or deleted,
// and the rest of the manifest is written back as it was. Put it before --dry-run on the command line.
const onlyLang = typeof args["only-lang"] === "string" ? args["only-lang"] : null;
if (onlyLang && !HTML_TARGETS.some((t) => t.dir === onlyLang)) throw new Error(`--only-lang ${onlyLang}: not a language of the site (${HTML_TARGETS.map((t) => t.dir).join(", ")})`);
/** The R2 prefixes one language owns: its pages and its search index. */
export const langPrefixes = (lang) => [lang, `pagefind-${lang}`];
// The shared parts (deploy-shared-env.yml, same section): `--only-shared` publishes everything that belongs to no
// language (the API, the shared data folders and the root files) and nothing under any language's two prefixes. It is
// the other half of --only-lang: the five language publishes and the shared one together cover the whole record.
// Sitemaps list every language's pages; a shared build that could not make them (not every language was built in its
// run) carries none, and the published sitemaps are then left as they are instead of being deleted.
const onlyShared = "only-shared" in args;
if (onlyShared && onlyLang) throw new Error("--only-shared and --only-lang cannot be used together");
const LANG_PREFIXES = HTML_TARGETS.flatMap((t) => langPrefixes(t.dir));
const isSitemap = (key) => /^sitemap[\w-]*\.xml$/.test(key);
/** The part of a manifest's files that belongs to no language; with keepSitemaps, the sitemaps are left out too. */
export function scopeShared(previous, keepSitemaps = false) {
  return Object.fromEntries(Object.entries(previous).filter(([key]) => !LANG_PREFIXES.some((p) => key.startsWith(`${p}/`)) && !(keepSitemaps && isSitemap(key))));
}
const activeTargets = onlyLang
  ? [...TARGETS, ...HTML_TARGETS].filter((t) => langPrefixes(onlyLang).includes(t.prefix))
  : onlyShared ? TARGETS.filter((t) => !LANG_PREFIXES.includes(t.prefix))
  : process.env.PUBLISH_HTML === "1" ? [...TARGETS, ...HTML_TARGETS] : TARGETS;
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
// A Worker unpacks a whole archive in memory (the zip and its contents, twice the archive's size, in 128 MB), so a
// file bigger than an archive's cap (20 MB, pack.mjs) cannot go through one: the graph export api/v1/graph/nodes.ndjson
// reached 162 MB and "Memory limit would be exceeded before EOF" stopped the UAT deploy of 20 November 2026 (run
// 44758556248). Such files are uploaded straight to the bucket with the same S3 tool that stages the archives.
const DIRECT_BYTES = Number(process.env.DIRECT_BYTES ?? 20 * 1024 * 1024);

// Splits a batch into the COPY operations too big for an archive and the rest. size: path -> bytes (injectable for tests).
export function splitDirect(batchOps, limit = DIRECT_BYTES, size = (path) => statSync(path).size) {
  const direct = [];
  const packed = [];
  for (const op of batchOps) (op.op === "COPY" && size(op.localPath) > limit ? direct : packed).push(op);
  return { direct, packed };
}
const log = (msg) => console.log(`[r2-publish] ${msg}`);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

// The ROOT_FILES present in a build, by their key (path relative to the dist root). Root files are matched by name;
// the one nested root file, .well-known/api-catalog, is listed by its relative path.
export function rootFiles(root) {
  const wellKnown = join(root, ".well-known");
  const names = [...readdirSync(root), ...(existsSync(wellKnown) ? readdirSync(wellKnown).map((n) => `.well-known/${n}`) : [])];
  return names.filter((name) => ROOT_FILES.some((r) => r.test(name)) && statSync(join(root, name)).isFile());
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
  // Root files (sitemaps, feed, favicons) belong to no language: a one-language publish leaves them alone.
  for (const name of onlyLang ? [] : rootFiles(distRoot)) {
    const full = join(distRoot, name);
    const bytes = readFileSync(full);
    files.set(name, { path: full, sha: sha(bytes), md5: createHash("md5").update(bytes).digest("hex"), cacheControl: ROOT_CACHE });
  }
  if (files.size === 0) throw new Error("no files to publish: refusing to delete the whole bucket section");
  return files;
}

// The manifest of the last publish: { files: key -> sha, commit }. Returns null when no manifest exists yet.
function readManifest() {
  try {
    const out = execFileSync("aws", ["s3", "cp", `s3://${bucket}/${MANIFEST_KEY}`, "-", "--endpoint-url", endpoint, "--only-show-errors"], {
      encoding: "utf8",
      maxBuffer: 256 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"],
    });
    return JSON.parse(out);
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

/** The part of a manifest's files under the given prefixes ("es" matches "es/…", never "es-other/…" or a root file). */
export function scopeTo(previous, prefixes) {
  return Object.fromEntries(Object.entries(previous).filter(([key]) => prefixes.some((p) => key.startsWith(`${p}/`))));
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

// ---- Churn report -------------------------------------------------------------------------------------------------
// A publish sends only files whose bytes changed, so its size says how much of the site changed. When it sends most of
// the HTML pages although few sources changed, a file baked into every page changed (the stylesheet, a layout, a script,
// the footer). The report names the groups, estimates the cost, and warns, so the cause is seen in the job summary the day
// it happens (docs/engineering/16-deploy-churn-proposal.md).
const LANGS = ["ar", "en", "ur"];

/** The group of an R2 key in the report: "ar pages", "en other", "pagefind-ar/index", "api", "media", "(root)". */
export function churnGroup(key) {
  const parts = key.split("/");
  if (parts.length === 1) return "(root)";
  if (LANGS.includes(parts[0])) return key.endsWith("/index.html") && parts.length > 2 ? `${parts[0]} pages` : `${parts[0]} other`;
  if (parts[0].startsWith("pagefind-")) return parts.length > 2 ? `${parts[0]}/${parts[1]}` : `${parts[0]}/top`;
  return parts[0];
}

/** Per group: files in the build, files to copy, files to delete. Sorted by copies, then deletes. */
export function churnReport(ops, desired) {
  const groups = new Map();
  const row = (name) => {
    if (!groups.has(name)) groups.set(name, { group: name, files: 0, copies: 0, deletes: 0 });
    return groups.get(name);
  };
  for (const key of desired.keys()) row(churnGroup(key)).files += 1;
  for (const op of ops) {
    if (op.op === "COPY") row(churnGroup(op.dst)).copies += 1;
    else row(churnGroup(op.dst)).deletes += 1;
  }
  const rows = [...groups.values()].sort((a, b) => b.copies - a.copies || b.deletes - a.deletes || a.group.localeCompare(b.group));
  const pages = rows.filter((r) => r.group.endsWith(" pages"));
  const pageFiles = pages.reduce((n, r) => n + r.files, 0);
  const pageCopies = pages.reduce((n, r) => n + r.copies, 0);
  return { rows, pageFiles, pageCopies, pageShare: pageFiles ? pageCopies / pageFiles : 0 };
}

// R2 Class A price (developers.cloudflare.com/r2/pricing, checked 6 Nov 2026): $4.50 per million. One operation per file
// written, plus a few per archive staged (the staging upload, its parts) and one for the manifest.
export const CLASS_A_PER_MILLION = 4.5;
export function estimateCost(copies, archiveSize = 250) {
  const archives = Math.ceil(copies / archiveSize);
  const classA = copies + archives * 3 + 1;
  return { classA, dollars: (classA / 1e6) * CLASS_A_PER_MILLION };
}

/** A page share above this is "most of the site": a shell file almost certainly changed. */
export const SHELL_WARN_SHARE = 0.2;

const gitRun = (cmd, args) => execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

/** The files under `paths` that differ between two commits, or null when they cannot be compared (no history for `prev`). */
export function filesChanged(prev, cur, paths, run = gitRun) {
  if (!prev || !cur) return null;
  if (prev === cur) return [];
  try {
    // The deploy checks out one commit; fetch the previously published one (a depth-1 fetch is enough to diff two trees).
    try { run("git", ["fetch", "--quiet", "--depth=1", "origin", prev]); } catch { /* already present, or unreachable: the diff decides */ }
    const out = run("git", ["diff", "--name-only", prev, cur, "--", ...paths]);
    return out.split("\n").map((l) => l.trim()).filter(Boolean);
  } catch {
    return null;
  }
}

/** The shell files (tools/deploy/shell-paths.list) that differ between two commits. */
export const shellFilesChanged = (prev, cur, run = gitRun, paths = shellPaths()) => filesChanged(prev, cur, paths, run);

/** The sources the pages are built from. A publish that sends far more than these explain points at the shell. */
export const SOURCE_PATHS = ["data", "content"];

export function formatChurn(report, { copies, deletes, total, prevCommit, curCommit, shellChanged, sourceCount = null }) {
  const cost = estimateCost(copies);
  const pct = (x) => `${(x * 100).toFixed(1)} %`;
  const lines = [];
  lines.push(`R2 publish: ${copies} files to copy, ${deletes} to delete, ${total} in the build (about ${cost.classA} Class A operations, about $${cost.dollars.toFixed(2)} at list price before the monthly free million).`);
  lines.push("");
  lines.push("| Group | Files in build | Copied | Deleted |");
  lines.push("|---|---:|---:|---:|");
  for (const r of report.rows) if (r.copies || r.deletes) lines.push(`| ${r.group} | ${r.files} | ${r.copies} | ${r.deletes} |`);
  lines.push("");
  lines.push(`HTML pages re-uploaded: ${report.pageCopies} of ${report.pageFiles} (${pct(report.pageShare)}).`);
  if (sourceCount !== null) lines.push(`Source files (data and content) changed since the last publish: ${sourceCount}.`);
  let warning = null;
  if (report.pageShare > SHELL_WARN_SHARE && report.pageFiles > 0) {
    const named = shellChanged === null
      ? "The shell files that changed could not be listed (no history for the previously published commit)."
      : shellChanged.length
        ? `Shell files changed since the last publish (${prevCommit?.slice(0, 9)}..${curCommit?.slice(0, 9)}): ${shellChanged.join(", ")}.`
        : "No listed shell file changed; look at what else is baked into every page (tools/deploy/shell-paths.list).";
    warning = `${pct(report.pageShare)} of the HTML pages changed. That usually means a file baked into every page changed, not the content. ${named} Compare the two builds with tools/deploy/compare-builds.py.`;
    lines.push("");
    lines.push(`**Warning:** ${warning}`);
  }
  return { text: lines.join("\n"), warning };
}

// Prints the churn report and appends it to the GitHub job summary when there is one.
function reportChurn(ops, desired, { copies, deletes, prevCommit }) {
  const curCommit = process.env.GITHUB_SHA ?? null;
  const report = churnReport(ops, desired);
  const shellChanged = report.pageShare > SHELL_WARN_SHARE ? shellFilesChanged(prevCommit, curCommit) : [];
  const sources = filesChanged(prevCommit, curCommit, SOURCE_PATHS);
  const { text, warning } = formatChurn(report, { copies, deletes, total: desired.size, prevCommit, curCommit, shellChanged, sourceCount: sources ? sources.length : null });
  for (const line of text.split("\n")) log(line);
  if (warning) console.log(`::warning title=Most pages changed::${warning.replace(/\r?\n/g, " ")}`);
  const summary = process.env.GITHUB_STEP_SUMMARY;
  if (summary) {
    try { appendFileSync(summary, `\n### R2 publish churn\n\n${text}\n`); } catch { /* the summary is a convenience */ }
  }
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

// Runs a command without blocking the event loop; rejects when it cannot start or exits non-zero.
export function runCommand(cmd, cmdArgs, options = { stdio: "inherit" }) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, cmdArgs, options);
    child.on("error", reject);
    child.on("close", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${cmdArgs.slice(0, 2).join(" ")} ended with ${signal ?? `exit code ${code}`}`));
    });
  });
}

// Uploads one large file straight to its place in the bucket. The destination was built from the publish targets, never
// from outside input, so the Worker's allow-list is not needed; the content type is the Worker's own mapping.
async function uploadDirect(op, progress) {
  const started = Date.now();
  await withRetry(op.dst, "direct upload", () =>
    runCommand("aws", ["s3", "cp", op.localPath, `s3://${bucket}/${op.dst}`, "--endpoint-url", endpoint, "--only-show-errors",
      "--content-type", contentType(op.dst), "--cache-control", op.cacheControl]));
  log(`${progress} ${op.dst} (${(statSync(op.localPath).size / 1048576).toFixed(1)} MB) uploaded directly in ${Date.now() - started} ms`);
}

async function applyArchive(archive, dir, workerUrl, progress) {
  const started = Date.now();
  const file = join(dir, archive.name);
  writeFileSync(file, archive.bytes);
  const stagedKey = `${STAGING_PREFIX}${archive.name}`;
  try {
    // Not execFileSync: a blocking upload stops every other runner, so the archives went up one at a time (about four
    // seconds each, 1,763 archives in two hours on 10 November 2026) whatever PARALLEL said.
    await withRetry(archive.name, "staging upload", () =>
      runCommand("aws", ["s3", "cp", file, `s3://${bucket}/${stagedKey}`, "--endpoint-url", endpoint, "--only-show-errors"]));
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

// Workers deployed before the 503 fix still report a transient R2 storage error
// as a 400. The pattern is deliberately tight so a real "bad archive" 400 stays final.
const TRANSIENT_WORKER_ERROR = /internal error|please try again|10001|timed? ?out|temporarily unavailable|service unavailable/i;

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
      // Older workers still answer 400 for a transient R2 failure ("internal error
      // (10001)"); retry those too — a genuinely bad archive cannot produce a body
      // that matches the transient pattern.
      if (result.status === 400 && TRANSIENT_WORKER_ERROR.test(JSON.stringify(result.report)))
        throw new Error(`worker answered ${result.status} ${JSON.stringify(result.report)} (transient R2 error wrapped as 400)`);
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
  const manifest = dryRun ? { files: {}, commit: null } : readManifest();
  const stored = manifest ? manifest.files : null;
  const seeding = process.argv.includes("--seed");
  if (!dryRun && stored === null && !seeding) {
    throw new Error("no manifest in the bucket: run once with --seed to record the files already published");
  }
  // A one-language publish changes part of an existing record; it never starts one. Seeding from one language would
  // write a manifest that knows nothing of the others, and the next full publish would send the whole site again.
  if (onlyLang && !dryRun && stored === null) {
    throw new Error(`no manifest in the bucket: a one-language publish (--only-lang ${onlyLang}) needs a full deploy of this environment first`);
  }
  if (onlyShared && !dryRun && stored === null) {
    throw new Error("no manifest in the bucket: a shared-parts publish (--only-shared) needs a full deploy of this environment first");
  }
  const keepSitemaps = onlyShared && ![...desired.keys()].some(isSitemap);
  const previous = stored ?? (dryRun ? {} : bootstrapPrevious(desired));
  // What the diff may touch: everything, or one language's prefixes. `previous` stays the whole record, so the
  // manifest written after each batch still lists every other file.
  const scoped = () => (onlyLang ? scopeTo(previous, langPrefixes(onlyLang)) : onlyShared ? scopeShared(previous, keepSitemaps) : previous);
  if (onlyShared) log(`shared parts only: the API, the shared data and the root files; no file under ${LANG_PREFIXES.join(", ")} is copied or deleted`);
  if (keepSitemaps) log("this build carries no sitemap (not every language was built in its run): the published sitemaps are left as they are");
  if (onlyLang) log(`one language: ${onlyLang} (prefixes ${langPrefixes(onlyLang).join(", ")}); every other file in the bucket is left as it is`);
  let ops = diff(desired, scoped());
  let copies = ops.filter((o) => o.op === "COPY").length;
  if (!dryRun && stored !== null && copies >= RECONCILE_MIN) {
    const prefixes = [...new Set(ops.filter((o) => o.op === "COPY").map((o) => o.dst.split("/")[0]))];
    const matched = reconcile(desired, previous, listBucket(prefixes));
    log(`reconciled with the bucket: ${matched} of ${copies} files to copy are already there (skipped)`);
    ops = diff(desired, scoped());
    copies = ops.filter((o) => o.op === "COPY").length;
  }
  const deletes = ops.length - copies;
  log(`${desired.size} files in dist, ${Object.keys(scoped()).length} in last publish: ${copies} to copy, ${deletes} to delete`);
  reportChurn(ops, desired, { copies, deletes, prevCommit: (onlyLang ? manifest?.langs?.[onlyLang] : onlyShared ? manifest?.shared : null) ?? manifest?.commit ?? null });
  // The commit the manifest names is the last full publish. A one-language publish keeps it and records its own
  // commit under `langs`; a full publish drops `langs`, since every language is then at its commit again.
  // A shared-parts publish does the same under `shared`. Each partial publish carries the other's note forward.
  const carried = { commit: manifest?.commit ?? null, ...(manifest?.langs ? { langs: manifest.langs } : {}), ...(manifest?.shared ? { shared: manifest.shared } : {}) };
  const meta = onlyLang
    ? { ...carried, langs: { ...(manifest?.langs ?? {}), [onlyLang]: process.env.GITHUB_SHA ?? null } }
    : onlyShared ? { ...carried, shared: process.env.GITHUB_SHA ?? null }
    : { commit: process.env.GITHUB_SHA ?? null };

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
    const { direct, packed } = splitDirect(batchOps);
    for (const [k, op] of direct.entries()) await uploadDirect(op, `[batch ${b + 1}/${batches} direct ${k + 1}/${direct.length}]`);
    const archives = packArchives(loadBatch(packed), { namePrefix: `publish-${stamp}-b${b}` });
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
    writeManifest(dir, previous, b + 1 < batches, meta);
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
function writeManifest(dir, files, partial, meta) {
  const next = { version: 1, ...meta, partial, files };
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
