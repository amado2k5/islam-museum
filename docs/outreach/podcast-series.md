# The children's podcasts — Hudhud's Story Time and «وقت حكايات هدهد»

The media and outreach record of the museum's two children's story series:
what they are, the full catalogue, where they are published, and what remains
to be done. Written 20 November 2026; every fact below was verified on that
date. When a fact here changes, update this document in the same pull request.
How the series are made — voices, scripts, picture-books, the pre-publish
quality gate and the feed — is recorded in the engineering document
[65 · Podcast pipeline](../engineering/65-podcast-pipeline.md).

## 1. What the series are

Two story series for children, made for the museum's Kids' Wing
(«جناح الصغار») and told by a grandfather and a grandmother. Every story is
drawn from the museum's own records, and every episode's description carries
the direct link to the record the story came from, so a child — or a parent —
can go from the story to the museum page behind it. The voices are generated
with ElevenLabs and are disclosed as AI-generated in every episode
description.

- **English series — "Hudhud's Story Time."** Ten stories, recorded,
  completed and published on YouTube on 19–20 November 2026.
- **Arabic series — «وقت حكايات هدهد».** Ten different stories — not
  translations of the English ones — in Modern Standard Arabic only.
  Completed and published on YouTube on 20 November 2026.

## 2. English catalogue — "Hudhud's Story Time"

Playlist "Hudhud Bedtime Stories":
https://www.youtube.com/playlist?list=PLWNwHwKNZ720

| # | Title | Museum source | YouTube |
|---|-------|---------------|---------|
| 1 | The Man Who Tried to Fly | https://islam.museum/en/person/abbas-ibn-firnas/ | https://youtu.be/JjWjcIJTnow |
| 2 | The Elephant Clock | https://islam.museum/en/person/al-jazari-engineer/ | https://youtu.be/XdQO3zt3nEg |
| 3 | The Longest Journey | https://islam.museum/en/person/ibn-battuta-muhammad/ | https://youtu.be/jkfwgIICI9s |
| 4 | The Woman Who Built a University | https://islam.museum/en/person/fatima-al-fihri/ | https://youtu.be/Ed9vSMQznLk |
| 5 | The House of Wisdom | https://islam.museum/en/place/baghdad/ | https://youtu.be/EkoLzkjC7Gk |
| 6 | The Doctor Who Listened to the Heart | https://islam.museum/en/person/ibn-al-nafis/ | https://youtu.be/uW1YRhTrUW0 |
| 7 | The Star Counters | https://islam.museum/en/person/al-khwarizmi/ | https://youtu.be/RpqAYH6_Iak |
| 8 | The Monkey and the Tortoise | https://islam.museum/en/work/kalila-wa-dimna/ | https://youtu.be/WwNHaRboN7U |
| 9 | The Man Who Played with Light | https://islam.museum/en/person/ibn-al-haytham/ | https://youtu.be/OxhQeo_tUPA |
| 10 | The Silver Map | https://islam.museum/en/person/al-idrisi-muhammad-ibn-abd-allah/ | https://youtu.be/1pBr_LwP5k0 |

Two notes on this list. All ten episodes are flip picture-books: Episode 1
was made as one from the start, and Episodes 2–10 were remade as flip
picture-books on 20 November 2026. The earlier cover-art versions remain
Public on the channel, outside the playlist — Episode 1's is at
https://youtu.be/qqW_cuoi6Pk. Episode 4's video is the repaired version:
the first recording had a synthesis fault, and its video stays private.

## 3. Arabic catalogue — «وقت حكايات هدهد»

Playlist «حكايات هدهد»:
https://www.youtube.com/playlist?list=PLV0b2zKGW6I8

