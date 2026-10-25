# Handoff prompt: finish the Omar Abdelkafy lecture harvest (for Devin)

_Written 25 October 2026 by the Claude session that started the work, so that another agent can pick it up if that session runs out of credit. Read it completely before you start. Do not skip the rules in section 2._

## 0. Start here, in this order

1. **Get the latest code first.** `git fetch origin` and check out `origin/main`. Read `git log --oneline origin/main -20`. Create your own branch from `origin/main`, named `devin/omar-abdelkafy-<short-date>`. Never work on someone else's branch. Never force-push. Never commit to `main` directly; open a pull request.
2. Read these files, in this order:
   - `AGENTS.md` (the rules that never bend), then `docs/ai-change-gates.md`.
   - `docs/agents/README.md`, then `docs/agents/audio-video-harvest.md` (the method, sections 0 to 8).
   - `docs/agents/lanes/omar-abdelkafy.md` (the lane) and `docs/delegation/omar-abdelkafy-progress.md` (the live state, the excluded-items table and the decisions).
   - `docs/agents/publication-standard.md`, `docs/agents/content-standards.md`, `docs/sources-policy.md`, `docs/agents/workflow.md`.
3. Find the state on the Mac (section 3). If the Mac workspace is not reachable, follow section 6.

## 1. The task

The founder's goal: **every lecture of Sheikh Omar Abdelkafy on the Assabile archive is transcribed and its intelligible content is extracted into the museum, in Arabic first, with English and Urdu translations, every fact sentence cited to the lecture by series, episode and timestamp.**

- Archive: `https://www.assabile.com/omar-abdelkafy` (25 series, 622 lessons: 7 video series with 213 lessons, 18 audio series with 409 lessons).
- Done before this handoff: `aadau-al-islam` (4 lessons) and `al-hoquq` (5 lessons), transcribed with the working engine, and their prose written and committed (see section 4).
- Remaining: 23 series, 613 lessons. Section 4 lists them in the order the queue processes them.

## 2. Rules that have been decided (binding; these override older text)

Founder's decisions, 25 October 2026. Each one is also recorded in the progress file.

1. **Recordings are used like books.** Full details and full prose may be taken from them, written in the museum's own words, cited by series, episode and timestamp. A recording is never a mere pointer.
2. **assabile.com is authorised as an authentic store of the audio and video.** The text-use gate in `scripts/check-authenticity.ts` accepts the founder override recorded for `assabile.com` in `scripts/harvest/library/authenticity.yaml` (`founder_override`). Do not remove it.
3. **The two-engine agreement check is removed.** The output of the working engine (Qwen3-ASR, see section 3) is used directly. Record the engine and the window in the claims table. `agree.py` is only an optional diagnostic.
4. **Add everything intelligible, on any topic.** Nothing is dropped as "off-topic". If a topic does not exist in `data/`, create it.
5. **Garbled or unclear windows may be discarded** (founder, 25 Oct 2026). Do not write them as content and do not re-listen to them.
6. **Repetition loops are not speech** and stay out.
7. **Contested matters are included, tagged.** Put each contested passage in a `:::perspectives` block with the speaker's view first, labelled as his view, and mark the other views "not yet sourced". Set `sensitivity: contested` on the record. The site shows a "Contested" notice for that tag. The validator requires the first perspectives entry to be Sunni: until the founder decides otherwise, use a Sunni entry marked "not yet sourced" first, then the speaker's view, then the academic and other views, also marked "not yet sourced". Set `sensitivity: polemical` on any record that attacks a group or a person.
8. **Individual figures and claims are added**, with `needs_source` where they cannot be verified. Do not drop them.
9. **Qur'an and hadith wording is never typed as scripture.** Refer to a passage as `[[passage/quran-<sura>-<aya>|label]]` only when the speaker clearly names it, and cite what he says about it.
10. **Every excluded item is reported** with its reason, the gate it failed and its override, in the progress file's excluded-items table, and in every progress report to the founder. Nothing is re-entered without the founder's written authorisation.
11. **Status of extended records.** The seven extended records from the pilot still carry `status.review: draft`. Decide with the founder before changing them (see the progress file).
12. **Honorifics are never typed** (no ﷺ or the Sunni formulae in prose; the UI renders them). **No figurative depictions.**
13. **Arabic first.** `content/ar/<class>/<slug>.md` first, then `content/en/...` and `content/ur/...` with the same facts and citations. `label.ar` and `summary.ar` are required.
14. **Batches:** at most 25 entities per commit. The commit message names the batch.
15. **Opinions and rants are content too** (founder, 25 Oct 2026). If a passage is the speaker's own opinion, criticism or rant and not a fact of a known category (person, place, event, practice, concept), include it anyway. Place it where it fits best: a `question` entity (the issue, with the speaker's view as a labelled perspective and any tensions) when it answers a question; a `concept` with the closest category (for example `social` or `ethical`) when it is an idea; or the person's record, in a section headed as the speaker's opinion, when it is about a person. Label the view in the perspectives block as "speaker's view (opinion)" or "speaker's view (rant)". Set `sensitivity: polemical` when it attacks a group or a person (described and cited, never reproduced in quotation). Set `sensitivity: contested` when the matter is disputed. Do not drop opinions for lack of a category.
16. **Include everything, categorised** (founder, 25 Oct 2026; full rule in `docs/agents/audio-video-harvest.md`, section "Include everything, and categorise it"). Every intelligible passage is used, whatever its topic; opinions and rants are filed under the closest category with the speaker's view labelled; unverifiable figures are kept with `needs_source`; garbled material may be discarded; repetition loops are not speech.

