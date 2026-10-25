# Harvesting audio and video lectures

_Operating method for turning a preacher's or scholar's recorded lessons (audio or video) into museum records. Opened 25 October 2026 on the founder's instruction. It is one of the harvest methods of the museum: it sits beside the book harvest (`mining-sources.md`), the Wikipedia broad rule and the web families (`source-families.md`), and it binds every lane that uses recordings. Binding with `AGENTS.md`, `docs/sources-policy.md`, `docs/ai-change-gates.md` and `docs/agents/publication-standard.md`._

The first lane to use it is `omar-abdelkafy` (`lanes/omar-abdelkafy.md`). The first registered recording source is the Assabile archive of his lessons (`source/assabile-omar-abdelkafy`).

## 0. Start here (any agent, any session)

1. Read §2 (rights and use) before any transcript is used. The working engine's output is used directly, as the founder authorised on 25 Oct 2026; no second engine has to agree.
2. Set up the Mac once with §3.1 and check §3.2 before debugging anything; most failures are already recorded there.
3. Work per series in the lane's progress file (`docs/delegation/<lane>-progress.md`). Record every completed recording with the §8 report.
4. Never put audio, transcripts, model weights or claims tables in git. Only the scripts, the museum's own cited prose, the `data/` facts and the documents change in the repository.
5. The Apple on-device engine is unavailable on the founder's Mac until the founder fixes Siri and system language; do not change those settings from a session.

## 1. What the method produces

Founder's decisions, 25 Oct 2026: assabile.com is authorised as an authentic store of the audio and video files of the speaker's lessons, and recordings are treated exactly like books. The archive may be used in full, as a book is: full details and full prose, written in the museum's own words, cited by series, episode and timestamp. A recording is never a mere pointer.

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
  2. the claims table records the line, its timestamp, the engine and the window. Engine output is used directly, without a second-engine agreement check (founder's decision, 25 Oct 2026).
  3. the founder or another reviewer may confirm a line by listening at its anchor; a line nobody has confirmed is marked `needs_source` in the entity or left out, never presented as checked;
  4. recitations of the Qur'an and quoted hadith are never written from the transcript (see the Qur'an rule above).
- **Dates and numbers** the speaker gives are his statements. Record them as his, with the anchor; never convert or "correct" them.
- **Faith.** The speaker's school is recorded only from two independent sources (`publication-standard.md`, the modern-figures faith rule). A lecture that expresses his own school is an attestation by the speaker himself and is recorded as such with its anchor, not as a museum judgement; it still counts as one source.
- **Describe, attribute, label.** Lecture material on contested questions (creed differences, madhhab differences, other religions, politics) goes into `perspectives` with the Sunni position first, labelled; no verdict in the museum's voice.
- **No honorifics typed** (the UI renders them); no figurative depictions.
- **Platform figures** (subscribers, views, plays) are dated platform numbers, never museum facts without a date.
- **Sites that forbid collection are not used.** Check the site's robots.txt and terms before the first bulk download. YouTube-hosted lectures are cited as pointers only: this method never downloads from YouTube (its terms forbid it; `publication-standard` and `15-local-harvest.md` §5 rule 5 apply).

## Include everything, and categorise it (founder, 25 Oct 2026)

These rules apply to every harvest, from recordings, books or any other source. They are the founder's standing decisions.

1. **Include everything intelligible, on any topic.** Nothing is dropped as "off-topic". If the topic has no entity yet, create one.
2. **Opinions and rants are content too.** A passage that is the speaker's own opinion, criticism or rant, and not a fact of a known category, is included. File it where it fits best: a `question` entity (the issue, with the view labelled and any tensions) when it answers a question; a `concept` under the closest category when it is an idea; or the person's record, under a heading that names it as his opinion, when it is about a person. Label the view as "speaker's view (opinion)" or "speaker's view (rant)" in the perspectives block.
3. **Tag what is contested or polemical.** Set `sensitivity: contested` on a record that holds disputed matter, and `sensitivity: polemical` on one that attacks a group or a person (described and cited, never reproduced in quotation). Both are visible on the site. Contested passages go in a `:::perspectives` block with the speaker's view first.
4. **Unverifiable figures and claims are kept**, marked `needs_source` in the YAML and the prose note. They are not dropped.
5. **Garbled or unclear material** cannot be written as content. The founder has decided that it may be discarded. A repetition loop is not speech and is not used.
6. **Qur'an and hadith wording is never typed as scripture.** Refer to a passage as `[[passage/quran-<sura>-<aya>|label]]` only when the speaker clearly names it, and cite what he says about it.
7. **Every excluded item is reported** with its reason, the gate it failed and its override, in the lane's progress file and in every progress report to the founder. Nothing is re-entered without the founder's written authorisation.

