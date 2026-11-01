# Lane `omar-abdelkafy`: progress

Lane document: [`docs/agents/lanes/omar-abdelkafy.md`](../agents/lanes/omar-abdelkafy.md). Method: [`docs/agents/audio-video-harvest.md`](../agents/audio-video-harvest.md).

## Next step

(Updated 1 Nov 2026, overnight run by Claude Code, claude-opus-5-5.) The Khutab and Durus Explorer now lists every series of this lane that has been written: `work/al-fawzu-al-moubeen`, `work/al-hoquq`, `work/tafsir-al-quran-al-qareem`, `work/aadau-al-islam`, `work/sharh-ketab-al-fawaed`, `work/al-naba-al-safi`, `work/al-dinu-al-qayem` (kind `lecture-series`, `delivered.by` and `authors` → `person/omar-abdelkafy`, `about` edges to every record that cites the series), beside the khutab-durus lane's `work/silsilat-qissa-wa-ebra`. Next: `silsilat-qissa-wa-ebra` from episode 4 (episodes 1–3 were written by the khutab-durus lane), then the remaining transcribed series in the order of `scripts/harvest/audio/resume_queues.sh` MAIN_SERIES (`sharh-al-hekam-al-ataeya`, `nafahat-ramadaneya-1436-h`, `al-manjeyat`, `wa-nafsun-ma-sawaha`, `tariq-al-noor`, `bustan-el-amal`, `al-dar-al-akhera`, `silsilat-ebadu-al-rahman`, `muktatafat-mena-al-seera`, `albuyout-alamena`), then `sharh-saheeh-al-bukhare`, then the video series. Open translation item: `concept/time-as-resource` has no `en` or `ur` file.

Series written before this run but not logged here until now (found by grepping the cite anchors, 1 Nov 2026): `sharh-ketab-al-fawaed` (run `omar-abdelkafy-sharh-ketab-1`, commit b43f0060de: 15 new, 28 extended; anchors from episodes 1–6 and 9 only, so episodes 7, 8 and 10 have no written window), `al-dinu-al-qayem` (commit 4ff1005060: 11 new, 78 extended; all 13 episodes), `al-naba-al-safi` (commit 1132c4262d: 13 new, 41 extended; all 24 episodes).

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

- Explorer backfill (1 Nov 2026, run `omar-abdelkafy-explorer-backfill-1`, Claude Code claude-opus-5-5): 7 new `work` records of kind `lecture-series` with ar/en/ur prose (summary cited to the archive's series index and to the episode anchors where the speaker introduces the series; then a per-episode list of the museum records written from the series, each with the record's first anchor in that series). `about` edges: al-fawzu-al-moubeen 37, al-hoquq 17, tafsir-al-quran-al-qareem 136 (with passage/quran-78-1 and 79-1), aadau-al-islam 15 (`sensitivity: contested`: the title and its judgements are the speaker's), sharh-ketab-al-fawaed 43 (`book_studied: work/al-fawaid-ibn-qayyim`), al-naba-al-safi 54, al-dinu-al-qayem 88. No transcript content was newly written in this batch; nothing excluded. Decision taken without the founder (overnight authority): series records are named by the archive slug, as `work/silsilat-qissa-wa-ebra` is; the per-episode lists are derived from the existing records' anchors, not re-read from the transcripts.

- Batch 0 (25 Oct 2026, commit on branch `claude/harvest-omar-abdel-kafi-content-81375c`): method document, scripts, lane document, source entity, registry and engineering-doc updates; person record `person/omar-abdelkafy` enriched in ar, en and ur with the archive's biography conflict (birth 1951 against 1952) and the archive's list of 25 series (622 lessons) under `source/assabile-omar-abdelkafy`. Sources: the archive's own pages (biography, series index), not transcripts. Checks: `npm run validate` 0 errors, `npm test` 13 of 13 files pass, `npm run cite-check -- person/omar-abdelkafy` pass, `npm run coverage` regenerated.
- Pilot transcripts (outside git): `aadau-al-islam` episodes 1–4, large-v3, about 13 times real time. Used for no prose yet.
- Batch 1, include-all run (25 Oct 2026, run `omar-abdelkafy-include-all-1`; not yet committed, coordinator commits): new `concept/qanaa`, `concept/qalb-salim`, `practice/adab-al-akl`; extended `concept/huquq-al-zawjayn`, `concept/huquq-al-walidayn`, `concept/huquq-al-abna`, `concept/nifaq`, `concept/hijab`, `concept/hudud-penalties`, `concept/ihtikar`, `concept/ilm`, `practice/tahnik`, `practice/aqiqa`, `person/omar-abdelkafy` (figures list). 46 new windows cited (210 distinct now, from 164). Contested records tagged `sensitivity: contested`: huquq-al-zawjayn, huquq-al-walidayn, hijab, hudud-penalties, practice/aqiqa. Founder-listed figures kept with `needs_source`: ep05 00:08:00–00:08:30 (the transcript there speaks of circumcision, not an aqiqa at advanced age; the dental claim is needs_source), ep03 00:16:30, 00:17:30, 00:37:00–00:37:30 (1920, 1930, 180 dollars, 73 million dollars), ep05 00:38:30 (74%, unnamed study), ep02 00:37:00 and ep01 00:29:30 (Qur'an references not named by the speaker, not linked). Checks: `npm run cite-check` 14 of 14 pass; `npm run validate` 0 errors; `npm run coverage` regenerated.
- Batch 2 (25 Oct 2026, run `omar-abdelkafy-al-fawzu-1`; not yet committed, coordinator commits): series `al-fawzu-al-moubeen`, 14 episodes. Readers wrote notes per episode (672 content rows, 198 exclusion ranges, every verification phrase found in its window). New records (25): concept/al-fawz-al-mubin, concept/al-khusr, concept/tadabbur-al-quran, concept/al-qiraa-wal-thaqafa, concept/al-indimaj-wal-huwiyya, concept/huquq-wal-wajibat, concept/bay-al-nafs-wal-mal-ila-allah, concept/adl-wal-fadl, concept/tafaul, concept/sharh-al-sadr, concept/mahabbat-al-nabi-lil-kawn, concept/kitman-al-sirr, concept/ayat-al-insan, concept/kazm-al-ghayz, concept/ilf-al-rafahiya, concept/himmat-al-nafs, concept/sunnat-al-ihlak, concept/ahwal-al-mumin, concept/wada-allah, concept/kitab-al-amal, concept/fana-al-dunya, practice/kafalat-al-yatim, practice/ikram-al-dayf, person/umm-musa, person/firawn. Extended (appended sections): person/ibrahim, concept/sabr, concept/shukr, person/umar-ibn-al-khattab, concept/qalb-salim, concept/amanah, concept/time-as-resource (Arabic only), concept/jiwar, concept/iqra, person/al-hasan-al-basri, concept/al-sidq-truthfulness, concept/al-rizq-al-rububi, person/omar-abdelkafy. Checks: cite-check 38 of 38 pass; honorific scan clean; passage links resolve; `npm run validate` 0 errors (one warning: `data/_stubs.d/quran-mentions.yaml` still lists `person/firawn` as a stub; remove that line in its own lane). Caution: episodes 13 and 14 are very noisy; claims from them are the most fragile and several are flagged needs_source; the coordinator may want a listen-check at the anchors. Excluded items: `docs/delegation/omar-abdelkafy-excluded-al-fawzu.md`.
