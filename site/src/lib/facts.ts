// Fact engine «هل تعلم؟» (docs/delegation/education-master-plan.md §5 E3): the authored,
// sourced `education.did_you_know` facts on entities. Read straight from data/ at build time,
// like the daily schedule generator, so a fact lands without a graph rebuild. Fact of the day
// and fact of the week rotate deterministically (day-of-year / week index over the id-sorted
// pool), so two builds of one commit pick the same fact on the same day — no clock randomness.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { repoPath } from "./paths";
import { byId, href, labelOf } from "./graph";
import type { Lang } from "./i18n";

export interface Fact { id: string; ar: string; en: string; ur: string; sources: string[] }
export interface FactView { id: string; href: string; label: string; text: string; sources: string[] }

let cache: Fact[] | null = null;
/** Every entity fact, sorted by entity id so rotations are stable. */
export function loadFacts(): Fact[] {
  if (cache) return cache;
  const out: Fact[] = [];
  for (const cls of readdirSync(repoPath("data")).sort()) {
    const dir = repoPath("data", cls);
    let files: string[];
    try { files = readdirSync(dir); } catch { continue; }
    for (const f of files.sort()) {
      if (!f.endsWith(".yaml") || f.startsWith("_")) continue;
      const d = parse(readFileSync(join(dir, f), "utf8"));
      const fact = d?.education?.did_you_know;
      if (!fact || !d?.id) continue;
      out.push({ id: d.id, ar: fact.ar, en: fact.en, ur: fact.ur, sources: fact.sources ?? [] });
    }
  }
  out.sort((a, b) => a.id.localeCompare(b.id));
  cache = out;
  return out;
}

export const factText = (f: Fact, lang: Lang): string => f[lang] ?? f.ar;

export function viewFact(f: Fact, lang: Lang): FactView {
  const n = byId.get(f.id);
  return { id: f.id, href: n ? href(lang, f.id) : `/${lang}/`, label: n ? labelOf(n, lang) : f.id, text: factText(f, lang), sources: f.sources };
}

/** Fact of the day: day-of-year rotation over the sorted pool. */
export function factOfDay(date: Date = new Date()): Fact | null {
  const facts = loadFacts();
  if (!facts.length) return null;
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const doy = Math.floor((date.getTime() - start) / 86400000);
  return facts[doy % facts.length];
}

/** Fact of the week: week index since the epoch over the sorted pool (the printable poster). */
export function factOfWeek(date: Date = new Date()): Fact | null {
  const facts = loadFacts();
  if (!facts.length) return null;
  return facts[Math.floor(date.getTime() / (7 * 86400000)) % facts.length];
}
