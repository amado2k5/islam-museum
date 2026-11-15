# 49 · Halal and Haram Browser — requirements and production checklist

_The feature requirements for «متصفح الحلال والحرام في الإسلام» (the Halal and
Haram Browser — every mention of the lawful and the unlawful in the Qur'an,
the Sunnah, the seerah, Companion and Tabi'i reports and every harvested
book), as requested by the founder on 14 November 2026 and delivered in
`docs/plan/58-halal-haram-browser.md`. Written so any person or AI agent can
validate each requirement against production (`https://islam.museum`,
`https://api.islam.museum`) without reading the plan. Every requirement has
an id (`HH-R..`), a "how to check" line, and the artifact that proves it._

## 0. The original request (verbatim)

> "Use microsd instead of Mac main drive. get latest from main, clone the
> repo to a separate folder then start working on متصفح الحلال والحرام في
> الاسلام where it should list all the mentioned and written الحلال والحرام
> في الاسلام that are in quran, see rah, sunna, tabi3een stories , quotes ,
> mentioned and written in books that were harvested and any future
> harvested book if it has a الحلال والحرام في الاسلام should be viewable
> here. add a box for it on landing page and in navigation menus. make sure
> this is done end to end and full detailed proses and make it ready for
> production at the end of this. this is only about الحلال والحرام في
> الاسلام and everything mentioned about الحلال والحرام في الاسلام anywhere
> in any of the sunni books or quran or sunna or sera. find all the
> instances where الحلال والحرام في الاسلام Were mentioned or part of quotes
> from quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and add
> those stories, mentions, quotes, details. also add this in engineering
> documents as the original requirements to allow AI later on to test and
> validate it when it is in production. you can use mac browser to browse to
> any web page, to get any information or download any books, you can use
> mac apple vision to OCR and then harvest those OCRd books or you can find
> any other online website that you can decide whether or not can be
> authentic and trusted as a source and get from it information to fully
> enrich and fill detailed proses. when context is tight, just commit and
> push and continue. do not wait for build/test or ci. in the end commit,
> push, raise PR and merge it. Then delete all the files and folder related
> to this work from the microsd"

