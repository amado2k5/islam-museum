# 17 · الرحيق المختوم — mining one book into the Prophetic-era spine

**The book.** *الرحيق المختوم: بحث في السيرة النبوية* by صفي الرحمن المباركفوري (1943–2006), first prize of the Muslim World League's sira competition (1399 AH / 1979), the most widely read modern Arabic sira. It is a Sunni work built on the classical sources (Ibn Hisham, Ibn Sa'd, al-Tabari, Ibn al-Qayyim's *Zad al-Ma'ad*, al-Bukhari, Muslim, al-Waqidi where noted) and cites them in footnotes on nearly every page. That makes it the ideal **spine source for the Prophetic era**: one coherent narrative, chronologically ordered, with page-level pointers to the primary sources the museum must cite.

**The copy.** `~/islam-museum-harvest/raw/books/raheeq-makhtum/`: a 512-page image-only PDF (Noor-Book scan), fully OCR'd with Apple Vision on the Mac (320 seconds, about 770,000 characters). PDF page numbers equal printed page numbers. `toc.txt` holds the table of contents (pp. 495–512), `bib.txt` the bibliography (pp. 489–494), `book.txt` the whole text with `===== [pN] =====` markers, `pages.json` the same per page, `pages-png/` the page images for re-reading doubtful passages.

## 1. Rights and how the book may be used

The book is a copyrighted modern work. The museum uses it the way a scholar does:

- **Facts, chronology, names, places, numbers, structure**: freely, with a citation to the book page **and** to the classical source the book's footnote names (e.g. `{cite:mubarakpuri-raheeq p.60}` plus `{cite:ibn-hisham 1/135}`).
- **Quotations**: at most 40 words, verbatim, in quotation marks, with page; prefer quoting the classical source the book quotes rather than the author's own prose.
- **Never**: republishing its text, paraphrasing it chapter by chapter into museum prose, or storing the OCR text in the repository. The OCR stays in the harvest workspace under the `copyrighted-reference` layer (15 §3).
- **Status of claims**: the book narrates the tradition; facts drawn from it are `status: tradition` unless an academic source upgrades them to `historical` or marks them `debated`. Where the author argues a position (dates, routes, numbers), the museum records it as his view with the page.
- **Scope fit**: the book is squarely within the Sunni frame (`docs/scope.md`). Where it touches contested matters (Banu Qurayza, the succession passages at the death of the Prophet, the role of particular Companions), the perspectives block is still required.

A `source` entity `source/mubarakpuri-raheeq` records the edition; each classical work in the bibliography (pp. 489–494, about 60 titles) becomes its own `source` entity so citations resolve.

## 2. What the book yields (by museum class)

