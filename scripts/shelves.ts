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

/* ————— الأعياد — Festivals and Occasions: the Islamic year and its rites ————— */
// Ramadan and its month (practices of the fast and the night, concepts of the month and of
// Laylat al-Qadr, the moon-sighting dua), Hajj and its season, the two festivals, the life
// occasions (aqiqah to janaza), the occasions of hardship (fear prayer, rain, eclipse), the
// named days (Ashura, Mawlid, Isra), the Hijri months, the Kaaba ceremonies, the regional
// customs, and the passages that tell how the Prophet and the Companions kept them.
const AAYAD_RAMADAN = new Set([
  "practice/sawm-ramadan", "practice/itikaf", "practice/laylat-al-qadr",
  "practice/dua-of-laylat-al-qadr", "practice/suhur", "practice/iftar",
  "practice/qiyam-al-layl", "practice/taraweeh", "practice/dua-taraweeh-hajah-tasbih",
  "concept/ramadan-month", "concept/ashr-awakhir-ramadan", "concept/ramadan-fiqh",
  "concept/hisab-siyam-ramadan-wa-qiyamuh", "concept/hisab-umra-fi-ramadan",
  "concept/laylat-al-qadr", "concept/malaikat-laylat-al-qadr",
]);
const AAYAD_HAJJ = new Set([
  "practice/hajj", "practice/umrah", "practice/tawaf", "practice/sai", "practice/talbiya",
  "practice/dua-hajj-arafat", "practice/dua-hajj-hijr-baytullah-sai",
  "practice/dua-hajj-muzdalifa-mina", "practice/dua-hajj-tashriq-zamzam-ziyara",
  "practice/dua-on-seeing-the-kaaba-and-in-tawaf",
  "concept/dhul-hijja-month", "concept/yawm-arafa-fiqh", "concept/mina-rulings",
]);
const AAYAD_EIDS = new Set([
  "practice/udhiyya", "practice/zakat-al-fitr",
]);
const AAYAD_DUTY = new Set([
  "practice/zakat", "practice/sadaqa",
]);
const AAYAD_OBS = new Set([
  "concept/hisab-sawm-arafa-wa-ashura", "concept/hijri-calendar",
  "event/isra-and-miraj", "event/first-revelation",
  "practice/dua-on-seeing-the-new-moon",
  "practice/dua-of-the-traveller", "practice/dua-travel-arrival-return",
  "practice/dua-at-sea-and-on-the-road",
]);
const AAYAD_CEREMONY = new Set([
  "concept/kiswa", "object/kiswa", "practice/dua-at-the-completion-of-the-quran",
  "job/sadin", "building/masjid-al-haram",
]);
const AAYAD_DEATH = new Set([
  "practice/salat-al-janaza",
]);
const AAYAD_WAR = new Set([
  "practice/salat-al-khawf", "practice/dua-at-battle", "practice/dua-at-meeting-the-enemy",
  "practice/dua-nafir" /* in case it exists later */,
  "concept/ghanimah" /* absent ids are harmless */, "concept/ghanima",
]);
const aayad: ShelfSpec = {
  slug: "aayad",
  tag: "aayad-browser",
  sections: ["ramadan", "eids", "hajj", "ceremonies", "life", "death", "war", "observances", "months", "customs", "sunnah", "curated"],
  pick: () => false,
  sectionOf: () => "curated",
};
const aayadRule = (n: Node): string | null => {
  if (n.class === "practice") {
    const k = kindOf(n);
    if (k === "rite_of_passage") {
      return ["dafn", "ghusl-al-janaza", "salat-al-janaza"].some((s) => n.id.endsWith(`/${s}`)) ? "death" : "life";
    }
    if (k === "festival") return n.id.endsWith("-adha") || n.id.endsWith("-fitr") ? "eids" : "observances";
  }
  if (AAYAD_EIDS.has(n.id)) return "eids";
  if (AAYAD_DUTY.has(n.id)) return "observances";
  if (AAYAD_RAMADAN.has(n.id)) return "ramadan";
  if (AAYAD_HAJJ.has(n.id)) return "hajj";
  if (AAYAD_OBS.has(n.id)) return "observances";
  if (AAYAD_CEREMONY.has(n.id)) return "ceremonies";
  if (AAYAD_DEATH.has(n.id)) return "death";
  if (AAYAD_WAR.has(n.id)) return "war";
  if (n.class === "concept" && /-months?$/.test(n.slug ?? "") && !n.id.startsWith("concept/zij-sabi-"))
    return n.id === "concept/ramadan-month" ? "ramadan" : "months";
  return null;
};
aayad.pick = specPick(aayad, (n) => aayadRule(n) !== null);
aayad.sectionOf = (n) => aayadRule(n) ?? tagSection(aayad, n);

