// Where the rules' grid sits in the world, and how a point on the ground maps back to a plot or a canal link.
// Pure arithmetic, shared by the 3D board, the plan view and the tests.
//
// World conventions are the workspace's: metres, Y up, +X east, +Z south. The river runs along the south edge, so
// row 0 of the rules (the river bank) is the row nearest +Z and rows count northward. Geometry is never mirrored
// for right-to-left languages: only the panels around it change sides.
import { GRID_H, GRID_W, PLOTS, linkKey, plotOf, xyOf } from "../rules";

/** Side of one plot. A plot is a crossroads neighbourhood: four quarters around the meeting of two lanes. */
export const PLOT = 44;
export const HALF = PLOT / 2;
/** Half-width of a lane, and of the canal channel that can be dug along it. */
export const LANE_HALF = 2.5;
export const CHANNEL_HALF = 1.5;
/** The quay between row 0 and the river. */
export const QUAY = 11;
export const RIVER_WIDTH = 132;
export const BOARD = { x0: -(GRID_W * PLOT) / 2, x1: (GRID_W * PLOT) / 2, z0: -GRID_H * PLOT, z1: 0 } as const;
/** Heights: ground is 0. */
export const RIVER_LEVEL = -0.85;
export const CANAL_LEVEL = -0.7;
export const CANAL_BED = -1.35;

/** Centre of a plot on the ground: [x, z]. */
export function plotCentre(plot: number): [number, number] {
  const [x, y] = xyOf(plot);
  return [BOARD.x0 + (x + 0.5) * PLOT, -(y + 0.5) * PLOT];
}

/** The plot under a ground point, or null off the board. */
export function plotAt(wx: number, wz: number): number | null {
  const x = Math.floor((wx - BOARD.x0) / PLOT);
  const y = Math.floor(-wz / PLOT);
  if (x < 0 || x >= GRID_W || y < 0 || y >= GRID_H || wz > 0) return null;
  return plotOf(x, y);
}

/** Compass directions on the board: 0 north (away from the river), 1 east, 2 south (toward the river), 3 west. */
export type Dir = 0 | 1 | 2 | 3;
export const DIRS: readonly Dir[] = [0, 1, 2, 3];
/** Unit step of a direction in world space: [dx, dz]. */
export const DIR_STEP: ReadonlyArray<readonly [number, number]> = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

export function neighbour(plot: number, dir: Dir): number | null {
  const [x, y] = xyOf(plot);
  const nx = x + (dir === 1 ? 1 : dir === 3 ? -1 : 0);
  const ny = y + (dir === 0 ? 1 : dir === 2 ? -1 : 0);
  if (nx < 0 || nx >= GRID_W || ny < 0 || ny >= GRID_H) return null;
  return plotOf(nx, ny);
}

/** The direction from one plot to a neighbouring one, or null if they are not neighbours. */
export function dirTo(a: number, b: number): Dir | null {
  for (const d of DIRS) if (neighbour(a, d) === b) return d;
  return null;
}

export interface Link {
  a: number;
  b: number;
  key: number;
}

/** Every pair of neighbouring plots: the 82 places a canal link can be. */
export const ALL_LINKS: readonly Link[] = (() => {
  const out: Link[] = [];
  for (let p = 0; p < PLOTS; p++) {
    for (const d of [0, 1] as const) {
      const q = neighbour(p, d);
      if (q !== null) out.push({ a: Math.min(p, q), b: Math.max(p, q), key: linkKey(p, q) });
    }
  }
  return out;
})();

/** The canal directions leaving each plot, as a bit mask (bit d set = a link toward direction d). */
export function canalMasks(canals: readonly number[]): number[] {
  const masks = new Array<number>(PLOTS).fill(0);
  for (const k of canals) {
    const a = Math.floor(k / PLOTS);
    const b = k % PLOTS;
    const d = dirTo(a, b);
    if (d === null) continue;
    masks[a]! |= 1 << d;
    masks[b]! |= 1 << ((d + 2) % 4);
  }
  return masks;
}

/**
 * The link whose line (plot centre to plot centre) passes nearest a ground point, if any is within `reach` metres.
 * This is what the canal tool points at: the player aims at the lane between two crossroads.
 */
export function nearestLink(wx: number, wz: number, reach = HALF * 0.6): Link | null {
  let best: Link | null = null;
  let bestD = reach;
  for (const link of ALL_LINKS) {
    const [ax, az] = plotCentre(link.a);
    const [bx, bz] = plotCentre(link.b);
    const dx = bx - ax;
    const dz = bz - az;
    const t = Math.max(0, Math.min(1, ((wx - ax) * dx + (wz - az) * dz) / (dx * dx + dz * dz)));
    // Ends are shared by up to four links, so a point near a crossroads belongs to the link whose middle is nearest.
    const d = Math.hypot(wx - (ax + t * dx), wz - (az + t * dz)) + Math.abs(t - 0.5) * 6;
    if (d < bestD) {
      bestD = d;
      best = link;
    }
  }
  return best;
}

/** A1-style name for a plot (column letter from the west, row number from the river), for labels and screen readers. */
export function plotName(plot: number): string {
  const [x, y] = xyOf(plot);
  return `${String.fromCharCode(65 + x)}${y + 1}`;
}
