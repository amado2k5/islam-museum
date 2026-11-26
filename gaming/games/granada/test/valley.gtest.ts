// The valley as geometry, and its camera: what can be said of them without a browser. That the picture is any good
// is a judgement made by looking at it (tools/granada-shot.ts); what is held here is that the 3D valley is the same
// ground as the plan, that its shapes are sound, and that nothing is planted where it cannot stand.
import { describe, expect, it } from "vitest";
import type { MeshData } from "@im/worldkit/mesh";
import { FIELD_SHAPE } from "../src/ui/map";
import { LIMITS, OVERVIEW, START, approach, clampPose, eyeOf, pan, turn, zoom } from "../src/view/camera";
import { oxCart, waterWheel } from "../src/view/buildings";
import { BRIDGE, MILL, MOSQUE, ROAD_NORTH, roadHeight, roadLine } from "../src/view/valley";
import { BOUNDS, CHANNELS, CHANNEL_WATER, FIELDS, HOUSE_LOTS, LAND, PLOT_GRID, POOL, RIVER_HALF, broadTree, buildLand, buildRange, buildRiver, buildScenery, channelWater, cropSpots, cypressTree, fieldAt, fieldGround, heightAt, orchardTree, plotAt, plotPoint, plotTable, poolWater, poplarTree, riverZ, settled, waterLevel, worked } from "../src/view/valley";

const SEED = 7;
const tris = (m: MeshData) => m.indices.length / 3;
function sound(m: MeshData): void {
  const n = m.positions.length / 3;
  expect(m.normals.length).toBe(n * 3);
  expect(m.colors.length).toBe(n * 3);
  expect(m.uvs.length).toBe(n * 2);
  expect(m.indices.length % 3).toBe(0);
  expect(m.indices.length).toBeGreaterThan(0);
  for (const v of m.positions) if (!Number.isFinite(v)) throw new Error("a position is not a number");
  for (const v of m.normals) if (!Number.isFinite(v)) throw new Error("a normal is not a number");
  for (const i of m.indices) if (i >= n) throw new Error("an index points past the vertices");
}
/** How many triangles of a mesh do not face up. */
function facingDown(m: MeshData): number {
  let down = 0;
  const p = m.positions;
  for (let t = 0; t < m.indices.length; t += 3) {
    const a = m.indices[t]! * 3;
    const b = m.indices[t + 1]! * 3;
    const c = m.indices[t + 2]! * 3;
    // The y of (b - a) x (c - a).
    const y = (p[b + 2]! - p[a + 2]!) * (p[c]! - p[a]!) - (p[b]! - p[a]!) * (p[c + 2]! - p[a + 2]!);
    if (y <= 0) down += 1;
  }
  return down;
}
const scenery = buildScenery(SEED);
const planted = { cypresses: scenery.cypresses, trees: scenery.trees, citrus: scenery.citrus, almonds: scenery.almonds, gardens: scenery.gardens, poplars: scenery.poplars, scrub: scenery.scrub, palms: scenery.palms };

describe("the valley and the plan are the same ground", () => {
  it("has the plan's three fields, corner for corner", () => {
    expect(Object.keys(FIELDS).sort()).toEqual(Object.keys(FIELD_SHAPE).sort());
    for (const [id, shape] of Object.entries(FIELD_SHAPE)) {
      const corners = shape.points.split(" ").map((pair) => pair.split(",").map(Number));
      expect(FIELDS[id]!.map((p) => [p[0] + 500, p[1] + 280])).toEqual(corners);
    }
  });

  it("knows which field a point is in, and that the village, the pool and the river are in none", () => {
    for (const [id, poly] of Object.entries(FIELDS)) {
      const cx = poly.reduce((a, p) => a + p[0], 0) / poly.length;
      const cz = poly.reduce((a, p) => a + p[1], 0) / poly.length;
      expect(fieldAt(cx, cz)).toBe(id);
    }
    expect(fieldAt(110, 186)).toBeNull();
    expect(fieldAt(POOL.x, POOL.z)).toBeNull();
    expect(fieldAt(0, riverZ(0))).toBeNull();
  });

  it("keeps the olive terrace east of the mill field, as the plan has it", () => {
    const east = (id: string) => Math.min(...FIELDS[id]!.map((p) => p[0]));
    expect(east("olive-terrace")).toBeGreaterThan(Math.max(...FIELDS["mill-field"]!.map((p) => p[0])));
  });
});

