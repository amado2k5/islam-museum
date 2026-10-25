# Harvesting audio and video lectures

_Operating method for turning a preacher's or scholar's recorded lessons (audio or video) into museum records. Opened 25 October 2026 on the founder's instruction. It is one of the harvest methods of the museum: it sits beside the book harvest (`mining-sources.md`), the Wikipedia broad rule and the web families (`source-families.md`), and it binds every lane that uses recordings. Binding with `AGENTS.md`, `docs/sources-policy.md`, `docs/ai-change-gates.md` and `docs/agents/publication-standard.md`._

The first lane to use it is `omar-abdelkafy` (`lanes/omar-abdelkafy.md`). The first registered recording source is the Assabile archive of his lessons (`source/assabile-omar-abdelkafy`).

## 1. What the method produces

For each lecture series the method yields:

1. a **source** entity for the archive (one per family or site, not one per lesson), registered as in `source-families.md`;
2. **facts** about the speaker, his works, his programmes and his positions, each cited to the recording by an anchor `{cite:<source-id> <series>/<episode> <hh:mm:ss>}`;
3. **topic entities** (concepts, practices, events, objects, people the lecture explains), written in the museum's own words, each sentence that states a fact cited to a recording anchor;
4. the speaker's `person` record enriched with what the recordings say, keeping every existing source and fact.

A recording is a primary source for what the speaker says. It is not corroboration of history: a claim the speaker makes about a past event is recorded as **his account** (`status: tradition` or attributed), and anything historical that matters is also cited to an independent source where one exists.

## 2. Rules that never bend here

- **Rights (`docs/sources-policy.md`).** Read and listen to anything; write the museum's own words; cite the recording and its timestamp. Facts enter `data/` (CC0). Verbatim text from a lecture is at most 40 words, in quotation marks, with the anchor. The audio files, the downloaded MP3s, the transcripts and the claims tables never enter git: they live in the harvest workspace.
- **No transcription of the Qur'an or of hadith matn as scripture.** A recitation or an ayah read in a lecture is never typed into the museum. Reference the passage (`[[passage/quran-<sura>-<aya>|label]]`) and cite the lecture for what the speaker says about it. The validator rejects Qur'an text in prose.
- **Transcripts are noisy, and an agent cannot listen.** Speech recognition on these archives is wrong in places: the pilot's transcript of episode 1 (large-v3, 8 kbit/s source audio) has invented or garbled words in several lines (for example a line that reads as a non-sentence where the speaker is clearly reciting or quoting). An agent works from text and cannot hear the audio, so the verification rule is:
  1. a fact, name, number, date or quotation is written only from a transcript line that reads clearly as Arabic and makes sense in its context;
  2. the claims table records the line and its timestamp; at least two independent engines (§3) must give the same words for a name, number or date within the same 60-second window (`scripts/harvest/audio/agree.py` scores this per window), or the claim is dropped. Engines from the same family (two Whisper models) count as one witness for this purpose, because they share their errors on recited and rhymed passages;
  3. the founder or another reviewer may confirm a line by listening at its anchor; a line nobody has confirmed is marked `needs_source` in the entity or left out, never presented as checked;
  4. recitations of the Qur'an and quoted hadith are never written from the transcript (see the Qur'an rule above).
- **Dates and numbers** the speaker gives are his statements. Record them as his, with the anchor; never convert or "correct" them.
- **Faith.** The speaker's school is recorded only from two independent sources (`publication-standard.md`, the modern-figures faith rule). A lecture that expresses his own school is an attestation by the speaker himself and is recorded as such with its anchor, not as a museum judgement; it still counts as one source.
- **Describe, attribute, label.** Lecture material on contested questions (creed differences, madhhab differences, other religions, politics) goes into `perspectives` with the Sunni position first, labelled; no verdict in the museum's voice.
- **No honorifics typed** (the UI renders them); no figurative depictions.
- **Platform figures** (subscribers, views, plays) are dated platform numbers, never museum facts without a date.
- **Sites that forbid collection are not used.** Check the site's robots.txt and terms before the first bulk download. YouTube-hosted lectures are cited as pointers only: this method never downloads from YouTube (its terms forbid it; `publication-standard` and `15-local-harvest.md` §5 rule 5 apply).

