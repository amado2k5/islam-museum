// The golden scene on screen. Phaser gives the canvas, the WebGL renderer, the scene's life (create, update,
// shutdown), tweens and pointer input; what happens is decided elsewhere (sim/), and this file only draws it.
//
// Everything hangs from one container scaled to the device, and the scene moves its own layers for the camera and
// the parallax, so that the layout is in the game's 1280 by 720 pixels whatever the screen is.
import * as Phaser from "phaser";
import { FrameRecorder } from "@im/kernel/framestats";
import { Rng } from "@im/kernel/prng";
import { cat as paintCat, hudhud as paintHudhud, keeper as paintKeeper, portrait, scholar as paintScholar } from "../art/cast";
import { bytesOf, glow, type Painted } from "../art/kit";
import * as props from "../art/props";
import { ARCH, GARDEN_X, INTERIOR_W, foreground, garden, interior, leaves, sky, town, wallPicture } from "../art/world";
import type { Cue } from "../audio/cues";
import { ASSIST, GRID, ROOM, START_AT, THINGS, WORLD, cellX, cellY, solvedLean, type PlayStyle, type Speaker, type Thing } from "../content/workshop";
import type { Mood } from "../narrative/dialogue";
import type { Keeper, Quality } from "../save/save";
import type { Segment } from "../sim/light";
import { advance, newMover, type Intent, type Mover } from "../sim/move";
import { beam, type Happened, type SceneState } from "../sim/scene";

export interface SceneHost {
  state(): SceneState;
  intent(): Intent;
  /** A talk, a pause or the results are up: the world waits. */
  frozen(): boolean;
  touch(id: string): void;
  /** The thing the bird is near enough to touch changed. */
  near(id: string | null): void;
  sound(c: Cue): void;
  speaking(): { who: Speaker; mood: Mood } | null;
  look(): { quality: Quality; reducedMotion: boolean; style: PlayStyle; keeper: Keeper };
  /** Faces for the words: data URLs of the portraits, made from the same parts as the figures. */
  portraits(urls: Record<string, string>): void;
}

export const QUALITY: Record<Quality, { texture: number; pixelRatio: number; motes: number; stars: number; shafts: boolean; sway: boolean }> = {
  low: { texture: 1, pixelRatio: 1, motes: 0, stars: 0, shafts: false, sway: false },
  medium: { texture: 1.5, pixelRatio: 1.5, motes: 26, stars: 14, shafts: false, sway: true },
  high: { texture: 2, pixelRatio: 2, motes: 60, stars: 30, shafts: true, sway: true },
};

