# 26 · Magic and Magicians Browser — requirements and production checklist

_The feature requirements for «متصفح السحر والسحرة» (the Magic and Magicians
Browser — every mention of magic and the magicians in the Qur'an, the Sunnah,
the seerah and every harvested book), as requested by the founder and delivered
in `docs/plan/38-magic-browser.md`. Written so any person or AI agent can
validate each requirement against production (`https://islam.museum`,
`https://api.islam.museum`) without reading the plan. Every requirement has an
id (`MAGIC-R..`), a "how to check" line, and the artifact that proves it._

## 0. The original request (verbatim)

> "megaplan
> Use microsd instead of Mac main drive
> get latest from main, clone the repo to a separate folder then start working
> on   
>
> متصفح السحر والسحرة  
>
>   where it should list all the mentioned and written  
>
>
> Magic and magicians
>
>
>
> that are in quran, sunnah, any of seerah and any dreams mentioned and written
> in books that were harvested and any future harvested book if it has a  
>
> Magic and magicians
>
>
> should be viewable here. add a box for it on landing page and in navigation
> menus. make sure this is done end to end and full detailed proses and make it
> ready for production at the end of this.
>
> this is only about  
>
> Magic and magicians
>
>
> and everything mentioned about  
>
> Magic and magicians
>
>
>  in quran, sunnah, serrah, anywhere in any of the sunni books
>
>
> find all the instances where  
>
>
> Magic and magicians 
>
>
>
>
> met or interacted with humans in the quran, seerah, sunna, quotes from sa7aba
> and tabi3een and add those stories, mentions, quotes
>
>
>
> also add this in engineering documents as the original requirements to allow
> AI later on to test and validate it when it is in production.
>
> you can use mac browser to browse to any web page, to get any information or
> download any books, you can use mac apple vision to OCR and then harvest those
> OCRd books or you can find any other online website that you can decide
> whether or not can be authentic and trusted as a source and get from it
> information to fully enrich and fill detailed proses
>
>
> when context is tight, just commit and push and continue
>
>
> do not wait for build/test or ci
>
>
> in the end commit, push, raise PR and merge it
> Then delete all the files and folder related to this work from the microsd"

