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

### al-manjeyat, episode 23 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-manjeyat-11)

Episode 23 read in full (24 min of transcript) before writing. 6 points written (ar, en, ur); new `about` edges for the people and passages named; 4 needs_source (unchained sayings and stories, medical and scientific figures and claims without source).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-manjeyat ep23 (the favour of hearing) | about 24 min (transcript) | ar, en, ur: work/al-manjeyat extended, 6 points | new `about` edges | 6 | 4 needs_source | this PR |

Next step: episode 24.

| Excluded (al-manjeyat ep23) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, closing formulae | ep23 00:00:00–00:01:00, 00:23:30–00:24:00 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep23 00:08:30–00:09:00, 00:17:30–00:18:00, 00:20:30 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Scientific and medical figures | ep23 00:07:30–00:17:30 | Unverifiable; recorded as the lecturer's claims and marked needs_source | Sources policy | Open |

### al-manjeyat, episode 24 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-manjeyat-12)

Episode 24 read in full (24 min of transcript) before writing. 6 points written (ar, en, ur); new `about` edges for the people and passages named; 4 needs_source (scientific and medical figures and claims without source, a hadith in sense without a chain).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-manjeyat ep24 (thanking for favours and the body's make-up) | about 24 min (transcript) | ar, en, ur: work/al-manjeyat extended, 6 points | new `about` edges | 6 | 4 needs_source | this PR |

Next step: episode 25.

| Excluded (al-manjeyat ep24) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, closing formulae | ep24 00:00:00–00:01:30, 00:23:30–00:24:00 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep24 00:03:00, 00:05:00–00:05:30, 00:06:00–00:06:30, 00:07:30–00:08:00, 00:22:30 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Scientific and medical figures | ep24 00:03:30–00:22:00 | Unverifiable and partly garbled; recorded as the lecturer's claims, mostly without figures, and marked needs_source | Sources policy | Open |

### al-manjeyat, episode 25 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-manjeyat-13)

Episode 25 read in full (24 min of transcript) before writing. 5 points written (ar, en, ur); new `about` edges for the people and passages named; 4 needs_source (scientific, medical and statistical claims without source, hadiths in sense, a saying without a place).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-manjeyat ep25 (managing and balance in God's favours) | about 24 min (transcript) | ar, en, ur: work/al-manjeyat extended, 5 points | new `about` edges | 5 | 4 needs_source | this PR |

Next step: episode 26.

| Excluded (al-manjeyat ep25) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, closing formulae | ep25 00:00:00–00:01:00, 00:23:00–00:23:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep25 00:04:30–00:05:00, 00:12:00, 00:15:30–00:16:00 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Scientific and medical figures | ep25 00:06:30–00:23:00 | Unverifiable; recorded as the lecturer's claims and marked needs_source | Sources policy | Open |

### al-manjeyat, episode 26 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-manjeyat-14)

Episode 26 read in full (24 min of transcript) before writing. 6 points written (ar, en, ur); new `about` edges for the people and passages named; 5 needs_source (unchained accounts and hadiths in sense, unsourced claims about the angels, smoking and the reckoning of years).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-manjeyat ep26 (the Night of Power) | about 24 min (transcript) | ar, en, ur: work/al-manjeyat extended, 6 points | new `about` edges | 6 | 5 needs_source | this PR |

Next step: episode 27.

| Excluded (al-manjeyat ep26) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, closing formulae | ep26 00:00:00–00:01:30, 00:23:00–00:24:00 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep26 00:14:00, 00:07:30, 00:18:30 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Poetry quoted | ep26 00:18:30–00:19:00, 00:20:00 | Not reproduced | Sources policy | Open |

### al-manjeyat, episode 27 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-manjeyat-15)

Episode 27 read in full (24 min of transcript) before writing. 6 points written (ar, en, ur); new `about` edges for the people and passages named; 5 needs_source (scientific claims without source, unchained accounts and hadiths in sense, rulings without evidence).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-manjeyat ep27 (the biological clock and repentance) | about 24 min (transcript) | ar, en, ur: work/al-manjeyat extended, 6 points | new `about` edges | 6 | 5 needs_source | this PR |

Series complete: episode 27 is the last episode of al-manjeyat.

| Excluded (al-manjeyat ep27) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, closing formulae | ep27 00:00:00–00:01:00, 00:23:00–00:23:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep27 00:03:30, 00:07:30–00:08:30, 00:10:30–00:11:00, 00:15:30–00:16:00, 00:16:30 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Hadith wording | ep27 00:18:30–00:19:30 | Wording not typed; by sense only | Hadith rule | Open |

### ahl-al-hikma ep17-ep20 (12 Nov 2026)

25 points written for episodes 17 to 20 (ar, en, ur); needs_source on reports without a chain and on garbled stretches.

| Excluded (ahl-al-hikma ep17-20) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Presenter's greetings, break announcements, closing supplications and sign-offs | ep17 00:00:00, 00:06:30-00:07:00, 00:14:00-00:15:00; ep18 00:00:00, 00:07:30-00:08:00, 00:16:00-00:17:00; ep19 00:00:00-00:00:30, 00:08:30-00:09:00, 00:15:30-00:16:00; ep20 00:00:00, 00:06:30-00:07:00, 00:14:00-00:14:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep17 00:05:30-00:06:30 (partial), 00:13:00-00:14:00; ep18 00:11:00-00:12:30, 00:14:00-00:14:30 (a story partly unreadable); ep19 00:06:00-00:07:30, 00:08:00, 00:13:00-00:13:30; ep20 00:03:30-00:04:30 (a rural anecdote), 00:06:30-00:07:00, 00:11:30-00:12:30 | Not speech or not recoverable | Loop check, Clarity | Open |

Resume point: ahl-al-hikma episode 21 (branch from origin/main).

### ahl-al-hikma ep21-ep24 (12 Nov 2026)

42 points written for episodes 21 to 24 (ar, en, ur); 40 needs_source marks on reports without a chain and on garbled stretches. Quran verses referenced only through passage links (18-23, 18-24, 12-15, 12-20, 12-35, 3-123, 9-60); none typed.

| Excluded (ahl-al-hikma ep21-24) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Presenter's greetings, break announcements, opening Quran recitation, closing supplications and sign-offs | ep21 00:00:00-00:00:30, 00:08:30-00:09:00, 00:14:30-00:15:30; ep22 00:00:00-00:00:30, 00:07:30-00:08:00, 00:14:30; ep23 00:00:00-00:01:00, 00:08:30-00:09:00, 00:16:30-00:17:00; ep24 00:00:00-00:01:00, 00:09:00-00:09:30, 00:16:00-00:17:00 | Not lesson content (the recitations are Quran text, never typed) | Content rule, Quran rule | Open |
| Repetition loops, stray non-Arabic characters and garbled windows | ep21 00:01:00-00:01:30 (mixed-language lines), 00:04:00 (loop), 00:06:00 (a family anecdote), 00:14:30 (loop); ep22 00:00:30 (loop), 00:14:00 (loop); ep23 00:17:30-00:18:00 (stray characters), 00:11:00-00:11:30 (an anecdote about Umar and Ibn Abbas); ep24 00:05:30 (loop), 00:12:30 (loop), 00:14:00 (loop), 00:17:00-00:18:00 (stray characters) | Not speech or not recoverable | Loop check, Clarity | Open |
| Political jests and asides about national affairs | ep24 00:11:30-00:12:00; ep23 00:14:00-00:14:30 (a remark on Egyptians and Israelites in the Qarun passage) | Garbled and not a lesson claim; the clear remarks are recorded as his opinion elsewhere | Clarity | Open |

### ahl-al-hikma ep25-ep27 (12 Nov 2026)

29 points written for episodes 25 to 27 (ar, en, ur); 23 needs_source marks. Series complete: episode 27 is the last of 27. Episode 25 is a near-duplicate of episode 24 (same aphorism and the same talk in both transcripts); it is written as a short repeat section with its own timestamps and flagged needs_source for the duplicate inference (not checked by listening). Proposal for the founder, not applied: ep27 00:02:00-00:03:00 holds a sweeping unsourced remark about the Shia and the Khawarij; the record stays `sensitivity: contested` and the remark is described, not reproduced, as his claim.

| Excluded (ahl-al-hikma ep25-27) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Presenter's greetings, break announcements, opening Quran recitation, closing supplications and sign-offs | ep25 00:00:00-00:00:30, 00:08:00-00:08:30, 00:14:30-00:15:30; ep26 00:00:00-00:00:30, 00:08:30-00:09:00, 00:15:00-00:16:00; ep27 00:00:00-00:01:00, 00:10:00-00:10:30, 00:16:00-00:17:00 | Not lesson content (the recitation is Quran text, never typed) | Content rule, Quran rule | Open |
| Repetition loops and garbled windows | ep25 00:04:30 (loop), 00:09:30 (loop); ep26 00:05:30-00:06:00 (loop), 00:11:00-00:11:30 (loop), 00:14:00 (partial loop); ep27 00:01:30 (long loop), 00:03:30 (partial loop), 00:05:00 (partial loop), 00:09:00 (loop), 00:14:30 (loop) | Not speech or not recoverable | Loop check, Clarity | Open |
| Repeated stretches already written in episode 24 | ep25 00:02:00-00:08:30 (parts), 00:11:30-00:14:30 | Same content as ep24, not duplicated beyond the repeat section | Duplication | Open |
| National-pride aside on the Egyptian army | ep27 00:11:00-00:11:30 | Not a lesson claim | Content rule | Open |

### al-naba-al-safi, episode 4 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-naba-al-safi-1)

Episode 4 read in full (50 min of transcript) before writing. 12 points written (ar, en, ur); new `about` edges for the people and passages named; 9 needs_source (unchained hadiths, sayings and accounts in sense, rulings and the ruqya procedure without evidence).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-naba-al-safi ep4 (the trust of the word and divination channels) | about 50 min (transcript) | ar, en, ur: work/al-naba-al-safi extended, 12 points | new `about` edges | 12 | 9 needs_source | this PR |

Next step: episode 5.

| Excluded (al-naba-al-safi ep4) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae | ep04 00:00:00–00:01:00, 00:22:00–00:22:30, 00:32:30–00:33:30, 00:49:00–00:49:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep04 00:25:00–00:26:00, 00:35:30–00:36:30, 00:22:00 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Eclipse account at the death of the Prophet's son | ep04 00:24:30–00:25:00 | Cut off by a loop; not recorded | Clarity | Open |
| Praise of a state's equal treatment and of a channel's patron | ep04 00:26:30–00:27:30, 00:45:00–00:46:00 | Praise of a state and of a named ruler is not lesson content; not recorded | Content rule | Open |
| Private details of callers | ep04 00:38:30–00:46:00 | Kept general | Privacy | Open |

### al-naba-al-safi, episode 10 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-naba-al-safi-2)

Episode 10 read in full (49 min of transcript) before writing. 12 points written (ar, en, ur); new `about` edges for the people and passages named; 8 needs_source (unchained hadiths, accounts and sayings in sense, rulings without evidence).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-naba-al-safi ep10 (the road to happiness) | about 49 min (transcript) | ar, en, ur: work/al-naba-al-safi extended, 12 points | new `about` edges | 12 | 8 needs_source | this PR |

Next step: episode 11.

| Excluded (al-naba-al-safi ep10) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements, closing formulae and the long closing prayer | ep10 00:00:00–00:01:00, 00:14:00–00:14:30, 00:32:00–00:32:30, 00:46:00–00:48:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep10 00:06:00, 00:13:00, 00:20:00–00:20:30, 00:39:30–00:40:00 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Poetry quoted | ep10 00:22:30, 00:28:00, 00:42:30 | Not reproduced | Sources policy | Open |
| Private details of callers | ep10 00:35:30–00:45:00 | Kept general | Privacy | Open |

### al-naba-al-safi, episode 13 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-naba-al-safi-3)

Episode 13 read in full (47 min of transcript) before writing. 8 points written (ar, en, ur); new `about` edges for the people and passages named; 7 needs_source (unchained sayings, accounts and hadiths in sense, an unsourced statistic).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-naba-al-safi ep13 (grief and worry, their degrees and cure) | about 47 min (transcript) | ar, en, ur: work/al-naba-al-safi extended, 8 points | new `about` edges | 8 | 7 needs_source | this PR |

Next step: episode 14.

| Excluded (al-naba-al-safi ep13) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements and the long closing prayer | ep13 00:00:00–00:01:00, 00:16:00–00:16:30, 00:32:30–00:33:00, 00:43:30–00:46:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep13 00:03:00, 00:12:00–00:12:30, 00:17:30–00:18:00, 00:30:00, 00:37:30, 00:38:00–00:38:30 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Remarks on a storm near the country and driving speed | ep13 00:18:00–00:19:00, 00:32:00–00:32:30 | Topical asides, not lesson content | Content rule | Open |
| Poetry quoted | ep13 00:31:00–00:31:30 | Not reproduced | Sources policy | Open |

### ajaeb-al-kulub ep01-ep04 (12 Nov 2026)

New record work/ajaeb-al-kulub (29 episodes in the harvest, 87 files, about seven minutes each); episodes 1 to 4 written (ar, en, ur). Decision dec-20261112-267 (sensitivity: contested). 38 points; 13 needs_source marks on reports without a chain, statistics without a source and garbled wording. Quran verses referenced only through passage links (5-27, 12-15, 41-34, 113-1, 114-1); none typed.

| Excluded (ajaeb-al-kulub ep01-04) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greetings, announcements and closing supplications | ep01 00:00:00, 00:07:00; ep02 00:00:00, 00:05:30; ep03 00:00:00 (greeting), 00:05:30; ep04 00:00:00, 00:06:30 | Not lesson content | Content rule | Open |
| Repetition loops, stray non-speech and garbled windows | ep02 00:06:00 (non-speech "Oh, oh."); ep03 00:06:00 (a basmala repeated as a loop), 00:02:00 (a long rambling sentence on ethics and faith, only the clear claim kept), 00:03:00 (a half-heard line on living among people); ep04 00:01:00 (a line on Joseph's brothers, garbled), 00:05:00 (a half-clear clause) | Not speech or not recoverable | Loop check, Clarity | Open |

Resume point: ajaeb-al-kulub episode 5 (branch from origin/main).
### al-naba-al-safi, episode 14 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-naba-al-safi-4)

Episode 14 read in full (50 min of transcript) before writing. 11 points written (ar, en, ur); new `about` edges for the people and passages named; 9 needs_source (unchained accounts, hadiths and sayings in sense, rulings without evidence, an unsourced medical claim).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-naba-al-safi ep14 (Ja'far al-Sadiq's counsel to Sufyan) | about 50 min (transcript) | ar, en, ur: work/al-naba-al-safi extended, 11 points | new `about` edges | 11 | 9 needs_source | this PR |

Next step: episode 15.

| Excluded (al-naba-al-safi ep14) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements and the long closing prayer | ep14 00:00:00–00:00:30, 00:14:00–00:14:30, 00:32:00–00:32:30, 00:46:30–00:49:00 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep14 00:04:00, 00:18:00, 00:20:00, 00:30:30, 00:36:30–00:37:00, 00:39:00, 00:41:00–00:41:30 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Poetry quoted | ep14 00:34:30–00:35:00 | Not reproduced | Sources policy | Open |
| Question on bank home ownership | ep14 00:38:00–00:38:30 | Not answered in the recording; not recorded | Clarity | Open |

### al-naba-al-safi, episode 15 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-naba-al-safi-5)

Episode 15 read in full (51 min of transcript) before writing. 11 points written (ar, en, ur); new `about` edges for the people and passages named; 10 needs_source (unchained sayings, hadiths and accounts in sense, rulings and procedures without evidence).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-naba-al-safi ep15 (whoever is given four is not denied four) | about 51 min (transcript) | ar, en, ur: work/al-naba-al-safi extended, 11 points | new `about` edges | 11 | 10 needs_source | this PR |

Next step: episode 16.

| Excluded (al-naba-al-safi ep15) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements and the long closing prayer | ep15 00:00:00–00:00:30, 00:18:00–00:18:30, 00:36:00–00:36:30, 00:48:00–00:50:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep15 00:09:30, 00:16:30–00:17:00, 00:31:00, 00:33:30, 00:35:30 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Caller praise of the channel and advertising remarks | ep15 00:40:00–00:40:30, 00:45:30 | Not lesson content | Content rule | Open |
| Remarks on publishing the lecturer's book | ep15 00:46:30 | Promotional; not recorded | Content rule | Open |

### ajaeb-al-kulub ep05-ep08 (12 Nov 2026)

34 points written for episodes 5 to 8 (ar, en, ur); 18 needs_source marks on reports without a chain, unattributed quotations and verses, and garbled readings; 11 new `about` edges. Quran verses referenced only through passage links (15-40, 12-24, 76-9, 3-175, 55-46, 51-50, 52-7, 3-173); none typed.

| Excluded (ajaeb-al-kulub ep05-08) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greetings, closing supplications and sign-offs | ep05 00:00:00, 00:06:00; ep06 00:00:00, 00:06:00; ep07 00:00:00, 00:08:00 (supplication); ep08 00:00:00, 00:06:00 | Not lesson content | Content rule | Open |
| Repetition loops, non-speech and garbled windows | ep07 00:01:00 (a long loop of one letter after a partly clear definition); ep08 00:06:30 (non-speech "Oh."), 00:03:30 (a half-clear remark on the righteous), 00:04:00 (a half-clear remark on psychological testing); ep05 00:03:00 (a half-clear remark on scholars quoting each other); ep06 00:04:00 (a half-clear sentence before the roadside tree) | Not speech or not recoverable | Loop check, Clarity | Open |

Resume point: ajaeb-al-kulub episode 9 (branch from origin/main).
### al-naba-al-safi, episode 17 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-naba-al-safi-6)

Episode 17 read in full (49 min of transcript) before writing. 9 points written (ar, en, ur); new `about` edges for the people and passages named; 9 needs_source (unchained hadiths, sayings and accounts in sense, an unsourced statistic).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-naba-al-safi ep17 (hastening to good deeds and its four axes) | about 49 min (transcript) | ar, en, ur: work/al-naba-al-safi extended, 9 points | new `about` edges | 9 | 9 needs_source | this PR |

Next step: episode 18.

| Excluded (al-naba-al-safi ep17) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, supplications, break announcements and the long closing prayer | ep17 00:00:00–00:00:30, 00:19:00–00:19:30, 00:34:00–00:34:30, 00:46:30–00:49:00 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep17 00:05:00, 00:17:00, 00:23:30, 00:36:30, 00:48:30 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Poetry quoted | ep17 00:42:00–00:44:30 | Not reproduced | Sources policy | Open |

### ajaeb-al-kulub ep09-ep12 (12 Nov 2026)

32 points written for episodes 9 to 12 (ar, en, ur); 18 needs_source marks; 12 new `about` edges. Episode 11 is a near-duplicate of episode 10 (the two transcripts match almost word for word): it is written as a short repeat section with its own timestamps and flagged needs_source, the cause (duplicate recording or repeated talk) not checked by listening. Proposal for the founder, not applied: ep09 00:01:00 holds the lecturer's claim that taking anxiety medicine shows reliance has left the heart; the record stays `sensitivity: contested`, and the claim is described as his opinion, not medical advice. Quran verses referenced only through passage links (3-173, 14-37, 5-23, 65-3, 21-69, 7-146, 40-35, 16-23, 2-34); none typed.

| Excluded (ajaeb-al-kulub ep09-12) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greetings, closing supplications and sign-offs | ep09 00:00:00, 00:05:30 (supplication), 00:06:00; ep10 00:00:00, 00:05:30 (supplication); ep11 00:00:00, 00:05:30; ep12 00:00:00, 00:05:30 (supplication) | Not lesson content | Content rule | Open |
| Repetition loops, non-speech and garbled windows | ep11 00:04:30 (a very long loop of one letter); ep10 00:04:30 (a short loop); ep12 00:06:00 (non-speech "Oh."), 00:02:30 (a half-clear remark on trailing garments); ep09 00:03:00 (a half-clear sentence on money and houses) | Not speech or not recoverable | Loop check, Clarity | Open |
| Repeated stretches of episode 10 | ep11 00:00:00-00:06:00 (written once as a short repeat section) | Same content as ep10 | Duplication | Open |

Resume point: ajaeb-al-kulub episode 13 (branch from origin/main).

### ajaeb-al-kulub ep13-ep16 (12 Nov 2026)

30 points written for episodes 13 to 16 (ar, en, ur); 16 needs_source marks; 13 new `about` edges. Quran verses referenced only through passage links (32-8, 5-54, 25-70, 20-84, 12-24, 26-89, 18-18); none typed.

| Excluded (ajaeb-al-kulub ep13-16) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greetings, closing supplications and sign-offs | ep13 00:00:00, 00:06:00; ep14 00:00:00, 00:06:00 (supplication); ep15 00:00:00, 00:06:00; ep16 00:00:00 (greeting), 00:06:00 (supplication) | Not lesson content | Content rule | Open |
| Repetition loops, non-speech and garbled windows | ep14 00:01:00 (a very long loop of one letter in the middle of the camel narration), 00:06:30 (non-speech "Oh."), 00:04:00 (a half-clear remark on the book hung on the neck); ep15 00:01:00 (a loop and a half-clear description of the first branch), 00:03:00 (an aside asking viewers to write along), 00:05:00 (a garbled clause); ep16 00:06:00 (garbled names other than Abu Lahab, including a name read as the grandfather of the Prophet, left out because the reading is unclear) | Not speech or not recoverable | Loop check, Clarity | Open |

Resume point: ajaeb-al-kulub episode 17 (branch from origin/main).
### al-naba-al-safi, episode 18 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-naba-al-safi-7)

Episode 18 read in full (49 min of transcript) before writing. 18 points written (ar, en, ur); new `about` edges for the people and passages named; 16 needs_source (unchained hadiths, sayings and accounts in sense, an unsourced statistic).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-naba-al-safi ep18 (how did you rise, the eight claims in al-Shafi'i's answer) | about 49 min (transcript) | ar, en, ur: work/al-naba-al-safi extended, 18 points | new `about` edges | 18 | 16 needs_source | this PR |

Next step: episode 19.

| Excluded (al-naba-al-safi ep18) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, break announcements, supplications and the long closing prayer | ep18 00:00:00–00:00:30, 00:18:00–00:18:30, 00:33:00–00:33:30, 00:46:30–00:48:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep18 00:02:00, 00:04:30, 00:14:00, 00:22:30, 00:32:00, 00:46:00 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Poetry quoted | ep18 00:24:30–00:25:00, 00:34:00 | Not reproduced | Sources policy | Open |
| Private caller details and an off-topic personal question | ep18 00:39:30–00:44:30 | Generalised; the personal question was deferred by the lecturer | Privacy | Open |

### al-naba-al-safi, episode 19 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-naba-al-safi-8)

Episode 19 read in full (49 min of transcript) before writing. 21 points written (ar, en, ur); new `about` edges for the people and passages named; 15 needs_source (unchained hadiths, sayings and accounts in sense, ages and a verdict without a source).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-naba-al-safi ep19 (the prayer of the righteous and the reasons an answer is delayed) | about 49 min (transcript) | ar, en, ur: work/al-naba-al-safi extended, 21 points | new `about` edges | 21 | 15 needs_source | this PR |

Next step: episode 20.

| Excluded (al-naba-al-safi ep19) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, break announcements, supplications and the long closing prayer | ep19 00:00:00–00:00:30, 00:17:30, 00:35:00, 00:46:30–00:49:00 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep19 00:14:00, 00:20:30, 00:29:30, 00:33:00, 00:37:30, 00:44:30 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Poetry quoted | ep19 00:14:30–00:15:30, 00:35:00–00:36:00 | Not reproduced | Sources policy | Open |
| Private caller details, an interrupted call and an off-topic personal question | ep19 00:39:00–00:44:30 | Generalised or left out; the interrupted call has no usable content | Privacy | Open |

### ajaeb-al-kulub ep17-ep20 (12 Nov 2026)

30 points written for episodes 17 to 20 (ar, en, ur); 17 needs_source marks; 12 new `about` edges. Quran verses referenced only through passage links (41-30, 24-15, 34-13, 2-152, 34-15, 14-7); none typed. A supplication the lecturer attributes to the Prophet at al-Ta'if (ep19) is described, not quoted, and flagged needs_source (no chain, partly garbled).

| Excluded (ajaeb-al-kulub ep17-20) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greetings, closing supplications and sign-offs | ep17 00:00:00, 00:05:30 (supplication); ep18 00:00:00, 00:05:30; ep19 00:00:00, 00:04:30 (supplication); ep20 00:00:00, 00:05:00 (supplication) | Not lesson content | Content rule | Open |
| Repetition loops, non-speech and garbled windows | ep18 00:06:00 (a long run of non-speech "oh"); ep19 00:03:00 (a long loop of one letter after the supplication), 00:05:00 (non-speech); ep17 00:01:30 (a half-clear sentence on avoiding a former companion in the street); ep20 00:03:00 (a half-clear anecdote on a man's health at fifty or sixty) | Not speech or not recoverable | Loop check, Clarity | Open |

Resume point: ajaeb-al-kulub episode 21 (branch from origin/main).
### al-naba-al-safi, episode 20 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-naba-al-safi-9)

Episode 20 read in full (48 min of transcript) before writing. 20 points written (ar, en, ur); new `about` edges for the people and passages named; 16 needs_source (unchained hadiths, sayings and accounts in sense).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-naba-al-safi ep20 (four things that make what you miss of the world not matter, trust and truthful speech) | about 48 min (transcript) | ar, en, ur: work/al-naba-al-safi extended, 20 points | new `about` edges | 20 | 16 needs_source | this PR |

Next step: episode 21.

| Excluded (al-naba-al-safi ep20) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, break announcements, supplications and the long closing prayer | ep20 00:00:00–00:01:30, 00:17:30–00:18:00, 00:35:00–00:35:30, 00:47:00–00:48:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep20 00:02:00, 00:19:30–00:20:30, 00:24:30, 00:26:30, 00:27:30, 00:39:00 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Private caller details, noisy or interrupted calls and an off-topic personal question | ep20 00:37:00–00:40:00, 00:41:30–00:44:30 | Generalised or left out | Privacy | Open |

### ajaeb-al-kulub ep21-ep24 (12 Nov 2026)

30 points written for episodes 21 to 24 (ar, en, ur); 15 needs_source marks; 7 new `about` edges. Quran verses referenced only through passage links (49-7, 18-110, 39-53, 59-10, 59-9, 36-20, 36-26); none typed. Proposal for the founder, not applied: ep22 00:03:00 holds the lecturer's judgement that a person who misses the dawn prayer is of little worth to God; it is described as his opinion, the record stays `sensitivity: contested`.

| Excluded (ajaeb-al-kulub ep21-24) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greetings, closing supplications and sign-offs | ep21 00:00:00 (a closing supplication belonging to the previous episode), 00:05:30; ep22 00:00:00, 00:05:00; ep23 00:00:00, 00:05:30 (supplication); ep24 00:05:30 (supplication), 00:06:00 | Not lesson content | Content rule | Open |
| Sponsor and promotional lines naming a museum | ep21 00:04:00, 00:04:30, 00:06:00 | Sponsor line, not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep22 00:02:00 (a long loop after the remark on old age); ep23 00:01:30 (a very long loop in the middle of the Ibn al-Qayyim quotation), 00:03:00 (a half-clear sentence on prayer and worship); ep24 00:00:30 (garbled verses, not quoted), 00:05:00 (a half-clear remark) | Not speech or not recoverable | Loop check, Clarity | Open |

Resume point: ajaeb-al-kulub episode 25 (branch from origin/main).
### al-naba-al-safi, episode 21 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-naba-al-safi-10)

Episode 21 read in full (49 min of transcript) before writing. 19 points written (ar, en, ur); new `about` edges for the people and passages named; 18 needs_source (unchained hadiths, sayings and accounts in sense).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-naba-al-safi ep21 (good character and chastity in food) | about 49 min (transcript) | ar, en, ur: work/al-naba-al-safi extended, 19 points | new `about` edges | 19 | 18 needs_source | this PR |

Next step: episode 22.

| Excluded (al-naba-al-safi ep21) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, break announcements, supplications and the long closing prayer | ep21 00:00:00–00:00:30, 00:11:00–00:11:30, 00:26:30–00:27:00, 00:37:30–00:38:00, 00:46:30–00:48:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep21 00:06:30, 00:23:00, 00:27:00, 00:34:00, 00:45:00, 00:46:00 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| A call about a deceased relative and a call with no audible question | ep21 00:38:00–00:40:00 | Private and not lesson content | Privacy | Open |
| Poetry-like proverb quoted | ep21 00:27:30 | Summarised in sense, not reproduced | Sources policy | Open |

### ajaeb-al-kulub ep25-ep27 (12 Nov 2026)

23 points written for episodes 25 to 27 (ar, en, ur); 13 needs_source marks; 10 new `about` edges. Quran verses referenced only through passage links (3-134, 43-32, 28-68, 109-1, 112-1, 3-31, 5-54, 1-5); none typed.

| Excluded (ajaeb-al-kulub ep25-27) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greetings, closing supplications and sign-offs | ep25 00:00:00, 00:05:00 (supplication); ep26 00:00:00 (greeting), 00:05:30; ep27 00:00:00, 00:05:00 (supplication), 00:05:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep26 00:04:00 (a very long loop of one letter in the middle of a sentence on love shown in conduct); ep27 00:03:00 (a very long loop in the Ibn Abbas story, where the lion was met is not recoverable); ep25 00:02:00 (the closing line of the Abd al-Malik anecdote is garbled), 00:03:30 (a half-clear sentence on encouraging rancour) | Not speech or not recoverable | Loop check, Clarity | Open |

Resume point: ajaeb-al-kulub episode 28 (branch from origin/main).
### al-naba-al-safi, episode 22 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-naba-al-safi-11)

Episode 22 read in full (33 min of transcript) before writing. 13 points written (ar, en, ur); new `about` edges for the people and passages named; 10 needs_source (unchained hadiths, sayings and accounts in sense).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-naba-al-safi ep22 (between ease and hardship) | about 33 min (transcript) | ar, en, ur: work/al-naba-al-safi extended, 13 points | new `about` edges | 13 | 10 needs_source | this PR |

Next step: episode 23.

| Excluded (al-naba-al-safi ep22) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, break announcements, supplications and the long closing prayer | ep22 00:00:00–00:01:00, 00:16:00–00:17:00, 00:31:00–00:33:00 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep22 00:06:30, 00:07:30, 00:13:30, 00:17:30, 00:22:00, 00:23:00–00:24:00 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Poetry quoted | ep22 00:03:00–00:03:30 | Not reproduced | Sources policy | Open |

### ajaeb-al-kulub ep28-ep29 (12 Nov 2026) - series complete

9 points written for episodes 28 and 29 (ar, en, ur); 6 needs_source marks. Episodes 28 and 29 are near-duplicates of episode 27 (the three transcripts match almost word for word): they are written as short repeat sections with their own timestamps and flagged needs_source, the cause (duplicate recordings or a repeated talk) not checked by listening. Series total: 29 episodes, 226 points, 116 needs_source marks, 67 `about` edges, record `work/ajaeb-al-kulub` (status draft, sensitivity contested, decision dec-20261112-267). Three episodes (11, 28, 29) are repeats and may point to mislabelled archive entries; the founder may wish the archive page checked.

| Excluded (ajaeb-al-kulub ep28-29) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greetings, closing supplications and sign-offs | ep28 00:00:00, 00:05:00 (supplication), 00:05:30; ep29 00:00:00, 00:05:00 (supplication), 00:05:30 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep28 00:02:30 (a very long loop of one syllable), 00:03:00 (a very long loop in the Ibn Abbas story); ep29 00:03:30 (a very long loop of one letter) | Not speech or not recoverable | Loop check, Clarity | Open |
| Repeated stretches of episode 27 | ep28 and ep29 whole (written once each as short repeat sections) | Same content as ep27 | Duplication | Open |

Resume point: none; ajaeb-al-kulub is complete (29 of 29). Branch from origin/main for any follow-up.
### al-naba-al-safi, episode 23 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-naba-al-safi-12)

Episode 23 read in full (47 min of transcript) before writing. 16 points written (ar, en, ur); new `about` edges for the people and passages named; 10 needs_source (unchained hadiths, sayings and accounts in sense, a number without a source).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-naba-al-safi ep23 (beautiful patience and why the predecessors were patient) | about 47 min (transcript) | ar, en, ur: work/al-naba-al-safi extended, 16 points | new `about` edges | 16 | 10 needs_source | this PR |

Next step: episode 24.

| Excluded (al-naba-al-safi ep23) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Openings, greetings, break announcements, supplications and the long closing prayer | ep23 00:00:00–00:00:30, 00:16:00, 00:31:30–00:32:00, 00:34:30, 00:45:30–00:47:00 | Not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep23 00:03:00, 00:05:00, 00:09:30, 00:14:00, 00:20:00, 00:23:30–00:24:30, 00:30:30, 00:33:00, 00:42:30, 00:45:00 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| Interrupted or unusable calls | ep23 00:35:00–00:40:30 | No usable question was heard | Clarity | Open |
| Poetry quoted | ep23 00:05:30–00:06:00, 00:08:30, 00:36:30 | Not reproduced | Sources policy | Open |

### al-naba-al-safi, episode 24 (12 Nov 2026, Claude Code claude-sonnet-5-5, run omar-abdelkafy-al-naba-al-safi-13)

Episode 24 read in full (37 min of transcript) before writing. 15 points written (ar, en, ur); new `about` edges for the people and passages named; 8 needs_source (unchained hadiths, sayings and accounts in sense, an unsourced proportion).

| Recording | Duration | Prose | Entities | Claims | Doubts | Commit |
|---|---|---|---|---|---|---|
| al-naba-al-safi ep24 (the tree of sorrow and its remedy) | about 37 min (transcript) | ar, en, ur: work/al-naba-al-safi extended, 15 points | new `about` edges | 15 | 8 needs_source | this PR |

Next step: none, the series is complete (all 24 episodes are covered on the work page).

| Excluded (al-naba-al-safi ep24) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening cut off, break announcements, supplications and the long closing prayer | ep24 00:00:00, 00:23:30–00:24:00, 00:34:00–00:37:00 | The recording begins mid-speech; breaks and prayers are not lesson content | Content rule | Open |
| Repetition loops and garbled windows | ep24 00:02:30–00:03:30, 00:04:00, 00:25:00, 00:28:00, 00:33:30 | Not speech, or garbled; only the clear sense is summarised | Loop check and clarity | Open |
| A passing prayer for those affected by a storm and a poem of an Arab sage | ep24 00:22:00–00:23:30 | Not lesson content; the poem is not reproduced | Content rule and sources policy | Open |
| Private caller details | ep24 00:27:00–00:28:30, 00:31:30–00:32:30 | Generalised | Privacy | Open |

### mawkib-al-nour ep01 (12 Nov 2026)

New record work/mawkib-al-nour (29 episodes in the harvest, about 43 minutes and 45 to 50 KB of transcript each, six times the length of ajaeb-al-kulub episodes); episode 1 written (ar, en, ur). Decision dec-20261112-268 (sensitivity: contested). 24 points; 14 needs_source marks; 11 `about` edges. Quran verses referenced only through passage links (7-31, 17-27, 21-90, 11-111, 7-12, 3-133, 6-162); none typed. This batch holds one episode, not two to four, because of the episode length; the coordinator should consider one episode per PR or more than one worker for this series.

| Excluded (mawkib-al-nour ep01) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening recitation, greetings, closing supplications and sign-offs | ep01 00:00:00-00:01:00 (a recitation, Quran text never typed), 00:02:30, 00:09:30-00:10:00 (short asides), 00:42:00-00:42:30 | Not lesson content | Content rule, Quran rule | Open |
| Repetition loops and garbled windows | ep01 00:13:30 (a very long loop of one letter), 00:34:00 (a very long loop), 00:23:00 (a half-clear aside), 00:39:30-00:40:00 (a half-clear remark) | Not speech or not recoverable | Loop check, Clarity | Open |

Resume point: mawkib-al-nour episode 2 (branch from origin/main).

### mawkib-al-nour ep02 (12 Nov 2026)

24 points written for episode 2 (ar, en, ur); 16 needs_source marks; 10 new `about` edges (21 in all). Quran verses referenced only through passage links (50-18, 23-60, 11-111, 14-34, 68-11); none typed. One episode per PR because of the episode length (about 42 minutes).

| Excluded (mawkib-al-nour ep02) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening recitation, greetings, closing supplications and sign-offs | ep02 00:00:00 (recitation, Quran text never typed), 00:00:30-00:01:00 (supplications), 00:40:30 (closing) | Not lesson content | Content rule, Quran rule | Open |
| Garbled windows | ep02 00:03:00 (a remark on prayer-bead counters made in Asia, only the clear claim kept), 00:10:30 (a half-clear aside on grammar), 00:30:30 (a half-clear sentence on God's concealment), 00:39:30 (a half-clear remark on packaging) | Not recoverable | Clarity | Open |

Resume point: mawkib-al-nour episode 3 (branch from origin/main).

### mawkib-al-nour ep03 (12 Nov 2026)

24 points written for episode 3 (ar, en, ur); 14 needs_source marks; 9 new `about` edges (30 in all). Quran verses referenced only through passage links (49-13, 18-62, 24-31, 38-22, 24-30); none typed. Proposal for the founder, not applied: ep03 00:11:00 holds the lecturer's political-religious claim linking unanswered prayer for al-Aqsa to doubtful money; it is described as his opinion and the record stays `sensitivity: contested`.

| Excluded (mawkib-al-nour ep03) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening recitation, greetings, closing supplications and sign-offs | ep03 00:00:00 (recitation, Quran text never typed), 00:00:30-00:02:30 (greetings and recap of supplications), 00:40:30 (closing) | Not lesson content | Content rule, Quran rule | Open |
| Garbled windows and loops | ep03 00:14:00 (a long loop), 00:13:30 (a half-clear remark on dress), 00:24:30 (a half-clear aside), 00:30:30 (a half-clear remark on a song), 00:35:00 (a half-clear remark on scholars) | Not recoverable | Clarity, Loop check | Open |
| A sentence quoting a hostile reply to a greeting | ep03 00:25:30 | Polemical wording not reproduced; the point is kept in neutral words | Content rule | Open |

Resume point: mawkib-al-nour episode 4 (branch from origin/main).

### mawkib-al-nour ep04 (12 Nov 2026)

34 points written for episode 4 (ar, en, ur); 22 needs_source marks; 14 new `about` edges. Quran verses referenced only through passage links (3-35, 3-36, 3-37, 3-164, 21-35, 33-33, 2-286, 95-4); none typed. Proposal for the founder, not applied: the lecturer's statements on gender (ep04 00:04:30, a third sex), on women's work (00:35:30-00:37:00) and on plural marriage (00:37:30-00:38:30) are recorded as his opinions in attributed wording; the record stays `sensitivity: contested`. The founder may wish to raise a part of it to `polemical`. The 3:164 link was identified from the garbled wording at 00:08:00 and is marked.

| Excluded (mawkib-al-nour ep04) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening recitation, greetings, opening supplications and the closing greeting | ep04 00:00:00-00:01:30 (recitation, Quran text never typed), 00:42:00 (closing) | Not lesson content | Content rule, Quran rule | Open |
| Garbled windows and loops | ep04 00:15:00 (a long loop), 00:28:30 (a long loop), 00:38:00 (a loop inside the plural-marriage passage), 00:13:00 (a half-clear remark on an incident in Laylat al-Qadr), 00:12:30 to 00:13:00 (a half-clear remark on the lecturer's own experience) | Not recoverable | Clarity, Loop check | Open |
| Lecturer's jokes on shampoo adverts, hair and cosmetic doctors beyond the points kept | ep04 00:20:00-00:21:00, 00:33:30-00:34:30 | Illustrative asides, not separate claims; the point is kept in neutral words | Content rule | Open |
| A remark on the lecturer's own conduct in a past incident and a passing remark on men's marital habits | ep04 00:12:00 (anecdote), 00:41:00 (aside) | Not recoverable or incidental | Clarity | Open |

Resume point: mawkib-al-nour episode 5 (branch from origin/main).

### mawkib-al-nour ep05 (12 Nov 2026)

35 points written for episode 5 (ar, en, ur); 23 needs_source marks; 11 new `about` edges. Quran verses referenced only through passage links (39-53, 39-54, 51-22); none typed. Proposal for the founder, not applied: the lecturer's jurisprudential statements (ep05 00:25:30-00:26:30 on postnatal bleeding and make-up fasting, 00:26:30 on oath expiation) are recorded as his and marked as needing a source; the record stays `sensitivity: contested`.

| Excluded (mawkib-al-nour ep05) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening recitation, greetings, opening supplications and the closing greeting | ep05 00:00:00-00:01:30 (recitation, Quran text never typed), 00:19:30 (a verse recited in the middle of the text), 00:39:30 (closing) | Not lesson content | Content rule, Quran rule | Open |
| Garbled windows and loops | ep05 00:03:30 (a long loop), 00:38:30 (a long loop) | Not recoverable | Clarity, Loop check | Open |
| Jokes and asides on doctors' connections, golf clubs and phone chain messages beyond the points kept | ep05 00:09:00, 00:12:30-00:13:00 | Illustrative asides, not separate claims | Content rule | Open |
| A call to travel in the earth and look at creation, seemingly quoting a verse | ep05 00:38:00 | Verse not identifiable from the wording, so not linked | Clarity, Quran rule | Open |

Resume point: mawkib-al-nour episode 6 (branch from origin/main).

### mawkib-al-nour ep06 (12 Nov 2026)

38 points written for episode 6 (ar, en, ur); 22 needs_source marks; 10 new `about` edges. Quran verses referenced only through passage links (67-10, 67-11, 17-9, 104-8, 104-9, 39-22, 26-88, 26-89, 15-47, 59-10, 43-32, 7-20, 7-21, 113-1, 114-1, 64-14, 25-63, 25-64, 25-72, 30-55); none typed. Proposal for the founder, not applied: the lecturer's description of Western schools (ep06 00:07:30) and the statistics on speech (00:05:00) are unsourced and are marked, not removed; the lecturer's interpretation of the order of the human and jinn devils (00:28:30) is recorded as his own.

| Excluded (mawkib-al-nour ep06) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening recitation, greetings, opening supplications and the closing supplication | ep06 00:00:00-00:01:30 (recitation, Quran text never typed), 00:20:00 (a verse recited mid-text), 00:37:30-00:38:00 (closing) | Not lesson content | Content rule, Quran rule | Open |
| Garbled windows and loops | ep06 00:27:00 (a long loop), 00:37:00 (a long loop), 00:21:30 (a half-clear remark on a household example) | Not recoverable | Clarity, Loop check | Open |
| Asides on a hospital example, a family's school-day anecdote and the lecturer's remarks on scholars' mosque habits beyond the points kept | ep06 00:16:00, 00:12:30 | Illustrative asides, not separate claims | Content rule | Open |

Resume point: mawkib-al-nour episode 7 (branch from origin/main).

### mawkib-al-nour ep07 (12 Nov 2026)

35 points written for episode 7 (ar, en, ur); 17 needs_source marks; 15 new `about` edges. Quran verses referenced only through passage links (6-125, 12-103, 34-13, 43-54, 28-4, 7-12, 33-72, 43-51, 28-38, 40-26, 61-4, 28-78, 28-81, 17-4, 17-7, 55-1, 55-2, 55-3, 3-134, 74-3, 3-133, 76-19, 1-6, 6-153, 42-13, 33-36, 4-65); none typed. Proposal for the founder, not applied: the lecturer's opinions on dress and the veil (ep07 00:29:30-00:34:30), on a generalisation about the Egyptians (00:04:30), on the closing of ijtihad (00:06:30) and the figure he gives for al-Hajjaj's killings (00:20:00) are recorded as his and marked or labelled; the record stays `sensitivity: contested`. The founder may wish to review the Egyptians generalisation and the Hajjaj figure.

| Excluded (mawkib-al-nour ep07) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening recitation, greetings and the closing supplication | ep07 00:00:00-00:01:00 (recitation, Quran text never typed), 00:42:30-00:43:00 (closing and a hallucinated tail of repeated syllables) | Not lesson content | Content rule, Quran rule | Open |
| Garbled windows and loops | ep07 00:07:30 (a long loop), 00:10:30 (a long loop), 00:13:30 (a long loop), 00:15:00 (a loop), 00:26:30 (a loop) | Not recoverable | Clarity, Loop check | Open |
| Asides on a salary dispute, a dress anecdote at an office and a housing-investment example beyond the points kept | ep07 00:12:30-00:13:00, 00:30:00-00:32:00, 00:34:00 | Illustrative asides, not separate claims | Content rule | Open |

Resume point: mawkib-al-nour episode 8 (branch from origin/main).

### mawkib-al-nour ep08 (12 Nov 2026)

25 points written for episode 8 (ar, en, ur); 15 needs_source marks; 7 new `about` edges. Quran verses referenced only through passage links (52-48, 12-18, 15-85, 73-10, 20-39, 28-10, 2-251, 22-40, 88-21, 7-199, 2-216, 34-10, 34-11, 51-22, 40-60, 29-45); none typed. Proposal for the founder, not applied: the scientific claim on melatonin and sleep (ep08 00:17:00) and the account of a patient who outlived a cancer prognosis (00:31:00) are unsourced and are marked, not removed.

| Excluded (mawkib-al-nour ep08) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening recitation, greetings, supplications for the Muslims' lands and the closing supplication | ep08 00:00:00-00:01:30 (recitation, Quran text never typed), 00:19:00 (a verse recited mid-text), 00:39:00-00:39:30 (closing) | Not lesson content | Content rule, Quran rule | Open |
| Garbled windows and loops | ep08 00:11:00 (a long loop), 00:12:00 (a long loop), 00:30:30 (a long loop), 00:32:30 (a long loop), 00:35:30 (a long loop), 00:36:00 (a long loop) | Not recoverable | Clarity, Loop check | Open |
| Asides on poetry about youth, football coaches' skills, grain measures and a surgery anecdote beyond the points kept | ep08 00:07:30, 00:22:30-00:23:30, 00:28:30, 00:27:30 | Illustrative asides, not separate claims | Content rule | Open |

Resume point: mawkib-al-nour episode 9 (branch from origin/main).

### mawkib-al-nour ep09 (12 Nov 2026)

(Correction to the ep08 note above: the episode 8 text carries 16 needs_source marks, not 15.)

30 points written for episode 9 (ar, en, ur); 27 needs_source marks; 10 new `about` edges. Quran verses referenced only through passage links (76-8, 76-9, 76-10, 49-10, 12-86, 18-94, 18-95, 18-96); none typed. Proposal for the founder, not applied: the statements attributed to the Hanbalis on liability for blood-money (ep09 00:02:00), the statistic on billionaires (00:32:00) and the attribution to Marie Antoinette (00:22:30) have no source and are marked, not removed; the lecturer's reading of "the captive" as a non-Muslim prisoner (00:24:30) is recorded as his own.

| Excluded (mawkib-al-nour ep09) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening recitation, greetings and the closing supplication | ep09 00:00:00-00:01:00 (recitation, Quran text never typed), 00:39:30-00:40:00 (closing and a hallucinated tail of repeated syllables) | Not lesson content | Content rule, Quran rule | Open |
| Garbled windows and loops | ep09 00:08:00 (a long loop), 00:13:30 (a long loop), 00:32:30-00:33:00 (a loop of repeated particles) | Not recoverable | Clarity, Loop check | Open |
| Asides on nutrition and germs, a French-revolution anecdote, an aid-agency broadcast and a reference to Hasan's palate beyond the points kept | ep09 00:10:30, 00:23:00, 00:29:00 | Illustrative asides, not separate claims | Content rule | Open |

Resume point: mawkib-al-nour episode 10 (branch from origin/main).

### mawkib-al-nour ep10 (12 Nov 2026)

31 points written for episode 10 (ar, en, ur); 20 needs_source marks; 10 new `about` edges. Quran verses referenced only through passage links (17-18, 17-19, 17-20, 17-13, 17-14, 6-75, 72-8, 72-9, 6-162, 6-163, 16-97, 20-124, 20-125, 20-126, 18-29, 18-65); none typed. Proposal for the founder, not applied: at ep10 00:29:00 the lecturer speaks of young people eager to die in a fight against occupiers; the passage is not reproduced and the point is kept in neutral words (dying versus living in God's way), in line with the content-safety rule. The lecturer's figures on the zakat due on oil (00:07:00), on the share of Muslims among the world's poor (00:06:30) and on the number of non-believers (00:14:30) are unsourced and marked, not removed. His account of guidance and free will (00:35:00) is a theological explanation recorded as his own; the record stays `sensitivity: contested`.

| Excluded (mawkib-al-nour ep10) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening recitation, greetings and the closing supplication | ep10 00:00:00-00:01:00 (recitation, Quran text never typed), 00:21:00 (a verse recited mid-text), 00:42:00-00:42:30 (closing and a hallucinated tail of repeated syllables) | Not lesson content | Content rule, Quran rule | Open |
| References to a fight against occupiers and the praise of dying in it | ep10 00:29:00 | Modern-conflict framing dropped under the content-safety rule; the lesson point is kept in neutral words | Content-safety rule | Open |
| Asides on football pools, a bank-clerk dialogue, a wedding-fashion example and other jokes beyond the points kept | ep10 00:09:00, 00:22:00, 00:25:00 | Illustrative asides, not separate claims | Content rule | Open |

Resume point: mawkib-al-nour episode 11 (branch from origin/main).

### mawkib-al-nour ep11 (12 Nov 2026)

23 points written for episode 11 (ar, en, ur); 12 needs_source marks; 5 new `about` edges. Quran verses referenced only through passage links (64-14, 59-19, 30-55, 23-112, 23-113, 2-245, 39-42, 78-10, 78-11, 17-85, 2-172, 4-58); none typed. Proposal for the founder, not applied: the lecturer's description of what happens to the spirit during sleep (ep11 00:17:00-00:21:00) and his account of genetically modified chickens (00:40:30) have no source and are marked, not removed.

| Excluded (mawkib-al-nour ep11) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, opening supplications and the closing supplication | ep11 00:00:00-00:01:00 (greetings and supplications), 00:43:00-00:43:30 (closing and a stray non-Arabic token) | Not lesson content | Content rule | Open |
| Garbled windows and loops | ep11 00:15:30 (a long loop), 00:18:00 (a long loop), 00:28:00 (a long loop), 00:29:30 (a long loop), 00:36:00 (a loop), 00:38:00 (a loop) | Not recoverable | Clarity, Loop check | Open |
| Asides on a cooking show, a salad recipe, a potato recipe, seats in malls and a half-clear comparison of Ramadan terms | ep11 00:36:30-00:38:00, 00:39:00-00:40:00 | Illustrative asides, not separate claims | Content rule | Open |

Resume point: mawkib-al-nour episode 12 (branch from origin/main).

### mawkib-al-nour ep12 (12 Nov 2026)

(Correction to the ep11 note above: the episode 11 text carries 10 needs_source marks, not 12.)

24 points written for episode 12 (ar, en, ur); 15 needs_source marks; 5 new `about` edges. Quran verses referenced only through passage links (15-97, 15-98, 15-99, 38-5, 15-6, 69-41, 69-42, 68-2, 28-76, 28-79, 28-81, 18-6, 18-7, 18-8, 39-68, 40-16, 36-51, 36-52, 21-47, 18-18, 28-56); none typed. Proposal for the founder, not applied: the lecturer's account of the death of Abu Talib (ep12 00:36:30) and the sequence of events at the trumpet (00:29:30) are given by him without chains and are marked, not removed; the statement about Khosrow and Umar (00:04:30) is unsourced.

| Excluded (mawkib-al-nour ep12) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening recitation, greetings, opening supplications and the closing supplication | ep12 00:00:00-00:01:30 (recitation, Quran text never typed), 00:38:30-00:39:00 (closing) | Not lesson content | Content rule, Quran rule | Open |
| Garbled windows and loops | ep12 00:03:30 (a long loop), 00:05:30 (a long loop), 00:23:00 (a long loop), 00:29:00 (a loop), 00:32:00 (a loop), 00:33:00 (a loop) | Not recoverable | Clarity, Loop check | Open |
| Asides on an airline passenger, a shop joke on selling shrouds and the description of a bugle at morning parades beyond the points kept | ep12 00:20:30, 00:27:30 | Illustrative asides, not separate claims | Content rule | Open |

Resume point: mawkib-al-nour episode 13 (branch from origin/main).

### mawkib-al-nour ep13 (12 Nov 2026)

(Correction to the ep12 note above: the episode 12 text carries 14 needs_source marks, not 15.)

24 points written for episode 13 (ar, en, ur); 20 needs_source marks; 7 new `about` edges. Quran verses referenced only through passage links (28-1 to 28-6, 7-128, 28-83, 3-188, 17-4, 27-31, 49-12, 74-4); none typed. Proposal for the founder, not applied: the lecturer's statements on what a woman must cover (ep13 00:35:30-00:38:00) are recorded as his own on a disputed matter and attributed to unnamed jurists without a source; his two accounts of how scholars treat remembering a repented sin (00:28:00) are recorded as he gives them.

| Excluded (mawkib-al-nour ep13) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening recitation, greetings, opening supplications and the closing greeting | ep13 00:00:00-00:01:30 (recitation, Quran text never typed), 00:42:00 (closing) | Not lesson content | Content rule, Quran rule | Open |
| An unsourced quotation attributed to a named political figure about two bombs dropped on Japan | ep13 00:20:00-00:20:30 | Polemical attribution about a named person with no source; not reproduced | Content rule, Source rule | Open |
| Garbled windows and loops | ep13 00:13:30 (a long loop), 00:26:00 (a long loop), 00:37:00 (a long loop) | Not recoverable | Clarity, Loop check | Open |
| Asides on Egyptian television presenters, an English-speaking relative, Quran reading skill and street clothing beyond the points kept | ep13 00:27:00-00:27:30, 00:36:30-00:37:00 | Illustrative asides, not separate claims | Content rule | Open |

Resume point: mawkib-al-nour episode 14 (branch from origin/main).

### mawkib-al-nour ep14 (12 Nov 2026)

(Correction to the ep13 note above: the episode 13 text carries 17 needs_source marks, not 20.)

23 points written for episode 14 (ar, en, ur); 10 needs_source marks; 7 new `about` edges. Quran verses referenced only through passage links (40-51, 40-52, 40-28, 40-29, 38-5, 2-275, 54-10, 12-8, 12-9, 12-80, 12-90, 5-32, 43-32, 2-143, 26-54, 26-55); none typed. Proposal for the founder, not applied: the lecturer's reading that the Umayyad, Abbasid and Ottoman states fell when cut from the Book and the Sunna (ep14 00:01:00) is recorded as his opinion; the attribution of lines on honour to al-Shafi'i (00:37:30) has no source.

| Excluded (mawkib-al-nour ep14) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening recitation, greetings and the closing supplication | ep14 00:00:00 (recitation, Quran text never typed), 00:39:00-00:39:30 (closing) | Not lesson content | Content rule, Quran rule | Open |
| Garbled windows and loops | ep14 00:10:30 (a long loop), 00:16:30 (a long loop), 00:26:00 (a long loop), 00:36:00 (a long loop) | Not recoverable | Clarity, Loop check | Open |
| A half-clear verse of poetry about dignity in the pre-Islamic manner, which the lecturer says he does not endorse, and asides on a hammer and a mallet | ep14 00:38:30-00:39:00, 00:28:30 | Poetry the lecturer disclaims; illustrative aside | Content rule | Open |

Resume point: mawkib-al-nour episode 15 (branch from origin/main).

### mawkib-al-nour ep15 (12 Nov 2026)

25 points written for episode 15 (ar, en, ur); 17 needs_source marks per language file (ar 17, en 17, ur 17); 10 new `about` edges. The recording is complete (it ends with the closing greeting at 00:31:30) and is shorter than the others, not truncated. Quran verses referenced only through passage links (67-10, 67-11, 2-44, 23-10, 23-11, 10-23, 113-1, 113-5, 33-72, 40-19, 11-111, 66-10, 83-6, 23-97, 23-98, 9-40, 6-103, 7-198, 21-69, 76-13, 37-107, 28-7, 37-143, 37-144, 5-27, 6-54); none typed. Proposal for the founder, not applied: the list of five kinds of people from whom blessing is lifted (ep15 00:04:30) and the division of the roots of evil into three "according to the scholars" (00:08:00) are recorded as his, with no source; the story of Ibn Tulun and the ascetic (00:23:30) has no chain.

| Excluded (mawkib-al-nour ep15) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening recitation, greetings and the closing supplication | ep15 00:00:00-00:01:30 (recitation, Quran text never typed; the opening supplication), 00:31:00-00:31:30 (closing) | Not lesson content | Content rule, Quran rule | Open |
| Garbled windows and loops | ep15 00:06:00 (a garbled passage on a pledge), 00:07:30-00:08:00 (garbled), 00:11:00 (garbled), 00:19:30 (a repeated sentence), 00:30:30 (garbled derivation of the word for Satan) | Not recoverable | Clarity, Loop check | Open |
| A story of a mother weeping over a young man whom al-Hajjaj wished to kill, and a garbled remark on the marriage of the two sons of Adam | ep15 00:26:00-00:26:30 | Garbled, cannot be traced to a chain | Clarity | Open |
| An aside on a half-clear saying about drinking from the sea | ep15 00:09:30 | Illustrative aside, partly garbled | Clarity | Open |

Resume point: mawkib-al-nour episode 16 (branch from origin/main).

### mawkib-al-nour ep16 (12 Nov 2026)

26 points written for episode 16 (ar, en, ur); 23 needs_source marks per language file (ar 23, en 23, ur 23); 10 new `about` edges. Quran verses referenced only through passage links (16-90, 16-97, 3-195, 4-32, 9-105, 34-13, 5-54, 49-10, 2-276, 2-279, 17-70, 28-77, 7-56, 28-4, 5-78, 5-79); none typed. Proposal for the founder, not applied: the lecturer's statements on women and on work in pre-Islamic Arabia (ep16 00:02:30, 00:04:00), the rule on testimony between relatives (00:11:30) and the closing hopes for listeners in named countries (00:37:30) are recorded as his, with the rule and the hopes carrying no source; the figure of four hundred brain cells (00:17:30) is an unsourced statistic. The recording ends with a closing prayer after 00:40:30.

| Excluded (mawkib-al-nour ep16) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening recitation, greetings and supplication, and the closing prayer and farewell | ep16 00:00:00-00:01:00 (recitation, Quran text never typed), 00:40:30-00:41:00 (closing) | Not lesson content | Content rule, Quran rule | Open |
| Garbled windows and loops | ep16 00:11:30-00:12:00 (a long repeated syllable), 00:16:00 (a long repeated syllable), 00:25:30 (a long repeated phrase), 00:19:30-00:20:00 (a garbled quotation of the believer of Pharaoh's household), 00:14:00 (the start is garbled) | Not recoverable | Clarity, Loop check | Open |
| A garbled saying on the intimate friend and the thin garment, a garbled passage on a named man and a dog on the road, and an unclear closing phrase about a sun | ep16 00:10:00-00:10:30, 00:21:30-00:22:00, 00:40:30 | Garbled | Clarity | Open |

Resume point: mawkib-al-nour episode 17 (branch from origin/main).

### mawkib-al-nour ep17 (12 Nov 2026)

24 points written for episode 17 (ar, en, ur); 16 needs_source marks per language file (ar 16, en 16, ur 16); 7 new `about` edges. Quran verses referenced only through passage links (28-5, 21-107, 7-88, 7-128, 4-97, 17-81, 23-10, 23-11, 28-40, 25-3, 4-49, 4-53, 35-13, 17-18, 17-19, 17-20, 2-245, 35-15, 102-8, 14-34, 28-76, 28-79, 28-80, 28-81, 28-82, 28-83, 28-6); none typed. Proposal for the founder, not applied: the lecturer's ruling that whoever sides with a wrongdoer knowing him to be one has left the religion (ep17 00:39:00) is recorded as his, with no source and no school named; the claim that archaeologists proved Ramesses II died by drowning (00:19:00) and the figures on the Crusader occupation of Jerusalem (00:11:30) are unsourced statistics; the saying credited to Ibn Taymiyya (00:38:00) has no source.

| Excluded (mawkib-al-nour ep17) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening recitation and supplication, and the closing prayer | ep17 00:00:00-00:01:30 (recitation, Quran text never typed), 00:39:30-00:40:00 (closing) | Not lesson content | Content rule, Quran rule | Open |
| Garbled windows and loops | ep17 00:03:00 (a long repeated syllable), 00:05:00 (a long repeated syllable), 00:37:00 (a long repeated syllable), 00:08:00 and 00:16:00 and 00:29:30 (partly garbled) | Not recoverable | Clarity, Loop check | Open |
| A claim about an East Asian ruler who is said to have ordered an execution of a woman for not weeping at a leader's death | ep17 00:09:00-00:09:30 | Garbled, unnamed and unsourced report about a living-memory event | Clarity, Accuracy | Open |
| A passage making a sweeping generalisation about Jews, set beside a complaint about Muslims and Arabs, partly garbled | ep17 00:33:00-00:33:30 | A generalisation about a group, partly garbled; the sentence about Muslims and Arabs is kept as his opinion | Content rule, Clarity | Open; proposal for the founder to decide |

Resume point: mawkib-al-nour episode 18 (branch from origin/main).

(Correction to the ep17 note above: the episode 17 text added 6 new `about` edges, not 7.)

### mawkib-al-nour ep18 (12 Nov 2026)

27 points written for episode 18 (ar, en, ur); 17 needs_source marks per language file (ar 17, en 17, ur 17); 5 new `about` edges. Quran verses referenced only through passage links (25-25, 25-26, 25-27, 25-28, 25-29, 39-68, 4-28, 17-14, 17-15, 17-16, 27-34, 6-153, 12-108, 80-34, 80-35, 80-36, 80-37, 2-166, 2-167, 16-25, 33-41, 33-42, 33-43, 39-22, 83-29, 83-30, 83-31, 9-51, 53-42, 9-40, 42-50, 2-85); none typed. Proposal for the founder, not applied: the story of an unnamed group meeting a communist leader in 1969 (ep18 00:14:00) is recorded as his anecdote with no chain and no names; the dialogue between Ayyub and Iblis (00:25:30) has no chain; the claims about pesticides and hormones in food and the count of television serials (00:34:00-00:37:00) are unsourced.

| Excluded (mawkib-al-nour ep18) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening recitation, greetings and supplication, and the closing prayer | ep18 00:00:00-00:01:30 (recitation, Quran text never typed; the opening supplication), 00:41:30-00:42:00 (closing) | Not lesson content | Content rule, Quran rule | Open |
| Garbled windows and loops | ep18 00:20:30 (a long repeated word), 00:29:30-00:30:00 (a long repeated syllable), 00:37:30 (a long repeated syllable), 00:38:00 (a long repeated syllable), 00:41:00 (a long repeated syllable) | Not recoverable | Clarity, Loop check | Open |
| An aside on a claim about an East Asian leader and a dissolved raptor-eating remark and a garbled remark on altering God's creation | ep18 00:37:00-00:37:30 | Garbled, partly unreadable | Clarity | Open |
| A garbled remark that a speaker called the Mao-era delegation by an unreadable name and a passage on the ear and the pause of the heart | ep18 00:03:30, 00:20:30 | Garbled | Clarity | Open |

Resume point: mawkib-al-nour episode 19 (branch from origin/main).

### mawkib-al-nour ep19 (12 Nov 2026)

18 points written for episode 19 (ar, en, ur); 15 needs_source marks per language file (ar 15, en 15, ur 15); 3 new `about` edges. Quran verses referenced only through passage links (33-56, 3-31, 2-34, 59-21, 21-107, 68-4, 43-81, 33-43, 40-7, 2-30, 13-24, 21-104, 27-24, 27-25, 27-18, 27-19); none typed. Proposal for the founder, not applied: the claim attributed to unnamed orientalists (ep19 00:04:00) is recorded as his report with no names; the account of the bridge over Hell, the stages of its kindling and the speeds of crossing (00:19:00-00:25:00) is recorded as his, with the reports by sense and without a chain; his preference for one wording of prayer on the Prophet (00:26:00) has no source.

| Excluded (mawkib-al-nour ep19) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening recitation, greetings and supplication, and the closing farewell | ep19 00:00:00-00:01:30 (recitation, Quran text never typed; supplication), 00:37:30-00:38:00 (closing) | Not lesson content | Content rule, Quran rule | Open |
| Garbled windows and loops | ep19 00:04:00 (a long repeated syllable), 00:08:30 (a long repeated syllable), 00:19:30 (a long repeated syllable), 00:35:30 (a long repeated syllable) | Not recoverable | Clarity, Loop check | Open |
| A garbled passage on blessing and the poor and a garbled remark on the pause in the pulse of speech | ep19 00:03:30-00:04:00, 00:24:00 | Garbled, partly unreadable | Clarity | Open |

Resume point: mawkib-al-nour episode 20 (branch from origin/main).

### mawkib-al-nour ep20 (12 Nov 2026)

23 points written for episode 20 (ar, en, ur); 16 needs_source marks per language file (ar 16, en 16, ur 16); 6 new `about` edges. Quran verses referenced only through passage links (35-8, 2-85, 2-286, 4-65, 12-53, 75-2, 89-27, 111-1, 12-17, 12-18, 15-85, 73-10, 18-6, 88-21, 88-22, 8-32, 28-57, 7-172); none typed. Proposal for the founder, not applied: the ruling that arrogance is refusing part of the religion (ep20 00:04:00) and the application to the headscarf (00:07:00) are recorded as his opinion; the claim that Abu Bakr led the first expedition after the Hijra (00:12:00), the count of Companions buried in Mecca and Medina (00:25:30) and the statistic attributed to Germany (00:27:30) are unsourced and are for the founder to decide on.

| Excluded (mawkib-al-nour ep20) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening recitation, greetings and supplication, and the closing prayer | ep20 00:00:00-00:02:00 (recitation, Quran text never typed; supplication), 00:44:00-00:44:30 (closing) | Not lesson content | Content rule, Quran rule | Open |
| Garbled windows and loops | ep20 00:03:30 (a long repeated syllable), 00:17:00-00:17:30 (a long repeated syllable), 00:22:30 (a long repeated syllable), 00:29:30-00:30:00 (a long repeated phrase), 00:30:00-00:30:30 (a long repeated phrase) | Not recoverable | Clarity, Loop check | Open |
| An aside on a cinema in America showing a film of orange groves, a verse on graves read in a garbled stretch, and a comparison of a mother and daughter that ends in a judgement on who would receive the Prophet's greeting | ep20 00:22:00-00:22:30, 00:26:00-00:26:30, 00:40:30-00:41:00 | Garbled or a speculation on how the Prophet would judge named kinds of people | Clarity, Content rule | Open |

Resume point: mawkib-al-nour episode 21 (branch from origin/main).

### mawkib-al-nour ep21 (12 Nov 2026)

20 points written for episode 21 (ar, en, ur); 10 needs_source marks per language file (ar 10, en 10, ur 10); 5 new `about` edges. Quran verses referenced only through passage links (39-22, 39-71, 39-73, 2-35, 35-5, 5-30, 5-31, 9-32, 24-35, 88-21, 45-13, 45-23, 83-1, 107-4, 107-5); none typed. Proposal for the founder, not applied: his claim that adulterated religiosity is more dangerous than open atheism (ep21 00:18:30) and the sayings credited to Ibn al-Qayyim, Umar, Abu Bakr and Ibn Abbas (00:27:00, 00:31:00, 00:37:30) are recorded as his with no source; the motive he gives for the first killing (00:10:00) is not in the verse.

| Excluded (mawkib-al-nour ep21) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening recitation, greetings and supplication, and the closing prayer | ep21 00:00:00-00:02:00 (recitation, Quran text never typed; supplication), 00:41:00-00:42:00 (closing and a looping prayer) | Not lesson content | Content rule, Quran rule | Open |
| Garbled windows and loops | ep21 00:15:30-00:16:00 (a long repeated syllable), 00:19:00-00:19:30 (a long repeated syllable), 00:41:30 (a looping prayer) | Not recoverable | Clarity, Loop check | Open |
| Garbled passages on a government raid analogy, an exchange about a workplace salary, and a passage on a pill taken in a game | ep21 00:16:00-00:16:30, 00:39:30-00:40:00 | Garbled, partly unreadable | Clarity | Open |

Resume point: mawkib-al-nour episode 22 (branch from origin/main).

(Correction to the ep21 note above: episode 21 added 2 new `about` edges, not 5; the third excluded row for episode 21 covers garbled stretches at 00:16:00-00:16:30 and 00:39:30-00:40:00 whose subjects (a workplace salary exchange and a sports warm-up remark) could not be recovered.)

### mawkib-al-nour ep22 (12 Nov 2026)

19 points written for episode 22 (ar, en, ur); 15 needs_source marks per language file (ar 15, en 15, ur 15); 2 new `about` edges. Quran verses referenced only through passage links (9-128, 9-129, 55-29, 74-7, 1-6, 1-7, 4-69, 25-72, 48-29, 24-55, 2-3, 9-103, 21-78, 21-79, 34-10); none typed. Proposal for the founder, not applied: the lecturer's judgement that the Prophet was the easiest jurist in history (ep22 00:02:30) and his call for governments half revelation and half awareness (00:10:00) are recorded as his; the numbers and ages he gives for the Ridda armies and Usama's expedition (00:19:00-00:23:00), Solomon's age and ruling (00:24:30) and the water stopping at David's voice (00:30:30) have no source.

| Excluded (mawkib-al-nour ep22) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening recitation, greetings and supplication, and the closing prayer | ep22 00:00:00-00:01:30 (recitation, Quran text never typed; supplication), 00:33:00-00:33:30 (closing) | Not lesson content | Content rule, Quran rule | Open |
| Garbled windows and loops | ep22 00:05:30 (a long repeated syllable), 00:13:30-00:14:00 (a long repeated syllable), 00:23:30-00:24:00 (a long repeated syllable), 00:26:00 (a long repeated syllable), 00:26:30-00:27:30 (a long repeated syllable) | Not recoverable | Clarity, Loop check | Open |
| Remarks on touch screens and the sense of touch in children, on a ruling on divorce by text message and on kissing a wife's hand, all partly garbled; an aside on how the Jews regard David and Solomon | ep22 00:26:30-00:28:30, 00:30:00-00:30:30, 00:32:00-00:32:30 | Garbled, partly unreadable, and a sweeping remark about a group | Clarity, Content rule | Open; proposal for the founder to decide |

Resume point: mawkib-al-nour episode 23 (branch from origin/main).

### mawkib-al-nour ep23 (12 Nov 2026)

18 points written for episode 23 (ar, en, ur); 11 needs_source marks per language file (ar 11, en 11, ur 11); 8 new `about` edges. Quran verses referenced only through passage links (7-14, 7-15, 7-16, 7-17, 33-41, 33-42, 33-43, 14-45, 14-46, 23-97, 23-98, 2-143, 17-27, 4-171, 63-8, 31-15, 2-195, 24-31); none typed. Proposal for the founder, not applied: the division of the remembrance of the limbs (ep23 00:03:30), the verses credited to Amr ibn Kulthum (00:24:00) and the account of Muawiya meeting Umar (00:38:00) are recorded as his with no source.

| Excluded (mawkib-al-nour ep23) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening recitation, greetings and supplication, and the closing prayer | ep23 00:00:00-00:01:00 (supplication; recitation, Quran text never typed), 00:40:30-00:41:00 (closing) | Not lesson content | Content rule, Quran rule | Open |
| Garbled windows and loops | ep23 00:14:00 (a long repeated syllable), 00:26:30 (a long repeated syllable), 00:34:00-00:34:30 (a long repeated syllable), 00:38:30 (a long repeated syllable), 00:39:30-00:40:00 (a long repeated syllable) | Not recoverable | Clarity, Loop check | Open |
| An account of a French mayor said to have taken his own life on the day he was to sign a same-sex marriage certificate, a claim of a march of a million people in a city, a partly garbled discussion of an intersex condition and a ruling on its inheritance, and an anecdote of a state celebration with figures for peacocks | ep23 00:13:00-00:16:30, 00:39:00-00:39:30 | Unsourced reports about named kinds of people and a possibly real person's death, figures that cannot be checked, and a garbled legal passage; excluded rather than repeated | Accuracy, Content rule, Clarity | Open; proposal for the founder to decide |

Resume point: mawkib-al-nour episode 24 (branch from origin/main).

(Correction to the ep23 note above: the episode 23 text added 6 new `about` edges, not 8.)

### mawkib-al-nour ep24 (12 Nov 2026)

12 points written for episode 24 (ar, en, ur); 12 needs_source marks per language file (ar 12, en 12, ur 12); 6 new `about` edges. Quran verses referenced only through passage links (23-97, 23-98, 6-153, 15-29, 7-26, 4-58, 7-12, 18-39, 71-10, 71-11, 71-12, 66-10); none typed. Proposal for the founder, not applied: the list of six kinds of women to avoid, credited to unnamed scholars (ep24 00:29:30), is recorded as his, with the descriptions his own and no source; the sayings credited to al-Hasan al-Basri and Ali (00:02:30, 00:14:00) and the claim on Islamic banks in the crisis of 2008 (00:08:30) have no source.

| Excluded (mawkib-al-nour ep24) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening supplication and greetings, and the closing prayer | ep24 00:00:00-00:01:00 (supplication; recitation, Quran text never typed), 00:36:00 (closing) | Not lesson content | Content rule, Quran rule | Open |
| Garbled windows and loops | ep24 00:11:30 (a long repeated syllable), 00:21:00-00:21:30 (a long repeated syllable), 00:24:30-00:25:00 (a long repeated syllable) | Not recoverable | Clarity, Loop check | Open |
| A joke about a miser and a wolf, a remark that removing eyebrow hair kills memory cells, and a few lines on how the women described are to be recognised | ep24 00:16:00-00:17:30, 00:32:30-00:33:00 | A joke, an unsourced scientific remark and a sweeping description of a group of women; left out | Content rule, Accuracy | Open |

Resume point: mawkib-al-nour episode 25 (branch from origin/main).

(Correction to the ep24 note above: the episode 24 text added 4 new `about` edges, not 6.)

### mawkib-al-nour ep25 (12 Nov 2026)

15 points written for episode 25 (ar, en, ur); 12 needs_source marks per language file (ar 12, en 12, ur 12); 4 new `about` edges. Quran verses referenced only through passage links (10-105, 10-106, 7-144, 22-78, 55-1, 55-2, 55-3, 55-4, 2-36, 17-70, 7-33, 111-1, 2-9); none typed. Proposal for the founder, not applied: his account of Freud, Darwin and the church (ep25 00:05:30-00:11:30), the counts of occurrences in the Qur'an (00:08:00), the claim that a named institution wishes to take people from God's religion (00:26:00) and his statement that the Prophet asked Umar about his mind (00:25:00) are recorded as his, with no source; the transcript renders jahiliyya in several places as an unclear word and the text there follows the context.

| Excluded (mawkib-al-nour ep25) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings and the closing prayer | ep25 00:00:00-00:00:30 (greetings), 00:29:00-00:29:30 (closing) | Not lesson content | Content rule | Open |
| Garbled windows and loops | ep25 00:12:00-00:12:30 (a long repeated syllable), 00:15:00-00:15:30 (a long repeated word), 00:17:00 (a long repeated word), 00:26:30 (a long repeated letter), 00:27:00 (a long repeated word) | Not recoverable | Clarity, Loop check | Open |
| A hypothetical dialogue imagining Abu Jahl asking Umm Jamil to dance, partly garbled, and a remark on the stones used as a hearth and then worshipped, and a wedding-invitation aside with a cousin | ep25 00:20:00-00:21:00, 00:26:00-00:26:30 | An imagined dialogue and garbled asides | Clarity, Content rule | Open |

Resume point: mawkib-al-nour episode 26 (branch from origin/main).

(Correction to the ep25 note above: the episode 25 text added 2 new `about` edges, not 4.)

### mawkib-al-nour ep26 (12 Nov 2026)

18 points written for episode 26 (ar, en, ur); 12 needs_source marks per language file (ar 12, en 12, ur 12); 7 new `about` edges. Quran verses referenced only through passage links (3-8, 3-9, 45-23, 67-10, 21-69, 21-103); none typed. Proposal for the founder, not applied: his enumeration of seven roots of swerving after guidance (ep26 00:03:00; the seventh is unreadable in the transcript), his remark that a woman who prays but does not veil follows her desire and his statement about theses on the headscarf (00:08:00) are recorded as his; the sayings credited to Ibn Khaldun and Ibn Taymiyya (00:13:00) and the story of the ship (00:24:30) have no source.

| Excluded (mawkib-al-nour ep26) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening supplication and greetings, and the closing prayer | ep26 00:00:00-00:01:00 (supplication; recitation, Quran text never typed), 00:31:30-00:32:00 (closing) | Not lesson content | Content rule, Quran rule | Open |
| Garbled windows and loops | ep26 00:04:30 (a long repeated letter), 00:06:00-00:06:30 (a long repeated syllable), 00:16:30 (a long repeated letter), 00:19:00-00:19:30 (a long repeated letter), 00:30:30 (a long repeated word), 00:32:00 (a long repeated English syllable) | Not recoverable | Clarity, Loop check | Open |
| Remarks on a young man mocking scholars, an aside on the pronunciation of two names and on the names themselves, a remark on a dress worn to the university, and an aside on a woman's dress described in detail | ep26 00:06:30-00:07:00, 00:19:30-00:20:00, 00:21:30-00:23:00 | Garbled or a lesson on pronunciation and dress | Clarity | Open |

Resume point: mawkib-al-nour episode 27 (branch from origin/main).

(Correction to the ep26 note above: the episode 26 text added 2 new `about` edges, not 7.)

### mawkib-al-nour ep27 (12 Nov 2026)

21 points written for episode 27 (ar, en, ur); 11 needs_source marks per language file (ar 11, en 11, ur 11); 9 new `about` edges. Quran verses referenced only through passage links (3-64, 16-125, 109-6, 34-25, 42-13, 8-63, 4-35, 19-43, 19-47, 41-1, 74-18, 74-24, 74-25, 2-285, 2-85, 7-163, 49-17); none typed. Proposal for the founder, not applied: the juristic statements on zakat (ep27 00:37:00) are recorded as his, with no school named; the account of Aisha and Abu Bakr as arbiter (00:16:00), the story of Abu Sufyan and Umm Habiba (00:08:00) and the sayings credited to Muhammad al-Ghazali and Umar (00:25:00) have no source.

| Excluded (mawkib-al-nour ep27) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings and the closing prayer | ep27 00:00:00-00:00:30 (greetings; recitation, Quran text never typed), 00:41:00-00:41:30 (closing) | Not lesson content | Content rule, Quran rule | Open |
| Garbled windows and loops | ep27 00:03:30 (a long repeated syllable), 00:07:00 (a long repeated letter), 00:09:30-00:10:00 (a long repeated syllable), 00:26:30-00:27:00 (a long repeated word), 00:31:30 (a long repeated letter), 00:40:30-00:41:00 (a long repeated letter) | Not recoverable | Clarity, Loop check | Open |
| A passage (ep27 00:25:30-00:27:00) on the founding of the Zionist movement, a prediction credited to its founder, a named financier said to have bribed a government, and the claim that the leaders of the movement have no tie to Judaism; and a story about a man who would not divorce a difficult wife and a joke on remarriage | ep27 00:25:30-00:27:00, 00:17:30-00:18:30 | Unsourced claims about named kinds of people and a financier, including a conspiratorial claim; garbled joke; the theological statement on Judaism and the Torah at 00:27:00 is kept | Accuracy, Content rule | Open; proposal for the founder to decide |

Resume point: mawkib-al-nour episode 28 (branch from origin/main). Episode 29 in the harvest is byte-identical in transcript and audio hash to episode 28 and is not written as a second episode.

### mawkib-al-nour ep28 (12 Nov 2026)

18 points written for episode 28 (ar, en, ur); 15 needs_source marks per language file (ar 15, en 15, ur 15); 3 new `about` edges. Quran verses referenced only through passage links (29-60, 40-3, 40-60, 2-186, 3-110, 78-31, 9-51, 51-22, 51-23, 9-111); none typed. Proposal for the founder, not applied: the statistic reducing seven billion people to a hundred and the figures with it (ep28 00:15:00-00:18:00) are recorded as his with no source; his statements on the embryo's oxygen and waste (00:10:00), the rule on dutifulness to parents and the fire (00:14:00), the story of Rib'i ibn Amir and Rustam with its numbers (00:27:00), and the sayings credited to Umar and Ibn Ata (00:18:30) have no source.

**Episode 29 is the same recording as episode 28.** The two transcripts in `pass5-qwen` (`ep28.txt` and `ep29.txt`, 48,891 bytes each) are byte-identical, and the `input_sha256` of the audio in `ep28.meta.json` and `ep29.meta.json` is the same (843a9c87485e5e075144cad1261df7a1a4884daaf030df50da9c401e0512f30f), with the same duration of 2474.1 seconds. Episode 29 is therefore a duplicate download and is not written as a second episode; the harvest needs the real audio of episode 29 fetched again before it can be mined.

| Excluded (mawkib-al-nour ep28) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings and supplication, and the closing prayer | ep28 00:00:00-00:01:30 (supplication; recitation, Quran text never typed), 00:41:00-00:41:30 (closing) | Not lesson content | Content rule, Quran rule | Open |
| Garbled windows and loops | ep28 00:07:00 (a long repeated letter), 00:09:30-00:10:00 (a long repeated word), 00:15:00-00:15:30 (a long repeated letter), 00:26:00 (a long repeated word), 00:31:00 (a long repeated syllable) | Not recoverable | Clarity, Loop check | Open |
| An aside on a hospital-style description of who deserves the dormant accounts, a remark on how a person reaches the state, and a partly garbled passage about perfume testing and a child tasting dates in a shop | ep28 00:05:30-00:06:30, 00:13:30-00:14:00, 00:39:30-00:40:00 | Garbled or illustrative | Clarity | Open |

Resume point: none; episodes 1 to 28 of mawkib-al-nour are written. Episode 29 needs a new recording.

## modakirate-iblis (Mudhakkirat Iblis), episodes 1 onward (12 Nov 2026, Claude Code claude-sonnet-5-5)

Lane C. Series record `work/modakirate-iblis` created (no earlier record existed). Source folder: `books/assabile/omar-abdelkafy/modakirate-iblis/pass5-qwen`, 30 episodes (ep01 to ep30). Size check at start: ep08 is 7,476 bytes against 24,000 to 31,000 for the others, so it is likely truncated (read it before writing it); no byte-identical pairs were found by checksum.

### modakirate-iblis ep01 (12 Nov 2026)

21 points written for episode 1 (ar, en, ur); 13 needs_source marks in each language file; 11 `about` edges. Quran verses referenced only through passage links (7-16, 7-17, 11-75, 23-60); none typed. Proposal for the founder, not applied: the lecturer's account of the devils of mankind as having surpassed Iblis (00:06:00) and the unsourced claims about how long Iblis lives (00:04:00) are recorded as his statements.

| Excluded (modakirate-iblis ep01) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break trailer, and the closing prayer | ep01 00:00:00, 00:11:30-00:13:30, 00:25:30 | Not lesson content (a trailer for another programme and closing supplication) | Content rule | Open |
| A garbled loop of repeated syllables | ep01 00:22:30 (the second half of the window) | Not recoverable | Clarity, Loop check | Open |
| A remark that the English word for covering sounds like the Arabic word, in the explanation of kufr | ep01 00:19:30 (part) | Garbled and unreliable | Clarity | Open |

Resume point: modakirate-iblis episode 2 (branch from origin/main).

### modakirate-iblis ep02 (12 Nov 2026)

18 points written for episode 2 (ar, en, ur); 8 needs_source marks in each language file; 7 new `about` edges. Quran verses referenced only through passage links (2-45, 9-40, 20-46, 26-78, 26-79, 26-80, 63-8); none typed.

| Excluded (modakirate-iblis ep02) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break trailer, and the closing prayer | ep02 00:00:00, 00:11:00-00:13:00, 00:24:00-00:25:00 | Not lesson content (trailer for other programmes, closing supplication, a sung ending) | Content rule | Open |
| A long loop of repeated syllables | ep02 00:06:00 | Not recoverable | Clarity, Loop check | Open |
| A garbled stretch about the Companions reaching a percentage of what the Prophet wanted | ep02 00:20:30-00:21:00 (part) | Garbled and unreliable | Clarity | Open |

Resume point: modakirate-iblis episode 3 (branch from origin/main).

### modakirate-iblis ep03 (12 Nov 2026)

15 points written for episode 3 (ar, en, ur); 7 needs_source marks in each language file; 5 new `about` edges. Quran verses referenced only through passage links (22-38, 16-128, 36-82, 38-42, 49-13, 20-18); none typed. The lecturer's call to reflect on the Qur'an (00:03:30) is not linked because the transcript does not say which verse.

| Excluded (modakirate-iblis ep03) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break trailer and the closing prayer | ep03 00:00:00, 00:11:30, 00:23:00-00:24:00 | Not lesson content | Content rule | Open |
| A long loop of repeated syllables | ep03 00:09:00 (part), 00:20:00 (part) | Not recoverable | Clarity, Loop check | Open |
| A garbled stretch of the Bedouin story with unclear diacritics | ep03 00:04:30 (the opening words) | Partly garbled, only the clear sense used | Clarity | Open |

Resume point: modakirate-iblis episode 4 (branch from origin/main).

### modakirate-iblis ep04 (12 Nov 2026)

14 points written for episode 4 (ar, en, ur); 7 needs_source marks in each language file; 4 new `about` edges. Quran verses referenced only through passage links (2-65, 2-67, 2-71, 2-73, 6-153, 2-181); none typed. Proposal for the founder, not applied: the lecturer's rulings and criticisms in this episode (the hijab as he describes it, cosmetic practices, wills in favour of daughters, the deferred dower) are recorded only as his opinion, with no perspectives block added; the series record stays `sensitivity: contested`.

| Excluded (modakirate-iblis ep04) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Break trailer and closing prayer | ep04 00:10:00-00:11:30, 00:22:30-00:23:00 | Not lesson content | Content rule | Open |
| An anecdote about a named living billionaire and his fiancee, the engagement gift and a charitable foundation, with remarks on jewellers and gold coins | ep04 00:16:00-00:17:30 | Unverified claim about a named living person; garbled in parts | Sourcing, Clarity | Open |
| The fractions he gives for the daughters' and the paternal uncle's shares | ep04 00:20:00-00:20:30 | Garbled in the transcript, shares not restated | Clarity | Open |

Resume point: modakirate-iblis episode 5 (branch from origin/main).

### modakirate-iblis ep05 (12 Nov 2026)

13 points written for episode 5 (ar, en, ur); 9 needs_source marks in each language file; 5 new `about` edges. Quran verses referenced only through passage links (42-49, 2-228, 4-19, 2-229); none typed. Proposal for the founder, not applied: the lecturer's statements about the sale of a woman in London, the slave ships of a British queen and segregation signs in America (00:19:00 to 00:20:30) are unsourced figures; they are kept as his statements with needs_source marks and may be dropped if the founder prefers.

| Excluded (modakirate-iblis ep05) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, break trailer and closing prayer | ep05 00:00:00, 00:11:00-00:13:00, 00:24:00-00:24:30 | Not lesson content | Content rule | Open |
| A loop of repeated syllables and a stretch about missionaries on slave ships | ep05 00:11:00, 00:20:00 (second half) | Not recoverable | Clarity, Loop check | Open |
| A garbled stretch on the woman's hadith about two suitors (the second suitor's fault) | ep05 00:18:00-00:18:30 (part) | Garbled, only the clear sense used | Clarity | Open |

Resume point: modakirate-iblis episode 6 (branch from origin/main).

### modakirate-iblis ep06 (12 Nov 2026)

13 points written for episode 6 (ar, en, ur); 7 needs_source marks in each language file; 4 new `about` edges. Quran verses referenced only through passage links (24-31, 4-34, 83-1, 4-1, 6-153); none typed. Proposal for the founder, not applied: the lecturer's remarks on same-sex marriage and on girls who imitate boys are recorded only as his view, briefly and without his anecdotes.

| Excluded (modakirate-iblis ep06) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, break trailers and closing prayer | ep06 00:00:00-00:00:30, 00:11:00-00:12:30, 00:23:30-00:24:00 | Not lesson content (the trailer is for a history programme by another speaker) | Content rule | Open |
| An anecdote of a municipal official in France who is said to have killed himself, and a claim about an unnamed imam in Europe said to have opened a mosque to a particular prayer | ep06 00:05:30-00:06:30 | Unverified claims about unnamed or private persons; partly garbled | Sourcing, Clarity | Open |
| A garbled stretch on the divine legislation of the church and the middle ages, and a loop | ep06 00:08:00-00:08:30 | Not recoverable | Clarity, Loop check | Open |

Resume point: modakirate-iblis episode 7 (branch from origin/main).

### modakirate-iblis ep07 (12 Nov 2026)

13 points written for episode 7 (ar, en, ur); 6 needs_source marks in each language file; 5 new `about` edges. Quran verses referenced only through passage links (4-59, 14-27, 41-31); none typed. Proposal for the founder, not applied: the lecturer's remark that a person ready for money accepts whatever ruling suits him (00:07:00) and his reference to the councils of jurists on bank interest are recorded only as his analogy and not as a position on the question.

| Excluded (modakirate-iblis ep07) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break trailer (a programme advert and a sponsor notice), and the closing prayer | ep07 00:00:00, 00:11:30-00:13:00, 00:23:30-00:24:00 | Not lesson content | Content rule | Open |
| A garbled aside on carpet manufacture and a long loop | ep07 00:01:30-00:02:00, 00:07:00 (end), 00:14:30-00:15:30 | Not recoverable | Clarity, Loop check | Open |
| The remark on bank interest and the councils of jurists | ep07 00:07:00-00:07:30 | Half-clear, no ruling given | Clarity | Open |

Resume point: modakirate-iblis episode 8 (branch from origin/main). Episode 8 is a short transcript (7,476 bytes against about 24,000 to 31,000 for the others) and is probably truncated: read it fully before writing, and write only what the transcript holds.

### modakirate-iblis ep08 (12 Nov 2026)

7 points written for episode 8 (ar, en, ur); 4 needs_source marks in each language file; 2 new `about` edges. Quran verses referenced only through passage links (7-23, 6-164, 17-13, 17-14, 28-15, 28-16, 9-118, 40-60); none typed. Source note: the audio is 866.6 seconds, but the transcript ends at 00:06:30 (about seven minutes), so roughly half of the recording is missing from the transcript, and the transcript starts mid-sentence. Only what the transcript holds was written.

| Excluded (modakirate-iblis ep08) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| A repeated phrase loop and a garbled aside on the Prophet's changing of dress | ep08 00:00:30-00:01:00, 00:05:30 | Not recoverable | Clarity, Loop check | Open |
| The second half of the recording | ep08 after 00:07:00 | Not in the transcript (transcript ends mid-sentence) | Source completeness | Open |

Resume point: modakirate-iblis episode 9 (branch from origin/main).

### modakirate-iblis ep09 (12 Nov 2026)

15 points written for episode 9 (ar, en, ur); 7 needs_source marks in each language file; 5 new `about` edges. Quran verses referenced only through passage links (72-18, 3-97, 12-28, 27-34, 4-76, 55-29, 40-29, 26-88, 26-89); none typed. Proposal for the founder, not applied: the lecturer's reading that the governor's words (12-28) are a man's statement and not the Quran's verdict on women is recorded as his view only.

| Excluded (modakirate-iblis ep09) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break (a repeated jingle), and the closing prayer | ep09 00:00:00, 00:11:00-00:11:30, 00:22:30 | Not lesson content | Content rule | Open |
| A long loop of a repeated jingle line | ep09 00:11:00 | Not recoverable | Clarity, Loop check | Open |
| A garbled stretch on what the angels say in the grave and on the wife's qualifications | ep09 00:05:00 | Loop, nothing safely restated | Clarity, Loop check | Open |

Resume point: modakirate-iblis episode 10 (branch from origin/main).

### modakirate-iblis ep10 (12 Nov 2026)

12 points written for episode 10 (ar, en, ur); 7 needs_source marks in each language file; 5 new `about` edges. Quran verses referenced only through passage links (49-12, 24-59); none typed. Proposal for the founder, not applied: the lecturer's opinions on marriage between relatives and on honest employees as recipients of almsgiving (00:06:00 to 00:07:00) are recorded as his opinions only.

| Excluded (modakirate-iblis ep10) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break (a relief-organisation appeal for Syria and an advert for a charity evening), and the closing prayer | ep10 00:00:00, 00:11:30-00:12:30, 00:23:30-00:24:00 | Not lesson content | Content rule | Open |
| A loop and garbled stretches (the husband's father's name, a verse of poetry on beauty, phone-number talk) | ep10 00:03:30-00:04:30, 00:07:30-00:08:00, 00:14:00-00:14:30, 00:22:00 | Not recoverable | Clarity, Loop check | Open |

Resume point: modakirate-iblis episode 11 (branch from origin/main).

### modakirate-iblis ep11 (12 Nov 2026)

13 points written for episode 11 (ar, en, ur); 7 needs_source marks in each language file; 4 new `about` edges. Quran verses referenced only through passage links (14-7, 9-60, 34-15, 7-157, 9-51, 27-40, 38-35, 51-56, 12-24); none typed.

| Excluded (modakirate-iblis ep11) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break trailers and the closing prayer | ep11 00:00:00, 00:11:00-00:12:00, 00:22:30-00:23:00 | Not lesson content | Content rule | Open |
| A claim that a named country imports butter worth seven billion dollars, with a reference to a cartoon controversy | ep11 00:02:30-00:03:30 | Unsourced figure about a country and a political incident | Sourcing | Open |
| A garbled loop of one vowel and a stretch on the smokers' habits and urban rules | ep11 00:09:30, 00:14:30-00:15:00 | Not recoverable | Clarity, Loop check | Open |

Resume point: modakirate-iblis episode 12 (branch from origin/main).

### modakirate-iblis ep12 (12 Nov 2026)

14 points written for episode 12 (ar, en, ur); 7 needs_source marks in each language file; 6 new `about` edges. Quran verses referenced only through passage links (14-24, 14-25, 14-26, 43-32, 42-38, 59-10, 15-47, 39-53); none typed.

| Excluded (modakirate-iblis ep12) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break trailer (a relief-organisation appeal and a charity-evening advert), and the closing prayer | ep12 00:00:00, 00:11:30-00:12:30, 00:23:30-00:24:00 | Not lesson content | Content rule | Open |
| A garbled stretch on ablution and a prayer after it, and a loop | ep12 00:22:00-00:22:30 (part), 00:11:00 (part), 00:18:30-00:19:00 | Not recoverable | Clarity, Loop check | Open |
| A garbled stretch of poetry about the fortunes of the learned and the ignorant | ep12 00:05:30-00:06:00 | Garbled | Clarity | Open |

Resume point: modakirate-iblis episode 13 (branch from origin/main).

### modakirate-iblis ep13 (12 Nov 2026)

13 points written for episode 13 (ar, en, ur); 10 needs_source marks in each language file for this episode; 9 new `about` edges. Quran verses referenced only through passage links (1-2, 1-4, 1-5, 6-162, 64-14, 26-78 to 26-80, 18-82); none typed.

| Excluded (modakirate-iblis ep13) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break and its trailer, and the closing prayer and outro chant | ep13 00:00:00, 00:11:00-00:12:00, 00:22:30-00:23:30 | Not lesson content | Content rule | Open |
| A garbled stretch with an anatomical claim about the word for prayer and the spine | ep13 00:02:30-00:03:00 | Garbled, unsourced | Clarity | Open |
| Garbled and looping stretches on loving what God hates and on the Prophet as a mount of love | ep13 00:09:00 (part), 00:18:00-00:19:00 (part), 00:19:00-00:19:30, 00:22:00 (part) | Not recoverable | Clarity, Loop check | Open |

Resume point: modakirate-iblis episode 14 (branch from origin/main).

### modakirate-iblis ep14 (14 Nov 2026)

15 points written for episode 14 (ar, en, ur); 8 needs_source marks in each language file for this episode; 6 new `about` edges (the rest were already present). Quran verses referenced only through passage links (7-20 to 7-23, 2-30, 2-166, 2-167, 7-31, 7-32, 28-77, 28-79, 28-83, 3-133, 3-134, 12-106); none typed.

| Excluded (modakirate-iblis ep14) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break and its trailer (a relief-organisation appeal for Syria with an evening broadcast advert), and the closing prayer and outro chant | ep14 00:00:00, 00:10:30-00:13:00, 00:23:30-00:24:00 | Not lesson content | Content rule | Open |
| Loops and garbled stretches (an invitation to a party, a stretch before the verses on followers disowning leaders, the lines before the break) | ep14 00:08:30-00:09:30, 00:10:30-00:11:00 | Not recoverable | Clarity, Loop check | Open |
| Asides on globalisation and a "new world order" in the account of Adam's belief in Iblis's oath | ep14 00:03:00-00:03:30 | Garbled, off the lesson | Clarity | Open |

Resume point: modakirate-iblis episode 15 (branch from origin/main).

### modakirate-iblis ep15 (14 Nov 2026)

17 points written for episode 15 (ar, en, ur); 8 needs_source marks in each language file for this episode; 8 new `about` edges (correction to the ep14 note: its new edges were 4, not 6). Quran verses referenced only through passage links (51-22, 71-10 to 71-12, 26-61, 26-62, 9-40, 20-46, 28-7, 21-87, 21-83, 21-84, 7-23, 2-186); none typed.

| Excluded (modakirate-iblis ep15) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break, and the closing prayer and outro chant | ep15 00:00:00, 00:11:00-00:12:30, 00:23:30-00:24:00 | Not lesson content | Content rule | Open |
| A garbled supplication attributed to Yahya, and a garbled stretch on the cause of the mother's blood and of "the dearest" | ep15 00:02:30 (part), 00:05:30 (part) | Not recoverable | Clarity | Open |
| A long run of one repeated letter | ep15 00:19:00-00:19:30 | Loop | Loop check | Open |
| A passing address to the people of Syria and the oppressed, in the account of the unseen world | ep15 00:19:30-00:20:00 (part) | Modern conflict aside, held for the founder to decide under the content-safety rule | Content rule | Open |

Resume point: modakirate-iblis episode 16 (branch from origin/main).

### modakirate-iblis ep16 (14 Nov 2026)

17 points written for episode 16 (ar, en, ur); 10 needs_source marks in each language file for this episode; 7 new `about` edges. Quran verses referenced only through passage links (7-12, 39-22, 17-19, 17-20, 78-10, 78-11, 51-18, 37-143, 37-144, 21-87, 17-45); none typed.

| Excluded (modakirate-iblis ep16) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break and its trailer (a relief-organisation appeal for Syria with an evening broadcast advert), and the closing prayer | ep16 00:00:00, 00:10:30-00:12:30, 00:24:00 | Not lesson content | Content rule | Open |
| A loop and a garbled stretch on a poem about the hard heart | ep16 00:04:00-00:04:30, 00:05:30 (part), 00:09:30-00:10:00 | Not recoverable | Clarity, Loop check | Open |
| A passing remark about the marriage proposal and the dawn prayer | ep16 00:18:30-00:19:00 | Garbled | Clarity | Open |

Resume point: modakirate-iblis episode 17 (branch from origin/main).

### modakirate-iblis ep17 (14 Nov 2026)

14 points written for episode 17 (ar, en, ur); 3 new `about` edges; 4 needs_source marks in each language file for this episode; Quran verse referenced only through a passage link (2-189), none typed. Sensitivity stays contested: the lecturer's views on mixed settings, schooling and sex education are labelled as his, and the unsourced historical and statistical claims are marked as needing a source.

| Excluded (modakirate-iblis ep17) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break and the closing prayer | ep17 00:00:00, 00:11:00-00:11:30, 00:23:00-00:23:30 | Not lesson content | Content rule | Open |
| Loops and garbled stretches (a broken comparison with the time of Uthman, a loop of a spoken name list, a stretch on newsreaders) | ep17 00:02:00-00:03:30 (part), 00:04:30, 00:06:00, 00:07:00-00:08:00, 00:10:00-00:10:30, 00:12:30 | Not recoverable | Clarity, Loop check | Open |
| A long run of digits in the account of the nurse's sentence | ep17 00:13:30 (part) | Loop | Loop check | Open |
| Lament over the loss of Jerusalem, Andalusia, Iraq and the Levant and the Muslim world's dependence | ep17 00:18:30-00:19:30 | Modern political aside outside the lesson; held for the founder to decide | Content rule | Open |

Resume point: modakirate-iblis episode 18 (branch from origin/main).

### modakirate-iblis ep18 (14 Nov 2026)

13 points written for episode 18 (ar, en, ur); 7 needs_source marks in each language file for this episode; 7 new `about` edges. Quran verses referenced only through passage links (61-4, 12-76); none typed. Topics on Jerusalem, women's inheritance and imitation of the West are the lecturer's own views, labelled as his, and sensitivity stays contested.

| Excluded (modakirate-iblis ep18) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break (including a read-out of a hadith on fasting that is part of the break, not the lesson), and the closing prayer | ep18 00:00:00, 00:11:30-00:13:00, 00:24:00 | Not lesson content | Content rule | Open |
| Loops and garbled stretches (scouting and the Salim story, a stretch on women's matters, a stretch on ships) | ep18 00:04:30-00:05:00, 00:17:00-00:18:00 | Not recoverable | Clarity, Loop check | Open |
| A political remark on the people holding Jerusalem since 1948 | ep18 00:01:30-00:02:00 (part) | Modern conflict aside; the lesson point on supplication and means is kept without it, held for the founder to decide | Content rule | Open |

Resume point: modakirate-iblis episode 19 (branch from origin/main).

### modakirate-iblis ep19 (14 Nov 2026)

12 points written for episode 19 (ar, en, ur); 5 needs_source marks in each language file for this episode; 4 new `about` edges. Quran verses referenced only through passage links (42-27, 25-20, 28-7, 20-39, 13-13, 14-34, 113-4); none typed.

| Excluded (modakirate-iblis ep19) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break and its trailer (an advert for a television programme), and the closing prayer | ep19 00:00:00, 00:10:30-00:12:30, 00:23:30-00:24:00 | Not lesson content | Content rule | Open |
| An unsourced anecdote about the death of a named wealthy banker linked to a political declaration, and sweeping remarks about a whole people and about the media | ep19 00:05:00-00:06:30 (part), 00:12:30 (part), 00:16:30-00:17:30 | Unsourced and a group generalisation; not written in the museum's voice; held for the founder to decide | Content rule, Voice rule | Open |
| An unsourced claim about the eating of pork and loss of protective jealousy, and a prediction of the West's decline | ep19 00:17:30-00:19:00 | Unsourced and disparaging; held for the founder to decide | Content rule | Open |
| Garbled and looping stretches | ep19 00:08:30-00:09:00, 00:18:00-00:18:30, 00:20:00 (part) | Not recoverable | Clarity, Loop check | Open |

Resume point: modakirate-iblis episode 20 (branch from origin/main).

### modakirate-iblis ep20 (14 Nov 2026)

15 points written for episode 20 (ar, en, ur); 8 needs_source marks in each language file for this episode; 11 new `about` edges. Quran verses referenced only through passage links (3-33 to 3-37, 3-42, 96-1); none typed. Sensitivity stays contested: his claims about the poisoning of Umar ibn Abd al-Aziz and the choice of Uthman over Ali are attributed to him and marked as needing a source.

| Excluded (modakirate-iblis ep20) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break and its trailer (an advert for a Ramadan question-and-answer programme), and the closing prayer | ep20 00:00:00, 00:10:30-00:12:30, 00:23:30-00:24:00 | Not lesson content | Content rule | Open |
| Loops and garbled stretches (psychology remarks, a stretch on Mary, the counting of a life) | ep20 00:07:30-00:08:00, 00:15:30-00:16:00, 00:17:30-00:18:00, 00:20:30-00:21:00 | Not recoverable | Clarity, Loop check | Open |

Resume point: modakirate-iblis episode 21 (branch from origin/main).

### modakirate-iblis ep21 (14 Nov 2026)

14 points written for episode 21 (ar, en, ur); 11 needs_source marks in each language file for this episode; 3 new `about` edges. Quran verses referenced only through passage links (12-106, 51-22, 19-25, 3-37, 17-45, 58-1, 24-58, 48-10); none typed.

| Excluded (modakirate-iblis ep21) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break and its trailer (advertisements for a Ramadan question programme with its sponsors), the closing prayer and the outro chant | ep21 00:00:00, 00:11:30-00:13:00, 00:24:00-00:25:00 | Not lesson content | Content rule | Open |
| A garbled opening remark about a person walking astray, and loops and garbled stretches (a stretch on an actor, a stretch before the thief report) | ep21 00:00:30 (part), 00:01:00 (part), 00:19:30-00:20:00, 00:22:30-00:23:00 | Not recoverable | Clarity, Loop check | Open |

Resume point: modakirate-iblis episode 22 (branch from origin/main). Work on episodes 14 to 30 of this series and on the three following series is covered by the founder approval recorded as dec-20261114-277.

### modakirate-iblis ep22 (14 Nov 2026)

12 points written for episode 22 (ar, en, ur); 9 needs_source marks in each language file for this episode; 5 new `about` edges. Quran verse referenced only through a passage link (7-32); none typed.

| Excluded (modakirate-iblis ep22) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break and its trailer (advertisements for a Ramadan question programme with its sponsors), and the closing prayer | ep22 00:00:00, 00:11:30-00:14:30, 00:25:30-00:26:00 | Not lesson content | Content rule | Open |
| Loops and garbled stretches | ep22 00:14:00 (part), 00:18:30-00:19:00, 00:22:00 (part) | Not recoverable | Clarity, Loop check | Open |
| A mention of refugee crises in the account of the crisis fund | ep22 00:11:00-00:11:30 (part) | Modern conflict aside; the proposal itself is kept without it, held for the founder to decide | Content rule | Open |

Resume point: modakirate-iblis episode 23 (branch from origin/main). Work on this series and the three following ones is covered by the founder approval dec-20261114-277.

### modakirate-iblis ep23 (14 Nov 2026)

12 points written for episode 23 (ar, en, ur); 6 needs_source marks in each language file for this episode; 5 new `about` edges. Quran verses referenced only through passage links (1-6, 1-7, 5-16, 6-153, 42-13, 2-128, 2-132, 2-133, 27-44, 72-14, 3-102, 39-45, 17-36, 5-54); none typed. Contested: the lecturer's remarks on Islamic groups and on early caliphal decisions are attributed to him; sensitivity stays contested.

| Excluded (modakirate-iblis ep23) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break and its trailer (advertisements for a Ramadan question programme with its sponsors), and the closing prayer | ep23 00:00:00, 00:11:00-00:12:30, 00:23:30 | Not lesson content | Content rule | Open |
| Loops and garbled stretches (a repeated phrase over about thirty seconds, a stretch naming a medieval scholar, partial stretches on the Prophet's orchard) | ep23 00:03:30-00:04:00, 00:14:30 (part), 00:20:30-00:21:00, 00:22:00-00:22:30 | Not recoverable | Clarity, Loop check | Open |

Resume point: modakirate-iblis episode 24 (branch from origin/main).

### modakirate-iblis ep24 (14 Nov 2026)

12 points written for episode 24 (ar, en, ur); 5 needs_source marks in each language file for this episode; 4 new `about` edges. Quran verses referenced only through passage links (18-18, 18-32 to 18-42 in part, 22-1, 22-2, 10-24, 28-78, 3-133, 57-21, 62-10, 20-84, 27-40); none typed. The report on the death of Abu Talib is attributed to the lecturer and marked as needing a source; the Sunni position on it is not stated here.

| Excluded (modakirate-iblis ep24) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break and its trailer (advertisements for a Ramadan question programme with its sponsors), and the closing prayer and outro chant | ep24 00:00:00, 00:10:30-00:13:00, 00:24:00 | Not lesson content | Content rule | Open |
| A closing supplication for the people of Syria and the oppressed | ep24 00:23:30 (part) | Modern conflict aside, held for the founder to decide | Content rule | Open |
| Loops and garbled stretches (the rest of the praise of the righteous, a stretch on the world turning away, a stretch before the smoking claim) | ep24 00:08:00 (part), 00:15:00-00:15:30, 00:17:30-00:18:00 | Not recoverable | Clarity, Loop check | Open |

Resume point: modakirate-iblis episode 25 (branch from origin/main).

### modakirate-iblis ep25 (14 Nov 2026)

14 points written for episode 25 (ar, en, ur); 11 needs_source marks in each language file for this episode; 7 new `about` edges. Quran verses referenced only through passage links (49-11, 34-24, 34-25, 36-20, 36-26, 36-27); none typed.

| Excluded (modakirate-iblis ep25) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| A loop of one welcoming phrase for the first thirty seconds, the break and its trailer (advertisements for a Ramadan question programme with its sponsors), and the closing prayer | ep25 00:00:00, 00:10:30-00:12:30, 00:23:30-00:24:00 | Not lesson content | Content rule, Loop check | Open |
| Loops and garbled stretches (a repeated address to the brother, the rest of the dialogue on the verse of mockery, the closing list) | ep25 00:07:00, 00:13:30 (part), 00:14:00 (part), 00:17:30-00:18:00, 00:23:00-00:23:30 | Not recoverable | Clarity, Loop check | Open |
| A garbled report on the marriage of the Persian king's daughter | ep25 00:09:30-00:10:00 (part) | Garbled, unsourced | Clarity | Open |

Resume point: modakirate-iblis episode 26 (branch from origin/main).

### modakirate-iblis ep26 (14 Nov 2026)

11 points written for episode 26 (ar, en, ur); 8 needs_source marks in each language file for this episode; 2 new `about` edges. Quran verses referenced only through passage links (20-132, 4-86, 9-80, 9-84, 63-8, 21-107, 59-7, 26-224 to 26-227); none typed. The description of Abd Allah ibn Ubayy as leader of the hypocrites is the lecturer's and is attributed to him.

| Excluded (modakirate-iblis ep26) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break and its trailer (advertisements for a Ramadan question programme with its sponsors), and the closing prayer | ep26 00:00:00, 00:11:00-00:13:00, 00:23:30-00:24:00 | Not lesson content | Content rule | Open |
| Loops and garbled stretches (a repeat of the break trailer, a stretch of repeated words before the self-letter, the end of the self-letter section) | ep26 00:12:30-00:13:00, 00:21:30-00:22:30 | Not recoverable | Clarity, Loop check | Open |

Resume point: modakirate-iblis episode 27 (branch from origin/main).

### modakirate-iblis ep27 (14 Nov 2026)

11 points written for episode 27 (ar, en, ur); 5 needs_source marks in each language file for this episode; 5 new `about` edges. Quran verses referenced only through passage links (3-165, 9-25, 3-125, 17-16, 34-34); none typed.

| Excluded (modakirate-iblis ep27) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break and its trailer (an advertisement for a programme describing Paradise), and the closing prayer and outro chant | ep27 00:00:00, 00:08:30-00:10:30, 00:22:00-00:22:30 | Not lesson content | Content rule | Open |
| A remark naming a state and its readers in the reading statistics, and a loop and garbled stretches (the stretch before the Ibn Khaldun claim, the stretch on kitchens and fashion houses) | ep27 00:15:30 (part), 00:11:30 (part), 00:16:30-00:17:30 (part) | Unsourced comparison on a named state and not recoverable stretches; held for the founder to decide | Content rule, Clarity, Loop check | Open |

Resume point: modakirate-iblis episode 28 (branch from origin/main).

### modakirate-iblis ep28 (14 Nov 2026)

12 points written for episode 28 (ar, en, ur); 4 needs_source marks in each language file for this episode; 5 new `about` edges. Quran verses referenced only through passage links (21-58, 21-59, 21-63, 2-127, 14-37, 37-102, 2-144, 2-149, 2-150, 89-27, 89-28, 12-53, 10-87); none typed. Contested: the lecturer's views on fatwas by satellite channels and on state-approved committees are labelled as his; sensitivity stays contested.

| Excluded (modakirate-iblis ep28) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break and its trailer (advertisements for a Ramadan question programme with its sponsors), and the closing prayer | ep28 00:00:00, 00:11:00-00:13:00, 00:24:30-00:25:00 | Not lesson content | Content rule | Open |
| Loops, garbled stretches and side remarks (a remark on the viewers of the channel, a story of a boy and a football match, a stretch on prescriptions about a monthly cycle, a stretch on healing treatments) | ep28 00:06:00-00:07:00 (part), 00:07:30-00:09:00 (part), 00:16:30-00:17:30 (part), 00:21:00-00:22:30 (part), 00:23:00 | Not recoverable or off the lesson | Clarity, Loop check | Open |

Resume point: modakirate-iblis episode 29 (branch from origin/main).

### modakirate-iblis ep29 (14 Nov 2026)

13 points written for episode 29 (ar, en, ur); 10 needs_source marks in each language file for this episode; 4 new `about` edges. Quran verses referenced only through passage links (36-26, 36-27, 1-5, 1-6, 59-9, 28-26, 12-55, 3-110); none typed.

| Excluded (modakirate-iblis ep29) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break (no trailer text in the recording) and the closing prayer and outro chant | ep29 00:00:00, 00:11:30-00:12:30, 00:23:30-00:24:00 | Not lesson content | Content rule | Open |
| Loops and garbled stretches (the brotherhood saying, the rest of the Hijr report, a stretch on the Prophet's treatment of customs, the Tabuk distance) | ep29 00:05:00-00:05:30 (part), 00:06:00-00:06:30, 00:21:30-00:22:30 | Not recoverable | Clarity, Loop check | Open |

Resume point: modakirate-iblis episode 30 (branch from origin/main).

### modakirate-iblis ep30 (14 Nov 2026)

12 points written for episode 30 (ar, en, ur); 8 needs_source marks in each language file for this episode; 2 new `about` edges. Quran verses referenced only through passage links (28-23, 20-117 to 20-119, 22-2); none typed. Contested: the lecturer's views on women's work, mixing and the family are labelled as his; sensitivity stays contested. The series is complete at 30 episodes; the gap at the start of episode 8 stays logged and is not filled.

| Excluded (modakirate-iblis ep30) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break and its trailer (advertisements for a programme on a Quran chapter and a commentator), and the closing prayer | ep30 00:00:00, 00:11:00-00:13:00, 00:26:30 | Not lesson content | Content rule | Open |
| A claim that an international secret society planned to bring women into the workforce to corrupt the world | ep30 00:02:30-00:03:00 (part) | Unsourced conspiracy claim naming a group; not written in the museum's voice; held for the founder to decide | Content rule, Voice rule | Open |
| Loops and garbled stretches (the sixties television anecdote, a stretch before the Midian story, the account of the Qasas conditions) | ep30 00:07:00-00:08:30, 00:10:00 (part), 00:11:00 (part) | Not recoverable | Clarity, Loop check | Open |

Resume point: modakirate-iblis is finished (30 of 30 episodes). Next series in the lane order: min-kunuz-al-sunnah, from episode 1. Work covered by the founder approval dec-20261114-277.

### min-kunuz-al-sunnah ep01 (14 Nov 2026)

New record work/min-kunuz-al-sunnah (series record, sensitivity contested) with episode 1 written in ar, en and ur (draft, provenance); 15 points; 10 needs_source marks in each language file; 14 `about` edges. Quran verses referenced only through passage links (33-36, 4-65, 3-31, 9-111, 9-60, 20-117 to 20-119, 18-94, 18-95, 59-7, 5-90, 2-284, 2-285); none typed. The lecturer's views on zakat by analogy and on the veil are labelled as his; work covered by the founder approval dec-20261114-277.

| Excluded (min-kunuz-al-sunnah ep01) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings and the Ramadan supplications, the break joins and the closing prayer | ep01 00:00:00, 00:01:30-00:02:30 (part), 00:10:30-00:11:00, 00:28:30-00:29:30 | Not lesson content | Content rule | Open |
| A remark commending one named state's choice of administrators, and a supplication for the oppressed in the east and west of the earth | ep01 00:21:30-00:22:00 (part), 00:01:30-00:02:00 (part) | Modern political aside; held for the founder to decide | Content rule | Open |
| Loops and garbled stretches (about Hafsa walking in Medina's street, a stretch of legal hesitation, the sale-purchase restatement) | ep01 00:08:30-00:09:00 (part), 00:26:00-00:26:30, 00:29:30 | Not recoverable | Clarity, Loop check | Open |

Resume point: min-kunuz-al-sunnah episode 2 (branch from origin/main).

### min-kunuz-al-sunnah ep02 (14 Nov 2026)

11 points written for episode 2 (ar, en, ur); 9 needs_source marks in each language file for this episode; -14 new `about` edges. Quran verses referenced only through passage links (30-41, 11-61); none typed.

| Excluded (min-kunuz-al-sunnah ep02) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings and supplications, the break joins and the closing prayer | ep02 00:00:00, 00:09:30-00:10:00, 00:27:00-00:27:30 | Not lesson content | Content rule | Open |
| A long run of one letter, a run of repeated sounds, and a repeated loop at the end | ep02 00:01:30, 00:16:00, 00:27:30 | Loop | Loop check | Open |
| Garbled stretches (the question put to the Prophet about the Hour in the second telling, the spellings of the bird's three sayings, a stretch on an official's secretary) | ep02 00:15:00-00:16:00 (part), 00:26:00-00:27:00 (part), 00:21:00-00:22:00 (part) | Not recoverable | Clarity | Open |

Resume point: min-kunuz-al-sunnah episode 3 (branch from origin/main).

### min-kunuz-al-sunnah ep03 (14 Nov 2026)

11 points written for episode 3 (ar, en, ur); 8 needs_source marks in each language file for this episode; 7 new `about` edges. Quran verses referenced only through passage links (31-13, 49-13); none typed. Contested: the lecturer's remark on divorce in anger is the disputed juristic point and is given as two reported opinions without a source; sensitivity stays contested.

| Excluded (min-kunuz-al-sunnah ep03) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break joins and the closing prayer | ep03 00:00:00, 00:08:30-00:09:00, 00:16:00-00:16:30 (part), 00:26:00 | Not lesson content | Content rule | Open |
| Loops and garbled stretches (a run of one sound, a stretch comparing the police and a criminal, a stretch on the repetition of a request for divorce, the end of the story of Harun al-Rashid) | ep03 00:00:30, 00:06:30, 00:07:00 (part), 00:25:00-00:25:30 | Not recoverable | Clarity, Loop check | Open |

Resume point: min-kunuz-al-sunnah episode 4 (branch from origin/main).

### min-kunuz-al-sunnah ep04 (14 Nov 2026)

10 points written for episode 4 (ar, en, ur); 7 needs_source marks in each language file for this episode; 3 new `about` edges; no Quran verse cited by the lecturer in this episode.

| Excluded (min-kunuz-al-sunnah ep04) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break joins and the closing prayer | ep04 00:00:00, 00:08:30-00:09:00, 00:17:00-00:17:30, 00:27:30 | Not lesson content | Content rule | Open |
| Garbled stretches and side remarks (a stretch on fruit seasons and artificial milk, a closing stretch on ageing and cosmetics) | ep04 00:02:30-00:04:00, 00:25:30-00:26:00 | Not recoverable or off the lesson | Clarity | Open |

Resume point: min-kunuz-al-sunnah episode 5 (branch from origin/main).

### min-kunuz-al-sunnah ep05 (14 Nov 2026)

12 points written for episode 5 (ar, en, ur); 6 needs_source marks in each language file for this episode; 6 new `about` edges. Quran verses referenced only through passage links (9-103, 49-12, 24-30, 2-3, 9-111); none typed. Contested: the lecturer's view on handshakes between men and women is a disputed juristic question and is attributed to him; sensitivity stays contested.

| Excluded (min-kunuz-al-sunnah ep05) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break joins and the closing prayer | ep05 00:00:00, 00:10:00-00:10:30, 00:19:00-00:19:30, 00:26:30-00:27:30 | Not lesson content | Content rule | Open |
| A naming of three peoples whose refugee camps he suggests visiting | ep05 00:16:00-00:16:30 (part) | Modern conflict aside; the proposal to visit camps is kept without the names, held for the founder to decide | Content rule | Open |
| Garbled stretches (the cases of intention and finding in the discussion on breaking ablution, the long remark on the mother and a youth) | ep05 00:05:30-00:06:30 (part), 00:07:00 (part) | Not recoverable | Clarity | Open |

Resume point: min-kunuz-al-sunnah episode 6 (branch from origin/main).

### min-kunuz-al-sunnah ep06 (14 Nov 2026)

12 points written for episode 6 (ar, en, ur); 8 needs_source marks in each language file for this episode; 8 new `about` edges. Quran verses referenced only through passage links (6-153, 42-49, 42-50, 2-228, 4-11, 24-30, 49-11, 49-12, 5-3); none typed.

| Excluded (min-kunuz-al-sunnah ep06) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break joins and the closing prayer | ep06 00:00:00, 00:08:00-00:08:30, 00:17:30-00:18:00, 00:27:00-00:27:30 | Not lesson content | Content rule | Open |
| A sweeping claim that the shorter a woman's dress the less her reason | ep06 00:07:30-00:08:00 (part) | Demeaning generalisation about women, unsourced; not written in the museum's voice; held for the founder to decide | Content rule, Voice rule | Open |
| Loops and garbled stretches (a repeated phrase on a saying attributed to Ali, a loop over the list of what he believes, a loop on the worker who wastes hours) | ep06 00:06:00-00:06:30, 00:10:30-00:11:00, 00:15:00-00:15:30 | Not recoverable | Clarity, Loop check | Open |

Resume point: min-kunuz-al-sunnah episode 7 (branch from origin/main).

### min-kunuz-al-sunnah ep07 (14 Nov 2026)

12 points written for episode 7 (ar, en, ur); 8 needs_source marks in each language file for this episode; 10 new `about` edges. Quran verses referenced only through passage links (29-2, 29-3, 26-218, 26-219); none typed.

| Excluded (min-kunuz-al-sunnah ep07) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break joins and the closing prayer | ep07 00:00:00, 00:09:30-00:10:00, 00:17:00-00:17:30, 00:24:30 | Not lesson content | Content rule | Open |
| Loops and garbled stretches (a run of one letter, the stretch on limestone temperaments, the stretch on the Companions' attention to the world) | ep07 00:01:00, 00:07:30-00:08:30 (part), 00:13:00 (part) | Not recoverable | Clarity, Loop check | Open |

Resume point: min-kunuz-al-sunnah episode 8 (branch from origin/main).

### min-kunuz-al-sunnah ep08 (14 Nov 2026)

10 points written for episode 8 (ar, en, ur); 5 needs_source marks in each language file for this episode; 6 new `about` edges. Quran verses referenced only through passage links (37-101, 51-28, 11-75, 59-9, 64-16, 17-29, 4-171, 42-11, 6-103); none typed.

| Excluded (min-kunuz-al-sunnah ep08) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break joins and the closing prayer | ep08 00:00:00, 00:08:00-00:08:30, 00:15:30-00:16:30 (part), 00:25:30-00:26:00 | Not lesson content | Content rule | Open |
| A remark calling Isaac the ancestor of one people, a loop on the structure of the word for righteousness, and a loop in the story of Abu Hanifa | ep08 00:05:30-00:06:00 (part), 00:02:30-00:03:00, 00:22:30 | Off the lesson or not recoverable | Clarity, Loop check | Open |

Resume point: min-kunuz-al-sunnah episode 9 (branch from origin/main).

### min-kunuz-al-sunnah ep09 (14 Nov 2026)

11 points written for episode 9 (ar, en, ur); 5 needs_source marks in each language file for this episode; 8 new `about` edges. Quran verses referenced only through passage links (113-1, 15-47); none typed.

| Excluded (min-kunuz-al-sunnah ep09) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break joins and the closing prayer | ep09 00:00:00, 00:08:00-00:08:30, 00:15:30-00:16:00 (part), 00:24:30-00:25:00 | Not lesson content | Content rule | Open |
| A remark on a people's envy of another's descendants over prophethood and the passage naming several modern conflict regions and refugee populations | ep09 00:09:30-00:10:30, 00:03:30-00:04:30 (part), 00:20:00-00:23:00 (part) | Sweeping claim about peoples and modern conflict asides; held for the founder to decide | Content rule, Voice rule | Open |
| Loops and garbled stretches | ep09 00:19:30-00:20:00, 00:22:00-00:22:30 | Not recoverable | Clarity, Loop check | Open |

Resume point: min-kunuz-al-sunnah episode 10 (branch from origin/main).

### min-kunuz-al-sunnah ep10 (14 Nov 2026)

11 points written for episode 10 (ar, en, ur); 8 needs_source marks in each language file for this episode; -70 new `about` edges. Quran verses referenced only through passage links (5-3, 3-133, 3-134, 18-62, 24-31); none typed. Contested: the lecturer's views on anniversaries, birthdays, dress and cosmetic surgery are attributed to him; sensitivity stays contested.

| Excluded (min-kunuz-al-sunnah ep10) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break joins and the closing prayer | ep10 00:00:00, 00:08:30-00:09:00, 00:17:00-00:17:30, 00:26:00 | Not lesson content | Content rule | Open |
| A remark on the cow of the Israelites made as a rebuke of a group, and a loop in the stretch on the hump hadith | ep10 00:20:30-00:21:00 (part) | Group generalisation and not recoverable | Voice rule, Clarity, Loop check | Open |

Resume point: min-kunuz-al-sunnah episode 11 (branch from origin/main).

### min-kunuz-al-sunnah ep11 (14 Nov 2026)

11 points written for episode 11 (ar, en, ur); 5 needs_source marks in each language file for this episode; 4 new `about` edges. Quran verses referenced only through passage links (2-83, 17-53, 11-88, 66-10, 3-110, 13-11); none typed. Contested: his reading that "by hand" includes founding alternatives is offered as his view against the classical assignment to the ruler.

| Excluded (min-kunuz-al-sunnah ep11) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, the break joins and the closing prayer | ep11 00:00:00, 00:08:00-00:08:30, 00:16:30-00:17:00, 00:26:30 | Not lesson content | Content rule | Open |
| Loops and garbled stretches (a stretch on the hall of the Friday sermon and a football match, a loop in the Noah stretch, a stretch on a trained worker) | ep11 00:07:00-00:07:30 (part), 00:21:00-00:21:30 (part), 00:03:30-00:04:00 (part) | Not recoverable | Clarity, Loop check | Open |

Resume point: min-kunuz-al-sunnah episode 12 (branch from origin/main).

## alwaad-alhaq (Al-Wa'd al-Haqq), episodes 1 onward (14 Nov 2026, Claude Code claude-sonnet-5-5, worker C2)

Series record `work/alwaad-alhaq` created (no earlier record existed; sensitivity contested; 24 `about` edges). Source folder: `books/assabile/omar-abdelkafy/alwaad-alhaq/pass5-qwen`, 44 episodes (ep01 to ep44), all present; sizes 68 to 148 KB, so none is truncated. Transcripts carry repetition loops; a cleaning script (outside the repo) collapses them and marks each `[LOOP]`, and only cleaned text is read. Episodes 27 to 40 are longest (100 to 148 KB raw) and have the most loops.

### alwaad-alhaq ep01 (14 Nov 2026)

24 points written for episode 1 (ar, en, ur); 18 needs_source marks in each language file; 24 `about` edges. Quran verses only as passage links (21-99, 1-4, 1-6, 80-34..37, 48-11, 14-48..51); none typed.

| Excluded (alwaad-alhaq ep01) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops (a repeated "yes", repeated blessing formula, repeated syllables) | ep01 00:14:00, 00:16:00, 00:30:00, 00:31:30, 00:32:00, 00:34:30, 00:47:30 | Not speech | Loop check | Open |
| A remark on Muhibb al-Din al-Khatib and the media's neglect of scholars | ep01 00:13:00-00:13:30 | Garbled | Clarity | Open |
| A saying attributed to Abu Dharr about people as roses without thorns | ep01 00:35:00 | Garbled; attribution cannot be read | Clarity | Open |
| A passage on men and women wronged for fifty years and on the hijab, as a remark about those who deny it | ep01 00:31:30 | Garbled and a contested ruling; held for the founder, not an opinion to record | Clarity, opinion ruling | Open |
| Greetings, trailers, thanks and closing formulae | ep01 00:00:00, 00:05:00-00:05:30, 00:30:00, 00:51:00-00:51:30 | Not lesson content | Content rule | Open |

Proposal (process): the clean-then-read script could be moved into `scripts/` so every lane uses one loop collapser.

Resume point: alwaad-alhaq episode 2 (branch from origin/main).
### min-kunuz-al-sunnah ep12 (14 Nov 2026)

14 points written for episode 12 (ar, en, ur); 9 needs_source marks in each language file for this episode; 10 new `about` edges. Quran verses referenced only through passage links (2-30, 5-27, 5-28, 19-45, 113-5, 49-10, 17-23, 17-24); none typed. Contested: His claim that a person who honors his parents will not enter the Fire however many wrongs he does, his attributions of sayings to Ali and of an exchange to Mu'awiya, and his view that applying the hadith would restore Muslim leadership of the nations are his own and unsourced or contested.

| Excluded (min-kunuz-al-sunnah ep12) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greetings, welcome, break joins and closing prayer | ep12 00:00:00-00:01:00, 00:09:00-00:09:30, 00:17:00-00:17:30, 00:27:00-00:27:30 | Not substantive content | Content rule | Open |
| Looping vowel stretch | ep12 00:02:30-00:03:00 | Loop, no recoverable content | Clarity, Loop check | Open |
| Looping letter stretch | ep12 00:06:00-00:06:30 | Loop, no recoverable content | Clarity, Loop check | Open |
| Looping article stretch and garbled parents passage including a report about the angels and the Throne | ep12 00:21:30-00:22:00 | Loop and garbled, cannot recover | Clarity, Loop check | Open |
| Remedy about taking water from the one who envies, and a story of a poor man, a letter and a request to execute several nobles | ep12 00:07:00-00:09:00 | Garbled, details unrecoverable | Clarity, Loop check | Open |
| Remarks on a particular airport's passport officers | ep12 00:05:30-00:06:00 | Sweeping generalisation about a group of officials | Voice rule | Open |
| The Cain and Abel marriage detail | ep12 00:03:30-00:04:00 | Garbled, unrecoverable | Clarity, Loop check | Open |

Resume point: min-kunuz-al-sunnah episode 13 (branch from origin/main).

### alwaad-alhaq ep02 (14 Nov 2026)

19 points written for episode 2 (ar, en, ur); 21 needs_source marks for this episode in each language file (39 in all in each file with episode 1); about edges added for will, inheritance, gifts, mourning and six persons. Quran verses only as passage links (21-96, 21-97, 12-8, 4-9, 19-6). The sheikh's rulings on gifts and bequests are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep02) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops ("ya ukhti", "ma bi", "aysh hum", "na'ma") | ep02 00:23:30, 00:29:00, 00:31:00, 00:34:30, 00:36:00 | Not speech | Loop check | Open |
| Supplication-length remarks, an account of a Companion's bequest of all his property that the loop destroys | ep02 00:29:00 | Garbled; replaced by the Umar ibn Abd al-Aziz report only | Clarity | Open |
| A dialogue about a will for two flats and a family business (case discussion) | ep02 00:37:30, 00:38:30 to 00:40:00 | Garbled case facts; only the stated general rule kept | Clarity | Open |
| Ali's advice to al-Hasan to study death | ep02 00:53:00 | Garbled and unattributed | Clarity | Open |
| A verse-poem recited at the opening about the dying | ep02 00:01:00 | Unattributed poem fragment, garbled | Clarity, no source | Open |

Resume point: alwaad-alhaq episode 3 (branch from origin/main).
### min-kunuz-al-sunnah ep12 review (14 Nov 2026)

Episode 12 re-read against the transcript after merge (#6642): one wording corrected in ar, en, ur (the report on lying to a brother is among the greatest major sins, not "betrayal"); no marks or links changed. All later episodes are reviewed against the transcript before merge; see their notes.

### alwaad-alhaq ep03 (14 Nov 2026)

21 points written for episode 3 (ar, en, ur); 25 needs_source marks for this episode in each language file; about edges added for ruqya, a bad ending, patience, decree, the appointed term and six persons. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep03) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops (prayer talk, 'ya akhi tawasali', 'da'f') | ep03 00:16:00, 00:36:00, 00:36:30, 00:40:00, 00:42:30 | Not speech | Loop check | Open |
| Verse of al-Shafi'i ascribed in garbled form, a verse about 'tajalludi lil-shamitin' | ep03 00:39:00 | Garbled and unattributed | Clarity, no source | Open |
| Passages on the remote control and who works in fashion shows beyond the stated opinion | ep03 00:27:00 | Garbled, case details unclear; only the stated view kept | Clarity | Open |
| Remark on tribe of the worldly 'ana al-mujtamaa' and ten-bed/ten-clothes remark | ep03 00:42:00 | Garbled | Clarity | Open |
| Detail of the two doctors anecdote (Muslim and Western) | ep03 00:32:30 | Reduced to the contrast only; details garbled | Clarity | Open |

Resume point: alwaad-alhaq episode 4 (branch from origin/main).
### min-kunuz-al-sunnah ep13 (14 Nov 2026)

15 points written for episode 13 (ar, en, ur); 11 needs_source marks in each language file for this episode; 13 new `about` edges. Quran verses referenced only through passage links (38-23, 38-24, 24-30, 9-105); none typed. Contested: He applies the hadith of charity to his own views on judicial independence, road etiquette, parking at prayer and lowering the gaze; the stories of Ali's sword, the Companion who struck a wall and al-Shafi'i's complaint are given without chains.

| Excluded (min-kunuz-al-sunnah ep13) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings and praise | ep13 00:00:00-00:00:30 | Greeting formula, no teaching content | Content rule | Open |
| Break announcement and return greeting, suspense about the story | ep13 00:08:00-00:09:00 | Break join and promise of a surprise | Content rule | Open |
| Break announcement before the second part | ep13 00:17:30-00:18:00 | Break join, repeated hadith recap | Content rule | Open |
| Closing recap, prayer and farewell | ep13 00:27:30-00:28:30 | Closing prayer and farewell | Content rule | Open |
| Claim that the Arabs before Islam despised work | ep13 00:22:00-00:22:30 | Sweeping claim about a people | Voice rule | Open |
| Looping stretch of repeated letters | ep13 00:07:30-00:08:00 | ASR loop, unrecoverable | Clarity, Loop check | Open |
| Looping stretch of repeated letters | ep13 00:23:00-00:23:30 | ASR loop, unrecoverable | Clarity, Loop check | Open |
| Looping stretch, gift to son hadith lost | ep13 00:27:00-00:27:30 | ASR loop, hadith of the gift only partly recovered | Clarity, Loop check | Open |
| Garbled asides on a wedding and vague jokes | ep13 00:13:00-00:14:30 | Partly garbled wording about nightlife, only the Paradise-and-fire point kept | Clarity, Loop check | Open |

Resume point: min-kunuz-al-sunnah episode 14 (branch from origin/main).

### min-kunuz-al-sunnah ep14 (14 Nov 2026)

15 points written for episode 14 (ar, en, ur); 5 needs_source marks in each language file for this episode; 10 new `about` edges. Quran verses referenced only through passage links (2-279, 42-27, 9-51); none typed. Contested: He presents the scholars as the friends of God and enmity to them as war with God, takes the listener's tastes in hearing and sight as signs of God's love, and gives views on usury and enmity as applied to people; these are his own applications.

| Excluded (min-kunuz-al-sunnah ep14) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greeting, opening prayer, break joins and repeated recitation of the hadith | ep14 00:00:00-00:00:30, 00:07:30-00:08:00, 00:15:00-00:15:30, 00:23:00-00:23:30 | Greetings, break joins and a repeat of a hadith already covered | Content rule | Open |
| Sweeping claims that those who dress or pray in certain ways are blamed for disorder and the reverse, and a call that the hand should strike those who oppose religion | ep14 00:05:00-00:05:30, 00:11:30-00:12:30 | Sweeping generalisations about groups and a call for force | Voice rule | Open |
| Complaint that nearly everyone in the speaker's country complains, and the jokes about complaining | ep14 00:18:30-00:19:30 | Sweeping claim about a people | Voice rule | Open |
| Looped text and garbled stretches | ep14 00:03:00-00:03:30, 00:14:30-00:15:00, 00:18:00-00:18:30 | Repeated characters and garbled words, not recoverable | Clarity, Loop check | Open |
| Section on hearing and sight examples beyond the main account (garbled lines on a channel) | ep14 00:10:00-00:10:30 | Partly garbled | Clarity, Loop check | Open |

Resume point: min-kunuz-al-sunnah episode 15 (branch from origin/main).

### min-kunuz-al-sunnah ep15 (14 Nov 2026)

14 points written for episode 15 (ar, en, ur); 13 needs_source marks in each language file for this episode; 6 new `about` edges. Quran verses referenced only through passage links (9-60, 18-79, 21-107, 17-23, 17-24, 24-60); none typed. Contested: His rejection of the word "disabled", his statement that God creates no defect, his praise of one state's policies, his view that a dutiful child will not enter the fire whatever else he does, and his view that the ruler is among the elders are his own opinions and are contested.

| Excluded (min-kunuz-al-sunnah ep15) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greetings, opening prayer and introduction | ep15 00:00:00-00:00:30 | Not substantive | Content rule | Open |
| Break joins and returns | ep15 00:08:00-00:08:30, 00:17:30-00:18:30 | Not substantive | Content rule | Open |
| Closing prayer and farewell | ep15 00:27:00-00:27:30 | Not substantive | Content rule | Open |
| Repeated-letter loop | ep15 00:01:00-00:01:30 | Loop, no recoverable text | Clarity, Loop check | Open |
| Repeated-letter loop | ep15 00:19:00-00:19:30 | Loop, no recoverable text | Clarity, Loop check | Open |
| Repeated-word loop and garbled poem or story | ep15 00:24:30-00:25:30 | Loop and garbled text | Clarity, Loop check | Open |
| Names of blind scholars (al-Tirmidhi, Ibn Abbas) | ep15 00:07:00-00:07:30 | Subject and wording too garbled to attribute | Clarity, Loop check | Open |
| Garbled phrase about a political group in the hadith discussion | ep15 00:14:00-00:14:30 | Garbled, unrecoverable | Clarity, Loop check | Open |
| Mention of Abu Bakr and Uthman beside a proverb | ep15 00:25:30 | Garbled, point unclear | Clarity, Loop check | Open |
| Garbled clause on who is exempt from prayer | ep15 00:16:30-00:17:00 | Garbled, unrecoverable | Clarity, Loop check | Open |
| Statement on the weakness of girl children | ep15 00:26:00-00:26:30 | Sweeping generalisation about women | Voice rule | Open |
| Remarks on rulers who are provoked or incited and on states' fates | ep15 00:21:30-00:22:00 | Garbled, sweeping claim | Voice rule, Clarity | Open |

Resume point: min-kunuz-al-sunnah episode 16 (branch from origin/main).

### min-kunuz-al-sunnah ep16 (14 Nov 2026)

14 points written for episode 16 (ar, en, ur); 9 needs_source marks in each language file for this episode; 2 new `about` edges. Quran verses referenced only through passage links (17-100, 6-28, 10-12, 3-134, 41-34); none typed. Contested: He holds that reward is pure divine favour and that a disbeliever who dies in disbelief stays in the fire for ever because he would have disbelieved for ever; he also attributes to the Prophet and others reports without chains (the bedouin and the arrow, the ten witnesses, the man lacking one good deed, the tear), and these views and reports are his.

| Excluded (min-kunuz-al-sunnah ep16) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening praise and greeting | ep16 00:00:00-00:00:30 | Greeting and invocation, not content | Content rule | Open |
| Break join, return from the break and closing of the first part | ep16 00:08:00-00:08:30 | Break join | Content rule | Open |
| Break announcement and welcome back | ep16 00:16:00-00:16:30 | Break join | Content rule | Open |
| Closing prayer and farewell | ep16 00:27:30-00:28:00 | Closing prayer and salutation | Content rule | Open |
| Description of the miser and his heirs wishing his death | ep16 00:09:30-00:10:00 | Sweeping generalisation about a class of people | Voice rule | Open |
| Repeated syllable loop | ep16 00:13:00-00:13:30 | Looping ASR output with no recoverable text | Clarity, Loop check | Open |
| Garbled sums and end of the arithmetic passage | ep16 00:12:00-00:12:30 | Numbers and wording too garbled to state | Clarity, Loop check | Open |
| Garbled passage on a saying of Ibn Masud about the rich and the poor | ep16 00:26:30-00:27:30 | Too garbled to recover | Clarity, Loop check | Open |
| Analogy of exam marks and mention of the Day of Resurrection counting the characters in scales | ep16 00:07:00-00:07:30 | Overlaps the report already recorded and the wording is garbled | Clarity, Loop check | Open |

Resume point: min-kunuz-al-sunnah episode 17 (branch from origin/main).

### min-kunuz-al-sunnah ep17 (14 Nov 2026)

14 points written for episode 17 (ar, en, ur); 13 needs_source marks in each language file for this episode; 14 new `about` edges. Quran verses referenced only through passage links (9-18); none typed. Contested: He holds that the obligatory prayers belong in the mosque in congregation, that missing dawn prayer removes blessing from provision, and that a late Friday arrival loses the reward; these are his views and rest on reports he gives without chains.

| Excluded (min-kunuz-al-sunnah ep17) | Episode / time | Reason | Gate failed | Override |
| Opening greeting and praise | ep17 00:00:00-00:00:30 | Greeting formula, no content | Content rule | Open |
| Break join and welcome back (first) | ep17 00:09:00-00:09:30 | Break join and welcome back | Content rule | Open |
| Break join and welcome back (second) | ep17 00:17:30-00:18:00 | Break join and welcome back | Content rule | Open |
| Closing prayer and sign-off | ep17 00:27:30-00:28:30 | Closing prayer and farewell | Content rule | Open |
| Looped vowel stretch | ep17 00:01:00-00:01:30 | Loop of a single letter, nothing to recover | Clarity, Loop check | Open |
| Looped letter stretch during Qur'an recitation remark | ep17 00:16:00-00:16:30 | Loop of a single letter; only the opening words used | Clarity, Loop check | Open |
| Garbled fragment about killing and a sect | ep17 00:01:30 | Unclear, may name a sect; not recoverable | Voice rule, Clarity | Open |
| Sweeping claims that neglecting dawn prayer ruins wife, children, boss and employees | ep17 00:07:00-00:07:30 | Sweeping claim about people, no support | Voice rule | Open |
| Claim that people backbite whole states and that politics ruined minds | ep17 00:08:30-00:09:00 | Sweeping claim about modern politics and nations | Voice rule | Open |
| Speculation about the psychology of those who fidget on Friday | ep17 00:22:30-00:23:00 | Demeaning speculation about a class of people | Voice rule | Open |
| Garbled stretch about Hatim and the dropped imam story setup | ep17 00:23:00-00:23:30 | Too garbled to recover | Clarity | Open |

Resume point: min-kunuz-al-sunnah episode 18 (branch from origin/main).

### alwaad-alhaq ep04 (14 Nov 2026)

16 points written for episode 4 (ar, en, ur); 13 needs_source marks for this episode in each language file; about edges added for signs of the Hour, loyalty and disavowal and five persons. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep04) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops (numbers, 'hadhi hiya', 'ala Allah') | ep04 00:30:00, 00:42:00, 00:46:00 | Not speech | Loop check | Open |
| Story of Mu'awiya and a man claiming brotherhood from Adam | ep04 00:19:30 to 00:20:00 | Garbled facts | Clarity | Open |
| Claims on European history and women's pay and rights | ep04 00:38:30 to 00:40:00 | Unsupported historical statistics, garbled; one stated view kept | No source | Open |
| Call to boycott companies with immodest advertising | ep04 00:26:30 to 00:27:30 | Opinion ruling (founder-held) | Policy | Open |
| Advice on greeting non-Muslim neighbours at their festivals; remark on a woman chairing a meeting | ep04 00:40:30 to 00:41:30; 00:44:30 | Opinion rulings, garbled (founder-held) | Policy | Open |

Resume point: alwaad-alhaq episode 5 (branch from origin/main).
### min-kunuz-al-sunnah ep18 (14 Nov 2026)

14 points written for episode 18 (ar, en, ur); 10 needs_source marks in each language file for this episode; 5 new `about` edges. Quran verses referenced only through passage links (23-51, 19-25, 9-35); none typed. Contested: He attributes to the Prophet, without chain, the hadith of relying on God like the birds and several hadiths by sense, and tells unsourced stories (the dream of Abu Ayyub and the neighbour, the sick men, the baby in the water); the opinion on forbidden food reaching the fetus and the account of the dead neighbour in Paradise are his own readings.

| Excluded (min-kunuz-al-sunnah ep18) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greeting and praise, introduction of the day's hadith | ep18 00:00:00-00:01:00 | Greeting and framing, no content | Content rule | Open |
| Break join and return (after this break, welcome back) | ep18 00:09:30-00:10:00 | Break join | Content rule | Open |
| Break join and return | ep18 00:18:30-00:19:00 | Break join | Content rule | Open |
| Closing remarks, request for prayers and farewell | ep18 00:28:30-00:29:00 | Closing prayer and farewell | Content rule | Open |
| Stretch of repeated syllable (aah aah) | ep18 00:01:30-00:02:00 | Loop, nothing recoverable | Clarity, Loop check | Open |
| Stretch of repeated phrase (that which that which) | ep18 00:16:00-00:16:30 | Loop, mid-sentence fragment on the day of reckoning, not recoverable | Clarity, Loop check | Open |
| Garbled report about green birds and Hamza | ep18 00:12:00-00:12:30 | Too garbled to recover | Clarity, Loop check | Open |
| Sweeping claim that the West set up means and reached what it reached, so the Muslim lands must not neglect them | ep18 00:12:00-00:12:30 | Sweeping claim about peoples | Voice rule | Open |
| Garbled stock-market and blood-pressure figures | ep18 00:27:00-00:27:30 | Numbers garbled, not clearly supported | Clarity, Loop check | Open |

Resume point: min-kunuz-al-sunnah episode 19 (branch from origin/main).

### min-kunuz-al-sunnah ep19 (14 Nov 2026)

14 points written for episode 19 (ar, en, ur); 6 needs_source marks in each language file for this episode; 7 new `about` edges. Quran verses referenced only through passage links (11-6, 51-22, 4-17, 7-172); none typed. Contested: He holds that obstructing young people's marriage is sinful, that zakat is due on jewellery, that a coerced divorce and a divorce in a final illness to harm a wife do not take effect, that deliberate neglect of prayer and fasting is made up in the ways he describes, and that a woman who deliberately leaves off covering must stop to be forgiven; these are his views, some rest on reports given without chains, and scholars differ on several.

| Excluded (min-kunuz-al-sunnah ep19) | Episode / time | Reason | Gate failed | Override |
| Opening greeting, praise and intro to the hadith | ep19 00:00:00-00:00:30 | Greeting formula and salutation | Content rule | Open |
| Break join and welcome back (first) | ep19 00:09:00-00:09:30 | Break join and welcome back | Content rule | Open |
| Break join and welcome back (second) | ep19 00:16:30-00:17:00 | Break join and welcome back | Content rule | Open |
| Closing prayer and sign-off | ep19 00:25:30-00:26:00 | Closing prayer and farewell | Content rule | Open |
| Claim that a young man facing obstacles will go straight to the unlawful | ep19 00:05:00-00:05:30 | Sweeping claim about a class of people | Voice rule | Open |
| Claim about heirs scheming against a new young wife of an elderly father | ep19 00:19:00-00:19:30 | Sweeping claim about families and women, partly garbled | Voice rule, Clarity | Open |
| Garbled stretch on valuing missed Ramadans at past prices | ep19 00:13:30-00:14:00 | Too garbled to recover | Clarity | Open |
| Garbled stretch on a doubt about prayer units and sunna acts | ep19 00:24:30-00:25:00 | Fragmentary, only the advice recovered | Clarity | Open |
| Looped repetitions in the dua of the Arab and provision section | ep19 00:06:30-00:07:00 | Repeated phrases, only the core recovered | Clarity, Loop check | Open |

Resume point: min-kunuz-al-sunnah episode 20 (branch from origin/main).

### alwaad-alhaq ep05 (14 Nov 2026)

19 points written for episode 5 (ar, en, ur); 16 needs_source marks for this episode in each language file; edges to discretionary punishment, hijab, Gog and Magog and the splitting of the moon. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep05) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| A story of a wolf and a man called Ahban, kept only with a needs_source mark | ep05 00:43:00 | told without a chain and the transcript is garbled; kept as a marked report | needs_source | Open |
| ASR passages at 00:25:00 to 00:26:30 and 00:30:30 to 00:32:30 not written | ep05 00:25:00 | transcript is unintelligible or looped, no claim can be checked | accuracy | Open |

Resume point: alwaad-alhaq episode 6 (branch from origin/main).
### min-kunuz-al-sunnah ep20 (14 Nov 2026)

14 points written for episode 20 (ar, en, ur); 11 needs_source marks in each language file for this episode; 7 new `about` edges. Quran verses referenced only through passage links (3-164, 68-4, 6-162, 14-24, 14-26, 14-27, 2-254, 51-26, 51-27); none typed. Contested: He holds that rulings change with time, place and people, proposes a weekly standard-Arabic day for institutions, and gives his own applications of neighbour and guest etiquette; all are his views and are marked as such.

| Excluded (min-kunuz-al-sunnah ep20) | Episode / time | Reason | Gate failed | Override |
| greeting, opening praise, break joins and closing prayer | ep20 00:00:00-00:00:30, 00:08:30-00:09:00, 00:17:30-00:18:00, 00:30:00-00:30:30 | not lesson content | Content rule | Open |
| looping repetition of one word, then garbled stretch about a fast eater | ep20 00:25:00-00:25:30 | transcript loops and cannot be recovered | Clarity, Loop check | Open |
| looping repetition of one word | ep20 00:27:30-00:28:00 | transcript loops and cannot be recovered | Clarity, Loop check | Open |
| remarks on children preferring TV-drama dialect and on mixed foreign speech heard by a visitor | ep20 00:23:00-00:24:00 | garbled and anecdotal, leans on generalisations about groups | Voice rule, Clarity | Open |

Resume point: min-kunuz-al-sunnah episode 21 (branch from origin/main).

### min-kunuz-al-sunnah ep21 (14 Nov 2026)

14 points written for episode 21 (ar, en, ur); 9 needs_source marks in each language file for this episode; 10 new `about` edges. Quran verses referenced only through passage links (1-4, 40-7, 28-78, 2-131); none typed. Contested: He holds that the Torah and Gospel were true before some people altered them, that looking at the righteous is a kind of worship per unnamed scholars, and he gives the palace story, the Yemeni man and the angel-function count without sources.

| Excluded (min-kunuz-al-sunnah ep21) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greetings and opening prayer | ep21 00:00:00-00:00:30 | Opening salutations and praise | Content rule | Open |
| Break join and welcome back | ep21 00:07:30-00:08:30 | Restates the previous segment and welcomes viewers | Content rule | Open |
| Break join and welcome back | ep21 00:16:30-00:17:00 | Welcome and recap after the break | Content rule | Open |
| Closing prayer and farewell | ep21 00:24:30-00:25:00 | Closing supplication and salutations | Content rule | Open |
| Claim that looking at sinners and the corrupt narrows the chest | ep21 00:10:00-00:10:30 | Sweeping generalisation about sinners | Voice rule | Open |
| Comparison of a difficult manager to a named historical opponent | ep21 00:20:30-00:21:00 | Demeaning comparison with a named person | Voice rule | Open |
| Young man who confessed a sin to a scholar and died of fear | ep21 00:23:30-00:24:00 | Garbled, cannot be recovered reliably | Clarity, Loop check | Open |
| Story of the Yemeni man's name and companion exchange details | ep21 00:05:30-00:06:00 | Name and wording garbled by recognition errors | Clarity, Loop check | Open |
| Third pillar of faith | ep21 00:12:00-00:13:00 | The third of the three pillars is not stated in the transcript | Clarity, Loop check | Open |

Resume point: min-kunuz-al-sunnah episode 22 (branch from origin/main).

### min-kunuz-al-sunnah ep22 (14 Nov 2026)

15 points written for episode 22 (ar, en, ur); 10 needs_source marks in each language file for this episode; 7 new `about` edges. Quran verses referenced only through passage links (39-42); none typed. Contested: He holds that provision is a wide encyclopedia with money its last page, that dawn-prayer timing affects blessing in provision, that a hormone claim ties happiness to night sleep, and that a person is compelled in what he is not reckoned for and free in what he is; these are his views.

| Excluded (min-kunuz-al-sunnah ep22) | Episode / time | Reason | Gate failed | Override |
| Greetings, praise and opening prayer | ep22 00:00:00-00:00:30 | Opening formula, no content | Content rule | Open |
| Break join and welcome back | ep22 00:08:00-00:08:30, 00:16:00-00:16:30 | Break announcements and greetings | Content rule | Open |
| Closing prayer for sincere intentions | ep22 00:24:30-00:25:00 | Closing prayer, not lesson content | Content rule | Open |
| Remark about the faces of Arabs and a comparison with the West on life as one chance | ep22 00:11:30-00:12:00, 00:15:30-00:16:00 | Sweeping claim about peoples | Voice rule | Open |
| Satellite dish tuning analogy | ep22 00:23:30-00:24:00 | Garbled aside, not recoverable | Clarity | Open |
| Repeated filler characters | ep22 00:23:00-00:23:30 | Loop in the transcript | Loop check | Open |

Resume point: min-kunuz-al-sunnah episode 23 (branch from origin/main).

### min-kunuz-al-sunnah ep23 (14 Nov 2026)

14 points written for episode 23 (ar, en, ur); 9 needs_source marks in each language file for this episode; 3 new `about` edges. Quran verses referenced only through passage links (6-153, 42-13, 27-44, 3-52, 2-133, 3-85, 18-39); none typed. Contested: He holds that standing for others as a local custom contradicts no creed, that Islam in a wide sense is the religion of all prophets, and that Muslims should be ashamed of Ramadan habits; these are his views, and the "forty days" claim about doubtful food is unreferenced.

| Excluded (min-kunuz-al-sunnah ep23) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greeting and invocation, closing prayer and farewell | ep23 00:00:00-00:00:30, 00:25:00-00:25:30 | Greetings and closing prayer, not lesson content | Content rule | Open |
| Break join and welcome back | ep23 00:16:30-00:17:00 | Break join | Content rule | Open |
| Claim that "the Westerners" take haya to be shyness and that translations get it wrong, as a sweeping claim about peoples (kept only the neutral point that translations render it poorly) | ep23 00:08:30-00:09:00 | Sweeping claim about a people | Voice rule | Open |
| Repeated filler particles and looped syllables inside the lines | ep23 00:02:00-00:02:30, 00:04:00-00:04:30 | Loop, text unrecoverable | Clarity, Loop check | Open |
| Garbled allusion on the stare of unbelievers and a garbled saying on counting faults | ep23 00:03:30-00:04:00, 00:02:00-00:02:30 | Too garbled to identify with certainty | Clarity, Loop check | Open |
| Garbled wording inside the Abu Jahl report | ep23 00:11:30-00:12:00 | Partly garbled, only the recoverable point kept | Clarity, Loop check | Open |
| Garbled sentences on what tempts unbelievers and devils of men and jinn | ep23 00:23:30-00:24:00 | Garbled, sweeping | Clarity, Loop check | Open |

Resume point: min-kunuz-al-sunnah episode 24 (branch from origin/main).

### alwaad-alhaq ep06 (14 Nov 2026)

18 points written for episode 6 (ar, en, ur); 17 needs_source marks for this episode in each language file; edges to short measure, zakat and trust. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep06) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Unsourced statistics (30,000 Qur'ans, 84 and 150 followers, ten billion trees, 59 and 41 per cent) kept only with needs_source marks | ep06 00:27:00 to 00:52:00 | no source given for the figures | needs_source | Open |
| Unintelligible stretches (00:16:30, 00:37:00, 00:44:00 to 00:44:30) | ep06 00:16:30 | transcript looped or unintelligible, no claim can be checked | accuracy | Open |

Resume point: alwaad-alhaq episode 7 (branch from origin/main).
### min-kunuz-al-sunnah ep24 (14 Nov 2026)

14 points written for episode 24 (ar, en, ur); 10 needs_source marks in each language file for this episode; 5 new `about` edges. Quran verses referenced only through passage links (4-148); none typed. Contested: He holds that lying is permitted in three cases (to please a wife, in war, to reconcile people) and gives his own readings of Ibrahim's three statements and of what counts as war; these are his views, and scholars discuss the scope of the three exceptions.

| Excluded (min-kunuz-al-sunnah ep24) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greetings, opening praise and invocation | ep24 00:00:00-00:00:30 | Opening formula, no teaching content | Content rule | Open |
| Break join, return greeting and closing prayer | ep24 00:08:30-00:09:30, 00:17:30-00:18:00, 00:27:00-00:27:30 | Break joins, farewell and closing prayer | Content rule | Open |
| Generalisations about women's emotions and about husbands and wives comparisons (storm, sea bird) | ep24 00:02:30-00:04:00 | Sweeping claims about women | Voice rule | Open |
| Jokes about colleagues and news presenters, and about husbands hiding accounts | ep24 00:04:00-00:04:30, 00:06:30-00:07:30 | Mocking, not substantive | Voice rule | Open |
| Description of occupation and invasion of Muslim lands as the setting of war | ep24 00:10:30-00:12:00 | Sweeping claim about modern conflict | Voice rule | Open |
| Waiting period and a wife leaving the home after divorce, with remarks on spouses | ep24 00:16:00-00:17:30 | Garbled and sweeping about spouses | Clarity, Loop check | Open |
| Repeated letter loop | ep24 00:07:30 | Loop of one letter, nothing recoverable | Clarity, Loop check | Open |
| Garbled passage on the wife's mother and the judge | ep24 00:19:00-00:19:30 | Too garbled to recover | Clarity, Loop check | Open |

Resume point: min-kunuz-al-sunnah episode 25 (branch from origin/main).

### min-kunuz-al-sunnah ep25 (14 Nov 2026)

13 points written for episode 25 (ar, en, ur); 9 needs_source marks in each language file for this episode; 3 new `about` edges. Quran verses referenced only through passage links (19-43, 40-28, 3-110); none typed. Contested: He gives a view on how advice should be delivered (privately, gently, briefly, fitted to the listener) and applies it to rulers and to youths raised in the West; these are his opinions, and the stories and sayings he tells carry no chains.

| Excluded (min-kunuz-al-sunnah ep25) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greeting, opening prayer, break joins and closing prayer | ep25 00:00:00-00:00:30, 00:08:30-00:09:00, 00:17:00-00:17:30, 00:24:30 | Not substantive teaching | Content rule | Open |
| Claim that the Arab man never accepts a wife's advice and the Arab claims to know everything | ep25 00:04:00-00:04:30, 00:08:00-00:08:30 | Sweeping generalisation about a people and about women | Voice rule | Open |
| Remark that some officials in Arab and Muslim countries speak for four or five hours | ep25 00:06:30-00:07:00 | Sweeping claim about rulers and states | Voice rule | Open |
| Remark about flatterers around rulers | ep25 00:22:30-00:23:00 | Sweeping claim about a group, garbled | Voice rule | Open |
| Looping stretch of repeated letters | ep25 00:11:00-00:11:30 | ASR loop, text lost | Clarity, Loop check | Open |
| Looping stretch of repeated letters | ep25 00:18:00-00:18:30 | ASR loop, text lost | Clarity, Loop check | Open |
| Garbled phrases on typing and writing media | ep25 00:11:30-00:12:00 | Words unclear (kept only the general point on generations) | Clarity, Loop check | Open |

Resume point: min-kunuz-al-sunnah episode 26 (branch from origin/main).

### alwaad-alhaq ep07 (14 Nov 2026)

13 points written for episode 7 (ar, en, ur); 12 needs_source marks for this episode in each language file; edges to tajwid and the battle of al-Qadisiyya. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep07) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Unintelligible stretches (00:05:00, 00:14:30 to 00:16:00, 00:21:30 to 00:25:00 in part, 00:44:30 to 00:45:30) | ep07 00:05:00 | transcript looped or unintelligible, no claim can be checked | accuracy | Open |
| Gender and climate readings of the last hadith in the episode kept only as his reading with needs_source | ep07 00:52:00 | garbled transcript, hadith not verifiable | needs_source | Open |

Resume point: alwaad-alhaq episode 8 (branch from origin/main).
## sharh-saheeh-al-bukhare (Omar Abdelkafy, 60 episodes; worker C1, branch prefix agent/assabile-ssb-)

### sharh-saheeh-al-bukhare ep01 (14 Nov 2026)

25 points written for episode 1 (ar, en, ur); 20 needs_source marks in each language file for this episode; 23 new `about` edges. Quran verses referenced only through passage links (20-5); none typed. Contested: He holds that whoever rejects a sound hadith or denies the Sunna has committed disbelief, and that every hadith in al-Bukhari is sound; the view on reciting al-Fatiha behind the imam and on praying an obligatory prayer behind a voluntary one are fiqh positions on which schools differ. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep01) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening supplication and greetings | ep01 00:00:00-00:02:00 | Greetings and opening prayer; first lines are a garbled loop | Clarity, Loop check | Open |
| Break joins and closing remarks, closing prayer, next-episode note, credits | ep01 01:19:30-01:23:00 | Closing prayer and sign-off; credits and promotional lines | Content rule | Open |
| Storyteller anecdote about a hadith scholar's reply and a bathhouse story | ep01 00:08:00-00:10:30 | Garbled and looping, meaning not recoverable | Clarity, Loop check | Open |
| Estimates of hadith counts, years of compilation and numbers of hadiths in al-Bukhari | ep01 00:03:00-00:04:30, 00:21:00-00:22:30, 00:43:30 | Numbers garbled or inconsistent in the transcript | Clarity | Open |
| Remarks on how Orientalists or Europeans treat hadith and a claim about a Jewish origin of hadith schools | ep01 00:24:00-00:24:30, 00:33:00-00:33:30 | Sweeping claim about a people, partly garbled | Content rule, Clarity | Open |
| Remarks on a historical origin of an invention in the Fatimid period and on forms of addressing the Prophet | ep01 00:50:00-00:52:00 | Garbled, referent unclear | Clarity | Open |
| Stories of Umar and a lamp for personal versus Muslim affairs, and anecdotes on intention in spending | ep01 00:57:30-00:58:30, 01:17:00-01:19:00 | Garbled, speaker and report unclear | Clarity | Open |
| Stretch touching a modern conflict | ep01 01:14:30-01:15:30 | A stretch dropped under the content-safety block | Content rule | Open |
| Question and answer on wives and husbands' families | ep01 01:20:00-01:23:00 | Garbled; sweeping advice about women not recoverable | Voice rule, Clarity | Open |
| Advice on prayer postures and completeness, yoga-like comparison, etc. | ep01 00:39:30-00:40:30, 00:57:00-00:58:00 | Loops and garbled stretches | Clarity, Loop check | Open |
| Loop stretches of repeated syllables | ep01 00:10:00-00:10:30, 00:12:00-00:13:00, 00:16:00-00:16:30, 00:17:30-00:18:00, 00:21:00-00:21:30, 00:25:30-00:26:00, 00:27:30-00:28:30, 00:31:30-00:32:30, 00:36:00-00:36:30, 00:44:30-00:45:00, 00:49:00-00:49:30, 00:50:30-00:51:00, 01:01:00-01:01:30, 01:02:00-01:02:30, 01:13:00-01:13:30, 01:15:00-01:15:30, 01:16:00-01:17:00 | Repeated-token loops | Loop check | Open |
| Remark on a thief who hurries and would receive his provision lawfully had he waited | ep01 00:52:30-00:53:00 | Garbled stretch, meaning not clearly recoverable | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 2 (branch from origin/main).
### min-kunuz-al-sunnah ep26 (14 Nov 2026)

14 points written for episode 26 (ar, en, ur); 12 needs_source marks in each language file for this episode; 2 new `about` edges. Quran verses referenced only through passage links (17-70, 28-77); none typed. Contested: He attributes new diseases to neglect of the Sunna, claims veterinary findings on stressed animals, tells an unreferenced Second World War story about a British commander, and presents reward figures for killing pests; all are his views and unsourced.

| Excluded (min-kunuz-al-sunnah ep26) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greeting, praise and salutations | ep26 00:00:00-00:00:30 | Greeting formula, no teaching | Content rule | Open |
| Stretch of repeated vowel sounds | ep26 00:01:30-00:02:00 | Loop of one syllable, nothing recoverable | Clarity, Loop check | Open |
| Break join and closing prayer of first part | ep26 00:08:30-00:09:00 | Break announcement and farewell | Content rule | Open |
| Repeated vowel loop after the break | ep26 00:09:00-00:09:30 | Loop of one letter, nothing recoverable | Clarity, Loop check | Open |
| Repeated syllable loop | ep26 00:12:00-00:12:30 | Loop, no content | Clarity, Loop check | Open |
| Sweeping stereotypes of wives and husbands and a spider comparison | ep26 00:11:30-00:13:30 | Demeaning generalisations about women and men, kept only as a neutral point about harm in marriage | Voice rule | Open |
| Break join, welcome back and restart of the hadith | ep26 00:16:30-00:17:30 | Welcome back and repetition of the opening hadith | Content rule | Open |
| Anecdote of a painting in a museum and sweeping remarks on colonial peoples | ep26 00:20:30-00:21:00 | Unreferenced, garbled, sweeping claim about a people | Voice rule, Clarity | Open |
| Repeated syllable loop in the blind cat section | ep26 00:23:00-00:23:30 | Loop, no content | Clarity, Loop check | Open |
| Fish and whale disease speculation | ep26 00:15:30-00:16:00 | Too garbled to recover | Clarity | Open |
| Garbled sentences on the sheep and on naming God at slaughter | ep26 00:07:30-00:08:30 | Partly unrecoverable wording, kept only the clear sense | Clarity | Open |

Resume point: min-kunuz-al-sunnah episode 27 (branch from origin/main).

### min-kunuz-al-sunnah ep27 (14 Nov 2026)

14 points written for episode 27 (ar, en, ur); 13 needs_source marks in each language file for this episode; 3 new `about` edges. Quran verses referenced only through passage links (59-7, 49-11, 2-195, 2-67, 16-8, 67-2, 5-112, 2-219, 2-215, 2-189, 2-186); none typed. Contested: He applies the hadith to rule that a gold-coated watch and artificial silk are lawful for men while pure gold and natural silk are not, calls the death of one who ignores traffic or sea warnings akin to suicide, and ranks backbiting as graver than demolishing the Kaaba; all are his views.

| Excluded (min-kunuz-al-sunnah ep27) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening praise, greeting and salutations | ep27 00:00:00-00:00:30 | Greeting and invocation, not content | Content rule | Open |
| Break join, closing prayer, farewell | ep27 00:08:30-00:09:00, 00:16:00-00:16:30, 00:23:30-00:24:00 | Break join, closing prayer and farewell | Content rule | Open |
| Remark that the people of this or that country or tribe are cowardly or miserly, and the claim about the daily word count of Arab men and women against others | ep27 00:04:30-00:05:00, 00:08:00-00:08:30 | Sweeping claims about peoples and women | Voice rule | Open |
| Remarks on a woman applying make-up while driving | ep27 00:11:30-00:12:00 | Gendered aside, not needed for the point | Voice rule | Open |
| Jokes about Ramadan, employees and news agencies | ep27 00:05:30-00:06:00, 00:07:00-00:07:30 | Garbled aside, not recoverable | Clarity, Loop check | Open |
| Repeated filler word loop | ep27 00:12:00-00:12:30 | ASR loop, no content | Clarity, Loop check | Open |
| Garbled Arabic recitation of the hadith | ep27 00:16:30-00:17:00 | Garbled ASR of a hadith already covered | Clarity, Loop check | Open |

Resume point: min-kunuz-al-sunnah episode 28 (branch from origin/main).

### sharh-saheeh-al-bukhare ep02 (14 Nov 2026)

28 points written for episode 2 (ar, en, ur); 21 needs_source marks in each language file for this episode; 27 new `about` edges. Quran verses referenced only through passage links (5-3, 93-6, 96-1, 96-5); none typed. Contested: He places the reward of converts in the scale of those who brought them to Islam (Abu Bakr, Amr ibn al-As), applies the hijra hadith to modern travel for work, holds that the Quran is understood only through the Sunna, and gives his own readings of the Prophet's fear at the first revelation; all are marked as his view. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep02) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greetings, praise and opening prayer | ep02 00:00:00-00:02:00 | Opening formulas and invocations, no content point | Content rule | Open |
| Closing prayer, advert for a company with contact number, closing appeals | ep02 01:23:30-01:24:30 | Break join, commercial notice and closing prayer, not teaching | Content rule | Open |
| Report on Uthman ibn Talha, the key of the Kaaba and Ali | ep02 00:19:30-00:20:30 | Too garbled to recover what is said and by whom | Clarity | Open |
| Stretch on the killing of scholars and on a raised weapon against a brother | ep02 00:29:30-00:30:30 | Sweeping claim about present-day killing, partly garbled | Voice rule | Open |
| Stretch on the loss of a child, a father who lost two sons and Moses' mother | ep02 00:30:30-00:32:30 | Garbled, only the reading on grief at 00:31:30 is recoverable | Clarity | Open |
| Stories of a Companion's love for the Prophet, equipping ten men and a man with no mounts | ep02 00:36:00-00:39:30 | Garbled, speakers and sequence unclear | Clarity | Open |
| Long stretch of repeated words and unrelated talk, including talk of colours and revolutionary legitimacy | ep02 00:43:00-00:53:00 | Loop and garbled speech with no recoverable point | Clarity, Loop check | Open |
| Account of the revelation in small matters and stories of a woman, a Companion and a bride | ep02 00:55:00-01:01:00 | Loop and garbled speech | Clarity, Loop check | Open |
| Story of the Prophet's prostration, Fatima, exile and a creed of two imams | ep02 01:05:30-01:08:30 | Garbled, speakers unclear | Clarity | Open |
| Fatwa, trade and sweeping remarks about adultery | ep02 01:08:30-01:10:30 | Garbled and a sweeping claim about people | Voice rule, Clarity | Open |
| Account of the retreat, a purchase and a journey | ep02 01:13:00-01:16:00 | Garbled | Clarity | Open |
| Stretch on the Prophet's fear compared with others, and repeated passages | ep02 01:19:30-01:22:00 | Garbled and looping, only the points at 01:21:00 and 01:22:30 are used | Clarity, Loop check | Open |
| Loops at 00:09:30, 00:16:00, 00:26:00, 00:28:00, 00:34:00, 00:37:30, 00:40:30 and 01:23:00 | ep02 various | Repeated words | Clarity, Loop check | Open |
| Names and details the transcript does not clearly support: Uthman, Amr ibn al-As, Uqba's father, Khadija, reason of the man killed, hardest-on-him and sweat in the revelation report, why the envoy came | ep02 00:05:30, 00:07:30, 00:08:00, 00:22:30, 00:29:30, 00:54:30, 01:05:00 | Garbled or absent in the recording, reduced to what is clear | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 3 (branch from origin/main).
### alwaad-alhaq ep08 (14 Nov 2026)

23 points written for episode 8 (ar, en, ur); 20 needs_source marks for this episode in each language file; 17 new `about` edges (concepts and persons already in the graph; the series record now covers episodes 1-8). Quran verses referenced only through passage links (21-96, 18-21, 48-11, 2-275, 7-34, 24-4, 4-119); none typed. Contested: sects and groups, triple divorce, hair joining, the hadith on Ali and the daughter of Abu Jahl, and the ruling on one who abandons prayer, all given as his view. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep08) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening and closing prayers, greetings and thanks | ep08 00:00:00 and 00:47:30-00:48:30 | Greeting and invocation, not content | Content rule | Open |
| Repeated syllable and phrase loops (subhan Allah, aqd nabi, this thing) | ep08 00:25:00, 00:26:00, 00:29:30, 00:30:30 | ASR loops, no content | Clarity, Loop check | Open |
| Hairdressers' trade, dog comparison, hair adverts, wigs and the sweeping remarks on women and men | ep08 00:24:30-00:28:00 | Sweeping rulings on a profession and gendered remarks, kept only as his view on joining hair and imitation | Voice rule | Open |
| Anecdote of the Prophet's trunk and Umar at the grave, and the maker's alleged hidden motive for tall pulpits | ep08 00:18:00-00:19:00 | Garbled and speculative about a person's intention | Clarity, Voice rule | Open |
| Attribution of the usury saying to a sect, and the sentence on whether the hadith is for or against the groups | ep08 00:13:30-00:14:00, 00:09:30 | Garbled, attribution unrecoverable | Clarity | Open |
| Verses and poet's name on the wolf and the lamb, and the bird-slaughterer verses | ep08 00:33:00-00:34:00 | Garbled attribution, kept only the sense | Clarity | Open |
| Companions' anecdotes on Usama and Sa'd ibn Abi Waqqas in the method section | ep08 00:40:30-00:41:00 | Garbled, unrecoverable | Clarity | Open |
| Item on a battle with the Jews and the name of a hadith heading in the on-screen list | ep08 00:43:30 | Heading read out without context; left out of the summary list | Voice rule | Open |
| Debate about hours of the one balanced home | ep08 00:32:00-00:32:30 | Garbled, no recoverable content | Clarity | Open |

Resume point: alwaad-alhaq episode 9 (branch from origin/main).
### min-kunuz-al-sunnah ep28 (14 Nov 2026)

13 points written for episode 28 (ar, en, ur); 9 needs_source marks in each language file for this episode; 1 new `about` edges. No Quran verses linked; none typed. Contested: He holds that an angry divorce stands because the angry man still tells wife from mother (against a questioner who thought it void for a closed mind); he also holds that officials should undergo psychiatric screening, and relates unchained reports (Umar and the applicant, the Arab/non-Arab saying, population figures).

| Excluded (min-kunuz-al-sunnah ep28) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greeting and praise, opening of the lesson | ep28 00:00:00-00:00:30 | Greeting and introduction, no teaching content | Content rule | Open |
| Loop of repeated letters | ep28 00:00:30-00:01:00 | ASR loop, no recoverable words | Clarity, Loop check | Open |
| Garbled stretch of repeated particles before the divorce examples | ep28 00:06:30-00:07:00 | ASR loop, no recoverable words | Clarity, Loop check | Open |
| Laughter loop inside the divorce example | ep28 00:07:00-00:07:30 | ASR loop after the first sentences | Clarity, Loop check | Open |
| Break join and return from the advertisement break | ep28 00:08:30-00:09:00 | Break join, no teaching content | Content rule | Open |
| Sweeping claim that the Arab environment has become one that produces anger, and the remark on divorce questions turning on school rulings | ep28 00:14:30-00:15:30 | Sweeping claim about a people, partly garbled and rambling on children of divorced parents | Voice rule, Clarity | Open |
| Break announcement and prayer before the break, and the second break join | ep28 00:16:00-00:17:00 | Break join and a short supplication, no teaching content | Content rule | Open |
| Story of Harun al-Rashid and a jug of water, then a loop | ep28 00:25:00-00:26:00 | Story cut off by an ASR loop, outcome unrecoverable | Clarity, Loop check | Open |
| Closing prayer and farewell | ep28 00:26:00-00:26:30 | Closing prayer and farewell | Content rule | Open |

Resume point: min-kunuz-al-sunnah episode 29 (branch from origin/main).

### min-kunuz-al-sunnah ep29 (14 Nov 2026)

14 points written for episode 29 (ar, en, ur); 9 needs_source marks in each language file for this episode; 3 new `about` edges. Quran verses referenced only through passage links (16-43, 4-59, 33-35, 7-205); none typed. Contested: He attributes to himself or states as his view a proposal of premarital health, fiqh and psychiatric certificates, a divorce rate of 60 percent in some Arab countries, and proposals to screen teachers and preachers; the hadith wordings and scholars' accounts are quoted by sense without chains.

| Excluded (min-kunuz-al-sunnah ep29) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greeting, opening praise and introduction | ep29 00:00:00-00:00:30 | Greeting and preamble, no content | Content rule | Open |
| Break joins and closing prayer | ep29 00:08:30-00:09:00, 00:16:30-00:17:00, 00:26:00-00:27:00 | Break lead-in and return, closing prayer and farewell, no content | Content rule | Open |
| Analogies of plumber, pharmacist and chemistry for the Sharia, jokes about Arabs | ep29 00:02:00-00:04:00 | Mockery and sweeping remarks about Arabs; the substantive point is kept in a bullet | Voice rule | Open |
| Claim that girls see marriage only as a dress and wedding day, remarks on mothers and a girl's grievances against men | ep29 00:12:30-00:13:00, 00:15:30-00:16:00 | Demeaning generalisations about women | Voice rule | Open |
| Remarks on women smoking water pipes, mothers blowing on food, and the modern wife as a part-time role | ep29 00:19:00-00:20:30 | Demeaning generalisations about women | Content rule | Open |
| Looping stretch of repeated words | ep29 00:18:00-00:18:30, 00:13:30-00:14:00 | Garbled ASR repetition; only the clear start of the line is used | Clarity, Loop check | Open |
| Garbled phrases on accepting the easy and on teachers and pupils | ep29 00:07:30-00:08:00, 00:10:00-00:10:30 | Too garbled to recover | Clarity, Loop check | Open |
| Stray final line | ep29 00:27:00 | One garbled token | Clarity, Loop check | Open |

Resume point: min-kunuz-al-sunnah episode 30 (branch from origin/main).

### min-kunuz-al-sunnah ep30 (14 Nov 2026)

14 points written for episode 30 (ar, en, ur); 7 needs_source marks in each language file for this episode; 9 new `about` edges. Quran verses referenced only through passage links (3-110); none typed. Contested: He attributes to himself the ruling of sixty days for a deliberate break of the fast, the view that smoking harms body and money, and applications of the audit idea; the Umar and al-Abbas story and Aisha's description are given without chain.

| Excluded (min-kunuz-al-sunnah ep30) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greetings, opening prayer and thanks | ep30 00:00:00-00:01:00 | Greeting formula, not substantive | Content rule | Open |
| Break joins and welcome back | ep30 00:08:30-00:09:30 and 00:18:30-00:19:30 | Programme break joins; Eid greeting | Content rule | Open |
| Garbled stretch on prayer that omits the obligation and a reported saying on forty days | ep30 00:11:30-00:12:00 and 00:22:30-00:23:00 | ASR too garbled to recover | Clarity, Loop check | Open |
| Remark about a wife's smile and teeth, and spoken scenes of family meals | ep30 00:16:30-00:17:00 and 00:25:30-00:26:30 | Joking asides, partly garbled | Voice rule | Open |
| Closing prayers for countries and for current conflicts, thanks, closing prayer and farewell | ep30 00:27:30-00:30:00 | Prayers for peoples, states and modern conflicts; closing prayer | Content rule, Voice rule | Open |
| Repeated filler tokens | ep30 00:30:30-00:30:30 | Loop, no content | Clarity, Loop check | Open |

Resume point: min-kunuz-al-sunnah episode 31 (branch from origin/main).

### alwaad-alhaq ep09 (14 Nov 2026)

13 points written for episode 9 (ar, en, ur); 18 needs_source marks for this episode in each language file; 11 new or reused about edges. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep09) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Tale of Iblis prostrating and the beast treading him | ep09 00:15:30-00:16:00 | Reported tale with garbled text, kept only as an attributed needs_source line | Clarity | Open |
| Remarks on a world in which people may not sleep, on scientists and Mars, and on the fate of civilisations and Andalusian kingdoms | ep09 00:32:30, 00:36:30, 00:49:30-00:50:00 | Garbled or speculative asides outside the sheikh's sourced account | Clarity | Open |
| Bedouin and Companion anecdote after the Dajjal hadith | ep09 00:47:00-00:48:00 | Garbled loop, unrecoverable | Loop check | Open |
| Repetition loops and repeated blessings | ep09 00:22:30, 00:29:00, 00:34:30, 00:45:00-00:46:00 | Garbled ASR repetition | Loop check | Open |

Resume point: alwaad-alhaq episode 10 (branch from origin/main).
### sharh-saheeh-al-bukhare ep03 (14 Nov 2026)

17 points written for episode 3 (ar, en, ur); 6 needs_source marks in each language file for this episode; 5 new `about` edges. Quran verses referenced only through passage links (3-64); none typed. Contested: His assessments of the Prophet's character, of the questions put to Abu Sufyan and of the Prophet's letter are his own framing; the stories of Rukana, the daughter of Hatim and the armed man are told without chains and are not endorsed by the museum. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep03) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening prayer and greetings | ep03 00:00:00-00:01:00 | Opening supplication and greeting, not content | Content rule | Open |
| Closing prayer and farewell greetings | ep03 01:12:30-01:13:00, 01:17:30-01:18:00 | Closing prayer and greeting, not content | Content rule | Open |
| Repeated phrase loops and garbled stretches | ep03 00:01:30-00:03:30, 00:03:30-00:04:00, 00:12:30-00:13:00, 00:18:00-00:18:30, 00:21:00-00:21:30, 00:22:30-00:23:00, 00:26:00-00:26:30, 00:27:30-00:28:30, 00:32:30-00:33:00, 00:35:30-00:36:00, 00:37:00-00:37:30, 00:38:00-00:39:30, 00:40:30-00:41:00, 00:43:00-00:43:30, 00:44:30-00:46:00, 00:46:30-00:48:00, 00:49:00-00:50:00, 00:55:00-00:55:30, 00:57:30-00:58:30, 01:00:00-01:03:30, 01:06:00-01:07:00, 01:08:30-01:09:30, 01:10:30-01:11:30, 01:14:00-01:14:30 | Repetition loops or text too garbled to recover | Clarity, Loop check | Open |
| Stories of the Prophet's opponents, Moses and Aaron, Abdullah ibn Salam and a conversion account | ep03 00:14:30-00:19:00 | Too garbled to recover what is claimed | Clarity | Open |
| Remarks on contemporary events, Muslims in America and a conference before an attack | ep03 00:11:30-00:14:00, 01:04:30-01:05:30, 01:08:00-01:09:00 | Sweeping claims about modern conflict and politics | Content rule | Open |
| Ruling on declaring people unbelievers | ep03 01:05:30-01:06:00 | His ruling stated as a general statement, outside the museum's voice | Voice rule | Open |
| Appeal to men about women and the gaze | ep03 00:50:30-00:51:00 | Generalising advice about women, not tied to the hadith | Voice rule | Open |
| Journey of the young Prophet with his uncle | ep03 00:53:00-00:54:30 | Garbled, names and events not recoverable | Clarity | Open |
| Questions and answers on hajj, fatwas and site announcements | ep03 01:13:00-01:17:30 | Unrelated announcements and questions, partly garbled | Content rule | Open |
| Naming of Heraclius and the Byzantine ruler as the questioner | ep03 00:34:00-01:07:30 | The transcript never names Heraclius or the Byzantines; the identity was inferred from the known hadith, not said | Clarity | Open |
| Quranic wording of the common-word call, the Hashim step of the hadith of choosing, the reasons for a prophet's intelligence and the purpose of the armed-man story | ep03 00:09:30, 00:52:30, 01:12:00, 00:27:00 | Not clearly supported by the transcript or would type Quran wording | Clarity, Content rule | Open |

Resume point: sharh-saheeh-al-bukhare episode 4 (branch from origin/main).

### alwaad-alhaq ep10 (14 Nov 2026)

12 points written for episode 10 (ar, en, ur); 10 needs_source marks for this episode in each language file; edges to Tamim al-Dari, Fatima bint Qays, the Jassasa, the Dajjal, Tiberias, Umar, Abdullah ibn Umar and Muhammad. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep10) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Ruling that those who ride the sea in rough waves or drive at speed die as suicides and not martyrs | ep10 00:10:00-00:10:30 | opinion ruling, founder-held (dec-20261114-277) | opinion rulings | Open |
| Story of Israeli schooling and the Mount Zion remark | ep10 00:50:30-00:51:30 | garbled transcript and political claim that cannot be checked | accuracy | Open |
| Ranking of Muawiya over Umar ibn Abd al-Aziz and the remark on Malik not walking in Medina | ep10 00:36:00-00:37:00 | opinion ranking and garbled claim, not verifiable | accuracy, opinion rulings | Open |
| Discussion of the Dajjal's seventy rings, his hidden identity, and the Ibn Sayyad Samaritan origin | ep10 00:39:00 and 00:47:00 | garbled transcript, sources not named | accuracy | Open |
| Closing remarks on viewer mail and thanks to the channel | ep10 00:57:30-00:58:30 | no factual content | relevance | Open |

Resume point: alwaad-alhaq episode 11 (branch from origin/main).
### sharh-saheeh-al-bukhare ep04 (14 Nov 2026)

24 points written for episode 4 (ar, en, ur); 14 needs_source marks in each language file for this episode; 25 new `about` edges. Quran verses referenced only through passage links (12-29, 5-8, 20-50); none typed. Contested: He gives natural-history claims, the Ali and Shurayh story and several hadiths by sense without chains, and his reading of belief in God's names, angels, decree and the last day as branches of faith is his own presentation. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep04) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greeting, opening praise and closing prayer | ep04 00:00:00-00:01:30, 01:23:00-01:23:30 | Greetings and prayers are not lesson content | Content rule | Open |
| Opening prayer loop | ep04 00:01:00-00:01:30 | Repeated phrase loop | Clarity, Loop check | Open |
| Questions about a son as speaker and the "why did you not return" loop | ep04 00:03:30-00:04:30 | Loop and garbled | Clarity, Loop check | Open |
| Talk on wives, treatment of women and household disputes | ep04 00:19:30-00:21:30 | Garbled, sweeping claims about women and peoples | Voice rule, Clarity | Open |
| Natural-history stretches on ants, fish and embryos beyond the points kept | ep04 00:27:30-00:40:00 | Garbled with loops, many unsupported claims | Clarity, Loop check | Open |
| Talk of migration, economy of regions, air travel and medical anecdotes | ep04 00:32:00-00:39:30 | Garbled, sweeping claims about peoples and countries | Content rule, Clarity | Open |
| Stretch on parents, children and a wife | ep04 01:09:00-01:11:30 | Garbled, sweeping claims about families | Clarity | Open |
| Talk of Muslims by country and numbers | ep04 01:17:30-01:18:30 | Garbled, sweeping claims about peoples | Content rule, Clarity | Open |
| Loops and garbled stretches | ep04 00:12:00-00:12:30, 00:13:30-00:14:00, 00:17:30-00:18:30, 00:19:00-00:19:30, 00:20:00-00:20:30, 00:31:30-00:32:30, 00:34:00-00:35:30, 00:36:30-00:37:30, 00:43:30-00:44:30, 00:47:30-00:48:00, 00:49:30-00:54:30, 01:00:00-01:00:30, 01:02:30-01:04:30, 01:06:30-01:07:00, 01:08:00-01:08:30, 01:20:00-01:21:30 | Repeated or unrecoverable text | Clarity, Loop check | Open |

Resume point: sharh-saheeh-al-bukhare episode 5 (branch from origin/main).

### sharh-saheeh-al-bukhare ep05 (14 Nov 2026)

21 points written for episode 5 (ar, en, ur); 11 needs_source marks in each language file for this episode; 10 new `about` edges. Quran verses referenced only through passage links (36-78, 36-79, 36-80, 99-7, 99-8, 3-159); none typed. Contested: He holds that the Gospels were written about three hundred years after Jesus and that no original copy exists, and that the rule taught in schools that matter is not created from nothing is wrong; both are contested claims attributed to him. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep05) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening supplication, greetings and closing prayer | ep05 00:00:00-00:03:00, 01:19:00 | Greetings, opening prayer (garbled) and sign-off | Content rule | Open |
| Garbled opening on why advice is hard and a man's story about wine | ep05 00:08:00-00:11:30 | Meaning not recoverable | Clarity, Loop check | Open |
| Loop stretches of repeated syllables and words | ep05 00:10:30-00:11:00, 00:17:30-00:18:00, 00:22:30-00:23:00, 00:25:00-00:26:00, 00:29:00-00:29:30, 00:30:00-00:30:30, 00:32:00-00:32:30, 00:33:30-00:34:30, 00:37:30-00:38:30, 00:39:00-00:39:30, 00:44:00-00:44:30, 00:45:00-00:45:30, 00:46:00-00:47:00, 00:49:00-00:50:00, 00:50:30-00:51:00, 00:52:00-00:53:30, 01:01:30-01:02:00, 01:04:00-01:04:30, 01:05:00-01:06:30, 01:08:00-01:09:30, 01:10:30-01:11:00, 01:15:30-01:16:00, 01:18:00-01:18:30 | Repeated-token loops | Loop check | Open |
| Remarks on cursing time or fate and on colours, and a note about Muslims differing in names | ep05 00:16:30-00:17:00, 00:26:00-00:27:00 | Garbled, referent unclear | Clarity | Open |
| Stretch on a Bedouin and the Kaaba, and on hadith terminology (hasan gharib) with questions to a person | ep05 00:28:30-00:29:00, 00:31:00-00:32:30 | Garbled, speaker and report unclear | Clarity | Open |
| Stories of marriage, wives and household advice | ep05 00:36:30-00:39:30 | Sweeping advice about women, garbled | Voice rule, Clarity | Open |
| Stretch on prayer, the Kaaba, and a dialogue about a person who did not know | ep05 00:39:30-00:42:30 | Garbled, report without chain | Clarity | Open |
| Stretch on struggle (jihad), rage, armed conflict and drug trade | ep05 00:47:00-00:49:30, 00:52:30-00:53:00 | Sweeping claims touching modern conflict, partly garbled; stretch dropped under the content-safety block | Content rule, Clarity | Open |
| Stretch on a slave market, a place and a man whose names are garbled | ep05 00:51:00-00:52:00 | Names garbled, story not recoverable | Clarity | Open |
| Remarks on faith's actions, Ibn Umar and reason | ep05 00:54:00-00:56:30 | Garbled, meaning not recoverable | Clarity | Open |
| Anecdotes on gratitude, an ember falling, prophets and other figures whose names are garbled | ep05 01:01:00-01:04:30, 01:06:00-01:07:30, 01:10:00-01:15:00 | Garbled; stories without recoverable chain | Clarity | Open |
| Phone-call anecdote and dialogue about a school director and the police | ep05 01:14:30-01:16:30, 01:17:00-01:18:30 | Garbled, speakers unclear | Clarity | Open |
| Tail of the transcript | ep05 01:19:00 | Last window (to 01:19:21) is garbled; the transcript is complete, not truncated | Clarity | Open |
| Fine detail of the earlier bullets that the transcript does not support (the order of belief in Paradise and the Fire, the pairing of fear and hope, a link to the verse on gratitude, the claim that mercy and gentleness bring hearts close) | ep05 00:33:30, 00:56:30-00:57:30, 01:00:30-01:03:00, 01:07:30-01:09:00 | Not clearly supported by the transcript | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 6 (branch from origin/main).

### sharh-saheeh-al-bukhare ep06 (14 Nov 2026)

28 points written for episode 6 (ar, en, ur); 16 needs_source marks in each language file for this episode; 23 new `about` edges. No Quran verses linked; none typed. Contested: His rulings and advice on purity, the urine of infants, ghusl, the awra, slaughter methods abroad, sleeping arrangements of children, oaths and obedience to parents in marriage matters are his own views, and the claim about slaughter methods in Europe, America and Australia is a sweeping statement without a source. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep06) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening praise, greetings and long opening prayer (with a looping line) | ep06 00:00:00-00:03:00 | Greetings and closing-style prayer, loops | Clarity, Loop check | Open |
| Asides on smoking, health and a dog-saliva experiment, a story of a dog and a fox-like tale | ep06 00:07:00-00:12:30 and 00:16:30-00:18:00 | Garbled and unsupported claims, loops of repeated letters | Clarity, Loop check | Open |
| Story of al-Walid and a description of the Qur'an, and a story about Ahmad's writing | ep06 00:14:00-00:14:30 and 00:21:00-00:22:00 | Garbled, names unreliable | Clarity | Open |
| Collective hypocrisy tied to jihad, a hadith about the Jews and stones, music remarks | ep06 00:23:00-00:25:00 | Sweeping claim about a group and modern conflict, garbled | Content rule / Voice rule | Open |
| Family stories on fathers, daughters and inheritance, and a note on the elderly | ep06 00:26:00-00:27:30 and 00:28:30-00:29:30 | Sweeping generalisations, garbled, loop at 00:29:30 | Voice rule / Clarity, Loop check | Open |
| Loops of repeated words and a parable of the poets, with contentment story | ep06 00:37:00-00:37:30, 00:39:30-00:40:30, 00:42:00-00:45:30, 00:47:00-00:47:30 | Garbled stretches and loops | Clarity, Loop check | Open |
| Cleaning of babies and a note on a woman's period, and prayer times | ep06 00:52:30-00:53:00 and 00:56:30-00:58:30 | Too garbled to recover | Clarity, Loop check | Open |
| Stretch on Muslims abroad and political groups, bombing remarks and aid | ep06 01:01:00-01:02:00 | A stretch dropped under the content-safety block | Content rule | Open |
| Eating etiquette number (31 kinds), a woman's awra, footwear and sleeping asides | ep06 01:03:30-01:04:00 and 01:05:30-01:08:30 | Number without source, garbled loops, ruling too garbled | Clarity, Loop check | Open |
| Stretch on helping Muslims under foreign rule, a payment to kill a person, mosques and minarets in France, statistics on converts | ep06 01:11:00-01:14:00 | A stretch dropped under the content-safety block, sweeping claims about peoples and modern conflict | Content rule / Voice rule | Open |
| Visiting tombs, a school story, loops of "ya akhi" | ep06 01:15:30-01:19:30 | Garbled and loops | Clarity, Loop check | Open |
| Break join, request to start Q&A before the Isha prayer, tribute to a deceased teacher and appeal for unity | ep06 01:20:00-01:22:30 | Greeting and closing remarks, garbled | Clarity | Open |
| Q&A on Friday prayer for a groom, inheritance in banks, a son visiting his mother, and the closing advertisement | ep06 01:22:30-01:23:30 and 01:24:00-01:24:30 and 01:25:30 | Garbled rulings, closing words | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 7 (branch from origin/main).

### alwaad-alhaq ep11 (14 Nov 2026)

18 points written for episode 11 (ar, en, ur); 12 needs_source marks for this episode in each language file; dates, counts and unchained reports are marked needs_source. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep11) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Sheikh's date for Dhu al-Qarnayn and verse and percentage counts | ep11 00:48:30 | his own unsupported figures, kept only as marked claims | needs_source | Open |
| Speculation on weapons of the Dajjal's followers | ep11 00:33:00 | speculation, kept as his guess | sensitivity | Open |

Resume point: alwaad-alhaq episode 12 (branch from origin/main).
### sharh-saheeh-al-bukhare ep07 (14 Nov 2026)

24 points written for episode 7 (ar, en, ur); 13 needs_source marks in each language file for this episode; 5 new `about` edges. No Quran verses linked; none typed. Contested: His conditions for lawful singing (no instruments, words that call only to virtue) and his view that groups should not be set against one another are attributed to him; the singing ruling is contested among scholars. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep07) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening praise, greeting, long supplication for students' exams and for the community | ep07 00:00:00-00:04:00 | Greeting and prayer, not teaching content | Content rule | Open |
| Break joins and anecdotes mixed with loops (camel story, repeated syllables) | ep07 00:10:30-00:16:30 | Garbled, looping, story unrecoverable | Clarity, Loop check | Open |
| Stretch on emigration, a conference abroad and women travelling to study | ep07 00:17:30-00:22:00 | Garbled and sweeping claims about women and peoples | Content rule, Clarity | Open |
| Wives, marriage, women and men generalisations, percentages, anecdotes | ep07 00:26:00-00:38:00 | Sweeping claims about women, garbled, loops | Content rule, Voice rule, Clarity | Open |
| Stretch on the dream of Hatim and the girl of the palace sequence start | ep07 00:37:30-00:38:30 | Garbled, names unclear | Clarity | Open |
| Gulf songs, school and job stories, loops | ep07 00:40:30-00:44:00 | Garbled, loops, anecdotes | Clarity, Loop check | Open |
| Types of women, qualities of wives, claims about the Egyptian people and the Fatimids | ep07 00:46:00-00:56:30 | Sweeping claims about women, peoples and sects; heavy garbling and loops | Content rule, Voice rule, Clarity, Loop check | Open |
| Marriage proposals, rules on women working, loops | ep07 00:56:30-01:01:00 | Sweeping claims about women, garbled, loops | Content rule, Clarity, Loop check | Open |
| Anecdotes on television and relatives, family stories | ep07 01:03:30-01:05:00 | Garbled anecdotes, no clear point | Clarity | Open |
| Teaching children obedience and a stretch on obeying rulers | ep07 01:06:00-01:07:30 | Garbled, rulings cannot be recovered | Clarity, Loop check | Open |
| Stretch on punishments, jihad and authority | ep07 01:11:00-01:12:30 | Garbled and a sweeping claim on public authority and conflict | Content rule, Clarity | Open |
| Closing remarks, disclaimers on remarks about women, closing prayer and greetings | ep07 01:15:30-01:17:30 | Closing and prayer, disclaimer tied to dropped women stretches | Content rule | Open |
| Questions on a girl's veil and on trading in a forbidden product, closing salutations | ep07 01:17:30-01:20:00 | Questions garbled, product name unreliable, answers not recoverable | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 8 (branch from origin/main).

### sharh-saheeh-al-bukhare ep08 (14 Nov 2026)

25 points written for episode 8 (ar, en, ur); 20 needs_source marks in each language file for this episode; 11 new `about` edges. Quran verses referenced only through passage links (6-28, 5-67); none typed. Contested: His own views and rulings are marked as his: the enemies of the believer, trials as a sign of God's care, desire and the devil as obstacles, his advice to the pilgrims on the sacrifice and his words on the two drowned children; the narrator of the sweetness-of-faith hadith is not clearly named in the transcript, so none is given. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep08) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening praise, prayers and greetings | ep08 00:00:00-00:02:30 | Greetings and opening prayer, also a loop at the start | Clarity, Loop check | Open |
| Closing prayer, greetings and sign-off | ep08 01:19:00-01:19:30, 01:22:30-01:22:30 | Closing prayer, greeting and sign-off | Content rule | Open |
| Child Muhammad at Abu Talib's table and nearby stretch | ep08 00:06:30-00:09:00 | Too garbled to recover, loop at 00:08:30 | Clarity, Loop check | Open |
| Eating-habit lists and a count of manners | ep08 00:10:00-00:11:00 | Garbled, no clear claim | Clarity | Open |
| Tail of the moon story and praise of the Prophet's palm | ep08 00:15:00-00:16:00 | Garbled, speaker and point unclear | Clarity | Open |
| Analogies on play, a worker and faith | ep08 00:16:30-00:19:00 | Garbled | Clarity | Open |
| Loops and unreadable lines | ep08 00:06:00, 00:14:00, 00:21:30-00:23:30, 00:31:30, 00:40:00, 00:43:00, 00:46:30, 00:49:30, 00:52:30, 00:57:00-00:58:30, 01:07:30, 01:10:30, 01:13:00-01:15:00 | Repeating tokens or unreadable text | Clarity, Loop check | Open |
| Claim that the believer's enemies are named modern states | ep08 00:29:30 | Sweeping claim about modern conflict | Content rule, Voice rule | Open |
| Rebuke of a ruler of Egypt | ep08 00:40:30-00:41:30 | Speaker unclear, story not recoverable | Clarity | Open |
| Umar's age and rank, other names, the verse recited | ep08 00:33:30-00:37:00 | Numbers and names garbled | Clarity | Open |
| Reference to a Shia imam | ep08 00:42:30-00:43:00 | Garbled, no clear claim | Clarity, Voice rule | Open |
| Backbiting versus frank correction and kinship passages | ep08 00:44:00-00:47:30 | Garbled | Clarity | Open |
| Elephant, Persian war and sheep stories | ep08 00:52:30-00:58:00 | Garbled, unclear point | Clarity | Open |
| Invocations, stone-throwing, martyr anecdotes and claims about peoples and a modern conflict | ep08 00:59:00-01:04:00 | Modern conflict, sweeping claims about peoples, unsourced anecdotes | Content rule, Voice rule | Open |
| Magic, charms and snake-hole passage | ep08 01:06:00-01:09:00 | Garbled | Clarity | Open |
| Iblis's troops and the scholar versus seventy worshippers | ep08 01:11:00-01:13:30 | Garbled, numbers not recoverable | Clarity | Open |
| Advice on prayer, spouses and screens beyond the one point kept | ep08 01:13:30-01:15:30, 01:18:00-01:19:00 | Garbled, remarks on spouses not suitable as stated | Clarity, Voice rule | Open |
| Palm-yield claim, small mouthfuls, wood-gathering detail, remark on refusing a word by its speaker, blessing of the house, dawn-prayer specific, other children of Muslims | ep08 00:05:30, 00:12:30, 00:47:30, 00:54:30, 01:09:30, 00:55:30, 01:22:00 | Not clearly supported by the garbled transcript | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 9 (branch from origin/main).

### alwaad-alhaq ep12 (14 Nov 2026)

22 points written for episode 12 (ar, en, ur); 13 needs_source marks for this episode in each language file; 10 new about-links on the series record. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep12) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Wager line attributed to al-Maarri and named man who did not find God | ep12 00:09:00-00:10:00 | Garbled, name and wording not recoverable | Clarity | Open |
| Story of the keeper of Hell not greeting | ep12 00:40:30-00:41:00 | Garbled, unclear source | Clarity | Open |
| Ages of al-Hasan, tent and herd details, sandal-strap story | ep12 00:26:00-00:27:00, 00:42:30-00:43:00 | Garbled numbers and wording | Clarity | Open |
| Looped and repeated passages (Qur'anic phrase and repetitions) | ep12 00:33:00-00:35:00, 00:38:30-00:39:30, 00:45:00-00:46:00, 00:50:00-00:50:30 | ASR loops, unrecoverable | Clarity | Open |
| Remarks on a modern researcher and an anthropology aside | ep12 00:31:00-00:31:30 | Garbled, unsupported claim | Clarity, Voice rule | Open |

Resume point: alwaad-alhaq episode 13 (branch from origin/main).
### sharh-saheeh-al-bukhare ep09 (14 Nov 2026)

10 points written for episode 9 (ar, en, ur); 7 needs_source marks in each language file for this episode; 8 new `about` edges. No Quran verses linked; none typed. Contested: He applies the hadith of the pledge to hudud, the grave, innovation, tawhid and abortion in his own readings, and gives the scholars' reasons for the hidden punishment of the grave without naming them; all are marked as his view. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep09) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greetings, praise and opening prayer | ep09 00:00:00-00:02:00 | Opening formulas and invocations, no content point | Content rule | Open |
| Closing greetings, prayer and list of cities | ep09 01:18:30-01:19:00 | Closing prayer and thanks, not teaching | Content rule | Open |
| Stretch on the pledge and the day of al-Aqaba, the meaning of the pledge | ep09 00:05:30-00:07:00 | Garbled, speakers and names unclear | Clarity | Open |
| Repeated word loops and a story of the Israelites and the mountain | ep09 00:07:30-00:08:30 | Loop and garbled speech | Clarity, Loop check | Open |
| Stories of a blind man and of those left behind from fighting | ep09 00:12:00-00:14:30 | Garbled, loop at 00:13:00, speakers unclear | Clarity, Loop check | Open |
| Stretch on a Jew, Uthman, an oath and a fee | ep09 00:17:00-00:22:00 | Garbled and looping, no recoverable point | Clarity, Loop check | Open |
| Talk of trust, giving a pledge and unrelated daily matters | ep09 00:23:30-00:26:30 | Garbled and looping | Clarity, Loop check | Open |
| Talk of the Prophet leaving his house, a crowd and statistics on pupils | ep09 00:28:00-00:32:00 | Garbled, loops, statistics without a source | Clarity, Loop check | Open |
| Stretch on associating partners, sins and a report on repeated asking | ep09 00:33:00-00:38:30 | Garbled, loops at 00:37:00 and 00:38:30 | Clarity, Loop check | Open |
| Talk of lawful earnings, marriage, wives and family matters | ep09 00:39:00-00:44:30 | Garbled, partly generalisations about wives | Voice rule, Clarity | Open |
| Stretch on theft, spying and a punishment in Egypt | ep09 00:44:30-00:54:30 | Garbled, loops, sweeping remarks about peoples and women | Voice rule, Clarity, Loop check | Open |
| Description of the women of Paradise and a stretch on killing | ep09 00:54:30-00:56:30 | Garbled and looping | Clarity, Loop check | Open |
| Talk of wives, marriage and pregnancy beyond the single link to abortion | ep09 00:56:00-01:02:30 | Garbled, loops, sweeping remarks about women | Voice rule, Clarity, Loop check | Open |
| Stretch on tale-bearing, al-Hasan al-Basri and Umar ibn Abd al-Aziz | ep09 01:06:00-01:08:00 | Garbled, speakers and sayings unclear | Clarity | Open |
| Talk of reconciliation, prison and a place for the ill | ep09 01:08:00-01:12:00 | Garbled, loops | Clarity, Loop check | Open |
| Stretch on jihad, the veil and the true and false | ep09 01:12:30-01:14:30 | Garbled, sweeping claims | Voice rule, Clarity | Open |
| Stretch on work papers, a loop of a political name and a closing | ep09 01:15:30-01:18:30 | Loop and garbled speech; a stretch dropped under the content-safety block where it touches modern conflict | Content rule, Clarity, Loop check | Open |

Resume point: sharh-saheeh-al-bukhare episode 10 (branch from origin/main).

### sharh-saheeh-al-bukhare ep15 (14 Nov 2026)

28 points written for episode 15 (ar, en, ur); 21 needs_source marks in each language file for this episode; 16 new `about` edges. Quran verses referenced only through passage links (31-27, 30-21, 19-23, 3-37, 19-4, 19-8, 3-41, 19-10, 49-2, 3-110, 33-8, 68-4); none typed. Contested: he holds that a society applying the hadith on insulting and fighting a Muslim would be the greatest in history, that a person who says she is not convinced of a command raises her voice over the Prophet, that rejecting part of the book is rejecting all of it, and that the rights of people are not cleared by repentance alone; these are his views. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep15) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greetings, opening praise and supplication, and closing prayer | ep15 00:00:00-00:03:00 and 01:19:00 | Opening and closing formulae, not teaching content | Content rule | Open |
| Supplications for fighters in every place | ep15 00:01:30-00:02:30 | A stretch dropped under the content-safety block | Content rule | Open |
| Sweeping remarks on peoples and nations in the knowledge-without-faith passage | ep15 00:07:00-00:09:00 | Generalisation about nations, garbled | Voice rule | Open |
| Garbled passages on Bedouin, jewellery-purchase and hospital anecdotes | ep15 00:15:30-00:19:00 | Too garbled to recover, no clear point | Clarity, Loop check | Open |
| Loop of repeated syllables | ep15 00:10:30-00:11:00 | Repetition loop | Clarity, Loop check | Open |
| Loop of repeated syllables | ep15 00:20:00-00:20:30 | Repetition loop | Clarity, Loop check | Open |
| Garbled lists of sciences and a sermon on magic and nationalism | ep15 00:20:30-00:21:30 | Too garbled to recover | Clarity, Loop check | Open |
| Remarks on a wife and household, and a count of wrongs per second | ep15 00:24:30-00:25:30 | Sweeping claims about women and a garbled figure | Voice rule | Open |
| Loop of one letter | ep15 00:25:30-00:26:00 | Repetition loop | Clarity, Loop check | Open |
| Anecdote of a dying man and money taken from him | ep15 00:27:00-00:29:30 | Garbled personal story without clear source | Clarity, Loop check | Open |
| Remarks on idle people and the sincere youth | ep15 00:34:00-00:34:30 | Sweeping claim about groups | Voice rule | Open |
| Greeting groups, the distorted greeting of non-Muslims and the replies | ep15 00:41:00-00:44:00 | Garbled and touches a sweeping claim about a people | Voice rule | Open |
| Loops | ep15 00:44:30-00:45:30 | Repetition loops | Clarity, Loop check | Open |
| Story of Ikrima and the neighbour passage | ep15 00:46:00-00:47:00 | Garbled, no clear point | Clarity, Loop check | Open |
| Loop and personal military-prison anecdote with interrogation | ep15 00:50:30-00:54:00 | Loops, garbled, political detention narrative | Clarity, Loop check | Open |
| Bedouin and the dog anecdote, humour on a royal visit | ep15 00:55:30-00:58:00 | Garbled joke, no clear point | Clarity, Loop check | Open |
| Intercession report and the silent Bedouin | ep15 01:01:00-01:03:00 | Garbled, loop at 01:02:30 | Clarity, Loop check | Open |
| Halima, the Prophet's wet-nurse names digression, severed kinship and the woman lost in the desert | ep15 01:03:30-01:07:30 | Garbled digressions without clear source | Clarity, Loop check | Open |
| Remark on slaughter customs of other peoples | ep15 01:09:30-01:10:00 | Sweeping claim about peoples | Voice rule | Open |
| Speech on people who talk at length, and the market comparison | ep15 01:16:30-01:18:30 | Garbled | Clarity, Loop check | Open |
| Loop of one letter | ep15 01:16:00-01:16:30 | Repetition loop | Clarity, Loop check | Open |

Resume point: sharh-saheeh-al-bukhare episode 16 (branch from origin/main).

### alwaad-alhaq ep13 (14 Nov 2026)

30 points written for episode 13 (ar, en, ur); 26 needs_source marks for this episode in each language file; 20 new about-links on the series record. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep13) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Umar's night address at the grave | ep13 00:30:30-00:31:00 | Garbled, wording not recoverable | Clarity | Open |
| Asma bint Umays and the camel with the weight of revelation | ep13 00:29:30-00:30:00 | Garbled, chapter name and details not recoverable | Clarity | Open |
| Seniority over Abu Bakr and Umar by years | ep13 00:19:30-00:20:00 | Garbled numbers | Clarity | Open |
| Martyr's body found intact decades later (Hamza and personal sighting) | ep13 00:45:30-00:46:30 | Garbled, personal anecdote without source | Clarity | Open |
| Closing verse lines on the darkness of the grave | ep13 00:52:30-00:53:00 | Unclear whether quotation or poem, no source | Clarity | Open |
| Looped passages | ep13 00:21:30-00:22:30, 00:50:00-00:50:30, 00:13:30-00:14:00 | ASR loops, unrecoverable | Clarity, Loop check | Open |

Resume point: alwaad-alhaq episode 14 (branch from origin/main).
### sharh-saheeh-al-bukhare ep16 (14 Nov 2026)

27 points written for episode 16 (ar, en, ur); 20 needs_source marks in each language file for this episode; 4 new `about` edges. Quran verses referenced only through passage links (17-14, 32-16, 31-11); none typed. Contested: He attributes to scholars a count of ten witnesses against a person, relates unreferenced reports (the grave, the limbs, the gift to the Byzantine ruler's wife) and states that in the majority view of jurists visiting graves is not for women; all are marked as his. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep16) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greeting, praise and supplication, including a prayer about conflicts of Muslims elsewhere | ep16 00:00:00-00:02:00 | Greeting and opening prayer; sweeping claims about modern conflict | Content rule | Open |
| Closing prayer, announcement that the next Friday session is skipped, farewell | ep16 01:18:00-01:18:30 | Closing and housekeeping | Content rule | Open |
| Remarks on daughters, parents and a sweeping label for a kind of father, and a passing comparison naming a people | ep16 00:11:00-00:11:30, 00:18:00-00:19:00 | Garbled and sweeping generalisations about women and a people | Voice rule | Open |
| Jokes about mothers-in-law and wives | ep16 00:36:00-00:36:30 | Sweeping claims about women, garbled | Voice rule | Open |
| Account of the army commander, the news of Muslims in other lands and hopes for victory | ep16 00:59:00-01:00:30 | Sweeping claims about modern conflict, garbled | Content rule | Open |
| Report of the man who was last to leave the Fire, and the youth who came to the Prophet | ep16 00:20:30-00:21:30, 00:29:00-00:30:00 | Too garbled to recover | Clarity, Loop check | Open |
| Stretches in loops or garble: repeated words and letters | ep16 00:11:30, 00:13:30, 00:14:30-00:15:00 (partial), 00:15:30, 00:17:00-00:19:00, 00:23:30, 00:25:30-00:26:00, 00:37:00, 01:15:30 | Loops | Clarity, Loop check | Open |
| Stories of a scholar and a ruler, a vizier and candles, a deputy and sovereign, and a wine question | ep16 00:46:00-00:49:30, 00:53:00-00:56:30, 00:57:30-00:59:00 | Too garbled to recover | Clarity, Loop check | Open |
| Asides on keeping appointments, covenants, punctuality and the wife who holds a grudge | ep16 00:33:00-00:35:00, 00:37:30-00:38:30, 00:40:00-00:42:00 | Garbled | Clarity, Loop check | Open |
| Asides on supplications, a husband and household talk, and unclear advice | ep16 01:03:30-01:12:00 | Garbled | Clarity, Loop check | Open |
| Advice on avoiding the heedless and on marrying into heedless families | ep16 01:15:30-01:16:30 | Garbled | Clarity, Loop check | Open |
| Closing remark that one should be someone people regret losing | ep16 00:12:00-00:12:30 | Garbled, not recoverable | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 17 (branch from origin/main).

### sharh-saheeh-al-bukhare ep10 (14 Nov 2026)

19 points written for episode 10 (ar, en, ur); 13 needs_source marks in each language file for this episode; 4 new `about` edges. Quran verses referenced only through passage links (3-173, 3-144); none typed. Contested: He holds that a shared deed or shared heart is not accepted, that istikhara has no link to dreams, and that fear of infection is weaker than certainty; these are his views. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep10) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening loop, greetings, opening supplication | ep10 00:00:00-00:02:00 | Repeated-phrase loop and opening prayer | Clarity, Loop check | Open |
| Break joins, closing prayer, announcements and credits | ep10 01:10:30-01:14:00 | Closing words, donation and publisher announcements | Content rule | Open |
| A stretch touching a modern conflict and a political figure | ep10 00:28:00-00:28:30 | A stretch dropped under the content-safety block | Content rule | Open |
| Garbled stretch on the world's problems and a leader | ep10 00:33:30-00:34:30 | Garbled, claim about the Prophet and world problems not recoverable | Clarity | Open |
| Remarks on children, parents and wives, and divorce vows | ep10 00:26:00-00:29:30, 01:05:30-01:06:00 | Garbled; sweeping advice about family not recoverable | Voice rule, Clarity | Open |
| Hasan al-Basri sayings and the duas on wealth and children | ep10 00:29:30-00:30:30 | Garbled, speaker and words unclear | Clarity | Open |
| Two kinds of heart disease, hypocrites' signs and promises | ep10 00:39:30-00:42:00 | Garbled, items not recoverable | Clarity | Open |
| Advice on a visit to graves and the Kaaba, and on choosing a path | ep10 00:42:30-00:43:30 | Garbled | Clarity | Open |
| Stories of the ant and a ruler, and of Yaqub's shirt | ep10 00:53:00-00:53:30, 00:56:00-00:56:30 | Garbled, report unclear | Clarity | Open |
| Questions on cure, wealth and signs of God's care | ep10 00:58:30-01:01:00, 01:02:00-01:04:30 | Garbled, loops and unclear reports | Clarity, Loop check | Open |
| Remarks on household habits and a saying on teaching groups | ep10 01:05:00-01:06:30, 01:08:00-01:09:00 | Garbled | Clarity | Open |
| Loop stretches of repeated syllables | ep10 00:09:00-00:09:30, 00:15:30-00:16:00, 00:16:30-00:17:00, 00:18:00-00:18:30, 00:21:30-00:22:00, 00:25:30-00:26:00, 00:32:30-00:33:00, 00:41:00-00:41:30, 00:42:00-00:42:30, 00:43:30-00:44:00, 00:46:30-00:47:30, 00:49:00-00:49:30, 00:54:30-00:55:00, 00:56:30-00:57:30, 01:04:00-01:04:30, 01:06:30-01:07:00, 01:07:30-01:08:00, 01:09:30-01:10:00, 01:11:30-01:12:30 | Repeated-token loops | Loop check | Open |

Resume point: sharh-saheeh-al-bukhare episode 11 (branch from origin/main).

### alwaad-alhaq ep14 (14 Nov 2026)

32 points written for episode 14 (ar, en, ur); 22 needs_source marks for this episode in each language file; new links to the angel of death, Munkar and Nakir, the soul, the martyr, Amr ibn al-As, al-Bara ibn Azib, Jonah, Dihya al-Kalbi and Michael. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep14) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Loop stretches of repeated syllables | ep14 00:04:30-00:05:00, 00:31:00-00:31:30, 00:41:00-00:41:30, 00:52:00-00:52:30 | Repeated-token loops | Loop check | Open |
| Remark on asking God only in health and a saying of one Abu Hamid on death as a transfer | ep14 00:07:00-00:07:30, 00:26:30-00:27:30 | Garbled, speaker and words unclear | Clarity | Open |
| An aside on not wanting to die in the grave | ep14 00:20:30-00:21:00 | Garbled | Clarity | Open |
| Technical washing details (hand cloth, posture, pressing the belly) | ep14 00:31:00-00:32:00 | Garbled, steps not recoverable | Clarity | Open |
| Closing prayers, sign-offs and repeated opening verses | ep14 00:52:30-00:54:00 | Closing words and repeated recitation | Content rule | Open |

Resume point: alwaad-alhaq episode 15 (branch from origin/main).
### sharh-saheeh-al-bukhare ep11 (14 Nov 2026)

21 points written for episode 11 (ar, en, ur); 13 needs_source marks in each language file for this episode; 6 new `about` edges. Quran verses referenced only through passage links (31-14, 33-28, 33-29); none typed. Contested: His reading of the hadith on kindness forgotten by a wife, his saying that knowledge shows in uprightness, and his advice on gratitude to parents and the teacher are his own views; the sayings and reports he relates by sense carry no chain. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep11) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening praise, loop and opening prayer | ep11 00:00:00-00:02:00 | Greetings and prayer, loops | Clarity, Loop check | Open |
| Stories of al-Hajjaj and others, remarks on killing and politics, loops | ep11 00:08:30-00:14:30 | Garbled, sweeping remarks on modern conflict | Voice rule / Clarity, Loop check | Open |
| Stories about the table, Jesus and Mary, epidemics, innovations | ep11 00:15:30-00:21:00 | Too garbled to recover | Clarity, Loop check | Open |
| Loops on the Fire and the number of its layers | ep11 00:22:00-00:24:30 | Loops, garbled | Clarity, Loop check | Open |
| Garbled passages on paradise and parents, loops | ep11 00:27:30-00:34:00 | Garbled stories and repeated words | Clarity, Loop check | Open |
| Remarks on war and resistance, loops | ep11 00:35:00-00:38:30 | A stretch dropped under the content-safety block | Content rule | Open |
| Closing-style prayer after the first part | ep11 00:42:00-00:42:30 | Prayer | Clarity | Open |
| Remedies for family quarrels, a late-comer story, loops | ep11 00:45:00-00:50:30 | Garbled, names unreliable | Clarity, Loop check | Open |
| Asides on wealth and poverty | ep11 00:54:00-00:55:00 | Garbled | Clarity | Open |
| Advice on wives, kinds of women, a woman's advice, loops | ep11 01:00:00-01:08:00 | Sweeping claims about women, garbled | Voice rule / Clarity, Loop check | Open |
| Questions and answers on mothers-in-law, cameras and visits, loops | ep11 01:08:00-01:13:00 | Garbled | Clarity, Loop check | Open |
| Break join, thanks and closing, trailing noise | ep11 01:14:30-01:15:00 | Greetings and closing remarks | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 12 (branch from origin/main).

### sharh-saheeh-al-bukhare ep12 (14 Nov 2026)

22 points written for episode 12 (ar, en, ur); 6 needs_source marks in each language file for this episode; 8 new `about` edges. Quran verses referenced only through passage links (24-30, 24-31, 49-11); none typed. Contested: He says the tongue is a calamity in our time, treats hunger, sickness and death as things the sound heart loves, and gives a view on saying the phrase that God has spoken truly after recitation (not established by an authentic report, either view may be taken); all are marked as his view. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep12) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greetings, praise and opening prayer | ep12 00:00:00-00:02:00 | Opening formulas and recap of the previous lesson, no content point | Content rule | Open |
| Closing prayer, farewell and announcement of a company | ep12 01:19:30-01:20:00, 01:25:30-01:25:30 | Closing prayer, break join and commercial notice, not teaching | Content rule | Open |
| Narrator name and place of the meeting with Abu Dharr | ep12 00:02:00-00:03:00 | Names garbled, left out rather than guessed | Clarity | Open |
| Talk of the Prophet being seen in dreams, a question put to Ibn Taymiyya and the friends of God | ep12 00:13:30-00:18:00 | Garbled, speakers and sequence unclear | Clarity | Open |
| Stories of Umar, the tent at Fustat and doves, and talk of illness in Egypt | ep12 00:23:00-00:26:00 | Garbled and partly invented by the recognizer, speakers unclear | Clarity | Open |
| Stretch on names the Prophet changed and on a madman | ep12 00:25:30-00:27:00 | Garbled | Clarity | Open |
| Looping and unrelated stretch with a fox tale and repeated words | ep12 00:27:00-00:29:30 | Loop and garbled speech with no recoverable point | Clarity, Loop check | Open |
| Stories of Umar and a dream, a girl and a river, and a shaykh's pupils | ep12 00:33:00-00:39:00 | Loop and garbled speech, speakers unclear | Clarity, Loop check | Open |
| Mention of a ruling about a visitor, the adhan and the muezzins, and a story of a sacrifice | ep12 00:43:30-00:46:30 | Garbled, only the report of the flute of the family of David is nearly clear and its reply is not recoverable | Clarity | Open |
| Talk of marriage proposals, fathers and daughters, and newspaper marriage notices | ep12 00:53:30-00:57:00 | Garbled and sweeping remarks about people | Voice rule, Clarity | Open |
| Stretch on present-day conflicts and calls to action in a named country | ep12 01:05:30-01:07:30 | Sweeping claim about modern conflict | Voice rule | Open |
| Remarks on lawyers, doctors and professions | ep12 01:07:30-01:09:00 | Garbled and sweeping claims about professions | Voice rule, Clarity | Open |
| Story of a scholar, a ruler and a reading of Sahih al-Bukhari | ep12 01:17:00-01:19:00 | Garbled and carries a sweeping political claim about rulers | Voice rule, Clarity | Open |
| Remarks on politics, peoples, voting and an exchange with an emperor attributed to Harun al-Rashid | ep12 01:21:30-01:25:30 | Garbled and sweeping claims about peoples and modern conflict | Voice rule, Clarity | Open |
| Loops at 00:27:30, 00:29:00, 00:36:00, 00:37:00, 00:40:30, 00:48:30, 00:50:00, 00:53:00, 00:57:00, 00:57:30, 01:00:00, 01:02:00, 01:03:00, 01:03:30, 01:06:30, 01:07:00, 01:09:30, 01:14:30, 01:16:30, 01:22:30 | ep12 various | Repeated words | Clarity, Loop check | Open |

Resume point: sharh-saheeh-al-bukhare episode 13 (branch from origin/main).

### sharh-saheeh-al-bukhare ep13 (14 Nov 2026)

26 points written for episode 13 (ar, en, ur); 17 needs_source marks in each language file for this episode; 5 new `about` edges. Quran verses referenced only through passage links (28-26, 2-177, 6-61, 38-75, 2-255, 112-1, 16-66); none typed. Contested: He holds that the believer who resists temptation in a corrupt society is better in God's sight than one living in a society where disobedience is nearly impossible, and he attributes to unnamed European scholars a judgement on the Prophet's character; both are his views, and the reports he gives on angels and on Ibrahim are stated without a chain. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep13) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening supplication, greetings and invocations | ep13 00:00:00-00:00:30 | Greetings and opening prayer | Content rule | Open |
| Closing supplication, break join and sign-off, second opening of a new hadith session | ep13 01:09:00-01:10:30, 01:18:00-01:24:30 | Closing prayers and invocations, repeated lines, break join | Content rule, Loop check | Open |
| Credits and contact details of the publisher | ep13 01:28:00-01:29:00 | Promotional lines and sign-off | Content rule | Open |
| Sweeping claims about rulers, wars and modern politics in the Muslim world | ep13 00:24:00-00:27:30, 01:08:30-01:09:00 | Sweeping claim about modern conflict and peoples, partly garbled | Content rule, Voice rule | Open |
| Remarks on marriage customs, proposals and relatives, and on wives and in-laws | ep13 00:11:30-00:16:00, 00:21:00-00:22:00 | Garbled; sweeping advice about women and families not recoverable | Voice rule, Clarity | Open |
| Story of Umar's household and sweets from the public treasury | ep13 00:08:00-00:10:00 | Garbled, speaker and details unclear | Clarity | Open |
| Remarks on gossip and faults of people | ep13 00:17:00-00:19:30 | Garbled, referents unclear | Clarity | Open |
| Hadith by sense on honouring a transgressor and on seeking knowledge | ep13 00:25:00-00:26:00 | Garbled; wording and referent not recoverable | Clarity | Open |
| Story of Harun al-Rashid and a jar, and a visit story | ep13 00:30:00-00:32:30 | Garbled, plot not recoverable | Clarity | Open |
| Remarks on a famous reciter and on a man who played with the mushaf | ep13 00:32:30-00:34:30 | Garbled, meaning not recoverable | Clarity | Open |
| Remarks on reason, a lent coin and the glass half full | ep13 00:38:30-00:41:30 | Garbled, comparison unclear | Clarity | Open |
| Daydreams, desire and imagined wealth | ep13 00:43:00-00:45:30 | Garbled, meaning not recoverable | Clarity | Open |
| Remarks on angels and doctors, a doctor story and a prayer-rows story | ep13 00:51:00-00:52:00, 00:54:30-00:55:00 | Garbled, speaker and plot unclear | Clarity | Open |
| Remarks on the Kaaba as the centre of the earth and satellite claims | ep13 00:58:00-00:58:30 | Unsupported factual claim stated without reference | Content rule, Clarity | Open |
| Remarks on the Gospel, a woman and the nature of Isa | ep13 01:01:00-01:02:30 | Garbled, wording not recoverable | Clarity | Open |
| Remarks on science, oil, resources of Muslim countries and the Hoopoe | ep13 01:05:30-01:08:30 | Garbled; sweeping claim about peoples | Content rule, Clarity | Open |
| Questions on charity from doubtful money, maintenance of relatives and bank accounts | ep13 01:12:30-01:14:00 | Garbled; fiqh answers not recoverable | Clarity | Open |
| Remark on death and the testimony and the burning of a mat or green | ep13 01:14:00-01:15:30 | Garbled, meaning not recoverable | Clarity | Open |
| Remark on the Prophet's greatness compared with a named figure | ep13 01:27:00-01:28:00 | Garbled, name unclear | Clarity | Open |
| Loop stretches of repeated syllables | ep13 00:02:30-00:03:00, 00:05:30-00:06:00, 00:07:30-00:08:30, 00:12:00-00:13:00, 00:19:00-00:20:30, 00:36:30-00:37:00, 00:38:00-00:38:30, 00:45:00-00:45:30, 00:50:30-00:51:00, 01:01:30-01:02:00, 01:05:00-01:05:30, 01:07:00-01:08:30, 01:10:00-01:10:30, 01:15:00-01:15:30, 01:21:30-01:24:00 | Repeated-token loops | Loop check | Open |
| Throne-bearers' two praise formulas and the "shy" middle person in the three-people report | ep13 00:55:30-00:56:00, 01:17:00-01:17:30 | Garbled; wording not recoverable from the transcript | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 14 (branch from origin/main).

### alwaad-alhaq ep15 (14 Nov 2026)

15 points written for episode 15 (ar, en, ur); 17 needs_source marks for this episode in each language file; persons and events linked to existing records, with the unnamed or unstable names (al-Thawri, Hanzala, the student of al-Shafi'i) left unlinked. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep15) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Passage on Abu Jahl and the nineteen guardians of the Fire | ep15 00:07:30-00:08:30 | speech too garbled by the transcription engine to restate faithfully | accuracy | Open |
| Looping or garbled stretches | ep15 00:12:30-00:15:30, 00:34:00-00:35:00, 00:41:30-00:42:00, 00:44:00-00:44:30, 00:51:30, 00:52:30 | machine transcript loops and cannot be restated; details of the oven and jaw scenes taken from the clear surrounding text | accuracy | Open |
| Identity of the fourth grave question | ep15 00:07:30 | the sheikh says four questions but names three; the fourth is not stated | accuracy | Open |
| Identity of al-Thawri, Hanzala and al-Shafi'i's student | ep15 00:17:30-00:26:30 | names unstable or without lineage in the machine transcript; left unlinked pending the founder | accuracy | Open |
| Circumstances of the death of Sa'id ibn Zayd in the sheikh's account | ep15 00:21:00-00:24:30 | the account places a death in battle; proposed for checking against held biographical sources | accuracy | Open |
| Answer on Muslims who died without repenting | ep15 00:46:30 | speech garbled; only the clear parts (the declaration of faith fulfilled with its due) recorded | accuracy | Open |

Resume point: alwaad-alhaq episode 16 (branch from origin/main).
### sharh-saheeh-al-bukhare ep14 (14 Nov 2026)

23 points written for episode 14 (ar, en, ur); 12 needs_source marks in each language file for this episode; 12 new `about` edges. Quran verses referenced only through passage links (1-1, 1-2, 1-3, 1-4, 1-5, 1-6, 1-7); none typed. Contested: He gives his own readings on how faith rises and falls, on the shortcomings of the Companions, on the secret of purity and of the opening takbir, on the Fatiha, on naming prophets and later scholars as those favoured, and a rule on saying God knows best versus God and His Messenger know best; all are marked as his view. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep14) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greetings, praise and opening prayer | ep14 00:00:00-00:03:00 | Opening formulas and invocations, no content point | Content rule | Open |
| Break join, advert for a company and closing remarks | ep14 01:22:30-01:23:30 | Looping words, then closing remarks and a commercial notice, not teaching | Content rule, Loop check | Open |
| Inheritance case before Umar, slave-market story and remarks on the science of inheritance | ep14 00:08:30-00:11:30 | Garbled, speakers and figures unclear | Clarity | Open |
| Dialect aside, grammar question and repeated words | ep14 00:15:30-00:17:30 | Garbled and looping | Clarity, Loop check | Open |
| Stretch on what a nursing child's urine does to a prayer and on the prayer of a person pressed or tightly shod | ep14 00:25:00-00:34:30 | Garbled, partly colloquial and unclear who is quoted; only the report at 00:26:30 is used | Clarity | Open |
| Remarks on a sign-of-ablution dispute, ring marriage vows and divorce | ep14 00:36:30-00:37:30 | Garbled | Clarity | Open |
| Sweeping asides on how Muslims are today and on others | ep14 00:33:00 | One passing generalisation about present-day Muslims | Voice rule | Open |
| Loops at 00:14:30, 00:17:00, 00:28:30, 00:29:00, 00:44:30, 00:48:30, 00:51:00, 00:53:30, 00:55:00, 00:59:30, 01:08:00-01:09:30, 01:10:30, 01:16:30, 01:22:30 | ep14 various | Repeated words | Clarity, Loop check | Open |
| Hunger story, stories of those given contentment and the man of the heroin trade and Iblis | ep14 01:00:00-01:06:00 | Garbled, speakers and sequence unclear | Clarity | Open |
| Stretch on reciting the Fatiha correctly, a preacher on the pulpit and a man late for prayer in Umar's time | ep14 01:10:00-01:13:00 | Garbled, speakers unclear | Clarity | Open |
| Names and details the transcript does not clearly support: the exact count of the series, the narrator of the man's departure remark, the name of the scholar quoted at 00:51:30, the Companion reports at 00:11:00 | ep14 00:00:00, 00:19:00, 00:51:30, 00:11:00 | Garbled or absent, reduced to what is clear | Clarity | Open |
| Percentages and sums of money in the two illustrations (marks falling, money given from a small and a large sum), the tie of the dignity of a gift to what is left, the full list of what faith is believed in, and the claim that cleaning the outward serves a clean heart | ep14 00:06:00, 00:08:00, 00:18:30-00:19:00, 00:47:30 | Illustrative figures, garbled or not clearly stated; reduced to what is clear | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 15 (branch from origin/main).

### sharh-saheeh-al-bukhare ep17 (14 Nov 2026)

25 points written for episode 17 (ar, en, ur); 16 needs_source marks in each language file for this episode; 8 new `about` edges. Quran verses referenced only through passage links (17-32, 9-36, 5-101, 5-3); none typed. Contested: He holds that whoever declares lawful what God forbade or forbids what God made lawful has set up a partner with God, that whoever rejects a matter known by necessity has left the faith, and he gives his own rulings on the face veil, wine-related transactions, renamed interest and the waiting period for animals fed on filth; these are his views and are contested among scholars. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep17) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, long opening supplication and closing prayer, farewell and announcement about who may speak in the mosque | ep17 00:00:00-00:03:00, 01:13:30-01:14:30 | Greetings, prayers and administrative announcements, not teaching; the opening prayer also names fighters in places, dropped under the content-safety block | Content rule | Open |
| Rant on magazines, pictures of women and the youth of secondary schools | ep17 00:10:30-00:12:30 | Demeaning generalisation about women and young people, and ASR is garbled | Voice rule | Open |
| Remarks on wives who object to a husband's second marriage, calling them lacking in reason and a ruling of polytheism on them | ep17 00:16:30-00:18:00 | Demeaning generalisation about women | Voice rule | Open |
| Account of animals' ages and "50,000 years" arithmetic and garbled side comments | ep17 00:08:30-00:09:30 | Garbled and speculative numbers | Clarity, Loop check | Open |
| Stories about pig-fat, wine and beer used on cows and about a trader and a doubtful stock of meat and a man named Rabia | ep17 00:23:30-00:25:30, 00:27:30-00:34:30 | Garbled stories, names and details cannot be recovered | Clarity, Loop check | Open |
| Stretch on Ali, Usama and Umar ibn Abd al-Aziz's daughters | ep17 00:37:30-00:43:30 | Garbled and partial; only the later milk story is recoverable | Clarity | Open |
| Loop stretches (repeated letters or words) | ep17 00:22:30-00:23:00, 00:28:00-00:28:30, 00:30:00-00:30:30, 00:34:30-00:35:00, 00:41:30-00:42:00, 00:43:00-00:43:30, 00:45:30-00:46:00, 00:46:30-00:47:00, 00:51:00-00:51:30, 00:55:30-00:56:30, 01:04:00-01:04:30, 01:02:00-01:02:30 | Repeated tokens and noise | Clarity, Loop check | Open |
| Claims about the modern world: electricity, medical drugs and alcohol, hormones in chickens and kidney failure in Egypt, and foreign countries | ep17 00:46:00-00:47:30, 00:55:30-00:56:30, 01:04:00-01:05:30, 01:07:30-01:08:30 | Sweeping unsupported claims and garbled | Content rule, Clarity | Open |
| Stretch about a Gulf or Arab league meeting and the leaders there | ep17 01:01:30-01:02:30 | Garbled and sweeping | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 18 (branch from origin/main).

### sharh-saheeh-al-bukhare ep18 (14 Nov 2026)

27 points written for episode 18 (ar, en, ur); 23 needs_source marks in each language file for this episode; 11 new `about` edges. Quran verses referenced only through passage links (22-27, 12-70, 12-75, 35-32, 13-6, 23-60, 18-60, 18-61, 3-41, 19-10, 2-31, 18-65, 18-68, 18-69, 18-72, 59-21); none typed. Contested: He attributes to Ibn al-Qayyim the point on the closing of the door of success, relates end-time narrations, the Hijra cave account, and reports of Jesus, Dawud, al-Shafii and Malik without chain, gives a list of six reasons and four kinds of knowledge as his own scheme, and holds that finishing the Qur'an once a month is the minimum; all are marked as his. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep18) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greeting, praise and prayer on the Prophet | ep18 00:00:00-00:00:30 | Greeting and opening prayer | Content rule | Open |
| Closing supplication, announcement of the next session and call to prayer | ep18 01:17:30-01:18:30 | Closing and housekeeping | Content rule | Open |
| Looping and garbled stretches (repeated syllables and phrases) | ep18 00:07:00-00:08:30, 00:15:00, 00:22:00, 00:25:30, 00:58:00-00:58:30, 00:59:00-00:59:30, 01:07:30-01:08:00, 01:14:00-01:14:30, 01:15:00 | Loop and garbling, nothing recoverable | Clarity, Loop check | Open |
| Story of a sick man who dreamed of the Prophet and was told a remedy | ep18 00:10:00-00:11:30 | Garbled and unreferenced | Clarity, Loop check | Open |
| Further remarks on Joseph, his brothers and his lodging of the poor | ep18 00:12:30-00:14:30 | Garbled | Clarity | Open |
| Report about Abu al-Darda and sleeping in ablution, and the angels' supplication detail | ep18 00:21:30-00:22:30 | Garbled | Clarity | Open |
| Tale of a prayer for Abu Bakr's companion and a report about a worshipper before dawn | ep18 00:29:30-00:31:30 | Garbled | Clarity | Open |
| Reported saying that most followers of the false Messiah are of certain groups including women, with remarks on fashion | ep18 00:39:30-00:40:30 | Sweeping claims about women and groups | Voice rule | Open |
| Anecdote on greed and business dealings, with figures | ep18 01:05:30-01:06:30 | Sweeping generalisation, unreferenced figures | Voice rule | Open |
| Remarks that the environment shapes people, with a comparison naming a modern politician, and sweeping claims about Muslims' ignorance | ep18 01:14:30-01:16:00 | Sweeping claims, garbled | Voice rule | Open |

Resume point: sharh-saheeh-al-bukhare episode 19 (branch from origin/main).

### alwaad-alhaq ep16 (14 Nov 2026)

19 points written for episode 16 (ar, en, ur); 17 needs_source marks for this episode in each language file; 16 new `about` edges (ghulul, zakat, innovation, martyr, betrayal, trust, the unseen, tale-bearing, deviation, gifts to workers, the gift, purity, ongoing charity, Abd Allah ibn Rawaha, Abu al-Darda, Awf ibn Malik); Contested: his readings of the verses, the soul-and-body account, the decay figures and his views on gifts, innovation and funeral customs are marked as his. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep16) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Loop and garbled stretches | ep16 00:07:30, 00:15:30, 00:25:30, 00:29:30-00:30:30, 00:40:30-00:41:00, 00:43:00-00:43:30, 00:44:30-00:45:00, 00:46:00, 00:51:00-00:51:30 | Repeated tokens and noise, nothing recoverable | Clarity, Loop check | Open |
| Names in the grave-aflame cloak report (Abd al-Rahman ibn Awf and a cemetery) | ep16 00:06:00-00:07:00 | Names unstable in the transcript, left unlinked pending the founder | Accuracy | Open |
| Saying that the followers of innovation are dogs of Hell, and remarks on the funeral reciters' fees and a figure of one hundred thousand | ep16 00:27:30-00:29:30 | Sweeping and garbled, unreferenced figure | Voice rule, Clarity | Open |
| Remark that people in the West each live as an isolated island | ep16 00:17:00-00:17:30 | Sweeping generalisation about a people | Voice rule | Open |
| Report on the previous nations punished by general torment, and the sheikh's answer on whether the unbeliever is punished in the grave | ep16 00:09:30-00:10:00 | Garbled, only the clear sentence recorded | Clarity | Open |
| Attribution to Ata ibn Abi Rabah about waiting for rain and for the stone, and the Ibn Hazm and Ibn Hajar remarks on the ruler's duty | ep16 00:30:30, 00:32:30-00:33:00 | Garbled and misattributed in the transcript | Accuracy | Open |
| Remarks on objecting to God's words, the deceiver and schemer details | ep16 00:42:30-00:43:00, 00:47:30-00:48:30 | Garbled | Clarity | Open |
| Opening greeting and closing farewell | ep16 00:00:30-00:01:30, 00:51:30-00:52:30 | Greeting, prayer and housekeeping | Content rule | Open |

Resume point: alwaad-alhaq episode 17 (branch from origin/main).
### sharh-saheeh-al-bukhare ep19 (14 Nov 2026)

29 points written for episode 19 (ar, en, ur); 21 needs_source marks in each language file for this episode; 3 new `about` edges. Quran verses referenced only through passage links (9-107, 9-108, 61-3, 51-56, 39-53); none typed. Contested: His account of Abu Hanifa on laughter in prayer, his fatwa that a low-paid employee with dependents may take zakat, his views on nail polish in prayer, the foot as awra, and his ruling on the imam's successor are his own and contested among jurists. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep19) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, long supplication and closing greetings and prayer | ep19 00:00:30-00:02:30, 01:26:00-01:26:30 | Greetings and prayer, not teaching | Content rule | Open |
| Loops and garbled stretches (repeated syllables) | ep19 00:03:30-00:03:30, 00:07:30-00:07:30, 00:18:30-00:19:00, 00:25:00-00:25:00, 00:40:30-00:40:30, 00:42:30-00:42:30, 00:48:00-00:48:00, 00:52:30-00:52:30, 01:01:00-01:01:00, 01:03:00-01:03:00, 01:04:00-01:04:30, 01:06:30-01:06:30, 01:22:00-01:22:00, 01:23:00-01:23:00 | Repeated tokens, nothing recoverable | Clarity, Loop check | Open |
| Stretches too garbled to state faithfully: stories on wealth and friends, the hole in the heart, a rabbi and a man of many sins, a man who would not leave the water, the snare of desire | ep19 00:15:00-00:19:30, 00:22:00-00:30:00, 00:38:00-00:41:00 | Meaning not recoverable from the transcript | Clarity, Loop check | Open |
| Remarks on women's dress, hairstyles and cosmetics presented as sweeping claims, and a lengthy discussion of a woman plaiting her hair | ep19 00:52:00-00:56:00 | Sweeping generalisations about women and unclear text | Voice rule, Clarity | Open |
| Details of cleaning after relieving oneself and bodily movements | ep19 00:48:30-00:49:30 | Garbled and not suited to the museum voice | Clarity, Voice rule | Open |
| Jokes about a prince's alms and an old woman, and servant knocking stories | ep19 01:13:30-01:15:00, 01:20:30-01:22:30 | Garbled anecdotes with no clear teaching | Clarity | Open |
| Remarks on modern states and armies and a soldier's story | ep19 00:34:00-00:35:00 | Sweeping claim about a modern conflict, partly looped | Content rule, Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 20 (branch from origin/main).

### sharh-saheeh-al-bukhare ep20 (14 Nov 2026)

24 points written for episode 20 (ar, en, ur); 16 needs_source marks in each language file for this episode; 3 new `about` edges. Quran verses referenced only through passage links (50-41, 14-22); none typed. Contested: He holds that one should stay and fill every field rather than leave a land of evil, has reservations on a bank-work opinion, defines dar al-Islam and dar al-harb in his own terms, and gives his own rulings on oath and Ramadan expiation; all are his views. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep20) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, praise and supplication | ep20 00:00:00-00:02:00 | Greeting and opening prayer | Content rule | Open |
| Closing supplication and farewell | ep20 01:18:00-01:18:00 | Closing prayer | Content rule | Open |
| Naming countries and regions as abode of war or abode of Islam | ep20 00:04:00-00:04:30 | Sweeping claims about peoples and states | Voice rule | Open |
| Claims that non-Muslim states take and re-educate Muslim children, and that Islam is blamed for backwardness | ep20 00:05:00-00:07:00 | Sweeping claims about peoples and modern politics | Voice rule | Open |
| Nuclear weapons, Napoleon and the French legal code, a named writer and Jamal al-Din al-Afghani | ep20 00:07:00-00:16:30 | Sweeping claims about peoples and states, personal attacks, heavy garbling | Voice rule | Open |
| Loop of repeated syllables | ep20 00:14:00-00:14:30 | Loop | Clarity, Loop check | Open |
| Students, lecture schedules and prayer, Gulf of anecdotes | ep20 00:16:30-00:17:00 | Garbled | Clarity, Loop check | Open |
| Three scholars and the voice, Bedouin wording, language professor and Umar anecdote | ep20 00:20:30-00:24:30 | Garbled, cannot recover the point | Clarity, Loop check | Open |
| Loop of repeated syllables | ep20 00:25:00-00:25:30 | Loop | Clarity, Loop check | Open |
| Blind judge, Umar and poetry, non-Arabic words in the Qur'an | ep20 00:26:30-00:29:00 | Garbled | Clarity, Loop check | Open |
| New Year night and knowledge session, loop of one word | ep20 00:32:00-00:33:00 | Garbled and loop | Clarity, Loop check | Open |
| Procrastination talk and loop of repeated letters | ep20 00:34:00-00:34:30; 00:37:30 | Garbled and loop | Clarity, Loop check | Open |
| Strategy of Europeans, missions, theatre, liberation of women and claims about Jews | ep20 00:38:30-00:42:30 | Sweeping claims about peoples, women and groups | Content rule, Voice rule | Open |
| Loop of repeated characters and numbers | ep20 00:39:30; 00:44:00 | Loop | Clarity, Loop check | Open |
| Court summons analogy and sayings on turning to God | ep20 00:43:30-00:45:30 | Garbled | Clarity, Loop check | Open |
| Hajj intention story, test through a son | ep20 00:47:00-00:49:00 | Garbled | Clarity, Loop check | Open |
| Loop of repeated phrase | ep20 00:49:30-00:49:30 | Loop after the first lines | Clarity, Loop check | Open |
| Tale of three men and the miser, loop | ep20 00:51:00-00:52:00 | Garbled | Clarity, Loop check | Open |
| Loops of repeated letters | ep20 00:59:00-01:01:00 | Loop | Clarity, Loop check | Open |
| Mosque attendance and remarks on the series and al-Bukhari | ep20 01:01:00-01:02:00 | Garbled | Clarity, Loop check | Open |
| Marriage stories, suitor inspection, case of an unmarried woman and family costs | ep20 01:04:30-01:06:30; 01:07:30-01:09:00; 01:09:30-01:10:00 | Garbled, anecdotes without source | Clarity, Loop check | Open |
| Garbled remarks before the orphan line and loops after Qur'an teaching | ep20 01:13:00-01:13:30; 01:14:30; 01:17:00-01:18:00 | Garbled and loop | Clarity, Loop check | Open |

Resume point: sharh-saheeh-al-bukhare episode 21 (branch from origin/main).

### sharh-saheeh-al-bukhare ep21 (14 Nov 2026)

19 points written for episode 21 (ar, en, ur); 10 needs_source marks in each language file for this episode; 9 new `about` edges. Quran verses referenced only through passage links (99-1, 105-5, 21-30, 3-31, 59-7); none typed. Contested: He says the Prophet's forbidding is like God's, that the Sunna is revelation alongside the Qur'an, and offers earthquakes, wind and illness as signs and reminders from God; these are his readings and are attributed to him. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep21) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening praise, supplications and the closing greetings and prayer | ep21 00:00:00-00:05:00; 01:15:30-01:16:00 | Greetings and prayer, not teaching content | Content rule | Open |
| Long supplications for the sick and for the ill in hospitals | ep21 00:20:00-00:21:30 | Closing-style prayer, garbled | Content rule | Open |
| Statistics on the share of earthquakes around the Pacific and comparisons with Muslim regions | ep21 00:11:30-00:12:30 | Inconsistent figures, garbled, unreferenced | Clarity, Loop check | Open |
| Direct appeals to ministers, judges and the media, and a call to cut relations with a party and govern differently | ep21 00:12:30-00:13:30; 00:28:30-00:29:30 | Sweeping claims about modern politics and peoples | Voice rule | Open |
| Repeated filler loops | ep21 00:13:30, 00:21:00, 00:33:30, 00:35:00, 00:43:30, 00:48:30, 00:54:30, 00:58:30-00:59:00, 01:01:30, 01:03:00, 01:04:00, 01:06:30, 01:14:00, 01:15:00 | Loop or repeated token, no content | Clarity, Loop check | Open |
| Story of David, Solomon and the stone, and the claim about who dies by stones | ep21 00:40:00-00:42:00 | Too garbled to recover | Clarity | Open |
| Claims about wives of prophets betraying and about wives sharing secrets, and sweeping claims about women | ep21 00:46:00-00:47:30 | Demeaning generalisations about women | Voice rule | Open |
| Remarks on Lut's people, a country's statistics and a disease | ep21 00:48:00-00:50:30 | Sweeping claims about a group, unreferenced statistics | Voice rule, Content rule | Open |
| Remarks on Palestine, maps and other peoples and countries | ep21 01:01:30-01:03:30; 01:05:00-01:06:00 | Sweeping claims about peoples and modern conflict, garbled | Voice rule | Open |
| Stretches on hearts of scholars, teachers and a conference | ep21 00:59:00-01:00:30; 01:05:00-01:05:30 | Too garbled to recover | Clarity | Open |
| Stretch about the pious and the hypocrite and a remark about trade | ep21 01:14:30; 00:29:30-00:30:00 | Garbled | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 22 (branch from origin/main).

### alwaad-alhaq ep17 (14 Nov 2026)

19 points written for episode 17 (ar, en, ur); 17 needs_source marks for this episode in each language file; links added to ghayba, kadhib, sihr, ghayb, jinn, hajj-rulings, tahara, kahana, wudu-fiqh and the Companions discussed. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep17) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening and closing greetings, thanks, poems and prayers | ep17 00:00:00-00:02:30; 00:50:00-00:51:30 | Greetings and prayer, not teaching content | Content rule | Open |
| Stretches of repeated filler loops | ep17 00:12:30; 00:15:30; 00:33:30; 00:35:00; 00:48:30 | Loop or repeated token, no content | Clarity, Loop check | Open |
| Remark on security agencies, Umar and spying on soldiers, and a comparison of pre-Islamic houses with Europe today | ep17 00:10:30-00:11:30; 00:13:00-00:13:30 | Sweeping claims about modern politics and peoples, garbled | Voice rule, Clarity | Open |
| Astronomy question and stretch on the pilgrimage compared with spouses and mothers | ep17 00:24:00; 00:26:30-00:27:30 | Garbled, jokes about wives | Clarity, Voice rule | Open |
| Story of Aisha and her nephew, and the hems of women's clothes | ep17 00:48:00-00:48:30; 00:44:30-00:45:30 | Too garbled to recover | Clarity | Open |
| Mention of al-Ghazali and al-Munqidh before the Ibn al-Qayyim saying | ep17 00:45:30 | Attribution unclear in transcript; saying kept under Ibn al-Qayyim only | Clarity | Open |
| Name of the person to whom the prayer-time saying is ascribed | ep17 00:28:30 | Transcript reads Abu Bakr al-Salih; kept as unclear Abu Bakr | Clarity | Open |

Resume point: alwaad-alhaq episode 18 (branch from origin/main).
### sharh-saheeh-al-bukhare ep22 (14 Nov 2026)

26 points written for episode 22 (ar, en, ur); 23 needs_source marks in each language file for this episode; 3 new `about` edges. Quran verses referenced only through passage links (5-101, 102-8); none typed. Contested: He holds that innovation is confined to worship and not customs or dress, that disputation breeds rancour, that doubtful gains should be given to the poor, and he applies the hadith to modern work and birthdays; all are his views, marked "This is his view". Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep22) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greeting, opening praise and prayer | ep22 00:00:00-00:00:30 | Not substantive | Content rule | Open |
| Garbled and looping stretch on backbiting, a story of a stoning of a sinner and a repeated phrase | ep22 00:03:30-00:06:30 | Too garbled to recover | Clarity, Loop check | Open |
| Garbled hadith of the people of Paradise and Hell, with a story of an oppressive emir and a fish | ep22 00:07:00-00:09:00 | Garbled, text of the hadith and the story cannot be recovered | Clarity, Loop check | Open |
| Garbled reflection on worldly gifts and unrecoverable asides | ep22 00:10:00-00:11:00 | Too garbled to recover | Clarity | Open |
| Garbled passages on the neighbour hadith, daughter and parents dialogues and a looping stretch | ep22 00:16:30-00:20:30 | Loops and garbling | Clarity, Loop check | Open |
| Questions on dog's milk, a cow and other food rulings, partly garbled and looping | ep22 00:21:00-00:24:30 | Garbled and sweeping rulings not recoverable | Clarity, Loop check | Open |
| Garbled stretch on marriage prohibitions and looping repetition | ep22 00:26:00-00:27:00 | Loops and garbling | Clarity, Loop check | Open |
| Story of a prophet's two men sent and fasting asides | ep22 00:29:30-00:30:30 | Garbled | Clarity | Open |
| Selling-words story, a long story of a king, a courtier and a minister with bad breath, and a ruler's treasury | ep22 00:31:30-00:37:30 | Story too garbled to relate faithfully | Clarity | Open |
| Asides on lying and the tongue, and the fourth major sin of the tongue | ep22 00:38:00-00:38:30, 00:49:30 | Garbled wording, listed only as unclear | Clarity | Open |
| Stretch on the sweeping remark that many shaykhs said all cities of a country are in the Fire | ep22 00:44:00 | Sweeping claim about a country, dropped from the macaroni bullet | Voice rule | Open |
| Comments on the education of children, the university, the young man and the workplace | ep22 00:45:30-00:48:30 | Garbled, generalising about youth and society | Clarity, Voice rule | Open |
| Stretch on a developing-country generalisation and on youth opposing parents | ep22 00:50:00-00:51:30 | Sweeping claims about peoples and garbled | Voice rule, Clarity | Open |
| Remarks on the veil, niqab and women's dress being called a regression, and on women in public | ep22 00:51:30-00:52:00, 00:55:00-00:56:00 | Sweeping claims about women and dress, garbled | Voice rule, Clarity | Open |
| Remarks on public workers, the car and the company, with looping repetition | ep22 00:53:00-00:58:00 | Looping and garbled | Clarity, Loop check | Open |
| Garbled looping stretch on the heart and obedience | ep22 01:01:30-01:03:30 | Loops and garbling | Clarity, Loop check | Open |
| Garbled looping repetition on gratitude and the teacher's ink | ep22 01:08:30-01:09:30 | Loops and garbling | Clarity, Loop check | Open |
| Closing advice to students, closing prayer, announcements and contact details | ep22 01:09:30-01:11:30 | Break joins and closing prayer | Content rule | Open |
| Badr attribution for the captives teaching reading and writing, and the Paradise framing in the Companion report | ep22 00:08:00, 00:11:30 | Transcript does not say Badr or Paradise there | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 23 (branch from origin/main).

### sharh-saheeh-al-bukhare ep23 (14 Nov 2026)

25 points written for episode 23 (ar, en, ur); 21 needs_source marks in each language file for this episode; 11 new `about` edges. Quran verses referenced only through passage links (3-92, 3-144); none typed. Contested: He gives his own views on etiquette of eating, accepting wedding invitations and greeting, and reads the dream of drawing water and the sayings on knowledge assemblies in his own way; he attributes sayings to unnamed scholars and unnamed European writers without reference. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep23) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greeting and recap of earlier episode count | ep23 00:00:00-00:00:30 | Greeting and framing | Content rule | Open |
| Closing prayer, thanks and announcement of next Friday | ep23 00:57:00-00:57:30 and 01:19:00 | Break join and closing prayer | Content rule | Open |
| Opening praise and prayers of the second talk | ep23 00:57:30-00:58:00 | Break join and standard opening of a talk | Content rule | Open |
| Khalid ibn al-Walid and Ammar exchange | ep23 00:10:30-00:11:30 | Loops and garbled, outcome not recoverable | Clarity, Loop check | Open |
| Rukana wrestling story | ep23 00:12:00-00:14:30 | Too garbled to state what happened | Clarity, Loop check | Open |
| Palm tree dispute detail and loops | ep23 00:16:00-00:16:30 | Repeated word loop | Clarity, Loop check | Open |
| Remarks on the age of many scholars and preachers, with a count of a population | ep23 00:17:00-00:18:30 | Garbled, loops, and a sweeping claim about a people | Voice rule, Clarity, Loop check | Open |
| Loops and garbled stretches | ep23 00:19:00-00:19:30, 00:20:30-00:21:00, 00:25:00-00:25:30 (second half), 00:28:30-00:29:30, 00:35:30-00:36:00 | Repeated tokens or unrecoverable text | Clarity, Loop check | Open |
| Guest etiquette, host burden, pious people's food, tidiness of guests | ep23 00:27:00-00:29:00, 00:40:30-00:45:30 | Mostly garbled with personal anecdotes, only unambiguous points kept | Clarity | Open |
| Sleep percentages of a lifetime and muscle counts for frowning and smiling | ep23 00:25:30-00:26:00, 01:04:00-01:04:30 | Statistics without source and garbled | Clarity | Open |
| Comparison of the Prophet with an unnamed historical figure | ep23 01:00:30-01:01:00 | Demeaning comparison of a person and garbled | Voice rule | Open |
| Greeting passage loops and chatter about telephone and school greetings | ep23 00:48:00-00:51:00, 00:52:30-00:53:00, 00:53:30-00:54:00 | Loops and garbled | Clarity, Loop check | Open |
| Stretches on Prophet's family life, gentleness with Aisha, circles of prophets, standing right and rear | ep23 01:02:30-01:04:00, 01:04:30-01:09:30 | Garbled, details not recoverable | Clarity, Loop check | Open |
| Uhud and Umm Ammara, Prophet's greeting and Pool references | ep23 01:09:30-01:10:30, 01:13:30-01:14:30 | Speaker of the quoted words unclear and garbled | Clarity | Open |
| Address to students about exams and fasting | ep23 01:17:30-01:19:00 | Personal address, loops | Content rule | Open |
| Smell report and backbiting saying | ep23 01:16:30 | Key words garbled (the ASR gives a different verb), wording and meaning not recoverable | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 24 (branch from origin/main).

### sharh-saheeh-al-bukhare ep24 (14 Nov 2026)

25 points written for episode 24 (ar, en, ur); 21 needs_source marks in each language file for this episode; 5 new `about` edges. Quran verses referenced only through passage links (3-31); none typed. Contested: He attributes to God a purpose for illness and poverty as tests of those He loves, and holds that affliction is a sign of God's love; these are his applications, marked as his view. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep24) | Episode / time | Reason | Gate failed | Override |
| Opening praise loop, greetings and opening prayer | ep24 00:00:00-00:02:30 | Greeting and opening prayer, and a repeated-word loop | Clarity, Loop check | Open |
| Garbled opening on small deeds and bankruptcy | ep24 00:02:30-00:04:00 | Too garbled to recover | Clarity, Loop check | Open |
| Repeated-word loops and garbled stretches | ep24 00:04:30-00:05:00, 00:17:00-00:17:30, 00:18:00-00:20:00, 00:24:00-00:24:30, 00:28:30-00:29:00 | Loops and unrecoverable ASR | Clarity, Loop check | Open |
| Garbled hadith-by-sense and stories about neighbours, a travelling party and its leader | ep24 00:10:30-00:12:00, 00:13:00-00:16:00 | Garbled narration, speakers and endings unclear | Clarity | Open |
| Pharaoh, wealth and paradise story | ep24 00:27:00-00:28:30 | Garbled, cannot recover who says what | Clarity | Open |
| Companions before and after Islam, conquest and dismissal stories | ep24 00:37:00-00:39:00 | Garbled names and events | Clarity, Loop check | Open |
| Remarks on marriage, wives, divorce and what men and women do | ep24 00:40:00-00:43:30 | Sweeping claims about women and men and garbled | Voice rule, Clarity | Open |
| Divorce oaths and a list of countries | ep24 00:53:00-00:55:30 | Garbled and sweeping remarks about peoples | Voice rule, Clarity, Loop check | Open |
| Postpartum bleeding, menstruation and prayer rulings | ep24 00:55:30-00:58:30 | Garbled fiqh rulings about women, not recoverable | Clarity, Voice rule | Open |
| Garbled passages on provision, Qarun and the words I and mine | ep24 01:09:00-01:23:00 | Heavy garbling and loops | Clarity, Loop check | Open |
| Garbled passages after the tongue and favours section | ep24 01:26:30-01:31:00 | Loops and unclear speech | Clarity, Loop check | Open |
| Closing and final prayer | ep24 01:31:00-01:31:30 | Break join and closing | Content rule | Open |

Resume point: sharh-saheeh-al-bukhare episode 25 (branch from origin/main).

### alwaad-alhaq ep18 (14 Nov 2026)

17 points written for episode 18 (ar, en, ur); 18 needs_source marks for this episode in each language file; 8 edges added to the series record (zina, lowering the gaze, marriage, the orphan, Abu Dharr, Ikrima, al-Walid ibn al-Mughira, al-Abbas). Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep18) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Harsh wording about women's fashion and a prayer against a woman | ep18 00:08:30-00:09:00 | Insulting register and a curse, not in the museum's voice | Voice and scope | Open |
| Garbled passages on the imam of Kufa, Umar and a Companion, and the second matter of war beside usury | ep18 00:14:30, 00:21:30-00:24:30 | ASR loop and unreadable text, nothing safe to restate | Source quality | Open |
| Figures on the percentage of bank dealings and the Islamic banks comparison | ep18 00:18:30 | Garbled numbers, not restated | Source quality | Open |

Resume point: alwaad-alhaq episode 19 (branch from origin/main).

### alwaad-alhaq ep19 (14 Nov 2026)

17 points written for episode 19 (ar, en, ur); 21 needs_source marks for this episode in each language file; 15 new about edges on the series record. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep19) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Garbled passage on a scholar at the zamzam well | ep19 00:47:30-00:48:30 | transcription too unclear to cite | accuracy | Open |
| Unclear sayings on the night prayer and a scholar's reply | ep19 00:47:00 | transcription unclear | accuracy | Open |
| Host remark on the West and animals versus Palestine | ep19 00:16:00 | modern conflict commentary by the host, not the sheikh | scope (modern conflict) | Open |
| Skin cancer percentages | ep19 00:39:30 | figures garbled in the transcript, only the claim kept | accuracy | Open |

Resume point: alwaad-alhaq episode 20 (branch from origin/main).

### alwaad-alhaq ep20 (14 Nov 2026)

17 points written for episode 20 (ar, en, ur); 19 needs_source marks for this episode in each language file; edges added to the series record for enjoining good, fear, hope, good character, muraqaba, taqwa, pride, sincere counsel, Rukana, Jibril and Musa. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep20) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Closing prayer wording | ep20 00:54:30 | transcript garbled, only the gist kept | accuracy | Open |
| Passage on the Prophet's welcome of a visitor | ep20 00:29:00 | lost to repetition loop | accuracy | Open |
| Chain of the Prophet's saying on blessing | ep20 00:51:30 | lost to repetition loop | accuracy | Open |
| Lombroso and a book on Quraysh figures | ep20 00:29:30 | names garbled, not attributed | accuracy | Open |

Resume point: alwaad-alhaq episode 21 (branch from origin/main).

### alwaad-alhaq ep21 (14 Nov 2026)

19 points written for episode 21 (ar, en, ur); 16 needs_source marks for this episode in each language file; edges added to the series record for envy, showing off, self-admiration, intention, sincerity, grudge, truthfulness, the sight of God, the divine saying and Malik ibn Anas. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep21) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Statistic from a respectable institution on kindness | ep21 00:46:00 | promised but the passage is lost to a repetition loop | accuracy | Open |
| Opening stretch before the good-ending topic | ep21 00:02:30 | lost to repetition, only the gist kept | accuracy | Open |
| Passage on the two calamities of the envier (second) | ep21 00:35:00 | lost to repetition loop | accuracy | Open |
| Answer to the host's question on turning sins into good deeds | ep21 00:24:30 | deferred by the sheikh in the episode, not answered here | completeness | Open |
| Passage after the Iblis and Isa tale (transcript loops) | ep21 00:12:30 | garbled by repetition, only the gist kept | accuracy | Open |

Resume point: alwaad-alhaq episode 22 (branch from origin/main).
### sharh-saheeh-al-bukhare ep25 (14 Nov 2026)

32 points written for episode 25 (ar, en, ur); 29 needs_source marks in each language file for this episode; 14 new `about` edges. Quran verses referenced only through passage links (3-159, 12-92); none typed. Contested: His accounts of the Crusader killings, Umar's entry into Jerusalem and the course of the conquest are attributed to him and given without sources, and his framing of the jihad question is his own. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep25) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greeting-free opening address to a questioner about Americans, mosques and Western society, with sweeping claims about peoples and societies | ep25 00:00:00-00:06:30 | Sweeping generalisations about peoples and societies, and garbled in both transcripts | Voice rule | Open |
| Closing-style supplication before the main talk | ep25 00:10:00-00:11:00 | Prayer, not content, and a loop of repeated particles in the Qwen pass | Content rule | Open |
| Stretch on the past centuries of Europe and the Muslim world, a dating to about 700, and a casualty figure of 7,000 in one transcript and 70,000 in the other | ep25 00:11:30-00:12:30 | Sweeping claim about modern history and the two transcripts give different figures | Voice rule | Open |
| Takbir loop and stories of Umar's journey, his servant, a man named Salim, and the Jerusalem handover dialogue | ep25 00:14:00-00:21:30 | Loops and garbled dialogue in both transcripts, nothing clearly supported | Clarity, Loop check | Open |
| Church story and covenant clause on Jews | ep25 00:23:00-00:24:30 | Garbled in both transcripts, the clause and church scene cannot be stated faithfully | Clarity | Open |
| Colonial occupations, the British empire and Muslims in Europe and America | ep25 00:25:30-00:28:00 | Sweeping claims about peoples and modern conflict, partly looped | Voice rule, Loop check | Open |
| Anecdote of the most beautiful place, the tree and the lake | ep25 00:29:00-00:32:00 | Garbled in both transcripts and the speaker's meaning is unclear | Clarity | Open |
| Remarks on politics in a modern country and a named teacher | ep25 00:33:00-00:33:30 | Modern political aside, garbled | Content rule, Clarity | Open |
| Garbled and looped stretches of the Hudaybiyya negotiation | ep25 00:35:30-00:37:30 | Loops of repeated words in the Qwen pass and unrecoverable in the Whisper pass | Clarity, Loop check | Open |
| Garbled stretch on the treaty terms and Umm Salama's tent | ep25 00:38:30-00:39:30, 00:41:00-00:42:00 | Both transcripts garbled, Umm Salama's advice not recoverable | Clarity, Loop check | Open |
| Abu Sufyan and the Khuza'a men on the road, the dates and the dialogue | ep25 00:44:00-00:45:00 | Garbled, nothing supported by both passes | Clarity | Open |
| Digression on armour and travelling by car on the pilgrimage | ep25 01:03:30-01:04:30 | Digression, garbled | Clarity | Open |
| Garbled stretch on Umar's words at the tent and on forgiveness | ep25 01:05:00-01:05:30, 01:07:00-01:07:30 | Garbled, speakers unclear | Clarity | Open |
| Garbled stretch on the instruction not to raise swords and the exchange with Khalid | ep25 01:12:30-01:13:00 | Garbled in both transcripts | Clarity, Loop check | Open |
| Greeting, thanks, closing prayer and sign-off | ep25 01:18:00-01:18:30 | Closing prayer and greetings are not part of the teaching | Content rule | Open |
| Names of the Badr Companion who sent the letter, of the man left to lead prayers in Medina and of the commander who relayed the Jerusalem reply | ep25 00:14:30, 00:53:30, 00:59:30 | Each rests on a single garbled word and the two transcripts disagree | Clarity | Open |
| Second ASR pass: Whisper large-v3 (mlx) run on the Mac to resolve garbled words of the Qwen transcript; cites use the shared 30-second grid | ep25 whole | Qwen pass too garbled for a rich first pass | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 26 (branch from origin/main).

### sharh-saheeh-al-bukhare ep26 (14 Nov 2026)

27 points written for episode 26 (ar, en, ur); 19 needs_source marks in each language file for this episode; 11 new `about` edges. Quran verses referenced only through passage links (3-81, 4-163, 42-13); none typed. Contested: His views on the imam's pause and the Fatiha, on white and black lies, on the Hanafi and Shafii positions and on verifying hadiths are his own; the stories (Aisha's closed hand, the Hijra exchange, the mother's grave, Halima, al-Shayma, Zaynab's necklace, the cloak in the grave) are told without a chain. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep26) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greetings, opening and closing prayers, break joins | ep26 00:00:00-00:04:00, 01:19:30 | Not substantive | Content rule | Open |
| Loops (repeated words) | ep26 00:02:30-00:03:00, 00:09:30, 00:14:30, 00:34:30, 00:50:30, 01:01:00, 01:07:00 | Loops | Clarity, Loop check | Open |
| Long stretches of garbled ASR, mixed dialect, no recoverable argument | ep26 00:11:30-01:01:00 | Too garbled to recover | Clarity, Loop check | Open |
| Stretches on rulings, prayer, peoples and politics, unclear | ep26 00:40:30-00:47:30, 01:16:30-01:19:00 | Garbled, sweeping or unclear claims | Voice rule, Clarity | Open |
| A stretch dropped under the content-safety block | ep26 00:02:00-00:03:30 | Dropped under the content-safety block | Content rule | Open |
| Second ASR pass: Whisper large-v3 (mlx) run on the Mac to resolve garbled words of the Qwen transcript; cites use the shared 30-second grid | ep26 whole | Qwen pass too garbled for a rich first pass | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 27 (branch from origin/main).

### alwaad-alhaq ep22 (14 Nov 2026)

20 points written for episode 22 (ar, en, ur); 19 needs_source marks for this episode in each language file; edges added to the series record for long hope, injustice, being led on, self-deception, wine, the Night of Power, Ata ibn Abi Rabah, Qarun, Haman and Ubayy ibn Khalaf. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep22) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening and closing prayers, thanks and sign-off | ep22 00:54:30-00:55:30 | Not teaching; closing prayer includes an imprecation against unnamed enemies | Content rule | Open |
| Parable and prayer fragment on a prayer invalidated in bowing | ep22 00:04:00 | Garbled | Clarity | Open |
| Examples of rich countries discarding food and fish to protect prices, and a Google percentage | ep22 00:15:30 | Garbled and looped, claims unsupported | Clarity, Loop check | Open |
| Remarks on outside parties controlling the media and on Zionists | ep22 00:29:30 | Garbled sweeping claim on a modern conflict | Voice rule, Clarity | Open |
| Name of the follower led to pray by Ata, the Companion with the camel (Usama?), the Companion teaching Islam, the man in the trench | ep22 00:08:30, 00:09:30, 00:41:30, 00:53:30 | Names rest on garbled words | Clarity | Open |
| Ghazali and the Shafi'i view on a prayer lengthened for show, Ibn Abbas on the dog and the thieves | ep22 00:37:00-00:38:00 | Garbled | Clarity | Open |
| Story of the promise-breaker attributed to a named scholar | ep22 00:33:30 | Name garbled | Clarity | Open |
| Loops and repeated blessings | ep22 00:08:00, 00:14:00, 00:29:00, 00:34:00, 00:50:00, 00:54:00 | Loops | Loop check | Open |

Resume point: alwaad-alhaq episode 23 (branch from origin/main).
### sharh-saheeh-al-bukhare ep27 (14 Nov 2026)

28 points written for episode 27 (ar, en, ur); 22 needs_source marks in each language file for this episode; 8 new `about` edges. Quran verses referenced only through passage links (3-37, 25-63); none typed. Contested: His readings of the Prophet's request for a writing and its dispute, his remark that Abu Bakr's appointment of Umar shows real democracy, his comment on Khalid's removal, and his application of the hadith on raised graves are his own and are contested; the reports on Khalid, al-Qa'qa' and Ali and Fatima are given without chains. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep27) | Episode / time | Reason | Gate failed | Override |
| Greeting, opening supplication and looped lines | ep27 00:00:00-00:01:30 | Opening greeting and prayer, with a long Qwen loop of one word | Clarity, Loop check | Open |
| Takfir among Muslims in disputes, and a remark about a scholar's method | ep27 00:06:00-00:07:00 | Sweeping claim about groups of Muslims and garbled in both passes | Content rule | Open |
| Criticism of modern writers and legislators | ep27 00:15:00-00:15:30 | Sweeping claim about modern writers, garbled | Voice rule | Open |
| Garbled stretches, loops and repeated words | ep27 00:41:30-00:43:30 | Loops in the Qwen pass, Whisper too garbled to carry a point | Clarity, Loop check | Open |
| Money talk, a sale at 160 dinars and a story about Ali and Fatima's household | ep27 00:46:00-00:51:30 | Too garbled in both passes to say what is reported | Clarity | Open |
| Remark on the Imam al-Sadiq and practices at graves | ep27 00:52:30-00:53:00 | Sweeping claim about a sect's practice, partly garbled | Content rule | Open |
| Sufyan al-Thawri dream and account of deeds on the Day | ep27 00:56:00-00:59:00 | Garbled in both passes | Clarity | Open |
| Story of people seeking others' faults and a rooftop | ep27 01:01:00-01:04:30 | Garbled in both passes | Clarity | Open |
| Report on the women of Paradise | ep27 01:05:30-01:06:30 | Quoted by sense and too garbled to restate | Clarity | Open |
| Hadith of drawing near by voluntary acts | ep27 01:10:30-01:12:30 | Only the second pass has it and only partly | Clarity | Open |
| Closing supplication and a garbled story about Khalid's death | ep27 01:12:30-01:14:00 | Closing prayer and garbled report | Clarity | Open |
| Sign-off and closing greetings | ep27 01:19:30-01:20:00 | Closing greetings and sign-off | Clarity | Open |
| Second ASR pass: Whisper large-v3 (mlx) run on the Mac to resolve garbled words of the Qwen transcript; cites use the shared 30-second grid | ep27 whole | Qwen pass too garbled for a rich first pass | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 28 (branch from origin/main).

### sharh-saheeh-al-bukhare ep28 (14 Nov 2026)

28 points written for episode 28 (ar, en, ur); 23 needs_source marks in each language file for this episode; 5 new `about` edges. Quran verses referenced only through passage links (71-10, 18-1, 17-1, 28-83, 33-56, 5-3, 3-144); none typed. Contested: He holds that the principle of what leads to the forbidden applies to all who share in wine, that non-Muslims in Muslim lands should respect Islam, that repeated forgiveness-seeking without leaving the sin is not repentance; these are his views. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep28) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, praise and opening supplication, with looped "qooq" and "ya rabbana" stretches | ep28 00:00:00-00:05:30 | Greetings, supplication and repeated-phrase loops; a stretch of the opening supplication touching conflict dropped | Clarity, Loop check | Open |
| Stretch on tourism, mosque visitors, Vatican and women's liberation remarks, sweeping claims about peoples and women | ep28 00:13:00-00:17:00 | Sweeping claims about women and peoples, garbled | Content rule, Clarity | Open |
| Loops ("al-", "ba", "fu", "sah", "ayh", "min") and garbled stretches | ep28 00:09:30, 00:13:00, 00:29:00, 00:31:30, 00:34:00, 00:37:30, 00:40:00, 00:45:00, 00:48:30, 00:53:00 | Repeated-phrase loops and unrecoverable ASR | Clarity, Loop check | Open |
| Remarks on who is the better servant and the kinship analogy about servanthood | ep28 00:26:30-00:28:00 | Too garbled to recover | Clarity | Open |
| Description of the Prophet's character and Bilal anecdote, Companions' devotion | ep28 00:33:00-00:36:00, 00:38:30-00:39:30 | Too garbled and unreferenced to state faithfully | Clarity | Open |
| Claim about the Prophet's wives gathering and the house where he was nursed (house named inconsistently) | ep28 00:43:00-00:43:30 | Garbled, names unclear | Clarity | Open |
| Exact date of the Prophet's death | ep28 00:53:30-00:54:00 | Date garbled in the transcript | Clarity | Open |
| Closing supplications for the community | ep28 01:09:00-01:10:00 | Closing prayer | Voice rule | Open |
| Questions on a beard and on charity work, and the speaker's own listing of qualifications and affiliations | ep28 01:11:00-01:14:30 | Garbled, personal promotion, not substantive | Clarity | Open |
| Claim that servanthood is a title of honour and the highest human rank | ep28 00:25:30-00:28:00 | Not clearly stated in the transcript | Clarity | Open |
| Claim that people entered the religion in crowds after sixty-three years | ep28 00:32:00 | Garbled, unclear what the number refers to | Clarity | Open |
| Remark that changing the religion by adding or removing makes it unreliable | ep28 00:38:30 | Garbled | Clarity | Open |
| Detail that Uhud shook, and that the Baqi visit was at night or involved asking forgiveness | ep28 00:46:00-00:47:30 | Not in the transcript | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 29 (branch from origin/main).

### sharh-saheeh-al-bukhare ep29 (14 Nov 2026)

28 points written for episode 29 (ar, en, ur); 24 needs_source marks in each language file for this episode; 5 new `about` edges. Quran verses referenced only through passage links (5-67); none typed. Contested: He holds that we live in a time of trials, relates Hind ibn Abi Hala's description of the Prophet as his preferred one (with his own account of Hind's kinship and age), and gives the rule that what leads to the forbidden is forbidden; all marked as his view. The recording says "his death" for the first part of the lesson but what follows is the Prophet's description, so the bullet says "the Prophet's person"; the word for the first kind of miracle is garbled and read as inanimate things from context. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep29) | Episode / time | Reason | Gate failed | Override |
| Opening greeting, supplication and closing of the opening prayer | ep29 00:00:00-00:01:00 | Greeting and prayer, not teaching | Content rule | Open |
| Repeated loop on a single word | ep29 00:05:30-00:05:30 | Looped filler, no content | Clarity, Loop check | Open |
| Loop and garbled stretch after the Prophet's character | ep29 00:10:30-00:10:30 | Looped filler | Clarity, Loop check | Open |
| Digression on names (Hind, names with abd, naming children) | ep29 00:12:30-00:16:30 | Garbled, partly looped, cannot be recovered faithfully | Clarity, Loop check | Open |
| Garbled stretch on a Bedouin visitor, the face of liars, and the Qur'an wording of a Quraysh leader | ep29 00:19:30-00:21:30 | Too garbled; also involves Qur'an wording | Clarity, Loop check | Open |
| Loop on one syllable and on the word "the face" | ep29 00:20:00-00:20:00, 00:25:30-00:25:30, 00:27:30-00:27:30 | Looped filler | Clarity, Loop check | Open |
| Poetry and aside on faces of women | ep29 00:26:00-00:26:30, 00:31:00-00:31:30 | Aside with demeaning generalisation and unclear verse | Voice rule, Clarity | Open |
| Garbled report of Umar and a visitor, and of the Dajjal sign and a man's questions | ep29 00:34:30-00:36:00 | Too garbled to recover | Clarity, Loop check | Open |
| Aside on contemporary peoples and skin colours | ep29 00:39:00-00:40:00 | Sweeping claim about peoples, with garbled wording | Voice rule, Clarity | Open |
| Vision of God, Bedouin questions and a modern aside | ep29 00:41:30-00:44:00 | Too garbled to recover; includes looped filler | Clarity, Loop check | Open |
| Dialect digression and Yemeni visitors | ep29 00:46:00-00:48:30 | Garbled | Clarity | Open |
| Garbled stretch on the arms, palms and chest | ep29 00:52:00-00:55:00 | Too garbled to recover | Clarity, Loop check | Open |
| Aside on depression and suicide in other lands | ep29 00:59:00-01:01:30 | Sweeping claim about peoples and modern society, garbled | Voice rule, Clarity | Open |
| Garbled and looped stretches on tears, a battle story and Companions | ep29 01:02:00-01:04:30 | Too garbled and looped to recover | Clarity, Loop check | Open |
| Garbled stretch on greeting of non-Muslims | ep29 01:05:30-01:06:00 | Too garbled; only the first-to-greet point kept | Clarity | Open |
| Garbled stretch on Ali, a camel and a prayer for safety | ep29 01:14:00-01:15:00 | Too garbled to recover | Clarity | Open |
| Looped filler and garbled questions on names Muhammad and Awf | ep29 01:15:30-01:15:30, 01:17:30-01:17:30 | Looped or too garbled to recover; the transcript ends on a closing aside | Clarity, Loop check | Open |
| Detail dropped from three description bullets (speech pace and amount, chest, downhill gait) | ep29 00:49:00-00:49:30, 00:51:00, 00:58:30 | Not clearly supported by the garbled transcript | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 30 (branch from origin/main).

### alwaad-alhaq ep23 (14 Nov 2026)

22 points written for episode 23 (ar, en, ur); 17 needs_source marks for this episode in each language file; about edges added to israfil, the Day of Spreading, the land of gathering, the Day of Gathering, the states of the Day of Rising, the blasts of the Trumpet, the signs of the Hour and intercession. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep23) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| garbled transcript passages (the exchange with Abraham on fearing the Rising, the Safiyya anecdote, the closing poem, the sura named for steadfastness, looping segments 00:41:30-00:42:30 and 00:47:30) | ep23 00:20:00-00:59:30 | transcript too garbled to assert | accuracy | Open |
| the sheikh's view that the fetus is a person from the first day | ep23 00:19:30 | recorded as his view only, contested among scholars | sensitivity | Open |

Resume point: alwaad-alhaq episode 24 (branch from origin/main).
### sharh-saheeh-al-bukhare ep30 (14 Nov 2026)

16 points written for episode 30 (ar, en, ur); 12 needs_source marks in each language file for this episode; 2 new `about` edges. Quran verses referenced only through passage links (28-76); none typed. Contested: His division of people into three kinds, his readings of poverty, fear and showing off, and his explanation of exultation are his own views; the hadiths, divine saying, supplication and reports he relates by sense carry no chain. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep30) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening praise, opening prayer and loops | ep30 00:00:00-00:03:00 | Greetings and prayer; a stretch dropped under the content-safety block | Content rule / Clarity, Loop check | Open |
| Remarks on the first century, scholars' deaths and Palestine, with statistics | ep30 00:06:00-00:11:00 | Sweeping remarks on modern conflict, garbled figures | Voice rule / Clarity | Open |
| Stories of a Companion woman and a smile, loops | ep30 00:16:00-00:23:00 | Too garbled to recover | Clarity, Loop check | Open |
| Saying about seeing a man fly and walk on water, definition of the friends of God | ep30 00:24:30-00:25:30 | Too garbled to recover | Clarity | Open |
| Medical analogy for poverty and illness, loops | ep30 00:26:30-00:29:00 | Garbled | Clarity, Loop check | Open |
| Stories of angels, repeated words, trade analogies | ep30 00:31:00-00:37:30 | Garbled, loops | Clarity, Loop check | Open |
| Story of a woman taunted over her origin, marriage asides | ep30 00:38:00-00:43:30 | Garbled, names unreliable | Clarity, Loop check | Open |
| Lottery, compensation figures, stories of a poor man at a door and a wife's remarriage | ep30 00:44:00-00:53:30 | Garbled, unreliable stories and numbers | Clarity, Loop check | Open |
| Advice on wives and children, loops | ep30 00:55:30-00:59:00 | Garbled, loops | Clarity, Loop check | Open |
| Stories of a lute-player and the dead, the knowledge trial and Abu Hanifa questions | ep30 01:01:00-01:03:00 and 01:04:00-01:09:00 | Garbled, loops, unreliable names | Clarity, Loop check | Open |
| Break join, closing remarks and prayer | ep30 01:10:00-01:10:30 | Greetings and closing prayer | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 31 (branch from origin/main).

### sharh-saheeh-al-bukhare ep31 (14 Nov 2026)

26 points written for episode 31 (ar, en, ur); 21 needs_source marks in each language file for this episode; 3 new `about` edges. No Quran verses linked; none typed. Contested: his advice that all scholars and others devote all their time to the call, his reading of the letters of advice to rulers as lessons for the present, his application of the gift hadith to officials, and his account of temptation at death are his own views; the letters and stories are given without chain or collection. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep31) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greeting and praise | ep31 00:00:00-00:00:30 | Greeting formula, no teaching content | Content rule | Open |
| Closing and opening prayers for those in distress | ep31 00:03:30-00:05:30 | Prayer, not teaching content | Content rule | Open |
| Closing prayer and farewell | ep31 01:11:00-01:11:30 | Closing prayer and farewell | Content rule | Open |
| Imam al-Haramayn remark about the commentary | ep31 00:01:30-00:02:30 | Both passes garbled, sense not recoverable | Clarity, Loop check | Open |
| Looping stretch before the lion story | ep31 00:09:00-00:09:30 | Repeated filler words in the first pass, sense not recoverable | Clarity, Loop check | Open |
| Direct address to the audience about merit and gatherings | ep31 00:12:30-00:13:30 | Garbled in both passes, sense not recoverable | Clarity, Loop check | Open |
| Remarks on carpets, presents and presumed innocence in the Umar letter section | ep31 00:22:30-00:24:00 | Garbled in both passes, sense not recoverable | Clarity, Loop check | Open |
| Story of Umar ibn Abd al-Aziz and heated water, and the remark that he kept the letter before him | ep31 00:31:00-00:32:30 and 00:38:30 | Heavily garbled, a name or detail would rest on a single word | Clarity, Loop check | Open |
| Middle section of al-Hasan's letter (flock, orphans, the heart image) | ep31 00:33:30-00:35:30 | Looping and garbled in the first pass, partly in the second | Clarity, Loop check | Open |
| Sufyan's reply after Harun wept | ep31 00:44:30-00:45:00 | Garbled in both passes, sense not recoverable | Clarity, Loop check | Open |
| Remarks on those who reject a ruling and on declaring people unbelievers | ep31 00:46:00-00:47:30 | Sweeping judgement on groups and a ruling on unbelief, not for the museum's voice | Voice rule | Open |
| Middle category of the livelihood and return saying | ep31 00:48:00-00:48:30 | Label garbled differently in each pass | Clarity, Loop check | Open |
| Story of a man watching animals and the saying on the enemy providing for his enemy | ep31 00:50:30-00:51:00 | Story garbled in both passes, sense not recoverable | Clarity, Loop check | Open |
| Colloquial anecdotes about prices, marriage and everyday dealings | ep31 00:54:30-00:58:00 | Garbled, looping and conversational filler with no clear teaching point | Clarity, Loop check | Open |
| Sweeping claims about Egyptian society | ep31 00:57:30-00:58:30 | Generalisation about a people, not for the museum's voice | Voice rule | Open |
| Remarks on teachers, private lessons and society | ep31 01:01:00-01:03:00 | Sweeping claims about a profession and society, garbled | Voice rule | Open |
| Remarks on Eid, parents, children, drugs and smoking | ep31 01:03:30-01:06:30 | Garbled and conversational, sweeping generalisations | Voice rule | Open |
| Account of an imam's last moments | ep31 01:08:30-01:10:00 | Garbled in both passes, a person's name would rest on a single word | Clarity, Loop check | Open |
| Second ASR pass: Whisper large-v3 (mlx) run on the Mac to resolve garbled words of the Qwen transcript; cites use the shared 30-second grid | ep31 whole | Qwen pass too garbled for a rich first pass | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 32 (branch from origin/main).

### sharh-saheeh-al-bukhare ep32 (14 Nov 2026)

16 points written for episode 32 (ar, en, ur); 10 needs_source marks in each language file for this episode; 0 new `about` edges. Quran verses referenced only through passage links (5-115, 18-71, 18-74, 18-77); none typed. Contested: He holds that there is no good innovation (while treating Umar's gathering for the Ramadan night prayer as rooted in the Prophet's practice), and that people may not accuse others of hypocrisy; the placement of the hypocrites, Pharaoh's people and the people of the table in the lowest depth of the fire and the details of the Path's light are reports he gives without a chain. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep32) | Episode / time | Reason | Gate failed | Override |
| Greeting, opening prayer and closing prayer with thanks | ep32 00:00:00-00:00:30; 00:05:30-00:07:30; 01:09:00 | Not lesson content | Content rule | Open |
| Supplication including political references and a passage on groups of Muslims and enemies of Islam | ep32 00:05:30-00:07:30; 00:08:30-00:09:00 | Sweeping claims about modern conflict and groups; stretch dropped under the content-safety block | Content rule / Voice rule | Open |
| Remarks on the number of Muslims who pray, the pyramids and workers, and Egyptian geography | ep32 00:12:00-00:13:30; 00:22:00-00:22:30 | Unsourced statistics and sweeping claims about peoples | Content rule / Voice rule | Open |
| Medical and food-hygiene digression (fermentation, microbes, rulings) | ep32 00:40:30-00:43:30 | Unclear and rulings in his voice, partly garbled | Voice rule / Clarity | Open |
| Companion anecdotes on a roadside, hijab and women, Ibn Abbas sayings, Hasan resembling the Prophet | ep32 00:31:30-00:33:30; 00:37:30-00:39:00; 00:43:30-00:48:30 | Garbled, sweeping claims about women | Voice rule / Clarity | Open |
| Digression on the Children of Israel, scouts, Yusha and the sun, the night journey, and a story of refugees | ep32 00:49:30-00:56:30; 01:02:00-01:03:00 | Heavily garbled, unsourced | Clarity | Open |
| Loops and garbled stretches | ep32 00:11:30-00:11:30; 00:16:30-00:17:30; 00:18:30; 00:20:30-00:21:00; 00:25:00-00:25:30; 00:28:00; 00:33:00-00:33:30; 00:38:30-00:39:00; 00:43:00; 00:46:00; 00:49:00; 00:55:30; 00:59:30-01:00:30; 01:06:00; 01:07:30-01:08:00 | Repeated token loops or unrecoverable ASR | Clarity, Loop check | Open |
| Dropped in review (ep32): mountain and date-palm light on the Path, pushing latecomers in the rows, and the claim that Umar's gathering is rooted in the Prophet's practice | ep32 00:26:00-00:27:30; 00:03:00-00:04:00; 00:36:00-00:36:30 | Not supported by the transcript | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 33 (branch from origin/main).

### alwaad-alhaq ep24 (14 Nov 2026)

21 points written for episode 24 (ar, en, ur); 15 needs_source marks for this episode in each language file; concept and person links added for the reckoning, the scale, intercession, the praised station, patience, grievances, the basin, Adam, Nuh, Ibrahim, Isa, Talha ibn Ubaydullah and al-Hasan al-Basri. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep24) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening recitation, greetings and the studio remark about the pages written | ep24 00:00:00-00:02:30; 00:46:00 | Not lesson content | Content rule | Open |
| Abu Bakr named as first among those entering without reckoning, and a list of beasts including dinosaurs | ep24 00:19:30; 00:05:30 | Garbled and not supported by the transcript | Clarity | Open |
| Years-per-scroll figure and remarks on the number of those denying a Lord | ep24 00:46:30; 00:45:00 | Garbled transcript, unsourced statistics | Clarity / Content rule | Open |
| Loops and garbled stretches | ep24 00:03:00; 00:11:00; 00:30:30-00:31:00; 00:39:00; 00:41:00-00:41:30; 00:45:30; 00:49:00-00:51:00; 00:51:00 | Repeated token loops or unrecoverable ASR | Clarity, Loop check | Open |

Resume point: alwaad-alhaq episode 25 (branch from origin/main).
### sharh-saheeh-al-bukhare ep33 (14 Nov 2026)

27 points written for episode 33 (ar, en, ur); 20 needs_source marks in each language file for this episode; 6 new `about` edges. Quran verses referenced only through passage links (35-10, 17-78, 39-53, 14-37, 12-24, 5-24, 8-12); none typed. Contested: He holds that jihad is the cornerstone of Islam and that names two situations in which jihad applies, gives fixed rules on which voluntary fasts to keep, and states the figure of twenty-eight campaigns in seven years and several scholars' duties without references; all are attributed to him as his own view. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep33) | Episode / time | Reason | Gate failed | Override |
| Greetings, praise, blessings on the Prophet and the opening prayer; closing greeting | ep33 00:00:00-00:01:30 and 01:19:00-01:19:30 | Not teaching content | Content rule | Open |
| Anecdote on following fashion in religion and a book cited from an unnamed source | ep33 00:06:30-00:07:00 | Garbled in both passes, speaker and source unclear | Clarity | Open |
| Remarks on praying late and on timings | ep33 00:11:30-00:12:30 | Garbled in both passes, the point cannot be recovered | Clarity | Open |
| Sweeping claims about a state and the enemies of Muslims, and plans against Muslims | ep33 00:21:00-00:23:00 | Sweeping claims about peoples and modern conflict | Voice rule | Open |
| Rhetoric on weapons and a section on the Western powers | ep33 00:24:00-00:25:30 | Garbled and sweeping claims about peoples and modern conflict | Voice rule | Open |
| Reading of a biblical account of Noah and his sons, and claims about blessings and curses on peoples and about wealth of nations | ep33 00:25:30-00:29:30 | Sweeping claims about peoples; remainder garbled | Voice rule | Open |
| Complaint about groups and factions, and a stretch on university groups | ep33 00:29:30-00:30:00 | Only one pass clear, sweeping on groups | Clarity | Open |
| A stretch dropped under the content-safety block | ep33 00:30:30-00:32:30 | A stretch dropped under the content-safety block | Content rule | Open |
| Intelligence gathering on opponents, religious broadcasting figures and spending, ship broadcasts, claims about American leaders and Christian and Jewish peoples, and politics around Palestine | ep33 00:32:00-00:38:00 | Sweeping claims about peoples and modern conflict; statistics without source | Voice rule | Open |
| Political comments on a Companion, on communists and on Christian and Jewish politics in Europe and America | ep33 00:39:30-00:42:30 | Sweeping claims about peoples and sects; partly garbled | Voice rule | Open |
| Partition of the Levant, political predictions and a claim about the curse on a people | ep33 00:42:30-00:44:30 | Sweeping claims about peoples and modern conflict | Voice rule | Open |
| Garbled stretch on lectures, youth, engineers and lawyers, with repeated loops in the first pass | ep33 00:49:30-00:52:30 | Loop and garbled | Clarity, Loop check | Open |
| Loop of repeated syllables in the first pass | ep33 00:30:15-00:30:30 | Loop in the first pass, only one clear pass | Loop check | Open |
| Name of the Abu Jahl nickname explanation and the names of the speakers in the Badr lead-up | ep33 00:54:00-00:55:30 | Names rest on a single garbled word across the two passes | Clarity | Open |
| Name of Abu Jahl's son and of his companion who travelled with him to Medina | ep33 00:55:30-00:57:30 and 00:59:00-00:59:30 | Names rest on a single garbled word | Clarity | Open |
| Night journey of al-Walid and digression on daughters at university | ep33 01:03:00-01:07:00 | Garbled in both passes; digression on women | Clarity, Voice rule | Open |
| Name of the Companion who asked about the halting place at Badr, and the number of the Prophet's party | ep33 01:10:00-01:11:30 | Names and numbers rest on a single garbled word | Clarity | Open |
| Questions on husbands and wives, women's attendance at the mosque and a closing remark | ep33 01:17:00-01:19:00 | Garbled in both passes, sweeping on women | Clarity, Voice rule | Open |
| Second ASR pass: Whisper large-v3 (mlx) run on the Mac to resolve garbled words of the Qwen transcript; cites use the shared 30-second grid | ep33 whole | Qwen pass too garbled for a rich first pass | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 34 (branch from origin/main).

### sharh-saheeh-al-bukhare ep34 (14 Nov 2026)

26 points written for episode 34 (ar, en, ur); 19 needs_source marks in each language file for this episode; 9 new `about` edges. Quran verses referenced only through passage links (24-55, 3-165, 47-6, 56-26, 36-58, 13-23, 20-59, 20-65, 20-68, 20-69, 20-71, 22-40); none typed. Contested: Attributed to him and contested: that Khalid ibn al-Walid killed Malik ibn Nuwayra and married his widow is a claim he rejects and blames on named historians (Jurji Zaydan, Salama Musa); his remark that giving up worldly songs is compensated in Paradise; his contrast of the Banu Qaynuqa episode with present reliance on international bodies; and his reading of a Qur'anic word as also meaning a scent. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep34) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening supplication, greeting and repeated istighfar loop | ep34 00:00:00-00:03:00 | Greeting and opening prayer; loop and garbled text | Clarity, Loop check | Open |
| Garbled stretch before the first point on takfir and time | ep34 00:04:30-00:05:00 | Too garbled to recover | Clarity | Open |
| Sweeping claims that enemies of Islam through history share one aim, and the garbled story of the grave of the Prophet's mother | ep34 00:06:30-00:07:30, 00:09:30-00:10:30 | Sweeping claim about enemies and peoples; story garbled | Voice rule, Clarity | Open |
| Comparison of the Uhud story with present-day massacres, supplication for Muslims in conflicts, and a quoted remark attributed to a First World War general | ep34 00:12:30-00:14:30 | Sweeping claims about a modern conflict | Voice rule | Open |
| Repeated word loops and garbled lines | ep34 00:14:30-00:15:30, 00:19:00-00:20:30, 00:25:00-00:26:00, 00:29:00-00:29:30 | Loop, no recoverable content | Clarity, Loop check | Open |
| Garbled lines on servants of Paradise, wives, worldly talk and the Hereafter | ep34 00:22:00-00:22:30, 00:23:30-00:28:00, 00:29:30-00:30:30 | Too garbled to recover | Clarity | Open |
| Loop lines inside the Paradise section | ep34 00:23:00-00:23:30, 00:31:30-00:32:00, 00:32:30-00:33:00, 00:33:30-00:34:00 | Loop, no recoverable content | Clarity, Loop check | Open |
| Story of a woman whom Umar defended and advice on separate study circles for women | ep34 00:36:30-00:38:30 | Garbled, and about women in general | Voice rule, Clarity | Open |
| Loops and garbled lines around the hadith and the man's story | ep34 00:38:30-00:39:30, 00:41:30-00:43:30 | Loop and garbled | Clarity, Loop check | Open |
| Anecdotes about foreign women, a joke about a tiger, a report about a woman sitting beside the Prophet, and a ruling about shaking hands | ep34 00:49:00-00:53:30 | Garbled anecdotes and sweeping claims about women | Voice rule, Clarity | Open |
| Garbled passage on a Persian commander and a pardon | ep34 00:54:30-00:56:00 | Too garbled to recover | Clarity | Open |
| Garbled lines before and after the Quraysh man's story | ep34 00:59:00-01:00:30, 01:01:30-01:03:00 | Garbled and loop | Clarity, Loop check | Open |
| Loops around the Moses story | ep34 01:05:00-01:05:30, 01:06:00-01:07:00, 01:07:30-01:08:30 | Loop, garbled | Clarity, Loop check | Open |
| Garbled lines in the Quraysh offer section | ep34 01:10:00-01:11:30 | Loop, garbled | Clarity, Loop check | Open |
| Poet and caliph story with a marble column, unclear names and loops | ep34 01:12:30-01:19:00 | Garbled and looping | Clarity, Loop check | Open |
| Loop lines and fragments before the closing | ep34 01:19:00-01:19:30, 01:20:00-01:20:30 | Loop, garbled | Clarity, Loop check | Open |
| Closing greeting and farewell | ep34 01:21:30-01:22:00 | Greeting and closing prayer | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 35 (branch from origin/main).

### alwaad-alhaq ep25 (14 Nov 2026)

25 points written for episode 25 (ar, en, ur); 11 needs_source marks for this episode in each language file; links to the straight path, tawhid, enjoining good, al-Husayn ibn Ali, Sulayman, Ayyub, Isa, Aisha, Abu Hazim al-A'raj and al-Hasan al-Basri. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep25) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Zakat rates quoted in the garbled passage (percentages for money, rents, crops, mineral finds and shares) | ep25 00:19:30-00:20:00 | The transcript figures are garbled and contradict the known rates, so no number is stated | statistics unverifiable | Open |
| Further categories of those who enter Paradise without a reckoning (a drink and a servant exchange) | ep25 00:28:00-00:29:00 | Passage is too garbled to restate faithfully | transcript illegible | Open |
| Remarks on people walking in the streets and on young men seeing images | ep25 00:43:00 | Sermon-voice remarks about groups of people; not restated | voice and scope | Open |
| Speed list of crossing the Sirat in part (sheep or lamb comparison) | ep25 00:36:30-00:37:00 | Transcript lost in loops; only the legible comparisons kept | transcript illegible | Open |

Resume point: alwaad-alhaq episode 26 (branch from origin/main).
### sharh-saheeh-al-bukhare ep35 (14 Nov 2026)

22 points written for episode 35 (ar, en, ur); 18 needs_source marks in each language file for this episode; 11 new `about` edges. Quran verses referenced only through passage links (17-85, 9-3, 6-93, 89-27, 39-42, 7-172); none typed. Contested: His view that nothing may be added to the religion and that the Companions saw while awake what others see in sleep, his account of the world of spirits and the stations of the soul, and his advice that the wronged should not pray against the wrongdoer are his own views. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep35) | Episode / time | Reason | Gate failed | Override |
| Greetings, opening prayer and supplication | ep35 00:00:00-00:03:00 | Not substantive | Content rule | Open |
| Closing and farewell | ep35 01:20:30-01:20:30 | Not substantive | Content rule | Open |
| Loops and garbled stretch (hadith count, tangents) | ep35 00:05:30-00:08:30 | Repeated filler and garbled words; sweeping remark on a modern power | Clarity, Loop check | Open |
| Loop and garbled stretch on the army and spoils | ep35 00:09:00-00:10:30 | Garbled and looping | Clarity, Loop check | Open |
| Report of a man's mistreatment of the Prophet in prayer and sweeping remarks on enemies and modern extremism | ep35 00:12:00-00:14:30 | Name uncertain, garbled; sweeping claims on modern conflict | Voice rule, Clarity | Open |
| Abu Hanifa and Abu Yusuf story, diacritics and Egypt example | ep35 00:26:30-00:30:30 | Garbled, cannot be recovered | Clarity | Open |
| Loop | ep35 00:30:00-00:31:00 | Looping filler | Loop check | Open |
| Tangents on Jews and covenants, modern media and appearance | ep35 00:32:00-00:36:00 | Sweeping claims about peoples and modern society; garbled | Voice rule, Clarity | Open |
| Comparison of other scriptures with Islam | ep35 00:37:30-00:39:00 | Sweeping claim about other faiths | Voice rule | Open |
| Companions and dreams stretch with loops | ep35 00:47:30-00:48:30 | Looping filler | Loop check | Open |
| Stories of eating, Abu Bakr and dream interpretation | ep35 00:50:30-00:55:00 | Garbled and looping | Clarity, Loop check | Open |
| Ibn Sirin stories, olive oil and other dream interpretation reports | ep35 00:56:30-01:00:30 | Garbled and looping | Clarity, Loop check | Open |
| Bedouin hospitality story and advice stretch | ep35 01:00:30-01:06:30 | Garbled and looping | Clarity, Loop check | Open |
| Istikhara remarks | ep35 01:06:30-01:07:30 | Too garbled to state what he says | Clarity | Open |
| Scholar and host story, ranks of scholars | ep35 01:08:30-01:13:00 | Garbled and looping | Clarity, Loop check | Open |
| Moses and the seed story, mercy and Hell | ep35 01:17:30-01:19:00 | Garbled, cannot be recovered | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 36 (branch from origin/main).

### sharh-saheeh-al-bukhare ep36 (14 Nov 2026)

26 points written for episode 36 (ar, en, ur); 13 needs_source marks in each language file for this episode; 3 new `about` edges. Quran verses referenced only through passage links (12-53, 75-2, 89-27, 38-75, 38-76, 7-20, 3-134); none typed. Contested: He holds that the self has three kinds with five, three and seven signs, that three sins are the root of the rest, that patience against disobedience is easier than patience in obedience, and he gives rulings and counsel on dealings and manners; these are his views. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep36) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greetings, opening supplication and a stretch of prayers touching a modern conflict | ep36 00:00:00-00:04:00 | Opening words and prayer; a stretch dropped under the content-safety block | Content rule | Open |
| Closing supplication, announcements about Ramadan and farewell | ep36 01:09:30-01:10:00 | Closing prayer and announcements | Content rule | Open |
| Report of a man whose wife bore a child of a different colour and the story of Usama, Aisha and the hypocrites | ep36 00:07:30-00:10:30 | Garbled in both passes, names and report not recoverable | Clarity | Open |
| Three classes of the people of Paradise and remarks on slander | ep36 00:10:30-00:11:00 | Garbled, items not recoverable | Clarity | Open |
| Anecdotes of a man giving away what he had, a work paper and ten houses | ep36 00:12:00-00:13:00, 00:26:30-00:29:30 | Garbled in both passes, reports unclear | Clarity | Open |
| The third root sin, its story and a report of Ali and Fatima | ep36 00:16:00-00:19:00, 00:24:30-00:25:00 | Garbled; the third item and the names rest on single garbled words | Clarity | Open |
| Remarks on people ignoring commands, on the Prophet's guidance and a report of a scholar being served food | ep36 00:19:30-00:21:00, 00:33:30-00:37:00 | Garbled in both passes | Clarity | Open |
| Reading of the verse on the good for the good, Pharaoh's wife and a report on the black dog | ep36 00:29:30-00:33:30 | Garbled; hadith and animal rest on a single garbled word | Clarity | Open |
| The four Abdullahs among the Companions and a story of questions put to them | ep36 00:38:30-00:41:00 | Garbled in both passes, names and story not recoverable | Clarity | Open |
| Third sign of the commanding self, remarks on professions and Ramadan routines | ep36 00:41:30-00:42:30, 00:43:00-00:45:30 | Garbled, loops | Clarity, Loop check | Open |
| Remarks on veiled and unveiled women at Friday prayer and on marriage | ep36 00:46:00-00:47:30 | Garbled and sweeping about women | Voice rule, Clarity | Open |
| Story of an imam jailed over the Qur'an and a ruler's reply | ep36 00:47:30-00:50:00 | Garbled, imam and details rest on single words | Clarity | Open |
| Hadith of the stranger and of holding to the faith in later times | ep36 00:51:30-00:52:30 | Garbled in both passes | Clarity | Open |
| Remaining signs of the tranquil self: rahba, love of God and the Messenger | ep36 01:00:00-01:01:30, 01:05:30-01:06:00 | Garbled, items not recoverable | Clarity | Open |
| Story of Harun al-Rashid and a man guided to God | ep36 01:03:00-01:04:30 | Garbled; the name rests on one pass | Clarity | Open |
| Loop stretches of repeated syllables in the Qwen pass | ep36 00:10:00-00:10:30, 00:17:30-00:18:30, 00:20:00-00:21:00, 00:35:30-00:36:00, 00:44:00-00:45:00, 00:59:00-00:59:30 | Repeated-token loops | Loop check | Open |
| Second ASR pass: Whisper large-v3 (mlx) run on the Mac to resolve garbled words of the Qwen transcript; cites use the shared 30-second grid | ep36 whole | Qwen pass garbled | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 37 (branch from origin/main).

### alwaad-alhaq ep26 (14 Nov 2026)

20 points written for episode 26 (ar, en, ur); 18 needs_source marks for this episode in each language file; links to the Basin, intercession and Abu Talib added to the series record. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep26) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Story of al-Hasan al-Basri, the youths on the Euphrates and al-Hajjaj | ep26 00:08:30-00:09:30 | Garbled; names and sequence rest on single words | Clarity | Open |
| Remarks on veiled women abroad and sweeping remarks on women | ep26 00:07:30 | Sweeping about women, garbled | Voice rule, Clarity | Open |
| Remarks on the shaf' and watr (even and odd) and the household example | ep26 00:26:30-00:28:00 | Garbled, argument not recoverable | Clarity | Open |
| Story of a man asked what he did, and of the sheikh's teacher on the rich | ep26 00:37:30-00:39:00 | Garbled, loops | Clarity, Loop check | Open |
| Remarks on an alleged fatwa on riba beyond the sheikh's stated view; remarks on a dancer and an oud player in a band | ep26 00:45:30-00:47:30 | Garbled and tied to a ruling (opinion rulings held for the founder) | Clarity, Voice rule | Open |
| Loop stretches of repeated syllables in the Qwen pass | ep26 00:10:00-00:10:30, 00:15:30, 00:32:30, 00:49:00-00:49:30 | Repeated-token loops | Loop check | Open |

Resume point: alwaad-alhaq episode 27 (branch from origin/main).
### sharh-saheeh-al-bukhare ep37 (14 Nov 2026)

24 points written for episode 37 (ar, en, ur); 15 needs_source marks in each language file for this episode; 6 new `about` edges. Quran verses referenced only through passage links (111-1, 11-46, 7-128, 21-105, 39-74, 9-40); none typed. Contested: His argument that the Companions received no revelation and varied in faith, his claim that kinship and company with the righteous do not save, his definition of a Companion, his reading that the earth is inherited by the people of tawhid, his advice to pray for rulers, his proposal to spend zakat on marriages of young Muslims and his classing of Abu Hanifa among the generations are his views, and the rank he gives the Companions is contested between schools. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep37) | Episode / time | Reason | Gate failed | Override |
| Opening supplication and greeting, and closing farewell | ep37 00:00:00-00:02:00 and 01:30:00 | Greetings and prayers, not teaching | Content rule | Open |
| Stretch with repeated loops and fragments about those who criticise the Companions | ep37 00:04:30-00:07:00 | Qwen loops; Whisper too fragmentary to state a point | Clarity, Loop check | Open |
| Brief passing political remark about a living public figure (Qwen pass only) | ep37 00:06:00-00:06:30 | Modern political reference, not a teaching point | Voice rule | Open |
| Dialogue with Abu Dharr and remark on nearness to God | ep37 00:08:00-00:09:00 | Garbled in both passes; speaker and wording unclear | Clarity | Open |
| Anecdote about Abu Bakr and "35" items, and a Companion's name | ep37 00:15:00-00:17:00 | Numbers and name garbled in both passes, partial loop | Clarity, Loop check | Open |
| Remarks on present-day countries, peoples and politics around the inheritance of the earth | ep37 00:24:00-00:26:30 | Sweeping claims about peoples and modern conflict, plus garbled loops | Voice rule, Clarity | Open |
| Anecdote about cursing and a household dispute | ep37 00:29:30-00:30:30 | Garbled in both passes | Clarity | Open |
| Sections on frontier guarding, fighting willingly or unwillingly, and rows of Friday prayer | ep37 00:38:00-00:41:00 | Garbled in both passes | Clarity | Open |
| A stretch dropped under the content-safety block | ep37 00:41:00-00:42:30 | A stretch dropped under the content-safety block | Content rule | Open |
| Anecdotes of a preacher and a ruler, Friday sermon topics | ep37 00:42:30-00:47:30 | Garbled in both passes; names and plot not recoverable | Clarity | Open |
| Remarks on young people, media and universities | ep37 00:55:30-00:57:00 | Garbled, sweeping generalisations | Voice rule, Clarity | Open |
| Digressions and loops around al-Shafi'i's youth and al-Bukhari | ep37 00:59:30-01:03:30 | Loops and garbled stretches | Clarity, Loop check | Open |
| Account of two disputants before David, Solomon's horses and an anecdote of Abd al-Rahman ibn Awf, with jokes | ep37 01:05:00-01:14:00 | Garbled in both passes, details contradict | Clarity | Open |
| Conference anecdote and stories told in a joking register | ep37 01:22:00-01:24:00 | Garbled in both passes | Clarity | Open |
| Dream narration and a governor's request that a preacher curse a Companion | ep37 01:25:00-01:27:00 | Garbled; sectarian subject whose names cannot be recovered | Clarity, Voice rule | Open |
| Pulpit steps and closing remarks | ep37 01:27:30-01:30:00 | Garbled in both passes | Clarity | Open |
| Second ASR pass: Whisper large-v3 (mlx) run on the Mac to resolve garbled words of the Qwen transcript; cites use the shared 30-second grid | ep37 whole | Qwen pass garbled | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 38 (branch from origin/main).

### alwaad-alhaq ep27 (14 Nov 2026)

24 points written for episode 27 (ar, en, ur); 19 needs_source marks for this episode in each language file; about edges added for Iblis, Adam, Hawwa, the jinn, angels, pride, envy, innovation, usury, whispering, devils of humans and jinn, the prostration of the angels, the Frequented House, al-Baqi' and sincerity. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep27) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening discussion of Amman bombings (kept at a neutral level: condemnation of harming the innocent only) | ep27 00:00:00-00:04:30 | Partly kept; no group is named in the transcript | Content rule | Open |
| Stretch where the transcript names an armed organisation inside a garbled sentence on devils and jinn | ep27 01:16:30-01:17:00 | Dropped under the terrorist-organisation hard block; garbled and not recoverable | Content rule | Open |
| Stories of Umar and the pride saying of Ali, and a Companion's wife and the mosque | ep27 00:30:00-00:32:00 and 00:51:30-00:53:00 | Garbled; names and details contradict | Clarity | Open |
| Remarks on a contemporary finance, banking and economic arguments, entertainment critique | ep27 00:58:00-00:59:00 and 01:03:30-01:04:30 | Garbled or loops; sweeping generalisations | Clarity, Voice rule | Open |
| Loops and garbled stretches (Paradise garden wording, descent, Joseph and the stages) | ep27 00:11:30-00:13:00, 00:23:30, 00:33:30, 00:38:00, 01:09:00-01:11:00 | Loops and garbled stretches | Clarity, Loop check | Open |

Resume point: alwaad-alhaq episode 28 (branch from origin/main).

### alwaad-alhaq ep28 (14 Nov 2026)

22 points written for episode 28 (ar, en, ur); 18 needs_source marks for this episode in each language file; links added to the Flood, the Trench, Thamud, Aad, the false claimants, the Ridda wars, Abu Lahab and the other figures of the episode. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep28) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Remark on a named political group and its members | ep28 00:15:30-00:16:00 | Garbled and politically sensitive; the claim cannot be confirmed from the audio | Clarity, Voice rule | Open |
| Exchange on Abu Talib and the hadith of the three who came to the gathering | ep28 00:34:30-00:36:00 | Garbled; speakers and claim contradict | Clarity | Open |
| Anecdotes on China's one-child policy and wolves and deer in Bavaria | ep28 00:56:30-00:57:30 | Unsourced statistics and tangents | Citation, Clarity | Open |
| Claimed number of occurrences of the promise in the Qur'an | ep28 00:59:30 | Garbled figure with no source | Citation | Open |
| Anecdote of a claimant to prophethood before Harun al-Rashid and of Shiqq and Satih | ep28 01:01:00-01:02:00 and 01:09:00-01:10:00 | Garbled and contradictory names | Clarity | Open |
| Stock exchange and finance remarks on Qarun | ep28 01:22:00-01:22:30 | Garbled; sweeping generalisations | Clarity, Voice rule | Open |
| Loops and garbled stretches (Cain's story, Pharaoh's deification, Aad and Lot details) | ep28 00:19:30, 00:28:00, 00:31:30-00:32:00, 00:53:00-00:54:30, 01:00:00, 01:17:30 | Repeated loops and unreadable text | Loop check | Open |

Resume point: alwaad-alhaq episode 29 (branch from origin/main).

### alwaad-alhaq ep29 (14 Nov 2026)

27 points written for episode 29 (ar, en, ur); 22 needs_source marks for this episode in each language file; links added to fear, the Sirat, voluntary acts, the hijab, the fitra, Jahannam, the Fire, showing off, miserliness, hypocrisy, truthfulness, repentance, the sacred hadith, whim, the sound heart, treachery, lying, al-Hasan al-Basri and al-Fudayl ibn Iyad. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep29) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Chain of the sheikh's remarks on a modern writer's claim about Ibrahim and Ismail | ep29 00:12:00-00:12:30 | Garbled; no name or source recoverable | Clarity | Open |
| Poem recited around the Eid sermon of al-Qasri | ep29 00:11:30 | Garbled verse text; cannot be restored without a source | Citation, Clarity | Open |
| Details of the punishment of the two Maghribi men in the Nur al-Din story | ep29 00:14:30-00:15:00 | Garbled and loops; only 'they were punished' kept | Clarity, Loop check | Open |
| Passage on fiqh and fatwa about the Muslim's relation to government law and Caesar | ep29 00:35:30-00:36:00 | Garbled and loops | Clarity | Open |
| Hadith details about the five people of the Fire fifth type and the Zubr wording | ep29 00:56:00-00:58:30 | Garbled; fifth type kept in softened form | Clarity | Open |
| Stretches with loops or unreadable text (rhetorical 'ya Ibn Ammar', the fifth person, Paradise and Fire story) | ep29 00:08:30, 00:10:30, 00:12:30, 00:22:30, 00:25:30, 00:26:30-00:27:30, 00:34:00, 00:37:30, 00:40:00, 00:41:30-00:42:30, 00:56:00, 01:00:00-01:00:30, 01:03:00-01:03:30, 01:09:30-01:10:00, 01:13:00 | Repeated loops and unreadable text | Loop check | Open |

Resume point: alwaad-alhaq episode 30 (branch from origin/main).
### sharh-saheeh-al-bukhare ep38 (14 Nov 2026)

26 points written for episode 38 (ar, en, ur); 17 needs_source marks in each language file for this episode; 6 new `about` edges. Quran verses referenced only through passage links (9-84, 23-14, 59-8); none typed. Contested: He holds that whoever believes the Qur'an was altered has left the faith, and that whoever speaks ill of Abu Bakr will be struck by God's curse; both are his own rulings and are marked as his view, and the Sunna-and-Qur'an argument is his answer to those who take the Qur'an alone. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep38) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, praise, long supplication and welcome | ep38 00:00:00-00:03:30 | Greetings and prayer, not teaching content (only the lesson number is kept) | Content rule | Open |
| Closing prayer, exams blessing and farewell | ep38 01:21:30-01:22:00 | Closing prayer and farewell | Content rule | Open |
| Story about a non-Muslim who heard a report about Islam from a Muslim and the claim about the sincerity of enemies of Islam | ep38 00:05:30-00:06:30 | Garbled in both passes and a sweeping claim about groups | Clarity, Voice rule | Open |
| Ruling that a person who denies the Sunna is an unbeliever (second pass only) | ep38 00:07:00-00:07:30 | First pass loops there, so only one pass supports it | Clarity | Open |
| Loop of a repeated phrase | ep38 00:07:00-00:07:30 | Loop in the Qwen pass, resolved only where Whisper is clear | Clarity, Loop check | Open |
| Account of an answer by Ali about a question on a battle between Companions | ep38 00:15:30-00:17:30 | Garbled in both passes and concerns a conflict between Companions | Clarity, Content rule | Open |
| Loops and unintelligible stretch | ep38 00:16:30-00:18:00 | Garbled and looping text in both passes | Clarity, Loop check | Open |
| Claim about what unbelievers and secularists will say on the Day of Judgement | ep38 00:20:30-00:21:30 | Sweeping claim about groups, garbled | Voice rule, Clarity | Open |
| Hadith of Umar about God putting the right in his judgement (wording differs between passes) | ep38 00:12:00-00:12:30 | Wording garbled and differing in the two passes | Clarity | Open |
| Chapter and name of the narrator of the report on the Prophet's household conduct | ep38 00:22:00-00:22:30 | The narrator's name differs and is garbled in the two passes, so none is stated | Clarity | Open |
| Asides about modern bombs, markets and daily life | ep38 00:26:30-00:28:00 | Garbled and a modern conflict aside | Content rule, Clarity | Open |
| Aside on praying behind a sheikh one is not convinced of, and a story of two brothers | ep38 00:38:30-00:39:30 | Garbled, off topic | Clarity | Open |
| Supplication for Palestine, aside on martyrdom and commanders at battle | ep38 00:43:00-00:44:00 | Modern conflict supplication and garbled battle aside | Content rule, Clarity | Open |
| Aside on modern workplace and marital etiquette | ep38 00:45:00-00:46:30 | Garbled and sweeping | Clarity, Voice rule | Open |
| Account of the woman who cleaned the mosque and the Prophet's prayer over her grave | ep38 00:51:30-00:52:30 | Her name and the reward differ between passes and are garbled | Clarity | Open |
| Account of the clothing of the Prophet and a Companion's remarks about colours | ep38 00:56:30-00:58:30 | Garbled in both passes | Clarity | Open |
| Story of the two cloaks and a tale told in the sacred month | ep38 01:02:30-01:04:30 | Garbled story, no clear support | Clarity | Open |
| Aside on wealth and loss of dignity | ep38 01:06:30-01:07:30 | Garbled in both passes | Clarity | Open |
| Account of the camel and the donor, and of looking at women in the street | ep38 01:09:30-01:11:30 | Garbled in both passes and touches on women | Clarity, Voice rule | Open |
| Story of a handsome man who proposed marriage into the Prophet's household | ep38 01:12:30-01:13:30 | Garbled in both passes, names differ | Clarity, Voice rule | Open |
| Account of the prisoners of Quraysh and the number of the army | ep38 01:17:30-01:19:00 | The two passes give different numbers and the text is garbled | Clarity | Open |
| Loops and filler repeated phrases | ep38 00:25:00-00:25:30, 00:32:00, 00:41:00, 01:09:30-01:10:00, 01:12:30-01:15:00 | Repeated filler in the Qwen pass | Clarity, Loop check | Open |
| Second ASR pass: Whisper large-v3 (mlx) run on the Mac to resolve garbled words of the Qwen transcript; cites use the shared 30-second grid | ep38 whole | Qwen pass garbled | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 39 (branch from origin/main).

### alwaad-alhaq ep30 (14 Nov 2026)

25 points written for episode 30 (ar, en, ur); 21 needs_source marks for this episode in each language file; the sheikh's reports on Umar ibn Abd al-Aziz, Abu Hazim and Abu Ayyub marked as told without chain. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep30) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Story of Ata ibn Abi Rabah in the market and the trader's offer | ep30 00:18:30-00:20:00 | Garbled in the Qwen pass, the central line is unreadable | Clarity | Open |
| Remark on the number nineteen of the keepers of the Fire and what commentators made of it | ep30 00:30:00-00:30:30 | Garbled and the figures are unclear | Clarity | Open |
| Story of a son asking his father about the sultan and Ibn Taymiyya | ep30 00:42:30-00:43:00 | Garbled, speakers and quotation cannot be told apart | Clarity | Open |
| Football player transfer analogy and the lecture on predestination, happiness and wretchedness | ep30 00:52:30-00:54:30 | Garbled and loops, the argument cannot be recovered | Clarity, Loop check | Open |
| Remarks on Adam's disobedience, covering women and marrying daughters to suitors | ep30 01:00:30-01:01:30 | Garbled and sweeping | Clarity, Voice rule | Open |
| Remark on the hijab and 'the quran was for 1,426 years' | ep30 01:03:00-01:03:30 | Garbled, claim unclear | Clarity | Open |
| Loops and filler repeated phrases | ep30 00:08:30, 00:12:30, 00:15:00-00:16:00, 00:17:00, 00:26:00, 00:41:30-00:44:00, 00:53:00, 01:11:30, 01:15:30 | Repeated filler in the Qwen pass | Clarity, Loop check | Open |

Resume point: alwaad-alhaq episode 31 (branch from origin/main).
GEMINI: alwaad-alhaq ep30 (00:36:30-00:37:30): the transcript has "Abu Hazim" calling the ruler "the hired man" before Muawiya; the better-known report is of Abu Hazim al-A'raj with a Umayyad caliph (possibly Sulayman ibn Abd al-Malik); source needed to settle which caliph and which Abu Hazim.
GEMINI: alwaad-alhaq ep30 (00:16:30-00:17:00): the exchange about piety as walking in thorny land is garbled ("Abu Ghar"?); it is usually told of Umar and Ubayy ibn Ka'b; a primary source (e.g. Ibn Abi al-Dunya or Tafsir al-Tabari on al-Baqara 2) would settle the speakers.
GEMINI: alwaad-alhaq ep30 (00:48:30-00:49:30): the dream of Abu Ayyub about a man in Paradise who gathered orphans on Friday nights; the transcript is garbled and the report's source is unknown.
### sharh-saheeh-al-bukhare ep39 (14 Nov 2026)

29 points written for episode 39 (ar, en, ur); 16 needs_source marks in each language file for this episode; 5 new `about` edges. Quran verses referenced only through passage links (33-72, 22-46, 33-36, 15-6); none typed. Contested: He holds that taking only the pleasing parts of the Qur'an is forbidden, that remembering the afterlife marks the believer from the hypocrite, and that jihad reduced to earning a living falls short; these are his views, and the report on the lightened punishment of Abu Talib and the Monday report are given as reports quoted without a chain. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep39) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, praise and prayer on the Prophet, naming the lesson number | ep39 00:00:00-00:00:30 | Greetings and prayer, not teaching content (only the lesson number is kept) | Content rule | Open |
| Closing prayer and farewell, with a story of a man and a donkey that only the second pass has | ep39 01:18:00-01:19:00 | Closing prayer and farewell; the story is garbled and rests on one pass | Content rule, Clarity | Open |
| Account of three kinds of people about food and patience | ep39 00:08:30-00:10:30 | Garbled in both passes and looping | Clarity, Loop check | Open |
| Story of a seat and a lap, and asides on a bystander | ep39 00:13:00-00:14:30 | Garbled in both passes | Clarity | Open |
| Loops of a repeated phrase | ep39 00:09:30-00:10:00, 00:12:00, 00:14:30, 00:15:30, 00:18:30, 00:21:00, 00:23:00-00:23:30, 00:25:00-00:25:30, 00:26:30-00:27:00 | Repeated phrase in the Qwen pass, resolved only where Whisper is clear | Clarity, Loop check | Open |
| Asides on tests, bread and a sum of money | ep39 00:15:30-00:16:00 | Garbled and off topic | Clarity | Open |
| Heart and mind asides, a claim about what communists, Marxists and secularists will say on the Day of Judgement, and modern political names | ep39 00:30:00-00:33:00 | Sweeping claim about groups and garbled in both passes | Voice rule, Clarity | Open |
| Saying about not teaching wisdom to those unfit for it (second pass only, attribution unclear) | ep39 00:38:30-00:39:00 | Attribution unclear and the first pass loops there | Clarity | Open |
| Garbled stretch on a rumour among the people and asides | ep39 00:39:00-00:39:30, 00:41:00-00:42:30 | Garbled in both passes | Clarity | Open |
| Report of Umar weeping and Noah's prayer against his people, with the setting not recovered | ep39 00:42:30-00:43:30 | The setting and the link to the lesson are garbled, so no claim is made | Clarity | Open |
| Garbled stretch on the converts and the leaders | ep39 00:44:30-00:45:30 | Garbled in both passes | Clarity | Open |
| Sweeping claim that no man or woman at the time believed, and a stretch on lying | ep39 00:46:00-00:48:30 | Sweeping claim and garbled in both passes | Voice rule, Clarity | Open |
| Account of a letter from a British prime minister and claims about Muslims in Europe and parliament | ep39 00:52:30-00:55:30 | Modern political claims about peoples, garbled in both passes | Content rule, Voice rule, Clarity | Open |
| Offer of the Quraysh to exchange a young man for the Prophet and the reply | ep39 00:55:30-00:58:30 | Names and wording garbled and rest on one pass | Clarity | Open |
| Words of support to the Prophet whose speaker is not clear | ep39 00:58:30-00:59:00 | Speaker not recoverable in either pass | Clarity | Open |
| Claim about killing an apostate and asides | ep39 01:01:30-01:02:00 | Garbled and a contested ruling not recoverable | Clarity, Content rule | Open |
| Asides on names written on paper, on the choice of leaders and on an elder's age | ep39 01:03:00-01:04:30, 01:05:30-01:06:00 | Garbled in both passes | Clarity | Open |
| Account of a man and his son and asides on companies, aircraft and prayer | ep39 01:07:30-01:08:30, 01:08:30-01:14:00 | Garbled and looping in both passes | Clarity, Loop check | Open |
| Account of a prayer in the Hijr of Ismail, ages of 62 and 63, and the mountains and birds with David | ep39 01:15:30-01:18:00 | Garbled, numbers differ between passes | Clarity | Open |
| Second ASR pass: Whisper large-v3 (mlx) run on the Mac to resolve garbled words of the Qwen transcript; cites use the shared 30-second grid | ep39 whole | Qwen pass garbled | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 40 (branch from origin/main).

### alwaad-alhaq ep31 (14 Nov 2026)

21 points written for episode 31 (ar, en, ur); 16 needs_source marks for this episode in each language file; needs_source marks cover unchained hadiths, reports and stories and uncounted figures. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep31) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Passage on reinforcements sent to Khalid and Amr ibn al-As | ep31 00:22:30-00:23:30 | Garbled, speakers and numbers unclear | Clarity | Open |
| Poem and story of the one-eyed short man before Muawiya, and the Abd al-Malik minbar remark | ep31 00:21:00-00:22:30 | Garbled, attributions unclear | Clarity | Open |
| Passage on the insects of Hell and the Prophet's saying | ep31 00:55:30-00:56:30 | Garbled and looping | Clarity, Loop check | Open |
| Remarks on 1422 AH and 2005 AD and Cain's kind of killer | ep31 01:05:00-01:06:00 | Dates inconsistent in the transcript | Clarity | Open |
| Second ASR pass not run; clean transcript only | ep31 whole | Qwen pass garbled in places | Clarity | Open |

Resume point: alwaad-alhaq episode 32 (branch from origin/main).
GEMINI: alwaad-alhaq ep31 (00:00:30-00:03:00): who asked Abu Hazim why people dislike the hereafter and who answered (the transcript says "commander of the believers"); a primary source (e.g. Ibn Abi al-Dunya or Abu Nu'aym, Hilyat al-Awliya) would settle it.
GEMINI: alwaad-alhaq ep31 (00:08:30-00:10:30): the night walk in Medina and the woman reciting al-Ghashiya; the transcript is garbled between the Prophet, Umar and the Companions; a primary source would settle the speaker.
GEMINI: alwaad-alhaq ep31 (00:22:30-00:23:30): the reinforcement story (Abu Bakr to Khalid with al-Qa'qa', Amr ibn al-As at al-Arish and 4,000 men); numbers and speakers are garbled; Tarikh al-Tabari or Futuh al-Sham would settle it.
GEMINI: alwaad-alhaq ep31 (01:00:00-01:00:30): identity of "al-walad ibn al-mughira" (taken to be al-Walid ibn al-Mughira, 74:11-25); the transcript is garbled.
GEMINI: alwaad-alhaq ep31 (01:05:00-01:05:30): "alf firawn" likely a mishearing of "al Firawn" (40:46); the arithmetic of "four thousand Pharaohs" and the date "1422 AH / 2005 AD" are unclear.
GEMINI: alwaad-alhaq ep31 (01:03:30-01:04:00): the sheikh seems to place "do not despair of God's mercy" (39:53) in Ghafir; Surat al-Zumar is the source; a mushaf would settle the sura attribution.
GEMINI: alwaad-alhaq ep31 (00:09:00 and 00:40:00): two counts of the verses on the Fire (271 and 211); one is probably a mishearing.

### alwaad-alhaq ep32 (14 Nov 2026)

13 points written for episode 32 (ar, en, ur); 18 needs_source marks for this episode in each language file; 13 about edges linked to the series record. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep32) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Episode 32 minutes 01:00-01:20 (the spoken account of a man and Abu Hurayra on praying after the dawn prayer) | ep32 00:29:00-00:30:30 | Garbled and looped in the transcription, no reliable account recoverable | Accuracy | Open |
| Episode 32 remarks on borders, treaties and a changing fatwa | ep32 00:42:00-00:43:00 | Garbled and politically sensitive remark, not reliably transcribed (founder-held: opinion rulings) | Accuracy; sensitivity | Open |
| Episode 32 remark on veiled women inside the backbiting example | ep32 01:02:00-01:02:30 | Garbled in the transcription and could not be attributed safely | Accuracy | Open |
| Episode 32 story of a man with women at a door in Medina and a camel rope | ep32 00:57:30-00:59:30 | Garbled and incomplete in the transcription | Accuracy | Open |

Resume point: alwaad-alhaq episode 33 (branch from origin/main).

GEMINI: alwaad-alhaq ep32 (00:54:30) the report of Umar asking a man his name and clan that carried the meaning of fire and telling him his family had burned; the transcript garbles the names; which collection (probably Malik's Muwatta) gives the exact names and wording?
GEMINI: alwaad-alhaq ep32 (00:57:00) the saying "the flesh of the learned is poisoned" attributed by the sheikh to Ibn al-Jawzi; the source that would settle it is the earliest book attributing it (commonly cited to Ibn Asakir), to confirm the attribution.
GEMINI: alwaad-alhaq ep32 (00:25:30) the hadith "among the greatest betrayals with God is a man confiding to his wife and she spreads it", which the sheikh places in Muslim; the exact text and number in Sahih Muslim would settle the wording.
### sharh-saheeh-al-bukhare ep40 (14 Nov 2026)

26 points written for episode 40 (ar, en, ur); 17 needs_source marks in each language file for this episode; 14 new `about` edges. Quran verses referenced only through passage links (46-20); none typed. Contested: He is made to hold that the expeditions before Badr were not piracy because Companions had left property in Mecca and may recover it, that zakat funds may be used to marry off poor young men, and that the Arab wars before Islam were a divine training; all are his own arguments, not established positions. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep40) | Episode / time | Reason | Gate failed | Override |
| Greetings, opening praise and prayer, closing prayer and farewell | ep40 00:00:00-00:03:00 and 01:24:30 | Opening supplication and closing greeting, not lesson content | Content rule | Open |
| Stretch dropped under the content-safety block | ep40 00:02:00-00:03:00 | Supplication naming groups and conflicts, dropped under the content-safety block | Content rule | Open |
| Sweeping claims about a country, its people and a modern conflict, with calls against them | ep40 00:03:00-00:07:30, 00:09:00-00:10:30 | Sweeping modern political claims and calls against a nation, not the lesson | Voice rule | Open |
| Claims about the rise of Western countries, their people and their mosques | ep40 00:45:00-00:46:30 | Sweeping claim about nations and modern politics | Voice rule | Open |
| Saying about the market naming a people, and a call to boycott goods of certain states | ep40 00:46:30-00:47:30, 00:49:30-00:50:00 | Sweeping claims about a people and about states | Voice rule | Open |
| Sweeping claims about Western peoples by skin and eye colour, and a story about a foreigner's view of Africans | ep40 00:48:00-00:49:30 | Demeaning generalisations about peoples | Voice rule | Open |
| Modern prisons and political movement stretch | ep40 01:18:00-01:19:00 | Claim about modern conflict, also garbled | Voice rule, Clarity | Open |
| Marriage and divorce anecdotes about men and women, household quarrels | ep40 00:26:00-00:28:30, 00:32:00-00:34:00 | Garbled in both passes and generalising about women | Clarity, Voice rule | Open |
| Anecdote of a Companion and his mother, and sleeping-side and heart remarks | ep40 00:17:00-00:20:00 | Names and sense differ between the two passes | Clarity | Open |
| Metre and kilometre conversions, distances to Badr and Tabuk | ep40 00:36:30-00:38:30, 00:38:30-00:39:30 | The two passes give different numbers | Clarity | Open |
| Sword, mule and household animal reports | ep40 00:40:30-00:42:30 | Garbled and not supported by both passes | Clarity | Open |
| Counts of expeditions and detachments, name of the first detachment's leader | ep40 00:50:00-00:50:30, 00:54:00 | The two passes read the counts and the first leader differently, so none is stated | Clarity | Open |
| Persian commander and honey-jar story, shepherd and security remarks | ep40 00:56:00-00:58:30 | Garbled and read differently in the two passes | Clarity | Open |
| Poetry verses, cousin-marriage story and its names | ep40 01:04:30-01:08:30 | Verses and names garbled and contradict between passes | Clarity | Open |
| Names of the Quraysh leaders at the Kaaba and in the exchange, left unnamed | ep40 01:12:00-01:15:30 | Names rest on garbled words | Clarity | Open |
| Pairing of Ali with the Prophet in the brotherhood | ep40 00:35:30-00:36:30 | Garbled in both passes | Clarity | Open |
| Collection box and administrative announcements | ep40 01:21:30-01:23:00 | Administrative and garbled | Clarity | Open |
| Loops and repeated syllables in the first pass | ep40 00:04:30, 00:06:30, 00:14:30-00:15:30, 00:18:00-00:19:00, 00:22:00, 00:26:30-00:28:30, 00:30:00, 00:38:00, 00:44:00, 00:55:30-00:58:00, 01:08:00-01:08:30, 01:11:00, 01:17:30-01:18:00, 01:20:00-01:20:30 | Repetition loops, no recoverable content | Clarity, Loop check | Open |
| Second ASR pass: Whisper large-v3 (mlx) run on the Mac to resolve garbled words of the Qwen transcript; cites use the shared 30-second grid | ep40 whole | Qwen pass garbled | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 41 (branch from origin/main).

### alwaad-alhaq ep33 (14 Nov 2026)

15 points written for episode 33 (ar, en, ur); 20 needs_source marks for this episode in each language file; about concept/jahannam, concept/sirat, concept/sabr, concept/kibr, concept/hidaya, concept/qadar and eight persons linked. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep33) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Anecdote of al-Hasan al-Basri and the young thief, with a remark on the thief of the secret | ep33 00:12:30-00:13:00 | Garbled and the saying cannot be read | Clarity | Open |
| Remarks on satellite channels and a call against intellectual invasion in the context of the ruler's duty | ep33 00:18:30-00:19:30 | Sweeping modern political remarks and garbled | Voice rule, Clarity | Open |
| Remark that fever in this world is the believer's share of the Fire | ep33 00:49:00-00:49:30 | Garbled and given without a source | Clarity | Open |
| Remark on the many eternal residents of the Fire, whose speaker is unclear | ep33 00:28:00-00:28:30 | Speaker and sense unclear in the transcript | Clarity | Open |
| Stretches of repeated words and loops | ep33 00:34:00, 00:45:30, 00:57:00-00:57:30, 00:59:00-00:59:30, 01:00:30-01:01:30 | Repetition loops, no recoverable content | Clarity, Loop check | Open |
| Remark on the sheikh's views of Islamic law on Saturday and Sunday listeners and the closing announcements | ep33 01:15:30-01:17:00 | Administrative and a repeated recitation | Clarity | Open |

Resume point: alwaad-alhaq episode 34 (branch from origin/main).

- GEMINI: alwaad-alhaq ep33 00:57:30, the hadith of Jahannam brought with seventy thousand reins, each pulled by seventy thousand angels, which the sheikh places in Sahih al-Bukhari; settle which collection and number record it (the source that would settle it is the printed hadith collections and a primary-source check, not applied until verified).
- GEMINI: alwaad-alhaq ep33 01:04:00, the saying of eight things that make prayer unanswered, told without a speaker; settle who is credited with it (the source that would settle it is the early books of asceticism and a primary-source check).
### sharh-saheeh-al-bukhare ep41 (14 Nov 2026)

26 points written for episode 41 (ar, en, ur); 19 needs_source marks in each language file for this episode; 7 new `about` edges. Quran verses referenced only through passage links (2-96, 26-62, 17-102); none typed. Contested: He holds that Islam is religion and state and calls talk of different kinds of Islam nonsense, and he presents his own views on learning from enemies, on teaching children the ancestors' history and on the three sources of cowardice; the many reports he tells without a chain are marked needs_source. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep41) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening praise, opening supplication and greetings | ep41 00:00:00-00:04:00 | greeting and prayer, not teaching | Content rule | Open |
| Prayers against named opponents inside the opening supplication | ep41 00:02:30-00:03:30 | sweeping claims about modern conflict | Voice rule | Open |
| Closing prayer and farewell | ep41 01:17:00 | closing prayer | Content rule | Open |
| Garbled stretch about the Companions and "we" | ep41 00:10:30-00:11:30 | Qwen loops and Whisper garbled | Clarity, Loop check | Open |
| Comparison of cowards with brave men, school and battle details of the proverbial coward | ep41 00:14:30-00:15:00 and 00:17:00-00:18:30 | too garbled to recover | Clarity, Loop check | Open |
| Comparisons of Arab fighters with modern soldiers and statements about modern wars | ep41 00:25:30-00:27:00 | sweeping claim about modern conflict and garbled | Voice rule, Clarity | Open |
| Conclusion on the death of the coward | ep41 00:33:30-00:34:00 | Qwen loop and Whisper garbled | Clarity, Loop check | Open |
| Garbled passage before the three sources | ep41 00:34:30-00:35:00 | Qwen loop and Whisper partial | Clarity, Loop check | Open |
| Comments on fighting in places of modern conflict and on a modern war | ep41 00:36:00-00:37:00 | sweeping claims about modern conflict | Voice rule | Open |
| A garbled name in the list around Pharaoh's court (a stretch dropped under the content-safety block) | ep41 00:47:30-00:48:00 | garbled word that could be read as a blocked name | Content rule | Open |
| Garbled passage on a bureaucrat's signature and numbered law | ep41 00:41:00-00:41:30 and 00:43:00-00:44:00 | analogy too garbled to recover | Clarity, Loop check | Open |
| Garbled passage on treaties and the logic of the opponents | ep41 00:49:00-00:50:00 | garbled and sweeping about a people | Voice rule, Clarity | Open |
| Claims about the cowardice of a whole people | ep41 00:53:30-00:55:30 | demeaning generalisation about a people | Voice rule | Open |
| Poets and rewards, boy's memory and recitation stretches | ep41 01:03:30-01:08:30 | too garbled and looping to recover | Clarity, Loop check | Open |
| Ending of the caliph anecdote and loops | ep41 01:10:00-01:11:00 | Qwen loops and Whisper partial | Clarity, Loop check | Open |
| Garbled part of the siege story | ep41 01:13:30-01:14:00 | Qwen loop and Whisper partial | Clarity, Loop check | Open |
| Second ASR pass: Whisper large-v3 (mlx) run on the Mac to resolve garbled words of the Qwen transcript; cites use the shared 30-second grid | ep41 whole | Qwen pass garbled | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 42 (branch from origin/main).
GEMINI: ep41, who is the Companion-poet addressed by the Prophet as Abu Layla who recited a poem on the day he accepted Islam whose last verse speaks of reaching the heavens in glory and what short prayer the Prophet made for him, the two transcripts spell the name only in garbled forms so no name is written, al-Isti'ab of Ibn Abd al-Barr or al-Isaba of Ibn Hajar
GEMINI: ep41, is there a report that Gabriel told the Prophet he pushed something into Pharaoh's mouth for fear mercy would reach him and that Gabriel put to Pharaoh the question of the slave and his master, the transcripts give the substance as garbled ("water") and the chain not at all, Sunan al-Tirmidhi and Musnad Ahmad and the classical tafsir of the sea verses
GEMINI: ep41, is the divine saying about the servant who holds fast to God reported by Ibn Hibban in his Sahih from Abdullah ibn al-Zubayr from his father, the transcripts give this chain but the wording is garbled, Sahih Ibn Hibban itself
GEMINI: ep41, the story of the Persian commander asking Khalid about a sword from heaven, the transcripts disagree on whether Khalid said the sword was made by God or by a man so only his denial is written, a primary account of the campaigns of Khalid ibn al-Walid in Iraq
GEMINI: ep41, is the poet whom the Prophet called Abu Layla (reciter of the poem ending 'we reached the heavens in glory') al-Nabigha al-Ja'di, Whisper gives al-Nabigha al-Ja'di clearly and Qwen a close garbled form, al-Isti'ab of Ibn Abd al-Barr or al-Isaba of Ibn Hajar

### sharh-saheeh-al-bukhare ep42 (14 Nov 2026)

26 points written for episode 42 (ar, en, ur); 25 needs_source marks in each language file for this episode; 10 new `about` edges. Quran verses referenced only through passage links (9-40, 2-217, 9-36, 61-4, 5-24, 8-12); none typed. Contested: His view that the angels at Badr came to steady hearts rather than to fight, his use of the report of Umar striking a man who rejected the Prophet's judgement, and the attributed sayings of Ali, Abdullah ibn Umar and the judges report are given as his own and are read differently by others. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep42) | Episode / time | Reason | Gate failed | Override |
| Announcements about mushafs on the floor, street sellers, women attendees, Friday arrangements, greetings, praise and prayer, and the closing farewell | ep42 00:00:00-00:04:00, 01:24:00 | Greetings, housekeeping and closing; not teaching content | Content rule | Open |
| Remarks about women attending, bringing children and a joke about marriage ages | ep42 00:01:00-00:03:30, 00:15:30-00:16:30 | Sweeping remarks about women and jokes | Voice rule | Open |
| Claims that Persians as a people were enemies of Islam and plotted the killing of Umar | ep42 00:09:30-00:11:00 | Sweeping claim about a people, framed as enmity; only the plain fact of the killing is kept | Voice rule | Open |
| Comparisons with modern America and Europe, stock-market and mortgage losses, and modern criminal law | ep42 00:19:00-00:20:30, 00:11:30-00:12:00 | Sweeping modern political and economic claims | Content rule | Open |
| Attacks on modern critics, attire rulings, and claims about extremism and freedom of thought | ep42 00:25:30-00:27:30, 00:29:00-00:30:00 | Sweeping claims about modern groups and polemic | Voice rule | Open |
| Modern comparisons with international legitimacy, the United Nations and pagan peoples | ep42 00:37:00-00:38:00 | Sweeping claims about modern conflict and nations | Content rule | Open |
| Jokes about wages, football transfers, Egyptian and Arab wealth and graduates | ep42 00:46:00-00:47:30 | Sweeping remarks about peoples and modern society | Voice rule | Open |
| Statement that we love death as others love life, called the philosophy of martyrdom | ep42 00:10:00-00:10:30, 01:10:00-01:10:30 | Extremist vocabulary hijacking a classical term; a stretch dropped under the content-safety block | Content rule | Open |
| Digression on the teacher of al-Bukhari, a fighter who killed a thousand, and the praise of a commander | ep42 01:04:30-01:07:00 | Names garbled in both passes and loops; story unverifiable | Clarity, Loop check | Open |
| Reported mat and Kisra-and-Qaysar exchange, the question about the Quraysh captives and Abu Bakr's protection story | ep42 01:16:30-01:18:00, 01:20:00-01:21:30 | Speakers unclear and the stretch too garbled to recover | Clarity | Open |
| Loop stretches of repeated syllables and words | ep42 00:02:30, 00:09:00-00:09:30, 00:16:00, 00:24:00, 00:35:30, 00:36:30, 00:37:30, 00:48:30, 00:54:30, 00:55:30, 00:57:30, 01:03:30, 01:06:00-01:06:30, 01:10:30, 01:22:30, 01:23:30 | Looping ASR, no recoverable content in the Qwen pass | Clarity, Loop check | Open |
| Camel counts and exact army figures where the two passes disagree | ep42 00:44:30-00:45:00, 00:49:30-00:50:00 | Qwen and Whisper read different numbers; only the rough figure is kept | Clarity | Open |
| Second ASR pass: Whisper large-v3 (mlx) run on the Mac to resolve garbled words of the Qwen transcript; cites use the shared 30-second grid | ep42 whole | Qwen pass garbled | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 43 (branch from origin/main).
GEMINI: ep42, who led the eight-man detachment sent in Rajab of year 2 (patronym) and who the slain man allied with Quraysh was, the transcripts give only "Abdullah" and a garbled name, the Sira of Ibn Hisham and al-Tabari for the expedition of Nakhla
GEMINI: ep42, which Companion spoke for the Muhajirun at the consultation before Badr (the "we will not say as the Children of Israel said" speech), the transcripts garble the name, the report in Sahih al-Bukhari on the Battle of Badr
GEMINI: ep42, which man of Quraysh stayed behind ill in Mecca and whose slave reported white-faced riders (name garbled as "Abu Lahab" or similar in both passes), the Sira of Ibn Hisham
GEMINI: ep42, identity of the man whose son was a Badr captive and who came to Medina to kill the Prophet, and of the man he conspired with at the Black Stone (names not recoverable in either pass), the Sira of Ibn Hisham
GEMINI: ep42, the name and identity of the man who gave a woman and her son safe escort to Medina and was reminded of it after eight years (names garbled in both passes), a Sira source on the emigration of the woman and her son
GEMINI: ep42, name of the man Abu al-Hasan al-Zahid faced with the lion (garbled as Ibn Qulub / Ibn Farud in the two passes), the transcripts give no clear name, a biographical source on Abu al-Hasan al-Zahid
GEMINI: ep42, name of the first man of Quraysh killed at Badr (al-Aswad ibn Abd al-Asad in one reading, garbled in both passes), the transcripts give only a garbled name, the Sira of Ibn Hisham on Badr

### alwaad-alhaq ep34 (14 Nov 2026)

25 points written for episode 34 (ar, en, ur); 30 needs_source marks for this episode in each language file; edges to jahannam, zaqqum and fire. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep34) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Garbled passage on Surat al-Mu'minun | ep34 00:44:30 | transcript too garbled to summarise | ASR garble | Open |
| Passage on Hiroshima and killing | ep34 00:27:00 | transcript garbled; not summarised | ASR garble | Open |
| Discussion of one who never prays, Imam Ahmad and annulment | ep34 00:56:30 | garbled and an opinion ruling, founder-held | ASR garble, opinion ruling | Open |

Resume point: alwaad-alhaq episode 35 (branch from origin/main).

GEMINI: alwaad-alhaq ep34 00:47:30 the name of the leader of the hypocrites, written in the transcript as a garbled Abdullah ibn Mu'awiya; context points to the leader of the hypocrites of Medina; the source that would settle it is a classical biography (Ibn Hisham or Ibn Sa'd).
GEMINI: alwaad-alhaq ep34 01:14:30 closing verses of poetry beginning "do not wrong when you have power"; the transcript gives no poet; source needed is an anthology of Arabic poetry or a poetry-search of the first line.

### alwaad-alhaq ep35 (14 Nov 2026)

26 points written for episode 35 (ar, en, ur); 33 needs_source marks for this episode in each language file; graph edges added for jannah, sabr, shukr, istighfar, tawakkul, tawba, dhikr, taqwa and rida-bil-qada. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep35) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| The poor man and Ibn Abbas milk anecdotes | ep35 00:04:30-00:05:00, 00:22:30 | transcript too garbled to summarise reliably | accuracy | Open |
| The remark on Persian customs during the Qadisiyya story | ep35 00:29:00-00:29:30 | ASR text unreliable and the remark is a disparaging generalisation, not summarised | neutral voice | Open |
| A garbled token resembling a blocked organisation name in the keys-of-evil passage | ep35 01:03:00 | likely ASR error for hypocrisy; omitted per the hard block, nothing written | terrorist-organisation block | Open |
| The Abu Hanifa grapes and water exchange | ep35 01:01:30-01:02:00 | garbled and its attribution to Abu Hanifa is doubtful; not summarised | accuracy | Open |
| Ibn Abbas reflection on moments of contentment as like Paradise | ep35 00:44:00-00:44:30 | garbled | accuracy | Open |
| The Abu Hanifa-adjacent loop passages and repeated segments | ep35 00:50:30, 00:55:30, 01:04:30 | ASR loop repetition | accuracy | Open |

Resume point: alwaad-alhaq episode 36 (branch from origin/main).
GEMINI: alwaad-alhaq ep35 00:36:30 the Companion who wept at the conquest of Cyprus, written in the transcript as Abu Dharr; tradition elsewhere names Abu al-Darda; the source that would settle it is the narration in Ibn Kathir's al-Bidaya or the Tarikh of al-Tabari on the conquest of Cyprus.
GEMINI: alwaad-alhaq ep35 00:50:00 the narrator of the hadith "say I believe in God then be steadfast", written as a garbled kunya; likely Sufyan ibn Abdallah al-Thaqafi; the source that would settle it is Sahih Muslim, Book of Iman.
### sharh-saheeh-al-bukhare ep43 (14 Nov 2026)

25 points written for episode 43 (ar, en, ur); 13 needs_source marks in each language file for this episode; 6 new `about` edges. Quran verses referenced only through passage links (31-34, 35-2, 8-72); none typed. Contested: His readings of why Muslims are defeated (weak belief, allying with enemies, immersion in desires, rulers ignoring scholars), his attribution of the army ranks to Khalid ibn al-Walid, the Paris and ship-burning stories, the claim that Tariq was the only non-Arab commander, and the population figures are given as his own, without reference, and are read differently by others. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep43) | Episode / time | Reason | Gate failed | Override |
| Greetings, praise, the opening supplication and the closing prayer, farewell and announcement of a lecture the next day | ep43 00:00:00-00:02:30, 01:22:30-01:23:30 | Greetings, supplication and closing; not teaching content | Content rule | Open |
| Talk of Europe, the Soviet bloc and the United Nations working to erase the faith, and comparison of the fall of Andalus with the fall of Palestine | ep43 00:05:30-00:06:30, 00:35:30 | Sweeping claims about modern states and a modern conflict | Content rule | Open |
| Remarks on what other speakers should lecture on, spouses' rights, and the joke about the speakers' topics | ep43 00:11:00-00:13:30 | Digression, garbled in both passes and too unclear to recover | Clarity | Open |
| A saying that a tyrannical ruler is better than civil strife, the story of Sodom and Umar, and comments on the title of leader in other countries | ep43 00:14:30-00:17:00 | Garbled in both passes; the saying is a political generalisation without source | Clarity, Voice rule | Open |
| Remarks on women, attire, a conference of scholars and a modern preacher, anecdotes about a husband and an Egyptian official | ep43 00:17:00-00:19:00, 00:21:00-00:22:00 | Sweeping remarks about women and modern groups; partly garbled | Voice rule, Clarity | Open |
| Claim that Jews and Christians unite against Islam despite their differences | ep43 00:24:30 | Sweeping claim about peoples | Voice rule | Open |
| Story of a tall man kissing the head of another and the account of a modern movement's founder and a man seeking discord | ep43 00:23:00-00:24:30 | Garbled in both passes, speakers and point not recoverable | Clarity | Open |
| Talk of an Egyptian student mission to Paris, a tale of a bride and Egyptian economic and family remarks | ep43 00:40:00-00:43:00, 00:45:30-00:47:30 | Garbled digression and sweeping remarks about a nation | Clarity, Voice rule | Open |
| Remarks on Muslims in other countries being killed, boycotting named countries and charity to Muslims abroad | ep43 00:54:00-00:55:00, 01:00:00-01:00:30 | Sweeping claims about modern conflict and states; a stretch dropped under the content-safety block where it touched named movements | Content rule | Open |
| The German ambassador in Morocco anecdote and talk of scholars' councils and their disputes in Egypt | ep43 00:37:30-00:38:30, 01:00:30-01:03:00 | Names and details garbled in both passes; hearsay about named bodies | Clarity | Open |
| Stretch on the Gulf, family anecdotes, a household visit and talk of the scholars' fees | ep43 00:57:30-00:58:30, 01:12:00-01:14:30 | Garbled in both passes; point not recoverable | Clarity | Open |
| Question and answer remarks on teaching, marriage and the second and third questions | ep43 01:18:00-01:19:30 | Garbled in both passes and the questions are not recoverable | Clarity | Open |
| Loop stretches of repeated syllables and words | ep43 00:12:00-00:12:30, 00:13:30, 00:14:30-00:15:00, 00:20:00, 00:23:30, 00:24:00, 00:27:30, 00:29:30, 00:31:30, 00:33:00, 00:38:00-00:38:30, 00:41:30, 00:51:00, 00:53:00, 00:55:30, 00:57:30, 01:03:00, 01:04:00, 01:07:30, 01:13:30, 01:16:30, 01:19:30, 01:23:00 | Looping ASR in the Qwen pass, little or no recoverable content | Clarity, Loop check | Open |
| Second ASR pass: Whisper large-v3 (mlx) run on the Mac to resolve garbled words of the Qwen transcript; cites use the shared 30-second grid | ep43 whole | Qwen pass garbled | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 44 (branch from origin/main).
GEMINI: ep43, which commanders he names as stopping on high ground about three hundred kilometres from Paris (the Qwen pass garbles the names and the Whisper pass gives a form that sounds like Musa ibn Nusayr and Tariq), a historical source on the furthest Muslim advance into Gaul and the report that the conquerors halted at the mountains
GEMINI: ep43, who composed the elegy on the fall of Andalusian cities he recites at the end (both passes garble the poet's name as Abu al-Faqr al-Razi or similar, but the verses on everything completed declining and the crowned kings are legible), the anthology of Andalusian elegies or a standard edition of the poem to settle the poet and the title
GEMINI: ep43, exact name of the practice he proposes to young people (read as a week of lowering the gaze: Qwen gives ghadb al-basar, Whisper gives a garbled form), the audio at 00:19:00 to settle the phrase
GEMINI: ep43, who is the last king he says handed over the last stronghold and wept (both passes give Abdullah ibn al-Ahmar, which may be Muhammad XII of Granada), a history of the fall of Granada and the report attributed to his mother

### alwaad-alhaq ep36 (14 Nov 2026)

25 points written for episode 36 (ar, en, ur); 33 needs_source marks for this episode in each language file; 19 new persons, concepts and events linked as about edges on the series record. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep36) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Houri description and knocking segments | ep36 00:08:30-00:09:00, 00:11:00-00:12:00 | ASR loop and garbling | Clarity, Loop check | Open |
| Passage on what to do when angry | ep36 00:28:00-00:29:30 | ASR loop repetition, not summarised | Loop check | Open |
| Egoism passage and attributed saying of al-Hasan al-Basri | ep36 00:52:00-00:52:30 | garbled | Clarity | Open |
| Names of the servant's master, the captive Companion, the rooftop man and the surety | ep36 ep36 various | garbled in transcript, not named | accuracy | Open |

Resume point: alwaad-alhaq episode 37 (branch from origin/main).
GEMINI: alwaad-alhaq ep36 00:19:00-00:23:00 the dream and death story told of Sa'id ibn Zayd (stray arrow at sunset while fasting); the transcript names him one of the ten and husband of Fatima bint al-Khattab, but standard accounts of his death differ; the source that would settle it is the biography of Sa'id ibn Zayd in Ibn Sa'd's Tabaqat or Ibn Hajar's Isaba and the origin of the story.
GEMINI: alwaad-alhaq ep36 00:34:00 the bedouin, the orchard and the surety story: the transcript names the surety as Abu Hurayra, but the story is commonly told of another Companion in the time of Umar; the source that would settle it is a hadith-commentary or Tabari/Ibn Kathir passage on the guarantor of the condemned bedouin.
GEMINI: alwaad-alhaq ep36 00:33:30 the master who answered the servant's recitation of the verse on restraining anger (the transcript reads like Harun al-Rashid but is garbled; commonly told of Ali ibn al-Husayn); the source that would settle it is an adab or tafsir work retelling the story (for example in the commentary on Al Imran 134).
GEMINI: alwaad-alhaq ep36 00:51:00 the Companion captured by Quraysh who said he would not wish the Prophet pricked by a thorn in his place (the transcript gives a garbled name resembling Khabbab ibn Arat; the story is usually told of Zayd ibn al-Dathina at al-Raji); the source that would settle it is Ibn Ishaq/Ibn Hisham on the expedition of al-Raji.
GEMINI: alwaad-alhaq ep36 00:40:30 the man who heard the verse on the submission of hearts on a rooftop and turned back (the transcript gives a garbled name, possibly Ibrahim ibn Adham, usually told of al-Fudayl ibn Iyad); the source that would settle it is the biography of al-Fudayl in Abu Nu'aym's Hilya.
### sharh-saheeh-al-bukhare ep44 (14 Nov 2026)

27 points written for episode 44 (ar, en, ur); 21 needs_source marks in each language file for this episode; 6 new `about` edges. Quran verses referenced only through passage links (106-4, 34-15, 34-19, 3-128, 3-146, 11-6, 3-139, 16-126, 16-127, 3-147); none typed. Contested: His view that the Muslims were not defeated at Uhud, his calling the Prophet's yielding to the young men the democracy of the Messenger, his reading of the causes (disobedience, wahn, abasement), his advice on gathering around scholars, and the troop numbers, the number seventy killed by Khalid and the counts of wounded are given as his own, without reference, and are read differently by others. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep44) | Episode / time | Reason | Gate failed | Override |
| Greetings, praise, the opening supplication, closing remarks, farewell and the opening announcement | ep44 00:00:00-00:03:00, 01:20:30 | Greetings, supplication and closing; not teaching content | Content rule | Open |
| Remarks on a modern military defeat and on those who excuse it, the comparison of the council's plan with popular resistance in the present, and the description of the Arab homeland as a prison | ep44 00:03:00-00:04:30, 00:10:30, 00:11:30-00:12:00 | Sweeping claims about modern states and a modern conflict | Content rule | Open |
| The poem and anecdote of a traveller at a foreign airport, and remarks on young people and preachers | ep44 00:13:30-00:15:30 | Anecdote and sweeping remarks about a group, garbled in both passes | Voice rule, Clarity | Open |
| The Companions' answers about the best of people and the angels exchange | ep44 00:19:30-00:20:30 | Garbled in both passes, speakers not recoverable | Clarity | Open |
| Phase one of the battle (the two passes disagree on who attacked whom), the remark on wanting this world, and the story involving Umar after the conquests | ep44 00:22:30, 00:25:30, 00:30:00-00:30:30 | Contradictory or single-pass and garbled; not stated | Clarity | Open |
| Names of the relatives of Umm Umara and the list of what the Companions did after the rumour | ep44 00:30:30-00:31:00, 00:31:30-00:32:00 | Names garbled in both passes | Clarity | Open |
| Remarks on a Jewish tribe two months before the battle, an execution story, revolution, citizenship and the state, and a remark on a foreign power as provider | ep44 00:38:00-00:41:30 | Sweeping claims about a people and modern states; garbled | Content rule, Voice rule, Clarity | Open |
| A poem, remarks on a modern head of state, an airport and student missions, and comments on named countries and conversions in Europe and America | ep44 00:42:00-00:48:00 | Sweeping claims about modern states and peoples; garbled | Content rule, Clarity | Open |
| Remarks on the covering of a martyr's body, the Prophet's sisters and relatives, and the lessons for those who seek revenge | ep44 00:49:30-00:53:30 | Garbled in both passes, names not recoverable | Clarity | Open |
| Remarks on not hurrying events, the two Companions buried in one grave and the ages of the Companions on entering Islam | ep44 00:55:30-00:59:30 | Garbled in both passes, names and ages not recoverable | Clarity | Open |
| The scene in Medina of people seeing their fathers and sons among the dead and a call for patience | ep44 01:00:30-01:03:00 | Garbled in the Qwen pass, one pass only | Clarity | Open |
| Stretch on the invasion of a neighbouring state, a donut anecdote and a story of a woman named Amina | ep44 01:09:30-01:13:00 | Sweeping claim about modern conflict and garbled anecdote | Content rule, Clarity | Open |
| Stretch on the river crossing of the army of a former prophet, found in one pass only | ep44 01:13:30-01:14:30 | Single-pass, the other pass loops | Clarity | Open |
| Stretch on children with stones and a modern conflict, with remarks on a people | ep44 01:14:30-01:17:30 | Sweeping claims about a people and a modern conflict | Content rule, Voice rule | Open |
| Loop stretches of repeated syllables and words | ep44 00:05:30, 00:25:30, 00:32:00, 00:34:00, 00:39:00, 00:41:00, 00:43:00, 00:44:00, 00:45:30, 00:46:00, 00:46:30, 00:48:00, 00:49:30, 00:51:30, 00:54:00, 00:56:30, 00:58:00, 01:01:00, 01:02:30, 01:04:00, 01:08:30, 01:09:00, 01:10:00, 01:10:30, 01:11:00, 01:13:00, 01:13:30, 01:14:00, 01:15:00, 01:16:00, 01:17:00 | Looping ASR in the Qwen pass, little or no recoverable content | Clarity, Loop check | Open |
| Second ASR pass: Whisper large-v3 (mlx) run on the Mac to resolve garbled words of the Qwen transcript; cites use the shared 30-second grid | ep44 whole | Qwen pass garbled | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 45 (branch from origin/main).
GEMINI: ep44, names of the Companion who pulled the helmet rings from the Prophet's face and broke his front teeth and of the one who bound the wound and sucked the blood (Qwen gives a form like Abu Zarat, Whisper a form like Abu Dhar, neither reliable), Sahih al-Bukhari Kitab al-Maghazi chapter on Uhud and Ibn Hisham's Sira
GEMINI: ep44, name of the commander of the archers on the mountain and the count of those killed with him (Qwen gives Abdullah ibn Juwayra, Whisper gives Abdullah ibn Jubayh, and both give ten), Sahih al-Bukhari Kitab al-Maghazi chapter on Uhud
GEMINI: ep44, the Muslim whose face was covered and sweet rush laid at his feet, with a sister seeking him (00:51:00-00:52:30), the Prophet's vow to mutilate thirty and the Companions' seventy (00:53:30; both passes give a form like Hamza) and the two Companions buried in one grave (00:56:00-00:56:30), Ibn Hisham's Sira and Sahih al-Bukhari on Uhud
GEMINI: ep44, the narrator and collection of the supplication of praise he attributes to the Prophet after the battle (01:03:00-01:06:30) and the narrator of the report of the best of people and the people who come after (00:19:30-00:21:00), Musnad Ahmad and al-Adab al-Mufrad for the first, a Sahih collection for the second

### alwaad-alhaq ep37 (14 Nov 2026)

26 points written for episode 37 (ar, en, ur); 28 needs_source marks for this episode in each language file; linked to the gardens of Eden concept. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep37) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Looping audio about the needy and the poor | ep37 00:20:30 to 00:23:00 | ASR loop and garbled text | Faithfulness | Open |
| Garbled passage on Ibn Taymiyya and men at his door | ep37 01:08:00 | Unintelligible transcript | Faithfulness | Open |
| Garbled tale of a woman's prayer at Badr and Umm Ayman | ep37 00:33:30 | Unintelligible transcript | Faithfulness | Open |
| Garbled couplet on bringing back yesterday | ep37 00:41:00 | Unintelligible transcript | Faithfulness | Open |
| Abu Jahl and his wife exchange | ep37 00:12:00 | Garbled transcript, not summarised | Faithfulness | Open |

Resume point: alwaad-alhaq episode 38 (branch from origin/main).
GEMINI: alwaad-alhaq ep37 00:27:30: Does Ibn Hajar in Fath al-Bari count the hadith "actions are by intentions" as one of four pillars of hadith; transcript says so loosely; the source that would settle it is the introduction of Fath al-Bari.
GEMINI: alwaad-alhaq ep37 00:36:00: Name of the imam flogged over the creation of the Qur'an who smiled ("he saw the Lord of servants"); transcript name garbled (Ahmad ibn Hamza?); source would be an account of the Mihna.
GEMINI: alwaad-alhaq ep37 00:21:00: Ibn Abbas report that the poor enter Paradise half a day (five hundred years) before the rich, with a test of poverty; transcript garbled; the source that would settle it is a hadith or athar collection.
### sharh-saheeh-al-bukhare ep45 (14 Nov 2026)

23 points written for episode 45 (ar, en, ur); 15 needs_source marks in each language file for this episode; 8 new `about` edges. Quran verses referenced only through passage links (33-36, 2-68); none typed. Contested: His readings of the battles as renewal of creed and of truth always prevailing, his dating and naming of the sorties and incidents, the numbers he gives (nine campaigns, seventy sent, sixty-eight killed, seven kilometres) and the cause he gives for the name Dhat al-Riqa' are given as his own, without reference, and are read differently by historians. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep45) | Episode / time | Reason | Gate failed | Override |
| Greetings, praise, the opening supplication, the closing supplication and farewell, and the opening announcement | ep45 00:00:00-00:04:00, 01:18:30 | Greetings, supplication and closing; not teaching content | Content rule | Open |
| Supplication stretches naming modern conflicts and groups | ep45 00:02:00-00:03:00 | Sweeping claims about modern conflict and groups | Content rule | Open |
| Remarks on negotiators, a modern negotiation and a modern conflict, with a comparison to a family quarrel | ep45 00:17:30-00:19:30 | Sweeping claims about modern states and a modern conflict | Content rule, Voice rule | Open |
| The conversation about Aisha, the Prophet's wives and plural marriage, with an anecdote of Umar and a question about whether the Prophet married except by revelation | ep45 00:14:00-00:16:30 | Garbled in both passes and the speakers are not recoverable | Clarity | Open |
| The anecdote of a companion with a person named in the sieve passage and the remark on a fraction of the early companions | ep45 00:10:30-00:11:30 | Names garbled in both passes and the passes disagree | Clarity | Open |
| Claims about a people, its wealth, its media and the causes of the enmity against the Prophet, with readings of a chapter of the Qur'an and a hadith about the last days applied to a modern conflict | ep45 00:21:30-00:31:30 | Sweeping claims about a people and a modern conflict | Content rule, Voice rule | Open |
| Remarks on secularists, communists, crusaders and a people as enemies everywhere, and a call for victory | ep45 00:32:00-00:33:30 | Sweeping claims about groups and a modern conflict | Content rule, Voice rule | Open |
| The story of a rich man and a pious one on the way to Moses, and the dialogue about poverty and the cow | ep45 00:33:30-00:36:30 | Garbled in both passes and the passes disagree | Clarity | Open |
| Remarks on a modern state, its cultural centre and the schooling of a people | ep45 00:39:30-00:41:00 | Sweeping claims about a people and modern states | Content rule, Voice rule | Open |
| The story of a claimant to prophethood and a woman leader, with the dowry exchange, and the aside on the history of civilisations | ep45 00:42:00-00:43:30 | Garbled in both passes and the passes disagree | Clarity | Open |
| The second sortie (an envoy sent alone against a tribal leader) and the Prophet's description of the man | ep45 00:46:00-00:48:30 | Names and details garbled in both passes and the passes disagree | Clarity | Open |
| The remarks on the burial and mourning after Bi'r Ma'una, the Prophet's supplication against the tribes, and the reflection on those who object to the sorties | ep45 00:51:30-00:55:30 | Garbled in both passes and not stated | Clarity | Open |
| Remarks on a modern war, on foreign states and on rich men withdrawing funds, and on those who kill Muslims | ep45 00:57:00-00:58:00 | Sweeping claims about modern states and a modern conflict | Content rule, Voice rule | Open |
| The conversation with the captive before his execution and the remark on true love | ep45 00:59:30-01:00:30 | Garbled in both passes and the speakers are not recoverable | Clarity | Open |
| The campaign of Dumat al-Jandal and the meeting there | ep45 01:02:30-01:03:30 | Garbled in both passes, the place name is not recoverable | Clarity | Open |
| The details of the litter, the walk at night with a woman companion and the cursing of her son | ep45 01:05:30-01:07:30, 01:10:30-01:13:00 | Names and details garbled in both passes and the passes disagree | Clarity | Open |
| Names of those who spread the rumour and the closing stretch on the revelation about the affair | ep45 01:07:30, 01:13:00-01:18:30 | Names garbled in both passes and the closing stretch loops | Clarity, Loop check | Open |
| Loop stretches of repeated syllables and words | ep45 00:06:30, 00:08:30, 00:13:30, 00:27:00, 00:27:30, 00:30:00-00:31:30, 00:34:30, 00:38:30, 00:39:30, 00:43:30, 00:45:00, 00:45:30, 00:46:30, 00:48:00, 00:52:00, 00:53:30, 00:54:00, 00:54:30, 00:57:00, 01:02:30, 01:06:00, 01:12:00, 01:14:00, 01:14:30, 01:17:30, 01:18:00 | Looping ASR in the Qwen pass, little or none recoverable | Clarity, Loop check | Open |
| Second ASR pass: Whisper large-v3 (mlx) run on the Mac to resolve garbled words of the Qwen transcript; cites use the shared 30-second grid | ep45 whole | Qwen pass garbled | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 46 (branch from origin/main).
GEMINI: ep45, the commander of the first sortie after Uhud against Banu Asad and the chief of that tribe (Qwen gives a form like Ali ibn Salama, Whisper a form like Abu Salama, and the chief's name is garbled in both), Ibn Hisham's Sira and al-Tabari on the year 4 sorties
GEMINI: ep45, the chief who gave protection at Bi'r Ma'una and the figure of those killed (Qwen gives a form like Abu Umayr, Whisper a form like Abu Bara' Amir ibn Malik; both give sixty-eight), Sahih al-Bukhari Kitab al-Maghazi chapter on Bi'r Ma'una
GEMINI: ep45, the name of the companion who prayed two units before being killed and the others taken at al-Raji' (Qwen gives a form like Khabbab ibn Abd, Whisper a form like Khattab ibn Ali; Abdullah ibn Tariq is given by both), Sahih al-Bukhari Kitab al-Maghazi chapter on al-Raji'
GEMINI: ep45, the narrator and collection of the pledge on three matters and of the companion who got down to pick up what fell from his hand (00:07:30-00:08:30), Musnad Ahmad and Sahih Muslim
GEMINI: ep45, the companion left behind to follow the army in the slander affair (Qwen gives a form like Sakhr ibn Atiyya, Whisper a form like Safwan ibn Mu'attal), Sahih al-Bukhari Kitab al-Maghazi chapter on the slander

### alwaad-alhaq ep38 (14 Nov 2026)

22 points written for episode 38 (ar, en, ur); 19 needs_source marks for this episode in each language file; the series record now lists episodes 1-38 with new about links to ikhlas, tawakkul, the houris, the jinn, Ibn Mas'ud, Khalid ibn al-Walid, Musa, Sulayman and kasb. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep38) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Story of the animals offering themselves as food in Paradise | ep38 00:40:00-00:40:30 | transcript garbled and mixed across several lines | garbled source | Open |
| Passage on the houris and worldly outlook | ep38 00:22:00-00:23:30 | transcript looping and garbled | garbled source | Open |
| Abu Hazim and the caliph washing the dead | ep38 01:00:00-01:00:30 | names garbled and unclear who speaks | garbled source | Open |
| Segments with repeated loops (houri passage, quarters of the tent, reclining passage) | ep38 00:47:30-00:55:30 and 01:05:00 | Whisper loop artefacts with no recoverable content | garbled source | Open |
| Chains and books for the reports flagged needs_source | ep38 throughout | sheikh gives no chain or book | unchained report | Open |

Resume point: alwaad-alhaq episode 39 (branch from origin/main).
GEMINI: ep38, the narrator of the last-to-leave-the-Fire hadith (Qwen gives a form like Hudhayfa ibn Mas'ud, the sheikh says Ibn Mas'ud) and whether the laughing exchange is in Sahih Muslim (00:07:30-00:08:30), Sahih Muslim Kitab al-Iman, chapter on the last of the people of the Fire to leave
GEMINI: ep38, the report that the tent of Paradise is a hollowed pearl the size of the world and who is named as the narrator (a form like Umar, ibn al-Khattab; 00:54:30), Sahih al-Bukhari Kitab Tafsir surat al-Rahman and Sahih Muslim Kitab al-Jannah
GEMINI: ep38, the report of the Prophet reciting Surat al-Rahman to his Companions and the jinn's reply (00:37:00-00:38:00), Jami al-Tirmidhi tafsir surat al-Rahman
### sharh-saheeh-al-bukhare ep46 (14 Nov 2026)

26 points written for episode 46 (ar, en, ur); 22 needs_source marks in each language file for this episode; 15 new `about` edges. Quran verses referenced only through passage links (28-77, 33-10, 33-11); none typed. Contested: His accounts of the supplication at al-Ta'if, the angel of the mountains, the dream of Umar's palace, the hadith on Sa'd's jealousy, the rock at the trench, the numbers (1,900 Muslims, 13,000 enemy, 650 horsemen, 300 Companions, forty-five believers in Mecca), the Shawwal of year four dating, the duel of Ali and the deaths of Khadija and Abu Talib are given as his own without chain or reference, and his readings of bribery, certainty and hardship as a mercy are his own views. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep46) | Episode / time | Reason | Gate failed | Override |
| Greetings, praise, the opening supplication, the closing supplication and farewell | ep46 00:00:00-00:05:00, 01:24:30 | Greetings, supplication and closing; not teaching content | Content rule | Open |
| Supplication lines naming modern conflicts, peoples and fighters | ep46 00:03:30-00:04:30 | Sweeping claims about modern conflicts and peoples | Content rule, Voice rule | Open |
| Remarks on veiled women and on the sweat of a veiled woman | ep46 00:10:00-00:10:30 | Comparison about a group of women; not needed for the point on effort | Voice rule | Open |
| The competing of people over the world, with a bribe and a son placed in a post | ep46 00:11:30 | Garbled in both passes and the passes disagree | Clarity | Open |
| Remarks on a stage dancer, on television and on the opera, and the aside on a client | ep46 00:15:30-00:17:00 | Sweeping remarks on the arts and garbled in both passes | Content rule, Clarity | Open |
| Loop of repeated syllables in the Qwen pass | ep46 00:12:30, 00:17:00 | Looping ASR in the Qwen pass; the Whisper pass gives the sense | Clarity, Loop check | Open |
| Remarks that parties in Muslim lands today are like the confederates of the trench | ep46 00:20:00-00:20:30 | Sweeping claim about modern parties and states | Content rule, Voice rule | Open |
| Domestic asides on a husband's return and a wife's smile, and a remark on a school year | ep46 00:27:00-00:28:30 | Garbled in both passes and the passes disagree | Clarity | Open |
| The comparison with a petitioner before a court head or a minister | ep46 00:33:30-00:34:00 | Garbled in both passes and the passes disagree | Clarity | Open |
| Loop of repeated words in the Qwen pass | ep46 00:35:00 | Looping ASR in the Qwen pass; the Whisper pass gives only a garbled fragment | Clarity, Loop check | Open |
| The remark that a people today still hate Islam, the Prophet and Muslims | ep46 00:36:00 | Sweeping claim about a people | Content rule, Voice rule | Open |
| Remarks on a modern alliance and a decision of 1991 on the Muslim presence in Europe, and an address to an Arab negotiator | ep46 00:36:30-00:37:30 | Sweeping claims about modern states and a modern conflict | Content rule, Voice rule | Open |
| Remarks that jihad today is by supplication only, on a modern conflict, on the sons in the mosques of a land and on a people as cowardly | ep46 00:40:00-00:41:00 | Sweeping claims about a people and a modern conflict | Content rule, Voice rule | Open |
| The remark that hypocrites are in Muslim society today and how they are known | ep46 00:41:00-00:41:30 | Sweeping claim about Muslims today | Content rule, Voice rule | Open |
| The remark on refusing the help of a polytheist against a polytheist, tied to a modern war and foreign soldiers | ep46 00:45:00-00:45:30 | Sweeping claim about a modern conflict, garbled with a loop in the Whisper pass | Content rule, Clarity, Loop check | Open |
| The trench length and its width and depth | ep46 00:46:00, 00:52:30 | The figures differ between the two passes | Clarity | Open |
| The remarks on a modern conscript and on a soldier on guard, with the loop that follows | ep46 00:49:00-00:51:00 | Garbled in both passes, with a loop in the Qwen pass | Clarity, Loop check | Open |
| The name of the man left as deputy over Medina | ep46 00:48:00 | The name rests on one garbled word in each pass and the passes disagree (see GEMINI) | Clarity | Open |
| The names of the four leaders of Ghatafan and the third blow's content | ep46 00:54:30, 01:14:30-01:15:00 | Names and details garbled in both passes and the passes disagree | Clarity | Open |
| Remarks on a man looking at a woman, on animals and on Western customs and films | ep46 00:57:00-00:59:00 | Demeaning generalisations about women, animals and peoples and garbled | Voice rule, Content rule, Clarity | Open |
| The exchange of Umar with a wife of the Prophet at night | ep46 01:01:00-01:01:30 | The name is garbled in the Qwen pass and the passes disagree | Clarity | Open |
| The remarks on the age of a wife of the Prophet and on girls and schooling | ep46 01:05:30-01:06:30 | Sweeping remarks on women, and the age differs between the two passes | Voice rule, Clarity | Open |
| The ages of Ali and of Sa'd ibn Mu'adh | ep46 01:04:00-01:04:30, 01:13:00, 01:16:00 | The ages differ between the two passes and are not recoverable | Clarity | Open |
| Loop of repeated syllables and words | ep46 01:09:00, 01:14:00, 01:16:00, 01:19:00, 01:19:30, 01:20:00, 01:22:30 | Looping ASR in the Qwen pass; the Whisper pass gives the sense where used | Clarity, Loop check | Open |
| The farewell hint at the next round with two tribes | ep46 01:24:30 | Closing; the names differ and carry no teaching | Clarity | Open |
| The saying on God and Umar's heart and tongue | ep46 01:01:30 | The key verb is garbled in both passes (see GEMINI) | Clarity | Open |
| The order and interval of the deaths of Khadija and Abu Talib | ep46 00:25:30, 00:27:00, 00:28:30 | The passes give opposite orders at 00:25:30 and 00:27:00 | Clarity | Open |
| Second ASR pass: Whisper large-v3 (mlx) run on the Mac to resolve garbled words of the Qwen transcript; cites use the shared 30-second grid | ep46 whole | Qwen pass garbled | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 47 (branch from origin/main).
GEMINI: ep46, whether the saying about seeing God's hand write the answer belongs to al-Hasan al-Basri (Qwen gives a form like al-Hasan al-Batr, Whisper like al-Hasan al-Basr), a collection of al-Hasan's sayings such as Hilyat al-Awliya
GEMINI: ep46, the full name and spelling of the horseman killed by Ali (Qwen gives a form like Amr ibn Wuth, Whisper like Amr ibn Wudd), Ibn Hisham's Sira and al-Tabari on the Trench
GEMINI: ep46, the deputy the Prophet left over Medina during the Trench (Qwen gives a form like Abdullah ibn Umm al-Mu'minin, Whisper like Abdullah ibn Umm Maktub), Ibn Hisham's Sira or al-Tabari
GEMINI: ep46, the Ghatafan leaders who negotiated with the Prophet over a third of Medina's fruits (Qwen gives a form like Amr al-Khazari, Whisper like Amr al-Fazari), Ibn Hisham's Sira on the Trench
GEMINI: ep46, the narrator and collection of the Prophet's supplication at al-Ta'if and of the angel of the mountains (00:28:30-00:34:30), Sahih al-Bukhari and Sahih Muslim, and Ibn Hisham's Sira
GEMINI: ep46, the narrator and collection of the Prophet's saying on Sa'd's jealousy and of the dream of the palace of Umar (00:59:30-01:01:30), Sahih al-Bukhari and Sahih Muslim
GEMINI: ep46, the narrator and collection of the report of the man asked whether he would be given gifts had he sat in his parents' house (00:18:30), Sahih al-Bukhari and Sahih Muslim
GEMINI: ep46, the identity of the scholar who rebuked a ruler of Egypt and called him a little mouse before his Lord (00:12:30-00:14:00), a biographical dictionary such as Siyar a'lam al-nubala
GEMINI: ep46, the narrator and wording of the Prophet's saying about God and Umar's heart and tongue (01:01:30; the verb is garbled in both passes), Sahih al-Bukhari and Sahih Muslim, Jami al-Tirmidhi

### alwaad-alhaq ep39 (14 Nov 2026)

25 points written for episode 39 (ar, en, ur); 27 needs_source marks for this episode in each language file; new about links to humility, night prayer, false testimony, the names al-Mutakabbir, al-Rahman and al-Rahim, al-Khidr and Dawud. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep39) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greeting, travel plans and the lecturer's trip abroad | ep39 00:02:00-00:03:00 | Not lesson content; private | Content rule | Open |
| Story of a sword and a strange word, and the lecturer's remarks on obscure vocabulary | ep39 00:37:30-00:40:00 | Transcript loops and is garbled, names unclear | Loop check and clarity | Open |
| Verses of poetry quoted (a friend's poem to a colleague raised to office) | ep39 00:23:30-00:24:00 | Not reproduced | Sources policy | Open |
| Hadith and saying wording | ep39 throughout (e.g. 00:04:30, 00:31:30, 00:33:00, 00:48:30, 01:05:30) | Wording not typed; by sense only | Hadith rule | Open |
| Repetition loops and garbled windows | ep39 00:04:00, 00:26:30-00:27:00, 00:38:30, 00:46:00, 00:52:00, 00:57:00, 01:02:00, 01:04:30 | Whisper loop artefacts with no recoverable content | Loop check | Open |
| Closing prayer wording and sign-off | ep39 01:11:30-01:13:00 | Not lesson content; prayer wording not reproduced | Content rule | Open |

Resume point: alwaad-alhaq episode 40 (branch from origin/main).
GEMINI: ep39, the identity, narrator and place of the story of the man of the Prophet's family who left food at the doors of the poor for forty years (the transcript gives a garbled form like Aziz al-Abidin and says Kufa; 00:42:30-00:45:00), a biographical dictionary such as Siyar a'lam al-nubala under Ali ibn al-Husayn Zayn al-Abidin
GEMINI: ep39, who is meant by the one with knowledge of the Book who offered to bring the throne (the sheikh says many commentators take him to be Sulayman himself; 00:16:00-00:17:00), a tafsir such as al-Tabari or Ibn Kathir on al-Naml verse 40
GEMINI: ep39, the source and narrator of the report that the servant is nearest his Lord in prostration, and of the report on the angels and the stars for the house of one who prays at night (00:46:30-00:48:30), Sahih Muslim and Sunan Abi Dawud
GEMINI: ep39, the count of worship verses in the Qur'an (the sheikh says about one hundred and ten, about three percent) and who computed it (00:54:30-00:55:00), a study of the structure of Qur'anic verses
### sharh-saheeh-al-bukhare ep47 (14 Nov 2026)

25 points written for episode 47 (ar, en, ur); 19 needs_source marks in each language file for this episode; 3 new `about` edges. Quran verses referenced only through passage links (24-63); none typed. Contested: His fiqh preferences (the majority view on touching women and ablution, the zakat on a wife's gold, the blessing in the final sitting), his insistence on the title sayyid, his reading of the signs of love in God, and the stories he tells (the plot against the grave and its date, the sheep's head, the five wounded men, Abu Dharr and Bilal, the letter of Muhammad ibn al-Hanafiyya, Nu'ayman, the old woman, Julaybib, Abu Ruwayha) are given as his own, without chain or reference, and are read differently by scholars. This episode is a talk on love in God and does not read a hadith of al-Bukhari. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep47) | Episode / time | Reason | Gate failed | Override |
| Greetings, praise, the opening supplication and the announcement that the sitting leaves the campaigns for another topic | ep47 00:00:00-00:01:30 | Greetings and opening, not teaching content | Content rule | Open |
| The closing farewell, the supplication and the farewell greetings, including the announcement of the next meeting | ep47 01:11:30-01:13:00 | Closing prayer and farewell, not teaching content | Content rule | Open |
| A transport anecdote about touching strangers, the attack on those who criticise scholars with the candle and the dark, and the remark on a dance and fine art | ep47 00:10:30-00:11:30, 00:13:30-00:14:30 | Garbled in both passes and partly a sweeping aside on modern people | Clarity, Voice rule | Open |
| The anecdote of a husband and wife about the wife's gold at a mosque and the price, and the sum in pounds | ep47 00:15:30-00:17:30 | Garbled in both passes and the passes disagree on the figures | Clarity | Open |
| The remark that people from Italy and their ambassadors speak Arabic well, and the framing of the visitors as enemies of Islam | ep47 00:19:30-00:20:30 | Sweeping claims about a people and a Voice rule problem, the museum does not state the judgement | Content rule, Voice rule | Open |
| The sentence on a sect sending a man to steal bodies and burn them | ep47 00:25:30-00:26:00 | Sweeping claim about a sect, garbled in both passes | Content rule, Clarity | Open |
| Loop stretch on the Prophet at the door and a joke on what Egyptians discuss at a university, a factory or a club | ep47 00:26:30-00:27:30 | A comic aside about a people and a garbled run in both passes | Voice rule, Clarity | Open |
| The vizier's name and the sums given to the people of Medina | ep47 00:23:00-00:24:00 | Passes disagree on the name and the amounts | Clarity | Open |
| The Umar and Abu Bakr anecdote at the sword and the list of wishes, and the story of two brothers who memorised the Qur'an and the ruler's question | ep47 00:47:00-00:48:30, 00:49:30-00:50:30 | Garbled and looped in both passes and the speakers cannot be recovered | Clarity, Loop check | Open |
| The loop stretches in the Qwen pass (repeated words) | ep47 00:16:00-00:16:30, 00:26:00-00:26:30, 00:30:30-00:31:00, 00:35:00-00:35:30, 00:39:00-00:39:30, 00:58:30-00:59:30, 01:02:00-01:03:30, 01:05:30-01:06:00, 01:07:00-01:07:30 | Qwen pass loops; used only where Whisper reads clearly | Clarity, Loop check | Open |
| The Julaybib narrative about a captive and the daughter of a wealthy leader, the sums paid and the dialogue about it | ep47 00:12:00-00:12:30, 01:07:30-01:10:30 | Whisper and Qwen disagree and the account cannot be recovered | Clarity | Open |
| Remarks on a person who flatters the powerful and on people at work, the Egyptians' joke about being light-hearted | ep47 00:41:30-00:43:00 | Comic asides and sweeping claims about a people | Voice rule | Open |
| Second ASR pass: Whisper large-v3 (mlx) run on the Mac to resolve garbled words of the Qwen transcript; cites use the shared 30-second grid | ep47 whole | Qwen pass garbled | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 48 (branch from origin/main).
GEMINI: ep47, the jurist who holds that a prayer is invalid without the blessing on the Prophet in the final sitting (Qwen gives "al-Imam al-Taqi", Whisper a form like "al-Sutayh"; neither names a known jurist), the fiqh books on the obligation of the blessing in the final tashahhud
GEMINI: ep47, the companion nicknamed for jokes who sold Abu Bakr's trading partner as a slave in a prank (Whisper gives "Nu'ayman", Qwen a form like "Naw' Iman") and the report that the Prophet and the Companions laughed at it for a year, the source of the Nu'ayman stories in the books of Companions' biographies
GEMINI: ep47, Julaybib's marriage and the family of the woman (Whisper links a daughter of al-Ala' ibn al-Hadrami and a captive, Qwen is garbled), Musnad Ahmad and Sahih Muslim on Julaybib
GEMINI: ep47, the report of Abu Ruwayha al-Khath'ami paired with Bilal and Bilal's frank introduction before a Yemeni tribe (Qwen also names Abu Hurayra), the source of the report
GEMINI: ep47, the story of two men from Rome and Nur al-Din's dream with the lead around the grave (he dates it 557 AH; Whisper and Qwen disagree on how many times the dream came and on the sum he gave out), the early historians of Medina such as al-Samhudi
GEMINI: ep47, the third Companion at the Prophet's door with Abu Bakr and Umar and the three qualities of goodness the Prophet names (Qwen and Whisper garble the third quality and the third speaker), the hadith on completing goodness by hastening, belittling and concealing it

### alwaad-alhaq ep40 (14 Nov 2026)

19 points written for episode 40 (ar, en, ur); 20 needs_source marks for this episode in each language file; edges added to the seeing of God, riba, the major sins, the Sirat and Paradise. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep40) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repeated phrase of praise filling the opening stretch | ep40 00:01:30-00:02:00 | Qwen loop, no content | Clarity | Open |
| Gold and silver adornment passage and the verse-like asides on the nadira faces | ep40 00:06:30-00:08:00 | Garbled in the transcript, cannot be followed | Clarity | Open |
| Poetry fragments on the eagle and the crow | ep40 00:19:30-00:20:30 | Garbled, tangential poem not verifiable | Clarity | Open |
| Digression on a family quarrel and the dead parents | ep40 00:20:00-00:20:30 | Garbled aside without a checkable claim | Clarity | Open |
| The sheikh's remark on a verse about calling people by their fathers | ep40 00:41:30-00:42:30 | Transcript garbled, verse not identifiable | Clarity | Open |
| Dialogue on the bank, rates and deposits at its full length | ep40 00:48:00-00:49:30 | Garbled and tangential; only the general application and the illustrative figures kept | Clarity | Open |
| The man with the statue and the portrait of the Khedive and other worldly comparisons | ep40 00:56:30-00:57:30 | Garbled comic aside, kept in one sentence | Clarity | Open |
| Discussion of television, time and the screen | ep40 01:04:30-01:06:00 | Garbled and conversational, kept in one sentence | Clarity | Open |
| Closing supplication and the poem on the world | ep40 01:10:00-01:11:30 | Prayer text garbled and poem unverifiable | Clarity | Open |
| Transcript repeat of the opening verses at the end | ep40 01:11:30-01:12:00 | Repetition of the opening verses | Clarity | Open |

Resume point: alwaad-alhaq episode 41 (branch from origin/main).
GEMINI: ep40, the narrator and book of the report that God asks the people of Paradise whether they want more and then lifts the veil (the sheikh gives Abu Hurayra and Sahih Muslim; Qwen is garbled; the wording matches the Suhayb report in Sahih Muslim, to be verified against the book).
GEMINI: ep40, the name of the speaker of "the most intelligent of people leaves the world before it leaves him" (the transcript says Abu Hazim, no book; which Abu Hazim, and the source).
GEMINI: ep40, the place of Adam in the report of the night of the ascent (the transcript says the sixth heaven, the usual report places him in the first heaven; Qwen garbled).
### sharh-saheeh-al-bukhare ep48 (14 Nov 2026)

24 points written for episode 48 (ar, en, ur); 17 needs_source marks in each language file for this episode; 7 new `about` edges. Quran verses referenced only through passage links (62-5, 7-175, 7-176, 7-143, 5-67); none typed. Contested: His reading that the Torah as it stands was altered, his reading of ighlaq in the divorce saying as anger, and his presentation of the Companions' disputes and of the Jews of Medina are his own views and are contested; Jewish and Muslim views on alteration of the Torah differ. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep48) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Greetings, opening supplication, break joins, closing greetings and messages from brothers abroad | ep48 00:00:00-00:02:30 and 01:17:30-01:18:00 | Not substantive | Content rule | Open |
| Sweeping claims about the Jews as a people (usury, world finance figures, treatment of others, their habits, the Protocols material and alleged plans) | ep48 00:20:30-00:22:00, 00:43:30-00:46:00 and 01:09:00-01:15:30 | Demeaning generalisations about a people and conspiracy claims | Content rule | Open |
| The hadith of the stone and tree applied to a modern state and its trees, and remarks on modern military power | ep48 00:21:30-00:22:30 | Sweeping claim about modern conflict | Content rule | Open |
| Stretch on youth accused of extremism and a modern war reference | ep48 00:10:30-00:10:40 and 00:15:30-00:16:30 | Sweeping claim about modern conflict; a stretch dropped under the content-safety block | Content rule | Open |
| Remarks on women and dress in past decades and on who follows the Antichrist | ep48 00:08:30-00:09:30 and 01:04:30-01:06:30 | Generalisations about women | Voice rule | Open |
| Looped or garbled stretches (loops of one word, scrambled sentences) | ep48 00:09:00-00:09:30, 00:16:00-00:16:30, 00:18:30-00:19:30, 00:33:00-00:36:30, 00:39:30-00:40:00, 00:42:00-00:42:30, 00:47:00-00:47:30, 00:57:30-00:59:30, 01:00:00-01:00:30, 01:03:00-01:03:30, 01:05:00-01:05:30, 01:08:30-01:09:00 | Too garbled to recover in both passes | Clarity, Loop check | Open |
| Stories too garbled to state (the two scholars in the desert, Ali and the weight on the shoulder, the plot at the wall, the Moses and Shu'ayb and Solomon remarks, the percentage figures on youth) | ep48 00:13:30-00:14:30, 00:35:00-00:36:30, 00:50:00-00:51:30, 00:57:30-00:58:30, 01:08:00-01:09:00 | Names and details differ or are unclear between the Qwen and Whisper passes | Clarity | Open |
| Second ASR pass: Whisper large-v3 (mlx) run on the Mac to resolve garbled words of the Qwen transcript; cites use the shared 30-second grid | ep48 whole | Qwen pass garbled | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 49 (branch from origin/main).
GEMINI: ep48, which collection and narrator carry the report of Moses reading the tablets and asking to be of the community of Ahmad with eleven qualities, the Qwen and Whisper passes both give it at 00:28:30-00:30:00 without a source, a classical hadith collection or tafsir of the verses of al-A'raf 7:154 to 7:157
GEMINI: ep48, which report gives the Prophet's order to the Companions about the market of Medina and the story of Umar's conversion with his sister, both passes give them at 00:03:30-00:04:30 and 00:11:30-00:13:30 without a chain, a sira source such as Ibn Hisham or a hadith collection

### sharh-saheeh-al-bukhare ep49 (14 Nov 2026)

26 points written for episode 49 (ar, en, ur); 22 needs_source marks in each language file for this episode; 3 new `about` edges. Quran verses referenced only through passage links (9-80, 9-84, 27-40); none typed. Contested: His readings of the lessons of Khaybar, of retirement as preparation for meeting God, of Umar and the Prophet as student and teacher, and his advice on not wishing to have lived in the Prophet's time are his own views; the sayings, stories and figures he relates by sense carry no chain. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep49) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening praise and greetings, opening prayer, series announcement | ep49 00:00:00-00:00:30 | Greetings and prayer | Clarity | Open |
| Asides on the wording of retirement and daily bread, loops | ep49 00:04:00-00:05:30 | Garbled, loops | Clarity, Loop check | Open |
| Remarks on ranking livelihood and others' opinions, garbled digression | ep49 00:06:30-00:07:00 | Too garbled to recover | Clarity | Open |
| Garbled aside on the saying about the nations and the dish, loops | ep49 00:11:00-00:12:00 | Garbled, loops | Clarity, Loop check | Open |
| Number of the hypocrites, name of the entrusted Companion | ep49 00:13:30-00:14:30 | The two passes give 14 and 17 and a garbled name | Clarity | Open |
| Umar's supplication on strength, loops | ep49 00:16:00-00:17:00 | Garbled, repeated words | Clarity, Loop check | Open |
| Remarks on a modern political leader and a modern official, garbled | ep49 00:18:30-00:19:30 | Sweeping remarks on modern politics, garbled | Voice rule / Clarity | Open |
| Loop of repeated phrases and closing supplication of the first part | ep49 00:21:30-00:22:00 | Loops, prayer | Clarity, Loop check | Open |
| Distance to Khaybar and size of the army | ep49 00:22:00-00:22:30 | Figures differ between the two passes | Clarity | Open |
| Claims about how Jews act wherever they settle, about money, aid and banks, and a modern comparison | ep49 00:25:30-00:27:00 | Sweeping claims about a people and about modern affairs | Voice rule | Open |
| Anecdotes, football, spying and cleverness, remarks on orientalists, garbled | ep49 00:29:00-00:32:30 | Sweeping claims about a people, garbled | Voice rule / Clarity, Loop check | Open |
| Story of a wolf and a lamb with a poem, garbled | ep49 00:32:30-00:34:30 | Too garbled to recover | Clarity | Open |
| Lesson on dealing with others from strength or weakness, a modern war and a modern movement, a fort and a king, garbled | ep49 00:35:30-00:38:30 | Sweeping claims about a people, modern conflict, garbled | Voice rule / Content rule / Clarity | Open |
| Stay-behind negotiation details, a poem about birds and a tree, garbled | ep49 00:40:00-00:41:30 | Garbled, names unreliable | Clarity | Open |
| Prayer about heat and cold and a saying on Ali, garbled | ep49 00:42:30-00:43:30 | Subject and wording unclear in both passes | Clarity | Open |
| Loop and garbled march details | ep49 00:44:30-00:45:30 | Loops | Clarity, Loop check | Open |
| Ghatafan negotiation and a champion's challenge, garbled | ep49 00:47:30-00:50:30 | Names and sequence unreliable | Clarity | Open |
| Names of the Ansar leaders and reasons for refusing peace, garbled | ep49 00:50:30-00:51:30 | Names rest on single garbled words | Clarity | Open |
| Loops and garbled stretch | ep49 00:51:30-00:53:30 | Loops, garbled | Clarity, Loop check | Open |
| Sermon on causes and reliance on God, garbled | ep49 00:56:30-00:59:00 | Too garbled to recover | Clarity | Open |
| Story of a man with one good deed, loops | ep49 01:00:00-01:05:00 | Garbled, loops | Clarity, Loop check | Open |
| Gate of the fort and the call to Ali, loops | ep49 01:05:00-01:08:30 | Garbled, names unreliable | Clarity, Loop check | Open |
| Break join, schedule announcement and closing | ep49 01:08:30-01:09:30 | Greetings and closing remarks | Clarity | Open |
| General remarks on Muslims' conditions, loops, closing prayer | ep49 01:09:30-01:14:30 | Garbled, loops, closing prayer | Clarity, Loop check | Open |
| Second ASR pass: Whisper large-v3 (mlx) run on the Mac to resolve garbled words of the Qwen transcript; cites use the shared 30-second grid | ep49 whole | Qwen pass garbled | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 50 (branch from origin/main).
GEMINI: ep49, identity of the hypocrite whose funeral prayer Umar objected to and the surrounding exchange, transcript says a name like "Abdullah ibn Ubayy" (second pass "Abdullah ibn Ubayd"; first pass puts Ibn Umar at 00:08:00), Sahih al-Bukhari and Muslim on the funeral prayer for Abdullah ibn Ubayy and the verses that followed
GEMINI: ep49, which Companion was entrusted with the names of the hypocrites and how many they were, transcript says "Hudhayfa"-like name garbled and the number as 14 (first pass) or 17 (second pass), Sahih Muslim and Sahih al-Bukhari on the Hudhayfa hadiths about the hypocrites
GEMINI: ep49, distance from Medina to Khaybar and size of the Muslim army, transcript says 135 km (first pass) or 153 km (second pass) and 1300 or an unclear figure, Ibn Hajar Fath al-Bari and Ibn Hisham on the march to Khaybar
GEMINI: ep49, the three leaders or the second leader of the exiled tribes at Khaybar besides Huyayy ibn Akhtab and the third exiled tribe, transcript garbled (Banu Qaynuqa, Banu al-Nadir and a third name), Ibn Ishaq and al-Tabari on the exile of the tribes
### alwaad-alhaq ep41 (14 Nov 2026)

18 points written for episode 41 (ar, en, ur); 19 needs_source marks for this episode in each language file; three new about edges (niyya, ikhlas, tajdid), series record extended to episodes 1-41. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep41) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Thanks, greetings, praise and supplications of host and sheikh | ep41 00:03:30–00:06:00, 00:53:30–00:56:00 | Not lesson content; summarised by sense only | Content rule | Open |
| Repetition loops and garbled windows | ep41 00:19:00–00:20:00, 00:22:00, 00:29:00, 00:41:30–00:42:00, 00:59:30 | Not speech or unclear; only the clear sense is summarised | Loop check and clarity | Open |
| Poetry quoted (two sets of Arabic verses) | ep41 00:16:00, 00:58:00–00:58:30 | Not reproduced; second set attributed to Abu Nuwas by the host only | Sources policy | Open |
| Personal and family details of living people and viewers' call-in arrangements | ep41 00:45:30–00:46:30, 00:57:00–00:58:00 | Kept general; no names or numbers recorded | Privacy | Open |
| Contested statements of the sheikh (view of the four imams' fiqh, the story of Abu Hanifa's father, claims on al-Ghazali, Ibn Taymiyya) | ep41 00:27:00–00:37:00 | Recorded as his view with needs_source marks, not as rulings | Opinion rulings (founder-held) | Open |

Resume point: alwaad-alhaq episode 42 (branch from origin/main).
GEMINI: ep41, the channel and the director: the host thanks Sharjah Television and its satellite channel while the series record says the Al-Sharq channel, and the director's name is garbled (Khidr Abd al-Nitam, later Khidr Abd al-Mutallab); the source that would settle it is the programme's own credits or the channel's page.
GEMINI: ep41, names of the sheikh's teachers and colleagues in the garbled transcript at 00:09:30-00:23:30 (Abd al-Fattah Abu Zayd, Ahmad Makhluf, Mahmud, Muhammad Nayil, Mahmud Hamaya, Jamal Abd al-Aziz, Abd al-Hamid Farmawi); the source that would settle it is an interview or biography of Omar Abdelkafy.
GEMINI: ep41, the report of a devout man who missed no first takbir for fifty years, which the transcript gives to Sa'id ibn al-Musayyib or al-Bukhari at 00:36:30-00:37:30; the source that would settle it is the biographical dictionaries (Siyar a'lam al-nubala').
GEMINI: ep41, whether the verses ending the episode (at 00:58:00-00:58:30, a servant admitting sin and taking refuge in God's pardon) are by Abu Nuwas as the host says; the source that would settle it is the diwan of Abu Nuwas.

### alwaad-alhaq ep42 (14 Nov 2026)

21 points written for episode 42 (ar, en, ur); 14 needs_source marks for this episode in each language file; series record extended to episodes 1-42 with edges for the Mahdi, repentance, trial, the houris, fear, stoning, the pilgrimage rulings, the beautiful names, Mina, Hamza and Ata ibn Abi Rabah. Quran verses only as passage links. The sheikh's rulings and opinions are recorded as his view, not as rulings (founder-held: opinion rulings).

| Excluded (alwaad-alhaq ep42) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Sponsor advertisements, breaks, greetings, supplications and long looped thanks | ep42 00:03:30-00:07:30 and 01:03:00-01:05:30 | Not lesson content; summarised by sense only | Content rule | Open |
| Sweeping claim about the Arabs as a people (disorderly, spontaneous, emotional, lacking continuity) and about wives seeing husbands as piles of faults | ep42 00:29:30-00:31:30 | Generalisations about peoples and women | Voice rule | Open |
| Fiqh and personal questions from callers not answered in the transcript (early departure from Arafa, funds held for a shop owner, a dream of a deceased father, a woman's jihad as asked, an invention for the community) | ep42 00:23:00, 00:37:30-00:38:30, 00:40:00, 00:56:30-00:57:30 | No answer from the sheikh in this transcript; the host also redirects fiqh questions to other programmes | Content rule | Open |
| Callers' personal details, numbers and the request to contact a named media figure | ep42 00:21:30-00:22:30, 00:58:00-00:58:30 | Privacy; kept general | Privacy | Open |
| Looped or garbled stretches (loops of one phrase, scrambled sentences) | ep42 00:03:00-00:03:30, 00:06:00-00:07:00, 00:24:00-00:24:30, 00:43:30, 01:12:00-01:12:30 | Too garbled to recover | Clarity, Loop check | Open |
| Contested statements of the sheikh (stoning before noon at Mina, the Mahdi, the seventy-two houris as handmaids, trial as a mark of status) | ep42 00:07:30-00:18:30, 00:32:00-00:33:00, 01:09:30-01:10:30 | Recorded as his view with needs_source marks, not as rulings | Opinion rulings (founder-held) | Open |

Resume point: alwaad-alhaq episode 43 (branch from origin/main).
GEMINI: ep42, the name of the stand-in director at 00:04:30 (appears as Mustafa Zazu; the usual director is Khidr Abd al-Mutallab); the source that would settle it is the programme's own credits or the channel's page.
GEMINI: ep42, the identity of the woman and son in the report at 00:18:00-00:18:30 (the mother who asks if her son killed in a battle is in Paradise and is told he is in the highest Paradise); the source that would settle it is Sahih al-Bukhari, the report of the mother of Haritha ibn Suraqa.
GEMINI: ep42, the report of the father and son at 01:07:00-01:07:30 (the son asks why people weep at the father's words, not at others'; names garbled, appears as Umar ibn Abi Dharr); the source that would settle it is the biographical dictionaries (Siyar a'lam al-nubala', Hilyat al-awliya').
GEMINI: ep42, the year of the crush at Mina referred to at 00:10:30-00:18:30 and 00:16:00 ("yesterday"); the source that would settle it is dated news reports of the pilgrimage.
PROPOSAL (ep41 title): the ep41 prose is headed "the final episode" (ar: الحلقة الختامية) because the host says in the transcript at 00:00:00-00:03:00 that this should be the last episode and that endings are painful; but the same transcript ends with the host announcing that the next episode (Monday) is on the description of the Prophet and that two further episodes are for calls, and ep42, ep43 and ep44 transcripts exist (ep43 ends "the last episodes of the programme"; ep42 is a call-in episode and not a finale). Proposed for the founder: retitle the ep41 heading in ar, en and ur to "the closing lecture episode" and drop "the final episode" and "the last episode" in its first point; not changed here because it is a published prose edit outside this episode's scope.
### sharh-saheeh-al-bukhare ep50 (14 Nov 2026)

27 points written for episode 50 (ar, en, ur); 24 needs_source marks in each language file for this episode; 10 new `about` edges. Quran verses referenced only through passage links (2-245, 28-68); none typed. Contested: His workplace advice on dealings between colleagues of different sexes, his reading of the Companions' ranks, and his applications of stories (Khalid at the river, the donkeys, paradise barred to the disobedient) are his own views, as are the troop and casualty figures he gives without a source. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep50) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, long supplication and repeated dhikr loop | ep50 00:00:00-00:04:30 | greetings, prayer and a loop of repeated words | Clarity, Loop check | Open |
| Closing advice to trust God and final greeting | ep50 01:14:30-01:15:00 | closing prayer and greeting | Clarity | Open |
| Wife-and-relative remark about being sent to hell, and the poem of the angel at the gate of heaven with the man who died in a plane, at sea and over a rose | ep50 00:10:30-00:11:00 and 00:17:30-00:21:30 | story and verse too garbled in both passes to restate without invention | Clarity | Open |
| Remarks on the Muslims of India and Hindus, with casualty claims | ep50 00:56:00-00:57:30 | sweeping claim about a modern conflict between communities | Content rule | Open |
| Remarks on earthquakes, seismic waves and the earth's orbit | ep50 00:57:30-00:58:30 | garbled and not clearly supported by both passes | Clarity | Open |
| The joke about a groom, a salary and seven children | ep50 00:52:00-00:52:30 | garbled anecdote, only its moral kept | Clarity | Open |
| Names of the Companion who ate the poisoned sheep, the Jewish woman, and the scout commander | ep50 00:47:30-00:48:00 and 00:59:30-01:02:00 | names rest on single garbled words | Clarity | Open |
| Loops and repeated-syllable stretches | ep50 00:03:30-00:04:00, 00:05:30, 00:07:00, 00:09:30, 00:10:00, 00:11:00, 00:14:30, 00:17:30-00:18:00, 00:20:00-00:20:30, 00:21:00, 00:23:00, 00:55:00-00:56:00, 01:01:30, 01:04:30, 01:07:30, 01:11:30 | repeated tokens or syllables in the first pass | Loop check | Open |
| Hunger of the tribe of Aslam, the Prophet and Umar's women-in-the-house exchange | ep50 00:30:30-00:31:00 and 01:11:00-01:11:30 | garbled in both passes | Clarity | Open |
| Second ASR pass: Whisper large-v3 (mlx) run on the Mac to resolve garbled words of the Qwen transcript; cites use the shared 30-second grid | ep50 whole | Qwen pass garbled | Clarity | Open |
| The number of parts of the book Relief after Hardship | ep50 00:53:30 | number rests on one garbled phrase in one pass | Clarity | Open |
| The animal Abu Jahl said he saw behind the Prophet | ep50 01:14:30 | garbled in both passes | Clarity | Open |
| The list of what God chooses the time of (illness and wealth) and the exact contrast in the point on mutual dealing | ep50 00:55:30 and 01:04:30 | garbled or different in the two passes | Clarity | Open |
| Description of the dabbaba as a covered wheeled ram, and the reason people change in the Muhammad ibn Maslama passage | ep50 00:38:30 and 00:41:00 | not stated clearly in either pass | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 51 (branch from origin/main).
GEMINI: ep50, who is the author of the book Relief after Hardship (al-Faraj ba'd al-shidda) in five parts that he recommends, he names an author in garbled form (al-Sulukiyy / al-Suluk) in both passes, a library catalogue entry or the book's printed title page
GEMINI: ep50, which scout commander confirmed the Jewish informant's claim about the water of the fort, the second pass has a name that may be Sa'd ibn Abi Waqqas but the first pass has only a garbled word, a primary Sira source (Ibn Ishaq or al-Waqidi) on the fort of Khaybar's water
GEMINI: ep50, the name of the Companion who ate the poisoned sheep and the name of the Jewish woman, both passes garble them (Abdallah ibn Abi Salama / al-Jabi; Zaynab appears in a garbled stretch), the Sahih and Sira accounts of the poisoned sheep at Khaybar
GEMINI: ep50, the name of the Qurayshi orator and chief negotiator whom Umar wished to silence, the first pass has Said ibn Amir and the second Suhayl and ibn Amr in garbled form, a Sira source on the captives of Badr and the speech in Mecca after the Prophet's death
GEMINI: ep50, which great expedition the Prophet began preparing for after Khaybar, the first pass says Nabk or Tabuk and the second says the opening of Mecca, both garbled, the episode's closing remark and a Sira chronology
GEMINI: ep50, what Abu Jahl said he saw behind the Prophet when he paid the Qurayshi man for his camel, both passes garble it, the Sira of Ibn Ishaq on Abu Jahl and the man of Irash

### sharh-saheeh-al-bukhare ep51 (14 Nov 2026)

26 points written for episode 51 (ar, en, ur); 46 needs_source marks in each language file for this episode; 4 new `about` edges. Quran verses referenced only through passage links (15-6, 83-29, 4-65, 33-36); none typed. Contested: His readings of patience, mercy and the Hudaybiyya clauses, the figures he gives (eighty-four believers, twenty-two months, twenty-five dead, fighters and horsemen) and his stories without a chain (Moses and the field, the lion, the mat, the letter) are his own account or unsourced. Checked line by line against the transcript by a second reader before merge.

| Excluded (sharh-saheeh-al-bukhare ep51) | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Opening greetings, long supplication and repeated words | ep51 00:00:00-00:02:30 | greetings and prayer, with a loop of repeated words in the first pass | Clarity, Loop check | Open |
| Closing greeting and farewell | ep51 01:20:00-01:20:30 | closing prayer and greeting | Clarity | Open |
| Remarks on a woman's work outside the home and how a husband should speak to his wife, and the claim about a devil in the home influencing children | ep51 00:25:00-00:28:00 | sweeping remarks about women and households, garbled in both passes | Voice rule, Clarity | Open |
| Stories on lowering the gaze and a Companion looking at a woman, with repeated loops | ep51 00:22:00-00:24:30 | too garbled in both passes to restate without invention and a loop in the first pass | Clarity, Loop check | Open |
| Remarks on verses and a hadith about those who will not smell paradise and an edited recording | ep51 00:52:30-00:54:00 | garbled and not clearly supported by both passes | Clarity | Open |
| The story of the camels bought on credit for the detachment and an objection by Umar | ep51 01:17:30-01:19:30 | names and details rest on single garbled words and loops | Clarity, Loop check | Open |
| Stretches of repeated words and loops | ep51 00:01:00, 00:23:30-00:24:00, 00:32:30, 00:33:00, 00:34:30, 00:39:00-00:40:00, 00:41:00, 00:44:30, 00:49:00, 00:56:00-00:57:00, 01:01:00, 01:05:00, 01:07:30, 01:12:00-01:12:30, 01:16:00, 01:18:00, 01:19:00-01:19:30 | loops of one repeated word in the first pass or garbled text in the second | Clarity, Loop check | Open |
| Names of the son of Abu Lahab, Abu Bakr's reply to Abu Sufyan, the intercessor and the adviser, the sender of the letter, Amr ibn Salim | ep51 00:47:30-00:48:30, 01:03:00, 01:04:30, 01:06:00, 01:14:00-01:15:30, 00:56:00-00:57:00 | names rest on single garbled words | Clarity | Open |
| Second ASR pass: Whisper large-v3 (mlx) run on the Mac to resolve garbled words of the Qwen transcript; cites use the shared 30-second grid | ep51 whole | Qwen pass garbled | Clarity | Open |
| Name of the tribe in the Prophet's alliance, the man who asked Aisha, the Umar link on the remark about the clause | ep51 00:33:30-00:34:00, 01:07:30-01:08:30, 00:54:00-00:54:30 | names rest on single garbled words or are not stated at that point | Clarity | Open |

Resume point: sharh-saheeh-al-bukhare episode 52 (branch from origin/main).
GEMINI: ep51, who is the son of Abu Lahab killed by the lion on the Syria road (a name that may be Utba) and which daughter of the Prophet he was married to, the first pass has a garbled name and the second pass has Utba in garbled form, a Sira source (Ibn Ishaq, al-Waqidi) on Abu Lahab's sons
GEMINI: ep51, who is the Mu'awiya who recited the line about death's claws on his deathbed and who visited him (an Ibn Abdullah or Ibn Abbas), both passes garble the names, a source on Mu'awiya ibn Abi Sufyan's final illness
GEMINI: ep51, the name of the man who carried the Quraysh letter and the woman who bore it, both passes garble them (Hatib ibn Abi Balta'a is the likely name), the Sahih accounts of the story of Hatib in the conquest of Mecca
GEMINI: ep51, which daughter of the Prophet Abu Sufyan asked to intercede with her father and who advised him to proclaim protection, both passes garble the names, a Sira source on Abu Sufyan's embassy to Medina
GEMINI: ep51, whether the detachment sent under Abu Ubayda ibn al-Jarrah to the Red Sea shore is the Khabt expedition and the story of the debt for camels that follows, the second pass has Khabt and Qays ibn Sa'd in garbled form, a Sira source on the expedition
GEMINI: ep51, the exact wording and speaker of the verse about the crying out of Khuza'a (the man's name may be Amr ibn Salim) and the tribe that attacked Khuza'a, both passes garble them, a Sira source on the breach of the Hudaybiyya treaty
GEMINI: ep51, who asked Aisha whether she knew the Prophet's intention before the march (Abu Bakr is likely) and which tribe entered the Prophet's alliance in the Hudaybiyya clauses (Khuza'a is likely), the first pass has no name and the second pass has garbled words, a Sira source on the Hudaybiyya clauses and on the preparations for the conquest of Mecca
