// A sorting room's page, shared by every sorting quest that is played in a room (the coffee room first, 27 November
// 2026; al-Jahiz's animal cards can use it with its own picture, groups and words). The picture is a canvas on the room
// engine (scenes/room.ts), the room's own scene; everything a player reads or presses is ordinary page: the words of a
// talk, the objective, the touch prompt, and under the stage a list that says the whole room in words and lets it be
// played without the picture: how many cards are placed and the showings that failed, what Hudhud carries, every card as
// a button with its number, its full sentence and where it lies, every group's sign with what the group means, the bell,
// the people and where the feather hides, and the page's own sentence for the last thing done.
//
// The rules are the quest's (sim/sort.ts) through the shared sorting room's (sim/sortroom.ts): a group's sign touched with
// a card carried is the page's `place`, the bell is the page's `show`, and every sentence is the page's for the way of
// playing. What differs between sorting rooms is the spec each hands in: its rules' spec, its things, its scene, its
// door, its strings, its notes and its records. Nothing here names a card, a group or a person of any one quest.
import type { Cue } from "../audio/cues";
import { startRoom, type Running, type StartOptions } from "../game/boot";
import { choicesOf, lineOf, type Mood } from "../narrative/dialogue";
import type { Keeper, Quality } from "../save/save";
import type { RoomHost, RoomScene, RoomThing } from "../scenes/room";
import type { Intent } from "../sim/move";
import { unplaced, wrongOnes, type SortStyle } from "../sim/sort";
import { afterDone, applySortRoom, keptAfter, newSortRoom, sortRoomGoals, type SortRoomCommand, type SortRoomHappened, type SortRoomSpec, type SortRoomState } from "../sim/sortroom";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;

/** What a sorting room's scene asks of the page. */
export interface SortSceneHost extends RoomHost {
  state(): SortRoomState;
  /** The page reads right to left: the cards and the groups' signs are mirrored, as the page's picture is. */
  rtl: boolean;
  speaking(): { who: string; mood: Mood } | null;
  look(): { quality: Quality; reducedMotion: boolean; style: SortStyle; keeper: Keeper };
}
/** What the page asks of a sorting room's scene, beyond the room engine's own. */
export interface SortScene extends RoomScene<SortSceneHost> {
  happened(list: SortRoomHappened[]): void;
  finished(): void;
  shown(): unknown;
}
/** A thing of a sorting room as its content lays it out: its kind (card, group, rest, bell, voice, kid, hide), and for a card or a group which one, with its number from 0. */
export interface SortRoomThingAt extends RoomThing {
  item?: string;
  group?: string;
  index?: number;
}

/** Everything that tells one sorting room's page from another's. */
export interface SortRoomPage {
  rules: SortRoomSpec;
  things(s: SortRoomState, rtl: boolean): SortRoomThingAt[];
  scene: { key: string; make: new () => SortScene };
  door: { x: number; y: number; reach: number };
  /** The kinds the room's own things have, for the speakers, the bell, the people and the feather. */
  kinds: { bell: string; voice: string; kid: string; hide: string };
  /** The short name of a card, its full sentence, and the short name of a group. */
  name(card: string): Key;
  sentence(card: string): Key;
  group(g: string): Key;
  who: { hudhud: Key; voice: Key; kid: Key; narrator: Key };
  k: {
    canvas: Key; objective: Key; objectiveDoor: Key; cardsGroup: Key; groupsGroup: Key; carrying: Key; carryingNone: Key; picked: Key; putBack: Key;
    cardTable: Key; cardGroup: Key; cardBeak: Key; thingGroup: Key; thingRest: Key; groupLine: Key;
    progress: Key; progressShows: Key; didPlace: Key; didUnplace: Key; refused: Key; wrongStory: Key; wrongExplorer: Key; wrongChallenge: Key; didSolved: Key;
    goalCuriosityHow: Key; goalIngenuityStory: Key; goalIngenuityShows: Key; goalKindnessHow: Key; goalFeatherHow: Key; review: Key; noteRoom: Key;
  };
  /** The quest's own notes, before the room's. */
  notes: readonly Key[];
  records: readonly string[];
  recNames: readonly Key[];
  /** The id of the panel's heading (unique on the page). */
  panelId: string;
}

