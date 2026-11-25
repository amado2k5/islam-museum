// Procedural surface textures, generated as raw pixels from seeded noise. No image files, no canvas drawing calls,
// so the output is byte-identical in every browser and in Node (which is how the tests check it), and nothing here
// can carry a third party's rights. Each texture tiles seamlessly and comes with a tangent-space normal map
// (OpenGL convention: +Y up) derived from the same height field as its colour.
import { fbm, latticeHash, valueNoise } from "@im/kernel/prng";

export type TextureKind = "plaster" | "brick" | "ashlar" | "roof" | "glaze" | "startile" | "wood" | "lattice" | "fabric" | "earth" | "paving" | "field" | "grass" | "water";

export interface TextureData {
  kind: TextureKind;
  size: number;
  /** RGBA, sRGB-encoded colour. */
  albedo: Uint8Array;
  /** RGBA tangent-space normal (linear), alpha = roughness multiplier hint in 0..255. */
  normal: Uint8Array;
  /** How many metres of surface one tile of this texture covers. */
  tileMeters: number;
  roughness: number;
  metalness: number;
}

interface Sample {
  /** Height in 0..1, used for the normal map. */
  h: number;
  r: number;
  g: number;
  b: number;
  /** Roughness multiplier 0..1 (glaze lines are rougher than the glaze). */
  rough?: number;
}

type Painter = (u: number, v: number, seed: number) => Sample;

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
/** Linear-light colour (0..1) to an sRGB byte. */
const toSrgb = (l: number) => {
  const c = clamp01(l);
  return Math.round(255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055));
};

// Painters work in tile space: u and v run 0..1 across one tile, and every noise call is given a period so the
// tile wraps without a seam.

const plaster: Painter = (u, v, s) => {
  const n = fbm(u * 6, v * 6, s, 5, 6);
  const fine = fbm(u * 48, v * 48, s + 7, 3, 48);
  const stain = smooth(0.55, 0.9, fbm(u * 3, v * 1.5, s + 21, 4, 3));
  const tone = 0.86 + 0.14 * n - 0.1 * stain;
  return { h: 0.5 * n + 0.5 * fine, r: tone, g: tone * 0.985, b: tone * 0.95, rough: 0.9 + 0.1 * fine };
};

/** Running-bond masonry. cols x rows bricks per tile; returns per-brick colour and a mortar mask. */
const masonry = (u: number, v: number, s: number, cols: number, rows: number, mortar: number) => {
  const row = Math.floor(v * rows);
  const fv = v * rows - row;
  const shift = (row & 1) * 0.5;
  const cu = u * cols + shift;
  const col = Math.floor(cu);
  const fu = cu - col;
  const id = latticeHash(((col % cols) + cols) % cols, row, s);
  const mu = mortar * (cols / rows);
  const edge = Math.min(smooth(0, mu, fu), smooth(0, mu, 1 - fu), smooth(0, mortar, fv), smooth(0, mortar, 1 - fv));
  return { id, edge, fu, fv };
};

const brick: Painter = (u, v, s) => {
  const m = masonry(u, v, s, 6, 18, 0.11);
  const grain = fbm(u * 40, v * 40, s + 3, 3, 40);
  const tone = 0.74 + 0.22 * m.id + 0.08 * grain;
  // Fired clay: warm tan to honey, a few darker, redder bricks.
  const red = m.id > 0.82 ? 0.9 : 1;
  const face = { r: tone, g: tone * 0.84 * red, b: tone * 0.6 * red };
  const mort = 0.62 + 0.1 * grain;
  return { h: m.edge * (0.75 + 0.25 * grain), r: mix(mort, face.r, m.edge), g: mix(mort * 0.95, face.g, m.edge), b: mix(mort * 0.86, face.b, m.edge), rough: 0.95 };
};

const ashlar: Painter = (u, v, s) => {
  const m = masonry(u, v, s, 3, 6, 0.045);
  const grain = fbm(u * 24, v * 24, s + 5, 4, 24);
  const vein = fbm(u * 5, v * 9, s + 9, 3, 5);
  const tone = 0.82 + 0.12 * m.id + 0.08 * grain - 0.05 * vein;
  const mort = 0.55;
  return { h: m.edge * (0.8 + 0.2 * grain), r: mix(mort, tone, m.edge), g: mix(mort * 0.97, tone * 0.955, m.edge), b: mix(mort * 0.9, tone * 0.86, m.edge), rough: 0.85 };
};

