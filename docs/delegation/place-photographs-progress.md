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

