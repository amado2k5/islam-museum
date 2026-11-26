# G-0014: Hudhud's story and content are typed data in the repository, joined to museum records by id

_26 November 2026. Status: accepted for Hudhud's first scene; to be confirmed against the vertical slice._

## Question

Fifty quests need conversation, things to touch, puzzles, goals and museum notes in seven languages, written by an agent, reviewed by people, and never generated while the game runs. What form do they take, so that a line cannot exist in one language and not another, a fact cannot appear without its record, and a reviewer can read what a child will read?

## Decision

1. **Four kinds of file, each with one job.**

   | File | Holds | Never holds |
   |---|---|---|
   | `src/content/atlas.v1.json` | the 80 source pictures, the 50 subjects, the ten worlds, each subject's museum record ids and its label (history, literature) | prose, claims |
   | `src/content/<quest>.ts` | one quest as typed data: the room, the puzzle, the things that can be touched, the scripts, the records its note links to | text a player reads |
   | `i18n/<lang>.json` | every word a player reads, the same keys in the same order in all seven languages | logic |
   | `docs/gaming/historical-review/ledger.json` | every statement of history a quest makes, its source, what is uncertain, and a reviewer's decision | — |

2. **A script is a small graph** (`narrative/dialogue.ts`): nodes of at most three lines, each line a speaker, a string key and a mood; choices that lead to other nodes, marked `deeper` when they are an optional "ask more"; flags a node sets. `faults()` finds a missing node or string, an unreachable node, a node with more than three lines, and a node whose every way on is optional; a test runs it against all seven string tables.

3. **Three layers of saying, as the instruction asks.** Essential lines are a node's lines. "Ask more" is a `deeper` choice and sets a flag that only ever feeds the Curiosity goal. The museum note is not a script at all: it is shown after the quest, links to the records, says what is uncertain and carries the mark "Historical review pending".

4. **History does not branch.** A choice may set a flag, open a line or change a goal. It cannot reach the puzzle or the quest's outcome: `sim/scene.ts` gives a conversation no way to change them, and a test plays the same quest with and without questions and compares.

5. **A spoken line is invention and is never dressed as a quotation.** The page says that every word spoken is invented for play. A test refuses quotation marks in any `d_`, `c_` or `note_` string in any language, so that no invented sentence can be presented as something a person of history said.

6. **A fact enters only through a record id.** A quest lists the museum records its note links to; the traceability table lists each subject's records; a test checks that every id is a file under `data/`. A record is existing source material, not a reviewed fact (the founder's rule of 26 November 2026): each claim a quest makes goes into the ledger as pending, and the game says so on its page.

7. **No authoring tool at run time, and none required to write.** Scripts are TypeScript so that the compiler checks speakers and keys; if writers who are not programmers join, the same shape can be read from JSON or YAML with no change to the runner. Tiled maps may be used as authored input later ([the instruction](../hudhud/owner-instruction-2026-11-26.md), section 7); none is used yet.

## Not decided

- **How fifty quests' strings are split.** One table of 163 strings is 10 KB a language. Fifty quests at that density is about 0.5 MB a language; the tables will be split by world and loaded with the world. The string check reads folders, so this costs a line in `package.json` per world.
- **Simple-language and reading-assistance variants** (instruction, section 9): the key scheme will carry them (`d_x` and `d_x__simple`); none is written.
- **Who reviews.** No reviewer is named for any game ([the ledger](../historical-review/ledger.md)). Until one is, every entry stays pending and the game says so.
- **Translation.** The six translations of the first scene were drafted by a second AI model from the English and are marked as machine translation not read by a native speaker. The repository's rule is Arabic first and the pivot of `docs/language.md` (Turkish and Indonesian from Arabic); for this scene the English was written first and all six came from it. That is a departure to put right before the slice: write the Arabic as the original and re-derive Turkish and Indonesian from it.
