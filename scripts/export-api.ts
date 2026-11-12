// Writes the static JSON API (docs/plan/09 §6) to site/public/api/v1/ from the compiled graph.
//   /api/v1/<class>/<slug>.json   full entity     /api/v1/<class>/index.json   compact index
//   /api/v1/graph/nodes.ndjson, edges.ndjson      /api/v1/meta/coverage.json, meta/index.json
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Compiled, Node } from "./build-graph.js";
import { CLASSES, p } from "./lib.js";
import { buildRelated } from "./derive.js";
import { wingCounts } from "./wings.js";
import { primaryYear, recordOfNode, SECTION_IDS, sectionsOf, taxonomy as modernTaxonomy, yearsOf, WINDOW_START_YEAR } from "./modern/sections.js";
import { reachFormula, reachIndex, REACH_LISTS } from "./modern/reach.js";
import { companionIndex, decadeKey } from "./companions.js";
import { DREAM_TAG, dreamCorpusOf, dreamTagSection, isDreamPassage } from "./dreams.js";
import { madhahibMembers } from "./madhahib.js";
import { BAYT_TAG, baytCorpusOf, baytTagSection, isBaytPassage } from "./bayt.js";
import { MAGIC_TAG, magicCorpusOf, magicTagSection, magicTagTopics, isMagicPassage, magicTopicsOf } from "./magic.js";
import { ESCH_TAG, eschCorpusOf, eschTagSection, eschTagTopics, isEschatologyPassage, eschatologyTopicsOf } from "./eschatology.js";
import { MESSENGERS_TAG, MESSENGER_SECTIONS, MESSENGER_SUBJECTS, MESSENGER_SUBJECT_SET, messengerTopicsOf, messengerCorpusOf, messengerTagSection, type MessengerTopic } from "./messengers.js";
import { MIRACLES_TAG, MIRACLE_SECTIONS, MIRACLE_SUBJECTS, MIRACLE_SUBJECT_SET, MIRACLE_TOPIC_KIND, MIRACLE_TOPIC_SUBJECTS, miracleTopicsOf, miracleCorpusOf, miracleTagSection, type MiracleTopic } from "./miracles.js";
import { DUA_TAG, duaCorpusOf, duaKindOf, duaSignalsOf, duaTagSection, isDuaPassage, type DuaKind } from "./dua.js";
import { IBADAT_TAG, ibadatCorpusOf, ibadatKindOf, ibadatSignalsOf, ibadatTagSection, ibadatTopicsOf, isIbadatPassage, type IbadatKind } from "./ibadat.js";
import { NUBUWAT_TAG, nubuwatCorpusOf, nubuwatTagSection, nubuwatTagTopics, isNubuwatPassage, nubuwatTopicsOf } from "./nubuwat.js";
import { SAYYIAT_TAG, sayyiatCorpusOf, sayyiatKindOf, sayyiatSignalsOf, sayyiatTagSection, isSayyiatPassage, type SayyiatKind } from "./sayyiat.js";
import { HISAB_TAG, hisabCorpusOf, hisabKindsOf, hisabSignalsOf, isHisabPassage, reckoningOf } from "./hisab.js";
import { HASANAT_TAG, hasanatCorpusOf, hasanatKindOf, hasanatSignalsOf, hasanatTagSection, isHasanatPassage, type HasanatKind } from "./hasanat.js";
import { MUKATABAT_TAG, mukatabatCorpusOf, mukatabatKindOf, mukatabatSenderOf, mukatabatSignalsOf, mukatabatTagSection, mukatabatTagSender, isMukatabatPassage } from "./mukatabat.js";
import { NAR_TAG, narKindOf, narSectionOf, narSignalsOf, narTagSection, isNarPassage } from "./nar.js";
import { IE_TAG, ieCorpusOf, ieSignalsOf, ieTagSection, ieTagTopics, ieTopicsOf, isIslamicEconomyPassage } from "./islamic-economy.js";
import { isGhazwaNode, MUHAMMAD } from "./ghazwa.js";
import { PLACES_TAG, PLACE_CORPORA, placeCorpusOf, placeSectionOf, type PlaceCorpus } from "./places.js";
import { existsSync, readdirSync } from "node:fs";

const OUT = p("site", "public", "api", "v1");
const write = (rel: string, body: string) => {
  const f = `${OUT}/${rel}`;
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, body);
};

const compact = (n: Node) => ({
  id: n.id, class: n.class, label: n.label, summary: n.summary, wings: n.wings, regions: n.regions,
  born: n.data.born, died: n.data.died, date: n.data.date, start: n.data.start, end: n.data.end,
  coordinates: n.coordinates, wikidata: n.data.external_ids?.wikidata, status: n.data.status?.review,
});

import { readFileSync as rf } from "node:fs";
import { parse as yparse } from "yaml";
function themeIndex(c: Compiled) {
  const themes: any[] = yparse(rf(p("schema", "enums", "themes.yaml"), "utf8"));
  return themes.map((t) => ({ ...t, entries: c.nodes.filter((n) => !n.stub && n.themes.includes(t.id)).map((n) => n.id) }));
}

