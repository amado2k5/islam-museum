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
- **Museum RSS feed — built, awaiting deployment.** The feed lives in this
  repository (`site/public/podcast/feed.xml`) and goes live at the founder's
  next deployment.
- **Apple Podcasts — draft exists, publish follows the deployment.** A draft
  show "Hudhud's Story Time" (Show ID 6837007282) is already created in Apple
  Podcasts Connect. Once the feed is live it is repointed to
  https://islam.museum/podcast/feed.xml, refreshed and published; Apple's
  review typically takes one to three days.
- **Spotify — submission follows.** The same museum feed is submitted to
  Spotify for Creators once it is live.
- **In the meantime,** the English series is also available on an interim
  hosted feed, and Episode 1's picture-book is on the museum's TikTok.

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

No download or listener numbers exist yet, so none may be quoted, and
availability on Apple Podcasts or Spotify must not be claimed until those
listings are actually live.

## 7. Open steps

1. The founder's deployment makes the museum feed live.
2. Apple Podcasts: repoint the draft, refresh, publish.
3. Spotify for Creators: submit the same feed.
4. An Arabic audio feed and show of its own — the Arabic series is
   video-first for now.
5. A "Listen" corner in the Kids' Wing on the site.
