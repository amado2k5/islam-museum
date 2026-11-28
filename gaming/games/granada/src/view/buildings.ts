// What is built in Granada's valley, as shapes: whitewashed houses under tiled roofs, a village mosque with its
// square minaret, a watermill and its wheel, a stone bridge, an ox-cart. Pure geometry in a frame of its own, with no
// knowledge of the land: view/valley.ts decides where each thing stands.
//
// They are made to read as the building of al-Andalus in general (lime-washed walls, clay tile, square minarets,
// segmental stone arches) and copy no building that stands or stood. Nothing here is a historical claim.
import type { Rng } from "@im/kernel/prng";
import { MeshBuilder, frame, subFrame, toWorld, type Frame, type MeshData, type Rgb } from "@im/worldkit/mesh";
import type { MeshSet } from "@im/worldkit/district/kit";

const LIME: Rgb[] = [[0.93, 0.9, 0.83], [0.9, 0.86, 0.77], [0.95, 0.93, 0.88], [0.87, 0.81, 0.69]];
const TILE: Rgb = [0.74, 0.36, 0.2];
const WOOD: Rgb = [0.3, 0.2, 0.12];
const DARK: Rgb = [0.1, 0.08, 0.07];
const STONE: Rgb = [0.78, 0.72, 0.62];
type V3 = [number, number, number];

/** A pitched roof over a box: two slopes on a ridge along the frame's x axis, the end walls carried up under it. */
export function gable(set: MeshSet, f: Frame, lx: number, lz: number, w: number, d: number, eave: number, rise: number, tile: Rgb, wall: Rgb, over = 0.45): void {
  const P = (x: number, y: number, z: number): V3 => toWorld(f, lx + x, y, lz + z);
  const r = set.at("roof", f.x, f.z);
  const top = eave + rise;
  const low = eave - 0.14;
  r.quad(P(-w / 2 - over, low, d / 2 + over), P(w / 2 + over, low, d / 2 + over), P(w / 2 + over, top, 0), P(-w / 2 - over, top, 0), tile);
  r.quad(P(w / 2 + over, low, -d / 2 - over), P(-w / 2 - over, low, -d / 2 - over), P(-w / 2 - over, top, 0), P(w / 2 + over, top, 0), [tile[0] * 0.88, tile[1] * 0.88, tile[2] * 0.88]);
  const p = set.at("plaster", f.x, f.z);
  for (const s of [-1, 1]) p.quad(P((s * w) / 2, eave, (s * d) / 2), P((s * w) / 2, eave, (-s * d) / 2), P((s * w) / 2, top - 0.06, 0), P((s * w) / 2, top - 0.06, 0), wall);
}

/** A roof of four slopes meeting at a point. */
function pyramid(set: MeshSet, f: Frame, lx: number, lz: number, w: number, d: number, eave: number, rise: number, tile: Rgb, over = 0.3): void {
  const P = (x: number, y: number, z: number): V3 => toWorld(f, lx + x, y, lz + z);
  const r = set.at("roof", f.x, f.z);
  const a = w / 2 + over;
  const c = d / 2 + over;
  const top = P(0, eave + rise, 0);
  const corners: V3[] = [P(-a, eave, c), P(a, eave, c), P(a, eave, -c), P(-a, eave, -c)];
  for (let i = 0; i < 4; i++) r.quad(corners[i]!, corners[(i + 1) % 4]!, top, top, i % 2 ? [tile[0] * 0.9, tile[1] * 0.9, tile[2] * 0.9] : tile);
}

