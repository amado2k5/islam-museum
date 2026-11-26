# G-0008: Atlas image rounds: the rule is decided, and no round is built, because four pictures qualify

_25 November 2026. Status: the rule is accepted and kept as tested code; **no image round is built**. Three points are conservative defaults held for the founder. Counted at museum commit `361a669c3a5`._

## What was asked

The first item under "Not done" for Atlas: a round that shows a picture from a museum `media` record and asks where the thing shown is, scored like the other rounds. The GDD's first promise is guessing from "visual and contextual evidence", and it also says: "If source coverage is insufficient, document the gap … rather than invent evidence."

The rule for such a round was decided first, then the museum's records were counted against it. The count is the finding.

## The count

`npm --prefix gaming run atlas:images` reads every media record, the record each says it depicts, the place that record is tied to, and the image hosts in the museum's content security policy. Report: [`../evidence/m2/atlas/image-survey.json`](../evidence/m2/atlas/image-survey.json).

| | |
|---|---:|
| Media records | 895 |
| of which photographs or scans (`kind: image`) | 658 |
| **Pictures that can be a "where is this?" round** (a place or a building, free licence, one scoreable place) | **4, in 4 places** |
| Pictures that can be a "where was this made?" round under a free licence | 0 |
| The same under the V&A's terms, held for the founder (rule 3) | 8, in 4 places |
| Everything counted together | 12, in 7 places |
| Needed for one image round a week for a year (rule 6) | 52 |
| Needed for one a day | 365 |

