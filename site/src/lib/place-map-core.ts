// Pure helpers for the Place wing map (no graph, no file access), so they can be unit-tested on their own
// (scripts/place-map.test.ts). The browser script site/public/shell/place-map.js repeats `activityState`, `tierOf`,
// `searchKey` and `shardOf` in plain JavaScript; the test runs both copies on the same inputs, so they cannot drift apart.

/** A span of civil years, both ends included. */
export type Interval = [number, number];

/**
 * Sorts and merges spans of years into as few as possible. Spans that overlap, touch, or lie within `gap` years of
 * each other become one; if more than `max` remain, the smallest gaps are closed first. Returned flat
 * ([from, to, from, to, ...]) because that is how it travels in the JSON.
 */
export function mergeIntervals(spans: Interval[], gap = 5, max = 6): number[] {
  const sorted = spans.filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b) && b >= a).map(([a, b]) => [a, b] as Interval).sort((x, y) => x[0] - y[0] || x[1] - y[1]);
  const out: Interval[] = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (last && s[0] <= last[1] + gap) last[1] = Math.max(last[1], s[1]);
    else out.push(s);
  }
  while (out.length > max) {
    let at = 1;
    for (let i = 2; i < out.length; i++) if (out[i][0] - out[i - 1][1] < out[at][0] - out[at - 1][1]) at = i;
    out[at - 1][1] = out[at][1];
    out.splice(at, 1);
  }
  return out.flat();
}

const MS_PER_YEAR = 365.2425 * 86_400_000;
/** The calendar year an instant falls in, from the graph's decimal year (scripts/lib.ts `msToYear`, undone exactly). */
const yearAt = (decimal: number, nudgeMs: number) => new Date((decimal - 1970) * MS_PER_YEAR + nudgeMs).getUTCFullYear();
/**
 * A stored span as the calendar years it covers, both ends included. The graph keeps each bound as a decimal year
 * computed from the first and the last millisecond of the date, so a record dated "624" ends a hair before 625.0, or
 * a hair after it (the decimal scale drifts by up to a day and a half against the calendar). Rounding the end up
 * therefore kept a place lit for a year after its record ended. The bound is turned back into its instant instead and
 * the calendar year is read from that; a minute's nudge inwards keeps a bound that sits exactly on midnight in its own year.
 */
export const wholeYears = (span: { earliest: number; latest: number }): Interval => {
  const first = yearAt(span.earliest, 60_000);
  return [first, Math.max(first, yearAt(span.latest, -60_000))];
};

export const UNDATED = 0, NOT_YET = 1, EARLIER = 2, ACTIVE = 3;
/**
 * What a place is in a given year, from its merged spans: ACTIVE (a dated record tied to it covers the year),
 * EARLIER (it has dated records, all before the year, or between two of its spans), NOT_YET (its first record is later),
 * UNDATED (nothing tied to it carries a date). A place is never hidden: the state only sets how bright its marker is.
 */
export function activityState(iv: number[], year: number): number {
  if (!iv.length) return UNDATED;
  if (year < iv[0]) return NOT_YET;
  for (let i = 0; i < iv.length; i += 2) if (year >= iv[i] && year <= iv[i + 1]) return ACTIVE;
  return EARLIER;
}

/** Marker size class from the number of records tied to a place: 0 (up to 2), 1 (3 to 29), 2 (30 and more). */
export const tierOf = (n: number): number => (n >= 30 ? 2 : n >= 3 ? 1 : 0);

/**
 * The slider's range, taken from the data and never typed in: from the first percentile of the start years (so that
 * a handful of very early records, 2000 BCE and the like, do not stretch the bar over centuries with nothing in them)
 * to the latest end year. Records before the lower bound still count: they are simply already "earlier" there.
 */
export function yearBounds(starts: number[], ends: number[]): { min: number; max: number } {
  if (!starts.length) return { min: 570, max: 2000 };
  const s = [...starts].sort((a, b) => a - b);
  const min = Math.floor(s[Math.floor(s.length * 0.01)] / 10) * 10;
  const max = Math.max(...ends, min + 10);
  return { min, max };
}

/** Strips Arabic marks and unifies the letter forms a reader does not type the same way twice; lower-cases Latin. For matching, never for display. */
export function searchKey(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[̀-ًͯ-ٰٟـ⁦-⁩]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/[ىی]/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ک/g, "ك")
    .replace(/[ؤ]/g, "و")
    .replace(/[ئ]/g, "ي")
    .replace(/['’ʿʾ`\-]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** How many files the per-place and per-record data is spread over. A record's file is found from its own name, so adding a record changes one file. */
export const SHARDS = 128;
/** FNV-1a over the characters of a slug or id, modulo SHARDS. */
export function shardOf(key: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0) % SHARDS;
}
/** A shard's number as it appears in the file name: two hexadecimal digits. */
export const shardName = (i: number) => i.toString(16).padStart(2, "0");