/** A house: lime-washed walls of one or two storeys under a tiled roof, a door, shuttered windows, sometimes a chimney, a lower wing, a walled yard. */
export function andalusiHouse(set: MeshSet, f: Frame, w: number, d: number, rng: Rng): void {
  const wall = rng.pick(LIME);
  const tall = rng.chance(0.35);
  const h = tall ? rng.range(5.6, 6.4) : rng.range(3.1, 3.7);
  const tile: Rgb = [TILE[0] + rng.range(-0.07, 0.06), TILE[1] + rng.range(-0.04, 0.04), TILE[2] + rng.range(-0.02, 0.03)];
  const p = set.at("plaster", f.x, f.z);
  const wd = set.at("wood", f.x, f.z);
  p.box(f, 0, -0.7, 0, w, h + 0.7, d, wall, 15, 0.84);
  gable(set, f, 0, 0, w, d, h, d * 0.29, tile, wall);
  // The door, and a stone step before it.
  const doorX = rng.range(-w * 0.22, w * 0.22);
  wd.box(f, doorX, 0, d / 2 + 0.05, 1.15, 2.15, 0.1, WOOD, 63);
  set.at("ashlar", f.x, f.z).box(f, doorX, -0.3, d / 2 + 0.6, 1.8, 0.42, 1, STONE, 31);
  // Windows with shutters: upstairs on both long walls, downstairs at the back only.
  const n = Math.max(1, Math.round(w / 4.2));
  for (let i = 0; i < n; i++) {
    const x = -w / 2 + (w * (i + 0.5)) / n;
    for (const side of [-1, 1]) {
      const y = tall ? h - 2.1 : 1.5;
      if (!tall && side === 1 && Math.abs(x - doorX) < 1.6) continue;
      wd.box(f, x, y, (side * d) / 2 + side * 0.04, 0.8, 1, 0.09, DARK, 63);
      for (const s of [-1, 1]) wd.box(f, x + s * 0.62, y, (side * d) / 2 + side * 0.07, 0.4, 1, 0.06, [0.18, 0.3, 0.26], 63);
    }
  }
  if (rng.chance(0.4)) {
    const cx = rng.range(-w * 0.3, w * 0.3);
    p.box(f, cx, h, -d * 0.2, 0.75, d * 0.2 + 1, 0.75, wall, 31, 0.9);
    set.at("roof", f.x, f.z).box(f, cx, h + d * 0.2 + 1, -d * 0.2, 1, 0.16, 1, tile, 63);
  }
  // A lower wing at one end.
  if (rng.chance(0.45)) {
    const side = rng.chance(0.5) ? 1 : -1;
    const w2 = rng.range(3.4, 5);
    const d2 = d * rng.range(0.6, 0.8);
    const lx = side * (w / 2 + w2 / 2 - 0.1);
    const lz = (d - d2) / 2 - rng.range(0, d - d2);
    p.box(f, lx, -0.7, lz, w2, 3.4, d2, wall, 15, 0.84);
    gable(set, f, lx, lz, w2, d2, 2.7, d2 * 0.24, tile, wall, 0.35);
  }
  // A yard before the door, behind a low wall with a gateway.
  if (rng.chance(0.4)) {
    const depth = rng.range(5, 7.5);
    const gap = 1.5;
    for (const s of [-1, 1]) {
      p.box(f, (s * w) / 2, -0.5, d / 2 + depth / 2, 0.38, 2.1, depth, wall, 31, 0.86);
      p.box(f, s * (w / 4 + gap / 2), -0.5, d / 2 + depth, w / 2 - gap, 2.1, 0.38, wall, 31, 0.86);
    }
  }
}

/** A plain small house for a distant town: walls and a tiled roof, nothing else. */
export function townHouse(set: MeshSet, f: Frame, w: number, d: number, h: number, wall: Rgb, tile: Rgb): void {
  set.at("plaster", f.x, f.z).box(f, 0, -1.5, 0, w, h + 1.5, d, wall, 15, 0.84);
  gable(set, f, 0, 0, w, d, h, d * 0.28, tile, wall, 0.3);
}

