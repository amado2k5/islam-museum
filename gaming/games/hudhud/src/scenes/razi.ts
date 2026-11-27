// Al-Razi's study on screen: the seventh room on the room engine (./room.ts). The engine carries the bird, the explorer,
// the camera, touching and the door; this file adds the study's painting, al-Razi and the child who helps, the leaves of
// the notebook standing in their slots on the long desk (each the page quest's own drawing, chosen from the quest's own
// state each time it changes: plain, held by the binding, or where the binding stopped; a lifted one raised with the
// page's ring round it and a shadow behind it), the binding thread run through the leaves that held, a knot once the
// notebook is bound, the binding frame at the end of the desk, and the bundle of loose leaves on the tall bookcase with
// the feather between its leaves. What happens is decided in sim/raziroom.ts and sim/leaves.ts; how far a binding is
// shown is the page's (ui/razi.ts). Nothing medical is drawn, and nothing here writes text.
import { RAZI_LOOK, leafChild as paintChild, portrait, scholar as paintScholar } from "../art/cast";
import { glow } from "../art/kit";
import * as props from "../art/props";
import { LEAF_PAD, bindingFrame, knotArt, leafArt, leafBundle, leafRect, leafShadow, liftRing, raziStudy, slotArt, threadArt, type LeafMode } from "../art/razi";
import { RZR_APPROACH, RZR_BUNDLE, RZR_DESK, RZR_FRAME, RZR_LAYOUT, RZR_LEAF, RZR_SLOT_H, RZR_START, RZR_WORLD, placeAt, rzrThings, type RzrSpeaker, type RzrThing } from "../content/razi-room";
import type { Mood } from "../narrative/dialogue";
import type { Keeper, Quality } from "../save/save";
import type { LeavesStyle } from "../sim/leaves";
import type { Mover } from "../sim/move";
import type { RaziHappened, RaziState } from "../sim/raziroom";
import { ADD, RoomScene, lerp, type Box, type Img, type RoomHost, type RoomThing } from "./room";
import { HELPER, SCHOLAR } from "../content/people";
import type { Standing } from "../sim/follow";

/** What the study is showing, beyond the rules' state: how far the last binding has been shown, where it stopped, whether it is being shown, and whether the door is lit. */
export interface RaziView {
  state: RaziState;
  /** Leaves the thread has passed through so far. */
  lit: number;
  /** The place where the last binding stopped, once it has been shown; or null. */
  stopped: number | null;
  /** A binding is being shown a leaf at a time. */
  running: boolean;
  /** The notebook is bound and the binding shown: the door is lit. */
  done: boolean;
}
export interface RaziSceneHost extends RoomHost {
  view(): RaziView;
  /** The page reads right to left: the first place is on the right, as on the page. */
  rtl: boolean;
  speaking(): { who: RzrSpeaker; mood: Mood } | null;
  look(): { quality: Quality; reducedMotion: boolean; style: LeavesStyle; keeper: Keeper };
}

/** How high a lifted leaf rises out of its slot, in game pixels: enough to show over the bird standing before it. */
const RAISE = 34;

export class RaziScene extends RoomScene<RaziSceneHost> {
  private sage!: { box: Box; arm: Img; head: Img; blink: number; point: number };
  private kid!: { box: Box; head: Img; arm: Img; blink: number; hop: number };
  /** One picture for each place on the desk; its texture is the leaf that stands there now, as the binding has it. */
  private places: { img: Img; x: number; y: number; dx: number; lift: number }[] = [];
  private shadow!: Img;
  private liftRingImg!: Img;
  private lifting!: Box;
  private anchor!: Img;
  /** The thread: a lead from outside the row, then a length into each leaf that held. */
  private thread: Img[] = [];
  private knot!: Img;
  private frameImg!: Img;
  private deskGlow!: Img;
  private bundleImg!: Img;
  private feather!: Img;
  private drawn = "";
  private list: RzrThing[] = [];
  private n = 0;
  private style: LeavesStyle = "explorer";

  constructor() {
    super("razi", RZR_LAYOUT);
  }

