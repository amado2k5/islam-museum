// The animal cards' page: a sixth trial quest. It is ordinary page from top to bottom, so that it can be played by
// keyboard, pointer, touch or screen reader alike: a picture of the trays and cards, a key in words that says which
// tray is which group, a list of choices for every card, a button that shows the cards to al-Jahiz, and words for
// everything that happens. Pressing a card in the picture and then a tray does the same as the list of choices. The
// rules are in sim/sort.ts.
import { drawSort, SORT_ART, sortCanvas, sortHit } from "../art/sort";
import { SORT_RECORDS, SORT_SLACK, sortDef } from "../content/sort";
import { applySort, newSort, sortGoals, snapshotSort, unplaced, wrongOnes, type SortCommand, type SortFlag, type SortState, type SortStyle } from "../sim/sort";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;
export interface SortHost {
  t(key: Key, vars?: Record<string, string | number>): string;
  num(n: number): string;
  lang: string;
  museum: string;
  /** The subject's name, for the heading. */
  title: string;
  style(): SortStyle;
  /** A small sound for a card placed, and one for the end. Neither needs a caption: the page says both in words. */
  tick(): void;
  chime(): void;
  /** The quest is finished: its goals are written into the save. */
  finish(r: { turns: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean }): void;
  leave(): void;
  /** A sorting put back from what was kept, to go on from; null or absent for a new one. */
  resume?: SortState | null;
  /** The sorting changed in a way worth keeping (its snapshot), or it is finished or started again (null). */
  keepPlace?(snap: unknown | null): void;
}
export interface SortQuest {
  node: HTMLElement;
  state(): SortState;
  command(c: SortCommand): void;
  /** What the page says now after the last command, in words. */
  status(): string;
  /** The card chosen on the picture, or null. */
  selected(): string | null;
  /** A touch or click at a point of the picture's own 1000 by 460 space, as on the canvas. */
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

export function sortQuest(host: SortHost): SortQuest {
  const { t, num } = host;
  const rtl = host.lang === "ar" || host.lang === "ur";
  let state = host.resume ?? newSort(host.style(), sortDef(host.style()));
  let answered = state.flags.includes("answered") || state.flags.includes("kind"); // the girl has been answered, kindly or not
  let hoopoeSaid = state.flags.includes("askedDivision") && state.flags.includes("askedBirds"); // said once both questions have been asked
  let selected: string | null = null; // the card chosen on the picture
  let said_ = ""; // what the page said last about a command, for the test hook
  const list = (names: string[]) => names.join(rtl ? "، " : ", ");
  const card = (id: string) => t(`jz_c_${id}` as Key);
  const groupName = (g: string) => t(`jz_g_${g}` as Key);
  const trayLine = (g: string) => t("jz_tray_line", { n: num(state.groups.indexOf(g) + 1), name: groupName(g) });

  const heading = h("h2", { textContent: host.title, tabIndex: -1 });
  const objective = h("p", { class: "objective-line", textContent: t("jz_objective") });
  const canvas = sortCanvas();
  canvas.className = "sort-art";
  canvas.setAttribute("role", "img");
  const keyTitle = h("h3", { textContent: t("jz_key_title") });
  const keyList = h("ol", { class: "tray-key" });
  const hint = h("p", { class: "small" });
  const progress = h("p", { class: "small" });
  const places = h("ul", { class: "places" });
  places.setAttribute("aria-label", t("jz_cards_group"));
  const showRow = h("p", { class: "row" });
  const ran = h("div", { class: "ran" });
  ran.setAttribute("aria-live", "polite");
  const said = h("div", { class: "said" });
  said.setAttribute("aria-live", "polite");
  const asks = h("p", { class: "row" });
  const results = h("section", { class: "results", hidden: true });
  const selects = new Map<string, HTMLSelectElement>();

  const say = (who: "hudhud" | "jahiz" | "girl" | "narrator", key: Key, ...more: Node[]) => {
    said.append(h("p", { class: `by-${who}` }, h("strong", { textContent: `${t(`jz_who_${who}` as Key)}: ` }), t(key), ...more));
    while (said.children.length > 9) said.firstChild?.remove();
  };
  const flag = (f: SortFlag) => command({ type: "flag", flag: f });

  // The key, in real HTML, is made once: which tray is which group does not change.
  keyList.replaceChildren(...state.groups.map((g) => h("li", { textContent: trayLine(g) })));
  // One list of choices for every card, made once; the values are brought up to date by `draw`.
  for (const item of state.items) {
    const select = h("select", { onchange: () => command({ type: "place", item, group: select.value === "" ? null : select.value }) });
    select.dataset.item = item;
    select.append(h("option", { value: "", textContent: t("jz_not_placed") }));
    for (const g of state.groups) select.append(h("option", { value: g, textContent: trayLine(g) }));
    selects.set(item, select);
    places.append(h("li", {}, h("label", {}, h("span", { textContent: t("jz_where", { card: card(item) }) }), select)));
  }

  /** What the page says after a command: what it did, and then, for a showing, what is not right in the way of playing's own words. */
  function showResult(): void {
    const last = state.last;
    const paras: HTMLElement[] = [];
    if (last?.type === "place") paras.push(h("p", { textContent: last.group === null ? t("jz_did_unplace", { card: card(last.item) }) : t("jz_did_place", { card: card(last.item), name: groupName(last.group) }) }));
    else if (last?.type === "show") {
      if (last.refused) paras.push(h("p", { class: "status", textContent: t("jz_refused", { n: num(last.unplaced) }) }));
      else if (state.done) paras.push(h("p", { class: "met status", textContent: t("jz_did_solved") }));
      else if (state.style === "story") paras.push(h("p", { class: "status", textContent: t("jz_wrong_story", { list: list(wrongOnes(state).map(card)) }) }));
      else if (state.style === "explorer") paras.push(h("p", { class: "status", textContent: t("jz_wrong_explorer", { n: num(last.right), total: num(last.total) }) }));
      else paras.push(h("p", { class: "status", textContent: t("jz_wrong_challenge") }));
    }
    said_ = paras.map((p) => p.textContent).join(" ");
    ran.replaceChildren(...paras);
  }

  function drawAsks(): void {
    const has = (f: SortFlag) => state.flags.includes(f);
    const asked = (f: SortFlag, key: Key) => () => {
      say("narrator", key);
      flag(f);
      // The hoopoe is said once, after the second of the two questions.
      if (!hoopoeSaid && state.flags.includes("askedDivision") && state.flags.includes("askedBirds")) {
        hoopoeSaid = true;
        say("narrator", "jz_hoopoe_1");
        say("hudhud", "jz_hoopoe_2");
      }
    };
    asks.replaceChildren(
      h("button", { type: "button", textContent: t("jz_ask_division"), onclick: asked("askedDivision", "jz_divide_1") }),
      h("button", { type: "button", textContent: t("jz_ask_birds"), onclick: asked("askedBirds", "jz_birds_1") }),
      h("button", {
        type: "button",
        textContent: t("jz_talk_girl"),
        disabled: answered,
        onclick: () => {
          const answer = (kind: boolean) => () => {
            answered = true;
            choices.remove();
            say("hudhud", kind ? "jz_girl_kind" : "jz_girl_blunt");
            say("girl", kind ? "jz_girl_kind_r" : "jz_girl_blunt_r");
            // Either answer is kept, so that a resume does not ask again; only the kind one is a goal.
            if (kind) flag("kind");
            flag("answered");
          };
          const choices = h("span", { class: "row" }, h("button", { type: "button", textContent: t("jz_girl_kind"), onclick: answer(true) }), h("button", { type: "button", textContent: t("jz_girl_blunt"), onclick: answer(false) }));
          say("girl", "jz_girl_1", choices);
          (choices.firstChild as HTMLElement).focus({ preventScroll: true });
        },
      }),
      h("button", { type: "button", textContent: t("jz_look_feather"), onclick: () => (say("hudhud", has("feather") ? "jz_feather_again" : "jz_feather_1"), flag("feather")) }),
    );
    showRow.replaceChildren(h("button", { type: "button", class: "primary", textContent: t("jz_show"), disabled: state.done, onclick: () => command({ type: "show" }) }));
  }

  function draw(): void {
    const placedAt = state.items.map((i) => (state.placed[i] === null ? null : state.groups.indexOf(state.placed[i]!)));
    const inTrays = state.items.length - unplaced(state).length;
    canvas.setAttribute("aria-label", t("jz_picture", { groups: num(state.groups.length), placed: num(inTrays), cards: num(state.items.length) }));
    hint.textContent = state.done ? "" : selected === null ? t("jz_tap_hint") : t("jz_chosen", { card: card(selected) });
    progress.textContent = state.style === "story" ? t("jz_progress", { placed: num(inTrays), total: num(state.items.length) }) : t("jz_progress_shows", { placed: num(inTrays), total: num(state.items.length), shows: num(state.shows) });
    drawSort(canvas, { items: state.items, placed: placedAt, groups: state.groups.length, rtl, selected: selected === null ? null : state.items.indexOf(selected), done: state.done });
    for (const [item, select] of selects) {
      select.value = state.placed[item] ?? "";
      select.disabled = state.done;
    }
    drawAsks();
  }

  function end_(): void {
    host.chime();
    say("hudhud", "jz_done_1");
    const slack = SORT_SLACK[state.style];
    const g = sortGoals(state, slack);
    host.finish(g);
    const goal = (mark: string, name: Key, how: string, met: boolean) => h("li", {}, h("span", { class: "mark", textContent: mark }), h("span", {}, h("strong", { textContent: t(name) }), h("br", {}), h("span", { class: "small", textContent: how })), h("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    const how = slack === null ? t("jz_goal_ingenuity_story") : t("jz_goal_ingenuity_shows", { c: num(slack.shows) });
    const names: Key[] = ["jz_rec_person", "jz_rec_book"];
    const title = h("h3", { textContent: t("results_title"), tabIndex: -1 });
    results.replaceChildren(
      title,
      h("p", { textContent: state.style === "story" ? t("jz_progress", { placed: num(state.items.length), total: num(state.items.length) }) : t("jz_progress_shows", { placed: num(state.items.length), total: num(state.items.length), shows: num(g.slips) }) }),
      h("ul", { class: "goals" }, goal("✦", "goal_curiosity", t("jz_goal_curiosity_how"), g.curiosity), goal("⚙", "goal_ingenuity", how, g.ingenuity), goal("♥", "goal_kindness", t("jz_goal_kindness_how"), g.kindness), goal("❧", "goal_feather", t("jz_goal_feather_how"), g.feather)),
      h(
        "div",
        { class: "note" },
        h("h3", { textContent: t("note_title") }),
        h("p", { textContent: t("jz_note_1") }),
        h("p", { textContent: t("jz_note_2") }),
        h("p", { textContent: t("jz_note_3") }),
        h("p", { textContent: t("jz_note_4") }),
        h("p", { class: "pending", textContent: t("jz_review") }),
        ...SORT_RECORDS.map((id, i) => h("p", {}, h("a", { href: `${host.museum}/${host.lang}/${id}/`, textContent: t("note_link", { name: t(names[i]!) }) }))),
      ),
      h("p", { class: "row" }, h("button", { type: "button", class: "primary", textContent: t("btn_atlas"), onclick: () => host.leave() }), h("button", { type: "button", textContent: t("play_again"), onclick: () => again() })),
    );
    results.hidden = false;
    title.focus({ preventScroll: false });
  }

  function again(): void {
    answered = false;
    hoopoeSaid = false;
    selected = null;
    state = newSort(host.style(), sortDef(host.style()));
    host.keepPlace?.(null);
    ran.replaceChildren();
    said.replaceChildren();
    results.hidden = true;
    results.replaceChildren();
    say("hudhud", "jz_intro_1");
    say("jahiz", "jz_intro_2");
    draw();
    showResult();
    heading.focus({ preventScroll: true });
  }

  function command(c: SortCommand): void {
    const before = state;
    state = applySort(state, c);
    if (state === before) return;
    if (c.type === "place") {
      selected = null;
      host.tick();
    }
    // A sorting with a card placed, a showing counted, or a question asked is worth keeping; one that has just been
    // finished is finished, and the host clears its place.
    if (!state.done && (state.moves > 0 || state.shows > 0 || state.flags.length > 0)) host.keepPlace?.(snapshotSort(state));
    draw();
    if (c.type !== "flag") {
      showResult();
      if (state.done) end_();
    }
  }

  /** The card the touch is on is chosen (or let go, if it is the chosen one); a tray touched while a card is chosen takes it; the band along the bottom takes it out of its tray. */
  function touch(x: number, y: number): void {
    if (state.done) return;
    const placedAt = state.items.map((i) => (state.placed[i] === null ? null : state.groups.indexOf(state.placed[i]!)));
    const spot = sortHit(x, y, { items: state.items, placed: placedAt, groups: state.groups.length, rtl });
    if (spot === null) return;
    if (spot.type === "card") {
      const item = state.items[spot.item]!;
      selected = selected === item ? null : item;
      draw();
      if (selected === null) ran.replaceChildren(h("p", { textContent: t("jz_let_go") }));
    } else if (selected !== null) {
      command({ type: "place", item: selected, group: spot.type === "tray" ? state.groups[spot.group]! : null });
    }
  }
  canvas.addEventListener("click", (e) => {
    const r = canvas.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    touch(((e.clientX - r.left) / r.width) * SORT_ART.w, ((e.clientY - r.top) / r.height) * SORT_ART.h);
  });

  const node = h("div", { class: "bench-inner" }, heading, h("p", { class: "small", textContent: t("jz_trial") }), objective, canvas, keyTitle, keyList, hint, progress, places, showRow, ran, said, asks, results);
  say("hudhud", "jz_intro_1");
  say("jahiz", "jz_intro_2");
  draw();
  showResult();
  return { node, state: () => state, command, status: () => said_, selected: () => selected, touch, busy: () => false, stop: () => undefined };
}
