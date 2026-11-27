// The measurement tool's URL target. The regression held here is that Set A is measured only with `art=a`: after
// granada/p1 became the game's own palace, leaving the flag absent measured the default palace while calling it Set A.
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { palaceArtQuery, parsePalaceMeasurementSets } from "./granada-palace-target";

const here = dirname(fileURLToPath(import.meta.url));

describe("palace measurement target", () => {
  it("uses no art flag only for the game's own default palace", () => {
    expect(palaceArtQuery("default")).toBe("");
  });

  it("passes Set A and every evaluated palace explicitly", () => {
    expect(palaceArtQuery("a")).toBe("&art=a");
    expect(palaceArtQuery("c")).toBe("&art=c");
    expect(palaceArtQuery("c1")).toBe("&art=c1");
    expect(palaceArtQuery("c2")).toBe("&art=c2");
  });

  it("accepts the known sets and refuses a mistyped one", () => {
    expect(parsePalaceMeasurementSets("default,a,c,c1,c2")).toEqual(["default", "a", "c", "c1", "c2"]);
    expect(() => parsePalaceMeasurementSets("a,b")).toThrow(/unknown palace measurement set/);
  });

  it("is the target the repeated-cycle tool uses", () => {
    const cycle = readFileSync(resolve(here, "granada-palace-cycle.ts"), "utf8");
    expect(cycle).toContain("palaceArtQuery(set)");
    expect(cycle).not.toContain('set === "a" ? ""');
  });
});
