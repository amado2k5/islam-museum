// The list of a game's actions with their keys, each with a button that waits for the next key pressed. Plain DOM, so
// any game can put it in its help sheet whatever it builds its pages with.
import type { Action } from "./keymap";

export interface KeymapPanelStrings {
  title: string;
  change: string;
  press: string;
  reset: string;
  action: (id: string) => string;
}

const shown = (k: string) => (k === " " ? "Space" : k.length === 1 ? k.toUpperCase() : k);

export function keymapPanel(actions: readonly Action[], map: { keys: () => Record<string, string>; set: (id: string, key: string) => void; reset: () => void }, s: KeymapPanelStrings): HTMLElement {
  const box = document.createElement("section");
  box.className = "keymap";
  const draw = () => {
    box.replaceChildren();
    const h = document.createElement("h3");
    h.textContent = s.title;
    const list = document.createElement("ul");
    list.className = "plain";
    const keys = map.keys();
    for (const a of actions) {
      const li = document.createElement("li");
      const name = document.createElement("span");
      name.textContent = `${s.action(a.id)}: `;
      const kbd = document.createElement("kbd");
      kbd.textContent = shown(keys[a.id] ?? a.key);
      const b = document.createElement("button");
      b.type = "button";
      b.id = `key-${a.id}`;
      b.textContent = s.change;
      b.addEventListener("click", () => {
        b.textContent = s.press;
        const take = (e: KeyboardEvent) => {
          if (["Shift", "Control", "Alt", "Meta", "Tab"].includes(e.key)) return;
          e.preventDefault();
          e.stopImmediatePropagation();
          window.removeEventListener("keydown", take, true);
          if (e.key !== "Escape") map.set(a.id, e.key);
          draw();
          document.getElementById(`key-${a.id}`)?.focus();
        };
        window.addEventListener("keydown", take, true);
      });
      li.append(name, kbd, " ", b);
      list.append(li);
    }
    const reset = document.createElement("button");
    reset.type = "button";
    reset.id = "keys-reset";
    reset.textContent = s.reset;
    reset.addEventListener("click", () => {
      map.reset();
      draw();
    });
    box.append(h, list, reset);
  };
  draw();
  return box;
}
