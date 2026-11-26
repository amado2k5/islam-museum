// The locked box's problem, drawn in code: two trays side by side with an equals sign between them. A thing is a small
// closed box; one unit of number is a coin; an amount taken away is a hollow outline of the same shape with a bar
// through it (shape, not colour alone). There is no pair of scales: nothing read for this game says he used one. A
// trial picture, replaceable like every picture in this game; it carries no words, so the page's own text (in seven
// languages) says everything the picture shows.
import type { Equation, Side } from "../sim/algebra";
import { INK, PAL } from "./kit";

type Ctx = CanvasRenderingContext2D;
export const ALGEBRA_ART = { w: 1000, h: 420, trayW: 420, trayTop: 78, trayH: 300, pad: 16, boxSize: 52, boxPitch: 62, boxRow: 66, coinSize: 28, coinPitch: 34, coinRow: 38 } as const;
export interface AlgebraView {
  eq: Equation;
  /** The page reads right to left: the first side is on the right. */
  rtl: boolean;
  /** The box is open. */
  done: boolean;
}
export interface Item {
  kind: "box" | "coin";
  /** Taken away: drawn hollow, with a bar through it. */
  hollow: boolean;
  /** The centre, from the top left of the tray's inside. */
  x: number;
  y: number;
}

/** Where the things and the coins of one side go in a tray: things, then number, then what is taken away of each, a group to a row (or more). */
export function trayLayout(s: Side): { items: Item[]; height: number } {
  const { trayW, pad, boxPitch, boxRow, coinPitch, coinRow, boxSize, coinSize } = ALGEBRA_ART;
  const inner = trayW - 2 * pad;
  const items: Item[] = [];
  let y = 0;
  const group = (kind: "box" | "coin", count: number, hollow: boolean) => {
    if (count === 0) return;
    const pitch = kind === "box" ? boxPitch : coinPitch;
    const row = kind === "box" ? boxRow : coinRow;
    const size = kind === "box" ? boxSize : coinSize;
    const perRow = Math.max(1, Math.floor((inner - (size - pitch)) / pitch));
    for (let i = 0; i < count; i++) {
      items.push({ kind, hollow, x: size / 2 + (i % perRow) * pitch, y: y + Math.floor(i / perRow) * row + row / 2 });
    }
    y += Math.ceil(count / perRow) * row;
  };
  group("box", s.things, false);
  group("coin", s.number, false);
  group("box", s.lessThings, true);
  group("coin", s.lessNumber, true);
  return { items, height: y };
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
/** The bar through a hollow shape: the sign for "taken away". */
function bar(c: Ctx, x: number, y: number, half: number): void {
  c.save();
  c.setLineDash([]);
  c.strokeStyle = INK;
  c.lineWidth = 9;
  c.beginPath();
  c.moveTo(x - half, y);
  c.lineTo(x + half, y);
  c.stroke();
  c.strokeStyle = PAL.cream;
  c.lineWidth = 4;
  c.beginPath();
  c.moveTo(x - half, y);
  c.lineTo(x + half, y);
  c.stroke();
  c.restore();
}
function drawBox(c: Ctx, x: number, y: number, hollow: boolean): void {
  const s = ALGEBRA_ART.boxSize;
  c.save();
  c.lineWidth = 3;
  rounded(c, x - s / 2, y - s / 2 + 4, s, s - 8, 7);
  if (hollow) {
    c.setLineDash([6, 5]);
    c.strokeStyle = INK;
    c.stroke();
    c.setLineDash([]);
    bar(c, x, y, s / 2 - 4);
  } else {
    c.fillStyle = PAL.wood;
    c.fill();
    c.strokeStyle = INK;
    c.stroke();
    // The lid and the clasp.
    c.beginPath();
    c.moveTo(x - s / 2 + 2, y - 5);
    c.lineTo(x + s / 2 - 2, y - 5);
    c.stroke();
    c.fillStyle = PAL.brass;
    c.fillRect(x - 5, y - 9, 10, 12);
    c.strokeRect(x - 5, y - 9, 10, 12);
  }
  c.restore();
}
function drawCoin(c: Ctx, x: number, y: number, hollow: boolean): void {
  const r = ALGEBRA_ART.coinSize / 2;
  c.save();
  c.lineWidth = 3;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  if (hollow) {
    c.setLineDash([5, 4]);
    c.strokeStyle = INK;
    c.stroke();
    c.setLineDash([]);
    bar(c, x, y, r - 2);
  } else {
    c.fillStyle = PAL.gold;
    c.fill();
    c.strokeStyle = INK;
    c.stroke();
    c.beginPath();
    c.arc(x, y, r - 6, 0, Math.PI * 2);
    c.lineWidth = 2;
    c.strokeStyle = PAL.amber;
    c.stroke();
  }
  c.restore();
}
function tray(c: Ctx, x: number, s: Side): void {
  const { trayW, trayTop, trayH, pad } = ALGEBRA_ART;
  rounded(c, x, trayTop, trayW, trayH, 16);
  c.fillStyle = PAL.parchment;
  c.fill();
  c.strokeStyle = PAL.woodDark;
  c.lineWidth = 5;
  c.stroke();
  // The rim of the tray.
  c.fillStyle = PAL.woodDark;
  c.fillRect(x + 18, trayTop + trayH - 4, trayW - 36, 10);
  const { items } = trayLayout(s);
  for (const it of items) (it.kind === "box" ? drawBox : drawCoin)(c, x + pad + it.x, trayTop + pad + it.y, it.hollow);
}
/** A padlock above the trays: closed until the box opens. */
function lock(c: Ctx, x: number, y: number, open: boolean): void {
  c.save();
  c.translate(x, y);
  c.lineWidth = 6;
  c.strokeStyle = PAL.brass;
  c.beginPath();
  if (open) c.arc(14, -10, 12, Math.PI, 0);
  else c.arc(0, -10, 12, Math.PI, 0);
  c.lineTo(open ? 26 : 12, open ? -10 : -2);
  c.stroke();
  rounded(c, -20, -4, 40, 28, 6);
  c.fillStyle = PAL.gold;
  c.fill();
  c.lineWidth = 3;
  c.strokeStyle = INK;
  c.stroke();
  c.fillStyle = INK;
  c.beginPath();
  c.arc(0, 8, 4, 0, Math.PI * 2);
  c.fill();
  c.restore();
}

export function algebraCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const scale = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  canvas.width = ALGEBRA_ART.w * scale;
  canvas.height = ALGEBRA_ART.h * scale;
  return canvas;
}
export function drawAlgebra(canvas: HTMLCanvasElement, v: AlgebraView): void {
  const c = canvas.getContext("2d");
  if (!c) return;
  const { w, h, trayW, trayTop, trayH } = ALGEBRA_ART;
  c.setTransform(canvas.width / w, 0, 0, canvas.height / h, 0, 0);
  c.lineJoin = "round";
  c.lineCap = "round";
  const wall = c.createLinearGradient(0, 0, 0, h);
  wall.addColorStop(0, PAL.tealDark);
  wall.addColorStop(1, PAL.night);
  c.fillStyle = wall;
  c.fillRect(0, 0, w, h);
  const xs = [40, w - 40 - trayW];
  const [first, second] = v.rtl ? [xs[1]!, xs[0]!] : [xs[0]!, xs[1]!];
  tray(c, first, v.eq.left);
  tray(c, second, v.eq.right);
  // The equals sign between the trays.
  c.fillStyle = PAL.goldLight;
  c.strokeStyle = INK;
  c.lineWidth = 2;
  for (const dy of [-14, 6]) {
    rounded(c, w / 2 - 30, trayTop + trayH / 2 + dy, 60, 9, 4);
    c.fill();
    c.stroke();
  }
  lock(c, w / 2, 40, v.done);
}
