#!/usr/bin/env python3
"""Turn checked claims files (claims/epNN.json) and their translations (claims/epNN.tr.json) into museum records for one
series of Ahmed Elsayed's podcast: one `lecture` work per episode and one `lecture-series` work, each a data record plus
prose in ar, en, ur, fr and es. Nothing is invented here: every sentence comes from a claims file, every link target is
an entity that exists, every claim is cited to the whole episode (no time).

Usage: build_records.py --series seerah-2026 --claims DIR --episodes 1-24 [--with-series] [--out REPO]
Standard library plus PyYAML (labels of linked entities are read from their own records).
"""
import argparse, csv, json, re, sys
from pathlib import Path
import yaml

SOURCE = "source/podcast-ahmed-el-sayed"
SPEAKER = "person/ahmed-elsayed"
LANGS = ["ar", "en", "ur", "fr", "es"]
LRI, PDI = "⁦", "⁩"

SERIES = {
    "seerah-2026": {
        "slug": "ahmed-el-sayed-seerah-2026",
        "label": {
            "ar": "سيرة رسول الله لأحمد السيد، سلسلة 2026",
            "en": "The Biography of the Messenger of God by Ahmed Elsayed, 2026 series",
            "ur": "احمد السید کی سیرتِ رسول اللہ، سلسلہ 2026",
            "fr": "La biographie du Messager de Dieu par Ahmed Elsayed, série 2026",
            "es": "La biografía del Mensajero de Dios por Ahmed Elsayed, serie 2026",
        },
        "ep_label": {
            "ar": "سيرة رسول الله 2026، الحلقة {n}: {t}",
            "en": "The Biography of the Messenger of God 2026, episode {n}: {t}",
            "ur": "سیرتِ رسول اللہ 2026، قسط {n}: {t}",
            "fr": "La biographie du Messager de Dieu 2026, épisode {n} : {t}",
            "es": "La biografía del Mensajero de Dios 2026, episodio {n}: {t}",
        },
        "summary": {
            "ar": "سلسلة محاضرات لأحمد السيد في سيرة النبي محمد، بدأها سنة 2026 وتتبع فيها سيرة ابن هشام مع شروحها وكتب السيرة الأخرى كما يذكر في حلقتها الأولى، وهي منشورة صوتًا في بودكاست السلسلة. تنقل هذه السجلات ما يرويه ويشرحه في كل حلقة منسوبًا إليه، وتحيل إلى الحلقة كاملة دون تحديد وقت. وهي مصدر ثانوي حديث، لا مصدر أولي ولا شاهد مستقل على الوقائع.",
            "en": "A series of lectures by Ahmed Elsayed on the biography of the Prophet Muhammad, begun in 2026. As he says in the first episode, it follows Sirat Ibn Hisham together with its commentaries and the other early books of the sira, and it is published as audio in his podcast. These records give what he narrates and explains in each episode, attributed to him, and cite the whole episode with no time. It is a modern secondary source, not a primary source and not independent corroboration of the events.",
            "ur": "احمد السید کے لیکچرز کا ایک سلسلہ نبی محمد کی سیرت پر، جو 2026 میں شروع ہوا۔ جیسا کہ وہ پہلی قسط میں بتاتے ہیں، یہ سیرتِ ابن ہشام کی پیروی کرتا ہے، اس کی شروح اور سیرت کی دوسری قدیم کتابوں کے ساتھ، اور ان کے پوڈکاسٹ میں آڈیو کے طور پر شائع ہوتا ہے۔ یہ اندراجات ہر قسط میں ان کا بیان اور شرح انہی کی طرف منسوب کر کے دیتے ہیں اور پوری قسط کا حوالہ دیتے ہیں، کسی وقت کے بغیر۔ یہ ایک جدید ثانوی ماخذ ہے؛ نہ بنیادی ماخذ ہے اور نہ واقعات کی آزاد تصدیق۔",
            "fr": "Une série de conférences d'Ahmed Elsayed sur la biographie du Prophète Muhammad, commencée en 2026. Comme il le dit dans le premier épisode, elle suit la Sira d'Ibn Hisham avec ses commentaires et les autres livres anciens de la sira, et elle est publiée en audio dans son podcast. Ces notices rapportent ce qu'il raconte et explique dans chaque épisode, en le lui attribuant, et citent l'épisode entier, sans indication de temps. C'est une source secondaire moderne, ni une source primaire ni une corroboration indépendante des événements.",
            "es": "Una serie de conferencias de Ahmed Elsayed sobre la biografía del Profeta Muhammad, iniciada en 2026. Como dice en el primer episodio, sigue la Sira de Ibn Hisham junto con sus comentarios y los demás libros antiguos de la sira, y se publica en audio en su pódcast. Estos registros recogen lo que narra y explica en cada episodio, atribuido a él, y citan el episodio completo, sin indicar el minuto. Es una fuente secundaria moderna, ni fuente primaria ni corroboración independiente de los hechos.",
        },
        "wings": ["people"], "themes": ["prophets"], "regions": ["arabia"],
    },
}

