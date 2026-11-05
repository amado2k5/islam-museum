# Muslim Inventions Browser: research method

This plan follows [`docs/sources-policy.md`](../sources-policy.md), [`docs/agents/publication-standard.md`](../agents/publication-standard.md), [`docs/agents/content-standards.md`](../agents/content-standards.md) and the approved research brief. Any source may be read; facts are rewritten in the museum's own words with a defined citation. Copyrighted text, PDFs, OCR, page images, dumps, claim tables and unwhitelisted media stay outside Git.

## 1. Order for every lead

1. **Resolve the museum graph first.** Read the person's Arabic, English and Urdu records/prose; inspect their sources, faith block, tradition/perspectives, roles and occupations; inspect linked concepts, works, events, objects, places and existing media. Reuse records and aliases; do not duplicate them. Read every census prose hit as a lead.
2. **Check the maker.** Require a source-backed Muslim identity. Apply the Sunni default only when the cited source and Sunni milieu name no contrary tradition; record the explicit default basis. An attested other tradition is excluded; disputed tradition requires a Sunni-first perspectives block. Apply the modern-figures lane's two-independent-source faith requirement to modern figures.
3. **Establish the claim and contribution.** Identify whether it is a device, process, method, institution, discovery or transmission; identify the earliest source that supports the exact claim; name non-Muslim and earlier precursors. Popular claims are leads only.
4. **Read reference literature and primary sources.** Prioritize Hill and al-Hassan, Rashed, Sezgin, King, Saliba, Djebbar, Savage-Smith, Pormann, Watson and Decker, Bloom, Hillenbrand, and relevant EI2/EI3, DİA and Iranica entries. Read primary texts in Arabic where available and cite edition/page. Register each source entity before citing.
5. **Verify objects and media.** Search open museum catalogues for surviving examples, technique, accession number, creator, date and licence. Check the museum's existing image records first. If no suitable image exists, use only an asset that passes the illustrations pipeline; diagrams/maps are sourced/generated at build time and receive localized alt text.
6. **Modern records.** Prefer patent text and grant date, first paper/DOI, Nobel/IEEE citation, inventor's own account and a reliable biography for the identity basis. Do not count a product or company without a cited technical novelty.
7. **Write, cite, and log.** Every factual sentence has a source; write Arabic first, with English and Urdu in the same batch. Record uncertainty as status/perspectives, never as a verdict. Each record has provenance. Run validation and citation checks on every batch.

## 2. Founder-supplied starting resources

These are approved leads, not support for published invention claims. They are **not opened yet**; record the exact final URL and actual access date below only when opened. If blocked or dead, record the correction/reason and do not bypass access controls.

| Resource | URL to verify on first access | Access date |
|---|---|---|
| *1001 Inventions: The Enduring Legacy of Muslim Civilization* (al-Hassani, FSTC; Internet Archive editions) | Search Internet Archive by exact title; record the selected edition identifier and item URL | Not opened |
| CNN, “Muslim inventions that shaped the modern world” | `https://www.cnn.com/2010/WORLD/meast/01/29/muslim.inventions` | Not opened |
| National Geographic, “All of these inventions came from the spread of Islam” | `https://www.nationalgeographic.com/history/article/islam-inventions-spread-of-islam` | Not opened |
| History Hit, “9 Key Muslim Inventions and Innovations of the Medieval Period” | `https://historyhit.com/medieval-muslim-innovations` | Not opened |

When opened, walk the chapters/items, capture page numbers and queue every claim. The 1001 Inventions book's illustrations are copyrighted; locate the underlying object/manuscript instead. For each headline claim, follow the source back to literature, primary texts, collections or patents; cite the popular page as a voice only where relevant.

## 3. Source inventory and registration

The census output lists exact existing source-family counts. Reuse `source/encyclopaedia-of-islam-2` with its PDF-page anchors; reuse `source/tdv-*`, `source/iranica-*`, and suitable existing book, museum, patent, DOI and authenticity-ledger source records. Create one source entity per online reference article or object page where the museum's pattern requires it, including author, URL, date read, kind, access/open-access details and reliability note. EI2 article references use the shared EI2 source entity, with volume and page.

The measured tree has 31 `kind: treatise` work records across all subjects and 51 scientific-work leads, selected by links to scientific people/concepts or a `zij` genre. This is intentionally a candidate signal, not a relevance judgment. Existing relevant records include `work/kitab-al-manazir`, `work/al-zij-al-sabi`, `work/nuzhat-al-tullab-fi-ilm-al-asturlab`, `work/kitab-al-hisab-al-khwarizmi`, and `work/zij-al-sindhind-khwarizmi`. The exact-title scan found no work record for the al-Jazari mechanical-device book, the Banu Musa *Kitab al-Hiyal*, Taqi al-Din's *al-Turuq al-saniyya*, al-Zahrawi's *al-Tasrif*, or Ibn Majid's *al-Fawa'id*. Keep these as unverified work-record leads; resolve variants and bibliography before creating any stubs.

Potential starting literature: al-Hassan and Hill, *Islamic Technology*; Hill, *Islamic Science and Engineering* and the translations of al-Jazari and the Banu Musa; Rashed, *Encyclopedia of the History of Arabic Science*; Sezgin, *GAS* and the Frankfurt instrument catalogue; King's *In Synchrony with the Heavens*; Saliba on Maragha; Djebbar; Savage-Smith and Pormann; Watson and Decker; Bloom, *Paper Before Print*; Hillenbrand; and primary works listed in section 6.3 of the operative brief.

Before any download, register the item in `$HARVEST/sources.yaml` and create its working directory under `/Volumes/exmicroSD/islam-museum-harvest/inventions/<source-slug>/`. Keep PDFs, OCR, notes, page images and indexes there. Do not download copyrighted text when lawful access is unavailable; use a different source. Record blocked links and access limits in the harvest registry and this plan.

## 4. Wikipedia and Wikidata

Use the repository's harvest scripts and the broad rule in `docs/delegation/wikipedia-broad-rule-proposal.md`. Record the exact revision and ledger row. They are leads and may support only the narrow entity facts allowed by the rule (URL, website, author/work name, location, date or identifier); never use them for prose, a work's contents or a text's validity. No claim is published from a list page alone.
