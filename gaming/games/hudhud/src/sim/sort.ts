// The sorting rules: cards are put in groups and shown, and the page of the Atlas is found when every card is in the
// group the answer gives it. Pure rules over plain data: nothing here draws, nothing is left to chance, and nothing
// is tied to the animals of the al-Jahiz quest (content/sort, ui/sort) that it is built for: the items, the groups and
// the answer map come in as data. A showing with a card not yet placed is refused and is not counted; a showing that
// finds a card in the wrong group is a failed one and is counted.
//
// What it is for first: the museum's record of the Book of Animals says that al-Jahiz divides animals by how they
// move and that he separates birds of prey armed with talons from those armed with beaks, and says which flying
// things are not called birds. Sorting cards into groups is the game's own idea (review ledger, HR-HH-23 to HR-HH-25).
export type SortStyle = "story" | "explorer" | "challenge";
// `kind` is a goal: the girl was answered kindly. `answered` is only that she was answered at all, so that the question
// is not asked again after a resume (the same arrangement as the helper of the scattered sheets).
export const SORT_FLAGS = ["askedDivision", "askedBirds", "kind", "feather", "answered"] as const;
export type SortFlag = (typeof SORT_FLAGS)[number];

/** What a sorting is made of: its cards, its groups (in the order of the trays), and the group each card belongs to. */
export interface SortDef {
  items: readonly string[];
  groups: readonly string[];
  answer: Readonly<Record<string, string>>;
}

/** What the last command did; null before the first. */
export type SortLast =
  | { type: "place"; item: string; group: string | null }
  | { type: "show"; refused: true; unplaced: number }
  | { type: "show"; refused: false; right: number; total: number; wrong: string[] };

export interface SortState {
  style: SortStyle;
  items: readonly string[];
  groups: readonly string[];
  answer: Readonly<Record<string, string>>;
  /** The group each card is in now, or null if it is not placed. */
  placed: Readonly<Record<string, string | null>>;
  /** Placements made (a card moved to another tray, or put in one for the first time, or taken out), and showings that found the cards not yet right. */
  moves: number;
  shows: number;
  flags: SortFlag[];
  last: SortLast | null;
  done: boolean;
}
export type SortCommand = { type: "place"; item: string; group: string | null } | { type: "show" } | { type: "flag"; flag: SortFlag };

/** A sorting is well made if every card has exactly one group of the answer, every group has at least one card, and nothing in the answer is unknown. Thrown, not assumed. */
export function checkDef(def: SortDef): void {
  const items = new Set(def.items);
  const groups = new Set(def.groups);
  if (items.size !== def.items.length || groups.size !== def.groups.length) throw new Error("a card or a group is named twice");
  if (def.items.length === 0 || def.groups.length < 2) throw new Error("a sorting needs cards and at least two groups");
  for (const i of def.items) if (!groups.has(def.answer[i] ?? "")) throw new Error(`card ${i} has no group in the answer`);
  for (const k of Object.keys(def.answer)) if (!items.has(k)) throw new Error(`the answer names an unknown card ${k}`);
  for (const g of def.groups) if (!def.items.some((i) => def.answer[i] === g)) throw new Error(`group ${g} has no card`);
}

export function newSort(style: SortStyle, def: SortDef): SortState {
  checkDef(def);
  return { style, items: def.items, groups: def.groups, answer: def.answer, placed: Object.fromEntries(def.items.map((i) => [i, null])), moves: 0, shows: 0, flags: [], last: null, done: false };
}

/** The cards that are not placed. */
export const unplaced = (s: Pick<SortState, "items" | "placed">): string[] => s.items.filter((i) => s.placed[i] === null);
/** The cards that are in the group the answer gives them. */
export const rightOnes = (s: Pick<SortState, "items" | "placed" | "answer">): string[] => s.items.filter((i) => s.placed[i] === s.answer[i]);
/** The cards that are placed, and not in their group. */
export const wrongOnes = (s: Pick<SortState, "items" | "placed" | "answer">): string[] => s.items.filter((i) => s.placed[i] !== null && s.placed[i] !== s.answer[i]);
/** Every card is in its group (the showing is what ends the sorting, not this). */
export const allRight = (s: Pick<SortState, "items" | "placed" | "answer">): boolean => s.items.every((i) => s.placed[i] === s.answer[i]);

