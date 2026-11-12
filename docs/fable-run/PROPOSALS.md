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
