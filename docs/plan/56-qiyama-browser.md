# Plan 54 — Resurrection and Reckoning Browser (متصفح البعث ويوم القيامة والحساب)

_Requested by the founder: "متصفح البعث ويوم القيامة والحساب where it should
list all the mentioned and written البعث ويوم القيامة والحساب that are in
quran, seerah, sunna, tabi'een stories, quotes, mentioned and written in books
that were harvested and any future harvested book if it has a البعث ويوم
القيامة والحساب should be viewable here. add a box for it on landing page and
in navigation menus. make sure this is done end to end and full detailed
proses and make it ready for production at the end of this. this is only about
البعث ويوم القيامة والحساب and everything mentioned about it anywhere in any
of the sunni books or quran or sunna or seerah — find all the instances where
البعث ويوم القيامة والحساب were mentioned or part of quotes from quran,
sunnah, Hadith, seerah or from sahaba and tabi'een and add those stories,
mentions, quotes, details … also add this in engineering documents as the
original requirements to allow AI later on to test and validate it when it is
in production."_

The acceptance spec for production validation is
`docs/engineering/42-qiyama-browser-requirements.md` (`QIY-R..` ids).

## 1. What it is

A browser over the one graph that gathers **the Resurrection, the Day of
Judgement and the Reckoning**: the Day's names in the Qur'an (يوم القيامة،
يوم الدين، يوم الفصل، يوم الحساب، يوم الحشر، يوم النشور، يوم البعث، يوم
التلاق، يوم التغابن، يوم الحسرة، يوم الوعيد، يوم الجمع، يوم القرار، الحاقة،
القارعة، الصاخة، الغاشية، الآزفة، الواقعة، اليوم الآخر), the Trumpet and the
two blasts (النفخ في الصور، نفخة الصعق ونفخة البعث), the raising of the dead
and the gathering (البعث، النشور، الحشر، الخروج من القبور، أرض المحشر), the
terrors (الفزع الأكبر، دنو الشمس والعرق، انشقاق السماء، تكوير الشمس), the
display and the scrolls (العرض، الصحف، أخذ الكتاب باليمين والشمال ووراء
الظهر), the reckoning (الحساب، أول ما يحاسب عليه العبد، لا تزول قدما عبد),
the Scale (الميزان وموازينه), the retaliation among creatures (القصاص، اقتصاص
الجماء من القرناء), the Shade (يوم لا ظل إلا ظله), the Hawd, the intercession
and the Praised Station (الشفاعة الكبرى، المقام المحمود), and the Sirat over
the Fire. It follows the Fire/Janna Browser architecture: passages are ordinary
graph nodes found at build time by a shared detector; curated records carry
the `qiyama-browser` tag; there is no side table and no second list.

Like its siblings, **passages are not tagged — they are detected.**
`scripts/qiyama.ts` matches a guarded qiyama lexicon against each passage's
own text, search text, label and summary, in Arabic and English. A mention of
البعث or الحساب in a book harvested next month appears here the day its
passage record lands — the founder's "any future harvested book" requirement,
met by the detector rather than by tagging.

## 2. Scope decisions

- **In scope:** every mention of the Resurrection, the Day of Judgement or the
  Reckoning — stories, mentions, quotes and details — in the Qur'an, the
  hadith collections, the seerah books and every other harvested work, plus
  the reports of the Companions and Successors that the harvested corpora
  carry.
- **Overlap is free** (founder decision, 11 Nov 2026, same as nar/janna):
  passages may appear here and in the Signs of the Hour, hisab-ledger, Fire
  or Janna browsers at once; each browser reads the same passages through its
  own lexicon.
- **Out of scope by design:** the barzakh, the grave's question and the death
  itself (القيامة الصغرى) — the pre-resurrection world stays with the Signs
  of the Hour browser; the signs of the Hour (الدجال، المهدي، يأجوج ومأجوج…)
  likewise; Paradise and the Fire have their own browsers; «الصراط
  المستقيم» the straight path of guidance and «حوض» the fiqh water-basin are
  worldly senses, not stations of the Day; worldly حساب arithmetic stays with
  the islamic-economy detector.

## 3. The lexicon (`scripts/qiyama.ts`)

Two tiers, as in `janna.ts`:

- **Strong hits** — fixed eschatological compounds and unambiguous names that
  count directly: all «يوم …» compounds, the names الحاقة/القارعة/الصاخة/
  الغاشية/الآزفة/اليوم الآخر, the Trumpet phrases (نفخ في الصور، النفختان),
  بعث الموتى/يبعث الموتى/البعث والنشور, النشور/ينشرون, الحشر/يحشرون/المحشر,
  الخروج من الأجداث/القبور, كشف عن ساق, الفزع الأكبر/أهوال يوم القيامة,
  تدنو الشمس/عرق الناس يوم, يوم العرض/يعرضون على ربك/وقفوهم إنهم مسؤولون,
  أخذ كتابه بيمينه/بشماله/وراء ظهره/صحائف الأعمال, يوم الحساب/أول ما يحاسب
  عليه العبد/لا تزول قدما عبد/حاسبوا أنفسكم/كفى بنفسك اليوم عليك حسيبا/اقترب
  للناس حسابهم, فثقلت موازينه/فخفت موازينه/الموازين القسط/نضع الموازين,
  قصاص يوم القيامة/يقتص للجماء من القرناء/أداء المظالم, لا ظل إلا ظله,
  الحوض المورود/حوضي/حوض النبي/الحوض يوم القيامة, الشفاعة الكبرى/المقام
  المحمود/لا تنفع الشفاعة, الصراط على/فوق جهنم أو النار/أحد من السيف/أضيق من
  الشعرة/الكلاليب/جواز الصراط, and the English phrases (day of resurrection,
  day of judgement, the reckoning, raised from the graves, sirat, al-hawd…).
