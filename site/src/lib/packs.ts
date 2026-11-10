// Seasonal packs (docs/delegation/education-master-plan.md §5 E3, step 4): the four dated teacher
// packs of edu/packs.yaml. Same shape checks the tests make, so a broken file fails the build.
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { repoPath } from "./paths";
import type { Lang } from "./i18n";
import type { Tri } from "./edu";

export interface PackItem { title: Tri; href: string; sheets: number }
export interface Pack { id: string; title: Tri; when: Tri; lede: Tri; kit: PackItem[] }

const pick = (t: Tri, lang: Lang): string => t[lang] ?? t.ar;

let cache: Pack[] | null = null;
export function loadPacks(): Pack[] {
  if (cache) return cache;
  const raw = parse(readFileSync(repoPath("edu/packs.yaml"), "utf8")) as { packs?: Pack[] };
  const packs = raw?.packs ?? [];
  if (packs.length !== 4) throw new Error(`edu/packs.yaml: expected 4 packs, found ${packs.length}`);
  for (const p of packs) {
    for (const l of ["ar", "en", "ur"] as const) {
      if (!p.title?.[l] || !p.when?.[l] || !p.lede?.[l]) throw new Error(`edu/packs.yaml: pack ${p.id} lacks ${l} strings`);
      for (const k of p.kit ?? []) if (!k.title?.[l]) throw new Error(`edu/packs.yaml: pack ${p.id} kit item lacks ${l}`);
    }
    const sheets = (p.kit ?? []).reduce((a, k) => a + k.sheets, 0);
    if (sheets < 8 || sheets > 12) throw new Error(`edu/packs.yaml: pack ${p.id} prints ${sheets} sheets; a kit is 8 to 12 pages`);
  }
  cache = packs;
  return packs;
}

export interface PackView { id: string; title: string; when: string; lede: string; kit: { title: string; href: string; sheets: number }[] }
export function viewPack(p: Pack, lang: Lang): PackView {
  return { id: p.id, title: pick(p.title, lang), when: pick(p.when, lang), lede: pick(p.lede, lang), kit: p.kit.map((k) => ({ title: pick(k.title, lang), href: `/${lang}${k.href}`, sheets: k.sheets })) };
}
