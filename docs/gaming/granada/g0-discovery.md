# Granada, G0: what was found before building

_25 November 2026. Written by Claude Code (claude-fable-5-2) at the founder's instruction to process the Granada package completely. This is gate G0 of the package's roadmap: inventory, ownership, decisions, baseline, source gaps, scope. It reports what was checked and what was not; where it gives a judgement, it says whose._

## 1. The package

`granada-production-package.zip`, received 25 November 2026. All 19 files match `PACKAGE-CHECKSUMS.sha256`. It is copied to [`../spec-granada/`](../spec-granada/) with two differences from what was received: the three concept images are reduced to 1280 × 720 (282 to 293 KB each; the originals stay in the founder's package), and the nested Version 2 archive is not copied, because its SHA-256 (`5e7ffb129f5f…84a7e`) is the one already verified and unpacked in [`../spec-v2/`](../spec-v2/).

Every document in it was read in full: the start page, the master prompt, the eleven numbered documents, the acceptance matrix in both forms, and the economy fixture. The three images were opened and looked at one by one.

The package says of itself that no repository audit, no implementation, no GPU measurement and no playtest was done for it, and that its numbers are "illustrative design fixtures, not historical measurements or final balance". This report is the repository audit it asks for.

## 2. Ownership and rules

| | |
|---|---|
| Lane | `gaming`, sub-lane Granada ([G-0009](../adr/G-0009-granada-eleventh-game.md)) |
| Owns | `gaming/games/granada/**`, `docs/gaming/granada/**`, `docs/gaming/games/granada.md`, `docs/gaming/spec-granada/**`, `docs/gaming/evidence/granada/**` |
| Does not own | Any museum record (`data/**`, `content/**`), any file of the site, the Workers, the workflows, the publish lists |
| Agent | Claude Code, one session, one worktree. A second session worked on Atlas earlier the same day and shares `docs/gaming/LEDGER.md` and `CANARY.md`; entries are merged, never overwritten |
| Order of authority | Repository governance, then the founder's explicit authorizations, then the Granada addendum for this title, then Version 2 for shared systems (the package's own order) |
| Approvals held by the founder | Deployment; anything `submission-impacting` (header, footer, homepage, `_headers`, Workers, workflows, publish lists); paid services; external submission; the eleven-game registration on the site (gate GRA20) |

## 3. What exists that Granada can stand on

Checked in this worktree at `6f3df5dd203`.

| Need | What exists | Use |
|---|---|---|
| Renderer | Three.js r187 on WebGPU, chosen by measurement ([G-0002](../adr/G-0002-rendering-engine.md)); a renderer of 48 plots with canals, water, seasons and walkers in The Golden Age | Reused. No second engine comparison |
| Procedural building kit | `packages/worldkit`: houses, arcades, domes, palms, textures made in a worker, season light | Reused for a first village; Granada needs terrain, terraces, towers and walls that the kit does not have |
| Determinism | `packages/kernel/prng.ts` (seeded, forkable, with saved state); the rule that no rule reads a clock ([G-0005](../adr/G-0005-determinism.md)) | Reused as is |
| Music | `packages/audio`, the museum's suite ([G-0007](../adr/G-0007-music-and-audio.md)) | Reused as is. No sound effects exist |
| Museum facts in a game | The pinned-pack pattern of Atlas and The Golden Age: record ids chosen by hand, labels in seven languages copied into a file in git, a builder that stops on a missing language | Reused: Granada's first pack is built ([`../games/granada.md`](../games/granada.md)) |
| Saving | Each game has its own save module of the same design (versioned, migrated, corrupt-save recovery) | The pattern is reused; Granada is the third game to need one, which is the point at which the ledger says it becomes a shared package |
| Checking a game in a real browser | The play tools (`tools/golden-age-play.ts`): Chrome driven through a whole game, frame times recorded, captures taken | The pattern is reused when Granada has a screen |
| Strings | `tools/check-strings.py`: seven languages, same keys, no honorific, isolated Arabic parentheses | Reused when Granada has strings. It has none yet |
| A simulation lab | The Golden Age's lab: 14 scripted players over 1,000 seeds, invariants checked every step | The pattern is reused; Granada's first lab piece is its random-play report |
| **A ledger, markets with two prices, reservations, contracts** | **Nothing.** The Golden Age has a treasury number and no second price | **Built in this change** ([G-0010](../adr/G-0010-granada-economy-kernel.md)) |
| **Distance and direction between real places** | Atlas scores a guess by great-circle distance on a globe | Granada has its own small module, in whole metres, with a flat map centred on the city |
| Transport, a fixed-step clock, water as a network, labour, terrain, construction in stages, diplomacy, quests, a first-person camera, a photo mode | Nothing | To build |

