// Canon-first search (audit of 13 November 2026, S11). The search page ranks with Pagefind, which knows nothing of
// the canon: "Muhammad" put a tughra above the Prophet's page and "Ibn Sina" an event above the person. This builds,
// per language, a small map from the names a visitor types to the canon record they name. The search page looks the
// query up in it and shows that record first; Pagefind's results follow unchanged. Canon membership is read from
// `importance` (docs/canon.md) and is never decided here: this only ranks over the canon that exists.
//
// A key is a normalised name. Every canon record gives:
//   - its label in the language, whole; without a leading article; each half of "Name (Other name)";
//   - its names[] values in that script, and its former ids' slugs;
//   - the spelling variants the synonym map already builds for it (Saladin, Avicenna, Koran);
//   - parts of its label: the one to three words it opens with ("Abu Bakr", "Umar", "Ali"), and a run of words inside
//     it when few canon labels share that run ("Ghazali", "Khaldun"). "Muhammad" names the Prophet's record because
//     that is its whole label, not because it is a part of forty others.
// When two records claim a key, a whole-name claim beats a part, a part that opens the label beats one inside it
// ("مكة" is the head of «مكة المكرمة» and only a part of «فتح مكة»), then importance 1 beats 2, then the record
// the museum's own graph leans on more (degree), then the id. One record per key, so the test is exact.
import type { Compiled, Node } from "./build-graph.js";

