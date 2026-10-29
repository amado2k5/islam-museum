// R2 archive worker. The batch side uploads zip archives to a staging key in
// R2 and asks this Worker to process one. The Worker reads the archive, unzips
// it, validates manifest.json, applies the operations in order, logs progress,
// and deletes the archive when every operation succeeded.
//
// Manifest (manifest.json at the zip root):
//   {
//     "version": 1,
//     "ops": [
//       { "op": "COPY",   "src": "files/0001.md", "dst": "content/en/x.md", "sha256": "<hex>" },
//       { "op": "MOVE",   "src": "content/en/old.md", "dst": "content/en/new.md" },
//       { "op": "DELETE", "dst": "content/en/gone.md" }
//     ]
//   }
// COPY reads from the archive; MOVE and DELETE act on keys already in R2.
// Every dst must start with an allowed prefix (ALLOWED_PREFIXES, comma-separated), or,
// when ALLOW_ROOT_FILES is "true", be one of the bucket-root data files in ROOT_FILES.
import { unzipSync } from "fflate";

const MIME = {
  html: "text/html; charset=utf-8",
  css: "text/css; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  json: "application/json",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  txt: "text/plain; charset=utf-8",
  md: "text/markdown; charset=utf-8",
  yaml: "text/yaml; charset=utf-8",
  xml: "application/xml",
};

const contentType = (key) => MIME[key.split(".").pop().toLowerCase()] ?? "application/octet-stream";

const sha256Hex = async (bytes) => {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
};

// Returns the top-level directory-like prefixes a key introduces that were not
// seen before (R2 has no real folders, so this is what "creating folders" means).
const newFolders = (key, seen) => {
  const parts = key.split("/").slice(0, -1);
  const created = [];
  for (let i = 1; i <= parts.length; i += 1) {
    const dir = parts.slice(0, i).join("/") + "/";
    if (!seen.has(dir)) {
      seen.add(dir);
      created.push(dir);
    }
  }
  return created;
};

// Data files at the bucket root (sitemaps, feed, llms.txt, search synonyms, favicons).
// Keep in step with ROOT_FILES in batch/publish.mjs and R2_ROOT_FILES in workers/site/src/route.js.
export const ROOT_FILES = [/^sitemap[\w-]*\.xml$/, /^feed\.xml$/, /^llms(-full)?\.txt$/, /^search-synonyms\.\w+\.json$/, /^favicon[\w-]*\.(png|svg|ico)$/, /^apple-touch-icon\.png$/];

function validateDst(dst, allowed, allowRootFiles = false) {
  const listed = (d) => allowed.some((p) => d.startsWith(p)) || (allowRootFiles && ROOT_FILES.some((r) => r.test(d)));
  if (!dst || dst.startsWith("/") || dst.includes("..") || !listed(dst)) {
    throw new Error(`destination not allowed: "${dst}"`);
  }
}

// Progress for GET /status. It lives in R2, not in memory, so it survives a client
// that dropped the connection. A failed status write never stops the archive.
const STATUS_KEY = "_r2-sync/status.json";
const STATUS_EVERY = 100;

async function writeStatus(bucket, status, log) {
  try {
    await bucket.put(STATUS_KEY, JSON.stringify({ ...status, updated: new Date().toISOString() }, null, 2), {
      httpMetadata: { contentType: "application/json" },
    });
  } catch (err) {
    log(`[status] write failed: ${err.message ?? err}`);
  }
}

