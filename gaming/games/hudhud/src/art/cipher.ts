// The secret page, drawn in code: a row of marks, and under each mark the sign given to it so far, or an empty place.
// The signs are small coloured pictures of things (none a figure of a person or an animal); the marks are plain
// shapes in ink that differ by shape and never by colour alone. A trial picture, replaceable like every picture in this
// game; it carries no words, so that the page's own text (in seven languages) says everything the picture shows.
import { INK, PAL } from "./kit";

type Ctx = CanvasRenderingContext2D;
export const CIPHER_ART = { w: 1000, h: 420, perRow: 15, cell: 62, rowH: 132, top: 52 } as const;
export interface CipherView {
  /** The message, as marks. */
  message: string[];
  /** The sign given to each mark so far. */
  guess: Record<string, string>;
  /** The page reads right to left: the first mark is on the right. */
  rtl: boolean;
  /** The page has been read: it is drawn whole. */
  done: boolean;
}

/** The place of a mark of the message on the picture, in its own 1000 by 420 space. */
export function cipherCell(i: number, count: number, rtl: boolean): { x: number; y: number } {
  const { w, perRow, cell, rowH, top } = CIPHER_ART;
  const row = Math.floor(i / perRow);
  const col = i % perRow;
  const inRow = Math.min(perRow, count - row * perRow);
  const x0 = (w - (inRow - 1) * cell) / 2 + col * cell;
  return { x: rtl ? w - x0 : x0, y: top + row * rowH };
}

