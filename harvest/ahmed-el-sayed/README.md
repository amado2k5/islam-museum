# Ahmed Elsayed podcast: harvest ledger

Lane `ahmed-el-sayed` (`docs/agents/lanes/ahmed-el-sayed.md`). Source record `source/podcast-ahmed-el-sayed`.

`ledger.tsv` has one row per unique episode of the public SoundCloud feed of the podcast «أحمد السيد», read on 23 November 2026: **835 episodes in 47 groups** (46 named series or talk groups and one bucket of standalone talks). It is metadata only: titles (without typed honorifics), SoundCloud upload dates, durations, and the feed's own page and audio links. The feed owner's contact address is not stored anywhere. Audio, transcripts and claims tables live in the harvest workspace (`$HARVEST/ahmed-el-sayed/`) and never enter git.

Columns: `episode_id` (stable: `<series>-<NNN>`, or `<series>-t<track id>` where the printed number is not unique or absent), `show`, `episode_no` (as printed, empty if none), `title_ar`, `date` (upload date), `duration`, `canonical_url` (the citation URL), `audio_url`, `also_on` (other platforms, empty until matched), `status`, `records_created`, `pr`, `show_slug`, `locator` (`series/epNN` for `{cite:podcast-ahmed-el-sayed ...}`), `track_id`, `note`.

Refresh with `scripts/harvest/ahmed-el-sayed/fetch_feed.py` then `build_ledger.py` (see the lane page). A refresh keeps `status`, `records_created`, `pr`, `also_on` and `note` of existing rows.

## Where the feed and the brief disagree (23 November 2026)

| Item | Brief | Feed |
|---|---|---|
| All SoundCloud items | about 1,400 | 835 in the public feed (two pages of 500 and 335); items outside the feed are not counted |
| «سيرة رسول الله» 2026 | 33 episodes | 32: numbers 1 to 33, number 28 is missing |
| «غيث الساري من هدايات البخاري» | not sized | 81 rows: numbers 1 to 84 with 49, 60 and 75 missing, plus one unnumbered row |
| «أسئلة الجيل» | not sized | 8 rows: numbers 1 to 9, number 7 missing |
| «شرح كتاب السياسة الشرعية لابن تيمية» | 6 | 1 (episode 6 only) |
| «صفوة الفوائد» | at least 8 | 6 |
| «إحياء منهاج النبوة» | 7 | 9 (7 numbered, 2 unnumbered talks) |
| «الشام وبيت المقدس في آخر الزمان» (12) and «تحرير بيت المقدس» (2) | two series | no title names either series; 14 unnumbered Sham and Jerusalem talks are grouped as `sham-bayt-al-maqdis` by their titles and flagged `inferred` |
| Audiobooks (two) | 2 | the Minhaj audiobook is `minhaj-audiobook`; the Sunan audiobook is among the standalone talks |

Numbering that repeats inside a series (numbered per book, surah, season or module) is in «أنوار الصحيحين», «المنهج الإصلاحي من سورتي الأنفال والتوبة», «بودكاست أُفُق», «أبجديات الثقافة», «الحقيبة الشرعية للجيل الصاعد» and a few small series; those rows use the track id in their locator.

`also_on` is empty: Apple Podcasts, Pocket Casts, Anghami and Podcast Republic list the same feed, and the YouTube playlists (readable for metadata only) have not been matched yet.