## 3. The Mac toolchain (checked 25 October 2026 on the founder's Mac)

| Job | Tool | Where it is |
|---|---|---|
| Discover recordings, read episode lists and media links | the built-in browser pane (`mcp__Claude_Browser__*`), read-only page extraction | desktop app |
| Bulk download, polite and resumable | `scripts/harvest/audio/download.py` (Python standard library; identified User-Agent; two-second pause; checksums) | repo |
| Audio probing and conversion | `ffmpeg`, `ffprobe` (Homebrew) | `/opt/homebrew/bin` |
| Speech to text, offline | `scripts/harvest/audio/transcribe.py` calling `mlx_whisper` with `mlx-community/whisper-large-v3-mlx` | `/opt/homebrew/Caskroom/miniconda/base/bin/mlx_whisper` |
| Egyptian and dialect-aware engine | `oddadmix/qwen3-asr-1.7b-arabic-dialectal-v2` (Apache-2.0; Qwen3-ASR-1.7B fine-tuned on dialectal Arabic; reported WER 0.322 on its Egyptian test split against 0.47 for the Whisper large-v3 LoRA on Egyptian MGB-3) through `scripts/harvest/audio/transcribe_qwen.py` in `$HARVEST/.venv-audio` (transformers 5.20, runs on the Mac's GPU, 30-second windows with timestamps). Used as the working engine for the pilot; agreement with other engines is not required (founder's decision, 25 Oct 2026). Alternatives kept for a later pass: `oddadmix/whisper-large-v3-turbo-arabic-dialectal-v2` (Apache-2.0, Whisper family) and `AbdelrahmanHassan/whisper-large-v3-egyptian-arabic` (Apache-2.0, LoRA, 100 training steps only) |
| Second and third speech engines | Voxtral Mini 3B (`mlx-community/Voxtral-Mini-3B-2507-bf16`) through `mlx-audio` in `$HARVEST/.venv-audio` (installed 25 Oct 2026 with PyTorch, `mistral-common`, `librosa`); Apple's on-device speech recognizer through `scripts/harvest/audio/apple-speech/main.swift` (compiled to `$HARVEST/bin/apple-speech`) | Voxtral gives plain text without timestamps on this file; Apple's engine needs Arabic dictation installed in System Settings (Keyboard > Dictation), a change only the founder makes; until then it refuses to run and sends no audio anywhere |
| Drafting and claim extraction | local Ollama models (`qwen3:32b`, `gemma4:26b`, judge from another family) under the strict rules of `feedback-local-model-drafting` and `scripts/harvest/library/draft_prose.py` | `ollama` |

**Model choice, measured on the first pilot episode (44 minutes, Arabic):**

- `whisper-large-v3-turbo`: about 60 seconds per episode, but visibly weaker Arabic (repeated lines, dropped words, misread verbs).
- `whisper-large-v3` (`mlx-community/whisper-large-v3-mlx`): about 3 minutes 15 seconds per 44-minute episode (about 13 times real time), clearly better. **This is the default.** Turbo is used only for a quick pass on a long series where time matters more than accuracy, and its output is never the basis of a quotation.
- The lecture audio is low quality (about 8 kHz mono, 8 kbit/s MP3 from the archive), so error rates stay high. The claims table records the engine and window for every line, so an error can be traced and corrected. Optional later diagnostic: a second pass on a noise-reduced copy (`ffmpeg -af "highpass=f=80,afftdn"` into the harvest workspace, never over the raw file), compared with `agree.py`; it is not a condition for use.

Cost: the whole corpus of one preacher with about 600 lessons is roughly 450 hours of audio, about 33 hours of Mac time at this speed. It runs in the background (`tmux` plus `caffeinate -dims`, as in `15-local-harvest.md` §9).

### 3.1 Setup on the founder's Mac (reproduce from here)

Everything below is outside git except the scripts. Paths assume the harvest workspace `~/islam-museum-harvest` (a link to `$HARVEST` on the external drive).

