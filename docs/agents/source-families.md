# Source families beyond books: where enrichment looks

_The book library (`scripts/harvest/library/`) is one shelf. The corpus cannot be completed from books alone — whole classes (5,460 buildings missing prose, 490 objects, the works backlog) have no mineable book, and the facts that date a building or a reign live in inscriptions, coins, documents and catalogues, not narratives. This catalogue is the standing answer to "where else do we look": the families an enriching agent may use, the ones to onboard next, the ones to explore, and the criteria for judging any new resource before it is touched._

## Registration comes first (no exceptions)

A family is usable only when it is **registered**, in one commit:

1. an entry in the harvest registry `scripts/harvest/sources.yaml` — licence, layer, method, limits (`scripts/harvest/common.py` refuses to run for an unregistered source);
2. a `data/source/<family-id>.yaml` entity with a `reliability_note` (the validator refuses a `{cite:}` whose source entity does not exist);
3. a row in `docs/attribution.md`.

Citation form for every family: `{cite:<family-id> <anchor>}`, where the anchor is the family's own stable identifier for the item — a site id, an inscription number, an object number, a property number, a document id — so a reader reaches the evidence in under a minute. Facts never lift text: the museum republishes facts (`data/`, CC0) in its own words with the citation; a family's text and images are ingested only where its licence clearly allows it. **Non-commercial (NC) families are facts-only, permanently**: cite them for facts with attribution; their text and images never enter the corpus, because NC terms do not compose with CC0/CC BY-SA.

## Tier R — registered (usable today)

| Family | Id | What it gives | Limits |
|---|---|---|---|
| Wikidata | `source/wikidata` | Identifiers, labels, dates, capitals, succession — the graph's skeleton | Pointer tier: locates and disambiguates; never the preferred citation where a real source exists |
| GeoNames | `source/geonames-gazetteer` | Place names, coordinates | Pointer tier, same rule |
| Met Open Access | `source/met-open-access` | CC0 object records (kind: reference_data) | Cite by object id |
| Tanzil | `source/tanzil-quran`, `source/tanzil-translations` | The frozen Qur'an corpus | The **only** source of Qur'an text; never typed by hand |
| Assabile lecture archive (Omar Abdelkafy, 25 series, about 620 lessons, audio and video) | `source/assabile-omar-abdelkafy` | The speaker's own recorded lessons: what he teaches, narrates and says, with dates he gives as his statements | Treated exactly like a book (founder, 25 Oct 2026): full details and full prose, in the museum's own words, cited by series/episode + timestamp. Audio and transcripts never republished. Method: `audio-video-harvest.md` |

Pleiades (ancient places gazetteer, CC BY 3.0) is in the harvest registry and `docs/attribution.md` as a pointer, but has no `data/source/` entity yet — register one before citing it.

## Tier 1 — current (onboard in this order)

Access and licence postures verified against the providers' own pages on 24 Oct 2026; re-verify at onboarding and record the date on the source entity.

| Family | Where | What it unlocks | Licence posture / anchor |
|---|---|---|---|
| **Archnet** (Aga Khan Trust for Culture / MIT) | archnet.org | ~9,078 site records, ~6,415 authority names, 100k+ resources — the single biggest unlock for the 5,460 prose-missing buildings | Fully open access since 2013, no login; facts + own prose fine, item image rights vary (no image ingestion). Anchor: site slug/id |
| **Thesaurus d'Épigraphie Islamique** (Fondation Max van Berchem) | epigraphie-islamique.org | The comprehensive corpus of Arabic/Turkish/Persian inscriptions with editions — foundation inscriptions are primary evidence and the best dating source for buildings | Free to consult. Anchor: inscription number |
| **UNESCO World Heritage Centre** | whc.unesco.org (per-property Documents) | Nomination files and ICOMOS evaluations: expert-written, dated, sourced property dossiers | Public documents. Anchor: property number. (A published source like any other — it implies no relationship with UNESCO.) |
| **Museum collections, per collection** | the holding museum's own collection site | Object records with provenance, dates, inscriptions — the 490-object backlog and object prose generally | Confirm per collection at onboarding. **British Museum: CC BY-NC-SA 4.0 → facts-only.** Met is CC0 (Tier R). Also evaluate: V&A, Khalili Collections, the David Collection, MIA Doha, Aga Khan Museum. Anchor: object number |

## Tier 2 — current (second wave)

| Family | Where | What it unlocks | Notes |
|---|---|---|---|
| **Arabic Papyrology Database** (LMU Munich / Zurich / Vienna, ISAP) | arabicpapyrology.org | 13,543 documents (full texts 4,455): letters, contracts, tax receipts — everyday life for Fustat, practice, events | Free; Trismegistos ids as anchors |
| **Princeton Geniza Project** | geniza.princeton.edu | 4,350+ transcribed Cairo Geniza documents — Mediterranean trade, Fustat daily life, the Sicily route | Open access; metadata published on Zenodo (2025, v1.0.0) — machine-harvestable |
| **Zeno — Oriental Coins Database** | zeno.ru | Coin records with stable ids, cross-referenced to Album/Tye/Mitchiner: legends, mints, dates for polities and rulers | **Weakest scholarly tier**: cite legend/mint/date only, paired with the published catalogue reference it names |
| **Manar al-Athar** (Oxford) | manar-al-athar.arts.ox.ac.uk | 83,000+ photographs of Islamic archaeology sites with identifications | CC BY-NC-SA 2.0 UK → **facts-only**; use as evidence for what stands where, never ingest images |
| **Manuscript catalogues** | Qatar Digital Library (qdl.qa); HMML (hmml.org) | Colophons, ownership notes, dated copies — the hard facts behind 1,153 prose-missing works | QDL free; HMML free with registration. Anchor: shelfmark |
| **MWNF / Discover Islamic Art + Qantara** | museumwnf.org; qantara-med.org | Curated object/monument records across the Mediterranean (overlaps the Sicily material directly) | Terms to confirm at onboarding |

