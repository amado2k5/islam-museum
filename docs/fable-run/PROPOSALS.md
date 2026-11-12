# Proposals for the founder (Grand Tour mission)

**Status of everything in this file: PROPOSED. Nothing here is recorded in, enacted through or meant to supersede
anything in the decision ledger (`docs/decisions/`). The ledger is the founder's.**

Each entry says what the run did on its own branch, why, how to undo it, and what the founder is asked to decide.
The work is in the pull requests; a "no" to any entry is a revert of the named commit or files.

---

## P-1. A century floor for the canon

- **What the run found.** At the baseline no cornerstone was dated to the 12th Hijri century (1101-1200 AH). The class quotas in `scripts/report/canon.py` rank within each class and do not look at time, so a century can come out empty.
- **What the run did.** Added one rule to the canon script: every Hijri century from the 1st to the 14th holds at least one cornerstone; where a century has none, the canon record anchored in it with the greatest weight inside the museum (inbound relations, prose links, pathway appearances; the Wikipedia count plays no part) is raised from importance 2 to 1. Today that raises one record, `person/ahmed-iii-uthmani`.
- **Why this record.** It is not a judgement that Ahmed III matters more than Aurangzeb or Shah Wali Allah. It is what the rule returns from the graph as it stands: 50 inbound links, most of them `during_reign` edges. If the founder prefers a different 12th-century cornerstone, the honest route is to give that record its links, and the rule will follow.
- **Undo.** Revert the canon-floor commit (script, `docs/canon.md`, one `importance:` line).
- **Asked of the founder.** Keep the floor, drop it, or name the century's cornerstone by hand.

## P-2. Wings for the 48 wingless cornerstones, and three additions

