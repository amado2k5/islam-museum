// Al-Jahiz's room on screen: the eleventh room on the room engine (./room.ts). The engine carries the bird, the explorer,
// the camera, touching and the door; this file adds the room's painting, al-Jahiz and the girl who carries the cards, the
// trays of the way of playing side by side with their signs, the bell, the basket of spare cards with the feather in it,
// every card where the sorting says it stands (on the bench in its own place, in its tray after the cards before it
// there, or in Hudhud's beak), and the frame that shows which card, sign or bell the bird is near enough to touch. What
// happens is decided in sim/sortroom.ts (the shared sorting room, made for the coffee room) and sim/sort.ts (the quest's
// rules). Nothing here writes text.
import { cardGirl as paintGirl, jahiz as paintJahiz, portrait } from "../art/cast";
import { bellArt, focusArt } from "../art/coffee-room";
import { basketArt, cardArt, jahizRoom, signArt, trayArt } from "../art/jahiz-room";
import { glow } from "../art/kit";
import * as props from "../art/props";
import { JZR_APPROACH, JZR_BASKET, JZR_BELL, JZR_CARD, JZR_START, JZR_TRAYS, JZR_WINDOW, JZR_WORLD, jzrLayout, jzrRoom, jzrThings, trayBox, type JzrThing } from "../content/jahiz-room";
import { HELPER, SCHOLAR } from "../content/people";
import type { Keeper } from "../save/save";
import type { Standing } from "../sim/follow";
import type { Mover } from "../sim/move";
import { cardPlaces, type SortRoomHappened } from "../sim/sortroom";
import type { SortSceneHost } from "../ui/sortroom";
import { ADD, RoomScene, lerp, type Box, type Img, type RoomThing } from "./room";

export class JahizScene extends RoomScene<SortSceneHost> {
  private sage!: { box: Box; arm: Img; head: Img; blink: number; point: number };
  private kid!: { box: Box; head: Img; arm: Img; blink: number; hop: number };
  /** One picture for every card of the way of playing, by card. */
  private cards = new Map<string, Img>();
  private carried!: Img;
  private focus!: Img;
  private feather!: Img;
  private bellImg!: Img;
  private bellRing = 0;

  constructor() {
    // The trays, and so the perches, are those of the way of playing: the room is laid out again when it is built.
    super("jahiz", jzrLayout(5));
  }