const roof: Painter = (u, v, s) => {
  const n = fbm(u * 5, v * 5, s, 5, 5);
  const peb = smooth(0.72, 0.8, valueNoise(u * 64, v * 64, s + 11, 64));
  const tone = 0.74 + 0.2 * n - 0.1 * peb;
  return { h: 0.6 * n + 0.4 * peb, r: tone, g: tone * 0.93, b: tone * 0.8, rough: 1 };
};

/** Glazed brick courses: one colour with thin joints, for domes. Colour comes mostly from the vertex tint. */
const glaze: Painter = (u, v, s) => {
  const m = masonry(u, v, s, 8, 16, 0.07);
  const wob = fbm(u * 12, v * 12, s + 2, 3, 12);
  const tone = 0.82 + 0.18 * m.id;
  const g = mix(0.5, tone, m.edge);
  return { h: m.edge * 0.9 + 0.1 * wob, r: g * 0.96, g, b: g * 0.98, rough: mix(1, 0.32 + 0.1 * wob, m.edge) };
};

/**
 * Eight-pointed star and cross tiling: a star is the union of an upright square and a diamond with the same centre;
 * the crosses fill what the stars leave. The pattern is a common one in glazed tile revetment; here it is original
 * procedural geometry, not a copy of any surviving panel.
 */
const startile: Painter = (u, v, s) => {
  const cells = 4;
  const x = (u * cells) % 1;
  const y = (v * cells) % 1;
  const cx = Math.abs(x - 0.5);
  const cy = Math.abs(y - 0.5);
  const a = 0.5 / (1 + Math.SQRT1_2); // star reaches the cell edge exactly at the diamond's points
  const square = Math.max(cx, cy) - a * 1.2071;
  const diamond = (cx + cy) * Math.SQRT1_2 - a * 1.2071;
  const d = Math.min(square, diamond); // negative inside the star
  const grout = 1 - smooth(0.012, 0.03, Math.abs(d));
  const inStar = d < 0;
  const id = latticeHash(Math.floor(u * cells), Math.floor(v * cells), s + (inStar ? 1 : 2));
  const speck = fbm(u * 32, v * 32, s + 4, 3, 32);
  // Stars turquoise, crosses deep cobalt, joints pale.
  const star = { r: 0.08 + 0.05 * id, g: 0.5 + 0.12 * id, b: 0.52 + 0.1 * id };
  const cross = { r: 0.04 + 0.03 * id, g: 0.12 + 0.05 * id, b: 0.42 + 0.14 * id };
  const base = inStar ? star : cross;
  const k = 0.9 + 0.2 * speck;
  return { h: 1 - grout, r: mix(base.r * k, 0.82, grout), g: mix(base.g * k, 0.8, grout), b: mix(base.b * k, 0.7, grout), rough: mix(0.25, 0.9, grout) };
};

const wood: Painter = (u, v, s) => {
  const plank = Math.floor(v * 8);
  const pid = latticeHash(plank, 0, s);
  const fv = v * 8 - plank;
  const joint = Math.min(smooth(0, 0.06, fv), smooth(0, 0.06, 1 - fv));
  const grain = fbm(u * 4 + pid * 7, v * 64, s + 3, 4, 64);
  const ring = 0.5 + 0.5 * Math.sin((u * 6 + grain * 2.2 + pid * 5) * Math.PI * 2);
  const tone = (0.5 + 0.18 * pid + 0.16 * grain + 0.06 * ring) * mix(0.55, 1, joint);
  return { h: joint * (0.7 + 0.3 * grain), r: tone, g: tone * 0.72, b: tone * 0.48, rough: 0.8 };
};

