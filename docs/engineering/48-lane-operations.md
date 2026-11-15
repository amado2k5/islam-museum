# 48 · Lane operations: how the content lanes run day to day

This is the engineering view of how the lanes run: who does what, how work is
handed out and checked, how it reaches `main`, and what the orchestrator does
on each check-in. It describes what is in force. The packet mechanics (manifest
fields, the scoped check, the train, the rejection path) are specified in
[`docs/agents/pipeline.md`](../agents/pipeline.md) and are not repeated here.
The lane brief and rules are in [`docs/agents/orchestration/`](../agents/orchestration/README.md).

The founder's rules that bind every step are in [`AGENTS.md`](../../AGENTS.md).
In particular: no lane or worker is ever idle or blocked; a question is logged
and the next item is taken; Qur'an text is never typed; the terrorist-organisation
block applies to every packet; and only the lander merges lane content.

## 1. Roles

| Role | Model in use | What it does | What it may not do |
|---|---|---|---|
| Orchestrator | the session that runs this document | Owns the board and the queue, starts and checks workers, runs the check-in, decides what goes to the founder | Writes lane content itself while workers can do it |
| Lane worker (A microSD books, B web sources, C lectures and works) | Haiku 5.5 | Takes one slice from its lane queue, writes one packet, claims it on the board | Merge, push to `main`, edit `CANARY.md`, spawn sub-workers, touch another worker's files |
| Verifier | Sonnet 5.5 | Checks drafting packets against the source, fixes what it finds, runs the scoped check, moves passing packets to `verified/` | Verify a packet it drafted; merge |
| Lander | Haiku 5.5 | Takes every packet in `verified/` in one train, one pull request, one merge | Drop another packet's content to make a train pass; decide an exclusion |
| Coordinator (one-off) | Sonnet 5.5 | Applies a bounded set of corrections as one train, for example a verdict list | Run alongside the lander on the same packets |

Judgement work (verification, identity matching, source disputes) is on Sonnet.
Mechanical slices (extraction, OCR zips, id lookups, prose from a read source)
are on Haiku. This follows the founder's standing rule to use the cheapest model
that can do the job, and it is recorded here because the verifier was on Haiku
for part of 14 November 2026 and had to be re-run on Sonnet (see section 6).

## 2. The board

`BOARD.md` at the harvest root is the one control file. Each lane has a focus,
a queue and a claims list. A worker appends one **Claim** line before it starts
an item and one **Done** line when its packet is written. A **Held** line means
the item waits for the founder. Workers read the board before every slice. If
the board and a brief disagree, the board wins. An item that is claimed and never
finished blocks other workers, so a claim with no packet is released on the next
check-in.

## 3. Slices and queues

- Each worker takes **one slice** at a time: one book range, one enrichment
  batch, one episode, one work, one set of Wikidata candidates. A slice produces
  one packet of at most 25 entities.
- Queues come from the registers, not from memory:
  - books and their state: `docs/library/harvest-register.yaml`
  - enrichment gaps: `npm run enrichment-queue -- --gap <gap> --class <class> --limit N`,
    with claims in `docs/library/enrichment/claims.yaml`
  - books and series in progress: `WORK-REGISTRY.md` on the microSD
- Before a slice a worker reads the source from the microSD (the OCR zip where one
  exists; the page is read in full before it is cited). Downloads and OCR stay on
  the microSD, never in git.
- A worker that finds nothing to draft says so on the board and in one line, and
  is given another queue at the next check-in. An empty result is not a reason to
  stop.

## 4. Drafting and checking a packet

1. Draft into `packets/drafting/<lane>-<topic>-<n>/` (layout in `pipeline.md`).
2. Run `npm run check:packet -- <packet dir>` from a fresh `origin/main` checkout.
   The scoped check cannot run in a checkout that is behind `origin/main`, because
   the script lives only on `main`. A packet that changes only a register or ledger
   has no entity files, so the check reports "no data or prose files found" and
   fails; such packets are landed by the lander by hand (open, section 7).
3. The verifier samples the content against the source page and fixes what it
   finds. Two factual errors in one sweep (one of them a geometric claim) mean the
   sampling has to continue on every packet, not only the ones that fail the check.
4. The verifier moves a passing packet to `verified/`, or leaves it in `drafting/`
   with a line on the board that says why.

## 5. Landing: the train

The lander takes every packet in `verified/` in one train and opens one pull
request, as `pipeline.md` describes. In practice on 14 November 2026:

