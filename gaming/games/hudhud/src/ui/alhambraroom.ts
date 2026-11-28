// The Alhambra's court: the channels of the dry fountain turned in a room, by flying over the great stone panel and
// touching a piece to give it a quarter turn, and in Challenge touching the sluice lever by the spout to open the sluice
// (asked for by the founder, 27 November 2026: every scene a complete room, its puzzle played in the room). The picture
// is a canvas on the room engine (scenes/alhambra.ts); everything a player reads or presses is ordinary page: the words
// of a talk, the objective, the touch prompt, and under the stage a list that says the whole court in words and lets it
// be played without the picture (the counts, where the water stands as far as the way of playing shows it, every piece as
// a button in its rows and columns with its openings and whether it has water, the page's table of every piece, and every
// other thing a button: the keeper of the water, the girl who sweeps the court, the rim of the fountain, and in Challenge
// the sluice lever).
//
// The rules are the channels' (sim/channels.ts) through the court's (sim/alhambraroom.ts). What a turn and an opening
// of the sluice say afterwards is exactly what the page says (ui/channels.ts, with its own words: channelsWords), and
// depends on the way of playing exactly as there. The grid is not the plan of the Alhambra or of its waterworks: the
// quest's notes say so, and the court's own note says it again.
import { CHANNELS_RECORDS, CHANNELS_SLACK } from "../content/channels";
import { AHR_DOOR, AHR_SCRIPTS, ahrThings, type AhrSpeaker, type AhrThing } from "../content/alhambra-room";
import type { Cue } from "../audio/cues";
import { startRoom, type Running, type StartOptions } from "../game/boot";
import type { Intent } from "../sim/move";
import { choicesOf, lineOf } from "../narrative/dialogue";
import type { Keeper, Quality } from "../save/save";
import { fewestFromStart, flow, gridOf, type ChannelsStyle } from "../sim/channels";
import { alhambraGoals, applyAlhambraRoom, keptAfter, newAlhambraRoom, type AlhambraCommand, type AlhambraHappened, type AlhambraState } from "../sim/alhambraroom";
import { AlhambraScene, type AlhambraSceneHost, type AlhambraView } from "../scenes/alhambra";
import { channelsWords } from "./channels";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;
export interface AlhambraHost {
  t(key: Key, vars?: Record<string, string | number>): string;
  num(n: number): string;
  lang: string;
  museum: string;
  /** The subject's name, for the heading. */
  title: string;
  style(): ChannelsStyle;
  quality(): Quality;
  keeper(): Keeper;
  reducedMotion(): boolean;
  /** Characters a second for a line of talk; 0 is all at once. */
  textSpeed(): number;
  perf: boolean;
  intent(): Intent;
  bindHold(button: HTMLElement, what: "left" | "right" | "jump"): void;
  /** A sheet (the settings) is open over the page: the court waits. */
  blocked(): boolean;
  /** A sound, with its caption if it has one. */
  sound(c: Cue): void;
  toast(text: string): void;
  /** The quest is finished: its goals are written into the save. */
  finish(g: { turns: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean }): void;
  /** The bird went through the lit door. */
  through(): void;
  leave(): void;
  /** The court could not be drawn (WebGL failed): play the scene on its page instead. */
  fallback(): void;
  resume?: AlhambraState | null;
  keepPlace(snap: unknown | null): void;
}
export interface AlhambraRoom {
  node: HTMLElement;
  state(): AlhambraState;
  view(): AlhambraView;
  command(c: AlhambraCommand): void;
  /** A key or a controller's press: touch, go on in a talk, move among its choices. */
  press(p: "touch" | "pause" | "next" | "back" | "up" | "down"): void;
  /** True while the water is shown running along the channels (never when movement is kept still). */
  busy(): boolean;
  /** What the page says now about the water, in words. */
  status(): string;
  running(): Running<AlhambraScene> | null;
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

export function alhambraRoom(host: AlhambraHost): AlhambraRoom {
  const { t, num } = host;
  const rtl = host.lang === "ar" || host.lang === "ur";
  let state: AlhambraState = host.resume ?? newAlhambraRoom(host.style());
  const things = ahrThings(state.channels.style, rtl);
  const words = channelsWords(() => state.channels, t, num, rtl);
  let portraits: Record<string, string> = {};
  let run: Running<AlhambraScene> | null = null;
  let stopped = false;

  /** What a thing is called: a piece by its row and place and what it is. */
  const nameOf = (k: AhrThing): string => (k.kind === "place" ? t("ahr_thing_piece", { ...words.rc(k.place!), piece: words.pieceName(k.place!) }) : t(k.name as Key));

  const view = (): AlhambraView => ({ state, done: state.channels.done });
  const frozen = () => stopped || state.talk !== null || host.blocked();

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
  stage.setAttribute("aria-label", t("ahr_canvas_label"));
  const talkBox = h("div", { class: "talk", hidden: true });
  talkBox.setAttribute("role", "group");
  const stageWrap = h("div", { class: "stage-wrap" }, objective, stage, talkBox);
  const doorPanel = h("section", { class: "door-panel", hidden: true });
  doorPanel.setAttribute("aria-labelledby", "ahr-panel-title");
  const live = h("div", { class: "visually-hidden", role: "status" });
  live.setAttribute("aria-live", "polite");

  // The court in words: the counts, the water, the pieces row by row, every piece's openings, the other things.
  const progress = h("p", { class: "carrying" });
  const status = h("p", { class: "status" });
  status.setAttribute("aria-live", "polite");
  const gridBox = h("div", { class: "channel-rows" });
  gridBox.setAttribute("role", "group");
  gridBox.setAttribute("aria-label", t("ah_grid_group"));
  const edges = h("details", { class: "edges" });
  const thingList = h("ul", {});
  const ran = h("div", { class: "ran" });
  ran.setAttribute("aria-live", "polite");
  const wordsBox = h("section", { class: "room-words" }, h("h2", { textContent: t("alt_title") }), progress, status, gridBox, edges, thingList, ran);
  const note = h(
    "section",
    {},
    h("h2", { textContent: t("note_title") }),
    h("p", { textContent: t("ahr_note_room") }),
    h("p", { class: "small", textContent: t("art_note") }),
    h("h2", { textContent: t("controls_title") }),
    // The keys only: the workshop's line about touch speaks of tapping a mirror, which this court has not.
    h("p", { class: "small", textContent: t("controls_keys") }),
  );
  const node = h("div", { class: "room" }, heading, stageWrap, doorPanel, h("div", { class: "words" }, wordsBox, note), live);

  // ---------------------------------------------------------------------------------------- the picture
  const sceneHost: AlhambraSceneHost = {
    intent: () => host.intent(),
    frozen,
    touch: (id) => command({ type: "touch", id }),
    near: (id) => {
      const thing = things.find((k) => k.id === id);
      prompt.hidden = (!thing && id !== "door") || state.talk !== null;
      if (id === "door") prompt.textContent = t("jn_go_door");
      else if (thing) prompt.textContent = t("touch_prompt", { thing: nameOf(thing) });
    },
    through: () => host.through(),
    sound: (c) => host.sound(c),
    speaking: () => (state.talk ? { who: lineOf(AHR_SCRIPTS, state.talk).who, mood: lineOf(AHR_SCRIPTS, state.talk).mood } : null),
    look: () => ({ quality: host.quality(), reducedMotion: host.reducedMotion(), style: state.channels.style, keeper: host.keeper() }),
    portraits: (urls) => ((portraits = urls), renderTalk()),
    view,
    rtl,
  };
  const opts: StartOptions = { perf: host.perf, onLost: () => host.toast(t("context_lost")), onRestored: () => redraw() };
  function begin(): void {
    try {
      run = startRoom(canvasBox, sceneHost, host.quality(), opts, "alhambra", AlhambraScene);
    } catch {
      run = null;
      host.toast(t("error_webgl"));
      // Without a picture the channels are turned on their own page, as they were before the court.
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
  // The court waits while the tab is hidden.
  const onHidden = () => (document.hidden ? run?.game.loop.sleep() : run?.game.loop.wake());
  document.addEventListener("visibilitychange", onHidden);

  // ---------------------------------------------------------------------------------------- the rules
  function command(c: AlhambraCommand): void {
    if (stopped) return;
    const r = applyAlhambraRoom(state, c);
    state = r.state;
    for (const x of r.happened) react(x);
    run?.scene()?.happened(r.happened);
    // The place is kept by the page quest's own rule (sim/alhambraroom.ts keptAfter): one place serves the page and the court.
    const kept = keptAfter(state, r.commands);
    if (kept !== undefined) host.keepPlace(kept);
    render();
    if (r.happened.some((x) => x.type === "opened")) end_();
  }
  function react(x: AlhambraHappened): void {
    if (x.type === "turn") {
      host.sound("line");
      showResult(x);
    } else if (x.type === "fixed") ran.replaceChildren(h("p", { textContent: t("ah_fixed", words.rc(x.place)) }));
    else if (x.type === "open") {
      host.sound("line");
      showResult(x);
    } else if (x.type === "opened") host.sound("restored");
    else if (x.type === "feather") host.sound("feather");
    else if (x.type === "talk") host.sound("call");
    else if (x.type === "line") host.sound("line");
  }
  /** What the page says after a turn or an opening of the sluice: what it did, and then where the water stands as far as the way of playing shows it, in the page's own words. */
  function showResult(x: Extract<AlhambraHappened, { type: "turn" | "open" }>): void {
    const paras: HTMLElement[] = [];
    if (state.channels.done) paras.push(h("p", { class: "met", textContent: t("ah_did_solved") }));
    else {
      paras.push(h("p", { textContent: x.type === "turn" ? t("ah_did_turn", words.rc(x.place)) : t("ah_did_open") }));
      paras.push(h("p", { class: "status", textContent: words.statusText() }));
    }
    ran.replaceChildren(...paras);
  }

  function end_(): void {
    host.finish(alhambraGoals(state));
    showPanel();
    live.textContent = `${t("ah_who_hudhud")}: ${t("jn_door_lit")}`;
    host.sound("call");
  }
  /** The goals and the museum's note beside the stage, not over it: the bird stays free to walk to the lit door. */
  function showPanel(): void {
    const s = state.channels;
    const g = alhambraGoals(state);
    const slack = CHANNELS_SLACK[s.style];
    const goal = (mark: string, name: Key, how: string, met: boolean) => h("li", {}, h("span", { class: "mark", textContent: mark }), h("span", {}, h("strong", { textContent: t(name) }), h("br", {}), h("span", { class: "small", textContent: how })), h("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    const best = fewestFromStart(s);
    const how = slack === null ? t("ah_goal_ingenuity_story") : slack.openings === null ? t("ah_goal_ingenuity_explorer", { m: num(best + slack.extra) }) : t("ah_goal_ingenuity_challenge", { m: num(best + slack.extra), c: num(slack.openings) });
    const names: Key[] = ["ah_rec_alhambra", "ah_rec_palaces"];
    doorPanel.replaceChildren(
      h("h2", { id: "ahr-panel-title", textContent: t("jn_panel_title"), tabIndex: -1 }),
      h("p", { class: "door-line" }, h("strong", { textContent: `${t("ah_who_hudhud")}: ` }), t("jn_door_lit")),
      h("p", { class: "row" }, h("button", { type: "button", class: "door-go", textContent: t("jn_go_door"), onclick: () => host.through() }), h("button", { type: "button", textContent: t("play_again"), onclick: () => again() }), h("button", { type: "button", textContent: t("btn_atlas"), onclick: () => host.leave() })),
      h("h3", { textContent: t("results_title") }),
      h("p", { textContent: s.style === "challenge" ? t("ah_progress_open", { moves: num(g.turns), openings: num(g.slips) }) : t("ah_progress", { moves: num(g.turns) }) }),
      h("ul", { class: "goals" }, goal("✦", "goal_curiosity", t("ah_goal_curiosity_how"), g.curiosity), goal("⚙", "goal_ingenuity", how, g.ingenuity), goal("♥", "goal_kindness", t("ah_goal_kindness_how"), g.kindness), goal("❧", "goal_feather", t("ah_goal_feather_how"), g.feather)),
      h(
        "div",
        { class: "note" },
        h("h3", { textContent: t("note_title") }),
        h("p", { textContent: t("ah_note_1") }),
        h("p", { textContent: t("ah_note_2") }),
        h("p", { textContent: t("ah_note_3") }),
        h("p", { textContent: t("ah_note_4") }),
        h("p", { class: "room-note", textContent: t("ahr_note_room") }),
        h("p", { class: "pending", textContent: t("ah_review") }),
        ...CHANNELS_RECORDS.map((id, i) => h("p", {}, h("a", { href: `${host.museum}/${host.lang}/${id}/`, textContent: t("note_link", { name: t(names[i]!) }) }))),
      ),
    );
    doorPanel.hidden = false;
  }
  function again(): void {
    // The same way of playing as the court was opened with: its places and its list of things are that grid's.
    state = newAlhambraRoom(state.channels.style);
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
    const line = lineOf(AHR_SCRIPTS, talk);
    const id = `${talk.script}/${talk.node}/${talk.line}`;
    const text = t(line.key as Key);
    const choices = choicesOf(AHR_SCRIPTS, talk, new Set<string>(state.channels.flags));
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
    // The keeper of the water is the page's "keeper", the girl its "girl"; their names say they are invented people.
    const who = t(line.who === "voice" ? "ah_who_keeper" : line.who === "kid" ? "ah_who_girl" : (`ah_who_${line.who}` as Key));
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
    const face = portraits[line.who as AhrSpeaker];
    talkBox.replaceChildren(face ? h("img", { src: face, alt: "", width: 120, height: 120 }) : h("span", {}), body);
    if (fresh) (choices.length ? (talkBox.querySelector(".choices button") as HTMLElement | null) : next)?.focus({ preventScroll: true });
  }

  /** Flies the bird to a thing and touches it; with no picture there is no bird to fly there, and the list touches the thing itself. */
  function go(id: string): void {
    const scene = run?.scene();
    if (scene) scene.goTo(id);
    else command({ type: "touch", id });
  }
  /** What a thing's button says: where it goes and, for the sluice lever, the page's own words for what it does. */
  function label(k: AhrThing): string {
    if (k.kind === "sluice") return t("ahr_use_btn", { thing: nameOf(k), move: t("ah_sluice") });
    return t("alt_touch", { thing: nameOf(k) });
  }

  function render(): void {
    renderTalk();
    const s = state.channels;
    const done = s.done;
    const counts = s.style === "challenge" ? t("ah_progress_open", { moves: num(s.moves), openings: num(s.openings) }) : t("ah_progress", { moves: num(s.moves) });
    const aim = done ? "ahr_objective_door" : s.style === "challenge" ? "ahr_objective_challenge" : "ahr_objective";
    objective.replaceChildren(t(aim), h("small", { textContent: counts }));
    pad.hidden = state.talk !== null;
    stageWrap.classList.toggle("talking", state.talk !== null);
    if (state.talk) prompt.hidden = true;
    progress.textContent = counts;
    const st = done ? t("ah_did_solved") : words.statusText();
    if (status.textContent !== st) status.textContent = st;
    // Every piece's openings, as the page's table gives them, kept open if it was.
    const open = edges.open;
    edges.replaceChildren(...words.table());
    edges.open = open;
    // The pieces, row by row: a button for every place, which flies the bird there and touches the piece (a quarter turn).
    const active = document.activeElement as HTMLElement | null;
    const was = active !== null && gridBox.contains(active) ? active.dataset.thing : undefined;
    const f = flow(gridOf(s));
    gridBox.replaceChildren(
      ...Array.from({ length: s.rows }, (_, r) =>
        h(
          "ol",
          { class: "channel-row" },
          ...Array.from({ length: s.cols }, (_, c) => {
            const p = r * s.cols + c;
            const b = h("button", { type: "button", textContent: t("alt_touch", { thing: words.label(p, f) }), disabled: done || frozen(), onclick: () => go(`place-${p}`) });
            b.dataset.thing = `place-${p}`;
            return h("li", {}, b);
          }),
        ),
      ),
    );
    if (was !== undefined) gridBox.querySelector<HTMLElement>(`[data-thing='${was}']`)?.focus({ preventScroll: true });
    // Once the water reaches every basin, the list holds one thing: the door.
    if (done) thingList.replaceChildren(h("li", {}, h("button", { type: "button", textContent: t("jn_go_door"), onclick: () => host.through() })));
    else
      thingList.replaceChildren(
        ...things
          .filter((k) => k.kind !== "place")
          .map((k) => {
            const b = h("button", { type: "button", textContent: label(k), disabled: frozen(), onclick: () => go(k.id) });
            b.dataset.thing = k.id;
            return h("li", {}, b);
          }),
      );
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
    view,
    command,
    press,
    busy: () => run?.scene()?.running() ?? false,
    status: () => words.statusText(),
    running: () => run,
    door: () => {
      const w = run?.scene()?.where() ?? null;
      return { lit: view().done, where: { ...AHR_DOOR }, bird: w ? { x: w.x, y: w.y } : null };
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
