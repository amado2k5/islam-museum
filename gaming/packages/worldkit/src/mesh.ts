// Engine-neutral geometry: plain typed arrays that any renderer (Three.js, Babylon.js, a test in Node) can consume.
// Conventions, used by every generator in the workspace:
//   - right-handed, Y up, metres;  +X east, +Z south (so -Z is north on a map);
//   - counter-clockwise triangles face outward;
//   - UVs are in metres along the surface, the material decides how many metres one texture tile covers;
//   - vertex colours are linear RGB multipliers on the material's base colour.

export interface MeshData {
  positions: Float32Array;
  normals: Float32Array;
  uvs: Float32Array;
  colors: Float32Array;
  indices: Uint32Array;
}

export type Vec3 = readonly [number, number, number];
export type Rgb = readonly [number, number, number];

/** A local frame: origin plus a rotation about the Y axis. Local +X maps to (cos, 0, -sin) for yaw measured counter-clockwise seen from above. */
export interface Frame {
  x: number;
  y: number;
  z: number;
  cos: number;
  sin: number;
}

export const frame = (x: number, y: number, z: number, yaw = 0): Frame => ({ x, y, z, cos: Math.cos(yaw), sin: Math.sin(yaw) });

export const toWorld = (f: Frame, lx: number, ly: number, lz: number): [number, number, number] => [
  f.x + lx * f.cos + lz * f.sin,
  f.y + ly,
  f.z - lx * f.sin + lz * f.cos,
];

/** A frame placed at a local point of a parent frame, with an extra yaw. */
export const subFrame = (f: Frame, lx: number, ly: number, lz: number, yaw = 0): Frame => {
  const [x, y, z] = toWorld(f, lx, ly, lz);
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return { x, y, z, cos: f.cos * c - f.sin * s, sin: f.sin * c + f.cos * s };
};

class Grow {
  data: Float32Array;
  length = 0;
  constructor(capacity: number) {
    this.data = new Float32Array(capacity);
  }
  ensure(extra: number): void {
    if (this.length + extra <= this.data.length) return;
    let cap = this.data.length * 2;
    while (cap < this.length + extra) cap *= 2;
    const next = new Float32Array(cap);
    next.set(this.data.subarray(0, this.length));
    this.data = next;
  }
  done(): Float32Array {
    return this.data.slice(0, this.length);
  }
}

export class MeshBuilder {
  private pos = new Grow(3 * 1024);
  private nor = new Grow(3 * 1024);
  private uv = new Grow(2 * 1024);
  private col = new Grow(3 * 1024);
  private idx: number[] = [];
  private count = 0;

  get vertexCount(): number {
    return this.count;
  }
  get triangleCount(): number {
    return this.idx.length / 3;
  }

  vertex(p: Vec3, n: Vec3, u: number, v: number, c: Rgb): number {
    this.pos.ensure(3);
    this.nor.ensure(3);
    this.uv.ensure(2);
    this.col.ensure(3);
    const pd = this.pos.data;
    const nd = this.nor.data;
    const cd = this.col.data;
    const o = this.count * 3;
    pd[o] = p[0];
    pd[o + 1] = p[1];
    pd[o + 2] = p[2];
    nd[o] = n[0];
    nd[o + 1] = n[1];
    nd[o + 2] = n[2];
    cd[o] = c[0];
    cd[o + 1] = c[1];
    cd[o + 2] = c[2];
    this.uv.data[this.count * 2] = u;
    this.uv.data[this.count * 2 + 1] = v;
    this.pos.length += 3;
    this.nor.length += 3;
    this.col.length += 3;
    this.uv.length += 2;
    return this.count++;
  }

  tri(a: number, b: number, c: number): void {
    this.idx.push(a, b, c);
  }

  /**
   * A planar quad a→b→c→d (counter-clockwise seen from outside). UVs run in metres: u along a→b, v along a→d,
   * offset by (u0, v0). Pass `c2` to shade the far edge (d, c) differently: a cheap baked gradient.
   */
  quad(a: Vec3, b: Vec3, c: Vec3, d: Vec3, color: Rgb, u0 = 0, v0 = 0, c2: Rgb = color): void {
    const ux = b[0] - a[0];
    const uy = b[1] - a[1];
    const uz = b[2] - a[2];
    const vx = d[0] - a[0];
    const vy = d[1] - a[1];
    const vz = d[2] - a[2];
    let nx = uy * vz - uz * vy;
    let ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;
    const nl = Math.hypot(nx, ny, nz) || 1;
    nx /= nl;
    ny /= nl;
    nz /= nl;
    const n: Vec3 = [nx, ny, nz];
    const lu = Math.hypot(ux, uy, uz);
    const lv = Math.hypot(vx, vy, vz);
    const i0 = this.vertex(a, n, u0, v0, color);
    const i1 = this.vertex(b, n, u0 + lu, v0, color);
    const i2 = this.vertex(c, n, u0 + lu, v0 + lv, c2);
    const i3 = this.vertex(d, n, u0, v0 + lv, c2);
    this.idx.push(i0, i1, i2, i0, i2, i3);
  }

