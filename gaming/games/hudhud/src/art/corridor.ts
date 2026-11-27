// The door at the end of a scene and the corridor that leads to it (the journey, content/journey.ts). Drawn in code, in
// the room's own style (kit.ts): a tall arched wooden door in a stone frame, with no inscription and no text, and a
// plain corridor in one colour scheme for each world. The corridor shows no real place: a wall, a floor and a door.
import type { HudhudArt } from "./cast";
import { INK, PAL, fillStroke, linear, radial, sheet, type Ctx, type Painted } from "./kit";

/** The door's own size in logical pixels; it stands on its bottom edge. */
export const DOOR_ART = { w: 110, h: 232 } as const;

function archDoorway(ctx: Ctx, left: number, right: number, spring: number, bottom: number): void {
  const r = (right - left) / 2;
  ctx.beginPath();
  ctx.moveTo(left, bottom);
  ctx.lineTo(left, spring);
  ctx.arc(left + r, spring, r, Math.PI, 0);
  ctx.lineTo(right, bottom);
  ctx.closePath();
}

/** The door: closed and dark, or lit (warm light round its edge and a line of light under it). */
export function doorArt(scale: number, lit: boolean): Painted {
  const { w, h } = DOOR_ART;
  const [p, ctx] = sheet(w, h, scale);
  const bottom = h - 2;
  // The stone frame, its joints drawn as plain lines.
  archDoorway(ctx, 3, w - 3, 64, bottom);
  fillStroke(ctx, linear(ctx, 0, 0, w, 0, [[0, "#b9ab8c"], [0.5, "#d8ccb0"], [1, "#9f927a"]]), INK, 2.4);
  ctx.strokeStyle = "rgba(42,26,18,0.35)";
  ctx.lineWidth = 1.2;
  for (const y of [100, 140, 180]) {
    for (const [a, b] of [[3, 15], [w - 15, w - 3]] as const) {
      ctx.beginPath();
      ctx.moveTo(a, y);
      ctx.lineTo(b, y);
      ctx.stroke();
    }
  }
  // The wooden leaf.
  const inL = 15;
  const inR = w - 15;
  archDoorway(ctx, inL, inR, 70, bottom - 4);
  fillStroke(ctx, linear(ctx, 0, 30, 0, bottom, lit ? [[0, "#a8693a"], [1, PAL.wood]] : [[0, "#4a2e1a"], [1, "#2c190d"]]), INK, 2);
  ctx.save();
  archDoorway(ctx, inL, inR, 70, bottom - 4);
  ctx.clip();
  ctx.strokeStyle = lit ? "rgba(42,26,18,0.45)" : "rgba(0,0,0,0.45)";
  ctx.lineWidth = 1.4;
  for (let x = inL + 16; x < inR; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, 20);
    ctx.lineTo(x, bottom);
    ctx.stroke();
  }
  // Two iron bands with their nails, and a ring to pull.
  ctx.fillStyle = lit ? "#3a2a1c" : "#1c120a";
  for (const y of [104, 186]) ctx.fillRect(inL, y, inR - inL, 7);
  ctx.fillStyle = lit ? PAL.brass : "#5a4a2a";
  for (const y of [107.5, 189.5]) {
    for (let x = inL + 8; x < inR; x += 16) {
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
  ctx.beginPath();
  ctx.arc(inR - 14, 150, 6, 0, Math.PI * 2);
  ctx.strokeStyle = lit ? PAL.brass : "#5a4a2a";
  ctx.lineWidth = 2.4;
  ctx.stroke();
  if (lit) {
    // Warm light round the edge of the leaf, and a bright line under it.
    ctx.save();
    ctx.shadowColor = "rgba(255,214,130,0.95)";
    ctx.shadowBlur = 10;
    archDoorway(ctx, inL, inR, 70, bottom - 4);
    ctx.strokeStyle = PAL.goldLight;
    ctx.lineWidth = 2.6;
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = "#fff1c4";
    ctx.fillRect(inL + 2, bottom - 5, inR - inL - 4, 4);
  } else {
    ctx.fillStyle = "#120a05";
    ctx.fillRect(inL + 2, bottom - 5, inR - inL - 4, 4);
  }
  return p;
}

/** A plain scheme for each world's corridor, by the world's order (1 to 10), from the kit's own colours. */
export const CORRIDOR_SCHEMES: Readonly<Record<number, { wallTop: string; wallLow: string; floor: string; floorLow: string; trim: string }>> = {
  1: { wallTop: PAL.night, wallLow: PAL.deep, floor: PAL.woodDark, floorLow: "#2a170a", trim: PAL.gold },
  2: { wallTop: PAL.tealDark, wallLow: PAL.teal, floor: PAL.wood, floorLow: PAL.woodDark, trim: PAL.brass },
  3: { wallTop: PAL.terracotta, wallLow: PAL.ochre, floor: PAL.woodDark, floorLow: "#2a170a", trim: PAL.cream },
  4: { wallTop: PAL.tealLight, wallLow: PAL.cream, floor: PAL.stone, floorLow: "#5f594c", trim: PAL.emerald },
  5: { wallTop: PAL.ochre, wallLow: PAL.parchment, floor: PAL.wood, floorLow: PAL.woodDark, trim: PAL.red },
  6: { wallTop: PAL.amber, wallLow: PAL.ochre, floor: PAL.terracotta, floorLow: "#7c4526", trim: PAL.lapis },
  7: { wallTop: PAL.lapis, wallLow: PAL.deep, floor: PAL.wood, floorLow: PAL.woodDark, trim: PAL.goldLight },
  8: { wallTop: PAL.cream, wallLow: PAL.stone, floor: PAL.terracotta, floorLow: "#7c4526", trim: PAL.teal },
  9: { wallTop: PAL.emerald, wallLow: PAL.tealDark, floor: PAL.woodDark, floorLow: "#2a170a", trim: PAL.ochre },
  10: { wallTop: PAL.red, wallLow: PAL.terracotta, floor: PAL.wood, floorLow: PAL.woodDark, trim: PAL.parchment },
};

/** The corridor's wall and floor, drawn once: a plain band of wall with a trim, and a floor. */
export function corridorBack(scale: number, world: number, size: { w: number; h: number; floor: number }): Painted {
  const sc = CORRIDOR_SCHEMES[world] ?? CORRIDOR_SCHEMES[3]!;
  const [p, ctx] = sheet(size.w, size.h, scale);
  ctx.fillStyle = linear(ctx, 0, 0, 0, size.floor, [[0, sc.wallTop], [1, sc.wallLow]]);
  ctx.fillRect(0, 0, size.w, size.floor);
  ctx.fillStyle = sc.trim;
  ctx.fillRect(0, size.floor - 34, size.w, 6);
  ctx.fillStyle = linear(ctx, 0, size.floor, 0, size.h, [[0, sc.floor], [1, sc.floorLow]]);
  ctx.fillRect(0, size.floor, size.w, size.h - size.floor);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, size.floor);
  ctx.lineTo(size.w, size.floor);
  ctx.stroke();
  // A soft shade at the two ends, so that the corridor reads as going on.
  for (const [x0, x1] of [[0, 120], [size.w, size.w - 120]] as const) {
    ctx.fillStyle = linear(ctx, x0, 0, x1, 0, [[0, "rgba(0,0,0,0.35)"], [1, "rgba(0,0,0,0)"]]);
    ctx.fillRect(Math.min(x0, x1), 0, 120, size.h);
  }
  return p;
}