/* ————— أصحاب الهمم — People of Determination: disability in the record ————— */
// The companions, scholars and figures on record who lived with disability — the blind, the
// deaf, the lame, the amputees — the fiqh accommodations made for them, and the passages that
// tell how the community honoured them. Mostly a curated shelf: membership grows through the
// himam-browser tag as records are enriched.
const HIMAM_PERSONS = new Set([
  "person/abd-allah-ibn-umm-maktum", "person/amr-ibn-al-jamuh", "person/julaybib",
  "person/ata-ibn-abi-rabah", "person/muhammad-ibn-sirin", "person/urwa-ibn-al-zubayr",
  "person/qatada-ibn-diama", "person/abu-l-ala-al-maarri", "person/taha-hussein",
]);
const HIMAM_CONCEPTS = new Set([
  "concept/abkam",
]);
const himam: ShelfSpec = {
  slug: "himam",
  tag: "himam-browser",
  sections: ["persons", "rulings", "concepts", "works", "sunnah", "curated"],
  pick: () => false,
  sectionOf: () => "curated",
};
const himamRule = (n: Node): string | null => {
  if (HIMAM_PERSONS.has(n.id)) return "persons";
  if (HIMAM_CONCEPTS.has(n.id)) return "concepts";
  return null;
};
himam.pick = specPick(himam, (n) => himamRule(n) !== null);
himam.sectionOf = (n) => himamRule(n) ?? tagSection(himam, n);

/* ————— الزكاة — Zakat and Sadaqat: the third pillar as institution ————— */
// What zakat is and who gives and receives it (the eight asnaf of Q 9:60), the rulings of
// nisab and hawl, the public treasury and the taxes around it, its history from Medina to the
// Ridda wars, the works written on it, the fatwas asked today and the hadith chapters that
// ground it. Membership: class-driven on zakat/sadaqa records and fatwas, plus id sets and the
// zakat-browser tag for the rest.
const ZAKAT_CORE = new Set([
  "practice/zakat", "practice/zakat-al-fitr", "practice/sadaqa",
]);
const ZAKAT_CONCEPTS = new Set([
  "concept/zakat", "concept/sadaqa", "concept/sadaqah", "concept/sadaqa-jariya",
  "concept/nisab", "concept/hawl-zakat-year", "concept/ushr", "concept/ushri",
  "concept/fay", "concept/kharaj", "concept/kharaj-fiqh", "concept/kharaj-lands",
  "concept/khums-fiqh", "concept/jizya", "concept/waqf", "concept/waqf-fiqh",
  "concept/bayt-al-mal", "concept/fard-kifaya",
]);
const ZAKAT_RECIPIENTS = new Set([
  "concept/asnaf-al-zakat", "concept/faqir", "concept/miskin",
  "concept/amilina-alayha", "concept/al-muallafa-qulubuhum", "concept/fi-l-riqab",
  "concept/gharimin", "concept/al-infaq-fi-sabil-allah", "concept/ibn-al-sabil",
  "concept/sabil",
]);
const ZAKAT_HISTORY = new Set([
  "event/ridda-wars", "event/oman-campaign-of-the-ridda",
  "person/muadh-ibn-jabal", "person/abu-ubayd-al-qasim-ibn-sallam",
]);
const ZAKAT_WORKS = new Set([
  "work/kitab-al-amwal",
]);
const ZAKAT_SUNNAH = new Set([
  "passage/muwatta-kitab-03-zakat", "passage/muslim-kitab-12", "passage/tirmidhi-kitab-07",
  "passage/muslim-1017", "passage/muslim-1031",
  "passage/musannaf-ibn-abi-shayba-umam-2-2669", "passage/muwatta-3-780",
]);
const zakat: ShelfSpec = {
  slug: "zakat",
  tag: "zakat-browser",
  sections: ["pillar", "recipients", "rulings", "treasury", "history", "works", "fatwas", "sunnah", "curated"],
  pick: () => false,
  sectionOf: () => "curated",
};
const zakatRule = (n: Node): string | null => {
  if (ZAKAT_CORE.has(n.id)) return "pillar";
  if (ZAKAT_RECIPIENTS.has(n.id)) return "recipients";
  if (ZAKAT_HISTORY.has(n.id)) return "history";
  if (ZAKAT_WORKS.has(n.id)) return "works";
  if (ZAKAT_SUNNAH.has(n.id)) return "sunnah";
  if (ZAKAT_CONCEPTS.has(n.id)) return /bayt-al-mal|fay|kharaj|jizya|waqf/.test(n.id) ? "treasury" : "rulings";
  if (n.class === "work" && /^(work\/)?fatwa-.*(zakat|sadaqa)/.test(n.id)) return "fatwas";
  return null;
};
zakat.pick = specPick(zakat, (n) => zakatRule(n) !== null);
zakat.sectionOf = (n) => zakatRule(n) ?? tagSection(zakat, n);

