# Hudhud: what remains before it is a whole game of many hours

_26 November 2026. The founder asked, in chat: "what is remaining for this game to be fully completed with all its scenarios, game play, stories, features, graphics, with a gameplay for visitor that would last hours?" This page is the answer, kept current. The plan it measures against is [his instruction](owner-instruction-2026-11-26.md); the estimate is in [the design](design.md#how-big-this-is-said-plainly)._

## Where it stands, in one table

| | Asked for | Exists today |
|---|---|---|
| Playing time | 20 to 30 hours on the main path, 40 to 60 for mastery | one scene of a few minutes |
| Quests | 50 | 1 playable; the other 49 named in the Atlas and marked "Not built yet" |
| Worlds | 10, each with its own thread and a part of the hub it restores | 10 named; none has a thread |
| Systems of play | 12 | 3 in the game (flight, the beam, talk); the rules of a 4th (a chain of parts) built and tested, in no quest |
| Hub | a drawn place that visibly restores | a page of words: worlds, pages, how many are home |
| Prologue | 15 to 30 minutes that teach by doing | none |
| Art | a look the founder accepts; cast, places, effects for 50 subjects | a code-drawn trial, not accepted, and by the author's own judgment below the founder's pictures |
| Animation | expressive key poses for every figure | bob, blink, flap, an arm, a tail |
| Sound | effects, ambience, the museum's music | all three, the effects synthesised; one room's worth |
| Languages | seven, read by native speakers | seven, machine drafts read by nobody |
| History | every claim reviewed by a named person | every claim entered as pending; no reviewer named |
| Saving | slots, versions, recovery, a place kept inside a quest; for every game a vault in IndexedDB with backups, export and import | the first four, in `localStorage`; the vault's core is built and tested ([`../save-service.md`](../save-service.md)) and no game uses it yet |
| Unsupported devices | a plain refusal before anything heavy loads, for every game | built; Hudhud stands behind it, the other three do not yet ([`../device-preflight.md`](../device-preflight.md)) |
| Accessibility | keyboard, gamepad, remapping of both, reduced motion, contrast, a way to play without the picture | all built; no physical controller tried; none audited by a person or a tool |
| Machines and browsers | two reference machines, the main browsers, phones and tablets | one Mac, Chrome |
| People playing | children of three age bands, parents, Arabic and Urdu readers | nobody |
| On the museum's site | a Play page, a menu entry, a page for the game | a written proposal |
| Released | UAT, then production | UAT since 26 November 2026; not production |

## What must be built, in the order it unblocks the rest

**1. A decision on the look (the founder's).** Everything drawn waits on it. If the trial is not accepted, the routes are an illustrator and animator, the process that made the 80 thumbnails, or a blend with code for light and effects ([art bible](art-bible.md#how-the-art-can-actually-be-made)). Until then the agent builds rules, words and features with replaceable trial art, and draws nothing in number.

**2. The other nine systems of play.** Mechanism beyond the chain (gears, floats, valves), Path, Route, Trace and Align, Observe and Match, Cipher, Mend and Build, Network, Rhythm. Each needs: tested rules, a generator of challenge rooms from seeds, a Story form, a form in words. About one to two working sessions each for the rules; the room, art and words of its first quest are on top.

**3. The frame the quests hang in.**
- A prologue: the storm, meeting Hudhud, the first flight, the first page.
- The hub as a place: the Atlas's hall, with ten wings that fill as pages return and characters who visit.
- A world map and, for each world, a thread that ties its five quests and something that changes when they are done.
- An ending, and the post-game: the last page, the player's own.

**4. Forty-nine quests.** For each: read the museum's records; write the claims into the review ledger; design the room and the puzzle on one or two of the systems; write the three layers of words (essential lines, "ask more", the museum's note) in Arabic first and then six more languages; three goals and a secret; draw it; test it; capture it. Fifteen to twenty-five minutes of play each.

**5. The long game.** Mastery goals a quest; hidden things of five kinds; time trials and precision routes; daily and weekly challenge rooms from seeds with an archive that never expires; postcards made on the device; New Journey+; side stories for characters.

**6. Features not yet built.** Gamepad remapping; a simple-language option and reading help; a real phone layout; loading a world at a time; atlases and a 2048 limit on textures; a recording as well as stills.

**7. Evidence that it works for people and machines.** Both reference machines; Firefox, Safari, Edge, iOS and Android; a 60-minute profile and a four-hour soak; a screen-reader pass and an accessibility scan; tests with children aged 6 to 9, 10 to 13 and 14 to 17, with parents, and with Arabic and Urdu readers, under the museum's consent process; fixes; a second round.

**8. The museum's side.** The Play page, the game's own page and the menu entry ([plan](website-plan.md)); a UAT release with rollback rehearsed; then production, at the founder's word.

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
