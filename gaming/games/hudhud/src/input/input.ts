// One intent from three kinds of hands: keyboard, the on-screen buttons (touch or mouse), and a gamepad. The rules
// see only the intent; they never know which device made it.
//
// Not here yet, and said so in the plan (docs/gaming/hudhud/accessibility.md): remapping of keys and buttons.
import type { Intent } from "../sim/move";

export type Press = "touch" | "pause" | "next" | "back";
export interface InputHost {
  /** A single press that is not held: touch a thing, pause, go on in a talk. */
  press(p: Press): void;
  /** A gamepad was plugged in or taken out. */
  pad(connected: boolean): void;
}

const LEFT = ["ArrowLeft", "KeyA"];
const RIGHT = ["ArrowRight", "KeyD"];
const JUMP = ["Space", "ArrowUp", "KeyW"];
const DOWN = ["ArrowDown", "KeyS"];
const TOUCH = ["KeyE", "Enter"];

export class Input {
  private readonly keys = new Set<string>();
  private readonly held = { left: false, right: false, jump: false };
  private padIndex: number | null = null;
  private padWas = { touch: false, pause: false, next: false };
  private readonly off: (() => void)[] = [];

  constructor(private readonly host: InputHost, private readonly target: Window = window) {
    const down = (e: KeyboardEvent) => {
      // Keys typed into a form control, or pressed on a button, belong to that control.
      const el = e.target as HTMLElement | null;
      const inControl = !!el && /^(INPUT|SELECT|TEXTAREA|BUTTON|SUMMARY|A)$/.test(el.tagName);
      if (e.code === "Escape") {
        this.host.press("pause");
        return;
      }
      if (inControl) return;
      if ([...LEFT, ...RIGHT, ...JUMP, ...DOWN].includes(e.code)) e.preventDefault();
      if (e.repeat) return;
      this.keys.add(e.code);
      if (TOUCH.includes(e.code)) this.host.press("touch");
    };
    const up = (e: KeyboardEvent) => this.keys.delete(e.code);
    const blur = () => {
      this.keys.clear();
      this.held.left = this.held.right = this.held.jump = false;
    };
    const padOn = (e: GamepadEvent) => {
      this.padIndex = e.gamepad.index;
      this.host.pad(true);
    };
    const padOff = (e: GamepadEvent) => {
      if (this.padIndex !== e.gamepad.index) return;
      this.padIndex = null;
      this.host.pad(false);
    };
    target.addEventListener("keydown", down);
    target.addEventListener("keyup", up);
    target.addEventListener("blur", blur);
    target.addEventListener("gamepadconnected", padOn);
    target.addEventListener("gamepaddisconnected", padOff);
    this.off.push(
      () => target.removeEventListener("keydown", down),
      () => target.removeEventListener("keyup", up),
      () => target.removeEventListener("blur", blur),
      () => target.removeEventListener("gamepadconnected", padOn),
      () => target.removeEventListener("gamepaddisconnected", padOff),
    );
  }

  /** Makes a button on the page hold a direction or the jump for as long as it is pressed. */
  bindHold(button: HTMLElement, what: "left" | "right" | "jump"): void {
    const set = (on: boolean) => (e: Event) => {
      e.preventDefault();
      this.held[what] = on;
    };
    const on = set(true);
    const offFn = set(false);
    button.addEventListener("pointerdown", on);
    for (const ev of ["pointerup", "pointercancel", "pointerleave"]) button.addEventListener(ev, offFn);
    // A keyboard user on the button: Space or Enter holds it too.
    const kd = (e: KeyboardEvent) => (e.code === "Space" || e.code === "Enter") && (this.held[what] = true);
    const ku = (e: KeyboardEvent) => (e.code === "Space" || e.code === "Enter") && (this.held[what] = false);
    button.addEventListener("keydown", kd);
    button.addEventListener("keyup", ku);
    button.addEventListener("blur", offFn);
  }

  /** What the player wants this frame. Reads the gamepad, and reports its single presses. */
  intent(): Intent {
    const k = (codes: string[]) => codes.some((c) => this.keys.has(c));
    let left = k(LEFT) || this.held.left;
    let right = k(RIGHT) || this.held.right;
    let jump = k(JUMP) || this.held.jump;
    let down = k(DOWN);
    const pad = this.padIndex === null ? null : (navigator.getGamepads?.()[this.padIndex] ?? null);
    if (pad) {
      const b = (i: number) => !!pad.buttons[i]?.pressed;
      const x = pad.axes[0] ?? 0;
      const y = pad.axes[1] ?? 0;
      left ||= x < -0.35 || b(14);
      right ||= x > 0.35 || b(15);
      down ||= y > 0.6 || b(13);
      jump ||= b(0) || b(12);
      const now = { touch: b(2), pause: b(9), next: b(1) };
      if (now.touch && !this.padWas.touch) this.host.press("touch");
      if (now.pause && !this.padWas.pause) this.host.press("pause");
      if (now.next && !this.padWas.next) this.host.press("back");
      this.padWas = now;
    }
    return { dir: left === right ? 0 : left ? -1 : 1, jump, down };
  }

  dispose(): void {
    for (const f of this.off) f();
    this.keys.clear();
  }
}
