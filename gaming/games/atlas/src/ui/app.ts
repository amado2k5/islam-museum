// The Atlas screen: one panel beside the globe. It holds no rules: every decision is src/rules.ts, and this file
// only shows state, collects a guess and stores the result on this device.
import { loadMusicStrings, musicControl } from "@im/audio/control";
import { MUSIC_BASE, MusicPlayer } from "@im/audio/player";
import en from "../../i18n/en.json";
import { LANGS, decodePack, type AtlasPack, type Lang, type PackFile, type PackLabels } from "../pack";
import { REGION_HINT_COST, ROUNDS_PER_GAME, TOLERANCE_KM, centuryTally, dailyRounds, isOver, maxPoints, newGame, practiceRounds, shareMarks, step, totalPoints, type AtlasState, type GameMode } from "../rules";
import { SAVE_KEY, emptySave, readSave, resumable, writeSave, type AtlasSave } from "../save";
import { Globe } from "./globe";

type Strings = Record<keyof typeof en, string>;
const NUM_LOCALE: Record<Lang, string> = { ar: "ar-EG-u-nu-latn", en: "en-GB", ur: "ur-PK-u-nu-latn", fr: "fr-FR", es: "es-ES", tr: "tr-TR", id: "id-ID" };
const RTL: Lang[] = ["ar", "ur"];
const MUSEUM = "https://islam.museum";

const query = new URLSearchParams(location.search);
const lang: Lang = (LANGS as readonly string[]).includes(query.get("lang") ?? "") ? (query.get("lang") as Lang) : "en";
const todayUtc = (): string => query.get("date") ?? new Date().toISOString().slice(0, 10);

/** Reads the save from this device. An unreadable or newer save is set aside under another key, never overwritten. */
function loadSave(): { save: AtlasSave; writable: boolean } {
  try {
    const reading = readSave(localStorage.getItem(SAVE_KEY));
    if (reading.status === "unreadable") localStorage.setItem(`${SAVE_KEY}.unreadable`, reading.keep);
    return { save: reading.save, writable: reading.status !== "newer" };
  } catch {
    return { save: emptySave(), writable: false }; // storage is unavailable: the game plays, it just is not remembered
  }
}

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Partial<HTMLElementTagNameMap[K]> & { class?: string } = {}, ...children: Array<Node | string | null>): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  const { class: cls, ...rest } = props;
  if (cls) node.className = cls;
  Object.assign(node, rest);
  for (const c of children) if (c !== null) node.append(c);
  return node;
};

