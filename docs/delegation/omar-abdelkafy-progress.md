# Lane `omar-abdelkafy`: progress

Lane document: [`docs/agents/lanes/omar-abdelkafy.md`](../agents/lanes/omar-abdelkafy.md). Method: [`docs/agents/audio-video-harvest.md`](../agents/audio-video-harvest.md).

## Next step

(Updated 1 Nov 2026, overnight run by Claude Code, claude-opus-5-5.) The Khutab and Durus Explorer now lists every series of this lane that has been written: `work/al-fawzu-al-moubeen`, `work/al-hoquq`, `work/tafsir-al-quran-al-qareem`, `work/aadau-al-islam`, `work/sharh-ketab-al-fawaed`, `work/al-naba-al-safi`, `work/al-dinu-al-qayem` (kind `lecture-series`, `delivered.by` and `authors` → `person/omar-abdelkafy`, `about` edges to every record that cites the series), beside the khutab-durus lane's `work/silsilat-qissa-wa-ebra`. Next: `silsilat-qissa-wa-ebra` from episode 4 (episodes 1–3 were written by the khutab-durus lane), then the remaining transcribed series in the order of `scripts/harvest/audio/resume_queues.sh` MAIN_SERIES (`sharh-al-hekam-al-ataeya`, `nafahat-ramadaneya-1436-h`, `al-manjeyat`, `wa-nafsun-ma-sawaha`, `tariq-al-noor`, `bustan-el-amal`, `al-dar-al-akhera`, `silsilat-ebadu-al-rahman`, `muktatafat-mena-al-seera`, `albuyout-alamena`), then `sharh-saheeh-al-bukhare`, then the video series. Open translation item: `concept/time-as-resource` has no `en` or `ur` file.

