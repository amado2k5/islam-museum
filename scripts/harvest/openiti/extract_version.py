#!/usr/bin/env python3
"""Extract one OpenITI text version from the local corpus zip into the non-commercial layer ($HARVEST/layers/nc/openiti/), docs/plan/15 §3.
Licence: CC BY-NC-SA 4.0. The text is for finding and checking facts with SHORT quotations and citations; it is never republished and never copied into data/.
Usage: extract_version.py 0213IbnHisham.SiraNabawiyya.Shamela0023833-ara1 [more version URIs]
Writes <layer>/<author>/<book>/<version>.completed (+ .yml sidecar with edition metadata) and prints the path."""
import os, subprocess, sys
from pathlib import Path

HARVEST = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
ZIP = HARVEST / "raw" / "openiti" / "corpus" / "OpenITI_data_2025-1-9.zip"
OUT = HARVEST / "layers" / "nc" / "openiti"
for uri in sys.argv[1:]:
    author, book = uri.split(".")[0], ".".join(uri.split(".")[:2])
    member = f"{author}/{book}/{uri}*"
    subprocess.run(["unzip", "-oq", str(ZIP), member, "-d", str(OUT)], check=True)
    d = OUT / author / book
    print(d / f"{uri}.completed", "ok" if (d / f"{uri}.completed").exists() else "NOT FOUND (versions may carry .mARkdown or no suffix; list with: unzip -l ZIP | grep " + uri + ")")
