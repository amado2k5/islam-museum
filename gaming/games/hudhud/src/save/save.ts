// What Hudhud keeps on the device: three local slots, each with its settings, its Storykeeper's look and what has
// been done. No name, age, address or account is asked for or stored, and nothing leaves the device.
//
// The file is versioned. A save from an older version is migrated step by step; one that cannot be read is set
// aside under a quarantine key, never thrown away, and a fresh one is started; one from a newer version of the game
// is left untouched and the game plays without saving over it.
import type { PlayStyle } from "../content/workshop";

export const SAVE_KEY = "im.hudhud.save.v1";
export const QUARANTINE_KEY = "im.hudhud.save.quarantine";
export const SAVE_VERSION = 1;
export const SLOTS = 3;

export type Quality = "low" | "medium" | "high";
export interface Settings {
  style: PlayStyle;
  quality: Quality;
  reducedMotion: boolean;
  highContrast: boolean;
  /** 1 is the ordinary size; up to 1.6. */
  textScale: number;
  /** Characters a second; 0 shows a line at once. */
  textSpeed: number;
  /** 0 to 1 each. Music has its own control, shared with the other games. */
  volume: { ambience: number; voices: number; effects: number };
  muted: boolean;
  captions: boolean;
}
export interface Keeper {
  /** 0 a boy, 1 a girl: the player's choice on the first screen. It changes the figure and the grammar of a few lines. */
  kind: number;
  /** Index into the skin tones and the outfits the art offers. */
  skin: number;
  outfit: number;
  hair: number;
}
export interface QuestRecord {
  done: boolean;
  bestTurns: number | null;
  curiosity: boolean;
  ingenuity: boolean;
  kindness: boolean;
  feather: boolean;
}
export interface Slot {
  settings: Settings;
  keeper: Keeper;
  quests: Record<string, QuestRecord>;
}
export interface SaveFile {
  v: number;
  slot: number;
  slots: (Slot | null)[];
}

export const DEFAULT_SETTINGS: Settings = { style: "explorer", quality: "medium", reducedMotion: false, highContrast: false, textScale: 1, textSpeed: 40, volume: { ambience: 0.6, voices: 0.8, effects: 0.8 }, muted: false, captions: true };
export const newSlot = (): Slot => ({ settings: structuredClone(DEFAULT_SETTINGS), keeper: { kind: 1, skin: 1, outfit: 0, hair: 3 }, quests: {} });
export const newSave = (): SaveFile => ({ v: SAVE_VERSION, slot: 0, slots: [newSlot(), null, null] });

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null && !Array.isArray(x);
const clamp = (x: unknown, lo: number, hi: number, d: number) => (typeof x === "number" && Number.isFinite(x) ? Math.min(hi, Math.max(lo, x)) : d);
const oneOf = <T extends string>(x: unknown, all: readonly T[], d: T): T => (all.includes(x as T) ? (x as T) : d);
const bool = (x: unknown, d: boolean) => (typeof x === "boolean" ? x : d);

function readSlot(x: unknown): Slot | null {
  if (!isObj(x)) return null;
  const s = isObj(x.settings) ? x.settings : {};
  const vol = isObj(s.volume) ? s.volume : {};
  const k = isObj(x.keeper) ? x.keeper : {};
  const quests: Record<string, QuestRecord> = {};
  for (const [id, q] of Object.entries(isObj(x.quests) ? x.quests : {})) {
    if (!isObj(q) || !/^[a-z0-9-]{1,40}$/.test(id)) continue;
    quests[id] = { done: bool(q.done, false), bestTurns: typeof q.bestTurns === "number" && q.bestTurns >= 0 ? Math.floor(q.bestTurns) : null, curiosity: bool(q.curiosity, false), ingenuity: bool(q.ingenuity, false), kindness: bool(q.kindness, false), feather: bool(q.feather, false) };
  }
  return {
    settings: {
      style: oneOf(s.style, ["story", "explorer", "challenge"] as const, DEFAULT_SETTINGS.style),
      quality: oneOf(s.quality, ["low", "medium", "high"] as const, DEFAULT_SETTINGS.quality),
      reducedMotion: bool(s.reducedMotion, false),
      highContrast: bool(s.highContrast, false),
      textScale: clamp(s.textScale, 1, 1.6, 1),
      textSpeed: clamp(s.textSpeed, 0, 120, 40),
      volume: { ambience: clamp(vol.ambience, 0, 1, 0.6), voices: clamp(vol.voices, 0, 1, 0.8), effects: clamp(vol.effects, 0, 1, 0.8) },
      muted: bool(s.muted, false),
      captions: bool(s.captions, true),
    },
    keeper: { kind: Math.floor(clamp(k.kind, 0, 1, 1)), skin: Math.floor(clamp(k.skin, 0, 3, 1)), outfit: Math.floor(clamp(k.outfit, 0, 2, 0)), hair: Math.floor(clamp(k.hair, 0, 3, 0)) },
    quests,
  };
}

