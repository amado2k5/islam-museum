# Lane `assabile-egypt`: progress

Lane document: [`docs/agents/lanes/assabile-egypt.md`](../agents/lanes/assabile-egypt.md).

## Next step

Ragheb El-Sergani, `what-did-muslims-bring-to-the-world` (15 video episodes), once its transcripts are complete; then Muhammad Metwally al-Shaarawy (`fi-rihab-al-hadith-al-qudsiyyah`, `likaa-al-iman`), then the rest of the queue (Yusuf al-Qaradawi, Zaghloul El-Naggar, Abla al-Kahlawi, Abu Ishaq al-Heweny, Abd al-Rahman Mansour, Ahmad Farid, Ahmed Abdussalam, Sayed Elbshbishy, Mosaad Anwar, Mustafa Hosny, …). Writer tools (outside git): `~/islam-museum-harvest/scratch/egypt-writer/` (`clean.py` loop-collapsing reader, `wiki.py` Wikipedia/Wikidata fetcher with revision ids, `extend.py` cited-section appender, `claims.py` claims-table writer).

## Log

- 1 Nov 2026: Egypt list read (20 speakers; 19 besides Omar Abdelkafy, about 2,900 lessons). robots.txt re-read: speaker pages, lesson pages and media host not disallowed. 19 sources registered (`source/assabile-<speaker>`), authenticity scope extended by the founder's instruction of 1 Nov 2026. Phase A (download) and phase B (transcription) started on the founder's Mac with `harvest_speakers.sh` and `transcribe_speakers.sh` (§4b of the method). Existing person records: amr-khaled, mohamed-hussein-yaqoub, yusuf-al-qaradawi, abu-ishaq-al-heweny, ragheb-al-sergani, muhammad-mutawalli-al-shaarawi; the other 13 speakers have none yet.

## Decisions taken overnight (founder's full authority for the night of 1 Nov 2026; recorded here instead of asking)

- **Kishk's faith.** Only the Arabic Wikipedia infobox names a school (Ahl al-Sunna wa-l-Jama'a); Wikidata says only Islam and the English article names none. Recorded as `faith: unknown` with that note, following the `person/ragheb-al-sergani` precedent, until a second independent source exists.
- **Wikipedia ledger.** The two Kishk articles are recorded as page entries in `docs/authenticity-ledger/pages/` (revision ids in the URLs) and as `source/wikipedia-abdul-hamid-kishk-{en,ar}` and `source/wikidata-abdul-hamid-kishk`.
- **Noisy archive.** The Kishk recordings are old cassette sermons; the Qwen transcripts are mostly garbled. Only windows that read clearly were used (65 of 1,231); stories he tells without a chain are marked `needs_source`; names that are garbled (the Companion of the fox story, the son in the apple story) are left unnamed.
- **Hadith he quotes** (the hadith qudsi of the five conditions, the five heavy in the scale, bayt al-hamd, the expiation hadith, prayer at seven) are described in the museum's words; no matn typed. Qur'an verses he recites without naming the sura are not linked.
- **Recording map.** `site/src/data/recordings-abdul-hamid-kishk.json` (from the manifest, `recordings_map.py`) and one line each in the three maps of `site/src/lib/recordings.ts`, as for Sergani and El-Naggar.

## Batch log

- kishk-1 (run `assabile-egypt-kishk-1`): series `shorut-kobol-assalat`, 7 episodes, **series complete; speaker complete** (the archive holds only this series). New: `person/abdul-hamid-kishk` (Wikipedia en/ar and Wikidata, broad rule, plus what the sermons show), `work/shorut-kobol-assalat` (lecture-series, `sermon_type: jumu'a`, 11 `about` edges), `concept/shurut-qabul-al-salah`, `source/wikipedia-abdul-hamid-kishk-en`, `source/wikipedia-abdul-hamid-kishk-ar`, `source/wikidata-abdul-hamid-kishk`. Extended with a cited section in ar/en/ur: `concept/tawadu`, `concept/rahma`, `concept/masjid`, `concept/rafiq-al-qabr`, `concept/ibtila`, `person/sufyan-al-thawri`, `practice/nikah` (`concept/dhikr` and `concept/tawhid` were written and then withdrawn: `tour/halls.yaml` pins their source lists and `scripts/tour.test.ts` fails if a source is added; their Kishk material stays in the series record). Claims tables: `~/islam-museum-harvest/books/assabile/abdul-hamid-kishk/shorut-kobol-assalat/claims/epNN.tsv`. Checks: cite-check 12 of 12 pass (before the withdrawal); `npm run validate` 0 errors.

