// Al-Idrisi's hall: the scattered sheets played in a room, by flying over the great table, touching a sheet to lift it
// and another to exchange the two, and in Challenge touching the lamp to check the map (asked for by the founder, 27
// November 2026). The picture is a canvas on the room engine (scenes/idrisi.ts); everything a player reads or presses is
// ordinary page: the words of a talk, the objective, the touch prompt, and under the stage a list that says the whole
// hall in words and lets it be played without the picture (which sheet is lifted, the counts, the seams as far as the way
// of playing shows them, the grid of sheets as rows of buttons, the edges of every sheet as a table, and every other thing
// a button: al-Idrisi, the helper, the stack of loose sheets, and in Challenge the lamp).
//
// The rules are the scattered sheets' (sim/sheets.ts) through the hall's (sim/idrisiroom.ts). What an exchange and a
// check say afterwards is exactly what the page says (ui/sheets.ts), with the page's own words, and depends on the way of
// playing exactly as there.
import { SHEETS_RECORDS, SHEETS_SLACK } from "../content/sheets";
import { ISR_DOOR, ISR_SCRIPTS, isrThings, type IsrSpeaker, type IsrThing } from "../content/idrisi-room";
import type { Cue } from "../audio/cues";
import { startRoom, type Running, type StartOptions } from "../game/boot";
import type { Intent } from "../sim/move";
import { choicesOf, lineOf } from "../narrative/dialogue";
import type { Keeper, Quality } from "../save/save";
import { fewestFromStart, type SheetsStyle } from "../sim/sheets";
import { applyIdrisiRoom, idrisiGoals, keptAfter, newIdrisiRoom, type IdrisiCommand, type IdrisiHappened, type IdrisiState } from "../sim/idrisiroom";
import { IdrisiScene, type IdrisiSceneHost, type IdrisiView } from "../scenes/idrisi";
import { edgesTable, seamsText } from "./sheets";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;
export interface IdrisiHost {
  t(key: Key, vars?: Record<string, string | number>): string;
  num(n: number): string;
  lang: string;
  museum: string;
  /** The subject's name, for the heading. */
  title: string;
  style(): SheetsStyle;
  quality(): Quality;
  keeper(): Keeper;
  reducedMotion(): boolean;
  /** Characters a second for a line of talk; 0 is all at once. */
  textSpeed(): number;
  perf: boolean;
  intent(): Intent;
  bindHold(button: HTMLElement, what: "left" | "right" | "jump"): void;
  /** A sheet (the settings) is open over the page: the hall waits. */
  blocked(): boolean;
  /** A sound, with its caption if it has one. */
  sound(c: Cue): void;
  toast(text: string): void;
  /** The quest is finished: its goals are written into the save. */
  finish(g: { turns: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean }): void;
  /** The bird went through the lit door. */
  through(): void;
  leave(): void;
  /** The hall could not be drawn (WebGL failed): play the scene on its page instead. */
  fallback(): void;
  resume?: IdrisiState | null;
  keepPlace(snap: unknown | null): void;
}
export interface IdrisiRoom {
  node: HTMLElement;
  state(): IdrisiState;
  view(): IdrisiView;
  command(c: IdrisiCommand): void;
  /** A key or a controller's press: touch, go on in a talk, move among its choices. */
  press(p: "touch" | "pause" | "next" | "back" | "up" | "down"): void;
  busy(): boolean;
  running(): Running<IdrisiScene> | null;
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

export function idrisiRoom(host: IdrisiHost): IdrisiRoom {
  const { t, num } = host;
  const rtl = host.lang === "ar" || host.lang === "ur";
  let state: IdrisiState = host.resume ?? newIdrisiRoom(host.style());
  const things = isrThings(state.sheets.style, rtl);
  let portraits: Record<string, string> = {};
  let run: Running<IdrisiScene> | null = null;
  let stopped = false;

  /** A place's row and column, counted from 1, and the sheet that lies there now. */
  const rcOf = (p: number) => ({ r: num(Math.floor(p / state.sheets.cols) + 1), c: num((p % state.sheets.cols) + 1), id: num(state.sheets.grid[p]!) });
  /** What a thing is called: a place by its row and column and the sheet that lies there now. */
  const nameOf = (k: IsrThing): string => (k.kind === "place" ? t("isr_thing_sheet", rcOf(k.place!)) : t(k.name as Key));

  const view = (): IdrisiView => ({ state, done: state.sheets.done });
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
  stage.setAttribute("aria-label", t("isr_canvas_label"));
  const talkBox = h("div", { class: "talk", hidden: true });
  talkBox.setAttribute("role", "group");
  const stageWrap = h("div", { class: "stage-wrap" }, objective, stage, talkBox);
  const doorPanel = h("section", { class: "door-panel", hidden: true });
  doorPanel.setAttribute("aria-labelledby", "isr-panel-title");
  const live = h("div", { class: "visually-hidden", role: "status" });
  live.setAttribute("aria-live", "polite");

  // The hall in words: which sheet is lifted, the counts, the seams, the grid of sheets, the edges, the other things.
  const lifted = h("p", { class: "carrying" });
  lifted.setAttribute("aria-live", "polite");
  const progress = h("p", { class: "small" });
  const status = h("p", { class: "status" });
  const gridBox = h("div", { class: "sheet-rows" });
  gridBox.setAttribute("role", "group");
  gridBox.setAttribute("aria-label", t("id_grid_group"));
  const edges = h("details", { class: "edges" });
  const thingList = h("ul", {});
  const ran = h("div", { class: "ran" });
  ran.setAttribute("aria-live", "polite");
  const words = h("section", { class: "room-words" }, h("h2", { textContent: t("alt_title") }), lifted, progress, status, gridBox, edges, thingList, ran);
  const note = h(
    "section",
    {},
    h("h2", { textContent: t("note_title") }),
    h("p", { textContent: t("isr_note_room") }),
    h("p", { class: "small", textContent: t("art_note") }),
    h("h2", { textContent: t("controls_title") }),
    // The keys only: the workshop's line about touch speaks of tapping a mirror, which this hall has not.
    h("p", { class: "small", textContent: t("controls_keys") }),
  );
  const node = h("div", { class: "room" }, heading, stageWrap, doorPanel, h("div", { class: "words" }, words, note), live);

  // ---------------------------------------------------------------------------------------- the picture
  const sceneHost: IdrisiSceneHost = {
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
    speaking: () => (state.talk ? { who: lineOf(ISR_SCRIPTS, state.talk).who, mood: lineOf(ISR_SCRIPTS, state.talk).mood } : null),
    look: () => ({ quality: host.quality(), reducedMotion: host.reducedMotion(), style: state.sheets.style, keeper: host.keeper() }),
    portraits: (urls) => ((portraits = urls), renderTalk()),
    view,
    rtl,
  };
  const opts: StartOptions = { perf: host.perf, onLost: () => host.toast(t("context_lost")), onRestored: () => redraw() };
  function begin(): void {
    try {
      run = startRoom(canvasBox, sceneHost, host.quality(), opts, "idrisi", IdrisiScene);
    } catch {
      run = null;
      host.toast(t("error_webgl"));
      // Without a picture the scattered sheets are played on their own page, as they were before the hall.
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
  // The hall waits while the tab is hidden.
  const onHidden = () => (document.hidden ? run?.game.loop.sleep() : run?.game.loop.wake());
  document.addEventListener("visibilitychange", onHidden);

  // ---------------------------------------------------------------------------------------- the rules
  function command(c: IdrisiCommand): void {
    if (stopped) return;
    const before = state;
    const r = applyIdrisiRoom(state, c);
    state = r.state;
    for (const x of r.happened) react(x);
    run?.scene()?.happened(r.happened);
    // The place is kept by the page quest's own rule, with the lifted sheet added (sim/idrisiroom.ts keptAfter): one place serves the page and the hall.
    const kept = keptAfter(before, state, r.commands);
    if (kept !== undefined) host.keepPlace(kept);
    render();
    if (r.happened.some((x) => x.type === "opened")) end_();
  }
  function react(x: IdrisiHappened): void {
    if (x.type === "lift") host.sound("line");
    else if (x.type === "put") {
      host.sound("line");
      ran.replaceChildren(h("p", { textContent: t("id_let_go") }));
    } else if (x.type === "exchange") {
      host.sound("line");
      showResult(x);
    } else if (x.type === "check") showResult(x);
    else if (x.type === "opened") host.sound("restored");
    else if (x.type === "feather") host.sound("feather");
    else if (x.type === "talk") host.sound("call");
    else if (x.type === "line") host.sound("line");
  }
  /** What the page says after an exchange or a check: what it did, and then where the seams stand as far as the way of playing shows it, in the page's own words. */
  function showResult(x: Extract<IdrisiHappened, { type: "exchange" | "check" }>): void {
    const s = state.sheets;
    const paras: HTMLElement[] = [];
    if (x.type === "exchange") {
      const a = rcOf(x.a);
      const b = rcOf(x.b);
      paras.push(h("p", { class: s.done ? "met" : "", textContent: s.done ? t("id_did_solved") : t("id_did_exchange", { r1: a.r, c1: a.c, r2: b.r, c2: b.c }) }));
    } else if (s.done) paras.push(h("p", { class: "met", textContent: t("id_did_solved") }));
    if (!s.done) paras.push(h("p", { class: "status", textContent: seamsText(s, t, num, rtl) }));
    ran.replaceChildren(...paras);
  }

  function end_(): void {
    host.finish(idrisiGoals(state));
    showPanel();
    live.textContent = `${t("id_who_hudhud")}: ${t("jn_door_lit")}`;
    host.sound("call");
  }
  /** The goals and the museum's note beside the stage, not over it: the bird stays free to walk to the lit door. */
  function showPanel(): void {
    const s = state.sheets;
    const g = idrisiGoals(state);
    const slack = SHEETS_SLACK[s.style];
    const goal = (mark: string, name: Key, how: string, met: boolean) => h("li", {}, h("span", { class: "mark", textContent: mark }), h("span", {}, h("strong", { textContent: t(name) }), h("br", {}), h("span", { class: "small", textContent: how })), h("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    const how = slack === null ? t("id_goal_ingenuity_story") : slack.checks === null ? t("id_goal_ingenuity_explorer", { m: num(fewestFromStart(s) + slack.extra) }) : t("id_goal_ingenuity_challenge", { m: num(fewestFromStart(s) + slack.extra), c: num(slack.checks) });
    const names: Key[] = ["id_rec_person", "id_rec_book"];
    doorPanel.replaceChildren(
      h("h2", { id: "isr-panel-title", textContent: t("jn_panel_title"), tabIndex: -1 }),
      h("p", { class: "door-line" }, h("strong", { textContent: `${t("id_who_hudhud")}: ` }), t("jn_door_lit")),
      h("p", { class: "row" }, h("button", { type: "button", class: "door-go", textContent: t("jn_go_door"), onclick: () => host.through() }), h("button", { type: "button", textContent: t("play_again"), onclick: () => again() }), h("button", { type: "button", textContent: t("btn_atlas"), onclick: () => host.leave() })),
      h("h3", { textContent: t("results_title") }),
      h("p", { textContent: s.style === "challenge" ? t("id_progress_checks", { moves: num(g.turns), checks: num(g.slips) }) : t("id_progress", { moves: num(g.turns) }) }),
      h("ul", { class: "goals" }, goal("✦", "goal_curiosity", t("id_goal_curiosity_how"), g.curiosity), goal("⚙", "goal_ingenuity", how, g.ingenuity), goal("♥", "goal_kindness", t("id_goal_kindness_how"), g.kindness), goal("❧", "goal_feather", t("id_goal_feather_how"), g.feather)),
      h(
        "div",
        { class: "note" },
        h("h3", { textContent: t("note_title") }),
        h("p", { textContent: t("id_note_1") }),
        h("p", { textContent: t("id_note_2") }),
        h("p", { textContent: t("id_note_3") }),
        h("p", { class: "room-note", textContent: t("isr_note_room") }),
        h("p", { class: "pending", textContent: t("id_review") }),
        ...SHEETS_RECORDS.map((id, i) => h("p", {}, h("a", { href: `${host.museum}/${host.lang}/${id}/`, textContent: t("note_link", { name: t(names[i]!) }) }))),
      ),
    );
    doorPanel.hidden = false;
  }
  function again(): void {
    // The same way of playing as the hall was opened with: its places and its list of things are that map's.
    state = newIdrisiRoom(state.sheets.style);
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
    const line = lineOf(ISR_SCRIPTS, talk);
    const id = `${talk.script}/${talk.node}/${talk.line}`;
    const text = t(line.key as Key);
    const choices = choicesOf(ISR_SCRIPTS, talk, new Set<string>(state.sheets.flags));
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
    const who = t(`id_who_${line.who === "keeper" ? "hudhud" : line.who}` as Key);
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
    const face = portraits[line.who as IsrSpeaker];
    talkBox.replaceChildren(face ? h("img", { src: face, alt: "", width: 120, height: 120 }) : h("span", {}), body);
    if (fresh) (choices.length ? (talkBox.querySelector(".choices button") as HTMLElement | null) : next)?.focus({ preventScroll: true });
  }

  /** Flies the bird to a thing and touches it; with no picture there is no bird to fly there, and the list touches the thing itself. */
  function go(id: string): void {
    const scene = run?.scene();
    if (scene) scene.goTo(id);
    else command({ type: "touch", id });
  }
  /** What a thing's button says: where it goes and, for the lamp, the page's own words for what it does. */
  function label(k: IsrThing): string {
    if (k.kind === "lamp") return t("isr_use_btn", { thing: nameOf(k), move: t("id_check") });
    return t("alt_touch", { thing: nameOf(k) });
  }

  function render(): void {
    renderTalk();
    const s = state.sheets;
    const done = s.done;
    const counts = s.style === "challenge" ? t("id_progress_checks", { moves: num(s.moves), checks: num(s.checks) }) : t("id_progress", { moves: num(s.moves) });
    const aim = done ? "isr_objective_door" : s.style === "challenge" ? "isr_objective_challenge" : "isr_objective";
    objective.replaceChildren(t(aim), h("small", { textContent: counts }));
    pad.hidden = state.talk !== null;
    stageWrap.classList.toggle("talking", state.talk !== null);
    if (state.talk) prompt.hidden = true;
    const liftText = state.lifted !== null ? t("isr_lifted", { n: num(s.grid[state.lifted]!) }) : t("isr_lifted_none");
    if (lifted.textContent !== liftText) lifted.textContent = liftText;
    progress.textContent = counts;
    status.textContent = done ? t("id_seams_none") : seamsText(s, t, num, rtl);
    // The edges of every sheet, as the page's table gives them (they do not change as the sheets move).
    if (!edges.firstChild) edges.replaceChildren(...edgesTable(s, t, num));
    // The grid of sheets, row by row: a button for every place, which flies the bird there and touches the sheet.
    const active = document.activeElement as HTMLElement | null;
    const was = active !== null && gridBox.contains(active) ? active.dataset.thing : undefined;
    gridBox.replaceChildren(
      ...Array.from({ length: s.rows }, (_, r) =>
        h(
          "ol",
          { class: "sheet-row" },
          ...Array.from({ length: s.cols }, (_, c) => {
            const p = r * s.cols + c;
            const k = things.find((x) => x.id === `place-${p}`)!;
            const b = h("button", { type: "button", textContent: label(k), disabled: done || frozen(), onclick: () => go(k.id) });
            b.dataset.thing = k.id;
            b.setAttribute("aria-pressed", String(state.lifted === p));
            return h("li", {}, b);
          }),
        ),
      ),
    );
    if (was !== undefined) gridBox.querySelector<HTMLElement>(`[data-thing='${was}']`)?.focus({ preventScroll: true });
    // Once the map is in order, the list holds one thing: the door.
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
    busy: () => false,
    running: () => run,
    door: () => {
      const w = run?.scene()?.where() ?? null;
      return { lit: view().done, where: { ...ISR_DOOR }, bird: w ? { x: w.x, y: w.y } : null };
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
