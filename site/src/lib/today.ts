// "This day" index (Part 3, C.1): events keyed by Hijri month/day and by Gregorian month/day, built once from the graph.
// Only day-precision dates qualify; a day with no event falls back to the nearest day that has one (labelled as such).
import { civilToHijri } from "../../../scripts/hijri/convert";
import { href, labelOf, realNodes } from "./graph";
import { formatDate } from "./dates";
import type { Lang } from "./i18n";

export interface DayItem { m: number; d: number; id: string; href: string; label: string; date: string }
export interface TodayIndex { h: DayItem[]; g: DayItem[] }

const DAY = /^(-?\d{4})-(\d{2})-(\d{2})/;

const cache = new Map<Lang, TodayIndex>();
/** Day-dated events, in both calendars, with display strings in the given language. */
export function todayIndex(lang: Lang): TodayIndex {
  if (cache.has(lang)) return cache.get(lang)!;
  const h: DayItem[] = [], g: DayItem[] = [];
  for (const n of realNodes) {
    if (n.class !== "event") continue;
    const s = n.data.date?.start;
    if (!s) continue;
    const item = (m: number, d: number): DayItem => ({ m, d, id: n.id, href: href(lang, n.id), label: labelOf(n, lang), date: formatDate(s, lang).text });
    const hm = typeof s.hijri === "string" && s.hijri.match(DAY);
    if (hm) h.push(item(Number(hm[2]), Number(hm[3])));
    const gm = typeof s.edtf === "string" && s.edtf.match(DAY);
    if (gm && Number(gm[1]) > 0) g.push(item(Number(gm[2]), Number(gm[3])));
  }
  const byDay = (a: DayItem, b: DayItem) => a.m - b.m || a.d - b.d || a.id.localeCompare(b.id);
  h.sort(byDay); g.sort(byDay);
  const idx = { h, g };
  cache.set(lang, idx);
  return idx;
}

// Day-of-year positions for the "nearest day with events" fallback (tabular Hijri month lengths; a plain Gregorian year).
const H_LEN = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30];
const G_LEN = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export const dayOfYear = (cal: "h" | "g", m: number, d: number) => (cal === "h" ? H_LEN : G_LEN).slice(0, m - 1).reduce((a, b) => a + b, 0) + d;
const circ = (cal: "h" | "g", a: number, b: number) => { const y = cal === "h" ? 354 : 366; const x = Math.abs(a - b); return Math.min(x, y - x); };

/** Events on this day, or on the nearest day that has any (exact=false), by calendar. */
export function onThisDay(list: DayItem[], cal: "h" | "g", m: number, d: number): { items: DayItem[]; exact: boolean } {
  const exact = list.filter((x) => x.m === m && x.d === d);
  if (exact.length || !list.length) return { items: exact, exact: true };
  const me = dayOfYear(cal, m, d);
  let best = list[0], bd = Infinity;
  for (const x of list) { const dist = circ(cal, me, dayOfYear(cal, x.m, x.d)); if (dist < bd) { bd = dist; best = x; } }
  return { items: list.filter((x) => x.m === best.m && x.d === best.d), exact: false };
}

/** The build day in both calendars (the page is static; the browser refreshes it to the viewer's day). */
export function buildDay() {
  const now = new Date();
  const g = { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
  const h = civilToHijri("gregorian", g).date;
  return { g, h };
}
