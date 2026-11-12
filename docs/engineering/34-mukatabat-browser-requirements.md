# 34 · Mukatabat Browser — requirements and production checklist

_The feature requirements for «متصفح المكاتبات النبوية والخلافية والملكية»
(the Mukatabat Browser — every letter and act of correspondence sent by or
involving the Prophet, caliphs, kings and rulers, mentioned or written in
the Qur'an, the Sunnah, the seerah, Companion and Tabi'i reports and every
harvested book), as requested by the founder and delivered in
`docs/plan/46-mukatabat-browser.md`. Written so any person or AI agent can
validate each requirement against production (`https://islam.museum`,
`https://api.islam.museum`) without reading the plan. Every requirement has
an id (`MK-R..`), a "how to check" line, and the artifact that proves it._

## 0. The original request (verbatim)

> "start working on متصفح المكاتبات النبوية والخلافية والملكية where it
> should list all the mentioned and written المكاتبات النبوية والخلافية
> والملكية that are in quran, see rah, sunna, tabi3een stories , quotes ,
> mentioned and written in books that were harvested and any future
> harvested book if it has a المكاتبات النبوية والخلافية والملكية should be
> viewable here. add a box for it on landing page and in navigation menus.
> make sure this is done end to end and full detailed proses and make it
> ready for production at the end of this. this is only about المكاتبات
> النبوية والخلافية والملكية and everything mentioned about المكاتبات
> النبوية والخلافية والملكية anywhere in any of the sunni books or quran or
> sunna or sera. find all the instances where المكاتبات النبوية والخلافية
> والملكية Were mentioned or part of quotes from quran, sunnah, Hadith,
> seerah or from sa7aba and tabi3een and add those stories, mentions,
> quotes, details. also add this in engineering documents as the original
> requirements to allow AI later on to test and validate it when it is in
> production."

Founder clarification (same session):

> "it meant the letters sent from prophet and kings and kholafa to others"

