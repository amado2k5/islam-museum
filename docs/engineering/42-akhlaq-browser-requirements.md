# 42 · Akhlaq and Mu'amalat Browser — requirements and production checklist

_The feature requirements for «متصفح الأخلاق والمعاملات» (the Akhlaq and
Mu'amalat Browser — every mention of ethics and dealings in the Qur'an, the
Sunnah, the seerah, Companion and Tabi'i reports and every harvested book),
as requested by the founder on 11 November 2026 and delivered in
`docs/plan/54-akhlaq-browser.md`. Written so any person or AI agent can
validate each requirement against production (`https://islam.museum`,
`https://api.islam.museum`) without reading the plan. Every requirement has
an id (`AKH-R..`), a "how to check" line, and the artifact that proves it._

## 0. The original request (verbatim)

> "megaplan
> Use microsd instead of Mac main drive
> get latest from main, clone the repo to a separate folder then start
> working on
>
> متصفح الاخلاق والمعاملات
>
>   where it should list all the mentioned and written
>
>  الاخلاق والمعاملات
>
> that are in quran, see rah, sunna, tabi3een stories , quotes , mentioned
> and written in books that were harvested and any future harvested book if
> it has a
>
>  الاخلاق والمعاملات
>
> should be viewable here. add a box for it on landing page and in
> navigation menus. make sure this is done end to end and full detailed
> proses and make it ready for production at the end of this.
>
> this is only about
>
>  الاخلاق والمعاملات
>
> and everything mentioned about
>
>  الاخلاق والمعاملات
>
>  anywhere in any of the sunni books or quran or sunna or sera
>
> find all the instances where
>
>  الاخلاق والمعاملات
>
> Were mentioned or part of quotes from quran, sunnah, Hadith, seerah or
> from sa7aba and tabi3een and add those stories, mentions, quotes, details
>
> also add this in engineering documents as the original requirements to
> allow AI later on to test and validate it when it is in production.
>
> you can use mac browser to browse to any web page, to get any information
> or download any books, you can use mac apple vision to OCR and then
> harvest those OCRd books or you can find any other online website that
> you can decide whether or not can be authentic and trusted as a source
> and get from it information to fully enrich and fill detailed proses
>
> when context is tight, just commit and push and continue
>
> do not wait for build/test or ci
>
> in the end commit, push, raise PR and merge it
> Then delete all the files and folder related to this work from the
> microsd"

Scope note: «الأخلاق والمعاملات» here means (a) **character ethics** — the
virtues (صدق، أمانة، صبر، شكر، تواضع، إحسان، حياء، حلم، عفو، إخلاص، توبة،
كرم، إيثار، بر الوالدين، صلة الرحم، حق الجار، حسن المعاشرة، نصيحة، رحمة،
عدل) and the vices (كذب، خيانة، كبر، عجب، رياء، حسد، بخل، غيبة، نميمة،
سخرية، فحش، سب، غضب، ظلم، عقوق، قطيعة رحم، نفاق، غش) the texts name and
teach — and (b) **dealings** — the transactions and social rulings between
people the passages record (بيع وتجارة، ربا في المعاملة، دين وقرض، رهن،
إجارة وأجير، وصية وإرث، نكاح وطلاق ومهر وعدة ورضاع ونفقة وحضانة، يمين وقسم،
شهادة وبينة، قضاء، ميزان وكيل وتطفيف، صلح، هبة وهدية، كفالة وضمان، وكالة،
شركة ومضاربة ومزارعة ومساقاة، سلم، حوالة، عارية ووديعة، غصب ولقطة، شفعة،
احتكار، إكراه، حجر). Worship rites (prayer, fasting, hajj, dhikr, du'a)
belong to the Ibadat and Du'a browsers; hudud and the Islamic-economy
subjects have their own browsers and are cross-linked, not duplicated.

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| AKH-R01 | No new class or side table: every browser record is an ordinary graph node — passages detected at build time, curated records tagged `akhlaq-browser` (+ `akhlaq-<topic>`) | `grep -rl "akhlaq-browser" data/` — hits on concept/practice records; `scripts/lib.ts` `CLASSES` unchanged |
| AKH-R02 | Five corpus sections: `quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر الكتب · `curated` السجلات المنتقاة | `AKHLAQ_SECTIONS` in `scripts/akhlaq.ts`; `site/src/lib/akhlaq.ts` |
| AKH-R03 | **Automatic inclusion of future harvested books**: an akhlaq or mu'amalat passage in any book enters the browser the day its passage record lands in the graph — detection is a build-time function of the compiled graph, never a hand-kept list | add a fixture passage containing «من كذب علي متعمداً» or «أوفوا بالعقود» to a test work, run `npm run graph && npx tsx scripts/export-api.ts`, confirm it appears in `akhlaq.json` with the right `section`; then remove the fixture |
| AKH-R04 | Detection is over passage-owned text only (`text_search`, `text` fallback) — never labels or summaries, so chapter names like «كتاب الأدب» or «كتاب البيوع» do not create false hits | `akhlaqSignalsOf` in `scripts/akhlaq.ts`; a fixture passage whose label says «البيوع» but whose text does not must NOT be detected |
| AKH-R05 | Arabic diacritics and tatweel are stripped before matching; patterns tolerate clitic prefixes and pronoun suffixes | a vocalised fixture «أَوْفُوا بِالْعُقُودِ» is detected |
| AKH-R06 | Two tracks: `akhlaq` (virtues + vices + trait mentions) and `muamalat` (dealings). A passage can carry both («الذين إذا اقتروا عليهم يستوفون» with a character vice). `tracks` is a set | `akhlaqTracksOf`; a fixture «وفى بالعهد وصدق» carries both |
| AKH-R07 | Four kinds: `virtue`, `vice`, `dealing`, `mention`. `mention` = the passage is about akhlaq/mu'amalat (chapter-level statements, «مكارم الأخلاق», «الأخلاق», «المعاملات») without naming a concrete trait or contract | `akhlaqKindsOf` in `scripts/akhlaq.ts` |
| AKH-R08 | Topics: every signal belongs to a trait or contract family (`sidq`, `amana`, `sabr`, `shukr`, `tawadu`, `ihsan`, `haya`, `hilm`, `ikhlas`, `tawba`, `karam`, `birr`, `rahim`, `jiwar`, `husn-zann`, `nasiha`, `rahmah`, `adl`, `itqan`, `kadhib`, `khiyana`, `kibr`, `riya`, `hasad`, `bukhl`, `ghiba`, `namima`, `ghadab`, `zulm`, `uquq`, `nifaq`, `ghish`, `bay`, `riba`, `dayn`, `rahn`, `ijara`, `wasiyya`, `irth`, `nikah`, `talaq`, `yamin`, `shahada`, `qada`, `mizan`, `sulh`, `hiba`, `kafala`, `wakala`, `sharika`, `salam`, `hawala`, `ariya`, `ghasb`, `shufa`, `ihtikar`, `ikrah`, `hajr`); `akhlaqTopicsOf` returns the union | `akhlaqTopicsOf` in `scripts/akhlaq.ts`; `akhlaq.json` rows carry `topics` |
| AKH-R09 | Virtue signals: «صدق/الصادقين»، «أمانة/الأمانات»، «وفاء/وفى بالعهد»، «صبر/الصابرين»، «شكر/الشاكرين»، «تواضع»، «إحسان/محسنين»، «حياء»، «حلم/الحليم»، «عفو/العافين»، «إخلاص/مخلصين»، «توبة/التائبين»، «كرم/أكرم»، «إيثار/يؤثرون»، «بر الوالدين/بوالديه»، «صلة الرحم/الأرحام»، «الجار»، «النصيحة»، «كف الأذى»، «إتقان»، «رحمة/الراحمون»، «عدل/قسط» | fixture ayahs/hadiths for each head match; `passage/quran-17-23` («لا تقل لهما أف») detected as `birr` |
| AKH-R10 | Vice signals: «كذب/الكاذبين/يكذب»، «خيانة/يخون»، «كبر/متكبر»، «عجب»، «رياء/يراءون»، «حسد/حاسد»، «بخل/البخل»، «غيبة/يغتب/اغتاب»، «نميمة/نمام»، «سخرية/يسخر»، «فحشاء/فاحشة»، «سب/لعن»، «غضب»، «ظلم/الظالمين»، «عقوق/عاق»، «قطيعة رحم/يقطع ما أمر الله»، «نفاق/المنافقين»، «غش» | `passage/quran-49-12` (غيبة) detected as `ghiba`/`vice`; `passage/quran-4-135` etc. |
| AKH-R11 | Dealing signals: «بيع/بايع/بائع/يشترون/بيعوا»، «الربا/ربوا/الربوة» (gated to transaction context), «دين/مداين/قرض/اقرض»، «رهن/مرهون»، «إجارة/أجير/أجر» (hire senses), «وصية/الموصي»، «ميراث/إرث/فريضة/الفرائض»، «نكاح/تزوج/أنكحوا»، «طلاق/الطلاق/طلق»، «خلع»، «عدة/العدة»، «مهر/صداق»، «رضاعة/أرضع»، «نفقة/ينفق على»، «حضانة»، «يمين/أيمان/قسم/حلف»، «كفارة»، «شهادة/شهداء/بينة» (testimony senses), «قضاء/يحكم بين»، «ميزان/الكيل/المكيال/تطفيف/يوفون»، «صلح/الإصلاح بين»، «هبة/هدية/عطية»، «كفالة/كفيل/ضمان»، «وكالة/وكيل»، «شركة/شريك/مشاركة/قراض/مضاربة/مزارعة/مساقاة»، «سلم/سلف»، «استصناع»، «حوالة»، «عارية/وديعة»، «غصب»، «لقطة»، «شفعة/شفع»، «احتكار»، «إكراه/أكره»، «حجر» | fixture passages per family; `passage/quran-2-275` (الربا) detected as `riba`; `passage/quran-83-1` (المطففين) detected as `mizan` |
| AKH-R12 | Out-of-scope senses verified absent: «يربي/ربوة» (growth), «بايع» as bay'ah/allegiance when no sale verb or sale object is present, «حكم» as wisdom, «شهادة» as shahada-of-faith or martyrdom, «عدل» as equivalence, «أجر» as reward unqualified, «قسم» as portion | `passage/quran-2-22`? no — verify on real corpus: a fixture «بايعوا النبي تحت الشجرة» must NOT hit `bay` (it hits via bay'ah? — the sale family requires بيع/بائع/بايع + sale context words ثمن، سلعة، اشترى، باع، أو the «البيع» noun; «بايعوه» alone with no sale context is out); `passage/quran-2-129` («ويعلمهم الكتاب والحكمة») must NOT hit `qada` |
| AKH-R13 | Known false positives excluded by id in `AKHLAQ_EXCLUDE`, curated escape hatch: tagging a passage `akhlaq-browser` also admits it | `AKHLAQ_EXCLUDE`; none of its ids in `akhlaq.json` |
| AKH-R14 | `akhlaq_kinds`, `tracks`, `topics`, `signals` on every detected passage in the export; curated records carry `null` kind and their tag topics | `akhlaq.json` row shape |
| AKH-R15 | Corpus classification: `work/quran` → quran; genre `sira` → seerah; genre `hadith` or `unit: hadith` → sunnah; everything else → books; works not yet harvested land correctly the day their genre is known | `akhlaqCorpusOf`; seerah/books sections empty today but render correctly |
| AKH-R16 | Reuse before create: existing trait and contract records tagged in place (~40 records listed in plan 54 §4); da'wa/worship records are NOT tagged; only **2 new records** authored — `concept/akhlaq` (the virtues-and-vices umbrella, distinct from `khuluq`) and `concept/muamalat` (the dealings umbrella) | `grep -l "akhlaq-browser" data/` ≈ 40+ files, only 2 newly created |
| AKH-R17 | New records carry `sources`, `provenance`, `status.review: draft`; tagged-in-place records keep their existing review status; trilingual prose files for the two new records | `data/concept/akhlaq.yaml`, `data/concept/muamalat.yaml`; `content/{ar,en,ur}/concept/{akhlaq,muamalat}.md` |
| AKH-R18 | `mentions` edges on a small anchor set: the two umbrella records receive `mentions` edges from a bounded list of canonical passages (e.g. «إنما بعثت لأتمم مكارم الأخلاق» and «أوفوا بالعقود» families) — bulk edge-writing is deferred to later waves | `grep -l "concept/akhlaq\|concept/muamalat" data/passage/*.yaml` — a bounded set |

## 2. Corpus coverage (the founder's source list)

| Id | Requirement | How to check |
|---|---|---|
| AKH-R20 | **Qur'an**: every ayah naming a trait or a dealing is listed — the birr ayah (2:177), «إن الله يأمر بالعدل والإحسان» (16:90), غيبة (49:12), الربا (2:275–279), المطففون (83:1–3), الدَّين (2:282), الرهن (2:283), النكاح (4:3, 2:221), الطلاق (2:228–232), اليمين (5:89), الشهادة (2:282, 4:135), «أوفوا بالعقود» (5:1), «أوفوا الكيل والميزان» (11:85, 17:35), بر الوالدين (17:23–24), صلة الأرحام (47:22), العدل (4:58, 5:8), الأمانات (4:58, 23:8, 70:32), النفاق (63:1–), الكبر (17:37, 31:18), الصدق (9:119, 33:70), الصبر (2:153–157, 39:10), الشكر (14:7), العفو (42:40, 3:134), الظلم (10:27 etc.), الكذب (16:105, 39:3), الإخلاص (98:5), التوبة (39:53, 66:8) | `/api/v1/akhlaq.json` `section:"quran"` rows; spot-check each id |
| AKH-R21 | **Sunnah**: the akhlaq and mu'amalat hadiths of the Sahihs, the Muwatta and the Sunan — «إنما بعثت لأتمم مكارم الأخلاق», «المسلم من سلم المسلمون من لسانه ويده», «من كان يؤمن بالله واليوم الآخر فليكرم جاره», «آية المنافق ثلاث», «سبعة يظلهم الله», كتاب البيوع والأدب من الصحيحين, «لا يبع بعضكم على بيع بعض», «البيعان بالخيار», «البرم في البيعان», الرهن والدين والشهادة والوصية والقضاء أحاديثها | `section:"sunnah"` rows; spot-check well-known reports present |
| AKH-R22 | **Seerah**: the section exists and fills itself — any passage whose work carries genre `sira` lands in `seerah` automatically | `akhlaqCorpusOf` in `scripts/akhlaq.ts`; renders empty rather than erroring |
| AKH-R23 | **Harvested books**: every non-scripture, non-hadith, non-seerah work with an akhlaq/mu'amalat passage lands in `books`, classified by genre the day its passages arrive | `section:"books"`; future books appear without code changes (AKH-R03) |
| AKH-R24 | **Companions and Tabi'in**: their reports arrive through the same detector — athar passages are sunnah/book passages like any other | any `passage/*` from a tabi'in/athar work with an akhlaq term appears with its work label |
| AKH-R25 | **Curated layer**: ~40 records in `section:"curated"` — the two new umbrellas plus the tagged trait and contract records | `section:"curated"` rows ≈ plan 54 §4 list |

## 3. The browser page `/{lang}/akhlaq/`

| Id | Requirement | How to check |
|---|---|---|
| AKH-R30 | Page exists in all three languages: `/ar/akhlaq/`, `/en/akhlaq/`, `/ur/akhlaq/` | `curl -sI` each → 200 |
| AKH-R31 | Localized title «متصفح الأخلاق والمعاملات» / "Ethics and Dealings Browser" / «اخلاق اور معاملات کا براؤزر» + lede + badge + method note + status count + track/kind/topic labels | `i18n/{ar,en,ur}.yaml` `akhlaq:` block; view each page |
| AKH-R32 | Section chips with counts, each linking to its anchor; every populated section shows title + description + card grid; empty sections do not render | `/ar/akhlaq/` chip counts sum to item count |
| AKH-R33 | Every card links to the **ordinary entity page** (`/{lang}/passage/<slug>/` or `/{lang}/concept/<slug>/`), never a browser-only page | inspect card `href`s on `/en/akhlaq/` |
| AKH-R34 | Passage cards show work name + ref/unit, a text excerpt, and track/kind/topic chips; curated cards show their summary and topic chips | `/ar/akhlaq/` sunnah cards carry the work/ref line and chips |
| AKH-R35 | Client filter narrows cards across labels, summaries, work names, excerpts, track/kind/topic names in all three languages; Arabic vowel-insensitive; full list readable with JS off | `site/src/scripts/akhlaq-filter.ts`; open `/ar/akhlaq/` with JS disabled → full list; type «الصدق» → filtered |
| AKH-R36 | Pagefind: title/lede/headings inside `data-pagefind-body`; card lists inside `data-pagefind-ignore` | page source carries both attributes; searching «الأخلاق» or "ethics" reaches the page |
| AKH-R37 | WCAG 2.2 AA, RTL on ar/ur, Arabic parentheses isolated (U+2066/2069), no honorifics typed, `dir`/`lang` correct | validator + visual check |
| AKH-R38 | **Landing card** on the homepage (mizan/scales motif for mu'amalat) and **Explore menu** entry, in all three languages | homepage shows the card; `nav.ts` `{ key: "akhlaq", ready: true }` |

## 4. API and documentation

| Id | Requirement | How to check |
|---|---|---|
| AKH-R40 | `https://api.islam.museum/api/v1/akhlaq.json` returns every detected + tagged record with `section`, `akhlaq_kinds`, `tracks`, `topics`, `signals`, `work`, `ref`, `unit`, `text`, `sura`, `aya`, `kind`, `themes`, `tags`, `connections`, `prose` | `curl -s .../akhlaq.json \| jq '.items \| length'`; `feature: "akhlaq-browser"`; `section` ∈ {quran,sunnah,seerah,books,curated} |
| AKH-R41 | Endpoint documented in `docs/data/README.md`, `site/public/openapi/v1.json` (`/akhlaq.json` path), and `llms.txt` | all three rows exist |
| AKH-R42 | Registered in `docs/site/browsers.md`, `docs/plan/00-README.md` (plan 54), `docs/plan/06-roadmap.md`, `docs/agents/lanes.md` (`akhlaq` lane), `docs/status.md`, `CANARY.md`, `docs/plan/54-akhlaq-browser.md`, this file | all rows present |
| AKH-R43 | `features-api.test.ts` asserts `akhlaq.json` in the export set and its detection/classification rules (kinds, tracks, topics, corpus sections, false-positive gates, future-book inclusion) | `npm test` green |

## 5. Governance and delivery

| Id | Requirement | How to check |
|---|---|---|
| AKH-R50 | Gates: `npm run validate` 0 errors, `npm test` all pass | run them |
| AKH-R51 | Work shipped through a PR with canary entries; merged to main per the founder's instruction | merged-PR list |
| AKH-R52 | **Full trilingual coverage**: every new record carries `label`/`summary`/prose in ar, en and ur; UI strings exist in all three `i18n` files in the same commit | `content/{ar,en,ur}/concept/{akhlaq,muamalat}.md`; `akhlaq:` blocks in all three yaml |
| AKH-R53 | Draft gate: new records enter `status.review: draft` with `provenance`; tagged-in-place records keep their existing status | spot-check the two umbrellas |
| AKH-R54 | Deploy readiness: nothing live until the founder deploys; on deploy the card + menu + page + API appear automatically | post-deploy check AKH-R30/R38/R40 |

## 6. Explicitly out of scope / known limits

- **Worship is not akhlaq here**: الصلاة والصوم والحج والذكر والدعاء are the
  Ibadat and Du'a browsers' scope — the akhlaq lexicon deliberately omits
  ibadat terms; «عبادات ومعاملات» as a pair is fine, worship terms alone
  stay out.
- **Bay'ah is not bay'**: the pledge of allegiance (بيعة) is a distinct
  event record kind; the sale family requires sale verbs/objects or the
  «البيع» noun so «بايعوا النبي» alone does not hit `bay`.
- **«ربا» growth senses**: «يربي»، «ربوة»، «الربا بمعنى الزيادة» outside
  transaction context stay out — the riba family requires transaction
  neighbourhood («يأكلون الربا»، «آكل الربا»، «الربا» beside بيع/دين/فضل/أكل)
  or the definite «الربا»; ambiguous growth uses are verified absent.
- **Legal theory and penal law**: usul al-fiqh, hudud punishments and the
  hisab ledger have their own browsers (hudud, hisab, islamiceconomy);
  this browser detects the mu'amalat contract terms, not the legal
  apparatus around them.
- **Ambiguous short forms** are intentionally conservative: «أجر» hits only
  with hire senses («الأجير»، «استأجر»، «أجرة»), never as bare reward;
  «قسم» hits only as يمين/حلف, never as portion; «عدل» hits as
  justice/ميزان/قسط, never as equivalence. Missed edge cases are added to
  the detector in waves, never by hand-tagging passages.
- **Seerah depth**: the seerah section fills as seerah passages are
  harvested; Companion/Tabi'in anecdotes grow the sunnah/books sections
  with every harvest.
- Human read of all draft records is the only blocker to calling the
  feature finished for readers; everything else is mechanical.
