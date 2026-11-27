// A game controller, read as the keys a game already understands. Each game says which key a button or a stick's
// direction stands for; this turns the controller's state into key presses and releases, repeating a key while it is
// held, as a keyboard does. Nothing new is learnt by a game: whatever a key does, the controller does.
//
// The arithmetic is pure (`padEvents`), so it is tested without a controller; `startGamepad` reads the browser's
// controllers once a frame and sends the keys to the element the game names. Buttons follow the browser's "standard"
// layout: 0 A, 1 B, 2 X, 3 Y, 4 LB, 5 RB, 8 Back, 9 Start, 12-15 the cross (up, down, left, right).

export interface PadMap {
  /** Button index to key. */
  buttons: Record<number, string>;
  /** Keys for the left stick (and the cross) pushed up, right, down and left. */
  move: [string, string, string, string];
  /** Keys for the right stick pushed up, right, down and left. Optional. */
  look?: [string, string, string, string];
  /** How often a held key is sent again, in milliseconds. */
  repeatMs?: number;
}

export interface PadState {
  buttons: boolean[];
  axes: number[];
}

export interface KeyEvent {
  type: "down" | "up";
  key: string;
  repeat: boolean;
}

const DEAD = 0.5;
const CROSS: Record<number, number> = { 12: 0, 15: 1, 13: 2, 14: 3 };

/** Which keys a controller's state holds down. */
export function keysHeld(s: PadState, map: PadMap): Set<string> {
  const held = new Set<string>();
  s.buttons.forEach((on, i) => {
    if (!on) return;
    if (i in CROSS) held.add(map.move[CROSS[i]!]);
    else if (map.buttons[i]) held.add(map.buttons[i]);
  });
  const stick = (x: number | undefined, y: number | undefined, keys: [string, string, string, string]) => {
    if (y !== undefined && y < -DEAD) held.add(keys[0]);
    if (x !== undefined && x > DEAD) held.add(keys[1]);
    if (y !== undefined && y > DEAD) held.add(keys[2]);
    if (x !== undefined && x < -DEAD) held.add(keys[3]);
  };
  stick(s.axes[0], s.axes[1], map.move);
  if (map.look) stick(s.axes[2], s.axes[3], map.look);
  return held;
}

/**
 * The key presses and releases between one reading of a controller and the next. A key newly held is pressed; a key
 * no longer held is released; a key still held is pressed again (marked as a repeat) once `repeatMs` has passed since
 * it was last sent. `sent` remembers when each held key was last sent, and is updated.
 */
export function padEvents(before: Set<string>, now: Set<string>, sent: Map<string, number>, at: number, map: PadMap): KeyEvent[] {
  const out: KeyEvent[] = [];
  const every = map.repeatMs ?? 140;
  for (const key of now) {
    if (!before.has(key)) {
      out.push({ type: "down", key, repeat: false });
      sent.set(key, at);
    } else if (at - (sent.get(key) ?? at) >= every) {
      out.push({ type: "down", key, repeat: true });
      sent.set(key, at);
    }
  }
  for (const key of before) {
    if (!now.has(key)) {
      out.push({ type: "up", key, repeat: false });
      sent.delete(key);
    }
  }
  return out;
}

/**
 * Reads the first connected controller once a frame and sends its keys to `target()`. Returns a function that stops
 * it. Does nothing in a browser without controllers.
 */
export function startGamepad(map: PadMap, target: () => EventTarget | null, onConnect?: (name: string) => void): () => void {
  if (typeof navigator === "undefined" || typeof navigator.getGamepads !== "function") return () => {};
  let held = new Set<string>();
  const sent = new Map<string, number>();
  let frame = 0;
  let stopped = false;
  const connected = (e: Event) => onConnect?.((e as GamepadEvent).gamepad?.id ?? "");
  window.addEventListener("gamepadconnected", connected);
  const tick = (at: number) => {
    if (stopped) return;
    const pad = [...navigator.getGamepads()].find((p): p is Gamepad => Boolean(p && p.connected));
    const now = pad ? keysHeld({ buttons: pad.buttons.map((b) => b.pressed), axes: [...pad.axes] }, map) : new Set<string>();
    const to = target();
    if (to) for (const e of padEvents(held, now, sent, at, map)) to.dispatchEvent(new KeyboardEvent(e.type === "down" ? "keydown" : "keyup", { key: e.key, repeat: e.repeat, bubbles: true, cancelable: true }));
    held = now;
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return () => {
    stopped = true;
    cancelAnimationFrame(frame);
    window.removeEventListener("gamepadconnected", connected);
  };
}
