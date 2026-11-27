// Deterministic choice from a date: the same day gives every player the same puzzle, with no server.
export function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
/** A small seeded generator (mulberry32). */
export function rng(seed: number | string): () => number {
  let a = typeof seed === "string" ? hash(seed) : seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const pick = <T>(r: () => number, list: readonly T[]): T => list[Math.floor(r() * list.length)]!;
export function shuffle<T>(r: () => number, list: readonly T[]): T[] {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}
/** Days from 1970-01-01 for a YYYY-MM-DD date (UTC). */
export const dayNumber = (date: string): number => Math.floor(Date.parse(`${date}T00:00:00Z`) / 86_400_000);
export const isDate = (s: string | null): s is string => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`));
/** The puzzle number shown to players: day 1 is the first day the games were live. */
export const FIRST_DAY = "2026-11-26";
export const puzzleNumber = (date: string): number => dayNumber(date) - dayNumber(FIRST_DAY) + 1;
