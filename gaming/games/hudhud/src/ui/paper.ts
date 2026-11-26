// The paper of Samarkand's page: a seventh trial quest. It is ordinary page from top to bottom, so that it can be played
// by keyboard, pointer, touch or screen reader alike: a picture of the papermaker's row, one choice for each place, a
// button that makes a sheet, and words for everything that happens. The rules are in sim/chainquest.ts, shared with the
// elephant clock; the steps and the states of the material are in content/paper.ts.
import { PAPER_ART, drawPaper, paperCanvas, paperHit } from "../art/paper";
import { PAPER_RECORDS, PAPER_SLACK, paperPuzzle } from "../content/paper";
import { applyPaper, newPaper, paperGoals, snapshotPaper, type PaperCommand, type PaperFlag, type PaperState, type PaperStyle } from "../sim/paper";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;
export interface PaperHost {
  t(key: Key, vars?: Record<string, string | number>): string;
  num(n: number): string;
  lang: string;
  museum: string;
  /** The subject's name, for the heading. */
  title: string;
  style(): PaperStyle;
  reducedMotion(): boolean;
  /** A small sound for a step of the run, and one for the end. Neither needs a caption: the page says both in words. */
  tick(): void;
  chime(): void;
  /** The quest is finished: its goals are written into the save. */
  finish(r: { turns: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean }): void;
  leave(): void;
  /** A quest put back from what was kept, to go on from; null or absent for a new one. */
  resume?: PaperState | null;
  /** The quest changed in a way worth keeping (its snapshot), or it is finished or started again (null). */
  keepPlace?(snap: unknown | null): void;
}
export interface PaperQuest {
  node: HTMLElement;
  state(): PaperState;
  command(c: PaperCommand): void;
  /** True while a run is being shown step by step. */
  busy(): boolean;
  /** The place chosen on the picture, or null. */
  selected(): number | null;
  /** What the page says under the picture about the place chosen. */
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
/** A card's or a state's id as the tail of a string key: `clean-bleach` is `clean_bleach`. */
const tail = (id: string): string => id.replace(/-/g, "_");

export function paperQuest(host: PaperHost): PaperQuest {
  const { t, num } = host;
  const rtl = host.lang === "ar" || host.lang === "ur";
  let state = host.resume ?? newPaper(host.style(), paperPuzzle(host.style()));
  let selected: number | null = null; // the place chosen on the picture
  let shown = 0; // how many steps of the last run have been shown
  let timer = 0;
  let running = false;
  let answered = state.flags.includes("answered") || state.flags.includes("kind"); // the child has been answered, kindly or not

  const card = (id: string) => t(`pp_part_${tail(id)}` as Key);

  const heading = h("h2", { textContent: host.title, tabIndex: -1 });
  const objective = h("p", { class: "objective-line", textContent: t("pp_objective") });
  const moves = h("p", { class: "small" });
  const canvas = paperCanvas();
  canvas.className = "paper-art";
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", t("pp_picture", { n: num(state.puzzle.places.length) }));
  canvas.style.cursor = "pointer";
  canvas.style.touchAction = "manipulation";
  const tapHint = h("p", { class: "small" });
  tapHint.setAttribute("aria-live", "polite");
  const places = h("ol", { class: "places paper-places" });
  const go = h("button", { type: "button", class: "primary", textContent: t("pp_go"), onclick: () => command({ type: "go" }) });
  const story = h("div", { class: "ran" });
  story.setAttribute("aria-live", "polite");
  const said = h("div", { class: "said" });
  said.setAttribute("aria-live", "polite");
  const asks = h("p", { class: "row" });
  const results = h("section", { class: "results", hidden: true });

  const say = (who: "hudhud" | "maker" | "child" | "narrator", key: Key, ...more: Node[]) => {
    said.append(h("p", { class: `by-${who}` }, h("strong", { textContent: `${t(`pp_who_${who}` as Key)}: ` }), t(key), ...more));
    while (said.children.length > 7) said.firstChild?.remove();
  };
  const flag = (f: PaperFlag) => command({ type: "flag", flag: f });

  function drawAsks(): void {
    const has = (f: PaperFlag) => state.flags.includes(f);
    asks.replaceChildren(
      h("button", { type: "button", textContent: t("pp_ask_story"), onclick: () => (say("narrator", "pp_story_1"), flag("askedStory")) }),
      h("button", { type: "button", textContent: t("pp_ask_how"), onclick: () => (say("narrator", "pp_how_1"), flag("askedHow")) }),
      h("button", {
        type: "button",
        textContent: t("pp_talk_child"),
        disabled: answered,
        onclick: () => {
          const answer = (kind: boolean) => () => {
            answered = true;
            choices.remove();
            say("hudhud", kind ? "pp_child_kind" : "pp_child_blunt");
            say("child", kind ? "pp_child_kind_r" : "pp_child_blunt_r");
            // Either answer is kept, so that a resume does not ask the child again; only the kind one is a goal.
            if (kind) flag("kind");
            flag("answered");
          };
          const choices = h("span", { class: "row" }, h("button", { type: "button", textContent: t("pp_child_kind"), onclick: answer(true) }), h("button", { type: "button", textContent: t("pp_child_blunt"), onclick: answer(false) }));
          say("child", "pp_child_1", choices);
          (choices.firstChild as HTMLElement).focus({ preventScroll: true });
        },
      }),
      h("button", { type: "button", textContent: t("pp_look_feather"), onclick: () => (say("hudhud", has("feather") ? "pp_feather_again" : "pp_feather_1"), flag("feather")) }),
    );
  }

  function draw(): void {
    const p = state.puzzle;
    const focused = document.activeElement instanceof HTMLSelectElement ? Number(document.activeElement.dataset.place) : -1;
    places.replaceChildren(
      ...p.places.map((id, i) => {
        const select = h("select", { disabled: running || state.done, onchange: () => command({ type: "put", place: i, part: select.value }) });
        select.dataset.place = String(i);
        for (const x of p.parts) select.append(h("option", { value: x.id, textContent: card(x.id), selected: x.id === id }));
        return h("li", {}, h("label", {}, h("span", { textContent: `${t("pp_place", { n: num(i + 1) })} ` }), select));
      }),
    );
    if (focused >= 0) (places.querySelector(`select[data-place="${focused}"]`) as HTMLElement | null)?.focus({ preventScroll: true });
    moves.textContent = t("pp_moves", { n: num(state.moves) });
    go.disabled = running || state.done;
    if (selected !== null && (running || state.done)) selected = null;
    tapHint.textContent = selected === null ? t("pp_tap_hint") : t("pp_chosen", { n: num(selected + 1) });
    const last = state.last;
    drawPaper(canvas, {
      places: p.places,
      made: last ? last.moved.map((m) => p.parts.find((x) => x.id === m.part)!.gives) : [],
      lit: last ? Math.min(shown, last.moved.length) : 0,
      stopped: last && last.end !== "done" && !running ? last.at : null,
      done: state.done && !running,
      rtl,
      selected,
    });
    drawAsks();
  }

  /** A touch or click on the picture: choose a place, then exchange it with another. */
  canvas.addEventListener("click", (e) => {
    if (running || state.done) return;
    const r = canvas.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const hit = paperHit(((e.clientX - r.left) / r.width) * PAPER_ART.w, ((e.clientY - r.top) / r.height) * PAPER_ART.h, state.puzzle.places.length, rtl);
    if (hit === null) return;
    if (selected === hit) selected = null;
    else if (selected === null) selected = hit;
    else {
      const other = state.puzzle.places[hit];
      const place = selected;
      selected = null;
      if (other) command({ type: "put", place, part: other });
    }
    draw();
  });

  /** Shows the last run: one sentence for each card that worked, then how it ended. */
  function showRun(): void {
    const last = state.last;
    if (!last) return;
    story.replaceChildren();
    shown = 0;
    running = true;
    const step = () => {
      if (shown < last.moved.length) {
        story.append(h("p", { textContent: t(`pp_did_${tail(last.moved[shown]!.part)}` as Key) }));
        shown++;
        host.tick();
        draw();
        timer = window.setTimeout(step, host.reducedMotion() ? 0 : 750);
        return;
      }
      running = false;
      story.append(h("p", { class: last.end === "done" ? "met" : "stopped" }, h("strong", { textContent: last.end === "done" ? t("pp_end_done") : t("pp_end_idle", { n: num(last.at + 1) }) })));
      // How much a failed run explains depends on the way of playing: Story says what the place needs, Explorer what
      // reached it, Challenge nothing more than where it stopped.
      if (last.end !== "done") {
        const what = t(`pp_kind_${tail(last.carrying)}` as Key);
        if (state.style === "story") story.append(h("p", { textContent: t("pp_needs", { what }) }));
        else if (state.style === "explorer") story.append(h("p", { textContent: t("pp_reached", { what }) }));
      }
      if (state.done) end_();
      draw();
    };
    step();
  }

  function end_(): void {
    host.chime();
    say("hudhud", "pp_done_1");
    const slack = PAPER_SLACK[state.style];
    const g = paperGoals(state, slack);
    host.finish(g);
    const goal = (mark: string, name: Key, how: string, met: boolean) => h("li", {}, h("span", { class: "mark", textContent: mark }), h("span", {}, h("strong", { textContent: t(name) }), h("br", {}), h("span", { class: "small", textContent: how })), h("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    const names: Key[] = ["pp_rec_paper", "pp_rec_place"];
    const title = h("h3", { textContent: t("results_title"), tabIndex: -1 });
    results.replaceChildren(
      title,
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
        h("p", { class: "pending", textContent: t("pp_review") }),
        ...PAPER_RECORDS.map((id, i) => h("p", {}, h("a", { href: `${host.museum}/${host.lang}/${id}/`, textContent: t("note_link", { name: t(names[i]!) }) }))),
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
    state = newPaper(host.style(), paperPuzzle(host.style()));
    selected = null;
    host.keepPlace?.(null);
    story.replaceChildren();
    said.replaceChildren();
    results.hidden = true;
    results.replaceChildren();
    say("hudhud", "pp_intro_1");
    say("maker", "pp_intro_2");
    draw();
    heading.focus({ preventScroll: true });
  }

  function command(c: PaperCommand): void {
    if (running) return;
    const before = state;
    state = applyPaper(state, c);
    if (state === before) return;
    if (c.type === "put") {
      story.replaceChildren();
      shown = 0;
      host.tick();
    }
    if (c.type !== "go") host.keepPlace?.(state.moves > 0 || state.flags.length > 0 ? snapshotPaper(state) : null);
    if (c.type === "go") showRun();
    else draw();
  }

  const node = h("div", { class: "bench-inner" }, heading, h("p", { class: "small", textContent: t("pp_trial") }), objective, canvas, tapHint, moves, places, h("p", {}, go), story, said, asks, results);
  say("hudhud", "pp_intro_1");
  say("maker", "pp_intro_2");
  draw();
  return { node, state: () => state, command, busy: () => running, selected: () => selected, status: () => tapHint.textContent ?? "", stop: () => window.clearTimeout(timer) };
}
