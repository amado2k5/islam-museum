// Reads the compiled graph (.cache/graph.json, produced by `npm run graph`) at build time.
import { existsSync, readFileSync } from "node:fs";
import { repoPath } from "./paths";
import type { Compiled, Edge, Node } from "../../../scripts/build-graph";
import type { Lang } from "./i18n";

const file = repoPath(".cache", "graph.json");
if (!existsSync(file)) throw new Error("Missing .cache/graph.json. Run `npm run graph` (or `npm run build` from the repo root).");

export const graph: Compiled = JSON.parse(readFileSync(file, "utf8"));
export const nodes: Node[] = graph.nodes;
export const byId = new Map(nodes.map((n) => [n.id, n]));
export const realNodes = nodes.filter((n) => !n.stub);
export const edgesFrom = (id: string): Edge[] => graph.edges.filter((e) => e.from === id);
export const derived = <T = any>(name: string): T => JSON.parse(readFileSync(repoPath(".cache", "derived", `${name}.json`), "utf8"));
export const related = (id: string): string[] => (derived<Record<string, string[]>>("related")[id] ?? []);
// The commit the site was built from (null outside git); build-graph.ts records it so a build is a function of the commit, not the clock.
export const buildCommit: string | null = graph.commit ?? null;
// The day an entity page's content last changed: the later of its data file and the prose it shows (git commit dates,
// scripts/git-dates.ts). Citations show this, not the build day, so a page's HTML only changes when its content does.
export const updatedOn = (n: Pick<Node, "updated" | "prose">, lang: Lang): string => {
  const pl = n.prose[lang] ? lang : n.prose.ar ? "ar" : n.prose.en ? "en" : null;
  const prose = pl ? n.prose[pl].updated : "";
  return prose > n.updated ? prose : n.updated;
};

// A title in the page language, else Arabic, else English (an honest interim), never the slug.
export const labelOf = (n: Pick<Node, "label" | "slug">, lang: Lang) => n.label[lang] ?? n.label.ar ?? n.label.en ?? "";
/** Which language `labelOf` actually returned, so a card can mark a fallback. */
export const labelLang = (n: Pick<Node, "label">, lang: Lang): Lang => (n.label[lang] ? lang : n.label.ar ? "ar" : "en");
// The raw summary keeps its {cite:…} markers and [[wiki-links]]; entity pages pass it through
// renderProse so citations become footnotes. For plain-text contexts (cards, meta descriptions,
// feeds) this strips the markers and resolves links to their label text.
/** Language of the summary `summaryOf` shows: the page language, or English when that translation is missing. */
export const summaryLang = (n: Pick<Node, "summary">, lang: Lang): Lang => (n.summary[lang] ? lang : n.summary.en ? "en" : lang);
export const summaryOf = (n: Pick<Node, "summary">, lang: Lang) => {
  const raw = n.summary[lang] ?? n.summary.en ?? "";
  return raw
    .replace(/\{cite:[^}]*\}/g, "")
    .replace(/\[\[([a-z]+\/[a-z0-9-]+)(?:\|([^\]]*))?\]\]/g, (_x, id: string, custom?: string) => { const t = custom ?? (byId.has(id) ? labelOf(byId.get(id)!, lang) : id.split("/")[1].replace(/-/g, " ")); return t; })
    .replace(/[ \t]+([.,:;!؟?])/g, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
};
// Raw summary with markers intact — only for the rendered lede on entity pages.
export const summaryRaw = (n: Pick<Node, "summary">, lang: Lang) => n.summary[lang] ?? n.summary.en ?? "";
// URL segment per class: questions and exhibits are plural (docs/plan/03 §5)
export const SEGMENT: Record<string, string> = { question: "questions", exhibit: "exhibits" };
export const href = (lang: Lang, id: string) => {
  const [cls, slug] = id.split("/");
  return `/${lang}/${SEGMENT[cls] ?? cls}/${slug}/`;
};

export const REPO = "https://github.com/amado2k5/islam-museum";
export const SITE = "https://islam.museum";
