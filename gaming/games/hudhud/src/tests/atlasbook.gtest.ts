// The picture of the open Atlas: where each world's medallion lies, and what a point of the picture is over. The same
// picture is read both ways: on a right-to-left page the worlds run from the right, world 1 at the top right.
import { describe, expect, it } from "vitest";
import atlas from "../content/atlas.v1.json";
import { ATLASBOOK, atlasHit, worldCentre } from "../art/atlasbook";

const ORDERS = Array.from({ length: ATLASBOOK.worlds }, (_, i) => i + 1);

describe("the picture of the open Atlas", () => {
  it("has a medallion for each world of the Atlas, five to a page, and no more", () => {
    expect(ATLASBOOK.worlds).toBe(atlas.worlds.length);
    expect(atlas.worlds.map((w) => w.order)).toEqual(ORDERS);
    expect(ORDERS.filter((o) => worldCentre(o, false)!.x < ATLASBOOK.w / 2)).toEqual([1, 2, 3, 4, 5]);
    expect(ORDERS.filter((o) => worldCentre(o, true)!.x > ATLASBOOK.w / 2)).toEqual([1, 2, 3, 4, 5]);
  });
  it("keeps every medallion, its ring and its page marks inside the picture and apart from the others", () => {
    for (const rtl of [false, true]) {
      for (const a of ORDERS) {
        const p = worldCentre(a, rtl)!;
        expect(p.x - ATLASBOOK.ring).toBeGreaterThan(0);
        expect(p.x + ATLASBOOK.ring).toBeLessThan(ATLASBOOK.w);
        expect(p.y - ATLASBOOK.ring).toBeGreaterThan(0);
        expect(p.y + ATLASBOOK.marks + 8).toBeLessThan(ATLASBOOK.h);
        for (const b of ORDERS) if (a < b) expect(Math.hypot(p.x - worldCentre(b, rtl)!.x, p.y - worldCentre(b, rtl)!.y)).toBeGreaterThan(2 * ATLASBOOK.reach);
      }
    }
  });
  it("finds the world under a point, left to right", () => {
    for (const o of ORDERS) {
      const c = worldCentre(o, false)!;
      expect(atlasHit(c.x, c.y, false)).toBe(o);
      expect(atlasHit(c.x + ATLASBOOK.reach - 1, c.y, false)).toBe(o);
      expect(atlasHit(c.x, c.y - ATLASBOOK.reach + 1, false)).toBe(o);
    }
    // World 1 is at the top left; world 10 is the right-hand medallion of the lower row of the right-hand page.
    expect(atlasHit(132, 135, false)).toBe(1);
    expect(atlasHit(799, 312, false)).toBe(10);
    expect(atlasHit(868, 135, false)).toBe(8);
  });
  it("finds the world under a point, right to left, as the same picture turned about its middle", () => {
    for (const o of ORDERS) {
      const c = worldCentre(o, true)!;
      expect(atlasHit(c.x, c.y, true)).toBe(o);
      expect(c.x).toBeCloseTo(ATLASBOOK.w - worldCentre(o, false)!.x, 9);
      expect(c.y).toBe(worldCentre(o, false)!.y);
    }
    // World 1 is at the top right, and the same point is a different world on a left-to-right page.
    expect(atlasHit(868, 135, true)).toBe(1);
    expect(atlasHit(868, 135, false)).toBe(8);
    expect(atlasHit(132, 135, true)).toBe(atlasHit(868, 135, false));
  });
  it("finds nothing between medallions, on the spine, on the cover or outside the picture", () => {
    for (const rtl of [false, true]) {
      expect(atlasHit(500, 230, rtl)).toBeNull();
      expect(atlasHit(500, 135, rtl)).toBeNull();
      expect(atlasHit(10, 10, rtl)).toBeNull();
      expect(atlasHit(ATLASBOOK.w - 10, ATLASBOOK.h - 10, rtl)).toBeNull();
      expect(atlasHit(-50, 135, rtl)).toBeNull();
      expect(atlasHit(300, 9999, rtl)).toBeNull();
      expect(atlasHit(Number.NaN, 135, rtl)).toBeNull();
      const a = worldCentre(1, rtl)!;
      const b = worldCentre(2, rtl)!;
      expect(atlasHit((a.x + b.x) / 2, a.y, rtl)).toBeNull();
      expect(atlasHit(b.x, (ATLASBOOK.rowY[0] + ATLASBOOK.rowY[1]) / 2, rtl)).toBeNull();
    }
  });
  it("gives no centre to a number that is not a world", () => {
    for (const bad of [0, 11, -1, 1.5, Number.NaN]) expect(worldCentre(bad, false)).toBeNull();
  });
});
