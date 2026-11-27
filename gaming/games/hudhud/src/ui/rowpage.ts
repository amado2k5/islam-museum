// The page of a quest made of a row (sim/chainquest.ts), shared by the quests that put cards or leaves in order and set
// the row going: the paper of Samarkand (ui/paper.ts) and al-Razi's loose leaves (ui/leaves.ts). It is ordinary page from
// top to bottom, so that it can be played by keyboard, pointer, touch or screen reader alike: a picture of the row, one
// choice for each place, a button that sets the row going, and words for everything that happens. Pressing two places
// in the picture exchanges them, as the lists of choices can. What differs between the quests is the spec each hands in:
// its picture, its row, its rules, its strings, its two questions, its speakers and its notes. Nothing here names a
// step, a leaf, a person or a record.
import type { PaperView } from "../art/paper";
import type { ChainPuzzle } from "../sim/chain";
import type { ChainCommand, ChainGoals, ChainSnapshot, ChainState, ChainStyle } from "../sim/chainquest";
import en from "../../i18n/en.json";

export type Key = Exclude<keyof typeof en, "_meta">;
export interface RowHost<F extends string> {
  t(key: Key, vars?: Record<string, string | number>): string;
  num(n: number): string;
  lang: string;
  museum: string;
  /** The subject's name, for the heading. */
  title: string;
  style(): ChainStyle;
  reducedMotion(): boolean;
  /** A small sound for a step of the run, and one for the end. Neither needs a caption: the page says both in words. */
  tick(): void;
  chime(): void;
  /** The quest is finished: its goals are written into the save. */
  finish(r: { turns: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean }): void;
  leave(): void;
  /** A quest put back from what was kept, to go on from; null or absent for a new one. */
  resume?: ChainState<F> | null;
  /** The quest changed in a way worth keeping (its snapshot), or it is finished or started again (null). */
  keepPlace?(snap: unknown | null): void;
}
export interface RowQuest<F extends string> {
  node: HTMLElement;
  state(): ChainState<F>;
  command(c: ChainCommand<F>): void;
  /** True while a run is being shown step by step. */
  busy(): boolean;
  /** The place chosen on the picture, or null. */
  selected(): number | null;
  /** What the page says under the picture about the place chosen. */
  status(): string;
  stop(): void;
}

/** The four speakers of a row quest: Hudhud, the voice of the maker (the papermaker, al-Razi), the child who helps, and the narrator who reads the museum's record. */
export type Who = "hudhud" | "voice" | "kid" | "narrator";

