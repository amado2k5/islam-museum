// The opening story, before the Atlas: five still panels, each a picture drawn in code and a short paragraph, read
// once. It is ordinary page from top to bottom: real buttons (Next, Back, Skip), the arrow keys and Escape, the
// words in a polite live region and focus moved to the panel's heading at each change so that a screen reader says
// where it is. Nothing moves by itself, so there is nothing for reduced motion to stop. The story is fiction and the
// last panel says so; the page that shows it (ui/app.ts) keeps the record that it was seen.
import { PROLOGUE, drawPrologue, prologueCanvas, type PrologueView } from "../art/prologue";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;
export interface PrologueHost {
  t(key: Key, vars?: Record<string, string | number>): string;
  num(n: number): string;
  rtl: boolean;
  /** The explorer's look, as chosen, for the fourth picture. */
  look(): PrologueView["look"];
  /** A sheet (the settings) is open over the page: the keys belong to it. */
  blocked(): boolean;
  /** The opening was finished (Begin) or skipped (Skip, Escape): the page goes on to the Atlas. */
  leave(): void;
}
export interface Prologue {
  node: HTMLElement;
  /** Shows the opening from a panel (the first by default). Focus goes to its heading unless `focus` is false: a page
   * that has only just loaded keeps focus where it is, so that the skip link and the toolbar come first. */
  open(panel?: number, focus?: boolean): void;
  /** The panel showing, 1 to 5. */
  panel(): number;
  /** Stops listening for keys. */
  close(): void;
}

const h = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Partial<HTMLElementTagNameMap[K]> & { class?: string } = {}, ...children: Array<Node | string | null | false>): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  const { class: cls, ...rest } = props;
  if (cls) node.className = cls;
  Object.assign(node, rest);
  for (const c of children) if (c !== null && c !== false) node.append(c);
  return node;
};

export function prologueScreen(host: PrologueHost): Prologue {
  const { t } = host;
  const total = PROLOGUE.panels;
  let at = 1;
  let listening = false;

  const canvas = prologueCanvas();
  canvas.setAttribute("role", "img");
  const count = h("h3", { class: "pro-count", tabIndex: -1 });
  const text = h("p", { class: "pro-text" });
  text.setAttribute("aria-live", "polite");
  const back = h("button", { type: "button", textContent: t("btn_back"), onclick: () => go(at - 1) });
  const next = h("button", { type: "button", class: "primary", onclick: () => (at === total ? host.leave() : go(at + 1)) });
  const skip = h("button", { type: "button", class: "quiet", textContent: t("pro_skip"), onclick: () => host.leave() });
  const node = h(
    "section",
    { class: "prologue", hidden: true },
    h("h2", { textContent: t("pro_title") }),
    h("figure", { class: "pro-art" }, canvas),
    h("div", { class: "pro-card" }, count, text),
    h("div", { class: "row pro-nav" }, back, next, skip),
  );

  function go(n: number, focus = true): void {
    at = Math.min(total, Math.max(1, n));
    drawPrologue(canvas, at, { rtl: host.rtl, look: host.look() });
    canvas.setAttribute("aria-label", t(`pro_alt_${at}` as Key));
    count.textContent = t("pro_counter", { n: host.num(at), total: host.num(total) });
    text.textContent = t(`pro_${at}` as Key);
    back.disabled = at === 1;
    next.textContent = t(at === total ? "pro_begin" : "btn_next");
    if (focus) count.focus({ preventScroll: true });
  }

  // Arrow keys move between panels, the way the words read: on a right-to-left page the left arrow goes forward.
  const onKey = (e: KeyboardEvent): void => {
    if (node.hidden || host.blocked() || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest?.("select, input, textarea, [role=dialog]")) return;
    if (e.key === "Escape") {
      e.preventDefault();
      return host.leave();
    }
    const forward = host.rtl ? "ArrowLeft" : "ArrowRight";
    const backward = host.rtl ? "ArrowRight" : "ArrowLeft";
    if (e.key === forward) {
      e.preventDefault();
      if (at < total) go(at + 1);
    } else if (e.key === backward) {
      e.preventDefault();
      if (at > 1) go(at - 1);
    }
  };

  return {
    node,
    open(panel = 1, focus = true) {
      node.hidden = false;
      if (!listening) document.addEventListener("keydown", onKey), (listening = true);
      go(panel, focus);
    },
    panel: () => at,
    close() {
      node.hidden = true;
      document.removeEventListener("keydown", onKey);
      listening = false;
    },
  };
}
