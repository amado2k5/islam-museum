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
| al-mubdioune/ep01 | 0:25:22 | 6 files (ar/en/ur) + person ext | tariq ext | — | — | 1 concept (rubaiyyat-sinaat-al-mubdiin) + 1 work (al-mubdioune-program) | ~45 cited windows | 13a147b65 (PR #2076) |
| al-mubdioune/ep02 | 0:28:38 | jafar-al-sadiq ext ×3 | — | — | — | person ext only | ~20 cited windows | 9f61f01f8 (PR #2077) |
| al-mubdioune/ep03 | 0:25:22 | al-awzai ext ×3 | — | — | — | person ext only | ~20 cited windows | 9ccda86b2 (PR #2079) |
| al-mubdioune/ep04 | 0:27:09 | abd-allah-ibn-al-mubarak ext ×3 (pt 1 of 2) | — | — | — | person ext only | ~25 cited windows | 36833c66b (PR #2082) |
| al-mubdioune/ep05 | 0:28:43 | abd-allah-ibn-al-mubarak ext ×3 (pt 2 of 2) | — | — | — | person ext only | ~25 cited windows | dfa6ab022 (PR #2083) |
| al-mubdioune/ep06 | 0:26:35 | izz-al-din-ibn-abd-al-salam ext ×3 (pt 1 of 2) | — | — | 1 contested-adjacent (open denunciation rules; labelled) | person ext only | ~25 cited windows | df3cb2a1a (PR #2085) |
| al-mubdioune/ep07 | 0:28:21 | izz-al-din-ibn-abd-al-salam ext ×3 (pt 2 of 2) | — | — | — | person ext only | ~25 cited windows | b8def568b (PR #2088) |
| al-mubdioune/ep08 | 0:29:38 | layth-ibn-sad ext ×3 | — | — | — | person ext only | ~25 cited windows | 36a815e89 (PR #2089) |
| al-mubdioune/ep09 | 0:26:52 | al-bukhari ext ×3 (pt 1 of 2) | — | — | — | person ext only | ~22 cited windows | 1f49f5288 (PR #2091) |
| al-mubdioune/ep10 | 0:26:39 | al-bukhari ext ×3 (pt 2 of 2) | — | — | — | person ext only | ~24 cited windows | 69ccd5090 (PR #2094) |
| al-mubdioune/ep11 | 0:25:42 | al-nawawi ext ×3 | — | — | — | person ext only | ~24 cited windows | 053dd31dc (PR #2095) |
| al-mubdioune/ep12 | 0:28:14 | ibn-al-jawzi ext ×3 (+sources fix) | — | — | 2 labelled speaker-opinions (wa'z-vs-ilm assessment; self-admiration note) | person ext only | ~26 cited windows | a698dc31f (PR #2097) |
| al-mubdioune/ep13 | 0:24:59 | al-tabari ext ×3 (pt 1 of 2) | — | — | — | person ext + sources | ~22 cited windows | 6d10608a0 (PR #2100) |
| al-mubdioune/ep14 | 0:26:07 | al-tabari ext ×3 (pt 2 of 2) | — | — | — | person ext | ~24 cited windows | ee96f496b (PR #2101) |
| al-mubdioune/ep15 | 0:26:20 | ibn-qayyim-al-jawziyya ext ×3 | — | — | — | person ext + sources | ~26 cited windows | d864928fd (PR #2103) |
| al-mubdioune/ep16 | 0:26:12 | al-fudayl-ibn-iyad ext ×3 | — | — | — | person ext + sources | ~24 cited windows | 4f65d0592 (PR #2106) |
| al-mubdioune/ep17 | 0:25:33 | ibn-al-nafis ext ×3 | — | — | — | person ext + sources | ~24 cited windows | 8db3668d3 (PR #2108) |
| al-mubdioune/ep18 | 0:26:33 | nur-al-din-mahmud-ibn-zangi ext ×3 (pt 1 of 2) | — | — | 1 labelled speaker-opinion (greater than Salah al-Din) | person ext + sources | ~22 cited windows | df256c292 (PR #2109) |
| al-mubdioune/ep19 | 0:26:18 | nur-al-din ext ×3 (pt 2 of 2) | — | — | — | person ext | ~26 cited windows | pending |

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
- `devin-tareq-al-suwaidan-mubdioune-19` — al-mubdioune ep19 (nur-al-din pt2: Damascus annexation 549 AH, Egypt race, Buqay'a defeat -> Harim victory + 'no roof' vow, Shirkuh/Salah al-Din vizierate, Fatimid end, madrasas/hospitals/Dar al-Adl, adhan reform, death 569 AH preparing for Palestine).
- `devin-tareq-al-suwaidan-mubdioune-18` — al-mubdioune ep18 (nur-al-din pt1: 'greater than Salah al-Din' claim labelled, Imad al-Din's Ruha + Assassin martyrdom, Aleppo/Mosul split, Second Crusade failure at Damascus, Raymond of Poitiers defeated 544 AH, Unur/Abaq tribute).
- `devin-tareq-al-suwaidan-mubdioune-17` — al-mubdioune ep17 (ibn-al-nafis ext: passion-for-field lesson, 629 AH illness -> medicine, Nuri/Nasiri/Qalawun hospitals, Egypt epidemic team, lesser circulation, 80-vol Shamil, wine refusal at death 687 AH).
- `devin-tareq-al-suwaidan-mubdioune-16` — al-mubdioune ep16 (al-fudayl ext: highwayman-to-ascetic conversion via Hadid 21, scholars' testimony, night worship vs sleep, salvation answer to Ibn Malik, Rashid counsel, jarh-level scrupulousness, errors corrected by Malik).
- `devin-tareq-al-suwaidan-mubdioune-15` — al-mubdioune ep15 (ibn-qayyim ext: authorship as his gift, Meccan retreat works, 100+ refs per book, triple-divorce fatwa, qabr al-Khalil imprisonment, dawn-dhikr session, authorship method vs ibn-al-jawzi).
- `devin-tareq-al-suwaidan-mubdioune-14` — al-mubdioune ep14 (al-tabari pt2: take/give life law, coordination gift, tafsir+history as perpetual references, 40 leaves/day = 600k, arud in one night, Abu Kurayb 100k, daily schedule, Dawud rebuttal torn up, full rubaiyyat equation).
- `devin-tareq-al-suwaidan-mubdioune-13` — al-mubdioune ep13 (al-tabari ext pt1: civilizational-history note, Quran at 7/hadith at 9, Abu Jafar kunyah w/o children, grand tour — Rayy/Baghdad/Basra/Wasit/Kufa/Sham/Beirut/Egypt, Ahmad missed 241 AH).
- `devin-tareq-al-suwaidan-mubdioune-12` — al-mubdioune ep12 (ibn-al-jawzi ext: orphan/aunt care, Sayd al-Khatir quote, 86 shaykhs, critical read on wa'z vs ilm, 100k estimate flagged, caliph quote + Wasit house arrest, 900+ works, 5 madrasas, 597 AH funeral).
- `devin-tareq-al-suwaidan-mubdioune-11` — al-mubdioune ep11 (al-nawawi ext: 12 daily lessons 7 yrs, 400 readings of al-Wasit, slept on books, Baybars tax-levy refusal, works list, one meal/day).
- `devin-tareq-al-suwaidan-mubdioune-10` — al-mubdioune ep10 (al-bukhari pt2: 18-night-risings, Baghdad 100-swapped-isnad test, jarh scrupulousness, 11-yr isnad correction, scholars' testimony, 'one book immortalises').
- `devin-tareq-al-suwaidan-mubdioune-9` — al-mubdioune ep09 (al-bukhari ext pt1: memory talent, Basra 15k-hadith feat, 600k→4k Sahih distillation, Albani anecdote, 1080 teachers, Baghdad/Ahmad).
- `devin-tareq-al-suwaidan-mubdioune-8` — al-mubdioune ep08 (layth-ibn-sad ext: Egypt's chief scholar, wealth-for-scholars 20k dinars/yr, four daily councils, Rashid oath story, Shafi'i 'deeper fiqh than Malik but no students').
- `devin-tareq-al-suwaidan-mubdioune-7` — al-mubdioune ep07 (izz ext pt2: Egypt stands — Eid-procession 'ya Ayyub' wine fatwa, al-Baji 'saw the sultan as a cat', mamluk emancipation fatwa + 'seller of kings', Ayn Jalut mobilisation, scholars' solidarity).
- `devin-tareq-al-suwaidan-mubdioune-6` — al-mubdioune ep06 (izz ext pt1: open denunciation rules + benefits, Salih Ismail/Crusader alliance story, no-hand-kiss answer, Crusader lords' retort, arms-sale fatwa).
- `devin-tareq-al-suwaidan-mubdioune-5` — al-mubdioune ep05 (ibn-mubarak ext pt2: scholars' testimony, masked champion, Hashimite hadith story, fitna rule, four-fears maxim, Abu Hanifa prayer joke, Fudayl verses, deathbed talqin fiqh).
- `devin-tareq-al-suwaidan-mubdioune-4` — al-mubdioune ep04 (ibn-al-mubarak ext pt1: amir-al-muminin fi-l-hadith, father's scrupulousness, Kufa famine/hajj story, Raqqa/Harun crowd).
- `devin-tareq-al-suwaidan-mubdioune-3` — al-mubdioune ep03 (al-awzai ext: orphanhood secret, Malik/Thawri reception, 70k fatwas, Damascus governor confrontation, 70k dinars given away).
- `devin-tareq-al-suwaidan-mubdioune-1` — al-mubdioune ep01 (concept rubaiyyat-sinaat-al-mubdiin; work al-mubdioune-program; person ext). Series intro: quartets methodology.
- `devin-tareq-al-suwaidan-admin-5` — ep05 (4 concepts: life mgmt, time mgmt, teamwork/meetings, nominal group; 1 person: al-sumait; taghyir ext [consultants' 8 questions]; person ext). Series 1 complete.
- `devin-tareq-al-suwaidan-admin-4` — ep04 (3 concepts: motivation, decision matrix, organizational change [incl. Covey anecdote, academy points-bank, Ali's governors attribution labelled]; 1 person: stephen-covey; extensions: al-ruya-wa-al-risala [strategic intent], al-sharikat-al-ailiyya [third cause], person).
- `devin-tareq-al-suwaidan-admin-3` — ep03 (6 concepts: leadership six roles, Pareto, monkey laws, situational leadership, DISC, experience-vs-service; 4 persons: pareto, welch, oncken, blanchard; 1 work: one-minute-manager-meets-the-monkey; speaker's servant-employment rant labelled opinion).
