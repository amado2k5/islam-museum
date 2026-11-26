# Atlas: the picture collection and the globe's data

_Written 26 November 2026 at the founder's request ([`../spec-production/owner-decisions-2026-11-26-b.md`](../spec-production/owner-decisions-2026-11-26-b.md), O5 and O6). **Nothing has been imported and no picture round exists.** The dataset table below is what he asked to see before any data is brought in. Licences were read at their sources on 25 and 26 November 2026 by an AI agent, NASA's media guidelines in the founder's own Chrome; where something could not be read, the table says so and proposes nothing._

## Pictures: the target is 52, and none is ready

One new picture round a week for a year needs **52 qualified pictures** over at least 26 places (decision [G-0008](../adr/G-0008-atlas-image-rounds.md)). The threshold is not lowered to reach it. If 52 cannot be found responsibly, the schedule waits or thins; nothing weak or unlicensed fills the gap.

**Where the collection stands:** 4 candidates, 0 complete, 48 more to find.

### What every picture needs (founder, 26 November 2026)

| | Requirement |
|---|---|
| a | Rights and licence verified |
| b | Permanent source and attribution |
| c | Tied to a museum record |
| d | Accurate place, date and subject |
| e | Useful alt text |
| f | Suitable resolution and crop |
| g | No watermark, no misleading restoration |
| h | Historical and contextual review |
| i | A fair clue that the picture does not at once give away |
| j | Labelled as a reconstruction, an illustration or a modern photograph where it is one |

### The four candidates

All four are photographs on Wikimedia Commons, used today by the museum by address and unaltered. Licence, author, date and size were re-read from Commons itself on 26 November 2026 and agree with the museum's records.

| Museum record | Shows, and the answer | Licence, author, date | Size | a | b | c | d | e | f | g | h | i | j |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `media/ibn-tulun-mosque-courtyard-werner` | The courtyard of the mosque of Ibn Tulun (`building/masjid-ibn-tulun`); al-Qata'i | CC BY 3.0; Berthold Werner; 4 November 2010 | 7190 × 2161 | read at source; no person has checked | yes | yes | not reviewed | Arabic, English, Urdu; four languages missing | size yes; crop not chosen | not looked at | pending | not written | to be labelled: modern photograph, 2010 |
| `media/mosque-of-amr-minaret-2011` | A minaret on the wall of the mosque of Amr (`building/masjid-amr-fustat`); al-Fustat | CC0; Protious; 10 December 2011 | 2976 × 3968 | read at source; no person has checked | yes | yes | not reviewed; the record says the minaret is later than the mosque | three languages; four missing | size yes; crop not chosen | a street lamp is in the frame; not otherwise looked at | pending | not written | to be labelled: modern photograph, 2011 |
| `media/shatir-sundial-minaret-context` | The Minaret of the Bride, Umayyad Mosque (`building/umayyad-mosque`); Damascus | CC BY-SA 3.0; Bernard Gagnon; 31 March 2010 | 2592 × 3456 | read at source; no person has checked | yes | yes | not reviewed | three languages; four missing | size yes; crop not chosen | not looked at | pending | not written | to be labelled: modern photograph, 2010 |
| `media/toledo-tajo-context` | Toledo above the Tagus (`place/tulaytula`); Toledo | CC BY-SA 3.0 Spain; Gaguilarq; 28 September 2013 | 2200 × 1451 | read at source; no person has checked | yes | yes | not reviewed | three languages; four missing | size yes; crop not chosen | not looked at | pending | not written | to be labelled: modern photograph, 2013 |

**What stands between these four and a round:**

- A person's check of each licence (a), and a reviewer's look at each (d, g, h): both wait on people who are not named.
- Alt text in French, Spanish, Turkish and Indonesian (e), and a clue for each (i): the developer's to write, the clue from the museum record alone.
- A decision on cropping (f). Two of the four are share-alike: a cropped or altered copy must carry the same licence and say it was changed. Shown whole and unaltered, they need only their credit.
- Where they are served from. The games' host allows pictures only from itself; the museum shows these from Wikimedia by address. A picture round therefore needs each picture kept as media on the games' host, with its credit and licence beside it, which is a copy and must follow each licence.

### The eight held pictures

Eight photographs of tiles and one bowl from the Victoria and Albert Museum qualify by subject (made in Damascus, Konya, Samarqand or Rayy). Their terms are the V&A's own: non-commercial use, credit required, at most 768 pixels, shown by address and never copied. They cannot be kept on the games' host or put in an offline package under those terms. **They stay held and are not counted toward the 52.** Using them at all remains the founder's decision.

### Where the other 48 can come from

The museum has 214 records of buildings that name one place a guess can be scored against (survey of 25 November 2026, museum commit `361a669c3a5`). Three of them have a picture record. The gap is pictures, not places: freely licensed photographs of those buildings, each brought in as a museum media record with its source, by the museum's own media work, and then put through the ten requirements above. That work can run beside Granada (decision O7). Each picture found is added to this table; none is counted before every column is met.

## The globe's data