STR = {
    "ar": {"summary": "الملخص", "records": "سجلات في المتحف ترتبط بهذا القسم", "view": "هذا رأي المحاضر، ينقله المتحف منسوبًا إليه ولا يتبناه.", "episodes": "حلقات السلسلة", "ep": "الحلقة"},
    "en": {"summary": "Summary", "records": "Museum records linked to this part", "view": "This is the speaker's view; the museum reports it as his and does not adopt it.", "episodes": "The episodes", "ep": "Episode"},
    "ur": {"summary": "خلاصہ", "records": "اس حصے سے متعلق عجائب گھر کے اندراجات", "view": "یہ مقرر کا نقطۂ نظر ہے؛ عجائب گھر اسے انہی کا بیان کر کے نقل کرتا ہے اور اپناتا نہیں۔", "episodes": "سلسلے کی اقساط", "ep": "قسط"},
    "fr": {"summary": "Résumé", "records": "Notices du musée liées à cette partie", "view": "C'est le point de vue du conférencier ; le musée le rapporte comme le sien et ne l'adopte pas.", "episodes": "Les épisodes", "ep": "Épisode"},
    "es": {"summary": "Resumen", "records": "Registros del museo relacionados con esta parte", "view": "Es el punto de vista del conferenciante; el museo lo recoge como suyo y no lo adopta.", "episodes": "Los episodios", "ep": "Episodio"},
}


def q(s):
    return json.dumps(s, ensure_ascii=False)


_ARPAREN = re.compile(r"(?<!\u2066)\(([^()]*[\u0600-\u06FF][^()]*)\)")


def iso(text, lang):
    """Arabic and Urdu text: wrap a parenthetical that holds Arabic script in the direction isolates (AGENTS.md)."""
    return _ARPAREN.sub(lambda m: LRI + "(" + m.group(1) + ")" + PDI, text) if lang in ("ar", "ur") else text


def labels_of(repo, eid, cache={}):
    if eid in cache:
        return cache[eid]
    f = repo / "data" / f"{eid}.yaml"
    out = None
    if f.exists():
        d = yaml.safe_load(f.read_text(encoding="utf8")) or {}
        lab = d.get("label") or {}
        if isinstance(lab, dict):
            out = {l: str(lab[l]).strip() for l in LANGS if lab.get(l)}
    cache[eid] = out
    return out


def link(repo, eid, lang):
    lab = labels_of(repo, eid)
    text = (lab.get(lang) or lab.get("en") or next(iter(lab.values()))) if lab else None
    if not text:
        return None
    text = text.replace("|", "/").replace("[", "(").replace("]", ")")
    return f"[[{eid}|{text}]]"


def minutes(d):
    p = [int(x) for x in d.split(":")]
    while len(p) < 3:
        p.insert(0, 0)
    return max(1, round((p[0] * 3600 + p[1] * 60 + p[2]) / 60))