/** A warm glow behind a lit door; `strength` 0 to 1. */
export function doorGlow(ctx: Ctx, x: number, y: number, r: number, strength: number): void {
  if (strength <= 0) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = radial(ctx, x, y, 0, r, [[0, `rgba(255,214,130,${0.55 * strength})`], [1, "rgba(255,214,130,0)"]]);
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.restore();
}

const put = (ctx: Ctx, p: Painted, x: number, y: number, ox: number, oy: number, deg = 0) => {
  ctx.save();
  ctx.translate(x, y);
  if (deg) ctx.rotate((deg * Math.PI) / 180);
  ctx.drawImage(p.canvas, -ox * p.w, -oy * p.h, p.w, p.h);
  ctx.restore();
};

/** Hudhud standing or walking, from the same painted parts as the flying scene (cast.ts), laid out as it lays them.
 * `bob` lifts the body while walking (0 when motion is reduced). */
export function drawBird(ctx: Ctx, art: HudhudArt, x: number, y: number, facing: 1 | -1, size: number, bob: number, tailSwing: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size * facing, size);
  put(ctx, art.legs, 2, 2, 0.5, 1);
  ctx.translate(0, -bob);
  put(ctx, art.tail, -24, -36, 1, 0.5, -8 + tailSwing);
  put(ctx, art.body, 0, -40, 0.5, 0.5);
  put(ctx, art.wing, -6, -42, 0.5, 0.5);
  put(ctx, art.crest, 18, -80, 0.5, 0.96, -30);
  put(ctx, art.head, 22, -68, 24 / 92, 26 / 50);
  ctx.restore();
}
