# 73 · Rulings Browser — obligations, acts of obedience, recommended, disliked and forbidden acts, minor sins

_Requested by the founder on 20 November 2026 (the request is quoted in full in [`docs/engineering/64-ahkam-browser-requirements.md`](../engineering/64-ahkam-browser-requirements.md) section 0, which is also the production checklist). Built the same day by Claude Code (claude-fable-5-2), lane `ahkam`._

Public name: «متصفح الفروض والواجبات والطاعات والمستحبات والمكروهات والمحرمات وصغائر الذنوب» · Rulings Browser · route `/[lang]/ahkam/` · dataset `/api/v1/ahkam.json`.

## 1. What it is

One front door over the graph for the degrees of obligation the founder named: «الفروض، فروض العين، فروض الكفاية، الطاعات، الواجبات، المستحبات، المحرمات، المكروهات، صغائر الذنب وخلافه». It lists every place these are named in the Qur'an, the Sunnah, the seerah, the reports of the Companions and the Successors and the harvested books, and it has no data of its own: passages are found at build time, curated records join by tag. The museum's voice rule governs it: it describes what the texts and the jurists say and issues no ruling.

## 2. The ten themes

| Topic id | The founder's word | What is listed |
|---|---|---|
| `fard` | الفروض | «فريضة», «فرض الله», «فُرض على», «الفرض», «كُتب عليكم» |
| `fard-ayn` | فروض العين | the jurists' term; a duty laid «على كل مسلم», «على كل محتلم» |
| `fard-kifaya` | فروض الكفاية | the jurists' term and its rule («سقط عن الباقين»); 4:95 and 9:122 as al-Shafi'i reads them |
| `taat` | الطاعات | obedience to God and His Messenger and the acts of obedience |
| `wajib` | الواجبات | «واجب», «وجوب», «يجب على», «حق على كل مسلم» |
| `mustahabb` | المستحبات | «مستحب», «مندوب», «نافلة», «تطوع», «ليس بواجب», what was left unimposed |
| `haram` | المحرمات | the unlawful-side wording, read by the Halal browser's own lexicon |
| `makruh` | المكروهات | «مكروه», «الكراهة», «كان يكره», «إن الله كره لكم», a prohibition «لم يُعزم» |
| `saghair` | صغائر الذنب | «الصغائر», «اللمم», «محقرات الذنوب», what is expiated when the major sins are avoided |
| `mubah` | وخلافه | what remains of the scale: «مباح», «رخصة», «لا جناح», «لا حرج», «فهو عفو» |

Decision recorded in `docs/decisions/inbox/ahkam-browser-scope-and-harvest.yaml`: «وخلافه» is read as the fifth ruling and the concession, so the browser shows the whole scale; the major sins stay in the Hudud and Kaba'ir Browser.

## 3. Detection (`scripts/ahkam.ts`)

- **Qur'an: a reviewed table only** (`AHKAM_QURAN`, 157 rows over 130 verses). Each verse was read against its frozen Tanzil text; the table names the verses whose own wording carries a theme. `fard-ayn` has no verse, because the Qur'an does not use the term. The two `fard-kifaya` verses are the ones al-Shafi'i draws the communal obligation from (al-Risala, paragraphs 981–990, scan pages 478–481).
- **Everything else: a guarded lexicon** (`TOPIC_RULES`): strong signals admit a passage; weak ones count only beside a strong one or two at a time. Out-of-scope senses are blanked before matching (`OUT_OF_SCOPE`): inheritance shares, stipends and dowers, a reward "falling due", the horse al-Mandub, a summons, purpose clauses with «كراهية أن», coercion, madness («به لمم»), "young and old", prices.
- **The forbidden is read by `scripts/halal.ts`** (`halalSignalsOfText` over `halalFold`), strong unlawful-side signals only, so the two browsers never disagree.
- **A bare prohibition is not classed.** Whether «نهى عن» means forbidding or dislike is a jurist's reading; such a report is listed only when its own wording names the degree.
- Corpus section from the passage's work: Qur'an; genre `sira` → seerah; genre `hadith` or unit `hadith` → Sunnah; anything else → books.

## 4. Harvest (20 November 2026)

- `scripts/harvest-ahkam-hadithapi.ts`: 886 reports from the seven Arabic hadith-api editions (Unlicense) already on the harvest drive, gated by a strong signal of a theme other than the forbidden (those reports were harvested for the Halal browser and are read in place); excerpts of at most 55 words, honorifics left out, reports quoting a verse skipped.
- `scripts/harvest-ahkam-ocr.ts`: 1,368 excerpts of at most 40 words from 81 books already OCR'd on the harvest drive, with the same gate; the books of usul al-fiqh first (al-Risala, al-Burhan, al-Mustasfa in two printings, al-Muwafaqat, Irshad al-Fuhul), then fiqh, the hadith commentaries, the seerah, the Companions and Successors, the books of renunciation and the histories. The book list is the union of the mappings the earlier harvesters verified, plus ten new mappings checked against their source records. No PDF, OCR text or page image enters git.
- No book was downloaded: the harvest register already held every book used (`docs/library/harvest-register.yaml`); no entry changed state.
- Labels and summaries of the harvested passages are written in the five languages by template.

## 5. Curated records

Six new `concept` records with prose in Arabic (written from the cited pages), English, Urdu, French and Spanish (machine translations): `al-ahkam-al-taklifiyya` (the five rulings; al-Ghazali's division, al-Shawkani's definition of the wajib, al-Juwayni on the makruh), `fard`, `fard-ayn`, `fard-kifaya` (al-Shafi'i's account in al-Risala), `taa`, `haram-hukm`. Twenty-eight existing records are tagged in place and keep their prose. Sources trusted for the definitions, and why: the usul books themselves, read from the scans the museum's source records describe; the hadith wordings from the museum's passage records.

## 6. Pages

`/[lang]/ahkam/` (home with the signature view "the scale of the five rulings", sections, filter, paged) and `/[lang]/ahkam/hukm/<topic>/` (ten theme pages with a definition card, answers first, paged). Components: `sig/AhkamScale.astro`, `AhkamRow.astro`; library `site/src/lib/ahkam.ts`; filter `site/src/scripts/ahkam-filter.ts`. Landing card and Explore menu entry (group "conduct"). Interface strings in the five languages.

## 7. Counts on 20 November 2026

4,607 records (`npx tsx scripts/ahkam-audit.ts`): 130 Qur'an ayahs, 2,500 Sunnah passages, 208 seerah excerpts, 1,735 excerpts from other books and 34 curated records; by theme (a record can carry more than one) 913 obligations, 180 individual obligation, 81 communal obligation, 237 obedience, 929 obligatory, 791 recommended, 1,774 forbidden, 478 disliked, 85 minor sins, 955 permitted and concession.

## 8. Lane `ahkam`: what comes next

A person's read of the translations and OCR excerpts; al-Waraqat, Rawdat al-Nazir and al-Amidi's al-Ihkam when acquired; Musnad Ahmad; a `perspectives` block on fard and wajib between the Hanafis and the majority; records for the well-known communal obligations. Batches of at most 25 curated records; harvest runs through the two scripts.