async function main(): Promise<void> {
  const [strings, labels, packFile] = await Promise.all([
    import(`../../i18n/${lang}.json`).then((m) => m.default as Strings),
    import(`../../data/labels.v1.${lang}.json`).then((m) => m.default as PackLabels),
    import("../../data/pack.v1.json").then((m) => m.default as unknown as PackFile),
  ]);
  const pack: AtlasPack = decodePack(packFile);
  const t = (key: keyof Strings, vars: Record<string, string | number> = {}): string => strings[key].replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));
  const num = (n: number, digits = 0) => new Intl.NumberFormat(NUM_LOCALE[lang], { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);
  const year = (n: number) => String(n); // years are never grouped with a thousands separator
  const coord = (lat: number, lon: number) => `${num(Math.abs(lat), 1)}° ${lat >= 0 ? strings.north : strings.south}, ${num(Math.abs(lon), 1)}° ${lon >= 0 ? strings.east : strings.west}`;

  document.documentElement.lang = lang;
  document.documentElement.dir = RTL.includes(lang) ? "rtl" : "ltr";
  document.title = `${strings.title}: ${strings.subtitle}`;
  const skip = document.querySelector<HTMLAnchorElement>("a.skip");
  if (skip) skip.textContent = strings.skip;

  const panel = document.getElementById("panel") as HTMLElement;
  const live = document.getElementById("live") as HTMLElement;
  const canvas = document.getElementById("globe") as HTMLCanvasElement;
  canvas.setAttribute("aria-label", strings.globe_label);
  const say = (text: string) => (live.textContent = text);
  const fill = (...nodes: Array<Node | null>) => panel.replaceChildren(...nodes.filter((n): n is Node => n !== null));

  const { save, writable } = loadSave();
  const storeSave = (value: AtlasSave) => {
    if (!writable) return;
    try {
      localStorage.setItem(SAVE_KEY, writeSave(value));
    } catch {
      /* private mode or full storage */
    }
  };
  let state: AtlasState;
  let century: number | null = null;
  let revealed = false;

  const globe = new Globe(canvas, {
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    // On a wide window the panel takes the start edge, so the globe moves toward the other side. The globe itself
    // is never mirrored: only where it sits changes with the reading direction.
    offsetX: () => (window.innerWidth > 900 ? (RTL.includes(lang) ? -1 : 1) * 208 : 0),
    onPin: (lat, lon) => {
      say(t("pin_at", { lat: coord(lat, lon).split(", ")[0]!, lon: coord(lat, lon).split(", ")[1]! }));
      render();
    },
  });
  const zoom = el("div", { class: "zoom" }, el("button", { type: "button", textContent: "+", ariaLabel: strings.zoom_in, onclick: () => globe.zoomBy(1.4) }), el("button", { type: "button", textContent: "−", ariaLabel: strings.zoom_out, onclick: () => globe.zoomBy(1 / 1.4) }));
  document.getElementById("app")!.append(zoom);
  // The soundtrack is the museum's own. Atlas opens with "Fourteen Centuries" and the suite follows in order.
  const music = new MusicPlayer({ base: MUSIC_BASE, first: "fourteen-centuries", forceOff: query.get("music") === "off" });
  const musicBox = el("div", { class: "music-corner" });
  musicBox.append(musicControl(music, await loadMusicStrings(lang), `${MUSEUM}/${lang}/backstage/`));
  document.getElementById("app")!.append(musicBox);

  const start = (mode: GameMode) => {
    if (mode === "daily") {
      const date = todayUtc();
      const scheduled = dailyRounds(pack, date);
      state = resumable(save, pack, date, scheduled) ?? newGame(pack, "daily", date, scheduled);
    } else {
      save.practice += 1;
      storeSave(save);
      state = newGame(pack, "practice", `p${save.practice}`, practiceRounds(pack, `${save.practice}:${todayUtc()}`));
    }
    century = null;
    revealed = false;
    globe.reset();
    render();
  };
  const persist = () => {
    if (state.mode === "daily") {
      save.daily[state.key] = state;
      storeSave(save);
    }
  };

  const header = () =>
    el(
      "div",
      { class: "row spread" },
      // The ISO date is left-to-right text inside a right-to-left line, so it is isolated or it would be reordered.
      el("div", {}, el("h1", { textContent: strings.title }), el("div", { class: "kicker" }, state.mode === "daily" ? strings.daily : strings.practice, state.mode === "daily" ? " · " : null, state.mode === "daily" ? el("bdi", { dir: "ltr", textContent: state.key }) : null)),
      el("span", { class: "badge", textContent: strings.prototype }),
    );
  const dots = () => {
    const d = el("div", { class: "dots", role: "img", ariaLabel: t("round_of", { n: Math.min(state.at + 1, ROUNDS_PER_GAME), total: ROUNDS_PER_GAME }) });
    for (let i = 0; i < ROUNDS_PER_GAME; i++) d.append(el("span", { class: `dot${i < state.at ? " done" : i === state.at ? " now" : ""}` }));
    return d;
  };
  const recordUrl = (id: string) => `${MUSEUM}/${lang}/${id}/`;
  const borrowedNote = (id: string) => (labels.fallback.includes(id) ? el("p", { class: "note", textContent: strings.borrowed_name }) : null);

  function renderRound(): void {
    const round = pack.rounds[state.rounds[state.at]!]!;
    const place = pack.places[round.place]!;
    const pin = globe.getPin();
    const q = round.type === "event" ? strings.q_event : round.type === "birth" ? strings.q_birth : strings.q_death;
    const lat = el("input", { type: "number", id: "lat", min: "-90", max: "90", step: "0.1", value: pin ? pin[0].toFixed(1) : "", ariaLabel: strings.latitude, placeholder: strings.latitude });
    const lon = el("input", { type: "number", id: "lon", min: "-180", max: "180", step: "0.1", value: pin ? pin[1].toFixed(1) : "", ariaLabel: strings.longitude, placeholder: strings.longitude });
    const setPin = el("button", {
      type: "button",
      id: "set-pin",
      textContent: strings.set_pin,
      onclick: () => {
        const la = Number(lat.value);
        const lo = Number(lon.value);
        if (lat.value === "" || lon.value === "" || !Number.isFinite(la) || !Number.isFinite(lo) || Math.abs(la) > 90 || Math.abs(lo) > 180) return;
        globe.setPin(la, lo);
        globe.flyTo(la, lo, 3);
      },
    });
    const centuryText = () => (century === null ? strings.century_none : t("century_range", { from: year((century - 1) * 100 + 1), to: year(century * 100), ce: labels.terms.ce }));
    const centuryOut = el("span", { class: "coords", textContent: centuryText() });
    centuryOut.dir = "auto";
    // "No estimate" is the starting state, so the button that returns to it only appears once an estimate is set.
    const clear = el("button", { type: "button", textContent: strings.century_none, hidden: century === null, onclick: () => setCentury(null) });
    const setCentury = (value: number | null) => {
      century = value;
      centuryOut.textContent = centuryText();
      clear.hidden = value === null;
    };
    const bump = (d: number) => setCentury(Math.max(6, Math.min(21, (century ?? 12) + d)));
    const hint = state.regionHint
      ? el("p", { class: "note", textContent: place.region ? t("hint_region_shown", { region: labels.regions[place.region] ?? place.region }) : strings.hint_region_none })
      : el("button", {
          type: "button",
          id: "hint",
          textContent: t("hint_region", { cost: REGION_HINT_COST }),
          onclick: () => {
            state = step(pack, state, { type: "hint-region" });
            persist();
            render();
          },
        });
    fill(
      header(),
      el("div", { class: "row spread gap" }, el("span", { class: "kicker", textContent: t("round_of", { n: state.at + 1, total: ROUNDS_PER_GAME }) }), dots()),
      el("p", { class: "q", textContent: q }),
      el("h2", { textContent: labels.labels[round.id] ?? round.id }),
      borrowedNote(round.id),
      el("p", { class: "note", textContent: strings.how }),
      el("div", { class: "field" }, el("span", { class: "label", textContent: pin ? t("pin_at", { lat: coord(pin[0], pin[1]).split(", ")[0]!, lon: coord(pin[0], pin[1]).split(", ")[1]! }) : strings.no_pin }), el("div", { class: "row" }, lat, lon, setPin)),
      el("div", { class: "field" }, el("span", { class: "label", textContent: strings.century_label }), el("div", { class: "row" }, el("button", { type: "button", textContent: strings.earlier, onclick: () => bump(-1) }), centuryOut, el("button", { type: "button", textContent: strings.later, onclick: () => bump(1) }), clear)),
      el("div", { class: "field" }, hint),
      el("button", {
        type: "button",
        id: "submit",
        class: "primary",
        textContent: strings.submit,
        disabled: !pin,
        onclick: () => {
          const p = globe.getPin();
          if (!p) return;
          state = step(pack, state, { type: "guess", lat: p[0], lon: p[1], century });
          persist();
          revealed = true;
          globe.reveal(place.lat, place.lon);
          render();
        },
      }),
      el("p", { class: "note", textContent: strings.controls }),
    );
  }

  function renderReveal(): void {
    const result = state.results[state.results.length - 1]!;
    const round = pack.rounds[result.round]!;
    const place = pack.places[round.place]!;
    const within = result.km <= TOLERANCE_KM[place.precision];
    const last = isOver(state);
    const next = el("button", {
      type: "button",
      class: "primary",
      textContent: last ? strings.finish : strings.next,
      onclick: () => {
        revealed = false;
        century = null;
        if (!last) globe.reset();
        render();
      },
    });
    const when = round.hijri > 0 ? t("year_line", { year: year(round.year), ce: labels.terms.ce, hijri: year(round.hijri), ah: labels.terms.ah }) : t("year_line_ce", { year: year(round.year), ce: labels.terms.ce });
    const whenEl = el("p", { class: "kicker", textContent: when });
    whenEl.dir = "auto";
    fill(
      header(),
      el("div", { class: "row spread gap" }, el("span", { class: "kicker", textContent: t("round_of", { n: state.at, total: ROUNDS_PER_GAME }) }), dots()),
      el("h2", { textContent: labels.labels[round.id] ?? round.id }),
      whenEl,
      el("p", { class: "q good", textContent: t("answer_place", { place: labels.labels[place.id] ?? place.id }) }),
      el("div", { class: "big", textContent: t("result_points", { points: num(result.points) }) }),
      el("p", { class: "kicker", textContent: within ? strings.result_within : t("result_km", { km: num(result.km) }) }),
      result.centuryError === null ? null : el("p", { class: "note", textContent: result.centuryError === 0 ? strings.century_right : t("century_off", { n: result.centuryError }) }),
      el("div", { class: "links" }, el("a", { href: recordUrl(round.id), target: "_blank", rel: "noopener", textContent: strings.open_record }), el("a", { href: recordUrl(place.id), target: "_blank", rel: "noopener", textContent: strings.open_place })),
      next,
    );
    say(`${t("result_points", { points: num(result.points) })}. ${within ? strings.result_within : t("result_km", { km: num(result.km) })}`);
    next.focus();
  }

  function renderSummary(): void {
    const tally = centuryTally(state);
    const shareText = `${t("share_title", { date: `\u2066${state.key}\u2069`, points: num(totalPoints(state)), max: num(maxPoints(state)) })}\n${shareMarks(state)}`;
    const share = el("button", {
      type: "button",
      textContent: strings.share,
      onclick: async () => {
        try {
          await navigator.clipboard.writeText(shareText);
          share.textContent = strings.copied;
          say(strings.copied);
        } catch {
          /* clipboard refused: the text is on screen to select */
        }
      },
    });
    fill(
      header(),
      el("p", { class: "kicker gap", textContent: strings.total }),
      el("div", { class: "big", textContent: t("of_max", { points: num(totalPoints(state)), max: num(maxPoints(state)) }) }),
      el("div", { class: "marks", textContent: shareMarks(state), role: "img", ariaLabel: t("of_max", { points: num(totalPoints(state)), max: num(maxPoints(state)) }) }),
      tally.made > 0 ? el("p", { class: "note", textContent: t("centuries_right", { right: tally.right, made: tally.made }) }) : null,
      state.mode === "daily" ? el("p", { class: "note", textContent: strings.played_today }) : null,
      el("div", { class: "row gap" }, state.mode === "daily" ? share : null, el("button", { type: "button", textContent: state.mode === "daily" ? strings.play_practice : strings.new_practice, onclick: () => start("practice") }), state.mode === "practice" ? el("button", { type: "button", textContent: strings.play_daily, onclick: () => start("daily") }) : null),
      el("p", { class: "note", textContent: strings.sourced }),
      el("p", { class: "note", textContent: strings.local_score }),
    );
  }

  function render(): void {
    // The panel is rebuilt on every change. A keyboard user must not lose their place when it is, so focus goes
    // back to the control they were on (or, after the region hint is used up, to the submit button).
    const focused = document.activeElement instanceof HTMLElement && panel.contains(document.activeElement) ? document.activeElement.id : "";
    if (revealed) renderReveal();
    else if (isOver(state)) renderSummary();
    else {
      renderRound();
      if (focused) (document.getElementById(focused) ?? document.getElementById("submit"))?.focus();
    }
  }

  start(query.get("mode") === "practice" ? "practice" : "daily");
}

main().catch((e) => {
  document.getElementById("panel")!.textContent = e instanceof Error ? e.message : String(e);
  console.error(e);
});
