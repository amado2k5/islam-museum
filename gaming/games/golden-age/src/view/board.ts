// The Golden Age board as engine-neutral geometry: what one plot looks like for a given state, and the land around
// the district. The rules never see any of this; this file never decides anything. Given the same seed and the
// same look it returns the same vertices, so a plot can be rebuilt on its own when the state changes.
//
// The district is fictional. The buildings are an original, generic vocabulary (flat roofs and parapets, pointed
// arches, plaster, brick, glazed domes) and are not reconstructions of real buildings. There are no places of
// worship among them: whether a game may show one is a question for the founder (docs/gaming/LEDGER.md).
import { Rng, fbm, hash32, latticeHash } from "@im/kernel/prng";
import { BOX_NO_BOTTOM, BOX_SIDES, MeshBuilder, frame, subFrame, toWorld, type Frame, type MeshData, type Rgb, type Vec3 } from "@im/worldkit/mesh";
import { CLOTH_TINTS, MeshSet, ROBE_TINTS, TURQUOISE, COBALT, WALL_TINTS, arcade, archPanel, door, house, pointedDome, roofShade, windowsOn, wing, type MaterialId } from "@im/worldkit/district/kit";
import type { SceneMaterialId } from "@im/worldkit/district/generate";
import { GRID_W, xyOf, type BuildingType } from "../rules";
import { BOARD, CANAL_BED, CANAL_LEVEL, CHANNEL_HALF, DIR_STEP, HALF, LANE_HALF, PLOT, QUAY, RIVER_LEVEL, RIVER_WIDTH, plotCentre, type Dir } from "./layout";

// ---- What the generator is told about a plot -------------------------------------------------------------------------

export interface PlotLook {
  type: BuildingType | null;
  /** Canal arms leaving the crossroads: bit d set for direction d. Row 0 has its south bit set when it has any link. */
  canal: number;
  /** Water is within reach of this plot. */
  served: boolean;
  /** A house with a working bath within reach (it holds more households). */
  bathed: boolean;
  /** 0 spring, 1 summer, 2 autumn, 3 winter. */
  soy: 0 | 1 | 2 | 3;
  /** Research that changes how things look. */
  lined: boolean;
  rotation: boolean;
  /** The district's water wheel stands at this plot's intake. */
  wheel: boolean;
  /** The building here has been endowed: a banner and an inscribed stone stand at its crossing. */
  endowed?: boolean;
}

export const lookKey = (l: PlotLook): string => `${l.type ?? "-"}|${l.canal}|${l.served ? 1 : 0}${l.bathed ? 1 : 0}${l.lined ? 1 : 0}${l.rotation ? 1 : 0}${l.wheel ? 1 : 0}${l.endowed ? 1 : 0}|${l.type === "farm" ? l.soy : 0}`;

export type PropKind = "palm-a" | "palm-b" | "tree" | "cypress" | "awning" | "stall" | "jar";
export interface PropInstance {
  kind: PropKind;
  x: number;
  y: number;
  z: number;
  yaw: number;
  scale: number;
  color: Rgb;
}
/** A flat sheet of canal water, as a world rectangle, so a renderer can animate it filling. */
export interface WaterRect {
  /** "c" centre, "0".."3" an arm by direction, "q" the intake through the quay. */
  id: string;
  x0: number;
  z0: number;
  x1: number;
  z1: number;
  y: number;
}
export interface PlotGeometry {
  chunks: Array<{ material: SceneMaterialId; mesh: MeshData }>;
  props: PropInstance[];
  water: WaterRect[];
  wheel: { x: number; y: number; z: number; radius: number } | null;
  triangles: number;
}

// ---- Small geometry helpers -----------------------------------------------------------------------------------------

const scale = (c: Rgb, k: number): Rgb => [c[0] * k, c[1] * k, c[2] * k];
const WORLD = frame(0, 0, 0);
/** Yaw of the frame whose local +X points along a board direction. */
const DIR_YAW = [Math.PI / 2, 0, -Math.PI / 2, Math.PI] as const;

/** An upward-facing rectangle in a frame's local x,z (x0 < x1, z0 < z1). */
function up(b: MeshBuilder, f: Frame, x0: number, z0: number, x1: number, z1: number, y: number, c: Rgb): void {
  const A = toWorld(f, x0, y, z1);
  b.quad(A, toWorld(f, x1, y, z1), toWorld(f, x1, y, z0), toWorld(f, x0, y, z0), c, A[0], A[2]);
}
/** A vertical face from a to b (local x,z). On a north-up map it faces the right-hand side of the walk a to b. */
function face(b: MeshBuilder, f: Frame, ax: number, az: number, bx: number, bz: number, y0: number, y1: number, c: Rgb, cTop: Rgb = c): void {
  b.quad(toWorld(f, ax, y0, az), toWorld(f, bx, y0, bz), toWorld(f, bx, y1, bz), toWorld(f, ax, y1, az), c, 0, y0, cTop);
}

/** A wing whose front (local +Z) is an open arcade with shade behind it. */
function arcadeWing(set: MeshSet, f: Frame, cx: number, cz: number, w: number, d: number, h: number, wall: Rgb, roofTint: Rgb, bay = 3.2): void {
  wing(set, f, cx, cz, w, d, h, wall, roofTint, 2 | 4 | 8);
  const af = subFrame(f, cx, 0, cz + d / 2);
  const b = set.of("plaster", af);
  arcade(b, af, -w / 2, 0, w, h, bay, 0.9, wall, scale(wall, 0.62));
  face(b, af, -w / 2, 0, w / 2, 0, h, h + 0.85, wall);
  face(b, af, -w / 2, -0.9, w / 2, -0.9, 0, h, [0.13, 0.1, 0.08]);
}

/** A plain block with windows all round and a door on its front (local +Z). */
function block(set: MeshSet, f: Frame, rng: Rng, cx: number, cz: number, w: number, d: number, h: number, wall: Rgb, roofTint: Rgb, lit = 0.2): void {
  wing(set, f, cx, cz, w, d, h, wall, roofTint);
  const storeys = Math.max(1, Math.round(h / 3.3));
  for (let s = 0; s < 4; s++) windowsOn(set, f, rng, cx, cz, w, d, storeys, s, lit, false);
  door(set, f, cx, cz + d / 2, 0, wall);
}

/** A dome on a low drum. */
function dome(set: MeshSet, f: Frame, x: number, z: number, r: number, y: number, material: MaterialId, tint: Rgb, wall: Rgb, rise = 1.08, drum = 1.1): void {
  if (drum > 0) set.of("plaster", f).cylinder(f, x, y - 0.3, z, r * 1.05, r * 1.05, drum + 0.3, 16, wall, false);
  set.of(material, f).revolve(f, x, y + drum, z, pointedDome(r, rise), 18, 9, tint, scale(tint, 1.12));
  // A small finial.
  set.of("wood", f).cylinder(f, x, y + drum + r * rise - 0.05, z, 0.09, 0.02, 0.9, 5, [0.75, 0.6, 0.3], false);
}

