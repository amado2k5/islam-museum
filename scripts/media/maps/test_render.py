#!/usr/bin/env python3
"""Self-test: rendering the same event twice gives byte-identical SVGs (docs/plan/16 §9). Run in .venv-media: python test_render.py"""
import hashlib, sys, tempfile
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from render import render

with tempfile.TemporaryDirectory() as a, tempfile.TemporaryDirectory() as b:
    for lang in ("en", "ar"):
        h = []
        for d in (a, b):
            out = render("battle-of-badr", lang, d)
            h.append(hashlib.sha256((out / f"map.{lang}.svg").read_bytes()).hexdigest())
        assert h[0] == h[1], f"{lang}: SVG differs between runs"
    svg = (Path(a) / "map-event-battle-of-badr" / "map.ar.svg").read_text()
    assert "stroke-dasharray" in svg, "schematic positions must be dashed"
print("ok: deterministic SVGs in en and ar; schematic lines are dashed")
