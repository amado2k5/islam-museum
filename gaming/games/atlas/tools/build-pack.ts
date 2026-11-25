// Builds the Atlas content pack from the museum's own records. Run from gaming/:
//   npx tsx games/atlas/tools/build-pack.ts [--days 365] [--reserve 300] [--start 2026-12-01]
//
// A round is one museum record joined to the museum place where it happened:
//   - an event with exactly one `occurred_at` place and a start date known to the year or better;
//   - a person with exactly one `born_in` place (not marked low confidence) and a birth year from 700 to 1900,
//     or, failing that, exactly one `died_in` place and a year of death from 800 to 1950.
// The place must be a city, town or site whose coordinates the museum records as `site` or `locality` precision.
// Nothing is added, rewritten or guessed here: a record that does not meet the rules is left out and counted.
//
// The output is pinned in git (games/atlas/data/), so the daily challenge does not change when the museum's data does.
// The pack is rebuilt only on purpose, and a rebuild is a new pack version for players.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { LANGS, PACK_FORMAT, PACK_VERSION, checkPack, digestInput, encodePack, type AtlasPack, type Category, type Lang, type PackLabels, type PackPlace, type PackRound, type Precision } from "../src/pack";
import { buildSchedule, checkSchedule } from "../src/schedule";

const ROOT = resolve(fileURLToPath(new URL("../../../../", import.meta.url)));
const OUT = resolve(fileURLToPath(new URL("../data/", import.meta.url)));
const arg = (name: string, fallback: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? (process.argv[i + 1] ?? fallback) : fallback;
};
const DAYS = Number(arg("days", "365"));
const RESERVE = Number(arg("reserve", "300"));
const START = arg("start", "2026-12-01");

const PLACE_KINDS = new Set(["city", "town", "site"]);
const MILITARY = new Set(["battle", "siege", "conquest", "war", "revolt", "campaign", "raid", "civil-war", "skirmish", "mutiny", "naval-battle", "defection"]);
// Kinds the game does not turn into a question: atrocity and persecution, and the events of revelation.
const EXCLUDED_KINDS = new Set(["massacre", "persecution", "expulsion", "revelation", "schism"]);
// Proper names fall back within their own script when a record has no label in a language.
const NAME_FALLBACK: Record<Lang, Lang[]> = { ar: ["ar"], en: ["en"], ur: ["ur", "ar"], fr: ["fr", "en"], es: ["es", "en"], tr: ["tr", "en"], id: ["id", "en"] };

type Rec = Record<string, unknown>;
const skipped: Record<string, number> = {};
const skip = (why: string) => {
  skipped[why] = (skipped[why] ?? 0) + 1;
};
const read = (cls: string, file: string): Rec | null => {
  try {
    return parse(readFileSync(join(ROOT, "data", cls, file), "utf8")) as Rec;
  } catch {
    skip(`${cls}: unreadable YAML`);
    return null;
  }
};
const files = (cls: string) => readdirSync(join(ROOT, "data", cls)).filter((f) => f.endsWith(".yaml")).sort();
const labelsOf = (rec: Rec): Partial<Record<Lang, string>> => {
  const l = rec.label;
  if (!l || typeof l !== "object") return {};
  const out: Partial<Record<Lang, string>> = {};
  for (const lang of LANGS) {
    const v = (l as Rec)[lang];
    if (typeof v === "string" && v.trim()) out[lang] = v.trim();
  }
  return out;
};
const yearOf = (date: unknown): { year: number; hijri: number; precision: string } | null => {
  if (!date || typeof date !== "object") return null;
  const d = date as Rec;
  const m = /^(\d{4})/.exec(String(d.edtf ?? ""));
  if (!m) return null;
  const h = /^(\d{1,4})/.exec(String(d.hijri ?? ""));
  return { year: Number(m[1]), hijri: h ? Number(h[1]) : 0, precision: String(d.precision ?? "") };
};
const targets = (rec: Rec, type: string): Array<{ target: string; confidence?: string }> => {
  const rel = rec.relations;
  if (!Array.isArray(rel)) return [];
  return rel.filter((r) => r && typeof r === "object" && (r as Rec).type === type && typeof (r as Rec).target === "string").map((r) => ({ target: String((r as Rec).target), confidence: (r as Rec).confidence as string | undefined }));
};