/* ————— العتق — Tahrir al-raqiq: freeing the enslaved in Islam ————— */
// The freed and their stories — Bilal, Zayd, Salman, Suhayb, Khabbab, the mawali scholars —
// the rulings of itq, mukataba, tadbir and umm walad, the walaa tie, the zakat share for
// fi'l-riqab, the equality preached with it, and the hadith chapters of kitab al-itq.
const ITQ_FREED = new Set([
  "person/bilal-ibn-rabah", "person/zayd-ibn-haritha", "person/salman-al-farisi",
  "person/suhayb-ibn-sinan", "person/ammar-ibn-yasir", "person/khabbab-ibn-al-aratt",
  "person/khabbab-mawla-utbah", "person/umm-ayman", "person/thawban-mawla-al-nabi",
  "person/safina-mawla-al-nabi", "person/wahshi-ibn-harb", "person/nafi-mawla-ibn-umar",
  "person/makhul-al-dimashqi", "person/maytham-al-tammar", "person/salim-mawla-abi-hudhayfa",
  "person/tawus-ibn-kaysan", "person/said-ibn-jubayr", "person/mujahid-ibn-jabr",
  "person/ikrima-mawla-ibn-abbas", "person/al-hasan-al-basri",
  "person/al-shaabi", "person/abd-al-rahman-ibn-hurmuz",
]);
const ITQ_RULINGS = new Set([
  "concept/itq-fiqh", "concept/mukataba", "concept/mawla-al-itaqa",
  "concept/mawla-al-muwala", "concept/kaffara", "concept/istilad-umm-al-walad",
  "concept/tadbir",
]);
const ITQ_EQUALITY = new Set([
  "concept/equality-in-islam", "concept/taswiya-equality", "concept/asabiyya",
  "concept/mawali",
]);
const ITQ_SUNNAH = new Set([
  "passage/bukhari-kitab-49", "passage/muslim-kitab-20", "passage/muwatta-kitab-24-itq",
  "passage/ibnmajah-kitab-19", "passage/abudawud-kitab-31",
  "passage/arbaun-24", "passage/musannaf-ibn-abi-shayba-wasaya-2-6737",
  "passage/bidaya-nihaya-wasaya-3-221", "passage/hadith-mirat-mafatih-005",
]);
const itq: ShelfSpec = {
  slug: "itq",
  tag: "itq-browser",
  sections: ["freed", "rulings", "equality", "concepts", "sunnah", "curated"],
  pick: () => false,
  sectionOf: () => "curated",
};
const itqRule = (n: Node): string | null => {
  if (ITQ_FREED.has(n.id)) return "freed";
  if (ITQ_RULINGS.has(n.id)) return "rulings";
  if (ITQ_EQUALITY.has(n.id)) return "equality";
  if (ITQ_SUNNAH.has(n.id)) return "sunnah";
  return null;
};
itq.pick = specPick(itq, (n) => itqRule(n) !== null);
itq.sectionOf = (n) => itqRule(n) ?? tagSection(itq, n);

