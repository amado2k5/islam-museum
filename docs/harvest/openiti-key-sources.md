# OpenITI: key early sources available locally

_Checked 11 October 2026 against OpenITI 2025.1.9 (Zenodo 17767721, CC BY-NC-SA 4.0). The corpus zip (5.9 GB) lives in the harvest workspace, never in this repository. Use it to **find and verify facts** and to quote briefly with a citation; never republish text or copy it into `data/` (docs/plan/15 §3, `docs/attribution.md`)._

Extract a version: `python scripts/harvest/openiti/extract_version.py <version_uri>` (output in `$HARVEST/layers/nc/openiti/`). "pri" is the vetted primary version; prefer it. Edition details are in the `.yml` sidecar and the `#META#` header of each file, which is what a `source/` entity should cite (editor, publisher, year).

| Work | Version URI (primary) | Tokens |
|---|---|---|
| Ibn Hisham, *al-Sira al-Nabawiyya* (d. 213 AH) | `0213IbnHisham.SiraNabawiyya.Shamela0023833-ara1` (ed. al-Saqqa, al-Abyari, al-Shalabi, al-Babi al-Halabi, 2nd ed. 1375 AH / 1955) | 278,907 |
| Ibn Ishaq (reconstructed Sira) | `0151IbnIshaq.Sira.Shamela0009862-ara2` | 70,453 |
| Ibn Sa'd, *al-Tabaqat al-Kubra* | `0230IbnSacd.TabaqatKubra.ShamAY0035884-ara1` | 1,167,652 |
| al-Waqidi, *al-Maghazi* | `0207Waqidi.Maghazi.Shamela0023680-ara1` | 251,144 |
| al-Tabari, *Tarikh al-Rusul wa-l-Muluk* | `0310Tabari.Tarikh.Shamela0009783BK1-ara1` | 1,449,128 |
| al-Bukhari, *al-Jami' al-Sahih* | `0256Bukhari.Sahih.JK000110-ara1` | 609,626 |
| Muslim, *al-Sahih* | `0261Muslim.Sahih.Shamela0001727-ara1` | 505,827 |
| al-Baladhuri, *Ansab al-Ashraf* | `0279Baladhuri.AnsabAshraf.Shamela0009773-ara1` | 1,104,613 |
| al-Baladhuri, *Futuh al-Buldan* | `0279Baladhuri.FutuhBuldan.Shamela0012221-ara1` | 115,849 |
| Ibn Kathir, *al-Bidaya wa-l-Nihaya* | `0774IbnKathir.Bidaya.Shamela0004445-ara1` | 2,193,224 |
| Ibn Hajar, *al-Isaba* | `0852IbnHajarCasqalani.IsabaFiTamyiz.JK000533-ara1` | 1,085,763 |
| Ibn Hajar, *Fath al-Bari* | `0852IbnHajarCasqalani.FathBari.JK000166-ara1` | 3,285,465 |
| al-Dhahabi, *Siyar A'lam al-Nubala'* | `0748Dhahabi.SiyarAclamNubala.Shamela0010906-ara1` | 2,186,412 |
| Ibn Abd al-Barr, *al-Isti'ab* | `0463IbnCabdBarr.IsticabFiMacrifatAshab.JK000778-ara1` | 395,221 |
| Ibn Sayyid al-Nas, *Uyun al-Athar* | `0734IbnSayyidNas.CuyunAthar.Shamela0023653-ara1` | 214,546 |
| al-Suhayli, *al-Rawd al-Unuf* | `0581AbuQasimSuhayli.RawdUnuf.Masaha002028Vols-ara1` (part 1; other versions in the metadata) | 533,416 |
| al-Bayhaqi, *Dala'il al-Nubuwwa* | `0458Bayhaqi.DalailNubuwwa.JK006838-ara1` | 525,141 |
| Abu Nu'aym, *Dala'il al-Nubuwwa* | `0430AbuNucaymIsbahani.DalailNubuwwa.Shamela0010637-ara1` | 120,745 |
| Ibn Hibban, *al-Sira al-Nabawiyya wa-Akhbar al-Khulafa'* | `0354IbnHibbanBusti.Sira.Shamela0009898-ara1` | 97,070 |
| Ibn Hazm, *Jawami' al-Sira* | `0456IbnHazm.JawamicSira.Shamela0009728-ara1` | 44,386 |
| Ibn Hibban, *al-Thiqat* | `0354IbnHibbanBusti.Thiqat.Shamela0005816-ara1` | 531,546 |

The metadata for all 14,107 versions is loaded in the harvest database as `oi_corpus_meta` (`scripts/harvest/collections/load_tables.py`, add the corpus TSV to load it again). Note that this is the text corpus; the separate "OpenITI Makhzan" download is manuscript and print data for text recognition, not a source of texts.