/** The village mosque: a prayer hall of three tiled naves, a walled court before it, and a square minaret at the court's corner. */
export function mosque(set: MeshSet, f: Frame): void {
  const wall: Rgb = [0.95, 0.93, 0.87];
  const p = set.at("plaster", f.x, f.z);
  const wd = set.at("wood", f.x, f.z);
  const W = 18;
  const D = 13;
  const H = 6.2;
  p.box(f, 0, -0.7, 0, W, H + 0.7, D, wall, 15, 0.86);
  // Three naves side by side, their ridges running from the court to the far wall.
  for (const i of [-1, 0, 1]) gable(set, subFrame(f, i * (W / 3), 0, 0, Math.PI / 2), 0, 0, D, W / 3, H, 1.9, TILE, wall, 0.25);
  // Tall narrow windows, and the door from the court.
  for (let i = 0; i < 5; i++) for (const side of [-1, 1]) wd.box(f, -W / 2 + (W * (i + 0.5)) / 5, 3, (side * D) / 2 + side * 0.04, 0.6, 1.9, 0.08, DARK, 63);
  wd.box(f, 0, 0, D / 2 + 0.06, 1.9, 3.1, 0.12, WOOD, 63);
  // The court: a wall on three sides with a gateway facing the hall's door, and a basin for washing.
  const C = 11;
  for (const s of [-1, 1]) {
    p.box(f, (s * W) / 2, -0.6, D / 2 + C / 2, 0.5, 3.6, C, wall, 31, 0.86);
    p.box(f, s * (W / 4 + 1), -0.6, D / 2 + C, W / 2 - 2, 3.6, 0.5, wall, 31, 0.86);
  }
  p.box(f, 0, 2.6, D / 2 + C, 4.4, 1.6, 0.5, wall, 63, 0.9);
  set.at("paving", f.x, f.z).box(f, 0, -0.3, D / 2 + C / 2, W - 0.6, 0.36, C - 0.4, [0.84, 0.78, 0.68], 31);
  const basin = subFrame(f, 4.5, 0, D / 2 + C / 2);
  set.at("ashlar", f.x, f.z).cylinder(basin, 0, 0, 0, 1.4, 1.4, 0.7, 10, STONE, false);
  set.at("canalwater", f.x, f.z).cylinder(basin, 0, 0.55, 0, 1.2, 1.2, 0.02, 10, [1, 1, 1], true);
  // The minaret: square, in three stages, with a small lantern and a tiled cap.
  const mx = -W / 2 + 1.9;
  const mz = D / 2 + C - 1.9;
  p.box(f, mx, -0.7, mz, 3.8, 14.7, 3.8, wall, 15, 0.82);
  p.box(f, mx, 14, mz, 4.3, 0.5, 4.3, wall, 63);
  for (const [dx, dz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]] as const) p.box(f, mx + dx * 1.85, 14.5, mz + dz * 1.85, 0.5, 0.8, 0.5, wall, 31);
  p.box(f, mx, 14.5, mz, 2.2, 3.2, 2.2, wall, 15, 0.9);
  for (const side of [-1, 1]) {
    wd.box(f, mx, 8.5, mz + side * 1.94, 0.7, 2, 0.08, DARK, 63);
    wd.box(f, mx + side * 1.94, 8.5, mz, 0.08, 2, 0.7, DARK, 63);
    wd.box(f, mx, 15.3, mz + side * 1.14, 0.6, 1.4, 0.08, DARK, 63);
    wd.box(f, mx + side * 1.14, 15.3, mz, 0.08, 1.4, 0.6, DARK, 63);
  }
  pyramid(set, f, mx, mz, 2.2, 2.2, 17.7, 1.9, [0.2, 0.42, 0.34], 0.25);
  set.at("ashlar", f.x, f.z).cylinder(subFrame(f, mx, 0, mz), 0, 19.5, 0, 0.09, 0.05, 1.3, 5, [0.85, 0.7, 0.3], true);
}

