# Place photographs: progress

Lane `place-photographs` ([`docs/agents/lanes/place-photographs.md`](../agents/lanes/place-photographs.md)).
The lander appends one line per landed record under "Ledger" at the end of this file.

## Next step

1. The lander lands packets `place-photographs-1`, `-2` and `-3` (65 records, verified, in `packets/verified/`
   at the harvest root). Nothing of this lane is on `main` or live before that train and the founder's deploy.
2. After the landing, mark the 65 pages of `web-commons-place-photographs` in the harvest register `cited`,
   and retake the Atlas count: `npm --prefix gaming run atlas:images`.
3. Batch 2: a second picture for the places that have one, and the held subjects below once the founder has
   ruled on them. A daily image round needs 365 pictures with at most four subjects a place (G-0008 rule 6).

## Batch 1 (26 November 2026)

| Packet | Records | Subjects |
|---|---:|---|
| `place-photographs-1` | 25 | 25 buildings |
| `place-photographs-2` | 25 | 10 buildings, 15 places |
| `place-photographs-3` | 15 | 15 places |
| Total | 65 | 35 buildings and 30 places, in 55 different places |

How it was chosen. The Wikidata items of 95 candidate buildings (every building that names one exactly located
place, carries a Wikidata id and had no picture) and of the 260 exactly located places that other records link
to most were read for their image statement (P18): 335 of the 355 have one. 101 of those files were looked at
in contact sheets in the founder's Chrome, and 65 were kept under the criteria in the lane document. No place
has more than two pictured subjects.

Licences of the 65, as read from the file pages: CC BY-SA 46 (version 4.0: 23, 3.0: 16, 2.0: 5, 2.5: 1,
2.5 Hungary: 1), CC BY 10 (2.0: 4, 3.0: 3, 4.0: 3), CC0 4, public domain 5. The exact version is in each
record's `attribution`.

What the records are and are not. Each record's Arabic and English text was written by the session model
(claude-fable-5-2) after looking at the picture at 500 pixels; the Urdu, French, Spanish, Turkish and Indonesian
text is a machine translation by Claude Sonnet 5.5 that no person has read. No person has reviewed the choice of
pictures.

What the verifier did and did not do (a separate Claude Sonnet 5.5 agent, the same day). It read the Commons
record of all 65 files again and found licence, address, revision and date as drafted, and the Wikidata id of
every record equal to the one on the museum record it depicts. It looked at all 65 pictures in the contact
sheets and opened four at 1,280 pixels, and corrected five records: a window shape (the tomb of İdris Baba), a
portal described as tiled that is brick with patches of tile (Balkh), a colour (Mardin), two windows called
doorways (the mosque of Baba Adam), and the author of the Taj Mahal photograph, written as the page's author
field has it ("Yann"; the credit line the page asks for, "© Yann Forget / Wikimedia Commons", stays in the
attribution). It read the five translated languages of 22 records and found nothing to correct. It did not
open the other 61 pictures at full size, so small details there (counts of domes or arches, materials) rest on
the 500-pixel view; it did not read the translations of the other 43 records; and it did not load the image
addresses, which the drafter had loaded once each, all 65 returning an image.

Three credits where the page gives more than one name, for whoever builds the Atlas credit line: the two
Jerusalem photographs are by Commons user Godot13, whose page asks for the credit "Andrew Shiva" (the records
use that); the Ghazna photograph is filed under the US State Department and its description names the
photographer S.K. Vemmer (the record names both); the Badshahi photograph's date field is its upload date,
2 July 2005, and its source line says it was taken on 1 July 2005 (the record uses the day it was taken).

## The Atlas count

Taken with `npm --prefix gaming run atlas:images` on a separate checkout of `main` at `885c7d97a5a` holding the
65 verified records (copied in for the count, not committed; the checkout was removed afterwards):

