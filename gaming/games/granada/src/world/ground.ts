// What the valley's ground says to a builder: whether something of a given size may stand at a point, and why not.
// It reads the same geometry the valley is drawn from (the river, the pool and channels, the fields, the roads, the
// land's own height, the buildings and trees already there), so what the rules refuse is what the player can see.
import { BOUNDS, CHANNELS, CHANNEL_HALF, FIELDS, HILL, POOL, RIVER_HALF, ROADS, buildScenery, fieldAt, heightAt, pathDistance, riverZ } from "../view/valley";
import type { SiteRefusal } from "../sim/village";

/** The land is the same in every game: the valley is drawn from this seed whatever the year's weather. */
export const LAND_SEED = 7;
/** How much the ground may rise or fall across a building, in metres. */
const MAX_FALL = 1.4;
const CELL = 32;

interface Standing {
  buildings: Map<string, Array<{ x: number; z: number; r: number }>>;
  trees: Map<string, Array<[number, number]>>;
}
let standing: Standing | null = null;
const key = (x: number, z: number) => `${Math.floor(x / CELL)},${Math.floor(z / CELL)}`;
/** What already stands in the valley, found once: it is the same list the valley is drawn from. */
function whatStands(): Standing {
  if (standing) return standing;
  const s = buildScenery(LAND_SEED);
  const buildings: Standing["buildings"] = new Map();
  const trees: Standing["trees"] = new Map();
  const put = <T>(m: Map<string, T[]>, x: number, z: number, v: T) => {
    const k = key(x, z);
    const list = m.get(k);
    if (list) list.push(v);
    else m.set(k, [v]);
  };
  for (const f of s.footprints) put(buildings, f.x, f.z, f);
  for (const st of s.stalls) put(buildings, st[0]!, st[2]!, { x: st[0]!, z: st[2]!, r: 4 });
  for (const list of [s.trees, s.citrus, s.almonds, s.gardens, s.poplars, s.cypresses, s.palms, s.olives]) for (const tr of list) put(trees, tr[0]!, tr[2]!, [tr[0]!, tr[2]!]);
  standing = { buildings, trees };
  return standing;
}
function* near<T>(m: Map<string, T[]>, x: number, z: number, reach: number): Generator<T> {
  for (let cx = Math.floor((x - reach) / CELL); cx <= Math.floor((x + reach) / CELL); cx++) for (let cz = Math.floor((z - reach) / CELL); cz <= Math.floor((z + reach) / CELL); cz++) yield* m.get(`${cx},${cz}`) ?? [];
}
/** How far a point is from the nearest edge of a field, in metres. */
const fieldEdge = (x: number, z: number): number => Math.min(...Object.values(FIELDS).map((shape) => pathDistance(x, z, [...shape, shape[0]!])));

/**
 * May a building that needs a circle of `radius` metres stand at (x, z)? Null if it may; otherwise the first
 * reason, in the order a builder would notice them.
 */
export function siteRefusal(x: number, z: number, radius: number): SiteRefusal | null {
  if (x - radius < BOUNDS.x0 || x + radius > BOUNDS.x1 || z - radius < BOUNDS.z0 || z + radius > BOUNDS.z1) return "site-outside";
  if (Math.hypot(x - HILL.x, z - HILL.z) < HILL.r) return "site-outside";
  if (Math.abs(z - riverZ(x)) < RIVER_HALF + radius + 3) return "site-water";
  if (Math.hypot(x - POOL.x, z - POOL.z) < POOL.r + radius + 4) return "site-water";
  for (const path of Object.values(CHANNELS)) if (pathDistance(x, z, path) < CHANNEL_HALF + radius + 2) return "site-water";
  if (fieldAt(x, z) !== null || fieldEdge(x, z) < radius + 1) return "site-field";
  for (const path of ROADS) if (pathDistance(x, z, path) < radius + 4) return "site-road";
  const here = heightAt(x, z, LAND_SEED);
  let low = here;
  let high = here;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const h = heightAt(x + Math.cos(a) * radius, z + Math.sin(a) * radius, LAND_SEED);
    low = Math.min(low, h);
    high = Math.max(high, h);
  }
  if (high - low > MAX_FALL) return "site-steep";
  const s = whatStands();
  for (const b of near(s.buildings, x, z, radius + 24)) if (Math.hypot(b.x - x, b.z - z) < b.r + radius) return "site-taken";
  for (const [tx, tz] of near(s.trees, x, z, radius)) if (Math.hypot(tx - x, tz - z) < radius - 1) return "site-trees";
  return null;
}
