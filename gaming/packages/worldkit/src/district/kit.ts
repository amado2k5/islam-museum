// The building kit: houses, arcades, domes, walls and props, written as functions that add geometry to a MeshSet.
// Shapes are original and generic to the region and period family (flat roofs with parapets, inward-looking
// courtyard houses, pointed arches, brick and plaster, glazed domes). They are a visual vocabulary, not a
// reconstruction of any named building.
import type { Rng } from "@im/kernel/prng";
import { BOX_NO_BOTTOM, BOX_SIDES, MeshBuilder, frame, subFrame, toWorld, type Frame, type MeshData, type Rgb, type Vec3 } from "../mesh";

export type MaterialId = "plaster" | "brick" | "ashlar" | "roof" | "glaze" | "startile" | "wood" | "lattice" | "litwindow" | "fabric" | "paving" | "earth" | "field" | "grass" | "canalwater";

/** Geometry is collected per material and per square map cell, so a renderer can cull and stream by cell. */
export class MeshSet {
  private readonly builders = new Map<string, { material: MaterialId; cx: number; cz: number; b: MeshBuilder }>();
  constructor(readonly cellSize: number) {}

  at(material: MaterialId, x: number, z: number): MeshBuilder {
    const cx = Math.floor(x / this.cellSize);
    const cz = Math.floor(z / this.cellSize);
    const key = `${material}:${cx}:${cz}`;
    let e = this.builders.get(key);
    if (!e) {
      e = { material, cx, cz, b: new MeshBuilder() };
      this.builders.set(key, e);
    }
    return e.b;
  }

  /** Builder for the cell that contains a frame's origin. */
  of(material: MaterialId, f: Frame): MeshBuilder {
    return this.at(material, f.x, f.z);
  }

  chunks(): Array<{ material: MaterialId; cell: [number, number]; mesh: MeshData }> {
    const out: Array<{ material: MaterialId; cell: [number, number]; mesh: MeshData }> = [];
    for (const e of this.builders.values()) if (e.b.vertexCount > 0) out.push({ material: e.material, cell: [e.cx, e.cz], mesh: e.b.build() });
    out.sort((p, q) => (p.material < q.material ? -1 : p.material > q.material ? 1 : p.cell[0] - q.cell[0] || p.cell[1] - q.cell[1]));
    return out;
  }
}

// ---- Palettes (linear-light multipliers on a near-white texture) ------------------------------------------------

export const WALL_TINTS: Rgb[] = [
  [0.68, 0.56, 0.38], // warm limestone
  [0.62, 0.46, 0.27], // ochre plaster
  [0.8, 0.72, 0.58], // lime wash
  [0.54, 0.4, 0.25], // mud-brick tan
  [0.7, 0.55, 0.36],
  [0.6, 0.5, 0.36],
  [0.76, 0.62, 0.42],
  [0.72, 0.5, 0.3], // deeper ochre
];
export const CLOTH_TINTS: Rgb[] = [
  [0.07, 0.11, 0.36], // indigo
  [0.52, 0.08, 0.06], // madder red
  [0.78, 0.5, 0.07], // saffron
  [0.06, 0.34, 0.32], // teal
  [0.86, 0.8, 0.64], // undyed
  [0.16, 0.34, 0.14], // green
  [0.5, 0.26, 0.08], // rust
];
export const ROBE_TINTS: Rgb[] = [
  [0.85, 0.82, 0.74],
  [0.7, 0.66, 0.56],
  [0.1, 0.14, 0.34],
  [0.42, 0.1, 0.08],
  [0.2, 0.3, 0.2],
  [0.55, 0.42, 0.24],
  [0.3, 0.24, 0.2],
  [0.62, 0.5, 0.16],
  [0.9, 0.88, 0.84],
];
export const TURQUOISE: Rgb = [0.1, 0.62, 0.62];
export const COBALT: Rgb = [0.08, 0.2, 0.55];
const WOOD_TINT: Rgb = [0.75, 0.62, 0.48];
const DARK_WOOD: Rgb = [0.5, 0.4, 0.3];

const scale = (c: Rgb, k: number): Rgb => [c[0] * k, c[1] * k, c[2] * k];

// ---- Profiles ----------------------------------------------------------------------------------------------------

/** A pointed (two-centred) dome: radius and height along the shell from springing to apex. `rise` is height / radius. */
export const pointedDome = (r: number, rise = 1.15) => (t: number): readonly [number, number] => {
  const a = t * (Math.PI / 2);
  // Blend a hemisphere with a steeper cone-like top to get a gentle point.
  const rr = r * Math.pow(Math.cos(a), 0.86);
  const yy = r * rise * Math.pow(Math.sin(a), 0.92);
  return [rr, yy];
};

