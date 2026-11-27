// Ibn Battuta's inn on screen: the ninth room on the room engine (./room.ts). The engine carries the bird, the explorer,
// the camera, touching and the door; this file adds the inn's painting, Ibn Battuta and the child with the camel, the
// camel resting in an arch, the lantern, the great ring on its stand with the stage's beads on it in the ring's order
// (each with the page quest's own sign and its number as dots), the thread drawn from bead to bead as it grows (chosen
// from the quest's own state each time it changes), the page's marks for the bead reached last and for the last slip, the
// ring and the raised bead that show which bead the bird is near enough to touch, the scroll on the lectern (which glows
// while the stage's sentence is hidden), and the saddlebag on the high ledge with the feather in it. What happens is
// decided in sim/battutaroom.ts and sim/route.ts. The ring is not a map, and nothing here writes text.
import { battuta as paintIbn, camelChild as paintChild, portrait } from "../art/cast";
import { glow } from "../art/kit";
import * as props from "../art/props";
import { beadArt, battutaRoom, camelArt, dotsArt, focusArt, lanternArt, lastArt, lecternArt, saddlebagArt, standArt, standBox, threadArt, wrongArt } from "../art/battuta";
import { HELPER, SCHOLAR } from "../content/people";
import { IBR_APPROACH, IBR_CAMEL, IBR_LANTERN, IBR_LAYOUT, IBR_LECTERN, IBR_LEDGE, IBR_RING, IBR_SADDLEBAG, IBR_START, IBR_WORLD, ibrRoom, ibrThings, type IbrSpeaker, type IbrThing } from "../content/battuta-room";
import type { Mood } from "../narrative/dialogue";
import type { Keeper, Quality } from "../save/save";
import { threaded, type RouteStyle } from "../sim/route";
import type { Standing } from "../sim/follow";
import type { BattutaHappened, BattutaState } from "../sim/battutaroom";
import type { Mover } from "../sim/move";
import { ADD, RoomScene, lerp, type Box, type Img, type RoomHost, type RoomThing } from "./room";

export interface BattutaSceneHost extends RoomHost {
  state(): BattutaState;
  /** The page reads right to left: the ring is mirrored, as the page's picture is. */
  rtl: boolean;
  speaking(): { who: IbrSpeaker; mood: Mood } | null;
  look(): { quality: Quality; reducedMotion: boolean; style: RouteStyle; keeper: Keeper };
}

/** How many pieces of thread there can be: one fewer than the longest road (Challenge's ten steps). */
const THREADS = 9;

export class BattutaScene extends RoomScene<BattutaSceneHost> {
  private sage!: { box: Box; arm: Img; head: Img; blink: number; point: number };
  private kid!: { box: Box; head: Img; arm: Img; blink: number; hop: number };
  /** One picture for every bead, by stop, with its place on the ring and its ring order. */
  private beads = new Map<string, { img: Img; x: number; y: number; index: number }>();
  private threads: Img[] = [];
  private lastRing!: Img;
  private wrongRing!: Img;
  private focusBead!: Img;
  private focusRing!: Img;
  private scrollGlow!: Img;
  private lanternGlow!: Img;
  private camel!: Img;
  private feather!: Img;
  private bag!: Img;
  private drawn = "";
  private list: IbrThing[] = [];

  constructor() {
    // The engine's layout with a room of its own, so that this scene can keep only the pegs of its own stage.
    super("battuta", { ...IBR_LAYOUT, room: ibrRoom(8) });
  }

