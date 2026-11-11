# Brief: review the rendered pages from the committed screenshots (fresh-context reviewer)

You did not build these pages. You have not seen their source. Your job is to look at screenshots and list every
visible defect. You are not here to say the pages look fine.

## What you have

`docs/fable-run/vision/shots/` holds screenshots of rendered pages of islam.museum, a museum site in Arabic
(right-to-left) and English, taken from a production build at three widths: phone (390 px), tablet (820 px) and
desktop (1280 px). `docs/fable-run/vision/shots/index.json` lists every file with its page, language, width, the
page's full height, the height shown (shots are cut at 3,200 px; taller pages continue below the cut) and the
sideways overflow measured in the page.

File names: `<lang>-<page>-<size>.jpg`. Pages:
- `river`: the entrance of a new guided tour, "the River of Time": centuries as one horizontal band the visitor
  scrolls, with numbered stops on it. In Arabic the band flows right to left.
- `room-first`, `room-badr`, `room-last`: three of the tour's rooms (one stop each): a banner with the name and date,
  a ribbon of centuries showing where the visitor stands, a narrative with footnote numbers, a boxed line of counts,
  a list of sources, previous and next buttons, and "side door" cards.
- `complete`: the tour's last page: a count, a drawing of the route as numbered circles joined by a gold line over
  nine lanes, and nine cards.
- `home`: the site's existing homepage.
- `wing-time`, `wing-place`, `wing-people`, `wing-ideas`, `wing-objects`, `wing-words`, `wing-living`, `wing-today`,
  `wing-made`: the site's nine existing "wing" landing pages.

Open the images with the Read tool (it shows images). Look at every file assigned to you. Do not open any file
outside `docs/fable-run/vision/` and do not read the site's source: the point is that you judge what a visitor sees.

## What counts as a defect

Anything a careful visitor or designer would call wrong on the page as rendered:

- text cut off, overlapping, running out of its box or under another element; a label wrapped into an unreadable shape;
- two pieces of text run together with no space ("TitleSubtitle");
- an element pushed off the edge, or a page that visibly needs sideways scrolling (check `horizontalOverflowPx` too);
- wrong direction: in Arabic, something aligned or ordered left-to-right that should mirror (arrows pointing the wrong
  way for "next", a list or band starting from the wrong side, punctuation or parentheses on the wrong side of a
  phrase, a Latin fragment breaking an Arabic line badly);
- text too small to read at that width, or with too little contrast against its background;
- controls crowded or misaligned (buttons of different heights in a row, a slider squeezed, chips colliding);
- empty areas that look broken (a large blank block, a card with no content, a missing image frame);
- inconsistency between the Arabic and English versions of the same page at the same width (an element present in one
  and missing in the other);
- inconsistency between the tour's pages and the site's existing pages (a different header, a heading style that
  does not belong);
- raw markup, placeholder text, an untranslated string, a number that looks wrong on its face.

Not defects: the content of the text itself (you are not checking facts), and the bottom of a screenshot being cut at
3,200 px.

## What you write

`docs/fable-run/vision/review-<your letter>.md`:

```markdown
# Vision review <letter>

Screenshots looked at: <n> of <n assigned>. Defects: <n>.

| Id | Screenshot(s) | Where on the page | What is wrong | Severity |
|---|---|---|---|---|
| <letter>1 | ar-river-phone.jpg | the control row above the band | the "earlier" and "later" buttons wrap under the slider and sit on different lines | minor |
```

- Ids are your letter and a number: `<letter>1`, `<letter>2`, ...
- Severity: `major` (content unreadable, unreachable or visibly broken), `minor` (a flaw a visitor would notice),
  `cosmetic` (a polish matter).
- One row per distinct defect; list every screenshot where you saw it.
- If a page has no defect at a width, do not write a row for it. At the end, list the files you looked at and found
  nothing wrong in, so I can tell "clean" from "not looked at".

Be specific enough that someone who cannot see the image could find the place.

## Limits

Read-only except for your one review file. No git commands that change state. Do not open the site's source code.

## Report back (short)

Counts by severity, then every major defect in a line each.
