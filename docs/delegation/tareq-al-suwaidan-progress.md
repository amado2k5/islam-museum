# Lane `tareq-al-suwaidan`: progress

Lane document: [`docs/agents/lanes/tareq-al-suwaidan.md`](../agents/lanes/tareq-al-suwaidan.md). Method: [`docs/agents/audio-video-harvest.md`](../agents/audio-video-harvest.md). Mission: `docs/delegation/devin-prompt-suwaidan-sergani-naggar.md`.

## Next step

al-wassitiya ep01–40 are all written: ep01–19 merged earlier, ep20–35 and ep36–40 on branch `claude/suwaidan-wassitiya-20-40` (PR opened 1 Nov). Still to do in this lane: (1) revise the thin Devin records for ep01–10 (concept/islamufubiya, al-khitab-al-islami, al-dimuqratiyya-wal-sharia, tatbiq-al-sharia, al-ilmaniyya-wal-islam, al-wataniyya-wal-qawmiyya, takfir, huquq-al-insan) against the transcripts: the ep26 check found Devin misread poll results in ep09, so every poll figure in those records must be re-checked; (2) the next series with transcripts on disk, alamani-al-tarikh (phaseB was transcribing it at 01:38; 29 episodes, 0 transcribed when last checked on 1 Nov), then asrar-al-qyada-al-nbawya and the rest in archive order; create each series' lecture-series record at its start.