- **What the run found.** 48 of 270 cornerstones had `wings: []` and so appeared on no wing page: all 13 periods, 12 polities, 9 practices (salah, hajj, zakat, sawm, wudu, adhan, dua, umrah, the funeral prayer), 11 works (the Qur'an record, the Muwatta, Sahih al-Bukhari, Sahih Muslim among them) and 3 groups. No canon record at all sat in Today or Made.
- **What the run did.** `scripts/fable/complete_wings.py` gives each wingless cornerstone the wing the plan assigns its class (`docs/plan/01-vision.md` section 5): period and polity to Time, practice to Living, work to Words, group to People. It also adds a wing to three records where the class rule cannot reach: `period/contemporary-era` (Time, Today), `building/al-azhar` (adds Today; the plan names Al-Azhar as a Today example) and `object/kiswa` (adds Made; the record's own prose says it is woven today in Mecca).
- **Where this may be wrong.** The plan describes Made as a directory of present-day businesses. The Kiswa is made today, by Muslims, in a named workshop, so it fits the words of the definition, but it is not a business listing. If the founder reads Made strictly, the Tour has no Made stop and statement 2 is not green for that wing. Polities are sent to Time because 66 of the 74 wing tags on polity records are Time; the plan's People wing also mentions dynasties.
- **Undo.** Revert the two wing commits; the script's report mode lists every line changed.
- **Asked of the founder.** Confirm or correct the five class rules and the three additions.

## P-3. Pin the canon's reach-signal input

- **What the run found.** The canon's ranking reads Wikipedia language-edition counts from a cache that the script keeps out of git. On launch day Wikidata's query service was rate-limited to one request a minute, so the full selection could not be re-run, and nobody without that cache can re-derive the ranking.
- **What the run did.** Nothing to the rule. It added a `--floor-only` mode that needs no network and keeps the existing marks and order.
- **Asked of the founder.** Whether to commit the counts used for a canon run as a dated snapshot beside the script, so the ranking can be re-derived from the repository alone. The counts would still rank and never be written into a record.

## P-4. The review state of the 41 records whose lead was deepened

- **What the run did.** Rewrote the lead section of 41 cornerstone records in Arabic and English. Twenty-eight of them were `status.review: published`, meaning a human had read them. The new leads are AI text that no human has read.
- **What the run chose.** It left each record's review state as it was and added a provenance note (`lead_deepened`) saying the lead is AI text awaiting a human read, following the precedent on `event/battle-of-badr`, where an AI-added section sits in a published record under an `enriched_by` note. It did not flip 28 published cornerstones to draft.
- **Why this is the founder's call.** The ruling of 8 November 2026 says AI output enters as draft and no agent promotes it. Read strictly, a published record that now opens with unread AI text should go back to draft. The run did not make that change because it would un-publish the museum's most-read records on an agent's say-so.
- **Asked of the founder.** Keep the state and the note; or flip the 28 to draft until read; or read the leads (41 short texts, each with a sentence-by-sentence evidence file) and promote them.

## P-5. Canon-first search needs a change the brief does not allow this run to make

- **What the run measured.** On production (the deploy at `8d1b0ef9`) the search page returns the canon record first for 2 of 50 fixed queries. A search for Mecca returns an event of 571 AH; a search for Muhammad returns the record of a tafsir edition.
- **Why it is not fixed.** Nothing in the search path knows the canon exists. Making it know means touching either the entity page template (one invisible attribute on the title of canon records, read by the search indexer) or the search page's query handling. Both are existing pages, and the brief limits this run to one new section and one link. It also cannot be verified here: the search index needs every page built, and a full build does not fit on this machine.
- **The smallest change that would do it.** In `site/src/layouts/EntityLayout.astro`, give the page title of a record with `importance` the indexer's weight attribute (`data-pagefind-weight`), higher for importance 1 than 2, for Arabic and English only so that `/ur/` stays byte-identical. Then run `node scripts/fable/o06_search.mjs <UAT url>`. If the weight alone does not carry every query, the next lever is the search page's ranking options (page-length normalisation), which is a change to that page.
- **Asked of the founder.** Whether to allow that one-attribute change, and to run the search oracle on the UAT build either way: its result on UAT is the true state of statement 6.

## P-6. Registering the Tour where the browser rule asks

- **The standing rule** (6 November 2026) says every browser is exported in the static API, listed in `openapi/v1.json` and `llms.txt`, added to the Explore menu, and entered in `docs/site/browsers.md`, the roadmap, the lanes file and `docs/status.md`.
- **What the run did.** None of it. Each of those is an existing published file or a shared document, and the brief limits the change to one section and one link. The Tour keeps no records of its own (its manifest is a list of ids of existing records), so nothing is missing from the graph or from search; what is missing is the listing.
- **Asked of the founder.** Whether to register the Tour as a browser after reviewing it, and whether its manifest should move from `tour/grand-tour.yaml` into the graph as an `exhibit` record (which would add a page under `/ur/` and change several listing pages).

## P-7. Removals the contradiction sweep proposes

- **What the run found.** Seventy cross-record contradictions stand registered because the cited sources cannot settle them (`docs/fable-run/CONTRADICTIONS.md`). For most, the only correction is to remove something: a date from an earlier enrichment pass that the record's own source does not carry, a relation that attaches a person to an event he did not live to see, a narrator written as a participant.
- **What the run did.** Removed nothing. The founder's standing rule is that every removal is his decision.
- **Asked of the founder.** To rule on the proposed removals in the register (each entry names the field or relation), and on the larger patterns in `docs/fable-run/NOTICED.md`: the enrichment pass whose dates disagree with their own notes, the record that holds two caliphs, and the probable duplicate records.

## P-8. Predicates the graph is missing

- **What the run found.** Seven cornerstones could not be given a second neighbour, and several could be given fewer than their text supports, because no registered predicate says what the text says: a period to the polities and buildings that define it; an object to the building it belongs to (the Kiswa and the Kaaba); a building to its forerunners; a practice to a related practice (Eid al-Fitr and the fast of Ramadan); a polity to the polity it branched from.
- **What the run did.** Added no predicate: `schema/predicates.yaml` is a shared schema and a new predicate is a schema change.
- **Asked of the founder.** Whether to add predicates for these, or to widen the domain and range of `part_of`, so that the remaining dead-end cornerstones can be opened from text they already carry.

## P-9. The Urdu leads

- **What the run did.** Left every file under `content/ur/` untouched, as the brief requires. The Urdu leads of the 40 Tour records are now shorter than, and in places differ from, the Arabic and English.
- **Asked of the founder.** Who translates the new leads into Urdu, and when.

## P-10. A second source for the museum's record of the Qur'an

- **What the run found.** `work/quran` cites one source, the Tanzil text itself. A narrative of 150 to 250 words cannot be written from it without saying things that source does not say; a verifier showed that the attempt did exactly that, and it was reverted to the baseline text. The record is a cornerstone with no room on the Tour.
- **What the run did.** Withdrew the stop and registered the gap (`GAP-REGISTER.md`). Added no source: the brief allows deepening only from sources a record already cites.
- **Asked of the founder.** Which source the record should cite for its own description (a history of the text's collection and transmission the museum already holds, for example), after which the narrative can be written and the stop restored by adding one line to `tour/grand-tour.yaml`.

## P-11. The visible defects on older pages

- **What the run found.** The fresh-context reviewers of the screenshots listed 77 defects on the homepage, the nine wing landings and the shared footer as they were before this run, and five more that come from the text of records (the counts are in `oracle-output/o08-vision.out`). One is on every page: with JavaScript off, the header menu makes the page scroll sideways on a phone (196 px on the Arabic homepage, 290 px on the English).
- **One of them has a one-line cause.** On Arabic pages the site's forward arrows point right, back at their own label. The site mirrors them with `[dir="rtl"] .flip { transform: scaleX(-1) }` in `site/src/styles/global.css`, and a browser does not apply a transform to an inline box, so an arrow written as `<span class="flip">→</span>` in running text has never mirrored (it does inside a flex button, where the span becomes a box). Adding `display: inline-block` to that rule would fix every such arrow on the site. It is a shared stylesheet, so it is a whole-site rewrite and not this run's to make; the Tour's own arrows carry the declaration inline.
- **What the run did.** Fixed nothing on those pages: the brief bars reworking existing pages. Each defect is in `docs/fable-run/vision/defects.json` with the screenshot it was seen in.
- **Asked of the founder.** Whether a lane should take that list.
- **Status on 12 November 2026, after main was merged into `release/uat`.** Main's rebuild of the Place wing map (pull request #6043) answers the seven defects the reviewers listed on that page, two of them major; they have not been looked for again on new screenshots. The rest of the list stands.

## P-12. The release-notes block at merge

- **What the run found.** This branch's entries sit under `v1.17.0` in `CANARY.md`. Main has since used that number for other work and opened a newer block.
- **What the run did.** Left the branch's block as it is, because renumbering against a moving main would have meant rebasing mid-run, which the brief forbids. `scripts/fable/integrate.sh` shows the merge conflicts only in `CANARY.md` and the generated `docs/coverage.md`.
- **Asked of the founder.** At merge, to place this branch's block above main's newest under the next minor number, and to regenerate `docs/coverage.md`.
- **Status on 12 November 2026.** Done on `release/uat` when main was merged into it: the block now sits above main's newest block, and `docs/coverage.md` was regenerated. The seven pull requests to main still carry the block as `v1.17.0`.

## P-13. Whether fame may gate the canon

- **What the run found.** The canon's eligibility rule on main uses the count of Wikipedia language editions as one of its conditions. 489 of the 824 canon records need that count to be eligible; 315 qualify on the museum's own links alone. The brief for this run says outside fame may rank and never write. The oracle for statement 1 passes on the narrower reading (no record is in on fame alone; the count is never stored in a record).
- **What the run did.** Did not re-select the canon. The count's cache is outside git and Wikidata's query service was rate-limited on the day.
- **Status on 12 November 2026.** Main re-ran the selection the same day with twelve new editorial includes (840 records, 270 cornerstones; commit `cf95ef0ca0`). On `release/uat` that selection is merged with this run's century floor (271 cornerstones), and its three new cornerstones that had no wing were given one by the same class rule as P-2. The question below is unchanged.
- **Asked of the founder.** Whether "rank, never write" should also mean "never gate". If so, the eligibility rule needs a structure-only form, and the canon would be re-selected (P-3 then matters: pin the input so the selection is reproducible).

