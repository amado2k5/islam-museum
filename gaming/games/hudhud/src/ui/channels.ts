// The page of the Alhambra and the dry fountain, the eleventh trial quest. It is ordinary page from top to bottom, so
// that it can be played by keyboard, pointer, touch or screen reader alike: a picture of the channels, a real button
// for every piece in the same rows and columns (pressing one turns that piece a quarter turn), a table that says every
// piece's openings in words, and words for everything that happens. Pressing a piece in the picture does the same as
// pressing its button. The rules are in sim/channels.ts.
import { channelsCanvas, channelsHit, CHANNELS_ART, drawChannels } from "../art/channels";
import { CHANNELS_RECORDS, CHANNELS_SLACK, channelsGrid } from "../content/channels";
import { applyChannels, basinsWet, channelsGoals, fewestFromStart, flow, gridOf, newChannels, opens, snapshotChannels, turnable, SIDES, type ChannelsCommand, type ChannelsFlag, type ChannelsState, type ChannelsStyle, type Flow, type Side } from "../sim/channels";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;
export interface ChannelsHost {
  t(key: Key, vars?: Record<string, string | number>): string;
  num(n: number): string;
  lang: string;
  museum: string;
  /** The subject's name, for the heading. */
  title: string;
  style(): ChannelsStyle;
  /** The game's own answer to "should movement be kept still": the setting, the system preference, or `motion=reduced`. */
  reducedMotion(): boolean;
  /** A small sound for a turn, and one for the end. Neither needs a caption: the page says both in words. */
  tick(): void;
  chime(): void;
  /** The quest is finished: its goals are written into the save. */
  finish(r: { turns: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean }): void;
  leave(): void;
  /** A grid put back from what was kept, to go on from; null or absent for a new one. */
  resume?: ChannelsState | null;
  /** The grid changed in a way worth keeping (its snapshot), or it is finished or started again (null). */
  keepPlace?(snap: unknown | null): void;
}
export interface ChannelsQuest {
  node: HTMLElement;
  state(): ChannelsState;
  command(c: ChannelsCommand): void;
  /** What the page says now about the water, in words. */
  status(): string;
  /** Always null: a piece is turned the moment it is pressed, none is held. Kept so that every quest on a page has the same shape. */
  selected(): null;
  /** A touch or click at a point of the picture's own 1000 by 520 space, as on the canvas. */
  touch(x: number, y: number): void;
  /** True while the water is shown running along the channels (never when movement is kept still). */
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

export function channelsQuest(host: ChannelsHost): ChannelsQuest {
  const { t, num } = host;
  const rtl = host.lang === "ar" || host.lang === "ur";
  let state = host.resume ?? newChannels(host.style(), channelsGrid(host.style()));
  let answered = state.flags.includes("answered") || state.flags.includes("kind"); // the girl has been answered, kindly or not
  let marked: number | null = null; // the piece turned last, for the picture's gold outline
  let fill = Infinity; // how far the water has run in the picture
  let timer: number | undefined;
  let running = false;
  const list = (names: string[]) => names.join(rtl ? "، " : ", ");
  const style = () => state.style;
  const rc = (p: number) => ({ r: num(Math.floor(p / state.cols) + 1), c: num((p % state.cols) + 1) });
  /** Places are listed with a semicolon, because each name has a comma in it. */
  const places = (cells: number[]) => cells.map(placeName).join(rtl ? "؛ " : "; ");
  const placeName = (p: number) => t("ah_place", rc(p));
  /** The Challenge way of playing shows the water only after the sluice is opened, and until the next turn. */
  const showWater = () => style() !== "challenge" || state.last?.type === "open";
  const sideName = (s: Side) => t(`ah_s_${s}` as Key);
  const basinAt = (p: number) => state.basins.find((b) => b.cell === p);

  const heading = h("h2", { textContent: host.title, tabIndex: -1 });
  const objective = h("p", { class: "objective-line", textContent: t(style() === "challenge" ? "ah_objective_challenge" : "ah_objective") });
  const canvas = channelsCanvas();
  canvas.className = "channels-art";
  canvas.setAttribute("role", "img");
  const hint = h("p", { class: "small" });
  const progress = h("p", { class: "small" });
  const gridBox = h("div", { class: "channel-rows" });
  gridBox.setAttribute("role", "group");
  gridBox.setAttribute("aria-label", t("ah_grid_group"));
  const sluiceRow = h("p", { class: "row" });
  const ran = h("div", { class: "ran" });
  ran.setAttribute("aria-live", "polite");
  const table = h("details", { class: "edges" });
  const said = h("div", { class: "said" });
  said.setAttribute("aria-live", "polite");
  const asks = h("p", { class: "row" });
  const results = h("section", { class: "results", hidden: true });

  const say = (who: "hudhud" | "keeper" | "girl" | "narrator", key: Key, ...more: Node[]) => {
    said.append(h("p", { class: `by-${who === "keeper" ? "keeper" : who === "girl" ? "child" : who}` }, h("strong", { textContent: `${t(`ah_who_${who}` as Key)}: ` }), t(key), ...more));
    while (said.children.length > 7) said.firstChild?.remove();
  };
  const flag = (f: ChannelsFlag) => command({ type: "flag", flag: f });

  // ---- words for the pieces and the water
  const pieceName = (p: number): string => {
    const b = basinAt(p);
    return b ? t(b.kind === "fountain" ? "ah_b_fountain" : "ah_b_pool") : t(`ah_p_${state.cells[p]!.kind}` as Key);
  };
  const sidesText = (p: number): string => {
    const piece = state.cells[p]!;
    const o = opens(piece.kind, piece.turn);
    return o.length === 0 ? t("ah_open_none") : list(SIDES.filter((s) => o.includes(s)).map(sideName));
  };
  /** What is said about a place besides what it is: the spout, whether it has water, and (Story) that the water stops against it. */
  function notesOf(p: number, f: Flow): string[] {
    const out: string[] = [];
    if (p === state.spout.cell) out.push(t("ah_note_spout", { side: sideName(state.spout.side) }));
    if (showWater() && state.cells[p]!.kind !== "blank") out.push(t(f.wet[p] ? "ah_note_wet" : "ah_note_dry"));
    if (style() === "story" && showWater() && f.blocked.includes(p)) out.push(t("ah_note_stop"));
    return out;
  }
  /** What the page says about the water, as far as the way of playing shows it: which basins have water, where it spills, and (Story) what it stops against. */
  function waterLines(): string[] {
    if (!showWater()) return [t("ah_hidden")];
    const f = flow(gridOf(state));
    const wetBasins = state.basins.filter((b) => f.wet[b.cell]).map((b) => t(b.kind === "fountain" ? "ah_b_fountain" : "ah_b_pool"));
    const lines = [wetBasins.length > 0 ? t("ah_water_basins", { list: list(wetBasins) }) : t("ah_water_none")];
    const leakCells = [...new Set(f.leaks.map((l) => l.cell))];
    if (leakCells.length > 0) lines.push(t("ah_water_leak", { list: places(leakCells) }));
    if (style() === "story" && f.blocked.length > 0) lines.push(t("ah_water_stop", { list: places(f.blocked) }));
    return lines;
  }
  const statusText = () => waterLines().join(" ");

  // ---- the picture
  function paint(): void {
    drawChannels(canvas, { grid: gridOf(state), basins: state.basins, rtl, showWater: showWater(), fill, done: state.done, mark: marked });
  }
  function stopTimer(): void {
    if (timer !== undefined) window.clearTimeout(timer);
    timer = undefined;
    running = false;
  }
  /** The water runs along the channels, a step at a time, unless movement is kept still: then it is simply there. */
  function runWater(): void {
    stopTimer();
    const f = flow(gridOf(state));
    const far = f.reach.reduce((a, b) => Math.max(a, b), 0) + 1;
    if (!showWater() || host.reducedMotion() || far <= 1) {
      fill = Infinity;
      paint();
      return;
    }
    fill = 0;
    running = true;
    paint();
    const delay = Math.max(25, Math.min(70, Math.floor(700 / far)));
    const go = () => {
      fill += 1;
      if (fill > far) {
        fill = Infinity;
        running = false;
        timer = undefined;
      } else timer = window.setTimeout(go, delay);
      paint();
    };
    timer = window.setTimeout(go, delay);
  }

  function drawGrid(): void {
    const active = document.activeElement as HTMLElement | null;
    const was = active !== null && gridBox.contains(active) ? active.dataset.place : undefined;
    const f = flow(gridOf(state));
    gridBox.replaceChildren(
      ...Array.from({ length: state.rows }, (_, r) =>
        h(
          "ol",
          { class: "channel-row" },
          ...Array.from({ length: state.cols }, (_, c) => {
            const p = r * state.cols + c;
            const o = opens(state.cells[p]!.kind, state.cells[p]!.turn);
            const base = o.length === 0 ? t("ah_label_none", { ...rc(p), piece: pieceName(p) }) : t("ah_label", { ...rc(p), piece: pieceName(p), sides: sidesText(p) });
            const notes = notesOf(p, f);
            const b = h("button", { type: "button", textContent: base + notes.map((n) => (rtl ? "، " : ", ") + n).join(""), disabled: state.done, onclick: () => press(p) });
            b.dataset.place = String(p);
            return h("li", {}, b);
          }),
        ),
      ),
    );
    if (was !== undefined) gridBox.querySelector<HTMLElement>(`[data-place='${was}']`)?.focus({ preventScroll: true });
  }
  /** Every piece's openings, in words, for a reader who cannot see the picture. */
  function drawTable(): void {
    const f = flow(gridOf(state));
    const th = (k: Key) => Object.assign(h("th", { textContent: t(k) }), { scope: "col" });
    const body = h(
      "tbody",
      {},
      ...state.cells.map((_, p) => h("tr", {}, Object.assign(h("th", { textContent: t("ah_rowcol", rc(p)) }), { scope: "row" }), h("td", { textContent: pieceName(p) }), h("td", { textContent: sidesText(p) }), h("td", { textContent: list(notesOf(p, f)) }))),
    );
    const open = table.open;
    table.replaceChildren(h("summary", { textContent: t("ah_table_summary") }), h("table", { class: "counts" }, h("caption", { textContent: t("ah_table_caption") }), h("thead", {}, h("tr", {}, th("ah_col_place"), th("ah_col_piece"), th("ah_col_open"), th("ah_col_note"))), body));
    table.open = open;
  }
  function drawAsks(): void {
    const has = (f: ChannelsFlag) => state.flags.includes(f);
    asks.replaceChildren(
      h("button", { type: "button", textContent: t("ah_ask_water"), onclick: () => (say("narrator", "ah_water_1"), flag("askedWater")) }),
      h("button", { type: "button", textContent: t("ah_ask_courts"), onclick: () => (say("narrator", "ah_court_1"), flag("askedCourts")) }),
      h("button", {
        type: "button",
        textContent: t("ah_talk_girl"),
        disabled: answered,
        onclick: () => {
          const answer = (kind: boolean) => () => {
            answered = true;
            choices.remove();
            say("hudhud", kind ? "ah_girl_kind" : "ah_girl_blunt");
            say("girl", kind ? "ah_girl_kind_r" : "ah_girl_blunt_r");
            // Either answer is kept, so that a resume does not ask again; only the kind one is a goal.
            if (kind) flag("kind");
            flag("answered");
          };
          const choices = h("span", { class: "row" }, h("button", { type: "button", textContent: t("ah_girl_kind"), onclick: answer(true) }), h("button", { type: "button", textContent: t("ah_girl_blunt"), onclick: answer(false) }));
          say("girl", "ah_girl_1", choices);
          (choices.firstChild as HTMLElement).focus({ preventScroll: true });
        },
      }),
      h("button", { type: "button", textContent: t("ah_look_feather"), onclick: () => (say("hudhud", has("feather") ? "ah_feather_again" : "ah_feather_1"), flag("feather")) }),
    );
    // The sluice is for the way of playing that shows no water until it is opened.
    sluiceRow.replaceChildren(...(style() === "challenge" ? [h("button", { type: "button", class: "primary", textContent: t("ah_sluice"), disabled: state.done, onclick: () => command({ type: "open" }) })] : []));
  }

  function draw(): void {
    const f = flow(gridOf(state));
    const shown = showWater();
    const vars = { rows: num(state.rows), cols: num(state.cols), basins: num(state.basins.length) };
    canvas.setAttribute("aria-label", shown ? t("ah_picture", { ...vars, wet: num(basinsWet(state.basins, f)), leaks: num(new Set(f.leaks.map((l) => l.cell)).size) }) : t("ah_picture_hidden", vars));
    hint.textContent = state.done ? "" : t("ah_tap_hint");
    progress.textContent = style() === "challenge" ? t("ah_progress_open", { moves: num(state.moves), openings: num(state.openings) }) : t("ah_progress", { moves: num(state.moves) });
    paint();
    drawGrid();
    drawTable();
    drawAsks();
  }

  /** What the page says after a command: what it did, and then where the water stands as far as the way of playing shows it. */
  function showResult(): void {
    const last = state.last;
    const paras: HTMLElement[] = [];
    if (state.done) paras.push(h("p", { class: "met", textContent: t("ah_did_solved") }));
    else {
      if (last?.type === "turn") paras.push(h("p", { textContent: t("ah_did_turn", rc(last.cell)) }));
      else if (last?.type === "open") paras.push(h("p", { textContent: t("ah_did_open") }));
      paras.push(h("p", { class: "status", textContent: statusText() }));
    }
    ran.replaceChildren(...paras);
  }

  function end_(): void {
    host.chime();
    say("hudhud", "ah_done_1");
    const slack = CHANNELS_SLACK[state.style];
    const g = channelsGoals(state, slack);
    host.finish(g);
    const goal = (mark: string, name: Key, how: string, met: boolean) => h("li", {}, h("span", { class: "mark", textContent: mark }), h("span", {}, h("strong", { textContent: t(name) }), h("br", {}), h("span", { class: "small", textContent: how })), h("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    const best = fewestFromStart(state);
    const how = slack === null ? t("ah_goal_ingenuity_story") : slack.openings === null ? t("ah_goal_ingenuity_explorer", { m: num(best + slack.extra) }) : t("ah_goal_ingenuity_challenge", { m: num(best + slack.extra), c: num(slack.openings) });
    const names: Key[] = ["ah_rec_alhambra", "ah_rec_palaces"];
    const title = h("h3", { textContent: t("results_title"), tabIndex: -1 });
    results.replaceChildren(
      title,
      h("p", { textContent: style() === "challenge" ? t("ah_progress_open", { moves: num(g.turns), openings: num(g.slips) }) : t("ah_progress", { moves: num(g.turns) }) }),
      h("ul", { class: "goals" }, goal("✦", "goal_curiosity", t("ah_goal_curiosity_how"), g.curiosity), goal("⚙", "goal_ingenuity", how, g.ingenuity), goal("♥", "goal_kindness", t("ah_goal_kindness_how"), g.kindness), goal("❧", "goal_feather", t("ah_goal_feather_how"), g.feather)),
      h(
        "div",
        { class: "note" },
        h("h3", { textContent: t("note_title") }),
        h("p", { textContent: t("ah_note_1") }),
        h("p", { textContent: t("ah_note_2") }),
        h("p", { textContent: t("ah_note_3") }),
        h("p", { textContent: t("ah_note_4") }),
        h("p", { class: "pending", textContent: t("ah_review") }),
        ...CHANNELS_RECORDS.map((id, i) => h("p", {}, h("a", { href: `${host.museum}/${host.lang}/${id}/`, textContent: t("note_link", { name: t(names[i]!) }) }))),
      ),
      h("p", { class: "row" }, h("button", { type: "button", class: "primary", textContent: t("btn_atlas"), onclick: () => host.leave() }), h("button", { type: "button", textContent: t("play_again"), onclick: () => again() })),
    );
    results.hidden = false;
    title.focus({ preventScroll: false });
  }

  function again(): void {
    stopTimer();
    answered = false;
    marked = null;
    fill = Infinity;
    state = newChannels(host.style(), channelsGrid(host.style()));
    host.keepPlace?.(null);
    ran.replaceChildren();
    said.replaceChildren();
    results.hidden = true;
    results.replaceChildren();
    say("hudhud", "ah_intro_1");
    say("keeper", "ah_intro_2");
    draw();
    showResult();
    heading.focus({ preventScroll: true });
  }

  function command(c: ChannelsCommand): void {
    const before = state;
    state = applyChannels(state, c);
    if (state === before) return;
    if (c.type === "turn") {
      marked = c.cell;
      host.tick();
    }
    // A grid with a turn made, a sluice opened, or a question asked is worth keeping; a grid that was just finished
    // is finished, and the host clears its place.
    if (!state.done && (state.moves > 0 || state.openings > 0 || state.flags.length > 0)) host.keepPlace?.(snapshotChannels(state));
    draw();
    if (c.type !== "flag") {
      runWater();
      showResult();
      if (state.done) end_();
    }
  }

  /** A piece pressed, by its button or by a touch on the picture: it gets a quarter turn. A piece that looks the same turned is told so and nothing is counted. */
  function press(p: number): void {
    if (state.done) return;
    if (!turnable(state.cells[p]!.kind)) {
      ran.replaceChildren(h("p", { textContent: t("ah_fixed", rc(p)) }));
      return;
    }
    command({ type: "turn", cell: p });
  }
  function touch(x: number, y: number): void {
    const p = channelsHit(x, y, state.rows, state.cols, rtl);
    if (p !== null) press(p);
  }
  canvas.addEventListener("click", (e) => {
    const r = canvas.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    touch(((e.clientX - r.left) / r.width) * CHANNELS_ART.w, ((e.clientY - r.top) / r.height) * CHANNELS_ART.h);
  });

  const node = h("div", { class: "bench-inner" }, heading, h("p", { class: "small", textContent: t("ah_trial") }), objective, canvas, hint, progress, gridBox, sluiceRow, ran, table, said, asks, results);
  say("hudhud", "ah_intro_1");
  say("keeper", "ah_intro_2");
  draw();
  showResult();
  return {
    node,
    state: () => state,
    command,
    status: () => statusText(),
    selected: () => null,
    touch,
    busy: () => running,
    stop: () => stopTimer(),
  };
}
