# G-0007: The museum's own suite is the music of every game

_25 November 2026. Status: **accepted** for the music itself (the founder's instruction of this date); the place the audio files are served from in production is part of [G-0004](G-0004-hosting-and-release-model.md) and waits for him._


_Added 25 November 2026, the same evening: the open point of this record, where the files are served from, is settled. The founder asked where the music was on the test copy; the tracks now go to R2 under `games/media/music/` through a manual workflow (`games-media.yml`) and are served by the games' own Worker, whole or in spans of bytes. How they travel without entering git is in [`../release-and-deploy.md`](../release-and-deploy.md), "The music"._

## The instruction

On 25 November 2026 the founder supplied six WAV masters and said: use the museum's own soundtrack as the music for all the games. The tracks are the suite the museum publishes as "Voices of the Museum" (SoundCloud set `islam-museum/sets/voices-of-the-museum`).

## What the music is

The museum's Backstage page already says it, in seven languages (`i18n/*.yaml`, `backstage.music_1`): a six-track suite, composed and generated with AI in Google Flow with Lyria around the founder's own oud playing as the musical reference; the finished tracks are fully AI-generated, and the oud is not itself heard in them. The games repeat that statement and add nothing to it.

| # | Title | Master, as supplied | Length | Loudness of the master | True peak |
|---|---|---|---:|---:|---:|
| 1 | Fourteen Centuries | `01_Fourteen_Centuries.wav` | 2:42 | −15.6 LUFS | −0.9 dBFS |
| 2 | The Ancient Library | `02_The_Ancient_Library.wav` | 2:50 | −10.5 LUFS | +0.1 dBFS |
| 3 | The First Light | `03_The_First_Light.wav` | 2:48 | −15.6 LUFS | 0.0 dBFS |
| 4 | Threshold of the Unknown | `04_Threshold_of_the_Unknown.wav` | 3:01 | −16.3 LUFS | −0.3 dBFS |
| 5 | The Unbroken Seals | `05_The_Unbroken_Seals.wav` | 2:32 | −15.9 LUFS | −0.5 dBFS |
| 6 | Leaving the Museum | `06_Leaving_the_Museum.wav` | 2:56 | −17.4 LUFS | −0.4 dBFS |

Measured with ffmpeg's EBU R 128 meter on 25 November 2026. The masters are 16-bit, 44.1 kHz stereo. Their embedded tags give the artist as "stemoven" and working titles ("Fourteen Centuries (Restructured)", "Voices of the Museum (Leaving the Museum)" and so on); the games use the titles the museum publishes. Titles are names of works and are not translated, as on the Backstage page.

## Decisions

1. **One suite, every game.** A shared package, `gaming/packages/audio/`, holds the track list, the player and the control. A game names the track it opens with and the rest follow in album order, round and round. Golden Age opens with "The First Light"; Atlas with "Fourteen Centuries". Which track opens the other eight games is decided when each is built.
2. **The audio files are not in git.** The repository's rule is that media lives on R2 and never in the repository. `npm --prefix gaming run music:import -- <folder with the six WAVs>` writes the playable files to `gaming/media/music/` (ignored by git) and writes `gaming/packages/audio/music.json` (committed): each file's name, length, size and SHA-256, and the measurements above. A deployment can be checked against that record.
3. **Encoding.** AAC-LC in an MP4 container (`.m4a`) at 160 kbit/s: one file per track, 3.1 to 3.7 MB each, 20.5 MB for the suite. It is the one format that current Chrome, Edge, Safari and Firefox are all documented to play; only Chrome was tested here. Opus would be smaller but needs a second copy for older Safari.
4. **Levelling without changing the music.** Track 2's master is about five decibels louder than the others and peaks above full scale. Each track gets one fixed gain toward −16 LUFS, never more than keeps its true peak under −1.5 dBFS (−0.6, −5.5, −1.5, −1.2, −1.0 and −1.1 dB). No compression or limiting is applied.
5. **Nothing sounds before the player acts.** The specification asks for this (`spec-v2/05`) and browsers enforce it. Music is on by default, starts at the first click or key press in the game, and fades in over about two seconds.
6. **The player is in charge.** Every game shows the same control: on or off, volume, next track, the title playing, and where the music comes from with a link to the Backstage page. The choice and the volume are kept on the device under one key, `im.play.audio.v1`, so turning the music off in one game turns it off in all of them. Adding `?music=off` to the address starts silent (the test tools use it).
7. **It stops when the tab is hidden** and comes back when the tab is shown (`spec-v2/06`). The track is streamed by an `<audio>` element, not decoded whole into memory.
8. **A game still works without the files.** If a track cannot be loaded (a fresh clone before the import, or a deployment without the media) the control says so and the game plays on in silence.

## Checked

- `packages/audio/test/music.gtest.ts`: the six tracks, their order, the digests, the gain ceiling, the playlist order, preferences read from any storage content, the control's strings in seven languages.
- In real Chrome 158 with the browser muted (`tools/golden-age-play.ts`, step 9): no sound before a click; after one click the first request for `03-the-first-light.m4a` returns 206 and the player reports that it is playing; "Stop the music" stops it.

## Not done

- **Nobody has listened to it in a game.** The check above proves that the browser is playing the file, not that it sounds right, that the level suits the games, or that the loop from track 6 back to track 1 is pleasant. The levelling was measured, not heard.
- **Production.** The six files have to reach R2 with a game release, at an address the release build puts in `VITE_MUSIC_BASE`. That is a change to the publish lists and waits on G-0004. The site's `media-src 'self'` already allows same-origin audio.
- **Only music.** There are no sound effects, no ambience and no separate volume for them yet (`spec-v2/05` asks for music, ambience, effects and voice separately).
- **Strings.** The control's twelve strings were written by an AI agent in all seven languages and read by no native speaker.

## For the founder

- The masters carry the tag "artist: stemoven". If that is a tool's or a person's name that should be credited, or whose terms apply, it is not recorded anywhere in the repository; the games credit the suite as the museum's own, in the Backstage page's words.
- Track 2's master clips slightly (true peak +0.1 dBFS). The game copy is turned down, which hides it; a re-export of the master would remove it.
