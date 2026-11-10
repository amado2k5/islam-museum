# 33 · متصفح ما وراء الطبيعة — the Ghayb Browser

_Requested in chat 9–10 Nov 2026; built as a view over the one graph — no new class, no side table._

## 1. What it is

A front door on the museum's records about the unseen (al-ghayb): jinn and angels, the soul, the measures of time, the Night Journey and the heavens, the greatest unseen creations, death and the barzakh, and the major signs of the Hour — plus the everyday doors of the unseen (dreams, the evil eye, magic) and a caution note on mixing scripture with physics speculation.

## 2. Records

Ordinary `concept` records (kind `belief`/`term`) plus the existing `event/isra-and-miraj`. Every record carries `tags: [ghayb-browser, ghayb-<section>]` where `<section>` is one of:

| tag | ar | en |
|---|---|---|
| `ghayb-perception` | حدود الإدراك | Limits of perception |
| `ghayb-daily` | خفايا يومية | Everyday doors |
| `ghayb-time` | الزمن والزمان | Time and its measures |
| `ghayb-heavens` | رحلة السماوات | Journey of the heavens |
| `ghayb-creations` | أعظم مخلوقات الغيب | Greatest unseen creations |
| `ghayb-barzakh` | البرزخ وما بعد الموت | Barzakh and after death |
| `ghayb-signs` | علامات الساعة | Signs of the Hour |

New records (13): `alamat-al-saaa-al-kubra`, `yajuj-majuj`, `nuzul-isa-ibn-maryam`, `tulu-al-shams-min-al-maghrib`, `dabbat-al-ard`, `yawm-ka-alf-sana`, `al-samawat-al-sab`, `bayt-al-mamur`, `al-lawh-al-mahfuz`, `al-qalam`, `al-barzakh`, `sihr`, `al-ayn` — each with cited trilingual prose, `status.review: draft` until a human reads them.

Reused in place (~25 existing records tagged, nothing duplicated): ghayb, al-ghayb-al-mutlaq, idrak-al-ghayb, jinn, shayatin-al-ins-wal-jinn, malaika, israfil, al-nafs-wal-ruh, ruyat-allah, al-ruya-wa-al-risala, hasad, tathir-al-jinn-wal-sihr, ashab-al-kahf, sidrat-al-muntaha, event/isra-and-miraj, al-arsh, kursi-allah, istiwa-ala-al-arsh, hur-al-ayn, mawt, sakarat-al-mawt, adhab-al-qabr, rafiq-al-qabr, mahdiyya, dajjal.

Seed `mentions` edges were written on the Qur'an passage records themselves (passage → concept, `source/tanzil-quran`), so each topic page shows its "mentioned in the Qur'an" strip through the computed inverse.

## 3. Page and API

`/[lang]/ghayb/` — section chips, a client filter (progressive enhancement; the full list reads without JavaScript), and cards linking to the entity pages. `data-pagefind-body` on the header block, `data-pagefind-ignore` on the lists (browsers.md §4). Export `/api/v1/ghayb.json` in `scripts/export-api.ts`, documented in `docs/data/README.md`, `site/public/openapi/v1.json` and `llms.txt`.

## 4. Editorial stance

Sunni default; contested items (e.g., the dukhan's timing, the Mahdi reports' strength) are presented with labelled voices, no verdict. Science is used as analogy only: nothing here claims that physics proves jinn or that revelation encodes string theory — the same "established vs. theory" honesty the request came with.
