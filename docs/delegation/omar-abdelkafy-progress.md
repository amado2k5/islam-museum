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
| silsilat-ebadu-al-rahman ep17–ep18 (spouses, offspring and leadership in piety; the closing list of attributes and the power of supplication) | ep17 about 22 min, ep18 about 25 min (transcript) | ar, en, ur: 1 record extended, 25 points | 6 new `about` edges (verses 25:74–76, 66:10–11, 24:26, 16:97; sadaqa jariya, hasad, tarbiya, ajal, sabr, tawakkul, dua; Nuh, Lut, Amr ibn al-As, Uthman) | ep17 14, ep18 11 points; engine qwen3-asr pass5, 30 s windows | 8 needs_source (the Prophet's ruling on secrets, ep17 00:03:30; the lecturer's reading of 24:26, ep17 00:04:30; the wife and the husband's illness, ep17 00:05:00; the hadith on the good practice, ep17 00:15:30; the family's instructions on death, ep18 00:18:00; the sense of the hadith on provision, ep18 00:18:30; the hadith on supplication reversing the decree, ep18 00:11:30; the two brothers' example, the sense only) | run omar-abdelkafy-ebadu-al-rahman-6 |

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


### Completed recordings (§8), continued

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| silsilat-ebadu-al-rahman ep23–ep24 (dignity: pride and the believer's honour; aspiration: resolve and high goals) | ep23 about 23 min, ep24 about 24 min (transcript) | ar, en, ur: 1 record extended, 23 points | 7 new `about` edges (verses 63:8, 3:139, 2:127; kibr, tawadu, ikhlas, himmat al-nafs; al-Sarakhsi, Abu Hanifa, al-Shafi'i, Usama ibn Zayd) | ep23 11, ep24 12 points; engine qwen3-asr pass5, 30 s windows | 6 needs_source (the odour and worms image, ep23 00:04:00; the Badr figures, ep23 00:10:00; the envoy and the low door, ep23 00:21:00; the Bedouin and the gift, ep24 00:02:30; the handkerchief story, ep24 00:07:00; al-Sarakhsi's imprisonment, ep24 00:11:00) | run omar-abdelkafy-ebadu-al-rahman-9 |

Notes for ep23–ep24. Episode 23 is broken by long loops from 00:11:00 and at its close; episode 24 has garbled passages from 00:13:00. The conflicts between Muslims and their enemies in episode 23 are described only by the lecturer's words, and no military detail beyond what he states is written.

| Excluded (ebadu ep23–ep24) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, supplications, closing formulae | ep23 00:00:00, 00:14:00, 00:23:00; ep24 00:00:00, 00:12:30, 00:13:00, 00:24:00 | Not lesson content; Qur'an never typed | Content rule; Qur'an rule | Open |
| Repetition loops and hallucinated runs | ep23 00:11:00, 00:20:30, 00:23:00; ep24 00:04:30 (tail), 00:14:30 | Not speech | Loop check | Open |
| Recited verse on the believers' dignity (the second verse) | ep23 00:23:00 | Verbatim verse, garbled; not written | Sources policy | Open |
| Garbled passage on the rhythm of the Qur'an, the sun and the moon | ep24 00:01:00–00:02:00 | Garbled; the eagle image is written from the clear part | Clarity | Open |
| Two fragments of verse on the great poet and the nightingale | ep24 00:19:30–00:20:00 | Verse garbled; not reconstructed | Clarity; sources policy | Open |
| Garbled figures of the school year and examinations | ep24 00:19:30 | Garbled | Clarity | Open |
## Parallel writer: tariq-al-noor (11 Nov 2026, Claude Code claude-sonnet-5-5)

Series `tariq-al-noor`, 30 short episodes (about 10 minutes each, Ramadan programme). Record: `work/tariq-al-noor` (draft, provenance run `omar-abdelkafy-tariq-al-noor-N`). Transcripts: `books/assabile/omar-abdelkafy/tariq-al-noor/pass5-qwen/`. Engine Qwen3-ASR pass5, 30-second windows.

### Batch log

| Recording | Prose | New / extended | Doubts | Run |
|---|---|---|---|---|
| tariq-al-noor ep01-ep04 (five kinds of faith; what veils the heart; three kinds of sin; five cases where haste is praised) | ar, en, ur: new series record with 4 episode sections (32 points) | 1 work created; 42 `about` edges to existing records, none created | 9 needs_source: ep01 number of hypocrites and the mixed hypocrite/innovator categories; ep02 the imam's identity and years; ep03 the unnamed verses, Bilal's call to prayer at the conquest, the lion claim; ep04 pilgrimage by instalments, the Umar anecdote, all spinsterhood figures | omar-abdelkafy-tariq-al-noor-1 |
| tariq-al-noor ep05-ep08 (what a person forgets; injustice and its kinds; the four states of the believer; ingratitude) | ar, en, ur: series record extended with 4 episode sections (35 points) | 23 new `about` edges to existing records (65 in total) | 9 needs_source: ep05 the unnamed righteous man; ep06 the guardian-burden claim on hijab and the garbled saying, the unnamed vizier; ep07 al-Hasan al-Basri sweet story roles, the twenty-years narrative, Kufa and the People of the Bench, the unnamed woman Companion; ep08 the unattributed saying on three calamities (reported as such), the unnamed judge | omar-abdelkafy-tariq-al-noor-2 |
| tariq-al-noor ep09-ep12 (heedlessness and the heart; Salman al-Farisi's sayings; four traits; the truthful merchant) | ar, en, ur: series record extended with 4 episode sections (33 points) | 16 new `about` edges (81 in total) | needs_source on: ep09 the Ahmad ibn Hanbal and Shayban exchange roles, the Moses and angel-of-death narrative, the age-seventy narrative, the unattributed companion saying; ep10 the Talha narrative; ep11 the scholars' saying on liars, the forty-days saying, the Abu Hanifa nursing account; ep12 the Uthman caravan account, the Abu Hanifa cloth account | omar-abdelkafy-tariq-al-noor-3 |
| tariq-al-noor ep13-ep15 (five things that corrupt the heart; the wise are three; self-deception and humility) | ar, en, ur: series record extended with 3 episode sections (21 points) | 15 new `about` edges (96 in total) | needs_source on: ep13 the unnamed Companion and Abu Bakr narrative, the campaigns list; ep14 Umar ibn Abd al-Aziz's last words, the verses attributed to al-Shafi'i; ep15 the speaker of the Satan saying, the Jabala account | omar-abdelkafy-tariq-al-noor-4 |
| tariq-al-noor ep16-ep18 (what leads to a good ending; signs of wretchedness; the value of time) | ar, en, ur: series record extended with 3 episode sections (20 points) | 10 new `about` edges (106 in total) | needs_source on: ep16 the womb-writing of provision and the angel-of-death speech; ep18 the unnamed righteous man, the ranking figure 190 | omar-abdelkafy-tariq-al-noor-5 |
| tariq-al-noor ep19-ep21 (hope and mercy; kindness to parents; guarding the tongue) | ar, en, ur: series record extended with 3 episode sections (30 points) | 10 new `about` edges (116 in total) | needs_source on the identity of Muhammad al-Ghazali, Anas, the Abu Nuwas, Umar and Abu Bakr narratives, the absolute ruling on the dutiful and disobedient child, the survey figure | omar-abdelkafy-tariq-al-noor-6 |
| tariq-al-noor ep22-ep24 (silence; knowledge gatherings; trial and contentment) | ar, en, ur: series record extended with 3 episode sections (21 points) | 11 new `about` edges (127 in total) | needs_source on the listening-ratio statistic and unstable word counts (ep22), the Friday-sermon scholars claim, the cosmetic-clinic figure and the seven benefits attributed to al-Hasan (ep23), the Job and David narratives (ep24) | omar-abdelkafy-tariq-al-noor-7 |
| tariq-al-noor ep25-ep27 (signs of happiness; what blocks answered prayer; poverty not feared for the community) | ar, en, ur: series record extended with 3 episode sections (22 points) | 7 new `about` edges (134 in total) | needs_source on the Hasan al-Basri and Umar narratives (ep25), the Hatim al-Asamm and Joseph accounts and the war-death figure (ep27), the identification of Abu Hazim and the caliph (ep27) | omar-abdelkafy-tariq-al-noor-8 |
| tariq-al-noor ep28-ep30 (what lets light into the heart; the three loved and the three disliked; the month's harvest and closing) | ar, en, ur: series record completed with 3 episode sections (23 points); all 30 episodes now written | 9 new `about` edges (143 in total) | needs_source on the inkwell account (ep28), Abu Dharr's saying (ep28), the four marks of piety attributed to Ali (ep29), the Dubai channel name (ep30) | omar-abdelkafy-tariq-al-noor-9 |

| Excluded (tariq-al-noor ep01-ep04) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, supplications, closing formulae | ep01 00:00:00-00:02:00 and 00:09:30-00:10:00; ep02 00:00:00, 00:10:00; ep03 00:00:00, 00:09:30; ep04 00:00:00, 00:09:30-00:10:00 | Not lesson content | Content rule | Open |
| Repetition loops | ep02 00:03:00; ep03 00:07:00, 00:08:00 (tail), 00:08:30; ep04 00:06:00 | Not speech | Loop check | Open |
| Saying about innovators and Hell | ep01 00:07:00 | Garbled wording, hadith-like, no attribution | Clarity; hadith rule | Open |
| Short passage on Ibn Taymiyya, Ibn al-Qayyim, al-Ghazali, Abu Hanifa and Ahmad as jurists | ep04 00:03:00 | Fragmentary | Clarity | Open |


### al-dar-al-akhera ep09 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep09 (resurrection, the gathering, the great intercession) | about 38 min (transcript) | ar, en, ur: 1 record extended | 9 new `about` edges | 18 points; qwen3-asr pass5, 30 s windows | needs_source on most points; the lecturer's ascriptions to Ibn Majah, Ahmad, Tirmidhi and Muslim are unchecked (ep09 00:00:00, 00:03:00); the cubit arithmetic (00:09:00); the claim on a covered woman's sweat has no source (00:11:00) | run omar-abdelkafy-dar-akhera-5 |

| Excluded (dar-akhera ep09) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep09 00:17:30, 00:25:30 | Not speech | Loop check | Open |
| Garbled passages | ep09 00:01:30-00:02:30 (a story about a servant of the Prophet), 00:08:30-00:09:00, 00:12:00-00:12:30, 00:13:30-00:14:30 (remarks on the lecturer's own speech), 00:18:00-00:18:30, 00:23:30-00:24:00, 00:27:30-00:28:00, 00:31:30-00:32:30 (the dragon passage), 00:35:30-00:36:00 | Not recoverable as clear Arabic | Clarity | Open |
| Supplications and sign-off | ep09 00:23:00 (supplication), 00:37:30 | Not lesson content | Content rule | Open |


### al-dar-al-akhera ep10 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep10 (events and names of the Day; abortion; the Fire) | about 41 min (transcript) | ar, en, ur: 1 record extended | 1 new `about` edge (concept/kitab-al-amal); 4 existing | 13 points; qwen3-asr pass5, 30 s windows | needs_source on all points; oil-reserve figures and the report they are ascribed to (00:06:00); the abortion rulings, sums and the ascription to the Muslim World League are his own words (00:16:30, 00:18:30); book and author names for the Day's names (00:36:30) | run omar-abdelkafy-dar-akhera-5 |

The lecturer's opinion on abortion, adoption and the scientific readings of the Qur'anic signs is labelled as his; the record stays `sensitivity: contested`.

| Excluded (dar-akhera ep10) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep10 00:03:30, 00:04:00, 00:11:30, 00:36:00 | Not speech | Loop check | Open |
| Garbled passages | ep10 00:03:00 (Kaaba tawaf remark), 00:10:00-00:12:00 (the eggs, birds and trapping passage), 00:12:30-00:13:00, 00:15:00-00:16:00, 00:19:00 (partial), 00:20:30-00:21:00, 00:28:30-00:30:30 (partial, the Prophet and the Fire), 00:37:00-00:39:30 (Q&A fragments) | Not recoverable as clear Arabic | Clarity | Open |
| Poem on the Day of Resurrection recited | ep10 00:31:00-00:33:00 | Verbatim verse, partly garbled | Sources policy; clarity | Open |
| Supplications and sign-off | ep10 00:30:30, 00:37:00 | Not lesson content | Content rule | Open |



### albuyout-alamena, episodes 4–5 (11 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-2)

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep04–ep05 (the legal viewing and frankness; the start of married life, "that you may find tranquillity in them") | about 46 min, 41 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 26 points | 21 new `about` edges (khitba, mahr, hiba, zulm, Ibn Khaldun, Ibn Hazm, Ahmad ibn Hanbal, Abu Hanifa, Ibn Taymiyya, Abu Bakr, passages 21:90, 30:21, 3:123, 42:49–50) | ep04 13, ep05 13 points; engine qwen3-asr pass5, 30 s windows | 9 needs_source: ep04 call details (00:31:00), the Prophet and Aisha and al-Hasan al-Basri accounts (00:42:00), the greatest-betrayals report (00:44:00); ep05 the coma news item (00:02:30), Ibn Khaldun attribution (00:05:30), wedding-night prayer form (00:10:30), figures on divorce and assault (00:18:00), Abu Bakr's saying (00:24:00), call details (00:27:30) | run omar-abdelkafy-albuyout-2 |

Next step: episode 6.

| Excluded (albuyout-alamena ep04–ep05) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep04 00:00:00–00:01:30, 00:16:00, 00:30:30–00:31:00, 00:46:00–00:46:30; ep05 00:00:00–00:00:30, 00:12:00–00:12:30, 00:26:30–00:27:00, 00:40:00–00:40:30 | Not lesson content | Content rule | Open |
| Repetition loops | ep04 00:08:30, 00:10:00, 00:17:00, 00:18:30, 00:27:00, 00:29:00 (partial), 00:35:30; ep05 00:08:30, 00:11:00, 00:11:30, 00:16:00–00:16:30, 00:28:00, 00:34:30, 00:38:00 | Not speech | Loop check | Open |
| Hadith and supplication wording | ep04 00:04:30, 00:15:00; ep05 00:10:30, 00:34:00 | Wording not typed; reported by sense only | Hadith rule | Open |
| Poetry recited (the Amr ibn Kulthum boast) | ep05 00:07:00 | Verbatim verse, partly garbled | Sources policy; clarity | Open |
| Calls and answers too garbled to read | ep04 00:31:00–00:36:30 (in part), ep05 00:27:30–00:36:00 (in part), ep05 00:38:00 | Garbled or fragmentary; only the clear question is summarised | Clarity | Open |
| Questions outside the episode (Qur'anic water, plastic Qur'an copies, books for children) | ep04 00:34:00–00:35:00 | Off topic; the lecturer redirects them | Scope | Open |
| Ruling on the prohibiting oath before consummation | ep05 00:29:30–00:30:00 | Answer not clear in the recording | Clarity | Open |

### Completed recordings (§8), continued

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| silsilat-ebadu-al-rahman ep25–ep26 (jealousy, praiseworthy and blameworthy; anger, patience and forbearance) | ep25 about 24 min, ep26 about 22 min (transcript) | ar, en, ur: 1 record extended, 23 points | 6 new `about` edges (verses 6:151, 3:134; ghadab; Ibn Abbas, Abd al-Rahman ibn Awf, Aisha) | ep25 11, ep26 12 points; engine qwen3-asr pass5, 30 s windows | 6 needs_source (Ibrahim and Isma'il in the dream, ep25 00:08:30; the servant-girl and Ibn Abbas, ep25 00:11:30; the saying on Umar and the Garden, ep25 00:15:00; the proposal to watch children's phones, ep25 00:21:00; the anecdotes of the butcher and the customer, ep26 00:03:00; Harun al-Rashid and anger, ep26 00:17:30) | run omar-abdelkafy-ebadu-al-rahman-10 |

Notes for ep25–ep26. Episode 25 is garbled in its middle sections; episode 26 has long runs of repeated words from 00:12:30 to 00:17:00 and at 00:20:00, which are excluded. The lecturer's view on the Hiroshima and Nagasaki bombings is marked as his.

| Excluded (ebadu ep25–ep26) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, supplications, break jingles, closing formulae | ep25 00:00:00, 00:13:00, 00:24:00–00:24:30; ep26 00:00:00–00:00:30, 00:11:00, 00:22:30 | Not lesson content; Qur'an never typed | Content rule; Qur'an rule | Open |
| Repetition loops and hallucinated runs | ep25 00:14:30; ep26 00:12:30, 00:15:30 (run of repeated words), 00:20:00 | Not speech | Loop check | Open |
| Garbled passage on the names of the wives and the sack of wine | ep25 00:14:00 | Garbled | Clarity | Open |
| Curse on women who alter their appearance | ep25 00:19:30 | Hadith wording not typed; no point written from the garbled part | Hadith rule; clarity | Open |
| Proverb on the trader and the coin, and the joke on the donkey's burden | ep26 00:08:30 | Garbled; a joke about a named person, not written | Clarity; content rule | Open |
| Excluded (tariq-al-noor ep05-ep08) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, supplications, closing formulae | ep05 00:00:00, 00:09:00-00:09:30; ep06 00:00:00, 00:09:30-00:10:00; ep07 00:00:00, 00:09:30; ep08 00:00:00-00:00:30, 00:09:30-00:10:00 | Not lesson content | Content rule | Open |
| Repetition loops | ep06 00:03:30 (inner); ep08 00:04:30 | Not speech | Loop check | Open |
| The Companion who would have "taken the three" and entered the fighting | ep07 00:08:30 | Garbled, no identifiable content | Clarity | Open |
| Poem lines on death ("if when we died we were left") | ep05 00:05:30 | Verse, author unnamed and garbled | Sources policy; clarity | Open |
| Wording of the saying on "the face of affliction" | ep06 00:07:30 | Garbled; recorded only as needs_source | Clarity | Open |

| Excluded (tariq-al-noor ep09-ep12) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, supplications, closing formulae | ep09 00:00:00, 00:09:30-00:10:00; ep10 00:00:00, 00:09:30; ep11 00:00:00, 00:09:00-00:09:30; ep12 00:00:00, 00:08:30-00:09:00 | Not lesson content | Content rule | Open |
| Repetition loops | ep09 00:07:00; ep11 00:03:30; ep12 00:01:00 (inner), 00:02:00, 00:05:30 (inner) | Not speech | Loop check | Open |
| Wording of the sudden-death verse and examples in the cemetery passage beyond the clear points | ep10 00:06:00 | Verse garbled | Clarity | Open |
| Hadith of the cards (full wording), Hadith on the Bedouin and the townsman | ep10 00:08:00; ep12 00:05:30-00:06:00 | Wording not typed; garbled | Hadith rule; clarity | Open |
| Corruption and bribery remark in the heedlessness passage | ep09 00:07:30-00:08:00 | Partly garbled personal anecdote; only the clear point on backbiting kept | Clarity | Open |

### Completed recordings (§8), continued

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| silsilat-ebadu-al-rahman ep27–ep28 (reflection and the real losses; self-reckoning, the obstacles and long hope) | ep27 about 24 min, ep28 about 24 min (transcript) | ar, en, ur: 1 record extended, 24 points | 6 new `about` edges (verses 25:72, 25:73, 25:68; tadabbur al-Qur'an, muhasabat al-nafs, tul al-amal, mawt, zakat, dhikr, afw, tawba; Umar, Ibn Mas'ud) | ep27 13, ep28 11 points; engine qwen3-asr pass5, 30 s windows | 7 needs_source (the question about weeping in prayer, ep27 00:03:30; the father's sealed will, ep27 00:04:30; Umar and the scent, ep27 00:15:30; the comparison with public money, ep27 00:16:30 (no figures); the locked heart, ep28 00:07:30; the reckoning by plain arithmetic, ep28 00:08:30; long hope and the death of the one who thought he would not die, ep28 00:17:30) | run omar-abdelkafy-ebadu-al-rahman-11 |

Notes for ep27–ep28. Episode 27 has a long segment on mosques and the Qur'an's recitation from 00:12:00 that is garbled and not written; episode 28 has runs of repeated words at 00:15:30 and 00:20:00–00:21:00 that are excluded. With this batch all 28 lessons of the series are written.

| Excluded (ebadu ep27–ep28) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, supplications, break jingles, closing formulae | ep27 00:00:00–00:01:00, 00:13:00, 00:23:30; ep28 00:00:00, 00:13:00, 00:23:30–00:24:00 | Not lesson content; Qur'an never typed | Content rule; Qur'an rule | Open |
| Repetition loops and hallucinated runs | ep27 00:12:30 (tail); ep28 00:14:00 (tail), 00:15:30, 00:20:00–00:21:00 | Not speech | Loop check | Open |
| The Qur'an recitation and the "wailing" at the close of ep27 | ep27 00:12:00–00:12:30 | Partly garbled; the sentence is not recoverable | Clarity; Qur'an rule | Open |
| Garbled passage on the building boom and the 2019 remark | ep28 00:22:30 | Garbled; the year and the remark are not clear | Clarity | Open |
| Accounts of money and the "two hundred thousand" figures | ep28 00:10:30 | Figures garbled | Clarity; no figure without a source | Open |
| Remark on the Badr-era lessons on the Qur'an's tongue and the Prophet's last lessons | ep28 00:19:00 | Garbled | Clarity | Open |
### albuyout-alamena, episodes 6–7 (11 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-3)

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep06–ep07 (the pillars of the home and the winds of affection; the first year of marriage) | about 39 min, 40 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 23 points | 6 new `about` edges (al-Hakim bi-Amr Allah, the Saqifa, concept/talaq, concept/rahma, concept/kitman-al-sirr, passage 42:40) | ep06 11, ep07 12 points; engine qwen3-asr pass5, 30 s windows | 7 needs_source: ep06 the waking-for-prayer report (00:02:30), Umar and the man who did not love his wife (00:17:30), call details (00:20:30, 00:30:30); ep07 Umar and Abu Bakr at the Saqifa (00:13:00), the greatest-betrayals report (00:25:00), call details (00:19:00) | run omar-abdelkafy-albuyout-3 |

Next step: episode 8.

| Excluded (albuyout-alamena ep06–ep07) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep06 00:00:00–00:01:00, 00:11:30–00:12:00, 00:24:30–00:25:30, 00:38:30–00:39:00; ep07 00:00:00–00:01:00, 00:12:30, 00:25:00, 00:39:30–00:40:00 | Not lesson content | Content rule | Open |
| Repetition loops | ep06 00:09:30, 00:17:00, 00:36:00, 00:37:30, 00:38:30; ep07 00:07:30, 00:15:00, 00:30:00, 00:31:30, 00:33:30 | Not speech | Loop check | Open |
| Calls and answers too garbled to read | ep06 00:21:00–00:25:00 (in part), ep06 00:30:00–00:34:00 (in part); ep07 00:19:30–00:21:00, 00:44:00–00:46:00 equivalents (in part) | Garbled or fragmentary; only the clear question is summarised | Clarity | Open |
| Poetry and proverbs (Arabic verse on the beautiful face and the ugly soul; the 'sleeping till mid-morning' praise beyond the clear point) | ep06 00:15:30–00:16:00; ep07 00:08:00 | Verbatim verse, partly garbled | Sources policy; clarity | Open |
| Hadith wording | ep06 00:04:30 | Wording not typed; reported by sense only | Hadith rule | Open |
| Questions outside the episode (lost item in the street, zakat on a shop, menstruation, repeated prohibiting oath, nursing) | ep06 00:23:00–00:33:30 | Fiqh questions the lecturer refers to fatwa programmes; the clear questions are summarised only | Scope | Open |
| Excluded (tariq-al-noor ep13-ep15) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, supplications, closing formulae | ep13 00:00:00, 00:09:30; ep14 00:00:00, 00:09:30; ep15 00:00:00, 00:08:30-00:09:30 | Not lesson content | Content rule | Open |
| Repetition loop | ep13 00:07:00 (inner) | Not speech | Loop check | Open |
| Verse of the proud tribe drinking clear water | ep15 00:03:30-00:04:00 | Verse, author unnamed and garbled | Sources policy; clarity | Open |
| Hygiene remark and the divorce-case remark | ep15 00:04:00-00:04:30 | Garbled, unclear point | Clarity | Open |


### albuyout-alamena, episodes 8–9 (11 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-4)

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep08–ep09 (the language of dialogue and obstacles to affection; living together in kindness) | about 44 min, 43 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 21 points | 15 new `about` edges (Dawud, al-Mutanabbi, Abu Nuwas, Safiyya, Iblis, mahram, dua, itikaf, nafaqa, passages 38:23-24, 5:8, 4:19) | ep08 11, ep09 10 points; engine qwen3-asr pass5, 30 s windows | 7 needs_source: ep08 newborn study (00:05:30), call details (00:24:30), last questions (00:37:00); ep09 historical claims (00:01:00), Safiyya report (00:07:00), call details (00:24:30), rulings on the past and test-tube babies (00:36:00) | run omar-abdelkafy-albuyout-4 |

Next step: episode 10.

| Excluded (albuyout-alamena ep08–ep09) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep08 00:00:00–00:00:30, 00:06:30, 00:25:30–00:26:00, 00:43:00–00:43:30; ep09 00:00:00–00:01:00, 00:08:30–00:09:00, 00:23:30, 00:42:30–00:43:00 | Not lesson content | Content rule | Open |
| Repetition loops | ep08 00:03:00, 00:11:30, 00:12:00, 00:16:00, 00:30:00, 00:38:00; ep09 00:04:30, 00:06:30, 00:16:00, 00:22:00, 00:35:00 | Not speech | Loop check | Open |
| Calls and answers too garbled to read | ep08 00:28:00–00:33:30 (in part), 00:39:00–00:40:00; ep09 00:25:00–00:35:30 (in part) | Garbled or fragmentary; only the clear question is summarised | Clarity | Open |
| Verse and proverb wording (poetry on the beautiful claim, Abu Nuwas and al-Mutanabbi verses) | ep08 00:12:30, 00:13:30, 00:14:00 | Verbatim verse, partly garbled; given by sense | Sources policy; clarity | Open |
| Hadith wording | ep08 00:16:30, 00:22:00; ep09 00:11:00, 00:12:30 | Wording not typed; reported by sense only | Hadith rule | Open |
| Questions outside the episode (bank loan for a car, stop-and-go fatwas on divorce oaths) | ep09 00:27:00 | Referred to after-programme phone; not summarised | Scope | Open |
| Excluded (tariq-al-noor ep16-ep18) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, supplications, closing formulae | ep16 00:00:00, 00:09:30; ep17 00:00:00, 00:08:00-00:08:30; ep18 00:00:00, 00:09:30 | Not lesson content | Content rule | Open |
| Repetition loops | ep16 00:02:30; ep18 00:04:00 | Not speech | Loop check | Open |
| Question-and-answer remark on songs, music and immodest imagery | ep16 00:01:30 | Garbled, no clear statement | Clarity | Open |
| Remarks on screens and games, and on craftsmen's delays | ep18 00:04:30-00:05:00, 00:07:30 | Partly garbled; only the clear arithmetic and points kept | Clarity | Open |

| Excluded (tariq-al-noor ep19-ep21) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, supplications, closing formulae | ep19 00:00:00, 00:09:30; ep20 00:00:00, 00:09:30; ep21 00:00:00, 00:09:30 | Not lesson content | Content rule | Open |
| Repetition loops | ep19 00:02:30, 00:03:00, 00:03:30, 00:04:00, 00:07:00 (inner) | Not speech | Loop check | Open |
| Verses of Abu Nuwas | ep19 00:08:30-00:09:00 | Verbatim verse, not reproduced | Sources policy | Open |
| Teens' food, clothes and gifts remark | ep20 00:05:00-00:05:30 | Partly garbled, no clear point | Clarity | Open |

| Excluded (tariq-al-noor ep22-ep24) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, supplications, closing formulae | ep22 00:00:00, 00:09:00; ep23 00:00:00, 00:09:00-00:09:30; ep24 00:00:00, 00:08:30-00:09:00 | Not lesson content | Content rule | Open |
| Repetition loops | ep22 00:02:00, 00:06:00 (inner); ep23 00:06:30 (inner); ep24 00:03:00, 00:05:00, 00:07:30 (inner) | Not speech | Loop check | Open |
| Passage on worship without toil (fasting and prayer examples) | ep22 00:01:30-00:02:30 | Partly garbled; only the clear list of virtues kept | Clarity | Open |
| Passage on children apologising to parents | ep22 00:07:00-00:07:30 | Garbled | Clarity | Open |
| Remarks on a daughter's marriage to a mother-dependent husband and on rival relatives' spending | ep24 00:02:00-00:03:30 | Partly garbled, no clear usable point beyond the trial list | Clarity | Open |
### albuyout-alamena, episodes 10–11 (11 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-5)

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep10–ep11 (dazzlement with the West, disputation and submission; grace between the spouses) | about 46 min, 49 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 19 points | 17 new `about` edges (mirath, jiwar, Ibn al-Qayyim, Zayd ibn Thabit, al-Khidr, Malik, Abu Hanifa, Shurayh, Asma, Nusayba, the hijra, passages 11:32, 40:4, 4:11, 4:65, 33:36, 18:78, 49:11) | ep10 10, ep11 9 points; engine qwen3-asr pass5, 30 s windows | 10 needs_source: ep10 gradings of reports (00:04:00), inheritance counts (00:07:30), Ibn al-Qayyim and the farmer (00:16:30), figure on beatings (00:19:30), Zayd, Ibn Mas'ud and Ibn Uraqit accounts (00:25:00), al-Hasan, Malik and philosopher tales (00:29:30), call details (00:32:00), the neighbour tale (00:40:00); ep11 Shurayh tale (00:07:00), call details (00:27:00) | run omar-abdelkafy-albuyout-5 |

Next step: episode 12. Sensitivity: ep10 carries strongly worded views on the West, women's rights and inheritance; all are recorded as the lecturer's own claims, with their figures marked needs_source (precedent decision in docs/decisions/inbox/assabile-albuyout-sensitivity-contested.yaml).

| Excluded (albuyout-alamena ep10–ep11) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep10 00:00:00–00:01:30, 00:14:30–00:15:00, 00:29:30; ep11 00:00:00–00:01:00, 00:14:30–00:15:30, 00:26:30–00:27:00, 00:48:30–00:49:00 | Not lesson content | Content rule | Open |
| Repetition loops | ep10 00:06:30, 00:11:00, 00:11:30, 00:17:30, 00:20:00–00:20:30, 00:24:30, 00:34:30, 00:37:30; ep11 00:02:00, 00:06:30, 00:12:00, 00:35:30, 00:37:00, 00:37:30, 00:39:00 | Not speech | Loop check | Open |
| Calls and answers too garbled to read | ep10 00:33:00–00:36:00, 00:38:00–00:39:30; ep11 00:30:00–00:39:00 (in part) | Garbled or fragmentary; only the clear question is summarised | Clarity | Open |
| Verse wording (al-Mutanabbi-style lines on the eye of love) and hadith wording | ep10 00:05:30, 00:12:00; ep11 00:20:00 | Wording not typed; by sense only | Hadith rule; sources policy | Open |
| Questions outside the episode (misyar marriage, loan for a car, bank shares details) | ep10 00:39:00; ep11 00:27:00 | Fiqh questions the lecturer refers to fatwa programmes | Scope | Open |

| Excluded (tariq-al-noor ep25-ep27) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, supplications, closing formulae | ep25 00:00:00, 00:09:30; ep26 00:00:00, 00:09:00-00:09:30; ep27 00:00:00, 00:09:30-00:10:00 | Not lesson content | Content rule | Open |
| Repetition loops | ep26 00:07:00; ep27 00:05:30-00:06:00 (tail) | Not speech | Loop check | Open |
| Hadith on two kinds of people not seen who will not enter Paradise, with the lecturer's remarks on dress | ep26 00:07:30-00:08:00 | Hadith wording not typed; remarks garbled | Hadith rule; clarity | Open |
| Poem verse on the community's pride | ep26 00:03:30 | Verse, garbled and unattributed | Sources policy; clarity | Open |
| Passage on the Prophet's three supplications | ep27 00:01:00-00:01:30 | Garbled, promised for a later episode | Clarity | Open |
### albuyout-alamena, episodes 12–13 (11 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-6)

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep12–ep13 (woman's place in the home and society; manners of dialogue and what a wife dislikes) | about 48 min, 47 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 16 points | 14 new `about` edges (awra, Maryam, Fatima, Mut'im ibn Adi, Umm Ruman, Umar ibn Abd al-Aziz, passages 33:32, 51:22, 17:23-24, 49:12) | ep12 7, ep13 9 points; engine qwen3-asr pass5, 30 s windows | 10 needs_source: ep12 the Maryam count (00:03:30), the report of the Prophet and Fatima (00:06:00), the fiqh-books claim (00:10:30), the Mut'im story (00:14:30), the survey and historical accounts (00:18:00), call details (00:26:30); ep13 the Prophet's loyalty and Umar ibn Abd al-Aziz (00:17:00), the beating report (00:30:30), scholars on praying for parents (00:12:30), call details (00:33:00) | run omar-abdelkafy-albuyout-6 |

Next step: episode 14. Sensitivity: ep12 and ep13 hold the lecturer's views on women's voice, going out and discipline; all are recorded as his own views, with their figures marked needs_source.

| Excluded (albuyout-alamena ep12–ep13) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep12 00:00:00–00:00:30, 00:14:00–00:14:30, 00:26:30, 00:48:00; ep13 00:00:00–00:01:00, 00:15:30, 00:30:30, 00:47:00–00:47:30 | Not lesson content | Content rule | Open |
| Repetition loops | ep12 00:04:00, 00:21:30, 00:47:30, 00:38:00; ep13 00:12:00, 00:16:30, 00:20:00, 00:37:30, 00:38:00 | Not speech | Loop check | Open |
| Poetry and sayings by wording (the line on the shade of a companion; the line on the tooth-stick; a hero's verse) | ep12 00:26:00; ep13 00:09:30, 00:25:30 | Verbatim verse, partly garbled; given by sense | Sources policy; clarity | Open |
| A caller's question on a sensitive family matter involving a child's parentage, and the question about a will on a house | ep12 00:41:30–00:43:30 | Private and sensitive personal detail about identifiable people, partly garbled | Privacy; clarity | Open |
| Calls and answers too garbled to read | ep12 00:27:30–00:30:00 in part, 00:33:00–00:36:00 in part; ep13 00:35:00–00:36:00, 00:38:30–00:40:00 | Garbled or fragmentary; only the clear question is summarised | Clarity | Open |
| Fiqh questions the lecturer refers elsewhere (interest-bearing loan, wide trousers, hijab detail, will of a house) | ep12 00:36:00, 00:39:00; ep13 00:36:00 | Referred to fatwa programmes | Scope | Open |

| Excluded (tariq-al-noor ep28-ep30) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, supplications, closing formulae | ep28 00:00:00, 00:08:30-00:09:30; ep29 00:00:00, 00:09:30-00:10:00; ep30 00:08:00-00:08:30, 00:09:30 | Not lesson content | Content rule | Open |
| Repetition loops | ep29 00:02:00; ep30 00:03:00 (inner) | Not speech | Loop check | Open |
| Passage on political parties and the grave | ep28 00:05:30-00:06:00 | Partly garbled; only the clear point kept | Clarity | Open |
| Remark on a poor sibling and a rich sibling's duty to spend | ep29 00:08:00-00:08:30 | Partly garbled | Clarity | Open |

Series status: `tariq-al-noor` is complete (30 of 30 episodes written, draft). Open items for review: the listed `needs_source` marks and a listen-check of the passages flagged garbled.

### albuyout-alamena, episodes 14–15 (11 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-7)

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep14–ep15 (difference, dispute and taking oneself to account; trial and the pharmacy of hope) | about 46 min, 47 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 15 points | 19 new `about` edges (ibtila, tafaul, amal, Harun al-Rashid, Ali ibn al-Jahm, Ibn Ata Allah, Yusuf, Maryam, passages 49:14, 12:4, 28:7, 22:11, 9:40, 94:5-6) | ep14 8, ep15 7 points; engine qwen3-asr pass5, 30 s windows | 9 needs_source: ep14 the Bedouin and al-Rashid story (00:15:00), percentages (00:21:00), Khadija and the tent (00:27:00), call details (00:31:00); ep15 verse attributed to Ibn al-Qayyim (00:01:30), the woman and the child in the fire (00:11:00), stories with no source (00:16:30, 00:24:00), a tenth of the blood-money ruling (00:32:00) | run omar-abdelkafy-albuyout-7 |

Next step: episode 16.

| Excluded (albuyout-alamena ep14–ep15) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep14 00:00:00–00:01:30, 00:14:30–00:15:00, 00:30:00–00:30:30, 00:44:30–00:45:00; ep15 00:00:00–00:01:30, 00:15:30–00:16:00, 00:31:30–00:32:00, 00:46:30 | Not lesson content | Content rule | Open |
| Repetition loops | ep14 00:00:30, 00:02:30, 00:16:30, 00:24:00, 00:43:30; ep15 00:05:30, 00:12:00, 00:27:00 (tail), 00:42:00, 00:26:00 | Not speech | Loop check | Open |
| Calls and answers too garbled to read | ep14 00:31:00–00:38:00 (in part); ep15 00:35:30–00:36:30, 00:38:30–00:43:00 (in part) | Garbled or fragmentary; only the clear question is summarised | Clarity | Open |
| Verse wording (the Bedouin's poem, the verse on sorrows relieved, the verse on the toothstick) | ep14 00:19:00–00:21:30; ep15 00:29:00 | Verbatim verse, partly garbled; given by sense | Sources policy; clarity | Open |
| Hadith wording | ep14 00:25:00; ep15 00:14:00, 00:21:30 | Wording not typed; reported by sense only | Hadith rule | Open |
| Calls on magic, possession and a medical suspicion | ep15 00:42:00–00:43:00 | Fragmentary; the lecturer's short answer only is summarised | Clarity | Open |

### albuyout-alamena, episodes 16–17 (11 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-8)

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep16–ep17 (raising sons and daughters, rebuilding trust; differences between man and woman, upbringing, extravagance) | about 49 min, 45 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 14 points | 14 new `about` edges (al-Tabari, Ibn al-Jawzi, Jafar ibn Abi Talib, Fatima bint Asad, Usama, Hanzala, Mu'ta, Badr, al-israf, time-as-resource, passages 11:42-43) | ep16 7, ep17 6 points; engine qwen3-asr pass5, 30 s windows | 8 needs_source: ep16 the mothers-and-genius inference (00:04:00), Ja'far and Fatima bint Asad (00:08:30), ages and counts (00:16:30), al-Tabari and Ibn al-Jawzi tales (00:23:00), call details (00:32:30); ep17 the alleged experiment (00:01:30), the 98 per cent figure (00:20:00), the funeral accounts (00:37:30) | run omar-abdelkafy-albuyout-8 |

Next step: episode 18. Sensitivity: ep16 and ep17 carry sweeping generalisations about men, women and mothers' work; all are recorded as the lecturer's own.

| Excluded (albuyout-alamena ep16–ep17) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep16 00:00:00–00:01:00, 00:15:30–00:16:00, 00:31:30–00:32:00, 00:48:00–00:48:30; ep17 00:00:00–00:01:30, 00:14:30–00:15:00, 00:29:30–00:30:00, 00:44:30–00:45:00 | Not lesson content | Content rule | Open |
| Repetition loops | ep16 00:44:00; ep17 00:02:30, 00:09:30, 00:16:30, 00:17:00, 00:29:30, 00:35:00, 00:22:30 | Not speech | Loop check | Open |
| Calls and answers too garbled to read | ep16 00:35:00–00:44:00 (in part) | Garbled or fragmentary; only the clear question is summarised | Clarity | Open |
| Poetry and hadith wording | ep16 00:04:30; ep17 00:08:30, 00:12:30 | Wording not typed; by sense only | Hadith rule | Open |
| Fiqh questions the lecturer refers elsewhere (a skin condition and ablution, a fasting rule, a will on a house) | ep16 00:44:00 | Referred to fatwa programmes | Scope | Open |

### albuyout-alamena, episodes 18–19 (11 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-9)

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep18–ep19 (dazzlement with the West, leadership and civilisation; the law or customs and traditions) | about 46 min, 48 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 13 points | 9 new `about` edges (mahr, sadaqa, kasb, urf, Usama ibn Zayd, Ikrima ibn Abi Jahl, Umm Hakim bint al-Harith, Asma bint Umays, Muhammad ibn Abi Bakr, passages 17:70, 3:195) | ep18 6, ep19 5 points; engine qwen3-asr pass5, 30 s windows | 9 needs_source: ep18 cosmetics figures (00:07:00), the Montgomery story (00:12:00), the Abu Bakr and Usama accounts (00:16:00), the rug, bowl and axe report (00:22:00), stories and call text (00:26:30); ep19 Fatima's trousseau (00:10:00), Umm Hakim and Asma bint Umays (00:16:30), the private survey and Subay'a (00:24:00), call text (00:34:30) | run omar-abdelkafy-albuyout-9 |

Next step: episode 20. Sensitivity: ep18 holds the lecturer's judgments on the West, rulers and civilisation, and ep19 on women and marriage customs; all are recorded as the lecturer's own.

| Excluded (albuyout-alamena ep18–ep19) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep18 00:00:00–00:00:30, 00:15:30–00:16:00, 00:31:30, 00:46:00–00:46:30; ep19 00:00:00–00:01:00, 00:15:00–00:15:30, 00:31:30–00:32:00, 00:48:00–00:48:30 | Not lesson content | Content rule | Open |
| Repetition loops | ep18 00:20:00, 00:34:00, 00:35:30 (tail), 00:38:30, 00:40:00; ep19 00:05:00 (tail), 00:17:30, 00:18:00, 00:25:00, 00:29:00, 00:29:30, 00:39:30, 00:41:00 | Not speech | Loop check | Open |
| Calls and answers too garbled to read | ep18 00:38:30–00:46:00 (in part); ep19 00:36:00–00:37:30, 00:40:30–00:44:00 (in part) | Garbled or fragmentary; only the clear question is summarised | Clarity | Open |
| Hadith and verse wording | ep18 00:22:00–00:24:30, 00:26:00; ep19 00:12:00 | Wording not typed; by sense only | Hadith rule | Open |
| Fiqh questions referred elsewhere (woman travelling without a mahram, a second marriage in secret as to fairness) | ep19 00:37:00, 00:42:30 | Referred to fatwa programmes | Scope | Open |

### albuyout-alamena, episodes 20–21 (11 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-10)

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep20–ep21 (where is the defect, burying ideas and opinions; the four groups of sins) | about 38 min, 37 min (transcript; the closing minutes of each are calls) | ar, en, ur: work/albuyout-alamena extended, 13 points | 14 new `about` edges (hijab, bida, tawba, hasad, kibr, hajj, Iblis, Abu Jahl, al-Shafi'i, Ahmad ibn Hanbal, Mu'adh ibn Jabal, passages 81:8-9, 2:228, 7:12, 33:59, 30:41) | ep20 7, ep21 6 points; engine qwen3-asr pass5, 30 s windows | 8 needs_source: ep20 the tyrants-history claim (00:12:30), the hijab argument and judgment (00:21:00), call text (00:26:30); ep21 the Umar and Abu Hanifa accounts (00:04:30), the al-Shafi'i, Ahmad and Umar-Mu'adh accounts (00:10:30), Abu Jahl and al-Khidr (00:18:00), the sins-earthquakes link (00:22:30), call text (00:26:30) | run omar-abdelkafy-albuyout-10 |

Next step: episode 22. Sensitivity: ep20 carries a ruling on hijab and ep21 sweeping claims linking sins to earthquakes; both are recorded as the lecturer's own.

| Excluded (albuyout-alamena ep20–ep21) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep20 00:00:00–00:01:00, 00:15:30–00:16:00, 00:32:30–00:33:00; ep21 00:00:00–00:01:00, 00:15:30–00:16:00, 00:29:00–00:29:30 | Not lesson content | Content rule | Open |
| Repetition loops | ep20 00:06:30–00:07:30 (in part), 00:18:30; ep21 00:06:00, 00:25:30, 00:30:30 | Not speech | Loop check | Open |
| Calls and answers too garbled to read | ep20 00:37:00–end (in part); ep21 00:34:00–end (in part) | Garbled or fragmentary; only the clear question is summarised | Clarity | Open |
| Verse and saying wording (verse of a chief of the Arabs on not drinking, a proverb on lovers' hearts) | ep20 00:16:30–00:17:00; ep21 00:30:00 | Verbatim verse, partly garbled; given by sense | Sources policy; clarity | Open |
| Fiqh questions the lecturer refers elsewhere (the wiping of the sock, the working in a hotel) | ep20 00:25:30; ep21 00:33:30 | Referred to fatwa programmes | Scope | Open |

### albuyout-alamena, episodes 22–23 (11 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-11)

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep22–ep23 (keys to the personality; the start of the school year and raising children) | about 31 min, 32 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 12 points | 6 new `about` edges (Mu'awiya, Yaqub, Yusuf, tarbiya, ilm, passages 17:36, 12:8) | ep22 6, ep23 6 points; engine qwen3-asr pass5, 30 s windows | 5 needs_source: ep22 word counts (00:03:00), the zoo experiment (00:09:00), statistics and the Mu'awiya account (00:19:00), call text (00:26:30); ep23 the suicide and pregnancy statistic (00:21:30). Coverage note: ep23 00:11:00–00:21:00 and 00:31:30 to the end were not read in full; they are left for a later revision pass | run omar-abdelkafy-albuyout-11 |

Next step: episode 24 (and a revision pass over ep23 00:11:00–00:21:00).

| Excluded (albuyout-alamena ep22–ep23) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep22 00:00:00–00:01:00, 00:15:30, 00:26:00; ep23 00:00:00–00:01:00, 00:08:00 | Not lesson content | Content rule | Open |
| Repetition loops | ep22 00:12:30, 00:27:30, 00:29:30; ep23 (none noted in the read range) | Not speech | Loop check | Open |
| Calls and answers too garbled to read | ep22 00:26:30–00:31:00 (in part); ep23 not read | Garbled or fragmentary; only the clear question is summarised | Clarity | Open |
| Hadith wording | ep23 00:09:00, 00:10:30 | Wording not typed; by sense only | Hadith rule | Open |

### albuyout-alamena, episode 23 completion (11 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-12)

Closes the gap noted for ep23 (00:11:00–00:21:00 and everything after 00:31:30), read in full. 7 points written in a continuation section (ar, en, ur); 4 new `about` edges; 4 needs_source (the claim about the scholars never scolding 00:11:00, the minutes statistic and the Prophet-and-fruit report 00:18:30, call text 00:35:30, Umar's saying 00:43:00).

| Excluded (albuyout-alamena ep23 continuation) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greetings, break announcements, closing formulae | ep23 00:17:30, 00:35:00–00:35:30, 00:51:30–00:52:00 | Not lesson content | Content rule | Open |
| Repetition loops | ep23 00:14:00 (tail), 00:46:00, 00:37:00 (tail) | Not speech | Loop check | Open |
| Garbled call windows | ep23 00:36:00–00:36:30 (line dropped), 00:38:00–00:38:30, 00:46:30–00:48:30 (in part) | Garbled or fragmentary; only the clear question is summarised | Clarity | Open |
| Hadith wording | ep23 00:19:30–00:20:30, 00:42:00 | Wording not typed; by sense only | Hadith rule | Open |

Rule from now on (coordinator, 11 Nov 2026): every episode is read in full; any window too garbled is recorded here with its reason.


### al-dar-al-akhera ep11 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep11 (the reckoning, part 1) | about 39 min (transcript) | ar, en, ur: 1 record extended | 6 new `about` edges (concept/al-hisab and others) | 13 points; qwen3-asr pass5, 30 s windows | needs_source on most points; the Talha story (00:04:00), who Umar wished for (00:02:00), the five remedies story where no names are given (00:23:00), the excuse scenes (00:30:00) | run omar-abdelkafy-dar-akhera-6 |

| Excluded (dar-akhera ep11) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep11 00:25:00, 00:29:30, 00:35:00 | Not speech | Loop check | Open |
| Garbled passages | ep11 00:00:00-00:01:30 (opening, about the endings of deeds), 00:01:00 (the people of chess and dice), 00:09:30-00:10:30, 00:12:30-00:13:00, 00:16:30-00:17:00, 00:27:30-00:29:00 (the excuses of the unnamed), 00:31:00-00:31:30, 00:35:30 (partial) | Not recoverable as clear Arabic | Clarity | Open |
| Closing supplications and sign-off | ep11 00:37:00-00:39:00 | Not lesson content | Content rule | Open |

### albuyout-alamena, tails of episodes 20, 21 and 22 (11 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-13)

Closes the gaps left in the first pass: ep20 from 00:37:00 to the end (47:30), ep21 from 00:37:00 to the end (45:00) and ep22 from 00:30:00 to the end (45:30), all read in full. 28 points written in continuation sections (ar, en, ur); 2 new `about` edges (niqab, riba); 20 needs_source (garbled call text, unsourced sayings and statistics, answers not recorded in the window).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep20, ep21, ep22 (tails) | about 10 min, 8 min, 15 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 28 points | 2 new `about` edges (niqab, riba) | ep20 8, ep21 8, ep22 12 | 20 needs_source | this PR |

Next step: episode 24.

| Excluded (albuyout-alamena ep20–ep22 tails) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greetings, prayers for the country, break announcements, closing supplications and sign-offs | ep20 00:37:00, 00:47:00–00:47:30; ep21 00:44:30–00:45:00; ep22 00:45:00–00:45:30 | Not lesson content | Content rule | Open |
| Repetition loops | ep20 00:39:00, 00:41:00 (tail), 00:42:00; ep21 00:41:30; ep22 00:39:30 | Not speech | Loop check | Open |
| Garbled call windows (question and answer not recoverable) | ep20 00:38:00–00:39:00 (the question on those who hold a hard line and the Syrian caller's question); ep20 00:41:00–00:41:30 (the Jordanian caller's question is clear, the answer is the later passage); ep21 00:37:00–00:37:30; ep22 00:32:00–00:34:00 (personal details), 00:34:00–00:35:30 (no answer in window), 00:35:30–00:37:30, 00:38:00–00:39:00 | Garbled or fragmentary; only the clear question is summarised, no ruling written | Clarity | Open |
| Caller identities and personal circumstances of a spouse's anger | ep22 00:32:00–00:34:00 | Private and sensitive; not recorded beyond the general description | Privacy | Open |
| Pleasantries without content | ep21 00:38:30–00:39:00, 00:40:00 | No substantive material | Content rule | Open |
| Hadith and saying wording | ep20 00:43:00; ep21 00:41:00, 00:43:00; ep22 00:42:00, 00:43:30 | Wording not typed; by sense only | Hadith rule | Open |


### al-dar-al-akhera ep12 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep12 (the reckoning, part 2) | about 37 min (transcript) | ar, en, ur: 1 record extended | 3 new `about` edges (concept/zulm, concept/dhikr, passage/quran-99 among 7) | 13 points; qwen3-asr pass5, 30 s windows | needs_source on every point; the order of the seven (00:01:00), Gabriel as the one at the scale (00:11:00), the backbiter hadith with no source (00:28:30), the wolf story (00:35:00) | run omar-abdelkafy-dar-akhera-7 |

| Excluded (dar-akhera ep12) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep12 00:16:00, 00:18:30, 00:22:00, 00:27:00, 00:29:30 | Not speech | Loop check | Open |
| Garbled passages | ep12 00:02:30-00:03:00, 00:09:00 (partial), 00:15:00-00:16:00, 00:17:30-00:18:00, 00:19:00-00:19:30 (the postnatal-bleeding remark), 00:26:30-00:27:30, 00:30:30-00:31:00 | Not recoverable as clear Arabic | Clarity | Open |
| Closing sign-off | ep12 00:36:30 | Not lesson content | Content rule | Open |


### al-dar-al-akhera ep13 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep13 (scale, Bridge, seeing God, prayer on the Prophet, parents) | about 38 min (transcript) | ar, en, ur: 1 record extended | 7 new `about` edges | 14 points; qwen3-asr pass5, 30 s windows | needs_source on every point; the throne scene with Abraham and the Prophet (00:14:30) and the scale scene on prayer on the Prophet (00:16:30) have no source; the ascription to al-Tirmidhi (00:27:30); the father-on-the-road story (00:18:30) | run omar-abdelkafy-dar-akhera-8 |

The hadith that God puts a Jew or Christian in the Fire in place of each Muslim (ep13 00:31:30) is presented as the lecturer's relating, with the museum giving no ruling; the record stays `sensitivity: contested`.

| Excluded (dar-akhera ep13) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep13 00:00:30, 00:02:30, 00:06:00, 00:11:30, 00:20:30, 00:22:00, 00:26:30, 00:28:00 | Not speech | Loop check | Open |
| Garbled passages | ep13 00:00:00-00:01:00, 00:03:30-00:04:30, 00:06:30-00:12:00 (the zakat shade, a caliph's tent story and the unrelated anecdotes), 00:20:00-00:22:30 (a story about a request in a dream), 00:23:00-00:24:30 (the Prophet recognising his community and the thousand-hadith repeat), 00:33:00-00:33:30, 00:36:30-00:38:00 | Not recoverable as clear Arabic | Clarity | Open |
| Closing supplications and sign-off | ep13 00:35:30-00:37:00 | Not lesson content | Content rule | Open |

### albuyout-alamena, episodes 24–26 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-14)

Each episode read in full. 63 points written (ar, en, ur); 34 new `about` edges (ep24 15, ep25 8 new, ep26 11 new; the rest were already present); 44 needs_source (unsourced reports and anecdotes, garbled call text, lexical claims not checked against a dictionary).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep24–ep26 (truthfulness and lying; the language of dialogue; the language of the Qur'an) | about 47 min, 46 min, 45 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 63 points | 34 new `about` edges | ep24 22, ep25 20, ep26 21 | 44 needs_source | this PR |

Next step: episode 27.

| Excluded (albuyout-alamena ep24–ep26) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep24 00:00:00–00:00:30, 00:11:00–00:11:30, 00:22:30–00:23:00, 00:43:30–00:44:00 (closing), 00:46:30–00:47:00; ep25 00:00:00–00:00:30, 00:08:30–00:09:00, 00:23:30–00:24:00, 00:45:00–00:45:30; ep26 00:00:00–00:00:30, 00:05:00–00:05:30, 00:25:30, 00:44:30–00:45:00 | Not lesson content | Content rule | Open |
| Repetition loops | ep24 00:08:00, 00:13:30 (tail), 00:34:30, 00:39:30, 00:42:30; ep25 00:03:30 (tail), 00:07:30–00:08:00, 00:27:30–00:28:00, 00:39:30, 00:42:00; ep26 00:09:00, 00:17:00, 00:19:30, 00:34:30–00:35:00, 00:38:30 | Not speech | Loop check | Open |
| Garbled call windows | ep24 00:28:00 (the Kurdish caller's own account), 00:30:30–00:31:30 (the caller's question), 00:36:30; ep25 00:25:00 (start of the Switzerland call), 00:26:30, 00:30:00–00:30:30 (the missed-fasts figures); ep26 00:34:00–00:35:00, 00:37:30–00:38:30 | Garbled or fragmentary; only the clear question is summarised, no ruling written | Clarity | Open |
| Private and sensitive circumstances | ep24 00:30:30–00:31:30 (a woman's relationship with a married man); ep25 00:25:30–00:27:00 (medical details), 00:30:30 (a marriage arrangement) | Summarised in general terms only | Privacy | Open |
| Hadith and saying wording | ep24 00:09:30–00:10:00, 00:13:30, 00:16:00–00:16:30, 00:25:30; ep25 00:05:30, 00:06:30, 00:19:30; ep26 00:06:00 | Wording not typed; by sense only | Hadith rule | Open |
| A remark on exaggeration in words and a garbled line of verse attributed to a classical poet | ep26 00:07:00–00:07:30 | Garbled and off the subject of the home; not recorded | Clarity | Open |

### albuyout-alamena, episode 27 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-15)

Episode 27 re-read in full from the start (47 min of transcript is 43 min of speech, no calls). 18 points written (ar, en, ur); new `about` edges for the people and passages named; 11 needs_source (reports and stories given by sense without a chain, and sweeping generalisations).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep27 (the character of muru'a) | about 43 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 18 points | new `about` edges | 18 | 11 needs_source | this PR |

Next step: episode 28.

| Excluded (albuyout-alamena ep27) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep27 00:00:00–00:01:00, 00:14:30 (break), 00:28:00–00:28:30, 00:42:30–00:43:00 | Not lesson content | Content rule | Open |
| Repetition loops and noise | ep27 00:14:00, 00:23:30 (a run of one repeated letter), 00:37:30, 00:38:00–00:38:30, 00:40:00, 00:41:00, 00:41:30 | Not speech | Loop check | Open |
| Garbled passages | ep27 00:08:00–00:08:30 (partly), 00:11:00 (a mixed-script word), 00:38:30–00:39:00 (the account of Umar's cold-day practice, who asked him is unclear) | Garbled; recorded only the clear sense | Clarity | Open |
| Hadith and saying wording | ep27 00:05:30–00:06:30, 00:10:00, 00:16:00–00:17:00, 00:26:00, 00:32:00–00:33:00 | Wording not typed; by sense only | Hadith rule | Open |
| Verses of poetry quoted | ep27 00:35:30–00:36:00 | Not reproduced beyond a brief mention | Sources policy | Open |


### al-dar-al-akhera ep14-ep15 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep14-ep15 (crossing the Bridge, the stations, the Pond, intercession; the arches of the Bridge) | ep14 about 32 min; ep15 about 37 min (transcript) | ar, en, ur: 1 record extended | 11 new `about` edges | ep14 7, ep15 9 points; qwen3-asr pass5, 30 s windows | needs_source on every point; the order of the arches and ablution among them (ep15 00:24:00); the zakat figures (00:14:30); the hajj hadith and Umar's saying (00:22:30); the reports without chains (ep15 00:30:30) | run omar-abdelkafy-dar-akhera-9 |

The hajj hadith (ep15 00:22:30) is presented as the lecturer's relating with no museum ruling; the record stays `sensitivity: contested`.

| Excluded (dar-akhera ep14-ep15) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep14 00:01:30, 00:04:00, 00:07:00, 00:13:30, 00:15:30, 00:16:30, 00:17:00, 00:17:30, 00:20:30, 00:26:30, 00:27:00, 00:27:30, 00:28:00, 00:29:00, 00:30:00, 00:30:30; ep15 00:02:00, 00:12:00, 00:13:00, 00:13:30, 00:14:00, 00:17:30, 00:19:30 (a repeated phrase), 00:27:30, 00:29:00, 00:33:30, 00:35:30 | Not speech | Loop check | Open |
| Garbled passages | ep14 00:03:00-00:04:00, 00:06:00-00:07:30, 00:12:30-00:14:00, 00:14:30-00:16:00, 00:18:30-00:20:30, 00:21:30-00:22:30, 00:24:00-00:25:30, 00:28:30-00:29:30 (the ant passage); ep15 00:02:30-00:03:30, 00:05:00-00:06:30, 00:12:30 (a remark on lecturing), 00:15:00-00:15:30, 00:17:30-00:19:30 (fasting numbers and a bleeding ruling), 00:20:00 (partial), 00:24:30-00:27:00, 00:31:30-00:33:00, 00:34:00-00:35:00 | Not recoverable as clear Arabic | Clarity | Open |
| Supplications and sign-offs | ep14 00:32:00; ep15 00:35:30-00:36:30 | Not lesson content | Content rule | Open |

### albuyout-alamena, episode 28 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-16)

Episode 28 read in full (48 min of transcript) before writing. 17 points written (ar, en, ur); new `about` edges for the people and passages named; 11 needs_source (sayings without a chain, garbled call text, rulings given without evidence).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep28 (noses in the home; rights of mother and wife) | about 48 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 17 points | new `about` edges | 17 | 11 needs_source | this PR |

Next step: episode 29.

| Excluded (albuyout-alamena ep28) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep28 00:00:00–00:00:30, 00:07:00–00:07:30, 00:26:00–00:26:30, 00:48:30 | Not lesson content | Content rule | Open |
| Repetition loops | ep28 00:08:00, 00:10:30, 00:11:30, 00:16:00, 00:18:00, 00:25:00, 00:26:30, 00:43:30, 00:45:00, 00:46:30–00:47:00, 00:48:00 | Not speech | Loop check | Open |
| Garbled passages and calls | ep28 00:01:00–00:02:00 (partly), 00:12:00, 00:26:30–00:27:30 (the black box explanation is only in the later passage), 00:34:30–00:35:30, 00:36:00, 00:38:00 (the fate of the disobedient), 00:46:00 | Garbled or fragmentary; only the clear sense is summarised | Clarity | Open |
| Private circumstances | ep28 00:27:00–00:29:30, 00:42:30–00:46:30 | Personal details kept general | Privacy | Open |
| Hadith and saying wording | ep28 00:10:00–00:12:30, 00:15:00, 00:18:00–00:19:00, 00:24:30 | Wording not typed; by sense only | Hadith rule | Open |


### al-dar-al-akhera ep16 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep16 (the Pond; Salih's she-camel; eight kinds kept from the Pond) | about 37 min (transcript) | ar, en, ur: 1 record extended | 7 new `about` edges | 14 points; qwen3-asr pass5, 30 s windows | needs_source on every point; the four-corners report has no source (00:06:30); the Egypt hadith (00:09:00); the eighth kind (00:31:30); the two-men report (00:33:30) | run omar-abdelkafy-dar-akhera-10 |

Opinions labelled as the lecturer's own with no museum ruling: apostasy of one who rejects a known obligation (ep16 00:17:30), innovation examples, rebellion against rulers, conditions for singing. The record stays `sensitivity: contested`.

| Excluded (dar-akhera ep16) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep16 00:03:30, 00:08:30, 00:13:00, 00:18:30, 00:21:30, 00:35:30 | Not speech | Loop check | Open |
| Garbled passages | ep16 00:02:30, 00:07:30-00:08:00 (a remark about being people of the Sunna and Egypt), 00:12:00-00:13:30 (a hotel analogy), 00:15:30-00:16:30, 00:20:00, 00:24:30-00:25:30 (names of saints and a remark on them), 00:25:30-00:27:00, 00:30:30-00:31:00 (the story of a broker said to be told by al-Ghazali), 00:32:30-00:33:00 | Not recoverable as clear Arabic | Clarity | Open |
| Announcement on distribution and pricing of the recorded series | ep16 00:36:00-00:37:00 | Logistics, not lesson content | Content rule | Open |

### albuyout-alamena, episode 29 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-17)

Episode 29 read in full (51 min of transcript) before writing. 15 points written (ar, en, ur); new `about` edges for the people, places and passages named; 13 needs_source (stories, figures and sayings without a chain or source, garbled call text).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep29 (hope in the home) | about 51 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 15 points | new `about` edges | 15 | 13 needs_source | this PR |

Next step: episode 30.

| Excluded (albuyout-alamena ep29) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep29 00:00:00–00:00:30, 00:11:00 (break), 00:28:00–00:28:30, 00:51:00 | Not lesson content | Content rule | Open |
| Repetition loops | ep29 00:04:00, 00:07:30, 00:08:00, 00:09:00, 00:10:00, 00:17:00, 00:26:00, 00:27:30, 00:34:00, 00:39:00, 00:43:00–00:43:30, 00:46:30, 00:47:00, 00:49:00 | Not speech | Loop check | Open |
| Garbled passages and calls | ep29 00:08:00–00:09:30 (the opening of the Kafur and Saladin stories), 00:13:00 (the opening of the Ata passage), 00:30:00–00:31:00 (the call about the son), 00:31:00 (a cut line), 00:36:00–00:37:30, 00:38:00–00:38:30, 00:39:30–00:40:30 | Garbled or fragmentary; only the clear sense is summarised | Clarity | Open |
| Private circumstances of callers | ep29 00:30:00–00:41:00 | Kept general | Privacy | Open |
| Verses of poetry quoted | ep29 00:06:30, 00:27:00 | Not reproduced | Sources policy | Open |
| Hadith and saying wording | ep29 00:02:00–00:02:30, 00:25:00, 00:49:00 | Wording not typed; by sense only | Hadith rule | Open |


### al-dar-al-akhera ep17-ep18 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep17-ep18 (the people of Paradise and the Fire; the Fire, part 1) | ep17 about 43 min; ep18 about 45 min (transcript) | ar, en, ur: 1 record extended | 12 new `about` edges | ep17 10, ep18 14 points; qwen3-asr pass5, 30 s windows | needs_source on every point; the Ascension report and the slaughtered death have no chain (ep17 00:26:00, 00:29:30); the names in the Iyad ibn Himar hadith (ep17 00:35:00); the Abd al-Rahman ibn Awf figures (ep18 00:10:30); Hatim al-Asamm (ep18 00:19:00); the order and names of the degrees (ep18 00:36:00) | run omar-abdelkafy-dar-akhera-11 |

| Excluded (dar-akhera ep17-ep18) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep17 00:01:30, 00:05:30, 00:12:00, 00:12:30, 00:15:30, 00:16:00, 00:19:30, 00:22:00, 00:28:00, 00:32:30, 00:34:00; ep18 00:00:30, 00:01:00, 00:09:00, 00:10:00, 00:12:30, 00:15:00, 00:16:30, 00:19:30, 00:21:00, 00:34:00, 00:37:30, 00:39:30 | Not speech | Loop check | Open |
| Garbled passages | ep17 00:00:00-00:01:30, 00:03:30-00:04:30, 00:05:00 (a remark on the veil), 00:06:00-00:08:00, 00:10:30-00:11:00, 00:13:00 (partial), 00:14:30-00:15:30, 00:23:00 (partial), 00:25:00-00:26:00, 00:32:00-00:35:00 (the moths hadith tail), 00:38:00-00:40:30 (partial); ep18 00:00:00, 00:01:30, 00:03:30-00:04:00 (partial), 00:06:00-00:07:00, 00:12:30-00:18:00 (market and chemistry anecdotes), 00:24:00-00:24:30 (partial), 00:28:30-00:29:00, 00:31:30-00:33:00, 00:37:00-00:39:00 (groups the lecturer names under the degrees), 00:39:30-00:41:30 | Not recoverable as clear Arabic | Clarity | Open |
| Supplications, announcements and sign-offs | ep17 00:41:30-00:42:30; ep18 00:44:00-00:44:30 (mosque lecture times) | Not lesson content | Content rule | Open |

### albuyout-alamena, episode 30 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-18)

Episode 30 read in full (51 min of transcript) before writing. 15 points written (ar, en, ur); new `about` edges for the people and passages named; 12 needs_source (stories and sayings without a chain, garbled call text, calls with no recorded answer).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep30 (the negotiating table in the home) | about 51 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 15 points | new `about` edges | 15 | 12 needs_source | this PR |

Next step: episode 31. The series has 47 episodes of transcript on disk (ep01 to ep47); episodes 31 to 47 are not yet written.

| Excluded (albuyout-alamena ep30) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep30 00:00:00–00:01:00, 00:15:00 (break), 00:28:30–00:29:00, 00:50:30 | Not lesson content | Content rule | Open |
| Repetition loops | ep30 00:08:30–00:09:00, 00:31:30–00:32:00, 00:32:30, 00:34:00–00:34:30, 00:36:00, 00:37:30–00:38:00, 00:41:00, 00:50:00 | Not speech | Loop check | Open |
| Garbled passages and calls | ep30 00:16:00 (the word-origin remark on competition), 00:34:00–00:35:00, 00:35:30–00:36:30, 00:36:30–00:37:30, 00:38:30 (the inheritance question), 00:40:00–00:41:00 | Garbled or fragmentary; only the clear sense is summarised | Clarity | Open |
| Private circumstances of callers | ep30 00:31:00–00:41:00 | Kept general | Privacy | Open |
| Verses of poetry quoted | ep30 00:25:00–00:25:30 | Not reproduced | Sources policy | Open |
| Hadith and saying wording | ep30 00:07:00–00:11:00, 00:19:00, 00:44:00–00:44:30 | Wording not typed; by sense only | Hadith rule | Open |


### al-dar-al-akhera ep19 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep19 (the Fire, part 2) | about 41 min (transcript) | ar, en, ur: 1 record extended | none new (concept/jahannam already linked) | 8 points; qwen3-asr pass5, 30 s windows | needs_source on every point; the second half of the dipping hadith (00:02:30) is inferred from nearby context; the third kind charged to the Fire (00:08:30) | run omar-abdelkafy-dar-akhera-12 |

| Excluded (dar-akhera ep19) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep19 00:10:30, 00:11:30, 00:15:30, 00:16:00, 00:17:30, 00:22:00, 00:22:30, 00:23:00, 00:23:30, 00:24:30, 00:25:30, 00:33:30, 00:35:30, 00:36:30, 00:37:30, 00:38:00, 00:39:00, 00:40:00 | Not speech | Loop check | Open |
| Garbled passages | ep19 00:00:00, 00:02:00-00:02:30, 00:03:00-00:06:30 (anecdotes and a remark on tyrants), 00:09:30-00:12:00, 00:13:00-00:16:30 (food of the Fire, unrecoverable), 00:19:00-00:21:00, 00:26:30-00:33:00 (the four groups and the two places), 00:34:00-00:35:30, 00:36:00 (a repeated phrase) | Not recoverable as clear Arabic | Clarity | Open |
| Hallucinated non-Arabic text | ep19 00:40:30 | Not speech in any intelligible language | Clarity | Open |
| Supplications and sign-off | ep19 00:38:30, 00:39:30 (announcement) | Not lesson content | Content rule | Open |

### albuyout-alamena, episode 31 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-19)

Episode 31 read in full (51 min of transcript) before writing. 13 points written (ar, en, ur); new `about` edges for the people and passages named; 8 needs_source (stories, figures and sayings without a source, garbled call text).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep31 (estrangement in the home) | about 51 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 13 points | new `about` edges | 13 | 8 needs_source | this PR |

Next step: episode 32.

| Excluded (albuyout-alamena ep31) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep31 00:00:00–00:00:30, 00:19:30–00:20:00, 00:30:30–00:31:00, 00:50:00–00:51:00 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep31 00:06:00, 00:19:00–00:20:30, 00:24:30–00:26:30, 00:34:30–00:35:30, 00:36:00–00:36:30, 00:38:00, 00:39:30–00:40:30, 00:46:30 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Private circumstances of callers | ep31 00:31:00–00:41:00 | Kept general | Privacy | Open |
| Verses of poetry quoted | ep31 00:02:00, 00:27:30–00:28:30, 00:31:00 | Not reproduced | Sources policy | Open |
| Hadith and saying wording | ep31 00:03:00, 00:13:30, 00:26:30–00:27:00, 00:29:30, 00:43:00 | Wording not typed; by sense only | Hadith rule | Open |
| Questions with no recorded answer | ep31 00:37:00 (obligatory knowledge) | The answer is not in the transcript | Clarity | Open |

### albuyout-alamena, episode 32 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-20)

Episode 32 read in full (48 min of transcript) before writing. 13 points written (ar, en, ur); new `about` edges for the people and passages named; 10 needs_source (reports and sayings without a chain, garbled call text).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep32 (contentment in the home) | about 48 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 13 points | new `about` edges | 13 | 10 needs_source | this PR |

Next step: episode 33.

| Excluded (albuyout-alamena ep32) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep32 00:00:00–00:00:30, 00:09:30–00:10:00, 00:23:00–00:23:30, 00:47:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep32 00:04:00–00:04:30, 00:08:00, 00:17:30–00:18:00, 00:23:30–00:24:00, 00:25:30–00:26:00, 00:28:30–00:29:00, 00:30:30–00:31:00, 00:41:30 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Private circumstances of callers | ep32 00:24:00–00:33:30 | Kept general | Privacy | Open |
| Verses of poetry quoted | ep32 00:03:00, 00:45:00–00:45:30 | Not reproduced | Sources policy | Open |
| Hadith and saying wording | ep32 00:07:00–00:10:00, 00:12:00–00:13:00, 00:21:00–00:22:30, 00:37:30, 00:43:00 | Wording not typed; by sense only | Hadith rule | Open |
| Calls with no recorded answer | ep32 00:29:00 (a woman's own account), 00:34:00 (a cut line), 00:42:30 | The answer is not in the transcript | Clarity | Open |

### albuyout-alamena, episode 33 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-21)

Episode 33 read in full (44 min of transcript) before writing. 15 points written (ar, en, ur); new `about` edges for the people and passages named; 9 needs_source (stories and sayings without a chain, generalisations without a source).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep33 (mutual respect in the home) | about 44 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 15 points | new `about` edges | 15 | 9 needs_source | this PR |

Next step: episode 34.

| Excluded (albuyout-alamena ep33) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep33 00:00:00–00:01:00, 00:15:30–00:16:00, 00:31:30–00:32:00, 00:43:00–00:44:30 | Not lesson content | Content rule | Open |
| Repetition loops | ep33 00:30:00–00:31:30, 00:37:00–00:37:30, 00:41:30–00:42:00 | Not speech | Loop check | Open |
| Garbled passages | ep33 00:16:00 (the opening of the al-Jahiz story), 00:36:30 (the sentence on husbands who blame wives), 00:39:30–00:40:00 | Garbled; only the clear sense is summarised | Clarity | Open |
| Verses of poetry quoted | ep33 00:10:00–00:10:30 | Not reproduced | Sources policy | Open |
| Hadith and saying wording | ep33 00:09:30, 00:13:30, 00:18:30, 00:19:00–00:19:30, 00:32:00–00:33:00 | Wording not typed; by sense only | Hadith rule | Open |

### albuyout-alamena, episode 34 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-22)

Episode 34 read in full (51 min of transcript) before writing. 16 points written (ar, en, ur); new `about` edges for the people and passages named; 12 needs_source (figures, stories and sayings without a source, garbled call text).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep34 (quarrel and harmony in the home) | about 51 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 16 points | new `about` edges | 16 | 12 needs_source | this PR |

Next step: episode 35.

| Excluded (albuyout-alamena ep34) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep34 00:00:00–00:00:30, 00:13:30–00:15:30, 00:32:30–00:34:30, 00:51:00–00:51:30 | Not lesson content (verse recitations at the breaks) | Content rule | Open |
| Repetition loops and garbled windows | ep34 00:11:30–00:12:30, 00:21:30–00:22:30, 00:35:00–00:36:30, 00:36:30–00:37:00, 00:45:30 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Private circumstances of callers | ep34 00:34:30–00:46:30 | Kept general | Privacy | Open |
| Verses of poetry quoted | ep34 00:01:30, 00:02:30 | Not reproduced | Sources policy | Open |
| Hadith and saying wording | ep34 00:04:30, 00:17:00–00:19:00, 00:24:00–00:25:00, 00:27:30–00:29:30, 00:48:30 | Wording not typed; by sense only | Hadith rule | Open |
| Passage about greeting women who are not relatives | ep34 00:26:30–00:27:30 | Garbled; the ruling is not clear and is not recorded | Clarity | Open |

### albuyout-alamena, episode 35 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-23)

Episode 35 read in full (52 min of transcript) before writing. 16 points written (ar, en, ur); new `about` edges for the people and passages named; 12 needs_source (stories, sayings and statistics without a source, garbled call text).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep35 (the universal language of ethics) | about 52 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 16 points | new `about` edges | 16 | 12 needs_source | this PR |

Next step: episode 36.

| Excluded (albuyout-alamena ep35) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep35 00:00:00–00:01:00, 00:14:30–00:15:00, 00:28:30–00:29:00, 00:51:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep35 00:04:00–00:04:30, 00:10:00, 00:20:00, 00:25:30, 00:40:00–00:41:30, 00:42:30–00:43:00, 00:45:00–00:45:30, 00:50:30–00:51:30 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Private circumstances of callers | ep35 00:30:00–00:45:00 | Kept general | Privacy | Open |
| Verses of poetry quoted | ep35 00:10:30 | Not reproduced | Sources policy | Open |
| Hadith and saying wording | ep35 00:07:00–00:08:00, 00:11:00–00:13:30, 00:18:30–00:19:00, 00:23:30–00:25:00, 00:27:30–00:28:30 | Wording not typed; by sense only | Hadith rule | Open |
| Questions with no recorded answer | ep35 00:36:30–00:39:00 (triple divorce), 00:42:00–00:43:00 (charity for deceased parents), 00:45:00 (praise and the worldly life) | The answer is not in the transcript | Clarity | Open |

### albuyout-alamena, episode 36 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-24)

Episode 36 read in full (47 min of transcript) before writing. 11 points written (ar, en, ur); new `about` edges for the people and passages named; 8 needs_source (stories and sayings without a chain, rulings given without evidence, garbled call text).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep36 (the spouses' telescopes) | about 47 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 11 points | new `about` edges | 11 | 8 needs_source | this PR |

Next step: episode 37.

| Excluded (albuyout-alamena ep36) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep36 00:00:00–00:00:30, 00:13:30–00:14:00, 00:24:30–00:25:00, 00:46:00–00:46:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep36 00:16:30–00:17:30, 00:19:00, 00:21:00–00:21:30, 00:27:30–00:29:30, 00:30:30–00:31:00, 00:40:30–00:41:00, 00:42:00–00:42:30, 00:45:30 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Private circumstances of callers | ep36 00:26:30–00:36:30 | Kept general | Privacy | Open |
| A proverb on a tiring mother-in-law | ep36 00:37:30–00:38:00 | Garbled; not recorded | Clarity | Open |
| Hadith and saying wording | ep36 00:12:30, 00:21:30–00:22:30, 00:35:30 | Wording not typed; by sense only | Hadith rule | Open |
| Questions with no recorded answer | ep36 00:32:00 (bank loans, referred to the jurisprudence programmes), 00:32:30 (a prayer for pregnancy) | The answer is a referral or a prayer only | Scope | Open |

### albuyout-alamena, episode 37 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-25)

Episode 37 read in full (48 min of transcript) before writing. 13 points written (ar, en, ur); new `about` edges for the people and passages named; 9 needs_source (stories and sayings without a chain, claims without a source, garbled call text).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep37 (Mu'awiya's hair in the home) | about 48 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 13 points | new `about` edges | 13 | 9 needs_source | this PR |

Next step: episode 38.

| Excluded (albuyout-alamena ep37) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep37 00:00:00–00:00:30, 00:13:30–00:14:00, 00:24:30–00:25:30, 00:47:30–00:48:00 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep37 00:10:00, 00:11:00, 00:25:30–00:26:00, 00:31:00–00:31:30, 00:33:30–00:34:30, 00:38:00–00:39:00 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Private circumstances of callers | ep37 00:26:00–00:35:00 | Kept general | Privacy | Open |
| Questions with no recorded answer | ep37 00:26:00 (fear of flying, off the subject), 00:37:00 (the book and the lost lessons, promised only), 00:38:00–00:39:00 (the lesser pilgrimage, age of the mother not heard) | The answer is not in the transcript | Clarity | Open |
| Hadith and saying wording | ep37 00:15:00–00:16:00, 00:20:00–00:20:30 | Wording not typed; by sense only | Hadith rule | Open |

### albuyout-alamena, episode 38 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-26)

Episode 38 read in full (43 min of transcript) before writing. 11 points written (ar, en, ur); new `about` edges for the people and passages named; 10 needs_source (stories and sayings without a chain, garbled call text).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep38 (persuasion and conviction through gentleness) | about 43 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 11 points | new `about` edges | 11 | 10 needs_source | this PR |

Next step: episode 39.

| Excluded (albuyout-alamena ep38) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep38 00:00:00–00:00:30, 00:16:00–00:16:30, 00:28:30–00:29:00, 00:42:30–00:43:00 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep38 00:05:00, 00:12:00, 00:17:00–00:18:00, 00:19:30, 00:21:30, 00:23:30, 00:26:00, 00:33:00 (a looped sentence), 00:37:00 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Private circumstances of callers | ep38 00:29:30–00:36:30 | Kept general | Privacy | Open |
| Questions off the subject | ep38 00:32:00 (the lecturer's latest books) | Not lesson content | Scope | Open |
| Verses of poetry quoted | ep38 00:22:30–00:23:30, 00:31:00–00:31:30 | Not reproduced | Sources policy | Open |
| Hadith and saying wording | ep38 00:05:00–00:06:30, 00:14:00, 00:27:00–00:28:00 | Wording not typed; by sense only | Hadith rule | Open |
| A remark about a man who told al-Hajjaj he had done what the Messenger did not | ep38 00:38:30–00:39:00 | Garbled and without context; not recorded | Clarity | Open |

### albuyout-alamena, episode 39 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-27)

Episode 39 read in full (48 min of transcript) before writing. 13 points written (ar, en, ur); new `about` edges for the people and passages named; 9 needs_source (statistics, medical claims and sayings without a source, garbled call text).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep39 (the school year and safe homes) | about 48 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 13 points | new `about` edges | 13 | 9 needs_source | this PR |

Next step: episode 40.

| Excluded (albuyout-alamena ep39) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep39 00:00:00–00:00:30, 00:15:30–00:16:00, 00:33:30–00:34:00, 00:47:30–00:48:00 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep39 00:14:30–00:15:30, 00:17:00–00:17:30, 00:19:00–00:19:30, 00:21:00, 00:35:30, 00:37:30, 00:42:30, 00:43:30 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Private circumstances of callers | ep39 00:35:00–00:42:30 | Kept general | Privacy | Open |
| Verses of poetry quoted | ep39 00:06:00–00:07:00 | Not reproduced | Sources policy | Open |
| Hadith and saying wording | ep39 00:05:30, 00:09:30–00:10:00, 00:22:00–00:22:30, 00:28:00–00:29:00 | Wording not typed; by sense only | Hadith rule | Open |
| A remark on people who hated learning and on the Buddha | ep39 00:08:30–00:09:00, 00:11:00–00:11:30 | Contested and unsourced claims, only the first recorded as the lecturer's view | Scope | Open |


### al-dar-al-akhera ep20 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep20 (the Fire, part 3) | about 41 min (transcript) | ar, en, ur: 1 record extended | 1 new `about` edge (concept/zaqqum) | 14 points; qwen3-asr pass5, 30 s windows | needs_source on most points; the saying ascribed to Umar on the Kaaba (00:36:30); the valley name Habhab and the length calculation (00:32:30); the Ibn Masud report (00:35:30) | run omar-abdelkafy-dar-akhera-13 |

| Excluded (dar-akhera ep20) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep20 00:01:00, 00:04:00, 00:11:00, 00:20:00, 00:26:00, 00:26:30, 00:32:00, 00:39:30 | Not speech | Loop check | Open |
| Garbled passages | ep20 00:01:30-00:02:00, 00:07:00-00:08:00 (the brother and the neighbour dispute), 00:09:30-00:13:00 (jealousy and Umar's judge, a woman of forty-five years), 00:16:30-00:18:00 (partial), 00:21:00-00:23:00, 00:26:30-00:29:00 (the wailing woman's tail and a remark about girls), 00:32:00-00:32:30, 00:33:00-00:33:30 | Not recoverable as clear Arabic | Clarity | Open |
| Supplications, a question on ultrasound, and the producer's announcement with phone number | ep20 00:38:30-00:40:00; 00:40:30-00:41:00 | Not lesson content | Content rule | Open |


### al-dar-al-akhera ep21 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep21 (the Fire, part 4: mercy and intercession) | about 40 min (transcript) | ar, en, ur: 1 record extended | 4 new `about` edges | 13 points; qwen3-asr pass5, 30 s windows | needs_source on most points; the hadith about the Prophet's community taken to the Fire and the report with Malik have no chain (ep21 00:10:00, 00:13:30); the verse tied to the Prophet's words (00:09:00); the ascription to Abu Nuaym and Ahmad (00:37:00) | run omar-abdelkafy-dar-akhera-14 |

| Excluded (dar-akhera ep21) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep21 00:02:30, 00:13:00, 00:17:00, 00:23:00, 00:33:30 | Not speech | Loop check | Open |
| Garbled passages | ep21 00:00:00-00:02:00 (the Prophet before the Fire), 00:03:00-00:03:30, 00:10:00-00:10:30 (partial), 00:17:30-00:18:00, 00:20:30-00:21:30 (the reciters who do not act), 00:28:30-00:31:30 (those who walk to mosques in the dark and a remark on Pharaoh), 00:31:30-00:34:30 (a passage on al-Husayn at Karbala whose speaker and words are not recoverable), 00:34:00-00:35:00 | Not recoverable as clear Arabic | Clarity | Open |
| Supplications and the producer's announcement with phone number | ep21 00:37:30-00:40:00 | Not lesson content | Content rule | Open |

### albuyout-alamena, episode 40 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-28)

Episode 40 read in full (46 min of transcript) before writing. 15 points written (ar, en, ur); new `about` edges for the people and passages named; 7 needs_source (stories and sayings without a chain, rulings given without evidence, garbled call text).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep40 (breadth of chest in the home) | about 46 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 15 points | new `about` edges | 15 | 7 needs_source | this PR |

Next step: episode 41.

| Excluded (albuyout-alamena ep40) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep40 00:00:00–00:00:30, 00:12:30–00:13:00, 00:26:00–00:26:30, 00:46:00–00:46:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep40 00:13:00, 00:25:00, 00:33:30–00:34:00, 00:42:00, 00:42:30 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Private circumstances of callers | ep40 00:26:30–00:36:00 | Kept general | Privacy | Open |
| A caller's dream about the lecturer | ep40 00:34:00–00:34:30 | A private, unverifiable dream; not recorded | Scope | Open |
| Verses of poetry quoted | ep40 00:26:30 | Not reproduced | Sources policy | Open |
| Hadith and saying wording | ep40 00:06:30–00:08:00, 00:17:00–00:18:00, 00:19:00–00:20:30, 00:24:00–00:25:00 | Wording not typed; by sense only | Hadith rule | Open |


### al-dar-al-akhera ep22 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep22 (Paradise, part 1: its keys) | about 40 min (transcript) | ar, en, ur: 1 record extended | 8 new `about` edges (concept/jannah already linked) | 12 points; qwen3-asr pass5, 30 s windows | needs_source on most points; the al-Shadhili story (00:05:30); the ascription to al-Ghazali (00:08:00); the report of Umar and Sariya (00:14:30); the saying ascribed to Umar on the caller (00:26:00); the adulteress report (00:02:30) | run omar-abdelkafy-dar-akhera-15 |

| Excluded (dar-akhera ep22) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep22 00:07:30, 00:18:00, 00:20:30, 00:28:00, 00:29:30, 00:31:30, 00:32:00, 00:32:30, 00:33:00 | Not speech | Loop check | Open |
| Garbled passages | ep22 00:00:00 (partial), 00:01:30-00:02:00, 00:04:00-00:04:30, 00:07:00-00:07:30, 00:10:30-00:14:00 (the vision and the Umar passages), 00:14:30-00:16:30 (partial), 00:17:00, 00:21:00-00:22:30, 00:24:00-00:26:00, 00:29:00-00:30:30, 00:33:30-00:34:00, 00:36:00-00:36:30 | Not recoverable as clear Arabic | Clarity | Open |
| Supplications and the producer's announcement with phone number | ep22 00:37:00-00:40:00 | Not lesson content | Content rule | Open |

### albuyout-alamena, episode 41 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-29)

Episode 41 read in full (46 min of transcript) before writing. 21 points written (ar, en, ur); new `about` edges for the people and passages named; 9 needs_source (unchained stories and sayings, ages and claims without a source, rulings without evidence, unidentified verses of poetry, garbled call text).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep41 (the examination season in the home) | about 46 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 21 points | new `about` edges | 21 | 9 needs_source | this PR |

Next step: episode 42.

| Excluded (albuyout-alamena ep41) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae, sponsor and website line | ep41 00:00:00–00:00:30, 00:14:00–00:14:30, 00:24:30–00:25:00, 00:45:00–00:45:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep41 00:04:00, 00:06:30–00:07:00, 00:16:30–00:17:00, 00:21:00, 00:25:30, 00:32:30–00:33:00, 00:44:00 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Private circumstances of callers | ep41 00:25:30–00:34:00 | Kept general | Privacy | Open |
| Verses of poetry quoted | ep41 00:04:30, 00:19:30 | Not reproduced | Sources policy | Open |
| Hadith and saying wording | ep41 00:23:30–00:25:00 | Wording not typed; by sense only | Hadith rule | Open |


### al-dar-al-akhera ep23 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep23 (Paradise, part 2: keys, doors, degrees) | about 43 min (transcript) | ar, en, ur: 1 record extended | 8 new `about` edges | 16 points; qwen3-asr pass5, 30 s windows | needs_source on most points; the Israelite worshipper report and the four doors have no chain (ep23 00:01:30, 00:34:30); the prescription ascribed to Ali (00:20:30); the lizard report and the lecturer's declaring it sound (00:23:30); the ascription to al-Ghazali (00:11:00) | run omar-abdelkafy-dar-akhera-16 |

| Excluded (dar-akhera ep23) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep23 00:06:00, 00:09:30, 00:12:30, 00:13:30, 00:23:00, 00:31:00, 00:33:30, 00:37:30, 00:38:30, 00:42:00 | Not speech | Loop check | Open |
| Garbled passages | ep23 00:00:00-00:01:00 (a man in a dream and counted deeds), 00:04:30-00:06:30 (a Successor and the night voice), 00:08:30-00:09:30, 00:11:30-00:13:00 (partial), 00:15:00-00:18:00 (the eighth-door and obstacle passages), 00:20:00, 00:26:30-00:27:30, 00:29:00-00:29:30, 00:30:00-00:31:30 (the waiting-for-graduation remark), 00:34:00-00:34:30, 00:36:30-00:37:30 (a remark on the Arabic word for the card), 00:38:00-00:39:00 | Not recoverable as clear Arabic | Clarity | Open |
| Supplications and the producer's announcement with phone number | ep23 00:42:30-00:43:30 | Not lesson content | Content rule | Open |

### albuyout-alamena, episode 42 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-30)

Episode 42 read in full (50 min of transcript) before writing. 19 points written (ar, en, ur); new `about` edges for the people and passages named; 12 needs_source (unchained accounts and sayings, an unattributed likening, rulings without evidence, garbled call text).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep42 (the art of listening in the home) | about 50 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 19 points | new `about` edges | 19 | 12 needs_source | this PR |

Next step: episode 43.

| Excluded (albuyout-alamena ep42) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae, sponsor and website line | ep42 00:00:00–00:01:00, 00:14:30–00:15:30, 00:27:30–00:28:00, 00:49:00–00:49:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep42 00:09:30, 00:18:00, 00:26:30–00:27:00, 00:30:00–00:31:00, 00:35:30–00:36:00, 00:38:30–00:39:00, 00:40:30 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Private circumstances of callers | ep42 00:29:30–00:41:30 | Kept general | Privacy | Open |
| Callers' office address and invitation | ep42 00:35:30–00:36:00 | A private invitation, not lesson content | Privacy | Open |
| Fatwa questions on oaths and bank loans | ep42 00:33:00–00:34:00, 00:39:00–00:40:00 | Referred by the lecturer to another programme; no ruling given | Scope | Open |
| Hadith and saying wording | ep42 00:05:30–00:07:00, 00:16:00–00:17:30, 00:24:00–00:28:30 | Wording not typed; by sense only | Hadith rule | Open |

### albuyout-alamena, episode 43 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-31)

Episode 43 read in full (49 min of transcript) before writing. 15 points written (ar, en, ur); new `about` edges for the people and passages named; 12 needs_source (unchained stories, sayings and hadith, unsourced claims and rulings, garbled call text).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep43 (the art of giving in the home) | about 49 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 15 points | new `about` edges | 15 | 12 needs_source | this PR |

Next step: episode 44.

| Excluded (albuyout-alamena ep43) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae, sponsor and website line | ep43 00:00:00–00:00:30, 00:14:00–00:15:00, 00:27:30–00:28:00, 00:47:30–00:48:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep43 00:04:30, 00:16:00–00:17:00, 00:23:00–00:23:30, 00:24:00–00:25:30, 00:37:30–00:38:00, 00:41:00–00:41:30 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Private circumstances of callers | ep43 00:29:30–00:46:00 | Kept general | Privacy | Open |
| A garbled passage on a Companion and modern hairstyles | ep43 00:24:00–00:25:30 | Text too garbled to summarise beyond the general point | Clarity | Open |
| Counts and statistics claimed | ep43 00:13:30–00:14:00 | Divorce rise in summer is the lecturer's claim without a count; recorded as needs_source | Sources policy | Open |

### albuyout-alamena, episode 44 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-32)

Episode 44 read in full (50 min of transcript) before writing. 16 points written (ar, en, ur); new `about` edges for the people and passages named; 11 needs_source (unchained accounts and hadith in sense, unnamed scholarly ascriptions, rulings without evidence).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep44 (hearsay in the home) | about 50 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 16 points | new `about` edges | 16 | 11 needs_source | this PR |

Next step: episode 45.

| Excluded (albuyout-alamena ep44) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae, sponsor and website line | ep44 00:00:00–00:00:30, 00:14:30–00:15:00, 00:32:30–00:33:30, 00:49:00–00:49:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep44 00:02:00, 00:14:00, 00:28:00–00:29:00, 00:35:30–00:36:00, 00:36:30–00:37:00 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Private circumstances of callers | ep44 00:34:30–00:47:30 | Kept general | Privacy | Open |
| Caller's question on a name for adoptive parents' supplication | ep44 00:37:30–00:38:30 | Text garbled; no answer given in the recording that can be summarised | Clarity | Open |
| Hadith and saying wording | ep44 00:03:00–00:05:00, 00:16:30–00:20:30, 00:26:30–00:28:00, 00:32:00–00:34:00 | Wording not typed; by sense only | Hadith rule | Open |


### al-dar-al-akhera ep24 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep24 (Paradise, part 3: doors and degrees) | about 46 min (transcript) | ar, en, ur: 1 record extended | 6 new `about` edges | 15 points; qwen3-asr pass5, 30 s windows | needs_source on most points; the ascription to the Prophet and the martyrs' leader (ep24 00:00:00, 00:02:30); the number of Qur'an verses (00:16:30, not written); the two sayings of Abu Bakr (00:13:00); the standard-bearers (00:10:00); the report on the two springs (00:37:00) | run omar-abdelkafy-dar-akhera-17 |

| Excluded (dar-akhera ep24) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep24 00:05:00, 00:06:30, 00:15:30, 00:26:30, 00:42:30 | Not speech | Loop check | Open |
| Garbled passages | ep24 00:01:00-00:02:00, 00:05:30-00:07:00 (partial), 00:08:30-00:09:30 (the story of Utba), 00:11:30-00:13:00 (a station-announcement analogy), 00:15:30-00:17:00, 00:19:30-00:20:30, 00:27:30-00:28:00, 00:30:30-00:32:00, 00:35:30-00:37:00, 00:39:00-00:39:30, 00:41:00-00:42:00, 00:43:30-00:45:30 | Not recoverable as clear Arabic | Clarity | Open |
| Closing remarks on the benefit of the lesson | ep24 00:46:00 | Not lesson content | Content rule | Open |


### albuyout-alamena, episode 45 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-33)

Episode 45 read in full (50 min of transcript) before writing. 13 points written (ar, en, ur); new `about` edges for the people and passages named; 11 needs_source (unnamed studies and statistics, unchained sayings and hadith, rulings without evidence, garbled call text and numbers).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep45 (gentleness in the home) | about 50 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 13 points | new `about` edges | 13 | 11 needs_source | this PR |

Next step: episode 46.

| Excluded (albuyout-alamena ep45) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae, sponsor and website line | ep45 00:00:00–00:00:30, 00:16:00–00:16:30, 00:26:30–00:27:30, 00:49:30–00:50:00 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep45 00:05:00, 00:07:00–00:07:30, 00:25:30–00:26:00, 00:28:00, 00:29:00–00:29:30, 00:31:00–00:32:00 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Private circumstances of callers | ep45 00:28:00–00:45:00 | Kept general | Privacy | Open |
| Numbers of scenes and percentages on channels and official reports | ep45 00:06:00–00:12:00 | Garbled and unverifiable; the claim is recorded without figures and marked needs_source | Sources policy | Open |
| Story of Abu Hanifa's parents' marriage | ep45 00:47:30–00:48:00 | Deferred by the lecturer to a coming episode; not told here | Scope | Open |
| Caller's question on a hadith about one light of means | ep45 00:28:30–00:29:30 | Asked and not answered in the recording | Clarity | Open |

### albuyout-alamena, episode 46 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-34)

Episode 46 read in full (47 min of transcript) before writing. 13 points written (ar, en, ur); new `about` edges for the people and passages named; 9 needs_source (sweeping claims on men and women, physiological and brain claims, a British statistic and unchained accounts without source, garbled call text).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep46 (the complementarity of the spouses) | about 47 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 13 points | new `about` edges | 13 | 9 needs_source | this PR |

Next step: episode 47.

| Excluded (albuyout-alamena ep46) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae, sponsor and website line | ep46 00:00:00–00:00:30, 00:14:30–00:15:00, 00:26:00–00:26:30, 00:46:30–00:47:00 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep46 00:04:30–00:05:00, 00:16:00–00:17:00, 00:23:00–00:23:30, 00:34:00–00:34:30 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Private circumstances of callers | ep46 00:27:30–00:41:30 | Kept general | Privacy | Open |
| Details of a mosque and schedule asked by callers | ep46 00:35:30–00:37:00 | Promotional and private; not lesson content | Content rule | Open |
| Poetry quoted | ep46 00:09:30–00:10:00 | Not reproduced | Sources policy | Open |
| Numbers on bodily make-up and crime | ep46 00:13:30–00:15:00, 00:26:30–00:27:30 | Unverifiable and partly garbled; claims recorded without figures and marked needs_source | Sources policy | Open |

### albuyout-alamena, episode 47 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-albuyout-35)

Episode 47 read in full (51 min of transcript) before writing. 15 points written (ar, en, ur); new `about` edges for the people and passages named; 13 needs_source (unchained accounts, hadiths and a story in sense, an unsourced historical claim, garbled call text).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| albuyout-alamena ep47 (the soul and what shaped it) | about 51 min (transcript) | ar, en, ur: work/albuyout-alamena extended, 15 points | new `about` edges | 15 | 13 needs_source | this PR |

Series complete: episode 47 is the last episode of albuyout-alamena.

| Excluded (albuyout-alamena ep47) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae, sponsor and website line | ep47 00:00:00–00:00:30, 00:18:00–00:18:30, 00:37:00–00:37:30, 00:50:30–00:51:00 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep47 00:01:00–00:01:30, 00:13:00, 00:27:00–00:27:30, 00:30:00–00:30:30, 00:32:00–00:32:30, 00:40:00–00:40:30, 00:50:00 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Private circumstances of callers | ep47 00:27:30–00:50:00 | Kept general | Privacy | Open |
| Poetry quoted | ep47 00:06:00–00:06:30 | Not reproduced | Sources policy | Open |
| Hadith and supplication wording | ep47 00:02:30–00:05:00, 00:11:30–00:15:00, 00:20:00–00:22:30, 00:44:00–00:44:30, 00:48:00–00:49:30 | Wording not typed; by sense only | Hadith rule | Open |

### al-dar-al-akhera ep25 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep25 (Paradise, part 4: its building, the banquet parable, the chambers) | about 28 min of distinct content in a 9 h file (transcript) | ar, en, ur: 1 record extended | 6 new `about` edges | 14 points; qwen3-asr pass5, 30 s windows | needs_source on most points; the opening story (ep25 00:00:00); the dream interpretation (00:04:00-00:05:30); the suicide figure (00:11:30); the building of Paradise (00:13:00-00:20:30); the tree description (00:17:30-00:18:30); the hundred degrees (00:24:30); the Ayyubid account (00:27:00-00:27:30) | run omar-abdelkafy-dar-akhera-18 |

| Excluded (dar-akhera ep25) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| The same 28 min 30 s lesson repeated about nineteen times | ep25 00:28:30 to 08:57:00 | Duplicate audio; only the first pass is cited | Duplicate | Open |
| Repetition loops | ep25 00:00:30, 00:03:30, 00:19:30, 00:25:00, 00:29:30, 00:30:00 and many later windows | Not speech | Loop check | Open |
| Garbled passages | ep25 00:09:00 (a story about honey), 00:14:00-00:15:30 (a worship anecdote), 00:20:00 (a narrator anecdote), 00:21:00-00:22:00 (an audience aside), 00:28:00 | Not recoverable as clear Arabic | Clarity | Open |
| Supplications and closing blessings | ep25 00:05:30-00:06:30, 00:15:30 | Not lesson content | Content rule | Open |


### al-dar-al-akhera ep26 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep26 (the names of Paradise) | about 42 min (transcript) | ar, en, ur: 1 record extended | 5 new `about` edges | 13 points; qwen3-asr pass5, 30 s windows | needs_source on most points; the opening (ep26 00:00:00-00:01:00); the four doors (00:02:30-00:05:00); the rivers (00:10:00); the Sad and Uthman story (00:19:30-00:21:30); the safe station and sparrow story (00:35:00-00:39:00); the steward story (00:40:00-00:41:30) | run omar-abdelkafy-dar-akhera-19 |

| Excluded (dar-akhera ep26) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep26 00:04:00, 00:07:00, 00:08:30, 00:09:00, 00:09:30, 00:12:30, 00:22:00, 00:24:00, 00:25:30, 00:26:00, 00:29:00, 00:30:30 | Not speech | Loop check | Open |
| Garbled passages | ep26 00:05:30-00:09:00 (modern analogies), 00:11:00-00:11:30, 00:13:00-00:15:00, 00:22:30-00:31:30 (anecdotes about Ali and Fatima), 00:31:30-00:32:30, 00:33:30-00:34:00, 00:36:00-00:37:00 | Not recoverable as clear Arabic | Clarity | Open |
| Closing remarks and personal health | ep26 00:41:30-00:42:00 | Not lesson content | Content rule | Open |


### al-dar-al-akhera ep27 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep27 (the servants of the Merciful, major sins) | about 44 min (transcript) | ar, en, ur: 1 record extended | 3 new `about` edges | 10 points; qwen3-asr pass5, 30 s windows | needs_source on most points; the opening story (ep27 00:00:00-00:00:30); the man brought for drinking (00:06:30-00:07:00); the list of the tongue's sins (00:22:30-00:23:00); the hadiths on killing (00:30:00-00:32:00); the years of the poor's head start (00:40:00, 00:42:30) | run omar-abdelkafy-dar-akhera-20 |

| Excluded (dar-akhera ep27) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep27 00:01:00, 00:03:00, 00:06:00 (partial), 00:07:30, 00:08:00, 00:12:00, 00:16:30, 00:18:00, 00:18:30, 00:24:00, 00:25:30, 00:33:30 (partial), 00:36:00, 00:38:00, 00:39:00 | Not speech | Loop check | Open |
| Garbled passages | ep27 00:01:30-00:04:00, 00:05:30-00:06:00, 00:08:30-00:09:00, 00:11:00-00:12:00, 00:15:00-00:16:30, 00:20:00-00:22:00, 00:24:30-00:28:00, 00:33:00-00:34:30, 00:35:00-00:38:30, 00:40:30-00:42:00 | Not recoverable as clear Arabic | Clarity | Open |
| Supplications, thanks and publisher and telephone line | ep27 00:43:00-00:44:00 | Not lesson content | Content rule | Open |


### al-dar-al-akhera ep28 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep28 (the servants of the Merciful, part 2) | about 47 min (transcript) | ar, en, ur: 1 record extended | 3 new `about` edges | 14 points; qwen3-asr pass5, 30 s windows | needs_source on most points; the Bedouin story (ep28 00:01:00-00:01:30); the report on Yemen and the 1960s story (00:11:00-00:13:00); the abortion and adultery rulings are his opinion (00:05:00-00:07:30, 00:14:30-00:16:30); the valley of Athama (00:21:00-00:23:00); the Shurayh story details (00:23:30-00:28:30); the three qualities of kindness (00:44:00) | run omar-abdelkafy-dar-akhera-21 |

| Excluded (dar-akhera ep28) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep28 00:00:00, 00:02:30, 00:08:00, 00:17:00, 00:27:00, 00:29:00, 00:32:00, 00:32:30, 00:34:30, 00:41:30, 00:42:30 | Not speech | Loop check | Open |
| Garbled passages | ep28 00:00:30, 00:02:00, 00:13:30-00:14:00 (a quoted poem, not reproduced), 00:25:00-00:25:30, 00:33:00-00:35:00, 00:35:00-00:36:00, 00:41:00 | Not recoverable as clear Arabic | Clarity | Open |
| Announcements about travel and the next lecture, requests for supplication | ep28 00:46:30-00:47:00 | Not lesson content | Content rule | Open |


### al-dar-al-akhera ep29 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep29 (scenes of Paradise in the suras) | about 43 min (transcript) | ar, en, ur: 1 record extended | 3 new `about` edges | 13 points; qwen3-asr pass5, 30 s windows | needs_source on most points; the opening (ep29 00:00:00-00:00:30); the kindness report (00:10:30-00:11:30); the report of the dipping (00:15:30-00:18:00); the gardens of Paradise answer (00:28:00-00:29:00); the martyr extensions (00:31:00); the name of Habib (00:37:30-00:40:00) | run omar-abdelkafy-dar-akhera-22 |

| Excluded (dar-akhera ep29) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep29 00:05:30, 00:10:00, 00:18:30 (partial), 00:19:30, 00:21:30, 00:22:30, 00:27:00, 00:30:00, 00:32:30, 00:33:00, 00:33:30 (partial), 00:34:30, 00:38:00, 00:41:30 | Not speech | Loop check | Open |
| Garbled passages | ep29 00:01:00-00:02:30, 00:04:30-00:07:00, 00:08:30-00:10:00 (a quoted aside about wives), 00:18:00-00:20:30 (anecdotes), 00:29:30, 00:32:00-00:33:00, 00:36:00-00:37:00 | Not recoverable as clear Arabic | Clarity | Open |
| A greeting to a political party, a reply to a questioner about a relative, a personal remark, and the publisher and telephone line | ep29 00:40:00-00:43:00 | Not lesson content | Content rule | Open |


### al-dar-al-akhera ep30 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep30 (the believer of Pharaoh's household, scenes of Paradise) | about 40 min (transcript) | ar, en, ur: 1 record extended | 1 new `about` edge | 15 points; qwen3-asr pass5, 30 s windows | needs_source on most points; the explanation of excess (ep30 00:00:00-00:01:00); the worst-theft report (00:01:00-00:02:00); the desert parable (00:14:30-00:16:30); the dialogue between mother and son (00:09:30-00:10:30); the gold and silver comment (00:32:30-00:33:30) | run omar-abdelkafy-dar-akhera-23 |

| Excluded (dar-akhera ep30) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep30 00:02:30, 00:04:00, 00:06:00, 00:09:00, 00:12:00 (partial), 00:19:00, 00:20:00, 00:22:00, 00:22:30, 00:23:00, 00:29:00, 00:34:00, 00:35:30, 00:36:30 | Not speech | Loop check | Open |
| Garbled passages | ep30 00:05:00-00:06:30, 00:12:30-00:13:00, 00:20:30-00:21:30, 00:25:00-00:26:00, 00:32:00, 00:34:30-00:35:30, 00:36:00-00:36:30 (partial) | Not recoverable as clear Arabic | Clarity | Open |
| Political and personal digressions (a teacher's anecdote about schools in North Africa, remarks on movements and events of the time) | ep30 00:06:30-00:07:30 | Modern political commentary, not lesson content; kept out of the record | Content rule | Open |
| Announcements, a questioner about fasting and the publisher and telephone line | ep30 00:37:30-00:40:00 | Not lesson content | Content rule | Open |


### al-dar-al-akhera ep31 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep31 (joining ties, patience, Abraham, the Event) | about 40 min (transcript) | ar, en, ur: 1 record extended | 3 new `about` edges | 16 points; qwen3-asr pass5, 30 s windows | needs_source on most points; the reports on cutting kinship (ep31 00:00:30-00:02:00); the report of the seven in God's shade (00:05:00-00:05:30); the Aisha report (00:12:00, 00:13:30); the Abu Hanifa story (00:14:30-00:15:30); the Ridwan report (00:29:30-00:30:30); the answers to questions (00:36:00-00:39:00) | run omar-abdelkafy-dar-akhera-24 |

| Excluded (dar-akhera ep31) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep31 00:04:00, 00:08:30, 00:11:30, 00:14:00, 00:19:30, 00:26:00, 00:31:00, 00:32:30, 00:38:00 | Not speech | Loop check | Open |
| Garbled passages | ep31 00:00:00, 00:06:00-00:10:00 (stories of a shaykh and a sick man), 00:11:00-00:12:30 (Shafii aside, not reproduced), 00:12:30-00:13:30, 00:19:00-00:20:30, 00:26:30-00:27:00, 00:33:30-00:34:30, 00:37:00-00:38:30 | Not recoverable as clear Arabic | Clarity | Open |
| Closing supplications, questions about parents and a vow, and the publisher and telephone line | ep31 00:34:30-00:37:30, 00:39:30-00:40:00 | Not lesson content or private; kept general | Content rule | Open |


### al-dar-al-akhera ep32 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep32 (scenes of Paradise in four suras) | about 31 min (transcript, very garbled) | ar, en, ur: 1 record extended | 1 new `about` edge | 9 points; qwen3-asr pass5, 30 s windows | needs_source on every point; the dying scene (ep32 00:00:30-00:02:30); the three kinds (00:07:00-00:07:30); the glorification report (00:08:00); the days gone by (00:11:00-00:13:30); the Abu Dharr exchange (00:28:00) | run omar-abdelkafy-dar-akhera-25 |

| Excluded (dar-akhera ep32) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep32 00:03:00, 00:04:00, 00:04:30, 00:05:00, 00:06:30, 00:10:30, 00:12:00, 00:14:30, 00:16:30, 00:18:00, 00:18:30, 00:19:30, 00:21:00, 00:21:30, 00:23:00, 00:23:30, 00:26:30, 00:30:00, 00:30:30 | Not speech | Loop check | Open |
| Garbled passages | ep32 00:00:00 (partial), 00:03:30, 00:05:30-00:06:30, 00:08:30-00:10:30, 00:11:30, 00:14:30-00:16:00, 00:17:00-00:17:30, 00:20:00-00:21:00, 00:24:30-00:25:00, 00:26:00, 00:28:30-00:29:30, 00:31:00 | Not recoverable as clear Arabic | Clarity | Open |
| Prices and quantities quoted for a perfume | ep32 00:17:00 | Unverifiable and garbled | Clarity | Open |

Resume point: episode 33 (branch from origin/main). The recording ends at 00:31:00 with no closing in the transcript.

### al-dar-al-akhera ep33 (12 Nov 2026)

| Recording | Duration | Prose | New / extended | Claims (rows) | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-dar-al-akhera ep33 (the sura of the Human, a description of Paradise, the vision) | about 42 min (transcript) | ar, en, ur: 1 record extended | 3 new `about` edges | 14 points; qwen3-asr pass5, 30 s windows | needs_source on most points; the opening (ep33 00:00:00-00:01:30); the report on voluntary acts (00:07:30-00:08:00); the Sad ibn Muadh report (00:17:00-00:17:30); the unnamed text read aloud (00:28:00-00:30:30); the call to the people of Paradise and the vision (00:31:00-00:37:00) | run omar-abdelkafy-dar-akhera-26 |

| Excluded (dar-akhera ep33) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops | ep33 00:02:30, 00:03:00, 00:06:30, 00:09:30, 00:11:00, 00:13:00, 00:15:00 (partial), 00:18:30, 00:19:00, 00:19:30, 00:24:00, 00:29:00, 00:33:30, 00:34:00 (partial), 00:36:00, 00:37:00 (partial), 00:38:00-00:40:30 | Not speech | Loop check | Open |
| Garbled passages | ep33 00:02:00, 00:04:30-00:05:30, 00:08:30-00:13:00, 00:14:30-00:15:30, 00:18:00 (a letter of Umar, details unclear), 00:20:00, 00:25:30 (diacritised ASR output unrelated to speech), 00:27:30 | Not recoverable as clear Arabic | Clarity | Open |
| Closing supplications, the publisher and telephone line | ep33 00:37:30, 00:41:00-00:42:00 | Not lesson content | Content rule | Open |

Resume point: the 33 harvested episodes (01 to 33) are all written. The lecturer announces two further summary episodes in ep33 00:40:00; they are not in the harvest. Branch from origin/main for any follow-up.

### ahl-al-hikma ep01-ep04 (12 Nov 2026)

New record work/ahl-al-hikma (27 episodes in the harvest, 81 files); episodes 1 to 4 written (ar, en, ur). Decision dec-20261112-265 (sensitivity: contested). 31 points; needs_source on reports without a chain and on garbled stretches.

| Excluded (ahl-al-hikma ep01-04) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Presenter's greetings, thanks, break announcements, closing supplications and sign-offs | ep01 00:00:00-00:02:00, 00:08:30-00:09:30, 00:16:30-00:17:30; ep02 00:06:30, 00:14:30-00:15:30; ep03 00:00:00-00:00:30, 00:09:00-00:09:30, 00:15:30-00:16:30; ep04 00:00:00-00:00:30, 00:11:30-00:12:00, 00:15:00-00:15:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep01 00:08:00, 00:12:00; ep04 00:02:00 (a long repeated letter), 00:07:00-00:08:30 (a marriage-bargaining dialogue, garbled), 00:09:30-00:10:00 | Not speech or not recoverable | Loop check, Clarity | Open |
| A Ramadan-end prayer-time anecdote and two mosque-attendance remarks | ep04 00:11:00-00:11:30 | Garbled | Clarity | Open |

Resume point: ahl-al-hikma episode 5 (branch from origin/main).

### ahl-al-hikma ep05-ep08 (12 Nov 2026)

31 points written for episodes 5 to 8 (ar, en, ur); 11 new `about` edges; needs_source on reports without a chain and on garbled stretches.

| Excluded (ahl-al-hikma ep05-08) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Presenter's greetings, thanks, break announcements, closing supplications and sign-offs | ep05 00:00:00, 00:07:30-00:08:00, 00:15:00-00:15:30; ep06 00:00:00, 00:08:30-00:09:00, 00:15:00-00:16:00; ep07 00:00:00, 00:09:00-00:09:30, 00:16:00-00:17:00; ep08 00:07:00-00:07:30, 00:15:00-00:15:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep05 00:05:30-00:06:30 (a family anecdote), 00:10:00-00:11:30 partial; ep06 00:06:00-00:08:00, 00:11:30-00:12:30, 00:14:30; ep07 00:03:30-00:04:00, 00:06:00-00:06:30, 00:10:00-00:10:30, 00:13:30, 00:16:30; ep08 00:00:00 (loop), 00:01:30-00:02:00, 00:09:30-00:10:30, 00:11:30-00:12:30 | Not speech or not recoverable | Loop check, Clarity | Open |

Resume point: ahl-al-hikma episode 9 (branch from origin/main).

### al-manjeyat, episode 16 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-manjeyat-4)

Episode 16 read in full (23 min of transcript) before writing. 9 points written (ar, en, ur); new `about` edges for the people and passages named; 8 needs_source (unchained accounts, sayings and hadiths in sense, rulings without evidence, garbled text).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-manjeyat ep16 (humility) | about 23 min (transcript) | ar, en, ur: work/al-manjeyat extended, 9 points | new `about` edges | 9 | 8 needs_source | this PR |

Next step: episode 17.

| Excluded (al-manjeyat ep16) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, closing formulae | ep16 00:00:00, 00:22:30–00:23:00 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep16 00:13:30–00:14:00, 00:18:30–00:19:00, 00:08:00–00:08:30 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Verses of poetry quoted | ep16 00:09:30–00:10:00 | Not reproduced | Sources policy | Open |
| Hadith and saying wording | ep16 00:02:30–00:04:30, 00:10:00–00:13:30, 00:16:00–00:18:30 | Wording not typed; by sense only | Hadith rule | Open |

### al-manjeyat, episode 17 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-manjeyat-5)

Episode 17 read in full (23 min of transcript) before writing. 8 points written (ar, en, ur); new `about` edges for the people and passages named; 6 needs_source (unchained accounts and sayings and hadiths in sense, an unsourced statistic).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-manjeyat ep17 (the value of time) | about 23 min (transcript) | ar, en, ur: work/al-manjeyat extended, 8 points | new `about` edges | 8 | 6 needs_source | this PR |

Next step: episode 18.

| Excluded (al-manjeyat ep17) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, closing formulae | ep17 00:00:00–00:01:00, 00:22:30–00:23:00 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep17 00:04:30–00:05:00, 00:18:30–00:19:00 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Verses of poetry quoted | ep17 00:18:30–00:19:00 | Not reproduced | Sources policy | Open |
| Hadith and saying wording | ep17 00:03:30–00:04:00, 00:09:00–00:11:00, 00:16:00–00:17:30, 00:21:00–00:21:30 | Wording not typed; by sense only | Hadith rule | Open |

### al-manjeyat, episode 18 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-manjeyat-6)

Episode 18 read in full (23 min of transcript) before writing. 4 points written (ar, en, ur); new `about` edges for the people and passages named; 4 needs_source (it is a duplicate recording and the unchained accounts and sayings of episode 17 recur).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-manjeyat ep18 (the value of time (second recording)) | about 23 min (transcript) | ar, en, ur: work/al-manjeyat extended, 4 points | new `about` edges | 4 | 4 needs_source | this PR |

Next step: episode 19.

| Excluded (al-manjeyat ep18) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Whole episode as a duplicate recording | ep18 00:00:00–00:23:00 | Same lecture as episode 17 by comparison of the transcripts; the points are recorded once in summary, not re-expanded | Duplication | Open |
| Openings, greetings, supplications, closing formulae | ep18 00:00:00–00:01:00, 00:22:30–00:23:00 | Not lesson content | Content rule | Open |
| Repetition loops | ep18 00:04:30–00:05:00 | Not speech | Loop check | Open |

### ahl-al-hikma ep09-ep12 (12 Nov 2026)

34 points written for episodes 9 to 12 (ar, en, ur); needs_source on reports without a chain and on garbled stretches.

| Excluded (ahl-al-hikma ep09-12) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Presenter's greetings, break announcements, closing supplications and sign-offs | ep09 00:00:00, 00:09:00, 00:15:00-00:16:00; ep10 00:00:00-00:01:00, 00:06:30-00:07:00, 00:16:00-00:17:00; ep11 00:00:00-00:01:00, 00:09:00-00:09:30, 00:16:00-00:17:00; ep12 00:00:00-00:00:30, 00:07:30-00:08:00, 00:15:30-00:17:00 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep09 00:07:30-00:09:00 (an aside on school teachers), 00:14:00-00:15:00; ep10 00:03:30-00:04:30, 00:06:00-00:06:30 (a tangent on the Throne), 00:08:00-00:09:00, 00:12:00-00:13:00; ep11 00:02:00-00:03:30, 00:07:30-00:08:00, 00:15:00-00:16:00; ep12 00:06:30 (a repeated verse), 00:12:00-00:13:30 | Not speech or not recoverable | Loop check, Clarity | Open |

Resume point: ahl-al-hikma episode 13 (branch from origin/main).
### al-manjeyat, episode 19 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-manjeyat-7)

Episode 19 read in full (25 min of transcript) before writing. 7 points written (ar, en, ur); new `about` edges for the people and passages named; 5 needs_source (unchained hadiths in sense, unsourced figures and unnamed Western scholars).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-manjeyat ep19 (praiseworthy and blameworthy character) | about 25 min (transcript) | ar, en, ur: work/al-manjeyat extended, 7 points | new `about` edges | 7 | 5 needs_source | this PR |

Next step: episode 20.

| Excluded (al-manjeyat ep19) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, closing formulae | ep19 00:00:00–00:00:30, 00:24:00–00:24:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep19 00:03:00–00:03:30, 00:04:30–00:05:00, 00:09:30, 00:13:30–00:14:30, 00:15:00–00:15:30, 00:17:30, 00:19:00–00:20:00, 00:20:30 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Hadith wording | ep19 00:04:00–00:06:30, 00:12:00–00:14:30 | Wording not typed; by sense only | Hadith rule | Open |

### ahl-al-hikma ep13-ep16 (12 Nov 2026)

19 points written for episodes 13 to 16 (ar, en, ur); needs_source on reports without a chain and on garbled stretches.

| Excluded (ahl-al-hikma ep13-16) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Presenter's greetings, break announcements, closing supplications and sign-offs | ep13 00:00:00-00:00:30, 00:08:30-00:09:00, 00:14:30-00:15:30; ep14 00:00:00-00:01:00, 00:08:00, 00:14:30-00:15:00; ep15 00:00:00-00:00:30, 00:07:00, 00:13:30-00:14:00; ep16 00:00:00, 00:08:00-00:08:30, 00:15:00-00:16:00 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep13 00:07:30-00:08:30 (a worldly aside), 00:11:00-00:12:00; ep14 00:03:30-00:04:30 (partial), 00:08:00-00:10:00 (naming children, garbled), 00:13:30-00:14:30; ep15 00:05:30-00:07:00, 00:12:30-00:13:30; ep16 00:04:30, 00:11:00-00:12:00, 00:15:00 | Not speech or not recoverable | Loop check, Clarity | Open |

Resume point: ahl-al-hikma episode 17 (branch from origin/main).

### al-manjeyat, episode 20 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-manjeyat-8)

Episode 20 read in full (24 min of transcript) before writing. 8 points written (ar, en, ur); new `about` edges for the people and passages named; 6 needs_source (unchained accounts and hadiths in sense, unsourced claims and a garbled passage).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-manjeyat ep20 (praiseworthy character) | about 24 min (transcript) | ar, en, ur: work/al-manjeyat extended, 8 points | new `about` edges | 8 | 6 needs_source | this PR |

Next step: episode 21.

| Excluded (al-manjeyat ep20) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, closing formulae | ep20 00:00:00–00:01:00, 00:23:00–00:23:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep20 00:13:00, 00:19:00–00:20:00 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Hadith and saying wording | ep20 00:05:30–00:06:30, 00:09:30–00:10:00 | Wording not typed; by sense only | Hadith rule | Open |

### al-manjeyat, episode 21 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-manjeyat-9)

Episode 21 read in full (25 min of transcript) before writing. 6 points written (ar, en, ur); new `about` edges for the people and passages named; 5 needs_source (unchained accounts and hadiths in sense, an estimate and a ruling without evidence).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-manjeyat ep21 (generosity and pardon) | about 25 min (transcript) | ar, en, ur: work/al-manjeyat extended, 6 points | new `about` edges | 6 | 5 needs_source | this PR |

Next step: episode 22.

| Excluded (al-manjeyat ep21) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, closing formulae | ep21 00:00:00–00:01:00, 00:24:00–00:24:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep21 00:04:30–00:05:00, 00:11:30–00:12:30, 00:17:00–00:17:30 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Hadith and saying wording | ep21 00:05:30–00:07:00, 00:09:30–00:10:00 | Wording not typed; by sense only | Hadith rule | Open |

### al-manjeyat, episode 22 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-manjeyat-10)

Episode 22 read in full (24 min of transcript) before writing. 7 points written (ar, en, ur); new `about` edges for the people and passages named; 6 needs_source (scientific and medical claims and figures without source, unchained hadiths and accounts in sense, a ruling without evidence).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-manjeyat ep22 (reflecting on God's favours in the body) | about 24 min (transcript) | ar, en, ur: work/al-manjeyat extended, 7 points | new `about` edges | 7 | 6 needs_source | this PR |

Next step: episode 23.

| Excluded (al-manjeyat ep22) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, closing formulae | ep22 00:00:00–00:01:00, 00:23:30–00:24:00 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep22 00:02:30–00:03:00, 00:20:30–00:21:00 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Scientific and medical figures | ep22 00:03:00–00:12:00, 00:17:30–00:22:00 | Unverifiable and some garbled; recorded as the lecturer's claims and marked needs_source | Sources policy | Open |
