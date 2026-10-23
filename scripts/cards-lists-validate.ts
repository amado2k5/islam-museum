// Lists validator: schema-check every cards/lists/<slug>.yaml.
// Bodies must be editorial (own words); refs are labels only — no quoted
// Quran/hadith text is allowed in YAML (repo rule: verse text from Tanzil only,
// hadith wording verified before publication).
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";

const ROOT = new URL("..", import.meta.url).pathname;
const DIR = `${ROOT}cards/lists`;

interface Item { title: { ar: string; en: string }; body: { ar: string; en: string }; ref?: string; verify?: string }
interface Deck {
  slug: string; title: { ar: string; en: string }; lede: { ar: string; en: string };
  source_card: string; status: { review: string }; quiz: boolean;
  note?: { ar: string; en: string }; items: Item[];
}

const errors: string[] = [];
const seen = new Set<string>();
for (const f of readdirSync(DIR).filter((f) => f.endsWith(".yaml"))) {
  const path = `${DIR}/${f}`;
  let deck: Deck;
  try {
    deck = parse(readFileSync(path, "utf8")) as Deck;
  } catch (e) {
    errors.push(`${f}: YAML parse error: ${(e as Error).message}`);
    continue;
  }
  const tag = `lists/${f}`;
  if (!deck.slug || !/^[a-z0-9-]+$/.test(deck.slug)) errors.push(`${tag}: bad slug`);
  if (deck.slug !== f.replace(/\.yaml$/, "")) errors.push(`${tag}: slug must match filename`);
  if (seen.has(deck.slug)) errors.push(`${tag}: duplicate slug`);
  seen.add(deck.slug);
  if (!deck.title?.ar || !deck.title?.en) errors.push(`${tag}: title.ar/en required`);
  if (!deck.lede?.ar || !deck.lede?.en) errors.push(`${tag}: lede.ar/en required`);
  if (!deck.source_card) errors.push(`${tag}: source_card (catalog id) required`);
  if (!Array.isArray(deck.items) || deck.items.length === 0) errors.push(`${tag}: items empty`);
  deck.items?.forEach((it, i) => {
    if (!it.title?.ar) errors.push(`${tag}: item ${i} missing title.ar`);
    if (!it.body?.ar) errors.push(`${tag}: item ${i} missing body.ar`);
    // Honorific guard: no typed ﷺ etc. anywhere (UI renders them).
    const text = JSON.stringify(it);
    if (/ﷺ|ﷻ|رضي الله عنه|عليه السلام/.test(text))
      errors.push(`${tag}: item ${i} contains a typed honorific`);
  });
}
if (errors.length) {
  console.error(`lists: ${errors.length} error(s):\n` + errors.join("\n"));
  process.exit(1);
}
console.log(`lists: ${seen.size} decks OK`);
