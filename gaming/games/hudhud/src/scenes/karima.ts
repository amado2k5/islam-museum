// Karima al-Marwaziyya's room on screen: the eighth room on the room engine (./room.ts). The engine carries the bird, the
// explorer, the camera, touching and the door; this file adds the room's painting, Karima and the boy who carries the
// copies, the reading stands with a copy of the page on each (every sign a cell drawn by the page quest's own code), the
// copies' marks (her seal, the others' dots), the page's broken ring round every marked slip (chosen from the quest's own
// state each time it changes), the ring and the raised cell that show which sign the bird is near enough to touch, and
// the stack of spare copies on top of the bookcase with the feather between them. What happens is decided in
// sim/karimaroom.ts and sim/collate.ts. No sacred place is drawn, and nothing here writes text.
import { copyBoy as paintBoy, karima as paintKarima, portrait } from "../art/cast";
import { glow } from "../art/kit";
import * as props from "../art/props";
import { cellArt, focusArt, karimaRoom, markArt, slipArt, stackArt, standsArt, standsBox } from "../art/karima";
import { HELPER, SCHOLAR } from "../content/people";
import { KRR_APPROACH, KRR_LAYOUT, KRR_STACK, KRR_STANDS, KRR_START, KRR_WORLD, krrRoom, krrThings, markAt, rowsOf, type KrrSpeaker, type KrrThing } from "../content/karima-room";
import type { Mood } from "../narrative/dialogue";
import type { Keeper, Quality } from "../save/save";
import { isMarked, type CollateStyle } from "../sim/collate";
import type { Standing } from "../sim/follow";
import type { KarimaHappened, KarimaState } from "../sim/karimaroom";
import type { Mover } from "../sim/move";
import { ADD, RoomScene, lerp, type Box, type Img, type RoomHost, type RoomThing } from "./room";

export interface KarimaSceneHost extends RoomHost {
  state(): KarimaState;
  /** The page reads right to left: the first place is on the right, as on the page. */
  rtl: boolean;
  speaking(): { who: KrrSpeaker; mood: Mood } | null;
  look(): { quality: Quality; reducedMotion: boolean; style: CollateStyle; keeper: Keeper };
}

export class KarimaScene extends RoomScene<KarimaSceneHost> {
  private sage!: { box: Box; arm: Img; head: Img; blink: number; point: number };
  private kid!: { box: Box; head: Img; arm: Img; blink: number; hop: number };
  /** One cell and one broken ring for every sign of every copy, by id ("sign-0-0"). */
  private cells = new Map<string, { cell: Img; slip: Img; x: number; y: number }>();
  private focusCell!: Img;
  /** The page's broken ring on the raised cell, when the sign within reach is marked. */
  private focusSlip!: Img;
  private focusRing!: Img;
  private standGlow!: Img;
  private feather!: Img;
  private stackImg!: Img;
  private drawn = "";
  private list: KrrThing[] = [];
  private n = 0;

  constructor() {
    // The engine's layout with a room of its own, so that this scene can keep only the stands of its way of playing.
    super("karima", { ...KRR_LAYOUT, room: krrRoom(3) });
  }

