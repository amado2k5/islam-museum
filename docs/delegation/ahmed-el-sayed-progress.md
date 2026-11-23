# Lane `ahmed-el-sayed` — progress

Lane document: `docs/agents/lanes/ahmed-el-sayed.md`. Brief: founder, 23 Nov 2026. Ledger: `harvest/ahmed-el-sayed/ledger.tsv` (835 rows, all `listed`).

## Next step
Wave 1: «سيرة رسول الله» 2026 (`seerah-2026`, 32 rows). Needs the founder's approval of the disk and hours for the audio first (about 32 episodes of 1 to 2 hours), and the founder's answers to the open questions below.

## Position
Wave 0 done: source `source/podcast-ahmed-el-sayed`, `scripts/harvest/sources.yaml` entry, harvest-register entries, ledger, citation map and lane files. Nothing downloaded or transcribed.

## Log
- 23 Nov 2026 — Wave 0. Feed read in full (835 episodes, two pages) with a two-second pause. The person record `person/ahmed-elsayed` already exists and matches the brief (Yanbu, 1985, al-Bina' al-Manhaji, Rising Generation Academy); it gained the new source in its `sources` list and nothing else. No namesake risk found: the feed account is the handle of his official channel, and its items include his own programmes.

## Open questions for the founder
1. **YouTube fallback.** The brief allows `yt-dlp` audio from YouTube when an episode has rotated out of the feed. `docs/agents/audio-video-harvest.md` forbids YouTube downloads except for `@muftimenkofficial` (ruling of 21 Nov 2026). The feed has no rotation problem (the whole catalogue is in it), so the lane does not download from YouTube. Say so if you want a ruling for `@alsayyed_ah`.
2. **Ledger in git.** Repo practice keeps ledgers out of git; the brief asks for `ledger.tsv` in every commit, so it is tracked (metadata only). Transcripts are kept out of git, against the brief's "transcripts next to the ledger", because the repo forbids committing them (`audio-video-harvest.md` §2).
3. **One source, not one per series.** The museum's pattern is one source per speaker archive with the series in the citation locator (`series/epNN`), as for the Assabile speakers. The brief asks for each series to be registered; the series are listed in the ledger and each is cited by its locator, which is what the site renders. Say so if you want one `data/source` record per series.
4. **Sizes.** 835 feed episodes against about 1,400 expected; episode numbers missing in two series (see `harvest/ahmed-el-sayed/README.md`). The brief's rule on a material disagreement between ledger and feed is to ask: these are reported, not resolved.
5. **Sham and Jerusalem grouping.** Inferred from titles; confirm against a YouTube playlist (metadata only) before wave 4.

## Excluded items
None.
