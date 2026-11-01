# Lane `omar-abdelkafy`: progress

Lane document: [`docs/agents/lanes/omar-abdelkafy.md`](../agents/lanes/omar-abdelkafy.md). Method: [`docs/agents/audio-video-harvest.md`](../agents/audio-video-harvest.md).

## Next step

Commit batch 2 (`al-fawzu-al-moubeen`, run `omar-abdelkafy-al-fawzu-1`, 25 Oct 2026): 25 new records and 13 extended records, all checked (cite-check 38 of 38 pass; `npm run validate` 0 errors). Split into commits of at most 25 entities each if the coordinator prefers. Then the next series in the queue: `sharh-ketab-al-fawaed`. Open translation item: `concept/time-as-resource` has no `en` or `ur` file.

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

### Batch log

- Batch H1 (run `omar-abdelkafy-sharh-al-hekam-1`): series record `work/sharh-al-hekam-al-ataeya` (book_studied `work/hikam-al-ataiyya`, about edges to every record written from it) with sections for episodes 1–4. Decision: the maxims are given by their sense, not quoted, because the transcript of the recited maxim is not exact; the archive slug names the record.
- Batch H2 (run `omar-abdelkafy-sharh-al-hekam-2`): episodes 5–6; 17 records extended; series record sections 5–6. Decision: the episode that opens with a prayer for Sheikh Ahmed Yassin is recorded as recorded after 22 March 2004 (an inference, marked as such).
- Batch H3 (run `omar-abdelkafy-sharh-al-hekam-3`): episodes 7–9; 19 records extended. Note: `person/usayd-ibn-hudayr` and `person/tufayl-ibn-amr-al-dawsi` fail cite-check on pre-existing missing provenance (records from earlier lanes, left untouched apart from the appended cited section).
- Batch H4 (run `omar-abdelkafy-sharh-al-hekam-4`): episodes 10–13; 15 records extended; series record marked `sensitivity: contested`.
- Batch H5 (run `omar-abdelkafy-sharh-al-hekam-5`): episodes 14–17; 12 records extended. Series `sharh-al-hekam-al-ataeya` complete (17 of 17). Decision: the episode remarks on «the worlds of 2004» (ep15) and the prayer for Ahmed Yassin (ep05) are recorded as dating evidence for the lessons, not as a recording date.