/** The mill house: stone below, lime wash above, a tiled roof, and a penthouse over the wheel on its channel side. Returns where the wheel's axle is, in the frame's own measure. */
export function millHouse(set: MeshSet, f: Frame): { axle: V3; radius: number } {
  const wall: Rgb = [0.92, 0.88, 0.79];
  set.at("ashlar", f.x, f.z).box(f, 0, -0.8, 0, 11.4, 2.9, 8.4, [0.7, 0.64, 0.54], 15, 0.8);
  set.at("plaster", f.x, f.z).box(f, 0, 2.1, 0, 11, 4.4, 8, wall, 15, 0.9);
  gable(set, f, 0, 0, 11, 8, 6.5, 2.4, TILE, wall);
  const wd = set.at("wood", f.x, f.z);
  wd.box(f, -3, 0, 4.26, 1.5, 2.3, 0.12, WOOD, 63);
  for (const x of [-3, 0.5, 3.6]) wd.box(f, x, 4.2, 4.04, 0.8, 1, 0.08, DARK, 63);
  for (const x of [-3.4, 0, 3.4]) wd.box(f, x, 4.2, -4.04, 0.8, 1, 0.08, DARK, 63);
  // A lean-to roof on posts over the wheel, and the axle's bearing.
  const radius = 3.3;
  const axle: V3 = [1.5, 2.5, 4.2 + 1.5];
  for (const x of [-2.6, 5.6]) wd.box(f, x, -0.5, 4.2 + 3, 0.3, 6.3, 0.3, WOOD, 31);
  set.at("roof", f.x, f.z).quad(toWorld(f, -3.2, 5.6, 7.7), toWorld(f, 6.2, 5.6, 7.7), toWorld(f, 6.2, 6.5, 4), toWorld(f, -3.2, 6.5, 4), [TILE[0] * 0.92, TILE[1] * 0.92, TILE[2] * 0.92]);
  wd.box(f, axle[0], axle[1] - 0.15, 4.2 + 1.5, 0.3, 0.3, 3.4, WOOD, 63);
  return { axle, radius };
}

/** A waterwheel about its own axle: the wheel lies in the x-y plane and turns about z. Both faces of every board are drawn. */
export function waterWheel(radius: number): MeshData {
  const b = new MeshBuilder();
  const wood: Rgb = [0.36, 0.25, 0.15];
  const dark: Rgb = [0.24, 0.17, 0.1];
  const both = (a: V3, c: V3, d: V3, e: V3, colour: Rgb) => {
    b.quad(a, c, d, e, colour);
    b.quad(e, d, c, a, colour);
  };
  const half = 0.55;
  const inner = radius - 0.55;
  const n = 16;
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = ((i + 1) / n) * Math.PI * 2;
    const at = (r: number, a: number, z: number): V3 => [Math.cos(a) * r, Math.sin(a) * r, z];
    // The two rims, the boards between them, and a paddle standing out from the wheel.
    for (const z of [-half, half]) both(at(inner, a0, z), at(radius, a0, z), at(radius, a1, z), at(inner, a1, z), wood);
    both(at(inner, a0, -half), at(inner, a1, -half), at(inner, a1, half), at(inner, a0, half), dark);
    both(at(inner - 0.1, a0, -half), at(radius + 0.5, a0, -half), at(radius + 0.5, a0, half), at(inner - 0.1, a0, half), wood);
    // Spokes on both faces, every other step.
    if (i % 2 === 0) {
      const dx = -Math.sin(a0) * 0.11;
      const dy = Math.cos(a0) * 0.11;
      for (const z of [-half, half]) both([dx, dy, z], [Math.cos(a0) * inner + dx, Math.sin(a0) * inner + dy, z], [Math.cos(a0) * inner - dx, Math.sin(a0) * inner - dy, z], [-dx, -dy, z], dark);
    }
  }
  return b.build();
}

/**
 * A stone bridge of low arches along the frame's x axis, its deck a little humped. `y0` is the water under it and
 * `deck` how high the roadway's ends stand over that. Returns the height of the roadway at a place along it.
 */
