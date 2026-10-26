# Lane `tareq-al-suwaidan`: progress

Lane document: [`docs/agents/lanes/tareq-al-suwaidan.md`](../agents/lanes/tareq-al-suwaidan.md). Method: [`docs/agents/audio-video-harvest.md`](../agents/audio-video-harvest.md). Mission: `docs/delegation/devin-prompt-suwaidan-sergani-naggar.md`.

## Next step

Series `administrative-processus-abilities`: ep01–ep05 written and merged — administrative series complete (5/5); al-mubdioune next (29 eps) and write their content, while phase A downloads continue down the series list.

## Done

- 25 Oct 2026: lane opened. Own clone at `~/devin-harvest/repo-suwaidan` (branch `devin/suwaidan-2026-10-25`), own harvest workspace `~/devin-harvest` (`raw/`, `books/`, `logs/`, `scratch/`, `.venv-audio/` with torch 2.14.1 + transformers 5.20.2, MPS available). The Claude `omar-abdelkafy` session's worktree, workspace, branches and processes are untouched.
- 25 Oct 2026: `data/source/assabile-tareq-al-suwaidan.yaml` registered; `scripts/harvest/sources.yaml`, `docs/attribution.md`, `docs/agents/source-families.md`, `docs/agents/lanes.md` and `docs/status.md` updated.
- 25 Oct 2026: venv SSL fix: the macOS framework Python 3.14 has no root certificates; `certifi` installed in the venv and `SSL_CERT_FILE`/`REQUESTS_CA_BUNDLE` exported by the session's driver scripts (`~/devin-harvest/bin/phaseA.sh`, `phaseB.sh`). Repo scripts unchanged.

## Doubts in the record

(none yet)

## Completed recordings (report per `audio-video-harvest.md` §8)

| Recording | Duration | Prose | Persons | Places | Events | Other entities | Claims verified | Commit |
|---|---|---|---|---|---|---|---|---|
| administrative-processus-abilities/ep01 | 1:55:16 | 40 files (ar/en/ur) | 6 new (sun-tzu, adam-smith, henry-ford, frederick-taylor, elton-mayo, abraham-maslow) + tariq-al-suwaidan extended | — | — | 5 concepts + 2 works | ~70 cited windows | 97f215e69 (PR #2024) |
| administrative-processus-abilities/ep02 | 1:36:15 | 12 files (ar/en/ur) + person ext | tariq-al-suwaidan extended | — | — | 4 concepts (al-ruya-wa-al-risala, kpi-muashirat, strategic-business-unit, al-sharikat-al-ailiyya [contested]) | ~55 cited windows | d7fc78d6a (PR #2025) |
| administrative-processus-abilities/ep03 | 2:01:42 | 33 files (ar/en/ur) + person ext | 4 new (pareto, welch, oncken, blanchard) + tariq-al-suwaidan ext | — | — | 6 concepts + 1 work | ~85 cited windows | cc6b2c5eb (PR #2038) |
| administrative-processus-abilities/ep04 | 2:31:23 | 12 files (ar/en/ur) + 3 ext | 1 new (stephen-covey) + tariq ext | — | — | 3 concepts (al-tahfiz, musfafa-ittikhadh-al-qarar, taghyir-al-munazzamat) + ruya/ailiyya ext | ~90 cited windows | 5b40fa6e3 (PR #2058) |
| administrative-processus-abilities/ep05 | 2:13:57 | 15 files (ar/en/ur) + 2 ext | 1 new (abdel-rahman-al-sumait) + tariq ext | — | — | 4 concepts (idarat-al-hayat, idarat-al-waqt, fariq-al-amal, al-majmua-al-shakliyya) + taghyir ext | ~75 cited windows | 7ffda64e4 (PR #2073) |
| al-mubdioune/ep01 | 0:25:22 | 6 files (ar/en/ur) + person ext | tariq ext | — | — | 1 concept (rubaiyyat-sinaat-al-mubdiin) + 1 work (al-mubdioune-program) | ~45 cited windows | pending |

## Excluded items (standing rule, founder's instruction, 25 Oct 2026)

Every dropped or left-out item is listed here with item, reason, the gate it failed and its override status. Nothing is re-entered without the founder's written authorisation.

| Item | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| repetition loop | ep01 01:30:30 | window is a token-repetition artefact («بـ» ×~100), not speech | intelligibility | none needed — founder rule 6 |
| repetition loop | ep01 01:46:30 | window is a token-repetition artefact («الـ» ×~100), not speech | intelligibility | none needed — founder rule 6 |
| lecture-tail of ep01 after ~01:52 | ep01 01:52:30–end | content of remaining windows folded into values-review material already captured; no distinct fact dropped | — | — |
| repetition loop | ep02 00:51:00 | window is a token-repetition artefact («الـ» ×~100), not speech | intelligibility | none needed — founder rule 6 |
| repetition loop | ep04 00:48:30 | token-repetition artefact («مـ» ×~300), not speech | intelligibility | none needed — founder rule 6 |
| repetition loop | ep04 01:23:00 | token-repetition artefact («هـ» ×~300), not speech | intelligibility | none needed — founder rule 6 |
| repetition loop | ep04 02:10:30 | token-repetition artefact («لا» ×~600), not speech | intelligibility | none needed — founder rule 6 |
| repetition loop | ep04 02:15:30 | token-repetition artefact («و» ×~700), not speech | intelligibility | none needed — founder rule 6 |
| repetition loop | ep05 00:13:00 | token-repetition artefact («إجابة» ×~100), not speech | intelligibility | none needed — founder rule 6 |
| repetition loop | ep05 00:54:00 | token-repetition artefact («مـ» ×~300), not speech | intelligibility | none needed — founder rule 6 |
| repetition loop | ep05 02:01:30 | token-repetition artefact («بـ» ×~300), not speech | intelligibility | none needed — founder rule 6 |
| repetition loop | ep05 02:10:00 | token-repetition artefact («الـ» ×~200), not speech | intelligibility | none needed — founder rule 6 |

## Batch log

- `devin-tareq-al-suwaidan-admin-1` — ep01 of `administrative-processus-abilities` (13 new entities + 1 extension). Course self-dates to ~2007 (mentions the 2007 book *Know How* and the just-announced iPhone).
- `devin-tareq-al-suwaidan-admin-2` — ep02 (4 new concepts: vision/mission, KPI, LOB/SBU, family businesses [contested: women's-intervention claim, labelled speaker's view + needs_source]).
- `devin-tareq-al-suwaidan-mubdioune-1` — al-mubdioune ep01 (concept rubaiyyat-sinaat-al-mubdiin; work al-mubdioune-program; person ext). Series intro: quartets methodology.
- `devin-tareq-al-suwaidan-admin-5` — ep05 (4 concepts: life mgmt, time mgmt, teamwork/meetings, nominal group; 1 person: al-sumait; taghyir ext [consultants' 8 questions]; person ext). Series 1 complete.
- `devin-tareq-al-suwaidan-admin-4` — ep04 (3 concepts: motivation, decision matrix, organizational change [incl. Covey anecdote, academy points-bank, Ali's governors attribution labelled]; 1 person: stephen-covey; extensions: al-ruya-wa-al-risala [strategic intent], al-sharikat-al-ailiyya [third cause], person).
- `devin-tareq-al-suwaidan-admin-3` — ep03 (6 concepts: leadership six roles, Pareto, monkey laws, situational leadership, DISC, experience-vs-service; 4 persons: pareto, welch, oncken, blanchard; 1 work: one-minute-manager-meets-the-monkey; speaker's servant-employment rant labelled opinion).
