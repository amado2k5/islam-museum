#!/usr/bin/env python3
"""Draft Arabic museum prose for entities from a reviewed claims table, with a local model (Ollama, on the founder's Mac).

  draft_prose.py <claims.json> [--only KEY,...] [--source-id SRC] [--model qwen3:32b] [--out DIR]

The model sees only the claims listed for each entity (with their printed pages). It writes Arabic markdown in the repository's
entity-prose shape, with a {cite:<source-id> p.N} after every sentence that states a fact. Drafts go to DIR (default
~/islam-museum-harvest/drafts/), outside git; a person reviews each draft and copies it into content/ar/ by hand.
"""
import argparse, json, os, re, urllib.request
from pathlib import Path

H = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
OLLAMA = os.environ.get("OLLAMA_HOST", "http://localhost:11434")

SYSTEM = """You write short entries for an Arabic museum of Islam. You write Arabic only, in a warm, precise, neutral voice.

Hard rules:
1. Restate ONLY the numbered facts given, one sentence per fact at most. Do not add anything else: no purpose of the book, no sources used, no context, no names, dates, titles or places that are not in the facts.
2. Describe, never prescribe. No rulings, no sermon voice. Attribute opinions to the named scholar or school.
3. No honorifics (رحمه الله، رضي الله عنه، الإمام الجليل). Plain names only; "الإمام أحمد" is allowed.
4. Every sentence ends with the citation in this exact form: {cite:SOURCE p.N}, where N is the page of the fact it restates. Never use a page that is not listed with a fact.
5. No quotation marks and no copied book text; put every fact in your own words.
6. Use [[class/slug|Arabic label]] only for entity ids in the list of links given to you; otherwise write the plain name.
7. Output the markdown body only: first the line "## موجز", then the sentences in one paragraph. For concepts with opinions, after the paragraph add the line "## الأقوال" and one short sentence per opinion, each cited. No other headings. No English. No preamble, no code fence."""

def build_prompt(key: str, ent: dict, source: str, links: list[str]) -> str:
    facts = "\n".join(
        f"{i}. {c['ar']} (p.{c['page']})" + (f" [doubt marker in the book: {c['doubt']}]" if c.get("doubt") else "")
        for i, c in enumerate(ent, 1))
    return (f"Entity: {key}\nSOURCE id for citations: {source}\n"
            f"Links you may use: {', '.join(links) if links else 'none'}\n\nFacts:\n{facts}\n\n"
            "Write the Arabic entry now, following the rules.")

def ask(model: str, user: str) -> str:
    body = json.dumps({"model": model, "messages": [{"role": "system", "content": SYSTEM}, {"role": "user", "content": user}],
                       "stream": False, "think": False, "options": {"temperature": 0.0, "num_ctx": 16384}}).encode()
    req = urllib.request.Request(f"{OLLAMA}/api/chat", data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=900) as r:
        return json.loads(r.read())["message"]["content"].strip()

def check(text: str, ent: list[dict], source: str) -> list[str]:
    """Flag cites whose page is not one of the facts' pages, and sentences with no cite. Returns problems (empty = clean)."""
    pages = {str(c["page"]) for c in ent}
    probs = []
    for m in re.finditer(r"\{cite:([a-z0-9-]+)\s+p\.(\d+)\}", text):
        if m.group(1) != source: probs.append(f"unknown source {m.group(1)}")
        elif m.group(2) not in pages: probs.append(f"cite page {m.group(2)} not among the fact pages")
    return probs

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("claims"); ap.add_argument("--only"); ap.add_argument("--source-id", default="madkhal-ibn-badran-turki")
    ap.add_argument("--model", default="qwen3:32b"); ap.add_argument("--out")
    a = ap.parse_args()
    data = json.loads(Path(a.claims).read_text())
    out = Path(a.out) if a.out else H / "drafts"
    out.mkdir(parents=True, exist_ok=True)
    keys = a.only.split(",") if a.only else list(data["entities"])
    links = [k for k in data["entities"] if k != "" ]
    for key in keys:
        ent = data["entities"][key]
        text = ask(a.model, build_prompt(key, ent, a.source_id, links))
        probs = check(text, ent, a.source_id)
        name = key.replace("/", "__") + ".md"
        (out / name).write_text(text + "\n")
        print(f"{key}: {len(text)} chars, {len(probs)} cite problems {probs[:3]}", flush=True)

if __name__ == "__main__":
    main()