export function bridge(set: MeshSet, f: Frame, length: number, width: number, spans: number, deck: number): (x: number) => number {
  const stone = set.at("ashlar", f.x, f.z);
  const P = (x: number, y: number, z: number): V3 => toWorld(f, x, y, z);
  const pier = 2.2;
  const span = (length - pier * (spans + 1)) / spans;
  const hump = 0.9;
  const top = (x: number) => deck + hump * (1 - Math.pow((2 * x) / length, 2));
  const spring = 0.5;
  const rise = deck - 1.3 - spring;
  const hw = width / 2;
  const tone: Rgb = [0.74, 0.68, 0.57];
  // Piers, standing in the water, and the faces and soffits of the arches between them.
  for (let k = 0; k <= spans; k++) {
    const x = -length / 2 + pier / 2 + k * (span + pier);
    stone.box(f, x, -3.5, 0, pier, 3.5 + top(x), width, tone, 15, 0.78);
    stone.box(f, x, -3.5, 0, pier + 0.9, 3.5 + spring, width + 1.6, [tone[0] * 0.9, tone[1] * 0.9, tone[2] * 0.9], 31, 0.8);
  }
  for (let k = 0; k < spans; k++) {
    const x0 = -length / 2 + pier + k * (span + pier);
    const n = 10;
    const arc = (i: number): [number, number] => {
      const t = i / n;
      return [x0 + span * t, spring + rise * (1 - Math.pow(2 * t - 1, 2))];
    };
    for (let i = 0; i < n; i++) {
      const [xa, ya] = arc(i);
      const [xb, yb] = arc(i + 1);
      stone.quad(P(xa, ya, hw), P(xb, yb, hw), P(xb, top(xb), hw), P(xa, top(xa), hw), tone);
      stone.quad(P(xb, yb, -hw), P(xa, ya, -hw), P(xa, top(xa), -hw), P(xb, top(xb), -hw), tone);
      stone.quad(P(xa, ya, hw), P(xa, ya, -hw), P(xb, yb, -hw), P(xb, yb, hw), [tone[0] * 0.62, tone[1] * 0.62, tone[2] * 0.62]);
    }
  }
  // The roadway, and a parapet on each side.
  const m = 28;
  const road = set.at("paving", f.x, f.z);
  for (let i = 0; i < m; i++) {
    const xa = -length / 2 + (length * i) / m;
    const xb = -length / 2 + (length * (i + 1)) / m;
    road.quad(P(xa, top(xa), hw), P(xb, top(xb), hw), P(xb, top(xb), -hw), P(xa, top(xa), -hw), [0.8, 0.74, 0.63]);
    for (const s of [-1, 1]) stone.box(f, (xa + xb) / 2, Math.min(top(xa), top(xb)) - 0.1, s * (hw - 0.2), xb - xa + 0.05, 1.05, 0.42, tone, 31, 0.9);
  }
  return top;
}

/** An ox in its cart's frame: body, head and horns, the yoke's beasts carry it between the shafts. Its legs are shapes of their own (oxLeg), drawn at OX_LEGS and moved as it walks. */
export function oxBody(): MeshData {
  const b = new MeshBuilder();
  const f = frame(0, 0, 0);
  const hide: Rgb = [0.5, 0.36, 0.22];
  b.box(f, 0, 0.72, 1.5, 0.78, 0.82, 1.9, hide, 63, 0.8);
  b.box(f, 0, 1.18, 2.62, 0.44, 0.48, 0.62, [hide[0] * 0.9, hide[1] * 0.9, hide[2] * 0.9], 63);
  for (const x of [-0.3, 0.3]) b.box(f, x, 1.62, 2.55, 0.07, 0.07, 0.32, [0.92, 0.9, 0.82], 63);
  return b.build();
}

