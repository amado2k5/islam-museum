// Which museum media records could become an Atlas image round, and why the others cannot (decision record G-0008).
// Pure functions over plain records. The survey tool (tools/survey-images.ts) feeds them the museum's YAML and counts
// the answers; the pack builder will call the same function on the day there are enough images to schedule.
// Nothing here is used on screen: on 25 November 2026 the museum's records support too few image rounds for a fair
// schedule, so none is built. This file is the rule, kept executable so the count can be taken again.

export type Rec = Record<string, unknown>;

/** Licences an image round may use: free to show in a game, with the credit the licence asks for. */
export const FREE_LICENCES: readonly string[] = ["CC0", "PD", "CC-BY", "CC-BY-SA"];
/** Licences that ask for the author to be named, so the record must name one. */
const NEEDS_AUTHOR: ReadonlySet<string> = new Set(["CC-BY", "CC-BY-SA"]);
/**
 * On the museum's whitelist, but granted by the holder for the museum's own pages on the holder's terms (the V&A:
 * non-commercial, credited, embedded by URL, 768 px at most). Whether a game is the same use is the founder's to say,
 * so these are counted apart and left out of the supply until he does.
 */
export const HELD_LICENCES: readonly string[] = ["VAM-NC"];
/** Object kinds never turned into a picture question: the game cannot tell a page of the Qur'an or a figurative painting from any other folio. */
export const OBJECT_KINDS_NEVER_ASKED: ReadonlySet<string> = new Set(["folio", "manuscript", "relic"]);

/** "where": the picture shows a place or a building, and the question is where it is. "made": it shows an object, and the question is where it was made. */
export type ImageQuestion = "where" | "made";

export interface ImageRound {
  /** Museum id of the media record. */
  media: string;
  question: ImageQuestion;
  /** Museum id of the place, building or object the record says it depicts. */
  subject: string;
  /** Museum id of the place the answer is scored against. */
  place: string;
  licence: string;
  /** True when the licence is one of HELD_LICENCES. */
  held: boolean;
  /** Where the browser would load the image from: a host the museum's content security policy allows, or "self". */
  host: string;
  /** The author as the record gives it, or "" when the record names none (allowed only where the licence asks for no credit). */
  creator: string;
}

export type ImageVerdict = { ok: true; round: ImageRound } | { ok: false; why: string };

export interface ImageContext {
  /** Looks a museum record up by id ("place/toledo"); null when there is no such record. */
  find(id: string): Rec | null;
  /** Hosts in `img-src` of the museum's content security policy. */
  hosts: ReadonlySet<string>;
}

const text = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const classOf = (id: string): string => id.slice(0, id.indexOf("/"));

/** Lower-cases and strips Latin and Arabic marks, so "Qurṭuba" is found in "qurtuba" and vowelled Arabic in plain. */
export const fold = (s: string): string =>
  s
    .toLocaleLowerCase("en")
    .normalize("NFKD")
    .replace(/[̀-ًͯ-ٰٟـ]/g, "");

/** Every name a record carries, in any language. */
const namesOf = (rec: Rec): string[] => {
  const label = rec.label;
  if (!label || typeof label !== "object") return [];
  return Object.values(label as Rec).map(text).filter(Boolean);
};

/** The targets of a record's relations of one type. */
const related = (rec: Rec, type: string): string[] =>
  list(rec.relations)
    .filter((r): r is Rec => Boolean(r) && typeof r === "object" && (r as Rec).type === type && typeof (r as Rec).target === "string")
    .map((r) => String(r.target));

/**
 * G-0006 rule 2, the same test the pack builder applies: a city, town or site whose coordinates the museum records
 * to `site` or `locality` precision, with an Arabic and an English name.
 */
export function placeQualifies(place: Rec): boolean {
  const c = place.coordinates;
  if (!Array.isArray(c) || c.length !== 2 || typeof c[0] !== "number" || typeof c[1] !== "number") return false;
  if (!["city", "town", "site"].includes(text(place.kind))) return false;
  if (!["site", "locality"].includes(text(place.coordinate_precision))) return false;
  const label = (place.label ?? {}) as Rec;
  return Boolean(text(label.ar) && text(label.en));
}

/** The image hosts named in a `_headers` file's content security policy (`img-src … https://host …`). */
export function imageHosts(headers: string): Set<string> {
  const out = new Set<string>();
  for (const line of headers.split("\n")) {
    const at = line.indexOf("Content-Security-Policy:");
    if (at < 0 || line.trimStart().startsWith("#")) continue;
    const directive = line
      .slice(at)
      .split(";")
      .map((d) => d.trim())
      .find((d) => d.startsWith("img-src ") || d.includes(" img-src "));
    if (!directive) continue;
    for (const token of directive.slice(directive.indexOf("img-src")).split(/\s+/)) if (token.startsWith("https://")) out.add(token.slice("https://".length).replace(/\/.*$/, ""));
  }
  return out;
}

/** The one place a building or an object is tied to, or the reason there is not exactly one. */
function placeOfSubject(subject: Rec, field: string, relation: string): string | { why: string } {
  const places = new Set<string>([text(subject[field]), ...related(subject, relation)].filter((id) => id.startsWith("place/")));
  if (places.size === 0) return { why: `the ${text(subject.class)} record names no place (${field})` };
  if (places.size > 1) return { why: `the ${text(subject.class)} record names more than one place` };
  return [...places][0]!;
}