/** A barrel-vaulted store: walls, a half-round roof and its two end walls. Runs along local Z. */
function vault(b: MeshBuilder, f: Frame, cx: number, cz: number, w: number, len: number, wallH: number, c: Rgb): void {
  b.box(f, cx, -0.6, cz, w, wallH + 0.6, len, c, BOX_SIDES, 0.82);
  const n = 9;
  const r = w / 2;
  const z0 = cz - len / 2;
  const z1 = cz + len / 2;
  const P = (x: number, y: number, z: number): Vec3 => toWorld(f, x, y, z);
  for (let i = 0; i < n; i++) {
    const a0 = (Math.PI * i) / n;
    const a1 = (Math.PI * (i + 1)) / n;
    const xa = cx + r * Math.cos(a0);
    const ya = wallH + r * 0.9 * Math.sin(a0);
    const xb = cx + r * Math.cos(a1);
    const yb = wallH + r * 0.9 * Math.sin(a1);
    b.quad(P(xa, ya, z1), P(xa, ya, z0), P(xb, yb, z0), P(xb, yb, z1), scale(c, 0.95 + 0.1 * Math.sin((a0 + a1) / 2)));
    const centre = P(cx, wallH, z1);
    b.quad(centre, P(xa, ya, z1), P(xb, yb, z1), P(xb, yb, z1), c);
    const back = P(cx, wallH, z0);
    b.quad(back, P(xb, yb, z0), P(xa, ya, z0), P(xa, ya, z0), scale(c, 0.85));
  }
}

class Props {
  readonly list: PropInstance[] = [];
  add(kind: PropKind, f: Frame, lx: number, lz: number, yaw: number, s: number, color: Rgb = [1, 1, 1], ly = 0): void {
    const [x, y, z] = toWorld(f, lx, ly, lz);
    this.list.push({ kind, x, y, z, yaw: yaw + Math.atan2(f.sin, f.cos), scale: s, color });
  }
}

// ---- The four quarters of a plot, by building type ---------------------------------------------------------------------
// Each quarter is built in a frame at its centre: local +Z looks onto one lane (its front), local +X onto the other,
// and the crossroads is at the (+, +) corner. `h` is the half-size of the buildable square.

const QUARTER_HALF = (HALF - LANE_HALF - 1.4) / 2;
const QUARTER_CENTRE = LANE_HALF + 0.7 + QUARTER_HALF;
const ROOF_TINT: Rgb = [0.72, 0.64, 0.5];
const LIME: Rgb = [0.86, 0.82, 0.72];
const STONE: Rgb = [0.8, 0.72, 0.58];

type QuarterBuilder = (set: MeshSet, props: Props, f: Frame, rng: Rng, look: PlotLook, qi: number) => void;

const quarterHouse: QuarterBuilder = (set, props, f, rng, look) => {
  const h = QUARTER_HALF;
  if (rng.chance(0.38)) {
    // Two narrower houses side by side.
    for (const side of [-1, 1]) {
      const w = h - 0.6 + rng.range(-0.3, 0.2);
      const d = rng.range(11.5, 2 * h - 1.4);
      house(set, subFrame(f, side * (h / 2 + 0.1), 0, h - 0.6 - d / 2), w, d, rng, 0.22);
    }
    if (look.served) props.add(rng.chance(0.5) ? "palm-a" : "palm-b", f, rng.range(-2, 2), -h + 1.4, rng.range(0, 6), rng.range(0.6, 0.8));
  } else {
    const w = rng.range(14.2, 2 * h - 0.6);
    const d = rng.range(13.2, 2 * h - 1.6);
    const hf = subFrame(f, (2 * h - w) * rng.range(-0.4, 0.4), 0, h - 0.6 - d / 2);
    const r = house(set, hf, w, d, rng, 0.22);
    // Water in reach shows as a tree in the court and a palm by the wall; a bath in reach as a second tree.
    if (look.served && r.court) props.list.push({ kind: "tree", x: r.court[0], y: 0, z: r.court[1], yaw: rng.range(0, 6), scale: rng.range(0.5, 0.7), color: [1, 1, 1] });
    if (look.served) props.add(rng.chance(0.5) ? "palm-a" : "palm-b", f, -h + 0.9, -h + 1.2, rng.range(0, 6), rng.range(0.6, 0.85));
    if (look.bathed) props.add("tree", f, h - 1.2, -h + 1.6, rng.range(0, 6), rng.range(0.45, 0.6));
  }
};

/** Crop colour by season for a watered field: spring growth, summer heat, autumn ripeness, winter stubble. */
const CROP: ReadonlyArray<Rgb> = [
  [0.62, 1.05, 0.5],
  [1.0, 1.0, 0.5],
  [1.25, 1.02, 0.42],
  [0.78, 0.66, 0.46],
];
const CROP_HEIGHT = [0.42, 0.3, 0.5, 0.08] as const;

const quarterFarm: QuarterBuilder = (set, props, f, rng, look, qi) => {
  const h = QUARTER_HALF + 0.5;
  const b = set.of("field", f);
  const strips = 7;
  const w = (2 * h) / strips;
  const farmhouse = qi === 0;
  // Strips run along the quarter so the crop rows of the texture follow them.
  for (let i = 0; i < strips; i++) {
    const z = -h + w * (i + 0.5);
    // The farmhouse and its yard take the back corner of the first quarter.
    const x1 = farmhouse && i < 3 ? h - 11.2 : h;
    let tint: Rgb = look.served ? CROP[look.soy]! : [1.05, 0.9, 0.62];
    let height: number = look.served ? CROP_HEIGHT[look.soy] : 0.1;
    // Without water only a few strips are worth sowing.
    if (!look.served && i % 3 !== 0) height = 0.03;
    // Crop rotation: every third strip is a second crop, green in every season.
    if (look.rotation && look.served && i % 3 === 1) {
      tint = [0.42, 0.82, 0.46];
      height = 0.34;
    }
    tint = scale(tint, 0.9 + 0.2 * latticeHash(i, qi, 77));
    b.box(f, (x1 - h) / 2, 0, z, x1 + h - 0.3, height, w - 0.5, tint, BOX_NO_BOTTOM, 0.7);
    // A furrow of water between strips where a canal feeds the field.
    if (look.served && i > 0 && i % 2 === 0) up(set.of("canalwater", f), f, -h, z - w / 2 - 0.18, x1 - 0.2, z - w / 2 + 0.18, 0.05, [1, 1, 1]);
  }
  if (farmhouse) {
    const wall = scale(WALL_TINTS[3]!, rng.range(0.9, 1.05));
    block(set, subFrame(f, h - 4.2, 0, -h + 4), rng, 0, 0, 6.4, 5.6, 3.1, wall, ROOF_TINT, 0.1);
    // A stack of straw and a pair of palms by the house.
    set.of("fabric", f).revolve(f, h - 9.4, 0, -h + 3.2, (t) => [1.5 * Math.cos((t * Math.PI) / 2), 1.9 * Math.sin((t * Math.PI) / 2)], 9, 4, [0.95, 0.78, 0.4], [1.1, 0.92, 0.5]);
    props.add("palm-a", f, h - 1.2, -h + 8.2, rng.range(0, 6), rng.range(0.7, 0.9));
  }
  if (look.served && qi % 2 === 1) props.add("palm-b", f, -h + 0.6, -h + 0.6, rng.range(0, 6), rng.range(0.7, 0.95));
};

