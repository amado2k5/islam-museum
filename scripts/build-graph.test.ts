import { beforeEach, describe, expect, it } from "vitest";
import { compile } from "./build-graph";
import { derive } from "./derive";

// The whole graph is compiled once for this file and shared by every test: the compiled graph holds every prose file
// of every language (about 3 GB of memory in November 2026). These tests were part of scripts/pipeline.test.ts, which
// also validates the whole repository and compiled the graph a second time; one test process could no longer hold
// all of that. No test was dropped and no rule relaxed: the same assertions run here, in their own process.
beforeEach(() => new Promise<void>((resolve) => setTimeout(resolve, 0)));

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
    expect(c.nodes.find((x) => x.id === "work/sharh-sahih-muslim-al-nawawi")!.stub).toBe(true);
    expect(Object.keys(c.nodes.find((x) => x.id === "person/ibn-sina")!.prose)).toEqual(expect.arrayContaining(["ar", "en", "ur"]));
    expect(c.nodes.find((x) => x.id === "person/ibrahim")!.prose.fr).toBeTruthy();
  });
  it("derives timeline and map layers (GeoJSON is [lon, lat])", () => {
    const d = derive(c);
    expect(d.timeline.length).toBeGreaterThan(0);
    const mecca = d.map.features.find((f) => f.id === "place/mecca")!;
    expect(mecca.geometry.coordinates[0]).toBeCloseTo(39.83, 1);
  }, 900_000); // full-corpus derive ~2-4 min in CI; default 300 s times out under load
  it("has all 114 suras and 6,236 ayat (docs/plan/15 §6.3 acceptance test 3)", () => {
    expect(c.nodes.filter((n) => n.class === "passage" && n.data.unit === "sura").length).toBe(114);
    expect(c.nodes.filter((n) => n.class === "passage" && n.data.unit === "ayah").length).toBe(6236);
  });
});
