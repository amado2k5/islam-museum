# 65 · Podcast pipeline — how the museum's children's podcasts are made

The engineering record of the museum's two children's story podcasts: where
the stories come from, how the voices are recorded, how each episode becomes
a picture-book video, the quality gate every episode must pass before it is
published, the defects that gate and its predecessors caught, and how the
finished episodes are hosted and distributed. Written 20 November 2026, the
day both series were published in full; every fact below was verified on
that date. When a fact here changes, update this document in the same pull
request.

## 1. What exists

Two children's story series, both made for the Kids' Wing (جناح الصغار):

- **Hudhud's Story Time** — English, 10 episodes.
- **وقت حكايات هدهد** — Arabic, 10 episodes. The Arabic series tells
  different stories; it is not a translation of the English series.

The format is the same in both: two voices, a grandfather and a
grandmother, telling a story to children as a conversation. Every story is
drawn only from the museum's own records, and every episode's description
carries the direct link to the record the story came from (founder rule,
19 November 2026). The episode-by-episode catalogue — titles, source
records and video links — is in
[`docs/outreach/podcast-series.md`](../outreach/podcast-series.md).

## 2. Voices and recording

The voices are generated with ElevenLabs; the same two voices are used in
every episode of a series.

- English: Grandfather `avocado_v2:vdc_2561`, Grandmother
  `avocado_v2:vdc_6534`.
- Arabic: Grandmother unchanged (`avocado_v2:vdc_6534`); Grandfather
  `avocado_v2:vd2_fiery_throne`. The English grandfather voice cannot
  actually speak Arabic — the gate's language detection proved it (§5) —
  so the Arabic series has its own grandfather voice.

Arabic episodes are in Modern Standard Arabic ⁦(العربية الفصحى)⁩ only, never
in dialect (founder rule, 20 November 2026).

All 20 episodes were recorded on 19–20 November 2026. The recording was
done ahead of a deadline: the ElevenLabs Creator plan was cancelled and
ends on 6 December 2026, with no renewal, so the whole of both series was
written and recorded while the plan was still live.

## 3. Scripts

Each script is drafted from the museum record the story comes from: the
facts are the record's facts, taken from the sources the record cites, and
nothing is invented for the story. Scripts are saved with each episode's
materials, so the exact words that were recorded can be checked later —
the gate in §5 depends on that.

## 4. The picture-book videos

Each episode is also a picture-book video, 1920×1080:

- Illustrated pages are rendered with PIL. Arabic text is shaped with
  `arabic_reshaper` and ordered with `python-bidi`.
- Two fonts are used: Noto Naskh Arabic for Arabic text and Noto Serif for
  Latin runs inside a page (see §6 for why one font is not enough).
- The design — cream pages, bronze frame and title — matches the Kids'
  Wing. Page numbers in the Arabic series are Arabic-Indic numerals.
- Page turns are timed from a timestamped transcript of the episode's
  audio, so each page appears when its words are spoken. An opening and a
  closing bookend page are shared across each series.
- The video's length is the audio's length plus a tail of about two
  seconds.

## 5. The pre-publish QA gate

Founder's rule, 20 November 2026: **nothing publishes — podcast feed,
YouTube, anywhere — until every check below passes and a QA report is
saved with the episode.** Any failure stops the release; the defect is
fixed, the episode regenerated if needed, and the full gate runs again
from the top.

Automated checks:

- **A2** — the audio is transcribed (Whisper) and the transcript is
  diffed against the script line by line, in order; every scripted line
  must be found in the audio.
- **A3** — loop scan: a repeated phrase above the threshold fails.
- **A4** — language check: the audio is sliced into 30-second windows and
  every window must detect as the episode's language.
- **A4b** — fine language scan: the same check in 5-second windows; any
  window that detects as a different language with probability ≥ 0.50
  fails the gate.
- **A5** — silence scan: no gap over 2.5 seconds.
- **V1** — glyph preflight: every character of every page's text must
  exist in at least one of the fonts used to render the pages.
- **V3** — the finished video is verified with ffprobe (duration against
  the audio, resolution, streams) before any upload.

Manual check:

- **V2** — every rendered page is inspected by eye, plus frames taken
  from the finished video, to catch wrong order, truncation or assembly
  faults.

A flagged line may be resolved only with span-level evidence: the span is
cropped, transcribed on its own, and its detected language is checked. A
span that renders in a foreign language is evidence that the speech
itself is in that language — a defect to repair, never a waiver. The
gate's thresholds were never loosened to let an episode through.

## 6. Defects found and fixed

Four defects reached the gate or the founder during the two days of
production; each one changed the pipeline.

- **English Episode 4 — a synthesis loop.** The recorded audio contained
  a loop of about four minutes: one generated chunk derailed and repeated
  a phrase. The episode was repaired by splitting the line and
  regenerating it; the repaired version replaced the corrupt upload,
  which stays private on the channel.
- **Arabic Episode 1 — missing glyphs.** The closing page rendered
  "islam.museum" as empty boxes, because the Arabic font has no Latin
  glyphs. Fixed by the two-font rendering in §4; the flawed upload was
  deleted and replaced.
- **Arabic Episode 2 — a line spoken in English.** One long line was
  spoken in English inside 30-second windows that still averaged out as
  Arabic, so A4 alone did not catch it. This defect is the reason A4b
  exists. The episode was re-recorded and the defective upload deleted.
- **Arabic Episode 3 — a garbled chunk.** One line came out garbled;
  repaired by splitting the line and regenerating, as with English
  Episode 4.

One production note follows from the repairs: the audio generator reuses
cached synthesis keyed by line text and voice, so a modified script
regenerates in place under the same episode slug and overwrites the old
audio. Back up a defective audio file before regenerating, or the
evidence of the defect is lost.

## 7. Hosting and distribution engineering

- **The museum's own feed.** The RSS feed lives in this repository at
  `site/public/podcast/feed.xml`, with the show cover at
  `site/public/podcast/hudhud-story-time-cover.jpg` (3000×3000). It
  carries full iTunes metadata and one item per English episode.
- **R2 routing.** The feed is served from R2 under the `podcast/` prefix.
  That prefix was added to the shared-parts deploy allowlist after a
  deploy was refused for it, and a guard test
  (`scripts/r2-registration.test.ts`) now checks every folder of
  `site/public` against every place that decides where a folder may go,
  so a new folder fails in a pull request rather than during a deploy.
- **Directories.** The feed goes live at the founder's next deployment.
  The Apple Podcasts draft show ("Hudhud's Story Time", ID 6837007282)
  is then repointed to `https://islam.museum/podcast/feed.xml`, refreshed
  and published; Spotify for Creators follows with the same feed URL.
- **YouTube.** YouTube is the video home. Both series were published in
  full on 20 November 2026, Public and marked made for kids, in two
  playlists; the catalogue is in
  [`docs/outreach/podcast-series.md`](../outreach/podcast-series.md).
- **Interim feed.** So the English series could be heard while the
  museum's own feed awaits deployment, it was also published on an
  interim hosted feed. The museum feed supersedes it once live.

## 8. Rules that bind future episodes

- Every episode description carries the direct link to its source record.
- Arabic episodes are Modern Standard Arabic only.
- The full gate of §5 runs for every episode, and its report is saved
  with the episode, before anything is published.
- Episodes are posted from the museum's brand accounts only.
- The voices are AI-generated, and every episode description says so —
  the museum's honesty rule applies to the podcasts as to everything
  else.
