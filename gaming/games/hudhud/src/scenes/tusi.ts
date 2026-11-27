// Al-Tusi's observatory on screen: the third room on the room engine (./room.ts). The engine carries the bird, the
// explorer, the camera, touching and the door; this file adds the room's painting, al-Tusi and the girl who cleans the
// instruments, the model of the two circles on its stand (drawn each frame from the quest's own arithmetic, as the
// page's picture is, art/couple.ts), the path the point traces drawn in the air beside it, the levers that lean to
// their settings, the crank that turns while the circles do, and the feather among the instruments on the high shelf.
// What happens is decided in sim/tusiroom.ts and sim/couple.ts.
import * as Phaser from "phaser";
import { cleaner as paintCleaner, portrait, scholar as paintScholar, TUSI_LOOK } from "../art/cast";
import { INK, PAL, glow } from "../art/kit";
import * as props from "../art/props";
import { tusiCrank, tusiLever, tusiLeverBase, tusiRoom, type Knob } from "../art/tusi";
import { TSR_AIR, TSR_APPROACH, TSR_BASE, TSR_CRANK, TSR_LAYOUT, TSR_LEVER_Y, TSR_LEVERS, TSR_MODEL, TSR_OPENING, TSR_START, TSR_THINGS, TSR_WORLD, type TsrSpeaker, type TsrThing } from "../content/tusi-room";
import type { Mood } from "../narrative/dialogue";
import type { Keeper, Quality } from "../save/save";
import type { CoupleField, CoupleStyle, Pt, Setting } from "../sim/couple";
import type { Mover } from "../sim/move";
import { hasLever, leverAngle, modelOf, valueNow, valuesOf, type TusiHappened, type TusiState } from "../sim/tusiroom";
import { ADD, RoomScene, lerp, type Box, type Img, type RoomHost, type RoomThing } from "./room";
import { HELPER, SCHOLAR } from "../content/people";
import type { Standing } from "../sim/follow";

/** What the room is showing, beyond the rules' state: how far a turning being shown has gone, and whether the door is lit. */
export interface TusiView {
  state: TusiState;
  /** A turning is being shown. */
  turning: boolean;
  /** How far it has gone, from 0 to 1 (1 when none is being shown). */
  progress: number;
  /** The line has been found and its turning shown: the door is lit. */
  done: boolean;
}
export interface TusiSceneHost extends RoomHost {
  view(): TusiView;
  speaking(): { who: TsrSpeaker; mood: Mood } | null;
  look(): { quality: Quality; reducedMotion: boolean; style: CoupleStyle; keeper: Keeper };
}

const KNOB: Record<CoupleField, Knob> = { dir: "round", speed: "square", size: "ring" };
const hex = (c: string) => Number.parseInt(c.slice(1), 16);

export class TusiScene extends RoomScene<TusiSceneHost> {
  private sage!: { box: Box; arm: Img; head: Img; blink: number; point: number };
  private girl!: { box: Box; head: Img; arm: Img; blink: number; hop: number };
  private levers: { field: CoupleField; img: Img; base: Img }[] = [];
  private crank!: Img;
  private model!: Phaser.GameObjects.Graphics;
  private air!: Phaser.GameObjects.Graphics;
  private airGlow!: Img;
  private page!: Img;
  private pageGlow!: Img;
  private feather!: Img;
  private twinkles: { img: Img; phase: number }[] = [];
  private drawn = "";
  private crankTurn = 0;

  constructor() {
    super("tusi", TSR_LAYOUT);
  }

  protected things(): readonly RoomThing[] {
    return TSR_THINGS;
  }
  protected lit(): boolean {
    return this.host.view().done;
  }
  protected override touchable(t: RoomThing): boolean {
    // A lever is there only for a choice this way of playing offers.
    const k = t as TsrThing;
    if (k.kind === "lever") return hasLever(this.host.view().state.couple.offer, k.field!);
    return true;
  }
  /** Where the room's people stand: the explorer stops short of them (sim/follow.ts). */
  protected override people(): readonly Standing[] {
    return [{ x: TSR_START.tusi, figure: SCHOLAR }, { x: TSR_START.girl, figure: HELPER }];
  }
  protected override approach(t: RoomThing): number {
    return TSR_APPROACH[(t as TsrThing).kind];
  }
  protected override tap(x: number, y: number): void {
    // A press on the picture flies the bird to the thing pressed, and touches it.
    if (this.host.frozen()) return;
    const hit = TSR_THINGS.filter((t) => this.touchable(t)).find((t) => Math.hypot(t.x - x, t.y - y) < 64);
    if (hit) this.goTo(hit.id);
  }