  protected things(): readonly RoomThing[] {
    return this.list;
  }
  protected lit(): boolean {
    const s = this.host.state();
    return s.collate.done;
  }
  protected override approach(t: RoomThing): number {
    return KRR_APPROACH[(t as KrrThing).kind];
  }
  protected override people(): readonly Standing[] {
    return [{ x: KRR_START.karima, figure: SCHOLAR }, { x: KRR_START.boy, figure: HELPER }];
  }
  protected override tap(x: number, y: number): void {
    // A press on the picture flies the bird to the thing pressed, and touches it: the nearest within its reach.
    if (this.host.frozen()) return;
    const hit = [...this.list].filter((t) => Math.hypot(t.x - x, t.y - y) < Math.max(30, t.reach)).sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y))[0];
    if (hit) this.goTo(hit.id);
  }

  // ------------------------------------------------------------------------------------------ building
  protected build(look: { keeper: Keeper }): void {
    const s = this.host.state().collate;
    const rtl = this.host.rtl;
    const copies = s.puzzle.copies.length;
    this.n = s.puzzle.copies[0]!.length;
    this.list = krrThings(s.style, rtl);
    // Only the stands of this way of playing are perches (two in Story, three in the others).
    this.layout.room.perches.splice(0, this.layout.room.perches.length, ...krrRoom(copies).perches);
    const ts = this.q.texture;
    const T = this.tex.bind(this);
    this.layers();
    const m = this.main;
    this.wide("karima-room", () => karimaRoom(ts));
    this.putWide(m, "karima-room", 0, 0, 0);
    T("glow", () => glow(256, ts));
    this.buildDoor(m);

    // The reading stands, a soft light over them once every slip is marked, the copies' marks, and the cells.
    const box = standsBox(copies);
    this.wide(`karima-stands-${copies}`, () => standsArt(ts, copies));
    this.putWide(m, `karima-stands-${copies}`, box.x, box.y, 0);
    this.standGlow = this.put(m, "glow", KRR_STANDS.cx, rowsOf(copies)[Math.floor(copies / 2)]!).setBlendMode(ADD).setScale(5 / ts, 1.8 / ts).setAlpha(0).setTint(0xfff1c4);
    s.puzzle.copies.forEach((_, copy) => {
      const at = markAt(copy, copies, this.n, rtl);
      this.put(m, T(`mark-${copy}-${copy === s.puzzle.hers ? "hers" : "dots"}`, () => markArt(ts, copy, copy === s.puzzle.hers)), at.x, at.y);
    });
    T(`slip-${this.n}`, () => slipArt(ts, this.n));
    for (const t of this.list) {
      if (t.kind !== "sign") continue;
      const sign = s.puzzle.copies[t.copy!]![t.place!]!;
      // Every other place a shade lighter, as on the page, so that the eye can run down a column from copy to copy.
      const key = T(`cell-${this.n}-${sign}-${t.place! % 2 === 0 ? "a" : "b"}`, () => cellArt(ts, sign, this.n, t.place! % 2 === 0));
      const cell = this.put(m, key, t.x, t.y);
      const slip = this.put(m, `slip-${this.n}`, t.x, t.y).setVisible(false);
      this.cells.set(t.id, { cell, slip, x: t.x, y: t.y });
    }

    // The stack of spare copies on top of the tall bookcase, with the feather between them.
    this.feather = this.put(m, T("feather", () => props.feather(ts)), KRR_STACK.x + 34, KRR_STACK.y + 16).setAngle(70).setScale(0.55 / ts);
    this.stackImg = this.put(m, T("spare-copies", () => stackArt(ts)), KRR_STACK.x, KRR_STACK.y + 30, 0.5, 1);
    this.buildRing(m);

    this.buildCast(m, ts, look.keeper);
    // The sign within reach, raised over everyone (the bird stands in front of the row it touches), with a ring of gold round it.
    const over = this.layer(m);
    T(`focus-${this.n}`, () => focusArt(ts, this.n));
    this.focusCell = this.put(over, `cell-${this.n}-${s.puzzle.copies[0]![0]}-a`, 0, 0).setVisible(false);
    this.focusSlip = this.put(over, `slip-${this.n}`, 0, 0).setVisible(false);
    this.focusRing = this.put(over, `focus-${this.n}`, 0, 0).setVisible(false);
    this.buildSparks(m);
  }
  protected override ready(): void {
    this.markSlips();
  }

  private buildCast(m: Box, ts: number, look: Keeper): void {
    const T = this.tex.bind(this);
    const urls: Record<string, string> = {};
    // Karima, as the game imagines her: a cut-out in a headscarf and a plain long dress. Not a likeness.
    const ka = paintKarima(ts);
    for (const [key, p] of Object.entries(ka)) T(`karima-${key}`, () => p);
    const sageBox = this.layer(m).setPosition(KRR_START.karima, KRR_WORLD.floor).setScale(0.86);
    this.put(sageBox, "karima-body", 0, 2, 0.5, 1);
    const sArm = this.put(sageBox, "karima-arm", 62, -236, 0.5, 0.05);
    const sHead = this.put(sageBox, "karima-head", 4, -292, 0.5, 0.58);
    this.sage = { box: sageBox, arm: sArm, head: sHead, blink: 3, point: 0 };
    urls.karima = portrait(1, { back: ka.body, head: ka.head }, "#2f6f6a").canvas.toDataURL("image/png");

    // The boy who carries the copies, an invented person, by the far end.
    const ba = paintBoy(ts);
    for (const [key, p] of Object.entries(ba)) T(`boy-${key}`, () => p);
    const bBox = this.layer(m).setPosition(KRR_START.boy, KRR_WORLD.floor + 8).setScale(0.74);
    this.put(bBox, "boy-leg", -14, -68, 0.5, 0);
    this.put(bBox, "boy-leg", 14, -68, 0.5, 0);
    this.put(bBox, "boy-body", 0, -180, 0.5, 0);
    const bArm = this.put(bBox, "boy-arm", 18, -170, 0.5, 0.06);
    const bHead = this.put(bBox, "boy-head", 2, -212, 0.5, 0.54);
    this.kid = { box: bBox, head: bHead, arm: bArm, blink: 1.4, hop: 0 };
    urls.boy = portrait(1, { back: ba.body, head: ba.head }, "#1d7f86").canvas.toDataURL("image/png");

    this.buildKeeper(m, look, urls);
    this.buildBird(m, urls);
    this.host.portraits(urls);
  }

  // ------------------------------------------------------------------------------------------ the copies
  /** Shows the page's broken ring round every marked slip, as the rules have them. */
  private markSlips(): void {
    const c = this.host.state().collate;
    const key = JSON.stringify([c.marks, c.done]);
    if (key === this.drawn) return;
    this.drawn = key;
    for (const t of this.list) if (t.kind === "sign") this.cells.get(t.id)!.slip.setVisible(isMarked(c, t.copy!, t.place!));
  }
  /** What the stands show now, for the browser checks: the signs drawn ringed as slips, the sign raised as within reach, the feather, and whether that is what the rules say. */
  shown(): { ringed: string[]; focus: string | null; focusRinged: boolean; feather: boolean; agree: boolean } {
    const c = this.host.state().collate;
    const ringed = this.list.filter((t) => t.kind === "sign" && this.cells.get(t.id)!.slip.visible).map((t) => t.id);
    const want = this.list.filter((t) => t.kind === "sign" && isMarked(c, t.copy!, t.place!)).map((t) => t.id);
    const near = this.nearNow();
    const focus = this.focusRing.visible && near?.startsWith("sign-") ? near : null;
    const focusRinged = focus !== null && this.focusSlip.visible;
    return { ringed, focus, focusRinged, feather: this.feather.visible, agree: ringed.join() === want.join() && (focus === null || focusRinged === ringed.includes(focus)) };
  }

  // ------------------------------------------------------------------------------------------ from the rules
  /** Things that happened in the rules, to be shown. */
  happened(list: KarimaHappened[]): void {
    for (const h of list) {
      if (h.type === "mark") {
        this.markSlips();
        const at = this.cells.get(`sign-${h.copy}-${h.place}`)!;
        this.burst({ x: at.x, y: at.y }, 6);
        this.sage.point = 1.2;
      } else if (h.type === "unmark") this.markSlips();
      else if (h.type === "feather") this.burst({ x: KRR_STACK.x + 34, y: KRR_STACK.y + 16 }, 10);
      else if (h.type === "talk" && h.script.startsWith("boy")) this.kid.hop = 0.5;
    }
  }
  /** Every slip is marked. */
  finished(): void {
    this.markSlips();
    this.burst({ x: KRR_STANDS.cx, y: rowsOf(this.host.state().collate.puzzle.copies.length)[0]! }, 14);
  }

  protected override animateRoom(dt: number, mv: Mover, calm: boolean): void {
    const s = this.host.state();
    const t = this.t;
    const speaking = this.host.speaking();
    const ts = this.q.texture;
    this.markSlips();

    // The sign within reach: raised over the bird, a little larger, with the gold ring round it.
    const near = this.nearNow();
    const cell = near?.startsWith("sign-") ? this.cells.get(near) : undefined;
    this.focusCell.setVisible(!!cell);
    this.focusRing.setVisible(!!cell);
    this.focusSlip.setVisible(!!cell && cell.slip.visible);
    if (cell) {
      const grow = calm ? 1.18 : 1.18 + Math.sin(t * 5) * 0.03;
      this.focusCell.setTexture(cell.cell.texture.key).setPosition(cell.x, cell.y).setScale(grow / ts);
      this.focusSlip.setPosition(cell.x, cell.y).setScale(grow / ts);
      this.focusRing.setPosition(cell.x, cell.y).setScale(grow / ts);
    }

    this.standGlow.setAlpha(lerp(this.standGlow.alpha, s.collate.done ? 0.22 : 0, calm ? 1 : 0.06));
    this.feather.setVisible(!s.collate.flags.includes("feather"));
    this.stackImg.setAngle(calm ? 0 : Math.sin(t * 1.7) * 0.6);

    // Karima turns to the bird, and points when a slip is marked or she speaks.
    const g = this.sage;
    g.box.scaleX = 0.86 * (mv.x >= KRR_START.karima ? 1 : -1);
    g.point = Math.max(0, g.point - dt);
    const raise = speaking?.who === "karima" || g.point > 0;
    g.arm.setAngle(lerp(g.arm.angle, raise ? -62 + (calm ? 0 : Math.sin(t * 5) * 6) : calm ? 0 : Math.sin(t * 1.3) * 2, calm ? 1 : 1 - Math.exp(-dt * 8)));
    g.head.setAngle((speaking?.who === "karima" ? (calm ? 0 : Math.sin(t * 7) * 3) : calm ? 0 : Math.sin(t * 1.1) * 1.5) + (mv.y < 380 ? -6 : 0));
    g.head.y = -292 + (calm ? 0 : Math.sin(t * 1.5) * 1.2);
    this.blink(g, g.head, "karima-head", "karima-headBlink", dt);

    // The boy looks at the bird, and waves when speaking.
    const a = this.kid;
    a.box.scaleX = 0.74 * (mv.x >= KRR_START.boy ? 1 : -1);
    a.arm.setAngle(speaking?.who === "boy" ? -40 + (calm ? 0 : Math.sin(t * 6) * 10) : calm ? 0 : Math.sin(t * 1.4) * 3);
    a.head.setAngle(speaking?.who === "boy" && !calm ? Math.sin(t * 8) * 3 : 0);
    a.hop = Math.max(0, a.hop - dt);
    a.box.y = KRR_WORLD.floor + 8 - (calm ? 0 : Math.sin((a.hop / 0.5) * Math.PI) * 10);
    this.blink(a, a.head, "boy-head", "boy-headBlink", dt);
  }
  // ------------------------------------------------------------------------------------------ leaving
  protected override releaseRoom(): void {
    this.cells.clear();
    this.drawn = "";
  }
}