const quarterMarket: QuarterBuilder = (set, props, f, rng, _look, qi) => {
  const h = QUARTER_HALF;
  up(set.of("paving", f), f, -h - 0.6, -h - 0.6, h + 0.6, h + 0.6, 0.04, [0.92, 0.86, 0.74]);
  const wall = scale(WALL_TINTS[rng.int(0, 2)]!, rng.range(0.92, 1.05));
  if (qi % 2 === 0) {
    // A row of shops behind an arcade, awnings out over the stalls in front.
    const d = 5.4;
    arcadeWing(set, f, 0, -h + d / 2, 2 * h, d, 4.3, wall, ROOF_TINT, 3.4);
    const front = -h + d;
    const n = 5;
    for (let i = 0; i < n; i++) {
      const x = -h + ((i + 0.5) * 2 * h) / n;
      props.add("awning", f, x, front, 0, 1, rng.pick(CLOTH_TINTS));
      if (i % 2 === 0) props.add("stall", f, x + rng.range(-0.3, 0.3), front + 4.6 + rng.range(-0.4, 0.4), rng.range(-0.2, 0.2), 1, rng.pick(STALL_GOODS));
    }
    for (let i = 0; i < 5; i++) props.add("jar", f, -h + 1 + rng.range(0, 2 * h - 2), front + 1.2 + rng.range(0, 0.8), rng.range(0, 6), rng.range(0.8, 1.1), JAR_TINT);
  } else {
    // An open yard of stalls under cloth shades.
    for (let i = 0; i < 5; i++) {
      const x = -h + 2.6 + (i % 3) * 5.6 + rng.range(-0.4, 0.4);
      const z = -h + 3 + Math.floor(i / 3) * 7.2 + rng.range(-0.4, 0.4);
      const yaw = rng.pick([0, Math.PI / 2]);
      props.add("stall", f, x, z, yaw, 1, rng.pick(STALL_GOODS));
      roofShade(set, subFrame(f, x, 0, z, yaw), rng);
    }
    // A covered well at the corner of the crossing.
    const b = set.of("ashlar", f);
    b.cylinder(f, h - 3, 0, h - 3, 1.3, 1.3, 0.8, 12, STONE, false);
    up(set.of("canalwater", f), f, h - 3.9, h - 3.9, h - 2.1, h - 2.1, 0.55, [1, 1, 1]);
    for (let i = 0; i < 7; i++) props.add("jar", f, -h + 1 + rng.range(0, 2 * h - 2), -h + 0.8 + rng.range(0, 1), rng.range(0, 6), rng.range(0.8, 1.15), JAR_TINT);
  }
};
const STALL_GOODS: Rgb[] = [
  [0.85, 0.5, 0.12],
  [0.7, 0.18, 0.1],
  [0.3, 0.5, 0.16],
  [0.86, 0.78, 0.5],
  [0.5, 0.26, 0.5],
];
const JAR_TINT: Rgb = [1, 1, 1];

const quarterWorkshop: QuarterBuilder = (set, props, f, rng, _look, qi) => {
  const h = QUARTER_HALF;
  const wall = scale(WALL_TINTS[rng.pick([1, 3, 7])]!, rng.range(0.9, 1.02));
  up(set.of("earth", f), f, -h - 0.6, -h - 0.6, h + 0.6, h + 0.6, 0.03, [0.74, 0.64, 0.5]);
  if (qi === 0) {
    block(set, f, rng, -1.5, -h + 5.2, 13, 9, 4.6, wall, ROOF_TINT, 0.15);
    // A lean-to on posts along the side.
    const wd = set.of("wood", f);
    for (const z of [-h + 2, -h + 8.4]) wd.box(f, h - 0.9, 0, z, 0.18, 2.9, 0.18, [0.5, 0.4, 0.3], BOX_SIDES);
    wd.box(f, h - 2.6, 2.9, -h + 5.2, 4.2, 0.14, 7.4, [0.62, 0.5, 0.36], 63);
  } else if (qi === 1) {
    // Two kilns and their fuel.
    const br = set.of("brick", f);
    for (const [x, z, r] of [[-3.6, -2.4, 2.9], [3.4, 1.2, 2.4]] as const) {
      br.cylinder(f, x, 0, z, r, r, 1.3, 14, [0.9, 0.62, 0.44], false);
      br.revolve(f, x, 1.3, z, (t) => [r * Math.cos((t * Math.PI) / 2) * (1 - 0.18 * t), r * 1.05 * Math.sin((t * Math.PI) / 2)], 14, 6, [0.92, 0.64, 0.45], [0.5, 0.36, 0.28]);
      br.cylinder(f, x, 1.3 + r * 0.98, z, 0.42, 0.34, 0.9, 8, [0.4, 0.3, 0.24], true, [0.08, 0.07, 0.06]);
    }
    const wd = set.of("wood", f);
    for (let i = 0; i < 3; i++) wd.box(f, -h + 2.2 + i * 2.3, 0, h - 2.4, 1.9, 0.9 + 0.3 * (i % 2), 3.2, [0.6, 0.46, 0.3], BOX_NO_BOTTOM, 0.75);
  } else if (qi === 2) {
    // Dye vats, and cloth drying on lines.
    const st = set.of("ashlar", f);
    const dyes: Rgb[] = [CLOTH_TINTS[0]!, CLOTH_TINTS[1]!, CLOTH_TINTS[2]!, CLOTH_TINTS[3]!, CLOTH_TINTS[5]!, CLOTH_TINTS[6]!];
    for (let i = 0; i < 6; i++) {
      const x = -h + 2.6 + (i % 3) * 3.6;
      const z = h - 2.6 - Math.floor(i / 3) * 3.6;
      st.cylinder(f, x, 0, z, 1.35, 1.35, 0.75, 14, STONE, false);
      set.of("fabric", f).cylinder(f, x, 0.55, z, 1.15, 1.15, 0.02, 14, scale(dyes[i]!, 1.6), true, scale(dyes[i]!, 1.6));
    }
    const wd = set.of("wood", f);
    const fb = set.of("fabric", f);
    for (let i = 0; i < 3; i++) {
      const z = -h + 1.6 + i * 2.6;
      wd.box(f, -h + 1, 0, z, 0.14, 2.6, 0.14, [0.5, 0.4, 0.3], BOX_SIDES);
      wd.box(f, h - 1, 0, z, 0.14, 2.6, 0.14, [0.5, 0.4, 0.3], BOX_SIDES);
      const c = dyes[(i * 2 + 1) % dyes.length]!;
      face(fb, f, -h + 1.4, z, h - 1.4, z, 0.7, 2.5, scale(c, 1.3));
      face(fb, f, h - 1.4, z, -h + 1.4, z, 0.7, 2.5, c);
    }
  } else {
    block(set, f, rng, -h + 3.6, -h + 3.2, 6.4, 5.4, 3.2, wall, ROOF_TINT, 0.1);
    for (let i = 0; i < 14; i++) props.add("jar", f, 1 + (i % 5) * 1.5, -h + 1.2 + Math.floor(i / 5) * 1.5, rng.range(0, 6), rng.range(0.9, 1.25), JAR_TINT);
    const wd = set.of("wood", f);
    for (let i = 0; i < 4; i++) wd.box(f, -h + 2 + i * 3.6, 0, h - 2.6, 3, 0.5 + 0.35 * ((i + 1) % 2), 2.2, [0.58, 0.44, 0.28], BOX_NO_BOTTOM, 0.75);
  }
};

function garden(set: MeshSet, props: Props, f: Frame, rng: Rng, look: PlotLook, cypress: boolean): void {
  const h = QUARTER_HALF;
  const green: Rgb = look.served ? [0.66, 0.62, 0.66] : [1.05, 0.6, 0.9];
  up(set.of("grass", f), f, -h, -h, h, h, 0.04, green);
  const pv = set.of("paving", f);
  up(pv, f, -0.9, -h, 0.9, h, 0.07, [0.9, 0.85, 0.74]);
  up(pv, f, -h, -0.9, -0.9, 0.9, 0.07, [0.9, 0.85, 0.74]);
  up(pv, f, 0.9, -0.9, h, 0.9, 0.07, [0.9, 0.85, 0.74]);
  for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as const) {
    if (!look.served && rng.chance(0.6)) continue;
    const x = sx * (h * 0.55 + rng.range(-0.8, 0.8));
    const z = sz * (h * 0.55 + rng.range(-0.8, 0.8));
    if (cypress && rng.chance(0.55)) props.add("cypress", f, x, z, rng.range(0, 6), rng.range(0.5, 0.72));
    else props.add("tree", f, x, z, rng.range(0, 6), rng.range(0.55, 0.85));
  }
}