  // ------------------------------------------------------------------------------------------ building
  protected build(look: { keeper: Keeper }): void {
    const ts = this.q.texture;
    const T = this.tex.bind(this);
    this.layers();
    const m = this.main;
    this.wide("tusi-room", () => tusiRoom(ts));
    this.putWide(m, "tusi-room", 0, 0, 0);
    T("glow", () => glow(256, ts));
    // A few stars in the opening that twinkle (none when the effects are low).
    T("sparkle", () => props.sparkle(ts));
    for (let i = 0; i < Math.min(this.q.stars, 12); i++) {
      const x = this.rng.range(TSR_OPENING.x + 20, TSR_OPENING.x + TSR_OPENING.w - 20);
      const y = this.rng.range(TSR_OPENING.y + 60, TSR_OPENING.y + TSR_OPENING.h * 0.7);
      this.twinkles.push({ img: this.put(m, "sparkle", x, y).setBlendMode(ADD).setScale(this.rng.range(0.25, 0.45) / ts).setTint(0xdfe8ff), phase: this.rng.range(0, 6) });
    }
    // Starlight on the floor under the opening, and a soft light round the model.
    this.put(m, "glow", TSR_OPENING.x + TSR_OPENING.w / 2, TSR_WORLD.floor + 30).setBlendMode(ADD).setScale(2.6 / ts, 0.8 / ts).setAlpha(0.3).setTint(0x9fb8ff);
    this.put(m, "glow", TSR_MODEL.x, TSR_MODEL.y).setBlendMode(ADD).setScale(2.2 / ts).setAlpha(0.18).setTint(0xffd27a);
    this.airGlow = this.put(m, "glow", TSR_AIR.x, TSR_AIR.y).setBlendMode(ADD).setScale(2.2 / ts).setAlpha(0).setTint(0xffd27a);
    this.buildDoor(m);

    // The model's circles and the path in the air: drawn each time they change, from the quest's arithmetic.
    this.model = this.add.graphics();
    this.air = this.add.graphics();
    m.add([this.model, this.air]);
    // The levers on the base, each on its pivot block; one only for a choice this way of playing offers.
    const offer = this.host.view().state.couple.offer;
    for (const l of TSR_LEVERS) {
      const n = valuesOf(offer, l.field).length;
      const base = this.put(m, T(`lever-base-${n}`, () => tusiLeverBase(ts, n)), l.x, TSR_BASE.y + 2, 0.5, 1);
      const img = this.put(m, T(`lever-${l.field}`, () => tusiLever(ts, KNOB[l.field])), l.x, TSR_BASE.y - 18, 0.5, 0.93);
      const shown = hasLever(offer, l.field);
      base.setVisible(shown);
      img.setVisible(shown);
      this.levers.push({ field: l.field, img, base });
    }
    this.crank = this.put(m, T("crank", () => tusiCrank(ts)), TSR_CRANK.x, TSR_CRANK.y);
    // The feather, among the instruments on the high shelf until it is found.
    const shelf = TSR_THINGS.find((t) => t.id === "shelf")!;
    this.feather = this.put(m, T("feather", () => props.feather(ts)), shelf.x - 14, shelf.y + 4).setAngle(-24).setScale(0.7 / ts);
    // The page of the Atlas, come to rest above the line once it is found.
    this.pageGlow = this.put(m, "glow", TSR_AIR.x, TSR_AIR.y - 190).setBlendMode(ADD).setScale(0.9 / ts).setAlpha(0);
    this.page = this.put(m, T("page-ink", () => props.page(ts, true)), TSR_AIR.x, TSR_AIR.y - 190).setAlpha(0).setAngle(-7);
    this.buildRing(m);

    this.buildCast(m, ts, look.keeper);
    this.buildSparks(m);
  }
  protected override ready(): void {
    this.drawModel();
  }

  private buildCast(m: Box, ts: number, look: Keeper): void {
    const T = this.tex.bind(this);
    const urls: Record<string, string> = {};
    // Al-Tusi, as the game imagines him: the scholar's cut-out in night colours. Not a likeness.
    const ta = paintScholar(ts, TUSI_LOOK);
    for (const [k, p] of Object.entries(ta)) T(`tusi-${k}`, () => p);
    const sageBox = this.layer(m).setPosition(TSR_START.tusi, TSR_WORLD.floor).setScale(0.86);
    this.put(sageBox, "tusi-body", 0, 2, 0.5, 1);
    const sArm = this.put(sageBox, "tusi-arm", 62, -236, 0.5, 0.05);
    const sHead = this.put(sageBox, "tusi-head", 4, -292, 0.5, 0.58);
    this.sage = { box: sageBox, arm: sArm, head: sHead, blink: 3, point: 0 };
    urls.tusi = portrait(1, { back: ta.body, head: ta.head }, "#2b4fa3").canvas.toDataURL("image/png");

    // The girl who cleans the instruments, an invented person, by the table.
    const ga = paintCleaner(ts);
    for (const [k, p] of Object.entries(ga)) T(`girl-${k}`, () => p);
    const gBox = this.layer(m).setPosition(TSR_START.girl, TSR_WORLD.floor + 8).setScale(0.74);
    this.put(gBox, "girl-leg", -14, -68, 0.5, 0);
    this.put(gBox, "girl-leg", 14, -68, 0.5, 0);
    this.put(gBox, "girl-body", 0, -180, 0.5, 0);
    const gArm = this.put(gBox, "girl-arm", 18, -170, 0.5, 0.06);
    const gHead = this.put(gBox, "girl-head", 2, -212, 0.5, 0.54);
    this.girl = { box: gBox, head: gHead, arm: gArm, blink: 1.4, hop: 0 };
    urls.girl = portrait(1, { back: ga.body, head: ga.head }, "#3f8f5b").canvas.toDataURL("image/png");

    this.buildKeeper(m, look, urls);
    this.buildBird(m, urls);
    this.host.portraits(urls);
  }

