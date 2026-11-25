# G-0006: Atlas asks only what a museum record says, from a pinned pack

_25 November 2026. Status: accepted, with one rule (which people may be the subject of a question) held as a conservative default until the founder rules._

## Decision

1. **A round is a museum record joined to a museum place.** An event with exactly one `occurred_at` place and a start date known to the year or better; or a person with exactly one `born_in` place (failing that, one `died_in` place) and the year. The answer is the place record's own coordinates. The game writes no clue, no date and no coordinate of its own, so it cannot state something the museum does not.
2. **Only places a guess can fairly be scored against:** kind `city`, `town` or `site`, with `coordinate_precision` of `site` or `locality`. A place marked `approx` is left out. The tolerance for full marks is the record's own precision (15 km and 40 km).
3. **The pack is pinned in git** (`gaming/games/atlas/data/pack.v1.json` and one label file per language), with the commit it was built from and a SHA-256 digest over its content. A daily challenge is a row of that file. The museum's data changes every day; the daily challenge must not, so the pack is rebuilt only on purpose and a rebuild is a new version.
4. **The 365-day schedule is built once and proved by a checker** (`src/schedule.ts`): five rounds a day, five different places, at least three regions, a category minimum, no round twice in the year, no place again within 14 days. The proof runs in the unit tests on the pinned file.
5. **Names come from the record, and fall back within their script** when a record has no label in a language: Urdu from Arabic; French, Spanish, Turkish and Indonesian from English. The game marks a borrowed name on the round. Arabic and English are required.
6. **Kinds of event never asked:** massacre, persecution, expulsion, revelation, schism, and any record carrying a `sensitivity` field. The game does not make a quiz of an atrocity or of the events of revelation.
7. **People, as a conservative default:** a birth round only for someone born from 700 to 1900 of the Common Era, a death round only for someone who died from 800 to 1950 and was not born after 1900. This keeps the earliest generations out of the game and keeps living people from being turned into quiz items.

## Why not the alternatives

- **Read the museum's graph at run time.** The daily challenge would change whenever a record did, and a play page would need megabytes of data it mostly would not use.
- **Write clue text for each round.** Hand-written or generated clues are new claims with no source. The GDD asks for clues with evidence; a record's own label with its link is evidence.
- **Include `approx` places with a larger tolerance.** The museum does not say how approximate, so no tolerance would be honest.
- **Leave people out.** People are the category spread over the most places and the one that keeps the game from being mostly battles.

## Needs the founder

- **Rule 7.** Whether the earliest generations (and in particular the Prophets and the Companions) may ever be the subject of a geography question, and on what terms. Until he says, they are not.
- **Rule 6.** Whether the list is right.
- **The share of military rounds.** Two of five rounds a day are battles, sieges or conquests because that is what the museum has most of with a precise place and date. See `docs/gaming/games/atlas.md`.

## Consequences

- Atlas inherits the quality of the museum's place data, for better and worse, and its report (`data/report.v1.json`) is a running count of what that data cannot yet support.
- Adding image rounds, routes or artifacts means adding round types to the pack format, with the same rule: a record, a place, a source.
