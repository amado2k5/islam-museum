// Kalima: guess the day's name from the museum in six tries. Each letter's result is shown by colour and by a sign
// (✓ ↔ ·) and read out in words, so nothing depends on seeing colour.
import en from "../../i18n/en.json";
import { loadLabels, loadWords, namer, sharedStrings } from "../../../../packages/daily/src/load";
import { recordUrl } from "../../../../packages/daily/src/pack";
import { puzzleNumber } from "../../../../packages/daily/src/seed";
import { fold, normalizeWord } from "../../../../packages/daily/src/text";
import { KALIMA_TRIES, dailyWord, judge, practiceWord, wordLetters, type Mark } from "../../../../packages/daily/src/words";
import { copyButton, el, fill, lang, num, ready, recordLink, shell, store, today } from "../../../../packages/daily/src/ui";

type G = Record<keyof typeof en, string>;
interface Result { guesses: string[] }
const SIGN: Record<Mark, string> = { hit: "✓", near: "↔", miss: "·" };
const RANK: Record<Mark, number> = { miss: 1, near: 2, hit: 3 };

async function main(): Promise<void> {
  const [shared, own, words, labels] = await Promise.all([sharedStrings(), import(`../../i18n/${lang}.json`).then((m) => m.default as G), loadWords(), loadLabels()]);
  const s: Record<string, string> = { ...shared, ...own };
  const t = (k: keyof G, v: Record<string, string | number> = {}) => fill(own[k], v);
  const { name, line } = namer(labels);
  const ui = shell({ s, title: t("title"), howto: [t("how_1"), t("how_2"), t("how_3"), shared.source_note!], prototype: t("prototype") });
  const saved = store<Result>(`im.kalima.v1.${lang}`);
  const date = today();
  const up = (c: string) => c.toLocaleUpperCase(lang === "tr" ? "tr" : "en");
  const alphabet = [...words.alphabet];

  const play = (entry: { id: string; w: string }, practice: boolean, done?: Result) => {
    const answer = wordLetters(entry.w);
    const n = answer.length;
    const guesses: string[][] = done ? done.guesses.map((g) => [...g]) : [];
    let current: string[] = [];
    const state = () => (guesses.some((g) => judge(g, answer, lang).every((m) => m === "hit")) ? "won" : guesses.length >= KALIMA_TRIES ? "lost" : "playing");
    const grid = el("div", { class: "grid", role: "group", "aria-label": t("letters", { n: num(n) }) });
    const keys = el("div", { class: "keys" });
    const message = el("div", { "aria-live": "polite" });
    const keyButtons = new Map<string, HTMLButtonElement>();
    const markOf = (m: Mark) => t(m);
    const drawGrid = () => {
      grid.replaceChildren();
      for (let r = 0; r < KALIMA_TRIES; r++) {
        const g = guesses[r] ?? (r === guesses.length ? current : []);
        const marks = guesses[r] ? judge(guesses[r]!, answer, lang) : null;
        const line = el("div", { class: "line", role: "group", "aria-label": t("row_label", { n: num(r + 1) }) });
        for (let k = 0; k < n; k++) {
          const c = g[k];
          const m = marks?.[k];
          const tile = el("div", { class: `tile${m ? " " + m : ""}`, role: "img", "aria-label": c ? (m ? `${up(c)}, ${markOf(m)}` : up(c)) : t("empty") }, c ? up(c) : "", m ? el("small", { "aria-hidden": "true" }, SIGN[m]) : null);
          line.append(tile);
        }
        grid.append(line);
      }
      const best = new Map<string, Mark>();
      for (const g of guesses) judge(g, answer, lang).forEach((m, k) => { const c = fold(g[k]!, lang); if (!best.has(c) || RANK[m] > RANK[best.get(c)!]) best.set(c, m); });
      for (const [c, b] of keyButtons) {
        const m = best.get(c);
        b.className = m ?? "";
        b.setAttribute("aria-label", m ? `${up(c)}, ${markOf(m)}` : up(c));
      }
    };
    const finish = () => {
      const st = state();
      if (st === "playing") return;
      if (!practice) saved.put(date, { guesses: guesses.map((g) => g.join("")) });
      const word = entry.w;
      const score = st === "won" ? num(guesses.length) : "X";
      const head = st === "won" ? t("won", { n: num(guesses.length), max: num(KALIMA_TRIES) }) : t("lost", { word: up(word) });
      const lines = guesses.map((g) => judge(g, answer, lang).map((m) => SIGN[m]).join("")).join("\n");
      const again = el("button", { type: "button", class: "secondary wide" }, s.practice);
      again.addEventListener("click", () => play(practiceWord(words, String(Date.now())), true));
      message.replaceChildren(el("section", { class: "card" },
        el("h2", {}, head),
        el("p", { lang }, el("strong", {}, name(entry.id))),
        line(entry.id) ? el("p", {}, line(entry.id)!) : null,
        recordLink(s, recordUrl(lang, entry.id), name(entry.id)),
        practice ? null : copyButton(s, () => `${t("share", { n: puzzleNumber(date), score: st === "won" ? guesses.length : "X", max: KALIMA_TRIES })}\n${lines}\nhttps://games.islam.museum/kalima/`),
        practice ? null : el("p", { class: "small" }, s.done_today, " ", fill(s.played!, { n: num(Object.keys(saved.all()).length) })),
        again,
      ));
      keys.hidden = true;
      ui.say(head);
      void score;
    };
    const press = (c: string) => {
      if (state() !== "playing") return;
      if (c === "Enter") {
        if (current.length < n) { message.replaceChildren(el("p", { class: "no" }, t("too_short", { n: num(n) }))); ui.say(t("too_short", { n: num(n) })); return; }
        guesses.push(current);
        const said = judge(current, answer, lang).map((m, k) => `${up(current[k]!)} ${markOf(m)}`).join(", ");
        current = [];
        message.replaceChildren();
        drawGrid();
        ui.say(said);
        finish();
        return;
      }
      if (c === "Backspace") current.pop();
      else if (current.length < n) current.push(c);
      drawGrid();
    };
    for (const c of alphabet) {
      const b = el("button", { type: "button", "aria-label": up(c) }, up(c)) as HTMLButtonElement;
      b.addEventListener("click", () => press(c));
      keyButtons.set(c, b);
      keys.append(b);
    }
    const del = el("button", { type: "button", class: "wide-key" }, t("delete"));
    del.addEventListener("click", () => press("Backspace"));
    const ok = el("button", { type: "button", class: "wide-key" }, t("enter"));
    ok.addEventListener("click", () => press("Enter"));
    keys.append(del, ok);
    onkey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target instanceof HTMLSelectElement || (e.target instanceof HTMLButtonElement && (e.key === "Enter" || e.key === " "))) return;
      if (e.key === "Enter" || e.key === "Backspace") { e.preventDefault(); return press(e.key); }
      const c = normalizeWord(e.key, lang);
      const hit = alphabet.find((a) => a === c) ?? alphabet.find((a) => fold(a, lang) === fold(c, lang));
      if (c.length === 1 && hit) { e.preventDefault(); press(hit); }
    };
    const legend = el("p", { class: "legend" }, el("span", {}, `✓ ${t("hit")}`), el("span", {}, `↔ ${t("near")}`), el("span", {}, `· ${t("miss")}`));
    ui.main.replaceChildren(practice ? el("p", { class: "small" }, s.practice_note) : "", el("p", { class: "progress" }, t("letters", { n: num(n) })), grid, message, keys, legend);
    drawGrid();
    if (state() !== "playing") finish();
  };
  let onkey: ((e: KeyboardEvent) => void) | null = null;
  document.addEventListener("keydown", (e) => onkey?.(e));
  const entry = dailyWord(words, lang, date);
  const done = saved.get(date);
  play(entry, false, done);
  ready({ game: "kalima", date, records: [entry.id], length: wordLetters(entry.w).length });
}
main().catch((e) => {
  console.error(e);
  document.getElementById("app")!.textContent = "The game could not load. Please reload the page.";
  (window as unknown as { __DAILY__: unknown }).__DAILY__ = { error: String(e) };
});
