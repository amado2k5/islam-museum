# The Grand Tour: what one prompt built, and what it found

islam.museum is a free, Arabic-first digital museum of Islamic history, carried by one founder. Its doctrine is that the knowledge graph is the foundation and the website is only its display. On launch morning, 11 November 2026, the display was thin: the live site said 53,990 entries, 108,000 pages and 300 pathways, and a visitor met them through a front end that did not know which of them mattered most.

One prompt asked for a door. This is the account of what was built, what was measured, and what went wrong on the way. Nothing here is live: the work is seven stacked pull requests waiting for the founder, who alone merges and deploys. Every number below is copied from `NUMBERS.md`, which a script writes from the captured output of the checks.

## The door, as a visitor meets it

On the Arabic and English homepages there is one new button under the day's cards: **Enter the Grand Tour: fourteen centuries in 40 stops**.

It opens on **the River of Time**. Fourteen Hijri centuries run as one band across the screen, right to left in Arabic and left to right in English. The band is widest in the first century, because that is where the museum's cornerstones are densest, and it thins as the centuries go on. Stops sit on the river in order, each with its number, its name and its date: the Kaaba, the first revelation, Khadija, the Hijra, Badr, and on through Baghdad, al-Bukhari, Cairo, Ibn Sina, the fall of Baghdad, Ibn Khaldun, Constantinople, the Taj Mahal, to Malcolm X and the Kiswa that is still woven every year. The visitor drags the river, or moves a slider, or presses "later". With JavaScript switched off the river is not there at all; the same forty stops are a plain numbered list under century headings, and every link works.

Each stop is **a room**. A banner carries the name in both scripts, the wing it belongs to and its date. Under it a ribbon of fifteen small cells, one for the time before the Hijra and one for each century, fills up to where the visitor stands. Then the narrative: 150 to 250 words, in Arabic and in English, with a numbered citation on every sentence and the sources listed beneath. Then one boxed line that says why the stop matters, in counts taken from the graph: how many relations reach this record, how many records are linked to it, how many of the museum's pathways pass through it. Then the doors: the next stop, the previous one, and up to four of the record's own strongest relations as side doors into the rest of the museum.

The fortieth room opens onto **the completion room**. It says: you have walked the spine of the museum, and 5,871 records hang directly off this path. The route is drawn as forty numbered circles joined by a gold line across nine lanes, one lane for each wing, with a thin arc wherever the graph holds a relation between two stops. Below it are nine doors, one into each wing, and one into the full graph explorer.

Nothing in a room is written for the Tour. The narrative is the opening section of the record itself; the counts are counted when the page is built; the doors are the record's own relations. The Tour's whole definition is a list of forty record ids.

## Before and after

"Before" is main at the moment the run began. The search row is the exception: it measures the live site.

