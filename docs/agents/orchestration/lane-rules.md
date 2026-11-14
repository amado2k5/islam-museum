# Shared rules for every lane worker (islam.museum, 14 November 2026)

Repo: <main-checkout>. Harvest root: <harvest-root> (same tree as <harvest-root>; the microSD is mounted, 155 GB free).
Read once, in full: AGENTS.md, docs/agents/publication-standard.md, docs/agents/content-standards.md, docs/agents/workflow.md, and the lane docs named in your task. Do not re-read them each batch.

## Your own workspace
- Make your OWN git worktree from a freshly fetched origin/main, under <harvest-root>/worktrees/<your-name> (create the folder if missing), and link node_modules from the main checkout. Never share a worktree, branch or scripts folder with another worker; other workers run at the same time. Never use the orchestrator worktree.
- Rebuild any helper scripts you need in your own folder (the old scratchpad scripts are gone). Keep scripts outside the repo.

## Standing authority from the founder (14 November 2026, in chat)
- Download any book, tool, audio, video or dependency you need, to the microSD (never into git, never into the repo). Untrusted downloads go in their own new folder; run Python reading them with -I.
- Use the Mac for all browsing, through Claude in Chrome (the user's own browser), one action at a time with short pauses on sites the user is logged in to. Use Apple Vision for OCR on the Mac (a small Swift or Python-with-pyobjc script, saved on the microSD), local Whisper or the existing audio pipeline for audio and video, and the existing judge LLM and infrastructure as the original lane requirements say (Ollama qwen3.5:27b judge; docs/decisions/JUDGE-SETUP.md; the preload at <harvest-root>/bin/judge-long-fetch.mjs).
- shamela.ws and similar sites may be read and mined. Claim every book in <harvest-root>/WORK-REGISTRY.md before any OCR, download or harvest. You may bring in new books we do not have, to enrich prose.
- Write full, detailed trilingual prose (ar, en, ur, status.review draft, provenance block) on the FIRST pass. Never leave enrichment for later.

## Rules that never bend (summary; AGENTS.md is the source)
- Never invent a quote, date, page, ISBN or citation. Read a page in full before citing it. Cite defined sources.
- Qur'an text is never typed: passage links only; never stage data/passage/quran-*.yaml. No honorifics typed. No ellipses. Wrap every parenthetical with Arabic script as U+2066 ( ... ) U+2069.
- Terrorist-organisation hard block (AGENTS.md, extended 14 November 2026): no content about, from or sympathetic to the listed organisations or media; if a task needs it, stop and say so.
- Describe, never prescribe; attribute opinions; Sunni frame first; contested topics use the perspectives block.
- Exclusions, drops and rejections are proposals for the founder: log each with its reason in the lane progress file. Never decide them.
- Held for the founder, do not touch: Sulayman al-Musta'in duplicate merge, Babil and Ascalon wording, Sanaa old-city entry, Kitab al-Manazir printed pp. 532, 546 and 666, mawkib-al-nour episode 29, and opinion rulings. The approval record is docs/decisions/records/dec-20261114-277.yaml (cite it).
- Hosting and deploy are the founder's. Never run deploy workflows.

## Gates and merging
- Per PR: fresh branch from re-fetched origin/main; npm run validate (0 errors); cite-check where the lane uses it; CANARY.md entry under the current version block, grouped by kind; npm run coverage when entities changed; commit explicit paths only (never git add -A) with trailers AI-Agent, AI-Model, AI-Editor (truthful) and the Co-Authored-By line for your model; at most 25 entities per PR.
- Before each merge: fetch origin/main, review what landed, three-way merge (CANARY.md and progress-file conflicts keep both sides), re-validate. The post-validate shortcut is allowed only when the incoming changes touch none of your files, nothing under scripts/, schema/, package.json, no existing decision file, and add no entity with a matching slug; log its use in the PR body.
- Merge every PR you raise yourself with gh pr merge --merge. Do not wait on npm test or CI. No force pushes, no --no-verify, no --admin, no auto-merge.
- Downloads over 50 MB for a source you have not used before: say so in your report with file, source and size; downloads to the microSD for books, audio and video the lane needs are pre-approved.

## Efficiency (tokens matter)
- Be terse. After each merged PR, send one line only: PR number, what, resume point. No recaps, no tables, no tool narration.
- Reuse before create; batch work; do not re-read unchanged files; do not re-run checks that already passed on the same tree.
- Propose process speed-ups in one short note in your lane ledger (do not relax any rule yourself; ask first).
- Do not stop after one PR. Stop only when your queue is done or your context is nearly used; before stopping, merge everything and report your resume point.

## Never blocked, never idle (founder rule, 14 November 2026, in chat)
- No lane and no worker is ever held, blocked, idle or waiting. When you hit an issue or a pending decision: (1) run the rule engine and judge (npx tsx scripts/decisions/decide.ts --question <inbox yaml> --write; a single question, never --batch; judge setup in docs/decisions/JUDGE-SETUP.md) and act on its answer; (2) if it still cannot decide, write the question to docs/decisions/inbox/ as a proposal, log it in your lane ledger, skip that item, and move to the next item on your queue immediately. Never stop to ask and never wait for an answer.
- The founder's hard invariants still stand and are never decided by an engine: the terrorist-organisation block, Qur'an text integrity, licence posture and safety gates. Founder-reserved items (the merges and wordings listed above) are skipped and logged, not guessed.
- Do not wait on CI, builds, scans or merges: start the next item while a validate or merge runs in the background, and report only merged PRs.
- If your queue empties, pull the next unclaimed item from your lane's list (WORK-REGISTRY.md, docs/delegation/lane-ledgers/README.md, source-families.md, docs/coverage.md gaps) and keep going.

## Items that need outside research (founder arrangement, 14 November 2026)
- When an item needs research you cannot do from the drive or the allowed sites (an identity, a date, an identifier or a source question that your sources cannot settle), do not wait and do not drop it: log it in your lane progress file on its own line starting with the tag "GEMINI:" (slug, the question, what the card says, what your source says, the source that would settle it), then move on. The orchestrator collects these lines, sends them in batches to Gemini through the founder, and hands the verified answers back. Never apply a Gemini answer without verifying it yourself against a primary source.

## Harvest register (founder, 14 November 2026)
- Before any download, OCR, harvest, mining or ingestion, look the item up in docs/library/harvest-register.yaml; use its state, never redo finished work; update the entry in your PR. Nothing is deleted from the microSD until the entry meets the deletion gate in docs/library/README.md.

## Finish before you start (founder rule, 14 November 2026, in chat)
- To be efficient, go to the partially or nearly completed books first, wrap them up, and clean them up before starting any new book. Do not claim or start a new book while an unfinished one is on the register and not held for the founder. Use docs/library/harvest-register.yaml (once it exists) to find them: rank by share of pages mined, highest first.
- Wrap-up means: mine the remaining pages or record each skipped page with its reason, zip the OCR text on the microSD (verified), update the register entry to complete, and only then clean up: delete the PDF and the working files, keeping the OCR zip, once the deletion gate in docs/library/README.md is met. Never delete anything that fails the gate, anything a held item still needs, or anything outside a book's own files. The first deletions are a pilot: report each one in one line (book, what was deleted, bytes freed).