describe("the land", () => {
  it("is nearly level where it is sown, steps up through the terraces, and dips at the river and the pool", () => {
    for (const id of ["mill-field", "river-meadow"]) {
      const poly = FIELDS[id]!;
      const hs = poly.map((p) => heightAt(p[0], p[1], SEED));
      expect(Math.max(...hs) - Math.min(...hs)).toBeLessThan(6.5);
    }
    // The terraces climb eastward.
    expect(heightAt(460, 90, SEED)).toBeGreaterThan(heightAt(240, 90, SEED) + 5);
    // The river's bed lies below its banks, and its water between the two.
    for (const x of [-400, 0, 300]) {
      const bed = heightAt(x, riverZ(x), SEED);
      const bank = heightAt(x, riverZ(x) + RIVER_HALF + 30, SEED);
      expect(bed).toBeLessThan(bank - 2);
      expect(waterLevel(x)).toBeGreaterThan(bed);
      expect(waterLevel(x)).toBeLessThan(bank);
    }
    expect(heightAt(POOL.x, POOL.z, SEED)).toBeLessThan(heightAt(POOL.x + POOL.r + 12, POOL.z, SEED) - 2);
  });

  it("is a sound mesh that faces up everywhere, and reaches far past the playable ground", () => {
    const land = buildLand(SEED);
    sound(land);
    expect(facingDown(land)).toBe(0);
    let far = 0;
    for (let i = 0; i < land.positions.length; i += 3) far = Math.max(far, Math.abs(land.positions[i]!), Math.abs(land.positions[i + 2]!));
    expect(far).toBeGreaterThan(8000);
  });

  it("carries, at each point, how far it is worked plain: wholly in the Vega, not at all in the village or on the river", () => {
    expect(worked(-600, 300, 0)).toBe(1);
    expect(worked(110, 186, 0)).toBe(0);
    expect(settled(110, 186)).toBe(1);
    expect(worked(0, riverZ(0), 0)).toBe(0);
    expect(worked(1200, 0, 0)).toBe(0);
    // Steep ground is not ploughed.
    expect(worked(-600, 300, 0.3)).toBe(0);
  });

  it("has a range behind it that is sound, faces up, and carries snow on its heights only", () => {
    const range = buildRange(SEED);
    sound(range);
    expect(facingDown(range)).toBe(0);
    let top = 0;
    let snowLow = Infinity;
    let darkHigh = 0;
    for (let i = 0; i < range.positions.length; i += 3) {
      const h = range.positions[i + 1]!;
      top = Math.max(top, h);
      const white = range.colors[i]! > 0.85 && range.colors[i + 1]! > 0.85;
      if (white) snowLow = Math.min(snowLow, h);
      else darkHigh = Math.max(darkHigh, h);
    }
    expect(top).toBeGreaterThan(500);
    expect(snowLow).toBeGreaterThan(240);
    // Every vertex of the range lies east of the playable ground.
    for (let i = 0; i < range.positions.length; i += 3) expect(range.positions[i]!).toBeGreaterThan(BOUNDS.x1);
    void darkHigh;
  });
});

describe("the plots of the plain", () => {
  it("has a table with one texel for every plot the land can show", () => {
    const table = plotTable(SEED);
    expect([table.width, table.height]).toEqual([PLOT_GRID.w, PLOT_GRID.h]);
    for (const data of [table.base, table.row, table.params]) expect(data.length).toBe(PLOT_GRID.w * PLOT_GRID.h * 4);
    for (const [x, z] of [[LAND.x0, LAND.z0], [LAND.x1, LAND.z0], [LAND.x0, LAND.z1], [LAND.x1, LAND.z1], [0, 0]] as const) {
      const p = plotAt(x, z, SEED);
      expect(p.cu).toBeGreaterThanOrEqual(PLOT_GRID.u0);
      expect(p.cu).toBeLessThan(PLOT_GRID.u0 + PLOT_GRID.w);
      expect(p.cv).toBeGreaterThanOrEqual(PLOT_GRID.v0);
      expect(p.cv).toBeLessThan(PLOT_GRID.v0 + PLOT_GRID.h);
    }
  });

  it("finds the same plot from a point as from the plot's own measure", () => {
    for (const [cu, cv] of [[0, 0], [-7, 12], [9, -20], [15, 3]] as const) {
      const [x, z] = plotPoint((cu + 0.5) * PLOT_GRID.du, (cv + 0.5) * PLOT_GRID.dv);
      const p = plotAt(x, z, SEED);
      expect([p.cu, p.cv]).toEqual([cu, cv]);
      expect(p.edge).toBeCloseTo(0.5, 5);
    }
  });

  it("has plots of every kind, so the plain is a patchwork and not one colour", () => {
    const kinds = new Set<string>();
    for (let cu = -8; cu < 8; cu++) for (let cv = -8; cv < 8; cv++) kinds.add(plotAt(...plotPoint((cu + 0.5) * PLOT_GRID.du, (cv + 0.5) * PLOT_GRID.dv), SEED).kind);
    expect([...kinds].sort()).toEqual(["green", "orchard", "ploughed", "stubble", "young"]);
  });
});

