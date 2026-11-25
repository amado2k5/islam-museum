import { describe, expect, it } from "vitest";
import { Rng, fbm, hash32, valueNoise } from "../src/prng";
import { FrameRecorder, percentile, summarize } from "../src/framestats";

describe("Rng", () => {
  it("gives the same stream for the same seed, on every run", () => {
    const a = new Rng(12345);
    const b = new Rng(12345);
    for (let i = 0; i < 1000; i++) expect(a.u32()).toBe(b.u32());
  });

  // Reference values recorded from this implementation on 25 November 2026. A change here is a breaking change to
  // every seed-derived result (saves, replays, daily challenges) and needs a version bump and a migration, not an edit.
  it("is pinned: these values must never change, or every saved game and daily challenge changes with them", () => {
    const r = new Rng("islam.museum");
    expect([r.u32(), r.u32(), r.u32(), r.u32()]).toEqual([4045057720, 818828630, 3507393912, 51959374]);
    expect(hash32("golden-age")).toBe(2503814970);
  });

  it("resumes from a saved state", () => {
    const a = new Rng(99);
    for (let i = 0; i < 17; i++) a.next();
    const b = new Rng(a.state());
    for (let i = 0; i < 100; i++) expect(b.u32()).toBe(a.u32());
  });

  it("forks independent streams without advancing the parent", () => {
    const a = new Rng(7);
    const before = a.state();
    const f1 = a.fork("houses");
    const f2 = a.fork("trees");
    expect(a.state()).toEqual(before);
    expect(f1.u32()).not.toBe(f2.u32());
    expect(new Rng(7).fork("houses").u32()).toBe(new Rng(7).fork("houses").u32());
  });

  it("int() covers its range without bias toward either end", () => {
    const r = new Rng(3);
    const counts = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 60000; i++) counts[r.int(1, 6) - 1]!++;
    for (const c of counts) expect(Math.abs(c - 10000)).toBeLessThan(450);
    expect(() => r.int(3, 2)).toThrow();
  });

  it("weighted() never picks a zero-weight item", () => {
    const r = new Rng(5);
    for (let i = 0; i < 2000; i++) expect(r.weighted(["a", "b", "c"], [1, 0, 3])).not.toBe("b");
    expect(() => r.weighted(["a"], [0])).toThrow();
  });

  it("shuffle() keeps every item exactly once", () => {
    const items = Array.from({ length: 50 }, (_, i) => i);
    expect(new Rng(11).shuffle([...items]).sort((x, y) => x - y)).toEqual(items);
  });
});

describe("noise", () => {
  it("stays in [0, 1] and tiles at its period", () => {
    for (let i = 0; i < 500; i++) {
      const x = i * 0.137;
      const y = i * 0.291;
      const v = valueNoise(x, y, 4, 8);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
      expect(valueNoise(x + 8, y, 4, 8)).toBeCloseTo(v, 10);
      expect(valueNoise(x, y + 8, 4, 8)).toBeCloseTo(v, 10);
      expect(fbm(x + 4, y, 9, 4, 4)).toBeCloseTo(fbm(x, y, 9, 4, 4), 10);
    }
  });
});

describe("frame statistics", () => {
  it("uses nearest-rank percentiles", () => {
    const sorted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(percentile(sorted, 50)).toBe(5);
    expect(percentile(sorted, 95)).toBe(10);
    expect(percentile(sorted, 10)).toBe(1);
    expect(Number.isNaN(percentile([], 50))).toBe(true);
  });

  it("counts frames that miss the 60 Hz and 30 Hz deadlines", () => {
    const s = summarize([8, 8, 8, 20, 40, 60]);
    expect(s.frames).toBe(6);
    expect(s.over16_7).toBe(3);
    expect(s.over33_3).toBe(2);
    expect(s.over50).toBe(1);
    expect(s.maxMs).toBe(60);
    expect(s.avgFps).toBeCloseTo(6000 / 144, 2);
  });

  it("records intervals between ticks and stops at capacity", () => {
    const r = new FrameRecorder(3);
    for (const t of [0, 10, 25, 30, 100, 200]) r.tick(t);
    expect([...r.intervals()]).toEqual([10, 15, 5]);
    r.reset();
    expect(r.length).toBe(0);
  });
});
