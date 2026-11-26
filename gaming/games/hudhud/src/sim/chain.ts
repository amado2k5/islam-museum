// The chain: a machine as a row of parts, each of which takes one kind of motion and gives another. Something is
// set going at one end; if every part hands on what the next one takes, it arrives at the other end and the machine
// has done its work. If not, it stops at the first place where the hand-over fails, and the player sees where.
// Pure rules over plain data: nothing here draws. The elephant clock quest (./clock, content/clock) is built on it.
//
// What it is for first: al-Jazari's elephant clock. The museum's record (invention/elephant-clock, after the
// Metropolitan Museum's catalogue entry) says that every half hour a rider and a bird move and a ball passes from a
// falcon to a dragon to a vessel with a gong, and that the balls gathered tell the time elapsed. The row of parts
// and the idea of putting them in order are the game's own; what passes between the parts in a quest must be
// written from the record and entered in the review ledger before it is shown.
import type { Rng } from "@im/kernel/prng";

export interface Part {
  id: string;
  /** The kind of motion this part answers to. */
  takes: string;
  /** The kind of motion it hands on. */
  gives: string;
}
export interface ChainPuzzle {
  /** What sets the machine going. */
  start: string;
  /** What must come out of the last part for the machine to have worked. */
  goal: string;
  /** The parts, by id, in the places they stand in now; null is an empty place. */
  places: (string | null)[];
  /** Every part there is: those standing in places and those lying spare. */
  parts: Part[];
}
export interface Run {
  /** The parts that moved, in order, with what each took and gave. */
  moved: { place: number; part: string; took: string; gave: string }[];
  /** How it ended: the work was done; a place was empty; a part did not answer to what reached it; or the last part
   * gave something other than the goal. */
  end: "done" | "empty" | "idle" | "wrong";
  /** The place where it stopped (the last place, if the work was done). */
  at: number;
  /** What was in the air when it stopped. */
  carrying: string;
}

const partOf = (p: ChainPuzzle, id: string): Part | undefined => p.parts.find((x) => x.id === id);

/** Sets the machine going and follows the motion from place to place. */
export function run(p: ChainPuzzle): Run {
  const moved: Run["moved"] = [];
  let carrying = p.start;
  for (let place = 0; place < p.places.length; place++) {
    const id = p.places[place];
    const part = id ? partOf(p, id) : undefined;
    if (!part) return { moved, end: "empty", at: place, carrying };
    if (part.takes !== carrying) return { moved, end: "idle", at: place, carrying };
    moved.push({ place, part: part.id, took: carrying, gave: part.gives });
    carrying = part.gives;
  }
  const last = p.places.length - 1;
  return { moved, end: carrying === p.goal ? "done" : "wrong", at: last, carrying };
}

/** The parts lying spare: not standing in any place. */
export const spare = (p: ChainPuzzle): Part[] => p.parts.filter((x) => !p.places.includes(x.id));

/** Two places change contents. Places out of range change nothing. */
export function swap(p: ChainPuzzle, a: number, b: number): ChainPuzzle {
  if (a === b || a < 0 || b < 0 || a >= p.places.length || b >= p.places.length) return p;
  const places = [...p.places];
  [places[a], places[b]] = [places[b]!, places[a]!];
  return { ...p, places };
}
/** A spare part is stood in a place; whatever stood there becomes spare. An unknown or standing part changes nothing. */
export function stand(p: ChainPuzzle, place: number, id: string): ChainPuzzle {
  if (place < 0 || place >= p.places.length || !partOf(p, id) || p.places.includes(id)) return p;
  const places = [...p.places];
  places[place] = id;
  return { ...p, places };
}
/** A place is emptied; its part becomes spare. */
export function lift(p: ChainPuzzle, place: number): ChainPuzzle {
  if (place < 0 || place >= p.places.length || p.places[place] === null) return p;
  const places = [...p.places];
  places[place] = null;
  return { ...p, places };
}

/** Every way of filling the places that does the work. At most eight parts: 40,320 orders at the very most. */
export function solutions(p: ChainPuzzle): string[][] {
  if (p.parts.length > 8) throw new RangeError(`solutions: ${p.parts.length} parts is more than this search is meant for`);
  const out: string[][] = [];
  const used = new Set<string>();
  const row: string[] = [];
  const go = (carrying: string) => {
    if (row.length === p.places.length) {
      if (carrying === p.goal) out.push([...row]);
      return;
    }
    for (const part of p.parts) {
      if (used.has(part.id) || part.takes !== carrying) continue;
      used.add(part.id);
      row.push(part.id);
      go(part.gives);
      row.pop();
      used.delete(part.id);
    }
  };
  go(p.start);
  return out;
}

/** The fewest places whose contents must change to reach an arrangement that works, or null if none does. */
export function distance(p: ChainPuzzle): number | null {
  const all = solutions(p);
  if (all.length === 0) return null;
  return Math.min(...all.map((s) => s.filter((id, i) => p.places[i] !== id).length));
}

/**
 * A puzzle made from a seed: a chain of `length` parts that works, with `decoys` parts that fit nowhere useful,
 * left in a muddle (at least two places wrong). The kinds of motion are numbered; a quest gives them names.
 */
export function generate(rng: Rng, opts: { length?: number; decoys?: number } = {}): ChainPuzzle {
  const length = Math.max(2, Math.min(opts.length ?? 4, 6));
  const decoys = Math.max(0, Math.min(opts.decoys ?? 1, 8 - length));
  const kind = (i: number) => `k${i}`;
  const parts: Part[] = Array.from({ length }, (_, i) => ({ id: `p${i + 1}`, takes: kind(i), gives: kind(i + 1) }));
  for (let d = 0; d < decoys; d++) {
    // A decoy takes something the chain does carry and gives something nothing takes.
    parts.push({ id: `x${d + 1}`, takes: kind(rng.int(0, length - 1)), gives: `dead${d + 1}` });
  }
  const right = parts.slice(0, length).map((x) => x.id);
  for (let attempt = 0; attempt < 200; attempt++) {
    const pool = [...parts.map((x) => x.id)];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = rng.int(0, i);
      [pool[i], pool[j]] = [pool[j]!, pool[i]!];
    }
    const places = pool.slice(0, length);
    const p: ChainPuzzle = { start: kind(0), goal: kind(length), places, parts };
    if (places.filter((id, i) => id !== right[i]).length >= 2 && run(p).end !== "done") return p;
  }
  throw new Error("generate: no muddle found for this seed");
}

/** The balls gathered in the clock's vessel, read as time: one ball for every half hour gone. */
export function elapsed(balls: number): { hours: number; half: boolean } {
  const n = Math.max(0, Math.floor(balls));
  return { hours: Math.floor(n / 2), half: n % 2 === 1 };
}
