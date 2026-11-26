// The locked box's page: a fourth trial quest. It is ordinary page from top to bottom, so that it can be played by
// keyboard, pointer, touch or screen reader alike: a picture of two trays, the problem said in words at every step,
// a button for each move, and words for everything that happens. The rules are in sim/algebra.ts. Playing on the
// picture itself is not built in this trial: the buttons are the way to play.
import { algebraCanvas, drawAlgebra } from "../art/algebra";
import { ALGEBRA_RECORDS, ALGEBRA_SLACK, algebraStart, amountWords, equationWords } from "../content/algebra";
import { ALL_MOVES, algebraGoals, applyAlgebra, available, fewest, moveName, newAlgebra, snapshotAlgebra, type AlgebraCommand, type AlgebraFlag, type AlgebraState, type AlgebraStyle, type Move } from "../sim/algebra";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;
export interface AlgebraHost {
  t(key: Key, vars?: Record<string, string | number>): string;
  num(n: number): string;
  lang: string;
  museum: string;
  /** The subject's name, for the heading. */
  title: string;
  style(): AlgebraStyle;
  /** A small sound for a move that worked, and one for the end. Neither needs a caption: the page says both in words. */
  tick(): void;
  chime(): void;
  /** The quest is finished: its goals are written into the save. */
  finish(r: { turns: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean }): void;
  leave(): void;
  /** A box put back from what was kept, to go on from; null or absent for a new one. */
  resume?: AlgebraState | null;
  /** The box changed in a way worth keeping (its snapshot), or it is finished or started again (null). */
  keepPlace?(snap: unknown | null): void;
}
export interface AlgebraQuest {
  node: HTMLElement;
  state(): AlgebraState;
  command(c: AlgebraCommand): void;
  /** The problem as the page says it now, in words. */
  sentence(): string;
  /** Always false: nothing here is shown step by step. Kept so that every quest on a page has the same shape. */
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

export function algebraQuest(host: AlgebraHost): AlgebraQuest {
  const { t, num } = host;
  const rtl = host.lang === "ar" || host.lang === "ur";
  let state = host.resume ?? newAlgebra(host.style(), algebraStart(host.style()));
  let answered = state.flags.includes("answered") || state.flags.includes("kind"); // the child has been answered, kindly or not

  const say_ = (key: string, vars?: Record<string, string | number>) => t(key as Key, vars);
  const list = (names: string[]) => names.join(rtl ? "، " : ", ");
  const words = () => equationWords(state.eq, say_, num);
  /** A side is on the screen's left unless the page reads right to left, where the first side is on the right. */
  const onScreen = (side: "left" | "right") => (rtl ? (side === "left" ? "right" : "left") : side);

  const heading = h("h2", { textContent: host.title, tabIndex: -1 });
  const objective = h("p", { class: "objective-line", textContent: t("ak_objective") });
  const canvas = algebraCanvas();
  canvas.className = "algebra-art";
  canvas.setAttribute("role", "img");
  const caption = h("p", { class: "small", textContent: t("ak_eq_caption") });
  const sentence = h("p", { class: "equation" });
  sentence.setAttribute("aria-live", "polite");
  const progress = h("p", { class: "small" });
  const moves = h("div", { class: "row moves" });
  moves.setAttribute("role", "group");
  moves.setAttribute("aria-label", t("ak_moves_group"));
  const ran = h("div", { class: "ran" });
  ran.setAttribute("aria-live", "polite");
  const said = h("div", { class: "said" });
  said.setAttribute("aria-live", "polite");
  const asks = h("p", { class: "row" });
  const results = h("section", { class: "results", hidden: true });

  /** The label of a move, in words: a restore says what is taken away and from which side. */
  function labelOf(m: Move): string {
    if (m.type === "balance") return t(m.kind === "things" ? "ak_balance_things" : "ak_balance_numbers");
    if (m.type === "share") return t("ak_share");
    const n = state.eq[m.side][m.kind === "things" ? "lessThings" : "lessNumber"];
    return t(onScreen(m.side) === "left" ? "ak_restore_left" : "ak_restore_right", { amount: amountWords(m.kind, n, false, say_, num) });
  }
  /** The moves that have a button now: a restore only where something is taken away; balancing and sharing always, so that a slip is possible. */
  const shown = (): Move[] => ALL_MOVES.filter((m) => m.type !== "restore" || state.eq[m.side][m.kind === "things" ? "lessThings" : "lessNumber"] > 0);

  const say = (who: "hudhud" | "khwarizmi" | "child" | "narrator", key: Key, ...more: Node[]) => {
    said.append(h("p", { class: `by-${who}` }, h("strong", { textContent: `${t(`ak_who_${who}` as Key)}: ` }), t(key), ...more));
    while (said.children.length > 7) said.firstChild?.remove();
  };
  const flag = (f: AlgebraFlag) => command({ type: "flag", flag: f });

  function drawAsks(): void {
    const has = (f: AlgebraFlag) => state.flags.includes(f);
    asks.replaceChildren(
      h("button", { type: "button", textContent: t("ak_ask_words"), onclick: () => (say("narrator", "ak_words_1"), flag("askedWords")) }),
      h("button", { type: "button", textContent: t("ak_ask_ops"), onclick: () => (say("narrator", "ak_ops_1"), flag("askedOps")) }),
      h("button", {
        type: "button",
        textContent: t("ak_talk_child"),
        disabled: answered,
        onclick: () => {
          const answer = (kind: boolean) => () => {
            answered = true;
            choices.remove();
            say("hudhud", kind ? "ak_child_kind" : "ak_child_blunt");
            say("child", kind ? "ak_child_kind_r" : "ak_child_blunt_r");
            // Either answer is kept, so that a resume does not ask again; only the kind one is a goal.
            if (kind) flag("kind");
            flag("answered");
          };
          const choices = h("span", { class: "row" }, h("button", { type: "button", textContent: t("ak_child_kind"), onclick: answer(true) }), h("button", { type: "button", textContent: t("ak_child_blunt"), onclick: answer(false) }));
          say("child", "ak_child_1", choices);
          (choices.firstChild as HTMLElement).focus({ preventScroll: true });
        },
      }),
      h("button", { type: "button", textContent: t("ak_look_feather"), onclick: () => (say("hudhud", has("feather") ? "ak_feather_again" : "ak_feather_1"), flag("feather")) }),
    );
  }

  function drawMoves(): void {
    const active = document.activeElement as HTMLElement | null;
    const hadFocus = active !== null && moves.contains(active);
    const was = hadFocus ? (active as HTMLElement).dataset.move : undefined;
    moves.replaceChildren(
      ...shown().map((m) => {
        const b = h("button", { type: "button", textContent: labelOf(m), disabled: state.done, onclick: () => command(m) });
        b.dataset.move = moveName(m);
        return b;
      }),
    );
    // A restore button is gone once its place is restored: focus goes to the next button, never to nowhere.
    if (hadFocus) ((was && moves.querySelector<HTMLElement>(`[data-move='${was}']`)) || (moves.firstElementChild as HTMLElement | null))?.focus({ preventScroll: true });
  }

  function draw(): void {
    const text = words();
    if (sentence.textContent !== text) sentence.textContent = text;
    canvas.setAttribute("aria-label", t("ak_picture", { eq: text }));
    progress.textContent = t("ak_progress", { moves: num(state.moves), slips: num(state.slips) });
    drawAlgebra(canvas, { eq: state.eq, rtl, done: state.done });
    drawMoves();
    drawAsks();
  }

  /** What the page says after a move: what it did, or that nothing changed, and how much of that is said depends on the way of playing. */
  function showMove(): void {
    const last = state.last;
    if (!last) return;
    if (last.applied) {
      ran.replaceChildren(h("p", { class: state.done ? "met" : "", textContent: t(state.done ? "ak_did_solved" : last.move.type === "restore" ? "ak_did_restore" : last.move.type === "balance" ? "ak_did_balance" : "ak_did_share") }));
      return;
    }
    // Story explains the slip and names the moves that would work now; Explorer says which kind of move does not work here; Challenge says only that nothing changed.
    const text =
      state.style === "story"
        ? t(last.move.type === "restore" ? "ak_slip_restore_story" : last.move.type === "balance" ? "ak_slip_balance_story" : "ak_slip_share_story", { list: list(available(state.eq).map(labelOf)) })
        : state.style === "explorer"
          ? t(last.move.type === "restore" ? "ak_slip_kind_restore" : last.move.type === "balance" ? "ak_slip_kind_balance" : "ak_slip_kind_share")
          : t("ak_slip_none");
    ran.replaceChildren(h("p", { class: "stopped", textContent: text }));
  }

  function end_(): void {
    host.chime();
    say("hudhud", "ak_done_1");
    const slack = ALGEBRA_SLACK[state.style];
    const g = algebraGoals(state, slack);
    host.finish(g);
    const best = fewest(state.start) ?? 0;
    const goal = (mark: string, name: Key, how: string, met: boolean) => h("li", {}, h("span", { class: "mark", textContent: mark }), h("span", {}, h("strong", { textContent: t(name) }), h("br", {}), h("span", { class: "small", textContent: how })), h("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    const names: Key[] = ["ak_rec_person", "ak_rec_book", "ak_rec_algebra"];
    const title = h("h3", { textContent: t("results_title"), tabIndex: -1 });
    results.replaceChildren(
      title,
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
        h("p", { class: "pending", textContent: t("ak_review") }),
        ...ALGEBRA_RECORDS.map((id, i) => h("p", {}, h("a", { href: `${host.museum}/${host.lang}/${id}/`, textContent: t("note_link", { name: t(names[i]!) }) }))),
      ),
      h("p", { class: "row" }, h("button", { type: "button", class: "primary", textContent: t("btn_atlas"), onclick: () => host.leave() }), h("button", { type: "button", textContent: t("play_again"), onclick: () => again() })),
    );
    results.hidden = false;
    title.focus({ preventScroll: false });
  }

  function again(): void {
    answered = false;
    state = newAlgebra(host.style(), algebraStart(host.style()));
    host.keepPlace?.(null);
    ran.replaceChildren();
    said.replaceChildren();
    results.hidden = true;
    results.replaceChildren();
    say("hudhud", "ak_intro_1");
    say("khwarizmi", "ak_intro_2");
    draw();
    heading.focus({ preventScroll: true });
  }

  function command(c: AlgebraCommand): void {
    const before = state;
    state = applyAlgebra(state, c);
    if (state === before) return;
    if (c.type !== "flag" && state.last?.applied) host.tick();
    // A box with a move made, a slip or a question asked is worth keeping; a box that was just opened is finished,
    // and the host clears its place.
    if (!state.done && (state.moves > 0 || state.slips > 0 || state.flags.length > 0)) host.keepPlace?.(snapshotAlgebra(state));
    draw();
    if (c.type !== "flag") {
      showMove();
      if (state.done) end_();
    }
  }

  const node = h("div", { class: "bench-inner" }, heading, h("p", { class: "small", textContent: t("ak_trial") }), objective, canvas, caption, sentence, progress, moves, ran, said, asks, results);
  say("hudhud", "ak_intro_1");
  say("khwarizmi", "ak_intro_2");
  draw();
  return { node, state: () => state, command, sentence: () => words(), busy: () => false, stop: () => undefined };
}
