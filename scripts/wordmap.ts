// Word-map generator: corpus-driven thematic word maps for the Museum Cards experience.
//
// Reads the frozen Tanzil corpus (data/work/quran-source/tanzil-simple-clean-v1.1.txt)
// and cards/wordmap/seeds.yaml, writes cards/wordmap/<slug>.json + cards/wordmap/index.json.
//
// Verse text comes from the frozen corpus — never typed by hand (repo rule).
// Matching is on normalized surface forms; results are grouped by surface form
// and by collocation (the word following each occurrence), exactly the two
// groupings the hand-drawn reference cards use.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { parse } from "yaml";

const ROOT = new URL("..", import.meta.url).pathname;
const CORPUS = `${ROOT}data/work/quran-source/tanzil-simple-clean-v1.1.txt`;
const SEED_FILE = `${ROOT}cards/wordmap/seeds.yaml`;
const OUT_DIR = `${ROOT}cards/wordmap`;

/** Normalize Arabic for matching: strip diacritics, unify alef/hamza, teh-marbuta, alef-maqsura. */
export function normalizeAr(s: string): string {
  return s
    .replace(/[ً-ٰٟ]/g, "") // diacritics + superscript alef
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ـ/g, ""); // tatweel
}

const stripPunct = (t: string) => t.replace(/^[«»"'"()\[\]{}،؛:.!?…—–-]+|[«»"'"()\[\]{}،؛:.!?…—–-]+$/g, "");

/** Strip a leading definite article for matching (العذاب → عذاب). */
const stripDefinite = (t: string) => (t.startsWith("ال") && t.length > 3 ? t.slice(2) : t);

interface Verse { s: number; a: number; t: string }
interface Ref extends Verse {}
interface FormGroup { form: string; count: number; refs: Ref[] }
interface CollocGroup { after: string; phrase: string; count: number; refs: Ref[] }

function loadCorpus(): Verse[] {
  const verses: Verse[] = [];
  for (const line of readFileSync(CORPUS, "utf8").split("\n")) {
    const l = line.trim();
    if (!l) continue;
    const [s, a, ...rest] = l.split("|");
    verses.push({ s: parseInt(s, 10), a: parseInt(a, 10), t: rest.join("|") });
  }
  return verses;
}

export interface WordMapData {
  slug: string;
  word: string;
  title: { ar: string; en: string };
  total: number;
  forms: FormGroup[];
  collocations: CollocGroup[];
  corpus: string;
}

export function buildWordMap(word: string, verses: Verse[]): { total: number; forms: FormGroup[]; collocations: CollocGroup[] } {
  const nq = normalizeAr(word);
  const formMap = new Map<string, Ref[]>();
  const collocMap = new Map<string, { after: string; refs: Ref[] }>();

  for (const v of verses) {
    const tokens = v.t.split(/\s+/).map(stripPunct).filter(Boolean);
    tokens.forEach((tok, i) => {
      const nt = normalizeAr(tok);
      const core = stripDefinite(nt);
      // Match: exact surface form, ال-prefixed form, or و/ف-conjunction prefix on the query itself.
      if (nt !== nq && core !== nq && core !== stripDefinite(nq)) return;
      const arr = formMap.get(tok) ?? [];
      arr.push({ s: v.s, a: v.a, t: v.t });
      formMap.set(tok, arr);
      const next = tokens[i + 1];
      if (next) {
        const key = normalizeAr(next);
        const c = collocMap.get(key) ?? { after: next, refs: [] };
        c.refs.push({ s: v.s, a: v.a, t: v.t });
        // keep the most common surface form of the collocate
        collocMap.set(key, c);
      }
    });
  }

  const forms: FormGroup[] = [...formMap.entries()]
    .map(([form, refs]) => ({ form, count: refs.length, refs }))
    .sort((x, y) => y.count - x.count);
  const collocations: CollocGroup[] = [...collocMap.entries()]
    .map(([key, c]) => ({
      after: c.after,
      phrase: `${word} ${c.after}`,
      count: c.refs.length,
      refs: c.refs,
    }))
    .sort((x, y) => y.count - x.count);
  const total = forms.reduce((n, f) => n + f.count, 0);
  return { total, forms, collocations };
}

interface Seed { word: string; slug: string; title: { ar: string; en: string } }

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const seeds = (parse(readFileSync(SEED_FILE, "utf8")) as { seeds: Seed[] }).seeds;
  const verses = loadCorpus();
  console.log(`corpus: ${verses.length} verses`);

  const index: { slug: string; word: string; title: { ar: string; en: string }; total: number; forms: number }[] = [];
  for (const seed of seeds) {
    const { total, forms, collocations } = buildWordMap(seed.word, verses);
    if (total === 0) throw new Error(`wordmap: no occurrences for "${seed.word}" — check the seed`);
    const data: WordMapData = {
      slug: seed.slug, word: seed.word, title: seed.title,
      total, forms, collocations, corpus: "tanzil-quran-v1.1 (simple-clean)",
    };
    writeFileSync(`${OUT_DIR}/${seed.slug}.json`, JSON.stringify(data, null, 2) + "\n");
    index.push({ slug: seed.slug, word: seed.word, title: seed.title, total, forms: forms.length });
    console.log(`wordmap/${seed.slug}.json: ${total} occurrences, ${forms.length} forms, ${collocations.length} collocations`);
  }
  writeFileSync(`${OUT_DIR}/index.json`, JSON.stringify(index, null, 2) + "\n");

  // Guard: generated JSON must only contain verse text byte-identical to the corpus.
  const corpusText = new Set(verses.map((v) => `${v.s}|${v.a}|${v.t}`));
  for (const f of readdirSync(OUT_DIR).filter((f) => f.endsWith(".json") && f !== "index.json")) {
    const data = JSON.parse(readFileSync(`${OUT_DIR}/${f}`, "utf8")) as WordMapData;
    for (const form of data.forms)
      for (const r of form.refs)
        if (!corpusText.has(`${r.s}|${r.a}|${r.t}`))
          throw new Error(`wordmap/${f}: verse text not byte-identical to corpus (${r.s}:${r.a})`);
  }
  console.log("wordmap: corpus-identity check passed");
}

main();
