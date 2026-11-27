// Al-Kindi's room on screen: the fifth room on the room engine (./room.ts). The engine carries the bird, the explorer,
// the camera, touching and the door; this file adds the room's painting, al-Kindi and the young messenger, the large
// board with the strip of the secret message, a hung tile for each mark and the place under it with the sign given to
// that mark (placed from the quest's own state each time it changes), the tokens on the shelf below it (dimmed while a
// mark has their sign), the sign in Hudhud's beak, the two count boards, the bell that is rung to read the page, the torn
// page on the bookcase and the feather under it. What happens is decided in sim/kindiroom.ts and sim/cipher.ts.
import { KINDI_LOOK, messenger as paintMessenger, portrait, scholar as paintScholar } from "../art/cast";
import { glow } from "../art/kit";
import * as props from "../art/props";
import { bell as paintBell, countBoard, kindiRoom, markArt, openingLine, signArt, slotArt, tile as paintTile, tokenBase, tornPage } from "../art/kindi";
import { KDR_APPROACH, KDR_BELL, KDR_BOARD, KDR_COUNTS, KDR_LAMP, KDR_LAYOUT, KDR_PAGE, KDR_SHELF, KDR_START, KDR_WORLD, boardMarks, kdrThings, stripX, tileX, tokenX, type KdrSpeaker, type KdrThing } from "../content/kindi-room";
import type { Mood } from "../narrative/dialogue";
import type { Keeper, Quality } from "../save/save";
import { ranked, type CipherStyle } from "../sim/cipher";
import type { Mover } from "../sim/move";
import type { KindiHappened, KindiState } from "../sim/kindiroom";
import { ADD, RoomScene, lerp, type Box, type Img, type RoomHost, type RoomThing } from "./room";

/** What the room is showing, beyond the rules' state: whether the door is lit. */
export interface KindiView {
  state: KindiState;
  /** The page reads: the door is lit. */
  done: boolean;
}
export interface KindiSceneHost extends RoomHost {
  view(): KindiView;
  /** The page reads right to left: the first mark is on the right. */
  rtl: boolean;
  speaking(): { who: KdrSpeaker; mood: Mood } | null;
  look(): { quality: Quality; reducedMotion: boolean; style: CipherStyle; keeper: Keeper };
}

export class KindiScene extends RoomScene<KindiSceneHost> {
  private sage!: { box: Box; arm: Img; head: Img; blink: number; point: number };
  private kid!: { box: Box; head: Img; arm: Img; blink: number; hop: number };
  private strip: { mark: string; img: Img }[] = [];
  private slots = new Map<string, { frame: Img; sign: Img }>();
  private tokens = new Map<string, { base: Img; sign: Img; lift: number }>();
  private carried!: Img;
  private bellImg!: Img;
  private swing = 0;
  private pageImg!: Img;
  private feather!: Img;
  private boardGlow!: Img;
  private lampGlow!: Img;
  private drawn = "";
  private list: KdrThing[] = [];

  constructor() {
    super("kindi", KDR_LAYOUT);
  }

  protected things(): readonly RoomThing[] {
    return this.list;
  }
  protected lit(): boolean {
    return this.host.view().done;
  }
  protected override approach(t: RoomThing): number {
    return KDR_APPROACH[(t as KdrThing).kind];
  }
  protected override tap(x: number, y: number): void {
    // A press on the picture flies the bird to the thing pressed, and touches it.
    if (this.host.frozen()) return;
    const hit = this.list.find((t) => Math.hypot(t.x - x, t.y - y) < 48);
    if (hit) this.goTo(hit.id);
  }