Scope note: «المكاتبات» here means **letters and correspondence** — sent by,
received by, or exchanged between the Prophet, prophets, caliphs, kings,
sultans, emperors and the rulers/offices of the caliphate — including the
letters written *to* them and the replies received. It does not include the
fiqh contract of manumission by instalments (المكاتبة), the seal of
prophethood as a physical mark (خاتم النبوة), the prophetic *message* sense
of الرسالة, generic writing/reading of documents, sermons, or personal
literary correspondence without a prophet/caliph/king party.

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| MK-R01 | No new class or side table: every browser record is an ordinary graph node — passages detected at build time, curated records tagged `mukatabat-browser` (+ optional `mukatabat-<section>` / `mukatabat-<sender>`) | `grep -rl "mukatabat-browser" data/` — hits under `data/concept/`, `data/event/` and `data/passage/` `relations:` only; `scripts/lib.ts` `CLASSES` unchanged |
| MK-R02 | Five corpus sections derived from the work, not a topic list: `quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر الكتب · `curated` السجلات المنتقاة | `MUKATABAT_SECTIONS` in `scripts/mukatabat.ts`; `site/src/lib/mukatabat.ts` |
| MK-R03 | **Automatic inclusion of future harvested books**: a letter mentioned in any book enters the browser the day its passage record lands in the graph — detection is a build-time function of the compiled graph, never a hand-kept list | add a fixture passage containing «كتب إلى هرقل كتابا» to a test work, run `npm run graph && npx tsx scripts/export-api.ts`, confirm it appears in `mukatabat.json` with the right `section`; then remove the fixture |
| MK-R04 | Detection is over passage-owned text only (`text_search`, `text` fallback) — never labels or summaries | `mukatabatSignalsOf` in `scripts/mukatabat.ts`; a fixture passage whose label says «مكاتبات» but whose text does not must NOT be detected |
| MK-R05 | Arabic diacritics and tatweel are stripped before matching; patterns tolerate clitic prefixes, pronoun suffixes and the hamza alef variants | fixture «كَتَبَ إِلَى هَرَقْلَ كِتَابًا» (fully vocalised) is detected |
| MK-R06 | `mukatabat_kind`: `letter` when the passage carries or reports an actual letter (quoted text, the sending act, a named letter, a reply); `mention` when it is only about correspondence (institutions, the genre, seals, the practice) | `mukatabatKindOf`; `mukatabat.json` rows carry `mukatabat_kind` and the matched `signals` |
| MK-R07 | **Sender classification** `sender` ∈ {`prophetic`, `caliphal`, `royal`, `other`, `null`}: prophetic when the Prophet or a prophet is a party (author, recipient or correspondent); caliphal when a caliph or the caliphate administration is a party; royal when a king/emperor/sultan is a party; other for correspondence outside the three classes; null for genre-level mentions. Priority prophetic > caliphal > royal > other | `mukatabatSenderOf`; a fixture «كتب هرقل إلى كسرى» → `royal`; «كتب عمر إلى هرقل» → `caliphal`; «كتب إلى النجاشي» with the Prophet as author → `prophetic` |
| MK-R08 | Incoming letters and replies are in scope: passages reporting letters *to* the Prophet or replies *received* from rulers are detected and classified by the correspondence's principal party | `passage` records for Musaylima's letter, Hatib's letter and the kings' replies appear; `musaylimas-letter-and-the-prophets-reply` event tagged |
| MK-R09 | Hard exclusions verified absent: fiqh mukataba («المكاتب»/«يعتق بمكاتبة» near عبد/عتق/نصف/شريك), «خاتم النبوة», «بلغ رسالة ربه» prophetic-message sense, scripture senses («الكتاب»، «كتب الله»، «مكتوب في»), sermon senses («خطب»، «خاطب»، bare «خطاب»), «صك» deed/receipt senses without document context, generic writing not involving a ruler party | fixture passages for each sense → `mukatabatSignalsOf` returns `[]`; verified false-positive ids in `MUKATABAT_EXCLUDE` |
| MK-R10 | `mentions → concept/<genre>` edges on every detected passage, each citing the passage's own first source | `grep -l "concept/<genre-slug>" data/passage/*.yaml \| wc -l` ≥ detected passage count |
| MK-R11 | Reuse before create: the fiqh `concept/mukataba` is NOT reused for the genre; correspondence concepts (`diwan-al-insha`, `diwan-al-barid`, `diwan-al-khatim`, `insha`) are tagged in place; new records only where a real gap exists | `grep -l "mukatabat-browser" data/` audit; `npm run validate` 0 errors |
| MK-R12 | Every record carries `sources`, `provenance`, and `status.review: draft` until a human reads it | spot-check new `data/passage/*` and `data/event/*` files |

## 2. Corpus coverage (the founder's source list)

| Id | Requirement | How to check |
|---|---|---|
| MK-R20 | **Qur'an**: every ayah carrying or mentioning correspondence is listed — Sulayman's letter to Bilqis (27:28–31) and any other letter-context verse | `/api/v1/mukatabat.json` `section:"quran"` items; `/ar/mukatabat/` quran section |
| MK-R21 | **Sunnah**: the letter hadiths — «كتب إلى هرقل/كسرى/النجاشي/المقوقس»، «خاتم كسرى»، the Amr ibn Hazm zakat letter, Hatib's letter affair, «من كتب إلى» reports — present once their passage records exist | `section:"sunnah"` items include the hadith-api-mined letter reports; spot-check `bukhari-*`, `muslim-*`, `tirmidhi-*` cards |
| MK-R22 | **Seerah**: the letters-to-kings chapter and delegation-letter episodes of the mined sira books land in `seerah`; the section fills automatically as sira passages arrive | `section:"seerah"` items from `work/*sira*`/`work/ar-rahiq-al-makhtum` etc. |
| MK-R23 | **Companion and Tabi'i reports**: their letters and correspondence mentions arrive through the same detector as sunnah/book passages | any `passage/*` from a tabi'in work with a letter signal appears with its work label |
| MK-R24 | **Harvested books**: every non-scripture, non-hadith, non-seerah work with a correspondence passage lands in `books`, classified by genre | `section:"books"` items (e.g. Nahj al-Balagha's Ali letters, correspondence collections) |
| MK-R25 | **Curated layer**: verified events, concepts and works tagged `mukatabat-browser` with correct `sender` tags appear in `section:"curated"` | `section:"curated"` items; `data/*/…` files carry the tag |
| MK-R26 | **New passage harvest**: the six hadith books' letter reports (hadith-api editions) and the seerah letter episodes (microSD `book.txt`, claims-ledger respected, ≤40-word excerpts, printed-page refs) exist as `data/passage/` records with trilingual labels/summaries | `ls data/passage/ \| grep -c` new files; spot-check one per source book |

## 3. The browser page `/{lang}/mukatabat/`

| Id | Requirement | How to check |
|---|---|---|
| MK-R30 | Page exists in all three languages: `/ar/mukatabat/`, `/en/mukatabat/`, `/ur/mukatabat/` | `curl -sI` each → 200 |
| MK-R31 | Localized title «متصفح المكاتبات النبوية والخلافية والملكية» + lede + badge + method note + status count + kind labels («رسالة»/«ذكر») + sender labels («نبوية»/«خلافية»/«ملكية»/«أخرى») | `i18n/{ar,en,ur}.yaml` `mukatabat:` block; view each page |
| MK-R32 | Section chips with counts; every populated section shows title + description + card grid; empty sections do not render | `/ar/mukatabat/` chip counts sum to item count |
| MK-R33 | **Sender chips** filter the list by `prophetic`/`caliphal`/`royal`/`other` in all three languages, alongside the text filter | type/click sender chip on `/en/mukatabat/` → only that class's cards remain |
| MK-R34 | Every card links to the **ordinary entity page**, never a browser-only page | inspect card `href`s on `/en/mukatabat/` |
| MK-R35 | Passage cards show work name + ref/unit and a text excerpt; kind and sender chips show on cards; curated cards show their summary | `/ar/mukatabat/` cards carry the work/ref line and chips |
| MK-R36 | Client filter narrows cards across labels, summaries, work names, excerpts, kind and sender labels in all three languages; full list readable with JS off | `site/src/scripts/mukatabat-filter.ts`; JS-disabled `/ar/mukatabat/` shows full list |
| MK-R37 | Pagefind: title/lede/headings inside `data-pagefind-body`; card lists inside `data-pagefind-ignore` | page source carries both attributes |
| MK-R38 | WCAG 2.2 AA, RTL on ar/ur, Arabic parentheses isolated (U+2066/2069), no honorifics typed, `dir`/`lang` correct | validator + visual check |
| MK-R39 | **Landing card** on the homepage («متصفح المكاتبات…» with mukatabat thumbnail) and **Explore menu** entry, in all three languages | homepage shows the card; `nav.ts` `{ key: "mukatabat", ready: true }`; header explore menu lists it |

## 4. API and documentation

| Id | Requirement | How to check |
|---|---|---|
| MK-R40 | `https://api.islam.museum/api/v1/mukatabat.json` returns every detected + tagged record with `section`, `mukatabat_kind`, `sender`, `signals`, `work`, `ref`, `unit`, `text`, `sura`, `aya`, `kind`, `themes`, `tags`, `connections`, `prose` | `curl -s .../mukatabat.json \| jq '.items \| length'`; `feature: "mukatabat-browser"`; `section` ∈ {quran,sunnah,seerah,books,curated}; `sender` ∈ {prophetic,caliphal,royal,other,null} |
| MK-R41 | Endpoint documented in `docs/data/README.md`, `site/public/openapi/v1.json` (`/mukatabat.json` path), and `llms.txt` | all three rows exist |
| MK-R42 | Registered in `docs/site/browsers.md`, `docs/plan/00-README.md` (plan 46), `docs/plan/06-roadmap.md`, `docs/agents/lanes.md` (`mukatabat` lane), `docs/status.md`, `CANARY.md` (v1.18.0 + entries), `docs/plan/46-mukatabat-browser.md`, this file | all rows present |
| MK-R43 | `features-api.test.ts` asserts `mukatabat.json` in the export set and its detection/classification/exclusion rules (letter vs mention, corpus sections, sender classes, fiqh/seal/message false-positive gates, future-book inclusion) | `npm test` green |