_Scope notes agreed with the founder before implementation: the full
unseen-harm complex around magic is in scope (sorcery, soothsaying/augury,
ruqyah, the evil eye, envy, and the adjacent waswasah/kashf/'irafa/jinn/nujum
records); dream mentions are out of scope — they belong to the Dream Browser;
the work was built independently of the unmerged jinn-devils browser branch._

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| MAGIC-R01 | No new class or side table: every browser record is an ordinary graph node — passages detected at build time, curated records tagged `magic-browser` (+ optional `magic-<topic>`) | `grep -rl "magic-browser" data/` — hits under `data/{concept,person,event,passage}/`; `scripts/lib.ts` `CLASSES` unchanged |
| MAGIC-R02 | Five sections derived from the corpus, not a topic list: `quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر الكتب · `concepts` سجلات السحر | `MAGIC_SECTIONS` in `scripts/magic.ts`; `site/src/lib/magic.ts` |
| MAGIC-R03 | **Automatic inclusion of future harvested books**: a magic mention in any book enters the browser the day its passage record lands in the graph — detection is a build-time function of the compiled graph, never a hand-kept list | add a fixture passage containing «السحر» to a test work, run `npm run graph && npx tsx scripts/export-api.ts`, confirm it appears in `magic.json` with the right `section`; then remove the fixture |
| MAGIC-R04 | Detection vocabulary is gated: unambiguous forms match directly (`ساحر`, `مسحور`, `مشعوذ`, `السحر` after sahar-stripping, `كاهن`, `عراف`, `الرقى`, `يرقي`, guarded `رقية`/`ترقي`/`ارقي` forms, `حسد` family, English "magic/sorcery/soothsaying/ruqyah/evil eye/envy") — ambiguous forms count only beside magic-domain collocations | `scripts/magic.ts` `AR_SIHR_STRONG/WEAK`, `AR_MAGIC_CONTEXT`, `AR_RUQYAH_*`, `AR_AYN_*`, `AR_KAHANA`, `AR_HASAD`, `EN_*` |
| MAGIC-R05 | Sahar/night-vigil usages are stripped before matching (`تسحر`, `أسحر`, `يستسحر`, `سحراً`, `في السحر`, `من السحر إلى`, `بين سحر`, `سحرها/سحرهم/سحرنا`); «الأعراف» (the sura) and «العينة» (the 'īna sale) stripped; Ruqayya-the-name pattern stripped | `NOT_SAHAR`, `NOT_MAGIC_WORD`, `RUQAYYA_NAME` in `scripts/magic.ts` |
| MAGIC-R06 | Known false positives stay out, each verified by reading: `muwatta-15-1731` (sahar night), `bukhari-4450` («سحرها ونحرها» anatomy), `muwatta-1-062` («أعراقية» substring), `muwatta-6-1144` (Ruqayya the maidservant), `muwatta-4-824` («أن تسحر» stay up), `poem-muallaqat-zuhayr-09` («استحرن بسحرة» dawn), `muwatta-1-383` («من العين» a literal spring), `muwatta-19-2056` (agricultural «العين»), `muwatta-27-2437`, `muwatta-29-2458` (bodily eye) | `MAGIC_EXCLUDE` + gating in `scripts/magic.ts`; none appear in `magic.json` |
| MAGIC-R07 | Manually verified true positives without lexicon words join through the tag path: `muwatta-29-2553`, `muwatta-31-2715`, `muwatta-31-2716` carry `magic-browser` + topic tags | `grep -l "magic-browser" data/passage/*.yaml` |
| MAGIC-R08 | Qur'an text is never typed: magic ayahs are the frozen Tanzil `passage/quran-*` records; the only edits are tags/`mentions` edges | `text`/`text_search` byte-identical to Tanzil (validator enforces); `grep -rn "magic" data/passage/quran-*.yaml` shows only relations/tags |
| MAGIC-R09 | Reuse before create: existing concepts/persons/events tagged in place — 16 concepts, 9 persons, 1 event; 5 new records only where the graph lacked the subject (`harut`, `marut`, `labid-ibn-al-asam`, `sihr-against-the-prophet`, `ruqya`) | each exists once in `data/`; `npm run validate` 0 errors |
| MAGIC-R10 | Every record carries `sources`, `provenance`, and `status.review: draft` until a human reads it (AI-content rule); already-published records keep `review: published` | spot-check `data/person/labid-ibn-al-asam.yaml`, `data/concept/ruqya.yaml`; `npm run validate` 0 errors |

## 2. Corpus coverage (the founder's source list)

| Id | Requirement | How to check |
|---|---|---|
| MAGIC-R11 | **Qur'an**: every ayah mentioning sorcery, magicians, soothsaying or the unseen harms is listed — Pharaoh's magicians and the contests (10:76–81, 20:57–73, 26:34–49, 7:109–122), Harut and Marut (2:102), the accusation (68:2 context passages, 5:110), the "learned from two angels" verse, sihr warnings (2:102, 113:5 envy context) | `/api/v1/magic.json` `section:"quran"` → 63 items; `/ar/magic/` quran section shows 63 cards |
| MAGIC-R12 | **Sunnah**: the hadiths of sorcery among the seven destructive sins, the diviner-prohibition, the Prophet's cure by ruqyah, the evil eye and ruqyah reports — Sahih Muslim, Muwatta, the Forty, Bukhari | `section:"sunnah"` → ≥18 items; each card links to its `/{lang}/passage/<slug>/` page |
| MAGIC-R13 | **Seerah**: the section exists in the taxonomy and fills itself — any passage whose work carries genre `sira` lands in `seerah` automatically | `magicCorpusOf` in `scripts/magic.ts`; today the section is empty (no seerah passages harvested yet) — verify it renders nothing rather than erroring |
| MAGIC-R14 | **Harvested books**: every non-scripture, non-hadith, non-seerah work with a magic passage lands in `books` — currently the Hamasa and Mutanabbi poetry passages | `section:"books"` → ≥4 items (incl. tagged records' section assignment); new books appear without code changes (MAGIC-R03) |
| MAGIC-R15 | **Companions and Tabi'in reports**: the isnad-bearing hadith passages in the Sunnah/books sections carry the Companion and Tabi'in voices on magic (Malik's legal discussions, Ka'b al-Ahbar' reports, the Hafsa report) | inspect `sunnah`/`books` cards: `muwatta-29-2553/2554`, `muwatta-31-2795`, `muwatta-17-1918`, `muslim-0089/2230` present with work+ref |
| MAGIC-R16 | **Curated layer**: 34 records in `section:"concepts"` — 29 tagged-in-place + 5 new — covering sorcery, the sahara, kahana, ruqyah, the evil eye, envy, waswasah, kashf, 'irafa, jinn-affliction, the kahin persons, the Harut-Marut pair, the Prophet's bewitching event, and the Hassan-vs-Kahina campaign | `section:"concepts"` → ≥30 items; `/ar/magic/` concepts section lists them |
| MAGIC-R17 | **Magic-human interactions as stories**: the Prophet's bewitching-and-cure incident (`event/sihr-against-the-prophet` + `person/labid-ibn-al-asam`), the Harut-Marut Babylon trial (`person/harut`, `person/marut`, `concept/harut-and-marut`), al-Kahina's campaigns (`event/hassan-vs-kahina` + person records), Pharaoh's magicians (Qur'an passages) — each is an ordinary entity page with trilingual prose | `/{lang}/event/sihr-against-the-prophet/`, `/{lang}/person/labid-ibn-al-asam/` render in ar/en/ur |

## 3. The browser page `/{lang}/magic/`

| Id | Requirement | How to check |
|---|---|---|
| MAGIC-R20 | Page exists in all three languages: `/ar/magic/`, `/en/magic/`, `/ur/magic/` | `curl -sI` each → 200 |
| MAGIC-R21 | Localized title «متصفح السحر والسحرة» / "Magic and Magicians Browser" / جادو اور جادوگروں کا براؤزر + lede + badge + method note + status count | `i18n/{ar,en,ur}.yaml` `magic:` block; view each page |
| MAGIC-R22 | Section chips with counts, each linking to its anchor; every populated section shows title + description + card grid; empty sections (seerah today) do not render | `/ar/magic/` shows 4 populated sections; chip counts sum to item count |
| MAGIC-R23 | Every card links to the **ordinary entity page** (`/{lang}/passage/<slug>/`, `/{lang}/concept/<slug>/` etc.), never a browser-only page | inspect card `href`s on `/en/magic/` |
| MAGIC-R24 | Passage cards show work name + ref/unit (e.g. «صحيح مسلم · 89», «القرآن · 2:102») and a text excerpt; topic chips show the detected families; concept cards show their summary | `/ar/magic/` sunnah section cards carry the work/ref line and topic chips |
| MAGIC-R25 | Client filter narrows cards across labels, summaries, work names, topic names and excerpts in all three languages; Arabic vowel-insensitive; full list readable with JS off | `site/src/scripts/magic-filter.ts`; open `/ar/magic/` with JS disabled → full list; type «سحر» → filtered cards |
| MAGIC-R26 | Pagefind: title/lede/headings inside `data-pagefind-body`; card lists inside `data-pagefind-ignore` | page source carries both attributes; searching «السحر» reaches the page |
| MAGIC-R27 | WCAG 2.2 AA, RTL on ar/ur, Arabic parentheses isolated (U+2066/2069), no honorifics typed, `dir`/`lang` correct | validator + visual check |
| MAGIC-R28 | **Landing card** on the homepage («متصفح السحر والسحرة» with magic-star thumbnail + accent) and **Explore menu** entry, in all three languages | homepage shows the card; `nav.ts` `{ key: "magic", ready: true }`; header explore menu lists it |

## 4. API and documentation

| Id | Requirement | How to check |
|---|---|---|
| MAGIC-R30 | `https://api.islam.museum/api/v1/magic.json` returns every detected + tagged record with `section`, `topics`, `work`, `ref`, `unit`, `text`, `kind`, `themes`, `tags`, edges, prose languages | `curl -s .../magic.json \| jq '.items \| length'` ≥ 115; `feature: "magic-browser"`; `section` ∈ {quran,sunnah,seerah,books,concepts} |
| MAGIC-R31 | Endpoint documented in `docs/data/README.md`, `site/public/openapi/v1.json` (`/magic.json` path), and `llms.txt` | all three rows exist |
| MAGIC-R32 | Registered in `docs/site/browsers.md` (feature + export rows), `docs/plan/00-README.md` (plan 38), `docs/plan/06-roadmap.md`, `docs/agents/lanes.md` (`magic` lane), `docs/status.md`, `CANARY.md`, `docs/plan/38-magic-browser.md`, this spec | all rows present |
| MAGIC-R33 | `features-api.test.ts` asserts `magic.json` in the export set and its detection/classification rules (sihr topic, ambiguous-'ayn gate) | `npm test` green |

## 5. Governance and delivery

| Id | Requirement | How to check |
|---|---|---|
| MAGIC-R40 | Gates: `npm run validate` 0 errors, `npm test` all pass, `npm run build` clean | run them |
| MAGIC-R41 | All work shipped as small PRs with canary entries; nothing committed directly to protected `main` | merged-PR list; `gh pr list --search magic` |
| MAGIC-R42 | **Full trilingual coverage**: every new record has `label.ar/en/ur`, `summary.ar/en/ur`, and `content/{ar,en,ur}/<class>/<slug>.md` | the 5 new records each have 3 prose files |
| MAGIC-R43 | Draft gate: all AI-authored records remain `status.review: draft` until a human promotes them | `data/person/{harut,marut,labid-ibn-al-asam}.yaml`, `data/event/sihr-against-the-prophet.yaml`, `data/concept/ruqya.yaml` carry `review: draft` |
| MAGIC-R44 | Deploy readiness: nothing live until the founder deploys; on deploy the card + menu + page + API appear automatically | post-deploy check MAGIC-R20/R28/R30 |
| MAGIC-R45 | Dreams stay out: no dream-detection vocabulary duplicated; dream records remain in the Dream Browser only | `scripts/magic.ts` has no dream lexicon; `magic.json` contains no `dream-browser` items beyond incidental topic overlap |

## 6. Explicitly out of scope / known limits

- **Dreams**: dream mentions belong to `متصفح الأحلام`; a passage about both a
  dream and magic may appear in both browsers — that is correct, they are
  different questions.
- **Lexical recall**: magic phrased without the lexicon needs a manual
  `magic-browser` tag on the passage (MAGIC-R07 documents the three known
  cases); future audits may add more.
- **Poetry**: only literal magic vocabulary counts; metaphorical «سحر» in
  panegyric is excluded by review.
- **Seerah**: the section is taxonomy-ready but empty until seerah passages
  are harvested.
- **Depth of stories**: the interaction stories are seeded (the Prophet's
  bewitching, Harut-Marut, al-Kahina, Pharaoh's magicians); deeper
  Companion/Tabi'in anecdote mining is follow-up work as books are harvested.
