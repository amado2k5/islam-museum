# Plan 44 — Divine and Prophetic Miracles Browser (متصفح المعجزات الإلهية ومعجزات الرسل)

_Requested by the founder: "start working on متصفح المعجزات الالهية ومعجزات
الرسل where it should list all the mentioned and written المعجزات الالهية
ومعجزات الرسل that are in quran, see rah, sunna, tabi3een stories , quotes ,
mentioned and written in books that were harvested and any future harvested
book if it has a المعجزات الالهية ومعجزات الرسل should be viewable here. add a
box for it on landing page and in navigation menus … find all the instances
where المعجزات الالهية ومعجزات الرسل Were mentioned or part of quotes from
quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and add those
stories, mentions, quotes, details … also add this in engineering documents
as the original requirements to allow AI later on to test and validate it
when it is in production."_

The acceptance spec for production validation is
`docs/engineering/32-miracles-browser-requirements.md` (`MIR-R..` ids).

## 1. What it is

A browser over the one graph that gathers every mention of the **divine
miracles** (المعجزات الإلهية — the miracle of the Qur'an, the cosmic signs of
creation, the proofs of prophethood) and the **prophets' miracles**
(معجزات الرسل — the staff, the sea, the she-camel, the ark, the fire, the clay
bird, the cradle speech, the heavenly table, Sulayman's signs, the dreams, the
annunciation, the covenant chest, the moon-split, the Isra' and Mi'raj, the
descent of 'Isa, the Prophet's own signs, and the destruction of the deniers'
nations) in the museum's sources: the Qur'an, the Sunnah and hadith, the
seerah, Companion and Tabi'i reports and stories, and every harvested book —
plus subject pages for the miracle-bearing prophets, concepts and events. It
follows the Messengers/Dream Browser architecture: passages are ordinary graph
nodes found at build time by a shared detector and joined to the canonical
`mentions` edges already in the graph; curated records carry the
`miracles-browser` tag; there is no side table and no second list.

Like the sibling browsers, **passages are not tagged — they are detected.**
`scripts/miracles.ts` matches a guarded lexicon against each passage's own
matn (`text_search`/`text`, never the isnad-heavy summary or the work label),
in Arabic (patterns written in natural orthography and run through the same
normalizer as the text) and by corpus. A miracle mentioned in a book harvested
next month appears here the day its passage record lands — the founder's "any
future harvested book" requirement, met by the detector rather than by
tagging.

The lexicon is deliberately **gated**, because unvocalized Arabic makes the
miracle vocabulary ambiguous:

- «معجز/معجزه» in the Qur'an is almost always the verb «يُعجِز» (to defeat /
  escape: «وما أنتم بمعجزين»), never the noun «مُعْجِزَة» (miracle) — the bare
  form is gated out of the Qur'an corpus and counts in the books corpus only
  beside miracle vocabulary.
