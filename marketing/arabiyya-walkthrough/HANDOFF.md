# Handoff: a walkthrough film of the Arabic Language Browser (Arabic only)

Written by Claude Fable 5.2 on 22 November 2026 for the model that continues this work. Read all of it before you run anything. The founder asked for a film "of the same quality" as the Arabic Place map film, for the newest Arabic browser, in the same female Arabic voice.

## 1. The task in one paragraph

Make one narrated walkthrough film, in Arabic, of the Arabic Language Browser («متصفح اللغة العربية لغة القرآن», route `/ar/arabiyya/`, built 21 November 2026, plan in `docs/plan/74-arabic-language-browser.md`). Deliver it in two shapes: landscape 1920×1080 (YouTube, Facebook) and vertical 1080×1920 (TikTok, Reels, Shorts), about 2:10 to 2:30 long, with burned-in Arabic captions, the same voice and the same music as the Place film. Do it by reusing the pipeline in `marketing/place-walkthrough/` (read its `README.md` first: it explains every script). Do not redesign the look, the voice, the caption style or the end card.

## 2. Where things are

- Worktree: `/Users/ahmedabdelaal/Documents/GitHub/islam-museum/.claude/worktrees/islam-museum-walkthrough-videos-006077` (branch `claude/islam-museum-walkthrough-videos-006077`, fast-forwarded to `main` at `a35a1328fc` on 22 November). If this worktree is gone, make a new one from `main`; everything you need is in git except the items in section 3.
- The pipeline to copy: `marketing/place-walkthrough/` (`scripts/rec.mjs` recorder, `scripts/shots.mjs` choreography, `scripts/scenes.mjs` scene list, `scripts/plan.mjs`, `scripts/audio.mjs`, `scripts/compose.mjs`, `scripts/voice_ar.py`, `scripts/voice_pick.py`, `scripts/units.mjs`, `scripts/silma_shim.py`, `scripts/sheet.sh`).
- New project folder: `marketing/arabiyya-walkthrough/` (this file is in it). Copy the scripts and `assets/` there and adapt them; do not edit the Place project.
- Finished films go to `marketing/arabiyya-walkthrough/renders/` and a copy to `~/Movies/islam-museum/arabiyya-walkthrough/`.

## 3. Things that are not in git and how to get them

- **Arabic voice (SILMA TTS v1)**: the venv is at `marketing/place-walkthrough/.venv-voice` in this worktree. Use it from there: `../place-walkthrough/.venv-voice/bin/python scripts/voice_ar.py`. If it is missing, rebuild it exactly as the Place README says under "Voice" (`uv venv --python 3.11`, `uv pip install --no-deps silma-tts catt_tashkeel`, then its listed dependencies with `onnxruntime` instead of `onnxruntime-gpu` and without `nemo_text_processing`). The voice is the model's bundled Arabic reference (`ar.ref.24k.wav`), a female voice; `voice_ar.py` already uses it. Keep `tempo: 1.1` in the script JSON, 4 takes per sentence, 32 steps: those are the settings of the Place film.
- **Transcription check**: `python3 scripts/voice_pick.py ar` needs `mlx-whisper` in the base Python (it is installed on this Mac).
- **Music**: `~/Music/Music/Media.localized/Music/stemoven/Unknown Album/Fourteen Centuries (Restructured).mp3` (`scripts/audio.mjs` finds it by default).
- **The site to record**: production. Checked on 22 November 2026: `https://islam.museum/ar/arabiyya/` is live and shows 15 verses, 65 passages found by wording, 314 curated records, nine chapters and the ring of letters; the cards for «علم النحو» and «سيبويه» are on it. Keep `SITE = "https://islam.museum"`. Re-read those figures on the day you record (they move as records land). Only if production is down or the page is broken, record a local build (section 4) and then say so on the end card and in the README ("recorded from a local build of `main`", not "from the live site").
- **The page is very long**: about 142,500 px tall at desktop width (chapter `books` alone has 75 cards). Never scroll it end to end at reading speed. Jump between parts with `r.scrollTo` to positions read from the page, and keep each scene inside one part.