// ---- Region labels ---------------------------------------------------------------------------------------------------
// The region hint shows the museum's own name for a region. A region slug that has no name in all seven interface
// files is not offered as a hint (the place stays in the game).
const REGION_LABELS = {} as Record<Lang, Record<string, string>>;
const ERA_TERMS = {} as Record<Lang, { ah: string; ce: string }>;
for (const lang of LANGS) {
  const doc = parse(readFileSync(join(ROOT, "i18n", `${lang}.yaml`), "utf8")) as Rec;
  let era: Rec | null = null;
  const findEra = (node: unknown) => {
    if (era || !node || typeof node !== "object") return;
    const o = node as Rec;
    if (typeof o.year_ah === "string" && typeof o.year_ce === "string") {
      era = o;
      return;
    }
    for (const v of Object.values(o)) findEra(v);
  };
  findEra(doc);
  if (!era) throw new Error(`i18n/${lang}.yaml: no year_ah / year_ce strings found`);
  ERA_TERMS[lang] = { ah: String((era as Rec).year_ah), ce: String((era as Rec).year_ce) };
  let found: Rec | null = null;
  const walk = (node: unknown) => {
    if (found || !node || typeof node !== "object") return;
    const o = node as Rec;
    if (typeof o["andalus-europe"] === "string" && typeof o["maghreb"] === "string") {
      found = o;
      return;
    }
    for (const v of Object.values(o)) walk(v);
  };
  walk(doc);
  if (!found) throw new Error(`i18n/${lang}.yaml: no region labels found`);
  REGION_LABELS[lang] = Object.fromEntries(Object.entries(found as Rec).filter(([, v]) => typeof v === "string")) as Record<string, string>;
}
const regionHasName = (slug: string) => LANGS.every((l) => typeof REGION_LABELS[l][slug] === "string");

// ---- Places -------------------------------------------------------------------------------------------------------
interface PlaceRow extends PackPlace {
  names: Partial<Record<Lang, string>>;
}
const placeById = new Map<string, PlaceRow>();
for (const f of files("place")) {
  const rec = read("place", f);
  if (!rec) continue;
  const c = rec.coordinates;
  if (!Array.isArray(c) || c.length !== 2 || typeof c[0] !== "number" || typeof c[1] !== "number") {
    skip("place: no coordinates");
    continue;
  }
  if (!PLACE_KINDS.has(String(rec.kind))) {
    skip("place: not a city, town or site");
    continue;
  }
  const precision = String(rec.coordinate_precision);
  if (precision !== "site" && precision !== "locality") {
    skip("place: coordinates only approximate");
    continue;
  }
  const names = labelsOf(rec);
  if (!names.ar || !names.en) {
    skip("place: no Arabic or English name");
    continue;
  }
  // A place with no region in its record stays in the game; the region hint is simply not offered for it.
  const regions = Array.isArray(rec.regions) ? rec.regions : [];
  const region = typeof regions[0] === "string" && regionHasName(regions[0]) ? regions[0] : "";
  if (!region) skip("place: kept, but has no region for the hint");
  placeById.set(String(rec.id), { id: String(rec.id), lat: c[0], lon: c[1], precision: precision as Precision, kind: String(rec.kind), region, refs: 0, names });
}

// How often the museum's people and events point at each place.
const relationToPlace = /target:\s*(place\/[a-z0-9-]+)/g;
for (const cls of ["person", "event", "building", "polity", "group"]) {
  for (const f of files(cls)) {
    const text = readFileSync(join(ROOT, "data", cls, f), "utf8");
    for (const m of text.matchAll(relationToPlace)) {
      const p = placeById.get(m[1]!);
      if (p) p.refs++;
    }
  }
}

// ---- Rounds --------------------------------------------------------------------------------------------------------
interface RoundRow {
  id: string;
  type: "event" | "birth" | "death";
  category: Category;
  placeId: string;
  year: number;
  hijri: number;
  datePrecision: PackRound["datePrecision"];
  names: Partial<Record<Lang, string>>;
  namesPlace: boolean;
}
const rows: RoundRow[] = [];
const fold = (s: string) => s.toLocaleLowerCase("en").normalize("NFKD").replace(/[̀-ًͯ-ٰٟـ]/g, "");
const mentions = (label: Partial<Record<Lang, string>>, place: Partial<Record<Lang, string>>) =>
  LANGS.some((l) => {
    const a = label[l];
    const b = place[l];
    return Boolean(a && b && fold(b).length >= 3 && fold(a).includes(fold(b)));
  });

