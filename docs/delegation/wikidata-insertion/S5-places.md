# S5 slice log: historical cities and regions of the Islamic world (wave 1)

Scope query: subset `wd_claim` P31/P17/P140 with at least 20 sitelinks, cities and regions in Muslim-majority areas or with P140 = Q432. Candidates were checked against `data/place` by Wikidata ID, slug and Arabic label before any create.

Source caveat: every book cited is an existing record in `data/source/`. Catalogue confirmation was NOT re-run in this slice; the owner should confirm the bibliographic details of each cited book before merge. Summaries carry no dates and no page numbers, and no coordinates were added (confirm via GeoNames).

## Created (7)
- created: place/mashhad, Q121157, source mujam-al-buldan-yaqut, kind city
- created: place/khorasan, Q2352322, source mujam-al-buldan-yaqut, kind region
- created: place/transoxiana, Q183324, source mujam-al-buldan-yaqut, kind region
- created: place/hijaz, Q169977, source sifat-jazirat-al-arab, kind region
- created: place/najd, Q208154, source sifat-jazirat-al-arab, kind region (the shared `data/_stubs.yaml` still lists place/najd; left untouched per rules)
- created: place/mogadishu, Q2449, source rihla-ibn-battuta-1958, kind city
- created: place/tarabulus-al-gharb, Q3579, source mujam-al-buldan-yaqut, kind city

## Linked (35): existing record gets external_ids.wikidata
- linked: place/cairo, Q85 | place/baghdad, Q1530 | place/damascus, Q3766 | place/aleppo, Q41183 | place/mosul, Q83317
- linked: place/alexandria, Q87 | place/jerusalem, Q1218 | place/kabul, Q5838 | place/lahore, Q11739 | place/marrakesh, Q101625
- linked: place/tunis, Q3572 | place/sanaa, Q2471 | place/muscat, Q3826 | place/jeddah, Q374365 | place/amman, Q3805
- linked: place/algiers, Q3561 | place/najaf, Q168193 | place/karbala, Q199909 | place/istanbul, Q406 (also the Constantinople entity, Q16869)
- linked: place/qayrawan, Q179570 (Kairouan) | place/dhaka, Q1354 | place/gaza, Q47492 | place/konya, Q79857 | place/bursa, Q40738
- linked: place/edirne, Q43387 | place/timbuktu, Q9427 | place/al-sham, Q3183526 (Bilad al-Sham) | place/al-mahdiyya, Q466054 (Mahdia)
- linked: place/wahran, Q131818 (Oran) | place/samarqand, Q5753 (Samarkand) | place/harat, Q45313 (Herat) | place/ghazna, Q173731 (Ghazni)
- linked: place/qumm, Q170573 (Qom) | place/tanja, Q126148 (Tangier) | place/tulaytula, Q5836 (Toledo)

## Skipped (reason)
- skipped: Q80985 Fez, already the ID of another record in data (fes); not re-linked, needs owner check.
- skipped: place/bukhara already carries wikidata Q4659, which does not match Q5764 (city of Bukhara); flagged, not changed.
- skipped: place/medina already linked to Q35484; no change.
- skipped: place/mahdiyya duplicates place/al-mahdiyya (same city); flagged for merge by owner, not changed.
- skipped: Q16869 Constantinople, same entity as place/istanbul; linked to Q406 instead of creating.
- skipped: Oran (new record), duplicate of wahran; linked instead.
- skipped: Mahdia (new record), duplicate of al-mahdiyya; linked instead.
- skipped: Toledo, Samarkand, Herat, Ghazni, Qom, Tangier (new records), duplicates of tulaytula, samarqand, harat, ghazna, qumm, tanja; linked instead.
- skipped: Antalya, Trabzon, Rabat, Tashkent, Khartoum, Tehran, Dubai, Abu Dhabi, Beirut, Kuwait City, Manama, Bethlehem, Ramallah, Karachi: modern capitals or cities without a clear Islamic-history record in this slice, and no book source checked; not created.
- skipped: Mesopotamia, Central Asia, South Asia, West Africa, North Africa and similar pre-Islamic or continental regions: out of scope for the historical slice.
- skipped: P31 Islamic persons, mosques and the like in the candidate list: belong to other slices.

## Next (wave 2)
- Check the remaining candidates (Tehran-era Iranian cities such as Tabriz, Shiraz, Yazd, Nishapur, Merv, Balkh; Maghreb cities such as Tlemcen, Meknes, Kairouan variants; Kilwa, Harar, Zabid, Aden) against existing slugs and the Yaqut and Ibn Battuta sources.
- Confirm catalogue entries for the four cited books before merge.
