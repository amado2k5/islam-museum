# Modern Islam Browser — books: progress

Section file for the books and publishers waves (seeds §8: titles, writers, publishers, bookshops, fairs, prizes). Newest first. Lane-wide state and decisions stay in `../progress.md`; this session writes only this file.

**Method.** Researched in Chrome on the founder's Mac (read only; public pages; Wikipedia and Wikidata through their APIs with `origin=*` and the rendered revision pages). Content of a book is described only from sources about it: reviews, press and the publisher; Wikipedia and Wikidata serve only for entity facts (author, publisher, year, language, ISBN, sitelinks). **Source family found:** GloQur, the blog of the ERC project "The Global Qur'an" (University of Münster / Freiburg), whose signed "Qur'an translation of the week" posts review one translation each; it is the content source for most Qur'an translations in this section. Nothing downloaded; the microSD was not needed.

## Next step

Batch 02: further Qur'an translations and their translators (Tarif Khalidi 2008, Laleh Bakhtiar 2007, Ali Ünal enrichment, Ahmed Ali 1984, Thomas Cleary 2004, Musharraf Hussain), then the Urdu and other-language translations of seeds §8 (Tahir-ul-Qadri's *Irfan-ul-Quran*, Korkut, Ma Jian), each with a GloQur or press review for its content. Then prize lists (Sheikh Zayed Book Award, IPAF, Katara) as award records with dated honours on work records.

## Status

- **6 November 2026** — Batch 01 (`modern-books-b01`, Claude Code, claude-opus-5-5): seven English Qur'an translations. Enriched in place: `work/message-of-the-quran-asad` (1980; 1964 partial edition; perspectives Sunni, then academic), `work/noble-quran-hilali-khan` (1977; editions 1978, 1985, 1994, 1997). New: `work/saheeh-international-quran` (1997), `work/noble-quran-meanings-taqi-usmani` (2007), `work/clear-quran-khattab` (2015/2016, both kept), `work/study-quran` (2015), `work/quran-new-translation-abdel-haleem` (2004). Fourteen new sources (seven GloQur posts, CNN, OUP, four Wikipedia revisions, one Wikidata revision). Three author stubs in `data/_stubs.d/modern-books.yaml` (al-Hilali, Muhsin Khan, Taqi Usmani). Duplicate check: `ls data/work`, label grep and Wikidata ids; correction recorded below.

## Excluded items (books)

| Date | Item | What it was | Reason dropped | Gate | Override |
|---|---|---|---|---|---|
| 2026-11-06 | Wikidata Q110269259 on `work/noble-quran-hilali-khan` | the draft card's identifier | the item is Muhammad Taqi Usmani's translation (P50 Q1392062), not Hilali–Khan; moved to `work/noble-quran-meanings-taqi-usmani`, Hilali–Khan now carries Q7045768 | identity | none needed |
| 2026-11-06 | Tarif Khalidi, *The Qur'an: A New Translation* (Penguin, 2008) | seeds §8 lead | only the 2009 Penguin Classics Deluxe page was read; the 2008 first edition is not yet sourced beyond an uncited Wikipedia list line | one cited source per fact | a review of 2008 (Guardian, Mail & Guardian) read in full; batch 02 |
| 2026-11-06 | Saheeh International: The Daily Beast article (26 March 2017) | press source | paywalled after its lede; used only through the GloQur post that reports it | read before citing | a full read of the article |
| 2026-11-06 | Asad: Gai Eaton's appraisal and the 1974 Saudi ban date | in the English Wikipedia article | Wikipedia is not used for a work's reception; the ban is told from GloQur (1979 fatwa) | Wikipedia for entity facts only | the Aramco World article and Khaleel Mohammed's study read in full |
| 2026-11-06 | Hilali–Khan: the critics listed on Wikipedia (Khaleel Mohammed, Abou El Fadl, Durie and others) and the defence by Fathul Bari Mat Jahaya | English Wikipedia | not restated from Wikipedia; the reception paragraph follows GloQur only | Wikipedia for entity facts only | the cited studies read in full, then a perspectives block |
| 2026-11-06 | Usmani translation "two volumes" | English Wikipedia list | uncited list line; not in GloQur | one cited source per fact | the publisher's catalogue |
| 2026-11-06 | Publishers as `publisher` relations: Dar al-Andalus (Gibraltar), Abul-Qasim Publishing House, Book of Signs Foundation, HarperOne, Oxford University Press, Maktaba Ma'ariful Quran | publisher listings | no listing records yet; named in `editions` and prose only, to keep the batch within 25 entities | batch size | a publishers batch (seeds §8 publishers) |
| 2026-11-06 | The Clear Quran's Al-Azhar approval as an honour | Khattab's Wikipedia biography | an approval is not an award; told in prose, attributed | honours need an award record | none |
