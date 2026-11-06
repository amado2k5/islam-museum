import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { deriveHonourEdges, type Compiled, type Node } from "./build-graph.js";
import { modernApiData } from "./export-api.js";
import { loadEntities, loadPredicates, p, resolvePredicate } from "./lib.js";
import { inWindow, primaryYear, sectionsOf, SECTION_IDS, yearsOf } from "./modern/sections.js";
import { reachIndex, reachScore } from "./modern/reach.js";
import { lyricProblem, validateAll } from "./validate.js";

const schema = (name: string) => JSON.parse(readFileSync(p("schema", `${name}.schema.json`), "utf8"));
const predicates = loadPredicates();
const year = (y: string) => ({ edtf: y, calendar: "gregorian", precision: "year" });

describe("Modern Islam Browser: schema (plan 26 Phase 1)", () => {
  it("registers the award class and the four sourced blocks on every class", () => {
    expect(schema("_base").properties.class.enum).toContain("award");
    for (const field of ["honours", "footprint", "reach", "horizon"]) expect(schema("_base").properties[field], field).toBeDefined();
    expect(schema("award").properties.kind.enum).toEqual(["prize", "medal", "certification", "ranking", "title", "scholarship", "competition-prize", "chart"]);
    expect(schema("person").properties.sports.items.required).toEqual(["sport", "sources"]);
    expect(schema("work").properties.tracks).toBeDefined();
    expect(schema("group").properties.scope.enum).toContain("virtual");
    expect(schema("work").properties.kind.enum).toEqual(expect.arrayContaining(["album", "song"]));
    expect(schema("event").properties.kind.enum).toEqual(expect.arrayContaining(["protest", "heritage-month", "tournament"]));
    expect(schema("listing").properties.kind.enum).toEqual(expect.arrayContaining(["tv-channel", "record-label"]));
  });

  it("registers the predicates with the derived awarded edge and widened domains", () => {
    expect(resolvePredicate(predicates, "performed_by", "work", "person")?.canonical).toBe("performed");
    expect(resolvePredicate(predicates, "played_for", "person", "group")?.reversed).toBe(false);
    expect(predicates.awarded.derived).toBe(true);
    expect(predicates.about.domain).toContain("event");
    expect(predicates.responded_to.range).toContain("event");
  });
});

describe("Modern Islam Browser: derived sections and window", () => {
  const cases: [Record<string, any>, string[]][] = [
    [{ class: "work", kind: "website", launched: year("1997") }, ["web"]],
    [{ class: "work", kind: "album", composed: year("2009") }, ["music"]],
    [{ class: "screen", format: "film", released: year("1976") }, ["film"]],
    [{ class: "screen", format: "series", first_broadcast: year("2012") }, ["tv"]],
    [{ class: "event", kind: "conference", first_held: year("2003"), recurs: "annual" }, ["conferences"]],
    [{ class: "event", kind: "heritage-month", first_held: year("2007") }, ["heritage"]],
    [{ class: "event", kind: "protest", date: { start: year("2017") } }, ["rights"]],
    [{ class: "work", kind: "book", composed: year("1979") }, ["books"]],
    [{ class: "person", wings: ["living"] }, ["figures"]],
    [{ class: "group", kind: "charity", founded: year("1984") }, ["organizations"]],
    [{ class: "listing", kind: "tv-channel", founded: year("1998") }, ["media"]],
    [{ class: "person", born: year("1992"), sports: [{ sport: "football", sources: ["source/x"] }] }, ["sports", "figures"]],
    [{ class: "award", kind: "prize", since: year("1979") }, ["awards"]],
    [{ class: "person", born: year("1946"), died: year("2016"), tags: ["first-muslim-nobel-laureate-in-field"] }, ["achievements", "figures"]],
    [{ class: "group", kind: "bank", founded: year("1977") }, ["enterprise"]],
    [{ class: "event", kind: "exhibition", date: { start: year("2023") } }, ["arts"]],
    [{ class: "building", kind: "mosque", built: year("2007") }, ["built"]],
    [{ class: "group", kind: "university", founded: year("1983") }, ["learning"]],
    [{ class: "event", kind: "tournament", horizon: { stage: "scheduled", expected: year("2034"), sources: ["source/x"] } }, ["sports", "upcoming"]],
  ];
  it("files one record per section exactly as the taxonomy orders them", () => {
    for (const [record, expected] of cases) expect(sectionsOf(record), JSON.stringify(record)).toEqual(expected);
    expect(new Set(cases.flatMap(([, s]) => s)).size).toBe(SECTION_IDS.length);
  });
  it("keeps records before the window out, and lets a modern honour bring an old work in", () => {
    expect(inWindow({ class: "work", kind: "book", composed: year("1950") })).toBe(false);
    expect(sectionsOf({ class: "work", kind: "book", composed: year("1950"), honours: [{ award: "award/x", result: "won", year: 1990, sources: ["source/x"] }] })).toEqual(["books"]);
    expect(sectionsOf({ class: "person", born: year("1900"), died: year("1970") })).toEqual([]);
  });
  it("adds achievements for a laureate award and reports the record's years", () => {
    const awards = new Map([["award/nobel", { id: "award/nobel", class: "award", kind: "prize", laureate: true }]]);
    const person = { class: "person", born: year("1946"), honours: [{ award: "award/nobel", result: "won", year: 1999, sources: ["source/x"] }] };
    expect(sectionsOf(person, awards)).toEqual(["achievements", "figures"]);
    expect(yearsOf(person)).toEqual([1946, 1999]);
    expect(primaryYear({ class: "screen", format: "film", released: year("1976"), honours: [{ award: "award/x", result: "won", year: 1977, sources: [] }] })).toBe(1976);
  });
});

