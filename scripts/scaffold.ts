// Scaffolding text in summaries (audit of 13 November 2026, S13). 11,771 records were filed with a summary of the
// form "Draft card for <what it is>; its sources are not yet checked on the page." (Arabic: «بطاقة أولية لـ… ؛ لم
// تُراجع مصادره على الصفحة بعد.»). The first half is the record's description; the frame around it is a note from
// the pipeline to itself, and it was printed on 2,905 People-hall cards and in every feed. The frame is taken off
// here, when the graph is built, so no page, card or feed prints it; the data files keep it. What the frame said is
// said once, by design: a record whose review state is draft carries the museum's draft badge and sentence
// (i18n `status.draft_note`). This file has no imports, so the site can bundle it.
const EN_PREFIX = /^\s*Draft card for\s+/i;
const AR_PREFIX = /^\s*ب?طاقة أولية\s+/; // one record was filed with the first letter missing
const UR_PREFIX = /^\s*(?:ابتدائی|مسودہ) کارڈ(?:\s*(?:برائے|:))?\s+/;
/** A clause that only reports the pipeline's own state: nothing in it describes the subject. */
const EN_NOTE = /\bnot yet (?:checked|read|verified|reviewed)\b|\bso no dates are given\b|^\s*Draft card from\b/i;
const AR_NOTE = /لم\s+تُ?راجَ?ع|لا\s+تُ?ذكر\s+هنا\s+تواريخ|وردت? (?:في|من) وصف مرجعي مفتوح/;
const UR_NOTE = /ابھی (?:تک )?(?:جانچ|تصدیق|نظرثانی)|صفحے پر (?:ابھی )?(?:نہیں|جانچ)/;

const capFirst = (s: string) => s.replace(/^([a-z])/, (c) => c.toUpperCase());
const tidy = (s: string, stop: string) => { const t = s.replace(/\s+/g, " ").replace(/\s+([.,;،؛])/g, "$1").replace(/[\s,;،؛—–-]+$/u, "").trim(); return t && !/[.!?؟。۔]$/.test(t) ? t + stop : t; };

/**
 * Take the pipeline's frame off a summary. Returns the description alone and whether a frame was found.
 * A summary without the frame is returned untouched. Citation markers and links inside the description are kept.
 */
export function stripScaffold(text: string | undefined, lang: string): { text: string; scaffold: boolean } {
  const raw = text ?? "";
  // a field can hold text in another language than its key says (one Arabic summary is the English card): go by the text
  if (lang !== "en" && EN_PREFIX.test(raw)) lang = "en";
  const [prefix, note, stop] = lang === "en" ? [EN_PREFIX, EN_NOTE, "."] : lang === "ur" ? [UR_PREFIX, UR_NOTE, "۔"] : [AR_PREFIX, AR_NOTE, "."];
  // the frame is the opening words, or (20 records) only the closing note about the page
  const framed = prefix.test(raw);
  const TAIL = lang === "en" ? /not yet checked on the (?:source )?page|the page not yet checked|(?:^|\.\s+)Draft card from\b/i : /لم\s+تُ?راجَ?ع[^.؛]*على (?:الصفحة|صفحات المصدر) بعد/;
  if (!framed && !TAIL.test(raw)) return { text: raw, scaffold: false };
  let s = raw.replace(prefix, "");
  if (framed && lang !== "en") {
    // «لـX» → X ; «للمسجد» → «المسجد» ; «لأحمد» → «أحمد» (the preposition belongs to the frame, not to the name)
    s = s.replace(/^لـ\s*/, "").replace(/^لل/, "ال").replace(/^ل(?=[ء-ي])/, "");
  }
  // clauses are separated by ; ؛ — or a sentence end; a clause that only reports the pipeline's state goes
  const cites: string[] = [];
  const held = s.replace(/\{cite:[^}]*\}/g, (m) => { cites.push(m); return `\u0001${cites.length - 1}\u0001`; });
  // split into clauses and keep each separator with the clause it introduces, so what stays is joined as it was written
  const tokens = held.split(/((?<=[.!?؟])\s+|\s*[;؛]\s*|\s+[—–]\s+)/);
  const parts: string[] = [], seps: string[] = [];
  for (let i = 0; i < tokens.length; i += 2) { parts.push(tokens[i]); seps.push(i === 0 ? "" : tokens[i - 1]); }
  // inside a clause the note can be one comma phrase among the description's ("X, the Ottoman writer, the page not yet
  // checked"; «…، ورد في وصف مرجعي مفتوح»): take the phrase, keep the rest; a clause that is nothing but the note goes
  const cleaned = parts
    // "he died in 1200 and his entry is not yet checked": the fact before "and" is the description's
    .map((p) => (note.test(p) && lang === "en" ? p.split(/\s+and\s+(?=(?:his|her|its|their|the)\b)/).filter((c) => !note.test(c)).join(" and ") || p : p))
    .map((p) => (note.test(p) ? p.split(/\s*[,،]\s*/).filter((c) => !note.test(c)).join(lang === "en" ? ", " : "، ") : p))
    .map((p) => p.replace(/\s*\u2066?\(ويكي البيانات\)\u2069?\s*/g, " "));
  let joined = "";
  cleaned.forEach((p, i) => { if (p.replace(/[\s.,،؛;]/g, "").length > 0) joined += (joined ? seps[i] : "") + p; });
  let out = joined.replace(/\u0001(\d+)\u0001/g, (_m, i) => cites[Number(i)]);
  out = tidy(out, stop);
  return { text: lang === "en" && framed ? capFirst(out) : out, scaffold: true };
}
/**
 * The same frame inside a prose file: eleven articles open with "[[id|Name]] — Draft card for Name, the …; his entry
 * is not yet checked on the page." The words of the frame go; the description, its links and its citations stay.
 */
export function stripScaffoldProse(md: string, lang: string): string {
  if (!/Draft card for|بطاقة أولية ل/.test(md)) return md;
  return md.split("\n").map((line) => {
    if (!/Draft card for|بطاقة أولية ل/.test(line)) return line;
    let t = line.replace(/Draft card for\s+/g, "").replace(/بطاقة أولية لل/g, "ال").replace(/بطاقة أولية لـ\s*/g, "").replace(/بطاقة أولية ل(?=[\u0621-\u064A])/g, "");
    // the clause that only reports the page's own state, up to the end of its sentence (a citation after it is kept)
    t = t.replace(/\s*[;؛,،]\s*[^.;؛{}]*(?:not yet (?:checked|read) on the (?:source )?page|لم\s+تُ?راجَ?ع[^.؛{}]*على الصفحة بعد)[^.{}]*(?=[.{]|$)/g, "");
    return t.replace(/\s+\./g, ".").replace(/\s{2,}/g, " ");
  }).join("\n");
}

/** True when a string still carries a piece of the frame: the build checks every summary it emits with this. */
export const hasScaffold = (text: string) => /Draft card for|not yet checked on the page|has not been written yet|بطاقة أولية ل|لم تُراجع (?:مصادر|ترجمت|الصفحة)/.test(text);