function fill(c: Ctx, colour: string, line: string | null = INK, width = 2.4): void {
  c.fillStyle = colour;
  c.fill();
  if (line) {
    c.strokeStyle = line;
    c.lineWidth = width;
    c.stroke();
  }
}
function rounded(c: Ctx, x: number, y: number, w: number, h: number, r: number): void {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
/** Each sign is drawn in a box of about 70 by 70 around the origin. */
const SIGN: Record<string, (c: Ctx) => void> = {
  // A disc with eight short rays.
  sun(c) {
    c.strokeStyle = PAL.amber;
    c.lineWidth = 6;
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      c.beginPath();
      c.moveTo(Math.cos(a) * 24, Math.sin(a) * 24);
      c.lineTo(Math.cos(a) * 36, Math.sin(a) * 36);
      c.stroke();
    }
    c.beginPath();
    c.arc(0, 0, 19, 0, Math.PI * 2);
    fill(c, PAL.gold);
  },
  // A thin crescent.
  moon(c) {
    c.beginPath();
    c.arc(0, 0, 28, Math.PI * 0.35, Math.PI * 1.65, false);
    c.arc(12, 0, 24, Math.PI * 1.62, Math.PI * 0.38, true);
    c.closePath();
    fill(c, PAL.goldLight);
  },
  // A five-pointed star.
  star(c) {
    c.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? 34 : 14;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    c.closePath();
    fill(c, PAL.goldLight);
  },
  // Two wavy lines.
  wave(c) {
    c.lineWidth = 7;
    c.strokeStyle = PAL.lapis;
    for (const y of [-10, 12]) {
      c.beginPath();
      c.moveTo(-34, y);
      c.bezierCurveTo(-22, y - 16, -10, y - 16, 0, y);
      c.bezierCurveTo(10, y + 16, 22, y + 16, 34, y);
      c.stroke();
    }
  },
  // A leaf with a vein.
  leaf(c) {
    c.beginPath();
    c.moveTo(-30, 26);
    c.quadraticCurveTo(-34, -30, 30, -30);
    c.quadraticCurveTo(34, 30, -30, 26);
    c.closePath();
    fill(c, PAL.emerald);
    c.strokeStyle = PAL.cream;
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(-26, 22);
    c.lineTo(18, -18);
    c.stroke();
  },
  // A key: a round bow, a shaft and two teeth.
  key(c) {
    c.beginPath();
    c.arc(-18, 0, 14, 0, Math.PI * 2);
    c.moveTo(-4, 0);
    c.lineTo(34, 0);
    c.moveTo(24, 0);
    c.lineTo(24, 14);
    c.moveTo(34, 0);
    c.lineTo(34, 12);
    c.lineWidth = 8;
    c.strokeStyle = INK;
    c.stroke();
    c.lineWidth = 4.5;
    c.strokeStyle = PAL.brass;
    c.stroke();
  },
  // A feather: a long curved quill with a vane.
  feather(c) {
    c.beginPath();
    c.moveTo(-32, 30);
    c.quadraticCurveTo(-22, -34, 30, -34);
    c.quadraticCurveTo(26, 22, -32, 30);
    c.closePath();
    fill(c, PAL.cream);
    c.strokeStyle = PAL.stone;
    c.lineWidth = 2.5;
    c.beginPath();
    c.moveTo(-32, 30);
    c.quadraticCurveTo(-4, 4, 22, -26);
    c.stroke();
  },
  // A small oil lamp: a dish with a spout and a flame.
  lamp(c) {
    c.beginPath();
    c.moveTo(-28, 6);
    c.quadraticCurveTo(-2, 34, 24, 6);
    c.lineTo(36, 0);
    c.lineTo(24, -4);
    c.lineTo(-28, -4);
    c.closePath();
    fill(c, PAL.terracotta);
    c.beginPath();
    c.moveTo(32, -6);
    c.quadraticCurveTo(24, -22, 34, -34);
    c.quadraticCurveTo(46, -20, 32, -6);
    c.closePath();
    fill(c, PAL.amber);
  },
};
/** Each mark is a plain shape in ink in a box of about 56 by 56 around the origin. */
const MARK: Record<string, (c: Ctx) => void> = {
  m1(c) {
    // The triangle.
    c.beginPath();
    c.moveTo(0, -26);
    c.lineTo(26, 22);
    c.lineTo(-26, 22);
    c.closePath();
    c.stroke();
  },
  m2(c) {
    // The ring.
    c.beginPath();
    c.arc(0, 0, 23, 0, Math.PI * 2);
    c.stroke();
  },
  m3(c) {
    // The cross: two crossing lines.
    c.beginPath();
    c.moveTo(-22, -22);
    c.lineTo(22, 22);
    c.moveTo(22, -22);
    c.lineTo(-22, 22);
    c.stroke();
  },
  m4(c) {
    // The square.
    c.strokeRect(-22, -22, 44, 44);
  },
  m5(c) {
    // The diamond.
    c.beginPath();
    c.moveTo(0, -28);
    c.lineTo(24, 0);
    c.lineTo(0, 28);
    c.lineTo(-24, 0);
    c.closePath();
    c.stroke();
  },
  m6(c) {
    // The zigzag.
    c.beginPath();
    c.moveTo(-28, 14);
    c.lineTo(-14, -14);
    c.lineTo(0, 14);
    c.lineTo(14, -14);
    c.lineTo(28, 14);
    c.stroke();
  },
  m7(c) {
    // The hook.
    c.beginPath();
    c.moveTo(-8, -26);
    c.lineTo(-8, 12);
    c.arc(6, 12, 14, Math.PI, 0, true);
    c.lineTo(20, -2);
    c.stroke();
  },
  m8(c) {
    // The three dots.
    for (const x of [-18, 0, 18]) {
      c.beginPath();
      c.arc(x, 0, 6.5, 0, Math.PI * 2);
      c.fillStyle = INK;
      c.fill();
    }
  },
};

