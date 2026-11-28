// The paper workshop of Samarkand on screen: the thirteenth and last room of the journey on the room engine (./room.ts).
// The engine carries the bird, the explorer, the camera, touching and the door; this file adds the workshop's painting,
// the papermaker and the child who helps, the cards of the steps standing in their slots on the long workbench (each the
// page quest's own drawing, chosen from the quest's own state each time it changes: plain, passed by the work, or where
// the work stopped; a lifted one raised with the page's ring round it and a shadow behind it), the material drawn above
// each place the work has passed in the state that place left it in (the page's own drawing), the bell at the end of the
// bench, and the spare mould on top of the tall rack with the feather caught in it. What happens is decided in
// sim/samarkandroom.ts and sim/paper.ts; how far a run is shown is the page's (ui/samarkand.ts). Nothing here writes text.
import { paperChild as paintChild, papermaker as paintMaker, portrait } from "../art/cast";
import { glow } from "../art/kit";
import * as props from "../art/props";
import { bellArt, cardArt, cardRing, cardShadow, materialArt, samarkandWorkshop, slotArt, spareMould, type CardMode } from "../art/samarkand-room";
import { PAPER_STATES } from "../content/paper";
import { SMR_APPROACH, SMR_BELL, SMR_BENCH, SMR_CARD, SMR_LAYOUT, SMR_MATERIAL_UP, SMR_MOULD, SMR_SLOT_H, SMR_START, SMR_WORLD, placeAt, smrThings, type SmrSpeaker, type SmrThing } from "../content/samarkand-room";
import type { Mood } from "../narrative/dialogue";
import type { Keeper, Quality } from "../save/save";
import type { PaperStyle } from "../sim/paper";
import type { Mover } from "../sim/move";
import type { SamarkandHappened, SamarkandState } from "../sim/samarkandroom";
import { ADD, RoomScene, lerp, type Box, type Img, type RoomHost, type RoomThing } from "./room";
import { HELPER, SCHOLAR } from "../content/people";
import type { Standing } from "../sim/follow";

/** What the workshop is showing, beyond the rules' state: how far the last run has been shown, where it stopped, whether it is being shown, and whether the door is lit. */
export interface SamarkandView {
  state: SamarkandState;
  /** Places the material has passed through so far. */
  lit: number;
  /** The place where the last run stopped, once it has been shown; or null. */
  stopped: number | null;
  /** A run is being shown a place at a time. */
  running: boolean;
  /** The sheet is made and the run shown: the door is lit. */
  done: boolean;
}
export interface SamarkandSceneHost extends RoomHost {
  view(): SamarkandView;
  /** The page reads right to left: the first place is on the right, as on the page. */
  rtl: boolean;
  speaking(): { who: SmrSpeaker; mood: Mood } | null;
  look(): { quality: Quality; reducedMotion: boolean; style: PaperStyle; keeper: Keeper };
}

/** How high a lifted card rises out of its slot, in game pixels: enough to show over the bird standing before it. */
const RAISE = 34;

export class SamarkandScene extends RoomScene<SamarkandSceneHost> {
  private sage!: { box: Box; arm: Img; head: Img; blink: number; point: number };
  private kid!: { box: Box; head: Img; arm: Img; blink: number; hop: number };
  /** One picture for each place on the bench; its texture is the card that stands there now, as the run has it. */
  private places: { img: Img; mat: Img; x: number; y: number; dx: number; lift: number }[] = [];
  private shadow!: Img;
  private liftRingImg!: Img;
  private lifting!: Box;
  private anchor!: Img;
  private bellImg!: Img;
  private benchGlow!: Img;
  private mouldImg!: Img;
  private feather!: Img;
  private drawn = "";
  private list: SmrThing[] = [];
  private n = 0;
  private style: PaperStyle = "explorer";

  constructor() {
    super("samarkand", SMR_LAYOUT);
  }

  protected things(): readonly RoomThing[] {
    return this.list;
  }
  protected lit(): boolean {
    return this.host.view().done;
  }
  /** Where the workshop's people stand: the explorer stops short of them (sim/follow.ts). */
  protected override people(): readonly Standing[] {
    return [{ x: SMR_START.maker, figure: SCHOLAR }, { x: SMR_START.child, figure: HELPER }];
  }
  protected override approach(t: RoomThing): number {
    return SMR_APPROACH[(t as SmrThing).kind];
  }
  protected override tap(x: number, y: number): void {
    // A press on the picture flies the bird to the thing pressed, and touches it.
    if (this.host.frozen()) return;
    const hit = this.list.find((t) => Math.hypot(t.x - x, t.y - y) < 48);
    if (hit) this.goTo(hit.id);
  }