// Applies one archive. `bucket` is an R2 bucket binding (or a compatible stub).
// `log` receives progress lines. Returns a report; throws only on a bad archive.
export async function processArchive({ bucket, archiveKey, allowedPrefixes, allowRootFiles = false, log = console.log }) {
  const archive = await bucket.get(archiveKey);
  if (!archive) throw new Error(`archive not found: ${archiveKey}`);
  const entries = unzipSync(new Uint8Array(await archive.arrayBuffer()));
  log(`[process] ${archiveKey}: ${Object.keys(entries).length} entries`);

  const manifestBytes = entries["manifest.json"];
  if (!manifestBytes) throw new Error("manifest.json missing from archive");
  const manifest = JSON.parse(new TextDecoder().decode(manifestBytes));
  if (manifest.version !== 1 || !Array.isArray(manifest.ops)) throw new Error("unsupported manifest");
  log(`[process] manifest: ${manifest.ops.length} operations`);

  const report = { archive: archiveKey, copied: [], moved: [], deleted: [], folders: [], failed: [] };
  const seen = new Set();
  const total = manifest.ops.length;
  const startedAt = new Date().toISOString();
  const snapshot = (state, done) => ({
    archive: archiveKey,
    state,
    started: startedAt,
    total,
    done,
    copied: report.copied.length,
    moved: report.moved.length,
    deleted: report.deleted.length,
    failed: report.failed.length,
  });
  await writeStatus(bucket, snapshot("running", 0), log);

  // COPY ops run COPY_CONCURRENCY at a time. A MOVE, DELETE or unknown op runs alone,
  // in manifest order, so it can never race a COPY to the same key.
  // A Worker invocation can hold six connections open at once (Cloudflare Workers limits).
  // A seventh R2 call waits for one of them, so six is the most that can run in parallel.
  const COPY_CONCURRENCY = 6;
  let lastStatusAt = 0;

  const copyOp = async (op, i) => {
    try {
      validateDst(op.dst, allowedPrefixes, allowRootFiles);
      const data = entries[op.src];
      if (!data) throw new Error(`source not in archive: ${op.src}`);
      if (op.sha256 && (await sha256Hex(data)) !== op.sha256) throw new Error(`checksum mismatch: ${op.src}`);
      for (const dir of newFolders(op.dst, seen)) report.folders.push(dir);
      await bucket.put(op.dst, data, { httpMetadata: { contentType: contentType(op.dst), cacheControl: op.cache_control } });
      report.copied.push({ from: op.src, to: op.dst, bytes: data.byteLength });
      log(`[copy ${i + 1}/${total}] ${op.src} -> ${op.dst} (${data.byteLength} bytes)`);
    } catch (err) {
      report.failed.push({ index: i, op: op.op, error: String(err.message ?? err) });
      log(`[fail ${i + 1}/${total}] ${op.op}: ${err.message ?? err}`);
    }
  };

  const otherOp = async (op, i) => {
    try {
      if (op.op === "MOVE") {
        validateDst(op.dst, allowedPrefixes, allowRootFiles);
        validateDst(op.src, allowedPrefixes, allowRootFiles);
        const existing = await bucket.get(op.src);
        if (!existing) throw new Error(`move source missing: ${op.src}`);
        const data = new Uint8Array(await existing.arrayBuffer());
        for (const dir of newFolders(op.dst, seen)) report.folders.push(dir);
        await bucket.put(op.dst, data, { httpMetadata: { contentType: contentType(op.dst) } });
        await bucket.delete(op.src);
        report.moved.push({ from: op.src, to: op.dst });
        log(`[move ${i + 1}/${total}] ${op.src} -> ${op.dst}`);
      } else if (op.op === "DELETE") {
        validateDst(op.dst, allowedPrefixes, allowRootFiles);
        await bucket.delete(op.dst);
        report.deleted.push(op.dst);
        log(`[delete ${i + 1}/${total}] ${op.dst}`);
      } else {
        throw new Error(`unknown op: ${op.op}`);
      }
    } catch (err) {
      report.failed.push({ index: i, op: op.op, error: String(err.message ?? err) });
      log(`[fail ${i + 1}/${total}] ${op.op}: ${err.message ?? err}`);
    }
  };

  for (let i = 0; i < total; ) {
    if (manifest.ops[i].op === "COPY") {
      let end = i;
      while (end < total && manifest.ops[end].op === "COPY" && end - i < COPY_CONCURRENCY) end += 1;
      await Promise.all(Array.from({ length: end - i }, (_, k) => copyOp(manifest.ops[i + k], i + k)));
      i = end;
    } else {
      await otherOp(manifest.ops[i], i);
      i += 1;
    }
    if (Math.floor(i / STATUS_EVERY) > Math.floor(lastStatusAt / STATUS_EVERY)) {
      lastStatusAt = i;
      await writeStatus(bucket, snapshot("running", i), log);
    }
  }

  if (report.failed.length === 0) {
    await bucket.delete(archiveKey);
    log(`[done] ${archiveKey} applied and deleted`);
  } else {
    log(`[kept] ${archiveKey} kept because ${report.failed.length} operation(s) failed`);
  }
  await writeStatus(bucket, { ...snapshot(report.failed.length === 0 ? "done" : "kept", total), finished: new Date().toISOString() }, log);
  report.summary = {
    copied: report.copied.length,
    moved: report.moved.length,
    deleted: report.deleted.length,
    failed: report.failed.length,
    folders_created: report.folders.length,
  };
  return report;
}

const json = (body, status = 200) =>
  new Response(JSON.stringify(body, null, 2), { status, headers: { "content-type": "application/json" } });

export default {
  async fetch(request, env) {
    const expected = `Bearer ${env.SYNC_TOKEN}`;
    if (!env.SYNC_TOKEN || request.headers.get("authorization") !== expected) {
      return json({ error: "unauthorised" }, 401);
    }
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/status") {
      const status = await env.SYNC_BUCKET.get(STATUS_KEY);
      if (!status) return json({ error: "no status yet" }, 404);
      return new Response(await status.text(), { headers: { "content-type": "application/json" } });
    }
    if (request.method !== "POST" || url.pathname !== "/process") return json({ error: "not found" }, 404);

    const { archive } = await request.json();
    const allowedPrefixes = (env.ALLOWED_PREFIXES ?? "").split(",").filter(Boolean);
    try {
      const report = await processArchive({
        bucket: env.SYNC_BUCKET,
        archiveKey: archive,
        allowedPrefixes,
        allowRootFiles: env.ALLOW_ROOT_FILES === "true",
        log: (line) => console.log(line),
      });
      return json(report, report.failed.length ? 207 : 200);
    } catch (err) {
      return json({ error: String(err.message ?? err) }, 400);
    }
  },
};