for (const f of files("event")) {
  const text = readFileSync(join(ROOT, "data", "event", f), "utf8");
  if (!text.includes("occurred_at")) continue;
  const rec = read("event", f);
  if (!rec) continue;
  const where = [...new Set(targets(rec, "occurred_at").map((t) => t.target))];
  if (where.length !== 1) {
    skip("event: more than one place");
    continue;
  }
  const place = placeById.get(where[0]!);
  if (!place) {
    skip("event: its place does not qualify");
    continue;
  }
  const kind = String(rec.kind);
  if (EXCLUDED_KINDS.has(kind) || "sensitivity" in rec) {
    skip("event: kind or sensitivity excluded");
    continue;
  }
  const when = yearOf((rec.date as Rec | undefined)?.start);
  if (!when || !["day", "month", "year"].includes(when.precision) || when.year < 1) {
    skip("event: no start date to the year");
    continue;
  }
  const names = labelsOf(rec);
  if (LANGS.some((l) => !names[l])) {
    skip("event: label missing in one of the seven languages");
    continue;
  }
  rows.push({ id: String(rec.id), type: "event", category: MILITARY.has(kind) ? "military" : "civic", placeId: place.id, year: when.year, hijri: when.hijri, datePrecision: when.precision as PackRound["datePrecision"], names, namesPlace: mentions(names, place.names) });
}

// One round per person: the birthplace when the record supports it, otherwise the place of death.
// Early generations are left out until the founder rules on whether and how they may be the subject of a question,
// and nobody born after 1900 (or, for a death round, who died after 1950) is turned into a quiz item.
const personPlace = (rec: Rec, relation: "born_in" | "died_in", dateField: "born" | "died", minYear: number, maxYear: number): { place: PlaceRow; when: NonNullable<ReturnType<typeof yearOf>> } | string => {
  const where = targets(rec, relation);
  const distinct = [...new Set(where.map((t) => t.target))];
  if (distinct.length === 0) return "none";
  if (distinct.length !== 1) return `person: more than one ${relation} place`;
  if (where.some((t) => t.confidence === "low")) return `person: ${relation} marked low confidence`;
  const place = placeById.get(distinct[0]!);
  if (!place) return `person: ${relation} place does not qualify`;
  const when = yearOf(rec[dateField]);
  if (!when || !["day", "month", "year"].includes(when.precision)) return `person: no ${dateField} year`;
  if (when.year < minYear) return `person: ${dateField} before ${minYear} CE`;
  if (when.year > maxYear) return `person: ${dateField} after ${maxYear}`;
  return { place, when };
};
for (const f of files("person")) {
  const text = readFileSync(join(ROOT, "data", "person", f), "utf8");
  if (!text.includes("born_in") && !text.includes("died_in")) continue;
  const rec = read("person", f);
  if (!rec) continue;
  if ("sensitivity" in rec) {
    skip("person: sensitivity excluded");
    continue;
  }
  const names = labelsOf(rec);
  if (!names.ar || !names.en) {
    skip("person: no Arabic or English name");
    continue;
  }
  const birth = personPlace(rec, "born_in", "born", 700, 1900);
  const bornYear = yearOf(rec.born)?.year;
  // A death round is only offered for someone whose record does not place them after 1900 by birth.
  const death = bornYear !== undefined && bornYear > 1900 ? "person: born after 1900" : personPlace(rec, "died_in", "died", 800, 1950);
  const chosen = typeof birth !== "string" ? { type: "birth" as const, ...birth } : typeof death !== "string" ? { type: "death" as const, ...death } : null;
  if (!chosen) {
    skip(birth !== "none" ? (birth as string) : death !== "none" ? (death as string) : "person: no single birthplace or place of death");
    continue;
  }
  rows.push({ id: String(rec.id), type: chosen.type, category: "people", placeId: chosen.place.id, year: chosen.when.year, hijri: chosen.when.hijri, datePrecision: chosen.when.precision as PackRound["datePrecision"], names, namesPlace: false });
}

