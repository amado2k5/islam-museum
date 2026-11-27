// The golden scene on screen: Ibn al-Haytham's workshop, the first room on the room engine (./room.ts). The engine
// carries what every room has (textures, layers, camera, the bird and the explorer, movement, touching, the door,
// measuring); this file adds what is the workshop's own: its painting, the scholar and the cat, the mirrors and the
// beam, the curtain and the dark room's picture, the page and the feather. What happens is decided elsewhere (sim/).
//
// Everything hangs from one container scaled to the device, and the scene moves its own layers for the camera and
// the parallax, so that the layout is in the game's 1280 by 720 pixels whatever the screen is.
import { cat as paintCat, portrait, scholar as paintScholar } from "../art/cast";
import { glow } from "../art/kit";
import * as props from "../art/props";
import { ARCH, GARDEN_X, INTERIOR_W, foreground, garden, interior, leaves, sky, town, wallPicture } from "../art/world";
import { ASSIST, DOOR, GRID, JAR, ROOM, START_AT, THINGS, WORLD, cellX, cellY, inPlay, solvedLean, type PlayStyle, type Speaker, type Thing } from "../content/workshop";
import type { Mood } from "../narrative/dialogue";
import type { Keeper, Quality } from "../save/save";
import type { Segment } from "../sim/light";
import type { Mover } from "../sim/move";
import { beam, type Happened, type SceneState } from "../sim/scene";
import { ADD, QUALITY, RoomScene, lerp, type Box, type Img, type RoomHost, type RoomLayout, type RoomThing } from "./room";

export interface SceneHost extends RoomHost {
  state(): SceneState;
  speaking(): { who: Speaker; mood: Mood } | null;
  look(): { quality: Quality; reducedMotion: boolean; style: PlayStyle; keeper: Keeper };
}

export { QUALITY };

// Where the dark room's picture falls: on the drawn curtain, which is the wall opposite the small hole in the shutter.
// (Until 26 November 2026 it was drawn on the back wall; an independent review named that as wrong.)
const WALL_PICTURE = { x: (ARCH.left + ARCH.right) / 2, y: 392 } as const;

/** The workshop as a room: its world, floor and perches, its door, and where the bird and the explorer begin. */
export const WORKSHOP_LAYOUT: RoomLayout = {
  world: WORLD,
  room: ROOM,
  door: DOOR,
  start: { hudhud: START_AT.hudhud.x, keeper: START_AT.keeper.x },
  assist: ASSIST,
  seed: "hudhud-golden-scene-cosmetics",
};

export class WorkshopScene extends RoomScene<SceneHost> {
  private sage!: { box: Box; arm: Img; head: Img; blink: number; point: number };
  private puss!: { box: Box; head: Img; tail: Img; hop: number };
  private mirrors = new Map<string, { img: Img; hint: Img; angle: number; flat: boolean }>();
  private strips: Img[] = [];
  private rainbows: Img[] = [];
  private endGlow!: Img;
  private pagePale!: Img;
  private pageInk!: Img;
  private pageGlow!: Img;
  private dark!: Img;
  private wallPic!: Img;
  private curtain!: Img;
  private spill!: Img;
  private featherImg!: Img;
  private motes: { img: Img; seg: number; u: number; off: number; speed: number }[] = [];
  private stars: Img[] = [];
  private leavesImg: Img | null = null;
  private darkness = 0;
  private inkT = 0;

  constructor() {
    super("workshop", WORKSHOP_LAYOUT);
  }

  protected things(): readonly RoomThing[] {
    return THINGS;
  }
  protected lit(): boolean {
    return this.host.state().done;
  }
  protected override touchable(t: RoomThing): boolean {
    const s = this.host.state();
    if (!inPlay(t as Thing, s.puzzle)) return false;
    return !(t.kind === "feather" && s.flags.includes("feather"));
  }
  protected override approach(t: RoomThing): number {
    return t.kind === "mirror" ? -44 : t.kind === "person" ? 110 : 0;
  }

