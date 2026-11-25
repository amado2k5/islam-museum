# 80 — Celebratory landing-page themes for Islamic occasions

**Status:** programme defined by the founder on 24 November 2026. No theme has
been built yet. This document is the plan of record; each theme is designed,
built and shipped separately, occasion by occasion.

## The idea

On major Islamic occasions (مناسبات), the museum's landing page offers a
special celebratory theme for the occasion. The visitor is given the choice:

- **Celebrate with us** — see the landing page in its celebratory theme for
  the occasion, or
- **Skip to normal view** — go straight to the ordinary landing page, exactly
  as it is on any other day.

The theme is an invitation, never an imposition: the normal view is always
one click away, the visitor's choice is respected for the rest of the visit,
and nothing about the ordinary site changes underneath.

## The occasions and the three-day reminder

A preparation reminder fires **three days before** each occasion, so the
theme can be designed, built, reviewed and merged in good time. Dates follow
standard astronomical calculations and may shift by one day with local
crescent sighting — confirm the date when the reminder fires, before
building.

| Occasion | Hijri date | Gregorian date (expected) | Reminder |
|---|---|---|---|
| Rajab begins | 1 Rajab 1448 | Thu 10 Dec 2026 | Mon 7 Dec 2026 |
| Isra' and Mi'raj | 27 Rajab 1448 | Tue 5 Jan 2027 | Sat 2 Jan 2027 |
| Mid-Sha'ban | 15 Sha'ban 1448 | Sat 23 Jan 2027 | Wed 20 Jan 2027 |
| Ramadan begins | 1 Ramadan 1448 | Mon 8 Feb 2027 | Fri 5 Feb 2027 |
| Laylat al-Qadr | night of 27 Ramadan 1448 | Sat 6 Mar 2027 | Wed 3 Mar 2027 |
| Eid al-Fitr | 1 Shawwal 1448 | Tue 9 Mar 2027 | Sat 6 Mar 2027 |
| Dhu al-Qi'dah begins | 1 Dhu al-Qi'dah 1448 | Thu 8 Apr 2027 | Mon 5 Apr 2027 |
| Dhu al-Hijjah begins | 1 Dhu al-Hijjah 1448 | Fri 7 May 2027 | Tue 4 May 2027 |
| Tarwiyah | 8 Dhu al-Hijjah 1448 | Fri 14 May 2027 | Tue 11 May 2027 |
| Arafah | 9 Dhu al-Hijjah 1448 | Sat 15 May 2027 | Wed 12 May 2027 |
| Eid al-Adha | 10–13 Dhu al-Hijjah 1448 | Sun 16 May 2027 (four days, to 19 May) | Thu 13 May 2027 |
| Islamic New Year | 1 Muharram 1449 | Sun 6 Jun 2027 | Thu 3 Jun 2027 |
| Ashura | 10 Muharram 1449 | Tue 15 Jun 2027 | Sat 12 Jun 2027 |
| Mawlid | 12 Rabi' al-Awwal 1449 | Sat 14 Aug 2027 | Wed 11 Aug 2027 |

The reminders run as scheduled jobs owned by this programme's goal
("Celebratory landing-page themes for Islamic occasions"); one reminder per
occasion, firing once at 09:12 Toronto time on the reminder date.

## Workflow for each occasion

1. The reminder fires three days before the occasion.
2. A theme is designed for the occasion — a skin over the existing landing
   page, not a new page.
3. The theme is built on a branch, passes the light gates, and lands by pull
   request in the ordinary way, with its CANARY entry.
4. It goes live at the founder's next manual deployment, in time for the
   occasion, and is retired after the occasion ends.

## Standing rules (they bind every theme)

- No big deviations from the current functionality or UI.
- Never break the layout on any screen size — phone, tablet or desktop.
- Never break JavaScript or any functionality; never hide functionality or
  make any page unreachable or unusable.
- The celebratory theme is opt-in per visitor: a clear choice on arrival
  (celebrate, or skip to the normal view), and skipping must be instant and
  complete.
- Every visitor-readable string ships in all seven published languages
  (Arabic, English, Urdu, French, Spanish, Turkish, Indonesian) in the same
  change, with identical i18n key sets.
- Deployment stays manual, by the founder alone; a merged theme is not live
  until he deploys.

## Record

- 2026-11-24 — Programme defined by the founder; fourteen reminders set
  (first: 7 Dec 2026, for 1 Rajab 1448); this document written. No theme
  built yet.