  protected things(): readonly RoomThing[] {
    return this.list;
  }
  protected lit(): boolean {
    return this.host.view().done;
  }
  /** Where the room's people stand: the explorer stops short of them (sim/follow.ts). */
  protected override people(): readonly Standing[] {
    return [{ x: RZR_START.razi, figure: SCHOLAR }, { x: RZR_START.child, figure: HELPER }];
  }
  protected override approach(t: RoomThing): number {
    return RZR_APPROACH[(t as RzrThing).kind];
  }
  protected override tap(x: number, y: number): void {
    // A press on the picture flies the bird to the thing pressed, and touches it.
    if (this.host.frozen()) return;
    const hit = this.list.find((t) => Math.hypot(t.x - x, t.y - y) < 48);
    if (hit) this.goTo(hit.id);
  }

  // ------------------------------------------------------------------------------------------ building
  private leafKey(id: string, mode: LeafMode): string {
    return `leaf-${this.style}-${id}-${mode}`;
  }
  protected build(look: { keeper: Keeper }): void {
    const v = this.host.view();
    const s = v.state.leaves;
    const rtl = this.host.rtl;
    this.style = s.style;
    this.n = s.puzzle.places.length;
    this.list = rzrThings(s.style, rtl);
    const ts = this.q.texture;
    const T = this.tex.bind(this);
    const k = RZR_LEAF.k;
    this.layers();
    const m = this.main;
    this.wide("razi-study", () => raziStudy(ts));
    this.putWide(m, "razi-study", 0, 0, 0);
    T("glow", () => glow(256, ts));
    // A soft light over the desk once the notebook is bound.
    this.deskGlow = this.put(m, "glow", RZR_LEAF.cx, RZR_LEAF.y).setBlendMode(ADD).setScale(4.4 / ts, 1.6 / ts).setAlpha(0).setTint(0xfff1c4);
    this.buildDoor(m);

    // The leaves: a texture for each leaf of this way of playing in each of its three looks, a slot and a picture for each place.
    for (const part of s.puzzle.parts) for (const mode of ["plain", "held", "stopped"] as const) T(this.leafKey(part.id, mode), () => leafArt(ts, part.id, this.n, mode));
    T(`leaf-shadow-${this.n}`, () => leafShadow(ts, this.n));
    T("thread", () => threadArt(ts));
    T(`leaf-ring-${this.n}`, () => liftRing(ts, this.n));
    const slotY = RZR_DESK.top - RZR_SLOT_H;
    for (let p = 0; p < this.n; p++) {
      const at = placeAt(p, this.n, rtl);
      this.put(m, T(`slot-${this.n}-${p}`, () => slotArt(ts, this.n, p)), at.x, slotY, 0.5, 0);
    }
    this.places = s.puzzle.places.map((id, p) => {
      const at = placeAt(p, this.n, rtl);
      // The leaf stands in its slot, its foot in the slot's groove.
      const img = this.put(m, this.leafKey(id ?? s.puzzle.parts[0]!.id, "plain"), at.x, at.y).setScale(k / ts);
      return { img, x: at.x, y: at.y, dx: 0, lift: 0 };
    });
    // A marker after the leaves: a leaf put down goes back in front of it, under the thread.
    this.anchor = this.put(m, "thread", 0, 0).setVisible(false);
    for (let i = 0; i <= this.n; i++) this.thread.push(this.put(m, "thread", 0, 0, 0, 0.5).setVisible(false));
    this.knot = this.put(m, T("knot", () => knotArt(ts)), 0, 0).setVisible(false).setScale(k / ts);

    // The binding frame at the end of the desk, and the bundle of loose leaves on the tall bookcase with the feather between them.
    this.frameImg = this.put(m, T("binding-frame", () => bindingFrame(ts)), RZR_FRAME.x, RZR_DESK.top + 2, 0.5, 1);
    this.feather = this.put(m, T("feather", () => props.feather(ts)), RZR_BUNDLE.x + 36, RZR_BUNDLE.y + 18).setAngle(70).setScale(0.55 / ts);
    this.bundleImg = this.put(m, T("leaf-bundle", () => leafBundle(ts)), RZR_BUNDLE.x, RZR_BUNDLE.y + 32, 0.5, 1);
    this.buildRing(m);

    this.buildCast(m, ts, look.keeper);
    // The lifted leaf is held up in front of everyone, the bird included, with its shadow and the page's ring: a layer of its own over the cast.
    this.lifting = this.layer(m);
    this.shadow = this.put(this.lifting, `leaf-shadow-${this.n}`, 0, 0).setVisible(false);
    this.liftRingImg = this.put(this.lifting, `leaf-ring-${this.n}`, 0, 0).setVisible(false);
    this.buildSparks(m);
  }
  protected override ready(): void {
    this.placeLeaves();
  }

