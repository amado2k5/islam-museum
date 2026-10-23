# `education` progress

Lane doc: `docs/agents/lanes/education.md`. Plan: `docs/delegation/education-master-plan.md` (decisions in §9.1). Opened 23 October 2026 by Claude (Claude Fable 5.1) after the founder approved phase E1 in chat the same day.

## E1 · Front door, five band hubs, passport, study modes, share cards, QR and print

**Status:** built 23 October 2026, PR #1233 (commit `e453e888c` on `claude/islam-museum-education-plan-48575d`, merged on the founder's instruction once Validate passed).

**Routes live in ar, en and ur** (after the founder's next deploy): `/learn/` (front door), `/learn/trails/` (the chooser, moved), `/learn/passport/`, `/learn/teachers/`, `/learn/parents/`, `/sighar/sprouts/`, `/sighar/explorers/`, `/sighar/storytellers/`; study modes and a printable cut-out deck on every `/cards/list/{slug}/`; a QR code on the lesson worksheets, the kindness chart, the retell print, the pathway handout, the deck print and the passport; the kids hub and kit link the new pages. Teen doors on the front door lead to `/learn/trails/` with an "in the making" chip until E4.

**Data and strings:** `edu/bands.yaml` (5 bands), `edu/stamps.yaml` (11 stamps, rules over the existing storage keys), `edu:` block of `i18n/*.yaml` (100 keys × 3), `kids: true` on four decks (`tartib-al-anbiya`, `asma-al-ashhur-al-hijriyya`, `ashjar-al-quran`, `nabatat-al-quran`). The `accept:` spelling lists of the plan were not authored: type mode normalises diacritics, hamza seats, ta marbuta, alef maqsura and the Urdu letter forms and accepts a one- or two-letter slip, which covered the decks tried; add `accept` per item only where the review finds a miss.

**Tests added:** `scripts/edu.test.ts` (14), Urdu parity of the kids strings, `scripts/check-weight.ts` run by `npm run build`. Calibrated on the first production build (23 October 2026, 118,388 pages, 0 errors): the budgets are now the plan §3 family ceilings, and the measured pages (markup with the inlined CSS) were:

| Route | HTML | Budget |
|---|---|---|
| `/ar/learn/` | 92.5 KB | 170 KB |
| `/ar/sighar/sprouts/` · `/explorers/` · `/storytellers/` | 101.6 · 107.6 · 110.4 KB | 170 KB |
| `/ar/learn/teachers/` · `/ar/learn/parents/` · `/ar/learn/passport/` | 94.7 · 86.9 · 98.0 KB | 170 KB |
| `/ar/sighar/quest/` (after the sprite) · `/kindness/` · `/mosque/` | 107.3 · 135.5 · 123.6 KB | 210 KB |
| `/ar/cards/list/tartib-al-anbiya/` (with study modes) | 133.6 KB | 210 KB |
| `/ar/sighar/teachers/lessons/quest/` | 105.2 KB | 200 KB |
| `/ar/learn/trails/` | 270.9 KB | 600 KB |

Page scripts are 0.3 to 11.8 KB per route (inline module scripts plus the hashed files and the chunks they import).

**Verified by hand (dev server, 23 October 2026):** every new route in the three languages, no console errors; a full deck test → passport stamp → share card (PNG drawn on the device, text copied); no horizontal scroll at 390 px on the front door, a band hub and a deck page; print layouts not yet checked on paper.

**Urdu for the founder's review:** the `edu:` block of `i18n/ur.yaml` (100 strings), the `ur` fields of `edu/bands.yaml` and `edu/stamps.yaml`, and in particular the band names «کونپلیں» (Sprouts), «مہم جو» (Explorers), «کہانی گو» (Storytellers), «طالبِ علم» (Scholars), «محقّقین» (Researchers).

**Evidence (plan §7):** nothing to report yet; after the first deploy the founder reads the edge request counts for `/{lang}/learn/**` and `/{lang}/sighar/**` monthly.

**To deploy:** the merge of PR #1233 (docs + `e453e888c`); no Worker or workflow file among them; `package.json`'s `build` script now runs `check:weight`, which the Build workflow picks up as is.

## E2 · Leveled reading (top 100), Ontario pathways, mastery checks, Tell it back, shelf, weekly sheet, teacher SEO

**Status:** approved by the founder on 23 October 2026; starts after E1 merges. First PR: the proposed `edu/leveled-100.yaml` with demand evidence per record, for the founder's approval before any leveled text is written.
