// Granada's saved game: one game, kept on the device, in the browser's own storage. Nothing leaves the device.
// A save is believed only if it is of a version this code knows, names a scenario that exists, and passes every
// rule the game itself must keep (the ledger's audit included): a damaged or tampered save is set aside, never
// loaded half-right. A game saved under earlier rules is brought up to the present ones first. Time does not pass while the game is closed: the day saved is the day resumed.
import { SCENARIOS } from "./sim/scenarios";
import { invariants, upgradeVillage, type VillageState } from "./sim/village";

export const SAVE_KEY = "im.granada.save.v1";
export const SAVE_VERSION = 1;
export type SaveRead = { status: "empty" } | { status: "ok"; state: VillageState } | { status: "unreadable"; why: string } | { status: "newer"; version: number };

export interface Store {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Where a saved game this build cannot read is kept, untouched, so that a build that can read it may bring it back. */
export const ASIDE_KEY = "im.granada.save.v1.aside";
/** The valley as it stood when the year in hand began: kept beside the saved game, and set aside and brought back with it. */
export const YEAR_KEY = "im.granada.yearstart.v1";
/** Several games may be set aside, one by each build rolled back to: none is written over another. */
export const ASIDE_KEYS = [ASIDE_KEY, `${ASIDE_KEY}.2`, `${ASIDE_KEY}.3`, `${ASIDE_KEY}.4`];
const yearOf = (slot: string) => `${slot}.year`;
const put = (store: Store, key: string, text: string | null) => (text === null ? store.removeItem(key) : store.setItem(key, text));
/**
 * Keeps the saved game as it is, byte for byte, in a second place, with the start of its year, before a new game is
 * written over it. A build rolled back to cannot read a later build's save; without this its first day would write
 * over that game for good. A game already set aside is never replaced: each takes a place of its own, and when there
 * is no place or no room left this answers false, and the caller must then write nothing over the saved game.
 */
export function setAside(store: Store): boolean {
  try {
    const text = store.getItem(SAVE_KEY);
    if (text === null) return false;
    if (ASIDE_KEYS.some((k) => store.getItem(k) === text)) return true;
    const free = ASIDE_KEYS.find((k) => store.getItem(k) === null);
    if (!free) return false;
    store.setItem(free, text);
    try {
      put(store, yearOf(free), store.getItem(YEAR_KEY));
    } catch {
      // The game itself is kept; without the start of its year, that year cannot be played again from its start.
    }
    return true;
  } catch {
    return false;
  }
}
/** The first game set aside that this build can read; failing that, what is wrong with the first one there is. */
const readableAside = (store: Store): string | undefined => ASIDE_KEYS.find((k) => readSave(store, k).status === "ok");
export const readAside = (store: Store): SaveRead => readSave(store, readableAside(store) ?? ASIDE_KEYS.find((k) => store.getItem(k) !== null) ?? ASIDE_KEY);
/** Puts a game set aside back as the saved game, with the start of its year, and keeps the one it replaces in its place. */
export function restoreAside(store: Store): boolean {
  try {
    const slot = readableAside(store);
    if (!slot) return false;
    const aside = store.getItem(slot)!;
    const asideYear = store.getItem(yearOf(slot));
    const current = store.getItem(SAVE_KEY);
    const currentYear = store.getItem(YEAR_KEY);
    store.setItem(SAVE_KEY, aside);
    put(store, slot, current);
    put(store, YEAR_KEY, asideYear);
    put(store, yearOf(slot), current === null ? null : currentYear);
    return true;
  } catch {
    return false;
  }
}

export function readSave(store: Store, key: string = SAVE_KEY): SaveRead {
  let text: string | null;
  try {
    text = store.getItem(key);
  } catch {
    return { status: "unreadable", why: "storage" };
  }
  if (text === null) return { status: "empty" };
  let data: { v?: unknown; state?: VillageState };
  try {
    data = JSON.parse(text);
  } catch {
    return { status: "unreadable", why: "not-json" };
  }
  if (typeof data?.v !== "number") return { status: "unreadable", why: "no-version" };
  if (data.v > SAVE_VERSION) return { status: "newer", version: data.v };
  const saved = data.state;
  const sc = saved && typeof saved === "object" ? SCENARIOS[saved.scenario] : undefined;
  if (!saved || !sc) return { status: "unreadable", why: "unknown-game" };
  let state: VillageState | null;
  try {
    // A game saved under earlier rules is brought up to these, and then must pass every rule like any other.
    state = upgradeVillage(sc, saved);
  } catch {
    return { status: "unreadable", why: "malformed" };
  }
  if (!state) return { status: "unreadable", why: "unknown-game" };
  try {
    const bad = invariants(sc, state);
    if (bad.length) return { status: "unreadable", why: "broken-rules" };
  } catch {
    return { status: "unreadable", why: "malformed" };
  }
  return { status: "ok", state };
}

/** Writes the game. Returns false if the device refused (storage full or switched off), so the screen can say so. */
export function writeSave(store: Store, state: VillageState): boolean {
  try {
    store.setItem(SAVE_KEY, JSON.stringify({ v: SAVE_VERSION, state }));
    return true;
  } catch {
    return false;
  }
}

export function clearSave(store: Store): void {
  try {
    store.removeItem(SAVE_KEY);
  } catch {
    // Nothing to clear from a store that cannot be reached.
  }
}
