// Museum Cards: stories from cards/stories/<slug>.yaml. Build-time only.
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";
import { repoPath } from "./paths";

export interface StoryStation { title: { ar: string; en: string }; ref: string; body: { ar: string; en: string }; evidence?: { source: string; note?: string }[] }
export interface StoryFile {
  slug: string;
  title: { ar: string; en: string };
  lede: { ar: string; en: string };
  source_card: string;
  intro: { ar: string; en: string };
  stations: StoryStation[];
  facts?: { ar: string; en: string }[];
  lessons?: { ar: string; en: string }[];
  cautions?: { ar: string; en: string }[];
  khulasa?: { ar: string; en: string };
}

const dir = () => repoPath("cards/stories");

export function listStories(): { slug: string; title: { ar: string; en: string }; count: number }[] {
  return readdirSync(dir())
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => {
      const raw = parse(readFileSync(`${dir()}/${f}`, "utf8")) as StoryFile;
      return { slug: raw.slug, title: raw.title, count: raw.stations.length };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

const cache = new Map<string, StoryFile>();
export function loadStory(slug: string): StoryFile {
  const hit = cache.get(slug);
  if (hit) return hit;
  const raw = parse(readFileSync(`${dir()}/${slug}.yaml`, "utf8")) as StoryFile;
  if (raw.slug !== slug) throw new Error(`stories: slug mismatch in ${slug}.yaml`);
  if (!raw.stations?.length) throw new Error(`stories/${slug}: empty stations`);
  cache.set(slug, raw);
  return raw;
}
