// Keys the player chooses for a game's actions. A game names its actions and the key each has by default; the player
// may give an action another key, kept on the device per game. The game itself goes on listening for its own default
// keys: a key the player chose is turned, before the game sees it, into the default key of its action. So nothing in a
// game changes, and a key moved away from an action no longer does it.

export interface Action {
  id: string;
  /** The key the game listens for, as KeyboardEvent.key gives it (letters in lower case). */
  key: string;
}

const KEY = (game: string) => `im.games.keys.${game}`;
const norm = (k: string) => (k.length === 1 ? k.toLowerCase() : k);

/** The player's keys, by action: the default where none was chosen. Keys that clash or are unreadable fall back. */
export function readKeys(game: string, actions: readonly Action[], raw: string | null = load(game)): Record<string, string> {
  let chosen: Record<string, string> = {};
  try {
    const o = raw ? (JSON.parse(raw) as unknown) : {};
    if (o && typeof o === "object") chosen = o as Record<string, string>;
  } catch {
    chosen = {};
  }
  const out: Record<string, string> = {};
  const used = new Set<string>();
  for (const a of actions) {
    const k = typeof chosen[a.id] === "string" && chosen[a.id]!.length > 0 ? norm(chosen[a.id]!) : a.key;
    out[a.id] = used.has(k) ? a.key : k;
    used.add(out[a.id]!);
  }
  return out;
}

/**
 * What a pressed key means: the default key of the action it now stands for; null when the key no longer does
 * anything (its action was moved to another key); the key itself when the player has not touched it.
 */
export function translate(pressed: string, actions: readonly Action[], keys: Record<string, string>): string | null {
  const k = norm(pressed);
  const now = actions.find((a) => keys[a.id] === k);
  if (now) return now.key;
  if (actions.some((a) => a.key === k && keys[a.id] !== k)) return null;
  return pressed;
}

function load(game: string): string | null {
  try {
    return localStorage.getItem(KEY(game));
  } catch {
    return null;
  }
}
export function saveKeys(game: string, keys: Record<string, string>): void {
  try {
    localStorage.setItem(KEY(game), JSON.stringify(keys));
  } catch {
    // The choice holds for this visit.
  }
}

/**
 * Puts the player's keys in front of the game's own listeners: a key press is caught first, and if the player moved
 * it, it is sent on as the key the game knows (or dropped). Keys typed into a field are left alone. Returns a stop.
 */
export function installKeymap(game: string, actions: readonly Action[]): { keys: () => Record<string, string>; set: (id: string, key: string) => void; reset: () => void; stop: () => void } {
  let keys = readKeys(game, actions);
  let forwarding = false;
  const onKey = (e: KeyboardEvent) => {
    if (forwarding || e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target as HTMLElement | null;
    if (t && ["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName)) return;
    const to = translate(e.key, actions, keys);
    if (to === e.key) return;
    e.stopImmediatePropagation();
    e.preventDefault();
    if (to === null) return;
    forwarding = true;
    (t ?? document.body).dispatchEvent(new KeyboardEvent(e.type, { key: to, bubbles: true, cancelable: true, shiftKey: e.shiftKey, repeat: e.repeat }));
    forwarding = false;
  };
  window.addEventListener("keydown", onKey, true);
  window.addEventListener("keyup", onKey, true);
  return {
    keys: () => ({ ...keys }),
    set: (id, key) => {
      const k = norm(key);
      // A key given to one action is taken from any other that had it, which goes back to its own default.
      const next = { ...keys };
      for (const a of actions) if (a.id !== id && next[a.id] === k) next[a.id] = a.key;
      next[id] = k;
      saveKeys(game, next);
      keys = readKeys(game, actions, JSON.stringify(next));
    },
    reset: () => {
      saveKeys(game, {});
      keys = readKeys(game, actions, "{}");
    },
    stop: () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("keyup", onKey, true);
    },
  };
}
