// Builds and checks the Atlas daily schedule. Building is a build-time step (tools/build-pack.ts); checking is the
// proof, run by the tests and by the validator, that every day of the schedule is a fair, playable game.
import { Rng } from "@im/kernel/prng";
import type { AtlasPack, Category, PackPlace, PackRound } from "./pack";
import { ROUNDS_PER_GAME } from "./rules";

/**
 * The five slots of a daily game. Four are fixed and the fifth takes whichever category has most left.
 * The mix follows the museum's records as counted on 25 November 2026: precisely located, dated civic events are
 * plentiful only in about a hundred places, so one a day is what a year can carry without sending players to the
 * same few cities every week; births and military events are spread over three to four times as many places.
 */
export const DAILY_SLOTS: Array<Category | "any"> = ["civic", "people", "military", "people", "any"];
/** The least a daily game holds of each category. */
export const DAILY_MINIMUM: Record<Category, number> = { civic: 1, people: 2, military: 1 };
/** How many of a day's slots are fixed to each category. */
const FIXED_SLOTS: Record<Category, number> = { civic: 0, people: 0, military: 0 };
for (const slot of DAILY_SLOTS) if (slot !== "any") FIXED_SLOTS[slot]++;
/**
 * How much each category's free places count when the free slot is given out. Battles are the most widely spread of
 * the three, so on places alone they would take the free slot every day. Counted for less, they leave it to a person
 * whenever the places for one can be spared. How much less a year can bear depends on the records, so the pack
 * builder looks for the lowest weight that still lays out a whole year and writes down the one it used.
 */
export type FreeSlotWeight = Record<Category, number>;
export const EVEN_WEIGHT: FreeSlotWeight = { civic: 1, people: 1, military: 1 };
/** A place is not asked again within this many days. */
export const PLACE_COOLDOWN_DAYS = 14;
/** A daily game spans at least this many museum regions. */
export const MIN_REGIONS_PER_DAY = 3;

export interface ScheduleReport {
  days: number;
  roundsUsed: number;
  placesUsed: number;
  reusedRounds: number;
  problems: string[];
}

/**
 * Lays out `days` daily games from the pack's rounds. Deterministic in (rounds, places, seed, weight).
 * No round is used twice, no place returns within the cooldown, every day has five different places in at least
 * three regions and the category minimum, and within a day the better-known places come first.
 */
export function buildSchedule(places: PackPlace[], rounds: PackRound[], days: number, seed: string, weight: FreeSlotWeight = EVEN_WEIGHT): number[][] {
  const rng = new Rng(`atlas:schedule:${seed}`);
  // A fixed random rank per round breaks ties, so the layout is reproducible and not alphabetical.
  const rank = rounds.map(() => rng.u32());
  const used = new Set<number>();
  const left: Record<Category, number> = { civic: 0, people: 0, military: 0 };
  // Rounds still unused at each place, per category. Places with many rounds are drawn on first, so that the places
  // with only one or two are still there to fill the days when the big cities are resting.
  const leftAt = new Map<string, number>();
  const key = (c: Category, place: number) => `${c}:${place}`;
  rounds.forEach((r) => {
    left[r.category]++;
    leftAt.set(key(r.category, r.place), (leftAt.get(key(r.category, r.place)) ?? 0) + 1);
  });
  const lastDayOfPlace = new Map<number, number>();
  const out: number[][] = [];
  for (let day = 0; day < days; day++) {
    const picked: number[] = [];
    const dayPlaces = new Set<number>();
    const dayRegions = new Set<string>();
    for (let slot = 0; slot < DAILY_SLOTS.length; slot++) {
      const want = DAILY_SLOTS[slot]!;
      const slotsLeft = DAILY_SLOTS.length - slot - 1;
      // The free slot goes to the category that can best afford it today: the one with the most places that may be
      // asked now, less the places its own fixed slots will want over the next cooldown. What runs out, late in a
      // year, is not rounds but places that are not resting; taking simply whichever category had most rounds left
      // spent one category's places on the free slot until its fixed slots found none. If the category chosen has
      // nothing that may be asked today, the next one is tried.
      const placesFree = (c: Category): number => {
        const free = new Set<number>();
        for (let i = 0; i < rounds.length; i++) {
          const r = rounds[i]!;
          if (r.category !== c || used.has(i) || dayPlaces.has(r.place)) continue;
          const last = lastDayOfPlace.get(r.place);
          if (last === undefined || day - last >= PLACE_COOLDOWN_DAYS) free.add(r.place);
        }
        return (free.size - FIXED_SLOTS[c] * PLACE_COOLDOWN_DAYS) * weight[c];
      };
      const order: Category[] = want === "any" ? (Object.keys(left) as Category[]).map((c) => ({ c, n: placesFree(c) })).sort((x, y) => y.n - x.n || (x.c < y.c ? -1 : 1)).map((x) => x.c) : [want];
      let choice = -1;
      for (const category of order) {
        let best = -1;
        for (let i = 0; i < rounds.length; i++) {
          const r = rounds[i]!;
          if (r.category !== category || used.has(i) || dayPlaces.has(r.place)) continue;
          const last = lastDayOfPlace.get(r.place);
          if (last !== undefined && day - last < PLACE_COOLDOWN_DAYS) continue;
          // Keep the day able to reach its minimum number of regions.
          const region = places[r.place]!.region;
          if (dayRegions.size + (dayRegions.has(region) ? 0 : 1) + slotsLeft < MIN_REGIONS_PER_DAY) continue;
          const score = leftAt.get(key(category, r.place))!;
          if (score > best || (score === best && rank[i]! < rank[choice]!)) {
            best = score;
            choice = i;
          }
        }
        if (choice >= 0) break;
      }
      if (choice < 0) throw new Error(`schedule: no ${want} round left for day ${day}, slot ${slot}`);
      used.add(choice);
      const r = rounds[choice]!;
      left[r.category]--;
      leftAt.set(key(r.category, r.place), leftAt.get(key(r.category, r.place))! - 1);
      dayPlaces.add(r.place);
      dayRegions.add(places[r.place]!.region);
      lastDayOfPlace.set(r.place, day);
      picked.push(choice);
    }
    // Best-known place first, least-known last; ties keep slot order.
    picked.sort((a, b) => places[rounds[b]!.place]!.refs - places[rounds[a]!.place]!.refs);
    out.push(picked);
  }
  return out;
}