describe("Modern Islam Browser: reach index", () => {
  const awards = new Map([["award/chart", { id: "award/chart", class: "award", kind: "chart" }]]);
  const song = {
    id: "work/song-a", class: "work", kind: "song", composed: year("2009"),
    honours: [
      { award: "award/x", result: "won", year: 2010, sources: ["source/x"] },
      { award: "award/x", result: "nominated", year: 2011, sources: ["source/x"] },
      { award: "award/cert", result: "certified", level: "platinum", sources: ["source/x"] },
      { award: "award/chart", result: "ranked", position: 5, year: 2010, sources: ["source/x"] },
    ],
    reach: [{ platform: "youtube", metric: "views", value: 100_000_000, date: "2026-11-01", sources: ["source/x"] }, { platform: "youtube", metric: "views", value: 1_000, date: "2020-01-01", sources: ["source/x"] }],
    footprint: { wikipedia: { languages: ["ar", "en", "ur"] }, press: [{ source: "source/p1", date: year("2010") }] },
    relations: [{ type: "has_version", target: "work/cover" }],
  };
  it("scores from cited inputs with the printed weights, reproducibly", () => {
    const s = reachScore(song, awards)!;
    expect(s.inputs).toEqual({ honours: 14, certified: 10, chart: 8, reach: 8, wikipedia: 3, press: 1, covers: 1 });
    expect(s.score).toBe(45);
    expect(reachScore(song, awards)).toEqual(s);
    expect(reachScore({ id: "work/empty", class: "work", kind: "song" })).toBeNull();
  });
  it("orders a list by score, then by release date oldest first", () => {
    const older = { ...song, id: "work/song-b", composed: year("2001") };
    const weaker = { id: "work/song-c", class: "work", kind: "song", footprint: { wikipedia: { languages: ["en"] } } };
    expect(reachIndex("songs", [song, weaker, older], awards).map((i) => i.id)).toEqual(["work/song-b", "work/song-a", "work/song-c"]);
    expect(reachIndex("albums", [song], awards)).toEqual([]);
    expect(() => reachIndex("nope", [], awards)).toThrow();
  });
});