def episode_files(repo, series, n, claims, tr, row, cfg):
    slug = f"{cfg['slug']}-ep{n:02d}"
    eid = f"work/{slug}"
    cite = f"{{cite:{SOURCE.split('/')[1]} {series}/ep{n}}}"
    secs = claims["sections"]
    flags = {f for s in secs for f in s.get("flags", [])}
    sens = "polemical" if "polemical" in flags else ("contested" if "contested" in flags else None)
    ents = []
    for s in secs:
        for e in s.get("entities", []):
            if e not in ents and (repo / "data" / f"{e}.yaml").exists():
                ents.append(e)
    # The ledger title reads "<series> <n> | <topic> | ..."; the label already names the series and the number, so keep the topic only.
    parts = [x.strip() for x in row["title_ar"].split("|") if x.strip()]
    title_ar = " | ".join(parts[1:]) if len(parts) > 1 else row["title_ar"]
    title = {"ar": title_ar, **tr["title"]}
    label = {l: iso(cfg["ep_label"][l].format(n=n, t=title[l]), l) for l in LANGS}
    summary = {"ar": iso(tr["summary"]["ar"], "ar"), "en": claims["summary_en"], "ur": iso(tr["summary"]["ur"], "ur"), "fr": tr["summary"]["fr"], "es": tr["summary"]["es"]}
    y = [f"id: {eid}", "class: work", "kind: lecture", "label:"]
    y += [f"  {l}: {q(label[l])}" for l in LANGS]
    y += ["summary:"] + [f"  {l}: {q(summary[l])}" for l in LANGS]
    y += [f"wings: [{', '.join(cfg['wings'])}]", f"themes: [{', '.join(cfg['themes'])}]", f"regions: [{', '.join(cfg['regions'])}]",
          f"authors: [{SPEAKER}]", f"delivered: {{ by: {SPEAKER} }}", "language: language/arabic", f"order: {n}",
          f"duration: {minutes(row['duration'])}", "delivery_date_status: uploaded"]
    if sens:
        y.append(f"sensitivity: {sens}")
    y.append("relations:")
    y.append(f"  - {{ type: part_of, target: work/{cfg['slug']}, sources: [{SOURCE}] }}")
    y += [f"  - {{ type: about, target: {e}, sources: [{SOURCE}] }}" for e in ents]
    y.append(f"sources: [{SOURCE}]")
    y.append("provenance:")
    y.append("  layer: copyrighted-reference")
    y.append("  source: " + q(f"Podcast of Ahmed Elsayed on SoundCloud, series {series}, episode {n}, uploaded {row['date']} (track {row['track_id']}); audio transcribed by Whisper large-v3 (mlx-community/whisper-large-v3-mlx) on 2026-11-23; claims extracted from the transcript by an AI model and checked mechanically against the museum's graph and rules; the Urdu, French and Spanish texts are AI translations from the English; not read by a human. Speech recognition errors are possible."))
    y.append("  generated_by: " + q("Claude Code (claude-sonnet-5-5)"))
    y.append("  model: claude-sonnet-5-5")
    y.append("  run: " + q(f"ahmed-el-sayed-{series}-wave1"))
    y.append("status: { review: published, generated_by: " + q("Claude Code (claude-sonnet-5-5)") + " }")
    files = {f"data/work/{slug}.yaml": "\n".join(y) + "\n"}

    for lang in LANGS:
        S = STR[lang]
        md = ["---", f"id: {eid}", f"lang: {lang}", "source_lang: ar", "translators: []", "---", "", f"## {S['summary']}", "", f"{summary[lang]} {cite}", ""]
        for i, s in enumerate(secs):
            topic = s["topic_ar"] if lang == "ar" else (s["topic_en"] if lang == "en" else tr["sections"][i][f"topic_{lang}"])
            claim_list = s["claims_ar"] if lang == "ar" else (s["claims_en"] if lang == "en" else tr["sections"][i][f"claims_{lang}"])
            md += [f"### {iso(topic, lang)}", ""]
            md += [f"- {iso(c, lang)} {cite}" for c in claim_list]
            md.append("")
            if set(s.get("flags", [])) & {"contested", "polemical"}:
                md += [S["view"], ""]
            links = [link(repo, e, lang) for e in s.get("entities", []) if (repo / "data" / f"{e}.yaml").exists()]
            links = [x for x in dict.fromkeys(links) if x]
            if links:
                md += [f"{S['records']}: " + "، ".join(links) if lang in ("ar", "ur") else f"{S['records']}: " + ", ".join(links), ""]
        files[f"content/{lang}/work/{slug}.md"] = "\n".join(md).rstrip() + "\n"
    return files, label, summary, ents