The four: the courtyard of the mosque of Ibn Tulun (answer: al-Qata'i), a minaret of the mosque of Amr (al-Fustat), the Minaret of the Bride of the Umayyad Mosque (Damascus), and Toledo above the Tagus. The eight: V&A photographs of tiles and one bowl whose object records say they were made in Damascus, Konya, Samarqand or Rayy.

Where the other 883 fall, each record counted once, at the first rule it fails:

| Reason | Records |
|---|---:|
| A photograph of an object whose record does not say where it was made | 327 |
| A drawing or diagram (`kind: illustration`), not a photograph | 200 |
| A manuscript page or a relic (rule 2) | 140 |
| Its subject is a concept, an invention, a work or an event, not a place, building or object | 107 |
| Names no subject (`depicts` is empty) | 51 |
| An AI-generated illustration | 35 |
| Depicts a person | 9 |
| Hosted where the museum's content security policy allows no image from | 7 |
| A building whose record names no place | 3 |
| A map | 2 |
| Its place cannot be scored against (the Prophet's mosque in 1908: `place/medina` has no `coordinate_precision`) | 1 |
| The licence asks for the author and the record names none (the Kutubiyya minbar) | 1 |

**The museum's pictures are of objects, and its buildings and places have almost none.** 476 media records depict an object, 267 an invention, 64 a concept; 7 depict a building and 1 a place. Of the museum's 1,908 places a guess can be scored against, one has a picture. Of its 5,794 building records, seven do.

## Decision

1. **An image round is a media record joined to a museum place through the record it says it depicts.** The media record is a photograph or scan (`kind: image`) and its `depicts` names exactly one place, building or object; a concept or an invention may be named beside it. A place is its own answer. A building's answer is the one place in its `location` field or `located_in` relations. An object's answer is the one place in its `made_in` field or relation, and the question then is "where was this made?", which is the GDD's artifact-origin mode and is counted apart; an object is never asked "where is it kept?". The place must pass G-0006 rule 2 (a city, town or site, coordinates of `site` or `locality` precision). The game writes no caption, no join and no coordinate of its own.
2. **Never an image round:** an illustration or a map; anything under the licence `AI-GENERATED` (the Founder's Charter: an AI image is the model's imagining from the graph, never a depiction of its subject, so there is no "thing shown" to locate); any record that depicts a person (the museum shows no figurative depiction of prophets or Companions, and from a record the game cannot tell who is pictured or how, so no pictured person is made a question); an object of kind `folio`, `manuscript` or `relic` (the game cannot tell a page of the Qur'an or a figurative miniature from any other leaf); and anything where the media record, its subject or the place carries a `sensitivity` field.
3. **Licence.** `CC0`, `PD`, `CC-BY`, `CC-BY-SA`. A `CC-BY` or `CC-BY-SA` record must name the author in `creator`; a picture that cannot be credited is not shown. `VAM-NC` is on the museum's whitelist, but it is the V&A's permission for the museum's pages on the V&A's terms (non-commercial, credited, embedded by URL, 768 pixels at most, as each record's attribution says). Whether a game is the same use is the founder's to say; until he does, those pictures are counted and left out.
4. **Credit that does not give the answer away.** Before the guess, the line under the picture holds the author, when the record names one, and the licence, linked to its text. Nothing else from the record is on the page: not its label, summary, `alt`, attribution text or file name, because each of them usually names the subject (all four qualifying records do so in their attribution, and two in their English `alt`). The builder refuses a record whose author's name contains the name of the subject or the place. At the reveal the page shows the record's label, its full attribution text exactly as the record has it, the licence, and links to the media record and to the subject on islam.museum.
   **Alt text.** Before the guess the `alt` is a fixed sentence in seven languages that says a photograph is shown and that it is described with the answer; the record's own `alt` is given at the reveal. A picture round therefore cannot be played without sight. So every scheduled image round is pinned in the pack together with a text round as its alternate, scored the same way, which the player can choose instead and which the game uses for everyone if the picture fails to load.
5. **How the picture reaches the player.** The browser loads it from the address in the media record, as the museum's own pages do, or from the museum's own media storage for the few pictures the museum hosts itself. No image file enters git and the game copies none to the museum's storage. A remote address must be on a host that `img-src` of the museum's content security policy already names; the builder reads that list from `site/public/_headers` (today `upload.wikimedia.org`, `thumb.wikimedia.org`, `images.metmuseum.org`, `framemark.vam.ac.uk`, `openaccess-cdn.clevelandart.org`). The seven image records on other hosts are left out; adding a host is a hosting change and the founder's. **Image rounds as decided here need no hosting change.**
   Three things this does not settle. It has not been tested against the real policy: the game is not deployed, the dev server sends no policy, and the release model (G-0004) is not approved. A pinned pack points at a file someone else can rename or delete; the alternate round of rule 4 is the answer to that. And the file's name is in its address (`Toledo_And_Tajo_River.jpg`), so a player who opens the picture in a new tab can read it; this is the same leak as the pack file, which already holds every answer, and it is accepted while scores stay on the device and are not ranked. A ranked game would need pictures served under opaque names from the museum's own storage, which is a hosting change.
6. **How image rounds enter the schedule.** With a new pack version (a round type `image` carrying the media id, the address, the author and the licence), never by changing version 1. An image round takes the fifth slot of a day, the one that today goes to whichever category has most left; the other four slots and the daily minimum (one civic, two people, one military) stay. Every existing check applies to it: five different places, three regions, no round twice in the year, no place again within 14 days. Three checks are added: no picture twice in a year, one picture per subject in a year, and an image answer at the same place at most twice a year for a weekly round or four times for a daily one. That makes the supply needed **52 usable pictures for one image round a week and 365 for one a day**, and below 52 none is scheduled and none is offered in practice.

**What of this is code and what is only decided.** Rules 1 to 3, the author check of rule 4, the host check of rule 5 and the supply test of rule 6 are `gaming/games/atlas/src/images.ts` (`judgeImage`, `imageHosts`, `imageSupply`), with 16 unit tests on records written for the tests. The rest of rules 4 to 6 is design and nothing of it is written: the round and reveal screens, the fixed alt sentence in seven languages, the alternate round, the pack format and the added schedule checks.

## Why nothing is built on four pictures

- **A round type met on four days in 365 is not part of the game.** The schedule's guarantee is that no round returns within the year. Four pictures give four days.
- **Showing the same few pictures again turns a geography question into remembering a picture.** With four places, or seven on the widest count, the set of possible answers is small enough to learn by heart.
- **The widest count is under a quarter of the smallest need** (12 against 52), and eight of those twelve wait on a licence ruling and answer a different question.
- A pack rebuild changes every day's game. That is acceptable only while nobody plays, and it should buy more than four rounds.

## Why not the alternatives

- **Use the AI illustrations of events** (35 exist, each tied to a place through its event). They are imagined scenes. Asking where one "is" would present an imagining as evidence.
- **Ask where an object is kept.** The holding institution is free text in the object record, not a place id, and the answers would be three or four cities.
- **Read a place out of an object's title** ("Damascus Tile"). That is the game inventing a join the record does not make. Of the 471 objects the museum has a photograph of, 11 say where they were made and 460 do not.
- **Choose pictures from Wikimedia Commons for the game directly.** A picture with no media record has no licence audit, no credit and no source in the museum. G-0006 already answers this: a record, a place, a source.
- **Copy the image files into the repository or the museum's storage.** Against the repository's rule on media files in the first case, and a hosting change in the second.

## What would change the answer

The cure is in the museum's records, not in the game, and none of it is the gaming lane's to write (`data/` is lane content and goes through the packet pipeline).

- **Photographs of buildings and places as media records.** 214 building records name exactly one place a guess can be scored against; 98 of those carry a Wikidata id; 3 have a picture. The shortest road to a weekly image round is a media record for 52 of those buildings, or of the 1,908 scoreable places, over at least 26 places: a photograph on an allowed host under a free licence, with the author in `creator` when the licence asks for one.
- **Buildings tied to a place.** 247 of 5,794 building records name exactly one place. Three free photographs of buildings are already recorded and hosted by the museum itself (the Büyükçekmece Bridge, the Galata Tower, Lusail Stadium). They cannot be used because their building records name no place; two of them would then also need the author, who is named in the attribution text, written in `creator`.
- **Where objects were made.** 460 of the 471 pictured objects have no `made_in`.
- **An author for the Kutubiyya minbar photograph**, whose attribution reads "see file page for author and licence".
- **A precision for `place/medina`**, which keeps the 1908 photograph of the Prophet's mosque out; whether that picture should be a question at all is for the founder.

## Needs the founder

- **Rule 3.** Whether V&A photographs under `VAM-NC` may be shown in a game. Default in force: no.
- **Rule 2.** Whether a manuscript page may ever be a picture question, and on what terms. Default in force: no.
- **Rule 6.** Whether 52 and 365 are the right thresholds, and whether an image round should take the fifth slot. They are the agent's judgement.
- **Whether a museum lane should add photographs of buildings and places as media records.** It serves the museum's own pages as much as the game.

## Consequences

- Atlas stays a game of names and dates. Pack version 1, the rules, the schedule and the screen are unchanged by this record.
- The count can be taken again at any time with `npm --prefix gaming run atlas:images`. When it reports `enoughForAWeeklyImageRound: true`, image rounds are built to rules 4 to 6 without reopening this decision.
- The pack builder noticed gaps in the museum's place data; this survey does the same for its pictures. They are listed in [`../games/atlas.md`](../games/atlas.md) for the lanes that own the records.