type Img = Phaser.GameObjects.Image;
type Box = Phaser.GameObjects.Container;
const ADD = Phaser.BlendModes.ADD;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export class WorkshopScene extends Phaser.Scene {
  private host!: SceneHost;
  private q = QUALITY.medium;
  private rs = 1;
  private root!: Box;
  private far!: Box;
  private mid!: Box;
  private main!: Box;
  private front!: Box;
  private pictures = new Map<string, Painted>();
  private mover!: Mover;
  private carry = 0;
  private camX = 0;
  private t = 0;
  private readonly rng = new Rng("hudhud-golden-scene-cosmetics");
  private readonly frames = new FrameRecorder(40000);
  private nearId: string | null = null;
  private pilot: { id: string; from: { x: number; y: number }; to: { x: number; y: number }; t: number } | null = null;
  private last = { hops: 0, flaps: 0, landings: 0 };

  private bird!: { box: Box; inner: Box; tail: Img; body: Img; wing: Img; wingOpen: Img; head: Img; crest: Img; legs: Img; crestOpen: number; blink: number; squash: number };
  private child!: { box: Box; legA: Img; legB: Img; body: Img; arm: Img; head: Img; x: number; blink: number; walk: number };
  private sage!: { box: Box; arm: Img; head: Img; blink: number; point: number };
  private puss!: { box: Box; head: Img; tail: Img; hop: number };
  private mirrors = new Map<string, { img: Img; hint: Img; angle: number }>();
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
  private ring!: Img;
  private featherImg!: Img;
  private motes: { img: Img; seg: number; u: number; off: number; speed: number }[] = [];
  private stars: Img[] = [];
  private sparks: Img[] = [];
  private leavesImg: Img | null = null;
  private darkness = 0;
  private inkT = 0;

  constructor() {
    super("workshop");
  }
  init(data: { host: SceneHost }): void {
    this.host = data.host;
  }

  // ------------------------------------------------------------------------------------------ building
  private tex(key: string, make: () => Painted): string {
    if (!this.pictures.has(key)) {
      const p = make();
      this.pictures.set(key, p);
      this.textures.addCanvas(key, p.canvas);
    }
    return key;
  }
  private put(parent: Box, key: string, x: number, y: number, ox = 0.5, oy = 0.5): Img {
    const im = this.add.image(x, y, key).setOrigin(ox, oy).setScale(1 / this.q.texture);
    parent.add(im);
    return im;
  }
  private layer(parent?: Box): Box {
    const c = this.add.container(0, 0);
    parent?.add(c);
    return c;
  }

  create(): void {
    const look = this.host.look();
    this.q = QUALITY[look.quality];
    const ts = this.q.texture;
    this.rs = this.scale.width / WORLD.view.width;
    this.root = this.layer().setScale(this.rs);
    const T = this.tex.bind(this);

    const skyP = (T("sky", () => sky(ts)), this.pictures.get("sky")!);
    this.put(this.root, "sky", 0, 0, 0, 0);
    for (let i = 0; i < this.q.stars; i++) {
      const s = this.put(this.root, T("sparkle", () => props.sparkle(ts)), this.rng.range(20, 1260), this.rng.range(10, 250)).setBlendMode(ADD);
      s.setScale((this.rng.range(0.25, 0.6)) / ts).setAlpha(0.6);
      this.stars.push(s);
    }
    this.far = this.layer(this.root);
    this.put(this.far, T("town-far", () => town(ts, false)), 0, WORLD.floor - 96, 0, 1);
    this.mid = this.layer(this.root);
    const townP = (T("town-near", () => town(ts, true)), this.pictures.get("town-near")!);
    this.put(this.mid, "town-near", 0, WORLD.floor - 60, 0, 1);

    this.main = this.layer(this.root);
    const m = this.main;
    this.put(m, T("garden", () => garden(ts)), GARDEN_X, 0, 0, 0);
    T("glow", () => glow(256, ts));
    this.put(m, "glow", 1945, 498).setBlendMode(ADD).setScale(1.5 / ts).setAlpha(0.9);
    this.curtain = this.put(m, T("curtain", () => props.curtain(ts)), ARCH.left - 300, ARCH.ledge, 0, 0);
    this.curtain.setScale(1 / ts, (WORLD.floor - ARCH.ledge + 8) / 500 / ts);
    this.put(m, T("interior", () => interior(ts)), 0, 0, 0, 0);
    // Evening light spilling through the arch onto the floor, and the pinhole's small glare.
    this.spill = this.put(m, "glow", 1500, WORLD.floor + 30).setBlendMode(ADD);
    this.spill.setScale(3.4 / ts, 1 / ts).setAlpha(0.55).setTint(0xffc27a);
    this.wallPic = this.put(m, T("wall-picture", () => wallPicture(ts, skyP, townP)), 1085, 400).setAlpha(0);
    this.dark = this.put(m, T("shade", () => props.shade(1)), 0, 0, 0, 0);
    this.dark.setScale(INTERIOR_W / 16, WORLD.height / 16).setAlpha(0);
    this.put(m, "glow", 62, 270).setBlendMode(ADD).setScale(0.4 / ts);
    this.put(m, T("cord", () => props.cord(ts)), 1560, ARCH.ledge + 12, 0.5, 0);

    // The puzzle's furniture.
    const puzzle = this.host.state().puzzle;
    T("mirror", () => props.mirror(ts));
    for (const mir of puzzle.mirrors) {
      const x = cellX(mir.col);
      const y = cellY(mir.row);
      const perch = ROOM.perches.find((p) => x >= p.x && x <= p.x + p.w && p.y > y && p.y - y < 90);
      const height = (perch ? perch.y : WORLD.floor) - y + 4;
      this.put(m, T(`stand-${Math.round(height)}`, () => props.stand(ts, height)), x, y - 4, 0.5, 0);
      const hint = this.put(m, "glow", x, y).setBlendMode(ADD).setScale(0.62 / ts).setTint(0x9fe8ff).setAlpha(0);
      const img = this.put(m, "mirror", x, y);
      const angle = mir.lean === "/" ? -45 : 45;
      img.setAngle(angle);
      this.mirrors.set(mir.id, { img, hint, angle });
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
    this.ring = this.put(m, "glow", 0, 0).setBlendMode(ADD).setScale(0.7 / ts).setTint(0xfff0b0).setAlpha(0);

    this.buildCast(m, ts, look.keeper);
    for (let i = 0; i < 14; i++) this.sparks.push(this.put(m, "sparkle", 0, 0).setBlendMode(ADD).setVisible(false));

    this.front = this.layer(this.root);
    this.put(this.front, T("foreground", () => foreground(ts)), -40, 0, 0, 0);
    if (this.q.shafts) {
      // On High, a soft shaft of evening light leans in through the arch.
      const shaft = this.put(m, "beam", 1700, 200, 0, 0.5).setBlendMode(ADD).setAngle(118).setAlpha(0.16).setTint(0xffc27a);
      shaft.setScale(620 / 64 / ts, 9 / ts);
    }
    this.leavesImg = this.put(this.front, T("leaves", () => leaves(ts)), 1560, WORLD.height + 16, 0.5, 1);

    this.mover = newMover(START_AT.hudhud.x, WORLD.floor);
    this.child.x = START_AT.keeper.x;
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => this.tap(p.x / this.rs + this.camX, p.y / this.rs));
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.release());
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

    const ka = paintKeeper(ts, look);
    for (const [k, p] of Object.entries(ka)) T(`keeper-${k}`, () => p);
    const kBox = this.layer(m).setPosition(START_AT.keeper.x, WORLD.floor).setScale(0.8);
    const legA = this.put(kBox, "keeper-leg", -14, -68, 0.5, 0);
    const legB = this.put(kBox, "keeper-leg", 14, -68, 0.5, 0);
    this.put(kBox, "keeper-satchel", -30, -118);
    const kBody = this.put(kBox, "keeper-body", 0, -180, 0.5, 0);
    const kArm = this.put(kBox, "keeper-arm", 18, -170, 0.5, 0.06);
    const kHead = this.put(kBox, "keeper-head", 2, -212, 0.5, 0.54);
    this.child = { box: kBox, legA, legB, body: kBody, arm: kArm, head: kHead, x: START_AT.keeper.x, blink: 2, walk: 0 };
    urls.keeper = portrait(1, { back: ka.body, head: ka.head }, "#3fa39b").canvas.toDataURL("image/png");

    const ha = paintHudhud(ts);
    for (const [k, p] of Object.entries(ha)) T(`bird-${k}`, () => p);
    const box = this.layer(m).setScale(1.2);
    const inner = this.layer(box);
    const legs = this.put(inner, "bird-legs", 2, 2, 0.5, 1);
    const tail = this.put(inner, "bird-tail", -24, -36, 1, 0.5).setAngle(-8);
    const body = this.put(inner, "bird-body", 0, -40);
    const wing = this.put(inner, "bird-wing", -6, -42);
    const wingOpen = this.put(inner, "bird-wingOpen", -8, -46, 0.42, 0.98).setVisible(false);
    const crest = this.put(inner, "bird-crest", 18, -80, 0.5, 0.96);
    const head = this.put(inner, "bird-head", 22, -68, 24 / 92, 26 / 50);
    this.bird = { box, inner, tail, body, wing, wingOpen, head, crest, legs, crestOpen: 1, blink: 2.4, squash: 0 };
    urls.hudhud = portrait(1, { head: ha.head, extra: ha.crest }, "#f08a24").canvas.toDataURL("image/png");
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
      else if (h.type === "secret" || h.type === "feather") this.burst(h.type === "secret" ? { x: 1085, y: 400 } : this.thing("feather"), 12);
    }
    this.show();
  }
  private thing(id: string): Thing {
    return THINGS.find((t) => t.id === id)!;
  }
  /** Brings every picture in line with the state: leans, the page, the curtain, the feather, Story's hints. */
  private show(): void {
    const s = this.host.state();
    const style = this.host.look().style;
    for (const mir of s.puzzle.mirrors) {
      const v = this.mirrors.get(mir.id)!;
      v.angle = mir.lean === "/" ? -45 : 45;
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
  private burst(at: { x: number; y: number }, n: number): void {
    if (this.host.look().reducedMotion) n = Math.min(n, 3);
    for (let i = 0; i < n; i++) {
      const s = this.sparks.find((k) => !k.visible);
      if (!s) return;
      const a = this.rng.range(0, Math.PI * 2);
      const d = this.rng.range(30, 90);
      s.setVisible(true).setPosition(at.x, at.y).setAlpha(1).setScale(this.rng.range(0.5, 1) / this.q.texture);
      this.tweens.add({ targets: s, x: at.x + Math.cos(a) * d, y: at.y + Math.sin(a) * d - 20, alpha: 0, angle: 120, duration: 700, ease: "Cubic.easeOut", onComplete: () => s.setVisible(false) });
    }
  }

  // ------------------------------------------------------------------------------------------ the player
  private tap(x: number, y: number): void {
    if (this.host.frozen()) return;
    const hit = THINGS.filter((t) => t.kind === "mirror").find((t) => Math.hypot(t.x - x, t.y - y) < 64);
    if (hit) this.host.touch(hit.id);
  }
  /** Carries the bird to a thing and touches it: what the list under the picture and a screen reader's user do. */
  goTo(id: string): void {
    const t = THINGS.find((k) => k.id === id);
    if (!t || this.host.frozen()) return;
    const perch = ROOM.perches.filter((p) => t.x >= p.x - 20 && t.x <= p.x + p.w + 20 && p.y >= t.y - 10).sort((a, b) => a.y - b.y)[0];
    const to = { x: t.x + (t.kind === "mirror" ? -44 : t.kind === "person" ? 110 : 0), y: perch ? perch.y : WORLD.floor };
    if (t.kind === "mirror" && !perch) to.y = WORLD.floor;
    if (this.host.look().reducedMotion) {
      this.mover = { ...newMover(to.x, to.y), facing: t.x >= to.x ? 1 : -1 };
      this.host.touch(id);
      return;
    }
    this.pilot = { id, from: { x: this.mover.x, y: this.mover.y }, to, t: 0 };
  }
  /** The touch button or key: touch whatever is near. */
  touchNear(): void {
    if (this.nearId && !this.host.frozen()) this.host.touch(this.nearId);
  }
  where(): { x: number; y: number; grounded: boolean; near: string | null } {
    return { x: this.mover.x, y: this.mover.y, grounded: this.mover.grounded, near: this.nearId };
  }

  override update(_time: number, deltaMs: number): void {
    const dt = Math.min(deltaMs, 100) / 1000;
    this.frames.tick(performance.now());
    this.t += dt;
    const s = this.host.state();
    const look = this.host.look();
    const frozen = this.host.frozen();
    const calm = look.reducedMotion;

    if (this.pilot) {
      const p = this.pilot;
      p.t = Math.min(1, p.t + dt / 0.7);
      const e = p.t * p.t * (3 - 2 * p.t);
      const arc = Math.sin(Math.PI * e) * Math.min(120, Math.abs(p.to.x - p.from.x) * 0.3 + 40);
      this.mover = { ...this.mover, x: lerp(p.from.x, p.to.x, e), y: lerp(p.from.y, p.to.y, e) - arc, vx: 0, vy: p.t < 1 ? -1 : 0, grounded: p.t >= 1, facing: p.to.x >= p.from.x ? 1 : -1, gliding: p.t < 1 };
      if (p.t >= 1) {
        this.pilot = null;
        this.mover = { ...newMover(p.to.x, p.to.y), facing: this.thing(p.id).x >= p.to.x ? 1 : -1 };
        this.host.touch(p.id);
      }
    } else {
      const input: Intent = frozen ? { dir: 0, jump: false, down: false } : this.host.intent();
      const r = advance(this.mover, ROOM, input, dt, this.carry, ASSIST[look.style]);
      this.mover = r.mover;
      this.carry = r.carry;
    }
    const mv = this.mover;
    if (mv.hops !== this.last.hops) (this.host.sound("hop"), (this.bird.squash = 0.16));
    if (mv.flapsMade !== this.last.flaps) this.host.sound("flap");
    if (mv.landings !== this.last.landings) (this.host.sound("land"), (this.bird.squash = -0.18));
    this.last = { hops: mv.hops, flaps: mv.flapsMade, landings: mv.landings };

    // What can be touched from here.
    let near: string | null = null;
    let best = Infinity;
    if (!frozen && !this.pilot) {
      for (const t of THINGS) {
        if (t.kind === "feather" && s.flags.includes("feather")) continue;
        const d = Math.hypot(t.x - mv.x, t.y - (mv.y - 30));
        if (d < t.reach && d < best) (best = d), (near = t.id);
      }
    }
    if (near !== this.nearId) {
      this.nearId = near;
      this.host.near(near);
    }
    const nt = near ? this.thing(near) : null;
    this.ring.setAlpha(lerp(this.ring.alpha, nt ? 0.55 + (calm ? 0 : Math.sin(this.t * 5) * 0.15) : 0, 0.2));
    if (nt) this.ring.setPosition(nt.x, nt.y);

    // The camera follows the bird; the far layers move less, the front one more.
    const want = Math.min(WORLD.width - WORLD.view.width, Math.max(0, mv.x - WORLD.view.width / 2));
    this.camX = calm ? want : lerp(this.camX, want, 1 - Math.exp(-dt * 6));
    this.main.x = -this.camX;
    this.far.x = -this.camX * 0.12 - 60;
    this.mid.x = -this.camX * 0.3 - 80;
    this.front.x = -this.camX * (calm ? 1 : 1.22);

    this.animate(dt, s, mv, calm);
  }

  private animate(dt: number, s: SceneState, mv: Mover, calm: boolean): void {
    const t = this.t;
    const speaking = this.host.speaking();
    const blink = (o: { blink: number }, img: Img, open: string, shut: string) => {
      o.blink -= dt;
      if (o.blink < -0.12) o.blink = this.rng.range(2.2, 5);
      img.setTexture(o.blink < 0 ? shut : open);
    };

    // Hudhud.
    const b = this.bird;
    b.box.setPosition(mv.x, mv.y);
    b.box.scaleX = 1.2 * mv.facing;
    const air = !mv.grounded;
    const running = mv.grounded && Math.abs(mv.vx) > 30;
    b.squash = lerp(b.squash, 0, 1 - Math.exp(-dt * 10));
    b.inner.setScale(1 - b.squash * 0.6, 1 + b.squash);
    b.inner.y = running ? -Math.abs(Math.sin(t * 16)) * 5 : calm ? 0 : Math.sin(t * 2.4) * 1.2;
    b.wing.setVisible(!air);
    b.wingOpen.setVisible(air);
    b.legs.setVisible(!air);
    if (air) b.wingOpen.scaleY = (mv.gliding ? 0.9 + Math.sin(t * 6) * 0.06 : Math.sin(t * 24) * 0.6 + 0.4) / this.q.texture;
    const alarm = speaking?.who === "hudhud" && speaking.mood === "alarm";
    b.crestOpen = lerp(b.crestOpen, air || alarm || b.squash < -0.02 ? 1 : 0.35, 1 - Math.exp(-dt * 9));
    b.crest.scaleX = (0.5 + 0.5 * b.crestOpen) / this.q.texture;
    b.crest.setAngle(-34 * (1 - b.crestOpen) - 8 + (calm ? 0 : Math.sin(t * 3) * 2));
    b.tail.setAngle(-8 + (running ? Math.sin(t * 16) * 8 : air ? 14 : Math.sin(t * 2) * 3));
    b.head.setAngle(speaking?.who === "hudhud" ? Math.sin(t * 9) * 5 : running ? Math.sin(t * 16) * 4 : 0);
    blink(b, b.head, "bird-head", "bird-headBlink");

    // The Storykeeper walks after the bird along the floor and looks up at it.
    const c = this.child;
    const goal = Math.min(WORLD.width - 90, Math.max(80, mv.x - 96 * mv.facing));
    const gap = goal - c.x;
    const walking = Math.abs(gap) > 50 && !this.host.frozen();
    if (walking) c.x += Math.sign(gap) * Math.min(Math.abs(gap), 230 * dt);
    c.walk = walking ? c.walk + dt * 10 : lerp(c.walk % (Math.PI * 2), 0, 0.2);
    c.box.setPosition(c.x, WORLD.floor + 8);
    c.box.scaleX = 0.8 * (mv.x >= c.x ? 1 : -1);
    c.legA.setAngle(walking ? Math.sin(c.walk) * 26 : 0);
    c.legB.setAngle(walking ? -Math.sin(c.walk) * 26 : 0);
    c.arm.setAngle(walking ? -Math.sin(c.walk) * 30 : speaking?.who === "keeper" ? -40 + Math.sin(t * 6) * 10 : calm ? 0 : Math.sin(t * 1.6) * 3);
    c.body.y = -180 + (walking ? Math.abs(Math.sin(c.walk)) * -3 : calm ? 0 : Math.sin(t * 1.8) * 1);
    c.head.y = -212 + (c.body.y + 180);
    c.head.setAngle(Math.max(-14, Math.min(4, (mv.y - 30 - (WORLD.floor - 170)) / 26)) + (speaking?.who === "keeper" ? Math.sin(t * 8) * 3 : 0));
    blink(c, c.head, "keeper-head", "keeper-headBlink");

    // The scholar turns to the bird, and points when a mirror turns or he speaks.
    const g = this.sage;
    g.box.scaleX = 0.86 * (mv.x >= START_AT.scholar.x ? 1 : -1);
    g.point = Math.max(0, g.point - dt);
    const lift = speaking?.who === "scholar" ? 1 : g.point > 0 ? 1 : 0;
    g.arm.setAngle(lerp(g.arm.angle, lift ? -62 + Math.sin(t * 5) * 6 : calm ? 0 : Math.sin(t * 1.3) * 2, 1 - Math.exp(-dt * 8)));
    g.head.setAngle((speaking?.who === "scholar" ? Math.sin(t * 7) * 3 : calm ? 0 : Math.sin(t * 1.1) * 1.5) + (mv.y < 380 ? -6 : 0));
    g.head.y = -292 + (calm ? 0 : Math.sin(t * 1.5) * 1.2);
    blink(g, g.head, "sage-head", "sage-headBlink");

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

  // ------------------------------------------------------------------------------------------ measuring, leaving
  info(): Record<string, unknown> {
    const pics = [...this.pictures.entries()].map(([key, p]) => ({ key, width: p.canvas.width, height: p.canvas.height, bytes: bytesOf(p) }));
    return {
      renderer: this.game.renderer.type === Phaser.WEBGL ? "webgl" : "canvas",
      canvas: [this.game.canvas.width, this.game.canvas.height],
      pixelRatio: this.rs,
      textures: pics.length,
      textureBytes: pics.reduce((n, p) => n + p.bytes, 0),
      largestTextures: pics.sort((a, b) => b.bytes - a.bytes).slice(0, 5),
      objects: this.children.length + [this.root, this.main, this.far, this.mid, this.front].reduce((n, c) => n + c.length, 0),
      tweens: this.tweens.getTweens().length,
      frames: this.frames.summary(),
    };
  }
  resetFrames(): void {
    this.frames.reset();
  }
  private release(): void {
    this.input.removeAllListeners();
    this.tweens.killAll();
    for (const key of this.pictures.keys()) this.textures.remove(key);
    this.pictures.clear();
    this.mirrors.clear();
    this.strips = [];
    this.rainbows = [];
    this.motes = [];
    this.stars = [];
    this.sparks = [];
  }
}

export { GRID };