Scope note: «الحلال والحرام» is the one theme the founder named — what the
sources say God made lawful and what He made unlawful, in food, drink,
dress, marriage, earnings and conduct, with the principles around the two
words (who may declare lawful and unlawful, the doubtful matters between
them, necessity, scruple, seeking the lawful). It is not a fatwa browser:
the museum describes and attributes and issues no ruling. The fixed
penalties and the major sins belong to the Hudud Browser, the sins theme to
the Sayyi'at Browser, and trade and money to the Islamic Economy Browser.

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| HH-R01 | No new class or side table: every browser record is an ordinary graph node — passages detected at build time, curated records tagged `halal-haram-browser` (+ optional `halal-haram-<section>`) | `grep -rl "halal-haram-browser" data/` — hits under `data/concept/` and the ten pinned `data/passage/` records only; `scripts/lib.ts` `CLASSES` unchanged |
| HH-R02 | Five sections derived from the corpus, not a topic list: `quran` · `sunnah` · `seerah` · `books` · `curated` | `HALAL_SECTIONS` in `scripts/halal.ts`; `site/src/lib/halal.ts` |
| HH-R03 | **Automatic inclusion of future harvested books**: a halal or haram mention in any book enters the browser the day its passage record lands — detection is a build-time function of the compiled graph, never a hand-kept list | the fixture `passage/futurefiqh-halal-1` in `scripts/features-api.test.ts` («وكل مسكر حرام عند الجمهور», an unknown work) appears in `halal.json`; or add any passage with «حرام» to a new work, run `npm run graph && npx tsx scripts/export-api.ts`, and find it in `halal.json` |
| HH-R04 | Detection is over passage-owned text only (`text_search`, `text` fallback) — never labels or summaries | `halalTextOf` in `scripts/halal.ts` |
| HH-R05 | Arabic diacritics and tatweel are stripped before matching; patterns are bounded tokens tolerating clitic prefixes and pronoun suffixes | the fully vocalised `passage/quran-5-3` and `passage/quran-16-116` are detected |
| HH-R06 | Strong signals: «حلال»، «حرام» (nouns, all forms); the permitting verb with its doer or beneficiary («أحل الله»، «أحل لكم»، «أحلت لي»، «يحل لهم»، «حل له»); the negated permission («لا يحل»، «لا تحل»، «لم يحل»، «لا تحلوا»); «استحل» family; the forbidding verb with its doer or object («حرم الله»، «حرم ربي»، «الله حرم»، «من حرم»، «حرمت عليكم»، «حرم عليهم»، «حرمه رسول الله»); «حرمنا/حرموا/يحرمون» forms; «تحريم»؛ «المحرمات»، «محارم الله»، «محارمه» | `STRONG` in `scripts/halal.ts`; each of `quran-2-173`, `quran-5-5`, `quran-7-157`, `quran-9-29`, `quran-10-59`, `quran-66-1` is in `halal.json` |
| HH-R07 | Weak signals — bare «أحل/يحل»، bare «حرم/يحرم/محرم»، «الطيبات»، «الخبائث»، «الشبهات/المشتبهات»، «مباح/إباحة»، «مكروه/كراهة»، «رخصة» — count ONLY beside a strong signal. One pair rule: a bare permitting verb (or «مباح») and a bare forbidding verb in the same passage admit it | `WEAK` + `halalSignalsOfText`; fixture `passage/tabari-9-37x` («يحلونه عاما ويحرمونه عاما») is detected with kind `both`; fixture `passage/muslim-2592x` («من يحرم الرفق يحرم الخير») is NOT |
| HH-R08 | Out-of-scope senses are blanked before matching: the sanctuary and sacred-time names («المسجد الحرام»، «البيت الحرام»، «بيت الله الحرام»، «الشهر الحرام»، «المشعر الحرام»، «البلد الحرام»، «الأشهر الحرم»); the personal name Haram («أم حرام»، «حرام بن ملحان»); the state of ihram and leaving it («وهو محرم»، «وهو حلال»، «لا يحل حتى يطوف»); the reward wordings («حرمه الله على النار»، «حلت له شفاعتي»); «تحريمها التكبير»؛ untying and alighting («لا يحل وكاء»، «يحل عليه غضبي»); deprivation («من حرم خيرها فقد حرم»، «يحرم الرفق») | `OUT_OF_SCOPE` in `scripts/halal.ts`; fixtures `quran-17-1x`, `bukhari-2788x`, `abudawud-1837x`, `muslim-29x`, `quran-9-56x`, `abudawud-3732x` are NOT in `halal.json` (`npm test`) |
| HH-R09 | `halal_kind`: `halal` when only lawful-side signals fired, `haram` when only unlawful-side signals fired, `both` when the passage names the two (or only the doubtful matters beside them); «لا يحل» counts on the unlawful side, and the lawful side is read again with the negated permission blanked | `halalKindOf`; `quran-5-5` → `halal`, `quran-5-3` → `haram`, `quran-16-116` → `both` |
| HH-R10 | Corpus sections by the work: `work/quran` → `quran`; genre `sira` → `seerah`; genre `hadith` or a hadith-unit passage → `sunnah`; everything else → `books` | `halalCorpusOf` |
| HH-R11 | The umbrella record is the existing `concept/halal-haram` (reused, not duplicated), tagged in place; harvested passages carry `mentions → concept/halal-haram` | `data/concept/halal-haram.yaml` `tags`; `grep -c "target: concept/halal-haram" data/passage/*.yaml` |

## 2. Content

