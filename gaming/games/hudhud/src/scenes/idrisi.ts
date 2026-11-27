// Al-Idrisi's hall on screen: the sixth room on the room engine (./room.ts). The engine carries the bird, the explorer,
// the camera, touching and the door; this file adds the hall's painting, al-Idrisi and the young helper, the sheets of
// the map lying in their places on the great table (each the page quest's own drawing, placed from the quest's own state
// each time it changes, a lifted one raised with a shadow and a gold frame, and, where the way of playing shows them, a
// broken red line on every seam that does not match), the stack of loose sheets on the tall shelf with the feather under
// it, and the lamp by the table. What happens is decided in sim/idrisiroom.ts and sim/sheets.ts.
import { IDRISI_LOOK, mapHelper as paintHelper, portrait, scholar as paintScholar } from "../art/cast";
import { glow } from "../art/kit";
import * as props from "../art/props";
import { idrisiHall, lamp as paintLamp, liftFrame, looseStack, seamMark, sheetArt, sheetShadow } from "../art/idrisi";
import { ISR_APPROACH, ISR_LAMP, ISR_LAYOUT, ISR_STACK, ISR_START, ISR_TABLE, ISR_TILE, ISR_WORLD, isrThings, placeAt, type IsrSpeaker, type IsrThing } from "../content/idrisi-room";
import type { Mood } from "../narrative/dialogue";
import type { Keeper, Quality } from "../save/save";
import { allSeams, gridOf, type Seam, type SheetsStyle } from "../sim/sheets";
import type { Mover } from "../sim/move";
import type { IdrisiHappened, IdrisiState } from "../sim/idrisiroom";
import { ADD, RoomScene, lerp, type Box, type Img, type RoomHost, type RoomThing } from "./room";
import { HELPER, SCHOLAR } from "../content/people";
import type { Standing } from "../sim/follow";

/** What the hall is showing, beyond the rules' state: whether the door is lit. */
export interface IdrisiView {
  state: IdrisiState;
  /** Every seam matches: the door is lit. */
  done: boolean;
}
export interface IdrisiSceneHost extends RoomHost {
  view(): IdrisiView;
  /** The page reads right to left: the first column is on the right, and every sheet is its own mirror image, as on the page. */
  rtl: boolean;
  speaking(): { who: IsrSpeaker; mood: Mood } | null;
  look(): { quality: Quality; reducedMotion: boolean; style: SheetsStyle; keeper: Keeper };
}

/** The most seams a map has (Challenge: three rows of five). */
const MAX_SEAMS = 40;

export class IdrisiScene extends RoomScene<IdrisiSceneHost> {
  private sage!: { box: Box; arm: Img; head: Img; blink: number; point: number };
  private kid!: { box: Box; head: Img; arm: Img; blink: number; hop: number };
  /** One picture for each place on the table; its texture is the sheet that lies there now. */
  private places: { img: Img; x: number; y: number; k: number; dx: number; dy: number; lift: number }[] = [];
  private shadow!: Img;
  private frame!: Img;
  private seams: Img[] = [];
  private lampImg!: Img;
  private lampGlow!: Img;
  private flare = 0;
  private tableGlow!: Img;
  private stackImg!: Img;
  private feather!: Img;
  private drawn = "";
  private list: IsrThing[] = [];

  constructor() {
    super("idrisi", ISR_LAYOUT);
  }

