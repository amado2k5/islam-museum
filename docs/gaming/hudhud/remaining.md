# Hudhud: what remains before it is a whole game of many hours

_26 November 2026, brought up to date later that day (the third to eighth trial quests, and what is public). The founder asked, in chat: "what is remaining for this game to be fully completed with all its scenarios, game play, stories, features, graphics, with a gameplay for visitor that would last hours?" This page is the answer, kept current. The plan it measures against is [his instruction](owner-instruction-2026-11-26.md); the estimate is in [the design](design.md#how-big-this-is-said-plainly)._

## Where it stands, in one table

| | Asked for | Exists today |
|---|---|---|
| Playing time | 20 to 30 hours on the main path, 40 to 60 for mastery | one scene of a few minutes, and seven short trial quests (no person has timed any of them) |
| Quests | 50 | 8 playable (the flying scene and seven short trial quests: the elephant clock, the secret page, the locked box, the scattered sheets, the animal cards, the paper of Samarkand and Ibn Battuta's thread); the other 42 named in the Atlas and marked "Not built yet" |
| Worlds | 10, each with its own thread and a part of the hub it restores | 10 named; none has a thread |
| Systems of play | 12 | 3 in the flying scene (flight, the beam, talk); a 4th (a chain of parts) in the elephant clock trial quest and a 5th (a cipher: counting, ranking and comparing signs) in the al-Kindi trial quest; a rule set outside the twelve (equation moves: restore, balance and share) in the al-Khwarizmi trial quest, a second (exchanging sheets of a grid until their edges meet, proved to have one answer) in the al-Idrisi trial quest, a third (sorting cards into groups until each is in the group a passage gives it, with every card's one right group proved by test) in the al-Jahiz trial quest, and a fourth (following a route: threading the stops of a stage of a journey in the order a record gives them, with the road written again in the test and a ring of beads proved not to be in the road's order) in the Ibn Battuta trial quest; the paper-of-Samarkand trial quest is a second use of the chain rules (a row of steps), now shared with the elephant clock in one module, and not a new system; the last seven are played with page controls |
| Hub | a drawn place that visibly restores | a page: worlds, pages, how many are home, and one code-drawn picture of the open Atlas with a medallion for each world (a trial picture, plain signs, and a way to go to a world's list); not a place the bird can fly about in |
| Prologue | 15 to 30 minutes that teach by doing | an opening story of five still panels (a code-drawn picture and a short paragraph each, in seven languages, skippable, shown once for a slot and readable again from the Atlas); no play in it, no animation, no voice, and no child has seen it |
| Art | a look the founder accepts; cast, places, effects for 50 subjects | a code-drawn trial, not accepted, and by the author's own judgment below the founder's pictures |
| Animation | expressive key poses for every figure | bob, blink, flap, an arm, a tail |
| Sound | effects, ambience, the museum's music | all three, the effects synthesised; one room's worth |
| Languages | seven, read by native speakers | seven, machine drafts read by nobody |
| History | every claim reviewed by a named person | every claim entered as pending; no reviewer named |
| Saving | slots, versions, recovery, a place kept inside a quest; for every game a vault in IndexedDB with backups, export and import | all of these for Hudhud ([`../save-service.md`](../save-service.md)); the other three games still save to `localStorage`, now backed up to the vault and restored if it goes missing, without indicator, export or import |
| Unsupported devices | a plain refusal before anything heavy loads, for every game | built; all four games stand behind it ([`../device-preflight.md`](../device-preflight.md)) |
| Accessibility | keyboard, gamepad, remapping of both, reduced motion, contrast, a way to play without the picture | all built; no physical controller tried; none audited by a person; a machine scan of the UAT release (Chrome, English and Arabic, 26 November 2026) measured contrast and target sizes and is not a conformance check ([evidence](../evidence/hudhud/browser-a11y-soak/README.md)) |
| Machines and browsers | two reference machines, the main browsers, phones and tablets | one Mac, Chrome |
| People playing | children of three age bands, parents, Arabic and Urdu readers | nobody |
| On the museum's site | a Play page, a menu entry, a page for the game | a written proposal |
| Released | UAT, then production | UAT since 26 November 2026, and public in production at `games.islam.museum` since 26 November 2026, from an earlier build (commit `885c7d97a5a`, read on 26 November 2026 when the paper of Samarkand was written: the flying scene, the elephant clock, the opening story, the secret page and the locked box, with an Atlas note that says four quests are built; not the scattered sheets, the animal cards, the paper of Samarkand or Ibn Battuta's thread) |

## What must be built, in the order it unblocks the rest

**1. A decision on the look (the founder's).** Everything drawn waits on it. If the trial is not accepted, the routes are an illustrator and animator, the process that made the 80 thumbnails, or a blend with code for light and effects ([art bible](art-bible.md#how-the-art-can-actually-be-made)). Until then the agent builds rules, words and features with replaceable trial art, and draws nothing in number.

**2. The other systems of play.** Of the twelve, three are built in the flying scene, and two more (Mechanism, Cipher) have rules, Mechanism with two trial quests (the elephant clock and the paper of Samarkand) and Cipher with one; a rule set for equations was also built, outside the twelve. Still to build: Mechanism beyond the chain (gears, floats, valves), Cipher beyond one quest (neighbouring letters, pointing at the picture), Path (the design gave it to al-Khwarizmi, whose trial quest uses the equation rules instead), Route (the quest of Ibn Battuta's thread is a smaller idea, not this), Trace and Align, Observe and Match, Mend and Build, Network, Rhythm. Each needs: tested rules, a generator of challenge rooms from seeds, a Story form, a form in words. About one to two working sessions each for the rules; the room, art and words of its first quest are on top.

**3. The frame the quests hang in.**
- A playable prologue: the storm, meeting Hudhud, the first flight, the first page. (Built so far: the five still panels of the opening story, which tell the storm and the meeting. Still missing: anything to play in it, animation, voice, and a reading by a child.)
- The hub as a place: the Atlas's hall, with ten wings that fill as pages return and characters who visit. (Built so far: the Atlas page, with one code-drawn picture of the open book whose medallions show how many pages of each world are home and lead to its list. Still missing: a hub the bird can fly about in, wings that change as pages return, and visiting characters.)
- A world map and, for each world, a thread that ties its five quests and something that changes when they are done.
- An ending, and the post-game: the last page, the player's own.

**4. Forty-two quests** (eight of the fifty exist as first trials, counting the flying scene, and each of those still wants everything below). For each: read the museum's records; write the claims into the review ledger; design the room and the puzzle on one or two of the systems; write the three layers of words (essential lines, "ask more", the museum's note) in Arabic first and then six more languages; three goals and a secret; draw it; test it; capture it. Fifteen to twenty-five minutes of play each.

**5. The long game.** Mastery goals a quest; hidden things of five kinds; time trials and precision routes; daily and weekly challenge rooms from seeds with an archive that never expires; postcards made on the device; New Journey+; side stories for characters.

**6. Features not yet built.** A simple-language option and reading help; a real phone layout; loading a world at a time; texture atlases (the 2048-pixel limit itself is held since 26 November 2026, defect D15 in the [test plan](test-plan.md), and keyboard and gamepad remapping are built); a recording as well as stills.

**7. Evidence that it works for people and machines.** Both reference machines; Firefox, Safari, Edge, iOS and Android; a 60-minute profile and a four-hour soak (a ten-minute soak of UAT was made on 26 November 2026, see the evidence above); a screen-reader pass and a conformance-level accessibility audit (the machine scan above is not one); tests with children aged 6 to 9, 10 to 13 and 14 to 17, with parents, and with Arabic and Urdu readers, under the museum's consent process; fixes; a second round.

**8. The museum's side.** The Play page, the game's own page and the menu entry ([plan](website-plan.md)); a UAT release with rollback rehearsed (UAT and production both exist for the games now, and no rollback has been rehearsed with Hudhud in them); then the museum's own pages, which still do not mention the games, at the founder's word.

## What only people can do

| | Who |
|---|---|
| Accept a look; choose and pay for an art route | the founder |
| Draw and animate the cast and the places in that look | an illustrator and an animator, or the process behind the thumbnails |
| Review the history of fifty subjects | named reviewers: science and medicine, architecture and dress, geography, literature |
| Read seven languages as a child would | native readers |
| Play it | children, parents, teachers |
| Run it on the two reference machines | whoever has them |
| Release it | the founder |

## How long

An agent can write the rules, the words and the features at roughly a system or a quest's rules in a session; that part is perhaps 110 to 170 sessions. It is the smaller part. With art at about a world a month, review keeping pace and playtests between worlds, **about a year from an accepted look**. With no accepted look, there is no date. These are estimates from one scene and have no playtest behind them.