  // ------------------------------------------------------------------------------------------ building
  protected build(look: { keeper: Keeper }): void {
    const ts = this.q.texture;
    const T = this.tex.bind(this);

    const skyP = this.wide("sky", () => sky(ts));
    this.putWide(this.root, "sky", 0, 0, 0);
    for (let i = 0; i < this.q.stars; i++) {
      const s = this.put(this.root, T("sparkle", () => props.sparkle(ts)), this.rng.range(20, 1260), this.rng.range(10, 250)).setBlendMode(ADD);
      s.setScale((this.rng.range(0.25, 0.6)) / ts).setAlpha(0.6);
      this.stars.push(s);
    }
    this.layers();
    this.wide("town-far", () => town(ts, false));
    this.putWide(this.far, "town-far", 0, WORLD.floor - 96, 1);
    const townP = this.wide("town-near", () => town(ts, true));
    this.putWide(this.mid, "town-near", 0, WORLD.floor - 60, 1);

    const m = this.main;
    this.wide("garden", () => garden(ts));
    this.putWide(m, "garden", GARDEN_X, 0, 0);
    T("glow", () => glow(256, ts));
    this.put(m, "glow", 1945, 498).setBlendMode(ADD).setScale(1.5 / ts).setAlpha(0.9);
    // The door at the garden's far end (the engine's door).
    this.buildDoor(m);
    this.curtain = this.put(m, T("curtain", () => props.curtain(ts)), ARCH.left - 300, ARCH.ledge, 0, 0);
    this.curtain.setScale(1 / ts, (WORLD.floor - ARCH.ledge + 8) / 500 / ts);
    this.wide("interior", () => interior(ts));
    this.putWide(m, "interior", 0, 0, 0);
    // Evening light spilling through the arch onto the floor, and the pinhole's small glare.
    this.spill = this.put(m, "glow", 1500, WORLD.floor + 30).setBlendMode(ADD);
    this.spill.setScale(3.4 / ts, 1 / ts).setAlpha(0.55).setTint(0xffc27a);
    this.wallPic = this.put(m, T("wall-picture", () => wallPicture(ts, skyP, townP)), WALL_PICTURE.x, WALL_PICTURE.y).setAlpha(0);
    this.dark = this.put(m, T("shade", () => props.shade(1)), 0, 0, 0, 0);
    this.dark.setScale(INTERIOR_W / 16, WORLD.height / 16).setAlpha(0);
    this.put(m, "glow", 62, 270).setBlendMode(ADD).setScale(0.4 / ts);
    this.put(m, T("cord", () => props.cord(ts)), 1560, ARCH.ledge + 12, 0.5, 0);

    // The puzzle's furniture.
    const puzzle = this.host.state().puzzle;
    const jarTop = cellY(JAR.row) - 52;
    this.put(m, T("jar", () => props.jar(ts, WORLD.floor - jarTop)), cellX(JAR.col), WORLD.floor, 0.5, 1);
    T("mirror", () => props.mirror(ts));
    for (const mir of puzzle.mirrors) {
      const x = cellX(mir.col);
      const y = cellY(mir.row);
      const perch = ROOM.perches.find((p) => x >= p.x && x <= p.x + p.w && p.y > y && p.y - y < 90);
      // A mirror by the ceiling with no shelf under it hangs from above; every other stands on a shelf or the floor.
      const hangs = !perch && mir.row === 0;
      const height = hangs ? y - 20 : (perch ? perch.y : WORLD.floor) - y + 4;
      const stand = this.put(m, T(`stand-${Math.round(height)}`, () => props.stand(ts, height)), x, hangs ? y + 4 : y - 4, 0.5, hangs ? 1 : 0);
      if (hangs) stand.setFlipY(true);
      const hint = this.put(m, "glow", x, y).setBlendMode(ADD).setScale(0.62 / ts).setTint(0x9fe8ff).setAlpha(0);
      const img = this.put(m, "mirror", x, y);
      const angle = mir.lean === "/" ? -45 : mir.lean === "-" ? 0 : 45;
      img.setAngle(angle);
      this.mirrors.set(mir.id, { img, hint, angle, flat: mir.lean === "-" });
    }
    for (const g of puzzle.prisms) this.put(m, T("prism", () => props.prism(ts)), cellX(g.col), cellY(g.row) - 46, 0.5, 0);
    const tx = cellX(puzzle.target.col);
    const ty = cellY(puzzle.target.row);
    this.pageGlow = this.put(m, "glow", tx, ty).setBlendMode(ADD).setScale(1.1 / ts).setAlpha(0);
    this.pagePale = this.put(m, T("page-pale", () => props.page(ts, false)), tx, ty + 12);
    this.pageInk = this.put(m, T("page-ink", () => props.page(ts, true)), tx, ty + 12).setAlpha(0);
    T("beam", () => props.beamStrip(ts));
    T("rainbow", () => props.rainbowStrip(ts));
    for (let i = 0; i < 10; i++) {
      this.strips.push(this.put(m, "beam", 0, 0, 0, 0.5).setBlendMode(ADD).setVisible(false));
      this.rainbows.push(this.put(m, "rainbow", 0, 0, 0, 0.5).setBlendMode(ADD).setVisible(false));
    }
    this.endGlow = this.put(m, "glow", 0, 0).setBlendMode(ADD).setScale(0.5 / ts);
    T("mote", () => props.mote(ts));
    for (let i = 0; i < this.q.motes; i++) this.motes.push({ img: this.put(m, "mote", 0, 0).setBlendMode(ADD), seg: 0, u: this.rng.next(), off: this.rng.range(-9, 9), speed: this.rng.range(0.03, 0.12) });
    const f = THINGS.find((t) => t.id === "feather")!;
    this.featherImg = this.put(m, T("feather", () => props.feather(ts)), f.x, f.y).setAngle(24);
    this.buildRing(m);

    this.buildCast(m, ts, look.keeper);
    this.buildSparks(m);

    this.put(this.front, T("foreground", () => foreground(ts)), -40, 0, 0, 0);
    if (this.q.shafts) {
      // On High, a soft shaft of evening light leans in through the arch.
      const shaft = this.put(m, "beam", 1700, 200, 0, 0.5).setBlendMode(ADD).setAngle(118).setAlpha(0.16).setTint(0xffc27a);
      shaft.setScale(620 / 64 / ts, 9 / ts);
    }
    this.leavesImg = this.put(this.front, T("leaves", () => leaves(ts)), 1560, WORLD.height + 16, 0.5, 1);
  }
  protected override ready(): void {
    this.show();
    this.drawBeam(true);
  }

