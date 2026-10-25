// The taught topics of the teen wing (docs/delegation/education-master-plan.md §5 E4; the approved
// list is docs/delegation/education-e4-proposal.md §2). edu/topics-50.yaml ships each topic's
// 60-second explainer, 12-term glossary and 10-question practice set, trilingual, hanging on one
// graph record (anchor). This loader is the single integrity gate the pages and the tests share.
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { repoPath } from "./paths";
import { byId, SITE } from "./graph";
import type { Tri } from "./edu";

export interface TopicOption { text: Tri; correct: boolean; why: Tri }
export interface TopicQuestion { q: Tri; options: TopicOption[] }
export interface TopicTerm { term: Tri; gloss: Tri }
export interface Topic {
  id: string;
  anchor: string;
  band: "scholars" | "researchers";
  title: Tri;
  sixty: Tri;
  glossary: TopicTerm[];
  practice: TopicQuestion[];
}

const LANGS = ["ar", "en", "ur"] as const;
let cache: Topic[] | null = null;
export function loadTopics(): Topic[] {
  if (cache) return cache;
  const raw = parse(readFileSync(repoPath("edu/topics-50.yaml"), "utf8")) as { topics?: Topic[] };
  const topics = raw?.topics ?? [];
  const seen = new Set<string>();
  for (const t of topics) {
    if (!t.id || seen.has(t.id)) throw new Error(`edu/topics-50.yaml: duplicate or missing id`);
    seen.add(t.id);
    if (!byId.has(t.anchor)) throw new Error(`edu/topics-50.yaml: ${t.id} anchors unknown record ${t.anchor}`);
    if (t.band !== "scholars" && t.band !== "researchers") throw new Error(`edu/topics-50.yaml: ${t.id} bad band ${t.band}`);
    for (const l of LANGS) {
      if (!t.title?.[l]) throw new Error(`edu/topics-50.yaml: ${t.id} title lacks ${l}`);
      if (!t.sixty?.[l]) throw new Error(`edu/topics-50.yaml: ${t.id} sixty lacks ${l}`);
    }
    if (t.glossary?.length !== 12) throw new Error(`edu/topics-50.yaml: ${t.id} glossary must hold 12 terms`);
    if (t.practice?.length !== 10) throw new Error(`edu/topics-50.yaml: ${t.id} practice must hold 10 questions`);
    for (const g of t.glossary) for (const l of LANGS)
      if (!g.term?.[l] || !g.gloss?.[l]) throw new Error(`edu/topics-50.yaml: ${t.id} glossary term lacks ${l}`);
    for (const q of t.practice) {
      if (q.options?.length !== 4) throw new Error(`edu/topics-50.yaml: ${t.id} question must offer four options`);
      if (q.options.filter((o) => o.correct).length !== 1) throw new Error(`edu/topics-50.yaml: ${t.id} question must mark exactly one answer`);
      for (const l of LANGS) {
        if (!q.q?.[l]) throw new Error(`edu/topics-50.yaml: ${t.id} question lacks ${l}`);
        for (const o of q.options) if (!o.text?.[l] || !o.why?.[l]) throw new Error(`edu/topics-50.yaml: ${t.id} option lacks ${l}`);
      }
    }
  }
  cache = topics;
  return topics;
}

/** schema.org Course for one taught topic's 60-second page (E4 close-out: the teen wing is a
 * course family; the sitemap carries these routes already via @astrojs/sitemap). */
export function courseLd(t: Topic, lang: (typeof LANGS)[number]) {
  const url = `${SITE}/${lang}/shabab/60s/${t.id}/`;
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": url,
    url,
    name: t.title[lang],
    description: t.sixty[lang],
    inLanguage: lang,
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    provider: { "@type": "Organization", name: "islam.museum", url: SITE },
    isPartOf: { "@type": "WebSite", name: "islam.museum", url: SITE },
  };
}
