// The Lamp of the Ages: a 2D page drawn with the DOM and one SVG map. A fictional frame (the lamp from the folk tale,
// with its jinni as a modest guide) around the museum's own sourced records: every fact on the page is a record's
// label or summary, shown with its id, a link to it on islam.museum and the mark of historical review.
import en from "../../i18n/en.json";
import records from "../../data/records.json";
import land110 from "world-atlas/land-110m.json";
import { geoEquirectangular, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryObject, Topology } from "topojson-specification";
import { sharedStrings } from "../../../../packages/daily/src/load";
import { recordUrl } from "../../../../packages/daily/src/pack";
import { el, fill, lang, num, ready, shell } from "../../../../packages/daily/src/ui";
import { DESTINATIONS, JINN_RECORD, destination } from "../content";
import { MAX_COMPANIONS, SAVE_KEY, allDone, answer, canTravel, century, complete, home, homeOf, isDone, join, meet, parse, part, serialize, stepAt, travel, type Save } from "../sim";

type G = Record<keyof typeof en, string>;
type Rec = { label: Record<string, string>; summary: Record<string, string>; year: number | null; coords: [number, number] | null };
const R = records as unknown as Record<string, Rec>;

const name = (id: string): string => R[id]!.label[lang] ?? R[id]!.label.en!;
const summary = (id: string): string => R[id]!.summary[lang] ?? R[id]!.summary.en!;
const centuryOf = (destId: string): number => century(R[destination(destId)!.when]!.year!);

function load(): Save {
  try { return parse(localStorage.getItem(SAVE_KEY)); } catch { return parse(null); }
}
function store(s: Save): void {
  try { localStorage.setItem(SAVE_KEY, serialize(s)); } catch { /* storage unavailable: the game plays, unsaved */ }
}

