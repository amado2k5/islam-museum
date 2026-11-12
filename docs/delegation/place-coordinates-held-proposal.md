# Proposal: the place records the map cannot draw

Status: **proposal, held for the founder. Nothing in sections 3 to 5 is applied.** Written 11 November 2026 by Claude Code (claude-fable-5-2), run `place-coordinates-2026-11-11`.
Risk label (`docs/ai-change-gates.md` section 3): the edits already made (section 2) are `non-impacting`. Several recommendations below would merge or retire records and are `submission-impacting`; each is marked.

## 1. What this is about

The review of the Place wing map (`docs/site/place-map-review.md`) found 22 place records the map cannot draw. Fourteen carried the placeholder coordinates `[0, 0]`, which is a point in the Gulf of Guinea. Eight had no coordinates and no related place that has any.

The cause of the fourteen placeholders is the same in every case: the person-place enrichment run (`person-place-geo-a`) created a place for each Wikidata item a person links to, and wrote `[0, 0]` when the item had no coordinate claim. I read all sixteen Wikidata items behind these records on 11 November 2026. None of them has a coordinate claim (P625). For the real places, none of the Wikipedia articles linked from the item gives coordinates either.

Each record was read with its sources and put in one of four groups:

| Group | Records | What was done |
|---|---|---|
| A. A real place, and a citable source gives its position | 4 | Coordinates recorded (section 2) |
| B. A real place, but no registered source gives its position | 4 | Unchanged; held (section 3) |
| C. A legendary or unlocatable place from the geographers | 6 | Unchanged; held (section 4) |
| D. Not a place, or a placeholder | 8 | Unchanged; held (section 5) |

No record was removed, merged or reclassified. No placeholder was removed without a real position to put in its place.

## 2. Group A: fixed (4 records)

| Record | Coordinates | Precision | Source | Region tag |
|---|---|---|---|---|
| `place/buhut` | 31.17058, 31.32726 | locality | GeoNames 358693, Buhūt, populated place, Dakahlia, Egypt | `egypt-nile` |
| `place/samail` | 23.29838, 57.9531 | locality | GeoNames 286590, Samā’il, populated place, Ad Dakhiliyah, Oman | `arabia` |
| `place/jabal-amel` | 33.16667, 35.36667 | approx | GeoNames 278960, Jabal ‘Āmil, mountains, Nabatieh, Lebanon. One representative point for a region with no fixed boundary | `levant-iraq` |
| `place/al-wardya-cemetery` | 33.35056, 44.40194 | approx | The point of the mosque of Shaykh Umar al-Suhrawardi (Wikidata Q28716432 at revision 2468638431), which stands inside the cemetery according to Arabic Wikipedia at revision 70599944 | `levant-iraq` |

GeoNames is a registered source family for coordinates (`docs/agents/source-families.md`, `source/geonames-gazetteer`; 1,024 place records already refer to it). Each read has a page in `docs/authenticity-ledger/pages/` (`geonames-buhut`, `geonames-samail`, `geonames-jabal-amel`, `wikidata-al-wardya-cemetery`, `wikipedia-al-wardya-cemetery-ar`), and the identity of each GeoNames entry was checked against the record's Wikidata item and, for the two villages, the Arabic Wikipedia article.

One judgment call was made and is recorded in the decision ledger as `dec-20261112-239`: the cemetery has no coordinates of its own in any registered source, so it takes the point of the mosque that a cited source places inside it, marked `approx`, with a note saying so. The rule I set for myself: another feature's point may stand for a place only when a cited source puts that feature inside the place. A containing city or a nearby landmark is not enough; those cases are group B.

Two things on these four records are wrong but were left alone, because changing them is a reclassification:

- `place/jabal-amel` has `kind: town`. It is a region of southern Lebanon. Recommended: `kind: region`.
- `place/al-wardya-cemetery` has the English label "Al wardya Cemetery" (as on Wikidata). Recommended: "Al-Wardiyya Cemetery (Shaykh Umar Cemetery), Baghdad".

## 3. Group B: real places with no citable position (4 records, held)

These places exist and their city is known. No registered source (Wikidata, Wikipedia, GeoNames) gives a position for the site itself, so no coordinates were written. They still carry `[0, 0]`.