  private buildCast(m: Box, ts: number, look: Keeper): void {
    const T = this.tex.bind(this);
    const urls: Record<string, string> = {};
    // Ibn al-Haytham, as the game imagines him.
    const sa = paintScholar(ts);
    for (const [k, p] of Object.entries(sa)) T(`sage-${k}`, () => p);
    const sageBox = this.layer(m).setPosition(START_AT.scholar.x, WORLD.floor).setScale(0.86);
    this.put(sageBox, "sage-body", 0, 2, 0.5, 1);
    const sArm = this.put(sageBox, "sage-arm", 62, -236, 0.5, 0.05);
    const sHead = this.put(sageBox, "sage-head", 4, -292, 0.5, 0.58);
    this.sage = { box: sageBox, arm: sArm, head: sHead, blink: 3, point: 0 };
    urls.scholar = portrait(1, { back: sa.body, head: sa.head }, "#f2b94b").canvas.toDataURL("image/png");

    const ca = paintCat(ts);
    for (const [k, p] of Object.entries(ca)) T(`cat-${k}`, () => p);
    const catBox = this.layer(m).setPosition(START_AT.cat.x, 562);
    const cTail = this.put(catBox, "cat-tail", -44, -14, 0.1, 0.5);
    this.put(catBox, "cat-body", 0, 0, 0.5, 1);
    const cHead = this.put(catBox, "cat-headSleep", 34, -40);
    this.puss = { box: catBox, head: cHead, tail: cTail, hop: 0 };
    urls.cat = portrait(1, { head: ca.head }, "#e3c08a").canvas.toDataURL("image/png");

    this.buildKeeper(m, look, urls);
    this.buildBird(m, urls);
    this.host.portraits(urls);
  }

