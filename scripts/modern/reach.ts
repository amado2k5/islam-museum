// Modern Islam Browser (docs/plan/26 section 4.6): the reach index. Not a ranking by taste: a score computed from
// cited inputs on the record (honours, certifications, chart positions, dated platform figures, Wikipedia languages,
// press items, cover versions), with the weights of docs/modern-islam/taxonomy.yaml and the formula version printed.
import { taxonomy, type RecordLike } from "./sections.js";

export interface ReachInputs {
  honours: number; certified: number; chart: number; reach: number; wikipedia: number; press: number; covers: number;
}
export interface ReachScore { score: number; inputs: ReachInputs; version: number }

const W = taxonomy.reach_index.weights;
const cap = (n: number, limit: number) => Math.min(n, limit);
const round = (n: number) => Math.round(n * 100) / 100;

/** The score of one record, or null when it has no scorable input (such a record is not listed). */
export function reachScore(entity: RecordLike, awardsById: ReadonlyMap<string, RecordLike> = new Map()): ReachScore | null {
  const honours: any[] = entity.honours ?? [];
  const isChart = (h: any) => awardsById.get(h?.award)?.kind === "chart";

  let honourPoints = 0;
  let certifiedPoints = 0;
  let chartPoints = 0;
  for (const h of honours) {
    if (!h) continue;
    if (h.result === "certified") {
      const byLevel = W.certified ?? {};
      certifiedPoints += Number(byLevel[h.level] ?? byLevel.gold ?? 0) || 0;
    } else if (h.result === "ranked" && isChart(h)) {
      const pos = Number(h.position ?? Infinity);
      chartPoints += pos <= 10 ? Number(W.chart?.top10 ?? 8) : pos <= 40 ? Number(W.chart?.top40 ?? 4) : Number(W.chart?.charted ?? 2);
    } else if (h.result === "won") {
      honourPoints += Number(W.honour_won ?? 10);
    } else {
      honourPoints += Number(W.honour_nominated ?? 4);
    }
  }
  honourPoints = cap(honourPoints, Number(W.honours_cap ?? 40));
  certifiedPoints = cap(certifiedPoints, Number(W.certified?.cap ?? 30));
  chartPoints = cap(chartPoints, Number(W.chart?.cap ?? 16));

  const largest = new Map<string, number>();
  for (const r of entity.reach ?? []) {
    if (!r || typeof r.value !== "number" || r.value <= 0) continue;
    largest.set(r.platform, Math.max(largest.get(r.platform) ?? 0, r.value));
  }
  const perPlatform = [...largest.values()].map((v) => Math.log10(v) * Number(W.reach_log10_per_platform ?? 1)).sort((a, b) => b - a);
  const reachPoints = cap(perPlatform.slice(0, Number(W.reach_platforms_max ?? 3)).reduce((s, v) => s + v, 0), Number(W.reach_cap ?? 24));

  const wikipediaPoints = cap((entity.footprint?.wikipedia?.languages ?? []).length * Number(W.wikipedia_language ?? 1), Number(W.wikipedia_cap ?? 15));
  const pressPoints = cap((entity.footprint?.press ?? []).length * Number(W.press_item ?? 1), Number(W.press_cap ?? 10));
  const covers = (entity.relations ?? []).filter((r: any) => r?.type === "version_of" || r?.type === "has_version").length;
  const coverPoints = cap(covers * Number(W.cover_version ?? 1), Number(W.cover_cap ?? 5));

  const inputs: ReachInputs = {
    honours: round(honourPoints), certified: round(certifiedPoints), chart: round(chartPoints), reach: round(reachPoints),
    wikipedia: round(wikipediaPoints), press: round(pressPoints), covers: round(coverPoints),
  };
  const score = round(Object.values(inputs).reduce((s, v) => s + v, 0));
  if (score <= 0) return null;
  return { score, inputs, version: taxonomy.reach_index.version };
}

/** Which records a list scores: songs, albums, websites, channels, books (docs/plan/26 section 4.1). */
export const REACH_LISTS: Record<string, (entity: RecordLike) => boolean> = {
  songs: (e) => e.class === "work" && e.kind === "song",
  albums: (e) => e.class === "work" && e.kind === "album",
  websites: (e) => e.class === "work" && ["website", "online-library", "app"].includes(e.kind),
  channels: (e) => e.class === "listing" && ["channel", "tv-channel", "radio-station", "podcast", "media"].includes(e.kind),
  books: (e) => e.class === "work" && e.kind === "book",
};

const releaseYear = (e: RecordLike): number => {
  const d = e.composed ?? e.launched ?? e.released ?? e.founded;
  const y = Number(String(d?.edtf ?? "9999").slice(0, 4));
  return Number.isFinite(y) ? y : 9999;
};

export interface ReachItem { id: string; score: number; inputs: ReachInputs }

/** The ordered index for one list: highest score first, ties by release date (oldest first), then id. */
export function reachIndex(list: string, entities: RecordLike[], awardsById: ReadonlyMap<string, RecordLike> = new Map(), limit = 1000): ReachItem[] {
  const pick = REACH_LISTS[list];
  if (!pick) throw new Error(`unknown reach list "${list}" (one of ${Object.keys(REACH_LISTS).join(", ")})`);
  const scored: (ReachItem & { year: number })[] = [];
  for (const e of entities) {
    if (!pick(e) || !e.id) continue;
    const s = reachScore(e, awardsById);
    if (s) scored.push({ id: e.id, score: s.score, inputs: s.inputs, year: releaseYear(e) });
  }
  return scored
    .sort((a, b) => b.score - a.score || a.year - b.year || a.id.localeCompare(b.id))
    .slice(0, limit)
    .map(({ year: _y, ...item }) => item);
}

export const reachFormula = () => ({ version: taxonomy.reach_index.version, weights: taxonomy.reach_index.weights, tie_break: taxonomy.reach_index.tie_break, notice: taxonomy.reach_index.notice });
