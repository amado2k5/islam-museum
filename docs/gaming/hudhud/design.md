# Hudhud: The Atlas of Wonders — game design

_26 November 2026. Phase 0. Written by an AI agent from [the founder's instruction](owner-instruction-2026-11-26.md), which governs wherever this page and it differ. Nothing here has been played by a person other than the author's script. Everything about history stands as "historical review pending"._

## The player's promise (one page)

You are a young Storykeeper of the museum, and your guide is Hudhud, a small orange hoopoe with a fan of a crest and a great deal to say. A storm of loose pages has scattered the Atlas of Stories across ten worlds. In each world you meet people, and a few animals, whose stories the museum keeps: someone who watched light, someone who built a clock, someone who walked across the known world and wrote it down. You fly, you look, you turn and tune and mend things, you ask questions, and a page of the Atlas comes home.

- **You can fly in the first minute.** No manual, no long film.
- **You learn by doing.** A puzzle works the way the idea works. Reading the museum's note afterwards is always optional.
- **Nobody is hurt and nobody is the enemy.** What you face is forgetting: wind, lost ink, ink moths, a muddle to set straight.
- **It is honest about what is real.** The Atlas, the storm, the rooms and every word spoken are invented and say so. The people were real, or are marked as story tradition, and the museum's record is one link away.
- **Three ways to play:** Story (gentle, with hints), Explorer (as meant), Challenge (tighter, never grindy).
- **Free, private, yours.** No account, no adverts, no purchases, no timers that punish you for leaving, nothing that leaves your device.
- **Seven languages**, Arabic and Urdu right to left.

## The frame (fiction, and said to be)

The Atlas of Stories is a great book in the museum's keeping in which every page is a story of how something was found, made, healed, built or told. A storm of loose pages, lost ink and mischievous ink moths has scattered it. Where a page lands, its ink goes pale and the story around it starts to come apart: a clock stops, a map loses its coasts, a poem loses its metre. Hudhud saw where the pages fell. The Storykeeper carries the Atlas's empty cover.

The force behind the storm is **forgetting**. It has no face, no people and no country. Its creatures are ink moths, which are nuisances, not villains: they nibble ink, tangle threads, blow out lamps. They are shooed, outwitted or befriended, never harmed. The larger mystery, which the ten worlds answer piece by piece, is how a story survives at all: somebody writes it down, somebody carries it, somebody translates it, somebody teaches it, somebody checks it. The last world gathers these into one answer, and the post-game asks the player to add a page of their own (kept on the device).

## The loop

| Span | What the player does | What changes |
|---|---|---|
| Seconds | run, hop, flap, glide; look; touch; turn, tune, connect, carry | immediate picture and sound; the goal line updates |
| A quest (15 to 25 minutes) | arrive, meet, try, understand, restore the page; optional secret and three goals | a page returns; a museum note opens; three goals (Curiosity, Ingenuity, Kindness) and hidden things are recorded |
| A world (2 to 3 hours) | five quests in any order after the first; a world thread ties them | a wing of the Atlas hub is restored: a shelf, a constellation, a garden bed, a working machine |
| The game | ten worlds from the hub; the mystery of the storm | the hub fills with visitors and working exhibits; the last page is the player's own |
| After | mastery goals, secrets, time trials, daily and weekly challenges made from seeds, New Journey+ | nothing expires; an archive keeps every past challenge |

**The golden scene is this loop at the scale of minutes**: fly (seconds), meet Ibn al-Haytham and the cat, turn mirrors until the beam reaches the page (the quest's heart), find the dark room and a feather (secrets), read the note (after).

## The ten worlds and the fifty quests

The grouping is the founder's and is a structure for play, not a claim that the five lived together. Subjects, pictures and records: [`traceability.md`](traceability.md). Core systems are named in the next section; each quest combines two or three.

| # | World | Quests (in order) | Systems the world leans on | The hub restores |
|---|---|---|---|---|
| 1 | Sky, Stars and Time | Abbas ibn Firnas; al-Sufi; al-Tusi; Ibn al-Shatir; al-Battani | Flight, Trace, Align | the ceiling of stars |
| 2 | Machines, Numbers and Codes | al-Jazari; al-Khwarizmi; al-Kindi; the Banu Musa; al-Shatranj | Mechanism, Path, Cipher | the hall of working machines |
| 3 | Light, Earth, Water and Maps | Ibn al-Haytham; al-Biruni; al-Karaji; al-Idrisi; Thabit ibn Qurra | Beam, Measure, Route | the lantern and the map table |
| 4 | Medicine and Care | Ibn al-Nafis; Ibn Sina; al-Zahrawi; al-Razi; Ibn Zuhr | Observe, Match, Care | the garden of the hospital |
| 5 | Books, Schools and Language | Fatima al-Fihri; the House of Wisdom; Karima al-Marwaziyya; al-Khalil; Rashid al-Din | Network, Mend, Rhythm | the shelves |
| 6 | Journeys and Maps | Ibn Battuta; Ibn Jubayr; Evliya Çelebi; al-Hasan al-Wazzan; al-Masudi | Route, Journal, Flight | the travellers' gate |
| 7 | Seas, Trade and Golden Books | the Sailor of Sohar; Sindbad; coffee's journey; Mansa Musa; Timbuktu | Sail, Route, Mend | the harbour and the book chests |
| 8 | Cities, Builders and Civic Care | Mimar Sinan; the palace story; Nur al-Din; Salah al-Din; Ibn Khaldun | Build, Network, Care | the courtyard and its water |
| 9 | Nature, Animals and Wonders | al-Jahiz; Ibn al-Baytar; al-Qazwini; the Monkey and the Tortoise; pigeon post | Observe, Match, Route | the aviary and the herb beds |
| 10 | Voices, Wisdom and Society | Wallada; Nana Asma'u; al-Ghazali; Usama ibn Munqidh; Samarqand | Rhythm, Network, Journal | the reading room, and the last page |

Limits the instruction sets and this plan keeps: world 4 says "history, not medical advice" on every screen that shows a remedy or a diagnosis, and no quest diagnoses the player; world 7 does not treat wealth as worth or a region as treasure; world 8 does not present the founder's palace picture as a reconstruction and tells Nur al-Din's and Salah al-Din's stories through hospitals, schools and conduct, with no battle played; world 9 gives no advice about plants; Sindbad and the Monkey and the Tortoise are labelled story tradition, where a quest may branch freely.

## Twelve systems for fifty quests

Fifty bespoke minigames would be fifty fragile things. Each system below is one tested rule set with authored variations, a seeded generator for challenge rooms, an untimed Story form and a form in words for a player who cannot use the picture.

| System | What the player does | First built for | Used in worlds | State |
|---|---|---|---|---|
| **Flight** | run, hop, flap, glide, perch; wind and updraughts later | every quest | all | **built** (`sim/move.ts`), without wind |
| **Beam** | turn mirrors, stop or pass light, split it | Ibn al-Haytham | 1, 3 | **built** (`sim/light.ts`): mirrors of two or three positions (two leans, and laid flat so that the beam passes), obstacles, decoy mirrors that must stay out of the road, a solver that counts the fewest turns and proves one answer only |
| **Talk** | essential lines, "ask more", choices that never change history | every quest | all | **built** (`narrative/dialogue.ts`) |
| **Mechanism** | put a machine's parts in the order in which each hands its motion to the next; later, gears, floats, valves and siphons | al-Jazari | 2, 8 | **rules built and tested** (`sim/chain.ts`, and the rules of a quest made of a row, `sim/chainquest.ts`, shared by `sim/clock.ts` and `sim/paper.ts`); in two trial quests, the elephant clock and, for Samarkand, the paper (a papermaker's steps in a row, which is the same rules on steps and not on parts), played with page controls and no flying scene |
| **Path** | lay a step-by-step route or procedure that a thing then follows | al-Khwarizmi (as first planned; see the note under the table) | 2, 6, 9 | designed, not built |
| **Route** | plan a journey or a flow over a map: wind, water, provisions, time | Ibn Battuta | 3, 6, 7, 9 | designed |
| **Trace and Align** | join stars, set an instrument to a reading | al-Sufi | 1, 3 | designed |
| **Observe and Match** | look closely, compare two accounts or two cases, sort by evidence | al-Razi | 4, 9 | designed |
| **Cipher** | count and rank the signs of a long sample and of a secret message, compare, and test a guess by the opening | al-Kindi | 2 | **rules built and tested** (`sim/cipher.ts`); in one trial quest, al-Kindi and the secret page, played with page controls (lists of choices) and no flying scene; neighbouring letters and pointing at the picture are not built |
| **Mend and Build** | assemble arches, pages, a chronicle, in the right order and balance | Mimar Sinan | 5, 7, 8 | designed |
| **Network** | link people and places so that learning or help reaches everyone | Fatima al-Fihri | 5, 8, 10 | designed |
| **Rhythm** | keep a metre, by ear, by eye or by touch | al-Khalil | 5, 10 | designed |

**Added 26 November 2026, later: a rule set that is not in the table.** Al-Khwarizmi's trial quest, the locked box, was built on **equation moves** (`sim/algebra.ts`): a problem is two sides of things and numbers, some taken away, and the player brings it to one thing equal to a number by restoring (al-jabr), balancing (al-muqabala) and sharing (the game's own plain step). It is tested for honesty (every move keeps the answer, on the three authored problems and on hundreds of seeded random ones), has three problems of the fewest moves 2, 3 and 3, and a form in words at every step. It stands where this table gave al-Khwarizmi to Path; Path itself is not built, and whether equation moves become a thirteenth system or a form of another is not decided here.

