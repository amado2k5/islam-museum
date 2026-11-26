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
/**
 * Keeps the saved game as it is, byte for byte, in a second place, before a new game is written over it. A build
 * rolled back to cannot read a later build's save; without this its first day would write over that game for good.
 */
export function setAside(store: Store): boolean {
  try {
    const text = store.getItem(SAVE_KEY);
    if (text === null) return false;
    store.setItem(ASIDE_KEY, text);
    return true;
  } catch {
    return false;
  }
}
/** The game set aside, if this build can read it. */
export const readAside = (store: Store): SaveRead => readSave(store, ASIDE_KEY);
/** Puts the game set aside back as the saved game, and keeps the one it replaces in its place. */
export function restoreAside(store: Store): boolean {
  try {
    const aside = store.getItem(ASIDE_KEY);
    if (aside === null || readSave(store, ASIDE_KEY).status !== "ok") return false;
    const current = store.getItem(SAVE_KEY);
    store.setItem(SAVE_KEY, aside);
    if (current === null) store.removeItem(ASIDE_KEY);
    else store.setItem(ASIDE_KEY, current);
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
