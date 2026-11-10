#!/usr/bin/env python3
"""Automated approval gates for illustrations (docs/agents/lanes/illustrations.md section 3, docs/plan/22 §5 step 6).
Pure functions: no I/O, no model calls. The caller supplies the observations (OCR letters, faces, humans, vision-language hits).
An image is approved only when every gate passes; any failure rejects that seed."""
import hashlib, json

PERSON_WORDS = {"portrait", "face", "man", "woman", "figure", "person", "people", "bearded", "child", "rider", "pilgrim"}
TEXT_WORDS = {"text", "letters", "calligraphy", "inscription", "writing", "script", "words", "arabic"}


def forbidden_terms(accuracy_rows, period, region):
    """Forbidden architectural terms for a period x region, from accuracy.yaml avoid_anachronisms.
    The parenthetical note ("minarets (none in 624)") is dropped; the bare term is what the vision check looks for."""
    terms = []
    for row in accuracy_rows:
        if row.get("period") != period or row.get("region") != region:
            continue
        for item in row.get("avoid_anachronisms") or []:
            term = item.split("(")[0].strip().lower()
            if term and term not in terms:
                terms.append(term)
    return terms


def ocr_gate(letters):
    return {"gate": "ocr", "passed": letters == 0, "letters": letters}


def face_gate(faces):
    return {"gate": "face", "passed": faces == 0, "faces": faces}


def architecture_gate(hits):
    """hits: forbidden terms the vision-language check reported in the image. Any hit fails."""
    return {"gate": "architecture", "passed": not hits, "hits": sorted(set(hits))}


def figure_gate(policy, humans, faces):
    """A detected face always fails. Under figure_policy none, any detected human fails."""
    passed = faces == 0 and not (policy == "none" and humans > 0)
    return {"gate": "figure", "passed": passed, "policy": policy, "humans": humans, "faces": faces}


def prompt_lint(prompt, policy):
    """Positive sentences only: a sentence beginning "No " is the house-style negative and is ignored.
    Under none or still-life, person words fail; text words fail under every policy."""
    positive = [s.strip().lower() for s in prompt.split(".") if s.strip() and not s.strip().lower().startswith("no ")]
    words = set(" ".join(positive).replace(",", " ").split())
    bad_text = sorted(words & TEXT_WORDS)
    bad_people = sorted(words & PERSON_WORDS) if policy in ("none", "still-life") else []
    return {"gate": "prompt_lint", "passed": not bad_text and not bad_people,
            "text_words": bad_text, "person_words": bad_people}


def gate_report(gates):
    """All gates for one seed, with the report hash recorded on the approval."""
    body = json.dumps(gates, sort_keys=True, ensure_ascii=False)
    return {"passed": all(g["passed"] for g in gates),
            "gates": gates,
            "hash": "sha256:" + hashlib.sha256(body.encode("utf-8")).hexdigest()}
