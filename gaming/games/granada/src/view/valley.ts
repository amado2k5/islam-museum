// The valley of "Water for the Valley" as geometry: the land, the river, the pool and its channels, the three
// fields, the village, a walled hill town beyond, and the high range behind it. Pure functions of a seed (no engine
// types), so the shapes can be tested and any renderer can draw them.
//
// World: metres, +X east, +Z south, +Y up. The plan of the valley (ui/map.ts) is the same ground seen from above:
// a point at (px, py) on the plan is at (px - 500, py - 280) here. Seen from the west, as the camera first looks,
// the fields lie in front, the village behind them, the hill town beyond, and the snow range at the back: the Vega
// lies west of Granada and the Sierra Nevada east and south-east of it.
//
// It is a made valley, not a survey. The hill town is scenery and stands for no building that can be named.
import { Rng, fbm, hash32, latticeHash } from "@im/kernel/prng";
import { MeshBuilder, frame, toWorld, type MeshData, type Rgb } from "@im/worldkit/mesh";
import { MeshSet, type MaterialId } from "@im/worldkit/district/kit";
import { andalusiHouse, bridge, millHouse, mosque, oxCart, townHouse, waterWheel } from "./buildings";

export type Pt = readonly [number, number];
export const plan = (px: number, py: number): Pt => [px - 500, py - 280];

// ---- Where things are --------------------------------------------------------------------------------------------------
export const FIELDS: Record<string, Pt[]> = {
  "river-meadow": [plan(150, 178), plan(470, 160), plan(492, 262), plan(168, 282)],
  "mill-field": [plan(120, 340), plan(452, 322), plan(474, 468), plan(138, 490)],
  "olive-terrace": [plan(724, 300), plan(962, 286), plan(972, 452), plan(736, 468)],
};
export const POOL = { x: 140, z: -84, r: 34 } as const;
export const JUNCTION: Pt = [140, 20];
/** Channel centre lines, each from its head to the field it waters. */
export const CHANNELS: Record<string, Pt[]> = {
  intake: [[140, -146], [140, -118]],
  main: [[140, -50], [140, 20]],
  west: [[140, 20], [84, 36], [20, 44], [-48, 52]],
  east: [[140, 20], [176, 30], [204, 48], [228, 62]],
  meadow: [[140, -50], [80, -58], [28, -62], [-12, -66]],
};
export const CHANNEL_HALF = 1.6;
/** The channels are banked up a little above the fields they water; this is how high their water stands over the land. */
export const CHANNEL_WATER = 0.62;
export const VILLAGE: Pt = [110, 170];
export const HOUSE_LOTS: Array<{ x: number; z: number; yaw: number }> = [
  { x: 84, z: 162, yaw: 0.1 }, { x: 126, z: 158, yaw: -0.08 }, { x: 166, z: 164, yaw: 0.16 }, { x: 46, z: 168, yaw: -0.2 }, { x: 206, z: 170, yaw: 0.3 },
  { x: 88, z: 210, yaw: 3.2 }, { x: 130, z: 206, yaw: 3.05 }, { x: 170, z: 212, yaw: 3.3 }, { x: 50, z: 216, yaw: 3.0 }, { x: 210, z: 218, yaw: 3.4 },
];
export const STORE: Pt = [30, 104];
export const GRANARY: Pt = [92, 110];
export const MARKET: Pt = [318, 224];
/** The village mosque's prayer hall; its court lies to the north of it. */
export const MOSQUE: Pt = [150, 132];
/** The mill, at the tail of the west branch, its wheel standing in the channel. */
export const MILL: Pt = [-34, 44.5];
/** Where the road north crosses the river. */
export const BRIDGE = { x: 6, length: 64, width: 6.4, deck: 4.3 } as const;
export const HILL = { x: 930, z: -150, r: 300, h: 92 } as const;
/** The ground the game is played on; the camera's target stays inside it. */
export const BOUNDS = { x0: -460, x1: 540, z0: -230, z1: 300 } as const;

// ---- The land ----------------------------------------------------------------------------------------------------------
const smooth = (a: number, b: number, v: number): number => {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
/** The river's centre line: it comes down from the east and runs west along the north of the district. */
export const riverZ = (x: number): number => -150 + 16 * Math.sin(x / 190 + 0.6) + 7 * Math.sin(x / 77 + 2) - 0.05 * Math.max(0, x - 500);
export const RIVER_HALF = 17;
export const waterLevel = (x: number): number => plain(x) - 1.7;
const plain = (x: number): number => 0.012 * (x + 460);
const inside = (poly: Pt[], x: number, z: number): boolean => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i]!;
    const [xj, zj] = poly[j]!;
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c;
  }
  return c;
};
/** The field under a point, or null. */
export function fieldAt(x: number, z: number): string | null {
  for (const [id, poly] of Object.entries(FIELDS)) if (inside(poly, x, z)) return id;
  return null;
}
const TERRACE_STEP = 2.6;
const terraceOf = (x: number): number => Math.max(0, Math.min(3, Math.floor((x - 224) / 62)));

/** Height of the land at a point. */
export function heightAt(x: number, z: number, seed: number): number {
  let h = plain(x);
  // Rolling ground away from the worked land; the worked land itself is nearly level.
  const away = Math.max(BOUNDS.x0 - x, x - BOUNDS.x1, BOUNDS.z0 - 60 - z, z - BOUNDS.z1, 0);
  h += (fbm(x / 210 + 3, z / 210 + 7, seed, 4) - 0.5) * (1.2 + 26 * smooth(0, 520, away));
  // The olive terraces climb eastward in four steps.
  const t = FIELDS["olive-terrace"]!;
  if (x > 214 && x < 486 && z > -6 && z < 196) {
    const edge = Math.min(smooth(214, 226, x), smooth(486, 470, x), smooth(-6, 10, z), smooth(196, 182, z));
    h += edge * (terraceOf(x) + 1) * TERRACE_STEP;
    void t;
  }
  // Foothills rise to the east, and the town's hill stands on them.
  h += 46 * smooth(520, 1500, x) * (0.75 + 0.5 * fbm(x / 420, z / 420 + 5, seed + 3, 3));
  const dh = Math.hypot(x - HILL.x, z - HILL.z);
  h += HILL.h * Math.pow(smooth(HILL.r, 0, dh), 1.4);
  // The river's bed, and the pool's basin.
  const dr = Math.abs(z - riverZ(x));
  h -= 4.2 * smooth(RIVER_HALF + 26, RIVER_HALF - 4, dr) * smooth(1250, 950, x);
  const dp = Math.hypot(x - POOL.x, z - POOL.z);
  h -= 3 * smooth(POOL.r + 3, POOL.r - 6, dp);
  return h;
}