  /**
   * An oriented box: (lx, ly, lz) is the centre of its base in the frame, sx/sy/sz are full sizes.
   * `faces` selects which faces to emit; hidden faces (a floor on the ground, a wall behind another) should be skipped.
   * `shade` darkens the bottom of the side faces to fake contact shadow (1 = none).
   */
  box(f: Frame, lx: number, ly: number, lz: number, sx: number, sy: number, sz: number, color: Rgb, faces: BoxFaces = BOX_NO_BOTTOM, shade = 1): void {
    const hx = sx / 2;
    const hz = sz / 2;
    const y0 = ly;
    const y1 = ly + sy;
    const p = (x: number, y: number, z: number) => toWorld(f, lx + x, y, lz + z);
    const lo: Rgb = shade === 1 ? color : [color[0] * shade, color[1] * shade, color[2] * shade];
    const A = p(-hx, y0, hz);
    const B = p(hx, y0, hz);
    const C = p(hx, y0, -hz);
    const D = p(-hx, y0, -hz);
    const E = p(-hx, y1, hz);
    const F = p(hx, y1, hz);
    const G = p(hx, y1, -hz);
    const H = p(-hx, y1, -hz);
    // Side faces: u runs around the box so texture seams fall on corners.
    if (faces & 1) this.quad(A, B, F, E, lo, 0, y0, color); // +Z (south)
    if (faces & 2) this.quad(B, C, G, F, lo, sx, y0, color); // +X (east)
    if (faces & 4) this.quad(C, D, H, G, lo, sx + sz, y0, color); // -Z (north)
    if (faces & 8) this.quad(D, A, E, H, lo, 2 * sx + sz, y0, color); // -X (west)
    if (faces & 16) this.quad(E, F, G, H, color, lx - hx, lz - hz); // top
    if (faces & 32) this.quad(D, C, B, A, lo, lx - hx, lz - hz); // bottom
  }