/** Height of a pointed-arch opening above its springing line at horizontal offset x from its centre (half-span s). */
export function pointedArchRise(x: number, s: number, pointiness = 1.25): number {
  const k = Math.min(1, Math.abs(x) / s);
  // Two circular arcs whose centres sit beyond the opposite jamb.
  const R = s * pointiness;
  const c = R - s; // centre offset from the arch centre line, on the far side
  const yy = Math.sqrt(Math.max(0, R * R - (k * s + c) ** 2));
  return yy;
}

// ---- Walls with openings -----------------------------------------------------------------------------------------

/**
 * A wall panel in the local XY plane of frame `f` (facing local +Z), `width` wide and `height` tall, pierced by one
 * pointed-arch opening centred in it. Emits the face around the opening, and the reveal (the inside of the arch)
 * `depth` metres deep. Used for arcades, gateways, bridge spans and portal recesses.
 */
export function archPanel(b: MeshBuilder, f: Frame, x0: number, y0: number, width: number, height: number, span: number, spring: number, depth: number, color: Rgb, revealColor: Rgb = color, cols = 12, riseScale = 1): void {
  const s = span / 2;
  const cx = x0 + width / 2;
  const left = cx - s;
  const right = cx + s;
  const top = y0 + height;
  const P = (x: number, y: number, z = 0): Vec3 => toWorld(f, x, y, z);
  // Piers either side of the opening.
  if (left - x0 > 1e-3) b.quad(P(x0, y0), P(left, y0), P(left, top), P(x0, top), color, x0, y0);
  if (x0 + width - right > 1e-3) b.quad(P(right, y0), P(x0 + width, y0), P(x0 + width, top), P(right, top), color, right, y0);
  // The wall above the opening, in vertical strips that follow the arch.
  let prevX = left;
  let prevY = y0 + spring + riseScale * pointedArchRise(-s, s);
  for (let i = 1; i <= cols; i++) {
    const x = left + (span * i) / cols;
    const y = y0 + spring + riseScale * pointedArchRise(x - cx, s);
    b.quad(P(prevX, prevY), P(x, y), P(x, top), P(prevX, top), color, prevX, prevY);
    if (depth > 0) b.quad(P(prevX, prevY, -depth), P(x, y, -depth), P(x, y), P(prevX, prevY), revealColor, prevX, 0);
    prevX = x;
    prevY = y;
  }
  if (depth > 0) {
    // Jamb reveals.
    b.quad(P(left, y0), P(left, y0, -depth), P(left, y0 + spring, -depth), P(left, y0 + spring), revealColor, 0, y0);
    b.quad(P(right, y0, -depth), P(right, y0), P(right, y0 + spring), P(right, y0 + spring, -depth), revealColor, 0, y0);
  }
}

/** A row of identical arches along local X: an arcade front. */
export function arcade(b: MeshBuilder, f: Frame, x0: number, y0: number, length: number, height: number, bay: number, depth: number, color: Rgb, revealColor: Rgb, spring = height * 0.48, riseScale = 1): void {
  const n = Math.max(1, Math.round(length / bay));
  const w = length / n;
  for (let i = 0; i < n; i++) archPanel(b, f, x0 + i * w, y0, w, height, w * 0.72, spring, depth, color, revealColor, 8, riseScale);
}

