# Showcase Tier prose: progress (lane `showcase-prose`)

_Opened 24 October 2026. Lane document: [`../agents/lanes/showcase-prose.md`](../agents/lanes/showcase-prose.md). Queue: [`showcase-queue.md`](showcase-queue.md). Branch `content/showcase-prose`. Stubs `data/_stubs.d/showcase-prose.yaml`._

## Phase plan

| Phase | Scope | Budget | State |
|---|---|---|---|
| Setup | Repo, branch, dependencies, harvest workspace | 45 min | Done (see day log) |
| 0 | Register the lane; queue file | 30 min | Done (this commit) |
| 1 | Sicily pilot: `exhibit/path-sicily-islam` and its 10 featured records and journey | ~2.5 h | In progress |
| 2 | Egypt showcase set (after Archnet registration) | ~2.5 h | Not started |
| 3 | General Showcase queue | remainder | Not started |

## 0.0 Compliance checklist (instructions of 24 October 2026)

| Line | Checked against | Verified |
|---|---|---|
| Publication standard: no review; one source enough; records enter `status.review: published` | `docs/agents/publication-standard.md` on `origin/main` at `fe34884ea` | Yes |
| Source families catalogue is the shelf; registration before first use | `docs/agents/source-families.md` on `origin/main` at `fe34884ea` | Yes |
| Tests and CI deferred: per batch only `npm run cite-check`; `npm test` not run; no waiting on CI before merge | Founder instruction 0.2 | Yes (see deferral note below) |
| Evidence gathered on this Mac into the local harvest workspace; writing from local files only | `~/islam-museum-harvest/` (books, OCR, claims) | Yes |
| Starting point of this branch | `origin/main` at `615949d2a` | Yes |

**Deferral note (instruction 0.2):** the full test suite (`npm test`) and CI are deferred to the founder and are not run in this lane. `npm run validate` is run only at phase checkpoints if it finishes quickly; its result is recorded in the batch entries below.

## Decisions taken without the founder (day log)

| # | Question | Options | Choice | Why |
|---|---|---|---|---|
| D1 | Branch name | Use the run's `content/showcase-prose` vs the worktree's `claude/islam-museum-enrichment-224ce4` | `content/showcase-prose`, created from `origin/main` in this worktree | The run instruction names the branch; the worktree is the isolated copy the session was given |
| D2 | Clone or worktree | Clone to `~/islam-museum` vs use this worktree | This worktree | The session runs in a git worktree; a second clone would split the work. The repo already exists on this Mac |
| D3 | Local model (Ollama) | Pull a model for first passes vs Claude-only | Claude-only, no model drafts | Every line must be checked against the local source anyway; the day's output must not depend on Ollama (instruction 1.4). A drafted line still needs the same check, so no time is saved on the claims that matter |
| D4 | Brew installs (tesseract, ocrmypdf, poppler, ripgrep, jq, pandoc) | Install vs skip | Skip. `tesseract`, `pdftotext`, `rg` and `jq` are already present; the OCR of the books needed for Phase 1 is already in the workspace | Setup must not eat the day (instruction 1.1–1.3) |
| D5 | Slug drift in the Sicily brief | Use the brief's slug vs the live slug | Live slugs: `event/aghabid-conquests-sicily` (brief said `aghlabid`), `polity/emirate-of-sicily`, `place/siqilliya`, `place/palermo`, `building/palermo-mosque-1591`, `event/first-raid-on-sicily`, `person/asad-ibn-al-furat`, `person/al-idrisi-muhammad-ibn-abd-allah`, `person/ibn-jubayr-muhammad`, `journey/sicily-to-granada-jubayr` | Instruction 1: use the real slug and note it |
| D6 | Sicily source for the Futuh al-Buldan | Cite the Mu'assasat al-Ma'arif 1407 scan (`source/futuh-buldan-maarif-1407`) | Same. The maarif scan is `books/tareekh/futuh-buldan/20230703_20230703_1444/` (pages.json). The Sicily passage is at scan page 329, the anchor the existing records already use. The other Futuh copies in the workspace are a different edition and are not cited for this lane | `source/futuh-buldan-maarif-1407` names this scan in its reliability note |
| D7 | Dates that two sources give differently | One date vs both | Both, as a second dated claim with `status: debated`, when the Ibn Khaldun and the al-Baladhuri/Ibn al-Athir dates differ | Publication standard: a second source strengthens a record; a conflict is shown, not resolved |

## Batches

_None completed yet. Each batch entry records: id, records done, records skipped with reasons, families registered, decisions, and validation output._

## NEXT STEP:

Phase 1, batch 1: write `event/first-raid-on-sicily`, `event/aghabid-conquests-sicily` and `place/siqilliya` from the maarif Futuh scan p. 329 (`~/islam-museum-harvest/books/tareekh/futuh-buldan/20230703_20230703_1444/pages.json`), then `polity/emirate-of-sicily` from Ibn Khaldun's Ibar (`~/islam-museum-harvest/books/tareekh/tarikh-ibn-khaldun/Heliopolis1957_gmail_20180516_1044/pages.json`, scan pp. 1020–1026), then `cite-check`, coverage, commit, push, PR, merge; then rewrite `exhibit/path-sicily-islam` rooms in ar, en, ur.
