#!/usr/bin/env python3
"""Load the downloaded collections into $HARVEST/db/harvest.duckdb (docs/plan/15 §6.5). Loads whatever is present; safe to rerun.
Tables: pl_place, pl_name (Pleiades, CC BY), gn_place, gn_country, gn_admin1, gn_altname (GeoNames, CC BY),
met_object, met_islamic (Metropolitan Museum Open Access metadata, CC0), oi_meta (OpenITI Makhzan metadata, CC BY-NC-SA: facts only)."""
import subprocess, sys
from pathlib import Path
import duckdb
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from common import HARVEST

R = HARVEST / "raw" / "collections"
con = duckdb.connect(str(HARVEST / "db" / "harvest.duckdb"))


def have(p: Path) -> bool:
    return p.exists() and not Path(str(p) + ".aria2").exists()


def count(t): return con.execute(f"select count(*) from {t}").fetchone()[0]


pl = R / "pleiades"
if have(pl / "pleiades-places-latest.csv.gz"):
    con.execute(f"create or replace table pl_place as select id, title, description, reprLat, reprLong, minDate, maxDate, timePeriods, featureTypes, path from read_csv('{pl}/pleiades-places-latest.csv.gz', sample_size=-1)")
    con.execute(f"create or replace table pl_name as select cast(regexp_extract(pid, '(\d+)$', 1) as bigint) as place_id, id as name_id, title, nameAttested, nameLanguage, nameTransliterated, reprLat, reprLong from read_csv('{pl}/pleiades-names-latest.csv.gz', sample_size=-1)")
    print("pleiades:", count("pl_place"), "places,", count("pl_name"), "names")

gn = R / "geonames"
if have(gn / "allCountries.zip"):
    txt = HARVEST / "layers" / "by" / "geonames"; txt.mkdir(parents=True, exist_ok=True)
    out = txt / "allCountries.txt"
    if not out.exists():
        subprocess.run(f"unzip -p '{gn}/allCountries.zip' allCountries.txt > '{out}'", shell=True, check=True)
    cols = {"geonameid": "BIGINT", "name": "VARCHAR", "asciiname": "VARCHAR", "alternatenames": "VARCHAR", "lat": "DOUBLE", "lon": "DOUBLE", "fclass": "VARCHAR", "fcode": "VARCHAR", "country": "VARCHAR", "cc2": "VARCHAR", "admin1": "VARCHAR", "admin2": "VARCHAR", "admin3": "VARCHAR", "admin4": "VARCHAR", "population": "BIGINT", "elevation": "VARCHAR", "dem": "VARCHAR", "tz": "VARCHAR", "modified": "VARCHAR"}
    con.execute(f"create or replace table gn_place as select * from read_csv('{out}', delim='\t', header=false, quote='', columns={cols}, sample_size=-1)")
    print("geonames:", count("gn_place"), "places")
if have(gn / "admin1CodesASCII.txt"):
    con.execute(f"create or replace table gn_admin1 as select * from read_csv('{gn}/admin1CodesASCII.txt', delim='\t', header=false, columns={{'code':'VARCHAR','name':'VARCHAR','asciiname':'VARCHAR','geonameid':'BIGINT'}})")
if have(gn / "countryInfo.txt"):
    con.execute(f"create or replace table gn_country as select * from read_csv('{gn}/countryInfo.txt', delim='\t', header=false, comment='#', null_padding=true, quote='', sample_size=-1, ignore_errors=true, columns={{'iso':'VARCHAR','iso3':'VARCHAR','isonum':'VARCHAR','fips':'VARCHAR','country':'VARCHAR','capital':'VARCHAR','area':'VARCHAR','population':'VARCHAR','continent':'VARCHAR','tld':'VARCHAR','currency':'VARCHAR','currencyname':'VARCHAR','phone':'VARCHAR','pcformat':'VARCHAR','pcregex':'VARCHAR','languages':'VARCHAR','geonameid':'BIGINT','neighbours':'VARCHAR','eqfips':'VARCHAR'}})")
if have(gn / "alternateNamesV2.zip"):
    out = HARVEST / "layers" / "by" / "geonames" / "alternateNamesV2.txt"
    if not out.exists():
        subprocess.run(f"unzip -p '{gn}/alternateNamesV2.zip' alternateNamesV2.txt > '{out}'", shell=True, check=True)
    con.execute(f"create or replace table gn_altname as select * from read_csv('{out}', delim='\t', header=false, quote='', sample_size=-1, ignore_errors=true, columns={{'id':'BIGINT','geonameid':'BIGINT','lang':'VARCHAR','name':'VARCHAR','preferred':'VARCHAR','short':'VARCHAR','colloquial':'VARCHAR','historic':'VARCHAR','from':'VARCHAR','to':'VARCHAR'}})")
    print("geonames alternate names:", count("gn_altname"))

met = R / "met" / "MetObjects.csv"
if have(met):
    con.execute(f"create or replace table met_object as select * from read_csv('{met}', sample_size=-1, ignore_errors=true, header=true)")
    con.execute('create or replace table met_islamic as select * from met_object where "Department" = \'Islamic Art\'')
    pd = con.execute('select count(*) from met_islamic where "Is Public Domain"').fetchone()[0]
    print("met:", count("met_object"), "objects;", count("met_islamic"), "in Islamic Art,", pd, "marked public domain (images usable)")

oi = HARVEST / "raw" / "openiti" / "OpenITI-Makhzan_Metadata_2026-1-2.tsv"
if have(oi):
    con.execute(f"create or replace table oi_meta as select * from read_csv('{oi}', delim='\t', header=true, sample_size=-1, ignore_errors=true, quote='')")
    print("openiti metadata:", count("oi_meta"), "rows")
