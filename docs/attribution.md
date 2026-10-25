# Attribution and data sources

The museum's structured data is CC0 and its prose CC BY-SA 4.0 (see `LICENSE-CONTENT.md`). Facts and identifiers drawn from the sources below are used under their licences, which require this attribution. Since 15 October 2026 any source may be read and rewritten in the museum's own words with a citation (`docs/sources-policy.md`); the licence layers of `docs/plan/15-local-harvest.md` §3 record provenance and no longer decide what may enter `data/`.

| Source | Licence | Used for |
|---|---|---|
| [Tanzil Project](https://tanzil.net), Qur'an text v1.1 | Tanzil terms of use: verbatim copies only, source indicated, link to tanzil.net, notice kept | The text of every `passage/quran-*` record, byte for byte (`data/work/quran-source/`) |
| [GeoNames](https://www.geonames.org) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | Place identifiers (`external_ids.geonames`), coordinates and alternate names used for reconciliation |
| [Pleiades](https://pleiades.stoa.org) gazetteer of ancient places | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) | Place identifiers (`external_ids.pleiades`) and ancient names used for reconciliation |
| [Wikidata](https://www.wikidata.org) | CC0 1.0 | Identifiers, labels, dates and relations for seed entities |
| [The Metropolitan Museum of Art Open Access](https://github.com/metmuseum/openaccess) | CC0 1.0 | Object metadata (Islamic Art department); images only where the record is marked public domain |
| [OpenITI Makhzan](https://zenodo.org/records/19861912) 2026.1.2 | CC BY-NC-SA 4.0 | Read and rewritten in the museum's own words with citations to the underlying works; quotations at most 40 words; the corpus text itself is never republished |
| Wikipedia (all languages) | CC BY-SA 4.0 | Discovery and context; may be read and its leads followed; not cited as a source (a reliability rule, not a licence rule) |
| [Assabile](https://www.assabile.com/omar-abdelkafy), lecture archive of Omar Abdelkafy (audio and video) | No licence statement found on the site (checked 25 Oct 2026); robots.txt does not disallow the lessons or the media host; used under the founder's instruction | Facts about the speaker's work and what he says, cited by series, episode and timestamp (`source/assabile-omar-abdelkafy`); audio and transcripts never republished (`docs/agents/audio-video-harvest.md`) |
| [Encyclopaedia of Islam, 2nd edition](https://archive.org/details/ei2-complete) (Brill, 1954–2008), copy on archive.org | Brill copyright; not verified as public domain. Read and rewritten in the museum's own words, each fact cited by volume and PDF page; quotations at most 40 words; the text itself is never republished |
