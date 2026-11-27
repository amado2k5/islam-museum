// Al-Khwarizmi's room on screen: the fourth room on the room engine (./room.ts). The engine carries the bird, the
// explorer, the camera, touching and the door; this file adds the room's painting, al-Khwarizmi and the child who carries
// the box, the boxes and coins on the two trays (placed each time the problem changes from the quest's own state, as the
// page's picture is, art/algebra.ts), the hollow groups that can be touched to restore, the two weights and the scoop,
// the locked box that opens when one thing equals a number, the page that rises out of it, and the feather under the box.
// What happens is decided in sim/khwarizmiroom.ts and sim/algebra.ts.
import { boxCarrier as paintCarrier, KHWARIZMI_LOOK, portrait, scholar as paintScholar } from "../art/cast";
import { glow } from "../art/kit";
import * as props from "../art/props";
import { khwarizmiRoom, lockedBox, scoop as paintScoop, trayBox, trayCoin, weight as paintWeight } from "../art/khwarizmi";
import { AKR_APPROACH, AKR_BOX, AKR_LAYOUT, AKR_SCOOP, AKR_START, AKR_TRAY, AKR_TRAYS, AKR_WEIGHTS, AKR_WEIGHT_Y, AKR_WINDOW, AKR_WORLD, akrThings, trayOf, type AkrSpeaker, type AkrThing } from "../content/khwarizmi-room";
import type { Mood } from "../narrative/dialogue";
import type { Keeper, Quality } from "../save/save";
import type { AlgebraStyle, Equation } from "../sim/algebra";
import type { Mover } from "../sim/move";
import { touchableNow, trayLayout, type KhwarizmiHappened, type KhwarizmiState } from "../sim/khwarizmiroom";
import { ADD, RoomScene, lerp, type Box, type Img, type RoomHost, type RoomThing } from "./room";
import { HELPER, SCHOLAR } from "../content/people";
import type { Standing } from "../sim/follow";

/** What the room is showing, beyond the rules' state: whether the door is lit. */
export interface KhwarizmiView {
  state: KhwarizmiState;
  /** One thing equals a number: the box is open and the door is lit. */
  done: boolean;
}
export interface KhwarizmiSceneHost extends RoomHost {
  view(): KhwarizmiView;
  /** The page reads right to left: the first side of the problem is on the right tray. */
  rtl: boolean;
  speaking(): { who: AkrSpeaker; mood: Mood } | null;
  look(): { quality: Quality; reducedMotion: boolean; style: AlgebraStyle; keeper: Keeper };
}

export class KhwarizmiScene extends RoomScene<KhwarizmiSceneHost> {
  private sage!: { box: Box; arm: Img; head: Img; blink: number; point: number };
  private kid!: { box: Box; head: Img; arm: Img; blink: number; hop: number };
  private weights: { kind: string; img: Img; dip: number }[] = [];
  private scoopImg!: Img;
  private scoopTip = 0;
  private boxShut!: Img;
  private boxOpen!: Img;
  private page!: Img;
  private pageGlow!: Img;
  private feather!: Img;
  /** The pictures on the trays, kept and reused: boxes and coins, whole and hollow. */
  private pool: Record<string, Img[]> = {};
  /** The layer the trays' contents are placed in: over the room's painting, under everything else. */
  private trayLayer!: Box;
  private drawn = "";
  private list: AkrThing[] = [];

  constructor() {
    super("khwarizmi", AKR_LAYOUT);
  }

  protected things(): readonly RoomThing[] {
    return this.list;
  }
  protected lit(): boolean {
    return this.host.view().done;
  }
  protected override touchable(t: RoomThing): boolean {
    // A hollow group is there only while something of its kind is taken away on its side.
    return touchableNow(this.host.view().state.algebra, t.id);
  }
  /** Where the room's people stand: the explorer stops short of them (sim/follow.ts). */
  protected override people(): readonly Standing[] {
    return [{ x: AKR_START.khwarizmi, figure: SCHOLAR }, { x: AKR_START.child, figure: HELPER }];
  }
  protected override approach(t: RoomThing): number {
    return AKR_APPROACH[(t as AkrThing).kind];
  }
  protected override tap(x: number, y: number): void {
    // A press on the picture flies the bird to the thing pressed, and touches it.
    if (this.host.frozen()) return;
    const hit = this.list.filter((t) => this.touchable(t)).find((t) => Math.hypot(t.x - x, t.y - y) < 64);
    if (hit) this.goTo(hit.id);
  }