  // ------------------------------------------------------------------------------------------ building
  protected build(look: { keeper: Keeper }): void {
    const v = this.host.view();
    const p = v.state.cipher.puzzle;
    const rtl = this.host.rtl;
    this.list = kdrThings(v.state.cipher.style, rtl);
    const ts = this.q.texture;
    const T = this.tex.bind(this);
    this.layers();
    const m = this.main;
    this.wide("kindi-room", () => kindiRoom(ts));
    this.putWide(m, "kindi-room", 0, 0, 0);
    T("glow", () => glow(256, ts));
    // The lamplight, which breathes a little; and a soft light on the board once the page reads.
    this.lampGlow = this.put(m, "glow", KDR_LAMP.x + 30, KDR_LAMP.y - 44).setBlendMode(ADD).setScale(1.6 / ts).setAlpha(0.5).setTint(0xffd08a);
    this.boardGlow = this.put(m, "glow", KDR_BOARD.x + KDR_BOARD.w / 2, (KDR_BOARD.top + KDR_BOARD.bottom) / 2).setBlendMode(ADD).setScale(4 / ts, 1.6 / ts).setAlpha(0).setTint(0xfff1c4);
    this.buildDoor(m);

    for (const id of p.marks) T(`mark-${id}`, () => markArt(ts, id));
    for (const id of p.signs) T(`sign-${id}`, () => signArt(ts, id));
    // The count boards: the page's two tables, as bars of dots.
    const sample = ranked(p.sample).map((r) => ({ kind: "sign" as const, ...r }));
    const message = ranked(p.message).map((r) => ({ kind: "mark" as const, ...r }));
    const counts = [T(`counts-sample-${v.state.cipher.style}-${rtl}`, () => countBoard(ts, sample, rtl, "sample")), T(`counts-message-${v.state.cipher.style}-${rtl}`, () => countBoard(ts, message, rtl, "message"))];
    // On a page read right to left the boards change places too: the whole page's counts first, on the right.
    const xs = rtl ? [...KDR_COUNTS.xs].reverse() : KDR_COUNTS.xs;
    counts.forEach((key, i) => this.put(m, key, xs[i]!, KDR_COUNTS.top, 0, 0));

    // The board: the strip of the message, the hung tiles with their marks, and the places beneath them.
    this.strip = p.message.map((mark, i) => ({ mark, img: this.put(m, `mark-${mark}`, stripX(i, p.message.length, rtl), KDR_BOARD.stripY).setScale(0.34 / ts) }));
    // The opening: a red line under the first two marks of the message, as on the page's picture.
    const a = stripX(0, p.message.length, rtl);
    const b = stripX(1, p.message.length, rtl);
    T("opening", () => openingLine(ts));
    this.put(m, "opening", (a + b) / 2, KDR_BOARD.stripY + 16).setScale((Math.abs(b - a) + 24) / 40 / ts, 1 / ts);
    T("tile", () => paintTile(ts));
    T("slot-empty", () => slotArt(ts, false));
    T("slot-given", () => slotArt(ts, true));
    const marks = boardMarks(p);
    marks.forEach((mark, i) => {
      const x = tileX(i, marks.length, rtl);
      this.put(m, "tile", x, KDR_BOARD.tileY - 4);
      this.put(m, `mark-${mark}`, x, KDR_BOARD.tileY + 2).setScale(0.74 / ts);
      const frame = this.put(m, "slot-empty", x, KDR_BOARD.slotY);
      const sign = this.put(m, `sign-${p.signs[0]!}`, x, KDR_BOARD.slotY).setScale(0.66 / ts).setVisible(false);
      this.slots.set(mark, { frame, sign });
    });
    // The tokens on the shelf.
    T("token-base", () => tokenBase(ts));
    p.signs.forEach((id, i) => {
      const x = tokenX(i, p.signs.length, rtl);
      const base = this.put(m, "token-base", x, KDR_SHELF.y - 4);
      const sign = this.put(m, `sign-${id}`, x, KDR_SHELF.tokenY).setScale(0.62 / ts);
      this.tokens.set(id, { base, sign, lift: 0 });
    });
    // The bell on its stand.
    this.bellImg = this.put(m, T("bell", () => paintBell(ts)), KDR_BELL.x, KDR_BELL.y - 80, 0.5, 0);
    // The torn page on the bookcase, and the feather under its corner until it is found.
    this.feather = this.put(m, T("feather", () => props.feather(ts)), KDR_PAGE.x + 34, KDR_PAGE.y + 22).setAngle(78).setScale(0.55 / ts);
    this.pageImg = this.put(m, T("torn-page", () => tornPage(ts)), KDR_PAGE.x, KDR_PAGE.y + 30, 0.5, 1);
    this.buildRing(m);

    this.buildCast(m, ts, look.keeper);
    // The sign in Hudhud's beak, over the bird.
    this.carried = this.put(m, `sign-${p.signs[0]!}`, 0, 0).setScale(0.46 / ts).setVisible(false);
    this.buildSparks(m);
  }
  protected override ready(): void {
    this.placeBoard();
  }

