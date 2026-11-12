# Verifier report: the contradiction fixes

Fresh-context check of the 20 distinct edits made to 17 data records and 2 prose files in the contradiction sweep
(diffs against `e1d721298ab4b2494a4c8f04d3defcde1808b939`). Read-only: nothing but this file was written; no
validator, graph build or site build was run. Hijri dates were re-computed with the tabular arithmetic of
`scripts/hijri/convert.ts` (re-implemented in a scratch script, not run from the repo).

**Counts: 13 SOUND, 5 WEAK, 2 WRONG.**

| # | Edit | Verdict |
|---|------|---------|
| 1 | `event/battle-of-telagh-1268` during_reign retarget | WEAK |
| 2 | `event/end-of-almohads-668` during_reign retarget | SOUND |
| 3 | `event/marinid-zayyanid-wars` during_reign retarget | WEAK |
| 4 | `event/mudejar-revolt-1264` during_reign retarget | WRONG |
| 5 | `event/zayyanid-iberian-conflicts` during_reign retarget | WEAK |
| 6 | `person/abu-zakariya-al-sarraj-yahya` died | SOUND |
| 7 | `person/al-mustansir-billah-egypt` died | SOUND (but a sourced fact was deleted, see below) |
| 8 | `person/al-mutadid-billah-cairo` died | SOUND |
| 9 | `person/al-safadi` student_of retarget | SOUND |
| 10 | `person/al-wathiq-umar-cairo` died | SOUND (but one of its register keys is not really fixed) |
| 11 | `person/dhu-al-khuwaysira` born renamed died | WRONG |
| 12 | `person/hatib-ibn-al-harith-jumahi` participated_in retarget | SOUND |
| 13 | `person/mansur-ibn-jamwana` died | SOUND |
| 14 | `person/masada-ibn-hakama` died | WEAK |
| 15 | `person/nusayr-father-of-musa` child_of to parent_of | SOUND |
| 16 | `person/salit-ibn-amr` died | WEAK |
| 17 | `person/salit-ibn-amr` participated_in Uhud to Yamama | SOUND |
| 18 | `person/sulayman-al-ruhayli` student_of retarget | SOUND |
| 19 | `content/ar/person/hushaym-ibn-bashir` clause reorder | SOUND |
| 20 | `content/en/person/hushaym-ibn-bashir` clause reorder | SOUND (Urdu left with the old order) |

Harvest copies used (all under `~/islam-museum-harvest/`):

- al-Suyuti, Tarikh al-Khulafa, Minhaj 1434: `books/tareekh/tarikh-khulafa/20231228_20231228_2028` (PDF page = printed page).
- al-Baladhuri, Futuh al-Buldan, Ma'arif 1407: `books/tareekh/futuh-buldan/20230703_20230703_1444`.
- Ibn Hisham, al-Saqqa 1936, juz' 4 (the edition the records cite): `raw/books/sira-ibn-hisham` (PDF page = printed + 4).
  The adjudicator of the Dhu al-Khuwaysira fix wrote that the harvest holds only a different edition; this copy is the cited one.
- Ibn Hajar, al-Isaba, one-volume al-Maktaba al-Asriyya print: `books/sahaba/isaba/20200217_20200217_0509`.
- Ibn Hajar, al-Durar al-Kamina: `books/tareekh/durar-kamina/DurarKamina__drkamth2` (scan page + 2 = printed).
- Ibn Khallikan, Wafayat al-A'yan, Ihsan Abbas: `books/tareekh/wafayat-ayan/ihsan-abbas-8vol/v7.txt`.
- Ibn Idhari, al-Bayan al-Mughrib: `books/tareekh/bayan-mughrib-idhari/elshandawily9182` and `elshandawily9178`.
- al-Mawsu'a al-Fiqhiyya al-Kuwaytiyya: `books/fiqh/fiqh-mawsua-kuwaitiyya-noor-v3`.
- Encyclopaedia of Islam 2, vol. 8: `books/encyclopaedia-of-islam-2/Encyclopaedia_of_Islam_vol_8_Ned-Sam`.

---

