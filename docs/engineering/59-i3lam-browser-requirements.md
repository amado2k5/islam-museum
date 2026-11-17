# 59. Muslim Media-Makers Browser — Requirements and Acceptance Tests

Original requirement (founder, verbatim): «متصفح إعلاميو المسلمون من المؤذن للخطيب للكاتب للصحافي
للإعلامي للمؤثرون للثوار — where it should list all the mentioned and written that are in quran,
seerah, sunna, tabi3een stories, quotes, mentioned and written in books that were harvested and any
future harvested book if it has a matching scope should be viewable here. add a box for it on
landing page and in navigation menus. make sure this is done end to end and full detailed proses
and make it ready for production. find all the instances where they were mentioned or part of
quotes from quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and add those stories,
mentions, quotes, details. also add this in engineering documents as the original requirements to
allow AI later on to test and validate it when it is in production.» Scope expanded in the same
request: «add the reformers, rebels, sultan or king or khalifa spokesperson, wazeer, judge, anyone
who spoke on behalf of the state; write full proses and get details as much as possible; make the
page UI unique like the other explorer pages.» URL `/i3lam/`; title «متصفح إعلاميو المسلمون» in
every locale. Companion plan: `docs/plan/67-i3lam-browser.md`.

## Acceptance tests (I3LAM-R)

- **I3LAM-R1 — Browser route.** `/[lang]/i3lam/` builds for ar, en, ur from
  `site/src/pages/[lang]/i3lam/index.astro` under `BaseLayout` with `getStaticPaths` over `LANGS`.
- **I3LAM-R2 — Role coverage.** The chain shows the named roles as `job` records: existing
  `job/muezzin`, `job/khatib`, `job/katib`, `job/diplomat` plus new `job/munadi`,
  `job/natiq-rasmi`, `job/sahafi`, `job/ilami`, `job/muaththir`, `job/muslih`, `job/thair` — each
  with trilingual prose under `content/{ar,en,ur}/job/`.
- **I3LAM-R3 — People.** Each chain role lists holders read from `occupations:` entries on person
  records — nothing inferred. First wave wires the Prophet's muezzins (Bilal, Ibn Umm Maktum, Abu
  Mahdhura, Sa'd al-Qaraz, Ziyad al-Suda'i), his orator/spokesman (Thabit ibn Qays) and the seven
  envoys of 7 AH, the scribes of revelation and the chancery secretaries, the founders of the
  Arabic press (al-Tahtawi, al-Shidyaq, al-Bustani), the rebels (al-Husayn, al-Mukhtar, al-Nafs
  al-Zakiyya, Ibn al-Zubayr, Zayd ibn Ali, Abd al-Qadir, Omar al-Mukhtar, Abd el-Krim), the
  reformers (Ibn Badis, al-Afghani, Abduh, Sa'd Zaghlul, Kishk, al-Sha'rawi) and the
  broadcast/platform figures (Amr Khaled, Ahmed Deedat, Mustafa Hosny).
- **I3LAM-R4 — State voices.** A "state speaks" section lists the offices the chain served —
  `job/caliph`, `job/sultan`, `job/king`, `job/vizier`, `job/grand-vizier`, `job/qadi`,
  `job/qadi-al-qudat`, `job/emir`, `job/wali`, `job/sahib-al-barid` — each with its recorded
  holder count.
- **I3LAM-R5 — Corpora sections.** The feed groups mentioning passages under Qur'an / Sunnah /
  seerah / books; a curated Qur'an anchor set (quran-26-224, quran-4-83, quran-5-58, quran-62-9,
  quran-33-45, quran-9-3, quran-34-13) is shown by frozen passage reference, never retyped.
- **I3LAM-R6 — Future harvest.** A passage joins the feed when the graph holds a `mentions` edge
  from it to a chain holder or media job, or the record carries the `i3lam-browser` tag — so a
  book harvested later surfaces with no edit to the page (`site/src/lib/i3lam.ts`).
- **I3LAM-R7 — Discovery.** `explorePages` holds exactly one `i3lam` entry in the `people` group;
  `explore.pages.i3lam` title/desc/menu in ar/en/ur; the landing page shows a dedicated card with
  its own emblem.
- **I3LAM-R8 — i18n.** A top-level `i3lam:` block in `i18n/{ar,en,ur}.yaml` with title, lede,
  status, method, section and corpus strings; the Arabic title «متصفح إعلاميو المسلمون» is used
  across locales.
- **I3LAM-R9 — Signature view.** `sig/I3lamTransmission.astro` ships — a transmission-line motif
  (stations on a wire, ring radius = holder count), decorative-abstract (no figurative
  depiction), fully readable with JavaScript disabled.
- **I3LAM-R10 — Content rules.** No typed Qur'an text; no honorifics; Arabic parentheticals use
  U+2066/U+2069 isolation; every record cites defined source ids with `status` and `provenance`;
  rebels and modern figures are treated neutrally per `docs/agents/content-safety.md` (no blocked
  organisation content).
- **I3LAM-R11 — Search.** The title, lede, method and core sections sit inside
  `data-pagefind-body` so the browser is findable by name.
- **I3LAM-R12 — Validation.** `npm run validate` reports 0 errors for the new records.
- **I3LAM-R13 — Production.** Merged to `main`; `/{lang}/i3lam/` reachable on the live site; the
  microSD working copy deleted after merge confirmation.

This browser is non-impacting under the change gates: it adds records, one page, one component and
i18n keys, and touches no reserved or submission-filed area.
