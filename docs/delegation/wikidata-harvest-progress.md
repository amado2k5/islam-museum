# Progress: Wikidata harvest (plan 15 §6.1), CC0 layer

Workspace (outside git): `/Volumes/exmicroSD/islam-museum-harvest/layers/cc0/wikidata/`. Tables: `wikidata-subset.duckdb` (wd_entity, wd_label, wd_claim, wd_sitelink, wd_external_id, wd_property).

## Done (12 Oct 2026)
- Dump filtered in two passes and tables built. Pass 1 read 121.9 M lines; pass 2 kept 2,461 outgoing neighbours (needed: 0).
- Checks on the tables: all 1,074 original seeds present; 580 seeds have an Arabic label; 18,261 entities.
- `wd_property` table added: 4,081 property labels fetched from the Wikidata API (3,421 with an Arabic label). The filter's own property branch kept none, so this table is the source for property names.
- Seed queries q06 (battles and wars with a participant in the Islam tree), q07 (treaties) and q08 (mosques with religion Islam) run. Results: q06 1 item, q07 0 items, q08 5,000 items (the query's LIMIT cap was hit, so the mosque list is incomplete). Seeds now 6,075 distinct QIDs. Class IDs verified against live labels.
- `scripts/harvest/wikidata/lookup.py`: local read path (QID view with resolved property labels, Arabic search). Replaces live lookups.

## Open
- **Rebuild needed** to pull the new seeds' neighbours into the subset: two full passes over the 96 GiB dump (hours, heavy disk and CPU). Not started, since it competes with the Ibn Sa'd extraction. Decide when to run it.
- **Filter bug (fixed in code, not yet re-run):** property entities carry `"datatype"` before `"id"` in the dump, so the header regex never matched them. The regex now allows it and pass 1 prints how many property lines it saw and how many it could not parse. The 4,081-row `wd_property` table stays the source until a rebuild shows whether the dump holds property lines at all (none appeared in the first 6 GB).
- **Dump deletion:** the 103 GB `latest-all.json.bz2` can be deleted now that the tables exist (plan 15 §6.1). Waiting for the founder's go-ahead.
- **Conflicts and treaties (redesigned, seeds refreshed 12 Oct 2026):** the old test asked for a participant that was itself a subclass of Islam, which matched one item. q06 and q07 now test the participant's religion: q06 2,614 battles, wars, sieges and campaigns; q07 50 treaties. The old text follows for the record: **Conflicts and treaties are thin:** q06 and q07 return almost nothing with the participant rule. Plan 15 §6.1 asks for all sides of a conflict; a second query (conflict to location or date, or to Companions' campaigns) is needed.
- Quarterly refresh and the weekly change job are not scheduled.

## Used so far (maintainer session, 12 Oct 2026)
- 25 polities (`data/polity/`, commit 8e58b51) and 16 buildings (`data/building/`, commit e7d7a95) were written from the local subset: labels, dates, coordinates, capitals and predecessor links, all `source/wikidata`, every date flagged for a second source, no prose yet (completeness 1). Scripts were scratch and are not in the repo.
- **Mosque cap (fixed):** q08 now filters by notability (at least 4 sitelinks): 3,096 mosques, no cap hit. `run_queries.py` now prints a WARNING whenever a result equals its LIMIT.
- **Polity seeds added:** q09a (119 historical countries with religion Islam), q09b (46 dynasties, caliphates, empires, kingdoms) and q10 (20 hand-checked Muslim-ruled polities that Wikidata does not tag with Islam: the Mughals, the Caliphate of Córdoba, Idrisids, Aghlabids, Mali, Songhai and others). Seeds are now about 7,000 QIDs; **the two-pass rebuild has not been run**.
- **The subset lacks many obvious items** because only the Islam-tree seeds and their neighbours were kept: the Mughals, Almoravids, Cairo Mamluks, Cordoba (caliphate and Great Mosque), the Umayyad Mosque, Taj Mahal, Alhambra, Süleymaniye, Ibn Tulun, al-Azhar mosque and most scholars after the first century are absent. A rebuild with seeds extended by these classes (polities, mosques with the most sitelinks, scholars and rulers with a death date before 1900) is needed before the next batches; it is the same two-pass job (about 12 hours).
- Next: cited Arabic prose for these 41 entities from history and architecture books in the library, and a second source for each date.
