// Display formatting for EDTF / Hijri dates, bilingual. Derived conversions are flagged.
import { civilToHijri } from "../../../scripts/hijri/convert";
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
export function formatAH(hijri: string, lang: Lang): string {
  const p = parts(hijri);
  return p ? render(p, HIJRI[lang], lang, lang === "ar" ? "هـ" : "AH") : hijri;
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
      bits.push(render(hp, HIJRI[lang], lang, lang === "ar" ? "هـ" : "AH") + "†");
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