/* ————— الحكم — Nizam al-hukm: governance in Islam ————— */
// What the khilafa was, who the khalifa was and how he ruled: the vizierate and the wazirs,
// the governors (wulah), the diwans — insha, barid, khatim — the judges and mazalim, the
// hisba and the shurta, the khutba and the sikka, the books of ahkam sultaniyya, the four
// madhhabs' positions, and the sunnah of ruling — kitab al-ahkam and the saqifa and bay'a.
const HUKM_KHILAFA = new Set([
  "concept/khilafa-rashida", "concept/imama", "concept/imamat-al-kubra",
  "concept/khilafat-al-insan-fi-al-ard", "concept/ahl-al-hall-wal-aqd",
  "concept/mubayaa-bila-mushahada", "concept/amir-al-muslimin",
  "concept/amir-al-umara", "concept/al-amir-al-kabir", "concept/ittihad-al-hukm",
  "event/arbitration-of-siffin", "event/battle-of-siffin",
]);
const HUKM_OFFICERS = new Set([
  "job/sultan", "job/wali", "job/qadi", "job/qadi-al-qudat", "job/hajib",
  "job/katib", "job/muhtasib", "job/mutawalli", "job/nazir-al-waqf",
  "job/sahib-al-barid", "job/sahib-al-shurta", "job/amil", "job/sadin",
  "group/barmakids", "person/al-fadl-ibn-yahya-al-barmaki",
  "person/abu-ishaq-al-barmaki", "person/al-khayzuran",
  "person/ali-ibn-al-furat", "person/al-muhsin-ibn-ali-ibn-al-furat",
  "person/al-fadl-ibn-jafar-ibn-al-furat", "person/ahmad-ibn-al-furat",
  "person/abu-yusuf-al-qadi", "person/asad-ibn-al-furat",
]);
const HUKM_INSTITUTIONS = new Set([
  "concept/diwan-fiqh", "concept/diwan-zamam", "concept/diwan-al-barid",
  "concept/diwan-al-insha", "concept/diwan-al-khatim", "concept/diwan-al-ma",
  "concept/ahl-al-diwan", "concept/mazalim", "concept/hisba",
  "concept/hisba-enjoining-good", "concept/shurta", "concept/hukm-ruling",
  "concept/siyasa-governance", "concept/siyasa-shariyya",
  "concept/consultation-shura", "concept/shura-in-islam",
  "concept/khutba-fiqh", "concept/sakk", "concept/wilaya-ala-al-mal",
  "concept/wizara", "concept/wizara-fiqh", "concept/haram-hukm",
  "concept/amir-al-hajj", "concept/al-sakk-wal-hawala",
  "concept/sultan-al-hujja-wal-qahr", "concept/wala-fiqh",
]);
const HUKM_JUSTICE = new Set([
  "concept/qada-wa-al-diyana", "concept/al-qada-bil-yamin-maa-al-shahid",
  "concept/istikshaf-al-qada", "concept/huquq-al-amil",
]);
const HUKM_WORKS = new Set([
  "work/al-ahkam-al-sultaniyya-mawardi", "work/al-ahkam-al-sultaniyya-abu-yala",
  "work/al-siyasa-al-shariyya-ibn-taymiyya", "work/al-siyasa-al-shariyya-qaradawi",
  "work/nasihat-al-muluk", "work/adab-al-dunya-wal-din",
  "work/akhlaq-al-muluk-jahiz", "work/ahkam-ahl-al-dhimmah",
  "work/ahkam-ahl-al-milal", "work/suluk-maqrizi",
]);
const HUKM_MADHHABS = new Set([
  "group/hanafi-madhhab", "group/maliki-madhhab", "group/shafii-madhhab",
  "group/hanbali-madhhab", "group/jafari-madhhab", "group/zahiri-madhhab",
]);
const HUKM_SUNNAH = new Set([
  "passage/bukhari-kitab-93", "passage/muslim-kitab-33", "passage/abudawud-kitab-24",
  "passage/tirmidhi-kitab-33",
]);
const hukm: ShelfSpec = {
  slug: "hukm",
  tag: "hukm-browser",
  sections: ["khilafa", "officers", "institutions", "justice", "works", "madhhabs", "sunnah", "curated"],
  pick: () => false,
  sectionOf: () => "curated",
};
const hukmRule = (n: Node): string | null => {
  if (HUKM_KHILAFA.has(n.id)) return "khilafa";
  if (HUKM_OFFICERS.has(n.id)) return "officers";
  if (HUKM_INSTITUTIONS.has(n.id)) return "institutions";
  if (HUKM_JUSTICE.has(n.id)) return "justice";
  if (HUKM_WORKS.has(n.id)) return "works";
  if (HUKM_MADHHABS.has(n.id)) return "madhhabs";
  if (HUKM_SUNNAH.has(n.id)) return "sunnah";
  if (n.class === "passage" && /^(passage\/)?(adab-mufrad|ansab-ashraf)-ahkam-/.test(n.id)) return "sunnah";
  return null;
};
hukm.pick = specPick(hukm, (n) => hukmRule(n) !== null);
hukm.sectionOf = (n) => hukmRule(n) ?? tagSection(hukm, n);

/* ————— الأطفال — Al-atfal fi'l-Islam: children in Islam ————— */
// The children who grew up around the Prophet — Ibn Abbas, Anas, Usama, the two grandsons,
// Aisha — the boys who memorised and travelled and led armies in their teens, the prodigies
// who became the imams — al-Shafi'i, al-Bukhari, Muslim, al-Nawawi, Ibn al-Jawzi — and the
// child's rights in the law: the aqiqa and the name, milk and hadhana, nafaqa, the orphan's
// wealth, tarbiya, taklif, and the works written for them.
const ATFAL_COMPANIONS = new Set([
  "person/ali-ibn-abi-talib", "person/zayd-ibn-haritha", "person/abdullah-ibn-abbas",
  "person/abdullah-ibn-umar", "person/anas-ibn-malik", "person/usama-ibn-zayd",
  "person/al-numan-ibn-bashir", "person/hasan-ibn-ali", "person/husayn-ibn-ali",
  "person/aisha", "person/fatima", "person/umama-bint-abi-al-as",
  "person/abdullah-ibn-al-zubayr", "person/abdullah-ibn-al-zubayr-ibn-abd-al-muttalib",
  "person/zubayr-ibn-al-awwam", "person/muadh-ibn-jabal", "person/khadija",
]);
const ATFAL_PRODIGIES = new Set([
  "person/al-shafii", "person/al-bukhari", "person/muslim-ibn-al-hajjaj",
  "person/al-nawawi", "person/ibn-al-jawzi", "person/abu-abd-al-rahman-al-shafii",
  "person/rabia-al-adawiyya", "person/al-khidr",
]);
const ATFAL_RIGHTS = new Set([
  "concept/aqiqa", "concept/childhood-sighar", "concept/fitra",
  "concept/huquq-al-abna", "concept/huquq-al-walidayn", "concept/uquq-al-walidayn",
  "concept/yatim-fiqh", "concept/wilayat-al-mal-al-yatim", "concept/nafaqa",
  "concept/nafaqat-al-murdia", "concept/khitan-circumcision", "concept/tarbiya",
  "concept/al-tarbiya-al-qiyadiyya", "concept/usul-al-tarbiya-al-thamaniya",
  "concept/rifq-fiqh", "concept/rifqa-fiqh", "concept/rahma", "concept/haq-right",
  "concept/al-sabi-fi-al-harb-al-diniyya", "concept/taklif-within-capacity",
]);
const ATFAL_WORKS = new Set([
  "work/tuhfat-al-mawdud", "work/tuhfat-al-atfal",
]);
const ATFAL_SUNNAH = new Set([
  "passage/bukhari-kitab-78", "passage/muslim-kitab-45", "passage/muslim-kitab-46",
  "passage/abudawud-kitab-43", "passage/tirmidhi-kitab-27",
]);
const atfal: ShelfSpec = {
  slug: "atfal",
  tag: "atfal-browser",
  sections: ["companions", "prodigies", "rights", "works", "sunnah", "curated"],
  pick: () => false,
  sectionOf: () => "curated",
};
const atfalRule = (n: Node): string | null => {
  if (ATFAL_COMPANIONS.has(n.id)) return "companions";
  if (ATFAL_PRODIGIES.has(n.id)) return "prodigies";
  if (ATFAL_RIGHTS.has(n.id)) return "rights";
  if (ATFAL_WORKS.has(n.id)) return "works";
  if (ATFAL_SUNNAH.has(n.id)) return "sunnah";
  return null;
};
atfal.pick = specPick(atfal, (n) => atfalRule(n) !== null);
atfal.sectionOf = (n) => atfalRule(n) ?? tagSection(atfal, n);