## The five Almohad `during_reign` retargets

Common ground, checked once. All five events pointed `during_reign` at `person/abd-al-wahid-ii-almohad`, whose prose is
about Abd al-Wahid ibn Yusuf, strangled in Sha'ban 621 AH, but whose `story_roles` carries the reign 1266-1269 and
whose `successor_of` points to al-Murtada. The edges were made by the Khulafa wave (commit `332f0d2f83`, plan 30
phase 4) from date overlap with that story_role, not from a reading. The caliph of 665-668 AH is Idris al-Wathiq Abu
Dabbus, and `person/al-wathiq-abu-dabus` is that man: Wafayat (Ihsan Abbas vol. 7, the passage the record cites) has
him enter Marrakesh on 21 Muharram 665, al-Murtada killed in the last ten days of Rabi' II 665, three years of rule,
and his death in Muharram 668. Tabular conversion: 21 Muharram 665 = 22 October 1266; Muharram 668 = 31 August to
29 September 1269. So the new target is the right person, not a namesake.

Three things the resolutions do not say:

1. **The citation on all five edges was carried over unread and the held copy cannot support it.** Each edge still reads
   `sources: [source/bayan-mughrib-idhari]`. The copy that source record names (`elshandawily9182`) runs from the
   author's preface to al-Mansur ibn Abi Amir; `elshandawily9178` is the North Africa volume to the 11th century.
   Neither contains the Almohad section: zero occurrences in the OCR text of al-Murtada, al-Wathiq, Yaghmurasan or
   Telagh, and "Dabbus" only in unrelated senses. The retargeted edges therefore cite a book that, as held, says
   nothing about 1264-1269.
2. **The identity was only half moved, and the Khulafa Browser now shows the half that was left.** `site/src/lib/khulafa.ts`
   lists as caliphs only persons with a `ruler` story_role toward a caliphate polity. `person/al-wathiq-abu-dabus` has
   no story_role and no `ruled_over`, so it has no Khulafa page; `person/abd-al-wahid-ii-almohad` is still the last link
   of the Almohad chain (1266-1269, successor of al-Murtada) and has just lost all five of its reign events, the end of
   the dynasty among them. The resolutions do leave the story_role and `successor_of` to the founder, but they do not
   say that until then the browser shows a man dead in 1224 as the caliph of 1266-1269 with no events, and the five
   events link "in the reign of" to a record with no reign.
3. **That leftover is a contradiction no detector sees.** A ruler story_role 42 years after the holder's `died` is not
   tested by detectors A to D. It should be a register entry of its own, not a sentence inside five resolutions.

### data/event/end-of-almohads-668.yaml — SOUND

The event's own summary and prose say al-Wathiq Abu Dabbus, last caliph of the house of Abd al-Mu'min, was killed in
Muharram 668 (cited to Wafayat p. 16), and the event already had `had_participant` to him. Wafayat confirms it. The
event's own cited source supports the new target. Small remainder: the edge still cites `source/bayan-mughrib-idhari`,
which is not in the event's `sources` and does not cover the period; `source/wafayat-ayan` is the source that supports it.

### data/event/battle-of-telagh-1268.yaml — WEAK

Probably right: 1268 falls inside 665-668 AH. Missing: any source the event cites. The card is a Wikidata draft
("its sources are not yet checked on the page"), names no ruler, and the support is the two person records, as the
resolution admits. The edge's own citation is the unread Bayan stamp described above.

### data/event/marinid-zayyanid-wars.yaml — WEAK

Dated 1250-1411, so it overlaps any reign of the period; the retarget is true only in that trivial sense. Same
missing support as Telagh. The edge is an artefact of the overlap rule; nothing read places these wars "in the reign"
of a caliph who held Marrakesh for three years.

### data/event/zayyanid-iberian-conflicts.yaml — WEAK

Dated 1250-1550; same as the previous one.

### data/event/mudejar-revolt-1264.yaml — WRONG

