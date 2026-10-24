# Proposal: authenticity policy (item-level acceptance)

Status: **internal code applied on 25 Oct 2026** (register `scripts/harvest/library/authenticity.yaml`, validator `scripts/check-authenticity.ts` run by `npm run validate`, harvester gate `scripts/harvest/library/authenticity_gate.py`). **Public page, footer and submission wording not applied**: they need the founder's sign-off labelled `submission-impacting`, see `docs/delegation/authenticity-page-draft.md`.
Date: 25 October 2026. Revised the same day to the item-level model.

## 1. Files this proposal touches

- Creates: this file only (docs).
- Later, if approved, each as a separate proposal and commit: a public page `authenticity` in each language; a footer link in `site/src/layouts/`; the item register (a new `docs/attribution.md` section, and a register file); the harvest-registry entries in `scripts/harvest/sources.yaml` where a harvest step uses them.

## 2. Intent

State, in public, how the museum gatekeeps its collection: it admits only material that is genuine to its title, its author, its source and what it claims to be. A book, article, image or artefact is admitted, labelled or refused as a whole. The gate is about identity and provenance. It is not a check that everything a work says is true, and it does not correct or rewrite what is inside an item.

## 3. What the policy does and does not do

- **It decides about the item as a whole**: who wrote it, whether the copy we hold is a copy of a real, identified edition or original, and where it came from.
- **It gatekeeps identity, not truth.** The gate asks whether a work is real and is what its title and author say it is, and whether the copy comes from the edition or institution it names. It does not ask whether each statement in the work is correct. Records keep the citation and provenance rules of `docs/agents/publication-standard.md`.
- **Fake and planted material is what the gate is for.** A work with a real-sounding title but different content, an invented author, a copy that does not match the edition it names, or a source that only appears on a blocklist is refused. The sample check in section 6 is how a copy's fidelity to its edition is tested.
- **Summaries are written by AI.** The museum does not reproduce the text of an item. It publishes a summary and a rewrite, generated with AI, with a `provenance` block naming the model and the item it summarises. The summary is not checked line by line.

## 4. Standards this follows

- **Islamic scholarship:** the isnad and rijal method (Ibn al-Salah, *'Ulum al-Hadith*) for judging authors and carriers; Muslim's introduction to *al-Sahih*, attributed to Ibn Sirin: "This knowledge is religion, so look at whom you take your religion from."
- **Museums:** the ICOM Code of Ethics for Museums (revised 2017), on documentation and provenance.
- **Documentation and data:** CIDOC CRM (ISO 21127) for object and document history; W3C PROV for tracing where an item came from.

## 5. The three decisions

Every item gets exactly one decision.

| Decision | When | What the public sees |
|---|---|---|
| **Accept** | The author is verified as Sunni **and** the item's authenticity is validated (section 6) | Shown in the collection as a Sunni work, with its edition and provenance |
| **Label** | The item is authentic but its author is non-Sunni, or the author's school is unverified | Shown in the collection with a visible label naming the school, or "school not verified". Never presented as the Sunni default |
| **Reject** | The item's authenticity cannot be validated, or it comes from a blocked source (section 7) | Not in the collection. Recorded in the register with the reason |

Non-Sunni works are labelled, not rejected, as `docs/scope.md` requires: other views are welcome and must be labelled. This is the founder's decision for the works already in the collection.

**Future books: the founder decides each one.** The three decisions above are the default, but for any book added from now on the founder chooses accept, label or reject by hand, and the reason is recorded in the register. The default does not bind that choice.

## 6. Validation of authenticity (the item, not its content)

An item is validated by one of these, recorded in the register:

1. **A named edition**: publisher, place, year and edition number, matched to a library catalogue, a national or university library record, or the publisher's own page.
2. **An institutional provenance**: the item is held by a library, archive or museum with a catalogue entry and an accession or shelf number.
3. **A manuscript or primary record** with a description by a recognised body.

Website copies are validated through the edition they copy, not by the website. The sample check in the earlier draft still applies to any digital copy: a random sample is compared with the named edition, and the result recorded. The sample tests whether the copy is the edition it claims to be. It does not review the item's content.

## 7. Sources of items: trust tiers

The tiers from the earlier draft apply to where an item was found, and to the sources used to check an author's school:

- **T1** named edition or primary record
- **T2** public institution (UN, EU, national and public libraries, government and state archives, Al-Azhar, the OIC bodies, the Muslim World League)
- **T3** academic and cultural (universities and `.edu`, museums, archives, theses, conference papers)
- **T4** reference (Wikipedia and Wikidata as pointers, newspapers for news facts)
- **T5** unclassified (blogs, personal sites, unlisted websites): leads only, cannot validate an item on its own

**Blocklist:** a site on a known phishing, malware or spam list (for example PhishTank, URLhaus, or Google Safe Browsing) is excluded, and anything found only there is rejected. Lists are checked by hand before each publication and the date is recorded.

## 8. Checking the author's school

An author is verified as Sunni, or as another school, from two independent T2–T4 sources, at least one of them an encyclopaedic or institutional reference, with the date checked. The rules from the earlier draft apply: Wikipedia and Wikidata are pointers, and an infobox entry is a stated claim, not proof. A school that cannot be verified is recorded as "not verified", and the item is labelled, not accepted.

## 9. Tracing

Every decision is one entry in the item register, with: a stable id; the item's title and author; the author's school and its evidence; the edition or provenance and its evidence; the carrier source (site or library) and its tier; the sample check, if one was made; the decision and its reason; the date; and whether an AI summary was produced for it.

## 10. Decisions for the founder

1. **Non-Sunni works.** Decided: label them. Future books are decided by the founder one by one (section 5).
2. **Unverified schools.** Should an item whose author's school is unverified be labelled, or held back until verified?
3. **AI summaries of items that are not yet validated.** Publish them with a "not yet validated" label, or do not publish them until the item is validated?
4. **Wikipedia's tier.** This draft keeps Wikipedia at T4. Confirm.
5. **Submissions.** This changes how items are accepted and labelled, so it is `submission-impacting` under gates section 3. The DPGA evidence map's sentence "the museum does not review its records and does not claim to" needs a precise rewording. The new wording should describe gatekeeping of identity and provenance for whole items, and say plainly that the gate does not check whether each statement in a work is true. The UNESCO dossier's "none has yet been marked reviewed by a person" and its "preliminary cards" paragraph need checking against the same change. The claims register (A.5) and the evidence map are updated in the same commit.