- Train 25 landed `lanec-ssb-58-59` (PR #7011); train 26 landed eleven packets
  (PR #7014); train 27 landed four (PR #7015).
- Each train ran the full `npm run validate` once and reported its error count
  (0 in each case). Merged is not live: deployment is the founder's step.
- Two actors must never build the same train. On 14 November a coordinator and the
  lander both began train 27 on the same four packets; the coordinator was stood
  down, and this is now a rule: one lander, one train at a time.

## 6. Hotfixes to `main`

When CI on `main` fails, the fix is its own small pull request, with nothing else
in it:

1. Reproduce the failure on a fresh branch from `origin/main`. Read which assertion
   failed, and do not weaken, skip or edit the test.
2. Check every item the test compares, not only the first. The tour test stops at
   the first mismatch, so five stops were found in one pass.
3. Where the fix copies a value from a record, sanity-check that the value is cited
   by the record's prose or backs a fact the rules allow it to back. Flag anything
   that looks wrong in the pull request body instead of propagating it.
4. Add a CANARY entry under the current version block, commit with the
   `AI-Agent`, `AI-Model` and `AI-Editor` trailers, fetch `origin/main` before the
   push, and three-way merge if it moved.
5. The gates before merging: `npm run validate` reports 0 errors, and the failing
   test file passes in full.
6. A worktree that is missing `site/node_modules` cannot load the site config and
   the tour test fails for that reason alone. Link the main checkout's copy as
   local setup, and say so in the pull request, but do not commit the link.

## 7. Registers, wrap-up and deletion

- `docs/library/harvest-register.yaml` holds every book, audio series, website and
  dataset with its state. A state changes in the same pull request that changes
  the work.
- Wrap-up order: a partly mined book is finished before any new book is started.
  Its OCR text is zipped on the microSD and the zip is verified (`unzip -t`, page
  count, sha256 against the packet) before anything else happens.
- **Deletion gate.** A scan is deleted only when the register entry says complete
  and the gate in [`docs/library/README.md`](../library/README.md) is met. No
  deletion has run under a looser reading. Zipping is not deletion.
- Known gaps at 14 November 2026: the azhar books show `ocr.failed_pages: 120` for
  azhar-001 against 120 page markers in the text, which is a register error to fix
  before any azhar deletion; and the zip check verifies page counts per book, not
  per volume, for the directory books and the three fatwa books.
- Enrichment register: `docs/library/enrichment/` (README there). A worker claims
  an item in `claims.yaml` in its first commit or packet, marks it done when it
  lands, and never starts an item another agent holds.

## 8. Outside research: GEMINI lines and batches

- A worker that cannot settle an identity, date or source logs one line starting
  with `GEMINI:` (slug, the question, what the card says, what its source says,
  what would settle it) and moves on.
- The orchestrator collects these into a numbered batch file in the scratchpad,
  with the question count written from the ids, not from memory (batch 1 said 26
  questions for 30 ids; it was corrected).
- The founder runs the batch in Gemini. The answer is a claim, not a fact: each
  answer is checked against a primary source before anything is applied, and about
  one in nine answers in batches 2 and 3 were wrong.
- Gemini's verdicts on founder-reserved items are advice only and are not applied.

## 9. The check-in routine (orchestrator)

A recurring check, every 20 minutes while lanes run:

1. Read the board and each packet folder's counts (drafting, verified, landed,
   rejected) and the latest train on `main`.
2. For every worker: if it finished, give it the next slice. If it has crashed or
   stalled, stop it and start a replacement on the same slice. An idle lane is
   refilled, not reported as idle.
3. Run a verifier sweep on `packets/drafting/`, with new packets included.
4. Report: packets landed, verified and drafting; lane status; blockers that need
   the founder. Rulings are asked once, with the decision alone in the question.

On 14 November 2026 the check-in reported idle lanes without refilling them, and
the founder had to ask why nothing new was being pushed. Refilling is part of the
check, not a separate step.

## 10. Open rulings

These block lane content until the founder decides them. Each is recorded on the
board and in the lane's ledger.

- **Citation convention.** Lane A packets cite printed pages (scan minus 4) for
  the Zij al-Sabi; batches 1 to 5 and the source entity cite scan markers. The Canon
  Book II packet found the opposite page-marker convention in `pages.json`
  (`[pN]` opens page N). One ruling covers both.
- **Register-only packets.** Whether a packet that changes only a register or
  ledger should land by hand, or through a relaxed scoped check.
- **Edition for the Siyar al-Nubala.** The registered edition (Dar al-Risala) is
  not held on the drive in full. Either the Risala volumes are acquired, or another
  edition is cited under its own record.
- **VIAF access.** VIAF pages return HTTP 403 to automated fetches. Either the
  matches are checked through the founder's own browser, or Wikidata P214 alone is
  accepted as the authority link.
- **Menses and foetus reports in Canon Book II.** Entries that record the book's
  reports are labelled as the book's listing; the founder decides whether they stay.
- **Clan name at pages 345 to 346 of Sirat al-Hadi.** Withheld pending a
  firewall ruling.

## 11. What is not automated yet

- The scoped check does not accept register-only or ledger-only packets.
- The 20-minute check is run by the orchestrator, not by a scheduled job.
- No rule in this document lowers a gate. Where a gate is slow, the answer is to
  make the check faster, not to skip it.
