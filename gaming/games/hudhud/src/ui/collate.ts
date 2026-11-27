// Karima and the copies: a thirteenth trial quest. It is ordinary page from top to bottom, so that it can be played by
// keyboard, pointer, touch or screen reader alike: a picture of the copies, a table of real buttons in the same rows and
// columns (one for every sign of every copy, each saying in words which copy, which place and which sign it is, and
// whether it is marked), and words for everything that happens in a polite live region. Pressing a sign in the picture
// does the same as pressing its button. The rules are in sim/collate.ts, the copies in content/collate.ts.
import { COLLATE_ART, collateCanvas, collateHit, drawCollate } from "../art/collate";
import { COLLATE_RECORDS, COLLATE_SLACK, collatePuzzle, showsRemaining } from "../content/collate";
import { applyCollate, collateGoals, isMarked, newCollate, remaining, snapshotCollate, type CollateCommand, type CollateFlag, type CollateState, type CollateStyle } from "../sim/collate";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;
export interface CollateHost {
  t(key: Key, vars?: Record<string, string | number>): string;
  num(n: number): string;
  lang: string;
  museum: string;
  /** The subject's name, for the heading. */
  title: string;
  style(): CollateStyle;
  /** Nothing on this page moves, so the game's setting for movement kept still has nothing to hold back; kept so that every page quest is made the same way. */
  reducedMotion(): boolean;
  /** A small sound for a mark, and one for the end. Neither needs a caption: the page says both in words. */
  tick(): void;
  chime(): void;
  /** The quest is finished: its goals are written into the save. */
  finish(r: { turns: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean }): void;
  leave(): void;
  /** A puzzle put back from what was kept, to go on from; null or absent for a new one. */
  resume?: CollateState | null;
  /** The puzzle changed in a way worth keeping (its snapshot), or it is finished or started again (null). */
  keepPlace?(snap: unknown | null): void;
}
export interface CollateQuest {
  node: HTMLElement;
  state(): CollateState;
  command(c: CollateCommand): void;
  /** What the page says now about the slips still to find, as far as the way of playing shows it. */
  status(): string;
  /** A touch or click at a point of the picture's own 1000 by 520 space, as on the canvas. */
  touch(x: number, y: number): void;
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
/** A sign's id as the tail of a string key: `crescent-right` is `crescent_right`. */
const tail = (id: string): string => id.replace(/-/g, "_");

export function collateQuest(host: CollateHost): CollateQuest {
  const { t, num } = host;
  const rtl = host.lang === "ar" || host.lang === "ur";
  let state = host.resume ?? newCollate(host.style(), collatePuzzle(host.style()));
  let answered = state.flags.includes("answered") || state.flags.includes("kind"); // the boy has been answered, kindly or not
  const style = () => state.style;
  const copies = () => state.puzzle.copies.length;
  const length = () => state.puzzle.copies[0]!.length;
  const sign = (copy: number, place: number) => t(`kr_sign_${tail(state.puzzle.copies[copy]![place]!)}` as Key);
  const at = (copy: number, place: number) => ({ c: num(copy + 1), p: num(place + 1) });

  const heading = h("h2", { textContent: host.title, tabIndex: -1 });
  const objective = h("p", { class: "objective-line", textContent: t("kr_objective") });
  const hersLine = h("p", { class: "small" });
  const canvas = collateCanvas();
  canvas.className = "collate-art";
  canvas.setAttribute("role", "img");
  const hint = h("p", { class: "small", textContent: t("kr_tap_hint") });
  const progress = h("p", { class: "small" });
  const tableBox = h("div", { class: "collate-table", tabIndex: 0 });
  tableBox.setAttribute("role", "region");
  tableBox.setAttribute("aria-label", t("kr_region"));
  const ran = h("div", { class: "ran" });
  ran.setAttribute("aria-live", "polite");
  const said = h("div", { class: "said" });
  said.setAttribute("aria-live", "polite");
  const asks = h("p", { class: "row" });
  const results = h("section", { class: "results", hidden: true });

  const say = (who: "hudhud" | "karima" | "boy" | "narrator", key: Key, ...more: Node[]) => {
    said.append(h("p", { class: `by-${who}` }, h("strong", { textContent: `${t(`kr_who_${who}` as Key)}: ` }), t(key), ...more));
    while (said.children.length > 7) said.firstChild?.remove();
  };
  const flag = (f: CollateFlag) => command({ type: "flag", flag: f });

  /** The slips still to find, in the way of playing's own words: Story and Explorer count them, Challenge does not. */
  function statusText(): string {
    if (state.done) return t("kr_did_done");
    return showsRemaining(style()) ? t("kr_left", { n: num(remaining(state)) }) : t("kr_left_hidden");
  }

  function drawTable(): void {
    const active = document.activeElement as HTMLElement | null;
    const was = active !== null && tableBox.contains(active) && active.dataset.copy !== undefined ? `${active.dataset.copy}:${active.dataset.place}` : null;
    const th = (text: string, scope: "col" | "row") => Object.assign(h("th", { textContent: text }), { scope });
    const table = h(
      "table",
      {},
      h("caption", { textContent: t("kr_table_caption") }),
      h("thead", {}, h("tr", {}, th(t("kr_col_copy"), "col"), ...Array.from({ length: length() }, (_, p) => th(t("kr_col_place", { p: num(p + 1) }), "col")))),
      h(
        "tbody",
        {},
        ...state.puzzle.copies.map((_, copy) =>
          h(
            "tr",
            {},
            th(copy === state.puzzle.hers ? t("kr_copy_hers", { c: num(copy + 1) }) : t("kr_copy", { c: num(copy + 1) }), "row"),
            ...Array.from({ length: length() }, (_, place) => {
              const marked = isMarked(state, copy, place);
              const name = sign(copy, place);
              const b = h("button", { type: "button", textContent: name, disabled: state.done, onclick: () => toggle(copy, place) });
              b.dataset.copy = String(copy);
              b.dataset.place = String(place);
              b.setAttribute("aria-label", t(marked ? "kr_cell_marked" : "kr_cell", { ...at(copy, place), sign: name }));
              b.setAttribute("aria-pressed", String(marked));
              return h("td", {}, b);
            }),
          ),
        ),
      ),
    );
    tableBox.replaceChildren(table);
    if (was !== null) {
      const [c, p] = was.split(":");
      tableBox.querySelector<HTMLElement>(`button[data-copy='${c}'][data-place='${p}']`)?.focus({ preventScroll: true });
    }
  }
  function drawAsks(): void {
    const has = (f: CollateFlag) => state.flags.includes(f);
    asks.replaceChildren(
      h("button", { type: "button", textContent: t("kr_ask_who"), onclick: () => (say("narrator", "kr_who_1"), flag("askedWho")) }),
      h("button", { type: "button", textContent: t("kr_ask_book"), onclick: () => (say("narrator", "kr_book_1"), flag("askedBook")) }),
      h("button", {
        type: "button",
        textContent: t("kr_talk_boy"),
        disabled: answered,
        onclick: () => {
          const answer = (kind: boolean) => () => {
            answered = true;
            choices.remove();
            say("hudhud", kind ? "kr_boy_kind" : "kr_boy_blunt");
            say("boy", kind ? "kr_boy_kind_r" : "kr_boy_blunt_r");
            // Either answer is kept, so that a resume does not ask again; only the kind one is a goal.
            if (kind) flag("kind");
            flag("answered");
          };
          const choices = h("span", { class: "row" }, h("button", { type: "button", textContent: t("kr_boy_kind"), onclick: answer(true) }), h("button", { type: "button", textContent: t("kr_boy_blunt"), onclick: answer(false) }));
          say("boy", "kr_boy_1", choices);
          (choices.firstChild as HTMLElement).focus({ preventScroll: true });
        },
      }),
      h("button", { type: "button", textContent: t("kr_look_feather"), onclick: () => (say("hudhud", has("feather") ? "kr_feather_again" : "kr_feather_1"), flag("feather")) }),
    );
  }

  function draw(): void {
    const vars = { copies: num(copies()), n: num(length()), marked: num(state.marks.length) };
    canvas.setAttribute("aria-label", showsRemaining(style()) ? t("kr_picture", { ...vars, left: num(remaining(state)) }) : t("kr_picture_hidden", vars));
    hersLine.textContent = style() === "story" ? t("kr_story_hers") : "";
    hersLine.hidden = style() !== "story";
    progress.textContent = t("kr_progress", { marked: num(state.marks.length), wrong: num(state.wrong) });
    drawCollate(canvas, { copies: state.puzzle.copies, hers: state.puzzle.hers, marks: state.marks, rtl, done: state.done });
    drawTable();
    drawAsks();
  }

  /** What the page says after a mark: what happened, and then where the slips stand as far as the way of playing shows it. */
  function showResult(): void {
    const last = state.last;
    const paras: HTMLElement[] = [];
    if (last && last.type !== "refused") {
      const key: Key = last.type === "unmark" ? "kr_did_unmark" : state.puzzle.copies.length === 2 ? "kr_did_mark_story" : "kr_did_mark";
      paras.push(h("p", { textContent: t(key, at(last.copy, last.place)) }));
    } else if (last) {
      paras.push(h("p", { class: "stopped", textContent: t(last.why === "same" ? "kr_did_same" : last.why === "hers" ? "kr_did_hers" : "kr_did_agrees", at(last.copy, last.place)) }));
    }
    paras.push(h("p", { class: state.done ? "met" : "status", textContent: statusText() }));
    ran.replaceChildren(...paras);
  }

  function end_(): void {
    host.chime();
    say("hudhud", "kr_done_1");
    const slack = COLLATE_SLACK[state.style];
    const g = collateGoals(state, slack);
    host.finish(g);
    const goal = (mark: string, name: Key, how: string, met: boolean) => h("li", {}, h("span", { class: "mark", textContent: mark }), h("span", {}, h("strong", { textContent: t(name) }), h("br", {}), h("span", { class: "small", textContent: how })), h("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    const how = slack === null ? t("kr_goal_ingenuity_story") : t("kr_goal_ingenuity_how", { n: num(slack) });
    const names: Key[] = ["kr_rec_person"];
    const title = h("h3", { textContent: t("results_title"), tabIndex: -1 });
    results.replaceChildren(
      title,
      h("p", { textContent: t("kr_progress", { marked: num(state.marks.length), wrong: num(g.slips) }) }),
      h("ul", { class: "goals" }, goal("✦", "goal_curiosity", t("kr_goal_curiosity_how"), g.curiosity), goal("⚙", "goal_ingenuity", how, g.ingenuity), goal("♥", "goal_kindness", t("kr_goal_kindness_how"), g.kindness), goal("❧", "goal_feather", t("kr_goal_feather_how"), g.feather)),
      h(
        "div",
        { class: "note" },
        h("h3", { textContent: t("note_title") }),
        h("p", { textContent: t("kr_note_1") }),
        h("p", { textContent: t("kr_note_2") }),
        h("p", { textContent: t("kr_note_3") }),
        h("p", { class: "pending", textContent: t("kr_review") }),
        ...COLLATE_RECORDS.map((id, i) => h("p", {}, h("a", { href: `${host.museum}/${host.lang}/${id}/`, textContent: t("note_link", { name: t(names[i]!) }) }))),
      ),
      h("p", { class: "row" }, h("button", { type: "button", class: "primary", textContent: t("btn_atlas"), onclick: () => host.leave() }), h("button", { type: "button", textContent: t("play_again"), onclick: () => again() })),
    );
    results.hidden = false;
    title.focus({ preventScroll: false });
  }

  function again(): void {
    answered = false;
    state = newCollate(host.style(), collatePuzzle(host.style()));
    host.keepPlace?.(null);
    ran.replaceChildren();
    said.replaceChildren();
    results.hidden = true;
    results.replaceChildren();
    say("hudhud", "kr_intro_1");
    say("karima", "kr_intro_2");
    draw();
    showResult();
    heading.focus({ preventScroll: true });
  }

  function command(c: CollateCommand): void {
    const before = state;
    state = applyCollate(state, c);
    if (state === before) return;
    if (c.type !== "flag") host.tick();
    // A puzzle with a mark, a wrong mark or a question asked is worth keeping; a finished one is cleared by the host.
    if (!state.done) host.keepPlace?.(state.marks.length > 0 || state.wrong > 0 || state.flags.length > 0 ? snapshotCollate(state) : null);
    draw();
    if (c.type !== "flag") {
      showResult();
      if (state.done) end_();
    }
  }
  /** A sign pressed, by its button or in the picture: a sign not marked is marked (if it is a slip), a marked one is unmarked. */
  function toggle(copy: number, place: number): void {
    if (state.done) return;
    command(isMarked(state, copy, place) ? { type: "unmark", copy, place } : { type: "mark", copy, place });
  }
  function touch(x: number, y: number): void {
    const hit = collateHit(x, y, copies(), length(), rtl);
    if (hit !== null) toggle(hit.copy, hit.place);
  }
  canvas.addEventListener("click", (e) => {
    const r = canvas.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    touch(((e.clientX - r.left) / r.width) * COLLATE_ART.w, ((e.clientY - r.top) / r.height) * COLLATE_ART.h);
  });

  const node = h("div", { class: "bench-inner" }, heading, h("p", { class: "small", textContent: t("kr_trial") }), objective, hersLine, canvas, hint, progress, tableBox, ran, said, asks, results);
  say("hudhud", "kr_intro_1");
  say("karima", "kr_intro_2");
  draw();
  showResult();
  return { node, state: () => state, command, status: () => statusText(), touch, busy: () => false, stop: () => undefined };
}