/** Draws a sign at a point, scaled (1 is about 70 wide). Unknown ids draw nothing. */
export function drawSign(c: Ctx, id: string, x: number, y: number, scale = 1): void {
  if (!SIGN[id]) return;
  c.save();
  c.translate(x, y);
  c.scale(scale, scale);
  c.lineJoin = "round";
  c.lineCap = "round";
  SIGN[id](c);
  c.restore();
}
/** Draws a mark at a point, scaled (1 is about 56 wide), in ink. */
export function drawMark(c: Ctx, id: string, x: number, y: number, scale = 1, ink: string = INK): void {
  if (!MARK[id]) return;
  c.save();
  c.translate(x, y);
  c.scale(scale, scale);
  c.lineJoin = "round";
  c.lineCap = "round";
  c.lineWidth = 6;
  c.strokeStyle = ink;
  MARK[id](c);
  c.restore();
}
/** A small canvas that shows one sign or one mark, for a table or a label. It is for the eye only; its name is in words beside it. */
export function glyphCanvas(kind: "sign" | "mark", id: string, size = 36): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const scale = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  canvas.width = size * scale;
  canvas.height = size * scale;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
  canvas.setAttribute("aria-hidden", "true");
  const c = canvas.getContext("2d");
  if (c) {
    c.setTransform(scale, 0, 0, scale, 0, 0);
    if (kind === "mark") {
      // A mark is ink on a page.
      c.fillStyle = PAL.parchment;
      c.fillRect(0, 0, size, size);
      drawMark(c, id, size / 2, size / 2, (size / 70) * 1.05);
    } else drawSign(c, id, size / 2, size / 2, size / 76);
  }
  return canvas;
}

export function cipherCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const scale = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  canvas.width = CIPHER_ART.w * scale;
  canvas.height = CIPHER_ART.h * scale;
  return canvas;
}
export function drawCipher(canvas: HTMLCanvasElement, v: CipherView): void {
  const c = canvas.getContext("2d");
  if (!c) return;
  const { w, h, perRow, cell, rowH, top } = CIPHER_ART;
  c.setTransform(canvas.width / w, 0, 0, canvas.height / h, 0, 0);
  c.lineJoin = "round";
  c.lineCap = "round";
  const wall = c.createLinearGradient(0, 0, 0, h);
  wall.addColorStop(0, PAL.tealDark);
  wall.addColorStop(1, PAL.night);
  c.fillStyle = wall;
  c.fillRect(0, 0, w, h);
  // The page: parchment with a border, torn a little at the edges by a stormy outline.
  c.beginPath();
  c.moveTo(30, 18);
  c.lineTo(w - 30, 14);
  c.lineTo(w - 22, h - 20);
  c.lineTo(36, h - 14);
  c.closePath();
  fill(c, PAL.parchment, PAL.woodDark, 4);
  const rows = Math.ceil(v.message.length / perRow);
  for (let i = 0; i < v.message.length; i++) {
    const { x, y } = cipherCell(i, v.message.length, v.rtl);
    drawMark(c, v.message[i]!, x, y, 0.72);
    // The place under the mark for its sign: empty, or with the sign given to it.
    const sign = v.guess[v.message[i]!];
    c.beginPath();
    rounded(c, x - 26, y + 34, 52, 52, 10);
    if (sign) {
      c.fillStyle = "rgba(43,79,163,0.14)";
      c.fill();
      c.strokeStyle = PAL.lapis;
      c.setLineDash([]);
    } else {
      c.strokeStyle = "rgba(42,26,18,0.55)";
      c.setLineDash([5, 5]);
    }
    c.lineWidth = 2.2;
    c.stroke();
    c.setLineDash([]);
    if (sign) drawSign(c, sign, x, y + 60, 0.62);
  }
  // The opening: a thin line under the first two places of the first row, as the page's note says every page begins.
  const a = cipherCell(0, v.message.length, v.rtl);
  const b = cipherCell(1, v.message.length, v.rtl);
  c.strokeStyle = PAL.red;
  c.lineWidth = 3;
  c.beginPath();
  c.moveTo(a.x - 28 * (v.rtl ? -1 : 1), top + 98);
  c.lineTo(b.x + 28 * (v.rtl ? -1 : 1), top + 98);
  c.stroke();
  if (v.done) {
    c.save();
    c.translate(w / 2, top + rows * rowH + 10);
    c.strokeStyle = PAL.emerald;
    c.lineWidth = 6;
    c.beginPath();
    c.moveTo(-18, 0);
    c.lineTo(-4, 14);
    c.lineTo(20, -14);
    c.stroke();
    c.restore();
  }
}
