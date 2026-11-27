// The corridor strip: shown on a quest's page once the quest is solved, above its results. Hudhud stands at the near
// end and the lit door at the far end; walking the bird to the door moves the player on (the journey,
// content/journey.ts), as the door in the flying scene does. The same controls as the flying scene move it: the keys
// for left and right, the on-screen hold buttons and the controller's stick, all read through the one Input. A button
// under the strip does the same for a player who cannot use the walking controls.
//
// It is a picture with a sentence for a screen reader, a region that takes the focus, and a loop that runs only while
// the strip is on the page and the page is not hidden. No Phaser scene: a plain canvas drawn with the 2D context.
import { hudhud as paintHudhud, type HudhudArt } from "../art/cast";
import { DOOR_ART, corridorBack, doorArt, doorGlow, drawBird } from "../art/corridor";
import type { Painted } from "../art/kit";
import { CORRIDOR, corridorDoor, newCorridor, stepCorridor, type Corridor } from "../sim/door";
import type { Intent } from "../sim/move";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;
export interface CorridorHost {
  t(key: Key, vars?: Record<string, string | number>): string;
  rtl: boolean;
  /** The world's order (1 to 10), for the corridor's colours. */
  world: number;
  reducedMotion(): boolean;
  intent(): Intent;
  /** Makes a button hold a direction for as long as it is pressed (the Input's own). */
  bindHold(button: HTMLElement, what: "left" | "right"): void;
  /** The bird reached the door, or the button was pressed. */
  through(): void;
}
export interface CorridorStrip {
  node: HTMLElement;
  /** Where the bird stands, in the corridor's own pixels, and whether it has reached the door. */
  state(): { x: number; y: number; arrived: boolean; rtl: boolean };
  door(): { x: number; y: number; reach: number };
  focus(): void;
  stop(): void;
}

const h = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Partial<HTMLElementTagNameMap[K]> & { class?: string } = {}, ...children: Array<Node | string | null | false>): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  const { class: cls, ...rest } = props;
  if (cls) node.className = cls;
  Object.assign(node, rest);
  for (const c of children) if (c !== null && c !== false) node.append(c);
  return node;
};

export function corridorStrip(host: CorridorHost): CorridorStrip {
  const { t } = host;
  const scale = Math.min(2, Math.max(1, Math.round(window.devicePixelRatio || 1)));
  const canvas = h("canvas", { class: "corridor-art", width: CORRIDOR.w * scale, height: CORRIDOR.h * scale });
  canvas.setAttribute("role", "img");
  const ctx = canvas.getContext("2d");
  const back: Painted = corridorBack(scale, host.world, { w: CORRIDOR.w, h: CORRIDOR.h, floor: CORRIDOR.floor });
  const doorPic: Painted = doorArt(scale, true);
  const bird: HudhudArt = paintHudhud(scale);
  const told = h("p", { class: "visually-hidden" });
  told.setAttribute("aria-live", "polite");
  const left = h("button", { type: "button", textContent: "◀" });
  left.setAttribute("aria-label", t("btn_left"));
  const right = h("button", { type: "button", textContent: "▶" });
  right.setAttribute("aria-label", t("btn_right"));
  host.bindHold(left, "left");
  host.bindHold(right, "right");
  const go = h("button", { type: "button", class: "door-go", textContent: t("jn_go_door"), onclick: () => leave() });
  const region = h("div", { class: "corridor-region", tabIndex: 0 }, canvas);
  region.setAttribute("role", "region");
  region.setAttribute("aria-label", t("jn_corridor_label"));
  const node = h("section", { class: "corridor" }, region, h("div", { class: "corridor-pad" }, left, right), h("p", { class: "row" }, go), told);

  let c: Corridor = newCorridor(host.rtl);
  const doorSpot = corridorDoor(host.rtl);
  let said: "start" | "along" | "arrived" | "" = "";
  let raf = 0;
  let last = 0;
  let time = 0;
  let stopped = false;
  let left_ = false;
  const leave = () => {
    if (left_) return;
    left_ = true;
    stop();
    host.through();
  };
  const describe = () => {
    const now = c.arrived ? "arrived" : Math.abs(c.mover.x - (host.rtl ? CORRIDOR.w - CORRIDOR.start : CORRIDOR.start)) < 40 ? "start" : "along";
    if (now === said) return;
    said = now;
    const text = t(now === "arrived" ? "jn_alt_arrived" : now === "start" ? "jn_alt_start" : "jn_alt_along");
    canvas.setAttribute("aria-label", text);
    // Only the arrival is said aloud: the walk itself is not read out step by step.
    if (now === "arrived") told.textContent = text;
  };
  const draw = () => {
    if (!ctx) return;
    const calm = host.reducedMotion();
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, CORRIDOR.w, CORRIDOR.h);
    ctx.drawImage(back.canvas, 0, 0, CORRIDOR.w, CORRIDOR.h);
    const dw = DOOR_ART.w * 0.82;
    const dh = DOOR_ART.h * 0.82;
    const dx = doorSpot.x;
    // The door's light breathes, unless movement is kept still.
    doorGlow(ctx, dx, CORRIDOR.floor - dh * 0.5, 120, calm ? 0.8 : 0.72 + Math.sin(time * 2.2) * 0.2);
    ctx.drawImage(doorPic.canvas, dx - dw / 2, CORRIDOR.floor + 3 - dh, dw, dh);
    const m = c.mover;
    const walking = Math.abs(m.vx) > 30;
    const bob = walking && !calm ? Math.abs(Math.sin(time * 16)) * 5 : 0;
    drawBird(ctx, bird, m.x, m.y, m.facing, 1.3, bob, walking && !calm ? Math.sin(time * 16) * 8 : 0);
  };
  const frame = (now: number) => {
    if (stopped) return;
    if (!node.isConnected) return stop();
    raf = window.requestAnimationFrame(frame);
    // A hidden page stands still and does not catch up when it comes back.
    if (document.hidden) {
      last = 0;
      return;
    }
    const dt = last === 0 ? 0 : Math.min(0.1, (now - last) / 1000);
    last = now;
    time += dt;
    c = stepCorridor(c, host.intent(), dt);
    describe();
    draw();
    if (c.arrived) leave();
  };
  function stop(): void {
    stopped = true;
    window.cancelAnimationFrame(raf);
  }
  describe();
  draw();
  raf = window.requestAnimationFrame(frame);
  return {
    node,
    state: () => ({ x: c.mover.x, y: c.mover.y, arrived: c.arrived, rtl: host.rtl }),
    door: () => ({ ...doorSpot }),
    focus: () => region.focus({ preventScroll: false }),
    stop,
  };
}
