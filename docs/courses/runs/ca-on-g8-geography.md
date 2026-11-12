# Run log ca-on-g8-geography

Course: Ontario Ministry of Education, "GEO - Grade 8" (archive slug `ontario-geo-g8`). Agent: Claude Code, claude-sonnet-5-5, fleet run.
Start 2026-11-12T05:57Z. End 2026-11-12T06:12Z.

## Steps
- 05:57Z read the runbook and the fleet prompt; fetched the course (`fetch_ontario.py "GEO - Grade 8" ontario-geo-g8`): 2 strands, 6 overall, 35 specific expectations. Source: `ontario_source.py` printed `source/ontario-curriculum-sshg-2023`.
- 05:58Z to 06:05Z mapping: find_entity searches (three spellings each) for settlement, rivers, water, land use, markets, charity, endowment, hospitals, economy, development, wealth, media, indicators; entity_brief on each candidate.
- 06:05Z to 06:09Z wrote records with a generator script kept in the scratchpad (not in the repository).
- 06:10Z gate, then cite-check.

## Outcome
Ingested. 1 subject, 2 units, 6 lessons, 12 connections, 11 distinct records. 7 specific expectations in lessons, 28 in the gap register, out of 35.

## Lesson plan
| Lesson | Title | Expectations |
|---|---|---|
| a-1 | Why was the city placed there? | A1.1, A3.2 |
| a-2 | How did people change the land? | A3.5 |
| a-3 | Who may use the land? | A3.3 |
| a-4 | When a dam fails | A1.2 |
| b-1 | Who works for others' wellbeing? | B3.5 |
| b-2 | Measuring the river for the farm | B3.8 |

## Links: the sentence "The expectation asks the student to ___; this record shows ___."
- a-1 place/al-fustat (Ibn Abd al-Hakam): asks for how the physical environment influenced where settlements were placed; this record shows a settlement moved because of a river in flood. (al-Maqrizi): asks for patterns of settlement; this record shows the growth and density of the same city.
- a-2 place/al-nil: asks for ways settlement affected the environment; this record shows a dug waterway and revived land. concept/agriculture-in-islam: shows rules for reviving land and sharing water.
- a-3 event/umar-sawad-settlement: asks for a land-use issue and groups' responses; shows the demand to divide conquered land and Umar's answer. invention/karkh-market-relocation-zoning: shows markets moved and arcades reused.
- a-4 event/flood-of-al-aram (+ passage/quran-34-16, cited by that record): asks how environmental processes may affect settlements in future; shows one past case of a dam failure ruining settled life. The museum serves only the past part.
- b-1 practice/zakat, invention/waqf, building/bimaristan-adudi: ask for groups and organisations that work to improve quality of life and their focus; show three historical institutions (not current organisations).
- b-2 building/nilometer-of-rawda: asks for factors contributing to economic development; shows one: measuring the flood to guide irrigation.

## Judgement calls
- A3.6 stays in the gap register: concept/hima is a real record, but it nowhere says the reserve served conservation, so calling it a sustainable practice would be a stretch.
- B1.3 (assess effectiveness) stays in the register: the records describe what institutions did, not how well they worked.
- B3.6 and B3.7 stay in the register: the nearest records (concept/al-iqtisad-fi-al-quran, concept/crafts-in-islam) are ethical treatments, not accounts of economic systems or sectors.
- The zakat connection is placed `before` and typed `story`; the closed kind list has no `practice`.
- Skills expectations (A2.x, B2.x, A3.7, B3.3, B3.4) are in the register with the skills reason.
- Each lesson's Brief says in plain words what the museum offers and what the class must bring.

## More lessons possible
None beyond what is written; remaining expectations lack honest records.

## Runbook problems
- Zsh: `IFS='|' read -ra` fails (bad option -a); I used a small Python wrapper to run find_entity with several spellings. A one-line example of a shell-safe loop in the runbook would help.
- Searching 25 concept groups through find_entity one by one is slow (about a minute each when run serially); parallel runs in a thread pool were fine.

## Proposals
- Connection kinds: no `institution` (waqf, bimaristan), `practice` (zakat) or `event` (flood, market relocation); used `invention`, `story`, `place`, `reflection`, `object` as nearest.
- Pinning a card: a `within` connection cannot name the section it follows.

## Corrections after the fleet review

Source: `docs/courses-mission/verifier/sweep-social-studies.md` (Grade 8 geography). Applied in all three languages. No connection was added.

- a-1 `place/al-fustat`, second card (Maqrizi: seat of the kingdom, building density) (REMOVE): the connection was deleted with its two evidence rows; the lesson keeps the first card (the Nile flood and Amr's move). The lesson summary no longer says "how a settlement grows". A1.1 and A3.2 stay, served by the first card.
- a-2 `concept/agriculture-in-islam` (REMOVE): connection deleted, evidence rows deleted, and the lesson's summary, Brief, section question and Try this now speak of one case (al-Nil). Its Try this asks the student to chart what people did and what they think changed, marking what the record does not say. A3.5 stays, served by al-Nil.
- b-1 `practice/zakat` (REMOVE): connection deleted, evidence rows deleted; summary, Brief and Try this now say two institutions (an endowment and a hospital) and a two-row table. B3.5 stays, served by waqf and the Adudi hospital.
- b-2 `building/nilometer-of-rawda` (FIX, borderline): the card already says "irrigation policy" as the record does (Yeomans) and implies no development, so the card text is unchanged; the lesson summary no longer calls the flood measurement "a factor that can support an economy", and the Brief now says the record does not state that it raised output or the economy and that the link to economic development is the class's inference. A stricter reading (R b) would remove the card and send B3.8 to the gap register; I applied FIX as the reviewer marked it.
- Unchanged by verdict (KEEP): a-1 first Fustat card; a-2 al-Nil; a-3 both cards; a-4 both cards; b-1 waqf and Adudi hospital.
- Verdicts judged wrong and not applied: none.
