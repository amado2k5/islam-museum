# 53 · Scholarly record — archiving, citation, identifiers

The museum's scholarly apparatus: how the dataset is archived, how it is
cited, which identifiers exist, where they are registered, and the rules that
keep citations gathering on one record. Written 16 November 2026, when the
description paper was published; every fact below was verified against the
live records on that date. When a fact here changes, update this document in
the same pull request.

## 1. The dataset record (Zenodo)

Snapshots of this repository are archived on Zenodo as versions of one
record, *islam.museum — an open digital museum of Islam*:

- **Concept DOI (cite this):** [10.5281/zenodo.23692511](https://doi.org/10.5281/zenodo.23692511) — always resolves to the newest version.
- **Version DOIs** identify one snapshot each and are used only to pin the
  exact state an analysis ran on. Latest at writing (20 November 2026):
  v2026.11.20, [10.5281/zenodo.24396188](https://doi.org/10.5281/zenodo.24396188).
  New versions are archived daily; cite the concept DOI for the dataset
  itself and a version DOI only for the exact state an analysis ran on.
- The flow: a GitHub release of this repository is archived by Zenodo as the
  next version. [`.zenodo.json`](../../.zenodo.json) at the repository root
  supplies the deposit metadata (title, creator with ORCID, CC0 licence for
  the data).
- The record's related works link out to the public API (`isDerivedFrom`)
  and the site (`isSupplementTo`), and — since 16 November 2026 — to the
  description paper (`isDescribedBy`, `isCitedBy`; §3).

**Known open item:** the dataset record's licence field says CC0 1.0, while
the archive it holds also contains CC BY-SA 4.0 prose and MIT code. The
whitepaper reports this openly; correcting the field is a founder decision
(the options are set out in
[`docs/outreach/whitepaper-2026/submission-readiness-checklist.md`](../outreach/whitepaper-2026/submission-readiness-checklist.md)).

## 2. Citation policy

One rule, stated everywhere the museum asks for citation: **cite the concept
DOI, never a version DOI**, so that citations aggregate on a single record
instead of scattering across daily snapshots. A version DOI may be added as
a pinning note, never as the citation itself. The same rule applies to the
paper (§3): cite its concept DOI.

Where the policy is implemented:

- [`CITATION.cff`](../../CITATION.cff) at the repository root — GitHub's
  "Cite this repository" entry; its preferred citation is the dataset's
  concept DOI (added in PR #7110).
- The site's **Cite page** (`/{lang}/cite/`, Arabic, English, Urdu; added in
  PR #7110) — the policy, the copy-ready citation, BibTeX and RIS, and the
  dataset's schema.org `Dataset` JSON-LD (identifier, creator with ORCID,
  CC0 licence, API/Zenodo distributions), which is what dataset indexes such
  as Google Dataset Search read.
- [`README.md`](../../README.md), "Scholarly record and citation".

Licences, restated wherever citation is discussed: data CC0 1.0 · prose
CC BY-SA 4.0 · code MIT · media per item. CC0 imposes no legal duty to cite;
the request is one of scholarly practice.

## 3. The description paper (whitepaper)

Abdel Aal, A. (2026). *islam.museum: A Citable Open Knowledge Graph and
Digital Museum of Islamic History — Resource Description, Method and
Validation State* [Preprint]. Zenodo. CC BY 4.0.

- **Concept DOI (cite all versions):** [10.5281/zenodo.24273662](https://doi.org/10.5281/zenodo.24273662)
- **v1.0 (this version):** [10.5281/zenodo.24273663](https://doi.org/10.5281/zenodo.24273663) — published 16 November 2026 (publication date 15 November 2026).
- Files on the record: the PDF (22 pages) and the Markdown source. The PDF
  prints the version DOI, as reserved before deposit.
- Relations, machine-readable both ways: the paper **cites** and
  **describes** the dataset's concept DOI, is supplemented by this
  repository and by the public API, and describes the site; the dataset
  record in turn declares it **is described by** and **is cited by** the
  paper's concept DOI. The dataset-side links were a metadata-only edit —
  no new dataset version was minted for them.
- The paper carries an AI-use disclosure: AI tools assisted with research,
  drafting, translation and checking under the author's direction; the
  author is solely responsible for the claims. Its validation state is the
  museum's own, unadjusted: most records are drafts, about a fifth are
  preliminary cards with unchecked sources, and the corpus is not
  human-reviewed.
- The deposit package (text, references, DataCite XML, Highwire tags,
  checklist) is kept in
  [`docs/outreach/whitepaper-2026/`](../outreach/whitepaper-2026/). A
  journal submission is a separate, later step and requires the frozen
  audit sample described in the paper's §5.3 and the checklist.

## 4. ORCID and DataCite

The author's ORCID iD is
[0009-0000-9215-2906](https://orcid.org/0009-0000-9215-2906). Both Zenodo
records are registered with DataCite, and DataCite's auto-update pushes
them to the ORCID record: verified 16 November 2026, the record's Works
list holds the dataset and the preprint, each sourced from DataCite. No
manual ORCID entry is needed for a future version of either record.

## 5. Index presence — verified 16 November 2026

Checked live against the dataset's concept DOI and title:

- **DataCite Commons** — present, for the concept DOI and the latest
  version DOI (Dataset, CC0, creator Abdel Aal).
- **OpenAlex** — present: work W7223981281, type dataset, source Zenodo,
  author attached through the ORCID iD; cited-by count 0 at the check.
- **OpenAIRE** — present by title (all dataset versions); a concept-DOI
  search returns nothing, and its graph's own footer dated its records
  17 October 2026 at the check.
- **Google Scholar** — absent. Scholar indexes full text, not metadata
  feeds; the preprint (§3) is the route in, and its PDF follows Scholar's
  guidelines (title and author in large type on the first page, the
  reference list titled "References", Highwire tags in the deposit
  package).
- **Semantic Scholar** — absent, for the same reason; the preprint is the
  route in there too.
- **Altmetric** — a details page exists for the dataset DOI but holds no
  mentions and no score.

Re-check this section after the preprint has had time to propagate, and
date the new findings here.

**Addendum, 20 November 2026.** The dataset's daily versions now run to
v2026.11.20 (§1). The description paper has been indexed by OpenAlex
(work W7234562355); its Zenodo record displayed 14 views and 18 downloads
when read on 20 November 2026. A fuller re-check of this section's indexes
is scheduled for 30 November 2026.

## 6. Standing rules for agents

- Cite concept DOIs only — the dataset's and the paper's alike. Never print
  a version DOI as "the" DOI of either record.
- Relations between the records are edited as metadata; never upload files
  to a published record to change a relation (files are frozen at
  publication, and a metadata-only edit mints no new version).
- A new version of the paper gets a new version DOI; the concept DOI and
  every reference to it in this repository stay unchanged.
- Nothing here may be stated beyond what the live records show: no index
  may be said to list the paper before a dated check finds it there (§5),
  and the corpus is never described as human-reviewed.