/** A cart, loaded with sacks, facing along the frame's z axis. The ox that draws it is a shape of its own (oxBody). */
export function oxCart(): MeshData {
  const b = new MeshBuilder();
  const f = frame(0, 0, 0);
  const plank: Rgb = [0.42, 0.3, 0.18];
  // The shafts, the bed, its sides and its load.
  for (const x of [-0.5, 0.5]) b.box(f, x, 0.86, 0, 0.09, 0.09, 2.6, plank, 63);
  b.box(f, 0, 0.8, -1.9, 1.7, 0.16, 2.7, plank, 63);
  for (const x of [-0.82, 0.82]) b.box(f, x, 0.96, -1.9, 0.08, 0.5, 2.7, [plank[0] * 0.85, plank[1] * 0.85, plank[2] * 0.85], 63);
  for (const [x, z, c] of [[-0.35, -1.2, 0.86], [0.38, -1.5, 0.78], [-0.1, -2.3, 0.9], [0.3, -2.6, 0.8]] as const) b.box(f, x, 0.96, z, 0.72, 0.5, 0.95, [c, c * 0.9, c * 0.72], 63);
  // Two wheels: discs in the cart's own length.
  for (const x of [-1, 1]) {
    const hub: V3 = [x, 0.72, -1.9];
    const n = 10;
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2;
      const a1 = ((i + 1) / n) * Math.PI * 2;
      const p0: V3 = [x, 0.72 + Math.sin(a0) * 0.72, -1.9 + Math.cos(a0) * 0.72];
      const p1: V3 = [x, 0.72 + Math.sin(a1) * 0.72, -1.9 + Math.cos(a1) * 0.72];
      b.quad(hub, p0, p1, p1, [0.26, 0.18, 0.11]);
      b.quad(hub, p1, p0, p0, [0.26, 0.18, 0.11]);
    }
  }
  return b.build();
}

/** A picker's ladder: two rails and seven rungs, standing upright; the valley leans it against a tree. */
export function ladder(): MeshData {
  const b = new MeshBuilder();
  const f = frame(0, 0, 0);
  const pole: Rgb = [0.5, 0.38, 0.22];
  for (const x of [-0.26, 0.26]) b.box(f, x, 0, 0, 0.07, 3.6, 0.07, pole, 63);
  for (let i = 0; i < 7; i++) b.box(f, 0, 0.4 + i * 0.46, 0, 0.52, 0.05, 0.05, [pole[0] * 0.9, pole[1] * 0.9, pole[2] * 0.9], 63);
  return b.build();
}

/** A harvest basket of woven cane, full to the brim: the brim's colour is the crop's, set by the valley. */
export function basket(): MeshData {
  const b = new MeshBuilder();
  const f = frame(0, 0, 0);
  b.cylinder(f, 0, 0, 0, 0.3, 0.4, 0.46, 10, [0.62, 0.48, 0.28], false);
  b.cylinder(f, 0, 0.4, 0, 0.36, 0.3, 0.1, 10, [1, 1, 1], true);
  return b.build();
}

// ---- The valley's living things, each one small shape drawn many times -------------------------------------------
// They face local +Z, as the ox does. White where the instance's own colour is to show.

/** A sheep or a goat, about a metre long: a woolly body, a darker head held low, four legs. */
export function sheep(): MeshData {
  const b = new MeshBuilder();
  const f = frame(0, 0, 0);
  const wool: Rgb = [1, 1, 1];
  const dark: Rgb = [0.34, 0.3, 0.26];
  b.box(f, 0, 0.34, 0, 0.5, 0.46, 0.95, wool, 63, 0.9);
  b.box(f, 0, 0.5, 0.56, 0.24, 0.26, 0.34, dark, 63);
  return b.build();
}

/** A horse, about two metres long and a metre and a half at the shoulder, saddled. */
export function horse(): MeshData {
  const b = new MeshBuilder();
  const f = frame(0, 0, 0);
  const coat: Rgb = [1, 1, 1];
  const shade: Rgb = [0.72, 0.72, 0.72];
  const mane: Rgb = [0.22, 0.2, 0.18];
  b.box(f, 0, 0.92, 0, 0.56, 0.62, 1.75, coat, 63, 0.85);
  // The neck rises forward in two steps, and the head hangs from it.
  b.box(f, 0, 1.36, 0.86, 0.34, 0.5, 0.46, coat, 63);
  b.box(f, 0, 1.72, 1.12, 0.3, 0.42, 0.4, coat, 63);
  b.box(f, 0, 1.66, 1.46, 0.24, 0.3, 0.52, shade, 63);
  b.box(f, 0, 1.78, 0.8, 0.08, 0.5, 0.5, mane, 63);
  b.box(f, 0, 0.75, -0.98, 0.1, 0.7, 0.14, mane, 63);
  // A saddle cloth: red, as a mark the eye finds from far off.
  b.box(f, 0, 1.54, -0.08, 0.62, 0.06, 0.7, [0.62, 0.12, 0.1], 63);
  return b.build();
}