  // ------------------------------------------------------------------------------------------ building
  protected build(look: { keeper: Keeper }): void {
    this.list = akrThings(this.host.rtl);
    const ts = this.q.texture;
    const T = this.tex.bind(this);
    this.layers();
    const m = this.main;
    this.wide("khwarizmi-room", () => khwarizmiRoom(ts));
    this.putWide(m, "khwarizmi-room", 0, 0, 0);
    this.trayLayer = this.layer(m);
    T("glow", () => glow(256, ts));
    // Daylight from the window on the floor, and a soft light over the trays.
    this.put(m, "glow", AKR_WINDOW.x + AKR_WINDOW.w / 2, AKR_WORLD.floor + 20).setBlendMode(ADD).setScale(2.6 / ts, 0.7 / ts).setAlpha(0.25).setTint(0xfff1c4);
    this.put(m, "glow", 1705, 340).setBlendMode(ADD).setScale(3.4 / ts, 1.6 / ts).setAlpha(0.12).setTint(0xffe7a8);
    this.buildDoor(m);

    // The boxes and coins on the trays: textures painted once, images placed each time the problem changes.
    for (const k of ["box", "coin"] as const) for (const hollow of [false, true]) T(`tray-${k}${hollow ? "-hollow" : ""}`, () => (k === "box" ? trayBox(ts, hollow) : trayCoin(ts, hollow)));
    // The two weights on their stand, and the scoop on the table.
    for (const w of AKR_WEIGHTS) {
      const img = this.put(m, T(`weight-${w.kind}`, () => paintWeight(ts, w.kind === "things" ? "box" : "coin")), w.x, AKR_WEIGHT_Y + 38, 0.5, 0.95);
      this.weights.push({ kind: w.kind, img, dip: 0 });
    }
    this.scoopImg = this.put(m, T("scoop", () => paintScoop(ts)), AKR_SCOOP.x, AKR_SCOOP.y + 4);
    // The locked box on its plinth, the feather under it until it is found, and the page that rises out of it.
    const ty = AKR_BOX.y + 28;
    this.feather = this.put(m, T("feather", () => props.feather(ts)), AKR_BOX.x + 30, ty - 6).setAngle(-12).setScale(0.6 / ts);
    this.boxShut = this.put(m, T("box-shut", () => lockedBox(ts, false)), AKR_BOX.x, ty, 0.5, 84 / 90).setScale(0.8 / ts);
    this.boxOpen = this.put(m, T("box-open", () => lockedBox(ts, true)), AKR_BOX.x, ty, 0.5, 84 / 90).setScale(0.8 / ts).setVisible(false);
    this.pageGlow = this.put(m, "glow", AKR_BOX.x, AKR_BOX.y - 90).setBlendMode(ADD).setScale(0.9 / ts).setAlpha(0);
    this.page = this.put(m, T("page-ink", () => props.page(ts, true)), AKR_BOX.x, AKR_BOX.y - 90).setAlpha(0).setAngle(-7);
    this.buildRing(m);

    this.buildCast(m, ts, look.keeper);
    this.buildSparks(m);
  }
  protected override ready(): void {
    this.placeTrays();
  }