  // ------------------------------------------------------------------------------------------ building
  private cardKey(id: string, mode: CardMode): string {
    return `card-${this.style}-${id}-${mode}`;
  }
  protected build(look: { keeper: Keeper }): void {
    const v = this.host.view();
    const s = v.state.paper;
    const rtl = this.host.rtl;
    this.style = s.style;
    this.n = s.puzzle.places.length;
    this.list = smrThings(s.style, rtl);
    const ts = this.q.texture;
    const T = this.tex.bind(this);
    const k = SMR_CARD.k;
    this.layers();
    const m = this.main;
    this.wide("samarkand-workshop", () => samarkandWorkshop(ts));
    this.putWide(m, "samarkand-workshop", 0, 0, 0);
    T("glow", () => glow(256, ts));
    // A soft light over the bench once the sheet is made.
    this.benchGlow = this.put(m, "glow", SMR_CARD.cx, SMR_CARD.y).setBlendMode(ADD).setScale(4.4 / ts, 1.6 / ts).setAlpha(0).setTint(0xfff1c4);
    this.buildDoor(m);

    // The cards: a texture for each card of this way of playing in each of its three looks, a slot and a picture for each place.
    for (const part of s.puzzle.parts) for (const mode of ["plain", "held", "stopped"] as const) T(this.cardKey(part.id, mode), () => cardArt(ts, part.id, this.n, mode));
    for (const st of PAPER_STATES) if (st !== "rags") T(`material-${st}`, () => materialArt(ts, st));
    T(`card-shadow-${this.n}`, () => cardShadow(ts, this.n));
    T(`card-ring-${this.n}`, () => cardRing(ts, this.n));
    const slotY = SMR_BENCH.top - SMR_SLOT_H;
    for (let p = 0; p < this.n; p++) {
      const at = placeAt(p, this.n, rtl);
      this.put(m, T(`slot-${this.n}-${p}`, () => slotArt(ts, this.n, p)), at.x, slotY, 0.5, 0);
    }
    this.places = s.puzzle.places.map((id, p) => {
      const at = placeAt(p, this.n, rtl);
      // The card stands in its slot, its foot in the slot's groove.
      const img = this.put(m, this.cardKey(id ?? s.puzzle.parts[0]!.id, "plain"), at.x, at.y).setScale(k / ts);
      const mat = this.put(m, "material-pieces", at.x, at.y - SMR_MATERIAL_UP).setScale(k / ts).setVisible(false);
      return { img, mat, x: at.x, y: at.y, dx: 0, lift: 0 };
    });
    // A marker after the cards: a card put down goes back in front of it.
    this.anchor = this.put(m, `card-ring-${this.n}`, 0, 0).setVisible(false);

    // The bell at the end of the bench, and the spare mould on top of the tall rack with the feather caught in it.
    this.bellImg = this.put(m, T("bell", () => bellArt(ts)), SMR_BELL.x, SMR_BENCH.top + 2, 0.5, 1);
    this.feather = this.put(m, T("feather", () => props.feather(ts)), SMR_MOULD.x + 36, SMR_MOULD.y + 18).setAngle(70).setScale(0.55 / ts);
    this.mouldImg = this.put(m, T("spare-mould", () => spareMould(ts)), SMR_MOULD.x, SMR_MOULD.y + 32, 0.5, 1);
    this.buildRing(m);

    this.buildCast(m, ts, look.keeper);
    // The lifted card is held up in front of everyone, the bird included, with its shadow and the page's ring: a layer of its own over the cast.
    this.lifting = this.layer(m);
    this.shadow = this.put(this.lifting, `card-shadow-${this.n}`, 0, 0).setVisible(false);
    this.liftRingImg = this.put(this.lifting, `card-ring-${this.n}`, 0, 0).setVisible(false);
    this.buildSparks(m);
  }
  protected override ready(): void {
    this.placeCards();
  }