/** A donkey, smaller and greyer than a horse, with long ears and no saddle: the shape the valley draws for its grazing donkeys until the authored one arrives. */
export function donkey(): MeshData {
  const b = new MeshBuilder();
  const f = frame(0, 0, 0);
  const coat: Rgb = [1, 1, 1];
  const shade: Rgb = [0.72, 0.72, 0.72];
  const mane: Rgb = [0.3, 0.28, 0.26];
  b.box(f, 0, 0.86, 0, 0.5, 0.56, 1.55, coat, 63, 0.85);
  b.box(f, 0, 1.26, 0.76, 0.3, 0.44, 0.4, coat, 63);
  b.box(f, 0, 1.56, 0.98, 0.26, 0.36, 0.36, coat, 63);
  b.box(f, 0, 1.5, 1.28, 0.2, 0.26, 0.46, shade, 63);
  // A donkey's ears are long: two upright blades where a horse carries a tuft.
  for (const x of [-0.09, 0.09]) b.box(f, x, 1.86, 0.92, 0.06, 0.34, 0.1, shade, 63);
  b.box(f, 0, 1.62, 0.72, 0.07, 0.4, 0.44, mane, 63);
  b.box(f, 0, 0.68, -0.88, 0.09, 0.62, 0.12, mane, 63);
  return b.build();
}

/** A camel, the shape the valley draws until the authored one arrives: taller than a horse, a soft hump on the back, a long neck. Its legs are horseLeg's, at CAMEL_LEGS. */
export function camel(): MeshData {
  const b = new MeshBuilder();
  const f = frame(0, 0, 0);
  const coat: Rgb = [1, 1, 1];
  const shade: Rgb = [0.72, 0.72, 0.72];
  b.box(f, 0, 1.3, 0, 0.7, 0.76, 1.9, coat, 63, 0.85);
  b.box(f, 0, 1.98, 0.1, 0.42, 0.3, 0.5, coat, 63);
  b.box(f, 0, 1.5, 0.95, 0.32, 0.44, 0.4, coat, 63);
  b.box(f, 0, 1.86, 1.2, 0.26, 0.36, 0.36, shade, 63);
  b.box(f, 0, 1.62, 0.78, 0.07, 0.42, 0.44, shade, 63);
  b.box(f, 0, 0.72, -1.05, 0.09, 0.66, 0.12, shade, 63);
  return b.build();
}

/** What marks a man of the watch: a round helmet over the head-cloth, a round shield at the left arm, a spear upright in the right hand. */
export function guardGear(): MeshData {
  const b = new MeshBuilder();
  const f = frame(0, 0, 0);
  const iron: Rgb = [0.55, 0.56, 0.58];
  const wood: Rgb = [0.36, 0.26, 0.16];
  b.revolve(f, 0, 1.55, 0, (t) => [0.15 * Math.cos((t * Math.PI) / 2), 0.17 * Math.sin((t * Math.PI) / 2)], 8, 3, iron);
  b.box(f, 0.3, 0, 0.08, 0.04, 2.5, 0.04, wood, 63);
  b.cylinder(f, 0.3, 2.5, 0.08, 0.05, 0, 0.3, 4, iron, false);
  b.box(f, -0.32, 0.72, 0.06, 0.07, 0.56, 0.5, [0.5, 0.16, 0.12], 63);
  return b.build();
}

/** A bird on the wing, seen from below as two swept wings. About a metre across. */
export function bird(): MeshData {
  const b = new MeshBuilder();
  const dark: Rgb = [0.16, 0.15, 0.14];
  const P = (x: number, y: number, z: number): V3 => [x, y, z];
  for (const s of [-1, 1]) {
    b.quad(P(0, 0, 0.22), P(s * 0.55, 0.1, 0.05), P(s * 0.52, 0.1, -0.12), P(0, 0, -0.16), dark);
    b.quad(P(0, 0, -0.16), P(s * 0.52, 0.1, -0.12), P(s * 0.55, 0.1, 0.05), P(0, 0, 0.22), dark);
  }
  return b.build();
}

