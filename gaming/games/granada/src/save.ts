// Granada's saved game: one game, kept on the device, in the browser's own storage. Nothing leaves the device.
// A save is believed only if it is of a version this code knows, names a scenario that exists, and passes every
// rule the game itself must keep (the ledger's audit included): a damaged or tampered save is set aside, never
// loaded half-right. Time does not pass while the game is closed: the day saved is the day resumed.
import { SCENARIOS } from "./sim/scenarios";
import { VILLAGE_VERSION, invariants, type VillageState } from "./sim/village";

export const SAVE_KEY = "im.granada.save.v1";
export const SAVE_VERSION = 1;
export type SaveRead = { status: "empty" } | { status: "ok"; state: VillageState } | { status: "unreadable"; why: string } | { status: "newer"; version: number };

export interface Store {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function readSave(store: Store): SaveRead {
  let text: string | null;
  try {
    text = store.getItem(SAVE_KEY);
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
  const state = data.state;
  const sc = state && typeof state === "object" ? SCENARIOS[state.scenario] : undefined;
  if (!state || !sc || state.version !== VILLAGE_VERSION) return { status: "unreadable", why: "unknown-game" };
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
