import { describe, expect, it } from "vitest";
import { WING_CLASSES, wingCounts } from "./wings.js";

describe("wingCounts: the per-wing totals written once to api/v1/meta/counts.json", () => {
  it("counts each counted wing by its classes and leaves the uncounted wings out", () => {
    const nodes = [{ class: "event" }, { class: "event" }, { class: "object" }, { class: "building" }, { class: "practice" }, { class: "source" }];
    expect(wingCounts(nodes)).toEqual({ time: 2, place: 0, people: 0, ideas: 0, objects: 2, words: 0 });
    expect(Object.keys(WING_CLASSES)).not.toContain("living");
  });
  it("is a plain object with the wings in a fixed order, so the JSON is byte-stable between builds", () => {
    expect(JSON.stringify(wingCounts([]))).toBe('{"time":0,"place":0,"people":0,"ideas":0,"objects":0,"words":0}');
  });
});