## Done
- 1 Nov 2026: explorer backfill — `work/al-wasatiyya-program` (lecture-series, 40 episodes, ep01–19 listed) and `work/al-idara-al-amaliyya-course` (lecture-series, 5 lectures) created; `work/al-mubdioune-program` made complete (authors, delivered, episode list, `about` edges to 21 persons). Each series links its entities with `about` edges; `/ar/khutab/` lists them. Recordings map unchanged (the tareq map already covers 23 series, 402 lessons). Test note: `scripts/tour.test.ts` (time/mecca sources, halls.yaml) fails on origin/main independently of this lane; not touched here.

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
| al-mubdioune/ep19 | 0:26:18 | nur-al-din ext ×3 (pt 2 of 2) | — | — | — | person ext | ~26 cited windows | 568ebc819 (PR #2112) |
| al-mubdioune/ep20 | 0:25:21 | abd-al-qadir-al-jilani ext ×3 | — | — | — | person ext + sources | ~24 cited windows | c1212164d (PR #2113) |
| al-mubdioune/ep21 | 0:26:22 | ibn-taymiyya ext ×3 (pt 1 of 2) | — | — | — | person ext + sources | ~24 cited windows | 6d06d7e1a (PR #2116) |
| al-mubdioune/ep22 | 0:25:35 | ibn-taymiyya ext ×3 (pt 2 of 2) | — | — | — | person ext | ~26 cited windows | c07a08293 (PR #2118) |
| al-mubdioune/ep23 | 0:26:12 | yusuf-ibn-tashfin ext ×3 (pt 1 of 2) | — | — | — | person ext + sources | ~24 cited windows | fb0657014 (PR #2120) |
| al-mubdioune/ep24 | 0:26:35 | yusuf-ibn-tashfin ext ×3 (pt 2 of 2) | — | — | — | person ext | ~24 cited windows | 463f183e6 (PR #2123) |
| al-mubdioune/ep25 | 0:26:15 | al-razi-abu-bakr ext ×3 | — | — | — | person ext + sources | ~24 cited windows | ee516e342 (PR #2125) |
| al-mubdioune/ep26 | 0:25:53 | al-farabi ext ×3 | — | — | 1 misquote flagged (death 950->339 AH) | person ext + sources | ~22 cited windows | f8fb680bf (PR #2128) |
| al-mubdioune/ep27 | 0:26:22 | ibn-sina ext ×3 | — | — | — | person ext + sources | ~30 cited windows | 09674745f (PR #2132) |
| al-mubdioune/ep28 | 0:26:11 | al-ghazali-abu-hamid ext ×3 (pt 1) | — | — | — | person ext + sources | ~28 cited windows | 4dfceab68 (PR #2134) |
| al-mubdioune/ep29 | 0:25:55 | al-ghazali-abu-hamid ext ×3 (pt 2) | — | — | — | person ext | ~26 cited windows | d2bde39d6 (PR #2139) |
| al-wassitiya/ep01 | 1:21:33 | islamufubiya NEW + tariq ext ×3 | 1 | 3 panel perspectives | — | concept + person ext | ~40 cited windows | 14c78afbf (PR #2148) |
| al-wassitiya/ep02 | 1:08:10 | al-khitab-al-islami NEW + tariq ext ×3 | 1 | 3 panel perspectives | — | concept + person ext | ~40 cited windows | ec8d1a9e8 (PR #2156) |
| al-wassitiya/ep03 | 1:18:00 | al-dimuqratiyya-wal-sharia NEW + tariq ext ×3 | 1 | 3 panel perspectives | — | concept + person ext | ~40 cited windows | e3fc6e937 (PR #2160) |
| al-wassitiya/ep04 | ~1:16 | tatbiq-al-sharia NEW + tariq ext ×3 | 1 | 3 panel perspectives | — | concept + person ext | ~45 cited windows | ebc6d0731 (PR #2207) |
| al-wassitiya/ep05 | ~1:20 | al-ilmaniyya-wal-islam NEW + tariq ext ×3 | 1 | 2 panel perspectives | — | concept + person ext | ~45 cited windows | 15bef9638 (PR #2208) |
| al-wassitiya/ep06 | ~1:19 | al-wataniyya-wal-qawmiyya NEW + tariq ext ×3 | 1 | 2 panel perspectives | — | concept + person ext | ~40 cited windows | 51f010a2e (PR #2209) |
| al-wassitiya/ep07 | ~1:22 | takfir EXT + tariq ext ×3 | — | 3 panel perspectives | — | concept + person ext | ~35 cited windows | 3a795aa53 (PR #2210) |
| al-wassitiya/ep08 | ~1:10 | takfir EXT pt2 + tariq ext ×3 | — | +1 perspective | — | concept + person ext | ~20 cited windows | 0262fac25 (PR #2211) |
| al-wassitiya/ep09 | ~1:05 | al-wala-wal-bara NEW + tariq ext ×3 | 1 | 2 perspectives | — | concept + person ext | ~18 cited windows | 161d7bd2e (PR #2212) |
| al-wassitiya/ep10 | ~1:05 | huquq-al-insan NEW + tariq ext ×3 | 1 | 2 perspectives | — | concept + person ext | ~16 cited windows | b947d057b (PR #2213) |
| al-wassitiya/ep11 | ~1:20 | al-hijra-ila-al-gharb NEW + tariq ext ×3 | 1 | 1 perspective | — | concept + person ext | ~15 cited windows | 888250d84 (PR #2215) |
| al-wassitiya/ep12 | ~1:10 | al-fadaiyyat-al-arabiyya NEW + tariq ext ×3 | 1 | 2 perspectives | — | concept + person ext | ~14 cited windows | a1d70da59 (PR #2216) |
| al-wassitiya/ep13 | ~1:10 | al-fatwa-ala-al-fadaiyyat NEW + tariq ext ×3 | 1 | 1 perspective | — | concept + person ext | ~10 cited windows | 0a0d16714 (PR #2217) |
| al-wassitiya/ep14 | ~1:00 | tamkin-al-mara NEW + tariq ext ×3 | 1 | 1 perspective | — | concept + person ext | ~8 cited windows | 061d947e0 (PR #2219) |
| al-wassitiya/ep15 | ~1:17 | al-mara-wal-ittifaqiyat-al-dawliyya NEW + tariq ext ×3 | 1 | 2 perspectives | — | concept + person ext | ~16 cited windows | bfd53c74a (PR #2221) |
| al-wassitiya/ep16 | ~1:17 | faqr-al-rumuz-al-nisaiyya NEW + tariq ext ×3 | 1 | 1 perspective | — | concept + person ext | ~12 cited windows | 3d06fb29d (PR #2222) |
| al-wassitiya/ep17 | ~1:19 | al-muqawama-wal-irhab NEW + tariq ext ×3 | 1 | 2 perspectives | — | concept + person ext | ~16 cited windows | 47e4fbd5e (PR #2225) |
| al-wassitiya/ep18 | ~1:15 | azmat-al-thaqafa-al-shabab NEW + tariq ext ×3 | 1 | 2 perspectives | — | concept + person ext | ~12 cited windows | a0459b7ae (PR #2234) |
| al-wassitiya/ep19 | ~1:23 | al-qiraa-wal-thaqafa EXT + tariq ext ×3 | — | 2 perspectives | — | concept + person ext | ~12 cited windows | 60a0a1745 (merged) |
| al-wassitiya/ep20 | 1:20:16 | khariju-kulliyyat-al-sharia NEW ×3 | — | 4 perspectives | — | concept | ~55 claims; 17 windows dropped; 1 needs_source | PR on branch claude/suwaidan-wassitiya-20-40 (pending merge); run claude-suwaidan-wassitiya-20 |
| al-wassitiya/ep21 | 0:06:55 (archive audio truncated) | al-duat-al-judud NEW ×3 | — | — | — | concept | 11 claims; 1 dropped; 1 attribution flag | PR on branch claude/suwaidan-wassitiya-20-40 (pending merge); run claude-suwaidan-wassitiya-21 |
| al-wassitiya/ep22 | 1:14:26 | al-mara-wal-amal-al-siyasi NEW ×3 | — | 3 perspectives | — | concept | 36 claims; 13 dropped; 4 needs_source | PR on branch claude/suwaidan-wassitiya-20-40 (pending merge); run claude-suwaidan-wassitiya-22 |
| al-wassitiya/ep23 | 1:17:00 | hiwar-al-hadarat NEW ×3 | — | 4 perspectives | — | concept | ~34 claims; 11 dropped; 1 needs_source | PR on branch claude/suwaidan-wassitiya-20-40 (pending merge); run claude-suwaidan-wassitiya-23 |
| al-wassitiya/ep24 | 1:24:03 | al-tibb-al-nabawi-wal-badil NEW ×3 | — | 3 perspectives | — | concept | ~23 claims; 19 dropped | PR on branch claude/suwaidan-wassitiya-20-40 (pending merge); run claude-suwaidan-wassitiya-24 |
| al-wassitiya/ep25 | 1:13:57 | al-fatwa-hurriyya-am-ihtikar NEW ×3 | — | 4 perspectives | — | concept | 31 claims; 13 dropped | PR on branch claude/suwaidan-wassitiya-20-40 (pending merge); run claude-suwaidan-wassitiya-25 |
| al-wassitiya/ep26 | 1:20:59 (same broadcast as ep09) | al-wala-wal-bara EXT ×3 (+3 corrections to ep09 text) | — | +2 perspectives | — | concept ext | 28 claims; 18 dropped + 4 ad blocks; 3 needs_source | PR on branch claude/suwaidan-wassitiya-20-40 (pending merge); run claude-suwaidan-wassitiya-26 |
| al-wassitiya/ep27 | 0:54:19 (archive audio truncated) | taghyir-manahij-al-din NEW ×3 | — | 4 perspectives | — | concept | ~23 claims; 9 dropped; 3 needs_source | PR on branch claude/suwaidan-wassitiya-20-40 (pending merge); run claude-suwaidan-wassitiya-27 |
| al-wassitiya/ep28 | 1:25:45 | tasawwuf EXT ×3 | — | attributed paragraphs | — | concept ext | ~20 claims; 16 dropped; 1 needs_source | PR on branch claude/suwaidan-wassitiya-20-40 (pending merge); run claude-suwaidan-wassitiya-28 |
| al-wassitiya/ep29 | 1:20:38 | hijab EXT ×3 | — | prose perspectives block | — | concept ext | 24 claims; 14 dropped; 1 needs_source | PR on branch claude/suwaidan-wassitiya-20-40 (pending merge); run claude-suwaidan-wassitiya-29 |
| al-wassitiya/ep30 | 1:13:59 (part 1; part 2 not in archive) | tathir-al-jinn-wal-sihr NEW ×3 | — | 4 perspectives | — | concept | 28 claims; 9 dropped; 1 needs_source | PR on branch claude/suwaidan-wassitiya-20-40 (pending merge); run claude-suwaidan-wassitiya-30 |
| al-wassitiya/ep31 | 1:19:18 | surat-al-mutadayyin-fi-al-ilam NEW ×3 | — | 3 perspectives | — | concept | ~13 claim rows; 9 dropped | PR on branch claude/suwaidan-wassitiya-20-40 (pending merge); run claude-suwaidan-wassitiya-31 |
| al-wassitiya/ep32 | 1:12:35 | al-qiwama EXT ×3 | — | +2 perspectives | — | concept ext | ~13 claim rows; 6 dropped | PR on branch claude/suwaidan-wassitiya-20-40 (pending merge); run claude-suwaidan-wassitiya-32 |
| al-wassitiya/ep33 | 1:17:26 | al-ijaz-al-ilmi NEW ×3 | — | 4 perspectives | — | concept | 36 claims; 12 dropped; 4 needs_source | PR on branch claude/suwaidan-wassitiya-20-40 (pending merge); run claude-suwaidan-wassitiya-33 |
| al-wassitiya/ep34 | 1:20:40 | al-bunuk-al-islamiyya NEW ×3 (pt 1) | — | 5 perspectives | — | concept | 31 claims; ~10 dropped + ads | PR on branch claude/suwaidan-wassitiya-20-40 (pending merge); run claude-suwaidan-wassitiya-34 |
| al-wassitiya/ep35 | 1:23:29 | al-bunuk-al-islamiyya ×3 (pt 2) | — | — | — | concept | 28 claims; ~10 dropped + ads; ~10 needs_source (pts 1-2) | PR on branch claude/suwaidan-wassitiya-20-40 (pending merge); run claude-suwaidan-wassitiya-35 |
| al-wassitiya/ep36 | 1:25:23 | tafsir-al-ahlam-al-yawm NEW ×3 | — | 5 perspectives | — | concept | 55 claims; ~14 dropped + 3 ad blocks; 3 needs_source | PR on branch claude/suwaidan-wassitiya-20-40 (pending merge); run claude-suwaidan-wassitiya-36 |
| al-wassitiya/ep37 | 1:15:43 | al-fann-bayn-al-iltizam-wal-taharrur NEW ×3 | — | 4 perspectives | — | concept | 46 claims; 8 dropped + 2 blocks; 1 needs_source | PR on branch claude/suwaidan-wassitiya-20-40 (pending merge); run claude-suwaidan-wassitiya-37 |
| al-wassitiya/ep38 | 1:20:34 | al-talim-bayna-al-taghrib-wal-huwiyya NEW ×3 | — | 3 perspectives | — | concept | 34 claims; ~10 dropped; 1 needs_source | PR on branch claude/suwaidan-wassitiya-20-40 (pending merge); run claude-suwaidan-wassitiya-38 |
| al-wassitiya/ep39 | 1:19:04 | al-tarikh-al-islami-bayna-al-mithaliyya-wal-waqiyya NEW ×3 | — | 4 perspectives | — | concept | 25 claims; ~13 dropped; 4 needs_source (his accounts, attributed) | PR on branch claude/suwaidan-wassitiya-20-40 (pending merge); run claude-suwaidan-wassitiya-39 |
| al-wassitiya/ep40 | 1:18:29 (last episode of the archive) | nazariyyat-al-muamara EXT ×3 (Omar lane record; extension only) | — | 1 block | — | concept ext | 32 claims; 11 dropped; 3 needs_source | PR on branch claude/suwaidan-wassitiya-20-40 (pending merge); run claude-suwaidan-wassitiya-40 |

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
| repetition loops (17 windows) | al-wassitiya ep20 00:17:30, 00:18:00, 00:19:00, 00:19:30, 00:22:00, 00:24:30, 00:30:00, 00:42:00, 00:45:30, 00:46:00–00:47:00, 00:49:30, 00:51:00, 01:00:00, 01:11:30 | token-repetition artefacts, not speech | intelligibility | none needed — founder rule 5 |
| Awqaf imam-exam passage | ep20 01:06:00–01:07:00 | unclear passage plus loops | intelligibility | none |
| closing supplication | ep20 01:12:30 | partly garbled; only «أخلاق العلم» used | intelligibility | none |
| repetition loop | ep21 00:06:00 | «عتـ» ×~150 | intelligibility | none needed |
| rest of ep21 | ep21 00:06:55–end | archive audio truncated; no content exists | — | — |
| repetition loops (13 windows) | ep22 00:06:30, 00:14:30, 00:16:30, 00:17:30, 00:24:30, 00:25:30, 00:28:30, 00:31:00, 00:33:00, 00:49:00, 00:52:30, 00:56:30, 01:06:30 | token loops | intelligibility | none needed |
| repetition loops (9 windows) | ep23 00:26:30, 00:33:30, 00:43:30, 00:46:30, 00:54:00, 01:06:30, 01:11:00, 01:12:00, 01:13:00 | token loops; opening of the presenter's close lost | intelligibility | none needed |
| British mosques "50–70% were churches" | ep23 01:09:00–01:09:30 | speaker unclear, garbled single-occurrence figure | intelligibility | none |
| "10%" token | ep23 00:39:30 | garbled number; 35% used (35+16+49=100) | garbled number | none |
| advertisement / music | ep24 00:07:00–00:07:30, 00:40:30–00:41:00 | not lecture content / not speech | scope | none |
| repetition loops (20 windows) | ep24 00:16:00 … 01:17:00 (loop tails) | token loops | intelligibility | none needed |
| Jordanian patent-holder dispute | ep24 01:15:30–01:16:30 | garbled, heated, names a person | intelligibility | none |
| al-Harith ibn Kalada slip | ep24 00:22:30–00:23:00 | garbled; only "physician of the Arabs" kept | intelligibility | none |
| repetition loops (13 windows) | ep25 00:07:30 … 01:08:30 | token loops | intelligibility | none needed |
| an imam's misreading of a verse | ep25 00:48:30 | would require typing Qur'an text | no Qur'an text | none |
| website name; "engineer before sharia" remark; four guest surnames | ep25 00:32:30, 00:49:00, passim | garbled / speaker unclear | intelligibility | none |
| repetition loops (18 windows) | ep26 00:05:30 … 01:20:00 | token loops | intelligibility | none needed |
| ads and promos | ep26 00:06:00–00:07:00, 00:32:30–00:33:00, 00:51:30–00:52:00, 01:07:00–01:07:30 | not lecture content | scope | none |
| repetition loops (6 windows) | ep27 00:11:30, 00:17:30, 00:21:00, 00:26:30, 00:37:30, 00:40:30 | token loops | intelligibility | none needed |
| youth-rally ad | ep27 00:06:30–00:07:00 | not lecture content | scope | none |
| dismissed curriculum experts' names | ep27 00:32:30 | garbled names | intelligibility | none |
| rest of ep27 | ep27 00:54:00–end | archive audio truncated | — | — |
| repetition loops (13 windows) | ep28 00:05:00 … 01:08:30 | token loops | intelligibility | none needed |
| Italian convert's name; al-Kashani page citation; wonders/nakedness exchange | ep28 00:21:30, 00:42:30, 00:45:00–00:45:30 | garbled | intelligibility | none |
| repetition loops (13 windows) | ep29 00:02:00 … 01:18:30 | token loops | intelligibility | none needed |
| occasion-of-revelation reading; "daughter" exchange | ep29 00:44:00–00:45:00, 01:11:00–01:12:30 | fragmentary / partly garbled | intelligibility | none |
| repetition loops; cross-talk; truncated anecdote | ep30 00:07:30, 00:44:00, 00:38:00–00:39:30, 00:41:00–00:41:30, 00:50:00 | token loops / garbled | intelligibility | none needed |
| hadith wording in the preposition argument and chain details | ep30 00:54:00, 01:03:30–01:05:00 | hadith matn never typed; only described | no hadith matn | none |
| repetition loops (7 windows) | ep31 00:04:30, 00:10:30, 00:23:30, 00:26:00, 00:26:30, 00:38:30, 00:42:00 | token loops | intelligibility | none needed |
| pre-oil/post-oil stereotype split; Hollywood-book years; three guest surnames | ep31 00:39:00, 00:18:30, passim | garbled / contradictory | intelligibility | none |
| repetition loops (5 windows) | ep32 00:06:00, 00:17:30, 00:18:30, 00:31:00, 00:41:30 | token loops | intelligibility | none needed |
| repetition loops (15 windows) | ep33 00:05:30 … 01:12:30 | token loops / non-speech | intelligibility | none needed |
| adverts and promos | ep33 00:06:00–00:07:00, 00:30:30–00:32:00, 00:47:30–00:48:00 | not lecture content | scope | none |
| verse wording recited by a guest | ep33 01:06:00 | Qur'an text never typed | no Qur'an text | none |
| adverts and music | ep34 00:06:30–00:07:30, 00:29:00, 00:51:30–00:52:00 | not lecture content | scope | none |
| repetition loops (10 windows) | ep34 00:40:00 … 01:18:00 | token loops | intelligibility | none needed |
| Hijri year «1335» for 1965 | ep34 01:17:00 | garbled number; Gregorian kept | garbled number | none |
| adverts, music, charity promos | ep35 00:06:00–00:06:30, 00:38:00–00:39:00, 00:58:00–00:59:30 | not lecture content | scope | none |
| repetition loops (13 windows) | ep35 00:21:00 … 01:20:00 | token loops | intelligibility | none needed |
| a guest's "Jewish protocols" aside | ep35 00:33:30 | polemical aside, not reproduced (his gharar argument kept) | polemical | none |
| a student's political aside; Gaza exchange | ep35 00:41:30, 00:42:30 | garbled | intelligibility | none |
| viewers' SMS poll results | ep20, ep26, ep27, ep33 | never read out on air | no data | — |
| repetition loops (14 windows) | ep36 00:02:00 … 01:21:30 | token or sentence loops | intelligibility | none needed (founder rule 5) |
| ads and promos; viewers' SMS poll results (never read on air) | ep36 00:06:00–00:07:30, 01:04:30–01:05:30; 00:03:30 et al. | not lecture content; no data | scope / no data | none |
| hadith wording and Qur'an wording (ep36, Yusuf's and the king's visions) | ep36 00:15:30, 00:18:30, 00:33:30, 00:55:30 | hadith matn and Qur'an text never typed | no Qur'an / no hadith matn | none |
| repetition loops (8 windows); silent break, promo, closing music | ep37 00:10:30 … 01:01:00; 00:04:30–00:05:30, 00:35:00, 01:15:30 | token loops; not lecture content | intelligibility / scope | none needed |
| verse wording on the umma as wasat; poetry recited by the critic | ep37 00:00:00; 00:36:30–00:38:30 | Qur'an text never typed; poetry not reproduced | no Qur'an text / quote limit | none |
| repetition loops (10 windows) | ep38 00:18:00 … 00:57:00 | token loops | intelligibility | none needed |
| repetition loops (10 windows); garbled names; polemical sect label | ep39 00:09:30 … 01:05:00; 00:09:30, 01:08:30 | token loops; not reproduced | intelligibility / polemical | none needed |
| repetition loops (11 windows); Qur'an wording of verses cited by guests | ep40 00:08:30 … 01:02:30; 00:10:00–00:15:30, 00:18:00, 00:25:00 | token loops; Qur'an text never typed | intelligibility / no Qur'an text | none needed |
| Abu Ghanima's characterisations of Jews (polemical) | ep40 00:52:30, 00:54:30–00:55:00 | described and attributed, not reproduced | polemical | none |

## Batch log

- `devin-tareq-al-suwaidan-admin-1` — ep01 of `administrative-processus-abilities` (13 new entities + 1 extension). Course self-dates to ~2007 (mentions the 2007 book *Know How* and the just-announced iPhone).
- `devin-tareq-al-suwaidan-admin-2` — ep02 (4 new concepts: vision/mission, KPI, LOB/SBU, family businesses [contested: women's-intervention claim, labelled speaker's view + needs_source]).
- `devin-tareq-al-suwaidan-wassitiya-19` — al-wassitiya ep19 (reading crisis: EXTENDED concept/al-qiraa-wal-thaqafa (Omar-lane record, reuse-rule); stats 5%/1% books, 150 vs 200 wpm, 14% author royalty; poll 12% busy-excuse vs bad-writing).
- `devin-tareq-al-suwaidan-wassitiya-18` — al-wassitiya ep18 (youth culture crisis: NEW concept/azmat-al-thaqafa-al-shabab; polls 71% real-crisis, 47/43 net-effect; stats 4% books, 6-8h screens).
- `devin-tareq-al-suwaidan-wassitiya-17` — al-wassitiya ep17 (resistance vs terrorism: NEW concept/al-muqawama-wal-irhab; MB rep occupation-only-frame; host civilians=terrorism rule; nonviolence forms).
- `devin-tareq-al-suwaidan-wassitiya-16` — al-wassitiya ep16 (female symbols scarcity: NEW concept/faqr-al-rumuz-al-nisaiyya; 3-cause debate; Promotable Woman study).
- `devin-tareq-al-suwaidan-wassitiya-15` — al-wassitiya ep15 (arab woman + intl conventions: NEW concept/al-mara-wal-ittifaqiyat-al-dawliyya; polls 8% worse-globally, 32% worse-than-world; host rule: take-what-lifts-injustice).
- `devin-tareq-al-suwaidan-wassitiya-14` — al-wassitiya ep14 (women's empowerment: NEW concept/tamkin-al-mara; polls 53% participation, 35/10/55 govt-support).
- `devin-tareq-al-suwaidan-wassitiya-13` — al-wassitiya ep13 (satellite fatwa: NEW concept/al-fatwa-ala-al-fadaiyyat; polls ease-of-access, 43/42/15 who-to-ask, 31% collective-only).
- `devin-tareq-al-suwaidan-wassitiya-12` — al-wassitiya ep12 (arab satellite channels: NEW concept/al-fadaiyyat-al-arabiyya; polls 75% harmful, 76% moral-oversight; stats 79+37 ch, 52% kids-violence).
- `devin-tareq-al-suwaidan-wassitiya-11` — al-wassitiya ep11 (emigration/brain drain: NEW concept/al-hijra-ila-al-gharb; polls 34/26/40 accept, 84% dangerous; stats 54% no-return, 50% drs).
- `devin-tareq-al-suwaidan-wassitiya-10` — al-wassitiya ep10 (human rights Arab world: NEW concept/huquq-al-insan; polls 69% covenants-worthless, 72% arab-worse, 9% intl-intervention; non-political-rights-first).
- `devin-tareq-al-suwaidan-wassitiya-09` — al-wassitiya ep09 (wala/bara AMONG muslims: NEW concept/al-wala-wal-bara; 60%-islam gradation rule; polls 42% takfir-drift, 63% bara-from-peace-advocates, 63% regulate-vs-10% abolish). BACKLOG: ep10-ep16 transcripts ready on disk awaiting processing.
- `devin-tareq-al-suwaidan-wassitiya-08` — al-wassitiya ep08 (takfir pt2 open/closed ruling: EXT takfir again; polls 42/58 ridda-cause, 6/88 who-declares (88%=official body only), 59/41 armed-vs-dialogue).
- `devin-tareq-al-suwaidan-wassitiya-07` — al-wassitiya ep07 (kufr-vs-takfir: EXTENDED existing concept/takfir (my own thin record) instead of dup; polls 29/71 must-takfir, 76% no-right-to-change; takfir-muayyan vs tasarruf, ma'lum-bil-darura, Shafii-Ahmad story).
- `devin-tareq-al-suwaidan-wassitiya-06` — al-wassitiya ep06 (patriotism/nationalism/uruba vs Islam: NEW concept/al-wataniyya-wal-qawmiyya + tariq ext; 4-concept framework; polls 45% clear-def, 78% arab-unity-step, 76% no-conflict).
- `devin-tareq-al-suwaidan-wassitiya-05` — al-wassitiya ep05 (secularism vs Islam: NEW concept/al-ilmaniyya-wal-islam + tariq ext; 3 models FR/AngloSaxon/Turkish; polls 43/57 define, 24/42 spread, 65/35 meet; 'al-islam al-wasati yughnina').
- `devin-tareq-al-suwaidan-wassitiya-04` — al-wassitiya ep04 (sharia implementation totality-vs-stages: NEW concept/tatbiq-al-sharia + tariq ext; polls 28/69/3 clarity, 3-paths; Nawfal 'ta'sil rabbani tafsil insani', Khatib missing codes, Omar-b-AbdulAziz gradualism story).
- `devin-tareq-al-suwaidan-wassitiya-03` — al-wassitiya ep03 (democracy-vs-sharia: NEW concept/al-dimuqratiyya-wal-sharia with 3 perspectives + tariq ext; polls 16/42/42 conflict, 40/60 islamist success; Tamimi procedural-vs-philosophical, Bayati adopt-vs-engage).
- `devin-tareq-al-suwaidan-wassitiya-02` — al-wassitiya ep02 (Islamic discourse mature/reactive: NEW concept/al-khitab-al-islami with 3 perspectives + tariq ext; 4 polls 51/49, 67/33 content, 51/49 internal, 76/24 two-discourses; Jurshi's 4 defects, Rashdan's optimism, mosque/official discourse critique).
- `devin-tareq-al-suwaidan-wassitiya-01` — al-wassitiya ep01 (الوسطية panel show! ep01=Islamophobia: NEW concept/islamufubiya with 3 panel perspectives + tariq ext; votes 51% real / 55% jewish-fingers surprise / 57% arab-media-improving; Runnymede origin, Crusade-committee quote, US stats 2%/10%/25%).
- `devin-tareq-al-suwaidan-mubdioune-29` — al-mubdioune ep29 (al-ghazali pt2: Munqidh-style crisis narrative, tongue bound, 11-year seclusion, Nizamiyya return under Fakhr al-Mulk, Tus khanqah, Fada'ih al-Batiniyya 487 AH commission, the doubt-method to certain knowledge). SERIES COMPLETE 29/29.
- `devin-tareq-al-suwaidan-mubdioune-28` — al-mubdioune ep28 (al-ghazali pt1: closing figure, the praying father, the highwayman's lesson, Nizamiyya/Juwayni 'drowning sea', Baghdad chair at 34, the four-sect quest, doubt, 10-year seclusion, Ihya begun at Dome of the Rock).
- `devin-tareq-al-suwaidan-mubdioune-27` — al-mubdioune ep27 (ibn-sina ext: Safar 370 birth, rejects Isma'ili family creed, medicine at 16 'not a hard science', Metaphysics 40x -> al-Farabi key, mosque prayer when stuck, Mansur b. Nuh cure -> library, hidden retreat at Ibn Ghalib's, Jubba'i language challenge, medical firsts, education theory, Qanun to 17th c., death 428 self-refusal).
- `devin-tareq-al-suwaidan-mubdioune-26` — al-mubdioune ep26 (al-farabi ext: Second Teacher, Ibn al-Sarraj/ibn Khaylan, Aristotle trust story, Ibn Sina testimony, Sayf al-Dawla refusal 4 dirhams/day, Madina Fadila + 16 ruler traits, Plato-Aristotle reconciliation, ~40 works of 100+, death Damascus).
- `devin-tareq-al-suwaidan-mubdioune-25` — al-mubdioune ep25 (al-razi ext: early-learning equation, 20k sheets/year, Mansuri + Tibb Ruhani, Mu'tadidi hospital, jarayat stipends, empirical research, smallpox/measles, Hawi printed 1486, 15-yr Jami', Euclid refuted pre-Ibn al-Haytham, old-woman faith).
- `devin-tareq-al-suwaidan-mubdioune-24` — al-mubdioune ep24 (tashfin pt2: mustajab-al-dawa storm prayer, 3-word reply to Alfonso, Zallaqa 479 AH at 80, heir's death, al-Baji fatwa deposing taifas, 483 AH Andalus unification, death Muharram 500 AH at 100).
- `devin-tareq-al-suwaidan-mubdioune-23` — al-mubdioune ep23 (yusuf-ibn-tashfin pt1: 'sixth rightly-guided caliph', Amazigh context + Almoravids, Abdallah b. Yasin ribat 443 AH, Abu Bakr's abdication, Marrakesh 454 AH, asceticism under vast rule, refuses caliphal title, taifa kings + Toledo 476 AH).
- `devin-tareq-al-suwaidan-mubdioune-22` — al-mubdioune ep22 (ibn-taymiyya pt2: Tatar jihad + Akka, 'station of death', 21 imprisonments, pardoning Nasr's foes, oath-by-divorce + triple-divorce fatwas, works incl 37-vol fatawa + Sarim, citadel death 728 AH + 82 khatmas).
- `devin-tareq-al-suwaidan-mubdioune-21` — al-mubdioune ep21 (ibn-taymiyya pt1: named for grandmother Taymiyya, >90% family-environment stat labelled, 661 AH Harran birth, 200 shaykhs, fatwa at 20, Bazzar/Daqiq/Suyuti/Dhahabi testimony, dawn-dhikr session, boy refuses Quran wages, garment to beggar, generous answers).
- `devin-tareq-al-suwaidan-mubdioune-20` — al-mubdioune ep20 (abd-al-qadir-al-jilani ext: Hasani/Husayni/Siddiqi lineage, 470 AH Gilan birth, mother's 40 dinars + bandit-chief conversion, Baghdad hardship, Ghazali method, 521 AH preaching + 70k estimate, mufti on two madhhabs, Nawawi/Ibn Taymiyya/Nadwi testimony).
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
