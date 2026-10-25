# `education` progress

Lane doc: `docs/agents/lanes/education.md`. Plan: `docs/delegation/education-master-plan.md` (decisions in §9.1). Opened 23 October 2026 by Claude (Claude Fable 5.1) after the founder approved phase E1 in chat the same day.

## E1 · Front door, five band hubs, passport, study modes, share cards, QR and print

**Status:** built 23 October 2026, PR #1233 (commit `e453e888c` on `claude/islam-museum-education-plan-48575d`, merged on the founder's instruction once Validate passed).

**Routes live in ar, en and ur** (after the founder's next deploy): `/learn/` (front door), `/learn/trails/` (the chooser, moved), `/learn/passport/`, `/learn/teachers/`, `/learn/parents/`, `/sighar/sprouts/`, `/sighar/explorers/`, `/sighar/storytellers/`; study modes and a printable cut-out deck on every `/cards/list/{slug}/`; a QR code on the lesson worksheets, the kindness chart, the retell print, the pathway handout, the deck print and the passport; the kids hub and kit link the new pages. Teen doors on the front door lead to `/learn/trails/` with an "in the making" chip until E4.

**Data and strings:** `edu/bands.yaml` (5 bands), `edu/stamps.yaml` (11 stamps, rules over the existing storage keys), `edu:` block of `i18n/*.yaml` (100 keys × 3), `kids: true` on four decks (`tartib-al-anbiya`, `asma-al-ashhur-al-hijriyya`, `ashjar-al-quran`, `nabatat-al-quran`). The `accept:` spelling lists of the plan were not authored: type mode normalises diacritics, hamza seats, ta marbuta, alef maqsura and the Urdu letter forms and accepts a one- or two-letter slip, which covered the decks tried; add `accept` per item only where the review finds a miss.

**Tests added:** `scripts/edu.test.ts` (14), Urdu parity of the kids strings, `scripts/check-weight.ts` run by `npm run build`. Calibrated on the first production build (23 October 2026, 118,388 pages, 0 errors): the budgets are now the plan §3 family ceilings, and the measured pages (markup with the inlined CSS) were:

| Route | HTML | Budget |
|---|---|---|
| `/ar/learn/` | 92.5 KB | 170 KB |
| `/ar/sighar/sprouts/` · `/explorers/` · `/storytellers/` | 101.6 · 107.6 · 110.4 KB | 170 KB |
| `/ar/learn/teachers/` · `/ar/learn/parents/` · `/ar/learn/passport/` | 94.7 · 86.9 · 98.0 KB | 170 KB |
| `/ar/sighar/quest/` (after the sprite) · `/kindness/` · `/mosque/` | 107.3 · 135.5 · 123.6 KB | 210 KB |
| `/ar/cards/list/tartib-al-anbiya/` (with study modes) | 133.6 KB | 210 KB |
| `/ar/sighar/teachers/lessons/quest/` | 105.2 KB | 200 KB |
| `/ar/learn/trails/` | 270.9 KB | 600 KB |

Page scripts are 0.3 to 11.8 KB per route (inline module scripts plus the hashed files and the chunks they import).

**Verified by hand (dev server, 23 October 2026):** every new route in the three languages, no console errors; a full deck test → passport stamp → share card (PNG drawn on the device, text copied); no horizontal scroll at 390 px on the front door, a band hub and a deck page; print layouts not yet checked on paper.

**Urdu for the founder's review:** the `edu:` block of `i18n/ur.yaml` (100 strings), the `ur` fields of `edu/bands.yaml` and `edu/stamps.yaml`, and in particular the band names «کونپلیں» (Sprouts), «مہم جو» (Explorers), «کہانی گو» (Storytellers), «طالبِ علم» (Scholars), «محقّقین» (Researchers).

**Evidence (plan §7):** nothing to report yet; after the first deploy the founder reads the edge request counts for `/{lang}/learn/**` and `/{lang}/sighar/**` monthly.

**To deploy:** the merge of PR #1233 (docs + `e453e888c`); no Worker or workflow file among them; `package.json`'s `build` script now runs `check:weight`, which the Build workflow picks up as is.

## E2 · Leveled reading (top 100), Ontario pathways, mastery checks, Tell it back, shelf, weekly sheet, teacher SEO

**Status:** complete and merged to main (PRs #1389, #1381, #1450, #1457, #1458, #1459, #1460, #1461). Label `non-impacting` (plan §5 E2).

**Founder approval:** on 23 October 2026, the founder wrote: "The leveled-100 list in PR #1389 is approved as proposed." Recorded in `edu/leveled-100.yaml` header and `docs/delegation/education-master-plan.md` §9.1.

**Confirmation of fixtures:** all three fixture records are confirmed in the approved 100-record list:
- `event/hijra` (topic 6, the Hijra)
- `person/ibrahim` (prophet stop 3)
- `building/bayt-al-hikma` (era baghdad, event 2)

**Routes live in ar, en and ur (after founder deploy):**
- Leveled entity pages: all 100 records in `edu/leveled-100.yaml` now feature the level switcher (Scholars by default, works without JavaScript; stores `edu-level` in localStorage).
- Kids' reader: `/{lang}/sighar/read/{class}/{slug}/` renders Sprouts and Explorers levels only for flagged records, omitting Scholars text.
- Reading shelf: `/{lang}/sighar/explorers/` and `/{lang}/sighar/storytellers/` list leveled reading records.
- 12 Ontario pathway landing pages `/{lang}/learn/teachers/pathways/{slug}/` (LearningResource JSON-LD, QR, worksheet, mastery check) and printable packs `.../print/` (teacher page, steps, worksheet, answer key).
- Teacher hub: `/{lang}/learn/teachers/` lists pathways by grade (Grade 4, Grade 6, Grade 11, Grade 12).
- Shelf: `/{lang}/learn/shelf/` (`edu-shelf`, up to 60 ids, `?ids=` URL share link).
- Weekly sheet: `/{lang}/learn/parents/weekly/` (reads `edu-passport` and `edu-srs`, presents the week's family activity from the 52 authored entries).
- Tell it back: `RetellBox` component ends every trail and the Prophet Quest finale; Sprouts Quest includes the order-the-cards activity (stateless).

**Data:**
- `edu/leveled-100.yaml`: 100 approved records with `approval: approved`.
- `edu/levels.yaml`: 3 levels with exact headings and word caps (80, 160, 300).
- `edu/family-activities.yaml`: 52 trilingual family activities.
- `edu/stamps.yaml`: `mastery` (`edu-quiz:`) and `tellback` (`edu-retell:`) stamps.
- 12 `data/exhibit/pathway-*.yaml`: complete curriculum blocks, 5–15 steps, 5-question quizzes, worksheets.
- 3 `data/source/ontario-curriculum-*.yaml`: official curriculum sources.
- 100 entity records in `data/` carry `education: { levels: [sprouts, explorers, scholars], flagged_for_kids: true }` with draft provenance.
- 100 records in `content/{ar,en,ur}/` carry the three leveled reading sections.

**Ontario curriculum verification (independently re-verified):**
- Grade 4 Social Studies: Strand A (A1, A3) verified against `ontario-curriculum-sshg-2023.yaml` (Early Societies to 1500 CE).
- Grade 6 Social Studies: Strand A (A2, A3) verified against `ontario-curriculum-sshg-2023.yaml` (Communities in Canada, Past and Present; global connections).
- Grade 11 CHW3M (World History to the End of the 15th Century): Strands C (C1, C2, C3), D (D1, D2), and E (E1, E2) verified against `ontario-curriculum-cws-11-12-2015.yaml`.
- Grade 12 CHY4U (World History since the 15th Century): Strand B (B1, B2, B3) verified against `ontario-curriculum-cws-11-12-2015.yaml`.
- Grade 11 HRT3M (World Religions): Strands D (D1, D2, D3) and F (F1) verified against `ontario-curriculum-ssh-9-12-2013.yaml`.
- Grade 11 HRF3O (World Religions in Daily Life): Strand D (D1, D3) verified against `ontario-curriculum-ssh-9-12-2013.yaml`.
- Verified stated curriculum gaps:
  - Neither CHW3M nor CHY4U nor G7–8 SSHG contains a dedicated medieval trade strand, so the Silk Roads pathway is mapped under CHW3M Strand E (The Legacy of Civilizations) and explicitly states this on the page and in the expectation text.
  - The Ministry's Grade 8 geography curriculum page was unreachable, so no Grade 8 pathway was published.

**Page-weight budgets (calibrated in PR #1381):**
All 19 routes pass `scripts/check-weight.ts` within the plan §3 family ceilings:
- Front door and hubs: 86.9–110.4 KB HTML (budget 170 KB), 0.3–11.8 KB JS (budget 12–20 KB)
- Child activities: 107.3–135.5 KB HTML (budget 210 KB)
- Leveled reading (`/ar/event/hijra/`): 120.3 KB HTML (budget 160 KB), 6.5 KB JS (budget 10 KB)
- Kids reader (`/ar/sighar/read/event/hijra/`): 94.2 KB HTML (budget 120 KB), 6.4 KB JS (budget 12 KB)
- Teacher pathway (`/ar/learn/teachers/pathways/g11-chw3m-rise-of-islam/`): 128.5 KB HTML (budget 220 KB), 11.2 KB JS (budget 14 KB)
- Printable pack (`.../print/`): 112.4 KB HTML (budget 200 KB), 0 KB JS (budget 8 KB)
- Shelf (`/ar/learn/shelf/`): 96.1 KB HTML (budget 200 KB), 8.4 KB JS (budget 12 KB)
- Weekly sheet (`/ar/learn/parents/weekly/`): 142.3 KB HTML (budget 260 KB), 7.1 KB JS (budget 8 KB)
- Trails listing: 270.9 KB HTML (budget 600 KB)

**Authoring batches:**
- Batch 1 (PR #1457): 25 records (`period/pre-islamic-arabia`, `person/muhammad`, `event/first-revelation`, `event/boycott-of-banu-hashim`, `event/first-migration-to-abyssinia`, `event/hijra`, `event/constitution-of-medina`, `event/battle-of-badr`, `event/battle-of-uhud`, `event/battle-of-the-trench`, `event/treaty-of-hudaybiyya`, `event/conquest-of-mecca`, `event/farewell-pilgrimage`, `work/quran`, `concept/al-hadith-al-nabawi`, `concept/five-pillars`, `concept/tawhid`, `practice/salah`, `practice/zakat`, `practice/sawm-ramadan`, `practice/hajj`, `concept/hijri-calendar`, `concept/madhhab`, `polity/rashidun-caliphate`, `polity/umayyad-caliphate`).
- Batch 2 (PR #1459): 25 records (`polity/abbasid-caliphate`, `place/al-andalus`, `polity/fatimid-caliphate`, `period/crusades-ayyubid-mamluk`, `event/sack-of-baghdad-656`, `polity/mamluk-sultanate`, `polity/ottoman-empire`, `period/gunpowder-empires`, `person/al-khwarizmi`, `person/ibn-al-haytham`, `person/ibn-sina`, `object/astrolabe-umar-ibn-yusuf`, `person/ibn-battuta-muhammad`, `concept/harakat-al-tarjama`, `concept/islamic-calligraphy`, `concept/girih`, `concept/masjid-umum`, `place/timbuktu`, `concept/trade-in-islam`, `place/jerusalem`, `concept/halal-haram`, `practice/eid-al-fitr`, `language/arabic`, `language/urdu`, `person/adam`).
- Batch 3 (PR #1460): 25 records (`person/nuh`, `person/musa`, `person/isa-ibn-maryam`, `event/building-of-the-kaaba`, `event/prophets-mosque-built`, `event/quba-sojourn`, `event/first-jumma`, `building/masjid-al-qiblatayn`, `event/founding-of-baghdad`, `event/nizamiyya-founding-459`, `building/great-mosque-cordoba`, `building/khizanat-kutub-qurtuba`, `person/ziryab`, `building/alhambra`, `event/conquest-constantinople-857`, `building/hagia-sophia`, `building/eyup-sultan-mosque`, `building/new-mosque-istanbul`, `place/mecca`, `place/medina`, `place/cordoba`, `place/baghdad`, `place/isfahan`, `place/cairo`, `place/istanbul`).
- Batch 4 (PR #1461): 23 records (`place/samarqand`, `person/malik-ibn-anas`, `person/abdullah-ibn-umar`, `person/umar-ibn-al-khattab`, `person/abu-hurayra`, `person/aisha`, `person/ali-ibn-abi-talib`, `person/abu-bakr`, `person/uthman-ibn-affan`, `person/abdullah-ibn-abbas`, `practice/wudu`, `person/al-bukhari`, `practice/tawaf`, `person/anas-ibn-malik`, `place/damascus`, `group/quraysh`, `person/khalid-ibn-al-walid`, `person/umar-ibn-abd-al-aziz`, `practice/umrah`, `period/prophetic-era`, `place/basra`, `place/mina`, `person/abu-musa-al-ashari`).
- Total: all 100 records authored with 3 levels in ar, en, ur (300 sections per language = 900 sections total).

**Urdu for the founder's review:**
All Urdu authored across Phase E2 is compiled here for the founder's review and must not be altered without his approval:
1. **Leveled reading texts (all 100 records in Urdu):**
   - Sprouts texts (`## کونپلوں کے لیے`): 100 entries, max 80 words each.
   - Explorers texts (`## مہم جوؤں کے لیے`): 100 entries, max 160 words each.
   - Scholars texts (`## طالبِ علم کے لیے`): 100 entries, max 300 words each.
   - Including the three fixtures (`event/hijra`, `person/ibrahim`, `building/bayt-al-hikma`) and batches 1, 2, 3, 4.
2. **Urdu for the 12 Ontario curriculum pathways (`data/exhibit/pathway-*.yaml`):**
   - Course titles, strand titles, and overall expectation statements in Urdu.
   - Pathway summaries and goals in Urdu.
   - Narrative step texts in Urdu (6 to 9 steps per pathway).
   - Five-question quizzes with 4 options each and explanations in Urdu.
   - Worksheets with matching step indicators and question prompts in Urdu.
3. **52 Family activities (`edu/family-activities.yaml`):**
   - 52 titles and weekly activity texts in Urdu.
4. **Band and level headings:**
   - Level headings in `edu/levels.yaml`: `کونپلوں کے لیے`, `مہم جوؤں کے لیے`, `طالبِ علم کے لیے`.
   - Band names in `edu/bands.yaml`: `کونپلیں` (Sprouts), `مہم جو` (Explorers), `کہانی گو` (Storytellers), `طالبِ علم` (Scholars), `محقّقین` (Researchers).
5. **UI strings in `i18n/ur.yaml`:**
   - All keys under the `edu:` block (switcher, reading shelf, pathways, quiz, retell, shelf, weekly).

**Evidence (plan §7):**
No data yet. After the first production deploy, the founder reads the aggregate edge request counts for `/{lang}/learn/**` and `/{lang}/sighar/**` monthly from the Cloudflare dashboard.

**To deploy (founder's manual deployment):**
The following merged PRs and commits are ready on `main` for the founder to deploy:
- E1: PR #1233 (commit `e453e888c`)
- E2 Step 1 (list): PR #1389
- E2 Weight budgets: PR #1381
- E2 Steps 2–6 (engine, pathways, quiz, shelf, weekly): PR #1450
- E2 Batch 1 (25 records): PR #1457
- E2 Founder approval docs: PR #1458
- E2 Batch 2 (25 records): PR #1459
- E2 Batch 3 (25 records): PR #1460
- E2 Batch 4 (23 records): PR #1461
- E2 Final progress & review documentation: PR #1462
**Notice:** No Worker (`workers/`) or workflow (`.github/workflows/`) file was modified in any of these E2 commits. All changes are static Astro components, TypeScript library code, curriculum data YAMLs, and markdown content files.

## E3 · Reach engines: classroom quiz, daily challenge, fact engine, seasonal packs, offline packs, Where am I?, homework search, Explorers map

**Founder approval:** on 24 October 2026, the founder wrote: "E3 is approved: reach engines (classroom quiz, daily challenge, fact engine, seasonal packs, offline packs, Where am I, homework search, Explorers map)." Recorded in `docs/delegation/education-master-plan.md` §9.1. Label `non-impacting` for the site (plan §5 E3); any new script origin or network call stops for the founder.

**Scope rules for this phase:** no E4 teen routes (the `/shabab/daily/` and `/shabab/where/` mirrors wait for E4); no E5 items; no PDF generation; no change to the submission claims files (`docs/outreach/unesco-nomination-dossier.md`, `docs/outreach/dpga-evidence-map.md`, `docs/outreach/media-licence-audit.md`).

**Steps (one pull request each, merged by the agent after Validate passes):**

| # | Step | Route or artefact | Status |
|---|---|---|---|
| 0 | Record the founder's approval (this section, plan §9.1) | docs only | done (this PR) |
| 1 | Classroom quiz | `/{lang}/learn/teachers/quiz/{trail}/?classroom=1` | done — merged #1471 (budget fix #1477) |
| 2 | Daily challenge (Century Challenge, Who am I?) and `edu/daily-schedule.json` (366 entries) | `/{lang}/learn/daily/` | done — merged #1479 |
| 3 | Fact engine: `did_you_know` on entities, 365 facts in batches of at most 25, fact of the day, archive, A4 poster | `/{lang}/learn/facts/` | in progress — merged #1586: engine + batch 1 (25); merged #1699: batch 2 (50); merged #1707/#1711/#1714/#1715/#1718: batches 3–7 (175); batch 8 adds creed concepts, sects and companions (200 of 365 total); batch 9 adds cities, events and sirah episodes (225 of 365 total); 140 facts remain for later batches |
| 4 | Seasonal packs (heritage month, Ramadan, back to school, exam season) and the founder's email texts | `/{lang}/learn/teachers/packs/{season}/`, `docs/outreach/education/` | done — `edu/packs.yaml` (4 packs × kit of 8–11 sheets) + pack landing pages + packs index + emails `docs/outreach/education/{heritage-month,ramadan,back-to-school,exam-season}.md`; merged #1590 |

| 5 | Offline packs: one self-contained `.html` per pack per language, inlined CSS, no script or external fetch, ≤ 2 MB, checked in `check-site.ts` | `/{lang}/learn/teachers/offline/{unit}.html` | done — build-time endpoint `site/src/pages/[lang]/learn/teachers/offline/[slug].html.ts` (pack overview + kit + fact archive); linked from each pack page; check-site asserts size/no-script/no-absolute-URL; merged #1593 |
| 6 | Where am I? (gentle version) | `/{lang}/sighar/explorers/where/` | done — `edu/where.yaml` 12 first-person riddles × two choices, always-warm <details> reveals, no JS; linked from the Explorers hub; merged #1598 |
| 7 | Homework search: 50 topics × three phrasings in ar, en, ur merged into the search synonyms | `edu/homework-topics.yaml`, search zero-result strip | done — `edu/homework-topics.yaml` (50 topics), phrasings merged into `search-synonyms.{ar,en}.json` in `derive.ts`, zero-result `#hw-strip` on `/{lang}/search/` + teacher-hub strip; merged #1601 |
| 8 | Explorers map: world SVG (80 KB or less, 12 hot spots), replacing the placeholder on the Explorers hub | `site/src/data/basemap-world.json`, `/{lang}/sighar/explorers/` | done — `basemap-world.json` (Natural Earth 110m land, 61 KB) + `WorldMap.astro` inline SVG, 12 hot spots each opening its city's leveled record (fez/delhi open the plain record), list below the map as the no-JS equivalent; merged #1602 |

**Deploy register (close-out 1e, checked 25 Oct 2026):** merged education PRs since 24 Oct 2026 — #1233 (E1), #1389, #1381, #1450, #1457-#1462 (E2), #1582 (E2 close-out), #1467, #1471, #1477, #1479, #1586, #1590, #1593, #1598, #1601, #1602 (E3 steps), #1605 (validate repair), #1606, #1608 (close-out). `git diff` over every one of them: **none touches `.github/workflows`, `workers/` or any wrangler config** — a plain `main` deploy covers everything, no Worker/workflow restart needed.

**Urdu for the founder's review (E3):** strings landed per step, quoted for review. UI keys live in `i18n/ur.yaml`; content strings in the cited files. None is approved yet — please review and correct in place or send edits.

**Step 3 — fact engine (#1586).** UI keys `fc_*`:
- `fc_dyk`: کیا آپ جانتے ہیں؟
- `fc_title`: حقائق
- `fc_lede`: میوزیم سے روز ایک تصدیق شدہ حقیقت — ہر ایک کا اپنا ریکارڈ اور ماخذ۔
- `fc_day`: آج کی حقیقت
- `fc_week`: ہفتے کی حقیقت
- `fc_all`: تمام حقائق
- `fc_count`: تمام حقائق ({n})
- `fc_poster`: ہفتے کی حقیقت کا پوسٹر چھاپیں
- `fc_poster_title`: ہفتے کی حقیقت · پوسٹر
- `fc_poster_note`: ایک ورق (A4): کلاس کی دیوار پر لگائیں اور مزید حقائق کے لیے کوڈ اسکین کریں۔
- `fc_sources`: ماخذ

Fact strings (`education.did_you_know.ur` on 25 records):
- `building/eyup-sultan-mosque.yaml`: فتح کے بعد استنبول میں پہلی عثمانی مسجد: محمد فاتح نے 1458ء میں ابوایوب انصاری کے مزار پر بنائی۔
- `building/great-mosque-cordoba.yaml`: مسجدِ قرطبة میں تقریباً ساڑھے آٹھ سو ماربل اور جزع کے ستون ہیں، جن میں سے بہت سے پرانی رومی اور ویزگوتھک عمارتوں سے لیے گئے۔
- `concept/five-pillars.yaml`: اسلام کے پانچ ارکان مشہور حدیثِ جبرائیل میں جمع ہوئے، جب انھوں نے نبی سے اسلام، ایمان اور احسان پوچھے۔
- `concept/hijri-calendar.yaml`: ہجری تقویم ہجرت کے دن سے نہیں شروع ہوتا؛ عمر بن خطاب نے 17ھ میں سال کے آغاز کو محرم ٹھہرایا۔
- `concept/tawhid.yaml`: توحید کا لفظ قرآن میں نہیں آتا، مگر علما نے اسے ایک پوری شاخ کا نام بنایا: عبادت اور صفات میں اللہ کو یکتا ماننا۔
- `event/battle-of-badr.yaml`: بدر سے پہلے کی رات بارش ہوئی اور ریت مسلمانوں کے قدموں تلے مضبوط ہوگئی؛ اس دن انھوں نے قریش کے ستر آدمی قیدی بنائے۔
- `event/conquest-of-mecca.yaml`: نبی تقریباً دس ہزار کے ساتھ مکہ داخل ہوئے اور عام معافی کا اعلان کیا؛ اہلِ مکہ سے کہا: جاؤ، تم آزاد ہو۔
- `event/constitution-of-medina.yaml`: صحیفۂ مدینہ نے یثرب کے مسلمانوں اور یہودیوں کو ایک امت بنایا؛ بہت سے مورخین اسے اسلامی تاریخ کا پہلا تحریری دستور مانتے ہیں۔
- `event/first-revelation.yaml`: نبی پر غارِ حرا میں وحی نازل ہوئی؛ سب سے پہلے جو شے ان پر نازل ہوئی وہ پڑھنے کا حکم تھا۔
- `event/founding-of-baghdad.yaml`: منصور نے دجلہ اور فرات کے درمیان بغداد کی جگہ چنی، اسے شہرِ سلامت کہا، اور سلطنت بھر سے بنانے والے بلائے۔
- `event/hijra.yaml`: نبی اور ان کے ساتھی غارِ ثور میں تین راتیں چھپے رہے؛ وہ جمعے کے دن مدینہ داخل ہوئے اور بنو سالم میں پہلی نمازِ جمعہ ادا کی گئی۔
- `event/prophets-mosque-built.yaml`: نبی کی اونٹنی اسی جگہ بیٹھی جہاں ان کی مسجد بننی تھی؛ انھوں نے دو یتیموں سے زمین خریدی اور اینٹ اور کھجور کی چھال سے مسجد بنائی۔
- `person/abdullah-ibn-abbas.yaml`: ابنِ عباس نبی کے انتقال کے وقت تیرہ برس کے تھے، مگر اگلی نسل کے لیے تفسیر کا حوالہ بنے اور «ترجمانِ قرآن» کہلائے۔
- `person/abu-hurayra.yaml`: ابوہریرہ نے صرف تین سال کی صحبت میں تقریباً پانچ ہزار احادیث بیان کیں۔
- `person/aisha.yaml`: عائشہ سے دو ہزار سے زیادہ احادیث مروی ہیں؛ صحابہ دین کے باریک مسائل ان سے پوچھتے تھے۔
- `person/al-bukhari.yaml`: بخاری نے سولہ برس کے سفر میں جمع کی گئی تقریباً چھ لاکھ احادیث میں سے صحیح چنی؛ صرف وہی لی جو ان کی شرط پر پوری اترے۔
- `person/al-khwarizmi.yaml`: الجبرا کا نام الخوارزمی کی کتاب «الجبر» سے اور الگورتھم ان کے لاطینی نام «الگورتمی» سے نکلا۔
- `person/ibn-sina.yaml`: سولہ برس میں ابنِ سینا نے سامانی شہزادہ نوح بنِ منصور کا علاج کیا؛ اس نے شاہی کتب خانہ کھول دیا اور انھوں نے وہ سب پڑھ لیا۔
- `place/baghdad.yaml`: بغداد شہرِ سلامت کہلایا اور تیسری ہجری صدی میں دنیا کا سب سے بڑا شہر تھا؛ جغرافیہ دانوں نے اس کی آبادی لاکھوں میں گنی۔
- `place/cordoba.yaml`: چوتھی ہجری صدی میں قرطبة یورپ کے شہروں سے بڑا تھا؛ اس کی پکی سڑکیں لندن سے صدیوں پہلے چراغوں سے روشن تھیں۔
- `place/jerusalem.yaml`: یروشلم تقریباً سولہ ماہ مسلمانوں کا پہلا قبلہ رہا، پھر قبلہ کعبہ کی طرف پھر گیا۔
- `polity/umayyad-caliphate.yaml`: اموی عہد میں مسلموں کی حکومت اندلس سے دریائے جیحوں تک پھیلی؛ اس زمانے کی دنیا کی سب سے بڑی ریاست تھی۔
- `practice/hajj.yaml`: لوگ اسلام سے پہلے بھی کعبہ کا طواف کرتے تھے؛ 9ھ کے حج نے گھر کو ابراہیم اور اسماعیل کی توحید پر لوٹایا۔
- `practice/salah.yaml`: پانچ کے فرض ہونے سے پہلے مسلمان صبح اور شام دو دو رکعتیں پڑھتے تھے؛ پانچ نمازیں راتِ معراج میں مقرر ہوئیں۔
- `practice/sawm-ramadan.yaml`: مریض اور مسافر رمضان کے روزے سے معذور ہیں بشرط بعد میں قضا کے؛ مسافر کی رخصت حکمِ روزے سے پہلے آئی۔

**Step 4 — seasonal packs (#1590).** UI keys:
- `pk_season`: موسمی پیک
- `pk_kit_title`: پیک کا سامان (چھپائی پر {n} ورقیں)
- `pk_sheets`: {n} ورقیں
- `pk_note`: ہر شے اپنا چھپائی صفحہ کھولتی ہے؛ سب چھاپیں تو پیک مکمل ہوتا ہے۔
- `pk_title`: موسمی پیک
- `pk_desc`: تاریخ کے مطابق کلاس کا سامان: ورثہ ماہ، رمضان، اسکول واپسی اور امتحانوں کا موسم۔
- pack `heritage-month` title: اسلامی ورثہ ماہ کا پیک | when: انٹاریو میں اسلامی ورثہ ماہ: ہر سال اکتوبر۔ | lede: روز ایک حقیقت، مکمل چھپنے والا راستہ، میوزیم پاسپورٹ اور روزانہ چیلنج: ورثہ ماہ کے لیے کلاس کا سامان۔
  - kit item: ہفتے کی حقیقت کا پوسٹر
  - kit item: نصابی راستے کا چھپائی پیک (اسلام کا عروج)
  - kit item: میوزیم پاسپورٹ
  - kit item: روزانہ چیلنج (ایک ہفتے کے سوالات)
  - kit item: اپنے الفاظ میں سنانے کی مشق
- pack `ramadan` title: رمضان کا پیک | when: رمضان 1448ھ: ام‌القری تقویم کے مطابق متوقع آغاز تقریباً 8 فروری 2027ء؛ اصل آغاز ہلال دیکھنے پر موقوف ہے۔ | lede: نیکی کا چارٹ، حقائق کا پوسٹر، خاندانی ہفتہ وار ورقیں اور چھپنے والا راستہ: رمضان کے لیے کلاس کا سامان۔
  - kit item: ہفتے کی حقیقت کا پوسٹر
  - kit item: نیکی کی 30 روزہ چارٹ
  - kit item: نصابی راستے کا چھپائی پیک
  - kit item: خاندانی ہفتہ وار ورق
  - kit item: روزانہ چیلنج
- pack `back-to-school` title: اسکول واپسی کا پیک | when: ستمبر کا پہلا ہفتہ۔ | lede: سال کا آغاز ہر شاگرد کے پاسپورٹ، حقائق کے پوسٹر، کلاس کے راستے اور کاٹنے اور پڑھنے کے کارڈ سے کریں۔
  - kit item: میوزیم پاسپورٹ
  - kit item: ہفتے کی حقیقت کا پوسٹر
  - kit item: نصابی راستے کا چھپائی پیک
  - kit item: انبیاء کی ترتیب کے کاٹنے والے کارڈ
- pack `exam-season` title: امتحانوں کے موسم کا پیک | when: مئی تا جون۔ | lede: خود جانچنے والے مطالعہ طریقے، راستوں کی ورک شیٹیں، روزانہ چیلنج اور حقائق کا پوسٹر: امتحان سے پہلے کلاس کی دہرائی کا سامان۔
  - kit item: مطالعے کے کاٹنے والے کارڈ
  - kit item: نصابی راستے کا چھپائی پیک (ورک شیٹ سمیت)
  - kit item: سبق کی ورک شیٹ
  - kit item: روزانہ چیلنج
  - kit item: ہفتے کی حقیقت کا پوسٹر

**Step 5 — offline packs (#1593).** UI keys:
- `pk_offline`: آف لائن پیک (ایک فائل)
- `pk_offline_note`: یہ ایک فائل پورا پیک رکھتی ہے؛ بغیر انٹرنیٹ کھلتی ہے۔

**Step 6 — Where am I? (#1598).** UI keys `wh_*`:
- `wh_title`: میں کہاں ہوں؟
- `wh_lede`: بارہ مقامات پہلے شخص میں بولتے ہیں۔ ہر ایک کی پہیلی سنو، پھر جواب جھانکو — یہاں کوئی غلط اندازہ نہیں۔
- `wh_guess`: کیا میں {name} ہوں؟
- `wh_yes`: ہاں! میں {name} ہوں۔
- `wh_notquite`: پیارا اندازہ — میں دراصل {answer} ہوں۔ مگر {name} بھی ایک خوبصورت جگہ ہے!
- `wh_visit`: میرا ریکارڈ دیکھو
- `wh_note`: ہر اندازے کو نرم جواب ملتا ہے، اور ہر جواب میوزیم کی ایک اصل جگہ کھولتا ہے۔
Riddle strings (`edu/where.yaml`):
- `kaaba`: میں اس شہر میں کھڑا ہوں جہاں نبی پیدا ہوئے، اور لوگ نماز میں میری طرف رخ کرتے ہیں۔ میں کون ہوں؟
- `prophets-mosque`: میں سب سے پہلے مٹی کی اینٹوں اور کھجور کے تنوں سے بنا، اور میرے پاس ایک بابرکت آرام گاہ کے اوپر سبز گنبد ہے۔ میں کون ہوں؟
- `great-mosque-cordoba`: میں قرطبہ میں کھڑا ہوں، اور میری چھت کے نیچے ستونوں اور سرخ و سفید محرابوں کا جنگل ہے۔ میں کون ہوں؟
- `alhambra`: میں غرناطہ کی پہاڑی پر ایک محل ہوں جہاں صحنوں میں پانی بہتا ہے اور میری دیواروں پر شاعری کندہ ہے۔ میں کون ہوں؟
- `baghdad`: میں دجلہ کے کنارے بسا ایک گول شہر ہوں، اور میرے دارالحکمت نے دنیا کے علوم کا ترجمہ کیا۔ میں کون ہوں؟
- `timbuktu`: میں عظیم صحرا کے کنارے کھڑا ہوں، اور میرے لوگوں کے گھروں میں بے شمار کتابیں محفوظ رہیں۔ میں کون ہوں؟
- `bukhara`: میں شاہراہِ ریشم کا پرانا شہر ہوں جس کا اونچا مینار صدیوں تک قافلوں کی رہنمائی کرتا رہا۔ میں کون ہوں؟
- `umayyad-mosque`: میں پرانے دمشق کے دل میں کھڑا ہوں؛ میرے صحن میں اونچے مینار اور عقاب کا گنبد ہیں۔ میں کون ہوں؟
- `dome-of-the-rock`: میں یروشلم میں ایک چٹان کے اوپر سنہری گنبد ہوں، جو پرانے شہر کی ہر جگہ سے نظر آتا ہے۔ میں کون ہوں؟
- `suleymaniye`: مجھے معمار سنان نے استنبول کی ایک پہاڑی پر بنایا، اور میرے چار میناروں سے باسفورس نظر آتا ہے۔ میں کون ہوں؟
- `al-aqsa`: میں وہ مسجد ہوں جہاں لوگ پہلے قبلے کی طرف نماز پڑھتے تھے، حرمِ شریف کے کنارے۔ میں کون ہوں؟
- `eyup-sultan`: میں گولڈن ہورن کے کنارے کھڑا ہوں، اور میرا نام اس مہربان صحابی پر ہے جس نے مدینہ میں نبی کی میزبانی کی۔ میں کون ہوں؟

**Step 7 — homework search (#1601).** UI keys:
- `hw_title`: ہوم ورک کے موضوعات
- `hw_lede`: کچھ نہ ملا؟ یہ پچاس اسکول موضوعات ہمیشہ کہیں نہ کہیں پہنچتے ہیں:
Homework topics (`edu/homework-topics.yaml`) — id | ur title | ur phrasings:
- `crusades` | صلیبی جنگیں | صلیبی جنگیں ہوم ورک · صلیبی جنگیں پروجیکٹ · صلیبی جنگیں بچوں کے لیے
- `rise-of-islam` | اسلام کا عروج | اسلام کا عروج ہوم ورک · اسلام کا عروج پروجیکٹ · اسلام کا عروج بچوں کے لیے
- `baghdad-silk-roads` | بغداد اور شاہراہِ ریشم | بغداد اور شاہراہِ ریشم ہوم ورک · بغداد اور شاہراہِ ریشم پروجیکٹ · بغداد اور شاہراہِ ریشم بچوں کے لیے
- `al-andalus` | اندلس | اندلس ہوم ورک · اندلس پروجیکٹ · اندلس بچوں کے لیے
- `mongols` | منگول | منگول ہوم ورک · منگول پروجیکٹ · منگول بچوں کے لیے
- `five-pillars-path` | روزمرہ میں اسلام کے پانچ ارکان | روزمرہ میں اسلام کے پانچ ارکان ہوم ورک · روزمرہ میں اسلام کے پانچ ارکان پروجیکٹ · روزمرہ میں اسلام کے پانچ ارکان بچوں کے لیے
- `art-architecture` | اسلامی فن و عمارت | اسلامی فن و عمارت ہوم ورک · اسلامی فن و عمارت پروجیکٹ · اسلامی فن و عمارت بچوں کے لیے
- `life-of-prophet` | سیرتِ نبی | سیرتِ نبی ہوم ورک · سیرتِ نبی پروجیکٹ · سیرتِ نبی بچوں کے لیے
- `quran-text` | قرآن بطور متن | قرآن بطور متن ہوم ورک · قرآن بطور متن پروجیکٹ · قرآن بطور متن بچوں کے لیے
- `ottomans` | سلطنتِ عثمانیہ | سلطنتِ عثمانیہ ہوم ورک · سلطنتِ عثمانیہ پروجیکٹ · سلطنتِ عثمانیہ بچوں کے لیے
- `four-cities` | چار اسلامی شہر | چار اسلامی شہر ہوم ورک · چار اسلامی شہر پروجیکٹ · چار اسلامی شہر بچوں کے لیے
- `hajj-network` | حج کا سلسلہ | حج کا سلسلہ ہوم ورک · حج کا سلسلہ پروجیکٹ · حج کا سلسلہ بچوں کے لیے
- `badr` | غزوۂ بدر | غزوۂ بدر ہوم ورک · غزوۂ بدر پروجیکٹ · غزوۂ بدر بچوں کے لیے
- `hijra` | ہجرت | ہجرت ہوم ورک · ہجرت پروجیکٹ · ہجرت بچوں کے لیے
- `first-revelation` | پہلی وحی | پہلی وحی ہوم ورک · پہلی وحی پروجیکٹ · پہلی وحی بچوں کے لیے
- `conquest-mecca` | فتح مکہ | فتح مکہ ہوم ورک · فتح مکہ پروجیکٹ · فتح مکہ بچوں کے لیے
- `ibn-battuta` | ابن بطوطہ | ابن بطوطہ ہوم ورک · ابن بطوطہ پروجیکٹ · ابن بطوطہ بچوں کے لیے
- `ibn-sina` | ابن سینا | ابن سینا ہوم ورک · ابن سینا پروجیکٹ · ابن سینا بچوں کے لیے
- `al-khwarizmi` | خوارزمی | خوارزمی ہوم ورک · خوارزمی پروجیکٹ · خوارزمی بچوں کے لیے
- `ibn-rushd` | ابن رشد | ابن رشد ہوم ورک · ابن رشد پروجیکٹ · ابن رشد بچوں کے لیے
- `mansa-musa` | مانسا موسی | مانسا موسی ہوم ورک · مانسا موسی پروجیکٹ · مانسا موسی بچوں کے لیے
- `fatima-al-fihri` | فاطمہ الفہری | فاطمہ الفہری ہوم ورک · فاطمہ الفہری پروجیکٹ · فاطمہ الفہری بچوں کے لیے
- `al-ghazali` | غزالی | غزالی ہوم ورک · غزالی پروجیکٹ · غزالی بچوں کے لیے
- `mimar-sinan` | معمار سنان | معمار سنان ہوم ورک · معمار سنان پروجیکٹ · معمار سنان بچوں کے لیے
- `salah-al-din` | صلاح الدین | صلاح الدین ہوم ورک · صلاح الدین پروجیکٹ · صلاح الدین بچوں کے لیے
- `kaaba` | کعبہ | کعبہ ہوم ورک · کعبہ پروجیکٹ · کعبہ بچوں کے لیے
- `alhambra` | الحمرا | الحمرا ہوم ورک · الحمرا پروجیکٹ · الحمرا بچوں کے لیے
- `dome-of-rock` | قبة الصخرہ | قبة الصخرہ ہوم ورک · قبة الصخرہ پروجیکٹ · قبة الصخرہ بچوں کے لیے
- `cordoba-mosque` | جامعِ قرطبہ | جامعِ قرطبہ ہوم ورک · جامعِ قرطبہ پروجیکٹ · جامعِ قرطبہ بچوں کے لیے
- `al-aqsa` | مسجدِ اقصی | مسجدِ اقصی ہوم ورک · مسجدِ اقصی پروجیکٹ · مسجدِ اقصی بچوں کے لیے
- `suleymaniye` | مسجدِ سلیمانیہ | مسجدِ سلیمانیہ ہوم ورک · مسجدِ سلیمانیہ پروجیکٹ · مسجدِ سلیمانیہ بچوں کے لیے
- `blue-mosque` | نیلی مسجد | نیلی مسجد ہوم ورک · نیلی مسجد پروجیکٹ · نیلی مسجد بچوں کے لیے
- `umayyad-mosque` | اموی مسجد | اموی مسجد ہوم ورک · اموی مسجد پروجیکٹ · اموی مسجد بچوں کے لیے
- `baghdad` | بغداد | بغداد ہوم ورک · بغداد پروجیکٹ · بغداد بچوں کے لیے
- `cordoba` | قرطبہ | قرطبہ ہوم ورک · قرطبہ پروجیکٹ · قرطبہ بچوں کے لیے
- `timbuktu` | ٹمبکٹو | ٹمبکٹو ہوم ورک · ٹمبکٹو پروجیکٹ · ٹمبکٹو بچوں کے لیے
- `cairo` | قاہرہ | قاہرہ ہوم ورک · قاہرہ پروجیکٹ · قاہرہ بچوں کے لیے
- `delhi` | دہلی | دہلی ہوم ورک · دہلی پروجیکٹ · دہلی بچوں کے لیے
- `istanbul` | استنبول | استنبول ہوم ورک · استنبول پروجیکٹ · استنبول بچوں کے لیے
- `mecca` | مکہ | مکہ ہوم ورک · مکہ پروجیکٹ · مکہ بچوں کے لیے
- `medina` | مدینہ | مدینہ ہوم ورک · مدینہ پروجیکٹ · مدینہ بچوں کے لیے
- `jerusalem` | بیت المقدس | بیت المقدس ہوم ورک · بیت المقدس پروجیکٹ · بیت المقدس بچوں کے لیے
- `five-pillars` | ارکانِ اسلام | ارکانِ اسلام ہوم ورک · ارکانِ اسلام پروجیکٹ · ارکانِ اسلام بچوں کے لیے
- `hijri-calendar` | ہجری تقویم | ہجری تقویم ہوم ورک · ہجری تقویم پروجیکٹ · ہجری تقویم بچوں کے لیے
- `algebra` | الجبرا | الجبرا ہوم ورک · الجبرا پروجیکٹ · الجبرا بچوں کے لیے
- `astronomy` | فلکیات | فلکیات ہوم ورک · فلکیات پروجیکٹ · فلکیات بچوں کے لیے
- `calligraphy` | عرب خطاطی | عرب خطاطی ہوم ورک · عرب خطاطی پروجیکٹ · عرب خطاطی بچوں کے لیے
- `salah` | نماز | نماز ہوم ورک · نماز پروجیکٹ · نماز بچوں کے لیے
- `sawm` | رمضان کے روزے | رمضان کے روزے ہوم ورک · رمضان کے روزے پروجیکٹ · رمضان کے روزے بچوں کے لیے
- `zakat` | زکوٰۃ | زکوٰۃ ہوم ورک · زکوٰۃ پروجیکٹ · زکوٰۃ بچوں کے لیے

**Step 8 — Explorers map (#1602).** UI keys:
- `wm_title`: میوزیم کا نقشہ
- `wm_lede`: بارہ شہر، بارہ دروازے۔ سنہری نکتہ چھوؤ یا فہرست سے چنو — ہر ایک ایک ریکارڈ کھولتا ہے۔


- **Step 3 (fact engine) — new i18n strings:**
  - `fc_dyk`: «کیا آپ جانتے ہیں؟»
  - `fc_title`: «حقائق» · `fc_day`: «آج کی حقیقت» · `fc_week`: «ہفتے کی حقیقت»
  - `fc_lede`: «میوزیم سے روز ایک تصدیق شدہ حقیقت — ہر ایک کا اپنا ریکارڈ اور ماخذ۔»
  - `fc_all`: «تمام حقائق» · `fc_count`: «تمام حقائق ({n})» · `fc_sources`: «ماخذ»
  - `fc_poster`: «ہفتے کی حقیقت کا پوسٹر چھاپیں» · `fc_poster_title`: «ہفتے کی حقیقت · پوسٹر»
  - `fc_poster_note`: «ایک ورق (A4): کلاس کی دیوار پر لگائیں اور مزید حقائق کے لیے کوڈ اسکین کریں۔»
- **Step 3 — the 25 Urdu fact texts** are on the entities themselves (`education.did_you_know.ur` in batch 1: events badr, hijra, conquest-of-mecca, constitution-of-medina, first-revelation, prophets-mosque-built, founding-of-baghdad; persons aisha, abu-hurayra, abdullah-ibn-abbas, ibn-sina, al-khwarizmi, al-bukhari; buildings great-mosque-cordoba, eyup-sultan-mosque; concepts five-pillars, tawhid, hijri-calendar; practices salah, sawm-ramadan, hajj; places baghdad, cordoba, jerusalem; polity umayyad-caliphate). Draft, pending the founder's review.

## E2 leftovers · Part A close-out (24 October 2026, this PR)

- **A1 Sprouts read-aloud stories.** The master plan §4 route map names a **new** `/sighar/sprouts/stories/` (a read-aloud subset of Bedtime Stories), while the E2 brief pointed at `/{lang}/sighar/sprouts/stories/`. Built per the plan: `site/src/pages/[lang]/sighar/sprouts/stories.astro` serves the read-aloud stories inside the Sprouts hub, reusing `loadStories`/`storyAudioExists` from `site/src/lib/kids.ts` and the existing `kids.*` i18n keys (no new strings, no invented audio — audio plays only where a real audio file already exists). `edu/bands.yaml` updated so the Sprouts "stories" activity links to the new route; `/sighar/stories/` stays as the Explorers read-aloud shelf. A `child activity` row was added to `scripts/check-weight.ts` for `/ar/sighar/sprouts/stories/` (210 KB HTML / 14 KB JS, same ceiling as the other child routes).
- **A2 Paper print check.** Code-level audit of the six printables: museum passport (`/{lang}/learn/passport/`, `edu.css` print block hides actions/share, stamps redraw dashed for hand-filling; page prints blank without JS per its own header note), pathway print (`/{lang}/learn/teachers/pathways/{slug}/print/`, dedicated print layout), card deck cut-out (`/{lang}/cards/list/{slug}/`, kids.css print block), lesson worksheet (`/{lang}/sighar/teachers/lessons/{unit}/`, `@media print` in the page plus kids.css `write-lines` block), kindness chart (`/{lang}/sighar/kindness/`, kids.css print block hides interactive controls), Tell-it-back (`/{lang}/sighar/retell/`, static printable prompts, ask-a-grown-up note). Global `.no-print` strip (header/footer/chrome) applies to all. Print-render evidence (one paper PDF per printable) is recorded below once the local `npm run build` finishes; the page-change build was still running at push time and the PR's Validate workflow re-runs it.

**Print check (close-out 1b, run 25 Oct 2026).** Real print run per printable — one PDF each saved from the rendered site (headless Chrome `--print-to-pdf`), pages counted and checked for interactive controls:

| Printable | Route | Pages (A4) | Controls in print | Result |
|---|---|---|---|---|
| Museum passport | `/en/learn/passport/` | 1 | none | fixed: was 2 pages — compacted stamp grid in `edu.css` print block |
| Pathway print pack | `/en/learn/teachers/pathways/g11-chw3m-rise-of-islam/print/` | 4 | none | ok by design (4-sheet pack) |
| Card deck cut-out | `/en/cards/list/tartib-al-anbiya/` | 5 | none | fixed: page 1 printed carousel controls (`← 1/25 →`) — `FlipDeck` interactive stage/nav/fallback now hidden in print; only the cut-out grid prints |
| Lesson worksheet | `/en/sighar/teachers/lessons/garden/` | 1 | none | fixed: was 2 pages — `body { min-height: 100svh }` forced a blank trailing page (`global.css` print block now resets it) and `write-lines` tightened |
| Kindness chart | `/en/sighar/kindness/` | 1 | none | fixed: was 2 pages — sticker chart compacted to two print columns, progress bar/tap grid already hidden |
| Tell it back | `/en/sighar/retell/` | 1 | none | ok as shipped |

- **A3 Keyboard and tap audit.** Study modes, the quiz, the shelf and the level switcher were audited in `site/src/scripts/` and the Svelte islands. One real defect found and fixed in `site/src/scripts/study.ts`: the test-mode answer-key listener (keys 1–4) was bound per round but never removed, so a stale listener could click detached option tiles and re-mark the SRS box; the handler now bails unless this round's options node is still connected and unanswered. No "accept spelling" lists were needed anywhere — quiz answers are button taps, and the only free-text checks already normalize case/whitespace and tolerate levenshtein distance ≤2.
- **A4 Sitemap and JSON-LD.** Verified on `dist/` when the build completes: pathway pages emit `Course`-type JSON-LD (`seo.ts`/`seo.test.ts` already guards it; recorded once the artifact exists).
- **A5 Full `npm test`.** Ran to completion this time: **13 files, 155 tests, all passed** (previously the run did not finish).
- **A6 Step table fix + this record.** E3 rows 1–2 corrected from `pending` to merged (#1471 classroom quiz, #1477 budget fix, #1479 daily challenge), and this section records Part A.

## E4 — the teen wing (founder-approved 25 Oct 2026, §9.1)

- **Step 1, wing skeleton**: `/shabab/` hub (timeline-first via HijriTimeline, no mascot chrome), `scholars` and `researchers` band pages, and the daily-challenge and Where-am-I? mirrors under the wing. New `shabab:` i18n block in ar/en/ur (Urdu new). "In the making" chips mark topics, dilemmas, Source Detective and the Journey Map until their steps land. Page-weight rows added for the teen family. Tests: 4 new, 72/72 pass.
- **Step 2, topics-50 schema + first batch**: `edu/topics-50.yaml` schema (anchor, band, trilingual title, ~150-word sixty-second explainer, 12-term glossary, 10-question practice set with one `correct` and a `why` under every option). First batch of 4 topics authored in full (crusades, hijra, five-pillars, salah); `site/src/lib/topics.ts` is the integrity gate. Tests: 3 new, 75/75 pass. Remaining 46 topics pending.
- **Step 2, batch 2**: +4 topics (badr, first-revelation, conquest-mecca, baghdad) — 8 of 50 authored.
- **Step 2, batches 3–4**: +8 topics (mecca, medina, jerusalem, cordoba, timbuktu, cairo, delhi, istanbul) — 16 of 50 authored.
- **Step 2, batch 5** (PR TBD): +4 topics (salah-al-din, mansa-musa, fatima-al-fihri, al-khwarizmi) — 20 of 50 authored. Batch 6 adds 4 more (ibn-sina, ibn-rushd, al-ghazali, mimar-sinan) — 24 of 50..
- **Step 2, batches 6–12** (#1662): all remaining topics authored; the file lands at **52 taught topics** — the original 50 plus bayt-al-hikma and damascus, which the founder approved on 25 Oct 2026 ("i approve the two topics bayt al hikma and damascus to be included"; "you can go beyond 50 no problem"). Every topic carries a trilingual 60-second explainer, a 12-term glossary and a 10-question practice set with exactly one `correct` and a `why` under every option.
- **Step 3** (#1663): `SixtySeconds.astro` (sticky reading-progress bar), `PracticeSet.astro` + `scripts/practice.ts` (self-marking, keyboard-first native radios, `why` revealed per option, score + "try again", `localStorage edu-practice:<id>` device-only), plus `/shabab/60s|practice|glossary/{topic}/` (52 × 3 langs each) and a band-grouped `/shabab/topics/` index. Tests: 3 new.
- **Step 4** (#1670): `edu/dilemmas/*.yaml` — **31 decision cards** (16 Scholars, 15 Researchers), each trilingual with the decision as a question, context, ≥2 attributed positions (named holder, stance, evidence card, ≥1 real graph source) and a "you decide" written reflection kept in `localStorage edu-dilemma:<id>`. No `verdict`/`winner`/`correct` anywhere; sensitive topics excluded per plan §5. `Dilemma.astro`, `lib/dilemmas.ts` loader, `/shabab/dilemmas/` index + per-card routes. Tests: 4 new.
- **Step 5** (#1674): `edu/detective/*.yaml` — **21 Source Detective units** (10 Scholars, 11 Researchers): a claim, exactly three evidence cards (a chained passage shown as an isnad strip, a chronicle/record excerpt, an object/record — all real graph ids, ≥1 passage with a `chain` field), a four-step grading scale ("proves / strongly supports / hints / does not support") then the historians' note; grading kept in `localStorage edu-detective:<id>`. `Detective.astro`, `scripts/detective.ts`, `lib/detective.ts`, `/shabab/detective/` index + routes. Tests: 3 new.
- **Step 6** (this PR): `JourneyMap.astro` + `scripts/journeymap.ts` — three SVG territories (topics/dilemmas/detective) coloured from the activity keys already on the device, per-zone counts, print-clean poster — and the **teen doors moved**: `/learn/` and `/learn/parents/` shabab-band doors now point at `/shabab/` (the "in the making" chip removed; `ladder_soon` rewritten). Check-weight rows added for every new teen family (topics/glossary/60s/practice/dilemmas/detective indexes + pages + journey). Tests: 3 new, 20/20 E4 pass.
- **Keyboard-only completion (acceptance record)**: every teen interaction uses native controls — practice uses radio inputs + buttons, the dilemma reflection is a `textarea`, the detective scale is radios + a reveal button, the Journey Map print is a `button`; all focusable and operable with Tab/Space/Enter alone. Progress persistence is `localStorage` only.
- **Urdu for the founder's review (E4 additions)**: all `sb_*` strings from steps 3–6 (`sb_positions`, `sb_evidence`, `sb_sources`, `sb_you_decide`, `sb_reflect_hint`, `sb_saved`, `sb_claim`, `sb_chain`, `sb_what_proves`, `sb_scale_*`, `sb_hist_note`, `sb_show_note`, `sb_journey_*`), plus all Urdu text inside `edu/dilemmas/*.yaml` and `edu/detective/*.yaml`, and `edu.ladder_soon`.
