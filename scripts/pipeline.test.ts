import { readFileSync } from "node:fs";
import { beforeEach, describe, expect, it } from "vitest";
import { compile } from "./build-graph";
import { derive } from "./derive";
import { edtfRange } from "./lib";
import { frozenQuranTextProblem, hijriCeMismatch, hijriProblem, validateAll } from "./validate";
import { p } from "./lib";
import { scan } from "./check-static";

// Each test validates the repository synchronously (seconds of CPU). Without a yield between tests the vitest worker
// cannot exchange its task updates with the runner, and on a slow CI machine the calls time out after 60 s.
beforeEach(() => new Promise<void>((resolve) => setTimeout(resolve, 0)));

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
    expect(c.nodes.find((x) => x.id === "work/kitab-al-shifa")!.stub).toBe(true);
    expect(Object.keys(c.nodes.find((x) => x.id === "person/ibn-sina")!.prose).sort()).toEqual(["ar", "en", "ur"]);
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
  it("records the provenance layer and only asks a rewritten source to be cited (docs/sources-policy.md)", () => {
    // any layer may enter data/ once rewritten and cited
    expect(msgs(run(base("place", "zz-test-a", { kind: "city", provenance: { layer: "by-sa" } })), "error")).toBe("");
    expect(msgs(run(base("place", "zz-test-b", { kind: "city", provenance: { layer: "cc0" } })), "error")).toBe("");
    // a layer other than the open ones must cite the source it was rewritten from
    const i = run(base("place", "zz-test-e", { kind: "city", sources: [], provenance: { layer: "copyrighted-reference" } }));
    expect(msgs(i.filter((x) => x.file.includes("zz-test-e")), "error")).toMatch(/requires cited sources/);
    // an unknown layer name is a warning, not a wall
    const u = run(base("place", "zz-test-f", { kind: "city", provenance: { layer: "mystery" } }));
    expect(msgs(u.filter((x) => x.file.includes("zz-test-f")), "warn")).toMatch(/not a known layer/);
  });
  it("warns when a conflict lists fewer than two sides", () => {
    const i = run(base("event", "zz-test-c", { kind: "battle", sides: [{ label: { en: "A" } }] }));
    expect(msgs(i.filter((x) => x.file.includes("zz-test-c")), "warn")).toMatch(/both sides/);
    const ok = run(base("event", "zz-test-d", { kind: "battle", sides: [{ label: { en: "A" } }, { label: { en: "B" } }] }));
    expect(msgs(ok.filter((x) => x.file.includes("zz-test-d")), "warn")).not.toMatch(/both sides/);   // only this test's own file: real content may have warnings of its own
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

describe("the Qur'an text is frozen (docs/plan/15 §6.3 acceptance test 3)", () => {
  it("flags a passage whose text differs from the frozen Tanzil text by one character, and accepts the frozen text", () => {
    // Read-only: the committed passage is never written to; the one-character change is made in memory only.
    const committed = readFileSync(p("data", "passage", "quran-112-1.yaml"), "utf8").split("\n").find((l) => l.startsWith("text: "))!.slice("text: ".length);
    const tanzil = new Map([["112:1", committed]]);
    expect(frozenQuranTextProblem("112:1", committed, tanzil)).toBeNull();
    const changed = committed.replace(/[ً-ْٰ]/, ""); // drop one combining mark
    expect(changed).not.toBe(committed);
    expect(frozenQuranTextProblem("112:1", changed, tanzil)).toMatch(/differs from the frozen Tanzil file/);
  });
  it("has all 114 suras and 6,236 ayat", () => {
    const c = compile();
    expect(c.nodes.filter((n) => n.class === "passage" && n.data.unit === "sura").length).toBe(114);
    expect(c.nodes.filter((n) => n.class === "passage" && n.data.unit === "ayah").length).toBe(6236);
  });
});

describe("scope rule: Sunni is the default and first view (docs/scope.md)", () => {
  const ps = (...traditions: string[]) => ({ perspectives: traditions.map((tr) => ({ tradition: tr, summary: { en: "x" } })) });
  it("rejects a perspectives block whose first entry is not Sunni", () => {
    expect(msgs(run(base("event", "zz-test-k", { kind: "other", ...ps("academic", "sunni") })), "error")).toMatch(/must start with a Sunni entry/);
    expect(msgs(run(base("event", "zz-test-l", { kind: "other", ...ps("shia-twelver") })), "error")).toMatch(/must start with a Sunni entry/);
  });
  it("requires the order Sunni, academic, then other views", () => {
    expect(msgs(run(base("event", "zz-test-m", { kind: "other", ...ps("sunni", "shia-twelver", "academic") })), "error")).toMatch(/out of order/);
    expect(msgs(run(base("event", "zz-test-n", { kind: "other", ...ps("sunni-hanafi", "sunni-shafii", "academic", "shia-twelver", "ibadi") })), "error")).toBe("");
  });
});

describe("opinions: issue, holders, evidence and ids (docs/plan/20-opinions.md)", () => {
  const op = (extra: Record<string, any> = {}) => ({ tradition: "sunni", summary: { en: "x" }, sources: ["source/gutas-2014"], ...extra });
  it("accepts a stated issue with a lead opinion and a further one, each with stance, holders and evidence", () => {
    const e = base("concept", "zz-test-o1", { kind: "doctrine", issue: { en: "q?" }, perspectives: [
      op({ id: "first", stance: { en: "a" }, holders: ["source/gutas-2014"], evidence: [{ ref: "source/gutas-2014", note: { en: "p. 1" } }] }),
      op({ tradition: "sunni-hanafi", id: "second", stance: { en: "b" } })] });
    expect(msgs(run(e), "error")).toBe("");
    expect(run(e).filter((x) => x.level === "warn" && x.file.includes("zz-test-o1")).map((x) => x.msg).join()).not.toMatch(/no `issue`|cites no source/);
  });
  it("rejects duplicate ids and unresolved holders or evidence", () => {
    const e = base("concept", "zz-test-o2", { kind: "doctrine", issue: { en: "q?" }, perspectives: [
      op({ id: "same", holders: ["person/zz-nobody"] }), op({ tradition: "sunni-hanafi", id: "same", evidence: [{ ref: "source/zz-none" }] })] });
    const m = msgs(run(e), "error");
    expect(m).toMatch(/duplicate id "same"/); expect(m).toMatch(/holders: person\/zz-nobody does not exist/); expect(m).toMatch(/evidence: source\/zz-none does not exist/);
  });
  it("refuses a main tag on a non-Sunni opinion and a lead opinion tagged secondary or other", () => {
    const bad = base("concept", "zz-test-o4", { kind: "doctrine", issue: { en: "q?" }, perspectives: [op({ standing: "secondary" }), op({ tradition: "shia-twelver", standing: "main" })] });
    const m = msgs(run(bad), "error");
    expect(m).toMatch(/cannot be tagged secondary/); expect(m).toMatch(/standing "main" is for Sunni opinions/);
    const ok = base("concept", "zz-test-o5", { kind: "doctrine", issue: { en: "q?" }, perspectives: [op({ standing: "main" }), op({ tradition: "academic", standing: "secondary" }), op({ tradition: "shia-twelver", standing: "other" })] });
    expect(msgs(run(ok), "error")).toBe("");
  });
  it("warns when two opinions have no issue, or an opinion cites no source", () => {
    const w = msgs(run(base("concept", "zz-test-o3", { kind: "doctrine", perspectives: [{ tradition: "sunni", summary: { en: "x" } }, op({ tradition: "sunni-hanafi" })] })), "warn");
    expect(w).toMatch(/no `issue`/); expect(w).toMatch(/cites no source/);
  });
});

describe("traditions[] counts a person among a tradition (content standards 13b)", () => {
  const person = (slug: string, extra: Record<string, any>) => base("person", slug, { gender: "male", ...extra });
  it("warns when a Sunni tradition sits on a person whose recorded faith has no Muslim value", () => {
    const w = run(person("zz-test-t1", { traditions: ["sunni"], faith: [{ value: "arabian-polytheism", basis: "tradition" }] })).filter((x) => x.file.includes("zz-test-t1")).map((x) => x.msg).join();
    expect(w).toMatch(/not counted among a tradition/);
    const ok = run(person("zz-test-t2", { traditions: ["sunni"], faith: [{ value: "arabian-polytheism", basis: "tradition" }, { value: "sunni", basis: "tradition" }] })).filter((x) => x.file.includes("zz-test-t2")).map((x) => x.msg).join();
    expect(ok).not.toMatch(/not counted among a tradition/);
  });
});

describe("no AI or compute at runtime (docs/adr/0002)", () => {
  const w = async (name: string, body: string) => { const { mkdtempSync, writeFileSync } = await import("node:fs"); const d = mkdtempSync("/tmp/static-"); const f = `${d}/${name}`; writeFileSync(f, body); return f; };
  it("accepts a same-origin static fetch", async () => {
    expect(scan([await w("a.html", '<script>fetch("/search-synonyms.json")</script>')])).toEqual([]);
  });
  it("rejects external calls, sockets and non-static paths", async () => {
    expect(scan([await w("b.html", '<script>fetch("https://api.example.com/ask")</script>')]).join()).toMatch(/external origin/);
    expect(scan([await w("c.html", '<script>fetch("/ask?q=1")</script>')]).join()).toMatch(/non-static/);
    expect(scan([await w("d.html", "<script>new WebSocket('wss://x')</script>")]).join()).toMatch(/WebSocket/);
  });
});

describe("Arabic first (docs/language.md)", () => {
  it("requires label.ar and summary.ar, and does not require English", () => {
    const noAr = { ...base("place", "zz-test-p", { kind: "city" }).entity };
    delete (noAr as any).label.ar; delete (noAr as any).summary.ar;
    const i = validateAll([{ entity: noAr, file: p("data", "place", "zz-test-p.yaml") }]).issues;
    expect(msgs(i, "error")).toMatch(/label\.ar is required/);
    expect(msgs(i, "error")).toMatch(/summary\.ar is required/);
    const onlyAr = { ...base("place", "zz-test-q", { kind: "city" }).entity, label: { ar: "ت" }, summary: { ar: "ت" } };
    expect(msgs(validateAll([{ entity: onlyAr, file: p("data", "place", "zz-test-q.yaml") }]).issues, "error")).toBe("");
  });
  it("exempts bibliographic sources from the Arabic label requirement", () => {
    const src = { ...base("source", "zz-test-r", { kind: "secondary", type: "book", title: "T" }).entity, label: { en: "T" }, summary: { en: "t" } };
    expect(msgs(validateAll([{ entity: src, file: p("data", "source", "zz-test-r.yaml") }]).issues, "error")).toBe("");
  });
  it("requires alt text in every published language (ar, en and ur)", () => {
    const m = (alt: any) => ({ ...base("media", "zz-test-s", { kind: "map", license: "CC0", alt }).entity });
    expect(msgs(validateAll([{ entity: m({ en: "x", ur: "x" }), file: p("data", "media", "zz-test-s.yaml") }]).issues, "error")).toMatch(/alt text missing for "ar"/);
    expect(msgs(validateAll([{ entity: m({ ar: "x", ur: "x" }), file: p("data", "media", "zz-test-s.yaml") }]).issues, "error")).toMatch(/alt text missing for "en"/);
    expect(msgs(validateAll([{ entity: m({ ar: "x", en: "y" }), file: p("data", "media", "zz-test-s.yaml") }]).issues, "error")).toMatch(/alt text missing for "ur"/);
    expect(msgs(validateAll([{ entity: m({ ar: "x", en: "y", ur: "z" }), file: p("data", "media", "zz-test-s.yaml") }]).issues, "error")).toBe("");
  });
});

describe("published UI languages (docs/language.md)", () => {
  it("i18n/ar.yaml and i18n/en.yaml carry the same key set (a missing key renders as a raw path in the UI)", async () => {
    const { readFileSync } = await import("node:fs");
    const { parse } = await import("yaml");
    const keys = (o: any, prefix = ""): Set<string> =>
      new Set(Object.entries(o ?? {}).flatMap(([k, v]) => {
        const key = prefix ? `${prefix}.${k}` : k;
        return v && typeof v === "object" && !Array.isArray(v) ? [...keys(v, key)] : [key];
      }));
    const ar = keys(parse(readFileSync(p("i18n", "ar.yaml"), "utf8")));
    const en = keys(parse(readFileSync(p("i18n", "en.yaml"), "utf8")));
    expect([...en].filter((k) => !ar.has(k))).toEqual([]);
    expect([...ar].filter((k) => !en.has(k))).toEqual([]);
  });
});

describe("content quality guards (docs/agents/content-standards.md)", () => {
  it("rejects honorifics typed into a summary or label (ﷺ and the spelled-out formulas)", () => {
    const i = run(base("event", "t-honorific", { summary: { ar: "أمر النبي ﷺ جيشه", en: "t" } }));
    expect(msgs(i, "error")).toMatch(/honorifics must not be typed/);
    const j = run(base("event", "t-honorific2", { summary: { ar: "قبلة إبراهيم عليه السلام", en: "t" } }));
    expect(msgs(j, "error")).toMatch(/honorifics must not be typed/);
  });
  it("accepts a plain summary", () => {
    expect(msgs(run(base("event", "t-plain", { summary: { ar: "خرج النبي إلى أحد", en: "t" } })), "error")).not.toMatch(/honorifics/);
  });
});