| | Before | After |
|---|---|---|
| Cornerstones that appeared in no wing | 48 | 0 |
| Wings with no cornerstone | Today, Made | none |
| Twelve cornerstones looked for on the wing page that should list them | 3 listed (the live site) | 12 listed (this branch's built pages) |
| Hijri centuries with no cornerstone | the 12th | none |
| Tour stops | no Tour | 40, across nine wings and fourteen centuries |
| Tour narratives of 150 to 250 words (the forty stops, Arabic and English) | 1 of 80 | 80 of 80 |
| Tour narratives with a sentence that had no citation | 50 | 0 |
| Dead-end cornerstones (no neighbour in the graph, or one) | 29 | 12 |
| **Cross-record contradictions found** | never swept | **130** |
| ... fixed from sources the records already cited | | **38** |
| ... standing in a register with their evidence | | **84** |
| ... read and found consistent | | **8** |
| Subjects the canon's own register called missing | 31 | 6 absent, 1 a stub, **24 found under another name** |
| Search on the live site: fixed queries that return the canon record first | 2 of 50 | not changed by this run, and not measurable on this branch |
| Visible defects listed by reviewers of the screenshots | never reviewed | 135 listed: 23 fixed and confirmed gone, 112 standing with a reason |
| Published records within three hops of a cornerstone | 7,081 of 18,699 | 7,114 of 18,699 |

Two rows barely moved or did not move at all, and the board says so: search, and three-hop reach. They are explained below.

## The sweep behind the door

The Tour is the door. The contradiction sweep is the proof that something stands behind it.

Four detectors compared records with each other: a person who takes part in an event after his death or before his birth; an event placed in the reign of a ruler already dead or not yet born; a child older than a parent; a one-way relation written in both directions; a page that gives a death year different from the person's own record. They raised 122 findings. An adjudicator read every one against the records and their cited sources. Later, taught to read dates written only in the Hijri calendar, the detectors raised 8 more.

Some of what they found:

- One unsourced death year on a Cairo caliph, 1341 where his own cited page says 763 AH, had put 25 events of his caliphate after his death.
- A fourteenth-century scholar was recorded as the student of a man who died 37 years before he was born. The teacher was the man's grandson, who has a record of his own.
- A father was recorded as the child of his own son.
- One record turned out to be two caliphs: the name and dates of one, the reign and events of another who has no record at all.

Thirty-eight were corrected, each from a source the record already cited. Eighty-four stand in the register, most because the only honest fix is to remove a date that an earlier enrichment pass wrote without a source, and removing is the founder's decision. Nothing was deleted.

## What the run's own verifiers caught

Every piece of delegated work was handed, when it came back, to an agent with a fresh context and one instruction: prove it wrong. This is what they proved.

**In the narratives.** Three verifiers read all 730 sentences of the 41 new leads against the records and the cited pages. They found 5 errors, 56 weaker problems and 10 places where the Arabic and the English disagreed.
- Two phrases in the Kaaba's lead reproduced the wording of Qur'an verses, which the museum never types. One of them had been added by the rewrite.
- A sentence about al-Ghazali called him the ablest debater of his time, in the museum's own voice. It was a biographer's praise, lifted without his name.
- The lead written for the Qur'an's own record said "the museum does not type the text of the verses on its pages". Three other records do.
- Al-Bukhari's age at death was given as sixty-two years less thirteen nights. The cited page, read enlarged, says twelve.
- The pledge to Abu Bakr was told in the museum's voice, without the half of the same page that names those who held back.

Fifty-seven findings were fixed, always by removing, softening or naming the source, never by adding a fact. Ten stand with their reasons.

**In the graph.** Two agents added 82 relations to dead-end cornerstones. A verifier re-read every one: 65 are stated by the record; 16 said more than the sentence behind them; 1 had no support. All 17 were removed. That is why the dead ends went from 29 to 12 and not to 7, which is what was first reported in a pull request.

**In the fixes.** A verifier attacked the 44 corrections the sweep first claimed. Two were wrong and three rested on nothing the record itself cited. All five were reverted. A sixth was only quiet: the detector had stopped firing because the event it concerns is misdated in its own record. It is registered as hidden, not fixed. The first count, 44 fixed, went out in a pull request title before this check; the count is 38.

**In the list of what is missing.** The canon's register named 31 subjects with no record. A verifier with one job, to find them, found 24: Timur under a label written only in Arabic, the Battle of Tours under its Arabic name, seven of them in the same file's own canon list under a different slug.

**In the pages.** A byte-for-byte comparison of the homepage and the nine wing landings, built with the old templates and the new over the same data, caught two things a reader would not: the homepage link had left one stray space in the Urdu homepage, which the brief said not to touch; and the Tour's script, sent through the site's bundler, had renamed script files that other pages load, which on a full deploy can mean re-uploading every page. Both were fixed, and the comparison now passes.

<!-- VISION:BEGIN -->
**In the screenshots.** Ninety screenshots were committed: the Tour's pages, the homepage and the nine wing landings, in Arabic and English, at phone, tablet and desktop widths. Reviewers who had never seen the pages' source were told to list every visible defect, three times over.

- *First round, three reviewers:* 121 defects, 9 of them major. Three of the majors were not on the page at all: the site paints its footer lazily and a full-page screenshot never scrolls, so the pictures showed blank blocks. The capture was corrected. One major was real: the drawing of the route was cut off at the edge of its box on small screens.
- *Second round, a fourth reviewer, after the pages were revised and every screenshot re-taken:* each of the 50 defects on the Tour and its button was looked for again. 22 were gone, 13 were still there, 15 had changed. Two of those results were this run's own failures. A fade at the river's edge, reported as fixed, was being drawn underneath the cards it was meant to soften. And the arrows on the Tour's button and on the nine wing doors pointed backwards in Arabic. The cause of that one is in the site itself: its rule for mirroring arrows is a kind of rule browsers do not apply to text in a line, so arrows written that way have never mirrored on any Arabic page. The Tour's own arrows were fixed; the site's are reported to the founder with the one-line cause.
- *Third look, a fifth reviewer, after those fixes:* of six rows called fixed, 2 were gone, 3 were better but not gone, and 1 stood. It also found that the new fade dims a number that happens to sit under it. That is registered, not hidden.

The register ends at 135 defects. 23 are called fixed, and every one of them was confirmed gone by a later reviewer who had not seen the fix being made; the check refuses the word otherwise. 112 stand, each with its reason: 77 are on the site's older pages and its shared footer, which the brief put out of bounds; 26 are on the Tour's own pages, partly fixed or cosmetic; 5 come from the text of records; 4 are limits of the screenshots themselves.
<!-- VISION:END -->

**In the run's own tooling.** Four mistakes were mine and no verifier's.
- The first build used for the no-JavaScript check carried no stylesheet at all, so "the river is a list, not a band" passed for the wrong reason. The build script now fails if the pages are unstyled, and the check has a control: with JavaScript on, the same list must be a band.
- The script that re-tests the work on top of the newest main skipped one preparation step, so the homepage did not build there and a check failed for a reason that had nothing to do with the merge. The script was corrected, now reports the build's own result, and the run was repeated.
- A shell loop left a commit's file list empty, and 25 records were committed one commit late.
- The diary's timestamps were typed from memory and ran hours ahead of the clock. They were replaced with the commit times.

## What could not be made green

**Search.** On the live site a search for Mecca returns an event of 571 AH first, and a search for Muhammad returns the record of a tafsir edition. Of 50 fixed queries, 2 return the canon record first. The fix is small, but it sits in an existing page template, and the brief limited this run to one new section and one link. It also could not be tested: a search index needs every page built, a full build needs about 19 GB, and the machine had 12 free. The test ships; the fix is a proposal.

**Three-hop reach.** Statement 4 asks that every published record sit within three relations of a cornerstone. 7,114 of 18,699 do. Most of the rest are bibliographic source records, which attach to the museum by citation and not by relation; most of what remains has no relation of any kind. The run could have closed this number with weak relations and did not.

**Twelve dead-end cornerstones.** Each is a cornerstone whose own text is a few lines: a record of the sharia with about fourteen words, three polities that are two dates each. They cannot be connected honestly until they are written.

**Two stops that left the Tour.** The contemporary era cites two books, neither on hand, one published before the era begins. And the Qur'an's own record: see the last section.

## The shape of the run

<!-- SHAPE:BEGIN -->
One session, begun at 08:11 on 11 November 2026 and ended a little after midday: about four and a half hours. The session that held the brief wrote the Tour's pages, every check and this ledger itself, and decided what to do about each finding. It delegated the reading.

| Role | Agents | What each did |
|---|---|---|
| Prose writers | 7 | Six records each: finish the opening in Arabic and English from the record's own sources, and write down, sentence by sentence, where each fact was read |
| Graph editors | 2 | Read the 29 dead-end cornerstones for relations their own text states |
| Adjudicators | 4 | Read about thirty contradiction findings each against the records and their sources |
| Fixers | 3 | Act on a verifier's report: remove, soften, or name the source |
| Fresh-context verifiers | 12 | Told to disprove: three on the narratives, one on the relations, one on the corrections, one on the list of what is missing, one on the numbers, five on the screenshots |

28 subagents in all: 16 built and 12 tried to break what was built. By the harness's own report they used 10,926,036 tokens and 2,662 tool calls; 42% of those tokens went to disproof. The orchestrating session's own use is not in these figures and could not be read from inside the session.

Each kind of builder ran side by side, the writers seven at once. Nothing a builder returned was accepted until a verifier with no part in it had read it, and every verifier's report changed something: the count of corrections, the count of dead ends, the number of stops, two "before" figures, the direction of an arrow.
<!-- SHAPE:END -->

## The single most surprising thing

The museum's record of the Qur'an could not be given a narrative.

It is the record a visitor would expect to be the fullest in the building. It cites one source: the text itself. A writer asked to finish its opening in 150 words reached the length by describing how the museum stores the text and citing those sentences to the text. The verifier that read it showed that four of its nine sentences said things that source cannot attest, and that one was false. What the source can attest is a count of suras and verses and its own notice, and that is not a narrative. So the rewrite was reverted, and the Qur'an has no room on the Grand Tour.

That is the charter at work, not against it. The museum's rule is that nothing is written without a source that says it. Held to that rule on its most important record, the honest result was an empty room, and the first thing the founder now knows to give that record is a second source.

The same pattern was visible from the outside before the run began. On the live site today the hall of Living Islam does not list the prayer, the pilgrimage, the fast or zakat, and the hall of Words does not list the Qur'an's record, the Muwatta or Sahih al-Bukhari. Forty-eight of the museum's 270 cornerstones sat in no hall at all. They do now: on this branch's built pages the same twelve that were looked for on the live site are all listed, where the live site lists three.

## Where to check all of this

`VERIFICATION.md` is the board: each statement, the committed check that proves it, the command, the captured output, and a section titled "Where I may be wrong". `CONTRADICTIONS.md` is the register, entry by entry. `GAP-REGISTER.md` is what was not finished and why. `NOTICED.md` is about 150 further problems the run's readers saw outside their task and did not touch. `PROPOSALS.md` is what the founder is asked to decide.