  // ------------------------------------------------------------------------------------------ from the rules
  /** Things that happened in the rules, to be shown. */
  happened(list: Happened[]): void {
    for (const h of list) {
      if (h.type === "mirror") {
        this.drawBeam(false);
        this.sage.point = 1.2;
        this.burst(this.thing(h.id), 5);
      } else if (h.type === "restored") this.burst(this.thing("page"), 14);
      else if (h.type === "purr") this.puss.hop = 0.5;
      else if (h.type === "secret" || h.type === "feather") this.burst(h.type === "secret" ? WALL_PICTURE : this.thing("feather"), 12);
    }
    this.show();
  }
  /** Brings every picture in line with the state: leans, the page, the curtain, the feather, Story's hints. */
  private show(): void {
    const s = this.host.state();
    const style = this.host.look().style;
    for (const mir of s.puzzle.mirrors) {
      const v = this.mirrors.get(mir.id)!;
      v.angle = mir.lean === "/" ? -45 : mir.lean === "-" ? 0 : 45;
      v.flat = mir.lean === "-";
      const wrong = style === "story" && !s.restored && mir.lean !== solvedLean(mir.id);
      v.hint.setData("on", wrong);
    }
    this.featherImg.setVisible(!s.flags.includes("feather"));
  }
  private segmentEnds(seg: Segment): [number, number, number, number] {
    const clampX = (c: number) => Math.min(INTERIOR_W - 80, Math.max(62, cellX(c)));
    const clampY = (r: number) => Math.min(WORLD.floor - 6, Math.max(30, cellY(r)));
    const x0 = seg.from.col < 0 ? 62 : clampX(seg.from.col);
    return [x0, clampY(seg.from.row), clampX(seg.to.col), clampY(seg.to.row)];
  }
  private beamSegs: [number, number, number, number][] = [];
  private drawBeam(first: boolean): void {
    const tr = beam(this.host.state());
    const ts = this.q.texture;
    this.beamSegs = [];
    this.strips.forEach((s) => s.setVisible(false));
    this.rainbows.forEach((s) => s.setVisible(false));
    let wi = 0;
    let ri = 0;
    for (const seg of tr.segments) {
      const [x0, y0, x1, y1] = this.segmentEnds(seg);
      const len = Math.hypot(x1 - x0, y1 - y0);
      if (len < 1) continue;
      this.beamSegs.push([x0, y0, x1, y1]);
      const im = seg.spread ? this.rainbows[ri++] : this.strips[wi++];
      if (!im) continue;
      im.setVisible(true).setPosition(x0, y0).setRotation(Math.atan2(y1 - y0, x1 - x0));
      im.setScale(len / 64 / ts, (seg.spread ? 1.5 : 1) / ts);
    }
    const lastSeg = this.beamSegs[this.beamSegs.length - 1];
    if (lastSeg) this.endGlow.setPosition(lastSeg[2], lastSeg[3]);
    if (!first) for (const mo of this.motes) mo.seg = this.rng.int(0, Math.max(0, this.beamSegs.length - 1));
  }
  // ------------------------------------------------------------------------------------------ the player
  protected override tap(x: number, y: number): void {
    if (this.host.frozen()) return;
    const puzzle = this.host.state().puzzle;
    const hit = THINGS.filter((t) => t.kind === "mirror" && inPlay(t, puzzle)).find((t) => Math.hypot(t.x - x, t.y - y) < 64);
    if (hit) this.host.touch(hit.id);
  }

