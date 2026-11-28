// The Alhambra's court on screen: the twelfth room on the room engine (./room.ts). The engine carries the bird, the
// explorer, the camera, touching and the door; this file adds the court's painting, the keeper of the water and the girl
// who sweeps the court, the pieces of the channels set in the great stone panel (each the page quest's own drawing of
// its place, painted again from the quest's own state whenever that place changes: turned, wet, spilling, marked as the
// piece turned last), the water running along them after a turn where the way of playing shows it (step by step as on the
// page, or at once when movement is kept still), the spout and its pipe, the sluice lever in Challenge, the feather on the
// rim of the dry fountain, and the page of the Atlas floating up out of the fountain at the end. What happens is decided
// in sim/alhambraroom.ts and sim/channels.ts. Nothing here writes text.
import type * as Phaser from "phaser";
import { HELPER, SCHOLAR } from "../content/people";
import { portrait, sweeper as paintGirl, waterkeeper as paintKeeper } from "../art/cast";
import { glow } from "../art/kit";
import * as props from "../art/props";
import { SPOUT_BOX, alhambraCourt, leverArt, paintPiece, pieceSheet, placeLook, spoutArt, viewOf } from "../art/alhambra-room";
import type { Painted } from "../art/kit";
import { AHR_APPROACH, AHR_LAYOUT, AHR_LEVER, AHR_PANEL, AHR_START, AHR_WORLD, ahrRoom, ahrThings, mirrorX, placeAt, rimSpot, type AhrSpeaker, type AhrThing } from "../content/alhambra-room";
import type { Mood } from "../narrative/dialogue";
import type { Keeper, Quality } from "../save/save";
import { flow, type ChannelsStyle } from "../sim/channels";
import { runOf, waterShown, type AlhambraHappened, type AlhambraState } from "../sim/alhambraroom";
import type { Standing } from "../sim/follow";
import type { Mover } from "../sim/move";
import { ADD, RoomScene, lerp, type Box, type Img, type RoomHost, type RoomThing } from "./room";

/** What the court is showing, beyond the rules' state: whether the door is lit. */
export interface AlhambraView {
  state: AlhambraState;
  /** The water reaches every basin: the door is lit. */
  done: boolean;
}
export interface AlhambraSceneHost extends RoomHost {
  view(): AlhambraView;
  /** The page reads right to left: the first column is on the right, and every piece is its own mirror image, as on the page. */
  rtl: boolean;
  speaking(): { who: AhrSpeaker; mood: Mood } | null;
  look(): { quality: Quality; reducedMotion: boolean; style: ChannelsStyle; keeper: Keeper };
}

export class AlhambraScene extends RoomScene<AlhambraSceneHost> {
  private sage!: { box: Box; arm: Img; head: Img; blink: number; point: number };
  private kid!: { box: Box; head: Img; arm: Img; blink: number; hop: number };
  /** One picture for each place on the panel, its own canvas, painted again when the place changes. */
  private places: { img: Img; pic: Painted; key: string; drawn: string }[] = [];
  private spoutDry!: Img;
  private spoutWet!: Img;
  private lever: Img | null = null;
  private feather!: Img;
  private pageImg!: Img;
  private pageRise = 0;
  private fountainGlow!: Img;
  private list: AhrThing[] = [];
  /** How far the water has run (the page's `fill`): places reached in fewer steps than this are drawn wet. */
  private fill = Infinity;
  private tick = 0;
  /** The piece turned last, for its gold outline (the page's `marked`). */
  private mark: number | null = null;

  constructor() {
    // The ledge under the spout depends on the reading direction: the court is laid out again when it is built.
    super("alhambra", { ...AHR_LAYOUT, room: ahrRoom(false) });
  }

