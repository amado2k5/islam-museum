import { describe, expect, it } from "vitest";
import { edtfRange } from "./lib";

describe("edtfRange", () => {
  it("gives a year its whole span", () => {
    const r = edtfRange("1079");
    expect(r.earliest).toBeCloseTo(1079, 0);
    expect(r.latest).toBeGreaterThan(r.earliest);
    expect(r.latest).toBeLessThan(1080.01);
  });

  it("gives a closed interval both ends", () => {
    const r = edtfRange("1079/1100");
    expect(r.earliest).toBeCloseTo(1079, 0);
    expect(r.latest).toBeCloseTo(1101, 0);
  });

  // 6 Nov 2026: person/ibn-muadh-al-jayyani had died "1079/..", the library returned Infinity, graph.json got null, and
  // derive.ts crashed on it, which failed every build of main.
  it("never returns a bound that is not a finite number for an open-ended interval", () => {
    for (const s of ["1079/..", "1079/", "../1079", "/1079"]) {
      let r;
      try { r = edtfRange(s); } catch { continue; } // an input the library cannot parse is allowed to throw
      expect(Number.isFinite(r.earliest), s).toBe(true);
      expect(Number.isFinite(r.latest), s).toBe(true);
      expect(r.earliest).toBeLessThanOrEqual(r.latest);
    }
  });

  it("puts an open end on the known side, so nothing is invented", () => {
    const after = edtfRange("1079/..");
    expect(after.earliest).toBeCloseTo(1079, 0);
    expect(after.latest).toBeCloseTo(after.earliest, 6);
    const before = edtfRange("../1079");
    expect(before.latest).toBeLessThan(1080.01);
    expect(before.earliest).toBeCloseTo(before.latest, 6);
  });

  it("refuses an interval that is open on both sides", () => {
    expect(() => edtfRange("../..")).toThrow();
  });
});
