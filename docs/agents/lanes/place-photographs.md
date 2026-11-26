# Lane `place-photographs` — photographs of buildings and places

Opened 26 November 2026 by Claude (claude-fable-5-2). The gaming lane's survey of 25 November 2026
([`docs/gaming/adr/G-0008-atlas-image-rounds.md`](../../gaming/adr/G-0008-atlas-image-rounds.md)) found that
7 of the museum's 5,794 building records and 1 of its 1,908 exactly located places had a picture, and listed
the question "should a museum lane add photographs of buildings and places as media records" for the founder.
He started this lane's first session on 26 November 2026; that is the approval this document rests on.

Progress file: [`docs/delegation/place-photographs-progress.md`](../../delegation/place-photographs-progress.md).

## Scope

`media` records of kind `image` for photographs of buildings and places, and nothing else:

- one record per photograph, naming one subject in `depicts` (`building/<slug>` or `place/<slug>`);
- the photograph stays where it is published and is shown from its address (`url`, `thumbnail`); no image
  file enters git or the museum's storage;
- label, summary and alt text in all seven languages.

The lane does not change building or place records. A gap it finds in one (no place, a wrong identifier, a
mistranslated name) is written in the progress file for the lane that owns the record.

Lane content goes through the packet pipeline ([`../pipeline.md`](../pipeline.md)): packets of at most 25
records under `packets/drafting/place-photographs-<n>/` at the harvest root, verified by a second agent, landed
only by the lander.

## Which subjects first

A photograph serves two readers: the visitor to the building's or the place's page, and the Atlas game, which
can ask "where is this?" only when the record chain is complete (G-0008 rule 1). So the lane takes first:

1. buildings whose record names exactly one place (`location` or a `located_in` relation) that is a city, town
   or site with `coordinate_precision` of `site` or `locality`;
2. places that meet that test themselves.

`npm --prefix gaming run atlas:images` prints how many there are and how many have a picture. A place takes at
most two pictured subjects a year in a weekly image round (G-0008 rule 6), so a batch spreads its pictures over
many places before it adds a third subject to one.

## Source and how it is read

Wikimedia Commons (`source/wikimedia-commons`), reached through the subject's Wikidata item
(`source/wikidata`): the item's image statement (P18) names a file, and the file page gives the author, the
date and the licence. Both are read in the founder's Chrome. Under the rule on Wikimedia facts
([`../../delegation/wikipedia-broad-rule-proposal.md`](../../delegation/wikipedia-broad-rule-proposal.md)) each
record keeps the two revisions it was read at (the Wikidata item and the Commons file page) in `provenance`,
the ledger line in the progress file repeats them, and one page record per file goes into
`docs/authenticity-ledger/pages/commons-<media slug>.yaml`.

Harvest register entry: `web-commons-place-photographs` in `docs/library/harvest-register.yaml`. Look a file up
there before reading it again.

## What a record must have

Copy the shape of `data/media/ibn-tulun-mosque-courtyard-werner.yaml`.

| Field | Rule |
|---|---|
| `kind` | `image` |
| `url`, `thumbnail` | on `upload.wikimedia.org`, a host the site's content security policy already names in `img-src` (`site/public/_headers`); the thumbnail is the 1280-pixel rendering, or the original when it is no wider than that. Load every address once before the packet is handed over |
| `license` | read from the file page: `CC0`, `PD`, `CC-BY` or `CC-BY-SA` (`schema/enums/licenses.yaml`). The exact licence and version go in `attribution` |
| `creator` | the author as the file page names them, always for `CC-BY` and `CC-BY-SA`, and for the others when the page names one. Without a place name appended ("X from Paris" becomes "X"): the Atlas game shows the credit before the guess and refuses one that contains the answer |
| `attribution` | author, file name, date, licence with its address, the file page's address, and whatever credit line the page asks for. Never "see file page" |
| `depicts`, `relations` | one subject, written in `depicts` and once as a `depicts` relation, so the subject's page shows the picture |
| `label`, `summary`, `alt` | seven languages. The summary says what the picture shows and who took it, when, under which licence; history stays on the subject's page. The alt text describes what can be seen, written after looking at the picture |
| `sources` | `source/wikimedia-commons`, and `source/wikidata` when the file was found through the item |
| `provenance` | who wrote the record, the model, the run, the two revisions read, and how the five other languages were made |
| `status.review` | `published` under the publication standard |

## Trust criteria (the lane's own, recorded so they can be audited and reused)

- **One photograph, one author, one licence.** Montages of several photographs are not taken: their credit
  cannot be stated in one line.
- **The licence is the one on the file page on the day it is read**, and only the four whitelisted families.
  GFDL-only, the Free Art License and bare "attribution" templates are left out.
- **The picture is looked at before it is described.** A file whose name and description disagree about what
  it shows is held, not guessed.
- **Dates are written only as far as the page is clear.** A date such as 1/9/2020 is written as the year; an
  upload date is not written as the day the photograph was taken.
- **Buildings, not people.** A photograph where passers-by fill the foreground is replaced by another. Small
  figures in a courtyard are described in the alt text as what they are.
- **Recent architecture is held for the founder.** The licence on a file page covers the photograph; whether a
  recent building may itself be pictured freely depends on the country's law, and the lane does not decide it.

## Never taken

A picture whose subject is a person; any figurative depiction of prophets or Companions; anything from or about
the organisations and media named in [`../content-safety.md`](../content-safety.md), including a photograph
whose credited source is one of them or is tied to one; AI-generated images; anything the record would have to
mark sensitive; a photograph whose licence cannot be found.

Everything left out is written in the packet manifest and the progress file as a proposal for the founder,
with its reason. Nothing is decided there.

## Checks

`npm run check:packet -- <packet dir>` per packet; the lander runs the full validate per train. To see what the
records give the Atlas game, copy a packet's `files/` into a scratch checkout and run
`npm --prefix gaming run atlas:images -- --out <a file outside the repository>` (after `npm --prefix gaming ci`).