async function main(): Promise<void> {
  const [shared, own] = await Promise.all([sharedStrings(), import(`../../i18n/${lang}.json`).then((m) => m.default as G)]);
  const s: Record<string, string> = { ...shared, ...own };
  const t = (k: keyof G, v: Record<string, string | number> = {}) => fill(own[k], v);
  const ui = shell({ s, title: t("title"), howto: [t("how_1"), t("how_2"), t("how_3"), t("art_note")] });
  // Released on 28 November 2026 by the founder's decision (docs/gaming/spec-production/release-status.json): no prototype
  // label. Its pictures are still drawn by code, as "art_note" says; painted art is to come as an update.
  const save = load();
  const centuries = [...new Set(DESTINATIONS.map((d) => centuryOf(d.id)))].sort((a, b) => a - b);
  let dial = save.at ? centuryOf(save.at) : centuries[0]!;
  let feedback = "";

  /** A record shown as the museum's card: its name, its summary, its id, the review mark and a link. */
  const card = (id: string, heading: "h3" | "h4" = "h3"): HTMLElement => el("article", { class: "card rec" },
    el(heading, {}, name(id)),
    el("p", {}, summary(id)),
    el("p", { class: "small meta" },
      el("code", {}, t("record_id", { id })), " · ",
      el("a", { href: recordUrl(lang, id), rel: "noopener" }, fill(s.read_more!, { name: name(id) })),
    ),
  );

  const jinni = (): HTMLElement => el("section", { class: "card jinni", "aria-labelledby": "jinni-h" },
    lampArt(),
    el("h2", { id: "jinni-h" }, t("jinni_title")),
    el("p", {}, t("jinni_1")),
    el("p", {}, t("jinni_2")),
    el("p", {}, el("a", { href: recordUrl(lang, JINN_RECORD), rel: "noopener" }, t("jinni_link"))),
  );

  const reviewNote = (): HTMLElement => el("p", { class: "review small", role: "note" }, t("review_note"));

  const go = (fn: () => void, say?: string) => {
    fn();
    store(save);
    draw();
    if (say) ui.say(say);
    document.getElementById("view-h")?.focus();
  };

  const satchel = (): HTMLElement => el("section", { class: "card", "aria-labelledby": "satchel-h" },
    el("h2", { id: "satchel-h" }, t("satchel")),
    save.cards.length ? el("ul", {}, ...save.cards.map((c) => el("li", {}, el("a", { href: recordUrl(lang, c), rel: "noopener" }, name(c)), " ", el("code", { class: "small" }, c)))) : el("p", {}, t("empty")),
    el("h2", { id: "comp-h" }, t("companions")),
    save.companions.length ? el("ul", {}, ...save.companions.map((f) => {
      const b = el("button", { type: "button", class: "secondary" }, t("part", { name: name(f) }));
      b.addEventListener("click", () => go(() => part(save, f)));
      return el("li", {}, name(f), " ", b);
    })) : el("p", {}, t("none_yet")),
  );

  const mapView = (): HTMLElement[] => {
    const range = el("input", { type: "range", min: "0", max: String(centuries.length - 1), step: "1", value: String(centuries.indexOf(dial)), id: "dial", "aria-valuetext": t("century", { n: num(dial) }) }) as HTMLInputElement;
    const out = el("output", { for: "dial" }, t("century", { n: num(dial) }));
    range.addEventListener("input", () => { dial = centuries[Number(range.value)]!; draw(); document.getElementById("dial")?.focus(); });
    const here = DESTINATIONS.filter((d) => centuryOf(d.id) === dial);
    const list = el("ul", { class: "dests" }, ...here.map((d) => {
      const open = canTravel(save, d.id);
      const b = el("button", { type: "button", disabled: !open }, t("go", { place: name(d.place) }), isDone(save, d.id) ? " ✓" : "");
      b.addEventListener("click", () => go(() => travel(save, d.id), t("here", { place: name(d.place), n: num(centuryOf(d.id)) })));
      return el("li", {}, b, open ? null : el("p", { class: "small" }, t("needs", { item: name(d.needs!) })));
    }));
    return [
      el("h2", { id: "view-h", tabIndex: -1 }, t("title")),
      el("div", { class: "dial" }, el("label", { for: "dial" }, t("dial")), range, out),
      mapArt(here.map((d) => d.id), t("map_label")),
      list,
      allDone(save) ? el("p", { class: "done" }, t("all_done")) : null,
    ].filter((x): x is HTMLElement => x !== null);
  };

  const placeView = (destId: string): HTMLElement[] => {
    const d = destination(destId)!;
    const step = stepAt(save, d.id);
    const back = el("button", { type: "button", class: "secondary" }, t("back_map"));
    back.addEventListener("click", () => go(() => home(save)));
    const parts: (HTMLElement | null)[] = [
      el("h2", { id: "view-h", tabIndex: -1 }, t("here", { place: name(d.place), n: num(centuryOf(d.id)) })),
      back,
      card(d.place),
      el("section", { class: "card mission", "aria-labelledby": "mission-h" },
        el("h3", { id: "mission-h" }, t("mission")),
        el("p", {}, t("mission_text", { name: name(d.figure), item: name(d.gives) }))),
    ];
    if (step === 0) {
      const b = el("button", { type: "button" }, t("meet", { name: name(d.figure) }));
      b.addEventListener("click", () => go(() => meet(save)));
      parts.push(b);
    } else {
      parts.push(card(d.figure));
      for (const id of d.see) if (id !== d.figure && id !== d.question.about) parts.push(card(id));
      if (d.question.about !== d.figure) parts.push(card(d.question.about));
    }
    if (step === 1) {
      const q = d.question;
      const opts = [q.answer, ...q.options].sort((a, b) => name(a).localeCompare(name(b), lang));
      const fs = el("fieldset", { class: "card q" }, el("legend", {}, t(q.kind === "where" ? "q_where" : "q_who", { name: name(q.about) })),
        ...opts.map((o) => {
          const b = el("button", { type: "button", class: "secondary wide" }, name(o));
          b.addEventListener("click", () => {
            const ok = answer(save, o);
            feedback = ok ? t("right", { name: name(o) }) : t("wrong");
            go(() => undefined, feedback);
          });
          return b;
        }),
        feedback ? el("p", { "aria-live": "polite" }, feedback) : null);
      parts.push(fs);
    }
    if (step === 2) {
      const b = el("button", { type: "button" }, t("take", { item: name(d.gives) }));
      b.addEventListener("click", () => { feedback = ""; go(() => complete(save), t("got", { item: name(d.gives) })); });
      parts.push(b);
    }
    if (step >= 3) {
      parts.push(el("p", { class: "done" }, t("done_here"), " ", t("got", { item: name(d.gives) })));
      parts.push(card(d.gives));
      if (!save.companions.includes(d.figure)) {
        const full = save.companions.length >= MAX_COMPANIONS;
        const b = el("button", { type: "button", disabled: full }, t("join", { name: name(d.figure) }));
        b.addEventListener("click", () => go(() => join(save, d.figure)));
        parts.push(b, full ? el("p", { class: "small" }, t("full")) : null);
      }
    }
    for (const f of save.companions) {
      if (f === d.figure) continue;
      parts.push(el("section", { class: "card companion" },
        el("h3", {}, name(f)),
        el("p", {}, t("companion_away", { name: name(f) })),
      ));
    }
    if (save.companions.includes(d.figure) && homeOf(d.figure) === d.id) {
      parts.push(el("section", { class: "card companion" }, el("p", {}, t("companion_home", { name: name(d.figure) })), el("p", {}, summary(d.figure))));
    }
    return parts.filter((x): x is HTMLElement => x !== null);
  };

  function draw(): void {
    const view = save.at ? placeView(save.at) : mapView();
    const reset = el("button", { type: "button", class: "secondary" }, t("reset"));
    reset.addEventListener("click", () => {
      if (!confirm(t("reset_confirm"))) return;
      go(() => { const n = parse(null); Object.assign(save, n); feedback = ""; dial = centuries[0]!; });
    });
    ui.main.replaceChildren(jinni(), reviewNote(), el("div", { class: "view" }, ...view), satchel(), reset);
  }

  draw();
  ready({ game: "lamp", destinations: DESTINATIONS.length, at: save.at, cards: save.cards.length });
}

