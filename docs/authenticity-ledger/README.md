# Authenticity ledger

One record per harvested book, in `books/<id>.yaml`. The ledger is the running record of how each item was validated, verified and traced. It is part of the authenticity policy (`docs/delegation/authenticity-policy-proposal.md`) and is checked by `scripts/harvest/library/authenticity_ledger.py --check`.

## What a record holds

- `id`, `kind`, `title`, `author` (name and death date in AH, from `books.yaml`)
- `era`: derived from the author's death date (pre-print, early print or modern)
- `harvest`: the harvest folder, the number of harvested files and their SHA-256 hashes (fixity)
- `work_sources`: the named edition or catalogue record the work is validated against, if any
- `copies`: each copy held, with its location, carrier and carrier tier, records and numbering, named source and status
- `checks`: each check made, its date, the basis it was made against, its result and whether it counts (`valid`)
- `decision`: the work decision (accept, label, reject or undecided), who made it and when, and the reason
- `history`: dated events

## What a record never holds

No book text, no hadith text, no translation and no excerpt. A record that holds any of these fails the check. Copies that are kept outside git are recorded by location and hash only.

## How records are made

- Harvested books: `authenticity_ledger.py` creates one record for each canon book that has a harvest folder. It refreshes only the harvest facts. It never overwrites a decision, a check or the history.
- Books that are not harvested but have a decision (for example Sunan Abi Dawud, accepted on a catalogue record): written by hand, following the same format.

## Rules

- A decision is only recorded by the founder, and it must match `scripts/harvest/library/authenticity.yaml`.
- A check counts only if its `basis` is a named edition or institutional record. Checks against websites are recorded with `valid: false`.
- Records are committed to the repository. The books they describe are not.