/* ————— المساكين — Al-masakin: the poor and the underdog ————— */
// The poor of Islam's story — ahl al-suffa and the beaten converts, Sumayya and Yasir, Khabbab,
// Bilal, Abu Dharr, Abu Hurayra the suffa man, Julaybib — how they lived and what they said,
// the concepts of faqr and it'am, and the sunnah that promises the poor of this ummah paradise
// half a day before the rich.
const MASAKIN_PERSONS = new Set([
  "person/sumayya-bint-khayyat", "person/yasir-ibn-amir", "person/ammar-ibn-yasir",
  "person/khabbab-ibn-al-aratt", "person/bilal-ibn-rabah", "person/suhayb-ibn-sinan",
  "person/salman-al-farisi", "person/abu-dharr-al-ghifari", "person/abu-hurayra",
  "person/julaybib", "person/wahshi-ibn-harb", "person/safina-mawla-al-nabi",
  "person/thawban-mawla-al-nabi", "person/zayd-ibn-haritha",
  "person/abdullah-ibn-masud", "person/al-miqdad-ibn-amr", "person/musab-ibn-umayr",
  "person/salim-mawla-abi-hudhayfa", "person/umm-ayman",
  "person/abd-al-rahman-ibn-zayd-ibn-al-khattab", "person/abdallah-ibn-khabbab",
]);
const MASAKIN_CONCEPTS = new Set([
  "concept/ahl-al-suffa", "concept/faqr", "concept/miskin", "concept/faqir",
  "concept/al-ghass-bi-al-taam", "concept/qillat-al-taam", "concept/ajir",
  "concept/hisab-al-muflis", "concept/muhajirun-of-abyssinia",
  "concept/al-tashannuj-ind-al-atfal",
]);
const MASAKIN_SUNNAH = new Set([
  "passage/bukhari-kitab-24", "passage/bukhari-kitab-76", "passage/bukhari-kitab-81",
  "passage/muslim-kitab-53",
]);
const masakin: ShelfSpec = {
  slug: "masakin",
  tag: "masakin-browser",
  sections: ["persons", "suffa", "concepts", "sunnah", "curated"],
  pick: () => false,
  sectionOf: () => "curated",
};
const masakinRule = (n: Node): string | null => {
  if (MASAKIN_PERSONS.has(n.id)) return "persons";
  if (n.id === "concept/ahl-al-suffa") return "suffa";
  if (MASAKIN_CONCEPTS.has(n.id)) return "concepts";
  if (MASAKIN_SUNNAH.has(n.id)) return "sunnah";
  return null;
};
masakin.pick = specPick(masakin, (n) => masakinRule(n) !== null);
masakin.sectionOf = (n) => masakinRule(n) ?? tagSection(masakin, n);


