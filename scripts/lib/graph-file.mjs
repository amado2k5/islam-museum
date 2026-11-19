// Reads and writes the compiled graph (.cache/graph.json) without ever holding the whole file as one string.
//
// Node cannot make a string longer than about 512 MB (0x1fffffe8), and reading a file as text fails once the file
// itself is larger than that. The graph passed it on 19 November 2026 (549 MB, with five languages of prose), and
// every script that did `JSON.parse(readFileSync(".cache/graph.json", "utf8"))` stopped with ERR_STRING_TOO_LONG.
// The file's format is unchanged (one JSON object, the same bytes JSON.stringify writes), so the Python readers and
// anything else that streams it are not affected. Here the file is read as bytes, its top-level members are found
// by scanning, and a large top-level array (nodes, edges) is parsed a slice of elements at a time.
import { readFileSync, openSync, writeSync, closeSync } from "node:fs";

// Parse in pieces of at most this many bytes. Far below the string limit, whatever the text's encoding.
const PIECE = 64 * 1024 * 1024;

/** JSON.parse for a Buffer of any size holding one JSON value. Large values must be a top-level object. */
export function parseBigJson(buf, piece = PIECE) {
  if (buf.length <= piece) return JSON.parse(buf.toString("utf8"));
  let i = 0;
  while (buf[i] === 0x20 || buf[i] === 0x0a || buf[i] === 0x0d || buf[i] === 0x09) i += 1;
  if (buf[i] !== 0x7b) throw new Error("parseBigJson: a file this large must hold a JSON object at the top level");
  // One pass over the bytes: where each top-level member's key and value are, and, when the value is an array, where
  // each of its elements starts. Bytes of a multi-byte character are all 0x80 or above, so they never look like syntax.
  const members = [];
  let cur = { keyStart: -1, keyEnd: -1, valStart: -1, valEnd: -1, elems: null, arrEnd: -1 };
  let depth = 0, inStr = false;
  for (; i < buf.length; i += 1) {
    const c = buf[i];
    if (inStr) {
      if (c === 0x5c) i += 1;
      else if (c === 0x22) { inStr = false; if (depth === 1 && cur.keyEnd < 0) cur.keyEnd = i + 1; }
      continue;
    }
    if (c === 0x22) { inStr = true; if (depth === 1 && cur.keyStart < 0) cur.keyStart = i; }
    else if (c === 0x3a) { if (depth === 1 && cur.valStart < 0) cur.valStart = i + 1; }
    else if (c === 0x7b || c === 0x5b) {
      if (depth === 1 && c === 0x5b) cur.elems = [i + 1];
      depth += 1;
    } else if (c === 0x7d || c === 0x5d) {
      depth -= 1;
      if (depth === 1 && c === 0x5d && cur.elems && cur.arrEnd < 0) cur.arrEnd = i;
      if (depth === 0) { if (cur.keyStart >= 0) { cur.valEnd = i; members.push(cur); } break; }
    } else if (c === 0x2c) {
      if (depth === 1) { cur.valEnd = i; members.push(cur); cur = { keyStart: -1, keyEnd: -1, valStart: -1, valEnd: -1, elems: null, arrEnd: -1 }; }
      else if (depth === 2 && cur.elems && cur.arrEnd < 0) cur.elems.push(i + 1);
    }
  }
  if (depth !== 0) throw new Error("parseBigJson: the file ends before its JSON object does");
  const out = {};
  for (const m of members) {
    const key = JSON.parse(buf.toString("utf8", m.keyStart, m.keyEnd));
    if (m.valEnd - m.valStart <= piece) { out[key] = JSON.parse(buf.toString("utf8", m.valStart, m.valEnd)); continue; }
    if (!m.elems || m.arrEnd < 0) throw new Error(`parseBigJson: "${key}" is larger than ${piece} bytes and is not an array`);
    // Element k runs from bounds[k] to bounds[k + 1] - 1 (the comma, or the closing bracket for the last one).
    const bounds = [...m.elems, m.arrEnd + 1];
    const list = [];
    for (let a = 0; a < bounds.length - 1;) {
      let b = a + 1;
      while (b < bounds.length - 1 && bounds[b + 1] - bounds[a] <= piece) b += 1;
      for (const item of JSON.parse(`[${buf.toString("utf8", bounds[a], bounds[b] - 1)}]`)) list.push(item);
      a = b;
    }
    out[key] = list;
  }
  return out;
}

/** The compiled graph, or any other large JSON file, as a value. */
export function readBigJson(path) {
  return parseBigJson(readFileSync(path));
}

/** Writes exactly what `writeFileSync(path, JSON.stringify(value))` writes, a part at a time. */
export function writeBigJson(path, value, batch = 2000) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error("writeBigJson: the value must be an object");
  const fd = openSync(path, "w");
  try {
    let first = true;
    writeSync(fd, "{");
    for (const [key, v] of Object.entries(value)) {
      if (v === undefined || typeof v === "function" || typeof v === "symbol") continue;
      writeSync(fd, `${first ? "" : ","}${JSON.stringify(key)}:`);
      first = false;
      if (Array.isArray(v) && v.length > batch) {
        writeSync(fd, "[");
        for (let a = 0; a < v.length; a += batch) writeSync(fd, (a ? "," : "") + JSON.stringify(v.slice(a, a + batch)).slice(1, -1));
        writeSync(fd, "]");
      } else writeSync(fd, JSON.stringify(v));
    }
    writeSync(fd, "}");
  } finally {
    closeSync(fd);
  }
}