  private buildCast(m: Box, ts: number, look: Keeper): void {
    const T = this.tex.bind(this);
    const urls: Record<string, string> = {};
    // The papermaker, an invented person: the scholar's cut-out in a craftsman's colours, with an apron. Not a likeness.
    const pm = paintMaker(ts);
    for (const [key, p] of Object.entries(pm)) T(`maker-${key}`, () => p);
    const sageBox = this.layer(m).setPosition(SMR_START.maker, SMR_WORLD.floor).setScale(0.86);
    this.put(sageBox, "maker-body", 0, 2, 0.5, 1);
    const sArm = this.put(sageBox, "maker-arm", 62, -236, 0.5, 0.05);
    const sHead = this.put(sageBox, "maker-head", 4, -292, 0.5, 0.58);
    this.sage = { box: sageBox, arm: sArm, head: sHead, blink: 3, point: 0 };
    urls.maker = portrait(1, { back: pm.body, head: pm.head }, "#3a4f86").canvas.toDataURL("image/png");

    // The child who helps, an invented person, by the far end under the drying sheets.
    const ca = paintChild(ts);
    for (const [key, p] of Object.entries(ca)) T(`child-${key}`, () => p);
    const cBox = this.layer(m).setPosition(SMR_START.child, SMR_WORLD.floor + 8).setScale(0.74);
    this.put(cBox, "child-leg", -14, -68, 0.5, 0);
    this.put(cBox, "child-leg", 14, -68, 0.5, 0);
    this.put(cBox, "child-body", 0, -180, 0.5, 0);
    const cArm = this.put(cBox, "child-arm", 18, -170, 0.5, 0.06);
    const cHead = this.put(cBox, "child-head", 2, -212, 0.5, 0.54);
    this.kid = { box: cBox, head: cHead, arm: cArm, blink: 1.4, hop: 0 };
    urls.child = portrait(1, { back: ca.body, head: ca.head }, "#3f8f5b").canvas.toDataURL("image/png");

    this.buildKeeper(m, look, urls);
    this.buildBird(m, urls);
    this.host.portraits(urls);
  }