/** A flat roof with a parapet: outer walls rise `ph` above the roof, with inner faces and a rim. Local box footprint. */
export function parapetRoof(set: MeshSet, f: Frame, cx: number, cz: number, w: number, d: number, y: number, ph: number, wall: Rgb, roofTint: Rgb): void {
  const t = 0.32;
  const roof = set.of("roof", f);
  const pl = set.of("plaster", f);
  const hx = w / 2 - t;
  const hz = d / 2 - t;
  const P = (x: number, yy: number, z: number): Vec3 => toWorld(f, cx + x, yy, cz + z);
  roof.quad(P(-hx, y, hz), P(hx, y, hz), P(hx, y, -hz), P(-hx, y, -hz), roofTint, cx - hx, cz - hz);
  const inner = scale(wall, 0.82);
  // Inner parapet faces (they look inward).
  pl.quad(P(hx, y, hz), P(-hx, y, hz), P(-hx, y + ph, hz), P(hx, y + ph, hz), inner, 0, y);
  pl.quad(P(hx, y, -hz), P(hx, y, hz), P(hx, y + ph, hz), P(hx, y + ph, -hz), inner, 0, y);
  pl.quad(P(-hx, y, -hz), P(hx, y, -hz), P(hx, y + ph, -hz), P(-hx, y + ph, -hz), inner, 0, y);
  pl.quad(P(-hx, y, hz), P(-hx, y, -hz), P(-hx, y + ph, -hz), P(-hx, y + ph, hz), inner, 0, y);
  // Rim.
  const ox = w / 2;
  const oz = d / 2;
  const top = y + ph;
  const rim = scale(wall, 1.04);
  pl.quad(P(-ox, top, oz), P(ox, top, oz), P(hx, top, hz), P(-hx, top, hz), rim);
  pl.quad(P(ox, top, oz), P(ox, top, -oz), P(hx, top, -hz), P(hx, top, hz), rim);
  pl.quad(P(ox, top, -oz), P(-ox, top, -oz), P(-hx, top, -hz), P(hx, top, -hz), rim);
  pl.quad(P(-ox, top, -oz), P(-ox, top, oz), P(-hx, top, hz), P(-hx, top, -hz), rim);
}

/** One rectangular wing: walls from below ground to parapet top, plus its flat roof. */
export function wing(set: MeshSet, f: Frame, cx: number, cz: number, w: number, d: number, h: number, wall: Rgb, roofTint: Rgb, faces = BOX_SIDES): void {
  const ph = 0.85;
  set.of("plaster", f).box(f, cx, -1.2, cz, w, h + ph + 1.2, d, wall, faces, 0.8);
  parapetRoof(set, f, cx, cz, w, d, h, ph, wall, roofTint);
}

/** Windows along one side of a wing. `side`: 0 south(+Z), 1 east(+X), 2 north(-Z), 3 west(-X). */
export function windowsOn(set: MeshSet, f: Frame, rng: Rng, cx: number, cz: number, w: number, d: number, storeys: number, side: number, lit: number, privacy: boolean): void {
  const along = side % 2 === 0 ? w : d;
  const n = Math.floor((along - 1.6) / 3.1);
  if (n <= 0) return;
  const yaw = [0, Math.PI / 2, Math.PI, -Math.PI / 2][side]!;
  const off = side % 2 === 0 ? d / 2 : w / 2;
  // A frame on the wall face, looking outward along its local +Z.
  const wf = subFrame(f, cx + (side === 1 ? off : side === 3 ? -off : 0), 0, cz + (side === 0 ? off : side === 2 ? -off : 0), yaw);
  const step = along / n;
  for (let s = 0; s < storeys; s++) {
    const ground = s === 0;
    for (let i = 0; i < n; i++) {
      if (rng.chance(ground && privacy ? 0.65 : 0.18)) continue;
      const x = -along / 2 + step * (i + 0.5) + rng.range(-0.25, 0.25);
      const ww = ground ? 0.7 : rng.range(0.9, 1.25);
      const wh = ground ? 0.8 : rng.range(1.3, 1.7);
      const y = s * 3.3 + (ground ? 2.0 : 1.05);
      const bay = !ground && rng.chance(0.16);
      const mat: MaterialId = rng.chance(lit) ? "litwindow" : "lattice";
      if (bay) {
        // A projecting screened bay on brackets.
        set.of(mat, wf).box(wf, x, y - 0.15, 0.36, ww + 0.5, wh + 0.4, 0.72, WOOD_TINT, BOX_NO_BOTTOM | 32);
        set.of("wood", wf).box(wf, x, y + wh + 0.25, 0.4, ww + 0.7, 0.1, 0.9, DARK_WOOD, 63);
      } else {
        set.of(mat, wf).box(wf, x, y, 0.05, ww, wh, 0.1, WOOD_TINT, 1 | 2 | 8 | 16);
        set.of("wood", wf).box(wf, x, y - 0.08, 0.08, ww + 0.2, 0.08, 0.16, DARK_WOOD, 1 | 2 | 8 | 16);
      }
    }
  }
}

export function door(set: MeshSet, f: Frame, x: number, z: number, yaw: number, wall: Rgb): void {
  const df = subFrame(f, x, 0, z, yaw);
  set.of("wood", df).box(df, 0, 0, 0.05, 1.15, 2.15, 0.1, DARK_WOOD, 1 | 2 | 8 | 16);
  const st = scale(wall, 1.08);
  const a = set.of("ashlar", df);
  a.box(df, -0.75, 0, 0.09, 0.3, 2.5, 0.18, st, 1 | 2 | 8 | 16);
  a.box(df, 0.75, 0, 0.09, 0.3, 2.5, 0.18, st, 1 | 2 | 8 | 16);
  a.box(df, 0, 2.2, 0.09, 1.8, 0.34, 0.2, st, 1 | 2 | 8 | 16 | 32);
}

