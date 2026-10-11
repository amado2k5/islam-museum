#!/usr/bin/env python3
"""Verify a Tanzil Qur'an text file (format: "text with aya numbers", sura|aya|text). Reads only; never rewrites the file."""
import hashlib, sys

AYAT = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,
        34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,
        30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6]
assert len(AYAT) == 114 and sum(AYAT) == 6236

path = sys.argv[1]
raw = open(path, "rb").read()
print("sha256", hashlib.sha256(raw).hexdigest())
counts, last, errors, notice = {}, {}, [], False
for n, line in enumerate(raw.decode("utf-8").splitlines(), 1):
    if not line.strip():
        continue
    if line.startswith("#"):
        notice = notice or "tanzil" in line.lower()
        continue
    parts = line.split("|", 2)
    if len(parts) != 3 or not parts[2].strip():
        errors.append(f"line {n}: not sura|aya|text"); continue
    sura, aya = int(parts[0]), int(parts[1])
    if aya != last.get(sura, 0) + 1:
        errors.append(f"line {n}: sura {sura} aya {aya} out of sequence")
    last[sura] = aya
    counts[sura] = counts.get(sura, 0) + 1
for s, expected in enumerate(AYAT, 1):
    if counts.get(s) != expected:
        errors.append(f"sura {s}: {counts.get(s)} ayat, expected {expected}")
if not notice:
    errors.append("Tanzil copyright notice missing: the licence requires it to stay in every copy")
print("suras", len(counts), "ayat", sum(counts.values()))
print("\n".join(errors) if errors else "OK: 114 suras, 6,236 ayat, notice present")
sys.exit(1 if errors else 0)