| Record | What it is | What the sources say about where it is | Recommendation | Why |
|---|---|---|---|---|
| `place/fadl-mosque` | An Ottoman-period mosque in Baghdad holding the tomb of Shaykh Muhammad ibn al-Fadl. One person is recorded as buried there | Wikidata Q28716442 (revision 2456011109): Iraq, Baghdad; no coordinates. Arabic Wikipedia (revision 70599933): in the Fadl quarter on the al-Rusafa side; the coordinates field of its infobox is empty. The quarter's own item (Q12209409) has no coordinates. GeoNames has no entry for the mosque or the quarter | Approve one of the options under the table. Also: region tag `levant-iraq` | The mosque is real and in Baghdad; only its position inside the city is unsourced |
| `place/grave-of-al-ghazali` | The al-Ghazali cemetery of Baghdad, an old cemetery with a domed tomb known as "the tomb of al-Ghazali"; the article says it is not known who lies in it. One person is recorded as buried there | Wikidata Q6866071 (revision 2459953762): Iraq; no coordinates. Arabic Wikipedia (revision 70599663): on the al-Rusafa side, just outside the Bab al-Sheikh quarter, on Sheikh Omar Street, near the Wardiyya cemetery; its infobox latitude and longitude are empty. GeoNames has no entry | Approve one of the options under the table. Also: region tag `levant-iraq`; `kind: site` in place of `town`; English label "Al-Ghazali Cemetery, Baghdad" | The record is a cemetery, but its English label "Grave of al - Ghazali" reads as one man's grave, and a reader will think of the theologian. "Near" two landmarks does not pin a point |
| `place/al-nawbakhti-shrine` | The shrine in Baghdad of al-Husayn ibn Ruh al-Nawbakhti (d. 937), third of the four deputies in Twelver Shi'i belief. One person is recorded as buried there | Wikidata Q132675093 (revision 2367686602): no country, no coordinates. English Wikipedia (revision 1366946839): in al-Rusafa, between the Shorja market and al-Rashid Street; the article is tagged "coordinates missing". GeoNames has no entry | Approve one of the options under the table. Also: region tag `levant-iraq` | "Between" two streets does not pin a point |
| `place/sirwan` | A locality near Rayy where the Abbasid prince al-Mahdi built and where his son al-Hadi was born in 146 AH. One person (al-Hadi) is recorded as born there | Wikidata Q133570299 (revision 2448717814): Iran; no coordinates. Arabic Wikipedia (revision 69973542), citing Yaqut 3:296-297: a place near the city of Rayy, distinct from the Sirwan of Masabadhan | Keep without a point unless option 2 is approved (then Rayy's point, `approx`). Also: region tag `persia-central-asia`; `kind: site` in place of `town` | The site is not identified on the ground; the source says only "near Rayy" |

Options for the founder, for all four:

1. **Leave them off the map and remove the placeholder `[0, 0]`** (with `coordinate_precision` and the old `coordinate_note`). The record then says nothing false. The map can place a record with no coordinates by a related place once a `located_in` edge to `place/baghdad` or `place/rayy` is added from the same Wikidata and Wikipedia revisions.
2. **Place them at their city's point, marked `approx`**, with a note such as "Baghdad city point; the site stands in the Fadl quarter; exact position not sourced". The golden set already does this for 55 records ("Approximate region-center placement; exact site unlocated"). The cost: three Baghdad sites and the Wardiyya cemetery's neighbours would sit on one pin, which a reader may take for a real position.
3. **Onboard a source that gives positions for buildings**, for example OpenStreetMap (ODbL; facts-only use fits the source policy), through `docs/agents/source-families.md`. This is the only option that yields true site-level points. The Arabic article on the Wardiyya cemetery itself cites a Wikimapia page, which shows that such positions exist outside the registered families.

My recommendation: option 1 now, option 3 as the lasting fix. Option 2 is honest if labelled, but it adds little for a reader.

## 4. Group C: places of the geographers that cannot be located (6 records, held)

None of these has coordinates, and none should receive any: the only sources are the geographers' own reports, which place them at the edge of the known world. All six have prose in three languages and are otherwise sound.

| Record | What it is | What its sources say about where it is | Recommendation | Why |
|---|---|---|---|---|
| `place/waq-waq-islands` | The Waq Waq islands, rich in gold and ebony | al-Idrisi (Nuzhat al-mushtaq pp. 91-92): a chain joined to the Sila islands, beyond which nothing is known. Ibn Khurdadhbih (p. 77): the land of Waq Waq, so rich in gold that dogs' chains are made of it | No coordinates. Keep the record as it is | The sources mark it as the limit of knowledge. Any point would be the museum's guess |
| `place/jazirat-al-qurud` | The Island of the Monkeys | al-Idrisi (p. 63): a small island near the island of Ramij | No coordinates. A `located_in` or "near" tie to `place/ramij` could be added from the cited page | The neighbour `place/ramij` is itself placed by an approximate identification with Sumatra; a point derived from it would stack one guess on another |
| `place/namnaj` | The island of Namnaj, home of a people with tails | al-Idrisi (p. 214), from the author of the Book of Marvels: an island in the eastern sea | No coordinates | A marvel report with no bearing or distance |
| `place/madinat-al-sufur` | The City of Brass | al-Mas'udi (Muruj al-dhahab p. 557): in the wastes of al-Andalus; a variant puts it on the Abyssinian sea at the far end of India | No coordinates | Legendary, and the source itself gives two incompatible locations |
| `place/haykal-al-jawhara` | The jewel-temple of farthest China | al-Mas'udi (Muruj al-dhahab p. 548): a round temple with seven gates "in the farthest lands of China" | No coordinates. Region tag `china-east-asia`, as on its twin. See the duplicate note below | Legendary |
| `place/magnetic-temple-china` | The round temple of farthest China | The same passage of al-Mas'udi, p. 548 | No coordinates. See the duplicate note below | Legendary |

Three further points for the founder:

- **`place/haykal-al-jawhara` and `place/magnetic-temple-china` are one place written twice**, by two batches of the same harvest (`lib-muruj-dhahab-batch-24` and `-batch-7`) from the same page. One figure also disagrees: the English summary of `magnetic-temple-china` says no king could come within twenty cubits, where its own Arabic summary and the other record say ten. Recommended: the founder picks the record to keep, the other becomes its alias, and the figure is checked against the page. `submission-impacting` (it changes the record count by one).
- **A way to say "not located, on purpose".** Today a legendary place and a place somebody forgot to geocode look the same to the map: no coordinates. A field on the place schema (for example `coordinate_precision: unlocated`, or `locatable: false` with a note) would let the map and its index list these six under their own heading, such as "Places of the geographers' marvels", so they are shown as what they are. This is a schema change and needs its own approval.
- `place/waq-waq-islands` carries `regions: [global]`, and `place/madinat-al-sufur` carries none. For places with no location this is defensible; I recommend leaving both.

## 5. Group D: not a place, or a placeholder (8 records, held)

| Record | What it is | What its sources say | Recommendation | Why |
|---|---|---|---|---|
| `place/ayyubid-dynasty` | The Ayyubid dynasty, written as a place. Two persons have `lived_in` pointing at it, from Wikidata's "country of citizenship" (P27) | Wikidata Q180114: a dynasty, 1171 to 1341. The same item is already held by `polity/ayyubid-dynasty` | Make it an alias of `polity/ayyubid-dynasty` and move the two person edges to that polity (or drop them: citizenship is not residence). Until then, remove `[0, 0]` | A dynasty has no point. The graph already has the polity |
| `place/buyid-dynasty` | The Buyid dynasty, written as a place. One person edge (P27) | Wikidata Q273874; already held by `polity/buyid-dynasty` | The same: alias of `polity/buyid-dynasty`; move one edge; remove `[0, 0]` | The same |
| `place/fatimid-caliphate` | The Fatimid caliphate, written as a place. Seven person records point at it | Wikidata Q160307; already held by `polity/fatimid-caliphate` | The same: alias of `polity/fatimid-caliphate`; move their edges; remove `[0, 0]` | The same |
| `place/rashidun-caliphate` | The Rashidun caliphate, written as a place. Three persons have `lived_in` pointing at it (P27) | Wikidata Q12490507; already held by `polity/rashidun-caliphate` | The same: alias of `polity/rashidun-caliphate`; move three edges; remove `[0, 0]` | The same |
| `place/mamluk-egypt` | "Mamluk Egypt", a period of Egypt's history, with `kind: town`. One person has `born_in` pointing at it | Wikidata Q3973997: part of the Mamluk Sultanate (Q282428, held by `polity/mamluk-sultanate`); no article in any language, no coordinates | Point the one `born_in` edge at `place/misr` (Egypt), since Wikidata gives the birthplace as "Mamluk Egypt", and make this record an alias of `polity/mamluk-sultanate`; remove `[0, 0]` | It is a state in a period, not a town |
| `place/al-makassed-philanthropic-islamic-association-of-beirut` | A charitable and educational association of Beirut | Wikidata Q12206037 (revision 2391633911): an Islamic charitable organisation in Lebanon; no coordinates, no headquarters claim. No record in the graph points at it | Reclassify as an organisation (`group`), or keep as a `site` only if a source gives its headquarters. Remove `[0, 0]` | It is an institution. Nothing in the graph uses it as a place |
| `place/royal-court` | The Saudi Royal Court, the office of the king. Two persons have `lived_in` pointing at it, from Wikidata's "residence" (P551) | Wikidata Q12187556 (revision 2559941412): an organisation, located in Riyadh (P276); no coordinates. English Wikipedia "Saudi Royal Court" (revision 1381563739): no coordinates | Either reclassify as an organisation, or keep as a site in Riyadh and add `located_in: place/riyadh` from the P276 claim so the map can place it by its city. Region tag `arabia` | It is an office, not a point; the only location any source gives is the city |
| `place/unknown` | Wikidata's own marker for "unknown value" (Q24238356, "entity whose identity is not known"), imported as if it were a place. Two persons have `born_in` pointing at it (Baybars; Ghaylan al-Dimashqi, who also has `born_in` Damascus) | The item is not a place and says nothing about any place | Retire the record and remove the two edges: "born in: unknown" is the absence of a fact, not a fact. `submission-impacting` | It can never have a position, and the two edges assert nothing |

All of group D comes from one pattern: the enrichment run turned every Wikidata value of "place of birth", "residence" and "country of citizenship" into a place record, whatever the value was. A check for that pattern across the other place records created by the same runs would be a useful follow-up; I did not run it, because it is outside this task.

The four dynasty merges and the retirement of `place/unknown` reduce the record count and are `submission-impacting`: they need the founder's sign-off with that label, and the claims register and evidence map updated in the same commit.

## 6. The one question that settles most of this

Ten records still carry `[0, 0]` and have no real position to replace it (four in group B, six in group D; `royal-court` and `unknown` never had coordinates). **May the placeholder coordinates be removed from them?** `[0, 0]` is not a fact any source states; it is the mark a script left where a value was missing. Removing it, with the `coordinate_precision: locality` and the bare "Wikidata Q…" note that came with it, changes existing content, so it was not done. With the founder's yes it is a ten-file change, and the map review's warning about the Gulf of Guinea goes away for good.

The ten records: `fadl-mosque`, `grave-of-al-ghazali`, `al-nawbakhti-shrine`, `sirwan`, `ayyubid-dynasty`, `buyid-dynasty`, `fatimid-caliphate`, `rashidun-caliphate`, `mamluk-egypt`, `al-makassed-philanthropic-islamic-association-of-beirut`.

## 7. Noticed in passing, not touched

- `place/ray` and `place/rayy` look like the same city written twice (one from the Wikidata run, one older).
- Every record in sections 3 and 5 has the English summary "… a place linked to persons via Wikidata claims.", which describes how the record was made, not the place.

## 8. Method

- Wikidata: each item read through the Wikidata API on 11 November 2026; the revision ids are quoted in the tables.
- Wikipedia: each linked article queried for coordinates and read at its current revision through the MediaWiki API.
- GeoNames: searched by name within the country on the GeoNames website; each candidate's page read for coordinates, feature code and administrative hierarchy, then matched against the record's Wikidata description. Rejected candidates: Kafr Buhūt (a different village); the Samail wilaya polygon point (the populated place was preferred); the Shaykh Umar quarter of Baghdad (a quarter, not the cemetery).
- No prose was taken from any of these. Coordinates and identifiers only.
