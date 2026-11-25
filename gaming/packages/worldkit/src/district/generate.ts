// Assembles the reference district: one seed in, one engine-neutral scene out. The same seed always gives the same
// scene (same vertices, same instance order), which is what lets two renderers be compared on identical content
// and lets a benchmark be repeated.
import { Rng, fbm } from "@im/kernel/prng";
import { BOX_NO_BOTTOM, BOX_SIDES, MeshBuilder, frame, instanceMatrix, subFrame, toWorld, type Frame, type MeshData, type Rgb, type Vec3 } from "../mesh";
import type { TextureKind } from "../textures";
import {
  CLOTH_TINTS,
  COBALT,
  MeshSet,
  ROBE_TINTS,
  TURQUOISE,
  arcade,
  archPanel,
  awningMesh,
  boatMesh,
  cypressMesh,
  house,
  jarMesh,
  lampPostMesh,
  lanternMesh,
  palmMesh,
  personBodyMesh,
  personHeadMesh,
  pointedDome,
  stallMesh,
  treeMesh,
  wheelMesh,
  type MaterialId,
} from "./kit";
import {
  CANAL_COURSE,
  CANAL_HALF_WIDTH,
  CITY_CENTER,
  HALF_EXTENT,
  WATER_LEVEL,
  bankSide,
  canalDistance,
  groundHeight,
  insideCity,
  planToWorld,
  planYaw,
  riverDistance,
  riverHalfWidth,
  riverZ,
  wallRadius,
} from "./site";

export type SceneMaterialId = MaterialId | "terrain" | "water" | "lantern" | "prop" | "foliage";

export interface MaterialSpec {
  id: SceneMaterialId;
  texture: TextureKind | null;
  /** Linear base-colour multiplier. */
  color: Rgb;
  roughness: number;
  metalness: number;
  /** Linear emissive colour at full night strength; the renderer scales it with the time of day. */
  emissive?: Rgb;
  doubleSided?: boolean;
}

export const MATERIALS: MaterialSpec[] = [
  { id: "plaster", texture: "plaster", color: [1, 1, 1], roughness: 0.92, metalness: 0 },
  { id: "brick", texture: "brick", color: [1, 0.97, 0.9], roughness: 0.9, metalness: 0 },
  { id: "ashlar", texture: "ashlar", color: [1, 0.98, 0.92], roughness: 0.85, metalness: 0 },
  { id: "roof", texture: "roof", color: [1, 1, 1], roughness: 1, metalness: 0 },
  { id: "glaze", texture: "glaze", color: [1, 1, 1], roughness: 0.3, metalness: 0 },
  { id: "startile", texture: "startile", color: [1, 1, 1], roughness: 0.28, metalness: 0 },
  { id: "wood", texture: "wood", color: [1, 1, 1], roughness: 0.75, metalness: 0 },
  { id: "lattice", texture: "lattice", color: [1, 1, 1], roughness: 0.75, metalness: 0 },
  { id: "litwindow", texture: "lattice", color: [1, 1, 1], roughness: 0.75, metalness: 0, emissive: [1, 0.55, 0.18] },
  { id: "fabric", texture: "fabric", color: [1, 1, 1], roughness: 0.95, metalness: 0 },
  { id: "paving", texture: "paving", color: [1, 1, 1], roughness: 0.8, metalness: 0 },
  { id: "earth", texture: "earth", color: [1, 1, 1], roughness: 1, metalness: 0 },
  { id: "field", texture: "field", color: [1, 1, 1], roughness: 1, metalness: 0 },
  { id: "grass", texture: "grass", color: [1, 1, 1], roughness: 1, metalness: 0 },
  { id: "canalwater", texture: "water", color: [0.02, 0.2, 0.2], roughness: 0.1, metalness: 0 },
  { id: "terrain", texture: "earth", color: [1, 1, 1], roughness: 1, metalness: 0 },
  { id: "water", texture: "water", color: [0.012, 0.13, 0.15], roughness: 0.1, metalness: 0 },
  { id: "lantern", texture: null, color: [0.9, 0.7, 0.4], roughness: 0.6, metalness: 0, emissive: [1, 0.62, 0.22] },
  { id: "prop", texture: null, color: [1, 1, 1], roughness: 0.85, metalness: 0 },
  { id: "foliage", texture: null, color: [1, 1, 1], roughness: 0.9, metalness: 0, doubleSided: false },
];

export interface StaticChunk {
  material: SceneMaterialId;
  cell: [number, number];
  mesh: MeshData;
}

export interface InstanceBatch {
  id: string;
  material: SceneMaterialId;
  mesh: MeshData;
  count: number;
  /** 16 floats per instance, column-major. */
  matrices: Float32Array;
  /** 3 floats per instance, linear RGB. */
  colors: Float32Array;
  castShadow: boolean;
  /** Matrices are rewritten every frame by updateDynamics. */
  dynamic: boolean;
}

interface WalkPath {
  /** x,z pairs. */
  points: Float32Array;
  /** Cumulative length at each point. */
  cum: Float32Array;
  total: number;
}
interface Walker {
  path: number;
  start: number;
  speed: number;
  lateral: number;
  scale: number;
  bobPhase: number;
}
interface Sailor {
  x0: number;
  lane: number;
  speed: number;
  phase: number;
}

export interface DistrictScene {
  seed: number;
  halfExtent: number;
  cellSize: number;
  waterLevel: number;
  materials: MaterialSpec[];
  chunks: StaticChunk[];
  instances: InstanceBatch[];
  /** The noria: a single mesh that turns about its own Z axis. */
  wheel: { mesh: MeshData; position: Vec3; yaw: number; radius: number; radPerSecond: number };
  /** Lamp head positions (x, y, z triples) for night lighting. */
  lamps: Float32Array;
  landmarks: Record<string, Vec3>;
  stats: { buildings: number; triangles: number; vertices: number; instances: number; walkers: number; chunks: number; drawBatches: number };
  /** Internal state for updateDynamics. */
  dynamics: { paths: WalkPath[]; walkers: Walker[]; sailors: Sailor[] };
}

export interface DistrictOptions {
  /** Fraction of windows that glow at night. */
  litWindows?: number;
  walkers?: number;
  cellSize?: number;
}

class Instances {
  private readonly m: number[] = [];
  private readonly c: number[] = [];
  count = 0;
  add(x: number, y: number, z: number, yaw: number, sx: number, sy: number, sz: number, color: Rgb = [1, 1, 1]): void {
    const o = this.m.length;
    this.m.length = o + 16;
    instanceMatrix(this.m, o, x, y, z, yaw, sx, sy, sz);
    this.c.push(color[0], color[1], color[2]);
    this.count++;
  }
  batch(id: string, material: SceneMaterialId, mesh: MeshData, castShadow = true, dynamic = false): InstanceBatch {
    return { id, material, mesh, count: this.count, matrices: Float32Array.from(this.m), colors: Float32Array.from(this.c), castShadow, dynamic };
  }
}

const scale = (c: Rgb, k: number): Rgb => [c[0] * k, c[1] * k, c[2] * k];
const inRect = (a: number, b: number, r: Rect, pad = 0) => a > r.a0 - pad && a < r.a1 + pad && b > r.b0 - pad && b < r.b1 + pad;

interface Rect {
  a0: number;
  a1: number;
  b0: number;
  b1: number;
}
// Reserved ground, in plan space. "Solid" rectangles are buildings that streets must not run through.
const LIBRARY: Rect = { a0: -40, a1: 40, b0: -176, b1: -98 };
const PLAZA: Rect = { a0: -46, a1: 46, b0: -98, b1: -62 };
const MARKET: Rect = { a0: -44, a1: 44, b0: 52, b1: 118 };
const KHAN: Rect = { a0: 70, a1: 120, b0: 58, b1: 108 };
const HAMMAM: Rect = { a0: -122, a1: -88, b0: -40, b1: -14 };
const GARDEN: Rect = { a0: 96, a1: 176, b0: -150, b1: -84 };
const RESERVED = [LIBRARY, PLAZA, MARKET, KHAN, HAMMAM, GARDEN];
const SOLID = [LIBRARY, KHAN, HAMMAM];