function basin(set: MeshSet, f: Frame, x: number, z: number, r: number): void {
  set.of("ashlar", f).cylinder(f, x, 0, z, r, r, 0.6, 16, STONE, false);
  set.of("canalwater", f).cylinder(f, x, 0.44, z, r - 0.25, r - 0.25, 0.02, 16, [1, 1, 1], true);
}

const quarterSchool: QuarterBuilder = (set, props, f, rng, look, qi) => {
  const h = QUARTER_HALF;
  const wall = scale(LIME, rng.range(0.94, 1.04));
  if (qi === 0) {
    // The teaching hall: an arcaded front and a plaster dome.
    arcadeWing(set, f, 0, -h + 5.2, 2 * h - 2, 10.4, 5.2, wall, ROOF_TINT, 3.3);
    dome(set, f, 0, -h + 5.6, 3.3, 5.2 + 0.85, "plaster", scale(wall, 1.08), wall, 1.0, 1.2);
    up(set.of("paving", f), f, -h, -h + 10.4, h, h, 0.05, [0.92, 0.87, 0.76]);
  } else if (qi === 1) {
    // Rooms for students round two sides of a court.
    arcadeWing(set, f, 0, -h + 2.4, 2 * h, 4.8, 3.6, wall, ROOF_TINT, 2.9);
    arcadeWing(set, subFrame(f, -h + 2.4, 0, 2.4, Math.PI / 2), 0, 0, 2 * h - 4.8, 4.8, 3.6, scale(wall, 0.98), ROOF_TINT, 2.9);
    up(set.of("paving", f), f, -h + 4.8, -h + 4.8, h, h, 0.05, [0.92, 0.87, 0.76]);
    props.add("tree", f, 3, 3.2, rng.range(0, 6), look.served ? 0.7 : 0.5);
  } else garden(set, props, f, rng, look, qi === 3);
};

const quarterBath: QuarterBuilder = (set, props, f, rng, look, qi) => {
  const h = QUARTER_HALF;
  const wall = scale(LIME, rng.range(0.9, 1.0));
  if (qi === 0) {
    // The hot room: a square hall under one broad dome with four small ones at the corners.
    const s = 12.6;
    wing(set, f, 0, -h + s / 2 + 0.6, s, s, 4.4, wall, ROOF_TINT);
    door(set, f, 0, -h + s + 0.6, 0, wall);
    dome(set, f, 0, -h + s / 2 + 0.6, 4.1, 5.25, "plaster", scale(LIME, 1.1), wall, 0.92, 0.9);
    for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as const) dome(set, f, sx * 4.7, -h + s / 2 + 0.6 + sz * 4.7, 1.15, 5.25, "plaster", scale(LIME, 1.08), wall, 1.0, 0.4);
  } else if (qi === 1) {
    // The warm room and the changing hall.
    wing(set, f, -1.5, -h + 6.6, 11, 13.2, 3.9, wall, ROOF_TINT);
    door(set, f, -1.5, -h + 13.2, 0, wall);
    dome(set, f, -1.5, -h + 3.8, 2.6, 4.75, "plaster", scale(LIME, 1.1), wall, 0.95, 0.6);
    dome(set, f, -1.5, -h + 9.6, 2.6, 4.75, "glaze", scale(TURQUOISE, 1.0), wall, 0.95, 0.6);
  } else if (qi === 2) {
    // The furnace, its chimney, the wood it burns and the cistern.
    const br = set.of("brick", f);
    wing(set, f, -h + 4, -h + 4, 7, 7, 3.4, scale(WALL_TINTS[3]!, 0.95), ROOF_TINT);
    br.cylinder(f, -h + 4, 3.4, -h + 4, 0.8, 0.55, 5.2, 10, [0.85, 0.58, 0.42], true, [0.2, 0.16, 0.14]);
    const wd = set.of("wood", f);
    for (let i = 0; i < 3; i++) wd.box(f, 1.4 + i * 2.5, 0, -h + 2.2, 2.1, 1 + 0.3 * (i % 2), 3, [0.6, 0.46, 0.3], BOX_NO_BOTTOM, 0.75);
    set.of("ashlar", f).box(f, 3, 0, 3.6, 7.5, 1.3, 5.4, STONE, BOX_SIDES, 0.85);
    up(set.of("canalwater", f), f, -0.4, 1.2, 6.4, 6, look.served ? 1.05 : 0.2, [1, 1, 1]);
  } else {
    up(set.of("paving", f), f, -h, -h, h, h, 0.05, [0.92, 0.87, 0.76]);
    basin(set, f, 0, 0, 2.6);
    for (const [x, z] of [[-5.5, -5.5], [5.5, -5.5], [5.5, 5.5], [-5.5, 5.5]] as const) props.add(rng.chance(0.5) ? "palm-a" : "palm-b", f, x, z, rng.range(0, 6), rng.range(0.6, 0.8));
  }
};

const quarterGranary: QuarterBuilder = (set, props, f, rng, _look, qi) => {
  const h = QUARTER_HALF;
  const wall = scale(WALL_TINTS[rng.pick([0, 3, 5])]!, 0.98);
  up(set.of("earth", f), f, -h - 0.6, -h - 0.6, h + 0.6, h + 0.6, 0.03, [0.8, 0.7, 0.54]);
  if (qi < 2) {
    // Two long vaulted stores side by side, their doors on the lane.
    const b = set.of("plaster", f);
    for (const side of [-1, 1]) {
      vault(b, f, side * 4.3, -0.8, 7.2, 2 * h - 2.2, 3.1, scale(wall, side === 1 ? 1 : 0.95));
      door(set, f, side * 4.3, h - 1.9, 0, wall);
    }
  } else if (qi === 2) {
    // The threshing floor, with heaps of grain.
    set.of("paving", f).cylinder(f, 0, 0, 0, 7.2, 7.2, 0.14, 24, [0.9, 0.84, 0.7], true);
    const g = set.of("fabric", f);
    for (const [x, z, r] of [[-2.6, -1.8, 2.1], [2.4, 0.6, 1.7], [-0.4, 3.2, 1.4]] as const) g.revolve(f, x, 0.14, z, (t) => [r * (1 - t), r * 0.72 * t], 12, 3, [1.2, 0.98, 0.5], [1.35, 1.12, 0.6]);
  } else {
    block(set, f, rng, -h + 3.6, -h + 3.2, 6.4, 5.6, 3.1, wall, ROOF_TINT, 0.1);
    const sk = set.of("fabric", f);
    for (let i = 0; i < 9; i++) sk.box(f, 1.2 + (i % 3) * 1.5, Math.floor(i / 6) * 0.55, -h + 1.4 + (Math.floor(i / 3) % 2) * 1.1, 1.2, 0.55, 0.8, [0.9, 0.8, 0.6], 63, 0.8);
    for (let i = 0; i < 8; i++) props.add("jar", f, -h + 1.2 + i * 1.5, h - 1.6, rng.range(0, 6), rng.range(1, 1.3), JAR_TINT);
  }
};

