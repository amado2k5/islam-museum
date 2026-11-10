import { describe, expect, it } from "vitest";
import { epubModified, nodeDays, nodeIdOfSegment } from "./epub-meta";

describe("epub modified stamp", () => {
  it("is the newest source day, at midnight UTC, whatever the build clock says", () => {
    expect(epubModified(["2026-10-30", "2026-11-04"], "2026-11-06T09:48:41.533Z")).toBe("2026-11-04T00:00:00Z");
    expect(epubModified(["2026-11-04", undefined, "2026-10-01"])).toBe("2026-11-04T00:00:00Z");
  });
  it("matches the EPUB 3 pattern CCYY-MM-DDThh:mm:ssZ", () => {
    expect(epubModified(["2026-11-04"])).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  });
  it("is the same on every call: no clock", () => {
    expect(epubModified(["2026-11-04"])).toBe(epubModified(["2026-11-04"]));
    expect(epubModified([], "2026-11-06T09:48:41.533Z")).toBe(epubModified([], "2026-11-06T23:59:59.000Z"));
  });
  it("falls back to the build commit day, then SOURCE_DATE_EPOCH, then the zip epoch", () => {
    expect(epubModified([], "2026-11-06T09:48:41.533Z", "0")).toBe("2026-11-06T00:00:00Z");
    expect(epubModified([], undefined, "86400")).toBe("1970-01-02T00:00:00Z");
    expect(epubModified([], undefined, undefined)).toBe("1980-01-01T00:00:00Z");
    expect(epubModified(["not a day", ""], undefined, undefined)).toBe("1980-01-01T00:00:00Z");
  });
});

describe("kids' book sources", () => {
  it("maps URL segments back to classes", () => {
    expect(nodeIdOfSegment("person", "al-khwarizmi")).toBe("person/al-khwarizmi");
    expect(nodeIdOfSegment("questions", "why-fast")).toBe("question/why-fast");
    expect(nodeIdOfSegment("exhibits", "hijra")).toBe("exhibit/hijra");
  });
  it("reads the data and prose days of a node", () => {
    expect(nodeDays({ updated: "2026-11-01", prose: { ar: { updated: "2026-11-05" }, en: {} } }, "ar")).toEqual(["2026-11-01", "2026-11-05"]);
    expect(nodeDays({ updated: "2026-11-01", prose: { ar: { updated: "2026-11-05" } } }, "ur")).toEqual(["2026-11-01"]);
    expect(nodeDays(undefined, "ar")).toEqual([]);
  });
});
