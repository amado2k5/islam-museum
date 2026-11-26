// The scattered sheets' page: a fifth trial quest. It is ordinary page from top to bottom, so that it can be played
// by keyboard, pointer, touch or screen reader alike: a picture of the sheets, a real button for every place in the
// same rows and columns, the edges of every sheet in words, and words for everything that happens. Touching two
// sheets in the picture does the same as pressing two buttons. The rules are in sim/sheets.ts.
import { drawSheets, SHEETS_ART, sheetsCanvas, sheetsHit } from "../art/sheets";
import { SHEETS_RECORDS, SHEETS_SLACK, sheetsMap } from "../content/sheets";
import { allSeams, decodeEdge, fewestFromStart, gridOf, newSheets, applySheets, sheetsGoals, snapshotSheets, tally, type SheetsCommand, type SheetsFlag, type SheetsState, type SheetsStyle } from "../sim/sheets";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;
export interface SheetsHost {
  t(key: Key, vars?: Record<string, string | number>): string;
  num(n: number): string;
  lang: string;
  museum: string;
  /** The subject's name, for the heading. */
  title: string;
  style(): SheetsStyle;
  /** A small sound for an exchange, and one for the end. Neither needs a caption: the page says both in words. */
  tick(): void;
  chime(): void;
  /** The quest is finished: its goals are written into the save. */
  finish(r: { turns: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean }): void;
  leave(): void;
  /** A map put back from what was kept, to go on from; null or absent for a new one. */
  resume?: SheetsState | null;
  /** The map changed in a way worth keeping (its snapshot), or it is finished or started again (null). */
  keepPlace?(snap: unknown | null): void;
}
export interface SheetsQuest {
  node: HTMLElement;
  state(): SheetsState;
  command(c: SheetsCommand): void;
  /** What the page says now about the seams, in words. */
  status(): string;
  /** The place chosen, or null. */
  selected(): number | null;
  /** A touch or click at a point of the picture's own 1000 by 480 space, as on the canvas. */
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

export function sheetsQuest(host: SheetsHost): SheetsQuest {
  const { t, num } = host;
  const rtl = host.lang === "ar" || host.lang === "ur";
  let state = host.resume ?? newSheets(host.style(), sheetsMap(host.style()));
  let answered = state.flags.includes("answered") || state.flags.includes("kind"); // the helper has been answered, kindly or not
  let selected: number | null = null; // the place chosen, by a button or on the picture
  const list = (names: string[]) => names.join(rtl ? "، " : ", ");
  const rc = (p: number) => ({ r: num(Math.floor(p / state.cols) + 1), c: num((p % state.cols) + 1) });
  const style = () => state.style;

  const heading = h("h2", { textContent: host.title, tabIndex: -1 });
  const objective = h("p", { class: "objective-line", textContent: t("id_objective") });
  const canvas = sheetsCanvas();
  canvas.className = "sheets-art";
  canvas.setAttribute("role", "img");
  const hint = h("p", { class: "small" });
  const progress = h("p", { class: "small" });
  const groupLabel = t("id_grid_group");
  const gridBox = h("div", { class: "sheet-rows" });
  gridBox.setAttribute("role", "group");
  gridBox.setAttribute("aria-label", groupLabel);
  const checkRow = h("p", { class: "row" });
  const ran = h("div", { class: "ran" });
  ran.setAttribute("aria-live", "polite");
  const edges = h("details", { class: "edges" });
  const said = h("div", { class: "said" });
  said.setAttribute("aria-live", "polite");
  const asks = h("p", { class: "row" });
  const results = h("section", { class: "results", hidden: true });

  const say = (who: "hudhud" | "idrisi" | "helper" | "narrator", key: Key, ...more: Node[]) => {
    said.append(h("p", { class: `by-${who}` }, h("strong", { textContent: `${t(`id_who_${who}` as Key)}: ` }), t(key), ...more));
    while (said.children.length > 7) said.firstChild?.remove();
  };
  const flag = (f: SheetsFlag) => command({ type: "flag", flag: f });

  /** Seams that do not match, in the way of playing's own words: Story names them, Explorer counts them, Challenge shows nothing until a check. */
  function statusText(): string {
    const last = state.last;
    if (style() === "challenge") return last?.type === "check" ? t("id_check_result", { matched: num(last.matched), total: num(last.total) }) : t("id_seams_hidden");
    const bad = allSeams(gridOf(state)).filter((x) => !x.match);
    if (bad.length === 0) return t("id_seams_none");
    if (style() === "explorer") return t("id_seams_count", { n: num(bad.length), total: num(tally(state).total) });
    const name = (x: (typeof bad)[number]) => {
      const a = rc(x.a);
      if (x.b === null) return t("id_seam_edge", { r: a.r, c: a.c });
      const b = rc(x.b);
      return t("id_seam_name", { r1: a.r, c1: a.c, r2: b.r, c2: b.c });
    };
    return t("id_seams_story", { list: list(bad.map(name)) });
  }
  /** Seams of the map that touch a place and do not match: only said where the way of playing shows seams. */
  const badAt = (p: number) => allSeams(gridOf(state)).filter((x) => !x.match && (x.a === p || x.b === p)).length;

  function drawGrid(): void {
    const active = document.activeElement as HTMLElement | null;
    const was = active !== null && gridBox.contains(active) ? active.dataset.place : undefined;
    gridBox.replaceChildren(
      ...Array.from({ length: state.rows }, (_, r) =>
        h(
          "ol",
          { class: "sheet-row" },
          ...Array.from({ length: state.cols }, (_, c) => {
            const p = r * state.cols + c;
            const id = state.grid[p]!;
            const vars = { r: num(r + 1), c: num(c + 1), id: num(id) };
            const text = style() === "story" ? (badAt(p) === 0 ? t("id_place_ok", vars) : t("id_place_bad", { ...vars, n: num(badAt(p)) })) : t("id_place_label", vars);
            const b = h("button", { type: "button", textContent: text, disabled: state.done, onclick: () => choose(p) });
            b.dataset.place = String(p);
            b.setAttribute("aria-pressed", String(selected === p));
            return h("li", {}, b);
          }),
        ),
      ),
    );
    if (was !== undefined) gridBox.querySelector<HTMLElement>(`[data-place='${was}']`)?.focus({ preventScroll: true });
  }
  /** The edges of every sheet, in words, for a reader who cannot see the picture. */
  function drawEdges(): void {
    const cell = (code: number) => {
      const d = decodeEdge(code);
      return d ? t("id_feature_at", { feature: t(`id_feat_${d.feature}` as Key), pos: t(`id_pos_${d.at}` as Key) }) : t("id_nothing");
    };
    const table = h(
      "table",
      { class: "counts" },
      h("caption", { textContent: t("id_edges_caption") }),
      h("thead", {}, h("tr", {}, ...(["id_col_sheet", "id_edge_top", "id_edge_bottom", "id_edge_begin", "id_edge_end"] as Key[]).map((k) => Object.assign(h("th", { textContent: t(k) }), { scope: "col" })))),
      h(
        "tbody",
        {},
        ...state.sheets.map((sh) => h("tr", {}, Object.assign(h("th", { textContent: num(sh.id) }), { scope: "row" }), h("td", { textContent: cell(sh.n) }), h("td", { textContent: cell(sh.s) }), h("td", { textContent: cell(sh.w) }), h("td", { textContent: cell(sh.e) }))),
      ),
    );
    edges.replaceChildren(h("summary", { textContent: t("id_edges_summary") }), table);
  }
  function drawAsks(): void {
    const has = (f: SheetsFlag) => state.flags.includes(f);
    asks.replaceChildren(
      h("button", { type: "button", textContent: t("id_ask_book"), onclick: () => (say("narrator", "id_book_1"), flag("askedBook")) }),
      h("button", { type: "button", textContent: t("id_ask_maps"), onclick: () => (say("narrator", "id_maps_1"), flag("askedMaps")) }),
      h("button", {
        type: "button",
        textContent: t("id_talk_helper"),
        disabled: answered,
        onclick: () => {
          const answer = (kind: boolean) => () => {
            answered = true;
            choices.remove();
            say("hudhud", kind ? "id_helper_kind" : "id_helper_blunt");
            say("helper", kind ? "id_helper_kind_r" : "id_helper_blunt_r");
            // Either answer is kept, so that a resume does not ask again; only the kind one is a goal.
            if (kind) flag("kind");
            flag("answered");
          };
          const choices = h("span", { class: "row" }, h("button", { type: "button", textContent: t("id_helper_kind"), onclick: answer(true) }), h("button", { type: "button", textContent: t("id_helper_blunt"), onclick: answer(false) }));
          say("helper", "id_helper_1", choices);
          (choices.firstChild as HTMLElement).focus({ preventScroll: true });
        },
      }),
      h("button", { type: "button", textContent: t("id_look_feather"), onclick: () => (say("hudhud", has("feather") ? "id_feather_again" : "id_feather_1"), flag("feather")) }),
    );
    // The check button is for the way of playing that shows nothing until it is pressed.
    checkRow.replaceChildren(...(style() === "challenge" ? [h("button", { type: "button", class: "primary", textContent: t("id_check"), disabled: state.done, onclick: () => command({ type: "check" }) })] : []));
  }

  function draw(): void {
    const g = gridOf(state);
    const showSeams = style() !== "challenge";
    canvas.setAttribute("aria-label", showSeams ? t("id_picture", { rows: num(state.rows), cols: num(state.cols), matched: num(tally(state).matched), total: num(tally(state).total) }) : t("id_picture_hidden", { rows: num(state.rows), cols: num(state.cols) }));
    hint.textContent = state.done ? "" : selected === null ? t("id_tap_hint") : t("id_chosen", { ...rc(selected), id: num(state.grid[selected]!) });
    progress.textContent = style() === "challenge" ? t("id_progress_checks", { moves: num(state.moves), checks: num(state.checks) }) : t("id_progress", { moves: num(state.moves) });
    drawSheets(canvas, { grid: g, rtl, selected, showSeams, done: state.done });
    drawGrid();
    drawAsks();
  }

  /** What the page says after a command: what it did, and then where the seams stand as far as the way of playing shows it. */
  function showResult(): void {
    const last = state.last;
    const paras: HTMLElement[] = [];
    if (last?.type === "exchange") {
      const a = rc(last.a);
      const b = rc(last.b);
      paras.push(h("p", { class: state.done ? "met" : "", textContent: state.done ? t("id_did_solved") : t("id_did_exchange", { r1: a.r, c1: a.c, r2: b.r, c2: b.c }) }));
    } else if (last?.type === "check" && state.done) paras.push(h("p", { class: "met", textContent: t("id_did_solved") }));
    if (!state.done) paras.push(h("p", { class: "status", textContent: statusText() }));
    ran.replaceChildren(...paras);
  }

  function end_(): void {
    host.chime();
    say("hudhud", "id_done_1");
    const slack = SHEETS_SLACK[state.style];
    const g = sheetsGoals(state, slack);
    host.finish(g);
    const goal = (mark: string, name: Key, how: string, met: boolean) => h("li", {}, h("span", { class: "mark", textContent: mark }), h("span", {}, h("strong", { textContent: t(name) }), h("br", {}), h("span", { class: "small", textContent: how })), h("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    const how = slack === null ? t("id_goal_ingenuity_story") : slack.checks === null ? t("id_goal_ingenuity_explorer", { m: num(fewestFromStart(state) + slack.extra) }) : t("id_goal_ingenuity_challenge", { m: num(fewestFromStart(state) + slack.extra), c: num(slack.checks) });
    const names: Key[] = ["id_rec_person", "id_rec_book"];
    const title = h("h3", { textContent: t("results_title"), tabIndex: -1 });
    results.replaceChildren(
      title,
      h("p", { textContent: style() === "challenge" ? t("id_progress_checks", { moves: num(g.turns), checks: num(g.slips) }) : t("id_progress", { moves: num(g.turns) }) }),
      h("ul", { class: "goals" }, goal("✦", "goal_curiosity", t("id_goal_curiosity_how"), g.curiosity), goal("⚙", "goal_ingenuity", how, g.ingenuity), goal("♥", "goal_kindness", t("id_goal_kindness_how"), g.kindness), goal("❧", "goal_feather", t("id_goal_feather_how"), g.feather)),
      h(
        "div",
        { class: "note" },
        h("h3", { textContent: t("note_title") }),
        h("p", { textContent: t("id_note_1") }),
        h("p", { textContent: t("id_note_2") }),
        h("p", { textContent: t("id_note_3") }),
        h("p", { class: "pending", textContent: t("id_review") }),
        ...SHEETS_RECORDS.map((id, i) => h("p", {}, h("a", { href: `${host.museum}/${host.lang}/${id}/`, textContent: t("note_link", { name: t(names[i]!) }) }))),
      ),
      h("p", { class: "row" }, h("button", { type: "button", class: "primary", textContent: t("btn_atlas"), onclick: () => host.leave() }), h("button", { type: "button", textContent: t("play_again"), onclick: () => again() })),
    );
    results.hidden = false;
    title.focus({ preventScroll: false });
  }

  function again(): void {
    answered = false;
    selected = null;
    state = newSheets(host.style(), sheetsMap(host.style()));
    host.keepPlace?.(null);
    ran.replaceChildren();
    said.replaceChildren();
    results.hidden = true;
    results.replaceChildren();
    say("hudhud", "id_intro_1");
    say("idrisi", "id_intro_2");
    drawEdges();
    draw();
    showResult();
    heading.focus({ preventScroll: true });
  }

  function command(c: SheetsCommand): void {
    const before = state;
    state = applySheets(state, c);
    if (state === before) return;
    if (c.type === "exchange") {
      selected = null;
      host.tick();
    }
    // A map with an exchange made, a check, or a question asked is worth keeping; a map that was just put in order
    // is finished, and the host clears its place.
    if (!state.done && (state.moves > 0 || state.checks > 0 || state.flags.length > 0)) host.keepPlace?.(snapshotSheets(state));
    draw();
    if (c.type !== "flag") {
      showResult();
      if (state.done) end_();
    }
  }

  /** A sheet chosen, by its button or by a touch on the picture: the first is held, a second is exchanged with it, the held one again lets it go. */
  function choose(p: number): void {
    if (state.done) return;
    if (selected === null) {
      selected = p;
      draw();
      return;
    }
    if (selected === p) {
      selected = null;
      draw();
      ran.replaceChildren(h("p", { textContent: t("id_let_go") }));
      return;
    }
    command({ type: "exchange", a: selected, b: p });
  }
  function touch(x: number, y: number): void {
    const p = sheetsHit(x, y, state.rows, state.cols, rtl);
    if (p !== null) choose(p);
  }
  canvas.addEventListener("click", (e) => {
    const r = canvas.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    touch(((e.clientX - r.left) / r.width) * SHEETS_ART.w, ((e.clientY - r.top) / r.height) * SHEETS_ART.h);
  });

  const node = h("div", { class: "bench-inner" }, heading, h("p", { class: "small", textContent: t("id_trial") }), objective, canvas, hint, progress, gridBox, checkRow, ran, edges, said, asks, results);
  say("hudhud", "id_intro_1");
  say("idrisi", "id_intro_2");
  drawEdges();
  draw();
  showResult();
  return { node, state: () => state, command, status: () => statusText(), selected: () => selected, touch, busy: () => false, stop: () => undefined };
}
