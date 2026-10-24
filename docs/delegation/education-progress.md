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
