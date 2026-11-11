# 32 · Sayyi'at Browser — requirements and production checklist

_The feature requirements for «متصفح السيئات» (the Sayyi'at Browser — every
mention of the sayyi'at and the sins theme in the Qur'an, the Sunnah, the
seerah, Companion and Tabi'i reports and every harvested book), as requested
by the founder and delivered in `docs/plan/44-sayyiat-browser.md`. Written
so any person or AI agent can validate each requirement against production
(`https://islam.museum`, `https://api.islam.museum`) without reading the
plan. Every requirement has an id (`SAY-R..`), a "how to check" line, and the
artifact that proves it._

## 0. The original request (verbatim)

> "start working on متصفح السيئات where it should list all the mentioned and
> written السيئات that are in quran, see rah, sunna, tabi3een stories ,
> quotes , mentioned and written in books that were harvested and any future
> harvested book if it has a السيئات should be viewable here. add a box for
> it on landing page and in navigation menus. make sure this is done end to
> end and full detailed proses and make it ready for production at the end
> of this. this is only about السيئات and everything mentioned about
> السيئات anywhere in any of the sunni books or quran or sunna or sera. find
> all the instances where السيئات Were mentioned or part of quotes from
> quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and add those
> stories, mentions, quotes, details. also add this in engineering documents
> as the original requirements to allow AI later on to test and validate it
> when it is in production."

Scope note: «السيئات» here means the sins theme in full — not only the exact
plural word. It covers every mention of ill-deeds, sin, guilt and
disobedience across the «سيّئ/ساء/سوء» family, the names of sin
(«إثم»، «ذنب»، «معصية»), major and minor sins («كبائر»، «صغائر»), and the
remaining verdicts («لمم»، «فسق»، «فجور»، «إجرام») in the Qur'an, the
Sunnah, the seerah and every harvested book. It does not include rulings,
fatwas or a theological essay — every record is an ordinary museum record
with its own sources.

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| SAY-R01 | No new class or side table: every browser record is an ordinary graph node — passages detected at build time, curated records tagged `sayyiat-browser` (+ optional `sayyiat-<section>`) | `grep -rl "sayyiat-browser" data/` — hits under `data/concept/`, `data/event/` and `data/passage/` `relations:`/`tags:` only; `scripts/lib.ts` `CLASSES` unchanged |
| SAY-R02 | Five sections derived from the corpus, not a topic list: `quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر الكتب · `curated` السجلات المنتقاة | `SAYYIAT_SECTIONS` in `scripts/sayyiat.ts`; `site/src/lib/sayyiat.ts` |
| SAY-R03 | **Automatic inclusion of future harvested books**: a sin mention in any book enters the browser the day its passage record lands in the graph — detection is a build-time function of the compiled graph, never a hand-kept list | add a fixture passage containing «السيئات» to a test work, run `npm run graph && npx tsx scripts/export-api.ts`, confirm it appears in `sayyiat.json` with the right `section`; then remove the fixture |
| SAY-R04 | Detection is over passage-owned text only (`text_search`, `text` fallback) — never labels or summaries, so chapter names like «كتاب الذنوب» do not create false hits | `sayyiatSignalsOf` in `scripts/sayyiat.ts`; a fixture passage whose label says «الذنوب» but whose text does not must NOT be detected |
| SAY-R05 | Arabic diacritics and tatweel are stripped before matching; patterns are bounded tokens tolerating clitic prefixes and pronoun suffixes | fixture «السيِّئاتِ» (fully vocalised) is detected; «النساء» is NOT detected as «ساء» |
| SAY-R06 | Strong signals: the «سيّئ» family («السيئات»، «سيّئ»، «ساء/يسوء»، «أساء/يسيء/أسيء/مسيء/إساءة»), the names of sin («إثم/آثام/يأثم»، «ذنب/ذنوب/أذنب/مذنب»، «معصية/معاصي/عاصي/يعصي/عصيان»، «فاحشة/فواحش»، «خطيئة/خطايا»), «كبائر»، «صغائر»، «لمم»، «فاسق/فسوق»، «فاجر/فجار»، «أجرم/مجرم» | `STRONG` in `scripts/sayyiat.ts`; `passage/quran-11-114` («إن الحسنات يذهبن السيئات») detected |
| SAY-R07 | Weak signals «كبيرة/صغيرة» count ONLY when a strong sin signal already fired — «لا يغادر صغيرة ولا كبيرة إلا أحصاها» (18:49) is in via «المجرمين»; «مدينة كبيرة» (9:121) and «واديا صغيرا ولا كبيرة» stay out | `WEAK` + `sayyiatSignalsOf` gating; verify both passages above |
| SAY-R08 | Known false positives excluded by id in `SAYYIAT_EXCLUDE`: `passage/muwatta-1-166` («ذنوب من ماء» — waterskins), `passage/muwatta-2-642` («الذنب» — tailbone), `passage/poem-hassan-diwan-khabat-banu-asad-02` («أبو العاصي» — a kunya) | `SAYYIAT_EXCLUDE`; none of these ids in `sayyiat.json` |
| SAY-R09 | Out-of-scope senses verified absent: «النساء» never matches «ساء»; «تكبيرة» never matches «كبيرة»; unrelated «ذنب» animal-tail compounds and «عاصي» proper names do not create hits | `passage/quran-4-127`-class women verses; prayer «تكبيرة» passages — none detected |
| SAY-R10 | `sayyiat_kind`: `sayyi` when the passage carries the «سيّئ» word family, `related` for the wider sins theme; curated records carry `null` | `sayyiatKindOf`; `sayyiat.json` rows carry `sayyiat_kind` and the matched `signals` list |
| SAY-R11 | Corpus classification: `work/quran` → quran; genre `sira` → seerah; genre `hadith` or `unit: hadith` → sunnah; everything else → books; works not yet harvested land correctly the day their genre is known | `sayyiatCorpusOf`; the 9 poetry/book passages land in `books` |
| SAY-R12 | `mentions → concept/al-sayyiat` edges on every detected passage, each citing the passage's own first source | `grep -l "concept/al-sayyiat" data/passage/*.yaml \| wc -l` ≥ 387 |
| SAY-R13 | Umbrella concept `concept/al-sayyiat` exists with trilingual labels/summaries, `sources`, `provenance`, `status.review: draft` and `tags: [sayyiat-browser]`; related concepts tagged in place: `dhanb`, `ithm`, `minor-sins-saghair`, `tawba`, `istighfar`, `event/angels-report-the-intended-sin` | `data/concept/al-sayyiat.yaml`; `grep -l "sayyiat-browser" data/concept data/event` → 7 files |
| SAY-R14 | Every record carries `sources`, `provenance`, and `status.review: draft` until a human reads it (AI-content rule); already-published tagged records keep `review: published` | spot-check `data/concept/al-sayyiat.yaml`; the tagged files keep their status |

## 2. Corpus coverage (the founder's source list)

| Id | Requirement | How to check |
|---|---|---|
| SAY-R20 | **Qur'an**: every ayah carrying or mentioning the sins theme is listed — «إن الحسنات يذهبن السيئات» (11:114), «إلا اللمم» (53:32), «لا يغادر صغيرة ولا كبيرة إلا أحصاها» (18:49), «وكذلك نجزي المحسنين» pairings, «رب اغفر لي» repentance verses | `/api/v1/sayyiat.json` `section:"quran"` → 330 items; `/ar/sayyiat/` quran section shows 330 cards |
| SAY-R21 | **Sunnah**: the sin mentions of the two Sahihs, the Muwatta and the Sunan — the hadith qudsi «إذا هم العبد بمعصية» (Muslim 2687), «أتبع السيئة الحسنة» (Arba'un 18), «الذنب ما حاك في صدرك», major/minor sin reports, repentance stories | `section:"sunnah"` → 48 items; spot-check `muslim-0128`, `muslim-2687`, `arbaun-18`, `bukhari-7501` cards link to their passage pages |
| SAY-R22 | **Seerah**: the section exists in the taxonomy and fills itself — any passage whose work carries genre `sira` lands in `seerah` automatically | `sayyiatCorpusOf` in `scripts/sayyiat.ts`; today empty — verify it renders nothing rather than erroring |
| SAY-R23 | **Harvested books**: every non-scripture, non-hadith, non-seerah work with a sin passage lands in `books`, classified by genre the day its passages arrive — today the 9 poetry passages (Hamasa, Hassan diwan ×2, Mu'allaqat, Mutanabbi ×2, Qasidat Banat Su'ad, Abu Khaythama, Khalid b. Sa'id) | `section:"books"` → 9 items |
| SAY-R24 | **Companions and Tabi'in**: their sins, quotes and stories arrive through the same detector — Companion/Tabi'in reports are sunnah/book passages like any other; no separate pipeline needed | any `passage/*` from a tabi'in work with «إثم»/«ذنب»/«سيئة» appears with its work label |
| SAY-R25 | **Curated layer**: 7 records in `section:"curated"` — the umbrella `concept/al-sayyiat` plus `dhanb`, `ithm`, `minor-sins-saghair`, `tawba`, `istighfar` and `event/angels-report-the-intended-sin` | `section:"curated"` → 7 items |

## 3. The browser page `/{lang}/sayyiat/`

| Id | Requirement | How to check |
|---|---|---|
| SAY-R30 | Page exists in all three languages: `/ar/sayyiat/`, `/en/sayyiat/`, `/ur/sayyiat/` | `curl -sI` each → 200 |
| SAY-R31 | Localized title «متصفح السيئات» / "Sayyi'at Browser" / سیّیات کا براؤزر + lede + badge + method note + status count + kind labels («يحمل لفظ السيئات»/«يتكلم عن الإثم والمعصية») | `i18n/{ar,en,ur}.yaml` `sayyiat:` block; view each page |
| SAY-R32 | Section chips with counts, each linking to its anchor; every populated section shows title + description + card grid; empty sections (seerah today) do not render | `/ar/sayyiat/` shows 4 populated sections; chip counts sum to item count |
| SAY-R33 | Every card links to the **ordinary entity page** (`/{lang}/passage/<slug>/` or `/{lang}/concept/<slug>/`), never a browser-only page | inspect card `href`s on `/en/sayyiat/` |
| SAY-R34 | Passage cards show work name + ref/unit (e.g. «صحيح مسلم · 2687»، «القرآن · 11:114») and a text excerpt; the sayyi/related chip shows on passage cards; concept cards show their summary | `/ar/sayyiat/` sunnah cards carry the work/ref line and kind chip |
| SAY-R35 | Client filter narrows cards across labels, summaries, work names, excerpts and kind labels in all three languages; Arabic vowel-insensitive; full list readable with JS off | `site/src/scripts/sayyiat-filter.ts`; open `/ar/sayyiat/` with JS disabled → full list; type «السيئات» → filtered cards |
| SAY-R36 | Pagefind: title/lede/headings inside `data-pagefind-body`; card lists inside `data-pagefind-ignore` | page source carries both attributes; searching «السيئات» or "sayyi'at" reaches the page |
| SAY-R37 | WCAG 2.2 AA, RTL on ar/ur, Arabic parentheses isolated (U+2066/2069), no honorifics typed, `dir`/`lang` correct | validator + visual check |
| SAY-R38 | **Landing card** on the homepage («متصفح السيئات» with sayyiat thumbnail) and **Explore menu** entry, in all three languages | homepage shows the card; `nav.ts` `{ key: "sayyiat", ready: true }`; header explore menu lists it |

## 4. API and documentation

| Id | Requirement | How to check |
|---|---|---|
| SAY-R40 | `https://api.islam.museum/api/v1/sayyiat.json` returns every detected + tagged record with `section`, `sayyiat_kind`, `signals`, `work`, `ref`, `unit`, `text`, `sura`, `aya`, `kind`, `themes`, `tags`, `connections`, `prose` | `curl -s .../sayyiat.json \| jq '.items \| length'` ≥ 390; `feature: "sayyiat-browser"`; `section` ∈ {quran,sunnah,seerah,books,curated}; `sayyiat_kind` ∈ {sayyi,related,null} |
| SAY-R41 | Endpoint documented in `docs/data/README.md`, `site/public/openapi/v1.json` (`/sayyiat.json` path), and `llms.txt` | all three rows exist |
| SAY-R42 | Registered in `docs/site/browsers.md` (feature + export rows), `docs/plan/00-README.md` (plan 44), `docs/plan/06-roadmap.md`, `docs/agents/lanes.md` (`sayyiat` lane), `docs/status.md`, `CANARY.md` (v1.17.0 + entries), `docs/plan/44-sayyiat-browser.md`, this file | all rows present |
| SAY-R43 | `features-api.test.ts` asserts `sayyiat.json` in the export set and its detection/classification/exclusion rules (sayyi vs related, quran/sunnah/books/curated sections, false-positive gates, future-book inclusion) | `npm test` green |

## 5. Governance and delivery

| Id | Requirement | How to check |
|---|---|---|
| SAY-R50 | Gates: `npm run validate` 0 errors, `npm test` all pass, `npm run build` clean | run them |
| SAY-R51 | Work shipped through PRs with canary entries; nothing committed directly to protected `main` | merged-PR list |
| SAY-R52 | **Full trilingual coverage**: the umbrella record carries `label`/`summary`/prose in ar, en and ur (`content/{ar,en,ur}/concept/al-sayyiat.md`); UI strings exist in all three `i18n` files in the same commit | the three prose files exist; `sayyiat:` blocks in all three yaml |
| SAY-R53 | Draft gate: the new umbrella record enters as `status.review: draft` with `provenance`; tagged-in-place records keep their existing review status | `data/concept/al-sayyiat.yaml` status is draft; the tagged files keep theirs |
| SAY-R54 | Deploy readiness: nothing live until the founder deploys; on deploy the card + menu + page + API appear automatically | post-deploy check SAY-R30/R38/R40 |

## 6. Explicitly out of scope / known limits

- **Not a fatwa or ruling**: the browser lists mentions; it prescribes
  nothing. Rulings belong to fiqh records, not here.
- **Exact-word searches miss**: a bare «أساء» with no sin context still
  counts (it is the sins family); genuinely unrelated senses are handled by
  bounded patterns and the id exclusion list, not by judgment calls.
- **Ambiguous forms are conservative**: «كبيرة/صغيرة» require a strong sin
  signal; bare «ساء» outside bounded forms does not match; missed edge cases
  are added to the detector in waves, never by hand-tagging passages.
- **Seerah depth**: the seerah section fills as sira-genre passages are
  harvested; the current corpus has no sira-genre sin passages.
- **Targeted harvests pending**: Riyad al-Salihin, Targhib wa Tarhib,
  Mishkat al-Masabih and Bulugh al-Maram passages enter as their editions
  are mined into the graph — no hand-list is maintained meanwhile.
- Human read of all draft records is the only blocker to calling the feature
  finished for readers; everything else is mechanical.
