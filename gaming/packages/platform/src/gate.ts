// The door every game stands behind: it reads the device, judges it, and either lets the game load or shows a plain
// page that says, in the visitor's language, that the game is not supported here, why, and what would work. Nothing
// of a game's engine or media is fetched before this passes. The page is ordinary HTML: a heading, a list, links and
// a button, readable by keyboard and screen reader, with no canvas, no spinner and no reload loop.
import { BASE_NEEDS, canRetry, judge, overrideAllowed, type Needs, type Reason } from "./preflight";
import { probe } from "./probe";
import en from "../i18n/en.json";

type Strings = Record<Exclude<keyof typeof en, "_meta">, string>;
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"];
const REASON_KEY: Record<Reason, keyof Strings> = { phone: "r_phone", tablet: "r_tablet", "screen-small": "r_screen_small", "window-small": "r_window_small", "browser-old": "r_browser_old", "browser-unknown": "r_browser_unknown", webgl2: "r_webgl2", "no-acceleration": "r_no_acceleration", texture: "r_texture", storage: "r_storage" };

export interface GateOptions {
  /** Where the page is drawn if the device is refused. */
  root: HTMLElement;
  lang: string;
  needs?: Needs;
  /** The museum's address for the way back. */
  museum: string;
  /** The game's name and a few readable sentences about it, shown under the reasons. */
  about: () => Promise<{ title: string; text: string[] }>;
  /** Called once, when the device may play. */
  pass: () => void;
  /** Called each time the device is refused, with the reasons: for a game's own test hook. */
  refused?: (reasons: Reason[]) => void;
}

export interface GateState {
  ok: boolean;
  reasons: Reason[];
  /** The override for testing was used. */
  overridden: boolean;
}

export async function gate(o: GateOptions): Promise<void> {
  const needs = o.needs ?? BASE_NEEDS;
  const state: GateState = { ok: false, reasons: [], overridden: false };
  (window as unknown as { __IM_PREFLIGHT__: GateState }).__IM_PREFLIGHT__ = state;
  let passed = false;
  let onResize: (() => void) | null = null;
  const go = () => {
    if (passed) return;
    passed = true;
    if (onResize) window.removeEventListener("resize", onResize);
    state.ok = true;
    state.reasons = [];
    o.root.replaceChildren();
    o.root.classList.remove("im-unsupported");
    o.pass();
    // Granada title art if the game is Granada
    if (o.museum.includes("granada")) {
      const titleDiv = el("div", undefined, "gr-title");
      const titleText = el("div", undefined, "gr-title-text");
      titleText.innerHTML = `<h1>${strings.title}</h1><p>${strings.why}</p>`;
      titleDiv.appendChild(titleText);
      o.root.appendChild(titleDiv);
    }
  };
  if (overrideAllowed(location.hostname, location.search)) {
    state.overridden = true;
    return go();
  }
  const check = (): Reason[] => judge(probe(), needs);
  let reasons = check();
  if (reasons.length === 0) return go();

  const lang = LANGS.includes(o.lang) ? o.lang : "en";
  const [strings, about] = await Promise.all([import(`../i18n/${lang}.json`).then((m) => m.default as Strings), o.about()]);
  const el = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, cls?: string): HTMLElementTagNameMap[K] => {
    const n = document.createElement(tag);
    if (text !== undefined) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  };
  const draw = () => {
    state.ok = false;
    state.reasons = reasons;
    o.refused?.(reasons);
    document.title = `${strings.title} ${about.title}`;
    const main = el("main");
    // The page's skip link points at "play": it lands here when the game itself is not shown.
    main.id = "play";
    main.tabIndex = -1;
    const list = el("ul");
    for (const r of reasons) list.append(el("li", strings[REASON_KEY[r]]));
    const fixes = el("ul", undefined, "fixes");
    if (reasons.includes("window-small")) fixes.append(el("li", strings.fix_window));
    if (reasons.includes("browser-old") || reasons.includes("browser-unknown") || reasons.includes("webgl2")) fixes.append(el("li", strings.fix_browser));
    if (reasons.includes("no-acceleration") || reasons.includes("webgl2")) fixes.append(el("li", strings.fix_acceleration));
    const retry = el("button", strings.retry);
    retry.type = "button";
    retry.onclick = () => {
      reasons = check();
      if (reasons.length === 0) go();
      else draw();
    };
    const back = el("a", strings.museum);
    back.href = o.museum;
    const section = el("section");
    section.append(el("h2", `${strings.about}: ${about.title}`), ...about.text.map((t) => el("p", t)));
    main.append(el("h1", strings.title), el("p", strings.why, "why"), list, el("p", strings.advice, "advice"), fixes, el("p"), section);
    main.querySelector("p:empty")!.append(retry, " ", back);
    o.root.classList.add("im-unsupported");
    o.root.replaceChildren(main);
    main.focus({ preventScroll: true });
  };
  draw();
  // A window made larger, or put on a larger screen, is noticed without a reload. Nothing else is polled.
  if (canRetry(reasons) || reasons.includes("window-small")) {
    onResize = () => {
      const now = check();
      if (now.length === 0) return go();
      if (now.join() !== reasons.join()) {
        reasons = now;
        draw();
      }
    };
    window.addEventListener("resize", onResize);
  }
}
