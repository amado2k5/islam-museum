// Where am I? (docs/delegation/education-master-plan.md §5 E3, step 6): the gentle version for the
// explorers band — twelve first-person riddles, two choices each, and no answer is ever wrong.
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { repoPath } from "./paths";
import { byId, labelOf, href } from "./graph";
import type { Lang } from "./i18n";
import type { Tri } from "./edu";

export interface WhereRound { id: string; question: Tri; options: string[]; answer: string }
export interface WhereOptionView { label: string; href: string; right: boolean }
export interface WhereView { id: string; question: string; options: WhereOptionView[]; answerLabel: string }

let cache: WhereRound[] | null = null;
export function loadWhere(): WhereRound[] {
  if (cache) return cache;
  const raw = parse(readFileSync(repoPath("edu/where.yaml"), "utf8")) as { rounds?: WhereRound[] };
  const rounds = raw?.rounds ?? [];
  if (rounds.length !== 12) throw new Error(`edu/where.yaml: expected 12 rounds, found ${rounds.length}`);
  for (const r of rounds) {
    if (r.options.length !== 2) throw new Error(`edu/where.yaml: ${r.id} must offer exactly two choices`);
    if (!r.options.includes(r.answer)) throw new Error(`edu/where.yaml: ${r.id} answer is not one of its options`);
    for (const o of r.options) if (!byId.has(o)) throw new Error(`edu/where.yaml: ${r.id} names unknown entity ${o}`);
    for (const l of ["ar", "en", "ur"] as const) if (!r.question?.[l]) throw new Error(`edu/where.yaml: ${r.id} lacks ${l}`);
  }
  cache = rounds;
  return rounds;
}

export function viewWhere(r: WhereRound, lang: Lang): WhereView {
  const answer = byId.get(r.answer)!;
  return {
    id: r.id,
    question: r.question[lang] ?? r.question.ar,
    answerLabel: labelOf(answer, lang),
    options: r.options.map((o) => {
      const n = byId.get(o)!;
      return { label: labelOf(n, lang), href: href(lang, n.id), right: o === r.answer };
    }),
  };
}
