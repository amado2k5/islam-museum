// Seeded pseudo-random numbers for every game rule, daily challenge and procedural scene.
// Nothing in the gaming workspace may call Math.random() or read the clock for anything that affects
// a rule outcome, a score or generated content: the same seed must give the same result on every machine.
//
// Generator: sfc32 (Chris Doty-Humphrey's "Small Fast Counter", public domain), seeded through
// a 32-bit FNV-1a string hash and a splitmix32 expander. All arithmetic is 32-bit integer, so results
// are identical across JavaScript engines.

/** 32-bit FNV-1a over the UTF-16 code units of a string. */
export function hash32(text: string, seed = 0x811c9dc5): number {
  let h = seed >>> 0;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** splitmix32: turns one 32-bit state into a stream of well-mixed 32-bit values (used only for seeding). */
function splitmix32(state: number): () => number {
  let s = state >>> 0;
  return () => {
    s = (s + 0x9e3779b9) >>> 0;
    let z = s;
    z = Math.imul(z ^ (z >>> 16), 0x85ebca6b) >>> 0;
    z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35) >>> 0;
    return (z ^ (z >>> 16)) >>> 0;
  };
}

export interface RngState {
  a: number;
  b: number;
  c: number;
  d: number;
}

export class Rng {
  private a: number;
  private b: number;
  private c: number;
  private d: number;

  constructor(seed: number | string | RngState) {
    if (typeof seed === "object") {
      this.a = seed.a >>> 0;
      this.b = seed.b >>> 0;
      this.c = seed.c >>> 0;
      this.d = seed.d >>> 0;
      return;
    }
    const mix = splitmix32(typeof seed === "string" ? hash32(seed) : seed >>> 0);
    this.a = mix();
    this.b = mix();
    this.c = mix();
    this.d = 1;
    for (let i = 0; i < 12; i++) this.u32();
  }

  /** Serializable state: a save file stores this so a reloaded game continues the same stream. */
  state(): RngState {
    return { a: this.a, b: this.b, c: this.c, d: this.d };
  }

  /** Next unsigned 32-bit integer. */
  u32(): number {
    const t = (((this.a + this.b) >>> 0) + this.d) >>> 0;
    this.d = (this.d + 1) >>> 0;
    this.a = (this.b ^ (this.b >>> 9)) >>> 0;
    this.b = (this.c + (this.c << 3)) >>> 0;
    this.c = ((this.c << 21) | (this.c >>> 11)) >>> 0;
    this.c = (this.c + t) >>> 0;
    return t;
  }

  /** Float in [0, 1) with 32 bits of randomness. */
  next(): number {
    return this.u32() / 4294967296;
  }

  /** Float in [min, max). */
  range(min: number, max: number): number {
    return min + (max - min) * this.next();
  }

  /** Integer in [min, max] inclusive, without modulo bias. */
  int(min: number, max: number): number {
    const span = max - min + 1;
    if (span <= 0) throw new RangeError(`Rng.int: empty range ${min}..${max}`);
    const limit = Math.floor(4294967296 / span) * span;
    let v = this.u32();
    while (v >= limit) v = this.u32();
    return min + (v % span);
  }

  chance(p: number): boolean {
    return this.next() < p;
  }

  pick<T>(items: readonly T[]): T {
    if (items.length === 0) throw new RangeError("Rng.pick: empty list");
    return items[this.int(0, items.length - 1)] as T;
  }

  /** Pick by weight; weights must be non-negative and not all zero. */
  weighted<T>(items: readonly T[], weights: readonly number[]): T {
    let total = 0;
    for (const w of weights) total += w;
    if (!(total > 0)) throw new RangeError("Rng.weighted: weights sum to zero");
    let r = this.next() * total;
    for (let i = 0; i < items.length; i++) {
      r -= weights[i] as number;
      if (r < 0) return items[i] as T;
    }
    return items[items.length - 1] as T;
  }

  /** Fisher-Yates shuffle, in place. */
  shuffle<T>(items: T[]): T[] {
    for (let i = items.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      const t = items[i] as T;
      items[i] = items[j] as T;
      items[j] = t;
    }
    return items;
  }

  /** An independent stream derived from this seed and a label; does not advance this stream. */
  fork(label: string): Rng {
    const h = hash32(label, (this.a ^ Math.imul(this.b, 0x9e3779b1)) >>> 0);
    return new Rng((h ^ this.c) >>> 0);
  }
}

/** Stateless hash of integer lattice coordinates to [0, 1): the basis of the value noise below. */
export function latticeHash(x: number, y: number, seed: number): number {
  let h = (Math.imul(x | 0, 0x27d4eb2d) ^ Math.imul(y | 0, 0x165667b1) ^ Math.imul(seed | 0, 0x9e3779b1)) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d) >>> 0;
  h = Math.imul(h ^ (h >>> 12), 0x297a2d39) >>> 0;
  return ((h ^ (h >>> 15)) >>> 0) / 4294967296;
}

/** Smooth 2D value noise in [0, 1], optionally tiling with the given integer period. */
export function valueNoise(x: number, y: number, seed: number, period = 0): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const sx = fx * fx * fx * (fx * (fx * 6 - 15) + 10);
  const sy = fy * fy * fy * (fy * (fy * 6 - 15) + 10);
  const wrap = (v: number) => (period > 0 ? ((v % period) + period) % period : v);
  const a = latticeHash(wrap(x0), wrap(y0), seed);
  const b = latticeHash(wrap(x0 + 1), wrap(y0), seed);
  const c = latticeHash(wrap(x0), wrap(y0 + 1), seed);
  const d = latticeHash(wrap(x0 + 1), wrap(y0 + 1), seed);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

/** Fractal value noise in [0, 1]. With `period`, the result tiles over `period` units of the base frequency. */
export function fbm(x: number, y: number, seed: number, octaves = 5, period = 0, gain = 0.5, lacunarity = 2): number {
  let sum = 0;
  let amp = 1;
  let norm = 0;
  let f = 1;
  for (let o = 0; o < octaves; o++) {
    sum += amp * valueNoise(x * f, y * f, seed + o * 1013, period > 0 ? period * f : 0);
    norm += amp;
    amp *= gain;
    f *= lacunarity;
  }
  return sum / norm;
}
