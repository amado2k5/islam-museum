// The things in the room: mirrors on their stands, the prism, the page of the Atlas, the curtain and its cord, the
// feather, and the light itself.
import { INK, PAL, blob, brush, fillStroke, linear, radial, sheet, type Painted } from "./kit";

/** A round mirror in a brass frame, drawn lying flat; the game turns the sprite to one lean or the other. */
export function mirror(scale: number): Painted {
  const [p, ctx] = sheet(110, 44, scale);
  ctx.beginPath();
  ctx.ellipse(55, 22, 50, 12, 0, 0, Math.PI * 2);
  fillStroke(ctx, PAL.brass, INK, 2.4);
  ctx.beginPath();
  ctx.ellipse(55, 20, 43, 7.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = linear(ctx, 12, 0, 98, 0, [
    [0, "#9fd4dc"],
    [0.35, "#f4fdff"],
    [0.6, "#b9e3ea"],
    [1, "#6aa7b6"],
  ]);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(30, 18);
  ctx.lineTo(52, 16);
  ctx.stroke();
  return p;
}
/** The stand under a mirror: a brass fork on a turned wooden post of the given height. */
export function stand(scale: number, height: number): Painted {
  const w = 60;
  const [p, ctx] = sheet(w, height, scale);
  ctx.strokeStyle = PAL.brass;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(8, 4);
  ctx.quadraticCurveTo(8, 30, 30, 32);
  ctx.quadraticCurveTo(52, 30, 52, 4);
  ctx.stroke();
  if (height > 50) {
    ctx.fillStyle = linear(ctx, 22, 0, 38, 0, [
      [0, "#a8703c"],
      [1, PAL.woodDark],
    ]);
    ctx.fillRect(25, 32, 10, height - 44);
    blob(ctx, [
      [8, height],
      [14, height - 14],
      [46, height - 14],
      [52, height],
    ]);
    fillStroke(ctx, PAL.wood, INK, 2);
  }
  return p;
}
export function prism(scale: number): Painted {
  const [p, ctx] = sheet(90, 96, scale);
  ctx.strokeStyle = PAL.brass;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(45, 0);
  ctx.lineTo(45, 18);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(45, 16);
  ctx.lineTo(84, 84);
  ctx.lineTo(6, 84);
  ctx.closePath();
  ctx.fillStyle = linear(ctx, 6, 84, 84, 20, [
    [0, "rgba(190,235,255,0.55)"],
    [0.5, "rgba(255,255,255,0.8)"],
    [1, "rgba(200,220,255,0.5)"],
  ]);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.95)";
  ctx.lineWidth = 2.4;
  ctx.stroke();
  ctx.strokeStyle = "rgba(120,170,210,0.8)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(45, 16);
  ctx.lineTo(56, 84);
  ctx.stroke();
  return p;
}

/** The page of the Atlas. Pale: the ink has almost gone. Restored: a small picture of a bird, a sun and a road.
 * The marks that stand for writing are plain strokes, on purpose: they are not script in any language. */
export function page(scale: number, restored: boolean): Painted {
  const [p, ctx] = sheet(110, 120, scale);
  ctx.save();
  ctx.translate(55, 60);
  ctx.rotate(-0.07);
  blob(ctx, [
    [-46, -52],
    [44, -54],
    [47, 50],
    [-43, 53],
  ]);
  fillStroke(ctx, restored ? "#fbf0cf" : "#e9dfc8", restored ? "#7a4a26" : "#b9ad93", 2.2);
  const ink = restored ? 1 : 0.16;
  ctx.globalAlpha = ink;
  ctx.strokeStyle = PAL.lapis;
  ctx.lineWidth = 3;
  ctx.strokeRect(-36, -44, 72, 88);
  ctx.fillStyle = PAL.gold;
  ctx.beginPath();
  ctx.arc(14, -22, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PAL.hoopoe;
  blob(ctx, [
    [-24, -10],
    [-8, -18],
    [2, -8],
    [-8, 2],
    [-22, 0],
  ]);
  ctx.fill();
  ctx.strokeStyle = PAL.emerald;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-30, 30);
  ctx.quadraticCurveTo(-8, 8, 10, 24);
  ctx.quadraticCurveTo(22, 34, 32, 14);
  ctx.stroke();
  ctx.strokeStyle = PAL.red;
  ctx.lineWidth = 2;
  for (const y of [34, 40]) {
    ctx.beginPath();
    ctx.moveTo(-28, y);
    ctx.lineTo(26, y);
    ctx.stroke();
  }
  ctx.restore();
  return p;
}

