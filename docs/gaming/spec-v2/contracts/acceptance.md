# Acceptance matrix

Machine-readable [JSON](acceptance.json). All statuses are initially not-tested. Update in repo with actual evidence, do not edit criteria to hide failure. Optional feature gates apply only if enabled.

| ID | Scope | Requirement | Evidence |
|---|---|---|---|
| R01 | platform | All seven actual locale routes, header/footer and homepage Play box | browser locale matrix + network trace |
| R02 | platform | Separate gaming build and route-safe rollback | CI logs, staging and rollback proof |
| R03 | platform | Existing museum validator zero errors and citation check zero failures | actual repository command outputs |
| R04 | each_game | Complete playable scoped loop and campaign or challenges, failure/recovery | real browser playthrough recording and test |
| R05 | each_game | Save, reload, migration and corruption recovery | fixtures and browser tests |
| R06 | daily_games | 365-day deterministic challenge solvability | solver output, dataset digest, UTC fixtures |
| R07 | each_game | Historical facts and asset rights verified | record IDs, citation and license audit |
| R08 | each_game | Seven locales and essential accessible controls | screenshots, functional tests, human language review |
| R09 | 3d_games | Actual real GPU benchmark, soak and device loss | hardware/browser/driver, p95 and actual captures |
| R10 | each_game | Independent visual and gameplay review, blind human playtest | anonymized observations and evidence rubric |
| R11 | sdk | Independent pack and third-party game sample works | external fixture, installation, disable and reload |
| R12 | mod_runtime | Threat model and adversarial security tests pass | independent review and attack fixtures |
| R13 | programmable_mods | Strong isolation and metered execution independently verified | sandbox tests; otherwise disabled |
| R14 | each_game | No unresolved critical/high defects | triage and retest evidence |
| R15 | eligible_portal_builds | Current portal rules and embedded export verified | policy links dated, ZIP test and SDK evidence |
| R16 | platform | Actual release status, press captures, docs and support policy | site and documentation review |
| R17 | interchange | Two validated cross-game round trips | export/import fixtures and provenance |
| R18 | online_optional | Authoritative security privacy capacity cost approval | load and abuse tests plus founder approval |