  private buildCast(m: Box, ts: number, look: Keeper): void {
    const T = this.tex.bind(this);
    const urls: Record<string, string> = {};
    // Al-Razi, as the game imagines him: the scholar's cut-out in the warm browns of a quiet study. Not a likeness.
    const ra = paintScholar(ts, RAZI_LOOK);
    for (const [key, p] of Object.entries(ra)) T(`razi-${key}`, () => p);
    const sageBox = this.layer(m).setPosition(RZR_START.razi, RZR_WORLD.floor).setScale(0.86);
    this.put(sageBox, "razi-body", 0, 2, 0.5, 1);
    const sArm = this.put(sageBox, "razi-arm", 62, -236, 0.5, 0.05);
    const sHead = this.put(sageBox, "razi-head", 4, -292, 0.5, 0.58);
    this.sage = { box: sageBox, arm: sArm, head: sHead, blink: 3, point: 0 };
    urls.razi = portrait(1, { back: ra.body, head: ra.head }, "#8a5a3a").canvas.toDataURL("image/png");

    // The child who helps, an invented person, by the far end.
    const ca = paintChild(ts);
    for (const [key, p] of Object.entries(ca)) T(`child-${key}`, () => p);
    const cBox = this.layer(m).setPosition(RZR_START.child, RZR_WORLD.floor + 8).setScale(0.74);
    this.put(cBox, "child-leg", -14, -68, 0.5, 0);
    this.put(cBox, "child-leg", 14, -68, 0.5, 0);
    this.put(cBox, "child-body", 0, -180, 0.5, 0);
    const cArm = this.put(cBox, "child-arm", 18, -170, 0.5, 0.06);
    const cHead = this.put(cBox, "child-head", 2, -212, 0.5, 0.54);
    this.kid = { box: cBox, head: cHead, arm: cArm, blink: 1.4, hop: 0 };
    urls.child = portrait(1, { back: ca.body, head: ca.head }, "#1d7f86").canvas.toDataURL("image/png");

    this.buildKeeper(m, look, urls);
    this.buildBird(m, urls);
    this.host.portraits(urls);
  }