| Id | Requirement | How to check |
|---|---|---|
| HH-R20 | **Qur'an**: every ayah of permission and prohibition is listed from the frozen Tanzil records (no verse typed anywhere) | `halal.json` items with `section: "quran"`: 57 at merge, among them 2:168, 2:173, 2:187, 2:275, 3:50, 3:93, 4:23, 4:24, 4:160, 5:1–5, 5:87–88, 5:96, 6:119, 6:138–151, 7:32–33, 7:157, 9:29, 9:37, 10:59, 16:114–118, 22:30, 33:50, 33:52, 60:10, 66:1 |
| HH-R21 | **Sunnah**: the hadith reports of the six collections and the Muwatta that name the lawful or the unlawful are harvested as passage records (matn excerpt of at most 55 words, honorifics left out, edition and number in provenance) | `scripts/harvest-halal-hadithapi.ts`; 880 records with `run: "halal-hadithapi-1"`; `halal.json` items with `section: "sunnah"`: 1,132 at merge |
| HH-R22 | **Seerah**: excerpts from Zad al-Ma'ad, Ibn Hisham's Sira, al-Waqidi's Maghazi, al-Rawd al-Unuf, Subul al-Huda and al-Bayhaqi's Dala'il | `halal.json` items with `section: "seerah"`: 132 at merge |
| HH-R23 | **Companions and Successors**: reports and stories from Hilyat al-Awliya', Sifat al-Safwa, Hayat al-Sahaba, Usd al-Ghaba, al-Isaba, al-Isti'ab, Ibn Sa'd's Tabaqat, the Zuhd books of Ahmad and Ibn al-Mubarak and the Musannafs of 'Abd al-Razzaq and Ibn Abi Shayba; plus ten pinned reports of scruple that do not use the two words (Abu Bakr and the soothsayer's earnings, 'Umar and the milk of the charity camels, the fallen date, al-Hasan and the date of the charity, the meat of unknown slaughter, the bahira and the sa'iba, «دع ما يريبك», and others) | `PINNED` in `scripts/harvest-halal-hadithapi.ts`; `passage/bukhari-api-3842`, `passage/muwatta-api-606`, `passage/bukhari-api-2055`, `passage/bukhari-api-1491` are in `halal.json` |
| HH-R24 | **Books**: excerpts from al-Mughni, the Mudawwana, Bidayat al-Mujtahid, Fiqh al-Sunna, the Kuwaiti Encyclopaedia of Fiqh, Jami' al-'Ulum wa-l-Hikam, the Ihya' and the Muwafaqat, each at most 40 words, cited to the work and the scan page | `scripts/harvest-halal-ocr.ts`; 808 records with `run: "halal-ocr-1"`; `halal.json` items with `section: "books"`: 519 at merge |
| HH-R25 | **Detailed prose**: eight new curated records with full prose in Arabic, English and Urdu — who may declare lawful and unlawful; the hadith «الحلال بيّن والحرام بيّن»; foods between the lawful and the unlawful; necessity; seeking the lawful; the scruple of the Prophet, the Companions and the Successors (stories); what the Jahiliyya forbade and permitted; the gradual revelation of the lawful and the unlawful | `content/{ar,en,ur}/concept/{haqq-al-tahlil-wal-tahrim,al-halal-bayyin-wal-haram-bayyin,al-atima-al-muharrama-wal-mubaha,idtirar-darura,talab-al-halal,wara-al-salaf-an-al-haram,tahrim-ahl-al-jahiliyya,tadarruj-al-tashri-fi-al-halal-wal-haram}.md` exist |
| HH-R26 | Existing records on the subject are reused and tagged in place, never duplicated | `halal.json` items with `section: "curated"`: 31 at merge, among them `concept/halal-haram`, `halal-lawful`, `ibaha`, `makruh`, `tayyib`, `wara`, `shubha-doubt`, `kasb`, `khamr`, `muskir`, `maysir`, `mayta`, `dam-fiqh`, `khinzir-fiqh`, `dhabaih-fiqh`, `silk-rulings`, `riba`, `riba-fiqh`, `al-rishwa`, `bay-al-muharramat`, `mahram`, `rada`, `nikah-munhi-anhu` |
| HH-R27 | Qur'an text is never typed: prose links verses as `[[passage/quran-<sura>-<aya>\|label]]`; an OCR window that shares four consecutive words with a verse, or carries a quotation marker or Uthmani letters, is not harvested | `QURAN_4GRAMS` in `scripts/harvest-halal-ocr.ts`; validator (no ﴿ ﴾) |
| HH-R28 | Voice: describe and attribute, no rulings; where jurists differ each view is given with its holder; no honorifics typed; no content from or about blocked organisations | `npm run validate` (honorifics, extremism firewall); read the eight records |
| HH-R29 | Every record cites defined sources and carries a provenance block; all AI text is `status.review: draft` | `npm run validate` 0 errors |

## 3. The browser page `/{lang}/halal/`