  /** A tapered cylinder or cone (r1 = 0) standing on its base centre. `segs` sides; optional top cap. */
  cylinder(f: Frame, lx: number, ly: number, lz: number, r0: number, r1: number, h: number, segs: number, color: Rgb, capTop = true, c2: Rgb = color): void {
    const slope = (r0 - r1) / (h || 1);
    const base = this.count;
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      const nl = Math.hypot(1, slope);
      const nLocal: Vec3 = [ca / nl, slope / nl, sa / nl];
      const n: Vec3 = [nLocal[0] * f.cos + nLocal[2] * f.sin, nLocal[1], -nLocal[0] * f.sin + nLocal[2] * f.cos];
      const u = (i / segs) * Math.PI * 2 * Math.max(r0, r1);
      this.vertex(toWorld(f, lx + ca * r0, ly, lz + sa * r0), n, u, ly, color);
      this.vertex(toWorld(f, lx + ca * r1, ly + h, lz + sa * r1), n, u, ly + h, c2);
    }
    for (let i = 0; i < segs; i++) {
      const a = base + i * 2;
      this.idx.push(a, a + 1, a + 3, a, a + 3, a + 2);
    }
    if (capTop && r1 > 0) {
      const up: Vec3 = [0, 1, 0];
      const centre = this.vertex(toWorld(f, lx, ly + h, lz), up, lx, lz, c2);
      const ring = this.count;
      for (let i = 0; i <= segs; i++) {
        const a = (i / segs) * Math.PI * 2;
        this.vertex(toWorld(f, lx + Math.cos(a) * r1, ly + h, lz + Math.sin(a) * r1), up, lx + Math.cos(a) * r1, lz + Math.sin(a) * r1, c2);
      }
      for (let i = 0; i < segs; i++) this.idx.push(centre, ring + i + 1, ring + i);
    }
  }

  /**
   * A surface of revolution about the local Y axis. `profile(t)` for t in [0, 1] returns [radius, height] in metres,
   * from the base (t = 0) to the apex (t = 1). Used for domes, finials, jars and drums.
   */
  revolve(f: Frame, lx: number, ly: number, lz: number, profile: (t: number) => readonly [number, number], segs: number, rings: number, color: Rgb, c2: Rgb = color): void {
    const base = this.count;
    let arc = 0;
    let prev = profile(0);
    for (let j = 0; j <= rings; j++) {
      const t = j / rings;
      const [r, y] = profile(t);
      arc += Math.hypot(r - prev[0], y - prev[1]);
      prev = [r, y];
      const e = 1e-3;
      const [ra, ya] = profile(Math.max(0, t - e));
      const [rb, yb] = profile(Math.min(1, t + e));
      const dr = rb - ra;
      const dy = yb - ya;
      const dl = Math.hypot(dr, dy) || 1;
      // Outward normal of the profile curve (tangent rotated a quarter turn clockwise).
      const nr = dy / dl;
      const ny = -dr / dl;
      const k = j / rings;
      const cj: Rgb = [color[0] + (c2[0] - color[0]) * k, color[1] + (c2[1] - color[1]) * k, color[2] + (c2[2] - color[2]) * k];
      for (let i = 0; i <= segs; i++) {
        const a = (i / segs) * Math.PI * 2;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        const n: Vec3 = [nr * ca * f.cos + nr * sa * f.sin, ny, -nr * ca * f.sin + nr * sa * f.cos];
        this.vertex(toWorld(f, lx + ca * r, ly + y, lz + sa * r), n, (i / segs) * Math.PI * 2 * Math.max(r, 0.5), arc, cj);
      }
    }
    const row = segs + 1;
    for (let j = 0; j < rings; j++) {
      for (let i = 0; i < segs; i++) {
        const a = base + j * row + i;
        const b = a + row;
        this.idx.push(a, b, b + 1, a, b + 1, a + 1);
      }
    }
  }

  /** Appends another mesh, transformed by a frame and a uniform-per-axis scale, optionally tinted. */
  append(m: MeshData, f: Frame, sx = 1, sy = 1, sz = 1, tint: Rgb = [1, 1, 1]): void {
    const base = this.count;
    const n = m.positions.length / 3;
    for (let i = 0; i < n; i++) {
      const p = toWorld(f, m.positions[i * 3]! * sx, m.positions[i * 3 + 1]! * sy, m.positions[i * 3 + 2]! * sz);
      const nx = m.normals[i * 3]!;
      const ny = m.normals[i * 3 + 1]!;
      const nz = m.normals[i * 3 + 2]!;
      const nn: Vec3 = [nx * f.cos + nz * f.sin, ny, -nx * f.sin + nz * f.cos];
      this.vertex(p, nn, m.uvs[i * 2]!, m.uvs[i * 2 + 1]!, [m.colors[i * 3]! * tint[0], m.colors[i * 3 + 1]! * tint[1], m.colors[i * 3 + 2]! * tint[2]]);
    }
    for (let i = 0; i < m.indices.length; i++) this.idx.push(base + m.indices[i]!);
  }

  build(): MeshData {
    return { positions: this.pos.done(), normals: this.nor.done(), uvs: this.uv.done(), colors: this.col.done(), indices: Uint32Array.from(this.idx) };
  }
}

/** Bit mask for MeshBuilder.box faces: 1 south(+Z), 2 east(+X), 4 north(-Z), 8 west(-X), 16 top, 32 bottom. */
export type BoxFaces = number;
export const BOX_ALL: BoxFaces = 63;
export const BOX_NO_BOTTOM: BoxFaces = 31;
export const BOX_SIDES: BoxFaces = 15;

/** Axis-aligned bounds of a mesh: [minX, minY, minZ, maxX, maxY, maxZ]. */
export function bounds(m: MeshData): [number, number, number, number, number, number] {
  const b: [number, number, number, number, number, number] = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
  for (let i = 0; i < m.positions.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      const v = m.positions[i + k]!;
      if (v < b[k]!) b[k] = v;
      if (v > b[k + 3]!) b[k + 3] = v;
    }
  }
  return b;
}

/** Column-major 4x4 matrix for an instance: translate, rotate about Y, then scale. */
export function instanceMatrix(out: Float32Array | number[], offset: number, x: number, y: number, z: number, yaw: number, sx: number, sy: number, sz: number): void {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  out[offset] = c * sx;
  out[offset + 1] = 0;
  out[offset + 2] = -s * sx;
  out[offset + 3] = 0;
  out[offset + 4] = 0;
  out[offset + 5] = sy;
  out[offset + 6] = 0;
  out[offset + 7] = 0;
  out[offset + 8] = s * sz;
  out[offset + 9] = 0;
  out[offset + 10] = c * sz;
  out[offset + 11] = 0;
  out[offset + 12] = x;
  out[offset + 13] = y;
  out[offset + 14] = z;
  out[offset + 15] = 1;
}