  // ------------------------------------------------------------------------------------------ the desk
  /** The look of the leaf in place p, as the binding shown so far has it (the page's own rule). */
  private modeOf(v: RaziView, p: number): LeafMode {
    if (v.stopped === p) return "stopped";
    return p < v.lit ? "held" : "plain";
  }
  /** Puts every leaf where the rules say it stands, in the look the binding gives it, and raises the lifted one. */
  private placeLeaves(): void {
    const v = this.host.view();
    const s = v.state.leaves;
    const key = JSON.stringify([s.puzzle.places, v.state.lifted, v.lit, v.stopped, v.done]);
    if (key === this.drawn) return;
    this.drawn = key;
    s.puzzle.places.forEach((id, p) => this.places[p]!.img.setVisible(!!id).setTexture(this.leafKey(id ?? s.puzzle.parts[0]!.id, this.modeOf(v, p))));
    // The lifted leaf is held up over the bird and the other figures, its shadow just under it and the page's ring just
    // over it; put down, it goes back among the other leaves, under the thread.
    this.places.forEach((pl, p) => {
      const up = v.state.lifted === p;
      if (up && pl.img.parentContainer !== this.lifting) {
        this.main.remove(pl.img);
        this.lifting.addAt(pl.img, this.lifting.getIndex(this.liftRingImg));
      } else if (!up && pl.img.parentContainer === this.lifting) {
        this.lifting.remove(pl.img);
        this.main.addAt(pl.img, this.main.getIndex(this.anchor));
      }
    });
  }
  /** Where the thread passes through the leaf in place p, as it is drawn now. */
  private holeOf(p: number): { x: number; y: number } {
    const pl = this.places[p]!;
    const r = leafRect(this.n);
    const scale = (1 + pl.lift * 0.06) * RZR_LEAF.k;
    return { x: pl.img.x, y: pl.img.y + (r.y + 16 - (r.h + 2 * LEAF_PAD) / 2) * scale };
  }
  /** Lays the thread through the first `through` leaves, with the knot after the last when the notebook is bound. */
  private layThread(through: number, knot: boolean): void {
    const ts = this.q.texture;
    const k = RZR_LEAF.k;
    const out = this.host.rtl ? 1 : -1;
    const pts: { x: number; y: number }[] = [];
    if (through > 0) {
      const h0 = this.holeOf(0);
      pts.push({ x: h0.x + out * 30 * k, y: h0.y - 10 * k });
      for (let i = 0; i < through; i++) pts.push(this.holeOf(i));
    }
    this.thread.forEach((img, i) => {
      const a = pts[i];
      const b = pts[i + 1];
      img.setVisible(!!(a && b));
      if (!a || !b) return;
      img.setPosition(a.x, a.y).setRotation(Math.atan2(b.y - a.y, b.x - a.x)).setScale(Math.hypot(b.x - a.x, b.y - a.y) / 64 / ts, k / ts);
    });
    this.knot.setVisible(knot && through > 0);
    if (knot && through > 0) {
      const e = pts[pts.length - 1]!;
      this.knot.setPosition(e.x - out * 14 * k, e.y);
    }
  }
  /** What the desk shows now, for the browser checks: the leaf in each place, which place is raised, how many leaves the thread passes through, the knot, the feather, and whether that is what the rules and the binding shown say. */
  shown(): { places: string[]; modes: string[]; lifted: number | null; thread: number; knot: boolean; feather: boolean; agree: boolean } {
    const v = this.host.view();
    const s = v.state.leaves;
    const keys = this.places.map((p) => String(p.img.texture.key).replace(`leaf-${this.style}-`, ""));
    const places = keys.map((k) => k.split("-").slice(0, 2).join("-"));
    const modes = keys.map((k) => k.split("-")[2] ?? "");
    const raised = this.places.findIndex((p) => p.lift > 0.5);
    const lifted = this.liftRingImg.visible && raised >= 0 ? raised : null;
    // The lead from outside the row and one length into each leaf after the first: as many lengths as leaves threaded.
    const thread = this.thread.filter((x) => x.visible).length;
    const want = v.done ? this.n : Math.min(v.lit, this.n);
    const agree = places.join() === s.puzzle.places.join() && lifted === v.state.lifted && thread === want && modes.every((m, p) => m === this.modeOf(v, p));
    return { places, modes, lifted, thread, knot: this.knot.visible, feather: this.feather.visible, agree };
  }

  // ------------------------------------------------------------------------------------------ from the rules
  /** Things that happened in the rules, to be shown. */
  happened(list: RaziHappened[]): void {
    const calm = this.host.look().reducedMotion;
    for (const h of list) {
      if (h.type === "exchange") {
        this.placeLeaves();
        // Each of the two leaves slides from where it stood into its new place.
        const a = this.places[h.a]!;
        const b = this.places[h.b]!;
        if (!calm) (a.dx = b.x - a.x), (b.dx = a.x - b.x);
        this.burst({ x: a.x, y: a.y }, 4);
        this.burst({ x: b.x, y: b.y }, 4);
        this.sage.point = 1.2;
      } else if (h.type === "bind") this.burst({ x: RZR_FRAME.x, y: RZR_FRAME.y - 30 }, 6);
      else if (h.type === "feather") this.burst({ x: RZR_BUNDLE.x + 36, y: RZR_BUNDLE.y + 16 }, 10);
      else if (h.type === "talk" && h.script.startsWith("child")) this.kid.hop = 0.5;
    }
  }
  /** One more leaf of a binding has been shown: a small burst where the thread passes through it. */
  stepShown(place: number): void {
    const h = this.places[place] ? this.holeOf(place) : null;
    if (h) this.burst(h, 3);
  }
  /** The notebook is bound and shown. */
  bound(): void {
    this.burst({ x: RZR_LEAF.cx, y: RZR_LEAF.y }, 14);
  }

