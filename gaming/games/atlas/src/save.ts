// What Atlas keeps on the player's device, and how it reads it back. Pure functions over text, so every case
// (nothing saved, an unreadable save, a save from a newer version, a game played on an older content pack) is a
// unit test and not something discovered in a browser.
import type { AtlasPack } from "./pack";
import { RULES_VERSION, type AtlasState } from "./rules";

export const SAVE_VERSION = 1;
export const SAVE_KEY = "im.atlas.save.v1";

export interface AtlasSave {
  v: typeof SAVE_VERSION;
  /** Daily games by UTC date, finished or in progress. */
  daily: Record<string, AtlasState>;
  /** How many practice games have been started: the seed of the next one. */
  practice: number;
}

export type SaveReading =
  | { status: "empty"; save: AtlasSave }
  | { status: "ok"; save: AtlasSave }
  /** The text could not be understood. `keep` is the original text, to be set aside and never destroyed. */
  | { status: "unreadable"; save: AtlasSave; keep: string }
  /** Written by a newer version of the game. It must not be overwritten: the game runs without saving. */
  | { status: "newer"; save: AtlasSave; keep: string };

export const emptySave = (): AtlasSave => ({ v: SAVE_VERSION, daily: {}, practice: 0 });

const isState = (s: unknown): s is AtlasState => {
  if (!s || typeof s !== "object") return false;
  const o = s as Record<string, unknown>;
  return typeof o.rules === "number" && typeof o.packDigest === "string" && (o.mode === "daily" || o.mode === "practice") && typeof o.key === "string" && Array.isArray(o.rounds) && o.rounds.every((n) => Number.isInteger(n)) && Number.isInteger(o.at) && typeof o.regionHint === "boolean" && Array.isArray(o.results);
};

/** Reads saved text. Never throws, and never returns a save that the rest of the game could choke on. */
export function readSave(raw: string | null): SaveReading {
  if (raw === null || raw === "") return { status: "empty", save: emptySave() };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { status: "unreadable", save: emptySave(), keep: raw };
  }
  if (!parsed || typeof parsed !== "object") return { status: "unreadable", save: emptySave(), keep: raw };
  const o = parsed as Record<string, unknown>;
  if (typeof o.v === "number" && o.v > SAVE_VERSION) return { status: "newer", save: emptySave(), keep: raw };
  if (o.v !== SAVE_VERSION || !o.daily || typeof o.daily !== "object" || Array.isArray(o.daily)) return { status: "unreadable", save: emptySave(), keep: raw };
  const daily: Record<string, AtlasState> = {};
  for (const [date, state] of Object.entries(o.daily as Record<string, unknown>)) {
    // A damaged entry is dropped on its own; the other days are kept.
    if (/^\d{4}-\d{2}-\d{2}$/.test(date) && isState(state)) daily[date] = state;
  }
  const practice = Number.isInteger(o.practice) && (o.practice as number) >= 0 ? (o.practice as number) : 0;
  return { status: "ok", save: { v: SAVE_VERSION, daily, practice } };
}

/**
 * The saved game for a date, if it can be continued: same rules version and same content pack, and consistent
 * with the pack's schedule. A game from an older pack stays in the save as a record of that day and is not resumed.
 */
export function resumable(save: AtlasSave, pack: AtlasPack, date: string, scheduled: number[]): AtlasState | null {
  const s = save.daily[date];
  if (!s || s.rules !== RULES_VERSION || s.packDigest !== pack.digest || s.mode !== "daily" || s.key !== date) return null;
  if (s.rounds.length !== scheduled.length || s.rounds.some((r, i) => r !== scheduled[i])) return null;
  if (s.at < 0 || s.at > s.rounds.length || s.results.length !== s.at) return null;
  return s;
}

export const writeSave = (save: AtlasSave): string => JSON.stringify(save);