## 3. The Mac toolchain (checked 25 October 2026 on the founder's Mac)

| Job | Tool | Where it is |
|---|---|---|
| Discover recordings, read episode lists and media links | the built-in browser pane (`mcp__Claude_Browser__*`), read-only page extraction | desktop app |
| Bulk download, polite and resumable | `scripts/harvest/audio/download.py` (Python standard library; identified User-Agent; two-second pause; checksums) | repo |
| Audio probing and conversion | `ffmpeg`, `ffprobe` (Homebrew) | `/opt/homebrew/bin` |
| Speech to text, offline | `scripts/harvest/audio/transcribe.py` calling `mlx_whisper` with `mlx-community/whisper-large-v3-mlx` | `/opt/homebrew/Caskroom/miniconda/base/bin/mlx_whisper` |
| Second and third speech engines | Voxtral Mini 3B (`mlx-community/Voxtral-Mini-3B-2507-bf16`) through `mlx-audio` in `$HARVEST/.venv-audio` (installed 25 Oct 2026 with PyTorch, `mistral-common`, `librosa`); Apple's on-device speech recognizer through `scripts/harvest/audio/apple-speech/main.swift` (compiled to `$HARVEST/bin/apple-speech`) | Voxtral gives plain text without timestamps on this file; Apple's engine needs Arabic dictation installed in System Settings (Keyboard > Dictation), a change only the founder makes; until then it refuses to run and sends no audio anywhere |
| Drafting and claim extraction | local Ollama models (`qwen3:32b`, `gemma4:26b`, judge from another family) under the strict rules of `feedback-local-model-drafting` and `scripts/harvest/library/draft_prose.py` | `ollama` |

**Model choice, measured on the first pilot episode (44 minutes, Arabic):**

- `whisper-large-v3-turbo`: about 60 seconds per episode, but visibly weaker Arabic (repeated lines, dropped words, misread verbs).
- `whisper-large-v3` (`mlx-community/whisper-large-v3-mlx`): about 3 minutes 15 seconds per 44-minute episode (about 13 times real time), clearly better. **This is the default.** Turbo is used only for a quick pass on a long series where time matters more than accuracy, and its output is never the basis of a quotation.
- The lecture audio is low quality (about 8 kHz mono, 8 kbit/s MP3 from the archive), so error rates stay high; the verification rule of §2 is what makes it safe. Options still to test, in order: a second pass with `whisper-large-v3-turbo` on a noise-reduced copy (`ffmpeg -af "highpass=f=80,afftdn"` into the harvest workspace, never over the raw file), and an agreement report between the two passes per episode.

Cost: the whole corpus of one preacher with about 600 lessons is roughly 450 hours of audio, about 33 hours of Mac time at this speed. It runs in the background (`tmux` plus `caffeinate -dims`, as in `15-local-harvest.md` §9).

## 4. The pipeline, step by step

Work in the harvest workspace (`~/islam-museum-harvest`, a link to the external drive). Each step is restartable.

