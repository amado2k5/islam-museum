import { describe, expect, it } from "vitest";
import type { Edge, Node } from "./build-graph.js";
import { companionIndex, deathAH, decadeKey, decadeOrder, isCompanion } from "./companions.js";

const node = (id: string, data: Record<string, any> = {}, stub = false): Node => ({
  id, class: id.split("/")[0], slug: id.split("/")[1], label: { ar: id, en: id, ur: id }, summary: { ar: "", en: "", ur: "" }, stub,
  wings: [], regions: [], periods: [], tags: [], aliases: [], themes: [], data, prose: {}, degree: 0, contemporaries: [], updated: "2026-11-10",
} as Node);
const edge = (from: string, type: string, to: string, extra: Partial<Edge> = {}): Edge => ({ from, to, type, inverse: false, ...extra } as Edge);

describe("Companions Browser selection and facets (docs/plan/29-companions-browser.md)", () => {
  it("selects by role, story role or membership of the Companion roll, never a stub or a non-person", () => {
    expect(isCompanion(node("person/a", { roles: ["companion"] }))).toBe(true);
    expect(isCompanion(node("person/b", { story_roles: [{ role: "companion" }] }))).toBe(true);
    expect(isCompanion(node("person/c"), [edge("person/c", "member_of", "group/sahaba")])).toBe(true);
    expect(isCompanion(node("person/d", { roles: ["scholar"] }))).toBe(false);
    expect(isCompanion(node("person/e", { roles: ["companion"] }, true))).toBe(false);
    expect(isCompanion(node("group/f", { roles: ["companion"] }))).toBe(false);
  });

  it("reads the Hijri death year, or derives it from the Gregorian date", () => {
    expect(deathAH({ died: { hijri: "0040-09-17", edtf: "0661-01-28" } })).toEqual({ year: 40, derived: false });
    expect(deathAH({ died: { edtf: "0660~", calendar: "julian" } })).toEqual({ year: 40, derived: true });
    expect(deathAH({ died: { edtf: "06XX" } })).toBeUndefined();
    expect(deathAH({})).toBeUndefined();
  });

  it("buckets Hijri years into decades 1-10, 11-20, ... with a before-the-Hijra bucket first", () => {
    expect([decadeKey(1), decadeKey(10), decadeKey(11), decadeKey(40), decadeKey(0)]).toEqual(["1", "1", "11", "31", "bh"]);
    expect(["31", "bh", "1"].sort((a, b) => decadeOrder(a) - decadeOrder(b))).toEqual(["bh", "1", "31"]);
  });

  it("groups Companions into the Ten, circles, clans, events, women and death decades", () => {
    const nodes = [
      node("person/a", { roles: ["companion"], gender: "female", died: { hijri: "0011" } }),
      node("person/b", { roles: ["companion"], died: { hijri: "0035" } }),
      node("person/x", { roles: ["scholar"] }),
      node("group/sahaba"), node("group/ansar"), node("group/banu-hashim"), node("event/battle-of-badr"),
      node("exhibit/path-ashara", { rooms: [{ features: ["person/b", "event/battle-of-badr"] }] }),
    ];
    const edges = [
      edge("person/a", "member_of", "group/sahaba"), edge("person/a", "member_of", "group/ansar"),
      edge("person/b", "member_of", "group/banu-hashim"), edge("person/b", "participated_in", "event/battle-of-badr", { role: "fighter" }),
      edge("person/b", "participated_in", "event/battle-of-badr"), edge("person/x", "member_of", "group/ansar"),
      edge("group/ansar", "member_of", "person/a", { inverse: true }),
    ];
    const idx = companionIndex(nodes, edges);
    expect(idx.ids).toEqual(["person/a", "person/b"]);
    expect(idx.ten).toEqual(["person/b"]);
    expect(idx.circles.get("group/ansar")).toEqual(["person/a"]);
    expect(idx.clans.get("group/banu-hashim")).toEqual(["person/b"]);
    expect(idx.clans.has("group/sahaba")).toBe(false);
    expect(idx.events.get("event/battle-of-badr")).toEqual([{ id: "person/b", role: "fighter" }]);
    expect(idx.women).toEqual(["person/a"]);
    expect(idx.decades.get("11")).toEqual(["person/a"]);
    expect(idx.decades.get("31")).toEqual(["person/b"]);
  });
});