  protected things(): readonly RoomThing[] {
    return this.list;
  }
  protected lit(): boolean {
    return this.host.view().done;
  }
  /** Where the room's people stand: the explorer stops short of them (sim/follow.ts). */
  protected override people(): readonly Standing[] {
    return [{ x: ISR_START.idrisi, figure: SCHOLAR }, { x: ISR_START.helper, figure: HELPER }];
  }
  protected override approach(t: RoomThing): number {
    return ISR_APPROACH[(t as IsrThing).kind];
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
    const s = v.state.sheets;
    const rtl = this.host.rtl;
    this.list = isrThings(s.style, rtl);
    const ts = this.q.texture;
    const T = this.tex.bind(this);
    this.layers();
    const m = this.main;
    this.wide("idrisi-hall", () => idrisiHall(ts));
    this.putWide(m, "idrisi-hall", 0, 0, 0);
    T("glow", () => glow(256, ts));
    // A soft light over the table once the map is in order.
    this.tableGlow = this.put(m, "glow", ISR_TABLE.cx, (ISR_TABLE.back + ISR_TABLE.front) / 2).setBlendMode(ADD).setScale(4 / ts, 2 / ts).setAlpha(0).setTint(0xfff1c4);
    this.buildDoor(m);

    // The sheets: a texture for each sheet of this way of playing's map, and a picture for each place on the table.
    for (const sh of s.sheets) T(`sheet-${s.style}-${sh.id}`, () => sheetArt(ts, sh));
    T("sheet-shadow", () => sheetShadow(ts));
    T("lift-frame", () => liftFrame(ts));
    T("seam-upright", () => seamMark(ts, true));
    T("seam-lying", () => seamMark(ts, false));
    this.shadow = this.put(m, "sheet-shadow", 0, 0).setVisible(false);
    this.places = s.grid.map((_, p) => {
      const at = placeAt(p, s.rows, s.cols, rtl);
      // On a right to left page every sheet is its own mirror image, as on the page, so that the lines still meet across every seam.
      const img = this.put(m, `sheet-${s.style}-${s.grid[p]!}`, at.x, at.y).setScale(at.k / ts).setFlipX(rtl);
      return { img, x: at.x, y: at.y, k: at.k, dx: 0, dy: 0, lift: 0 };
    });
    this.frame = this.put(m, "lift-frame", 0, 0).setVisible(false);
    for (let i = 0; i < MAX_SEAMS; i++) this.seams.push(this.put(m, "seam-upright", 0, 0).setVisible(false));

    // The lamp on its stand, with its light.
    this.lampGlow = this.put(m, "glow", ISR_LAMP.x + 26, ISR_LAMP.y - 24).setBlendMode(ADD).setScale(1.1 / ts).setAlpha(0.35).setTint(0xffd08a);
    this.lampImg = this.put(m, T("lamp", () => paintLamp(ts)), ISR_LAMP.x, ISR_LAMP.y + 32, 0.5, 1);
    // The stack of loose sheets on the tall shelf, and the feather peeking from under it until it is found.
    this.feather = this.put(m, T("feather", () => props.feather(ts)), ISR_STACK.x + 40, ISR_STACK.y + 22).setAngle(80).setScale(0.55 / ts);
    this.stackImg = this.put(m, T("loose-stack", () => looseStack(ts)), ISR_STACK.x, ISR_STACK.y + 30, 0.5, 1);
    this.buildRing(m);

    this.buildCast(m, ts, look.keeper);
    this.buildSparks(m);
  }
  protected override ready(): void {
    this.placeSheets();
  }

  private buildCast(m: Box, ts: number, look: Keeper): void {
    const T = this.tex.bind(this);
    const urls: Record<string, string> = {};
    // Al-Idrisi, as the game imagines him: the scholar's cut-out in the colours of a bright hall. Not a likeness.
    const ia = paintScholar(ts, IDRISI_LOOK);
    for (const [k, p] of Object.entries(ia)) T(`idrisi-${k}`, () => p);
    const sageBox = this.layer(m).setPosition(ISR_START.idrisi, ISR_WORLD.floor).setScale(0.86);
    this.put(sageBox, "idrisi-body", 0, 2, 0.5, 1);
    const sArm = this.put(sageBox, "idrisi-arm", 62, -236, 0.5, 0.05);
    const sHead = this.put(sageBox, "idrisi-head", 4, -292, 0.5, 0.58);
    this.sage = { box: sageBox, arm: sArm, head: sHead, blink: 3, point: 0 };
    urls.idrisi = portrait(1, { back: ia.body, head: ia.head }, "#2f8a7a").canvas.toDataURL("image/png");

    // The young helper, an invented person, by the door.
    const ha = paintHelper(ts);
    for (const [k, p] of Object.entries(ha)) T(`helper-${k}`, () => p);
    const cBox = this.layer(m).setPosition(ISR_START.helper, ISR_WORLD.floor + 8).setScale(0.74);
    this.put(cBox, "helper-leg", -14, -68, 0.5, 0);
    this.put(cBox, "helper-leg", 14, -68, 0.5, 0);
    this.put(cBox, "helper-body", 0, -180, 0.5, 0);
    const cArm = this.put(cBox, "helper-arm", 18, -170, 0.5, 0.06);
    const cHead = this.put(cBox, "helper-head", 2, -212, 0.5, 0.54);
    this.kid = { box: cBox, head: cHead, arm: cArm, blink: 1.4, hop: 0 };
    urls.helper = portrait(1, { back: ha.body, head: ha.head }, "#1d7f86").canvas.toDataURL("image/png");

    this.buildKeeper(m, look, urls);
    this.buildBird(m, urls);
    this.host.portraits(urls);
  }