| | Before (25 Nov 2026, commit `361a669c3a5`) | With the 65 records |
|---|---:|---:|
| Media records | 895 | 960 |
| of which photographs or scans (`kind: image`) | 658 | 723 |
| Media records that depict a building | 7 | 42 |
| Media records that depict a place | 1 | 31 |
| Pictures that can be a "where is this?" round | 4 | 69 |
| Subjects pictured | 4 | 69 |
| Places the answers fall in | 4 | 59 |
| Usable in a weekly schedule (at most two subjects a place) | 4 | 69 |
| Needed for one image round a week | 52 | 52 |
| `enoughForAWeeklyImageRound` | false | **true** |
| `enoughForADailyImageRound` (needs 365) | false | false |

None of the 65 was refused by the game's rule (`gaming/games/atlas/src/images.ts`). The figure becomes true on
`main` only when the three packets have landed.

## Held for the founder (proposals, nothing decided)

| Subject | Why it was not taken | What would release it |
|---|---|---|
| `building/shaykh-zayid-mosque`, `building/museum-of-islamic-art-doha`, `building/hassan-ii-mosque`; city images whose main subject is a recent building (`place/islamabad`, `place/bandar-seri-begawan`, `place/deoband`) | Recent works of living or recently dead architects. The file page's licence covers the photograph; whether the building may be pictured freely depends on the country's law, and the lane does not decide that | The founder's word on recent architecture |
| `building/al-askari-shrine` | The Commons file on its Wikidata item credits the Tasnim News Agency as its source; held under `docs/agents/content-safety.md` section 2 without judging the source | The founder's ruling on that source, or another photograph |
| `building/great-mosque-of-al-nuri` | The Commons picture of 2020 shows the building damaged, and a caption would have to speak of a modern conflict | An earlier photograph of the standing mosque |
| `building/great-mosque-of-jenin` | A street billboard in the picture could not be read at the size viewed | Another photograph |
| `building/great-mosque-tlemcen` | The file is named for the Great Mosque of Tlemcen and described on the same page as the Sidi Boumediene mosque | A photograph whose page is not in two minds |
| `building/yesil-mosque-bursa` | The Wikidata image shows a tiled building under scaffolding that looks like the Green Tomb | A photograph of the mosque |
| `building/ali-bitchin-mosque`, `building/pasha-qasim-mosque-pecs`, `building/masjid-al-husayn-cairo`, `building/attarine-mosque-alexandria`, `place/zabid` | Passers-by, a market crowd or a child fill the foreground, or the file is 533 pixels wide | Another photograph |
| `building/itimad-ud-daulah-tomb`, `building/laleli-mosque-istanbul`, `place/delhi`, `place/sk-dar`, `place/bolu`, `place/yazd`, `place/chicago` | GFDL only, Free Art License or a bare attribution template: not on the whitelist | Another photograph under a whitelisted licence |
| `building/wadi-us-salaam` | A panorama of 15,553 by 2,148 pixels | Another photograph |
| `place/damascus`, `place/istanbul`, `place/mosul`, `place/multan`, `place/konya`, `place/bursa`, `place/erzurum`, `place/diyarbak-r`, `place/kayseri`, `place/belgrade`, `place/hyderabad`, `place/salonik`, `place/ray` and other montages | Several photographs by several authors in one file: one credit cannot be stated | A single photograph chosen by hand |
| `place/almeria`, `place/erzincan` | The author's user name contains the name of the place (G-0008 rule 4) | Another photograph |
| `place/timbuktu`, `place/basra` and other files under 700 pixels wide | Too small | A larger photograph |
| `place/sanaa`, `place/askalan` | On the board's held-for-the-founder list | His ruling on those entries |
| `place/al-baqi`, `place/karbala`, `place/najaf`, `place/kadhimiya`, `place/imam-reza-shrine`, `place/jannat-al-mualla` | Cemeteries and shrines, not looked at closely in this batch | The founder's word |