Series written before this run but not logged here until now (found by grepping the cite anchors, 1 Nov 2026): `sharh-ketab-al-fawaed` (run `omar-abdelkafy-sharh-ketab-1`, commit b43f0060de: 15 new, 28 extended; anchors from episodes 1–6 and 9 only, so episodes 7, 8 and 10 have no written window), `sharh-ketab-al-fawaed` eps 6–10 completed 8 Nov 2026 (run `assabile-av-fawaed-6-10`, commit f09e9b6e7a on `agent/assabile-av`, PR #5655: 40 entities extended ar/en/ur, all ten episodes now cited; claims tables in harvest workspace `books/assabile/omar-abdelkafy/sharh-ketab-al-fawaed/claims/`), `al-dinu-al-qayem` (commit 4ff1005060: 11 new, 78 extended; all 13 episodes), `al-naba-al-safi` (commit 1132c4262d: 13 new, 41 extended; all 24 episodes).

## Done

- 25 Oct 2026: pilot transcripts finished for episodes 1–4 (`~/islam-museum-harvest/books/assabile/omar-abdelkafy/aadau-al-islam/`, with `.json`, `.txt` and `.meta.json`).

- 25 Oct 2026: archive probed in the built-in browser. 25 series, about 620 lessons (7 video, 18 audio). Episode pages carry titles and durations and a direct MP3 link (`media.assabile.com`). robots.txt does not disallow the lesson pages or the media host; no licence statement found on the site.
- 25 Oct 2026: pilot downloaded: `aadau-al-islam` episodes 1–4 (SHA-256 in `~/islam-museum-harvest/raw/assabile/omar-abdelkafy/aadau-al-islam/SHA256SUMS`). Audio is 8 kbit/s mono, 8 kHz.
- 25 Oct 2026: transcription model measured on episode 1 (44 min): `whisper-large-v3-turbo` about 60 s, visibly weaker Arabic; `whisper-large-v3` (mlx) about 3 min 15 s. Default set to large-v3.
- 25 Oct 2026: `data/source/assabile-omar-abdelkafy.yaml` registered; `scripts/harvest/audio/download.py` and `transcribe.py` written.

## Doubts in the record

- Transcript quality: the working engine's output is noisy (garbled and invented lines) and does not agree with the large-v3 pass on most windows. Used as authorised by the founder on 25 Oct 2026; unclear lines dropped, single-occurrence names and numbers marked `needs_source`.
- Birth year: the archive's biography says "labour day of 1952"; English Wikipedia and Wikidata say 1 May 1951. Both kept; the record shows the conflict (not yet written into the person record; to do in the first prose batch).
- The archive lists his name as Omar AbdelKafy and Omar Abdelkafi; the record keeps Omar Abd al-Kafi / Abdelkafy as the label.

## Completed recordings (report per `audio-video-harvest.md` §8)

| Recording | Duration | Prose | Persons | Places | Events | Other entities | Claims verified | Commit |
|---|---|---|---|---|---|---|---|---|
| al-fawzu-al-moubeen, episodes 1–14 (Al Fawzu Al Moubeen, Sharjah TV) | per episode, from the archive and ffprobe (not recorded in this batch) | ar: 25 new + 13 extended records; en and ur: all except concept/time-as-resource | 21 concepts, 2 practices, 2 persons new; 4 persons and 9 concepts extended; no places, events or works | 448 cite markers in the new and extended Arabic files (283 in new records across 179 windows; 165 in appended sections across 157 windows) | 198 exclusion ranges (see the exclusions table below); 70 needs_source annotations in the new Arabic prose; 69 across the whole Arabic files of the 13 extended records (earlier tags not separated) | pending coordinator commit |

Downloaded and transcribed, not completed: `aadau-al-islam` episodes 1–4 (transcripts only; verification in progress).

## Excluded items (standing rule, founder's instruction, 25 Oct 2026)

Every enrichment, prose passage, claim or entity that is dropped or left out must be listed here, with:
- **Item:** the entity, sentence or line (with its episode and timestamp).
- **Reason:** what was wrong with it (unclear transcript line, garbled name or number, conflict with another source, outside the lane's scope, and so on).
- **Gate failed:** the rule it did not meet (for example "unclear transcript", "single occurrence, name garbled", "no citation resolves", "schema check").
- **Override:** `open` until the founder authorises re-entry; then `re-entered by founder authorisation (date)` or `kept excluded`.

Nothing is re-entered without the founder's written authorisation.

| Item | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Pilot windows excluded by the two-engine check: 1 of 205 agreed across ep01–ep04 (about 99.5% excluded) | aadau-al-islam ep01–ep04 (ep02 has MP3 decoder warnings) | Qwen and large-v3 gave different words for the same audio | Two-engine agreement check (per 60 s window) | Re-entered by founder authorisation (25 Oct 2026): all four pilot episodes are included from the working engine's output. |
| Transcript lines the extraction agent did not use (Aadau Al Islam, Qwen pass): about 82 of 408 lines by a repetition heuristic (an estimate, not a hand count); 13 further points kept as `needs_source` annotations, not exclusions | aadau-al-islam ep01–ep04 | Garbled or repeated text, unclear in context | Clarity judgement by the agent (no gate number); the heuristic count is only an estimate | Open. Lines are retrievable from the Qwen transcripts; re-entry needs your authorisation. |
| Discarded by founder decision (25 Oct 2026): garbled windows are not used and are not re-listened. Al Hoquq, 268 windows garbled or unclear in context (the earlier "off-topic" label is withdrawn; founder, 25 Oct 2026: any intelligible topic is included) (ep01 65, ep02 46, ep03 41, ep04 60, ep05 56) | al-hoquq ep01–ep05 | Clear Arabic that makes sense in context | Clarity judgement by the extraction agent | Open |
| Re-entry authorised by the founder (25 Oct 2026): included as the speaker's view, tagged contested (`sensitivity: contested` and a `:::perspectives` block). Al Hoquq, 56 windows on contested matters, previously held back (ep01 00:03:00–00:03:30; 00:10:00–00:12:30; 00:21:00. ep02 00:14:00–00:14:30; 00:16:00; 00:28:30–00:30:00; 00:42:00–00:42:30. ep03 00:12:00–00:13:00; 00:16:30–00:21:30; 00:36:00–00:38:30. ep04 00:12:00–00:17:30; 00:26:00–00:27:30; 00:46:30–00:47:30. ep05 00:13:30–00:17:00) | al-hoquq | A perspectives block needs a cited Sunni source and an academic source; none held for these | Missing sources for the perspectives block | Open. Re-entry needs a cited Sunni and academic source, then your authorisation. |
| Al Hoquq, 41 repetition loops or non-sentences | al-hoquq ep01–ep05 | Reads as a non-sentence | Automatic detection | Open |
| Al Hoquq, 15 supplications and formulae | al-hoquq ep01–ep05 | Not a fact | Content rule: facts only | Open |
| Re-entry authorised by the founder (25 Oct 2026): added, with needs_source where unverifiable. Al Hoquq, dropped points inside cited windows: ep05 00:08:00–00:08:30 (aqiqa at an advanced age, unclear; a medical claim about teeth, unsupported); ep03 00:16:30, 00:17:30, 00:37:00–00:37:30 (single-occurrence figures 1920, 1930, 200 million, 73 million dollars, 180 dollars); ep05 00:38:30 (a smoking figure from an unnamed study); ep02 00:37:00 (Qur'an reference 24:3, unclear context); ep01 00:29:30 (Qur'an reference 33:36, contested use) | as listed | Garbled single figures, unverifiable or unclear claims, contested use | Single occurrence, garbled; unverifiable; unclear context; contested | Open |

| Tafsir Al Quran Al Qareem: 193 windows (54 repetition loops, 139 garbled or unclear, out of 1,220). Full ranges in `docs/delegation/omar-abdelkafy-excluded-tafsir.md` | tafsir ep01–ep10 | Loops are not speech; garbled windows may be discarded (founder, 25 Oct 2026); the garbled count also includes formulae and logistics not separated by the readers | Automatic loop detection; reader judgement | Open |
| Al Fawzu Al Moubeen: 198 exclusion ranges, 214 windows (32 repetition loops, 117 partly unclear windows, 65 logistics windows) out of 1,226 | al-fawzu-al-moubeen ep01–ep14 | Loops are not speech; unclear parts of partly readable windows are discarded (founder, 25 Oct 2026); logistics is not content. Full ranges in `docs/delegation/omar-abdelkafy-excluded-al-fawzu.md` | Loop check and reader judgement (founder decisions 5 and 6) | Open |

Names and numbers spoken once (for example a count of ten children, age fourteen, seven years of discipline, the aqiqa days, six rights) are kept as `needs_source` annotations, not excluded.

## Decision on exclusions (founder, 25 Oct 2026)

- Everything the speaker says that is intelligible is included, on any topic. Nothing is dropped as "off-topic". The earlier "off-topic" label is withdrawn.
- Garbled or unclear windows are not written as content. They are flagged for re-listening or re-transcription, and the founder may override.
- Repetition loops are not content and stay excluded.
- Contested windows are included as the speaker's own view, labelled as his view. The academic and other views are marked "not yet sourced" until cited sources exist.
- Recited formulae are included when the speaker explains them. The recitation itself is never typed.

## Decision on opinions and rants (founder, 25 Oct 2026)

- **Opinions and rants are content too** (founder, 25 Oct 2026). If a passage is the speaker's own opinion, criticism or rant and not a fact of a known category (person, place, event, practice, concept), include it anyway. Place it where it fits best: a `question` entity (the issue, with the speaker's view as a labelled perspective and any tensions) when it answers a question; a `concept` with the closest category (for example `social` or `ethical`) when it is an idea; or the person's record, in a section headed as the speaker's opinion, when it is about a person. Label the view in the perspectives block as "speaker's view (opinion)" or "speaker's view (rant)". Set `sensitivity: polemical` when it attacks a group or a person (described and cited, never reproduced in quotation). Set `sensitivity: contested` when the matter is disputed. Do not drop opinions for lack of a category.


## Batch log
- Silsilat Qissa Wa Ebra, episodes 4–8 (1 Nov 2026, run `omar-abdelkafy-qissa-b1`, Claude Code, branch `content/omar-abdelkafy-qissa-1`): series record extended with per-episode sections (ar/en/ur); new `concept/qissat-sahib-al-jannatayn`, `concept/qissat-ashab-al-qarya`; appended sections to `person/dhu-al-qarnayn`, `person/qarun`, `person/sulayman`, `person/bilqis`, `person/abdullah-ibn-salam`, `concept/ashrat-al-saa`, `concept/hasad`, `concept/shukr`, `concept/al-rizq-al-rububi`. Stories of episodes 4–8 (Qur'anic passages named by the speaker are linked as concepts or persons; the Qur'an text is never typed). Anchors cited per episode from the transcript pass5-qwen. Excluded: episode 8 at about 00:04:30 is a repetition loop (not written); episode 4 at about 00:08:00 is a repetition loop (not written). Doubts: the 120-situations count (ep04 00:06:00), the Iliya Abu Madi poem's occasion (ep04 00:08:30), and Qarun's gold-making account (ep07 00:05:00) are marked needs_source. Gate: repetition loop, automatic detection; override open.

- Explorer backfill (1 Nov 2026, run `omar-abdelkafy-explorer-backfill-1`, Claude Code claude-opus-5-5): 7 new `work` records of kind `lecture-series` with ar/en/ur prose (summary cited to the archive's series index and to the episode anchors where the speaker introduces the series; then a per-episode list of the museum records written from the series, each with the record's first anchor in that series). `about` edges: al-fawzu-al-moubeen 37, al-hoquq 17, tafsir-al-quran-al-qareem 136 (with passage/quran-78-1 and 79-1), aadau-al-islam 15 (`sensitivity: contested`: the title and its judgements are the speaker's), sharh-ketab-al-fawaed 43 (`book_studied: work/al-fawaid-ibn-qayyim`), al-naba-al-safi 54, al-dinu-al-qayem 88. No transcript content was newly written in this batch; nothing excluded. Decision taken without the founder (overnight authority): series records are named by the archive slug, as `work/silsilat-qissa-wa-ebra` is; the per-episode lists are derived from the existing records' anchors, not re-read from the transcripts.

- Batch 0 (25 Oct 2026, commit on branch `claude/harvest-omar-abdel-kafi-content-81375c`): method document, scripts, lane document, source entity, registry and engineering-doc updates; person record `person/omar-abdelkafy` enriched in ar, en and ur with the archive's biography conflict (birth 1951 against 1952) and the archive's list of 25 series (622 lessons) under `source/assabile-omar-abdelkafy`. Sources: the archive's own pages (biography, series index), not transcripts. Checks: `npm run validate` 0 errors, `npm test` 13 of 13 files pass, `npm run cite-check -- person/omar-abdelkafy` pass, `npm run coverage` regenerated.
- Pilot transcripts (outside git): `aadau-al-islam` episodes 1–4, large-v3, about 13 times real time. Used for no prose yet.
- Batch 1, include-all run (25 Oct 2026, run `omar-abdelkafy-include-all-1`; not yet committed, coordinator commits): new `concept/qanaa`, `concept/qalb-salim`, `practice/adab-al-akl`; extended `concept/huquq-al-zawjayn`, `concept/huquq-al-walidayn`, `concept/huquq-al-abna`, `concept/nifaq`, `concept/hijab`, `concept/hudud-penalties`, `concept/ihtikar`, `concept/ilm`, `practice/tahnik`, `practice/aqiqa`, `person/omar-abdelkafy` (figures list). 46 new windows cited (210 distinct now, from 164). Contested records tagged `sensitivity: contested`: huquq-al-zawjayn, huquq-al-walidayn, hijab, hudud-penalties, practice/aqiqa. Founder-listed figures kept with `needs_source`: ep05 00:08:00–00:08:30 (the transcript there speaks of circumcision, not an aqiqa at advanced age; the dental claim is needs_source), ep03 00:16:30, 00:17:30, 00:37:00–00:37:30 (1920, 1930, 180 dollars, 73 million dollars), ep05 00:38:30 (74%, unnamed study), ep02 00:37:00 and ep01 00:29:30 (Qur'an references not named by the speaker, not linked). Checks: `npm run cite-check` 14 of 14 pass; `npm run validate` 0 errors; `npm run coverage` regenerated.
- Batch 2 (25 Oct 2026, run `omar-abdelkafy-al-fawzu-1`; not yet committed, coordinator commits): series `al-fawzu-al-moubeen`, 14 episodes. Readers wrote notes per episode (672 content rows, 198 exclusion ranges, every verification phrase found in its window). New records (25): concept/al-fawz-al-mubin, concept/al-khusr, concept/tadabbur-al-quran, concept/al-qiraa-wal-thaqafa, concept/al-indimaj-wal-huwiyya, concept/huquq-wal-wajibat, concept/bay-al-nafs-wal-mal-ila-allah, concept/adl-wal-fadl, concept/tafaul, concept/sharh-al-sadr, concept/mahabbat-al-nabi-lil-kawn, concept/kitman-al-sirr, concept/ayat-al-insan, concept/kazm-al-ghayz, concept/ilf-al-rafahiya, concept/himmat-al-nafs, concept/sunnat-al-ihlak, concept/ahwal-al-mumin, concept/wada-allah, concept/kitab-al-amal, concept/fana-al-dunya, practice/kafalat-al-yatim, practice/ikram-al-dayf, person/umm-musa, person/firawn. Extended (appended sections): person/ibrahim, concept/sabr, concept/shukr, person/umar-ibn-al-khattab, concept/qalb-salim, concept/amanah, concept/time-as-resource (Arabic only), concept/jiwar, concept/iqra, person/al-hasan-al-basri, concept/al-sidq-truthfulness, concept/al-rizq-al-rububi, person/omar-abdelkafy. Checks: cite-check 38 of 38 pass; honorific scan clean; passage links resolve; `npm run validate` 0 errors (one warning: `data/_stubs.d/quran-mentions.yaml` still lists `person/firawn` as a stub; remove that line in its own lane). Caution: episodes 13 and 14 are very noisy; claims from them are the most fragile and several are flagged needs_source; the coordinator may want a listen-check at the anchors. Excluded items: `docs/delegation/omar-abdelkafy-excluded-al-fawzu.md`.

## Parallel writer: sharh-al-hekam-al-ataeya, al-manjeyat, tariq-al-noor (1 Nov 2026, Claude Code claude-opus-5-5)

Overnight run under the founder's full authority; decisions taken without asking are noted here. Claims tables: `~/islam-museum-harvest/books/assabile/omar-abdelkafy/<series>/claims/epNN.tsv` (one row per anchor and target, with the transcript line, engine Qwen3-ASR pass5, 30 s window).

### Completed recordings (§8)

| Recording | Duration | Prose | New / extended | Claims (windows used of total) | Doubts | Commit |
|---|---|---|---|---|---|---|
| sharh-al-hekam-al-ataeya ep01–ep04 (Episodes 01–04) | about 67, 69, 53, 65 min (last transcript window) | ar, en, ur: 2 new records (work/sharh-al-hekam-al-ataeya, concept/majalis-al-ilm) + 16 extended (sections appended; work/hikam-al-ataiyya got its first prose files) | 1 work, 1 concept new; 1 work, 4 concepts, 2 practices, 9 persons extended | ep01 50/136, ep02 21/139, ep03 4/107, ep04 28/131 | 1 needs_source (names in the well story, ep01 00:33:30) | run omar-abdelkafy-sharh-al-hekam-1 |
| sharh-al-hekam-al-ataeya ep05–ep06 (Episodes 05–06) | about 50, 57 min (last transcript window) | ar, en, ur: 17 records extended, series record extended | 2 events, 4 concepts, 2 practices, 8 persons extended (incl. work/hikam-al-ataiyya) | ep05 49/100, ep06 33/114 (claims table rows / windows) | 3 needs_source (trench figures, ep05 00:21:00; wudu study, ep06 00:23:30; dating inference for Ahmed Yassin noted as derived) | run omar-abdelkafy-sharh-al-hekam-2 |
| sharh-al-hekam-al-ataeya ep07–ep09 (Episodes 07–09) | about 57, 52, 57 min | ar, en, ur: 19 records extended, series record extended | 7 concepts, 1 practice, 10 persons extended (incl. work/hikam-al-ataiyya) | ep07 65/114, ep08 68/105, ep09 27/114 (claims rows / windows) | 3 needs_source (statistics in the dry-law passage, ep07 00:28:30; al-Mansur named for al-Farazdaq's poem, ep07 00:42:00; "sword" for the coat of mail in Ali's case, ep09 00:15:00) | run omar-abdelkafy-sharh-al-hekam-3 |
| sharh-al-hekam-al-ataeya ep10–ep13 (Episodes 10–13) | about 55, 52, 54, 81 min | ar, en, ur: 15 records extended, series record extended (`sensitivity: contested` added: the speaker's views on the word «terrorism», on Abu Bakr's stipends and on partisan groups) | 6 concepts, 1 question, 8 persons extended | ep10 36/110, ep11 21/106, ep12 21/110, ep13 35/163 | none new | run omar-abdelkafy-sharh-al-hekam-4 |
| sharh-al-hekam-al-ataeya ep14–ep17 (Episodes 14–17) | about 78, 83, 81, 58 min | ar, en, ur: 12 records extended, series record completed (17 episodes) | 4 concepts, 4 practices, 1 event, 2 persons extended (incl. work/hikam-al-ataiyya) | ep14 40/156, ep15 48/166, ep16 29/162, ep17 9/116 | 3 needs_source (teacher aged 95, ep14 00:07:30; zakat arithmetic, ep15 00:43:00; smoking cost figures, ep17 00:45:30) | run omar-abdelkafy-sharh-al-hekam-5 |

## Parallel writer: nafahat-ramadaneya-1436-h, wa-nafsun-ma-sawaha, bustan-el-amal (overnight 1 Nov 2026, Claude Code claude-opus-5-5)

Claims tables: `~/islam-museum-harvest/books/assabile/omar-abdelkafy/<series>/claims/epNN.tsv` (claim, anchor, transcript line, target, flags, engine and window). Engine: Qwen3-ASR pass5-qwen, 30-second windows.

### Batch log

- nafahat-1 (run `omar-abdelkafy-nafahat-1`): series `nafahat-ramadaneya-1436-h`, episodes 1–6 (the speaker's own title: «آفات اللسان», the faults of the tongue; he says the series had thirty episodes, the archive holds six). New: `work/nafahat-ramadaneya-1436-h` (lecture-series, 14 `about` edges), `concept/afat-al-lisan`, `concept/al-dua-ala-al-nafs-wal-awlad`, `concept/sabb-al-sahaba` (`sensitivity: contested`; his takfir judgement attributed, perspectives block with the academic view not yet sourced). Extended with a cited section in ar/en/ur: `concept/mann`, `practice/dua`, `concept/shirk`, `concept/satr`, `concept/tajassus-wa-tahassus`, `concept/hifz-al-lisan`, `concept/ghadab`, `concept/tul-al-amal`, `concept/companionship-suhba`, `concept/hubb-al-sahaba`, `person/abu-hazim-al-araj`. Decision taken without the founder: hadiths he quotes are described in the museum's words with no matn typed; Qur'an linked only where he names the sura (41:34, Fussilat).
- wa-nafsun-1 (run `omar-abdelkafy-wa-nafsun-1`): series `wa-nafsun-ma-sawaha` (programme of about 10-minute episodes, announced as sponsored by the Ali bin Abdullah Al-Juffali Charitable Foundation and Tibyan, Jeddah), episodes 1–6. New: `work/wa-nafsun-ma-sawaha` (lecture-series, sections per episode, rebuilt each batch), `concept/maratib-al-nafs`, `concept/fann-al-hiwar`, `concept/al-minha-fi-al-mihna`. Extended: `concept/tarbiya`, `person/abu-dharr-al-ghifari`, `concept/tawakkul`, `person/hajar`, `practice/dua`, `person/nuh`, `concept/tatfif-short-measure`, `concept/kafaa`, `person/yaqub`, `concept/al-muasharah-bil-maruf`, `concept/al-bayt-al-muslim`, `person/umm-salama`, `person/musa`. Added a truthful `provenance` block to `person/hajar` and `person/umm-salama` (both lacked one, so cite-check failed). Qur'an links only where he names the sura (83:1 al-Mutaffifin, 99:7 al-Zalzala); the verse 2:216, recited without naming the sura, is described, not linked.
- wa-nafsun-2 (runs `omar-abdelkafy-wa-nafsun-2`, `-3`): episodes 7–14. New: `concept/al-qawl-al-hasan`, `concept/iftira`, `concept/al-makr-al-sayyi`. Extended: `concept/maratib-al-nafs` (the soul's ascent, ep10), `concept/nafs-lawwama`, `concept/kadhib`, `person/al-asmai`, `person/abbas-ibn-abd-al-muttalib`, `person/al-shafii`, `person/qarun`, `person/firawn`, `person/tarafa-ibn-al-abd`, `practice/birr-al-walidayn`, `concept/fann-al-hiwar` (dialogue with those who differ, ep11), `concept/khawf`, `concept/raja`, `person/al-khidr`, `concept/al-rizq-al-rububi`, `concept/tawadu`, `concept/ghadd-al-basar`, `concept/huquq-al-abna`, `practice/hifz-al-quran`; series record rebuilt with sections to ep14 (36 `about` edges). Qur'an linked only for 109:6 (he names Surat al-Kafirun).
- wa-nafsun-3 (runs `omar-abdelkafy-wa-nafsun-4`, `-5`): episodes 15–22. New: `concept/huquq-al-amil`, `concept/al-tawazun-al-kawni` (his personal view on caged animals labelled; the 1957 Chinese sparrow campaign kept as his account with needs_source), `concept/muhasabat-al-nafs`. Extended: `concept/zulm`, `concept/hayawan-animal`, `concept/wird-fiqh`, `concept/tadabbur-al-quran`, `concept/nawafil`, `concept/ghadd-al-basar`, `person/shaqiq-al-balkhi`, `concept/muraqaba`, `concept/al-yaqin`, `concept/ukhuwwa` (his view on 'brotherhood of the homeland' labelled), `question/what-is-ikhlas` (reused instead of a new concept), `concept/riya`, `person/malik-ibn-anas`, `person/harun-al-rashid`, `person/yunus`, `person/abu-hazim-al-araj`; series record rebuilt to ep22 (54 `about` edges). Archive note: episode 21 is a duplicate of episode 20 (same content); cited once in the series record.
- wa-nafsun-4 (run `omar-abdelkafy-wa-nafsun-6`): episodes 23–29; **series `wa-nafsun-ma-sawaha` complete (29 episodes; ep21 duplicates ep20)**. New: `concept/futur-al-nafs`, `concept/al-furuq-al-lafziyya-fil-quran`, `person/haman` (`sensitivity: contested`; his hieroglyph claim attributed, academic view not yet sourced; created over the stub in `data/_stubs.d/quran-mentions.yaml`, which belongs to another lane and was not edited). Extended: `concept/tazkiyya`, `concept/ujb`, `concept/bida`, `question/what-is-fatwa` (his rant on everyone being a mufti), `person/omar-abdelkafy` (his own statement of 45+ years in da'wa), `concept/ghayb`, `person/muhammad-ibn-sirin` (Malik–Ibn Sirin dream story, needs_source: the meeting is not established), `concept/al-tahaddi-bil-quran`, `person/abu-lahab`, `concept/qadar`, `concept/quran-miracle-for-every-age`, `concept/zulm`, `person/ibrahim`, `concept/fann-al-hiwar`; series record rebuilt with all episode sections (68 `about` edges). Qur'an recitations of al-Masad and al-Rum not linked (sura not named).
- bustan-1 (run `omar-abdelkafy-bustan-1`): series `bustan-el-amal` (Ramadan TV programme, about 11-minute episodes), episodes 1–5. New: `work/bustan-el-amal` (lecture-series; sections per episode, rebuilt each batch), `concept/al-faraj-bad-al-shidda`, `concept/al-istirja`, `concept/al-tughyan` (`sensitivity: contested`: his allusions to rulers, drones and the rich labelled as his view). Extended: `concept/raja`, `person/yaqub`, `concept/tawakkul`, `concept/ibtila`, `person/sulayman`, `concept/sabr`, `concept/khawf`, `person/yunus`, `concept/hawa`, `concept/ikhtilaf`, `person/harun`, `concept/ukhuwwa`, `concept/tafwid`, `concept/zulm`.
- bustan-2 (run `omar-abdelkafy-bustan-2`): episodes 6–10; no new concept (all topics reused). Extended: `person/umm-musa`, `concept/al-huzn`, `person/musa`, `person/harun`, `concept/al-yaqin`, `person/harun-al-rashid`, `person/abd-al-malik-ibn-marwan`, `concept/istighfar`, `person/hajar` (his claim that she was of royal lineage, needs_source), `person/ibrahim`, `person/sara`, `concept/hilm` (his 'knowledge without morals' examples labelled), `practice/salah`, `person/imru-al-qays-ibn-hujr`, `person/antara-ibn-shaddad`, `person/ismail` (provenance block added; it had none), `concept/sabr`, `concept/talaq`, `person/yusuf`, `question/what-is-ghiba`; series record sections to ep10 (35 `about` edges).
- bustan-3 (run `omar-abdelkafy-bustan-3`): episodes 11–15. New: `concept/al-iaqa-al-sulukiyya` (his view that the truly 'disabled' is the behaviourally disabled), `concept/idkhal-al-surur`. Extended: `event/year-of-sorrow`, `person/khadija`, `person/abu-talib`, `event/journey-to-taif`, `event/conquest-of-mecca`, `concept/qadar`, `concept/al-tawazun-al-kawni` (second telling: Mao, '58'; the 1957/1958 discrepancy recorded), `concept/hadaya-al-ummal`, `concept/al-rizq-al-rububi`, `concept/al-yaqin` (nine steps), `concept/tawba`, `concept/zuhd`, `concept/shukr`, `person/bilal-ibn-rabah`, `person/al-hasan-al-basri`, `concept/sabr`, `concept/al-istirja`, `person/abdullah-ibn-masud`, `person/abdullah-ibn-hudhafa-al-sahmi`, `person/khubayb-ibn-adi`; provenance blocks added to `event/year-of-sorrow`, `event/conquest-of-mecca`, `person/khubayb-ibn-adi`; series record sections to ep15 (54 `about` edges).
- bustan-4 (run `omar-abdelkafy-bustan-4`): episodes 16–20. New: `concept/al-tadkhin` (his view on smoking labelled). Extended: `concept/mirath`, `person/umar-ibn-abd-al-aziz` (Surat al-Waqi'a named by the speaker, linked to 56:1), `concept/husn-al-zann-billah`, `concept/satr` (Israelite rain story, needs_source), `practice/kafalat-al-yatim` (list of great orphans; orphanhood of some needs_source), `person/ahmad-ibn-hanbal`, `concept/tawba` (five remedies; here attributed to 'one of the great righteous', in Nafahat to al-Husayn; his rant on Ramadan serials labelled), `practice/nikah`, `concept/al-rizq-al-rububi`, `concept/amal` (dignity of work; the Marilyn Monroe 'testament' kept as his account with needs_source), `person/dawud`, `person/sulayman`; series record to ep20 (64 `about` edges).
- bustan-5 (run `omar-abdelkafy-bustan-5`): episodes 21–25. New: `concept/al-ajala-wal-tawani` (haste, wrangling, procrastination, vanity). Extended: `concept/qadar` (train-crossing incident he says he witnessed near Giza station, needs_source), `person/harun-al-rashid` (his defence of Harun against Kitab al-Aghani labelled as his view; mule story needs_source), `concept/al-huzn`, `concept/ibtisama`, `concept/mas-uliyya`, `person/umar-ibn-al-khattab` (orphans' mother; purchase of the grievance needs_source), `concept/ujb`, `person/ali-zayn-al-abidin` (Kufa, forty years: needs_source), `practice/sadaqa`, `concept/tawassul` (three in the cave), `concept/huquq-al-zawjayn`, `concept/iyada`, `person/umar-ibn-abd-al-aziz` (wolves with sheep, needs_source), `person/ayyub` (patience with a difficult spouse; promise needs_source); series record to ep25 (75 `about` edges). Musa's 'I hastened to You' quoted only as the speaker's paraphrase; no verse link because he did not name the sura.
- bustan-6 (run `omar-abdelkafy-bustan-6`): episodes 26–30, **series complete (30/30)**. No new entities; extended: `person/amr-ibn-al-as` (four years, four Badris each worth a thousand: needs_source), `concept/sadaqa-jariya` (key to good / ongoing evil; his examples labelled), `person/qabil`, `person/umm-sharik-al-dawsiyya` (bucket from the sky; husband detail inconsistent in the telling, needs_source), `concept/ashab-al-kahf`, `person/umm-musa`, `concept/qanaa`, `concept/ukhuwwa` (Abu Musa's three things, needs_source; 'brotherhood of homeland and humanity' labelled as his view), `concept/dunya` and `person/isa-ibn-maryam` (Isa and the loaf: Israelite report, needs_source), `person/abd-al-malik-ibn-marwan`, `person/yusuf` (Jibril's palm: needs_source), `person/umar-ibn-al-khattab` (a year as judge with no litigants: needs_source), `concept/muhasabat-al-nafs`, `event/umar-letter-to-the-nile` (his telling beside the Futuh Misr record; sources list un-anchored so provenance keeps only Futuh Misr), `concept/tatayyur-omens`, `practice/istikhara`, `concept/tawidh-amulets-and-incantations` (his rejection of folk customs labelled), `concept/ikhtilaf` (his critique of 'inquisition courts' labelled), `concept/istighfar` (attribution to Ali and the hawqala merit: needs_source), `person/al-hajjaj-ibn-yusuf` (provenance `source` added truthfully), `concept/huquq-al-zawjayn` (Abu Dharr report: needs_source); series record to ep30 (89 `about` edges). Decision: the 'first day like a year' hadith that he links to the sun rising in the west (ep27) is left out as a likely conflation (the known wording concerns the Dajjal's days).

### Completed recordings (§8)

| Recording | Duration | Prose | New / extended | Claims (engine, window) | Doubts | Commit |
|---|---|---|---|---|---|---|
| nafahat-ramadaneya-1436-h ep01 (Episode 01: al-mann) | ~13.5 min (transcript) | ar/en/ur | concept/mann ext.; persons linked | 29 (Qwen3-ASR, 30 s) | 1 needs_source; 1 loop window | nafahat-1 PR |
| nafahat-ramadaneya-1436-h ep02 (calling on other than God) | ~13 min | ar/en/ur | practice/dua, concept/shirk, person/abu-hazim-al-araj ext. | 37 | 2 needs_source (name «البراء» garbled; Abu Hazim story) | nafahat-1 PR |
| nafahat-ramadaneya-1436-h ep03 (praying against oneself) | ~11.5 min | ar/en/ur | concept/al-dua-ala-al-nafs-wal-awlad new | 27 | 1 needs_source; 1 partial loop | nafahat-1 PR |
| nafahat-ramadaneya-1436-h ep04 (reviling the Companions) | ~10 min | ar/en/ur | concept/sabb-al-sahaba new; concept/hubb-al-sahaba ext. | 35 | 1 needs_source; 2 loop windows | nafahat-1 PR |
| nafahat-ramadaneya-1436-h ep05 (covering a Muslim) | ~14 min | ar/en/ur | concept/satr, concept/tajassus-wa-tahassus ext. | 31 | 2 needs_source; 1 non-Arabic line | nafahat-1 PR |
| nafahat-ramadaneya-1436-h ep06 (remedy) | ~11.5 min | ar/en/ur | concept/afat-al-lisan new; hifz-al-lisan, ghadab, tul-al-amal, companionship-suhba ext. | 40 | 1 needs_source (thirty episodes) | nafahat-1 PR |
| wa-nafsun-ma-sawaha ep01 (the soul; the perfect soul) | ~10 min | ar/en/ur | maratib-al-nafs new; tarbiya, abu-dharr ext. | 22 | 1 needs_source; 2 loop windows; jingle and sponsor lines | wa-nafsun-1 PR |
| wa-nafsun-ma-sawaha ep02 (trust in God) | ~10.5 min | ar/en/ur | tawakkul, hajar ext. | 20 | 1 needs_source (Musa and the doctors); 1 loop; 1 English hallucination | wa-nafsun-1 PR |
| wa-nafsun-ma-sawaha ep03 (supplication) | ~10.5 min | ar/en/ur | dua, nuh ext. | 24 | 1 needs_source (Abu Ayyub at sea); garbled «1950» dropped | wa-nafsun-1 PR |
| wa-nafsun-ma-sawaha ep04 (short measure in dealings) | ~9.5 min | ar/en/ur | tatfif, kafaa, yaqub ext. | 29 | 1 needs_source (inheritance hadith); 2 loops | wa-nafsun-1 PR |
| wa-nafsun-ma-sawaha ep05 (affection and dialogue) | ~9.5 min | ar/en/ur | fann-al-hiwar new; muasharah, bayt-muslim ext. | 30 | 0 | wa-nafsun-1 PR |
| wa-nafsun-ma-sawaha ep06 (it may be that you dislike a thing) | ~10.5 min | ar/en/ur | al-minha-fi-al-mihna new; umm-salama, musa ext. | 34 | 0 | wa-nafsun-1 PR |
| wa-nafsun-ma-sawaha ep07 (speak well to people) | ~9.5 min | ar/en/ur | al-qawl-al-hasan new; al-asmai, abbas, birr ext. | 31 (Qwen3-ASR, 30 s) | 1 needs_source (al-Asma'i); 1 Chinese-character hallucination | wa-nafsun-2 PR |
| wa-nafsun-ma-sawaha ep08 (slander) | ~9.5 min | ar/en/ur | iftira new; kadhib, al-shafii ext. | 26 (Qwen3-ASR, 30 s) | 1 needs_source (al-Shafi'i's teeth); 1 loop | wa-nafsun-2 PR |
| wa-nafsun-ma-sawaha ep09 (evil scheming) | ~10 min | ar/en/ur | al-makr-al-sayyi new; qarun, firawn, tarafa ext. | 30 (Qwen3-ASR, 30 s) | 1 needs_source (Abu Hazim and the inkwell) | wa-nafsun-2 PR |
| wa-nafsun-ma-sawaha ep10 (the soul's ascent) | ~9.5 min | ar/en/ur | maratib-al-nafs, nafs-lawwama ext. | 21 (Qwen3-ASR, 30 s) | 0; 2 loops | wa-nafsun-2 PR |
| wa-nafsun-ma-sawaha ep11 (dialogue with those who differ) | ~9.5 min | ar/en/ur | fann-al-hiwar ext. | 18 (Qwen3-ASR, 30 s) | 0; 1 hum line | wa-nafsun-2 PR |
| wa-nafsun-ma-sawaha ep12 (fear and hope) | ~10.5 min | ar/en/ur | khawf, raja, al-khidr ext. | 30 (Qwen3-ASR, 30 s) | 0 | wa-nafsun-2 PR |
| wa-nafsun-ma-sawaha ep13 (provision, true fear) | ~10 min | ar/en/ur | al-rizq-al-rububi, tawadu, ghadd-al-basar, khawf ext. | 24 (Qwen3-ASR, 30 s) | 1 needs_source (Israelite ant story) | wa-nafsun-2 PR |
| wa-nafsun-ma-sawaha ep14 (parents' kindness to children) | ~9 min | ar/en/ur | huquq-al-abna, hifz-al-quran ext. | 21 (Qwen3-ASR, 30 s) | 0; 1 loop | wa-nafsun-2 PR |
| wa-nafsun-ma-sawaha ep15 (worker and employer) | ~9.5 min | ar/en/ur | huquq-al-amil, al-tawazun-al-kawni new; zulm, hayawan ext. | 33 (Qwen3-ASR, 30 s) | 1 needs_source (1957 sparrow campaign) | wa-nafsun-3 PR |
| wa-nafsun-ma-sawaha ep16 (practical steps with the Qur'an) | ~8.5 min | ar/en/ur | wird, tadabbur, nawafil ext. | 17 (Qwen3-ASR, 30 s) | 0 | wa-nafsun-3 PR |
| wa-nafsun-ma-sawaha ep17 (heart and limbs) | ~9.5 min | ar/en/ur | muhasabat-al-nafs new; muraqaba, ghadd-al-basar, shaqiq ext. | 25 (Qwen3-ASR, 30 s) | 2 needs_source (Great Wall bribery; Hatim and Shaqiq); 1 loop; 1 English loop | wa-nafsun-3 PR |
| wa-nafsun-ma-sawaha ep18 (certainty) | ~10 min | ar/en/ur | al-yaqin ext. | 18 (Qwen3-ASR, 30 s) | 0; 3 partial loops | wa-nafsun-3 PR |
| wa-nafsun-ma-sawaha ep19 (rights of brotherhood) | ~9 min | ar/en/ur | ukhuwwa ext. | 21 (Qwen3-ASR, 30 s) | 2 needs_source (Ibn Mas'ud's oxen; Umar and Mu'adh) | wa-nafsun-3 PR |
| wa-nafsun-ma-sawaha ep20 (sincerity) | ~10.5 min | ar/en/ur | what-is-ikhlas, malik-ibn-anas ext. | 25 (Qwen3-ASR, 30 s) | 1 needs_source (Muwatta on the Ka'ba roof) | wa-nafsun-3 PR |
| wa-nafsun-ma-sawaha ep21 (duplicate of ep20) | ~9 min | ar/en/ur (series record note) | none | 1 | 0 | wa-nafsun-3 PR |
| wa-nafsun-ma-sawaha ep22 (sincerity and showing off) | ~12 min | ar/en/ur | riya, harun-al-rashid, yunus, abu-hazim ext. | 28 (Qwen3-ASR, 30 s) | 1 needs_source (cup of water story); 1 loop | wa-nafsun-3 PR |
| wa-nafsun-ma-sawaha ep23 (slackening) | ~8 min | ar/en/ur | futur-al-nafs new | 21 (Qwen3-ASR, 30 s) | 0 | wa-nafsun-4 PR |
| wa-nafsun-ma-sawaha ep24 (obstacles to purification) | ~11.5 min | ar/en/ur | tazkiyya, ujb ext. | 27 (Qwen3-ASR, 30 s) | 0 | wa-nafsun-4 PR |
| wa-nafsun-ma-sawaha ep25 (purifying the soul) | ~10.5 min | ar/en/ur | tazkiyya, bida, what-is-fatwa, omar-abdelkafy ext. | 18 (Qwen3-ASR, 30 s) | 0 | wa-nafsun-4 PR |
| wa-nafsun-ma-sawaha ep26 (Qur'anic words) | ~11.5 min | ar/en/ur | al-furuq-al-lafziyya new; ghayb, ibn-sirin ext. | 26 (Qwen3-ASR, 30 s) | 2 needs_source (jadath sense; Malik's dream); 1 loop | wa-nafsun-4 PR |
| wa-nafsun-ma-sawaha ep27 (challenge; 'ilm and ma'rifa) | ~10 min | ar/en/ur | tahaddi, abu-lahab, qadar, fann-al-hiwar ext. | 26 (Qwen3-ASR, 30 s) | 1 needs_source (Ottoman knockers) | wa-nafsun-4 PR |
| wa-nafsun-ma-sawaha ep28 (inimitability) | ~10 min | ar/en/ur | haman new; quran-miracle ext. | 29 (Qwen3-ASR, 30 s) | 1 needs_source (six mentions); 1 loop | wa-nafsun-4 PR |
| wa-nafsun-ma-sawaha ep29 (good tidings, closing) | ~9.5 min | ar/en/ur | zulm, ibrahim, omar-abdelkafy ext. | 17 (Qwen3-ASR, 30 s) | 1 needs_source (Ibrahim report); 2 loops | wa-nafsun-4 PR |
| bustan-el-amal ep01 (hope; awaiting relief) | ~9.5 min | ar/en/ur | al-faraj-bad-al-shidda new; raja, yaqub ext. | 26 (Qwen3-ASR, 30 s) | 1 needs_source (verses and castaway story) | bustan-1 PR |
| bustan-el-amal ep02 (God suffices us) | ~11.5 min | ar/en/ur | tawakkul, ibtila, sulayman, sabr ext. | 23 (Qwen3-ASR, 30 s) | 1 needs_source (Abu Ishaq at sea); 1 loop | bustan-1 PR |
| bustan-el-amal ep03 (fear, hunger, istirja') | ~11 min | ar/en/ur | al-istirja new; khawf, ibtila ext. | 25 (Qwen3-ASR, 30 s) | 0; 1 loop | bustan-1 PR |
| bustan-el-amal ep04 (Yunus) | ~11.5 min | ar/en/ur | yunus, hawa, ikhtilaf ext. | 23 (Qwen3-ASR, 30 s) | 0; 2 loops | bustan-1 PR |
| bustan-el-amal ep05 (tyranny) | ~12 min | ar/en/ur | al-tughyan new; harun, ukhuwwa, tafwid, zulm ext. | 41 (Qwen3-ASR, 30 s) | 0; 1 loop | bustan-1 PR |
| bustan-el-amal ep06 (do not fear, do not grieve) | ~10.5 min | ar/en/ur | umm-musa, al-huzn, musa, harun ext. | 27 (Qwen3-ASR, 30 s) | 2 needs_source (the one-year agreement; verses); 1 loop | bustan-2 PR |
| bustan-el-amal ep07 (no, my Lord is with me) | ~11 min | ar/en/ur | musa, al-yaqin, harun-al-rashid, abd-al-malik, istighfar ext. | 27 (Qwen3-ASR, 30 s) | 3 needs_source (600,000; two caliph stories) | bustan-2 PR |
| bustan-el-amal ep08 (Ibrahim and Hajar) | ~11 min | ar/en/ur | hajar, ibrahim, sara, hilm, salah ext. | 29 (Qwen3-ASR, 30 s) | 1 needs_source (Hajar's lineage); 2 loops | bustan-2 PR |
| bustan-el-amal ep09 (resolve; the sacrifice) | ~10 min | ar/en/ur | imru-al-qays, antara, ismail, ibrahim, sabr, talaq ext. | 33 (Qwen3-ASR, 30 s) | 3 needs_source (Imru' al-Qays; Antara; sira details) | bustan-2 PR |
| bustan-el-amal ep10 (Yusuf) | ~11 min | ar/en/ur | yusuf, what-is-ghiba ext. | 25 (Qwen3-ASR, 30 s) | 1 needs_source (sayings on backbiting) | bustan-2 PR |
| bustan-el-amal ep11 (the Prophet's hardships) | ~10 min | ar/en/ur | year-of-sorrow, khadija, abu-talib, taif, conquest-of-mecca ext. | 25 (Qwen3-ASR, 30 s) | 1 needs_source (2,000 converts) | bustan-3 PR |
| bustan-el-amal ep12 (why me?) | ~10.5 min | ar/en/ur | al-iaqa-al-sulukiyya new; qadar, tawazun, hadaya, rizq ext. | 32 (Qwen3-ASR, 30 s) | 1 needs_source (Mao '58'); 2 loops | bustan-3 PR |
| bustan-el-amal ep13 (station of certainty) | ~11 min | ar/en/ur | al-yaqin, tawba, zuhd, shukr, bilal, hasan-basri ext. | 28 (Qwen3-ASR, 30 s) | 2 needs_source (60,000 sorcerers; al-Hasan's saying); 1 loop | bustan-3 PR |
| bustan-el-amal ep14 (why the great were patient) | ~10.5 min | ar/en/ur | sabr, al-istirja ext. | 27 (Qwen3-ASR, 30 s) | 0; 1 loop | bustan-3 PR |
| bustan-el-amal ep15 (realistic idealism) | ~10.5 min | ar/en/ur | idkhal-al-surur new; ibn-masud, ibn-hudhafa, khubayb ext. | 23 (Qwen3-ASR, 30 s) | 1 needs_source (Ibn Mas'ud details); 3 loops | bustan-3 PR |
| bustan-el-amal ep16 (anxiety over offspring) | ~11.5 min | ar/en/ur | mirath, umar-ibn-abd-al-aziz, husn-al-zann, satr ext. | 24 (Qwen3-ASR, 30 s) | 3 needs_source (inheritance hadith; Umar's daughters; Israelite story) | bustan-4 PR |
| bustan-el-amal ep17 (the weak and orphans) | ~11 min | ar/en/ur | kafalat-al-yatim, ahmad-ibn-hanbal ext. | 25 (Qwen3-ASR, 30 s) | 2 needs_source (orphan list; Shafi'i verses); 1 loop | bustan-4 PR |
| bustan-el-amal ep18 (repentance and relapse) | ~9.5 min | ar/en/ur | al-tadkhin new; tawba ext. | 24 (Qwen3-ASR, 30 s) | 1 needs_source (five remedies) | bustan-4 PR |
| bustan-el-amal ep19 (delayed marriage) | ~12 min | ar/en/ur | nikah, al-rizq ext. | 24 (Qwen3-ASR, 30 s) | 1 needs_source (dagger story); 2 loops | bustan-4 PR |
| bustan-el-amal ep20 (dignity of work) | ~11 min | ar/en/ur | amal, dawud, sulayman ext. | 26 (Qwen3-ASR, 30 s) | 3 needs_source (Umar and the crow; three doctorates; Monroe 'testament') | bustan-4 PR |
| bustan-el-amal ep21 (caution and decree) | ~10.5 min | ar/en/ur | qadar, harun-al-rashid, al-huzn, ibtisama ext. | 26 (Qwen3-ASR, 30 s) | 2 needs_source (train incident; Harun's mule story) | bustan-5 PR |
| bustan-el-amal ep22 (each is a shepherd) | ~10 min | ar/en/ur | mas-uliyya, umar-ibn-al-khattab, ujb, ali-zayn-al-abidin, sadaqa ext. | 25 (Qwen3-ASR, 30 s) | 2 needs_source (purchase of the grievance; Zayn al-Abidin in Kufa) | bustan-5 PR |
| bustan-el-amal ep23 (men of the cave) | ~10 min | ar/en/ur | tawassul, huquq-al-zawjayn ext. | 17 (Qwen3-ASR, 30 s) | 0 | bustan-5 PR |
| bustan-el-amal ep24 (four things to avoid) | ~10.5 min | ar/en/ur | al-ajala-wal-tawani new | 22 (Qwen3-ASR, 30 s) | 1 needs_source (Bedouin and al-Hajjaj) | bustan-5 PR |
| bustan-el-amal ep25 (the sick and the difficult spouse) | ~11 min | ar/en/ur | iyada, ayyub, umar-ibn-abd-al-aziz ext. | 19 (Qwen3-ASR, 30 s) | 2 needs_source (wolves; Asiya palace promise) | bustan-5 PR |
| bustan-el-amal ep26 (a key to good) | ~11 min | ar/en/ur | amr-ibn-al-as, sadaqa-jariya, qabil, umm-sharik-al-dawsiyya ext. | 28 (Qwen3-ASR, 30 s) | 2 needs_source (conquest figures; Umm Sharik details) | bustan-6 PR |
| bustan-el-amal ep27 (strengthened hearts) | ~10.5 min | ar/en/ur | ashab-al-kahf, umm-musa, qanaa, ukhuwwa ext. | 22 (Qwen3-ASR, 30 s) | 1 needs_source (Abu Musa's saying); 1 hadith left out; 1 loop | bustan-6 PR |
| bustan-el-amal ep28 (the world does not stay the same) | ~13 min | ar/en/ur | dunya, isa-ibn-maryam, abd-al-malik-ibn-marwan, yusuf, umar-ibn-al-khattab, muhasabat-al-nafs ext. | 34 (Qwen3-ASR, 30 s) | 3 needs_source (Isa story; Abd al-Malik's age; Jibril's palm) | bustan-6 PR |
| bustan-el-amal ep29 (customs without basis) | ~11 min | ar/en/ur | umar-letter-to-the-nile, tatayyur-omens, istikhara, tawidh ext. | 24 (Qwen3-ASR, 30 s) | 1 needs_source (Nile letter as told) | bustan-6 PR |
| bustan-el-amal ep30 (when will I see my community?) | ~11.5 min | ar/en/ur | umar-ibn-al-khattab, ukhuwwa, ikhtilaf, istighfar, al-hajjaj-ibn-yusuf, huquq-al-zawjayn ext. | 23 (Qwen3-ASR, 30 s) | 4 needs_source (Umar as judge; Ali and istighfar; hawqala merit; Abu Dharr) | bustan-6 PR |

### Excluded items

| Item | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | nafahat ep01 00:02:30; ep03 00:10:00 (tail); ep04 00:02:30, 00:06:00 (tails) | Loop is not speech | Loop check (founder decision 5) | open |
| Non-Arabic hallucinated line | nafahat ep05 00:14:00 | Not speech of the lesson | Clarity | open |
| Closing supplications and greetings | nafahat ep01–06, final windows | Formulae, not content | Content rule (formulae kept only when explained) | open |
| Line on the Prophet's chest «ثلاثة راهب بحسب ملئ من الشر» | nafahat ep05 00:01:00 | Garbled wording of a hadith; hadith matn not typed anyway | Clarity; no hadith matn | open |
| Poem lines at ep01 00:07:30–00:08:00 | nafahat ep01 | Garbled verse; quoted poetry not reconstructed | Clarity | open |
| Programme jingle, sponsor announcements, greetings and closing supplications | wa-nafsun ep01–06, 00:00:00–00:01:30 and final windows | Not lesson content (sponsor names kept once in the series record) | Content rule | open |
| Repetition loops and non-Arabic hallucinations | wa-nafsun ep01 00:00:30, 00:01:30, 00:08:30; ep02 00:00:30, 00:10:30; ep03 00:00:30; ep04 00:07:30, 00:09:30 | Not speech | Loop check (founder decision 5) | open |
| Number «1950» for Nuh's years | wa-nafsun ep03 00:04:30 | Garbled; his clear wording «a thousand years less fifty» used instead | Clarity | open |
| Jingle, sponsor lines, greetings, closing supplications | wa-nafsun ep07–14, opening and final windows | Not lesson content | Content rule | open |
| Loops and non-Arabic hallucinations | wa-nafsun ep07 00:10:30; ep08 00:05:00; ep10 00:03:00, 00:07:00; ep11 00:09:30; ep12 00:10:30; ep14 00:04:30 | Not speech | Loop check | open |
| Tarafa's verse on injustice from kin | wa-nafsun ep09 00:02:00 | Verse partly garbled; given only in sense, not quoted | Clarity | open |
| sharh-al-hekam-al-ataeya: windows not written (ep01 86, ep02 118, ep03 103, ep04 103 of 513) | ep01–ep04, all windows not listed in the claims tables | Garbled or unclear transcript (this series' audio is the poorest so far: mixed dialect, overlapping voices), repetition loops, supplications and formulae, logistics and questions from the floor read only in part | Clarity judgement (founder decisions 5 and 6, 25 Oct 2026) | Open |
| Anecdote of Ash'ab and the caliph | ep01 00:26:00–00:27:30 | Names and story garbled | Unclear transcript | Open |
| Sa'd ibn Abi Waqqas and the crossing to al-Mada'in | ep01 00:41:30–00:44:30 | Story recognisable but sentences garbled | Unclear transcript | Open |
| sharh-al-hekam-al-ataeya: windows not written, ep05 about 60 of 100, ep06 about 85 of 114 (Ahmed Yassin prayer and martyrdom passages kept; Abu Ayyub dream story ep06 00:10:00–00:11:00, names garbled; Uqba and the braid of hair ep06 00:19:00–00:19:30, garbled; music and the camel-driver ep06 00:32:30–00:35:30, unclear) | ep05–ep06 | Garbled or unclear; names garbled | Clarity judgement | Open |
| sharh-al-hekam-al-ataeya: windows not written, ep07 about 75 of 114, ep08 about 60 of 105, ep09 about 95 of 114 (al-Hasan ibn Ali reading, ep07 00:15:00, garbled; Abu Hanifa and Malik rant, ep09 00:33:00–00:34:30, unclear; Abu Bakr and Umar disagreement, ep09 00:06:00–00:07:00, unclear) | ep07–ep09 | Garbled or unclear | Clarity judgement | Open |
| sharh-al-hekam-al-ataeya: windows not written, ep10 about 75 of 110, ep11 about 85 of 106, ep12 about 90 of 110, ep13 about 128 of 163 (al-Ghazali dream-interpretation story ep10 00:21:30–00:23:00; Abu Hazim and Abd al-Malik ep10 00:41:00; Isa and the thief, the poisoned food ep11 00:46:30–00:51:00; Ahmad ibn Hanbal in prison ep13 00:52:30; all garbled) | ep10–ep13 | Garbled or unclear | Clarity judgement | Open |
| sharh-al-hekam-al-ataeya: windows not written, ep14 about 116 of 156, ep15 about 118 of 166, ep16 about 133 of 162, ep17 about 107 of 116 (king and friend with bad breath ep15 00:13:30–00:16:00; Abu Hanifa and his neighbour ep17 00:19:00–00:21:00; all garbled) | ep14–ep17 | Garbled or unclear; the last episodes are the poorest audio of the series | Clarity judgement | Open |
| Umar and the servants who took a camel (Hatib ibn Abi Balta'a story; names garbled as «مطعم بن عبيد») | ep01 01:02:00–01:03:30 | Names garbled; the point (Umar's reading of the circumstances) not clear enough to write | Single occurrence, name garbled | Open |
| Openings, supplications, closing formulae; thanks to crew, channel and family | bustan ep26–30 | Not lesson content | Content rule | open |
| Names of the four Badris sent to Egypt | bustan ep26 00:03:00 | Garbled names in the transcript | Clarity | open |
| 'First day like a year, estimate its measure' linked to the sun rising in the west | bustan ep27 00:03:00–00:04:30 | Likely conflation with the Dajjal hadith | Accuracy | open |
| Loop | bustan ep27 00:08:30 | Loop check | Loop check | open |
| Poetry recited (Abu Madi; 'people go to whoever has gold') | bustan ep27 00:07:00; ep28 00:04:30–00:05:00 | Verbatim verse | Sources policy | open |

### Batch log

- Batch H1 (run `omar-abdelkafy-sharh-al-hekam-1`): series record `work/sharh-al-hekam-al-ataeya` (book_studied `work/hikam-al-ataiyya`, about edges to every record written from it) with sections for episodes 1–4. Decision: the maxims are given by their sense, not quoted, because the transcript of the recited maxim is not exact; the archive slug names the record.
- Batch H2 (run `omar-abdelkafy-sharh-al-hekam-2`): episodes 5–6; 17 records extended; series record sections 5–6. Decision: the episode that opens with a prayer for Sheikh Ahmed Yassin is recorded as recorded after 22 March 2004 (an inference, marked as such).
- Batch H3 (run `omar-abdelkafy-sharh-al-hekam-3`): episodes 7–9; 19 records extended. Note: `person/usayd-ibn-hudayr` and `person/tufayl-ibn-amr-al-dawsi` fail cite-check on pre-existing missing provenance (records from earlier lanes, left untouched apart from the appended cited section).
- Batch H4 (run `omar-abdelkafy-sharh-al-hekam-4`): episodes 10–13; 15 records extended; series record marked `sensitivity: contested`.
- Batch H5 (run `omar-abdelkafy-sharh-al-hekam-5`): episodes 14–17; 12 records extended. Series `sharh-al-hekam-al-ataeya` complete (17 of 17). Decision: the episode remarks on «the worlds of 2004» (ep15) and the prayer for Ahmed Yassin (ep05) are recorded as dating evidence for the lessons, not as a recording date.

| Jingle, sponsor lines, greetings, closing supplications | wa-nafsun ep15–22, opening and final windows | Not lesson content | Content rule | open |
| Loops and non-Arabic hallucinations | wa-nafsun ep17 00:02:30, 00:09:30; ep18 00:03:00, 00:03:30, 00:05:00 (partial); ep22 00:02:00 (partial), 00:03:00, 00:12:00 | Not speech | Loop check | open |
| Episode 21 content | wa-nafsun ep21 | Duplicate upload of episode 20 in the archive; not written twice | Duplicate | open |
| Poem lines quoted at ep22 00:04:00 | wa-nafsun ep22 | Verse not reconstructed (garbled; quoted poetry) | Clarity | open |
| Jingle, sponsor lines, greetings, closing supplications | wa-nafsun ep23–29, opening and final windows | Not lesson content | Content rule | open |
| Loops | wa-nafsun ep26 00:03:00; ep28 00:08:30; ep29 00:02:00, 00:05:30 | Not speech | Loop check | open |
| Garbled figures in ep28 00:05:30–00:06:00 (dates of the world wars, «139») | wa-nafsun ep28 | Garbled; only the clear point (a defeated power needs a generation) used | Clarity | open |
| Recitation of Surat al-Masad and Surat al-Rum | wa-nafsun ep27 00:02:30; ep28 00:04:30 | Qur'an never typed; sura not named so not linked | Qur'an rule | open |
| Opening supplications, greetings, closing formulae; jingle hum lines | bustan ep01–05, opening and final windows | Not lesson content; loops | Content rule; loop check | open |
| Supplications for Ramadan at ep01 00:00:30–00:01:00 | bustan ep01 | Formulae, not explained | Content rule | open |
| Name «إسحاق» for the infant left at Mecca | bustan ep08 00:05:00 | A slip or mis-transcription (the context is Isma'il); written without the name | Clarity | open |
| Openings, greetings, closing supplications; hum loops | bustan ep06–10 | Not lesson content; loops | Content rule; loop check | open |
| Partly garbled lines on the division of Greater Syria (ep06 00:09:00) and the attributes of forbearance (ep08 00:04:30) | bustan ep06, ep08 | Loop tails; only the clear part used | Loop check | open |
| Openings, Ramadan supplications, closing formulae; hum loops | bustan ep11–15 | Not lesson content; loops | Content rule; loop check | open |
| Arabic proverb verses on the old woman and the perfumer (ep12 00:05:00) | bustan ep12 | Verse garbled; not used | Clarity | open |
| Openings, Ramadan supplications, closing formulae | bustan ep16–20 | Not lesson content | Content rule | open |
| Loops and partly garbled lines | bustan ep17 00:06:00 (tail); ep19 00:02:30, 00:06:30 | Loop check | Loop check | open |
| Year «62 69» for the Monroe testament | bustan ep20 00:09:30 | Garbled figure | Clarity | open |
| Openings, supplications, closing formulae | bustan ep21–25 | Not lesson content | Content rule | open |
| Poems recited in full (smile verses, 'not optimistic' poet) | bustan ep21 00:09:00–00:10:00 | Verbatim verse beyond 40 words | Sources policy | open |
| Garbled lines in the wrangling passage | bustan ep24 00:05:30–00:06:30 | Unclear reading | Clarity | open |

### Parallel writer: al-manjeyat (1 Nov 2026, Claude Code claude-opus-5-5)

New series record `work/al-manjeyat` (Ramadan programme on Dubai TV, 27 episodes; about edges to every record written from it).

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-manjeyat ep01–ep05 (Episodes 01–05) | about 23–24 min each (transcript) | ar, en, ur: 1 new record (work/al-manjeyat), 10 extended | 6 concepts, 1 practice, 4 persons extended | ep01 28, ep02 22, ep03 21, ep04 29, ep05 31 | 2 needs_source in records (17 hypocrites, ep03 00:10:00; no headache until final illness "per the sira books", ep04 00:01:00 stated as his) | run omar-abdelkafy-al-manjeyat-1 |

| Excluded (al-manjeyat) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Windows not written, ep01–ep05 (about 20 of 47, 15 of 35, 22 of 46, 18 of 46, 16 of 48): openings and closing supplications, loops (ep01 00:08:30, 00:10:30, 00:13:00, 00:16:30), the ruqya anecdote ep04 00:16:30 (garbled) | ep01–ep05 | Formulae, loops, garbled | Content rule; loop check; clarity | Open |
| al-manjeyat ep06–ep09 (Episodes 06–09) | about 24 min each | ar, en, ur: 1 new record (person/abu-al-dahdah), 10 extended | 1 person new; 7 concepts, 2 practices extended | ep06 30, ep07 25, ep08 35, ep09 30 | none new | run omar-abdelkafy-al-manjeyat-2 |
| Excluded (al-manjeyat ep06–ep09): openings and closing supplications; the imam left without followers ep06 00:05:30, the sparrow story ep06 00:10:00, the man carrying his mother ep07 00:10:00, the zakat-auditor remark ep07 00:18:00 (garbled); loops ep06 00:18:30, ep09 00:11:00, 00:19:30 | ep06–ep09 | Garbled, formulae, loops | Clarity; content rule; loop check | Open |
| al-manjeyat ep10–ep12 (Episodes 10–12) | about 24 min each | ar, en, ur: 11 records extended | 4 concepts, 3 practices, 5 persons extended | ep10 36, ep11 41, ep12 36 | none new | run omar-abdelkafy-al-manjeyat-3 |
| Excluded (al-manjeyat ep10–ep12): openings and closing supplications; diabetes in Arab countries ep10 00:21:30 and the heavy iftar ep10 00:22:00 (fragmentary); al-Shafi'i's adab ep11 00:07:30 (garbled); loops ep10 00:08:00, ep12 00:11:30 | ep10–ep12 | Fragmentary, garbled, loops | Clarity; loop check | Open |

## silsilat-ebadu-al-rahman, episodes 3 onward (from 11 Nov 2026, Claude Code claude-fable-5-2)

Series record `work/silsilat-ebadu-al-rahman` (28 lessons; episodes 1–2 written on 9 Nov 2026). Transcripts: `books/assabile/omar-abdelkafy/silsilat-ebadu-al-rahman/pass5-qwen/` (Qwen3-ASR, 30-second windows). Batch specs and the appender (`apply_eps.py`, which generates the cite anchors so the three languages carry the same ones, and checks timestamps, wikilinks, honorifics, Urdu script and YAML) live in the same harvest folder under `batches/`. The record's provenance carries an `extended` list naming this model and run for the episodes it wrote; its review state is left as it was.

Trust criteria used (recorded for reuse): a point is written only from windows that read as clear Arabic in context; Qur'an verses are linked only when the lecturer names the sura (verses 25:63–64, the series' own text), otherwise given by sense without a link; hadith are given by sense and attributed to the lecturer's citation; a figure or count the lecturer gives is recorded as his; a saying attributed to a named person is kept as "he attributes", with `needs_source` when the attribution itself is doubtful.

### Completed recordings (§8)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| silsilat-ebadu-al-rahman ep03–ep05 (affection; "they say: peace" and forbearance; the night prayer) | about 21–23 min each (transcript) | ar, en, ur: 1 record extended (work/silsilat-ebadu-al-rahman), 43 points | 16 new `about` edges (2 passages, 10 concepts and practices, 4 persons) | ep03 14, ep04 15, ep05 14 points; engine qwen3-asr pass5, 30 s windows | 4 needs_source (Ibn Umar's turban, ep03 00:01:30; hadith attributed to al-Bukhari, ep03 00:13:30; Bernard Shaw saying, ep03 00:14:30; the scholar and "whoever saw the Prophet", ep04 00:07:00) | run omar-abdelkafy-ebadu-al-rahman-2 |

### Excluded items

| Item | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, supplications, break jingles (recited verses 25:63–64), closing formulae | ebadu ep03 00:00:00–00:00:30, 00:11:00–00:12:00, 00:20:30–00:21:00; ep04 00:00:00–00:01:00, 00:14:30, 00:22:30–00:23:00; ep05 00:00:00–00:01:00, 00:15:00–00:15:30, 00:22:30–00:23:00 | Not lesson content; Qur'an never typed | Content rule; Qur'an rule | Open |
| Repetition loops | ebadu ep03 00:04:00 (tail); ep04 00:14:00; ep05 00:20:00 | Not speech | Loop check | Open |
| Household anecdote of the child whose sleep is a relief | ebadu ep03 00:03:00 | Partly garbled; only the clear point used | Clarity | Open |
| Verses of poetry (the hard stone; advice given freely; the "would that You were sweet" lines) | ebadu ep03 00:09:00, 00:20:00; ep04 00:09:00–00:09:30, 00:12:30 | Verbatim verse, partly garbled; given by sense or left out | Sources policy; clarity | Open |
| Saying on a time when the reminder of God is hated more than a carcass | ebadu ep03 00:20:00 | Hadith-like wording with no attribution in the lesson | Accuracy | Open |
| Naming Nuh as the prophet called "an insolent liar" | ebadu ep04 00:13:00 | Likely a slip or mis-transcription; the point is written without the name | Accuracy | Open |
| Figures "46 parts" and "13 hours" for the day's half-hours | ebadu ep05 00:13:00 | Garbled figures; the half-hour programme is written without them | Clarity | Open |
| Hadith alluded to on Satan and the one who sleeps through the prayer | ebadu ep05 00:08:30 | Hadith wording not typed; only the lecturer's contrast is written | Hadith rule | Open |

### Completed recordings (§8), continued

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| silsilat-ebadu-al-rahman ep06–ep09 (refuge from Hell and supplication; the middle course in spending; pure monotheism; the sanctity of life and "moral killing") | about 19–23 min each (transcript) | ar, en, ur: 1 record extended, 59 points | 18 new `about` edges (verses 25:65–68, khawf, jahannam, dua, israf, ummat wasat, tawhid, tawakkul, qibla, zulm, ijhad, tarbiya; Hudhayfa, Umar, al-Shafi'i, Musa) | ep06 15, ep07 14, ep08 15, ep09 15 points; engine qwen3-asr pass5, 30 s windows | 5 needs_source (17 hypocrites, ep06 00:02:00; counts of "fire", "garden", "mercy", "punishment" in the Qur'an, ep06 00:10:30; Ibn Mas'ud on the unanswered greeting, ep07 00:14:00; imported-food claim, ep09 00:08:30; Umar's "shackle" saying, ep09 00:20:00) | run omar-abdelkafy-ebadu-al-rahman-3 |

Notes for ep06–ep09. (1) Broadcast: at ep08 00:01:00 the lecturer greets "the viewers of the Sharjah satellite channel", so the programme was broadcast there; recorded in the episode section. (2) Dating evidence (an inference, marked as such): at ep08 00:04:00 he speaks of an earthquake of about nine on the Richter scale in Japan as a recent event, which fits the earthquake of March 2011, so the series was probably recorded in Ramadan 1432 (August 2011) or later; not written as a date in the record. (3) Sensitivity: episodes 9, 10 and 12 carry the lecturer's opinions on disputed matters (abortion, contraception, women's work and separate schooling, censorship, atheism, an unsourced claim about imported food). The decision engine (question `docs/decisions/inbox/assabile-ebadu-sensitivity-contested.yaml`) answered with rule-harvest-include: such points are included, attributed, and each is marked "the lecturer's view"; the record is labelled `sensitivity: contested`, as `work/sharh-al-hekam-al-ataeya` was.

| Excluded (ebadu ep06–ep09) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, supplications, break jingles, closing formulae | ep06 00:00:00–00:01:00, 00:14:00–00:15:00, 00:22:30; ep07 00:00:00–00:01:00, 00:10:30–00:11:00, 00:18:30–00:19:00; ep08 00:00:00–00:00:30, 00:11:30–00:12:30, 00:21:30–00:22:30; ep09 00:00:00–00:01:00, 00:13:30–00:14:00, 00:22:00–00:22:30 | Not lesson content; Qur'an never typed | Content rule; Qur'an rule | Open |
| Repetition loops | ep06 00:05:30 (tail), 00:10:00, 00:11:30 (tail); ep07 00:17:00; ep08 00:05:00 (tail), 00:16:00 (tail), 00:19:30 (tail); ep09 00:01:30, 00:07:30, 00:13:30 | Not speech | Loop check | Open |
| Garbled figures for the number of verses («3663», «6836») | ep08 00:06:00–00:06:30 | Garbled; the clear figure given at 00:09:00 (6,236) is used | Clarity | Open |
| Verses recited (Shawqi's praise poem; "we walked steps written for us"; "let events run"; the orphan line; the old woman and the perfumer; white hair before its time) | ep08 00:07:00–00:08:00, 00:16:00, 00:20:00; ep09 00:16:30, 00:17:30, 00:21:00 | Verbatim verse, partly garbled; named or given by sense only | Sources policy; clarity | Open |
| Remark on Jerusalem and Palestine in the passage on money turning friends to enemies | ep07 00:12:30–00:13:00 | Garbled simile; meaning not recoverable | Clarity | Open |
| Figure in the "stone in a boy's hand" remark | ep07 00:18:00 | Garbled figure and unclear reference; only the clear list of causes of strength is written | Clarity | Open |
| Hot and cold water passage | ep06 00:18:30–00:19:00 | Partly garbled; the clear point (taste depends on the drinker's state) is written from the preceding window | Clarity | Open |
| Wife who says her husband threatens her; the husband who is "not jealous" | ep09 00:13:00 | Garbled | Clarity | Open |
| Foreign words of address ("tante") and the remark on language | ep09 00:19:30–00:20:00 | Loop tail, fragmentary | Loop check | Open |

## albuyout-alamena (Safe Homes), episodes 1 onward (from 11 Nov 2026, Claude Code claude-sonnet-5-5)

New series record `work/albuyout-alamena` (47 lessons on the Assabile archive; a weekly programme from the Dubai channel). Transcripts: `books/assabile/omar-abdelkafy/albuyout-alamena/pass5-qwen/` (Qwen3-ASR, 30-second windows). The record is new, so it is `status.review: draft` with a provenance block (run `omar-abdelkafy-albuyout-1`); it is labelled `sensitivity: contested` on the precedent of `work/silsilat-ebadu-al-rahman` (decision question `docs/decisions/inbox/assabile-albuyout-sensitivity-contested.yaml`, the same rule-harvest-include answer; the lecturer's disputed views are marked as his). Next step: episode 4.

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep01–ep03 (good choice; choice between children and parents and the rulings on marriage; the engagement and its manners) | about 45 min, 47 min, 47 min (transcript) | ar, en, ur: 1 new record (work/albuyout-alamena), 48 points | 37 `about` edges to existing records (practice/nikah, practice/istikhara, concept/haya, concept/al-qiwama, concept/khitba-fiqh, 12 persons, 12 passages and others); no new entities | ep01 16, ep02 15, ep03 17 points; engine qwen3-asr pass5, 30 s windows | 14 needs_source (see below) | run omar-abdelkafy-albuyout-1 |

Notes. (1) Broadcast: the lecturer greets the viewers of the Dubai channel at ep01 00:00:30 and ep01 00:01:00. (2) needs_source points: the consensus of unnamed scholars on five kind words a day (ep01 00:12:00); the Musa story's wife name (ep01 00:15:30); the Sa'id ibn al-Musayyib story (ep01 00:22:30); partly garbled istikhara/look-at-her passage (ep01 00:09:00); caller summaries (ep01 00:29:00, 00:35:30; ep02 00:29:30); the early-figure saying on marrying a daughter to the God-fearing (ep02 00:12:30); the women Companions' story (ep02 00:36:00); the end of ep02 00:43:00; the Greek and English origin of the engagement (ep03 00:00:30); the order to keep the engagement quiet (ep03 00:15:00); part of the divorce passage (ep03 00:38:00); the 8,000 and 17,000 words statistic (ep03 00:40:00). (3) Sensitivity: opinions on the Qur'anic use of zawj/imra'a (qualified by the lecturer himself in ep02), women driving, obedience houses, a psychological pre-marriage examination, gold rings for men.

### Excluded items

| Excluded (albuyout-alamena ep01–ep03) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements and closing formulae | ep01 00:00:00–00:00:30, 00:13:30, 00:27:30, 00:44:30; ep02 00:00:00–00:00:30, 00:15:30, 00:27:30–00:28:00, 00:44:00; ep03 00:00:00–00:00:30, 00:15:00–00:15:30, 00:28:30, 00:46:30 | Not lesson content | Content rule | Open |
| Repetition loops | ep01 00:09:00 (tail), 00:18:30, 00:34:30–00:35:30, 00:36:30–00:37:00, 00:39:30; ep02 00:13:30, 00:26:00, 00:28:30, 00:37:30, 00:39:30–00:40:00, 00:43:30; ep03 00:22:30, 00:36:00, 00:36:30, 00:38:30, 00:42:00 | Not speech | Loop check | Open |
| Poetry recited (the Amr ibn Kulthum verse, a quoted couplet on faults) | ep02 00:08:30, 00:18:00; ep01 00:03:30 | Verbatim verse, partly garbled; given by sense or left out | Sources policy; clarity | Open |
| Hadith wording and istikhara supplication wording | ep01 00:09:00, 00:15:00, 00:27:00; ep02 00:41:30; ep03 00:24:00 | Hadith and supplication wording not typed; reported by sense only | Hadith rule | Open |
| Umar and the Prophet's marriage exchange | ep01 00:20:30 | Garbled | Clarity | Open |
| Calls and answers too garbled to read (Abu Dhabi, Sharjah and Sweden callers' details; Sudan caller's second half; ep02 calls at 00:30:00–00:35:00 in part; ep03 calls at 00:33:00–00:37:30 and 00:42:00–00:43:00) | ep01 00:30:00–00:41:00; ep02 00:29:30–00:35:00; ep03 00:33:00–00:37:30 | Garbled or fragmentary; only the clear question is summarised | Clarity | Open |
| Wig and Shafi'i question; the daughter who loves singing (question only) | ep03 00:34:00, 00:35:00 | Redirected by the lecturer to another programme; answered briefly later | Scope | Open |
| Shari'a wording of the five kind words; the twelve-line remarks on the Greek horse custom beyond the clear point | ep01 00:12:00; ep03 00:01:00 | Unsourced | Accuracy | Open |

### Completed recordings (§8), continued

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| silsilat-ebadu-al-rahman ep10–ep13 ("nor do they commit fornication"; the outcome and the rights of a Muslim; repentance; false witness) | ep10 about 23 min; ep11 13 min 23 s; ep12 9 min 11 s; ep13 5 min 26 s (transcript metadata) | ar, en, ur: 1 record extended, 41 points | 8 new `about` edges (verses 25:69, 25:70, 25:72; zina, ghadd al-basar, mahr, nikah, tawba) | ep10 19, ep11 9, ep12 8, ep13 5 points; engine qwen3-asr pass5, 30 s windows | 4 needs_source (spinsterhood claim, ep10 00:04:30; "69 billion dollars" on music videos, ep10 00:07:30; condolence for a missed takbir, ep11 00:06:30; saying attributed to Umar, ep12 00:02:00) | run omar-abdelkafy-ebadu-al-rahman-4 |

Notes for ep10–ep13. Episodes 11 and 12 are the two halves of one lesson in the archive (ep11 ends at the break, ep12 opens after it). Episode 13 in the archive is incomplete: the file is 5 min 26 s long and stops in mid-sentence; the episode section says so. The opinion points of ep10 and ep12 are marked "the lecturer's view" under the decision recorded for ep09.

| Excluded (ebadu ep10–ep13) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, supplications, break jingles, closing formulae | ep10 00:00:00, 00:13:30–00:14:00, 00:23:00–00:23:30; ep11 00:00:00–00:01:00, 00:12:30–00:13:00; ep12 00:00:00, 00:08:00–00:09:00; ep13 00:00:00–00:00:30 | Not lesson content; Qur'an never typed | Content rule; Qur'an rule | Open |
| Repetition loops | ep10 00:12:00, 00:16:30 (tail), 00:18:30 | Not speech | Loop check | Open |
| Remark about "the Jews in the modern age" and shop mannequins | ep10 00:16:30–00:17:00 | The sentence is cut by a loop and cannot be read; a remark against a group is not written from a broken line | Loop check; clarity | Open |
| Hadith of the palace in Paradise and the Prophet's regard for its owner's jealousy | ep10 00:11:30–00:12:00 | The owner's name is lost in a loop | Loop check | Open |
| Verses on the tooth-stick | ep10 00:12:30 | Verbatim verse; the persons are not named in the clear part | Sources policy; clarity | Open |
| The ant of Sulayman | ep10 00:13:00 | Fragment of a recited verse | Qur'an rule; clarity | Open |
| Verse of Antara and the "I am only of Ghaziyya" line | ep10 00:09:30, 00:17:30 | Verbatim verse; given by sense | Sources policy | Open |
| Location given for the valley called Atham | ep11 00:02:30 | The transcript reads "in the Garden", a slip or mis-transcription; the reading is written without a location | Accuracy | Open |
| Wording of the condolence formula | ep11 00:07:30 | Garbled | Clarity | Open |
| Verses on beholding God and on the Fire closed over its people | ep11 00:10:00–00:12:00 | Qur'an never typed; given by sense, sura not named | Qur'an rule | Open |
| The lecturer's statement that the undutiful child never enters the Garden and the dutiful never enters the Fire | ep13 00:03:00 | Kept, but written as his statement "made without a source"; no ruling in the museum's voice | Voice rule | Open |

### Completed recordings (§8), continued

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| silsilat-ebadu-al-rahman ep14–ep16 (evil deeds turned into good and the door of repentance; passing by idle talk and guarding the tongue; pondering God's signs) | about 23–25 min each (transcript) | ar, en, ur: 1 record extended, 53 points | 10 new `about` edges (verses 25:71, 25:73; hifz al-lisan, namima, tadabbur al-Qur'an, muhasabat al-nafs, mirath; al-Fudayl ibn Iyad, al-Izz ibn Abd al-Salam, Umar ibn Abd al-Aziz) | ep14 17, ep15 18, ep16 18 points; engine qwen3-asr pass5, 30 s windows | 1 needs_source (the sultan's name in the al-Izz ibn Abd al-Salam story, ep15 00:20:00) | run omar-abdelkafy-ebadu-al-rahman-5 |

| Excluded (ebadu ep14–ep16) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, supplications, break jingles, closing formulae | ep14 00:00:00–00:01:00, 00:14:00, 00:24:00–00:25:00; ep15 00:00:00–00:01:00, 00:13:30, 00:23:00–00:23:30; ep16 00:00:00–00:01:00, 00:12:30–00:13:00, 00:23:00–00:23:30 | Not lesson content; Qur'an never typed | Content rule; Qur'an rule | Open |
| Repetition loops and a diacritised hallucination | ep16 00:18:30, 00:23:30 | Not speech | Loop check | Open |
| Remark on the wording of verse 25:71 ("repents a true repentance") | ep14 00:08:30–00:09:30 | Garbled; the argument cannot be followed | Clarity | Open |
| Recited opening of Surat Ta-Ha in Umar's conversion | ep14 00:07:00–00:07:30 | Qur'an never typed; sura not named, so not linked | Qur'an rule | Open |
| Weapon in the Hamza story ("with the sword") | ep14 00:04:30 | Detail doubtful against the usual account; written without the weapon | Accuracy | Open |
| Name in the hadith on the woman with continuous bleeding | ep14 00:21:30 | Name garbled; the concession is written without it | Clarity | Open |
| Supplication "if You see me leaving the gatherings of those who remember" | ep15 00:06:30 | Partly garbled; unattributed | Clarity | Open |
| The "black box of memories" passage | ep15 00:13:00 | Partly garbled | Clarity | Open |
| Wording of the reply attributed to Aisha in the greeting hadith | ep15 00:17:30 | An insult against a group; described ("answered them harshly"), never reproduced | Polemic rule (method rule 3) | Open |
| al-Hasan al-Basri and the narrow rooms in Basra; the powerful man exposed as a thief | ep16 00:17:30–00:18:30 | Anecdotes cut by a loop before their point | Loop check | Open |
| Verses recited ("we blame our time") | ep16 00:20:30 | Verbatim verse; given by sense | Sources policy | Open |

### Completed recordings (§8), continued

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| silsilat-ebadu-al-rahman ep17–ep18 (spouses, offspring and leadership in piety; the closing list of attributes and the power of supplication) | ep17 about 22 min, ep18 about 25 min (transcript) | ar, en, ur: 1 record extended, 25 points | 13 new `about` edges (verses 25:74–76, 66:10–11, 24:26, 16:97; sadaqa jariya, hasad, tarbiya, ajal, sabr, tawakkul, dua; Nuh, Lut, Amr ibn al-As, Uthman) | ep17 14, ep18 11 points; engine qwen3-asr pass5, 30 s windows | 8 needs_source (the Prophet's ruling on secrets, ep17 00:03:30; the lecturer's reading of 24:26, ep17 00:04:30; the wife and the husband's illness, ep17 00:05:00; the hadith on the good practice, ep17 00:15:30; the family's instructions on death, ep18 00:18:00; the sense of the hadith on provision, ep18 00:18:30; the hadith on supplication reversing the decree, ep18 00:11:30; the two brothers' example, the sense only) | run omar-abdelkafy-ebadu-al-rahman-6 |

Notes for ep17–ep18. The recording of ep17 is much garbled from 00:02:00 to 00:02:30 and after 00:14:00, and ep18 repeats the closing verses at length; only clear windows are written. Episode 18 closes the attributes listed in the programme. Points in ep17 and ep18 that are the lecturer's own opinions (the leadership of the pious; the timing of marriage for a girl; the sex of a child) are marked "the lecturer's view" where they are opinion.

| Excluded (ebadu ep17–ep18) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, supplications, break jingles, closing formulae | ep17 00:00:00, 00:10:00–00:10:30, 00:21:30; ep18 00:00:00, 00:13:30–00:14:30, 00:19:30, 00:24:30–00:25:00 | Not lesson content; Qur'an never typed | Content rule; Qur'an rule | Open |
| Repetition loops and hallucinated runs | ep17 00:02:30, 00:14:00, 00:14:30; ep18 00:14:30 (tail), 00:15:00 | Not speech | Loop check | Open |
| Anecdote of the Meccan woman who joked for the women of Mecca and was hosted in Medina | ep17 00:14:30–00:15:30 | Names and sequence garbled | Clarity | Open |
| The institution that corrupts people ("the dancing class") and the charitable-deed reckoning | ep17 00:17:00–00:17:30 | Garbled; the point is unclear | Clarity | Open |
| Lamentation on people's bickering over a prize | ep17 00:07:00 | Partly garbled | Clarity | Open |
| Recited verses on the bee, the rooster and the sparrow | ep18 00:08:00 | Verbatim verse, partly garbled; given by sense only | Sources policy | Open |
| The sentence "we ask what it would be to be among the godfearing if you were rich" | ep18 00:16:00–00:16:30 | Garbled; the point is not recoverable | Clarity | Open |
| Remark on a son who turns against his father | ep18 00:16:00 | Partly garbled; not written | Clarity | Open |
| Money of the chamber and the cameras in the programme | ep17 00:21:00 | Logistics of the broadcast, not lesson content | Content rule | Open |
## al-dar-al-akhera, episodes 1 onward (12 Nov 2026, Claude Code claude-sonnet-5-5)

Series record `work/al-dar-al-akhera` (33 lessons; transcripts `books/assabile/omar-abdelkafy/al-dar-al-akhera/pass5-qwen/`, Qwen3-ASR, 30-second windows). New record, `status.review: draft` with provenance (run `omar-abdelkafy-dar-akhera-1`). Sensitivity `contested` set through the decision engine (`docs/decisions/records/dec-20261112-260.yaml`, rule-harvest-include). Trust criteria as for the ebadu series: a point is written only from windows that read as clear Arabic in context; hadith and verses are given by sense and attributed to the lecturer, never typed; no passage links where the lecturer does not name the sura.

### Completed recordings (§8)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep01-ep03 (agenda and etiquette of visiting the sick; the Prophet's death, dying and the will; condolence customs and Abu Bakr's will) | ep01 39.6 min; ep02 and ep03 about 41 min (transcript) | ar, en, ur: 1 new record (work/al-dar-al-akhera) | 23 `about` edges (concepts, 1 practice, 7 persons) | ep01 22, ep02 18, ep03 15 points; engine qwen3-asr pass5, 30 s windows | needs_source on garbled stretches throughout (30 annotations: ep01 11, ep02 11, ep03 8), notably the third reason for hurrying death (ep01 00:11:30), the amulet ruling wording (ep01), Abu Bakr's objector (ep03 00:24:00) and al-Hajjaj's dying words (ep03 00:34:00) | run omar-abdelkafy-dar-akhera-1 |

| Excluded (dar-akhera ep01-ep03) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops (detected: a word repeated 15 or more times in a window) | ep01 00:01:00, 00:02:30, 00:18:00, 00:29:30, 00:30:00; ep02 00:03:30, 00:05:00, 00:07:00, 00:12:30, 00:18:30, 00:21:00, 00:22:30, 00:24:30, 00:35:00, 00:37:00, 00:40:00; ep03 00:00:30 (tail), 00:02:30, 00:07:30, 00:13:00, 00:15:30, 00:22:30, 00:23:00, 00:23:30, 00:30:00 (tail), 00:32:00, 00:35:30, 00:36:00, 00:38:00 | Not speech | Loop check | Open |
| Openings, break and call-to-prayer pauses, closing supplications and sign-offs; written-questions-only notice | ep01 00:06:30-00:07:00, 00:39:00; ep02 00:10:30, 00:40:30-00:42:00; ep03 00:40:00-00:40:30 | Not lesson content | Content rule | Open |
| Question-and-answer at the end of ep02 (prayer choice, loan fees, microphones, pregnancy) | ep02 00:42:30-00:46:30 | Garbled throughout; no question or answer is recoverable | Clarity | Open |
| Garbled or fragmentary passages | ep01 00:20:00-00:20:30 (telephone anecdote), 00:23:00-00:24:30; ep02 00:09:00 (shrouding and washing details), 00:17:00-00:18:30, 00:23:00-00:24:30, 00:30:00-00:31:00, 00:32:30-00:35:30; ep03 00:04:30-00:05:30, 00:06:00-00:08:00 (the saying on three occasions for breaking the fast), 00:13:30-00:16:00, 00:31:30-00:33:30 (gratitude passage), 00:36:30-00:38:00 | Not recoverable as clear Arabic | Clarity | Open |
| Poem-form will and verses recited | ep03 00:17:30-00:19:30, 00:37:30 | Verbatim verse, garbled | Sources policy; clarity | Open |
| Attribution of "no share in Islam for one who leaves prayer" to Fatima's scene | ep02 00:03:30 | Speaker and attribution unclear | Accuracy | Open |


### al-dar-al-akhera ep04-ep05 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep04-ep05 (causes of punishment in the grave; deeds that save from it; written questions) | ep04 about 42 min; ep05 about 48 min (transcript) | ar, en, ur: 1 record extended (work/al-dar-al-akhera) | 12 new `about` edges (concepts, 3 persons, passage 67, 3 practices) | ep04 20, ep05 18 points; qwen3-asr pass5, 30 s windows | needs_source on garbled stretches (ep04 11, ep05 17); attribution of the 14-deeds hadith to Muslim is the lecturer's and unchecked (ep05 00:17:30); the "Ibn al-Atiyya" quotation (ep04 00:22:30); the Pharaoh-Ramses remark (ep05 00:12:30) | run omar-abdelkafy-dar-akhera-2 |

Opinions labelled as the lecturer's own (record stays `sensitivity: contested`, dec-20261112-260): wife's voluntary fast and covering against a husband's wish, penalty for highway robbery, songs and instruments, the hadra circles, key money, ruling by other than God's law, the ruling on believing fortune-tellers. The hadra criticism (ep04 00:35:00) is the one passage close to `polemical`; it is described, not reproduced, and the question is left to the founder.

| Excluded (dar-akhera ep04-ep05) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep04 00:02:00, 00:04:30 (tail), 00:11:30 (tail), 00:26:30 (tail), 00:28:00, 00:30:00, 00:37:30; ep05 00:09:30, 00:15:30, 00:16:30, 00:21:30, 00:35:00, 00:38:00, 00:43:00 | Not speech | Loop check | Open |
| Garbled or fragmentary passages | ep04 00:06:30, 00:08:00, 00:16:00 (partial), 00:18:00-00:18:30, 00:19:30-00:21:00, 00:27:00-00:28:00, 00:32:00, 00:36:00-00:37:00, 00:39:30-00:40:00; ep05 00:04:30-00:05:30 (the story of the divorced woman), 00:12:00-00:13:00 (partial), 00:16:30-00:17:30, 00:21:00-00:23:00, 00:33:30-00:35:00 | Not recoverable as clear Arabic | Clarity | Open |
| Insulting phrase quoted in a reply to a greeting | ep04 00:33:30 | Abusive wording about a group; the point (courtesy in replying) written without it | Content rule | Open |
| Closing supplications, sign-offs, producer's announcement with phone number and organisation name | ep04 00:42:00; ep05 00:41:30, 00:47:30-00:48:00 | Not lesson content | Content rule | Open |
| Question on a bank loan and one on spending zakat | ep05 00:43:00-00:44:30 | Garbled | Clarity | Open |

Resume point: episode 06 (branch `agent/assabile-dar-akhera`).

### Completed recordings (§8), continued

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| silsilat-ebadu-al-rahman ep19–ep20 (faithfulness: trusts, vows, pledges, dowry; order: the rows, the leader, the fast, zakat categories, the household) | ep19 about 23 min, ep20 about 22 min (transcript) | ar, en, ur: 1 record extended, 29 points | 8 new `about` edges (concept ahd, amana, nadhr, mahr; Abu Jandal, Suhayl ibn Amr, Qarun, Ahmad ibn Hanbal, practice nikah) | ep19 11, ep20 18 points; engine qwen3-asr pass5, 30 s windows | 7 needs_source (his account of working women, ep19 00:04:00; the cave story, ep19 00:07:00 and 00:11:30; zakat figures, ep20 00:04:30, not written; his ruling on shares, ep20 00:06:30; his account of Badr ranks, ep20 00:09:00; the household-budget proposal, ep20 00:17:00) | run omar-abdelkafy-ebadu-al-rahman-7 |

Notes for ep19–ep20. The lecturer's view is marked on all opinion points. The zakat thresholds and rates in ep20 are garbled in the recording and are not written.

| Excluded (ebadu ep19–ep20) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, supplications, break jingles, closing formulae | ep19 00:00:00, 00:15:00, 00:22:30–00:23:00; ep20 00:00:00–00:00:30, 00:12:30, 00:22:30–00:23:00 | Not lesson content; Qur'an never typed | Content rule; Qur'an rule | Open |
| Repetition loops | ep20 00:01:30 (run of repeated syllables), 00:16:30 | Not speech | Loop check | Open |
| Garbled example of the three-person leadership and the Tabuk-era figures | ep20 00:02:30 | Garbled | Clarity | Open |
| Garbled passage on gold, fixed deposits and the 80 figure | ep20 00:06:30–00:07:30 | Figures unreadable | Clarity | Open |
| The garbled descriptions of the contract of the marriage gift (table, chairs, a bride with two eyes) | ep19 00:17:00–00:17:30 | Garbled; the point is written from the clear part only | Clarity | Open |
| Historical figures on the treaty's dates and the Quraysh terms | ep19 00:12:00 | Partly garbled | Clarity | Open |
| Remarks on the ledger of the fast and the Hijri year | ep20 00:03:30–00:03:50 | Garbled | Clarity | Open |
| Statement on the Gulf states' accounts of zakat on oil revenues | ep20 00:05:00–00:06:00 | Figures and place names garbled | Clarity; no figure without a source | Open |

### al-dar-al-akhera ep06 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep06 (minor signs of the Hour, part 1) | about 42 min (transcript) | ar, en, ur: 1 record extended | 1 new `about` edge (concept/ashrat-al-saa) | 20 points; qwen3-asr pass5, 30 s windows | needs_source on 18 of 20 points; the shepherd's name and description (00:16:00), the death toll in the Euphrates hadith (00:12:00), Aisha's saying (00:00:00) | run omar-abdelkafy-dar-akhera-3 |

Opinions labelled as the lecturer's: group recitation in mosques, music, modern readings of the thigh hadith, dress. The hadith on a future fight between Muslims and Jews is given by sense only; his commentary on it is garbled and not written (sensitivity stays `contested`).

| Excluded (dar-akhera ep06) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep06 00:10:00, 00:14:00, 00:14:30, 00:25:30, 00:29:00, 00:30:00, 00:31:30, 00:33:00, 00:33:30 | Not speech | Loop check | Open |
| Garbled passages | ep06 00:07:30-00:10:00 (painting and art tangent), 00:13:00-00:14:00 (Bilal and Ali), 00:19:00-00:19:30, 00:32:00-00:33:00, 00:39:30-00:41:00 | Not recoverable as clear Arabic | Clarity | Open |
| Sign-off | ep06 00:42:00 (greeting and thanks) | Not lesson content | Content rule | Open |

Resume point: episode 07 (branch from origin/main).

### Completed recordings (§8), continued

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| silsilat-ebadu-al-rahman ep21–ep22 (contentment; gentleness) | ep21 about 22 min, ep22 about 22 min (transcript) | ar, en, ur: 1 record extended, 21 points | 6 new `about` edges (verse 20:131; concept qanaa, zuhd, shukr, hirs, rifq-fiqh) | ep21 11, ep22 10 points; engine qwen3-asr pass5, 30 s windows | 5 needs_source (provision in the womb, ep21 00:08:00; the kings and starving peoples, ep21 00:12:00; the spider's-web image, ep22 00:07:30; the Zaynab rope story, ep22 00:17:00; the father and the pram, ep22 00:20:00) | run omar-abdelkafy-ebadu-al-rahman-8 |

Notes for ep21–ep22. Episode 21 is partly garbled from 00:12:00 onward; episode 22 contains long passages of repeated filler, which are excluded.

| Excluded (ebadu ep21–ep22) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, supplications, break jingles, closing formulae | ep21 00:00:00, 00:13:00–00:13:30, 00:21:00–00:21:30; ep22 00:00:00–00:00:30, 00:11:00–00:11:30, 00:21:00–00:21:30 | Not lesson content; Qur'an never typed | Content rule; Qur'an rule | Open |
| Repetition loops and hallucinated runs | ep21 00:19:30 (tail); ep22 00:14:30 (tail), 00:16:30 | Not speech | Loop check | Open |
| Recited verses on the "dismissal of a man in service" and the sons of the poor | ep21 00:03:00, 00:19:00 | Verbatim verse, partly garbled; given by sense | Sources policy | Open |
| The garbled passage on the child in the stroller and the "lightning" image | ep22 00:12:00–00:12:30 | Garbled | Clarity | Open |
| Garbled account of the orphans' home visits | ep22 00:13:30–00:14:00 | Garbled | Clarity | Open |
| Ten-minute remark on the child's reasoning ages | ep22 00:03:00–00:05:00 | Fragmentary, unclear | Clarity | Open |

### al-dar-al-akhera ep07-ep08 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep07-ep08 (minor signs part 2; major signs: smoke, Dajjal, Jesus, Gog and Magog) | ep07 about 40 min; ep08 about 41 min (transcript) | ar, en, ur: 1 record extended | 12 new `about` edges | ep07 15, ep08 15 points; qwen3-asr pass5, 30 s windows | needs_source on most points; Tamim al-Dari and Fatima bint Qays are read from garbled near-matches (ep08 00:19:30, 00:28:00); the figure of 95 signs (ep07 00:37:00); the fatwa year and body (ep07 00:11:00) | run omar-abdelkafy-dar-akhera-4 |

The lecturer's political remarks on the Jews and Jerusalem (ep08 00:17:30-00:18:00) are described, not reproduced; his opinions on smoking, prescribed penalties, bribery and dancers are labelled as his. The sensitivity stays `contested`.

| Excluded (dar-akhera ep07-ep08) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep07 00:02:00, 00:12:00, 00:15:00, 00:16:00, 00:22:00, 00:30:30, 00:36:00; ep08 00:09:00, 00:10:30, 00:11:30, 00:13:00 (tail) | Not speech | Loop check | Open |
| Garbled passages | ep07 00:04:30-00:06:00 (the story of a family and a son; sensitive and unclear), 00:12:30-00:14:00, 00:21:30-00:25:00, 00:36:30-00:37:00; ep08 00:04:00-00:05:30, 00:10:00-00:11:30, 00:14:30-00:16:00, 00:30:30-00:31:30 | Not recoverable as clear Arabic | Clarity | Open |
| Supplications and farewell with the announcement of a three-week break | ep07 00:38:00-00:40:30; ep08 00:40:00-00:40:30 | Not lesson content | Content rule | Open |

Resume point: episode 09 (branch from origin/main).
