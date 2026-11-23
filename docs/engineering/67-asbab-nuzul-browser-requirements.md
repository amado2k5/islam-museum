# 67 · Asbab al-Nuzul Browser — requirements and production checklist

_The feature requirements for «متصفح أسباب النزول» (the Asbab al-Nuzul
Browser — every reported occasion or cause of revelation, sabab al-nuzul,
for Qur'anic verses and suras, mentioned or written in the Qur'an, the
Sunnah, the seerah, Companion and Tabi'i reports and every harvested
book), as requested by the founder and delivered in
`docs/plan/75-asbab-nuzul-browser.md`. Written so any person or AI agent
can validate each requirement against production (`https://islam.museum`,
`https://api.islam.museum`) without reading the plan. Every requirement
has an id (`NZ-R..`), a "how to check" line, and the artifact that proves
it._

## 0. The original request (verbatim)

> "start working on أسباب النزول لآيات القرآن والسور where it should list
> all the mentioned and written أسباب النزول لآيات القرآن والسور that are
> in quran, seerah, sunna, tabi3een stories , quotes , mentioned and
> written in books that were harvested and any future harvested book if it
> has a أسباب النزول لآيات القرآن والسور should be viewable here. add a
> box for it on landing page and in navigation menus. make sure this is
> done end to end and full detailed proses and make it ready for
> production at the end of this. this is only about أسباب النزول لآيات
> القرآن والسور and everything mentioned about أسباب النزول لآيات القرآن
> والسور anywhere in any of the sunni books or quran or sunna or sera.
> find all the instances where أسباب النزول لآيات القرآن والسور Were
> mentioned or part of quotes from quran, sunnah, Hadith, seerah or from
> sa7aba and tabi3een and add those stories, mentions, quotes, details.
> also add this in engineering documents as the original requirements to
> allow AI later on to test and validate it when it is in production."

Scope note: «أسباب النزول» here means **occasions of revelation** — the
event, question or circumstance in response to which a Qur'anic verse or
sura was revealed (the science of علم أسباب النزول: الواحدي, السيوطي,
لباب النقول). It does not include the senses of نزل that are not
revelation: rain (نزل المطر), a guest arriving (نزل الضيف), descending
geographically, the eschatological descent of Isa (نزول عيسى), or generic
«أنزل» without a revelatory object.

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| NZ-R01 | No new class or side table: every browser record is an ordinary graph node — passages detected at build time, curated records tagged `nuzul-browser` (+ optional `nuzul-<section>` / `nuzul-<narrator>`) | `grep -rl "nuzul-browser" data/` — hits under `data/passage/`, `data/event/`, `data/concept/` and `data/work/` only; `scripts/lib.ts` `CLASSES` unchanged |
| NZ-R02 | Five corpus sections derived from the work, not a topic list: `quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر الكتب · `curated` السجلات المنتقاة | `NUZUL_SECTIONS` in `scripts/nuzul.ts`; `site/src/lib/nuzul.ts` |
| NZ-R03 | **Automatic inclusion of future harvested books**: an occasion-of-revelation report in any book enters the browser the day its passage record lands in the graph — detection is a build-time function of the compiled graph, never a hand-kept list | add a fixture passage containing «نزلت هذه الآية في...» to a test work, run `npm run graph && npx tsx scripts/export-api.ts`, confirm it appears in `nuzul.json` with the right `section`; then remove the fixture. Test fixture `passage/future-nuzul-1` in `scripts/features-api.test.ts` does exactly this |
| NZ-R04 | Detection is over passage-owned text only (`text_search`, `text` fallback) — never labels or summaries | `nuzulSignalsOf` in `scripts/nuzul.ts`; a fixture passage whose label says «أسباب النزول» but whose text does not must NOT be detected |
| NZ-R05 | Arabic diacritics and tatweel are stripped before matching; patterns tolerate clitic prefixes, pronoun suffixes and hamza/alef variants | fixture «نَزَلَتْ هَٰذِهِ الْآيَةُ» (fully vocalised) is detected |
| NZ-R06 | `nuzul_kind`: `occasion` when the passage reports the event/question behind a verse's descent; `mention` when it is only about the science, the genre or the concept | `nuzulKindOf`; `nuzul.json` rows carry `nuzul_kind` and matched `signals` |
| NZ-R07 | **Narrator generation** `narrator` ∈ {`prophetic`, `companion`, `tabii`, `later`, `null`}: prophetic when the Prophet or a prophet speaks or is the subject; companion for sahabi reports (Ibn Abbas, Aisha, Umar, Khawla, ...); tabii for Tabi'i reports (Ikrimah, Mujahid, Qatada, ...); later for scholars and authors (al-Wahidi, al-Suyuti, ...); null for undetermined | `nuzulNarratorOf`; a fixture report from عائشة → `companion`; a later-author mention → `later` |
| NZ-R08 | Work-level admission: passages from recognised Asbab al-Nuzul and tafsir works enter by work metadata (e.g. `work/asbab-al-nuzul-wahidi`), not only by per-passage signals | `isNuzulPassage` in `scripts/nuzul.ts`; every `data/passage/uloom-al-quran-asbab-nuzul-*` record appears in the API |
| NZ-R09 | Hard exclusions verified absent: rain («نزل المطر»، «نزل الغيث»), guest senses («نزل الضيف/النزل»), eschatological descent («نزول عيسى»، «ينزل ابن مريم»), illness/punishment/water senses, and listed ids in `NUZUL_EXCLUDE` | fixture passages for each sense → `nuzulSignalsOf` returns `[]`; verified ids in the exclusion list |
| NZ-R10 | Reuse before create: `concept/awwal-ma-nazal-min-al-quran`, `event/first-revelation`, `work/asbab-al-nuzul-wahidi` and `work/sharh-hadith-al-nuzul` are tagged in place; new seed passages only where a defined source exists | `grep -l "nuzul-browser" data/` audit; `npm run validate` 0 errors |
| NZ-R11 | Every record carries `sources`, `provenance`, and `status.review: draft` until a human reads it; no invented citation, quote or page number | spot-check `data/passage/nuzul-*.yaml`; every seed cites `source/sahih-al-bukhari` or `source/sunan-al-nasai` |
| NZ-R12 | Machine detection is never presented as editorial judgement: the page and API mark detected rows as build-time detection | the method note on `/[lang]/nuzul/`; `signals` field in the API |

## 2. Site and navigation

| Id | Requirement | How to check |
|---|---|---|
| NZ-R13 | The browser is reachable at `/[lang]/nuzul/` for all seven languages (ar, en, ur, fr, es, tr, id), paginated via `[...page].astro` | `curl -s https://islam.museum/ar/nuzul/` returns 200; same for each lang; `/ar/nuzul/2/` paginates |
| NZ-R14 | Landing-page box: a unique Asbab al-Nuzul explorer card (descending beam onto an open book) on the landing page in all languages | the landing page `explore.nuzul` card is rendered with `explore_pages` entry; `site/src/components/Landing.astro` nuzul thumb |
| NZ-R15 | Navigation: `nuzul` is in the `ExplorePage` union, the `explorePages` registry with `ready: true`, and the `texts` group of `EXPLORE_GROUPS` | `site/src/lib/nav.ts`; the browser menu shows «أسباب النزول» / "Occasions of Revelation" in every language |
| NZ-R16 | Unique signature visual: `NuzulDescent.astro` — a mushaf-ordered strip of 114 sura spines where suras carrying detected occasions light up in gold and scale by count, with a narrator/corpus distribution strip; static at build time, accessible, Pagefind-safe | `site/src/components/sig/NuzulDescent.astro`; the visual renders on `/[lang]/nuzul/` |
| NZ-R17 | Client-side filtering by section chips, narrator chips, kind and free text via `data-nuzul-*` attributes and `site/src/scripts/nuzul-filter.ts` | type a sura name or pick «companion» on the live page; `FullFilter` narrows cards |
| NZ-R18 | Section chips, narrator chips, kind labels, filter label, empty/no-results text and all visual strings come from `i18n/<lang>.yaml` `nuzul.*` in all seven languages — no hard-coded visitor text | `grep -n "^nuzul:" i18n/*.yaml` returns all 7 files; `explore.nuzul` present in all 7 |

