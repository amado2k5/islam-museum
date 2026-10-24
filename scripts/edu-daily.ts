// Daily challenge schedule (docs/delegation/education-master-plan.md §5 E3, step 2). Writes
// site/public/edu/daily-schedule.json: 366 days (day 1 to day 366, a leap day included), five Century Challenge
// rounds a day. A round is an event with a date of at least year precision, a positive year, at least two sources and
// no `education.exclude` flag. The choice of events is a stable hash of their ids, not the clock and not a random
// number, so two builds of one commit write the same bytes. Who am I? rounds wait for authored clues.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { parse } from "yaml";
import { ROOT } from "./lib.js";

export const DAYS = 366;
export const ROUNDS = 5;
export const CHOICES = 4;
export const SCHEDULE_FILE = join(ROOT, "site", "public", "edu", "daily-schedule.json");

export interface PoolEvent { id: string; year: number; label: Record<string, string> }
export interface Round { id: string; label: Record<string, string>; year: number; century: number; choices: number[] }
export interface Schedule { version: 1; kind: "century"; days: { day: number; rounds: Round[] }[] }

/** FNV-1a over the id's code points: a stable 32-bit hash with no clock and no randomness. */
export function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (const c of s) {
    h ^= c.codePointAt(0)!;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** Events eligible for the Century Challenge, sorted by id. */
export function centuryPool(dir = join(ROOT, "data", "event")): PoolEvent[] {
  const out: PoolEvent[] = [];
  for (const f of readdirSync(dir).sort()) {
    if (!f.endsWith(".yaml") || f.startsWith("_")) continue;
    const d = parse(readFileSync(join(dir, f), "utf8"));
    if (!d || d.education?.exclude === true) continue;
    const start = d.date?.start;
    if (!start?.edtf || !["year", "month", "day"].includes(start.precision)) continue;
    if ((d.sources ?? []).length < 2) continue;
    const m = /^(\d{4})/.exec(String(start.edtf));
    if (!m) continue;
    const year = Number(m[1]);
    if (year < 1) continue;
    out.push({ id: d.id, year, label: d.label ?? {} });
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

const century = (year: number) => Math.ceil(year / 100);

export function buildSchedule(pool: PoolEvent[]): Schedule {
  if (pool.length < ROUNDS) throw new Error(`the Century Challenge pool holds ${pool.length} events; at least ${ROUNDS} are needed`);
  // Order the pool once by the hash of its ids; day d takes positions d*ROUNDS .. d*ROUNDS+ROUNDS-1, wrapping round the pool.
  const order = [...pool].sort((a, b) => fnv1a(a.id) - fnv1a(b.id) || a.id.localeCompare(b.id));
  const N = order.length;
  const at = (k: number) => order[((k % N) + N) % N];
  const days: Schedule["days"] = [];
  for (let d = 0; d < DAYS; d++) {
    const rounds: Round[] = [];
    for (let r = 0; r < ROUNDS; r++) {
      const k = d * ROUNDS + r;
      const e = at(k);
      const correct = century(e.year);
      const options = [correct];
      // Three distractors: the centuries of other pool events at fixed hash-ordered offsets; each must be new.
      for (let j = 1; options.length < CHOICES; j++) {
        if (j > N) throw new Error(`no ${CHOICES} distinct centuries for ${e.id}`);
        const c = century(at(k + j * 37 + 1).year);
        if (!options.includes(c)) options.push(c);
      }
      // Present the four choices in hash order of (id, century), so the correct answer is not always in one place.
      const choices = options.sort((a, b) => fnv1a(`${e.id}:${a}`) - fnv1a(`${e.id}:${b}`));
      rounds.push({ id: e.id, label: e.label, year: e.year, century: correct, choices });
    }
    days.push({ day: d + 1, rounds });
  }
  return { version: 1, kind: "century", days };
}

export function writeSchedule(file = SCHEDULE_FILE): Schedule {
  const schedule = buildSchedule(centuryPool());
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(schedule) + "\n");
  return schedule;
}

if (process.argv[1] && process.argv[1].endsWith("edu-daily.ts")) {
  const s = writeSchedule();
  console.log(`daily-schedule: ${s.days.length} days, ${s.days.reduce((n, d) => n + d.rounds.length, 0)} rounds -> ${SCHEDULE_FILE}`);
}