```bash
# 1. the audio venv: Python 3.12, mlx-audio (Voxtral), PyTorch (MPS), transformers >= 5.13 (Qwen3-ASR), librosa, mistral-common
cd ~/islam-museum-harvest && uv venv --python 3.12 .venv-audio && source .venv-audio/bin/activate
uv pip install mlx-audio torch torchaudio librosa mistral-common "transformers>=5.13" accelerate
deactivate
```

```bash
# 2. Whisper large-v3 for mlx (already in the Hugging Face cache; first use downloads it)
/opt/homebrew/Caskroom/miniconda/base/bin/mlx_whisper --help >/dev/null   # confirms the CLI; models download on first transcription
```

```bash
# 3. the Apple on-device engine (optional; see §3.2 before using it)
mkdir -p ~/islam-museum-harvest/bin
cd scripts/harvest/audio/apple-speech && swiftc -O main.swift -o ~/islam-museum-harvest/bin/apple-speech \
  -Xlinker -sectcreate -Xlinker __TEXT -Xlinker __info_plist -Xlinker Info.plist \
  && codesign --force -s - --identifier org.islam-museum.harvest.apple-speech ~/islam-museum-harvest/bin/apple-speech
```

The Qwen3-ASR model downloads on first use (about 3.5 GB) into the Hugging Face cache. The Voxtral model (`mlx-community/Voxtral-Mini-3B-2507-bf16`) downloads the same way through `mlx-audio`.

### 3.2 Known failure modes (read before you debug)

| Symptom | Cause found | What to do |
|---|---|---|
| `mlx_whisper` `turbo` output has repeated or invented lines | the turbo model is weaker on Arabic lectures | use large-v3 for the primary pass; turbo only for the second pass on denoised audio |
| Voxtral `ImportError` about PyTorch, `mistral-common` or `librosa` | the processor needs them | install the three packages in `.venv-audio` (§3.1) |
| Voxtral writes plain text, no timestamps | `mlx-audio` returns no segments for this file | use it for whole-episode comparison only, not per window |
| Qwen3-ASR `continue_final_message` error | the checkpoint's chat template does not take a forced language | do not force the language; use the prompt built in `transcribe_qwen.py` |
| Qwen3-ASR beam search error, or `Long, Int` dtype error | the pipeline API and MPS dtype do not match this checkpoint | use `AutoModelForMultimodalLM` with greedy decoding, as `transcribe_qwen.py` does |
| Apple tool: `Code 134`, `No Assistant asset for language ar-SA` | Arabic on-device speech needs a finished download under Dictation, plus an Arabic input source | see the steps in §3.3 |
| Apple tool: `SIGABRT`, crash report says "without a usage description" | the process must carry `NSSpeechRecognitionUsageDescription` in an embedded Info.plist, and macOS checks the responsible app | build with the `-sectcreate` flags of §3.1, sign ad hoc, and run from Terminal.app so the permission prompt belongs to Terminal |
| Apple tool: authorized, `onDevice: true`, but no output for minutes (even on 30 seconds of audio), 0% CPU | the on-device recogniser stalls on this Mac. A crash report from the same session showed Siri's Arabic setting marked ineligible while the system language was English | treat the Apple engine as unavailable on this Mac until Siri and system language are sorted by the founder; do not change those settings from a session |

### 3.3 Apple on-device Arabic: the checks Apple's documentation asks for

Apple's Dictation page says some languages are not available and points to the macOS Feature Availability page, which lists "Arabic" under on-device dictation with "Requires download of speech models". The steps that were needed and checked on 25 Oct 2026:

1. System Settings → Keyboard → Text Input → Input Sources includes an Arabic input source (here: "Canadian and Arabic").
2. System Settings → Keyboard → Dictation is on, and Languages lists Arabic (Saudi Arabia) and English.
3. The status check `~/islam-museum-harvest/scratch/locales/locales` prints `ar-SA available: true onDevice: true` (a small Swift program that calls `SFSpeechRecognizer.supportsOnDeviceRecognition`; rebuild it from the snippet in this section if the scratch folder is gone).

Steps 1–3 were not enough on their own: see the failure table above. The `SFSpeechRecognizer.supportsOnDeviceRecognition` reference says a `false` value means the recognizer needs the network.

## 3a. Video lessons: extract the audio, then harvest the audio (founder's instruction, 25 Oct 2026)