  protected override animateRoom(dt: number, mv: Mover, calm: boolean): void {
    const v = this.host.view();
    const s = v.state;
    const t = this.t;
    const speaking = this.host.speaking();
    this.placeLeaves();
    const ts = this.q.texture;
    const k = RZR_LEAF.k;

    // The leaves: a lifted one rises and casts a shadow; exchanged ones slide home.
    const ease = calm ? 1 : 1 - Math.exp(-dt * 12);
    this.places.forEach((pl, p) => {
      const up = s.lifted === p ? 1 : 0;
      pl.lift = calm ? up : lerp(pl.lift, up, ease);
      pl.dx = calm ? 0 : lerp(pl.dx, 0, 1 - Math.exp(-dt * 10));
      if (Math.abs(pl.dx) < 0.5) pl.dx = 0;
      pl.img.setPosition(pl.x + pl.dx, pl.y - pl.lift * RAISE).setScale(((1 + pl.lift * 0.06) * k) / ts);
    });
    const lifted = s.lifted !== null ? this.places[s.lifted] : undefined;
    this.shadow.setVisible(!!lifted);
    this.liftRingImg.setVisible(!!lifted);
    if (lifted) {
      this.shadow.setPosition(lifted.x + 6, lifted.y + 4).setScale(k / ts).setAlpha(lifted.lift);
      this.liftRingImg.setPosition(lifted.img.x, lifted.img.y).setScale(((1 + lifted.lift * 0.06) * k) / ts);
    }
    this.layThread(v.done ? this.n : Math.min(v.lit, this.n), v.done);

    this.deskGlow.setAlpha(lerp(this.deskGlow.alpha, v.done ? 0.2 : 0, calm ? 1 : 0.06));
    this.feather.setVisible(!s.leaves.flags.includes("feather"));
    this.bundleImg.setAngle(calm ? 0 : Math.sin(t * 1.7) * 0.6);
    this.frameImg.setAngle(v.running && !calm ? Math.sin(t * 12) * 0.8 : 0);

    // Al-Razi turns to the bird, and points when two leaves are exchanged or he speaks.
    const g = this.sage;
    g.box.scaleX = 0.86 * (mv.x >= RZR_START.razi ? 1 : -1);
    g.point = Math.max(0, g.point - dt);
    const raise = speaking?.who === "razi" || g.point > 0;
    g.arm.setAngle(lerp(g.arm.angle, raise ? -62 + (calm ? 0 : Math.sin(t * 5) * 6) : calm ? 0 : Math.sin(t * 1.3) * 2, calm ? 1 : 1 - Math.exp(-dt * 8)));
    g.head.setAngle((speaking?.who === "razi" ? (calm ? 0 : Math.sin(t * 7) * 3) : calm ? 0 : Math.sin(t * 1.1) * 1.5) + (mv.y < 380 ? -6 : 0));
    g.head.y = -292 + (calm ? 0 : Math.sin(t * 1.5) * 1.2);
    this.blink(g, g.head, "razi-head", "razi-headBlink", dt);

    // The child looks at the bird, and waves when speaking.
    const a = this.kid;
    a.box.scaleX = 0.74 * (mv.x >= RZR_START.child ? 1 : -1);
    a.arm.setAngle(speaking?.who === "child" ? -40 + (calm ? 0 : Math.sin(t * 6) * 10) : calm ? 0 : Math.sin(t * 1.4) * 3);
    a.head.setAngle(speaking?.who === "child" && !calm ? Math.sin(t * 8) * 3 : 0);
    a.hop = Math.max(0, a.hop - dt);
    a.box.y = RZR_WORLD.floor + 8 - (calm ? 0 : Math.sin((a.hop / 0.5) * Math.PI) * 10);
    this.blink(a, a.head, "child-head", "child-headBlink", dt);
  }
  // ------------------------------------------------------------------------------------------ leaving
  protected override releaseRoom(): void {
    this.places = [];
    this.thread = [];
    this.drawn = "";
  }
}