/** The lamp, drawn by code: a placeholder, with a wisp of smoke rather than any figure. */
function lampArt(): SVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 120 60");
  svg.setAttribute("class", "lamp-art");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = '<path d="M20 44 Q40 30 70 38 L96 30 L92 36 L74 44 Q60 52 34 50 Z" fill="#b8862b" stroke="#5a3d0c" stroke-width="2"/>'
    + '<ellipse cx="46" cy="38" rx="10" ry="3" fill="#d9a441" stroke="#5a3d0c"/><rect x="36" y="50" width="24" height="5" rx="2" fill="#8a6118"/>'
    + '<path d="M96 30 C104 20 92 14 100 6" fill="none" stroke="#c9a46a" stroke-width="3" stroke-linecap="round" opacity=".8"/>';
  return svg;
}

const LAND = feature(land110 as unknown as Topology, (land110 as unknown as Topology).objects.land as GeometryObject);

/** The map, drawn by code from the open Natural Earth outline in world-atlas: land, sea and the places of the slice. */
function mapArt(lit: string[], caption: string): HTMLElement {
  const W = 640, H = 340;
  const proj = geoEquirectangular().fitExtent([[0, 0], [W, H]], { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [[[-20, 5], [-20, 50], [75, 50], [75, 5], [-20, 5]]] } } as never);
  const path = geoPath(proj);
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("class", "map");
  svg.setAttribute("role", "img");
  const title = document.createElementNS(NS, "title");
  title.textContent = caption;
  svg.append(title);
  const sea = document.createElementNS(NS, "rect");
  sea.setAttribute("width", String(W)); sea.setAttribute("height", String(H)); sea.setAttribute("class", "sea");
  const land = document.createElementNS(NS, "path");
  land.setAttribute("d", path(LAND as never) ?? ""); land.setAttribute("class", "land");
  svg.append(sea, land);
  for (const d of DESTINATIONS) {
    const c = R[d.place]!.coords!;
    const [x, y] = proj([c[1], c[0]])!;
    const dot = document.createElementNS(NS, "circle");
    dot.setAttribute("cx", String(x)); dot.setAttribute("cy", String(y)); dot.setAttribute("r", lit.includes(d.id) ? "9" : "5");
    dot.setAttribute("class", lit.includes(d.id) ? "dot lit" : "dot");
    const label = document.createElementNS(NS, "text");
    label.setAttribute("x", String(x)); label.setAttribute("y", String(y - 13)); label.setAttribute("text-anchor", "middle");
    label.setAttribute("class", lit.includes(d.id) ? "lbl lit" : "lbl");
    label.textContent = name(d.place);
    svg.append(dot, label);
  }
  const wrap = el("figure", { class: "mapwrap" });
  wrap.append(svg);
  const cap = el("figcaption", { class: "small" }, caption);
  wrap.append(cap);
  return wrap;
}

main().catch((e) => {
  console.error(e);
  const app = document.getElementById("app");
  if (app) app.textContent = "The game could not load. Please reload the page.";
});