| Class | Expected count | Where in the book |
|---|---|---|
| `period` | 3 refinements | Pre-Islamic Arabia (pp. 15–47), Meccan period (54–174), Medinan period (175–471); plus the author's three stages of the da'wa (75, 78, 125) and the two Medinan phases (349, 412) as `has_part` sub-periods |
| `event` | 220–260 | every heading from p. 54 to p. 471 that names a dated happening: births, marriages, revelations, persecutions, migrations, pledges, the Hijra, every ghazwa and sariya (about 70), treaties, letters, delegations, the Farewell Pilgrimage, the final illness and death; plus sub-events of the great battles (Badr pp. 204–233 alone has about 30 headings) as `has_part` children |
| `journey` | 8 | Hijra (161–174, leg by leg: the house, the cave of Thawr, the coastal road, Quba, Medina); the march to Badr (205–212); the Uhud approach; the Hudaybiyya march (337–339); the road to Khaybar (365–366); the march on Mecca (399–403); Hunayn and Ta'if (413–422); Tabuk (433–436) |
| `place` | 90–110 | Mecca, Medina/Yathrib, Ta'if, Quba, Hira, Thawr, Badr, Uhud and عينين, the Trench, Hamra' al-Asd, al-Raji', Bi'r Ma'una, Dumat al-Jandal, al-Kudr, Buhran, Dhu Amarr, al-Muraysi', al-Hudaybiyya, Dhu Qarad, Khaybar and its forts (ناعم، الصعب بن معاذ، الزبير، أُبي، النزار), Fadak, Wadi al-Qura, Tayma, Mu'ta, Ma'an, Marr al-Zahran, Dhu Tuwa, Hunayn, Awtas, al-Ji'rana, Tabuk, al-Abwa, al-Aqiq, Dhat al-Salasil, Khadira; the Yemen, al-Hira, al-Sham, Abyssinia, Egypt, Persia, Byzantium, al-Yamama, Oman, Bahrain as regions |
| `building` | 10 | the Kaaba (and its rebuilding, p. 61), the Prophet's Mosque (184), Masjid Quba (170), Dar al-Arqam (91), Dar al-Nadwa (158), Jabal al-Safa (79), the Khaybar forts, the Prophet's house and the burial chamber (471) |
| `person` | 350–450 | the family (48–53, 473–478: ancestors, Abd al-Muttalib, Abu Talib, Amina, Halima, the wives, the children), the first believers (75), the twelve naqibs (151–152), commanders and martyrs of each battle, the Quraysh leadership (Abu Jahl, Abu Sufyan, Hind, Umayya, Ubayy ibn Khalaf, al-Walid, al-'As ibn Wa'il), Jewish leaders (Ka'b ibn al-Ashraf, Huyayy, Sallam ibn Abi al-Huqayq), the hypocrites (Abdullah ibn Ubayy), the kings addressed (the Negus, al-Muqawqis, Khosrow, Heraclius, al-Mundhir ibn Sawa, Hawdha ibn Ali, al-Harith ibn Abi Shimr, Jayfar and Abd of Oman), Bahira, Waraqa, the delegations' leaders (445–454), the Companions at the deathbed |
| `group` | 50–60 | Quraysh and its clans (Hashim, Abd al-Dar, Makhzum, Jumah, Sahm, Adi, Umayya, Zuhra, Taym), Banu Sa'd, Aws and Khazraj, Muhajirun and Ansar, the hypocrites, the Jewish tribes (Qaynuqa, Nadir, Qurayza), Banu Sulaym, Hawazin, Thaqif, Banu al-Mustaliq, Banu Lihyan, Banu Bakr, Khuza'a, Ghassan, Ghatafan, the Ahzab coalition, the Ash'aris, the tribes offered Islam (130), the delegations (445) |
| `polity` | 10 | the kingdoms of Yemen, al-Hira (Lakhmids), al-Sham (Ghassanids), the emirate of the Hijaz, Byzantium, Sasanian Persia, Abyssinia (Aksum), Egypt under al-Muqawqis, al-Yamama, Oman (pp. 23–34, 350–361) |
| `concept` | 40–50 | wahy and its kinds (70), stages of the da'wa (74), secret and public preaching, hijra, mu'akhat (185), the Constitution (186), the permission to fight (196), ghazwa vs sariya, bay'a, shura (the councils at Badr, Uhud, Mu'ta), hudna and treaty terms (342), ghanima division (374, 419), the zakat collectors (424), the poisoned sheep (376), the slander (331), hypocrisy, hilf al-fudul (59), harb al-fijar (59), the pre-Islamic religious, political, social and economic conditions (23–47) |
| `practice` | 12 | the earliest salah (76), the adhan on the Kaaba (405), umrat al-qada (384), the hajj of Abu Bakr (440), the Farewell Pilgrimage rites (458), nahr and halq (343), the prayer of thanksgiving (406), funeral rites at the death (471), the mu'akhat as a social practice |
| `work` | 15 | the Constitution of Medina (186–193), the Hudaybiyya treaty text (342), the eight letters to kings (350–361) as `work kind: letter`, the Farewell Sermon (458), the pledges' terms (149), the book itself, and the classical works in the bibliography as `source` |
| `passage` edges | 60–80 | every "القرآن يتحدث حول موضوع …" section (231, 288, 438 and the many in-text citations) becomes `revealed_about` edges from the Qur'an passages already in the repo to the event |
| `object` | 6 | the key of the Kaaba (405), the banners (اللواء/الراية) by battle, the Prophet's seal on the letters (350), the Black Stone arbitration cloth (61), the spoils categories |
| `dataset` | 3 | army sizes and casualties per battle (the book gives both for each ghazwa: "قتلى الفريقين"), the list of ghazawat and saraya with dates (441), the delegations with dates (445–454) |
| `question` | 30 | drawn from the narrative: why the Hijra, what the Constitution of Medina was, what happened at Badr and why it matters, what the treaty of Hudaybiyya achieved, how Mecca was taken without a massacre, what the Farewell Sermon said |
| `exhibit` | 2 | "حياة النبي" as a 12-room tour following the book's own three-stage structure; "الغزوات" as a map-led exhibition |
| `map` blocks | 25 | every battle and siege with positions the book describes (Badr: the wells and the two camps, 211–215; Uhud: the mountain, the archers' hill, the valley, 253–264; the Trench; Khaybar's forts in order of capture; Hunayn and Awtas; Ta'if; the approaches to Mecca by four columns, 403) |

The totals, roughly 1,000 entities and 3,000 relations, are most of the Phase 1 spine for the Prophetic era in one pass.

## 3. The chapter map

The book's sections (from `toc.txt`, pages in parentheses) and what each becomes:

| Section | Pages | Becomes |
|---|---|---|
| موقع العرب وأقوامها | 15–22 | `concept/arab-peoples-before-islam`, `group` entries for العرب البائدة، العاربة، المستعربة; `place` regions |
| الحكم والإمارات في العرب | 23–34 | `polity` ×5, `concept/pre-islamic-political-condition` |
| ديانات العرب / الحالة الدينية | 35–42 | `concept` entries for pre-Islamic religion (idolatry, hanifiyya, Judaism and Christianity in Arabia), `group`s |
| صور من المجتمع العربي الجاهلي | 43–47 | `concept`s: social, economic, moral conditions; feeds the `theme` hubs (14) |
| نسب النبي وأسرته | 48–53 | `person` lineage (Adnan to Abd al-Muttalib), `group/banu-hashim`, family edges |
| المولد وأربعون عاماً قبل النبوة | 54–64 | 13 `event`s (birth, Banu Sa'd, death of Amina, Abd al-Muttalib, Abu Talib, Bahira, Fijar, Hilf al-Fudul, work, marriage to Khadija, the Kaaba rebuilding), `person`s (Halima, Bahira, Khadija, Maysara) |
| في ظلال النبوة والرسالة | 65–74 | `event/first-revelation`, `event/pause-of-revelation`, `concept/wahy` with its kinds, `building/hira` |
| المرحلة الأولى: الدعوة السرية | 75–77 | `event`s, `group/the-first-believers` with every name, `practice/early-salah` |
| المرحلة الثانية: الدعوة جهاراً | 78–108 | ~25 `event`s (al-Safa, the delegations to Abu Talib, persecutions as individual events with named victims, Dar al-Arqam, the first Abyssinian migration, Quraysh's plot there, the conversions of Hamza and Umar), `journey/first-migration-to-abyssinia` |
| المقاطعة العامة | 109–114 | `event/boycott-of-banu-hashim` with sub-events |
| عام الحزن | 115–124 | `event`s (deaths of Abu Talib and Khadija, marriage to Sawda), `concept/patience-and-steadfastness` |
| المرحلة الثالثة: خارج مكة | 125–142 | Ta'if, the tribes offered Islam (each a `group`), the believers from outside Mecca (`person`s), the marriage to Aisha, Isra and Mi'raj (`status: tradition`, `figure policy: none`) |
| بيعة العقبة الأولى والثانية | 143–154 | `event`s, the terms as `work`, the twelve naqibs as `person`s with `group/naqibs` |
| طلائع الهجرة / دار الندوة | 155–160 | `event`s, `building/dar-al-nadwa` |
| هجرة النبي | 161–174 | `event/hijra` with 8 sub-events and `journey/hijra-route` with legs and a map |
| الحياة في المدينة | 175–193 | `event`s (the mosque, the brotherhood, the Constitution, the treaty with the Jews), `work/constitution-of-medina`, `concept`s |
| الكفاح الدامي / الغزوات قبل بدر | 194–203 | `event`s for each early sariya with dates and commanders |
| غزوة بدر | 204–233 | `event/battle-of-badr` with ~30 children, `map` block, `dataset` row, `passage` edges (231) |
| بين بدر وأحد | 233–247 | 8 `event`s (Banu Qaynuqa with its own sub-events, al-Sawiq, Ka'b ibn al-Ashraf, Buhran, Zayd's sariya) |
| غزوة أحد | 248–289 | `event/battle-of-uhud` with ~40 children, `map`, `dataset`, `passage` edges (288), Hamra' al-Asd |
| بين أحد والأحزاب | 290–300 | 9 `event`s including al-Raji', Bi'r Ma'una, Banu al-Nadir, Badr al-Thaniya, Dumat al-Jandal |
| غزوة الأحزاب / بنو قريظة | 301–324 | two major `event`s with children; Banu Qurayza carries a perspectives block and Tier A review |
| بنو المصطلق / حديث الإفك | 325–336 | `event`s, `concept/hypocrisy`, `event/the-slander` (sensitivity: contested; Aisha's page) |
| الحديبية | 337–348 | `event` with 15 children, `journey`, `work/treaty-of-hudaybiyya`, `concept/treaty-terms` |
| مكاتبة الملوك | 349–361 | 8 `work kind: letter` + 8 `event`s + 8 `person` kings + `polity` edges |
| خيبر ووادي القرى | 362–379 | `event` with fort-by-fort children, `place`s for each fort, `event/the-poisoned-sheep`, Fadak, Wadi al-Qura, Tayma |
| السنة السابعة / عمرة القضاء / مؤتة | 380–393 | `event`s; Mu'ta with its council at Ma'an and the succession of commanders |
| فتح مكة | 394–411 | `event` with ~25 children, `map` of the four columns, `object/key-of-the-kaaba`, `practice/adhan-on-the-kaaba` |
| حنين والطائف | 412–423 | `event`s with `map`s, the division at al-Ji'rana, the Hawazin delegation |
| البعوث بعد الفتح / تبوك | 424–439 | `event`s, `concept/zakat-collectors`, Tabuk with the "مخلفون" |
| حج أبي بكر / الوفود | 440–457 | `event`s, each delegation a `group` with date and leader |
| حجة الوداع | 458–463 | `event`, `work/farewell-sermon`, `practice` rites, the last expeditions |
| إلى الرفيق الأعلى | 464–472 | day-by-day `event`s of the final illness, the death, the reactions of Umar and Abu Bakr (perspectives), the burial |
| البيت النبوي | 473–478 | `person`s for every wife and child with marriage and death edges |
| الصفات والأخلاق | 479–488 | `concept/the-prophets-character`, `exhibit` material, `question`s |
| ثبت المراجع | 489–494 | ~60 `source` entities |

## 4. The pipeline for this book

1. **OCR** (done): `ocr_apple_vision.py` in the workspace; re-run only if a better scan appears.
2. **Clean**: strip running footers (`- ٦٠ -`), normalise Arabic-Indic digits, mark footnote lines `(١) …` and link them to the in-text markers, and repair the honorific ligature ﷺ, which the OCR renders as `علله`, `علا`, `عليل`, `عل`, `عليا` after `رسول الله` / `النبي` — replace with a `{saw}` marker for the data layer, never typed into prose.
3. **Segment** by the table of contents into about 400 sections `{title, page_start, page_end, text, footnotes[]}` → `sections.json` (local).
4. **Extract**, section by section, with the drilling prompt (§6): claims with page and quote, dates as the book gives them (Hijri month and year, Gregorian where the book adds it), places, participants with roles, sides, numbers, the classical source each footnote names, and the Qur'an passages cited.
5. **Judge** (09 §4): second model checks entailment of each claim against the quoted text and page image; flags single-source dates for a second classical source (Ibn Hisham, Ibn Sa'd, al-Tabari via OpenITI).
6. **Draft** Arabic entities and prose (`content/ar/`) in the docent voice, never the author's voice; link with `[[…]]`; create stubs; add `map` blocks where the text describes positions; add `perspectives` where required.
7. **Validate, PR, review**: batches of 25 entities following the book's order; Tier A for the contested sections listed above.

## 5. Order of work

Badr first (the richest chapter and the one with a map), then the Hijra journey, then the Meccan period from p. 54, then the rest of the Medinan period in order, then the pre-Islamic chapters, then the family and character chapters. Each batch is one pull request.

## 6. The drilling prompt (for another session, any capable model)

Copy the block below verbatim into a new session. It assumes the OCR files in `~/islam-museum-harvest/raw/books/raheeq-makhtum/` and the repo at `~/Documents/GitHub/islam-museum`.

```
You are mining the Arabic book «الرحيق المختوم» by صفي الرحمن المباركفوري into the islam.museum knowledge graph. Read docs/plan/17-raheeq-makhtum.md, docs/scope.md, docs/language.md, docs/plan/02-content-model.md, docs/plan/05-editorial.md and CLAUDE.md before writing anything.

INPUTS
- OCR text: ~/islam-museum-harvest/raw/books/raheeq-makhtum/book.txt (markers "===== [pN] =====", PDF page = printed page), pages.json (same per page), toc.txt (table of contents, pp. 495–512), bib.txt (bibliography, pp. 489–494), pages-png/pNNN.png (page images; look at the image whenever the OCR is doubtful).
- Repo: ~/Documents/GitHub/islam-museum (schema/, data/, content/, templates/, scripts/validate.ts). Existing entities include 25 Prophetic-era events, period/prophetic-era, place/mecca, place/medina, person/muhammad and others; reuse their IDs, never duplicate.

RULES
1. Arabic first: every label.ar, summary.ar, names[], alt and all prose in content/ar/. Do not write English prose; label.en is optional and may be left out.
2. The book is a copyrighted modern work: extract facts, chronology, names, numbers, places and the classical citations in its footnotes; quote at most 40 words verbatim per quotation; never paraphrase chapters into museum prose; never store its text in the repo. Every fact cites the book page {cite:mubarakpuri-raheeq p.N} AND the classical source the footnote names, e.g. {cite:ibn-hisham 1/135}. Create data/source/*.yaml for the book (source/mubarakpuri-raheeq) and for each classical work in bib.txt as you first need it.
3. Scope: Sunni Islam is the default frame; the book is Sunni. Where a section touches a contested matter (بنو قريظة، وفاة النبي وموقف الصحابة، حديث الإفك، أدوار أشخاص بعينهم) add a perspectives[] block: the Sunni account first, then the academic/historical view, then any other labelled view the topic needs, each cited.
4. Status of claims from the book: tradition. Mark the author's own reconstructions (dates, routes, numbers) as his view with the page; mark disagreements he reports as debated.
5. Dates: record the Hijri date exactly as the book gives it (hijri: "0002-09-17"), the Gregorian only if the book gives it or a cited source does, calendar: julian, precision as given, and a note with the source. Never invent a day.
6. Honorifics: the OCR renders ﷺ as علله / علا / عليل / عل / عليا after رسول الله or النبي; treat these as the honorific and never type honorifics into prose (the interface renders them from data).
7. Figures and images: no prompts, images or map features that depict the Prophet or Companions as figures; map blocks describe terrain, positions and movements only.
8. Everything you create is status.review: draft with provenance {generated_by, model, run, sources: [source/mubarakpuri-raheeq, …]}. Never mark reviewed.

PROCEDURE (per batch; one batch = one section range from toc.txt, at most 25 entities)
A. Load the section's pages from book.txt (and the page images if needed). List every heading in the range.
B. Build a claims table: [{claim, value, calendar, book_page, quote (≤40 words), footnote_source (as named in the footnote, with its locator), entity_type_hint}]. Include dates, places, participants and their roles, sides and commanders, numbers (army sizes, casualties, distances), outcomes, causes and consequences, Qur'an verses the book cites for the event, and letters/treaties/speeches as works.
C. For each entity the section needs, check data/ for an existing ID (search labels in Arabic and the ASCII slug). Reuse or create:
   - event: id event/<ascii-slug>, class, kind (battle|siege|expedition|treaty|migration|revelation|birth|death|marriage|conversion|delegation|speech|founding|persecution|council), label.ar, summary.ar, wings [time, people, place], periods [period/prophetic-era], regions [arabia], date {start{,end}}, relations (occurred_at, had_participant with role, part_of, caused_by/caused, revealed_about via passage/quran-S-A, has_part for sub-events), sides[] with participants and commanders, casualties and sizes as fields with sources, map block when the text describes positions (kind, precision: schematic, center from the place, extent_km, features with roles well/camp/march/advance/landmark and a source per feature), sources[], perspectives[] when rule 3 applies, status, provenance.
   - person: names[] (full Arabic name with nasab, kunya, laqab), gender, born/died if the book gives them, roles, traditions [sunni] only where documented (Companions: faith basis "tradition"), relations (member_of clan, child_of, spouse_of, participated_in with role, killed_at/died_in, student_of none here), sources.
   - place: label.ar, kind, coordinates ONLY from docs/plan/16 §6 or the place's Wikidata item (state which); historical_names; part_of; relations site_of.
   - group, polity, building, concept, practice, work (letters, treaties, sermons: structure, parties, date, terms as a list with page), journey (legs with from/to/date/mode and the page), object, dataset rows (CSV in datasets/ with a source column).
   - passage edges: for each Qur'an citation the book links to the event, add relation {type: revealed_about, target: passage/quran-<sura>-<aya>, status: tradition, sources}.
D. Write content/ar/<class>/<slug>.md from the claims table only, in the museum's docent voice (describe, do not preach; short sentences; define terms on first use; [[links]] on every entity mention; {cite:} after every factual sentence; "## موجز" first, then the class's conventional sections; ":::perspectives" where required; no honorifics; no quotation longer than 40 words).
E. Add unknown targets to data/_stubs.yaml with an Arabic label and class.
F. Run `npm run validate` and fix every error. Produce a batch report: entities created/updated, claims with page+quote, classical sources used, anything the book asserts without a footnote, contested points flagged, and OCR passages you had to verify on the image.
G. Commit on a branch named content/raheeq-<section-slug> and open a pull request titled "content(raheeq): <section title> pp. N–M"; do not merge.

BATCH ORDER
1. غزوة بدر الكبرى pp. 204–233 (with map and dataset) 2. هجرة النبي pp. 161–174 (journey with legs) 3. المولد وأربعون عاماً قبل النبوة pp. 54–64 4. في ظلال النبوة والرسالة + الدعوة السرية pp. 65–77 5. الدعوة جهاراً pp. 78–108 6. المقاطعة + عام الحزن pp. 109–124 7. خارج مكة + الإسراء pp. 125–142 8. بيعتا العقبة + دار الندوة pp. 143–160 9. الحياة في المدينة pp. 175–203 10. بين بدر وأحد pp. 233–247 11. غزوة أحد pp. 248–289 (map, dataset) 12. بين أحد والأحزاب pp. 290–300 13. الأحزاب وبنو قريظة pp. 301–324 (Tier A) 14. بنو المصطلق والإفك pp. 325–336 (Tier A) 15. الحديبية pp. 337–348 16. مكاتبة الملوك pp. 349–361 17. خيبر pp. 362–379 18. السنة السابعة ومؤتة pp. 380–393 19. فتح مكة pp. 394–411 (map) 20. حنين والطائف pp. 412–423 (maps) 21. البعوث وتبوك pp. 424–439 22. حج أبي بكر والوفود pp. 440–457 23. حجة الوداع والوفاة pp. 458–472 (Tier A) 24. البيت النبوي والصفات pp. 473–488 25. العرب قبل الإسلام pp. 15–47 26. النسب والأسرة pp. 48–53 27. ثبت المراجع pp. 489–494 (source entities for everything cited).

QUALITY BAR
- Every dated fact: book page + classical source, or confidence: low with a needs_source flag.
- Every entity: label.ar, summary.ar, ≥1 source, provenance, status draft.
- No prose sentence without a {cite:} if it states a fact; no quotation over 40 words; no honorific typed; no English prose.
- A reviewer must be able to open the page image and verify each claim in under a minute.
Start with batch 1 and show me the claims table before writing files.
```

## 7. Acceptance tests for the book pass

1. Batch 1 (Badr) yields one parent event, 25 or more sub-events, a map block with sourced features, a dataset row with sizes and casualties, `revealed_about` edges to the cited ayat, and no claim without a page.
2. Every `{cite:mubarakpuri-raheeq p.N}` has a matching page in `pages.json`, and every classical citation resolves to a `source` entity.
3. The honorific never appears as text in any `content/ar/` file.
4. The Hijra journey renders as a route with at least five legs on the map.
5. A reviewer verifies 20 random claims against the page images; at least 19 are exactly supported.