describe("what stands in the valley", () => {
  it("is the same every time for the same seed", () => {
    const again = buildScenery(SEED);
    expect(again.trees).toEqual(scenery.trees);
    expect(again.citrus.length).toBe(scenery.citrus.length);
    expect(again.triangles).toBe(scenery.triangles);
  });

  it("plants nothing in a field, in the pool, in the river or inside a building", () => {
    for (const [kind, spots] of Object.entries(planted)) {
      expect(spots.length, kind).toBeGreaterThan(10);
      for (const s of spots) {
        const [x, , z] = s as [number, number, number];
        if (fieldAt(x, z) !== null) throw new Error(`${kind} in ${fieldAt(x, z)} at ${x}, ${z}`);
        if (Math.hypot(x - POOL.x, z - POOL.z) < POOL.r + 2) throw new Error(`${kind} in the pool`);
        if (Math.abs(z - riverZ(x)) < RIVER_HALF + 4 && x < 1200) throw new Error(`${kind} in the river at ${x}, ${z}`);
      }
    }
    for (const s of scenery.palms) for (const f of scenery.footprints) expect(Math.hypot(f.x - s[0]!, f.z - s[2]!)).toBeGreaterThan(f.r);
  });

  it("plants orchards only in orchard plots, in rows", () => {
    for (const s of [...scenery.citrus, ...scenery.almonds]) expect(plotAt(s[0]!, s[2]!, SEED).kind).toBe("orchard");
    expect(scenery.citrus.length + scenery.almonds.length).toBeGreaterThan(1500);
  });

  it("stands every tree on the land", () => {
    for (const spots of Object.values(planted)) for (const s of spots) expect(s[1]!).toBeCloseTo(heightAt(s[0]!, s[2]!, SEED), 4);
  });

  it("has a lot for every house that can be built, on trodden ground and clear of the others", () => {
    expect(HOUSE_LOTS.length).toBe(10);
    HOUSE_LOTS.forEach((a, i) => {
      expect(settled(a.x, a.z)).toBeGreaterThan(0.9);
      expect(fieldAt(a.x, a.z)).toBeNull();
      HOUSE_LOTS.forEach((b, j) => {
        if (i !== j) expect(Math.hypot(a.x - b.x, a.z - b.z)).toBeGreaterThan(30);
      });
    });
    expect(scenery.houses.length).toBe(HOUSE_LOTS.length);
    for (const chunks of scenery.houses) for (const c of chunks) sound(c.mesh);
  });

  it("builds sound meshes for everything it draws", () => {
    for (const c of [...scenery.chunks, ...scenery.granary, ...scenery.meadowChannel]) sound(c.mesh);
    for (const m of [buildRiver(), poolWater(), ...Object.keys(FIELDS).map((id) => fieldGround(id, SEED))]) {
      sound(m);
      expect(facingDown(m)).toBe(0);
    }
  });

  it("keeps a light shape of each tree for far off, a fraction of the full one", () => {
    for (const [near, far] of [[broadTree(SEED, false), broadTree(SEED, true)], [orchardTree(SEED, false), orchardTree(SEED, true)], [poplarTree(false), poplarTree(true)], [cypressTree(false), cypressTree(true)]] as const) {
      sound(near);
      sound(far);
      expect(tris(far)).toBeLessThanOrEqual(60);
      expect(tris(far)).toBeLessThan(tris(near) / 2.5);
    }
  });

  it("stays inside what a browser can draw smoothly", () => {
    // Measured on 25 November 2026: about 1.8 million triangles a frame from the first view, at 120 frames a second.
    expect(scenery.triangles).toBeLessThan(120_000);
    const full = tris(orchardTree(SEED, false)) * (scenery.citrus.length + scenery.almonds.length + scenery.scrub.length) + tris(broadTree(SEED, false)) * scenery.trees.length + tris(poplarTree(false)) * scenery.poplars.length + tris(cypressTree(false)) * scenery.cypresses.length;
    // Were every tree drawn in full, and again for its shadow, a frame would carry over two million triangles more: hence the light shapes.
    expect(full).toBeGreaterThan(1_000_000);
  });
});

