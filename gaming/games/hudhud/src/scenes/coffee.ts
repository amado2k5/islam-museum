// The coffee room on screen: the tenth room on the room engine (./room.ts). The engine carries the bird, the explorer,
// the camera, touching and the door; this file adds the room's painting, the keeper of the records and the child who
// tidies the cards, the shelves' signs (the three shelves side by side, on the top of the case), the bell, the box of spare cards with the feather in it, every card where the
// sorting says it stands (on the table in its own place, on its shelf after the cards before it there, or in Hudhud's
// beak), and the frame that shows which card, sign or bell the bird is near enough to touch. What happens is decided in
// sim/sortroom.ts (the shared sorting room) and sim/sort.ts (the quest's rules). Nothing here writes text.
import { archivist as paintArchivist, cardChild as paintChild, portrait } from "../art/cast";
import { bellArt, boxArt, cardArt, coffeeRoom, focusArt, signArt } from "../art/coffee-room";
import { glow } from "../art/kit";
import * as props from "../art/props";
import { CQR_APPROACH, CQR_BELL, CQR_CARD, CQR_LAYOUT, CQR_START, CQR_WINDOW, CQR_WORLD, boxSpot, cqrThings, type CqrThing } from "../content/coffee-room";
import { HELPER, SCHOLAR } from "../content/people";
import type { Keeper } from "../save/save";
import type { Standing } from "../sim/follow";
import type { Mover } from "../sim/move";
import { cardPlaces, type SortRoomHappened } from "../sim/sortroom";
import type { SortSceneHost } from "../ui/sortroom";
import { ADD, RoomScene, lerp, type Box, type Img, type RoomThing } from "./room";