| Id | Requirement | How to check |
|---|---|---|
| HH-R30 | Page exists in all three languages: `/ar/halal/`, `/en/halal/`, `/ur/halal/` (+ paged sub-pages per long section) | `curl -sI` each → 200 |
| HH-R31 | Localized title «متصفح الحلال والحرام» / "Halal and Haram Browser" / «حلال و حرام براؤزر» + lede + badge + method note + status count + kind labels | `i18n/{ar,en,ur}.yaml` `halal:` block; view each page |
| HH-R32 | Section chips with counts, each linking to its anchor; curated records lead, the four corpora follow; every populated section shows title + description + card grid; long sections are paged | `/ar/halal/` |
| HH-R33 | Every card links to the **ordinary entity page** (`/{lang}/passage/<slug>/` or `/{lang}/concept/<slug>/`), never a browser-only page | inspect card `href`s on `/en/halal/` |
| HH-R34 | Passage cards show work name + ref and a text excerpt; the kind chip (lawful / unlawful / both) shows on passage cards; concept cards show their summary | `/ar/halal/` |
| HH-R35 | Filter box narrows the cards on the page and, through the whole-list index, the rows of every page; Arabic vowel-insensitive; the full list is readable with JavaScript off | `site/src/scripts/halal-filter.ts`; `/ar/list-index/halal.json` exists; type «مسكر» |
| HH-R36 | **Signature view** "the balance of the lawful and the unlawful": a bar of passages by kind and two facing panels of the lexicon terms with counts per corpus, drawn at build time from the detector, readable without JavaScript, every count a link to its section; the build throws if the detector yields a term the view has no label for | `site/src/components/sig/HalalScale.astro`; `docs/site/signature-views.md` |
| HH-R37 | Pagefind: title/lede/headings inside `data-pagefind-body`; card lists inside `data-pagefind-ignore`; WCAG 2.2 AA, RTL on ar/ur | page source; visual check |
| HH-R38 | **Landing card** on the homepage (two circles, a tick and a bar, either side of a dividing line) and **Explore menu** entry under "conduct", in all three languages | homepage shows the card; `nav.ts` `{ key: "halal", ready: true }`; header Explore menu lists it |

## 4. API and documentation

| Id | Requirement | How to check |
|---|---|---|
| HH-R40 | `https://api.islam.museum/api/v1/halal.json` returns every detected + tagged record with `section`, `halal_kind`, `signals`, `work`, `ref`, `unit`, `text`, `sura`, `aya`, `kind`, `themes`, `tags` and edges | `curl -s .../halal.json \| jq '.items \| length'` ≥ 1871; `feature: "halal-haram-browser"`; `section` ∈ {quran,sunnah,seerah,books,curated}; `halal_kind` ∈ {halal,haram,both,null} |
| HH-R41 | Endpoint documented in `docs/data/README.md`, `site/public/openapi/v1.json` (`/halal.json` path) and `llms.txt` | all three rows exist |
| HH-R42 | Registered in `docs/site/browsers.md` (feature + export rows), `docs/site/signature-views.md`, `docs/plan/00-README.md` (plan 58), `docs/plan/06-roadmap.md`, `docs/agents/lanes.md` (`halal` lane), `docs/agents/lanes/halal.md`, `docs/status.md`, `CANARY.md`, this file | all rows present |
| HH-R43 | `features-api.test.ts` asserts `halal.json` in the export set and its detection, classification and exclusion rules | `npm test` green |

## 5. Governance and delivery

| Id | Requirement | How to check |
|---|---|---|
| HH-R50 | Gates: `npm run validate` 0 errors, `npm test` all pass | run them |
| HH-R51 | Work done in a separate clone on the microSD, shipped through one pull request with its canary entry; nothing pushed directly to `main`; the work folder deleted from the microSD after the merge | the merged pull request; `/Volumes/exmicroSD/halal-haram-browser-work` absent |
| HH-R52 | **Full trilingual coverage**: every new record carries `label`/`summary`/prose in ar, en and ur; UI strings in all three `i18n` files in the same commit | HH-R25 files; `halal:` blocks |
| HH-R53 | Draft gate: all new records enter as `status.review: draft` with `provenance`; tagged-in-place records keep their existing review status | the YAML files |
| HH-R54 | Harvest discipline: no PDF, OCR text or page image in git; only existing OCR text on the harvest drive was read (no new download, no new OCR); the reads are claimed in the drive's `WORK-REGISTRY.md` and recorded in the lane file | `docs/agents/lanes/halal.md` |
| HH-R55 | Judgment calls recorded for the founder's audit | `docs/decisions/inbox/halal-haram-browser-scope-and-harvest.yaml` |
| HH-R56 | Deploy readiness: nothing is live until the founder deploys; on deploy the card, the menu entry, the pages and the API appear together | post-deploy check HH-R30/R38/R40 |

