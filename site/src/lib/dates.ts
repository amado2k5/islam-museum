// Display formatting for EDTF / Hijri dates, bilingual. Derived conversions are flagged.
import { civilToHijri, hijriToCivil } from "../../../scripts/hijri/convert";
import type { Lang } from "./i18n";

const GREG = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
};
const HIJRI = {
  en: ["Muharram", "Safar", "Rabi' I", "Rabi' II", "Jumada I", "Jumada II", "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qa'da", "Dhu al-Hijja"],
  ar: ["محرم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"],
};

interface Parts { y: number; m?: number; d?: number; approx: boolean; uncertain: boolean; unknown: boolean }
function parts(s: string): Parts | null {
  const m = s.match(/^(-?\d{4}|-?\d{2}XX|-?\d{3}X)(?:-(\d{2}))?(?:-(\d{2}))?([~?%]*)$/);
  if (!m) return null;
  const unknown = /X/.test(m[1]);
  const y = Number(m[1].replace(/X/g, "0"));
  return { y, m: m[2] ? Number(m[2]) : undefined, d: m[3] ? Number(m[3]) : undefined, approx: m[4].includes("~") || m[4].includes("%"), uncertain: m[4].includes("?"), unknown };
}

const num = (n: number, lang: Lang) => (lang === "ar" ? new Intl.NumberFormat("ar-EG-u-nu-latn", { useGrouping: false }).format(n) : String(n));

function render(p: Parts, names: string[], lang: Lang, era: string): string {
  const c = lang === "ar" ? "نحو " : "c. ";
  const yr = p.y < 0 ? (lang === "ar" ? `${num(-p.y, lang)} ق.م` : `${-p.y} BCE`) : num(p.y, lang);
  const core = [p.d ? num(p.d, lang) : "", p.m ? names[p.m - 1] : "", yr].filter(Boolean).join(" ");
  const tail = p.unknown ? (lang === "ar" ? " (تقريبًا)" : " (approx.)") : "";
  return `${p.approx || p.unknown ? c : ""}${core}${p.uncertain ? "?" : ""}${tail} ${era}`.trim();
}

export function formatCE(edtf: string, lang: Lang): string {
  const p = parts(edtf);
  return p ? render(p, GREG[lang], lang, p.y < 0 ? "" : lang === "ar" ? "م" : "CE") : edtf;
}
/** The Hijri calendar has no year 0: 0 is 1 BH, -11 is 12 BH (years before the Hijra are counted back from 1). */
function renderAH(p: Parts, lang: Lang): string {
  const bh = p.y < 1;
  const q = bh ? { ...p, y: 1 - p.y } : p;
  return render(q, HIJRI[lang], lang, bh ? (lang === "ar" ? "ق.هـ" : "BH") : (lang === "ar" ? "هـ" : "AH"));
}
export function formatAH(hijri: string, lang: Lang): string {
  const p = parts(hijri);
  return p ? renderAH(p, lang) : hijri;
}

/** One date object → "980 CE · 370 AH" with derived Hijri flagged when only the CE side is stored. */
export function formatDate(d: any, lang: Lang): { text: string; derived: boolean } {
  if (!d) return { text: "", derived: false };
  const bits: string[] = [];
  let derived = false;
  if (d.edtf) bits.push(formatCE(d.edtf, lang));
  if (d.hijri) bits.push(formatAH(d.hijri, lang));
  else if (d.edtf) {
    const p = parts(d.edtf);
    if (p && !p.unknown && p.y >= 622) {
      const h = civilToHijri(d.calendar ?? (p.y < 1583 ? "julian" : "gregorian"), { y: p.y, m: p.m ?? 6, d: p.d ?? 15 });
      const hp: Parts = { y: h.date.y, m: p.m ? h.date.m : undefined, d: p.d ? h.date.d : undefined, approx: p.approx, uncertain: p.uncertain, unknown: false };
      bits.push(renderAH(hp, lang) + "†");
      derived = true;
    }
  }
  return { text: bits.join(" · "), derived };
}

/** Year-only for compact chips and timelines. */
export const yearOf = (d: any): number | undefined => {
  const p = d?.edtf && parts(d.edtf);
  return p ? p.y : undefined;
};

/** The date object an entity's timeline position comes from (events: date.start; people: born or floruit; …). */
export function startOf(data: any): any {
  return data?.born ?? data?.floruit ?? data?.date?.start ?? data?.start ?? data?.founded ?? data?.built ?? data?.made ?? data?.composed;
}

const msToYear = (ms: number) => 1970 + ms / (365.2425 * 86_400_000);

/** [year, month, day] from a stored Hijri string ("-0011", "0007~", "0010-12-08"); missing month or day count as 1. */
function hijriParts(h: unknown): [number, number, number] | undefined {
  const m = typeof h === "string" ? h.match(/^(-?\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/) : null;
  return m ? [Number(m[1]), Number(m[2] ?? 1), Number(m[3] ?? 1)] : undefined;
}

/**
 * Timeline sort key: decimal CE start (from the Hijri date when given, else the CE date), then the Hijri date as tie-break. Year-precision periods (eras) sort after the
 * events of their start year. Dates given only in the Hijri calendar are converted, so they are not left at the end of the list.
 * Returns Infinity for undated entities.
 */
export function timelineKey(n: { span?: { earliest: number }; class: string; data: any }): { key: number; ord: number } {
  const s = startOf(n.data);
  // Early entries are dated in the Hijri calendar in the sources (a CE year can be a year off, e.g. 629 for 8 AH), so a Hijri date is the key when there is one.
  let key: number | undefined;
  const hj = hijriParts(s?.hijri);
  if (hj) {
    const c = hijriToCivil({ y: hj[0], m: hj[1], d: hj[2] });
    key = msToYear(Date.UTC(c.date.y, c.date.m - 1, c.date.d));
  } else key = n.span?.earliest;
  if (key === undefined) return { key: Infinity, ord: 0 };
  if (n.class === "period" && s?.precision === "year") key = Math.round(key) + 1 - 1e-6;
  return { key, ord: hj ? hj[0] * 10000 + hj[1] * 100 + hj[2] : 0 };
}