The seven languages, the hosting, the continuous integration and this machine are as the M0 inventory found them ([`../m0-repository-inventory.md`](../m0-repository-inventory.md)); nothing in them changed for Granada.

## 4. Baseline measurements

Nothing has been measured for Granada: it has no scene. What is known is what the existing renderer does on one machine (Apple M4 Max, Chrome 158), and it is a baseline, not a forecast.

| Scene | Size | Result |
|---|---|---|
| M1 reference district, 2560 × 1440, High, uncapped | 770 buildings, 1.33 million triangles, 640 walkers | p50 6.0 ms, p95 6.9, p99 7.1, 0 of 3,280 frames over 16.7 ms |
| The same, 3840 × 2160, Ultra | | p50 7.0 ms, p95 9.5, p99 13.8, 7 of 2,720 frames over 16.7 ms |
| The Golden Age, full district at the end of a campaign, 1920 × 1080, High, display-synced at 120 Hz | 1.56 million triangles, about 950 draw calls | p50 8.3 ms, p95 9.0, p99 9.3, none over 16.7 ms |

The package's benchmarks B1 to B6 (first village, mature Granada, regional map, fortress construction, winter and defence, device recovery and soak) are all **not run**. The third image's scene (a hill city, terraced fields to the horizon, a harbour, hundreds of figures) is several times the reference district; whether the present renderer holds it is unknown and is the first question for G1. One machine is not a hardware requirement.

## 5. The museum's records for Granada

Searched in `data/` and `content/en/` on 25 November 2026.