## 4. Running the site locally (only if production does not have the page)

1. From the worktree root: `npm run graph && npx tsx scripts/time-browser.ts && npx tsx scripts/time-browser-explorer.ts && npm run derive && npm run api && npm run daily`. The graph step alone took more than 10 minutes on 22 November and uses about 8 GB of memory; run it in the background and wait for it.
2. `site/node_modules` is a symlink to the main checkout's install. If Astro fails to resolve a package, run `npm --prefix site ci` instead (about 3 minutes).
3. Add a temporary launch entry to `.claude/launch.json` and start it with the preview tool: name `arabiyya-dev`, `runtimeExecutable` `sh`, `runtimeArgs` `["-c", "cd <worktree>/site && NODE_OPTIONS=--max-old-space-size=24576 npx astro dev --port 4323"]`, port 4323 (plain `astro dev` runs out of memory). **Never commit `.claude/launch.json`**; restore it with `git checkout -- .claude/launch.json` before you commit. This was prepared but not tried on 22 November, because production already had the page.
4. The page is then `http://localhost:4323/ar/arabiyya/`. The first load compiles for a while.
5. In the recorder, `goto(..., { waitUntil: "networkidle" })` can hang on a dev server because of its live-reload socket. If it does, change that one call in your copy of `rec.mjs` to `waitUntil: "load"` and keep the `settle` wait.

## 5. What the page is (so you can choreograph it)

It is one long static page, not an interactive map: there is nothing to click except links and chips, so the film is made of slow scrolls, pointer hovers and two or three link clicks. In page order:

1. Badge, breadcrumb, `h1` «متصفح اللغة العربية لغة القرآن», the lede, a gold-bordered status line with the three counts, the method note.
2. A row of chips (`nav` with `a.chip`): one per section, each with its count.
3. The signature view: the ring of the letters in al-Khalil's order, coloured by articulation point, with the counts in its centre (`site/src/components/sig/ArabiyyaRing.astro`).
4. `#c-quran`: «القرآن يتحدث عن لسانه», the verses (`.ar-verse`, large Arabic text from the frozen Tanzil records).
5. Nine chapters, each a `section.ar-chapter` with a big gold number, a heading `#s-<id>` and cards (`.ar-cards li`): `lisan`, `ijaz`, `origins`, `script`, `sciences`, `dialects`, `world`, `scholars`, `books`.
6. `#passages-title`: «ما قالته المصادر عن العربية», passages grouped by corpus (`#c-sunnah`, `#c-seerah`, `#c-tafsir`, `#c-books`).
7. `#kin-title`: «قاعات مجاورة», links to the dictionaries browser (`/ar/maajim/`), the Mushaf and the poetry anthology.

Records to open in the film (all exist on `main`): `/ar/concept/ilm-al-nahw/`, `/ar/person/sibawayh/`, `/ar/person/al-khalil-ibn-ahmad-al-farahidi/`. Open them by clicking their cards on the page (find the card with `a[href$="/concept/ilm-al-nahw/"]`), not by typing a URL, and use `r.follow()` as the Place film's `entry` scene does.

## 6. The film, scene by scene

Same structure as `SCENES` in the Place project: each scene has units (sentences), a lead, a tail and gaps; the voice is the clock. `look: "bleed"` for the hook and the close, `"window"` for the rest, `"card"` for the end card. There is no number card in this film: drop the `numbers` scene and `scripts/stills.mjs`.