export function inventionApiData(c: Compiled) {
  const byId = new Map(c.nodes.map((node) => [node.id, node]));
  const inventions = c.nodes.filter((node) => !node.stub && node.class === "invention").sort((a, b) => a.id.localeCompare(b.id));
  const taxonomy = yparse(rf(p("docs", "inventions", "taxonomy.yaml"), "utf8"));
  const items = inventions.map((node) => {
    const data = node.data;
    const place = data.origin?.place ? byId.get(data.origin.place) : undefined;
    return {
      id: node.id, slug: node.slug, label: node.label, summary: node.summary, domain: data.domain, kind: data.kind,
      disciplines: data.disciplines, era: data.era, makers: data.makers, attribution: data.attribution,
      origin: { ...data.origin, coordinates: place?.coordinates }, spread: data.spread, precursors: data.precursors,
      dependents: data.dependents, described_in: data.described_in, examples: data.examples, sites: data.sites,
      concepts: data.concepts, today: data.today, media: data.media, significance: data.impact?.significance,
      status: data.status?.review,
    };
  });

  const chainNodes = new Map<string, Record<string, unknown>>();
  const chainEdges = new Map<string, Record<string, unknown>>();
  const addInventionNode = (id: string) => {
    const node = byId.get(id);
    if (!node || node.class !== "invention") return;
    chainNodes.set(id, {
      id, class: "invention", label: node.label, domain: node.data.domain, era: node.data.era?.origins,
      external: false, stub: node.stub || undefined,
    });
  };
  const addExternalNode = (label: Record<string, string>) => {
    const name = (label.en ?? label.ar).normalize("NFKC").trim().toLowerCase();
    const id = `external:${encodeURIComponent(name)}`;
    if (!chainNodes.has(id)) chainNodes.set(id, { id, class: "external", label, external: true });
    return id;
  };
  const addChainEdge = (from: string, to: string, item: Record<string, any>) => {
    const key = `${from}|${to}|built_on`;
    const previous = chainEdges.get(key) as { sources?: string[]; notes?: string[] } | undefined;
    const sources = [...new Set([...(previous?.sources ?? []), ...(item.sources ?? [])])].sort();
    const notes = [...new Set([...(previous?.notes ?? []), ...(item.note ? [item.note] : [])])].sort();
    chainEdges.set(key, { from, to, type: "built_on", derived: true, sources, ...(notes.length ? { notes } : {}) });
  };

  for (const node of inventions) {
    addInventionNode(node.id);
    for (const item of node.data.precursors ?? []) {
      const target = item.invention;
      if (target) {
        addInventionNode(target);
        addChainEdge(node.id, target, item);
      } else if (item.external) addChainEdge(node.id, addExternalNode(item.external), item);
    }
    for (const item of node.data.dependents ?? []) {
      const source = item.invention;
      if (source) {
        addInventionNode(source);
        addChainEdge(source, node.id, item);
      } else if (item.external) addChainEdge(addExternalNode(item.external), node.id, item);
    }
  }
  return {
    inventions: {
      generated: c.generated,
      filters: { domains: taxonomy.domains, eras: taxonomy.eras },
      items,
    },
    chains: {
      generated: c.generated,
      nodes: [...chainNodes.values()].sort((a, b) => String(a.id).localeCompare(String(b.id))),
      edges: [...chainEdges.values()].sort((a, b) => String(a.from).localeCompare(String(b.from)) || String(a.to).localeCompare(String(b.to))),
    },
  };
}

/**
 * Modern Islam Browser (docs/plan/26 section 4.1): one file per derived section, one per year, the reach indices and a
 * sections index. Built from the compiled graph; empty-capable until records exist. No runtime computation.
 */
export function modernApiData(c: Compiled) {
  const real = c.nodes.filter((n) => !n.stub);
  const records = real.map(recordOfNode);
  const awardsById = new Map(records.filter((r) => r.class === "award").map((r) => [r.id as string, r]));
  const byId = new Map(real.map((n) => [n.id, n]));
  const item = (id: string, sections: string[]) => {
    const n = byId.get(id)!;
    const d = n.data;
    return {
      ...compact(n), sections, kind: n.class === "screen" ? d.format : d.kind, year: primaryYear(recordOfNode(n)),
      countries: d.countries ?? (d.country ? [d.country] : undefined), languages: d.languages,
      honours: (d.honours ?? []).length || undefined, press: (d.footprint?.press ?? []).length || undefined,
      wikipedia_languages: d.footprint?.wikipedia?.languages?.length || undefined,
      horizon: d.horizon ? { stage: d.horizon.stage, expected: d.horizon.expected } : undefined,
      updated: n.updated,
    };
  };
  const sections: Record<string, ReturnType<typeof item>[]> = Object.fromEntries(SECTION_IDS.map((s) => [s, []]));
  const years = new Map<number, ReturnType<typeof item>[]>();
  const current = new Date(c.generated).getUTCFullYear();
  for (const r of records) {
    const s = sectionsOf(r, awardsById);
    if (!s.length) continue;
    const row = item(r.id as string, s);
    for (const section of s) sections[section].push(row);
    for (const y of yearsOf(r)) if (y >= WINDOW_START_YEAR && y <= current + 20) { if (!years.has(y)) years.set(y, []); years.get(y)!.push(row); }
  }
  const sortRows = (rows: ReturnType<typeof item>[]) => rows.sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || a.id.localeCompare(b.id));
  for (const rows of Object.values(sections)) sortRows(rows);
  for (const rows of years.values()) sortRows(rows);
  const top = Object.fromEntries(Object.keys(REACH_LISTS).map((list) => [list, reachIndex(list, records, awardsById)]));
  return {
    index: {
      generated: c.generated, window: { start: WINDOW_START_YEAR, end: current },
      sections: modernTaxonomy.sections.map((s) => ({ id: s.id, label: s.label, count: sections[s.id].length, facets: s.facets })),
      years: [...years.keys()].sort((a, b) => a - b).map((y) => ({ year: y, count: years.get(y)!.length })),
      lists: Object.fromEntries(Object.entries(top).map(([k, v]) => [k, v.length])),
    },
    sections, years, top,
  };
}

/**
 * One export per browser or explorer (AGENTS.md, "every feature is graph, API and search"; register docs/site/browsers.md):
 * the records the feature's pages show, with their compact row, the listed data fields and every edge from the record.
 * Static, built with the site; empty-capable.
 */
/**
 * Khulafa Browser (docs/plan/30): the caliphate chains. A caliph is a person whose story_roles carry a
 * reign (role: ruler or rival-claimant) toward one of the caliphate polities; each chain is ordered by reign start.
 */
export function khulafaChains(c: Compiled) {
  const CALIPHATES = ["polity/rashidun-caliphate", "polity/umayyad-caliphate", "polity/umayyads-of-cordoba",
    "polity/abbasid-caliphate", "polity/abbasid-caliphate-cairo", "polity/fatimid-caliphate", "polity/almohad-caliphate",
    "polity/ottoman-empire", "polity/sokoto-caliphate", "polity/zubayrid-caliphate", "polity/hammudid-caliphate", "polity/sharifian-caliphate"];
  const set = new Set(CALIPHATES);
  const chains: Record<string, { order: number; person: string; start?: string; end?: string; role: string }[]> = {};
  for (const n of c.nodes.filter((n) => !n.stub && n.class === "person")) {
    const r = ((n.data.story_roles ?? []) as any[]).find((x) => ["ruler", "rival-claimant"].includes(x.role) && set.has(x.toward));
    if (!r) continue;
    (chains[r.toward] ??= []).push({ order: 0, person: n.id, start: r.start?.edtf, end: r.end?.edtf, role: r.role });
  }
  for (const list of Object.values(chains)) {
    list.sort((a, b) => String(a.start ?? "").localeCompare(String(b.start ?? "")));
    list.forEach((x, i) => { x.order = i + 1; });
  }
  return { generated: c.generated, feature: "khulafa-browser", chains };
}

