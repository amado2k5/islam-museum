// The elephant clock's workbench, drawn in code: five places in a row with the part standing in each, and the spare
// parts to one side. A trial picture, replaceable like every picture in this game; it carries no words, so that the
// page's own text (in seven languages) says everything the picture shows.
import { INK, PAL } from "./kit";

type Ctx = CanvasRenderingContext2D;
export const BENCH = { w: 1000, h: 380, places: 5, x0: 110, dx: 150, y: 190, spareX: 860 } as const;
export interface BenchView {
  places: (string | null)[];
  spare: string[];
  /** Places the motion has passed through so far in a run. */
  lit: number;
  /** The place where a run stopped without doing its work, or null. */
  stopped: number | null;
  done: boolean;
  /** The page reads right to left: the first place is on the right, as the list of places under the picture is. */
  rtl: boolean;
}

const ICON: Record<string, (c: Ctx) => void> = {
  // A brass half-ball with one small hole, sitting in water.
  float(c) {
    c.strokeStyle = "#7fd0e0";
    c.lineWidth = 3;
    for (const y of [26, 38]) {
      c.beginPath();
      c.moveTo(-46, y);
      c.bezierCurveTo(-24, y - 10, -8, y + 10, 12, y);
      c.bezierCurveTo(26, y - 8, 36, y + 6, 46, y);
      c.stroke();
    }
    c.beginPath();
    c.arc(0, -4, 36, 0, Math.PI);
    c.closePath();
    fill(c, PAL.brass);
    c.beginPath();
    c.arc(0, 18, 4, 0, Math.PI * 2);
    fill(c, INK, null);
  },
  // A falcon with a ball in its beak.
  falcon(c) {
    c.beginPath();
    c.ellipse(-4, 6, 24, 34, 0.2, 0, Math.PI * 2);
    fill(c, PAL.ochre);
    c.beginPath();
    c.arc(8, -32, 17, 0, Math.PI * 2);
    fill(c, PAL.wood);
    c.beginPath();
    c.moveTo(22, -34);
    c.quadraticCurveTo(40, -30, 30, -16);
    c.lineTo(22, -24);
    c.closePath();
    fill(c, PAL.gold);
    c.beginPath();
    c.arc(12, -36, 3, 0, Math.PI * 2);
    fill(c, INK, null);
    ball(c, 34, -6);
  },
  // A dragon's neck and open jaws, bowing down.
  dragon(c) {
    c.lineWidth = 20;
    c.strokeStyle = INK;
    path(c);
    c.lineWidth = 15;
    c.strokeStyle = PAL.emerald;
    path(c);
    c.beginPath();
    c.moveTo(18, 14);
    c.lineTo(46, 22);
    c.lineTo(22, 30);
    c.lineTo(44, 42);
    c.lineTo(12, 40);
    c.closePath();
    fill(c, PAL.emerald);
    c.beginPath();
    c.arc(22, 16, 3, 0, Math.PI * 2);
    fill(c, PAL.goldLight, null);
    function path(k: Ctx) {
      k.beginPath();
      k.moveTo(-34, 40);
      k.bezierCurveTo(-44, -10, -10, -50, 6, -22);
      k.bezierCurveTo(14, -6, 8, 8, 18, 22);
      k.stroke();
    }
  },
  // A vessel with a round gong hanging in it.
  vessel(c) {
    c.beginPath();
    c.moveTo(-30, -40);
    c.lineTo(30, -40);
    c.quadraticCurveTo(46, 10, 22, 42);
    c.lineTo(-22, 42);
    c.quadraticCurveTo(-46, 10, -30, -40);
    c.closePath();
    fill(c, PAL.lapis);
    c.beginPath();
    c.arc(0, 0, 19, 0, Math.PI * 2);
    fill(c, PAL.gold);
    c.beginPath();
    c.arc(0, 0, 7, 0, Math.PI * 2);
    fill(c, PAL.brass);
    c.strokeStyle = INK;
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(0, -19);
    c.lineTo(0, -40);
    c.stroke();
  },
  // A shallow bowl with the balls gathered in it.
  bowl(c) {
    ball(c, -16, 8);
    ball(c, 2, 4);
    ball(c, 18, 9);
    c.beginPath();
    c.moveTo(-44, 12);
    c.quadraticCurveTo(0, 62, 44, 12);
    c.closePath();
    fill(c, PAL.terracotta);
  },
  // A small bird on a dome.
  bird(c) {
    c.beginPath();
    c.arc(0, 40, 34, Math.PI, 0);
    c.closePath();
    fill(c, PAL.teal);
    c.beginPath();
    c.ellipse(-2, -6, 20, 15, 0, 0, Math.PI * 2);
    fill(c, PAL.red);
    c.beginPath();
    c.arc(16, -18, 10, 0, Math.PI * 2);
    fill(c, PAL.red);
    c.beginPath();
    c.moveTo(25, -19);
    c.lineTo(38, -15);
    c.lineTo(25, -12);
    c.closePath();
    fill(c, PAL.gold);
    c.beginPath();
    c.moveTo(-20, -8);
    c.lineTo(-40, -18);
    c.lineTo(-36, 2);
    c.closePath();
    fill(c, PAL.red);
  },
  // A seated rider in a turban with an arm raised.
  rider(c) {
    c.beginPath();
    c.moveTo(-26, 44);
    c.quadraticCurveTo(-30, -6, 0, -8);
    c.quadraticCurveTo(30, -6, 26, 44);
    c.closePath();
    fill(c, PAL.amber);
    c.beginPath();
    c.arc(0, -22, 14, 0, Math.PI * 2);
    fill(c, "#c98d5e");
    c.beginPath();
    c.ellipse(0, -34, 18, 10, 0, 0, Math.PI * 2);
    fill(c, PAL.cream);
    c.strokeStyle = INK;
    c.lineWidth = 9;
    c.beginPath();
    c.moveTo(18, 4);
    c.lineTo(38, -20);
    c.stroke();
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(38, -20);
    c.lineTo(46, -46);
    c.stroke();
  },
};
function fill(c: Ctx, colour: string, line: string | null = INK): void {
  c.fillStyle = colour;
  c.fill();
  if (line) {
    c.strokeStyle = line;
    c.lineWidth = 2.6;
    c.stroke();
  }
}
function ball(c: Ctx, x: number, y: number): void {
  c.beginPath();
  c.arc(x, y, 8, 0, Math.PI * 2);
  fill(c, PAL.goldLight);
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

/** Makes a canvas for the bench, sharp on the screen it is on. */
export function benchCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const scale = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  canvas.width = BENCH.w * scale;
  canvas.height = BENCH.h * scale;
  return canvas;
}
export function drawBench(canvas: HTMLCanvasElement, v: BenchView): void {
  const c = canvas.getContext("2d");
  if (!c) return;
  c.setTransform(canvas.width / BENCH.w, 0, 0, canvas.height / BENCH.h, 0, 0);
  c.lineJoin = "round";
  c.lineCap = "round";
  // The wall and the bench.
  const wall = c.createLinearGradient(0, 0, 0, BENCH.h);
  wall.addColorStop(0, PAL.tealDark);
  wall.addColorStop(1, PAL.night);
  c.fillStyle = wall;
  c.fillRect(0, 0, BENCH.w, BENCH.h);
  c.fillStyle = PAL.wood;
  c.fillRect(0, 290, BENCH.w, 90);
  c.fillStyle = PAL.woodDark;
  c.fillRect(0, 290, BENCH.w, 10);
  // On a right-to-left page the whole bench is laid out the other way round; the parts themselves are not mirrored.
  const across = (x: number) => (v.rtl ? BENCH.w - x : x);
  // The road the motion takes, from place to place.
  c.strokeStyle = "rgba(255,227,154,0.35)";
  c.lineWidth = 6;
  c.setLineDash([4, 14]);
  c.beginPath();
  c.moveTo(across(BENCH.x0 - 60), BENCH.y);
  c.lineTo(across(BENCH.x0 + BENCH.dx * (BENCH.places - 1) + 60), BENCH.y);
  c.stroke();
  c.setLineDash([]);
  v.places.forEach((id, i) => {
    const x = across(BENCH.x0 + i * BENCH.dx);
    const moved = i < v.lit;
    const stopped = v.stopped === i;
    rounded(c, x - 62, BENCH.y - 78, 124, 156, 18);
    c.fillStyle = stopped ? "rgba(168,53,46,0.55)" : moved ? "rgba(242,185,75,0.4)" : "rgba(16,48,90,0.75)";
    c.fill();
    c.strokeStyle = stopped ? "#ff8f84" : moved ? PAL.goldLight : PAL.tealLight;
    c.lineWidth = stopped || moved ? 5 : 2.5;
    // A place that stopped the run is marked by a broken outline as well as by colour.
    c.setLineDash(stopped ? [12, 8] : []);
    c.stroke();
    c.setLineDash([]);
    // The place's number, as dots: no numeral is drawn, so that no language is left out.
    for (let d = 0; d <= i; d++) {
      c.beginPath();
      c.arc(x - (i * 14) / 2 + d * 14, BENCH.y + 100, 4.5, 0, Math.PI * 2);
      fill(c, PAL.cream, null);
    }
    if (id && ICON[id]) {
      c.save();
      c.translate(x, BENCH.y);
      ICON[id](c);
      c.restore();
    }
  });
  // The box of spare parts.
  const boxX = across(BENCH.spareX + 20);
  rounded(c, boxX - 90, 60, 180, 240, 14);
  c.fillStyle = "rgba(74,42,20,0.9)";
  c.fill();
  c.strokeStyle = PAL.brass;
  c.lineWidth = 3;
  c.stroke();
  v.spare.slice(0, 2).forEach((id, i) => {
    if (!ICON[id]) return;
    c.save();
    c.translate(boxX, 125 + i * 112);
    c.scale(0.85, 0.85);
    ICON[id](c);
    c.restore();
  });
  if (v.done) {
    // The page of the Atlas, come loose above the last place.
    c.save();
    c.translate(across(BENCH.x0 + BENCH.dx * (BENCH.places - 1)), 52);
    c.rotate(-0.12);
    rounded(c, -34, -40, 68, 80, 6);
    fill(c, PAL.parchment);
    c.strokeStyle = PAL.lapis;
    c.lineWidth = 3;
    for (const y of [-20, -4, 12]) {
      c.beginPath();
      c.moveTo(-20, y);
      c.lineTo(20, y);
      c.stroke();
    }
    c.restore();
  }
}
