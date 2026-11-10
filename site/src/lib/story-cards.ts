// Story in 12 cards (E5): edu/story-cards/<slug>.yaml — each story is exactly
// twelve cards: one idea, one illustration motif (inline SVG; no external
// media), one narration line. Trilingual; loaded at build time only.
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";
import { repoPath } from "./paths";
import type { Lang } from "./i18n";

const DIR = repoPath("edu/story-cards");

export const MOTIFS = [
  "moon", "mountain", "cave", "camel", "caravan", "sea", "star", "mosque",
  "city", "book", "manuscript", "pen", "map", "compass", "coin", "tree",
] as const;
export type Motif = (typeof MOTIFS)[number];

type Tri = Record<Lang, string>;

export interface StoryCard { title: Tri; motif: Motif; narration: Tri }
export interface StoryCardFile {
  slug: string;
  title: Tri;
  lede: Tri;
  sources: string[];
  cards: StoryCard[];
}

function tri(v: unknown, where: string): Tri {
  const t = v as Tri;
  for (const l of ["ar", "en", "ur"] as Lang[])
    if (typeof t?.[l] !== "string" || !t[l]) throw new Error(`${where}: missing ${l}`);
  return t;
}

const cache = new Map<string, StoryCardFile>();
export function loadStoryCards(slug: string): StoryCardFile {
  const hit = cache.get(slug);
  if (hit) return hit;
  const where = `edu/story-cards/${slug}.yaml`;
  const d = parse(readFileSync(`${DIR}/${slug}.yaml`, "utf8")) as StoryCardFile;
  if (d.slug !== slug) throw new Error(`${where}: slug mismatch`);
  tri(d.title, `${where}: title`); tri(d.lede, `${where}: lede`);
  if (!Array.isArray(d.sources) || d.sources.length === 0 || d.sources.some((s) => typeof s !== "string"))
    throw new Error(`${where}: sources must be a non-empty list of source ids`);
  if (!Array.isArray(d.cards) || d.cards.length !== 12)
    throw new Error(`${where}: a story is exactly 12 cards`);
  d.cards.forEach((c, i) => {
    const w = `${where}: card ${i + 1}`;
    tri(c.title, `${w} title`); tri(c.narration, `${w} narration`);
    if (!MOTIFS.includes(c.motif)) throw new Error(`${w}: unknown motif ${c.motif}`);
  });
  cache.set(slug, d);
  return d;
}

export function listStoryCards(): { slug: string; title: Tri; lede: Tri; count: number }[] {
  return readdirSync(DIR)
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => f.replace(/\.yaml$/, ""))
    .map((slug) => { const d = loadStoryCards(slug); return { slug, title: d.title, lede: d.lede, count: d.cards.length }; })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}