The target image shows relief, rivers, cloud and night lights. The founder's conditions for any data set: public domain, CC0 or otherwise compatible with redistribution in a static game; attribution recorded and shown where required; derivative use allowed; no paid service at run time; a size the supported browsers can carry; version, source, download date and processing written down; no misleading historical meaning; the plain globe still working as a fallback.

### What was read at each source

| Data set | For | Licence, as the source states it | Redistribution and derived work | Credit | Limits stated | Version | Size | Verified |
|---|---|---|---|---|---|---|---|---|
| **Natural Earth II**, raster with shaded relief | The land's colour and relief | Public domain; the terms say the data are "in the public domain" | Allowed, including modified and commercial; no permission needed | Not required; "Made with Natural Earth." is suggested | No responsibility accepted for accuracy. Some inputs were licensed to Natural Earth for making a base map; the page does not say this narrows reuse | 3.2.0 | 21,600 × 10,800: 192 MB zipped; 16,200 × 8,100: 111 MB | **Yes**, on its terms and download pages |
| **Natural Earth**, 50m physical vectors | Rivers, lakes, coastline | The same | The same | The same | The same | Bundle 5.1.0; rivers and lakes 5.0.0 | Rivers 0.5 MB; lakes 0.25 MB; all themes 7 MB | **Yes** |
| **ETOPO 2022** (NOAA) | Heights, to shade relief from the sun's angle and to mark mountains | CC0 1.0, stated on its metadata page | Allowed under CC0 | A citation is requested, not required | "Not to be used for navigation"; no warranty | Published 1 October 2022 | 15, 30 and 60 arc-second grids; file sizes not stated on the pages read | **Yes**, on the DOI's metadata page. The product page itself states no licence |
| **GEBCO 2026 grid** | An alternative to ETOPO, with the sea floor | Public domain, free of charge, under its terms of use | May be copied, adapted and used commercially | **Required**: the source acknowledged, in the form its documentation gives | No suggestion of endorsement by GEBCO, the IHO or the IOC; not for navigation | GEBCO_2026 | 15 arc-second; 4 GB zipped | **Yes**, on its terms page |
| **NASA Blue Marble: Next Generation** | A photographic land surface | Not stated on the data set's own page. NASA's media guidelines: its content, texture maps named among it, is generally not under copyright in the United States | Use allowed for educational or informational purposes, "computer graphical simulations" and web pages named among them | NASA acknowledged as the source | No implied endorsement; NASA's insignia are not free to use; anything of a third party's is marked and needs its owner's leave | Monthly composites, listed 2005 | 5,400 × 2,700 and 21,600 × 10,800; sizes not stated | **In part.** The guidelines were read on 26 November 2026. Earth Observatory's own image-use page no longer exists: its address leads to a landing page that links only to these guidelines. Whether this data set carries any third-party mark was not checked |
| **NASA Blue Marble: Clouds** | A cloud layer | The same guidelines would govern it | As above | As above | As above | Not verified | Not verified | **No.** The data set's own page could not be found: its address leads to a landing page |
| **NASA Black Marble 2016** | City lights on the night side | Not stated on the data set's own page; the same guidelines | As for Blue Marble | NASA acknowledged as the source | As for Blue Marble | Lights as observed in 2016 | 3,600 × 1,800, 13,500 × 6,750, and 500 m tiles | **In part**, as for Blue Marble |

### What is proposed, for the founder's approval before anything is brought in

1. **Relief, rivers and lakes: Natural Earth and ETOPO 2022.** Both are verified as public domain or CC0, need no paid service, and can be cut to sizes a browser carries. Proposed textures: 8,192 × 4,096 on the high preset, 4,096 × 2,048 on medium, 2,048 × 1,024 on low. **Their file sizes and their cost in memory are not known until they are made and measured**, and are reported before anything ships.
2. **Cloud: drawn by the game, from no data set.** A real day's cloud is a photograph of one day's weather and means nothing for a question about the past; a drawn layer has no licence to check and no date to mislead. No cloud data is proposed.
3. **The night side: dark, with no lights, during a round.** Modern city lights mark modern cities and can give an answer away. Night lights are not proposed for now, and that is a choice about fairness and meaning, not about licence: NASA's guidelines appear to allow such use with credit. If wanted later as a labelled view of the present, shown only after an answer or in free looking, the data set's own files are first checked for third-party marks and it is brought back in this table.
4. **GEBCO** is held in reserve: sound, but its required credit and its 4 GB make ETOPO the lighter choice.
5. **The record kept for each set brought in:** source address, version, date downloaded, checksums of what was downloaded, the commands that made the textures, and the checksums of the results, in the art manifest. The files are media: on the games' host, never in git.
6. **Credit shown in the game** even where none is required: "Made with Natural Earth" and the ETOPO citation, on Atlas's own "about" panel.
7. **The fallback stays:** the globe drawn from the coastline alone, which needs none of this, for a weak machine, a failed download or the offline package.

**Approval asked:** Natural Earth (raster and vectors) and ETOPO 2022, as above. Nothing is downloaded into the project until the founder says so.