## Tier 3 — pointers and orientation (never carry a claim alone)

Getty Thesaurus of Geographic Names / ULAN (getty.edu/research) · al-Thurayya gazetteer · *Encyclopaedia Iranica* (iranicaonline.org — orientation and bibliography) · *Encyclopaedia of Islam* (paywalled — orientation only, where lawfully accessed). Use these to find the trail and the bibliography; the claim itself cites a Tier R/1/2 source or a book.

## Future — explore (not verified; score with the criteria before any use)

- **Classical text corpora beyond the drive**: al-Maktaba al-Shamela, the full OpenITI corpus (extend the existing `scripts/harvest/openiti/`), al-Waraq, Hindawi open books, Noor Book — more of the classical library in machine-readable form.
- **Manuscript collections**: Walters Art Museum (open-access manuscripts), Chester Beatty digital collections, BnF Gallica, Staatsbibliothek Berlin Orient Digital, Leiden Digital Collections, Princeton Islamic manuscripts, Cambridge Digital Library, Süleymaniye digital library, the British Library's Endangered Archives Programme.
- **Numismatics beyond Zeno**: Nomisma.org and the ANS MANTIS database, the Tübingen Sylloge Nummorum Arabicorum, the Fitzwilliam and Ashmolean online collections.
- **Epigraphy beyond the Thesaurus**: the printed *Répertoire chronologique d'épigraphie arabe* (RCEA) and the Corpus Inscriptionum Arabicarum.
- **Documents beyond APD/PGP**: Papyri.info (the Duke Databank), the Cambridge Taylor-Schechter Geniza unit, the Friedberg Geniza Project.
- **Archaeology and sites**: the EAMENA database (Oxford), MEGA-Jordan, ASOR Cultural Heritage Initiatives, iDAI.gazetteer.
- **Historical maps and photographs**: the David Rumsey Collection, the Perry-Castañeda Library Map Collection, Gallica's map holdings.
- **The modern century** (oral histories, institutional and state records — Qatar Digital Library oral histories, the Arab Image Foundation, Egypt's Dar al-Watha'iq, the Ottoman State Archives' digital portal, university archives at AUB and AUC): usable only after a consent, attribution and right-of-reply protocol exists for living memory. Do not start here.
- **Discovery aggregators** (for finding the above, not for citing): the OpenGLAM directory, MENALIB (Halle), Zenodo communities, OpenAlex and CORE (scholarship), GitHub topic search (`islamic-history`, `arabic-corpus`, `digital-humanities`).

## The criteria: how to judge any candidate resource

Score a candidate against all eight before proposing registration; write the score in your lane's progress file.

1. **Authority.** Published by a university, museum, national library or a scholarly project with named specialists — not an anonymous aggregator.
2. **Citability.** Every item carries a stable identifier and a page a reader can open in under a minute. No stable id, no citation, no use.
3. **Terms you can state in one line.** A public terms/licence page exists and you record its posture honestly: open / facts-only (NC) / link-only / orientation-only. If the terms are unclear, the default is facts-only; if they forbid reuse, link-only.
4. **Structure.** Machine-readable, an API or bulk download, or clean OCR — a human clicking through pages one by one is not a harvest method.
5. **Coverage fit.** Name the queue it feeds (which class, which completeness gap, roughly how many records). A resource that fills no named gap is a distraction.
6. **Corroboration value.** It supplies the kind of evidence the corpus lacks: inscriptions for dates, coins for mints and reigns, documents for everyday life, catalogues for objects and works.
7. **Arabic-first value.** Arabic content or Arabic metadata preferred; a family that only duplicates the English-language web adds little.
8. **Longevity.** Institutional hosting and stable URLs; if it vanished tomorrow, the citations already in the corpus must still make sense (record id + institution, not a bare URL).

**Triage workflow**: find → score (in the progress file) → draft the registration block (registry entry, source entity with `reliability_note`, attribution row) → register in one commit → pilot on 10 records → report the yield (records enriched, facts sourced) in the progress file → continue or drop, and say which.

**Where to hunt for new families**: curated directories first — the OpenGLAM open-access list, MENALIB's digital-resources pages, university Islamic-studies library guides (McGill, Oxford and peers), the DARIAH/CLARIN project catalogues; then scholarly channels — H-Net announcements, digital-project reviews in the field's journals, museum open-access announcements; then aggregators — Zenodo, GitHub topics, OpenAlex. Verify everything on the provider's own pages, never on a third-party summary, and record the verification date on the source entity when you register it.