export interface HouseResult {
  /** Courtyard centre in world space when the house has one (a tree may be planted there). */
  court?: [number, number];
  height: number;
}

/** A dwelling on a lot `w` by `d` metres, its front on local +Z. */
export function house(set: MeshSet, f: Frame, w: number, d: number, rng: Rng, lit: number): HouseResult {
  const wall = scale(rng.pick(WALL_TINTS), rng.range(0.86, 1.06));
  const roofTint = scale([0.74, 0.66, 0.52], rng.range(0.82, 1.06));
  const storeys = rng.weighted([1, 2, 3], [0.28, 0.56, 0.16]);
  const h = storeys * 3.3 + rng.range(0, 0.5);
  let court: [number, number] | undefined;

  if (w > 11.5 && d > 11.5 && rng.chance(0.62)) {
    // Courtyard house: four wings around an open court.
    const t = Math.min(4.6, Math.min(w, d) * 0.3);
    const hFront = h - (storeys > 1 && rng.chance(0.4) ? 3.3 : 0);
    const hBack = h;
    const hSide = h - (storeys > 1 && rng.chance(0.3) ? 3.3 : 0);
    wing(set, f, 0, d / 2 - t / 2, w, t, hFront, wall, roofTint);
    wing(set, f, 0, -d / 2 + t / 2, w, t, hBack, wall, roofTint);
    wing(set, f, -w / 2 + t / 2, 0, t, d - 2 * t, hSide, wall, roofTint);
    wing(set, f, w / 2 - t / 2, 0, t, d - 2 * t, hSide, wall, roofTint);
    const cw = w - 2 * t;
    const cd = d - 2 * t;
    const P = (x: number, z: number): Vec3 => toWorld(f, x, 0.06, z);
    set.of("paving", f).quad(P(-cw / 2, cd / 2), P(cw / 2, cd / 2), P(cw / 2, -cd / 2), P(-cw / 2, -cd / 2), [0.85, 0.8, 0.7]);
    const c = toWorld(f, 0, 0, 0);
    court = [c[0], c[2]];
    windowsOn(set, f, rng, 0, d / 2 - t / 2, w, t, Math.round(hFront / 3.3), 0, lit, true);
    windowsOn(set, f, rng, 0, -d / 2 + t / 2, w, t, Math.round(hBack / 3.3), 2, lit, true);
    windowsOn(set, f, rng, -w / 2 + t / 2, 0, t, d - 2 * t, Math.round(hSide / 3.3), 3, lit, true);
    windowsOn(set, f, rng, w / 2 - t / 2, 0, t, d - 2 * t, Math.round(hSide / 3.3), 1, lit, true);
    door(set, f, rng.range(-w / 4, w / 4), d / 2, 0, wall);
    if (rng.chance(0.3)) smallDome(set, f, rng.pick([-1, 1]) * (w / 2 - t / 2), -d / 2 + t / 2, t * 0.42, hBack + 0.85, wall, rng);
  } else {
    // A block, sometimes with a lower side wing.
    const lower = w > 9 && rng.chance(0.45);
    const mw = lower ? w * rng.range(0.55, 0.7) : w;
    const mx = lower ? (rng.chance(0.5) ? -1 : 1) * (w - mw) * 0.5 : 0;
    wing(set, f, mx, 0, mw, d, h, wall, roofTint);
    for (let s = 0; s < 4; s++) windowsOn(set, f, rng, mx, 0, mw, d, storeys, s, lit, true);
    if (lower) {
      const lw = w - mw;
      const lx = mx > 0 ? -w / 2 + lw / 2 : w / 2 - lw / 2;
      const ld = d * rng.range(0.6, 1);
      wing(set, f, lx, d / 2 - ld / 2, lw, ld, 3.3, scale(wall, 0.97), roofTint);
      windowsOn(set, f, rng, lx, d / 2 - ld / 2, lw, ld, 1, 0, lit, true);
    }
    door(set, f, mx + rng.range(-mw / 4, mw / 4), d / 2, 0, wall);
    if (storeys < 3 && rng.chance(0.3)) {
      // A roof room.
      const rw = mw * rng.range(0.35, 0.55);
      const rd = d * rng.range(0.35, 0.55);
      const rf = subFrame(f, mx + rng.range(-1, 1) * (mw - rw) * 0.3, h, rng.range(-1, 1) * (d - rd) * 0.3);
      wing(set, rf, 0, 0, rw, rd, 2.8, scale(wall, 1.03), roofTint);
      windowsOn(set, rf, rng, 0, 0, rw, rd, 1, rng.int(0, 3), lit, false);
    } else if (rng.chance(0.14)) {
      smallDome(set, f, mx, 0, Math.min(mw, d) * 0.3, h + 0.85, wall, rng);
    }
    if (rng.chance(0.22)) roofShade(set, subFrame(f, mx + rng.range(-1, 1) * mw * 0.15, h + 0.02, rng.range(-1, 1) * d * 0.15, rng.range(0, 0.4)), rng);
  }
  return { court, height: h };
}

