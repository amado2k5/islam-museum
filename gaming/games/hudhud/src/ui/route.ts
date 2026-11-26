// Ibn Battuta's page: an eighth trial quest, a stage of a traveller's road to be threaded stop by stop. It is ordinary page
// from top to bottom, so that it can be played by keyboard, pointer, touch or screen reader alike: a picture of the beads
// on their ring, the stage's sentence in words, one button for every bead, and words for everything that happens. The
// rules are in sim/route.ts; the stages are in content/route.ts. The picture is not a map and the page says so.
import { ROUTE_ART, drawRoute, routeCanvas, routeHit } from "../art/route";
import { ROUTE_RECORDS, routeStage, stopKey } from "../content/route";
import { ROUTE_SLACK, applyRoute, newRoute, nextStop, routeGoals, snapshotRoute, threaded, type RouteCommand, type RouteFlag, type RouteState, type RouteStyle } from "../sim/route";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;
export interface RouteHost {
  t(key: Key, vars?: Record<string, string | number>): string;
  num(n: number): string;
  lang: string;
  museum: string;
  /** The subject's name, for the heading. */
  title: string;
  style(): RouteStyle;
  reducedMotion(): boolean;
  /** A small sound for a step of the thread, and one for the end. Neither needs a caption: the page says both in words. */
  tick(): void;
  chime(): void;
  /** The quest is finished: its goals are written into the save. */
  finish(r: { turns: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean }): void;
  leave(): void;
  /** A quest put back from what was kept, to go on from; null or absent for a new one. */
  resume?: RouteState | null;
  /** The quest changed in a way worth keeping (its snapshot), or it is finished or started again (null). */
  keepPlace?(snap: unknown | null): void;
}
export interface RouteQuest {
  node: HTMLElement;
  state(): RouteState;
  command(c: RouteCommand): void;
  /** Nothing here is ever shown step by step, so this is always false; it is there because every quest on a page has it. */
  busy(): boolean;
  /** What the page says about the stage's sentence now: the sentence itself, or that it is hidden. */
  sentence(): string;
  /** What the page says under the picture about the last stop pressed. */
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

export function routeQuest(host: RouteHost): RouteQuest {
  const { t, num } = host;
  const rtl = host.lang === "ar" || host.lang === "ur";
  let state = host.resume ?? newRoute(host.style(), routeStage(host.style()));
  let answered = state.flags.includes("answered") || state.flags.includes("kind"); // the child has been answered, kindly or not

  const name = (id: string) => t(`ib_stop_${stopKey(id)}` as Key);
  const stages = { story: "ib_stage_story", explorer: "ib_stage_explorer", challenge: "ib_stage_challenge" } as const;

  const heading = h("h2", { textContent: host.title, tabIndex: -1 });
  const objective = h("p", { class: "objective-line", textContent: t("ib_objective") });
  const progress = h("p", { class: "small" });
  const canvas = routeCanvas();
  canvas.className = "route-art";
  canvas.setAttribute("role", "img");
  canvas.style.cursor = "pointer";
  canvas.style.touchAction = "manipulation";
  const tapHint = h("p", { class: "small", textContent: t("ib_tap_hint") });
  const stageBox = h("div", { class: "stage-text said" });
  stageBox.setAttribute("aria-live", "polite");
  const peekNote = h("p", { class: "small", textContent: t("ib_show_note") });
  const peekBtn = h("button", { type: "button", textContent: t("ib_show"), onclick: () => command({ type: "peek" }) });
  const beadsTitle = h("p", { class: "small", textContent: t("ib_beads_list") });
  const beads = h("ul", { class: "places route-beads" });
  beads.setAttribute("aria-label", t("ib_beads_list"));
  const ran = h("div", { class: "ran" });
  ran.setAttribute("aria-live", "polite");
  const said = h("div", { class: "said" });
  said.setAttribute("aria-live", "polite");
  const asks = h("p", { class: "row" });
  const results = h("section", { class: "results", hidden: true });

  const say = (who: "hudhud" | "ibn" | "child" | "narrator", key: Key, ...more: Node[]) => {
    said.append(h("p", { class: `by-${who}` }, h("strong", { textContent: `${t(`ib_who_${who}` as Key)}: ` }), t(key), ...more));
    while (said.children.length > 7) said.firstChild?.remove();
  };
  const flag = (f: RouteFlag) => command({ type: "flag", flag: f });

  // One button for every bead, in the ring's order, made once and changed in place so that the one pressed keeps the focus.
  const buttons = state.stage.stops.map((id, i) => {
    const b = h("button", { type: "button", onclick: () => command({ type: "go", stop: id }) });
    b.dataset.bead = String(i);
    b.dataset.stop = id;
    beads.append(h("li", {}, b));
    return b;
  });

  function drawAsks(): void {
    const has = (f: RouteFlag) => state.flags.includes(f);
    asks.replaceChildren(
      h("button", { type: "button", textContent: t("ib_ask_left"), onclick: () => (say("narrator", "ib_left_1"), flag("askedLeft")) }),
      h("button", { type: "button", textContent: t("ib_ask_written"), onclick: () => (say("narrator", "ib_written_1"), flag("askedWritten")) }),
      h("button", {
        type: "button",
        textContent: t("ib_talk_child"),
        disabled: answered,
        onclick: () => {
          const answer = (kind: boolean) => () => {
            answered = true;
            choices.remove();
            say("hudhud", kind ? "ib_child_kind" : "ib_child_blunt");
            say("child", kind ? "ib_child_kind_r" : "ib_child_blunt_r");
            // Either answer is kept, so that a resume does not ask the child again; only the kind one is a goal.
            if (kind) flag("kind");
            flag("answered");
          };
          const choices = h("span", { class: "row" }, h("button", { type: "button", textContent: t("ib_child_kind"), onclick: answer(true) }), h("button", { type: "button", textContent: t("ib_child_blunt"), onclick: answer(false) }));
          say("child", "ib_child_1", choices);
          (choices.firstChild as HTMLElement).focus({ preventScroll: true });
        },
      }),
      h("button", { type: "button", textContent: t("ib_look_feather"), onclick: () => (say("hudhud", has("feather") ? "ib_feather_again" : "ib_feather_1"), flag("feather")) }),
    );
  }

  function draw(): void {
    const on = new Set(threaded(state));
    buttons.forEach((b, i) => {
      const id = state.stage.stops[i]!;
      b.textContent = t(on.has(id) ? "ib_bead_on" : "ib_bead", { n: num(i + 1), name: name(id) });
      b.classList.toggle("on", on.has(id));
      b.disabled = state.done;
    });
    progress.textContent = `${t("ib_threaded", { n: num(state.at), total: num(state.stage.road.length) })} · ${t("ib_slips", { n: num(state.slips) })}`;
    canvas.setAttribute("aria-label", t("ib_picture", { beads: num(state.stage.stops.length), n: num(state.at), total: num(state.stage.road.length) }));
    stageBox.replaceChildren(
      state.showing
        ? h("p", { class: "by-narrator" }, h("strong", { textContent: `${t("ib_who_narrator")}: ` }), t(stages[state.style]))
        : h("p", { textContent: t("ib_stage_hidden") }),
    );
    // Showing the stage again is a way of playing's choice: Story never hides it, so has no button for it.
    peekBtn.hidden = state.style === "story";
    peekBtn.disabled = state.showing || state.done;
    peekNote.hidden = state.style !== "challenge";
    drawRoute(canvas, { stops: state.stage.stops, thread: threaded(state), wrong: state.last && !state.last.right ? state.last.stop : null, rtl });
    drawAsks();
  }

  /** A touch or click on the picture is a press on the bead under it. */
  canvas.addEventListener("click", (e) => {
    if (state.done) return;
    const r = canvas.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const hit = routeHit(((e.clientX - r.left) / r.width) * ROUTE_ART.w, ((e.clientY - r.top) / r.height) * ROUTE_ART.h, state.stage.stops.length, rtl);
    if (hit !== null) command({ type: "go", stop: state.stage.stops[hit]! });
  });

  function end_(): void {
    host.chime();
    say("hudhud", "ib_done_1");
    const slack = ROUTE_SLACK[state.style];
    const g = routeGoals(state, slack);
    host.finish(g);
    const goal = (mark: string, nameKey: Key, how: string, met: boolean) => h("li", {}, h("span", { class: "mark", textContent: mark }), h("span", {}, h("strong", { textContent: t(nameKey) }), h("br", {}), h("span", { class: "small", textContent: how })), h("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    const names: Key[] = ["ib_rec_person", "ib_rec_book", "ib_rec_question"];
    const title = h("h3", { textContent: t("results_title"), tabIndex: -1 });
    results.replaceChildren(
      title,
      h("p", { textContent: t("ib_slips", { n: num(state.slips) }) }),
      h(
        "ul",
        { class: "goals" },
        goal("✦", "goal_curiosity", t("ib_goal_curiosity_how"), g.curiosity),
        goal("⚙", "goal_ingenuity", slack === null ? t("ib_goal_ingenuity_story") : t("ib_goal_ingenuity_how", { n: num(slack) }), g.ingenuity),
        goal("♥", "goal_kindness", t("ib_goal_kindness_how"), g.kindness),
        goal("❧", "goal_feather", t("ib_goal_feather_how"), g.feather),
      ),
      h(
        "div",
        { class: "note" },
        h("h3", { textContent: t("note_title") }),
        h("p", { textContent: t("ib_note_1") }),
        h("p", { textContent: t("ib_note_2") }),
        h("p", { textContent: t("ib_note_3") }),
        h("p", { class: "pending", textContent: t("ib_review") }),
        ...ROUTE_RECORDS.map((id, i) => h("p", {}, h("a", { href: `${host.museum}/${host.lang}/${id}/`, textContent: t("note_link", { name: t(names[i]!) }) }))),
      ),
      h("p", { class: "row" }, h("button", { type: "button", class: "primary", textContent: t("btn_atlas"), onclick: () => host.leave() }), h("button", { type: "button", textContent: t("play_again"), onclick: () => again() })),
    );
    results.hidden = false;
    title.focus({ preventScroll: false });
  }

  function again(): void {
    answered = false;
    state = newRoute(host.style(), routeStage(host.style()));
    host.keepPlace?.(null);
    ran.replaceChildren();
    said.replaceChildren();
    results.hidden = true;
    results.replaceChildren();
    say("hudhud", "ib_intro_1");
    say("ibn", "ib_intro_2");
    draw();
    heading.focus({ preventScroll: true });
  }

  /** The words for what a press did, in the polite region under the beads. */
  function tell(c: RouteCommand, before: RouteState): void {
    if (c.type === "peek") {
      if (state.style === "challenge") ran.replaceChildren(h("p", { class: "stopped", textContent: t("ib_peek_slip") }));
      return;
    }
    if (c.type !== "go" || !state.last) return;
    if (state.last.right) {
      ran.replaceChildren(h("p", { class: "met", textContent: t("ib_step_ok", { name: name(state.last.stop) }) }));
      if (state.done) ran.append(h("p", {}, h("strong", { textContent: t("ib_end_done") })));
      return;
    }
    const next = nextStop(before);
    const text = state.style === "story" ? t("ib_slip_story", { name: next ? name(next) : "" }) : state.style === "explorer" ? t("ib_slip_explorer") : t("ib_slip_challenge");
    ran.replaceChildren(h("p", { class: "stopped", textContent: text }));
  }

  function command(c: RouteCommand): void {
    const before = state;
    state = applyRoute(state, c);
    if (state === before) return;
    if (c.type === "go") host.tick();
    tell(c, before);
    if (state.done) {
      draw();
      end_();
      return;
    }
    host.keepPlace?.(state.at > 0 || state.slips > 0 || state.flags.length > 0 ? snapshotRoute(state) : null);
    draw();
  }

  const node = h("div", { class: "bench-inner" }, heading, h("p", { class: "small", textContent: t("ib_trial") }), objective, canvas, tapHint, progress, stageBox, h("p", {}, peekBtn), peekNote, beadsTitle, beads, ran, said, asks, results);
  say("hudhud", "ib_intro_1");
  say("ibn", "ib_intro_2");
  draw();
  return {
    node,
    state: () => state,
    command,
    busy: () => false,
    sentence: () => stageBox.textContent ?? "",
    status: () => ran.textContent ?? "",
    stop: () => undefined,
  };
}