| Scene | Units | On screen |
| --- | --- | --- |
| `hook` (bleed) | h1, h2 | The ring of the letters filling the frame (scroll so the ring is centred before recording). The pointer traces slowly round the ring from the throat letters to the lip letters. |
| `reveal` | r1 | Top of the page: header, badge, title, lede, the gold status line. Pointer rests on the title, then on the status line. |
| `ring` | g1 | Scroll down to the ring; pointer moves along two or three coloured arcs and their group names. |
| `verses` | v1 | Scroll to `#c-quran`; slow scroll through the verse cards; pointer on one verse's reference link. Do not click. |
| `chapters` | c1, c2, c3, c4 | Scroll back to the chip row (c1, pointer runs along the chips), then scroll through the nine chapters, three per sentence, arriving at each chapter's gold number as its name is said. Use `r.scrollTo` with the heading positions read from the page. |
| `record` | p1 | In chapter `sciences`, pointer to the card «علم النحو», click, the record page opens; scroll to its first sections and then to its sources heading (`/^المصادر$/`). |
| `scholar` | p2 | Start on chapter `scholars`; click «سيبويه»; scroll his page slowly (At a glance, life in time). |
| `sources` | s1 | Back on the browser page at `#passages-title`; scroll through two corpus groups. |
| `depth` | d1, d2 | A fast continuous scroll through one long chapter (`scholars` into `books`, about 20,000 px in 6 seconds) so the cards stream past; the page is far too long to scroll whole. |
| `kin` | k1 | `#kin-title`; pointer on the three links; click the dictionaries link and show the top of `/ar/maajim/`. |
| `close` (bleed) | m1, m2, c5 | Back on the ring, centred, pointer hidden; a very slow scroll of 60 px so the frame is alive. |
| `end` (card) | e1 | The same end card as the Place film. |

Vertical cut: same scenes at the phone viewport (540×650 at 2×, `kind: "touch"`). In the phone layout the header has a "Menu" button and the cards are one column; check each scene's contact sheet and adjust scroll offsets, nothing else.

## 7. The narration (final text, already vowelled for the voice)

Put this in `marketing/arabiyya-walkthrough/script/ar.json` in the same format as the Place script (`say` is read by the voice, `show` is the caption). Do not rewrite it. If a take is flagged by `voice_pick.py`, regenerate that line; change a word only if three regenerations fail, and then only that word.

