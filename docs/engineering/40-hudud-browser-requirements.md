# 39 · Hudud Allah and Kaba'ir Browser — requirements and production checklist

_The feature requirements for «متصفح حدود الله والكبائر» (the Hudud Allah and
Kaba'ir Browser — every mention of the limits of God, the fixed penalties and
the major sins in the Qur'an, the Sunnah, the seerah, Companion and Tabi'i
reports and every harvested book), as requested by the founder and delivered
in `docs/plan/52-hudud-browser.md`. Written so any person or AI agent can
validate each requirement against production (`https://islam.museum`,
`https://api.islam.museum`) without reading the plan. Every requirement has
an id (`HUD-R..`), a "how to check" line, and the artifact that proves it._

## 0. The original request (verbatim)

> "start working on متصفح حدود الله والكبائر where it should list all the
> mentioned and written حدود الله والكبائر that are in quran, see rah, sunna,
> tabi3een stories , quotes , mentioned and written in books that were
> harvested and any future harvested book if it has a حدود الله والكبائر
> should be viewable here. add a box for it on landing page and in
> navigation menus. make sure this is done end to end and full detailed
> proses and make it ready for production at the end of this. this is only
> about حدود الله والكبائر and everything mentioned about حدود الله والكبائر
> anywhere in any of the sunni books or quran or sunna or sera. find all the
> instances where حدود الله والكبائر Were mentioned or part of quotes from
> quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and add those
> stories, mentions, quotes, details. also add this in engineering documents
> as the original requirements to allow AI later on to test and validate it
> when it is in production."

Scope note: «حدود الله والكبائر» means the two named themes together — the
limits God set for His rulings and the fixed penalties the jurists call
hudud (stoning, flogging, the amputated hand, discretionary punishment, and
their crimes), and the major sins («كبائر»، «الموبقات»). It is not a fatwa
browser and not the sins theme at large — the Sayyi'at Browser owns that.

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| HUD-R01 | No new class or side table: every browser record is an ordinary graph node — passages detected at build time, curated records tagged `hudud-browser` (+ optional `hudud-<section>`) | `grep -rl "hudud-browser" data/` — hits under `data/concept/` `tags:` and `data/passage/` `relations:` only; `scripts/lib.ts` `CLASSES` unchanged |
| HUD-R02 | Five sections derived from the corpus, not a topic list: `quran` · `sunnah` · `seerah` · `books` · `curated` | `HUDUD_SECTIONS` in `scripts/hudud.ts`; `site/src/lib/hudud.ts` |
| HUD-R03 | **Automatic inclusion of future harvested books**: a hudud or kaba'ir mention in any book enters the browser the day its passage record lands — detection is a build-time function of the compiled graph, never a hand-kept list | add a fixture passage containing «حدود الله» to a test work, run `npm run graph && npx tsx scripts/export-api.ts`, confirm it appears in `hudud.json` with the right `section`; then remove the fixture |
| HUD-R04 | Detection is over passage-owned text only (`text_search`, `text` fallback) — never labels or summaries, so chapter names like «كتاب الحدود» do not create hits by themselves | `hududSignalsOf` in `scripts/hudud.ts`; a fixture passage whose label says «الحدود» but whose text does not must NOT be detected |
| HUD-R05 | Arabic diacritics and tatweel are stripped before matching; patterns are bounded tokens tolerating clitic prefixes and pronoun suffixes | fixture «تِلْكَ حُدُودُ ٱللَّهِ» (fully vocalised) is detected; «حدّث» / «حديث» are NOT detected |
| HUD-R06 | Strong signals: «حدود الله/ما أنزل»، «حدوده»، «أقام/أقيم/يقيم الحد(ود)»، «إقامة الحد»، «رجم» family, «تعزير» family, «قطع اليد» in either direction, punishment «جلد» forms («اجلد/جلدوا/جلدة/جلدات»)، «كبائر»، «موبقات» | `STRONG` in `scripts/hudud.ts`; `passage/quran-2-229`, `quran-24-2`, `quran-5-38`, `quran-53-32`, `muslim-0089` detected |
| HUD-R07 | Weak signals — ungated «حدود»/«الحد»، bare «جلد»، the hadd crimes («زنا/سارق/قذف/خمر/ردة/حرابة»)، «قصاص»، «كبيرة»، «إثما كبيرا» — count ONLY beside a strong signal, or when two or more distinct weak signals fire together (density rule, «حد الزنا الجلد») | `WEAK` + `hududSignalsOf` gating; `passage/muslim-0057` (زنا+سرقة+خمر، three weaks) is in; a fixture with only «مدينة حدود» is out |
| HUD-R08 | Known false positives excluded by id in `HUDUD_EXCLUDE`: `passage/quran-18-22` («رجماً بالغيب» — guessing), `quran-12-31`/`quran-12-50` (accidental hand cuts), `tathbit-j2-102` (a thrown snake, not slander), `poem-muallaqat-tarafa-02` («تجلد» — endure) | `HUDUD_EXCLUDE`; none of these ids in `hudud.json` |
| HUD-R09 | Structural false positives prevented by pattern: «ترجمة» (biography) never reaches «رجم»; «انقطع» (broke) never matches «قطع»; «وتعزّروه» (honour him, 48:9) is not «تعزير»; «الرجيم» is not «رجم» | `passage/hadith-musnad-abu-yala-002`-class biography passages and `quran-48-9` NOT detected |
| HUD-R10 | `hudud_kind`: `hudud` when any limits/penalty signal fired, `kabair` when only major-sin signals fired; curated records carry `null`; rows carry `signals` | `hududKindOf`; `hudud.json` rows carry `hudud_kind` ∈ {hudud,kabair,null} |
| HUD-R11 | Corpus classification: `work/quran` → quran; genre `sira` → seerah; genre `hadith` or `unit: hadith` → sunnah; everything else → books; works not yet harvested land correctly the day their genre is known | `hududCorpusOf`; the usul/poetry passages land in `books` |
| HUD-R12 | `mentions → concept/hudud-allah-wal-kabair` edges on every detected passage, each citing the passage's own first source; written by `scripts/harvest-hudud-edges.ts` (idempotent) | `grep -l "hudud-allah-wal-kabair" data/passage/*.yaml \| wc -l` ≥ 48 |
| HUD-R13 | Umbrella concept `concept/hudud-allah-wal-kabair` exists with trilingual labels/summaries, `sources`, `provenance`, `status.review: draft` and `tags: [hudud-browser]`; related records tagged in place: `hudud-allah`, `hudud-penalties`, `al-kaba-ir`, `kaba-ir`, `al-rajm`, `tazir-discretionary-punishment`, `zina`, `ihsan-hudud` | `data/concept/hudud-allah-wal-kabair.yaml`; `grep -l "hudud-browser" data/concept` → 9 files |
| HUD-R14 | Every record carries `sources`, `provenance`, and `status.review: draft` until a human reads it; already-published tagged records keep `review: published` | spot-check the umbrella yaml; the tagged files keep their status |

