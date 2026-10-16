// Museum Cards: flip-card list decks from cards/lists/<slug>.yaml.
// Loaded at build time only (never shipped to the client except through page payloads).
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";
import { repoPath } from "./paths";

export interface DeckItem {
  title: { ar: string; en: string };
  body: { ar: string; en: string };
  ref?: string;
  verify?: string;
}
export interface DeckFile {
  slug: string;
  title: { ar: string; en: string };
  lede: { ar: string; en: string };
  source_card: string;
  quiz: boolean;
  note?: { ar: string; en: string };
  items: DeckItem[];
}

const dir = () => repoPath("cards/lists");

/** All available decks, sorted by slug. */
export function listDecks(): { slug: string; title: { ar: string; en: string }; count: number }[] {
  return readdirSync(dir())
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => {
      const raw = parse(readFileSync(`${dir()}/${f}`, "utf8")) as DeckFile;
      return { slug: raw.slug, title: raw.title, count: raw.items.length };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

const cache = new Map<string, DeckFile>();
export function loadDeck(slug: string): DeckFile {
  const hit = cache.get(slug);
  if (hit) return hit;
  const raw = parse(readFileSync(`${dir()}/${slug}.yaml`, "utf8")) as DeckFile;
  if (raw.slug !== slug) throw new Error(`cardlists: slug mismatch in ${slug}.yaml`);
  if (!raw.items?.length) throw new Error(`cardlists/${slug}: empty deck`);
  cache.set(slug, raw);
  return raw;
}
