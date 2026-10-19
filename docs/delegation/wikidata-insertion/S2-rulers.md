# S2 rulers: slice log (Wikidata insertion wave 1)

Scope: humans (P31 Q5) with P39 in caliph, sultan, emir, khan or shah classes, died before 1800 CE. Query: wd_claim (P39, P570 value_time) joined to wd_entity on the subset, read-only. About 1,145 distinct matches, most of them governors, viziers, consorts or non-Islamic rulers, so the log covers the candidates checked, not all 1,145.

Counts: created 0, linked 13, skipped (checked, not created) 12 listed below.

## Linked (existing record, description matches; external_ids.wikidata added)
- LINKED person/uthman-ibn-affan | Q37731 | Rashidun caliph (644–656)
- LINKED person/hasan-ibn-ali | Q182914 | fifth Rashidun caliph (661)
- LINKED person/muawiya-ibn-abi-sufyan | Q181154 | first Umayyad caliph
- LINKED person/yazid-ibn-muawiya | Q217442 | second Umayyad caliph
- LINKED person/marwan-ibn-al-hakam | Q298577 | Umayyad caliph (684–685)
- LINKED person/ibrahim-ibn-al-walid | Q128416 | Umayyad caliph (744)
- LINKED person/al-muktafi-billah | Q284701 | Abbasid caliph (902–908)
- LINKED person/al-adil-ii | Q294314 | Ayyubid sultan of Egypt (1238–1240)
- LINKED person/murad-i-uthmani | Q96261 | third Ottoman sultan
- LINKED person/mustafa-iii-uthmani | Q199484 | Ottoman sultan (1757–1774)
- LINKED person/abu-al-rabi-sulayman-marinid | Q590827 | Marinid sultan (1308–1310)
- LINKED person/masud-ibn-muhammad-saljuqi | Q981706 | Seljuk sultan (Mas'ud, 1134–1152 per Wikidata)
- LINKED person/mansur-umar-ibn-ali-rasuli | Q28494464 | Rasulid sultan of Yemen

Note for S10: these 13 are links already made here, so S10 should skip them.

## Skipped (no new record created)
- SKIP Q2822168 Mulay Hassan (Hafsid sultan of Tunis) | no existing record checked; no book source confirmed in a catalogue in this run
- SKIP Q705556 Uthman (Hafsid) | same reason; identity with a possible existing Hafsid record not checked
- SKIP Q12178191 Abd-al-Mumin ibn Ibrahim (Hafsid) | same reason
- SKIP Q307429 Abd ar-Rahman IV, caliph of Cordoba (d. 1018) | no record found; no source confirmed in a catalogue
- SKIP Q482338 Shihab ad-Din Ahmad, Mamluk sultan (1342) | Petry 2022 is in data/source, but no page confirmed; a record without a page cite is a weak record
- SKIP Q3179907 Qutb ud din Mubarak Shah, Delhi Sultanate (d. 1320) | no Delhi-period book source in data/source; catalogue check not run
- SKIP Q2879342 Bahadur Shah of Gujarat (d. 1537) | existing muzaffar-shah-gujarat is a different ruler; no source confirmed
- SKIP Q7496465 Shihabuddin Bayazid Shah, Bengal (d. 1414) | no source confirmed
- SKIP Q12709871 Mahmud II of Johor (d. 1699) | no source confirmed
- SKIP Q4998758 Burhan Shah I, Ahmadnagar (d. 1553) | no source confirmed
- SKIP Q2469274, Q2947626, Q2345724, Q551841 Crimean khans (Adil, Sahin, Devlet III, Mehmed I Giray) | no Crimean source in data/source; catalogue check not run
- SKIP Q253605 al-Hasan ibn Kannun (Sultan of Morocco, 954–974) | existing record al-hasan-ibn-kannun exists, but its identity with the Wikidata item is not confirmed from the record text, so not linked
- SKIP Q372192 Amursana (Dzungar khan) | not in scope: non-Islamic polity
- SKIP Q11903850 Abilmambet Khan (Kazakh) | scope weak; no source confirmed

## Next (wave 2)
- Catalogue search for Crimean, Gujarati, Bengali and Johor rulers (WorldCat or national library), then create records only where a book supplies a page.
- Confirm identity of al-hasan-ibn-kannun and the Hafsid entries against existing records before linking.
