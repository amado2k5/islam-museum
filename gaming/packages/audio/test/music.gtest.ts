// The games' music: the record of what was imported, the order a game plays it in, and the player's choices.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { AUDIO_PREFS_KEY, DEFAULT_PREFS, SUITE, TRACKS, gainOf, playlistFrom, readPrefs, writePrefs } from "../src/music";

describe("the suite", () => {
  it("is the museum's six tracks, in album order, each with a digest of the file that was imported", () => {
    expect(SUITE).toBe("Voices of the Museum");
    expect(TRACKS.map((t) => t.title)).toEqual(["Fourteen Centuries", "The Ancient Library", "The First Light", "Threshold of the Unknown", "The Unbroken Seals", "Leaving the Museum"]);
    expect(TRACKS.map((t) => t.n)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(new Set(TRACKS.map((t) => t.id)).size).toBe(6);
    for (const t of TRACKS) {
      expect(t.file).toBe(`${String(t.n).padStart(2, "0")}-${t.id}.m4a`);
      expect(t.sha256).toMatch(/^[0-9a-f]{64}$/);
      expect(t.seconds).toBeGreaterThan(120);
      expect(t.seconds).toBeLessThan(240);
      // About 160 kbit/s: a track of this length is three to four megabytes, small enough to stream on a phone.
      expect(t.bytes).toBeGreaterThan(2_000_000);
      expect(t.bytes).toBeLessThan(5_000_000);
    }
  });

  it("says where the music comes from in the words the museum itself uses", () => {
    const manifest = JSON.parse(readFileSync(new URL("../music.json", import.meta.url), "utf8")) as { provenance: string; tracks: Array<{ source: { gainDb: number; truePeakDb: number } }> };
    expect(manifest.provenance).toContain("AI-generated");
    expect(manifest.provenance).toContain("oud");
    // The levelling gain never pushes a track's peak past the ceiling.
    for (const t of manifest.tracks) expect(t.source.truePeakDb + t.source.gainDb).toBeLessThanOrEqual(-1.4);
  });

  it("plays the whole suite from a game's opening track and wraps round", () => {
    const list = playlistFrom("the-first-light");
    expect(list.map((t) => t.n)).toEqual([3, 4, 5, 6, 1, 2]);
    expect(playlistFrom("fourteen-centuries").map((t) => t.n)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(playlistFrom("no-such-track").map((t) => t.n)).toEqual([1, 2, 3, 4, 5, 6]);
  });
});

describe("the player's choices", () => {
  it("are read safely, whatever is in storage", () => {
    expect(AUDIO_PREFS_KEY).toBe("im.play.audio.v1");
    expect(readPrefs(null)).toEqual(DEFAULT_PREFS);
    expect(readPrefs("{not json")).toEqual(DEFAULT_PREFS);
    expect(readPrefs('"text"')).toEqual(DEFAULT_PREFS);
    expect(readPrefs(JSON.stringify({ v: 2, music: false }))).toEqual(DEFAULT_PREFS);
    expect(readPrefs(JSON.stringify({ v: 1, music: false, volume: 9 }))).toEqual({ v: 1, music: false, volume: 1 });
    expect(readPrefs(JSON.stringify({ v: 1, music: "yes", volume: "loud" }))).toEqual(DEFAULT_PREFS);
    const chosen = { v: 1 as const, music: false, volume: 0.2 };
    expect(readPrefs(writePrefs(chosen))).toEqual(chosen);
  });

  it("turn the slider into loudness smoothly", () => {
    expect(gainOf(0)).toBe(0);
    expect(gainOf(1)).toBe(1);
    expect(gainOf(5)).toBe(1);
    expect(gainOf(-1)).toBe(0);
    for (let v = 0.05; v <= 1; v += 0.05) expect(gainOf(v)).toBeGreaterThan(gainOf(v - 0.05));
    expect(gainOf(DEFAULT_PREFS.volume)).toBeLessThan(0.3);
  });
});

describe("the control's words", () => {
  it("exist in all seven languages", () => {
    const table = (lang: string) => JSON.parse(readFileSync(new URL(`../i18n/${lang}.json`, import.meta.url), "utf8")) as Record<string, string>;
    const en = table("en");
    for (const lang of ["ar", "en", "ur", "fr", "es", "tr", "id"]) {
      const t = table(lang);
      expect(Object.keys(t), lang).toEqual(Object.keys(en));
      for (const [k, v] of Object.entries(t)) if (k !== "_meta") expect(v.trim().length, `${lang}.${k}`).toBeGreaterThan(0);
    }
  });
});
