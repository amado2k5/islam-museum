// Builds the content pack of the small daily games from the museum's own records. Run from gaming/:
//   npx tsx --tsconfig tsconfig.json packages/daily/tools/build-pack.ts
//
// What goes in, and only this (nothing is added, rewritten or guessed; a record that fails a rule is left out and counted):
//   places   a place record with a name in Arabic and English and at least one source;
//   events   an event with sources, a start date known to the year or better (500 to 2025 CE), exactly one
//            `occurred_at` place among the places above, and a kind the games ask about (see EXCLUDED_KINDS);
//   persons  a person with sources and years of birth and death known to the year or better;
//   words    for each language, a place's own name in that language when it is one word of 4 to 6 letters;
//   phrases  for each language, a place's or person's own name in that language, 4 to 22 characters, letters only.
// A record is left out whole if it carries a `sensitivity` field, or if any of its text names a blocked organisation (scripts/lib/extremism.ts, the museum's
// own check), and a sentence is never shown if it types an honorific or a bracket of Qur'an text.
// The output is pinned in git (packages/daily/data/): rebuilt only on purpose, and a rebuild is a new pack version.
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { findBlocked } from "../../../../scripts/lib/extremism";
import { LANGS, PACK_VERSION, type Lang, type PackEvent, type PackFile, type PackLabels, type PackPerson, type WordFile } from "../src/pack";
import { HONORIFIC, fold, letters, normalizeWord } from "../src/text";

const ROOT = resolve(fileURLToPath(new URL("../../../../", import.meta.url)));
const OUT = resolve(fileURLToPath(new URL("../data/", import.meta.url)));
const EXCLUDED_KINDS = new Set(["massacre", "persecution", "expulsion", "revelation", "schism", "assassination", "execution", "terrorist-attack", "attack"]);
const NAME_FALLBACK: Record<Lang, Lang[]> = { ar: ["ar"], en: ["en"], ur: ["ur", "ar"], fr: ["fr", "en"], es: ["es", "en"], tr: ["tr", "en"], id: ["id", "en"] };
const PRECISE = new Set(["year", "month", "day"]);
const EVENTS_KEPT = 1500, PERSONS_KEPT = 1500, FAMOUS_PLACES = 600, FAMOUS_PERSONS = 400;

type Rec = Record<string, unknown>;
const skipped: Record<string, number> = {};
const skip = (why: string) => void (skipped[why] = (skipped[why] ?? 0) + 1);
function* records(cls: string): Generator<Rec> {
  for (const f of readdirSync(join(ROOT, "data", cls)).filter((f) => f.endsWith(".yaml") && !f.startsWith("_")).sort()) {
    const raw = readFileSync(join(ROOT, "data", cls, f), "utf8");
    if (findBlocked(raw).length) { skip(`${cls}: names a blocked organisation`); continue; }
    try {
      const rec = parse(raw) as Rec;
      if (rec && rec.sensitivity !== undefined) { skip(`${cls}: carries a sensitivity field`); continue; }
      if (rec && typeof rec.id === "string") yield rec;
    } catch { skip(`${cls}: unreadable YAML`); }
  }
}
const langBlock = (v: unknown, lang: Lang): string | null => {
  if (!v || typeof v !== "object") return null;
  const s = (v as Rec)[lang];
  return typeof s === "string" && s.trim() ? s.trim() : null;
};
/** Every language can name the record (its own name, or the fallback within its script) without a typed honorific. */
const nameable = (r: Rec): boolean => LANGS.every((lang) => { const n = NAME_FALLBACK[lang].map((l) => langBlock(r.label, l)).find(Boolean); return !!n && !HONORIFIC.test(n) && n.length <= 70; });
/** A sentence about the museum's own work on the record, not about its subject: not shown in a game. */
const EDITORIAL = /draft|stub|not yet|preliminary|placeholder|lead card|بطاقة|مسودة|مبدئي|لم يُتحقق|لم يتحقق|ابتدائی|مسودہ|brouillon|borrador|taslak|draf/i;
/** An event's name that holds a year in any language gives the answer away; such events are not asked about. */
const yearless = (r: Rec): boolean => LANGS.every((lang) => !/[0-9٠-٩۰-۹]{2,}/.test(langBlock(r.label, lang) ?? ""));
const sourced = (r: Rec) => Array.isArray(r.sources) && r.sources.length > 0;
const year = (d: unknown): { y: number; h: number } | null => {
  if (!d || typeof d !== "object") return null;
  const r = d as Rec;
  if (!PRECISE.has(String(r.precision))) return null;
  const m = /^(\d{4})/.exec(String(r.edtf ?? ""));
  if (!m) return null;
  const h = /^(\d{1,4})/.exec(String(r.hijri ?? ""));
  return { y: Number(m[1]), h: h ? Number(h[1]) : 0 };
};
const rel = (r: Rec, type: string): string[] => (Array.isArray(r.relations) ? r.relations : []).filter((x: Rec) => x && x.type === type && typeof x.target === "string" && x.confidence !== "low").map((x: Rec) => String(x.target));
/** The first sentence of a summary, cleaned of citation marks; null if it is unfit to show. */
function sentence(text: string | null): string | null {
  if (!text) return null;
  const t = text.replace(/\{cite:[^}]*\}/g, "").replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();
  if (HONORIFIC.test(t) || /[﴿﴾]/.test(t) || findBlocked(t).length || EDITORIAL.test(t)) return null;
  const m = /^(.{30,200}?[.!?۔؟])(\s|$)/u.exec(t);
  const s = m ? m[1]! : t.length <= 200 ? t : null;
  return s && s.length >= 20 ? s : null;
}