  private buildCast(m: Box, ts: number, look: Keeper): void {
    const T = this.tex.bind(this);
    const urls: Record<string, string> = {};
    // Al-Khwarizmi, as the game imagines him: the scholar's cut-out in day colours. Not a likeness.
    const ka = paintScholar(ts, KHWARIZMI_LOOK);
    for (const [k, p] of Object.entries(ka)) T(`khwarizmi-${k}`, () => p);
    const sageBox = this.layer(m).setPosition(AKR_START.khwarizmi, AKR_WORLD.floor).setScale(0.86);
    this.put(sageBox, "khwarizmi-body", 0, 2, 0.5, 1);
    const sArm = this.put(sageBox, "khwarizmi-arm", 62, -236, 0.5, 0.05);
    const sHead = this.put(sageBox, "khwarizmi-head", 4, -292, 0.5, 0.58);
    this.sage = { box: sageBox, arm: sArm, head: sHead, blink: 3, point: 0 };
    urls.khwarizmi = portrait(1, { back: ka.body, head: ka.head }, "#2f8f5b").canvas.toDataURL("image/png");

    // The child who carries the box, an invented person, by the plinth.
    const ca = paintCarrier(ts);
    for (const [k, p] of Object.entries(ca)) T(`child-${k}`, () => p);
    const cBox = this.layer(m).setPosition(AKR_START.child, AKR_WORLD.floor + 8).setScale(0.74);
    this.put(cBox, "child-leg", -14, -68, 0.5, 0);
    this.put(cBox, "child-leg", 14, -68, 0.5, 0);
    this.put(cBox, "child-body", 0, -180, 0.5, 0);
    const cArm = this.put(cBox, "child-arm", 18, -170, 0.5, 0.06);
    const cHead = this.put(cBox, "child-head", 2, -212, 0.5, 0.54);
    this.kid = { box: cBox, head: cHead, arm: cArm, blink: 1.4, hop: 0 };
    urls.child = portrait(1, { back: ca.body, head: ca.head }, "#b8443c").canvas.toDataURL("image/png");

    this.buildKeeper(m, look, urls);
    this.buildBird(m, urls);
    this.host.portraits(urls);
  }

  // ------------------------------------------------------------------------------------------ the trays
  /** An image from the pool of a kind, made the first time it is needed. */
  private take(key: string, i: number): Img {
    const list = (this.pool[key] ??= []);
    while (list.length <= i) {
      list.push(this.put(this.trayLayer, key, 0, 0));
    }
    return list[i]!;
  }
  /** Places the boxes and coins of both sides on their trays, if the problem has changed since they were last placed. */
  private placeTrays(): void {
    const eq: Equation = this.host.view().state.algebra.eq;
    const key = JSON.stringify(eq);
    if (key === this.drawn) return;
    this.drawn = key;
    const used: Record<string, number> = {};
    for (const side of ["left", "right"] as const) {
      const tray = AKR_TRAYS[trayOf(side, this.host.rtl)]!;
      for (const it of trayLayout(eq[side]).items) {
        const k = `tray-${it.kind}${it.hollow ? "-hollow" : ""}`;
        const n = (used[k] = (used[k] ?? 0) + 1) - 1;
        this.take(k, n).setPosition(tray.x + AKR_TRAY.pad + it.x, AKR_TRAY.top + AKR_TRAY.pad + it.y).setVisible(true);
      }
    }
    for (const [k, list] of Object.entries(this.pool)) list.forEach((im, i) => im.setVisible(i < (used[k] ?? 0)));
  }
  /** What the trays show now, for the browser checks: per side, the boxes and coins whole and hollow, and which tray. */
  shown(): Record<"left" | "right", { tray: number; box: number; coin: number; hollowBox: number; hollowCoin: number }> & { boxOpen: boolean; feather: boolean } {
    const eq = this.host.view().state.algebra.eq;
    const count = (side: "left" | "right") => {
      const items = trayLayout(eq[side]).items;
      const n = (kind: string, hollow: boolean) => items.filter((i) => i.kind === kind && i.hollow === hollow).length;
      return { tray: trayOf(side, this.host.rtl), box: n("box", false), coin: n("coin", false), hollowBox: n("box", true), hollowCoin: n("coin", true) };
    };
    const visible = Object.fromEntries(Object.entries(this.pool).map(([k, l]) => [k, l.filter((i) => i.visible).length]));
    const l = count("left");
    const r = count("right");
    // The images on screen must be what the layout says: a check that the pool and the rules agree.
    const agree = (visible["tray-box"] ?? 0) === l.box + r.box && (visible["tray-coin"] ?? 0) === l.coin + r.coin && (visible["tray-box-hollow"] ?? 0) === l.hollowBox + r.hollowBox && (visible["tray-coin-hollow"] ?? 0) === l.hollowCoin + r.hollowCoin;
    return { left: agree ? l : { ...l, tray: -1 }, right: r, boxOpen: this.boxOpen.visible, feather: this.feather.visible };
  }

