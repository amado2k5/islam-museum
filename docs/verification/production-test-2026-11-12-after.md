# islam.museum — Production retest AFTER the Fable 5.2 landing (before/after comparison)

**Tested:** 2026-11-12, ~21:15–21:25 EST, live production https://islam.museum
**Build under test:** deploy.json — commit `eeb962b7`, build_run 43290221939, v1.28.0, deployed 2026-11-12T23:42:55Z
**Before baseline:** the 2026-11-10 production acceptance test (build v1.10.0, commit `8d1b0ef9`) — `islam-museum-production-test-2026-11-10.md`, defects D1–D9.
**Method:** the same checks, re-run: endpoint/API probes (curl) + an interactive browser pass (map, tour, courses, search, graph). Muse (independent of the Fable run) is the tester in both passes.

## Headline

- **Of the nine Nov 10 defects: 7 FIXED, 1 PARTIAL, 1 NOT FIXED.**
- **Both Fable-era features verified live and working:** the Grand Tour / River of Time and the Education Explorer.
- **Live figures consistent everywhere checked:** 58,128 entries — homepage = counts.json = Backstage.
- **Search still does not return the canon first for the hardest head query ("Muhammad")** — corroborating, on production, the NOT-GREEN that Fable's own ledger recorded for its statement 6.

## Defect-by-defect (D1–D9)

| # | Defect (Nov 10) | After (Nov 12) | Evidence |
|---|---|---|---|
| D1 | Map city selection broken — Baghdad/Mecca refused as "covered", wrong city opens | **FIXED** | Baghdad opens by list button and marker: "Linked records: 982" (Person 781, Event 187). Mecca opens correctly: 554 linked records. Map now shows 3,873 places; geo-enrichment (#5740) has also landed since the before test. |
| D2 | Object detail pages show no photograph | **FIXED** | Coronation Mantle page now embeds its Wikimedia photograph (Pluviale of the Holy Roman Empire) as a real `<img>`. |
| D3 | "(needs_source)" leaks into rendered prose (Muhammad ×4, Badr ×3) | **FIXED** | 0 occurrences on the Muhammad page and 0 on a Badr event page. |
| D4 | Backstage stale (7 Nov; 49,505 entries) | **FIXED** | "Last updated: 12 November 2026", 58,128 entries — matches live. |
| D5 | People hall = concept cards + "later phase" note (also on 5 other halls) | **FIXED** | /en/people/ carries 11,592 distinct person links; 0 occurrences of "later phase". |
| D6 | Changelog renders literal /{lang}/ route templates | **FIXED** | 0 occurrences of `/{lang}/` or `/[lang]/` in /en/changelog/. |
| D7 | Battles ghazawat split contradicts itself (page 57+15=72 vs index 53+22=75) | **FIXED** | Index now states 57 ghazawat + 15 saraya, agreeing with the ghazawat page; battles total 3,251 (the figure the PRs had claimed). |
| D8 | Footnote anchors incomplete (nature subjects render no markers; a stray † on a teacher pathway) | **PARTIAL** | The anchor mechanism verified working (Asma al-Rahman page: 3 working #note- anchors). But sampled nature pages (camel, apes) still render with no footnote apparatus at all — no markers, no notes list — unchanged from Nov 10 on that page family. |
| D9 | chains.json 404 on both hosts; no OpenAPI index | **NOT FIXED** | api.islam.museum/api/v1/chains.json → 404; openapi.json → 404; /api/v1/ → 404. Succession edges still exist inside khulafa.json items; the standalone chains dataset still does not exist. |

## Fable-era features (new in this build)

- **Grand Tour / River of Time — PASS.** /en/grand-tour/ states "Stops: 40 · Wings: 9 · Centuries: 14". Walked live: Begin → Stop 1 "The Kaaba" → Next → Stop 2 "The first revelation" (10 August 610 CE) — navigation works in order. Completion room reachable ("You have walked the spine of the museum"); it is not gated on visiting all 40 stops.
- **Education Explorer — PASS.** /en/learn/courses/ lists 65 Ontario courses (Grades 1–12). Walked live: Grade 1 Science and Technology → lesson "Who has helped science and technology?" — displays official expectation codes verbatim ("A3.1", "A3.3") and links lessons into museum records (al-Jazari; Ibn al-Shatir's sundial). The lesson pages disclose their own state: "Draft: these lessons were written with AI help and have not yet been read by a human editor."
- **Counts integrity — PASS.** counts.json: entities 58,128 (wings: time 5,048 · place 3,891 · people 11,598 · ideas 2,627 · objects 6,339 · words 13,538) = homepage = Backstage.
- **Graph Explorer — PASS (regression check).** From the Muhammad page, the graph renders a labelled constellation (Person 13 · Place 2 · Event 6 · Work 3 · Concept 1), no errors.

## Search ranking (echoes Fable statement 6)

- "Saladin" → the person page is the top result. **PASS.**
- "Muhammad" → top result is an **object** ("Tughra of Shah Muhammad ibn Ibrahim") out of 13,245 results; the person page is not first. **FAIL** — the same failure class Fable's own ledger measured on production (48 of 50 queries not canon-first). Also unchanged: loading /en/search/?q=… directly shows nothing until Enter is pressed in the box.

## What this retest did not cover

- Fable ledger statements 4 (graph reachability — 12 dead-end cornerstones; 38.1% of published records within 3 hops) is a repo-level oracle result from Fable's own run; it was not re-derived here. It stands as Fable reported it: NOT GREEN.
- The four founder decisions from the Fable ledger (machine-written Tour narratives on published records; the two Fable-added wing assignments; the Wikipedia-language-count canon cache outside git; the Ahmed III cornerstone) remain founder decisions, unaffected by this retest.
- Mobile map behaviour and the full 3D tour were out of scope, as in the before pass.

**Retest verdict: the deployed build fixes 7 of the 9 independently documented defects, ships both flagship features working, and leaves two honest open items — chains.json/OpenAPI (D9) and canon-first search — plus one partial (nature-page footnotes, D8).**