Unsupported, and the detector is quiet without the record being true. The event is dated 1264 to 1266 at year
precision. By the source the adjudicator relies on, Abu Dabbus entered Marrakesh on 21 Muharram 665, which is 22
October 1266, and al-Murtada was killed in Rabi' II 665, January 1267. The only possible overlap is the last ten weeks
of the revolt's last recorded year, and nothing cited by the event, by the edge or by either person record puts any
part of the revolt after October 1266. (From general knowledge, not from a cited source: the Murcian phase ended early
in 1266, months before Abu Dabbus.) The event's other `during_reign`, to al-Murtada (1248-1266), already covers the
whole span and was left as written. The honest outcome was to leave the finding registered and propose removing the
second edge; instead the edge was repointed so that `1264 > died + 1` is no longer true. Do not revert to the dead
caliph: propose removal.

Out of the fix's scope but on the same card: `sides` names "the authorities of al-Murtada Umar al-Muwahhidi" as the
party the rebels faced. The card's own summary says the rising was of Castile's Muslims.

---

## data/person/abu-zakariya-al-sarraj-yahya.yaml — SOUND

`died` 1448 (enrichment note naming al-Durar al-Kamina, not a source of the record) replaced by Hijri 0805, no CE year.
Opened the Mawsu'a, scan p. 7511: the entry is headed with his name and "(? - 805 AH)", continuing on p. 7512. The
record's summary and prose already said 805 from the same pages. No conversion was written, so no `derived` flag is
needed. Still standing, as the resolution says: `born 1368` from the same pass, while the cited entry marks the birth
unknown.

Side effect to know: `dateRange` in `scripts/lib.ts` reads `edtf` only, so with a Hijri-only `died` detectors A and B
can no longer test this person at all (detector D reads the Hijri year and is satisfied). AH 805 runs 1 August 1402 to
20 July 1403.

## data/person/al-mustansir-billah-egypt.yaml — SOUND, with a deletion

New `died`: Hijri 0660-01-03, precision day, cited to al-Suyuti pp. 723-724. Opened p. 724: he was lost in the battle
with the Tatars, "it was said he was killed, which is the apparent case, and it was said he escaped", "on the third of
Muharram of the year sixty". Supported and correct; the note keeps the doubt. 3 Muharram 660 is 28 November 1261
(tabular); the record's own story_role ends the reign in 1262, which is a small pre-existing mismatch.

Two things to act on:

- **A sourced fact was deleted, not moved.** The old value was the Fatimid al-Mustansir's death, to the day, with age
  and length of rule, cited to Shadharat pp. 383-384 (written onto this record by the Shadharat batch of 17 October).
  It does not belong here, but `person/al-mustansir-fatimid` carries only `died: 1094` from an unsourced enrichment
  pass. The sweep's rule was "never a deletion"; this one removed the only sourced statement of that death from the
  graph. It should be transplanted to the Fatimid's record (18 Dhu al-Hijja 487 = 29 December 1094 tabular).
- Hijri-only `died`: same detector blindness as above. For both events tied to him the result would be the same with a
  CE date (both fall in 1261), so nothing is being hidden; but `event/al-qurtubi-settles-munya-660` is a
  decade-precision guess placed in the reign of a caliph who lived three days into 660, and that edge is true only by
  approximation.

## data/person/al-mutadid-billah-cairo.yaml — SOUND

`died` 1341 replaced by 1362 / 0763-05, `derived: true`. Opened p. 755: "he died in Jumada I of the year 763".
Jumada I 763 = 26 February to 27 March 1362, so the CE year is right and matches the record's story_role end. All 23
events named in the register fall between 1353 and 1361, inside 753-763 AH. Supported as claimed.

