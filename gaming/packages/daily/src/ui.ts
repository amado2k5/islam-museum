// The shared page of the small daily games: one column that fits a phone, large tap targets, a header with the
// game's name, the prototype label and a short "how to play", and the way back to the museum. No canvas, no WebGL,
// no download beyond the page and its pack, so it plays on any device with a current browser.
import { LANGS, RTL, type Lang } from "./pack";
import { isDate } from "./seed";

export const query = new URLSearchParams(location.search);
export const lang: Lang = (LANGS as readonly string[]).includes(query.get("lang") ?? "") ? (query.get("lang") as Lang) : "en";
/** Today in UTC: every player in the world gets the same puzzle on the same day. `?date=` is for testing only. */
export const today = (): string => (isDate(query.get("date")) ? query.get("date")! : new Date().toISOString().slice(0, 10));
const NUM_LOCALE: Record<Lang, string> = { ar: "ar-EG-u-nu-latn", en: "en-GB", ur: "ur-PK-u-nu-latn", fr: "fr-FR", es: "es-ES", tr: "tr-TR", id: "id-ID" };
export const num = (n: number): string => new Intl.NumberFormat(NUM_LOCALE[lang], { useGrouping: false }).format(n);

export type Strings = Record<string, string>;
export const fill = (s: string, vars: Record<string, string | number> = {}): string => s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));

export const el = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Record<string, unknown> = {}, ...children: Array<Node | string | null | false>): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") node.className = String(v);
    else if (k.startsWith("aria-") || k.startsWith("data-") || k === "role" || k === "dir" || k === "lang") node.setAttribute(k, String(v));
    else (node as unknown as Record<string, unknown>)[k] = v;
  }
  for (const c of children) if (c !== null && c !== false) node.append(c);
  return node;
};

export interface Shell {
  main: HTMLElement;
  /** Says something to a screen reader at once. */
  say: (text: string) => void;
}
/** Sets the page's language and direction and draws the header. `s` holds the game's strings and the shared ones. */
/** `prototype` is the label shown beside the title while the game is a prototype; a released game passes none. */
export function shell(o: { s: Strings; title: string; howto: string[]; prototype?: string }): Shell {
  const s = o.s;
  document.documentElement.lang = lang;
  document.documentElement.dir = RTL.includes(lang) ? "rtl" : "ltr";
  document.title = o.title;
  const app = document.getElementById("app")!;
  const live = el("div", { class: "visually-hidden", role: "status", "aria-live": "polite" });
  const select = el("select", { "aria-label": s.language }) as HTMLSelectElement;
  for (const l of LANGS) select.append(el("option", { value: l, selected: l === lang, lang: l }, s[`lang_${l}`] ?? l));
  select.addEventListener("change", () => {
    query.set("lang", select.value);
    location.search = query.toString();
  });
  const header = el("header", { class: "top" },
    el("a", { class: "back", href: `https://islam.museum/${lang}/games/` }, el("span", { "aria-hidden": "true" }, RTL.includes(lang) ? "→ " : "← "), s.back),
    select,
  );
  const help = el("details", { class: "howto" }, el("summary", {}, s.howto), el("ul", {}, ...o.howto.map((h) => el("li", {}, h))), el("p", { class: "small" }, s.free));
  const main = el("main", { id: "main", tabIndex: -1 });
  app.replaceChildren(header, el("h1", {}, o.title, ...(o.prototype ? [" ", el("span", { class: "chip proto" }, o.prototype)] : [])), help, main, live);
  const skip = document.querySelector<HTMLAnchorElement>("a.skip");
  if (skip) skip.textContent = s.skip;
  return { main, say: (t) => { live.textContent = ""; setTimeout(() => (live.textContent = t), 30); } };
}

/** A button that copies the result as plain text, with a fallback that selects it for the player to copy. */
export function copyButton(s: Strings, text: () => string): HTMLElement {
  const note = el("span", { class: "small", role: "status" });
  const b = el("button", { type: "button", class: "secondary" }, s.copy);
  b.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(text());
      note.textContent = s.copied;
    } catch {
      note.textContent = text();
    }
  });
  return el("p", { class: "row" }, b, " ", note);
}

/** What a game keeps on this device: one entry per day played, nothing else and nowhere else. */
export function store<T>(key: string) {
  const read = (): Record<string, T> => {
    try {
      const v = JSON.parse(localStorage.getItem(key) ?? "{}") as unknown;
      return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, T>) : {};
    } catch {
      return {};
    }
  };
  return {
    get: (day: string): T | undefined => read()[day],
    put: (day: string, value: T) => {
      try {
        localStorage.setItem(key, JSON.stringify({ ...read(), [day]: value }));
      } catch { /* storage is unavailable: the game plays, it just is not remembered */ }
    },
    all: read,
  };
}

/** The link to a museum record, opened in the museum. */
export const recordLink = (s: Strings, url: string, name: string): HTMLElement => el("a", { class: "record", href: url, rel: "noopener" }, fill(s.read_more, { name }));

/** Marks the page as ready for the release checks, with what they may read. */
export function ready(info: Record<string, unknown>): void {
  (window as unknown as { __DAILY__: unknown }).__DAILY__ = info;
  document.documentElement.dataset.ready = "1";
}
