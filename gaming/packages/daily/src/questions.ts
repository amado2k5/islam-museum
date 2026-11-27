// Five Questions: the day's quiz, built from the pack and the date alone. Every question is about one museum record
// and every answer option is a museum record (or a year), so every answer can be traced and read in the museum.
import type { PackFile } from "./pack";
import { dayNumber, rng, shuffle } from "./seed";

export type QuestionKind = "event-year" | "event-place" | "born-place" | "earliest";
export interface Question {
  kind: QuestionKind;
  /** The record the question is about (for "earliest", the answer's record). */
  subject: string;
  /** Record ids, or years for "event-year". */
  options: Array<string | number>;
  answer: number;
  /** Every record the question and its options draw on. */
  records: string[];
}
export const QUESTIONS_PER_DAY = 5;
const PLAN: QuestionKind[] = ["event-year", "event-place", "born-place", "earliest", "event-year"];

export function quiz(pack: PackFile, seed: string): Question[] {
  const r = rng(`five-questions:v${pack.version}:${seed}`);
  const used = new Set<string>();
  const fresh = <T extends { id: string }>(list: T[], ok: (x: T) => boolean = () => true): T => {
    for (let i = 0; i < 200; i++) {
      const x = list[Math.floor(r() * list.length)]!;
      if (!used.has(x.id) && ok(x)) { used.add(x.id); return x; }
    }
    throw new Error("the pack has too few records for a quiz");
  };
  const placesOfEvents = [...new Set(pack.events.map((e) => e.place))].sort();
  const otherPlaces = (right: string, n: number): string[] => shuffle(r, placesOfEvents.filter((p) => p !== right)).slice(0, n);
  const out: Question[] = [];
  for (const kind of PLAN) {
    if (kind === "event-year") {
      const e = fresh(pack.events);
      const years = new Set([e.y]);
      while (years.size < 4) {
        const d = (15 + Math.floor(r() * 140)) * (r() < 0.5 ? -1 : 1);
        const y = e.y + d;
        if (y > 500 && y <= 2025 && [...years].every((x) => Math.abs(x - y) >= 10)) years.add(y);
      }
      const options = [...years].sort((a, b) => a - b);
      out.push({ kind, subject: e.id, options, answer: options.indexOf(e.y), records: [e.id] });
    } else if (kind === "event-place") {
      const e = fresh(pack.events);
      const options = shuffle(r, [e.place, ...otherPlaces(e.place, 3)]);
      out.push({ kind, subject: e.id, options, answer: options.indexOf(e.place), records: [e.id, ...options] });
    } else if (kind === "born-place") {
      const p = fresh(pack.persons, (x) => x.place !== null);
      const options = shuffle(r, [p.place!, ...otherPlaces(p.place!, 3)]);
      out.push({ kind, subject: p.id, options, answer: options.indexOf(p.place!), records: [p.id, ...options] });
    } else {
      const four: PackFile["persons"] = [];
      while (four.length < 4) four.push(fresh(pack.persons, (x) => four.every((o) => Math.abs(o.born - x.born) >= 40)));
      const options = shuffle(r, four.map((p) => p.id));
      const first = four.reduce((a, b) => (b.born < a.born ? b : a));
      out.push({ kind, subject: first.id, options, answer: options.indexOf(first.id), records: [...options] });
    }
  }
  return out;
}
export const dailyQuiz = (pack: PackFile, date: string) => quiz(pack, `day-${dayNumber(date)}`);
