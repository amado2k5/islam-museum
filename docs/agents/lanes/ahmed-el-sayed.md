# Lane `ahmed-el-sayed`: the podcast of Ahmed Elsayed

_Opened 23 November 2026 on the founder's brief. Binding with `AGENTS.md`, `docs/ai-change-gates.md`, `docs/sources-policy.md`, `docs/agents/publication-standard.md` and the method of [`../audio-video-harvest.md`](../audio-video-harvest.md). Where this lane differs from that method, this page says so and the reason is in the progress file._

## Who, and the guard against namesakes

The target is Ahmed ibn Yusuf ibn Hamid al-Sayyid (أحمد بن يوسف السيد), born in Yanbu, Saudi Arabia, in 1985, founder and supervisor of «البناء المنهجي» and «أكاديمية الجيل الصاعد». His record is `person/ahmed-elsayed` (owned by `modern-figures`; edits here are additive). Official site `ahmadalsayed.net`; handle `alsayyed_ah` on SoundCloud, YouTube, Instagram and Telegram. Ahmed El-Sayed is a very common name: harvest only audio that comes from the canonical sources below or links back to the site or those accounts. If an episode cannot be attributed to him with confidence, stop and ask the founder.

## Canonical source and the ledger

The podcast «أحمد السيد» is fed from SoundCloud (`https://feeds.soundcloud.com/users/soundcloud:users:72673970/sounds.rss`, account `https://soundcloud.com/alsayyed_ah`). The feed is paginated (it carries a `next` link every 500 items), so the whole public catalogue is read, not only the latest 500. Registered as `source/podcast-ahmed-el-sayed` (kind `secondary`, type `audio`; a modern scholar's narration, never a primary source).

The ledger is `harvest/ahmed-el-sayed/ledger.tsv`, one row per unique episode, keyed by the SoundCloud track id (stable). Build and refresh it with:

```bash
python3 -I scripts/harvest/ahmed-el-sayed/fetch_feed.py "$HARVEST/ahmed-el-sayed/feed-pages"
python3 -I scripts/harvest/ahmed-el-sayed/build_ledger.py "$HARVEST/ahmed-el-sayed/feed-pages"
```

A re-run keeps `status`, `records_created`, `pr`, `also_on` and `note` of every existing row and only adds new episodes, so finished work is never reset. Read the ledger first on every run and resume from the first non-merged row of the current wave; never download or transcribe a row that is already `transcribed` or later. Status flow: `listed` → `downloaded` → `transcribed` → `extracted` → `drafted` → `gated` → `merged` (or `blocked:<reason>`). The `date` column is the SoundCloud upload date, not the delivery date.

## Citation rule (founder, 23 November 2026)

A citation names the narrator, the series, the episode number and title, and links to the whole episode page. **No timestamps.** The locator is `series/epNN` (for example `{cite:podcast-ahmed-el-sayed seerah-2026/ep33}`); where the printed number repeats inside a series (numbered per book, season or module) or an episode is unnumbered, the locator uses the SoundCloud track id (`series/ep<track id>`). The `locator` column of the ledger holds the exact form, and `site/src/data/recordings-ahmed-el-sayed.json` maps it to the episode page. Where an episode names a classical work (Ibn Hisham, al-Bukhari, al-Tabari and so on) as its basis, record that work in the extraction notes as the episode's stated source; it is never presented as cited, and the episode citation never stands in for the classical work.

## Waves

0. Source registration, ledger, person-record check (this PR). 1. «سيرة رسول الله» 2026 (`seerah-2026`). 2. «السيرة النبوية للمصلحين» (`seerah-lilmuslihin`; Baheth carries written transcripts). 3. «خير القرون» (`khayr-al-qurun`) and «الطريق إلى بيت المقدس» (`tariq-ila-bayt-al-maqdis`). 4. «الأمة بين احتلالين», «يوم الفرقان», and the Sham and Jerusalem talks. 5+. The remaining series in the order of the ledger, the standalone talks, then anything beyond the feed. One wave per pull request, a report after each.

## Rules specific to this lane

- Never commit audio, transcripts or claims tables (`harvest/ahmed-el-sayed/.gitignore` enforces it); the ledger and its README are the only tracked files there. Transcripts are working material and are never published, in whole or in part.
- **YouTube is not downloaded for this speaker.** The founder ruling of 21 November 2026 allows it for `@muftimenkofficial` only. Audio comes from the feed's own enclosure links; if an episode is missing there, stop and ask. YouTube may be read for metadata (playlists, to fill `also_on`).
- His opinions, exhortations and contemporary commentary are not museum facts; extract the historical and scholarly content. His school is not recorded (`faith: unknown` on his record stands until two independent sources agree). Contested matter goes into `perspectives` with `sensitivity` set.
- Content safety first: an episode on a modern conflict or movement is read against `docs/agents/content-safety.md` before extraction; if it trips the hard block, flag it and do not extract or quote it.
- A narration that contradicts a record the museum holds from a stronger source: keep the existing sourced fact, note the discrepancy in the pull request, ask if unsure.
- All five languages in the same commit for every new record; no honorifics typed; Qur'an text only as `[[passage/quran-S-A]]`; hadith wording never from a transcript; quotations at most 40 words with the episode citation.

## Stop and ask the founder when

An episode's audio is missing or corrupt on every source; an episode cannot be attributed to him with confidence; content trips the safety rules; a narration contradicts a stronger-sourced record; or the ledger and the feed disagree materially (missing or duplicated episode numbers).
