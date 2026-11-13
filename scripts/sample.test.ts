import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { changedIds, entityIdOf } from "./sample-routes";
import { STUB, writeStubs } from "./sample-stubs";
import { pick, sample, sampling } from "../site/src/lib/sample";

const dir = mkdtempSync(join(tmpdir(), "sample-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe("sample build of a pull request", () => {
  it("reads record ids from data and prose paths only", () => {
    expect(entityIdOf("data/person/ibn-sina.yaml")).toBe("person/ibn-sina");
    expect(entityIdOf("content/ur/event/hijra.md")).toBe("event/hijra");
    expect(entityIdOf("data/_stubs.d/lane.yaml")).toBeNull();
    expect(entityIdOf("data/_stubs.yaml")).toBeNull();
    expect(entityIdOf("site/src/pages/index.astro")).toBeNull();
    expect(changedIds(["content/ar/event/hijra.md", "content/en/event/hijra.md", "data/event/hijra.yaml", "CANARY.md", ""])).toEqual(["event/hijra"]);
  });

  it("keeps the named records and an even spread of each class", () => {
    const items = [
      ...Array.from({ length: 1000 }, (_, i) => ({ id: `person/p${String(i).padStart(4, "0")}`, class: "person" })),
      ...Array.from({ length: 3 }, (_, i) => ({ id: `award/a${i}`, class: "award" })),
    ];
    const keep = pick(items, 10, new Set(["person/p0999", "person/absent"]));
    expect([...keep].filter((id) => id.startsWith("award/"))).toHaveLength(3);
    expect(keep.has("person/p0999")).toBe(true);
    expect(keep.has("person/absent")).toBe(false);
    expect(keep.has("person/p0000")).toBe(true);
    expect(keep.has("person/p0500")).toBe(true);
    expect([...keep].filter((id) => id.startsWith("person/"))).toHaveLength(11);
  });

  it("is off unless SAMPLE_BUILD is set, and a full build gets its own list back", () => {
    expect(sampling({})).toBe(false);
    expect(sampling({ SAMPLE_BUILD: "0" })).toBe(false);
    expect(sampling({ SAMPLE_BUILD: "1" })).toBe(true);
    // the test run itself must not be a sample build
    expect(sampling()).toBe(false);
    const items = [{ id: "person/a", class: "person" }];
    expect(sample(items, 0, () => { throw new Error("no route is asked for in a full build"); })).toBe(items);
  });

  it("writes a placeholder only where no page was built, and refuses anything that is not a page route", () => {
    expect(writeStubs(dir, ["/ar/person/a/", "/en/person/a/"])).toBe(2);
    expect(readFileSync(join(dir, "ar", "person", "a", "index.html"), "utf8")).toBe(STUB);
    expect(writeStubs(dir, ["/ar/person/a/", "/ur/person/a/"])).toBe(1);
    expect(() => writeStubs(dir, ["/ar/../../etc/"])).toThrow();
    expect(() => writeStubs(dir, ["ar/person/a"])).toThrow();
    expect(existsSync(join(dir, "ur", "person", "a", "index.html"))).toBe(true);
  });
});