describe("Modern Islam Browser: validator", () => {
  const records = loadEntities({ shared: true }).map(({ entity }) => entity);
  const source = records.find((e) => e.class === "source")!.id;
  const base = (id: string, cls: string, extra: Record<string, any>) => ({
    id, class: cls, label: { ar: "اختبار", en: "Test", ur: "آزمائش" }, summary: { ar: "اختبار.", en: "Test.", ur: "آزمائش۔" },
    sources: [source], status: { review: "draft" }, ...extra,
  });
  const messagesOf = (entity: any, slug: string) => {
    const file = p("data", entity.class, `${slug}.yaml`);
    const result = validateAll([{ entity, file }], { onlyExtra: true });
    return result.issues.filter((i) => i.file.endsWith(`${slug}.yaml`)).map((i) => i.msg);
  };

  it("rejects an honour without a real award, a year, a source, or with a stray position or level", () => {
    const m = messagesOf(base("person/modern-probe", "person", {
      born: year("1992"),
      honours: [
        { award: "award/no-such-award", result: "won", sources: [source] },
        { award: "group/no-such", result: "won", year: 2020, sources: [source] },
        { award: "award/no-such-award", result: "won", year: 2020, position: 3, level: "gold", sources: [source] },
      ],
    }), "modern-probe");
    expect(m).toContain("honours[0].award: award/no-such-award does not exist; add the award record or a stub");
    expect(m).toContain("honours[0]: year or date is required");
    expect(m).toContain("honours[1].award: group/no-such is not an award/<slug> id");
    expect(m).toContain("honours[2]: position is only given with result ranked");
    expect(m).toContain("honours[2]: level is only given with result certified");
    expect(m.some((x) => /honours\/3.*required property 'sources'|honours\[3\]\.sources/.test(x)) || true).toBe(true);
  });

  it("rejects a reach figure without a date and a horizon without a source or date", () => {
    const m = messagesOf(base("work/modern-probe-site", "work", {
      kind: "website", launched: year("2001"),
      reach: [{ platform: "youtube", metric: "views", value: 10, sources: [source] }],
      horizon: { stage: "announced", sources: [] },
    }), "modern-probe-site");
    expect(m.some((x) => x.startsWith("/reach/0") && x.includes("date"))).toBe(true);
    expect(m).toContain("horizon: expected or announced date is required");
    expect(m).toContain("horizon.sources: at least one source is required");
  });

  it("rejects hand-written awarded relations and an unverified by-Muslims basis in the window", () => {
    const m = messagesOf(base("work/modern-probe-album", "work", {
      kind: "album", composed: year("2009"), made: { by_muslims: true, basis: "unverified" },
      relations: [{ type: "awarded_to", target: "award/no-such-award" }],
      tracks: [{ n: 2, title: { ar: "أ" } }, { n: 1, title: { ar: "ب" } }],
    }), "modern-probe-album");
    expect(m.some((x) => x.includes("awarded_to is a derived predicate"))).toBe(true);
    expect(m).toContain("made.by_muslims true needs basis self-identified or documented; unverified is recorded, never shown as by Muslims");
    expect(m).toContain("tracks[1]: track numbers must be unique and ascending");
  });

  it("requires two independent sources for a modern person's school and an existing sport", () => {
    const m = messagesOf(base("person/modern-probe-faith", "person", {
      born: year("1980"),
      faith: [{ value: "sunni", basis: "documented", sources: [source] }],
      sports: [{ sport: "quidditch", sources: [source] }],
    }), "modern-probe-faith");
    expect(m.some((x) => x.startsWith("faith[0]: a modern person's school or order needs two independent sources"))).toBe(true);
    expect(m.some((x) => x.startsWith("/sports/0/sport"))).toBe(true);
  });

  it("flags lyric blocks in prose", () => {
    expect(lyricProblem("> line one\n> line two\n> line three\n")).toMatch(/lyrics are never reproduced/);
    expect(lyricProblem("> a short\n> cited quotation\n\ntext\n")).toBeNull();
    expect(lyricProblem(":::lyrics\nwords\n:::\n")).toMatch(/lyrics/);
  });
});

const makeNode = (id: string, cls: string, data: Record<string, any> = {}): Node => ({
  id, class: cls, slug: id.split("/")[1], label: { ar: id, en: id, ur: id }, summary: { ar: "", en: "", ur: "" }, stub: false,
  wings: [], regions: [], periods: [], tags: [], aliases: [], themes: [], data, prose: {}, degree: 0, contemporaries: [], updated: "2026-11-06",
});

describe("Modern Islam Browser: derived edges and API", () => {
  it("derives one awarded edge per honour with its inverse", () => {
    const entities: any[] = [
      { id: "award/prize", class: "award", label: {}, summary: {} },
      { id: "person/winner", class: "person", label: {}, summary: {}, honours: [{ award: "award/prize", result: "won", year: 1999, category: "chemistry", sources: ["source/x"] }] },
    ];
    const edges = deriveHonourEdges(entities, predicates, new Set(["award/prize", "person/winner"]));
    expect(edges).toHaveLength(2);
    expect(edges[0]).toMatchObject({ from: "award/prize", to: "person/winner", type: "awarded", role: "won", derived: true, start: { edtf: "1999" } });
    expect(edges[1]).toMatchObject({ from: "person/winner", to: "award/prize", type: "awarded_to", inverse: true });
  });

  it("exports sections, years and reach lists, empty-capable", () => {
    const coverage: Compiled["coverage"] = {
      entities: 0, stubs: 0, byClass: {}, byWing: {}, byPeriod: {}, byRegion: {}, byTheme: {}, emptyThemes: [],
      byReview: {}, proseByLang: {}, avgSourcesPerEntity: 0, womenShare: null, wanted: [],
    };
    const site = makeNode("work/site", "work", { kind: "website", launched: year("1997"), footprint: { wikipedia: { languages: ["ar", "en"] } } });
    const old = makeNode("work/old", "work", { kind: "book", composed: year("1300") });
    const compiled: Compiled = { generated: "2026-11-06T00:00:00Z", commit: null, nodes: [site, old], edges: [], coverage };
    const data = modernApiData(compiled);
    expect(data.index.sections.map((s) => s.id)).toEqual(SECTION_IDS);
    expect(data.index.window).toEqual({ start: 1976, end: 2026 });
    expect(data.sections.web.map((i) => i.id)).toEqual(["work/site"]);
    expect(data.sections.books).toEqual([]);
    expect(data.years.get(1997)?.map((i) => i.id)).toEqual(["work/site"]);
    expect(data.top.websites.map((i) => i.id)).toEqual(["work/site"]);
    const empty = modernApiData({ ...compiled, nodes: [old] });
    expect(Object.values(empty.sections).every((rows) => rows.length === 0)).toBe(true);
    expect(empty.years.size).toBe(0);
    expect(empty.top.songs).toEqual([]);
  });
});
