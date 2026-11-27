// Al-Jazari's workshop: the elephant clock played in a room, by flying to the parts and touching them (asked for by
// the founder, 27 November 2026). The picture is a canvas on the room engine (scenes/jazari.ts); everything a player
// reads or presses is ordinary page: the words of a talk, the objective, the touch prompt, and under the stage a list
// that says the whole room in words and lets it be played without the picture (every thing a button, the clock's
// five places with what stands in each, the spare parts, what Hudhud carries, and the run's sentences).
//
// The rules are the clock quest's (sim/clock.ts) through the room's (sim/jazariroom.ts); a run is shown a place at a
// time as on the clock's page (ui/clock.ts), at once when movement is kept still.
import { CLOCK_RECORDS, CLOCK_SLACK } from "../content/clock";
import { JR_DOOR, JR_SCRIPTS, JR_THINGS, type JrSpeaker } from "../content/jazari-room";
import type { Cue } from "../audio/cues";
import { startRoom, type Running, type StartOptions } from "../game/boot";
import type { Intent } from "../sim/move";
import { choicesOf, lineOf } from "../narrative/dialogue";
import type { Keeper, Quality } from "../save/save";
import { spare } from "../sim/chain";
import type { ClockStyle } from "../sim/clock";
import { afterRun, applyRoom, newRoom, roomGoals, snapshotRoom, worthKeeping, type RoomCommand, type RoomHappened, type RoomState } from "../sim/jazariroom";
import { JazariScene, type JazariSceneHost, type JazariView } from "../scenes/jazari";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;
export interface JazariHost {
  t(key: Key, vars?: Record<string, string | number>): string;
  num(n: number): string;
  lang: string;
  museum: string;
  /** The subject's name, for the heading. */
  title: string;
  style(): ClockStyle;
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
  resume?: RoomState | null;
  keepPlace(snap: unknown | null): void;
}
export interface JazariRoom {
  node: HTMLElement;
  state(): RoomState;
  view(): JazariView;
  command(c: RoomCommand): void;
  /** A key or a controller's press: touch, go on in a talk, move among its choices. */
  press(p: "touch" | "pause" | "next" | "back" | "up" | "down"): void;
  busy(): boolean;
  running(): Running<JazariScene> | null;
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

export function jazariRoom(host: JazariHost): JazariRoom {
  const { t, num } = host;
  const rtl = host.lang === "ar" || host.lang === "ur";
  let state: RoomState = host.resume ?? newRoom(host.style());
  let shown = state.clock.last ? state.clock.last.moved.length : 0; // places of the last run shown so far
  let showing = false; // a run is being shown
  let timer = 0;
  let portraits: Record<string, string> = {};
  let run: Running<JazariScene> | null = null;
  let stopped = false;

  const part = (id: string | null) => (id ? t(`ck_part_${id}` as Key) : t("ck_empty"));
  const list = (ids: string[]) => ids.map(part).join(rtl ? "، " : ", ");
  const view = (): JazariView => {
    const last = state.clock.last;
    return { state, lit: last ? Math.min(shown, last.moved.length) : 0, stopped: last && last.end !== "done" && !showing ? last.at : null, running: showing, done: state.clock.done && !showing };
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
  stage.setAttribute("aria-label", t("jr_canvas_label"));
  const talkBox = h("div", { class: "talk", hidden: true });
  talkBox.setAttribute("role", "group");
  const stageWrap = h("div", { class: "stage-wrap" }, objective, stage, talkBox);
  const doorPanel = h("section", { class: "door-panel", hidden: true });
  doorPanel.setAttribute("aria-labelledby", "jr-panel-title");
  const live = h("div", { class: "visually-hidden", role: "status" });
  live.setAttribute("aria-live", "polite");

  const carryLine = h("p", { class: "carrying" });
  const spareLine = h("p", { class: "small" });
  const movesLine = h("p", { class: "small" });
  const thingList = h("ul", {});
  const ran = h("div", { class: "ran" });
  ran.setAttribute("aria-live", "polite");
  const words = h("section", { class: "room-words" }, h("h2", { textContent: t("alt_title") }), carryLine, movesLine, spareLine, thingList, ran);
  const note = h(
    "section",
    {},
    h("h2", { textContent: t("note_title") }),
    h("p", { textContent: t("jr_note_room") }),
    h("p", { class: "small", textContent: t("art_note") }),
    h("h2", { textContent: t("controls_title") }),
    h("p", { class: "small", textContent: t("controls_keys") }),
    h("p", { class: "small", textContent: t("controls_touch") }),
  );
  const node = h("div", { class: "room" }, heading, stageWrap, doorPanel, h("div", { class: "words" }, words, note), live);

  // ---------------------------------------------------------------------------------------- the picture
  const sceneHost: JazariSceneHost = {
    intent: () => host.intent(),
    frozen,
    touch: (id) => command({ type: "touch", id }),
    near: (id) => {
      const thing = JR_THINGS.find((k) => k.id === id);
      prompt.hidden = (!thing && id !== "door") || state.talk !== null;
      if (id === "door") prompt.textContent = t("jn_go_door");
      else if (thing) prompt.textContent = t("touch_prompt", { thing: t(thing.name as Key) });
    },
    through: () => host.through(),
    sound: (c) => host.sound(c),
    speaking: () => (state.talk ? { who: lineOf(JR_SCRIPTS, state.talk).who, mood: lineOf(JR_SCRIPTS, state.talk).mood } : null),
    look: () => ({ quality: host.quality(), reducedMotion: host.reducedMotion(), style: state.clock.style, keeper: host.keeper() }),
    portraits: (urls) => ((portraits = urls), renderTalk()),
    view,
  };
  const opts: StartOptions = { perf: host.perf, onLost: () => host.toast(t("context_lost")), onRestored: () => redraw() };
  function begin(): void {
    try {
      run = startRoom(canvasBox, sceneHost, host.quality(), opts, "jazari", JazariScene);
    } catch {
      run = null;
      host.toast(t("error_webgl"));
      // Without a picture the clock is played on its own page, as it was before the room.
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
  function command(c: RoomCommand): void {
    if (stopped || showing) return;
    const before = state;
    const r = applyRoom(state, c);
    state = r.state;
    for (const x of r.happened) react(x);
    run?.scene()?.happened(r.happened);
    if (r.commands.some((k) => k.type === "put")) {
      ran.replaceChildren();
      shown = 0;
    }
    // The place is kept after every step that changed it (a run is not kept: it changes nothing that is saved).
    if (state !== before && !r.commands.some((k) => k.type === "go")) host.keepPlace(worthKeeping(state) ? snapshotRoom(state) : null);
    if (r.commands.some((k) => k.type === "go")) showRun();
    render();
  }
  function react(x: RoomHappened): void {
    if (x.type === "pick" || x.type === "drop" || x.type === "put") host.sound("part");
    else if (x.type === "feather") host.sound("feather");
    else if (x.type === "talk") host.sound("call");
    else if (x.type === "line") host.sound("line");
  }

  /** Shows the last run: one sentence for each part that moved, the place lit on the picture, then how it ended. */
  function showRun(): void {
    const last = state.clock.last;
    if (!last) return;
    ran.replaceChildren();
    shown = 0;
    showing = true;
    const step = () => {
      if (stopped) return;
      if (shown < last.moved.length) {
        const m = last.moved[shown]!;
        ran.append(h("p", { textContent: t(`ck_did_${m.part}` as Key) }));
        shown++;
        host.sound(m.part === "vessel" ? "gong" : "line");
        run?.scene()?.stepShown(m.place);
        render();
        timer = window.setTimeout(step, host.reducedMotion() ? 0 : 750);
        return;
      }
      showing = false;
      const n = num(last.at + 1);
      const end: Key = last.end === "done" ? "ck_end_done" : last.end === "empty" ? "ck_end_empty" : last.end === "idle" ? "ck_end_idle" : "ck_end_wrong";
      ran.append(h("p", { class: last.end === "done" ? "met" : "stopped" }, h("strong", { textContent: t(end, { n }) })));
      // How much a failed run explains depends on the way of playing, exactly as on the clock's page.
      if (last.end === "empty" || last.end === "idle") {
        const what = t(`ck_kind_${last.carrying}` as Key);
        if (state.clock.style === "story") ran.append(h("p", { textContent: t("ck_needs", { what }) }));
        else if (state.clock.style === "explorer") ran.append(h("p", { textContent: t("ck_reached", { what }) }));
      }
      if (state.clock.done) end_();
      render();
    };
    step();
  }

  function end_(): void {
    host.sound("restored");
    state = afterRun(state);
    const g = roomGoals(state);
    host.finish(g);
    showPanel();
    live.textContent = `${t("ck_who_hudhud")}: ${t("jn_door_lit")}`;
    host.sound("call");
  }
  /** The goals and the museum's note beside the stage, not over it: the bird stays free to walk to the lit door. */
  function showPanel(): void {
    const g = roomGoals(state);
    const slack = CLOCK_SLACK[state.clock.style];
    const goal = (mark: string, name: Key, how: string, met: boolean) => h("li", {}, h("span", { class: "mark", textContent: mark }), h("span", {}, h("strong", { textContent: t(name) }), h("br", {}), h("span", { class: "small", textContent: how })), h("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    const names: Key[] = ["ck_rec_person", "ck_rec_clock"];
    doorPanel.replaceChildren(
      h("h2", { id: "jr-panel-title", textContent: t("jn_panel_title"), tabIndex: -1 }),
      h("p", { class: "door-line" }, h("strong", { textContent: `${t("ck_who_hudhud")}: ` }), t("jn_door_lit")),
      h("p", { class: "row" }, h("button", { type: "button", class: "door-go", textContent: t("jn_go_door"), onclick: () => host.through() }), h("button", { type: "button", textContent: t("play_again"), onclick: () => again() }), h("button", { type: "button", textContent: t("btn_atlas"), onclick: () => host.leave() })),
      h("h3", { textContent: t("results_title") }),
      h("p", { textContent: t("ck_moves", { n: num(g.turns) }) }),
      h(
        "ul",
        { class: "goals" },
        goal("✦", "goal_curiosity", t("ck_goal_curiosity_how"), g.curiosity),
        goal("⚙", "goal_ingenuity", slack === null ? t("ck_goal_ingenuity_story") : t("ck_goal_ingenuity_how", { n: num(g.par + slack) }), g.ingenuity),
        goal("♥", "goal_kindness", t("ck_goal_kindness_how"), g.kindness),
        goal("❧", "goal_feather", t("ck_goal_feather_how"), g.feather),
      ),
      h(
        "div",
        { class: "note" },
        h("h3", { textContent: t("note_title") }),
        h("p", { textContent: t("ck_note_1") }),
        h("p", { textContent: t("ck_note_2") }),
        h("p", { textContent: t("ck_note_3") }),
        h("p", { textContent: t("ck_note_4") }),
        h("p", { class: "room-note", textContent: t("jr_note_room") }),
        h("p", { class: "pending", textContent: t("ck_review") }),
        ...CLOCK_RECORDS.map((id, i) => h("p", {}, h("a", { href: `${host.museum}/${host.lang}/${id}/`, textContent: t("note_link", { name: t(names[i]!) }) }))),
      ),
    );
    doorPanel.hidden = false;
  }
  function again(): void {
    window.clearTimeout(timer);
    showing = false;
    shown = 0;
    state = newRoom(host.style());
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
    const line = lineOf(JR_SCRIPTS, talk);
    const id = `${talk.script}/${talk.node}/${talk.line}`;
    const text = t(line.key as Key);
    const choices = choicesOf(JR_SCRIPTS, talk, new Set<string>(state.clock.flags));
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
    const who = t(`ck_who_${line.who === "keeper" ? "hudhud" : line.who}` as Key);
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
    const face = portraits[line.who as JrSpeaker];
    talkBox.replaceChildren(face ? h("img", { src: face, alt: "", width: 120, height: 120 }) : h("span", {}), body);
    if (fresh) (choices.length ? (talkBox.querySelector(".choices button") as HTMLElement | null) : next)?.focus({ preventScroll: true });
  }

  /** What a thing's button says: what it is, what stands there, and what touching it will do. */
  function label(id: string): string {
    const thing = JR_THINGS.find((k) => k.id === id)!;
    const p = state.clock.puzzle;
    const carried = state.carrying;
    if (thing.kind === "place") {
      const here = p.places[thing.index!] ?? null;
      const n = num(thing.index! + 1);
      if (!carried) return t("jr_place_take", { n, part: part(here) });
      if (carried === here) return t("jr_place_back", { n, part: part(here) });
      return t("jr_place_put", { n, part: part(here), carried: part(carried) });
    }
    if (thing.kind === "spare") {
      const id2 = spare(p)[thing.index!]?.id ?? null;
      return carried && carried === id2 ? t("jr_spare_back", { part: part(id2) }) : t("jr_spare_take", { part: part(id2) });
    }
    if (thing.kind === "lever") return t("jr_lever_go");
    return t("alt_touch", { thing: t(thing.name as Key) });
  }

  function render(): void {
    renderTalk();
    const p = state.clock.puzzle;
    const done = state.clock.done && !showing;
    objective.replaceChildren(t(done ? "jr_objective_door" : "jr_objective"), h("small", { textContent: t("ck_moves", { n: num(state.clock.moves) }) }), h("small", { textContent: state.carrying ? t("jr_carrying", { thing: part(state.carrying) }) : t("jr_carrying_none") }));
    pad.hidden = state.talk !== null;
    stageWrap.classList.toggle("talking", state.talk !== null);
    if (state.talk) prompt.hidden = true;
    carryLine.textContent = state.carrying ? t("jr_carrying", { thing: part(state.carrying) }) : t("jr_carrying_none");
    movesLine.textContent = t("ck_moves", { n: num(state.clock.moves) });
    const lying = spare(p).map((x) => x.id);
    spareLine.textContent = lying.length ? t("ck_spare", { list: list(lying) }) : t("ck_spare_none");
    // Once the clock works, the list holds one thing: the door.
    if (done) thingList.replaceChildren(h("li", {}, h("button", { type: "button", textContent: t("jn_go_door"), onclick: () => host.through() })));
    else
      thingList.replaceChildren(
        ...JR_THINGS.filter((k) => k.kind !== "spare" || spare(p)[k.index!] !== undefined).map((k) => {
          const b = h("button", {
            type: "button",
            textContent: label(k.id),
            disabled: frozen(),
            onclick: () => {
              // With no picture there is no bird to fly there: the list touches the thing itself.
              const scene = run?.scene();
              if (scene) scene.goTo(k.id);
              else command({ type: "touch", id: k.id });
            },
          });
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
    busy: () => showing,
    running: () => run,
    door: () => {
      const w = run?.scene()?.where() ?? null;
      return { lit: view().done, where: { ...JR_DOOR }, bird: w ? { x: w.x, y: w.y } : null };
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
