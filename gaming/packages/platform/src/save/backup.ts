// A game that keeps its progress in localStorage, backed up to the vault without a change to the game. Everything
// the game stores under its own prefix ("im.<game>.") is copied into the vault's two sealed snapshots, at intervals
// and when the page is hidden or left; and when the game is opened and something it had stored is no longer in
// localStorage (the storage was cleared, or the browser dropped it), it is put back before the game reads it.
//
// This is a backup beside the game's own store, not yet the vault as the game's store: the game still reads and
// writes localStorage, and a key that is present there is never replaced from the vault. It is what can be given
// to a game whose own code is not to be touched. Rules only, over any store and any storage: tested in Node.
import { Vault, type Saved, type Store } from "./vault";

export type Kept = Record<string, string>;
export interface StorageLike {
  readonly length: number;
  key(i: number): string | null;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/** Everything in storage under a prefix. */
export function collect(storage: StorageLike, prefix: string): Kept {
  const out: Kept = {};
  for (let i = 0; i < storage.length; i++) {
    const k = storage.key(i);
    if (k === null || !k.startsWith(prefix)) continue;
    const v = storage.getItem(k);
    if (v !== null) out[k] = v;
  }
  return out;
}
/** Puts back what is missing, and only what is missing. Returns the keys it put back. */
export function restoreMissing(storage: StorageLike, kept: Kept, prefix: string): string[] {
  const back: string[] = [];
  for (const [k, v] of Object.entries(kept)) {
    if (!k.startsWith(prefix) || storage.getItem(k) !== null) continue;
    try {
      storage.setItem(k, v);
      back.push(k);
    } catch {
      /* storage that will not take it back is left as it is */
    }
  }
  return back.sort();
}

export interface Backup {
  /** The keys put back into localStorage when the game was opened. */
  restored: string[];
  /** Copies what the game holds now into the vault, if it has changed since the last copy. */
  save(): Promise<Saved | null>;
  exportFile(): Promise<string | null>;
}

export async function openBackup(store: Store | null, storage: StorageLike | null, game: string, now: () => number): Promise<Backup> {
  const none: Backup = { restored: [], save: async () => null, exportFile: async () => null };
  if (!store || !storage) return none;
  const prefix = `im.${game}.`;
  const vault = new Vault<Kept>(store, {
    game,
    schema: 1,
    migrate: () => null,
    accept: (d) => (typeof d === "object" && d !== null && !Array.isArray(d) && Object.entries(d).every(([k, v]) => k.startsWith(prefix) && typeof v === "string") ? (d as Kept) : null),
    // This page's keys are the live ones; a key only another tab has stored is kept.
    merge: (mine, stored) => ({ ...stored, ...mine }),
    now,
  });
  const first = await vault.load();
  if (first.kind === "newer" || first.kind === "unavailable") return none;
  const restored = first.kind === "fresh" ? [] : restoreMissing(storage, first.data, prefix);
  let last = first.kind === "fresh" ? "{}" : JSON.stringify(first.data);
  let queue: Promise<unknown> = Promise.resolve();
  return {
    restored,
    save: () => {
      const next = queue.then(async () => {
        const kept = collect(storage, prefix);
        const text = JSON.stringify(kept);
        if (text === last || Object.keys(kept).length === 0) return null;
        const r = await vault.save(kept);
        if (r.ok) last = text;
        return r;
      });
      queue = next.catch(() => undefined);
      return next;
    },
    exportFile: () => queue.then(() => vault.exportFile()),
  };
}
