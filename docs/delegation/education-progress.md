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

**Status:** approved by the founder on 23 October 2026; building since E1 merged (branch `claude/education-e2-b90348`, Claude Fable 5.1). Label `non-impacting` (plan §5 E2).

**Step 1 (list only), 23 October 2026:** `edu/leveled-100.yaml` proposes the 100 records for leveled reading, in the order plan §5 E2 gives: 49 records anchor the taught topics of appendix B (46 of the 50 topics; topics 8 and 9 take three and two records so the Badr–Uhud–Trench and Hudaybiyya–conquest units are whole), 5 are the Prophet Quest prophets, 16 the Time Machine records not already picked, 8 the trail-catalogue cities not already picked, and 22 fill by inbound-link rank (edges plus prose links, counted over 35,810 records on 23 October 2026, restricted to readable classes and excluding passages, hadith transmitters, fiqh-technical concepts and first-fitna figures; the rule is in the file's header). Each record carries its id, tier, reason, raw inbound count, the prose languages present (all 100 have ar, en and ur) and whether `content/ar/…` already has the Brief section `## نبذة` (94 do; 6 need a Scholar text as well). Four topics have no anchor record and are listed under `unanchored` for the founder's decision: Muslims in Canada (no record mentions Canada), Islamic Heritage Month (no record), Muslim-made today (a wing of 116 listings, not a record), how to cite the museum (a UI page). Kuala Lumpur of the trail catalogue has no place record and is left out. Eighteen linked records that a topic needs but the 100 cannot hold are listed under `deferred` for E5. Tests: three new cases in `scripts/edu.test.ts` (100 distinct existing ids with trilingual prose and a correct Brief flag; every quest prophet, every Time Machine record and every appendix B topic either anchored or declared unanchored; the file stays `approval: pending` until the founder changes it).

**Waiting on the founder (decision 5):** approve or edit the list. Until then no leveled text is written; steps 2 to 6 below (validator rules, switcher, kids reader, pathways, mastery checks, Tell it back, shelf, weekly sheet) are built on the fixture record `event/hijra` and two others of the list, which the plan names as approved by design.

**Built on branch `claude/education-e2-build` (not yet merged), 23 October 2026.** Steps 2 to 6 are in one branch, not six small PRs: the shared files (`i18n/*.yaml`, `scripts/validate.ts`, `scripts/edu.test.ts`, `schema/`) changed in every step, so splitting them would have needed a rebase per step. The list PR #1389 stays on its own branch and waits for the founder's approval.

**Routes in ar, en and ur (after the founder's next deploy):** `/{lang}/event/hijra/`, `/{lang}/person/ibrahim/`, `/{lang}/building/bayt-al-hikma/` show the level switcher (Scholars by default, works without JavaScript; `edu-level` in localStorage); `/{lang}/sighar/read/{class}/{slug}/` (kids' reader, Sprouts and Explorers texts only, flagged records only); `/{lang}/sighar/explorers/` and `/{lang}/sighar/storytellers/` list the reading shelf; 12 `/{lang}/learn/teachers/pathways/{slug}/` landing pages (LearningResource JSON-LD, QR, worksheet, "mapped by the museum, not endorsed by the Ministry") and their `/print/` packs (teacher page, steps, worksheet, answer key); `/{lang}/learn/teachers/` lists the pathways by grade; `/{lang}/learn/shelf/` (`edu-shelf`, up to 60 ids, `?ids=` link carries ids only); `/{lang}/learn/parents/weekly/` (from `edu-passport` and `edu-srs`, 52 family activities). Tell it back ends every trail and the Prophet Quest finale; Sprouts Quest ends in an order-the-cards box that stores nothing.

**Data:** `edu/leveled-100.yaml` (list, pending approval); `edu/levels.yaml` (three headings in three languages, word caps 80, 160, 300); `edu/family-activities.yaml` (52 entries); `edu/stamps.yaml` gains `mastery` (`edu-quiz:`) and `tellback` (`edu-retell:`); 12 `data/exhibit/pathway-*.yaml` (curriculum block, 6 to 9 steps each, five-question quiz, worksheet with the step each answer comes from); 3 `data/source/ontario-curriculum-*.yaml`; `education` block on the three fixture records (`event/hijra`, `person/ibrahim`, `building/bayt-al-hikma`), each with the three leveled sections in ar, en and ur.

**Ontario codes:** G4-SS strand A (A1, A3), G6-SS strand A (A2, A3), CHW3M strands C, D, E, CHY4U strand B, HRT3M strands D and F, HRF3O strand D, all read from the official documents. Two stated gaps: CHW3M and CHY4U have no Silk Roads strand (the Grade 7-8 curriculum has no medieval trade strand), so the Silk Roads pathway sits under CHW3M strand E and says so; Grades 7-8 pages use the 2023 document. The Grade 8 geography page was not reachable, so no Grade 8 pathway was published.

**Tests:** `scripts/edu.test.ts` 31 cases (leveled list, levels and validator rules, reader and switcher, curriculum blocks and pathway pages, quizzes and the mastery stamp, tell-it-back, shelf, weekly sheet, family activities). `scripts/validate.ts` gains `checkLeveledReading` and `checkCurriculum`; `scripts/check-weight.ts` gains budgets for the pathway pages, the packs, the reader, the shelf and the weekly sheet; `scripts/check-site.ts` asserts that every pathway's three-language pages are in the sitemap.

**Urdu for the founder's review:** the `edu:` strings added in `i18n/ur.yaml` (leveled, pathway, mastery, tell-it-back, shelf and weekly groups); the Urdu of the three leveled texts of `event/hijra`, `person/ibrahim`, `building/bayt-al-hikma`; the Urdu of the 12 pathways (titles, expectations, steps, worksheets, answer keys, quiz questions); the Urdu of the 52 family activities; the Urdu headings `کونپلوں کے لیے`, `مہم جوؤں کے لیے`, `طالبِ علم کے لیے`.

**Evidence (plan §7):** nothing to report yet.

**To deploy:** the merge of `claude/education-e2-build` once checks are green (no Worker or workflow file is among the commits); the leveled list PR #1389 is separate and needs no deploy.

**Not done in this branch:** the Explorers map and the "tell it back" page of the Sprouts band beyond the order cards; the PDF of any pack (plan §9.1 decision 4: single-file HTML only); the 200 further leveled records (E5); the Ontario pathways for Grades 1 to 3 and the Scholars band.

**Leveled texts, batch 1 (24 October 2026):** the first 25 records of the approved list: `period/pre-islamic-arabia`, `person/muhammad`, `event/first-revelation`, `event/boycott-of-banu-hashim`, `event/first-migration-to-abyssinia`, `event/hijra` (earlier), `event/constitution-of-medina`, `event/battle-of-badr`, `event/battle-of-uhud`, `event/battle-of-the-trench`, `event/treaty-of-hudaybiyya`, `event/conquest-of-mecca`, `event/farewell-pilgrimage`, `work/quran`, `concept/al-hadith-al-nabawi`, `concept/five-pillars`, `concept/tawhid`, `practice/salah`, `practice/zakat`, `practice/sawm-ramadan`, `practice/hajj`, `concept/hijri-calendar`, `concept/madhhab`, `polity/rashidun-caliphate`, `polity/umayyad-caliphate`. Each has the three leveled sections in ar, en and ur, and an `education` block (`flagged_for_kids: true`, draft provenance). The texts are drafted from each record's own summary and the existing prose; the child levels are drafts for scholar review under docs/agents/kids-content.md §5. The validator passes with 0 errors.

**Leveled texts, batch 2 (24 October 2026):** records 26 to 50 of the approved list (25 records): `polity/abbasid-caliphate`, `place/al-andalus`, `polity/fatimid-caliphate`, `period/crusades-ayyubid-mamluk`, `event/sack-of-baghdad-656`, `polity/mamluk-sultanate`, `polity/ottoman-empire`, `period/gunpowder-empires`, `person/al-khwarizmi`, `person/ibn-al-haytham`, `person/ibn-sina`, `object/astrolabe-umar-ibn-yusuf`, `person/ibn-battuta-muhammad`, `concept/harakat-al-tarjama`, `concept/islamic-calligraphy`, `concept/girih`, `concept/masjid-umum`, `place/timbuktu`, `concept/trade-in-islam`, `place/jerusalem`, `concept/halal-haram`, `practice/eid-al-fitr`, `language/arabic`, `language/urdu`, `person/adam`. Each has the three leveled sections in ar, en and ur within word caps (80, 160, 300) and an `education` block (`flagged_for_kids: true`, draft provenance). Child levels drafted per docs/agents/kids-content.md §2 (no fear language, no graphic battle/death details, no shaming, no false promises). The validator passes with 0 errors. Batches 3 and 4 (the remaining 48 records) are in progress.