const FEATURE_EXPORTS: { file: string; feature: string; pick: (n: Node) => boolean; fields: string[]; extra?: (n: Node, edgesFrom: Map<string, { type: string; to: string }[]>, byId?: Map<string, Node>) => Record<string, unknown> }[] = [
  { file: "jobs.json", feature: "job-browser", pick: (n) => n.class === "job",
    fields: ["kind", "domain", "hirfa", "era", "broader", "regions", "organization", "training"] },
  { file: "qudsi.json", feature: "hadith-qudsi-browser", pick: (n) => n.class === "passage" && n.tags.includes("hadith-qudsi"),
    fields: ["work", "ref", "unit", "text"] },
  { file: "fatwa.json", feature: "fatwa-explorer", pick: (n) => n.class === "work" && ["fatwa", "fatwa-collection"].includes(n.data.kind),
    fields: ["kind", "publisher", "url", "languages", "language", "composed", "content_type", "ruler_at_time", "collection_type", "fiqh_area", "asker_role", "form"] },
  { file: "khutab.json", feature: "khutab-durus-explorer", pick: (n) => n.class === "work" && ["sermon", "lecture", "lecture-series"].includes(n.data.kind),
    fields: ["kind", "delivered", "host", "occasion", "audience", "order", "composed", "delivery_date_status", "book_studied", "sermon_type", "language", "genre", "duration"] },
  { file: "tafsir.json", feature: "tafsir-browser", pick: (n) => n.class === "work" && (n.data.kind === "tafsir-volume" || n.data.kind === "tafsir" || n.id === "work/jami-al-bayan"),
    fields: ["kind"] },
  { file: "poetry.json", feature: "poetry", pick: (n) => n.class === "work" && ["poem", "diwan"].includes(n.data.kind),
    fields: ["kind", "authors", "language", "languages", "genre", "metre", "composed"] },
  { file: "asma.json", feature: "asma-browser", pick: (n) => n.class === "concept" && n.data.kind === "divine-name",
    fields: ["kind", "order", "name_meta"] },
  { file: "battles.json", feature: "battles-browser", pick: (n) => n.class === "event" && ["battle", "siege", "conquest", "war", "campaign", "raid", "revolt", "civil-war", "skirmish", "naval-battle", "mutiny"].includes(n.data.kind),
    fields: ["kind", "sides", "outcome", "casualties", "significance", "map", "part_of"],
    extra: (n, ef) => ({ periods: n.periods, themes: n.themes,
      ghazwa: isGhazwaNode(n, (ef.get(n.id) ?? []).some((e) => e.type === "had_participant" && e.to === MUHAMMAD)) }) },
  { file: "khulafa.json", feature: "khulafa-browser", pick: (n) => n.class === "person" && (n.data.roles ?? []).includes("caliph"),
    fields: ["roles", "story_roles"] },
  { file: "ghayb.json", feature: "ghayb-browser", pick: (n) => n.tags.includes("ghayb-browser"),
    fields: ["kind", "wings", "themes", "tags"] },
  { file: "nature.json", feature: "nature-browser", pick: (n) => n.tags.includes("nature-browser"),
    fields: ["kind", "wings", "themes", "tags"] },
  { file: "angels.json", feature: "angels-browser", pick: (n) => n.tags.includes("angels-browser"),
    fields: ["kind", "wings", "themes", "tags"] },
  { file: "dreams.json", feature: "dream-browser",
    pick: (n) => n.tags.includes(DREAM_TAG) || isDreamPassage(n),
    fields: ["kind", "work", "ref", "unit", "text", "sura", "aya", "wings", "themes", "tags"],
    extra: (n, ef, byId) => ({
      section: n.class === "passage"
        ? dreamCorpusOf(n.data.work as string | undefined, byId?.get(n.data.work as string)?.data.genre as string[] | undefined, n.data.unit as string | undefined)
        : dreamTagSection(n),
    }) },
  { file: "duas.json", feature: "dua-browser",
    pick: (n) => n.tags.includes(DUA_TAG) || isDuaPassage(n),
    fields: ["kind", "work", "ref", "unit", "text", "sura", "aya", "wings", "themes", "tags"],
    extra: (n, ef, byId) => ({
      section: n.class === "passage"
        ? duaCorpusOf(n.data.work as string | undefined, byId?.get(n.data.work as string)?.data.genre as string[] | undefined, n.data.unit as string | undefined)
        : duaTagSection(n),
      dua_kind: n.class === "passage" ? duaKindOf(n) : null,
      signals: n.class === "passage" ? duaSignalsOf(n) : [],
    }) },
  { file: "ibadat.json", feature: "ibadat-browser",
    pick: (n) => n.tags.includes(IBADAT_TAG) || isIbadatPassage(n),
    fields: ["kind", "work", "ref", "unit", "text", "sura", "aya", "wings", "themes", "tags"],
    extra: (n, ef, byId) => ({
      section: n.class === "passage"
        ? ibadatCorpusOf(n.data.work as string | undefined, byId?.get(n.data.work as string)?.data.genre as string[] | undefined, n.data.unit as string | undefined)
        : ibadatTagSection(n),
      ibadat_kind: n.class === "passage" ? ibadatKindOf(n) : null,
      topics: n.class === "passage" ? ibadatTopicsOf(n) : [],
      signals: n.class === "passage" ? ibadatSignalsOf(n) : [],
    }) },
  { file: "nar.json", feature: "nar-browser",
    pick: (n) => n.tags.includes(NAR_TAG) || isNarPassage(n),
    fields: ["kind", "work", "ref", "unit", "text", "sura", "aya", "wings", "themes", "tags"],
    extra: (n, ef, byId) => ({
      section: n.class === "passage"
        ? narSectionOf(n, byId?.get(n.data.work as string)?.data.genre as string[] | undefined)
        : narTagSection(n),
      nar_kind: n.class === "passage" ? narKindOf(n) : null,
      signals: n.class === "passage" ? narSignalsOf(n) : [],
    }) },
  { file: "nubuwat.json", feature: "nubuwat-browser",
    pick: (n) => n.tags.includes(NUBUWAT_TAG) || isNubuwatPassage(n),
    fields: ["kind", "work", "ref", "unit", "text", "sura", "aya", "wings", "themes", "tags"],
    extra: (n, ef, byId) => ({
      section: n.class === "passage"
        ? nubuwatCorpusOf(n.data.work as string | undefined, byId?.get(n.data.work as string)?.data.genre as string[] | undefined, n.data.unit as string | undefined)
        : nubuwatTagSection(n),
      topics: n.class === "passage" ? nubuwatTopicsOf(n) : nubuwatTagTopics(n),
    }) },
  { file: "islamic-economy.json", feature: "islamic-economy-browser",
    pick: (n) => n.tags.includes(IE_TAG) || isIslamicEconomyPassage(n),
    fields: ["kind", "work", "ref", "unit", "text", "sura", "aya", "wings", "themes", "tags"],
    extra: (n, ef, byId) => ({
      section: n.class === "passage"
        ? ieCorpusOf(n.data.work as string | undefined, byId?.get(n.data.work as string)?.data.genre as string[] | undefined, n.data.unit as string | undefined)
        : ieTagSection(n),
      topics: n.class === "passage" ? ieTopicsOf(n) : ieTagTopics(n),
      signals: n.class === "passage" ? ieSignalsOf(n) : [],
    }) },
  { file: "hasanats.json", feature: "hasanat-browser",
    pick: (n) => n.tags.includes(HASANAT_TAG) || isHasanatPassage(n),
    fields: ["kind", "work", "ref", "unit", "text", "sura", "aya", "wings", "themes", "tags"],
    extra: (n, ef, byId) => ({
      section: n.class === "passage"
        ? hasanatCorpusOf(n.data.work as string | undefined, byId?.get(n.data.work as string)?.data.genre as string[] | undefined, n.data.unit as string | undefined)
        : hasanatTagSection(n),
      hasanat_kind: n.class === "passage" ? hasanatKindOf(n) : null,
      signals: n.class === "passage" ? hasanatSignalsOf(n) : [],
    }) },
  { file: "hisab.json", feature: "hisab-browser",
    pick: (n) => n.tags.includes(HISAB_TAG) || isHisabPassage(n),
    fields: ["kind", "work", "ref", "unit", "text", "sura", "aya", "wings", "themes", "tags"],
    extra: (n, ef, byId) => ({
      section: n.class === "passage"
        ? hisabCorpusOf(n.data.work as string | undefined, byId?.get(n.data.work as string)?.data.genre as string[] | undefined, n.data.unit as string | undefined)
        : "curated",
      hisab_kinds: n.class === "passage" ? hisabKindsOf(n) : reckoningOf(n) ? [reckoningOf(n)!.effect] : [],
      signals: n.class === "passage" ? hisabSignalsOf(n) : [],
      reckoning: reckoningOf(n),
    }) },
  { file: "magic.json", feature: "magic-browser",
    pick: (n) => n.tags.includes(MAGIC_TAG) || isMagicPassage(n),
    fields: ["kind", "work", "ref", "unit", "text", "sura", "aya", "wings", "themes", "tags"],
    extra: (n, ef, byId) => ({
      section: n.class === "passage"
        ? magicCorpusOf(n.data.work as string | undefined, byId?.get(n.data.work as string)?.data.genre as string[] | undefined, n.data.unit as string | undefined)
        : magicTagSection(n),
      topics: n.class === "passage" ? magicTopicsOf(n) : magicTagTopics(n),
    }) },
  { file: "jinn-devils.json", feature: "jinn-devils-browser",
    pick: (n) => n.tags.includes("jinn-devils-browser") || n.tags.includes("angels-browser"),
    fields: ["kind", "wings", "themes", "tags"] },
  { file: "eschatology.json", feature: "eschatology-browser",
    pick: (n) => n.tags.includes(ESCH_TAG) || isEschatologyPassage(n),
    fields: ["kind", "work", "ref", "unit", "text", "sura", "aya", "wings", "themes", "tags"],
    extra: (n, ef, byId) => ({
      section: n.class === "passage"
        ? eschCorpusOf(n.data.work as string | undefined, byId?.get(n.data.work as string)?.data.genre as string[] | undefined, n.data.unit as string | undefined)
        : eschTagSection(n),
      topics: n.class === "passage" ? eschatologyTopicsOf(n) : eschTagTopics(n),
    }) },
  { file: "bayt.json", feature: "bayt-browser",
    pick: (n) => n.tags.includes(BAYT_TAG) || isBaytPassage(n),
    fields: ["kind", "work", "ref", "unit", "text", "sura", "aya", "wings", "themes", "tags"],
    extra: (n, ef, byId) => ({
      section: n.class === "passage"
        ? baytCorpusOf(n.data.work as string | undefined, byId?.get(n.data.work as string)?.data.genre as string[] | undefined, n.data.unit as string | undefined)
        : baytTagSection(n),
    }) },
  { file: "sayyiat.json", feature: "sayyiat-browser",
    pick: (n) => n.tags.includes(SAYYIAT_TAG) || isSayyiatPassage(n),
    fields: ["kind", "work", "ref", "unit", "text", "sura", "aya", "wings", "themes", "tags"],
    extra: (n, ef, byId) => ({
      section: n.class === "passage"
        ? sayyiatCorpusOf(n.data.work as string | undefined, byId?.get(n.data.work as string)?.data.genre as string[] | undefined, n.data.unit as string | undefined)
        : sayyiatTagSection(n),
      sayyiat_kind: n.class === "passage" ? sayyiatKindOf(n) : null,
      signals: n.class === "passage" ? sayyiatSignalsOf(n) : [],
    }) },
  { file: "mukatabat.json", feature: "mukatabat-browser",
    pick: (n) => n.tags.includes(MUKATABAT_TAG) || isMukatabatPassage(n),
    fields: ["kind", "work", "ref", "unit", "text", "sura", "aya", "wings", "themes", "tags"],
    extra: (n, ef, byId) => ({
      section: n.class === "passage"
        ? mukatabatCorpusOf(n.data.work as string | undefined, byId?.get(n.data.work as string)?.data.genre as string[] | undefined, n.data.unit as string | undefined)
        : mukatabatTagSection(n),
      mukatabat_kind: n.class === "passage" ? mukatabatKindOf(n) : null,
      sender: n.class === "passage" ? mukatabatSenderOf(n) : mukatabatTagSender(n),
      signals: n.class === "passage" ? mukatabatSignalsOf(n) : [],
    }) },
  { file: "screens.json", feature: "screening-room", pick: (n) => n.class === "screen",
    fields: ["format", "relevance", "titles", "released", "first_broadcast", "ramadan_season", "countries", "languages", "seasons", "episodes", "runtime_min", "broadcaster", "approach", "depiction", "external_ids", "made", "honours"] },
];

