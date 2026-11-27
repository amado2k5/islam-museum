// Karima al-Marwaziyya's room: the copies compared in a room, by flying along the reading stands and touching a sign to
// mark it as a slip (asked for by the founder, 27 November 2026). The picture is a canvas on the room engine
// (scenes/karima.ts); everything a player reads or presses is ordinary page: the words of a talk, the objective, the
// touch prompt, and under the stage a list that says the whole room in words and lets it be played without the picture
// (every copy's signs in order, each a button that says its copy, place and sign and whether it is marked, how many
// slips remain where the way of playing shows it, Karima, the boy and the stack of spare copies as buttons, and the
// page's own sentence for the last mark).
//
// The rules are the copies' (sim/collate.ts) through the room's (sim/karimaroom.ts): a sign touched is the page's press
// on that sign, a wrong mark is refused and counted, and every sentence is the page's for the way of playing. The quest
// shows no religious text, and the room keeps that rule: its note says so.
import { COLLATE_RECORDS, COLLATE_SLACK, showsRemaining } from "../content/collate";
import { KRR_DOOR, KRR_SCRIPTS, krrThings, type KrrSpeaker, type KrrThing } from "../content/karima-room";
import type { Cue } from "../audio/cues";
import { startRoom, type Running, type StartOptions } from "../game/boot";
import type { Intent } from "../sim/move";
import { choicesOf, lineOf } from "../narrative/dialogue";
import type { Keeper, Quality } from "../save/save";
import { isMarked, remaining, type CollateStyle } from "../sim/collate";
import { afterDone, applyKarimaRoom, karimaGoals, keptAfter, newKarimaRoom, type KarimaCommand, type KarimaHappened, type KarimaState } from "../sim/karimaroom";
import { KarimaScene, type KarimaSceneHost } from "../scenes/karima";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;
export interface KarimaHost {
  t(key: Key, vars?: Record<string, string | number>): string;
  num(n: number): string;
  lang: string;
  museum: string;
  /** The subject's name, for the heading. */
  title: string;
  style(): CollateStyle;
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
  resume?: KarimaState | null;
  keepPlace(snap: unknown | null): void;
}
export interface KarimaRoom {
  node: HTMLElement;
  state(): KarimaState;
  command(c: KarimaCommand): void;
  /** A key or a controller's press: touch, go on in a talk, move among its choices. */
  press(p: "touch" | "pause" | "next" | "back" | "up" | "down"): void;
  /** Always false: nothing here is shown step by step. */
  busy(): boolean;
  /** What the page says now about the slips still to find, as far as the way of playing shows it. */
  status(): string;
  running(): Running<KarimaScene> | null;
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

/** A sign's id as the tail of a string key: `crescent-right` is `crescent_right` (as ui/collate.ts has it). */
const tail = (id: string): string => id.replace(/-/g, "_");

export function karimaRoom(host: KarimaHost): KarimaRoom {
  const { t, num } = host;
  const rtl = host.lang === "ar" || host.lang === "ur";
  let state: KarimaState = host.resume ?? newKarimaRoom(host.style());
  const things = krrThings(state.collate.style, rtl);
  let portraits: Record<string, string> = {};
  let run: Running<KarimaScene> | null = null;
  let stopped = false;
  let finished = state.collate.done;

  const at = (copy: number, place: number) => ({ c: num(copy + 1), p: num(place + 1) });
  const signName = (copy: number, place: number) => t(`kr_sign_${tail(state.collate.puzzle.copies[copy]![place]!)}` as Key);
  /** What a thing is called: a sign by its copy, place and sign, and whether it is marked, in the page's own words. */
  const nameOf = (k: KrrThing): string => {
    if (k.kind !== "sign") return t(k.name as Key);
    const marked = isMarked(state.collate, k.copy!, k.place!);
    return t(marked ? "kr_cell_marked" : "kr_cell", { ...at(k.copy!, k.place!), sign: signName(k.copy!, k.place!) });
  };
  const frozen = () => stopped || state.talk !== null || host.blocked();
  /** The slips still to find, in the way of playing's own words: Story and Explorer count them, Challenge does not (the page's rule). */
  const statusText = (): string => (state.collate.done ? t("kr_did_done") : showsRemaining(state.collate.style) ? t("kr_left", { n: num(remaining(state.collate)) }) : t("kr_left_hidden"));

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
  stage.setAttribute("aria-label", t("krr_canvas_label"));
  const talkBox = h("div", { class: "talk", hidden: true });
  talkBox.setAttribute("role", "group");
  const stageWrap = h("div", { class: "stage-wrap" }, objective, stage, talkBox);
  const doorPanel = h("section", { class: "door-panel", hidden: true });
  doorPanel.setAttribute("aria-labelledby", "krr-panel-title");
  const live = h("div", { class: "visually-hidden", role: "status" });
  live.setAttribute("aria-live", "polite");

  // The room in words: how many slips remain (as far as the way of playing shows it), the counts, every copy's signs, the other things, the last mark.
  const left = h("p", { class: "carrying" });
  left.setAttribute("aria-live", "polite");
  const counts = h("p", { class: "small" });
  const copiesBox = h("div", { class: "sheet-rows" });
  copiesBox.setAttribute("role", "group");
  copiesBox.setAttribute("aria-label", t("krr_copies_group"));
  const thingList = h("ul", {});
  const ran = h("div", { class: "ran" });
  ran.setAttribute("aria-live", "polite");
  const words = h("section", { class: "room-words" }, h("h2", { textContent: t("alt_title") }), left, counts, copiesBox, thingList, ran);
  const note = h(
    "section",
    {},
    h("h2", { textContent: t("note_title") }),
    h("p", { textContent: t("krr_note_room") }),
    h("p", { class: "small", textContent: t("art_note") }),
    h("h2", { textContent: t("controls_title") }),
    // The keys only: the workshop's line about touch speaks of tapping a mirror, which this room has not.
    h("p", { class: "small", textContent: t("controls_keys") }),
  );
  const node = h("div", { class: "room" }, heading, stageWrap, doorPanel, h("div", { class: "words" }, words, note), live);

  // ---------------------------------------------------------------------------------------- the picture
  const sceneHost: KarimaSceneHost = {
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
    speaking: () => (state.talk ? { who: lineOf(KRR_SCRIPTS, state.talk).who, mood: lineOf(KRR_SCRIPTS, state.talk).mood } : null),
    look: () => ({ quality: host.quality(), reducedMotion: host.reducedMotion(), style: state.collate.style, keeper: host.keeper() }),
    portraits: (urls) => ((portraits = urls), renderTalk()),
    state: () => state,
    rtl,
  };
  const opts: StartOptions = { perf: host.perf, onLost: () => host.toast(t("context_lost")), onRestored: () => redraw() };
  function begin(): void {
    try {
      run = startRoom(canvasBox, sceneHost, host.quality(), opts, "karima", KarimaScene);
    } catch {
      run = null;
      host.toast(t("error_webgl"));
      // Without a picture the copies are compared on their own page, as they were before the room.
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
  function command(c: KarimaCommand): void {
    if (stopped) return;
    const before = state;
    const r = applyKarimaRoom(state, c);
    state = r.state;
    for (const x of r.happened) react(x);
    run?.scene()?.happened(r.happened);
    // The place is kept by the page quest's own rule (sim/karimaroom.ts keptAfter): one place serves the page and the room.
    const kept = keptAfter(before, state);
    if (kept !== undefined) host.keepPlace(kept);
    if (r.commands.some((k) => k.type !== "flag")) showResult();
    if (state.collate.done && !finished) end_();
    render();
  }
  function react(x: KarimaHappened): void {
    if (x.type === "mark" || x.type === "unmark" || x.type === "refused") host.sound("line");
    else if (x.type === "feather") host.sound("feather");
    else if (x.type === "talk") host.sound("call");
    else if (x.type === "line") host.sound("line");
  }

  /** What the page says after a mark: what happened, and then where the slips stand as far as the way of playing shows it (ui/collate.ts showResult). */
  function showResult(): void {
    const last = state.collate.last;
    const paras: HTMLElement[] = [];
    if (last && last.type !== "refused") {
      const key: Key = last.type === "unmark" ? "kr_did_unmark" : state.collate.puzzle.copies.length === 2 ? "kr_did_mark_story" : "kr_did_mark";
      paras.push(h("p", { textContent: t(key, at(last.copy, last.place)) }));
    } else if (last) {
      paras.push(h("p", { class: "stopped", textContent: t(last.why === "same" ? "kr_did_same" : last.why === "hers" ? "kr_did_hers" : "kr_did_agrees", at(last.copy, last.place)) }));
    }
    paras.push(h("p", { class: state.collate.done ? "met" : "status", textContent: statusText() }));
    ran.replaceChildren(...paras);
  }

  function end_(): void {
    finished = true;
    host.sound("restored");
    state = afterDone(state);
    run?.scene()?.finished();
    host.finish(karimaGoals(state));
    showPanel();
    // Hudhud's last line is shown first, so that the live region's last word is that the door is open.
    render();
    live.textContent = `${t("kr_who_hudhud")}: ${t("jn_door_lit")}`;
    host.sound("call");
  }
  /** The goals and the museum's note beside the stage, not over it: the bird stays free to walk to the lit door. */
  function showPanel(): void {
    const g = karimaGoals(state);
    const slack = COLLATE_SLACK[state.collate.style];
    const goal = (mark: string, name: Key, how: string, met: boolean) => h("li", {}, h("span", { class: "mark", textContent: mark }), h("span", {}, h("strong", { textContent: t(name) }), h("br", {}), h("span", { class: "small", textContent: how })), h("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    const names: Key[] = ["kr_rec_person"];
    doorPanel.replaceChildren(
      h("h2", { id: "krr-panel-title", textContent: t("jn_panel_title"), tabIndex: -1 }),
      h("p", { class: "door-line" }, h("strong", { textContent: `${t("kr_who_hudhud")}: ` }), t("jn_door_lit")),
      h("p", { class: "row" }, h("button", { type: "button", class: "door-go", textContent: t("jn_go_door"), onclick: () => host.through() }), h("button", { type: "button", textContent: t("play_again"), onclick: () => again() }), h("button", { type: "button", textContent: t("btn_atlas"), onclick: () => host.leave() })),
      h("h3", { textContent: t("results_title") }),
      h("p", { textContent: t("kr_progress", { marked: num(state.collate.marks.length), wrong: num(g.slips) }) }),
      h(
        "ul",
        { class: "goals" },
        goal("✦", "goal_curiosity", t("kr_goal_curiosity_how"), g.curiosity),
        goal("⚙", "goal_ingenuity", slack === null ? t("kr_goal_ingenuity_story") : t("kr_goal_ingenuity_how", { n: num(slack) }), g.ingenuity),
        goal("♥", "goal_kindness", t("kr_goal_kindness_how"), g.kindness),
        goal("❧", "goal_feather", t("kr_goal_feather_how"), g.feather),
      ),
      h(
        "div",
        { class: "note" },
        h("h3", { textContent: t("note_title") }),
        h("p", { textContent: t("kr_note_1") }),
        h("p", { textContent: t("kr_note_2") }),
        h("p", { textContent: t("kr_note_3") }),
        h("p", { class: "room-note", textContent: t("krr_note_room") }),
        h("p", { class: "pending", textContent: t("kr_review") }),
        ...COLLATE_RECORDS.map((id, i) => h("p", {}, h("a", { href: `${host.museum}/${host.lang}/${id}/`, textContent: t("note_link", { name: t(names[i]!) }) }))),
      ),
    );
    doorPanel.hidden = false;
  }
  function again(): void {
    // The same way of playing as the room was opened with: its stands and its list of things are that puzzle's.
    state = newKarimaRoom(state.collate.style);
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
    const line = lineOf(KRR_SCRIPTS, talk);
    const id = `${talk.script}/${talk.node}/${talk.line}`;
    const text = t(line.key as Key);
    const choices = choicesOf(KRR_SCRIPTS, talk, new Set<string>(state.collate.flags));
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
    const who = t(`kr_who_${line.who === "keeper" ? "hudhud" : line.who}` as Key);
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
    const face = portraits[line.who as KrrSpeaker];
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
    const c = state.collate;
    const done = c.done;
    const progress = t("kr_progress", { marked: num(c.marks.length), wrong: num(c.wrong) });
    objective.replaceChildren(t(done ? "krr_objective_door" : "krr_objective"), h("small", { textContent: progress }));
    pad.hidden = state.talk !== null;
    stageWrap.classList.toggle("talking", state.talk !== null);
    if (state.talk) prompt.hidden = true;
    const status = statusText();
    if (left.textContent !== status) left.textContent = status;
    counts.textContent = progress;
    // Every copy in order, her copy first, each a list of its signs in order: a button for each, which flies the bird there and touches the sign.
    const active = document.activeElement as HTMLElement | null;
    const was = active !== null && (copiesBox.contains(active) || thingList.contains(active)) ? active.dataset.thing : undefined;
    copiesBox.replaceChildren(
      ...c.puzzle.copies.map((_, copy) => {
        const title = copy === c.puzzle.hers ? t("kr_copy_hers", { c: num(copy + 1) }) : t("kr_copy", { c: num(copy + 1) });
        const list = h(
          "ol",
          { class: "sheet-row" },
          ...things
            .filter((k) => k.kind === "sign" && k.copy === copy)
            .map((k) => {
              const b = h("button", { type: "button", textContent: t("alt_touch", { thing: nameOf(k) }), disabled: done || frozen(), onclick: () => go(k.id) });
              b.dataset.thing = k.id;
              b.dataset.copy = String(k.copy);
              b.dataset.place = String(k.place);
              b.setAttribute("aria-pressed", String(isMarked(c, k.copy!, k.place!)));
              return h("li", {}, b);
            }),
        );
        list.setAttribute("aria-label", title);
        return h("div", { class: "copy-row" }, h("h3", { textContent: title }), list);
      }),
    );
    // Once every slip is marked, the list holds one thing: the door.
    if (done) thingList.replaceChildren(h("li", {}, h("button", { type: "button", textContent: t("jn_go_door"), onclick: () => host.through() })));
    else
      thingList.replaceChildren(
        ...things
          .filter((k) => k.kind !== "sign")
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
  if (state.collate.last) showResult();
  return {
    node,
    state: () => state,
    command,
    press,
    busy: () => false,
    status: statusText,
    running: () => run,
    door: () => {
      const w = run?.scene()?.where() ?? null;
      return { lit: state.collate.done, where: { ...KRR_DOOR }, bird: w ? { x: w.x, y: w.y } : null };
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
