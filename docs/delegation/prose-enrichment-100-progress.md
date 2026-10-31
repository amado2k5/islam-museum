# prose-enrichment-100 progress

Lane: [`docs/agents/lanes/prose-enrichment-100.md`](../agents/lanes/prose-enrichment-100.md).

| Date | Owner | Batch | Entities enriched | Leads recorded | Commit |
|---|---|---|---|---|---|
| 2026-10-31 | Devin (a–m) | batch 1: event, kamil-ibn-al-athir pp. 292–373 | 25 | 0 | — |
| 2026-10-31 | Devin (a–m) | batch 2: event, kamil-ibn-al-athir pp. 24–455 | 14 | 0 | — |
| 2026-10-31 | Devin (a–m) | batch 3: event, kamil-ibn-al-athir pp. 432–494 | 11 | 0 | — |
| 2026-10-31 | Devin (a–m) | batch 4: event, kamil-ibn-al-athir pp. 231–494 | 24 | 6 (mecca-amir-fitna-574, conquest-of-qarqisiya, masjid-haram-expansion-17, khaybar-partition, conquest-of-dinawar, conquest-of-ascalon — cited pages do not contain the event in this volume) | — |
| 2026-10-31 | Devin (a–m) | batch 5: place/person/work, muruj-al-dhahab + futuh-buldan-maarif-1407 | 13 | 1 (ali-ibn-isa-al-asturlabi — cited p.669 does not contain him in available OCR editions) | — |
| 2026-10-31 | Devin (a–m) | batch 6: person/group, fihrist-ibn-al-nadim pp. 256–474 | 7 | 3 (person/artimidurus, person/batlimyus-al-gharib, place/humdan — names not found at or near cited pages in available editions) | — |
| 2026-10-31 | Devin (a–m) | batch 7: event/person/work, shadharat-dhahab | 26 | 0 | — |
| 2026-10-31 | Claude (Haiku 5.5) | n–z batch 1 | 24: place/tabariyya, saada, tustar, sarqusta, udhayb, riha, qudaid, rafah, talaqan, tinbagh, zabil, qayn, tukharistan, samangan, nayin, qashmir, tha-laba, qalat-rabah, ushrusana, tifash, nahr-sayhan, tabriz; person/uthman-ibn-abi-shayba, sariya-ibn-zunaym | place/tarim (see leads) | this PR |

## Leads

- **place/tarim.** Arabic body reaches about 65 words from the defined sources read (Hamdani p. 70, Idrisi p. 154, Yaqut p. 789, Bakri p. 208). The sources do not support 100 words, so the files are unchanged. The existing summary's "after Shabwa and before Daw'an" order is not shown on Hamdani p. 70 in the OCR and needs checking.

## Open data issues (summaries not yet corrected)

These summaries disagree with the body or source; the prose follows the sources.

- place/udhayb summary places it on the Jidda–Taif road; Idrisi p. 144 places it on the Medina–al-Jar road.
- place/qudaid summary says Suraqa caught up with the Prophet at Qudayd, citing p. 166 (Uhud chapter, not Hijra).
- place/riha summary cites p. 356 for "one stage from Jerusalem"; the sentence is on p. 355.
- place/qalat-rabah summary carries "three stages from Merida" (is Merida to Karkuwi) and "impregnable" (said of Arliya).
- place/tha-laba summary says the town lies on the Kufa–Hijaz road; Idrisi p. 381 does not say so (Yaqut pp. 598, 619, 817 do).
- place/ushrusana summary puts it between Samarqand and al-Shash; Yaqut p. 261 places it between Sayhun and Samarqand.
- place/samangan summary: the silver is collected at Andarabah, five days away, not at Samangan (Idrisi p. 484).
- place/tinbagh: "Magians" applies to a group among the Taghazghaz Turks; the city's people are called zanadiqa (Idrisi p. 511).
- place/qayn: "about one stage in size" does not match Idrisi p. 462; Qayn–Nishapur is ten stages (p. 464) and about nine (p. 691).
- place/zabil: summary says taken by compact with Bust; Futuh p. 558 says Bust itself was taken by force. Bakri p. 447 places Zabil in al-Sind; Futuh places it in Sijistan.
- person/sariya-ibn-zunaym summary cites Tabari (Abu al-Fadl ed.) j.4 p. 178; that edition's OCR is not on disk, so the cite is unverified. The body follows Ibn Kathir's account of the same event.
- Idrisi page numbers follow the scan 1-2_20240914 (pages.json); the data record names the 2002 Cairo edition, so the match should be confirmed.
- place/tabriz: summary previously claimed Ilkhanid and Safavid capital status, which GeoNames cannot support; the summary is now reduced to location and provenance is added.
| 2026-10-31 | Devin (a–m) | batch 8: place, futuh-buldan (anasan, armabil, ayadhaj, bajirwan, bawazij-al-anbar, bust, butq-shirin, darabadh, darjah-jank, dawraq, fasa, ishtikhan, jahram, karminiya, karyan, khushak, mihrajanqadhaf, kutha, al-rawha, al-salihiyya) | 20 | 0 | — |
| 2026-10-31 | Devin (a–m) | batch 9: place, nuzhat-al-mushtaq-2002 (abaskun, abura, afrunisfa, aghathublis, aghriyimis, al-hammamat, al-jund, al-khadra, al-mismaqan, al-ruwaytha, al-sal, al-sammaa, al-shihr, alamas, alaniya, alib, amman, amzaniyus, anhu, anjiya, antaliya, anzalan, aqra, aqrunus, aqulia) | 25 | 0 | — |
| 2026-10-31 | Devin (a–m) | batch 10: place, nuzhat-al-mushtaq-2002 | 25 | 0 | — |