/** Checks every day of a pack's schedule against the rules above. An empty `problems` list is the proof. */
export function checkSchedule(pack: AtlasPack): ScheduleReport {
  const problems: string[] = [];
  const seenRound = new Map<number, number>();
  const lastDayOfPlace = new Map<number, number>();
  const placesUsed = new Set<number>();
  let reused = 0;
  pack.schedule.days.forEach((day, d) => {
    if (day.length !== ROUNDS_PER_GAME) problems.push(`day ${d}: ${day.length} rounds`);
    const dayPlaces = new Set<number>();
    const regions = new Set<string>();
    const cats: Record<string, number> = {};
    for (const i of day) {
      const r = pack.rounds[i];
      if (!r) {
        problems.push(`day ${d}: round index ${i} is not in the pack`);
        continue;
      }
      const p = pack.places[r.place];
      if (!p) {
        problems.push(`day ${d}: ${r.id} has no place`);
        continue;
      }
      if (seenRound.has(i)) {
        reused++;
        problems.push(`day ${d}: ${r.id} was already asked on day ${seenRound.get(i)}`);
      }
      seenRound.set(i, d);
      if (dayPlaces.has(r.place)) problems.push(`day ${d}: ${p.id} is the answer twice`);
      dayPlaces.add(r.place);
      const last = lastDayOfPlace.get(r.place);
      if (last !== undefined && last !== d && d - last < PLACE_COOLDOWN_DAYS) problems.push(`day ${d}: ${p.id} returns after ${d - last} days`);
      regions.add(p.region);
      cats[r.category] = (cats[r.category] ?? 0) + 1;
      placesUsed.add(r.place);
    }
    for (const i of day) {
      const r = pack.rounds[i];
      if (r) lastDayOfPlace.set(r.place, d);
    }
    if (regions.size < MIN_REGIONS_PER_DAY) problems.push(`day ${d}: only ${regions.size} regions`);
    for (const c of Object.keys(DAILY_MINIMUM) as Category[]) if ((cats[c] ?? 0) < DAILY_MINIMUM[c]) problems.push(`day ${d}: ${cats[c] ?? 0} ${c} rounds, needs at least ${DAILY_MINIMUM[c]}`);
  });
  return { days: pack.schedule.days.length, roundsUsed: seenRound.size, placesUsed: placesUsed.size, reusedRounds: reused, problems };
}
