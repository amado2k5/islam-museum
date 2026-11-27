// Where people can walk in the valley, and the way they go: around houses, round the pool, and over the river only by
// its bridge. Pure arithmetic on a grid of four-metre squares, so that it can be tested and any renderer can use it.
//
// A walker's way to a place is read from a "field" made once for that place: every square knows its next step toward
// it. The valley has a handful of places people go to, so a handful of fields serve every walker, whatever their number.
import type { Pt } from "./valley";

export interface WalkGrid {
  x0: number;
  z0: number;
  cell: number;
  w: number;
  h: number;
  /** 1 where no one may stand. */
  blocked: Uint8Array;
}

export interface WalkWorld {
  /** Circles nothing walks into: houses, the store, the mill, the mosque. */
  footprints: ReadonlyArray<{ x: number; z: number; r: number }>;
  /** The river's centre line, as z for a given x, and its half width. */
  riverZ: (x: number) => number;
  riverHalf: number;
  /** The one place the river may be crossed. */
  bridge: { x: number; halfWidth: number };
  pool: { x: number; z: number; r: number };
  bounds: { x0: number; x1: number; z0: number; z1: number };
}

export const CELL = 4;
/** How far from a wall a walker keeps. */
const CLEARANCE = 1.5;

export function walkGrid(world: WalkWorld): WalkGrid {
  const x0 = world.bounds.x0;
  const z0 = world.bounds.z0;
  const w = Math.ceil((world.bounds.x1 - x0) / CELL) + 1;
  const h = Math.ceil((world.bounds.z1 - z0) / CELL) + 1;
  const blocked = new Uint8Array(w * h);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const x = x0 + i * CELL;
      const z = z0 + j * CELL;
      const onBridge = Math.abs(x - world.bridge.x) < world.bridge.halfWidth;
      const inRiver = Math.abs(z - world.riverZ(x)) < world.riverHalf + CLEARANCE;
      const inPool = Math.hypot(x - world.pool.x, z - world.pool.z) < world.pool.r + CLEARANCE;
      const inHouse = world.footprints.some((f) => Math.hypot(f.x - x, f.z - z) < f.r + CLEARANCE);
      if ((inRiver && !onBridge) || inPool || inHouse) blocked[j * w + i] = 1;
    }
  }
  return { x0, z0, cell: CELL, w, h, blocked };
}

const index = (g: WalkGrid, x: number, z: number): number => {
  const i = Math.max(0, Math.min(g.w - 1, Math.round((x - g.x0) / g.cell)));
  const j = Math.max(0, Math.min(g.h - 1, Math.round((z - g.z0) / g.cell)));
  return j * g.w + i;
};
const point = (g: WalkGrid, k: number): Pt => [g.x0 + (k % g.w) * g.cell, g.z0 + Math.floor(k / g.w) * g.cell];

/** The open square nearest a point: a place inside a house, or in the river, is taken to mean its door. */
export function nearestOpen(g: WalkGrid, at: Pt): number {
  const start = index(g, at[0], at[1]);
  if (!g.blocked[start]) return start;
  const si = start % g.w;
  const sj = Math.floor(start / g.w);
  for (let r = 1; r < Math.max(g.w, g.h); r++) {
    let best = -1;
    let bestD = Infinity;
    for (let dj = -r; dj <= r; dj++) {
      for (let di = -r; di <= r; di++) {
        if (Math.max(Math.abs(di), Math.abs(dj)) !== r) continue;
        const i = si + di;
        const j = sj + dj;
        if (i < 0 || j < 0 || i >= g.w || j >= g.h || g.blocked[j * g.w + i]) continue;
        const d = di * di + dj * dj;
        if (d < bestD) {
          bestD = d;
          best = j * g.w + i;
        }
      }
    }
    if (best >= 0) return best;
  }
  return start;
}

const STEPS: ReadonlyArray<readonly [number, number, number]> = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, Math.SQRT2], [1, -1, Math.SQRT2], [-1, 1, Math.SQRT2], [-1, -1, Math.SQRT2]];

/** For every square, the next square on the shortest open way to the target; -1 where it cannot be reached. */
export function fieldTo(g: WalkGrid, target: Pt): Int32Array {
  const goal = nearestOpen(g, target);
  const next = new Int32Array(g.w * g.h).fill(-1);
  const cost = new Float32Array(g.w * g.h).fill(Infinity);
  // A binary heap of squares by distance travelled.
  const heap: number[] = [];
  const push = (k: number) => {
    heap.push(k);
    let c = heap.length - 1;
    while (c > 0) {
      const p = (c - 1) >> 1;
      if (cost[heap[p]!]! <= cost[heap[c]!]!) break;
      [heap[p], heap[c]] = [heap[c]!, heap[p]!];
      c = p;
    }
  };
  const pop = (): number => {
    const top = heap[0]!;
    const last = heap.pop()!;
    if (heap.length) {
      heap[0] = last;
      let p = 0;
      for (;;) {
        const l = p * 2 + 1;
        const r = l + 1;
        let m = p;
        if (l < heap.length && cost[heap[l]!]! < cost[heap[m]!]!) m = l;
        if (r < heap.length && cost[heap[r]!]! < cost[heap[m]!]!) m = r;
        if (m === p) break;
        [heap[p], heap[m]] = [heap[m]!, heap[p]!];
        p = m;
      }
    }
    return top;
  };
  cost[goal] = 0;
  next[goal] = goal;
  push(goal);
  while (heap.length) {
    const k = pop();
    const i = k % g.w;
    const j = Math.floor(k / g.w);
    for (const [di, dj, d] of STEPS) {
      const ni = i + di;
      const nj = j + dj;
      if (ni < 0 || nj < 0 || ni >= g.w || nj >= g.h) continue;
      const n = nj * g.w + ni;
      // No cutting a corner between two blocked squares.
      if (g.blocked[n] || (di && dj && (g.blocked[j * g.w + ni] || g.blocked[nj * g.w + i]))) continue;
      const c = cost[k]! + d;
      if (c < cost[n]!) {
        cost[n] = c;
        next[n] = k;
        push(n);
      }
    }
  }
  return next;
}

