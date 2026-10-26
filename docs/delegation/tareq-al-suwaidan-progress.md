# Lane `tareq-al-suwaidan`: progress

Lane document: [`docs/agents/lanes/tareq-al-suwaidan.md`](../agents/lanes/tareq-al-suwaidan.md). Method: [`docs/agents/audio-video-harvest.md`](../agents/audio-video-harvest.md). Mission: `docs/delegation/devin-prompt-suwaidan-sergani-naggar.md`.

## Next step

Series `administrative-processus-abilities`: ep01 written and committed; transcribe ep02–ep05 and write their content, while phase A downloads continue down the series list.

## Done

- 25 Oct 2026: lane opened. Own clone at `~/devin-harvest/repo-suwaidan` (branch `devin/suwaidan-2026-10-25`), own harvest workspace `~/devin-harvest` (`raw/`, `books/`, `logs/`, `scratch/`, `.venv-audio/` with torch 2.14.1 + transformers 5.20.2, MPS available). The Claude `omar-abdelkafy` session's worktree, workspace, branches and processes are untouched.
- 25 Oct 2026: `data/source/assabile-tareq-al-suwaidan.yaml` registered; `scripts/harvest/sources.yaml`, `docs/attribution.md`, `docs/agents/source-families.md`, `docs/agents/lanes.md` and `docs/status.md` updated.
- 25 Oct 2026: venv SSL fix: the macOS framework Python 3.14 has no root certificates; `certifi` installed in the venv and `SSL_CERT_FILE`/`REQUESTS_CA_BUNDLE` exported by the session's driver scripts (`~/devin-harvest/bin/phaseA.sh`, `phaseB.sh`). Repo scripts unchanged.

## Doubts in the record

(none yet)

## Completed recordings (report per `audio-video-harvest.md` §8)

| Recording | Duration | Prose | Persons | Places | Events | Other entities | Claims verified | Commit |
|---|---|---|---|---|---|---|---|---|
| administrative-processus-abilities/ep01 | 1:55:16 | 40 files (ar/en/ur) | 6 new (sun-tzu, adam-smith, henry-ford, frederick-taylor, elton-mayo, abraham-maslow) + tariq-al-suwaidan extended | — | — | 5 concepts + 2 works | ~70 cited windows | pending |

## Excluded items (standing rule, founder's instruction, 25 Oct 2026)

Every dropped or left-out item is listed here with item, reason, the gate it failed and its override status. Nothing is re-entered without the founder's written authorisation.

| Item | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| repetition loop | ep01 01:30:30 | window is a token-repetition artefact («بـ» ×~100), not speech | intelligibility | none needed — founder rule 6 |
| repetition loop | ep01 01:46:30 | window is a token-repetition artefact («الـ» ×~100), not speech | intelligibility | none needed — founder rule 6 |
| lecture-tail of ep01 after ~01:52 | ep01 01:52:30–end | content of remaining windows folded into values-review material already captured; no distinct fact dropped | — | — |

## Batch log

- `devin-tareq-al-suwaidan-admin-1` — ep01 of `administrative-processus-abilities` (13 new entities + 1 extension). Course self-dates to ~2007 (mentions the 2007 book *Know How* and the just-announced iPhone).