/** A small dome on a low drum, plastered or glazed. */
export function smallDome(set: MeshSet, f: Frame, x: number, z: number, r: number, y: number, wall: Rgb, rng: Rng): void {
  const glazed = rng.chance(0.3);
  const drum = set.of("plaster", f);
  drum.cylinder(f, x, y - 0.9, z, r * 1.04, r * 1.04, 1.5, 12, wall, false);
  const shell = set.of(glazed ? "glaze" : "plaster", f);
  const tint: Rgb = glazed ? scale(TURQUOISE, rng.range(0.85, 1.15)) : scale(wall, 1.06);
  shell.revolve(f, x, y + 0.6, z, pointedDome(r, 1.05), 14, 7, tint);
}

/** A light roof shelter: four posts and a cloth. */
export function roofShade(set: MeshSet, f: Frame, rng: Rng): void {
  const w = rng.range(2.4, 3.6);
  const d = rng.range(2, 3);
  const h = 2.2;
  const wd = set.of("wood", f);
  for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as const) wd.box(f, (sx * w) / 2, 0, (sz * d) / 2, 0.1, h, 0.1, DARK_WOOD, BOX_SIDES);
  const c = rng.pick(CLOTH_TINTS);
  const fb = set.of("fabric", f);
  const P = (x: number, y: number, z: number): Vec3 => toWorld(f, x, y, z);
  fb.quad(P(-w / 2, h, d / 2), P(w / 2, h, d / 2), P(w / 2, h + 0.25, -d / 2), P(-w / 2, h + 0.25, -d / 2), c);
  fb.quad(P(-w / 2, h + 0.25, -d / 2), P(w / 2, h + 0.25, -d / 2), P(w / 2, h, d / 2), P(-w / 2, h, d / 2), scale(c, 0.7));
}

// ---- Instanced props (each is one small mesh, drawn many times) ----------------------------------------------------

const prop = (build: (b: MeshBuilder, f: Frame) => void): MeshData => {
  const b = new MeshBuilder();
  build(b, frame(0, 0, 0));
  return b.build();
};

/** Date palm: a ringed trunk with a slight lean and a crown of arched fronds. Unit scale; about 9 m tall. */
export function palmMesh(rng: Rng): MeshData {
  return prop((b, f) => {
    const h = 8.4;
    const lean = rng.range(-0.5, 0.5);
    const segs = 6;
    const trunk: Rgb = [0.42, 0.33, 0.24];
    for (let i = 0; i < segs; i++) {
      const t0 = i / segs;
      const t1 = (i + 1) / segs;
      const sf = frame(lean * t0 * t0, h * t0, 0);
      b.cylinder(sf, 0, 0, 0, 0.3 - 0.1 * t0, 0.3 - 0.1 * t1, h / segs, 7, scale(trunk, 0.9 + 0.2 * (i % 2)), false);
    }
    const top: Vec3 = [lean, h, 0];
    const fronds = 13;
    for (let i = 0; i < fronds; i++) {
      const a = (i / fronds) * Math.PI * 2 + rng.range(-0.2, 0.2);
      const len = rng.range(3.2, 4.3);
      const up = rng.range(0.5, 1.5);
      const droop = rng.range(2.4, 3.6);
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      const parts = 5;
      const g: Rgb = [0.2 + rng.range(0, 0.08), 0.42 + rng.range(0, 0.14), 0.12];
      let prev: Vec3 | null = null;
      let prevW = 0;
      for (let k = 0; k <= parts; k++) {
        const t = k / parts;
        const r = len * t;
        const y = up * Math.sin(t * Math.PI * 0.6) * 1.2 - droop * t * t;
        const c: Vec3 = [top[0] + ca * r, top[1] + y, top[2] + sa * r];
        const wHalf = 0.62 * Math.sin(Math.PI * (0.12 + 0.88 * t)) + 0.05;
        if (prev) {
          const px = -sa;
          const pz = ca;
          const a0: Vec3 = [prev[0] - px * prevW, prev[1] - 0.12, prev[2] - pz * prevW];
          const a1: Vec3 = [prev[0] + px * prevW, prev[1] - 0.12, prev[2] + pz * prevW];
          const b0: Vec3 = [c[0] - px * wHalf, c[1] - 0.12, c[2] - pz * wHalf];
          const b1: Vec3 = [c[0] + px * wHalf, c[1] - 0.12, c[2] + pz * wHalf];
          const shade = scale(g, 0.75 + 0.5 * t);
          // Two leaflet planes meeting at the rib, top and underside.
          b.quad(a0, prev, c, b0, shade);
          b.quad(prev, a1, b1, c, shade);
          b.quad(prev, a0, b0, c, scale(shade, 0.6));
          b.quad(a1, prev, c, b1, scale(shade, 0.6));
        }
        prev = c;
        prevW = wHalf;
      }
    }
    // Date clusters.
    b.revolve(f, lean, h - 0.7, 0, (t) => [0.45 * Math.sin(t * Math.PI), 0.6 * t], 6, 3, [0.6, 0.36, 0.1]);
  });
}