export function feather(scale: number): Painted {
  const [p, ctx] = sheet(40, 78, scale);
  blob(ctx, [
    [20, 2],
    [34, 26],
    [28, 58],
    [20, 66],
    [12, 58],
    [6, 26],
  ]);
  fillStroke(ctx, PAL.hoopoe, INK, 1.8);
  ctx.fillStyle = "#1c1410";
  blob(ctx, [
    [20, 2],
    [29, 14],
    [20, 20],
    [11, 14],
  ]);
  ctx.fill();
  ctx.fillStyle = "#fff6e0";
  ctx.fillRect(10, 20, 20, 4);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(20, 20);
  ctx.lineTo(20, 76);
  ctx.stroke();
  return p;
}

/** The curtain that closes the arch: a heavy cloth with a gold band. Drawn closed; the game slides it across. */
export function curtain(scale: number): Painted {
  const w = 300;
  const h = 500;
  const [p, ctx] = sheet(w, h, scale);
  ctx.fillStyle = linear(ctx, 0, 0, w, 0, [
    [0, "#5a1620"],
    [0.2, "#8e2a2e"],
    [0.4, "#5f1822"],
    [0.6, "#93302f"],
    [0.8, "#5a1620"],
    [1, "#7d2429"],
  ]);
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#d9a441";
  ctx.fillRect(0, 40, w, 10);
  ctx.fillRect(0, h - 60, w, 14);
  ctx.strokeStyle = "rgba(20,5,10,0.4)";
  ctx.lineWidth = 3;
  for (let x = 30; x < w; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.quadraticCurveTo(x + 8, h / 2, x, h);
    ctx.stroke();
  }
  brush(ctx, w, h, "curtain", { strength: 0.6, strokes: 500 });
  return p;
}
export function cord(scale: number): Painted {
  const [p, ctx] = sheet(30, 90, scale);
  ctx.strokeStyle = "#d9a441";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(15, 0);
  ctx.lineTo(15, 56);
  ctx.stroke();
  blob(ctx, [
    [15, 52],
    [25, 62],
    [22, 88],
    [8, 88],
    [5, 62],
  ]);
  fillStroke(ctx, "#b8443c", INK, 1.8);
  ctx.fillStyle = "#d9a441";
  ctx.fillRect(7, 60, 16, 5);
  return p;
}

/** A length of the beam, to be stretched along a segment and drawn additively: bright in the middle, soft outside. */
export function beamStrip(scale: number): Painted {
  const [p, ctx] = sheet(64, 28, scale);
  ctx.fillStyle = linear(ctx, 0, 0, 0, 28, [
    [0, "rgba(255,220,140,0)"],
    [0.35, "rgba(255,226,150,0.5)"],
    [0.5, "rgba(255,252,230,1)"],
    [0.65, "rgba(255,226,150,0.5)"],
    [1, "rgba(255,220,140,0)"],
  ]);
  ctx.fillRect(0, 0, 64, 28);
  return p;
}
/** The beam after the prism: the colours side by side across its width. */
export function rainbowStrip(scale: number): Painted {
  const [p, ctx] = sheet(64, 40, scale);
  ctx.fillStyle = linear(ctx, 0, 0, 0, 40, [
    [0, "rgba(255,60,60,0)"],
    [0.12, "rgba(255,70,70,0.9)"],
    [0.28, "rgba(255,160,50,0.9)"],
    [0.42, "rgba(255,235,80,0.9)"],
    [0.56, "rgba(90,210,110,0.9)"],
    [0.72, "rgba(70,150,255,0.9)"],
    [0.88, "rgba(150,90,230,0.9)"],
    [1, "rgba(150,90,230,0)"],
  ]);
  ctx.fillRect(0, 0, 64, 40);
  return p;
}
export function mote(scale: number): Painted {
  const [p, ctx] = sheet(12, 12, scale);
  ctx.fillStyle = radial(ctx, 6, 6, 0, 6, [
    [0, "rgba(255,240,200,1)"],
    [1, "rgba(255,240,200,0)"],
  ]);
  ctx.fillRect(0, 0, 12, 12);
  return p;
}
export function sparkle(scale: number): Painted {
  const [p, ctx] = sheet(28, 28, scale);
  ctx.fillStyle = "#fff6cf";
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const r = i % 2 === 0 ? 13 : 3.4;
    ctx.lineTo(14 + Math.cos(a) * r, 14 + Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();
  return p;
}
/** A flat black sheet, tinted and faded by the game to darken the room. */
export function shade(scale: number): Painted {
  const [p, ctx] = sheet(16, 16, scale);
  ctx.fillStyle = "#020a14";
  ctx.fillRect(0, 0, 16, 16);
  return p;
}