## 5a. Browsing by subject (added 14 November 2026)

The founder asked whether a visitor who wants to know which foods are unlawful, or whether an
act is lawful, would be helped by the browser and find it easy to use, and approved adding
subjects ("Yes, add subjects").

| ID | Requirement | How to test |
|---|---|---|
| HH-R57 | Every record carries one or more subjects from a fixed list of twelve: principles, food, drink, hunting-slaughter, earnings, marriage-family, dress, life-honour, conduct, worship, sanctuary, other | `subjects` in `/api/v1/halal.json` is a non-empty array of those ids on every item |
| HH-R58 | A passage's subjects are read from its own text at build time by `SUBJECT_RE` in `scripts/halal.ts`; no per-passage tagging; a book harvested later gets its subjects the day it lands | the `features-api` test (the future-book case); no `halal-subject-` tag on any passage record |
| HH-R59 | A curated record's subjects come from `halal-subject-<id>` tags in the graph | `grep -l halal-subject- data/concept/*.yaml` |
| HH-R60 | The landing shows the board of subjects above the method note: one tile per subject with a drawing, a record count and a bar of lawful / both / unlawful; each tile links to the subject's page | open `/{lang}/halal/`; twelve tiles, each a link to `/{lang}/halal/subject/<id>/` |
| HH-R61 | A subject page lists answers first: the museum's records, then the Qur'an in mushaf order, then Sunnah, seerah and other books; 75 rows a page, each page a real URL readable without JavaScript | open `/{lang}/halal/subject/food/` and `/2/`; first rows are the curated records, then ayahs from al-Baqara onward |
| HH-R62 | Each card shows its other subjects as links | a card on the food page for the report on selling wine, carrion and swine links to Drink and to Earnings and trade |
| HH-R63 | The board and every subject page say that the museum shows what the sources say and does not issue rulings | the text of `halal.subjects_ui.note` is on the page in all three languages |
| HH-R64 | The subject is a description of what the source speaks about, never a ruling, and the page says how it is assigned and that the word list can miss or over-include | `halal.subjects_ui.how` on every subject page |
| HH-R65 | Subject pages are searchable by title and description; all strings in ar, en and ur | Pagefind result for «الأطعمة»; `halal.subjects` in the three `i18n` files |
| HH-R66 | Qur'an 2:219, 5:90 and 5:91 are in the browser by their `halal-haram-browser` tag, under Drink, with no kind and no matched term; their text is unchanged | `/api/v1/halal.json` has the three ids with `section: quran`, `halal_kind: null`, `signals: []`, `subjects` containing `drink`; `git diff` of the three files shows the `tags` line only |

## 6. Explicitly out of scope / known limits

- **Not a fatwa or ruling**: the browser lists what the sources say and who
  says it; it prescribes nothing.
- **Sanctuary senses stay out by design**: the Sacred Mosque, the sacred
  months, and ihram. Reports that declare Makka or Madina inviolable with the
  forbidding verb («إن مكة حرمها الله»، «المدينة حرام ما بين عير إلى ثور»)
  are kept: they are rulings in the two words.
- **Residual ihram and idiom noise**: «حل له كل شيء إلا النساء» is kept as a
  ruling; a few reports where «أحلّ» means "left ihram" may remain. Missed or
  wrong cases are fixed in the detector or `HALAL_EXCLUDE`, never by
  hand-tagging lists.
- **Qur'an quotations inside hadith**: hadith-api reports that quote a verse
  keep the edition's own wording, as the earlier hadith-api harvests do.
- **OCR excerpts are uncorrected** machine readings of scans; page numbers
  are scan pages. Tafsir books were left out of the OCR harvest because their
  pages quote the Qur'an throughout; their existing passages are still
  detected.
- **Book caps**: the OCR harvest keeps the densest pages of each book up to a
  cap (20–60 per book); the remaining candidate pages are listed by count in
  the lane file and can be harvested by raising the cap.
- Human read of all draft records is the only blocker to calling the
  feature finished for readers; everything else is mechanical.
