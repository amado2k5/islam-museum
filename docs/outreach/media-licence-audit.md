# Media licence audit

_Record-by-record check of the licence claimed by every `data/media/*.yaml` record, so that the licensing answers in the DPGA application (GID0094424, `dpga-evidence-map.md` indicator 2) and the UNESCO dossier (`unesco-nomination-dossier.md`, "Licences") are true per record. First audit 17 October 2026. Re-run the counts with the command at the end before quoting them._

## 1. What was audited

On 17 October 2026 the repository held 471 media records. 284 named a Creative Commons licence or the public-domain mark; 187 carried the whitelist id `institution-open`, an entry in `schema/enums/licenses.yaml` that had no URL and no definition. All 187 pointed to one institution. This audit resolved the 187 against that institution's published terms, replaced the vague id with a precise one, and removed `institution-open` from the whitelist, the three JSON schemas that enumerate it (`media`, `passage`, `dataset`), the licence registry page and the harvester, since no record uses it any more.

## 2. Institutions and their terms

| Institution | Records | Image host | Terms page (checked 17 Oct 2026) | What the terms allow | Whitelist id now | Resolved |
|---|---|---|---|---|---|---|
| Victoria and Albert Museum, London | 187 | `framemark.vam.ac.uk` (IIIF Image API, via the V&A Collections API) | https://www.vam.ac.uk/info/va-websites-terms-conditions (section 3 "Explore the Collections", section 9 "APIs"; page last updated September 2026) | Free use for non-commercial purposes only; credit line "© Victoria and Albert Museum, London" required; digital reproduction at most 768 px on the longest side (section 3); API images must be displayed from the URL the API returns, never from a local copy, and API content must not be cached for more than four weeks (section 9.3); commercial use needs a paid licence from V&A Images (section 4). No Creative Commons licence is offered. | `VAM-NC` | 187 of 187 |

**Unresolved: none.** Every former `institution-open` record is now `VAM-NC`.

The V&A developer guide (https://developers.vam.ac.uk/guide/v2/welcome.html, "Licencing") says the collections data and images are made available under the website terms above, "in particular section 9.3". Neither page names a Creative Commons licence, so none of the 187 records may claim `CC0`, `PD`, `CC-BY` or `CC-BY-SA`.

## 3. What changed on each V&A record

- `license: institution-open` became `license: VAM-NC`. `VAM-NC` was appended to `schema/enums/licenses.yaml` with the terms URL; the enum is append-only, nothing was reordered.
- `attribution` now reads: "© Victoria and Albert Museum, London. Embedded by URL from the V&A IIIF image service, never copied, under the V&A website terms and conditions (non-commercial use only, credit required, 768 px maximum): https://www.vam.ac.uk/info/va-websites-terms-conditions". The credit line is the one section 3 and section 5 of the terms prescribe.
- The full-size `url` requests `!768,` instead of `!800,` from the IIIF service, so the image the page shows stays inside the 768 px digital limit of section 3. The `thumbnail` (`!200,200`) was already inside it. The `iiif_image` base URL is unchanged.
- Nothing else moved: the records never held a copy of the image (the site renders `<img src>` from the V&A's own URL, `site/src/components/Extras.astro`), which is what section 9.3 requires.

The harvester that produced these records, `scripts/harvest/objects/images.py`, now writes the same id, attribution and 768 px URL for any future V&A object.

## 4. The rest of the media set (not in scope, listed for the record)

| Licence id | Records | Where the images live | Institution's terms |
|---|---|---|---|
| `CC0` | 114 | `images.metmuseum.org` | The Metropolitan Museum of Art Open Access, CC0 |
| `CC0` | 110 | `openaccess-cdn.clevelandart.org` | Cleveland Museum of Art Open Access, CC0 |
| `CC0` | 4 | `upload.wikimedia.org` | Per-file licence on Wikimedia Commons, recorded on the record |
| `PD` | 32 | `upload.wikimedia.org` | Public-domain mark per file on Wikimedia Commons |
| `CC-BY-SA` | 15 | `upload.wikimedia.org` | Per-file licence on Wikimedia Commons |
| `CC-BY` | 5 | `upload.wikimedia.org` | Per-file licence on Wikimedia Commons |
| `CC0` | 4 | files in this repository (`media/`) | The museum's own illustrations and one map, CC0 |

These 284 records were not re-checked item by item in this audit; their ids were set by the harvesters from each institution's own open-access flag (`scripts/harvest/objects/images.py`, `scripts/harvest/objects/commons.py`).

## 5. What the outreach answers may say

- The museum's own layers are open: data CC0 1.0, prose CC BY-SA 4.0, code MIT. That is unchanged.
- Third-party media carry the licence their holder publishes, recorded per record against the whitelist `schema/enums/licenses.yaml`, with the terms URL on the record. 284 records are under CC0, the public-domain mark, CC BY or CC BY-SA.
- 187 photographs from the V&A are **not** under an open licence. They are linked, never copied, displayed from the V&A's own servers under the V&A's non-commercial terms with the required credit, and they are not part of the CC0 data or the CC BY-SA prose that the museum offers for reuse. A reuser of the museum's data receives the URL and the terms, not a licence to the image.
- The whitelist id `institution-open` no longer exists; do not quote it.

## 6. Re-running the counts

```bash
grep -h "^license:" data/media/*.yaml | sort | uniq -c
```

The licence registry page `/{lang}/licenses/` shows the same counts live, from the built graph.
