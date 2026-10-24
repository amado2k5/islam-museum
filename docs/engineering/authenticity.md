# Authenticity checks: engineering reference

Status: applied in code on 25 and 26 October 2026. The rules are in `docs/delegation/authenticity-policy-proposal.md`; the public page is `/{lang}/authenticity/`. This file says where each check lives and how to run it.

## Parts

| Part | Where | What it does | Runs in |
|---|---|---|---|
| Decision register | `scripts/harvest/library/authenticity.yaml` | One entry per decided item (accept, label or reject) and one per registered source (tier and status) | Read by the validator, the gate and the ledger |
| Validator | `scripts/check-authenticity.ts` (`npm run check:authenticity`) | Checks the rules on each decision and source: an accept needs a Sunni school with two evidence entries and a basis; a label or reject needs a reason; sources need a tier, a status and a date; blocklisted sites must be marked blocked. Undecided canon books only warn | `npm run validate`, so every check-in |
| Harvester gate | `scripts/harvest/library/authenticity_gate.py`, called from `fetch_books.py` | Refuses to fetch a book whose decision is `reject`; fetches `label` and `accept` books; warns for books with no decision. `--require-decision` refuses undecided books | Before every harvest run |
| Ledger | `scripts/harvest/library/authenticity_ledger.py`, records in `docs/authenticity-ledger/books/` | One metadata record per harvested book: title, author and death date, era, harvest folder, file count and SHA-256 hashes, decision and checks. Holds no book text | `--check` runs on demand; generation runs after a harvest |
| Public page | `site/src/pages/[lang]/authenticity/index.astro`, text in `i18n/{en,ar,ur}.yaml` (`authenticity:` block) | Explains the gate, the decisions, the sources, the records and where the rules live | Every site build |
| Footer link | `site/src/layouts/BaseLayout.astro` | Links to the page from every page | Every site build |

## Commands

```bash
npm run check:authenticity            # validate the register (also part of npm run validate)
npm run validate                      # full validation, including the register
python3 scripts/harvest/library/authenticity_gate.py sunan-abi-dawud   # what the gate would do for one book
python3 scripts/harvest/library/fetch_books.py --only ID --dry-run --require-decision   # gate, then search (no download)
python3 scripts/harvest/library/authenticity_ledger.py          # create or refresh ledger records from the harvest
python3 scripts/harvest/library/authenticity_ledger.py --check  # verify ledger records: ids, decisions, no text-like keys
```

## Rules the code enforces

- Only the founder records decisions. The register holds `decided_by` and `decided_on` for each decision.
- An `accept` needs `school: sunni`, two `school_evidence` entries and an `authenticity_basis`. The validator checks that the fields are present; it does not judge their quality. That judgement is recorded by the founder.
- A ledger's work decision must match the register's decision for the same id. A mismatch is an error.
- A ledger record must not contain text-like keys (`text`, `arab`, `content`, `body`, `hadith`, `matn`). This keeps book text out of git.
- Expiry dates and re-check dates are not yet enforced. They are part of the rules proposal.

## Known limits (do not claim these as automated)

- Sampling against a named edition is manual. The gate records a sample; it does not run one.
- Wikipedia, Wikidata and catalogue lookups are manual. The code does not check them.
- The blocklist is empty. It must be filled, dated and checked by hand before it counts as evidence.
- Undecided books are only a warning. This is intentional: older work predates the gate.
- The public page and the submission documents are edited by hand. Changes to them need the label `submission-impacting` under `docs/ai-change-gates.md` section 3.

## Websites and the items they hold

Websites are registered as sources (`kind: website`) with the uses they allow (`allowed_uses`: pointer, grades, facts, text). Articles, theses, whitepapers and research papers are item kinds with their own decisions. The validator enforces: a website needs a retrieval date; a T5 or not-verified source may only be a pointer; `text` needs a T1 source or a valid 30-row sample against a named edition; unknown uses are errors. Website records live in `docs/authenticity-ledger/websites/` and are checked by `authenticity_ledger.py --check` against the register. Full rules: `docs/delegation/web-sources-rules.md`.

## Changing the rules

1. Propose the change in `docs/delegation/authenticity-policy-proposal.md`.
2. Get the founder's written approval.
3. Change the validator, the gate or the ledger, with tests for the new rule.
4. If the public page or a submission claim changes, update both in the same commit and label it.