export function featureApiData(c: Compiled): Record<string, { generated: string; feature: string; items: Record<string, unknown>[]; [key: string]: unknown }> {
  const real = c.nodes.filter((n) => !n.stub);
  const byId = new Map(c.nodes.map((n) => [n.id, n]));
  const edgesFrom = new Map<string, { type: string; to: string; inverse: boolean; role?: string }[]>();
  for (const e of c.edges) {
    const list = edgesFrom.get(e.from) ?? [];
    list.push({ type: e.type, to: e.to, inverse: e.inverse, ...(e.role ? { role: e.role } : {}) });
    edgesFrom.set(e.from, list);
  }
  const holders = new Map<string, string[]>();
  for (const person of real) {
    if (person.class !== "person") continue;
    for (const job of new Set<string>((person.data.occupations ?? []).map((o: any) => o.job))) {
      const list = holders.get(job) ?? [];
      list.push(person.id);
      holders.set(job, list);
    }
  }
  const out: Record<string, { generated: string; feature: string; items: Record<string, unknown>[]; [key: string]: unknown }> = {};
  for (const spec of FEATURE_EXPORTS) {
    const items = real.filter(spec.pick).sort((a, b) => a.id.localeCompare(b.id)).map((n) => {
      const picked = Object.fromEntries(spec.fields.filter((f) => n.data[f] !== undefined).map((f) => [f, n.data[f]]));
      const row: Record<string, unknown> = { ...compact(n), ...picked, connections: edgesFrom.get(n.id) ?? [], prose: Object.keys(n.prose ?? {}) };
      if (spec.extra) Object.assign(row, spec.extra(n, edgesFrom as any, byId));
      if (n.class === "job") row.holders = (holders.get(n.id) ?? []).sort();
      if (spec.file === "qudsi.json") Object.assign(row, { hadith: n.tags.find((t) => t.startsWith("qudsi-"))?.slice(6) ?? null, tags: n.tags, themes: n.themes });
      return row;
    });
    out[spec.file] = { generated: c.generated, feature: spec.feature, items };
  }
  out["companions.json"] = { generated: c.generated, feature: "companions-browser", items: companionRows(c, edgesFrom) };
  const msg = messengerApiData(c, edgesFrom, byId);
  out["messengers.json"] = { generated: c.generated, feature: "messengers-browser", subjects: msg.subjects, items: msg.items };
  const muj = miracleApiData(c, edgesFrom, byId);
  out["miracles.json"] = { generated: c.generated, feature: "miracles-browser", subjects: muj.subjects, items: muj.items };
  out["madhahib.json"] = { generated: c.generated, feature: "madhahib-browser", items: madhahibRows(c, edgesFrom) };
  out["places.json"] = { generated: c.generated, feature: "places-browser", items: placesRows(c, edgesFrom, byId) };
  return out;
}

