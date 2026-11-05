import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { deriveInventionEdges, type Compiled, type Node } from "./build-graph.js";
import { inventionApiData } from "./export-api.js";
import { loadEntities, loadPredicates, p, resolvePredicate } from "./lib.js";
import { missingInventionHeadings, validateAll } from "./validate.js";

const schema = (name: string) => JSON.parse(readFileSync(p("schema", `${name}.schema.json`), "utf8"));
const predicates = loadPredicates();

describe("invention class and ties", () => {
  it("registers the class, domain, and attribution enums", () => {
    expect(schema("_base").properties.class.enum).toContain("invention");
    expect(schema("invention").properties.domain.enum).toHaveLength(19);
    expect(schema("invention").properties.disciplines.items.enum).toContain("engineering");
    expect(schema("invention").properties.attribution.properties.status.enum).toEqual(["original", "improvement", "transmission", "contested", "legend"]);
  });

  it("adds sourced invention ties only to the documented existing classes", () => {
    for (const cls of ["person", "object", "work", "building", "place", "event", "concept"]) {
      expect(schema(cls).properties.inventions, cls).toBeDefined();
      expect(schema(cls).properties.inventions.items.required, cls).toContain("sources");
    }
    expect(schema("source").properties.inventions).toBeUndefined();
  });

  it("resolves shared inverse names by their endpoint classes and keeps symmetric predicates valid", () => {
    expect(resolvePredicate(predicates, "sibling_of", "person", "person")?.reversed).toBe(false);
    expect(resolvePredicate(predicates, "exemplified_by", "invention", "object")?.canonical).toBe("example_of");
    expect(resolvePredicate(predicates, "exemplified_by", "concept", "object")?.canonical).toBe("exemplifies");
  });

  it("requires a source-backed Sunni basis for the named inventor", () => {
    const records = loadEntities().map(({ entity }) => entity);
    const source = records.find((entity) => entity.class === "source")!.id;
    const place = records.find((entity) => entity.class === "place")!.id;
    const media = records.find((entity) => entity.class === "media")!.id;
    const fixture = {
      id: "invention/validator-probe",
      class: "invention",
      label: { ar: "اختبار", en: "Test", ur: "آزمائش" },
      summary: { ar: "اختبار.", en: "Test.", ur: "آزمائش۔" },
      names: [],
      domain: "mathematics",
      kind: "method",
      disciplines: ["mathematics"],
      era: {
        origins: "first-century",
        first_attested: { edtf: "0622", calendar: "julian", precision: "year", status: "historical", sources: [source] },
        status_today: "extinct",
      },
      origin: { place, context: { ar: "سياق.", en: "Context.", ur: "سیاق۔" } },
      makers: [{ person: "person/nonexistent-inventions-test", role: "inventor", sources: [source] }],
      attribution: {
        status: "original",
        claim: { ar: "دعوى.", en: "Claim.", ur: "دعویٰ۔" },
        basis: { ar: "أساس.", en: "Basis.", ur: "بنیاد۔" },
        perspectives: [],
      },
      precursors: [],
      dependents: [],
      spread: [],
      impact: {
        fields: ["mathematics"],
        changed: { ar: "تغيير.", en: "Change.", ur: "تبدیلی۔" },
        history: { ar: "تاريخ.", en: "History.", ur: "تاریخ۔" },
      },
      described_in: [],
      examples: [],
      sites: [],
      concepts: [],
      today: { form: { ar: "شكل.", en: "Form.", ur: "صورت۔" }, descendants: { ar: "لاحق.", en: "Descendants.", ur: "بعد کی صورتیں۔" } },
      media: { diagram: media },
      sources: [source],
      provenance: { source: "fixture", generated_by: "test", model: "test", run: "inventions-test" },
      status: { review: "draft" },
    };
    const result = validateAll([{ entity: fixture, file: p("data", "invention", "validator-probe.yaml") }]);
    const messages = result.issues.filter((issue) => issue.file.endsWith("validator-probe.yaml")).map((issue) => issue.msg);
    expect(messages).toContain("makers[0].person: person/nonexistent-inventions-test has no source-backed Sunni faith entry");
  });

  it("checks the required invention article headings", () => {
    expect(missingInventionHeadings("ar", "## الموجز\n")).toContain("ما هو");
    expect(missingInventionHeadings("en", "## Summary\n")).toContain("What it is");
  });
});