## 5. Governance and delivery

| Id | Requirement | How to check |
|---|---|---|
| MK-R50 | Gates: `npm run validate` 0 errors, `npm test` all pass, `npm run build` clean | run them |
| MK-R51 | Work shipped through PRs with canary entries; nothing committed directly to protected `main` | merged-PR list |
| MK-R52 | **Full trilingual coverage**: every new record carries `label`/`summary` in ar, en and ur; UI strings exist in all three `i18n` files in the same commit | new `data/passage/*` files carry all three labels; `mukatabat:` blocks in all three yaml |
| MK-R53 | Draft gate: every new record is `status.review: draft` with `provenance` (source, generator, run); tagged-in-place records keep their existing review status | `data/passage/*` new files; spot-check |
| MK-R54 | Deploy readiness: nothing live until the founder deploys; on deploy the card + menu + page + API appear automatically | post-deploy check MK-R30/R39/R40 |

## 6. Explicitly out of scope / known limits

- **Fiqh mukataba** (manumission by instalments): «المكاتب»، «يعتق
  بمكاتبة»، «كاتب عبده» are excluded by gate and verified-id exclusion.
- **خاتم النبوة**: the Prophet's seal as a physical mark is not
  correspondence; «خاتم كسرى»، «خاتم فضي»، «خاتم رسول الله» in document
  contexts do count.
- **الرسالة as message**: «بلغ رسالة ربه»، «الرسالة» prophetic-message
  senses are out; «رسالة إلى/من» and «كتب/أرسل رسالة» letter senses are in.
- **Scripture senses**: «الكتاب»، «كتب الله»، «كتب في ديوان», «سجل»,
  «مكتوب في» never match on their own.
- **Sermons**: «خطب»، «خاطب»، bare «خطاب» address senses are out; a
  written «خطاب» to a ruler counts.
- **صك deeds**: receipt/deed senses are out unless an official-document
  context (chancery, caliphal administration) is explicit.
- **Personal correspondence**: Rumi's *Maktubat* and similar Sufi/personal
  letter collections are out unless a prophet/caliph/king party is involved
  (audited per work).
- **Generic letters not involving a ruler party**: a companion's private
  letter with no prophet/caliph/king correspondent is `other` or excluded —
  the founder's scope is the prophetic, caliphal and royal correspondence.
- **Ambiguous short forms are intentionally conservative**: a bare «كتب»
  with no letter-object and no party context does not match; missed edge
  cases are added to the detector in waves, never by hand-tagging passages.
- **Completeness is corpus-bound**: the browser lists what the museum's
  graph carries; it does not claim exhaustiveness of the historical record.
- Human read of all draft records is the only blocker to calling the feature
  finished for readers; everything else is mechanical.
