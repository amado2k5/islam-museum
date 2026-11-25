// The ten class-driven browsers of the shelves wave (docs/plan/ — imara, collection, tasawwuf,
// kalam, nisa, uhud, maahid, mawt, ulum, funun): which records each one lists and which section
// each record stands in. Membership is read from the record itself — class, kind, roles,
// occupations and tags — never a side table, so a record already in the graph appears the day it
// matches. Curated records join through each browser's `-browser` tag, and tagged records keep
// their section via the `<tag>-<section>` convention the passage browsers use.
import type { Node } from "./build-graph.js";

export interface ShelfSpec {
  /** URL slug: /[lang]/<slug>/ and /api/v1/<slug>.json */
  slug: string;
  /** Curated membership tag, e.g. "imara-browser". */
  tag: string;
  /** Section ids in page order; "curated" is the tagged-records shelf where it exists. */
  sections: readonly string[];
  /** Is this record a member? */
  pick: (n: Node) => boolean;
  /** The member's section id (one of `sections`). */
  sectionOf: (n: Node) => string;
}

const rolesOf = (n: Node): Set<string> =>
  new Set(((n.data.roles ?? []) as unknown[]).map((r) => String(r)));

const jobsOf = (n: Node): Set<string> =>
  new Set(
    ((n.data.occupations ?? []) as any[])
      .map((o) => String(o?.job ?? ""))
      .filter(Boolean)
      .map((j) => j.replace(/^job\//, "")),
  );

const kindOf = (n: Node): string => String(n.data.kind ?? "");

const any = (set: Set<string>, ...names: string[]) => names.some((x) => set.has(x));

/** A record tagged `<slug>-<section>` lands in that section; a bare `<slug>-browser` tag lands
 *  in the last ("curated") section. */
const tagSection = (spec: ShelfSpec, n: Node): string => {
  const tagged = n.tags.find((t) => t.startsWith(`${spec.tag.split("-")[0]}-`) || t === spec.tag);
  if (tagged && tagged !== spec.tag) {
    const s = tagged.slice(tagged.indexOf("-") + 1);
    if ((spec.sections as readonly string[]).includes(s)) return s;
  }
  return spec.sections[spec.sections.length - 1];
};

/** Class-driven pick: tag wins over the rule so curated records always enter. */
const specPick = (spec: ShelfSpec, rule: (n: Node) => boolean) => (n: Node) =>
  n.tags.includes(spec.tag) || rule(n);

/* ————— العمارة — Sacred Architecture: every building that is not a tomb or shrine ————— */
const IMARA_KIND: Record<string, string> = {
  mosque: "mosques", minaret: "mosques",
  madrasa: "madrasas",
  palace: "palaces",
  fort: "defense",
  library: "learning", observatory: "learning",
  bimaristan: "care",
  bazaar: "civic", khan: "civic", hammam: "civic", garden: "civic", other: "civic",
};
const imara: ShelfSpec = {
  slug: "imara",
  tag: "imara-browser",
  sections: ["mosques", "madrasas", "palaces", "defense", "learning", "care", "civic", "curated"] as const,
  pick: () => false,
  sectionOf: () => "curated",
};
imara.pick = specPick(imara, (n) => n.class === "building" && !["tomb", "shrine"].includes(kindOf(n)));
imara.sectionOf = (n) =>
  n.class === "building" && IMARA_KIND[kindOf(n)] ? IMARA_KIND[kindOf(n)] : tagSection(imara, n);

/* ————— المقتنيات — Objects & Artifacts: the museum's collection by material ————— */
const COLLECTION_KIND: Record<string, string> = {
  folio: "manuscripts", manuscript: "manuscripts",
  ceramic: "ceramics", tile: "ceramics", glass: "ceramics",
  metalwork: "metalwork", lamp: "metalwork",
  textile: "textiles", carpet: "textiles",
  relic: "relics",
  sword: "arms", instrument: "arms", astrolabe: "arms",
  coin: "coins",
  other: "other",
};
const collection: ShelfSpec = {
  slug: "collection",
  tag: "collection-browser",
  sections: ["manuscripts", "ceramics", "metalwork", "textiles", "relics", "arms", "coins", "other", "curated"] as const,
  pick: () => false,
  sectionOf: () => "curated",
};
collection.pick = specPick(collection, (n) => n.class === "object");
collection.sectionOf = (n) =>
  n.class === "object" && COLLECTION_KIND[kindOf(n)] ? COLLECTION_KIND[kindOf(n)] : tagSection(collection, n);

/* ————— التصوف — Sufism: the orders, the mystics and their works ————— */
const tasawwuf: ShelfSpec = {
  slug: "tasawwuf",
  tag: "tasawwuf-browser",
  sections: ["orders", "masters", "works", "concepts", "curated"] as const,
  pick: () => false,
  sectionOf: () => "curated",
};
tasawwuf.pick = specPick(
  tasawwuf,
  (n) =>
    (n.class === "person" && (any(rolesOf(n), "mystic", "sufi", "sufi-singer") || any(jobsOf(n), "sufi"))) ||
    (n.class === "group" && kindOf(n) === "order"),
);
tasawwuf.sectionOf = (n) => {
  if (n.class === "group") return "orders";
  if (n.class === "person") return "masters";
  if (n.class === "work") return "works";
  if (n.class === "concept") return "concepts";
  return tagSection(tasawwuf, n);
};

/* ————— الكلام والفلسفة — Theology & Philosophy: the schools and their people ————— */
const kalam: ShelfSpec = {
  slug: "kalam",
  tag: "kalam-browser",
  sections: ["schools", "mutakallimun", "philosophers", "works", "curated"] as const,
  pick: () => false,
  sectionOf: () => "curated",
};
kalam.pick = specPick(
  kalam,
  (n) =>
    (n.class === "person" && (any(rolesOf(n), "theologian", "philosopher") || any(jobsOf(n), "mutakallim", "faylasuf"))) ||
    (n.class === "group" && ["sect", "madhhab"].includes(kindOf(n))),
);
kalam.sectionOf = (n) => {
  if (n.class === "group") return "schools";
  if (n.class === "person") return any(rolesOf(n), "philosopher") ? "philosophers" : "mutakallimun";
  if (n.class === "work") return "works";
  return tagSection(kalam, n);
};

/* ————— نساء الإسلام — Women of Islam: every woman on record, by her field ————— */
const NISA_ROLES: [string[], string][] = [
  [["companion"], "companions"],
  [["scholar", "jurist", "muhaddith", "teacher", "faqih", "transmitter", "qadi", "professor", "theologian"], "scholars"],
  [["poet", "writer", "journalist", "novelist"], "writers"],
  [["ruler", "sultan", "caliph", "politician", "emir", "vizier", "queen", "governor"], "rulers"],
  [["calligrapher", "artist", "musician", "singer", "actor", "reciter", "composer"], "arts"],
  [["athlete"], "sports"],
  [["mystic", "sufi"], "piety"],
];
const nisa: ShelfSpec = {
  slug: "nisa",
  tag: "nisa-browser",
  sections: ["companions", "scholars", "piety", "writers", "arts", "rulers", "sports", "society", "curated"] as const,
  pick: () => false,
  sectionOf: () => "curated",
};
nisa.pick = specPick(nisa, (n) => n.class === "person" && n.data.gender === "female");
nisa.sectionOf = (n) => {
  if (n.class === "person") {
    const r = rolesOf(n);
    for (const [names, section] of NISA_ROLES) if (names.some((x) => r.has(x))) return section;
    return "society";
  }
  return tagSection(nisa, n);
};

/* ————— العهود والدبلوماسية — Covenants & Diplomacy: treaties, charters and envoys ————— */
const UHUD_EVENT_KINDS = ["treaty", "declaration", "truce", "pact", "peace", "armistice", "capitulation", "covenant", "alliance"];
const uhud: ShelfSpec = {
  slug: "uhud",
  tag: "uhud-browser",
  sections: ["treaties", "declarations", "charters", "envoys", "other", "curated"] as const,
  pick: () => false,
  sectionOf: () => "curated",
};
uhud.pick = specPick(
  uhud,
  (n) =>
    (n.class === "event" && UHUD_EVENT_KINDS.includes(kindOf(n))) ||
    (n.class === "work" && kindOf(n) === "charter") ||
    (n.class === "person" && (any(rolesOf(n), "diplomat", "ambassador") || any(jobsOf(n), "diplomat"))),
);
uhud.sectionOf = (n) => {
  if (n.class === "work") return "charters";
  if (n.class === "person") return "envoys";
  if (n.class === "event") return kindOf(n) === "declaration" ? "declarations" : UHUD_EVENT_KINDS.includes(kindOf(n)) ? "treaties" : "other";
  return tagSection(uhud, n);
};

/* ————— المعاهد — Institutions of Learning: madrasas, libraries, observatories, hospitals ————— */
const MAAHID_BUILDING: Record<string, string> = {
  madrasa: "madrasas",
  library: "libraries",
  observatory: "observatories",
  bimaristan: "hospitals",
};
const MAAHID_GROUP: Record<string, string> = {
  university: "organisations",
  institution: "organisations",
  "standards-body": "organisations",
  "international-organisation": "organisations",
};
const maahid: ShelfSpec = {
  slug: "maahid",
  tag: "maahid-browser",
  sections: ["madrasas", "libraries", "observatories", "hospitals", "organisations", "curated"] as const,
  pick: () => false,
  sectionOf: () => "curated",
};
maahid.pick = specPick(
  maahid,
  (n) =>
    (n.class === "building" && kindOf(n) in MAAHID_BUILDING) ||
    (n.class === "group" && kindOf(n) in MAAHID_GROUP) ||
    (n.class === "work" && kindOf(n) === "online-library"),
);
maahid.sectionOf = (n) => {
  if (n.class === "building" && MAAHID_BUILDING[kindOf(n)]) return MAAHID_BUILDING[kindOf(n)];
  if (n.class === "group" || n.class === "work") return "organisations";
  return tagSection(maahid, n);
};

/* ————— القبور والمدافن — Tombs & Resting Places ————— */
const mawt: ShelfSpec = {
  slug: "mawt",
  tag: "mawt-browser",
  sections: ["tombs", "shrines", "curated"] as const,
  pick: () => false,
  sectionOf: () => "curated",
};
mawt.pick = specPick(mawt, (n) => n.class === "building" && ["tomb", "shrine"].includes(kindOf(n)));
mawt.sectionOf = (n) =>
  n.class === "building" ? (kindOf(n) === "shrine" ? "shrines" : "tombs") : tagSection(mawt, n);

/* ————— العلوم — Sciences & Scientists: the people of the disciplines, by field ————— */
const ULUM_ROLES: [string[], string][] = [
  [["astronomer", "astrophysicist"], "astronomy"],
  [["mathematician"], "mathematics"],
  [["physician", "nurse"], "medicine"],
  [["geographer"], "geography"],
  [["physicist", "chemist", "biochemist", "scientist"], "natural"],
  [["engineer"], "engineering"],
];
const ULUM_JOBS: Record<string, string> = {
  astronomer: "astronomy", astrologer: "astronomy",
  mathematician: "mathematics", "mialqa": "mathematics",
  physician: "medicine", tabib: "medicine", baytar: "medicine", "jarrah": "medicine",
  cartographer: "geography", geographer: "geography",
  chemist: "natural", "attar": "natural",
  engineer: "engineering",
};
const ulum: ShelfSpec = {
  slug: "ulum",
  tag: "ulum-browser",
  sections: ["astronomy", "mathematics", "medicine", "geography", "natural", "engineering", "curated"] as const,
  pick: () => false,
  sectionOf: () => "curated",
};
const ulumRoleOf = (n: Node): string | null => {
  const r = rolesOf(n);
  for (const [names, section] of ULUM_ROLES) if (names.some((x) => r.has(x))) return section;
  const j = jobsOf(n);
  for (const [job, section] of Object.entries(ULUM_JOBS)) if (j.has(job)) return section;
  return null;
};
ulum.pick = specPick(ulum, (n) => n.class === "person" && ulumRoleOf(n) !== null);
ulum.sectionOf = (n) => (n.class === "person" ? ulumRoleOf(n) ?? "curated" : tagSection(ulum, n));

/* ————— الفنون — Arts & Artists: calligraphy, the visual arts, music and the book crafts ————— */
const FUNUN_ROLES: [string[], string][] = [
  [["calligrapher"], "calligraphy"],
  [["artist", "painter", "illuminator", "miniaturist"], "visual"],
  [["musician", "singer", "composer", "reciter"], "music"],
  [["architect"], "architecture"],
  [["scribe"], "bookcrafts"],
];
const FUNUN_JOBS: Record<string, string> = {
  calligrapher: "calligraphy", illuminator: "calligraphy",
  copyist: "bookcrafts", bookbinder: "bookcrafts", engraver: "bookcrafts", embroiderer: "bookcrafts",
  architect: "architecture",
};
const funun: ShelfSpec = {
  slug: "funun",
  tag: "funun-browser",
  sections: ["calligraphy", "visual", "music", "architecture", "bookcrafts", "curated"] as const,
  pick: () => false,
  sectionOf: () => "curated",
};
const fununRoleOf = (n: Node): string | null => {
  const r = rolesOf(n);
  for (const [names, section] of FUNUN_ROLES) if (names.some((x) => r.has(x))) return section;
  const j = jobsOf(n);
  for (const [job, section] of Object.entries(FUNUN_JOBS)) if (j.has(job)) return section;
  return null;
};
funun.pick = specPick(funun, (n) => n.class === "person" && fununRoleOf(n) !== null);
funun.sectionOf = (n) => (n.class === "person" ? fununRoleOf(n) ?? "curated" : tagSection(funun, n));

export const SHELVES: Record<string, ShelfSpec> = {
  imara, collection, tasawwuf, kalam, nisa, uhud, maahid, mawt, ulum, funun,
};

export const SHELF_SLUGS = Object.keys(SHELVES);