export type PlotKind = "green" | "young" | "ploughed" | "stubble" | "orchard";
/** The plain's plots lie on a slanted grid, so that they are not all square to the compass. */
export const PLOT_GRID = { ax: 0.93, az: 0.36, du: 78, dv: 56, u0: -24, v0: -40, w: 64, h: 80 } as const;
/** What each kind of plot looks like from above: its ground, the colour of its rows, how strong and how far apart the rows are. */
const PLOT_STYLE: Record<PlotKind, { base: Rgb; row: Rgb; strength: number; spacing: number }> = {
  green: { base: [0.1, 0.2, 0.055], row: [0.17, 0.34, 0.08], strength: 0.6, spacing: 1.6 },
  young: { base: [0.3, 0.215, 0.14], row: [0.2, 0.36, 0.1], strength: 0.9, spacing: 2.4 },
  ploughed: { base: [0.21, 0.145, 0.095], row: [0.34, 0.245, 0.16], strength: 0.85, spacing: 2 },
  stubble: { base: [0.5, 0.4, 0.19], row: [0.66, 0.56, 0.29], strength: 0.6, spacing: 1.4 },
  orchard: { base: [0.17, 0.25, 0.09], row: [0.3, 0.24, 0.15], strength: 0.3, spacing: 10 },
};
function plotOfCell(cu: number, cv: number, seed: number): { kind: PlotKind; tone: number } {
  const r = latticeHash(cu, cv, seed + 77);
  const kind: PlotKind = r < 0.3 ? "green" : r < 0.48 ? "young" : r < 0.62 ? "ploughed" : r < 0.78 ? "stubble" : "orchard";
  return { kind, tone: latticeHash(cv, cu, seed + 5) };
}
/** The plot of the plain a point falls in; `edge` is how near the point is to the plot's border (0 on it, in plots). */
export function plotAt(x: number, z: number, seed: number): { kind: PlotKind; edge: number; tone: number; cu: number; cv: number } {
  const u = (x * PLOT_GRID.ax + z * PLOT_GRID.az) / PLOT_GRID.du;
  const v = (-x * PLOT_GRID.az + z * PLOT_GRID.ax) / PLOT_GRID.dv;
  const cu = Math.floor(u);
  const cv = Math.floor(v);
  return { ...plotOfCell(cu, cv, seed), edge: Math.min(u - cu, 1 - (u - cu), v - cv, 1 - (v - cv)), cu, cv };
}
/** The point of the land at a place given in a plot's own measure (metres along and across the grid). */
export function plotPoint(U: number, V: number): Pt {
  const n = PLOT_GRID.ax * PLOT_GRID.ax + PLOT_GRID.az * PLOT_GRID.az;
  return [(PLOT_GRID.ax * U - PLOT_GRID.az * V) / n, (PLOT_GRID.az * U + PLOT_GRID.ax * V) / n];
}
export interface PlotTable {
  width: number;
  height: number;
  /** RGBA, sRGB: the ground of each plot. */
  base: Uint8Array;
  /** RGBA, sRGB: the colour of its rows. */
  row: Uint8Array;
  /** RGBA, plain numbers: red is how strong the rows are, green their spacing (of 12 m), blue which way they run. */
  params: Uint8Array;
}
const srgb8 = (c: number): number => Math.round(255 * Math.max(0, Math.min(1, c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055)));
/** One texel for each plot of the plain, for a renderer to draw the plots sharply at any distance. */
export function plotTable(seed: number): PlotTable {
  const { w, h, u0, v0 } = PLOT_GRID;
  const base = new Uint8Array(w * h * 4);
  const row = new Uint8Array(w * h * 4);
  const params = new Uint8Array(w * h * 4);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const plot = plotOfCell(i + u0, j + v0, seed);
      const style = PLOT_STYLE[plot.kind];
      const shade = 0.82 + 0.34 * plot.tone;
      const o = (j * w + i) * 4;
      for (let c = 0; c < 3; c++) {
        base[o + c] = srgb8(style.base[c]! * shade);
        row[o + c] = srgb8(style.row[c]! * shade);
      }
      base[o + 3] = row[o + 3] = params[o + 3] = 255;
      params[o] = Math.round(style.strength * 255);
      params[o + 1] = Math.round((style.spacing / 12) * 255);
      params[o + 2] = latticeHash(i + u0, j + v0, seed + 9) < 0.5 ? 0 : 255;
    }
  }
  return { width: w, height: h, base, row, params };
}
/** How much of a point is trodden ground: the village, its lanes and its square. */
export function settled(x: number, z: number): number {
  return smooth(-64, -46, x) * smooth(284, 262, x) * smooth(92, 106, z) * smooth(278, 262, z);
}
/** How much of the land at a point is worked plain: 1 in the Vega, 0 on the dry hills, the banks and the village. */
export function worked(x: number, z: number, slope: number): number {
  const fromHeart = Math.hypot((x + 60) / 1.25, z - 40);
  return smooth(1050, 520, fromHeart) * smooth(620, 500, x) * (1 - smooth(0.1, 0.24, slope)) * smooth(RIVER_HALF + 2, RIVER_HALF + 22, Math.abs(z - riverZ(x))) * (1 - settled(x, z));
}

const blend = (a: Rgb, b: Rgb, t: number): Rgb => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
/** Colour of the land where it is not worked: dry hills with scrub in their folds, rock on steep ground, green banks, trodden earth. */
function wildColour(x: number, z: number, slope: number, seed: number): Rgb {
  const n = fbm(x / 46, z / 46, seed + 11, 3);
  const dry: Rgb = [0.46 + 0.12 * n, 0.35 + 0.08 * n, 0.2 + 0.05 * n];
  const scrub: Rgb = [0.2 + 0.08 * n, 0.25 + 0.07 * n, 0.11 + 0.04 * n];
  const rock: Rgb = [0.4 + 0.08 * n, 0.36 + 0.07 * n, 0.31 + 0.06 * n];
  let c = blend(dry, scrub, smooth(0.42, 0.68, fbm(x / 130, z / 130, seed + 14, 3)));
  c = blend(c, rock, smooth(0.26, 0.55, slope));
  // Reeds and grass along the river and round the pool.
  const bank = Math.max(smooth(RIVER_HALF + 34, RIVER_HALF + 6, Math.abs(z - riverZ(x))) * smooth(1250, 1000, x), smooth(POOL.r + 26, POOL.r + 8, Math.hypot(x - POOL.x, z - POOL.z)));
  c = blend(c, [0.14 + 0.05 * n, 0.24 + 0.05 * n, 0.08], bank);
  // Inside the plain, ground too steep to plough (the banks of the terraces, the dips by the channels) is under grass.
  const inPlain = smooth(1050, 520, Math.hypot((x + 60) / 1.25, z - 40)) * smooth(620, 500, x);
  c = blend(c, [0.17 + 0.05 * n, 0.27 + 0.05 * n, 0.09], 0.85 * inPlain);
  return blend(c, [0.5 + 0.06 * n, 0.41 + 0.05 * n, 0.28 + 0.03 * n], settled(x, z));
}

const CELL = 10;
export const LAND = { x0: -1100, x1: 1700, z0: -1300, z1: 1300 } as const;
export function buildLand(seed: number): MeshData {
  const nx = Math.round((LAND.x1 - LAND.x0) / CELL);
  const nz = Math.round((LAND.z1 - LAND.z0) / CELL);
  const b = new MeshBuilder();
  const hs = new Float32Array((nx + 1) * (nz + 1));
  const at = (i: number, j: number) => hs[Math.max(0, Math.min(nz, j)) * (nx + 1) + Math.max(0, Math.min(nx, i))]!;
  for (let j = 0; j <= nz; j++) for (let i = 0; i <= nx; i++) hs[j * (nx + 1) + i] = heightAt(LAND.x0 + i * CELL, LAND.z0 + j * CELL, seed);
  for (let j = 0; j <= nz; j++) {
    for (let i = 0; i <= nx; i++) {
      const x = LAND.x0 + i * CELL;
      const z = LAND.z0 + j * CELL;
      const gx = (at(i + 1, j) - at(i - 1, j)) / (2 * CELL);
      const gz = (at(i, j + 1) - at(i, j - 1)) / (2 * CELL);
      const l = Math.hypot(gx, 1, gz);
      const h = at(i, j);
      // The first texture coordinate carries how far the point is worked plain; the renderer draws the plots there.
      const slope = Math.hypot(gx, gz);
      b.vertex([x, h, z], [-gx / l, 1 / l, -gz / l], worked(x, z, slope), 0, wildColour(x, z, slope, seed));
    }
  }
  for (let j = 0; j < nz; j++) {
    for (let i = 0; i < nx; i++) {
      const a = j * (nx + 1) + i;
      b.tri(a, a + nx + 1, a + 1);
      b.tri(a + 1, a + nx + 1, a + nx + 2);
    }
  }
  // An apron: the edge of the land carried far outward at its own height and colour, so that the land reaches the
  // horizon on every side and no sky shows beneath it.
  const rim: Array<[number, number]> = [];
  for (let i = 0; i < nx; i++) rim.push([i, 0]);
  for (let j = 0; j < nz; j++) rim.push([nx, j]);
  for (let i = nx; i > 0; i--) rim.push([i, nz]);
  for (let j = nz; j > 0; j--) rim.push([0, j]);
  const cx = (LAND.x0 + LAND.x1) / 2;
  const cz = (LAND.z0 + LAND.z1) / 2;
  const inner: number[] = [];
  const outer: number[] = [];
  const pos: Array<[number, number]> = [];
  for (const [i, j] of rim) {
    const x = LAND.x0 + i * CELL;
    const z = LAND.z0 + j * CELL;
    const h = at(i, j);
    const colour = wildColour(x, z, 0, seed);
    inner.push(b.vertex([x, h, z], [0, 1, 0], 0, 0, colour));
    outer.push(b.vertex([cx + (x - cx) * 9, h, cz + (z - cz) * 9], [0, 1, 0], 0, 0, colour));
    pos.push([x, z]);
  }
  for (let k = 0; k < rim.length; k++) {
    const n = (k + 1) % rim.length;
    // Wound so that the apron faces up, whichever way round the rim runs.
    const up = (pos[n]![1] - pos[k]![1]) * (cx + (pos[k]![0] - cx) * 9 - pos[k]![0]) - (pos[n]![0] - pos[k]![0]) * (cz + (pos[k]![1] - cz) * 9 - pos[k]![1]) > 0;
    if (up) {
      b.tri(inner[k]!, inner[n]!, outer[k]!);
      b.tri(inner[n]!, outer[n]!, outer[k]!);
    } else {
      b.tri(inner[k]!, outer[k]!, inner[n]!);
      b.tri(inner[n]!, outer[k]!, outer[n]!);
    }
  }
  return b.build();
}

