// The Thread of Time: five events from the museum's graph, put in the order they happened with ▲ and ▼ buttons
// (no dragging needed, so it works the same with a finger, a mouse, a keyboard or a screen reader).
import en from "../../i18n/en.json";
import { loadLabels, loadPack, namer, sharedStrings } from "../../../../packages/daily/src/load";
import { recordUrl } from "../../../../packages/daily/src/pack";
import { puzzleNumber } from "../../../../packages/daily/src/seed";
import { dailyThread, rightPlaces, thread } from "../../../../packages/daily/src/thread";
import { copyButton, el, fill, lang, num, ready, recordLink, shell, store, today } from "../../../../packages/daily/src/ui";

type G = Record<keyof typeof en, string>;
interface Result { order: string[] }

async function main(): Promise<void> {
  const [shared, own, pack, labels] = await Promise.all([sharedStrings(), import(`../../i18n/${lang}.json`).then((m) => m.default as G), loadPack(), loadLabels()]);
  const s: Record<string, string> = { ...shared, ...own };
  const t = (k: keyof G, v: Record<string, string | number> = {}) => fill(own[k], v);
  const { name, line } = namer(labels);
  const ui = shell({ s, title: t("title"), howto: [t("how_1"), t("how_2"), t("how_3"), shared.source_note!], prototype: t("prototype") });
  const saved = store<Result>("im.thread.v1");
  const date = today();
  const eventOf = new Map(pack.events.map((e) => [e.id, e]));
  const year = (id: string) => { const e = eventOf.get(id)!; return e.h > 0 ? t("year_both", { y: num(e.y), h: num(e.h) }) : t("year_ce", { y: num(e.y) }); };

  const play = (puzzle: { shown: Array<{ id: string }>; order: string[] }, practice: boolean, done?: Result) => {
    let mine = done ? done.order.slice() : puzzle.shown.map((e) => e.id);
    let checked = Boolean(done);
    const list = el("ol", { class: "order" });
    const after = el("div", { "aria-live": "polite" });
    const check = el("button", { type: "button", class: "wide" }, t("check"));
    const move = (i: number, d: number) => {
      const j = i + d;
      if (j < 0 || j >= mine.length) return;
      [mine[i], mine[j]] = [mine[j]!, mine[i]!];
      draw();
      ui.say(t("moved", { name: name(mine[j]!), n: num(j + 1) }));
      (list.children[j]?.querySelector(d < 0 ? "button.up" : "button.down") as HTMLButtonElement | null ?? list.children[j]?.querySelector("button") as HTMLButtonElement | null)?.focus();
    };
    const draw = () => {
      const marks = checked ? rightPlaces(mine, puzzle.order) : null;
      list.replaceChildren(...mine.map((id, i) => {
        const body = el("div", {}, el("strong", {}, name(id)));
        if (marks) {
          body.append(el("div", { class: "year" }, year(id)), el("div", { class: marks[i] ? "ok" : "no" }, marks[i] ? t("right_place") : t("wrong_place", { n: num(puzzle.order.indexOf(id) + 1) })));
          if (line(id)) body.append(el("p", { class: "small" }, line(id)!));
          body.append(recordLink(s, recordUrl(lang, id), name(id)));
        }
        const li = el("li", { class: marks ? (marks[i] ? "right" : "wrong") : "" }, body);
        if (!checked) {
          const upB = el("button", { type: "button", class: "up", "aria-label": t("up", { name: name(id) }), disabled: i === 0 }, "▲");
          const downB = el("button", { type: "button", class: "down", "aria-label": t("down", { name: name(id) }), disabled: i === mine.length - 1 }, "▼");
          upB.addEventListener("click", () => move(i, -1));
          downB.addEventListener("click", () => move(i, 1));
          li.append(el("div", { class: "moves" }, upB, downB));
        }
        return li;
      }));
      check.hidden = checked;
    };
    check.addEventListener("click", () => {
      checked = true;
      if (!practice) saved.put(date, { order: mine });
      draw();
      const marks = rightPlaces(mine, puzzle.order);
      const right = marks.filter(Boolean).length;
      const head = t("result", { right: num(right), total: num(mine.length) });
      const again = el("button", { type: "button", class: "secondary wide" }, s.practice);
      again.addEventListener("click", () => play(thread(pack, `practice-${Date.now()}`), true));
      after.replaceChildren(el("section", { class: "card" }, el("h2", {}, head),
        practice ? null : copyButton(s, () => `${t("share", { n: puzzleNumber(date), right, total: mine.length })}\n${marks.map((m) => (m ? "✓" : "✗")).join(" ")}\nhttps://games.islam.museum/thread/`),
        practice ? null : el("p", { class: "small" }, s.done_today, " ", fill(s.played!, { n: num(Object.keys(saved.all()).length) })),
        again));
      ui.say(head);
    });
    ui.main.replaceChildren(practice ? el("p", { class: "small" }, s.practice_note) : "", el("p", { class: "progress" }, `▲ ${t("earliest")}`), list, el("p", { class: "progress" }, `▼ ${t("latest")}`), check, after);
    draw();
    if (checked) { checked = false; check.click(); }
  };
  const puzzle = dailyThread(pack, date);
  play(puzzle, false, saved.get(date));
  ready({ game: "thread", date, records: puzzle.order });
}
main().catch((e) => {
  console.error(e);
  document.getElementById("app")!.textContent = "The game could not load. Please reload the page.";
  (window as unknown as { __DAILY__: unknown }).__DAILY__ = { error: String(e) };
});
