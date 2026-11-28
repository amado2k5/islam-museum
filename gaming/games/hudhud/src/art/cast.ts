// The cast, in parts: each character is a handful of small pictures that the scene pins together and moves (a head
// that bobs and blinks, an arm that points, a crest that opens, a tail that flicks). Cut-out animation in code: no
// skeletal runtime, no paid tool.
//
// Who they are. Hudhud is the founder's hoopoe: orange, a fan of black-tipped crest feathers, barred black and white
// wings, a long curved beak. The Storykeeper is the player's own child of the museum, with a choice of skin, clothes
// and hair. The scholar stands for Ibn al-Haytham and is an imagining, as the founder's pictures of him are: no
// portrait of him from his own time is known to the museum, and the game says so in its notes. The cat is the cat.
import { INK, PAL, blob, brush, fillStroke, linear, sheet, type Ctx, type Painted } from "./kit";

export const SKINS = ["#f1c9a0", "#d9a06e", "#b0744a", "#7c4a2c"] as const;
export const OUTFITS = [
  { tunic: "#1d7f86", trim: "#f2b94b", vest: "#8a4a22" },
  { tunic: "#b8443c", trim: "#f3e6c8", vest: "#3d2a5a" },
  { tunic: "#3f8f5b", trim: "#f2b94b", vest: "#22476b" },
] as const;
export const HAIRS = 4;

