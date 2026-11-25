// Atlas rules: pure functions over plain data. No rendering, no clock, no storage, no randomness of its own.
// The same pack, date and guesses give the same result in every language and on every machine.
import { Rng } from "@im/kernel/prng";
import { centuryCE, distanceKm } from "./geo";
import type { AtlasPack, PackRound, Precision } from "./pack";

export const RULES_VERSION = 1;
export const ROUNDS_PER_GAME = 5;
export const MAX_ROUND_POINTS = 1000;

/** A guess within this distance of the record's coordinates scores full marks: the record itself is no more exact than this. */
export const TOLERANCE_KM: Record<Precision, number> = { site: 15, locality: 40 };
/** Beyond the tolerance, points fall off exponentially with this scale. */
export const FALLOFF_KM = 450;
/** What the region hint costs, in points off that round. */
export const REGION_HINT_COST = 150;

/**
 * Points for a guess `km` from the answer.
 * Full marks inside the tolerance; then 1000·exp(−(km − tolerance) / 450), rounded: about 368 at 450 km past the
 * tolerance, about 108 at 1,000 km, 12 at 2,000 km, and 0 from about 3,400 km.
 */
export function distancePoints(km: number, precision: Precision): number {
  const beyond = Math.max(0, km - TOLERANCE_KM[precision]);
  return Math.round(MAX_ROUND_POINTS * Math.exp(-beyond / FALLOFF_KM));
}

export type GameMode = "daily" | "practice";

export interface RoundResult {
  round: number;
  guessLat: number;
  guessLon: number;
  km: number;
  points: number;
  regionHint: boolean;
  /** The century the player estimated (Common Era), or null if they did not. */
  centuryGuess: number | null;
  /** Centuries between the estimate and the record's year; null without an estimate. */
  centuryError: number | null;
}

export interface AtlasState {
  rules: number;
  packDigest: string;
  mode: GameMode;
  /** UTC date of a daily game (YYYY-MM-DD), or the seed text of a practice game. */
  key: string;
  /** Indexes into pack.rounds, in play order. */
  rounds: number[];
  /** Index of the round being played; equals rounds.length when the game is over. */
  at: number;
  /** Whether the region hint has been taken for the round being played. */
  regionHint: boolean;
  results: RoundResult[];
}

export type AtlasCommand = { type: "hint-region" } | { type: "guess"; lat: number; lon: number; century: number | null };

/** Whole days from one UTC date to another (both YYYY-MM-DD). */
export function daysBetween(fromIso: string, toIso: string): number {
  const ms = (iso: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!m) throw new RangeError(`not a date: ${iso}`);
    return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  };
  return Math.round((ms(toIso) - ms(fromIso)) / 86_400_000);
}

/** The five rounds of the daily challenge for a UTC date. Dates outside the schedule wrap around it, a year apart. */
export function dailyRounds(pack: AtlasPack, dateIso: string): number[] {
  const n = pack.schedule.days.length;
  if (n === 0) throw new RangeError("the pack has no schedule");
  const d = daysBetween(pack.schedule.start, dateIso);
  return [...pack.schedule.days[((d % n) + n) % n]!];
}

/** Five rounds for a practice game: any five distinct places, one per daily slot where the pack allows, from a seed. */
export function practiceRounds(pack: AtlasPack, seed: string, filter?: (r: PackRound) => boolean): number[] {
  const rng = new Rng(`atlas:practice:${pack.digest}:${seed}`);
  const pool = pack.rounds.map((_, i) => i).filter((i) => !filter || filter(pack.rounds[i]!));
  rng.shuffle(pool);
  const picked: number[] = [];
  const places = new Set<number>();
  for (const i of pool) {
    const place = pack.rounds[i]!.place;
    if (places.has(place)) continue;
    places.add(place);
    picked.push(i);
    if (picked.length === ROUNDS_PER_GAME) break;
  }
  if (picked.length < ROUNDS_PER_GAME) throw new RangeError("not enough rounds for a practice game with this filter");
  return picked;
}

export function newGame(pack: AtlasPack, mode: GameMode, key: string, rounds: number[]): AtlasState {
  return { rules: RULES_VERSION, packDigest: pack.digest, mode, key, rounds: [...rounds], at: 0, regionHint: false, results: [] };
}

export const isOver = (s: AtlasState): boolean => s.at >= s.rounds.length;
export const totalPoints = (s: AtlasState): number => s.results.reduce((sum, r) => sum + r.points, 0);
export const maxPoints = (s: AtlasState): number => s.rounds.length * MAX_ROUND_POINTS;

/** Applies one command and returns the new state. An illegal command throws; the interface never offers one. */
export function step(pack: AtlasPack, state: AtlasState, cmd: AtlasCommand): AtlasState {
  if (state.packDigest !== pack.digest) throw new Error("this game was started with a different content pack");
  if (isOver(state)) throw new Error("the game is over");
  if (cmd.type === "hint-region") {
    if (state.regionHint) throw new Error("the region hint is already shown");
    return { ...state, regionHint: true };
  }
  if (!Number.isFinite(cmd.lat) || !Number.isFinite(cmd.lon) || Math.abs(cmd.lat) > 90) throw new RangeError("a guess needs a latitude and a longitude");
  const round = pack.rounds[state.rounds[state.at]!]!;
  const place = pack.places[round.place]!;
  const km = distanceKm(cmd.lat, cmd.lon, place.lat, place.lon);
  const base = distancePoints(km, place.precision);
  const points = Math.max(0, base - (state.regionHint ? REGION_HINT_COST : 0));
  const century = cmd.century === null ? null : Math.trunc(cmd.century);
  const result: RoundResult = {
    round: state.rounds[state.at]!,
    guessLat: cmd.lat,
    guessLon: cmd.lon,
    km,
    points,
    regionHint: state.regionHint,
    centuryGuess: century,
    centuryError: century === null ? null : Math.abs(century - centuryCE(round.year)),
  };
  return { ...state, at: state.at + 1, regionHint: false, results: [...state.results, result] };
}

/** How many of the player's century estimates were exactly right, out of how many they made. */
export function centuryTally(s: AtlasState): { right: number; made: number } {
  let right = 0;
  let made = 0;
  for (const r of s.results) {
    if (r.centuryError === null) continue;
    made++;
    if (r.centuryError === 0) right++;
  }
  return { right, made };
}

/**
 * A result to share that gives nothing away: the date, the total, and one mark per round by score band.
 * It names no place and no record, and it is the same text in every language except the title the caller puts on it.
 */
export function shareMarks(s: AtlasState): string {
  return s.results.map((r) => (r.points >= 900 ? "●" : r.points >= 500 ? "◐" : r.points > 0 ? "○" : "·")).join(" ");
}