## Completed recordings (report per `audio-video-harvest.md` §8)

| Recording | Duration | Prose | Persons | Places | Events | Other entities | Claims verified | Commit |
|---|---|---|---|---|---|---|---|---|
| shorut-kobol-assalat ep01 (Episode 01; the five conditions) | 1:20:11 (archive) | ar/en/ur | person/abdul-hamid-kishk new | 0 | 0 | concept/shurut-qabul-al-salah new; work new | 2 (Qwen3-ASR, 30 s); 41 loop windows | kishk-1 PR |
| shorut-kobol-assalat ep02 (Episode 02; not lording it over creation) | 1:34:23 | ar/en/ur | 0 | 0 | 0 | tawadu, rafiq-al-qabr, nikah ext. | 12; 2 needs_source (grave story); 10 loops | kishk-1 PR |
| shorut-kobol-assalat ep03 (Episode 03; not persisting in sin) | 1:33:08 | ar/en/ur | 0 | 0 | 0 | (tawhid in the series record) | 15; 2 needs_source (fox story name; apple story); 9 loops | kishk-1 PR |
| shorut-kobol-assalat ep04 (Episode 04; the day in remembrance) | 1:20:04 | ar/en/ur | sufyan-al-thawri ext. | 0 | 0 | (dhikr in the series record) | 10; 1 needs_source (Sufyan's prescription); 3 loops | kishk-1 PR |
| shorut-kobol-assalat ep05 (Episode 05; mercy; the mosque) | 1:31:38 | ar/en/ur | 0 | 0 | 0 | masjid ext. | 9; 1 needs_source ('65 date); 5 loops | kishk-1 PR |
| shorut-kobol-assalat ep06 (Episode 06; mercy to the afflicted) | 1:20:04 | ar/en/ur | 0 | 0 | 0 | rahma, ibtila ext. | 7; 9 loops | kishk-1 PR |
| shorut-kobol-assalat ep07 (Episode 07; the widow and the poor) | 1:33:36 | ar/en/ur | 0 | 0 | 0 | ibtila, rahma ext. | 10; 10 loops | kishk-1 PR |

## Excluded items

| Item | Episode / time | Reason | Gate failed | Override |
|---|---|---|---|---|
| Repetition loops: 87 windows (ep01 41, ep02 10, ep03 9, ep04 3, ep05 5, ep06 9, ep07 10) | shorut-kobol-assalat ep01–ep07 (marked `[LOOP]` by the reader) | Loop is not speech | Loop check (founder decision 5) | open |
| Garbled or unclear windows: about 1,079 windows not used (1,231 windows, minus 65 used and 87 loops), most of them non-sentences from the old cassette audio | shorut-kobol-assalat ep01–ep07 | Garbled material may be discarded (founder, 25 Oct 2026) | Clarity judgement by the writer | open |
| Opening eulogies, poems and closing supplications | every episode, opening and closing windows | Formulae and verse, not content; verse not reconstructed | Content rule | open |
| Qur'an recitations (for example the verse on spouses, affection and mercy at ep02 00:44:30; 16:90 before each closing) | ep02 00:44:30; ep03 01:11:00; ep05 01:11:30 | Recited without naming the sura; never typed | Qur'an rule | open |
| Numbering of the sermons («الثلاثين بعد المئة الثالثة», «الخامس ... بعد المئة الثالثة») | ep02 00:12:30; ep07 00:13:30 | Garbled ordinal; not written | Clarity | open |
| Name of the son born in the apple story | ep03 01:04:00 | Garbled name («الإمام عبد علي بن…») | Clarity; never guessed | open |
| Conditions of the righteous wife; a story of a husband who beat his wife | ep02 00:46:00–00:47:00 | Partly garbled | Clarity | open |