interface Face {
  skin: string;
  open: boolean;
  /** Radius of the head. */
  r: number;
  brow?: string;
}
function eyes(ctx: Ctx, cx: number, cy: number, f: Face, gap: number, size: number): void {
  for (const side of [-1, 1]) {
    const x = cx + side * gap;
    if (f.open) {
      ctx.beginPath();
      ctx.ellipse(x, cy, size * 0.82, size, 0, 0, Math.PI * 2);
      fillStroke(ctx, "#fffdf6", INK, 1.6);
      ctx.fillStyle = "#3a2314";
      ctx.beginPath();
      ctx.arc(x + size * 0.18, cy + size * 0.1, size * 0.58, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(x + size * 0.4, cy - size * 0.25, size * 0.2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, cy - size * 0.2, size * 0.8, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    }
    ctx.strokeStyle = f.brow ?? INK;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(x - size, cy - size * 1.7);
    ctx.quadraticCurveTo(x, cy - size * 2.2, x + size, cy - size * 1.6);
    ctx.stroke();
  }
}
function smile(ctx: Ctx, cx: number, cy: number, w: number, open: boolean): void {
  ctx.beginPath();
  ctx.moveTo(cx - w, cy);
  ctx.quadraticCurveTo(cx, cy + w * 1.1, cx + w, cy);
  if (open) {
    ctx.quadraticCurveTo(cx, cy + w * 0.3, cx - w, cy);
    fillStroke(ctx, "#7a2a22", INK, 1.6);
  } else {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
function blush(ctx: Ctx, x: number, y: number, r: number): void {
  ctx.fillStyle = "rgba(230,110,90,0.28)";
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
}

// ---------------------------------------------------------------------------------------------- Hudhud
export interface HudhudArt {
  body: Painted;
  tail: Painted;
  wing: Painted;
  wingOpen: Painted;
  head: Painted;
  headBlink: Painted;
  crest: Painted;
  legs: Painted;
}
function hudhudHead(scale: number, open: boolean): Painted {
  const [p, ctx] = sheet(92, 50, scale);
  // The long, gently curved beak.
  ctx.beginPath();
  ctx.moveTo(38, 24);
  ctx.quadraticCurveTo(66, 22, 90, 36);
  ctx.quadraticCurveTo(64, 30, 38, 33);
  ctx.closePath();
  fillStroke(ctx, "#4a3a34", INK, 1.6);
  ctx.beginPath();
  ctx.arc(24, 26, 21, 0, Math.PI * 2);
  fillStroke(ctx, linear(ctx, 0, 6, 0, 48, [[0, PAL.hoopoeLight], [1, PAL.hoopoe]]), INK, 2.2);
  if (open) {
    ctx.beginPath();
    ctx.arc(30, 22, 7.5, 0, Math.PI * 2);
    fillStroke(ctx, "#fffdf6", INK, 1.6);
    ctx.fillStyle = "#1c120c";
    ctx.beginPath();
    ctx.arc(31.5, 22.5, 4.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(33, 20.5, 1.6, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(30, 20, 6.5, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }
  blush(ctx, 22, 34, 6);
  return p;
}
export function hudhud(scale: number): HudhudArt {
  const [body, b] = sheet(78, 62, scale);
  blob(b, [
    [8, 30],
    [22, 8],
    [52, 6],
    [72, 26],
    [66, 50],
    [40, 60],
    [16, 52],
  ]);
  fillStroke(b, linear(b, 0, 4, 0, 60, [[0, PAL.hoopoe], [0.7, PAL.hoopoeLight], [1, "#fde2a8"]]), INK, 2.4);
  brush(b, 78, 62, "hudhud-body", { strokes: 26, strength: 0.7 });

  const [tail, t] = sheet(54, 30, scale);
  blob(t, [
    [52, 10],
    [52, 22],
    [6, 28],
    [2, 8],
  ]);
  fillStroke(t, "#1c1410", INK, 2);
  t.fillStyle = "#fff6e0";
  t.fillRect(16, 7, 8, 21);
  t.fillRect(34, 8, 7, 18);

  const bars = (c: Ctx, w: number, h: number, n: number) => {
    c.save();
    c.globalCompositeOperation = "source-atop";
    c.fillStyle = "#fff6e0";
    for (let i = 0; i < n; i++) c.fillRect(0, (h / (n * 2 + 1)) * (i * 2 + 1), w, h / (n * 2 + 1));
    c.restore();
  };
  const [wing, wg] = sheet(56, 40, scale);
  blob(wg, [
    [52, 8],
    [40, 30],
    [10, 38],
    [2, 22],
    [26, 4],
  ]);
  wg.fillStyle = "#1c1410";
  wg.fill();
  bars(wg, 56, 40, 3);
  blob(wg, [
    [52, 8],
    [40, 30],
    [10, 38],
    [2, 22],
    [26, 4],
  ]);
  wg.strokeStyle = INK;
  wg.lineWidth = 2.2;
  wg.stroke();

  // The wing spread for flight: its root is at the bottom middle of the picture.
  const [wingOpen, wo] = sheet(96, 84, scale);
  const spread: [number, number][] = [
    [40, 82],
    [10, 60],
    [2, 30],
    [14, 6],
    [36, 2],
    [62, 8],
    [86, 26],
    [92, 50],
    [70, 76],
  ];
  blob(wo, spread);
  wo.fillStyle = "#1c1410";
  wo.fill();
  bars(wo, 96, 84, 4);
  blob(wo, spread);
  wo.strokeStyle = INK;
  wo.lineWidth = 2.2;
  wo.stroke();

  // The crest: a fan of feathers, each orange with a black tip. Its root is at the bottom middle.
  const [crest, c] = sheet(74, 56, scale);
  for (let i = 0; i < 8; i++) {
    const a = -Math.PI / 2 + (i - 3.5) * 0.23;
    const len = 46 - Math.abs(i - 3.5) * 2.5;
    c.save();
    c.translate(37, 54);
    c.rotate(a + Math.PI / 2);
    blob(c, [
      [0, 0],
      [5.5, -len * 0.5],
      [4.5, -len * 0.9],
      [0, -len],
      [-4.5, -len * 0.9],
      [-5.5, -len * 0.5],
    ]);
    fillStroke(c, PAL.hoopoe, INK, 1.4);
    blob(c, [
      [4.6, -len * 0.82],
      [0, -len],
      [-4.6, -len * 0.82],
      [0, -len * 0.74],
    ]);
    c.fillStyle = "#1c1410";
    c.fill();
    c.restore();
  }

  const [legs, l] = sheet(34, 18, scale);
  l.strokeStyle = "#6a5a50";
  l.lineWidth = 3;
  for (const x of [10, 22]) {
    l.beginPath();
    l.moveTo(x, 0);
    l.lineTo(x, 14);
    l.moveTo(x - 5, 16);
    l.lineTo(x, 14);
    l.lineTo(x + 7, 16);
    l.stroke();
  }
  return { body, tail, wing, wingOpen, head: hudhudHead(scale, true), headBlink: hudhudHead(scale, false), crest, legs };
}

// ---------------------------------------------------------------------------------------------- the Storykeeper
export interface KeeperArt {
  leg: Painted;
  body: Painted;
  arm: Painted;
  head: Painted;
  headBlink: Painted;
  satchel: Painted;
}
function keeperHead(scale: number, skin: string, hair: number, trim: string, open: boolean): Painted {
  const [p, ctx] = sheet(96, 104, scale);
  const cx = 48;
  const cy = 56;
  const dark = "#2a1a14";
  if (hair === 0) {
    // Short curls behind the face.
    for (let i = 0; i < 11; i++) {
      const a = Math.PI + (i / 10) * Math.PI;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * 34, cy - 6 + Math.sin(a) * 32, 13, 0, Math.PI * 2);
      fillStroke(ctx, dark, INK, 1.6);
    }
  } else if (hair === 3) {
    // Long hair in two braids, behind the face.
    blob(ctx, [
      [cx - 38, cy + 10],
      [cx - 36, cy - 30],
      [cx, cy - 46],
      [cx + 36, cy - 30],
      [cx + 38, cy + 10],
    ]);
    fillStroke(ctx, dark, INK, 2);
    for (const s of [-1, 1]) {
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.ellipse(cx + s * 36, cy + 14 + i * 9, 7.5 - i * 0.6, 6, 0, 0, Math.PI * 2);
        fillStroke(ctx, dark, INK, 1.6);
      }
      ctx.fillStyle = trim;
      ctx.fillRect(cx + s * 36 - 5, cy + 45, 10, 4);
    }
  } else if (hair === 1) {
    // A headscarf: cream, with a coloured band.
    blob(ctx, [
      [cx - 44, cy + 34],
      [cx - 42, cy - 26],
      [cx, cy - 52],
      [cx + 42, cy - 26],
      [cx + 44, cy + 34],
      [cx, cy + 46],
    ]);
    fillStroke(ctx, "#f3e6c8", INK, 2.2);
  }
  ctx.beginPath();
  ctx.ellipse(cx, cy, 33, 35, 0, 0, Math.PI * 2);
  fillStroke(ctx, skin, INK, 2.2);
  // Ears.
  if (hair !== 1) for (const s of [-1, 1]) (ctx.beginPath(), ctx.ellipse(cx + s * 33, cy + 4, 5, 8, 0, 0, Math.PI * 2), fillStroke(ctx, skin, INK, 1.6));
  if (hair === 3) {
    // A fringe swept to one side.
    blob(ctx, [
      [cx - 33, cy - 8],
      [cx - 30, cy - 34],
      [cx, cy - 40],
      [cx + 30, cy - 34],
      [cx + 33, cy - 10],
      [cx + 10, cy - 24],
      [cx - 14, cy - 18],
    ]);
    fillStroke(ctx, dark, INK, 1.8);
  } else if (hair === 0) {
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(cx - 26 + i * 10.5, cy - 30 + Math.abs(i - 2.5) * 2.2, 10, 0, Math.PI * 2);
      fillStroke(ctx, dark, INK, 1.4);
    }
  } else if (hair === 1) {
    ctx.strokeStyle = trim;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, 34, 1.1 * Math.PI, 1.9 * Math.PI);
    ctx.stroke();
  } else {
    // A round embroidered cap.
    blob(ctx, [
      [cx - 33, cy - 14],
      [cx - 28, cy - 42],
      [cx, cy - 50],
      [cx + 28, cy - 42],
      [cx + 33, cy - 14],
      [cx, cy - 22],
    ]);
    fillStroke(ctx, "#f3e6c8", INK, 2);
    ctx.strokeStyle = trim;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy - 20);
    ctx.quadraticCurveTo(cx, cy - 30, cx + 30, cy - 20);
    ctx.stroke();
    ctx.fillStyle = dark;
    for (const s of [-1, 1]) (ctx.beginPath(), ctx.arc(cx + s * 30, cy - 6, 7, 0, Math.PI * 2), ctx.fill());
  }
  eyes(ctx, cx + 3, cy + 2, { skin, open, r: 33 }, 13, 7.5);
  blush(ctx, cx - 16, cy + 16, 7);
  blush(ctx, cx + 22, cy + 16, 7);
  smile(ctx, cx + 4, cy + 17, 8, true);
  return p;
}
export function keeper(scale: number, look: { kind?: number; skin: number; outfit: number; hair: number }): KeeperArt {
  const skin = SKINS[look.skin % SKINS.length]!;
  const o = OUTFITS[look.outfit % OUTFITS.length]!;
  const [leg, l] = sheet(30, 70, scale);
  l.fillStyle = "#e9dcc0";
  l.fillRect(7, 0, 16, 52);
  l.strokeStyle = INK;
  l.lineWidth = 2;
  l.strokeRect(7, 0, 16, 52);
  blob(l, [
    [5, 52],
    [24, 52],
    [29, 62],
    [26, 68],
    [5, 68],
  ]);
  fillStroke(l, "#7a4a26", INK, 2);

  const [body, b] = sheet(96, 118, scale);
  blob(b, [
    [20, 8],
    [76, 8],
    [88, 60],
    [84, 114],
    [12, 114],
    [8, 60],
  ]);
  fillStroke(b, o.tunic, INK, 2.4);
  b.fillStyle = o.trim;
  b.fillRect(13, 100, 70, 7);
  blob(b, [
    [38, 8],
    [58, 8],
    [52, 44],
    [44, 44],
  ]);
  b.fill();
  // An open vest.
  for (const pts of [[[22, 9], [37, 9], [33, 84], [13, 84], [10, 58]], [[74, 9], [86, 58], [83, 84], [63, 84], [59, 9]]]) {
    b.beginPath();
    pts.forEach(([x, y], i) => (i ? b.lineTo(x!, y!) : b.moveTo(x!, y!)));
    b.closePath();
    fillStroke(b, o.vest, INK, 2);
  }
  brush(b, 96, 118, `keeper-body-${look.outfit}`, { strokes: 60, strength: 0.75 });

  const [arm, a] = sheet(28, 78, scale);
  blob(a, [
    [4, 4],
    [24, 4],
    [25, 54],
    [3, 54],
  ]);
  fillStroke(a, o.tunic, INK, 2);
  a.fillStyle = o.trim;
  a.fillRect(4, 48, 20, 5);
  a.beginPath();
  a.arc(14, 64, 10, 0, Math.PI * 2);
  fillStroke(a, skin, INK, 2);

  // The satchel, with the Atlas in it.
  const [satchel, s] = sheet(50, 56, scale);
  s.strokeStyle = "#5a3418";
  s.lineWidth = 4;
  s.beginPath();
  s.moveTo(40, 0);
  s.lineTo(22, 20);
  s.stroke();
  s.fillStyle = PAL.lapis;
  s.fillRect(14, 10, 24, 20);
  s.strokeStyle = INK;
  s.lineWidth = 1.6;
  s.strokeRect(14, 10, 24, 20);
  blob(s, [
    [4, 20],
    [46, 20],
    [44, 52],
    [6, 52],
  ]);
  fillStroke(s, "#9a6230", INK, 2.2);
  s.fillStyle = PAL.gold;
  s.fillRect(21, 30, 8, 9);
  return { leg, body, arm, head: keeperHead(scale, skin, look.hair % HAIRS, o.trim, true), headBlink: keeperHead(scale, skin, look.hair % HAIRS, o.trim, false), satchel };
}

/**
 * The apprentice in al-Jazari's workshop, an invented person: the same cut-out as the explorer, in one fixed look of
 * her own (a headscarf, a red tunic), with a work apron over the tunic.
 */
export function apprentice(scale: number): KeeperArt {
  const art = keeper(scale, { kind: 1, skin: 2, outfit: 1, hair: 1 });
  const [body, b] = sheet(art.body.w, art.body.h, scale);
  b.drawImage(art.body.canvas, 0, 0, art.body.w, art.body.h);
  blob(b, [
    [30, 40],
    [66, 40],
    [74, 112],
    [22, 112],
  ]);
  fillStroke(b, "#7a4a26", INK, 2);
  b.strokeStyle = "rgba(255,220,160,0.45)";
  b.lineWidth = 2;
  b.strokeRect(38, 66, 20, 16);
  return { ...art, body };
}

/**
 * The girl who cleans the instruments in al-Tusi's observatory, an invented person (she is the two circles' quest's
 * own): the same cut-out as the explorer, in one fixed look of her own (a headscarf, a green tunic), with a pale
 * cleaning cloth over her shoulder.
 */
export function cleaner(scale: number): KeeperArt {
  const art = keeper(scale, { kind: 1, skin: 1, outfit: 2, hair: 1 });
  const [body, b] = sheet(art.body.w, art.body.h, scale);
  b.drawImage(art.body.canvas, 0, 0, art.body.w, art.body.h);
  blob(b, [
    [58, 6],
    [74, 8],
    [70, 62],
    [62, 70],
    [54, 60],
  ]);
  fillStroke(b, "#efe6d2", INK, 2);
  b.strokeStyle = "rgba(120,100,70,0.5)";
  b.lineWidth = 1.5;
  for (const y of [24, 40]) {
    b.beginPath();
    b.moveTo(59, y);
    b.lineTo(71, y + 2);
    b.stroke();
  }
  return { ...art, body };
}

/**
 * The child who carries the box in al-Khwarizmi's room, an invented person (the locked box's quest's own): the same
 * cut-out as the explorer, in one fixed look of the child's own (a round cap, a red tunic), with a cloth strap across the
 * chest for carrying the box.
 */
export function boxCarrier(scale: number): KeeperArt {
  const art = keeper(scale, { kind: 0, skin: 3, outfit: 1, hair: 2 });
  const [body, b] = sheet(art.body.w, art.body.h, scale);
  b.drawImage(art.body.canvas, 0, 0, art.body.w, art.body.h);
  blob(b, [
    [24, 8],
    [34, 4],
    [76, 92],
    [66, 98],
  ]);
  fillStroke(b, "#d9c49a", INK, 2);
  return { ...art, body };
}

/**
 * The young messenger in al-Kindi's room, an invented person (the secret page's quest's own): the same cut-out as the
 * explorer, in one fixed look of the messenger's own (a boy in a green tunic), with a leather strap across the chest
 * and a small pouch at the hip for carrying pages.
 */
export function messenger(scale: number): KeeperArt {
  const art = keeper(scale, { kind: 0, skin: 2, outfit: 2, hair: 0 });
  const [body, b] = sheet(art.body.w, art.body.h, scale);
  b.drawImage(art.body.canvas, 0, 0, art.body.w, art.body.h);
  blob(b, [
    [70, 6],
    [80, 10],
    [28, 96],
    [18, 92],
  ]);
  fillStroke(b, "#7a4a26", INK, 2);
  blob(b, [
    [10, 86],
    [36, 86],
    [38, 110],
    [12, 110],
  ]);
  fillStroke(b, "#9a6232", INK, 2);
  return { ...art, body };
}

/**
 * The young helper in al-Idrisi's hall, an invented person (the scattered sheets' quest's own): the same cut-out as the
 * explorer, in one fixed look of the helper's own (a headscarf, a teal tunic), holding a loose sheet of parchment against
 * the chest, the sheets the helper dropped.
 */
export function mapHelper(scale: number): KeeperArt {
  const art = keeper(scale, { kind: 1, skin: 0, outfit: 0, hair: 1 });
  const [body, b] = sheet(art.body.w, art.body.h, scale);
  b.drawImage(art.body.canvas, 0, 0, art.body.w, art.body.h);
  blob(b, [
    [26, 40],
    [64, 34],
    [70, 82],
    [30, 88],
  ]);
  fillStroke(b, PAL.parchment, INK, 2);
  b.strokeStyle = "rgba(43,79,163,0.7)";
  b.lineWidth = 2.4;
  b.beginPath();
  b.moveTo(32, 70);
  b.quadraticCurveTo(46, 56, 62, 60);
  b.stroke();
  return { ...art, body };
}

/**
 * The child who helps in al-Razi's study, an invented person (the loose leaves' quest's own): the same cut-out as the
 * explorer, in one fixed look of the child's own (a boy in a red tunic), holding two loose leaves of plain paper
 * against the chest, the leaves the wind blew away. Nothing on them is written, and nothing about the child is medical.
 */
export function leafChild(scale: number): KeeperArt {
  const art = keeper(scale, { kind: 0, skin: 0, outfit: 1, hair: 0 });
  const [body, b] = sheet(art.body.w, art.body.h, scale);
  b.drawImage(art.body.canvas, 0, 0, art.body.w, art.body.h);
  blob(b, [
    [24, 44],
    [60, 38],
    [64, 90],
    [28, 94],
  ]);
  fillStroke(b, "#f6ecd2", INK, 2);
  blob(b, [
    [34, 36],
    [70, 34],
    [72, 84],
    [38, 88],
  ]);
  fillStroke(b, "#efe2c2", INK, 2);
  return { ...art, body };
}

/**
 * The boy who carries the copies in Karima al-Marwaziyya's room, an invented person (the copies' quest's own): the same
 * cut-out as the explorer, in one fixed look of the boy's own (a round cap, a teal tunic), holding a small bundle of plain
 * folded copies against the chest, tied with a cord. Nothing on them is drawn or written.
 */
export function copyBoy(scale: number): KeeperArt {
  const art = keeper(scale, { kind: 0, skin: 1, outfit: 0, hair: 2 });
  const [body, b] = sheet(art.body.w, art.body.h, scale);
  b.drawImage(art.body.canvas, 0, 0, art.body.w, art.body.h);
  for (const [dy, fill] of [[0, "#efe2c2"], [-7, "#f6ecd2"], [-14, "#efe2c2"]] as const) {
    blob(b, [
      [26, 64 + dy],
      [70, 60 + dy],
      [72, 78 + dy],
      [28, 82 + dy],
    ]);
    fillStroke(b, fill, INK, 1.8);
  }
  b.strokeStyle = "#9a6232";
  b.lineWidth = 2.4;
  b.beginPath();
  b.moveTo(48, 44);
  b.lineTo(50, 82);
  b.stroke();
  return { ...art, body };
}

/**
 * The child with the camel in Ibn Battuta's inn, an invented person (the road's quest's own): the same cut-out as the
 * explorer, in one fixed look of the child's own (a striped head cloth, an ochre tunic), holding the camel's rope, which
 * hangs from the hand in a loop. Nothing on it is drawn or written.
 */
export function camelChild(scale: number): KeeperArt {
  const art = keeper(scale, { kind: 1, skin: 2, outfit: 2, hair: 1 });
  const [body, b] = sheet(art.body.w, art.body.h, scale);
  b.drawImage(art.body.canvas, 0, 0, art.body.w, art.body.h);
  // A plain sash across the tunic.
  blob(b, [
    [14, 70],
    [82, 66],
    [82, 78],
    [14, 82],
  ]);
  fillStroke(b, "#c2643a", INK, 1.8);
  // The camel's rope, in a loop from the hand.
  b.strokeStyle = "#e8d6a8";
  b.lineWidth = 3;
  b.beginPath();
  b.moveTo(76, 60);
  b.quadraticCurveTo(90, 96, 70, 112);
  b.quadraticCurveTo(54, 118, 60, 100);
  b.stroke();
  return { ...art, body };
}

/**
 * The child who tidies the cards in the coffee room, an invented person (the coffee quest's own): the same cut-out as the
 * explorer, in one fixed look of the child's own (a round cap, a green tunic), holding a small stack of plain blank cards
 * against the chest. Nothing on them is drawn or written.
 */
export function cardChild(scale: number): KeeperArt {
  const art = keeper(scale, { kind: 0, skin: 1, outfit: 2, hair: 2 });
  const [body, b] = sheet(art.body.w, art.body.h, scale);
  b.drawImage(art.body.canvas, 0, 0, art.body.w, art.body.h);
  for (const [dx, dy, fill] of [[0, 0, "#efe2c2"], [4, -6, "#f6ecd2"], [-3, -12, "#fbf3df"]] as const) {
    blob(b, [
      [30 + dx, 52 + dy],
      [62 + dx, 50 + dy],
      [64 + dx, 88 + dy],
      [32 + dx, 90 + dy],
    ]);
    fillStroke(b, fill, INK, 1.8);
  }
  return { ...art, body };
}

/**
 * The girl who carries the cards in al-Jahiz's room, an invented person (the animal cards' quest's own): the same cut-out
 * as the explorer, in one fixed look of her own (a headscarf, a teal tunic), holding two plain blank cards against the
 * chest. Nothing on them is drawn or written.
 */
export function cardGirl(scale: number): KeeperArt {
  const art = keeper(scale, { kind: 1, skin: 3, outfit: 0, hair: 1 });
  const [body, b] = sheet(art.body.w, art.body.h, scale);
  b.drawImage(art.body.canvas, 0, 0, art.body.w, art.body.h);
  for (const [dx, dy, fill] of [[0, 0, "#f3e6c8"], [-5, -7, "#fbf3df"]] as const) {
    blob(b, [
      [34 + dx, 54 + dy],
      [64 + dx, 54 + dy],
      [64 + dx, 90 + dy],
      [34 + dx, 90 + dy],
    ]);
    fillStroke(b, fill, INK, 1.8);
  }
  return { ...art, body };
}

/**
 * The girl who sweeps the court in the Alhambra's court, an invented person (the channels' quest's own): the same cut-out
 * as the explorer, in one fixed look of her own (a headscarf, a red tunic), holding a plain broom of twigs across the
 * body. Nothing on it is drawn or written.
 */
export function sweeper(scale: number): KeeperArt {
  const art = keeper(scale, { kind: 1, skin: 2, outfit: 1, hair: 1 });
  const [body, b] = sheet(art.body.w, art.body.h, scale);
  b.drawImage(art.body.canvas, 0, 0, art.body.w, art.body.h);
  // The handle, from over the shoulder down across the body.
  b.lineCap = "round";
  b.strokeStyle = INK;
  b.lineWidth = 6.5;
  b.beginPath();
  b.moveTo(74, 6);
  b.lineTo(30, 100);
  b.stroke();
  b.strokeStyle = "#a8743e";
  b.lineWidth = 4;
  b.beginPath();
  b.moveTo(74, 6);
  b.lineTo(30, 100);
  b.stroke();
  // The twigs, bound at the handle's foot.
  blob(b, [
    [32, 92],
    [40, 96],
    [30, 116],
    [16, 116],
  ]);
  fillStroke(b, "#d9b56a", INK, 1.8);
  b.strokeStyle = "rgba(120,86,40,0.7)";
  b.lineWidth = 1.2;
  for (const dx of [0, 5, 10]) {
    b.beginPath();
    b.moveTo(32 + dx * 0.2, 98);
    b.lineTo(20 + dx, 114);
    b.stroke();
  }
  return { ...art, body };
}

// ---------------------------------------------------------------------------------------------- the scholar
/** The colours a scholar's figure is drawn in. The default is Ibn al-Haytham's, as the workshop has always drawn him;
 * al-Jazari's figure is the same cut-out in other colours, with an apron (art/jazari.ts's room), al-Tusi's in night
 * colours (art/tusi.ts's room), al-Khwarizmi's in day colours (art/khwarizmi.ts's room), and al-Kindi's in lamplit
 * colours (art/kindi.ts's room), al-Idrisi's in the bright colours of a hall by day (art/idrisi.ts's hall), and al-Razi's
 * in the warm browns of a quiet study (art/razi.ts's study). None is a likeness. */
export interface ScholarLook {
  skin: string;
  beard: [string, string];
  moustache: string;
  brow: string;
  turban: [string, string];
  turbanBands: string;
  robe: [string, string];
  gown: string;
  border: string;
  dots: string;
  shawl: string;
  seed: string;
  apron?: string;
}
export const SCHOLAR_LOOK: ScholarLook = {
  skin: "#d9a878",
  beard: ["#3a2a22", "#8c8479"],
  moustache: "#4a3a30",
  brow: "#3a2a22",
  turban: ["#fbf3dc", "#d9c9a0"],
  turbanBands: "rgba(90,70,40,0.55)",
  robe: ["#1d7f86", "#145560"],
  gown: "#f3e6c8",
  border: PAL.gold,
  dots: PAL.red,
  shawl: "#1a737b",
  seed: "scholar",
};
export const JAZARI_LOOK: ScholarLook = {
  skin: "#c99566",
  beard: ["#2a1d16", "#4a3a30"],
  moustache: "#2a1d16",
  brow: "#2a1d16",
  turban: ["#3a62b8", "#22407e"],
  turbanBands: "rgba(242,185,75,0.75)",
  robe: ["#c2643a", "#8f3f22"],
  gown: "#f3e6c8",
  border: PAL.gold,
  dots: PAL.lapis,
  shawl: "#9a4a2a",
  seed: "jazari",
  apron: "#6b4222",
};
/** Al-Tusi's figure in his observatory (art/tusi.ts's room): the same cut-out again, in night colours. Not a likeness. */
export const TUSI_LOOK: ScholarLook = {
  skin: "#d3a072",
  beard: ["#4a4038", "#b8b0a4"],
  moustache: "#5a5048",
  brow: "#4a4038",
  turban: ["#f3ecdc", "#cfc3a6"],
  turbanBands: "rgba(43,79,163,0.6)",
  robe: ["#2b4fa3", "#1a3270"],
  gown: "#f3e6c8",
  border: PAL.goldLight,
  dots: PAL.gold,
  shawl: "#3a3f7a",
  seed: "tusi",
};
/** Al-Khwarizmi's figure in his room (art/khwarizmi.ts's room): the same cut-out again, in day colours, green and ochre.
 * Not a likeness. */
export const KHWARIZMI_LOOK: ScholarLook = {
  skin: "#c99a6c",
  beard: ["#2e2420", "#5a4a40"],
  moustache: "#3a2e28",
  brow: "#2e2420",
  turban: ["#f6efdc", "#d8caa4"],
  turbanBands: "rgba(47,143,91,0.6)",
  robe: ["#2f8f5b", "#1f6a42"],
  gown: "#f3e6c8",
  border: PAL.ochre,
  dots: PAL.terracotta,
  shawl: "#a8743a",
  seed: "khwarizmi",
};
/** Al-Kindi's figure in his room (art/kindi.ts's room): the same cut-out again, in lamplit colours, indigo and saffron.
 * Not a likeness. */
export const KINDI_LOOK: ScholarLook = {
  skin: "#c8946a",
  beard: ["#3a2c24", "#6a5a4c"],
  moustache: "#3a2c24",
  brow: "#2e2420",
  turban: ["#f0e4c8", "#cdbb94"],
  turbanBands: "rgba(232,137,43,0.6)",
  robe: ["#3d3a7a", "#262454"],
  gown: "#f3e6c8",
  border: PAL.gold,
  dots: PAL.amber,
  shawl: "#c27a2a",
  seed: "kindi",
};
/** Al-Idrisi's figure in his hall (art/idrisi.ts's hall): the same cut-out again, in the colours of a bright hall by
 * day, a sea-green robe and shawl and a white turban. Not a likeness. */
export const IDRISI_LOOK: ScholarLook = {
  skin: "#d4a070",
  beard: ["#2e2620", "#5a5048"],
  moustache: "#2e2620",
  brow: "#2a201a",
  turban: ["#ffffff", "#dcd6c8"],
  turbanBands: "rgba(29,111,120,0.5)",
  robe: ["#1f6a5e", "#154a42"],
  gown: "#f6ecd2",
  border: PAL.gold,
  dots: PAL.lapis,
  shawl: "#2f8a7a",
  seed: "idrisi",
};
/** Al-Razi's figure in his study (art/razi.ts's study): the same cut-out again, in the warm browns of a quiet study, a
 * walnut robe, an ochre shawl and a cream turban. Not a likeness. */
export const RAZI_LOOK: ScholarLook = {
  skin: "#cf9c6e",
  beard: ["#3a2c24", "#7a6c60"],
  moustache: "#3a2c24",
  brow: "#2e2420",
  turban: ["#fbf3e0", "#d9ccae"],
  turbanBands: "rgba(122,74,38,0.5)",
  robe: ["#8a5a3a", "#5e3a24"],
  gown: "#f3e6c8",
  border: PAL.gold,
  dots: PAL.teal,
  shawl: "#b8823a",
  seed: "razi",
};
export interface ScholarArt {
  body: Painted;
  arm: Painted;
  head: Painted;
  headBlink: Painted;
}
function scholarHead(scale: number, open: boolean, look: ScholarLook = SCHOLAR_LOOK): Painted {
  const [p, ctx] = sheet(150, 170, scale);
  const cx = 74;
  const cy = 98;
  const skin = look.skin;
  // The beard, behind the jaw.
  blob(ctx, [
    [cx - 38, cy + 6],
    [cx - 36, cy + 44],
    [cx - 12, cy + 66],
    [cx + 16, cy + 66],
    [cx + 40, cy + 44],
    [cx + 42, cy + 6],
  ]);
  fillStroke(ctx, linear(ctx, 0, cy, 0, cy + 66, [[0, look.beard[0]], [1, look.beard[1]]]), INK, 2.2);
  ctx.beginPath();
  ctx.ellipse(cx, cy, 39, 42, 0, 0, Math.PI * 2);
  fillStroke(ctx, skin, INK, 2.4);
  // The turban: cream cloth wound in bands.
  blob(ctx, [
    [cx - 52, cy - 16],
    [cx - 56, cy - 52],
    [cx - 26, cy - 84],
    [cx + 22, cy - 88],
    [cx + 56, cy - 58],
    [cx + 54, cy - 14],
    [cx, cy - 30],
  ]);
  fillStroke(ctx, linear(ctx, 0, cy - 88, 0, cy - 14, [[0, look.turban[0]], [1, look.turban[1]]]), INK, 2.4);
  ctx.strokeStyle = look.turbanBands;
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(cx - 52 + i * 6, cy - 22 - i * 12);
    ctx.quadraticCurveTo(cx, cy - 48 - i * 11, cx + 54 - i * 5, cy - 22 - i * 13);
    ctx.stroke();
  }
  // Moustache and the beard's edge on the face.
  blob(ctx, [
    [cx - 34, cy + 16],
    [cx - 8, cy + 12],
    [cx + 6, cy + 12],
    [cx + 38, cy + 16],
    [cx + 30, cy + 40],
    [cx + 4, cy + 30],
    [cx - 26, cy + 40],
  ]);
  ctx.fillStyle = look.moustache;
  ctx.fill();
  eyes(ctx, cx + 4, cy - 4, { skin, open, r: 39, brow: look.brow }, 16, 9.5);
  // The nose.
  ctx.strokeStyle = "rgba(120,70,40,0.8)";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(cx + 6, cy - 2);
  ctx.quadraticCurveTo(cx + 14, cy + 12, cx + 4, cy + 13);
  ctx.stroke();
  smile(ctx, cx + 5, cy + 23, 9, true);
  blush(ctx, cx - 20, cy + 10, 8);
  blush(ctx, cx + 28, cy + 10, 8);
  return p;
}
export function scholar(scale: number, look: ScholarLook = SCHOLAR_LOOK): ScholarArt {
  const [body, b] = sheet(210, 270, scale);
  // The robe, shoulders to floor.
  blob(b, [
    [58, 6],
    [152, 6],
    [190, 60],
    [196, 262],
    [14, 262],
    [20, 60],
  ]);
  fillStroke(b, linear(b, 0, 0, 0, 262, [[0, look.robe[0]], [1, look.robe[1]]]), INK, 2.6);
  // The inner gown and the gold border down the front.
  blob(b, [
    [88, 6],
    [122, 6],
    [128, 262],
    [82, 262],
  ]);
  fillStroke(b, look.gown, INK, 2);
  b.fillStyle = look.border;
  b.fillRect(74, 8, 9, 254);
  b.fillRect(127, 8, 9, 254);
  for (let y = 26; y < 250; y += 28) {
    for (const x of [78.5, 131.5]) {
      b.fillStyle = look.dots;
      b.beginPath();
      b.arc(x, y, 3, 0, Math.PI * 2);
      b.fill();
    }
  }
  b.fillStyle = look.border;
  b.fillRect(15, 244, 180, 10);
  // A warm shawl over one shoulder.
  for (const pts of [[[58, 7], [76, 8], [74, 150], [40, 262], [15, 262], [21, 62]], [[152, 7], [134, 8], [136, 150], [170, 262], [195, 262], [189, 62]]]) {
    b.beginPath();
    pts.forEach(([x, y], i) => (i ? b.lineTo(x!, y!) : b.moveTo(x!, y!)));
    b.closePath();
    fillStroke(b, look.shawl, INK, 2.2);
  }
  b.strokeStyle = look.border;
  b.lineWidth = 2.5;
  for (const [x0, x1] of [[28, 60], [182, 150]] as const) {
    b.beginPath();
    b.moveTo(x0, 232);
    b.lineTo(x1 < 100 ? 46 : 164, 232);
    b.stroke();
  }
  if (look.apron) {
    // A craftsman's leather apron over the gown.
    blob(b, [
      [72, 110],
      [138, 110],
      [146, 240],
      [64, 240],
    ]);
    fillStroke(b, look.apron, INK, 2.2);
    b.strokeStyle = "rgba(255,220,160,0.35)";
    b.lineWidth = 2;
    b.strokeRect(84, 150, 42, 30);
  }
  brush(b, 210, 270, `${look.seed}-body`, { strokes: 260, strength: 0.85 });

  const [arm, a] = sheet(60, 140, scale);
  blob(a, [
    [8, 6],
    [50, 6],
    [56, 96],
    [4, 96],
  ]);
  fillStroke(a, look.shawl, INK, 2.4);
  a.fillStyle = look.border;
  a.fillRect(5, 84, 50, 9);
  blob(a, [
    [16, 96],
    [44, 96],
    [46, 122],
    [30, 136],
    [14, 122],
  ]);
  fillStroke(a, look.skin, INK, 2);
  brush(a, 60, 140, `${look.seed}-arm`, { strokes: 40, strength: 0.8 });
  return { body, arm, head: scholarHead(scale, true, look), headBlink: scholarHead(scale, false, look) };
}

// ---------------------------------------------------------------------------------------------- Karima
/**
 * Karima al-Marwaziyya as the game imagines her in her room (art/karima.ts): a respectful cut-out of the same size and
 * parts as the scholar's (a body, an arm that points, a head that blinks), so that the room engine places her as it
 * places every room's figure; a cream headscarf that frames the face and falls over the shoulders, and a plain long dress
 * of deep blue-green with a quiet brown border. Not a likeness: no picture of her is known to the museum, and the quest's
 * note already says she is drawn for play.
 */
export const KARIMA_LOOK = { skin: "#d9a87c", scarf: ["#fbf3e0", "#ddd0b2"], dress: ["#2f6f6a", "#1f4c4a"], border: "#8a5a30", wrap: "#7a5a8a" } as const;
function karimaHead(scale: number, open: boolean): Painted {
  const [p, ctx] = sheet(150, 170, scale);
  const cx = 74;
  const cy = 98;
  const L = KARIMA_LOOK;
  // The headscarf behind the face, falling to the shoulders.
  blob(ctx, [
    [cx - 56, cy + 66],
    [cx - 58, cy - 20],
    [cx - 36, cy - 66],
    [cx + 4, cy - 76],
    [cx + 44, cy - 62],
    [cx + 60, cy - 18],
    [cx + 58, cy + 66],
    [cx, cy + 70],
  ]);
  fillStroke(ctx, linear(ctx, 0, cy - 76, 0, cy + 70, [[0, L.scarf[0]], [1, L.scarf[1]]]), INK, 2.4);
  // The face.
  ctx.beginPath();
  ctx.ellipse(cx + 2, cy + 2, 35, 40, 0, 0, Math.PI * 2);
  fillStroke(ctx, L.skin, INK, 2.2);
  // The edge of the scarf round the face, and its folds.
  ctx.strokeStyle = "rgba(122,90,60,0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx + 2, cy + 2, 43, 1.02 * Math.PI, 1.98 * Math.PI);
  ctx.stroke();
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(cx + s * 44, cy + 10);
    ctx.quadraticCurveTo(cx + s * 50, cy + 40, cx + s * 40, cy + 62);
    ctx.stroke();
  }
  eyes(ctx, cx + 5, cy, { skin: L.skin, open, r: 35 }, 14, 8);
  ctx.strokeStyle = "rgba(120,70,40,0.75)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx + 7, cy + 4);
  ctx.quadraticCurveTo(cx + 13, cy + 15, cx + 5, cy + 16);
  ctx.stroke();
  smile(ctx, cx + 6, cy + 25, 8, true);
  blush(ctx, cx - 16, cy + 14, 7);
  blush(ctx, cx + 26, cy + 14, 7);
  return p;
}
export function karima(scale: number): ScholarArt {
  const L = KARIMA_LOOK;
  const [body, b] = sheet(210, 270, scale);
  // The plain long dress, shoulders to floor.
  blob(b, [
    [62, 6],
    [148, 6],
    [182, 60],
    [192, 262],
    [18, 262],
    [28, 60],
  ]);
  fillStroke(b, linear(b, 0, 0, 0, 262, [[0, L.dress[0]], [1, L.dress[1]]]), INK, 2.6);
  b.fillStyle = L.border;
  b.fillRect(20, 246, 170, 9);
  // The scarf falling over the shoulders and down the front.
  for (const pts of [[[62, 6], [92, 6], [86, 120], [52, 150], [34, 70]], [[148, 6], [118, 6], [124, 120], [158, 150], [176, 70]]]) {
    b.beginPath();
    pts.forEach(([x, y], i) => (i ? b.lineTo(x!, y!) : b.moveTo(x!, y!)));
    b.closePath();
    fillStroke(b, L.scarf[1], INK, 2.2);
  }
  // A plain wrap round the waist.
  blob(b, [
    [40, 150],
    [170, 150],
    [174, 168],
    [36, 168],
  ]);
  fillStroke(b, L.wrap, INK, 2);
  brush(b, 210, 270, "karima-body", { strokes: 240, strength: 0.8 });

  const [arm, a] = sheet(60, 140, scale);
  blob(a, [
    [8, 6],
    [50, 6],
    [54, 96],
    [6, 96],
  ]);
  fillStroke(a, L.dress[0], INK, 2.4);
  a.fillStyle = L.border;
  a.fillRect(7, 84, 46, 8);
  blob(a, [
    [17, 96],
    [43, 96],
    [45, 120],
    [30, 134],
    [15, 120],
  ]);
  fillStroke(a, L.skin, INK, 2);
  brush(a, 60, 140, "karima-arm", { strokes: 36, strength: 0.8 });
  return { body, arm, head: karimaHead(scale, true), headBlink: karimaHead(scale, false) };
}

