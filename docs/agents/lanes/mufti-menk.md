# Lane `mufti-menk`: the YouTube channel of Mufti Ismail ibn Musa Menk

_Opened 21 November 2026 on the founder's instruction. Binding with `AGENTS.md`, `docs/ai-change-gates.md`, `docs/sources-policy.md` (including the founder ruling of 21 Nov 2026 on YouTube audio), `docs/agents/publication-standard.md`, the data model of `docs/plan/25-khutab-durus-explorer.md` and the method of [`../audio-video-harvest.md`](../audio-video-harvest.md)._

## Scope

Every video of `https://www.youtube.com/@muftimenkofficial` (Videos, Shorts, Live and every playlist), processed strictly from the newest upload to the oldest. Each lecture, sermon or lesson becomes a `work` record (`kind: lecture`, `sermon`, or an episode of a `lecture-series`) described in the museum's own words, attributed to the speaker (`person/ismail-ibn-musa-menk`, edge `delivered`) and cited to the recording by timestamp. The museum records what he said; it never preaches and never publishes a transcript.

## Founder ruling (21 Nov 2026)

Audio may be downloaded from YouTube for local transcription for this channel only; it is not widened to any other channel or site. Audio and transcripts stay in the harvest workspace (`$HARVEST/mufti-menk/`, outside git and outside iCloud) and are never published. Audio only, never video; each audio file is deleted once its transcript is written and checked; the transcript is kept. Text in `docs/sources-policy.md`.

## Pipeline

1. Inventory: `scripts/harvest/mufti-menk/inventory.py` fetches metadata only (yt-dlp, no media) into `$HARVEST/mufti-menk/ledger.sqlite`: one row per video, forever, with a status column. Order index 1 = newest.
2. Download and transcribe (after the founder approves the hours and disk): `scripts/harvest/audio/download.py` (yt-dlp mode) and `transcribe.py`, one video at a time, under `tmux` + `caffeinate -dims`, resumable, newest first. Recitation-class videos are not transcribed.
3. Claims table per recording with a local model (`scripts/harvest/mufti-menk/`; prompt committed beside the script), JSON validated against the enums, then a second pass that checks each summary sentence against its transcript span.
4. Match against the graph (reuse before create; unresolved topics go to `data/_stubs.d/mufti-menk.yaml`).
5. Write records: an index record of facts for every video; full `work` entities for substantial lectures, dated sermons, whole series and topics the museum already covers. Slugs derive from the recording's stable identity (the YouTube video id), never from sort order. Pilot first: the 25 newest lecture-class videos, shown to the founder before any file is written; then batches of at most 25 entities.

## Richness standard (founder, 21 Nov 2026)

The content must be as rich as, or richer than, `work/al-dar-al-akhera` (<https://islam.museum/ar/work/al-dar-al-akhera/>; `data/work/al-dar-al-akhera.yaml` and `content/<lang>/work/al-dar-al-akhera.md`). That page is the model, so a record here is not a 3–8 sentence summary:

- **Prose:** a `## Summary` paragraph, then one section per recording with a bullet for each minute or so of the talk, every bullet stating what he says (attributed: "he says", "he holds") and ending with `{cite:youtube-muftimenkofficial <video-id> hh:mm:ss}`. Inline `[[class/slug|label]]` links to every existing concept, practice, person, event and place he treats. Hadith and scripture "by sense", never typed. His own opinions labelled as such; contested matter in `perspectives`; unclear lines marked `needs_source` or dropped.
- **Data:** one `about` relation per entity treated (Omar's series carries 145), each with `sources: [source/youtube-muftimenkofficial]`; `themes`, `wings`, `regions`; `delivered`, `language`, `sensitivity`; `provenance` with the transcription engine and run; `delivery_date_status`; `duration`; `order` for series episodes.
- **Series:** each playlist or recognised series gets a `lecture-series` work built the same way, aggregating its episodes.
- **Languages:** the same depth in Arabic, English, Urdu, French and Spanish in the same commit, not a shorter translation.
- This overrides the "3–8 sentences" of the claims-table brief: the claims table carries timestamped claims per minute, and the second pass checks each against its transcript span.

## Rules specific to this lane

- Never commit audio, transcripts, claims tables or the ledger. Qur'an text only as `[[passage/quran-S-A]]`; hadith wording never from a transcript. Quotations at most 40 words, in quotation marks, with the timestamp. No honorifics typed.
- The upload date is not the delivery date: `delivery_date_status: uploaded` unless a source states the delivery date. Dates, numbers and stories he gives are his statements. Unknown stays empty; contested or polemical matter gets `sensitivity` and `perspectives`.
- His school is not recorded: `faith` stays `unknown` until two independent sources agree (see his person record).
- A clip is never its own entity and is never transcribed; it is linked to its parent lecture. Playlists are candidate series, with episode order.
- All five languages in the same commit for every new record (Arabic first); prose carries a `provenance` block.
- Stop and report if YouTube starts refusing requests; do not work around blocks. Every excluded or skipped video is reported with its reason from the ledger.

## Overlap

`khutab-durus` owns the explorer, schema and the model; this lane adds a speaker's works to it. The speaker's `person` record belongs to `modern-figures`; edits are additive (`delivered` edges), existing sources and facts stay.