  protected things(): readonly RoomThing[] {
    return this.list;
  }
  protected lit(): boolean {
    return this.host.state().route.done;
  }
  protected override approach(t: RoomThing): number {
    return IBR_APPROACH[(t as IbrThing).kind];
  }
  protected override people(): readonly Standing[] {
    return [{ x: IBR_START.ibn, figure: SCHOLAR }, { x: IBR_START.child, figure: HELPER }];
  }
  protected override tap(x: number, y: number): void {
    // A press on the picture flies the bird to the thing pressed, and touches it: the nearest within its reach.
    if (this.host.frozen()) return;
    const hit = [...this.list].filter((t) => Math.hypot(t.x - x, t.y - y) < Math.max(30, t.reach)).sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y))[0];
    if (hit) this.goTo(hit.id);
  }

  // ------------------------------------------------------------------------------------------ building
  protected build(look: { keeper: Keeper }): void {
    const r = this.host.state().route;
    const rtl = this.host.rtl;
    const n = r.stage.stops.length;
    this.list = ibrThings(r.style, rtl);
    // Only the pegs of this stage are perches (seven, eight or nine beads).
    this.layout.room.perches.splice(0, this.layout.room.perches.length, ...ibrRoom(n, rtl).perches);
    const ts = this.q.texture;
    const T = this.tex.bind(this);
    this.layers();
    const m = this.main;
    this.wide("battuta-room", () => battutaRoom(ts));
    this.putWide(m, "battuta-room", 0, 0, 0);
    T("glow", () => glow(256, ts));
    this.lanternGlow = this.put(m, "glow", IBR_LANTERN.x, IBR_LANTERN.y + 120).setBlendMode(ADD).setScale(1.6 / ts).setTint(0xffd27a).setAlpha(0.5);
    this.put(m, T("lantern", () => lanternArt(ts)), IBR_LANTERN.x, 26, 0.5, 0);
    this.camel = this.put(m, T("camel", () => camelArt(ts)), IBR_CAMEL.x, IBR_WORLD.floor + 4, 0.5, 1);
    this.buildDoor(m);

    // The ring's stand with a peg under every bead, the thread, and the beads with their dots.
    const box = standBox();
    this.put(m, T(`battuta-stand-${n}`, () => standArt(ts, n)), box.x, box.y, 0, 0);
    T("thread", () => threadArt(ts));
    for (let i = 0; i < THREADS; i++) this.threads.push(this.put(m, "thread", 0, 0, 0, 0.5).setVisible(false));
    this.lastRing = this.put(m, T("bead-last", () => lastArt(ts)), 0, 0).setVisible(false);
    this.wrongRing = this.put(m, T("bead-wrong", () => wrongArt(ts)), 0, 0).setVisible(false);
    for (const t of this.list) {
      if (t.kind !== "bead") continue;
      const i = t.index!;
      T(`bead-${i}-off`, () => beadArt(ts, i, false));
      T(`bead-${i}-on`, () => beadArt(ts, i, true));
      const img = this.put(m, `bead-${i}-off`, t.x, t.y);
      this.beads.set(t.stop!, { img, x: t.x, y: t.y, index: i });
      // The bead's number as dots, set outside it, away from the middle of the ring, as on the page.
      const away = Math.atan2(t.y - IBR_RING.cy, t.x - IBR_RING.cx);
      this.put(m, T(`dots-${i + 1}`, () => dotsArt(ts, i + 1)), t.x + Math.cos(away) * (IBR_RING.bead + 22), t.y + Math.sin(away) * (IBR_RING.bead + 22));
    }

    // The lectern with the scroll, and the soft light on it while the stage's sentence is hidden.
    this.scrollGlow = this.put(m, "glow", IBR_LECTERN.x, IBR_LECTERN.scroll).setBlendMode(ADD).setScale(0.8 / ts).setTint(0xfff1c4).setAlpha(0);
    this.put(m, T("lectern", () => lecternArt(ts)), IBR_LECTERN.x, IBR_WORLD.floor + 2, 0.5, 1);
    // The saddlebag on the high ledge, with the feather in it.
    this.feather = this.put(m, T("feather", () => props.feather(ts)), IBR_SADDLEBAG.x + 26, IBR_LEDGE.y - 50).setAngle(30).setScale(0.55 / ts);
    this.bag = this.put(m, T("saddlebag", () => saddlebagArt(ts)), IBR_SADDLEBAG.x, IBR_LEDGE.y + 2, 0.5, 1);
    this.buildRing(m);

    this.buildCast(m, ts, look.keeper);
    // The bead within reach, raised over everyone (the bird stands on its peg, in front of it), with a ring of gold round it.
    const over = this.layer(m);
    T("bead-focus", () => focusArt(ts));
    this.focusBead = this.put(over, "bead-0-off", 0, 0).setVisible(false);
    this.focusRing = this.put(over, "bead-focus", 0, 0).setVisible(false);
    this.buildSparks(m);
  }
  protected override ready(): void {
    this.drawThread();
  }

  private buildCast(m: Box, ts: number, look: Keeper): void {
    const T = this.tex.bind(this);
    const urls: Record<string, string> = {};
    // Ibn Battuta, as the game imagines him: the scholar's cut-out dressed for the road, with a staff. Not a likeness.
    const ia = paintIbn(ts);
    for (const [key, p] of Object.entries(ia)) T(`ibn-${key}`, () => p);
    const sageBox = this.layer(m).setPosition(IBR_START.ibn, IBR_WORLD.floor).setScale(0.86);
    this.put(sageBox, "ibn-body", 0, 2, 0.5, 1);
    const sArm = this.put(sageBox, "ibn-arm", 62, -236, 0.5, 0.05);
    const sHead = this.put(sageBox, "ibn-head", 4, -292, 0.5, 0.58);
    this.sage = { box: sageBox, arm: sArm, head: sHead, blink: 3, point: 0 };
    urls.ibn = portrait(1, { back: ia.body, head: ia.head }, "#9a7048").canvas.toDataURL("image/png");

    // The child with the camel, an invented person, beside the camel's arch.
    const ca = paintChild(ts);
    for (const [key, p] of Object.entries(ca)) T(`child-${key}`, () => p);
    const cBox = this.layer(m).setPosition(IBR_START.child, IBR_WORLD.floor + 8).setScale(0.74);
    this.put(cBox, "child-leg", -14, -68, 0.5, 0);
    this.put(cBox, "child-leg", 14, -68, 0.5, 0);
    this.put(cBox, "child-body", 0, -180, 0.5, 0);
    const cArm = this.put(cBox, "child-arm", 18, -170, 0.5, 0.06);
    const cHead = this.put(cBox, "child-head", 2, -212, 0.5, 0.54);
    this.kid = { box: cBox, head: cHead, arm: cArm, blink: 1.4, hop: 0 };
    urls.child = portrait(1, { back: ca.body, head: ca.head }, "#c2643a").canvas.toDataURL("image/png");

    this.buildKeeper(m, look, urls);
    this.buildBird(m, urls);
    this.host.portraits(urls);
  }

  // ------------------------------------------------------------------------------------------ the thread
  /** Draws the beads on the thread, the thread from bead to bead in the order it was threaded, and the page's marks, as the rules have them. */
  private drawThread(): void {
    const r = this.host.state().route;
    const thread = threaded(r);
    const wrong = r.last && !r.last.right ? r.last.stop : null;
    const key = JSON.stringify([thread, wrong]);
    if (key === this.drawn) return;
    this.drawn = key;
    const on = new Set(thread);
    for (const [stop, b] of this.beads) b.img.setTexture(`bead-${b.index}-${on.has(stop) ? "on" : "off"}`);
    this.threads.forEach((img, k) => {
      const a = thread[k] !== undefined ? this.beads.get(thread[k]!) : undefined;
      const b = thread[k + 1] !== undefined ? this.beads.get(thread[k + 1]!) : undefined;
      if (!a || !b) return void img.setVisible(false);
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      img.setVisible(true).setPosition(a.x, a.y).setRotation(Math.atan2(b.y - a.y, b.x - a.x)).setScale(len / 64 / this.q.texture, 1 / this.q.texture);
    });
    const last = thread.length ? this.beads.get(thread[thread.length - 1]!) : undefined;
    this.lastRing.setVisible(!!last);
    if (last) this.lastRing.setPosition(last.x, last.y);
    const w = wrong ? this.beads.get(wrong) : undefined;
    this.wrongRing.setVisible(!!w);
    if (w) this.wrongRing.setPosition(w.x, w.y);
  }
  /** What the ring shows now, for the browser checks: the beads drawn on the thread, the pieces of thread, the bead marked as the last slip, the bead raised as within reach, the feather, and whether that is what the rules say. */
  shown(): { on: string[]; pieces: number; wrong: string | null; focus: string | null; feather: boolean; agree: boolean } {
    const r = this.host.state().route;
    const on = [...this.beads].filter(([, b]) => b.img.texture.key.endsWith("-on")).map(([stop]) => stop);
    const pieces = this.threads.filter((t) => t.visible).length;
    const wrong = this.wrongRing.visible ? ([...this.beads].find(([, b]) => b.x === this.wrongRing.x && b.y === this.wrongRing.y)?.[0] ?? null) : null;
    const near = this.nearNow();
    const focus = this.focusRing.visible && near?.startsWith("bead-") ? near.slice(5) : null;
    const wantOn = [...new Set(threaded(r))];
    const wantWrong = r.last && !r.last.right ? r.last.stop : null;
    const agree = on.slice().sort().join() === wantOn.slice().sort().join() && pieces === Math.max(0, r.at - 1) && wrong === wantWrong;
    return { on, pieces, wrong, focus, feather: this.feather.visible, agree };
  }

  // ------------------------------------------------------------------------------------------ from the rules
  /** Things that happened in the rules, to be shown. */
  happened(list: BattutaHappened[]): void {
    for (const h of list) {
      if (h.type === "step") {
        this.drawThread();
        const at = this.beads.get(h.stop)!;
        this.burst({ x: at.x, y: at.y }, 6);
        this.sage.point = 1.2;
      } else if (h.type === "slip") this.drawThread();
      else if (h.type === "peek" || h.type === "read") this.burst({ x: IBR_LECTERN.x, y: IBR_LECTERN.scroll }, 5);
      else if (h.type === "feather") this.burst({ x: IBR_SADDLEBAG.x + 26, y: IBR_LEDGE.y - 50 }, 10);
      else if (h.type === "talk" && h.script.startsWith("child")) this.kid.hop = 0.5;
    }
  }
  /** The road is threaded. */
  finished(): void {
    this.drawThread();
    this.burst({ x: IBR_RING.cx, y: IBR_RING.cy }, 14);
  }

  protected override animateRoom(dt: number, mv: Mover, calm: boolean): void {
    const s = this.host.state();
    const t = this.t;
    const speaking = this.host.speaking();
    const ts = this.q.texture;
    this.drawThread();

    // The bead within reach: raised over the bird, a little larger, with the gold ring round it.
    const near = this.nearNow();
    const bead = near?.startsWith("bead-") ? this.beads.get(near.slice(5)) : undefined;
    this.focusBead.setVisible(!!bead);
    this.focusRing.setVisible(!!bead);
    if (bead) {
      const grow = calm ? 1.18 : 1.18 + Math.sin(t * 5) * 0.03;
      this.focusBead.setTexture(bead.img.texture.key).setPosition(bead.x, bead.y).setScale(grow / ts);
      this.focusRing.setPosition(bead.x, bead.y).setScale(grow / ts);
    }

    // The scroll glows while the sentence is hidden: it is where the stage is read again.
    this.scrollGlow.setAlpha(lerp(this.scrollGlow.alpha, !s.route.showing && !s.route.done ? 0.32 + (calm ? 0 : Math.sin(t * 2.4) * 0.08) : 0, calm ? 1 : 0.08));
    this.lanternGlow.setAlpha(calm ? 0.5 : 0.46 + Math.sin(t * 3.1) * 0.04 + Math.sin(t * 7.3) * 0.02);
    this.feather.setVisible(!s.route.flags.includes("feather"));
    this.bag.setAngle(calm ? 0 : Math.sin(t * 1.3) * 0.8);
    // The camel breathes, slowly.
    this.camel.setScale(1 / ts, (calm ? 1 : 1 + Math.sin(t * 1.1) * 0.012) / ts);

    // Ibn Battuta turns to the bird, and points when the thread moves on or he speaks.
    const g = this.sage;
    g.box.scaleX = 0.86 * (mv.x >= IBR_START.ibn ? 1 : -1);
    g.point = Math.max(0, g.point - dt);
    const raise = speaking?.who === "ibn" || g.point > 0;
    g.arm.setAngle(lerp(g.arm.angle, raise ? -62 + (calm ? 0 : Math.sin(t * 5) * 6) : calm ? 0 : Math.sin(t * 1.3) * 2, calm ? 1 : 1 - Math.exp(-dt * 8)));
    g.head.setAngle((speaking?.who === "ibn" ? (calm ? 0 : Math.sin(t * 7) * 3) : calm ? 0 : Math.sin(t * 1.1) * 1.5) + (mv.y < 380 ? -6 : 0));
    g.head.y = -292 + (calm ? 0 : Math.sin(t * 1.5) * 1.2);
    this.blink(g, g.head, "ibn-head", "ibn-headBlink", dt);

    // The child looks at the bird, and waves when speaking.
    const a = this.kid;
    a.box.scaleX = 0.74 * (mv.x >= IBR_START.child ? 1 : -1);
    a.arm.setAngle(speaking?.who === "child" ? -40 + (calm ? 0 : Math.sin(t * 6) * 10) : calm ? 0 : Math.sin(t * 1.4) * 3);
    a.head.setAngle(speaking?.who === "child" && !calm ? Math.sin(t * 8) * 3 : 0);
    a.hop = Math.max(0, a.hop - dt);
    a.box.y = IBR_WORLD.floor + 8 - (calm ? 0 : Math.sin((a.hop / 0.5) * Math.PI) * 10);
    this.blink(a, a.head, "child-head", "child-headBlink", dt);
  }
  // ------------------------------------------------------------------------------------------ leaving
  protected override releaseRoom(): void {
    this.beads.clear();
    this.threads = [];
    this.drawn = "";
  }
}