export interface SortRoomHost {
  t(key: Key, vars?: Record<string, string | number>): string;
  num(n: number): string;
  lang: string;
  museum: string;
  /** The subject's name, for the heading. */
  title: string;
  style(): SortStyle;
  quality(): Quality;
  keeper(): Keeper;
  reducedMotion(): boolean;
  /** Characters a second for a line of talk; 0 is all at once. */
  textSpeed(): number;
  perf: boolean;
  intent(): Intent;
  bindHold(button: HTMLElement, what: "left" | "right" | "jump"): void;
  /** A sheet (the settings) is open over the page: the room waits. */
  blocked(): boolean;
  /** A sound, with its caption if it has one. */
  sound(c: Cue): void;
  toast(text: string): void;
  /** The quest is finished: its goals are written into the save. */
  finish(g: { turns: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean }): void;
  /** The bird went through the lit door. */
  through(): void;
  leave(): void;
  /** The room could not be drawn (WebGL failed): play the scene on its page instead. */
  fallback(): void;
  resume?: SortRoomState | null;
  keepPlace(snap: unknown | null): void;
}
export interface SortRoom {
  node: HTMLElement;
  state(): SortRoomState;
  command(c: SortRoomCommand): void;
  /** A key or a controller's press: touch, go on in a talk, move among its choices. */
  press(p: "touch" | "pause" | "next" | "back" | "up" | "down"): void;
  /** Always false: nothing here is shown step by step. */
  busy(): boolean;
  /** What the page says about the last thing done. */
  status(): string;
  /** What the page says Hudhud carries. */
  carrying(): string;
  running(): Running<SortScene> | null;
  door(): { lit: boolean; where: { x: number; y: number; reach: number }; bird: { x: number; y: number } | null };
  /** Draws the picture anew (a change of look, a lost graphics context); the quest stays as it is. */
  redraw(): void;
  stop(): void;
}

const h = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Partial<HTMLElementTagNameMap[K]> & { class?: string } = {}, ...children: Array<Node | string | null | false>): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  const { class: cls, ...rest } = props;
  if (cls) node.className = cls;
  Object.assign(node, rest);
  for (const c of children) if (c !== null && c !== false) node.append(c);
  return node;
};