const quarterLibrary: QuarterBuilder = (set, props, f, rng, look, qi) => {
  const h = QUARTER_HALF;
  const wall = scale(WALL_TINTS[0]!, 1.12);
  if (qi === 0) {
    // The great hall: a tall block, a tiled portal on the lane and a turquoise dome.
    const w = 2 * h - 1.4;
    const d = 13.4;
    const cz = -h + d / 2 + 0.4;
    wing(set, f, 0, cz, w, d, 7.6, wall, ROOF_TINT);
    for (const s of [1, 2, 3]) windowsOn(set, f, rng, 0, cz, w, d, 2, s, 0.5, false);
    set.of("plaster", f).cylinder(f, 0, 7.6, cz, 5.3, 5.3, 2.4, 20, scale(wall, 1.04), false);
    set.of("startile", f).cylinder(f, 0, 9.1, cz, 5.36, 5.36, 0.9, 20, [1, 1, 1], false);
    set.of("glaze", f).revolve(f, 0, 10, cz, pointedDome(5.1, 1.2), 22, 11, scale(TURQUOISE, 1.05), scale(TURQUOISE, 1.3));
    set.of("wood", f).cylinder(f, 0, 10 + 5.1 * 1.2 - 0.1, cz, 0.12, 0.02, 1.5, 6, [0.85, 0.66, 0.26], false);
    // The portal: a frame taller than the hall, a deep pointed recess, tile on its face.
    const pf = subFrame(f, 0, 0, cz + d / 2 + 1.1);
    const pw = 8.2;
    const ph = 10.2;
    set.of("plaster", pf).box(pf, 0, -0.6, -0.55, pw, ph + 0.6, 1.1, wall, 2 | 8 | 16, 0.85);
    archPanel(set.of("startile", pf), pf, -pw / 2, 0, pw, ph, 4.6, 4.4, 1.0, [1, 1, 1], scale(COBALT, 1.6), 14);
    face(set.of("wood", pf), pf, -2.3, -1.0, 2.3, -1.0, 0, 7.6, [0.3, 0.22, 0.16]);
    up(set.of("paving", f), f, -h, cz + d / 2, h, h, 0.05, [0.94, 0.9, 0.8]);
  } else if (qi === 1) {
    // A reading court: arcades on two sides, a basin in the middle.
    arcadeWing(set, f, 0, -h + 2.5, 2 * h, 5, 4.2, wall, ROOF_TINT, 3.1);
    arcadeWing(set, subFrame(f, -h + 2.5, 0, 2.5, Math.PI / 2), 0, 0, 2 * h - 5, 5, 4.2, scale(wall, 0.98), ROOF_TINT, 3.1);
    up(set.of("paving", f), f, -h + 5, -h + 5, h, h, 0.05, [0.94, 0.9, 0.8]);
    basin(set, f, 3.2, 3.2, 1.9);
  } else if (qi === 2) {
    // The copyists' house, with two small glazed domes.
    block(set, f, rng, 0, -h + 5, 2 * h - 3, 9, 4.4, wall, ROOF_TINT, 0.5);
    for (const x of [-4, 4]) dome(set, f, x, -h + 5, 1.9, 5.25, "glaze", scale(TURQUOISE, 0.95), wall, 1.05, 0.5);
    up(set.of("paving", f), f, -h, -h + 9.6, h, h, 0.05, [0.94, 0.9, 0.8]);
  } else garden(set, props, f, rng, look, true);
};

const quarterHospital: QuarterBuilder = (set, props, f, rng, look, qi) => {
  const h = QUARTER_HALF;
  const wall = scale(LIME, rng.range(0.96, 1.04));
  if (qi === 0) {
    // The main ward: two storeys behind an arcade.
    arcadeWing(set, f, 0, -h + 4.4, 2 * h - 1, 8.8, 3.6, wall, ROOF_TINT, 3.2);
    const uf = subFrame(f, 0, 3.6, -h + 3.8);
    wing(set, uf, 0, 0, 2 * h - 1, 7.6, 3.2, scale(wall, 1.02), ROOF_TINT);
    for (let s = 0; s < 4; s++) windowsOn(set, uf, rng, 0, 0, 2 * h - 1, 7.6, 1, s, 0.4, false);
    up(set.of("paving", f), f, -h, -h + 8.8, h, h, 0.05, [0.92, 0.87, 0.76]);
  } else if (qi === 1) {
    block(set, f, rng, -h + 4.4, 0, 8.8, 2 * h - 1, 3.7, wall, ROOF_TINT, 0.3);
    dome(set, f, -h + 4.4, 0, 2.5, 4.55, "plaster", scale(LIME, 1.1), wall, 1.0, 0.7);
    props.add("tree", f, 4.5, 3, rng.range(0, 6), look.served ? 0.75 : 0.5);
  } else if (qi === 2) {
    // The herb garden: beds in a grid round a basin.
    up(set.of("grass", f), f, -h, -h, h, h, 0.04, look.served ? [0.66, 0.62, 0.66] : [1.05, 0.6, 0.9]);
    const bed = set.of("field", f);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if ((i === 1 || i === 2) && (j === 1 || j === 2)) continue;
        bed.box(f, -6 + i * 4, 0.04, -6 + j * 4, 3, 0.3, 3, look.served ? [0.55 + 0.25 * latticeHash(i, j, 5), 1.0, 0.5] : [1.0, 0.9, 0.6], BOX_NO_BOTTOM, 0.7);
      }
    }
    basin(set, f, 0, 0, 1.7);
    for (const x of [-h + 0.8, h - 0.8]) props.add("cypress", f, x, -h + 0.8, 0, 0.6);
  } else {
    // The dispensary and kitchen.
    block(set, f, rng, 0, -h + 4.6, 10, 8.4, 3.8, wall, ROOF_TINT, 0.35);
    dome(set, f, 0, -h + 4.6, 2.3, 4.65, "glaze", scale(TURQUOISE, 0.9), wall, 1.0, 0.6);
    for (let i = 0; i < 6; i++) props.add("jar", f, -h + 1.4 + i * 1.4, h - 1.4, rng.range(0, 6), 1.1, JAR_TINT);
  }
};

const quarterEmpty: QuarterBuilder = (set, props, f, rng, look, qi) => {
  const h = QUARTER_HALF;
  // Old walls here and there: the district was larger once.
  if (latticeHash(Math.round(f.x), Math.round(f.z), 31) > 0.78) {
    const b = set.of("ashlar", f);
    const c: Rgb = [0.72, 0.64, 0.5];
    b.box(f, -2, 0, -h + 3, 9, rng.range(0.5, 1.3), 0.7, c, BOX_NO_BOTTOM, 0.8);
    b.box(f, -6.2, 0, -h + 6, 0.7, rng.range(0.4, 1.0), 6, c, BOX_NO_BOTTOM, 0.8);
  }
  const n = look.served ? rng.int(1, 3) : rng.chance(0.3) ? 1 : 0;
  for (let i = 0; i < n; i++) props.add(rng.chance(0.5) ? "palm-a" : "palm-b", f, rng.range(-h, h), rng.range(-h, h), rng.range(0, 6), rng.range(0.55, 0.9));
  void qi;
};