describe("the mosque, the mill, the bridge and the roads", () => {
  it("keeps room for the mosque and the mill, with nothing planted or built into them", () => {
    for (const [x, z] of [MOSQUE, MILL]) expect(scenery.footprints.some((f) => Math.hypot(f.x - x, f.z - z) < f.r)).toBe(true);
    for (const lot of HOUSE_LOTS) expect(Math.hypot(lot.x - MOSQUE[0], lot.z - (MOSQUE[1] - 6))).toBeGreaterThan(24);
    for (const spots of Object.values(planted)) for (const s of spots) for (const f of scenery.footprints) if (Math.hypot(f.x - s[0]!, f.z - s[2]!) < f.r) throw new Error(`something is planted inside a building at ${s[0]}, ${s[2]}`);
  });

  it("stands the mill's wheel in the west branch, where the water that turns it runs", () => {
    const w = scenery.wheel;
    sound(w.mesh);
    const path = CHANNELS.west!;
    let least = Infinity;
    for (let i = 0; i < path.length - 1; i++) {
      const [ax, az] = path[i]!;
      const [bx, bz] = path[i + 1]!;
      const t = Math.max(0, Math.min(1, ((w.x - ax) * (bx - ax) + (w.z - az) * (bz - az)) / ((bx - ax) ** 2 + (bz - az) ** 2)));
      least = Math.min(least, Math.hypot(w.x - ax - (bx - ax) * t, w.z - az - (bz - az) * t));
    }
    expect(least).toBeLessThan(1.5);
    // The wheel turns about its own axle: every point of it lies within its rim and its width.
    const wheel = waterWheel(3.3);
    for (let i = 0; i < wheel.positions.length; i += 3) {
      expect(Math.hypot(wheel.positions[i]!, wheel.positions[i + 1]!)).toBeLessThan(3.3 + 0.6);
      expect(Math.abs(wheel.positions[i + 2]!)).toBeLessThan(0.6);
    }
    // Its lowest paddles reach the channel's water.
    expect(w.y - 3.3).toBeLessThan(heightAt(w.x, w.z, SEED) + CHANNEL_WATER);
  });

  it("carries the road north over both channels and up to the bridge's roadway", () => {
    const deck = waterLevel(BRIDGE.x) + BRIDGE.deck;
    const end = ROAD_NORTH[ROAD_NORTH.length - 1]!;
    expect(roadHeight(end[0], end[1], SEED)).toBeCloseTo(deck, 1);
    // Far from the bridge and from any channel, the road lies on the land.
    expect(roadHeight(-600, 210, SEED)).toBeCloseTo(heightAt(-600, 210, SEED) + 0.16, 5);
    // Where it crosses a channel it goes over the channel's walls, not through them.
    let crossings = 0;
    for (const [x, z] of roadLine(ROAD_NORTH)) {
      const overChannel = Object.values(CHANNELS).some((path) => path.some((q, i) => path[i + 1] !== undefined && Math.abs(z - (q[1] + ((path[i + 1]![1] - q[1]) * (x - q[0])) / (path[i + 1]![0] - q[0] || 1))) < 1.5 && x >= Math.min(q[0], path[i + 1]![0]) && x <= Math.max(q[0], path[i + 1]![0])));
      if (!overChannel) continue;
      crossings += 1;
      expect(roadHeight(x, z, SEED)).toBeGreaterThan(heightAt(x, z, SEED) + CHANNEL_WATER + 0.4);
    }
    expect(crossings).toBeGreaterThan(0);
    // The road never drops below the land it is on.
    for (const [x, z] of roadLine(ROAD_NORTH)) expect(roadHeight(x, z, SEED)).toBeGreaterThan(heightAt(x, z, SEED));
  });

  it("has an ox-cart that is sound and of a cart's size, and roads for it to go along", () => {
    const cart = oxCart();
    sound(cart);
    let length = 0;
    for (let i = 0; i < cart.positions.length; i += 3) length = Math.max(length, Math.abs(cart.positions[i + 2]!));
    expect(length).toBeLessThan(3.6);
    expect(scenery.cartRoads.length).toBe(2);
    for (const road of scenery.cartRoads) expect(road.length).toBeGreaterThan(20);
  });
});

