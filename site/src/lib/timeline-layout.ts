// Pure layout for the Hijri timeline (Part 3, C.2), shared by the build (SSR SVG) and the browser (zoom re-layout).
// Years are decimal Hijri years on a continuous scale where year 0 is 1 BH (the Hijri calendar has no year 0).
export interface TlEvent { id: string; href: string; label: string; date: string; y: number; s: string }
export interface TlMarker { y: number; x: number; lane: number; r: number; items: TlEvent[] }
export interface TlBand { id: string; href: string; label: string; from: number; to: number; row: number; x0: number; x1: number }

export const W = 1000;
export const xOf = (y: number, min: number, max: number, rtl: boolean) => { const t = (Math.min(Math.max(y, min), max) - min) / (max - min); return (rtl ? 1 - t : t) * W; };
export const yearLabel = (y: number, lang: "ar" | "en") => (y < 1 ? `${1 - y} ${lang === "ar" ? "ق.هـ" : "BH"}` : `${y} ${lang === "ar" ? "هـ" : "AH"}`);

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