const quarterCaravanserai: QuarterBuilder = (set, props, f, rng, look, qi) => {
  const h = QUARTER_HALF;
  const wall = scale(STONE, rng.range(0.92, 1.0));
  if (qi < 2) {
    // The lodging ranges round the yard, arcaded on the inner side, with a tall arched gate on the lane.
    wing(set, f, 0, -h + 3.2, 2 * h - 1.2, 5.6, 5.2, wall, ROOF_TINT);
    door(set, f, 0, -h + 6.0, 0, wall);
    arcadeWing(set, subFrame(f, 0, -h + 7.4, 0, 0), 0, 0, 2 * h - 3, 2.6, 3.4, scale(wall, 0.97), ROOF_TINT, 2.4);
  } else if (qi === 2) {
    // The yard: paving, a basin for the animals, and bales of goods.
    up(set.of("paving", f), f, -h, -h, h, h, 0.05, [0.9, 0.84, 0.72]);
    basin(set, f, 0, 0, 2.0);
    const g = set.of("fabric", f);
    for (let i = 0; i < 6; i++) g.box(f, -h + 2 + (i % 3) * 1.6, Math.floor(i / 3) * 0.7, h - 2.6, 1.3, 0.7, 1.0, CLOTH_TINTS[i % CLOTH_TINTS.length]!, 63, 0.85);
  } else {
    // Stables under a long roof, open to the yard.
    wing(set, f, 0, h - 3.4, 2 * h - 1.2, 5.2, 3.6, scale(WALL_TINTS[3]!, 0.95), ROOF_TINT);
    props.add("tree", f, -h + 2.4, -h + 2.4, rng.range(0, 6), look.served ? 0.7 : 0.5);
  }
};

const quarterMill: QuarterBuilder = (set, props, f, rng, look, qi) => {
  const h = QUARTER_HALF;
  const wall = scale(LIME, rng.range(0.9, 1.0));
  if (qi === 0 || qi === 1) {
    // The mill house over its race, with the wheel at its side: it turns only when water reaches the plot.
    block(set, f, rng, qi === 0 ? -1 : 1, -h + 5.2, 8.4, 8.6, 5.4, wall, ROOF_TINT, 0.15);
    const w = set.of("wood", f);
    const wx = qi === 0 ? h - 1.6 : -h + 1.6;
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      w.box(f, wx, 2.6 + Math.sin(a) * 2.1 - 0.15, -h + 5.2 + Math.cos(a) * 2.1, 0.5, 0.3, 0.3, [0.5, 0.36, 0.22], 63, 0.8);
    }
    w.cylinder(f, wx, 2.45, -h + 5.2, 0.3, 0.3, 0.3, 8, [0.42, 0.3, 0.18], true);
    up(set.of("canalwater", f), f, wx - 1.2, -h + 0.5, wx + 1.2, h - 0.5, look.served ? 0.35 : 0.02, [1, 1, 1]);
  } else {
    // The yard where sacks of flour wait for the carts.
    up(set.of("earth", f), f, -h, -h, h, h, 0.03, [0.82, 0.72, 0.56]);
    const sk = set.of("fabric", f);
    for (let i = 0; i < 8; i++) sk.box(f, -3 + (i % 4) * 1.5, Math.floor(i / 4) * 0.55, 1 + (i % 2) * 0.2, 1.2, 0.55, 0.8, [0.94, 0.9, 0.8], 63, 0.8);
    props.add("tree", f, 4, -4, rng.range(0, 6), 0.6);
  }
};

const QUARTERS: Record<BuildingType, QuarterBuilder> = {
  house: quarterHouse,
  farm: quarterFarm,
  market: quarterMarket,
  workshop: quarterWorkshop,
  school: quarterSchool,
  bath: quarterBath,
  granary: quarterGranary,
  library: quarterLibrary,
  hospital: quarterHospital,
  caravanserai: quarterCaravanserai,
  mill: quarterMill,
};

/** Ground of a quarter by what stands on it: [material, tint]. */
function quarterGround(look: PlotLook): [MaterialId, Rgb] {
  if (look.type === "farm") return ["earth", [0.62, 0.52, 0.4]];
  if (look.type === null) return look.served ? ["grass", [1.0, 0.62, 0.85]] : ["earth", [0.86, 0.76, 0.6]];
  return ["earth", [0.78, 0.69, 0.55]];
}

// ---- One plot --------------------------------------------------------------------------------------------------------

const QUAY_FRONT = QUAY + 0.4;
const QUAY_FOOT = -3.6;