Video lessons are MP4 files. The harvest works on their audio track only, prepared in parallel with the queue:

1. Download each episode's MP4 politely (`download.py`, from the discovered manifest).
2. Extract the audio with `ffmpeg -vn -ac 1 -ar 16000 -c:a libmp3lame -b:a 64k` to `<series>/audio/epNN.mp3`. This is mono, 16 kHz, with no picture; the transcription library reads MP3 but not AAC in M4A.
3. Transcribe the MP3 with the working engine (`transcribe_qwen.py`) into the series' `pass5-qwen` folder. The queue skips episodes whose transcript already exists, so the main queue never repeats the work.

`scripts/harvest/audio/prep_video.sh` does all three steps for a list of series, resumably. The first test episode (Ajaeb Al Kulub, ep01, 7 min 18 s) extracted in under two seconds to 3.5 MB and transcribed in 77 seconds. Keep the MP4 files until the founder agrees to delete them; the audio files are what the harvest uses.

## 4. The pipeline, step by step

Work in the harvest workspace (`~/islam-museum-harvest`, a link to the external drive). Each step is restartable.

1. **Discover (browser).** Open the speaker's archive page and list the series. For each series open its page and read the episode list and the media links. The media files are plain URLs in the page (`media.<site>/…mp3`); read them from the page's HTML with a short script in the browser pane. Record one row per episode in a manifest TSV: `series_slug, episode, title, duration, url`. Use one page load at a time, with a pause between pages.
2. **Check the rights and the robots file** of the host once, and record the date in the source entity's `reliability_note`.
3. **Download.** `python scripts/harvest/audio/download.py --out $HARVEST/raw/<site>/<speaker>/ --manifest <manifest>.tsv`. Files land in `<series_slug>/epNN.mp3` with `SHA256SUMS`. Raw downloads are never edited.
4. **Probe.** `ffprobe -hide_banner <file>` for duration and tags. Record the duration in the manifest; the archive's own duration is a check.
5. **Transcribe** (large-v3, the primary pass). `python scripts/harvest/audio/transcribe.py --out $HARVEST/books/<site>/<speaker>/<series_slug> <files…>`. Output per episode: `epNN.json` (segments with start and end seconds), `epNN.txt` (lines prefixed `[hh:mm:ss]`), `epNN.meta.json` (model, input checksum, speed, machine). Resumable.
6. **Read and build a claims table** (harvest workspace, never git): claim, value, anchor `series/epNN hh:mm:ss`, the exact transcript line, a quote of at most 40 words if one is used, doubt flags, target entity. Search `data/` for each target first (reuse; add the new anchor as another cited claim).
7. **Record.** Use the working engine's output as the founder authorised. Record the engine and window in the claims table, and drop any line that is unclear.
8. **Write** the entity data (`data/…`), the Arabic prose first, then English and Urdu translations in the same commit (`docs/language.md`), every fact-stating sentence cited.
9. **Check.** `npm run cite-check -- <class/slug> …`, `npm run validate` (0 errors), `npm test`, and `npm run coverage` when entities change. `npm run build` for any change under `site/`.
10. **Regenerate the recording map** (`scripts/harvest/audio/regen_map.sh`) whenever a series manifest is added or changed, and before every deploy. Commit `site/src/data/recordings.json` with the content that links to it. A stale map means references lose their audio links.
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
5. `scripts/harvest/library/authenticity.yaml` (one `sources` entry, `allowed_uses: [pointer, text]`, the same uses as a book). The archive is not tier T1 and has no sample, so text use rests on the founder override `founder_override` (text, decided_by, date, reason), which `scripts/check-authenticity.ts` accepts only when all four fields are present and `docs/authenticity-ledger/websites/<domain>.yaml` (archive checks, evidence, history). Then `python3 scripts/harvest/library/authenticity_ledger.py --check` must report 0 problems.

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
| Claims | total claims, with engine and window recorded; lines dropped as unclear |
| Doubts | count of `needs_source` annotations and dropped lines |
| Commit | the commit or PR that carries it |

Every dropped or excluded item is listed under "Excluded items" in the lane's progress file, with the reason, the gate it failed and its override status. Nothing is re-entered without the founder's written authorisation.

Recordings that are downloaded or transcribed but not yet completed are listed separately with their status. Nothing is counted as completed on the strength of a transcript alone.