/**
 * The high range to the east and south-east, far behind the hill town: foothills, then ridges with snow above the
 * snow line. Its crests come from folded noise, so that they are sharp and not rounded.
 */
export function buildRange(seed: number): MeshData {
  const b = new MeshBuilder();
  const cols = 280;
  const rows = 60;
  const x0 = 1650;
  const depth = 6200;
  const z0 = -6400;
  const z1 = 6400;
  const hs = new Float32Array((cols + 1) * (rows + 1));
  const idx = (i: number, j: number) => Math.max(0, Math.min(rows, j)) * (cols + 1) + Math.max(0, Math.min(cols, i));
  for (let j = 0; j <= rows; j++) {
    for (let i = 0; i <= cols; i++) {
      const u = i / cols;
      const v = j / rows;
      const z = z0 + (z1 - z0) * u;
      // Foothills first, then the high ridge two thirds of the way back, falling away behind.
      const ridge = Math.pow(Math.sin(Math.PI * Math.min(1, v * 1.16)), 1.5) * (0.5 + 0.5 * smooth(0.12, 0.62, v));
      const folded = 1 - Math.abs(2 * fbm(u * 13 + 1.7, v * 6.5 + 4, seed + 21, 5) - 1);
      const peaks = 0.5 + 0.85 * fbm(u * 4.3 + 9, 0.5, seed + 5, 3);
      // Highest to the south-east, as the range stands from the plain.
      const lean = 0.6 + 0.6 * smooth(-3600, 2600, z);
      hs[idx(i, j)] = 46 + ridge * (150 + 640 * Math.pow(folded, 1.35)) * peaks * lean;
    }
  }
  const dx = depth / rows;
  const dz = (z1 - z0) / cols;
  for (let j = 0; j <= rows; j++) {
    for (let i = 0; i <= cols; i++) {
      const h = hs[idx(i, j)]!;
      const hx = (hs[idx(i, j + 1)]! - hs[idx(i, j - 1)]!) / (2 * dx);
      const hz = (hs[idx(i + 1, j)]! - hs[idx(i - 1, j)]!) / (2 * dz);
      const l = Math.hypot(hx, 1, hz);
      const n = fbm(i / 9, j / 4, seed + 31, 3);
      const steep = Math.hypot(hx, hz);
      // Snow lies above the snow line, less of it on the steepest faces.
      const snow = smooth(250 + 60 * n, 330 + 60 * n, h) * (1 - 0.55 * smooth(0.5, 1.1, steep));
      const rock: Rgb = [0.2 + 0.07 * n, 0.21 + 0.06 * n, 0.27 + 0.07 * n];
      const low: Rgb = [0.25 + 0.06 * n, 0.27 + 0.05 * n, 0.15];
      const base = blend(low, rock, smooth(90, 240, h));
      b.vertex([x0 + dx * j, h, z0 + dz * i], [-hx / l, 1 / l, -hz / l], 0, 0, blend(base, [0.94, 0.96, 1], snow));
    }
  }
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      b.tri(idx(i, j), idx(i + 1, j), idx(i, j + 1));
      b.tri(idx(i + 1, j), idx(i + 1, j + 1), idx(i, j + 1));
    }
  }
  return b.build();
}

// ---- Water -------------------------------------------------------------------------------------------------------------
/** A ribbon of flat quads along a path, at heights given per point. */
function ribbon(b: MeshBuilder, path: Pt[], half: number, y: (p: Pt) => number, colour: Rgb): void {
  for (let i = 0; i < path.length - 1; i++) {
    const [ax, az] = path[i]!;
    const [bx, bz] = path[i + 1]!;
    const dx = bx - ax;
    const dz = bz - az;
    const l = Math.hypot(dx, dz) || 1;
    const nx = (-dz / l) * half;
    const nz = (dx / l) * half;
    const ya = y(path[i]!);
    const yb = y(path[i + 1]!);
    b.quad([ax + nx, ya, az + nz], [bx + nx, yb, bz + nz], [bx - nx, yb, bz - nz], [ax - nx, ya, az - nz], colour);
  }
}
export function buildRiver(): MeshData {
  const b = new MeshBuilder();
  const path: Pt[] = [];
  for (let x = LAND.x0; x <= 1240; x += 20) path.push([x, riverZ(x)]);
  ribbon(b, path.reverse(), RIVER_HALF + 6, (p) => waterLevel(p[0]), [1, 1, 1]);
  return b.build();
}
/**
 * The water of one channel in two stretches, head and tail, as strips the renderer shows or hides: a branch that
 * carries its water shows both, a broken one only its head.
 */
export function channelWater(id: string, seed: number): { head: MeshData; tail: MeshData } {
  // A channel drawn between two points only is given a middle, so that it too has a head and a tail.
  const given = CHANNELS[id]!;
  const path: Pt[] = given.length === 2 ? [given[0]!, [(given[0]![0] + given[1]![0]) / 2, (given[0]![1] + given[1]![1]) / 2], given[1]!] : given;
  const cut = Math.max(1, Math.floor(path.length / 2));
  const strip = (part: Pt[]) => {
    const b = new MeshBuilder();
    // The water stands over the highest land near each point, so that neither edge of it dips under a slope.
    const over = (q: Pt) => Math.max(...[[0, 0], [1.5, 0], [-1.5, 0], [0, 1.5], [0, -1.5]].map(([dx, dz]) => heightAt(q[0] + dx!, q[1] + dz!, seed)));
    ribbon(b, [...part].reverse(), CHANNEL_HALF - 0.25, (q) => over(q) + CHANNEL_WATER, [1, 1, 1]);
    return b.build();
  };
  return { head: strip(path.slice(0, cut + 1)), tail: strip(path.slice(cut)) };
}
export function poolWater(): MeshData {
  const b = new MeshBuilder();
  const n = 48;
  const r = POOL.r - 0.6;
  const centre = b.vertex([POOL.x, 0, POOL.z], [0, 1, 0], POOL.x, POOL.z, [1, 1, 1]);
  const rim: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    rim.push(b.vertex([POOL.x + Math.cos(a) * r, 0, POOL.z + Math.sin(a) * r], [0, 1, 0], POOL.x + Math.cos(a) * r, POOL.z + Math.sin(a) * r, [1, 1, 1]));
  }
  for (let i = 0; i < n; i++) b.tri(centre, rim[(i + 1) % n]!, rim[i]!);
  return b.build();
}

