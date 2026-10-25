# Proposal: four websites added to the authenticity register (24 Oct 2026)

Status: added as `not-verified` at the founder's instruction of 24 Oct 2026 ("yes and commit to add these sites as sources"). Pointer use only until each site is checked, per `docs/delegation/web-sources-rules.md`: a `not-verified` carrier may only be a pointer. Risk: non-impacting (register and ledger records only; no entity, licence or submission claim changes).

Files touched: `scripts/harvest/library/authenticity.yaml` (four `sources` entries), `docs/authenticity-ledger/websites/{archnet.org,muslimheritage.com,shamela.ws,sunnah.com}.yaml`, this file.

## Sites

| Site | Proposed tier | Register status | Allowed uses now | What it is | Use it could support once checked |
|---|---|---|---|---|---|
| archnet.org | T3 | not-verified | pointer | Open-access library on Islamic architecture: photographs, plans, papers, the Dictionary of Islamic Architecture | Building records (mosques, türbes, madrasas) as a pointer and then as facts with a page |
| muslimheritage.com | T3 | not-verified | pointer | Academic portal on Islamic science and architecture, founded by Salim Al-Hassani | Science and architecture entries as facts, after a check |
| shamela.ws | T4 | not-verified | pointer | Al-Maktaba al-Shamela: classical Arabic texts, uploaded by users; per-book metadata shows whether a copy matches a print edition | The named-edition check only; not a text source |
| sunnah.com | T3 | not-verified | pointer | Arabic and English hadith texts with references and grades for the six canonical collections | Hadith records as text and grades, after the sample check |

Already registered before this proposal: dorar.net (T3, grades and pointer).

## What Wikipedia says (context only; Wikipedia is a pointer, not a source)

- **Archnet** ([Wikipedia: ArchNet](https://en.wikipedia.org/wiki/ArchNet)): a collaborative digital humanities project on Islamic architecture and the built environment of Muslim societies; conceived in 1998 at MIT's School of Architecture and Planning with the Aga Khan Trust for Culture; maintained by the Aga Khan Documentation Center at MIT and the Aga Khan Trust since 2011; fully open access after the 2013 relaunch, with no logins.
- **Muslim Heritage**: no Wikipedia article on the site. [Salim Al-Hassani](https://en.wikipedia.org/wiki/Salim_Al-Hassani) is described as the founder of the MuslimHeritage.com academic portal.
- **Shamela** ([Wikipedia: Al-Maktaba al-Shamela](https://en.wikipedia.org/wiki/Al-Maktaba_al-Shamela)): an Arabic digital library first released in April 2005, with more than a hundred books; began as Al-Mawsu'at Al-Shamela from an Ahl al-Hadith forum; a website followed in 2012; per-book metadata says whether pages match a print edition; all books are in Arabic.
- **Sunnah.com** is named as a hadith search engine in [Wikipedia: Hadith](https://en.wikipedia.org/wiki/Hadith) and as the online text of Sunan Abu Dawud in [Wikipedia: Sunan Abi Dawud](https://en.wikipedia.org/wiki/Sunan_Abi_Dawud); that article says the site offers English, Urdu, Arabic and Indonesian translations and commentaries.
- **Dorar.net**: no Wikipedia article found.

Caveats: these summaries come from search snippets, not full articles. The site claims (dates, operators, numbering) are not verified here and must be checked on the sites before any tier is raised.

## Upgrade path

To move any site above `not-verified`, a founder decision is needed with: the check date, a named sample (30 rows with a recorded seed) for hadith sites, and the site's own methodology page. Each item taken from a site also needs its own decision (`docs/delegation/web-sources-rules.md` §2).

## Not done here

- No `data/source/` entity for any site yet. A prose record may cite a site only after one is defined.
- No prose written from these sites.