// ---- Schedule over everything that qualifies, then keep the scheduled rounds plus a reserve for practice ------------
rows.sort((a, b) => (a.id < b.id ? -1 : 1));
const allPlaces = [...placeById.values()].sort((a, b) => (a.id < b.id ? -1 : 1));
const placeIndexAll = new Map(allPlaces.map((p, i) => [p.id, i]));
const toRound = (r: RoundRow, index: Map<string, number>): PackRound => ({ id: r.id, type: r.type, category: r.category, place: index.get(r.placeId)!, year: r.year, hijri: r.hijri, datePrecision: r.datePrecision, namesPlace: r.namesPlace });
const allRounds = rows.map((r) => toRound(r, placeIndexAll));
const commit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim();
const commitDate = execFileSync("git", ["show", "-s", "--format=%cs", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim();
const seed = `v${PACK_VERSION}:${START}`;
{
  const supply: Record<string, { rounds: number; places: number }> = {};
  for (const c of ["civic", "people", "military"] as Category[]) {
    const rs = allRounds.filter((r) => r.category === c);
    supply[c] = { rounds: rs.length, places: new Set(rs.map((r) => r.place)).size };
  }
  console.error("supply:", JSON.stringify(supply), "skipped:", JSON.stringify(skipped));
}
const fullSchedule = buildSchedule(allPlaces, allRounds, DAYS, seed);

const keep = new Set<number>(fullSchedule.flat());
// Reserve: the best-known unscheduled rounds, taken in the same category proportions as a day.
const perCategory: Record<Category, number> = { civic: RESERVE / 3, people: RESERVE / 3, military: RESERVE / 3 };
for (const c of Object.keys(perCategory) as Category[]) {
  const candidates = allRounds.map((r, i) => ({ r, i })).filter((x) => x.r.category === c && !keep.has(x.i));
  candidates.sort((a, b) => allPlaces[b.r.place]!.refs - allPlaces[a.r.place]!.refs || (a.r.id < b.r.id ? -1 : 1));
  for (const x of candidates.slice(0, Math.round(perCategory[c]))) keep.add(x.i);
}
const keptRows = rows.filter((_, i) => keep.has(i));
const usedPlaceIds = [...new Set(keptRows.map((r) => r.placeId))].sort();
const places: PackPlace[] = usedPlaceIds.map((id) => {
  const p = placeById.get(id)!;
  return { id: p.id, lat: p.lat, lon: p.lon, precision: p.precision, kind: p.kind, region: p.region, refs: p.refs };
});
const placeIndex = new Map(places.map((p, i) => [p.id, i]));
const rounds = keptRows.map((r) => toRound(r, placeIndex));
const roundIndex = new Map(rounds.map((r, i) => [r.id, i]));
const schedule = { start: START, days: fullSchedule.map((day) => day.map((i) => roundIndex.get(allRounds[i]!.id)!)) };
const digest = createHash("sha256").update(digestInput({ places, rounds, schedule })).digest("hex");
const pack: AtlasPack = { format: PACK_FORMAT, version: PACK_VERSION, builtFrom: { commit, date: commitDate }, places, rounds, schedule, digest };

const problems = [...checkPack(pack).map((p) => `${p.where}: ${p.problem}`), ...checkSchedule(pack).problems];
if (problems.length) {
  for (const p of problems.slice(0, 40)) console.error("ERROR " + p);
  console.error(`${problems.length} problems: nothing written`);
  process.exit(1);
}

// ---- Labels, one file per language -----------------------------------------------------------------------------------
const fallbackCount: Record<string, number> = {};
for (const lang of LANGS) {
  const labels: Record<string, string> = {};
  const fallback: string[] = [];
  const put = (id: string, names: Partial<Record<Lang, string>>) => {
    for (const l of NAME_FALLBACK[lang]) {
      const v = names[l];
      if (v) {
        labels[id] = v;
        if (l !== lang) fallback.push(id);
        return;
      }
    }
    throw new Error(`${id}: no name for ${lang}`);
  };
  for (const id of usedPlaceIds) put(id, placeById.get(id)!.names);
  for (const r of keptRows) put(r.id, r.names);
  fallbackCount[lang] = fallback.length;
  const regions = Object.fromEntries([...new Set(places.map((p) => p.region).filter(Boolean))].sort().map((slug) => [slug, REGION_LABELS[lang][slug]!]));
  const file: PackLabels = { lang, labels, fallback: fallback.sort(), regions, terms: ERA_TERMS[lang] };
  writeFileSync(join(OUT, `labels.v${PACK_VERSION}.${lang}.json`), JSON.stringify(file) + "\n");
}
writeFileSync(join(OUT, `pack.v${PACK_VERSION}.json`), JSON.stringify(encodePack(pack)) + "\n");

const count = (pred: (r: PackRound) => boolean) => rounds.filter(pred).length;
const report = {
  builtFrom: pack.builtFrom,
  digest,
  qualifyingPlaces: allPlaces.length,
  qualifyingRounds: { total: allRounds.length, civic: allRounds.filter((r) => r.category === "civic").length, people: allRounds.filter((r) => r.category === "people").length, military: allRounds.filter((r) => r.category === "military").length },
  inPack: { places: places.length, rounds: rounds.length, civic: count((r) => r.category === "civic"), people: count((r) => r.category === "people"), military: count((r) => r.category === "military"), labelNamesThePlace: count((r) => r.namesPlace) },
  schedule: checkSchedule(pack),
  namesBorrowedFromAnotherLanguage: fallbackCount,
  leftOut: Object.fromEntries(Object.entries(skipped).sort((a, b) => b[1] - a[1])),
};
writeFileSync(join(OUT, `report.v${PACK_VERSION}.json`), JSON.stringify(report, null, 1) + "\n");
console.log(JSON.stringify(report, null, 1));
