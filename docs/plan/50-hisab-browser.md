# 50 · Hasanat and Sayyi'at Ledger, Calculator and Counter (قائمة وآلة حاسبة وعدّاد الحسنات والسيئات)

_Requested by the founder on 11 November 2026; built the same day. Acceptance spec:
[`docs/engineering/38-hisab-ledger-requirements.md`](../engineering/38-hisab-ledger-requirements.md).
Lane `hisab` in `docs/agents/lanes.md`._

## 1. What it is

A front door over the one graph at `/[lang]/hisab/` with three parts:

1. **The list (القائمة)** — every passage in the corpus that counts, writes, multiplies,
   erases, weighs or reckons a deed, grouped by corpus (Qur'an, Sunnah, seerah, other books)
   with the curated records last. Found at build time by `scripts/hisab.ts`.
2. **The calculator (الآلة الحاسبة)** — one row per curated `concept` record that carries a
   `reckoning` block: what a named text states for one act. The page multiplies the visitor's
   count by the stated figure and shows four separate sums (good deeds written, bad deeds
   written, bad deeds erased, ranks), a range where the text gives a range, and the worded
   result where the text gives no figure.
3. **The counter (العدّاد)** — a tally kept in the visitor's browser (`localStorage`), with a
   chooser of the rows that name a repetition count (a hundred tasbihs, a hundred tahlils); on
   reaching the stated number the row's result is shown.

It complements the Hasanat Browser (plan 45) and the Sayyi'at Browser (plan 44), which list
every plain mention; a passage enters here only when it carries a counting element.

## 2. Why it is shaped this way

- **Describe, never prescribe.** A deeds calculator is easily read as a promise. Every figure
  is therefore read from a passage record named beside it, narration variants are shown and not
  ranked, results the texts do not number are never turned into numbers, the four sums are
  never netted against each other, and a caveat sits above the tool.
- **Graph, API, search.** Rows are records (`reckoning` on the `concept` schema), not a table
  in page code; the list is a detector over passages, so a book harvested later joins by
  itself; `/api/v1/hisab.json` exports everything.
- **No runtime, no server.** The sums and the tally run in the page; nothing leaves the browser.

## 3. Data

- `scripts/hisab.ts` — the detector (19 signals in four kinds), the fold, the corpus rule, the
  exclusion list and the `reckoning` reader.
- `scripts/harvest-hisab-hadithapi.ts` — harvests the matching reports of the seven hadith-api
  Arabic editions into `data/passage/<collection>-api-<n>.yaml`, gated by the same detector and
  deduplicated against the graph. Run of 11 Nov 2026: 538 new passage records.
- `data/concept/hisab-al-hasanat-wal-sayyiat.yaml` + trilingual prose — the umbrella article.
- `data/concept/hisab-*.yaml` — 24 calculator rows, each with `reckoning.basis` passages.

## 4. Phases

| Phase | Content | State |
|---|---|---|
| 1 | Detector, hadith harvest, umbrella article, 24 rows, page, API, nav, landing card, docs, tests | Done 11 Nov 2026 |
| 2 | Human read of the draft records; row-level prose in three languages | Open |
| 3 | Companion and Tabi'i reports from the books of merits and renunciation (Riyad al-Salihin in full, al-Targhib wa al-Tarhib, al-Zuhd of Ibn al-Mubarak, Ibn Abi al-Dunya), and seerah works | Open; enters automatically on harvest |
| 4 | More rows as texts are verified (the greeting of peace, ablution on purity, the gecko), with a `perspectives` note where grading is disputed | Open |

## 5. The landing as one screen (founder request, 14 November 2026)

The founder asked for a calculator that fills the page, has large buttons and clear colours, needs
no explanation on a first visit and works like a shopping basket: choose an act, add it, keep
adding, and see the total at once. The landing was rebuilt around that; nothing was removed.

- **The count.** Each calculator row is a card: the act, the figure the text states, the unit, the
  texts it is read from, and one large "Add" button with a minus and a number field beside it. What
  was added is listed under "What I added" (beside the cards on a wide screen), one line per act
  with its result and a remove button. A bar fixed to the foot of the screen shows the sums as they
  change. Four buttons above the cards show one ledger kind at a time.
- **One colour per kind**: green for good deeds, red for bad deeds, teal for erasure, brown for the
  Scale and ranks; each carries white text at 4.5:1 or better in both themes.
- **The rules of section 2 are unchanged.** The four sums are still never subtracted from one
  another: good deeds and bad deeds are two separate figures side by side, and the erased and ranks
  figures appear when they are not zero. A result the text does not number is shown in its words on
  its line. A one-line caveat stays above the cards and links to the full one.
- **Everything else is one press away** under "More on this page", each part folded: the counter,
  the full table with its texts (now a reference table; the count moved to the cards), the ladder
  of multiplication, the list of every counting text, and the lede, status, caveat, method and API
  link. A link to a folded part opens it.
- **Kept in the browser.** What was added is kept in `localStorage` (`hisab-cart-v1`), like the
  counter's tally, and sent nowhere.
- **Sub-pages of the list** (`/hisab/<section>/<n>/`) no longer repeat the calculator: they open on
  the list with a button back to it.

No "attributes" beyond the count were added: the records state a figure per unit and nothing else
(no grade of intention, no narration chooser), and the page does not invent one.