- «أعجاز نخل» is "palm-roots" (the felled 'Ad), not inimitability — excluded
  by `none` gates on the i'jaz patterns.
- «حبا» is "love", not a loaf; «قدير» is a divine attribute everywhere;
  «خسف» is humiliation, not the lunar eclipse; «الكرامة» can be generosity or
  «ذو الكرامة»; «المن» is only the manna beside Banu Isra'il context; «عاد» is
  "returned" as often as the people of 'Ad; «صالح» is a common adjective;
  «موس» sits inside «موسم» (season); «فر» is "flee", not a sea-parting; «مائدة»
  is a dining table everywhere.
- Event topics carry bounded co-occurrence windows (e.g. «عصا … ثعبان» within
  ~30 characters) so a staff in an unrelated story does not count.
- **Books-corpus gate**: in the general book corpus a miracle topic requires
  the miracle lexicon (معجز/خارق/اعجاز/دلائل/براهين/علامات/حجة/سلطان…)
  somewhere in the passage — a random book that merely mentions «عصا» or
  «ناقة» does not enter; the Qur'an, Sunnah and seerah narrate the events
  themselves and are judged on the patterns alone.
- `MIRACLES_EXCLUDE` / `MIRACLE_TOPIC_EXCLUDE` are the curated escape hatches
  for verified false positives.

## 2. Scope decisions

- **Divine miracles AND prophets' miracles** (founder clarification): the
  cosmic-sign verses (الآيات الكونية — «أفلا ينظرون»، «وما في السماوات
  والأرض») are inside «المعجزات الإلهية» and are included as the
  `cosmic-signs` topic, per the founder's explicit confirmation during
  planning.
- **Subject pages per prophet/concept/event**: `MIRACLE_SUBJECTS` in
  `scripts/miracles.ts` — the miracle-bearing prophets (Muhammad, Ibrahim,
  Isma'il, 'Isa, Zakariyya, Yahya, Yusuf, Musa, Harun, Sulayman, Ayyub, Yunus,
  al-Khidr, Nuh, Hud, Salih, Shu'ayb, Lut, Talut) plus the concept and event
  records the museum already keeps (mujiza, al-tahaddi-bil-quran, ijaz-al-quran,
  al-ayat-al-kawniyya-wal-mujiza, karamat-al-awliya, inshiqaq-al-qamar,
  descent-of-isa, isra-and-miraj, year-of-the-elephant-and-birth,
  ayat-musa-al-tis). Each topic maps to its subjects through
  `MIRACLE_TOPIC_SUBJECTS`; the deniers'-nations destructions are split per
  people (`ad-destruction` → Hud, `thamud-destruction` → Salih, …) so each
  lands on its prophet.
- **Companion and Tabi'i reports**: miracle reports narrated by the Companions
  and Successors enter through the Sunnah/seerah/books corpus sections — the
  detector reads passage matn only, so isnad names never create hits.
- **Not a generic encyclopedia**: ordinary «معجزة» uses that are not about
  divine/prophetic miracles, and lexical hits without miracle context, stay
  out; the detector is recall-tuned then precision-pruned by the exclusion
  sets.

## 3. Architecture (mirrors docs/plan/41)

- `scripts/miracles.ts` — the shared detector: `MIRACLES_TAG`,
  `MIRACLE_SECTIONS` (quran/sunnah/seerah/books/curated), `MIRACLE_TOPICS`
  (33 topics across the meta group — doctrine, challenge, i3jaz, karamat,
  unnamed — the cosmic group, and the event group), `MIRACLE_TOPIC_KIND`
  (event/sign/mention), `MIRACLE_SUBJECTS`, `MIRACLE_TOPIC_SUBJECTS`,
  `miracleTopicsOf`, `miracleKindOf`, `miracleCorpusOf`, `miracleTagSection`,
  `normalizeMiracleArabic`.
- `site/src/lib/miracles.ts` — the browser's shared reads: the feed items,
  the subject index, `passagesOf`, `relatedOf`.
- `site/src/pages/[lang]/miracles/index.astro` — the home: lede, status,
  method note, subject grid, five corpus sections, filter.
- `site/src/pages/[lang]/miracles/[slug].astro` — the subject page: summary,
  Qur'an ayahs, Sunnah/seerah/book reports, related records.
- `site/src/scripts/miracles-filter.ts` — the client-side filter.
- `scripts/export-api.ts` — `miracles.json` (`miracleApiData`): items with
  `section`, `kind`, `subjects`, `topics`, work, ref, excerpt, edges; the
  `subjects` index.
- i18n `miracles:` blocks in `i18n/{ar,en,ur}.yaml` + `explore.pages.miracles`.
- `site/src/lib/nav.ts` Explore list + `site/src/components/Landing.astro`
  card (thumb + accent).
- OpenAPI `/miracles.json`, `llms.txt` line, `docs/data/README.md` row,
  `scripts/features-api.test.ts` export-shape test.

## 4. Graph data

- The miracle-bearing prophet/concept/event records already exist; curated
  records join the browser by carrying the `miracles-browser` tag (and
  `miracles-<section>` for section placement).
- `mentions` edges: passages already carry `mentions → person/…` edges from
  the Quran and hadith corpora; the browser joins them into the subject index
  alongside the topic→subject map, so a miracle passage that names its prophet
  lands on that prophet's page even when the topic map is generic.
- Book mining: miracle-bearing books already in the harvest registry (the
  Tathbit Dalail corpus among them) are mined into passage records so their
  miracle reports enter the books section; future harvests enter
deterministically through the detector.

## 5. Validation and production

`docs/engineering/32-miracles-browser-requirements.md` is the acceptance spec
(`MIR-R..`): detector truth tables (true/false positives), corpus sections,
subject index, API shape, search indexing, i18n, accessibility, and the
production smoke checklist. `npm run validate`, `npm test` and `npm run build`
are the local gates; the MIR-R checklist is the production gate.

## 6. Status

- Detector + unit tests: `scripts/miracles.ts`, `scripts/miracles.test.ts`,
  `scripts/muj-scan.ts` (survey). The alternation-leak fix dropped the survey
  from thousands of false hits to ~490 true detections across all corpora.
- Site lib, home + subject pages, filter, i18n, nav, landing card: shipped.
- API export `miracles.json`, OpenAPI, llms.txt, data README, feature test:
  shipped.
- Curated `miracles-browser` tags on the concept/event records: shipped.
- Tathbit Dalail mining: shipped — 195 `unit: chapter` passages from the
  Arabic Wikisource edition (`source/ar-wikisource`, draft), 42 already
  detected into the books section; the work record carries author, genre and
  language. The Wikisource transcription drops the print edition's chapter
  titles, so labels number chapters by position in the Wikisource text.
- Remaining: `mentions`-edge enrichment for miracle passages (new harvests
  add theirs), detector precision pass on any new false-positive families the
  production review finds, human read of draft records, MIR-R production run.
