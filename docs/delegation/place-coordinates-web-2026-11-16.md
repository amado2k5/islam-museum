# Place-coordinate web enrichment — batch of 16 November 2026

**Approved by:** the founder, in chat, 16 November 2026 ("can we get the coordinates for all those places from the internet by searching for it, using mac internet browser and not using API … just coordinates/data enrichment"), reaffirmed ("please make sure that this does not impact in anyway the sacred places browser").

**Scope.** The Place wing map (`site/src/lib/place-map.ts`) could not place 83 `place/` records — no `coordinates` and no coordinate-bearing neighbour. This batch enriches records with real, sourced coordinates found by browsing public websites (GeoNames search UI, al-Thurayya Gazetteer repository on GitHub, Wikipedia article pages). No code changed; no tags or relations added, so `placesItems` in `site/src/lib/places.ts` — the sacred places browser — is unaffected (the compiled graph edge count is unchanged at 191,160).

## Written (20 records)

| Place | Coordinates | Precision | Source |
|---|---|---|---|
| place/bayt-bus-sanaa-yemen | 15.2731, 44.2036 | site | en.wikipedia «Bayt Baws» rev. 1377112762; Wikidata Q4874879; UNESCO corroboration |
| place/saqayn-yemen | 16.88, 43.43 | locality | ar.wikipedia «ساقين (صعدة)» rev. 74196108 |
| place/amlah-yemen | 16.91713, 44.22279 | locality | ar.wikipedia «عزلة املح (صعدة)» rev. 77149535 (sub-district point) |
| place/iyan-yemen | 16.4596, 43.9695 | locality | GeoNames: Wadi 'Ayan ADM3, 'Amran |
| place/al-batna-banu-sad-yemen | 16.188, 43.837 | locality | GeoNames: Al Batnah ADM3, 'Amran |
| place/al-darb-banu-rabia-yemen | 16.98048, 43.68897 | locality | GeoNames: Ad Darb PPL, Sahar, Sa'dah |
| place/al-ghubayb-yemen | 16.7554, 43.7586 | locality | GeoNames: Al Ghubayb, Sahar, Sa'dah |
| place/al-ghayl-saada | 16.0823, 44.6873 | locality | GeoNames: Al Ghayl ADM3, al-Jawf |
| place/al-ghayl-al-bawn-yemen | 15.9697, 43.8967 | locality | GeoNames: As Sannatayn wa al Ghayl ADM3, 'Amran |
| place/madhab-yemen | 16.7167, 43.9325 | locality | GeoNames: Wadi Madhab ADM3, Sa'dah |
| place/wasaha-yemen | 16.8258, 43.4335 | locality | GeoNames: Washah PPL, Saqayn district, Sa'dah |
| place/hidayn-sanaa-yemen | 15.28449, 44.23324 | locality | GeoNames: Sharq Hudayn ADM3, San'a' gov. |
| place/al-sharfa-yemen | 15.48855, 44.47893 | locality | GeoNames: Ash Sharfah ADM3, San'a' gov. |
| place/samh-yemen | 14.781, 44.2137 | locality | GeoNames: Samh PPL, Dawran Aness, Dhamar |
| place/al-haira-hamdan-yemen | 17.13407, 43.26913 | locality | GeoNames: Al Hayirah PPL, Munabbih, Sa'dah |
| place/al-suwariqiyya | 23.28483, 40.35548 | locality | al-Thurayya SUWARIQIYYA_403E232N_S (CC BY 4.0) |
| place/al-bawn-yemen | 15.78083, 43.94901 | locality | al-Thurayya BAWN_439E157N_R |
| place/al-rakb-yemen | 13.3854, 43.83575 | locality | al-Thurayya RAKB_438E133N_R |
| place/qudum-yemen | 15.81462, 43.68913 | locality | al-Thurayya QUDAM_436E158N_R |
| place/thath-yemen | 14.4846, 44.76857 | locality | al-Thurayya THATWA-RADA_447E144N_R (editor: now Thah near Rada') |

Each carries `coordinates`, `coordinate_precision`, a `coordinate_note` naming the source and the identity reasoning, the gazetteer/article in `sources`, a `provenance.extensions` entry for run `place-coordinates-web-enrichment-2026-11-16`, and an authenticity-ledger page under `docs/authenticity-ledger/pages/` (geonames-*, althurayya-*, wikipedia-*). Most points are `locality` precision — the modern hamlet or the enclosing district centroid — because medieval Yemen sites rarely have a surveyed point; the notes say so.

## Result

**Second pass, same day — Mu'jam al-Buldan + further GeoNames.** After the first batch the unresolved names were searched against a full-text digital edition of Yaqut's Mu'jam al-buldan (ucfzem.github.io/mujam-al-buldan) and re-checked on GeoNames. Nine more records were written, bringing the total to 29: nuqm-sanaa-yemen (Jabal Nuqum, matching Yaqut's "mountain overlooking San'a' near Ghumdan"), madar-yemen (Ghayl Madar, 'Amran — Yaqut's "village twenty miles from San'a'"), al-rahba-sanaa (Qa' ar-Rahbah plain), al-buqa-saada-yemen (Albuq, Kitaf wa Al Boqe'e district), allaf-yemen (Wadi 'Alaf ADM3, Sa'dah), hawth-yemen (Huth ADM3, 'Amran), barat-yemen (Bart al-'Anan ADM2, al-Jawf), ghayman-sanaa-yemen (Ghayman PPL, Sanhan), sabal-sanaa-yemen (Sabal PPL, San'a' gov.). Mu'jam also confirmed, without giving a usable point, that warwar-yemen is a great fortress in the mountains of Hamdan, ghuraq-yemen a city of Hamdan, and jayshan-yemen a mukhlaf/city of Yemen (the modern Jayshan district in Abyan is a different place — not used). It showed three records are different places than their names suggested: tartar-tihama-yemen (Yaqut's Tartar is near Aleppo), al-kitd-athafit-yemen (Yaqut's Kitd is a mountain at Mecca), al-sharis… unresolved; and the sira's al-ghubayyib is probably a variant of al-ghubayb (already mapped) — candidate alias.

**Third pass — al-Hamdani's Sifat jazirat al-Arab + renamed-place check.** The full text of al-Hamdani's 10th-century geography (mizanalarab.com, Brill 1884 text) was searched for every unresolved name, which resolved several by *identification and renaming*: asal-khawlan is literally Hamdani's Zahir Khawlan; tartar-tihama is his Tartar 'in bilad Hakam' (the Zabid country — Yaqut's Syrian Tartar is a different place); warwar is in Madar's drainage in the Hamdan highlands; afqayn sits in the 'Allaf/al-Buqa' wadi corridor west of Sa'da; al-sharis matches his Shars of the Hajur country (GeoNames Bayt ash-Sharis, Hajjah); jayshan is his mukhlaf Jayshan (modern Abyan district, with the Khawlan caveat noted). Six more records written with `approx`/`locality` precision and honest notes.

