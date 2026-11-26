// The museum's soundtrack as the games' music: which tracks there are, what order a game plays them in, and what
// the player has chosen about sound. Pure functions and data, shared by every game; the part that touches the
// browser's audio is player.ts.
//
// The suite is "Voices of the Museum", the museum's own six tracks. The audio files themselves are not in git
// (media does not live in the repository); music.json records what was imported, with a digest of each file.
import manifest from "../music.json";

export interface Track {
  n: number;
  id: string;
  /** The title as published. It is the name of a work and is not translated. */
  title: string;
  file: string;
  seconds: number;
  bytes: number;
  sha256: string;
}
export const SUITE: string = manifest.suite;
export const TRACKS: readonly Track[] = manifest.tracks;
export type TrackId = string;

/** The whole suite in album order, starting from a chosen track and wrapping round. An unknown id starts at track 1. */
export function playlistFrom(first: TrackId): Track[] {
  const at = Math.max(0, TRACKS.findIndex((t) => t.id === first));
  return TRACKS.map((_, i) => TRACKS[(at + i) % TRACKS.length]!);
}

// ---- What the player chose, kept on the device under one key for every game ---------------------------------------

export const AUDIO_PREFS_KEY = "im.play.audio.v1";
export interface AudioPrefs {
  v: 1;
  /** Music plays (after the player's first click or key press, never before). */
  music: boolean;
  /** 0 to 1. */
  volume: number;
}
export const DEFAULT_PREFS: AudioPrefs = { v: 1, music: true, volume: 0.45 };

/** Reads saved preferences. Never throws; anything unreadable gives the defaults. */
export function readPrefs(raw: string | null): AudioPrefs {
  if (!raw) return { ...DEFAULT_PREFS };
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    if (!o || typeof o !== "object" || o.v !== 1) return { ...DEFAULT_PREFS };
    const volume = typeof o.volume === "number" && Number.isFinite(o.volume) ? Math.max(0, Math.min(1, o.volume)) : DEFAULT_PREFS.volume;
    return { v: 1, music: typeof o.music === "boolean" ? o.music : DEFAULT_PREFS.music, volume };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}
export const writePrefs = (p: AudioPrefs): string => JSON.stringify(p);

/** Loudness is not linear in the slider: square it, so the lower half of the slider is useful. */
export const gainOf = (volume: number): number => Math.max(0, Math.min(1, volume)) ** 2;
