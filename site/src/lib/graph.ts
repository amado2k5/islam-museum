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
export const buildDate = graph.generated.slice(0, 10);

export const labelOf = (n: Pick<Node, "label" | "slug">, lang: Lang) => n.label[lang] ?? n.label.en ?? n.slug;
export const summaryOf = (n: Pick<Node, "summary">, lang: Lang) => n.summary[lang] ?? n.summary.en ?? "";
// URL segment per class: questions and exhibits are plural (docs/plan/03 §5)
export const SEGMENT: Record<string, string> = { question: "questions", exhibit: "exhibits" };
export const href = (lang: Lang, id: string) => {
  const [cls, slug] = id.split("/");
  return `/${lang}/${SEGMENT[cls] ?? cls}/${slug}/`;
};

export const REPO = "https://github.com/amado2k5/islam-museum";
export const SITE = "https://islam.museum";
