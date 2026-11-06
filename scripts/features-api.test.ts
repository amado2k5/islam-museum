import { describe, expect, it } from "vitest";
import type { Compiled, Node } from "./build-graph.js";
import { featureApiData } from "./export-api.js";

const makeNode = (id: string, cls: string, data: Record<string, any> = {}, prose: Record<string, any> = {}): Node => ({
  id, class: cls, slug: id.split("/")[1], label: { ar: id, en: id, ur: id }, summary: { ar: "", en: "", ur: "" }, stub: false,
  wings: [], regions: [], periods: [], tags: [], aliases: [], themes: [], data, prose, degree: 0, contemporaries: [], updated: "2026-11-06",
});
const coverage: Compiled["coverage"] = {
  entities: 0, stubs: 0, byClass: {}, byWing: {}, byPeriod: {}, byRegion: {}, byTheme: {}, emptyThemes: [],
  byReview: {}, proseByLang: {}, avgSourcesPerEntity: 0, womenShare: null, wanted: [],
};

describe("one API export per browser or explorer (AGENTS.md: every feature is graph, API and search)", () => {
  const job = makeNode("job/scribe", "job", { kind: "office", domain: "court-administration", hirfa: false }, { ar: {} });
  const holder = makeNode("person/katib", "person", { occupations: [{ job: "job/scribe", kind: "primary", sources: ["source/x"] }] });
  const fatwa = makeNode("work/fatwa-x", "work", { kind: "fatwa", publisher: "group/dar-al-ifta", url: "https://example.org" });
  const sermon = makeNode("work/khutba-x", "work", { kind: "sermon", delivered: { by: "person/khatib" }, order: 2 });
  const poem = makeNode("work/poem-x", "work", { kind: "poem", authors: ["person/poet"], metre: "tawil" });
  const film = makeNode("screen/film-x", "screen", { format: "film", relevance: "primary", released: { edtf: "1976" }, countries: ["lb"] });
  const book = makeNode("work/book-x", "work", { kind: "book" });
  const compiled: Compiled = {
    generated: "2026-11-06T00:00:00Z", commit: null, coverage,
    nodes: [job, holder, fatwa, sermon, poem, film, book],
    edges: [{ from: "work/fatwa-x", to: "person/mufti", type: "issued_by", inverse: true }],
  };

  it("writes jobs, fatwa, khutab, poetry and screens with their fields, edges, prose languages and job holders", () => {
    const data = featureApiData(compiled);
    expect(Object.keys(data).sort()).toEqual(["fatwa.json", "jobs.json", "khutab.json", "poetry.json", "screens.json"]);
    expect(data["jobs.json"].items[0]).toMatchObject({ id: "job/scribe", domain: "court-administration", hirfa: false, holders: ["person/katib"], prose: ["ar"] });
    expect(data["fatwa.json"].items[0]).toMatchObject({ id: "work/fatwa-x", publisher: "group/dar-al-ifta", connections: [{ type: "issued_by", to: "person/mufti", inverse: true }] });
    expect(data["khutab.json"].items[0]).toMatchObject({ id: "work/khutba-x", delivered: { by: "person/khatib" }, order: 2 });
    expect(data["poetry.json"].items[0]).toMatchObject({ id: "work/poem-x", metre: "tawil", authors: ["person/poet"] });
    expect(data["screens.json"].items[0]).toMatchObject({ id: "screen/film-x", format: "film", countries: ["lb"] });
    expect(data["poetry.json"].items.map((i) => i.id)).not.toContain("work/book-x");
    expect(data["jobs.json"].feature).toBe("job-browser");
  });

  it("is empty-capable", () => {
    const data = featureApiData({ ...compiled, nodes: [book], edges: [] });
    for (const body of Object.values(data)) expect(body.items).toEqual([]);
  });
});
