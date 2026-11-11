# 32 · Islamic Economy Browser — requirements and production checklist

_The feature requirements for «متصفح العملات والصكوك والوقف الإسلامي» (the
Islamic Economy Browser — everything the museum's sources mention or write
about money and Islamic economics, deeds/instruments/covenants, and
endowments, across the Qur'an, the Sunnah, the seerah, Companion and Tabi'i
reports and every harvested book), as requested by the founder on 11
November 2026 and delivered in `docs/plan/44-islamic-economy-browser.md`.
Written so any person or AI agent can validate each requirement against
production (`https://islam.museum`, `https://api.islam.museum`) without
reading the plan. Every requirement has an id (`IE-R..`), a "how to check"
line, and the artifact that proves it._

## 0. The original request (verbatim)

> "megaplan
> Use microsd instead of Mac main drive
> get latest from main, clone the repo to a separate folder then start working on
>
> متصفح العملات والصكوك والوقف الاسلامي
>
>   where it should list all the mentioned and written
>
>
> متصفح العملات والصكوك والوقف الاسلامي
>
>
> that are in quran, see rah, sunna, tabi3een stories , quotes , mentioned
> and written in books that were harvested and any future harvested book if
> it has a
>
>
> متصفح العملات والصكوك والوقف الاسلامي
>
>
> should be viewable here. add a box for it on landing page and in navigation
> menus. make sure this is done end to end and full detailed proses and make
> it ready for production at the end of this.
>
> this is only about
>
> متصفح العملات والصكوك والوقف الاسلامي
>
>
> and everything mentioned about
>
> متصفح العملات والصكوك والوقف الاسلامي
>
>
> anywhere in any of the sunni books or quran or sunna or sera
>
> find all the instances where
>
>
> متصفح العملات والصكوك والوقف الاسلامي
>
>
>
> Were mentioned or part of quotes from quran, sunnah, Hadith, seerah or
> from sa7aba and tabi3een and add those stories, mentions, quotes, details
>
> also add this in engineering documents as the original requirements to
> allow AI later on to test and validate it when it is in production."

Founder scope answers (same session, via clarifying questions): «العملات»
= **full Islamic economics** — coins and cash, exchange (sarf), usury
(riba), debt/loans/credit, deferred payment, hawala, trade contracts,
weights and measures, market rules, taxes (kharaj, jizya, ushr) and
zakat-on-wealth rules. «الصكوك» = **all deeds & covenants** — modern
sukuk/securitization/takaful/banking instruments **plus** classical
instruments and documents (sakk, hawala, suftaja, صك, سند, وثيقة) **plus**
covenants, treaties, charters and constitutions (ahd, mithaq, hilf,
sahifa, صلح, معاهدة, بيعة, أمان, ذمة, جوار). «الوقف» = waqf/endowment and
its synonyms (habs, sadaqa jariyah). Page organisation: corpus sections
**plus** topic chips. Slug: `islamic-economy` → `/{lang}/islamic-economy/`,
API `/api/v1/islamic-economy.json`, feature id `islamic-economy-browser`,
tag `islamic-economy-browser`.