Out of scope: the record's summary and its "in his days" section give al-Mu'tadid the deposition of the sultan
al-Mansur Abu Bakr. On p. 753 that passage is the tail of the chapter on his brother al-Hakim ("in the year of his
accession"), eleven years before al-Mu'tadid. The prose is wrong; the sweep's detectors do not look there.

## data/person/al-safadi.yaml — SOUND

`student_of` moved from the grandfather (died Tunis, Rajab 659) to `person/ibn-sayyid-al-nas`, Fath al-Din (661 or
671 to 734 AH). I re-read the cited article, al-Durar vol. 2 entry 1654 (scan p. 85, printed p. 87): he "took from
al-Shihab Mahmud, Ibn Sayyid al-Nas, Ibn Nubata and Abu Hayyan", and his father kept him from study until he was
twenty, which puts his studies from about 716 AH. The article gives only the family name, so the identification is by
inference; but the inference is closed by a source the record already cites: EI2 vol. 8 p. 759 (art. al-Safadi) names
Ibn Sayyid al-Nas, with Ibn Nubata and Abu Hayyan, among the "scholars and writers of the age" with whom he formed
ties after his first visit to Damascus in 717 or 718 AH, and cross-refers to its own article on the man. The target
record is the right man. The resolution could have cited EI2; the result stands.

## data/person/al-wathiq-umar-cairo.yaml — SOUND as an edit; one key is not fixed

`died` 1342 replaced by 1386 / 0788-10, `derived: true`. Opened pp. 761 and 763: allegiance in Rajab 785, death on a
Wednesday in Shawwal 788. Shawwal 788 = 26 October to 23 November 1386. Supported and correct at month precision.

The register key `A|reign-after-death|event/muezzin-salat-adhan-786|person/al-wathiq-umar-cairo` is another matter. I
confirm the adjudicator's own caution on p. 761: the innovation is "in this year, in Sha'ban", and the year running in
the passage is 791 (it follows "until the year ninety-one" and "in Jumada II of the year"). Sha'ban 791 is July to
August 1389, three years after this caliph died. So the event's date is wrong against its own cited page, the
`during_reign` to this caliph is false, and the finding is quiet only because of the wrong date. That is the case the
brief describes: the detector is satisfied and the pair is still untrue. Status should not read `fixed`.

Out of scope: the source's day is the 29th of Shawwal in the Arabic idiom used; the record's English summary and the
Arabic and English prose say the 19th.

## data/person/dhu-al-khuwaysira.yaml — WRONG

`born 658~` was renamed `died 658~`, value and note ("Date-enrichment pass; source: Fath al-Bari") unchanged. The
resolution's support is the record's prose: "he later became a Kharijite leader and was killed at al-Nahrawan",
cited `ibn-hisham-saqqa 4/140`, and it says the page was not re-read because the harvest holds another edition.

The cited edition is in the harvest (`raw/books/sira-ibn-hisham`). Printed pp. 139-140 (PDF 143-144) hold the report of
his objection at the division of the Hunayn spoils, the reply, the saying about a party that will pass out of the
religion, and two parallel chains. Nothing else. The footnotes on p. 139 are one note on another man's lineage and
seven glosses of words. He is not named Hurqus ibn Zuhayr, not called a Kharijite leader, and not said to have been
killed anywhere. The words al-Nahrawan, Hurqus and Khawarij do not occur in the OCR text of juz' 4 at all; the
edition's index sends his name to pp. 139 and 140 only. The other edition in the harvest
(`books/seerah/sira-ibn-hisham`, pp. 590-591) agrees.

So the prose sentence carries a false citation, and the new `died` rests on that sentence plus an enrichment note
naming a book the record does not cite. An impossible unsupported value was replaced with a possible unsupported one.
The identification with Hurqus ibn Zuhayr, which also sits unsourced in `names` and in both summaries, is one view
among the classical authors, not a fact Ibn Ishaq gives; a death at al-Nahrawan follows only from that identification.
Under the sweep's rule this is not a fix. The year should either be sourced from a book that is then added to the
record, or held as a proposal; and the prose sentence and its citation need correcting whatever is decided.

## data/person/hatib-ibn-al-harith-jumahi.yaml — SOUND

`participated_in` moved from the return of AH 7 to `event/second-migration-to-abyssinia`. Opened al-Isaba pp. 281-282,
entry 1611: Ibn Ishaq lists him among the emigrants to Abyssinia; "al-Waqidi and others said he emigrated in the
second migration and died in the land of Abyssinia"; al-Tabarani lists him and his brother among those who died there.
Opened Ibn Hisham (Saqqa) 4/7: he perished there a Muslim and his wife and two sons came in one of the two ships; 4/10:
he is in the list of those who died in Abyssinia. The note says exactly what the pages say. `source/ibn-hajar-isaba`
was already in the record's `sources`. Nothing sourced was lost: the return of his wife and sons stays in the prose.

## data/person/mansur-ibn-jamwana.yaml — SOUND

`died` 750~ replaced by 0758~ / 0141, `derived: true`. Opened al-Baladhuri p. 271: he was betrayed "in the year 141",
brought to al-Mansur and killed at al-Raqqa; the second account repeats the year. AH 141 = 14 May 758 to 2 May 759.
The year is in the record's own cited page, not only in the event record.

Out of scope: the page prints the father's name with an ayn (Ja'wana); the label and slug read it otherwise.