const makeNode = (id: string, cls: string, data: Record<string, any> = {}, stub = false): Node => ({
  id,
  class: cls,
  slug: id.split("/")[1],
  label: { ar: id, en: id, ur: id },
  summary: { ar: "", en: "", ur: "" },
  stub,
  wings: [],
  regions: [],
  periods: [],
  tags: [],
  aliases: [],
  themes: [],
  data,
  prose: {},
  degree: 0,
  contemporaries: [],
  updated: "2026-11-05",
});

describe("derived invention graph and API", () => {
  it("derives sourced maker, chain, spread, and example edges once with inverses", () => {
    const entities = [
      { id: "person/test-maker", class: "person", label: {}, summary: {}, inventions: [{ invention: "invention/test", role: "inventor", sources: ["source/person"] }] },
      {
        id: "invention/test", class: "invention", label: {}, summary: {},
        makers: [{ person: "person/test-maker", role: "inventor", sources: ["source/invention"] }],
        precursors: [{ invention: "invention/precursor", sources: ["source/chain"] }],
        dependents: [],
        spread: [{ place: "place/test", sources: ["source/spread"] }],
        examples: ["object/test"],
        described_in: ["work/test"],
        sources: ["source/invention"],
      },
    ];
    const edges = deriveInventionEdges(entities, predicates, new Set([
      "person/test-maker", "invention/test", "invention/precursor", "place/test", "object/test", "work/test",
    ]));
    const edge = (from: string, to: string, type: string) => edges.find((item) => item.from === from && item.to === to && item.type === type);
    expect(edge("person/test-maker", "invention/test", "invented")?.sources).toEqual(["source/invention", "source/person"]);
    expect(edge("invention/test", "invention/precursor", "built_on")?.derived).toBe(true);
    expect(edge("invention/precursor", "invention/test", "enabled")?.inverse).toBe(true);
    expect(edge("invention/test", "place/test", "spread_to")).toBeDefined();
    expect(edge("object/test", "invention/test", "example_of")).toBeDefined();
    expect(edge("work/test", "invention/test", "described")).toBeDefined();
  });

  it("exports a complete empty-capable filter list and internal/external chain nodes", () => {
    const predecessor = makeNode("invention/predecessor", "invention", { domain: "mathematics", era: { origins: "first-century" } });
    const innovation = makeNode("invention/innovation", "invention", {
      domain: "mathematics",
      era: { origins: "abbasid-golden" },
      makers: [{ person: "person/test-maker", role: "inventor" }],
      attribution: { status: "improvement" },
      origin: { place: "place/test" },
      precursors: [
        { invention: predecessor.id, note: "Internal link", sources: ["source/chain"] },
        { external: { ar: "مضخة", en: "Force pump" }, note: "External link", sources: ["source/chain"] },
      ],
      dependents: [{ external: { ar: "آلة لاحقة", en: "Later machine" }, note: "Later use", sources: ["source/chain"] }],
      media: { image: "media/image", diagram: "media/diagram" },
      impact: { significance: 3 },
    });
    const place = makeNode("place/test", "place");
    place.coordinates = [40.0, 35.0];
    const coverage: Compiled["coverage"] = {
      entities: 0, stubs: 0, byClass: {}, byWing: {}, byPeriod: {}, byRegion: {}, byTheme: {}, emptyThemes: [],
      byReview: {}, proseByLang: {}, avgSourcesPerEntity: 0, womenShare: null, wanted: [],
    };
    const compiled: Compiled = { generated: "2026-11-05", commit: null, nodes: [innovation, predecessor, place], edges: [], coverage };
    const data = inventionApiData(compiled);
    const items = data.inventions.items;
    expect(items).toHaveLength(2);
    expect(data.inventions.filters.domains).toHaveLength(19);
    expect(data.inventions.filters.eras).toContain("twenty-first-century");
    expect(items.find((item) => item.id === innovation.id)?.origin.coordinates).toEqual([40.0, 35.0]);
    expect(data.chains.nodes.map((node) => node.id)).toEqual([
      "external:force%20pump", "external:later%20machine", "invention/innovation", "invention/predecessor",
    ]);
    expect(data.chains.edges).toEqual(expect.arrayContaining([
      expect.objectContaining({ from: innovation.id, to: predecessor.id, type: "built_on", derived: true }),
      expect.objectContaining({ from: innovation.id, type: "built_on", notes: ["External link"] }),
      expect.objectContaining({ to: innovation.id, type: "built_on", notes: ["Later use"] }),
    ]));

    const empty = inventionApiData({ ...compiled, nodes: [place] });
    expect(empty.inventions.items).toEqual([]);
    expect(empty.inventions.filters.domains).toHaveLength(19);
    expect(empty.chains.nodes).toEqual([]);
    expect(empty.chains.edges).toEqual([]);
  });
});
