// The games' save vault: how progress is kept on a device with no account, so that a closed browser, a second tab,
// a damaged copy or an older build does not lose it. Rules over any store that can get and put a value whole;
// IndexedDB is one such (idb.ts), and a store in memory is another, which is how this is tested in Node.
//
// The founder's standard of 26 November 2026 (hudhud/owner-directive-2026-11-26-production-completion.md, section 8):
// - Two snapshots a game, A and B. A save is written over the older one, so the one before it is always still there:
//   the last known good. Each carries a revision that only rises, the game's schema version, the time, and a
//   checksum of all of it.
// - A snapshot whose checksum does not match is set aside under a quarantine key, never deleted, and the other one
//   is used.
// - A snapshot from a newer schema than this build knows is left alone and nothing is written: an older build never
//   writes over a newer save.
// - A save made in another tab since this page last looked is read and merged before this page writes, by the
//   game's own rule for merging.
// - A save can be exported as a file and imported again; the snapshot an import replaces is kept as a backup.
// Nothing here reads a clock or makes a network request; the time is passed in.

export interface Store {
  get(key: string): Promise<unknown>;
  /** Puts one value whole: all of it is stored or none of it. */
  put(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<void>;
  keys(): Promise<string[]>;
}
export interface Snapshot<T> {
  format: "im.play.save";
  game: string;
  schema: number;
  revision: number;
  savedAt: number;
  checksum: string;
  data: T;
}
export interface VaultOptions<T> {
  game: string;
  /** The schema version this build writes. */
  schema: number;
  /** Brings data of an older schema up by one version, or says it cannot (null). Called for every step in turn. */
  migrate: (fromSchema: number, data: unknown) => unknown | null;
  /** Says whether data read back is what this build expects, and gives it its type. */
  accept: (data: unknown) => T | null;
  /** Joins what this page holds with what another tab has stored since. */
  merge: (mine: T, stored: T) => T;
  now: () => number;
}
export type Loaded<T> =
  | { kind: "fresh" } // nothing stored
  | { kind: "ok"; data: T; revision: number; savedAt: number }
  | { kind: "recovered"; data: T; revision: number; savedAt: number; setAside: number } // a damaged copy was set aside
  | { kind: "newer"; schema: number } // a newer build's save: left alone, nothing will be written
  | { kind: "unavailable"; error: string }; // the store cannot be used: play goes on, nothing is kept
export type Saved = { ok: true; revision: number; savedAt: number; merged: boolean } | { ok: false; reason: "newer" | "unavailable" | "quota"; error: string };

const SLOTS = ["a", "b"] as const;

/** The same value always gives the same text: keys in order at every depth. */
export function canonical(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  const o = value as Record<string, unknown>;
  return `{${Object.keys(o).sort().filter((k) => o[k] !== undefined).map((k) => `${JSON.stringify(k)}:${canonical(o[k])}`).join(",")}}`;
}
export async function sha256(text: string): Promise<string> {
  const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
const seal = (s: Omit<Snapshot<unknown>, "checksum">): Promise<string> => sha256(canonical({ format: s.format, game: s.game, schema: s.schema, revision: s.revision, savedAt: s.savedAt, data: s.data }));

function shaped(x: unknown): x is Snapshot<unknown> {
  if (typeof x !== "object" || x === null) return false;
  const s = x as Record<string, unknown>;
  return s.format === "im.play.save" && typeof s.game === "string" && Number.isInteger(s.schema) && Number.isInteger(s.revision) && (s.revision as number) >= 1 && typeof s.savedAt === "number" && typeof s.checksum === "string" && "data" in s;
}

export class Vault<T> {
  /** The revision this page last read or wrote: a higher one in the store means another tab has saved since. */
  private seen = 0;
  private blocked: "newer" | null = null;
  constructor(private readonly store: Store, private readonly o: VaultOptions<T>) {}

  private key(slot: string): string {
    return `${this.o.game}/${slot}`;
  }
  /** Reads both snapshots and sorts them: sound ones newest first, and those that are damaged. */
  private async read(): Promise<{ sound: { slot: string; snap: Snapshot<unknown> }[]; damaged: { slot: string; raw: unknown }[] }> {
    const sound: { slot: string; snap: Snapshot<unknown> }[] = [];
    const damaged: { slot: string; raw: unknown }[] = [];
    for (const slot of SLOTS) {
      const raw = await this.store.get(this.key(slot));
      if (raw === undefined || raw === null) continue;
      if (shaped(raw) && raw.game === this.o.game && raw.checksum === (await seal(raw))) sound.push({ slot, snap: raw });
      else damaged.push({ slot, raw });
    }
    sound.sort((x, y) => y.snap.revision - x.snap.revision);
    return { sound, damaged };
  }
  /** Brings a sound snapshot's data to this build's schema, or says why it cannot be used. */
  private lift(snap: Snapshot<unknown>): { data: T } | "newer" | "unreadable" {
    if (snap.schema > this.o.schema) return "newer";
    let data: unknown = snap.data;
    for (let v = snap.schema; v < this.o.schema; v++) {
      data = this.o.migrate(v, data);
      if (data === null) return "unreadable";
    }
    const ok = this.o.accept(data);
    return ok === null ? "unreadable" : { data: ok };
  }
  private async setAside(damaged: { slot: string; raw: unknown }[]): Promise<number> {
    let n = 0;
    for (const d of damaged) {
      await this.store.put(`${this.o.game}/quarantine-${this.o.now()}-${d.slot}`, d.raw);
      await this.store.delete(this.key(d.slot));
      n++;
    }
    return n;
  }

  async load(): Promise<Loaded<T>> {
    try {
      const { sound, damaged } = await this.read();
      let setAside = 0;
      for (const s of sound) {
        const lifted = this.lift(s.snap);
        if (lifted === "newer") {
          this.blocked = "newer";
          return { kind: "newer", schema: s.snap.schema };
        }
        if (lifted === "unreadable") {
          // Sealed correctly, but not something this build can read: kept aside like a damaged one.
          damaged.push({ slot: s.slot, raw: s.snap });
          continue;
        }
        setAside = await this.setAside(damaged);
        this.seen = s.snap.revision;
        return setAside ? { kind: "recovered", data: lifted.data, revision: s.snap.revision, savedAt: s.snap.savedAt, setAside } : { kind: "ok", data: lifted.data, revision: s.snap.revision, savedAt: s.snap.savedAt };
      }
      await this.setAside(damaged);
      return { kind: "fresh" };
    } catch (e) {
      return { kind: "unavailable", error: String(e) };
    }
  }

  /** Writes a save. It is saved when this resolves with ok, and not before. */
  async save(mine: T): Promise<Saved> {
    if (this.blocked) return { ok: false, reason: "newer", error: "a save from a newer version of the game is stored here" };
    try {
      const { sound, damaged } = await this.read();
      const newest = sound[0];
      let data = mine;
      let merged = false;
      if (newest) {
        const lifted = this.lift(newest.snap);
        if (lifted === "newer") {
          this.blocked = "newer";
          return { ok: false, reason: "newer", error: "a save from a newer version of the game is stored here" };
        }
        // Another tab has saved since this page last looked: what it stored is joined in, never written over.
        if (lifted !== "unreadable" && newest.snap.revision > this.seen) {
          data = this.o.merge(mine, lifted.data);
          merged = true;
        }
      }
      await this.setAside(damaged);
      const revision = (newest?.snap.revision ?? 0) + 1;
      // Over the older of the two (or an empty place), so that the newest sound one is still there afterwards.
      const used = new Set(sound.map((s) => s.slot));
      const slot = SLOTS.find((s) => !used.has(s)) ?? sound[sound.length - 1]!.slot;
      const body = { format: "im.play.save" as const, game: this.o.game, schema: this.o.schema, revision, savedAt: this.o.now(), data };
      const snap: Snapshot<T> = { ...body, checksum: await seal(body) };
      await this.store.put(this.key(slot), snap);
      this.seen = revision;
      return { ok: true, revision, savedAt: snap.savedAt, merged };
    } catch (e) {
      const text = String(e);
      return { ok: false, reason: /quota/i.test(text) ? "quota" : "unavailable", error: text };
    }
  }

  /** The newest sound save as a file's text: versioned, sealed, and holding nothing but the game's own data. */
  async exportFile(): Promise<string | null> {
    const { sound } = await this.read();
    return sound[0] ? `${JSON.stringify(sound[0].snap, null, 1)}\n` : null;
  }
  /** Takes a save from a file. What it replaces is kept under a backup key first. */
  async importFile(text: string): Promise<{ ok: true; data: T; revision: number } | { ok: false; reason: "not-a-save" | "another-game" | "damaged" | "newer" | "unreadable" | "unavailable" }> {
    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch {
      return { ok: false, reason: "not-a-save" };
    }
    if (!shaped(raw)) return { ok: false, reason: "not-a-save" };
    if (raw.game !== this.o.game) return { ok: false, reason: "another-game" };
    if (raw.checksum !== (await seal(raw))) return { ok: false, reason: "damaged" };
    const lifted = this.lift(raw);
    if (lifted === "newer" || lifted === "unreadable") return { ok: false, reason: lifted };
    try {
      const { sound } = await this.read();
      if (sound[0]) await this.store.put(`${this.o.game}/backup-${this.o.now()}`, sound[0].snap);
      // The import replaces what is stored outright: it is not merged with it.
      this.seen = Math.max(this.seen, sound[0]?.snap.revision ?? 0);
      const saved = await this.save(lifted.data);
      return saved.ok ? { ok: true, data: lifted.data, revision: saved.revision } : { ok: false, reason: "unavailable" };
    } catch {
      return { ok: false, reason: "unavailable" };
    }
  }
}

/** A store in memory: for tests, and for a browser session in which nothing can be kept. */
export function memoryStore(init: Record<string, unknown> = {}): Store & { data: Map<string, unknown> } {
  const data = new Map<string, unknown>(Object.entries(init));
  return {
    data,
    get: async (k) => (data.has(k) ? structuredClone(data.get(k)) : undefined),
    put: async (k, v) => void data.set(k, structuredClone(v)),
    delete: async (k) => void data.delete(k),
    keys: async () => [...data.keys()],
  };
}