## data/person/masada-ibn-hakama.yaml — WEAK

`died` 600~ replaced by 0628~ / 0006~, status debated. That he was killed in this raid is in the cited source: Ibn
Hisham (Saqqa) 4/265-266, read in the cited edition (PDF 269-270) and in the other one, has Qays ibn al-Musahhar kill
him in Zayd's second raid on Fazara. So the contradiction itself (dead 28 years before the raid) is truly resolved.

What is missing is the year. Ibn Ishaq gives none, as the new note says. The year was copied from
`event/raid-of-zayd-on-banu-fazara-and-umm-qirfa`, and that event's own date note marks it `needs_source` ("later
maghazi authors place it in Ramadan of year 6"). The new `died` then lists `sources: [source/ibn-hisham-saqqa]`, a book
that does not give the year. The value is very likely right (Ramadan 6 = January to February 628), but its support is
an unsourced field of another record. Either a maghazi source is added to both records, or the date should say
plainly in its `sources` that none is cited for the year.

## data/person/nusayr-father-of-musa.yaml — SOUND

`child_of` changed to `parent_of` toward Musa. Opened al-Baladhuri p. 346: "Nusayr, father of Musa ibn Nusayr", freed
by an Umayyad, returned to Syria, "and Musa was born to him" at a village named there. `parent_of` is the registered
inverse of `child_of` and is used elsewhere; Musa's file does not write the edge, so it is written once.

Still untrue and now unregistered: father born 633~, son born 640~. Detector B only asks whether the child was born
before the parent, so a father seven years older than his son passes. The resolution mentions it; it deserves its own
register entry.

## data/person/salit-ibn-amr.yaml — two edits