  private buildCast(m: Box, ts: number, look: Keeper): void {
    const T = this.tex.bind(this);
    const urls: Record<string, string> = {};
    // Al-Kindi, as the game imagines him: the scholar's cut-out in lamplit colours. Not a likeness.
    const ka = paintScholar(ts, KINDI_LOOK);
    for (const [k, p] of Object.entries(ka)) T(`kindi-${k}`, () => p);
    const sageBox = this.layer(m).setPosition(KDR_START.kindi, KDR_WORLD.floor).setScale(0.86);
    this.put(sageBox, "kindi-body", 0, 2, 0.5, 1);
    const sArm = this.put(sageBox, "kindi-arm", 62, -236, 0.5, 0.05);
    const sHead = this.put(sageBox, "kindi-head", 4, -292, 0.5, 0.58);
    this.sage = { box: sageBox, arm: sArm, head: sHead, blink: 3, point: 0 };
    urls.kindi = portrait(1, { back: ka.body, head: ka.head }, "#3d3a7a").canvas.toDataURL("image/png");

    // The young messenger, an invented person, by the door.
    const ma = paintMessenger(ts);
    for (const [k, p] of Object.entries(ma)) T(`messenger-${k}`, () => p);
    const cBox = this.layer(m).setPosition(KDR_START.messenger, KDR_WORLD.floor + 8).setScale(0.74);
    this.put(cBox, "messenger-leg", -14, -68, 0.5, 0);
    this.put(cBox, "messenger-leg", 14, -68, 0.5, 0);
    this.put(cBox, "messenger-body", 0, -180, 0.5, 0);
    const cArm = this.put(cBox, "messenger-arm", 18, -170, 0.5, 0.06);
    const cHead = this.put(cBox, "messenger-head", 2, -212, 0.5, 0.54);
    this.kid = { box: cBox, head: cHead, arm: cArm, blink: 1.4, hop: 0 };
    urls.messenger = portrait(1, { back: ma.body, head: ma.head }, "#3f8f5b").canvas.toDataURL("image/png");

    this.buildKeeper(m, look, urls);
    this.buildBird(m, urls);
    this.host.portraits(urls);
  }

  // ------------------------------------------------------------------------------------------ the board
  /** Puts every sign where the rules say it is: in a mark's place, on the shelf (dimmed while a mark has it), or in the beak. */
  private placeBoard(): void {
    const s = this.host.view().state;
    const key = JSON.stringify([s.cipher.guess, s.carrying, s.cipher.done]);
    if (key === this.drawn) return;
    this.drawn = key;
    const given = new Set(Object.values(s.cipher.guess));
    for (const [mark, slot] of this.slots) {
      const sign = s.cipher.guess[mark];
      slot.frame.setTexture(sign ? "slot-given" : "slot-empty");
      slot.sign.setVisible(!!sign);
      if (sign) slot.sign.setTexture(`sign-${sign}`);
    }
    for (const [sign, tk] of this.tokens) {
      tk.sign.setVisible(s.carrying !== sign);
      tk.sign.setAlpha(given.has(sign) ? 0.35 : 1);
    }
    this.carried.setVisible(s.carrying !== null);
    if (s.carrying) this.carried.setTexture(`sign-${s.carrying}`);
    // The page read: each mark of the strip shows the sign it stands for.
    for (const st of this.strip) st.img.setTexture(s.cipher.done ? `sign-${s.cipher.puzzle.key[st.mark]!}` : `mark-${st.mark}`).setScale((s.cipher.done ? 0.3 : 0.34) / this.q.texture);
  }
  /** What the board shows now, for the browser checks: the sign in each mark's place, the tokens dimmed and on the shelf, the beak, the feather. */
  shown(): { places: Record<string, string | null>; dimmed: string[]; onShelf: string[]; beak: string | null; feather: boolean; readStrip: boolean; agree: boolean } {
    const s = this.host.view().state;
    const places: Record<string, string | null> = {};
    let agree = true;
    for (const [mark, slot] of this.slots) {
      const sign = slot.sign.visible ? String(slot.sign.texture.key).replace(/^sign-/, "") : null;
      places[mark] = sign;
      if (sign !== (s.cipher.guess[mark] ?? null)) agree = false;
    }
    const dimmed = [...this.tokens].filter(([, t]) => t.sign.alpha < 1).map(([k]) => k);
    const onShelf = [...this.tokens].filter(([, t]) => t.sign.visible).map(([k]) => k);
    const beak = this.carried.visible ? String(this.carried.texture.key).replace(/^sign-/, "") : null;
    if (beak !== s.carrying) agree = false;
    const readStrip = this.strip.every((st) => String(st.img.texture.key).startsWith("sign-"));
    return { places, dimmed, onShelf, beak, feather: this.feather.visible, readStrip, agree };
  }

