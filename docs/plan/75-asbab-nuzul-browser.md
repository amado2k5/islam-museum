# Plan 75 — Asbab al-Nuzul Browser (متصفح أسباب النزول لآيات القرآن والسور)

_Requested by the founder (this session): "start working on أسباب النزول
لآيات القرآن والسور where it should list all the mentioned and written
أسباب النزول لآيات القرآن والسور that are in quran, seerah, sunna,
tabi3een stories, quotes, mentioned and written in books that were
harvested and any future harvested book if it has a أسباب النزول لآيات
القرآن والسور should be viewable here. add a box for it on landing page
and in navigation menus. make sure this is done end to end and full
detailed proses and make it ready for production at the end of this."_

_Scope agreed with the founder: detector plus curated seed this pass — a
full manual harvest of al-Wahidi's 500+ verses is deferred to the normal
mining pipeline; the slug is `nuzul` because `revelation` is already used
by `/words/revelation/`._

## 1. What it is

A browser over the one graph that gathers every report of an **occasion of
revelation** (sabab al-nuzul) — the event, question or circumstance in
response to which a Qur'anic verse or sura came down — wherever the
museum's sources mention or write one: in the Qur'an itself, the Sunnah
and hadith, the seerah, Companion and Tabi'i reports, and every book that
has been or will be harvested. The famous cases stand at the front: the
first revelation in the cave of Hira, the verse of hijab, the prohibition
of wine, the ifk, the li'an verses, the zihar of Khawla bint Tha'laba, the
adhan, and the verses of Badr and Uhud — each seeded with its citation;
the whole corpus of al-Wahidi's *Asbab nuzul al-Qur'an* and every later
book (al-Suyuti's *Lubab al-Nuqul*, the *Itqan* chapter, tafsir works)
enters automatically as its passages are mined.

## 2. Architecture

The standard browser architecture (cf. plan 46 Mukatabat), no new class:

- **Detector** `scripts/nuzul.ts` — a build-time, graph-level pass.
  `NUZUL_TAG = "nuzul-browser"`. `nuzulSignalsOf` normalises Arabic
  (diacritics, tatweel) and matches the explicit vocabulary of the science
  («سبب نزول»، «أسباب النزول»، «نزلت فيه/فيهم/فيها»، «نزلت هذه الآية»،
  «أنزل الله»، «فأنزل الله»، «نزل بها جبريل») plus revelation-framing
  tied to a named occasion or agent. Work-level admission: passages of
  recognised Asbab al-Nuzul / tafsir works (e.g.
  `work/asbab-al-nuzul-wahidi`) enter by work metadata. Guarded senses
  excluded: rain, guests, illness, water, punishment, the eschatological
  descent of Isa; `NUZUL_EXCLUDE` lists verified false-positive ids.
- **Taxonomy** — five sections (`quran`, `sunnah`, `seerah`, `books`,
  `curated`) from the work's genre; `nuzul_kind` `occasion`/`mention`;
  `narrator` `prophetic`/`companion`/`tabii`/`later` — the generation of
  the reporter, which is the axis the scholarship itself uses.
- **Curated records** — tagged in place: `event/first-revelation`,
  `concept/awwal-ma-nazal-min-al-quran`, `work/asbab-al-nuzul-wahidi`,
  `work/sharh-hadith-al-nuzul`, the four `uloom-al-quran-asbab-nuzul-*`
  passages. Eight new seed passages `passage/nuzul-*` (iqra, hijab, khamr,
  ifk, li'an, zihar, adhan, Badr) each citing Sahih al-Bukhari or Sunan
  al-Nasa'i with draft review status.
- **Site** — `site/src/lib/nuzul.ts` wrapper; page
  `site/src/pages/[lang]/nuzul/[...page].astro` with badge, lede,
  status/counts, method note, API link, section + narrator + kind chips,
  `FullFilter`, `PagedNav`, sectioned cards; client filter
  `site/src/scripts/nuzul-filter.ts`.
- **Signature visual** — `site/src/components/sig/NuzulDescent.astro`: a
  mushaf-ordered strip of 114 sura spines; suras carrying detected
  occasions light in gold and scale by count; a companion strip shows the
  narrator-generation distribution.
- **Nav + landing** — `nuzul` in `ExplorePage`, `explorePages`
  (`ready: true`), the `texts` group of `EXPLORE_GROUPS`; a unique
  explorer card on `Landing.astro` (a descending beam onto an open book).
- **i18n** — `explore.nuzul` and the `nuzul.*` namespace in all seven
  files (ar, en, ur, fr, es, tr, id).
- **API** — `/api/v1/nuzul.json` via `FEATURE_EXPORTS` with
  `section`, `nuzul_kind`, `narrator`, `signals`; declared in
  `site/public/openapi/v1.json`, `llms.txt.ts`, `docs/site/browsers.md`,
  `docs/data/README.md`.
- **Tests** — `scripts/features-api.test.ts`: detection positives, the
  gated false positives, future-book inclusion, per-field assertions.

## 3. Acceptance spec

`docs/engineering/67-asbab-nuzul-browser-requirements.md` — NZ-R01 through
NZ-R26 — is the original-requirements record for production validation.