**Found and pinned (25 records, every label present in the seven languages):** eleven places with coordinates (Granada, Málaga, Almería, Almuñécar, Vélez-Málaga, Loja, Alhama, Guadix, Baza, Ronda, the Sierra Nevada); the Emirate of Granada; the Alhambra, the Generalife, the Nasrid Palaces and the Madrasa of Granada; three events (Ibn al-Ahmar's entry in 635, the founding of the Alhambra, the surrender of 897); Ibn al-Khatib's history of Granada; and five records for the ideas behind systems (the saqiya, Ibn Bassal's matching of soil and water, the hisba, lustreware, tiraz). Twenty are `draft`, five `published`.

Two of those five say something about this kingdom's own trades, and they are the only such statements found. The lustreware record says that Málaga, and then Manises, carried the technique on in Spain. The tiraz record's prose says that Almería, Murcia, Seville, Granada and Málaga became leading centres of that state textile work in al-Andalus. Neither gives a date near 1475. The Almería place record, from al-Maqqari, counts that city's silk looms in its heyday, before it fell in 542 AH, three centuries before the scenario.

**Found and not used, with the reason:**

| Record | Why not |
|---|---|
| `building/granada-mosque` | It is the mosque opened in 2003. It is not a building of the Nasrid city, and a test now keeps it out of the pack |
| `building/casa-del-chapiz-granada` | Its date relative to 1475 is not established from the record; left out until it is |
| `person/boabdil-muhammad-xii` | Has a label in Arabic only |
| `person/abu-al-hasan-nasrid`, `person/muhammad-v-nasrid`, `person/yusuf-i-nasrid` | No Turkish or Indonesian label. Also: no real person speaks or acts in the game (the package forbids invented speech for real figures) |
| `event/siege-of-loja-1482`, `event/siege-of-malaga-1487` | Draft cards whose own summary says the sources are not yet checked; and they are after the scenario's date |
| `invention/sugar-refining` | It is tagged with the region of al-Andalus, but neither its record nor its prose names a place there. Sugar in Granada is unsourced here |

**Not found.** The museum's English prose on Granada, the Alhambra and the emirate (three files) was searched for olives, wheat, silk, sugar, mulberry, grapes, vineyards, figs, almonds, citrus, oranges, orchards, crops, harvest and irrigation as whole words: no occurrence. It names the Vega, the Genil, the Darro and the Acequia of the Generalife without describing an irrigation network, and it mentions the city's merchants' inns, of which the Corral del Carbón stands (from the Encyclopaedia of Islam). So for most of the game's own subject (what was grown, when, and how water was shared) the museum at present says nothing that could be quoted or linked; for two crafts and for the inns it says a little.

A correction made while writing this report: the first search used the shell's `grep`, which on this machine is `ugrep` and fails on a bounded repeat such as `.{60}` with an error that is easy to miss. It had reported that the lustreware and tiraz records say nothing of al-Andalus. They do. Every search above was redone in Python and the two records were added to the pack.

### Geography, from the museum's coordinates

| From Granada to | Role in the game | Straight line | Direction |
|---|---|---:|---|
| Sierra Nevada (Shilir) | mountain | 21 km | south-east |
| Alhama | town | 40 km | south-west |
| Guadix | town | 44 km | east |
| Loja | town | 48 km | west |
| Almuñécar | coast | 51 km | south |
| Vélez-Málaga | town | 63 km | south-west |
| Baza | town | 81 km | north-east |
| **Málaga** | **port** | **89 km** | **south-west** |
| **Almería** | **port** | **109 km** | **east** |
| Ronda | town | 147 km | west |

Málaga to Almería: 175 km, with Granada between them from west to east. Granada is inland; the nearest pinned place on the sea is 51 km away. These are tests (`gaming/games/granada/test/geography.gtest.ts`), so a map that puts the ports side by side cannot be built from this data. Of the eleven coordinates the museum marks two as `site` (Granada, Málaga), six as `locality` and three as `approx` (Loja, Guadix, the Sierra Nevada). A road is longer than a straight line, and no route length is known yet.

### Defects noticed in museum records, reported and not changed

These are outside the gaming lane. They are listed for the founder and for the lanes that own the records.

- `place/granada`: the Turkish and Indonesian summaries carry machine-translation errors visible to a reader ("Chnel Vadisi", "Lembah Chnel" for the Genil; "Alhambralar dahil", "termasuk Alhambras").
- `place/malaga` and `place/almeria`: the Urdu summaries end in a broken citation marker (the closing brace and page numbers without the opening `{cite:`).
- `place/loja`: the English summary is "Town (Wikidata Q332989)."
- `person/boabdil-muhammad-xii` is `published` with a label in one language of seven.
- Four building cards and two siege cards for Granada say in their own summary that their sources are not yet checked.

## 6. Claims the game would make, and what supports them today

The package asks for a claim matrix. This is its first form. "Museum" means a museum record says it; "package lead" means the package cites an outside page that has not been turned into a museum record; nothing below is in the game yet.

| Claim | Support today | State |
|---|---|---|
| Granada was the Nasrid capital from 635/1238 to 897/1492 | `place/granada` (from the Encyclopaedia of Islam, 2nd ed.) | Museum, draft |
| The Alhambra stood on the Sabika hill above the city, a palace-city with a citadel | `building/alhambra` | Museum, draft |
| Málaga and Almería were ports of al-Andalus | `place/malaga`, `place/almeria` (from al-Maqqari) | Museum, draft |
| The snow mountain feeds the river below Granada | `place/sierra-nevada` (from al-Idrisi) | Museum, draft |
| Who ruled in 1475 | `person/abu-al-hasan-nasrid` exists; its summary gives no regnal years in what was read | **Not established here.** No ruler is named in the game until it is |
| Lustre pottery was made at Málaga | `invention/lustreware` (from Lane, *Early Islamic Pottery*, and the Encyclopaedia of Islam) | Museum, published. No date near 1475 in the record |
| Granada, Málaga and Almería were centres of tiraz textile work | `invention/tiraz` prose (from the TDV encyclopaedia) | Museum, published. No date near 1475 in the record |
| Granada had merchants' inns | `place/granada` prose (the Corral del Carbón) | Museum, draft |
| Olives, wheat, grapes, figs, almonds, citrus, mulberry and raw silk were grown or made in the Vega | Package lead (Archnet timeline: silk, dried fruits, ceramics) | **Unsourced in the museum.** Every crop is a game element labelled as such until a record supports it |
| When each crop was sown and gathered | None | **Unsourced.** The third image shows ripe wheat beside the olive harvest in autumn; no calendar is taken from it |
| An irrigation network of named canals | Package lead (Patronato pages); the museum names the Acequia in the Generalife | **Unsourced** as a network |
| The currency was the dinar | The package itself lists "coin/currency terminology" as outstanding | **Unverified.** The code counts in an abstract unit it calls a dinar; the word shown to a player is not decided |
| Pack animals: the first image shows camels | None | **Unsourced.** No animal is specified |
| Prices, populations, yields, contract terms, the steward, the quests | The package: all fictional | **Simulation**, to be labelled as such wherever shown |

## 7. The three images, read against the documents and the data

The agent's own reading of the three files. The package's document 06 lists corrections; these confirm them and add what the data shows.

**Version 3 (the primary reference).** A wide autumn view: a hill city with a palace on its height, terraced fields, a selected olive estate with a panel, a castle under construction with a green ghost of a tower, a harbour with ships, and panels on every edge.

- The olive estate's value is shown as 435,200. That is 6,800 units multiplied by the oil bid of 64. At the raw bid of 28 it is 190,400, and with room for only 5,200 it is 145,600 unless something is done about the other 1,600 units. The panel shows no overflow.
- Málaga and Almería are drawn as neighbouring harbours beside the city. They are 175 km apart with Granada, which is inland, between them.
- "Food reserves adequate" stands beside 36,400 of 40,000: 91%, and 3,600 short.
- The tower's placement ghost is shown while the screen is in its economy mode; the package's own rule is one mode at a time.
- More panels are open at once than a person can read; the package asks for a clear overview first.
- Wheat stands ripe in autumn beside the olive harvest. No crop calendar supports it.
- Red banners with an emblem fly from the towers: invented heraldry, which the package forbids presenting as authentic. The palace's massing is generic, not the Alhambra's.

**Version 1.** A closer view of wheat fields, a watermill, caravans and a market.

- One price for each good: no difference between buying and selling.
- A caravan of camels: unsourced for this place and time.
- A spire that reads as a bell tower, a later kind of structure than the scenario's date.
- A label misspelt "Aslectural District"; banners with an emblem.

**Version 2.** Mode buttons, production chains and a trade panel.

- Its price table lets the player buy below the price at which the same market buys back: money for nothing, as often as wanted. The kernel refuses to open such a market.
- Its contract figures do not agree with Version 3's.
- A label reads "Vineyard (Grapes & Wine)". Whether that good appears in a game of this museum is the founder's decision; the default in force is that grapes are a fruit crop and no such product exists in the game.
- What is worth keeping from it: the mode buttons and the idea of showing a chain from field to workshop to market.

None of the three is a capture of a game. None will be used as a background, a texture or a source.

## 8. How G0 to G8 sit on the platform's milestones

| Granada gate | Platform milestone it leans on | State on 25 November 2026 |
|---|---|---|
| G0 Discover | M0 (done) | **Done with this report**, except a benchmark of a Granada scene, which cannot exist before there is one |
| G1 Art and renderer laboratory | M1 (measured on one machine; physical tests open) | Renderer exists. Terrain, the Granada look, an asset pipeline and a physical GPU benchmark: not started |
| G2 Playable village | M2, M3 | The money and goods under it are built. Water, farming, building, a quest, saving, a screen: not started |
| G3 Regional economy | G2 | Markets with two prices, a recipe, contracts and the places' real distances are built and tested. Moving prices, transport, seasons: not started |
| G4 Construction and pressure | G2, G3 | Not started |
| G5 Campaign and replay | G3, G4 | Not started |
| G6 SDK and creator | M8 | Not started. Programmable extensions stay disabled (threat model) |
| G7 Integration | M9; begins at G0 | The game has its directory, its aliases, its scripts and its documents. Registration on the site in seven languages is `submission-impacting` and waits for the founder |
| G8 Release candidate | M10, M11 | Not started. Needs physical GPUs and people |

## 9. Where the package and the repository differ, and what was done

| The package says | The repository says | Done |
|---|---|---|
| No protected-branch merge without approval | Agents merge their own gaming-only pull requests after the gates and a three-way merge (dec-20261108-185) | Repository rule followed; anything `submission-impacting` waits |
| Compare renderers where unresolved | Three.js was chosen by measurement | Not re-opened |
| Cite outside institutional pages as leads | Every fact in the museum cites a defined museum source; a game quotes the museum, not the web | The leads are recorded in the package; none is used as a source by the game. Turning them into museum records is lane content, outside this lane |
| A fixture in which pressing oil earns less than selling olives | (the package itself warns against using it as tuning) | Used as an oracle for arithmetic only |
| "Dinars" throughout | Nothing; and the package lists currency terms as unverified | An abstract unit in code; the displayed word is undecided |

## 10. Needs the founder

Added to the list in the ledger.

| Item | Default in force until he rules |
|---|---|
| Whether a product of the vine other than fruit may be a good in the game (the second image's label) | No. Grapes are a fruit crop |
| Whether the game may name the ruler of 1475 or any real person | No real person is named, shown or given words |
| Whether museum lanes should write the records Granada needs: the Vega's crops and their seasons, the irrigation canals, the silk and ceramics trades, the ports' commerce, the coinage | Nothing is asked of other lanes without his word; the game labels all of it as simulation meanwhile |
| The word shown for the currency | Undecided; nothing is shown yet |
| Whether banners and emblems may be drawn at all | Plain cloth without device |
| The defects in museum records listed in section 5 | Reported; not changed by this lane |
| Registration of the eleventh game on the site, in seven languages (gate GRA20) | Not started; `submission-impacting` |

## 11. What G0 did not do

- No Granada scene exists, so nothing about how Granada looks or runs has been measured.
- No source outside the repository was read to verify a historical claim; the package's links were not followed. Every historical statement above is what a museum record says, with its review state.
- The museum's records were searched by name and by a handful of words in three prose files. A fuller search of the graph (relations, periods, objects in `media`) may find more.
- No person has seen any of this.