  // ------------------------------------------------------------------------------------------ the model
  /** Draws the model's circles and the path in the air, if what they show has changed since they were last drawn. */
  private drawModel(): void {
    const v = this.host.view();
    const mo = modelOf(v.state, v.turning, v.progress);
    const key = `${mo.setting.r},${mo.setting.k},${mo.setting.d},${mo.theta.toFixed(3)},${mo.path?.length ?? 0},${mo.closed}`;
    if (key === this.drawn) return;
    this.drawn = key;
    const { r, k, d } = mo.setting;
    const M = TSR_MODEL;
    const at = (c: { x: number; y: number; r: number }, p: Pt): [number, number] => [c.x + c.r * p[0], c.y - c.r * p[1]];
    const g = this.model.clear();
    // The large circle, a heavy cream ring, with a small ring at its middle.
    g.lineStyle(7, hex(PAL.cream), 1).strokeCircle(M.x, M.y, M.r);
    g.fillStyle(hex(PAL.cream), 1).fillCircle(M.x, M.y, 6);
    // The small circle, carried round at (1 - r) from the middle; the arm to its centre in short dashes.
    const centre = at(M, [(1 - r) * Math.cos(mo.theta), (1 - r) * Math.sin(mo.theta)]);
    g.lineStyle(4, hex(PAL.cream), 0.55);
    const dashes = 8;
    for (let i = 0; i < dashes; i += 2) {
      g.lineBetween(lerp(M.x, centre[0], i / dashes), lerp(M.y, centre[1], i / dashes), lerp(M.x, centre[0], (i + 1) / dashes), lerp(M.y, centre[1], (i + 1) / dashes));
    }
    g.fillStyle(hex(PAL.teal), 0.6).fillCircle(centre[0], centre[1], r * M.r);
    g.lineStyle(6, hex(PAL.goldLight), 1).strokeCircle(centre[0], centre[1], r * M.r);
    // The marked point on the small circle: a spoke, then a star in a ring (marked by shape, not only by colour).
    const f = 1 + d * k;
    const spot = at(M, [(1 - r) * Math.cos(mo.theta) + r * Math.cos(f * mo.theta), (1 - r) * Math.sin(mo.theta) + r * Math.sin(f * mo.theta)]);
    g.lineStyle(4, hex(PAL.goldLight), 1).lineBetween(centre[0], centre[1], spot[0], spot[1]);
    this.star(g, spot[0], spot[1]);

    // In the air beside the model: a faint ring the size of the large circle, and the path the point traced.
    const A = TSR_AIR;
    const a = this.air.clear();
    a.lineStyle(2, hex(PAL.cream), 0.16).strokeCircle(A.x, A.y, A.r);
    if (mo.path && mo.path.length > 1) {
      const pts = mo.path.map((p) => at(A, p));
      for (const [width, colour] of [[12, INK], [6, PAL.gold]] as const) {
        a.lineStyle(width, hex(colour), 1).beginPath();
        a.moveTo(pts[0]![0], pts[0]![1]);
        for (const q of pts.slice(1)) a.lineTo(q[0], q[1]);
        if (mo.closed) a.closePath();
        a.strokePath();
      }
      const end = mo.closed ? at(A, mo.path[0]!) : pts[pts.length - 1]!;
      this.star(a, end[0], end[1]);
    }
  }
  private star(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
    g.fillStyle(hex(INK), 1).fillCircle(x, y, 17);
    g.lineStyle(4, hex(PAL.cream), 1).strokeCircle(x, y, 17);
    const pts: Phaser.Math.Vector2[] = [];
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (Math.PI * i) / 5;
      const rad = i % 2 ? 5 : 12;
      pts.push(new Phaser.Math.Vector2(x + rad * Math.cos(a), y + rad * Math.sin(a)));
    }
    g.fillStyle(hex(PAL.gold), 1).fillPoints(pts, true);
  }

  // ------------------------------------------------------------------------------------------ from the rules
  /** Things that happened in the rules, to be shown. */
  happened(list: TusiHappened[]): void {
    for (const h of list) {
      if (h.type === "lever") this.burst({ x: TSR_LEVERS.find((l) => l.field === h.field)!.x, y: TSR_LEVER_Y - 30 }, 4);
      else if (h.type === "turn") (this.burst(TSR_CRANK, 6), (this.sage.point = 1.4));
      else if (h.type === "feather") this.burst(TSR_THINGS.find((t) => t.id === "shelf")!, 12);
      else if (h.type === "talk" && h.script.startsWith("girl")) this.girl.hop = 0.5;
    }
  }

  protected override animateRoom(dt: number, mv: Mover, calm: boolean): void {
    const v = this.host.view();
    const s = v.state;
    const t = this.t;
    const speaking = this.host.speaking();
    this.drawModel();

    // Each lever leans to the value it is set to.
    for (const l of this.levers) {
      const want = leverAngle(valuesOf(s.couple.offer, l.field), valueNow(s.couple, l.field));
      l.img.setAngle(calm ? want : lerp(l.img.angle, want, 1 - Math.exp(-dt * 10)));
    }
    // The crank goes round while the circles do, one turn of the crank for one of the large circle.
    if (v.turning) this.crankTurn = 360 * v.progress;
    this.crank.setAngle(this.crankTurn);
    // The path glows in the air once it is drawn; the page comes to rest above it once it is a line.
    this.airGlow.setAlpha(lerp(this.airGlow.alpha, s.couple.last ? 0.22 : 0, calm ? 1 : 0.1));
    this.page.setAlpha(lerp(this.page.alpha, v.done ? 1 : 0, calm ? 1 : 0.08));
    this.page.y = TSR_AIR.y - 190 + (calm ? 0 : Math.sin(t * 2) * 4);
    this.pageGlow.setAlpha(this.page.alpha * 0.6);
    this.feather.setVisible(!s.couple.flags.includes("feather"));
    for (const w of this.twinkles) w.img.setAlpha(calm ? 0.8 : 0.5 + Math.sin(t * 1.7 + w.phase) * 0.4);

    // Al-Tusi turns to the bird, and points when the circles are turned or he speaks.
    const g = this.sage;
    g.box.scaleX = 0.86 * (mv.x >= TSR_START.tusi ? 1 : -1);
    g.point = Math.max(0, g.point - dt);
    const lift = speaking?.who === "tusi" || g.point > 0;
    g.arm.setAngle(lerp(g.arm.angle, lift ? -62 + (calm ? 0 : Math.sin(t * 5) * 6) : calm ? 0 : Math.sin(t * 1.3) * 2, calm ? 1 : 1 - Math.exp(-dt * 8)));
    g.head.setAngle((speaking?.who === "tusi" ? (calm ? 0 : Math.sin(t * 7) * 3) : calm ? 0 : Math.sin(t * 1.1) * 1.5) + (mv.y < 380 ? -6 : 0));
    g.head.y = -292 + (calm ? 0 : Math.sin(t * 1.5) * 1.2);
    this.blink(g, g.head, "tusi-head", "tusi-headBlink", dt);

    // The girl looks at the bird, and waves when she speaks.
    const a = this.girl;
    a.box.scaleX = 0.74 * (mv.x >= TSR_START.girl ? 1 : -1);
    a.arm.setAngle(speaking?.who === "girl" ? -40 + (calm ? 0 : Math.sin(t * 6) * 10) : calm ? 0 : Math.sin(t * 1.4) * 3);
    a.head.setAngle(speaking?.who === "girl" && !calm ? Math.sin(t * 8) * 3 : 0);
    a.hop = Math.max(0, a.hop - dt);
    a.box.y = TSR_WORLD.floor + 8 - (calm ? 0 : Math.sin((a.hop / 0.5) * Math.PI) * 10);
    this.blink(a, a.head, "girl-head", "girl-headBlink", dt);
  }

  /** What the model is drawn as now, for the browser checks: the setting it shows and how many points of the path. */
  shown(): { setting: Setting; points: number; closed: boolean; levers: Record<string, { visible: boolean; angle: number }> } {
    const v = this.host.view();
    const mo = modelOf(v.state, v.turning, v.progress);
    return { setting: mo.setting, points: mo.path?.length ?? 0, closed: mo.closed, levers: Object.fromEntries(this.levers.map((l) => [l.field, { visible: l.img.visible, angle: Math.round(l.img.angle) }])) };
  }

  // ------------------------------------------------------------------------------------------ leaving
  protected override releaseRoom(): void {
    this.levers = [];
    this.twinkles = [];
    this.drawn = "";
    this.crankTurn = 0;
  }
}
