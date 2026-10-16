// Museum Cards: explainer decks from cards/explainers/<slug>.yaml.
// Loaded at build time only.
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";
import { repoPath } from "./paths";

export interface ExplainerStep { q: { ar: string; en: string }; a: { ar: string; en: string }; ref?: string; evidence?: { source: string; note?: string }[] }
export interface ExplainerFile {
  slug: string;
  title: { ar: string; en: string };
  lede: { ar: string; en: string };
  source_card: string;
  widget: "stepper" | "decision-tree" | "timeline" | "compare";
  steps?: ExplainerStep[];
  tree?: any;
  stations?: any[];
  columns?: any[];
  attribution?: { ar: string; en: string };
  caution?: { ar: string; en: string };
  cautions?: { ar: string; en: string }[];
  nuance?: { ar: string; en: string };
  footer?: { ar: string; en: string };
}

const dir = () => repoPath("cards/explainers");

export function listExplainers(): { slug: string; title: { ar: string; en: string }; widget: string }[] {
  return readdirSync(dir())
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => {
      const raw = parse(readFileSync(`${dir()}/${f}`, "utf8")) as ExplainerFile;
      return { slug: raw.slug, title: raw.title, widget: raw.widget ?? "stepper" };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

const cache = new Map<string, ExplainerFile>();
export function loadExplainer(slug: string): ExplainerFile {
  const hit = cache.get(slug);
  if (hit) return hit;
  const raw = parse(readFileSync(`${dir()}/${slug}.yaml`, "utf8")) as ExplainerFile;
  if (raw.slug !== slug) throw new Error(`explainers: slug mismatch in ${slug}.yaml`);
  if (!raw.widget) raw.widget = "stepper";
  cache.set(slug, raw);
  return raw;
}
