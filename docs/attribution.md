# Attribution and data sources

The museum's structured data is CC0 and its prose CC BY-SA 4.0 (see `LICENSE-CONTENT.md`). Facts and identifiers drawn from the sources below are used under their licences, which require this attribution. The licence layers and what each may feed are in `docs/plan/15-local-harvest.md` §3 and §11.

| Source | Licence | Used for |
|---|---|---|
| [Tanzil Project](https://tanzil.net), Qur'an text v1.1 | Tanzil terms of use: verbatim copies only, source indicated, link to tanzil.net, notice kept | The text of every `passage/quran-*` record, byte for byte (`data/work/quran-source/`) |
| [GeoNames](https://www.geonames.org) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | Place identifiers (`external_ids.geonames`), coordinates and alternate names used for reconciliation |
| [Pleiades](https://pleiades.stoa.org) gazetteer of ancient places | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) | Place identifiers (`external_ids.pleiades`) and ancient names used for reconciliation |
| [Wikidata](https://www.wikidata.org) | CC0 1.0 | Identifiers, labels, dates and relations for seed entities |
| [The Metropolitan Museum of Art Open Access](https://github.com/metmuseum/openaccess) | CC0 1.0 | Object metadata (Islamic Art department); images only where the record is marked public domain |
| [OpenITI Makhzan](https://zenodo.org/records/19861912) 2026.1.2 | CC BY-NC-SA 4.0 | Mined for facts and bibliographic leads with short quotations; the text is never republished |
| Wikipedia (all languages) | CC BY-SA 4.0 | Discovery and context only; never merged into the CC0 data and never cited as a source |