  // ------------------------------------------------------------------------------------------ from the rules
  /** Things that happened in the rules, to be shown. */
  happened(list: KhwarizmiHappened[]): void {
    for (const h of list) {
      if (h.type === "move") {
        const m = h.move;
        if (m.type === "balance") {
          const w = this.weights.find((x) => x.kind === m.kind)!;
          w.dip = 0.4;
          if (h.applied) this.burst({ x: w.img.x, y: AKR_WEIGHT_Y }, 4);
        } else if (m.type === "share") {
          this.scoopTip = 0.5;
          if (h.applied) this.burst(AKR_SCOOP, 5);
        } else if (h.applied) {
          const t = this.list.find((k) => k.id === `restore-${m.side}-${m.kind}`)!;
          this.burst(t, 6);
        }
        if (h.applied) this.sage.point = 1.2;
      } else if (h.type === "opened") this.burst(AKR_BOX, 14);
      else if (h.type === "feather") this.burst({ x: AKR_BOX.x + 30, y: AKR_BOX.y + 20 }, 10);
      else if (h.type === "talk" && h.script.startsWith("child")) this.kid.hop = 0.5;
    }
  }

  protected override animateRoom(dt: number, mv: Mover, calm: boolean): void {
    const v = this.host.view();
    const s = v.state.algebra;
    const t = this.t;
    const speaking = this.host.speaking();
    this.placeTrays();

    // A weight touched dips a little and comes back; the scoop tips.
    for (const w of this.weights) {
      w.dip = Math.max(0, w.dip - dt);
      w.img.y = AKR_WEIGHT_Y + 38 + (calm ? 0 : Math.sin((w.dip / 0.4) * Math.PI) * 6);
    }
    this.scoopTip = Math.max(0, this.scoopTip - dt);
    this.scoopImg.setAngle(calm ? 0 : -Math.sin((this.scoopTip / 0.5) * Math.PI) * 18);
    // The box opens when one thing equals a number, and the page rises out of it and rests above it.
    this.boxShut.setVisible(!s.done);
    this.boxOpen.setVisible(s.done);
    this.page.setAlpha(lerp(this.page.alpha, s.done ? 1 : 0, calm ? 1 : 0.08));
    this.page.y = AKR_BOX.y - 90 + (calm ? 0 : (1 - this.page.alpha) * 40 + Math.sin(t * 2) * 4);
    this.pageGlow.setAlpha(this.page.alpha * 0.6);
    this.feather.setVisible(!s.flags.includes("feather"));

    // Al-Khwarizmi turns to the bird, and points when a move is made or he speaks.
    const g = this.sage;
    g.box.scaleX = 0.86 * (mv.x >= AKR_START.khwarizmi ? 1 : -1);
    g.point = Math.max(0, g.point - dt);
    const lift = speaking?.who === "khwarizmi" || g.point > 0;
    g.arm.setAngle(lerp(g.arm.angle, lift ? -62 + (calm ? 0 : Math.sin(t * 5) * 6) : calm ? 0 : Math.sin(t * 1.3) * 2, calm ? 1 : 1 - Math.exp(-dt * 8)));
    g.head.setAngle((speaking?.who === "khwarizmi" ? (calm ? 0 : Math.sin(t * 7) * 3) : calm ? 0 : Math.sin(t * 1.1) * 1.5) + (mv.y < 380 ? -6 : 0));
    g.head.y = -292 + (calm ? 0 : Math.sin(t * 1.5) * 1.2);
    this.blink(g, g.head, "khwarizmi-head", "khwarizmi-headBlink", dt);

    // The child looks at the bird, and waves when speaking.
    const a = this.kid;
    a.box.scaleX = 0.74 * (mv.x >= AKR_START.child ? 1 : -1);
    a.arm.setAngle(speaking?.who === "child" ? -40 + (calm ? 0 : Math.sin(t * 6) * 10) : calm ? 0 : Math.sin(t * 1.4) * 3);
    a.head.setAngle(speaking?.who === "child" && !calm ? Math.sin(t * 8) * 3 : 0);
    a.hop = Math.max(0, a.hop - dt);
    a.box.y = AKR_WORLD.floor + 8 - (calm ? 0 : Math.sin((a.hop / 0.5) * Math.PI) * 10);
    this.blink(a, a.head, "child-head", "child-headBlink", dt);
  }

  // ------------------------------------------------------------------------------------------ leaving
  protected override releaseRoom(): void {
    this.weights = [];
    this.pool = {};
    this.drawn = "";
    this.scoopTip = 0;
  }
}
