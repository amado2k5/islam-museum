// The Atlas content pack: every round the game can ask, built from museum records by tools/build-pack.ts and
// pinned in the repository so a daily challenge is the same for everyone and stays the same after the museum's
// data moves on. The game never reads museum data directly and never invents a fact: a round is a museum record
// (an event, or a person's birth or death) joined to the museum place record where it happened.

export const PACK_FORMAT = "im.atlas.pack";
export const PACK_VERSION = 1;

export const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
export type Lang = (typeof LANGS)[number];

export type Precision = "site" | "locality";
export type RoundType = "event" | "birth" | "death";
/** Which daily slot a round can fill: civic and scholarly events, people, or military history. */
export type Category = "civic" | "people" | "military";

export interface PackPlace {
  /** Museum id, for example "place/granada". */
  id: string;
  lat: number;
  lon: number;
  precision: Precision;
  kind: string;
  /** Museum region slug (first listed), shown as the "region" hint; empty when the record names no region. */
  region: string;
  /** How many museum relations point at this place: a rough measure of how well known it is. */
  refs: number;
}

export interface PackRound {
  /** Museum id of the record the round is about: "event/…" or "person/…". */
  id: string;
  type: RoundType;
  category: Category;
  /** Index into places. */
  place: number;
  /** Year of the event, birth or death, Common Era (astronomical numbering is not used; all years here are positive). */
  year: number;
  /** Hijri year as the record gives it, or 0 when the record has none. */
  hijri: number;
  /** The record's own date precision. */
  datePrecision: "day" | "month" | "year" | "decade" | "century";
  /** True when the record's label contains the name of the place in some language, so the round is "find it on the map". */
  namesPlace: boolean;
}

export interface AtlasPack {
  format: typeof PACK_FORMAT;
  version: number;
  /** The museum commit the pack was built from, and that commit's date. */
  builtFrom: { commit: string; date: string };
  places: PackPlace[];
  rounds: PackRound[];
  /** The daily schedule: day 0 is `start` (UTC), each day five round indexes. */
  schedule: { start: string; days: number[][] };
  /** SHA-256 of the canonical JSON of places, rounds and schedule. */
  digest: string;
}

/** Labels for one language: museum id to display name. `fallback` lists the ids whose name is borrowed from another language. */
export interface PackLabels {
  lang: Lang;
  labels: Record<string, string>;
  fallback: string[];
  regions: Record<string, string>;
  /** The museum's own era abbreviations in this language ("AH", "CE"), taken from its interface strings. */
  terms: { ah: string; ce: string };
}

export interface PackProblem {
  where: string;
  problem: string;
}

/** Structural checks any loaded pack must pass before the game uses it. Returns every problem found. */
export function checkPack(pack: AtlasPack): PackProblem[] {
  const out: PackProblem[] = [];
  const bad = (where: string, problem: string) => out.push({ where, problem });
  if (pack.format !== PACK_FORMAT) bad("pack", `format is ${String(pack.format)}`);
  if (pack.version !== PACK_VERSION) bad("pack", `version is ${String(pack.version)}`);
  const placeIds = new Set<string>();
  pack.places.forEach((p, i) => {
    if (placeIds.has(p.id)) bad(p.id, "duplicate place");
    placeIds.add(p.id);
    if (!(p.lat >= -90 && p.lat <= 90) || !(p.lon >= -180 && p.lon <= 180)) bad(p.id, `coordinates out of range: ${p.lat}, ${p.lon}`);
    if (p.lat === 0 && p.lon === 0) bad(p.id, "coordinates are 0, 0");
    if (p.precision !== "site" && p.precision !== "locality") bad(p.id, `precision ${String(p.precision)} is too coarse for a guess`);
    if (!p.id.startsWith("place/")) bad(`place ${i}`, "id is not a place id");
  });
  const roundIds = new Set<string>();
  pack.rounds.forEach((r, i) => {
    if (roundIds.has(r.id)) bad(r.id, "duplicate round");
    roundIds.add(r.id);
    if (!pack.places[r.place]) bad(r.id, `place index ${r.place} is out of range`);
    if (!Number.isInteger(r.year) || r.year < 1 || r.year > 2100) bad(r.id, `year ${r.year} is out of range`);
    if (r.type === "event" && !r.id.startsWith("event/")) bad(r.id, "an event round must be an event record");
    if ((r.type === "birth" || r.type === "death") && !r.id.startsWith("person/")) bad(r.id, "a birth or death round must be a person record");
    if (!["civic", "people", "military"].includes(r.category)) bad(`round ${i}`, `category ${String(r.category)}`);
  });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(pack.schedule.start)) bad("schedule", "start is not a date");
  return out;
}

// ---- File encoding -----------------------------------------------------------------------------------------------
// On disk a pack stores places and rounds as rows, not objects, which roughly halves the file. The digest is taken
// over the decoded places, rounds and schedule, so it does not depend on the encoding.

const PRECISIONS: Precision[] = ["site", "locality"];
const TYPES: RoundType[] = ["event", "birth", "death"];
const CATEGORIES: Category[] = ["civic", "people", "military"];
const DATE_PRECISIONS: PackRound["datePrecision"][] = ["day", "month", "year", "decade", "century"];

export interface PackFile {
  format: typeof PACK_FORMAT;
  version: number;
  builtFrom: { commit: string; date: string };
  /** [id, lat, lon, precision, kind, region, refs] */
  places: Array<[string, number, number, number, string, string, number]>;
  /** [id, type, category, place, year, hijri, datePrecision, namesPlace] */
  rounds: Array<[string, number, number, number, number, number, number, number]>;
  schedule: { start: string; days: number[][] };
  digest: string;
}

export function encodePack(pack: AtlasPack): PackFile {
  return {
    format: pack.format,
    version: pack.version,
    builtFrom: pack.builtFrom,
    places: pack.places.map((p) => [p.id, p.lat, p.lon, PRECISIONS.indexOf(p.precision), p.kind, p.region, p.refs]),
    rounds: pack.rounds.map((r) => [r.id, TYPES.indexOf(r.type), CATEGORIES.indexOf(r.category), r.place, r.year, r.hijri, DATE_PRECISIONS.indexOf(r.datePrecision), r.namesPlace ? 1 : 0]),
    schedule: pack.schedule,
    digest: pack.digest,
  };
}

export function decodePack(file: PackFile): AtlasPack {
  if (file.format !== PACK_FORMAT || file.version !== PACK_VERSION) throw new Error(`not an Atlas pack of version ${PACK_VERSION}`);
  const pick = <T>(list: T[], i: number, what: string): T => {
    const v = list[i];
    if (v === undefined) throw new Error(`pack: unknown ${what} code ${i}`);
    return v;
  };
  return {
    format: file.format,
    version: file.version,
    builtFrom: file.builtFrom,
    places: file.places.map(([id, lat, lon, precision, kind, region, refs]) => ({ id, lat, lon, precision: pick(PRECISIONS, precision, "precision"), kind, region, refs })),
    rounds: file.rounds.map(([id, type, category, place, year, hijri, datePrecision, namesPlace]) => ({ id, type: pick(TYPES, type, "type"), category: pick(CATEGORIES, category, "category"), place, year, hijri, datePrecision: pick(DATE_PRECISIONS, datePrecision, "date precision"), namesPlace: namesPlace === 1 })),
    schedule: file.schedule,
    digest: file.digest,
  };
}

/** The text the digest is taken over. */
export const digestInput = (pack: Pick<AtlasPack, "places" | "rounds" | "schedule">): string => JSON.stringify({ places: pack.places, rounds: pack.rounds, schedule: pack.schedule });