export function sortRoom(host: SortRoomHost, spec: SortRoomPage): SortRoom {
  const { t, num } = host;
  const k = spec.k;
  const rules = spec.rules;
  const rtl = host.lang === "ar" || host.lang === "ur";
  let state: SortRoomState = host.resume ?? newSortRoom(rules, host.style());
  let portraits: Record<string, string> = {};
  let run: Running<SortScene> | null = null;
  let stopped = false;
  let finished = state.sort.done;

  const things = () => spec.things(state, rtl);
  const card = (item: string) => t(spec.name(item));
  const groupName = (g: string) => t(spec.group(g));
  const groupNo = (g: string) => num(state.sort.groups.indexOf(g) + 1);
  const list = (names: string[]) => names.join(rtl ? "، " : ", ");
  /** What a thing is called: a card by its number, its sentence and where it lies; a group's sign by its number and meaning. */
  const nameOf = (x: SortRoomThingAt): string => {
    if (x.kind === "card") {
      const n = num(x.index! + 1);
      const sentence = t(spec.sentence(x.item!));
      const g = state.sort.placed[x.item!];
      if (state.carrying === x.item) return t(k.cardBeak, { n, card: sentence });
      return g ? t(k.cardGroup, { n, s: groupNo(g), card: sentence }) : t(k.cardTable, { n, card: sentence });
    }
    if (x.kind === "group") return t(k.thingGroup, { n: num(x.index! + 1), name: groupName(x.group!) });
    if (x.kind === "rest") return t(k.thingRest, { n: num(x.index! + 1) });
    return t(x.name as Key);
  };
  const frozen = () => stopped || state.talk !== null || host.blocked();
  const progressText = (): string => {
    const placed = num(state.sort.items.length - unplaced(state.sort).length);
    const total = num(state.sort.items.length);
    return state.sort.style === "story" ? t(k.progress, { placed, total }) : t(k.progressShows, { placed, total, shows: num(state.sort.shows) });
  };
  const carryingText = (): string => (state.carrying ? t(k.carrying, { n: num(state.sort.items.indexOf(state.carrying) + 1), card: card(state.carrying) }) : t(k.carryingNone));

  // ---------------------------------------------------------------------------------------- the page
  const heading = h("h2", { class: "room-title", textContent: host.title, tabIndex: -1 });
  const objective = h("div", { class: "objective" });
  const prompt = h("div", { class: "prompt", hidden: true });
  const captions = h("div", { class: "captions" });
  captions.setAttribute("aria-hidden", "true");
  const hold = (label: Key, glyph: string, what: "left" | "right" | "jump") => {
    const b = h("button", { type: "button", textContent: glyph });
    b.setAttribute("aria-label", t(label));
    host.bindHold(b, what);
    return b;
  };
  const bTouch = h("button", { type: "button", class: "wide", textContent: t("btn_touch"), onclick: () => press("touch") });
  const pad = h("div", { class: "pad" }, h("div", {}, hold("btn_left", "◀", "left"), hold("btn_right", "▶", "right")), h("div", {}, bTouch, hold("btn_fly", "▲", "jump")));
  const canvasBox = h("div", { class: "canvas-box" });
  const stage = h("div", { class: "stage room-stage", tabIndex: 0 }, canvasBox, captions, prompt, pad);
  stage.setAttribute("role", "application");
  stage.setAttribute("aria-label", t(k.canvas));
  const talkBox = h("div", { class: "talk", hidden: true });
  talkBox.setAttribute("role", "group");
  const stageWrap = h("div", { class: "stage-wrap" }, objective, stage, talkBox);
  const doorPanel = h("section", { class: "door-panel", hidden: true });
  doorPanel.setAttribute("aria-labelledby", spec.panelId);
  const live = h("div", { class: "visually-hidden", role: "status" });
  live.setAttribute("aria-live", "polite");

  // The room in words: the count, what Hudhud carries, every card, every group's sign, the other things, the last thing done.
  const counts = h("p", { class: "carrying" });
  const beak = h("p", { class: "beak" });
  beak.setAttribute("aria-live", "polite");
  const cardsBox = h("div", { class: "sheet-rows sort-cards" });
  cardsBox.setAttribute("role", "group");
  cardsBox.setAttribute("aria-label", t(k.cardsGroup));
  const groupsBox = h("div", { class: "sheet-rows sort-groups" });
  groupsBox.setAttribute("role", "group");
  groupsBox.setAttribute("aria-label", t(k.groupsGroup));
  const thingList = h("ul", {});
  const ran = h("div", { class: "ran" });
  ran.setAttribute("aria-live", "polite");
  const words = h("section", { class: "room-words" }, h("h2", { textContent: t("alt_title") }), counts, beak, cardsBox, groupsBox, thingList, ran);
  const note = h(
    "section",
    {},
    h("h2", { textContent: t("note_title") }),
    h("p", { textContent: t(k.noteRoom) }),
    h("p", { class: "small", textContent: t("art_note") }),
    h("h2", { textContent: t("controls_title") }),
    // The keys only: the workshop's line about touch speaks of tapping a mirror, which a sorting room has not.
    h("p", { class: "small", textContent: t("controls_keys") }),
  );
  const node = h("div", { class: "room" }, heading, stageWrap, doorPanel, h("div", { class: "words" }, words, note), live);

  // ---------------------------------------------------------------------------------------- the picture
  const sceneHost: SortSceneHost = {
    intent: () => host.intent(),
    frozen,
    touch: (id) => command({ type: "touch", id }),
    near: (id) => {
      const thing = things().find((x) => x.id === id);
      prompt.hidden = (!thing && id !== "door") || state.talk !== null;
      if (id === "door") prompt.textContent = t("jn_go_door");
      else if (thing) prompt.textContent = t("touch_prompt", { thing: nameOf(thing) });
    },
    through: () => host.through(),
    sound: (c) => host.sound(c),
    speaking: () => (state.talk ? { who: lineOf(rules.scripts, state.talk).who, mood: lineOf(rules.scripts, state.talk).mood } : null),
    look: () => ({ quality: host.quality(), reducedMotion: host.reducedMotion(), style: state.sort.style, keeper: host.keeper() }),
    portraits: (urls) => ((portraits = urls), renderTalk()),
    state: () => state,
    rtl,
  };
  const opts: StartOptions = { perf: host.perf, onLost: () => host.toast(t("context_lost")), onRestored: () => redraw() };
  function begin(): void {
    try {
      run = startRoom(canvasBox, sceneHost, host.quality(), opts, spec.scene.key, spec.scene.make);
    } catch {
      run = null;
      host.toast(t("error_webgl"));
      // Without a picture the cards are sorted on their own page, as they were before the room.
      queueMicrotask(() => host.fallback());
    }
  }
  function redraw(): void {
    if (stopped) return;
    run?.stop();
    canvasBox.replaceChildren();
    begin();
    render();
  }
  // The room waits while the tab is hidden.
  const onHidden = () => (document.hidden ? run?.game.loop.sleep() : run?.game.loop.wake());
  document.addEventListener("visibilitychange", onHidden);

  // ---------------------------------------------------------------------------------------- the rules
  function command(c: SortRoomCommand): void {
    if (stopped) return;
    const before = state;
    const r = applySortRoom(rules, state, c);
    state = r.state;
    for (const x of r.happened) react(x);
    run?.scene()?.happened(r.happened);
    // The place is kept by the page quest's own rule, with what Hudhud carries (sim/sortroom.ts keptAfter): one place serves the page and the room.
    const kept = keptAfter(before, state);
    if (kept !== undefined) host.keepPlace(kept);
    tell(r.happened);
    if (state.sort.done && !finished) end_();
    render();
  }
  function react(x: SortRoomHappened): void {
    if (x.type === "place" || x.type === "pick" || x.type === "drop") host.sound("part");
    else if (x.type === "show") host.sound("gong");
    else if (x.type === "line") host.sound("line");
    else if (x.type === "feather") host.sound("feather");
    else if (x.type === "talk") host.sound("call");
  }

  /** The words for what a touch did, as the page says them for the way of playing (ui/sortpage.ts showResult). */
  function tell(list_: SortRoomHappened[]): void {
    const paras: HTMLElement[] = [];
    for (const x of list_) {
      if (x.type === "pick") paras.push(h("p", { textContent: t(k.picked, { card: card(x.item) }) }));
      else if (x.type === "drop") paras.push(h("p", { textContent: t(k.putBack, { card: card(x.item) }) }));
      else if (x.type === "place") paras.push(h("p", { textContent: x.group === null ? t(k.didUnplace, { card: card(x.item) }) : t(k.didPlace, { card: card(x.item), name: groupName(x.group) }) }));
      else if (x.type === "look") paras.push(h("p", { textContent: t(k.groupLine, { n: groupNo(x.group), name: groupName(x.group) }) }));
      else if (x.type === "show") {
        const last = state.sort.last;
        if (last?.type !== "show") continue;
        if (last.refused) paras.push(h("p", { class: "stopped", textContent: t(k.refused, { n: num(last.unplaced) }) }));
        else if (state.sort.done) paras.push(h("p", { class: "met", textContent: t(k.didSolved) }));
        else if (state.sort.style === "story") paras.push(h("p", { class: "stopped", textContent: t(k.wrongStory, { list: list(wrongOnes(state.sort).map(card)) }) }));
        else if (state.sort.style === "explorer") paras.push(h("p", { class: "stopped", textContent: t(k.wrongExplorer, { n: num(last.right), total: num(last.total) }) }));
        else paras.push(h("p", { class: "stopped", textContent: t(k.wrongChallenge) }));
      }
    }
    if (paras.length) ran.replaceChildren(...paras);
  }

  function end_(): void {
    finished = true;
    host.sound("restored");
    state = afterDone(rules, state);
    run?.scene()?.finished();
    host.finish(sortRoomGoals(rules, state));
    showPanel();
    // Hudhud's last line is shown first, so that the live region's last word is that the door is open.
    render();
    live.textContent = `${t(spec.who.hudhud)}: ${t("jn_door_lit")}`;
    host.sound("call");
  }
  /** The goals and the museum's note beside the stage, not over it: the bird stays free to walk to the lit door. */
  function showPanel(): void {
    const g = sortRoomGoals(rules, state);
    const slack = rules.slack[state.sort.style];
    const goal = (mark: string, name: Key, how: string, met: boolean) => h("li", {}, h("span", { class: "mark", textContent: mark }), h("span", {}, h("strong", { textContent: t(name) }), h("br", {}), h("span", { class: "small", textContent: how })), h("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    doorPanel.replaceChildren(
      h("h2", { id: spec.panelId, textContent: t("jn_panel_title"), tabIndex: -1 }),
      h("p", { class: "door-line" }, h("strong", { textContent: `${t(spec.who.hudhud)}: ` }), t("jn_door_lit")),
      h("p", { class: "row" }, h("button", { type: "button", class: "door-go", textContent: t("jn_go_door"), onclick: () => host.through() }), h("button", { type: "button", textContent: t("play_again"), onclick: () => again() }), h("button", { type: "button", textContent: t("btn_atlas"), onclick: () => host.leave() })),
      h("h3", { textContent: t("results_title") }),
      h("p", { textContent: progressText() }),
      h(
        "ul",
        { class: "goals" },
        goal("✦", "goal_curiosity", t(k.goalCuriosityHow), g.curiosity),
        goal("⚙", "goal_ingenuity", slack === null ? t(k.goalIngenuityStory) : t(k.goalIngenuityShows, { c: num(slack.shows) }), g.ingenuity),
        goal("♥", "goal_kindness", t(k.goalKindnessHow), g.kindness),
        goal("❧", "goal_feather", t(k.goalFeatherHow), g.feather),
      ),
      h(
        "div",
        { class: "note" },
        h("h3", { textContent: t("note_title") }),
        ...spec.notes.map((n) => h("p", { textContent: t(n) })),
        h("p", { class: "room-note", textContent: t(k.noteRoom) }),
        h("p", { class: "pending", textContent: t(k.review) }),
        ...spec.records.map((id, i) => h("p", {}, h("a", { href: `${host.museum}/${host.lang}/${id}/`, textContent: t("note_link", { name: t(spec.recNames[i]!) }) }))),
      ),
    );
    doorPanel.hidden = false;
  }
  function again(): void {
    // The same way of playing as the room was opened with: its cards are that way's.
    state = newSortRoom(rules, state.sort.style);
    finished = false;
    host.keepPlace(null);
    ran.replaceChildren();
    doorPanel.hidden = true;
    doorPanel.replaceChildren();
    redraw();
    heading.focus({ preventScroll: true });
  }

  // ---------------------------------------------------------------------------------------- the words
  let typing = 0;
  let shownLine = "";
  function renderTalk(): void {
    const talk = state.talk;
    talkBox.hidden = !talk;
    if (!talk) {
      shownLine = "";
      return;
    }
    const line = lineOf(rules.scripts, talk);
    const id = `${talk.script}/${talk.node}/${talk.line}`;
    const text = t(line.key as Key);
    const choices = choicesOf(rules.scripts, talk, new Set<string>(state.sort.flags));
    const fresh = shownLine !== id;
    shownLine = id;
    const lineEl = h("p", { class: "line" });
    lineEl.setAttribute("aria-hidden", "true");
    const speed = host.reducedMotion() ? 0 : host.textSpeed();
    window.clearInterval(typing);
    if (fresh && speed > 0) {
      let n = 0;
      const chars = [...text];
      typing = window.setInterval(() => {
        n = Math.min(chars.length, n + 1);
        lineEl.textContent = chars.slice(0, n).join("");
        if (n >= chars.length) window.clearInterval(typing);
      }, 1000 / speed);
    } else lineEl.textContent = text;
    const who = t(spec.who[line.who as keyof SortRoomPage["who"]] ?? spec.who.hudhud);
    if (fresh) live.textContent = `${who}: ${text}`;
    const next = h("button", { type: "button", class: "primary", textContent: t("btn_next"), onclick: () => command({ type: "forward" }) });
    const body = h(
      "div",
      {},
      h("p", { class: "who", textContent: who }),
      lineEl,
      h("span", { class: "visually-hidden", textContent: text }),
      choices.length ? h("div", { class: "choices" }, ...choices.map((c, i) => h("button", { type: "button", onclick: () => command({ type: "choose", index: i }) }, c.deeper ? h("span", { class: "deeper", textContent: t("deeper_mark") }) : null, t(c.key as Key)))) : null,
      h("div", { class: "row" }, choices.length ? null : next, talk.line > 0 ? h("button", { type: "button", textContent: t("btn_back"), onclick: () => command({ type: "back" }) }) : null, h("button", { type: "button", class: "quiet", textContent: t("btn_skip"), onclick: () => command({ type: "skip" }) })),
    );
    const face = portraits[line.who];
    talkBox.replaceChildren(face ? h("img", { src: face, alt: "", width: 120, height: 120 }) : h("span", {}), body);
    if (fresh) (choices.length ? (talkBox.querySelector(".choices button") as HTMLElement | null) : next)?.focus({ preventScroll: true });
  }

  /** Flies the bird to a thing and touches it; with no picture there is no bird to fly there, and the list touches the thing itself. */
  function go(id: string): void {
    const scene = run?.scene();
    if (scene) scene.goTo(id);
    else command({ type: "touch", id });
  }
  const button = (x: SortRoomThingAt): HTMLButtonElement => {
    const b = h("button", { type: "button", textContent: t("alt_touch", { thing: nameOf(x) }), disabled: frozen(), onclick: () => go(x.id) });
    b.dataset.thing = x.id;
    if (x.item) b.dataset.item = x.item;
    if (x.group) b.dataset.group = x.group;
    return b;
  };

  function render(): void {
    renderTalk();
    const done = state.sort.done;
    const progress = progressText();
    objective.replaceChildren(t(done ? k.objectiveDoor : k.objective), h("small", { textContent: progress }));
    pad.hidden = state.talk !== null;
    stageWrap.classList.toggle("talking", state.talk !== null);
    if (state.talk) prompt.hidden = true;
    if (counts.textContent !== progress) counts.textContent = progress;
    const carried = carryingText();
    if (beak.textContent !== carried) beak.textContent = carried;
    const active = document.activeElement as HTMLElement | null;
    const was = active !== null && words.contains(active) ? active.dataset.thing : undefined;
    const all = things();
    // Once the cards are sorted, the list holds one thing: the door.
    if (done) {
      cardsBox.replaceChildren();
      groupsBox.replaceChildren();
      thingList.replaceChildren(h("li", {}, h("button", { type: "button", textContent: t("jn_go_door"), onclick: () => host.through() })));
    } else {
      // Every card in the order of the cards, the empty place of the carried card on the table just after it.
      const cards = h("ol", { class: "sheet-row" }, ...all.filter((x) => x.kind === "card" || x.kind === "rest").sort((a, b) => a.index! - b.index! || (a.kind === "rest" ? 1 : -1)).map((x) => h("li", {}, button(x))));
      cards.setAttribute("aria-label", t(k.cardsGroup));
      cardsBox.replaceChildren(h("h3", { textContent: t(k.cardsGroup) }), cards);
      const groups = h("ol", { class: "sheet-row" }, ...all.filter((x) => x.kind === "group").map((x) => h("li", {}, button(x))));
      groups.setAttribute("aria-label", t(k.groupsGroup));
      groupsBox.replaceChildren(h("h3", { textContent: t(k.groupsGroup) }), groups);
      thingList.replaceChildren(...[spec.kinds.bell, spec.kinds.voice, spec.kinds.kid, spec.kinds.hide].map((kind) => all.find((x) => x.kind === kind)).filter((x): x is SortRoomThingAt => !!x).map((x) => h("li", {}, button(x))));
    }
    if (was !== undefined) node.querySelector<HTMLElement>(`.room-words [data-thing='${was}']`)?.focus({ preventScroll: true });
  }

  function press(p: "touch" | "pause" | "next" | "back" | "up" | "down"): void {
    if (stopped || host.blocked()) return;
    if (state.talk) {
      const choices = [...talkBox.querySelectorAll<HTMLButtonElement>(".choices button")];
      if (choices.length) {
        const at = Math.max(0, choices.indexOf(document.activeElement as HTMLButtonElement));
        if (p === "up" || p === "down") return choices[(at + (p === "up" ? choices.length - 1 : 1)) % choices.length]!.focus({ preventScroll: true });
        if (p === "next" || p === "touch") return choices[at]!.click();
      }
      if (p === "up" || p === "down" || p === "pause") return;
      return command({ type: p === "back" ? "back" : "forward" });
    }
    if (p === "touch") run?.scene()?.touchNear();
  }

  begin();
  render();
  return {
    node,
    state: () => state,
    command,
    press,
    busy: () => false,
    status: () => ran.textContent ?? "",
    carrying: () => beak.textContent ?? "",
    running: () => run,
    door: () => {
      const w = run?.scene()?.where() ?? null;
      return { lit: state.sort.done, where: { ...spec.door }, bird: w ? { x: w.x, y: w.y } : null };
    },
    redraw,
    stop: () => {
      stopped = true;
      window.clearInterval(typing);
      document.removeEventListener("visibilitychange", onHidden);
      run?.stop();
      run = null;
    },
  };
}