## 2. Corpus coverage (the founder's source list)

| Id | Requirement | How to check |
|---|---|---|
| HUD-R20 | **Qur'an**: every ayah carrying or mentioning the themes is listed — «تلك حدود الله» (2:187, 2:229, 2:230, 4:13, 58:4, 65:1, 9:112, 9:97), «يتعد حدوده» (4:14), the penalties (24:2, 24:4, 5:33, 5:38), the kaba'ir (4:31, 42:37, 53:32), stoning threats (26:116), Pharaoh's amputations (7:124, 20:71, 26:49), 60:12 | `/api/v1/hudud.json` `section:"quran"` → 21 items; `/ar/hudud/` quran section shows them |
| HUD-R21 | **Sunnah**: the hudud and kaba'ir mentions of the two Sahihs, the Muwatta and the Sunan — «اجتنبوا السبع الموبقات» (Muslim 89), «من الكبائر شتم الرجل والديه» (Muslim 90), «لا يزني الزاني» (Muslim 57), Ali's letters on flogging (Abu Dawud 4458, Nasa'i 3361), the Muwatta's hiraba and runaway-slave reports | `section:"sunnah"` items; spot-check `muslim-0089`, `muslim-0090`, `muslim-0057`, `muwatta-api-1527`, `nasai-api-3361` cards link to their passage pages |
| HUD-R22 | **Seerah**: the section exists in the taxonomy and fills itself — any passage whose work carries genre `sira` lands in `seerah` automatically | `hududCorpusOf` in `scripts/hudud.ts`; verify it renders nothing rather than erroring when empty |
| HUD-R23 | **Harvested books**: every non-scripture, non-hadith, non-seerah work with a hudud/kaba'ir passage lands in `books` — today the usul works («يجب عليه الرجم إذا زنى»), the Itqan on آية الرجم, Mawahib, Minhaj al-Sunna | `section:"books"` items |
| HUD-R24 | **Companions and Tabi'in**: their penalty reports and sin quotes arrive through the same detector — no separate pipeline needed | any `passage/*` from a sahaba/tabi'in work with «حد»/«رجم»/«كبائر» appears with its work label |
| HUD-R25 | **Curated layer**: 9 records in `section:"curated"` — the umbrella `concept/hudud-allah-wal-kabair` plus `hudud-allah`, `hudud-penalties`, `al-kaba-ir`, `kaba-ir`, `al-rajm`, `tazir-discretionary-punishment`, `zina`, `ihsan-hudud` | `section:"curated"` → 9 items |

## 3. The browser page `/{lang}/hudud/`

| Id | Requirement | How to check |
|---|---|---|
| HUD-R30 | Page exists in all three languages: `/ar/hudud/`, `/en/hudud/`, `/ur/hudud/` | `curl -sI` each → 200 |
| HUD-R31 | Localized title «متصفح حدود الله والكبائر» / "Hudud Allah and Kaba'ir Browser" / حدودِ الٰہی اور کبائر کا براؤزر + lede + badge + method note + status count + kind labels («حدود الله والعقوبات المقدرة»/«الكبائر») | `i18n/{ar,en,ur}.yaml` `hudud:` block; view each page |
| HUD-R32 | Section chips with counts, each linking to its anchor; every populated section shows title + description + card grid; empty sections do not render | `/ar/hudud/` chip counts sum to item count |
| HUD-R33 | Every card links to the **ordinary entity page** (`/{lang}/passage/<slug>/` or `/{lang}/concept/<slug>/`), never a browser-only page | inspect card `href`s on `/en/hudud/` |
| HUD-R34 | Passage cards show work name + ref/unit and a text excerpt; the hudud/kabair chip shows on passage cards; concept cards show their summary | `/ar/hudud/` sunnah cards carry the work/ref line and kind chip |
| HUD-R35 | Client filter narrows cards across labels, summaries, work names, excerpts and kind labels in all three languages; Arabic vowel-insensitive; full list readable with JS off | `site/src/scripts/hudud-filter.ts`; open `/ar/hudud/` with JS disabled → full list; type «حدود الله» → filtered cards |
| HUD-R36 | Pagefind: title/lede/headings inside `data-pagefind-body`; card lists inside `data-pagefind-ignore` | page source carries both attributes |
| HUD-R37 | WCAG 2.2 AA, RTL on ar/ur, Arabic parentheses isolated (U+2066/2069), no honorifics typed, `dir`/`lang` correct | validator + visual check |
| HUD-R38 | **Landing card** on the homepage (scale-of-justice SVG) and **Explore menu** entry, in all three languages | homepage shows the card; `nav.ts` `{ key: "hudud", ready: true }`; header explore menu lists it |

## 4. API and documentation

| Id | Requirement | How to check |
|---|---|---|
| HUD-R40 | `https://api.islam.museum/api/v1/hudud.json` returns every detected + tagged record with `section`, `hudud_kind`, `signals`, `work`, `ref`, `unit`, `text`, `sura`, `aya`, `kind`, `themes`, `tags`, `connections`, `prose` | `curl -s .../hudud.json \| jq '.items \| length'` ≥ 57; `feature: "hudud-browser"`; `section` ∈ {quran,sunnah,seerah,books,curated}; `hudud_kind` ∈ {hudud,kabair,null} |
| HUD-R41 | Endpoint documented in `docs/data/README.md`, `site/public/openapi/v1.json` (`/hudud.json` path), and `llms.txt` | all three rows exist |
| HUD-R42 | Registered in `docs/site/browsers.md` (feature + export rows), `docs/plan/00-README.md` (plan 52), `docs/plan/06-roadmap.md`, `docs/agents/lanes.md` (`hudud` lane), `docs/status.md`, `CANARY.md`, `docs/plan/52-hudud-browser.md`, this file | all rows present |
| HUD-R43 | `features-api.test.ts` asserts `hudud.json` in the export set and its detection/classification/exclusion rules | `npm test` green |

## 5. Governance and delivery

| Id | Requirement | How to check |
|---|---|---|
| HUD-R50 | Gates: `npm run validate` 0 errors, `npm test` all pass, `npm run build` clean | run them |
| HUD-R51 | Work shipped through PRs with canary entries; nothing committed directly to protected `main` | merged-PR list |
| HUD-R52 | **Full trilingual coverage**: the umbrella record carries `label`/`summary`/prose in ar, en and ur; UI strings exist in all three `i18n` files in the same commit | `content/{ar,en,ur}/concept/hudud-allah-wal-kabair.md` exist; `hudud:` blocks in all three yaml |
| HUD-R53 | Draft gate: the umbrella record enters as `status.review: draft` with `provenance`; tagged-in-place records keep their existing review status | `data/concept/hudud-allah-wal-kabair.yaml` status is draft |
| HUD-R54 | Deploy readiness: nothing live until the founder deploys; on deploy the card + menu + page + API appear automatically | post-deploy check HUD-R30/R38/R40 |

## 6. Explicitly out of scope / known limits

- **Not a fatwa or ruling**: the browser lists mentions; it prescribes
  nothing. Rulings belong to fiqh records, not here.
- **The wider sins theme stays with Sayyi'at**: «إثم»، «ذنب»، «معصية» with
  no hudud or kaba'ir signal are not here — they are in `/sayyiat/`.
- **Pharaoh's amputations kept**: 7:124, 20:71 and 26:49 carry the
  penalty vocabulary of the revelation («لأقطعن أيديكم وأرجلكم من خلاف»);
  they are recorded as a judgment call, not a lexical accident, and a wave
  may re-examine them.
- **Weak-only single signals stay out**: a passage whose only hit is
  «الحدود» (borders) or «زنا» (a story, not a penalty) needs a strong
  neighbour or a second weak signal; missed edge cases are added to the
  detector in waves, never by hand-tagging passages.
- **Seerah depth**: the seerah section fills as sira-genre passages are
  harvested.
- Human read of all draft records is the only blocker to calling the
  feature finished for readers; everything else is mechanical.