// ---- Legs: each a shape of its own with its joint at the origin, hanging down, swung about the joint as the body moves.

/** Where each leg joins its body, in the body's own frame: [x, y, z]. Front legs first, then back, left then right. */
export const OX_LEGS: ReadonlyArray<readonly [number, number, number]> = [[-0.27, 0.74, 2.2], [0.27, 0.74, 2.2], [-0.27, 0.74, 0.75], [0.27, 0.74, 0.75]];
export const HORSE_LEGS: ReadonlyArray<readonly [number, number, number]> = [[-0.2, 0.94, 0.68], [0.2, 0.94, 0.68], [-0.2, 0.94, -0.68], [0.2, 0.94, -0.68]];
export const SHEEP_LEGS: ReadonlyArray<readonly [number, number, number]> = [[-0.16, 0.36, 0.32], [0.16, 0.36, 0.32], [-0.16, 0.36, -0.32], [0.16, 0.36, -0.32]];
export const CAMEL_LEGS: ReadonlyArray<readonly [number, number, number]> = [[-0.23, 1.02, 0.74], [0.23, 1.02, 0.74], [-0.23, 1.02, -0.74], [0.23, 1.02, -0.74]];
/** A person's hips: the robe stops above the knee, so the stride shows. */
export const PERSON_LEGS: ReadonlyArray<readonly [number, number, number]> = [[-0.085, 0.5, 0], [0.085, 0.5, 0]];

const limb = (length: number, width: number, color: Rgb, hoof: Rgb): MeshData => {
  const b = new MeshBuilder();
  const f = frame(0, 0, 0);
  b.box(f, 0, -length, 0, width, length, width, color, 63, 0.9);
  b.box(f, 0, -length, 0.02, width * 1.15, 0.08, width * 1.35, hoof, 63);
  return b.build();
};
/** An ox's leg is white so that the ox's own colour shows on it, as the horse's is, with a dark hoof. */
export const oxLeg = (): MeshData => limb(0.9, 0.17, [0.72, 0.72, 0.72], [0.2, 0.18, 0.16]);
/** A horse's leg is white so that the horse's own colour shows on it, with a dark hoof. */
export const horseLeg = (): MeshData => limb(0.94, 0.13, [0.72, 0.72, 0.72], [0.2, 0.18, 0.16]);
/** A camel's leg, longer than a horse's, white so the camel's own colour shows on it. */
export const camelLeg = (): MeshData => limb(1.02, 0.12, [0.72, 0.72, 0.72], [0.2, 0.18, 0.16]);
export const sheepLeg = (): MeshData => limb(0.36, 0.09, [0.34, 0.3, 0.26], [0.2, 0.18, 0.16]);
/** A person's leg below the robe: bare shin or leggings, and a shoe. */
export const personLeg = (): MeshData => limb(0.5, 0.11, [0.36, 0.27, 0.2], [0.24, 0.17, 0.11]);

/** A person in the valley: a robe to the knee, shoulders and sleeves; the legs are drawn apart (personLeg). Tinted per instance. */
export function personBody(): MeshData {
  const b = new MeshBuilder();
  const f = frame(0, 0, 0);
  const white: Rgb = [1, 1, 1];
  b.revolve(f, 0, 0.44, 0, (t) => [0.25 - 0.08 * t + 0.03 * Math.sin(t * Math.PI), 0.88 * t], 8, 4, [0.7, 0.7, 0.7], white);
  b.revolve(f, 0, 1.3, 0, (t) => [0.2 * Math.cos((t * Math.PI) / 2), 0.14 * Math.sin((t * Math.PI) / 2)], 8, 2, white);
  for (const sx of [-1, 1]) b.cylinder(frame(sx * 0.23, 0.72, 0), 0, 0, 0, 0.055, 0.07, 0.62, 5, [0.85, 0.85, 0.85], false);
  return b.build();
}
