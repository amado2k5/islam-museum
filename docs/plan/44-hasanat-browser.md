# Plan 44 — Hasanat Browser (متصفح الحسنات)

_Requested by the founder 11 November 2026: "start working on
متصفح الحسنات where it should list all the mentioned and written
الحسنات that are in quran, see rah, sunna, tabi3een stories ,
quotes , mentioned and written in books that were harvested and any
future harvested book if it has a الحسنات should be viewable here.
add a box for it on landing page and in navigation menus. make sure
this is done end to end and full detailed proses and make it ready
for production at the end of this. this is only about الحسنات and
everything mentioned about الحسنات anywhere in any of the sunni books
or quran or sunna or sera. find all the instances where الحسنات Were
mentioned or part of quotes from quran, sunnah, Hadith, seerah or
from sa7aba and tabi3een and add those stories, mentions, quotes,
details. also add this in engineering documents as the original
requirements to allow AI later on to test and validate it when it is
in production."_

## 1. What it is

A browser over the one graph that gathers every mention of the good
deeds (الحسنات) the museum's sources carry: the Qur'anic verses that
record, multiply and efface them, the hadiths on the writing of
intentions and deeds, the good loan to God, «الحسنى» the reward of
ihsan, the Companion and Successor reports, and every mention in the
seerah books and every harvested book — plus the curated records on
good deeds themselves. It follows the Du'a Browser architecture
(PR #6020, plan 43): passages are ordinary graph nodes found at build
time by a shared detector; curated records carry the `hasanat-browser`
tag; there is no side table and no second list.

The key mechanism: **passages are not tagged — they are detected.**
`scripts/hasanat.ts` matches a guarded lexicon over each passage's own
`text_search`/`text` — never labels or summaries, which are museum
metadata. A mention of الحسنات in a book harvested next month appears
here the day its passage record lands — the founder's "any future
harvested book" requirement, met by the detector rather than by
tagging.

## 2. Scope — what counts as الحسنات

In scope: the literal good-deeds noun family —

- **«الحسنات» and «حسنات»** — the plural, definite and indefinite;
  always the good deeds.
- **«الحسنة» and «حسنة»** — the singular, noun uses: «من جاء
  بالحسنة»، «همّ بحسنة»، «الحسنة والسيئة»، «قرضا حسنا» family,
  «سنة حسنة» (the good-deeds report, deliberately kept).
- **«الحسنى»** — gated: counts as the best reward («جزاء
  الحسنى»، «الحسنى وزيادة»، «وبالحسنى»), but NOT after the
  divine-names formula «الأسماء الحسنى» or «كلمة…الحسنى» adjective
  uses.
- **Fixed collocations**: «قرضا حسنا» / «قرض حسن» (the good loan,
  qard hasan), «بدل… حسنا بعد سوء» (evil changed for good, 27:11).

Out of scope (verified): bare «حسن» and «الحسن» (the Hasan personal
names, the hadith grade «حديث حسن», adjectives like «خلق حسن»),
the «حسنا» adverb/adjective («رزقا حسنا»، «أجرا حسنا»، «وعدا
حسنا»), «حسنة»/«الحسنة» as the feminine adjective on a host noun
(«أسوة حسنة»، «الموعظة الحسنة»، «شفاعة حسنة») gated by a
preceding-token check, «الأسماء الحسنى» (the divine names belong to
the asma browser), and the wider good-deeds vocabulary (الصالحات،
البر، الطاعات) — those are synonyms, not الحسنات. Known false
positives are excluded by id in `HASANAT_EXCLUDE`.

Two senses of «حسنة» are documented and both stay in: the deed sense
(«من جاء بالحسنة») and the worldly-good sense («وإن تصبهم حسنة
يقولوا»، «ربنا آتنا في الدنيا حسنة») — the noun for "a good thing /
good fortune" as well as "a good deed". The engineering spec records
this explicitly so validators do not flag it as an error.

## 3. Records

- **66 passage records detected** in the current corpus: 43 Qur'an
  ayahs (`work/quran`), 22 sunnah reports (`sahih-al-bukhari` 3,
  `sahih-muslim` 8, `sunan-abi-dawud` 2, `sunan-al-nasai` 2,
  `sunan-ibn-majah` 3, `jami-al-tirmidhi` 2, `muwatta-malik` 1,
  `arbaun-nawawi` 1) and 1 poetry record
  (`poem-hassan-diwan-muzayna-la-yura-fiha-khatib-03`, «رجال تهلك
  الحسنات فيهم»). Seerah section is empty — the harvested corpus has
  no sira-genre passages carrying the term; it fills automatically.
- **14 curated records**: the new umbrella `concept/al-hasanat` with
  trilingual draft prose, plus thirteen existing records tagged in
  place — concepts `qard-hasan`, `kitab-al-amal`, `istighfar`,
  `dhikr`, `hamm`, `azm`, `ikhlas`, `gecko`, `al-salat-ala-al-nabi`,
  `intercession-shafaa`, `asbab-suqut-al-uquba`,
  `people-of-the-heights-and-the-scales`, and the event
  `angels-report-the-intended-sin` (the himm-bi-hasana hadith qudsi).
  Reuse-before-create held: records were tagged only where their
  content genuinely engages الحسنات.
- **`basis_for → concept/al-hasanat` edges** on the seven
  `qudsi-kitabat-al-hasanat` hadith-qudsi passages
  (bukhari-6491, bukhari-7501, muslim-0128, muslim-0128b,
  muslim-0129, muslim-0131, tirmidhi-3073) and the
  angels-report event — those reports are the doctrinal basis of the
  concept.

## 4. Sections (the corpus, not a topic taxonomy)

`quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة ·
`books` في سائر الكتب · `curated` السجلات المنتقاة — derived from
each passage's work (`work/quran`, genre `hadith`/`sira` or
`unit: hadith`) and from the `hasanat-browser` tag on curated
records.

## 5. Pages

- `/[lang]/hasanat/` — the home: lede, status count, method note,
  API link, section chips with counts, a client-side filter over
  trilingual labels, summaries, work names and text excerpts, and the
  cards. Header block carries `data-pagefind-body`; the lists are
  `data-pagefind-ignore`.
- Every card links to the **ordinary entity page** of its record
  (`/{lang}/passage/<slug>/` or `/{lang}/concept/<slug>/`).

## 6. Surface

- `scripts/hasanat.ts` — the shared detector + corpus classifier +
  section tag reader (used by both `scripts/export-api.ts` and
  `site/src/lib/hasanat.ts`).
- `site/src/lib/hasanat.ts` (shared reads), `site/src/lib/nav.ts`
  (`hasanat` key, `ready: true`), `site/src/pages/[lang]/hasanat/
  index.astro`, `site/src/scripts/hasanat-filter.ts`,
  `i18n/{ar,en,ur}.yaml` (`explore.pages.hasanat` + `hasanat:` block
  in the same commit), `/api/v1/hasanats.json` via `FEATURE_EXPORTS`,
  documented in `docs/data/README.md`,
  `site/public/openapi/v1.json` and `llms.txt`. Landing card +
  Explore menu entry via `explorePages`. Register rows in
  `docs/site/browsers.md`, plan index, `docs/agents/lanes.md`
  (`hasanat` lane), `docs/status.md`, `CANARY.md` (v1.17.0).
- `docs/engineering/32-hasanat-browser-requirements.md` — the
  requirements and production checklist for later validation
  (`HASANAT-R..`).

## 7. Status

Built 11 November 2026: 66 detected passages + 14 curated records =
80 items in `/api/v1/hasanats.json` (43 quran, 22 sunnah, 1 books; the
seerah section fills as seerah passages are harvested), the
`/[lang]/hasanat/` page in three languages, the landing card and
Explore menu entry, full API docs. New records are draft-tier until a
human reads them; nothing goes live until the founder deploys. Future
enrichment waves: seerah and books passages as they are harvested,
good-deeds-themed books (Riyad al-Salihin chapters, Ibn Rajab's
commentary, al-Ghazali's Ihya'), deeper Companion/Tabi'in anecdote
mining, and the `HASANAT-R..` production checklist.