export function buildPlot(seed: number, plot: number, look: PlotLook): PlotGeometry {
  const [cx, cz] = plotCentre(plot);
  const [gx, gy] = xyOf(plot);
  const set = new MeshSet(1e9);
  const props = new Props();
  const water: WaterRect[] = [];
  const built = look.type !== null;
  const anyCanal = look.canal !== 0;
  const [groundMat, groundTint] = quarterGround(look);
  // Town plots pave their lanes; farms and open ground keep dirt tracks.
  const paved = built && look.type !== "farm";
  const laneMat: MaterialId = paved ? "paving" : "earth";
  const laneTint: Rgb = paved ? [0.9, 0.84, 0.72] : [0.98, 0.88, 0.7];
  const walkMat: MaterialId = paved || look.lined ? "paving" : "earth";
  const wallMat: MaterialId = look.lined ? "ashlar" : "earth";
  const wallTint: Rgb = look.lined ? [0.82, 0.76, 0.62] : [0.46, 0.38, 0.28];
  const bedTint: Rgb = [0.3, 0.27, 0.2];
  const C = CHANNEL_HALF;
  const L = LANE_HALF;
  const H = HALF;

  const rectOf = (f: Frame, x0: number, z0: number, x1: number, z1: number, id: string, y = CANAL_LEVEL): WaterRect => {
    const a = toWorld(f, x0, 0, z0);
    const b = toWorld(f, x1, 0, z1);
    return { id, x0: Math.min(a[0], b[0]), z0: Math.min(a[2], b[2]), x1: Math.max(a[0], b[0]), z1: Math.max(a[2], b[2]), y };
  };

  // The crossing itself.
  const centre = frame(cx, 0, cz);
  if (anyCanal) {
    up(set.of("earth", centre), centre, -C, -C, C, C, CANAL_BED, bedTint);
    water.push(rectOf(centre, -C, -C, C, C, "c"));
  } else up(set.of(laneMat, centre), centre, -C, -C, C, C, 0, laneTint);

  for (const d of [0, 1, 2, 3] as const) {
    const f = frame(cx, 0, cz, DIR_YAW[d]);
    const canal = (look.canal & (1 << d)) !== 0;
    // The quarter clockwise of this arm, and the corner of the crossing next to it.
    up(set.of(groundMat, f), f, L, L, H, H, 0, scale(groundTint, 0.94 + 0.12 * latticeHash(plot, d, seed)));
    up(set.of(walkMat, f), f, C, C, L, L, 0, laneTint);
    if (canal) {
      const walk = set.of(walkMat, f);
      up(walk, f, L, C, H, L, 0, laneTint);
      up(walk, f, L, -L, H, -C, 0, laneTint);
      const w = set.of(wallMat, f);
      face(w, f, H, C, C, C, CANAL_BED, 0, scale(wallTint, 0.7), wallTint);
      face(w, f, C, -C, H, -C, CANAL_BED, 0, scale(wallTint, 0.7), wallTint);
      up(set.of("earth", f), f, C, -C, H, C, CANAL_BED, bedTint);
      water.push(rectOf(f, C, -C, H, C, String(d)));
      // A foot-bridge over the channel, so the lane on either side stays one street.
      if (built) {
        const br = set.of(look.lined ? "ashlar" : "wood", f);
        const tint: Rgb = look.lined ? [0.86, 0.8, 0.66] : [0.62, 0.5, 0.36];
        br.box(f, H * 0.56, 0.02, 0, 2.2, 0.22, 2 * C + 0.8, tint, 63);
        for (const s of [-1, 1]) br.box(f, H * 0.56 + s * 1.0, 0.24, 0, 0.14, 0.55, 2 * C + 0.8, scale(tint, 0.9), BOX_NO_BOTTOM);
      }
    } else {
      up(set.of(laneMat, f), f, L, -L, H, L, 0, laneTint);
      up(set.of(laneMat, f), f, C, -C, L, C, 0, laneTint);
      if (anyCanal) face(set.of(wallMat, f), f, C, -C, C, C, CANAL_BED, 0, scale(wallTint, 0.7), wallTint);
    }
    // What stands in the quarter.
    const qf = subFrame(f, QUARTER_CENTRE, 0, QUARTER_CENTRE, Math.PI);
    const rng = new Rng(hash32(`plot:${plot}:${d}:${look.type ?? "empty"}`, seed >>> 0));
    (look.type ? QUARTERS[look.type] : quarterEmpty)(set, props, qf, rng, look, d);
  }

  // An endowment is marked where everyone passes: an inscribed stone and a tall banner at the corner of the crossing.
  if (look.endowed) {
    const corner = frame(cx + L + 1.3, 0, cz - L - 1.3);
    set.of("ashlar", corner).box(corner, 0, 0, 0, 1.5, 2.1, 0.45, [0.9, 0.84, 0.7], BOX_NO_BOTTOM, 0.85);
    set.of("startile", corner).box(corner, 0, 0.5, 0.24, 1.1, 1.3, 0.04, [1, 1, 1], 1 | 2 | 8 | 16);
    set.of("wood", corner).cylinder(corner, 1.5, 0, 0, 0.09, 0.06, 8.5, 6, [0.5, 0.4, 0.3], true);
    const cloth = set.of("fabric", corner);
    face(cloth, corner, 1.6, 0, 3.4, 0, 5.2, 8.3, scale(TURQUOISE, 1.5));
    face(cloth, corner, 3.4, 0, 1.6, 0, 5.2, 8.3, scale(TURQUOISE, 1.1));
  }

  // Row 0 carries its stretch of the quay, and the intake where a canal leaves the river.
  let wheel: PlotGeometry["wheel"] = null;
  if (gy === 0) {
    const x0 = cx - H;
    const x1 = cx + H;
    const pave = set.of("paving", WORLD);
    const stone = set.of("ashlar", WORLD);
    const qTint: Rgb = [0.86, 0.8, 0.68];
    const sTint: Rgb = [0.8, 0.73, 0.6];
    const intake = (look.canal & 4) !== 0;
    if (intake) {
      up(pave, WORLD, x0, 0, cx - C, QUAY_FRONT, 0, qTint);
      up(pave, WORLD, cx + C, 0, x1, QUAY_FRONT, 0, qTint);
      face(stone, WORLD, x0, QUAY_FRONT, cx - C, QUAY_FRONT, QUAY_FOOT, 0, scale(sTint, 0.6), sTint);
      face(stone, WORLD, cx + C, QUAY_FRONT, x1, QUAY_FRONT, QUAY_FOOT, 0, scale(sTint, 0.6), sTint);
      face(stone, WORLD, cx - C, QUAY_FRONT, cx - C, 0, QUAY_FOOT, 0, scale(sTint, 0.6), sTint);
      face(stone, WORLD, cx + C, 0, cx + C, QUAY_FRONT, QUAY_FOOT, 0, scale(sTint, 0.6), sTint);
      up(set.of("earth", WORLD), WORLD, cx - C, 0, cx + C, QUAY_FRONT, CANAL_BED, bedTint);
      water.push({ id: "q", x0: cx - C, z0: 0, x1: cx + C, z1: QUAY_FRONT + 0.3, y: CANAL_LEVEL });
      // The sluice: a timber frame and a raised gate across the mouth.
      const wd = set.of("wood", WORLD);
      const wood: Rgb = [0.5, 0.4, 0.3];
      for (const s of [-1, 1]) wd.box(WORLD, cx + s * (C + 0.25), 0, QUAY - 1.2, 0.4, 3.2, 0.4, wood, BOX_NO_BOTTOM);
      wd.box(WORLD, cx, 3.0, QUAY - 1.2, 2 * C + 1.3, 0.36, 0.5, wood, 63);
      wd.box(WORLD, cx, 1.5, QUAY - 1.2, 2 * C, 1.3, 0.14, scale(wood, 1.15), 63);
      if (look.wheel) {
        // The water wheel stands in the river beside the mouth, on two stone piers, and tips into a trough.
        const wx = cx + C + 6.2;
        const wz = QUAY_FRONT + 1.5;
        const r = 4.6;
        wheel = { x: wx, y: RIVER_LEVEL + r - 0.9, z: wz, radius: r };
        for (const s of [-1, 1]) stone.box(WORLD, wx, QUAY_FOOT, wz + s * 1.3, 2.2, RIVER_LEVEL + r - 0.9 - QUAY_FOOT + 0.3, 0.8, sTint, BOX_NO_BOTTOM, 0.7);
        stone.box(WORLD, cx + C + 2.4, 2.2, QUAY - 0.2, 6.4, 0.5, 1.1, sTint, 63);
        for (const px of [cx + C + 0.9, cx + C + 4.6]) stone.box(WORLD, px, 0, QUAY - 0.2, 0.8, 2.2, 0.9, sTint, BOX_SIDES, 0.8);
      }
    } else {
      up(pave, WORLD, x0, 0, x1, QUAY_FRONT, 0, qTint);
      face(stone, WORLD, x0, QUAY_FRONT, x1, QUAY_FRONT, QUAY_FOOT, 0, scale(sTint, 0.6), sTint);
    }
    if (gx === 0) face(stone, WORLD, x0, 0, x0, QUAY_FRONT, QUAY_FOOT, 0, scale(sTint, 0.6), sTint);
    if (gx === GRID_W - 1) face(stone, WORLD, x1, QUAY_FRONT, x1, 0, QUAY_FOOT, 0, scale(sTint, 0.6), sTint);
    // Mooring posts.
    const wd = set.of("wood", WORLD);
    for (let i = 0; i < 4; i++) {
      const px = x0 + 5.5 + i * 11;
      if (intake && Math.abs(px - cx) < C + 1.5) continue;
      wd.cylinder(WORLD, px, 0, QUAY - 0.5, 0.2, 0.17, 0.9, 7, [0.42, 0.33, 0.24], true);
    }
  }

  const chunks = set.chunks().map((c) => ({ material: c.material as SceneMaterialId, mesh: c.mesh }));
  let triangles = 0;
  for (const c of chunks) triangles += c.mesh.indices.length / 3;
  return { chunks, props: props.list, water, wheel, triangles };
}

// ---- Figures on the lanes -------------------------------------------------------------------------------------------
// They show how many people a plot holds; they are not agents and nothing in the rules depends on them.