| # | Title | Museum source | YouTube |
|---|-------|---------------|---------|
| 1 | «الملك الذي عبر الصحراء» (Mansa Musa) | https://islam.museum/ar/person/mansa-musa/ | https://youtu.be/SqlXf2mPaAg |
| 2 | «الولد الذي شفى الأمير» (Ibn Sina) | https://islam.museum/ar/person/ibn-sina/ | https://youtu.be/hI7oB0-ZGs8 |
| 3 | «الأميرة الشاعرة» (Wallada) | https://islam.museum/ar/person/wallada-bint-al-mustakfi/ | https://youtu.be/ST9qI43IDO8 |
| 4 | «الجرّاح الذي رسم أدواته» (al-Zahrawi) | https://islam.museum/ar/person/al-zahrawi/ | https://youtu.be/64P4Of95-9o |
| 5 | «البيروني يقيس الأرض» (al-Biruni) | https://islam.museum/ar/person/al-biruni-muhammad-ibn-ahmad/ | https://youtu.be/dr5cw0RVXMw |
| 6 | «الجاحظ يحكي عن الحيوان» (al-Jahiz) | https://islam.museum/ar/person/al-jahiz/ | https://youtu.be/PR0m0dFZheg |
| 7 | «ابن جبير يكتب رحلته» (Ibn Jubayr) | https://islam.museum/ar/person/ibn-jubayr-muhammad/ | https://youtu.be/IzU03t78rK0 |
| 8 | «مكتبة تنبكتو الذهبية» (Timbuktu) | https://islam.museum/ar/place/timbuktu/ | https://youtu.be/DoJPb1_JVN8 |
| 9 | «السندباد يبحر من جديد» (Alf Layla wa Layla) | https://islam.museum/ar/work/alf-layla-wa-layla/ | https://youtu.be/bO7_ajSroMM |
| 10 | «الخليل وميزان الشعر» (al-Khalil) | https://islam.museum/ar/person/al-khalil-ibn-ahmad-al-farahidi/ | https://youtu.be/edePxU2aKbA |

All twenty videos across both series are Public, marked made for kids, and
passed YouTube's copyright and Community Guidelines checks with no issues.

## 4. Distribution status

- **YouTube — complete.** Both series, all twenty episodes, published
  20 November 2026 (the English series began publishing on 19 November).
- **Museum RSS feed — live.** The English feed
  (`site/public/podcast/feed.xml`) went live with the founder's deployment
  of 20 November 2026 and now carries all twenty English episodes — Season 1
  (10) and Season 2 (10) — every item tagged with its iTunes season and
  episode numbers.
- **Arabic RSS feed — built, goes live at the next deployment.**
  `site/public/podcast/feed-ar.xml` carries the ten Arabic episodes as
  Season 1, with season and episode tags; its own Apple Podcasts and
  Spotify shows follow once it is live.
- **Apple Podcasts — published 21 November 2026.** "Hudhud's Story Time"
  (Show ID 6837007282) is Available with all episodes:
  https://podcasts.apple.com/us/podcast/hudhuds-story-time/id6837007282
- **Spotify — submitted and accepted 21 November 2026.** The show is
  processing at https://open.spotify.com/show/33hhSGkhTtqtaJvUUOdtne
  (Spotify advised availability within 24 hours).
- Episode 1's picture-book is also on the museum's TikTok.

## 5. Announcements

The completed English series was announced on 20 November 2026 on the
museum's brand accounts only — X, Instagram and Facebook. That follows the
standing rule for the series: its channels run only from the islam_museum
brand accounts and the museum Gmail, never from the founder's personal
accounts.

## 6. What outreach may say

One sentence is safe, and nothing stronger:

> A free children's story podcast from islam.museum — twenty stories in
> English and Arabic, every one drawn from the museum's own records and
> linked back to them; voices generated with AI and disclosed as such.

No download or listener numbers exist yet, so none may be quoted.
Availability on Apple Podcasts may be claimed (the show is live);
availability on Spotify may be claimed once its show page resolves.

## 7. Open steps

1. The founder's deployment makes the Arabic feed live; then create its
   Apple Podcasts and Spotify shows.
2. Anghami: submit both feeds.
3. Add the English Season 2 episodes to the catalogue tables in §2.
4. A "Listen" corner in the Kids' Wing on the site.