describe("water and crops", () => {
  it("has water in every channel, in a head and a tail, standing above the land it crosses", () => {
    for (const id of Object.keys(CHANNELS)) {
      const w = channelWater(id, SEED);
      for (const part of [w.head, w.tail]) {
        sound(part);
        expect(facingDown(part)).toBe(0);
        // The land is carved for no channel, so water under the land would not be seen at all.
        for (let i = 0; i < part.positions.length; i += 3) expect(part.positions[i + 1]!).toBeGreaterThan(heightAt(part.positions[i]!, part.positions[i + 2]!, SEED) + 0.3);
      }
    }
    expect(CHANNEL_WATER).toBeGreaterThan(0.3);
  });

  it("places a crop's plants inside its field, in the same order every time, closer for a smaller spacing", () => {
    for (const id of ["mill-field", "river-meadow"]) {
      const spots = cropSpots(id, 1.9, SEED);
      expect(spots).toEqual(cropSpots(id, 1.9, SEED));
      expect(spots.length % 5).toBe(0);
      for (let i = 0; i < spots.length; i += 5) if (fieldAt(spots[i]!, spots[i + 2]!) !== id) throw new Error(`a plant of ${id} stands outside it`);
      expect(cropSpots(id, 2.6, SEED).length).toBeLessThan(spots.length);
      expect(spots.length / 5).toBeGreaterThan(5000);
    }
  });
});

describe("the camera", () => {
  const flat = () => 0;
  it("first looks east: over the fields toward the hill town and the range", () => {
    const pose = clampPose(START, flat);
    const eye = eyeOf(pose);
    expect(eye[0]).toBeLessThan(pose.tx - 300);
    expect(eye[1]).toBeGreaterThan(pose.ty);
    expect(Math.abs(eye[2] - pose.tz)).toBeLessThan(200);
  });

  it("stays over the playable ground, and within its limits of tilt and distance", () => {
    const wild = clampPose({ tx: 9000, ty: 0, tz: -9000, yaw: 12, pitch: 3, distance: 1e6 }, flat);
    expect(wild.tx).toBe(BOUNDS.x1);
    expect(wild.tz).toBe(BOUNDS.z0);
    expect(wild.pitch).toBe(LIMITS.maxPitch);
    expect(wild.distance).toBe(LIMITS.maxDistance);
    expect(Math.abs(wild.yaw)).toBeLessThanOrEqual(Math.PI);
    const low = clampPose({ ...START, pitch: -1, distance: 1 }, flat);
    expect(low.pitch).toBe(LIMITS.minPitch);
    expect(low.distance).toBe(LIMITS.minDistance);
    // The eye is never under the land it looks at.
    expect(eyeOf(low)[1]).toBeGreaterThan(low.ty);
  });

  it("follows the land under it", () => {
    const hilly = clampPose(START, () => 40);
    expect(hilly.ty).toBeGreaterThan(clampPose(START, flat).ty + 39);
  });

  it("slides forward along its heading and sideways across it", () => {
    const east = { ...START, yaw: Math.PI / 2 };
    const ahead = pan(east, 0, 100);
    expect(ahead.tx).toBeCloseTo(east.tx + 100, 6);
    expect(ahead.tz).toBeCloseTo(east.tz, 6);
    const right = pan(east, 100, 0);
    // Looking east, right is south.
    expect(right.tz).toBeCloseTo(east.tz + 100, 6);
    expect(zoom(east, 0.5).distance).toBe(east.distance / 2);
    expect(turn(east, 0.3, 0.1).yaw).toBeCloseTo(east.yaw + 0.3, 6);
  });

  it("comes to rest on the pose it is sent to, turning the short way round", () => {
    let p = clampPose(START, flat);
    const goal = clampPose(OVERVIEW, flat);
    for (let i = 0; i < 80; i++) p = approach(p, goal, 0.2);
    expect(p.distance).toBeCloseTo(goal.distance, 3);
    expect(p.pitch).toBeCloseTo(goal.pitch, 4);
    const a = approach({ ...START, yaw: 3.1 }, { ...START, yaw: -3.1 }, 0.5);
    expect(Math.abs(a.yaw)).toBeGreaterThan(3.1);
  });
});
