# 33 · Hasanat Browser — requirements and production checklist

_The feature requirements for «متصفح الحسنات» (the Hasanat Browser —
every mention of the good deeds, الحسنات, in the Qur'an, the Sunnah,
the seerah, Companion and Tabi'i reports and every harvested book), as
requested by the founder on 11 November 2026 and delivered in
`docs/plan/45-hasanat-browser.md`. Written so any person or AI agent
can validate each requirement against production (`https://islam.museum`,
`https://api.islam.museum`) without reading the plan. Every requirement
has an id (`HASANAT-R..`), a "how to check" line, and the artifact that
proves it._

## 0. The original request (verbatim)

> "start working on متصفح الحسنات where it should list all the
> mentioned and written الحسنات that are in quran, see rah, sunna,
> tabi3een stories , quotes , mentioned and written in books that were
> harvested and any future harvested book if it has a الحسنات should be
> viewable here. add a box for it on landing page and in navigation
> menus. make sure this is done end to end and full detailed proses and
> make it ready for production at the end of this. this is only about
> الحسنات and everything mentioned about الحسنات anywhere in any of the
> sunni books or quran or sunna or sera. find all the instances where
> الحسنات Were mentioned or part of quotes from quran, sunnah, Hadith,
> seerah or from sa7aba and tabi3een and add those stories, mentions,
> quotes, details. also add this in engineering documents as the
> original requirements to allow AI later on to test and validate it
> when it is in production."

Scope note: «الحسنات» here means the good deeds — the noun family
«حسنة»/«الحسنة»/«حسنات»/«الحسنات» in its deed and related senses, the
gated «الحسنى» reward, and the fixed collocations «قرضا حسنا» and
«بدل حسنا بعد سوء». It does NOT mean a generic browser of the root
ح-س-ن: personal names (الحسن بن علي), the hadith grade (حديث حسن),
adjectives (خلق حسن، أسوة حسنة), the adverb (حسنا), and the divine
names «الأسماء الحسنى» are all out of scope by design.

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| HASANAT-R01 | No new class or side table: every browser record is an ordinary graph node — passages detected at build time, curated records tagged `hasanat-browser` (+ optional `hasanat-<section>`) | `grep -rl "hasanat-browser" data/` — hits under `data/concept/`, `data/event/`, `data/practice/` tags and `data/passage/` `relations:` only; `scripts/lib.ts` `CLASSES` unchanged |
| HASANAT-R02 | Five sections derived from the corpus, not a topic list: `quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر الكتب · `curated` السجلات المنتقاة | `HASANAT_SECTIONS` in `scripts/hasanat.ts`; `site/src/lib/hasanat.ts` |
| HASANAT-R03 | **Automatic inclusion of future harvested books**: a mention of الحسنات in any book enters the browser the day its passage record lands in the graph — detection is a build-time function of the compiled graph, never a hand-kept list | add a fixture passage containing «الحسنات» to a test work, run `npm run graph && npx tsx scripts/export-api.ts`, confirm it appears in `hasanats.json` with the right `section`; then remove the fixture |
| HASANAT-R04 | Detection is over passage-owned text only (`text_search`, `text` fallback) — never labels or summaries, so a chapter title naming «الحسنات» does not create a hit | `hasanatSignalsOf` in `scripts/hasanat.ts`; a fixture passage whose label says «الحسنات» but whose text does not must NOT be detected |
| HASANAT-R05 | Arabic diacritics and tatweel are stripped before matching, AND dagger alif (ٰ U+0670) and wasla (ٱ U+0671) are first mapped to a regular alif — otherwise the vocalized `text` copy tokenizes differently («شَفَٰعَة» → «شفعة») and defeats the adjective-host gate | `scripts/hasanat.ts` `hasanatSignalsOf`; fixture `passage/quran-4-85`-style vocalized text «شَفَـٰعَةً حَسَنَةً» must NOT be detected |
| HASANAT-R06 | Direct signals: «الحسنات» definite plural and «حسنات» indefinite always count | `AR_HASANAT`; `passage/quran-11-114` («إن الحسنات يذهبن السيئات») detected |
| HASANAT-R07 | Singular signals: «الحسنة» and «حسنة» count as noun uses; feminine-adjective uses on a host noun are rejected by a preceding-token gate | `AR_HASANA`, `ADJ_HOSTS`, `prevToken`; `passage/quran-33-21` («أسوة حسنة») and `passage/quran-16-125` («الموعظة الحسنة») and `passage/quran-4-85` («شفاعة حسنة») must NOT appear; `passage/quran-6-160` («من جاء بالحسنة») must appear |
| HASANAT-R08 | «الحسنى» counts only as the best reward; divine-names and «good word» adjective uses are rejected by a 45-char preceding-window check | `AR_HUSNA`, `HUSNA_ADJ_WINDOW`; `passage/quran-18-88` («جزاء الحسنى»), `passage/quran-92-6` («وصدق بالحسنى») in; `passage/quran-17-110`, `quran-20-8`, `quran-59-24`, `quran-7-180`, `quran-7-137` («الأسماء/كلمة…الحسنى») out |
| HASANAT-R09 | Collocation signals: «قرضا حسنا» / «قرض حسن» (the good loan) and «بدل… حسنا بعد سوء» (evil changed for good) count as good-deed formulas | `AR_QARD_HASAN`, `AR_BADAL_HASAN`; `passage/quran-2-245`, `quran-57-11`, `quran-57-18`, `quran-64-17`, `quran-73-20`, `quran-5-12` (qard-hasan) and `passage/quran-27-11` (badal-hasan) detected |
| HASANAT-R10 | Out-of-scope senses verified absent: bare «حسن»/«الحسن» (names like الحسن بن علي, the grade «حديث حسن», «خلق حسن»), «حسنا» the adverb/adjective («رزقا حسنا»، «أجرا حسنا»), «الحسناء» (the beautiful one) | fixtures in `features-api.test.ts`; `passage/arbaun-30` («حديث حسن»), `passage/poem-al-numan-ibn-adi-verses-to-his-wife-01` («الحسناء») not detected |
| HASANAT-R11 | «سنة حسنة» deliberately STAYS IN — «من سن في الإسلام سنة حسنة» is a good-deeds report, not an adjective use | `passage/muslim-1017` detected |
| HASANAT-R12 | `HASANAT_EXCLUDE` exists as the curated escape hatch for verified false positives — currently `passage/riyad-611` («ثوبه حسنا ونعله حسنة», the adjective on the sandal) | `scripts/hasanat.ts`; a passage id added there is dropped from detection but a `hasanat-browser` tag still admits it |
| HASANAT-R13 | `hasanat_kind`: `hasanat` for plural-family passages, `hasana` for singular/collocation passages, `husna` for «الحسنى»-only passages; precedence plural > singular > husna; curated records carry `null` | `hasanatKindOf`; `duas.json`-style `hasanat_kind` + `signals` fields in `hasanats.json` |
| HASANAT-R14 | Corpus classification: `work/quran` → quran; genre `sira` → seerah; genre `hadith` or `unit: hadith` → sunnah; everything else → books; works not yet harvested land correctly the day their genre is known | `hasanatCorpusOf`; seerah section empty today but renders nothing rather than erroring |
| HASANAT-R15 | `basis_for → concept/al-hasanat` edges on the seven `qudsi-kitabat-al-hasanat` hadith-qudsi passages and `event/angels-report-the-intended-sin`, each citing the record's own source | `grep -l "concept/al-hasanat" data/passage/*.yaml data/event/*.yaml` ≥ 8 |
| HASANAT-R16 | Reuse before create: existing records tagged in place only where their content genuinely engages الحسنات — `qard-hasan`, `kitab-al-amal`, `istighfar`, `dhikr`, `hamm`, `azm`, `ikhlas`, `gecko`, `al-salat-ala-al-nabi`, `intercession-shafaa`, `asbab-suqut-al-uquba`, `people-of-the-heights-and-the-scales` (concepts) + `angels-report-the-intended-sin` (event); unrelated حسن-root records (`al-hadith-al-hasan`, `al-qawl-al-hasan`, `hamm-fiqh`, `adl`, `wasiyya-fiqh`, `allah`, `names-in-ayat-al-kursi`, `ibadat-al-asnam-jahiliyya`, `practice/dua`, `practice/sadaqa`) are NOT tagged | `grep -l "hasanat-browser" data/` list; `npm run validate` 0 errors |
| HASANAT-R17 | New umbrella `concept/al-hasanat` carries `label`/`summary` in ar/en/ur, `sources`, `provenance`, `related_to` edges to the good-deeds concept family, and trilingual prose files; `status.review: draft` | `data/concept/al-hasanat.yaml`; `content/{ar,en,ur}/concept/al-hasanat.md` |
| HASANAT-R18 | Every record carries `sources`, `provenance`, and `status.review: draft` until a human reads it (AI-content rule); already-published tagged records keep `review: published` | spot-check tagged files; their status blocks unchanged except tags |

## 2. Corpus coverage (the founder's source list)

| Id | Requirement | How to check |
|---|---|---|
| HASANAT-R20 | **Qur'an**: every ayah carrying or mentioning the good deeds is listed — «إن الحسنات يذهبن السيئات» (11:114), «من جاء بالحسنة فله عشر أمثالها» (6:160, 27:89, 28:84), «فأولئك يبدل الله سيئاتهم حسنات» (25:70), «أقرضوا الله قرضا حسنا» (2:245, 5:12, 57:11, 57:18, 64:17, 73:20), «الحسنى» the reward (4:95, 10:26, 13:18, 16:62, 18:88, 21:101, 53:31, 57:10, 92:6, 92:9), «بدل حسنا بعد سوء» (27:11), and the worldly-good «حسنة» verses (documented sense) | `/api/v1/hasanats.json` `section:"quran"` → 43 items; `/ar/hasanat/` quran section shows 43 cards |
| HASANAT-R21 | **Sunnah**: the hadiths of the two Sahihs, the Muwatta, the Arba'in and the Sunan — the kitabat-al-hasanat hadith qudsi cluster, «الصيام لي وأنا أجزي به والحسنة بعشر أمثالها»، «كل عمل ابن آدم يضاعف الحسنة»، «من سن في الإسلام سنة حسنة»، «من قتل وزغة…حسنة»، «اتبع السيئة الحسنة تمحها» | `section:"sunnah"` → 23 items; spot-check `bukhari-1894`, `riyad-171`, `bukhari-7501`, `muslim-0128`, `muslim-0131`, `muslim-1017`, `ibnmajah-1638`, `tirmidhi-3073`, `nasai-2215`, `abudawud-5263`, `muwatta-1-560`, `arbaun-18` cards link to their passage pages |
| HASANAT-R22 | **Seerah**: the section exists in the taxonomy and fills itself — any passage whose work carries genre `sira` lands in `seerah` automatically | `hasanatCorpusOf` in `scripts/hasanat.ts`; today empty — verify it renders nothing rather than erroring |
| HASANAT-R23 | **Harvested books**: every non-scripture, non-hadith, non-seerah work with a الحسنات passage lands in `books`, classified by genre the day its passages arrive | `section:"books"` → 1 item today (`poem-hassan-diwan-muzayna-la-yura-fiha-khatib-03`); future books appear without code changes (HASANAT-R03) |
| HASANAT-R24 | **Companions and Tabi'in**: their reports arrive through the same detector — Companion/Tabi'in reports are sunnah/book passages like any other; no separate pipeline needed | any `passage/*` from a tabi'in work with «حسنة»/«حسنات» appears with its work label |
| HASANAT-R25 | **Curated layer**: 14 records — 13 concepts (`al-hasanat`, `qard-hasan`, `kitab-al-amal`, `istighfar`, `dhikr`, `hamm`, `azm`, `ikhlas`, `gecko`, `al-salat-ala-al-nabi`, `intercession-shafaa`, `asbab-suqut-al-uquba`, `people-of-the-heights-and-the-scales`) + 1 event (`angels-report-the-intended-sin`) | `section:"curated"` → 14 items |

## 3. The browser page `/{lang}/hasanat/`

| Id | Requirement | How to check |
|---|---|---|
| HASANAT-R30 | Page exists in all three languages: `/ar/hasanat/`, `/en/hasanat/`, `/ur/hasanat/` | `curl -sI` each → 200 |
| HASANAT-R31 | Localized title «متصفح الحسنات» / "Hasanat Browser" / حسنات براؤزر + lede + badge + method note + status count + kind labels («الحسنات»/«حسنة»/«الحسنى») | `i18n/{ar,en,ur}.yaml` `hasanat:` block; view each page |
| HASANAT-R32 | Section chips with counts, each linking to its anchor; every populated section shows title + description + card grid; empty sections (seerah today) do not render | `/ar/hasanat/` shows 4 populated sections; chip counts sum to item count |
| HASANAT-R33 | Every card links to the **ordinary entity page** (`/{lang}/passage/<slug>/` or `/{lang}/concept/<slug>/`), never a browser-only page | inspect card `href`s on `/en/hasanat/` |
| HASANAT-R34 | Passage cards show work name + ref/unit (e.g. «القرآن · 11:114»، «صحيح مسلم · 1017») and a text excerpt; the hasanat/hasana/husna chip shows on passage cards; concept cards show their summary | `/ar/hasanat/` quran cards carry the sura:aya ref and kind chip |
| HASANAT-R35 | Client filter narrows cards across labels, summaries, work names, excerpts and kind labels in all three languages; Arabic vowel-insensitive; full list readable with JS off | `site/src/scripts/hasanat-filter.ts`; open `/ar/hasanat/` with JS disabled → full list; type «حسنات» → filtered cards |
| HASANAT-R36 | Pagefind: title/lede/headings inside `data-pagefind-body`; card lists inside `data-pagefind-ignore` | page source carries both attributes; searching «الحسنات» or "good deeds" reaches the page |
| HASANAT-R37 | WCAG 2.2 AA, RTL on ar/ur, Arabic parentheses isolated (U+2066/2069), no honorifics typed, `dir`/`lang` correct | validator + visual check |
| HASANAT-R38 | **Landing card** on the homepage («متصفح الحسنات» with hasanat thumbnail) and **Explore menu** entry, in all three languages | homepage shows the card; `nav.ts` `{ key: "hasanat", ready: true }`; header explore menu lists it |

## 4. API and documentation

| Id | Requirement | How to check |
|---|---|---|
| HASANAT-R40 | `https://api.islam.museum/api/v1/hasanats.json` returns every detected + tagged record with `section`, `hasanat_kind`, `signals`, `work`, `ref`, `unit`, `text`, `sura`, `aya`, `kind`, `themes`, `tags`, `connections`, `prose` | `curl -s .../hasanats.json \| jq '.items \| length'` ≥ 75; `feature: "hasanat-browser"`; `section` ∈ {quran,sunnah,seerah,books,curated}; `hasanat_kind` ∈ {hasanat,hasana,husna,null} |
| HASANAT-R41 | Endpoint documented in `docs/data/README.md`, `site/public/openapi/v1.json` (`/hasanats.json` path), and `llms.txt` | all three rows exist |
| HASANAT-R42 | Registered in `docs/site/browsers.md` (feature + export rows), `docs/plan/00-README.md` (plan 45), `docs/plan/06-roadmap.md`, `docs/agents/lanes.md` (`hasanat` lane), `docs/status.md`, `CANARY.md` (v1.17.0 + entries), `docs/plan/45-hasanat-browser.md`, this file | all rows present |
| HASANAT-R43 | `features-api.test.ts` asserts `hasanats.json` in the export set and its detection/classification/exclusion rules (kinds, sections, adjective/names/divine-names/adverb gates, future-book inclusion, curated tag) | `npm test` green |

## 5. Governance and delivery

| Id | Requirement | How to check |
|---|---|---|
| HASANAT-R50 | Gates: `npm run validate` 0 errors, `npm test` all pass, `npm run build` clean | run them |
| HASANAT-R51 | Work shipped through PRs with canary entries; nothing committed directly to protected `main` | merged-PR list |
| HASANAT-R52 | **Full trilingual coverage**: the new `concept/al-hasanat` carries `label`/`summary`/prose in ar, en and ur; UI strings exist in all three `i18n` files in the same commit | `content/{ar,en,ur}/concept/al-hasanat.md` exist; `hasanat:` blocks in all three yaml |
| HASANAT-R53 | Draft gate: `concept/al-hasanat` enters `review: draft` with `provenance`; tagged-in-place records keep their existing review status | `data/concept/al-hasanat.yaml` status block |
| HASANAT-R54 | Deploy readiness: nothing live until the founder deploys; on deploy the card + menu + page + API appear automatically | post-deploy check HASANAT-R30/R38/R40 |

## 6. Explicitly out of scope / known limits

- **Not a root-حسن browser**: bare «حسن»، «الحسن»، «حسنا» never match;
  the feature is الحسنات and its direct collocations only.
- **Names and grades**: «الحسن بن علي» and «حديث حسن» cannot match;
  «الحسناء» (the beautiful one) is a different word and stays out.
- **Adjective «حسنة»**: feminine-adjective uses on host nouns
  («أسوة»، «الموعظة»، «شفاعة»، «دعوة»، «رؤية»…) are gated by
  preceding-token check; undetected edge cases go to
  `HASANAT_EXCLUDE`, never to hand-tagging passages.
- **«الأسماء الحسنى»** belongs to the asma browser, not this one.
- **The worldly-good sense stays in, documented**: «حسنة» meaning "a
  good thing / good fortune befalling" («وإن تصبهم حسنة») is a genuine
  noun use and is included; the spec records both senses so a reviewer
  does not flag it.
- **Synonyms are not الحسنات**: الصالحات، البر، الطاعات، الأعمال
  الصالحة are related concepts, not the word family.
- **Seerah depth**: the seerah section fills as seerah passages are
  harvested; the current corpus has no sira-genre hasanat passages.
- Human read of all draft records is the only blocker to calling the
  feature finished for readers; everything else is mechanical.
