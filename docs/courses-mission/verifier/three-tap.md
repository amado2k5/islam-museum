# Three-tap and no-JavaScript check (fresh-context verifier)

Claim tested: from `/<lang>/learn/courses/` (ar and en) every lesson of every course in `data/course/` is reachable in at most three taps on a phone-width screen, and with JavaScript off every lesson is still reachable and readable.

## What was tested, and how

- Build: `.cache/courses-dist`. That folder was being rebuilt by another process while I worked (it went from 1 course to 2 and the worktree HEAD moved from 650da8a to 62712390 to 31832f6). I copied it once, at 158 files, into a scratch folder and tested only that snapshot. The snapshot contains two courses (ca-on-g6-science, ca-on-g4-social-studies). The final data count matched it: 19 lessons.
- Commits: the first run started at `650da8a11c`. Reported numbers come from the snapshot taken at `62712390bf` (the snapshot was copied right after that commit, and the build's course list matches the data at that commit). HEAD moved to `31832f6a05` afterwards. I did not verify that the build is byte-identical to any single commit.
- Script: `docs/courses-mission/verifier/three-tap-check.mjs` (own static server, Playwright Chromium, 390x844, mobile and touch emulation, fresh browser context per lesson per mode). Helper diagnostics: `covered-check.mjs`, `arnojs-debug.mjs`. Raw output: `three-tap-raw-main.json`, `three-tap-raw-nojs-desktop390.json`, logs `three-tap-run*.log`.
- Method: lessons come from `data/course/*.yaml` (`kind: lesson`), with the subject found by following `part_of`. Starting on the home, the script taps only what is visible. If the target link sits inside a closed `<details>`, opening it costs one tap and is counted. It first looks for the lesson link on the page, then the subject link. After the last tap it checks the URL is the lesson's and that the lesson's own title (en or ar, from the record) appears in the page text. It also measures the length of the main text and counts `[hidden]` nodes in main. Scrolling is not counted as a tap. Before each click the script scrolls the link into view and checks with `elementFromPoint` that nothing covers it. Zero targets were covered.
- Modes: plain; JS off; localStorage pre-set with `courses:done` for all lessons plus `courses:last`; localStorage set to garbage (`{not json`).

## Numbers

| | |
|---|---|
| Lessons in data (`kind: lesson`) | 19 (16 in ca-on-g6-science, 3 in ca-on-g4-social-studies) |
| Subjects | 2, both under one jurisdiction (ca-on-english), so one school system |
| Lesson pages reached, en and ar, plain | 19 of 19 in each language |
| Tap distribution | 2 taps: 19 of 19 in every mode that completed. Worst case 2. Zero lessons needed 3. Zero unreachable. |
| Title found on landing page | 19 of 19 in every completed mode |
| Smallest lesson main text | 2,476 chars (en), 2,172 chars (ar) |
| JS page errors | 0 |
| Home with `courses:last` set | a resume button appears (1 extra shortcut, no change to the list); the jurisdiction is open; both courses stay listed |
| Home with `courses:done` full or garbage | all 19 lessons still 2 taps, en and ar |

The path: home has the jurisdiction open (`openAll` is true when there are 3 or fewer systems). Tap 1 is the course card. Tap 2 is the lesson link on the course page, a flat list where nothing is collapsed.

## No JavaScript

- English, JS off: 19 of 19 lessons reached in 2 taps, titles present, text at least 2,576 chars.
- Arabic, JS off: 19 of 19 reached in 2 taps with a desktop-type 390px context (touch off). On the mobile-emulated context (touch on, isMobile) my automated click timed out on every lesson link (19 of 19). Keyboard Enter on the same link navigated, and the same click works in a plain 390px context. I read that as a Playwright/mobile-viewport artifact, not a dead link, but I cannot rule out a real touch problem on a real phone. I did not test a real device.
- Readability: the only `[hidden]` items in a lesson's main are JS-only buttons (print, classroom view, mark done). A `<noscript>` note says what is lost. No lesson content is hidden. The home and lesson pages carry the same noscript honesty note.

## Weaknesses in the claim

1. Horizontal overflow with JS off (real, measured). At 390px with JS off, the document is 586px wide in Arabic and 680px in English; with JS on it is 390px. The overflowing elements are the site header and its nav (`header.site`, `nav.nav-links`), which are not collapsed without JS. So "readable" holds for text, but a phone user without JS must pan sideways (a WCAG reflow problem). It is the shared header, not the courses page body, and I did not check it on other site pages.
2. Arabic, JS off, mobile emulation: the click problem above. In RTL the page is also scrolled to -195px on load (viewport shows the right edge).
3. "At most three" is a property of the design only under conditions. The home lists jurisdiction, then grade, then subject cards, and the course page lists all lessons flat, so reaching a lesson takes 2 taps. `index.astro` opens every jurisdiction only when there are 3 or fewer (`openAll = tree.length <= 3`). With 4 or more school systems each is a closed `<details>`, so a lesson needs 3 taps (open system, course, lesson). That still meets "at most three", but only just: there is no slack, and it needs a flat course page. I did not build a catalogue with 4 or more systems to observe this; it is read from the code. Today's catalogue has 1 system, so the "at most three" result is untested for the many-system case, and any added layer (a collapsed unit list, pagination, a grade picker) would break it.
4. Unlisted-course holes in the code, not exercised by today's data: the home shows a subject only if its chain has a jurisdiction, then a grade that is a direct child of it, then the subject. A subject with no grade, or a lesson not under a subject or a unit of one, gets no home entry or no page. I found no build or validation gate that fails when a lesson is unreachable. "Every lesson in data/course" is true of today's data, not enforced.
5. The claim covers ar and en only. Urdu now joins the surface in this branch (COURSE_LANGS is ar, en, ur) and I did not test it. Other languages get the legacy page, also untested.
6. Not covered: real touch devices and screen readers, slow connections, the resume button path (it only gives a shortcut), and scrolling effort (long pages need scrolling that I did not count as taps).
7. The build moved under me during the check. Another process rewrote `.cache/courses-dist` and HEAD advanced three times. The numbers are for my snapshot, not for a pinned commit.

## Verdict

CLAIM HOLDS WITH LIMITS. Every one of the 19 lessons in both ar and en is reachable in 2 taps, and reachable and readable with JS off, but (a) with JS off the shared header makes the page wider than a 390px phone, (b) the 3-tap ceiling is a design property only while the catalogue has 3 or fewer school systems, and with 4 or more it is exactly 3 taps with no margin (read from code, not built), and (c) nothing in the build enforces that every lesson is linked from the home.
