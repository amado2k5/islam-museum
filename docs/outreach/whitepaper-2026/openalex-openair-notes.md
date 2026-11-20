# OpenAlex and OpenAIRE: what the metadata map to, and what is not guaranteed

Written 15 November 2026. Nothing here is a promise that either index will list the paper or the dataset. Each
index decides what it includes and when.

## The two objects

| | Paper | Dataset |
|---|---|---|
| Identifier | 10.5281/zenodo.24273663 | Concept DOI 10.5281/zenodo.23692511 |
| DataCite type | Text / Preprint | Dataset |
| Licence | CC BY 4.0 | Data CC0 1.0; prose CC BY-SA 4.0; code MIT (the Zenodo licence field currently says CC0 only) |
| Creator | Ahmed Abdel Aal, ORCID 0009-0000-9215-2906 | The same |

## OpenAlex

OpenAlex models scholarly output as works, authors, sources, institutions and topics (Priem, Piwowar and Orr, 2022,
https://doi.org/10.48550/arXiv.2205.01833).

| OpenAlex concept | What the paper's metadata supply | Note |
|---|---|---|
| Work | Title, abstract, publication date, DOI, type (preprint), licence, open-access PDF | Created only if OpenAlex ingests the DOI record |
| Author | Name and ORCID in the DataCite creator field | The ORCID is what lets OpenAlex attach the work to one author profile. Also add the paper to the ORCID record itself |
| Source | Zenodo, as the repository hosting the work | A preprint has no journal source until a journal version exists |
| Institution | Affiliation string "islam.museum (independent)" | Has no ROR identifier, so OpenAlex will probably leave the institution empty. That is correct: no institution should be claimed |
| Referenced works | The reference list in the PDF, and the `Cites` relation to the dataset DOI | Whether OpenAlex records a citation to a dataset DOI is its decision |
| Topics, keywords | Assigned by OpenAlex from the title and abstract | Not controlled by the depositor |

Automatic: registration of the DOI metadata with DataCite by Zenodo.
Not guaranteed: that OpenAlex ingests the record, how soon, how it classifies the type, and whether the dataset
itself appears as a work. The statement that OpenAlex draws on DataCite is the author's understanding and should be
confirmed in the OpenAlex documentation (https://help.openalex.org/) before it is repeated in a journal submission.

## OpenAIRE

The OpenAIRE Graph aggregates metadata about research products (publications, datasets, software, other) from
repositories and links them (Manghi et al., 2019, https://doi.org/10.5281/zenodo.2643199; documentation at
https://graph.openaire.eu/docs/).

| OpenAIRE requirement | State |
|---|---|
| Record in a harvested repository | Zenodo is harvested by OpenAIRE. No action by the depositor |
| Persistent identifier | DOI from Zenodo |
| Open access and a licence | Access right open; CC BY 4.0 for the paper |
| Author identifier | ORCID in the creator metadata |
| Typed link between the paper and the dataset | `Cites` and `Describes` from the paper to the dataset concept DOI; add `IsDescribedBy` on the dataset record after deposit |
| Funding or project link | None. The project has no grant; leave the funding field empty |
| Community | Optional. A Zenodo community (for example one for digital humanities) may be requested; acceptance is the curators' decision |

Automatic: harvesting of both Zenodo records; display of the link between them where the relations are declared.
Not guaranteed: the delay before the records appear, deduplication of versions, and the classification of the
dataset record.

## What the author should do, and what not to do

- Reserve the paper DOI on Zenodo, print it in the PDF, then publish.
- Add the paper to the ORCID record (ORCID can import it from DataCite).
- Add the reciprocal relation on the dataset record.
- Do not create duplicate records, duplicate author profiles or self-citation chains to raise counts.