// ---- Built things ------------------------------------------------------------------------------------------------------
export interface Chunk {
  material: MaterialId;
  mesh: MeshData;
}
const STONE: Rgb = [0.78, 0.72, 0.62];
const PLASTER: Rgb = [0.95, 0.9, 0.8];
/** Points along a path: where each is, the turn that lays a piece's length along the path, and the unit normal to its left. */
const along = (path: Pt[], step: number): Array<{ x: number; z: number; yaw: number; nx: number; nz: number }> => {
  const out: Array<{ x: number; z: number; yaw: number; nx: number; nz: number }> = [];
  for (let i = 0; i < path.length - 1; i++) {
    const [ax, az] = path[i]!;
    const [bx, bz] = path[i + 1]!;
    const l = Math.hypot(bx - ax, bz - az);
    // A frame's own z axis points along (sin, cos) of its turn.
    const yaw = Math.atan2(bx - ax, bz - az);
    for (let d = 0; d < l; d += step) out.push({ x: ax + ((bx - ax) * d) / l, z: az + ((bz - az) * d) / l, yaw, nx: -(bz - az) / l, nz: (bx - ax) / l });
  }
  return out;
};

/** A tower with a crenellated top. */
function tower(set: MeshSet, x: number, y: number, z: number, w: number, h: number, yaw: number, tint: Rgb): void {
  const f = frame(x, y, z, yaw);
  const b = set.at("ashlar", x, z);
  b.box(f, 0, 0, 0, w, h, w, tint, 31, 0.8);
  b.box(f, 0, h, 0, w + 0.9, 0.7, w + 0.9, tint, 63);
  const m = w + 0.9;
  for (let i = -2; i <= 2; i++) {
    for (const s of [-1, 1]) {
      b.box(f, (i * m) / 5, h + 0.7, (s * (m - 0.6)) / 2, m / 9, 1.1, 0.6, tint, 31);
      b.box(f, (s * (m - 0.6)) / 2, h + 0.7, (i * m) / 5, 0.6, 1.1, m / 9, tint, 31);
    }
  }
  // Slit windows.
  for (const s of [-1, 1]) set.at("wood", x, z).box(f, 0, h * 0.62, (s * (w + 0.06)) / 2, 0.5, 1.8, 0.08, [0.16, 0.12, 0.09], 63);
}

/** A stretch of curtain wall between two points, following the land, with merlons. */
function curtain(set: MeshSet, a: Pt, c: Pt, seed: number, hWall: number, tint: Rgb): void {
  const l = Math.hypot(c[0] - a[0], c[1] - a[1]);
  const n = Math.max(1, Math.round(l / 9));
  for (let i = 0; i < n; i++) {
    const x = a[0] + ((c[0] - a[0]) * (i + 0.5)) / n;
    const z = a[1] + ((c[1] - a[1]) * (i + 0.5)) / n;
    const y = heightAt(x, z, seed) - 1.5;
    // The wall's length lies along the frame's own x axis, which points along (cos, -sin) of its turn.
    const f = frame(x, y, z, Math.atan2(-(c[1] - a[1]), c[0] - a[0]));
    const b = set.at("ashlar", x, z);
    b.box(f, 0, 0, 0, l / n + 0.2, hWall + 1.5, 1.6, tint, 31, 0.82);
    for (const k of [-0.3, 0.3]) b.box(f, (k * l) / n, hWall + 1.5, 0.55, l / n / 4.4, 1, 0.5, tint, 31);
  }
}

export interface Scenery {
  chunks: Chunk[];
  /** Places for things drawn many times: [x, y, z, yaw, scale]. */
  cypresses: number[][];
  /** Broad trees along the borders of plots and here and there on the plain. */
  trees: number[][];
  /** Orchards of dark-leaved fruit trees, and orchards that blossom in spring. */
  citrus: number[][];
  almonds: number[][];
  /** Fruit trees in the yards and lanes of the village. */
  gardens: number[][];
  /** Poplars along the river and some borders. */
  poplars: number[][];
  /** Low evergreen trees on the dry hills. */
  scrub: number[][];
  olives: number[][];
  palms: number[][];
  stalls: number[][];
  /** Where each house of the village stands, in the order houses are built. */
  houses: Chunk[][];
  granary: Chunk[];
  /** The stone of the meadow's branch, which does not exist until the channel is rebuilt. */
  meadowChannel: Chunk[];
  /** Where buildings stand, as circles: nothing is planted inside one. */
  footprints: Array<{ x: number; z: number; r: number }>;
  /** The mill's wheel, about its own axle, and where the axle is. */
  wheel: { mesh: MeshData; x: number; y: number; z: number; yaw: number };
  /** An ox-cart, and the roads carts go along. */
  cart: MeshData;
  cartRoads: Pt[][];
  triangles: number;
}

/** The road through the valley: from the west, through the village square, past the market and up to the hill town. */
export const ROAD_WEST: Pt[] = [[-1080, 236], [-760, 214], [-470, 206], [-250, 196], [-60, 190], [50, 186]];
export const ROAD_EAST: Pt[] = [[202, 187], [226, 208], [262, 226], [318, 244], [400, 240], [500, 222], [590, 176], [668, 112], [730, 40], [786, -34], [826, -92]];
/** The road north: from the village over the two channels to the bridge, and on beyond the river. */
const BRIDGE_Z = riverZ(BRIDGE.x);
export const ROAD_NORTH: Pt[] = [[34, 150], [22, 70], [11, -10], [6, -72], [BRIDGE.x, BRIDGE_Z + BRIDGE.length / 2]];
export const ROAD_BEYOND: Pt[] = [[BRIDGE.x, BRIDGE_Z - BRIDGE.length / 2], [2, BRIDGE_Z - 90], [-16, -360], [-64, -660], [-120, -1120]];
const ROADS: Pt[][] = [ROAD_WEST, ROAD_EAST, ROAD_NORTH, ROAD_BEYOND];

