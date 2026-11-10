#!/usr/bin/env python3
"""Unit tests for the automated illustration gates and approval runner (docs/agents/lanes/illustrations.md section 3).
Run: python -m unittest discover -s scripts/media/illustrate/tests -t scripts/media/illustrate  (or from the repo root: python -m unittest discover -s scripts/media/illustrate/tests)"""
import json, sys, tempfile, unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from approve import approve_batch, read_approvals  # noqa: E402
from gates import architecture_gate, face_gate, figure_gate, forbidden_terms, gate_report, ocr_gate, prompt_lint  # noqa: E402

ACCURACY = [{"period": "period/prophetic-era", "region": "arabia",
             "avoid_anachronisms": ["minarets (none in 624)", "domes", "paper"]}]
CLEAN_PROMPT = {"prompt": "A rocky hill at dawn in spring. No text. No faces.", "figure_policy": "none",
                "period": "period/prophetic-era", "region": "arabia"}


class Gates(unittest.TestCase):
    def test_forbidden_terms_drop_notes_and_match_period_region(self):
        self.assertEqual(forbidden_terms(ACCURACY, "period/prophetic-era", "arabia"), ["minarets", "domes", "paper"])
        self.assertEqual(forbidden_terms(ACCURACY, "period/abbasid", "iraq"), [])

    def test_ocr_and_face_fail_on_any_detection(self):
        self.assertFalse(ocr_gate(1)["passed"])
        self.assertTrue(ocr_gate(0)["passed"])
        self.assertFalse(face_gate(1)["passed"])

    def test_architecture_fails_on_any_hit(self):
        self.assertFalse(architecture_gate(["domes"])["passed"])
        self.assertTrue(architecture_gate([])["passed"])

    def test_figure_gate_rejects_humans_under_none(self):
        self.assertFalse(figure_gate("none", 1, 0)["passed"])
        self.assertTrue(figure_gate("distant", 2, 0)["passed"])
        self.assertFalse(figure_gate("distant", 2, 1)["passed"])  # any face fails

    def test_prompt_lint_ignores_house_negatives_but_catches_positive_words(self):
        self.assertTrue(prompt_lint("A hill. No people. No text.", "none")["passed"])
        self.assertFalse(prompt_lint("A hill with a portrait of a man.", "none")["passed"])
        self.assertFalse(prompt_lint("A scroll with calligraphy.", "distant")["passed"])

    def test_report_hash_is_stable_and_fails_if_any_gate_fails(self):
        g = [ocr_gate(0), face_gate(0)]
        self.assertEqual(gate_report(g)["hash"], gate_report(list(g))["hash"])
        self.assertTrue(gate_report(g)["passed"])
        self.assertFalse(gate_report(g + [face_gate(1)])["passed"])


class Runner(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        root = Path(self.tmp.name)
        self.batch = root / "review" / "b1"
        self.batch.mkdir(parents=True)
        prompts = root / "prompts" / "event"
        prompts.mkdir(parents=True)
        (prompts / "a.json").write_text(json.dumps(CLEAN_PROMPT))
        (prompts / "b.json").write_text(json.dumps(CLEAN_PROMPT))
        self.prompts = root / "prompts"
        self.screen = [
            {"media_id": "illus-event-a", "class": "event", "slug": "a", "seed": 7, "png": "x.png", "ocr_letters": 0, "faces": 0, "humans": 0},
            {"media_id": "illus-event-a", "class": "event", "slug": "a", "seed": 107, "png": "y.png", "ocr_letters": 0, "faces": 0, "humans": 0},
            {"media_id": "illus-event-b", "class": "event", "slug": "b", "seed": 7, "png": "z.png", "ocr_letters": 2, "faces": 0, "humans": 0},
        ]
        (self.batch / "screen.json").write_text(json.dumps(self.screen))

    def tearDown(self):
        self.tmp.cleanup()

    def run_batch(self, vlm=lambda png, terms: []):
        return approve_batch(self.batch, self.prompts, ACCURACY, vlm, now="2026-10-15T00:00:00+00:00")

    def test_one_seed_per_entity_and_failures_recorded(self):
        audit = self.run_batch()
        self.assertEqual([a["seed"] for a in audit["approvals"]], [7])
        self.assertEqual(audit["approvals"][0]["status"], {"review": "draft", "approved_by": "pipeline"})
        self.assertEqual(len(audit["rejections"]), 1)
        self.assertFalse(audit["rejections"][0]["gate_report"]["passed"])
        self.assertTrue(audit["approvals"][0]["gate_report"]["hash"].startswith("sha256:"))

    def test_vlm_hit_rejects_the_seed(self):
        audit = self.run_batch(vlm=lambda png, terms: ["domes"] if png == "x.png" else [])
        self.assertEqual([a["seed"] for a in audit["approvals"]], [107])

    def test_audit_file_is_written_and_read_by_ingest(self):
        self.run_batch()
        self.assertEqual([a["media_id"] for a in read_approvals(self.batch)], ["illus-event-a"])

    def test_revert_by_deleting_record_then_ingest_sees_nothing(self):
        self.run_batch()
        path = self.batch / "auto-approved.json"
        audit = json.loads(path.read_text())
        audit["approvals"] = []
        path.write_text(json.dumps(audit))
        self.assertEqual(read_approvals(self.batch), [])

    def test_rerun_does_not_duplicate_approvals(self):
        self.run_batch()
        audit = self.run_batch()
        self.assertEqual(len(audit["approvals"]), 1)


if __name__ == "__main__":
    unittest.main()
