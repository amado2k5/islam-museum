// The Thread of Time: five events of the museum's graph, to be put in the order they happened.
import type { PackEvent, PackFile } from "./pack";
import { dayNumber, rng } from "./seed";

export const THREAD_LENGTH = 5;
/** At least this many years between any two of the day's events, so the order is never a coin toss. */
export const THREAD_GAP = 15;

export function thread(pack: PackFile, seed: string): { shown: PackEvent[]; order: string[] } {
  const r = rng(`thread:v${pack.version}:${seed}`);
  const picked: PackEvent[] = [];
  for (let tries = 0; picked.length < THREAD_LENGTH; tries++) {
    if (tries > 5000) throw new Error("the pack has too few dated events");
    const e = pack.events[Math.floor(r() * pack.events.length)]!;
    if (picked.every((p) => p.id !== e.id && Math.abs(p.y - e.y) >= THREAD_GAP)) picked.push(e);
  }
  const order = picked.slice().sort((a, b) => a.y - b.y).map((e) => e.id);
  // Shown in an order that is never already right.
  let shown = picked;
  for (let i = 0; shown.map((e) => e.id).join() === order.join() && i < 10; i++) shown = shown.slice(1).concat(shown[0]!);
  return { shown, order };
}
export const dailyThread = (pack: PackFile, date: string) => thread(pack, `day-${dayNumber(date)}`);
/** How many of the player's events are in their right place. */
export const rightPlaces = (mine: string[], order: string[]): boolean[] => mine.map((id, i) => order[i] === id);
