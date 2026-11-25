# Acceptance matrix: real status

_Updated 25 November 2026. The criteria are the founder's (`spec-v2/contracts/acceptance.json`) and are not edited here; only the status and the evidence columns change, and only with something that was actually run. The machine-readable copy is [`acceptance.json`](acceptance.json)._

No gate has passed. Seven have partial evidence. One game exists as a prototype (Atlas); every per-game gate is open for the other nine.

| ID | Scope | Requirement | Evidence required | Status | Evidence so far |
|---|---|---|---|---|---|
| R01 | platform | All seven actual locale routes, header/footer and homepage Play box | browser locale matrix + network trace | **not-tested** | Nothing yet. |
| R02 | platform | Separate gaming build and route-safe rollback | CI logs, staging and rollback proof | **not-tested** | Nothing yet. |
| R03 | platform | Existing museum validator zero errors and citation check zero failures | actual repository command outputs | **in-progress** | npm run validate on branch claude/islam-museum-gaming-v2-c9bd91, 25 Nov 2026: 0 errors (89,037 entities, 254,481 prose files, 7,674 warnings, 4 min 48 s). No museum content changed, so the citation check has nothing to check yet. Re-run on every gaming pull request. |
| R04 | each_game | Complete playable scoped loop and campaign or challenges, failure/recovery | real browser playthrough recording and test | **in-progress** | Atlas only (prototype): a full five-round daily game played in real Chrome 158 by script in seven languages, docs/gaming/evidence/m2/atlas/. No recording, no human playthrough. The other nine games do not exist. |
| R05 | each_game | Save, reload, migration and corruption recovery | fixtures and browser tests | **in-progress** | Atlas only: save round trip, unreadable save set aside, newer save not overwritten, damaged entry dropped, game from another pack not resumed (unit tests), reload in mid-game and corrupted save (browser script). Only one save version exists, so there is no migration to test yet. |
| R06 | daily_games | 365-day deterministic challenge solvability | solver output, dataset digest, UTC fixtures | **in-progress** | Atlas: all 365 scheduled days checked valid by the unit tests on the pinned pack (digest 764f347c…f69ae): five different places a day, no round twice, UTC fixtures over month ends and leap days. "Solvable" here means every round has one recorded place with site or locality coordinates; no solver is needed. Other daily games do not exist. |
| R07 | each_game | Historical facts and asset rights verified | record IDs, citation and license audit | **in-progress** | Atlas: every round is a museum record id joined to a museum place id; no image or third-party asset is used; coastlines are Natural Earth via world-atlas (public domain). No independent citation or licence audit has been done. |
| R08 | each_game | Seven locales and essential accessible controls | screenshots, functional tests, human language review | **in-progress** | Atlas: interface in all seven languages, right-to-left for Arabic and Urdu, keyboard-only play and typed coordinates, screenshots in evidence/m2/atlas/. Strings are AI-written and unreviewed by a native speaker; Turkish and Indonesian personal names are borrowed from English. |
| R09 | 3d_games | Actual real GPU benchmark, soak and device loss | hardware/browser/driver, p95 and actual captures | **in-progress** | One machine only: Apple M4 Max, Chrome 158, reference district. docs/gaming/evidence/m1/. No soak, no device-loss test, no Windows or discrete-GPU machine, Edge run did not start. See m1-graphics-spike.md. |
| R10 | each_game | Independent visual and gameplay review, blind human playtest | anonymized observations and evidence rubric | **not-tested** | Nothing yet. |
| R11 | sdk | Independent pack and third-party game sample works | external fixture, installation, disable and reload | **not-tested** | Nothing yet. |
| R12 | mod_runtime | Threat model and adversarial security tests pass | independent review and attack fixtures | **not-tested** | Nothing yet. |
| R13 | programmable_mods | Strong isolation and metered execution independently verified | sandbox tests; otherwise disabled | **not-tested** | Nothing yet. |
| R14 | each_game | No unresolved critical/high defects | triage and retest evidence | **not-tested** | Nothing yet. |
| R15 | eligible_portal_builds | Current portal rules and embedded export verified | policy links dated, ZIP test and SDK evidence | **not-tested** | Nothing yet. |
| R16 | platform | Actual release status, press captures, docs and support policy | site and documentation review | **not-tested** | Nothing yet. |
| R17 | interchange | Two validated cross-game round trips | export/import fixtures and provenance | **not-tested** | Nothing yet. |
| R18 | online_optional | Authoritative security privacy capacity cost approval | load and abuse tests plus founder approval | **not-tested** | Nothing yet. |

A gate is `passed` only when every piece of its required evidence exists in this repository. Human playtests, review by someone who did not write the code, and measurements on physical machines cannot be produced by an agent alone; where they are missing the gate stays open and the ledger says what is needed.