/** Turned-wood screen: a grid of small openings. The openings are painted dark, not cut (no alpha anywhere in the kit). */
const lattice: Painter = (u, v, s) => {
  const n = 10;
  const x = (u * n) % 1;
  const y = (v * n) % 1;
  const dx = Math.abs(x - 0.5);
  const dy = Math.abs(y - 0.5);
  const hole = 1 - smooth(0.2, 0.3, Math.max(dx, dy) * 0.6 + (dx + dy) * 0.4);
  const frameEdge = Math.min(smooth(0, 0.03, u), smooth(0, 0.03, 1 - u), smooth(0, 0.03, v), smooth(0, 0.03, 1 - v));
  const grain = fbm(u * 8, v * 40, s, 3, 40);
  const tone = (0.42 + 0.14 * grain) * mix(1, 0.1, hole * frameEdge);
  return { h: 1 - hole * frameEdge, r: tone, g: tone * 0.7, b: tone * 0.46, rough: 0.75 };
};

/** Woven cloth with broad stripes; the awning colour is the vertex tint, the stripe is a lighter band. */
const fabric: Painter = (u, v, s) => {
  const stripe = smooth(0.42, 0.5, Math.abs(((u * 4) % 1) - 0.5));
  const weave = 0.5 + 0.25 * Math.sin(u * 256 * Math.PI) * Math.sin(v * 256 * Math.PI);
  const sag = fbm(u * 4, v * 4, s, 3, 4);
  const tone = mix(0.62, 1, stripe) * (0.9 + 0.1 * sag);
  return { h: 0.5 * weave + 0.5 * sag, r: tone, g: tone, b: tone, rough: 0.95 };
};

const earth: Painter = (u, v, s) => {
  const n = fbm(u * 6, v * 6, s, 5, 6);
  const rut = 0.5 + 0.5 * Math.sin((u * 3 + 0.15 * fbm(u * 2, v * 2, s + 5, 2, 2)) * Math.PI * 2);
  const peb = smooth(0.7, 0.78, valueNoise(u * 48, v * 48, s + 13, 48));
  const tone = 0.66 + 0.2 * n - 0.06 * rut + 0.08 * peb;
  return { h: 0.5 * n + 0.2 * rut + 0.3 * peb, r: tone, g: tone * 0.88, b: tone * 0.7, rough: 1 };
};

const paving: Painter = (u, v, s) => {
  const m = masonry(u, v, s, 4, 4, 0.035);
  const wear = fbm(u * 10, v * 10, s + 6, 4, 10);
  const tone = 0.74 + 0.16 * m.id + 0.08 * wear;
  return { h: m.edge * (0.85 + 0.15 * wear), r: mix(0.42, tone, m.edge), g: mix(0.4, tone * 0.96, m.edge), b: mix(0.36, tone * 0.87, m.edge), rough: 0.8 };
};

/** Crop rows on tilled soil. The vertex tint picks the crop. */
const field: Painter = (u, v, s) => {
  const rowPhase = (v * 16) % 1;
  const row = smooth(0.25, 0.45, 1 - Math.abs(rowPhase - 0.5) * 2);
  const clump = fbm(u * 40, v * 16, s, 3, 16);
  const leaf = row * smooth(0.25, 0.6, clump);
  const soil = 0.4 + 0.12 * fbm(u * 8, v * 8, s + 4, 3, 8);
  return { h: 0.3 * soil + 0.7 * leaf, r: mix(soil, 0.42, leaf), g: mix(soil * 0.8, 0.82, leaf), b: mix(soil * 0.58, 0.3, leaf), rough: 1 };
};

const grass: Painter = (u, v, s) => {
  const n = fbm(u * 8, v * 8, s, 5, 8);
  const blade = valueNoise(u * 96, v * 96, s + 5, 96);
  const dry = smooth(0.55, 0.85, fbm(u * 3, v * 3, s + 9, 3, 3));
  const g = 0.55 + 0.3 * n + 0.1 * blade;
  return { h: 0.5 * n + 0.5 * blade, r: mix(g * 0.62, g * 0.95, dry), g, b: mix(g * 0.36, g * 0.5, dry), rough: 1 };
};

/** Water has no colour of its own here; only the wave height matters (it becomes the normal map). */
const water: Painter = (u, v, s) => {
  const TAU = Math.PI * 2;
  const n = fbm(u * 6, v * 6, s, 4, 6);
  let h = 0;
  h += 0.3 * Math.sin((u * 3 + v * 2) * TAU + n * 2);
  h += 0.22 * Math.sin((u * 5 - v * 4) * TAU + n * 3);
  h += 0.16 * Math.sin((u * 9 + v * 7) * TAU);
  h += 0.12 * Math.sin((-u * 13 + v * 11) * TAU + n * 5);
  h += 0.2 * (fbm(u * 16, v * 16, s + 3, 3, 16) - 0.5);
  return { h: 0.5 + 0.5 * h, r: 0.5, g: 0.5, b: 0.5, rough: 1 };
};

