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
  /** Every button's state, to find the next edge and to learn a button for remapping. */
  held: boolean[];
}

export function readPad(pad: PadLike, map: PadMap, was: readonly boolean[]): PadRead {
  const held = pad.buttons.map((b) => !!b?.pressed);
  const b = (i: number) => !!held[i];
  const x = pad.axes[0] ?? 0;
  const y = pad.axes[1] ?? 0;
  const pressed = PAD_ACTIONS.filter((a) => b(map[a]) && !was[map[a]]);
  return { left: x < -STICK_DEAD || b(14), right: x > STICK_DEAD || b(15), down: y > STICK_DOWN || b(13), jump: b(map.fly) || b(12), pressed, held };
}
/** The first button that has just gone down, for learning a binding; null if none. */
export const firstPressed = (held: readonly boolean[], was: readonly boolean[]): number | null => {
  const i = held.findIndex((h, k) => h && !was[k]);
  return i < 0 ? null : i;
};
/** One button given to one action; the action that had it takes the other's old button, so none is left without. */
export function assignPad(map: PadMap, action: PadAction, button: number): PadMap {
  const out = { ...map };
  const other = PAD_ACTIONS.find((a) => a !== action && map[a] === button);
  if (other) out[other] = map[action];
  out[action] = button;
  return out;
}