**`participated_in` Uhud to Yamama — SOUND.** Opened al-Isaba p. 604. Entry 3559 is Salit ibn Amr ibn Zayd, whom Ibn
A'idh lists among the martyrs of Uhud. Entry 3560 is this man, the Amiri and envoy to Hawdha, and ends: Ibn Ishaq
listed him among the martyrs of al-Yamama "and so did Ibn al-Kalbi"; entry 3558, on his son, adds that most agree the
father was martyred there. The old edge's only basis ("al-Isaba p. 604") was the namesake's entry, so moving it loses
nothing true. The entry mentions Badr for him (al-Waqidi and Abu Ma'shar), not Uhud.

**`died` AH 3 to 0634~ / 0012 — WEAK.** The death at al-Yamama is supported as above, and it disposes of both register
findings. The year is not in al-Isaba p. 604. It was copied from `event/battle-of-yamama`, which takes it from
al-Baladhuri p. 123 ("the conquest of al-Yamama was in the year 12", confirmed in the harvest), a book this record
does not cite. The copied CE year is also off by the repo's own arithmetic: AH 12 runs 18 March 633 to 6 March 634 and
its mid-year, the point `validate.ts` uses, is August 633. `0634~` passes the two-year tolerance, but it was presented
as "no new conversion" when it is an inexact one inherited from the event. The same value sits on the event.

Out of scope: the prose section on al-Isaba numbers his entry 3561 and quotes a heading that mixes three entries.

## data/person/sulayman-al-ruhayli.yaml — SOUND

`student_of` moved from a man who died in 1914 to `person/muhammad-ibn-salih-al-uthaymin` (1929-2001). The record's
prose and the source record's own reliability note both say he attended the lessons of Ibn Baz, al-Albani and
al-Uthaymin. I re-read the cited article (live English Wikipedia page, fetched today; the record cites the revision of
25 October 2026): the sentence is there, and the name links to the article on Muhammad ibn al-Uthaymin. Limit of this
check: live page, not the recorded revision, read through a summarising fetch.

## content/ar and content/en person/hushaym-ibn-bashir.md — SOUND, SOUND

The clause was reordered so that "died 183 AH" attaches to Hushaym, not to the linked Ahmad ibn Hanbal. The same file
gives 104-183 AH from the Mawsu'a, scan p. 2073, which I opened: the entry is headed with those years. No fact
changed; the sentence is a paraphrase without quotation marks and stays one.

Left behind: the Urdu file keeps the old order, with the relative clause after the link, and so keeps the ambiguity.
Detector D reads only `ar` and `en`, which is why nothing reports it. The three languages now differ in a sentence
that was corrected for a reason that applies to all three.

---

## Question 5: deletions and added source ids

- **No edit added a source id that the record did not already list.** Checked every new `sources` value against the
  record's top-level `sources`.
- **Sourced information deleted:** the Fatimid caliph's death date from `person/al-mustansir-billah-egypt`
  (Shadharat pp. 383-384), not moved to `person/al-mustansir-fatimid`. This is the only real loss.
- Removed but not a loss: Salit's Uhud edge and AH 3 death (they belong to a namesake; the new note records this),
  Hatib's edge to the return (he died before it), and the enrichment values 1341, 1342, 1448, 750~ and 600~, none of
  which had a citable source.
- **Citations kept without being read:** `source/bayan-mughrib-idhari` on all five retargeted edges (see above).
- **Citation found false while checking:** `ibn-hisham-saqqa 4/140` for the death at al-Nahrawan in the Arabic and
  English prose of `person/dhu-al-khuwaysira`.

## Register keys whose status should change

Back to `registered`:

1. `A|before-birth|person/dhu-al-khuwaysira|participated_in|event/distribution-of-hunayn-spoils`. The impossible birth
   year is gone, but the death year that replaced it has no cited support and the support named does not exist on the
   cited page. Open as: source the death, or hold the date; correct the prose citation.
2. `A|reign-after-death|event/mudejar-revolt-1264|person/abd-al-wahid-ii-almohad`. The retarget is unsupported and
   rests on a ten-week overlap at year precision. Open as: proposal to remove the second `during_reign` edge.
3. `A|reign-after-death|event/muezzin-salat-adhan-786|person/al-wathiq-umar-cairo`. The caliph's death date is now
   right, but the event belongs to Sha'ban 791 by its own cited page and the edge to this caliph is false. The
   resolution already says so; the status contradicts the resolution. Open as: re-date the event, remove the edge.

Your call (fixed only by an exception to the rule, which each resolution admits):

4. `A|reign-after-death|event/battle-of-telagh-1268|person/abd-al-wahid-ii-almohad`
5. `A|reign-after-death|event/marinid-zayyanid-wars|person/abd-al-wahid-ii-almohad`
6. `A|reign-after-death|event/zayyanid-iberian-conflicts|person/abd-al-wahid-ii-almohad`

   The new target is the right person and the dates fit, so I would leave these `fixed`, but with the resolution
   amended to say that the edge's citation was not read and that the held copy of the Bayan does not cover the period.

Stay `fixed`, amend the resolution: the three keys of `person/masada-ibn-hakama` and `person/salit-ibn-amr` (the men
did die at or after the events; only the year is borrowed), and the two of `person/al-mustansir-billah-egypt` (add the
deleted Fatimid date to the follow-ups).

New entries the register does not have:

- `person/abd-al-wahid-ii-almohad`: ruler story_role 1266-1269 and `successor_of` al-Murtada on a man who died in
  1224; the Khulafa Browser shows him as the last Almohad caliph, now with no events.
- `person/nusayr-father-of-musa` born 633~ against `person/musa-ibn-nusayr` born 640~.
- `event/muezzin-salat-adhan-786`: date 786 against its own cited page (791).