/** A smooth line through a road's points, a point every few metres. */
export function roadLine(path: Pt[]): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < path.length - 1; i++) {
    const p0 = path[Math.max(0, i - 1)]!;
    const p1 = path[i]!;
    const p2 = path[i + 1]!;
    const p3 = path[Math.min(path.length - 1, i + 2)]!;
    const n = Math.max(2, Math.round(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 6));
    for (let k = 0; k < n; k++) {
      const t = k / n;
      const c = (a: number, b: number, cc: number, d: number) => 0.5 * (2 * b + (cc - a) * t + (2 * a - 5 * b + 4 * cc - d) * t * t + (3 * b - a - 3 * cc + d) * t * t * t);
      pts.push([c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  pts.push(path[path.length - 1]!);
  return pts;
}
const segmentDistance = (x: number, z: number, q: Pt, r: Pt): number => {
  const t = Math.max(0, Math.min(1, ((x - q[0]) * (r[0] - q[0]) + (z - q[1]) * (r[1] - q[1])) / ((r[0] - q[0]) ** 2 + (r[1] - q[1]) ** 2)));
  return Math.hypot(x - q[0] - (r[0] - q[0]) * t, z - q[1] - (r[1] - q[1]) * t);
};
const pathDistance = (x: number, z: number, path: Pt[]): number => path.reduce((least, q, i) => (path[i + 1] ? Math.min(least, segmentDistance(x, z, q, path[i + 1]!)) : least), Infinity);
const nearRoad = (x: number, z: number): boolean => ROADS.some((path) => pathDistance(x, z, path) < 9);
/**
 * How high a road's surface is at a point: on the land, humped over a channel it crosses, and climbing to the
 * bridge's roadway where it comes within reach of the bridge.
 */
export function roadHeight(x: number, z: number, seed: number): number {
  const channel = Math.min(...Object.values(CHANNELS).map((path) => pathDistance(x, z, path)));
  const ground = heightAt(x, z, seed) + 0.16 + (CHANNEL_WATER + 0.62) * smooth(9, 3.4, channel);
  const fromEnd = Math.abs(Math.abs(z - BRIDGE_Z) - BRIDGE.length / 2);
  const near = Math.abs(x - BRIDGE.x) < 30 && Math.abs(z - BRIDGE_Z) < BRIDGE.length / 2 + 60;
  return near ? Math.max(ground, waterLevel(BRIDGE.x) + BRIDGE.deck + 0.02 - 0.085 * fromEnd) : ground;
}
function roadMesh(path: Pt[], seed: number): MeshData {
  const b = new MeshBuilder();
  ribbon(b, roadLine(path).reverse(), 2.9, (q) => roadHeight(q[0], q[1], seed), [0.6, 0.5, 0.36]);
  return b.build();
}

export function buildScenery(seed: number): Scenery {
  const rng = new Rng(hash32("granada-valley", seed >>> 0));
  const set = new MeshSet(4000);
  const y = (x: number, z: number) => heightAt(x, z, seed);
  const footprints: Array<{ x: number; z: number; r: number }> = [{ x: STORE[0], z: STORE[1], r: 19 }, { x: GRANARY[0], z: GRANARY[1], r: 16 }, ...HOUSE_LOTS.map((l) => ({ x: l.x, z: l.z, r: 12 })), { x: MOSQUE[0], z: MOSQUE[1] - 6, r: 20 }, { x: MILL[0], z: MILL[1] + 1.5, r: 12 }];
  const built = (x: number, z: number, margin = 0) => footprints.some((f) => Math.hypot(f.x - x, f.z - z) < f.r + margin);

  // The mosque, its court to the north of the hall. The mill at the tail of the west branch, and its wheel.
  mosque(set, frame(MOSQUE[0], y(MOSQUE[0], MOSQUE[1]), MOSQUE[1], Math.PI));
  const millFrame = frame(MILL[0], y(MILL[0], MILL[1]), MILL[1], 0);
  const milled = millHouse(set, millFrame);
  const axle = toWorld(millFrame, milled.axle[0], milled.axle[1], milled.axle[2]);
  const wheel = { mesh: waterWheel(milled.radius), x: axle[0], y: axle[1], z: axle[2], yaw: 0 };

  // The bridge that carries the road north over the river, and the banks built up to its roadway at each end.
  const bridgeFrame = frame(BRIDGE.x, waterLevel(BRIDGE.x), BRIDGE_Z, -Math.PI / 2);
  bridge(set, bridgeFrame, BRIDGE.length, BRIDGE.width, 3, BRIDGE.deck);
  for (const side of [-1, 1]) {
    for (let d = 2; d < 44; d += 4) {
      const z = BRIDGE_Z + side * (BRIDGE.length / 2 + d);
      const top = Math.min(roadHeight(BRIDGE.x, z - 2.05, seed), roadHeight(BRIDGE.x, z + 2.05, seed)) - 0.04;
      const ground = y(BRIDGE.x, z);
      if (top - ground > 0.3) set.at("ashlar", BRIDGE.x, z).box(frame(BRIDGE.x, ground - 1.2, z), 0, 0, 0, BRIDGE.width + 0.4, top - ground + 1.14, 4.1, [0.72, 0.66, 0.55], 15, 0.8);
    }
  }

  // Channels: a stone bed and two low walls, banked a little above the land. The intake comes from the river to the pool.
  const meadowSet = new MeshSet(4000);
  for (const [id, path] of Object.entries(CHANNELS)) {
    for (const p of along(path, 3)) {
      const f = frame(p.x, y(p.x, p.z) - 0.5, p.z, p.yaw);
      const b = (id === "meadow" ? meadowSet : set).at("ashlar", p.x, p.z);
      b.box(f, 0, 0, 0, CHANNEL_HALF * 2 + 1.1, 0.5 + CHANNEL_WATER - 0.25, 3.2, [STONE[0] * 0.8, STONE[1] * 0.8, STONE[2] * 0.8], 31);
      for (const s of [-1, 1]) b.box(f, s * (CHANNEL_HALF + 0.3), 0, 0, 0.6, 0.5 + CHANNEL_WATER + 0.28, 3.2, STONE, 31, 0.85);
    }
  }
  // The pool: a ring of dressed stone with a walk round it and steps of masonry on the land side.
  for (let i = 0; i < 56; i++) {
    const a = (i / 56) * Math.PI * 2;
    const x = POOL.x + Math.cos(a) * POOL.r;
    const z = POOL.z + Math.sin(a) * POOL.r;
    const f = frame(x, y(POOL.x + POOL.r + 6, POOL.z) - 3.4, z, -a);
    set.at("ashlar", x, z).box(f, 0, 0, 0, 1.6, 4.6, 4.1, STONE, 31, 0.8);
    set.at("paving", x, z).box(frame(POOL.x + Math.cos(a) * (POOL.r + 3), y(POOL.x + POOL.r + 6, POOL.z) + 0.05, POOL.z + Math.sin(a) * (POOL.r + 3), -a), 0, 0, 0, 4.6, 0.25, 4.4, [0.86, 0.8, 0.7], 31);
  }

  // The store: a long hall with a tiled roof and an arcade of piers on its sunny side. The market: awnings on posts.
  const hall = (cx: number, cz: number, w: number, d: number, h: number, wall: Rgb, into: MeshSet) => {
    const base = y(cx, cz);
    const f = frame(cx, base - 0.4, cz, 0.06);
    into.at("plaster", cx, cz).box(f, 0, 0, 0, w, h + 0.4, d, wall, 31, 0.86);
    const r = into.at("roof", cx, cz);
    // A pitched roof: two slopes meeting on a ridge along the length.
    const e = 0.9;
    const top = h + 0.4 + d * 0.32;
    const P = (lx: number, ly: number, lz: number): [number, number, number] => [f.x + lx * f.cos + lz * f.sin, f.y + ly, f.z - lx * f.sin + lz * f.cos];
    r.quad(P(-w / 2 - e, h + 0.3, d / 2 + e), P(w / 2 + e, h + 0.3, d / 2 + e), P(w / 2 + e, top, 0), P(-w / 2 - e, top, 0), [0.72, 0.36, 0.22]);
    r.quad(P(w / 2 + e, h + 0.3, -d / 2 - e), P(-w / 2 - e, h + 0.3, -d / 2 - e), P(-w / 2 - e, top, 0), P(w / 2 + e, top, 0), [0.66, 0.33, 0.2]);
    for (const s of [-1, 1]) into.at("plaster", cx, cz).quad(P((s * w) / 2, h + 0.4, (s * d) / 2), P((s * w) / 2, h + 0.4, (-s * d) / 2), P((s * w) / 2, top, 0), P((s * w) / 2, top, 0), wall);
    for (let i = 0; i <= 6; i++) into.at("ashlar", cx, cz).box(f, -w / 2 + (w * i) / 6, 0, d / 2 + 2.4, 0.8, h * 0.72, 0.8, STONE, 31, 0.85);
    into.at("roof", cx, cz).box(f, 0, h * 0.72 + 0.4, d / 2 + 1.3, w + 0.8, 0.22, 3.4, [0.68, 0.34, 0.2], 63);
    into.at("wood", cx, cz).box(f, 0, 0.4, d / 2 + 0.06, 2.2, 3, 0.12, [0.3, 0.2, 0.12], 63);
  };
  hall(STORE[0], STORE[1], 30, 13, 6.2, PLASTER, set);
  const granarySet = new MeshSet(4000);
  hall(GRANARY[0], GRANARY[1], 24, 12, 7.4, [0.9, 0.82, 0.68], granarySet);
  for (let i = 0; i < 5; i++) granarySet.at("ashlar", GRANARY[0], GRANARY[1]).box(frame(GRANARY[0] - 10 + i * 5, y(GRANARY[0], GRANARY[1]) - 0.4, GRANARY[1] - 6.6, 0.06), 0, 0, 0, 1.3, 5.4, 1.5, STONE, 31, 0.8);

  // The village square: paving, a fountain basin, and a well.
  const sq = set.at("paving", VILLAGE[0], VILLAGE[1]);
  sq.box(frame(VILLAGE[0] + 16, y(VILLAGE[0] + 16, VILLAGE[1] + 16) - 0.25, VILLAGE[1] + 16, 0.05), 0, 0, 0, 150, 0.32, 34, [0.84, 0.78, 0.68], 31);
  const fount = frame(VILLAGE[0] + 18, y(VILLAGE[0] + 18, VILLAGE[1] + 16), VILLAGE[1] + 16);
  set.at("ashlar", fount.x, fount.z).cylinder(fount, 0, 0, 0, 3.2, 3.2, 0.9, 12, STONE, false);
  set.at("ashlar", fount.x, fount.z).cylinder(fount, 0, 0, 0, 0.45, 0.3, 2.3, 8, STONE, true);
  set.at("canalwater", fount.x, fount.z).cylinder(fount, 0, 0.7, 0, 2.9, 2.9, 0.02, 12, [1, 1, 1], true);

  // Houses of the village, one group of chunks each, so that a new house can appear when it is built.
  const houses: Chunk[][] = HOUSE_LOTS.map((lot, i) => {
    const hs = new MeshSet(4000);
    andalusiHouse(hs, frame(lot.x, y(lot.x, lot.z) - 0.2, lot.z, lot.yaw), 10 + (i % 3) * 1.5, 7 + ((i * 7) % 3), rng.fork(`house-${i}`));
    return hs.chunks().map((c) => ({ material: c.material, mesh: c.mesh }));
  });

  // The hill town: a wall with towers round the crown, a keep and halls within, and houses down the western slope.
  const crown: Pt[] = [];
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const rr = 118 + 34 * Math.sin(a * 2 + 0.6) + 16 * Math.sin(a * 5);
    crown.push([HILL.x + Math.cos(a) * rr * 1.25, HILL.z + Math.sin(a) * rr * 0.8]);
  }
  const wallTint: Rgb = [0.86, 0.6, 0.44];
  crown.forEach((p, i) => {
    const q = crown[(i + 1) % crown.length]!;
    curtain(set, p, q, seed, 9, wallTint);
    tower(set, p[0], y(p[0], p[1]) - 2, p[1], 9 + (i % 3), 19 + ((i * 5) % 7), (i / 14) * Math.PI * 2, wallTint);
  });
  for (let i = 0; i < 9; i++) {
    const a = rng.range(0, Math.PI * 2);
    const d = rng.range(0, 70);
    const cx = HILL.x + Math.cos(a) * d * 1.2;
    const cz = HILL.z + Math.sin(a) * d * 0.75;
    const w = rng.range(18, 34);
    const dd = rng.range(14, 24);
    const hh = rng.range(9, 17);
    const f = frame(cx, y(cx, cz) - 2, cz, rng.range(-0.4, 0.4));
    townHouse(set, frame(cx, y(cx, cz), cz, rng.range(-0.4, 0.4)), w, dd, hh + 2, [wallTint[0] * 1.08, wallTint[1] * 1.12, wallTint[2] * 1.14], [0.7, 0.36, 0.22]);
    void f;
    if (i < 3) tower(set, cx + w / 2, y(cx, cz) - 2, cz - dd / 2, 8, hh + 12, f.cos, wallTint);
  }
  for (let i = 0; i < 150; i++) {
    const a = rng.range(Math.PI * 0.55, Math.PI * 1.5);
    const d = rng.range(170, 330);
    const cx = HILL.x + Math.cos(a) * d * 1.2;
    const cz = HILL.z + Math.sin(a) * d * 0.95;
    const w = rng.range(9, 15);
    const dd = rng.range(8, 13);
    const hh = rng.range(3.5, 8);
    const lime = 0.84 + rng.range(0, 0.12);
    townHouse(set, frame(cx, y(cx, cz), cz, rng.range(0, Math.PI)), w, dd, hh, [lime, lime * 0.97, lime * 0.9], [0.7 + rng.range(-0.06, 0.06), 0.37, 0.22]);
  }

  // The old village: houses that were there before the steward came, round the square and along two lanes.
  for (let i = 0; i < 34; i++) {
    const row = i % 2;
    const along = Math.floor(i / 2);
    const lx = -30 + along * 17 + (row ? 6 : 0);
    const lz = row ? 250 + (along % 3) * 3 : 132 - (along % 2) * 4;
    if (lx > 250) continue;
    if (built(lx, lz, 7) || nearRoad(lx, lz)) continue;
    andalusiHouse(set, frame(lx, y(lx, lz) - 0.2, lz, row ? Math.PI + rng.range(-0.15, 0.15) : rng.range(-0.15, 0.15)), rng.range(8.5, 12), rng.range(6.5, 8.5), rng.fork(`old-${i}`));
    footprints.push({ x: lx, z: lz, r: 9 });
  }

  for (let i = 0; i < 12; i++) {
    const lx = -46 + (i % 2) * 22 + rng.range(-2, 2);
    const lz = 146 + Math.floor(i / 2) * 19 + rng.range(-2, 2);
    if (built(lx, lz, 7) || nearRoad(lx, lz)) continue;
    andalusiHouse(set, frame(lx, y(lx, lz) - 0.2, lz, Math.PI / 2 + (i % 2) * Math.PI + rng.range(-0.2, 0.2)), rng.range(8.5, 11.5), rng.range(6.5, 8.5), rng.fork(`west-${i}`));
    footprints.push({ x: lx, z: lz, r: 9 });
  }

  // Things drawn many times.
  const place = (x: number, z: number, s: number, yaw = rng.range(0, Math.PI * 2)) => [x, y(x, z), z, yaw, s];
  const clear = (x: number, z: number) => fieldAt(x, z) === null && Math.hypot(x - POOL.x, z - POOL.z) > POOL.r + 9 && Math.abs(z - riverZ(x)) > RIVER_HALF + 8 && settled(x, z) < 0.05 && !nearRoad(x, z) && !built(x, z, 2) && Math.hypot(x - MARKET[0], z - MARKET[1]) > 30 && !Object.values(CHANNELS).some((path) => path.some((p) => Math.hypot(p[0] - x, p[1] - z) < 9));
  const cypresses: number[][] = [];
  const trees: number[][] = [];
  const citrus: number[][] = [];
  const almonds: number[][] = [];
  const gardens: number[][] = [];
  const poplars: number[][] = [];
  const scrub: number[][] = [];
  const palms: number[][] = [];
  // Cypresses in lines along the channels and round the village.
  for (const path of [CHANNELS.main!, CHANNELS.west!, CHANNELS.meadow!]) for (const p of along(path, 13)) if (fieldAt(p.x + p.nx * 7, p.z + p.nz * 7) === null && !built(p.x + p.nx * 7, p.z + p.nz * 7, 3) && !nearRoad(p.x + p.nx * 7, p.z + p.nz * 7) && Math.hypot(p.x + p.nx * 7 - POOL.x, p.z + p.nz * 7 - POOL.z) > POOL.r + 8) cypresses.push(place(p.x + p.nx * 7, p.z + p.nz * 7, rng.range(0.9, 1.3)));
  for (let i = 0; i < 70; i++) {
    const a = (i / 70) * Math.PI * 2;
    const x = VILLAGE[0] + 6 + Math.cos(a) * (176 + rng.range(-6, 6));
    const z = VILLAGE[1] + 22 + Math.sin(a) * (102 + rng.range(-5, 5));
    if (clear(x, z)) cypresses.push(place(x, z, rng.range(1, 1.5)));
  }
  // The plain, plot by plot: orchards planted in rows square to their plot, and lines of trees along some borders.
  const G = PLOT_GRID;
  for (let cv = G.v0; cv < G.v0 + G.h; cv++) {
    for (let cu = G.u0; cu < G.u0 + G.w; cu++) {
      const centre = plotPoint((cu + 0.5) * G.du, (cv + 0.5) * G.dv);
      if (worked(centre[0], centre[1], 0) < 0.25) continue;
      const plot = plotAt(centre[0], centre[1], seed);
      const local = rng.fork(`plot:${cu}:${cv}`);
      if (plot.kind === "orchard") {
        const blossom = plot.tone > 0.55;
        for (let U = cu * G.du + 8; U < (cu + 1) * G.du - 5; U += 10) {
          for (let V = cv * G.dv + 8; V < (cv + 1) * G.dv - 5; V += 10) {
            const [px, pz] = plotPoint(U + local.range(-0.8, 0.8), V + local.range(-0.8, 0.8));
            if (worked(px, pz, 0) < 0.5 || !clear(px, pz) || local.chance(0.04)) continue;
            (blossom ? almonds : citrus).push(place(px, pz, local.range(0.85, 1.2), local.range(0, Math.PI * 2)));
          }
        }
      }
      // A line of trees along the plot's western or northern border, for one plot in three.
      for (const side of [0, 1]) {
        if (!local.chance(0.3)) continue;
        const kind = local.pick(["tree", "tree", "tree", "cypress", "poplar"] as const);
        const length = side === 0 ? G.du : G.dv;
        for (let d = 4; d < length; d += kind === "tree" ? 12 : 8) {
          if (local.chance(0.2)) continue;
          const [px, pz] = side === 0 ? plotPoint(cu * G.du + d, cv * G.dv + local.range(-1, 1)) : plotPoint(cu * G.du + local.range(-1, 1), cv * G.dv + d);
          if (worked(px, pz, 0) < 0.4 || !clear(px, pz)) continue;
          if (kind === "tree") trees.push(place(px, pz, local.range(1.1, 1.7), local.range(0, Math.PI * 2)));
          else (kind === "cypress" ? cypresses : poplars).push(place(px, pz, local.range(1, 1.5), local.range(0, Math.PI * 2)));
        }
      }
    }
  }
  // Poplars and willows along both banks of the river.
  for (let x = LAND.x0 + 40; x < 1150; x += 9) {
    for (const side of [-1, 1]) {
      if (!rng.chance(0.72)) continue;
      const px = x + rng.range(-4, 4);
      const pz = riverZ(px) + side * (RIVER_HALF + 13 + rng.range(0, 14));
      if (fieldAt(px, pz) !== null || Math.hypot(px - POOL.x, pz - POOL.z) < POOL.r + 14 || Math.abs(px - 140) < 8 || Math.abs(px - BRIDGE.x) < 12) continue;
      (rng.chance(0.7) ? poplars : trees).push(place(px, pz, rng.range(1, 1.6)));
    }
  }
  // Trees along the road, and low evergreens on the dry hills.
  for (const path of [ROAD_WEST, ROAD_EAST]) {
    for (const p of along(path, 16)) {
      for (const side of [-1, 1]) {
        const px = p.x + p.nx * side * 7.5;
        const pz = p.z + p.nz * side * 7.5;
        if (rng.chance(0.55) && fieldAt(px, pz) === null && settled(px, pz) < 0.05 && Math.hypot(px - MARKET[0], pz - MARKET[1]) > 30 && px < 640) (px > 380 ? cypresses : trees).push(place(px, pz, rng.range(1, 1.5)));
      }
    }
  }
  for (let i = 0; i < 5200; i++) {
    const x = rng.range(LAND.x0 + 40, LAND.x1 - 40);
    const z = rng.range(LAND.z0 + 60, LAND.z1 - 60);
    if (worked(x, z, 0) > 0.2 || settled(x, z) > 0.05 || Math.abs(z - riverZ(x)) < RIVER_HALF + 10 || nearRoad(x, z) || Math.hypot(x - HILL.x, z - HILL.z) < 190) continue;
    if (fbm(x / 130, z / 130, seed + 14, 3) > 0.47) scrub.push(place(x, z, rng.range(0.7, 1.5)));
  }
  for (let i = 0; i < 260; i++) {
    const x = rng.range(-56, 276);
    const z = rng.range(98, 272);
    const onSquare = x > 44 && x < 208 && z > 164 && z < 208;
    if (settled(x, z) > 0.6 && !onSquare && !built(x, z, 1.5) && !nearRoad(x, z) && fieldAt(x, z) === null && Math.hypot(x - MARKET[0], z - MARKET[1]) > 30) gardens.push(place(x, z, rng.range(0.7, 1.05)));
  }
  for (let i = 0; i < 70; i++) {
    const x = VILLAGE[0] + rng.range(-120, 160);
    const z = VILLAGE[1] + rng.range(-24, 60);
    if (fieldAt(x, z) === null && !built(x, z) && !nearRoad(x, z)) palms.push(place(x, z, rng.range(1, 1.5)));
  }
  // Olive trees in rows on their terraces.
  const olives: number[][] = [];
  for (let t = 0; t < 4; t++) {
    for (let k = 0; k < 2; k++) {
      const x = 240 + t * 62 + k * 28;
      for (let z = 22; z < 182; z += 13) if (inside(FIELDS["olive-terrace"]!, x, z)) olives.push(place(x + rng.range(-2, 2), z + rng.range(-2, 2), rng.range(1.1, 1.6)));
    }
  }
  // Retaining walls of the terraces.
  for (let t = 0; t < 4; t++) {
    const x = 224 + t * 62;
    for (let z = 10; z < 186; z += 6) set.at("ashlar", x, z).box(frame(x - 0.6, y(x - 3, z) - 0.6, z), 0, 0, 0, 1.3, TERRACE_STEP + 1.2, 6.1, [0.74, 0.66, 0.54], 31, 0.8);
  }
  const stalls: number[][] = [];
  for (let i = 0; i < 9; i++) stalls.push([MARKET[0] + (i % 3) * 9 - 9, y(MARKET[0], MARKET[1]), MARKET[1] + Math.floor(i / 3) * 8 - 8, (i % 2) * Math.PI, 1]);
  set.at("paving", MARKET[0], MARKET[1]).box(frame(MARKET[0], y(MARKET[0], MARKET[1]) - 0.2, MARKET[1]), 0, 0, 0, 40, 0.3, 34, [0.84, 0.78, 0.68], 31);

  const chunks: Chunk[] = set.chunks().map((c) => ({ material: c.material, mesh: c.mesh }));
  for (const road of ROADS) chunks.push({ material: "earth", mesh: roadMesh(road, seed) });
  const granary = granarySet.chunks().map((c) => ({ material: c.material, mesh: c.mesh }));
  const meadowChannel = meadowSet.chunks().map((c) => ({ material: c.material, mesh: c.mesh }));
  const tris = (cs: Chunk[]) => cs.reduce((n, c) => n + c.mesh.indices.length / 3, 0);
  return { chunks, cypresses, trees, citrus, almonds, gardens, poplars, scrub, olives, palms, stalls, houses, granary, meadowChannel, footprints, wheel, cart: oxCart(), cartRoads: [roadLine(ROAD_WEST), roadLine(ROAD_EAST)], triangles: tris(chunks) + tris(granary) + houses.reduce((n, h) => n + tris(h), 0) };
}

// ---- Crops -------------------------------------------------------------------------------------------------------------
/** Places for the plants of a field, in a fixed order: the first `n` are drawn when only part of a crop stands. */
export function cropSpots(field: string, spacing: number, seed: number): Float32Array {
  const poly = FIELDS[field]!;
  const rng = new Rng(hash32(`crop:${field}`, seed >>> 0));
  const xs = poly.map((p) => p[0]);
  const zs = poly.map((p) => p[1]);
  const out: number[] = [];
  for (let z = Math.min(...zs) + spacing; z < Math.max(...zs); z += spacing) {
    for (let x = Math.min(...xs) + spacing; x < Math.max(...xs); x += spacing * 0.6) {
      const px = x + rng.range(-0.3, 0.3) * spacing;
      const pz = z + rng.range(-0.12, 0.12) * spacing;
      if (!inside(poly, px, pz)) continue;
      out.push(px, heightAt(px, pz, seed), pz, rng.range(0, Math.PI), rng.range(0.8, 1.25));
    }
  }
  return Float32Array.from(out);
}

/** A tuft of standing corn: seven narrow blades that taper and lean apart, paler toward the ear. About a metre tall at scale 1. */
export function wheatTuft(): MeshData {
  const b = new MeshBuilder();
  const lo: Rgb = [0.42, 0.4, 0.34];
  const hi: Rgb = [1, 1, 1];
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + 0.3;
    // Where the blade stands in the tuft, which way its flat side faces, and how it leans outward.
    const px = Math.cos(a) * 0.34 * (i % 2 ? 1 : 0.45);
    const pz = Math.sin(a) * 0.34 * (i % 2 ? 1 : 0.45);
    const fx = Math.cos(a * 1.7 + 1) * 0.11;
    const fz = Math.sin(a * 1.7 + 1) * 0.11;
    const lx = Math.cos(a) * 0.2;
    const lz = Math.sin(a) * 0.2;
    const h = 0.92 + 0.16 * ((i * 5) % 4) / 3;
    b.quad([px - fx, 0, pz - fz], [px + fx, 0, pz + fz], [px + lx + fx * 0.35, h, pz + lz + fz * 0.35], [px + lx - fx * 0.35, h, pz + lz - fz * 0.35], lo, 0, 0, hi);
  }
  return b.build();
}
/** A low leafy plant in a row. */
export function vegetablePlant(): MeshData {
  const b = new MeshBuilder();
  const f = frame(0, 0, 0);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    b.revolve(frame(Math.cos(a) * 0.3, 0.05, Math.sin(a) * 0.3), 0, 0, 0, (t) => [0.34 * Math.sin(Math.PI * (0.1 + 0.9 * t)), 0.5 * t], 6, 3, [0.5, 0.5, 0.5], [1, 1, 1]);
  }
  void f;
  return b.build();
}
/** An olive tree: a short twisted trunk under a broad silver-green crown. About six metres at scale 1. */
export function oliveTree(seed: number): MeshData {
  const rng = new Rng(hash32("olive", seed >>> 0));
  const b = new MeshBuilder();
  const f = frame(0, 0, 0);
  b.cylinder(f, 0, 0, 0, 0.42, 0.26, 1.7, 7, [0.33, 0.27, 0.21], false);
  b.cylinder(frame(0.25, 1.5, 0.1), 0, 0, 0, 0.22, 0.14, 1.1, 6, [0.33, 0.27, 0.21], false);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + rng.range(-0.3, 0.3);
    const r = i === 0 ? 0 : rng.range(1, 2);
    const rad = rng.range(1.2, 1.9);
    b.revolve(f, Math.cos(a) * r, 2.1 + rng.range(0, 1.2), Math.sin(a) * r, (t) => [rad * Math.sin(Math.PI * (0.05 + 0.95 * t)), rad * 0.8 * (1 - Math.cos(Math.PI * t))], 8, 5, [0.2, 0.28, 0.2], [0.5 + rng.range(0, 0.08), 0.6 + rng.range(0, 0.06), 0.44]);
  }
  return b.build();
}