/** Where figure `i` of a plot is at a moment: world x, z, heading (radians, for a body whose front is local +Z) and size. */
export function walkerPose(seed: number, plot: number, i: number, time: number): [number, number, number, number] {
  const [cx, cz] = plotCentre(plot);
  const h1 = latticeHash(plot, i, seed);
  const h2 = latticeHash(i, plot, seed + 17);
  const dir = Math.floor(h1 * 4) as Dir;
  const speed = 0.9 + 0.7 * h2;
  const lo = LANE_HALF + 0.4;
  const span = HALF - 0.6 - lo;
  const t = ((h1 * 97 + time * speed) / span) % 2;
  const out = t < 1;
  const r = lo + span * (out ? t : 2 - t);
  // Keep to the right of the lane, clear of a canal channel down its middle.
  const side = (out ? 1 : -1) * (CHANNEL_HALF + 0.5);
  const [dx, dz] = DIR_STEP[dir]!;
  const x = cx + dx * r + -dz * side;
  const z = cz + dz * r + dx * side;
  const heading = Math.atan2(out ? dx : -dx, out ? dz : -dz);
  return [x, z, heading, 0.92 + 0.16 * h2];
}

/** A robe colour for a figure, stable for the life of the figure. */
export const walkerTint = (seed: number, plot: number, i: number): Rgb => ROBE_TINTS[Math.floor(latticeHash(plot * 7 + 3, i * 13 + 1, seed) * ROBE_TINTS.length)]!;

// ---- The land around the district ----------------------------------------------------------------------------------------

export interface Environment {
  chunks: Array<{ material: SceneMaterialId; mesh: MeshData }>;
  props: PropInstance[];
  /** Sailing boats: starting x, distance from the north bank, speed in metres a second (negative sails west). */
  boats: Array<{ x0: number; z: number; speed: number; phase: number }>;
  halfWidth: number;
}

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
const SOUTH_BANK = QUAY + RIVER_WIDTH;
const ENV_CELL = PLOT / 4;

/** Ground height outside the district. Inside it the ground is flat at 0 and is the plots' own geometry. */
export function envHeight(x: number, z: number, seed: number): number {
  const insideX = x > BOARD.x0 + 0.01 && x < BOARD.x1 - 0.01;
  if (insideX && z > BOARD.z0 + 0.01 && z < QUAY - 0.01) return -1.9;
  let h = 0;
  const bankN = QUAY - 5;
  const bankS = SOUTH_BANK + 5;
  if (z > bankN && z < bankS) h = -3.4 * smooth(0, 13, Math.min(z - bankN, bankS - z));
  else {
    const away = Math.max(BOARD.x0 - x, x - BOARD.x1, BOARD.z0 - z, 0) + Math.max(z - bankS, 0);
    h += (fbm(x / 170 + 9, z / 170 + 3, seed, 4) - 0.45) * 7 * smooth(30, 220, away);
    // Low hills to the north and far to the south; the river plain stays open east and west.
    const north = smooth(330, 900, BOARD.z0 - z);
    const south = smooth(260, 620, z - bankS);
    h += (north + south) * (18 + 70 * fbm(x / 420 + 1, z / 420 + 7, seed + 5, 4));
    if (z >= bankS) h += 0.6;
  }
  return h;
}

export function buildEnvironment(seed: number): Environment {
  const rng = new Rng(hash32("environment", seed >>> 0));
  const halfWidth = 1210;
  const zMin = -1210;
  const zMax = 770;
  const nx = Math.round((2 * halfWidth) / ENV_CELL);
  const nz = Math.round((zMax - zMin) / ENV_CELL);
  const b = new MeshBuilder();
  const heights = new Float32Array((nx + 1) * (nz + 1));
  const at = (i: number, j: number) => heights[j * (nx + 1) + i]!;
  for (let j = 0; j <= nz; j++) for (let i = 0; i <= nx; i++) heights[j * (nx + 1) + i] = envHeight(-halfWidth + i * ENV_CELL, zMin + j * ENV_CELL, seed);
  for (let j = 0; j <= nz; j++) {
    for (let i = 0; i <= nx; i++) {
      const x = -halfWidth + i * ENV_CELL;
      const z = zMin + j * ENV_CELL;
      const h = at(i, j);
      const hx = at(Math.min(nx, i + 1), j) - at(Math.max(0, i - 1), j);
      const hz = at(i, Math.min(nz, j + 1)) - at(i, Math.max(0, j - 1));
      const nl = Math.hypot(hx, 2 * ENV_CELL, hz);
      // Colour: tilled plain near the water, a patchwork of fields and fallow; pale dry ground and rock beyond.
      const nearRiver = 1 - smooth(120, 520, Math.min(Math.abs(z - QUAY), Math.abs(z - SOUTH_BANK)));
      const patch = latticeHash(Math.floor((x + 5000) / 55), Math.floor((z + 5000) / 33), seed + 3);
      const green: Rgb = patch > 0.72 ? [0.5, 0.74, 0.34] : patch > 0.45 ? [0.72, 0.84, 0.42] : patch > 0.25 ? [1.0, 0.86, 0.52] : [0.84, 0.72, 0.5];
      const dry: Rgb = [1.04, 0.94, 0.76];
      const k = nearRiver * (h > -0.3 ? 1 : 0) * (0.75 + 0.25 * fbm(x / 60, z / 60, seed + 11, 3));
      let c: Rgb = [dry[0] + (green[0] - dry[0]) * k, dry[1] + (green[1] - dry[1]) * k, dry[2] + (green[2] - dry[2]) * k];
      if (h < -0.4) c = [0.42, 0.4, 0.3];
      const rock = smooth(14, 60, h);
      c = [c[0] + (1.06 - c[0]) * rock, c[1] + (0.98 - c[1]) * rock, c[2] + (0.84 - c[2]) * rock];
      b.vertex([x, h, z], [-hx / nl, (2 * ENV_CELL) / nl, -hz / nl], x, z, c);
    }
  }
  for (let j = 0; j < nz; j++) {
    for (let i = 0; i < nx; i++) {
      const a = j * (nx + 1) + i;
      b.tri(a, a + nx + 1, a + nx + 2);
      b.tri(a, a + nx + 2, a + 1);
    }
  }
  const waterB = new MeshBuilder();
  up(waterB, WORLD, -halfWidth, QUAY - 9, halfWidth, SOUTH_BANK + 9, RIVER_LEVEL, [1, 1, 1]);

  // Palms and trees on the plain, thickest along both banks.
  const props: PropInstance[] = [];
  for (let i = 0; i < 2600 && props.length < 900; i++) {
    const x = rng.range(-760, 760);
    const z = rng.range(-560, 420);
    const insideBoard = x > BOARD.x0 - 5 && x < BOARD.x1 + 5 && z > BOARD.z0 - 5 && z < QUAY + 1;
    if (insideBoard) continue;
    const h = envHeight(x, z, seed);
    if (h < -0.15 || h > 9) continue;
    const bank = Math.min(Math.abs(z - (QUAY - 5)), Math.abs(z - (SOUTH_BANK + 5)));
    const density = 0.06 + 0.9 * (1 - smooth(4, 120, bank)) + 0.25 * (fbm(x / 90, z / 90, seed + 21, 3) > 0.56 ? 1 : 0);
    if (!rng.chance(Math.min(1, density))) continue;
    const kind: PropKind = rng.chance(0.7) ? (rng.chance(0.5) ? "palm-a" : "palm-b") : "tree";
    props.push({ kind, x, y: h, z, yaw: rng.range(0, 6.28), scale: rng.range(0.7, 1.15), color: [1, 1, 1] });
  }
  const boats = [0, 1, 2].map((i) => ({ x0: rng.range(-500, 500), z: QUAY + 34 + i * 30 + rng.range(-6, 6), speed: (i % 2 === 0 ? 1 : -1) * rng.range(2.2, 3.4), phase: rng.range(0, 6) }));
  return { chunks: [{ material: "terrain", mesh: b.build() }, { material: "water", mesh: waterB.build() }], props, boats, halfWidth };
}
