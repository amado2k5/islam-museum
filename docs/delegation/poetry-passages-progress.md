# Poetry passages: progress

Plan: `docs/delegation/poetry-passages-plan.md`. Source for the Sira poems: Ibn Hisham, al-Sira, ed. Wüstenfeld (Leipzig 1858), read from the page scans (never from the OCR alone); the cited page is the printed page number. Each passage is one bayt; metre and rhyme are set only when read from the text.

## Done (works with passages)

| Work | Passages | Printed pages |
|---|---|---|
| `work/hassan-poem-kunna-muluk-al-nas` | 6 | 394 (pilot, PR #2951) |
| `work/labid-elegies-for-arbad` | 5 | pilot |
| `work/qasidat-banat-suad` | 7 | 892 (pilot) |
| `work/zibriqan-boast-poem` | 7 | 935-936 |
| `work/hassan-reply-to-zibriqan` | 8 | 936-937 |
| `work/hassan-second-reply-to-zibriqan` | 9 | 938 |
| `work/amr-ibn-al-ahtam-satire-of-qays-ibn-asim` | 1 | 939 (second verse not read with confidence) |
| `work/zibriqan-second-boast` | 2 | 937 |
| `work/amr-ibn-madikarib-poem-to-qays-ibn-makshuh` | 3 | 952 |
| `work/hassan-poem-qawmi-ulaika` | 3 | 931 |
| `work/malik-ibn-awf-jirana-praise` | 4 | 879 |
| `work/abbas-ibn-mirdas-atab` | 6 | 881-882 |

## Skipped, with reason

- `work/tarjuman-al-ashwaq`, `work/hirz-al-amani-wa-wajh-al-tahani`, `work/alpamish`: text not in a reachable public-domain source in this lane.

## Notes

- The lines Hassan composed on the way (`منعنا رسول الله إذ حل وسطنا`, p. 936) are a different recension from the ode on p. 938; only the p. 938 text is used for `hassan-second-reply-to-zibriqan`.
- Zibriqan's first verse (`وفينا تنصب البيع`) is translated cautiously: Ibn Hisham gives the variant `تقسم الربع` (quarter-share).

## Remaining

Every other `kind: poem` work in `data/work/` not listed above (Ka'b ibn Malik, Hassan's elegies, Abbas ibn Mirdas on Hunayn and others, minor Sira verse sets).

## Batch log

- PR 1 (#2987): Tamim delegation poems (25).
- PR 2: Zibriqan second boast, Amr ibn Ma'dikarib, Hassan 'qawmi ulaika', Malik ibn Awf, Abbas ibn Mirdas (atab), Hassan's Mu'tah elegy (25).
- PR 3: Ka'b ibn Malik's Mu'tah elegy, Hassan's elegy for the Prophet, Abu Afak, Umama al-Muzayriyya (24).
- PR 4: Asma bint Marwan's verses and Hassan's reply (7).

## Still to do (for the next session)

- `work/abbas-ibn-mirdas-hunayn`: its recorded opening is `تقضى أمور وتأتي أمور`, not yet located in the Wustenfeld scan. Printed p. 858 (scan index 322 of theil2) has a different Hunayn ode of Abbas, `إني والسوابح يوم جمع`; check whether it is the same work before attaching it.
- `work/kaab-ibn-malik-hunayn`, `work/hassan-poem-enumerating-the-maghazi`, `work/hassan-poem-kunna-muluk-al-nas` (more bayts), and the short verse sets (Aban, Khalid, Said ibn al-As, al-Numan ibn Adi, Abu Khaythama, Abdullah ibn Unays, Abu Jial, Bujayr, Farwa ibn Musayk, Farwa al-Judhami, al-Dahhak, al-Farazdaq, Salma bint Attab, Malik ibn al-Namt): the first line is not in the work files, so each needs a page hunt in the OCR of `vol1-theil2` followed by reading the scan.
- Search helper idea: normalise the OCR (strip diacritics, unify alef/ya/ta marbuta) and rank pages by shared letter trigrams with a known first hemistich.
- PR 5: Abdullah ibn Unays, Malik ibn al-Namt, Farwa ibn Musayk, Abu Ji'al, Salma bint Attab (24).
- PR 6: Farwa al-Judhami, al-Farazdaq, Said ibn al-As, Aban and Khalid ibn Said, Abu Khaythama, al-Numan ibn Adi (23).

## Not located yet (after PR 6)

- `work/bujayr-ibn-bujra-verses`, `work/al-dahhak-ibn-khalifa-verses`, `work/hassan-poem-enumerating-the-maghazi`, `work/kaab-ibn-malik-hunayn`, `work/abbas-ibn-mirdas-hunayn`: no first line in the work file and the trigram search did not land on the poem; still to locate by reading the relevant narrative pages (Hunayn around printed pp. 855-870, Tabuk around 894-900).
- Omitted lines: in Said ibn al-As's pair only the first verse was read with confidence; Abu Ji'al's lines 4-6 and Musayk's lines 1, 5-6 were skipped for legibility or uncertain sense.
- PR 7: Al-Dahhak ibn Khalifa, Bujayr ibn Bujra, Abbas ibn Mirdas on Hunayn (p. 859), Ka'b ibn Malik on the march to Ta'if (p. 870) (23).
  - Attribution note: the work records the openings `تقضى أمور وتأتي أمور` (Abbas) and `وقائلةٍ ألا تَبكِي أخاها` (Ka'b); the Wüstenfeld text has Abbas's Hunayn ode beginning `يا خاتم النبآء` (p. 859, Banu Sulaym's part at Hunayn) and Ka'b's Ta'if ode beginning `قضينا من تهامة` (p. 870). The passages are attached to those works on the basis of subject (Hunayn / march to Ta'if); the recorded openings were not found in this edition and may come from another recension.
  - Abbas's second ode on p. 859 (`أما ترى يا أم فروة خيلنا`) is not attached to any work yet.
- PR 8: Hassan's poem enumerating the Ansar's campaigns (17, pp. 929-930) and three more bayts of Hassan's lam-rhymed poem (refs 7-9) (20).
- PR 9 (Mutanabbi, from the local Dar Beirut 1983 scan; cited by scan page, which matches the printed page): `work/mutanabbi-wa-harr-qalbah` (14 bayts, pp. 331-332) and `work/mutanabbi-ala-qadr-ahl-al-azm` (7 bayts, p. 385). New poem works with `authors: person/al-mutanabbi`.
- PR 10: `work/mutanabbi-bima-al-taallul` (8 bayts, p. 471, Dar Beirut 1983 scan) and `work/tarjuman-al-ashwaq` (9 bayts, pp. 59, 62, 63, 86 of the local Dar al-Marefah 2005 scan, read from page renderings). `tarjuman-al-ashwaq` is therefore no longer skipped: the local edition carries Ibn Arabi's own commentary; only single bayts (under 40 words) of the modern printing are quoted.
- PR 11 (Mutanabbi, Dar Beirut 1983 scan): five more bayts of `mutanabbi-bima-al-taallul` (p. 472) and three new poem works: `mutanabbi-la-taqnaa-bima-dun-al-nujum` (6, p. 232), `mutanabbi-li-kulli-imri-ma-taawwada` (8, p. 370), `mutanabbi-aghalib-fika-al-shawq` (4, p. 466) (22 passages).
- PR 12: plain-link filters (by poet, metre, rhyme letter) in the Verses section of the poetry page, with en/ar/ur strings; no build run.
- PR 13: metre (and rhyme where missing) set on Hassan's lam-rhymed poem (tawil) and Farwa al-Judhami's verses (kamil / tawil by line). Labid's elegies left without metre: not established with confidence from the text.