const MADHABIB_FIELDS = ["kind", "wings", "themes", "tags", "traditions", "work", "ref", "unit"];

/** The Four Madhhabs Browser's rows (docs/plan/38): every member with its computed sections. */
function madhahibRows(c: Compiled, edgesFrom: Map<string, { type: string; to: string; inverse: boolean; role?: string }[]>): Record<string, unknown>[] {
  return madhahibMembers(c.nodes, c.edges).map((m) => {
    const n = m.node;
    const picked = Object.fromEntries(MADHABIB_FIELDS.filter((f) => n.data[f] !== undefined).map((f) => [f, n.data[f]]));
    return { ...compact(n), ...picked, sections: m.sections, connections: edgesFrom.get(n.id) ?? [], prose: Object.keys(n.prose ?? {}) };
  });
}

const PLACES_FIELDS = ["kind", "wings", "themes", "tags", "country", "regions", "coordinates", "external_ids"];

/**
 * The Sacred Places Browser's rows (docs/plan/49): every `place` and `building` record tagged
 * `places-browser`, plus every record a passage mentions (`mentioned_in` inverses on the place
 * side) — so a place named in a book harvested later enters the export automatically. Each row
 * carries its sanctity `section` and per-corpus `mentions` counts.
 */
function placesRows(c: Compiled, edgesFrom: Map<string, { type: string; to: string; inverse: boolean; role?: string }[]>, byId: Map<string, Node>): Record<string, unknown>[] {
  const rows: Record<string, unknown>[] = [];
  for (const n of c.nodes) {
    if (n.stub || (n.class !== "place" && n.class !== "building")) continue;
    const mentioners = (edgesFrom.get(n.id) ?? [])
      .filter((e) => e.type === "mentioned_in")
      .map((e) => byId.get(e.to))
      .filter((p): p is Node => !!p && !p.stub && p.class === "passage");
    if (!n.tags.includes(PLACES_TAG) && mentioners.length === 0) continue;
    const mentions: Record<PlaceCorpus, number> = { quran: 0, sunnah: 0, seerah: 0, books: 0 };
    for (const p of mentioners) {
      const w = p.data.work as string | undefined;
      mentions[placeCorpusOf(w, w ? (byId.get(w)?.data.genre as string[] | undefined) : undefined, p.data.unit as string | undefined)]++;
    }
    const picked = Object.fromEntries(PLACES_FIELDS.filter((f) => f !== "tags" && n.data[f] !== undefined).map((f) => [f, n.data[f]]));
    rows.push({ ...compact(n), ...picked, tags: n.tags, section: placeSectionOf(n), mentions, connections: edgesFrom.get(n.id) ?? [], prose: Object.keys(n.prose ?? {}) });
  }
  return rows.sort((a, b) => String(a.id).localeCompare(String(b.id)));
}

const COMPANION_FIELDS = ["gender", "roles", "born", "died", "kunya", "nisba"];

