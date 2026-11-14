# The packet pipeline: how lane content reaches `main`

_Origin: founder approval of 14 November 2026, in chat: "yes make the changes 1 to 4 that you proposed". Decision record: `docs/decisions/records/dec-20261114-284.yaml`. Reason: twenty agents merging small pull requests conflicted on `CANARY.md` and the progress files, and output stayed flat._

Producing is separated from landing. Workers draft and verify content in a **packet** outside the repository; one agent, the **lander**, applies verified packets to `main` in a **train**, in one pull request. This is the standing procedure for all lane content: mining, prose enrichment, corrections, harvests, translations. Work outside the lanes (site code, schema, scripts, docs, fixes) is not lane content and follows [`workflow.md`](workflow.md) unchanged.

Every content rule in [`../../AGENTS.md`](../../AGENTS.md) applies to a packet exactly as it applied to a pull request: sources and citations, no invention, Qur'an text never typed, no honorifics, Arabic parentheses isolated, trilingual draft prose with a provenance block, the terrorist-organisation block, founder-held items, exclusions as proposals. The pipeline changes where and when the checks run, not what they check.

## The four changes in force

1. **Release notes.** A worker does not edit `CANARY.md`. It writes one reader-facing entry per packet in the manifest's `canary` field; the lander puts every packet's entry into `CANARY.md`, under the current version block and its kind, in the same pull request as the content. "Every change has its entry in the same commit" still holds.
2. **Batch size.** The limit of 25 entities applies **per packet**. A train pull request may carry many packets.
3. **Validation.** A fast scoped check per packet (`npm run check:packet`), and the full `npm run validate` once per train, before the merge. The error count must be 0.
4. **Who merges.** Only the lander merges lane content. Lane workers no longer open or merge pull requests, create repository worktrees for content, or edit `CANARY.md`, progress files or ledger files in the repository.

## Stages

1. **Acquire.** Download, OCR, transcribe. Files stay on the microSD, never in git. Look the item up in `docs/library/harvest-register.yaml` first and never redo finished work.
2. **Draft.** Write the records into a packet folder (layout below). Read the repository read-only from the main checkout (`git -C <main-checkout> show origin/main:<path>`) and check slugs and links against `origin/main`.
3. **Verify.** A different agent checks the packet against the source: every statistic, name, date and verse reference, that links exist, honorifics, ellipses, Arabic parentheses and the Qur'an rule. It fixes what it finds, runs the scoped check, and moves the packet folder from `packets/drafting/` to `packets/verified/`.
4. **Land.** The lander takes every packet in `verified/` (a train), applies them to one fresh checkout, writes `CANARY.md` and ledger lines from the manifests, regenerates the graph and `docs/coverage.md`, runs the full validate once, opens one pull request and merges it. Landed packets move to `packets/landed/`; a packet that cannot land moves to `packets/rejected/` (rejection path below).

## Packet layout

All paths are relative to the harvest root.

```
packets/drafting/<lane>-<topic>-<n>/        (move the whole folder to packets/verified/ when verified)
  manifest.yaml
  files/                                    (a repo-relative tree)
    data/<class>/<slug>.yaml
    content/<lang>/<class>/<slug>.md
    data/_stubs.d/<lane>.yaml               (optional)
```

Whole files only. For a file that already exists on `main` (a series record, a long prose file gaining a section), put the complete new file in `files/` and record in the manifest the `origin/main` commit it was based on (`base_commit`); the lander three-way merges if `main` moved. Two packets must not edit the same existing file at once: claim it on the board first.

## manifest.yaml

| Field | Content |
|---|---|
| `id`, `lane`, `stage` | packet id, lane, `drafting` or `verified` |
| `author_agent`, `verifier_agent`, `model`, `date` | who drafted, who verified (a different agent), the model, the date |
| `base_commit` | the `origin/main` sha the packet was written against |
| `entities` | `[class/slug ...]`, at most 25 per packet |
| `new_entities` | the subset that is new |
| `depends_on` | optional, packet ids that must land first |
| `sources` | what was read, with pages or timestamps |
| `canary` | `{kind: Data\|Added\|Changed\|Fixed, text: "one reader-facing entry"}`, what changed and why it matters, never a bare commit message |
| `ledger` | `{file: docs/delegation/<per-book-or-per-series file>.md, lines: [...]}`; one ledger file per book or series, never a shared one |
| `registers` | optional, `{harvest: [...entry updates...], enrichment_claims: [...]}` |
| `gemini` | `["GEMINI: ..."]`, questions for outside research (slug, question, what the card says, what the source says, what would settle it) |
| `exclusions` | `[{what, reason}]`, proposals for the founder, never decisions |
| `checks` | `{scoped_check: pass\|not-run, cite_check: pass\|not-run, verifier_notes: "..."}` |