// ---------------------------------------------------------------------------------------------- Ibn Battuta
/**
 * Ibn Battuta as the game imagines him in the inn (art/battuta.ts): the scholar's cut-out again, of the same size and
 * parts, dressed for the road: a sand-coloured traveller's turban, a dusty brown cloak over a plain gown, and a tall
 * walking staff held at his side. Not a likeness: no picture of him is known to the museum.
 */
export const BATTUTA_LOOK: ScholarLook = {
  skin: "#c99566",
  beard: ["#2e2018", "#5a4a3e"],
  moustache: "#2e2018",
  brow: "#2a1d16",
  turban: ["#efe0bc", "#c9b083"],
  turbanBands: "rgba(122,90,48,0.6)",
  robe: ["#9a7048", "#6b4a2e"],
  gown: "#efe2c2",
  border: PAL.ochre,
  dots: PAL.tealDark,
  shawl: "#7a5a3a",
  seed: "battuta",
};
export function battuta(scale: number): ScholarArt {
  const art = scholar(scale, BATTUTA_LOOK);
  const [body, b] = sheet(art.body.w, art.body.h, scale);
  b.drawImage(art.body.canvas, 0, 0, art.body.w, art.body.h);
  // The walking staff, held at his side, from above the shoulder to the floor.
  b.lineCap = "round";
  for (const [lw, colour] of [[11, INK], [7, "#8a5a30"]] as const) {
    b.strokeStyle = colour;
    b.lineWidth = lw;
    b.beginPath();
    b.moveTo(200, 8);
    b.lineTo(196, 266);
    b.stroke();
  }
  // A strap across the cloak for a water skin carried at the back.
  blob(b, [
    [60, 10],
    [72, 6],
    [160, 150],
    [148, 156],
  ]);
  fillStroke(b, "#5a3418", INK, 1.6);
  return { ...art, body };
}