| id | say | show |
| --- | --- | --- |
| h1 | لُغَتُكَ الْعَرَبِيَّةْ. كَمْ تَعْرِفُ عَنْهَا؟ | لغتك العربية. كم تعرف عنها؟ |
| h2 | حُرُوفٌ قَلِيلَةْ، حَمَلَتْ كِتَابًا، وَعُلُومًا، وَحَضَارَةً كَامِلَةْ. | حروفٌ قليلة، حملت كتابًا، وعلومًا، وحضارةً كاملة. |
| r1 | هَذَا مُتَصَفِّحُ اللُّغَةِ الْعَرَبِيَّةِ فِي مُتْحَفِ الْإِسْلَامْ: مَا جَمَعَهُ الْمُتْحَفُ عَنِ الْعَرَبِيَّةِ، فِي صَفْحَةٍ وَاحِدَةْ. | هذا متصفح اللغة العربية في متحف الإسلام: ما جمعه المتحف عن العربية، في صفحة واحدة. |
| g1 | يَبْدَأُ بِدَائِرَةِ الْحُرُوفْ، عَلَى تَرْتِيبِ الْخَلِيلِ بْنِ أَحْمَدَ فِي كِتَابِ الْعَيْنْ: مِنْ أَقْصَى الْحَلْقِ إِلَى الشَّفَتَيْنْ. | يبدأ بدائرة الحروف، على ترتيب الخليل بن أحمد في كتاب العين: من أقصى الحلق إلى الشفتين. |
| v1 | ثُمَّ الْآيَاتُ الَّتِي تَحَدَّثَ فِيهَا الْقُرْآنُ عَنْ لِسَانِهْ. وَكُلُّ آيَةٍ تَفْتَحُ صَفْحَتَهَا وَتَفْسِيرَهَا. | ثم الآيات التي تحدّث فيها القرآن عن لسانه. وكل آية تفتح صفحتها وتفسيرها. |
| c1 | وَبَعْدَهَا تِسْعَةُ أَبْوَابْ. | وبعدها تسعة أبواب. |
| c2 | الْعَرَبِيَّةُ لُغَةُ الْقُرْآنْ، وَإِعْجَازُ بَيَانِهْ، وَأَصْلُ اللُّغَةِ وَتَارِيخُهَا. | العربية لغة القرآن، وإعجاز بيانه، وأصل اللغة وتاريخها. |
| c3 | ثُمَّ الْحُرُوفُ وَالْخَطّْ، وَعُلُومُ الْعَرَبِيَّةْ: النَّحْوُ وَالصَّرْفُ وَالْبَلَاغَةُ وَالْعَرُوضْ. | ثم الحروف والخط، وعلوم العربية: النحو والصرف والبلاغة والعروض. |
| c4 | وَاللَّهَجَاتُ قَدِيمًا وَحَدِيثًا، وَالْعَرَبِيَّةُ فِي الْعَالَمْ، وَعُلَمَاءُ اللُّغَةِ وَكُتُبُهَا. | واللهجات قديمًا وحديثًا، والعربية في العالم، وعلماء اللغة وكتبها. |
| p1 | اِفْتَحْ أَيَّ بِطَاقَةْ. عِلْمُ النَّحْوِ مَثَلًا: كَيْفَ نَشَأَ، وَمَا مَصَادِرُهْ. | افتح أي بطاقة. علم النحو مثلًا: كيف نشأ، وما مصادره. |
| p2 | أَوْ سِيبَوَيْهْ: حَيَاتُهُ، مَرْبُوطَةً بِكُتُبِهِ وَشُيُوخِهِ وَزَمَانِهْ. | أو سيبويه: حياته، مربوطةً بكتبه وشيوخه وزمانه. |
| s1 | وَتَحْتَهَا مَا قَالَتْهُ الْمَصَادِرُ عَنِ الْعَرَبِيَّةْ: نُصُوصٌ مِنَ الْحَدِيثِ وَالسِّيرَةِ وَالتَّفْسِيرِ وَسَائِرِ الْكُتُبْ. | وتحتها ما قالته المصادر عن العربية: نصوص من الحديث والسيرة والتفسير وسائر الكتب. |
| d1 | عَمَلٌ كَأَنَّهُ عَشْرُ رَسَائِلِ دُكْتُورَاهْ، وَمِئَةُ بَحْثْ، اجْتَمَعَتْ فِي مَكَانٍ وَاحِدْ. | عملٌ كأنه عشر رسائل دكتوراه، ومئة بحث، اجتمعت في مكان واحد. |
| d2 | وَالْأَقْوَالُ فِيهِ مَنْسُوبَةٌ إِلَى أَصْحَابِهَا، وَالْمَصَادِرُ مَذْكُورَةٌ أَمَامَكْ. | والأقوال فيه منسوبة إلى أصحابها، والمصادر مذكورة أمامك. |
| k1 | وَمِنْ هُنَا تَمْضِي إِلَى الْمَعَاجِمْ، وَالْمُصْحَفْ، وَدِيوَانِ الشِّعْرْ. | ومن هنا تمضي إلى المعاجم، والمصحف، وديوان الشعر. |
| m1 | لِمُحِبِّي الْعَرَبِيَّةْ: هَذَا مَا انْتَظَرْنَاهُ طَوِيلًا. | لمحبّي العربية: هذا ما انتظرناه طويلًا. |
| m2 | لُغَتُنَا، مَجْمُوعَةً فِي بَيْتٍ وَاحِدْ، مَفْتُوحٍ لِلْجَمِيعْ. | لغتنا، مجموعةً في بيت واحد، مفتوحٍ للجميع. |
| c5 | تَفَضَّلْ بِالدُّخُولْ. وَاقْرَأْ عَلَى مَهْلِكْ. وَعُدْ مَتَى شِئْتْ. | تفضّل بالدخول. واقرأ على مهلك. وعُد متى شئت. |
| e1 | مُتْحَفُ الْإِسْلَامْ. مَجَّانِيٌّ بِلَا إِعْلَانَاتْ، دَائِمًا. | متحف الإسلام. مجانيٌّ بلا إعلانات، دائمًا. |

