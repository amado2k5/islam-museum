# Claims and evidence

Every quantitative or recognition claim in `whitepaper.md`, with its value, basis, date and source. Prepared
15 November 2026. Status words: **VERIFIED** (checked first-hand in this session against the source named),
**LEDGER** (taken from the project's claims ledger, `docs/audit/public-claims-audit-2026-11-15.md`, not re-measured),
**AUTHOR** (supplied by the author; not checked), **UNVERIFIED**, **CUT** (left out of the paper).

## Scale and state, repository basis (commit `63475724ce`, 15 November 2026)

| Claim | Value | Status | Source |
|---|---|---|---|
| Record files in total | 64,374 | LEDGER | Ledger section 8, third pass |
| Content records | 54,823 | LEDGER | Same |
| Source records | 9,551 | LEDGER (by subtraction: 64,374 − 54,823) | Same |
| Draft content records | 44,469 (81.1%) | LEDGER; percentage recomputed | Same; includes the two records of row R20 |
| Published content records | 10,354 (18.9%) | LEDGER; percentage recomputed | Same |
| Content records citing a book | 55.1% | LEDGER | Same |
| Preliminary cards | 11,260 (20.5%) | LEDGER | Same |
| AI-named generator | 48,446 (88.4%) | LEDGER; percentage recomputed | Same |
| Script-made | 6,377 (11.6%) | LEDGER; percentage recomputed | Same |
| Every published record names an AI agent | 100% | LEDGER (measured at `8d478cd72`; same result at `3303457041` today) | Ledger section 1; script re-run in this session |
| Relations | 88,506 | VERIFIED | `git show 63475724ce:docs/coverage.md` ("88506 edges") |
| Record classes | 25 | VERIFIED | `schema/*.schema.json`, excluding `_base` |
| Predicates | 99 | VERIFIED | `git show 63475724ce:schema/predicates.yaml` |
| Counts are pattern matches, two records added by hand | — | LEDGER | Ledger row R20 |

## Earlier basis the same day (commit `8d478cd72`), labelled as such in the paper

| Claim | Value | Status | Source |
|---|---|---|---|
| Source records that are Wikipedia or Wikidata pages | 74.2% | LEDGER | Ledger section 1 |
| Content records on non-book sources only | 16.8% | LEDGER | Same |
| Content records on Wikipedia or Wikidata only | 7.7% | LEDGER | Same |
| Content records citing no source record | 22 | LEDGER | Same (still 22 at `3303457041`) |

## Live-site basis (built 14 November 2026, read 15 November 2026)

| Claim | Value | Status | Source |
|---|---|---|---|
| Records shown by the build | 63,078 | LEDGER | `/api/v1/meta/counts.json` (`entities`), as read for the ledger. Not re-read in this session |
| Record pages | 194,832 = (63,078 + 1,866) × 3 | LEDGER | Home page; `site/src/lib/numbers.ts`; ledger third pass |
| Stubs | 1,866 | VERIFIED | `docs/coverage.md` at `63475724ce` |
| Pathways | 300 | LEDGER | 300 `exhibit/path-*` records, ledger third pass |
| Grand Tour stops | 40 | VERIFIED | Audit script, `tour/grand-tour.yaml` |
| Grand Tour languages | Arabic, English | VERIFIED | Audit script (`TOUR_LANGS`) |
| Nine wings | 9 | VERIFIED | `schema/enums/wings.yaml` |
| Fourteen centuries | 14 | LEDGER | `docs/fable-run/VERIFICATION.md`, statement 2. Two wings are each reached by one stop |
| Education Explorer courses | 65 | VERIFIED | Audit script |
| Lessons | 361 | VERIFIED | Audit script |
| Discoveries | 659 | **CUT** | Not verifiable from the script |
| Search: canon record first for 2 of 50 queries, 11 November | 2/50 | LEDGER | Ledger row R9; not re-measured |

## Archive and identifiers

| Claim | Value | Status | Source |
|---|---|---|---|
| Dataset concept DOI | 10.5281/zenodo.23692511 | VERIFIED | Zenodo API and DataCite, 15 November 2026 |
| Versions on the record | 13 | VERIFIED | Zenodo API |
| Latest version | v2026.11.15, DOI 10.5281/zenodo.24246204, `IsVersionOf` the concept DOI | VERIFIED | Zenodo API and DataCite |
| Record title, creator, ORCID, type | As cited | VERIFIED | Same |
| Zenodo licence field says CC0 for the whole archive | — | VERIFIED | Same; ledger row R19 |
| Paper DOI | Placeholder | — | To be assigned |

## Licences, method and rules

| Claim | Status | Source |
|---|---|---|
| Data CC0 1.0; prose CC BY-SA 4.0; code MIT; media per item | VERIFIED | `docs/data/README.md` section 1; `LICENSE-CONTENT.md` |
| Validation chain (schema, encoding, authenticity, content safety, registers, decisions) | VERIFIED | `package.json`, script `validate` |
| "Zero errors" is the merge rule | VERIFIED as a rule | `AGENTS.md`. The validator was **not run** in this session; the paper states the rule, not a result |
| Publication rule of 15 November 2026 | VERIFIED | `AGENTS.md` (dec-20261115-286) |
| Two independent sources for faith; doubt rule `unknown` | VERIFIED | `docs/agents/lanes/modern-figures.md` rules 2–3; `schema/enums/faith.yaml` |
| Hard block on designated organisations' material, enforced by the validator | VERIFIED | `AGENTS.md`; `scripts/check-extremism.ts` in the validate chain |
| Arabic parenthesis isolation; no typed honorifics; Qur'an text from Tanzil only | VERIFIED | `AGENTS.md` |
| Forty-word quotation limit; source files kept out of git | VERIFIED | `AGENTS.md` (Licences) |
| Static site, no model at runtime | VERIFIED as a rule | `AGENTS.md`; not tested on the live site |
| No accounts; no advertising or analytics code found | LEDGER | Ledger section 2, "SUPPORTED" |
| WCAG 2.2 AA baseline, self-assessed, partially conformant | LEDGER | Ledger section 2 |
| API files as described; no SPARQL, OAI-PMH or MARC | VERIFIED | `docs/data/README.md`; `i18n/en.yaml` developer page |
| OpenAPI description in the repository | VERIFIED file exists; **conflict** | `site/public/openapi/v1.json` exists; the developer page says there is none |
| Schema.org structured data typed by class | VERIFIED in source | `site/src/lib/entity.ts`; not checked on rendered pages |
| Source-first compilation from verified scans | AUTHOR, qualified in the paper by the 55.1% figure | Author's brief; `docs/library/harvest-register.yaml` exists |

## Recognition, governance, costs, dates

| Claim | Status | Source |
|---|---|---|
| Library and Archives Canada took the site into its preservation scope, 4 November 2026, and proposed a test crawl, which the author accepted | VERIFIED | `docs/outreach/marketing-and-outreach-register-2026.md`, line of 4 November. Wording follows the register, not the brief's "a test crawl was accepted" |
| DPGA application GID0094424, submitted 17 October 2026, under review, not listed | VERIFIED | Same register, line of 17 October; `docs/status.md` |
| Launch 11 October 2026 | LEDGER | Ledger row R14 (public registration record) |
| Idea August 2025; prototype timelinethis.app with Google AI Studio | AUTHOR / **UNVERIFIED** | Ledger row 15: the UNESCO dossier says September 2025 for the prototype |
| No organisation or board; Ontario incorporation planned | VERIFIED | `i18n/en.yaml` `forward_1`; ledger |
| About CA$1,900 in a recent month, about CA$900 for AI assistants | LEDGER | Ledger row 7 (Support page) |
| About CA$90 hosting | AUTHOR / **UNVERIFIED** | Not checked on the Support page |
| No grant funding | LEDGER | Ledger section 4 |
| No formal user study | LEDGER | Ledger section 4 |
| No academic papers or preprints citing the dataset DOI known | AUTHOR | Author's brief. No citation index was searched in this session |
| "Five weeks" since launch | VERIFIED | 11 October to 15 November 2026 is 35 days |

## Claims deliberately not made

DPGA listing; any UNESCO nomination or submission; a live Wikidata item; a human-reviewed or peer-reviewed corpus;
complete Urdu coverage; user numbers; classroom outcomes; an accuracy rate; an Altmetric score; inclusion in any
index; the author's employer; any other project of the author.

## Figures today, for the author's information (not used in the paper)

The script was re-run in this session at commit `3303457041` (15 November 2026, 21:31 −05:00): 66,071 record files;
56,355 content records; 81.2% draft; 18.7% published; 56.2% cite a book; 11,260 preliminary cards (20.0%);
90,593 edges in `docs/coverage.md`. The paper keeps the frozen basis of `63475724ce`.
