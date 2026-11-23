# The Arabic Language Browser: a walkthrough film (Arabic)

A narrated walkthrough of the Arabic Language Browser (`/ar/arabiyya/`, «متصفح اللغة العربية لغة القرآن»; plan `docs/plan/74-arabic-language-browser.md`), in Arabic only, for social media: landscape 16:9 (1920×1080, YouTube and Facebook) and vertical 9:16 (1080×1920, TikTok, Reels, Shorts). Both are 1:56 long. Requested by the founder on 22 November 2026 as a companion to `marketing/place-walkthrough/`, whose scripts, look, caption style, music and voice it reuses. The handoff it was built from is `HANDOFF.md`.

Files in `renders/` (not in git): `islam-museum-arabiyya-walkthrough-ar-16x9.mp4`, `-ar-9x16.mp4`, `-ar.srt`.

## What the film shows

The page is one long static page, so the film scrolls and hovers on the live site, recorded from `https://islam.museum/ar/arabiyya/` on 22 November 2026, frame by frame, with real clicks on two cards.

| Scene | On screen | Said (in Arabic) |
| --- | --- | --- |
| hook | The ring of the letters in al-Khalil's order, the pointer running round it | Your Arabic language: how much do you know about it? A few letters carried a book, sciences and a whole civilisation |
| reveal | Title, lede and the page's own status line | This is the Arabic Language Browser: what the museum gathered about Arabic, on one page |
| ring | The arcs of the ring, group by group | It begins with the ring of letters, in al-Khalil's order in *Kitab al-Ayn*, from the throat to the lips |
| verses | The verses that name the tongue of the revelation | Then the verses; each opens its page and tafsir |
| chapters | The chip row, then the nine chapters | Nine chapters, named one by one |
| record | The card and page of «علم النحو», down to its sources | Open any card |
| scholar | The card and page of Sibawayh | Or Sibawayh |
| sources | Passages found in the hadith, seerah, tafsir and other books | What the sources said about Arabic |
| depth | A fast scroll through the two longest chapters | Like ten doctoral theses and a hundred studies in one place |
| kin | The neighbouring halls (dictionaries, Mushaf, poetry) | From here you go on to the dictionaries, the Mushaf and the poetry anthology |
| close, end | The ring again; the end card | Welcome in; read at your leisure; come back when you like |

The narration is in `script/ar.json` (`say` is read by the voice, `show` is the caption).

## Every claim and where it is from

| In the film | Source on 22 November 2026 |
| --- | --- |
| Nine chapters | The page: nine `section.ar-chapter` |
| The ring follows al-Khalil's order | The page's own note under the ring |
| The verses name the tongue of the revelation; each opens its page and tafsir | The page's own text for that section |
| Text found in the hadith, seerah, tafsir and other books | The page's method note; the page itself says some passages mention Arabic only in passing |
| "Like ten doctorates and a hundred studies" | The founder's own image, kept as a simile («كأنه»). It is not a count and no number card appears |
| Counts (15, 65, 314) | Shown only as the page prints them in the ring and status line; the narration states none |
| The page marks its prose as written with AI help and not read by a human editor | The «مسودة» mark under the ring is on screen |

The film says nothing about review, cost or who wrote the records beyond what the page itself shows. It does not say Arabic is the best language. No Qur'an text is typed anywhere in the project: the verses on screen are the site's own.

## How it is made

As in `marketing/place-walkthrough/README.md` ("How it is made"): `scripts/plan.mjs ar`, `audio.mjs ar`, `record.mjs ar wide|tall`, `compose.mjs ar wide|tall`, `npx hyperframes check`, then `render --quality delivery --video-frame-format png`. Scenes: `scripts/scenes.mjs`; choreography: `scripts/shots.mjs`. The voice uses the Python environment of the Place project (`../place-walkthrough/.venv-voice`).

## Voice and sound

- SILMA TTS v1 (weights Apache-2.0, code MIT), the model's bundled female Arabic reference voice, four takes per sentence, read 10% faster, as in the Place film. The end card says the narration is by an automatic voice.
- Every sentence was transcribed back with Whisper: all 25 match the script at 1.00 after one respelling (a word came out as «الخطة» until its closing marks were simplified). The finished mix was transcribed again and the sentences are heard, in order, over the music. **Checked by transcription, not listened to.**
- Music: "Fourteen Centuries (Restructured)" from the founder's Music library, evened out and kept under the voice. −17.1 LUFS, peak −3.2 dBFS. The sound was measured, not listened to.

## Review notes

- 1:56 is shorter than the 2:10 to 2:30 the handoff aimed for; the script was fixed text, so it was not padded.
- The kin scene only points at the three neighbouring halls: the dictionaries page is very large and did not finish loading in the recorder, so it is not opened.
- No English or Urdu cut and no short teaser yet.