  // ------------------------------------------------------------------------------------------ the bench
  /** The look of the card in place p, as the run shown so far has it (the page's own rule). */
  private modeOf(v: SamarkandView, p: number): CardMode {
    if (v.stopped === p) return "stopped";
    return p < v.lit ? "held" : "plain";
  }
  /** The state of the material place p left it in, if the run shown so far has passed it (the page's own `made`), or null. */
  private madeAt(v: SamarkandView, p: number): string | null {
    const s = v.state.paper;
    const m = s.last?.moved[p];
    if (!m || p >= v.lit) return null;
    return s.puzzle.parts.find((x) => x.id === m.part)?.gives ?? null;
  }
  /** Puts every card where the rules say it stands, in the look the run gives it, the material over the places passed, and raises the lifted one. */
  private placeCards(): void {
    const v = this.host.view();
    const s = v.state.paper;
    const key = JSON.stringify([s.puzzle.places, v.state.lifted, v.lit, v.stopped, v.done, s.last ? s.last.moved.length : -1]);
    if (key === this.drawn) return;
    this.drawn = key;
    s.puzzle.places.forEach((id, p) => {
      const pl = this.places[p]!;
      pl.img.setVisible(!!id).setTexture(this.cardKey(id ?? s.puzzle.parts[0]!.id, this.modeOf(v, p)));
      const made = this.madeAt(v, p);
      pl.mat.setVisible(made !== null && made !== "rags");
      if (made && made !== "rags") pl.mat.setTexture(`material-${made}`);
    });
    // The lifted card is held up over the bird and the other figures, its shadow just under it and the page's ring just
    // over it; put down, it goes back among the other cards.
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
  /** What the bench shows now, for the browser checks: the card in each place, its look, which place is raised, the states of the material shown over the places, the feather, and whether that is what the rules and the run shown say. */
  shown(): { places: string[]; modes: string[]; lifted: number | null; material: (string | null)[]; feather: boolean; agree: boolean } {
    const v = this.host.view();
    const s = v.state.paper;
    const keys = this.places.map((p) => String(p.img.texture.key).replace(`card-${this.style}-`, ""));
    const modes = keys.map((k) => k.slice(k.lastIndexOf("-") + 1));
    const places = keys.map((k) => k.slice(0, k.lastIndexOf("-")));
    const raised = this.places.findIndex((p) => p.lift > 0.5);
    const lifted = this.liftRingImg.visible && raised >= 0 ? raised : null;
    const material = this.places.map((p) => (p.mat.visible ? String(p.mat.texture.key).replace("material-", "") : null));
    const want = this.places.map((_, p) => {
      const made = this.madeAt(v, p);
      return made && made !== "rags" ? made : null;
    });
    const agree = places.join() === s.puzzle.places.join() && lifted === v.state.lifted && modes.every((m, p) => m === this.modeOf(v, p)) && material.join() === want.join();
    return { places, modes, lifted, material, feather: this.feather.visible, agree };
  }

  // ------------------------------------------------------------------------------------------ from the rules
  /** Things that happened in the rules, to be shown. */
  happened(list: SamarkandHappened[]): void {
    const calm = this.host.look().reducedMotion;
    for (const h of list) {
      if (h.type === "exchange") {
        this.placeCards();
        // Each of the two cards slides from where it stood into its new place.
        const a = this.places[h.a]!;
        const b = this.places[h.b]!;
        if (!calm) (a.dx = b.x - a.x), (b.dx = a.x - b.x);
        this.burst({ x: a.x, y: a.y }, 4);
        this.burst({ x: b.x, y: b.y }, 4);
        this.sage.point = 1.2;
      } else if (h.type === "ring") this.burst({ x: SMR_BELL.x, y: SMR_BELL.y - 20 }, 6);
      else if (h.type === "feather") this.burst({ x: SMR_MOULD.x + 36, y: SMR_MOULD.y + 16 }, 10);
      else if (h.type === "talk" && h.script.startsWith("child")) this.kid.hop = 0.5;
    }
  }
  /** One more place of a run has been shown: a small burst where the material now lies over it. */
  stepShown(place: number): void {
    const pl = this.places[place];
    if (pl) this.burst({ x: pl.x, y: pl.y - SMR_MATERIAL_UP }, 3);
  }
  /** The sheet is made and shown. */
  made(): void {
    this.burst({ x: SMR_CARD.cx, y: SMR_CARD.y }, 14);
  }

  protected override animateRoom(dt: number, mv: Mover, calm: boolean): void {
    const v = this.host.view();
    const s = v.state;
    const t = this.t;
    const speaking = this.host.speaking();
    this.placeCards();
    const ts = this.q.texture;
    const k = SMR_CARD.k;

    // The cards: a lifted one rises and casts a shadow; exchanged ones slide home. The material rides above its place.
    const ease = calm ? 1 : 1 - Math.exp(-dt * 12);
    this.places.forEach((pl, p) => {
      const up = s.lifted === p ? 1 : 0;
      pl.lift = calm ? up : lerp(pl.lift, up, ease);
      pl.dx = calm ? 0 : lerp(pl.dx, 0, 1 - Math.exp(-dt * 10));
      if (Math.abs(pl.dx) < 0.5) pl.dx = 0;
      pl.img.setPosition(pl.x + pl.dx, pl.y - pl.lift * RAISE).setScale(((1 + pl.lift * 0.06) * k) / ts);
      pl.mat.setPosition(pl.x, pl.y - SMR_MATERIAL_UP + (calm ? 0 : Math.sin(t * 2 + p) * 1.5));
    });
    const lifted = s.lifted !== null ? this.places[s.lifted] : undefined;
    this.shadow.setVisible(!!lifted);
    this.liftRingImg.setVisible(!!lifted);
    if (lifted) {
      this.shadow.setPosition(lifted.x + 6, lifted.y + 4).setScale(k / ts).setAlpha(lifted.lift);
      this.liftRingImg.setPosition(lifted.img.x, lifted.img.y).setScale(((1 + lifted.lift * 0.06) * k) / ts);
    }

    this.benchGlow.setAlpha(lerp(this.benchGlow.alpha, v.done ? 0.2 : 0, calm ? 1 : 0.06));
    this.feather.setVisible(!s.paper.flags.includes("feather"));
    this.mouldImg.setAngle(calm ? 0 : Math.sin(t * 1.7) * 0.6);
    // The bell swings while a sheet is being made.
    this.bellImg.setAngle(v.running && !calm ? Math.sin(t * 12) * 1.2 : 0);

    // The papermaker turns to the bird, and points when two cards are exchanged or he speaks.
    const g = this.sage;
    g.box.scaleX = 0.86 * (mv.x >= SMR_START.maker ? 1 : -1);
    g.point = Math.max(0, g.point - dt);
    const raise = speaking?.who === "maker" || g.point > 0;
    g.arm.setAngle(lerp(g.arm.angle, raise ? -62 + (calm ? 0 : Math.sin(t * 5) * 6) : calm ? 0 : Math.sin(t * 1.3) * 2, calm ? 1 : 1 - Math.exp(-dt * 8)));
    g.head.setAngle((speaking?.who === "maker" ? (calm ? 0 : Math.sin(t * 7) * 3) : calm ? 0 : Math.sin(t * 1.1) * 1.5) + (mv.y < 380 ? -6 : 0));
    g.head.y = -292 + (calm ? 0 : Math.sin(t * 1.5) * 1.2);
    this.blink(g, g.head, "maker-head", "maker-headBlink", dt);

    // The child looks at the bird, and waves when speaking.
    const a = this.kid;
    a.box.scaleX = 0.74 * (mv.x >= SMR_START.child ? 1 : -1);
    a.arm.setAngle(speaking?.who === "child" ? -40 + (calm ? 0 : Math.sin(t * 6) * 10) : calm ? 0 : Math.sin(t * 1.4) * 3);
    a.head.setAngle(speaking?.who === "child" && !calm ? Math.sin(t * 8) * 3 : 0);
    a.hop = Math.max(0, a.hop - dt);
    a.box.y = SMR_WORLD.floor + 8 - (calm ? 0 : Math.sin((a.hop / 0.5) * Math.PI) * 10);
    this.blink(a, a.head, "child-head", "child-headBlink", dt);
  }
  // ------------------------------------------------------------------------------------------ leaving
  protected override releaseRoom(): void {
    this.places = [];
    this.drawn = "";
  }
}