Notes on the wording, which you must keep:

- **"Ten doctorates and a hundred studies" is a simile** («كأنه»), the founder's own image. It is not a count and must never be turned into one on screen (no "10 PhDs" number card).
- The narration never recites a verse and never names how many verses there are; the page shows them. Qur'an text is never typed anywhere in this project (`AGENTS.md`).
- No honorifics are typed, in the script, the captions or the README.
- The museum does not say Arabic is the best or most eloquent language; the page attributes that to named scholars, and the film stays out of it.
- There is no English cut. If the founder later asks for one, write it fresh; do not machine-translate this.

## 8. Rules that bind this work

Read `AGENTS.md` (the "Truth in every public claim" rule and the Canary workflow) and `docs/audit/public-claims-audit-2026-11-15.md` before writing any public text.

- Every figure shown or said must be read from the page on the day you record. The narration above carries none on purpose. If you show the status line, that is the page's own text.
- The end card small print must be true: "recorded from the live site, <date>" only if you recorded production; otherwise «مسجَّل من نسخة محلية للموقع، <date>». Keep «التعليق بصوتٍ آلي» and the music credit.
- Rendered video, footage, voice and music stay out of git (copy the Place project's `.gitignore`).
- Commit only the new folder's source (scripts, script JSON, README, assets) and one `CANARY.md` entry under the current version block, with explicit paths and the trailers `AI-Agent:`, `AI-Model:`, `AI-Editor:`. Run `npm run validate` and `npm test` first (no site build: nothing under `site/` changes). Open a pull request against `main` and merge it after fetching and merging `origin/main`. Never run a deploy workflow.
- Write a short README in the new folder in the shape of the Place README: what the film shows, the claims table, how to rebuild, how the voice was checked, review notes.

## 9. Order of work and checks

1. Decide production or local (section 3) and get the page on screen. Take one screenshot of each part listed in section 5 and look at them before writing any choreography.
2. Copy the pipeline, write `script/ar.json`, `scenes.mjs` and `shots.mjs` for the scenes in section 6.
3. Voice: `voice_ar.py`, then `voice_pick.py ar`. Read the report. Every sentence should score 0.9 or more apart from spelling variants; listen is not possible, so regenerate anything unclear.
4. `plan.mjs ar`, `audio.mjs ar`, `record.mjs ar wide`. Make a contact sheet of every scene with `scripts/sheet.sh` and look at each one. Fix and re-record single scenes (`record.mjs ar wide <scene>`).
5. `compose.mjs ar wide`, `npx hyperframes check`, snapshot at about fifteen moments, then render with `--quality delivery --video-frame-format png`. Always copy media into the film project (the script does); never symlink it, or the render comes out silent with missing pictures.
6. Repeat 4 and 5 for `tall`.
7. Check each render: `ffprobe` shows a video and an audio stream; loudness about −17 LUFS; transcribe the finished mix with Whisper and confirm every sentence is heard in order.
8. Copy the files to `~/Movies/islam-museum/arabiyya-walkthrough/`, write the README and the CANARY entry, run the gates, commit, pull request, merge.
9. Report to the founder plainly: what was made, where it is, what was recorded (production or local), that the voice was checked by transcription and not listened to, and anything you could not do.

## 10. When to stop and ask

- The page looks broken or half-built on both production and local.
- A record named in section 5 is missing.
- The voice environment cannot be rebuilt.
- You are tempted to change the narration, the voice, the music or the look.
