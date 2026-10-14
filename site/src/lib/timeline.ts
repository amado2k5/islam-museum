// Data for the Hijri timeline (Part 3, C.2): every dated event placed on a decimal Hijri year, the periods as era bands.
import { civilToHijri } from "../../../scripts/hijri/convert";
import { href, labelOf, realNodes, summaryOf } from "./graph";
import { formatDate, hijriParts, startOf } from "./dates";
import type { Lang } from "./i18n";
import type { TlEvent } from "./timeline-layout";

/** Decimal Hijri year of an entity's start: from the stored Hijri string when there is one, else converted from the CE span. */
export function hijriYearOf(n: { span?: { earliest: number }; data: any }): number | undefined {
  const s = startOf(n.data);
  const hj = hijriParts(s?.hijri);
  if (hj) return hj[0] + (hj[1] - 1) / 12 + (hj[2] - 1) / 354;
  if (n.span) {
    const ce = n.span.earliest, y = Math.floor(ce);
    const h = civilToHijri(y < 1583 ? "julian" : "gregorian", { y, m: Math.min(12, Math.floor((ce - y) * 12) + 1), d: 15 }).date;
    return h.y + (h.m - 1) / 12;
  }
  return undefined;
}

const short = (s: string, n = 110) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s);

export function timelineEvents(lang: Lang): TlEvent[] {
  const out: TlEvent[] = [];
  const order = new Map<string, number>();
  const yearOnly = new Map<string, number>(); // event id -> CE year, for year-precision dates
  const lastDatedInCeYear = new Map<number, number>(); // CE year -> latest order key of its day/month-dated events
  for (const n of realNodes) {
    if (n.class !== "event") continue;
    const y = hijriYearOf(n);
    if (y === undefined) continue;
    out.push({ id: n.id, href: href(lang, n.id), label: labelOf(n, lang), date: formatDate(n.data.date?.start, lang).text, y, s: short(summaryOf(n, lang)) });
    const ceYear = parseInt(String(startOf(n.data)?.edtf ?? "").slice(0, 4), 10); // CE year from the EDTF start, present even when the date is given in Hijri
    if (startOf(n.data)?.precision === "year") {
      yearOnly.set(n.id, ceYear);
      order.set(n.id, y);
    } else {
      order.set(n.id, y);
      if (!Number.isNaN(ceYear)) lastDatedInCeYear.set(ceYear, Math.max(lastDatedInCeYear.get(ceYear) ?? -Infinity, y));
    }
  }
  // A year-only date ("نحو 622") lists right after the last dated event of its CE year; its plotted position is unchanged.
  for (const [id, ceYear] of yearOnly) {
    const last = lastDatedInCeYear.get(ceYear);
    if (last !== undefined) order.set(id, last + 1e-6);
  }
  return out.sort((a, b) => order.get(a.id)! - order.get(b.id)!);
}

/** Periods with Hijri bounds; an open-ended period runs to `max`. */
export function timelinePeriods(lang: Lang, max: number) {
  return realNodes
    .filter((n) => n.class === "period" && n.span)
    .map((n) => {
      const from = hijriYearOf(n)!;
      const endNode = n.data.end ? { span: { earliest: n.span!.latest }, data: { start: n.data.end } } : null;
      const to = endNode ? hijriYearOf(endNode)! : max;
      return { id: n.id, href: href(lang, n.id), label: labelOf(n, lang), from, to };
    })
    .filter((p) => p.to > p.from);
}

/** CE century ticks on the Hijri scale (the secondary reading). */
export function ceTicks(min: number, max: number): { y: number; ce: number }[] {
  const out: { y: number; ce: number }[] = [];
  for (let ce = 500; ce <= 2100; ce += 100) {
    const h = civilToHijri(ce < 1583 ? "julian" : "gregorian", { y: ce, m: 1, d: 1 }).date;
    const y = h.y + (h.m - 1) / 12;
    if (y >= min && y <= max) out.push({ y, ce });
  }
  return out;
}
