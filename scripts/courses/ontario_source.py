#!/usr/bin/env python3
"""The curriculum source record for an Ontario course, found or made, the same way every time.

  python3 scripts/courses/ontario_source.py <archive slug>        # prints the source id to cite

Reads docs/courses/curricula/<slug>.json (written by fetch_ontario.py). If a source record already carries the
curriculum's address on the Ministry's site, that record is the answer and nothing is written. Otherwise the record
`source/ontario-curriculum-<the Ministry's slug>` is written from the manifest alone: the Ministry's own title and
address, no year (the service does not state one reliably, and a year is never guessed). Two agents running this for
two courses of the same curriculum write the same bytes, so a fleet cannot make conflicting copies.
"""
import glob, json, os, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
m = json.load(open(os.path.join(ROOT, "docs", "courses", "curricula", sys.argv[1] + ".json"), encoding="utf-8"))
cur = m.get("curriculum") or {}
if not cur.get("url_slug"):
    raise SystemExit("the manifest names no curriculum document: fetch the course again with the current fetch_ontario.py")
for f in sorted(glob.glob(os.path.join(ROOT, "data", "source", "*.yaml"))):
    t = open(f, encoding="utf-8").read()
    if cur["url"] + '"' in t or cur["url"] + "\n" in t or t.rstrip().endswith(cur["url"]):
        print("source/" + os.path.basename(f)[:-5])
        sys.exit(0)
sid = "ontario-curriculum-" + cur["url_slug"]
title = f"The Ontario Curriculum: {cur['title']}"
open(os.path.join(ROOT, "data", "source", sid + ".yaml"), "w", encoding="utf-8").write(f'''id: source/{sid}
class: source
kind: primary
type: document
label: {{ en: "Ontario Ministry of Education, {title}", ar: "وزارة التعليم في أونتاريو، منهاج أونتاريو: {cur['title']}", ur: "وزارتِ تعلیم اونٹاریو، اونٹاریو نصاب: {cur['title']}" }}
summary:
  en: "The Ministry of Education's curriculum policy for this subject, as served on the Ministry's curriculum site; the museum's course records quote its expectations by code, within the 40-word limit, and map lessons to them (mapped by the museum, not endorsed by the Ministry)."
  ar: "سياسة المنهاج الصادرة عن وزارة التعليم في أونتاريو لهذه المادة، كما تُنشر في موقع المنهاج الوزاري؛ تقتبس سجلات المقررات في المتحف توقعاتها برموزها في حدود أربعين كلمة وتربط الدروس بها، والربط من عمل المتحف لا بإقرار من الوزارة."
  ur: "اس مضمون کے لیے وزارتِ تعلیم اونٹاریو کی نصابی پالیسی، جیسا کہ وزارت کی نصابی ویب سائٹ پر شائع ہے؛ میوزیم کے کورس ریکارڈ اس کی توقعات کو ان کے کوڈ کے ساتھ چالیس الفاظ کی حد میں نقل کرتے اور اسباق کو ان سے جوڑتے ہیں، اور یہ ربط میوزیم کا کام ہے، وزارت کی توثیق نہیں۔"
title: "{title}"
author: [{{ literal: "Ontario Ministry of Education" }}]
publisher: "Ontario Ministry of Education"
URL: "{cur['url']}"
language: en
open_access: true
reliability_note: "Official curriculum policy of the Government of Ontario, read from the Ministry's own content service by scripts/courses/fetch_ontario.py. No year is recorded here because the service does not state one reliably."
status: {{ review: draft, completeness: 2, generated_by: "scripts/courses/ontario_source.py; courses pipeline; from the Ministry's manifest" }}
''')
print("source/" + sid)
