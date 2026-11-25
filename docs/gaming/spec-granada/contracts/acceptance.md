# Granada acceptance matrix

Extends all applicable original V2 R01–R18. Every status is initially not-tested. See [JSON](acceptance.json) and [roadmap](../09-QUALITY-AND-ROADMAP.md). Optional online/programmable features must be demonstrably disabled if not approved; a pending mandatory gate blocks production release, not unrelated development.

| ID | Milestone | Requirement | Required evidence |
|---|---|---|---|
| GRA01 | G0 | Repository discovery and ownership confirmed; actual seven locales, renderer, deployment, source rights inventoried | ADRs, baseline, checkpoint, source gaps |
| GRA02 | G2 | First-time player completes water → harvest → trade → construction → quest → save loop | Unassisted browser recording, E2E, player observations |
| GRA03 | G3 | Deterministic fixed-step simulation and replay across frame rates and reload | Seeded hashes and replay fixture |
| GRA04 | G3 | Money, inventories and reservations reconcile, no free arbitrage, no duplicate settlement | Ledger, property tests, economy fixture |
| GRA05 | G3 | Raw olive valuation, overflow, oil conversion and contract alternatives correct | Fixture arithmetic and UI assertions |
| GRA06 | G3 | Finite markets, transport, processing, seasons and water affect actual economy | Scenario recordings and conservation tests |
| GRA07 | G4 | Modular castle placement, costs, construction phases, repair and blueprint valid | Placement/cancel tests and actual capture |
| GRA08 | G4 | Defense and diplomacy meaningful with civilian protection and noncombat outcomes | Independent scenario test and historical framing review |
| GRA09 | G5 | Complete authored campaign with at least three ending paths, sandbox and survival mode | Full playthroughs, test report, ending state evidence |
| GRA10 | G5 | At least three viable economic strategies and no dominant universal exploit | Seeded simulation report and human playtest |
| GRA11 | G5 | 365-day deterministic challenge validation, archives and honest local scoring | Seed/version solver and archive tests |
| GRA12 | G1/G8 | Actual high-fidelity 3D gameplay, no concept images used as backgrounds | Actual captures and independent art review |
| GRA13 | G8 | Physical GPU benchmarks, device recovery, soak, accurate browser requirements | Hardware/browser details, frame-time distributions, recovery evidence |
| GRA14 | G5 | Contextual HUD modes, no conflicting ghost, map markers reflect state, Overview visibility target | UI mask, screenshots, marker ID tests, navigation recording |
| GRA15 | G3/G8 | Regional geography correct, ports separated, historic claims and rights verified | Coordinate checks, source and license audit |
| GRA16 | G2/G8 | Save atomicity, migration, quota and corrupt save recovery; no unattended progression | Browser recovery fixtures and replay evidence |
| GRA17 | G6 | External T1 content pack works, profile isolation, safe disable and rollback | Independent sample ZIP/manifest, security fixtures |
| GRA18 | G6 | Programmable extensions only if independently security-audited; otherwise disabled | Threat model and sandbox attacks or disabled-state proof |
| GRA19 | G6 | Compatible building interchange round trip without bypassing construction rules | Blueprint export/import and cost/validation evidence |
| GRA20 | G7 | Eleventh title registered in all seven locales with nav/footer/home and docs | Localized route matrix, link test, network trace |
| GRA21 | G7 | Independent game-only build, release, staging and route-safe rollback | CI path matrix, deployment dry-run/live staging proof where authorized |
| GRA22 | G7 | Existing museum validator zero errors and citation check zero failures; no unrelated regression | Actual repo commands, timing and output |
| GRA23 | G8 | Accessible essential controls, keyboard, RTL and text scaling, language review | Functional tests, seven locale screenshots, review |
| GRA24 | G8 | Eight distinct actual gameplay perspectives, press kit and verified portal eligibility where applicable | In-engine captures, metadata, current portal policy matrix |
| GRA25 | G8 | Independent gameplay and visual review, blind human playtest, no unresolved high/critical defects | Reviewer rubric, anonymized observations, defect retests |
| GRA26 | G8 | No unauthorized deployment, paid service or external submission; optional online features honest | Approval ledger and UI inspection |
