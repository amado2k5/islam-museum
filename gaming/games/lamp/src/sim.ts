// The Lamp of the Ages: the rules, with no page in them, so the tests can play every mission.
import { DESTINATIONS, destination } from "./content";

export const SAVE_KEY = "im.lamp.v1";
export const MAX_COMPANIONS = 2;

export interface Save {
  v: 1;
  /** The destination the player stands in, or null on the map. */
  at: string | null;
  /** Per destination: 0 arrived, 1 met the figure, 2 answered, 3 done. */
  step: Record<string, number>;
  /** The record cards carried, in the order taken. Cards are kept, never used up. */
  cards: string[];
  /** The figures travelling with the player (record ids). */
  companions: string[];
}

export const newSave = (): Save => ({ v: 1, at: null, step: {}, cards: [], companions: [] });

export const stepAt = (s: Save, dest: string): number => s.step[dest] ?? 0;
export const isDone = (s: Save, dest: string): boolean => stepAt(s, dest) >= 3;
export const allDone = (s: Save): boolean => DESTINATIONS.every((d) => isDone(s, d.id));

export function canTravel(s: Save, dest: string): boolean {
  const d = destination(dest);
  return !!d && (d.needs === null || s.cards.includes(d.needs));
}

export function travel(s: Save, dest: string): boolean {
  if (!canTravel(s, dest)) return false;
  s.at = dest;
  return true;
}

export const home = (s: Save): void => { s.at = null; };

export function meet(s: Save): boolean {
  if (!s.at) return false;
  s.step[s.at] = Math.max(stepAt(s, s.at), 1);
  return true;
}

/** Answer the question of the destination the player stands in. True if the answer is the right record. */
export function answer(s: Save, record: string): boolean {
  const d = s.at ? destination(s.at) : undefined;
  if (!d || stepAt(s, d.id) < 1) return false;
  if (record !== d.question.answer) return false;
  s.step[d.id] = Math.max(stepAt(s, d.id), 2);
  return true;
}

/** Take the destination's record card and finish its mission. */
export function complete(s: Save): boolean {
  const d = s.at ? destination(s.at) : undefined;
  if (!d || stepAt(s, d.id) < 2) return false;
  s.step[d.id] = 3;
  if (!s.cards.includes(d.gives)) s.cards.push(d.gives);
  return true;
}

/** A figure may travel along once their own mission is done. */
export function join(s: Save, figure: string): boolean {
  const d = DESTINATIONS.find((x) => x.figure === figure);
  if (!d || !isDone(s, d.id) || s.companions.includes(figure) || s.companions.length >= MAX_COMPANIONS) return false;
  s.companions.push(figure);
  return true;
}

export function part(s: Save, figure: string): boolean {
  const i = s.companions.indexOf(figure);
  if (i < 0) return false;
  s.companions.splice(i, 1);
  return true;
}

/** The destination a companion belongs to: they speak only of their own time, and only there. */
export const homeOf = (figure: string): string | undefined => DESTINATIONS.find((d) => d.figure === figure)?.id;

export const serialize = (s: Save): string => JSON.stringify(s);

/** Read a save back, keeping only what is valid; anything unreadable gives a new save. */
export function parse(text: string | null): Save {
  const out = newSave();
  if (!text) return out;
  let v: unknown;
  try { v = JSON.parse(text); } catch { return out; }
  if (!v || typeof v !== "object") return out;
  const o = v as Partial<Save>;
  if (o.v !== 1) return out;
  const ids = new Set(DESTINATIONS.map((d) => d.id));
  const gives = new Set(DESTINATIONS.map((d) => d.gives));
  const figures = new Set(DESTINATIONS.map((d) => d.figure));
  if (typeof o.at === "string" && ids.has(o.at)) out.at = o.at;
  if (o.step && typeof o.step === "object") for (const [k, n] of Object.entries(o.step)) if (ids.has(k) && Number.isInteger(n) && n >= 0 && n <= 3) out.step[k] = n;
  if (Array.isArray(o.cards)) out.cards = [...new Set(o.cards.filter((c): c is string => typeof c === "string" && gives.has(c)))];
  if (Array.isArray(o.companions)) out.companions = [...new Set(o.companions.filter((c): c is string => typeof c === "string" && figures.has(c)))].slice(0, MAX_COMPANIONS);
  return out;
}

/** The century (CE) of an EDTF year such as "0850", "1420~" or "-0050". */
export const century = (year: number): number => (year > 0 ? Math.floor((year - 1) / 100) + 1 : 0);
