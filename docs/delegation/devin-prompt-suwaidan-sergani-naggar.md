# Devin prompt: harvest Tareq al-Suwaidan, then Ragheb el-Sergani, then Zaghloul el-Naggar

_Paste this whole file into Devin. It runs in parallel with the Claude session that is harvesting Omar Abdelkafy, and it must not disturb that session. Read section 1 before anything else._

## 0. Your mission, in one paragraph

Harvest every lesson on the Assabile archive for three speakers, in this order: **Tareq al-Suwaidan** (https://www.assabile.com/tareq-al-suwaidan, 23 series, 402 lessons, all video), then **Ragheb el-Sergani** (https://www.assabile.com/ragheb-el-sergani, 1 series, 15 lessons, video), then **Zaghloul el-Naggar** (https://www.assabile.com/zaghloul-el-naggar, 2 series, 59 lessons: `el-hadara-el-nabaouia` 30 audio and `wa-yatafakkarun` 29 video). For each lesson: extract the audio of the video, transcribe it with the speech engine on the founder's Mac, and write the intelligible content into the museum as cited records (Arabic first, then English and Urdu). Do this autonomously, without asking anyone anything, until all three speakers are done. Commit, push, open a pull request and merge it every few harvested recordings. Report your progress every five minutes.

Work exactly as the Claude session does for Omar Abdelkafy. That session's documents are your method; read them in section 2.

## 1. Non-interference: do not break or disturb the Claude session

Another agent is working on this same Mac, on the same repository, right now. You must not touch its work.

- **Your own repository checkout.** Do not use `/Users/ahmedabdelaal/Documents/GitHub/islam-museum/.claude/worktrees/harvest-omar-abdel-kafi-content-81375c` (the Claude worktree) and do not check out or push its branch `claude/harvest-omar-abdel-kafi-content-81375c`. Create your own clone or worktree: `git clone` of the repository into `/Volumes/exmicroSD/devin-harvest/repo-suwaidan` (or `git worktree add /Volumes/exmicroSD/devin-harvest/repo-suwaidan -b devin/suwaidan-<date> origin/main`). Your branch is `devin/suwaidan-<yyyy-mm-dd>`, then `devin/sergani-…`, then `devin/naggar-…`.
- **Your own harvest workspace (not in git), on the microSD.** All downloaded files go to the microSD (`/Volumes/exmicroSD/`, which has about 370 GB free). Use `/Volumes/exmicroSD/devin-harvest/` only. Do not use `~/islam-museum-harvest` (the Claude session's folder). Your layout:
  - `/Volumes/exmicroSD/devin-harvest/raw/assabile/<speaker>/` — downloaded MP4 files, extracted MP3 audio, manifests.
  - `/Volumes/exmicroSD/devin-harvest/books/assabile/<speaker>/<series>/pass5-qwen/` — transcripts.
  - `/Volumes/exmicroSD/devin-harvest/logs/` — your logs.
  - `/Volumes/exmicroSD/devin-harvest/scratch/` — your temporary folders. Never write to `/tmp` shared paths used by others; use `/Volumes/exmicroSD/devin-harvest/scratch/`.
  - `/Volumes/exmicroSD/devin-harvest/.venv-audio/` — your own Python environment (create it; do not reuse the Claude session's venv, so a broken install of one cannot break the other).
- **Processes.** Start only the processes you start. Never run `pkill` or `killall` with a broad pattern; to stop your own process, use its PID from `$!` or `pgrep -f "devin-harvest"`. Never touch processes whose command line contains `islam-museum-harvest` (that is the Claude session's queue).
- **GPU.** The speech engine runs on the Mac GPU, which the Claude session also uses. Run **one** transcription process at a time, from your own queue. Expect slower transcription while the Claude session is busy; that is normal. Do not start a second transcription process.
- **Git.** Never force-push. Never reset, rebase or rewrite a branch someone else pushed. Before every push: `git fetch origin && git merge --no-edit origin/main`. If a merge conflicts, resolve it by keeping both sides' content (for prose, keep both sections; for YAML, keep both keys, never duplicate a key), then validate. Never commit `node_modules`, audio, video, transcripts or model weights.
- **Shared files.** `docs/coverage.md` conflicts often: on conflict, regenerate it (`npm run graph && npm run coverage`) and `git add` it. `scripts/harvest/sources.yaml`, `docs/status.md` and `i18n/*.yaml` are shared: append only; never replace them wholesale.

## 2. Read these first (binding; they override anything else)

In your clone, read completely:
1. `AGENTS.md`, then `docs/ai-change-gates.md`, `docs/sources-policy.md`, `docs/agents/publication-standard.md`, `docs/agents/content-standards.md`.
2. `docs/agents/audio-video-harvest.md` (the method: sections 0 to 8, including 3a "Video lessons: extract the audio, then harvest it", section 2's rules, and "Include everything, and categorise it").
3. `docs/delegation/omar-abdelkafy-handoff-prompt.md` (its sections 2 and 7 and rules 1 to 18 are the working rules; its section 5 lists known problems and their fixes — read it before debugging anything).
4. `docs/agents/lanes/omar-abdelkafy.md` (the lane model; you will open a lane for each speaker).
5. `docs/delegation/omar-abdelkafy-excluded-tafsir-writeup.md` and `docs/delegation/omar-abdelkafy-excluded-sharh-ketab.md` (the format for recording exclusions).

## 3. The founder's standing decisions (binding; apply all of them)

1. **Recordings are used like books.** Full details and full prose may be taken, written in the museum's own words, cited by series, episode and timestamp. A recording is never a mere pointer.
2. **assabile.com is an authorised source and an authentic store of audio and video** (founder, 25 Oct 2026). The text-use gate in `scripts/check-authenticity.ts` accepts the founder override recorded for `assabile.com` in `scripts/harvest/library/authenticity.yaml`. Do not remove it. Register the new speakers' source records as described in step 6.
3. **No second-engine agreement check.** The speech engine's output is used directly. Record the engine and window in the claims table. Never add a verification gate of your own.
4. **Include everything intelligible, on any topic.** Nothing is dropped as "off-topic". If a topic does not exist in `data/`, create it.
5. **Garbled or unclear windows may be discarded.** Do not write them as content and do not re-listen to them.
6. **Repetition loops are not speech** and stay out.
7. **Opinions and rants are content.** Include them under the closest category, labelled as the speaker's view (opinion) or (rant). Place them in a question entity when they answer a question, in a concept when they are an idea, or in the person's record when they are about a person.
8. **Contested matter is included and tagged** `sensitivity: contested`, with a `:::perspectives` block whose first entry is a Sunni entry marked "not yet sourced", then the speaker's view (labelled), then other views marked "not yet sourced". **Polemical attacks on a group or a person** are tagged `sensitivity: polemical`, described and cited, never reproduced in quotation.
9. **Unverifiable figures and claims are kept** with `needs_source` in the YAML and the prose note. They are not dropped.
10. **Qur'an and hadith wording is never typed as scripture.** Refer to a verse only as `[[passage/quran-<sura>-<aya>|label]]` when the speaker clearly names it, and cite what he says about it.
11. **Honorifics are never typed** (no ﷺ, no رضي الله عنه and the like; the UI renders them). **No figurative depictions.**
12. **Faith (school) is recorded only from two independent sources.** Default frame: Sunni, labelled; include Muslims by default, and exclude a person only where Wikipedia or Wikidata explicitly state a non-Sunni sect. Record the school of a speaker as `faith` only with two independent attestations; a lecture in which he states his own school is one attestation, recorded as his statement.
13. **Arabic first.** `content/ar/<class>/<slug>.md` first, then `content/en/…` and `content/ur/…` with the same facts and citations, in the same commit. `label.ar` and `summary.ar` are required.
14. **Every excluded item is reported** with its reason, the gate it failed and its override, in the speaker's progress file. Nothing is re-entered without the founder's written authorisation.
15. **Maps are part of the content.** Whenever a series manifest is added or changed, regenerate its recording map and commit it with the content that links to it; regenerate before every deploy (see step 7).
16. **Batches:** at most 25 new entities per commit; the commit message names the batch.
17. **Attribution trailers** on every commit: `AI-Agent: Devin`, `AI-Model: <the model you run as>`, `AI-Editor: Devin` (truthful values).

## 3a. Storage and deletion (founder, 25 Oct 2026)

18. **Delete the media once a series is fully harvested.** When a series' transcripts exist and its content is merged to `main`, delete its MP3, MP4 and extracted audio files (keep the manifests, `SHA256SUMS`, the transcripts and their metadata). Do not delete media for a series whose write-up is still pending.

## 4. Order of work, and what "done" means

Three speakers, one after another. Do not start a speaker until the previous one is finished.

**Speaker 1: Tareq al-Suwaidan** (`tareq-al-suwaidan`), 23 video series, 402 lessons. Series slugs in this order (the page order): `administrative-processus-abilities` (5), `al-mubdioune` (29), `al-wassitiya` (40), `alamani-al-tarikh` (29), `asrar-al-qyada-al-nbawya` (30), `conference-i-m-soul-mind-emotion-body` (2), `islamic-faces` (1), `kissa-wa-fikra` (29), `leadership-development-academy-1` (22), `leadership-development-academy-2` (6), `leqaa-al-jumu-ah` (1), `masabih-al-risala` (2), `mohadarat` (2), `mukhtarat` (1), `nesaa-khalidat` (30), `o-lord-3` (1), `rawai-hadaratina` (30), `sehir-al-quran` (29), `stories-of-the-prophets` (16), `tarikhona-fi-al-mizan` (30), `the-story-of-the-end` (27), `wind-of-change` (28), `wind-of-change-2` (12).

**Speaker 2: Ragheb el-Sergani** (`ragheb-el-sergani`), 1 video series: `what-did-muslims-bring-to-the-world` (15 lessons).

**Speaker 3: Zaghloul el-Naggar** (`zaghloul-el-naggar`), 2 series: `el-hadara-el-nabaouia` (30, audio) and `wa-yatafakkarun` (29, video).

"Done" for a speaker means: every lesson of every series is downloaded, its audio is extracted (video) or taken as is (audio), transcribed, and its intelligible content written up; every excluded window is recorded; the speaker's source record, progress file and recording map are committed and merged; and the final report is posted. Then move to the next speaker, without waiting for anyone.

Note: the archive's own lesson counts may differ slightly from the transcripts you produce (for example, a video page that does not load). Count from the files you have, and record any difference in the progress file.

## 5. The pipeline, step by step (use the repository's scripts; do not rewrite them)

Set the environment once:
```
cd /Volumes/exmicroSD/devin-harvest/repo-suwaidan   # your clone
export HARVEST=/Volumes/exmicroSD/devin-harvest
export SPEAKER=tareq-al-suwaidan   # then ragheb-el-sergani, then zaghloul-el-naggar
python3 -m venv /Volumes/exmicroSD/devin-harvest/.venv-audio && /Volumes/exmicroSD/devin-harvest/.venv-audio/bin/pip install -U mlx-audio torch torchaudio librosa "transformers>=5.13" accelerate mistral-common soundfile
```
(If `pip` fails on an optional package, install the rest and record what failed in the progress file; the speech engine needs `torch`, `transformers` and `librosa`.)

**A. Discover the episodes** (once per series; it writes a manifest):
```
/Volumes/exmicroSD/devin-harvest/.venv-audio/bin/python scripts/harvest/audio/discover_series.py --speaker $SPEAKER --series <slug> --out $HARVEST/raw/assabile/$SPEAKER/manifests
```
Video series: the series page lists no media; the script fetches each episode page (about 2 seconds each). Respect `robots.txt` (the script checks it). Never fetch faster than one page every two seconds.

**B. Download each episode's MP4** (polite, resumable, with SHA-256):
```
/Volumes/exmicroSD/devin-harvest/.venv-audio/bin/python scripts/harvest/audio/download.py --out $HARVEST/raw/assabile/$SPEAKER --manifest $HARVEST/raw/assabile/$SPEAKER/manifests/<slug>.manifest.tsv
```

**C. Extract the audio** (phase A of the mission: all the videos first). `scripts/harvest/audio/prep_video.sh` does B, C and D for a series in one run; to run only the extraction for every series, call the ffmpeg step directly:
```
ffmpeg -hide_banner -loglevel error -n -i <ep.mp4> -vn -ac 1 -ar 16000 -c:a libmp3lame -b:a 64k <ep>.mp3
```
into `$HARVEST/raw/assabile/$SPEAKER/<series>/audio/epNN.mp3`. The transcription library reads MP3, not AAC in M4A.

**D. Transcribe** (phase B: one process, one file at a time, on the Mac):
```
/Volumes/exmicroSD/devin-harvest/.venv-audio/bin/python scripts/harvest/audio/transcribe_qwen.py --out $HARVEST/books/assabile/$SPEAKER/<series>/pass5-qwen <audio files…>
```
It writes `epNN.json` (segments with start and end seconds), `epNN.txt` (lines `[hh:mm:ss] text`) and `epNN.meta.json`. It skips episodes already transcribed. Measured speed: about 7 to 10 times real time when the Mac is free, about 3 times when busy. A 60-minute lesson takes roughly 6 to 20 minutes. Expect days for the whole mission; that is normal.

Use `scripts/harvest/audio/run_queue.sh` if you prefer one queue that does A to D per series (it takes the speaker, your harvest root, your repo root and the series slugs); the repository's script is the same one the Claude session uses, so it stays valid.

**E. Extract the content** (phase C, Devin's own writing; start as soon as a series' transcripts are complete, while phase B continues on the next series). The Devin model reads the transcripts and writes the records, following section 6. Do not wait for the whole speaker to finish.

**F. Regenerate the recording map** for your speaker whenever a manifest is added or changed (rule 15):
```
bash scripts/harvest/audio/regen_map.sh /Volumes/exmicroSD/devin-harvest "$PWD" $SPEAKER
```
It writes `site/src/data/recordings.json`. Note: today the map is keyed for one speaker; if you need the site to link recordings of more than one speaker, extend `site/src/lib/recordings.ts` (`SPEAKER_BY_SOURCE`) and generate one map per speaker (for example `recordings-<speaker>.json`), keeping the existing Omar map working. Make that change as its own commit, keep it small, and test that the Omar references still resolve.

## 6. Writing the content (phase C)

For each series, after its transcripts exist:
1. Read every `epNN.txt`. Decide, window by window (30 seconds each), whether it is intelligible. Skip garbled windows and repetition loops; record each skipped range with its reason.
2. Search `data/` for an existing record by slug and by Arabic label before creating one. Extend existing records by **appended cited sections**; never overwrite a record another lane wrote.
3. Create new records in the right class (`concept`, `practice`, `person`, `event`, `place`, `work`, `question`, `building`, and so on). At most 25 new entities per commit.
4. Each record: `data/<class>/<slug>.yaml` with `label` (ar, en, ur), `summary` (ar, en, ur), `sources` (the speaker's source record, see step 7), `provenance` (layer `copyrighted-reference`, `generated_by`, `run: devin-<speaker>-<series>-1`, and a source string naming the transcripts and the engine), `status: { review: published, generated_by: … }`. Copy the shape of an existing record of the same class.
5. Each sentence that states a fact from a lecture ends with `{cite:assabile-<speaker-slug-as-in-the-source-id> <series>/epNN hh:mm:ss}`, where `hh:mm:ss` is the start of the window. Use the exact source id you register in step 7.
6. Quotations: at most 40 words, in quotation marks, with the anchor.
7. Arabic prose first; English and Urdu translations with the same facts and citations, in the same commit. A record without its translations is not committed.
8. Check each entity you created or extended: `npm run cite-check -- <class/slug> …` must pass. Then `npm run validate` must report 0 entity errors. Known pre-existing problems on `main` (for example two person records from another lane) are not yours to fix; report them and continue.
9. Spot-check about ten cited windows per series against the transcript before merging, and check every number, name and date against its window. Subagent prose written from noisy text has been wrong before; do not trust it unchecked.

## 7. Source records, registration and maps (do once per speaker)

- `data/source/assabile-<speaker>.yaml`: `kind: primary`, `type: audio`, `publisher: Assabile`, `URL` (the speaker's page), `language: ar`, `reliability_note` (the speaker's own lectures on the archive; a primary source for what he says, not for history; the transcripts are imperfect and names, numbers and dates from them are checked by a second look or kept as `needs_source`; the date you checked the site), `open_access: true`, `status: { review: published, generated_by: "Devin" }`. The source id is `source/assabile-<speaker-short-name>` (for example `source/assabile-tareq-al-suwaidan`). Use the same id in every `{cite:}`, with the `assabile-<speaker>` form the citations use.
- Add one row for the speaker to `docs/attribution.md` and one entry to the source-families table in `docs/agents/source-families.md`.
- The archive itself (assabile.com) is already registered and authorised; do not add it again.

## 8. Commits, pull requests and merges (every few recordings)

- Commit every few harvested recordings (about every 3 transcribed series-episodes with written content, or at most 25 new entities): one commit per batch, with explicit paths (`git add <paths>`; never `git add -A`), the batch named in the message, the trailers, and the validation output in the body. Commit the progress file (`docs/delegation/<speaker>-progress.md`) in the same batch.
- Then: `git fetch origin && git merge --no-edit origin/main`, resolve as in section 1, validate again, `git push origin HEAD:devin/<branch>`, open a pull request into `main`, and **merge it with a merge commit without waiting for CI or tests** (the founder's instruction). If GitHub reports "not mergeable" right after a push, wait a few seconds and merge again.
- If validation fails because of a file you did not write, do not fix that file; record it in the progress file and continue with your files.

## 9. Progress reporting (every five minutes, on the screen)

Every five minutes, print and report a status block:
- the time; the speaker, series and episode in progress; the lessons transcribed, out of the speaker's total and out of the 622-lesson figure of the Omar lane for reference;
- the extraction counts since you started: prose files per language, persons, places, events, other entities, claims (cited windows), `needs_source` count, contested and polemical records, opinions included;
- the exclusions since the last report, each with its reason, the gate and its override status;
- what you committed and merged in the last five minutes, with PR numbers;
- problems and what you did about them.

## 10. Known problems (learned in the Claude session; check here before you debug)

- **Timeline/Astro frontmatter.** After editing an `.astro` file, check that its frontmatter fences (`---`) are present. A missing fence broke the site build once.
- **Path lists with zsh.** Use `git status --short data content | awk '{print $2}' | xargs git add --`, not `git add -- $VAR` with a newline-separated list.
- **Merge conflicts in `docs/coverage.md` or in a person's `provenance`.** Regenerate coverage; merge two provenance blocks into one, keeping the other under `also:`.
- **Transient "not mergeable".** Wait a few seconds and merge again.
- **Subagent perspectives openers with four or five colons** do not match the renderer; normalise to three. Urdu Sunni labels must read "أهل السنة: …" marked "not yet sourced".
- **Missing translations** are a failure. Check that every new Arabic record has `content/en` and `content/ur` in the same commit.
- **Transcription library reads MP3, not M4A.**
- **Two queues on one GPU** do not shorten total time; run one transcription process.
- **The site build may be slow or fail on another lane's pages** (a teen-hub weight budget once failed). Do not wait on the build or CI; report what fails.
- **Stale notifications from earlier agents** can repeat old reports. Check the repository and the processes directly.

## 11. Stop conditions

- Stop only when all three speakers are fully harvested and their final reports are posted. Between speakers, continue without asking.
- If a step is blocked by something outside your work (the Mac is asleep, the network is down, the archive refuses requests), wait as long as it takes with a bounded retry (for example every 10 minutes), and keep reporting every five minutes. Never guess at data you cannot read.
- Never change the gates in `scripts/check-authenticity.ts` or the authenticity register beyond the founder's recorded override.
- Never push to, merge into, or rewrite the Claude session's branch `claude/harvest-omar-abdel-kafi-content-81375c`, or the `main` history.
