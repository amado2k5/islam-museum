// The secret page's page: a third trial quest. It is ordinary page from top to bottom, so that it can be played by
// keyboard, pointer, touch or screen reader alike: a picture of the secret page, two tables of counts, one list of
// choices for each mark, a button that reads the page, and words for everything that happens. The rules are in
// sim/cipher.ts. Playing on the picture itself is not built in this trial: the lists of choices are the way to play.
import { cipherCanvas, drawCipher, glyphCanvas } from "../art/cipher";
import { CIPHER_RECORDS, CIPHER_SLACK, cipherPuzzle } from "../content/cipher";
import { applyCipher, cipherGoals, newCipher, ranked, snapshotCipher, used, type CipherCommand, type CipherFlag, type CipherState, type CipherStyle } from "../sim/cipher";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;
export interface CipherHost {
  t(key: Key, vars?: Record<string, string | number>): string;
  num(n: number): string;
  lang: string;
  museum: string;
  /** The subject's name, for the heading. */
  title: string;
  style(): CipherStyle;
  /** A small sound for a mark given a sign, and one for the end. Neither needs a caption: the page says both in words. */
  tick(): void;
  chime(): void;
  /** The quest is finished: its goals are written into the save. */
  finish(r: { turns: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean }): void;
  leave(): void;
  /** A page put back from what was kept, to go on from; null or absent for a new one. */
  resume?: CipherState | null;
  /** The page changed in a way worth keeping (its snapshot), or it is finished or started again (null). */
  keepPlace?(snap: unknown | null): void;
}
export interface CipherQuest {
  node: HTMLElement;
  state(): CipherState;
  command(c: CipherCommand): void;
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

export function cipherQuest(host: CipherHost): CipherQuest {
  const { t, num } = host;
  const rtl = host.lang === "ar" || host.lang === "ur";
  let state = host.resume ?? newCipher(host.style(), cipherPuzzle(host.style()));
  let answered = state.flags.includes("answered") || state.flags.includes("kind"); // the messenger has been answered, kindly or not

  const signName = (id: string) => t(`cf_sign_${id}` as Key);
  const markName = (id: string) => t(`cf_mark_${id}` as Key);
  const list = (names: string[]) => names.join(rtl ? "، " : ", ");

  const heading = h("h2", { textContent: host.title, tabIndex: -1 });
  const objective = h("p", { class: "objective-line", textContent: t("cf_objective") });
  const opening = h("p", { class: "objective-line", textContent: t("cf_opening") });
  const canvas = cipherCanvas();
  canvas.className = "cipher-art";
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", t("cf_picture", { n: num(state.puzzle.message.length) }));
  const progress = h("p", { class: "small" });
  const ran = h("div", { class: "ran" });
  ran.setAttribute("aria-live", "polite");
  const said = h("div", { class: "said" });
  said.setAttribute("aria-live", "polite");
  const asks = h("p", { class: "row" });
  const results = h("section", { class: "results", hidden: true });
  const read = h("button", { type: "button", class: "primary", textContent: t("cf_read"), onclick: () => command({ type: "read" }) });

  // Two tables, in real HTML: what the sample's signs and the message's marks add up to, each from most to fewest.
  const table = (caption: string, first: string, rows: { id: string; count: number; kind: "sign" | "mark" }[]) =>
    h(
      "table",
      { class: "counts" },
      h("caption", { textContent: caption }),
      h("thead", {}, h("tr", {}, ...[t("cf_th_rank"), first, t("cf_th_count")].map((x) => Object.assign(h("th", { textContent: x }), { scope: "col" })))),
      h(
        "tbody",
        {},
        ...rows.map((r, i) =>
          h("tr", {}, h("td", { textContent: num(i + 1) }), h("td", { class: "glyph-name" }, glyphCanvas(r.kind, r.id), h("span", { textContent: r.kind === "sign" ? signName(r.id) : markName(r.id) })), h("td", { textContent: num(r.count) })),
        ),
      ),
    );
  const p = state.puzzle;
  const sampleRows = ranked(p.sample).map((r) => ({ ...r, kind: "sign" as const }));
  const messageRows = ranked(p.message).map((r) => ({ ...r, kind: "mark" as const }));
  const tables = h("div", { class: "tables" }, table(t("cf_sample_caption"), t("cf_th_sign"), sampleRows), table(t("cf_message_caption"), t("cf_th_mark"), messageRows));

  // One list of choices for each mark that is in the message, from the commonest mark down.
  const selects = new Map<string, HTMLSelectElement>();
  const places = h("ol", { class: "places" });
  for (const mark of used(p)) {
    const select = h("select", { onchange: () => assignFrom(mark, select.value) });
    select.dataset.mark = mark;
    select.append(h("option", { value: "", textContent: t("cf_not_yet") }));
    for (const r of sampleRows) select.append(h("option", { value: r.id, textContent: signName(r.id) }));
    selects.set(mark, select);
    places.append(h("li", {}, h("label", {}, h("span", { class: "glyph-name" }, glyphCanvas("mark", mark), h("span", { textContent: t("cf_for_mark", { mark: markName(mark) }) })), select)));
  }

  const say = (who: "hudhud" | "kindi" | "messenger" | "narrator", key: Key, ...more: Node[]) => {
    said.append(h("p", { class: `by-${who}` }, h("strong", { textContent: `${t(`cf_who_${who}` as Key)}: ` }), t(key), ...more));
    while (said.children.length > 7) said.firstChild?.remove();
  };
  const flag = (f: CipherFlag) => command({ type: "flag", flag: f });

  function drawAsks(): void {
    const has = (f: CipherFlag) => state.flags.includes(f);
    asks.replaceChildren(
      h("button", { type: "button", textContent: t("cf_ask_count"), onclick: () => (say("narrator", "cf_count_1"), flag("askedCount")) }),
      h("button", { type: "button", textContent: t("cf_ask_short"), onclick: () => (say("narrator", "cf_short_1"), flag("askedShort")) }),
      h("button", {
        type: "button",
        textContent: t("cf_talk_messenger"),
        disabled: answered,
        onclick: () => {
          const answer = (kind: boolean) => () => {
            answered = true;
            choices.remove();
            say("hudhud", kind ? "cf_msg_kind" : "cf_msg_blunt");
            say("messenger", kind ? "cf_msg_kind_r" : "cf_msg_blunt_r");
            // Either answer is kept, so that a resume does not ask again; only the kind one is a goal.
            if (kind) flag("kind");
            flag("answered");
          };
          const choices = h("span", { class: "row" }, h("button", { type: "button", textContent: t("cf_msg_kind"), onclick: answer(true) }), h("button", { type: "button", textContent: t("cf_msg_blunt"), onclick: answer(false) }));
          say("messenger", "cf_msg_1", choices);
          (choices.firstChild as HTMLElement).focus({ preventScroll: true });
        },
      }),
      h("button", { type: "button", textContent: t("cf_look_feather"), onclick: () => (say("hudhud", has("feather") ? "cf_feather_again" : "cf_feather_1"), flag("feather")) }),
    );
  }

  function draw(): void {
    for (const [mark, select] of selects) {
      select.value = state.guess[mark] ?? "";
      select.disabled = state.done;
    }
    const given = used(state.puzzle).filter((m) => state.guess[m] !== undefined).length;
    progress.textContent = `${t("cf_given", { n: num(given), total: num(used(state.puzzle).length) })} · ${t("cf_fails", { n: num(state.fails) })}`;
    read.disabled = state.done;
    drawCipher(canvas, { message: state.puzzle.message, guess: state.guess, rtl, done: state.done });
    drawAsks();
  }

  /** What the page says after a mark is given a sign: the new reading, and whose sign it was if it was taken. */
  function assignFrom(mark: string, value: string): void {
    const sign = value === "" ? null : value;
    const before = state;
    command({ type: "assign", mark, sign });
    if (state === before) return;
    ran.replaceChildren(h("p", { textContent: sign === null ? t("cf_cleared", { mark: markName(mark) }) : t("cf_set", { mark: markName(mark), sign: signName(sign) }) }));
    if (sign !== null) {
      const lost = Object.keys(before.guess).filter((m) => m !== mark && before.guess[m] === sign);
      if (lost.length) ran.append(h("p", { textContent: t("cf_freed", { mark: list(lost.map(markName)) }) }));
    }
  }

  /** The page is read: how it failed depends on the way of playing. Story names the marks that are wrong, Explorer says how many are right, Challenge says only that it does not read. */
  function showReading(): void {
    const last = state.last;
    if (!last) return;
    if (!last.complete) {
      ran.replaceChildren(h("p", { class: "stopped", textContent: t("cf_incomplete", { n: num(used(state.puzzle).filter((m) => state.guess[m] === undefined).length) }) }));
      return;
    }
    if (last.ok) {
      ran.replaceChildren(h("p", { class: "met" }, h("strong", { textContent: t("cf_read_done") })));
      return;
    }
    const text =
      state.style === "story" ? t("cf_read_story", { list: list(last.wrong.map(markName)) }) : state.style === "explorer" ? t("cf_read_explorer", { right: num(last.right), total: num(last.total) }) : t("cf_read_challenge");
    ran.replaceChildren(h("p", { class: "stopped", textContent: text }));
  }

  function end_(): void {
    host.chime();
    say("hudhud", "cf_done_1");
    const slack = CIPHER_SLACK[state.style];
    const g = cipherGoals(state, slack);
    host.finish(g);
    const goal = (mark: string, name: Key, how: string, met: boolean) => h("li", {}, h("span", { class: "mark", textContent: mark }), h("span", {}, h("strong", { textContent: t(name) }), h("br", {}), h("span", { class: "small", textContent: how })), h("span", { class: met ? "met" : "open", textContent: t(met ? "goal_met" : "goal_open") }));
    const names: Key[] = ["cf_rec_person", "cf_rec_method"];
    const title = h("h3", { textContent: t("results_title"), tabIndex: -1 });
    results.replaceChildren(
      title,
      h("p", { textContent: t("cf_fails", { n: num(g.fails) }) }),
      h(
        "ul",
        { class: "goals" },
        goal("✦", "goal_curiosity", t("cf_goal_curiosity_how"), g.curiosity),
        goal("⚙", "goal_ingenuity", slack === null ? t("cf_goal_ingenuity_story") : t("cf_goal_ingenuity_how", { n: num(slack) }), g.ingenuity),
        goal("♥", "goal_kindness", t("cf_goal_kindness_how"), g.kindness),
        goal("❧", "goal_feather", t("cf_goal_feather_how"), g.feather),
      ),
      h(
        "div",
        { class: "note" },
        h("h3", { textContent: t("note_title") }),
        h("p", { textContent: t("cf_note_1") }),
        h("p", { textContent: t("cf_note_2") }),
        h("p", { textContent: t("cf_note_3") }),
        h("p", { textContent: t("cf_note_4") }),
        h("p", { class: "pending", textContent: t("cf_review") }),
        ...CIPHER_RECORDS.map((id, i) => h("p", {}, h("a", { href: `${host.museum}/${host.lang}/${id}/`, textContent: t("note_link", { name: t(names[i]!) }) }))),
      ),
      h("p", { class: "row" }, h("button", { type: "button", class: "primary", textContent: t("btn_atlas"), onclick: () => host.leave() }), h("button", { type: "button", textContent: t("play_again"), onclick: () => again() })),
    );
    results.hidden = false;
    title.focus({ preventScroll: false });
  }

  function again(): void {
    answered = false;
    state = newCipher(host.style(), cipherPuzzle(host.style()));
    host.keepPlace?.(null);
    ran.replaceChildren();
    said.replaceChildren();
    results.hidden = true;
    results.replaceChildren();
    say("hudhud", "cf_intro_1");
    say("kindi", "cf_intro_2");
    draw();
    heading.focus({ preventScroll: true });
  }

  function command(c: CipherCommand): void {
    const before = state;
    state = applyCipher(state, c);
    if (state === before) return;
    if (c.type === "assign") host.tick();
    // A page with a mark given, a failed reading or a question asked is worth keeping; a page that was just read right
    // is finished, and the host clears its place. A press that only said marks were missing changed nothing worth keeping.
    const snap = () => (Object.keys(state.guess).length > 0 || state.fails > 0 || state.flags.length > 0 ? snapshotCipher(state) : null);
    if (c.type !== "read") host.keepPlace?.(snap());
    else if (state.last?.complete && !state.done) host.keepPlace?.(snap());
    draw();
    if (c.type === "read") {
      showReading();
      if (state.done) end_();
    }
  }

  const node = h("div", { class: "bench-inner" }, heading, h("p", { class: "small", textContent: t("cf_trial") }), objective, opening, canvas, progress, tables, places, h("p", {}, read), ran, said, asks, results);
  say("hudhud", "cf_intro_1");
  say("kindi", "cf_intro_2");
  draw();
  return { node, state: () => state, command, busy: () => false, stop: () => undefined };
}