const recs = new Map<string, Rec>();
// How central a record is in the graph: its importance mark, then how many records point to it. The word games draw
// only from well-known names, so a day's word is one a visitor of the museum can reasonably know.
const inbound = new Map<string, number>();
const fame = (r: Rec): number => (r.importance === 1 ? 1000 : r.importance === 2 ? 500 : 0) + (inbound.get(String(r.id)) ?? 0);
const all: Record<string, Rec[]> = {};
for (const cls of ["place", "event", "person"]) {
  all[cls] = [...records(cls)];
  for (const r of all[cls]!) for (const x of Array.isArray(r.relations) ? r.relations : []) if (x && typeof (x as Rec).target === "string") inbound.set(String((x as Rec).target), (inbound.get(String((x as Rec).target)) ?? 0) + 1);
}
const places: string[] = [];
for (const r of all.place!) {
  if (!langBlock(r.label, "ar") || !langBlock(r.label, "en")) { skip("place: no Arabic or English name"); continue; }
  if (!nameable(r)) { skip("place: a name types an honorific or is too long to show"); continue; }
  if (!sourced(r)) { skip("place: no source"); continue; }
  recs.set(String(r.id), r);
  places.push(String(r.id));
}
const placeSet = new Set(places);
const events: PackEvent[] = [];
for (const r of all.event!) {
  if (EXCLUDED_KINDS.has(String(r.kind))) { skip("event: a kind the games do not ask about"); continue; }
  if (!langBlock(r.label, "ar") || !langBlock(r.label, "en")) { skip("event: no Arabic or English name"); continue; }
  if (!nameable(r)) { skip("event: a name types an honorific or is too long to show"); continue; }
  if (!sourced(r)) { skip("event: no source"); continue; }
  if (!yearless(r)) { skip("event: its name gives its year"); continue; }
  const d = year((r.date as Rec | undefined)?.start);
  if (!d || d.y < 500 || d.y > 2025) { skip("event: no start year known to the year"); continue; }
  const at = rel(r, "occurred_at").filter((p) => placeSet.has(p));
  if (at.length !== 1) { skip("event: not exactly one known place"); continue; }
  recs.set(String(r.id), r);
  events.push({ id: String(r.id), y: d.y, h: d.h, place: at[0]! });
}
const persons: PackPerson[] = [];
for (const r of all.person!) {
  if (!langBlock(r.label, "ar") || !langBlock(r.label, "en")) { skip("person: no Arabic or English name"); continue; }
  if (!nameable(r)) { skip("person: a name types an honorific or is too long to show"); continue; }
  if (!sourced(r)) { skip("person: no source"); continue; }
  const b = year(r.born), d = year(r.died);
  if (!b || !d || d.y < b.y || d.y - b.y > 110 || b.y < 400) { skip("person: years of birth and death not known to the year"); continue; }
  const born = rel(r, "born_in").filter((p) => placeSet.has(p));
  recs.set(String(r.id), r);
  persons.push({ id: String(r.id), born: b.y, died: d.y, place: born.length === 1 ? born[0]! : null });
}

const byFame = <T extends { id: string }>(list: T[], n: number): T[] => list.map((x) => [x, fame(recs.get(x.id)!)] as const).sort((a, b) => b[1] - a[1] || a[0].id.localeCompare(b[0].id)).slice(0, n).map(([x]) => x).sort((a, b) => a.id.localeCompare(b.id));
const eventsKept = byFame(events, EVENTS_KEPT), personsKept = byFame(persons, PERSONS_KEPT);
const famousPlaces = byFame(places.map((id) => ({ id })), FAMOUS_PLACES).map((x) => x.id);
const famousPersons = byFame(persons, FAMOUS_PERSONS).map((x) => x.id);
const placesKept = [...new Set([...famousPlaces, ...eventsKept.map((e) => e.place), ...personsKept.flatMap((p) => (p.place ? [p.place] : []))])].sort();
/** A word in a language other than Arabic, Urdu and English is used only when another language writes the name the
 * same way: a name found in one translation alone may be a mistranslation of the place. */
