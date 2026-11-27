// The page of a sorting quest, shared by the quests that use the sorting rules (sim/sort.ts): the animal cards of
// al-Jahiz (ui/sort.ts) and the shelves of coffee (ui/coffee.ts). It is ordinary page from top to bottom, so that it can
// be played by keyboard, pointer, touch or screen reader alike: a picture of the trays (or shelves) and cards, a key in
// words that says which tray is which group, a list of choices for every card, a button that shows the cards, and words
// for everything that happens. Pressing a card in the picture and then a tray does the same as the list of choices.
// What differs between the quests is the spec each hands in: its picture, its cards and groups, its strings, its two
// questions, its speakers and its notes. Nothing here names an animal, a person or a record.
import type { SortSpot, SortView } from "../art/sort";
import { applySort, newSort, sortGoals, snapshotSort, unplaced, wrongOnes, type SortCommand, type SortDef, type SortFlag, type SortSlack, type SortState, type SortStyle } from "../sim/sort";
import en from "../../i18n/en.json";

export type Key = Exclude<keyof typeof en, "_meta">;
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
  /** A touch or click at a point of the picture's own space, as on the canvas. */
  touch(x: number, y: number): void;
  /** Always false: nothing here is shown step by step. Kept so that every quest on a page has the same shape. */
  busy(): boolean;
  stop(): void;
}

/** The four speakers of a sorting quest: Hudhud, the voice of the subject (al-Jahiz, the keeper of the records), the child who has the cards, and the narrator who reads the museum's record. */
export type Who = "hudhud" | "voice" | "kid" | "narrator";

/** Everything that tells one sorting quest's page from another's. */
export interface SortSpec {
  /** The picture: its canvas, how it is drawn, what lies under a point of it, and its own size. */
  art: { canvas(): HTMLCanvasElement; draw(canvas: HTMLCanvasElement, v: SortView): void; hit(x: number, y: number, v: Pick<SortView, "items" | "placed" | "groups" | "rtl">): SortSpot | null; w: number; h: number };
  def(style: SortStyle): SortDef;
  slack: Record<SortStyle, SortSlack | null>;
  /** The museum records the note links to, and the words for each link. */
  records: readonly string[];
  recNames: readonly Key[];
  /** The short name of a card, and of a group. */
  name(card: string): Key;
  group(g: string): Key;
  /** The label of a card's list of choices, from the card's number (from 1) and its name. */
  label(card: string, n: number, t: SortHost["t"], num: SortHost["num"]): string;
  /** The list of choices is a numbered list (an ordered list whose items begin with the card's number) with an optional heading above it. */
  numbered: boolean;
  listTitle?: Key;
  /** The css classes of the speakers: the voice (al-Jahiz, the keeper) and the child. */
  cls: { voice: string; kid: string };
  /** Lines said once, after the second question has been asked. */
  afterBoth?: readonly { who: Who; key: Key }[];
  who: Record<Who, Key>;
  k: {
    trial: Key; objective: Key; picture: Key; cardsGroup: Key; notPlaced: Key; keyTitle: Key; groupLine: Key; tapHint: Key; chosen: Key; letGo: Key;
    progress: Key; progressShows: Key; show: Key; didPlace: Key; didUnplace: Key; refused: Key; wrongStory: Key; wrongExplorer: Key; wrongChallenge: Key; didSolved: Key;
    goalCuriosityHow: Key; goalIngenuityStory: Key; goalIngenuityShows: Key; goalKindnessHow: Key; goalFeatherHow: Key;
    askA: Key; askB: Key; answerA: Key; answerB: Key; talk: Key; kid1: Key; kidKind: Key; kidBlunt: Key; kidKindR: Key; kidBluntR: Key; look: Key; feather1: Key; featherAgain: Key;
    intro1: Key; intro2: Key; done1: Key; review: Key;
  };
  notes: readonly Key[];
}

const h = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Partial<HTMLElementTagNameMap[K]> & { class?: string } = {}, ...children: Array<Node | string | null | false>): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  const { class: cls, ...rest } = props;
  if (cls) node.className = cls;
  Object.assign(node, rest);
  for (const c of children) if (c !== null && c !== false) node.append(c);
  return node;
};

