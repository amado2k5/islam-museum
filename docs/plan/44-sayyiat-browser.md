# Plan 44 — Sayyi'at Browser (متصفح السيئات)

_Requested by the founder: "start working on متصفح السيئات where it should
list all the mentioned and written السيئات that are in quran, seerah, sunna,
tabi3een stories, quotes, mentioned and written in books that were harvested
and any future harvested book if it has a السيئات should be viewable here. add
a box for it on landing page and in navigation menus. make sure this is done
end to end and full detailed proses and make it ready for production at the
end of this. this is only about السيئات and everything mentioned about
السيئات anywhere in any of the sunni books or quran or sunna or sera. find
all the instances where السيئات were mentioned or part of quotes from quran,
sunnah, Hadith, seerah or from sa7aba and tabi3een and add those stories,
mentions, quotes, details. also add this in engineering documents as the
original requirements to allow AI later on to test and validate it when it
is in production."_

## 1. What it is

A browser over the one graph that gathers every mention of «السيئات» — the
ill-deeds — and everything tied to them: the sin, guilt and disobedience
vocabulary of the Qur'an, the hadith reports of the two Sahihs, the Muwatta
and the Sunan, the sins and repentances the seerah books carry of Companions
and Successors, the sin mentions of every harvested book, and whatever a
future harvest brings — plus the curated records on sin, repentance and
seeking forgiveness themselves. It follows the Du'a Browser architecture:
passages are ordinary graph nodes found at build time by a shared detector;
curated records carry the `sayyiat-browser` tag; there is no side table and
no second list.

The key mechanism: **passages are not tagged — they are detected.**
`scripts/sayyiat.ts` matches a guarded lexicon over each passage's own
`text_search`/`text` — never labels or summaries, which are museum metadata
(the «كتاب الذنوب» chapter name of a hadith collection is not evidence). A
sin mention in a book harvested next month appears here the day its passage
record lands — the founder's "any future harvested book" requirement, met by
the detector rather than by tagging.

## 2. Scope — what counts as a «سيّئ» mention

In scope: the sins theme in its full lexical range —

- **The «سيّئ» family**: «السيئات»، «السيئة»، «سيّئ»، «ساء/يسوء»، «أساء/
  يسيء/أسيء/مسيء/إساءة» — the words the founder named, in every inflection.
- **The names of sin**: «إثم/آثام/يأثم»، «ذنب/ذنوب/أذنب/مذنب»، «معصية/معاصي/
  عاصي/يعصي/عصيان»، «فاحشة/فواحش»، «خطيئة/خطايا».
- **The size words**: «كبائر»، «صغائر» (unambiguous), and the gated
  «كبيرة/صغيرة» pair — counted only when a strong sin signal already fired,
  which admits «لا يغادر صغيرة ولا كبيرة إلا أحصاها» while keeping «مدينة
  كبيرة» out.
- **The remaining verdicts**: «لمم»، «فاسق/فسوق»، «فاجر/فجار»، «أجرم/
  مجرم».
- **Verified false positives excluded by id** (`SAYYIAT_EXCLUDE`): the
  waterskins «ذنوب من ماء»، the tailbone «الذنب» of the Muwatta hadith, and
  the poet's companion kunya «أبو العاصي». Bounded Arabic token patterns keep
  «النساء» from ever matching «ساء»، «تكبيرة» from matching «كبيرة»، and the
  animal-tail «ذنب» compounds out.

Every passage is marked `sayyi` when it carries the «سيّئ» word family and
`related` when it is only about the wider sins theme.

## 3. Records

- **412 passage records in the browser** in the current corpus: 330 Qur'an ayahs
  (`work/quran`), 73 sunnah reports (`work/sahih-muslim` 22,
  `work/muwatta-malik` 12, `work/jami-al-tirmidhi` 6,
  `work/sahih-al-bukhari` 4, `work/arbaun-nawawi` 2,
  `work/sunan-ibn-majah` 2) and 9 book passages (poetry: `hamasa-qurayt`,
  `hassan-diwan` ×2, `muallaqat-labid`, `mutanabbi` ×2, `qasidat-banat-suad`,
  `abu-khaythama-verses`, `khalid-ibn-said-reply-to-aban`) — the books
  section filling itself on harvested verse exactly as designed. Seerah is
  empty until sira-genre passages carry sin vocabulary; it fills automatically.
- **7 curated records tagged in place**: the new umbrella `concept/al-sayyiat`
  (with trilingual prose, draft-tier) plus `concept/dhanb`,
  `concept/ithm`, `concept/minor-sins-saghair`, `concept/tawba`,
  `concept/istighfar` and `event/angels-report-the-intended-sin`.
- **`mentions → concept/al-sayyiat` edges** on all detected/tagged passages, each
  citing the passage's own first source.

## 4. Sections (the corpus, not a topic taxonomy)

`quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر
الكتب · `curated` السجلات المنتقاة — derived from each passage's work
(`work/quran`, genre `hadith`/`sira` or `unit: hadith`) and from the
`sayyiat-browser` tag on curated records.

## 5. Pages

- `/[lang]/sayyiat/` — the home: lede, status count, method note, API link,
  section chips with counts, a client-side filter over trilingual labels,
  summaries, work names and text excerpts, and the cards. Header block
  carries `data-pagefind-body`; the lists are `data-pagefind-ignore`.
- Every card links to the **ordinary entity page** of its record
  (`/{lang}/passage/<slug>/` or `/{lang}/concept/<slug>/`).

## 6. Surface

- `scripts/sayyiat.ts` — the shared detector + corpus classifier + section
  tag reader (used by both `scripts/export-api.ts` and
  `site/src/lib/sayyiat.ts`).
- `site/src/lib/sayyiat.ts` (shared reads), `site/src/lib/nav.ts` (`sayyiat`
  key, `ready: true`), `site/src/pages/[lang]/sayyiat/index.astro`,
  `site/src/scripts/sayyiat-filter.ts`, `i18n/{ar,en,ur}.yaml`
  (`explore.pages.sayyiat` + `sayyiat:` block in the same commit),
  `/api/v1/sayyiat.json` via `FEATURE_EXPORTS`, documented in
  `docs/data/README.md`, `site/public/openapi/v1.json` and `llms.txt`.
  Landing card + Explore menu entry via `explorePages`. Register rows in
  `docs/site/browsers.md`, plan index, `docs/agents/lanes.md` (`sayyiat`
  lane), `docs/status.md`, `CANARY.md` (v1.17.0).
- `docs/engineering/32-sayyiat-browser-requirements.md` — the requirements
  and production checklist for later validation (`SAY-R..`).

## 7. Status

Built: 412 passages (395 detected + 17 tagged) + 7 curated records in `/api/v1/sayyiat.json`
(330 quran, 73 sunnah, 9 books; seerah fills as sira-genre passages are
harvested), the `/[lang]/sayyiat/` page in three languages, the landing card
and Explore menu entry, full API docs.
New records are draft-tier until a human reads them; nothing goes live until
the founder deploys. Future enrichment waves: seerah passages as they are
harvested, targeted books (Riyad al-Salihin, Targhib wa Tarhib, Mishkat,
Bulugh al-Maram) where their editions are mined into the graph, deeper
Companion/Tabi'in anecdote mining, and the `SAY-R..` production checklist.