const confirmed = (r: Rec, lang: Lang, w: string): boolean => lang === "ar" || lang === "ur" || lang === "en" || LANGS.some((o) => o !== lang && o !== "ar" && o !== "ur" && langBlock(r.label, o) !== null && [...normalizeWord(langBlock(r.label, o)!, o)].map((c) => fold(c, o)).join("") === [...w].map((c) => fold(c, lang)).join(""));
const words = {} as Record<Lang, WordFile["words"]>, phrases = {} as Record<Lang, WordFile["phrases"]>, alphabet = {} as Record<Lang, string>;
const BASE: Record<Lang, string> = {
  ar: "ابتثجحخدذرزسشصضطظعغفقكلمنهويةءىئؤ",
  ur: "ابپتٹثجچحخدڈذرڑزژسشصضطظعغفقکگلمنوہھءیےئ",
  en: "abcdefghijklmnopqrstuvwxyz",
  fr: "abcdefghijklmnopqrstuvwxyz",
  es: "abcdefghijklmnñopqrstuvwxyz",
  tr: "abcçdefgğhıijklmnoöprsştuüvyz",
  id: "abcdefghijklmnopqrstuvwxyz",
};
for (const lang of LANGS) {
  const seenW = new Set<string>(), seenP = new Set<string>();
  words[lang] = [];
  phrases[lang] = [];
  for (const id of famousPlaces) {
    const name = langBlock(recs.get(id)!.label, lang);
    if (!name) continue;
    const w = normalizeWord(name, lang);
    if (w && /^\S+$/u.test(w) && letters(w).length >= 4 && letters(w).length <= 6 && [...w].every((c) => BASE[lang].includes(c)) && !seenW.has(w) && confirmed(recs.get(id)!, lang, w)) {
      seenW.add(w);
      words[lang].push({ id, w });
    }
  }
  for (const id of [...famousPlaces, ...famousPersons]) {
    const name = langBlock(recs.get(id)!.label, lang);
    if (!name || HONORIFIC.test(name)) continue;
    const p = normalizeWord(name, lang);
    if (!p || p.length < 4 || p.length > 22 || !/^[\p{L} '-]+$/u.test(p) || new Set(letters(p)).size < 4 || ![...letters(p)].every((c) => BASE[lang].includes(c)) || seenP.has(p) || !confirmed(recs.get(id)!, lang, p)) continue;
    seenP.add(p);
    phrases[lang].push({ id, p });
  }
  alphabet[lang] = BASE[lang];
}

const used = new Set<string>([...placesKept, ...famousPersons, ...eventsKept.map((e) => e.id), ...personsKept.map((p) => p.id)]);
const from = execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim();
const pack: PackFile = { format: "im.daily.pack", version: PACK_VERSION, from, places: placesKept, events: eventsKept, persons: personsKept };
writeFileSync(join(OUT, `pack.v${PACK_VERSION}.json`), JSON.stringify(pack) + "\n");
for (const lang of LANGS) writeFileSync(join(OUT, `words.v${PACK_VERSION}.${lang}.json`), JSON.stringify({ alphabet: alphabet[lang], words: words[lang], phrases: phrases[lang] } satisfies WordFile) + "\n");
for (const lang of LANGS) {
  const labels: PackLabels = {};
  for (const id of [...used].sort()) {
    const r = recs.get(id)!;
    const name = NAME_FALLBACK[lang].map((l) => langBlock(r.label, l)).find(Boolean);
    if (!name || HONORIFIC.test(name)) continue;
    const s = sentence(langBlock(r.summary, lang));
    labels[id] = s ? [name, s] : [name];
  }
  writeFileSync(join(OUT, `labels.v${PACK_VERSION}.${lang}.json`), JSON.stringify(labels) + "\n");
  // Kalima needs only the names of its own words: a file a twentieth of the size, for a quicker first visit on a phone.
  const wordLabels: PackLabels = {};
  for (const id of [...new Set(words[lang].map((w) => w.id))].sort()) if (labels[id]) wordLabels[id] = labels[id]!;
  writeFileSync(join(OUT, `word-labels.v${PACK_VERSION}.${lang}.json`), JSON.stringify(wordLabels) + "\n");
  // The Lantern, likewise, needs only the names of its own phrases.
  const phraseLabels: PackLabels = {};
  for (const id of [...new Set(phrases[lang].map((p) => p.id))].sort()) if (labels[id]) phraseLabels[id] = labels[id]!;
  writeFileSync(join(OUT, `phrase-labels.v${PACK_VERSION}.${lang}.json`), JSON.stringify(phraseLabels) + "\n");
}
const report = { from, places: placesKept.length, events: eventsKept.length, persons: personsKept.length, eligible: { places: places.length, events: events.length, persons: persons.length }, words: Object.fromEntries(LANGS.map((l) => [l, words[l].length])), phrases: Object.fromEntries(LANGS.map((l) => [l, phrases[l].length])), skipped };
writeFileSync(join(OUT, `report.v${PACK_VERSION}.json`), JSON.stringify(report, null, 1) + "\n");
console.log(JSON.stringify(report, null, 1));
