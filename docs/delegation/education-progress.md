# `education` progress

Lane doc: `docs/agents/lanes/education.md`. Plan: `docs/delegation/education-master-plan.md` (decisions in §9.1). Opened 23 October 2026 by Claude (Claude Fable 5.1) after the founder approved phase E1 in chat the same day.

## E1 · Front door, five band hubs, passport, study modes, share cards, QR and print

**Status:** built 23 October 2026, PR #1233 (commit `e453e888c` on `claude/islam-museum-education-plan-48575d`, merged on the founder's instruction once Validate passed).

**Routes live in ar, en and ur** (after the founder's next deploy): `/learn/` (front door), `/learn/trails/` (the chooser, moved), `/learn/passport/`, `/learn/teachers/`, `/learn/parents/`, `/sighar/sprouts/`, `/sighar/explorers/`, `/sighar/storytellers/`; study modes and a printable cut-out deck on every `/cards/list/{slug}/`; a QR code on the lesson worksheets, the kindness chart, the retell print, the pathway handout, the deck print and the passport; the kids hub and kit link the new pages. Teen doors on the front door lead to `/learn/trails/` with an "in the making" chip until E4.

**Data and strings:** `edu/bands.yaml` (5 bands), `edu/stamps.yaml` (11 stamps, rules over the existing storage keys), `edu:` block of `i18n/*.yaml` (100 keys × 3), `kids: true` on four decks (`tartib-al-anbiya`, `asma-al-ashhur-al-hijriyya`, `ashjar-al-quran`, `nabatat-al-quran`). The `accept:` spelling lists of the plan were not authored: type mode normalises diacritics, hamza seats, ta marbuta, alef maqsura and the Urdu letter forms and accepts a one- or two-letter slip, which covered the decks tried; add `accept` per item only where the review finds a miss.

**Tests added:** `scripts/edu.test.ts` (14), Urdu parity of the kids strings, `scripts/check-weight.ts` run by `npm run build` (first budgets estimated from the dev server with headroom; **next step:** read the table the Validate build prints and tighten each number toward the plan §3 ceilings).

**Verified by hand (dev server, 23 October 2026):** every new route in the three languages, no console errors; a full deck test → passport stamp → share card (PNG drawn on the device, text copied); no horizontal scroll at 390 px on the front door, a band hub and a deck page; print layouts not yet checked on paper.

**Urdu for the founder's review:** the `edu:` block of `i18n/ur.yaml` (100 strings), the `ur` fields of `edu/bands.yaml` and `edu/stamps.yaml`, and in particular the band names «کونپلیں» (Sprouts), «مہم جو» (Explorers), «کہانی گو» (Storytellers), «طالبِ علم» (Scholars), «محقّقین» (Researchers).

**Evidence (plan §7):** nothing to report yet; after the first deploy the founder reads the edge request counts for `/{lang}/learn/**` and `/{lang}/sighar/**` monthly.

**To deploy:** the merge of PR #1233 (docs + `e453e888c`); no Worker or workflow file among them; `package.json`'s `build` script now runs `check:weight`, which the Build workflow picks up as is.

## E2 · Leveled reading (top 100), Ontario pathways, mastery checks, Tell it back, shelf, weekly sheet, teacher SEO

**Status:** approved by the founder on 23 October 2026; building since E1 merged (branch `claude/education-e2-b90348`, Claude Fable 5.1). Label `non-impacting` (plan §5 E2).

**Step 1 (list only), 23 October 2026:** `edu/leveled-100.yaml` proposes the 100 records for leveled reading, in the order plan §5 E2 gives: 49 records anchor the taught topics of appendix B (46 of the 50 topics; topics 8 and 9 take three and two records so the Badr–Uhud–Trench and Hudaybiyya–conquest units are whole), 5 are the Prophet Quest prophets, 16 the Time Machine records not already picked, 8 the trail-catalogue cities not already picked, and 22 fill by inbound-link rank (edges plus prose links, counted over 35,810 records on 23 October 2026, restricted to readable classes and excluding passages, hadith transmitters, fiqh-technical concepts and first-fitna figures; the rule is in the file's header). Each record carries its id, tier, reason, raw inbound count, the prose languages present (all 100 have ar, en and ur) and whether `content/ar/…` already has the Brief section `## نبذة` (94 do; 6 need a Scholar text as well). Four topics have no anchor record and are listed under `unanchored` for the founder's decision: Muslims in Canada (no record mentions Canada), Islamic Heritage Month (no record), Muslim-made today (a wing of 116 listings, not a record), how to cite the museum (a UI page). Kuala Lumpur of the trail catalogue has no place record and is left out. Eighteen linked records that a topic needs but the 100 cannot hold are listed under `deferred` for E5. Tests: three new cases in `scripts/edu.test.ts` (100 distinct existing ids with trilingual prose and a correct Brief flag; every quest prophet, every Time Machine record and every appendix B topic either anchored or declared unanchored; the file stays `approval: pending` until the founder changes it).

**Waiting on the founder (decision 5):** approve or edit the list. Until then no leveled text is written; steps 2 to 6 below (validator rules, switcher, kids reader, pathways, mastery checks, Tell it back, shelf, weekly sheet) are built on the fixture record `event/hijra` and two others of the list, which the plan names as approved by design.
