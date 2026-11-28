// The room engine: what every walkable room of Hudhud has, pulled out of Ibn al-Haytham's workshop (27 November 2026)
// so that each scene can become a complete room with its own figures. Phaser gives the canvas, the WebGL renderer,
// the scene's life (create, update, shutdown), tweens and pointer input; what happens is decided elsewhere (sim/),
// and a room only draws it.
//
// What the engine does, for every room: textures (painted once, uploaded in columns of at most 2048 pixels, sized by
// the effects preset), the layers and the camera with its parallax, the bird and the explorer who follows it,
// movement by the shared rules (sim/move.ts), touching the nearest thing and the ring that marks it, carrying the bird
// to a thing (goTo), the lit door and reaching it, sparks, the frame-time record and the measurements (info), and
// letting everything go when the room is left. A room adds its own data (world, floor, perches, things, door, where
// the bird and the explorer begin) and a handful of hooks: how it paints itself, its own figures, which things can be
// touched now, where the bird stands to touch a thing, where its people stand (so that the explorer never stops in
// front of one, sim/follow.ts), and what its own pictures do each frame. A room's movement starts only once the movement
// keys have been let go after it began, so that a key held through the last room's door does not carry the bird on.
//
// Why a base class and not a set of functions: Phaser's scenes are classes with a life of their own (init, create,
// update, the shutdown event), and a room is one of them; the hooks are the few methods a room overrides.
import * as Phaser from "phaser";
import { FrameRecorder } from "@im/kernel/framestats";
import { Rng } from "@im/kernel/prng";
import { hudhud as paintHudhud, keeper as paintKeeper, portrait } from "../art/cast";
import { DOOR_ART, doorArt } from "../art/corridor";
import { glow, type Painted } from "../art/kit";
import * as props from "../art/props";
import type { Cue } from "../audio/cues";
import type { Mood } from "../narrative/dialogue";
import type { Keeper, Quality } from "../save/save";
import { distance, landing } from "../sim/door";
import { followStep, settleIntent, type Spot, type Standing } from "../sim/follow";
import { advance, newMover, type Intent, type Mover, type Room } from "../sim/move";

/** What a room asks of the page around it. A room's own host adds what its rules hold (the workshop's `state`). */
export interface RoomHost {
  intent(): Intent;
  /** A talk, a pause or a sheet is up: the world waits. */
  frozen(): boolean;
  touch(id: string): void;
  /** The thing the bird is near enough to touch changed ("door" for the lit door). */
  near(id: string | null): void;
  /** The bird reached the lit door, or touched it: the room is left for the next scene. */
  through(): void;
  sound(c: Cue): void;
  speaking(): { who: string; mood: Mood } | null;
  look(): { quality: Quality; reducedMotion: boolean; style: string; keeper: Keeper };
  /** Faces for the words: data URLs of the portraits, made from the same parts as the figures. */
  portraits(urls: Record<string, string>): void;
}

/** A thing in a room that the bird can fly to and touch. */
export interface RoomThing {
  id: string;
  kind: string;
  x: number;
  y: number;
  /** How near the bird must be, in world pixels. */
  reach: number;
  /** The string that names it, for the list a screen reader reads. */
  name: string;
}

/** A room as data: its size and floor, its perches, its door, and where the bird and the explorer begin. */
export interface RoomLayout {
  world: { width: number; height: number; floor: number; view: { width: number; height: number } };
  room: Room;
  door: { x: number; y: number; reach: number };
  start: { hudhud: number; keeper: number };
  /** What each way of playing adds to the bird (Story: more flaps, a slower glide). */
  assist: Record<string, { extraFlaps: number; slowFall: number }>;
  /** The seed of the room's cosmetic randomness (stars, motes, blinks, sparks). */
  seed: string;
}

export const QUALITY: Record<Quality, { texture: number; pixelRatio: number; motes: number; stars: number; shafts: boolean; sway: boolean }> = {
  low: { texture: 1, pixelRatio: 1, motes: 0, stars: 0, shafts: false, sway: false },
  medium: { texture: 1.5, pixelRatio: 1.5, motes: 26, stars: 14, shafts: false, sway: true },
  high: { texture: 2, pixelRatio: 2, motes: 60, stars: 30, shafts: true, sway: true },
};
/** No texture is wider than this many pixels: a picture that would be is cut into columns. */
export const MAX_TEXTURE = 2048;

