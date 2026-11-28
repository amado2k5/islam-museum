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
import { restoreRoom, type RoomCommand } from "../sim/jazariroom";
import { jazariRoom, type JazariRoom } from "./jazari";
import { restoreTusi, type TusiCommand } from "../sim/tusiroom";
import { tusiRoom, type TusiRoom } from "./tusi";
import { restoreKhwarizmi, type KhwarizmiCommand } from "../sim/khwarizmiroom";
import { khwarizmiRoom, type KhwarizmiRoom } from "./khwarizmi";
import { restoreKindi, type KindiCommand } from "../sim/kindiroom";
import { kindiRoom, type KindiRoom } from "./kindi";
import { restoreIdrisi, type IdrisiCommand } from "../sim/idrisiroom";
import { idrisiRoom, type IdrisiRoom } from "./idrisi";
import { restoreRazi, type RaziCommand } from "../sim/raziroom";
import { raziRoom, type RaziRoom } from "./razi";
import { restoreKarima, type KarimaCommand } from "../sim/karimaroom";
import { karimaRoom, type KarimaRoom } from "./karima";
import { restoreBattuta, type BattutaCommand } from "../sim/battutaroom";
import { battutaRoom, type BattutaRoom } from "./battuta";
import { CQR_SPEC } from "../content/coffee-room";
import { restoreSortRoom, type SortRoomCommand } from "../sim/sortroom";
import { coffeeRoom, type CoffeeRoom } from "./coffeeroom";
import { JZR_SPEC } from "../content/jahiz-room";
import { jahizRoom, type JahizRoom } from "./jahizroom";
import { restoreAlhambra, type AlhambraCommand } from "../sim/alhambraroom";
import { alhambraRoom, type AlhambraRoom } from "./alhambraroom";
import { restoreSamarkand, type SamarkandCommand } from "../sim/samarkandroom";
import { samarkandRoom, type SamarkandRoom } from "./samarkand";
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
import { COLLATE_QUEST, COLLATE_SUBJECT, collatePuzzle } from "../content/collate";
import { restoreCollate } from "../sim/collate";
import { collateQuest, type CollateQuest } from "./collate";
import { prologueScreen } from "./prologue";
import { corridorStrip, type CorridorStrip } from "./corridor";
import { BUILT, JOURNEY, WORKSHOP_QUEST, subjectOf } from "../content/journey";
import { DOOR, JAR, RECORDS, SCRIPTS, THINGS, TURN_SLACK, inPlay, type PlayStyle, type Speaker } from "../content/workshop";
import { start, type Running } from "../game/boot";
import { Input } from "../input/input";
import { DEFAULT_PAD, PAD_ACTIONS, assignPad, type PadAction } from "../input/pad";
import { choicesOf, lineOf } from "../narrative/dialogue";
import { ACTIONS, DEFAULT_KEYS, SAVE_KEY, assignKey, current, load, markPrologueSeen, recordQuest, store, type Action, type Journey, type Quality, type SaveFile, type Settings } from "../save/save";
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
const QUEST = WORKSHOP_QUEST;

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
  // Once the flying quest is done: its goals and the museum's note, beside the stage and not over it, so that the bird
  // stays free to walk to the lit door (the journey, content/journey.ts).
  const doorPanel = el("section", { class: "door-panel", hidden: true });
  doorPanel.setAttribute("aria-labelledby", "door-panel-title");
  const hub = el("section", { class: "hub" });
  // The second to seventh quests are played on a page of their own, beside the Atlas and the flying scene. One of them
  // is open at a time: `pageRun` is the one that is (see PAGE_QUESTS).
  const bench = el("section", { class: "bench", hidden: true });
  let pageRun: { quest: string; run: { node: HTMLElement; busy(): boolean; stop(): void } } | null = null;
  // A scene with a room of its own (al-Jazari's workshop, al-Tusi's observatory, al-Khwarizmi's room, al-Kindi's room,
  // al-Idrisi's hall, al-Razi's study, Karima al-Marwaziyya's room, Ibn Battuta's inn, the coffee room, al-Jahiz's room,
  // the Alhambra's court and the paper workshop of Samarkand, since 27 November 2026: every scene of the journey) is
  // opened like a page quest and shown here, as wide as the flying scene's stage. Its page quest stays as the way it is
  // played without WebGL.
  const roomBox = el("section", { class: "room-box", hidden: true });
  type AnyRoom = JazariRoom | TusiRoom | KhwarizmiRoom | KindiRoom | IdrisiRoom | RaziRoom | KarimaRoom | BattutaRoom | CoffeeRoom | JahizRoom | AlhambraRoom | SamarkandRoom;
  /** The open room, if a scene is being played in its room. */
  const openRoom = (): AnyRoom | null => (pageRun && "press" in pageRun.run ? (pageRun.run as unknown as AnyRoom) : null);
  /** The open room, if it is `quest`'s. */
  const roomOf = <T,>(quest: string): T | null => (pageRun?.quest === quest && "press" in pageRun.run ? (pageRun.run as unknown as T) : null);
  // Rooms need WebGL; `room=off` in the address plays the scene on its page (for the checks of the page quest).
  let webgl: boolean | null = null;
  const roomsOn = (): boolean => {
    if (query.get("room") === "off") return false;
    if (webgl === null) {
      try {
        const probe = document.createElement("canvas");
        webgl = !!(probe.getContext("webgl2") ?? probe.getContext("webgl"));
      } catch {
        webgl = false;
      }
    }
    return webgl;
  };
  /** The open quest's page, if it is `quest` played on its page (not in its room). */
  const pageOf = <T,>(quest: string): T | null => (pageRun?.quest === quest && !("press" in pageRun.run) ? (pageRun.run as unknown as T) : null);
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
  const main = el("main", { id: "play", tabIndex: -1 }, prologue.node, hub, bench, roomBox, stageWrap, doorPanel);
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
  const CAPTION: Partial<Record<Cue, Key>> = { mirror: "cap_mirror", restored: "cap_restored", purr: "cap_purr", dark: "cap_dark", light: "cap_light", secret: "cap_secret", call: "cap_call", feather: "cap_feather", gong: "jr_cap_gong" };
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
  // A finished quest no longer holds the world still: the bird walks on to the lit door.
  const frozen = () => !started || paused || sheetOpen() || state.talk !== null;
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
      prompt.hidden = !thing && id !== "door";
      if (id === "door") prompt.textContent = t("jn_go_door");
      else if (thing) prompt.textContent = t("touch_prompt", { thing: t(thing.name as Key) });
    },
    through: () => moveOn(),
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
    const room = openRoom();
    if (room) return room.press(p);
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
    objective.replaceChildren(t(state.done ? "jn_objective_door" : state.restored ? "objective_done" : "objective_light"), el("small", { textContent: t("turns", { n: num(state.turns) }) }));
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
    // Once the quest is done, the list holds one thing: the door.
    if (state.done) thingList.replaceChildren(el("li", {}, el("button", { type: "button", textContent: t("jn_go_door"), onclick: () => moveOn() })));
    else thingList.replaceChildren(
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
        save = { ...save, slot: i, slots: save.slots.map((x, j) => (j === i && !x ? { ...structuredClone(save.slots[save.slot]!), quests: {}, resume: null, prologue: undefined, journey: undefined } : x)) };
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
    journeyDone(QUEST);
    keep(mine);
    // No sheet over the picture: the goals and the note sit beside it, the door lights, and the bird is free to go.
    const slack = TURN_SLACK[state.style];
    const goal = (mark: string, name: Key, how: string, met: boolean) => el("li", {}, el("span", { class: "mark", textContent: mark }), el("span", {}, el("strong", { textContent: t(name) }), el("br", {}), el("span", { class: "small", textContent: how })), el("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    const names: Key[] = ["rec_person", "rec_darkroom", "rec_book"];
    const said = `${t("who_hudhud")}: ${t("jn_door_lit")}`;
    doorPanel.replaceChildren(
      el("h2", { id: "door-panel-title", textContent: t("jn_panel_title"), tabIndex: -1 }),
      el("p", { class: "door-line" }, el("strong", { textContent: `${t("who_hudhud")}: ` }), t("jn_door_lit")),
      el("p", { class: "row" }, el("button", { type: "button", class: "door-go", textContent: t("jn_go_door"), onclick: () => moveOn() }), el("button", { type: "button", textContent: t("play_again"), onclick: () => restart(false) }), el("button", { type: "button", textContent: t("btn_atlas"), onclick: () => toAtlas() })),
      el("h3", { textContent: t("results_title") }),
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
    );
    doorPanel.hidden = false;
    live.textContent = said;
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
    doorPanel.hidden = true;
    doorPanel.replaceChildren();
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
    if (!started) return openRoom()?.redraw();
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
  // Which quests are built, by subject, is content/journey.ts's BUILT.
  /** Opens the flying scene. `journeyAt` is the scene's place in the journey, or null for free play from the Atlas. */
  function startQuest(journeyAt: number | null = null): void {
    inJourney = journeyAt;
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
    journeyDone(quest);
    keep(mine);
  };
  /** Shows a quest's page in place of the Atlas. The note and the controls under the page are the flying scene's; each quest carries its own note, and nothing here can be paused. */
  function showBench(node: HTMLElement, box: HTMLElement = bench): void {
    hub.hidden = true;
    atlasBtn.hidden = false;
    box.replaceChildren(node);
    box.hidden = false;
    wordsBox.hidden = true;
    pauseBtn.hidden = true;
    // The Atlas may have been scrolled down when the quest was opened: bring the quest's heading to the top, at once (never a smooth scroll), and keep focus on it.
    const top = box.querySelector("h2") as HTMLElement | null;
    top?.scrollIntoView({ behavior: "auto", block: "start" });
    top?.focus({ preventScroll: true });
  }
  /** The quests played on a page. Each has its own page and rules (ui/, sim/); what is shared is here: which subject it belongs to, what it has left in the middle, its line about being a trial, and how it is made. */
  type Common = Omit<Parameters<typeof algebraQuest>[0], "title" | "resume"> & { reducedMotion(): boolean };
  const PAGE_QUESTS: Record<string, { subject: string; trial: Key; saved: () => unknown | null; make: (common: Common, title: string, kept: unknown) => { node: HTMLElement; busy(): boolean; stop(): void }; room?: () => boolean; makeRoom?: (common: Common, title: string) => AnyRoom }> = {
    [CLOCK_QUEST]: {
      subject: "al-jazari",
      trial: "ck_trial",
      // One kept place serves both: the room's snapshot is the clock's own with what Hudhud carries added.
      saved: () => pageSaved(CLOCK_QUEST, (snap) => restoreClock(snap, clockPuzzle)),
      make: (c, title, kept) => clockQuest({ ...c, title, resume: kept as Parameters<typeof clockQuest>[0]["resume"] }),
      // Al-Jazari's workshop: the clock played by flying, in a room of its own.
      room: roomsOn,
      makeRoom: (c, title) =>
        jazariRoom({
          ...c,
          title,
          quality,
          keeper: () => slot().keeper,
          textSpeed: () => settings().textSpeed,
          perf: query.get("perf") === "1",
          intent: () => input.intent(),
          bindHold: (b, what) => input.bindHold(b, what),
          blocked: () => sheetOpen(),
          sound,
          toast,
          // The goals are written into the save; the room's own door leads on (no corridor).
          finish: (g) => pageFinish(CLOCK_QUEST, g),
          through: () => moveOn(),
          fallback: () => openPage(CLOCK_QUEST, inJourney, true),
          resume: pageSaved(CLOCK_QUEST, restoreRoom),
          keepPlace: (snap) => pageCheckpoint(CLOCK_QUEST, snap),
        }),
    },
    [CIPHER_QUEST]: {
      subject: "al-kindi",
      trial: "cf_trial",
      // One kept place serves both: the room's snapshot is the secret page's own with what Hudhud carries added.
      saved: () => pageSaved(CIPHER_QUEST, (snap) => restoreCipher(snap, cipherPuzzle)),
      make: (c, title, kept) => cipherQuest({ ...c, title, resume: kept as Parameters<typeof cipherQuest>[0]["resume"] }),
      // Al-Kindi's room: the secret page played by flying, in a room of its own.
      room: roomsOn,
      makeRoom: (c, title) =>
        kindiRoom({
          ...c,
          title,
          quality,
          keeper: () => slot().keeper,
          textSpeed: () => settings().textSpeed,
          perf: query.get("perf") === "1",
          intent: () => input.intent(),
          bindHold: (b, what) => input.bindHold(b, what),
          blocked: () => sheetOpen(),
          sound,
          toast,
          // The goals are written into the save; the room's own door leads on (no corridor).
          finish: (g) => pageFinish(CIPHER_QUEST, g),
          through: () => moveOn(),
          fallback: () => openPage(CIPHER_QUEST, inJourney, true),
          resume: pageSaved(CIPHER_QUEST, restoreKindi),
          keepPlace: (snap) => pageCheckpoint(CIPHER_QUEST, snap),
        }),
    },
    [ALGEBRA_QUEST]: {
      subject: "al-khwarizmi",
      trial: "ak_trial",
      // One kept place serves both: the room keeps the locked box's own snapshot.
      saved: () => pageSaved(ALGEBRA_QUEST, (snap) => restoreAlgebra(snap, algebraStart)),
      make: (c, title, kept) => algebraQuest({ ...c, title, resume: kept as Parameters<typeof algebraQuest>[0]["resume"] }),
      // Al-Khwarizmi's room: the locked box played by flying, in a room of its own.
      room: roomsOn,
      makeRoom: (c, title) =>
        khwarizmiRoom({
          ...c,
          title,
          quality,
          keeper: () => slot().keeper,
          textSpeed: () => settings().textSpeed,
          perf: query.get("perf") === "1",
          intent: () => input.intent(),
          bindHold: (b, what) => input.bindHold(b, what),
          blocked: () => sheetOpen(),
          sound,
          toast,
          // The goals are written into the save; the room's own door leads on (no corridor).
          finish: (g) => pageFinish(ALGEBRA_QUEST, g),
          through: () => moveOn(),
          fallback: () => openPage(ALGEBRA_QUEST, inJourney, true),
          resume: pageSaved(ALGEBRA_QUEST, restoreKhwarizmi),
          keepPlace: (snap) => pageCheckpoint(ALGEBRA_QUEST, snap),
        }),
    },
    [SHEETS_QUEST]: {
      subject: "al-idrisi",
      trial: "id_trial",
      // One kept place serves both: the hall's snapshot is the scattered sheets' own with the lifted sheet added.
      saved: () => pageSaved(SHEETS_QUEST, (snap) => restoreSheets(snap, sheetsMap)),
      make: (c, title, kept) => sheetsQuest({ ...c, title, resume: kept as Parameters<typeof sheetsQuest>[0]["resume"] }),
      // Al-Idrisi's hall: the scattered sheets played by flying, in a room of their own.
      room: roomsOn,
      makeRoom: (c, title) =>
        idrisiRoom({
          ...c,
          title,
          quality,
          keeper: () => slot().keeper,
          textSpeed: () => settings().textSpeed,
          perf: query.get("perf") === "1",
          intent: () => input.intent(),
          bindHold: (b, what) => input.bindHold(b, what),
          blocked: () => sheetOpen(),
          sound,
          toast,
          // The goals are written into the save; the hall's own door leads on (no corridor).
          finish: (g) => pageFinish(SHEETS_QUEST, g),
          through: () => moveOn(),
          fallback: () => openPage(SHEETS_QUEST, inJourney, true),
          resume: pageSaved(SHEETS_QUEST, restoreIdrisi),
          keepPlace: (snap) => pageCheckpoint(SHEETS_QUEST, snap),
        }),
    },
    [SORT_QUEST]: {
      subject: SORT_SUBJECT,
      trial: "jz_trial",
      // One kept place serves both: the room keeps the sorting's own snapshot with the card in Hudhud's beak added.
      saved: () => pageSaved(SORT_QUEST, (snap) => restoreSort(snap, sortDef)),
      make: (c, title, kept) => sortQuest({ ...c, title, resume: kept as Parameters<typeof sortQuest>[0]["resume"] }),
      // Al-Jahiz's room: the animal cards sorted by flying, in a room of their own (the shared sorting room, ui/sortroom.ts).
      room: roomsOn,
      makeRoom: (c, title) =>
        jahizRoom({
          ...c,
          title,
          quality,
          keeper: () => slot().keeper,
          textSpeed: () => settings().textSpeed,
          perf: query.get("perf") === "1",
          intent: () => input.intent(),
          bindHold: (b, what) => input.bindHold(b, what),
          blocked: () => sheetOpen(),
          sound,
          toast,
          // The goals are written into the save; the room's own door leads on (no corridor).
          finish: (g) => pageFinish(SORT_QUEST, g),
          through: () => moveOn(),
          fallback: () => openPage(SORT_QUEST, inJourney, true),
          resume: pageSaved(SORT_QUEST, (snap) => restoreSortRoom(JZR_SPEC, snap)),
          keepPlace: (snap) => pageCheckpoint(SORT_QUEST, snap),
        }),
    },
    [PAPER_QUEST]: {
      subject: PAPER_SUBJECT,
      trial: "pp_trial",
      // One kept place serves both: the workshop's snapshot is the paper's own with the lifted card added.
      saved: () => pageSaved(PAPER_QUEST, (snap) => restorePaper(snap, paperPuzzle)),
      make: (c, title, kept) => paperQuest({ ...c, title, resume: kept as Parameters<typeof paperQuest>[0]["resume"] }),
      // The paper workshop of Samarkand: the paper made by flying, in a room of its own.
      room: roomsOn,
      makeRoom: (c, title) =>
        samarkandRoom({
          ...c,
          title,
          quality,
          keeper: () => slot().keeper,
          textSpeed: () => settings().textSpeed,
          perf: query.get("perf") === "1",
          intent: () => input.intent(),
          bindHold: (b, what) => input.bindHold(b, what),
          blocked: () => sheetOpen(),
          sound,
          toast,
          // The goals are written into the save; the workshop's own door leads on (no corridor).
          finish: (g) => pageFinish(PAPER_QUEST, g),
          through: () => moveOn(),
          fallback: () => openPage(PAPER_QUEST, inJourney, true),
          resume: pageSaved(PAPER_QUEST, restoreSamarkand),
          keepPlace: (snap) => pageCheckpoint(PAPER_QUEST, snap),
        }),
    },
    [ROUTE_QUEST]: {
      subject: ROUTE_SUBJECT,
      trial: "ib_trial",
      // One kept place serves both: the inn keeps the road's own snapshot.
      saved: () => pageSaved(ROUTE_QUEST, (snap) => restoreRoute(snap, routeStage)),
      make: (c, title, kept) => routeQuest({ ...c, title, resume: kept as Parameters<typeof routeQuest>[0]["resume"] }),
      // Ibn Battuta's inn: the road threaded by flying, in a room of its own.
      room: roomsOn,
      makeRoom: (c, title) =>
        battutaRoom({
          ...c,
          title,
          quality,
          keeper: () => slot().keeper,
          textSpeed: () => settings().textSpeed,
          perf: query.get("perf") === "1",
          intent: () => input.intent(),
          bindHold: (b, what) => input.bindHold(b, what),
          blocked: () => sheetOpen(),
          sound,
          toast,
          // The goals are written into the save; the inn's own door leads on (no corridor).
          finish: (g) => pageFinish(ROUTE_QUEST, g),
          through: () => moveOn(),
          fallback: () => openPage(ROUTE_QUEST, inJourney, true),
          resume: pageSaved(ROUTE_QUEST, restoreBattuta),
          keepPlace: (snap) => pageCheckpoint(ROUTE_QUEST, snap),
        }),
    },
    [COUPLE_QUEST]: {
      subject: COUPLE_SUBJECT,
      trial: "ts_trial",
      // One kept place serves both: the room keeps the two circles' own snapshot.
      saved: () => pageSaved(COUPLE_QUEST, (snap) => restoreCouple(snap, coupleOffer)),
      make: (c, title, kept) => coupleQuest({ ...c, title, resume: kept as Parameters<typeof coupleQuest>[0]["resume"] }),
      // Al-Tusi's observatory: the two circles played by flying, in a room of their own.
      room: roomsOn,
      makeRoom: (c, title) =>
        tusiRoom({
          ...c,
          title,
          quality,
          keeper: () => slot().keeper,
          textSpeed: () => settings().textSpeed,
          perf: query.get("perf") === "1",
          intent: () => input.intent(),
          bindHold: (b, what) => input.bindHold(b, what),
          blocked: () => sheetOpen(),
          sound,
          toast,
          // The goals are written into the save; the room's own door leads on (no corridor).
          finish: (g) => pageFinish(COUPLE_QUEST, g),
          through: () => moveOn(),
          fallback: () => openPage(COUPLE_QUEST, inJourney, true),
          resume: pageSaved(COUPLE_QUEST, restoreTusi),
          keepPlace: (snap) => pageCheckpoint(COUPLE_QUEST, snap),
        }),
    },
    [COFFEE_QUEST]: {
      subject: COFFEE_SUBJECT,
      trial: "cq_trial",
      // One kept place serves both: the room keeps the sorting's own snapshot with the card in Hudhud's beak added.
      saved: () => pageSaved(COFFEE_QUEST, (snap) => restoreSort(snap, coffeeDef)),
      make: (c, title, kept) => coffeeQuest({ ...c, title, resume: kept as Parameters<typeof coffeeQuest>[0]["resume"] }),
      // The coffee room: the cards sorted by flying, in a room of their own (the shared sorting room, ui/sortroom.ts).
      room: roomsOn,
      makeRoom: (c, title) =>
        coffeeRoom({
          ...c,
          title,
          quality,
          keeper: () => slot().keeper,
          textSpeed: () => settings().textSpeed,
          perf: query.get("perf") === "1",
          intent: () => input.intent(),
          bindHold: (b, what) => input.bindHold(b, what),
          blocked: () => sheetOpen(),
          sound,
          toast,
          // The goals are written into the save; the room's own door leads on (no corridor).
          finish: (g) => pageFinish(COFFEE_QUEST, g),
          through: () => moveOn(),
          fallback: () => openPage(COFFEE_QUEST, inJourney, true),
          resume: pageSaved(COFFEE_QUEST, (snap) => restoreSortRoom(CQR_SPEC, snap)),
          keepPlace: (snap) => pageCheckpoint(COFFEE_QUEST, snap),
        }),
    },
    [CHANNELS_QUEST]: {
      subject: CHANNELS_SUBJECT,
      trial: "ah_trial",
      // One kept place serves both: the court keeps the channels' own snapshot, as the page does.
      saved: () => pageSaved(CHANNELS_QUEST, (snap) => restoreChannels(snap, channelsGrid)),
      make: (c, title, kept) => channelsQuest({ ...c, title, resume: kept as Parameters<typeof channelsQuest>[0]["resume"] }),
      // The Alhambra's court: the channels turned by flying, in a room of their own.
      room: roomsOn,
      makeRoom: (c, title) =>
        alhambraRoom({
          ...c,
          title,
          quality,
          keeper: () => slot().keeper,
          textSpeed: () => settings().textSpeed,
          perf: query.get("perf") === "1",
          intent: () => input.intent(),
          bindHold: (b, what) => input.bindHold(b, what),
          blocked: () => sheetOpen(),
          sound,
          toast,
          // The goals are written into the save; the court's own door leads on (no corridor).
          finish: (g) => pageFinish(CHANNELS_QUEST, g),
          through: () => moveOn(),
          fallback: () => openPage(CHANNELS_QUEST, inJourney, true),
          resume: pageSaved(CHANNELS_QUEST, restoreAlhambra),
          keepPlace: (snap) => pageCheckpoint(CHANNELS_QUEST, snap),
        }),
    },
    [LEAVES_QUEST]: {
      subject: LEAVES_SUBJECT,
      trial: "rz_trial",
      // One kept place serves both: the study's snapshot is the loose leaves' own with the lifted leaf added.
      saved: () => pageSaved(LEAVES_QUEST, (snap) => restoreLeaves(snap, leavesPuzzle)),
      make: (c, title, kept) => leavesQuest({ ...c, title, resume: kept as Parameters<typeof leavesQuest>[0]["resume"] }),
      // Al-Razi's study: the loose leaves played by flying, in a room of their own.
      room: roomsOn,
      makeRoom: (c, title) =>
        raziRoom({
          ...c,
          title,
          quality,
          keeper: () => slot().keeper,
          textSpeed: () => settings().textSpeed,
          perf: query.get("perf") === "1",
          intent: () => input.intent(),
          bindHold: (b, what) => input.bindHold(b, what),
          blocked: () => sheetOpen(),
          sound,
          toast,
          // The goals are written into the save; the study's own door leads on (no corridor).
          finish: (g) => pageFinish(LEAVES_QUEST, g),
          through: () => moveOn(),
          fallback: () => openPage(LEAVES_QUEST, inJourney, true),
          resume: pageSaved(LEAVES_QUEST, restoreRazi),
          keepPlace: (snap) => pageCheckpoint(LEAVES_QUEST, snap),
        }),
    },
    [COLLATE_QUEST]: {
      subject: COLLATE_SUBJECT,
      trial: "kr_trial",
      // One kept place serves both: the room keeps the copies' own snapshot.
      saved: () => pageSaved(COLLATE_QUEST, (snap) => restoreCollate(snap, collatePuzzle)),
      make: (c, title, kept) => collateQuest({ ...c, title, resume: kept as Parameters<typeof collateQuest>[0]["resume"] }),
      // Karima al-Marwaziyya's room: the copies compared by flying, in a room of their own.
      room: roomsOn,
      makeRoom: (c, title) =>
        karimaRoom({
          ...c,
          title,
          quality,
          keeper: () => slot().keeper,
          textSpeed: () => settings().textSpeed,
          perf: query.get("perf") === "1",
          intent: () => input.intent(),
          bindHold: (b, what) => input.bindHold(b, what),
          blocked: () => sheetOpen(),
          sound,
          toast,
          // The goals are written into the save; the room's own door leads on (no corridor).
          finish: (g) => pageFinish(COLLATE_QUEST, g),
          through: () => moveOn(),
          fallback: () => openPage(COLLATE_QUEST, inJourney, true),
          resume: pageSaved(COLLATE_QUEST, restoreKarima),
          keepPlace: (snap) => pageCheckpoint(COLLATE_QUEST, snap),
        }),
    },
  };
  /** Opens a quest played on a page, with no flying scene. One left in the middle comes back. `journeyAt` is its place in
   * the journey, or null for free play from the Atlas. */
  function openPage(quest: string, journeyAt: number | null = null, onPage = false): void {
    inJourney = journeyAt;
    // Never two scenes at once: a corridor or a page still running is stopped first.
    corridor?.stop();
    corridor = null;
    pageRun?.run.stop();
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
      // Finished: written into the save, and then, once the page has shown its results, the corridor to the door.
      finish: (g) => (pageFinish(quest, g), queueMicrotask(() => showCorridor(quest))),
      leave: () => toAtlas(),
    };
    if (!onPage && page.room?.() && page.makeRoom) {
      // Never two pictures at once: a room being replaced is stopped and its box emptied first.
      roomBox.replaceChildren();
      const room = page.makeRoom(common, subjectName(page.subject));
      // If the room cannot start (WebGL fails after all), it opens the page quest in its place a moment later.
      pageRun = { quest, run: room };
      showBench(room.node, roomBox);
      return;
    }
    roomBox.replaceChildren();
    roomBox.hidden = true;
    pageRun = { quest, run: page.make(common, subjectName(page.subject), kept) };
    showBench(pageRun.run.node);
  }
  /** Closes whatever scene is open (the flying scene or a quest's page) and stops everything it runs: the picture, a
   * page's animation, the corridor. Nothing is shown in its place: the caller opens the next thing. */
  function closeScene(): void {
    corridor?.stop();
    corridor = null;
    if (pageRun) {
      pageRun.run.stop();
      pageRun = null;
      bench.replaceChildren();
      bench.hidden = true;
      roomBox.replaceChildren();
      roomBox.hidden = true;
      wordsBox.hidden = false;
      pauseBtn.hidden = false;
    } else {
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
      doorPanel.hidden = true;
      doorPanel.replaceChildren();
      prompt.hidden = true;
      render();
    }
    atlasBtn.hidden = true;
  }
  /** Leaves the quest for the Atlas. A quest in the middle stays saved; a finished one is cleared for another play. */
  function toAtlas(): void {
    const onPage = pageRun !== null;
    closeScene();
    inJourney = null;
    hub.hidden = false;
    drawHub();
    if (onPage) {
      // Back on the Atlas, its heading is brought to the top, at once, and holds the focus.
      const top = hub.querySelector("h2") as HTMLElement | null;
      top?.scrollIntoView({ behavior: "auto", block: "start" });
      top?.focus({ preventScroll: true });
      return;
    }
    (hub.querySelector("button.primary") as HTMLElement | null)?.focus({ preventScroll: true });
  }

  // ---------------------------------------------------------------------------------------- the journey
  // The built quests played one after another (content/journey.ts). The slot keeps where the journey has got to; the
  // scene open now was opened by the journey if `inJourney` is its place in the order, and in free play if it is null.
  let inJourney: number | null = null;
  let corridor: CorridorStrip | null = null;
  let movingOn = false;
  let lastDoor: ReturnType<typeof doorNow> = null;
  const setJourney = (j: Journey) => (save = { ...save, slots: save.slots.map((x, i) => (i === save.slot && x ? { ...x, journey: j } : x)) });
  /** The name a quest is shown by: its subject's name on the Atlas. */
  const questName = (quest: string): string => subjectName(subjectOf(quest) ?? quest);
  const hudhudSays = (text: string) => `${t("who_hudhud")}: ${text}`;
  /** A quest just finished in the journey: the journey is moved past it, so that leaving now or loading the page again
   * goes on with the next scene and does not ask for this one again. The caller saves. */
  function journeyDone(quest: string): void {
    if (inJourney === null || JOURNEY[inJourney] !== quest) return;
    const j = slot().journey;
    setJourney({ ...(j ?? { at: 0 }), at: Math.max(j?.at ?? 0, inJourney + 1) });
  }
  /** Opens the journey's scene at `i`. */
  function openScene(i: number): void {
    const quest = JOURNEY[i]!;
    if (quest === QUEST) startQuest(i);
    else openPage(quest, i);
  }
  /** Begins the journey, goes on with it, or begins it again once it has come to its end. */
  function beginJourney(): void {
    cues.unlock();
    const j = slot().journey;
    if (!j) setJourney({ at: 0 });
    else if (j.at >= JOURNEY.length) setJourney({ at: 0, round: (j.round ?? 0) + 1 });
    keep();
    closeScene();
    openScene(Math.min(slot().journey!.at, JOURNEY.length - 1));
  }
  /**
   * Through the door: in a journey, on to the next scene in the order (or, after the last, back to the Atlas); in free
   * play, back to the Atlas. One scene runs at a time: the one being left is closed, with everything it runs, first.
   */
  function moveOn(): void {
    if (movingOn) return;
    // What the door and the bird were when the scene was left, for the browser checks (the hook's lastDoor).
    lastDoor = doorNow();
    const at = inJourney;
    if (at === null) return toAtlas();
    movingOn = true;
    try {
      const next = at + 1;
      const j = slot().journey;
      setJourney({ ...(j ?? { at: 0 }), at: Math.max(j?.at ?? 0, next) });
      keep();
      closeScene();
      if (next >= JOURNEY.length) {
        inJourney = null;
        hub.hidden = false;
        drawHub();
        const top = hub.querySelector("h2") as HTMLElement | null;
        top?.scrollIntoView({ behavior: "auto", block: "start" });
        top?.focus({ preventScroll: true });
        toast(hudhudSays(t("jn_end")));
        return;
      }
      openScene(next);
      toast(hudhudSays(t("jn_next", { name: questName(JOURNEY[next]!) })));
    } finally {
      movingOn = false;
    }
  }
  /** The world a quest belongs to, by its order on the Atlas (1 to 10). */
  const worldOf = (quest: string): number => {
    const sub = atlas.subjects.find((x) => x.id === subjectOf(quest));
    return atlas.worlds.find((w) => w.id === sub?.world)?.order ?? 3;
  };
  /** A quest on a page is solved: above its results, the corridor with Hudhud and the lit door. */
  function showCorridor(quest: string): void {
    const run = pageRun;
    if (!run || run.quest !== quest) return;
    if (corridor) {
      corridor.stop();
      corridor.node.remove();
    }
    const strip = corridorStrip({ t, rtl: RTL.includes(lang), world: worldOf(quest), reducedMotion: calm, intent: () => input.intent(), bindHold: (b, what) => input.bindHold(b, what), through: () => moveOn() });
    const results = run.run.node.querySelector<HTMLElement>("section.results");
    if (results) results.before(strip.node);
    else run.run.node.append(strip.node);
    corridor = strip;
    // The quest begun again on its page ("Play again") hides its results: the corridor goes with them.
    if (results) {
      const watch = new MutationObserver(() => {
        if (!results.hidden) return;
        watch.disconnect();
        if (corridor !== strip) return;
        strip.stop();
        strip.node.remove();
        corridor = null;
      });
      watch.observe(results, { attributes: true, attributeFilter: ["hidden"] });
    }
    // In a journey the keyboard goes to the corridor at once. In free play the page's results heading keeps the focus,
    // as it always has; the walking keys move the bird from there as well, and the strip is the next stop for Tab.
    if (inJourney !== null) strip.focus();
  }
  /** The door of whichever scene is open: lit or not, where it stands, and where the bird is. */
  const doorNow = (): { lit: boolean; where: { x: number; y: number; reach: number } | null; bird: { x: number; y: number } | null; scene: "workshop" | "corridor" | "page" | "jazari" | "tusi" | "khwarizmi" | "kindi" | "idrisi" | "razi" | "karima" | "battuta" | "coffee" | "jahiz" | "alhambra" | "samarkand" } | null => {
    const room = openRoom();
    if (room) return { ...room.door(), scene: pageRun?.quest === COUPLE_QUEST ? "tusi" : pageRun?.quest === ALGEBRA_QUEST ? "khwarizmi" : pageRun?.quest === CIPHER_QUEST ? "kindi" : pageRun?.quest === SHEETS_QUEST ? "idrisi" : pageRun?.quest === LEAVES_QUEST ? "razi" : pageRun?.quest === COLLATE_QUEST ? "karima" : pageRun?.quest === ROUTE_QUEST ? "battuta" : pageRun?.quest === COFFEE_QUEST ? "coffee" : pageRun?.quest === SORT_QUEST ? "jahiz" : pageRun?.quest === CHANNELS_QUEST ? "alhambra" : pageRun?.quest === PAPER_QUEST ? "samarkand" : "jazari" };
    if (started) {
      const w = running?.scene()?.where() ?? null;
      return { lit: state.done, where: { ...DOOR }, bird: w ? { x: w.x, y: w.y } : null, scene: "workshop" };
    }
    if (corridor) {
      const c = corridor.state();
      return { lit: true, where: corridor.door(), bird: { x: c.x, y: c.y }, scene: "corridor" };
    }
    if (pageRun) return { lit: false, where: null, bird: null, scene: "page" };
    return null;
  };
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
            const b = el("button", { type: "button", textContent: t(kept ? "quest_continue" : rec?.done ? "quest_again" : "quest_play", { name }), onclick: () => openPage(quest, null) });
            b.dataset.quest = quest;
            // A scene played in its room is named as the flying scene is, with no line about a trial on a page.
            const item = el("li", { class: "open" }, b, page.room?.() ? null : el("small", { textContent: t(page.trial) }));
            if (rec?.done) item.append(el("small", { textContent: t("quest_home", { n: num([rec.curiosity, rec.ingenuity, rec.kindness, rec.feather].filter(Boolean).length) }) }));
            if (kept) item.append(el("small", { textContent: t("resume_note") }), el("button", { type: "button", textContent: t("btn_restart_quest"), onclick: () => (pageCheckpoint(quest, null), drawHub()) }));
            return item;
          }
          const label: Key = resumed ? "quest_continue" : rec?.done ? "quest_again" : "quest_play";
          const li = el("li", { class: "open" }, el("button", { type: "button", class: "primary", textContent: t(label, { name }), onclick: () => startQuest(null) }), story);
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
    // The journey: one button that begins it, goes on with it (naming the next figure as the Atlas names them), or
    // begins it again once every scene built so far is done. It is not the Atlas's main button (that is the flying scene's).
    const j = slot().journey;
    const ended = j !== undefined && j.at >= JOURNEY.length;
    const journeyBtn = el("button", { type: "button", class: "journey-btn", textContent: !j ? t("jn_begin") : ended ? t("jn_again") : t("jn_continue", { name: questName(JOURNEY[j.at]!) }), onclick: () => beginJourney() });
    journeyBtn.dataset.journey = !j ? "begin" : ended ? "again" : "continue";
    const journeyBox = el("div", { class: "journey" }, journeyBtn, el("p", { class: "small", textContent: t("jn_hub_note") }));
    hub.replaceChildren(
      el("h2", { textContent: t("hub_title"), tabIndex: -1 }),
      el("p", { class: "progress", textContent: t("hub_progress", { n: num(home), total: num(atlas.subjects.length) }) }),
      // The journey comes first, where a player sees it without scrolling: the book and the worlds are for choosing freely.
      journeyBox,
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
    where: () => (running?.scene() ?? openRoom()?.running()?.scene())?.where() ?? null,
    // Where the explorer stands and where the room's people stand (scenes/room.ts standing), for the check that it never stops in front of one.
    standing: () => (running?.scene() ?? openRoom()?.running()?.scene())?.standing() ?? null,
    info: () => ({ ...((running?.scene() ?? openRoom()?.running()?.scene())?.info() ?? {}), drawCalls: (running ?? openRoom()?.running())?.drawCalls() ?? null, soundsStarted: cues.started, saved: mayStore }),
    resetFrames: () => (running?.scene() ?? openRoom()?.running()?.scene())?.resetFrames(),
    touch: (id: string) => run({ type: "touch", id }),
    goTo: (id: string) => (running?.scene() ?? openRoom()?.running()?.scene())?.goTo(id),
    command: (c: Command) => run(c),
    restart: (rebuild: boolean) => restart(rebuild),
    redraw: () => redraw(),
    started: () => started,
    saveStatus: () => saveStatus,
    saveReady: () => ready.then(() => durable?.settled()).then(() => saveStatus),
    persistence: () => persistence,
    toAtlas: () => toAtlas(),
    journey: () => ({ active: inJourney !== null, at: slot().journey?.at ?? null, scene: inJourney, order: [...JOURNEY], next: slot().journey ? (JOURNEY[slot().journey!.at] ?? null) : JOURNEY[0] }),
    beginJourney: () => beginJourney(),
    door: () => doorNow(),
    lastDoor: () => lastDoor,
    goThroughDoor: () => {
      const d = doorNow();
      if (!d?.lit) return false;
      moveOn();
      return true;
    },
    atlasPicture: () => pictureData(),
    // The clock's page quest (the way it is played without WebGL), and al-Jazari's workshop, its room.
    startClock: () => openPage(CLOCK_QUEST, null, true),
    startJazari: () => openPage(CLOCK_QUEST),
    jazari: () => {
      const r = roomOf<JazariRoom>(CLOCK_QUEST);
      if (!r) return null;
      const v = r.view();
      return { ...v.state.clock, carrying: v.state.carrying, talk: v.state.talk, busy: r.busy(), lit: v.lit, stopped: v.stopped, doorLit: v.done, litShown: r.running()?.scene()?.litShown() ?? null };
    },
    jazariCommand: (c: RoomCommand) => roomOf<JazariRoom>(CLOCK_QUEST)?.command(c),
    clock: () => { const r = pageOf<ClockQuest>(CLOCK_QUEST); return r ? { ...r.state(), busy: r.busy() } : null; },
    clockCommand: (c: Parameters<ClockQuest["command"]>[0]) => pageOf<ClockQuest>(CLOCK_QUEST)?.command(c),
    // The secret page's page quest (the way it is played without WebGL), and al-Kindi's room, where it is played by flying.
    startCipher: () => openPage(CIPHER_QUEST, null, true),
    startKindi: () => openPage(CIPHER_QUEST),
    kindi: () => {
      const r = roomOf<KindiRoom>(CIPHER_QUEST);
      if (!r) return null;
      const v = r.view();
      return { ...v.state.cipher, carrying: v.state.carrying, talk: v.state.talk, doorLit: v.done, shown: r.running()?.scene()?.shown() ?? null };
    },
    kindiCommand: (c: KindiCommand) => roomOf<KindiRoom>(CIPHER_QUEST)?.command(c),
    cipher: () => { const r = pageOf<CipherQuest>(CIPHER_QUEST); return r ? { ...r.state(), busy: r.busy() } : null; },
    cipherCommand: (c: Parameters<CipherQuest["command"]>[0]) => pageOf<CipherQuest>(CIPHER_QUEST)?.command(c),
    // The locked box's page quest (the way it is played without WebGL), and al-Khwarizmi's room, where it is played by flying.
    startAlgebra: () => openPage(ALGEBRA_QUEST, null, true),
    startKhwarizmi: () => openPage(ALGEBRA_QUEST),
    khwarizmi: () => {
      const r = roomOf<KhwarizmiRoom>(ALGEBRA_QUEST);
      if (!r) return null;
      const v = r.view();
      return { ...v.state.algebra, talk: v.state.talk, sentence: r.sentence(), doorLit: v.done, shown: r.running()?.scene()?.shown() ?? null };
    },
    khwarizmiCommand: (c: KhwarizmiCommand) => roomOf<KhwarizmiRoom>(ALGEBRA_QUEST)?.command(c),
    algebra: () => { const r = pageOf<AlgebraQuest>(ALGEBRA_QUEST); return r ? { ...r.state(), busy: r.busy(), sentence: r.sentence() } : null; },
    algebraCommand: (c: Parameters<AlgebraQuest["command"]>[0]) => pageOf<AlgebraQuest>(ALGEBRA_QUEST)?.command(c),
    // The scattered sheets' page quest (the way they are played without WebGL), and al-Idrisi's hall, where they are played by flying.
    startSheets: () => openPage(SHEETS_QUEST, null, true),
    startIdrisi: () => openPage(SHEETS_QUEST),
    idrisi: () => {
      const r = roomOf<IdrisiRoom>(SHEETS_QUEST);
      if (!r) return null;
      const v = r.view();
      return { ...v.state.sheets, lifted: v.state.lifted, talk: v.state.talk, doorLit: v.done, shown: r.running()?.scene()?.shown() ?? null };
    },
    idrisiCommand: (c: IdrisiCommand) => roomOf<IdrisiRoom>(SHEETS_QUEST)?.command(c),
    sheets: () => { const r = pageOf<SheetsQuest>(SHEETS_QUEST); return r ? { ...r.state(), busy: r.busy(), selected: r.selected(), status: r.status() } : null; },
    sheetsCommand: (c: Parameters<SheetsQuest["command"]>[0]) => pageOf<SheetsQuest>(SHEETS_QUEST)?.command(c),
    // Al-Jahiz's page quest (the way it is played without WebGL), and his room, where the cards are sorted by flying.
    startSort: () => openPage(SORT_QUEST, null, true),
    startSortRoom: () => openPage(SORT_QUEST),
    jahizRoom: () => {
      const r = roomOf<JahizRoom>(SORT_QUEST);
      if (!r) return null;
      const s = r.state();
      return { ...s.sort, carrying: s.carrying, talk: s.talk, busy: r.busy(), status: r.status(), beak: r.carrying(), doorLit: s.sort.done, shown: (r.running()?.scene()?.shown() as unknown) ?? null };
    },
    jahizRoomCommand: (c: SortRoomCommand) => roomOf<JahizRoom>(SORT_QUEST)?.command(c),
    sort: () => { const r = pageOf<SortQuest>(SORT_QUEST); return r ? { ...r.state(), busy: r.busy(), selected: r.selected(), status: r.status() } : null; },
    sortCommand: (c: Parameters<SortQuest["command"]>[0]) => pageOf<SortQuest>(SORT_QUEST)?.command(c),
    // The paper's page quest (the way it is played without WebGL), and the paper workshop of Samarkand, where it is made by flying.
    startPaper: () => openPage(PAPER_QUEST, null, true),
    startSamarkand: () => openPage(PAPER_QUEST),
    samarkand: () => {
      const r = roomOf<SamarkandRoom>(PAPER_QUEST);
      if (!r) return null;
      const v = r.view();
      return { ...v.state.paper, places: v.state.paper.puzzle.places, lifted: v.state.lifted, talk: v.state.talk, busy: r.busy(), lit: v.lit, stopped: v.stopped, doorLit: v.done, shown: r.running()?.scene()?.shown() ?? null };
    },
    samarkandCommand: (c: SamarkandCommand) => roomOf<SamarkandRoom>(PAPER_QUEST)?.command(c),
    paper: () => { const r = pageOf<PaperQuest>(PAPER_QUEST); return r ? { ...r.state(), busy: r.busy(), selected: r.selected(), status: r.status() } : null; },
    paperCommand: (c: Parameters<PaperQuest["command"]>[0]) => pageOf<PaperQuest>(PAPER_QUEST)?.command(c),
    // The road's page quest (the way it is played without WebGL), and Ibn Battuta's inn, where it is threaded by flying.
    startRoute: () => openPage(ROUTE_QUEST, null, true),
    startBattuta: () => openPage(ROUTE_QUEST),
    battuta: () => {
      const r = roomOf<BattutaRoom>(ROUTE_QUEST);
      if (!r) return null;
      const s = r.state();
      return { ...s.route, talk: s.talk, busy: r.busy(), sentence: r.sentence(), status: r.status(), doorLit: s.route.done, shown: r.running()?.scene()?.shown() ?? null };
    },
    battutaCommand: (c: BattutaCommand) => roomOf<BattutaRoom>(ROUTE_QUEST)?.command(c),
    route: () => { const r = pageOf<RouteQuest>(ROUTE_QUEST); return r ? { ...r.state(), busy: r.busy(), sentence: r.sentence(), status: r.status() } : null; },
    routeCommand: (c: Parameters<RouteQuest["command"]>[0]) => pageOf<RouteQuest>(ROUTE_QUEST)?.command(c),
    // The two circles' page quest (the way they are played without WebGL), and al-Tusi's observatory, their room.
    startCouple: () => openPage(COUPLE_QUEST, null, true),
    startTusi: () => openPage(COUPLE_QUEST),
    tusi: () => {
      const r = roomOf<TusiRoom>(COUPLE_QUEST);
      if (!r) return null;
      const v = r.view();
      return { ...v.state.couple, talk: v.state.talk, busy: r.busy(), progress: v.progress, doorLit: v.done, shown: r.running()?.scene()?.shown() ?? null };
    },
    tusiCommand: (c: TusiCommand) => roomOf<TusiRoom>(COUPLE_QUEST)?.command(c),
    tusiSkip: () => roomOf<TusiRoom>(COUPLE_QUEST)?.skipTurning(),
    couple: () => { const r = pageOf<CoupleQuest>(COUPLE_QUEST); return r ? { ...r.state(), busy: r.busy(), status: r.status() } : null; },
    coupleCommand: (c: Parameters<CoupleQuest["command"]>[0]) => pageOf<CoupleQuest>(COUPLE_QUEST)?.command(c),
    // Coffee's page quest (the way it is played without WebGL), and the coffee room, where the cards are sorted by flying.
    startCoffee: () => openPage(COFFEE_QUEST, null, true),
    startCoffeeRoom: () => openPage(COFFEE_QUEST),
    coffeeRoom: () => {
      const r = roomOf<CoffeeRoom>(COFFEE_QUEST);
      if (!r) return null;
      const s = r.state();
      return { ...s.sort, carrying: s.carrying, talk: s.talk, busy: r.busy(), status: r.status(), beak: r.carrying(), doorLit: s.sort.done, shown: (r.running()?.scene()?.shown() as unknown) ?? null };
    },
    coffeeRoomCommand: (c: SortRoomCommand) => roomOf<CoffeeRoom>(COFFEE_QUEST)?.command(c),
    coffee: () => { const r = pageOf<CoffeeQuest>(COFFEE_QUEST); return r ? { ...r.state(), busy: r.busy(), selected: r.selected(), status: r.status() } : null; },
    coffeeCommand: (c: Parameters<CoffeeQuest["command"]>[0]) => pageOf<CoffeeQuest>(COFFEE_QUEST)?.command(c),
    // The channels' page quest (the way they are played without WebGL), and the Alhambra's court, where they are turned by flying.
    startChannels: () => openPage(CHANNELS_QUEST, null, true),
    startAlhambra: () => openPage(CHANNELS_QUEST),
    alhambra: () => {
      const r = roomOf<AlhambraRoom>(CHANNELS_QUEST);
      if (!r) return null;
      const s = r.state();
      return { ...s.channels, wet: Object.fromEntries(s.channels.answer.wet), talk: s.talk, busy: r.busy(), status: r.status(), doorLit: s.channels.done, shown: r.running()?.scene()?.shown() ?? null };
    },
    alhambraCommand: (c: AlhambraCommand) => roomOf<AlhambraRoom>(CHANNELS_QUEST)?.command(c),
    channels: () => { const r = pageOf<ChannelsQuest>(CHANNELS_QUEST); return r ? { ...r.state(), busy: r.busy(), selected: r.selected(), status: r.status() } : null; },
    channelsCommand: (c: Parameters<ChannelsQuest["command"]>[0]) => pageOf<ChannelsQuest>(CHANNELS_QUEST)?.command(c),
    // The loose leaves' page quest (the way they are played without WebGL), and al-Razi's study, where they are played by flying.
    startLeaves: () => openPage(LEAVES_QUEST, null, true),
    startRazi: () => openPage(LEAVES_QUEST),
    razi: () => {
      const r = roomOf<RaziRoom>(LEAVES_QUEST);
      if (!r) return null;
      const v = r.view();
      return { ...v.state.leaves, places: v.state.leaves.puzzle.places, lifted: v.state.lifted, talk: v.state.talk, busy: r.busy(), lit: v.lit, stopped: v.stopped, doorLit: v.done, shown: r.running()?.scene()?.shown() ?? null };
    },
    raziCommand: (c: RaziCommand) => roomOf<RaziRoom>(LEAVES_QUEST)?.command(c),
    leaves: () => { const r = pageOf<LeavesQuest>(LEAVES_QUEST); return r ? { ...r.state(), busy: r.busy(), selected: r.selected(), status: r.status() } : null; },
    leavesCommand: (c: Parameters<LeavesQuest["command"]>[0]) => pageOf<LeavesQuest>(LEAVES_QUEST)?.command(c),
    // The copies' page quest (the way they are played without WebGL), and Karima al-Marwaziyya's room, where they are compared by flying.
    startCollate: () => openPage(COLLATE_QUEST, null, true),
    startKarima: () => openPage(COLLATE_QUEST),
    karima: () => {
      const r = roomOf<KarimaRoom>(COLLATE_QUEST);
      if (!r) return null;
      const s = r.state();
      return { ...s.collate, talk: s.talk, busy: r.busy(), status: r.status(), doorLit: s.collate.done, shown: r.running()?.scene()?.shown() ?? null };
    },
    karimaCommand: (c: KarimaCommand) => roomOf<KarimaRoom>(COLLATE_QUEST)?.command(c),
    collate: () => { const r = pageOf<CollateQuest>(COLLATE_QUEST); return r ? { ...r.state(), busy: r.busy(), status: r.status() } : null; },
    collateCommand: (c: Parameters<CollateQuest["command"]>[0]) => pageOf<CollateQuest>(COLLATE_QUEST)?.command(c),
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
