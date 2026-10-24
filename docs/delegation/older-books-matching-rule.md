# Rule: older books need text matches, not a named edition (founder instruction, 26 Oct 2026)

Status: founder's instruction, recorded here. Not yet enforced in code. Applies to the copy checks in the authenticity ledger, and to the harvest only as stated in section 4.

## 1. What changed

For a work from the pre-print era (author died before about 853 AH / 1450 CE), a copy's sample check no longer has to match one named edition. The sample may match the text in any reliable online source. Earlier rules required the named edition for every sample, because a web snippet on its own does not identify an edition.

## 2. Conditions

All of these must hold, and each is recorded in the copy's ledger record:

1. The work is pre-print by the era rule in `docs/delegation/authenticity-policy-proposal.md`, from the author's death date (checked on two sources).
2. The sample is at least 30 rows, drawn at random with a recorded seed.
3. Each sampled row is matched, in full and without diacritics, in at least one reliable online source. A reliable source is T1, T2 or T3 in `docs/delegation/web-sources-rules.md`. A T4 or T5 site does not count alone.
4. The matching sources are recorded by URL, and at least two different owners appear across the sample. A carrier that holds the copy itself never counts as a match.
5. No row fails. A row that matches nothing, or matches only a different text, fails the sample; a failed sample blocks the copy.

## 3. What the result means

- A passed sample validates the copy's text against the wider tradition. It does not name an edition, and the ledger must say so.
- The copy keeps its own carrier tier (T5 for a GitHub repository). A passed sample raises the copy's status to "text validated by matching sources"; it does not make the carrier a T1 source.
- The work's decision is still made separately, on its named catalogue record, as before.

## 4. Harvest

The named-edition check in the harvester (`fetch_books.py`) still applies to accepted works. This rule does not waive it for the harvest, because the harvest downloads files that the sample cannot inspect. If the founder wants the waiver for harvesting too, the harvester must first exclude commentaries, certificates (إجازة), single volumes and other recensions. The 26 Oct 2026 dry run showed all three in the candidate list.

## 5. Open points for the founder

- Whether "two different owners" is enough, or whether the matches must come from T1 or T2 sources only.
- Whether the copy's status should be accepted, or only "text validated", when the carrier stays T5.