  /** The room's things now: they move as the cards are placed (content/jahiz-room.ts jzrThings). */
  protected things(): readonly RoomThing[] {
    return jzrThings(this.host.state(), this.host.rtl);
  }
  protected lit(): boolean {
    return this.host.state().sort.done;
  }
  protected override approach(t: RoomThing): number {
    return JZR_APPROACH[(t as JzrThing).kind];
  }
  protected override people(): readonly Standing[] {
    return [{ x: JZR_START.jahiz, figure: SCHOLAR }, { x: JZR_START.girl, figure: HELPER }];
  }
  protected override tap(x: number, y: number): void {
    // A press on the picture flies the bird to the thing pressed, and touches it: the nearest within its reach.
    if (this.host.frozen()) return;
    const hit = [...this.things()].filter((t) => Math.hypot(t.x - x, t.y - y) < Math.max(30, t.reach)).sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y))[0];
    if (hit) this.goTo(hit.id);
  }

  // ------------------------------------------------------------------------------------------ building
  protected build(look: { keeper: Keeper }): void {
    const s = this.host.state();
    const rtl = this.host.rtl;
    const ts = this.q.texture;
    const T = this.tex.bind(this);
    const groups = s.sort.groups.length;
    this.layout.room = jzrRoom(groups);
    this.layers();
    const m = this.main;
    this.wide("jahiz-room", () => jahizRoom(ts));
    this.putWide(m, "jahiz-room", 0, 0, 0);
    T("glow", () => glow(256, ts));
    // The morning light from the window, and its brightness on the floor.
    this.put(m, "glow", JZR_WINDOW.x + JZR_WINDOW.w / 2, JZR_WINDOW.y + JZR_WINDOW.h * 0.55).setBlendMode(ADD).setScale(1.5 / ts).setAlpha(0.3).setTint(0xfff2c8);
    this.put(m, "glow", 480, JZR_WORLD.floor + 30).setBlendMode(ADD).setScale(3 / ts, 0.9 / ts).setAlpha(0.3).setTint(0xffe2a0);
    this.buildDoor(m);

    // The trays of the way of playing, side by side at the same height, each with its sign on top.
    for (let g = 0; g < groups; g++) this.put(m, T("tray", () => trayArt(ts)), trayBox(groups, g, rtl).x - 12, JZR_TRAYS.top - 2, 0, 0);
    for (const t of jzrThings(s, rtl)) if (t.kind === "group") this.put(m, T(`sign-${t.index}`, () => signArt(ts, t.index!)), t.x, t.y);
    // The bell, and the basket of spare cards on the lower shelf with the feather peeping from it.
    this.bellImg = this.put(m, T("bell", () => bellArt(ts)), JZR_BELL.x, JZR_BELL.y + 32, 0.5, 1);
    this.feather = this.put(m, T("feather", () => props.feather(ts)), JZR_BASKET.x + 20, JZR_BASKET.y - 28).setAngle(24).setScale(0.55 / ts);
    this.put(m, T("basket", () => basketArt(ts)), JZR_BASKET.x, JZR_BASKET.y + 28, 0.5, 1);
    // Every card of the way of playing, with its number as dots; the rules say where each stands.
    s.sort.items.forEach((item, i) => this.cards.set(item, this.put(m, T(`card-${item}-${i + 1}`, () => cardArt(ts, item, i + 1)), 0, 0, 0.5, 38 / 102).setScale(JZR_CARD.scale / ts)));
    this.buildRing(m);

    this.buildCast(m, ts, look.keeper);
    // The card in Hudhud's beak, and the frame round what is within reach, over everyone.
    const over = this.layer(m);
    this.carried = this.put(over, `card-${s.sort.items[0]}-1`, 0, 0).setScale(0.5 / ts).setVisible(false);
    this.focus = this.put(over, T("focus", () => focusArt(ts)), 0, 0).setVisible(false);
    this.buildSparks(m);
  }
  protected override ready(): void {
    this.placeCards(true);
  }

  private buildCast(m: Box, ts: number, look: Keeper): void {
    const T = this.tex.bind(this);
    const urls: Record<string, string> = {};
    // Al-Jahiz, as the game imagines a scholar of his time: the scholar's cut-out in a sand turban and a deep blue robe. Not a likeness.
    const ja = paintJahiz(ts);
    for (const [key, p] of Object.entries(ja)) T(`jahiz-${key}`, () => p);
    const sageBox = this.layer(m).setPosition(JZR_START.jahiz, JZR_WORLD.floor).setScale(0.86);
    this.put(sageBox, "jahiz-body", 0, 2, 0.5, 1);
    const sArm = this.put(sageBox, "jahiz-arm", 62, -236, 0.5, 0.05);
    const sHead = this.put(sageBox, "jahiz-head", 4, -292, 0.5, 0.58);
    this.sage = { box: sageBox, arm: sArm, head: sHead, blink: 3, point: 0 };
    urls.voice = portrait(1, { back: ja.body, head: ja.head }, "#2f4a7a").canvas.toDataURL("image/png");

    // The girl who carries the cards, an invented person, between the window and al-Jahiz.
    const ga = paintGirl(ts);
    for (const [key, p] of Object.entries(ga)) T(`girl-${key}`, () => p);
    const gBox = this.layer(m).setPosition(JZR_START.girl, JZR_WORLD.floor + 8).setScale(0.74);
    this.put(gBox, "girl-leg", -14, -68, 0.5, 0);
    this.put(gBox, "girl-leg", 14, -68, 0.5, 0);
    this.put(gBox, "girl-body", 0, -180, 0.5, 0);
    const gArm = this.put(gBox, "girl-arm", 18, -170, 0.5, 0.06);
    const gHead = this.put(gBox, "girl-head", 2, -212, 0.5, 0.54);
    this.kid = { box: gBox, head: gHead, arm: gArm, blink: 1.4, hop: 0 };
    urls.kid = portrait(1, { back: ga.body, head: ga.head }, "#1d7f86").canvas.toDataURL("image/png");

    this.buildKeeper(m, look, urls);
    this.buildBird(m, urls);
    this.host.portraits(urls);
  }

  // ------------------------------------------------------------------------------------------ the cards
  /** Puts every card where the rules say it stands (on the bench, in its tray, or hidden while it is in the beak). */
  private placeCards(atOnce: boolean): void {
    const s = this.host.state();
    const calm = this.host.look().reducedMotion;
    const spots = new Map(jzrThings(s, this.host.rtl).filter((t) => t.kind === "card").map((t) => [t.item!, t]));
    for (const p of cardPlaces(s)) {
      const img = this.cards.get(p.item);
      const at = spots.get(p.item);
      if (!img || !at) continue;
      img.setVisible(!p.carried);
      if (atOnce || calm) img.setPosition(at.x, at.y);
      else img.setPosition(lerp(img.x, at.x, 0.3), lerp(img.y, at.y, 0.3));
    }
    if (s.carrying) this.carried.setTexture(`card-${s.carrying}-${s.sort.items.indexOf(s.carrying) + 1}`);
  }
  /** What the room shows now, for the browser checks: where each card is drawn (bench, a tray by its number, or the beak), the thing framed as within reach, the feather, and whether that is what the rules say. */
  shown(): { cards: Record<string, string>; focus: string | null; feather: boolean; agree: boolean } {
    const s = this.host.state();
    const rtl = this.host.rtl;
    const things = jzrThings(s, rtl);
    const cards: Record<string, string> = {};
    let agree = true;
    for (const p of cardPlaces(s)) {
      const img = this.cards.get(p.item)!;
      const at = things.find((t) => t.id === `card-${p.item}`)!;
      if (p.carried) {
        cards[p.item] = this.carried.visible && this.carried.texture.key === `card-${p.item}-${p.index + 1}` ? "beak" : "lost";
        agree &&= cards[p.item] === "beak" && !img.visible;
        continue;
      }
      const there = img.visible && Math.abs(img.x - at.x) < 2 && Math.abs(img.y - at.y) < 2;
      cards[p.item] = !there ? "moving" : p.group === null ? "bench" : `tray-${s.sort.groups.indexOf(p.group) + 1}`;
      agree &&= there;
    }
    const near = this.nearNow();
    return { cards, focus: this.focus.visible ? near : null, feather: this.feather.visible, agree };
  }

  // ------------------------------------------------------------------------------------------ from the rules
  /** Things that happened in the rules, to be shown. */
  happened(list: SortRoomHappened[]): void {
    for (const h of list) {
      if (h.type === "pick") this.burst({ x: this.mover.x, y: this.mover.y - 50 }, 4);
      else if (h.type === "place") {
        const at = jzrThings(this.host.state(), this.host.rtl).find((t) => t.id === `card-${h.item}`);
        if (at) this.burst(at, 6);
        this.sage.point = 1.2;
      } else if (h.type === "show") {
        this.bellRing = 0.8;
        this.burst({ x: JZR_BELL.x, y: JZR_BELL.y - 10 }, 6);
      } else if (h.type === "feather") this.burst({ x: JZR_BASKET.x + 20, y: JZR_BASKET.y - 28 }, 10);
      else if (h.type === "talk" && h.script.startsWith("kid")) this.kid.hop = 0.5;
    }
  }
  /** The cards are sorted. */
  finished(): void {
    this.placeCards(true);
    for (const img of this.cards.values()) this.burst({ x: img.x, y: img.y }, 3);
  }

  protected override animateRoom(dt: number, mv: Mover, calm: boolean): void {
    const s = this.host.state();
    const t = this.t;
    const speaking = this.host.speaking();
    const ts = this.q.texture;
    this.placeCards(false);

    // The card in Hudhud's beak.
    this.carried.setVisible(s.carrying !== null);
    if (s.carrying) {
      this.carried.setPosition(mv.x + mv.facing * 44, mv.y - 60 + (calm ? 0 : Math.sin(t * 6) * 2));
      this.carried.scaleX = (mv.facing * 0.5) / ts;
    }
    // The frame round the card, sign or bell within reach.
    const near = this.nearNow();
    const thing = near && near !== "door" ? this.things().find((k) => k.id === near) : undefined;
    const framed = thing && (thing.kind === "card" || thing.kind === "group" || thing.kind === "bell" || thing.kind === "rest");
    this.focus.setVisible(!!framed);
    if (framed) this.focus.setPosition(thing.x, thing.y + 6).setScale((calm ? 0.9 : 0.9 + Math.sin(t * 5) * 0.03) / ts);
    this.feather.setVisible(!s.sort.flags.includes("feather"));
    // The bell swings a little when it is rung.
    this.bellRing = Math.max(0, this.bellRing - dt);
    this.bellImg.setAngle(calm ? 0 : Math.sin(this.bellRing * 30) * 14 * this.bellRing);

    // Al-Jahiz turns to the bird, and points when a card is put in a tray or he speaks.
    const g = this.sage;
    g.box.scaleX = 0.86 * (mv.x >= JZR_START.jahiz ? 1 : -1);
    g.point = Math.max(0, g.point - dt);
    const raise = speaking?.who === "voice" || g.point > 0;
    g.arm.setAngle(lerp(g.arm.angle, raise ? -62 + (calm ? 0 : Math.sin(t * 5) * 6) : calm ? 0 : Math.sin(t * 1.3) * 2, calm ? 1 : 1 - Math.exp(-dt * 8)));
    g.head.setAngle((speaking?.who === "voice" ? (calm ? 0 : Math.sin(t * 7) * 3) : calm ? 0 : Math.sin(t * 1.1) * 1.5) + (mv.y < 380 ? -6 : 0));
    g.head.y = -292 + (calm ? 0 : Math.sin(t * 1.5) * 1.2);
    this.blink(g, g.head, "jahiz-head", "jahiz-headBlink", dt);

    // The girl looks at the bird, and waves when speaking.
    const a = this.kid;
    a.box.scaleX = 0.74 * (mv.x >= JZR_START.girl ? 1 : -1);
    a.arm.setAngle(speaking?.who === "kid" ? -40 + (calm ? 0 : Math.sin(t * 6) * 10) : calm ? 0 : Math.sin(t * 1.4) * 3);
    a.head.setAngle(speaking?.who === "kid" && !calm ? Math.sin(t * 8) * 3 : 0);
    a.hop = Math.max(0, a.hop - dt);
    a.box.y = JZR_WORLD.floor + 8 - (calm ? 0 : Math.sin((a.hop / 0.5) * Math.PI) * 10);
    this.blink(a, a.head, "girl-head", "girl-headBlink", dt);
  }
  // ------------------------------------------------------------------------------------------ leaving
  protected override releaseRoom(): void {
    this.cards.clear();
  }
}
