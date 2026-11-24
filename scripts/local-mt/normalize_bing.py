"""Normalize a Bing-paste answers file for import_gt.py --txt: every #### n ####
marker gets its own line; spaced tags < x1 > become <x1>; [[N]] spacing fixed.
Usage: normalize_bing.py <in.txt> <out.txt>"""
import re, sys
s = open(sys.argv[1], encoding="utf-8").read()
s = re.sub(r"<\s*x(\d+)\s*>", r"<x\1>", s)
s = re.sub(r"<\s*/\s*x(\d+)\s*>", r"</x\1>", s)
s = re.sub(r"(#{3,4}\s*\d+\s*#{3,4})", r"\n\1\n", s)
s = re.sub(r"\n{3,}", "\n\n", s)
open(sys.argv[2], "w", encoding="utf-8").write(s.strip() + "\n")
