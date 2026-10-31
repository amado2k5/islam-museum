# Lane `khutab-durus`: sermons, lessons, study circles and conferences

_Opened 31 October 2026 on the founder's instruction, under the approved proposal `docs/plan/25-khutab-durus-explorer.md` (plan 07 section V, companion of the Fatwa Explorer). Binding with `AGENTS.md`, `docs/ai-change-gates.md`, `docs/sources-policy.md`, `docs/agents/publication-standard.md`, `docs/agents/content-standards.md` and the method in [`../audio-video-harvest.md`](../audio-video-harvest.md)._

## Scope

Published Sunni sermons (khutab al-jumu'a, Eid and occasion sermons), lessons (durus), study circles (halaqat al-'ilm), lecture series and scholarly conferences, from the first century to today's recordings. Sources: books, websites, audio and video archives, podcasts, and YouTube (metadata and links only — never downloaded).

The museum records sermons and lessons as history and as a guide to who taught what, where and when. It never preaches and repeats no exhortation in its own voice: every record describes what the speaker said, attributes it and labels it.

## The model (docs/plan/25)

- One sermon or lesson = one `work` (`kind: sermon` + `sermon_type`; `kind: lecture` for a single dars or talk). Every one carries `delivered.by`.
- A series = `work kind: lecture-series`; lessons `part_of` it in `order`.
- A conference = `event kind: conference`/`gathering`; its talks are `work`s `part_of` it.
- Predicates: `delivered`/`delivered_by`, `relies_on`/`relied_on_by` (added by this lane), plus `part_of`, `about`, `responded_to`, `student_of`, `convened`, `attended`, `issued`, `publishes`.
- Every listed item gets an index record of facts (the explorer dataset); full entities go to famous and consequential sermons, book-explaining series, conferences, and lessons on topics the museum already holds.

## Sources (phase 1 discovery; `$HARVEST/khutab/catalogue.json`)

- Books: Jamharat Khutab al-'Arab (Safwat), Diwan Khutab Ibn Nubata, Ibn al-Jawzi's sermon and wa'z books, Lata'if al-Ma'arif, amali books, the waqfeya shelf «كتب الخطب والمساجد» (49 books), modern printed collections and ministry khutba volumes. Each runs the §1a canon gate before `books.yaml` `cat: khutab` entry; scans OCR with Apple Vision (`ocr_all.py --cat khutab`).
- Sites: manaratalharamain.gov.sa and droos.prh.gov.sa (Haramain archives, Hijri-dated), ministries of awqaf (Egypt, UAE, Kuwait, Qatar, Jordan, Morocco, Saudi Arabia, JAKIM, Diyanet), alukah.net, islamweb, khutabaa.com, scholars' sites — each a `work kind: website`, "listed, not endorsed".
- Audio: assabile.com (registered for omar-abdelkafy and tareq-al-suwaidan; new speakers get their own `source/` entities), islamway.net (~96,648 lessons per the site's own dated figure), Haramain audio, podcast RSS feeds.
- Video/YouTube: pointers only, never downloaded.

Downloads to `~/islam-museum-harvest` (microSD) only, via `scripts/harvest/audio/download.py` with its identified User-Agent and delays, after robots.txt and terms are read and recorded here. Transcription offline on the Mac (`transcribe.py` mlx_whisper large-v3, or the Qwen3-ASR dialect engine) under `tmux` + `caffeinate -dims`. The founder is asked before any bulk download or transcription run.

## Rules specific to this lane

- `audio-video-harvest.md` to the letter: claims table per recording in `$HARVEST`; only clearly-reading Arabic lines are written; Qur'an and hadith matn never from a transcript; speaker's dates and numbers are his statements; `{cite:<source> <series>/<ep> <hh:mm:ss>}` anchors; the §8 report per recording; every excluded item reported.
- A sermon or lesson's summary is attributed and cited to page or timestamp; quotes ≤ 40 words; no exhortation in the museum's voice; `sensitivity` and `perspectives` for contested and polemical content.
- `delivery_date_status` is set whenever a date is recorded: an upload or broadcast date is never presented as the delivery date.
- `ruler_at_time` roles other than `contemporary` need a citation; the validator enforces it.
- Batches ≤ 25 entities; the claims table of each source's first batch is shown to the founder before files are written. Every batch: `npm run validate` && `npm test` && `npm run coverage`; explicit paths; merge gate before every push; PR, self-merge. Stubs go in `data/_stubs.d/khutab-durus.yaml`.
- **No rejection without the founder** (founder's instruction, 31 Oct 2026): no book, content item or website is rejected, refused or excluded on any ground — school, licence, quality, scope — before the founder is asked and has decided; his decision overrides the lane's call. Flagged items are recorded in the progress file with the reason and await his ruling, which includes §1a canon-gate exclusions (held as `held`, never dropped silently).
- Progress: `docs/delegation/khutab-durus-progress.md`, kept current after every batch.

## Overlap

- `omar-abdelkafy` / `tareq-al-suwaidan` lanes enrich the speakers and the topics their lessons explain; this lane adds the `work` records of the sermons and lessons themselves — additive edges, never edits that drop their facts.
- Sira lanes already hold `work/farewell-sermon`, `work/prophets-ansar-speech`, `work/hadith-of-the-five-afflictions`: reuse them, add sources and the new fields, no duplicates.
- `concept/khutba-fiqh` holds the fiqh of the khutba; a general `concept/khutba` (what it is, its history) may be added without duplicating it.
- The Fatwa Explorer links both ways via `related_fatwa`-style `about`/`responded_to` edges.