export function sortPage(host: SortHost, spec: SortSpec): SortQuest {
  const { t, num } = host;
  const k = spec.k;
  const rtl = host.lang === "ar" || host.lang === "ur";
  let state = host.resume ?? newSort(host.style(), spec.def(host.style()));
  let answered = state.flags.includes("answered") || state.flags.includes("kind"); // the child has been answered, kindly or not
  let afterSaid = state.flags.includes("askedDivision") && state.flags.includes("askedBirds"); // the lines for after both questions, said once
  let selected: string | null = null; // the card chosen on the picture
  let said_ = ""; // what the page said last about a command, for the test hook
  const list = (names: string[]) => names.join(rtl ? "، " : ", ");
  const card = (id: string) => t(spec.name(id));
  const groupName = (g: string) => t(spec.group(g));
  const groupLine = (g: string) => t(k.groupLine, { n: num(state.groups.indexOf(g) + 1), name: groupName(g) });
  const view = (): SortView => ({ items: state.items, placed: state.items.map((i) => (state.placed[i] === null ? null : state.groups.indexOf(state.placed[i]!))), groups: state.groups.length, rtl, selected: selected === null ? null : state.items.indexOf(selected), done: state.done });

  const heading = h("h2", { textContent: host.title, tabIndex: -1 });
  const objective = h("p", { class: "objective-line", textContent: t(k.objective) });
  const canvas = spec.art.canvas();
  canvas.className = "sort-art";
  canvas.setAttribute("role", "img");
  const keyTitle = h("h3", { textContent: t(k.keyTitle) });
  const keyList = h("ol", { class: "tray-key" });
  const hint = h("p", { class: "small" });
  const progress = h("p", { class: "small" });
  const places = h(spec.numbered ? "ol" : "ul", { class: "places" });
  places.setAttribute("aria-label", t(k.cardsGroup));
  const showRow = h("p", { class: "row" });
  const ran = h("div", { class: "ran" });
  ran.setAttribute("aria-live", "polite");
  const said = h("div", { class: "said" });
  said.setAttribute("aria-live", "polite");
  const asks = h("p", { class: "row" });
  const results = h("section", { class: "results", hidden: true });
  const selects = new Map<string, HTMLSelectElement>();

  const say = (who: Who, key: Key, ...more: Node[]) => {
    const css = who === "voice" ? spec.cls.voice : who === "kid" ? spec.cls.kid : who;
    said.append(h("p", { class: `by-${css}` }, h("strong", { textContent: `${t(spec.who[who])}: ` }), t(key), ...more));
    while (said.children.length > 9) said.firstChild?.remove();
  };
  const flag = (f: SortFlag) => command({ type: "flag", flag: f });

  // The key, in real HTML, is made once: which tray is which group does not change.
  keyList.replaceChildren(...state.groups.map((g) => h("li", { textContent: groupLine(g) })));
  // One list of choices for every card, made once; the values are brought up to date by `draw`.
  state.items.forEach((item, i) => {
    const select = h("select", { onchange: () => command({ type: "place", item, group: select.value === "" ? null : select.value }) });
    select.dataset.item = item;
    select.append(h("option", { value: "", textContent: t(k.notPlaced) }));
    for (const g of state.groups) select.append(h("option", { value: g, textContent: groupLine(g) }));
    selects.set(item, select);
    places.append(h("li", {}, h("label", {}, h("span", { textContent: spec.label(item, i + 1, t, num) }), select)));
  });

  /** What the page says after a command: what it did, and then, for a showing, what is not right in the way of playing's own words. */
  function showResult(): void {
    const last = state.last;
    const paras: HTMLElement[] = [];
    if (last?.type === "place") paras.push(h("p", { textContent: last.group === null ? t(k.didUnplace, { card: card(last.item) }) : t(k.didPlace, { card: card(last.item), name: groupName(last.group) }) }));
    else if (last?.type === "show") {
      if (last.refused) paras.push(h("p", { class: "status", textContent: t(k.refused, { n: num(last.unplaced) }) }));
      else if (state.done) paras.push(h("p", { class: "met status", textContent: t(k.didSolved) }));
      else if (state.style === "story") paras.push(h("p", { class: "status", textContent: t(k.wrongStory, { list: list(wrongOnes(state).map(card)) }) }));
      else if (state.style === "explorer") paras.push(h("p", { class: "status", textContent: t(k.wrongExplorer, { n: num(last.right), total: num(last.total) }) }));
      else paras.push(h("p", { class: "status", textContent: t(k.wrongChallenge) }));
    }
    said_ = paras.map((p) => p.textContent).join(" ");
    ran.replaceChildren(...paras);
  }

  function drawAsks(): void {
    const has = (f: SortFlag) => state.flags.includes(f);
    const asked = (f: SortFlag, key: Key) => () => {
      say("narrator", key);
      flag(f);
      // The lines for after both questions are said once, after the second of the two.
      if (!afterSaid && state.flags.includes("askedDivision") && state.flags.includes("askedBirds")) {
        afterSaid = true;
        for (const line of spec.afterBoth ?? []) say(line.who, line.key);
      }
    };
    asks.replaceChildren(
      h("button", { type: "button", textContent: t(k.askA), onclick: asked("askedDivision", k.answerA) }),
      h("button", { type: "button", textContent: t(k.askB), onclick: asked("askedBirds", k.answerB) }),
      h("button", {
        type: "button",
        textContent: t(k.talk),
        disabled: answered,
        onclick: () => {
          const answer = (kind: boolean) => () => {
            answered = true;
            choices.remove();
            say("hudhud", kind ? k.kidKind : k.kidBlunt);
            say("kid", kind ? k.kidKindR : k.kidBluntR);
            // Either answer is kept, so that a resume does not ask again; only the kind one is a goal.
            if (kind) flag("kind");
            flag("answered");
          };
          const choices = h("span", { class: "row" }, h("button", { type: "button", textContent: t(k.kidKind), onclick: answer(true) }), h("button", { type: "button", textContent: t(k.kidBlunt), onclick: answer(false) }));
          say("kid", k.kid1, choices);
          (choices.firstChild as HTMLElement).focus({ preventScroll: true });
        },
      }),
      h("button", { type: "button", textContent: t(k.look), onclick: () => (say("hudhud", has("feather") ? k.featherAgain : k.feather1), flag("feather")) }),
    );
    showRow.replaceChildren(h("button", { type: "button", class: "primary", textContent: t(k.show), disabled: state.done, onclick: () => command({ type: "show" }) }));
  }

  function draw(): void {
    const inTrays = state.items.length - unplaced(state).length;
    canvas.setAttribute("aria-label", t(k.picture, { groups: num(state.groups.length), placed: num(inTrays), cards: num(state.items.length) }));
    hint.textContent = state.done ? "" : selected === null ? t(k.tapHint) : t(k.chosen, { card: card(selected) });
    progress.textContent = state.style === "story" ? t(k.progress, { placed: num(inTrays), total: num(state.items.length) }) : t(k.progressShows, { placed: num(inTrays), total: num(state.items.length), shows: num(state.shows) });
    spec.art.draw(canvas, view());
    for (const [item, select] of selects) {
      select.value = state.placed[item] ?? "";
      select.disabled = state.done;
    }
    drawAsks();
  }

  function end_(): void {
    host.chime();
    say("hudhud", k.done1);
    const slack = spec.slack[state.style];
    const g = sortGoals(state, slack);
    host.finish(g);
    const goal = (mark: string, name: Key, how: string, met: boolean) => h("li", {}, h("span", { class: "mark", textContent: mark }), h("span", {}, h("strong", { textContent: t(name) }), h("br", {}), h("span", { class: "small", textContent: how })), h("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    const how = slack === null ? t(k.goalIngenuityStory) : t(k.goalIngenuityShows, { c: num(slack.shows) });
    const title = h("h3", { textContent: t("results_title"), tabIndex: -1 });
    results.replaceChildren(
      title,
      h("p", { textContent: state.style === "story" ? t(k.progress, { placed: num(state.items.length), total: num(state.items.length) }) : t(k.progressShows, { placed: num(state.items.length), total: num(state.items.length), shows: num(g.slips) }) }),
      h("ul", { class: "goals" }, goal("✦", "goal_curiosity", t(k.goalCuriosityHow), g.curiosity), goal("⚙", "goal_ingenuity", how, g.ingenuity), goal("♥", "goal_kindness", t(k.goalKindnessHow), g.kindness), goal("❧", "goal_feather", t(k.goalFeatherHow), g.feather)),
      h(
        "div",
        { class: "note" },
        h("h3", { textContent: t("note_title") }),
        ...spec.notes.map((n) => h("p", { textContent: t(n) })),
        h("p", { class: "pending", textContent: t(k.review) }),
        ...spec.records.map((id, i) => h("p", {}, h("a", { href: `${host.museum}/${host.lang}/${id}/`, textContent: t("note_link", { name: t(spec.recNames[i]!) }) }))),
      ),
      h("p", { class: "row" }, h("button", { type: "button", class: "primary", textContent: t("btn_atlas"), onclick: () => host.leave() }), h("button", { type: "button", textContent: t("play_again"), onclick: () => again() })),
    );
    results.hidden = false;
    title.focus({ preventScroll: false });
  }

  function again(): void {
    answered = false;
    afterSaid = false;
    selected = null;
    state = newSort(host.style(), spec.def(host.style()));
    host.keepPlace?.(null);
    ran.replaceChildren();
    said.replaceChildren();
    results.hidden = true;
    results.replaceChildren();
    say("hudhud", k.intro1);
    say("voice", k.intro2);
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
    const spot = spec.art.hit(x, y, view());
    if (spot === null) return;
    if (spot.type === "card") {
      const item = state.items[spot.item]!;
      selected = selected === item ? null : item;
      draw();
      if (selected === null) ran.replaceChildren(h("p", { textContent: t(k.letGo) }));
    } else if (selected !== null) {
      command({ type: "place", item: selected, group: spot.type === "tray" ? state.groups[spot.group]! : null });
    }
  }
  canvas.addEventListener("click", (e) => {
    const r = canvas.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    touch(((e.clientX - r.left) / r.width) * spec.art.w, ((e.clientY - r.top) / r.height) * spec.art.h);
  });

  const node = h("div", { class: "bench-inner" }, heading, h("p", { class: "small", textContent: t(k.trial) }), objective, canvas, keyTitle, keyList, hint, progress, spec.listTitle ? h("h3", { textContent: t(spec.listTitle) }) : null, places, showRow, ran, said, asks, results);
  say("hudhud", k.intro1);
  say("voice", k.intro2);
  draw();
  showResult();
  return { node, state: () => state, command, status: () => said_, selected: () => selected, touch, busy: () => false, stop: () => undefined };
}