1. **Discover (browser).** Open the speaker's archive page and list the series. For each series open its page and read the episode list and the media links. The media files are plain URLs in the page (`media.<site>/…mp3`); read them from the page's HTML with a short script in the browser pane. Record one row per episode in a manifest TSV: `series_slug, episode, title, duration, url`. Use one page load at a time, with a pause between pages.
2. **Check the rights and the robots file** of the host once, and record the date in the source entity's `reliability_note`.
3. **Download.** `python scripts/harvest/audio/download.py --out $HARVEST/raw/<site>/<speaker>/ --manifest <manifest>.tsv`. Files land in `<series_slug>/epNN.mp3` with `SHA256SUMS`. Raw downloads are never edited.
4. **Probe.** `ffprobe -hide_banner <file>` for duration and tags. Record the duration in the manifest; the archive's own duration is a check.
5. **Transcribe** (large-v3; for the agreement check of §2 run the second pass with the turbo model on a noise-reduced copy). `python scripts/harvest/audio/transcribe.py --out $HARVEST/books/<site>/<speaker>/<series_slug> <files…>`. Output per episode: `epNN.json` (segments with start and end seconds), `epNN.txt` (lines prefixed `[hh:mm:ss]`), `epNN.meta.json` (model, input checksum, speed, machine). Resumable.
6. **Read and build a claims table** (harvest workspace, never git): claim, value, anchor `series/epNN hh:mm:ss`, the exact transcript line, a quote of at most 40 words if one is used, doubt flags, target entity. Search `data/` for each target first (reuse; add the new anchor as another cited claim).
7. **Verify.** Apply the verification rule of §2 (clear line, second pass agrees, or a person's listening recorded in the claims table). Record which of these was done for each claim; never record "verified" for a line nobody heard.
8. **Write** the entity data (`data/…`), the Arabic prose first, then English and Urdu translations in the same commit (`docs/language.md`), every fact-stating sentence cited.
9. **Check.** `npm run cite-check -- <class/slug> …`, `npm run validate` (0 errors), `npm test`, and `npm run coverage` when entities change. `npm run build` for any change under `site/`.
10. **Commit and push** as `workflow.md` §4 says: merge gate, attribution trailers, a pull request for the batch.

## 5. Citation anchors

The source entity is one per archive: `source/<site>-<speaker>` (for example `source/assabile-omar-abdelkafy`). The anchor is free text read by a person, and it must be exact enough to find the passage in under a minute:

- `{cite:assabile-omar-abdelkafy aadau-al-islam/ep02 00:12:34}` — series, episode, timestamp (hh:mm:ss, the start of the segment);
- for a whole episode: `{cite:assabile-omar-abdelkafy aadau-al-islam/ep02}`.

The series slug is the archive's own slug (its URL), and `epNN` is the episode number on the archive page. Timestamps come from the transcript's segment start, checked by ear.

## 6. Registration checklist (once per archive)

1. `scripts/harvest/sources.yaml`: an entry with URL, licence posture, method, limits (pause, User-Agent), status.
2. `data/source/<site>-<speaker>.yaml`: `kind: primary`, `type: audio`/`video` lecture archive, `reliability_note` with the date checked and the rule: a primary source for what the speaker says, not for history.
3. `docs/attribution.md`: one row.
4. `docs/agents/source-families.md`: one row in the registered table.

## 7. Progress and handoff

Each speaker's lane keeps a progress file in `docs/delegation/<lane>-progress.md` with: series done (episodes downloaded, transcribed, verified by ear, written), the next series, the claims table location, doubts, and the speed and model used. A new session resumes from the "next step" line there.

## 8. Completion report for every recording

A recording counts as **completed** only when its claims have passed the verification rule of §2 and its entities are committed. For every completed recording the progress file of its lane gets one row with these fields:

| Field | Meaning |
|---|---|
| Recording | series slug, episode number and the archive's title for it |
| Duration | from the archive, and from `ffprobe` |
| Prose | number of entity prose files written (ar, en, ur counted separately) |
| Persons, places, groups, events, concepts, practices, works, objects | number of new entities of each class, and number of existing entities enriched |
| Claims | total claims, and how many passed each verification step (second pass, listening, or dropped) |
| Doubts | count of `needs_source` annotations and dropped lines |
| Commit | the commit or PR that carries it |

Recordings that are downloaded or transcribed but not yet completed are listed separately with their status. Nothing is counted as completed on the strength of a transcript alone.
