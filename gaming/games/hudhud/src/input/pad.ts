// A gamepad, read as plain numbers: what is held this frame and which buttons have just gone down. Pure, so that the
// layout can be tested without a controller. The page polls it on its own clock (input.ts), not the scene's, so that
// a talk can be advanced and a pause ended from the controller while the world is standing still.
//
// The layout follows the "standard" mapping browsers report for Xbox-style and PlayStation-style controllers:
// button 0 is the lower face button (A, Cross), 1 the right (B, Circle), 2 the left (X, Square), 9 Start/Options,
// 12 to 15 the directional pad. Each action's button can be changed in the settings.
export type PadAction = "fly" | "back" | "touch" | "pause";
export type PadMap = Record<PadAction, number>;
export const PAD_ACTIONS: readonly PadAction[] = ["fly", "back", "touch", "pause"];
/** Fly is also "go on" in a talk: the same button that lifts the bird moves a conversation forward. */
export const DEFAULT_PAD: PadMap = { fly: 0, back: 1, touch: 2, pause: 9 };
export const STICK_DEAD = 0.35;
export const STICK_DOWN = 0.6;

export interface PadLike {
  buttons: readonly { pressed: boolean }[];
  axes: readonly number[];
}
export interface PadRead {
  left: boolean;
  right: boolean;
  down: boolean;
  jump: boolean;
  /** Actions whose button went down since the last read. */
  pressed: PadAction[];
  /** Up or down has just been pushed (the pad or the stick): for moving among the choices of a talk. */
  step: -1 | 0 | 1;
  /** Every button's state, to find the next edge and to learn a button for remapping. */
  held: boolean[];
  /** Whether the stick was held up or down on this read, to find its next push. */
  stick: -1 | 0 | 1;
}
/** The four buttons of the directional pad always move and can be given to no action. */
export const DIRECTION_BUTTONS: readonly number[] = [12, 13, 14, 15];

export function readPad(pad: PadLike, map: PadMap, was: readonly boolean[], stickWas: -1 | 0 | 1 = 0): PadRead {
  const held = pad.buttons.map((b) => !!b?.pressed);
  const b = (i: number) => !!held[i];
  const x = pad.axes[0] ?? 0;
  const y = pad.axes[1] ?? 0;
  const pressed = PAD_ACTIONS.filter((a) => b(map[a]) && !was[map[a]]);
  const stick: -1 | 0 | 1 = y < -STICK_DOWN ? -1 : y > STICK_DOWN ? 1 : 0;
  const step: -1 | 0 | 1 = (b(12) && !was[12]) || (stick === -1 && stickWas !== -1) ? -1 : (b(13) && !was[13]) || (stick === 1 && stickWas !== 1) ? 1 : 0;
  return { left: x < -STICK_DEAD || b(14), right: x > STICK_DEAD || b(15), down: y > STICK_DOWN || b(13), jump: b(map.fly) || b(12), pressed, step, held, stick };
}
/** The first button that has just gone down, for learning a binding; null if none. */
export const firstPressed = (held: readonly boolean[], was: readonly boolean[]): number | null => {
  const i = held.findIndex((h, k) => h && !was[k] && !DIRECTION_BUTTONS.includes(k));
  return i < 0 ? null : i;
};
/** One button given to one action; the action that had it takes the other's old button, so none is left without. */
export function assignPad(map: PadMap, action: PadAction, button: number): PadMap {
  // A direction button already moves the bird; given to an action as well, one press would do two things.
  if (DIRECTION_BUTTONS.includes(button) || !Number.isInteger(button) || button < 0) return map;
  const out = { ...map };
  const other = PAD_ACTIONS.find((a) => a !== action && map[a] === button);
  if (other) out[other] = map[action];
  out[action] = button;
  return out;
}
