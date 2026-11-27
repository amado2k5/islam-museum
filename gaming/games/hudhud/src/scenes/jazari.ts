// Al-Jazari's workshop on screen: the second room on the room engine (./room.ts). The engine carries the bird, the
// explorer, the camera, touching and the door; this file adds the room's painting, al-Jazari and the apprentice, the
// clock's parts where the rules say they stand (or in Hudhud's beak), the places lit as a run passes through them,
// the ball, the lever, and the box on the high shelf. What happens is decided in sim/jazariroom.ts and sim/clock.ts.
import { apprentice as paintApprentice, JAZARI_LOOK, portrait, scholar as paintScholar } from "../art/cast";
import { ballArt, jazariRoom, lever as paintLever, leverBase, partArt } from "../art/jazari";
import { glow } from "../art/kit";
import * as props from "../art/props";
import { CLOCK_PARTS } from "../content/clock";
import { JR_APPROACH, JR_LAYOUT, JR_LEVER, JR_PLACES, JR_PLATFORM, JR_SPARES, JR_START, JR_THINGS, JR_WINDOW, JR_WORLD, type JrSpeaker } from "../content/jazari-room";
import type { Mood } from "../narrative/dialogue";
import type { Keeper, Quality } from "../save/save";
import { spare } from "../sim/chain";
import type { ClockStyle } from "../sim/clock";
import type { RoomHappened, RoomState } from "../sim/jazariroom";
import type { Mover } from "../sim/move";
import { ADD, RoomScene, lerp, type Box, type Img, type RoomHost, type RoomThing } from "./room";

/** What the room is showing, beyond the rules' state: how far a run has been shown, and whether the door is lit. */
export interface JazariView {
  state: RoomState;
  /** Places the motion has passed through so far in the run being shown (or the last one). */
  lit: number;
  /** The place where the last run stopped without doing its work, once it has been shown; or null. */
  stopped: number | null;
  /** A run is being shown, a place at a time. */
  running: boolean;
  /** The clock has told the half hour and the run has been shown: the door is lit. */
  done: boolean;
}
export interface JazariSceneHost extends RoomHost {
  view(): JazariView;
  speaking(): { who: JrSpeaker; mood: Mood } | null;
  look(): { quality: Quality; reducedMotion: boolean; style: ClockStyle; keeper: Keeper };
}

export class JazariScene extends RoomScene<JazariSceneHost> {
  private sage!: { box: Box; arm: Img; head: Img; blink: number; point: number };
  private girl!: { box: Box; head: Img; arm: Img; blink: number; hop: number };
  private parts = new Map<string, Img>();
  private carried!: Img;
  private placeGlow: Img[] = [];
  private ball!: Img;
  private leverImg!: Img;
  private page!: Img;
  private pageGlow!: Img;
  private feather!: Img;
  private shown = 0;

  constructor() {
    super("jazari", JR_LAYOUT);
  }

  protected things(): readonly RoomThing[] {
    return JR_THINGS;
  }
  protected lit(): boolean {
    return this.host.view().done;
  }
  protected override touchable(t: RoomThing): boolean {
    // A slot on the workbench with no spare part in it is only a slot.
    if (t.kind === "spare") return spare(this.host.view().state.clock.puzzle)[(t as (typeof JR_THINGS)[number]).index!] !== undefined;
    return true;
  }
  protected override approach(t: RoomThing): number {
    return JR_APPROACH[(t as (typeof JR_THINGS)[number]).kind];
  }
  protected override tap(x: number, y: number): void {
    // A press on the picture flies the bird to the thing pressed, and touches it.
    if (this.host.frozen()) return;
    const hit = JR_THINGS.filter((t) => this.touchable(t)).find((t) => Math.hypot(t.x - x, t.y - y) < 64);
    if (hit) this.goTo(hit.id);
  }

