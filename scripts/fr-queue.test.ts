import { afterEach, describe, expect, it, vi } from "vitest";

const fixtures = vi.hoisted(() => ({ files: {} as Record<string, string> }));
vi.mock("./lib.js", () => ({ p: (...parts: string[]) => `/fixture/${parts.join("/")}` }));
vi.mock("node:fs", () => ({
  readdirSync: () => Object.keys(fixtures.files).map((name) => ({
    name, isDirectory: () => false,
  })),
  readFileSync: (path: string) => fixtures.files[path.split("/").at(-1)!],
  existsSync: () => false,
}));

const argv = process.argv;
afterEach(() => {
  process.argv = argv;
  fixtures.files = {};
  vi.restoreAllMocks();
});

async function labels(...args: string[]) {
  vi.restoreAllMocks();
  vi.resetModules();
  process.argv = ["node", "fr-queue.ts", "labels", ...args];
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  await import("./fr-queue");
  return { lines: log.mock.calls.map(([line]) => line), totals: error.mock.calls };
}

describe("French label queue", () => {
  it("filters by class and skips existing French labels", async () => {
    fixtures.files = {
      "a.yaml": "id: object/a\nclass: object\nlabel: {en: A}",
      "b.yaml": "id: building/b\nclass: building\nlabel: {en: B}",
      "c.yaml": "id: building/c\nclass: building\nlabel: {en: C, fr: C}",
    };
    const result = await labels("--class", "building");
    expect(result.lines).toEqual(["building/b"]);
    expect(result.totals).toEqual([["listed 1"]]);
  });

  it("keeps all classes by default and honours the limit", async () => {
    fixtures.files = {
      "a.yaml": "id: object/a\nclass: object\nlabel: {en: A}",
      "b.yaml": "id: building/b\nclass: building\nlabel: {en: B}",
    };
    expect((await labels()).lines).toEqual(["object/a", "building/b"]);
    expect((await labels("--limit", "1")).lines).toEqual(["object/a"]);
  });

  it("reports an empty class selection", async () => {
    fixtures.files = { "a.yaml": "id: object/a\nclass: object\nlabel: {en: A}" };
    const result = await labels("--class", "building");
    expect(result.lines).toEqual([]);
    expect(result.totals).toEqual([["listed 0"]]);
  });

  it("does not hide invalid YAML", async () => {
    fixtures.files = { "bad.yaml": "label: [unterminated" };
    await expect(labels("--class", "building")).rejects.toThrow();
  });
});