Not held, only not reached: 20 of the 355 items have no image on Wikidata (among them `place/baghdad`,
`place/badr`, `place/siffin`, `building/great-mosque-of-basra`, `building/al-madrasa-al-nizamiyya-baghdad`), and
their photographs have to be found by hand in the Commons categories. `building/khawarnaq-palace` and
`building/ghumdan-palace` no longer stand; their Wikidata images are a painted miniature with figures and a
view of old Sanaa. The other candidate buildings in Istanbul, Cairo, Delhi and Jerusalem wait for a later batch
because a place takes two subjects.

## Gaps found in building and place records (reported, not changed)

- **Buildings that name no place.** 5,547 of the 5,794 building records name no place or more than one, so
  their photographs could not serve a "where is this?" round whatever their quality. 116 of the 214 that name
  one have no Wikidata id, so no image could be looked up for them.
- **`building/blue-mosque`** (the Sultan Ahmed Mosque, Istanbul) carries Wikidata id Q138388, whose image on
  Wikidata is the Blue Mosque of Mazar-i-Sharif. Either the id or the Wikidata image is wrong.
- **`building/baba-adams-mosque`** names `place/dhaka`; its Commons page puts it at Rampal in Munshiganj
  district. A guess on the Atlas map would be scored against Dhaka.
- **Place names that are mistranslations**, each of which the Atlas game would show as the answer:
  `place/p-cs` (Turkish "Plaj", Indonesian "Pantai"), `place/akhaltsikhe` (Turkish "Kirlendim", Indonesian
  "Aku kotor", no Urdu), `place/panipat` (Turkish "Yapımcı idol", Indonesian "Idola pembangun"), `place/mina`
  (Turkish and Indonesian "Mona"), `place/stara-zagora` (Turkish "Antik Zughra", Indonesian "Zughra Kuno"),
  `place/dhaka` (Spanish "A"), `place/qayrawan` (Urdu "قاروان"), `place/cairo` (French "Caire"),
  `place/tunis` (Indonesian "Tunisia").
- **`building/ahmadiyya-mosque-akhaltsikhe`**: the label "Ahmadiyya Mosque" (English, French, Spanish) and the
  Urdu label «احمدیہ مسجد» can be read as naming the modern Ahmadiyya community; the building's Turkish name is
  Ahmediye Camii. The new media record writes "Ahmediye" in Urdu, Turkish and Indonesian and keeps the record's
  own name in the other languages.
- **`place/sijilmasa`** has the Arabic label «مجلماسة»; the usual spelling is «سجلماسة».
- **Missing languages**: `building/qaytbay-complex-cairo` and `building/masjid-al-khayf` have no Urdu,
  Spanish, Turkish or Indonesian label; `place/tlemcen` has no Urdu label.

## Ledger

One line per record: date read | media record | subject | Commons file | licence and author | revisions.

