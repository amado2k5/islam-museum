// Museum Cards: «اليوم عن» daily series. Build-time only.
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { repoPath } from "./paths";

export interface DailyEntry { card: string; prompt: { ar: string; en: string } }
export interface DailySeries { series: string; title: { ar: string; en: string }; entries: DailyEntry[] }

let cache: DailySeries | null = null;
export function loadDaily(): DailySeries {
  if (cache) return cache;
  cache = parse(readFileSync(repoPath("cards/daily/al-yaum-an.yaml"), "utf8")) as DailySeries;
  return cache;
}

/** Deterministic pick for a given date (day-of-year rotation). */
export function dailyEntry(date: Date = new Date()): DailyEntry {
  const s = loadDaily();
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const doy = Math.floor((date.getTime() - start) / 86400000);
  return s.entries[doy % s.entries.length];
}