/* ————— المعاملات — Al-mu'amalat: the fiqh of dealings, domain by domain ————— */
// The law as it touches a life: who inherits from whom and who is shut out (ilm al-faraid,
// the wasiyya and its third), who may marry whom and the prohibitions of blood, milk and
// marriage (mahram, nikah, iddah, talaq, khul', zina and li'an), the contracts — aqd, buyu',
// rahn, ijara, hawala, wakala, hiba and dayn — riba, qimar and maysir where profit is
// forbidden, what may be eaten and slaughtered (dhabaih, mayta, khinzir), the intoxicants
// (khamr, muskir, the drugs fatwas), the punishments (qisas, diyat, uquba, ta'zir, hiraba),
// the fatwas asked today and the hadith chapters that ground them.
const MUAMALAT_INHERITANCE = new Set([
  "concept/mirath", "concept/irth-fiqh", "concept/ilm-al-faraid", "concept/mirath-al-nisa",
  "concept/al-wasiyya", "concept/al-wasiyya-al-diniyya", "concept/muwasat",
]);
const MUAMALAT_MARRIAGE = new Set([
  "concept/nikah-fiqh", "concept/nikah-munhi-anhu", "concept/nikah-al-amah",
  "concept/adl-nikah", "concept/mahram", "concept/iddah", "concept/iddat-al-hamil",
  "concept/khul-fiqh", "concept/talaq", "concept/lian-fiqh", "concept/zina",
  "concept/khiyana", "concept/walad-al-zina-fiqh", "concept/radaa",
  "concept/khala-min-al-radaa", "concept/allusion-to-proposal-in-iddah",
]);
const MUAMALAT_TRANSACTIONS = new Set([
  "concept/aqd", "concept/bay-al-dayn", "concept/bay-al-muharramat", "concept/dayn-fiqh",
  "concept/rahn-fiqh", "concept/ijara", "concept/hawala-debt-transfer", "concept/wakala-fiqh",
  "concept/hiba-fiqh", "concept/hadiyya-fiqh", "concept/ariya-madmuna", "concept/muwadiha",
  "concept/riba", "concept/riba-fiqh", "concept/ribas", "concept/qimar-and-gharar",
  "concept/maysir", "concept/nuqud-fiqh", "concept/al-sakk-wal-hawala", "concept/shufa",
]);
const MUAMALAT_FOOD = new Set([
  "concept/dhabaih-fiqh", "concept/mayta", "concept/khinzir-fiqh", "concept/lahm-fiqh",
  "concept/hazr-prohibition",
]);
const MUAMALAT_INTOXICANTS = new Set([
  "concept/khamr", "concept/muskir", "concept/al-adwiya-al-mukhaddira",
]);
const MUAMALAT_PUNISHMENTS = new Set([
  "concept/diyat-fiqh", "concept/aqila-diya", "concept/uquba",
  "concept/tazir-discretionary-punishment", "concept/hirabah", "concept/jinaya",
  "concept/hudud-allah", "concept/hudud-penalties", "concept/ihsan-hudud",
  "concept/asbab-suqut-al-uquba", "concept/lawth-qasama", "concept/muqasama",
  "concept/al-qisas-yawm-al-qiyama", "concept/al-jiraha",
]);
const MUAMALAT_SUNNAH = new Set([
  "passage/bukhari-kitab-85", "passage/muslim-kitab-10",
  "passage/bukhari-kitab-34", "passage/muslim-kitab-22", "passage/bukhari-kitab-51",
  "passage/bukhari-kitab-68", "passage/muslim-kitab-21", "passage/muslim-kitab-20",
  "passage/bukhari-kitab-86", "passage/bukhari-kitab-82", "passage/bukhari-kitab-83",
  "passage/muwatta-kitab-23-wasiyya", "passage/muwatta-kitab-27-hudud",
  "passage/muwatta-kitab-28-ashriba", "passage/muwatta-kitab-29-uqul",
  "passage/muwatta-kitab-30-qasama", "passage/muwatta-kitab-22-aqdiya",
  "passage/muwatta-kitab-19-musaqat", "passage/muwatta-kitab-20-kira-al-ard",
  "passage/muwatta-kitab-21-shufa", "passage/muwatta-kitab-18-qiraad",
]);
const muamalatFatwaSection = (id: string): string | null => {
  if (/inherit|mirath|faraid|wasiyya|will|heir|bequest|wasiyya-wajiba/.test(id)) return "inheritance";
  if (/marriage|nikah|zawaj|divorce|talaq|khul|iddah|zina|lian|khiyana|guardian|mahr|wali.*marriage/.test(id)) return "marriage";
  if (/riba|interest|loan|gambl|qimar|maysir|lottery|contract|sale|buying|selling|bay|aqd|insurance|currency|mortgage|installment|credit-card|debt|rahn|ijara|rental|lease|hawala|wakala|deposit|gift/.test(id)) return "transactions";
  if (/food|meat|pork|khinzir|gelatin|dhabaih|slaughter|halal-meat|eating|drink.*(alcohol|wine)|animal|fat/.test(id)) return "food";
  if (/alcohol|khamr|wine|intoxic|muskir|drug|mukhadd|narcotic|cannabis|hashish|smoking|tobacco|sanitizer|handling-alcohol/.test(id)) return "intoxicants";
  if (/punishment|hadd|hudud|qisas|diya|theft|steal|sariqa|apostasy|ridda-punishment|tazir/.test(id)) return "punishments";
  return null;
};
const muamalat: ShelfSpec = {
  slug: "muamalat",
  tag: "muamalat-browser",
  sections: ["inheritance", "marriage", "transactions", "food", "intoxicants", "punishments", "fatwas", "sunnah", "curated"],
  pick: () => false,
  sectionOf: () => "curated",
};
const muamalatRule = (n: Node): string | null => {
  if (MUAMALAT_INHERITANCE.has(n.id)) return "inheritance";
  if (MUAMALAT_MARRIAGE.has(n.id)) return "marriage";
  if (MUAMALAT_TRANSACTIONS.has(n.id)) return "transactions";
  if (MUAMALAT_FOOD.has(n.id)) return "food";
  if (MUAMALAT_INTOXICANTS.has(n.id)) return "intoxicants";
  if (MUAMALAT_PUNISHMENTS.has(n.id)) return "punishments";
  if (MUAMALAT_SUNNAH.has(n.id)) return "sunnah";
  if (n.class === "work" && /^fatwa-/.test(n.slug ?? n.id.split("/")[1])) {
    return muamalatFatwaSection(n.id) ?? "fatwas";
  }
  return null;
};
muamalat.pick = specPick(muamalat, (n) => muamalatRule(n) !== null);
muamalat.sectionOf = (n) => muamalatRule(n) ?? tagSection(muamalat, n);