17. **Maps are part of the content.** Whenever a series manifest is added or changed, and before every deploy, run `bash scripts/harvest/audio/regen_map.sh ~/islam-museum-harvest "$PWD" omar-abdelkafy`, which regenerates `site/src/data/recordings.json` from every manifest on disk. Commit the regenerated map in the same commit as the content that links to it. The recording map is what makes each reference link to the audio at its time; a stale map means missing links.

## 3. Where everything is (the Mac that did the work)

- **Repository (this worktree):** `/Users/ahmedabdelaal/Documents/GitHub/islam-museum/.claude/worktrees/harvest-omar-abdel-kafi-content-81375c`, branch `claude/harvest-omar-abdel-kafi-content-81375c`. The merged work is on `main` (PRs #1591, #1604, #1616, #1651).
- **Harvest workspace (not in git):** `~/islam-museum-harvest`, a symlink to `/Volumes/exmicroSD/islam-museum-harvest`. If the drive is not mounted the link is broken.
  - `raw/assabile/omar-abdelkafy/<series>/` — the downloaded audio and video (`epNN.mp3` or `epNN.mp4`) with `SHA256SUMS`.
  - `raw/assabile/omar-abdelkafy/manifests/<series>.manifest.tsv` — one row per episode (series_slug, episode, title, duration, url). Written by discovery.
  - `raw/assabile/omar-abdelkafy/<series>.manifest.tsv` — the manifests for the pilot series (`aadau-al-islam`, `al-hoquq`).
  - `books/assabile/omar-abdelkafy/<series>/pass5-qwen/` — the working engine's output: `epNN.json` (segments with start and end seconds), `epNN.txt` (lines prefixed `[hh:mm:ss]`), `epNN.meta.json` (model, licence, device, input checksum, timings). Output for the pilot is in `books/assabile/omar-abdelkafy/aadau-al-islam/pass5-qwen/` and `…/al-hoquq/pass5-qwen/`.
  - `books/assabile/omar-abdelkafy/aadau-al-islam/` also holds large-v3 (`epNN.json`, mlx-whisper) and turbo passes, kept for reference only.
  - `logs/` — `queue-omar.log` (the queue), `qwen-*.log`, `build-*.log`, `validate-*.log`.
  - `bin/apple-speech` — Apple on-device speech tool. **Unavailable on this Mac** (see section 5). Do not use it.
  - `.venv-audio/` — the Python environment for the transcription (Python 3.12; mlx-audio, torch, transformers 5.20, librosa, mistral-common).
  - `scratch/` — scratch files. Use a scratch directory; do not write to `/tmp`.
- **Scripts (in the repo, `scripts/harvest/audio/`):**
  - `discover_series.py` — reads a series page and its episode pages, writes the manifest. Fetches `robots.txt` with our own User-Agent. Two-second pause.
  - `download.py` — downloads a manifest politely and resumably, with SHA-256 per file.
  - `transcribe_qwen.py` — the working engine. 30-second windows with timestamps; resumable.
  - `run_queue.sh` — the queue (discover, download, transcribe, per series).
  - `recordings_map.py` — writes `site/src/data/recordings.json` from the manifests (the site links to the original media).
  - `transcribe.py` (mlx-whisper large-v3) and `agree.py` (diagnostic only) — optional.
- **Queue command (the one running on the Mac when this was written):**
  ```
  caffeinate -dims bash scripts/harvest/audio/run_queue.sh omar-abdelkafy ~/islam-museum-harvest "$PWD" tafsir-al-quran-al-qareem al-fawzu-al-moubeen sharh-ketab-al-fawaed al-dinu-al-qayem sharh-al-hekam-al-ataeya nafahat-ramadaneya-1436-h silsilat-qissa-wa-ebra al-manjeyat wa-nafsun-ma-sawaha tariq-al-noor bustan-el-amal al-dar-al-akhera silsilat-ebadu-al-rahman muktatafat-mena-al-seera albuyout-alamena sharh-saheeh-al-bukhare al-naba-al-safi ahl-al-hikma mawkib-al-nour ajaeb-al-kulub min-kunuz-al-sunnah modakirate-iblis alwaad-alhaq
  ```
  It is resumable: run the same command again and it skips finished downloads and transcripts.
- **Working-engine model:** `oddadmix/qwen3-asr-1.7b-arabic-dialectal-v2` (Apache-2.0, Hugging Face; fine-tuned on Arabic dialects, including Egyptian). Base model `Qwen/Qwen3-ASR-1.7B-hf`. Run on the Mac GPU (MPS) with PyTorch; about 7 to 10 times real time. Forcing the language breaks the chat template, so the script does not force it.
- **Archive URLs:**
  - Series page: `https://www.assabile.com/omar-abdelkafy/lessons/<series-slug>`
  - Episode page: `https://www.assabile.com/omar-abdelkafy/lessons/<series-slug>/episode-<NN>`
  - Media: `https://media.assabile.com/assabile/lessons_8234632432/mp3/omar-abdel-kafy/…` (audio) and `…/mp4/…` (video). Both are linked from the pages.
  - `robots.txt` at `https://www.assabile.com/robots.txt` does not disallow the lesson pages or the media host (checked 25 October 2026).

## 4. What is done, and the queue order

Done and committed (see `git log` for the hashes):
- `aadau-al-islam` (4 episodes): transcribed; 4 new entities and 7 extended, committed (`dcf9f0520`), merged.
- `al-hoquq` (5 episodes): transcribed; 6 new entities and 8 extended, committed (`635866fe8`), local until pushed.
- Founder decisions and the override: committed (`e6baea03f`, `c435bc2fb`, `fa45086ef` and others).

Queue order (the queue runs them in this order, shortest first):

| Series | Type | Lessons |
|---|---|---|
| tafsir-al-quran-al-qareem | audio | 10 |
| al-fawzu-al-moubeen | audio | 14 |
| sharh-ketab-al-fawaed | audio | 10 |
| al-dinu-al-qayem | audio | 13 |
| sharh-al-hekam-al-ataeya | audio | 17 |
| nafahat-ramadaneya-1436-h | audio | 6 |
| silsilat-qissa-wa-ebra | audio | 22 |
| al-manjeyat | audio | 27 |
| wa-nafsun-ma-sawaha | audio | 29 |
| tariq-al-noor | audio | 30 |
| bustan-el-amal | audio | 30 |
| al-dar-al-akhera | audio | 33 |
| silsilat-ebadu-al-rahman | audio | 28 |
| muktatafat-mena-al-seera | audio | 24 |
| albuyout-alamena | audio | 47 |
| sharh-saheeh-al-bukhare | audio | 60 |
| al-naba-al-safi | video | 24 |
| ahl-al-hikma | video | 27 |
| mawkib-al-nour | video | 29 |
| ajaeb-al-kulub | video | 29 |
| min-kunuz-al-sunnah | video | 30 |
| modakirate-iblis | video | 30 |
| alwaad-alhaq | video | 44 |

Total remaining: 613 lessons. (The archive's counts are in `docs/agents/lanes/omar-abdelkafy.md`.)

## 5. Known problems and their fixes (learned the hard way)

| Symptom | Cause | Fix |
|---|---|---|
| `ModuleNotFoundError: librosa` | the script was run with the system Python | run with `~/islam-museum-harvest/.venv-audio/bin/python` |
| `Code 134`, no output, "No Assistant asset for ar-SA" | Apple's on-device Arabic is not usable on this Mac (Siri language is ineligible while the system is English) | do not use the Apple tool; it stays unavailable until the founder fixes Siri and the system language |
| Qwen: `continue_final_message` error | forcing the language breaks the chat template | do not pass a language; the script builds its own prompt |
| Qwen: `MPSBFloat16` / `Long, Int` error | the pipeline API passes floats to this checkpoint | use `AutoModelForMultimodalLM` with greedy decoding, as `transcribe_qwen.py` does |
| `robots.txt` says disallow for lesson pages | Python's default User-Agent is refused, which reads as "disallow all" | `discover_series.py` fetches robots.txt with our User-Agent (already fixed) |
| `mpg123: part2_3_length too large` | a few corrupt MP3 frames in the archive file | harmless; a few windows may be affected |
| `ls | grep` shows scripts, `for f in $VAR` does not split | the shell is zsh | use arrays (`PATHS=(…)`) or explicit paths |
| `sleep` blocked in the tool | the tool forbids chained sleeps | use a background job and check it later |
| `set -e` aborts a loop | any failed `curl` or step | the queue uses `|| continue` on each step |

## 6. If the Mac is not reachable (fallback for Devin on another machine)

- The working engine can run on any machine with PyTorch and transformers 5.13 or later. On a machine without a GPU, `transcribe_qwen.py` runs on CPU; it is slower (budget several times the audio length).
- Audio and video from the archive can be re-downloaded with `download.py` from the manifests (or `discover_series.py` to rebuild them). The manifests are reproducible from the public pages.
- Do not commit audio, video, transcripts, `SHA256SUMS`, model weights or claims tables. Only the scripts, the museum's own cited prose, `data/` facts, the progress file and the site change go in git.

## 7. Extraction, one series at a time

For each series once its transcripts exist:
1. Read the series' `epNN.txt` files. Lines are `[hh:mm:ss] text`, one 30-second window per line.
2. Identify every intelligible window (any topic). Scan every window not yet cited for opinions, criticism and rants as well as facts; file each under the closest category (decision 15). Report the count of opinions and rants separately. Skip garbled windows (discarded by decision 5) and repetition loops (decision 6). Note the windows you skip, with the reason.
3. Search `data/` for an existing entity first (by slug and by Arabic label). Extend it with an appended cited section rather than overwrite. Create new entities where none exist, in the right class (concept, practice, person, event, place, work).
4. For each entity: `data/<class>/<slug>.yaml` (label, summary, sources including `source/assabile-omar-abdelkafy`, provenance with the engine and the transcripts named, `status: { review: published, generated_by: ... }`) and `content/{ar,en,ur}/<class>/<slug>.md` with every fact sentence ending in `{cite:assabile-omar-abdelkafy <series>/epNN hh:mm:ss>}`.
5. Quotations at most 40 words, in quotation marks, with the anchor.
6. Contested matters: decision 7. Figures and claims: decision 8.
7. Check with `npm run cite-check -- <class/slug> …` (must pass), then `npm run validate` (0 errors), then `npm test`. Run `npm run graph && npm run coverage` in the same commit as any change to entities, and commit `docs/coverage.md`.
8. Commit with explicit paths (never `git add -A`), with the trailers `AI-Agent:`, `AI-Model:`, `AI-Editor:` (truthful; for Devin, its own values), in batches of at most 25 entities. Push your branch, open a pull request, and report.
8a. Before every deploy, regenerate the recording map from every manifest on disk so that references link to the archive's audio: `python3 scripts/harvest/audio/recordings_map.py <manifests> --speaker omar-abdelkafy --out site/src/data/recordings.json`, then commit it. Series without a map entry still get their episode page, but no direct audio link.
8b. Regenerate the recording map (`bash scripts/harvest/audio/regen_map.sh ~/islam-museum-harvest "$PWD" omar-abdelkafy`) and commit it with this series' content (rule 17).
9. Update `docs/delegation/omar-abdelkafy-progress.md`: the series done, the counts, and the excluded-items table (reason, gate, override). Commit it.

Attribution format (from the repository rules): `AI-Agent: <agent>`, `AI-Model: <model>`, `AI-Editor: <editor>`.

## 8. Reporting

- Report every progress update with: the time; the series and episode in progress; series and lessons completed out of 25 and 622; extraction counts (prose files per language, persons, places, events, other entities, claims); and the excluded items, each with its reason, the gate it failed and its override.
- Report the overall totals as the founder asked: video and audio lessons on Assabile, what was done and what remains.
- Do not claim a count you have not checked. Count from the files.

## 9. Commands to check the state quickly

```
date
grep -E "^done|^skip" ~/islam-museum-harvest/logs/queue-omar.log | tail -n 20
tail -n 3 ~/islam-museum-harvest/logs/queue-omar.log
ls ~/islam-museum-harvest/books/assabile/omar-abdelkafy/*/pass5-qwen/ | grep -c "^ep[0-9]*\.json$"
git status --short data content | wc -l
git log --oneline origin/main -5
```

## 10. Stop conditions

- Stop and ask the founder when: a gate fails and no override exists; a decision in section 2 seems to conflict with another document; a series page has a format this handoff does not cover; or the workspace is missing.
- Do not change the gates in `scripts/check-authenticity.ts` or the authenticity register without the founder's written authorisation, except the recorded override already in place.