def series_files(repo, series, cfg, eps):
    slug = cfg["slug"]
    eid = f"work/{slug}"
    cite = f"{{cite:{SOURCE.split('/')[1]} {series}/ep1}}"
    y = [f"id: {eid}", "class: work", "kind: lecture-series", "label:"] + [f"  {l}: {q(cfg['label'][l])}" for l in LANGS]
    y += ["summary:"] + [f"  {l}: {q(cfg['summary'][l])}" for l in LANGS]
    y += [f"wings: [{', '.join(cfg['wings'])}]", f"themes: [{', '.join(cfg['themes'])}]", f"regions: [{', '.join(cfg['regions'])}]",
          f"authors: [{SPEAKER}]", f"delivered: {{ by: {SPEAKER} }}", "language: language/arabic", f"sources: [{SOURCE}]", "provenance:",
          "  layer: copyrighted-reference",
          "  source: " + q(f"Podcast of Ahmed Elsayed on SoundCloud (public feed read on 2026-11-23): series {series}, episodes of the ledger harvest/ahmed-el-sayed/ledger.tsv; episode 28 is not in the feed. Episode records carry their own provenance."),
          "  generated_by: " + q("Claude Code (claude-sonnet-5-5)"), "  model: claude-sonnet-5-5", "  run: " + q(f"ahmed-el-sayed-{series}-wave1"),
          "status: { review: published, generated_by: " + q("Claude Code (claude-sonnet-5-5)") + " }"]
    files = {f"data/work/{slug}.yaml": "\n".join(y) + "\n"}
    for lang in LANGS:
        S = STR[lang]
        md = ["---", f"id: {eid}", f"lang: {lang}", "source_lang: ar", "translators: []", "---", "", f"## {S['summary']}", "", f"{cfg['summary'][lang]} {cite}", "", f"## {S['episodes']}", ""]
        for n, label, summary in eps:
            md.append(f"- [[work/{slug}-ep{n:02d}|{label[lang]}]]: {summary[lang]}")
        files[f"content/{lang}/work/{slug}.md"] = "\n".join(md).rstrip() + "\n"
    return files


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--series", required=True)
    ap.add_argument("--claims", required=True)
    ap.add_argument("--episodes", required=True, help="e.g. 1-24 or 25-27,29-33")
    ap.add_argument("--with-series", action="store_true")
    ap.add_argument("--ledger", default="harvest/ahmed-el-sayed/ledger.tsv")
    ap.add_argument("--out", default=".")
    a = ap.parse_args()
    repo = Path(a.out)
    cfg = SERIES[a.series]
    nums = []
    for part in a.episodes.split(","):
        lo, _, hi = part.partition("-")
        nums += list(range(int(lo), int(hi or lo) + 1))
    ledger = {r["locator"]: r for r in csv.DictReader(open(repo / a.ledger, encoding="utf8"), delimiter="\t")}
    out, eps = {}, []
    for n in nums:
        row = ledger.get(f"{a.series}/ep{n}")
        cj, tj = Path(a.claims) / f"ep{n:02d}.json", Path(a.claims) / f"ep{n:02d}.tr.json"
        if not row or not cj.exists() or not tj.exists():
            print(f"skip episode {n}: ledger row {bool(row)}, claims {cj.exists()}, translation {tj.exists()}", file=sys.stderr)
            continue
        files, label, summary, ents = episode_files(repo, a.series, n, json.load(open(cj, encoding="utf8")), json.load(open(tj, encoding="utf8")), row, cfg)
        out.update(files)
        eps.append((n, label, summary))
    if a.with_series:
        out.update(series_files(repo, a.series, cfg, eps))
    for rel, text in out.items():
        p = repo / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text, encoding="utf8")
    print(f"{len(eps)} episodes, {len(out)} files")


if __name__ == "__main__":
    main()
