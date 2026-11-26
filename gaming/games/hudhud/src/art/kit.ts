// The painter's kit: every picture in the golden scene is drawn by code onto a canvas when the scene opens, and the
// canvases become textures. No picture file is loaded, so a release stays code only (the games' hosting rule) and
// the same code draws the same picture everywhere: the speckle and the brush marks come from the seeded generator.
//
// What this is and is not. It is a trial of a look: saturated teal and midnight blue, lantern gold, terracotta, soft
// dark outlines and a brushed surface, after the pictures the founder supplied. It is not an illustrator's work, and
// whether it is good enough to build fifty subjects on is the founder's decision (docs/gaming/hudhud/art-bible.md).
import { Rng } from "@im/kernel/prng";

export type Ctx = CanvasRenderingContext2D;
export interface Painted {
  canvas: HTMLCanvasElement;
  /** Logical size: what the game lays out with. The canvas is this times the texture scale. */
  w: number;
  h: number;
}

export const INK = "#2a1a12";
export const PAL = {
  night: "#0a1a36",
  deep: "#10305a",
  teal: "#1d6f78",
  tealDark: "#124a55",
  tealLight: "#3fa39b",
  gold: "#f2b94b",
  goldLight: "#ffe39a",
  amber: "#e8892b",
  terracotta: "#c2643a",
  ochre: "#d49a45",
  lapis: "#2b4fa3",
  emerald: "#2f8f5b",
  cream: "#f3e6c8",
  parchment: "#ead9b0",
  wood: "#7a4a26",
  woodDark: "#4a2a14",
  brass: "#c9973a",
  stone: "#8d8676",
  red: "#a8352e",
  hoopoe: "#f08a24",
  hoopoeLight: "#f9bd5e",
} as const;

/** A canvas of a logical size, already scaled so that drawing is in logical pixels. */
export function sheet(w: number, h: number, scale: number): [Painted, Ctx] {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(w * scale));
  canvas.height = Math.max(1, Math.round(h * scale));
  const ctx = canvas.getContext("2d")!;
  ctx.scale(canvas.width / w, canvas.height / h);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  return [{ canvas, w, h }, ctx];
}

export function linear(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, stops: [number, string][]): CanvasGradient {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  for (const [at, colour] of stops) g.addColorStop(at, colour);
  return g;
}
export function radial(ctx: Ctx, x: number, y: number, r0: number, r1: number, stops: [number, string][]): CanvasGradient {
  const g = ctx.createRadialGradient(x, y, r0, x, y, r1);
  for (const [at, colour] of stops) g.addColorStop(at, colour);
  return g;
}

/** A closed shape through points, rounded: each point is passed with a quadratic curve through the midpoints. */
export function blob(ctx: Ctx, pts: [number, number][]): void {
  const n = pts.length;
  const mid = (a: [number, number], b: [number, number]): [number, number] => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const first = mid(pts[n - 1]!, pts[0]!);
  ctx.beginPath();
  ctx.moveTo(first[0], first[1]);
  for (let i = 0; i < n; i++) {
    const m = mid(pts[i]!, pts[(i + 1) % n]!);
    ctx.quadraticCurveTo(pts[i]![0], pts[i]![1], m[0], m[1]);
  }
  ctx.closePath();
}

export function fillStroke(ctx: Ctx, fill: string | CanvasGradient, outline: string | null = INK, width = 2.4): void {
  ctx.fillStyle = fill;
  ctx.fill();
  if (outline) {
    ctx.strokeStyle = outline;
    ctx.lineWidth = width;
    ctx.stroke();
  }
}

/**
 * The brushed surface: over whatever is already painted (and only there), warm light from one side, cool shade from
 * the other, and short strokes of lighter and darker paint. This is what stops the shapes looking cut from paper.
 */
export function brush(ctx: Ctx, w: number, h: number, seed: string, opts: { light?: [number, number]; strokes?: number; warm?: string; cool?: string; strength?: number } = {}): void {
  const rng = new Rng(`hudhud-brush-${seed}`);
  const [lx, ly] = opts.light ?? [0.2, 0.1];
  const k = opts.strength ?? 1;
  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = linear(ctx, lx * w, ly * h, (1 - lx) * w, (1 - ly) * h, [
    [0, opts.warm ?? `rgba(255,226,150,${0.3 * k})`],
    [0.45, "rgba(255,226,150,0)"],
    [0.6, "rgba(10,20,60,0)"],
    [1, opts.cool ?? `rgba(10,20,60,${0.38 * k})`],
  ]);
  ctx.fillRect(0, 0, w, h);
  const count = opts.strokes ?? Math.round((w * h) / 260);
  for (let i = 0; i < count; i++) {
    const x = rng.range(0, w);
    const y = rng.range(0, h);
    const len = rng.range(4, 16);
    const a = rng.range(0, Math.PI * 2);
    ctx.strokeStyle = rng.chance(0.5) ? `rgba(255,240,200,${rng.range(0.03, 0.1) * k})` : `rgba(20,10,40,${rng.range(0.03, 0.1) * k})`;
    ctx.lineWidth = rng.range(1.2, 4);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
    ctx.stroke();
  }
  ctx.restore();
}

/** A soft round glow, to be drawn additively: lamps, the pinhole, the lit page. */
export function glow(size: number, scale: number, colour = "255,214,130"): Painted {
  const [p, ctx] = sheet(size, size, scale);
  ctx.fillStyle = radial(ctx, size / 2, size / 2, 0, size / 2, [
    [0, `rgba(${colour},0.95)`],
    [0.25, `rgba(${colour},0.45)`],
    [0.6, `rgba(${colour},0.12)`],
    [1, `rgba(${colour},0)`],
  ]);
  ctx.fillRect(0, 0, size, size);
  return p;
}

/** An eight-pointed star tile, the unit of the band along the wall. Geometry only: no script, no sacred text. */
export function starTile(ctx: Ctx, cx: number, cy: number, r: number, fill: string, line: string): void {
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8 - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.58;
    const x = cx + Math.cos(a) * rr;
    const y = cy + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = line;
  ctx.lineWidth = 1.2;
  ctx.stroke();
}

/** A decoded picture's size in memory: four bytes a pixel. Mipmaps are not made for these textures. */
export const bytesOf = (p: Painted): number => p.canvas.width * p.canvas.height * 4;
