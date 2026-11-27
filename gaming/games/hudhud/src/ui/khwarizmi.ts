// Al-Khwarizmi's room: the locked box played in a room, by flying to the hollow groups on the trays, the two weights and
// the scoop and touching them (asked for by the founder, 27 November 2026). The picture is a canvas on the room engine
// (scenes/khwarizmi.ts); everything a player reads or presses is ordinary page: the words of a talk, the objective, the
// touch prompt, and under the stage a list that says the whole room in words and lets it be played without the picture
// (the problem in words, what each tray holds, every thing a button: the hollow groups that are there, the two weights,
// the scoop, al-Khwarizmi, the child and the box).
//
// The rules are the locked box's (sim/algebra.ts) through the room's (sim/khwarizmiroom.ts). What a move says afterwards
// depends on the way of playing exactly as on the page (ui/algebra.ts), with the page's own words, and after every move
// the problem is said again in words, the page's own sentence, in a polite live region.
import { ALGEBRA_RECORDS, ALGEBRA_SLACK, amountWords, equationWords, sideWords } from "../content/algebra";
import { AKR_DOOR, AKR_SCRIPTS, akrThings, trayOf, type AkrSpeaker } from "../content/khwarizmi-room";
import type { Cue } from "../audio/cues";
import { startRoom, type Running, type StartOptions } from "../game/boot";
import type { Intent } from "../sim/move";
import { choicesOf, lineOf } from "../narrative/dialogue";
import type { Keeper, Quality } from "../save/save";
import { available, fewest, type AlgebraStyle, type Move } from "../sim/algebra";
import { applyKhwarizmiRoom, keptAfter, khwarizmiGoals, moveOf, newKhwarizmiRoom, touchableNow, type KhwarizmiCommand, type KhwarizmiHappened, type KhwarizmiState } from "../sim/khwarizmiroom";
import { KhwarizmiScene, type KhwarizmiSceneHost, type KhwarizmiView } from "../scenes/khwarizmi";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;
export interface KhwarizmiHost {
  t(key: Key, vars?: Record<string, string | number>): string;
  num(n: number): string;
  lang: string;
  museum: string;
  /** The subject's name, for the heading. */
  title: string;
  style(): AlgebraStyle;
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
  resume?: KhwarizmiState | null;
  keepPlace(snap: unknown | null): void;
}
export interface KhwarizmiRoom {
  node: HTMLElement;
  state(): KhwarizmiState;
  view(): KhwarizmiView;
  command(c: KhwarizmiCommand): void;
  /** The problem as the room says it now, in words: the page's own sentence. */
  sentence(): string;
  /** A key or a controller's press: touch, go on in a talk, move among its choices. */
  press(p: "touch" | "pause" | "next" | "back" | "up" | "down"): void;
  busy(): boolean;
  running(): Running<KhwarizmiScene> | null;
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

export function khwarizmiRoom(host: KhwarizmiHost): KhwarizmiRoom {
  const { t, num } = host;
  const rtl = host.lang === "ar" || host.lang === "ur";
  const things = akrThings(rtl);
  let state: KhwarizmiState = host.resume ?? newKhwarizmiRoom(host.style());
  let portraits: Record<string, string> = {};
  let run: Running<KhwarizmiScene> | null = null;
  let stopped = false;

  const say_ = (key: string, vars?: Record<string, string | number>) => t(key as Key, vars);
  const list = (names: string[]) => names.join(rtl ? "، " : ", ");
  const eqWords = () => equationWords(state.algebra.eq, say_, num);
  /** A side is on the screen's left unless the page reads right to left, where the first side is on the right (as on the page). */
  const onScreen = (side: "left" | "right") => (rtl ? (side === "left" ? "right" : "left") : side);
  /** The label of a move, in the page's own words: a restore says what is taken away and from which side. */
  function labelOf(m: Move): string {
    if (m.type === "balance") return t(m.kind === "things" ? "ak_balance_things" : "ak_balance_numbers");
    if (m.type === "share") return t("ak_share");
    const n = state.algebra.eq[m.side][m.kind === "things" ? "lessThings" : "lessNumber"];
    return t(onScreen(m.side) === "left" ? "ak_restore_left" : "ak_restore_right", { amount: amountWords(m.kind, n, false, say_, num) });
  }

  const view = (): KhwarizmiView => ({ state, done: state.algebra.done });
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
  stage.setAttribute("aria-label", t("akr_canvas_label"));
  const talkBox = h("div", { class: "talk", hidden: true });
  talkBox.setAttribute("role", "group");
  const stageWrap = h("div", { class: "stage-wrap" }, objective, stage, talkBox);
  const doorPanel = h("section", { class: "door-panel", hidden: true });
  doorPanel.setAttribute("aria-labelledby", "akr-panel-title");
  const live = h("div", { class: "visually-hidden", role: "status" });
  live.setAttribute("aria-live", "polite");

  // The problem in words, said again after every move (the page's own sentence, in a polite live region).
  const sentence = h("p", { class: "equation" });
  sentence.setAttribute("aria-live", "polite");
  const trayLines = h("ul", { class: "trays" });
  const countLine = h("p", { class: "small" });
  const thingList = h("ul", {});
  const ran = h("div", { class: "ran" });
  ran.setAttribute("aria-live", "polite");
  const words = h("section", { class: "room-words" }, h("h2", { textContent: t("alt_title") }), h("h3", { textContent: t("ak_eq_caption") }), sentence, trayLines, countLine, thingList, ran);
  const note = h(
    "section",
    {},
    h("h2", { textContent: t("note_title") }),
    h("p", { textContent: t("akr_note_room") }),
    h("p", { class: "small", textContent: t("art_note") }),
    h("h2", { textContent: t("controls_title") }),
    // The keys only: the workshop's line about touch speaks of tapping a mirror, which this room has not.
    h("p", { class: "small", textContent: t("controls_keys") }),
  );
  const node = h("div", { class: "room" }, heading, stageWrap, doorPanel, h("div", { class: "words" }, words, note), live);

  // ---------------------------------------------------------------------------------------- the picture
  const sceneHost: KhwarizmiSceneHost = {
    intent: () => host.intent(),
    frozen,
    touch: (id) => command({ type: "touch", id }),
    near: (id) => {
      const thing = things.find((k) => k.id === id);
      prompt.hidden = (!thing && id !== "door") || state.talk !== null;
      if (id === "door") prompt.textContent = t("jn_go_door");
      else if (thing) prompt.textContent = t("touch_prompt", { thing: t(thing.name as Key) });
    },
    through: () => host.through(),
    sound: (c) => host.sound(c),
    speaking: () => (state.talk ? { who: lineOf(AKR_SCRIPTS, state.talk).who, mood: lineOf(AKR_SCRIPTS, state.talk).mood } : null),
    look: () => ({ quality: host.quality(), reducedMotion: host.reducedMotion(), style: state.algebra.style, keeper: host.keeper() }),
    portraits: (urls) => ((portraits = urls), renderTalk()),
    view,
    rtl,
  };
  const opts: StartOptions = { perf: host.perf, onLost: () => host.toast(t("context_lost")), onRestored: () => redraw() };
  function begin(): void {
    try {
      run = startRoom(canvasBox, sceneHost, host.quality(), opts, "khwarizmi", KhwarizmiScene);
    } catch {
      run = null;
      host.toast(t("error_webgl"));
      // Without a picture the locked box is played on its own page, as it was before the room.
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
  function command(c: KhwarizmiCommand): void {
    if (stopped) return;
    const r = applyKhwarizmiRoom(state, c);
    state = r.state;
    for (const x of r.happened) react(x);
    run?.scene()?.happened(r.happened);
    // The place is kept by the page quest's own rule (sim/khwarizmiroom.ts keptAfter): one place serves the page and the room.
    const kept = keptAfter(state, r.commands);
    if (kept !== undefined) host.keepPlace(kept);
    render();
    if (r.happened.some((x) => x.type === "opened")) end_();
  }
  function react(x: KhwarizmiHappened): void {
    if (x.type === "move") {
      if (x.applied) host.sound("line");
      showMove();
    } else if (x.type === "opened") host.sound("restored");
    else if (x.type === "feather") host.sound("feather");
    else if (x.type === "talk") host.sound("call");
    else if (x.type === "line") host.sound("line");
  }
  /** What the room says after a move, exactly as the page does: what it did, or that nothing changed, and how much of
   * that is said depends on the way of playing. */
  function showMove(): void {
    const a = state.algebra;
    const last = a.last;
    if (!last) return;
    if (last.applied) {
      ran.replaceChildren(h("p", { class: a.done ? "met" : "", textContent: t(a.done ? "ak_did_solved" : last.move.type === "restore" ? "ak_did_restore" : last.move.type === "balance" ? "ak_did_balance" : "ak_did_share") }));
      return;
    }
    // Story explains the slip and names the moves that would work now; Explorer says which kind of move does not work here; Challenge says only that nothing changed.
    const text =
      a.style === "story"
        ? t(last.move.type === "restore" ? "ak_slip_restore_story" : last.move.type === "balance" ? "ak_slip_balance_story" : "ak_slip_share_story", { list: list(available(a.eq).map(labelOf)) })
        : a.style === "explorer"
          ? t(last.move.type === "restore" ? "ak_slip_kind_restore" : last.move.type === "balance" ? "ak_slip_kind_balance" : "ak_slip_kind_share")
          : t("ak_slip_none");
    ran.replaceChildren(h("p", { class: "stopped", textContent: text }));
  }

  function end_(): void {
    host.finish(khwarizmiGoals(state));
    showPanel();
    live.textContent = `${t("ak_who_hudhud")}: ${t("jn_door_lit")}`;
    host.sound("call");
  }
  /** The goals and the museum's note beside the stage, not over it: the bird stays free to walk to the lit door. */
  function showPanel(): void {
    const g = khwarizmiGoals(state);
    const slack = ALGEBRA_SLACK[state.algebra.style];
    const best = fewest(state.algebra.start) ?? 0;
    const goal = (mark: string, name: Key, how: string, met: boolean) => h("li", {}, h("span", { class: "mark", textContent: mark }), h("span", {}, h("strong", { textContent: t(name) }), h("br", {}), h("span", { class: "small", textContent: how })), h("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    const names: Key[] = ["ak_rec_person", "ak_rec_book", "ak_rec_algebra"];
    doorPanel.replaceChildren(
      h("h2", { id: "akr-panel-title", textContent: t("jn_panel_title"), tabIndex: -1 }),
      h("p", { class: "door-line" }, h("strong", { textContent: `${t("ak_who_hudhud")}: ` }), t("jn_door_lit")),
      h("p", { class: "row" }, h("button", { type: "button", class: "door-go", textContent: t("jn_go_door"), onclick: () => host.through() }), h("button", { type: "button", textContent: t("play_again"), onclick: () => again() }), h("button", { type: "button", textContent: t("btn_atlas"), onclick: () => host.leave() })),
      h("h3", { textContent: t("results_title") }),
      h("p", { textContent: t("ak_progress", { moves: num(g.turns), slips: num(g.slips) }) }),
      h(
        "ul",
        { class: "goals" },
        goal("✦", "goal_curiosity", t("ak_goal_curiosity_how"), g.curiosity),
        goal("⚙", "goal_ingenuity", slack === null ? t("ak_goal_ingenuity_story") : t("ak_goal_ingenuity_how", { n: num(slack), m: num(best + slack) }), g.ingenuity),
        goal("♥", "goal_kindness", t("ak_goal_kindness_how"), g.kindness),
        goal("❧", "goal_feather", t("ak_goal_feather_how"), g.feather),
      ),
      h(
        "div",
        { class: "note" },
        h("h3", { textContent: t("note_title") }),
        h("p", { textContent: t("ak_note_1") }),
        h("p", { textContent: t("ak_note_2") }),
        h("p", { textContent: t("ak_note_3") }),
        h("p", { textContent: t("ak_note_4") }),
        h("p", { class: "room-note", textContent: t("akr_note_room") }),
        h("p", { class: "pending", textContent: t("ak_review") }),
        ...ALGEBRA_RECORDS.map((id, i) => h("p", {}, h("a", { href: `${host.museum}/${host.lang}/${id}/`, textContent: t("note_link", { name: t(names[i]!) }) }))),
      ),
    );
    doorPanel.hidden = false;
  }
  function again(): void {
    state = newKhwarizmiRoom(host.style());
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
    const line = lineOf(AKR_SCRIPTS, talk);
    const id = `${talk.script}/${talk.node}/${talk.line}`;
    const text = t(line.key as Key);
    const choices = choicesOf(AKR_SCRIPTS, talk, new Set<string>(state.algebra.flags));
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
    const who = t(`ak_who_${line.who === "keeper" ? "hudhud" : line.who}` as Key);
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
    const face = portraits[line.who as AkrSpeaker];
    talkBox.replaceChildren(face ? h("img", { src: face, alt: "", width: 120, height: 120 }) : h("span", {}), body);
    if (fresh) (choices.length ? (talkBox.querySelector(".choices button") as HTMLElement | null) : next)?.focus({ preventScroll: true });
  }

  /** What a thing's button says: what it is and, for a hollow group, a weight or the scoop, the page's own words for the move it makes. */
  function label(id: string): string {
    const thing = things.find((k) => k.id === id)!;
    const m = moveOf(id);
    if (m) return t("akr_use_btn", { thing: t(thing.name as Key), move: labelOf(m) });
    return t("alt_touch", { thing: t(thing.name as Key) });
  }

  function render(): void {
    renderTalk();
    const a = state.algebra;
    const done = a.done;
    const text = eqWords();
    if (sentence.textContent !== text) sentence.textContent = text;
    const counts = t("ak_progress", { moves: num(a.moves), slips: num(a.slips) });
    objective.replaceChildren(t(done ? "akr_objective_door" : "akr_objective"), h("small", { textContent: counts }));
    pad.hidden = state.talk !== null;
    stageWrap.classList.toggle("talking", state.talk !== null);
    if (state.talk) prompt.hidden = true;
    // What each tray holds, in words: the tray with the first side first.
    trayLines.replaceChildren(
      ...(["left", "right"] as const).map((side) => h("li", { textContent: t(trayOf(side, rtl) === 0 ? "akr_tray_left" : "akr_tray_right", { side: sideWords(a.eq[side], true, say_, num) }) })),
    );
    countLine.textContent = counts;
    // Once the box is open, the list holds one thing: the door.
    if (done) thingList.replaceChildren(h("li", {}, h("button", { type: "button", textContent: t("jn_go_door"), onclick: () => host.through() })));
    else
      thingList.replaceChildren(
        ...things
          .filter((k) => touchableNow(a, k.id))
          .map((k) => {
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
    sentence: () => eqWords(),
    press,
    busy: () => false,
    running: () => run,
    door: () => {
      const w = run?.scene()?.where() ?? null;
      return { lit: view().done, where: { ...AKR_DOOR }, bird: w ? { x: w.x, y: w.y } : null };
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
