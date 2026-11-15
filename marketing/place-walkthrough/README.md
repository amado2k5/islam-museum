# The Place map: a walkthrough film

A narrated walkthrough of the Place map (`/ar/place/`, `/en/place/`) for social media, in Arabic and in English, each in two shapes: landscape 16:9 (1920×1080, for YouTube and Facebook) and vertical 9:16 (1080×1920, for TikTok, Instagram Reels, YouTube Shorts and Facebook Reels). Requested by the founder on 15 November 2026. Built with [HyperFrames](https://hyperframes.heygen.com); the demo footage is the live site itself.

| File (in `renders/`, not in git) | Length |
| --- | --- |
| `islam-museum-place-walkthrough-en-16x9.mp4`, `-en-9x16.mp4` | 2:23 |
| `islam-museum-place-walkthrough-ar-16x9.mp4`, `-ar-9x16.mp4` | 2:32 |
| `islam-museum-place-walkthrough-en.srt`, `-ar.srt` | subtitles for the platforms that take a file |

## What the film does

One example worked through, then the wider museum:

| Scene | What is on screen | What is said |
| --- | --- | --- |
| hook | Medina on the map, then the whole world of lights | What happened here? And here? Every light on this map is a place in the story of Islam. |
| reveal | The page with the museum's header; the map is asked to fill the screen | This is the Place map at islam.museum: a free, online museum of Islam |
| world | The twelve regions; Play is pressed and the years run | 3,875 places, in twelve regions. Press play, and time begins to move |
| place | A region is chosen, then Medina; its ring of linked records | Around it, 693 linked records |
| person | Abu Bakr al-Siddiq is chosen from the ring | Born in Mecca, died in Medina |
| entry | His own page is opened, down to its sources | Read the full page, with its dates and its sources |
| search | "Cordoba" is typed; the map flies there | Ibn Rushd, the Great Mosque |
| web | Cordoba to Ibn Rushd to Marrakesh to an Almohad caliph | History is not a list. It is a web |
| menu | The site's Explore menu, scrolled | And the map is only one door |
| graph | The Connections explorer; another entry is made the centre | Any name becomes a constellation |
| tour3d | The 3D virtual tour: the Grand Hall | A Grand Hall, with nine wings |
| grand | The Grand Tour: the River of Time | Fourteen centuries, in forty stops |
| tb, quran, companions, inventions, kids | Timeline Explorer, the Mushaf and the hadith library, the Companions Browser, the Inventions Browser, the Kids' Wing | one short line each |
| numbers | Tiles of sixteen other browsers, with the figures | More than fifty explorers and browsers. More than 63,000 records. In Arabic, English and Urdu |
| close | The whole map with the years running | It is a whole new world … Come in. Stay as long as you like |
| end | The mark, the name, the site's own line | islam.museum. Free, with no ads, forever |

The full narration is in `script/en.json` and `script/ar.json` (`say` is what the voice reads, `show` is the caption).

## Every claim and where it is from

Read from the live site on 15 November 2026. Re-read each before re-rendering on a later day; the recorder stops if a label it needs is gone, but it does not check the numbers in the narration.

| In the film | Source on 15 November 2026 |
| --- | --- |
| 3,875 places, twelve regions | The Place page itself ("Index of the 3,875 places on the map"; the regions list) |
| 693 records linked to Medina | The map's panel for Medina, in both languages |
| Abu Bakr al-Siddiq: born in Mecca, died in Medina | His ring on the map ("Born in", "Died in") |
| Ibn Rushd, the Great Mosque of Cordoba | Cordoba's ring ("Born here", "Stands here") |
| The entry page has its dates and its sources | `/person/abu-bakr/`: "Life in time" and the "Sources" list, both shown |
| A Grand Hall with nine wings | The 3D tour's own text (`i18n`, `tour.enter_lede`) |
| Fourteen centuries in forty stops | The Grand Tour page ("Stops: 40 · Wings: 9 · Centuries: 14") |
| More than fifty explorers and browsers | The Explore menu in the site header lists 59 entries |
| 63,078 records; "more than 63,000" | `https://api.islam.museum/api/v1/meta/counts.json`, `entities`. The card carries the note "Record pages on 15 November 2026, drafts included", because the figure counts every record with a page of its own, drafts and source records among them (`docs/audit/public-claims-audit-2026-11-15.md`, section 1) |
| Arabic, English and Urdu | The site's three languages. The Grand Tour is Arabic and English only; the film does not say otherwise |
| Free, with no ads, forever | The site's own line (`i18n/en.yaml`, `i18n/ar.yaml`) |
| "a new way to discover Islam that, we believe, has never existed before" | The founder's own claim. It cannot be verified, so it is worded as the museum's belief, not as a fact (`AGENTS.md`, "Truth in every public claim") |
| End card: "Recorded from the live site, 15 November 2026 · AI-narrated · Music: the museum's own Fourteen Centuries" | See "Voice" and "Sound" below |

The film says nothing about who wrote the records, how they were reviewed or what they cost. Where it shows an entry page, the page's own notice ("written with AI help … not yet read by a human editor") is on screen.

## How it is made

```bash
cd marketing/place-walkthrough
# 1. Voice (once per script change)
node scripts/voice_en.mjs                       # English: Kokoro, needs .venv-kokoro (pip: kokoro-onnx soundfile)
.venv-voice/bin/python scripts/voice_ar.py      # Arabic: SILMA TTS, four takes of every sentence
python3 scripts/voice_pick.py ar                # keeps the take Whisper hears most exactly (needs mlx-whisper)
python3 scripts/voice_pick.py en                # checks the English the same way
# 2. For each language: time the film from the voice, lay the audio, record the site, compose, render
node scripts/plan.mjs en && node scripts/audio.mjs en
node scripts/record.mjs en wide && node scripts/record.mjs en tall && node scripts/stills.mjs en
node scripts/compose.mjs en wide && node scripts/compose.mjs en tall
(cd film/en-wide && npx hyperframes check && npx hyperframes render --quality delivery --video-frame-format png -o ../../renders/islam-museum-place-walkthrough-en-16x9.mp4)
(cd film/en-tall && npx hyperframes check && npx hyperframes render --quality delivery --video-frame-format png -o ../../renders/islam-museum-place-walkthrough-en-9x16.mp4)
```

- **The voice is the clock.** `scripts/plan.mjs` reads the length of every spoken sentence and writes `build/<lang>/plan.json`: when each scene starts and when each sentence starts inside it. The recorder and the composition both read that file, so a click lands on its word and cannot drift.
- **The footage is the real site.** `scripts/rec.mjs` drives a headless Chromium with real clicks and typing. Only the clock is replaced: it is stepped one video frame at a time and a screenshot is taken after each step, so the motion is smooth however long the browser took to draw. Loading time is not filmed. `scripts/shots.mjs` is the choreography; "wide" is the desktop layout at 1280×720, "tall" the phone layout at 540×650.
- **`film/` is written by `scripts/compose.mjs`** and is not in git: one HyperFrames project per film, plain HTML that can be edited by hand or in the HyperFrames app. Running the script again overwrites it.
- Not in git, by the repository's rule on media: `renders/`, `footage/`, `voice/`, `build/`, `film/`, the music file and the two Python environments.

## Voice

Both voices are synthetic, made on the founder's Mac, and the end card says so.

- **English**: Kokoro (`af_heart`, Apache-2.0), speed 0.94, about 174 words a minute.
- **Arabic**: SILMA TTS v1 (weights Apache-2.0, code MIT), with the Arabic reference voice that ships with the model, formal Arabic, fully vowelled by hand in `script/ar.json` so that no automatic diacritiser guesses a case ending; read 10% faster than the model's own pace. The model's licence asks that AI-made audio be disclosed when shared.
- Every sentence was transcribed back with Whisper and compared with the script (`voice/<lang>/check.json`). **The voices were checked this way, not listened to**, by the agent that built the film; a person should listen once before posting. Two Arabic sentences were reworded because a one-word sentence came out unclear (the city's name alone, and "come in").
- SILMA on a Mac: two of its dependencies have no macOS build and are not needed here (`scripts/silma_shim.py` says why). Install it with `uv pip install --no-deps silma-tts catt_tashkeel` plus the packages it lists, `onnxruntime` in place of `onnxruntime-gpu`, and without `nemo_text_processing`.

## Sound

The bed is the museum's own track "Fourteen Centuries" (the file used is "Fourteen Centuries (Restructured)" from the founder's Music library; `MUSIC=<file> node scripts/audio.mjs <lang>` points at another). Its wide dynamics are evened out so that it sits about 14 dB under the voice, and it rises after the last sentence. Measured on the renders: −16.8 LUFS integrated for the English films and −17.3 for the Arabic, peak −3.1 dBFS. The finished mixes were transcribed with Whisper as well: every sentence is heard over the music, in order and at its planned second. The sound was measured and transcribed, not listened to. There are no sound effects.

## Seen while filming (reported, not fixed here)

- **Phone layout, full-screen map**: the map's status line (`.pm-status`) lies over the list of search results and takes the tap, so a result cannot be chosen by touch; the film chooses it with the keyboard's Go key instead. Seen at 540 px wide in automated Chromium; not checked on a phone.
- **Phone layout, 3D tour**: at 540 px wide the "Journey Through Time" button overlaps the "Grand Hall" label.
- A region's name is hidden on the world view whenever it would overlap another name, so which names show depends on the window's size.

## Review notes

- Storylines considered and not built: a single "one life on the map" film that follows Ibn Battuta's journey from end to end, and a fast 30-second montage with no narration. The walkthrough was chosen because the request was for a step-by-step demonstration.
- Longest for a vertical platform: 2:23 and 2:32 are within every platform's limit, but long for TikTok and Reels. A 30 to 40 second cut of the hook, the Medina ring and the close could be made from the same footage.
- `npx hyperframes check` passes with these kept on purpose: the captions file holds every caption group (one per sentence part), and the voice file is a few hundredths of a second shorter than its slot.
- No Urdu cut.