  protected things(): readonly RoomThing[] {
    return this.list;
  }
  protected lit(): boolean {
    return this.host.view().done;
  }
  /** Where the court's people stand: the explorer stops short of them (sim/follow.ts). */
  protected override people(): readonly Standing[] {
    return [{ x: AHR_START.waterkeeper, figure: SCHOLAR }, { x: AHR_START.girl, figure: HELPER }];
  }
  protected override approach(t: RoomThing): number {
    return AHR_APPROACH[(t as AhrThing).kind];
  }
  protected override tap(x: number, y: number): void {
    // A press on the picture flies the bird to the thing pressed, and touches it: the nearest within its reach.
    if (this.host.frozen()) return;
    const hit = this.list.filter((t) => Math.hypot(t.x - x, t.y - y) < Math.max(30, t.reach)).sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y))[0];
    if (hit) this.goTo(hit.id);
  }

  // ------------------------------------------------------------------------------------------ building
  protected build(look: { keeper: Keeper }): void {
    const c = this.host.view().state.channels;
    const rtl = this.host.rtl;
    this.list = ahrThings(c.style, rtl);
    // The ledge under the spout is at the end the grid's first column is on: the perches are laid out for this reading direction.
    this.layout.room = ahrRoom(rtl);
    const ts = this.q.texture;
    const T = this.tex.bind(this);
    this.layers();
    const m = this.main;
    this.wide("alhambra-court", () => alhambraCourt(ts));
    this.putWide(m, "alhambra-court", 0, 0, 0);
    T("glow", () => glow(256, ts));
    this.buildDoor(m);

    // The spout and its pipe, dry and wet (the scene shows the one the way of playing shows), mirrored on a page read right to left.
    const sx = rtl ? 2 * AHR_PANEL.cx - SPOUT_BOX.x - SPOUT_BOX.w : SPOUT_BOX.x;
    this.spoutDry = this.put(m, T(`spout-${c.style}-dry`, () => spoutArt(ts, c.style, false)), sx, SPOUT_BOX.y, 0, 0).setFlipX(rtl);
    this.spoutWet = this.put(m, T(`spout-${c.style}-wet`, () => spoutArt(ts, c.style, true)), sx, SPOUT_BOX.y, 0, 0).setFlipX(rtl).setVisible(false);
    if (c.style === "challenge") {
      T("lever-shut", () => leverArt(ts, false));
      T("lever-open", () => leverArt(ts, true));
      this.lever = this.put(m, "lever-shut", mirrorX(AHR_LEVER.x, rtl), AHR_LEVER.y + 30, 0.5, 1).setFlipX(rtl);
    }

    // The pieces: a canvas of its own for each place of the grid, painted from the quest's state.
    const n = c.rows * c.cols;
    for (let p = 0; p < n; p++) {
      const key = `piece-${p}`;
      const pic = pieceSheet(ts);
      paintPiece(pic, viewOf(c, Infinity, null), p, false, []);
      T(key, () => pic);
      const at = placeAt(p, c.rows, c.cols, rtl);
      // On a right to left page every piece is its own mirror image, as on the page, so that the channels still meet across every seam.
      const img = this.put(m, key, at.x, at.y).setFlipX(rtl);
      this.places.push({ img, pic, key, drawn: "" });
    }
    // The page of the Atlas, hidden in the dry fountain until the water reaches it; the glow over the fountain once it does.
    const fountain = c.basins.find((b) => b.kind === "fountain")!;
    const fAt = placeAt(fountain.cell, c.rows, c.cols, rtl);
    this.fountainGlow = this.put(m, "glow", fAt.x, fAt.y).setBlendMode(ADD).setScale(1.2 / ts).setAlpha(0).setTint(0xcfe3ff);
    this.pageImg = this.put(m, T("atlas-page", () => props.page(ts, true)), fAt.x, fAt.y).setScale(0.5 / ts).setVisible(false);
    // The feather on the rim of the dry fountain, until it is found.
    const rim = rimSpot(c.style, rtl);
    this.feather = this.put(m, T("feather", () => props.feather(ts)), rim.x, rim.y - 6).setAngle(rtl ? -28 : 28).setScale(0.55 / ts);
    this.buildRing(m);

    this.buildCast(m, ts, look.keeper);
    this.buildSparks(m);
  }
  protected override ready(): void {
    this.fill = Infinity;
    this.mark = null;
    this.paintPlaces();
  }

  private buildCast(m: Box, ts: number, look: Keeper): void {
    const T = this.tex.bind(this);
    const urls: Record<string, string> = {};
    // The keeper of the water, an invented person: the scholar's cut-out in colours of his own. Not a likeness of anyone.
    const ka = paintKeeper(ts);
    for (const [k, p] of Object.entries(ka)) T(`waterkeeper-${k}`, () => p);
    const sageBox = this.layer(m).setPosition(AHR_START.waterkeeper, AHR_WORLD.floor).setScale(0.86);
    this.put(sageBox, "waterkeeper-body", 0, 2, 0.5, 1);
    const sArm = this.put(sageBox, "waterkeeper-arm", 62, -236, 0.5, 0.05);
    const sHead = this.put(sageBox, "waterkeeper-head", 4, -292, 0.5, 0.58);
    this.sage = { box: sageBox, arm: sArm, head: sHead, blink: 3, point: 0 };
    urls.voice = portrait(1, { back: ka.body, head: ka.head }, "#2f6f78").canvas.toDataURL("image/png");

    // The girl who sweeps the court, an invented person, with her broom.
    const ga = paintGirl(ts);
    for (const [k, p] of Object.entries(ga)) T(`girl-${k}`, () => p);
    const gBox = this.layer(m).setPosition(AHR_START.girl, AHR_WORLD.floor + 8).setScale(0.74);
    this.put(gBox, "girl-leg", -14, -68, 0.5, 0);
    this.put(gBox, "girl-leg", 14, -68, 0.5, 0);
    this.put(gBox, "girl-body", 0, -180, 0.5, 0);
    const gArm = this.put(gBox, "girl-arm", 18, -170, 0.5, 0.06);
    const gHead = this.put(gBox, "girl-head", 2, -212, 0.5, 0.54);
    this.kid = { box: gBox, head: gHead, arm: gArm, blink: 1.4, hop: 0 };
    urls.kid = portrait(1, { back: ga.body, head: ga.head }, "#b8443c").canvas.toDataURL("image/png");

    this.buildKeeper(m, look, urls);
    this.buildBird(m, urls);
    this.host.portraits(urls);
  }

  // ------------------------------------------------------------------------------------------ the panel
  /** Paints again every place whose look has changed, and sends it to the graphics card anew. */
  private paintPlaces(): void {
    const c = this.host.view().state.channels;
    const v = viewOf(c, this.fill, this.mark);
    const f = flow(v.grid);
    const leaks = v.showWater ? f.leaks.filter((l) => f.reach[l.cell]! < this.fill) : [];
    this.places.forEach((pl, p) => {
      const look = placeLook(c, p, this.fill, this.mark);
      if (look === pl.drawn) return;
      pl.drawn = look;
      const wet = v.showWater && f.wet[p]! && f.reach[p]! < this.fill;
      paintPiece(pl.pic, v, p, wet, leaks);
      (this.textures.get(pl.key) as Phaser.Textures.CanvasTexture).refresh();
    });
  }
  /** The water runs along the channels a step at a time, as on the page, unless movement is kept still: then it is simply there. */
  private runWater(): void {
    const c = this.host.view().state.channels;
    const { far } = runOf(c);
    if (!waterShown(c) || this.host.look().reducedMotion || far <= 1) {
      this.fill = Infinity;
      this.tick = 0;
      return;
    }
    this.fill = 0;
    this.tick = 0;
  }
  /** Whether the water is still running along the channels in the picture. */
  running(): boolean {
    return this.fill !== Infinity;
  }
  /** What the panel shows now, for the browser checks: each place's look as drawn, the places drawn wet, the spout and the lever, the feather, the page, and whether all of it is what the rules say. */
  shown(): { looks: string[]; wet: number[]; spout: "wet" | "dry"; lever: "open" | "shut" | null; feather: boolean; page: boolean; running: boolean; agree: boolean } {
    const c = this.host.view().state.channels;
    const looks = this.places.map((pl) => pl.drawn);
    const wet = looks.flatMap((l, p) => ((JSON.parse(l || "[0,0,false]") as unknown[])[2] === true ? [p] : []));
    const spout = this.spoutWet.visible ? "wet" : "dry";
    const lever = this.lever ? (this.lever.texture.key === "lever-open" ? "open" : "shut") : null;
    const agree = looks.every((l, p) => l === placeLook(c, p, this.fill, this.mark)) && (spout === "wet") === waterShown(c) && (lever === null || (lever === "open") === (c.last?.type === "open"));
    return { looks, wet, spout, lever, feather: this.feather.visible, page: this.pageImg.visible, running: this.running(), agree };
  }

  // ------------------------------------------------------------------------------------------ from the rules
  /** Things that happened in the rules, to be shown. */
  happened(list: AlhambraHappened[]): void {
    const rtl = this.host.rtl;
    const c = this.host.view().state.channels;
    for (const h of list) {
      if (h.type === "turn") {
        this.mark = h.place;
        this.runWater();
        const at = placeAt(h.place, c.rows, c.cols, rtl);
        this.burst(at, 4);
        this.sage.point = 1.2;
      } else if (h.type === "open") {
        this.runWater();
        this.burst({ x: mirrorX(AHR_LEVER.x, rtl), y: AHR_LEVER.y }, 6);
      } else if (h.type === "opened") {
        const f = c.basins.find((b) => b.kind === "fountain")!;
        this.burst(placeAt(f.cell, c.rows, c.cols, rtl), 14);
      } else if (h.type === "feather") {
        const rim = rimSpot(c.style, rtl);
        this.burst(rim, 10);
      } else if (h.type === "talk" && h.script.startsWith("kid")) this.kid.hop = 0.5;
    }
    this.paintPlaces();
  }

  protected override animateRoom(dt: number, mv: Mover, calm: boolean): void {
    const v = this.host.view();
    const c = v.state.channels;
    const t = this.t;
    const speaking = this.host.speaking();
    // The water's run, step by step as on the page.
    if (this.fill !== Infinity) {
      const { far, delay } = runOf(c);
      this.tick += dt * 1000;
      while (this.tick >= delay && this.fill !== Infinity) {
        this.tick -= delay;
        this.fill += 1;
        if (this.fill > far) this.fill = Infinity;
      }
      if (calm || !waterShown(c)) this.fill = Infinity;
    }
    this.paintPlaces();
    const shown = waterShown(c);
    this.spoutWet.setVisible(shown);
    this.spoutDry.setVisible(!shown);
    this.lever?.setTexture(c.last?.type === "open" ? "lever-open" : "lever-shut");
    this.feather.setVisible(!c.flags.includes("feather"));
    // The page floats up out of the fountain once the water reaches it, and the fountain glows.
    this.pageImg.setVisible(c.done);
    const want = c.done ? 1 : 0;
    this.pageRise = calm ? want : lerp(this.pageRise, want, 1 - Math.exp(-dt * 2.2));
    const fountain = c.basins.find((b) => b.kind === "fountain")!;
    const fAt = placeAt(fountain.cell, c.rows, c.cols, this.host.rtl);
    this.pageImg.setPosition(fAt.x, fAt.y - this.pageRise * 96 + (calm ? 0 : Math.sin(t * 2) * 3 * this.pageRise)).setAngle(calm ? 0 : Math.sin(t * 1.4) * 4);
    this.fountainGlow.setAlpha(this.pageRise * (calm ? 0.45 : 0.4 + Math.sin(t * 2.4) * 0.06));

    // The keeper of the water turns to the bird, and points when a piece is turned or he speaks.
    const g = this.sage;
    g.box.scaleX = 0.86 * (mv.x >= AHR_START.waterkeeper ? 1 : -1);
    g.point = Math.max(0, g.point - dt);
    const raise = speaking?.who === "voice" || g.point > 0;
    g.arm.setAngle(lerp(g.arm.angle, raise ? -62 + (calm ? 0 : Math.sin(t * 5) * 6) : calm ? 0 : Math.sin(t * 1.3) * 2, calm ? 1 : 1 - Math.exp(-dt * 8)));
    g.head.setAngle((speaking?.who === "voice" ? (calm ? 0 : Math.sin(t * 7) * 3) : calm ? 0 : Math.sin(t * 1.1) * 1.5) + (mv.y < 380 ? -6 : 0));
    g.head.y = -292 + (calm ? 0 : Math.sin(t * 1.5) * 1.2);
    this.blink(g, g.head, "waterkeeper-head", "waterkeeper-headBlink", dt);

    // The girl looks at the bird, and waves when speaking; she hops when answered.
    const a = this.kid;
    a.box.scaleX = 0.74 * (mv.x >= AHR_START.girl ? 1 : -1);
    a.arm.setAngle(speaking?.who === "kid" ? -40 + (calm ? 0 : Math.sin(t * 6) * 10) : calm ? 0 : Math.sin(t * 1.4) * 3);
    a.head.setAngle(speaking?.who === "kid" && !calm ? Math.sin(t * 8) * 3 : 0);
    a.hop = Math.max(0, a.hop - dt);
    a.box.y = AHR_WORLD.floor + 8 - (calm ? 0 : Math.sin((a.hop / 0.5) * Math.PI) * 10);
    this.blink(a, a.head, "girl-head", "girl-headBlink", dt);
  }
  // ------------------------------------------------------------------------------------------ leaving
  protected override releaseRoom(): void {
    this.places = [];
    this.lever = null;
    this.fill = Infinity;
    this.mark = null;
    this.pageRise = 0;
  }
}
