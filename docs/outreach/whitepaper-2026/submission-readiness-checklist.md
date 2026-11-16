# Submission readiness

Prepared 15 November 2026. **Deposit and submission require the author's explicit go.** Nothing has been published,
deposited, submitted, emailed or posted.

## Ready now for a Zenodo preprint deposit

- [x] Full text, 8,045 words of main text, abstract 287 words (`whitepaper.md`)
- [x] Title-page metadata, highlights, keywords, all required statements
- [x] References checked against Crossref, DataCite and Zenodo metadata on 15 November 2026
- [x] Dataset cited by concept DOI throughout; the version DOI appears once, in the reproducibility note
- [x] Zenodo deposit metadata, DataCite XML, Highwire and Dublin Core tags, BibTeX, `CITATION.cff`
- [x] Claims-evidence table

## To do before the deposit (author)

1. Read the paper in full. You are the sole author and are responsible for every claim.
2. Settle the items in the paper's "UNVERIFIED — author to confirm" list, then delete that list from the deposited text.
3. Decide whether to keep the frozen basis (`63475724ce`) or re-measure on the day of deposit. If you re-measure,
   change every figure, the abstract, the highlights, the metadata descriptions and the claims table together.
4. Produce the PDF. Its first page must begin with the title and then the author's name, in large type, and the
   reference list must be titled "References"; Google Scholar's guidelines ask for this.
5. On Zenodo, start a new upload of type Publication / Preprint, reserve the DOI, and replace
   `[PAPER DOI TO BE ASSIGNED ON ZENODO DEPOSIT]` everywhere: the paper, the BibTeX, the XML, the meta tags, the
   `CITATION.cff` (uncomment the `doi` line).
6. Enter the metadata from `zenodo-paper-metadata.json` (remove its notes block first). Licence CC BY 4.0.
7. Publish. Then edit the dataset record and add the paper DOI as a related identifier, `isDescribedBy`.
8. Add the paper to your ORCID record.

## Recommended before or soon after the deposit

- Correct the licence field of the dataset's Zenodo record, which says CC0 for an archive that also holds
  CC BY-SA 4.0 prose and MIT code (ledger row R19). The paper reports this as open.
- Add a `CITATION.cff` for the dataset to the repository root; there is none today. This is a repository change
  and goes through the usual pull request with a `CANARY.md` entry.
- Resolve the conflict between the developer page ("there is no OpenAPI/Swagger document") and
  `site/public/openapi/v1.json`.
- Consider a site-level schema.org `Dataset` description on the developer page; none was found.

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
