import { describe, it, expect } from "vitest";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseBigJson, readBigJson, writeBigJson } from "./lib/graph-file.mjs";

// A graph-shaped value with what trips a byte scanner: quotes, backslashes, brackets and commas inside strings,
// Arabic text, nested arrays and objects, empty arrays, nulls.
const sample = () => ({
  generated: "2026-11-19T00:00:00Z",
  repo: { commits: 3, list: [1, [2, 3], { a: [] }] },
  nodes: Array.from({ length: 500 }, (_, i) => ({ id: `person/n-${i}`, label: { ar: `اسم ⁦(${i})⁩ "م"`, en: `N, [${i}] {x} \\ "q" \\\\` }, tags: i % 3 ? ["a,b", "]"] : [], nested: [[i], [{ k: "}" }]], none: null })),
  empty: [],
  edges: Array.from({ length: 300 }, (_, i) => [`person/n-${i}`, "knows", `person/n-${i + 1}`]),
  coverage: { entities: 500, note: "a \"quoted\" one" },
});

describe("graph-file: the compiled graph is read and written in pieces", () => {
  it("parses a file larger than one piece to the same value as JSON.parse", () => {
    const text = JSON.stringify(sample());
    const buf = Buffer.from(text, "utf8");
    // Pieces far smaller than the file, of several sizes, so slices end at many different elements.
    for (const piece of [300, 1024, 4096, 20000]) expect(parseBigJson(buf, piece)).toEqual(JSON.parse(text));
    expect(parseBigJson(buf)).toEqual(JSON.parse(text));
  });

  it("refuses a large file that is not an object, or a large member that is not an array", () => {
    expect(() => parseBigJson(Buffer.from(JSON.stringify([1, 2, 3, 4, 5, 6])), 4)).toThrow(/object at the top level/);
    expect(() => parseBigJson(Buffer.from(JSON.stringify({ a: "x".repeat(100) })), 50)).toThrow(/not an array/);
  });

  it("writes the bytes JSON.stringify writes, and reads them back", () => {
    const dir = mkdtempSync(join(tmpdir(), "graph-file-"));
    const value = { ...sample(), skipped: undefined, holes: [1, undefined, 3] };
    for (const batch of [7, 100, 2000]) {
      writeBigJson(join(dir, "g.json"), value, batch);
      expect(readFileSync(join(dir, "g.json"), "utf8")).toBe(JSON.stringify(value));
    }
    writeFileSync(join(dir, "h.json"), JSON.stringify(sample()));
    expect(readBigJson(join(dir, "h.json"))).toEqual(sample());
  });
});