const SPECS: Record<TextureKind, { paint: Painter; tileMeters: number; roughness: number; metalness: number; bump: number }> = {
  plaster: { paint: plaster, tileMeters: 4, roughness: 0.92, metalness: 0, bump: 1.2 },
  brick: { paint: brick, tileMeters: 1.5, roughness: 0.9, metalness: 0, bump: 3 },
  ashlar: { paint: ashlar, tileMeters: 2.4, roughness: 0.85, metalness: 0, bump: 2.5 },
  roof: { paint: roof, tileMeters: 5, roughness: 1, metalness: 0, bump: 1.5 },
  glaze: { paint: glaze, tileMeters: 2, roughness: 0.3, metalness: 0, bump: 2 },
  startile: { paint: startile, tileMeters: 3.2, roughness: 0.28, metalness: 0, bump: 2 },
  wood: { paint: wood, tileMeters: 1.6, roughness: 0.75, metalness: 0, bump: 2.5 },
  lattice: { paint: lattice, tileMeters: 1.2, roughness: 0.75, metalness: 0, bump: 3 },
  fabric: { paint: fabric, tileMeters: 2, roughness: 0.95, metalness: 0, bump: 1 },
  earth: { paint: earth, tileMeters: 6, roughness: 1, metalness: 0, bump: 1.6 },
  paving: { paint: paving, tileMeters: 4, roughness: 0.8, metalness: 0, bump: 2.2 },
  field: { paint: field, tileMeters: 12, roughness: 1, metalness: 0, bump: 2 },
  grass: { paint: grass, tileMeters: 8, roughness: 1, metalness: 0, bump: 1.5 },
  water: { paint: water, tileMeters: 24, roughness: 0.06, metalness: 0, bump: 1.4 },
};

export const TEXTURE_KINDS = Object.keys(SPECS) as TextureKind[];

/** Generates one tiling texture. `size` must be a power of two. */
export function makeTexture(kind: TextureKind, seed: number, size = 512): TextureData {
  const spec = SPECS[kind];
  const heights = new Float32Array(size * size);
  const albedo = new Uint8Array(size * size * 4);
  const normal = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const smp = spec.paint((x + 0.5) / size, (y + 0.5) / size, seed);
      const i = y * size + x;
      heights[i] = smp.h;
      albedo[i * 4] = toSrgb(smp.r * smp.r); // painters work in a perceptual 0..1 scale; square to linear
      albedo[i * 4 + 1] = toSrgb(smp.g * smp.g);
      albedo[i * 4 + 2] = toSrgb(smp.b * smp.b);
      albedo[i * 4 + 3] = 255;
      normal[i * 4 + 3] = Math.round(255 * clamp01(smp.rough ?? 1));
    }
  }
  // Central differences with wrap-around, so the normal map tiles like the colour does.
  const texel = spec.tileMeters / size;
  const scale = (spec.bump * 0.02) / texel;
  for (let y = 0; y < size; y++) {
    const yu = ((y + 1) % size) * size;
    const yd = ((y - 1 + size) % size) * size;
    for (let x = 0; x < size; x++) {
      const xr = (x + 1) % size;
      const xl = (x - 1 + size) % size;
      const dx = (heights[y * size + xr]! - heights[y * size + xl]!) * 0.5 * scale;
      const dy = (heights[yu + x]! - heights[yd + x]!) * 0.5 * scale;
      const inv = 1 / Math.hypot(dx, dy, 1);
      const i = (y * size + x) * 4;
      normal[i] = Math.round(255 * (0.5 - 0.5 * dx * inv));
      normal[i + 1] = Math.round(255 * (0.5 - 0.5 * dy * inv));
      normal[i + 2] = Math.round(255 * (0.5 + 0.5 * inv));
    }
  }
  return { kind, size, albedo, normal, tileMeters: spec.tileMeters, roughness: spec.roughness, metalness: spec.metalness };
}