  // ------------------------------------------------------------------------------------------ building
  protected build(look: { keeper: Keeper }): void {
    const ts = this.q.texture;
    const T = this.tex.bind(this);
    this.layers();
    const m = this.main;
    this.wide("jazari-room", () => jazariRoom(ts));
    this.putWide(m, "jazari-room", 0, 0, 0);
    T("glow", () => glow(256, ts));
    // The window's evening light, and its warmth on the floor.
    this.put(m, "glow", JR_WINDOW.x + JR_WINDOW.w / 2, JR_WINDOW.y + JR_WINDOW.h * 0.6).setBlendMode(ADD).setScale(1.6 / ts).setAlpha(0.35).setTint(0xffc27a);
    this.put(m, "glow", 560, JR_WORLD.floor + 30).setBlendMode(ADD).setScale(3 / ts, 0.9 / ts).setAlpha(0.45).setTint(0xffc27a);
    this.buildDoor(m);

    // The places on the clock: a glow under each, lit as the run passes, red where it stopped.
    for (const pl of JR_PLACES) this.placeGlow.push(this.put(m, "glow", pl.x, pl.y).setBlendMode(ADD).setScale(0.75 / ts).setAlpha(0));
    // The lever on its block.
    this.put(m, T("lever-base", () => leverBase(ts)), JR_LEVER.x, JR_PLATFORM.y + 2, 0.5, 1);
    this.leverImg = this.put(m, T("lever", () => paintLever(ts)), JR_LEVER.x, JR_PLATFORM.y - 18, 0.5, 0.93).setAngle(-28);
    // The feather, peeping from the box on the high shelf until it is found.
    const box = JR_THINGS.find((t) => t.id === "box")!;
    this.feather = this.put(m, T("feather", () => props.feather(ts)), box.x - 6, box.y - 2).setAngle(-18).setScale(0.7 / ts);
    // Every part of the clock (a way of playing may use only some of them); the rules say where each stands.
    for (const part of CLOCK_PARTS) this.parts.set(part.id, this.put(m, T(`part-${part.id}`, () => partArt(ts, part.id)), 0, 0).setScale(0.82 / ts).setVisible(false));
    this.ball = this.put(m, T("ball", () => ballArt(ts)), 0, 0).setVisible(false);
    // The page of the Atlas, come loose above the last place once the clock works.
    const last = JR_PLACES[JR_PLACES.length - 1]!;
    this.pageGlow = this.put(m, "glow", last.x, last.y - 120).setBlendMode(ADD).setScale(0.9 / ts).setAlpha(0);
    this.page = this.put(m, T("page-ink", () => props.page(ts, true)), last.x, last.y - 120).setAlpha(0).setAngle(-7);
    this.buildRing(m);

    this.buildCast(m, ts, look.keeper);
    this.carried = this.put(m, `part-${CLOCK_PARTS[0]!.id}`, 0, 0).setScale(0.5 / ts).setVisible(false);
    this.buildSparks(m);
  }
  protected override ready(): void {
    this.placeParts(true);
  }

  private buildCast(m: Box, ts: number, look: Keeper): void {
    const T = this.tex.bind(this);
    const urls: Record<string, string> = {};
    // Al-Jazari, as the game imagines him: the scholar's cut-out in other colours, with an apron. Not a likeness.
    const ja = paintScholar(ts, JAZARI_LOOK);
    for (const [k, p] of Object.entries(ja)) T(`jazari-${k}`, () => p);
    const sageBox = this.layer(m).setPosition(JR_START.jazari, JR_WORLD.floor).setScale(0.86);
    this.put(sageBox, "jazari-body", 0, 2, 0.5, 1);
    const sArm = this.put(sageBox, "jazari-arm", 62, -236, 0.5, 0.05);
    const sHead = this.put(sageBox, "jazari-head", 4, -292, 0.5, 0.58);
    this.sage = { box: sageBox, arm: sArm, head: sHead, blink: 3, point: 0 };
    urls.jazari = portrait(1, { back: ja.body, head: ja.head }, "#f2b94b").canvas.toDataURL("image/png");

    // The apprentice, an invented person, by the workbench.
    const aa = paintApprentice(ts);
    for (const [k, p] of Object.entries(aa)) T(`app-${k}`, () => p);
    const aBox = this.layer(m).setPosition(JR_START.apprentice, JR_WORLD.floor + 8).setScale(0.74);
    this.put(aBox, "app-leg", -14, -68, 0.5, 0);
    this.put(aBox, "app-leg", 14, -68, 0.5, 0);
    this.put(aBox, "app-body", 0, -180, 0.5, 0);
    const aArm = this.put(aBox, "app-arm", 18, -170, 0.5, 0.06);
    const aHead = this.put(aBox, "app-head", 2, -212, 0.5, 0.54);
    this.girl = { box: aBox, head: aHead, arm: aArm, blink: 1.4, hop: 0 };
    urls.apprentice = portrait(1, { back: aa.body, head: aa.head }, "#c2643a").canvas.toDataURL("image/png");

    this.buildKeeper(m, look, urls);
    this.buildBird(m, urls);
    this.host.portraits(urls);
  }

  // ------------------------------------------------------------------------------------------ from the rules
  /** Things that happened in the rules, to be shown. */
  happened(list: RoomHappened[]): void {
    for (const h of list) {
      if (h.type === "put") (this.burst(JR_PLACES[h.place]!, 8), (this.sage.point = 1.2));
      else if (h.type === "pick") this.burst({ x: this.mover.x, y: this.mover.y - 50 }, 4);
      else if (h.type === "feather") this.burst(JR_THINGS.find((t) => t.id === "box")!, 12);
      else if (h.type === "talk" && h.script.startsWith("apprentice")) this.girl.hop = 0.5;
    }
  }
  /** A run has been shown a step further: a spark at the place the motion reached. */
  stepShown(place: number): void {
    const at = JR_PLACES[place];
    if (at) this.burst(at, 4);
  }

