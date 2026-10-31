// Derives view-ready artifacts from the compiled graph: timeline rows, map features (GeoJSON),
// ego graphs, snapshot-year indexes and on-this-day indexes → .cache/derived/*.json
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Compiled, Node } from "./build-graph.js";
import { p, readYaml } from "./lib.js";

const sorted = <T>(a: T[], f: (t: T) => number) => [...a].sort((x, y) => f(x) - f(y));


// ---------- build-time search aids (docs/plan/03 §13: no runtime AI or compute) ----------
// One normaliser for build and browser (the search page carries a copy): strips Arabic diacritics and tatweel, folds hamza/alef, ta marbuta and
// alef maqsura forms, removes Latin diacritics and apostrophes, turns hyphens into spaces.
const norm = (s: string) =>
  s.normalize("NFKD").replace(/[̀-ًͯ-ٰٟـ]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/ؤ/g, "و").replace(/ئ/g, "ي")
    .toLowerCase().replace(/['’‘`ʿʾ]/g, "").replace(/[-_()/,.]/g, " ").replace(/\s+/g, " ").trim();

/** Variant spellings -> canonical labels, from labels, names[], aliases and the rules in scripts/search-variants.yaml. Built per language: an English query expands toward English labels. */
export function buildSynonyms(c: Compiled, lang: "ar" | "en" = "ar") {
  const rules = readYaml<{ swap: [string, string][]; drop_prefix: string[] }>(p("scripts", "search-variants.yaml"));
  const out = new Map<string, Set<string>>();
  const add = (variant: string, canonical: string) => {
    const v = norm(variant);
    if (v.length < 3 || v === canonical) return;     // identical to the label: nothing to expand (spelling variants differ after normalising)
    (out.get(v) ?? out.set(v, new Set()).get(v)!).add(canonical);
  };
  for (const n of c.nodes.filter((x) => !x.stub && !(x.class === "passage" && x.data.unit === "ayah") && x.class !== "source")) {
    const canonical = n.label[lang] ?? n.label.en ?? n.label.ar;   // the search page expands toward the visitor's language
    if (!canonical) continue;
    const forms = new Set<string>([canonical, ...Object.values(n.label), ...(n.data.names ?? []).map((x: any) => x.value), ...n.aliases.map((a) => a.split("/")[1].replace(/-/g, " "))]);
    for (const form of forms) {
      const full = norm(form);
      add(form, canonical);                                              // names and aliases find the canonical label
      const bases = new Set([full]);
      for (const pre of rules.drop_prefix) if (full.startsWith(pre + " ")) bases.add(full.slice(pre.length + 1));
      for (const base of bases) {
        add(base, canonical);
        for (const [from, to] of rules.swap) {
          if (base.includes(from)) add(base.replace(from, to), canonical);
          if (base.includes(to)) add(base.replace(to, from), canonical);
        }
      }
    }
  }
  // Homework topics (plan §5 E3 step 7): school phrasings ("… واجب", "… homework", "… for kids") resolve
  // to their target's canonical label, so a pupil's homework query lands on the right record or pathway.
  const topicNodes = new Map(c.nodes.map((n) => [n.id, n]));
  const topics = readYaml<{ topics: { id: string; target: string; phrasings?: Record<string, string[]> }[] }>(p("edu", "homework-topics.yaml"));
  for (const t of topics.topics ?? []) {
    const n = topicNodes.get(t.target);
    const canonical = n && (n.label[lang] ?? n.label.en ?? n.label.ar);
    if (!canonical) continue;
    for (const ph of t.phrasings?.[lang] ?? []) add(ph, canonical);
  }
  // Topical phrasings (animals, insects, sports, games): scripts/search-terms.yaml maps what a visitor types to one record. Urdu goes into the Arabic map, which the search page loads for every non-English language.
  const terms = readYaml<{ terms: { target: string; phrasings?: Record<string, string[]> }[] }>(p("scripts", "search-terms.yaml"));
  const termLangs = lang === "ar" ? ["ar", "ur"] : ["en"];
  for (const t of terms.terms ?? []) {
    const n = topicNodes.get(t.target);
    const canonical = n && (n.label[lang] ?? n.label.en ?? n.label.ar);
    if (!canonical) continue;
    for (const l of termLangs) for (const ph of t.phrasings?.[l] ?? []) add(ph, canonical);
  }
  // Per-word spellings: each Arabic word that appears in a label is keyed by its normalised form, so "مكه" finds "مكة" and "الاسلام" finds "الإسلام".
  const words = new Map<string, Map<string, number>>();
  for (const n of c.nodes.filter((x) => !x.stub && !(x.class === "passage" && x.data.unit === "ayah"))) {
    for (const w of (n.label[lang] ?? "").split(/[\s،()]+/)) {
      const k = norm(w);
      if (k.length < 2 || k === w) continue;
      const m = words.get(k) ?? words.set(k, new Map()).get(k)!;
      m.set(w, (m.get(w) ?? 0) + 1);
    }
  }
  const wordMap = Object.fromEntries([...words].map(([k, m]) => [k, [...m].sort((a, b) => b[1] - a[1])[0][0]]));
  return { whole: Object.fromEntries([...out].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, [...v].slice(0, 3)])), words: wordMap };
}