- **Weak hits** — ambiguous lexemes that count only beside a resurrection or
  reckoning collocation in a ±60/±90 window: بعث/يبعث/نبعث (the "sending" of a
  messenger excluded), القيامة (also "standing up"), الساعة/ساعة (clock-hour
  or اشراط الساعة), حشر/يحشر/نحشر (crowd sense), الحساب/يحاسب/حاسب/حسيب
  (arithmetic), الميزان/موازين/يوزن/توزن (merchant's balance), الصراط/صراط
  (guidance's straight path), الشفاعة/يشفع/شفعاء (any mediation), نشر/ينشر
  (publishing), يعرضون/العرض (any display). The context window carries
  resurrection, grave, Day, reckoning, Scale, scrolls, Sirat, Hawd,
  intercession and terror vocabulary.
- **QIYAMA_EXCLUDE** — verified false positives excluded by id; a passage can
  always be admitted by tagging it `qiyama-browser`.

Kinds: `baath` (raising and gathering), `yawm` (the Day, its names and
terrors), `hisab` (reckoning, scale, records, crossing) — hisab wins over
baath when both signal families match.

## 4. Curated records

Thirty-six curated records land in the `curated` section (tag `qiyama-curated`):

- **23 tagged in place** — existing `eschatology-browser` records that are
  stations of the Day: `yawm-al-qiyama`, `yaum-al-bath`, `yaum-al-din`,
  `yaum-al-fasl`, `yaum-al-hasrah`, `yaum-al-hisab`, `yaum-al-mahshar`,
  `yaum-al-mizan`, `yaum-al-nushur`, `yaum-al-sirat`, `yaum-al-hawd`,
  `al-hisab`, `al-mahshar`, `al-mizan`, `al-hawd`, `al-hawd-al-nabawi`,
  `sirat`, `israfil`, `al-qiyamah-kubra`, `ashab-al-yamin`,
  `ashab-al-shimal`, `dar-al-jaza`, `akhira`.
- **13 new `concept` records** of kind `belief`, each with trilingual label,
  summary and cited prose (ar/en/ur in the same commit), sourced to the two
  Sahihs, the Sunan, the Musnad, the Muwatta, Tafsir Ibn Kathir, the
  Tahawiyya, al-Qurtubi and al-Jalalayn: `nafkhat-as-sur`,
  `ahwal-yawm-al-qiyama`, `al-faza-al-akbar`, `dunu-al-shams`,
  `suhuf-al-amal`, `al-ard`, `awwal-ma-yuhasab`,
  `al-qisas-yawm-al-qiyama`, `al-zill-yawm-al-qiyama`,
  `al-maqam-al-mahmud`, `al-nadm-wal-hasra`, `asma-yawm-al-qiyama`,
  `ard-al-mahshar`. All `status.review: draft` with provenance — AI output
  is draft-tier until a human reads it.

Excluded from tagging: `al-qiyamah-sughra` (death/barzakh — signs browser),
`al-sirat-al-mustaqim` (the straight path of guidance), `hawd-basin-water`
(the fiqh water-basin), `saa` (the measuring cup), `adhab-al-qabr`,
`al-barzakh`, `sakarat-al-mawt` and the signs figures (`dajjal`, `al-mahdi`,
`yajuj-majuj`…).

## 5. The pages and the API

- `/[lang]/qiyama/` — the browser home: badge, breadcrumb, `data-pagefind-body`
  header (title, lede, status, method note, API line), section chips, a text
  filter (`site/src/scripts/qiyama-filter.ts`), the five sections
  (quran/sunnah/seerah/books/curated) with `data-pagefind-ignore` on the
  lists, kind chips (baath/yawm/hisab) and work/ref source lines. Readable
  without JavaScript; trilingual in the same commit.
- `/api/v1/qiyama.json` — every detected passage and curated record with
  `section`, `qiyama_kind`, `signals`, work, ref, excerpt, kind, themes, tags
  and edges (`scripts/export-api.ts`).
- Explore-menu entry (`site/src/lib/nav.ts` key `qiyama`) and a landing card
  (`site/src/components/Landing.astro`, accent `#7a5a8a`, trumpet-and-rising
  motif).
- i18n: `qiyama:` blocks (menu entry + full page strings) in `i18n/ar.yaml`,
  `en.yaml`, `ur.yaml`.
- Documentation: this plan, `docs/engineering/42-qiyama-browser-requirements.md`,
  the `docs/site/browsers.md` register rows, `docs/plan/00-README.md`,
  `docs/agents/lanes.md` (`qiyama` lane), `docs/status.md`, `docs/data/README.md`,
  `site/public/openapi/v1.json`, `site/src/pages/llms.txt.ts`, CANARY.

## 6. Checks and build notes

`npm run validate` and `npm test` gate the merge; `npm run build` refreshes
the counts. `nav.ts`, `Landing.astro` and the i18n yamls are whole-site-rewrite
files (`tools/deploy/shell-paths.list`) — the PR carries the `rewrites-all-pages`
implication like every previous browser.