/**
 * The keeper of the records in the coffee room, an invented person (the coffee quest's own), as the game imagines a keeper
 * of records: the scholar's cut-out again, of the same size and parts, in a plain white turban and a deep green robe over
 * a cream gown. Not a likeness of anyone.
 */
export const ARCHIVIST_LOOK: ScholarLook = {
  skin: "#c99566",
  beard: ["#4a3a30", "#9a9086"],
  moustache: "#4a3a30",
  brow: "#3a2a22",
  turban: ["#fbf6ea", "#ddd3bc"],
  turbanBands: "rgba(90,80,60,0.5)",
  robe: ["#2f6f4a", "#1f4c34"],
  gown: "#f3e6c8",
  border: PAL.ochre,
  dots: PAL.cream,
  shawl: "#3a5a3a",
  seed: "archivist",
};
export function archivist(scale: number): ScholarArt {
  return scholar(scale, ARCHIVIST_LOOK);
}

/**
 * Al-Jahiz in his room, as the game imagines a scholar of his time: the scholar's cut-out again, of the same size and
 * parts, in a sand turban and a deep blue robe over a cream gown. Not a likeness: nothing about his face or person is
 * drawn from any record.
 */
export const JAHIZ_LOOK: ScholarLook = {
  skin: "#b98458",
  beard: ["#2e2420", "#6e6258"],
  moustache: "#2e2420",
  brow: "#2a201c",
  turban: ["#efe2c2", "#cbb88e"],
  turbanBands: "rgba(90,70,40,0.5)",
  robe: ["#2f4a7a", "#1e3256"],
  gown: "#f3e6c8",
  border: PAL.gold,
  dots: PAL.cream,
  shawl: "#7a4a26",
  seed: "jahiz",
};
export function jahiz(scale: number): ScholarArt {
  return scholar(scale, JAHIZ_LOOK);
}