  protected override animateRoom(dt: number, mv: Mover, calm: boolean): void {
    const s = this.host.state();
    const t = this.t;
    const speaking = this.host.speaking();

    // The scholar turns to the bird, and points when a mirror turns or he speaks.
    const g = this.sage;
    g.box.scaleX = 0.86 * (mv.x >= START_AT.scholar.x ? 1 : -1);
    g.point = Math.max(0, g.point - dt);
    const lift = speaking?.who === "scholar" ? 1 : g.point > 0 ? 1 : 0;
    g.arm.setAngle(lerp(g.arm.angle, lift ? -62 + Math.sin(t * 5) * 6 : calm ? 0 : Math.sin(t * 1.3) * 2, 1 - Math.exp(-dt * 8)));
    g.head.setAngle((speaking?.who === "scholar" ? Math.sin(t * 7) * 3 : calm ? 0 : Math.sin(t * 1.1) * 1.5) + (mv.y < 380 ? -6 : 0));
    g.head.y = -292 + (calm ? 0 : Math.sin(t * 1.5) * 1.2);
    this.blink(g, g.head, "sage-head", "sage-headBlink", dt);

    // The cat sleeps until the bird comes near.
    const p = this.puss;
    const awake = Math.hypot(mv.x - START_AT.cat.x, mv.y - 560) < 230 || speaking?.who === "cat";
    p.head.setTexture(awake ? "cat-head" : "cat-headSleep");
    p.head.y = -40 + (awake ? -4 : calm ? 0 : Math.sin(t * 1.4) * 1.5);
    p.tail.setAngle(calm ? 0 : Math.sin(t * (awake ? 5 : 1.2)) * (awake ? 16 : 6));
    p.hop = Math.max(0, p.hop - dt);
    p.box.y = 562 - Math.sin((p.hop / 0.5) * Math.PI) * 14;

    // Mirrors swing to their lean; Story's hints breathe.
    for (const v of this.mirrors.values()) {
      v.img.setAngle(calm ? v.angle : lerp(v.img.angle, v.angle, 1 - Math.exp(-dt * 14)));
      // Laid flat, a mirror is out of the beam's way: it is drawn thinner and dimmer, so that it reads as put aside.
      v.img.setAlpha(v.flat ? 0.62 : 1);
      v.img.scaleY = (v.flat ? 0.55 : 1) / this.q.texture;
      v.hint.setAlpha(lerp(v.hint.alpha, v.hint.getData("on") ? 0.55 + (calm ? 0 : Math.sin(t * 4) * 0.2) : 0, 0.15));
    }
    // The beam shimmers a little; motes drift along it.
    const flicker = calm ? 1 : 0.92 + Math.sin(t * 9) * 0.04 + Math.sin(t * 23) * 0.03;
    for (const st of this.strips) st.setAlpha(0.95 * flicker);
    for (const st of this.rainbows) st.setAlpha(0.85 * flicker);
    this.endGlow.setAlpha(0.8 * flicker);
    for (const mo of this.motes) {
      const seg = this.beamSegs[mo.seg % Math.max(1, this.beamSegs.length)];
      if (!seg) {
        mo.img.setVisible(false);
        continue;
      }
      mo.u = (mo.u + dt * mo.speed) % 1;
      const nx = -(seg[3] - seg[1]);
      const ny = seg[2] - seg[0];
      const nl = Math.hypot(nx, ny) || 1;
      mo.img.setVisible(!calm).setPosition(lerp(seg[0], seg[2], mo.u) + (nx / nl) * mo.off, lerp(seg[1], seg[3], mo.u) + (ny / nl) * mo.off + Math.sin(t * 2 + mo.off) * 2);
      mo.img.setAlpha(0.35 + 0.3 * Math.sin(t * 3 + mo.off)).setScale(0.7 / this.q.texture);
    }
    for (let i = 0; i < this.stars.length; i++) this.stars[i]!.setAlpha(calm ? 0.6 : 0.45 + 0.4 * Math.sin(t * 1.3 + i * 1.7));

    // The page takes its ink; the room darkens when the curtain is drawn.
    this.inkT = lerp(this.inkT, s.restored ? 1 : 0, 1 - Math.exp(-dt * 2.2));
    this.pageInk.setAlpha(this.inkT);
    this.pagePale.setAlpha(1 - this.inkT);
    this.pageGlow.setAlpha(this.inkT * (0.55 + (calm ? 0 : Math.sin(t * 3) * 0.12)));
    this.darkness = lerp(this.darkness, s.dark ? 1 : 0, calm ? 1 : 1 - Math.exp(-dt * 3));
    this.dark.setAlpha(this.darkness * 0.6);
    this.curtain.x = lerp(ARCH.left - 300, ARCH.left - 20, this.darkness);
    this.wallPic.setAlpha(this.darkness * 0.95);
    this.spill.setAlpha(0.55 * (1 - this.darkness));
    this.featherImg.y = this.thing("feather").y + (calm ? 0 : Math.sin(t * 2.2) * 5);
    if (this.leavesImg && this.q.sway && !calm) this.leavesImg.setAngle(Math.sin(t * 0.9) * 1.6);
  }

  // ------------------------------------------------------------------------------------------ leaving
  protected override releaseRoom(): void {
    this.mirrors.clear();
    this.strips = [];
    this.rainbows = [];
    this.motes = [];
    this.stars = [];
  }
}

export { GRID };