/** Everything that tells one row quest's page from another's. */
export interface RowSpec<F extends string> {
  /** The picture: its canvas, how it is drawn, what lies under a point of it, its own size, and its css class. */
  art: { canvas(): HTMLCanvasElement; draw(canvas: HTMLCanvasElement, v: PaperView): void; hit(x: number, y: number, n: number, rtl: boolean): number | null; w: number; h: number; cls: string };
  /** The css class of the list of places. */
  placesCls: string;
  puzzle(style: ChainStyle): ChainPuzzle;
  rules: {
    newState(style: ChainStyle, puzzle: ChainPuzzle): ChainState<F>;
    apply(s: ChainState<F>, c: ChainCommand<F>): ChainState<F>;
    goals(s: ChainState<F>, slack: number | null): ChainGoals;
    snapshot(s: ChainState<F>): ChainSnapshot<F>;
  };
  slack: Record<ChainStyle, number | null>;
  /** The museum records the note links to, and the words for each link. */
  records: readonly string[];
  recNames: readonly Key[];
  /** The name of a card or leaf, and the sentence for what it does when the row runs through it. */
  part(id: string): Key;
  did(id: string): Key;
  /** What a failed run says in Story (what the place where it stopped needs) and in Explorer (what reached it), from what reached it. */
  needs(carrying: string): Key;
  reached(carrying: string): Key;
  /** The two questions: the flag each sets, its button and the narrator's answer. */
  asks: readonly [{ flag: F; button: Key; answer: Key }, { flag: F; button: Key; answer: Key }];
  /** The css classes of the speakers: the voice and the child. */
  cls: { voice: string; kid: string };
  who: Record<Who, Key>;
  k: {
    trial: Key; objective: Key; moves: Key; picture: Key; place: Key; go: Key; tapHint: Key; chosen: Key;
    endDone: Key; endIdle: Key; needs: Key; reached: Key;
    talk: Key; kid1: Key; kidKind: Key; kidBlunt: Key; kidKindR: Key; kidBluntR: Key; look: Key; feather1: Key; featherAgain: Key;
    intro1: Key; intro2: Key; done1: Key; review: Key;
    goalCuriosityHow: Key; goalIngenuityHow: Key; goalIngenuityStory: Key; goalKindnessHow: Key; goalFeatherHow: Key;
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

/** A row quest's page. Its flags must include, besides its two questions, `kind` (the child answered kindly, a goal), `feather` (a goal) and `answered` (the child answered at all). */
export function rowPage<F extends string>(host: RowHost<F>, spec: RowSpec<F>): RowQuest<F> {
  type Flag = F;
  const common = (f: "kind" | "feather" | "answered") => f as string as F;
  const { t, num } = host;
  const k = spec.k;
  const rtl = host.lang === "ar" || host.lang === "ur";
  let state = host.resume ?? spec.rules.newState(host.style(), spec.puzzle(host.style()));
  let selected: number | null = null; // the place chosen on the picture
  let shown = 0; // how many steps of the last run have been shown
  let timer = 0;
  let running = false;
  let answered = state.flags.includes(common("answered")) || state.flags.includes(common("kind")); // the child has been answered, kindly or not

  const card = (id: string) => t(spec.part(id));

  const heading = h("h2", { textContent: host.title, tabIndex: -1 });
  const objective = h("p", { class: "objective-line", textContent: t(k.objective) });
  const moves = h("p", { class: "small" });
  const canvas = spec.art.canvas();
  canvas.className = spec.art.cls;
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", t(k.picture, { n: num(state.puzzle.places.length) }));
  canvas.style.cursor = "pointer";
  canvas.style.touchAction = "manipulation";
  const tapHint = h("p", { class: "small" });
  tapHint.setAttribute("aria-live", "polite");
  const places = h("ol", { class: `places ${spec.placesCls}` });
  const go = h("button", { type: "button", class: "primary", textContent: t(k.go), onclick: () => command({ type: "go" }) });
  const story = h("div", { class: "ran" });
  story.setAttribute("aria-live", "polite");
  const said = h("div", { class: "said" });
  said.setAttribute("aria-live", "polite");
  const asks = h("p", { class: "row" });
  const results = h("section", { class: "results", hidden: true });

  const say = (who: Who, key: Key, ...more: Node[]) => {
    const css = who === "voice" ? spec.cls.voice : who === "kid" ? spec.cls.kid : who;
    said.append(h("p", { class: `by-${css}` }, h("strong", { textContent: `${t(spec.who[who])}: ` }), t(key), ...more));
    while (said.children.length > 7) said.firstChild?.remove();
  };
  const flag = (f: Flag) => command({ type: "flag", flag: f });

  function drawAsks(): void {
    const has = (f: Flag) => state.flags.includes(f);
    const [a, b] = spec.asks;
    asks.replaceChildren(
      h("button", { type: "button", textContent: t(a.button), onclick: () => (say("narrator", a.answer), flag(a.flag)) }),
      h("button", { type: "button", textContent: t(b.button), onclick: () => (say("narrator", b.answer), flag(b.flag)) }),
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
            // Either answer is kept, so that a resume does not ask the child again; only the kind one is a goal.
            if (kind) flag(common("kind"));
            flag(common("answered"));
          };
          const choices = h("span", { class: "row" }, h("button", { type: "button", textContent: t(k.kidKind), onclick: answer(true) }), h("button", { type: "button", textContent: t(k.kidBlunt), onclick: answer(false) }));
          say("kid", k.kid1, choices);
          (choices.firstChild as HTMLElement).focus({ preventScroll: true });
        },
      }),
      h("button", { type: "button", textContent: t(k.look), onclick: () => (say("hudhud", has(common("feather")) ? k.featherAgain : k.feather1), flag(common("feather"))) }),
    );
  }

  function draw(): void {
    const p = state.puzzle;
    const focused = document.activeElement instanceof HTMLSelectElement ? Number(document.activeElement.dataset.place) : -1;
    places.replaceChildren(
      ...p.places.map((id, i) => {
        const select = h("select", { disabled: running || state.done, onchange: () => command({ type: "put", place: i, part: select.value }) });
        select.dataset.place = String(i);
        // The choices are listed by their names in the page's language, never in the order that solves the row.
        const byName = [...p.parts].sort((a, b) => card(a.id).localeCompare(card(b.id), host.lang));
        for (const x of byName) select.append(h("option", { value: x.id, textContent: card(x.id), selected: x.id === id }));
        return h("li", {}, h("label", {}, h("span", { textContent: `${t(k.place, { n: num(i + 1) })} ` }), select));
      }),
    );
    if (focused >= 0) (places.querySelector(`select[data-place="${focused}"]`) as HTMLElement | null)?.focus({ preventScroll: true });
    moves.textContent = t(k.moves, { n: num(state.moves) });
    go.disabled = running || state.done;
    if (selected !== null && (running || state.done)) selected = null;
    tapHint.textContent = selected === null ? t(k.tapHint) : t(k.chosen, { n: num(selected + 1) });
    const last = state.last;
    spec.art.draw(canvas, {
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
    const hit = spec.art.hit(((e.clientX - r.left) / r.width) * spec.art.w, ((e.clientY - r.top) / r.height) * spec.art.h, state.puzzle.places.length, rtl);
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
        story.append(h("p", { textContent: t(spec.did(last.moved[shown]!.part)) }));
        shown++;
        host.tick();
        draw();
        timer = window.setTimeout(step, host.reducedMotion() ? 0 : 750);
        return;
      }
      running = false;
      story.append(h("p", { class: last.end === "done" ? "met" : "stopped" }, h("strong", { textContent: last.end === "done" ? t(k.endDone) : t(k.endIdle, { n: num(last.at + 1) }) })));
      // How much a failed run explains depends on the way of playing: Story says what the place needs, Explorer what
      // reached it, Challenge nothing more than where it stopped.
      if (last.end !== "done") {
        if (state.style === "story") story.append(h("p", { textContent: t(k.needs, { what: t(spec.needs(last.carrying)) }) }));
        else if (state.style === "explorer") story.append(h("p", { textContent: t(k.reached, { what: t(spec.reached(last.carrying)) }) }));
      }
      if (state.done) end_();
      draw();
    };
    step();
  }

  function end_(): void {
    host.chime();
    say("hudhud", k.done1);
    const slack = spec.slack[state.style];
    const g = spec.rules.goals(state, slack);
    host.finish(g);
    const goal = (mark: string, name: Key, how: string, met: boolean) => h("li", {}, h("span", { class: "mark", textContent: mark }), h("span", {}, h("strong", { textContent: t(name) }), h("br", {}), h("span", { class: "small", textContent: how })), h("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    const title = h("h3", { textContent: t("results_title"), tabIndex: -1 });
    results.replaceChildren(
      title,
      h("p", { textContent: t(k.moves, { n: num(g.turns) }) }),
      h(
        "ul",
        { class: "goals" },
        goal("✦", "goal_curiosity", t(k.goalCuriosityHow), g.curiosity),
        goal("⚙", "goal_ingenuity", slack === null ? t(k.goalIngenuityStory) : t(k.goalIngenuityHow, { n: num(g.par + slack) }), g.ingenuity),
        goal("♥", "goal_kindness", t(k.goalKindnessHow), g.kindness),
        goal("❧", "goal_feather", t(k.goalFeatherHow), g.feather),
      ),
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
    window.clearTimeout(timer);
    running = false;
    answered = false;
    shown = 0;
    state = spec.rules.newState(host.style(), spec.puzzle(host.style()));
    selected = null;
    host.keepPlace?.(null);
    story.replaceChildren();
    said.replaceChildren();
    results.hidden = true;
    results.replaceChildren();
    say("hudhud", k.intro1);
    say("voice", k.intro2);
    draw();
    heading.focus({ preventScroll: true });
  }

  function command(c: ChainCommand<Flag>): void {
    if (running) return;
    const before = state;
    state = spec.rules.apply(state, c);
    if (state === before) return;
    if (c.type === "put") {
      story.replaceChildren();
      shown = 0;
      host.tick();
    }
    if (c.type !== "go") host.keepPlace?.(state.moves > 0 || state.flags.length > 0 ? spec.rules.snapshot(state) : null);
    if (c.type === "go") showRun();
    else draw();
  }

  const node = h("div", { class: "bench-inner" }, heading, h("p", { class: "small", textContent: t(k.trial) }), objective, canvas, tapHint, moves, places, h("p", {}, go), story, said, asks, results);
  say("hudhud", k.intro1);
  say("voice", k.intro2);
  draw();
  return { node, state: () => state, command, busy: () => running, selected: () => selected, status: () => tapHint.textContent ?? "", stop: () => window.clearTimeout(timer) };
}