/**
 * The keeper of the water in the Alhambra's court, an invented person (the channels' quest's own), as the game imagines a
 * keeper of channels: the scholar's cut-out again, of the same size and parts, in a plain grey-white turban and an
 * earth-brown robe over a cream gown. Not a likeness of anyone.
 */
export const WATERKEEPER_LOOK: ScholarLook = {
  skin: "#c08a5c",
  beard: ["#8a8078", "#c9c0b4"],
  moustache: "#8a8078",
  brow: "#5a4a40",
  turban: ["#eceae2", "#c8c4b8"],
  turbanBands: "rgba(80,80,70,0.45)",
  robe: ["#7a5232", "#55361e"],
  gown: "#f3e6c8",
  border: PAL.teal,
  dots: PAL.cream,
  shawl: "#2f6f78",
  seed: "waterkeeper",
};
export function waterkeeper(scale: number): ScholarArt {
  return scholar(scale, WATERKEEPER_LOOK);
}

// ---------------------------------------------------------------------------------------------- the cat
export interface CatArt {
  body: Painted;
  head: Painted;
  headSleep: Painted;
  tail: Painted;
}
function catHead(scale: number, open: boolean): Painted {
  const [p, ctx] = sheet(58, 52, scale);
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(29 + s * 20, 22);
    ctx.lineTo(29 + s * 22, 2);
    ctx.lineTo(29 + s * 7, 12);
    ctx.closePath();
    fillStroke(ctx, "#d9b27a", INK, 2);
  }
  ctx.beginPath();
  ctx.ellipse(29, 30, 24, 20, 0, 0, Math.PI * 2);
  fillStroke(ctx, "#e3c08a", INK, 2.2);
  ctx.strokeStyle = "#a87a44";
  ctx.lineWidth = 2.4;
  for (const x of [22, 29, 36]) {
    ctx.beginPath();
    ctx.moveTo(x, 12);
    ctx.lineTo(x, 19);
    ctx.stroke();
  }
  for (const s of [-1, 1]) {
    const x = 29 + s * 10;
    if (open) {
      ctx.beginPath();
      ctx.ellipse(x, 30, 5, 6, 0, 0, Math.PI * 2);
      fillStroke(ctx, "#b6d86a", INK, 1.4);
      ctx.fillStyle = "#1c120c";
      ctx.beginPath();
      ctx.ellipse(x, 30, 1.8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, 28, 5, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    }
  }
  ctx.fillStyle = "#c9706a";
  blob(ctx, [
    [26, 36],
    [32, 36],
    [29, 40],
  ]);
  ctx.fill();
  ctx.strokeStyle = "rgba(60,40,20,0.6)";
  ctx.lineWidth = 1;
  for (const s of [-1, 1]) for (const dy of [-2, 3]) (ctx.beginPath(), ctx.moveTo(29 + s * 8, 39), ctx.lineTo(29 + s * 26, 39 + dy), ctx.stroke());
  return p;
}
export function cat(scale: number): CatArt {
  const [body, b] = sheet(120, 60, scale);
  blob(b, [
    [8, 56],
    [6, 30],
    [34, 8],
    [84, 6],
    [114, 30],
    [112, 56],
  ]);
  fillStroke(b, "#e3c08a", INK, 2.4);
  b.strokeStyle = "#a87a44";
  b.lineWidth = 4;
  for (let i = 0; i < 5; i++) {
    b.beginPath();
    b.moveTo(30 + i * 15, 10 + Math.abs(i - 2) * 2);
    b.quadraticCurveTo(34 + i * 15, 24, 28 + i * 15, 36);
    b.stroke();
  }
  brush(b, 120, 60, "cat-body", { strokes: 40, strength: 0.6 });
  const [tail, t] = sheet(70, 26, scale);
  t.strokeStyle = INK;
  t.lineWidth = 15;
  t.beginPath();
  t.moveTo(8, 14);
  t.quadraticCurveTo(40, 26, 62, 10);
  t.stroke();
  t.strokeStyle = "#e3c08a";
  t.lineWidth = 11;
  t.stroke();
  t.strokeStyle = "#a87a44";
  t.lineWidth = 11;
  t.beginPath();
  t.moveTo(50, 17);
  t.quadraticCurveTo(57, 15, 62, 10);
  t.stroke();
  return { body, head: catHead(scale, true), headSleep: catHead(scale, false), tail };
}

