// The elephant clock's page: a first trial of a second quest. It is ordinary page from top to bottom, so that it can
// be played by keyboard, pointer, touch or screen reader alike: a picture of the bench, one choice for each place, a
// button that sets the clock going, and words for everything that happens. The rules are in sim/clock.ts.
import { benchCanvas, benchHit, BENCH, drawBench } from "../art/bench";
import { CLOCK_RECORDS, CLOCK_SLACK, clockPuzzle } from "../content/clock";
import { spare } from "../sim/chain";
import { applyClock, clockGoals, newClock, snapshotClock, type ClockCommand, type ClockFlag, type ClockState, type ClockStyle } from "../sim/clock";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;
export interface ClockHost {
  t(key: Key, vars?: Record<string, string | number>): string;
  num(n: number): string;
  lang: string;
  museum: string;
  /** The subject's name, for the heading. */
  title: string;
  style(): ClockStyle;
  reducedMotion(): boolean;
  /** A small sound for a step of the run, and one for the end. Neither needs a caption: the page says both in words. */
  tick(): void;
  chime(): void;
  /** The quest is finished: its goals are written into the save. */
  finish(r: { turns: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean }): void;
  leave(): void;
  /** A clock put back from what was kept, to go on from; null or absent for a new one. */
  resume?: ClockState | null;
  /** The clock changed in a way worth keeping (its snapshot), or it is finished or started again (null). */
  keepPlace?(snap: unknown | null): void;
}
export interface ClockQuest {
  node: HTMLElement;
  state(): ClockState;
  command(c: ClockCommand): void;
  /** True while a run is being shown step by step. */
  busy(): boolean;
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

export function clockQuest(host: ClockHost): ClockQuest {
  const { t, num } = host;
  let state = host.resume ?? newClock(host.style(), clockPuzzle(host.style()));
  let selected: number | null = null; // the place chosen on the picture
  let shown = 0; // how many steps of the last run have been shown
  let timer = 0;
  let running = false;
  let answered = state.flags.includes("answered") || state.flags.includes("kind"); // the apprentice has been answered, kindly or not

  const part = (id: string | null) => (id ? t(`ck_part_${id}` as Key) : t("ck_empty"));
  const list = (ids: string[]) => ids.map(part).join(host.lang === "ar" || host.lang === "ur" ? "، " : ", ");

  const heading = h("h2", { textContent: host.title, tabIndex: -1 });
  const objective = h("p", { class: "objective-line", textContent: t("ck_objective") });
  const moves = h("p", { class: "small" });
  const canvas = benchCanvas();
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", t("ck_picture"));
  canvas.style.cursor = "pointer";
  canvas.style.touchAction = "manipulation";
  const tapHint = h("p", { class: "small" });
  tapHint.setAttribute("aria-live", "polite");
  const places = h("ol", { class: "places" });
  const spareLine = h("p", { class: "small" });
  const go = h("button", { type: "button", class: "primary", textContent: t("ck_go"), onclick: () => command({ type: "go" }) });
  const story = h("div", { class: "ran" });
  story.setAttribute("aria-live", "polite");
  const said = h("div", { class: "said" });
  said.setAttribute("aria-live", "polite");
  const asks = h("p", { class: "row" });
  const results = h("section", { class: "results", hidden: true });

  const say = (who: "hudhud" | "jazari" | "apprentice" | "narrator", key: Key, ...more: Node[]) => {
    said.append(h("p", { class: `by-${who}` }, h("strong", { textContent: `${t(`ck_who_${who}` as Key)}: ` }), t(key), ...more));
    while (said.children.length > 7) said.firstChild?.remove();
  };
  const flag = (f: ClockFlag) => command({ type: "flag", flag: f });

  function drawAsks(): void {
    const has = (f: ClockFlag) => state.flags.includes(f);
    asks.replaceChildren(
      h("button", { type: "button", textContent: t("ck_ask_float"), onclick: () => (say("narrator", "ck_float_1"), flag("askedFloat")) }),
      h("button", { type: "button", textContent: t("ck_ask_balls"), onclick: () => (say("narrator", "ck_balls_1"), flag("askedBalls")) }),
      h("button", {
        type: "button",
        textContent: t("ck_talk_apprentice"),
        disabled: answered,
        onclick: () => {
          const answer = (kind: boolean) => () => {
            answered = true;
            choices.remove();
            say("hudhud", kind ? "ck_app_kind" : "ck_app_blunt");
            say("apprentice", kind ? "ck_app_kind_r" : "ck_app_blunt_r");
            // Either answer is kept, so that a resume does not ask him again; only the kind one is a goal.
            if (kind) flag("kind");
            flag("answered");
          };
          const choices = h("span", { class: "row" }, h("button", { type: "button", textContent: t("ck_app_kind"), onclick: answer(true) }), h("button", { type: "button", textContent: t("ck_app_blunt"), onclick: answer(false) }));
          say("apprentice", "ck_app_1", choices);
          (choices.firstChild as HTMLElement).focus({ preventScroll: true });
        },
      }),
      h("button", { type: "button", textContent: t("ck_look_box"), onclick: () => (say("hudhud", has("feather") ? "ck_box_again" : "ck_box_1"), flag("feather")) }),
    );
  }

  function draw(): void {
    const p = state.puzzle;
    const focused = document.activeElement instanceof HTMLSelectElement ? Number(document.activeElement.dataset.place) : -1;
    places.replaceChildren(
      ...p.places.map((id, i) => {
        const select = h("select", { disabled: running || state.done, onchange: () => command({ type: "put", place: i, part: select.value }) });
        select.dataset.place = String(i);
        if (id === null) select.append(h("option", { value: "", textContent: t("ck_empty"), selected: true }));
        // The choices are listed by their names in the page's language, never in the order that solves the row.
        const byName = [...p.parts].sort((a, b) => part(a.id).localeCompare(part(b.id), host.lang));
        for (const x of byName) select.append(h("option", { value: x.id, textContent: part(x.id), selected: x.id === id }));
        return h("li", {}, h("label", {}, h("span", { textContent: `${t("ck_place", { n: num(i + 1) })} ` }), select));
      }),
    );
    if (focused >= 0) (places.querySelector(`select[data-place="${focused}"]`) as HTMLElement | null)?.focus({ preventScroll: true });
    const lying = spare(p).map((x) => x.id);
    spareLine.textContent = lying.length ? t("ck_spare", { list: list(lying) }) : t("ck_spare_none");
    moves.textContent = t("ck_moves", { n: num(state.moves) });
    go.disabled = running || state.done;
    if (selected !== null && (running || state.done)) selected = null;
    tapHint.textContent = selected === null ? t("ck_tap_hint") : t("ck_chosen", { n: num(selected + 1) });
    const last = state.last;
    drawBench(canvas, { selected, places: p.places, spare: lying, lit: last ? Math.min(shown, last.moved.length) : 0, stopped: last && last.end !== "done" && !running ? last.at : null, done: state.done && !running, rtl: host.lang === "ar" || host.lang === "ur" });
    drawAsks();
  }

  /** A touch or click on the picture: choose a place, then exchange it with another or stand a spare part in it. */
  canvas.addEventListener("click", (e) => {
    if (running || state.done) return;
    const r = canvas.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const hit = benchHit(((e.clientX - r.left) / r.width) * BENCH.w, ((e.clientY - r.top) / r.height) * BENCH.h, host.lang === "ar" || host.lang === "ur", spare(state.puzzle).length);
    if (!hit) return;
    if ("spare" in hit) {
      const part = spare(state.puzzle)[hit.spare]?.id;
      if (selected !== null && part) {
        const place = selected;
        selected = null;
        command({ type: "put", place, part });
        draw();
      }
      return;
    }
    if (selected === hit.place) selected = null;
    else if (selected === null) selected = hit.place;
    else {
      const other = state.puzzle.places[hit.place];
      const place = selected;
      // An empty place has nothing to exchange: the choice moves there instead.
      if (other) {
        selected = null;
        command({ type: "put", place, part: other });
      } else selected = hit.place;
    }
    draw();
  });

  /** Shows the last run: one sentence for each part that moved, then how it ended. */
  function showRun(): void {
    const last = state.last;
    if (!last) return;
    story.replaceChildren();
    shown = 0;
    running = true;
    const step = () => {
      if (shown < last.moved.length) {
        story.append(h("p", { textContent: t(`ck_did_${last.moved[shown]!.part}` as Key) }));
        shown++;
        host.tick();
        draw();
        timer = window.setTimeout(step, host.reducedMotion() ? 0 : 750);
        return;
      }
      running = false;
      const n = num(last.at + 1);
      const end: Key = last.end === "done" ? "ck_end_done" : last.end === "empty" ? "ck_end_empty" : last.end === "idle" ? "ck_end_idle" : "ck_end_wrong";
      story.append(h("p", { class: last.end === "done" ? "met" : "stopped" }, h("strong", { textContent: t(end, { n }) })));
      // How much a failed run explains depends on the way of playing: Story says what the place needs, Explorer what
      // reached it, Challenge nothing more than where it stopped.
      if (last.end === "empty" || last.end === "idle") {
        const what = t(`ck_kind_${last.carrying}` as Key);
        if (state.style === "story") story.append(h("p", { textContent: t("ck_needs", { what }) }));
        else if (state.style === "explorer") story.append(h("p", { textContent: t("ck_reached", { what }) }));
      }
      if (state.done) end_();
      draw();
    };
    step();
  }

  function end_(): void {
    host.chime();
    say("hudhud", "ck_done_1");
    const slack = CLOCK_SLACK[state.style];
    const g = clockGoals(state, slack);
    host.finish(g);
    const goal = (mark: string, name: Key, how: string, met: boolean) => h("li", {}, h("span", { class: "mark", textContent: mark }), h("span", {}, h("strong", { textContent: t(name) }), h("br", {}), h("span", { class: "small", textContent: how })), h("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    const names: Key[] = ["ck_rec_person", "ck_rec_clock"];
    const title = h("h3", { textContent: t("results_title"), tabIndex: -1 });
    results.replaceChildren(
      title,
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
        h("p", { class: "pending", textContent: t("ck_review") }),
        ...CLOCK_RECORDS.map((id, i) => h("p", {}, h("a", { href: `${host.museum}/${host.lang}/${id}/`, textContent: t("note_link", { name: t(names[i]!) }) }))),
      ),
      h("p", { class: "row" }, h("button", { type: "button", class: "primary", textContent: t("btn_atlas"), onclick: () => host.leave() }), h("button", { type: "button", textContent: t("play_again"), onclick: () => again() })),
    );
    results.hidden = false;
    title.focus({ preventScroll: false });
  }

  function again(): void {
    window.clearTimeout(timer);
    running = false;
    answered = false;
    shown = 0;
    state = newClock(host.style(), clockPuzzle(host.style()));
    selected = null;
    host.keepPlace?.(null);
    story.replaceChildren();
    said.replaceChildren();
    results.hidden = true;
    results.replaceChildren();
    say("hudhud", "ck_intro_1");
    say("jazari", "ck_intro_2");
    draw();
    heading.focus({ preventScroll: true });
  }

  function command(c: ClockCommand): void {
    if (running) return;
    const before = state;
    state = applyClock(state, c);
    if (state === before) return;
    if (c.type === "put") {
      story.replaceChildren();
      shown = 0;
      host.tick();
    }
    if (c.type !== "go") host.keepPlace?.(state.moves > 0 || state.flags.length > 0 ? snapshotClock(state) : null);
    if (c.type === "go") showRun();
    else draw();
  }

  const node = h("div", { class: "bench-inner" }, heading, h("p", { class: "small", textContent: t("ck_trial") }), objective, canvas, tapHint, moves, places, spareLine, h("p", {}, go), story, said, asks, results);
  say("hudhud", "ck_intro_1");
  say("jazari", "ck_intro_2");
  draw();
  return { node, state: () => state, command, busy: () => running, stop: () => window.clearTimeout(timer) };
}
