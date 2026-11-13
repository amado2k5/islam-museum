// The worship family of a curated record is stated on the record (docs/site/signature-views.md, Ibadat): an
// `ibadat-<topic>` tag, read by ibadatTagTopics, and never a table in a page's code.
import { describe, expect, it } from "vitest";
import { loadEntities } from "./lib.js";
import { ibadatTagTopics, ibadatTagSection } from "./ibadat.js";

const node = (tags: string[]) => ({ id: "practice/x", class: "practice", tags } as any);

describe("worship-family tags on curated records", () => {
  it("reads `ibadat-<topic>` tags and ignores the browser and section tags", () => {
    expect(ibadatTagTopics(node(["ibadat-browser", "ibadat-practices", "ibadat-tahara"]))).toEqual(["tahara"]);
    expect(ibadatTagTopics(node(["ibadat-browser", "ibadat-practices"]))).toEqual([]);
    expect(ibadatTagTopics(node(["dua-practices", "ibadat-dua", "ibadat-salah"]))).toEqual(["dua", "salah"]);
  });

  it("leaves the record's section as it was", () => {
    expect(ibadatTagSection(node(["ibadat-browser", "ibadat-practices", "ibadat-salah"]))).toBe("curated");
  });

  it("the practice records state a family", () => {
    const practices = loadEntities({ shared: true }).map(({ entity }) => entity as any).filter((e) => e.class === "practice" && (e.tags ?? []).includes("ibadat-browser"));
    expect(practices.filter((e) => ibadatTagTopics(e).length > 0).length).toBeGreaterThanOrEqual(41);
  });
});