export function generateDistrict(seed: number, options: DistrictOptions = {}): DistrictScene {
  const lit = options.litWindows ?? 0.3;
  const cellSize = options.cellSize ?? 160;
  const root = new Rng(seed);
  const set = new MeshSet(cellSize);
  const landmarks: Record<string, Vec3> = {};
  const lampList: number[] = [];

  const palmsA = new Instances();
  const palmsB = new Instances();
  const trees = new Instances();
  const cypresses = new Instances();
  const awnings = new Instances();
  const stalls = new Instances();
  const jars = new Instances();
  const posts = new Instances();
  const lanterns = new Instances();
  const mooredBoats = new Instances();

  const gy = (x: number, z: number) => groundHeight(x, z);
  const planFrame = (a: number, b: number, extraYaw = 0, lift = 0): Frame => {
    const [x, z] = planToWorld(a, b);
    return frame(x, gy(x, z) + lift, z, planYaw(a, b) + extraYaw);
  };
  const lamp = (x: number, z: number, yaw: number) => {
    const y = gy(x, z);
    posts.add(x, y, z, yaw, 1, 1, 1);
    lanterns.add(x, y, z, yaw, 1, 1, 1);
    lampList.push(x + Math.cos(yaw) * 0.55, y + 2.75, z - Math.sin(yaw) * 0.55);
  };
  let palmFlip = 0;
  const palm = (x: number, z: number, r: Rng, s = 1) => {
    const k = s * r.range(0.8, 1.25);
    (palmFlip++ % 2 ? palmsA : palmsB).add(x, gy(x, z) - 0.1, z, r.range(0, Math.PI * 2), k, k * r.range(0.9, 1.15), k, scale([1, 1, 1], r.range(0.85, 1.1)));
  };
  const tree = (x: number, z: number, r: Rng, s = 1) => {
    const k = s * r.range(0.7, 1.2);
    trees.add(x, gy(x, z) - 0.05, z, r.range(0, Math.PI * 2), k, k * r.range(0.85, 1.1), k, [r.range(0.8, 1.1), r.range(0.85, 1.1), r.range(0.7, 1)]);
  };
  const cypress = (x: number, z: number, r: Rng, s = 1) => {
    const k = s * r.range(0.75, 1.15);
    cypresses.add(x, gy(x, z) - 0.05, z, r.range(0, Math.PI * 2), k, k, k, scale([1, 1, 1], r.range(0.85, 1.1)));
  };

  // ---- Terrain: an indexed grid with smooth normals ---------------------------------------------------------------
  const terrain = new MeshBuilder();
  {
    const step = 8;
    const n = Math.round((HALF_EXTENT * 2) / step);
    const noiseSeed = root.fork("terrain").u32() & 0xffff;
    for (let j = 0; j <= n; j++) {
      for (let i = 0; i <= n; i++) {
        const x = -HALF_EXTENT + i * step;
        const z = -HALF_EXTENT + j * step;
        const h = gy(x, z);
        const e = 2;
        const nx = gy(x - e, z) - gy(x + e, z);
        const nz = gy(x, z - e) - gy(x, z + e);
        const nl = Math.hypot(nx, 2 * e, nz);
        const inside = insideCity(x, z);
        const rd = riverDistance(x, z);
        const patch = fbm(x * 0.012, z * 0.012, noiseSeed, 4);
        let c: Rgb;
        if (h < WATER_LEVEL - 0.2) c = [0.16, 0.2, 0.15];
        else if (rd < 10) c = [0.62, 0.56, 0.42]; // wet sand and silt
        else if (inside > 0) c = scale([0.6, 0.47, 0.32], 0.88 + 0.24 * patch);
        else c = [0.4 + 0.2 * patch, 0.42 + 0.08 * patch, 0.2 + 0.06 * patch]; // dry grass and bare earth
        terrain.vertex([x, h, z], [nx / nl, (2 * e) / nl, nz / nl], x, z, c);
      }
    }
    const row = n + 1;
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const a = j * row + i;
        terrain.tri(a, a + row, a + row + 1);
        terrain.tri(a, a + row + 1, a + 1);
      }
    }
    // The country beyond: a coarse apron out to the haze, tucked just under the edge of the detailed ground.
    const far = 3400;
    const cell = 85;
    const m = Math.round((far * 2) / cell);
    const base = terrain.vertexCount;
    for (let j = 0; j <= m; j++) {
      for (let i = 0; i <= m; i++) {
        const x = -far + i * cell;
        const z = -far + j * cell;
        const h = Math.min(gy(x, z), 7) - 0.7;
        const patch = fbm(x * 0.004, z * 0.004, noiseSeed, 3);
        const wet = riverDistance(x, z) < 0;
        terrain.vertex([x, wet ? -3 : h, z], [0, 1, 0], x, z, wet ? [0.16, 0.2, 0.15] : [0.42 + 0.18 * patch, 0.41 + 0.08 * patch, 0.2 + 0.05 * patch]);
      }
    }
    const inner = HALF_EXTENT - cell;
    for (let j = 0; j < m; j++) {
      for (let i = 0; i < m; i++) {
        const x0 = -far + i * cell;
        const z0 = -far + j * cell;
        if (x0 > -inner - 1 && x0 + cell < inner + 1 && z0 > -inner - 1 && z0 + cell < inner + 1) continue;
        const a = base + j * (m + 1) + i;
        terrain.tri(a, a + m + 1, a + m + 2);
        terrain.tri(a, a + m + 2, a + 1);
      }
    }
  }

  // ---- Street grid ---------------------------------------------------------------------------------------------------
  const gridRng = root.fork("grid");
  interface Street {
    at: number;
    width: number;
    major: boolean;
  }
  const lines = (from: number, to: number, minBlock: number, maxBlock: number, majorNear: number): Street[] => {
    const out: Street[] = [];
    let p = from;
    while (p < to) {
      out.push({ at: p, width: gridRng.range(3.4, 5.2), major: false });
      p += gridRng.range(minBlock, maxBlock);
    }
    let best = 0;
    for (let i = 1; i < out.length; i++) if (Math.abs(out[i]!.at - majorNear) < Math.abs(out[best]!.at - majorNear)) best = i;
    out[best]!.at = majorNear;
    out[best]!.width = 13;
    out[best]!.major = true;
    return out;
  };
  const aStreets = lines(-372, 372, 38, 54, 0);
  const bStreets = lines(-330, 250, 28, 42, 28);
  const avenueA = aStreets.find((s) => s.major)!;
  const avenueB = bStreets.find((s) => s.major)!;

  // ---- Houses ----------------------------------------------------------------------------------------------------------
  const houseRng = root.fork("houses");
  let buildings = 0;
  for (let i = 0; i < aStreets.length - 1; i++) {
    for (let j = 0; j < bStreets.length - 1; j++) {
      const sa0 = aStreets[i]!;
      const sa1 = aStreets[i + 1]!;
      const sb0 = bStreets[j]!;
      const sb1 = bStreets[j + 1]!;
      const a0 = sa0.at + sa0.width / 2;
      const a1 = sa1.at - sa1.width / 2;
      const b0 = sb0.at + sb0.width / 2;
      const b1 = sb1.at - sb1.width / 2;
      const depth = b1 - b0;
      const rows = depth > 21 ? 2 : 1;
      const cols = Math.max(1, Math.round((a1 - a0) / houseRng.range(10.5, 15.5)));
      const lotW = (a1 - a0) / cols;
      const lotD = depth / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const rng = houseRng.fork(`${i}:${j}:${r}:${c}`);
          const ca = a0 + lotW * (c + 0.5);
          const cb = b0 + lotD * (r + 0.5);
          if (RESERVED.some((q) => inRect(ca, cb, q, Math.max(lotW, lotD) * 0.5 + 1))) continue;
          const [x, z] = planToWorld(ca, cb);
          const reach = Math.hypot(lotW, lotD) * 0.5;
          if (insideCity(x, z) < reach + 5) continue;
          if (canalDistance(x, z) < reach + 1.5) continue;
          if (rng.chance(0.035)) {
            // An empty lot: a small garden.
            for (let k = 0; k < 3; k++) (rng.chance(0.5) ? palm : tree)(x + rng.range(-4, 4), z + rng.range(-4, 4), rng);
            continue;
          }
          const w = lotW - rng.range(0.2, 1.2);
          const d = lotD - rng.range(0.1, rows === 2 ? 0.9 : 1.8);
          const facesNorth = rows === 2 ? r === 0 : rng.chance(0.5);
          const f = planFrame(ca, cb, facesNorth ? Math.PI : 0);
          const res = house(set, f, w, d, rng, lit);
          buildings++;
          if (res.court && rng.chance(0.6)) (rng.chance(0.35) ? palm : tree)(res.court[0], res.court[1], rng, 0.8);
          // Shop fronts on the avenues: awnings on the side that meets the avenue.
          const onAvenueA = sa0 === avenueA && c === 0 ? -1 : sa1 === avenueA && c === cols - 1 ? 1 : 0;
          if (onAvenueA !== 0) {
            const n = Math.max(1, Math.floor(d / 4.2));
            for (let k = 0; k < n; k++) {
              const bb = cb - d / 2 + (d * (k + 0.5)) / n;
              const [ax, az] = planToWorld(ca + onAvenueA * (w / 2), bb);
              awnings.add(ax, gy(ax, az), az, planYaw(ca, bb) + (onAvenueA > 0 ? Math.PI / 2 : -Math.PI / 2), 1, 1, 1, rng.pick(CLOTH_TINTS));
            }
          }
          const onAvenueB = sb0 === avenueB && r === 0 ? -1 : sb1 === avenueB && r === rows - 1 ? 1 : 0;
          if (onAvenueB !== 0) {
            const n = Math.max(1, Math.floor(w / 4.2));
            for (let k = 0; k < n; k++) {
              const aa = ca - w / 2 + (w * (k + 0.5)) / n;
              const [ax, az] = planToWorld(aa, cb + onAvenueB * (d / 2));
              awnings.add(ax, gy(ax, az), az, planYaw(aa, cb) + (onAvenueB > 0 ? 0 : Math.PI), 1, 1, 1, rng.pick(CLOTH_TINTS));
            }
          }
        }
      }
    }
  }

  // A scatter of farmsteads and a suburb on the far bank.
  const outRng = root.fork("outskirts");
  for (let k = 0; k < 150; k++) {
    const x = outRng.range(-560, 560);
    const z = outRng.range(-560, 560);
    const south = bankSide(x, z) > 0;
    if (riverDistance(x, z) < 24 || canalDistance(x, z) < 14) continue;
    if (!south && insideCity(x, z) > -34) continue;
    if (south && outRng.chance(0.35)) continue;
    if (!south && outRng.chance(0.72)) continue;
    const f = frame(x, gy(x, z), z, outRng.range(0, Math.PI * 2));
    house(set, f, outRng.range(9, 15), outRng.range(9, 14), outRng, lit * 0.6);
    buildings++;
    for (let p = 0; p < 3; p++) palm(x + outRng.range(-12, 12), z + outRng.range(-12, 12), outRng);
  }

  // ---- The library: the landmark at the head of the avenue ---------------------------------------------------------
  {
    const rng = root.fork("library");
    // The courtyard block fills the south of the reserved ground; the great hall projects north of it.
    const W = LIBRARY.a1 - LIBRARY.a0 - 4;
    const D = 58;
    const ca = (LIBRARY.a0 + LIBRARY.a1) / 2;
    const cb = LIBRARY.b1 - 2 - D / 2;
    const f = planFrame(ca, cb, 0, 0.3);
    const stone: Rgb = [0.78, 0.66, 0.46];
    const dark: Rgb = [0.1, 0.085, 0.07];
    const t = 7.5;
    const H = 9;
    const ash = set.of("ashlar", f);
    const roof = set.of("roof", f);
    const plinth = set.of("paving", f);
    plinth.box(f, 0, -1.5, 0, W + 6, 1.5, D + 6, [0.85, 0.8, 0.7], BOX_NO_BOTTOM);
    const wingBox = (cx: number, cz: number, w: number, d: number, h: number) => {
      ash.box(f, cx, -0.5, cz, w, h + 1.5, d, stone, BOX_SIDES, 0.86);
      roof.quad(toWorld(f, cx - w / 2 + 0.4, h, cz + d / 2 - 0.4), toWorld(f, cx + w / 2 - 0.4, h, cz + d / 2 - 0.4), toWorld(f, cx + w / 2 - 0.4, h, cz - d / 2 + 0.4), toWorld(f, cx - w / 2 + 0.4, h, cz - d / 2 + 0.4), [0.84, 0.78, 0.66]);
      // Parapet rim, as four thin top strips.
      const y = h + 1;
      const rim = scale(stone, 1.05);
      for (const [x0, z0, x1, z1] of [
        [-w / 2, d / 2 - 0.4, w / 2, d / 2],
        [-w / 2, -d / 2, w / 2, -d / 2 + 0.4],
        [-w / 2, -d / 2, -w / 2 + 0.4, d / 2],
        [w / 2 - 0.4, -d / 2, w / 2, d / 2],
      ] as const) {
        ash.quad(toWorld(f, cx + x0, y, cz + z1), toWorld(f, cx + x1, y, cz + z1), toWorld(f, cx + x1, y, cz + z0), toWorld(f, cx + x0, y, cz + z0), rim);
        ash.quad(toWorld(f, cx + x1, h, cz + z0), toWorld(f, cx + x0, h, cz + z0), toWorld(f, cx + x0, y, cz + z0), toWorld(f, cx + x1, y, cz + z0), scale(stone, 0.8));
        ash.quad(toWorld(f, cx + x0, h, cz + z1), toWorld(f, cx + x1, h, cz + z1), toWorld(f, cx + x1, y, cz + z1), toWorld(f, cx + x0, y, cz + z1), scale(stone, 0.8));
      }
    };
    wingBox(0, D / 2 - t / 2, W, t, H); // south range (entrance side)
    wingBox(0, -D / 2 + t / 2, W, t, H); // north range
    wingBox(-W / 2 + t / 2, 0, t, D - 2 * t, H);
    wingBox(W / 2 - t / 2, 0, t, D - 2 * t, H);
    // Court: paving, arcades on all four sides in front of a shadowed wall, a long pool, trees.
    const cw = W - 2 * t;
    const cd = D - 2 * t;
    set.of("paving", f).quad(toWorld(f, -cw / 2, 0.05, cd / 2), toWorld(f, cw / 2, 0.05, cd / 2), toWorld(f, cw / 2, 0.05, -cd / 2), toWorld(f, -cw / 2, 0.05, -cd / 2), [0.92, 0.88, 0.78]);
    const sides: Array<[number, number, number, number]> = [
      [0, -cd / 2, 0, cw], // north side of the court, arcade faces south (+Z)
      [0, cd / 2, Math.PI, cw],
      [-cw / 2, 0, -Math.PI / 2, cd],
      [cw / 2, 0, Math.PI / 2, cd],
    ];
    for (const [sx, sz, yaw, len] of sides) {
      // Frame whose +Z looks into the court.
      const inward = subFrame(f, sx, 0, sz, yaw === 0 ? 0 : yaw === Math.PI ? Math.PI : yaw === Math.PI / 2 ? -Math.PI / 2 : Math.PI / 2);
      set.of("ashlar", f).quad(toWorld(inward, -len / 2, 0, 0.05), toWorld(inward, len / 2, 0, 0.05), toWorld(inward, len / 2, 5.2, 0.05), toWorld(inward, -len / 2, 5.2, 0.05), dark);
      const af = subFrame(inward, 0, 0, 2.2);
      arcade(set.of("ashlar", f), af, -len / 2, 0, len, 5.6, 4.4, 2.2, stone, scale(stone, 0.6));
      // Gallery roof over the arcade.
      roof.quad(toWorld(af, -len / 2, 5.6, 0), toWorld(af, len / 2, 5.6, 0), toWorld(af, len / 2, 5.6, -2.2), toWorld(af, -len / 2, 5.6, -2.2), [0.8, 0.74, 0.62]);
      // Upper windows.
      const n = Math.floor(len / 4.4);
      for (let k = 0; k < n; k++) {
        const x = -len / 2 + (len * (k + 0.5)) / n;
        set.of(rng.chance(0.5) ? "litwindow" : "lattice", f).box(inward, x, 6.4, 0.06, 1.3, 1.8, 0.12, [0.75, 0.62, 0.48], 1 | 2 | 8 | 16);
      }
    }
    // Great hall across the north range, with a tall tiled portal standing forward into the court.
    const portalDepth = 1.95;
    const portalZ = -cd / 2 + 4.2;
    const hallNorth = -D / 2 - 12;
    const hallSouth = portalZ - portalDepth - 0.05;
    const hallZ = (hallNorth + hallSouth) / 2;
    ash.box(f, 0, 0, hallZ, 27, 13.5, hallSouth - hallNorth, scale(stone, 1.02), BOX_NO_BOTTOM, 0.9);
    const portal = subFrame(f, 0, 0, portalZ);
    archPanel(set.of("startile", f), portal, -9, 0, 18, 17, 10.5, 6.2, portalDepth, [1, 1, 1], [0.55, 0.5, 0.45], 16);
    ash.quad(toWorld(portal, -5.4, 0, -portalDepth + 0.04), toWorld(portal, 5.4, 0, -portalDepth + 0.04), toWorld(portal, 5.4, 13.2, -portalDepth + 0.04), toWorld(portal, -5.4, 13.2, -portalDepth + 0.04), dark);
    set.of("wood", f).box(portal, 0, 0, -portalDepth + 0.15, 3.2, 5.2, 0.2, [0.45, 0.34, 0.24], 1 | 2 | 8 | 16);
    // Portal cheeks, lintel slab, and the back of the screen where it rises above the hall roof.
    ash.box(portal, -9.6, 0, -portalDepth / 2, 1.2, 17.6, portalDepth + 0.1, stone, BOX_NO_BOTTOM);
    ash.box(portal, 9.6, 0, -portalDepth / 2, 1.2, 17.6, portalDepth + 0.1, stone, BOX_NO_BOTTOM);
    ash.box(portal, 0, 17, -portalDepth / 2, 20.4, 0.6, portalDepth + 0.1, stone, 63);
    ash.quad(toWorld(portal, 9, 13.4, -portalDepth), toWorld(portal, -9, 13.4, -portalDepth), toWorld(portal, -9, 17, -portalDepth), toWorld(portal, 9, 17, -portalDepth), scale(stone, 0.9));
    // Drum and dome.
    const drumY = 13.5;
    set.of("startile", f).cylinder(f, 0, drumY, hallZ, 8.8, 8.8, 4.6, 24, [1, 1, 1], false);
    ash.cylinder(f, 0, drumY + 4.6, hallZ, 9.1, 9.1, 0.5, 24, scale(stone, 1.05), true);
    set.of("glaze", f).revolve(f, 0, drumY + 5.1, hallZ, pointedDome(8.6, 1.14), 32, 14, scale(TURQUOISE, 0.92), scale(TURQUOISE, 1.12));
    set.of("glaze", f).revolve(f, 0, drumY + 5.1 + 8.6 * 1.14 - 0.3, hallZ, (q) => [0.42 * Math.sin(Math.PI * (0.1 + 0.9 * q)) + 0.06, 2.6 * q], 8, 6, [0.95, 0.72, 0.2]);
    landmarks.libraryDome = toWorld(f, 0, drumY + 10, hallZ);
    landmarks.libraryCourt = toWorld(f, 0, 2, 0);
    // Side domes over the east and west ranges.
    for (const sx of [-1, 1]) {
      const x = sx * (W / 2 - t / 2);
      ash.cylinder(f, x, H, 0, 4.4, 4.4, 2.2, 16, stone, false);
      set.of("glaze", f).revolve(f, x, H + 2.2, 0, pointedDome(4.3, 1.1), 20, 9, scale(COBALT, 1.1), scale(TURQUOISE, 1.0));
    }
    // Corner buttress towers with small caps.
    for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as const) {
      const x = (sx * W) / 2;
      const z = (sz * D) / 2;
      ash.cylinder(f, x, -0.5, z, 2.5, 2.2, 12.5, 14, stone, false);
      set.of("glaze", f).revolve(f, x, 12, z, pointedDome(2.3, 1.2), 14, 7, scale(TURQUOISE, 1.0));
    }
    // South gate, standing forward of the entrance range.
    const gateDepth = 2.9;
    const gate = subFrame(f, 0, 0, D / 2 + gateDepth + 0.05);
    archPanel(set.of("startile", f), gate, -7, 0, 14, 13, 6.4, 5, gateDepth, [1, 1, 1], [0.5, 0.46, 0.4], 14);
    ash.quad(toWorld(gate, -3.3, 0, -gateDepth + 0.04), toWorld(gate, 3.3, 0, -gateDepth + 0.04), toWorld(gate, 3.3, 9.6, -gateDepth + 0.04), toWorld(gate, -3.3, 9.6, -gateDepth + 0.04), dark);
    ash.box(gate, -7.5, 0, -gateDepth / 2, 1, 13.4, gateDepth + 0.1, stone, BOX_NO_BOTTOM);
    ash.box(gate, 7.5, 0, -gateDepth / 2, 1, 13.4, gateDepth + 0.1, stone, BOX_NO_BOTTOM);
    ash.box(gate, 0, 13, -gateDepth / 2, 16, 0.5, gateDepth + 0.1, stone, 63);
    ash.quad(toWorld(gate, 7, 10, -gateDepth), toWorld(gate, -7, 10, -gateDepth), toWorld(gate, -7, 13, -gateDepth), toWorld(gate, 7, 13, -gateDepth), scale(stone, 0.9));
    // Pool and planting.
    const poolF = subFrame(f, 0, 0, 4);
    set.of("canalwater", f).quad(toWorld(poolF, -11, 0.32, 3.2), toWorld(poolF, 11, 0.32, 3.2), toWorld(poolF, 11, 0.32, -3.2), toWorld(poolF, -11, 0.32, -3.2), [1, 1, 1]);
    for (const [x, z, w, d] of [[0, 3.5, 23, 0.6], [0, -3.5, 23, 0.6], [-11.3, 0, 0.6, 6.4], [11.3, 0, 0.6, 6.4]] as const) ash.box(poolF, x, 0, z, w, 0.5, d, scale(stone, 1.05), BOX_NO_BOTTOM);
    for (const sx of [-1, 1]) {
      for (let k = 0; k < 4; k++) {
        const p = toWorld(f, sx * (cw / 2 - 5), 0, -cd / 2 + 6 + (k * (cd - 12)) / 3);
        (k % 2 ? cypress : tree)(p[0], p[2], rng, 0.75);
      }
    }
    for (const [x, z] of [[-14, cd / 2 - 3], [14, cd / 2 - 3], [-14, -cd / 2 + 6], [14, -cd / 2 + 6]] as const) {
      const p = toWorld(f, x, 0, z);
      lamp(p[0], p[2], f.cos > 0 ? 0 : Math.PI);
    }
    buildings++;
  }

  // ---- Plaza in front of the library, market square, garden -----------------------------------------------------------
  const paveRect = (r: Rect, tint: Rgb, step = 12) => {
    for (let a = r.a0; a < r.a1 - 0.01; a += step) {
      for (let b = r.b0; b < r.b1 - 0.01; b += step) {
        const a1 = Math.min(r.a1, a + step);
        const b1 = Math.min(r.b1, b + step);
        const P = (aa: number, bb: number): Vec3 => {
          const [x, z] = planToWorld(aa, bb);
          return [x, gy(x, z) + 0.1, z];
        };
        const p = P(a, b);
        set.at("paving", p[0], p[2]).quad(P(a, b1), P(a1, b1), P(a1, b), P(a, b), tint, a, b);
      }
    }
  };
  paveRect(PLAZA, [0.9, 0.85, 0.74]);
  paveRect(MARKET, [0.84, 0.78, 0.66]);
  {
    const rng = root.fork("market");
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 7; c++) {
        if (c === 3) continue; // the central aisle
        const a = MARKET.a0 + 7 + c * 12.4 + rng.range(-0.6, 0.6);
        const b = MARKET.b0 + 8 + r * 12.2 + rng.range(-0.6, 0.6);
        const [x, z] = planToWorld(a, b);
        const yaw = planYaw(a, b) + (r % 2 ? Math.PI : 0) + rng.range(-0.08, 0.08);
        const cloth = rng.pick(CLOTH_TINTS);
        awnings.add(x - Math.sin(yaw) * 1.4, gy(x, z) - 0.25, z - Math.cos(yaw) * 1.4, yaw, 1.05, 1, 1.25, cloth);
        stalls.add(x, gy(x, z) + 0.1, z, yaw, 1, 1, 1, rng.pick([[0.8, 0.5, 0.1], [0.6, 0.15, 0.1], [0.3, 0.5, 0.15], [0.85, 0.8, 0.6], [0.5, 0.3, 0.15], [0.75, 0.65, 0.2]] as Rgb[]));
        for (let k = 0; k < rng.int(1, 4); k++) jars.add(x + rng.range(-2.4, 2.4), gy(x, z) + 0.1, z + rng.range(-2.4, 2.4), rng.range(0, 6), 1, rng.range(0.8, 1.3), 1, scale([1, 1, 1], rng.range(0.8, 1.15)));
      }
    }
    const c = planToWorld(0, (MARKET.b0 + MARKET.b1) / 2);
    landmarks.market = [c[0], gy(c[0], c[1]) + 2, c[1]];
    for (const [a, b] of [[MARKET.a0, MARKET.b0], [MARKET.a1, MARKET.b0], [MARKET.a1, MARKET.b1], [MARKET.a0, MARKET.b1], [0, MARKET.b0], [0, MARKET.b1]] as const) {
      const [x, z] = planToWorld(a, b);
      lamp(x, z, rng.range(0, 6));
    }
  }
  {
    const rng = root.fork("garden");
    for (let a = GARDEN.a0; a < GARDEN.a1; a += 16) {
      for (let b = GARDEN.b0; b < GARDEN.b1; b += 16) {
        const P = (aa: number, bb: number): Vec3 => {
          const [x, z] = planToWorld(aa, bb);
          return [x, gy(x, z) + 0.1, z];
        };
        const p = P(a, b);
        const pathCell = Math.abs(a + 8 - (GARDEN.a0 + GARDEN.a1) / 2) < 8 || Math.abs(b + 8 - (GARDEN.b0 + GARDEN.b1) / 2) < 8;
        set.at(pathCell ? "paving" : "grass", p[0], p[2]).quad(P(a, b + 16), P(a + 16, b + 16), P(a + 16, b), P(a, b), pathCell ? [0.9, 0.85, 0.74] : [0.8, 0.95, 0.7], a, b);
        if (!pathCell) {
          for (let k = 0; k < 3; k++) {
            const [x, z] = planToWorld(a + rng.range(2, 14), b + rng.range(2, 14));
            (rng.chance(0.4) ? cypress : rng.chance(0.5) ? palm : tree)(x, z, rng);
          }
        }
      }
    }
    const c = planToWorld((GARDEN.a0 + GARDEN.a1) / 2, (GARDEN.b0 + GARDEN.b1) / 2);
    landmarks.garden = [c[0], gy(c[0], c[1]) + 2, c[1]];
  }

  // ---- Khan (caravanserai) and bath house ------------------------------------------------------------------------------
  {
    const rng = root.fork("khan");
    const f = planFrame((KHAN.a0 + KHAN.a1) / 2, (KHAN.b0 + KHAN.b1) / 2);
    const S = KHAN.a1 - KHAN.a0 - 4;
    const t = 6;
    const H = 7.4;
    const brick: Rgb = [0.72, 0.56, 0.36];
    const bk = set.of("brick", f);
    const rf = set.of("roof", f);
    for (const [cx, cz, w, d] of [[0, S / 2 - t / 2, S, t], [0, -S / 2 + t / 2, S, t], [-S / 2 + t / 2, 0, t, S - 2 * t], [S / 2 - t / 2, 0, t, S - 2 * t]] as const) {
      bk.box(f, cx, -1, cz, w, H + 1.9, d, brick, BOX_SIDES, 0.85);
      rf.quad(toWorld(f, cx - w / 2 + 0.4, H, cz + d / 2 - 0.4), toWorld(f, cx + w / 2 - 0.4, H, cz + d / 2 - 0.4), toWorld(f, cx + w / 2 - 0.4, H, cz - d / 2 + 0.4), toWorld(f, cx - w / 2 + 0.4, H, cz - d / 2 + 0.4), [0.82, 0.76, 0.64]);
    }
    const c = S - 2 * t;
    set.of("earth", f).quad(toWorld(f, -c / 2, 0.06, c / 2), toWorld(f, c / 2, 0.06, c / 2), toWorld(f, c / 2, 0.06, -c / 2), toWorld(f, -c / 2, 0.06, -c / 2), [0.8, 0.7, 0.54]);
    for (const yaw of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
      const inward = subFrame(f, 0, 0, 0, yaw);
      const af = subFrame(inward, 0, 0, -c / 2 + 1.6);
      bk.quad(toWorld(af, -c / 2, 0, -1.55), toWorld(af, c / 2, 0, -1.55), toWorld(af, c / 2, 4.6, -1.55), toWorld(af, -c / 2, 4.6, -1.55), [0.2, 0.17, 0.14]);
      arcade(bk, af, -c / 2, 0, c, 4.9, 4.2, 1.6, brick, scale(brick, 0.6));
      rf.quad(toWorld(af, -c / 2, 4.9, 0), toWorld(af, c / 2, 4.9, 0), toWorld(af, c / 2, 4.9, -1.6), toWorld(af, -c / 2, 4.9, -1.6), [0.8, 0.74, 0.62]);
    }
    const gate = subFrame(f, 0, 0, S / 2 + 2.15);
    archPanel(bk, gate, -5, 0, 10, 10, 4.4, 4, 2.1, scale(brick, 1.05), [0.4, 0.36, 0.3], 12);
    bk.quad(toWorld(gate, -2.3, 0, -2.06), toWorld(gate, 2.3, 0, -2.06), toWorld(gate, 2.3, 7, -2.06), toWorld(gate, -2.3, 7, -2.06), [0.16, 0.14, 0.12]);
    bk.box(gate, -5.4, 0, -1.05, 0.8, 10.3, 2.2, brick, BOX_NO_BOTTOM);
    bk.box(gate, 5.4, 0, -1.05, 0.8, 10.3, 2.2, brick, BOX_NO_BOTTOM);
    bk.box(gate, 0, 10, -1.05, 11.6, 0.4, 2.2, brick, 63);
    bk.quad(toWorld(gate, 5, 7.4, -2.1), toWorld(gate, -5, 7.4, -2.1), toWorld(gate, -5, 10, -2.1), toWorld(gate, 5, 10, -2.1), scale(brick, 0.9));
    for (let k = 0; k < 26; k++) {
      const p = toWorld(f, rng.range(-c / 2 + 3, c / 2 - 3), 0.06, rng.range(-c / 2 + 3, c / 2 - 3));
      jars.add(p[0], p[1], p[2], rng.range(0, 6), 1.1, rng.range(0.9, 1.4), 1.1, scale([1, 1, 1], rng.range(0.8, 1.1)));
    }
    landmarks.khan = toWorld(f, 0, 3, 0);
    buildings++;
  }
  {
    const rng = root.fork("hammam");
    const f = planFrame((HAMMAM.a0 + HAMMAM.a1) / 2, (HAMMAM.b0 + HAMMAM.b1) / 2);
    const W = HAMMAM.a1 - HAMMAM.a0 - 4;
    const D = HAMMAM.b1 - HAMMAM.b0 - 4;
    const wall: Rgb = [0.8, 0.72, 0.58];
    set.of("plaster", f).box(f, 0, -1, 0, W, 6.2, D, wall, BOX_SIDES, 0.85);
    set.of("roof", f).quad(toWorld(f, -W / 2, 5.2, D / 2), toWorld(f, W / 2, 5.2, D / 2), toWorld(f, W / 2, 5.2, -D / 2), toWorld(f, -W / 2, 5.2, -D / 2), [0.86, 0.8, 0.68]);
    for (const [x, z, r] of [[-8, 0, 4.2], [1, -4, 3.2], [1, 4, 3.2], [9, -4, 2.6], [9, 4, 2.6]] as const) {
      set.of("plaster", f).cylinder(f, x, 5.2, z, r * 1.05, r * 1.05, 0.9, 14, wall, false);
      set.of("plaster", f).revolve(f, x, 6.1, z, pointedDome(r, 0.9), 16, 7, scale(wall, 1.06));
    }
    set.of("brick", f).box(f, W / 2 - 1.5, 5.2, -D / 2 + 1.5, 1.4, 4.4, 1.4, [0.8, 0.7, 0.58], BOX_NO_BOTTOM);
    void rng;
    landmarks.hammam = toWorld(f, 0, 6, 0);
    buildings++;
  }

  // ---- City wall, towers and gates ---------------------------------------------------------------------------------------
  {
    const N = 72;
    const pts: Array<[number, number, boolean]> = [];
    for (let i = 0; i < N; i++) {
      const th = (i / N) * Math.PI * 2;
      const r = wallRadius(th);
      const x = CITY_CENTER.x + Math.cos(th) * r;
      const z = CITY_CENTER.z + Math.sin(th) * r;
      pts.push([x, z, bankSide(x, z) > 0 || riverDistance(x, z) < 10]);
    }
    const wallTint: Rgb = [0.7, 0.55, 0.36];
    const gates = new Set([0, Math.round(N * 0.5), Math.round(N * 0.74)]);
    for (let i = 0; i < N; i++) {
      const [x0, z0, wet0] = pts[i]!;
      const [x1, z1, wet1] = pts[(i + 1) % N]!;
      if (wet0 || wet1) continue;
      const len = Math.hypot(x1 - x0, z1 - z0);
      const yaw = Math.atan2(-(z1 - z0), x1 - x0);
      const mx = (x0 + x1) / 2;
      const mz = (z0 + z1) / 2;
      const f = frame(mx, gy(mx, mz), mz, yaw);
      const bk = set.of("brick", f);
      const H = 8.6;
      bk.box(f, 0, -1.5, 0, len + 0.4, H + 1.5, 2.6, wallTint, BOX_NO_BOTTOM, 0.82);
      const merlons = Math.floor(len / 2);
      for (let k = 0; k < merlons; k++) bk.box(f, -len / 2 + (len * (k + 0.5)) / merlons, H, -1.05, 1, 1, 0.5, scale(wallTint, 1.03), BOX_NO_BOTTOM);
      if (i % 2 === 0) {
        const tf = frame(x0, gy(x0, z0), z0, yaw);
        const gate = gates.has(i);
        const r = gate ? 5.4 : 4.3;
        const th = gate ? 13 : 11;
        bk.cylinder(tf, 0, -1.5, 0, r * 1.06, r, th + 1.5, 16, wallTint, true, scale(wallTint, 1.04));
        for (let k = 0; k < 10; k++) {
          const a = (k / 10) * Math.PI * 2;
          bk.box(subFrame(tf, Math.cos(a) * (r - 0.3), th, Math.sin(a) * (r - 0.3), -a + Math.PI / 2), 0, 0, 0, 1, 1, 0.5, scale(wallTint, 1.03), BOX_NO_BOTTOM);
        }
        if (gate) {
          // A gate passage beside the tower: a dark arch on the outer face.
          const gf = subFrame(f, 0, 0, -1.35, Math.PI);
          archPanel(set.of("ashlar", f), gf, -4, 0, 8, 8.4, 4.6, 3.6, 1.2, [0.95, 0.88, 0.74], [0.3, 0.26, 0.22], 12);
          bk.quad(toWorld(gf, -2.3, 0, -1.2), toWorld(gf, 2.3, 0, -1.2), toWorld(gf, 2.3, 6.5, -1.2), toWorld(gf, -2.3, 6.5, -1.2), [0.1, 0.09, 0.08]);
        }
      }
    }
    // Quay along the city's river front: a wall at the water's edge and a paved promenade behind it.
    for (let x = -340; x < 340; x += 6) {
      const x1 = x + 6;
      const edge = (xx: number) => riverZ(xx) - riverHalfWidth(xx);
      if (insideCity(x, edge(x) - 14) < 0 || insideCity(x1, edge(x1) - 14) < 0) continue;
      const zq0 = edge(x) + 9;
      const zq1 = edge(x1) + 9;
      const yaw = Math.atan2(-(zq1 - zq0), x1 - x);
      const mx = (x + x1) / 2;
      const mz = (zq0 + zq1) / 2;
      const f = frame(mx, 0, mz, yaw);
      const top = gy(mx, edge(mx) - 14) + 0.2;
      set.at("ashlar", mx, mz).box(f, 0, -3, 0, Math.hypot(x1 - x, zq1 - zq0) + 0.3, top + 3.5, 1.6, [0.9, 0.84, 0.7], BOX_NO_BOTTOM, 0.7);
      set.at("paving", mx, mz).quad([x, top, zq0 - 0.6], [x1, top, zq1 - 0.6], [x1, gy(x1, edge(x1) - 6) + 0.1, edge(x1) - 6], [x, gy(x, edge(x) - 6) + 0.1, edge(x) - 6], [0.86, 0.8, 0.68], x, 0);
    }
  }

  // ---- Canal: water, kerbs, palms; footbridges where streets cross ------------------------------------------------------
  {
    const rng = root.fork("canal");
    for (let i = 0; i < CANAL_COURSE.length - 1; i++) {
      const [x0, z0] = CANAL_COURSE[i]!;
      const [x1, z1] = CANAL_COURSE[i + 1]!;
      const mx = (x0 + x1) / 2;
      const mz = (z0 + z1) / 2;
      if (riverDistance(mx, mz) < 3 || Math.abs(mx) > HALF_EXTENT - 20) continue;
      const len = Math.hypot(x1 - x0, z1 - z0);
      const yaw = Math.atan2(-(z1 - z0), x1 - x0);
      const f = frame(mx, gy(mx, mz), mz, yaw);
      const hw = CANAL_HALF_WIDTH;
      set.of("canalwater", f).quad(toWorld(f, -len / 2 - 0.3, 0.2, hw), toWorld(f, len / 2 + 0.3, 0.2, hw), toWorld(f, len / 2 + 0.3, 0.2, -hw), toWorld(f, -len / 2 - 0.3, 0.2, -hw), [1, 1, 1], i * 8, 0);
      const k = set.of("ashlar", f);
      k.box(f, 0, -0.4, hw + 0.3, len + 0.7, 0.95, 0.6, [0.88, 0.82, 0.7], BOX_NO_BOTTOM);
      k.box(f, 0, -0.4, -hw - 0.3, len + 0.7, 0.95, 0.6, [0.88, 0.82, 0.7], BOX_NO_BOTTOM);
      if (i % 2 === 0) {
        const side = i % 4 === 0 ? 1 : -1;
        const p = toWorld(f, rng.range(-2, 2), 0, side * (hw + 3.2));
        if (insideCity(p[0], p[2]) > 4 || insideCity(p[0], p[2]) < -12) palm(p[0], p[2], rng);
      }
    }
  }

  // ---- Bridge on the line of the avenue ---------------------------------------------------------------------------------
  {
    let b = MARKET.b1;
    let hit = planToWorld(avenueA.at, b);
    while (riverDistance(hit[0], hit[1]) > 0 && b < 600) {
      b += 2;
      hit = planToWorld(avenueA.at, b);
    }
    const x = hit[0];
    const zc = riverZ(x);
    const L = 2 * riverHalfWidth(x) + 30;
    const deckY = gy(x, zc - riverHalfWidth(x) - 16) + 1.0;
    // Local X runs along the bridge (north bank to south bank), so yaw turns +X to +Z.
    const f = frame(x, 0, zc, -Math.PI / 2);
    const stone: Rgb = [0.74, 0.63, 0.45];
    const W = 9;
    const spans = 9;
    const y0 = -3;
    const ash = set.of("ashlar", f);
    const faceS = subFrame(f, 0, 0, W / 2);
    arcade(ash, faceS, -L / 2, y0, L, deckY - y0, L / spans, W, stone, scale(stone, 0.55), 3.6, 0.42);
    const faceN = subFrame(f, 0, 0, -W / 2, Math.PI);
    arcade(ash, faceN, -L / 2, y0, L, deckY - y0, L / spans, 0, stone, stone, 3.6, 0.42);
    set.of("paving", f).quad(toWorld(f, -L / 2, deckY, W / 2), toWorld(f, L / 2, deckY, W / 2), toWorld(f, L / 2, deckY, -W / 2), toWorld(f, -L / 2, deckY, -W / 2), [0.88, 0.82, 0.7]);
    for (const e of [-1, 1]) {
      // Approach ramps from the deck down to the street.
      const far = toWorld(f, e * (L / 2 + 12), 0, 0);
      const yFar = gy(far[0], far[2]) + 0.12;
      const A = toWorld(f, e * (L / 2), deckY, (e * W) / 2);
      const B = toWorld(f, e * (L / 2 + 12), yFar, (e * W) / 2);
      const C = toWorld(f, e * (L / 2 + 12), yFar, (-e * W) / 2);
      const Dd = toWorld(f, e * (L / 2), deckY, (-e * W) / 2);
      set.of("paving", f).quad(A, B, C, Dd, [0.88, 0.82, 0.7]);
    }
    ash.box(f, 0, deckY, W / 2 - 0.25, L, 1.05, 0.5, scale(stone, 1.04), BOX_NO_BOTTOM);
    ash.box(f, 0, deckY, -W / 2 + 0.25, L, 1.05, 0.5, scale(stone, 1.04), BOX_NO_BOTTOM);
    for (let k = 1; k < spans; k++) {
      // Cutwaters on the upstream and downstream faces of each pier.
      const px = -L / 2 + (L * k) / spans;
      for (const s of [-1, 1]) ash.cylinder(subFrame(f, px, 0, s * (W / 2 + 0.2)), 0, y0, 0, 1.6, 1.3, deckY - y0 - 1.2, 8, scale(stone, 0.95), true);
    }
    for (let k = 0; k <= 6; k++) {
      const p = toWorld(f, -L / 2 + (L * k) / 6, 0, k % 2 ? W / 2 - 0.9 : -W / 2 + 0.9);
      posts.add(p[0], deckY, p[2], k % 2 ? Math.PI / 2 : -Math.PI / 2, 1, 1, 1);
      lanterns.add(p[0], deckY, p[2], k % 2 ? Math.PI / 2 : -Math.PI / 2, 1, 1, 1);
      lampList.push(p[0], deckY + 2.75, p[2]);
    }
    landmarks.bridge = [x, deckY + 2, zc];
    landmarks.bridgeNorth = [x, deckY, zc - riverHalfWidth(x) - 12];
  }

  // ---- Riverside: promenade palms, moored boats ----------------------------------------------------------------------------
  {
    const rng = root.fork("riverside");
    for (let x = -600; x < 600; x += 11) {
      const xx = x + rng.range(-3, 3);
      for (const side of [-1, 1]) {
        if (rng.chance(side < 0 ? 0.25 : 0.4)) continue;
        const z = riverZ(xx) + side * (riverHalfWidth(xx) + rng.range(7, 16));
        if (Math.abs(xx - (landmarks.bridge?.[0] ?? 0)) < 12) continue;
        palm(xx, z, rng);
      }
    }
    for (let k = 0; k < 12; k++) {
      const x = -300 + k * 52 + rng.range(-12, 12);
      if (Math.abs(x - (landmarks.bridge?.[0] ?? 0)) < 26) continue;
      const z = riverZ(x) - riverHalfWidth(x) + 14.5;
      const slope = (riverZ(x + 1) - riverZ(x - 1)) / 2;
      mooredBoats.add(x, WATER_LEVEL + 0.25, z, Math.atan2(-slope, 1) + rng.range(-0.1, 0.1), 0.9, 0.9, 0.9, scale([1, 1, 1], rng.range(0.8, 1.1)));
    }
  }

  // ---- Noria where the canal leaves the river ---------------------------------------------------------------------------------
  let wheel: DistrictScene["wheel"];
  {
    let idx = 0;
    while (idx < CANAL_COURSE.length - 2 && riverDistance(CANAL_COURSE[idx]![0], CANAL_COURSE[idx]![1]) < -14) idx++;
    const [x0, z0] = CANAL_COURSE[idx]!;
    const [x1, z1] = CANAL_COURSE[idx + 1]!;
    const along = Math.atan2(-(z1 - z0), x1 - x0);
    const radius = 5.6;
    // The wheel stands in the shallows; its axle lies across the canal line, so its plane contains the canal direction.
    const f = frame(x0, 0, z0, along);
    const bk = set.of("brick", f);
    const tint: Rgb = [0.72, 0.56, 0.36];
    for (const s of [-1, 1]) bk.box(f, 0, -4, s * 2.4, 2.8, radius * 0.66 + 4.6, 1, tint, BOX_NO_BOTTOM, 0.8);
    // A short aqueduct carries the lifted water to the canal head on the bank.
    const aqTop = radius * 1.45;
    const aqLen = 26;
    const s1 = subFrame(f, 1.5, 0, 3.0);
    arcade(bk, s1, 0, -4, aqLen, aqTop + 4, aqLen / 4, 1.2, tint, scale(tint, 0.6), 6.2, 0.7);
    const s2 = subFrame(f, 1.5 + aqLen, 0, 1.8, Math.PI);
    arcade(bk, s2, 0, -4, aqLen, aqTop + 4, aqLen / 4, 0, tint, tint, 6.2, 0.7);
    set.of("canalwater", f).quad(toWorld(f, 1.5, aqTop + 0.02, 2.85), toWorld(f, 1.5 + aqLen, aqTop + 0.02, 2.85), toWorld(f, 1.5 + aqLen, aqTop + 0.02, 1.95), toWorld(f, 1.5, aqTop + 0.02, 1.95), [1, 1, 1]);
    wheel = { mesh: wheelMesh(), position: toWorld(f, 0, radius * 0.66, 0), yaw: along, radius, radPerSecond: 0.22 };
    landmarks.noria = wheel.position;
  }

  // ---- Fields and groves outside the wall ----------------------------------------------------------------------------------
  {
    const rng = root.fork("fields");
    const fieldSeed = rng.u32() & 0xffff;
    const CROPS: Rgb[] = [
      [0.95, 0.86, 0.42], // ripe grain
      [0.7, 0.92, 0.5], // young green
      [0.5, 0.75, 0.35], // vegetables
      [0.88, 0.74, 0.5], // fallow
      [0.62, 0.86, 0.42],
    ];
    const yaw = 0.42;
    const c = Math.cos(yaw);
    const s = Math.sin(yaw);
    const pw = 46;
    const pd = 30;
    for (let u = -HALF_EXTENT * 1.3; u < HALF_EXTENT * 1.3; u += pw) {
      for (let v = -HALF_EXTENT * 1.3; v < HALF_EXTENT * 1.3; v += pd) {
        const W = (uu: number, vv: number): [number, number] => [uu * c + vv * s, -uu * s + vv * c];
        const [cx, cz] = W(u + pw / 2, v + pd / 2);
        if (Math.abs(cx) > HALF_EXTENT - 30 || Math.abs(cz) > HALF_EXTENT - 30) continue;
        if (insideCity(cx, cz) > -36 || riverDistance(cx, cz) < 30 || canalDistance(cx, cz) < 22) continue;
        const grove = fbm(cx * 0.0045, cz * 0.0045, fieldSeed, 3);
        if (grove > 0.6) {
          for (let k = 0; k < 9; k++) palm(cx + rng.range(-pw / 2, pw / 2), cz + rng.range(-pd / 2, pd / 2), rng);
          continue;
        }
        if (grove < 0.33) continue; // open pasture
        const crop = scale(rng.pick(CROPS), rng.range(0.85, 1.1));
        const m = 1.6;
        const nu = 3;
        const nv = 2;
        const b = set.at("field", cx, cz);
        for (let i = 0; i < nu; i++) {
          for (let j = 0; j < nv; j++) {
            const P = (ii: number, jj: number): Vec3 => {
              const [x, z] = W(u + m + ((pw - 2 * m) * ii) / nu, v + m + ((pd - 2 * m) * jj) / nv);
              return [x, gy(x, z) + 0.14, z];
            };
            b.quad(P(i, j + 1), P(i + 1, j + 1), P(i + 1, j), P(i, j), crop, (u + (pw * i) / nu) % 12, (v + (pd * j) / nv) % 12);
          }
        }
        if (rng.chance(0.2)) tree(cx + rng.range(-pw / 2, pw / 2), cz + rng.range(-pd / 2, pd / 2), rng, 1.2);
      }
    }
  }

  // ---- Streets as walking paths; lamps along the avenues ------------------------------------------------------------------------
  const paths: WalkPath[] = [];
  const pathWeight: number[] = [];
  const footbridges = new Set<string>();
  {
    const addRuns = (pointAt: (t: number) => [number, number], t0: number, t1: number, major: boolean) => {
      let run: number[] = [];
      const flush = () => {
        if (run.length >= 12) {
          const pts = Float32Array.from(run);
          const cum = new Float32Array(pts.length / 2);
          for (let k = 1; k < cum.length; k++) cum[k] = cum[k - 1]! + Math.hypot(pts[k * 2]! - pts[k * 2 - 2]!, pts[k * 2 + 1]! - pts[k * 2 - 1]!);
          paths.push({ points: pts, cum, total: cum[cum.length - 1]! });
          pathWeight.push(cum[cum.length - 1]! * (major ? 3.5 : 1));
        }
        run = [];
      };
      for (let t = t0; t <= t1; t += 6) {
        const [a, b] = pointAt(t);
        const [x, z] = planToWorld(a, b);
        const ok = insideCity(x, z) > 5 && !SOLID.some((q) => inRect(a, b, q, 2));
        if (ok) {
          if (run.length >= 2) {
            // Where the street crosses the canal, lay a small bridge on the line of the street.
            const px = run[run.length - 2]!;
            const pz = run[run.length - 1]!;
            const d0 = canalDistance(px, pz);
            const d1 = canalDistance(x, z);
            if ((d0 > 0 && d1 <= 0) || (d0 <= 0 && d1 > 0) || (d0 > 0 && d1 > 0 && Math.min(d0, d1) < 1.5 && canalDistance((px + x) / 2, (pz + z) / 2) <= 0)) {
              const mx = (px + x) / 2;
              const mz = (pz + z) / 2;
              const key = `${Math.round(mx / 6)}:${Math.round(mz / 6)}`;
              if (!footbridges.has(key)) {
                footbridges.add(key);
                const bf = frame(mx, gy(mx, mz), mz, Math.atan2(-(z - pz), x - px));
                const wide = major ? 11 : 4.2;
                set.of("ashlar", bf).box(bf, 0, 0.2, 0, 15, 0.5, wide, [0.74, 0.64, 0.46], 63);
                for (const sd of [-1, 1]) set.of("ashlar", bf).box(bf, 0, 0.7, sd * (wide / 2 - 0.2), 15, 0.7, 0.4, [0.78, 0.68, 0.5], BOX_NO_BOTTOM);
              }
            }
          }
          run.push(x, z);
        } else flush();
      }
      flush();
    };
    for (const s of aStreets) addRuns((t) => [s.at, t], -340, 260, s.major);
    for (const s of bStreets) addRuns((t) => [t, s.at], -380, 380, s.major);
    // The market square: a few looping routes between the stalls.
    const rng = root.fork("market-walk");
    for (let k = 0; k < 6; k++) {
      const run: number[] = [];
      const n = 7;
      const a0 = rng.range(MARKET.a0 + 6, MARKET.a1 - 6);
      for (let i = 0; i <= n; i++) {
        const [x, z] = planToWorld(a0 + 5 * Math.sin(i * 1.7 + k), MARKET.b0 + 4 + ((MARKET.b1 - MARKET.b0 - 8) * i) / n);
        run.push(x, z);
      }
      const pts = Float32Array.from(run);
      const cum = new Float32Array(pts.length / 2);
      for (let i = 1; i < cum.length; i++) cum[i] = cum[i - 1]! + Math.hypot(pts[i * 2]! - pts[i * 2 - 2]!, pts[i * 2 + 1]! - pts[i * 2 - 1]!);
      paths.push({ points: pts, cum, total: cum[cum.length - 1]! });
      pathWeight.push(cum[cum.length - 1]! * 9);
    }
    // Lamps down both avenues.
    for (let b = -60; b < MARKET.b1 + 20; b += 24) {
      for (const side of [-1, 1]) {
        const [x, z] = planToWorld(avenueA.at + side * 5.4, b);
        if (insideCity(x, z) > 4) lamp(x, z, planYaw(avenueA.at, b) + (side > 0 ? Math.PI : 0));
      }
    }
    for (let a = -300; a < 300; a += 26) {
      for (const side of [-1, 1]) {
        const [x, z] = planToWorld(a, avenueB.at + side * 5.2);
        if (insideCity(x, z) > 4 && !RESERVED.some((q) => inRect(a, avenueB.at, q))) lamp(x, z, planYaw(a, avenueB.at) + (side > 0 ? Math.PI / 2 : -Math.PI / 2));
      }
    }
  }

  // ---- People and sailing boats (animated by updateDynamics) ----------------------------------------------------------------------
  const walkerCount = options.walkers ?? 640;
  const walkers: Walker[] = [];
  const bodies = new Instances();
  const heads = new Instances();
  {
    const rng = root.fork("walkers");
    for (let k = 0; k < walkerCount && paths.length > 0; k++) {
      const path = rng.weighted(paths.map((_, i) => i), pathWeight);
      walkers.push({ path, start: rng.range(0, paths[path]!.total * 2), speed: rng.range(0.9, 1.5) * (rng.chance(0.5) ? 1 : -1), lateral: rng.range(-1.3, 1.3), scale: rng.range(0.92, 1.1), bobPhase: rng.range(0, 6.28) });
      bodies.add(0, 0, 0, 0, 1, 1, 1, rng.pick(ROBE_TINTS));
      heads.add(0, 0, 0, 0, 1, 1, 1, scale([1, 1, 1], rng.range(0.8, 1.1)));
    }
  }
  const sailors: Sailor[] = [];
  const sailBoats = new Instances();
  {
    const rng = root.fork("sailors");
    for (let k = 0; k < 9; k++) {
      sailors.push({ x0: rng.range(-600, 600), lane: rng.range(-0.55, 0.55), speed: rng.range(1.2, 2.6) * (k % 2 ? 1 : -1), phase: rng.range(0, 6.28) });
      sailBoats.add(0, 0, 0, 0, 1, 1, 1, scale([1, 1, 1], rng.range(0.85, 1.1)));
    }
  }

  // ---- River surface ------------------------------------------------------------------------------------------------------------------
  const waterB = new MeshBuilder();
  {
    const E = 3400;
    waterB.quad([-E, WATER_LEVEL, E], [E, WATER_LEVEL, E], [E, WATER_LEVEL, -E], [-E, WATER_LEVEL, -E], [1, 1, 1], -E, -E);
  }

  // ---- Assemble -------------------------------------------------------------------------------------------------------------------------
  const propRng = root.fork("props");
  const chunks: StaticChunk[] = [...set.chunks(), { material: "terrain", cell: [0, 0], mesh: terrain.build() }, { material: "water", cell: [0, 0], mesh: waterB.build() }];
  const instances: InstanceBatch[] = [
    palmsA.batch("palm-a", "foliage", palmMesh(propRng.fork("palm-a"))),
    palmsB.batch("palm-b", "foliage", palmMesh(propRng.fork("palm-b"))),
    trees.batch("tree", "foliage", treeMesh(propRng.fork("tree"))),
    cypresses.batch("cypress", "foliage", cypressMesh()),
    awnings.batch("awning", "fabric", awningMesh()),
    stalls.batch("stall", "prop", stallMesh(propRng.fork("stall"))),
    jars.batch("jar", "prop", jarMesh()),
    posts.batch("lamp-post", "prop", lampPostMesh()),
    lanterns.batch("lantern", "lantern", lanternMesh(), false),
    mooredBoats.batch("boat-moored", "prop", boatMesh(false)),
    sailBoats.batch("boat-sail", "prop", boatMesh(true), true, true),
    bodies.batch("person-body", "prop", personBodyMesh(), true, true),
    heads.batch("person-head", "prop", personHeadMesh(), false, true),
  ].filter((b) => b.count > 0);

  let triangles = 0;
  let vertices = 0;
  for (const c of chunks) {
    triangles += c.mesh.indices.length / 3;
    vertices += c.mesh.positions.length / 3;
  }
  let instanceCount = 0;
  for (const b of instances) {
    triangles += (b.mesh.indices.length / 3) * b.count;
    instanceCount += b.count;
  }
  triangles += wheel.mesh.indices.length / 3;

  const scene: DistrictScene = {
    seed,
    halfExtent: HALF_EXTENT,
    cellSize,
    waterLevel: WATER_LEVEL,
    materials: MATERIALS,
    chunks,
    instances,
    wheel,
    lamps: Float32Array.from(lampList),
    landmarks,
    stats: { buildings, triangles: Math.round(triangles), vertices, instances: instanceCount, walkers: walkers.length, chunks: chunks.length, drawBatches: chunks.length + instances.length + 1 },
    dynamics: { paths, walkers, sailors },
  };
  updateDynamics(scene, 0);
  return scene;
}

