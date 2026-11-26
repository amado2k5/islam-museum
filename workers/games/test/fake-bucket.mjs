// A stand-in for an R2 bucket, for tests and for the local smoke test of a release. It implements only what the
// Worker uses: get(key, { range: { offset, length } }) returning { body, httpEtag, size, text() } or null, and
// head(key) returning the same without a body. `reads` records every key asked for.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const objectOf = (bytes, range) => {
  const part = range ? bytes.subarray(range.offset, range.offset + range.length) : bytes;
  return { body: new Blob([part]).stream(), httpEtag: `"${createHash("md5").update(bytes).digest("hex")}"`, size: bytes.length, text: async () => Buffer.from(part).toString("utf8") };
};
const headOf = (bytes) => ({ httpEtag: `"${createHash("md5").update(bytes).digest("hex")}"`, size: bytes.length });

/** A bucket held in memory: { "games/channel.json": "…", … }. */
export function memoryBucket(objects) {
  const reads = [];
  return {
    reads,
    objects,
    failing: false,
    async get(key, options) {
      reads.push(key);
      if (this.failing) throw new Error("the bucket cannot be read");
      return key in objects ? objectOf(Buffer.from(objects[key]), options?.range) : null;
    },
    async head(key) {
      reads.push(key);
      if (this.failing) throw new Error("the bucket cannot be read");
      return key in objects ? headOf(Buffer.from(objects[key])) : null;
    },
  };
}

/** A bucket that is a folder on disk: the key is the path under it. */
export function folderBucket(root) {
  const reads = [];
  return {
    reads,
    async get(key, options) {
      reads.push(key);
      const file = join(root, key);
      if (key.includes("..") || !existsSync(file) || !statSync(file).isFile()) return null;
      return objectOf(readFileSync(file), options?.range);
    },
    async head(key) {
      reads.push(key);
      const file = join(root, key);
      if (key.includes("..") || !existsSync(file) || !statSync(file).isFile()) return null;
      return headOf(readFileSync(file));
    },
  };
}