/** The Companions Browser's rows: each Companion record with its facets (docs/plan/29-companions-browser.md). */
function companionRows(c: Compiled, edgesFrom: Map<string, { type: string; to: string; inverse: boolean; role?: string }[]>): Record<string, unknown>[] {
  const idx = companionIndex(c.nodes, c.edges);
  const byId = new Map(c.nodes.map((n) => [n.id, n]));
  const ten = new Set(idx.ten);
  const groupsOf = new Map<string, string[]>();
  for (const m of [idx.circles, idx.clans]) for (const [g, ids] of m) for (const id of ids) groupsOf.set(id, [...(groupsOf.get(id) ?? []), g]);
  const eventsOf = new Map<string, string[]>();
  for (const [ev, xs] of idx.events) for (const x of xs) eventsOf.set(x.id, [...(eventsOf.get(x.id) ?? []), ev]);
  return [...idx.ids].sort().map((id) => {
    const n = byId.get(id)!;
    const picked = Object.fromEntries(COMPANION_FIELDS.filter((f) => n.data[f] !== undefined).map((f) => [f, n.data[f]]));
    const death = idx.death.get(id);
    return {
      ...compact(n), ...picked,
      ten: ten.has(id),
      groups: (groupsOf.get(id) ?? []).sort(),
      events: (eventsOf.get(id) ?? []).sort(),
      ...(death ? { death_ah: death.year, death_ah_derived: death.derived, death_decade: decadeKey(death.year) } : {}),
      connections: edgesFrom.get(id) ?? [],
      prose: Object.keys(n.prose ?? {}),
    };
  });
}

/** The Messengers Browser's API rows: detected/class-edge passages plus curated records, and the subject index (docs/plan/41-messengers-browser.md). */
function messengerApiData(c: Compiled, edgesFrom: Map<string, { type: string; to: string; inverse: boolean; role?: string }[]>, byId: Map<string, Node>) {
  const real = c.nodes.filter((n) => !n.stub);
  const edgeSubjects = new Map<string, Set<string>>();
  for (const e of c.edges) {
    if (e.type !== "mentions" || !e.from.startsWith("passage/") || !MESSENGER_SUBJECT_SET.has(e.to)) continue;
    const set = edgeSubjects.get(e.from) ?? new Set<string>();
    set.add(e.to);
    edgeSubjects.set(e.from, set);
  }
  const genreOf = (workId: string | undefined): string[] | undefined =>
    workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;
  const isGeneric = (t: MessengerTopic) => !t.startsWith("person/");
  const items: Record<string, unknown>[] = [];
  const subjectPassages = new Map<string, { id: string; section: string }[]>();
  for (const n of real) {
    if (n.class === "passage") {
      const detected = messengerTopicsOf(n);
      const detectedSubjects = detected.filter((t): t is Extract<MessengerTopic, `person/${string}`> => t.startsWith("person/"));
      const generic = detected.filter(isGeneric);
      const edges = edgeSubjects.get(n.id) ?? new Set<string>();
      const edgeNonMuhammad = [...edges].filter((s) => s !== "person/muhammad");
      const include =
        detected.length > 0 ||
        edgeNonMuhammad.length > 0 ||
        (edges.has("person/muhammad") && (generic.length > 0 || detectedSubjects.includes("person/muhammad")));
      if (!include) continue;
      const section = messengerCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined);
      const subjects = [...new Set([...detectedSubjects, ...edges])];
      const topics = [...new Set([...detectedSubjects, ...edgeNonMuhammad, ...generic])];
      const picked = Object.fromEntries(["kind", "work", "ref", "unit", "text", "sura", "aya", "wings", "themes", "tags"].filter((f) => n.data[f] !== undefined).map((f) => [f, n.data[f]]));
      items.push({ ...compact(n), ...picked, section, subjects, topics, connections: edgesFrom.get(n.id) ?? [], prose: Object.keys(n.prose ?? {}) });
      for (const s of subjects) {
        if (!MESSENGER_SUBJECT_SET.has(s)) continue;
        const list = subjectPassages.get(s) ?? [];
        list.push({ id: n.id, section });
        subjectPassages.set(s, list);
      }
      continue;
    }
    if (n.tags.includes(MESSENGERS_TAG)) {
      items.push({
        ...compact(n), kind: n.data.kind, wings: n.wings, themes: n.themes, tags: n.tags,
        section: messengerTagSection(n), subjects: [], topics: [], connections: edgesFrom.get(n.id) ?? [], prose: Object.keys(n.prose ?? {}),
      });
    }
  }
  const sectionRank = (s: unknown) => (MESSENGER_SECTIONS as readonly string[]).indexOf(String(s));
  items.sort((a, b) => sectionRank(a.section) - sectionRank(b.section) || String(a.id).localeCompare(String(b.id)));
  const subjects = MESSENGER_SUBJECTS.map((id) => {
    const node = byId.get(id);
    if (!node || node.stub) return null;
    const passages = (subjectPassages.get(id) ?? []).sort((a, b) => sectionRank(a.section) - sectionRank(b.section) || a.id.localeCompare(b.id));
    const counts = { quran: 0, sunnah: 0, seerah: 0, books: 0 };
    for (const p of passages) if (p.section in counts) counts[p.section as keyof typeof counts]++;
    return { id, label: node.label, summary: node.summary, status: node.data.status?.review, counts, passages: passages.map((p) => p.id) };
  }).filter((x): x is NonNullable<typeof x> => !!x);
  return { items, subjects };
}

export function decisionsApiData() {
  const dir = p("docs", "decisions", "records");
  const records = existsSync(dir)
    ? readdirSync(dir).filter((f) => f.endsWith(".yaml")).sort()
        .map((f) => yparse(rf(join(dir, f), "utf8")))
    : [];
  const precFile = p("docs", "decisions", "precedents.yaml");
  const precedents = existsSync(precFile)
    ? ((yparse(rf(precFile, "utf8")) as { precedents?: unknown[] })?.precedents?.length ?? 0)
    : 0;
  // Deterministic stamp: the newest record's date, so the file only changes when the ledger does.
  const newest = records.reduce<string>((a, r) => {
    const d = String((r as { date?: string }).date ?? "");
    return d > a ? d : a;
  }, "");
  return { generated: newest || null, feature: "decision-ledger-poc", precedent_count: precedents, records };
}