/** A broad-leaved garden tree (citrus, fig, sidr): a short trunk and a lumpy crown. About 5 m tall at scale 1. */
export function treeMesh(rng: Rng): MeshData {
  return prop((b, f) => {
    b.cylinder(f, 0, 0, 0, 0.22, 0.16, 2, 6, [0.36, 0.28, 0.2], false);
    const blobs = 5;
    for (let i = 0; i < blobs; i++) {
      const a = (i / blobs) * Math.PI * 2;
      const r = i === 0 ? 0 : rng.range(0.7, 1.2);
      const rad = rng.range(1.1, 1.6);
      const y = 2 + rng.range(0, 1.1);
      const lo: Rgb = [0.1, 0.24, 0.08];
      const hi: Rgb = [0.3 + rng.range(0, 0.08), 0.52 + rng.range(0, 0.1), 0.16];
      b.revolve(f, Math.cos(a) * r, y, Math.sin(a) * r, (t) => [rad * Math.sin(Math.PI * (0.06 + 0.94 * t)), rad * (1 - Math.cos(Math.PI * t))], 8, 5, lo, hi);
    }
  });
}

/** A cypress: a tall narrow flame shape. About 11 m at scale 1. */
export function cypressMesh(): MeshData {
  return prop((b, f) => {
    b.cylinder(f, 0, 0, 0, 0.18, 0.14, 1.2, 6, [0.3, 0.24, 0.18], false);
    b.revolve(f, 0, 1, 0, (t) => [1.15 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.1 + 0.9 * t)), 0.8) * (1 - 0.55 * t), 10 * t], 9, 8, [0.06, 0.17, 0.08], [0.16, 0.34, 0.14]);
  });
}

/** A market awning: a sloped cloth on two front posts, to stand against a wall. The instance colour dyes the cloth. */
export function awningMesh(): MeshData {
  return prop((b) => {
    const w = 3.4;
    const d = 2.6;
    const P = (x: number, y: number, z: number): Vec3 => [x, y, z];
    const white: Rgb = [1, 1, 1];
    b.quad(P(-w / 2, 2.3, d), P(w / 2, 2.3, d), P(w / 2, 3, 0), P(-w / 2, 3, 0), white);
    b.quad(P(-w / 2, 3, 0), P(w / 2, 3, 0), P(w / 2, 2.3, d), P(-w / 2, 2.3, d), [0.6, 0.6, 0.6]);
    // Valance.
    b.quad(P(-w / 2, 1.98, d), P(w / 2, 1.98, d), P(w / 2, 2.3, d), P(-w / 2, 2.3, d), [0.85, 0.85, 0.85]);
    b.quad(P(w / 2, 1.98, d), P(-w / 2, 1.98, d), P(-w / 2, 2.3, d), P(w / 2, 2.3, d), [0.55, 0.55, 0.55]);
  });
}

