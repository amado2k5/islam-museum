# The Lamp of the Ages: design of the first slice

_26 November 2026. Drafted by Claude Code (claude-sonnet-5-5), an AI agent. Release status: **prototype**. Code: `gaming/games/lamp/`._

## The request

The founder, in chat: "create a game based on aladdin and his genie where the player can travel in time and space anywhere to muslim world and history and see things and do missions and take with him items and travel with cahracters".

## Working title, and why

**The Lamp of the Ages** (ar مصباح العصور, ur زمانوں کا چراغ, fr La Lampe des âges, es La lámpara de las eras, tr Çağların Lambası, id Lampu Lintas Zaman). The game id is `lamp`.

- The tale of 'Ala al-Din and the lamp is a folk tale, first printed in Antoine Galland's French *Mille et une nuits* (1710), and is in the public domain. A film studio's version of it is not. The title names the public-domain object of the tale (the lamp) and the game's own idea (travel through the ages); it uses no name, character, design, music, line or look from any film. There is no princess, no monkey, no parrot, no tiger, no palace from a film, and the jinni is never drawn as a figure, blue or otherwise.
- "Lantern" was already taken by a daily game (and its Indonesian name is "Pelita"), so the title uses "lamp" in every language, and Indonesian uses "Lampu".
- The title has not been searched against stores or registries. It is a working title; the founder chooses the final one.

## The jinni, and respect

The jinn are part of Islamic belief (the museum's record `concept/jinn`). The game is a fictional frame and makes no claim about the unseen. So the jinni's role is kept modest: a guide who opens the way, not a wish machine. It grants nothing, is never drawn (the lamp shows only a wisp of smoke), has no lines of its own beyond the page's two-sentence note that names the folk tale and says the journey is fiction, and the note links the museum's record on the jinn so a reader can see what the belief actually is. Ledger entry HR-LA-01 asks a reviewer to read these two lines in all seven languages.

## What the slice is

A 2D page, drawn with the DOM and one SVG map (not Phaser: the slice is cards, choices and a map, which the DOM does accessibly with no canvas; it shares the daily games' shell and styles).

- **Map and time dial.** A map from al-Andalus to Transoxania and West Africa, drawn from the open Natural Earth outline already in the workspace (`world-atlas`), and a time dial over the centuries the destinations come from. Turning the dial lights the places reachable in that century.
- **Five destinations**, each a different place and century from the graph. The century is computed from the year of one record; the map position from the place record's coordinates.

| Destination | Century (record) | Figure | Question about | Card taken | Needs |
|---|---|---|---|---|---|
| Baghdad | 9th (`person/al-khwarizmi`, d. 850) | al-Khwarizmi | his record names the House of Wisdom | `work/kitab-al-hisab-al-khwarizmi` | — |
| Cordoba | 9th (`event/abd-al-rahman-ii-expands-cordoba-mosque`, c. 840) | Abbas ibn Firnas | his record names Cordoba | `event/abd-al-rahman-ii-expands-cordoba-mosque` | — |
| Cairo | 11th (`event/ibn-al-haytham-summoned-to-cairo`, c. 1010) | Ibn al-Haytham | the event names al-Hakim | `work/kitab-al-manazir` | Cordoba's card |
| Samarqand | 15th (`event/ulugh-beg-observatory-samarqand`, c. 1420) | Ulugh Beg | his record names Samarqand | `invention/ulugh-beg-zij` | Baghdad's card |
| Timbuktu | 14th (`event/sankore-mosque-timbuktu-730`, c. 1330) | Mansa Musa | the event names Timbuktu | `event/mansa-musa-hajj-724` | Cairo's card |

- **A mission at each:** meet the figure (their record is shown), answer one question whose answer the record itself names (three choices, all records), take a record card.
- **Items** are the museum's record cards, carried in a satchel and kept; some ways open only with a given card. The cards and the gates are fiction: carrying a card claims nothing about the past.
- **Companions:** a figure whose mission is done may travel along, two at a time. A companion speaks only of their own time: at home, their own record's summary; elsewhere, only the line that they are far from their own time. Nothing they say is written by the game.
- **Saved locally** in `localStorage` (`im.lamp.v1`); no account, server, ads, purchases or runtime AI.

## Where every fact comes from

`gaming/games/lamp/tools/build-records.ts` (`npm --prefix gaming run lamp:records`) copies each record's label and summary in the seven languages (citation markers removed), its year and its coordinates into `data/records.json`. A test holds that file equal to a fresh run. Each record shows its id, links to islam.museum and stands under the "historical review pending" mark (ledger HR-LA-02). No quotation, date or fact is written by the game.

## Art

Placeholder art drawn by code: the lamp and the map are SVG written in the page. No AI-generated image, no downloaded asset. The page says the pictures are placeholders.

## Not done

Phaser scene or animated travel; more destinations (Granada in the 15th century, Isfahan, Delhi, Istanbul); figures speaking in more than their record's summary (that needs reviewed lines); sound; a native speaker's reading of the strings; the title's search; a phone check on production.
