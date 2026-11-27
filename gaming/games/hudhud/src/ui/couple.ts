// Al-Tusi's page: a ninth trial quest, two circles to be set turning so that a point traces a straight line. It is ordinary
// page from top to bottom, so that it can be played by keyboard, pointer, touch or screen reader alike: a picture of the
// two circles, groups of radio buttons for what can be chosen (each with its visible label), one button that turns the
// circles, and words for what the point traced. The rules are in sim/couple.ts; what each way of playing offers is in
// content/couple.ts. The picture has nothing in it that runs left to right, so it is never mirrored on a page that reads
// right to left; the controls and the words are ordinary page and follow the page's direction.
//
// The turning may be shown as a short animation (the small circle going round while the path grows). That is the page's:
// the rules have already worked the path out and measured it when the button is pressed, and the animation only shows
// it. It can be skipped, and when reduced motion is on the finished path is drawn at once.
import { coupleCanvas, drawCouple } from "../art/couple";
import { COUPLE_RECORDS, coupleOffer } from "../content/couple";
import { COUPLE_SLACK, SIZES, applyCouple, coupleGoals, newCouple, snapshotCouple, trace, type CoupleCommand, type CoupleFlag, type CoupleState, type CoupleStyle, type Shape } from "../sim/couple";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;
export interface CoupleHost {
  t(key: Key, vars?: Record<string, string | number>): string;
  num(n: number): string;
  lang: string;
  museum: string;
  /** The subject's name, for the heading. */
  title: string;
  style(): CoupleStyle;
  reducedMotion(): boolean;
  /** A small sound for a turning, and one for the end. Neither needs a caption: the page says both in words. */
  tick(): void;
  chime(): void;
  /** The quest is finished: its goals are written into the save. */
  finish(r: { turns: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean }): void;
  leave(): void;
  /** A quest put back from what was kept, to go on from; null or absent for a new one. */
  resume?: CoupleState | null;
  /** The quest changed in a way worth keeping (its snapshot), or it is finished or started again (null). */
  keepPlace?(snap: unknown | null): void;
}
export interface CoupleQuest {
  node: HTMLElement;
  state(): CoupleState;
  command(c: CoupleCommand): void;
  /** True while a turning is being shown. */
  busy(): boolean;
  /** What the page says under the picture about the last turning. */
  status(): string;
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

/** Points traced for the picture: the rules measure the same path with their own count of points. */
const POINTS = 360;
/** How long the turning is shown, in milliseconds, when motion is allowed. */
const TURNING_MS = 2400;

export function coupleQuest(host: CoupleHost): CoupleQuest {
  const { t, num } = host;
  let state = host.resume ?? newCouple(host.style(), coupleOffer(host.style()));
  let answered = state.flags.includes("answered") || state.flags.includes("kind"); // the girl has been answered, kindly or not
  let turning = false;
  let timer = 0;

  const heading = h("h2", { textContent: host.title, tabIndex: -1 });
  const objective = h("p", { class: "objective-line", textContent: t("ts_objective") });
  const progress = h("p", { class: "small" });
  const canvas = coupleCanvas();
  canvas.className = "couple-art";
  canvas.setAttribute("role", "img");
  const ran = h("div", { class: "ran" });
  ran.setAttribute("aria-live", "polite");
  const said = h("div", { class: "said" });
  said.setAttribute("aria-live", "polite");
  const asks = h("p", { class: "row" });
  const results = h("section", { class: "results", hidden: true });

  const say = (who: "hudhud" | "tusi" | "girl" | "narrator", key: Key, ...more: Node[]) => {
    said.append(h("p", { class: `by-${who}` }, h("strong", { textContent: `${t(`ts_who_${who}` as Key)}: ` }), t(key), ...more));
    while (said.children.length > 7) said.firstChild?.remove();
  };
  const flag = (f: CoupleFlag) => command({ type: "flag", flag: f });

  /** The words for a measured shape: a noun phrase with its article, for the sentence and for the picture's description. */
  const shapeKey = (s: Shape): Key => (s.kind === "line" ? "ts_shape_line" : s.kind === "circle" ? "ts_shape_circle" : s.kind === "oval" ? "ts_shape_oval" : s.crossings === 0 ? "ts_shape_cusp" : s.lobes === 1 ? "ts_shape_loop" : "ts_shape_loops");
  const shapeName = (s: Shape) => t(shapeKey(s), { n: num(s.lobes) });

  // The choices, as groups of radio buttons made once for what the way of playing offers. A group with one value to
  // choose is not shown: that value is a fact of the way of playing, not a choice.
  type Group = { field: "size" | "speed" | "dir"; box: HTMLFieldSetElement; radios: { value: number; input: HTMLInputElement }[] };
  const sizeKey = (r: number): Key => (["ts_size_third", "ts_size_half", "ts_size_twothirds"] as const)[SIZES.findIndex((x) => x === r)]!;
  const makeGroup = (field: Group["field"], legend: Key, values: number[], name: (v: number) => Key): Group => {
    const box = h("fieldset", { class: "couple-group" }, h("legend", { textContent: t(legend) }));
    const radios = values.map((value) => {
      const input = h("input", { type: "radio", name: `couple-${field}`, value: String(value), onchange: () => command({ type: "set", field, value }) });
      input.dataset.field = field;
      input.dataset.value = String(value);
      box.append(h("label", {}, input, h("span", { textContent: t(name(value)) })));
      return { value, input };
    });
    box.hidden = values.length < 2;
    return { field, box, radios };
  };
  const o = state.offer;
  const groups: Group[] = [
    makeGroup("dir", "ts_dir_legend", o.dirs, (d) => (d === 1 ? "ts_dir_same" : "ts_dir_other")),
    makeGroup("speed", "ts_speed_legend", o.speeds, (k) => `ts_speed_${k}` as Key),
    makeGroup("size", "ts_size_legend", o.sizes, sizeKey),
  ];
  const turnBtn = h("button", { type: "button", class: "primary", textContent: t("ts_turn"), onclick: () => command({ type: "turn" }) });
  const skipBtn = h("button", { type: "button", textContent: t("ts_skip"), hidden: true, onclick: () => finishTurning() });
  const controls = h("div", { class: "couple-controls" }, ...groups.map((g) => g.box));

  function drawAsks(): void {
    const has = (f: CoupleFlag) => state.flags.includes(f);
    const stillTurning = turning;
    asks.replaceChildren(
      h("button", { type: "button", disabled: stillTurning, textContent: t("ts_ask_why"), onclick: () => (say("narrator", "ts_why_1"), flag("askedWhy")) }),
      h("button", { type: "button", disabled: stillTurning, textContent: t("ts_ask_obs"), onclick: () => (say("narrator", "ts_obs_1"), flag("askedObs")) }),
      h("button", {
        type: "button",
        textContent: t("ts_talk_girl"),
        disabled: answered || stillTurning,
        onclick: () => {
          const answer = (kind: boolean) => () => {
            answered = true;
            choices.remove();
            say("hudhud", kind ? "ts_girl_kind" : "ts_girl_blunt");
            say("girl", kind ? "ts_girl_kind_r" : "ts_girl_blunt_r");
            // Either answer is kept, so that a resume does not ask the girl again; only the kind one is a goal.
            if (kind) flag("kind");
            flag("answered");
          };
          const choices = h("span", { class: "row" }, h("button", { type: "button", textContent: t("ts_girl_kind"), onclick: answer(true) }), h("button", { type: "button", textContent: t("ts_girl_blunt"), onclick: answer(false) }));
          say("girl", "ts_girl_1", choices);
          (choices.firstChild as HTMLElement).focus({ preventScroll: true });
        },
      }),
      h("button", { type: "button", disabled: stillTurning, textContent: t("ts_look_feather"), onclick: () => (say("hudhud", has("feather") ? "ts_feather_again" : "ts_feather_1"), flag("feather")) }),
    );
  }

  /** The picture at rest: the circles at their start and, after a turning, the whole path. */
  function draw(): void {
    const shown = state.last;
    drawCouple(canvas, { setting: shown ? shown.setting : state.setting, theta: 0, path: shown ? trace(shown.setting, POINTS) : null, closed: true });
    canvas.setAttribute("aria-label", shown ? t("ts_picture_path", { shape: shapeName(shown.shape) }) : t("ts_picture"));
    for (const g of groups) {
      const current = g.field === "size" ? state.setting.r : g.field === "speed" ? state.setting.k : state.setting.d;
      for (const r of g.radios) {
        r.input.checked = r.value === current;
        r.input.disabled = state.done || turning;
      }
    }
    turnBtn.disabled = state.done || turning;
    skipBtn.hidden = !turning;
    progress.textContent = `${t("ts_turns", { n: num(state.turned) })} · ${t("ts_misses", { n: num(state.misses) })}`;
    drawAsks();
  }

  /** The words for the last turning, in the polite region under the picture. What they say depends on the way of playing. */
  function tell(): void {
    const last = state.last;
    if (!last) return;
    if (state.done) {
      ran.replaceChildren(h("p", { class: "met", textContent: t("ts_traced_line") }), h("p", {}, h("strong", { textContent: t("ts_end_done") })));
      return;
    }
    const traced = h("p", { class: "stopped", textContent: t("ts_traced", { shape: shapeName(last.shape) }) });
    // Story names the shape and says which way to try; Explorer names the shape; Challenge says only that it is not a line (the picture shows it).
    if (state.style === "story") ran.replaceChildren(traced, h("p", { class: "stopped", textContent: t("ts_miss_story") }));
    else if (state.style === "explorer") ran.replaceChildren(traced);
    else ran.replaceChildren(h("p", { class: "stopped", textContent: t("ts_miss_challenge") }));
  }

  /** The turning is over (it ran to its end, or was skipped): the path is drawn whole and what it was is said. */
  function finishTurning(): void {
    window.clearTimeout(timer);
    turning = false;
    draw();
    tell();
    if (state.done) end_();
    else turnBtn.focus({ preventScroll: true });
  }

  /** Shows the turning: the small circle goes round while the path grows. The rules have already measured the path. */
  function animate(): void {
    const last = state.last;
    if (!last) return;
    const path = trace(last.setting, POINTS);
    turning = true;
    ran.replaceChildren(h("p", { textContent: t("ts_turning") }));
    draw();
    skipBtn.focus({ preventScroll: true });
    const began = performance.now();
    const frame = () => {
      const p = Math.min(1, (performance.now() - began) / TURNING_MS);
      if (p >= 1) return finishTurning();
      drawCouple(canvas, { setting: last.setting, theta: 2 * Math.PI * p, path: path.slice(0, Math.max(2, Math.floor(p * POINTS) + 1)), closed: false });
      timer = window.setTimeout(frame, 16);
    };
    frame();
  }

  function end_(): void {
    host.chime();
    say("hudhud", "ts_done_1");
    const slack = COUPLE_SLACK[state.style];
    const g = coupleGoals(state, slack);
    host.finish(g);
    const goal = (mark: string, nameKey: Key, how: string, met: boolean) => h("li", {}, h("span", { class: "mark", textContent: mark }), h("span", {}, h("strong", { textContent: t(nameKey) }), h("br", {}), h("span", { class: "small", textContent: how })), h("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    const names: Key[] = ["ts_rec_person", "ts_rec_obs"];
    const title = h("h3", { textContent: t("results_title"), tabIndex: -1 });
    results.replaceChildren(
      title,
      h("p", { textContent: t("ts_turns", { n: num(state.turned) }) }),
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
        h("p", { class: "pending", textContent: t("ts_review") }),
        ...COUPLE_RECORDS.map((id, i) => h("p", {}, h("a", { href: `${host.museum}/${host.lang}/${id}/`, textContent: t("note_link", { name: t(names[i]!) }) }))),
      ),
      h("p", { class: "row" }, h("button", { type: "button", class: "primary", textContent: t("btn_atlas"), onclick: () => host.leave() }), h("button", { type: "button", textContent: t("play_again"), onclick: () => again() })),
    );
    results.hidden = false;
    title.focus({ preventScroll: false });
  }

  function again(): void {
    window.clearTimeout(timer);
    turning = false;
    answered = false;
    state = newCouple(host.style(), coupleOffer(host.style()));
    host.keepPlace?.(null);
    ran.replaceChildren();
    said.replaceChildren();
    results.hidden = true;
    results.replaceChildren();
    say("hudhud", "ts_intro_1");
    say("tusi", "ts_intro_2");
    draw();
    heading.focus({ preventScroll: true });
  }

  function command(c: CoupleCommand): void {
    if (turning) return;
    const before = state;
    state = applyCouple(state, c);
    if (state === before) return;
    if (c.type === "turn") {
      host.tick();
      // The state is kept as it was set, before the turning is shown: a quest left in the middle comes back set, not finished.
      if (!state.done) host.keepPlace?.(snapshotCouple(state));
      if (host.reducedMotion()) {
        draw();
        finishTurning();
      } else animate();
      return;
    }
    if (c.type === "set") ran.replaceChildren();
    host.keepPlace?.(state.turned > 0 || state.flags.length > 0 ? snapshotCouple(state) : null);
    draw();
  }

  const node = h(
    "div",
    { class: "bench-inner" },
    heading,
    h("p", { class: "small", textContent: t("ts_trial") }),
    objective,
    canvas,
    progress,
    controls,
    h("p", { class: "row" }, turnBtn, skipBtn),
    ran,
    said,
    asks,
    results,
  );
  say("hudhud", "ts_intro_1");
  say("tusi", "ts_intro_2");
  draw();
  return { node, state: () => state, command, busy: () => turning, status: () => ran.textContent ?? "", stop: () => window.clearTimeout(timer) };
}
