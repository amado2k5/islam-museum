# Atlas — The Historical World Challenge: state of the game

_25 November 2026. Release status: **prototype** (specification scale: planned / prototype / alpha / candidate / validated / released). GDD: [`../spec-v2/games/atlas.md`](../spec-v2/games/atlas.md). Code: `gaming/games/atlas/`. Not on the site._

## What exists

A playable daily game of five rounds, and a practice mode. Each round names one museum record (an event, or a person) and asks where it happened: turn a globe, drop a pin, optionally estimate the century, submit. The reveal draws the great-circle line from the guess to the place, gives the distance and the points, names the place and the year in both calendars, and links to the record and to the place on islam.museum. After five rounds: a total, a row of marks that names nothing, and a copy button.

It plays with the mouse, with the keyboard alone (arrow keys turn the globe, Enter drops the pin), or by typing coordinates. It remembers a daily game across a reload. It runs in the museum's seven languages, right-to-left for Arabic and Urdu, and the globe is never mirrored.

![The opening question](../evidence/m2/atlas/atlas-en-1-question.webp)
![A reveal, in Arabic](../evidence/m2/atlas/atlas-ar-2-reveal.webp)

## Where the questions come from

Every round is a museum record joined to the museum place where it happened; the game adds no fact of its own ([G-0006](../adr/G-0006-atlas-content-pack.md)). `gaming/games/atlas/tools/build-pack.ts` reads `data/` and writes a pinned pack. Built at commit `0efdf22a5ad` on 25 November 2026 (pack digest `764f347cfa66…`):

| | |
|---|---:|
| Places that qualify (city, town or site; coordinates of `site` or `locality` precision; Arabic and English name) | 1,908 |
| Rounds that qualify | 3,481 |
| of which civic and scholarly events | 776, in 121 places |
| of which births and deaths of historical figures | 1,473, in 337 places |
| of which military events | 1,232, in 612 places |
| Rounds in the pack (a year's schedule plus 300 in reserve for practice) | 2,125, in 528 places: 465 civic, 951 people, 709 military |
| Days scheduled | 365, using 1,825 rounds, none twice |

**The daily mix was set by this count, not by preference.** The first design had two civic events a day. The museum's precisely located, dated civic events cluster in about 120 places, and the schedule ran out on day 142. A day is therefore one civic event, two people, one military event, and a fifth round from whichever category has most left, which in practice is a second military event. A daily game that is two-fifths battles and sieges is heavier on warfare than a museum game should be, and the cure is more located civic records in the museum (foundations, journeys, books written, buildings raised), not a change in the game.

**What was left out, and why** (`gaming/games/atlas/data/report.v1.json`): 1,073 places whose coordinates the museum marks as approximate; 951 that are regions, provinces, rivers or mountains; 1,429 events and 1,087 people's birthplaces or places of death that fall on one of those; 334 events with more than one place; 203 events with no start year, 438 people with no birth year and 150 with no year of death; 866 people born after 1900; 240 birthplaces or places of death marked low confidence; and 33 events and 28 people the game does not turn into questions (massacre, persecution, expulsion, the events of revelation, schism, and any record with a `sensitivity` field).

## Rules, in one place

- **Distance.** Great-circle distance on a sphere of radius 6,371.0088 km.
- **Points.** 1,000 within the record's own precision (15 km for `site`, 40 km for `locality`); beyond that 1,000 × e^(−(distance − tolerance) / 450 km), rounded: about 368 at 450 km further, 108 at 1,000 km, 0 from about 3,400 km.
- **Region hint.** Shows the museum's region for the place and costs 150 points on that round. Not offered when the record names no region.
- **Century.** Optional and never part of the points. The summary says how many estimates were exactly right.
- **Daily.** One game per UTC date, the same for everyone in every language. No streak, no penalty for a missed day.
- **Scores** stay on the device and are not compared with anyone's.

## Checked, and how

| Check | Result |
|---|---|
| Unit tests, `npm --prefix gaming test` | 32 Atlas tests pass: distance at the antimeridian and the poles, century counting, scoring monotonic, pack digest, names in seven languages, the people rule, **every one of 365 days valid**, a broken schedule caught, UTC day counting over month ends and leap days, a full game, hint cost, immutability, share marks, practice dealing, save round trip, unreadable and newer saves, damaged entries, games from another pack not resumed, and the seven string files holding the same keys and placeholders with no typed honorific |
| Real browser, `npx tsx tools/atlas-play.ts <dir> <lang>`, Chrome 158 | A full daily game in each of the seven languages: mouse, keyboard only, typed coordinates, region hint, century estimate, reload in mid-game, unreadable save set aside; no console error (`evidence/m2/atlas/playthrough-7-languages.log`). Totals differ between left-to-right and right-to-left runs because the script clicks fixed pixels and the globe sits on the other side of the window; the rules are the same |

That is a functional check by the author's own script. It is not a playtest and says nothing about whether the game is fun.

## Not done (against the GDD)

1. **No images.** The GDD's first promise is guessing from "visual and contextual evidence". There are 828 media records in the museum, 628 of which say what they depict; none is used yet. An image round needs a licence, a credit that does not give the answer away, and a place: this is the next piece of work.
2. **No 3D terrain globe.** The globe is a 2D canvas with coastlines. It is quick and legible; it is not the "rich terrain/globe" of the brief.
3. **No regional or era modes, no route reconstruction, no artifact-origin mode**, no archive page for past days, no map skins, no clue packs for creators.
4. **No sound**, no gamepad, no remapping, no UI scale control.
5. **Fonts are the system's.** Arabic and Urdu use whatever the device has; the museum's web fonts come with the portal.
6. **Names in Turkish and Indonesian are borrowed from English for all 951 people in the pack** (the museum's person records have no `tr` or `id` label yet), and 40 Urdu names are borrowed from Arabic. The game says so on the round. This is a gap in the museum's data, noted for the translation lanes.
7. **Interface strings were written by an AI agent** in all seven languages and have not been read by a native speaker of any of them.
8. **No human has played it** other than through the script.

## Things the pack builder noticed in the museum's data

Written down for the lanes that own the records; nothing was edited.

- 1,073 place records carry `coordinate_precision: approx`. Each one upgraded to `locality` or `site` adds rounds to Atlas and precision to the museum's maps.
- 441 qualifying places have no usable region (none listed, or a region slug with no display name, such as `global`).
- Some events are tied to the nearest city rather than to the field where they happened. Example seen in the schedule: the battle of Abu Klea is recorded at Khartoum. Atlas scores against the record, so such a round is unfair by the distance between the two.
- 93 people who otherwise qualify have more than one `born_in` place, and 19 more than one `died_in` place.

## To play it

```bash
npm --prefix gaming ci
npm --prefix gaming run dev
# http://127.0.0.1:4330/games/atlas/index.html?lang=ar          today's challenge
# …?lang=en&date=2026-12-25                                      another day
# …?lang=fr&mode=practice                                        practice
```