export function exportApi(c: Compiled) {
  rmSync(OUT, { recursive: true, force: true });
  const real = c.nodes.filter((n) => !n.stub);
  const related = buildRelated(c);
  for (const cls of CLASSES) {
    const items = real.filter((n) => n.class === cls);
    if (!items.length && cls !== "invention" && cls !== "award") continue;
    write(`${cls}/index.json`, JSON.stringify(items.map(compact), null, 1));
    for (const n of items) {
      const connections = c.edges.filter((e) => e.from === n.id).map(({ from, ...e }) => e);
      write(`${cls}/${n.slug}.json`, JSON.stringify({ ...n, connections, related: related[n.id] ?? [], license: { prose: "CC BY-SA 4.0", data: "CC0 1.0" } }, null, 1));
    }
  }
  // Stubs get entity pages and a /api/v1/<class>/<slug>.json link (EntityLayout),
  // so each stub needs a minimal export too or the internal link check 404s.
  for (const n of c.nodes.filter((n) => n.stub)) {
    const slug = n.slug ?? n.id.split("/")[1];
    const connections = c.edges.filter((e) => e.from === n.id).map(({ from, ...e }) => e);
    write(`${n.class}/${slug}.json`, JSON.stringify({ ...n, slug, connections, related: [], license: { prose: "CC BY-SA 4.0", data: "CC0 1.0" } }, null, 1));
  }
  // Constellation neighbourhoods (docs/plan/21 §C.5): /api/v1/graph/<class>/<slug>.json, two hops, at most 40 nodes, one node per id.
  exportNeighbourhoods(c, real);
  write("graph/nodes.ndjson", c.nodes.map((n) => JSON.stringify(compact(n))).join("\n") + "\n");
  write("graph/edges.ndjson", c.edges.filter((e) => !e.inverse).map((e) => JSON.stringify(e)).join("\n") + "\n");
  write("themes/index.json", JSON.stringify(themeIndex(c), null, 1));
  write("meta/coverage.json", JSON.stringify({ generated: c.generated, ...c.coverage }, null, 1));
  // Site-wide totals that every page's header shows (docs/site/README.md, "site-wide numbers"): one small file, fetched by a
  // few lines of client script, so the numbers are never baked into the 100k+ static pages and a content commit leaves them untouched.
  // No `generated` field: the file changes only when a count does.
  write("meta/counts.json", JSON.stringify({ wings: wingCounts(real), entities: real.length }));
  const inventionData = inventionApiData(c);
  write("inventions.json", JSON.stringify(inventionData.inventions, null, 1));
  write("inventions/chains.json", JSON.stringify(inventionData.chains, null, 1));
  // Decision ledger (POC, docs/decisions/): the auditable records emitted by
  // scripts/decisions/decide.ts, exported so the ledger is API-readable like every feature.
  write("decisions.json", JSON.stringify(decisionsApiData(), null, 1));
  const modern = modernApiData(c);
  write("modern/index.json", JSON.stringify(modern.index, null, 1));
  for (const [section, items] of Object.entries(modern.sections)) {
    const label = modernTaxonomy.sections.find((s) => s.id === section)?.label;
    write(`modern/${section}.json`, JSON.stringify({ generated: c.generated, section, label, items }, null, 1));
  }
  for (const [year, items] of modern.years) write(`modern/year/${year}.json`, JSON.stringify({ generated: c.generated, year, items }, null, 1));
  for (const [list, items] of Object.entries(modern.top)) {
    write(`modern/top/${list}.json`, JSON.stringify({ generated: c.generated, list, formula: reachFormula(), items }, null, 1));
  }
  for (const [file, body] of Object.entries(featureApiData(c))) write(file, JSON.stringify(body, null, 1));
  // Khulafa Browser (docs/plan/30): the ordered succession chains per caliphate, computed from story_roles reigns.
  write("khulafa/chains.json", JSON.stringify(khulafaChains(c), null, 1));
  // The Time Browser's subject index (scripts/time-browser-explorer.ts runs in prebuild and writes .cache/time-browser/).
  const timeBrowserIndex = p(".cache", "time-browser", "explorer-index.json");
  if (existsSync(timeBrowserIndex)) {
    write("time-browser/index.json", JSON.stringify({ generated: c.generated, feature: "time-browser", subjects: JSON.parse(readFileSync(timeBrowserIndex, "utf8")) }, null, 1));
  }
  write("meta/index.json", JSON.stringify({
    version: "v1", generated: c.generated, classes: CLASSES.filter((k) => k === "invention" || k === "award" || real.some((n) => n.class === k)),
    docs: "https://github.com/amado2k5/islam-museum/blob/main/docs/plan/09-ai-content-pipeline.md",
    license: { prose: "CC BY-SA 4.0", data: "CC0 1.0" },
  }, null, 1));
  return real.length;
}

const shortText = (s: string | undefined, n = 120) => (s && s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s ?? "");

/**
 * The one definition of "connected" for the graph endpoint: an entity with at least one typed relation, i.e. a forward
 * edge (schema/predicates.yaml) between two nodes of the graph, in either direction. Every connected entity gets
 * /api/v1/graph/<class>/<slug>.json; an entity without one has no neighbourhood to draw and no file.
 *
 * This is not the record's `related` list (scripts/derive.ts buildRelated): that is a "see also" recommendation, scored
 * from typed neighbours and shared themes, and it leaves out ayah passages, sources and media. An entity can therefore
 * have `related` entries from its themes alone and no graph file, or a graph file (an ayah's part_of edge) and `related: []`.
 */
export function connectedIds(c: Compiled): Set<string> {
  const known = new Set(c.nodes.map((n) => n.id));
  const out = new Set<string>();
  for (const e of c.edges) {
    if (e.inverse || !known.has(e.from) || !known.has(e.to)) continue;
    out.add(e.from); out.add(e.to);
  }
  return out;
}

export type Neighbourhood = { centre: string; nodes: { id: string; c: string; l: any; s?: { ar: string; en: string }; hop: number }[]; edges: { s: string; t: string; r: string }[] };