## The scoped check

```
npm run check:packet -- <packet dir>
```

Run from the main checkout; it reads the packet and the repository and writes nothing, and takes a few seconds. It prints `PASS` or `FAIL` with a reason per fault. It checks: the manifest's required fields, a named verifier on a verified packet, a canary entry and a ledger entry; at most 25 entities and a manifest that matches the files; that every YAML and frontmatter block parses; that data files carry `label.ar`, `summary.ar`, a cited source (as `validate` requires; a draft without sources only warns); that new prose exists in `ar`, `en` and `ur`; that every `[[class/slug]]` link, relation target, source and `{cite:...}` resolves to a file in the repository, a stub, an alias or a file in the packet; no typed honorific, no Qur'an text marker, no ellipsis, no unwrapped Arabic parenthesis; no mention of a blocked organisation (the same scan as `scripts/check-extremism.ts`, with the founder-approved exceptions); no staged Qur'an passage file; and, as warnings only, a missing provenance block (`validate` does not require one; the pipeline keeps it in the data record) and AI output marked `published`. It reuses the validator's own patterns (`scripts/validate.ts`) and the extremism functions (`scripts/lib/extremism.ts`). It does not replace the full validate (graph-wide rules, predicates, dates, licences); the lander runs that once per train.

## The board

`BOARD.md` at the harvest root is the single control file. It gives each lane's focus, stage, queue and claims. Read it before each unit of work. Only the orchestrator edits the focus and queue; agents append one line under "Claims" when they take an item and one line under "Done" when its packet is verified. If the board and a brief disagree, the board wins.

## The lander's train

The lander is the only agent that writes lane content to `main` (brief: [`orchestration/lander-brief.md`](orchestration/lander-brief.md)). Per train it:

1. Takes all packets in `packets/verified/` in dependency order, in one persistent local-disk worktree, on a fresh branch from a freshly fetched `origin/main`.
2. Sanity-checks each manifest (at most 25 entities, verifier named, files exist), copies `files/` into the tree, and three-way merges a file whose `base_commit` differs from current `main`.
3. Adds each canary entry to `CANARY.md` under the current version block, appends the ledger lines to the named ledger file, the `gemini` lines to `docs/delegation/gemini-queue.md`, the exclusions to the named ledger, and applies any register updates.
4. Runs `npm run graph`, `npm run coverage` and, once, `npm run validate`. On failure it finds the packet at fault (the error names the file), rejects it with the error text and validates again. The error count must be 0 and is reported.
5. Commits explicit paths only (message lists the packet ids, with the `AI-Agent`, `AI-Model` and `AI-Editor` trailers), opens one pull request (body: packets, entities, validate result) and merges it. Before the merge it fetches `origin/main` and three-way merges anything that landed; it re-validates when the incoming changes touch the train's files, `scripts/`, `schema/` or `package.json`. It never force-pushes, skips hooks or stages `data/passage` files.
6. Moves landed packets to `packets/landed/`, appends one line per packet under "Done" on the board, and reports one line per train: pull request number, packets, entities, minutes, rejects.

Merged is not live: deployment stays the founder's manual step (`workflow.md` section 9).

## The rejection path

A packet that cannot land (a failed three-way merge, a validate error that names it, a failed sanity check) moves to `packets/rejected/<packet>/` with a `REJECT.md` that says why and what to fix. The producing lane fixes it, has it re-verified and moves it back to `packets/verified/`. The lander never drops another packet's or agent's content to make a train pass, and never decides an exclusion: exclusions are proposals in the manifest for the founder.

## Never blocked, never idle

A worker whose packet is rejected, or whose item needs a decision, logs the question (a `GEMINI:` line for outside research, an inbox proposal for the decision engine) and moves to the next item; no lane waits for a train. The founder's hard invariants are never decided by an engine.
