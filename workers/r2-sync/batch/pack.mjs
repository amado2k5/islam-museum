// Batch side: packs operations into zip archives of at most maxBytes each.
// Nothing is compared with R2 here. The caller says what to COPY, MOVE or DELETE
// and the archives carry the files plus a manifest.json describing them.
import { zipSync } from "fflate";
import { createHash } from "node:crypto";

const DEFAULT_MAX = 20 * 1024 * 1024;

const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");

// ops: [{ op: "COPY", localBytes: Uint8Array, dst }, { op: "MOVE", src, dst }, { op: "DELETE", dst }]
// Returns an array of { name, bytes } archives. Each archive's manifest lists only
// the operations for the files inside it. Archives are split when adding the next
// file would go over maxBytes; DELETE and MOVE ops take no bytes and go in the first archive.
export function packArchives(ops, { namePrefix = "batch", maxBytes = DEFAULT_MAX } = {}) {
  const archives = [];
  let current = null;

  const start = () => {
    current = { entries: {}, manifestOps: [], bytes: 0 };
    archives.push(current);
  };
  start();

  for (const [i, op] of ops.entries()) {
    if (op.op === "COPY") {
      const size = op.localBytes.byteLength;
      if (current.bytes > 0 && current.bytes + size > maxBytes) start();
      const srcName = `files/${String(i).padStart(6, "0")}`;
      current.entries[srcName] = op.localBytes;
      current.bytes += size;
      current.manifestOps.push({ op: "COPY", src: srcName, dst: op.dst, sha256: sha(op.localBytes) });
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
