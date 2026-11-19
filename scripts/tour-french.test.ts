import { describe, expect, it } from "vitest";
import { viewExhibits, viewHalls, viewJourneys } from "../site/src/lib/tour";

describe("French tour fallback", () => {
  it("uses English fields until French data arrives", () => {
    const label = { ar: "a", en: "e", ur: "u" };
    const exhibit = { id: "x", build: "vase", record: "object/x", sources: [], label, desc: label };
    expect(viewExhibits([exhibit], "fr")[0]).toMatchObject({ label: "e", desc: "e", material: "", museum: "" });
    expect(viewHalls([{ wing: "time", stops: [exhibit] }], "fr")[0].stops[0]).toMatchObject({ label: "e", desc: "e" });
    expect(viewJourneys([{ id: "x", kind: "x", build: "x", title: label, sub: label, lines: { ar: ["a"], en: ["e"] } }], "fr")[0].lines).toEqual(["e"]);
    expect(viewExhibits([{ ...exhibit, label: { ...label, fr: "f" } }], "fr")[0].label).toBe("f");
  });
  it("handles empty collections", () => {
    expect(viewExhibits([], "fr")).toEqual([]);
    expect(viewHalls([], "fr")).toEqual([]);
    expect(viewJourneys([], "fr")).toEqual([]);
  });
});
