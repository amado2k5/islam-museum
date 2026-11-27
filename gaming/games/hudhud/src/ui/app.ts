// Hudhud's page. The picture is a canvas; everything a player reads or presses is ordinary page built here: the
// words of a conversation, the settings, the pause, the results and a list that says the whole scene in words and
// lets it be played without the picture. The rules are in sim/ and are only called from here.
import { loadMusicStrings, musicControl } from "@im/audio/control";
import { MUSIC_AVAILABLE, MUSIC_BASE, MusicPlayer } from "@im/audio/player";
import { Cues, type Cue } from "../audio/cues";
import { atlasCanvas, atlasHit, ATLASBOOK, drawAtlasBook } from "../art/atlasbook";
import { HAIRS, OUTFITS, SKINS, keeper as paintKeeper, portrait } from "../art/cast";
import { CLOCK_QUEST, clockPuzzle } from "../content/clock";
import { restoreClock } from "../sim/clock";
import { clockQuest, type ClockQuest } from "./clock";
import { CIPHER_QUEST, cipherPuzzle } from "../content/cipher";
import { restoreCipher } from "../sim/cipher";
import { cipherQuest, type CipherQuest } from "./cipher";
import { ALGEBRA_QUEST, algebraStart } from "../content/algebra";
import { restoreAlgebra } from "../sim/algebra";
import { algebraQuest, type AlgebraQuest } from "./algebra";
import { SHEETS_QUEST, sheetsMap } from "../content/sheets";
import { restoreSheets } from "../sim/sheets";
import { sheetsQuest, type SheetsQuest } from "./sheets";
import { SORT_QUEST, SORT_SUBJECT, sortDef } from "../content/sort";
import { restoreSort } from "../sim/sort";
import { sortQuest, type SortQuest } from "./sort";
import { PAPER_QUEST, PAPER_SUBJECT, paperPuzzle } from "../content/paper";
import { restorePaper } from "../sim/paper";
import { paperQuest, type PaperQuest } from "./paper";
import { ROUTE_QUEST, ROUTE_SUBJECT, routeStage } from "../content/route";
import { restoreRoute } from "../sim/route";
import { routeQuest, type RouteQuest } from "./route";
import { COUPLE_QUEST, COUPLE_SUBJECT, coupleOffer } from "../content/couple";
import { restoreCouple } from "../sim/couple";
import { coupleQuest, type CoupleQuest } from "./couple";
import { COFFEE_QUEST, COFFEE_SUBJECT, coffeeDef } from "../content/coffee";
import { coffeeQuest, type CoffeeQuest } from "./coffee";
import { CHANNELS_QUEST, CHANNELS_SUBJECT, channelsGrid } from "../content/channels";
import { restoreChannels } from "../sim/channels";
import { channelsQuest, type ChannelsQuest } from "./channels";
import { LEAVES_QUEST, LEAVES_SUBJECT, leavesPuzzle } from "../content/leaves";
import { restoreLeaves } from "../sim/leaves";
import { leavesQuest, type LeavesQuest } from "./leaves";
import { prologueScreen } from "./prologue";
import { JAR, RECORDS, SCRIPTS, THINGS, TURN_SLACK, inPlay, type PlayStyle, type Speaker } from "../content/workshop";
import { start, type Running } from "../game/boot";
import { Input } from "../input/input";
import { DEFAULT_PAD, PAD_ACTIONS, assignPad, type PadAction } from "../input/pad";
import { choicesOf, lineOf } from "../narrative/dialogue";
import { ACTIONS, DEFAULT_KEYS, SAVE_KEY, assignKey, current, load, markPrologueSeen, recordQuest, store, type Action, type Quality, type SaveFile, type Settings } from "../save/save";
import { askToPersist, openStore, saveChannel } from "@im/platform/save/idb";
import { openDurable, type Durable, type SaveStatus } from "../save/durable";
import { apply, beam, goals, newScene, restore, snapshot, type Command, type Happened, type SceneState } from "../sim/scene";
import type { SceneHost } from "../scenes/workshop";
import atlas from "../content/atlas.v1.json";
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
// The hook is made by the door (ui/gate.ts) and filled here; opened without the door, the page makes its own.
const hook: Record<string, unknown> = ((window as unknown as { __HH__?: Record<string, unknown> }).__HH__ ??= { ready: false, error: null });

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
  // The names of the ten worlds and the fifty subjects: a table of their own, the same keys in all seven languages.
  const atlasNames = (await import(`../../i18n-atlas/${lang}.json`)).default as Record<string, string>;
  const subjectName = (id: string): string => atlasNames[`s_${id.replace(/-/g, "_")}`] ?? id;
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
  /** Saves. `ownsResume` is true only when this page has just changed the quest in progress (see mergeSaves). */
  // The vault (IndexedDB) is the authority for what is kept; localStorage holds a copy so that the page can draw at
  // once and has something to fall back on. `durable` is null until the vault has been opened and read.
  let durable: Durable | null = null;
  const AT_KEY = "im.hudhud.save.at";
  const keep = (ownsResume = false) => {
    const ok = store(storage, save, mayStore, ownsResume);
    if (ok) {
      // store() joined in whatever another tab had saved; hold the same here.
      const now = load(storage);
      if (now.kind === "ok") save = { ...now.save, slot: save.slot };
      try {
        storage?.setItem(AT_KEY, String(Date.now()));
      } catch {
        /* the copy's own time is a help, not a need */
      }
    }
    // "Saved" is said by the vault when its write completes (showStatus), never here.
    void durable?.write(save, ownsResume);
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
    // Wherever the explorer is changed (the Atlas, the settings), the Atlas shows the same one.
    drawChoices();
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
  const atlasBtn = el("button", { type: "button", textContent: t("btn_atlas"), hidden: true, onclick: () => toAtlas() });
  // Full screen takes the whole page, so that the sheets (settings, pause, results) come with it. Where the browser
  // has no full screen for a page (an iPhone), the button is not shown.
  const canFull = typeof document.documentElement.requestFullscreen === "function";
  const fullBtn = el("button", { type: "button", textContent: t("btn_full"), hidden: !canFull, onclick: () => void (document.fullscreenElement ? document.exitFullscreen() : app.requestFullscreen().catch(() => undefined)) });
  document.addEventListener("fullscreenchange", () => (fullBtn.textContent = t(document.fullscreenElement ? "btn_full_exit" : "btn_full")));
  const musicBox = el("div", { class: "music-corner" });
  const bar = el("header", { class: "bar" }, el("h1", { textContent: t("title") }), el("span", { class: "chip", textContent: t("working_title") }), el("span", { class: "chip proto", textContent: t("prototype") }), el("span", { class: "grow" }), musicBox, atlasBtn, fullBtn, pauseBtn, settingsBtn);

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
  const stage = el("div", { class: "stage", id: "stage", tabIndex: 0 }, canvasBox, captions, prompt, pad);
  // The goal and the talk sit over the picture on a wide screen and beside it on a narrow one (ui/hudhud.css).
  const stageWrap = el("div", { class: "stage-wrap", hidden: true }, objective, stage, talkBox);
  const hub = el("section", { class: "hub" });
  // The second to seventh quests are played on a page of their own, beside the Atlas and the flying scene. One of them
  // is open at a time: `pageRun` is the one that is (see PAGE_QUESTS).
  const bench = el("section", { class: "bench", hidden: true });
  let pageRun: { quest: string; run: { node: HTMLElement; busy(): boolean; stop(): void } } | null = null;
  /** The open quest, if it is `quest`. */
  const pageOf = <T,>(quest: string): T | null => (pageRun?.quest === quest ? (pageRun.run as unknown as T) : null);
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
  const wordsBox = el("div", { class: "words" }, words, about);
  words.hidden = true;
  // The skip link lands here, on the Atlas or on the quest, whichever is showing.
  // The opening story comes first for a slot that has not seen it; it takes the place of the Atlas until it is left.
  const prologue = prologueScreen({
    t,
    num,
    rtl: RTL.includes(lang),
    look: () => slot().keeper,
    blocked: () => sheetOpen(),
    leave: () => leaveOpening(true),
  });
  const main = el("main", { id: "play", tabIndex: -1 }, prologue.node, hub, bench, stageWrap);
  app.append(bar, main, wordsBox, live, sheets);

  let toastTimer = 0;
  const toast = (text: string) => {
    document.querySelector(".toast")?.remove();
    const node = el("div", { class: "toast", textContent: text });
    node.setAttribute("role", "status");
    app.append(node);
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => node.remove(), 6000);
  };
  // ---------------------------------------------------------------------------------------- the vault
  const saveChip = el("span", { class: "chip save-state", hidden: true });
  saveChip.setAttribute("role", "status");
  const saveBanner = el("p", { class: "save-banner", hidden: true });
  saveBanner.setAttribute("role", "alert");
  bar.insertBefore(saveChip, musicBox);
  app.insertBefore(saveBanner, main);
  const clock = (ms: number) => new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : lang === "ur" ? "ur-PK" : lang, { hour: "2-digit", minute: "2-digit" }).format(new Date(ms));
  let saveStatus: SaveStatus = { state: "starting" };
  let persistence: "granted" | "denied" | "unsupported" | "unasked" = "unasked";
  const statusText = (st: SaveStatus): string => (st.state === "saving" ? t("save_saving") : st.state === "saved" ? (st.at > 0 ? t("save_saved", { time: clock(st.at) }) : t("save_saved_plain")) : st.state === "failed" ? t("save_failed") : st.state === "newer" ? t("save_newer") : st.state === "unavailable" ? t("save_unavailable") : "");
  function showStatus(st: SaveStatus): void {
    saveStatus = st;
    const quiet = query.get("fresh") === "1";
    saveChip.hidden = quiet || st.state === "starting" || (st.state === "saved" && st.at === 0) || st.state === "unavailable" || st.state === "newer";
    saveChip.textContent = statusText(st);
    // A save that did not go through, or cannot be made at all, is said where it cannot be missed.
    const loud = !quiet && (st.state === "failed" || st.state === "unavailable" || st.state === "newer");
    saveBanner.hidden = !loud;
    saveBanner.textContent = loud ? statusText(st) : "";
    document.querySelectorAll(".save-line").forEach((n) => (n.textContent = statusText(st)));
  }
  /** The page takes up a save the vault hands it: on the first read, from another tab, or from an imported file. */
  function adopt(next: SaveFile, why: "vault" | "tab" | "import"): void {
    const at = why === "tab" ? save.slot : next.slot;
    save = { ...next, slot: next.slots[at] ? at : next.slots.findIndex((x) => x !== null) };
    if (save.slot < 0) return;
    store(storage, save, mayStore, true);
    // The vault knows the opening was seen, and the player has not yet turned a panel: go straight to the Atlas.
    if (openingShown && slot().prologue && prologue.panel() === 1) leaveOpening(false);
    applyLook();
    if (!started) {
      fromSlot();
      drawHub();
    }
    render();
  }
  const channel = saveChannel("hudhud", () => void durable?.refresh());
  // Opened at the end of this function, once everything the vault may call back into exists.
  let ready: Promise<void> = Promise.resolve();
  const openVault = async (): Promise<void> => {
    if (query.get("fresh") === "1") return showStatus({ state: "saved", at: 0, revision: 0 });
    const idb = await openStore().catch(() => null);
    let localAt = 0;
    try {
      localAt = storage?.getItem(SAVE_KEY) ? Number(storage.getItem(AT_KEY)) || 1 : 0;
    } catch {
      localAt = 0;
    }
    durable = await openDurable(idb, save, localAt, { adopt, status: showStatus, told: (r) => channel.tell(r), now: () => Date.now() });
    // Whatever the page changed while the vault was being opened is written now.
    if (durable.status().state === "saved") void durable.write(save, false);
  };
  // A last save when the page is hidden or left: asked of the vault, and not waited for.
  const lastSave = () => void durable?.write(save, false);
  document.addEventListener("visibilitychange", () => document.hidden && lastSave());
  window.addEventListener("pagehide", lastSave);

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
  // A quest left in the middle comes back as it was, if what was saved can be trusted and is for this way of playing.
  let resumed = false;
  let state: SceneState = newScene(style());
  /** Takes the quest from the slot in use: its saved place if there is one that can be trusted, or a fresh start. */
  /** True while the saved place in the quest is one this page made or took up: only then may this page clear it. */
  let placeMine = false;
  const fromSlot = () => {
    const saved = slot().resume?.quest === QUEST ? restore(slot().resume!.snap) : null;
    // A saved place is played in the way it was begun: the way of playing follows it, never strands it.
    if (saved && !asked.style && saved.style !== settings().style) save = { ...save, slots: save.slots.map((x, i) => (i === save.slot && x ? { ...x, settings: { ...x.settings, style: saved.style } } : x)) };
    resumed = saved !== null && saved.style === style();
    state = resumed ? saved! : newScene(style());
    placeMine = resumed;
  };
  fromSlot();
  /** Saves the place in the quest. `clear` is for a deliberate new start: otherwise a page that has made no progress
   * of its own never wipes a place it did not make (one that another tab saved, say). */
  const checkpoint = (clear = false) => {
    const resume = state.done || (state.turns === 0 && state.flags.length === 0 && !state.dark) ? null : { quest: QUEST, snap: snapshot(state) as unknown };
    if (resume === null && !placeMine && !clear) return;
    // A place kept in another quest is never this quest's to wipe: only a place of its own is.
    if (resume === null && slot().resume && slot().resume!.quest !== QUEST) return;
    if (JSON.stringify(slot().resume) === JSON.stringify(resume)) return;
    save = { ...save, slots: save.slots.map((x, i) => (i === save.slot && x ? { ...x, resume } : x)) };
    placeMine = resume !== null;
    keep(true);
  };
  // Another tab of the game saved: this page takes up what is stored, so that it never works from an old copy. A
  // quest being played here goes on as it is; on the Atlas, the page shows what is now true.
  window.addEventListener("storage", (e) => {
    if (e.key !== SAVE_KEY || !mayStore) return;
    const now = load(storage);
    if (now.kind !== "ok" || !now.save.slots[save.slot]) return;
    save = { ...now.save, slot: save.slot };
    applyLook();
    if (!started) {
      fromSlot();
      drawHub();
      render();
    }
  });
  let running: Running | null = null;
  let paused = false;
  let started = false;
  /** A sheet is open over the game. Read from the page itself, never kept as a flag that can be left behind. */
  const sheetOpen = () => sheets.children.length > 0;
  /** The pause sheet while the game is paused. */
  let pauseNode: HTMLElement | null = null;
  let portraits: Record<string, string> = {};
  const log: { who: Speaker; key: string }[] = [];
  const frozen = () => !started || paused || sheetOpen() || state.talk !== null || state.done;
  const input = new Input({ press: (p) => press(p), pad: (on) => (toast(t(on ? "pad_on" : "pad_off")), !on && setPaused(true)) });
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
    // Kept after every step, also in the middle of a talk (which is not itself kept), so that a closed tab loses
    // nothing: not even the last mirror, turned a moment before the words of praise.
    checkpoint();
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
  function press(p: "touch" | "pause" | "next" | "back" | "up" | "down"): void {
    cues.unlock();
    if (p === "pause") return togglePause();
    if (!started || paused || sheetOpen()) return;
    if (state.talk) {
      // Where a talk offers choices, a controller moves among them and picks one: going "forward" would wait for ever.
      const choices = [...talkBox.querySelectorAll<HTMLButtonElement>(".choices button")];
      if (choices.length) {
        const at = Math.max(0, choices.indexOf(document.activeElement as HTMLButtonElement));
        if (p === "up" || p === "down") return choices[(at + (p === "up" ? choices.length - 1 : 1)) % choices.length]!.focus({ preventScroll: true });
        if (p === "next" || p === "touch") return choices[at]!.click();
      }
      if (p === "up" || p === "down") return;
      return run({ type: p === "back" ? "back" : "forward" });
    }
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
      // What a person of history is given to say here is invented, and is said to be, beside every such line.
      line.who === "scholar" ? el("p", { class: "dramatized", textContent: t("dramatized") }) : null,
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
    // Two things stop the beam: the books on their shelf and the tall jar on the floor. The words name the right one.
    const stopped: Key = tr.last.col === JAR.col && tr.last.row === JAR.row ? "beam_end_jar" : "beam_end_block";
    const end: Record<string, Key> = { target: "beam_end_target", block: stopped, wall: "beam_end_wall", loop: "beam_end_loop" };
    // Challenge is told only where the beam ends: which mirrors it met on the way is what the player works out.
    beamWords.textContent = style() === "challenge" ? t(end[tr.end]!) : `${names.length ? t("beam_path", { list: names.join(lang === "ar" || lang === "ur" ? "، " : ", ") }) : t("beam_none")} ${t(end[tr.end]!)}`;
    thingList.replaceChildren(
      ...THINGS.filter((k) => inPlay(k, state.puzzle) && !(k.kind === "feather" && g.feather)).map((k) => {
        const mirror = k.kind === "mirror" ? state.puzzle.mirrors.find((m) => `mirror-${m.id}` === k.id)! : null;
        const name = t(k.name as Key);
        const label = mirror ? `${t("alt_turn", { thing: t("mirror_state", { thing: name, lean: t(mirror.lean === "/" ? "lean_up" : mirror.lean === "-" ? "lean_flat" : "lean_down") }) })}` : k.kind === "page" && state.restored ? t("btn_finish") : t("alt_touch", { thing: name });
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
  /**
   * A slot that has not seen the opening, chosen in the settings, is shown it when the player closes the settings on
   * the Atlas; in the middle of a quest it waits for the next time a sheet is closed on the Atlas.
   */
  let openingDue = false;
  function afterSheet(): void {
    if (!openingDue || sheetOpen()) return;
    if (slot().prologue) {
      openingDue = false;
      return;
    }
    if (started || pageRun || openingShown) return;
    openingDue = false;
    readOpening(true);
  }
  function sheet(title: string, ...body: Array<Node | null | false>): HTMLElement {
    // A sheet that is already open is not opened a second time on top of itself (the toolbar stays in reach while a
    // sheet is up): the one that is open is shown again.
    const open = [...sheets.querySelectorAll<HTMLElement>(".sheet")].find((x) => x.firstElementChild?.getAttribute("aria-label") === title);
    if (open) {
      (open.querySelector("h2") as HTMLElement | null)?.focus({ preventScroll: true });
      return open;
    }
    const back = document.activeElement as HTMLElement | null;
    const close = () => {
      node.remove();
      // No sheet is left waiting to learn a key or a button once it is closed.
      input.disarm();
      // Closing the pause sheet, by its button or by Escape, is going on with the game.
      if (node === pauseNode) setPaused(false);
      back?.focus?.({ preventScroll: true });
      render();
      afterSheet();
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
    const node: HTMLElement = sheet(
      t("settings_title"),
      field(t("set_style"), select<PlayStyle>([["story", t("style_story")], ["explorer", t("style_explorer")], ["challenge", t("style_challenge")]], s.style, (v) => {
        // Choosing the way already in use changes nothing and must not start the quest again.
        const same = v === style();
        asked.style = null;
        change({ style: v as PlayStyle });
        if (!same) restart(false);
      }), `${t("style_story")}: ${t("style_story_how")} ${t("style_explorer")}: ${t("style_explorer_how")} ${t("style_challenge")}: ${t("style_challenge_how")} ${t("style_restart")}`),
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
      el("h3", { textContent: t("set_keys") }),
      keysBox(),
      el("h3", { textContent: t("set_saving") }),
      savingBox(),
      el("h3", { textContent: t("set_pad") }),
      padBox(),
      el("h3", { textContent: t("set_slot") }),
      field(t("set_slot"), select(save.slots.map((_, i) => [i, t("slot_n", { n: num(i + 1) })] as [number, string]), save.slot, (v) => {
        const i = Number(v);
        // A slot never used starts with this one's settings and explorer, and nothing done. Changing slot changes
        // no quest: each slot's place in its quest is left exactly as it was and is taken up again.
        save = { ...save, slot: i, slots: save.slots.map((x, j) => (j === i && !x ? { ...structuredClone(save.slots[save.slot]!), quests: {}, resume: null, prologue: undefined } : x)) };
        keep();
        applyLook();
        fromSlot();
        log.length = 0;
        redraw();
        if (!started) drawHub();
        // The sheet was drawn from the slot just left: draw it again from this one.
        openingDue = false;
        (node as unknown as { close: () => void }).close();
        openSettings();
        // The opening is shown when these settings are closed, if this slot has not seen it.
        openingDue = !slot().prologue;
      }), t("privacy")),
    );
  }
  const ACTION_NAME: Record<Action, Key> = { left: "btn_left", right: "btn_right", fly: "btn_fly", down: "key_down", touch: "btn_touch" };
  const keyName = (code: string) => code.replace(/^Key|^Digit/, "").replace(/^Arrow(.*)$/, (_, d: string) => ({ Left: "←", Right: "→", Up: "↑", Down: "↓" })[d] ?? d);
  /** One button an action: it shows the action's keys, and pressing it waits for the next key and gives it to the action. */
  function keysBox(): HTMLElement {
    const box = el("div", {});
    const draw = () => {
      box.replaceChildren(
        ...ACTIONS.map((a) => {
          const b = el("button", { type: "button", textContent: t("key_change", { action: t(ACTION_NAME[a]), keys: settings().keys[a].map(keyName).join(", ") || "—" }) });
          b.onclick = () => {
            b.textContent = t("key_press");
            input.capture = (code) => (change({ keys: assignKey(settings().keys, a, code) }), draw());
            // Leaving the button without pressing a key cancels.
            b.onblur = () => ((input.capture = null), draw());
          };
          return el("p", {}, b);
        }),
        el("p", {}, el("button", { type: "button", textContent: t("key_reset"), onclick: () => (change({ keys: structuredClone(DEFAULT_KEYS) }), draw()) })),
      );
    };
    draw();
    return box;
  }
  /** Saving, said in full: where progress is kept and how it can be lost, how it stands now, and the three things a
   * player can do about it (save now, take a copy out, bring a copy in). */
  function savingBox(): HTMLElement {
    const line = el("p", { class: "save-line", textContent: statusText(saveStatus) });
    line.setAttribute("role", "status");
    const pick = el("input", { type: "file", accept: ".json,application/json", hidden: true });
    pick.setAttribute("aria-hidden", "true");
    pick.onchange = async () => {
      const file = pick.files?.[0];
      pick.value = "";
      if (!file || !durable) return;
      const text = await file.text();
      const node: HTMLElement = sheet(
        t("btn_import"),
        el("p", { textContent: t("import_confirm") }),
        el("p", {}, el("button", { type: "button", textContent: t("btn_import"), onclick: async () => {
          const r = await durable!.importFile(text);
          (node as unknown as { close: () => void }).close();
          toast(t(r.ok ? "import_done" : "import_bad"));
        } })),
      );
    };
    const out = el("button", { type: "button", textContent: t("btn_export"), onclick: async () => {
      const text = await durable?.exportFile();
      if (!text) return toast(t("save_unavailable"));
      const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
      const a = el("a", { href: url, download: "hudhud-save.json" });
      document.body.append(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } });
    return el(
      "div",
      {},
      el("p", { class: "hint", textContent: t(saveStatus.state === "unavailable" ? "save_unavailable" : "save_note") }),
      line,
      persistence === "granted" || persistence === "denied" ? el("p", { class: "hint", textContent: t(persistence === "granted" ? "persist_granted" : "persist_denied") }) : null,
      el("p", { class: "row" }, el("button", { type: "button", textContent: t("btn_save"), onclick: () => keep(true) }), out, el("button", { type: "button", textContent: t("btn_import"), onclick: () => pick.click() }), pick),
    );
  }
  const PAD_NAME: Record<PadAction, Key> = { fly: "pad_fly", back: "btn_back", touch: "btn_touch", pause: "btn_pause" };
  /** The same for the controller: each action shows its button's number, and pressing it waits for the next button. */
  function padBox(): HTMLElement {
    const box = el("div", {});
    const draw = () => {
      box.replaceChildren(
        ...PAD_ACTIONS.map((a) => {
          const b = el("button", { type: "button", textContent: t("key_change", { action: t(PAD_NAME[a]), keys: t("pad_button", { n: num(settings().pad[a] + 1) }) }) });
          b.onclick = () => {
            b.textContent = t("pad_press");
            input.capturePad = (button) => (change({ pad: assignPad(settings().pad, a, button) }), draw());
            b.onblur = () => ((input.capturePad = null), draw());
          };
          return el("p", {}, b);
        }),
        el("p", {}, el("button", { type: "button", textContent: t("key_reset"), onclick: () => (change({ pad: { ...DEFAULT_PAD } }), draw()) })),
        el("p", { class: "hint", textContent: t("controls_pad") }),
      );
    };
    draw();
    return box;
  }
  function finish(): void {
    const g = goals(state);
    const mine = slot().resume?.quest === QUEST;
    save = { ...save, slots: save.slots.map((s, i) => (i === save.slot && s ? { ...recordQuest(s, QUEST, g), resume: mine ? null : s.resume } : s)) };
    keep(mine);
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
      el("p", { class: "row" }, el("button", { type: "button", textContent: t("btn_atlas"), onclick: () => ((node as unknown as { close: () => void }).close(), toAtlas()) }), el("button", { type: "button", textContent: t("play_again"), onclick: () => ((node as unknown as { close: () => void }).close(), restart(false)) })),
    );
  }

  // ---------------------------------------------------------------------------------------- starting, pausing
  function applyLook(): void {
    const s = settings();
    document.documentElement.style.setProperty("--text-scale", String(s.textScale));
    document.documentElement.classList.toggle("contrast", s.highContrast);
    cues.set(s.volume, s.muted);
    input.setKeys(s.keys);
    input.setPad(s.pad);
  }
  function restart(rebuild: boolean): void {
    state = newScene(style());
    resumed = false;
    checkpoint(true);
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
  /**
   * The one place the game is paused or set going again. Every way in and out comes here: the toolbar button,
   * Escape, the controller, the pause sheet's own button, a hidden tab, a controller pulled out. Going on closes
   * every sheet that was opened over the pause, so that nothing is left holding the game still.
   */
  function setPaused(on: boolean): void {
    if (on && (!started || state.done)) return;
    if (on === paused) return;
    paused = on;
    cues.hush(on);
    if (on) running?.game.loop.sleep();
    else running?.game.loop.wake();
    if (on) {
      pauseNode = sheet(t("paused"), el("p", { class: "row" }, el("button", { type: "button", textContent: t("btn_restart"), onclick: () => (setPaused(false), restart(false)) }), el("button", { type: "button", textContent: t("btn_save"), onclick: () => keep(true) }), el("button", { type: "button", textContent: t("btn_settings"), onclick: () => openSettings() })), el("p", { class: "save-line small", textContent: statusText(saveStatus) }));
      pauseNode.classList.add("pause");
    } else {
      pauseNode = null;
      sheets.replaceChildren();
      input.disarm();
    }
    render();
  }
  function togglePause(): void {
    if (!started || state.done) return;
    setPaused(!paused);
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) setPaused(true);
  });

  applyLook();
  // ---------------------------------------------------------------------------------------- the Atlas
  // The first thing a player sees: who they are, and the Atlas itself, ten worlds of five pages. Twelve quests can be
  // played; the others are named and said to be not built. Nothing here is a claim about history: the names are
  // the subjects' names and the grouping is a structure for play.
  const BUILT: Record<string, string> = { "ibn-al-haytham": QUEST, "al-jazari": CLOCK_QUEST, "al-kindi": CIPHER_QUEST, "al-khwarizmi": ALGEBRA_QUEST, "al-idrisi": SHEETS_QUEST, [SORT_SUBJECT]: SORT_QUEST, [PAPER_SUBJECT]: PAPER_QUEST, [ROUTE_SUBJECT]: ROUTE_QUEST, [COUPLE_SUBJECT]: COUPLE_QUEST, [COFFEE_SUBJECT]: COFFEE_QUEST, [CHANNELS_SUBJECT]: CHANNELS_QUEST, [LEAVES_SUBJECT]: LEAVES_QUEST };
  function startQuest(): void {
    cues.unlock();
    // Asked once, after a press as browsers require; the answer is shown in the settings and never asked again.
    if (persistence === "unasked" && query.get("fresh") !== "1") {
      persistence = "unsupported";
      void askToPersist().then((a) => (persistence = a));
    }
    started = true;
    hub.hidden = true;
    stageWrap.hidden = false;
    words.hidden = false;
    atlasBtn.hidden = false;
    running = begin();
    stage.focus({ preventScroll: true });
    render();
  }
  // The slot holds one place only, whichever quest it belongs to. The quests played on a page (the elephant clock, the
  // secret page, the locked box) share one rule: a quest with progress takes the place; a quest with none leaves another's alone; a
  // finished or restarted quest clears its own place only.
  /** What the slot holds for `quest`, if it can be trusted; null if it holds nothing, or another quest's place. */
  const pageSaved = <T,>(quest: string, restoreIt: (snap: unknown) => T | null): T | null => {
    const r = slot().resume;
    return r?.quest === quest ? restoreIt(r.snap) : null;
  };
  /** Keeps `quest`'s place (a snapshot), or clears it (null) if it is the quest's own. */
  const pageCheckpoint = (quest: string, snap: unknown | null) => {
    const old = slot().resume;
    const resume = snap === null ? null : { quest, snap };
    if (resume === null && old?.quest !== quest) return;
    if (JSON.stringify(old) === JSON.stringify(resume)) return;
    save = { ...save, slots: save.slots.map((x, i) => (i === save.slot && x ? { ...x, resume } : x)) };
    keep(true);
  };
  /** A quest on a page is finished: its goals are written into the save and its own place is cleared; another quest's place is not touched. */
  const pageFinish = (quest: string, g: { turns: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean }) => {
    const mine = slot().resume?.quest === quest;
    save = { ...save, slots: save.slots.map((s, i) => (i === save.slot && s ? { ...recordQuest(s, quest, g), resume: mine ? null : s.resume } : s)) };
    keep(mine);
  };
  /** Shows a quest's page in place of the Atlas. The note and the controls under the page are the flying scene's; each quest carries its own note, and nothing here can be paused. */
  function showBench(node: HTMLElement): void {
    hub.hidden = true;
    atlasBtn.hidden = false;
    bench.replaceChildren(node);
    bench.hidden = false;
    wordsBox.hidden = true;
    pauseBtn.hidden = true;
    // The Atlas may have been scrolled down when the quest was opened: bring the quest's heading to the top, at once (never a smooth scroll), and keep focus on it.
    const top = bench.querySelector("h2") as HTMLElement | null;
    top?.scrollIntoView({ behavior: "auto", block: "start" });
    top?.focus({ preventScroll: true });
  }
  /** The quests played on a page. Each has its own page and rules (ui/, sim/); what is shared is here: which subject it belongs to, what it has left in the middle, its line about being a trial, and how it is made. */
  type Common = Omit<Parameters<typeof algebraQuest>[0], "title" | "resume"> & { reducedMotion(): boolean };
  const PAGE_QUESTS: Record<string, { subject: string; trial: Key; saved: () => unknown | null; make: (common: Common, title: string, kept: unknown) => { node: HTMLElement; busy(): boolean; stop(): void } }> = {
    [CLOCK_QUEST]: {
      subject: "al-jazari",
      trial: "ck_trial",
      saved: () => pageSaved(CLOCK_QUEST, (snap) => restoreClock(snap, clockPuzzle)),
      make: (c, title, kept) => clockQuest({ ...c, title, resume: kept as Parameters<typeof clockQuest>[0]["resume"] }),
    },
    [CIPHER_QUEST]: {
      subject: "al-kindi",
      trial: "cf_trial",
      saved: () => pageSaved(CIPHER_QUEST, (snap) => restoreCipher(snap, cipherPuzzle)),
      make: (c, title, kept) => cipherQuest({ ...c, title, resume: kept as Parameters<typeof cipherQuest>[0]["resume"] }),
    },
    [ALGEBRA_QUEST]: {
      subject: "al-khwarizmi",
      trial: "ak_trial",
      saved: () => pageSaved(ALGEBRA_QUEST, (snap) => restoreAlgebra(snap, algebraStart)),
      make: (c, title, kept) => algebraQuest({ ...c, title, resume: kept as Parameters<typeof algebraQuest>[0]["resume"] }),
    },
    [SHEETS_QUEST]: {
      subject: "al-idrisi",
      trial: "id_trial",
      saved: () => pageSaved(SHEETS_QUEST, (snap) => restoreSheets(snap, sheetsMap)),
      make: (c, title, kept) => sheetsQuest({ ...c, title, resume: kept as Parameters<typeof sheetsQuest>[0]["resume"] }),
    },
    [SORT_QUEST]: {
      subject: SORT_SUBJECT,
      trial: "jz_trial",
      saved: () => pageSaved(SORT_QUEST, (snap) => restoreSort(snap, sortDef)),
      make: (c, title, kept) => sortQuest({ ...c, title, resume: kept as Parameters<typeof sortQuest>[0]["resume"] }),
    },
    [PAPER_QUEST]: {
      subject: PAPER_SUBJECT,
      trial: "pp_trial",
      saved: () => pageSaved(PAPER_QUEST, (snap) => restorePaper(snap, paperPuzzle)),
      make: (c, title, kept) => paperQuest({ ...c, title, resume: kept as Parameters<typeof paperQuest>[0]["resume"] }),
    },
    [ROUTE_QUEST]: {
      subject: ROUTE_SUBJECT,
      trial: "ib_trial",
      saved: () => pageSaved(ROUTE_QUEST, (snap) => restoreRoute(snap, routeStage)),
      make: (c, title, kept) => routeQuest({ ...c, title, resume: kept as Parameters<typeof routeQuest>[0]["resume"] }),
    },
    [COUPLE_QUEST]: {
      subject: COUPLE_SUBJECT,
      trial: "ts_trial",
      saved: () => pageSaved(COUPLE_QUEST, (snap) => restoreCouple(snap, coupleOffer)),
      make: (c, title, kept) => coupleQuest({ ...c, title, resume: kept as Parameters<typeof coupleQuest>[0]["resume"] }),
    },
    [COFFEE_QUEST]: {
      subject: COFFEE_SUBJECT,
      trial: "cq_trial",
      saved: () => pageSaved(COFFEE_QUEST, (snap) => restoreSort(snap, coffeeDef)),
      make: (c, title, kept) => coffeeQuest({ ...c, title, resume: kept as Parameters<typeof coffeeQuest>[0]["resume"] }),
    },
    [CHANNELS_QUEST]: {
      subject: CHANNELS_SUBJECT,
      trial: "ah_trial",
      saved: () => pageSaved(CHANNELS_QUEST, (snap) => restoreChannels(snap, channelsGrid)),
      make: (c, title, kept) => channelsQuest({ ...c, title, resume: kept as Parameters<typeof channelsQuest>[0]["resume"] }),
    },
    [LEAVES_QUEST]: {
      subject: LEAVES_SUBJECT,
      trial: "rz_trial",
      saved: () => pageSaved(LEAVES_QUEST, (snap) => restoreLeaves(snap, leavesPuzzle)),
      make: (c, title, kept) => leavesQuest({ ...c, title, resume: kept as Parameters<typeof leavesQuest>[0]["resume"] }),
    },
  };
  /** Opens a quest played on a page, with no flying scene. One left in the middle comes back. */
  function openPage(quest: string): void {
    const page = PAGE_QUESTS[quest]!;
    const kept = page.saved();
    cues.unlock();
    const common: Common = {
      t,
      num,
      lang,
      museum: MUSEUM,
      style,
      // One answer for every quest that animates a run: the game's own setting, the system preference, or `motion=reduced` in the address.
      reducedMotion: calm,
      keepPlace: (snap) => pageCheckpoint(quest, snap),
      tick: () => cues.play("line"),
      chime: () => cues.play("restored"),
      finish: (g) => pageFinish(quest, g),
      leave: () => toAtlas(),
    };
    pageRun = { quest, run: page.make(common, subjectName(page.subject), kept) };
    showBench(pageRun.run.node);
  }
  /** Leaves the quest for the Atlas. A quest in the middle stays saved; a finished one is cleared for another play. */
  function toAtlas(): void {
    const onPage = pageRun?.quest ?? null;
    if (onPage) {
      pageRun?.run.stop();
      pageRun = null;
      bench.replaceChildren();
      bench.hidden = true;
      wordsBox.hidden = false;
      pauseBtn.hidden = false;
      atlasBtn.hidden = true;
      hub.hidden = false;
      drawHub();
      // Back on the Atlas, its heading is brought to the top, at once, and holds the focus.
      const top = hub.querySelector("h2") as HTMLElement | null;
      top?.scrollIntoView({ behavior: "auto", block: "start" });
      top?.focus({ preventScroll: true });
      return;
    }
    setPaused(false);
    sheets.replaceChildren();
    pauseNode = null;
    running?.stop();
    running = null;
    canvasBox.replaceChildren();
    started = false;
    if (state.done) state = newScene(style());
    resumed = slot().resume?.quest === QUEST;
    stageWrap.hidden = true;
    words.hidden = true;
    atlasBtn.hidden = true;
    hub.hidden = false;
    drawHub();
    render();
    (hub.querySelector("button.primary") as HTMLElement | null)?.focus({ preventScroll: true });
  }
  // The player chooses who they are: a girl or a boy, a young explorer of the museum.
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
    const b = el("button", { type: "button", onclick: () => setKeeper({ kind, hair: kind === 1 ? 3 : 0 }) });
    explorerButtons.push(b);
    choose.append(b);
  }
  const again = el("button", { type: "button", class: "quiet", textContent: t("pro_reread"), onclick: () => readOpening(true) });
  again.dataset.opening = "again";
  // The Atlas laid open: one picture that shows how many pages are home, and a way to go to a world's list. It is a
  // helper and never the only way: every medallion is also a numbered button under it, and every world's list is on
  // the page below.
  const book = atlasCanvas();
  book.className = "book-art";
  book.setAttribute("role", "img");
  const bookHint = el("p", { class: "small", id: "book-hint", textContent: t("hub_book_pick") });
  const bookWorlds = el("div", { class: "book-worlds" });
  bookWorlds.setAttribute("role", "group");
  bookWorlds.setAttribute("aria-labelledby", "book-hint");
  const bookFigure = el("div", { class: "book" }, book, bookHint, bookWorlds);
  /** Takes the player to a world's list: scrolls it into view (not smoothly when motion is reduced) and focuses its heading. */
  function toWorld(order: number): void {
    const heading = hub.querySelector<HTMLElement>(`h3[data-world="${order}"]`);
    if (!heading) return;
    heading.scrollIntoView({ behavior: calm() ? "auto" : "smooth", block: "start" });
    heading.focus({ preventScroll: true });
  }
  for (const w of [...atlas.worlds].sort((a, b) => a.order - b.order)) {
    const b = el("button", { type: "button", class: "book-world", textContent: num(w.order), title: t("hub_world", { n: num(w.order), name: atlasNames[`world_${w.order}`] ?? w.name }), onclick: () => toWorld(w.order) });
    b.setAttribute("aria-label", t("hub_world", { n: num(w.order), name: atlasNames[`world_${w.order}`] ?? w.name }));
    b.dataset.world = String(w.order);
    bookWorlds.append(b);
  }
  book.addEventListener("click", (e) => {
    const r = book.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const order = atlasHit(((e.clientX - r.left) / r.width) * ATLASBOOK.w, ((e.clientY - r.top) / r.height) * ATLASBOOK.h, RTL.includes(lang));
    if (order !== null) toWorld(order);
  });
  /** Which pages are home in each world, and which worlds have a quest that can be played, in the order of the Atlas. */
  const pictureData = () => {
    const quests = slot().quests;
    const worlds = [...atlas.worlds].sort((a, b) => a.order - b.order);
    return {
      worlds: worlds.length,
      home: worlds.map((w) => atlas.subjects.filter((x) => x.world === w.id && BUILT[x.id] !== undefined && quests[BUILT[x.id]!]?.done === true).length),
      open: worlds.filter((w) => atlas.subjects.some((x) => x.world === w.id && BUILT[x.id] !== undefined)).map((w) => w.order),
    };
  };
  function drawHub(): void {
    drawChoices();
    const quests = slot().quests;
    const home = Object.values(quests).filter((q) => q.done).length;
    const worlds = atlas.worlds.map((w) => {
      const items = atlas.subjects
        .filter((sub) => sub.world === w.id)
        .map((sub) => {
          const name = subjectName(sub.id);
          const quest = BUILT[sub.id];
          const story = sub.kind === "literature" ? el("small", { textContent: t("quest_story") }) : null;
          if (!quest) return el("li", { class: "closed" }, el("span", { textContent: name }), story, el("small", { textContent: t("quest_closed") }));
          const rec = quests[quest];
          const page = PAGE_QUESTS[quest];
          if (page) {
            // One button on the Atlas is the main one (the flying scene); the quests played on a page have an ordinary button.
            const kept = page.saved();
            const b = el("button", { type: "button", textContent: t(kept ? "quest_continue" : rec?.done ? "quest_again" : "quest_play", { name }), onclick: () => openPage(quest) });
            b.dataset.quest = quest;
            const item = el("li", { class: "open" }, b, el("small", { textContent: t(page.trial) }));
            if (rec?.done) item.append(el("small", { textContent: t("quest_home", { n: num([rec.curiosity, rec.ingenuity, rec.kindness, rec.feather].filter(Boolean).length) }) }));
            if (kept) item.append(el("small", { textContent: t("resume_note") }), el("button", { type: "button", textContent: t("btn_restart_quest"), onclick: () => (pageCheckpoint(quest, null), drawHub()) }));
            return item;
          }
          const label: Key = resumed ? "quest_continue" : rec?.done ? "quest_again" : "quest_play";
          const li = el("li", { class: "open" }, el("button", { type: "button", class: "primary", textContent: t(label, { name }), onclick: () => startQuest() }), story);
          if (rec?.done) li.append(el("small", { textContent: t("quest_home", { n: num([rec.curiosity, rec.ingenuity, rec.kindness, rec.feather].filter(Boolean).length) }) }));
          if (resumed) li.append(el("small", { textContent: t("resume_note") }), el("button", { type: "button", textContent: t("btn_restart"), onclick: () => (restart(false), drawHub()) }));
          return li;
        });
      const heading = el("h3", { textContent: t("hub_world", { n: num(w.order), name: atlasNames[`world_${w.order}`] ?? w.name }), tabIndex: -1 });
      heading.dataset.world = String(w.order);
      return el("section", { class: "world" }, heading, el("ol", {}, ...items));
    });
    // The picture is drawn again every time the Atlas is: after a quest, a change of slot, or another tab's save.
    const picture = pictureData();
    book.setAttribute("aria-label", t("hub_book_alt", { n: num(home), total: num(atlas.subjects.length) }));
    drawAtlasBook(book, { ...picture, rtl: RTL.includes(lang) });
    hub.replaceChildren(
      el("h2", { textContent: t("hub_title"), tabIndex: -1 }),
      el("p", { class: "progress", textContent: t("hub_progress", { n: num(home), total: num(atlas.subjects.length) }) }),
      bookFigure,
      choose,
      el("p", { class: "small", textContent: t("cover_more") }),
      el("p", { class: "small", textContent: t("start_hint") }),
      el("div", { class: "worlds" }, ...worlds),
      el("p", { class: "small", textContent: t("hub_note") }),
      el("p", { class: "again" }, again),
    );
  }
  // ---------------------------------------------------------------------------------------- the opening story
  let openingShown = false;
  /** Shows the opening from its first panel, in place of the Atlas. */
  function readOpening(focus = true): void {
    openingShown = true;
    hub.hidden = true;
    prologue.open(1, focus);
  }
  /** Leaves the opening for the Atlas. Finished or skipped, it is recorded as seen in this slot, once; read again by
   * choice and left, nothing more is written. */
  function leaveOpening(record: boolean): void {
    if (!openingShown) return;
    openingShown = false;
    prologue.close();
    if (record && !slot().prologue) {
      save = markPrologueSeen(save);
      keep();
    }
    hub.hidden = false;
    drawHub();
    (hub.querySelector("button.primary") as HTMLElement | null)?.focus({ preventScroll: true });
  }
  drawHub();
  render();

  ready = openVault();
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
    saveStatus: () => saveStatus,
    saveReady: () => ready.then(() => durable?.settled()).then(() => saveStatus),
    persistence: () => persistence,
    toAtlas: () => toAtlas(),
    atlasPicture: () => pictureData(),
    startClock: () => openPage(CLOCK_QUEST),
    clock: () => { const r = pageOf<ClockQuest>(CLOCK_QUEST); return r ? { ...r.state(), busy: r.busy() } : null; },
    clockCommand: (c: Parameters<ClockQuest["command"]>[0]) => pageOf<ClockQuest>(CLOCK_QUEST)?.command(c),
    startCipher: () => openPage(CIPHER_QUEST),
    cipher: () => { const r = pageOf<CipherQuest>(CIPHER_QUEST); return r ? { ...r.state(), busy: r.busy() } : null; },
    cipherCommand: (c: Parameters<CipherQuest["command"]>[0]) => pageOf<CipherQuest>(CIPHER_QUEST)?.command(c),
    startAlgebra: () => openPage(ALGEBRA_QUEST),
    algebra: () => { const r = pageOf<AlgebraQuest>(ALGEBRA_QUEST); return r ? { ...r.state(), busy: r.busy(), sentence: r.sentence() } : null; },
    algebraCommand: (c: Parameters<AlgebraQuest["command"]>[0]) => pageOf<AlgebraQuest>(ALGEBRA_QUEST)?.command(c),
    startSheets: () => openPage(SHEETS_QUEST),
    sheets: () => { const r = pageOf<SheetsQuest>(SHEETS_QUEST); return r ? { ...r.state(), busy: r.busy(), selected: r.selected(), status: r.status() } : null; },
    sheetsCommand: (c: Parameters<SheetsQuest["command"]>[0]) => pageOf<SheetsQuest>(SHEETS_QUEST)?.command(c),
    startSort: () => openPage(SORT_QUEST),
    sort: () => { const r = pageOf<SortQuest>(SORT_QUEST); return r ? { ...r.state(), busy: r.busy(), selected: r.selected(), status: r.status() } : null; },
    sortCommand: (c: Parameters<SortQuest["command"]>[0]) => pageOf<SortQuest>(SORT_QUEST)?.command(c),
    startPaper: () => openPage(PAPER_QUEST),
    paper: () => { const r = pageOf<PaperQuest>(PAPER_QUEST); return r ? { ...r.state(), busy: r.busy(), selected: r.selected(), status: r.status() } : null; },
    paperCommand: (c: Parameters<PaperQuest["command"]>[0]) => pageOf<PaperQuest>(PAPER_QUEST)?.command(c),
    startRoute: () => openPage(ROUTE_QUEST),
    route: () => { const r = pageOf<RouteQuest>(ROUTE_QUEST); return r ? { ...r.state(), busy: r.busy(), sentence: r.sentence(), status: r.status() } : null; },
    routeCommand: (c: Parameters<RouteQuest["command"]>[0]) => pageOf<RouteQuest>(ROUTE_QUEST)?.command(c),
    startCouple: () => openPage(COUPLE_QUEST),
    couple: () => { const r = pageOf<CoupleQuest>(COUPLE_QUEST); return r ? { ...r.state(), busy: r.busy(), status: r.status() } : null; },
    coupleCommand: (c: Parameters<CoupleQuest["command"]>[0]) => pageOf<CoupleQuest>(COUPLE_QUEST)?.command(c),
    startCoffee: () => openPage(COFFEE_QUEST),
    coffee: () => { const r = pageOf<CoffeeQuest>(COFFEE_QUEST); return r ? { ...r.state(), busy: r.busy(), selected: r.selected(), status: r.status() } : null; },
    coffeeCommand: (c: Parameters<CoffeeQuest["command"]>[0]) => pageOf<CoffeeQuest>(COFFEE_QUEST)?.command(c),
    startChannels: () => openPage(CHANNELS_QUEST),
    channels: () => { const r = pageOf<ChannelsQuest>(CHANNELS_QUEST); return r ? { ...r.state(), busy: r.busy(), selected: r.selected(), status: r.status() } : null; },
    channelsCommand: (c: Parameters<ChannelsQuest["command"]>[0]) => pageOf<ChannelsQuest>(CHANNELS_QUEST)?.command(c),
    startLeaves: () => openPage(LEAVES_QUEST),
    leaves: () => { const r = pageOf<LeavesQuest>(LEAVES_QUEST); return r ? { ...r.state(), busy: r.busy(), selected: r.selected(), status: r.status() } : null; },
    leavesCommand: (c: Parameters<LeavesQuest["command"]>[0]) => pageOf<LeavesQuest>(LEAVES_QUEST)?.command(c),
    resumed: () => resumed,
    keys: () => settings().keys,
    prologue: () => ({ shown: openingShown, panel: openingShown ? prologue.panel() : 0 }),
    skipPrologue: () => leaveOpening(true),
  });
  // A slot that has not seen the opening opens on it. A page opened to go straight into the quest (a test or a
  // capture) shows no opening and records nothing.
  if (query.get("autostart") === "1") startQuest();
  else if (!slot().prologue) readOpening(false);
}

main().catch((e) => {
  hook.error = String(e);
  const app = document.getElementById("app");
  if (app) app.textContent = String(e);
});
