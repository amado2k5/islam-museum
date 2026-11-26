// Hudhud's progress in the platform's vault (IndexedDB), beside the small copy the page keeps in localStorage.
// The vault is the authority: two sealed snapshots, the last good one always there, a damaged one set aside, a newer
// build's never written over, another tab's always joined in (@im/platform/save/vault). The copy in localStorage is
// what lets the page draw at once and is the fallback where IndexedDB cannot be used.
//
// This file is the join between the two and holds no browser code: it is given a store (or none) and is tested in
// Node with one in memory. "Saved" is reported only when the vault's write has completed.
import { Vault, type Store } from "@im/platform/save/vault";
import { MIGRATIONS, SAVE_VERSION, mergeSaves, readSave, type SaveFile } from "./save";

export type SaveStatus =
  | { state: "starting" }
  | { state: "saving" }
  | { state: "saved"; at: number; revision: number }
  | { state: "failed"; reason: "quota" | "unavailable"; at: number }
  | { state: "unavailable" } // nothing can be kept in this browser session
  | { state: "newer" }; // a newer version's save is here: it is left alone

export interface Durable {
  status(): SaveStatus;
  /** Queues a save of what the page holds. `ownsResume`: this page has just changed the quest in progress. */
  write(save: SaveFile, ownsResume: boolean): Promise<SaveStatus>;
  /** Another tab says it has saved: read what is stored and hand it to the page if it is news. */
  refresh(): Promise<void>;
  exportFile(): Promise<string | null>;
  importFile(text: string): Promise<{ ok: true } | { ok: false; reason: string }>;
  /** Resolves when every queued save has finished. */
  settled(): Promise<void>;
}
export interface DurableHooks {
  /** The page takes up a save that came from the vault (first load, another tab, an import). */
  adopt(save: SaveFile, why: "vault" | "tab" | "import"): void;
  /** The state of saving changed. */
  status(s: SaveStatus): void;
  /** A save completed with this revision: tell the other tabs. */
  told?(revision: number): void;
  now(): number;
}

/**
 * Opens the vault and settles what the page should hold. `local` is what the page read from localStorage and
 * `localAt` when that was written (0 if never). If the vault is empty, what the page holds is put into it, so that
 * a player who began before the vault existed loses nothing. If both hold something, they are joined: finished
 * quests are kept from both; settings and the place in the current quest come from whichever was written last.
 */
export async function openDurable(store: Store | null, local: SaveFile, localAt: number, hooks: DurableHooks): Promise<Durable> {
  let status: SaveStatus = { state: "starting" };
  const set = (s: SaveStatus) => {
    status = s;
    hooks.status(s);
    return s;
  };
  let owning = false;
  // A snapshot is stamped with the moment the page asked for it, not the later moment the queue reached it: the
  // stamp is compared with the time of the copy in localStorage to tell which of the two was written last.
  let stamp = 0;
  const vault = store
    ? new Vault<SaveFile>(store, {
        game: "hudhud",
        schema: SAVE_VERSION,
        migrate: (from, data) => MIGRATIONS[from]?.(data as Record<string, unknown>) ?? null,
        accept: (data) => {
          const r = readSave(JSON.stringify(data));
          return r.kind === "ok" ? r.save : null;
        },
        merge: (mine, stored) => mergeSaves(mine, stored, owning),
        now: () => stamp || hooks.now(),
      })
    : null;
  let held = local;
  let queue: Promise<unknown> = Promise.resolve();
  const none: Durable = { status: () => status, write: async () => status, refresh: async () => undefined, exportFile: async () => null, importFile: async () => ({ ok: false, reason: "unavailable" }), settled: async () => undefined };
  if (!vault) {
    set({ state: "unavailable" });
    return none;
  }

  const doWrite = async (save: SaveFile, ownsResume: boolean, asked: number): Promise<SaveStatus> => {
    if (status.state === "newer" || status.state === "unavailable") return status;
    set({ state: "saving" });
    owning = ownsResume;
    stamp = asked;
    const r = await vault.save(save).finally(() => (stamp = 0));
    if (!r.ok) return r.reason === "newer" ? set({ state: "newer" }) : set({ state: "failed", reason: r.reason, at: hooks.now() });
    held = save;
    if (r.merged) {
      // Something another tab had stored was joined in: the page takes up the joined save.
      const now = await vault.load();
      if (now.kind === "ok" || now.kind === "recovered") {
        held = { ...now.data, slot: save.slot };
        hooks.adopt(held, "tab");
      }
    }
    hooks.told?.(r.revision);
    return set({ state: "saved", at: r.savedAt, revision: r.revision });
  };
  const write = (save: SaveFile, ownsResume: boolean): Promise<SaveStatus> => {
    const asked = hooks.now();
    const next = queue.then(() => doWrite(save, ownsResume, asked));
    queue = next.catch(() => undefined);
    return next;
  };

  const first = await vault.load();
  if (first.kind === "newer") {
    set({ state: "newer" });
    return { ...none, status: () => status };
  }
  if (first.kind === "unavailable") {
    set({ state: "unavailable" });
    return none;
  }
  if (first.kind === "fresh") {
    // Taken over from localStorage, if there is anything there to take.
    if (localAt > 0) await write(local, true);
    else set({ state: "saved", at: 0, revision: 0 });
  } else {
    // On a tie the copy in localStorage leads: it is written first and at once, so it is never the older of the two.
    const vaultNewer = first.savedAt > localAt;
    held = vaultNewer ? { ...mergeSaves(first.data, local, true), slot: first.data.slot } : mergeSaves(local, first.data, true);
    hooks.adopt(held, "vault");
    // What was joined is written back, so that both places hold the same.
    if (JSON.stringify(held) !== JSON.stringify(first.data)) await write(held, true);
    else set({ state: "saved", at: first.savedAt, revision: first.revision });
  }

  return {
    status: () => status,
    write,
    refresh: () => {
      const next = queue.then(async () => {
        const now = await vault.load();
        if (now.kind !== "ok" && now.kind !== "recovered") return;
        const joined = { ...mergeSaves(now.data, held, false), slot: held.slot };
        if (JSON.stringify(joined) === JSON.stringify(held)) return;
        held = joined;
        hooks.adopt(held, "tab");
      });
      queue = next.catch(() => undefined);
      return next;
    },
    exportFile: () => queue.then(() => vault.exportFile()),
    importFile: (text) => {
      const next = queue.then(async (): Promise<{ ok: true } | { ok: false; reason: string }> => {
        const r = await vault.importFile(text);
        if (!r.ok) return r;
        held = r.data;
        hooks.adopt(held, "import");
        set({ state: "saved", at: hooks.now(), revision: r.revision });
        hooks.told?.(r.revision);
        return { ok: true };
      });
      queue = next.catch(() => undefined);
      return next;
    },
    settled: () => queue.then(() => undefined),
  };
}