- 2026-11-26 | media/suleymaniye-mosque-from-above-hunanuk | depicts building/sulaymaniyya-mosque | File:SüleymaniyeMosqueIstanbul (cropped).jpg | CC0; author Hunanuk | Commons file-page revision 1037386272; Wikidata Q178643 revision 2573790940 (P18)
- 2026-11-26 | media/hagia-sophia-exterior-vagen | depicts building/hagia-sophia | File:Hagia Sophia Mars 2013.jpg | CC BY-SA 3.0; author Arild Vågen | Commons file-page revision 1302115771; Wikidata Q12506 revision 2573790985 (P18)
- 2026-11-26 | media/al-azhar-mosque-minarets-mayer | depicts building/al-azhar | File:Cairo - Islamic district - Al Azhar Mosque and University.JPG | CC BY-SA 4.0; author Daniel Mayer | Commons file-page revision 1251210260; Wikidata Q312342 revision 2552211828 (P18)
- 2026-11-26 | media/sultan-hasan-and-rifai-mosques-khalifa | depicts building/masjid-sultan-hasan | File:مسجدى الرفاعى والسلطان القاهرة.jpg | CC BY-SA 4.0; author Batoul Khalifa | Commons file-page revision 1111986571; Wikidata Q1430119 revision 2553165931 (P18)
- 2026-11-26 | media/humayuns-tomb-garden-view-anshrastogi | depicts building/humayun-tomb | File:Humayun Tomb UNESCO world heritage site.jpg | CC0; author Anshrastogi1 | Commons file-page revision 1305147380; Wikidata Q189648 revision 2565086620 (P18)
- 2026-11-26 | media/qila-i-kuhna-mosque-facade-bowling | depicts building/qila-i-kuhna-mosque | File:Qila Kuhna Masjid inside Puran Qila, Delhi.jpg | CC BY 2.0; author Russ Bowling | Commons file-page revision 1203860864; Wikidata Q19895556 revision 2562651728 (P18)
- 2026-11-26 | media/al-aqsa-mosque-facade-shiva | depicts building/al-aqsa-mosque | File:Jerusalem-2013-Temple Mount-Al-Aqsa Mosque (NE exposure).jpg | CC BY-SA 4.0; author Andrew Shiva | Commons file-page revision 1302136373; Wikidata Q12192963 revision 2557497173 (P18)
- 2026-11-26 | media/al-haram-al-sharif-aerial-shiva | depicts building/al-haram-al-sharif | File:Jerusalem-2013(2)-Aerial-Temple Mount-(south exposure).jpg | CC BY-SA 4.0; author Andrew Shiva | Commons file-page revision 1304431856; Wikidata Q193163 revision 2557331373 (P18)
- 2026-11-26 | media/great-mosque-of-nablus-interior-amr | depicts building/jami-nablus-al-kabir | File:الجامع الصلاحي الكبير في نابلس.JPG | CC BY-SA 3.0; author عمرو بن كلثوم | Commons file-page revision 1244295475; Wikidata Q4022315 revision 2556010446 (P18)
- 2026-11-26 | media/al-khadra-mosque-minaret-egbaria | depicts building/al-khadra-mosque-nablus | File:Al-Khadra Mosque.jpg | CC BY-SA 4.0; author معتز توفيق اغبارية | Commons file-page revision 1036204063; Wikidata Q4702683 revision 2551050591 (P18)
- 2026-11-26 | media/sidi-abderrahman-mosque-1858-moulin | depicts building/sidi-abderrahman-mosque-algiers | File:Mosquée de Sidi Abderrahmane, Alger c.1858.jpg | Public domain; author Félix-Jacques Moulin | Commons file-page revision 1265909028; Wikidata Q36698405 revision 2471716790 (P18)
- 2026-11-26 | media/badshahi-mosque-courtyard-imran | depicts building/badshahi-mosque | File:Badshahi Mosque July 1 2005 pic32 by Ali Imran (1).jpg | CC BY-SA 2.5; author Ali Imran | Commons file-page revision 1066722734; Wikidata Q330872 revision 2565020026 (P18)
- 2026-11-26 | media/jahangir-tomb-garden-front-shah | depicts building/jahangir-tomb | File:Tomb of Emperor Jahangir.jpg | CC BY-SA 4.0; author Tahsin Shah | Commons file-page revision 1212973081; Wikidata Q1678536 revision 2566633622 (P18)
- 2026-11-26 | media/eski-mosque-edirne-exterior-zeyhan | depicts building/eski-mosque-edirne | File:Eski Cami hdr.jpg | CC0; author Özgür Zeyhan | Commons file-page revision 1191619205; Wikidata Q3307794 revision 2493352965 (P18)
- 2026-11-26 | media/uc-serefeli-mosque-from-above-ggia | depicts building/uc-serefeli-mosque | File:Edirne view of Üç Şerefeli Mosque (cropped).jpg | CC BY-SA 3.0; author Ggia | Commons file-page revision 941908845; Wikidata Q3308631 revision 2542052078 (P18)
- 2026-11-26 | media/imam-ali-shrine-facade-abrahamson | depicts building/imam-ali-shrine | File:Meshed ali usnavy (PD).jpg | Public domain; author Arlo K. Abrahamson, U.S. Navy | Commons file-page revision 1262656231; Wikidata Q838359 revision 2573974092 (P18)
- 2026-11-26 | media/taj-mahal-from-the-garden-yann | depicts building/taj-mahal | File:Taj Mahal, Agra, India edit3.jpg | CC BY-SA 3.0; author Yann; edited by King of Hearts and Jbarta | Commons file-page revision 1304363535; Wikidata Q9141 revision 2574923940 (P18)
- 2026-11-26 | media/qaytbay-complex-exterior-prazeres | depicts building/qaytbay-complex-cairo | File:Qaytbay complex.jpg | CC BY-SA 3.0; author Robert Prazeres | Commons file-page revision 1179189724; Wikidata Q12242839 revision 2550703600 (P18)
- 2026-11-26 | media/barsbay-mausoleum-dome-prazeres | depicts building/khanqah-mausoleum-of-sultan-barsbay | File:Barsbay complex main mausoleum (adjusted).jpg | CC BY-SA 4.0; author Robert Prazeres | Commons file-page revision 817471518; Wikidata Q75263097 revision 2464782462 (P18)
- 2026-11-26 | media/turbe-of-idris-baba-pecs-fenoman | depicts building/turbe-of-idris-baba | File:Idrisz Baba türbéje (1780. számú műemlék).jpg | CC BY-SA 2.5 hu; author fenoman | Commons file-page revision 1215196289; Wikidata Q1095808 revision 2561171671 (P18)
- 2026-11-26 | media/ahmadiyya-mosque-akhaltsikhe-kober | depicts building/ahmadiyya-mosque-akhaltsikhe | File:Rabati, Akhaltsikhe Fortress Museum 09.JPG | CC BY-SA 3.0; author Kober | Commons file-page revision 1297161866; Wikidata Q16676199 revision 2349455943 (P18)
- 2026-11-26 | media/al-haram-al-ibrahimi-south-side-djampa | depicts building/al-haram-al-ibrahimi | File:Hebron Cave of the Patriarchs.jpg | CC BY-SA 4.0; author Djampa | Commons file-page revision 1295723129; Wikidata Q204200 revision 2563771625 (P18)
- 2026-11-26 | media/al-omari-mosque-dura-interior-sharawna | depicts building/al-omari-mosque-dura | File:مسجد العمري في دورا.jpg | CC BY-SA 4.0; author M sh شراونة محمد | Commons file-page revision 1285346963; Wikidata Q125679117 revision 2478956079 (P18)
- 2026-11-26 | media/al-zaytuna-mosque-minaret-citizen59 | depicts building/al-zaytuna-mosque | File:MinaretMosqueeZitounaTunis.JPG | CC BY-SA 3.0; author Citizen59 | Commons file-page revision 1174134170; Wikidata Q1291779 revision 2546665783 (P18)
- 2026-11-26 | media/alhambra-towers-jebulon | depicts building/alhambra | File:Alhambra detail.jpg | CC0; author Jebulon | Commons file-page revision 1149520804; Wikidata Q47476 revision 2574066140 (P18)
- 2026-11-26 | media/baba-adams-mosque-exterior-saiful | depicts building/baba-adams-mosque | File:Baba Adam's Mosque.jpg | CC BY-SA 4.0; author Md Saiful Islam Khan (Aopu) | Commons file-page revision 1074689750; Wikidata Q4837255 revision 2566969221 (P18)
- 2026-11-26 | media/bibi-ka-maqbara-garden-axis-sailko | depicts building/bibi-ka-maqbara | File:Aurangabad, Bibi Ka Maqbara, mausoleo per la prima moglie di aurangzaeb Dilras Banu Begum, 1660-69 ca., corpo centrale e minareti 04.jpg | CC BY 3.0; author Sailko | Commons file-page revision 1069204009; Wikidata Q856259 revision 2565274512 (P18)
- 2026-11-26 | media/great-mosque-of-cordoba-aerial-castillo | depicts building/great-mosque-cordoba | File:Mezquita de Córdoba desde el aire (Córdoba, España).jpg | CC BY-SA 2.0; author Toni Castillo Quero | Commons file-page revision 1186987965; Wikidata Q33200 revision 2561346443 (P18)
- 2026-11-26 | media/great-mosque-of-kufa-courtyard-stanley | depicts building/great-mosque-of-kufa | File:Kufa Mosque (4).jpg | CC BY 2.0; author David Stanley | Commons file-page revision 887485955; Wikidata Q3906396 revision 2573974341 (P18)
- 2026-11-26 | media/islamic-cultural-center-new-york-henderson | depicts building/islamic-cultural-center-ny | File:Islamic Cultural Center E96 jeh.JPG | Public domain; author Jim.henderson | Commons file-page revision 1121908441; Wikidata Q1674095 revision 2516553096 (P18)
- 2026-11-26 | media/great-mosque-of-qayrawan-overview-weetoon66 | depicts building/jami-qayrawan | File:Grande Mosquée de Kairouan, vue d'ensemble.jpg | CC BY-SA 2.0; author weetoon66 | Commons file-page revision 1277202856; Wikidata Q1255269 revision 2546879322 (P18)
- 2026-11-26 | media/kabuli-bagh-mosque-panipat-lalwani | depicts building/kabuli-bagh-mosque | File:Kabuli Bagh Mosque.JPG | CC BY-SA 3.0; author Ramesh Lalwani | Commons file-page revision 1218093501; Wikidata Q24938481 revision 2476252420 (P18)
- 2026-11-26 | media/masjid-al-khayf-minaret-dukhayn | depicts building/masjid-al-khayf | File:مسجد الخيف.jpg | CC BY 4.0; author الشيخ هيثم الدخين | Commons file-page revision 1038609260; Wikidata Q12242727 revision 2378372918 (P18)
- 2026-11-26 | media/old-mosque-stara-zagora-ivanowitsch | depicts building/old-mosque-stara-zagora | File:Stara Zagora 023.JPG | CC BY-SA 3.0; author Ivanowitsch | Commons file-page revision 1287863231; Wikidata Q20499387 revision 2332710582 (P18)
- 2026-11-26 | media/al-qarawiyyin-courtyard-hassouni | depicts building/qarawiyyin | File:University of Al Qaraouiyine.jpg | CC BY-SA 4.0; author Abdel Hassouni | Commons file-page revision 1232530665; Wikidata Q378014 revision 2570476920 (P18)
- 2026-11-26 | media/samarra-spiral-minaret-aerial-gordon | depicts place/samarra | File:The spiral minaret in Samarra.jpg | CC BY 2.0; author Jim Gordon | Commons file-page revision 1118288009; Wikidata Q170047 revision 2523649045 (P18)
- 2026-11-26 | media/tlemcen-view-from-lalla-setti-salih | depicts place/tlemcen | File:Vue sur Tlemcen depuis les hauteurs de Lalla Setti.jpg | CC BY 4.0; author Riad Salih | Commons file-page revision 1130432444; Wikidata Q185134 revision 2550287598 (P18)
- 2026-11-26 | media/granada-view-from-the-alhambra-schmitt | depicts place/granada | File:"Der Blick von der Alhambra auf Granada ist einfach atemberaubend". 01.jpg | CC BY-SA 4.0; author Holger Uwe Schmitt | Commons file-page revision 1114748237; Wikidata Q8810 revision 2574351522 (P18)
- 2026-11-26 | media/mina-plain-of-tents-rahman | depicts place/mina | File:Mina Overview.JPG | CC BY 3.0; author Mubeen Rahman | Commons file-page revision 1201530495; Wikidata Q753276 revision 2565235317 (P18)
- 2026-11-26 | media/samarqand-sher-dor-madrasa-harangozo | depicts place/samarqand | File:Sherdor madrasah 3.jpg | CC BY-SA 4.0; author Adam Harangozó | Commons file-page revision 1181191932; Wikidata Q5753 revision 2573941163 (P18)
- 2026-11-26 | media/marrakesh-jemaa-el-fna-evening-reiskoffer | depicts place/marrakesh | File:Djemaa el Fna, evening.JPG | CC BY 3.0; author Donar Reiskoffer | Commons file-page revision 1151690907; Wikidata Q101625 revision 2575265245 (P18)
- 2026-11-26 | media/wasit-ruined-gateway-salih | depicts place/wasit | File:مدينة واسط الاثرية.jpg | CC BY-SA 4.0; author Ahmed Mahdi Salih | Commons file-page revision 1085296197; Wikidata Q1462261 revision 2567917680 (P18)
- 2026-11-26 | media/balkh-green-mosque-bluuurgh | depicts place/balkh | File:15c green mosque.jpg | Public domain; author bluuurgh | Commons file-page revision 906813175; Wikidata Q182159 revision 2568558679 (P18)
- 2026-11-26 | media/ghazna-citadel-from-tapa-sardar-vemmer | depicts place/ghazna | File:Citadel of Ghazni, seen from Tapa Sardar.jpg | Public domain; author S.K. Vemmer, U.S. Department of State | Commons file-page revision 911584668; Wikidata Q173731 revision 2544209203 (P18)
- 2026-11-26 | media/tus-ferdowsi-mausoleum-kocot | depicts place/tus | File:Irnh157-Przy Mausoleum Ferdousiego.jpg | CC BY-SA 4.0; author Wojciech Kocot | Commons file-page revision 731402955; Wikidata Q681427 revision 2522091729 (P18)
- 2026-11-26 | media/sarajevo-panorama-from-the-east-nyca | depicts place/sarajevo | File:Sarajevo City Panorama.JPG | CC BY-SA 4.0; author Julian Nyča | Commons file-page revision 1137938302; Wikidata Q11194 revision 2574616493 (P18)
- 2026-11-26 | media/aden-old-town-crater-gao | depicts place/aden | File:Old Town Aden Yemen.jpg | CC BY-SA 3.0; author Jialiang Gao | Commons file-page revision 1157063620; Wikidata Q131694 revision 2574605780 (P18)
- 2026-11-26 | media/amman-hillside-view-bjorgen | depicts place/amman | File:Amman.jpg | CC BY-SA 3.0; author David Bjorgen | Commons file-page revision 1052355846; Wikidata Q3805 revision 2574785439 (P18)
- 2026-11-26 | media/baalbek-temple-of-bacchus-al-saidi | depicts place/baalbek | File:Temple of Bacchus.jpg | CC BY-SA 4.0; author Saadedine Al Saidi | Commons file-page revision 1172434022; Wikidata Q178835 revision 2572111135 (P18)
- 2026-11-26 | media/acre-old-city-aerial-israeltourism | depicts place/akka | File:Aerial view of Acre 1.jpg | CC BY-SA 2.0; author israeltourism | Commons file-page revision 888085062; Wikidata Q126084 revision 2560976719 (P18)
- 2026-11-26 | media/amasya-river-valley-ahmtzngn34 | depicts place/amasya | File:Yeşilırmak2.jpg | CC BY-SA 4.0; author Ahmtzngn34 | Commons file-page revision 1085962694; Wikidata Q170532 revision 2575062430 (P18)
- 2026-11-26 | media/busra-citadel-walls-argenberg | depicts place/busra | File:Bosra, Daraa, Syria, Citadel of Bosra, Walls.jpg | CC BY 4.0; author Vyacheslav Argenberg | Commons file-page revision 1206506777; Wikidata Q272680 revision 2532332421 (P18)
- 2026-11-26 | media/muscat-old-city-and-fort-petrosyan | depicts place/muscat | File:Old city of Maskat.jpg | CC BY-SA 4.0; author Leon Petrosyan | Commons file-page revision 1095827095; Wikidata Q3826 revision 2573445585 (P18)
- 2026-11-26 | media/tustar-shushtar-hydraulic-system-yari | depicts place/tustar | File:Shushtar Historical Hydraulic System Panorama.jpg | CC BY-SA 4.0; author Iman Yari | Commons file-page revision 1178103100; Wikidata Q643386 revision 2555713823 (P18)
- 2026-11-26 | media/mardin-hillside-town-bender | depicts place/mardin | File:Mardin, Mardin Merkez-Mardin, Turkey - panoramio (1).jpg | CC BY-SA 3.0; author Ben Bender | Commons file-page revision 1181115776; Wikidata Q188022 revision 2574377738 (P18)
- 2026-11-26 | media/al-ruha-urfa-castle-gagnon | depicts place/al-ruha | File:Urfa Castle 01.jpg | CC BY-SA 3.0; author Bernard Gagnon | Commons file-page revision 1193065837; Wikidata Q1190403 revision 2545487770 (P18)
- 2026-11-26 | media/kano-from-dala-hill-chakera | depicts place/kano | File:KanofromDalaHill.jpg | CC BY-SA 2.0; author Shiraz Chakera | Commons file-page revision 1183664321; Wikidata Q182984 revision 2550661582 (P18)
- 2026-11-26 | media/rabat-kasbah-of-the-udayas-pline | depicts place/rabat | File:Kasbah des Oudaias P1060356.JPG | CC BY-SA 3.0; author Pline | Commons file-page revision 1155791731; Wikidata Q3551 revision 2574511813 (P18)
- 2026-11-26 | media/sousse-medina-and-kasbah-bishkekrocks | depicts place/sousse | File:Sousse Kasbah.JPG | CC BY-SA 3.0; author BishkekRocks | Commons file-page revision 1272774897; Wikidata Q180717 revision 2536998935 (P18)
- 2026-11-26 | media/mostar-old-bridge-panorama-ramirez | depicts place/mostar | File:Mostar Old Town Panorama 2007.jpg | CC BY-SA 4.0; author Ramirez | Commons file-page revision 1277535143; Wikidata Q93347 revision 2573547143 (P18)
- 2026-11-26 | media/erbil-citadel-aerial-gordon | depicts place/erbil | File:Citadel (old city) of Hewlêr (Erbil).jpg | CC BY 2.0; author Jim Gordon | Commons file-page revision 1250057746; Wikidata Q132754 revision 2572044268 (P18)
- 2026-11-26 | media/alexandria-skyline-from-qaitbay-citadel-asaber91 | depicts place/alexandria | File:AlexandriaSkyline.jpg | CC BY-SA 4.0; author ASaber91 | Commons file-page revision 1045653696; Wikidata Q87 revision 2573044974 (P18)
- 2026-11-26 | media/gao-tomb-of-askia-sessoms | depicts place/gao | File:Tombeau dAskia in Gao by David Sessoms.jpg | CC BY-SA 2.0; author David Sessoms | Commons file-page revision 1172987334; Wikidata Q188904 revision 2563014322 (P18)
- 2026-11-26 | media/sijilmasa-northern-gate-hmidanix | depicts place/sijilmasa | File:The northern gate of sijilmassa Mansouria.jpg | CC BY-SA 4.0; author Hmidanix | Commons file-page revision 1211384755; Wikidata Q1334331 revision 2549935777 (P18)
- 2026-11-26 | media/malacca-river-walk-torrissen | depicts place/malacca | File:Malacca River Walk 2012.JPG | CC BY-SA 3.0; author Bjørn Christian Tørrissen | Commons file-page revision 1142752688; Wikidata Q185221 revision 2575237985 (P18)