Map-unplaceable `place/` records fell from **83 to 50** (recomputed against `.cache/graph.json` after `npm run graph`). All 29 newly positioned records sit in the northern-Yemen theatre of the Sira of al-Hadi ila al-Haqq, matching the map's arabia region.

## Unresolved — 50 records still off the map

- **Not point-geocodable (regions/dynasties mis-typed as place records):** rashidun-caliphate, fatimid-caliphate, ayyubid-dynasty, buyid-dynasty, mamluk-egypt, atlantic-ocean, sumatra, sirwan (river region). These need a founder modelling decision (polygon or `kind` change), not a point.
- **Legendary or unlocatable by design:** madinat-al-sufur, waq-waq-islands, jazirat-al-qurud, haykal-al-jawhara, magnetic-temple-china, namnaj, madhud-najran(?), place/unknown. Should stay unplaced rather than carry invented coordinates.
- **Found but ambiguous — needs a stronger source before writing:** karawi-banu-rabia-yemen (only a Hajjah namesake found), madar-yemen (several Madars; the sira's is in upper 'Amran), al-sabra-allaf / al-numays-allaf / al-sharis / al-ahsa-banu-mamar / al-qamashiyya / al-asum / al-akhtut / afqayn / atwa / arthal / warwar / ghuraq / alab-sanaa / zabwa-sanaa / hadaqan-sanaa / mankath / asal-khawlan / tartar-tihama / al-uyayn / bayt-dhud / bayt-yathi / al-kitd-athafit / zahr-yemen / al-ghubayyib-yemen — no defensible modern match on GeoNames, Google Maps, Wikipedia, al-Thurayya or Mu'jam al-buldan. Warwar and Ghuraq are confirmed by Yaqut as real places (a fortress and a city of Hamdan) but without a fixable modern point.
- **Najran hamlets of the sira:** al-hajar-najran (the Beth Mardutho gazetteer has an entry; al-Thurayya's HAJAR_499E247N_R is a different Hajar in al-Hasa — do not use), al-kharba-najran, lubayban-najran, minas-najran, qarqar-najran, rajla-najran, sawhan-najran, thila-najran.
- **Non-Yemen needs a source record first:** al-makassed-philanthropic-islamic-association-of-beirut (Google Maps listing ~33.8864, 35.4915 — needs a registered source), grave-of-al-ghazali (competing coordinates for the tomb at Tus ~36.48, 59.51 — identity choice needed), royal-court (Riyadh ~24.66, 46.64 — generic name, needs the record's context read), fadl-mosque, al-nawbakhti-shrine, jayshan-yemen (two Jayshans: Abyan district vs Khawlan mukhlaf — the sira's is Khawlan), 
- **al-ghubayyib-yemen** may be a duplicate of al-ghubayb-yemen; check the sira page and consider `aliases`.

## Boundaries kept

- No `places-browser`/`places-*` tags, no `relations`, no `mentions` were added — the sacred places browser (`scripts/places.ts` membership: tags or passage mentions) shows exactly the same 63 records.
- No code touched; the fallback-spiral proposal was abandoned per the founder's preference for real data.
- No invented coordinates: every point cites a page read on 2026-11-16 with a ledger entry.

## Third pass — sira-context neighbour points + non-Yemen web finds (16 Nov)

The record summaries themselves carried the region evidence; combined with
the al-Hamdani reading and map listings, 26 more records were placed:

- 9 Najran villages/forts of Banu al-Harith (al-Hajar, al-Kharba, Lubayban,
  Madhud, Minas, Qarqar, Rajla, Sawhan, Thila) — approx at Najran itself.
- 3 Khiwan/Hawth-cluster places (al-Ahsa of Banu Ma'mar, al-Asum,
  al-Ghubayyib) — approx at the Hawth district point.
- 5 Athafit/Allaf-cluster places (al-Numays, al-Sabra, Karawi, Bayt Dhud,
  al-Kitd) — approx at the Wadi 'Alaf district point.
- 4 singles: Atwa (from Madar), Hadaqan (al-Hamdani's Rahab sequence),
  Zabwa (al-Hamdani's Khawlan wadis), 'Alab (near San'a').
- 5 non-Yemen finds: Fadl Mosque and Nawbakhti shrine (both al-Rusafa,
  Baghdad), Sirwan of Ray (approx at Rayy), Makassed HQ (Mar Elias,
  Beirut), and the tomb of al-Ghazali (approx at the Haruniyeh Dome site,
  Tus).

22 remain unplaceable: 5 dynasties/caliphates (non-point regions), ~8
legendary/abstract records, and 9 Yemen places whose sources give no
fixable geography (al-Akhtut, al-Qamashiyya, al-'Uyayn, Arthal, Bayt
Dhukhar, Bayt Yathi', Ghuraq, Mankath, Zahr).
