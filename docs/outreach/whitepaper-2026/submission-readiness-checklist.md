# Submission readiness

Prepared 15 November 2026. **Deposited and published on Zenodo on 16 November 2026**, with the author's explicit
go: preprint, CC BY 4.0 — this version (v1.0): https://doi.org/10.5281/zenodo.24273663 · all versions (concept
DOI): https://doi.org/10.5281/zenodo.24273662. The dataset record links back (`isDescribedBy`, `isCitedBy`), and
the paper is on the author's ORCID record through DataCite. A journal submission still requires the author's
explicit go and the steps listed further down.

## Ready now for a Zenodo preprint deposit

- [x] Full text, 8,045 words of main text, abstract 287 words (`whitepaper.md`)
- [x] Title-page metadata, highlights, keywords, all required statements
- [x] References checked against Crossref, DataCite and Zenodo metadata on 15 November 2026
- [x] Dataset cited by concept DOI throughout; the version DOI appears once, in the reproducibility note
- [x] Zenodo deposit metadata, DataCite XML, Highwire and Dublin Core tags, BibTeX, `CITATION.cff`
- [x] Claims-evidence table

## The deposit — done 16 November 2026

1. The author directed the deposit after a full review of the paper and its metadata package against the
   repository record (the review passed; the author's go was given on that condition).
2. ✓ The "UNVERIFIED — author to confirm" items were settled from the author's own record, and the list was
   deleted from the deposited text.
3. ✓ The frozen basis (`63475724ce`) was kept.
4. ✓ PDF produced (22 pages; the first page begins with the title and then the author's name, in large type,
   and the reference list is titled "References", as Google Scholar's guidelines ask).
5. ✓ Zenodo upload of type Publication / Preprint created; DOI 10.5281/zenodo.24273663 reserved and substituted
   everywhere: the paper, the BibTeX, the XML, the meta tags, the `CITATION.cff` (the `doi` line uncommented).
6. ✓ Metadata entered from `zenodo-paper-metadata.json` (the notes block was removed from the deposit copy).
   Licence CC BY 4.0.
7. ✓ Published. The dataset record now carries the paper's concept DOI (10.5281/zenodo.24273662) as
   `isDescribedBy` and `isCitedBy` — a metadata-only edit; no new dataset version was minted.
8. ✓ The paper is on the author's ORCID record (added by DataCite auto-update; verified 16 November 2026).

## Recommended before or soon after the deposit

- Correct the licence field of the dataset's Zenodo record, which says CC0 for an archive that also holds
  CC BY-SA 4.0 prose and MIT code (ledger row R19). The paper reports this as open.
- ✓ Done (PR #7110, 16 November 2026): a `CITATION.cff` for the dataset stands at the repository root, its
  preferred citation the dataset's concept DOI.
- Resolve the conflict between the developer page ("there is no OpenAPI/Swagger document") and
  `site/public/openapi/v1.json`.
- ✓ Done (PR #7110, 16 November 2026): the site carries a schema.org `Dataset` description — on the Cite page
  (`/{lang}/cite/`), which also states the citation policy and links this paper.

## Required before a journal submission (not needed for the preprint)

1. **The frozen audit sample.** Run the protocol of section 5.3: fix the snapshot (version DOI and commit), publish
   the allocation and seed, draw about 400 records, verify claim by claim against the cited editions, with at least
   one human verifier who reads Arabic and a second for a subsample. Report whatever it finds.
2. **Check the Qur'an passages against the Tanzil files** by exact comparison, as the protocol specifies.
3. Deposit the audit data as a supplementary dataset with its own DOI, and add section 5 results.
4. Decide what to do with the 11,260 preliminary cards (source them, exclude them from counts, or remove them);
   a journal reviewer will ask.
5. Read the target journal's guidelines. The Journal of Open Humanities Data, for example, has its own article
   types, length limits and section template; this paper is longer than a short data paper and will need cutting or
   a different article type. Check its policy on AI-assisted writing and on preprints.
6. Re-verify every figure and every reference on the day of submission, and re-read the two web sources marked
   "n.d." for wording.
7. Add one reference not yet verified, if wanted: see "candidate references" below.
8. Ask one or two scholars of Islamic history or digital humanities to read the paper before submission. Their
   comments are not endorsements and are not to be reported as such.

## Candidate references — verify before submission

- Guha, R. V., Brickley, D., and Macbeth, S. (2016). Schema.org: evolution of structured data on the web.
  *Communications of the ACM*, 59(2), 44–51. DOI believed to be 10.1145/2844544. The lookup failed on
  15 November 2026 (the registry and the publisher's page both refused the request), so it is not in the paper.
- A current Zenodo help page that explains concept DOIs and version DOIs. The address tried returned "not found".
  The paper relies on the Zenodo record's own fields instead.
- A peer-reviewed description of the KITAB project's text-reuse work, to replace the website reference.

## What must not be said, at any stage

That the corpus is human-reviewed or peer-reviewed; that the project is DPGA-listed, UNESCO-nominated or submitted
to UNESCO; that it has a live Wikidata item; that any index has listed the paper before it has.