/* ————— دخول الإسلام — Dukhul al-Islam: those who entered and those who left ————— */
// The door both ways: the companions who came in — Hamza and Umar, Salman and Suhayb,
// Abdullah ibn Salam the rabbi, Tamim al-Dari, Thumama ibn Uthal — and the events that
// record their islam; the modern converts and reverts — Yusuf Islam, Malcolm X,
// Muhammad Ali, Pickthall, Martin Lings, Murad Hofmann, Hamza Yusuf, Abdal Hakim Murad;
// those who left — Ubaydullah ibn Jahsh, Abdullah ibn Sa'd, the apostate-prophets
// Musaylima, Sajah, Tulayha and al-Aswad, the Ridda wars and their modern ex-Muslims;
// the rulings of ridda and kufr and the shahada that makes the entry.
const DUKHUL_PERSONS = new Set([
  "person/salman-al-farisi", "person/suhayb-ibn-sinan", "person/abdullah-ibn-salam",
  "person/tamim-al-dari", "person/umar-ibn-al-khattab",
  "person/khalid-ibn-said-ibn-al-as",
]);
const DUKHUL_EVENTS = new Set([
  "event/islam-of-hamza", "event/islam-of-umar", "event/islam-of-ali",
  "event/islam-of-abu-dharr", "event/islam-of-adi-ibn-hatim",
  "event/islam-of-al-mundhir-ibn-sawa", "event/islam-of-rifaa-ibn-zayd-al-judhami",
  "event/abu-sufyan-conversion", "event/abu-quhafa-conversion",
  "event/conversion-of-umayr-ibn-wahb", "event/capture-and-islam-of-thumama-ibn-uthal",
  "event/offering-islam-to-the-tribes", "event/ghazan-islam-694",
  "event/tekuder-ahmad-islam-681", "event/daylam-islam-utrush-302",
  "event/kabul-islam-mamun", "event/alamut-islam-turn-608",
  "event/al-hadi-christian-slave-embraces-islam-and-is-freed",
  "event/al-hadi-protects-the-non-muslim-subjects-and-some-people-embrace-islam-through-his-gentleness-after-295",
]);
const DUKHUL_MODERN = new Set([
  "person/yusuf-islam", "person/malcolm-x", "person/muhammad-ali",
  "person/muhammad-marmaduke-pickthall", "person/martin-lings",
  "person/murad-wilfried-hofmann", "person/hamza-yusuf", "person/abdal-hakim-murad",
]);
const DUKHUL_LEAVERS = new Set([
  "person/ubaydullah-ibn-jahsh", "person/abdullah-ibn-sad-ibn-abi-sarh",
  "person/musaylima", "person/sajah", "person/tulayha-ibn-khuwaylid",
  "person/al-aswad-al-ansi", "person/ayaan-hirsi-ali",
  "event/ubaydullah-ibn-jahsh-leaves-islam-in-abyssinia",
  "event/musaylima-claims-prophethood", "event/musaylimas-letter-and-the-prophets-reply",
  "event/ali-judgment-on-apostates", "event/apostate-war-philippines",
  "event/alpujarras-conversion-revolt-904",
]);
const DUKHUL_RULINGS = new Set([
  "concept/ridda-fiqh", "concept/kufr", "concept/kufr-duna-kufr",
  "concept/abandoning-prayer-takfir", "concept/al-kufr-satr-al-haqq",
  "concept/hidaya", "concept/ada-al-shahada",
  "event/ridda-wars", "event/oman-campaign-of-the-ridda",
]);
const dukhul: ShelfSpec = {
  slug: "dukhul",
  tag: "dukhul-browser",
  sections: ["converts", "modern", "leavers", "rulings", "sunnah", "curated"],
  pick: () => false,
  sectionOf: () => "curated",
};
const dukhulRule = (n: Node): string | null => {
  if (DUKHUL_PERSONS.has(n.id)) return "converts";
  if (DUKHUL_EVENTS.has(n.id)) return "converts";
  if (DUKHUL_MODERN.has(n.id)) return "modern";
  if (DUKHUL_LEAVERS.has(n.id)) return "leavers";
  if (DUKHUL_RULINGS.has(n.id)) return "rulings";
  if (n.class === "event" && /(^|\/)conversion-of-|(^|\/)islam-of-|converts?-to-islam/.test(n.id)) return "converts";
  return null;
};
dukhul.pick = specPick(dukhul, (n) => dukhulRule(n) !== null);
dukhul.sectionOf = (n) => dukhulRule(n) ?? tagSection(dukhul, n);