/** "People also explored": shared neighbours (weight 3) and shared themes (weight 1), plus the same period, computed once at build time. */
export function buildRelated(c: Compiled, perNode = 8) {
  const skip = (n: Node) => n.stub || n.class === "source" || n.class === "media" || (n.class === "passage" && n.data.unit === "ayah");
  const nodes = c.nodes.filter((n) => !skip(n));
  const ids = new Set(nodes.map((n) => n.id));
  const nbr = new Map<string, Set<string>>();
  for (const e of c.edges) {
    if (e.inverse || !ids.has(e.from) || !ids.has(e.to)) continue;
    (nbr.get(e.from) ?? nbr.set(e.from, new Set()).get(e.from)!).add(e.to);
    (nbr.get(e.to) ?? nbr.set(e.to, new Set()).get(e.to)!).add(e.from);
  }
  // Theme candidates: a big theme is capped at its 200 best-connected members (degree, then id), not its first 200 in file
  // order, so that adding an entity only changes the lists it genuinely enters; file order would shift every list behind it.
  const byTheme = new Map<string, string[]>();
  for (const n of nodes) for (const t of n.themes) (byTheme.get(t) ?? byTheme.set(t, []).get(t)!).push(n.id);
  const degree = new Map(nodes.map((n) => [n.id, n.degree]));
  for (const [t, ids] of byTheme) byTheme.set(t, ids.sort((a, b) => (degree.get(b) ?? 0) - (degree.get(a) ?? 0) || a.localeCompare(b)).slice(0, 200));
  const related: Record<string, string[]> = {};
  for (const n of nodes) {
    const score = new Map<string, number>();
    const bump = (id: string, w: number) => { if (id !== n.id && ids.has(id)) score.set(id, (score.get(id) ?? 0) + w); };
    for (const m of nbr.get(n.id) ?? []) {
      bump(m, 2);                                            // direct neighbours
      for (const k of nbr.get(m) ?? []) bump(k, 3);          // shares a neighbour
    }
    for (const t of n.themes) for (const k of byTheme.get(t) ?? []) bump(k, 1);
    const top = [...score].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, perNode).map(([id]) => id);
    if (top.length) related[n.id] = top;
  }
  return related;
}

export function derive(c: Compiled) {
  const real = c.nodes.filter((n) => !n.stub);
  const byId = new Map(c.nodes.map((n) => [n.id, n]));

  const timeline = sorted(real.filter((n) => n.span), (n) => n.span!.earliest).map((n) => ({
    id: n.id, class: n.class, label: n.label, earliest: +n.span!.earliest.toFixed(3), latest: +n.span!.latest.toFixed(3), wings: n.wings,
  }));

  const features = real.filter((n) => n.coordinates).map((n) => ({
    type: "Feature", id: n.id,
    geometry: { type: "Point", coordinates: [n.coordinates![1], n.coordinates![0]] }, // GeoJSON is [lon, lat]
    properties: { id: n.id, class: n.class, label: n.label, summary: n.summary, kind: n.data.kind },
  }));
  const map = { type: "FeatureCollection", features };

  const ego: Record<string, { nodes: any[]; edges: any[] }> = {};
  for (const n of real.filter((x) => x.class === "person")) {
    const edges = c.edges.filter((e) => !e.inverse && (e.from === n.id || e.to === n.id));
    const ids = new Set<string>([n.id, ...edges.flatMap((e) => [e.from, e.to])]);
    ego[n.id] = {
      nodes: [...ids].map((i) => { const m = byId.get(i)!; return { id: i, class: m.class, label: m.label, stub: m.stub }; }),
      edges: edges.map((e) => ({ from: e.from, to: e.to, type: e.type })),
    };
  }

  // snapshot years every 25 years: entities whose span covers the year
  const snapshots: Record<number, string[]> = {};
  for (let y = 600; y <= 2000; y += 25) {
    snapshots[y] = real.filter((n) => n.span && n.span.earliest <= y + 1 && n.span.latest >= y).map((n) => n.id);
  }

  // on this day: entities with a day-precision date, keyed by MM-DD (Gregorian/Julian as written) and by Hijri MM-DD
  const onThisDay: Record<string, { id: string; which: string; year?: number }[]> = {};
  const hijriDay: Record<string, { id: string; which: string; year?: number }[]> = {};
  const visit = (n: Node, which: string, d: any) => {
    if (!d) return;
    const g = d.edtf?.match(/^(-?\d{4})-(\d{2})-(\d{2})$/);
    if (g) (onThisDay[`${g[2]}-${g[3]}`] ??= []).push({ id: n.id, which, year: Number(g[1]) });
    const h = d.hijri?.match(/^(-?\d{4})-(\d{2})-(\d{2})$/);
    if (h) (hijriDay[`${h[2]}-${h[3]}`] ??= []).push({ id: n.id, which, year: Number(h[1]) });
  };
  for (const n of real) {
    visit(n, "born", n.data.born); visit(n, "died", n.data.died);
    visit(n, "start", n.data.date?.start); visit(n, "end", n.data.date?.end);
  }

  return { timeline, map, ego, snapshots, onThisDay: { gregorian: onThisDay, hijri: hijriDay }, related: buildRelated(c), synonyms: { ar: buildSynonyms(c, "ar"), en: buildSynonyms(c, "en") } };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const c: Compiled = JSON.parse(readFileSync(p(".cache", "graph.json"), "utf8"));
  const d = derive(c);
  mkdirSync(p(".cache", "derived"), { recursive: true });
  for (const [k, v] of Object.entries(d)) writeFileSync(p(".cache", "derived", `${k}.json`), JSON.stringify(v));
  mkdirSync(p("site", "public"), { recursive: true });
  for (const lang of ["ar", "en"] as const) writeFileSync(p("site", "public", `search-synonyms.${lang}.json`), JSON.stringify(d.synonyms[lang]));   // loaded by the client-side search page
  console.log(`derived: ${d.timeline.length} timeline rows, ${d.map.features.length} map features, ${Object.keys(d.ego).length} ego graphs, ${Object.keys(d.related).length} related lists, ${Object.keys(d.synonyms.ar.whole).length} ar + ${Object.keys(d.synonyms.en.whole).length} en whole-label variants`);
}