/** True if the straight line from a to b crosses no blocked square. */
export function clear(g: WalkGrid, a: Pt, b: Pt): boolean {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const n = Math.max(1, Math.ceil(l / (g.cell * 0.5)));
  for (let s = 0; s <= n; s++) {
    const t = s / n;
    if (g.blocked[index(g, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)]) return false;
  }
  return true;
}

/**
 * The way from a point to the field's target, as a few straight stretches: the squares of the field are followed, and
 * every corner that can be cut without touching anything blocked is cut. Null if the target cannot be reached.
 */
export function route(g: WalkGrid, field: Int32Array, from: Pt, to: Pt): Pt[] | null {
  let k = nearestOpen(g, from);
  if (field[k]! < 0) return null;
  const squares: Pt[] = [point(g, k)];
  for (let guard = 0; guard < g.w * g.h && field[k] !== k; guard++) {
    k = field[k]!;
    squares.push(point(g, k));
  }
  const start: Pt = g.blocked[index(g, from[0], from[1])] ? squares[0]! : from;
  const end: Pt = g.blocked[index(g, to[0], to[1])] ? squares[squares.length - 1]! : to;
  const all = [start, ...squares, end];
  const out: Pt[] = [all[0]!];
  let i = 0;
  while (i < all.length - 1) {
    let j = all.length - 1;
    while (j > i + 1 && !clear(g, all[i]!, all[j]!)) j--;
    out.push(all[j]!);
    i = j;
  }
  return out;
}

/** A route made ready to walk: its points and the distance along it to each. */
export interface Walk {
  pts: Pt[];
  at: number[];
  length: number;
}
export function walkOf(pts: Pt[]): Walk {
  const at = [0];
  for (let i = 1; i < pts.length; i++) at.push(at[i - 1]! + Math.hypot(pts[i]![0] - pts[i - 1]![0], pts[i]![1] - pts[i - 1]![1]));
  return { pts, at, length: at[at.length - 1]! || 1 };
}
/** Where a walker is, s metres along: its position and the direction it faces, as a yaw that turns local +Z that way. */
export function along(w: Walk, s: number, out: { x: number; z: number; yaw: number }): void {
  const d = Math.max(0, Math.min(w.length, s));
  let i = 1;
  while (i < w.at.length - 1 && w.at[i]! < d) i++;
  const a = w.pts[i - 1]!;
  const b = w.pts[i] ?? a;
  const seg = w.at[i]! - w.at[i - 1]! || 1;
  const t = (d - w.at[i - 1]!) / seg;
  out.x = a[0] + (b[0] - a[0]) * t;
  out.z = a[1] + (b[1] - a[1]) * t;
  out.yaw = Math.atan2(b[0] - a[0], b[1] - a[1]);
}

/**
 * A limb's matrix: the body's own instance matrix (at `base`, offset `bo`), then the limb moved to its joint and swung
 * about that joint's side-to-side axis by `swing` radians. The limb's shape is made with the joint at its origin.
 */
export function limbMatrix(out: Float32Array, o: number, base: Float32Array, bo: number, px: number, py: number, pz: number, swing: number): void {
  const ca = Math.cos(swing);
  const sa = Math.sin(swing);
  // Columns of the body's 3x3: X, Y, Z.
  const X0 = base[bo]!, X1 = base[bo + 1]!, X2 = base[bo + 2]!;
  const Y0 = base[bo + 4]!, Y1 = base[bo + 5]!, Y2 = base[bo + 6]!;
  const Z0 = base[bo + 8]!, Z1 = base[bo + 9]!, Z2 = base[bo + 10]!;
  out[o] = X0; out[o + 1] = X1; out[o + 2] = X2; out[o + 3] = 0;
  out[o + 4] = Y0 * ca + Z0 * sa; out[o + 5] = Y1 * ca + Z1 * sa; out[o + 6] = Y2 * ca + Z2 * sa; out[o + 7] = 0;
  out[o + 8] = -Y0 * sa + Z0 * ca; out[o + 9] = -Y1 * sa + Z1 * ca; out[o + 10] = -Y2 * sa + Z2 * ca; out[o + 11] = 0;
  out[o + 12] = base[bo + 12]! + X0 * px + Y0 * py + Z0 * pz;
  out[o + 13] = base[bo + 13]! + X1 * px + Y1 * py + Z1 * pz;
  out[o + 14] = base[bo + 14]! + X2 * px + Y2 * py + Z2 * pz;
  out[o + 15] = 1;
}
