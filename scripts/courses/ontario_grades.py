#!/usr/bin/env python3
"""The Ontario grade records, Grades 1 to 12, written once so that a fleet of agents never races to create one.

  python3 scripts/courses/ontario_grades.py        # writes data/course/ca-on-g<n>.yaml and its three prose files where absent

A grade record says only what a grade is: its number and its place in the elementary or secondary panel. Existing
records (the pilot's Grade 6, the proof run's Grade 4) are left as they are.
"""
import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
AR = {1: "الأول", 2: "الثاني", 3: "الثالث", 4: "الرابع", 5: "الخامس", 6: "السادس", 7: "السابع", 8: "الثامن", 9: "التاسع", 10: "العاشر", 11: "الحادي عشر", 12: "الثاني عشر"}
UR = {1: "اول", 2: "دوم", 3: "سوم", 4: "چہارم", 5: "پنجم", 6: "ششم", 7: "ہفتم", 8: "ہشتم", 9: "نہم", 10: "دہم", 11: "یازدہم", 12: "دوازدہم"}
GEN = "scripts/courses/ontario_grades.py; courses pipeline (docs/courses-mission/PIPELINE.md); 2026-11-12"
made = []
for n in range(1, 13):
    slug = f"ca-on-g{n}"
    f = os.path.join(ROOT, "data", "course", slug + ".yaml")
    if os.path.exists(f):
        continue
    elem = n <= 8
    src = "source/ontario-curriculum-sshg-2023" if elem else "source/ontario-curriculum-ssh-9-12-2013"
    cite = src.split("/")[1]
    en_sum = f"Grade {n} in Ontario's English-language {'elementary' if elem else 'secondary'} schools; courses follow the Ontario curriculum issued by the Ministry of Education."
    ar_sum = f"الصف {AR[n]} في مدارس أونتاريو {'الابتدائية' if elem else 'الثانوية'} باللغة الإنجليزية؛ تتبع مقرراته منهاج أونتاريو الصادر عن وزارة التعليم."
    ur_sum = f"اونٹاریو کے انگریزی {'ابتدائی' if elem else 'ثانوی'} اسکولوں میں جماعت {UR[n]}؛ اس کے کورس وزارتِ تعلیم کے جاری کردہ اونٹاریو نصاب کے مطابق ہیں۔"
    open(f, "w", encoding="utf-8").write(f"""id: course/{slug}
class: course
kind: grade
label:
  en: Grade {n} · Ontario (English board)
  ar: الصف {AR[n]} · أونتاريو ⁦(المنهاج الإنجليزي)⁩
  ur: 'جماعت {UR[n]} · اونٹاریو ⁦(انگریزی بورڈ)⁩'
summary:
  en: {en_sum}
  ar: {ar_sum}
  ur: '{ur_sum}'
sources:
- {src}
status:
  review: draft
  completeness: 1
  generated_by: {GEN}
part_of: course/ca-on-english
grade_number: {n}
country: ca
region: Ontario
""")
    for lang, head, body in (("ar", "موجز", ar_sum), ("en", "Brief", en_sum), ("ur", "مختصر", ur_sum)):
        p = os.path.join(ROOT, "content", lang, "course", slug + ".md")
        tr = "[]" if lang == "ar" else "[courses pipeline]"
        open(p, "w", encoding="utf-8").write(f"---\nid: course/{slug}\nlang: {lang}\nsource_lang: ar\ntranslators: {tr}\n---\n\n## {head}\n{body} {{cite:{cite}}}\n")
    made.append(slug)
print("grade records written:", made or "none (all present)")
