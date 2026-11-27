// Ibn Battuta's inn: the road threaded in a room, by flying to a bead on the great ring and touching it (asked for by the
// founder, 27 November 2026). The picture is a canvas on the room engine (scenes/battuta.ts); everything a player reads
// or presses is ordinary page: the words of a talk, the objective, the stage's sentence, the touch prompt, and under the
// stage a list that says the whole inn in words and lets it be played without the picture (how far the thread has come
// and the slips, the stage's sentence when it is showing, every bead in the ring's order with its name and whether it is
// on the thread, the scroll on the lectern, Ibn Battuta, the child and the saddlebag as buttons, and the page's own
// sentence for the last bead touched).
//
// The rules are the road's (sim/route.ts) through the inn's (sim/battutaroom.ts): a bead touched is the page's press on
// that bead, the scroll touched is the page's "Show the stage again", and every sentence is the page's for the way of
// playing. The ring is not a map, and the inn's note says so.
import { ROUTE_RECORDS } from "../content/route";
import { IBR_DOOR, IBR_SCRIPTS, ibrThings, type IbrSpeaker, type IbrThing } from "../content/battuta-room";
import type { Cue } from "../audio/cues";
import { startRoom, type Running, type StartOptions } from "../game/boot";
import type { Intent } from "../sim/move";
import { choicesOf, lineOf } from "../narrative/dialogue";
import type { Keeper, Quality } from "../save/save";
import { ROUTE_SLACK, nextStop, threaded, type RouteStyle } from "../sim/route";
import { afterDone, applyBattutaRoom, battutaGoals, keptAfter, newBattutaRoom, type BattutaCommand, type BattutaHappened, type BattutaState } from "../sim/battutaroom";
import { BattutaScene, type BattutaSceneHost } from "../scenes/battuta";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;
export interface BattutaHost {
  t(key: Key, vars?: Record<string, string | number>): string;
  num(n: number): string;
  lang: string;
  museum: string;
  /** The subject's name, for the heading. */
  title: string;
  style(): RouteStyle;
  quality(): Quality;
  keeper(): Keeper;
  reducedMotion(): boolean;
  /** Characters a second for a line of talk; 0 is all at once. */
  textSpeed(): number;
  perf: boolean;
  intent(): Intent;
  bindHold(button: HTMLElement, what: "left" | "right" | "jump"): void;
  /** A sheet (the settings) is open over the page: the inn waits. */
  blocked(): boolean;
  /** A sound, with its caption if it has one. */
  sound(c: Cue): void;
  toast(text: string): void;
  /** The quest is finished: its goals are written into the save. */
  finish(g: { turns: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean }): void;
  /** The bird went through the lit door. */
  through(): void;
  leave(): void;
  /** The inn could not be drawn (WebGL failed): play the scene on its page instead. */
  fallback(): void;
  resume?: BattutaState | null;
  keepPlace(snap: unknown | null): void;
}
export interface BattutaRoom {
  node: HTMLElement;
  state(): BattutaState;
  command(c: BattutaCommand): void;
  /** A key or a controller's press: touch, go on in a talk, move among its choices. */
  press(p: "touch" | "pause" | "next" | "back" | "up" | "down"): void;
  /** Always false: nothing here is shown step by step. */
  busy(): boolean;
  /** What the page says about the stage's sentence now: the sentence itself, or that it is hidden. */
  sentence(): string;
  /** What the page says about the last bead touched. */
  status(): string;
  running(): Running<BattutaScene> | null;
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

/** A stop's id as the tail of a string key: `north-africa` is `north_africa` (as content/route.ts has it). */
const tail = (id: string): string => id.replace(/-/g, "_");
const STAGES = { story: "ib_stage_story", explorer: "ib_stage_explorer", challenge: "ib_stage_challenge" } as const;

export function battutaRoom(host: BattutaHost): BattutaRoom {
  const { t, num } = host;
  const rtl = host.lang === "ar" || host.lang === "ur";
  let state: BattutaState = host.resume ?? newBattutaRoom(host.style());
  const things = ibrThings(state.route.style, rtl);
  let portraits: Record<string, string> = {};
  let run: Running<BattutaScene> | null = null;
  let stopped = false;
  let finished = state.route.done;

  const stopName = (id: string) => t(`ib_stop_${tail(id)}` as Key);
  /** What a thing is called: a bead by its number, its stop and whether it is on the thread, in the page's own words. */
  const nameOf = (k: IbrThing): string => {
    if (k.kind !== "bead") return t(k.name as Key);
    const on = threaded(state.route).includes(k.stop!);
    return t(on ? "ib_bead_on" : "ib_bead", { n: num(k.index! + 1), name: stopName(k.stop!) });
  };
  const frozen = () => stopped || state.talk !== null || host.blocked();
  const sentenceText = (): string => (state.route.showing ? `${t("ib_who_narrator")}: ${t(STAGES[state.route.style])}` : t("ib_stage_hidden"));
  const progressText = (): string => `${t("ib_threaded", { n: num(state.route.at), total: num(state.route.stage.road.length) })} · ${t("ib_slips", { n: num(state.route.slips) })}`;

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
  stage.setAttribute("aria-label", t("ibr_canvas_label"));
  const talkBox = h("div", { class: "talk", hidden: true });
  talkBox.setAttribute("role", "group");
  const stageWrap = h("div", { class: "stage-wrap" }, objective, stage, talkBox);
  const doorPanel = h("section", { class: "door-panel", hidden: true });
  doorPanel.setAttribute("aria-labelledby", "ibr-panel-title");
  const live = h("div", { class: "visually-hidden", role: "status" });
  live.setAttribute("aria-live", "polite");

  // The inn in words: how far the thread has come and the slips, the stage's sentence, every bead, the other things, the last bead touched.
  const counts = h("p", { class: "carrying" });
  const stageBox = h("div", { class: "stage-text" });
  stageBox.setAttribute("aria-live", "polite");
  const beadsBox = h("div", { class: "sheet-rows" });
  beadsBox.setAttribute("role", "group");
  beadsBox.setAttribute("aria-label", t("ibr_beads_group"));
  const thingList = h("ul", {});
  const ran = h("div", { class: "ran" });
  ran.setAttribute("aria-live", "polite");
  const words = h("section", { class: "room-words" }, h("h2", { textContent: t("alt_title") }), counts, stageBox, beadsBox, thingList, ran);
  const note = h(
    "section",
    {},
    h("h2", { textContent: t("note_title") }),
    h("p", { textContent: t("ibr_note_room") }),
    h("p", { class: "small", textContent: t("art_note") }),
    h("h2", { textContent: t("controls_title") }),
    // The keys only: the workshop's line about touch speaks of tapping a mirror, which the inn has not.
    h("p", { class: "small", textContent: t("controls_keys") }),
  );
  const node = h("div", { class: "room" }, heading, stageWrap, doorPanel, h("div", { class: "words" }, words, note), live);

  // ---------------------------------------------------------------------------------------- the picture
  const sceneHost: BattutaSceneHost = {
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
    speaking: () => (state.talk ? { who: lineOf(IBR_SCRIPTS, state.talk).who, mood: lineOf(IBR_SCRIPTS, state.talk).mood } : null),
    look: () => ({ quality: host.quality(), reducedMotion: host.reducedMotion(), style: state.route.style, keeper: host.keeper() }),
    portraits: (urls) => ((portraits = urls), renderTalk()),
    state: () => state,
    rtl,
  };
  const opts: StartOptions = { perf: host.perf, onLost: () => host.toast(t("context_lost")), onRestored: () => redraw() };
  function begin(): void {
    try {
      run = startRoom(canvasBox, sceneHost, host.quality(), opts, "battuta", BattutaScene);
    } catch {
      run = null;
      host.toast(t("error_webgl"));
      // Without a picture the road is threaded on its own page, as it was before the inn.
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
  // The inn waits while the tab is hidden.
  const onHidden = () => (document.hidden ? run?.game.loop.sleep() : run?.game.loop.wake());
  document.addEventListener("visibilitychange", onHidden);

  // ---------------------------------------------------------------------------------------- the rules
  function command(c: BattutaCommand): void {
    if (stopped) return;
    const before = state;
    const r = applyBattutaRoom(state, c);
    state = r.state;
    for (const x of r.happened) react(x);
    run?.scene()?.happened(r.happened);
    // The place is kept by the page quest's own rule (sim/battutaroom.ts keptAfter): one place serves the page and the inn.
    const kept = keptAfter(before, state);
    if (kept !== undefined) host.keepPlace(kept);
    tell(r.happened, before);
    if (state.route.done && !finished) end_();
    render();
  }
  function react(x: BattutaHappened): void {
    if (x.type === "step" || x.type === "slip" || x.type === "peek") host.sound("line");
    else if (x.type === "feather") host.sound("feather");
    else if (x.type === "talk") host.sound("call");
    else if (x.type === "line") host.sound("line");
  }

  /** The words for what a touch did, as the page says them for the way of playing (ui/route.ts tell). */
  function tell(list: BattutaHappened[], before: BattutaState): void {
    for (const x of list) {
      if (x.type === "step") {
        ran.replaceChildren(h("p", { class: "met", textContent: t("ib_step_ok", { name: stopName(x.stop) }) }));
        if (state.route.done) ran.append(h("p", {}, h("strong", { textContent: t("ib_end_done") })));
      } else if (x.type === "slip") {
        const next = nextStop(before.route);
        const style = state.route.style;
        const text = style === "story" ? t("ib_slip_story", { name: next ? stopName(next) : "" }) : style === "explorer" ? t("ib_slip_explorer") : t("ib_slip_challenge");
        ran.replaceChildren(h("p", { class: "stopped", textContent: text }));
      } else if (x.type === "peek") {
        if (x.slip) ran.replaceChildren(h("p", { class: "stopped", textContent: t("ib_peek_slip") }));
        else ran.replaceChildren();
      } else if (x.type === "read") {
        // The sentence was showing already: it is said again.
        live.textContent = sentenceText();
      }
    }
  }

  function end_(): void {
    finished = true;
    host.sound("restored");
    state = afterDone(state);
    run?.scene()?.finished();
    host.finish(battutaGoals(state));
    showPanel();
    // Hudhud's last line is shown first, so that the live region's last word is that the door is open.
    render();
    live.textContent = `${t("ib_who_hudhud")}: ${t("jn_door_lit")}`;
    host.sound("call");
  }
  /** The goals and the museum's note beside the stage, not over it: the bird stays free to walk to the lit door. */
  function showPanel(): void {
    const g = battutaGoals(state);
    const slack = ROUTE_SLACK[state.route.style];
    const goal = (mark: string, name: Key, how: string, met: boolean) => h("li", {}, h("span", { class: "mark", textContent: mark }), h("span", {}, h("strong", { textContent: t(name) }), h("br", {}), h("span", { class: "small", textContent: how })), h("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    const names: Key[] = ["ib_rec_person", "ib_rec_book", "ib_rec_question"];
    doorPanel.replaceChildren(
      h("h2", { id: "ibr-panel-title", textContent: t("jn_panel_title"), tabIndex: -1 }),
      h("p", { class: "door-line" }, h("strong", { textContent: `${t("ib_who_hudhud")}: ` }), t("jn_door_lit")),
      h("p", { class: "row" }, h("button", { type: "button", class: "door-go", textContent: t("jn_go_door"), onclick: () => host.through() }), h("button", { type: "button", textContent: t("play_again"), onclick: () => again() }), h("button", { type: "button", textContent: t("btn_atlas"), onclick: () => host.leave() })),
      h("h3", { textContent: t("results_title") }),
      h("p", { textContent: t("ib_slips", { n: num(state.route.slips) }) }),
      h(
        "ul",
        { class: "goals" },
        goal("✦", "goal_curiosity", t("ib_goal_curiosity_how"), g.curiosity),
        goal("⚙", "goal_ingenuity", slack === null ? t("ib_goal_ingenuity_story") : t("ib_goal_ingenuity_how", { n: num(slack) }), g.ingenuity),
        goal("♥", "goal_kindness", t("ib_goal_kindness_how"), g.kindness),
        goal("❧", "goal_feather", t("ib_goal_feather_how"), g.feather),
      ),
      h(
        "div",
        { class: "note" },
        h("h3", { textContent: t("note_title") }),
        h("p", { textContent: t("ib_note_1") }),
        h("p", { textContent: t("ib_note_2") }),
        h("p", { textContent: t("ib_note_3") }),
        h("p", { class: "room-note", textContent: t("ibr_note_room") }),
        h("p", { class: "pending", textContent: t("ib_review") }),
        ...ROUTE_RECORDS.map((id, i) => h("p", {}, h("a", { href: `${host.museum}/${host.lang}/${id}/`, textContent: t("note_link", { name: t(names[i]!) }) }))),
      ),
    );
    doorPanel.hidden = false;
  }
  function again(): void {
    // The same way of playing as the inn was opened with: its ring and its list of things are that stage's.
    state = newBattutaRoom(state.route.style);
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
    const line = lineOf(IBR_SCRIPTS, talk);
    const id = `${talk.script}/${talk.node}/${talk.line}`;
    const text = t(line.key as Key);
    const choices = choicesOf(IBR_SCRIPTS, talk, new Set<string>(state.route.flags));
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
    const who = t(`ib_who_${line.who === "keeper" ? "hudhud" : line.who}` as Key);
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
    const face = portraits[line.who as IbrSpeaker];
    talkBox.replaceChildren(face ? h("img", { src: face, alt: "", width: 120, height: 120 }) : h("span", {}), body);
    if (fresh) (choices.length ? (talkBox.querySelector(".choices button") as HTMLElement | null) : next)?.focus({ preventScroll: true });
  }

  /** Flies the bird to a thing and touches it; with no picture there is no bird to fly there, and the list touches the thing itself. */
  function go(id: string): void {
    const scene = run?.scene();
    if (scene) scene.goTo(id);
    else command({ type: "touch", id });
  }

  function render(): void {
    renderTalk();
    const r = state.route;
    const done = r.done;
    const progress = progressText();
    const sentence = sentenceText();
    // The stage's sentence is in the objective too, where the eye is while playing; a screen reader hears it once, from the list below.
    const seen = h("small", { class: "stage-line", textContent: done ? "" : sentence });
    seen.setAttribute("aria-hidden", "true");
    objective.replaceChildren(t(done ? "ibr_objective_door" : "ibr_objective"), h("small", { textContent: progress }), seen);
    pad.hidden = state.talk !== null;
    stageWrap.classList.toggle("talking", state.talk !== null);
    if (state.talk) prompt.hidden = true;
    if (counts.textContent !== progress) counts.textContent = progress;
    if (stageBox.textContent !== sentence) stageBox.textContent = sentence;
    // Every bead in the ring's order: a button for each, which flies the bird there and touches it.
    const active = document.activeElement as HTMLElement | null;
    const was = active !== null && (beadsBox.contains(active) || thingList.contains(active)) ? active.dataset.thing : undefined;
    const on = new Set(threaded(r));
    const list = h(
      "ol",
      { class: "sheet-row" },
      ...things
        .filter((k) => k.kind === "bead")
        .map((k) => {
          const b = h("button", { type: "button", textContent: t("alt_touch", { thing: nameOf(k) }), disabled: done || frozen(), onclick: () => go(k.id) });
          b.dataset.thing = k.id;
          b.dataset.stop = k.stop!;
          b.classList.toggle("on", on.has(k.stop!));
          return h("li", {}, b);
        }),
    );
    list.setAttribute("aria-label", t("ibr_beads_group"));
    beadsBox.replaceChildren(h("h3", { textContent: t("ibr_beads_group") }), list);
    // Once the road is threaded, the list holds one thing: the door.
    if (done) thingList.replaceChildren(h("li", {}, h("button", { type: "button", textContent: t("jn_go_door"), onclick: () => host.through() })));
    else
      thingList.replaceChildren(
        ...things
          .filter((k) => k.kind !== "bead")
          .map((k) => {
            const b = h("button", { type: "button", textContent: t("alt_touch", { thing: nameOf(k) }), disabled: frozen(), onclick: () => go(k.id) });
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
    command,
    press,
    busy: () => false,
    sentence: () => stageBox.textContent ?? "",
    status: () => ran.textContent ?? "",
    running: () => run,
    door: () => {
      const w = run?.scene()?.where() ?? null;
      return { lit: state.route.done, where: { ...IBR_DOOR }, bird: w ? { x: w.x, y: w.y } : null };
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
