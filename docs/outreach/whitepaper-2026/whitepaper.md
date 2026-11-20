# islam.museum: A Citable Open Knowledge Graph and Digital Museum of Islamic History — Resource Description, Method and Validation State

**Author:** Ahmed Abdel Aal
**ORCID:** [0009-0000-9215-2906](https://orcid.org/0009-0000-9215-2906)
**Affiliation:** islam.museum (independent)
**Contact:** discover@islam.museum
**Date:** 15 November 2026
**Paper version:** v1.0
**Paper DOI:** [10.5281/zenodo.24273663](https://doi.org/10.5281/zenodo.24273663)
**Dataset described (concept DOI, all versions):** [10.5281/zenodo.23692511](https://doi.org/10.5281/zenodo.23692511)
**Licence of this paper:** CC BY 4.0

---

## Abstract

Open, reusable and citable structured data on Islamic history remain scarce in comparison with the size of the written tradition. Institutional collection portals are authoritative but are generally not designed for bulk reuse, while large content sites are rarely structured or cited at the level of the individual claim. This paper describes islam.museum, an Arabic-first digital museum, with English and Urdu editions, whose primary form is a knowledge graph kept in a public git repository and archived on Zenodo under the concept DOI 10.5281/zenodo.23692511. On the repository basis analysed here (commit `63475724ce`, 15 November 2026) the resource holds 64,374 record files: 54,823 content records and 9,551 source records, connected by 88,506 typed relations. Data are released under CC0 1.0, prose under CC BY-SA 4.0 and code under the MIT licence; media are licensed per item. The resource is compiled by one person directing AI tools under written rules: the tools research, draft, translate and check records, and automated gates validate schema, citations, encoding and content-safety rules before anything is merged. The validation state is reported without adjustment. 81.1% of content records are drafts; 55.1% cite at least one book; 20.5% are preliminary cards imported from Wikidata whose sources are not yet checked. All records are AI-written unless a record itself shows otherwise, and the corpus is not human-reviewed. No claim-level accuracy audit has yet been completed; a protocol for one is specified. The project was launched on 11 October 2026, has had no formal user study, and no independent citations of the dataset were known at the time of writing. The resource may be reused as a dataset, queried through a static JSON API, mapped to school curricula, or forked as a template for other heritage domains.

## Highlights

- A knowledge graph of Islamic history kept in git, holding 64,374 record files (54,823 content records and 9,551 source records) and 88,506 relations at commit `63475724ce` on 15 November 2026.
- Data under CC0 1.0, prose under CC BY-SA 4.0 and code under MIT, with the dataset archived on Zenodo under the concept DOI 10.5281/zenodo.23692511.
- AI tools draft the records under one author's written rules; 81.1% of content records are drafts and 20.5% are preliminary cards with unchecked sources, and both facts are stated on the records and in this paper.
- A static site and static JSON API are generated from the same graph; nothing on the published site calls a model or runs server code per visitor.

## Keywords

Islamic history; digital museum; knowledge graph; open data; digital humanities; Arabic-first; Zenodo; CC0; AI-assisted compilation; data citation

---

## 1. Introduction

The written record of Islamic history is very large, multilingual and unevenly digitised. A reader, teacher or researcher who wants structured information about a person, a building, an event or a book of that history, with a citation attached and a licence that permits reuse, meets a gap between two kinds of resource.

The first kind is the institutional portal: the online catalogue or virtual exhibition of a museum, library or consortium. These resources carry the authority of the institutions behind them and of curators who have handled the objects. They are, however, built around collections rather than around history as a connected whole, and they are generally designed to be visited, not downloaded. Their terms of use vary from one institution to the next, and bulk reuse of their records is often not offered. This is a characterisation by kind and not a survey; individual institutions differ, and several publish open data.

The second kind is the large content site: encyclopaedic, devotional or educational websites that carry a great deal of text about Islamic history. Their coverage can be wide, but the text is seldom structured as data, seldom cited at the level of the individual statement, and seldom released under terms that state plainly what a reuser may do.

Between the two stand general-purpose open knowledge bases, of which Wikidata is the most important (Vrandečić and Krötzsch, 2014), and scholarly text corpora such as OpenITI (Nigst et al., 2025). Both are open and reusable. Neither is a museum: neither offers a curated, narrated, multilingual visitor experience over its data, and neither was designed to do so.

islam.museum is an attempt to occupy the space between these resources. It is a digital museum with wings, guided tours, pathways and a children's section, and it is at the same time a knowledge graph in which each record is a plain-text file with typed relations, cited sources and a provenance block. The museum interface and the public API are both generated from the same files. The intended contribution is the combination: a museum interface for readers, and beneath it a cited graph that may be copied, queried and reused under stated licences. To our knowledge, no other open resource for Islamic history combines an Arabic-first museum interface, a CC0 graph in version control, a static API and a DOI-archived dataset; the basis for that statement is the comparison in section 2, which is limited to the resources named there and is not exhaustive.

The resource has properties that a reader must know before relying on it, and this paper states them early. It is young: the site was launched on 11 October 2026, five weeks before the date of this paper. It was compiled by one person directing AI tools, and the tools wrote the records. Most records are drafts. One content record in five is a preliminary card whose sources have not yet been checked. No human-reviewed corpus is claimed anywhere in this paper. Section 5 reports these facts with their bases and dates, and section 8 lists the limitations in full.

The paper has three purposes. It describes the resource (section 3) and the method by which it was built (section 4), so that a reuser can judge its fitness for a purpose. It reports the validation state as measured and specifies the audit that remains to be done (section 5). And it serves as the citable scholarly text for the dataset (sections 7 and 10): a dataset record alone is represented weakly in the indexes that scholars search, and a described, citable resource is easier to find, to evaluate and to credit.

## 2. Related work and positioning

The resources below are compared by kind. The purpose is to state where islam.museum differs, not to rank. Each of these resources does things that islam.museum does not do.

### 2.1 General-purpose knowledge graphs: Wikidata

Wikidata is a collaboratively edited, multilingual knowledge base released under CC0 (Vrandečić and Krötzsch, 2014). It is far larger than islam.museum, it is maintained by a community rather than a single editor, and it covers all domains. Knowledge graphs of this kind, their data models and their quality problems are surveyed by Hogan et al. (2021).

islam.museum depends on Wikidata and does not compete with it. Under the project's rules, Wikidata and Wikipedia are admitted as sources for entity facts (identifiers, names, locations, dates, URLs) when the fact is taken from a recorded revision, cited, and entered in an authenticity ledger; they are not admitted as sources for prose or for the content of a work. Records carry Wikidata identifiers where they are known. The differences are of scope and form. islam.museum is restricted to one domain; it attaches narrative prose in three languages to its records; it applies editorial rules specific to the domain (section 4.6); and it presents the graph as a museum. It lacks what Wikidata has: a community of editors, a query service, and the scrutiny that many readers bring.

### 2.2 Text corpora: OpenITI and KITAB

OpenITI is a machine-readable corpus of Islamicate texts, published on Zenodo with versioned releases (Nigst et al., 2025). The KITAB project works with that corpus on questions that include the reuse of text between works (KITAB, n.d.). These are corpora of the texts themselves, prepared for computational reading.

islam.museum is not a text corpus. It does not distribute the texts of its sources: the project's source policy keeps source files, scans and OCR text out of the repository and limits verbatim quotation to forty words with a citation. What it holds are records about entities (persons, places, events, works, buildings, concepts) with relations among them and citations pointing to the works from which the statements were taken. The two kinds of resource are complementary: a corpus supports reading at scale, and an entity graph supports navigation, linking and reference. No technical integration between islam.museum and OpenITI exists at the time of writing.

### 2.3 Curated virtual collections: Museum With No Frontiers and Google Arts & Culture

Museum With No Frontiers publishes Discover Islamic Art, which describes itself as a virtual museum (Museum With No Frontiers, n.d.). Google Arts & Culture is a platform on which cultural institutions present collections and exhibitions (Google, n.d.). Both are collection-centred: the unit is the object or monument held or documented by a partner institution, described by that institution's specialists, usually with high-quality images.

islam.museum differs in three respects. Its unit is the historical entity, not the held object: most of its records describe persons, passages, events, places and concepts, and the object class is small. It holds no physical collection and has no partner institutions; its descriptions are compiled from published sources, not written by curators with access to the objects. And its records are released as data under CC0. The authority of the collection-centred resources rests on their institutions. islam.museum has no such authority, and its records must be judged by their citations.

### 2.4 Aggregators: Europeana and OpenAIRE

Europeana aggregates metadata from cultural heritage institutions and has published that metadata as linked open data (Isaac and Haslhofer, 2013). The OpenAIRE Graph aggregates metadata about research outputs, including datasets and publications deposited in repositories, and links them to one another (Manghi et al., 2019). Aggregators do not create the records they hold; they harvest, normalise and connect records created elsewhere.

islam.museum is a primary resource, not an aggregator. Its relation to aggregation is as a potential source: its Zenodo deposits are of the kind that OpenAIRE harvests, and its records, being CC0 with stable identifiers, are suitable for aggregation by others. No aggregator other than those that operate automatically on Zenodo deposits is known to carry the resource at the time of writing.

### 2.5 Research-data infrastructure: Zenodo and DataCite

Zenodo is a general-purpose research repository operated by CERN (European Organization for Nuclear Research and OpenAIRE, 2013). It registers DataCite DOIs for its records, and DataCite's metadata schema defines the properties by which those records are described and related to one another (DataCite Metadata Working Group, 2024). The FAIR principles (Wilkinson et al., 2016) and the Joint Declaration of Data Citation Principles (Data Citation Synthesis Group, 2014) set out the expectations that such infrastructure serves: persistent identifiers, rich metadata, stated licences, and citation of data as a first-class research output.

islam.museum uses this infrastructure and adds nothing to it. Section 7 describes how.

### 2.6 Summary of positioning

| Resource | Kind | Unit | Who writes the records | Bulk reuse |
|---|---|---|---|---|
| Wikidata | General knowledge graph | Any entity | Community | CC0 |
| OpenITI | Text corpus | Text | Scholarly project | Licence stated on the Zenodo record |
| Discover Islamic Art (MWNF) | Curated virtual collection | Object, monument | Partner institutions | As stated by the site |
| Google Arts & Culture | Presentation platform | Object, exhibition | Partner institutions | As stated by the platform and its partners |
| Europeana | Aggregator | Heritage metadata record | Contributing institutions | Per record |
| OpenAIRE Graph | Aggregator | Research output | Repositories and publishers | Open graph |
| islam.museum | Domain knowledge graph with a museum interface | Historical entity | One author directing AI tools | Data CC0; prose CC BY-SA 4.0 |

The row for islam.museum has a weakness that the others do not, and the table states it: the records are written by AI tools under one person's direction, and most have not been read by a human editor.

## 3. Resource description

### 3.1 Bases and dates of the figures

Two bases are used in this paper and are not interchangeable.

The **repository basis** is the state of the public git repository at commit `63475724ce` on 15 November 2026, measured by the project's script `scripts/report/claims_audit.py` and recorded in the project's public claims ledger (`docs/audit/public-claims-audit-2026-11-15.md`). The script counts by pattern matching over the record files and does not parse the graph; two records that the script's pattern misses were added by hand to the draft count, as the ledger records.

The **live-site basis** is the site as built on 14 November 2026 and read on 15 November 2026, from the public counts file of the API (`/api/v1/meta/counts.json`) and from the home page.

The repository grows daily, and the site is deployed manually, so the two bases differ and both will have moved by the time this paper is read. Section 10 gives a version DOI that pins the archived snapshot nearest to the analysis.

### 3.2 The graph model

The resource is a set of plain-text files in a git repository. Each record has a language-neutral data file at `data/<class>/<slug>.yaml` and, where prose has been written, one prose file per language at `content/<lang>/<class>/<slug>.md`. A record's identifier is `class/slug`. Identifiers are immutable; a rename is handled by an alias, and a duplicate becomes an alias of the richer record.

At the frozen commit, the schema directory defines 25 record classes, each with a JSON Schema: award, building, concept, course, dataset, event, exhibit, group, invention, job, journey, language, listing, media, object, passage, period, person, place, polity, practice, question, screen, source and work. The source class holds bibliographic records, which are records in the graph like any other and are cited by identifier from the content records. The largest content classes are passages (Qur'anic and hadith passages), persons, buildings, events, places and concepts.

Relations between records use a closed registry of predicates (`schema/predicates.yaml`), which held 99 predicates at the frozen commit. Each predicate declares its domain and range classes, its inverse, its labels, and whether it is time-scoped. An edge is written once, on one record; inverse edges are computed at build time. Relations may carry a time span and their own source citations.

Dates are recorded in the Extended Date/Time Format together with a Hijri date string, the calendar of the source, and a precision; a date converted from one calendar to the other is marked as derived. A data record carries labels and summaries by language, with the Arabic label and summary required; the cited sources; a review state; and a provenance block that names what generated the record (`generated_by`, `model`, `run`, `source`).

### 3.3 Scale

**Repository basis (commit `63475724ce`, 15 November 2026):**

| Measure | Value |
|---|---|
| Record files in total | 64,374 |
| Content records | 54,823 |
| Source (bibliographic) records | 9,551 |
| Content records in review state `draft` | 44,469 (81.1%) |
| Content records in review state `published` | 10,354 (18.9%) |
| Content records citing at least one book | 55.1% |
| Preliminary Wikidata-import cards, sources not yet checked | 11,260 (20.5%) |
| Relations | 88,506 |

**Live-site basis (built 14 November 2026, read 15 November 2026):**

| Measure | Value |
|---|---|
| Records shown by the site build | 63,078 |
| Record pages | 194,832 |
| Guided pathways | 300 |
| Grand Tour stops | 40 |
| Ontario courses in the Education Explorer | 65 |

The figure of 194,832 record pages is the site's own definition and is not a count of written articles: it is (63,078 records + 1,866 linked-but-unwritten stubs) × 3 languages. A stub is a record that other records link to and that has not yet been written; it has a page so that links resolve, and the page says that the record is not yet written. Readers who want the number of records should use 63,078 on the live-site basis or 64,374 on the repository basis; the difference between the two is the growth of the repository after the build.

### 3.4 Languages

The museum is Arabic-first. Arabic labels and summaries are required on every record, and new prose is written in Arabic first, with English and Urdu translations produced in the same change. All three language editions exist, and prose files are present in the three languages in near-equal numbers. Parity is not complete for every feature. The Grand Tour (section 3.5) has narratives in Arabic and English only; there is no Urdu Grand Tour. Translations are produced by AI tools and carry the same provenance and review marking as the records they translate.

### 3.5 Presentation: nine wings over one graph

The museum presents the graph through nine wings: People, Place, Time, Ideas, Objects, Words, Living Islam, Today, and Made. The wings are presentation views. They are not separate databases or separate collections: a wing is a value on a record, and a record may be reached from more than one wing. The same holds for the museum's other features, which the project's rules require to keep their records in the one graph, to be exported through the API, and to be indexed by search.

Three features are relevant to reuse.

The **Grand Tour via the River of Time** is a guided route of 40 cornerstone stops that spans the nine wings and fourteen Hijri centuries. Its narratives are in Arabic and English.

The **pathways** are 300 guided trails through records on a theme, stored in the graph as exhibit records.

The **Education Explorer** maps museum records to 65 Ontario curriculum courses for Grades 1 to 12. The project's audit script counts 361 lessons on the repository basis. The lessons are AI-assisted drafts, are labelled as such, and await a human editor. No classroom use has been measured.

### 3.6 The static site and the API

The published site is static. Pages are generated at build time from the repository and served from a content delivery network and object storage. Nothing on the published site calls a language model, and no server code runs per visitor; models are used only while the resource is being built. The site has no accounts, and the project's claims ledger records that no advertising or analytics code was found in the site's source. Pages are readable without JavaScript. The project states an accessibility baseline of WCAG 2.2 AA, self-assessed and partially conformant.

The API is a set of static JSON files at `https://api.islam.museum/api/v1/`, generated by the same build. It needs no key. It offers one file per record (all data fields, resolved labels, outgoing connections and licences), one index file per class, the whole graph as newline-delimited JSON (`graph/nodes.ndjson` and `graph/edges.ndjson`), a two-hop neighbourhood file per record, and meta files that state counts with their definitions. Each record in the API repeats its licence in a `license` field. An OpenAPI description is kept in the repository (`site/public/openapi/v1.json`). There is no SPARQL endpoint and no library-standard export such as OAI-PMH or MARC.

Because the API is static, a query that it does not pre-compute must be run by the reuser over the downloaded graph files. This is a deliberate limit: it keeps the running cost low and the resource reproducible, at the price of query convenience.

### 3.7 Archiving on Zenodo: concept DOI and version DOIs

Snapshots of the repository are deposited on Zenodo as versions of one record. Zenodo assigns each version its own DOI and assigns the record as a whole a concept DOI that always resolves to the latest version. The concept DOI of the dataset is **10.5281/zenodo.23692511**. On 15 November 2026 the Zenodo record listed thirteen versions, the latest labelled v2026.11.15.

The project's citation policy is that the concept DOI is the canonical reference to the dataset. Citing the concept DOI keeps citations on one record regardless of which snapshot a reader used. A version DOI has one legitimate use: to pin the exact snapshot on which an analysis was run, so that the analysis can be repeated. Section 10 gives the version DOI for the snapshot nearest to this paper and labels it accordingly.

### 3.8 Licences

The licences are stated in full because reuse depends on them.

- **Data** — the structured facts under `data/`, `geo/`, `datasets/` and `schema/` (entities, relations, dates, coordinates, identifiers) — are dedicated to the public domain under **Creative Commons CC0 1.0 Universal**.
- **Prose** — the articles, summaries and exhibit text under `content/`, in all languages — is licensed under **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**. The requested attribution is "islam.museum contributors", the page URL, and the licence.
- **Code** — the pipeline, the site and the workflows — is licensed under the **MIT licence**.
- **Media** are not covered by any blanket licence. Each media item records its own licence, which must come from a whitelist kept in the schema. Third-party content keeps the licence of its source.

One inconsistency must be reported. The Zenodo record archives the whole repository in one file, and the licence field of that record says CC0. The archive contains prose under CC BY-SA 4.0 and code under MIT as well as CC0 data; the record's description states the three-way split, but its licence field does not. The split stated above and in the repository's licence files is the governing statement. The correction of the Zenodo field is an open item for the author.

## 4. Method

### 4.1 Overview

The resource is compiled by one person, the author, who directs AI tools under written rules kept in the repository. The author writes the rules, decides doubtful cases, merges changes and deploys the site. The AI tools research, draft, translate and check records. Automated gates run on every change. This section describes each part and states what it does and does not establish.

### 4.2 Source-first compilation

Compilation begins from sources, not from a list of topics to be written about. The project's primary corpus is published scholarly editions and historical works: chronicles, biographical dictionaries, geographical works, hadith collections and modern reference works. They are obtained as scans from open repositories such as the Internet Archive. Before a work is used, its identity is verified: the work, the author and the edition are established and recorded in a source record, so that a citation to "page 212" refers to a known edition. A register in the repository records the state of each work (downloaded, OCR complete, mined), so that work is not repeated.

A work is then read page by page by AI tools, and the entities and statements found in it are extracted into records: a person with dates and places, an event with participants, a building with its founder. Each extracted statement carries a citation to the source record and, where available, the page. The project's source policy permits any source to be read, whether or not it is in copyright, and requires its content to be rewritten in the museum's own words with a citation; the texts themselves stay out of the repository.

The description "source-first" is the method's intention and is true of part of the resource. It is not true of all of it, and the difference matters. On the repository basis, 55.1% of content records cite at least one book. The remainder rest on other kinds of source. The Qur'an text is loaded from the Tanzil project's files (Tanzil, n.d.) and is never typed, completed or corrected by a tool; passages are referenced by identifier. Hadith passages come from collections and from a public hadith dataset. Other records rest on museum and library catalogues, registered websites, and Wikidata or Wikipedia for entity facts. An earlier measurement the same day, at commit `8d478cd72`, found that 74.2% of source records were Wikipedia or Wikidata pages, that 16.8% of content records rested on non-book sources only, and that 7.7% rested on Wikipedia or Wikidata alone; these three figures were not re-measured at the frozen commit and are given as an indication with their own basis.

### 4.3 Preliminary cards

A distinct group of records did not come from the reading of a book. In several import runs, records for buildings, events and other entities were created from Wikidata. On the repository basis there are 11,260 preliminary cards, 20.5% of content records, almost all of them from those runs (11,215 of 11,264 at the earlier commit `8d478cd72`). Preliminary cards are records of a distinct kind: each states in its own text that its sources are not yet checked, and many cite a general reference work as a placeholder that has not been verified to support the record. A placeholder citation is not a source. These cards are counted separately throughout this paper, and the 55.1% figure for book citation excludes them.

### 4.4 What the AI tools do

AI assistance is disclosed here precisely, because it is the central fact about how the resource was made.

AI tools — commercial large language models operated through coding and research assistants, from several vendors — perform the following at build time: reading sources and extracting entities and statements; drafting the Arabic prose of records; translating it into English and Urdu; cross-checking records against sources and against one another; writing and maintaining the scripts, the site code and the validation checks; and generating illustrations, which the site labels as AI-generated. On the repository basis, 48,446 content records (88.4%) carry a provenance block that names an AI agent or model as the generator, and 6,377 (11.6%) name a script; the script-made records are in the main the Qur'an passages loaded from Tanzil. Every one of the content records in the `published` state names an AI agent.

The author does the following: writes and revises the rules; decides cases that the rules do not settle, with the decision recorded in a ledger in the repository; reviews and merges changes; and deploys. The author has not read every record, or most records. All records should be treated as AI-written unless a record itself shows otherwise.

Every commit made by a tool ends with trailers naming the agent, the model and the editor, and the same facts are recorded in each record's provenance block. The provenance is therefore inspectable per record and per commit.

### 4.5 Validation gates

A change is merged only after automated checks pass. The repository's validation command chains the following, and the rule is that it must report zero errors — the gate is literal, and a change with one error does not merge:

- **Schema validation.** Every record is checked against the JSON Schema of its class, and every relation against the predicate registry (domain, range, existence of both ends).
- **Citation checks.** Records are required to cite sources, and every cited source identifier must resolve to a source record in the graph. The audit script found 22 content records at an earlier commit the same day that cited no source record; they are defects, not exceptions.
- **Encoding checks.** Arabic-script integrity rules are enforced, among them a rule that a parenthesis enclosing Arabic text is wrapped in directional isolates so that it renders on the correct side in right-to-left text.
- **Authenticity checks.** Facts taken from Wikipedia or Wikidata must be recorded in an authenticity ledger with the revision from which they were taken.
- **Content-safety check.** Described in section 4.7.
- **Register checks.** The harvest and enrichment registers and the decision records are checked for consistency.

Other rules are enforced by the same validator: honorific formulae are not typed into records (the interface renders them), and Qur'an text may not appear in prose except by reference to a passage record. A test suite and, for site changes, a full build run in addition.

These gates establish structural and procedural properties: that a record is well-formed, that it cites a source that exists, that a rule was not broken. They do not establish that a statement is true or that the cited page supports it. That is a claim-level question, and section 5 treats it.

### 4.6 The publication rule and the review states

Each content record has a review state, and the two states in use are `draft` and `published`.

The publication rule, set by the author on 15 November 2026, is that a record may stand as `published` when it cites defined sources that are listed clearly on the record. Where a record's sources are difficult — a single late source, a disputed attribution, an edition of uncertain quality — the difficulty is stated on the record. One source is sufficient for a fact. Publication under this rule does not require a human read, and it does not mean that one took place. The rule is a statement about what the reader is given: the sources are named, and the reader can verify.

`published` therefore means "sources listed and gates passed" and nothing more. It does not mean peer-reviewed, expert-reviewed or human-reviewed. Readers are expected, and encouraged, to verify a record against its sources before relying on it, and the site says so on the page.

### 4.7 Editorial rules

**Voice and frame.** Records are written in a descriptive register: the rules ask for description and attribution, not rulings or advocacy. The default frame is Sunni Islam, and research starts from Sunni sources; any other view is admitted and must be labelled before it is stated. Contested topics use a structured block that gives the Sunni position or positions first, then the academic view, then any other view, each cited and labelled, with no verdict from the museum.

**Faith classification: the two-independent-sources rule and the doubt rule.** A person's religious affiliation is a sensitive datum and is treated more strictly than other facts. A faith value is recorded only with its basis and is never inferred from a name, a place or a period. The project's rule for biographical profiles requires two independent sources that name the specific school or order before a value is set; a single text or a single encyclopaedia entry is not sufficient. Where sources conflict, or where competing scholarly readings exist, the doubt rule applies without exception: the value stays `unknown`, and the competing attestations are preserved in a note. This is the one class of fact for which the one-source rule of section 4.6 is deliberately not enough.

**Content safety.** The project applies a hard block on propaganda material of organisations designated as terrorist organisations on official lists: the resource does not cite, quote, link or reproduce their material, and does not carry records whose subject or publisher is one of them. Where a historical topic is valid but a source carries modern extremist framing, the framing is dropped and the record is written from academic, art-historical or archaeological sources. The validator enforces the block at build time, with a short list of reviewed exceptions and of look-alike terms that are not matches. The rule is stated here because it shapes coverage: a reuser should know that the modern period is covered under this constraint.

**Media.** Media are admitted only under licences on a whitelist. The museum carries no figurative depictions of prophets or Companions and no AI-generated portraits; AI-generated illustrations are labelled as such and are described by the project as the model's imagining from the graph, not as depictions of their subjects.

### 4.8 Reproducibility of the build

The site, the API and the Zenodo snapshot are all derived from the repository. A reader who clones the repository at a given commit and runs the documented commands obtains the validation result, the test result and the build for that commit. The claims in this paper that rest on the repository basis can be re-derived by checking out commit `63475724ce` and running `python3 scripts/report/claims_audit.py`.

## 5. Validation and quality state

### 5.1 The measured state

The state of the resource on the repository basis is as follows, and no figure here has been adjusted.

- **Most records are drafts.** 44,469 of 54,823 content records (81.1%) are in the `draft` state; 10,354 (18.9%) are `published` under the rule of section 4.6.
- **The records are AI-written.** 88.4% of content records name an AI agent or model as generator and 11.6% name a script. No field on any record states that a human read took place.
- **Book grounding is partial.** 55.1% of content records cite at least one book.
- **One record in five is a preliminary card.** 11,260 records (20.5%) are Wikidata-import cards whose sources are not yet checked.
- **The corpus is not human-reviewed.** No sample, class or subset of the corpus is claimed to have been reviewed by a human editor.

### 5.2 What has and has not been established

The gates of section 4.5 have been run on every merged change, and the repository's rule is that they pass with zero errors before a merge. Structural validity may therefore be taken as established for the repository at any merged commit, and can be confirmed by running the validation command.

Claim-level accuracy has not been established. No audit has yet measured, on a defined sample, how often a statement in a record is supported by the page it cites. Earlier internal checks exist in the repository's history, but they were made on earlier states of the corpus, with differing methods, and are not reported here as evidence about the present corpus.

Some known defects are on record. The project's claims ledger of 15 November 2026 lists open items, among them the placeholder citations on preliminary cards (section 4.3) and a search-ranking defect: in a fixed test of 50 queries on the production site on 11 November 2026, the canonical record was returned first for 2. That test was not repeated for this paper.

### 5.3 Audit protocol to be run before journal submission

The following protocol is specified so that the accuracy of the resource can be reported with a known method. **Its results are to be completed before journal submission; none are reported here.**

**Frozen basis.** The audit is run on one archived snapshot, identified by its Zenodo version DOI and its git commit. All sampling and all reported figures refer to that snapshot.

**Population and strata.** The population is all content records. Records are stratified by three variables: class (the six largest classes separately, and the remainder as one stratum); grounding (cites a book; preliminary card; other sources only; Wikipedia or Wikidata only); and review state (`draft`, `published`). Script-loaded Qur'an passages are audited separately for fidelity to the Tanzil files, by exact comparison of the whole population, not by sampling.

**Sample.** A stratified random sample is drawn with a recorded seed. A total of about 400 records, with a minimum of 20 per populated stratum, gives intervals narrow enough to be useful for the corpus as a whole; the final allocation is fixed and published before any record is examined.

**Unit of verification.** The unit is the claim, not the record. Each sampled record is decomposed into its atomic factual claims (a date, a place, a relation, an attribution, a statement in prose), and each claim is checked against the cited source at the cited location, in the cited edition.

**Error taxonomy.** Each claim receives one verdict: supported; partially supported; not found at the cited location; contradicted by the cited source; source not accessible; or citation is a placeholder. Errors are further classed by type: date or calendar-conversion error; identity conflation between persons or places of the same name; wrong relation; unsupported elaboration in prose; divergence between the Arabic prose and its English or Urdu translation; fabricated or unverifiable citation; and breach of an editorial rule.

**Verifiers.** Verification by the tools that wrote the records is not independent. The audit requires at least one human verifier able to read the Arabic sources, and a second verifier for a subsample to measure agreement. Disagreements are recorded, not resolved silently.

**Reporting.** Results are reported per stratum and for the corpus, as proportions with confidence intervals, with the sample list, the seed, the per-claim verdicts and the verifiers' identities and roles published as a supplementary dataset. Whatever the audit finds is reported, including strata in which the resource performs badly.

## 6. Reuse cases

The cases below describe what the resource permits. No user numbers, testimonials or outcomes are reported, because none have been measured.

### 6.1 Education

The Education Explorer maps records to 65 Ontario curriculum courses across Grades 1 to 12, so that a teacher looking for material for a course can find related records and draft lessons. Because the prose is CC BY-SA 4.0 and the data are CC0, a teacher or school board may adapt the material without asking permission, subject to attribution and share-alike for the prose. The lessons are AI-assisted drafts awaiting a human editor, and a teacher should treat them as starting points to be checked. The mapping to the Ontario curriculum is one worked example; the same method could be applied to another jurisdiction's curriculum by a party that knows it.

### 6.2 Research queries over the graph

The graph files of the API support questions that are laborious to answer from prose: the persons recorded as having died in a given city in a given century; the teacher–student relations recorded around a scholar; the buildings attributed to a patron; the works recorded for an author together with the editions cited. A researcher downloads `nodes.ndjson` and `edges.ndjson`, loads them into a graph library or a database, and filters by class, predicate and date. Each edge carries its sources, so that a result can be traced to citations.

Such results are leads for research and not findings. A count derived from the graph measures what the graph contains, which reflects which sources have been mined and how the tools extracted them; it does not measure the historical record. The project's own estimate is that a small fraction of its intended corpus has been mined. Any quantitative use should state the snapshot used and should check the draft and preliminary-card states of the records involved, which are available as fields.

### 6.3 Dataset reuse under CC0

The data may be copied, modified, merged into other datasets and redistributed without permission and without a legal requirement of attribution. Plausible uses include reconciliation against Wikidata identifiers, gazetteer enrichment, the seeding of other reference works, and use as evaluation or retrieval material in natural language processing for Arabic, English and Urdu. A reuser who takes prose as well as data takes on the CC BY-SA 4.0 terms for the prose. A reuser who takes media must check each item's licence.

### 6.4 Template reuse under the code licence

The code is MIT-licensed, and the machinery is not specific to Islamic history: schemas, a predicate registry, a validator, a static site generator configuration, an API exporter and a set of written rules for AI tools. Another community could fork the repository, replace the records and the editorial rules, and build a comparable resource for another heritage. This has not, to the author's knowledge, been done; it is stated as a possibility that the licence permits.

### 6.5 Citation practice

A user of the dataset is asked to cite the dataset by its concept DOI (section 10), and, where the description or method in this paper is relied upon, to cite this paper as well. The two citations are distinct and serve different purposes: the first credits and locates the data, and the second credits and locates the description. For reproducible work, the version DOI of the snapshot used should be added in a note, in addition to and not in place of the concept DOI. CC0 imposes no legal duty to cite; the request is one of scholarly practice (Data Citation Synthesis Group, 2014).

## 7. Indexing and citation architecture

This section describes the mechanisms by which the resource is made citable and the metadata that are supplied. It makes no promise that any index will list the dataset or this paper: inclusion is decided by each index.

**Concept DOI policy.** The dataset has one concept DOI, used in every citation, and version DOIs used only to pin snapshots (section 3.7). The purpose is to keep citation counts on one identifier.

**ORCID.** The author's ORCID iD (Haak et al., 2012) is recorded in the creator metadata of the dataset record and of this paper, so that the DataCite metadata carry a name identifier that author-disambiguating indexes can use.

**DataCite metadata and related identifiers.** Zenodo registers each deposit with DataCite. The DataCite schema allows a record to declare typed relations to other identifiers (DataCite Metadata Working Group, 2024). Version records of the dataset declare `IsVersionOf` the concept DOI. This paper's record will declare that it cites and describes the dataset's concept DOI, and the dataset record can in turn declare that it is described by this paper once the paper's DOI exists. These relations are the machine-readable form of the link between paper and data.

**Citation files.** The repository keeps the dataset's Zenodo deposit metadata in a `.zenodo.json` file. A `CITATION.cff` file in the Citation File Format (Druskat et al., 2021) accompanies this paper, and gives the paper's citation metadata in a form that code-hosting platforms and reference managers read.

**Structured data on the site.** Record pages on the site carry schema.org structured data typed by class, and the site and its developer page state the dataset DOI in text.

**OpenAIRE.** OpenAIRE aggregates metadata from repositories, including Zenodo, into the OpenAIRE Graph and links publications to datasets on the basis of the relations declared in their metadata (Manghi et al., 2019). Zenodo deposits enter this aggregation without action by the depositor.

**OpenAlex.** OpenAlex is an open index of scholarly works, authors, sources and institutions (Priem et al., 2022). To our understanding it draws on DOI registration metadata, DataCite's among them, so that a Zenodo-deposited preprint with complete metadata is a candidate for ingestion as a work linked to an author by ORCID. Whether and when a given record appears is not under the depositor's control.

**Google Scholar and Semantic Scholar.** Google Scholar indexes scholarly articles and sets out, in its inclusion guidelines, what it needs in order to do so: a page per article, bibliographic meta tags in a supported vocabulary, and the full text in a file that begins with the title and the authors (Google Scholar, n.d.). Semantic Scholar likewise builds its graph from scholarly papers (Kinney et al., 2023). A dataset record is not an article, and neither service is designed primarily to index one. This is the practical reason why a dataset needs a scholarly text: a paper that describes the dataset and cites it by DOI is an object of the kind these services index, and its reference list is the route by which a citation to the dataset can be recorded. A paper deposited as a preprint supplies the conditions for indexing; it does not guarantee it.

**Attention tracking.** Services that track online attention to research do so by matching mentions in tracked sources to identifiers such as DOIs (Altmetric, n.d.). No attention score is claimed for the dataset or for this paper.

## 8. Limitations

1. **Youth.** The site was launched on 11 October 2026. The resource has existed in public for about five weeks at the date of this paper. Its rules, counts and structure are still changing.
2. **Draft majority.** 81.1% of content records are drafts on the repository basis.
3. **AI authorship.** The records were written by AI tools. Language models produce fluent text that can be wrong, can misattribute, and can cite a source that does not support the statement. The gates of section 4.5 do not detect such errors.
4. **No human-reviewed corpus.** No part of the corpus is claimed to have been reviewed by a human editor, and `published` does not mean reviewed.
5. **Preliminary cards.** 20.5% of content records are Wikidata-import cards with unchecked sources and, in many cases, placeholder citations.
6. **Partial book grounding and dependence on tertiary sources.** 55.1% of content records cite a book. A large share of source records are Wikipedia or Wikidata pages.
7. **No claim-level audit yet.** The protocol of section 5.3 has not been run. The accuracy of the resource is at present unmeasured.
8. **Coverage reflects the sources mined.** The graph contains what has been extracted so far from the sources read so far. Absence of a record or a relation is not evidence of absence in history, and counts derived from the graph are not historical statistics.
9. **Frame.** The default frame is Sunni, by stated editorial policy. Other traditions are admitted and labelled, but their coverage is not claimed to be equal.
10. **Incomplete language parity.** Some features are not available in all three languages; the Grand Tour has no Urdu edition. Translations are machine-produced and unreviewed.
11. **Single maintainer.** The resource depends on one person for rules, decisions, merging, deployment and funding. There is no organisation, board or editorial committee.
12. **No user study.** No formal study of users, learners or classroom use has been made.
13. **Measurement method.** The repository-basis counts come from pattern matching over files, not from a parse of the graph, and carry the small imprecision described in section 3.1.
14. **Licence metadata on the archive.** The Zenodo record's licence field states CC0 for an archive that also contains CC BY-SA 4.0 prose and MIT code (section 3.8).
15. **No independent citations.** No formal academic papers or preprints citing the dataset DOI were known at the time of writing.

## 9. Ethics, governance and independence

**Governance.** islam.museum is a personal, non-profit project of the author. It is not a business. It has, at the date of this paper, no legal organisation and no board; incorporation as a non-profit organisation in Ontario is planned and has not taken place. Decisions rest with the author as founder, and decisions of judgement are recorded in a decision ledger in the public repository, so that they can be inspected.

**Independence.** The project is independent. It is not merged into, governed by, or subordinate to any other project, any government, or any religious institution, and it does not speak for any of them. Collaboration with libraries, museums, schools and scholars is welcomed, and is limited to content, recognition and mutual help; it does not extend to governance or editorial control.

**Preservation and recognition.** Two facts are stated exactly. Library and Archives Canada took islam.museum into its web-preservation scope on 4 November 2026 and proposed a test crawl, which the author accepted. An application to the Digital Public Goods Alliance (application GID0094424) was submitted on 17 October 2026 and is under review; the project is not listed in that registry. No other recognition is claimed.

**Anti-hate position.** The museum describes and does not prescribe. Its rules forbid the museum's own voice from characterising any person or group as an enemy; acts are described and judgements are attributed to those who made them. It carries no propaganda material of designated terrorist organisations (section 4.7). Opponents, critics and allies in the history it describes are all included, and disputed questions are presented with at least two cited voices and no verdict.

**Sensitive data.** Religious affiliation of persons is recorded only under the rules of section 4.7. The site has no visitor accounts.

**Use of sources.** Sources in copyright are read and paraphrased with citation; their texts are not redistributed, and quotation is limited to forty words.

## 10. Data availability

The dataset is openly available.

- **Dataset concept DOI (cite this):** https://doi.org/10.5281/zenodo.23692511
- **Repository:** https://github.com/amado2k5/islam-museum
- **API:** https://api.islam.museum/api/v1/
- **Site:** https://islam.museum

**How to cite the dataset** (preferred citation):

> Abdel Aal, A. (2026). *islam.museum — an open digital museum of Islam* [Data set]. Zenodo. https://doi.org/10.5281/zenodo.23692511

**Reproducibility note.** The archived snapshot nearest to the analysis in this paper is release v2026.11.15, DOI 10.5281/zenodo.24246204. This is a version DOI used only to pin the analysed snapshot; cite the concept DOI above. The repository-basis figures were measured at git commit `63475724ce`, which may differ slightly from the archived snapshot of the same date.

**How to cite this paper:**

> Abdel Aal, A. (2026). *islam.museum: A Citable Open Knowledge Graph and Digital Museum of Islamic History — Resource Description, Method and Validation State* (v1.0) [Preprint]. Zenodo. https://doi.org/10.5281/zenodo.24273663

The two citations are different. The first refers to the data. The second refers to this text.

## 11. Code availability

All code is in the repository at https://github.com/amado2k5/islam-museum under the MIT licence: the validation scripts, the measurement script used for this paper (`scripts/report/claims_audit.py`), the site, the API exporter and the workflows. Citation metadata for this paper are supplied in a `CITATION.cff` file deposited with it.

## 12. Author contributions

Ahmed Abdel Aal is the sole author. He conceived the project, designed the data model and the editorial rules, directed the AI tools that compiled the resource, decided doubtful cases, merged and deployed all changes, and is responsible for this paper and for every claim in it.

## 13. Competing interests

The author is the founder of the project described in this paper and has an interest in its recognition. He has no commercial interest in it. The project is non-profit and personally funded.

## 14. Funding

The project is personally funded by the author. It has received no grant funding. As an indication of scale, and not as an audited statement, the project's own Support page reports running costs of about CA$1,900 in a recent month, of which about CA$900 was for AI assistants, in addition to about CA$90 for hosting.

## 15. AI-use disclosure

AI tools were used in the making of the dataset and in the writing of this paper.

**In the dataset.** As section 4.4 describes, AI tools researched, extracted, drafted, translated and cross-checked the records, wrote much of the code, and generated illustrations that the site labels as AI-generated. Each record's provenance block names what generated it.

**In this paper.** An AI assistant (a large language model) was used, under the author's direction, to gather the figures from the repository and the project's claims ledger, to check the bibliographic details of the references against DOI registration metadata, to draft the text, and to check the draft for unsupported claims. The author supplied the facts and the limits of what could be claimed, and reviewed the text.

AI systems are tools and are not authors of this paper. They cannot take responsibility for it. The author is solely responsible for the claims made here and for any errors.

## 16. Background and timeline

The idea of the project dates from August 2025, and it was first prototyped under the name timelinethis.app using Google AI Studio. The domain islam.museum was registered, and the site publicly launched, on 11 October 2026.

## References

Altmetric. (n.d.). *How does it work?* Retrieved 15 November 2026, from https://www.altmetric.com/about-us/our-data/how-does-it-work/

Abdel Aal, A. (2026). *islam.museum — an open digital museum of Islam* [Data set]. Zenodo. https://doi.org/10.5281/zenodo.23692511

Data Citation Synthesis Group. (2014). *Joint Declaration of Data Citation Principles* (M. Martone, Ed.). FORCE11. https://doi.org/10.25490/a97f-egyk

DataCite Metadata Working Group. (2024). *DataCite Metadata Schema Documentation for the Publication and Citation of Research Data and Other Research Outputs v4.5*. DataCite. https://doi.org/10.14454/g8e5-6293

Druskat, S., Spaaks, J. H., Chue Hong, N., Haines, R., Baker, J., Bliven, S., Willighagen, E., Pérez-Suárez, D., & Konovalov, A. (2021). *Citation File Format* (Version 1.2.0). Zenodo. https://doi.org/10.5281/zenodo.1003149

European Organization for Nuclear Research, & OpenAIRE. (2013). *Zenodo*. CERN. https://doi.org/10.25495/7gxk-rd71

Google. (n.d.). *Google Arts & Culture*. https://artsandculture.google.com/

Google Scholar. (n.d.). *Inclusion guidelines for webmasters*. Retrieved 15 November 2026, from https://scholar.google.com/intl/en/scholar/inclusion.html

Haak, L. L., Fenner, M., Paglione, L., Pentz, E., & Ratner, H. (2012). ORCID: a system to uniquely identify researchers. *Learned Publishing*, 25(4), 259–264. https://doi.org/10.1087/20120404

Hogan, A., Blomqvist, E., Cochez, M., d'Amato, C., de Melo, G., Gutierrez, C., Kirrane, S., Labra Gayo, J. E., Navigli, R., Neumaier, S., Ngonga Ngomo, A.-C., Polleres, A., Rashid, S. M., Rula, A., Schmelzeisen, L., Sequeda, J., Staab, S., & Zimmermann, A. (2021). Knowledge graphs. *ACM Computing Surveys*, 54(4), 1–37. https://doi.org/10.1145/3447772

Isaac, A., & Haslhofer, B. (2013). Europeana Linked Open Data – data.europeana.eu. *Semantic Web*, 4(3), 291–297. https://doi.org/10.3233/SW-120092

Kinney, R., Anastasiades, C., Authur, R., et al. (2023). *The Semantic Scholar Open Data Platform*. arXiv. https://doi.org/10.48550/arXiv.2301.10140

KITAB. (n.d.). *KITAB: Knowledge, Information Technology, and the Arabic Book*. Retrieved 15 November 2026, from https://kitab-project.org/

Manghi, P., Bardi, A., Atzori, C., Baglioni, M., Manola, N., Schirrwagen, J., & Principe, P. (2019). *The OpenAIRE Research Graph Data Model* (Version 1.3). Zenodo. https://doi.org/10.5281/zenodo.2643199

Museum With No Frontiers. (n.d.). *Discover Islamic Art – Virtual Museum*. Retrieved 15 November 2026, from https://islamicart.museumwnf.org/

Nigst, L., Romanov, M., Savant, S. B., Seydi, M., & Verkinderen, P. (2025). *OpenITI: a Machine-Readable Corpus of Islamicate Texts* [Data set]. Zenodo. https://doi.org/10.5281/zenodo.3082463

Priem, J., Piwowar, H., & Orr, R. (2022). *OpenAlex: A fully-open index of scholarly works, authors, venues, institutions, and concepts*. arXiv. https://doi.org/10.48550/arXiv.2205.01833

Tanzil. (n.d.). *Tanzil: Quran text*. https://tanzil.net/

Vrandečić, D., & Krötzsch, M. (2014). Wikidata: a free collaborative knowledgebase. *Communications of the ACM*, 57(10), 78–85. https://doi.org/10.1145/2629489

Wilkinson, M. D., Dumontier, M., Aalbersberg, IJ. J., Appleton, G., Axton, M., Baak, A., Blomberg, N., Boiten, J.-W., da Silva Santos, L. B., Bourne, P. E., et al. (2016). The FAIR Guiding Principles for scientific data management and stewardship. *Scientific Data*, 3, 160018. https://doi.org/10.1038/sdata.2016.18

