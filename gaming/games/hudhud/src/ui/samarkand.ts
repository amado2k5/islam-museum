// The paper workshop of Samarkand: the paper quest played in a room, the thirteenth and last of the journey, by flying
// along the long workbench, touching a card to lift it and another place to exchange the two cards, and touching the
// bell at the end of the bench to make a sheet (asked for by the founder, 27 November 2026). The picture is a canvas on the
// room engine (scenes/samarkand.ts); everything a player reads or presses is ordinary page: the words of a talk, the
// objective, the touch prompt, and under the stage a list that says the whole workshop in words and lets it be played
// without the picture (which card is lifted, the count of moves, every place of the bench as a button with its card
// named, the bell, the papermaker, the child and the spare mould as buttons, and the sentences of the last run).
//
// The rules are the paper's (sim/paper.ts over sim/chainquest.ts) through the workshop's (sim/samarkandroom.ts). A run is
// shown a place at a time exactly as on the page (ui/rowpage.ts): the page's sentence for each card that worked, then
// how it ended, then, in Story, what the place where it stopped needs and, in Explorer, what reached it; at once when
// movement is kept still (the game's one helper for that, `calm` in ui/app.ts).
import { PAPER_RECORDS, PAPER_SLACK } from "../content/paper";
import { SMR_DOOR, SMR_SCRIPTS, smrThings, type SmrSpeaker, type SmrThing } from "../content/samarkand-room";
import type { Cue } from "../audio/cues";
import { startRoom, type Running, type StartOptions } from "../game/boot";
import type { Intent } from "../sim/move";
import { choicesOf, lineOf } from "../narrative/dialogue";
import type { Keeper, Quality } from "../save/save";
import type { PaperStyle } from "../sim/paper";
import { afterRun, applySamarkandRoom, keptAfter, newSamarkandRoom, samarkandGoals, type SamarkandCommand, type SamarkandHappened, type SamarkandState } from "../sim/samarkandroom";
import { SamarkandScene, type SamarkandSceneHost, type SamarkandView } from "../scenes/samarkand";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;
export interface SamarkandHost {
  t(key: Key, vars?: Record<string, string | number>): string;
  num(n: number): string;
  lang: string;
  museum: string;
  /** The subject's name, for the heading. */
  title: string;
  style(): PaperStyle;
  quality(): Quality;
  keeper(): Keeper;
  reducedMotion(): boolean;
  /** Characters a second for a line of talk; 0 is all at once. */
  textSpeed(): number;
  perf: boolean;
  intent(): Intent;
  bindHold(button: HTMLElement, what: "left" | "right" | "jump"): void;
  /** A sheet (the settings) is open over the page: the workshop waits. */
  blocked(): boolean;
  /** A sound, with its caption if it has one. */
  sound(c: Cue): void;
  toast(text: string): void;
  /** The quest is finished: its goals are written into the save. */
  finish(g: { turns: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean }): void;
  /** The bird went through the lit door. */
  through(): void;
  leave(): void;
  /** The workshop could not be drawn (WebGL failed): play the scene on its page instead. */
  fallback(): void;
  resume?: SamarkandState | null;
  keepPlace(snap: unknown | null): void;
}
export interface SamarkandRoom {
  node: HTMLElement;
  state(): SamarkandState;
  view(): SamarkandView;
  command(c: SamarkandCommand): void;
  /** A key or a controller's press: touch, go on in a talk, move among its choices. */
  press(p: "touch" | "pause" | "next" | "back" | "up" | "down"): void;
  /** True while a run is being shown a place at a time. */
  busy(): boolean;
  running(): Running<SamarkandScene> | null;
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

/** A card's or a state's id as the tail of a string key: `clean-bleach` is `clean_bleach` (as ui/paper.ts has it). */
const tail = (id: string): string => id.replace(/-/g, "_");

export function samarkandRoom(host: SamarkandHost): SamarkandRoom {
  const { t, num } = host;
  const rtl = host.lang === "ar" || host.lang === "ur";
  let state: SamarkandState = host.resume ?? newSamarkandRoom(host.style());
  const things = smrThings(state.paper.style, rtl);
  let shown = state.paper.last ? state.paper.last.moved.length : 0; // places of the last run shown so far
  let showing = false; // a run is being shown
  let timer = 0;
  let portraits: Record<string, string> = {};
  let run: Running<SamarkandScene> | null = null;
  let stopped = false;

  const cardName = (id: string | null) => (id ? t(`pp_part_${tail(id)}` as Key) : "");
  /** What a thing is called: a place by its number and the card that stands there now. */
  const nameOf = (k: SmrThing): string => (k.kind === "place" ? t("smr_thing_place", { n: num(k.place! + 1), card: cardName(state.paper.puzzle.places[k.place!] ?? null) }) : t(k.name as Key));

  const view = (): SamarkandView => {
    const last = state.paper.last;
    return { state, lit: last ? Math.min(shown, last.moved.length) : 0, stopped: last && last.end !== "done" && !showing ? last.at : null, running: showing, done: state.paper.done && !showing };
  };
  const frozen = () => stopped || state.talk !== null || showing || host.blocked();

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
  stage.setAttribute("aria-label", t("smr_canvas_label"));
  const talkBox = h("div", { class: "talk", hidden: true });
  talkBox.setAttribute("role", "group");
  const stageWrap = h("div", { class: "stage-wrap" }, objective, stage, talkBox);
  const doorPanel = h("section", { class: "door-panel", hidden: true });
  doorPanel.setAttribute("aria-labelledby", "smr-panel-title");
  const live = h("div", { class: "visually-hidden", role: "status" });
  live.setAttribute("aria-live", "polite");

  // The workshop in words: which card is lifted, the count of moves, the places of the bench, the other things, the last run.
  const lifted = h("p", { class: "carrying" });
  lifted.setAttribute("aria-live", "polite");
  const movesLine = h("p", { class: "small" });
  const placeBox = h("div", { class: "sheet-rows" });
  placeBox.setAttribute("role", "group");
  placeBox.setAttribute("aria-label", t("smr_places_group"));
  const thingList = h("ul", {});
  const ran = h("div", { class: "ran" });
  ran.setAttribute("aria-live", "polite");
  const words = h("section", { class: "room-words" }, h("h2", { textContent: t("alt_title") }), lifted, movesLine, placeBox, thingList, ran);
  const note = h(
    "section",
    {},
    h("h2", { textContent: t("note_title") }),
    h("p", { textContent: t("smr_note_room") }),
    h("p", { class: "small", textContent: t("art_note") }),
    h("h2", { textContent: t("controls_title") }),
    // The keys only: Ibn al-Haytham's workshop's line about touch speaks of tapping a mirror, which this workshop has not.
    h("p", { class: "small", textContent: t("controls_keys") }),
  );
  const node = h("div", { class: "room" }, heading, stageWrap, doorPanel, h("div", { class: "words" }, words, note), live);

  // ---------------------------------------------------------------------------------------- the picture
  const sceneHost: SamarkandSceneHost = {
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
    speaking: () => (state.talk ? { who: lineOf(SMR_SCRIPTS, state.talk).who, mood: lineOf(SMR_SCRIPTS, state.talk).mood } : null),
    look: () => ({ quality: host.quality(), reducedMotion: host.reducedMotion(), style: state.paper.style, keeper: host.keeper() }),
    portraits: (urls) => ((portraits = urls), renderTalk()),
    view,
    rtl,
  };
  const opts: StartOptions = { perf: host.perf, onLost: () => host.toast(t("context_lost")), onRestored: () => redraw() };
  function begin(): void {
    try {
      run = startRoom(canvasBox, sceneHost, host.quality(), opts, "samarkand", SamarkandScene);
    } catch {
      run = null;
      host.toast(t("error_webgl"));
      // Without a picture the paper is made on its own page, as it was before the workshop.
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
  // The workshop waits while the tab is hidden.
  const onHidden = () => (document.hidden ? run?.game.loop.sleep() : run?.game.loop.wake());
  document.addEventListener("visibilitychange", onHidden);

  // ---------------------------------------------------------------------------------------- the rules
  function command(c: SamarkandCommand): void {
    if (stopped || showing) return;
    const before = state;
    const r = applySamarkandRoom(state, c);
    state = r.state;
    for (const x of r.happened) react(x);
    run?.scene()?.happened(r.happened);
    // A card put into a place clears what the last run showed, as on the page.
    if (r.commands.some((k) => k.type === "put")) {
      ran.replaceChildren();
      shown = 0;
    }
    // The place is kept by the page quest's own rule, with the lifted card added (sim/samarkandroom.ts keptAfter): one place serves the page and the workshop.
    const kept = keptAfter(before, state, r.commands);
    if (kept !== undefined) host.keepPlace(kept);
    if (r.commands.some((k) => k.type === "go")) showRun();
    render();
  }
  function react(x: SamarkandHappened): void {
    if (x.type === "lift" || x.type === "put" || x.type === "exchange") host.sound("line");
    else if (x.type === "feather") host.sound("feather");
    else if (x.type === "talk") host.sound("call");
    else if (x.type === "line") host.sound("line");
  }

  /** Shows the last run exactly as the page does: one sentence for each card that worked, then how it ended. */
  function showRun(): void {
    const last = state.paper.last;
    if (!last) return;
    ran.replaceChildren();
    shown = 0;
    showing = true;
    const step = () => {
      if (stopped) return;
      if (shown < last.moved.length) {
        const m = last.moved[shown]!;
        ran.append(h("p", { textContent: t(`pp_did_${tail(m.part)}` as Key) }));
        shown++;
        host.sound("line");
        run?.scene()?.stepShown(m.place);
        render();
        timer = window.setTimeout(step, host.reducedMotion() ? 0 : 750);
        return;
      }
      showing = false;
      ran.append(h("p", { class: last.end === "done" ? "met" : "stopped" }, h("strong", { textContent: last.end === "done" ? t("pp_end_done") : t("pp_end_idle", { n: num(last.at + 1) }) })));
      // How much a failed run explains depends on the way of playing, exactly as on the page: Story says what the
      // place needs, Explorer what reached it, Challenge nothing more than where it stopped.
      if (last.end !== "done") {
        if (state.paper.style === "story") ran.append(h("p", { textContent: t("pp_needs", { what: t(`pp_kind_${tail(last.carrying)}` as Key) }) }));
        else if (state.paper.style === "explorer") ran.append(h("p", { textContent: t("pp_reached", { what: t(`pp_kind_${tail(last.carrying)}` as Key) }) }));
      }
      if (state.paper.done) end_();
      render();
    };
    step();
  }

  function end_(): void {
    host.sound("restored");
    state = afterRun(state);
    run?.scene()?.made();
    host.finish(samarkandGoals(state));
    showPanel();
    // Hudhud's last line is shown first, so that the live region's last word is that the door is open.
    render();
    live.textContent = `${t("pp_who_hudhud")}: ${t("jn_door_lit")}`;
    host.sound("call");
  }
  /** The goals and the museum's note beside the stage, not over it: the bird stays free to walk to the lit door. */
  function showPanel(): void {
    const g = samarkandGoals(state);
    const slack = PAPER_SLACK[state.paper.style];
    const goal = (mark: string, name: Key, how: string, met: boolean) => h("li", {}, h("span", { class: "mark", textContent: mark }), h("span", {}, h("strong", { textContent: t(name) }), h("br", {}), h("span", { class: "small", textContent: how })), h("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    const names: Key[] = ["pp_rec_paper", "pp_rec_place"];
    doorPanel.replaceChildren(
      h("h2", { id: "smr-panel-title", textContent: t("jn_panel_title"), tabIndex: -1 }),
      h("p", { class: "door-line" }, h("strong", { textContent: `${t("pp_who_hudhud")}: ` }), t("jn_door_lit")),
      h("p", { class: "row" }, h("button", { type: "button", class: "door-go", textContent: t("jn_go_door"), onclick: () => host.through() }), h("button", { type: "button", textContent: t("play_again"), onclick: () => again() }), h("button", { type: "button", textContent: t("btn_atlas"), onclick: () => host.leave() })),
      h("h3", { textContent: t("results_title") }),
      h("p", { textContent: t("pp_moves", { n: num(g.turns) }) }),
      h(
        "ul",
        { class: "goals" },
        goal("✦", "goal_curiosity", t("pp_goal_curiosity_how"), g.curiosity),
        goal("⚙", "goal_ingenuity", slack === null ? t("pp_goal_ingenuity_story") : t("pp_goal_ingenuity_how", { n: num(g.par + slack) }), g.ingenuity),
        goal("♥", "goal_kindness", t("pp_goal_kindness_how"), g.kindness),
        goal("❧", "goal_feather", t("pp_goal_feather_how"), g.feather),
      ),
      h(
        "div",
        { class: "note" },
        h("h3", { textContent: t("note_title") }),
        h("p", { textContent: t("pp_note_1") }),
        h("p", { textContent: t("pp_note_2") }),
        h("p", { textContent: t("pp_note_3") }),
        h("p", { class: "room-note", textContent: t("smr_note_room") }),
        h("p", { class: "pending", textContent: t("pp_review") }),
        ...PAPER_RECORDS.map((id, i) => h("p", {}, h("a", { href: `${host.museum}/${host.lang}/${id}/`, textContent: t("note_link", { name: t(names[i]!) }) }))),
      ),
    );
    doorPanel.hidden = false;
  }
  function again(): void {
    window.clearTimeout(timer);
    showing = false;
    shown = 0;
    // The same way of playing as the workshop was opened with: its places and its list of things are that row's.
    state = newSamarkandRoom(state.paper.style);
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
    const line = lineOf(SMR_SCRIPTS, talk);
    const id = `${talk.script}/${talk.node}/${talk.line}`;
    const text = t(line.key as Key);
    const choices = choicesOf(SMR_SCRIPTS, talk, new Set<string>(state.paper.flags));
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
    const who = t(`pp_who_${line.who === "keeper" ? "hudhud" : line.who}` as Key);
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
    const face = portraits[line.who as SmrSpeaker];
    talkBox.replaceChildren(face ? h("img", { src: face, alt: "", width: 120, height: 120 }) : h("span", {}), body);
    if (fresh) (choices.length ? (talkBox.querySelector(".choices button") as HTMLElement | null) : next)?.focus({ preventScroll: true });
  }

  /** Flies the bird to a thing and touches it; with no picture there is no bird to fly there, and the list touches the thing itself. */
  function go(id: string): void {
    const scene = run?.scene();
    if (scene) scene.goTo(id);
    else command({ type: "touch", id });
  }
  /** What a thing's button says: where it goes and, for the bell, the page's own words for what it does. */
  function label(k: SmrThing): string {
    if (k.kind === "bell") return t("smr_use_btn", { thing: nameOf(k), move: t("pp_go") });
    return t("alt_touch", { thing: nameOf(k) });
  }

  function render(): void {
    renderTalk();
    const s = state.paper;
    const done = s.done && !showing;
    const counts = t("pp_moves", { n: num(s.moves) });
    objective.replaceChildren(t(done ? "smr_objective_door" : "smr_objective"), h("small", { textContent: counts }));
    pad.hidden = state.talk !== null;
    stageWrap.classList.toggle("talking", state.talk !== null);
    if (state.talk) prompt.hidden = true;
    const liftText = state.lifted !== null ? t("smr_lifted", { card: cardName(s.puzzle.places[state.lifted] ?? null) }) : t("smr_lifted_none");
    if (lifted.textContent !== liftText) lifted.textContent = liftText;
    movesLine.textContent = counts;
    // The places of the bench in order: a button for each, which flies the bird there and touches the card.
    const active = document.activeElement as HTMLElement | null;
    const was = active !== null && (placeBox.contains(active) || thingList.contains(active)) ? active.dataset.thing : undefined;
    placeBox.replaceChildren(
      h(
        "ol",
        { class: "sheet-row" },
        ...things
          .filter((k) => k.kind === "place")
          .map((k) => {
            const b = h("button", { type: "button", textContent: label(k), disabled: done || frozen(), onclick: () => go(k.id) });
            b.dataset.thing = k.id;
            b.setAttribute("aria-pressed", String(state.lifted === k.place));
            return h("li", {}, b);
          }),
      ),
    );
    // Once the sheet is made, the list holds one thing: the door.
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
    view,
    command,
    press,
    busy: () => showing,
    running: () => run,
    door: () => {
      const w = run?.scene()?.where() ?? null;
      return { lit: view().done, where: { ...SMR_DOOR }, bird: w ? { x: w.x, y: w.y } : null };
    },
    redraw,
    stop: () => {
      stopped = true;
      window.clearTimeout(timer);
      window.clearInterval(typing);
      document.removeEventListener("visibilitychange", onHidden);
      run?.stop();
      run = null;
    },
  };
}
