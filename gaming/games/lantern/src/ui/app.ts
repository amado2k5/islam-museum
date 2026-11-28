// The Lantern: reveal a name from the museum one letter at a time before the lantern's seven drops of oil run out.
import en from "../../i18n/en.json";
import { loadPhraseLabels, loadWords, namer, sharedStrings } from "../../../../packages/daily/src/load";
import { recordUrl } from "../../../../packages/daily/src/pack";
import { puzzleNumber } from "../../../../packages/daily/src/seed";
import { fold, normalizeWord } from "../../../../packages/daily/src/text";
import { LANTERN_DROPS, dailyPhrase, hidden, misses, practicePhrase } from "../../../../packages/daily/src/words";
import { copyButton, el, fill, lang, num, ready, recordLink, shell, store, today } from "../../../../packages/daily/src/ui";

type G = Record<keyof typeof en, string>;
interface Result { guessed: string[] }

async function main(): Promise<void> {
  const [shared, own, words, labels] = await Promise.all([sharedStrings(), import(`../../i18n/${lang}.json`).then((m) => m.default as G), loadWords(), loadPhraseLabels()]);
  const s: Record<string, string> = { ...shared, ...own };
  const t = (k: keyof G, v: Record<string, string | number> = {}) => fill(own[k], v);
  const { name, line } = namer(labels);
  const ui = shell({ s, title: t("title"), howto: [t("how_1"), t("how_2"), t("how_3"), shared.source_note!] });
  // Released on 28 November 2026 by the founder's decision (docs/gaming/spec-production/release-status.json): no prototype label.
  const saved = store<Result>(`im.lantern.v1.${lang}`);
  const date = today();
  const up = (c: string) => c.toLocaleUpperCase(lang === "tr" ? "tr" : "en");
  const alphabet = [...words.alphabet];
  let onkey: ((e: KeyboardEvent) => void) | null = null;
  document.addEventListener("keydown", (e) => onkey?.(e));

  const play = (entry: { id: string; p: string }, practice: boolean, done?: Result) => {
    const guessed = new Set<string>(done?.guessed ?? []);
    const phrase = el("div", { class: "phrase", role: "img" });
    const oil = el("div", { class: "oil", "aria-hidden": "true" });
    const oilText = el("p", { class: "progress" });
    const keys = el("div", { class: "keys" });
    const end = el("div", { "aria-live": "polite" });
    const buttons = new Map<string, HTMLButtonElement>();
    const left = () => LANTERN_DROPS - misses(entry.p, guessed, lang);
    const state = () => (hidden(entry.p, guessed, lang) === 0 ? "won" : left() <= 0 ? "lost" : "playing");
    const draw = () => {
      const over = state() !== "playing";
      phrase.replaceChildren(...entry.p.split(" ").map((w) => el("span", { class: "word" }, ...[...w].map((c) => {
        const letter = /\p{L}/u.test(c);
        const shown = !letter || over || guessed.has(fold(c, lang));
        return el("span", { class: `slot${letter ? "" : " sep"}`, "aria-hidden": "true" }, shown ? up(c) : "");
      }))));
      const n = hidden(entry.p, guessed, lang);
      phrase.setAttribute("aria-label", over ? entry.p : `${t("name_label", { n: num(n) })}: ${[...entry.p].map((c) => (/\p{L}/u.test(c) ? (guessed.has(fold(c, lang)) ? up(c) : t("hidden_letter")) : c === " " ? "," : c)).join(" ")}`);
      oil.replaceChildren(...Array.from({ length: LANTERN_DROPS }, (_, i) => el("span", { class: i < left() ? "" : "gone" }, "💧")));
      oilText.textContent = t("drops_left", { n: num(Math.max(0, left())), max: num(LANTERN_DROPS) });
      for (const [c, b] of buttons) {
        const used = guessed.has(c);
        b.disabled = used || over;
        b.className = used ? ([...entry.p].some((x) => fold(x, lang) === c) ? "hit" : "miss") : "";
        b.setAttribute("aria-label", used ? ([...entry.p].some((x) => fold(x, lang) === c) ? t("in_name", { letter: up(c) }) : t("not_in", { letter: up(c) })) : up(c));
      }
    };
    const finish = () => {
      const st = state();
      if (st === "playing") return;
      if (!practice) saved.put(date, { guessed: [...guessed] });
      const shownName = name(entry.id);
      const head = st === "won" ? t("won", { name: shownName }) : t("lost", { name: shownName });
      const again = el("button", { type: "button", class: "secondary wide" }, s.practice);
      again.addEventListener("click", () => play(practicePhrase(words, String(Date.now())), true));
      end.replaceChildren(el("section", { class: "card" },
        el("h2", {}, head),
        line(entry.id) ? el("p", {}, line(entry.id)!) : null,
        recordLink(s, recordUrl(lang, entry.id), shownName),
        practice ? null : copyButton(s, () => `${t("share", { n: puzzleNumber(date), left: Math.max(0, left()), max: LANTERN_DROPS })}\nhttps://games.islam.museum/lantern/`),
        practice ? null : el("p", { class: "small" }, s.done_today, " ", fill(s.played!, { n: num(Object.keys(saved.all()).length) })),
        again,
      ));
      keys.hidden = true;
      ui.say(head);
    };
    const guess = (c: string) => {
      if (state() !== "playing" || guessed.has(c)) return;
      guessed.add(c);
      const inName = [...entry.p].some((x) => fold(x, lang) === c);
      draw();
      ui.say(inName ? t("in_name", { letter: up(c) }) : `${t("not_in", { letter: up(c) })} ${t("drops_left", { n: num(Math.max(0, left())), max: num(LANTERN_DROPS) })}`);
      finish();
    };
    const keyAlphabet = [...new Set(alphabet.map((c) => fold(c, lang)))];
    for (const c of keyAlphabet) {
      const b = el("button", { type: "button", "aria-label": up(c) }, up(c)) as HTMLButtonElement;
      b.addEventListener("click", () => {
        const at = keyAlphabet.indexOf(c);
        guess(c);
        // The key just used is now disabled: a keyboard player's focus moves on to the next key still free, so they
        // never lose their place (with none left, the end card has the focus's next stop).
        if (document.activeElement === b || document.activeElement === document.body) {
          const next = [...keyAlphabet.slice(at + 1), ...keyAlphabet.slice(0, at)].map((k) => buttons.get(k)!).find((x) => !x.disabled && !keys.hidden);
          (next ?? end.querySelector<HTMLElement>("a, button"))?.focus();
        }
      });
      buttons.set(c, b);
      keys.append(b);
    }
    onkey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.target instanceof HTMLSelectElement) return;
      const c = fold(normalizeWord(e.key, lang), lang);
      if (c.length === 1 && buttons.has(c)) { e.preventDefault(); guess(c); }
    };
    ui.main.replaceChildren(practice ? el("p", { class: "small" }, s.practice_note) : "", oil, oilText, phrase, end, keys);
    draw();
    if (state() !== "playing") finish();
  };
  const entry = dailyPhrase(words, lang, date);
  play(entry, false, saved.get(date));
  ready({ game: "lantern", date, records: [entry.id] });
}
main().catch((e) => {
  console.error(e);
  document.getElementById("app")!.textContent = "The game could not load. Please reload the page.";
  (window as unknown as { __DAILY__: unknown }).__DAILY__ = { error: String(e) };
});
