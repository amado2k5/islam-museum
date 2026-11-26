// Hudhud's page. The picture is a canvas; everything a player reads or presses is ordinary page built here: the
// words of a conversation, the settings, the pause, the results and a list that says the whole scene in words and
// lets it be played without the picture. The rules are in sim/ and are only called from here.
import { loadMusicStrings, musicControl } from "@im/audio/control";
import { MUSIC_AVAILABLE, MUSIC_BASE, MusicPlayer } from "@im/audio/player";
import { Cues, type Cue } from "../audio/cues";
import { HAIRS, OUTFITS, SKINS, keeper as paintKeeper, portrait } from "../art/cast";
import { RECORDS, SCRIPTS, THINGS, TURN_SLACK, type PlayStyle, type Speaker } from "../content/workshop";
import { start, type Running } from "../game/boot";
import { Input } from "../input/input";
import { choicesOf, lineOf } from "../narrative/dialogue";
import { current, load, recordQuest, store, type Quality, type SaveFile, type Settings } from "../save/save";
import { apply, beam, goals, newScene, type Command, type Happened, type SceneState } from "../sim/scene";
import type { SceneHost } from "../scenes/workshop";
import en from "../../i18n/en.json";

type Strings = Record<Exclude<keyof typeof en, "_meta">, string>;
type Key = keyof Strings;
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
type Lang = (typeof LANGS)[number];
const RTL: readonly string[] = ["ar", "ur"];
const MUSEUM = "https://islam.museum";
const QUEST = "w03q1-ibn-al-haytham";

const query = new URLSearchParams(location.search);
const lang: Lang = (LANGS as readonly string[]).includes(query.get("lang") ?? "") ? (query.get("lang") as Lang) : "en";
const hook: Record<string, unknown> = { ready: false, error: null };
(window as unknown as { __HH__: unknown }).__HH__ = hook;

type Props<K extends keyof HTMLElementTagNameMap> = Partial<HTMLElementTagNameMap[K]> & { class?: string };
const el = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Props<K> = {}, ...children: Array<Node | string | null | false>): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  const { class: cls, ...rest } = props;
  if (cls) node.className = cls;
  Object.assign(node, rest);
  for (const c of children) if (c !== null && c !== false) node.append(c);
  return node;
};

