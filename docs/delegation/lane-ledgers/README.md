# Lane ledgers and open items (snapshot, 14 November 2026)

This folder keeps in git the three lane ledgers and the work registry that were
until now only on the Mac and the microSD. The live files stay where the workers
write them (`/Users/ahmedabdelaal/islam-museum-harvest/agent-progress/` and
`WORK-REGISTRY.md` on the microSD); these are point-in-time copies.

| File | Lane | What it holds |
|---|---|---|
| `microsd-books.md` | A | microSD book mining: batches, resume points, held pages |
| `web-sources.md` | B | web-source families: acceptance scores, linking batches, blocked sources |
| `assabile-av.md` | C | Assabile lecture series: episodes written, exclusions |
| `work-registry-snapshot-2026-11-14.md` | all | which worker claimed which book or series |

The per-lane working ledgers inside the repo stay where they are
(`docs/delegation/web-sources-progress.md`, `docs/delegation/omar-abdelkafy-progress.md`,
`docs/delegation/library/*.md`). The approval record for the lane plan is
`docs/decisions/records/dec-20261114-277.yaml`.

## Not decided (waiting for the founder, each to be named in his own words)

- Sulayman al-Musta'in duplicate merge.
- Babil and Ascalon (askalan) wording in the Nomisma links.
- Sanaa old-city entry.
- Printed pages 532, 546 and 666, held by the lane workers (see `microsd-books.md` and `docs/delegation/library/`).
- mawkib-al-nour episode 29: the transcript is byte-identical to episode 28, so the audio needs re-fetching before anything is written.
- Opinion rulings and sensitivity calls on the lecture series: ajaeb-al-kulub episodes 9 and 22, ahl-al-hikma episode 27 ("polemical"), and the exclusion proposals in `docs/delegation/omar-abdelkafy-progress.md` (modern-conflict asides, group generalisations, the Freemasonry claim in modakirate-iblis episode 30).
- Biblissima matches by Wikidata id left unlinked because our year and Biblissima's differ widely, or Biblissima has no dates: 29 persons, listed in `docs/delegation/web-sources-progress.md`.
- Gallica: its terms page is behind a bot challenge and the only archived copy is from 2019. Walters: the live site is behind a bot challenge and an archived robots.txt carries `ai-input=no`; registering it as a facts-only citation read through a browser is the founder's call.
- Louvre: more objects than the three linked need new object entities, which were not approved.
- EpiHub: deferred.
- Decision-record numbering conflict dec-20261112-261 against dec-20261112-262, flagged on 12 November; check whether it still stands.
- Policy for records known only by an epithet (laqab).
- Identity of Muhammad ibn Yusuf ibn Ma'dan (second notice on the 662 record).

## To do, by lane

**Lane A (microSD books).**
- Sirat al-Hadi ila al-Haqq: resume at printed page 52, then through the book; tax-ruling concept records stay held until a cited Sunni and academic source is read.
- Ibn Sina's Canon: resume at scan page 55 (the wrist, Fann 1, chapter 21), then Fann 2 to 4; create a proper Galen person record (the existing `person/jalinus` is a different man); regenerate `docs/coverage.md`.
- Zij al-Sabi.
- Next smallest unstarted seerah, tareekh or sahaba book, claimed in the registry first.
- Hilyat al-Awliya leftovers (volume 9 and the held notices).

**Lane B (web sources).**
- iDAI.gazetteer: about 397 cities still to search (the first 320 could not be reconstructed).
- Biblissima from candidate 431.
- Nomisma: about 14 persons whose Wikidata id maps to several concepts, Kos and the United Kingdom (held), Mongol empire, Al Bu Said.
- Papyri.info: only two places linked, so the ten-place pilot was not reached.
- Pleiades, VIAF, OpenITI, Louvre and vHMML passes, with prose sections where a link brings real facts.
- Shamela enrichment: 2,826 persons have a data file and no Arabic prose; download the books (Siyar A'lam al-Nubala, al-Wafi bi-l-Wafayat, al-A'lam) to the microSD and mine them locally.

**Lane C (lecture series).**
- min-kunuz-al-sunnah: episodes 12 to 30.
- alwaad-alhaq: all 44 episodes, starting with the series record.
- sharh-saheeh-al-bukhare: 60 episodes.
- mawkib-al-nour episode 29 once its audio is re-fetched.

**Process.**
- Worktrees: create them on the local disk, not the microSD (the microSD checkout stalls with several workers at once).
- Validation takes about four minutes and `origin/main` moves faster; the post-validate shortcut is allowed only under the conditions in `AGENTS.md` handoffs and the PR bodies that used it.
- Re-validate the final merged tree before each merge and report the error count.