/** Puts a card in a group, or takes it out (null). An unknown card or group, a card put where it already is, or a finished sorting, changes nothing. */
export function place(s: SortState, item: string, group: string | null): SortState {
  if (s.done || !s.items.includes(item)) return s;
  if (group !== null && !s.groups.includes(group)) return s;
  if (s.placed[item] === group) return s;
  return { ...s, placed: { ...s.placed, [item]: group }, moves: s.moves + 1, last: { type: "place", item, group } };
}
/**
 * "Show al-Jahiz": with a card unplaced, nothing is shown and nothing is counted. Otherwise every card is looked at:
 * if each is in its group the sorting is done; if not, the showing is counted as a failed one.
 */
export function show(s: SortState): SortState {
  if (s.done) return s;
  const un = unplaced(s).length;
  if (un > 0) return { ...s, last: { type: "show", refused: true, unplaced: un } };
  const wrong = wrongOnes(s);
  const ok = wrong.length === 0;
  return { ...s, shows: ok ? s.shows : s.shows + 1, last: { type: "show", refused: false, right: s.items.length - wrong.length, total: s.items.length, wrong }, done: ok };
}
export function applySort(s: SortState, c: SortCommand): SortState {
  if (s.done) return s;
  if (c.type === "flag") return !SORT_FLAGS.includes(c.flag) || s.flags.includes(c.flag) ? s : { ...s, flags: [...s.flags, c.flag] };
  return c.type === "place" ? place(s, c.item, c.group) : show(s);
}

/** What counts for the Ingenuity goal: showings that fail, allowed; null for the way of playing with no count. */
export interface SortSlack {
  shows: number;
}
/** The four goals, in the shape every quest's record has. */
export function sortGoals(s: SortState, slack: SortSlack | null): { turns: number; slips: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean } {
  const has = (f: SortFlag) => s.flags.includes(f);
  return {
    turns: s.moves,
    slips: s.shows,
    curiosity: has("askedDivision") && has("askedBirds"),
    ingenuity: slack === null || s.shows <= slack.shows,
    kindness: has("kind"),
    feather: has("feather"),
  };
}

/** What is kept of a sorting in progress: enough to put the cards back, and nothing that cannot be checked. */
export interface SortSnapshot {
  style: SortStyle;
  placed: Record<string, string | null>;
  moves: number;
  shows: number;
  flags: SortFlag[];
}
export function snapshotSort(s: SortState): SortSnapshot {
  return { style: s.style, placed: { ...s.placed }, moves: s.moves, shows: s.shows, flags: [...s.flags] };
}
/**
 * A sorting put back from what was saved, or null if what was saved cannot be trusted. Nothing is taken on faith: the
 * sorting is built afresh for the style (`defOf`), so cards, groups and answer are never read from the file; a placement
 * is accepted only for a card of that style and a group of that style (or null); the count of placements is a whole
 * number, not fewer than the cards that are placed (each took one), and the count of failed showings a whole number;
 * flags that are not known are dropped. A finished sorting is never kept, so one is never restored as done, and what the
 * last command did is not kept.
 */
export function restoreSort(x: unknown, defOf: (style: SortStyle) => SortDef): SortState | null {
  if (typeof x !== "object" || x === null) return null;
  const o = x as Record<string, unknown>;
  if (o.style !== "story" && o.style !== "explorer" && o.style !== "challenge") return null;
  const base = newSort(o.style, defOf(o.style));
  if (typeof o.placed !== "object" || o.placed === null || Array.isArray(o.placed)) return null;
  const given = o.placed as Record<string, unknown>;
  const placed: Record<string, string | null> = { ...base.placed };
  for (const [item, group] of Object.entries(given)) {
    if (!Object.prototype.hasOwnProperty.call(placed, item) || !base.items.includes(item)) return null;
    if (group !== null && (typeof group !== "string" || !base.groups.includes(group))) return null;
    placed[item] = group;
  }
  const inTrays = Object.values(placed).filter((g) => g !== null).length;
  if (typeof o.moves !== "number" || !Number.isInteger(o.moves) || o.moves < inTrays || o.moves > 100000) return null;
  if (typeof o.shows !== "number" || !Number.isInteger(o.shows) || o.shows < 0 || o.shows > 100000) return null;
  if (!Array.isArray(o.flags)) return null;
  const flags = SORT_FLAGS.filter((f) => (o.flags as unknown[]).includes(f));
  return { ...base, placed, moves: o.moves, shows: o.shows, flags: [...flags] };
}