  // ------------------------------------------------------------------------------------------ from the rules
  /** Things that happened in the rules, to be shown. */
  happened(list: KindiHappened[]): void {
    for (const h of list) {
      if (h.type === "assign" && h.changed) {
        const t = this.list.find((k) => k.id === `slot-${h.mark}`)!;
        this.burst(t, h.sign ? 6 : 3);
        this.sage.point = 1.2;
      } else if (h.type === "pick") {
        const tk = this.tokens.get(h.sign);
        if (tk) tk.lift = 0.3;
      } else if (h.type === "read") this.swing = 1;
      else if (h.type === "opened") this.burst({ x: KDR_BOARD.x + KDR_BOARD.w / 2, y: KDR_BOARD.stripY }, 14);
      else if (h.type === "feather") this.burst({ x: KDR_PAGE.x + 34, y: KDR_PAGE.y + 20 }, 10);
      else if (h.type === "talk" && h.script.startsWith("messenger")) this.kid.hop = 0.5;
    }
  }

  protected override animateRoom(dt: number, mv: Mover, calm: boolean): void {
    const v = this.host.view();
    const s = v.state;
    const t = this.t;
    const speaking = this.host.speaking();
    this.placeBoard();

    // The sign in Hudhud's beak.
    if (s.carrying) {
      this.carried.setPosition(mv.x + mv.facing * 46, mv.y - 58 + (calm ? 0 : Math.sin(t * 6) * 2));
    }
    // A token picked up rises a little first; the bell swings when it is rung.
    for (const tk of this.tokens.values()) {
      tk.lift = Math.max(0, tk.lift - dt);
      tk.sign.y = KDR_SHELF.tokenY - (calm ? 0 : Math.sin((tk.lift / 0.3) * Math.PI) * 8);
    }
    this.swing = Math.max(0, this.swing - dt);
    this.bellImg.setAngle(calm ? 0 : Math.sin(this.swing * 18) * this.swing * 16);
    this.lampGlow.setAlpha(calm ? 0.5 : 0.46 + Math.sin(t * 3.1) * 0.04 + Math.sin(t * 7.3) * 0.02);
    this.boardGlow.setAlpha(lerp(this.boardGlow.alpha, s.cipher.done ? 0.22 : 0, calm ? 1 : 0.06));
    this.feather.setVisible(!s.cipher.flags.includes("feather"));
    this.pageImg.setAngle(calm ? 0 : Math.sin(t * 1.7) * 0.6);

    // Al-Kindi turns to the bird, and points when a sign is given or he speaks.
    const g = this.sage;
    g.box.scaleX = 0.86 * (mv.x >= KDR_START.kindi ? 1 : -1);
    g.point = Math.max(0, g.point - dt);
    const lift = speaking?.who === "kindi" || g.point > 0;
    g.arm.setAngle(lerp(g.arm.angle, lift ? -62 + (calm ? 0 : Math.sin(t * 5) * 6) : calm ? 0 : Math.sin(t * 1.3) * 2, calm ? 1 : 1 - Math.exp(-dt * 8)));
    g.head.setAngle((speaking?.who === "kindi" ? (calm ? 0 : Math.sin(t * 7) * 3) : calm ? 0 : Math.sin(t * 1.1) * 1.5) + (mv.y < 380 ? -6 : 0));
    g.head.y = -292 + (calm ? 0 : Math.sin(t * 1.5) * 1.2);
    this.blink(g, g.head, "kindi-head", "kindi-headBlink", dt);

    // The messenger looks at the bird, and waves when speaking.
    const a = this.kid;
    a.box.scaleX = 0.74 * (mv.x >= KDR_START.messenger ? 1 : -1);
    a.arm.setAngle(speaking?.who === "messenger" ? -40 + (calm ? 0 : Math.sin(t * 6) * 10) : calm ? 0 : Math.sin(t * 1.4) * 3);
    a.head.setAngle(speaking?.who === "messenger" && !calm ? Math.sin(t * 8) * 3 : 0);
    a.hop = Math.max(0, a.hop - dt);
    a.box.y = KDR_WORLD.floor + 8 - (calm ? 0 : Math.sin((a.hop / 0.5) * Math.PI) * 10);
    this.blink(a, a.head, "messenger-head", "messenger-headBlink", dt);
  }

  // ------------------------------------------------------------------------------------------ leaving
  protected override releaseRoom(): void {
    this.strip = [];
    this.slots = new Map();
    this.tokens = new Map();
    this.drawn = "";
    this.swing = 0;
  }
}
