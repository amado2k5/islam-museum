// The ways people walk in the valley: round every house and the pool, and over the river only by the bridge.
import { describe, expect, it } from "vitest";
import { BOUNDS, BRIDGE, FIELDS, MARKET, POOL, RIVER_HALF, STORE, VILLAGE, buildScenery, riverZ } from "../src/view/valley";
import { clear, fieldTo, limbMatrix, route, walkGrid, walkOf, along, type WalkGrid } from "../src/view/paths";
import { instanceMatrix } from "@im/worldkit/mesh";

const scenery = buildScenery(7, { authoredTown: true, authoredHill: true });
const grid: WalkGrid = walkGrid({ footprints: scenery.footprints, riverZ, riverHalf: RIVER_HALF, bridge: { x: BRIDGE.x, halfWidth: BRIDGE.width / 2 - 0.5 }, pool: POOL, bounds: BOUNDS });
const centre = (id: string): [number, number] => {
  const p = FIELDS[id]!;
  return [(p[0]![0] + p[2]![0]) / 2, (p[0]![1] + p[2]![1]) / 2];
};
const places: Array<[number, number]> = [[STORE[0], STORE[1] + 12], [MARKET[0], MARKET[1]], [POOL.x - 44, POOL.z + 30], centre("river-meadow"), centre("mill-field"), centre("olive-terrace")];
const homes: Array<[number, number]> = Array.from({ length: 24 }, (_, i) => [VILLAGE[0] + ((i * 37) % 90) - 30, VILLAGE[1] + ((i * 53) % 40) - 6]);

/** Every point a metre apart along a route. */
const sample = (pts: Array<readonly [number, number]>): Array<[number, number]> => {
  const out: Array<[number, number]> = [];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]!;
    const b = pts[i]!;
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1])));
    for (let s = 0; s <= n; s++) out.push([a[0] + ((b[0] - a[0]) * s) / n, a[1] + ((b[1] - a[1]) * s) / n]);
  }
  return out;
};

describe("the ways people walk", () => {
  it("goes from every home to every place of work without passing through a house, the pool or the river", () => {
    for (const to of places) {
      const field = fieldTo(grid, to);
      for (const from of homes) {
        const way = route(grid, field, from, to);
        expect(way, `no way from ${from} to ${to}`).not.toBeNull();
        // Its first and last stretch may begin in a doorway; every point after the first step is in the open.
        const points = sample(way!).slice(3, -3);
        for (const [x, z] of points) {
          for (const f of scenery.footprints) expect(Math.hypot(f.x - x, f.z - z), `through a building at ${x.toFixed(0)}, ${z.toFixed(0)}`).toBeGreaterThan(f.r);
          expect(Math.hypot(x - POOL.x, z - POOL.z)).toBeGreaterThan(POOL.r);
          if (Math.abs(z - riverZ(x)) < RIVER_HALF) expect(Math.abs(x - BRIDGE.x), `in the river at ${x.toFixed(0)}, ${z.toFixed(0)}`).toBeLessThan(BRIDGE.width / 2);
        }
      }
    }
  });

  it("crosses the river by the bridge when it has to", () => {
    const north: [number, number] = [BRIDGE.x + 60, riverZ(BRIDGE.x + 60) - RIVER_HALF - 30];
    const south: [number, number] = [BRIDGE.x - 60, riverZ(BRIDGE.x - 60) + RIVER_HALF + 30];
    const way = route(grid, fieldTo(grid, north), south, north)!;
    expect(way).not.toBeNull();
    const crossing = sample(way).filter(([x, z]) => Math.abs(z - riverZ(x)) < RIVER_HALF);
    expect(crossing.length).toBeGreaterThan(0);
    for (const [x] of crossing) expect(Math.abs(x - BRIDGE.x)).toBeLessThan(BRIDGE.width / 2);
  });

  it("cuts corners only where the line is clear, and takes a straight line where nothing is in the way", () => {
    const a: [number, number] = [-300, 250];
    const b: [number, number] = [-250, 260];
    expect(clear(grid, a, b)).toBe(true);
    expect(route(grid, fieldTo(grid, b), a, b)).toEqual([a, b]);
  });

  it("finds a place along a way and the way it faces", () => {
    const w = walkOf([[0, 0], [10, 0], [10, 10]]);
    expect(w.length).toBe(20);
    const at = { x: 0, z: 0, yaw: 0 };
    along(w, 15, at);
    expect([at.x, at.z]).toEqual([10, 5]);
    expect(at.yaw).toBeCloseTo(0);
    along(w, 5, at);
    expect(at.yaw).toBeCloseTo(Math.PI / 2);
  });

  it("swings a limb about its joint and keeps the joint where the body has it", () => {
    const body = new Float32Array(16);
    instanceMatrix(body, 0, 5, 1, 7, 0.4, 1, 1, 1);
    const leg = new Float32Array(16);
    limbMatrix(leg, 0, body, 0, 0.2, 0.9, 0.6, 0.5);
    // The joint: the body's matrix applied to the joint's own place.
    const c = Math.cos(0.4);
    const s = Math.sin(0.4);
    expect(leg[12]).toBeCloseTo(5 + c * 0.2 + s * 0.6);
    expect(leg[13]).toBeCloseTo(1 + 0.9);
    expect(leg[14]).toBeCloseTo(7 - s * 0.2 + c * 0.6);
    // A swing of nothing is the body's own turn.
    limbMatrix(leg, 0, body, 0, 0, 0, 0, 0);
    for (const k of [0, 1, 2, 4, 5, 6, 8, 9, 10]) expect(leg[k]).toBeCloseTo(body[k]!);
  });
});