/** A stall: trestle table with heaped goods and baskets. The instance colour tints the goods. */
export function stallMesh(rng: Rng): MeshData {
  return prop((b, f) => {
    const wood: Rgb = [0.3, 0.22, 0.14];
    b.box(f, 0, 0.75, 0, 2.6, 0.08, 1.1, wood, 63);
    for (const [x, z] of [[-1.2, -0.45], [1.2, -0.45], [1.2, 0.45], [-1.2, 0.45]] as const) b.box(f, x, 0, z, 0.08, 0.75, 0.08, wood, BOX_SIDES);
    for (let i = 0; i < 5; i++) {
      const x = -1 + i * 0.5;
      const r = rng.range(0.16, 0.24);
      b.revolve(f, x, 0.83, rng.range(-0.2, 0.2), (t) => [r * Math.cos((t * Math.PI) / 2), r * 0.9 * Math.sin((t * Math.PI) / 2)], 7, 3, [1, 1, 1]);
    }
  });
}

/** A storage jar with a narrow neck. */
export function jarMesh(): MeshData {
  return prop((b, f) => {
    b.revolve(f, 0, 0, 0, (t) => [0.12 + 0.3 * Math.sin(Math.PI * Math.min(1, t * 1.15)) * (1 - 0.35 * t) + (t > 0.9 ? 0.05 : 0), 0.95 * t], 9, 8, [0.62, 0.36, 0.2], [0.75, 0.48, 0.28]);
  });
}

/** A street lamp: a post with a lantern. The lantern is a separate mesh so it can glow at night. */
export function lampPostMesh(): MeshData {
  return prop((b, f) => {
    b.cylinder(f, 0, 0, 0, 0.07, 0.05, 3.1, 6, [0.16, 0.13, 0.1], false);
    b.box(f, 0.3, 3.0, 0, 0.7, 0.06, 0.06, [0.16, 0.13, 0.1], 63);
  });
}
export function lanternMesh(): MeshData {
  return prop((b, f) => {
    b.revolve(f, 0.55, 2.55, 0, (t) => [0.05 + 0.14 * Math.sin(Math.PI * t), 0.42 * t], 6, 4, [1, 1, 1]);
  });
}

/** A person, seen from the street or from above: a robe, shoulders and sleeves. Tinted per instance. */
export function personBodyMesh(): MeshData {
  return prop((b, f) => {
    const white: Rgb = [1, 1, 1];
    b.revolve(f, 0, 0, 0, (t) => [0.27 - 0.09 * t + 0.03 * Math.sin(t * Math.PI), 1.32 * t], 8, 4, [0.7, 0.7, 0.7], white);
    b.revolve(f, 0, 1.3, 0, (t) => [0.2 * Math.cos((t * Math.PI) / 2), 0.14 * Math.sin((t * Math.PI) / 2)], 8, 2, white);
    for (const sx of [-1, 1]) b.cylinder(frame(sx * 0.23, 0.72, 0), 0, 0, 0, 0.055, 0.07, 0.62, 5, [0.85, 0.85, 0.85], false);
  });
}
/** Head and wound head-cloth. Not tinted by the robe colour. */
export function personHeadMesh(): MeshData {
  return prop((b, f) => {
    const skin: Rgb = [0.5, 0.34, 0.24];
    b.cylinder(f, 0, 1.36, 0, 0.055, 0.05, 0.1, 6, skin, false);
    b.revolve(f, 0, 1.43, 0, (t) => [0.1 * Math.sin(Math.PI * (0.1 + 0.9 * t)), 0.23 * t], 8, 5, skin);
    // The cloth sits low on the brow and is widest just above it.
    b.revolve(f, 0, 1.56, 0, (t) => [0.135 * Math.pow(Math.cos((t * Math.PI) / 2), 0.55) + 0.012 * Math.sin(t * Math.PI * 3), 0.13 * Math.sin((t * Math.PI) / 2)], 9, 5, [0.9, 0.88, 0.82], [0.8, 0.78, 0.72]);
  });
}

