// Five Questions: the day's five questions, one at a time, each answer explained from its museum record.
import en from "../../i18n/en.json";
import { loadLabels, loadPack, namer, sharedStrings } from "../../../../packages/daily/src/load";
import { recordUrl } from "../../../../packages/daily/src/pack";
import { dailyQuiz, quiz, type Question } from "../../../../packages/daily/src/questions";
import { puzzleNumber } from "../../../../packages/daily/src/seed";
import { copyButton, el, fill, lang, num, ready, recordLink, shell, store, today } from "../../../../packages/daily/src/ui";

type G = Record<keyof typeof en, string>;
interface Result { answers: number[] }

async function main(): Promise<void> {
  const [shared, own, pack, labels] = await Promise.all([sharedStrings(), import(`../../i18n/${lang}.json`).then((m) => m.default as G), loadPack(), loadLabels()]);
  const s: Record<string, string> = { ...shared, ...own };
  const t = (k: keyof G, v: Record<string, string | number> = {}) => fill(own[k], v);
  const { name, line } = namer(labels);
  const ui = shell({ s, title: t("title"), howto: [t("how_1"), t("how_2"), t("how_3"), shared.source_note!], prototype: t("prototype") });
  const saved = store<Result>("im.five-questions.v1");
  const date = today();
  const year = (y: number, h = 0) => (h > 0 ? t("year_both", { y: num(y), h: num(h) }) : t("year_ce", { y: num(y) }));
  const personOf = new Map(pack.persons.map((p) => [p.id, p]));
  const eventOf = new Map(pack.events.map((e) => [e.id, e]));
  const optionText = (q: Question, o: string | number): string => (typeof o === "number" ? year(o) : q.kind === "earliest" ? name(o) : name(o));
  const prompt = (q: Question): string => q.kind === "event-year" ? t("q_event_year", { name: name(q.subject) }) : q.kind === "event-place" ? t("q_event_place", { name: name(q.subject) }) : q.kind === "born-place" ? t("q_born_place", { name: name(q.subject) }) : t("q_earliest");

  const play = (questions: Question[], practice: boolean, done?: Result) => {
    const answers: number[] = done ? done.answers.slice() : [];
    let i = done ? questions.length : 0;
    const draw = () => {
      if (i >= questions.length) return summary();
      const q = questions[i]!;
      const box = el("section", { class: "card", "aria-labelledby": "q" });
      const opts = el("div", { class: "options stack", role: "group", "aria-labelledby": "q" });
      const after = el("div", { "aria-live": "polite" });
      q.options.forEach((o, k) => {
        const b = el("button", { type: "button" }, optionText(q, o));
        b.addEventListener("click", () => {
          answers.push(k);
          const right = k === q.answer;
          [...opts.querySelectorAll("button")].forEach((x, j) => {
            (x as HTMLButtonElement).disabled = true;
            if (j === q.answer) { x.classList.add("right"); x.prepend(el("span", { class: "mark ok", "aria-hidden": "true" }, "✓")); }
            else if (j === k) { x.classList.add("wrong"); x.prepend(el("span", { class: "mark no", "aria-hidden": "true" }, "✗")); }
          });
          const verdict = right ? t("correct") : t("incorrect", { answer: optionText(q, q.options[q.answer]!) });
          const about = q.kind === "event-year" || q.kind === "event-place" || q.kind === "born-place" ? q.subject : q.subject;
          const extra: Array<HTMLElement | null> = [];
          if (q.kind === "earliest") for (const id of q.options as string[]) { const p = personOf.get(id)!; extra.push(el("li", {}, `${name(id)}: ${t("born_year", { y: num(p.born) })}`)); }
          const ev = eventOf.get(about);
          const facts = ev ? el("p", { class: "small" }, `${year(ev.y, ev.h)} · ${name(ev.place)}`) : null;
          const next = el("button", { type: "button", class: "wide" }, i + 1 < questions.length ? t("next") : t("finish"));
          next.addEventListener("click", () => { i++; if (!practice && i >= questions.length) saved.put(date, { answers }); draw(); });
          after.replaceChildren(el("div", {},
            el("p", { class: right ? "ok" : "no" }, el("strong", {}, (right ? "✓ " : "✗ ") + verdict)),
            facts,
            extra.length ? el("ul", { class: "small" }, ...extra) : null,
            line(about) ? el("p", {}, line(about)!) : null,
            recordLink(s, recordUrl(lang, about), name(about)),
            el("p", {}, next),
          ));
          ui.say(verdict);
          next.focus();
        });
        opts.append(b);
      });
      box.append(el("p", { class: "progress" }, t("progress", { n: num(i + 1), total: num(questions.length) })), el("h2", { id: "q" }, prompt(q)), opts, after);
      ui.main.replaceChildren(practice ? el("p", { class: "small" }, s.practice_note) : "", box);
      (opts.firstElementChild as HTMLElement | null)?.focus();
    };
    const summary = () => {
      const right = questions.filter((q, k) => answers[k] === q.answer).length;
      const marks = questions.map((q, k) => (answers[k] === q.answer ? "✓" : "✗")).join(" ");
      const card = el("section", { class: "card", "aria-labelledby": "res" }, el("h2", { id: "res" }, t("score", { right: num(right), total: num(questions.length) })), el("p", { "aria-hidden": "true" }, marks));
      const list = el("ol", {}, ...questions.map((q, k) => el("li", {}, (answers[k] === q.answer ? "✓ " : "✗ ") + prompt(q) + " ", recordLink(s, recordUrl(lang, q.subject), name(q.subject)))));
      if (!practice) card.append(copyButton(s, () => `${t("share", { n: puzzleNumber(date), right, total: questions.length })}\n${marks}\nhttps://games.islam.museum/five-questions/`), el("p", {}, s.done_today), el("p", { class: "small" }, fill(s.played!, { n: num(Object.keys(saved.all()).length) })));
      const again = el("button", { type: "button", class: "secondary wide" }, s.practice);
      again.addEventListener("click", () => play(quiz(pack, `practice-${Date.now()}`), true));
      ui.main.replaceChildren(card, el("section", { class: "card" }, list), again);
      ui.say(t("score", { right: num(right), total: num(questions.length) }));
    };
    draw();
  };
  const questions = dailyQuiz(pack, date);
  play(questions, false, saved.get(date));
  ready({ game: "five-questions", date, records: questions.flatMap((q) => q.records) });
}
main().catch((e) => {
  console.error(e);
  document.getElementById("app")!.textContent = "The game could not load. Please reload the page.";
  (window as unknown as { __DAILY__: unknown }).__DAILY__ = { error: String(e) };
});
