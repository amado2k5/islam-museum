# The Lamp of the Ages: state of the game

_26 November 2026. Release status: **prototype**. Code: `gaming/games/lamp/`. Design: [../lamp/design.md](../lamp/design.md)._

A first playable 2D slice: a time dial and map, five destinations from the graph (Baghdad, Cordoba, Cairo, Samarqand, Timbuktu), a mission at each, record cards carried in a locally saved satchel, and companions who travel along.

- **Content:** every fact is a museum record's own label and summary, copied by `tools/build-records.ts`; each shown with its id, a link to islam.museum and the historical-review mark (ledger HR-LA-01, HR-LA-02, both pending).
- **Fiction, said on the page:** the lamp, the jinni as a guide, the travel, the cards and the gates.
- **Languages:** ar, en, ur, fr, es, tr, id; Arabic and Urdu right to left. Strings drafted by an AI agent, not yet read by native speakers.
- **Accessibility:** plain buttons, a range input for the dial, a live region, the map with a text title and caption; full keyboard play. Not audited by a person.
- **Tests:** `gaming/games/lamp/test/lamp.gtest.ts` (every mission completes, gates and companions, every shown id is a record, the record file equals a fresh build, each answer is named in its record, the save round-trips).
- **Placeholder:** all art; the jinni is never drawn.
- **Known gaps:** `person/ulugh-beg` has an Arabic label only, so his name shows in Arabic in every language; no phone or minimum-machine check; title not searched.