/** A river boat with a lateen sail. About 11 m long; bow toward local +X. */
export function boatMesh(withSail: boolean): MeshData {
  return prop((b) => {
    const L = 11;
    const stations = 7;
    const hull: Rgb = [0.34, 0.24, 0.15];
    const inside: Rgb = [0.5, 0.38, 0.24];
    const ring = (i: number): Vec3[] => {
      const t = i / (stations - 1);
      const x = -L / 2 + L * t;
      const beam = 1.55 * Math.pow(Math.sin(Math.PI * (0.04 + 0.92 * t)), 0.7);
      const sheer = 0.55 + 0.75 * Math.pow(Math.abs(t - 0.45) * 2, 2.2);
      return [
        [x, sheer, -beam],
        [x, 0.05, -beam * 0.6],
        [x, -0.3, 0],
        [x, 0.05, beam * 0.6],
        [x, sheer, beam],
      ];
    };
    for (let i = 0; i < stations - 1; i++) {
      const a = ring(i);
      const c = ring(i + 1);
      for (let k = 0; k < 4; k++) {
        b.quad(a[k]!, c[k]!, c[k + 1]!, a[k + 1]!, hull);
        b.quad(c[k]!, a[k]!, a[k + 1]!, c[k + 1]!, inside);
      }
    }
    const f = frame(0, 0, 0);
    b.box(f, -0.4, 0.2, 0, 3.2, 0.5, 1.6, [0.62, 0.5, 0.34], BOX_NO_BOTTOM); // cargo
    if (withSail) {
      b.cylinder(f, 0.6, 0.2, 0, 0.09, 0.06, 7.2, 6, [0.3, 0.22, 0.14], false);
      const sail: Rgb = [0.9, 0.86, 0.74];
      const A: Vec3 = [-3.6, 2.2, 0.25];
      const B: Vec3 = [3.2, 1.3, 0.25];
      const C: Vec3 = [1.6, 8.6, 0.1];
      const M: Vec3 = [0.2, 4.2, 0.9]; // belly of the sail
      for (const [p, q] of [[A, B], [B, C], [C, A]] as const) {
        b.quad(p, q, M, M, sail);
        b.quad(q, p, M, M, scale(sail, 0.8));
      }
    }
  });
}

/** A water-lifting wheel (noria): rim, spokes and paddles. Radius 1, axle along local Z; scale it up when placing. */
export function wheelMesh(): MeshData {
  return prop((b) => {
    const wood: Rgb = [0.34, 0.25, 0.16];
    const N = 20;
    for (const z of [-0.09, 0.09]) {
      for (let i = 0; i < N; i++) {
        const a0 = (i / N) * Math.PI * 2;
        const a1 = ((i + 1) / N) * Math.PI * 2;
        const mid = (a0 + a1) / 2;
        const len = 2 * Math.sin(Math.PI / N) * 0.97;
        // Rim segment as a thin box, rotated into place about Z by building it from explicit corners.
        const cx = Math.cos(mid) * 0.95;
        const cy = Math.sin(mid) * 0.95;
        const tx = -Math.sin(mid);
        const ty = Math.cos(mid);
        const nx = Math.cos(mid);
        const ny = Math.sin(mid);
        const hw = len / 2;
        const ht = 0.03;
        const hz = 0.02;
        const P = (u: number, v: number, w: number): Vec3 => [cx + tx * u + nx * v, cy + ty * u + ny * v, z + w];
        b.quad(P(-hw, ht, hz), P(-hw, -ht, hz), P(hw, -ht, hz), P(hw, ht, hz), wood);
        b.quad(P(hw, ht, -hz), P(hw, -ht, -hz), P(-hw, -ht, -hz), P(-hw, ht, -hz), wood);
        b.quad(P(-hw, ht, -hz), P(-hw, ht, hz), P(hw, ht, hz), P(hw, ht, -hz), wood);
        b.quad(P(-hw, -ht, hz), P(-hw, -ht, -hz), P(hw, -ht, -hz), P(hw, -ht, hz), scale(wood, 0.7));
      }
    }
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      if (i % 2 === 0) {
        // Spoke.
        const tx = -sa * 0.02;
        const ty = ca * 0.02;
        b.quad([tx, ty, 0.1], [-tx, -ty, 0.1], [ca * 0.95 - tx, sa * 0.95 - ty, 0.1], [ca * 0.95 + tx, sa * 0.95 + ty, 0.1], wood);
        b.quad([-tx, -ty, -0.1], [tx, ty, -0.1], [ca * 0.95 + tx, sa * 0.95 + ty, -0.1], [ca * 0.95 - tx, sa * 0.95 - ty, -0.1], wood);
      }
      // Paddle and pot.
      const r0 = 0.9;
      const r1 = 1.06;
      b.quad([ca * r0, sa * r0, -0.12], [ca * r0, sa * r0, 0.12], [ca * r1, sa * r1, 0.12], [ca * r1, sa * r1, -0.12], scale(wood, 1.2));
      b.quad([ca * r0, sa * r0, 0.12], [ca * r0, sa * r0, -0.12], [ca * r1, sa * r1, -0.12], [ca * r1, sa * r1, 0.12], scale(wood, 0.9));
    }
    // Axle.
    const f = frame(0, 0, 0);
    b.box(f, 0, -0.04, 0, 0.08, 0.08, 0.5, wood, 63);
  });
}