/**
 * Trees for the plain. Their own colour is only light and shade (pale at the top, dark underneath and inside), so
 * that the renderer can give each kind and each season its colour. Every kind has a full shape for near and a light
 * one for far, which carries a dark patch on the ground in place of a cast shadow.
 */
const SHADE_LO: Rgb = [0.34, 0.36, 0.4];
const SHADE_HI: Rgb = [1, 1, 1];
const BARK: Rgb = [1.5, 1.0, 0.8];
const groundPatch = (b: MeshBuilder, r: number): void => {
  const dark: Rgb = [0.16, 0.17, 0.2];
  const c = b.vertex([r * 0.25, 0.22, r * 0.2], [0, 1, 0], 0, 0, dark);
  const rim: number[] = [];
  for (let i = 0; i < 7; i++) rim.push(b.vertex([r * 0.25 + Math.cos((i / 7) * Math.PI * 2) * r, 0.22, r * 0.2 + Math.sin((i / 7) * Math.PI * 2) * r * 0.8], [0, 1, 0], 0, 0, [0.5, 0.52, 0.56]));
  for (let i = 0; i < 7; i++) b.tri(c, rim[(i + 1) % 7]!, rim[i]!);
};
/** A broad round-headed tree, about seven metres at scale 1. */
export function broadTree(seed: number, far: boolean): MeshData {
  const rng = new Rng(hash32("broad", seed >>> 0));
  const b = new MeshBuilder();
  const f = frame(0, 0, 0);
  if (far) {
    groundPatch(b, 3.3);
    b.revolve(f, 0, 1.6, 0, (t) => [3 * Math.sin(Math.PI * (0.08 + 0.92 * t)), 2.6 * (1 - Math.cos(Math.PI * t))], 6, 3, SHADE_LO, SHADE_HI);
    return b.build();
  }
  b.cylinder(f, 0, 0, 0, 0.3, 0.2, 2.6, 6, BARK, false);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + rng.range(-0.3, 0.3);
    const r = i === 0 ? 0 : rng.range(1.1, 1.7);
    const rad = i === 0 ? 2.2 : rng.range(1.4, 1.9);
    b.revolve(f, Math.cos(a) * r, (i === 0 ? 2.6 : 2) + rng.range(0, 0.8), Math.sin(a) * r, (t) => [rad * Math.sin(Math.PI * (0.06 + 0.94 * t)), rad * 0.92 * (1 - Math.cos(Math.PI * t))], 7, 4, SHADE_LO, SHADE_HI);
  }
  return b.build();
}
/** An orchard tree: a short trunk and a neat round head, about four metres at scale 1. */
export function orchardTree(seed: number, far: boolean): MeshData {
  const rng = new Rng(hash32("orchard", seed >>> 0));
  const b = new MeshBuilder();
  const f = frame(0, 0, 0);
  if (far) {
    groundPatch(b, 2.5);
    b.revolve(f, 0, 0.9, 0, (t) => [2.2 * Math.sin(Math.PI * (0.08 + 0.92 * t)), 1.7 * (1 - Math.cos(Math.PI * t))], 6, 3, SHADE_LO, SHADE_HI);
    return b.build();
  }
  b.cylinder(f, 0, 0, 0, 0.2, 0.15, 1.3, 5, BARK, false);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + rng.range(-0.4, 0.4);
    const rad = rng.range(1.25, 1.55);
    b.revolve(f, Math.cos(a) * 0.7, 1.1 + rng.range(0, 0.5), Math.sin(a) * 0.7, (t) => [rad * Math.sin(Math.PI * (0.06 + 0.94 * t)), rad * 0.9 * (1 - Math.cos(Math.PI * t))], 7, 4, SHADE_LO, SHADE_HI);
  }
  return b.build();
}
/** A poplar: tall and narrow, about sixteen metres at scale 1. */
export function poplarTree(far: boolean): MeshData {
  const b = new MeshBuilder();
  const f = frame(0, 0, 0);
  if (far) {
    groundPatch(b, 2.2);
    b.revolve(f, 0, 1.2, 0, (t) => [1.7 * Math.pow(Math.sin(Math.PI * (0.08 + 0.92 * t)), 0.8) * (1 - 0.4 * t), 14.5 * t], 5, 4, SHADE_LO, SHADE_HI);
    return b.build();
  }
  b.cylinder(f, 0, 0, 0, 0.24, 0.16, 2.4, 6, BARK, false);
  b.revolve(f, 0, 1.6, 0, (t) => [1.75 * Math.pow(Math.sin(Math.PI * (0.06 + 0.94 * t)), 0.75) * (1 - 0.42 * t), 14.5 * t], 8, 9, SHADE_LO, SHADE_HI);
  b.revolve(f, 0.5, 3, 0.3, (t) => [1.1 * Math.sin(Math.PI * (0.06 + 0.94 * t)), 7 * t], 6, 5, SHADE_LO, SHADE_HI);
  return b.build();
}
/** A cypress: a dark spire about eleven metres tall at scale 1. */
export function cypressTree(far: boolean): MeshData {
  const b = new MeshBuilder();
  const f = frame(0, 0, 0);
  if (far) groundPatch(b, 1.6);
  else b.cylinder(f, 0, 0, 0, 0.18, 0.14, 1.2, 6, BARK, false);
  b.revolve(f, 0, far ? 0.8 : 1, 0, (t) => [1.15 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.1 + 0.9 * t)), 0.8) * (1 - 0.55 * t), 10 * t], far ? 5 : 9, far ? 4 : 8, SHADE_LO, SHADE_HI);
  return b.build();
}

/** The tilled ground of a field, laid on the land. */
export function fieldGround(field: string, seed: number): MeshData {
  const poly = FIELDS[field]!;
  const b = new MeshBuilder();
  const xs = poly.map((p) => p[0]);
  const zs = poly.map((p) => p[1]);
  const step = 5;
  const yAt = (x: number, z: number) => heightAt(x, z, seed) + 0.07;
  for (let z = Math.min(...zs); z < Math.max(...zs); z += step) {
    for (let x = Math.min(...xs); x < Math.max(...xs); x += step) {
      if (!inside(poly, x + step / 2, z + step / 2)) continue;
      b.quad([x, yAt(x, z + step), z + step], [x + step, yAt(x + step, z + step), z + step], [x + step, yAt(x + step, z), z], [x, yAt(x, z), z], [1, 1, 1], x, z);
    }
  }
  return b.build();
}