/** Migrations from each released version to the next. There is one version so far, so there are none; the table is
 * here so that the first change of shape has a place to go and a test that insists on it. */
export const MIGRATIONS: Record<number, (old: Record<string, unknown>) => Record<string, unknown>> = {};

export type ReadResult = { kind: "ok" | "fresh"; save: SaveFile } | { kind: "quarantined"; save: SaveFile; raw: string } | { kind: "newer"; save: SaveFile; version: number };

/** Turns what was stored into a save that can be trusted. Never throws. */
export function readSave(raw: string | null): ReadResult {
  if (raw === null || raw === "") return { kind: "fresh", save: newSave() };
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { kind: "quarantined", save: newSave(), raw };
  }
  if (!isObj(data) || typeof data.v !== "number" || !Array.isArray(data.slots)) return { kind: "quarantined", save: newSave(), raw };
  if (data.v > SAVE_VERSION) return { kind: "newer", save: newSave(), version: data.v };
  let d = data;
  for (let v = data.v as number; v < SAVE_VERSION; v++) {
    const up = MIGRATIONS[v];
    if (!up) return { kind: "quarantined", save: newSave(), raw };
    d = up(d);
  }
  const slots = Array.from({ length: SLOTS }, (_, i) => readSlot((d.slots as unknown[])[i]));
  const slot = Math.floor(clamp(d.slot, 0, SLOTS - 1, 0));
  if (!slots[slot]) slots[slot] = newSlot();
  return { kind: "ok", save: { v: SAVE_VERSION, slot, slots } };
}
export const writeSave = (s: SaveFile): string => JSON.stringify(s);
export const current = (s: SaveFile): Slot => s.slots[s.slot]!;

/** A quest's record after one more play: the best of each thing is kept. */
export function recordQuest(slot: Slot, id: string, r: { turns: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean }): Slot {
  const old = slot.quests[id];
  return {
    ...slot,
    quests: {
      ...slot.quests,
      [id]: { done: true, bestTurns: old?.bestTurns == null ? r.turns : Math.min(old.bestTurns, r.turns), curiosity: r.curiosity || !!old?.curiosity, ingenuity: r.ingenuity || !!old?.ingenuity, kindness: r.kindness || !!old?.kindness, feather: r.feather || !!old?.feather },
    },
  };
}

/**
 * What this page holds, joined with what is in storage now. Another tab of the game may have saved since this one
 * read: its finished quests are kept, each at the best of the two, so that one tab never undoes another's progress.
 * Settings, the Storykeeper and the slot in use are this page's own.
 */
export function mergeSaves(mine: SaveFile, stored: SaveFile): SaveFile {
  return {
    ...mine,
    slots: mine.slots.map((slot, i) => {
      const other = stored.slots[i];
      if (!other) return slot;
      if (!slot) return other;
      let merged = slot;
      for (const [id, q] of Object.entries(other.quests)) {
        if (!q.done) continue;
        const had = merged.quests[id];
        merged = had ? recordQuest(merged, id, { turns: q.bestTurns ?? had.bestTurns ?? 0, curiosity: q.curiosity, ingenuity: q.ingenuity, kindness: q.kindness, feather: q.feather }) : { ...merged, quests: { ...merged.quests, [id]: q } };
        if (had && had.bestTurns === null && q.bestTurns === null) merged.quests[id]!.bestTurns = null;
      }
      return merged;
    }),
  };
}

export interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
/** Reads through a storage that may be missing or may throw (private windows, blocked storage), and says what it found. */
export function load(storage: Storage | null): ReadResult & { stored: boolean } {
  if (!storage) return { ...readSave(null), stored: false };
  let raw: string | null;
  try {
    raw = storage.getItem(SAVE_KEY);
  } catch {
    return { ...readSave(null), stored: false };
  }
  const r = readSave(raw);
  if (r.kind === "quarantined") {
    try {
      storage.setItem(QUARANTINE_KEY, r.raw);
    } catch {
      /* the broken save stays where it is; nothing is written over it */
      return { ...r, stored: false };
    }
  }
  return { ...r, stored: r.kind !== "newer" };
}
/** Writes, and reports whether it could. A newer game's save is never written over: pass `allowed` from load(). */
export function store(storage: Storage | null, s: SaveFile, allowed: boolean): boolean {
  if (!storage || !allowed) return false;
  try {
    // Read what is there first: another tab may have finished a quest since this page loaded.
    const now = readSave(storage.getItem(SAVE_KEY));
    storage.setItem(SAVE_KEY, writeSave(now.kind === "ok" ? mergeSaves(s, now.save) : s));
    return true;
  } catch {
    return false;
  }
}