/* ————— المعادن والأغنياء — Al-ma'adin wal-aghni'a: metals, money and the wealthy ————— */
// The counterpart of the masakin browser: gold and silver and what the law says of them,
// the money — dinars, dirhams, the sakk — the adornment of jewellery, the minerals dug
// from the earth, and the rich: the wealthy companions (Abd al-Rahman ibn Awf, Uthman,
// Talha, al-Zubayr, Sa'd), the magnates of history (Mansa Musa and the a'yan elites),
// and the morality stories — Qarun who was swallowed with his treasure, hoarding,
// miserliness and extravagance — plus the gold-and-silver fatwas and sunnah chapters.
const MAADIN_METALS = new Set([
  "concept/dhahab", "concept/fiddah", "concept/gold-silver", "concept/dhahab-ma-al-asnan",
  "concept/golden-calf", "concept/turab-al-maadin", "concept/lulu-fiqh",
  "concept/gold-leaf-glass-tesserae",
]);
const MAADIN_MONEY = new Set([
  "concept/al-nuqud", "concept/nuqud-fiqh", "concept/sakk", "concept/al-sakk-wal-hawala",
  "concept/dinariyya-kubra", "concept/dinariyya-sughra", "concept/kasad-al-nuqud",
  "concept/written-instrument-sakk", "concept/bayt-al-mal", "concept/dayn-allah",
]);
const MAADIN_ADORNMENT = new Set([
  "concept/hilya-jewelry", "concept/akik-cornelian",
  "object/bayt-al-dhahab", "object/dumluj-dhahab", "object/taj-amud-zahra",
  "object/tamthal-taj",
]);
const MAADIN_RICHES = new Set([
  "person/abd-al-rahman-ibn-awf", "person/uthman-ibn-affan", "person/talha-ibn-ubaydullah",
  "person/zubayr-ibn-al-awwam", "person/saad-ibn-abi-waqqas", "person/mansa-musa",
  "person/mansa-sulayman", "concept/qarun", "concept/qarunism", "concept/hirs",
  "concept/al-iktinaz-al-mal", "concept/al-bukhl", "concept/al-israf",
  "concept/al-mulk-wal-tamalluk", "concept/tarafhumas", "concept/asma-al-ghaniyy",
  "concept/asma-al-malik", "concept/akl-al-mal-bil-batil",
]);
const MAADIN_RULINGS = new Set([
  "concept/dhahab-fiqh", "concept/kanz-fiqh", "concept/qulimiya-al-dhahab",
  "concept/qulimiya-al-fidda", "concept/bay-al-nafs-wal-mal-ila-allah",
]);
const MAADIN_SUNNAH = new Set([
  "passage/muslim-kitab-33", "passage/bukhari-kitab-72",
]);
const maadin: ShelfSpec = {
  slug: "maadin",
  tag: "maadin-browser",
  sections: ["metals", "money", "adornment", "riches", "rulings", "fatwas", "sunnah", "curated"],
  pick: () => false,
  sectionOf: () => "curated",
};
const maadinRule = (n: Node): string | null => {
  if (MAADIN_METALS.has(n.id)) return "metals";
  if (MAADIN_MONEY.has(n.id)) return "money";
  if (MAADIN_ADORNMENT.has(n.id)) return "adornment";
  if (MAADIN_RICHES.has(n.id)) return "riches";
  if (MAADIN_RULINGS.has(n.id)) return "rulings";
  if (MAADIN_SUNNAH.has(n.id)) return "sunnah";
  if (n.class === "work" && /^fatwa-.*(gold|silver|jewel|dhahab|fidd|bullion|coin|money-metal|nisab)/.test(n.id)) return "fatwas";
  return null;
};
maadin.pick = specPick(maadin, (n) => maadinRule(n) !== null);
maadin.sectionOf = (n) => maadinRule(n) ?? tagSection(maadin, n);

export const SHELVES: Record<string, ShelfSpec> = {
  imara, collection, tasawwuf, kalam, nisa, uhud, maahid, mawt, ulum, funun, aayad, himam, zakat, itq, hukm, atfal, masakin, muamalat, dukhul, maadin,
};

export const SHELF_SLUGS = Object.keys(SHELVES);
