// Al-Kindi's room: the secret page played in a room, by flying to the sign tokens on the shelf, carrying one in the beak
// to a mark's place on the large board, and ringing the bell to read the page (asked for by the founder, 27 November
// 2026). The picture is a canvas on the room engine (scenes/kindi.ts); everything a player reads or presses is ordinary
// page: the words of a talk, the objective, the touch prompt, and under the stage a list that says the whole room in
// words and lets it be played without the picture (what Hudhud carries, each mark with the sign given to it, the two
// count boards as real tables, the opening rule and how the message begins, the last reading's message, and every
// thing a button: al-Kindi, the messenger, the torn page, the bell, each mark's place and each token).
//
// The rules are the secret page's (sim/cipher.ts) through the room's (sim/kindiroom.ts). What a sign given and a reading
// say afterwards is exactly what the page says (ui/cipher.ts), with the page's own words, and depends on the way of
// playing exactly as there.
import { CIPHER_RECORDS, CIPHER_SLACK } from "../content/cipher";
import { KDR_DOOR, KDR_SCRIPTS, boardMarks, kdrThings, type KdrSpeaker, type KdrThing } from "../content/kindi-room";
import type { Cue } from "../audio/cues";
import { startRoom, type Running, type StartOptions } from "../game/boot";
import type { Intent } from "../sim/move";
import { choicesOf, lineOf } from "../narrative/dialogue";
import type { Keeper, Quality } from "../save/save";
import { ranked, used, type CipherStyle } from "../sim/cipher";
import { applyKindiRoom, keptAfter, kindiGoals, newKindiRoom, type KindiCommand, type KindiHappened, type KindiState } from "../sim/kindiroom";
import { KindiScene, type KindiSceneHost, type KindiView } from "../scenes/kindi";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;
export interface KindiHost {
  t(key: Key, vars?: Record<string, string | number>): string;
  num(n: number): string;
  lang: string;
  museum: string;
  /** The subject's name, for the heading. */
  title: string;
  style(): CipherStyle;
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
  resume?: KindiState | null;
  keepPlace(snap: unknown | null): void;
}
export interface KindiRoom {
  node: HTMLElement;
  state(): KindiState;
  view(): KindiView;
  command(c: KindiCommand): void;
  /** A key or a controller's press: touch, go on in a talk, move among its choices. */
  press(p: "touch" | "pause" | "next" | "back" | "up" | "down"): void;
  busy(): boolean;
  running(): Running<KindiScene> | null;
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

export function kindiRoom(host: KindiHost): KindiRoom {
  const { t, num } = host;
  const rtl = host.lang === "ar" || host.lang === "ur";
  let state: KindiState = host.resume ?? newKindiRoom(host.style());
  const things = kdrThings(state.cipher.style, rtl);
  let portraits: Record<string, string> = {};
  let run: Running<KindiScene> | null = null;
  let stopped = false;

  const signName = (id: string) => t(`cf_sign_${id}` as Key);
  const markName = (id: string) => t(`cf_mark_${id}` as Key);
  const list = (names: string[]) => names.join(rtl ? "، " : ", ");
  /** What a thing is called: a place by its mark, a token by its sign. */
  const nameOf = (k: KdrThing): string => (k.kind === "slot" ? t("kdr_thing_slot", { mark: markName(k.mark!) }) : k.kind === "token" ? t("kdr_thing_token", { sign: signName(k.sign!) }) : t(k.name as Key));

  const view = (): KindiView => ({ state, done: state.cipher.done });
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
  stage.setAttribute("aria-label", t("kdr_canvas_label"));
  const talkBox = h("div", { class: "talk", hidden: true });
  talkBox.setAttribute("role", "group");
  const stageWrap = h("div", { class: "stage-wrap" }, objective, stage, talkBox);
  const doorPanel = h("section", { class: "door-panel", hidden: true });
  doorPanel.setAttribute("aria-labelledby", "kdr-panel-title");
  const live = h("div", { class: "visually-hidden", role: "status" });
  live.setAttribute("aria-live", "polite");

  // The room in words: what is carried, each mark with its sign, the count boards, the opening, the things.
  const carrying = h("p", { class: "carrying" });
  carrying.setAttribute("aria-live", "polite");
  const progress = h("p", { class: "small" });
  const markLines = h("ul", { class: "marks" });
  const thingList = h("ul", {});
  const ran = h("div", { class: "ran" });
  ran.setAttribute("aria-live", "polite");
  const p = state.cipher.puzzle;
  const table = (caption: string, first: string, rows: { name: string; count: number }[]) =>
    h(
      "table",
      { class: "counts" },
      h("caption", { textContent: caption }),
      h("thead", {}, h("tr", {}, ...[t("cf_th_rank"), first, t("cf_th_count")].map((x) => Object.assign(h("th", { textContent: x }), { scope: "col" })))),
      h("tbody", {}, ...rows.map((r, i) => h("tr", {}, h("td", { textContent: num(i + 1) }), h("td", { textContent: r.name }), h("td", { textContent: num(r.count) })))),
    );
  const tables = h(
    "div",
    { class: "tables" },
    table(t("cf_sample_caption"), t("cf_th_sign"), ranked(p.sample).map((r) => ({ name: signName(r.id), count: r.count }))),
    table(t("cf_message_caption"), t("cf_th_mark"), ranked(p.message).map((r) => ({ name: markName(r.id), count: r.count }))),
  );
  const opening = h("p", { class: "small", textContent: `${t("cf_opening")} ${t("kdr_message_opens", { first: markName(p.message[0]!), second: markName(p.message[1]!) })}` });
  const words = h("section", { class: "room-words" }, h("h2", { textContent: t("alt_title") }), carrying, progress, markLines, opening, tables, thingList, ran);
  const note = h(
    "section",
    {},
    h("h2", { textContent: t("note_title") }),
    h("p", { textContent: t("kdr_note_room") }),
    h("p", { class: "small", textContent: t("art_note") }),
    h("h2", { textContent: t("controls_title") }),
    // The keys only: the workshop's line about touch speaks of tapping a mirror, which this room has not.
    h("p", { class: "small", textContent: t("controls_keys") }),
  );
  const node = h("div", { class: "room" }, heading, stageWrap, doorPanel, h("div", { class: "words" }, words, note), live);

  // ---------------------------------------------------------------------------------------- the picture
  const sceneHost: KindiSceneHost = {
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
    speaking: () => (state.talk ? { who: lineOf(KDR_SCRIPTS, state.talk).who, mood: lineOf(KDR_SCRIPTS, state.talk).mood } : null),
    look: () => ({ quality: host.quality(), reducedMotion: host.reducedMotion(), style: state.cipher.style, keeper: host.keeper() }),
    portraits: (urls) => ((portraits = urls), renderTalk()),
    view,
    rtl,
  };
  const opts: StartOptions = { perf: host.perf, onLost: () => host.toast(t("context_lost")), onRestored: () => redraw() };
  function begin(): void {
    try {
      run = startRoom(canvasBox, sceneHost, host.quality(), opts, "kindi", KindiScene);
    } catch {
      run = null;
      host.toast(t("error_webgl"));
      // Without a picture the secret page is played on its own page, as it was before the room.
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
  function command(c: KindiCommand): void {
    if (stopped) return;
    const before = state;
    const r = applyKindiRoom(state, c);
    state = r.state;
    for (const x of r.happened) react(x);
    run?.scene()?.happened(r.happened);
    // The place is kept by the page quest's own rule, with the beak added (sim/kindiroom.ts keptAfter): one place serves the page and the room.
    const kept = keptAfter(before, state, r.commands);
    if (kept !== undefined) host.keepPlace(kept);
    render();
    if (r.happened.some((x) => x.type === "opened")) end_();
  }
  function react(x: KindiHappened): void {
    if (x.type === "pick" || x.type === "drop") host.sound("line");
    else if (x.type === "assign") {
      if (x.changed) host.sound("line");
      showAssign(x);
    } else if (x.type === "read") showReading();
    else if (x.type === "opened") host.sound("restored");
    else if (x.type === "feather") host.sound("feather");
    else if (x.type === "talk") host.sound("call");
    else if (x.type === "line") host.sound("line");
  }
  /** What the room says after a sign is given or taken away: the page's own words, and whose sign it was if it was taken. */
  function showAssign(x: Extract<KindiHappened, { type: "assign" }>): void {
    ran.replaceChildren(h("p", { textContent: x.sign === null ? t("cf_cleared", { mark: markName(x.mark) }) : t("cf_set", { mark: markName(x.mark), sign: signName(x.sign) }) }));
    if (x.freed.length) ran.append(h("p", { textContent: t("cf_freed", { mark: list(x.freed.map(markName)) }) }));
  }
  /** The page is read: how it failed depends on the way of playing, as on the page. Story names the marks that are wrong, Explorer says how many are right, Challenge says only that it does not read. */
  function showReading(): void {
    const s = state.cipher;
    const last = s.last;
    if (!last) return;
    if (!last.complete) {
      ran.replaceChildren(h("p", { class: "stopped", textContent: t("cf_incomplete", { n: num(used(s.puzzle).filter((m) => s.guess[m] === undefined).length) }) }));
      return;
    }
    if (last.ok) {
      ran.replaceChildren(h("p", { class: "met" }, h("strong", { textContent: t("cf_read_done") })));
      return;
    }
    const text = s.style === "story" ? t("cf_read_story", { list: list(last.wrong.map(markName)) }) : s.style === "explorer" ? t("cf_read_explorer", { right: num(last.right), total: num(last.total) }) : t("cf_read_challenge");
    ran.replaceChildren(h("p", { class: "stopped", textContent: text }));
  }

  function end_(): void {
    host.finish(kindiGoals(state));
    showPanel();
    live.textContent = `${t("cf_who_hudhud")}: ${t("jn_door_lit")}`;
    host.sound("call");
  }
  /** The goals and the museum's note beside the stage, not over it: the bird stays free to walk to the lit door. */
  function showPanel(): void {
    const g = kindiGoals(state);
    const slack = CIPHER_SLACK[state.cipher.style];
    const goal = (mark: string, name: Key, how: string, met: boolean) => h("li", {}, h("span", { class: "mark", textContent: mark }), h("span", {}, h("strong", { textContent: t(name) }), h("br", {}), h("span", { class: "small", textContent: how })), h("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    const names: Key[] = ["cf_rec_person", "cf_rec_method"];
    doorPanel.replaceChildren(
      h("h2", { id: "kdr-panel-title", textContent: t("jn_panel_title"), tabIndex: -1 }),
      h("p", { class: "door-line" }, h("strong", { textContent: `${t("cf_who_hudhud")}: ` }), t("jn_door_lit")),
      h("p", { class: "row" }, h("button", { type: "button", class: "door-go", textContent: t("jn_go_door"), onclick: () => host.through() }), h("button", { type: "button", textContent: t("play_again"), onclick: () => again() }), h("button", { type: "button", textContent: t("btn_atlas"), onclick: () => host.leave() })),
      h("h3", { textContent: t("results_title") }),
      h("p", { textContent: t("cf_fails", { n: num(g.fails) }) }),
      h(
        "ul",
        { class: "goals" },
        goal("✦", "goal_curiosity", t("cf_goal_curiosity_how"), g.curiosity),
        goal("⚙", "goal_ingenuity", slack === null ? t("cf_goal_ingenuity_story") : t("cf_goal_ingenuity_how", { n: num(slack) }), g.ingenuity),
        goal("♥", "goal_kindness", t("cf_goal_kindness_how"), g.kindness),
        goal("❧", "goal_feather", t("cf_goal_feather_how"), g.feather),
      ),
      h(
        "div",
        { class: "note" },
        h("h3", { textContent: t("note_title") }),
        h("p", { textContent: t("cf_note_1") }),
        h("p", { textContent: t("cf_note_2") }),
        h("p", { textContent: t("cf_note_3") }),
        h("p", { textContent: t("cf_note_4") }),
        h("p", { class: "room-note", textContent: t("kdr_note_room") }),
        h("p", { class: "pending", textContent: t("cf_review") }),
        ...CIPHER_RECORDS.map((id, i) => h("p", {}, h("a", { href: `${host.museum}/${host.lang}/${id}/`, textContent: t("note_link", { name: t(names[i]!) }) }))),
      ),
    );
    doorPanel.hidden = false;
  }
  function again(): void {
    state = newKindiRoom(host.style());
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
    const line = lineOf(KDR_SCRIPTS, talk);
    const id = `${talk.script}/${talk.node}/${talk.line}`;
    const text = t(line.key as Key);
    const choices = choicesOf(KDR_SCRIPTS, talk, new Set<string>(state.cipher.flags));
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
    const who = t(`cf_who_${line.who === "keeper" ? "hudhud" : line.who}` as Key);
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
    const face = portraits[line.who as KdrSpeaker];
    talkBox.replaceChildren(face ? h("img", { src: face, alt: "", width: 120, height: 120 }) : h("span", {}), body);
    if (fresh) (choices.length ? (talkBox.querySelector(".choices button") as HTMLElement | null) : next)?.focus({ preventScroll: true });
  }

  /** What a thing's button says: where it goes and, for the bell, the page's own words for what it does. */
  function label(k: KdrThing): string {
    if (k.kind === "bell") return t("kdr_use_btn", { thing: nameOf(k), move: t("cf_read") });
    return t("alt_touch", { thing: nameOf(k) });
  }

  function render(): void {
    renderTalk();
    const s = state.cipher;
    const done = s.done;
    const marks = boardMarks(s.puzzle);
    const given = marks.filter((m) => s.guess[m] !== undefined).length;
    const counts = `${t("cf_given", { n: num(given), total: num(marks.length) })} · ${t("cf_fails", { n: num(s.fails) })}`;
    objective.replaceChildren(t(done ? "kdr_objective_door" : "kdr_objective"), h("small", { textContent: counts }));
    pad.hidden = state.talk !== null;
    stageWrap.classList.toggle("talking", state.talk !== null);
    if (state.talk) prompt.hidden = true;
    const carryText = state.carrying ? t("kdr_carrying", { sign: signName(state.carrying) }) : t("kdr_carrying_none");
    if (carrying.textContent !== carryText) carrying.textContent = carryText;
    progress.textContent = counts;
    markLines.replaceChildren(...marks.map((m) => h("li", { textContent: t("kdr_mark_line", { mark: markName(m), sign: s.guess[m] ? signName(s.guess[m]!) : t("cf_not_yet") }) })));
    // Once the page reads, the list holds one thing: the door.
    if (done) thingList.replaceChildren(h("li", {}, h("button", { type: "button", textContent: t("jn_go_door"), onclick: () => host.through() })));
    else
      thingList.replaceChildren(
        ...things.map((k) => {
          const b = h("button", {
            type: "button",
            textContent: label(k),
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
    busy: () => false,
    running: () => run,
    door: () => {
      const w = run?.scene()?.where() ?? null;
      return { lit: view().done, where: { ...KDR_DOOR }, bird: w ? { x: w.x, y: w.y } : null };
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