/** Decides whether one media record can be an image round. Every refusal carries its reason, to be counted. */
export function judgeImage(media: Rec, ctx: ImageContext): ImageVerdict {
  const no = (why: string): ImageVerdict => ({ ok: false, why });
  const licence = text(media.license);
  // An AI illustration is the model's imagining from the graph, never a depiction of its subject (Founder's Charter),
  // so there is no "thing shown" to ask about. A drawing or a map is not a picture of a place either.
  if (licence === "AI-GENERATED") return no("an AI-generated illustration, which depicts nothing");
  if (text(media.kind) !== "image") return no(`kind ${text(media.kind) || "missing"}: not a photograph or scan`);
  if ("sensitivity" in media) return no("marked sensitive");
  const held = HELD_LICENCES.includes(licence);
  if (!held && !FREE_LICENCES.includes(licence)) return no(`licence ${licence || "missing"} is not usable`);

  let host = "";
  const url = text(media.url);
  if (url) {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return no("the image address cannot be read");
    }
    if (parsed.protocol !== "https:" || !ctx.hosts.has(parsed.host)) return no("hosted where the museum's content security policy does not allow images from");
    host = parsed.host;
  } else if (media.files && typeof media.files === "object" && Object.keys(media.files as Rec).length > 0) host = "self";
  else return no("no image file");

  const depicted = list(media.depicts).map(text).filter(Boolean);
  if (depicted.length === 0) return no("names no subject");
  if (depicted.some((id) => classOf(id) === "person")) return no("depicts a person");
  const subjects = depicted.filter((id) => ["place", "building", "object"].includes(classOf(id)));
  if (subjects.length === 0) return no("its subject is not a place, a building or an object");
  if (subjects.length > 1) return no("more than one place, building or object depicted");
  const subjectId = subjects[0]!;
  const subject = ctx.find(subjectId);
  if (!subject) return no("its subject has no record");
  if ("sensitivity" in subject) return no("its subject is marked sensitive");

  let placeId: string;
  let question: ImageQuestion = "where";
  if (classOf(subjectId) === "place") placeId = subjectId;
  else if (classOf(subjectId) === "building") {
    const at = placeOfSubject(subject, "location", "located_in");
    if (typeof at !== "string") return no(at.why);
    placeId = at;
  } else {
    if (OBJECT_KINDS_NEVER_ASKED.has(text(subject.kind))) return no("a manuscript page or a relic, which is not made a picture question");
    const at = placeOfSubject(subject, "made_in", "made_in");
    if (typeof at !== "string") return no(at.why);
    placeId = at;
    question = "made";
  }
  const place = ctx.find(placeId);
  if (!place) return no("its place has no record");
  if ("sensitivity" in place) return no("its place is marked sensitive");
  if (!placeQualifies(place)) return no("its place cannot be scored against (approximate coordinates, or not a city, town or site)");

  const creator = text(media.creator);
  if (NEEDS_AUTHOR.has(licence) && !creator) return no("the licence asks for the author to be credited and the record names none");
  // The author's name is shown before the guess. If it happens to contain the answer, the picture cannot be credited
  // without giving it away, and a picture that cannot be credited is not shown.
  const foldedCreator = fold(creator);
  const answers = [...namesOf(subject), ...namesOf(place)].map(fold).filter((n) => n.length >= 3);
  if (foldedCreator && answers.some((n) => foldedCreator.includes(n))) return no("the author's name contains the answer");

  return { ok: true, round: { media: text(media.id), question, subject: subjectId, place: placeId, licence, held, host, creator } };
}

/**
 * What a year's schedule needs before image rounds enter it (G-0008, rule 6). A picture is never shown twice in a
 * year and a subject is pictured once; an image answer returns to the same place at most `perPlace` times a year.
 */
export const IMAGE_SCHEDULE_NEEDS = {
  /** One image round a week. */
  weekly: { images: 52, perPlace: 2 },
  /** One image round a day. */
  daily: { images: 365, perPlace: 4 },
} as const;

/** How many of the rounds a year's schedule could use: one per subject, and at most `perPlace` at any one place. */
export function usableImages(rounds: ImageRound[], perPlace: number): number {
  const subjectsAt = new Map<string, Set<string>>();
  for (const r of rounds) {
    if (!subjectsAt.has(r.place)) subjectsAt.set(r.place, new Set());
    subjectsAt.get(r.place)!.add(r.subject);
  }
  let n = 0;
  for (const subjects of subjectsAt.values()) n += Math.min(subjects.size, perPlace);
  return n;
}

export interface ImageSupply {
  images: number;
  subjects: number;
  places: number;
  usableWeekly: number;
  usableDaily: number;
  /** True when there are enough for one image round a week for a year. */
  weekly: boolean;
  /** True when there are enough for one a day. */
  daily: boolean;
}

export function imageSupply(rounds: ImageRound[]): ImageSupply {
  const usableWeekly = usableImages(rounds, IMAGE_SCHEDULE_NEEDS.weekly.perPlace);
  const usableDaily = usableImages(rounds, IMAGE_SCHEDULE_NEEDS.daily.perPlace);
  return {
    images: rounds.length,
    subjects: new Set(rounds.map((r) => r.subject)).size,
    places: new Set(rounds.map((r) => r.place)).size,
    usableWeekly,
    usableDaily,
    weekly: usableWeekly >= IMAGE_SCHEDULE_NEEDS.weekly.images,
    daily: usableDaily >= IMAGE_SCHEDULE_NEEDS.daily.images,
  };
}