  // ------------------------------------------------------------------------------------------ the table
  /** Where the broken red line of a seam that does not match lies: between two places, or along the map's outer edge. */
  private seamAt(sm: Seam, rows: number, cols: number): { x: number; y: number; upright: boolean; k: number } {
    const rtl = this.host.rtl;
    const a = placeAt(sm.a, rows, cols, rtl);
    if (sm.b !== null) {
      const b = placeAt(sm.b, rows, cols, rtl);
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, upright: sm.across === "row", k: (a.k + b.k) / 2 };
    }
    const half = (ISR_TILE * a.k) / 2 + 7;
    // The sheet's east edge is on its right, or on its left when the page reads right to left and the sheet is mirrored.
    const east = rtl ? -1 : 1;
    if (sm.side === "n") return { x: a.x, y: a.y - half, upright: false, k: a.k };
    if (sm.side === "s") return { x: a.x, y: a.y + half, upright: false, k: a.k };
    if (sm.side === "e") return { x: a.x + east * half, y: a.y, upright: true, k: a.k };
    return { x: a.x - east * half, y: a.y, upright: true, k: a.k };
  }
  /** Puts every sheet where the rules say it lies, raises the lifted one, and marks the seams that do not match where the way of playing shows them. */
  private placeSheets(): void {
    const v = this.host.view();
    const s = v.state.sheets;
    const key = JSON.stringify([s.grid, v.state.lifted, s.done]);
    if (key === this.drawn) return;
    this.drawn = key;
    s.grid.forEach((id, p) => this.places[p]!.img.setTexture(`sheet-${s.style}-${id}`));
    // The lifted sheet is drawn over the other sheets, its shadow just under it, and the gold frame just over it; the
    // seams' marks, the lamp, the cast and the ring stay over them all.
    const up = v.state.lifted !== null ? this.places[v.state.lifted] : undefined;
    if (up) {
      this.main.moveTo(up.img, this.main.getIndex(this.frame) - 1);
      this.main.moveTo(this.shadow, this.main.getIndex(up.img) - 1);
    }
    const ts = this.q.texture;
    const showSeams = s.style !== "challenge" && !s.done;
    const bad = showSeams ? allSeams(gridOf(s)).filter((x) => !x.match) : [];
    this.seams.forEach((img, i) => {
      const sm = bad[i];
      img.setVisible(!!sm);
      if (!sm) return;
      const at = this.seamAt(sm, s.rows, s.cols);
      img.setTexture(at.upright ? "seam-upright" : "seam-lying").setPosition(at.x, at.y).setScale(at.k / ts);
    });
  }
  /** What the table shows now, for the browser checks: the sheet in each place, which place is raised, how many seams are marked, the feather. */
  shown(): { grid: number[]; lifted: number | null; seams: number; feather: boolean; agree: boolean } {
    const v = this.host.view();
    const s = v.state.sheets;
    const grid = this.places.map((p) => Number(String(p.img.texture.key).split("-").pop()));
    const raised = this.places.findIndex((p) => p.lift > 0.5);
    const lifted = this.frame.visible && raised >= 0 ? raised : null;
    const seams = this.seams.filter((x) => x.visible).length;
    const want = s.style !== "challenge" && !s.done ? allSeams(gridOf(s)).filter((x) => !x.match).length : 0;
    const agree = grid.join() === s.grid.join() && lifted === v.state.lifted && seams === want;
    return { grid, lifted, seams, feather: this.feather.visible, agree };
  }

  // ------------------------------------------------------------------------------------------ from the rules
  /** Things that happened in the rules, to be shown. */
  happened(list: IdrisiHappened[]): void {
    const calm = this.host.look().reducedMotion;
    for (const h of list) {
      if (h.type === "exchange") {
        this.placeSheets();
        // Each of the two sheets slides from where it lay into its new place.
        const a = this.places[h.a]!;
        const b = this.places[h.b]!;
        if (!calm) {
          (a.dx = b.x - a.x), (a.dy = b.y - a.y);
          (b.dx = a.x - b.x), (b.dy = a.y - b.y);
        }
        this.burst({ x: a.x, y: a.y }, 4);
        this.burst({ x: b.x, y: b.y }, 4);
        this.sage.point = 1.2;
      } else if (h.type === "check") this.flare = 1;
      else if (h.type === "opened") this.burst({ x: ISR_TABLE.cx, y: (ISR_TABLE.back + ISR_TABLE.front) / 2 }, 14);
      else if (h.type === "feather") this.burst({ x: ISR_STACK.x + 40, y: ISR_STACK.y + 20 }, 10);
      else if (h.type === "talk" && h.script.startsWith("helper")) this.kid.hop = 0.5;
    }
  }

  protected override animateRoom(dt: number, mv: Mover, calm: boolean): void {
    const v = this.host.view();
    const s = v.state;
    const t = this.t;
    const speaking = this.host.speaking();
    this.placeSheets();
    const ts = this.q.texture;

    // The sheets: a lifted one rises and casts a shadow; exchanged ones slide home.
    const ease = calm ? 1 : 1 - Math.exp(-dt * 12);
    this.places.forEach((pl, p) => {
      const up = s.lifted === p ? 1 : 0;
      pl.lift = calm ? up : lerp(pl.lift, up, ease);
      pl.dx = calm ? 0 : lerp(pl.dx, 0, 1 - Math.exp(-dt * 10));
      pl.dy = calm ? 0 : lerp(pl.dy, 0, 1 - Math.exp(-dt * 10));
      if (Math.abs(pl.dx) < 0.5) pl.dx = 0;
      if (Math.abs(pl.dy) < 0.5) pl.dy = 0;
      pl.img.setPosition(pl.x + pl.dx, pl.y + pl.dy - pl.lift * 12).setScale(((1 + pl.lift * 0.06) * pl.k) / ts);
    });
    const lifted = s.lifted !== null ? this.places[s.lifted] : undefined;
    this.shadow.setVisible(!!lifted);
    this.frame.setVisible(!!lifted);
    if (lifted) {
      this.shadow.setPosition(lifted.x + 6, lifted.y + 8).setScale(lifted.k / ts).setAlpha(lifted.lift);
      this.frame.setPosition(lifted.img.x, lifted.img.y).setScale(((1 + lifted.lift * 0.06) * lifted.k) / ts);
    }

    this.flare = Math.max(0, this.flare - dt);
    this.lampGlow.setAlpha(calm ? (this.flare > 0 ? 0.7 : 0.35) : 0.33 + Math.sin(t * 3.1) * 0.03 + this.flare * 0.4);
    this.lampImg.setScale((1 + (calm ? 0 : this.flare * 0.08)) / ts);
    this.tableGlow.setAlpha(lerp(this.tableGlow.alpha, s.sheets.done ? 0.2 : 0, calm ? 1 : 0.06));
    this.feather.setVisible(!s.sheets.flags.includes("feather"));
    this.stackImg.setAngle(calm ? 0 : Math.sin(t * 1.7) * 0.6);

    // Al-Idrisi turns to the bird, and points when two sheets are exchanged or he speaks.
    const g = this.sage;
    g.box.scaleX = 0.86 * (mv.x >= ISR_START.idrisi ? 1 : -1);
    g.point = Math.max(0, g.point - dt);
    const raise = speaking?.who === "idrisi" || g.point > 0;
    g.arm.setAngle(lerp(g.arm.angle, raise ? -62 + (calm ? 0 : Math.sin(t * 5) * 6) : calm ? 0 : Math.sin(t * 1.3) * 2, calm ? 1 : 1 - Math.exp(-dt * 8)));
    g.head.setAngle((speaking?.who === "idrisi" ? (calm ? 0 : Math.sin(t * 7) * 3) : calm ? 0 : Math.sin(t * 1.1) * 1.5) + (mv.y < 380 ? -6 : 0));
    g.head.y = -292 + (calm ? 0 : Math.sin(t * 1.5) * 1.2);
    this.blink(g, g.head, "idrisi-head", "idrisi-headBlink", dt);

    // The helper looks at the bird, and waves when speaking.
    const a = this.kid;
    a.box.scaleX = 0.74 * (mv.x >= ISR_START.helper ? 1 : -1);
    a.arm.setAngle(speaking?.who === "helper" ? -40 + (calm ? 0 : Math.sin(t * 6) * 10) : calm ? 0 : Math.sin(t * 1.4) * 3);
    a.head.setAngle(speaking?.who === "helper" && !calm ? Math.sin(t * 8) * 3 : 0);
    a.hop = Math.max(0, a.hop - dt);
    a.box.y = ISR_WORLD.floor + 8 - (calm ? 0 : Math.sin((a.hop / 0.5) * Math.PI) * 10);
    this.blink(a, a.head, "helper-head", "helper-headBlink", dt);
  }
  // ------------------------------------------------------------------------------------------ leaving
  protected override releaseRoom(): void {
    this.places = [];
    this.seams = [];
    this.drawn = "";
    this.flare = 0;
  }
}