export class CoffeeScene extends RoomScene<SortSceneHost> {
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
    super("coffee", CQR_LAYOUT);
  }

  /** The room's things now: they move as the cards are placed (content/coffee-room.ts cqrThings). */
  protected things(): readonly RoomThing[] {
    return cqrThings(this.host.state(), this.host.rtl);
  }
  protected lit(): boolean {
    return this.host.state().sort.done;
  }
  protected override approach(t: RoomThing): number {
    return CQR_APPROACH[(t as CqrThing).kind];
  }
  protected override people(): readonly Standing[] {
    return [{ x: CQR_START.archivist, figure: SCHOLAR }, { x: CQR_START.child, figure: HELPER }];
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
    this.layers();
    const m = this.main;
    this.wide("coffee-room", () => coffeeRoom(ts));
    this.putWide(m, "coffee-room", 0, 0, 0);
    T("glow", () => glow(256, ts));
    // The afternoon light from the window, and its warmth on the floor.
    this.put(m, "glow", CQR_WINDOW.x + CQR_WINDOW.w / 2, CQR_WINDOW.y + CQR_WINDOW.h * 0.55).setBlendMode(ADD).setScale(1.5 / ts).setAlpha(0.32).setTint(0xffd9a0);
    this.put(m, "glow", 520, CQR_WORLD.floor + 30).setBlendMode(ADD).setScale(3 / ts, 0.9 / ts).setAlpha(0.35).setTint(0xffc27a);
    this.buildDoor(m);

    // The shelves' signs, the bell, and the box of spare cards with the feather peeping from it.
    for (const t of cqrThings(s, rtl)) if (t.kind === "group") this.put(m, T(`sign-${t.index}`, () => signArt(ts, t.index!)), t.x, t.y);
    this.bellImg = this.put(m, T("bell", () => bellArt(ts)), CQR_BELL.x, CQR_BELL.y + 32, 0.5, 1);
    const box = boxSpot(rtl);
    this.feather = this.put(m, T("feather", () => props.feather(ts)), box.x + 22, box.y - 30).setAngle(24).setScale(0.55 / ts);
    this.put(m, T("box", () => boxArt(ts)), box.x, box.y + 28, 0.5, 1);
    // Every card of the way of playing, with its number as dots; the rules say where each stands.
    s.sort.items.forEach((item, i) => this.cards.set(item, this.put(m, T(`card-${item}-${i + 1}`, () => cardArt(ts, item, i + 1)), 0, 0, 0.5, 38 / 102).setScale(CQR_CARD.scale / ts)));
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
    // The keeper of the records, as the game imagines a keeper: the scholar's cut-out in a white turban and a green robe. Not a likeness of anyone.
    const ka = paintArchivist(ts);
    for (const [key, p] of Object.entries(ka)) T(`archivist-${key}`, () => p);
    const sageBox = this.layer(m).setPosition(CQR_START.archivist, CQR_WORLD.floor).setScale(0.86);
    this.put(sageBox, "archivist-body", 0, 2, 0.5, 1);
    const sArm = this.put(sageBox, "archivist-arm", 62, -236, 0.5, 0.05);
    const sHead = this.put(sageBox, "archivist-head", 4, -292, 0.5, 0.58);
    this.sage = { box: sageBox, arm: sArm, head: sHead, blink: 3, point: 0 };
    urls.voice = portrait(1, { back: ka.body, head: ka.head }, "#2f6f4a").canvas.toDataURL("image/png");

    // The child who tidies the cards, an invented person, beside the bookcase.
    const ca = paintChild(ts);
    for (const [key, p] of Object.entries(ca)) T(`child-${key}`, () => p);
    const cBox = this.layer(m).setPosition(CQR_START.child, CQR_WORLD.floor + 8).setScale(0.74);
    this.put(cBox, "child-leg", -14, -68, 0.5, 0);
    this.put(cBox, "child-leg", 14, -68, 0.5, 0);
    this.put(cBox, "child-body", 0, -180, 0.5, 0);
    const cArm = this.put(cBox, "child-arm", 18, -170, 0.5, 0.06);
    const cHead = this.put(cBox, "child-head", 2, -212, 0.5, 0.54);
    this.kid = { box: cBox, head: cHead, arm: cArm, blink: 1.4, hop: 0 };
    urls.kid = portrait(1, { back: ca.body, head: ca.head }, "#c2643a").canvas.toDataURL("image/png");

    this.buildKeeper(m, look, urls);
    this.buildBird(m, urls);
    this.host.portraits(urls);
  }

  // ------------------------------------------------------------------------------------------ the cards
  /** Puts every card where the rules say it stands (on the table, on its shelf, or hidden while it is in the beak). */
  private placeCards(atOnce: boolean): void {
    const s = this.host.state();
    const calm = this.host.look().reducedMotion;
    const spots = new Map(cqrThings(s, this.host.rtl).filter((t) => t.kind === "card").map((t) => [t.item!, t]));
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
  /** What the room shows now, for the browser checks: where each card is drawn (table, a shelf by its number, or the beak), the thing framed as within reach, the feather, and whether that is what the rules say. */
  shown(): { cards: Record<string, string>; focus: string | null; feather: boolean; agree: boolean } {
    const s = this.host.state();
    const rtl = this.host.rtl;
    const things = cqrThings(s, rtl);
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
      cards[p.item] = !there ? "moving" : p.group === null ? "table" : `shelf-${s.sort.groups.indexOf(p.group) + 1}`;
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
        const at = cqrThings(this.host.state(), this.host.rtl).find((t) => t.id === `card-${h.item}`);
        if (at) this.burst(at, 6);
        this.sage.point = 1.2;
      } else if (h.type === "show") {
        this.bellRing = 0.8;
        this.burst({ x: CQR_BELL.x, y: CQR_BELL.y - 10 }, 6);
      } else if (h.type === "feather") this.burst({ x: boxSpot(this.host.rtl).x + 22, y: boxSpot(this.host.rtl).y - 30 }, 10);
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

    // The keeper turns to the bird, and points when a card is put on a shelf or the keeper speaks.
    const g = this.sage;
    g.box.scaleX = 0.86 * (mv.x >= CQR_START.archivist ? 1 : -1);
    g.point = Math.max(0, g.point - dt);
    const raise = speaking?.who === "voice" || g.point > 0;
    g.arm.setAngle(lerp(g.arm.angle, raise ? -62 + (calm ? 0 : Math.sin(t * 5) * 6) : calm ? 0 : Math.sin(t * 1.3) * 2, calm ? 1 : 1 - Math.exp(-dt * 8)));
    g.head.setAngle((speaking?.who === "voice" ? (calm ? 0 : Math.sin(t * 7) * 3) : calm ? 0 : Math.sin(t * 1.1) * 1.5) + (mv.y < 380 ? -6 : 0));
    g.head.y = -292 + (calm ? 0 : Math.sin(t * 1.5) * 1.2);
    this.blink(g, g.head, "archivist-head", "archivist-headBlink", dt);

    // The child looks at the bird, and waves when speaking.
    const a = this.kid;
    a.box.scaleX = 0.74 * (mv.x >= CQR_START.child ? 1 : -1);
    a.arm.setAngle(speaking?.who === "kid" ? -40 + (calm ? 0 : Math.sin(t * 6) * 10) : calm ? 0 : Math.sin(t * 1.4) * 3);
    a.head.setAngle(speaking?.who === "kid" && !calm ? Math.sin(t * 8) * 3 : 0);
    a.hop = Math.max(0, a.hop - dt);
    a.box.y = CQR_WORLD.floor + 8 - (calm ? 0 : Math.sin((a.hop / 0.5) * Math.PI) * 10);
    this.blink(a, a.head, "child-head", "child-headBlink", dt);
  }
  // ------------------------------------------------------------------------------------------ leaving
  protected override releaseRoom(): void {
    this.cards.clear();
  }
}
