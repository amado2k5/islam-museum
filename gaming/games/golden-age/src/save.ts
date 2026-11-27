// What The Golden Age keeps on the player's device, and how it reads it back. Pure functions over text, so every
// case (nothing saved, an unreadable save, a save from a newer version, a state the rules would not have produced)
// is a unit test. The same pattern as Atlas's save; it becomes a shared module when a third game needs one.
import { PLOTS, RULES_VERSION, invariants, type State } from "./rules";
import { SCENARIOS } from "./scenarios";

/**
 * 3 since the merchants' loan: a version 2 save has no loan, and a version 1 save no endowments either; both are
 * brought up to date when read.
 */
export const SAVE_VERSION = 3;
export const SAVE_KEY = "im.golden-age.save.v1";

export interface GoldenAgeSave {
  v: typeof SAVE_VERSION;
  /** The game in hand, or null when none has been started. */
  state: State | null;
}

export type SaveReading =
  | { status: "empty"; save: GoldenAgeSave }
  | { status: "ok"; save: GoldenAgeSave }
  /** The text could not be understood. `keep` is the original text, to be set aside and never destroyed. */
  | { status: "unreadable"; save: GoldenAgeSave; keep: string }
  /** Written by a newer version of the game. It must not be overwritten: the game runs without saving. */
  | { status: "newer"; save: GoldenAgeSave; keep: string };

export const emptySave = (): GoldenAgeSave => ({ v: SAVE_VERSION, state: null });

const OUTCOMES = ["playing", "won", "lost-insolvent", "lost-unrest", "ended"];

/** True for a state this version of the rules can continue: right shape, right rules, known scenario, nothing broken. */
export function playable(s: unknown): s is State {
  if (!s || typeof s !== "object") return false;
  const o = s as Record<string, unknown>;
  const ints = ["rules", "seed", "season", "treasury", "grain", "households", "welfare", "knowledge", "researchProgress", "tax", "canalCondition", "intake", "loanOwed", "loanEach", "insolventSeasons", "unrestSeasons", "steadySeasons"];
  if (!ints.every((k) => Number.isSafeInteger(o[k]))) return false;
  if (o.rules !== RULES_VERSION || typeof o.scenario !== "string" || !(o.scenario in SCENARIOS)) return false;
  if (!Array.isArray(o.plots) || o.plots.length !== PLOTS || !Array.isArray(o.canals) || !Array.isArray(o.researched) || !Array.isArray(o.events)) return false;
  if (typeof o.outcome !== "string" || !OUTCOMES.includes(o.outcome)) return false;
  const rng = o.rng as Record<string, unknown> | null;
  if (!rng || typeof rng !== "object" || !["a", "b", "c", "d"].every((k) => Number.isInteger(rng[k]))) return false;
  if (!o.canals.every((k) => Number.isInteger(k) && k >= 0 && k < PLOTS * PLOTS)) return false;
  if (!Array.isArray(o.endowed) || !o.endowed.every((p) => Number.isInteger(p) && p >= 0 && p < PLOTS) || typeof o.mayEndow !== "boolean") return false;
  if (![0, 1, 2].includes(o.tax as number)) return false;
  // A report from before the welfare breakdown was recorded cannot be shown by this interface.
  if (o.last !== null && (typeof o.last !== "object" || !(o.last as Record<string, unknown>).welfareParts)) return false;
  try {
    return invariants(s as State).length === 0;
  } catch {
    return false;
  }
}

/** Reads saved text. Never throws, and never returns a state the rest of the game could choke on. */
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
  if (o.v !== SAVE_VERSION && o.v !== 1 && o.v !== 2) return { status: "unreadable", save: emptySave(), keep: raw };
  if (o.state === null) return { status: "ok", save: emptySave() };
  const state = o.v === 3 ? o.state : fromV2(o.v === 1 ? fromV1(o.state) : o.state);
  if (!playable(state)) return { status: "unreadable", save: emptySave(), keep: raw };
  return { status: "ok", save: { v: SAVE_VERSION, state } };
}

/** A version 1 game was saved before endowments existed: it has none, and its scenario says whether it may have any. */
function fromV1(state: unknown): unknown {
  if (!state || typeof state !== "object") return state;
  const o = state as Record<string, unknown>;
  const scenario = typeof o.scenario === "string" ? SCENARIOS[o.scenario] : undefined;
  return { ...o, endowed: [], mayEndow: scenario?.endowments === true };
}

/** A version 2 game was saved before the merchants' loan existed: it owes nothing. */
function fromV2(state: unknown): unknown {
  if (!state || typeof state !== "object") return state;
  return { ...(state as Record<string, unknown>), loanOwed: 0, loanEach: 0 };
}

export const writeSave = (save: GoldenAgeSave): string => JSON.stringify(save);