  /** Puts every part where the rules say it stands: in a place, on the workbench, or in Hudhud's beak. */
  private placeParts(at_once: boolean): void {
    const v = this.host.view();
    const p = v.state.clock.puzzle;
    const lying = spare(p).map((x) => x.id);
    const calm = this.host.look().reducedMotion;
    for (const [id, img] of this.parts) {
      const place = p.places.indexOf(id);
      const k = lying.indexOf(id);
      const inPlay = p.parts.some((x) => x.id === id);
      const carried = v.state.carrying === id;
      img.setVisible(inPlay && !carried && (place >= 0 || k >= 0));
      const to = place >= 0 ? JR_PLACES[place]! : k >= 0 ? JR_SPARES[k] : null;
      if (!to) continue;
      if (at_once || calm) img.setPosition(to.x, to.y);
      else img.setPosition(lerp(img.x, to.x, 0.25), lerp(img.y, to.y, 0.25));
    }
    if (v.state.carrying) this.carried.setTexture(`part-${v.state.carrying}`);
  }

  protected override animateRoom(dt: number, mv: Mover, calm: boolean): void {
    const v = this.host.view();
    const s = v.state;
    const t = this.t;
    const speaking = this.host.speaking();
    this.placeParts(false);

    // The part in Hudhud's beak.
    this.carried.setVisible(s.carrying !== null);
    if (s.carrying) {
      this.carried.setPosition(mv.x + mv.facing * 46, mv.y - 58 + (calm ? 0 : Math.sin(t * 6) * 2));
      this.carried.scaleX = (mv.facing * 0.5) / this.q.texture;
    }

    // The run: each place glows gold once the motion has passed it, the place where it stopped glows red.
    this.shown = v.lit;
    this.placeGlow.forEach((g, i) => {
      const passed = i < v.lit;
      const stopped = v.stopped === i;
      g.setTint(stopped ? 0xff6b5e : 0xffd27a);
      g.setAlpha(lerp(g.alpha, passed || stopped ? 0.7 + (calm ? 0 : Math.sin(t * 5 + i) * 0.12) : 0, calm ? 1 : 0.2));
    });
    // The ball, once the falcon has let it go, at the last place the motion reached on its road.
    const lastMoved = s.clock.last?.moved[Math.min(v.lit, s.clock.last.moved.length) - 1];
    const ballOn = lastMoved && ["falcon", "dragon", "vessel", "bowl"].includes(lastMoved.part);
    this.ball.setVisible(!!ballOn);
    if (ballOn) {
      const at = JR_PLACES[lastMoved.place]!;
      this.ball.setPosition(at.x + 30, at.y + (lastMoved.part === "bowl" ? 6 : -30));
    }
    // The lever leans over once it has been pulled, until a part is moved again; it stands ready otherwise.
    const want = v.running || s.clock.last !== null ? 28 : -28;
    this.leverImg.setAngle(calm ? want : lerp(this.leverImg.angle, want, 1 - Math.exp(-dt * 10)));
    // The page comes loose once the clock works; the feather is in the box until found.
    this.page.setAlpha(lerp(this.page.alpha, v.done ? 1 : 0, calm ? 1 : 0.08));
    this.page.y = JR_PLACES[4]!.y - 120 + (calm ? 0 : Math.sin(t * 2) * 4);
    this.pageGlow.setAlpha(this.page.alpha * 0.6);
    this.feather.setVisible(!s.clock.flags.includes("feather"));

    // Al-Jazari turns to the bird, and points when a part is put in place or he speaks.
    const g = this.sage;
    g.box.scaleX = 0.86 * (mv.x >= JR_START.jazari ? 1 : -1);
    g.point = Math.max(0, g.point - dt);
    const lift = speaking?.who === "jazari" ? 1 : g.point > 0 ? 1 : 0;
    g.arm.setAngle(lerp(g.arm.angle, lift ? -62 + Math.sin(t * 5) * 6 : calm ? 0 : Math.sin(t * 1.3) * 2, 1 - Math.exp(-dt * 8)));
    g.head.setAngle((speaking?.who === "jazari" ? Math.sin(t * 7) * 3 : calm ? 0 : Math.sin(t * 1.1) * 1.5) + (mv.y < 380 ? -6 : 0));
    g.head.y = -292 + (calm ? 0 : Math.sin(t * 1.5) * 1.2);
    this.blink(g, g.head, "jazari-head", "jazari-headBlink", dt);

    // The apprentice looks at the bird, and waves when she speaks.
    const a = this.girl;
    a.box.scaleX = 0.74 * (mv.x >= JR_START.apprentice ? 1 : -1);
    a.arm.setAngle(speaking?.who === "apprentice" ? -40 + Math.sin(t * 6) * 10 : calm ? 0 : Math.sin(t * 1.4) * 3);
    a.head.setAngle(speaking?.who === "apprentice" ? Math.sin(t * 8) * 3 : 0);
    a.hop = Math.max(0, a.hop - dt);
    a.box.y = JR_WORLD.floor + 8 - (calm ? 0 : Math.sin((a.hop / 0.5) * Math.PI) * 10);
    this.blink(a, a.head, "app-head", "app-headBlink", dt);
  }

  /** How many places of the run are lit on the picture now (for the browser checks). */
  litShown(): number {
    return this.shown;
  }

  // ------------------------------------------------------------------------------------------ leaving
  protected override releaseRoom(): void {
    this.parts.clear();
    this.placeGlow = [];
  }
}