export const normSearch = (t: string) => t.normalize("NFKD").replace(/[̀-ًͯ-ٰٟـ]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/ؤ/g, "و").replace(/ئ/g, "ي")
  .toLowerCase().replace(/['’‘`ʿʾ]/g, "").replace(/[-_()\/,.:«»"]/g, " ").replace(/\s+/g, " ").trim();
const ARTICLE = /^(the |al |an |a |ال)/;
const stripArticle = (k: string) => k.split(" ").map((w, i) => (i === 0 ? w.replace(/^ال(?=.{3,})/, "") : w)).join(" ").replace(/^(the|al|an|a) /, "");
/** Words too common in labels to stand for a record on their own, in either script. */
const GENERIC = new Set(["ibn", "bin", "bint", "abu", "abi", "umm", "al", "the", "of", "and", "battle", "siege", "conquest", "treaty", "mosque", "great", "city", "sultan", "caliph", "caliphate", "dynasty", "empire", "sura", "book", "day", "war", "first", "second", "ibn al", "بن", "ابن", "بنت", "ابو", "ابي", "ام", "غزوه", "معركه", "فتح", "صلح", "مسجد", "جامع", "دوله", "الدوله", "سوره", "كتاب", "يوم", "حرب", "مدينه"]);
const MAX_SHARE = 6; // a part of a label is a key only when at most this many canon labels contain it

export interface CanonHit { id: string; title: string; summary: string }
/** `keys` maps a normalised name to an index into `records`: a record is written once however many names it has. */
export interface CanonIndex { keys: Record<string, number>; records: CanonHit[] }
/** Kinds of names[] entry that stand for the whole person; a kunya, nisba or laqab alone is shared by too many. */
const WHOLE_NAME_KINDS = new Set(["full", "alternate", "latinized", "regnal", "pen"]);
export function canonSearchIndex(c: Compiled, lang: "ar" | "en" | "ur", variants: Record<string, string[]> = {}): CanonIndex {
  const canon = c.nodes.filter((n) => !n.stub && (n.data.importance === 1 || n.data.importance === 2));
  const labelIn = (n: Node) => n.label[lang] ?? (lang === "ur" ? n.label.ar : undefined) ?? n.label.ar ?? n.label.en ?? "";
  const script = (s: string) => (/[؀-ۿ]/.test(s) ? "ar" : "en");
  const want = lang === "en" ? "en" : "ar";
  // strength of a claim: 2 the whole name, 1 a part that opens the label, 0 a part inside it
  type Claim = { n: Node; strength: number };
  const claims = new Map<string, Claim[]>();
  const claim = (key: string, n: Node, strength: number) => {
    const k = normSearch(key);
    if (k.length < 3 || GENERIC.has(k)) return;
    const l = claims.get(k) ?? claims.set(k, []).get(k)!;
    const mine = l.find((x) => x.n === n);
    if (mine) mine.strength = Math.max(mine.strength, strength); else l.push({ n, strength });
  };
  // a name written "Name (gloss)" gives the whole string and "Name" as whole names; the gloss is only as strong as a
  // label's opening words ("al-Amin (Muhammad)" must not claim "Muhammad" as its name)
  const glosses = new Map<Node, string[]>();
  const wholeNames = (n: Node): string[] => {
    const out: string[] = [];
    const add = (s?: string) => { if (!s || script(s) !== want) return; out.push(s); const m = s.replace(/[\u2066-\u2069]/g, "").match(/^(.*?)\s*\(([^)]*)\)\s*$/); if (m) { out.push(m[1]); (glosses.get(n) ?? glosses.set(n, []).get(n)!).push(m[2]); } };
    add(labelIn(n));
    if (lang === "ur") add(n.label.ar);
    for (const x of n.data.names ?? []) if (WHOLE_NAME_KINDS.has(x.kind)) add(x.value);
    if (want === "en") for (const a of n.aliases ?? []) out.push(a.split("/")[1].replace(/-/g, " "));
    if (want === "en") out.push(n.slug.replace(/-\d+$/, "").replace(/-/g, " "));
    return out;
  };
  // how many canon labels contain each run of words (for the distinctiveness rule)
  const share = new Map<string, Set<string>>();
  const runsOf = (label: string) => { const w = normSearch(label).split(" ").filter(Boolean); const out = new Set<string>(); for (let i = 0; i < w.length; i++) for (let k = 1; k <= 3 && i + k <= w.length; k++) out.add(w.slice(i, i + k).join(" ")); return out; };
  for (const n of canon) for (const r of runsOf(labelIn(n))) (share.get(r) ?? share.set(r, new Set()).get(r)!).add(n.id);
  for (const n of canon) {
    for (const s of wholeNames(n)) { claim(s, n, 2); claim(stripArticle(normSearch(s)), n, 2); }
    for (const s of glosses.get(n) ?? []) { claim(s, n, 1); claim(stripArticle(normSearch(s)), n, 1); }
    const head = normSearch(labelIn(n));
    for (const r of runsOf(labelIn(n))) {
      const words = r.split(" ");
      if (words.every((w) => GENERIC.has(w))) continue;
      // a lone word must be long enough to be a name: three letters in Arabic script or when it opens the label (مكة، بدر, Ali), four inside a Latin label
      const strength = head.startsWith(`${r} `) || stripArticle(head).startsWith(`${stripArticle(r)} `) ? 1 : 0;
      if (words.length === 1 && r.length < (want === "ar" || strength === 1 ? 3 : 4)) continue;
      // words inside a label stand for the record only when few canon labels share them ("Khaldun", "Battuta"); the
      // words a label opens with always do, and the ranking below settles who among the sharers is meant ("Umar", "Ali")
      if (strength === 0 && (share.get(r)?.size ?? 0) > MAX_SHARE) continue;
      claim(r, n, strength); claim(stripArticle(r), n, strength);
    }
  }
  // spelling variants the synonym map knows: a variant of a canon label names that record
  const byLabel = new Map<string, Node[]>();
  for (const n of canon) { const k = normSearch(labelIn(n)); (byLabel.get(k) ?? byLabel.set(k, []).get(k)!).push(n); }
  for (const [variant, labels] of Object.entries(variants)) for (const l of labels) for (const n of byLabel.get(normSearch(l)) ?? []) claim(variant, n, 2);
  const rank = (a: Claim, b: Claim) => b.strength - a.strength || (a.n.data.importance - b.n.data.importance) || b.n.degree - a.n.degree || a.n.id.localeCompare(b.n.id);
  const plain = (n: Node) => String(n.summary[lang] ?? n.summary.ar ?? n.summary.en ?? "").replace(/\{cite:[^}]*\}/g, "").replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, "$1").replace(/\[\[([^\]]*)\]\]/g, "$1").replace(/⁦?\(\s*needs_source[^)]*\)⁩?/g, "").replace(/\s+/g, " ").trim();
  const keys: Record<string, number> = {};
  const records: CanonHit[] = [];
  const at = new Map<string, number>();
  for (const [k, l] of [...claims].sort(([a], [b]) => a.localeCompare(b))) {
    const best = l.sort(rank)[0].n;
    if (!at.has(best.id)) {
      const s = plain(best);
      at.set(best.id, records.push({ id: best.id, title: labelIn(best), summary: s.length > 120 ? `${s.slice(0, 120)}…` : s }) - 1);
    }
    keys[k] = at.get(best.id)!;
  }
  return { keys, records };
}
/** The record a query names, or null: the query whole, then without its article. site/public/shell/search-canon.js carries a copy of this and of normSearch. */
export const canonLookup = (index: CanonIndex, q: string): CanonHit | null => { const k = normSearch(q); const i = index.keys[k] ?? index.keys[stripArticle(k)]; return i === undefined ? null : index.records[i]; };