Scope note: «العملات» here means the whole of Islamic economics — money as
practised and regulated, not only coins; «الصكوك» here means deeds,
instruments, documents and covenants in the broad sense, not only modern
sukuk; «الوقف» means endowment (waqf/habs) and the perpetual-charity
formula, not every act of giving (plain sadaqa, gifts and vows are out).

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| IE-R01 | No new class or side table: every browser record is an ordinary graph node — passages detected at build time, curated records tagged `islamic-economy-browser` (+ optional `islamic-economy-<topic>` / `islamic-economy-<section>`) | `grep -rl "islamic-economy-browser" data/` — hits under `data/concept/`, `data/event/`, `data/work/` and `data/passage/` `relations:` only; `scripts/lib.ts` `CLASSES` unchanged |
| IE-R02 | Five corpus sections derived from the work, not a topic list: `quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر الكتب · `curated` السجلات المنتقاة | `IE_SECTIONS` in `scripts/islamic-economy.ts`; `site/src/lib/islamic-economy.ts` |
| IE-R03 | Three topic chips on every record: `money` (العملات — full Islamic economics), `sukuk` (الصكوك — deeds, instruments, covenants), `waqf` (الوقف — endowment); a record may carry several | `IE_TOPICS`; `ieTopicsOf` (passages) / `ieTagTopics` (curated); `/api/v1/islamic-economy.json` `topics` arrays |
| IE-R04 | **Automatic inclusion of future harvested books**: a money/sukuk/waqf mention in any book enters the browser the day its passage record lands in the graph — detection is a build-time function of the compiled graph, never a hand-kept list | add a fixture passage containing «أوقف أرضاً» or «ربا» to a test work, run `npm run graph && npx tsx scripts/export-api.ts`, confirm it appears in `islamic-economy.json` with the right `section`/`topics`; then remove the fixture |
| IE-R05 | Detection is over passage-owned text only (`text_search`, `text` fallback) — never labels or summaries, so a chapter named «كتاب البيوع» does not create false hits | `ieSignalsOf` in `scripts/islamic-economy.ts`; a fixture passage whose label names trade but whose text does not must NOT be detected |
| IE-R06 | Arabic diacritics and tatweel are stripped before matching; patterns tolerate clitic prefixes and pronoun suffixes | fixture «أَوْقَفَ أَرْضًا» (fully vocalised) is detected |
| IE-R07 | Money signals — unambiguous coin/cash/instrument forms: دنانير، دراهم، دينار، درهم، فلس، فكة، نقود، نقد، مسكوكات، ربا family (ربا، يربون، آكلو الربا، ربا الفضل، ربا النسيئة), قرض، سلف، نسيئة، آجل، مؤجل، صرّافة/صراف، خراج، جزية، عشر، بيت المال/بيت مال، زكاة collocations | `scripts/islamic-economy.ts` AR_* patterns; spot-check Qur'an 2:275–281 (riba), 9:34–35 (treasury), the dinar/dirham hadiths |
| IE-R08 | Money signals — gated ambiguous forms: «دين» (also religion — must appear beside money collocations like دينار/درهم/قرض/سلف/قضاء/وفاء/آجل), «المال/الأموال» (too broad alone), «بيع/شراء/البيوع» (also generic sale language), «صرف» (also spend/interpret), «مضاربة/مشاركة» (also beating/sharing), «سلم» (also peace), «سعر/ثمن/قيمة» (price/fame), «سند/سجل/صحيفة/رقاع/ديوان» (also isnad/register/poetry divan), «أمان/ذمة/جوار» (also trust/duty/neighbourhood) | `AR_*_WEAK` + `*_CONTEXT` pattern pairs; fixture «دين» alone → not detected; «دين عليه دراهم» → detected |
| IE-R09 | Sukuk signals — instruments and documents: صكوك، سندات، صك، سند, كمبيالة، شيك، حوالة، سفتجة، وثيقة/وثائق، محضر, أوراق مالية، تورق/توريق، تكافل، تأمين | same detector file; fixture «صكوك sukuk» and «كتب الصك» detected |
| IE-R10 | Sukuk signals — covenants: عهد (gated vs era «عهد»), ميثاق، حلف (gated), صلح (gated vs reform/repair), معاهدة، هدنة، موادعة، مسالمة، بيعة، مواثيق، أمان (gated), ذمة (gated), جوار (gated), صحيفة/الصحيفة، الصحيفة (the Madinan charter) | same; fixture «عهد عمر» vs «عهد الجاهلية» distinction verified in tests |
| IE-R11 | Waqf signals — endowment: وقف (gated vs "he stopped"), أوقف/يوقف/موقوف/موقوفات/أوقاف, واقف (gated), حبس (gated vs prison), صدقة جارية، جارية only inside that phrase, the formula «لا يباع ولا يورث» / «لا يورث ولا يباع» / «لا تباع» / «لا تهب», ناظر الوقف/نظارة، المتولي (gated), أوقف + endowed objects (دار/أرض/بئر/مسجد/مدرسة/مستشفى/سبيلاً/حوض) | same; fixture «وقف الرجل» (he stopped) → not detected; «أوقف داراً» → detected with `waqf` topic |
| IE-R12 | Known false positives excluded by id in `IE_EXCLUDE`: every verified wrong hit from the sampling pass (poetry, place names, «وقف» as stopping, «حبس» as prison, «دين» as religion, «سند» as isnad, «شركة» as shirk, «عهد» as era, «جارية» outside «صدقة جارية») | `IE_EXCLUDE`; none of these ids in `islamic-economy.json` |
| IE-R13 | Out-of-scope senses verified absent: war booty (فيء/غنيمة/أنفال — battles domain), gambling and wine (ميسر/قمار — vices), plain charity/gifts/vows (صدقة/هبة/نذر — one-time giving, not endowment), bare «بيع»/«شراء» without economic collocation, bare «المال» without economics collocation | fixture «فيء»/«غنيمة»/«قمار»/«صدقة»/«هبة» passages → not detected; spot-check the battles browser still owns spoils |
| IE-R14 | `mentions` edges: every detected passage gets `mentions` edges to its topic anchor concepts (money → the verified money umbrella, sukuk → `concept/sukuk` or `al-sakk-wal-hawala`, waqf → `concept/waqf`), each citing the passage's own first source; a multi-topic passage gets several edges; no duplicate edges | `grep -l "concept/waqf" data/passage/*.yaml \| wc -l` ≥ waqf-topic count; `npm run validate` 0 errors |
| IE-R15 | Corpus classification: `work/quran` → quran; genre `sira` → seerah; genre `hadith` or `unit: hadith` → sunnah; everything else → books; works not yet harvested land correctly the day their genre is known | `ieCorpusOf`; seerah/books sections render correctly today |
| IE-R16 | Reuse before create: existing topic records tagged in place (waqf cluster, economics cluster, deeds/covenants cluster, treaty/waqf events, Islamic-finance works); `concept/sukuk` created only with defined sources — never invented citations | `grep -l "islamic-economy-browser" data/` inventory; `npm run validate` 0 errors |
| IE-R17 | Every record carries `sources`, `provenance`, and `status.review: draft` until a human reads it (AI-content rule); already-published tagged records keep `review: published` | spot-check the new/changed files |

## 2. Corpus coverage (the founder's source list)

| Id | Requirement | How to check |
|---|---|---|
| IE-R20 | **Qur'an**: every ayah on money, usury, trade, debt, zakat-on-wealth, weights/measures and fiscal terms is listed — «يَا أَيُّهَا الَّذِينَ آمَنُوا إِنَّ كَثِيرًا مِّنَ النَّاسِ» treasury verses (9:34–35), the riba block (2:275–281), «وَأَوْفُوا الْكَيْلَ» measures verses, «إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تُؤَدُّوا الْأَمَانَاتِ», the covenant verses (المواثيق، العهود), «الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَآتَوُا الزَّكَاةَ» | `/api/v1/islamic-economy.json` `section:"quran"` → hundreds of items; spot-check `passage/quran-2-275`, `passage/quran-9-35`, `passage/quran-83-1` (مطففين) cards |
| IE-R21 | **Sunnah**: the money/deed/waqf reports of the two Sahihs, the Muwatta and the Sunan — «لا ضرر ولا ضرار»، «المسلمون على شروطهم»، «البيعان بالخيار»، «من باع سلعة»، the waqf hadiths («أوقفت خيبر»), «لا يباع ولا يورث» formula reports, treaty/pact reports (الصلح، الوثيقة، الصحيفة) | `section:"sunnah"` items; spot-check known waqf hadiths and the bay' al-khayyar hadith cards link to their passage pages |
| IE-R22 | **Seerah**: the section exists in the taxonomy and fills itself — any passage whose work carries genre `sira` lands in `seerah` automatically | `ieCorpusOf`; verify it renders rather than erroring |
| IE-R23 | **Harvested books**: every non-scripture, non-hadith, non-seerah work with a topic passage lands in `books`, classified by genre the day its passages arrive — including the fiqh corpus (bidayat al-mujtahid, mughni, radd al-muhtar, mawsu'a fiqhiyya, fiqh mawsu'a kuwaitiyya) when its passages are in the graph | `section:"books"` items; future books appear without code changes (IE-R04) |
| IE-R24 | **Companions and Tabi'in**: their stories, quotes and mentions arrive through the same detector — Companion/Tabi'in reports are sunnah/book passages like any other; no separate pipeline needed | any `passage/*` from a tabi'in work with «أوقف»/«ربا»/«عهد» appears with its work label |
| IE-R25 | **Curated layer**: tagged records in `section:"curated"` — waqf concepts/events, economics concepts, deeds/covenants concepts/events, and the Islamic-finance works | `section:"curated"` → N items; `islamic-economy-browser` tags verified on each |

## 3. The browser page `/{lang}/islamic-economy/`

| Id | Requirement | How to check |
|---|---|---|
| IE-R30 | Page exists in all three languages: `/ar/islamic-economy/`, `/en/islamic-economy/`, `/ur/islamic-economy/` | `curl -sI` each → 200 |
| IE-R31 | Localized title «متصفح العملات والصكوك والوقف الإسلامي» / "Islamic Economy Browser" / equivalent Urdu + lede + badge + method note + status count + topic labels (العملات/الصكوك/الوقف) | `i18n/{ar,en,ur}.yaml` `islamic-economy:` block; view each page |
| IE-R32 | Section chips with counts, each linking to its anchor; every populated section shows title + description + card grid; empty sections render nothing | `/ar/islamic-economy/` chip counts sum to item count |
| IE-R33 | Topic chips render on every card that carries them (money/sukuk/waqf labels in the page language) | inspect cards on `/en/islamic-economy/` |
| IE-R34 | Every card links to the **ordinary entity page** (`/{lang}/passage/<slug>/` or `/{lang}/concept/<slug>/` etc.), never a browser-only page | inspect card `href`s |
| IE-R35 | Passage cards show work name + ref/unit (e.g. «صحيح مسلم · 1556»، «القرآن · 2:275») and a text excerpt; curated cards show their summary | `/ar/islamic-economy/` cards carry the work/ref line and topic chips |
| IE-R36 | Client filter narrows cards across labels, summaries, work names, excerpts and topic labels in all three languages; Arabic vowel-insensitive; full list readable with JS off | `site/src/scripts/islamic-economy-filter.ts`; `/ar/islamic-economy/` with JS disabled → full list |
| IE-R37 | Pagefind: title/lede/headings inside `data-pagefind-body`; card lists inside `data-pagefind-ignore` | page source carries both attributes; searching «الوقف» or "sukuk" reaches the page |
| IE-R38 | WCAG 2.2 AA, RTL on ar/ur, Arabic parentheses isolated (U+2066/2069), no honorifics typed, `dir`/`lang` correct | validator + visual check |
| IE-R39 | **Landing card** on the homepage («متصفح العملات والصكوك والوقف الإسلامي» with thumbnail) and **Explore menu** entry, in all three languages | homepage shows the card; `nav.ts` `{ key: "islamic-economy", ready: true }`; header explore menu lists it |

## 4. API and documentation

| Id | Requirement | How to check |
|---|---|---|
| IE-R40 | `https://api.islam.museum/api/v1/islamic-economy.json` returns every detected + tagged record with `section`, `topics`, `signals`, `work`, `ref`, `unit`, `text`, `sura`, `aya`, `kind`, `themes`, `tags`, `connections`, `prose` | `curl -s .../islamic-economy.json \| jq '.items \| length'`; `feature: "islamic-economy-browser"`; `section` ∈ {quran,sunnah,seerah,books,curated}; `topics` ⊆ {money,sukuk,waqf} |
| IE-R41 | Endpoint documented in `docs/data/README.md`, `site/public/openapi/v1.json` (`/islamic-economy.json` path), and `llms.txt` | all three rows exist |
| IE-R42 | Registered in `docs/site/browsers.md` (feature + export rows), `docs/plan/00-README.md` (plan 44), `docs/plan/06-roadmap.md`, `docs/agents/lanes.md` (`islamic-economy` lane), `docs/status.md`, `CANARY.md` (v1.17.0 + entries), `docs/plan/44-islamic-economy-browser.md`, this file | all rows present |
| IE-R43 | `features-api.test.ts` asserts `islamic-economy.json` in the export set and its detection/classification/exclusion rules (topics, corpus sections, false-positive gates, future-book inclusion) | `npm test` green |

## 5. Governance and delivery

| Id | Requirement | How to check |
|---|---|---|
| IE-R50 | Gates: `npm run validate` 0 errors, `npm test` all pass, `npm run build` clean | run them |
| IE-R51 | Work shipped through PRs with canary entries; nothing committed directly to protected `main` | merged-PR list |
| IE-R52 | **Full trilingual coverage**: every new record carries `label`/`summary`/prose in ar, en and ur; UI strings exist in all three `i18n` files in the same commit | `i18n/{ar,en,ur}.yaml` `islamic-economy:` blocks present in the same commit |
| IE-R53 | Draft gate: new records enter `status.review: draft` with `provenance`; tagged-in-place records keep their existing review status | `data/concept/sukuk.yaml` (if created) status draft + provenance |
| IE-R54 | Deploy readiness: nothing live until the founder deploys; on deploy the card + menu + page + API appear automatically | post-deploy check IE-R30/R39/R40 |
| IE-R55 | **microSD workspace**: work happened on the microSD clone at `/Volumes/exmicroSD/islam-museum` and the folder is deleted after merge; the Mac main drive's `~/Documents/GitHub/islam-museum` working tree is untouched | `ls /Volumes/exmicroSD/islam-museum` → absent after cleanup |

## 6. Explicitly out of scope / known limits

- **War booty is not money-management**: «فيء»، «غنيمة»، «الأنفال» belong to
  the battles domain and are excluded by design.
- **Vices are not economics**: «ميسر»/«قمار» (gambling), «خمر» (wine) are
  excluded — they are prohibition topics, not money, instruments or
  endowment.
- **One-time giving is not waqf**: plain «صدقة»، «هبة»، «نذر» stay out;
  only «صدقة جارية» and the waqf/habs family count for the waqf topic.
- **Ambiguous short forms are conservative by design**: bare «دين»،
  «وقف»، «عهد»، «حبس»، «شركة»، «سند»، «سجل»، «صحيفة»، «رقاع»، «ديوان»،
  «أمان»، «ذمة»، «جوار»، «صرف»، «مضاربة»، «مشاركة»، «سلم»، «المال»،
  «البيع»، «الشراء» count only beside their domain collocations; misses
  are added to the detector in waves, never by hand-tagging passages.
- **Modern sukuk vs classical deeds**: both are in scope, but the detector
  cannot distinguish a 21st-century sukuk prospectus from a medieval waqf
  deed — both land under `sukuk`; the topic chips and curated layer carry
  the distinction.
- **Seerah depth**: the seerah section fills as seerah passages are
  harvested; the current corpus may have few sira-genre economics
  passages.
- Human read of all draft records is the only blocker to calling the
  feature finished for readers; everything else is mechanical.
