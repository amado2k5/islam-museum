// Homework topics (docs/delegation/education-master-plan.md §5 E3, step 7): 50 school topics whose
// phrasings are merged into the search synonyms at build (scripts/derive.ts) and whose titles feed
// the "topics" strip on the search page's zero-result state and on the teacher hub.
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { repoPath } from "./paths";
import { byId, labelOf, href } from "./graph";
import type { Lang } from "./i18n";
import type { Tri } from "./edu";

export interface HomeworkTopic { id: string; target: string; title: Tri; phrasings: Record<Lang, string[]> }
export interface HomeworkView { id: string; title: string; href: string }

let cache: HomeworkTopic[] | null = null;
export function loadHomework(): HomeworkTopic[] {
  if (cache) return cache;
  const raw = parse(readFileSync(repoPath("edu/homework-topics.yaml"), "utf8")) as { topics?: HomeworkTopic[] };
  const topics = raw?.topics ?? [];
  if (topics.length !== 50) throw new Error(`edu/homework-topics.yaml: expected 50 topics, found ${topics.length}`);
  for (const t of topics) {
    if (!byId.has(t.target)) throw new Error(`edu/homework-topics.yaml: ${t.id} targets unknown entity ${t.target}`);
    for (const l of ["ar", "en", "ur"] as const) {
      if (!t.title?.[l]) throw new Error(`edu/homework-topics.yaml: ${t.id} lacks ${l} title`);
      if ((t.phrasings?.[l] ?? []).length !== 3) throw new Error(`edu/homework-topics.yaml: ${t.id} needs exactly 3 ${l} phrasings`);
    }
  }
  cache = topics;
  return topics;
}

export function viewHomework(t: HomeworkTopic, lang: Lang): HomeworkView {
  const n = byId.get(t.target)!;
  return { id: t.id, title: t.title[lang] ?? t.title.ar, href: href(lang, n.id) };
}
export const homeworkViews = (lang: Lang): HomeworkView[] => loadHomework().map((t) => viewHomework(t, lang));