## 3. API

| Id | Requirement | How to check |
|---|---|---|
| NZ-R19 | `/api/v1/nuzul.json` is generated by `scripts/export-api.ts` `FEATURE_EXPORTS` with `feature: "nuzul-browser"`, selection `tags includes NUZUL_TAG OR isNuzulPassage(n)`, base fields kind/work/ref/unit/text/sura/aya/wings/themes/tags and `extra` fields `section`, `nuzul_kind`, `narrator`, `signals` | `curl -s https://api.islam.museum/api/v1/nuzul.json | jq '.feature, (.items | length), .items[0] | keys'` |
| NZ-R20 | OpenAPI declares `/nuzul.json` with operationId `getNuzul` and the dataset description | `grep -n '"/nuzul.json"' site/public/openapi/v1.json` |
| NZ-R21 | The dataset is described in `site/src/pages/llms.txt.ts`, `docs/site/browsers.md` (browser table + API table) and `docs/data/README.md` | grep each file for `nuzul` |
| NZ-R22 | The slug `nuzul` does not collide with the existing `/words/revelation/` slug or any other browser slug | `scripts/browser-slugs.ts` check; `npm run validate` 0 errors |

## 4. Production validation

| Id | Requirement | How to check |
|---|---|---|
| NZ-R23 | `npm run validate` passes with zero errors (schema, honorifics, Arabic parentheses isolation, content safety) | run `npm run validate` in the repo |
| NZ-R24 | The feature API test covers: detection positives (occasion hadith, sabab passage, science mention), false positives (rain/guest/Isa senses), future-book inclusion, section/kind/narrator fields and the feature name | `npx vitest run scripts/features-api.test.ts` |
| NZ-R25 | The static build produces `/ar/nuzul/` … `/id/nuzul/` and `api/v1/nuzul.json` with item counts matching the page's status line | `npm run build` then inspect `dist/`; compare `.items \| length` with the page count |
| NZ-R26 | Every visitor-facing record on the browser links to its own entity page and cites its work and ref | click a card on `/ar/nuzul/` → passage page with `source/…` citations |
