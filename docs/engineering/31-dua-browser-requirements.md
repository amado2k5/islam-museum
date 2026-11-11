# 31 · Du'a Browser — requirements and production checklist

_The feature requirements for «متصفح الأدعية» (the Du'a Browser — every
supplication mentioned or written in the Qur'an, the Sunnah, the seerah,
Companion and Tabi'i reports and every harvested book), as requested by the
founder on 11 November 2026 and delivered in `docs/plan/43-dua-browser.md`.
Written so any person or AI agent can validate each requirement against
production (`https://islam.museum`, `https://api.islam.museum`) without
reading the plan. Every requirement has an id (`DUA-R..`), a "how to check"
line, and the artifact that proves it._

## 0. The original request (verbatim)

> "start working on متصفح الأدعية where it should list all the mentioned and
> written الأدعية that are in quran, see rah, sunna, tabi3een stories ,
> quotes , mentioned and written in books that were harvested and any future
> harvested book if it has a الأدعية should be viewable here. add a box for it
> on landing page and in navigation menus. make sure this is done end to end
> and full detailed proses and make it ready for production at the end of
> this. this is only about الأدعية and everything mentioned about الأدعية
> anywhere in any of the sunni books or quran or sunna or sera. find all the
> instances where الأدعية Were mentioned or part of quotes from quran,
> sunnah, Hadith, seerah or from sa7aba and tabi3een and add those stories,
> mentions, quotes, details. also add this in engineering documents as the
> original requirements to allow AI later on to test and validate it when it
> is in production."

Scope note: «الأدعية» here means supplication **to God** — the formulas
(«اللهم»، «ربنا»، «يا رب»), the supplication verbs, isti'adha, istighfar, the
prophets' prayers, and the passages that mention or teach supplication. It
does not include da'wa (calling people to guidance), dhikr in general, or
supplication to anyone but God.

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| DUA-R01 | No new class or side table: every browser record is an ordinary graph node — passages detected at build time, curated records tagged `dua-browser` (+ optional `dua-<section>`) | `grep -rl "dua-browser" data/` — hits under `data/concept/` and `data/passage/` `relations:` only; `scripts/lib.ts` `CLASSES` unchanged |
| DUA-R02 | Five sections derived from the corpus, not a topic list: `quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر الكتب · `curated` السجلات المنتقاة | `DUA_SECTIONS` in `scripts/dua.ts`; `site/src/lib/dua.ts` |
| DUA-R03 | **Automatic inclusion of future harvested books**: a du'a in any book enters the browser the day its passage record lands in the graph — detection is a build-time function of the compiled graph, never a hand-kept list | add a fixture passage containing «اللهم اغفر لي» to a test work, run `npm run graph && npx tsx scripts/export-api.ts`, confirm it appears in `duas.json` with the right `section`; then remove the fixture |
| DUA-R04 | Detection is over passage-owned text only (`text_search`, `text` fallback) — never labels or summaries, so chapter names like «كتاب الدعاء» do not create false hits | `duaSignalsOf` in `scripts/dua.ts`; a fixture passage whose label says «دعاء» but whose text does not must NOT be detected |
| DUA-R05 | Arabic diacritics and tatweel are stripped before matching; patterns tolerate clitic prefixes and pronoun suffixes | fixture «اللهمَّ اغْفِرْ لِي» (fully vocalised) is detected |
| DUA-R06 | Formula signals: «اللهم»، «ربنا»، «يا رب/أيا رب»، «فيقول ربي»، «ربِ/ربي» + whitelisted follower («اغفر»، «اشرح»، «انصر»، …). «هو ربي لا إله إلا هو» (creed statement) must NOT match | `scripts/dua.ts` `AR_LAHUM`, `AR_RABBANA`, `AR_YA_RAB`, `AR_RAB_VOC`, `RAB_FOLLOWERS`; `passage/quran-12-4` («أبي» not «يا رب») unaffected |
| DUA-R07 | Verb signals: «يدعو/دعا + divine object» («ربه»، «ربنا»، «الله»، «الرحمن»), «سأل الله/سأل ربه»، benefactive «يدعو له/لهم»، past «ودعا لي بالبركة»، «ادع لنا ربك»، gated «يدعو ب…» (blessing/divine objects only) | `AR_DUA_VERB_OBJ`, `AR_SAL_OBJ`, `AR_DUA_VERB_LI`, `AR_DUA_VERB_LI_PAST`, `AR_DUA_VERB_LI_RABB`, `AR_DUA_VERB_BI` |
| DUA-R08 | God-speech signals: «من يدعوني فأستجيب»، «إذا سألني عبدي»، «أجيب دعوة الداع»، «ادعوني أستجب لكم»، «ادع على المشركين» | `AR_GOD_SPEECH`, `AR_DUA_ME_CALL`, `AR_DUA_ALA` |
| DUA-R09 | Isti'adha family («أعوذ/نعوذ/يتعوذ/استعيذ/أستغفر/يستغفر») counts UNLESS refuge is sought *in* a created being («يعوذون برجال من الجن») | `AR_ISTIADHA_ANY`, `ISTIADHA_CREATURE`; `passage/quran-72-6` must NOT appear; `passage/muslim-2707` («يتعوذ من سوء القضاء») must appear |
| DUA-R10 | «داع يدعو» (supplicant supplicates) counts only beside an answer-word («يستجاب»، «دعاء»، «لله») — the da'wa sense «داع يدعو إلى هدى» stays out | `AR_DAAI_YADU3`, `DAAI_ANSWER`; `passage/muwatta-1-576` in, `passage/muwatta-1-581` out |
| DUA-R11 | Mention signals: «دعاء/أدعية/دعوات»، gated «دعوة» (not «دعوة إلى/من/تكذب»), «يتضرع/ابتهل»، «حسبي الله/حسبنا الله»، and the noun forms take pronoun suffixes («دعاءكم»، «دعائه») while «ادعاء» ("a claim") and «الادعاء» stay out | `AR_DUAA`, `AR_DUAWAT`, `AR_DAWWA`, `AR_EARNEST`, `AR_HASBI`; `passage/quran-35-14` («دعاءكم») in, a fixture «ادعاه في الدين» out |
| DUA-R12 | Known false positives excluded by id in `DUA_EXCLUDE`: `passage/muwatta-1-164` («دعا بماء» — called for water), `passage/muwatta-1-178` («قل داع ترد عليه دعوته» — the adhan), `passage/poem-muallaqat-tarafa-06` («دعص»), `passage/poem-hassan-diwan-laqad-laan-al-rahman-jamaan-01` («دعي بني شجع» — call to arms) | `DUA_EXCLUDE`; none of these ids in `duas.json` |
| DUA-R13 | Out-of-scope senses verified absent: «ادعوا شركاءكم» / «يدعون من دون الله» (false-god calls), «ادعى الرجل» (claimed), «دعا بماء/بالقدح» (summons), «دعوة إلى/من» (da'wa), bare «سبحان الله»/«الحمد لله» (tasbih) | `passage/quran-7-195`, `passage/quran-10-18`, `passage/quran-16-125` («ادع إلى سبيل ربك»), a fixture «ادعى» — none detected |
| DUA-R14 | `dua_kind`: `formula` when the passage carries an actual supplication (formula signals), `mention` when it is only about one (mention signals); curated records carry `null` | `duaKindOf`; `duas.json` rows carry `dua_kind` and the matched `signals` list |
| DUA-R15 | Corpus classification: `work/quran` → quran; genre `sira` → seerah; genre `hadith` or `unit: hadith` → sunnah; everything else → books; works not yet harvested land correctly the day their genre is known | `duaCorpusOf`; seerah/books sections empty today but render correctly |
| DUA-R16 | `basis_for → practice/dua` edges on every detected passage, each citing the passage's own first source (the corpus's existing edge type from passage to practice; `mentions` cannot target a `practice`) | `grep -l "practice/dua" data/passage/*.yaml \| wc -l` ≥ 355 |
| DUA-R17 | Reuse before create: existing dua-related concepts tagged in place (`istighfar`, `mawatin-al-ijaba`, `nadhr`, `tawassul`, `al-salat-ala-al-nabi`, `al-dua-ala-al-nafs-wal-awlad`); da'wa concepts (`dai-al-duat`, `al-duat-al-judud`) are NOT tagged; **no new record was needed** — `practice/dua` already existed as the umbrella, so the rule reuse-before-create held | `grep -l "dua-browser" data/` hits `data/practice/{dua,istikhara,nadhr}.yaml` + 6 concept files; `npm run validate` 0 errors |
| DUA-R18 | Every record carries `sources`, `provenance`, and `status.review: draft` until a human reads it (AI-content rule); already-published tagged records keep `review: published` | spot-check `data/practice/dua.yaml`; the tagged files keep their status |

## 2. Corpus coverage (the founder's source list)

| Id | Requirement | How to check |
|---|---|---|
| DUA-R20 | **Qur'an**: every ayah carrying or mentioning supplication is listed — the prophets' «ربِّ» prayers (Ibrahim, Musa, Nuh, Zakariyya, Maryam, the people of the cave), «ادعوني أستجب لكم» (40:60), «أجيب دعوة الداع» (2:186), the refuge formulas of the mu'awwidhat (113–114, 16:98, 7:200, 40:56, 41:36), «حسبي الله» (3:173, 9:59, 9:129, 39:38), «سميع الدعاء» (14:39, 3:38), «لا يسأم الإنسان من دعاء الخير» (41:49) | `/api/v1/duas.json` `section:"quran"` → 253 items; `/ar/dua/` quran section shows 253 cards |
| DUA-R21 | **Sunnah**: the du'as of the two Sahihs, the Muwatta and the Sunan — «اللهم إني أعوذ بك»، the night-descent hadith («من يدعوني فأستجيب»), the best du'a of Arafat, «لكل نبي دعوة»، «ما من داع يدعو إلا كان…»، funeral/rain supplications, and every report quoting or teaching du'a | `section:"sunnah"` → 102 items; spot-check `muwatta-1-570`, `muslim-2705`, `muslim-0199`, `bukhari-7507`, `muslim-2599` cards link to their passage pages |
| DUA-R22 | **Seerah**: the section exists in the taxonomy and fills itself — any passage whose work carries genre `sira` lands in `seerah` automatically | `duaCorpusOf` in `scripts/dua.ts`; today empty — verify it renders nothing rather than erroring |
| DUA-R23 | **Harvested books**: every non-scripture, non-hadith, non-seerah work with a du'a passage lands in `books`, classified by genre the day its passages arrive | `section:"books"` today empty; future books appear without code changes (DUA-R03) |
| DUA-R24 | **Companions and Tabi'in**: their supplications arrive through the same detector — Companion/Tabi'in reports are sunnah/book passages like any other; no separate pipeline needed | any `passage/*` from a tabi'in work with «اللهم»/«ربنا» appears with its work label |
| DUA-R25 | **Curated layer**: 9 records in `section:"curated"` — practices `dua` (the umbrella that already existed), `istikhara`, `nadhr`, plus concepts `istighfar`, `mawatin-al-ijaba`, `concept/nadhr`, `tawassul`, `al-salat-ala-al-nabi`, `al-dua-ala-al-nafs-wal-awlad` | `section:"curated"` → 9 items |

## 3. The browser page `/{lang}/dua/`

| Id | Requirement | How to check |
|---|---|---|
| DUA-R30 | Page exists in all three languages: `/ar/dua/`, `/en/dua/`, `/ur/dua/` | `curl -sI` each → 200 |
| DUA-R31 | Localized title «متصفح الأدعية» / "Du'a Browser" / دعاؤں کا براؤزر + lede + badge + method note + status count + kind labels («يحوي دعاءً»/«يتكلم عن الدعاء») | `i18n/{ar,en,ur}.yaml` `dua:` block; view each page |
| DUA-R32 | Section chips with counts, each linking to its anchor; every populated section shows title + description + card grid; empty sections (seerah/books today) do not render | `/ar/dua/` shows 3 populated sections; chip counts sum to item count |
| DUA-R33 | Every card links to the **ordinary entity page** (`/{lang}/passage/<slug>/` or `/{lang}/concept/<slug>/`), never a browser-only page | inspect card `href`s on `/en/dua/` |
| DUA-R34 | Passage cards show work name + ref/unit (e.g. «صحيح مسلم · 2705»، «القرآن · 40:60») and a text excerpt; the formula/mention chip shows on passage cards; concept cards show their summary | `/ar/dua/` sunnah cards carry the work/ref line and kind chip |
| DUA-R35 | Client filter narrows cards across labels, summaries, work names, excerpts and kind labels in all three languages; Arabic vowel-insensitive; full list readable with JS off | `site/src/scripts/dua-filter.ts`; open `/ar/dua/` with JS disabled → full list; type «ربنا» → filtered cards |
| DUA-R36 | Pagefind: title/lede/headings inside `data-pagefind-body`; card lists inside `data-pagefind-ignore` | page source carries both attributes; searching «الأدعية» or "supplication" reaches the page |
| DUA-R37 | WCAG 2.2 AA, RTL on ar/ur, Arabic parentheses isolated (U+2066/2069), no honorifics typed, `dir`/`lang` correct | validator + visual check |
| DUA-R38 | **Landing card** on the homepage («متصفح الأدعية» with dua thumbnail) and **Explore menu** entry, in all three languages | homepage shows the card; `nav.ts` `{ key: "dua", ready: true }`; header explore menu lists it |

## 4. API and documentation

| Id | Requirement | How to check |
|---|---|---|
| DUA-R40 | `https://api.islam.museum/api/v1/duas.json` returns every detected + tagged record with `section`, `dua_kind`, `signals`, `work`, `ref`, `unit`, `text`, `sura`, `aya`, `kind`, `themes`, `tags`, `connections`, `prose` | `curl -s .../duas.json \| jq '.items \| length'` ≥ 350; `feature: "dua-browser"`; `section` ∈ {quran,sunnah,seerah,books,curated}; `dua_kind` ∈ {formula,mention,null} |
| DUA-R41 | Endpoint documented in `docs/data/README.md`, `site/public/openapi/v1.json` (`/duas.json` path), and `llms.txt` | all three rows exist |
| DUA-R42 | Registered in `docs/site/browsers.md` (feature + export rows), `docs/plan/00-README.md` (plan 43), `docs/plan/06-roadmap.md`, `docs/agents/lanes.md` (`dua` lane), `docs/status.md`, `CANARY.md` (v1.16.0 + entries), `docs/plan/43-dua-browser.md`, this file | all rows present |
| DUA-R43 | `features-api.test.ts` asserts `duas.json` in the export set and its detection/classification/exclusion rules (formula vs mention, quran/sunnah/curated sections, false-positive gates, future-book inclusion) | `npm test` green |

## 5. Governance and delivery

| Id | Requirement | How to check |
|---|---|---|
| DUA-R50 | Gates: `npm run validate` 0 errors, `npm test` all pass, `npm run build` clean | run them |
| DUA-R51 | Work shipped through PRs with canary entries; nothing committed directly to protected `main` | merged-PR list |
| DUA-R52 | **Full trilingual coverage**: every tagged record already carries `label`/`summary`/prose in ar, en and ur (`practice/dua` has all three prose files); UI strings exist in all three `i18n` files in the same commit | `content/{ar,en,ur}/practice/dua.md` exist; `dua:` blocks in all three yaml |
| DUA-R53 | Draft gate: no new record was authored, so nothing new enters review; tagged-in-place records keep their existing review status (`practice/dua` stays `draft` as before) | `data/practice/dua.yaml` status unchanged |
| DUA-R54 | Deploy readiness: nothing live until the founder deploys; on deploy the card + menu + page + API appear automatically | post-deploy check DUA-R30/R38/R40 |

## 6. Explicitly out of scope / known limits

- **Da'wa is not du'a**: «دعوة إلى»، «داع يدعو إلى هدى»، «الدعاة» records are
  excluded by design (verified `muwatta-1-581`, `quran-16-125`).
- **Dhikr/tasbih is not du'a**: bare «سبحان الله»، «الحمد لله»، «لا إله إلا
  الله» alone are not detected; they belong to a future adhkar scope if the
  founder asks for one.
- **Summons and mundane requests**: «دعا بماء»، «دعا له بسوط»، «قل داع ترد
  عليه دعوته» (the adhan) are excluded by id.
- **The claim «ادعى»** ("he claimed") never matches; «ادعاء» ("a claim") is
  excluded from the «دعاء» noun pattern.
- **Refuge in creatures**: «يعوذون برجال من الجن» is excluded; refuge in God
  (with or without an explicit «بالله») counts.
- **Ambiguous short forms** are intentionally conservative: a bare «يدعو»
  with no divine object and no context does not match; missed edge cases are
  added to the detector in waves, never by hand-tagging passages.
- **Seerah depth**: the seerah section fills as seerah passages are
  harvested; the current corpus has no sira-genre dua passages.
- Human read of all draft records is the only blocker to calling the feature
  finished for readers; everything else is mechanical.