/** A face in a round frame, for the speaker's portrait beside the words: drawn once from the same parts. */
export function portrait(scale: number, parts: { back?: Painted; head: Painted; extra?: Painted }, ring: string): Painted {
  const size = 120;
  const [p, ctx] = sheet(size, size, scale);
  ctx.save();
  ctx.beginPath();
  ctx.arc(60, 60, 56, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = linear(ctx, 0, 0, 0, size, [[0, "#143f5c"], [1, "#1d6f78"]]);
  ctx.fillRect(0, 0, size, size);
  const fit = (pic: Painted, cx: number, cy: number, width: number) => {
    const k = width / pic.w;
    ctx.drawImage(pic.canvas, cx - (pic.w * k) / 2, cy - (pic.h * k) / 2, pic.w * k, pic.h * k);
  };
  if (parts.back) fit(parts.back, 60, 104, 110);
  if (parts.extra) fit(parts.extra, 52, 30, 66);
  fit(parts.head, 60, 62, parts.head.w > 100 ? 104 : parts.head.w > 80 ? 96 : 84);
  ctx.restore();
  ctx.beginPath();
  ctx.arc(60, 60, 56, 0, Math.PI * 2);
  ctx.strokeStyle = ring;
  ctx.lineWidth = 6;
  ctx.stroke();
  return p;
}
