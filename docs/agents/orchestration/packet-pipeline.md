# Packet pipeline (founder approved 14 November 2026, in chat: changes 1 to 4)

Producing is separated from landing. Workers never create repo worktrees for lane content, never edit CANARY.md, progress or ledger files in the repo, never open or merge PRs. Only the LANDER writes to main.

## Stages
1. ACQUIRE: download, OCR, transcribe. microSD only.
2. DRAFT: write the records into a packet folder (below). Read the repo read-only from the main checkout <main-checkout> (git fetch is not needed; use `git -C <main checkout> show origin/main:<path>` to read current files, and check slugs and links against origin/main).
3. VERIFY: a different agent checks the packet against the source (every statistic, name, date, verse reference; links exist; honorifics, ellipses, Arabic parentheses, Qur'an rule), fixes it, runs the scoped check when available (npm run check:packet -- <packet dir>, in the main checkout, read-only), then moves the packet to verified/.
4. LAND: the lander takes every packet in verified/, applies them to one fresh checkout, writes CANARY.md and ledger lines from the manifests, regenerates coverage, runs the full validate once, opens ONE pull request and merges it, then moves the packets to landed/ (or rejected/ with a REJECT.md saying why; the producing lane fixes and re-verifies).

## Packet layout
packets/drafting/<lane>-<topic>-<n>/        (move the whole folder to packets/verified/ when verified)
  manifest.yaml
  files/                                    (repo-relative tree: files/data/work/x.yaml, files/content/ar/work/x.md ...)

Whole files only. For a file that already exists on main (a series record, a long prose file gaining a section), put the complete new file in files/ and record in the manifest the origin/main commit you based it on (base_commit); the lander three-way merges if main moved. Two packets must not edit the same existing file at once: claim it on the board first.

## manifest.yaml
id, lane, stage (drafting or verified), author_agent, verifier_agent, model, date,
base_commit: <origin/main sha the packet was written against>
entities: [class/slug ...]                  (at most 25 per packet)
new_entities: [class/slug ...]
sources: [what was read, with pages or timestamps]
canary: {kind: Data|Added|Changed|Fixed, text: "one reader-facing entry"}
ledger: {file: docs/delegation/<per-book-or-per-series file>.md, lines: ["..."]}   (one ledger file per book or series, never a shared one)
registers: {harvest: [...entry updates...], enrichment_claims: [...]}             (optional)
gemini: ["GEMINI: ..."]                     (questions for outside research)
exclusions: [{what, reason}]                (proposals for the founder)
checks: {scoped_check: pass|not-run, cite_check: pass|not-run, verifier_notes: "..."}

## The board
<harvest-root>/BOARD.md is the single control file. Read it before each unit of work. It gives each lane's focus, stage, queue and claims. Only the orchestrator edits the focus and queue; agents append one line under "Claims" when they take an item and one line under "Done" when its packet is verified. If the board and your brief disagree, the board wins.

## Rules that do not change
Everything in lane-rules.md and AGENTS.md about content: sources, no invention, Qur'an text, honorifics, Arabic parentheses, the terrorist-organisation block, trilingual draft prose with provenance, founder-held items, exclusions as proposals, harvest register lookups, finish before you start.
