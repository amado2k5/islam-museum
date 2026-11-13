# islam.museum — Production acceptance test (requirements + last-day features)

**Tested:** 2026-11-10, 18:19–18:53 EST, live production https://islam.museum
**Build under test:** deploy.json — commit `8d1b0ef9` (merge PR #5974), build_run 42832259141, v1.10.0, deployed 2026-11-10T18:33:45Z
**Scope:** (1) the repo's documented requirements (21 checks from the requirements inventory), (2) every feature merged to main in the last 24 h (census: 524 commits, 169 PR merges), (3) regression checks for the 9 fixes in that window.

## Headline

- **Requirements pass: 15 of 21 checks PASS, 6 FAIL.**
- **New-feature pass: 8 of 11 checks PASS** (one further "fail" was an error in the test itself — see Khulafa note).
- **Deployment delta is small:** ancestry-verified, 161 of the 169 merges of the last 24 h are already inside the production build. Only 8 are not: #5740 geo-enrichment (12,451 files), #5975 canon field (invisible by design), five requirements-docs PRs (#5976, #5979–#5982) and a .gitignore chore (#5983). **Every failure below is a defect in the live build, not deployment lag** — except where noted.

## Part 1 — Requirements pass (21 checks)

PASS: map palette (black/white/gold `#c5a059` in both themes) · free pan, no clamp · basemap at all zooms · time/step controls (direction correct AR/EN) · no scroll trap (desktop) · Graph Explorer (verified against the Muhammad page, re-centring works, no CORS errors) · entity pages incl. multi-wing tags · counts (homepage AR = EN = counts.json: 53,990 entries · 108,000 pages · 300 pathways; wings Time 4,983 · Place 3,883 · People 11,351 · Ideas 2,506 · Objects 6,338 · Words 10,574) · kids' wing · search · API/FR-16 surface · 3D landing + no-JS fallback · 3D enter (light).

FAIL:
- **D1 — Map city selection broken (check 4).** World → region works (~460 place buttons for Levant/Iraq), but Baghdad and Mecca buttons are refused as "covered" by overlapping markers at zoom 1, 2 and 2.5 — markers scale with zoom and stay piled. Clicks on the brightest Iraq cluster opened Adana (آذنة) twice, showing "no documented materials for this place in this year yet" at years 11/41/1003. The spec requirement "city click lists ALL linked entities" is unverifiable; Baghdad's own page lists hundreds of linked persons/events. This build's changelog (v1.5.0) claims "City orbits show every linked entity" — broken in this build.
- **D2 — Object detail pages show no photograph (check 11).** Coronation Mantle (/ar/object/abaat-tawij-rughar/): decorative banner + timeline only; the same object's image appears in search listings and as the first gallery item on /ar/objects/. The v1.3.1 changelog claims the CSP img-src fix for collection photographs already shipped.
- **D3 — "(needs_source)" leaks into rendered prose (check 12).** Muhammad page ×4 (Omar Abdelkafy "شرح كتاب الفوائد (الحلقة 8)" section), Badr page ×3 ("الدين القيم" section). Dates themselves PASS: dual Gregorian/Hijri rendering correct, pre-Hijra as ق.هـ, no Hijri year 0, no U+FFFD.
- **D4 — Backstage stale (check 14).** /ar/backstage/ says "Last updated: 7 November 2026" and 49,505 entries / 99,000 pages, vs live 53,990 / 108,000.
- **D5 — People hall not populated (check 15).** /ar/people/ shows only concept-type cards plus the note "the full People hall arrives in a later phase". The same "later phase" note also appears on the Time, Ideas, Living, Today and Made halls. All 9 halls load.
- **D6 — Changelog renders literal route templates (check 16).** /ar/changelog/ v1.5.0 entries show "/{lang}/place/" and likewise /{lang}/seerah/, /{lang}/learn/courses/, /{lang}/nature/, /{lang}/ghayb/, /{lang}/battles/, /{lang}/companions/, /{lang}/khulafa/, /{lang}/asma/, /[lang]/asma/<slug>/, /{lang}/decisions/, /{lang}/3d/ as literal page text.

## Part 2 — Last-day features pass (11 checks)

Census of the window (2026-11-09T23:30Z → 2026-11-10T22:57Z, head `e1faf3e8`): 169 PR merges — FEATURE 14 · CONTENT 135 · FIX 9 · INFRA/CI 6 · DOCS 5. Five new browsers shipped in one day (Companions, Asma, Qudsi, Ghayb, Battles) plus Khulafa pages, the Seerah & Life guide and ~494 Nature records.

PASS:
- **S1 Companions** — AR/EN/UR load; the Ten, circles (Muhajirun 73 · Ansar 163 · Ahl al-Bayt 11 · Mothers of the Believers 11), women section, A–Z list, working no-reload filter, /women/ and /decade/ facet pages, valid API JSON, homepage card. (Counts seen: 603 listed vs 606 claimed; women 101 vs 103 — see drift note.)
- **S2 Asma** — 99-name grid, filter narrows (Rahman → 1), per-name pages with meaning, graph-grouped stories, paired names, and the citation footnote list renders (fix #5973 verified live). Valid API JSON.
- **S5 Hadith Qudsi** — AR/EN/UR show 117 groups / 350 narrations from 7 books; narration chips land on real passage pages (Bukhari 557 checked); valid API JSON; homepage card. Caveat: one theme holding 7 groups has a blank heading in all three languages ("· 7").
- **S6 Ghayb** — 85 records in 8 sections incl. the miracles section (Musa's nine signs, the Flood, parting of the sea, Noah's ark, Lot, 'Ad, Thamud); Dukhan record shows its perspectives section. Valid API JSON.
- **S7 Seerah & Life** — 26 practice cards in AR/EN/UR; search and chip filters narrow without reload; Qur'an citations link to passage pages with no typed verse text on the page; homepage card shows the custom gold-sun/teal-path motif.
- **S9 Death dates (fix #5972)** — Mu'adh ibn Jabal (d. 639 CE / 18 AH, Plague of Amwas) and Thabit ibn Qays (martyred at Yamama, 12 AH / 634 CE) both consistent.
- **S10 Prose headings (fix #5835)** — long-prose pages render section headings (Mu'adh, Thabit, Badr sampled).
- **S11 Restored pages (fixes #5852/#5864/#5854)** — Wadi al-Khaznadar 1299 page ends complete (it is an unreviewed stub card — no long prose written yet — but nothing is truncated); Ibn Mas'ud reads death year 32 AH.

FAIL / PARTIAL:
- **D7 — Battles ghazawat split contradicts itself (S4).** /ar/battles/ghazawat/ states "57 غزوة و15 سرية" = 72 entries; the /ar/battles/ index tile states 53 ghazawat + 22 saraya = 75 — the split the requirements doc (engineering 20) also specifies. One derivation is wrong; the site disagrees with itself. The rest of S4 passes: index totals 3,250 records across 11 kinds, Badr shows both sides (Muslims of Medina 313–317 led by Muhammad; Quraysh 1000 led by Abu Jahl) and a locator map; battles API valid; /ur/battles/ renders in Urdu (probe passed — no English fallback).
- **D8 — Footnote anchors incomplete in the #5974 scope (S8).** The anchor mechanism works (proven on /ar/asma/asma-al-rahman/: marker → #note-1). But five sampled nature subjects (camel, moon, iron, olive, ant) render with NO footnote markers at all, and the teacher pathway /ar/learn/teachers/pathways/g11-chw3m-rise-of-islam/ shows a plain-text † after the curriculum-review date with NO matching footnote entry on the page or its /print/ view. PR #5974 — this production build's own merge commit — was supposed to fix footnote anchors on exactly these two page families.
- **D9 — Khulafa chains API missing (S3).** /api/v1/chains.json returns 404 on both hosts; khulafa.json (valid) has top-level keys generated/feature/items only, items carry per-person succession edges (connections: successor_of / predecessor_of / ruled_over / reign_saw; story_roles reign dates; some items expose predecessors/successors arrays) but no chains dataset or reign-sequence array; no OpenAPI index or directory listing exists to point elsewhere. PR #5813's claim of "/api/v1/khulafa.json + chains.json" is half-undelivered. The during_reign wiring itself WORKS (Ajnadayn correctly links Abu Bakr and Umar); the roster lists 165 reigns and reign pages load.

**Test error, not a defect:** the S3 check asked for a "during the reign of" link on Badr — Badr (624 CE) predates the caliphate, so no such link can exist. Withdrawn.

## Observations (not failures)

- Count drift between PR claims and the live build: Companions 603 vs 606 (women 101 vs 103) · Qudsi 117 groups/350 narrations vs 113/331 claimed · Khulafa 165 vs ~160 · Battles 3,250 vs 3,251. Small, but pages and claims should agree — one side is wrong in each pair.
- Homepage Battles Explore card is still labelled "قيد الإعداد" (under preparation) although /ar/battles/ is live (the census shows the Explore entry shipped `ready:false`).
- Map: region labels overlap at world zoom in both themes/languages; light-theme gold labels are low-contrast on cream; the region-level place list (~460) does not visibly shrink as the year changes (only the place-level message is year-scoped); time control steps +10 Hijri years per click (confirm against spec 19 whether decade-stepping is by design).
- Graph: children edges are labelled "ابن/ابنة" in the graph where entity pages group the same people under "والد/والدة" (inverse labelling of the same relation).
- Search: for صلاح الدين the top hits are film/TV (screen) entries above the person page; loading /ar/search/?q=… directly shows nothing until typing.
- Not tested: map behaviour on mobile (no emulation available); full 3D tour run (light pass only, per instructions).

## Not defects (do not chase)

- Canon `importance` field (#5975) is not visible — by design (not rendered/exported) and not in this build anyway.
- Geo-enrichment (#5740) is not in this build — expected at the next deploy; the map checks above should be re-run after it lands, since richer coordinates may change marker clustering (D1).
- Badr has no caliph link — historically correct.

## Retest after fixes + next deploy

D1–D9, the count-drift pairs, the Qudsi blank theme heading, the Battles Explore card flag — plus a fresh map pass once #5740 is live.
