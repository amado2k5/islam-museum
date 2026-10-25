import { describe, expect, it } from "vitest";
import { WING_CLASSES, featuredPool, wingCounts } from "./wings.js";

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

describe("featuredPool: the random-entry candidates of a landing wing card", () => {
  const long = "A summary long enough to stand on a landing card on its own, in plain words.";
  const node = (id: string, cls: string, extra: Record<string, unknown> = {}) => ({ id, class: cls, label: { en: id }, summary: { en: long }, ...extra });
  it("keeps the wing's classes, needs a label and a real summary in the language, and skips draft cards", () => {
    const nodes = [
      node("event/a", "event"), node("place/b", "place"),
      node("event/no-label", "event", { label: { ar: "x" } }),
      node("event/short", "event", { summary: { en: "Too short." } }),
      node("event/draft", "event", { summary: { en: "Draft card for the Battle of X; its sources are not yet checked on the page, it says." } }),
    ];
    expect(featuredPool(nodes, "time", "en").map((n) => n.id)).toEqual(["event/a"]);
    expect(featuredPool(nodes, "time", "ar")).toEqual([]);
  });
  it("uses the wings field for the uncounted wings and puts entries with prose and a fuller record first", () => {
    const nodes = [node("practice/p", "practice", { wings: ["living"] }), node("person/q", "person", { wings: ["living"], prose: { en: {} }, data: { status: { completeness: 2 } } }), node("person/r", "person")];
    expect(featuredPool(nodes, "living", "en").map((n) => n.id)).toEqual(["person/q", "practice/p"]);
  });
  it("is stable under insertion and capped at n", () => {
    const nodes = Array.from({ length: 50 }, (_, i) => node(`event/e${i}`, "event"));
    const a = featuredPool(nodes, "time", "en", 10).map((n) => n.id);
    expect(a).toHaveLength(10);
    expect(featuredPool([...nodes].reverse(), "time", "en", 10).map((n) => n.id)).toEqual(a);
    const b = featuredPool([...nodes, node("event/new", "event")], "time", "en", 10).map((n) => n.id);
    expect(b.filter((id) => id !== "event/new")).toEqual(a.slice(0, b.includes("event/new") ? 9 : 10));
  });
});
