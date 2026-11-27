import { describe, expect, it } from "vitest";
import { DEFAULT_EFFECTS, RECIPES, readEffectPrefs } from "../src/effects";

describe("the games' sound effects", () => {
  it("reads the player's choice, and falls back to the defaults on anything odd", () => {
    expect(readEffectPrefs(null)).toEqual(DEFAULT_EFFECTS);
    expect(readEffectPrefs("not json")).toEqual(DEFAULT_EFFECTS);
    expect(readEffectPrefs(JSON.stringify({ on: false, volume: 0.8 }))).toEqual({ on: false, volume: 0.8 });
    expect(readEffectPrefs(JSON.stringify({ on: "yes", volume: 7 }))).toEqual(DEFAULT_EFFECTS);
  });

  it("keeps every effect short and in the range a person hears comfortably", () => {
    for (const [name, r] of Object.entries(RECIPES)) {
      for (const [f, at, len] of r.tones) {
        expect(f, name).toBeGreaterThan(100);
        expect(f, name).toBeLessThan(2000);
        expect(at + len, name).toBeLessThanOrEqual(0.55);
      }
      if (r.noise) expect(r.noise[0] + r.noise[1], name).toBeLessThanOrEqual(0.55);
    }
  });
});
