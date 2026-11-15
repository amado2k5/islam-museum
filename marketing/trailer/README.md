# islam.museum trailer

A 38.4-second social trailer (1920×1080, 30 fps) built with [HyperFrames](https://hyperframes.heygen.com): HTML, CSS and a seekable GSAP timeline rendered to MP4. Requested by the founder on 14 November 2026.

## Render it

```bash
node marketing/trailer/scripts/build-data.mjs        # from the repository root: refresh the dots from data/
cd marketing/trailer
node scripts/build-audio.mjs                         # writes assets/audio/bed.wav
cp ~/.claude/skills/media-use/audio/assets/sfx/{impact-bass-1,impact-bass-2,riser,whoosh,whoosh-cinematic}.mp3 assets/sfx/
npm run check                                        # lint, layout, motion, contrast
npm run render -- --quality delivery -o renders/islam-museum-trailer.mp4
```

The MP4, `bed.wav` and the five effect files are not in git (`.gitignore`): video and audio are media, and the effects are HyperFrames' bundled Pixabay sounds, which may be used in a video but not redistributed as files (`assets/sfx/CREDITS.md`).

## What is real in it

Nothing on screen is invented. `scripts/build-data.mjs` reads the graph and writes `assets/museum-data.js`:

- **The dots**: the 3,901 places and buildings that have coordinates (3,878 places, 23 buildings). The map shot is their real positions.
- **The arcs**: 900 of the 1,620 pairs of mapped places that one record (a person, an event, a journey) names together.
- **The timeline**: the 4,709 events with a start year, counted by century.
- **The numbers** (61,382 records, 81,533 connections, 5,390 events, 11,640 people, 9,387 sources) are from `docs/coverage.md` as generated on 14 November 2026. They are typed into `compositions/proof.html`; update them there when re-rendering later.
- **The words**: the tagline, the nine wing names in English and Arabic, "Free, with no ads, forever", "Every claim sourced" and "Enter the Museum" are the site's own strings (`i18n/en.yaml`, `i18n/ar.yaml`). "A thousand books" is the Founder's Charter's first thousand books. The wing colours are the `--wing-*` tokens; the mark is `site/public/brand/logo-mark.svg`; the fonts are the site's (Inter, Source Serif 4, Reem Kufi).

## Shots (100 BPM, one beat = 0.6 s)

| Time | Shot |
| --- | --- |
| 0–7.2 | Hook: "Fourteen centuries / One story / Scattered across a thousand books / Until now" over the scattered dots, which are pulled into one point |
| 7.2–10.8 | The name, on ivory, as the point bursts |
| 10.8–25.2 | Proof, one number every four beats: records (grid), places (map), connections (arcs), events (timeline), people (rings), sources (shelves) |
| 25.2–31.2 | The nine wings in their own colours, then "Nine wings, one museum" inside the star of the mark |
| 31.2–33.6 | Free / No ads / Forever |
| 33.6–38.4 | The dots collapse into the mark; name, button, languages |

## Sound

A synthesised bed (`scripts/build-audio.mjs`): sub booms, a low brass-like swell, frame-drum hits on the beat and a drone, with no melody. Bundled impact, whoosh and riser effects sit on the cuts. Measured on the render: −13.3 LUFS integrated, −1.1 dBFS peak, hits on the beat grid. It was measured, not listened to, by the agent that built it.

## Review notes

- Not built: a version on real screens of the site (search, a record page, the Time Browser), and a single endless zoom from one record out to the whole graph.
- Weakest shot: the sources shelves read as bars more than books.
- Kept on purpose: each wing is on screen 0.4 s, a montage, shorter than a comfortable read of both languages.
- English with Arabic titles only; an Arabic-first and an Urdu cut, and a 9:16 recomposition, are not made yet.
