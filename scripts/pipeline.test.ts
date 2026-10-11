import { describe, expect, it } from "vitest";
import { compile } from "./build-graph";
import { derive } from "./derive";
import { edtfRange } from "./lib";
import { hijriCeMismatch, hijriProblem, validateAll } from "./validate";
import { p } from "./lib";

describe("validate", () => {
  it("the repository content has no errors", () => {
    const { issues } = validateAll();
    expect(issues.filter((i) => i.level === "error")).toEqual([]);
  });
  it("rejects malformed Hijri dates", () => {
    expect(hijriProblem("0428-09")).toBeNull();
    expect(hijriProblem("0370~")).toBeNull();
    expect(hijriProblem("0428-13")).toMatch(/month/);
    expect(hijriProblem("0428-09-31")).toMatch(/day/);
    expect(hijriProblem("428")).toMatch(/malformed/);
  });
  it("flags a Hijri year that disagrees with the EDTF year", () => {
    expect(hijriCeMismatch({ edtf: "1037-06", hijri: "0428-09" })).toBeNull();
    expect(hijriCeMismatch({ edtf: "1037-06", hijri: "0300-09" })).toMatch(/apart/);
    expect(hijriCeMismatch({ edtf: "0622-09", hijri: "0001-02", calendar: "julian" })).toBeNull();
  });
});

describe("edtf ranges", () => {
  it("expresses uncertainty as a range", () => {
    const r = edtfRange("099X");
    expect(r.earliest).toBeCloseTo(990, 0);
    expect(r.latest).toBeCloseTo(1000, 0);
  });
});

describe("build-graph", () => {
  const c = compile();
  const edge = (from: string, to: string, type: string) => c.edges.find((e) => e.from === from && e.to === to && e.type === type);
  it("computes inverse edges", () => {
    expect(edge("person/ibn-sina", "place/hamadan", "died_in")?.inverse).toBe(false);
    expect(edge("place/hamadan", "person/ibn-sina", "death_place_of")?.inverse).toBe(true);
  });
  it("normalises edges written with an inverse predicate", () => {
    // ibn-sina writes patronized_by -> ala-al-dawla; canonical form is ala-al-dawla patron_of ibn-sina
    expect(edge("person/ala-al-dawla-muhammad", "person/ibn-sina", "patron_of")?.inverse).toBe(false);
  });
  it("normalises dates to numeric ranges", () => {
    const n = c.nodes.find((x) => x.id === "person/ibn-sina")!;
    expect(n.span!.earliest).toBeCloseTo(980, 0);
    expect(n.span!.latest).toBeCloseTo(1037.5, 0);
  });
  it("marks unwritten targets as stubs and attaches prose by language", () => {
    expect(c.nodes.find((x) => x.id === "work/al-qanun-fi-al-tibb")!.stub).toBe(true);
    expect(Object.keys(c.nodes.find((x) => x.id === "person/ibn-sina")!.prose).sort()).toEqual(["ar", "en"]);
  });
  it("derives timeline and map layers (GeoJSON is [lon, lat])", () => {
    const d = derive(c);
    expect(d.timeline.length).toBeGreaterThan(0);
    const mecca = d.map.features.find((f) => f.id === "place/mecca")!;
    expect(mecca.geometry.coordinates[0]).toBeCloseTo(39.83, 1);
  });
});

// ---- rules added with docs 12-15 ----
const base = (cls: string, slug: string, extra: Record<string, any>) => ({
  file: p("data", cls, `${slug}.yaml`),
  entity: {
    id: `${cls}/${slug}`, class: cls, label: { en: "T", ar: "ت" }, summary: { en: "t", ar: "ت" },
    sources: ["source/gutas-2014"], status: { review: "draft" }, ...extra,
  },
});
const run = (...e: ReturnType<typeof base>[]) => validateAll(e).issues;
const msgs = (i: ReturnType<typeof run>, level: "error" | "warn") => i.filter((x) => x.level === level).map((x) => x.msg).join("\n");

describe("rules from docs 12-15", () => {
  it("rejects data from layers that may not enter CC0 data", () => {
    const i = run(base("place", "zz-test-a", { kind: "city", provenance: { layer: "by-sa" } }));
    expect(msgs(i, "error")).toMatch(/may not enter data/);
    expect(msgs(run(base("place", "zz-test-b", { kind: "city", provenance: { layer: "cc0" } })), "error")).toBe("");
  });
  it("warns when a conflict lists fewer than two sides", () => {
    const i = run(base("event", "zz-test-c", { kind: "battle", sides: [{ label: { en: "A" } }] }));
    expect(msgs(i, "warn")).toMatch(/both sides/);
    const ok = run(base("event", "zz-test-d", { kind: "battle", sides: [{ label: { en: "A" } }, { label: { en: "B" } }] }));
    expect(msgs(ok, "warn")).not.toMatch(/both sides/);
  });
  it("requires two cited voices on a tension card", () => {
    const card = (voices: number) => ({ id: "tension/x", kind: "textual", statement: { en: "s" },
      responses: Array.from({ length: voices }, () => ({ tradition: "sunni", summary: "r", sources: ["source/gutas-2014"] })) });
    expect(msgs(run(base("question", "zz-test-e", { question: { en: "q" }, tensions: [card(1)] })), "error")).toMatch(/two cited voices/);
    expect(msgs(run(base("question", "zz-test-f", { question: { en: "q" }, tensions: [card(2)] })), "error")).toBe("");
  });
  it("never links polemical screen works for viewing", () => {
    const e = base("screen", "zz-test-g", { format: "film", relevance: "primary", titles: [{ lang: "en", value: "X" }],
      sensitivity: "polemical", approach: "polemical", watch: [{ kind: "archive", url: "https://example.org/x" }] });
    expect(msgs(run(e), "error")).toMatch(/never linked for viewing/);
  });
  it("rejects unknown themes and story roles", () => {
    expect(msgs(run(base("person", "zz-test-h", { themes: ["no-such-theme"] })), "error")).toMatch(/themes/);
    expect(msgs(run(base("person", "zz-test-i", { story_roles: [{ role: "no-such-role" }] })), "error")).toMatch(/role/);
  });
  it("resolves references inside story roles", () => {
    expect(msgs(run(base("person", "zz-test-j", { story_roles: [{ role: "ruler", toward: "polity/nowhere" }] })), "error")).toMatch(/does not exist/);
  });
});
