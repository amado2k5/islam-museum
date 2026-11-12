# Gap register (Grand Tour mission)

What this run could not honestly finish, each with its specific reason. An entry here is a finding, not an apology:
the brief asks that a stop that cannot be finished be replaced or listed, and that a record that cannot be connected
be shown, never papered over.

## 1. A Tour stop that could not be finished

| Record | What was wanted | Why it could not be done | What was done instead |
|---|---|---|---|
| `period/contemporary-era` | A 150-250 word narrative of the era since 1979, as the Tour's last dated stop | The record cites two books, Hodgson (1974) and Hourani (1991), once each, without a page, as "see also". Neither text is on this machine. Its own prose holds no cited fact about the era. A book of 1974 cannot describe an era that begins in 1979. | Removed from the Tour (42 stops became 41, before the second removal below). The Tour's coverage does not depend on it: the Today wing is reached through Al-Azhar and the 14th century through Malcolm X. Its prose is untouched. |

| `work/quran` | A 150-250 word narrative for the museum's record of the Qur'an | The record cites one source: the Tanzil text itself. A writer reached 150 words by adding statements about how the museum stores the text and citing them to Tanzil. A fresh-context verifier showed that four of the nine sentences said things that source cannot attest, and that one ("the museum does not type the text of the verses on its pages") is false: verse wording is typed in the body of three other records. What the source can attest is the count of suras and verses and its own notice, which is not a narrative. Nothing about revelation, compilation or transmission can be written until the record cites a source for it. | The rewritten lead was reverted to the baseline and the stop removed from the Tour (41 stops became 40). The Words wing is still reached through the Ihya'. The record that most needs a finished narrative is the one this run could not give one. |

## 2. Cornerstones that are still dead ends

Twenty-nine cornerstones were dead ends at the baseline. Each was read against its own cited text and a relation was added only where that text states it. A fresh-context verifier then re-read every added relation and 17 were taken out again because the record did not say as much as the relation did. Twelve cornerstones remain dead ends. The counts are the oracle's (`scripts/fable/o04_reachability.py`).

| Record | Neighbours now | Why it could not be opened |
|---|---|---|
| `object/ardabil-carpet` | 0 | Its prose is two sentences cited to a database entry. It says the carpet is "from Ardabil", not where it was woven, so `made_in` would say more than the record does. Its maker and the two museums that hold the pair have no records under any spelling tried. |
| `concept/al-hadith-al-nabawi` | 0 | The two relations first added rested on sentences with no citation of their own; one was cited to the two Sahihs for a term (the Six Books) that is later than both. Removed after verification. Two older `related_to` links exist and are not counted. |
| `period/abbasid-fragmentation` | 0 | Its text names two events, but only as the edges of the period, in an uncited date note. "Marks the boundary of" is not "is part of". |
| `period/buyid-seljuk-fatimid-era` | 0 | The same: boundary events and ruling houses named in an uncited summary. |
| `period/contemporary-era` | 0 | One sentence; it names no record. |
| `period/gunpowder-empires` | 0 | It names three polities and three buildings, and no registered predicate links a period to either (proposal P-8). |
| `period/modern-era` | 0 | Its text names the abolition of the caliphate as its starting boundary, in an uncited note. |
| `concept/sharia` | 1 | About fourteen words of prose, cited to a database entry. One relation stands (worship as part of it); "schools differ within it" does not make the schools part of it. |
| `practice/eid-al-fitr` | 1 | The link to the fast of Ramadan rested on an uncited summary, and the verse it was tied to is one school's evidence for a ruling on the Eid prayer, not a basis of the festival. No predicate links one practice to another (proposal P-8). |
| `polity/delhi-sultanate` | 1 | Its text is two dates and the capital. |
| `polity/seljuk-empire` | 1 | Its text is two dates and a capital; the sentence about its Kirman branch is uncited and no predicate says "branch of". |
| `polity/timurid-empire` | 1 | Its text is two dates and names no record. |

What these twelve have in common is not the graph but the records: each is a cornerstone whose own text is a few lines. They cannot be connected honestly until they are written.

## 3. Published records beyond three hops of a cornerstone

Statement 4 asks that every published record sit within three relation-hops of a cornerstone. It does not. The run did not close this gap with weak relations and did not try to: the oracle prints the whole distribution and the uncovered population. What the measure shows:

- Most of the uncovered records are bibliographic source records. A source attaches to the records that cite it through their `sources:` list, which is a citation, not a relation, and is not counted as a hop.
- Most of the rest have no relation of any kind in the graph.

Closing it honestly means reading each record for relations its own sources support, which is the museum's ordinary enrichment work at the scale of thousands of records. This run did that for the 29 dead-end cornerstones only.

## 4. Things the brief's own boundaries left undone

| Gap | The boundary that caused it |
|---|---|
| The Urdu leads of the 40 Tour records lag the Arabic and English | "Never touch /ur/" (proposal P-9) |
| Canon-first search is not implemented | "Existing pages are not reworked" (proposal P-5) |
| The Tour is not listed in the API catalogue, `llms.txt` or the Explore menu | "One new section plus its single entry link" (proposal P-6) |
| No removal was made, though for most of the 84 contradictions that stand a removal is the only honest fix | Removals are the founder's decision (proposal P-7) |

## 5. Things this machine could not do

| Gap | Why |
|---|---|
| No full site build, so no search index of this branch | A full build needs about 19 GB; the disk had 11 to 12 GB free. Rendered-page checks ran on a scoped production build of the homepage, the wing landings and the Tour (`scripts/fable/scoped-build.sh`). |
| The canon's fame-ranked selection was not re-run | Wikidata's query service was rate-limited to one request a minute during an outage on launch day, and the selection's input cache is kept out of git by the script's own rule (proposal P-3). |
| Citations carried from a record were not always re-read on the page | Several records cite an edition that is not on this machine. Each evidence file in `prose-evidence/` marks every sentence carried without re-reading. |

## 6. Small things

- `object/kiswa` carries no provenance note for its deepened lead: object records have no provenance map. The evidence file is the record of what was done.
- `event/conquest-of-mecca` had no lead section in Arabic or English; a `## موجز` / `## Summary` heading was added so the opening paragraphs are a lead. The Urdu file still opens without a heading.