/** Position on a walking path at distance `s`, walking back and forth; returns heading too. */
function pathPose(p: WalkPath, s: number): [number, number, number] {
  const period = p.total * 2;
  let d = ((s % period) + period) % period;
  let dir = 1;
  if (d > p.total) {
    d = period - d;
    dir = -1;
  }
  let lo = 0;
  let hi = p.cum.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (p.cum[mid]! <= d) lo = mid;
    else hi = mid;
  }
  const seg = p.cum[hi]! - p.cum[lo]! || 1;
  const t = (d - p.cum[lo]!) / seg;
  const x0 = p.points[lo * 2]!;
  const z0 = p.points[lo * 2 + 1]!;
  const x1 = p.points[hi * 2]!;
  const z1 = p.points[hi * 2 + 1]!;
  const yaw = Math.atan2(-(z1 - z0) * dir, (x1 - x0) * dir);
  return [x0 + (x1 - x0) * t, z0 + (z1 - z0) * t, yaw];
}

/**
 * Advances everything that moves to `time` seconds: walkers and sailing boats (their instance matrices are rewritten
 * in place) and returns the wheel angle. Pure function of the scene and the time, so a replay or a second renderer
 * shows exactly the same frame.
 */
export function updateDynamics(scene: DistrictScene, time: number): { wheelAngle: number } {
  const { paths, walkers, sailors } = scene.dynamics;
  const body = scene.instances.find((b) => b.id === "person-body");
  const head = scene.instances.find((b) => b.id === "person-head");
  if (body && head) {
    for (let i = 0; i < walkers.length; i++) {
      const w = walkers[i]!;
      const p = paths[w.path]!;
      const [x, z, yaw] = pathPose(p, w.start + w.speed * time);
      // Keep to one side of the street, relative to the direction of travel.
      const lx = x + Math.sin(yaw) * w.lateral;
      const lz = z + Math.cos(yaw) * w.lateral;
      const bob = 0.03 * Math.abs(Math.sin(time * 6.2 * Math.abs(w.speed) + w.bobPhase));
      // The figure's front is local +Z; turn it to face along the direction of travel.
      const deck = canalDistance(lx, lz) < 2.5 ? 0.62 : 0;
      instanceMatrix(body.matrices, i * 16, lx, groundHeight(lx, lz) + 0.1 + deck + bob, lz, yaw + Math.PI / 2, w.scale, w.scale, w.scale);
    }
    head.matrices.set(body.matrices);
  }
  const sail = scene.instances.find((b) => b.id === "boat-sail");
  if (sail) {
    const span = scene.halfExtent * 2 - 40;
    for (let i = 0; i < sailors.length; i++) {
      const s = sailors[i]!;
      const x = ((((s.x0 + s.speed * time + span / 2) % span) + span) % span) - span / 2;
      const z = riverZ(x) + s.lane * riverHalfWidth(x);
      const slope = (riverZ(x + 2) - riverZ(x - 2)) / 4;
      const yaw = Math.atan2(-slope, 1) + (s.speed < 0 ? Math.PI : 0);
      const heave = 0.12 * Math.sin(time * 0.9 + s.phase);
      instanceMatrix(sail.matrices, i * 16, x, scene.waterLevel + 0.3 + heave, z, yaw, 1, 1, 1);
    }
  }
  return { wheelAngle: -scene.wheel.radPerSecond * time };
}
