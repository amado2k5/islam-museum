# Plan 52 — Fire Browser (متصفح النار)

_Requested by the founder 11 November 2026: "start working on متصفح النار where
it should list all the mentioned and written النار that are in quran, see rah,
sunna, tabi3een stories, quotes, mentioned and written in books that were
harvested and any future harvested book if it has a النار should be viewable
here. add a box for it on landing page and in navigation menus. make sure this
is done end to end and full detailed proses and make it ready for production at
the end of this. this is only about النار and everything mentioned about النار
anywhere in any of the sunni books or quran or sunna or sera. find all the
instances where النار Were mentioned or part of quotes from quran, sunnah,
Hadith, seerah or from sa7aba and tabi3een and add those stories, mentions,
quotes, details. also add this in engineering documents as the original
requirements to allow AI later on to test and validate it when it is in
production." (clarified: all hellfire names, not only the literal النار;
worldly/narrative fire in its own section — Ibrahim's fire, Musa's tree,
cooking and war fire.)_

## 1. What it is

A browser over the one graph that gathers every mention of the Fire the
museum's sources contain: the hellfire of the hereafter under all its names —
جهنم، سقر، الجحيم، الحطمة، لظى، الحامية، الهاوية، السعير — its people
(أهل النار، عذاب النار، الوقود، الخزنة، الزبانية، الزقوم، الحميم والغساق،
الصراط عليها) and this world's fire too — Ibrahim's fire, the tree of Musa,
cooking and war fire — in the Qur'an, the Sunnah, the seerah, the reports of
the Companions and the Successors, and every harvested book, plus the curated
records on the Fire itself. It follows the Du'a Browser architecture: passages
are ordinary graph nodes found at build time by a shared detector; curated
records carry the `nar-browser` tag; there is no side table and no second
list.

The key mechanism: **passages are not tagged — they are detected.**
`scripts/nar.ts` matches a guarded lexicon over each passage's own
`text_search`/`text` — never labels or summaries, which are museum metadata.
A fire mention in a book harvested next month appears here the day its passage
record lands — the founder's "any future harvested book" requirement, met by
the detector rather than by tagging.

## 2. Scope — what counts as the Fire

In scope, two families —

- **Hellfire** (`nar_kind: hellfire`): every name of hell and its recognized
  descriptions — النار, جهنم, الجحيم, سعير, سقر, الحطمة, لظى, هاوية, الحامية,
  سجين in context, دار البوار, عذاب النار, أهل النار, being cast into or
  entering the Fire (أدخل/يقحم/يُقذف في النار), اتقوا النار, the fuel
  (وقودها الناس والحجارة), the keepers and guards (خزنة جهنم، الزبانية، مالك),
  its food and drink (زقوم، ضريع، حميم، غساق، صديد), and the Sirat over it.
- **Worldly fire** (`nar_kind: worldly`): literal, narrative fire — «يا نار
  كوني بردا وسلاما على إبراهيم», the fire and tree of Musa («آنست من جانب
  الطور نارا», «في البقعة المباركة من الشجرة»), a cooking hearth, the fire of
  war («نار الحرب»). These are listed on their own `dunya` shelf so the
  browser's frame stays the Fire of the hereafter.

## 3. The detector guards

The lexeme «نار» is guarded: a match requires a fire signal, and ambiguous
words are gated —

- **دينار** (the coin) and its plurals never match «نار».
- **منار** (lighthouse/minaret) and **أنار/نور** (to light, light) never match.
- **الموقدة** is hell's own epithet («نار الله الموقدة», 104:6), not a worldly
  cooking signal — moved to the hellfire side; مُوقد in worldly wording stays
  worldly.
- A worldly-context word (رماد، جمر، يوقد alone) without a fire lexeme never
  matches; the `dunya` kind requires a fire signal first.
- A short whitelist pins known hellfire parables whose wording is worldly in
  shape (e.g. Muslim 2284 «استوقد ناراً… وأنتم تقحمون فيه»).

## 4. Sections and kinds

| Section   | Contents |
|-----------|----------|
| `quran`   | Detected ayat of `work/quran` |
| `sunnah`  | Detected hadith passages (`unit: hadith` or a hadith-genre work) |
| `seerah`  | Detected seerah passages (seerah-genre works) |
| `books`   | Detected passages of every other harvested work |
| `dunya`   | Every `worldly`-kind passage plus `nar-dunya` curated records |
| `curated` | `nar-browser` records: `nar-doctrine` (Jahannam, the Fire, Zaqqum, the Fire from Yemen, the people of the Fire and the Garden), `nar-people` (Malik keeper of Jahannam), `nar-sirat` (the Sirat) |

`nar_kind` is `hellfire` or `worldly` on passages, `null` on curated records.
`signals` lists the matched signal names for debugging and tests.

## 5. Surface

- `/{lang}/nar/` — title, lede, method note, section chips with counts, a
  client-side filter over server-rendered cards (readable without JS), every
  card linking to its own entity page; the prose block is Pagefind-indexed
  (`data-pagefind-body`), the long lists are `data-pagefind-ignore`.
- Landing card on the home page; `nar` entry in the Explore menu; i18n blocks
  in `ar`, `en`, `ur`.
- `/api/v1/nar.json` — registered in `FEATURE_EXPORTS` with `section`,
  `nar_kind`, `signals`, `work`, `ref`, `unit`, `text`, `sura`, `aya`,
  `wings`, `themes`, `tags`; documented in `docs/data/README.md`,
  `site/public/openapi/v1.json` and `llms.txt`.
- Acceptance spec: `docs/engineering/40-nar-browser-requirements.md`
  (`NAR-R1..NAR-R20`).

## 6. Detector results on the corpus (12 November 2026)

13,332 passages scanned; 371 matched — 356 hellfire, 15 worldly — with the
Qur'an contributing 262 and the balance spread across the hadith collections
and harvested books. The seerah section fills as seerah corpora are
harvested; the books section grows with every future harvest without further
tagging.

## 7. Tagged-in-place records

`nar-browser` on `concept/jahannam`, `concept/fire`, `concept/zaqqum`,
`concept/sirat`, `concept/al-nar-al-yaman`,
`concept/malik-keeper-of-jahannam`, `concept/ashab-al-nar-wa-ashab-al-jannah` —
the graph already held every concept the shelf needs; no new record was
required for launch. Dedicated hellfire-book harvests (Ibn Rajab's
التخويف من النار, Ibn al-Qayyim's هادي الأرواح) are the next wave and will
enter the `books` section through the detector.