**Added 26 November 2026, later still: a second rule set that is not in the table.** Al-Idrisi's trial quest, the scattered sheets, is built on **exchanging sheets until their edges meet** (`sim/sheets.ts`): the sheets of an imagined map lie in a grid out of order; each edge carries nothing or a coast, a river or a road at one of three places along it, and a feature that reaches an edge must go on at the same place on the next sheet; the player exchanges two sheets at a time. It is tested for honesty: each of the three maps (2 by 3, 3 by 4 and 3 by 5 sheets) is shown by search to have exactly one arrangement, an outer border that carries nothing and no two sheets alike; the fewest exchanges (places wrong less the cycles they fall into: 2, 5 and 11) are checked against a brute search over every arrangement of the small map; a saved place is accepted only if it is a permutation of the style's own sheets that the start can reach in no fewer exchanges than were counted. The table names no system for al-Idrisi (his world has Beam, Measure and Route, and this is none of them as written); whether it becomes a thirteenth system or a form of another is not decided here.

**Added 26 November 2026, later still: a third rule set that is not in the table.** Al-Jahiz's trial quest, the animal cards, is built on **sorting cards into groups until each is in the group a passage gives it** (`sim/sort.ts`, generic over the cards, the groups and the answer map): the player puts each card in a tray, or takes it out, and then "shows" the cards; a showing with a card not yet placed is refused and not counted, and one that finds a card in the wrong group is counted as a failed showing. The three ways of playing are three groupings of the same eight animals (4 cards in 2 groups, 8 in 2, and 8 in 5), and each is tested for honesty: every card has exactly one right group, every group has at least one card, and the answer uses only what the museum's record of the passage states (the table is written again by hand in the test, with the passage's phrase beside each line). A saved place is accepted only for cards and groups of the style's own, with whole non-negative counts. Sorting is the game's own idea and is said to be; the table gives al-Jahiz's world Observe, Match and Route, and Observe and Match include "sort by evidence", but putting cards in the groups a passage gives them is not sorting by evidence and is none of the three as written; whether it becomes a form of Observe and Match or a thirteenth system is not decided here.

**Added 26 November 2026, later still: the seventh trial quest is a second use of the Mechanism rules, not a new system.** Samarkand's trial quest, the paper, is a papermaker's steps in a row, each taking the material in one state and handing it on in the next (`content/paper.ts`, `sim/paper.ts`): five places in Story (two steps joined where the museum's record joins them in one sentence), seven in Explorer, eight in Challenge, with no spare card and no decoy, because every card is a real step of the record's recipe. What the elephant clock and the paper both need around a row of places (a count of moves, the fewest possible, flags, the four goals, a snapshot that is proved on restore) was lifted out of `sim/clock.ts` into one module, `sim/chainquest.ts`, that takes a quest's own flags; a test covers it with a made-up quest as well as with both real ones. That a row of steps is the same thing as a row of parts is the game's own idea and is said to be: the page says the workshop, the papermaker, the child, the cards and every spoken line are invented, and that what is from the record is the recipe, its order and the spread of the craft.

**Added 26 November 2026, later still: a fourth rule set that is not in the table, and it is not the table's Route.** Ibn Battuta's trial quest, the thread of the road, is built on **following a route: threading stops in the order a record gives them** (`sim/route.ts`, `content/route.ts`): a stage is a set of beads and a road over them (a stop may come twice), the thread moves on only at the next stop, a wrong stop is a slip (in Challenge it also sends the thread back to the start), and the stage's sentence is always shown in Story, hidden once the thread begins in Explorer (free to show again) and hidden in Challenge (showing it again is a slip). It is tested for honesty: each road is the record's order, written again by hand in the test with the record's sentence beside it and each stop anchored to a word in the record's file; the beads are set round a ring in an order that is not the road's (no bead where the road has it, no two road neighbours side by side, no turning or flipping of the road gives the ring), so that the picture cannot be read as a map; a saved place is accepted only as a whole number of stops threaded short of the road's end and a whole number of slips. The table's Route (plan a journey or a flow over a map: wind, water, provisions, time) is a different and larger idea and is still designed, not built; whether this becomes a form of it is not decided here.

**Added 26 November 2026, later still: a fifth rule set that is not in the table.** Al-Tusi's trial quest, the two circles, is built on **setting a mechanism and watching what it traces** (`sim/couple.ts`, `content/couple.ts`): a small circle is carried round inside a large one, a point rides on the small circle, the player sets the small circle's direction, its speed (one, two or three times the large one's) and, in Challenge, its size (a third, a half or two thirds), and presses Turn the circles. The point's path is worked out and then classed by measurement from its points alone (a line, a circle, an oval or loops, with the lobes counted), so that a setting is a straight line because its path measures as one and not because a formula says so; the tests prove that the half size, twice the speed and the opposite way is the only line of the eighteen settings, that its path is as long as the large circle is wide, and that every setting's class is the same at 180, 360 and 720 points. A turning that is not a line is counted; the three ways of playing offer two, six and eighteen settings and say more or less about a wrong turning (Story names the shape and says to try the other way, Explorer names the shape, Challenge says only that it is not a line). The page's own animation (the small circle going round while the path grows) is the page's and never the rules', can be skipped, and is not shown with reduced motion. Nothing the page shows before the line is found says "twice" or "the opposite way", except the choice of the speed itself; a test checks that in all seven languages. The picture has no left-to-right order, so it is not mirrored on a page that reads right to left. The table's Trace and Align (join stars, set an instrument to a reading) is nearest to it, and is still designed, not built; whether this becomes a form of it is not decided here.

"Sail", "Measure", "Journal" and "Care" in the table of worlds are forms of Route, Align, Observe and Network respectively, not further systems.

## Goals, replay and what is deliberately absent

- **Three goals a quest**: Curiosity (asked for more, or found the hidden thing), Ingenuity (solved it within a fair count), Kindness (did the small good thing: greeted the cat, returned what was dropped, waited for someone). They are about what the player did. They never grade a person of history.
- **Hidden things**: feathers, map fragments, seeds, gears, star marks. They are things that belong in an atlas, never objects taken from a place.
- **Made from seeds, kept for ever**: daily and weekly challenge rooms come from the shared seeded generator (the Beam generator exists and is tested over 3,000 seeds), every past one stays in an archive, and a challenge can be shared as a short text code. No online scores.
- **Absent on purpose**: accounts, adverts, purchases, loot boxes, energy timers, streak penalties, notifications, public chat, anything made by a model while the game runs, any score sent anywhere.

Mechanics studied as benchmarks only, with nothing copied: low-pressure exploration and collecting (*A Short Hike*), warm character talk (*Spiritfarer*), flow and secrets (*Rayman Legends*), legible visual puzzles (*Monument Valley*), assists and precise movement (*Celeste*), a place that restores (*Stardew Valley*), talk that reacts to what you did (*Hades*), variety (*Dave the Diver*).

## The title

The working title is the founder's: **Hudhud: The Atlas of Wonders**. The game's own page carries the label "Working title".

| Option | For | Against |
|---|---|---|
| **Hudhud: The Atlas of Wonders** | the founder's; says who and what | the platform already has a game called **Atlas** (the daily geography game, `gaming/games/atlas/`): two "Atlas" titles side by side on the Play page will be confused |
| Hudhud and the Scattered Atlas | names the story; still says "Atlas" | the same clash, a little less |
| Hudhud: Keeper of Stories | no clash; says what the player is | loses "wonders" |
| Hudhud's Book of Wonders | no clash; warm | "Book of Wonders" is also the common English name of al-Qazwini's work, one of the fifty subjects |

**Search status (corrected later on 26 November 2026): a first public search has been made, and it is not clearance.** [`title-search.md`](title-search.md) records it: stores and trademark registers were searched for the four options and the Arabic names, and it reads the bare title "Hudhud" as high risk and the full working title as medium-high, in a crowded children's and Islamic-learning market; it is a research note, not legal advice. The attempt described next was made earlier the same day and did not complete. A lawyer's search of the exact jurisdictions and classes has not been made. Until it is and the founder decides, the title stays a working title and nothing is registered, bought or announced. "Hudhud" is the ordinary Arabic word for the hoopoe and the name of the founder's own video series.

## How big this is, said plainly

The instruction asks for 20 to 30 hours on the main path (fifty quests of 15 to 25 minutes, a prologue, a hub and ten world threads) and 40 to 60 for mastery. What exists is one scene of a few minutes (the script that plays it takes about one minute; no person has been timed) and three short trial quests played on a page (the elephant clock, the secret page and the locked box; no person has timed them either).

What one agent session produced, on 26 November 2026, in about an hour and a quarter of working time: three of the twelve systems (Flight, Beam, Talk; the rules of a fourth, Mechanism, followed the same day), saving, one room with a garden, four figures, 163 strings in seven languages, 85 tests of its own and a tool that plays the scene in Chrome. That rate does not scale linearly, for three reasons that are larger than code:

1. **Art.** The pictures in the scene are a code-drawn trial. If the founder judges them not good enough, as he judged Granada's, the art for fifty subjects is the work of an illustrator and an animator, not of this agent ([art bible](art-bible.md)). That decision sets the calendar more than anything else here.
2. **Review.** Fifty subjects need a named reviewer in history of science, medicine, architecture, geography and literature, and a native reader for six languages. None is named.
3. **People playing it.** The targets for age bands, playtime and "children begin without explanation" can only be met by watching children play. No playtest has been run.

An estimate, with its assumptions on the page:

| Piece | Agent work (sessions like this one) | Waits on |
|---|---|---|
| Phase 1, this scene, to acceptance | done as a trial; 1 to 2 more to act on the founder's judgment | the founder's word on the look |
| Phase 2, the 60 to 90 minute slice (prologue, hub, four quests) | 12 to 20: four more systems, a hub, four rooms, remapping, a real phone layout, postcards | the art decision; one reviewer; first playtests |
| Phase 3, ten worlds | 8 to 12 a world once the systems exist, so 80 to 120 | art for each world; review of each world; playtests after each |
| Phase 4, the candidate | 15 to 25: soak, the two reference machines, all gates | both physical machines; beta players; the founder |

That is on the order of **110 to 170 agent sessions**, and it is the smaller part. With an illustrator and an animator at a pace of one world a month, review keeping up, and playtests between waves, the whole game is **about a year** from an accepted look. Without an art route the founder accepts, there is no date. These are an agent's estimates from one scene; they are not commitments and have no playtest behind them.