export type Img = Phaser.GameObjects.Image;
export type Box = Phaser.GameObjects.Container;
export const ADD = Phaser.BlendModes.ADD;
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export abstract class RoomScene<H extends RoomHost = RoomHost> extends Phaser.Scene {
  protected host!: H;
  protected q = QUALITY.medium;
  protected rs = 1;
  protected root!: Box;
  protected far!: Box;
  protected mid!: Box;
  protected main!: Box;
  protected front!: Box;
  private pictures = new Map<string, Painted>();
  /** Every texture handed to the graphics card, with its size in pixels. */
  private uploaded = new Map<string, [number, number]>();
  private columns = new Map<string, { key: string; x: number }[]>();
  protected mover!: Mover;
  private carry = 0;
  protected camX = 0;
  protected t = 0;
  protected readonly rng: Rng;
  private readonly frames = new FrameRecorder(40000);
  private nearId: string | null = null;
  private pilot: { id: string; from: { x: number; y: number }; to: { x: number; y: number }; t: number } | null = null;
  private last = { hops: 0, flaps: 0, landings: 0 };

  protected bird!: { box: Box; inner: Box; tail: Img; body: Img; wing: Img; wingOpen: Img; head: Img; crest: Img; legs: Img; crestOpen: number; blink: number; squash: number };
  protected child!: { box: Box; legA: Img; legB: Img; body: Img; arm: Img; head: Img; x: number; blink: number; walk: number };
  private ring!: Img;
  protected sparks: Img[] = [];
  private doorLit!: Img;
  private doorGlow!: Img;
  private doorLine!: Img;
  private doorShown = 0;
  /** The bird has gone through the door: it is told once. */
  private went = false;
  /** The movement keys have been let go since the room began (sim/follow.ts settleIntent): until then the bird stands still. */
  private armed = false;

  constructor(key: string, protected readonly layout: RoomLayout) {
    super(key);
    this.rng = new Rng(layout.seed);
  }
  init(data: { host: H }): void {
    this.host = data.host;
    // The room is started again on the same object (a new play): the door is closed and not yet gone through.
    this.went = false;
    this.doorShown = 0;
    this.armed = false;
  }

  // ------------------------------------------------------------------------------------------ a room's hooks
  /** Every thing in the room that may be touched. */
  protected abstract things(): readonly RoomThing[];
  /** Paints the room into its layers. Called once from create(), after the layers' root exists; the room makes its
   * own layers (layers()) when it is ready for them, and places the door, the ring, the cast and the sparks itself, so
   * that what is drawn over what is the room's choice. */
  protected abstract build(look: ReturnType<RoomHost["look"]>): void;
  /** The quest is done: the door is lit, and is the only thing the bird can reach. */
  protected abstract lit(): boolean;
  /** Whether a thing can be touched now (a mirror this way of playing does not have, a feather already found). */
  protected touchable(_t: RoomThing): boolean {
    return true;
  }
  /** Where the bird stands to touch a thing, across from it: in front of a mirror, beside a person. */
  protected approach(_t: RoomThing): number {
    return 0;
  }
  /** A press on the picture itself, in world pixels. */
  protected tap(_x: number, _y: number): void {}
  /** Called once the room is built and the bird stands in it. */
  protected ready(): void {}
  /** The people of the room (its figure and its helper), where they stand: the explorer stops short of them, never in front of them (and short of every thing that can be touched, sim/follow.ts). */
  protected people(): readonly Standing[] {
    return [];
  }
  /**
   * What the explorer keeps clear of besides the room's people: every thing that can be touched, and whatever else a room
   * stands at the explorer's height that it must not hide (the sorting rooms' trays and shelves, empty or not, since
   * 27 November 2026: the lead agent saw the explorer stop in front of an empty tray in al-Jahiz's room).
   */
  protected standClear(): readonly Spot[] {
    return this.things();
  }
  /** The thing within the bird's reach now ("door" for the lit door), or null. */
  protected nearNow(): string | null {
    return this.nearId;
  }
  /** What the room's own pictures do this frame. */
  protected animateRoom(_dt: number, _mv: Mover, _calm: boolean): void {}
  /** Lets go of what the room keeps of its own when the room is left. */
  protected releaseRoom(): void {}

  // ------------------------------------------------------------------------------------------ building
  protected tex(key: string, make: () => Painted): string {
    if (!this.pictures.has(key)) {
      const p = make();
      this.pictures.set(key, p);
      this.upload(key, p.canvas);
    }
    return key;
  }
  private upload(key: string, canvas: HTMLCanvasElement): void {
    this.textures.addCanvas(key, canvas);
    this.uploaded.set(key, [canvas.width, canvas.height]);
  }
  /**
   * A picture too wide for one texture, painted once and uploaded as columns of at most 2048 pixels, each lapping
   * the next by one game pixel so that no seam shows. Returns the picture itself, for a painter that draws from it.
   */
  protected wide(key: string, make: () => Painted): Painted {
    const had = this.pictures.get(key);
    if (had) return had;
    const p = make();
    this.pictures.set(key, p);
    const ts = p.canvas.width / p.w;
    const step = Math.floor(MAX_TEXTURE / ts / 2) * 2 - 2; // game pixels a column, even, with room for the lap
    const cols: { key: string; x: number }[] = [];
    for (let x = 0, i = 0; x < p.w; x += step, i++) {
      const w = Math.min(step + 1, p.w - x);
      const tile = document.createElement("canvas");
      tile.width = Math.round(w * ts);
      tile.height = p.canvas.height;
      tile.getContext("2d")!.drawImage(p.canvas, Math.round(x * ts), 0, tile.width, tile.height, 0, 0, tile.width, tile.height);
      this.upload(`${key}#${i}`, tile);
      cols.push({ key: `${key}#${i}`, x });
    }
    this.columns.set(key, cols);
    return p;
  }
  protected putWide(parent: Box, key: string, x: number, y: number, oy: number): void {
    for (const c of this.columns.get(key)!) this.put(parent, c.key, x + c.x, y, 0, oy);
  }
  protected put(parent: Box, key: string, x: number, y: number, ox = 0.5, oy = 0.5): Img {
    const im = this.add.image(x, y, key).setOrigin(ox, oy).setScale(1 / this.q.texture);
    parent.add(im);
    return im;
  }
  protected layer(parent?: Box): Box {
    const c = this.add.container(0, 0);
    parent?.add(c);
    return c;
  }
  /** The four layers under the root, back to front: far and middle (they move less than the camera), the room, and
   * the foreground (it moves more). Whatever the room put on the root before this call is behind them all. */
  protected layers(): void {
    this.far = this.layer(this.root);
    this.mid = this.layer(this.root);
    this.main = this.layer(this.root);
    this.front = this.layer(this.root);
  }
  /** The door at the room's far end: dark until the quest is done, then lit, with a glow behind it and a line of light
   * under it. Shape and light both change, not only colour. */
  protected buildDoor(m: Box): void {
    const ts = this.q.texture;
    const { door, world } = this.layout;
    this.tex("glow", () => glow(256, ts));
    this.doorGlow = this.put(m, "glow", door.x, world.floor - DOOR_ART.h / 2).setBlendMode(ADD).setScale(1.9 / ts, 2.5 / ts).setAlpha(0);
    this.put(m, this.tex("door-dark", () => doorArt(ts, false)), door.x, world.floor + 4, 0.5, 1);
    this.doorLit = this.put(m, this.tex("door-lit", () => doorArt(ts, true)), door.x, world.floor + 4, 0.5, 1).setAlpha(0);
    this.doorLine = this.put(m, "glow", door.x, world.floor + 2).setBlendMode(ADD).setScale(0.9 / ts, 0.12 / ts).setTint(0xfff1c4).setAlpha(0);
  }
  /** The ring that marks the thing within reach. */
  protected buildRing(m: Box): void {
    this.tex("glow", () => glow(256, this.q.texture));
    this.ring = this.put(m, "glow", 0, 0).setBlendMode(ADD).setScale(0.7 / this.q.texture).setTint(0xfff0b0).setAlpha(0);
  }
  /** The player's explorer, who walks after the bird along the floor. */
  protected buildKeeper(m: Box, look: Keeper, urls: Record<string, string>): void {
    const ka = paintKeeper(this.q.texture, look);
    for (const [k, p] of Object.entries(ka)) this.tex(`keeper-${k}`, () => p);
    const x = this.layout.start.keeper;
    const kBox = this.layer(m).setPosition(x, this.layout.world.floor).setScale(0.8);
    const legA = this.put(kBox, "keeper-leg", -14, -68, 0.5, 0);
    const legB = this.put(kBox, "keeper-leg", 14, -68, 0.5, 0);
    this.put(kBox, "keeper-satchel", -30, -118);
    const kBody = this.put(kBox, "keeper-body", 0, -180, 0.5, 0);
    const kArm = this.put(kBox, "keeper-arm", 18, -170, 0.5, 0.06);
    const kHead = this.put(kBox, "keeper-head", 2, -212, 0.5, 0.54);
    this.child = { box: kBox, legA, legB, body: kBody, arm: kArm, head: kHead, x, blink: 2, walk: 0 };
    urls.keeper = portrait(1, { back: ka.body, head: ka.head }, "#3fa39b").canvas.toDataURL("image/png");
  }
  /** Hudhud. */
  protected buildBird(m: Box, urls: Record<string, string>): void {
    const ha = paintHudhud(this.q.texture);
    for (const [k, p] of Object.entries(ha)) this.tex(`bird-${k}`, () => p);
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
  }
  /** A small store of sparks for bursts. */
  protected buildSparks(m: Box, n = 14): void {
    this.tex("sparkle", () => props.sparkle(this.q.texture));
    for (let i = 0; i < n; i++) this.sparks.push(this.put(m, "sparkle", 0, 0).setBlendMode(ADD).setVisible(false));
  }

  create(): void {
    const look = this.host.look();
    this.q = QUALITY[look.quality];
    this.rs = this.scale.width / this.layout.world.view.width;
    this.root = this.layer().setScale(this.rs);
    this.build(look);
    this.mover = newMover(this.layout.start.hudhud, this.layout.world.floor);
    this.child.x = this.layout.start.keeper;
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => this.tap(p.x / this.rs + this.camX, p.y / this.rs));
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.release());
    this.ready();
  }

  protected thing(id: string): RoomThing {
    return this.things().find((t) => t.id === id)!;
  }
  protected burst(at: { x: number; y: number }, n: number): void {
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
  /** Carries the bird to a thing and touches it: what the list under the picture and a screen reader's user do. */
  goTo(id: string): void {
    const t = this.things().find((k) => k.id === id);
    if (!t || this.host.frozen()) return;
    const to = landing(t, this.layout.room, this.approach(t));
    if (this.host.look().reducedMotion) {
      this.mover = { ...newMover(to.x, to.y), facing: t.x >= to.x ? 1 : -1 };
      this.host.touch(id);
      return;
    }
    this.pilot = { id, from: { x: this.mover.x, y: this.mover.y }, to, t: 0 };
  }
  /** The touch button or key: touch whatever is near. */
  touchNear(): void {
    if (!this.nearId || this.host.frozen()) return;
    if (this.nearId === "door") this.goThrough();
    else this.host.touch(this.nearId);
  }
  private goThrough(): void {
    if (this.went) return;
    this.went = true;
    this.host.through();
  }
  /** The door: lit once the quest is done; where it stands. */
  door(): { lit: boolean; where: { x: number; y: number; reach: number } } {
    return { lit: this.lit(), where: { ...this.layout.door } };
  }
  where(): { x: number; y: number; grounded: boolean; near: string | null } {
    return { x: this.mover.x, y: this.mover.y, grounded: this.mover.grounded, near: this.nearId };
  }
  /** Where the explorer stands on the floor, and the people of the room, for the browser checks. */
  standing(): { explorer: number; people: { x: number }[] } {
    return { explorer: this.child.x, people: this.people().map((p) => ({ x: p.x })) };
  }

  override update(_time: number, deltaMs: number): void {
    const dt = Math.min(deltaMs, 100) / 1000;
    this.frames.tick(performance.now());
    this.t += dt;
    const look = this.host.look();
    const frozen = this.host.frozen();
    const calm = look.reducedMotion;
    const { room, world, door } = this.layout;

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
      // The keys are read even while the world waits, so that letting them go during a talk counts.
      const settled = settleIntent(this.armed, this.host.intent());
      this.armed = settled.armed;
      const input: Intent = frozen ? { dir: 0, jump: false, down: false } : settled.intent;
      const r = advance(this.mover, room, input, dt, this.carry, this.layout.assist[look.style]);
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
    if (!frozen && !this.pilot && this.lit()) {
      // Once the quest is done only the door can be reached, and reaching it is going through it.
      if (distance(door, mv) < door.reach) near = "door";
    } else if (!frozen && !this.pilot) {
      for (const t of this.things()) {
        if (!this.touchable(t)) continue;
        const d = distance(t, mv);
        if (d < t.reach && d < best) (best = d), (near = t.id);
      }
    }
    if (near !== this.nearId) {
      this.nearId = near;
      this.host.near(near);
    }
    if (near === "door") this.goThrough();
    const nt = near === "door" ? door : near ? this.thing(near) : null;
    this.ring.setAlpha(lerp(this.ring.alpha, nt ? 0.55 + (calm ? 0 : Math.sin(this.t * 5) * 0.15) : 0, 0.2));
    if (nt) this.ring.setPosition(nt.x, nt.y);

    // The camera follows the bird; the far layers move less, the front one more.
    const want = Math.min(world.width - world.view.width, Math.max(0, mv.x - world.view.width / 2));
    this.camX = calm ? want : lerp(this.camX, want, 1 - Math.exp(-dt * 6));
    this.main.x = -this.camX;
    this.far.x = -this.camX * 0.12 - 60;
    this.mid.x = -this.camX * 0.3 - 80;
    this.front.x = -this.camX * (calm ? 1 : 1.22);

    this.animateCast(dt, mv, calm);
    this.animateRoom(dt, mv, calm);
    // The door lights when the quest is done, and its light breathes gently unless movement is kept still.
    const lit = this.lit();
    this.doorShown = calm ? (lit ? 1 : 0) : lerp(this.doorShown, lit ? 1 : 0, 1 - Math.exp(-dt * 3));
    const pulse = calm ? 1 : 0.85 + Math.sin(this.t * 2.2) * 0.15;
    this.doorLit.setAlpha(this.doorShown);
    this.doorGlow.setAlpha(this.doorShown * pulse);
    this.doorLine.setAlpha(this.doorShown * pulse);
  }

  /** A figure's eyes close now and then. */
  protected blink(o: { blink: number }, img: Img, open: string, shut: string, dt: number): void {
    o.blink -= dt;
    if (o.blink < -0.12) o.blink = this.rng.range(2.2, 5);
    img.setTexture(o.blink < 0 ? shut : open);
  }

  private animateCast(dt: number, mv: Mover, calm: boolean): void {
    const t = this.t;
    const speaking = this.host.speaking();
    const floor = this.layout.world.floor;

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
    this.blink(b, b.head, "bird-head", "bird-headBlink", dt);

    // The explorer walks after the bird along the floor and looks up at it, and stops short of a person, a thing that can
    // be touched, or a group's place in a sorting room, rather than in front of one (sim/follow.ts).
    const c = this.child;
    const step = followStep(c.x, mv, this.people(), this.layout.world.width, dt, this.host.frozen(), this.standClear(), floor);
    const walking = step.walking;
    c.x = step.x;
    c.walk = walking ? c.walk + dt * 10 : lerp(c.walk % (Math.PI * 2), 0, 0.2);
    c.box.setPosition(c.x, floor + 8);
    c.box.scaleX = 0.8 * (mv.x >= c.x ? 1 : -1);
    c.legA.setAngle(walking ? Math.sin(c.walk) * 26 : 0);
    c.legB.setAngle(walking ? -Math.sin(c.walk) * 26 : 0);
    c.arm.setAngle(walking ? -Math.sin(c.walk) * 30 : speaking?.who === "keeper" ? -40 + Math.sin(t * 6) * 10 : calm ? 0 : Math.sin(t * 1.6) * 3);
    c.body.y = -180 + (walking ? Math.abs(Math.sin(c.walk)) * -3 : calm ? 0 : Math.sin(t * 1.8) * 1);
    c.head.y = -212 + (c.body.y + 180);
    c.head.setAngle(Math.max(-14, Math.min(4, (mv.y - 30 - (floor - 170)) / 26)) + (speaking?.who === "keeper" ? Math.sin(t * 8) * 3 : 0));
    this.blink(c, c.head, "keeper-head", "keeper-headBlink", dt);
  }

  // ------------------------------------------------------------------------------------------ measuring, leaving
  info(): Record<string, unknown> {
    const pics = [...this.uploaded.entries()].map(([key, [width, height]]) => ({ key, width, height, bytes: width * height * 4 }));
    return {
      renderer: this.game.renderer.type === Phaser.WEBGL ? "webgl" : "canvas",
      canvas: [this.game.canvas.width, this.game.canvas.height],
      pixelRatio: this.rs,
      textures: pics.length,
      textureKeys: pics.map((p) => p.key),
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
    for (const key of this.uploaded.keys()) this.textures.remove(key);
    this.uploaded.clear();
    this.columns.clear();
    this.pictures.clear();
    this.sparks = [];
    this.releaseRoom();
  }
}
