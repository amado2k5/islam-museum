// Al-Tusi's observatory: the two circles played in a room, by flying to the levers and the crank on the model's stand
// and touching them (asked for by the founder, 27 November 2026). The picture is a canvas on the room engine
// (scenes/tusi.ts); everything a player reads or presses is ordinary page: the words of a talk, the objective, the touch
// prompt, and under the stage a list that says the whole room in words and lets it be played without the picture (every
// thing a button, each lever with what it is set to, the crank, and the last path traced).
//
// The rules are the two circles' (sim/couple.ts) through the room's (sim/tusiroom.ts). A turning is shown as on the
// page (ui/couple.ts): the small circle goes round for as long, the path grows, it can be skipped, and with movement kept
// still (the game's setting, the system's or `motion=reduced`, one answer for every quest) the finished path is drawn
// at once. What a turning says afterwards depends on the way of playing exactly as on the page. The note that states the
// model (ts_note_2) is shown only once the line is found, in the panel, as on the page.
import { COUPLE_RECORDS } from "../content/couple";
import { TSR_DOOR, TSR_SCRIPTS, TSR_THINGS, type TsrSpeaker } from "../content/tusi-room";
import type { Cue } from "../audio/cues";
import { startRoom, type Running, type StartOptions } from "../game/boot";
import type { Intent } from "../sim/move";
import { choicesOf, lineOf } from "../narrative/dialogue";
import type { Keeper, Quality } from "../save/save";
import { COUPLE_SLACK, SIZES, type CoupleField, type CoupleStyle, type Shape } from "../sim/couple";
import { TURNING_MS, afterTurn, applyTusiRoom, hasLever, keptAfter, newTusiRoom, tusiGoals, valueNow, type TusiCommand, type TusiHappened, type TusiState } from "../sim/tusiroom";
import { TusiScene, type TusiSceneHost, type TusiView } from "../scenes/tusi";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;
export interface TusiHost {
  t(key: Key, vars?: Record<string, string | number>): string;
  num(n: number): string;
  lang: string;
  museum: string;
  /** The subject's name, for the heading. */
  title: string;
  style(): CoupleStyle;
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
  resume?: TusiState | null;
  keepPlace(snap: unknown | null): void;
}
export interface TusiRoom {
  node: HTMLElement;
  state(): TusiState;
  view(): TusiView;
  command(c: TusiCommand): void;
  /** Ends the turning being shown at once, as the page's "Skip the turning" does. */
  skipTurning(): void;
  /** A key or a controller's press: touch, go on in a talk, move among its choices. */
  press(p: "touch" | "pause" | "next" | "back" | "up" | "down"): void;
  busy(): boolean;
  running(): Running<TusiScene> | null;
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

export function tusiRoom(host: TusiHost): TusiRoom {
  const { t, num } = host;
  let state: TusiState = host.resume ?? newTusiRoom(host.style());
  let turning = false; // a turning is being shown
  let began = 0;
  let timer = 0;
  let portraits: Record<string, string> = {};
  let run: Running<TusiScene> | null = null;
  let stopped = false;

  /** The words for a measured shape, as on the page. */
  const shapeKey = (s: Shape): Key => (s.kind === "line" ? "ts_shape_line" : s.kind === "circle" ? "ts_shape_circle" : s.kind === "oval" ? "ts_shape_oval" : s.crossings === 0 ? "ts_shape_cusp" : s.lobes === 1 ? "ts_shape_loop" : "ts_shape_loops");
  const shapeName = (s: Shape) => t(shapeKey(s), { n: num(s.lobes) });
  /** The words for what a choice is set to: the page's own labels of its radio buttons. */
  const sizeKey = (r: number): Key => (["ts_size_third", "ts_size_half", "ts_size_twothirds"] as const)[SIZES.findIndex((x) => x === r)]!;
  const settingName = (field: CoupleField): string => {
    const v = valueNow(state.couple, field);
    if (field === "dir") return t(v === 1 ? "ts_dir_same" : "ts_dir_other");
    if (field === "speed") return t(`ts_speed_${v}` as Key);
    return t(sizeKey(v));
  };
  const leverName = (field: CoupleField) => t(`tsr_thing_lever_${field}` as Key);

  const view = (): TusiView => ({ state, turning, progress: turning ? Math.min(1, (performance.now() - began) / TURNING_MS) : 1, done: state.couple.done && !turning });
  const frozen = () => stopped || state.talk !== null || turning || host.blocked();

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
  stage.setAttribute("aria-label", t("tsr_canvas_label"));
  const talkBox = h("div", { class: "talk", hidden: true });
  talkBox.setAttribute("role", "group");
  const stageWrap = h("div", { class: "stage-wrap" }, objective, stage, talkBox);
  const doorPanel = h("section", { class: "door-panel", hidden: true });
  doorPanel.setAttribute("aria-labelledby", "tsr-panel-title");
  const live = h("div", { class: "visually-hidden", role: "status" });
  live.setAttribute("aria-live", "polite");

  const lastLine = h("p", { class: "carrying" });
  const countLine = h("p", { class: "small" });
  const thingList = h("ul", {});
  const ran = h("div", { class: "ran" });
  ran.setAttribute("aria-live", "polite");
  const words = h("section", { class: "room-words" }, h("h2", { textContent: t("alt_title") }), lastLine, countLine, thingList, ran);
  const note = h(
    "section",
    {},
    h("h2", { textContent: t("note_title") }),
    h("p", { textContent: t("tsr_note_room") }),
    h("p", { class: "small", textContent: t("art_note") }),
    h("h2", { textContent: t("controls_title") }),
    // The keys only: the workshop's line about touch speaks of tapping a mirror, which this room has not.
    h("p", { class: "small", textContent: t("controls_keys") }),
  );
  const node = h("div", { class: "room" }, heading, stageWrap, doorPanel, h("div", { class: "words" }, words, note), live);

  // ---------------------------------------------------------------------------------------- the picture
  const sceneHost: TusiSceneHost = {
    intent: () => host.intent(),
    frozen,
    touch: (id) => command({ type: "touch", id }),
    near: (id) => {
      const thing = TSR_THINGS.find((k) => k.id === id);
      prompt.hidden = (!thing && id !== "door") || state.talk !== null;
      if (id === "door") prompt.textContent = t("jn_go_door");
      else if (thing) prompt.textContent = t("touch_prompt", { thing: t(thing.name as Key) });
    },
    through: () => host.through(),
    sound: (c) => host.sound(c),
    speaking: () => (state.talk ? { who: lineOf(TSR_SCRIPTS, state.talk).who, mood: lineOf(TSR_SCRIPTS, state.talk).mood } : null),
    look: () => ({ quality: host.quality(), reducedMotion: host.reducedMotion(), style: state.couple.style, keeper: host.keeper() }),
    portraits: (urls) => ((portraits = urls), renderTalk()),
    view,
  };
  const opts: StartOptions = { perf: host.perf, onLost: () => host.toast(t("context_lost")), onRestored: () => redraw() };
  function begin(): void {
    try {
      run = startRoom(canvasBox, sceneHost, host.quality(), opts, "tusi", TusiScene);
    } catch {
      run = null;
      host.toast(t("error_webgl"));
      // Without a picture the two circles are played on their own page, as they were before the room.
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
  function command(c: TusiCommand): void {
    if (stopped || turning) return;
    const r = applyTusiRoom(state, c);
    state = r.state;
    for (const x of r.happened) react(x);
    run?.scene()?.happened(r.happened);
    // The place is kept by the page quest's own rule (sim/tusiroom.ts keptAfter): one place serves the page and the room.
    const kept = keptAfter(state, r.commands);
    if (kept !== undefined) host.keepPlace(kept);
    if (r.commands.some((k) => k.type === "turn")) showTurning();
    render();
  }
  function react(x: TusiHappened): void {
    if (x.type === "lever") {
      host.sound("part");
      // The lever says its new setting in words, where the turnings' words are, and to a screen reader.
      const said = t("tsr_lever_moved", { lever: leverName(x.field), setting: settingName(x.field) });
      ran.replaceChildren(h("p", { textContent: said }));
    } else if (x.type === "turn") host.sound("line");
    else if (x.type === "feather") host.sound("feather");
    else if (x.type === "talk") host.sound("call");
    else if (x.type === "line") host.sound("line");
  }

  /** Shows the turning: the small circle goes round while the path grows, as on the page; at once when movement is kept still. */
  function showTurning(): void {
    if (!state.couple.last) return;
    if (host.reducedMotion()) return finishTurning();
    turning = true;
    began = performance.now();
    ran.replaceChildren(h("p", { textContent: t("ts_turning") }));
    window.clearTimeout(timer);
    timer = window.setTimeout(() => finishTurning(), TURNING_MS);
  }
  /** The turning is over (it ran to its end, or was skipped): the path is whole and what it was is said. */
  function finishTurning(): void {
    if (stopped) return;
    window.clearTimeout(timer);
    turning = false;
    tell();
    if (state.couple.done) end_();
    render();
  }
  /** The words for the last turning, by the way of playing, exactly as on the page. */
  function tell(): void {
    const last = state.couple.last;
    if (!last) return;
    if (state.couple.done) {
      ran.replaceChildren(h("p", { class: "met", textContent: t("ts_traced_line") }), h("p", {}, h("strong", { textContent: t("ts_end_done") })));
      return;
    }
    const traced = h("p", { class: "stopped", textContent: t("ts_traced", { shape: shapeName(last.shape) }) });
    // Story names the shape and says which way to try; Explorer names the shape; Challenge says only that it is not a line.
    if (state.couple.style === "story") ran.replaceChildren(traced, h("p", { class: "stopped", textContent: t("ts_miss_story") }));
    else if (state.couple.style === "explorer") ran.replaceChildren(traced);
    else ran.replaceChildren(h("p", { class: "stopped", textContent: t("ts_miss_challenge") }));
  }

  function end_(): void {
    host.sound("restored");
    state = afterTurn(state);
    host.finish(tusiGoals(state));
    showPanel();
    live.textContent = `${t("ts_who_hudhud")}: ${t("jn_door_lit")}`;
    host.sound("call");
  }
  /** The goals and the museum's note beside the stage, not over it: the bird stays free to walk to the lit door. Only
   * here, once the line is found, is the note that states the model shown (ts_note_2), as on the page. */
  function showPanel(): void {
    const g = tusiGoals(state);
    const slack = COUPLE_SLACK[state.couple.style];
    const goal = (mark: string, name: Key, how: string, met: boolean) => h("li", {}, h("span", { class: "mark", textContent: mark }), h("span", {}, h("strong", { textContent: t(name) }), h("br", {}), h("span", { class: "small", textContent: how })), h("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    const names: Key[] = ["ts_rec_person", "ts_rec_obs"];
    doorPanel.replaceChildren(
      h("h2", { id: "tsr-panel-title", textContent: t("jn_panel_title"), tabIndex: -1 }),
      h("p", { class: "door-line" }, h("strong", { textContent: `${t("ts_who_hudhud")}: ` }), t("jn_door_lit")),
      h("p", { class: "row" }, h("button", { type: "button", class: "door-go", textContent: t("jn_go_door"), onclick: () => host.through() }), h("button", { type: "button", textContent: t("play_again"), onclick: () => again() }), h("button", { type: "button", textContent: t("btn_atlas"), onclick: () => host.leave() })),
      h("h3", { textContent: t("results_title") }),
      h("p", { textContent: t("ts_turns", { n: num(g.turns) }) }),
      h(
        "ul",
        { class: "goals" },
        goal("✦", "goal_curiosity", t("ts_goal_curiosity_how"), g.curiosity),
        goal("⚙", "goal_ingenuity", slack === null ? t("ts_goal_ingenuity_story") : t("ts_goal_ingenuity_how", { n: num(slack) }), g.ingenuity),
        goal("♥", "goal_kindness", t("ts_goal_kindness_how"), g.kindness),
        goal("❧", "goal_feather", t("ts_goal_feather_how"), g.feather),
      ),
      h(
        "div",
        { class: "note" },
        h("h3", { textContent: t("note_title") }),
        h("p", { textContent: t("ts_note_1") }),
        h("p", { textContent: t("ts_note_2") }),
        h("p", { textContent: t("ts_note_3") }),
        h("p", { textContent: t("ts_note_4") }),
        h("p", { class: "room-note", textContent: t("tsr_note_room") }),
        h("p", { class: "pending", textContent: t("ts_review") }),
        ...COUPLE_RECORDS.map((id, i) => h("p", {}, h("a", { href: `${host.museum}/${host.lang}/${id}/`, textContent: t("note_link", { name: t(names[i]!) }) }))),
      ),
    );
    doorPanel.hidden = false;
  }
  function again(): void {
    window.clearTimeout(timer);
    turning = false;
    state = newTusiRoom(host.style());
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
    const line = lineOf(TSR_SCRIPTS, talk);
    const id = `${talk.script}/${talk.node}/${talk.line}`;
    const text = t(line.key as Key);
    const choices = choicesOf(TSR_SCRIPTS, talk, new Set<string>(state.couple.flags));
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
    const who = t(`ts_who_${line.who === "keeper" ? "hudhud" : line.who}` as Key);
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
    const face = portraits[line.who as TsrSpeaker];
    talkBox.replaceChildren(face ? h("img", { src: face, alt: "", width: 120, height: 120 }) : h("span", {}), body);
    if (fresh) (choices.length ? (talkBox.querySelector(".choices button") as HTMLElement | null) : next)?.focus({ preventScroll: true });
  }

  /** What a thing's button says: what it is and, for a lever, what it is set to; touching it does the rest. */
  function label(id: string): string {
    const thing = TSR_THINGS.find((k) => k.id === id)!;
    if (thing.kind === "lever") return t("tsr_lever_btn", { lever: leverName(thing.field!), setting: settingName(thing.field!) });
    if (thing.kind === "crank") return t("tsr_crank_btn");
    return t("alt_touch", { thing: t(thing.name as Key) });
  }

  function render(): void {
    renderTalk();
    const c = state.couple;
    const done = c.done && !turning;
    const counts = `${t("ts_turns", { n: num(c.turned) })} · ${t("ts_misses", { n: num(c.misses) })}`;
    objective.replaceChildren(t(done ? "tsr_objective_door" : "tsr_objective"), h("small", { textContent: counts }));
    pad.hidden = state.talk !== null;
    stageWrap.classList.toggle("talking", state.talk !== null);
    if (state.talk) prompt.hidden = true;
    // The last path traced, by its shape, as the page's picture describes it; none once a lever has moved.
    lastLine.textContent = c.last ? t("tsr_last", { shape: shapeName(c.last.shape) }) : t("tsr_last_none");
    countLine.textContent = counts;
    // Once the line is found, the list holds one thing: the door. While a turning is shown, the page's skip button.
    if (done) thingList.replaceChildren(h("li", {}, h("button", { type: "button", textContent: t("jn_go_door"), onclick: () => host.through() })));
    else
      thingList.replaceChildren(
        ...TSR_THINGS.filter((k) => k.kind !== "lever" || hasLever(c.offer, k.field!)).map((k) => {
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
        ...(turning ? [h("li", {}, h("button", { type: "button", class: "skip-turning", textContent: t("ts_skip"), onclick: () => finishTurning() }))] : []),
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
    skipTurning: () => (turning ? finishTurning() : undefined),
    press,
    busy: () => turning,
    running: () => run,
    door: () => {
      const w = run?.scene()?.where() ?? null;
      return { lit: view().done, where: { ...TSR_DOOR }, bird: w ? { x: w.x, y: w.y } : null };
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
