# Lane `tareq-al-suwaidan`: the recorded lectures of Tareq al-Suwaidan

_Opened 25 October 2026 on the founder's instruction (`docs/delegation/devin-prompt-suwaidan-sergani-naggar.md`). Binding with `AGENTS.md`, `docs/ai-change-gates.md`, `docs/sources-policy.md`, `docs/agents/publication-standard.md` and the method in [`../audio-video-harvest.md`](../audio-video-harvest.md)._

## Scope

The lane mines the recorded lectures of Tareq al-Suwaidan on the Assabile archive, `https://www.assabile.com/tareq-al-suwaidan`, which lists **23 series and about 402 lessons, all video**:

administrative-processus-abilities (5), al-mubdioune (29), al-wassitiya (40), alamani-al-tarikh (29), asrar-al-qyada-al-nbawya (30), conference-i-m-soul-mind-emotion-body (2), islamic-faces (1), kissa-wa-fikra (29), leadership-development-academy-1 (22), leadership-development-academy-2 (6), leqaa-al-jumu-ah (1), masabih-al-risala (2), mohadarat (2), mukhtarat (1), nesaa-khalidat (30), o-lord-3 (1), rawai-hadaratina (30), sehir-al-quran (29), stories-of-the-prophets (16), tarikhona-fi-al-mizan (30), the-story-of-the-end (27), wind-of-change (28), wind-of-change-2 (12).

Outputs: the speaker's `person/tariq-al-suwaidan` record enriched from the recordings (the record belongs to the `modern-figures` lane; edits here are additive, keeping every existing source and fact); topic entities the lectures explain (concepts, practices, events, people, places, works), each written in the museum's own words and cited to recording anchors; and the archive's source entity `source/assabile-tareq-al-suwaidan`.

## Order of work

Series are harvested in the archive page's order (the list above). Each episode's MP4 is downloaded, its audio extracted to MP3 (mono, 16 kHz), transcribed with the working engine, and its intelligible content written up; then the next series. Batches: at most 25 entities per commit; progress in `docs/delegation/tareq-al-suwaidan-progress.md`.

## Rules specific to this lane

- The method, the rights and the checks are in `audio-video-harvest.md`. The MP4s, extracted MP3s, transcripts and claims tables stay in `~/devin-harvest` (this session's workspace); nothing from them enters git except the museum's own cited prose and the `data/` facts.
- A line from a transcript is used from the working engine's output (Qwen3-ASR, `oddadmix/qwen3-asr-1.7b-arabic-dialectal-v2`), as the founder authorised on 25 Oct 2026, with the engine and window recorded. Unclear lines are dropped, and single-occurrence names or numbers that look garbled are marked `needs_source`.
- The Qur'an and hadith texts he recites are never typed: references only (`[[passage/quran-<sura>-<aya>|label]]`), with his explanation cited.
- Contested matters (creed and madhhab differences, other faiths, politics, historical disputes) get `perspectives` with the Sunni position first; his own positions are attributed to him with the anchor.
- The speaker's `faith` stays `unknown` until two independent sources name his school (the modern-figures rule); a recording in which he states his own school is one attestation, recorded as his statement.
- This lane runs beside the Claude session's `omar-abdelkafy` lane on the same Mac and the same repository: separate clone (`~/devin-harvest/repo-suwaidan`), separate harvest workspace (`~/devin-harvest`), branches `devin/suwaidan-*`; nothing in the other session's paths or branch is touched.

## Overlap

Shares the speaker's `person/tariq-al-suwaidan` record with the `modern-figures` lane (which created it in batch 6 of that lane). Edits to that record are additive: existing sources and facts stay. Other lanes may cite his accounts as an extra source on shared topics.
