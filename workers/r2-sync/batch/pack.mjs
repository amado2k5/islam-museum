// Batch side: packs operations into zip archives of at most maxBytes each.
// Nothing is compared with R2 here. The caller says what to COPY, MOVE or DELETE
// and the archives carry the files plus a manifest.json describing them.
import { zipSync } from "fflate";
import { createHash } from "node:crypto";

const DEFAULT_MAX = 20 * 1024 * 1024;
// One Worker request applies one archive, and a request that runs much past
// five minutes is dropped. At the one-at-a-time speed measured on 19 Oct 2026
// (about 5 operations per second), 500 operations take about 100 seconds.
const DEFAULT_MAX_OPS = 500;

const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");

// ops: [{ op: "COPY", localBytes: Uint8Array, dst }, { op: "MOVE", src, dst }, { op: "DELETE", dst }]
// Returns an array of { name, bytes } archives. Each archive's manifest lists only
// the operations for the files inside it. A new archive starts when the next file
// would go over maxBytes, or when the current one already has maxOps operations.
export function packArchives(ops, { namePrefix = "batch", maxBytes = DEFAULT_MAX, maxOps = DEFAULT_MAX_OPS } = {}) {
  const archives = [];
  let current = null;

  const start = () => {
    current = { entries: {}, manifestOps: [], bytes: 0 };
    archives.push(current);
  };
  start();

  for (const [i, op] of ops.entries()) {
    if (current.manifestOps.length >= maxOps) start();
    if (op.op === "COPY") {
      const size = op.localBytes.byteLength;
      if (current.bytes > 0 && current.bytes + size > maxBytes) start();
      const srcName = `files/${String(i).padStart(6, "0")}`;
      current.entries[srcName] = op.localBytes;
      current.bytes += size;
      current.manifestOps.push({ op: "COPY", src: srcName, dst: op.dst, sha256: sha(op.localBytes), cache_control: op.cacheControl });
    } else {
      current.manifestOps.push(op.op === "MOVE" ? { op: "MOVE", src: op.src, dst: op.dst } : { op: "DELETE", dst: op.dst });
    }
  }

  return archives
    .filter((a) => a.manifestOps.length > 0)
    .map((a, n) => {
      const manifest = { version: 1, ops: a.manifestOps };
      const entries = { ...a.entries, "manifest.json": new TextEncoder().encode(JSON.stringify(manifest, null, 2)) };
      const bytes = zipSync(entries, { level: 0 });
      return { name: `${namePrefix}-${String(n + 1).padStart(3, "0")}.zip`, bytes, ops: a.manifestOps.length, files: Object.keys(a.entries).length };
    });
}