async function main(): Promise<void> {
  const strings = (await import(`../../i18n/${lang}.json`)).default as Strings;
  const t = (key: Key, vars: Record<string, string | number> = {}): string => strings[key].replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));
  const num = (n: number) => new Intl.NumberFormat(lang === "ar" ? "ar-EG" : lang === "ur" ? "ur-PK" : lang).format(n);
  document.documentElement.lang = lang;
  document.documentElement.dir = RTL.includes(lang) ? "rtl" : "ltr";
  document.title = t("title");
  (document.querySelector(".skip") as HTMLElement).textContent = t("skip");

  // ---------------------------------------------------------------------------------------- what is kept
  const storage = (() => {
    try {
      return query.get("fresh") === "1" ? null : window.localStorage;
    } catch {
      return null;
    }
  })();
  const loaded = load(storage);
  let save: SaveFile = loaded.save;
  const mayStore = loaded.stored;
  const slot = () => current(save);
  const settings = (): Settings => slot().settings;
  const keep = () => {
    const ok = store(storage, save, mayStore);
    if (ok) {
      // store() joined in whatever another tab had saved; hold the same here.
      const now = load(storage);
      if (now.kind === "ok") save = { ...now.save, slot: save.slot };
    }
    return ok;
  };
  const change = (patch: Partial<Settings>) => {
    save = { ...save, slots: save.slots.map((s, i) => (i === save.slot && s ? { ...s, settings: { ...s.settings, ...patch } } : s)) };
    keep();
    applyLook();
  };
  type Look = ReturnType<typeof slot>["keeper"];
  const setKeeper = (patch: Partial<Look>) => {
    save = { ...save, slots: save.slots.map((x, i) => (i === save.slot && x ? { ...x, keeper: { ...x.keeper, ...patch } } : x)) };
    keep();
  };
  const girl = () => slot().keeper.kind === 1;
  /** The Storykeeper's name and lines in the form that fits the explorer the player chose. */
  const whoName = (who: Speaker): string => t((who === "keeper" && girl() ? "who_keeper_f" : `who_${who}`) as Key);
  const lineText = (who: Speaker, key: string): string => t((who === "keeper" && girl() && `${key}_f` in strings ? `${key}_f` : key) as Key);
  // The address can ask for a way of playing, for tests and captures; it is not saved unless the player changes it.
  const asked = { style: query.get("style"), q: query.get("q"), motion: query.get("motion") };
  const style = (): PlayStyle => (["story", "explorer", "challenge"].includes(asked.style ?? "") ? (asked.style as PlayStyle) : settings().style);
  const quality = (): Quality => (["low", "medium", "high"].includes(asked.q ?? "") ? (asked.q as Quality) : settings().quality);
  const calm = () => asked.motion === "reduced" || settings().reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------------------------------------------------------------------------------------- the page
  const app = document.getElementById("app")!;
  const live = el("div", { class: "visually-hidden", role: "status" });
  live.setAttribute("aria-live", "polite");
  const pauseBtn = el("button", { type: "button", textContent: t("btn_pause"), onclick: () => togglePause() });
  const settingsBtn = el("button", { type: "button", textContent: t("btn_settings"), onclick: () => openSettings() });
  const musicBox = el("div", { class: "music-corner" });
  const bar = el("header", { class: "bar" }, el("h1", { textContent: t("title") }), el("span", { class: "chip", textContent: t("working_title") }), el("span", { class: "chip proto", textContent: t("prototype") }), el("span", { class: "grow" }), musicBox, pauseBtn, settingsBtn);

  const canvasBox = el("div", { class: "canvas-box" });
  const objective = el("div", { class: "objective" });
  const prompt = el("div", { class: "prompt", hidden: true });
  const captions = el("div", { class: "captions" });
  captions.setAttribute("aria-hidden", "true");
  const hold = (label: Key, glyph: string, cls = "") => {
    const b = el("button", { type: "button", class: cls, textContent: glyph });
    b.setAttribute("aria-label", t(label));
    return b;
  };
  const bLeft = hold("btn_left", "◀");
  const bRight = hold("btn_right", "▶");
  const bFly = hold("btn_fly", "▲");
  const bTouch = el("button", { type: "button", class: "wide", textContent: t("btn_touch"), onclick: () => press("touch") });
  const pad = el("div", { class: "pad" }, el("div", {}, bLeft, bRight), el("div", {}, bTouch, bFly));
  const talkBox = el("div", { class: "talk", hidden: true });
  talkBox.setAttribute("role", "group");
  const cover = el("div", { class: "cover" });
  const stage = el("div", { class: "stage", id: "stage", tabIndex: 0 }, canvasBox, captions, prompt, pad, cover);
  // The goal and the talk sit over the picture on a wide screen and beside it on a narrow one (ui/hudhud.css).
  const stageWrap = el("div", { class: "stage-wrap" }, objective, stage, talkBox);
  stage.setAttribute("role", "application");
  stage.setAttribute("aria-label", t("canvas_label"));

  const beamWords = el("p", {});
  beamWords.setAttribute("aria-live", "polite");
  const thingList = el("ul", {});
  const words = el("section", {}, el("h2", { textContent: t("alt_title") }), beamWords, thingList);
  const about = el(
    "section",
    {},
    el("h2", { textContent: t("note_title") }),
    el("p", { textContent: t("review_note") }),
    el("p", { class: "small", textContent: t("art_note") }),
    el("p", { class: "small", textContent: t("privacy") }),
    el("h2", { textContent: t("controls_title") }),
    el("p", { class: "small", textContent: t("controls_keys") }),
    el("p", { class: "small", textContent: t("controls_touch") }),
    el("p", { class: "small", textContent: t("controls_pad") }),
    el("p", {}, el("a", { href: `${MUSEUM}/${lang}/`, textContent: t("museum") })),
  );
  const sheets = el("div", {});
  app.append(bar, stageWrap, el("div", { class: "words" }, words, about), live, sheets);

  let toastTimer = 0;
  const toast = (text: string) => {
    document.querySelector(".toast")?.remove();
    const node = el("div", { class: "toast", textContent: text });
    node.setAttribute("role", "status");
    document.body.append(node);
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => node.remove(), 6000);
  };
  if (loaded.kind === "newer") toast(t("save_newer"));
  else if (loaded.kind === "quarantined") toast(t("save_quarantined"));
  else if (!loaded.stored && query.get("fresh") !== "1") toast(t("save_off"));

  // ---------------------------------------------------------------------------------------- sound
  const cues = new Cues();
  const music = new MusicPlayer({ base: MUSIC_BASE, first: "the-first-light", forceOff: query.get("music") === "off" || !MUSIC_AVAILABLE });
  // The soundtrack is the museum's own suite, through the control every game shares.
  if (MUSIC_AVAILABLE) musicBox.append(musicControl(music, await loadMusicStrings(lang), `${MUSEUM}/${lang}/backstage/`));
  const CAPTION: Partial<Record<Cue, Key>> = { mirror: "cap_mirror", restored: "cap_restored", purr: "cap_purr", dark: "cap_dark", light: "cap_light", secret: "cap_secret", call: "cap_call", feather: "cap_feather" };
  const sound = (c: Cue) => {
    cues.play(c);
    const key = CAPTION[c];
    if (!key || !settings().captions) return;
    const line = el("div", { textContent: t(key) });
    captions.append(line);
    while (captions.children.length > 3) captions.firstChild?.remove();
    window.setTimeout(() => line.remove(), 3200);
  };

  // ---------------------------------------------------------------------------------------- the game
  let state: SceneState = newScene(style());
  let running: Running | null = null;
  let paused = false;
  let started = false;
  let sheetOpen = false;
  let portraits: Record<string, string> = {};
  const log: { who: Speaker; key: string }[] = [];
  const frozen = () => !started || paused || sheetOpen || state.talk !== null || state.done;
  const input = new Input({ press: (p) => press(p), pad: (on) => (toast(t(on ? "pad_on" : "pad_off")), !on && started && !paused && togglePause()) });
  input.bindHold(bLeft, "left");
  input.bindHold(bRight, "right");
  input.bindHold(bFly, "jump");

  const host: SceneHost = {
    state: () => state,
    intent: () => input.intent(),
    frozen,
    touch: (id) => run({ type: "touch", id }),
    near: (id) => {
      const thing = THINGS.find((k) => k.id === id);
      prompt.hidden = !thing;
      if (thing) prompt.textContent = t("touch_prompt", { thing: t(thing.name as Key) });
    },
    sound,
    speaking: () => (state.talk ? { who: lineOf(SCRIPTS, state.talk).who, mood: lineOf(SCRIPTS, state.talk).mood } : null),
    look: () => ({ quality: quality(), reducedMotion: calm(), style: style(), keeper: slot().keeper }),
    portraits: (urls) => (portraits = urls),
  };

  function run(c: Command): void {
    const r = apply(state, c);
    state = r.state;
    for (const h of r.happened) react(h);
    running?.scene()?.happened(r.happened);
    render();
  }
  function react(h: Happened): void {
    if (h.type === "mirror") sound("mirror");
    else if (h.type === "restored") sound("restored");
    else if (h.type === "purr") sound("purr");
    else if (h.type === "dark") sound(h.on ? "dark" : "light");
    else if (h.type === "secret") sound("secret");
    else if (h.type === "feather") sound("feather");
    else if (h.type === "talk") sound("call");
    else if (h.type === "line") cues.play("line");
    else if (h.type === "done") finish();
  }
  function press(p: "touch" | "pause" | "next" | "back"): void {
    cues.unlock();
    if (p === "pause") return togglePause();
    if (!started || paused || sheetOpen) return;
    if (state.talk) return run({ type: p === "back" ? "back" : "forward" });
    if (p === "touch") running?.scene()?.touchNear();
  }

  // The words of a conversation: revealed at the chosen speed for the eye, given whole to a screen reader at once.
  let typing = 0;
  let shownLine = "";
  function renderTalk(): void {
    const talk = state.talk;
    talkBox.hidden = !talk;
    if (!talk) {
      shownLine = "";
      return;
    }
    const line = lineOf(SCRIPTS, talk);
    const id = `${talk.script}/${talk.node}/${talk.line}`;
    const text = lineText(line.who, line.key);
    const choices = choicesOf(SCRIPTS, talk, new Set(state.flags));
    if (shownLine !== id && !log.some((l, i) => i === log.length - 1 && l.key === line.key)) log.push({ who: line.who, key: line.key });
    const fresh = shownLine !== id;
    shownLine = id;
    const lineEl = el("p", { class: "line" });
    lineEl.setAttribute("aria-hidden", "true");
    const speed = calm() ? 0 : settings().textSpeed;
    window.clearInterval(typing);
    if (fresh && speed > 0) {
      let shown = 0;
      const chars = [...text];
      typing = window.setInterval(() => {
        shown = Math.min(chars.length, shown + 1);
        lineEl.textContent = chars.slice(0, shown).join("");
        if (shown >= chars.length) window.clearInterval(typing);
      }, 1000 / speed);
    } else lineEl.textContent = text;
    const who = whoName(line.who);
    if (fresh) live.textContent = `${who}: ${text}`;
    const next = el("button", { type: "button", class: "primary", textContent: t("btn_next"), onclick: () => run({ type: "forward" }) });
    const body = el(
      "div",
      {},
      el("p", { class: "who", textContent: who }),
      lineEl,
      el("span", { class: "visually-hidden", textContent: text }),
      choices.length
        ? el(
            "div",
            { class: "choices" },
            ...choices.map((c, i) => el("button", { type: "button", onclick: () => run({ type: "choose", index: i }) }, c.deeper ? el("span", { class: "deeper", textContent: t("deeper_mark") }) : null, t(c.key as Key))),
          )
        : null,
      el(
        "div",
        { class: "row" },
        choices.length ? null : next,
        talk.line > 0 ? el("button", { type: "button", textContent: t("btn_back"), onclick: () => run({ type: "back" }) }) : null,
        el("button", { type: "button", class: "quiet", textContent: t("btn_log"), onclick: () => openLog() }),
        el("button", { type: "button", class: "quiet", textContent: t("btn_skip"), onclick: () => run({ type: "skip" }) }),
      ),
    );
    const face = portraits[line.who];
    talkBox.replaceChildren(face ? el("img", { src: face, alt: "", width: 120, height: 120 }) : el("span", {}), body);
    if (fresh) (choices.length ? (talkBox.querySelector(".choices button") as HTMLElement | null) : next)?.focus({ preventScroll: true });
  }

  function render(): void {
    renderTalk();
    const g = goals(state);
    objective.replaceChildren(t(state.restored ? "objective_done" : "objective_light"), el("small", { textContent: t("turns", { n: num(state.turns) }) }));
    if (style() === "story" && !state.restored) objective.append(el("small", { textContent: t("hint_story") }));
    pad.hidden = state.talk !== null || !started;
    stageWrap.classList.toggle("talking", state.talk !== null);
    if (state.talk) prompt.hidden = true;
    // The scene in words.
    const tr = beam(state);
    const names = tr.touched.map((id) => t(THINGS.find((k) => k.id === `mirror-${id}`)!.name as Key));
    const end: Record<string, Key> = { target: "beam_end_target", block: "beam_end_block", wall: "beam_end_wall", loop: "beam_end_loop" };
    beamWords.textContent = `${names.length ? t("beam_path", { list: names.join(lang === "ar" || lang === "ur" ? "، " : ", ") }) : t("beam_none")} ${t(end[tr.end]!)}`;
    thingList.replaceChildren(
      ...THINGS.filter((k) => !(k.kind === "feather" && g.feather)).map((k) => {
        const mirror = k.kind === "mirror" ? state.puzzle.mirrors.find((m) => `mirror-${m.id}` === k.id)! : null;
        const name = t(k.name as Key);
        const label = mirror ? `${t("alt_turn", { thing: t("mirror_state", { thing: name, lean: t(mirror.lean === "/" ? "lean_up" : "lean_down") }) })}` : k.kind === "page" && state.restored ? t("btn_finish") : t("alt_touch", { thing: name });
        const b = el("button", { type: "button", textContent: label, disabled: frozen(), onclick: () => {
          cues.unlock();
          // With no picture (WebGL would not start) there is no bird to fly there: the list touches the thing itself.
          const scene = running?.scene();
          if (mirror || !scene) run({ type: "touch", id: k.id });
          else scene.goTo(k.id);
        } });
        return el("li", {}, b);
      }),
    );
    pauseBtn.textContent = t(paused ? "btn_resume" : "btn_pause");
  }

  // ---------------------------------------------------------------------------------------- sheets
  function sheet(title: string, ...body: Array<Node | null | false>): HTMLElement {
    sheetOpen = true;
    const back = document.activeElement as HTMLElement | null;
    const close = () => {
      node.remove();
      sheetOpen = sheets.children.length > 0;
      back?.focus?.({ preventScroll: true });
      render();
    };
    const closeBtn = el("button", { type: "button", class: "primary", textContent: t("btn_close"), onclick: close });
    const heading = el("h2", { textContent: title, tabIndex: -1 });
    const section = el("section", {}, heading, ...body, el("p", {}, closeBtn));
    section.setAttribute("role", "dialog");
    section.setAttribute("aria-modal", "true");
    section.setAttribute("aria-label", title);
    const node = el("div", { class: "sheet" }, section);
    // Keep the keyboard inside the sheet while it is open, and let Escape close it.
    node.addEventListener("keydown", (e) => {
      if (e.key === "Escape") (e.stopPropagation(), close());
      if (e.key !== "Tab") return;
      const all = [...section.querySelectorAll<HTMLElement>("button, select, input, a[href]")].filter((x) => !x.hasAttribute("disabled"));
      const first = all[0];
      const last = all[all.length - 1];
      if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last?.focus());
      else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first?.focus());
    });
    (node as unknown as { close: () => void }).close = close;
    sheets.append(node);
    heading.focus({ preventScroll: true });
    render();
    return node;
  }
  function openLog(): void {
    sheet(t("log_title"), log.length ? el("div", {}, ...log.map((l) => el("p", {}, el("strong", { textContent: `${whoName(l.who)}: ` }), lineText(l.who, l.key)))) : el("p", { textContent: t("log_empty") }));
  }
  function field(label: string, control: HTMLElement, hint?: string): HTMLElement {
    const id = `f-${label.replace(/\W+/g, "-")}-${Math.round(performance.now())}`;
    control.id = id;
    const l = el("label", { textContent: label });
    l.htmlFor = id;
    return el("div", {}, el("div", { class: "field" }, l, control), hint ? el("p", { class: "hint", textContent: hint }) : null);
  }
  const select = <T extends string | number>(options: [T, string][], value: T, on: (v: string) => void) => {
    const s = el("select", { onchange: () => on(s.value) }, ...options.map(([v, text]) => el("option", { value: String(v), textContent: text, selected: v === value })));
    return s;
  };
  const range = (min: number, max: number, step: number, value: number, on: (v: number) => void) => {
    const r = el("input", { type: "range", min: String(min), max: String(max), step: String(step), value: String(value) });
    r.oninput = () => on(Number(r.value));
    return r;
  };
  const check = (value: boolean, on: (v: boolean) => void) => {
    const c = el("input", { type: "checkbox", checked: value });
    c.onchange = () => on(c.checked);
    return c;
  };
  function openSettings(): void {
    const s = settings();
    const k = slot().keeper;
    const keeper = (patch: Partial<typeof k>) => {
      setKeeper(patch);
      redraw();
    };
    const pick = (n: number, value: number, on: (v: number) => void) => select(Array.from({ length: n }, (_, i) => [i, t("option_n", { n: num(i + 1) })] as [number, string]), value, (v) => on(Number(v)));
    const vol = (g: "ambience" | "voices" | "effects") => range(0, 1, 0.05, s.volume[g], (v) => change({ volume: { ...settings().volume, [g]: v } }));
    sheet(
      t("settings_title"),
      field(t("set_style"), select<PlayStyle>([["story", t("style_story")], ["explorer", t("style_explorer")], ["challenge", t("style_challenge")]], s.style, (v) => ((asked.style = null), change({ style: v as PlayStyle }), restart(false))), `${t("style_story")}: ${t("style_story_how")} ${t("style_explorer")}: ${t("style_explorer_how")} ${t("style_challenge")}: ${t("style_challenge_how")} ${t("style_restart")}`),
      field(t("set_quality"), select<Quality>([["low", t("q_low")], ["medium", t("q_medium")], ["high", t("q_high")]], s.quality, (v) => ((asked.q = null), change({ quality: v as Quality }), redraw()))),
      field(t("set_motion"), check(s.reducedMotion, (v) => change({ reducedMotion: v }))),
      field(t("set_contrast"), check(s.highContrast, (v) => change({ highContrast: v }))),
      field(t("set_text"), range(1, 1.6, 0.1, s.textScale, (v) => change({ textScale: v }))),
      field(t("set_speed"), select([[0, t("speed_instant")], [24, t("speed_slow")], [40, t("q_medium")], [80, t("speed_fast")]], s.textSpeed, (v) => change({ textSpeed: Number(v) }))),
      el("h3", { textContent: t("set_keeper") }),
      field(t("keeper_kind"), select<number>([[1, t("keeper_girl")], [0, t("keeper_boy")]], k.kind, (v) => keeper({ kind: Number(v) }))),
      field(t("keeper_skin"), pick(SKINS.length, k.skin, (v) => keeper({ skin: v }))),
      field(t("keeper_outfit"), pick(OUTFITS.length, k.outfit, (v) => keeper({ outfit: v }))),
      field(t("keeper_hair"), pick(HAIRS, k.hair, (v) => keeper({ hair: v }))),
      el("h3", { textContent: t("set_sound") }),
      field(t("set_ambience"), vol("ambience")),
      field(t("set_voices"), vol("voices")),
      field(t("set_effects"), vol("effects")),
      field(t("set_mute"), check(s.muted, (v) => change({ muted: v }))),
      field(t("set_captions"), check(s.captions, (v) => change({ captions: v }))),
      el("h3", { textContent: t("set_slot") }),
      field(t("set_slot"), select(save.slots.map((_, i) => [i, t("slot_n", { n: num(i + 1) })] as [number, string]), save.slot, (v) => {
        const i = Number(v);
        save = { ...save, slot: i, slots: save.slots.map((x, j) => (j === i && !x ? structuredClone(save.slots[save.slot]!) : x)).map((x, j) => (j === i && x ? { ...x, quests: save.slots[i]?.quests ?? {} } : x)) };
        keep();
        applyLook();
        restart(true);
      }), t("privacy")),
    );
  }
  function finish(): void {
    const g = goals(state);
    save = { ...save, slots: save.slots.map((s, i) => (i === save.slot && s ? recordQuest(s, QUEST, g) : s)) };
    keep();
    const slack = TURN_SLACK[state.style];
    const goal = (mark: string, name: Key, how: string, met: boolean) => el("li", {}, el("span", { class: "mark", textContent: mark }), el("span", {}, el("strong", { textContent: t(name) }), el("br", {}), el("span", { class: "small", textContent: how })), el("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    const names: Key[] = ["rec_person", "rec_darkroom", "rec_book"];
    const node = sheet(
      t("results_title"),
      el("p", { textContent: t("turns", { n: num(g.turns) }) }),
      el(
        "ul",
        { class: "goals" },
        goal("✦", "goal_curiosity", t("goal_curiosity_how"), g.curiosity),
        goal("⚙", "goal_ingenuity", slack === null ? t("goal_ingenuity_story") : t("goal_ingenuity_how", { n: num(g.par + slack) }), g.ingenuity),
        goal("♥", "goal_kindness", t("goal_kindness_how"), g.kindness),
        goal("❧", "goal_feather", t("goal_feather_how"), g.feather),
      ),
      el(
        "div",
        { class: "note" },
        el("h3", { textContent: t("note_title") }),
        el("p", { textContent: t("note_1") }),
        el("p", { textContent: t("note_2") }),
        el("p", { textContent: t("note_3") }),
        el("p", { textContent: t("note_uncertain") }),
        el("p", { class: "pending", textContent: t("review_note") }),
        ...RECORDS.map((id, i) => el("p", {}, el("a", { href: `${MUSEUM}/${lang}/${id}/`, textContent: t("note_link", { name: t(names[i]!) }) }))),
      ),
      el("p", {}, el("button", { type: "button", textContent: t("play_again"), onclick: () => ((node as unknown as { close: () => void }).close(), restart(false)) })),
    );
  }

  // ---------------------------------------------------------------------------------------- starting, pausing
  function applyLook(): void {
    const s = settings();
    document.documentElement.style.setProperty("--text-scale", String(s.textScale));
    document.documentElement.classList.toggle("contrast", s.highContrast);
    cues.set(s.volume, s.muted);
  }
  function restart(rebuild: boolean): void {
    state = newScene(style());
    log.length = 0;
    if (!started) return render();
    if (rebuild || !running) {
      running?.stop();
      canvasBox.replaceChildren();
      running = begin();
    } else running.game.scene.start("workshop", { host });
    render();
  }
  /** Draws the picture anew and keeps the quest as it stands: a change of effects or of the Storykeeper's look, or a
   * graphics context that came back. The bird returns to the door; nothing the player has done is undone. */
  function redraw(): void {
    if (!started) return;
    running?.stop();
    canvasBox.replaceChildren();
    running = begin();
    render();
  }
  function begin(): Running | null {
    try {
      const r = start(canvasBox, host, quality(), { perf: query.get("perf") === "1", onLost: () => toast(t("context_lost")), onRestored: () => redraw() });
      hook.game = r;
      return r;
    } catch (e) {
      hook.error = String(e);
      toast(t("error_webgl"));
      return null;
    }
  }
  function togglePause(): void {
    if (!started || state.done) return;
    paused = !paused;
    cues.hush(paused);
    if (paused) running?.game.loop.sleep();
    else running?.game.loop.wake();
    document.querySelector(".sheet.pause")?.remove();
    if (paused) {
      const node = sheet(t("paused"), el("p", { class: "row" }, el("button", { type: "button", textContent: t("btn_restart"), onclick: () => (leave(), restart(false)) }), el("button", { type: "button", textContent: t("btn_settings"), onclick: () => openSettings() })));
      node.classList.add("pause");
      const leave = () => {
        paused = false;
        cues.hush(false);
        running?.game.loop.wake();
        (node as unknown as { close: () => void }).close();
      };
      // Closing the pause sheet, by its button or by Escape, is going on with the game.
      new MutationObserver(() => {
        if (!node.isConnected && paused) ((paused = false), cues.hush(false), running?.game.loop.wake(), render());
      }).observe(sheets, { childList: true });
    }
    render();
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && started && !paused && !state.done) togglePause();
  });

  applyLook();
  const play = el("button", { type: "button", class: "primary", textContent: t("start") });
  play.onclick = () => {
    cues.unlock();
    started = true;
    cover.remove();
    running = begin();
    stage.focus({ preventScroll: true });
    render();
  };
  // Before anything else, the player chooses who they are: a girl or a boy, a young explorer of the museum.
  const choose = el("fieldset", { class: "choose" }, el("legend", { textContent: t("cover_choose") }));
  const explorerButtons: HTMLButtonElement[] = [];
  const drawChoices = () => {
    const now = slot().keeper;
    explorerButtons.forEach((b, i) => {
      const kind = i === 0 ? 1 : 0;
      b.setAttribute("aria-pressed", String(now.kind === kind));
      // Each face is drawn by the same code as the figure in the scene, in the look that would be played.
      const look = { ...now, kind, hair: now.kind === kind ? now.hair : kind === 1 ? 3 : 0 };
      const art = paintKeeper(1, look);
      b.replaceChildren(portrait(1, { back: art.body, head: art.head }, now.kind === kind ? "#f2b94b" : "#3fa39b").canvas, el("span", { textContent: t(kind === 1 ? "keeper_girl" : "keeper_boy") }));
    });
  };
  for (const kind of [1, 0]) {
    const b = el("button", { type: "button", onclick: () => (setKeeper({ kind, hair: kind === 1 ? 3 : 0 }), drawChoices()) });
    explorerButtons.push(b);
    choose.append(b);
  }
  drawChoices();
  cover.append(el("h2", { textContent: t("subtitle") }), choose, el("p", { class: "small", textContent: t("cover_more") }), el("p", { textContent: t("start_hint") }), play);
  render();

  Object.assign(hook, {
    ready: true,
    lang,
    state: () => state,
    goals: () => goals(state),
    beam: () => beam(state),
    where: () => running?.scene()?.where() ?? null,
    info: () => ({ ...(running?.scene()?.info() ?? {}), drawCalls: running?.drawCalls() ?? null, soundsStarted: cues.started, saved: mayStore }),
    resetFrames: () => running?.scene()?.resetFrames(),
    touch: (id: string) => run({ type: "touch", id }),
    goTo: (id: string) => running?.scene()?.goTo(id),
    command: (c: Command) => run(c),
    restart: (rebuild: boolean) => restart(rebuild),
    redraw: () => redraw(),
    started: () => started,
  });
  if (query.get("autostart") === "1") play.click();
}

main().catch((e) => {
  hook.error = String(e);
  const app = document.getElementById("app");
  if (app) app.textContent = String(e);
});