/** Two-hop neighbourhood per connected entity: the centre, its strongest neighbours, then theirs, capped at 40 nodes; forward edges among them. */
export function buildNeighbourhoods(c: Compiled, real: Node[]): Map<Node, Neighbourhood> {
  const byId = new Map(c.nodes.map((n) => [n.id, n]));
  const adj = new Map<string, { to: string; type: string }[]>();
  for (const e of c.edges) {
    if (e.inverse || !byId.has(e.from) || !byId.has(e.to)) continue;
    (adj.get(e.from) ?? adj.set(e.from, []).get(e.from)!).push({ to: e.to, type: e.type });
    (adj.get(e.to) ?? adj.set(e.to, []).get(e.to)!).push({ to: e.from, type: e.type });
  }
  const CAP = 40, HOP1 = 22;
  // passages crowd a neighbourhood; they come after everything else, and the best-connected neighbours first
  const rank = (id: string) => (byId.get(id)!.class === "passage" ? -1e6 : 0) + (byId.get(id)?.degree ?? 0);
  const pick = (ids: Set<string>, exclude: Set<string>, n: number) => [...ids].filter((i) => !exclude.has(i)).sort((a, b) => rank(b) - rank(a)).slice(0, n);
  const out = new Map<Node, Neighbourhood>();
  for (const n of real) {
    const first = adj.get(n.id);
    if (!first?.length) continue;
    const keep = new Set<string>([n.id]);
    const hop1 = pick(new Set(first.map((x) => x.to)), keep, HOP1);
    hop1.forEach((i) => keep.add(i));
    const cand = new Set<string>();
    for (const h of hop1) for (const x of adj.get(h) ?? []) if (!keep.has(x.to)) cand.add(x.to);
    pick(cand, keep, CAP - keep.size).forEach((i) => keep.add(i));
    const hopOf = (id: string) => (id === n.id ? 0 : hop1.includes(id) ? 1 : 2);
    // summaries only where the card shows them (centre and first hop), kept short
    const nodes = [...keep].map((id) => { const m = byId.get(id)!; const hop = hopOf(id); return { id, c: m.class, l: m.label, s: hop < 2 ? { ar: shortText(m.summary?.ar, 90), en: shortText(m.summary?.en, 90) } : undefined, hop }; });
    const seen = new Set<string>();
    for (const x of nodes) { if (seen.has(x.id)) throw new Error(`graph neighbourhood for ${n.id}: duplicate node ${x.id}`); seen.add(x.id); }
    const edges: { s: string; t: string; r: string }[] = [];
    const eseen = new Set<string>();
    for (const e of c.edges) {
      if (e.inverse || !keep.has(e.from) || !keep.has(e.to)) continue;
      // edges that the drawing uses: centre-first hop, first-first, first-second (second-second edges only clutter)
      if (hopOf(e.from) === 2 && hopOf(e.to) === 2) continue;
      const k = `${e.from}|${e.to}|${e.type}`;
      if (eseen.has(k)) continue;
      eseen.add(k); edges.push({ s: e.from, t: e.to, r: e.type });
    }
    out.set(n, { centre: n.id, nodes, edges });
  }
  return out;
}

/** Connected entities without a neighbourhood: the build fails on any (scripts/graph-endpoint.test.ts checks the same). */
export function missingNeighbourhoods(c: Compiled, real: Node[], hoods: Map<Node, Neighbourhood>): string[] {
  const connected = connectedIds(c);
  const have = new Set([...hoods.keys()].map((n) => n.id));
  return real.filter((n) => connected.has(n.id) && !have.has(n.id)).map((n) => n.id);
}

export function exportNeighbourhoods(c: Compiled, real: Node[]) {
  const hoods = buildNeighbourhoods(c, real);
  const missing = missingNeighbourhoods(c, real, hoods);
  if (missing.length) throw new Error(`graph endpoint: ${missing.length} connected entities have no neighbourhood, e.g. ${missing.slice(0, 5).join(", ")}`);
  for (const [n, hood] of hoods) write(`graph/${n.class}/${n.slug}.json`, JSON.stringify(hood));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const c: Compiled = JSON.parse(readFileSync(p(".cache", "graph.json"), "utf8"));
  console.log(`api: ${exportApi(c)} entities -> site/public/api/v1/`);
}

/** The Miracles Browser's API rows: detected/class-edge passages plus curated records, and the subject index (docs/plan/44-miracles-browser.md). */
function miracleApiData(c: Compiled, edgesFrom: Map<string, { type: string; to: string; inverse: boolean; role?: string }[]>, byId: Map<string, Node>) {
  const real = c.nodes.filter((n) => !n.stub);
  const edgeSubjects = new Map<string, Set<string>>();
  for (const e of c.edges) {
    if (e.type !== "mentions" || !e.from.startsWith("passage/") || e.to === "person/muhammad" || !MIRACLE_SUBJECT_SET.has(e.to)) continue;
    const set = edgeSubjects.get(e.from) ?? new Set<string>();
    set.add(e.to);
    edgeSubjects.set(e.from, set);
  }
  const genreOf = (workId: string | undefined): string[] | undefined =>
    workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;
  const items: Record<string, unknown>[] = [];
  const subjectPassages = new Map<string, { id: string; section: string }[]>();
  for (const n of real) {
    if (n.class === "passage") {
      const corpus = miracleCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined);
      const detected = miracleTopicsOf(n, corpus);
      const edges = edgeSubjects.get(n.id) ?? new Set<string>();
      if (detected.length === 0 && edges.size === 0) continue;
      const subjects = [...new Set([...detected.flatMap((t) => MIRACLE_TOPIC_SUBJECTS[t] ?? []), ...edges])];
      const kinds = detected.map((t) => MIRACLE_TOPIC_KIND[t]);
      const kind = kinds.includes("event") ? "event" : kinds.includes("sign") ? "sign" : "mention";
      const picked = Object.fromEntries(["kind", "work", "ref", "unit", "text", "sura", "aya", "wings", "themes", "tags"].filter((f) => n.data[f] !== undefined).map((f) => [f, n.data[f]]));
      items.push({ ...compact(n), ...picked, section: corpus, kind, subjects, topics: detected, connections: edgesFrom.get(n.id) ?? [], prose: Object.keys(n.prose ?? {}) });
      for (const s of subjects) {
        if (!MIRACLE_SUBJECT_SET.has(s)) continue;
        const list = subjectPassages.get(s) ?? [];
        list.push({ id: n.id, section: corpus });
        subjectPassages.set(s, list);
      }
      continue;
    }
    if (n.tags.includes(MIRACLES_TAG)) {
      items.push({
        ...compact(n), kind: n.data.kind, wings: n.wings, themes: n.themes, tags: n.tags,
        section: miracleTagSection(n), subjects: [], topics: [], kind2: undefined, connections: edgesFrom.get(n.id) ?? [], prose: Object.keys(n.prose ?? {}),
      });
    }
  }
  const sectionRank = (s: unknown) => (MIRACLE_SECTIONS as readonly string[]).indexOf(String(s));
  items.sort((a, b) => sectionRank(a.section) - sectionRank(b.section) || String(a.id).localeCompare(String(b.id)));
  const subjects = MIRACLE_SUBJECTS.map((id) => {
    const node = byId.get(id);
    if (!node || node.stub) return null;
    const passages = (subjectPassages.get(id) ?? []).sort((a, b) => sectionRank(a.section) - sectionRank(b.section) || a.id.localeCompare(b.id));
    const counts = { quran: 0, sunnah: 0, seerah: 0, books: 0 };
    for (const p of passages) if (p.section in counts) counts[p.section as keyof typeof counts]++;
    return { id, label: node.label, summary: node.summary, status: node.data.status?.review, counts, passages: passages.map((p) => p.id) };
  }).filter((x): x is NonNullable<typeof x> => !!x);
  return { items, subjects };
}
