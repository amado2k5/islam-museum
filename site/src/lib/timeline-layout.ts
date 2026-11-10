// Pure layout for the Hijri timeline (Part 3, C.2), shared by the build (SSR SVG) and the browser (zoom re-layout).
// Years are decimal Hijri years on a continuous scale where year 0 is 1 BH (the Hijri calendar has no year 0).
export interface TlEvent { id: string; href: string; label: string; date: string; y: number; s: string }
export interface TlMarker { y: number; x: number; lane: number; r: number; items: TlEvent[] }
export interface TlBand { id: string; href: string; label: string; from: number; to: number; row: number; x0: number; x1: number }

export const W = 1000;
export const xOf = (y: number, min: number, max: number, rtl: boolean) => { const t = (Math.min(Math.max(y, min), max) - min) / (max - min); return (rtl ? 1 - t : t) * W; };
// Hijri era marks per language (the same forms as ERA in dates.ts, kept here so the browser bundle stays free of the converter).
const HIJRI_ERA: Record<string, { ah: string; bh: string }> = { ar: { ah: "هـ", bh: "ق.هـ" }, en: { ah: "AH", bh: "BH" }, ur: { ah: "ھ", bh: "قبل ہجرت" } };
export const yearLabel = (y: number, lang: string) => { const e = HIJRI_ERA[lang] ?? HIJRI_ERA.en; return y < 1 ? `${1 - y} ${e.bh}` : `${y} ${e.ah}`; };

/** One marker per Hijri year, stacked into lanes so neighbours do not overlap; a marker's radius grows with its count. */
export function layoutMarkers(events: TlEvent[], min: number, max: number, rtl: boolean, gap = 7): TlMarker[] {
  const buckets = new Map<number, TlEvent[]>();
  for (const e of events) { const k = Math.floor(e.y); (buckets.get(k) ?? buckets.set(k, []).get(k)!).push(e); }
  const ms: TlMarker[] = [...buckets.entries()].map(([y, items]) => ({ y, x: xOf(y + 0.5, min, max, rtl), lane: 0, r: 3 + Math.min(4, Math.log2(items.length)), items: items.sort((a, b) => a.y - b.y) }));
  ms.sort((a, b) => a.x - b.x);
  const last: number[] = [];
  for (const m of ms) {
    let lane = last.findIndex((lx) => m.x - lx >= gap);
    if (lane === -1) { lane = last.length; last.push(m.x); } else last[lane] = m.x;
    m.lane = lane;
  }
  return ms;
}

/** Era bands under the axis, in rows so overlapping periods stay readable. */
export function layoutBands(periods: Omit<TlBand, "row" | "x0" | "x1">[], min: number, max: number, rtl: boolean): TlBand[] {
  const rows: number[] = [];
  const out: TlBand[] = [];
  for (const p of [...periods].sort((a, b) => a.from - b.from)) {
    let row = rows.findIndex((end) => p.from >= end - 0.5);
    if (row === -1) { row = rows.length; rows.push(p.to); } else rows[row] = p.to;
    const a = xOf(p.from, min, max, rtl), b = xOf(p.to, min, max, rtl);
    out.push({ ...p, row, x0: Math.min(a, b), x1: Math.max(a, b) });
  }
  return out;
}
