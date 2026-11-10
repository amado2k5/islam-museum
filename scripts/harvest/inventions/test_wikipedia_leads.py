#!/usr/bin/env python3
"""Self-test for Wikipedia lead revision handling. Run: python test_wikipedia_leads.py"""
import unittest

from wikipedia_leads import page_revision, revision_url


class WikipediaLeadTests(unittest.TestCase):
    def test_page_revision_keeps_the_exact_revision(self):
        page = {
            "pageid": 42,
            "title": "Algebra",
            "revisions": [{"revid": 1234, "timestamp": "2026-11-01T00:00:00Z"}],
        }
        self.assertEqual(
            page_revision(page),
            {
                "page_id": 42,
                "title": "Algebra",
                "revision_id": 1234,
                "revision_timestamp": "2026-11-01T00:00:00Z",
            },
        )

    def test_page_without_a_revision_is_not_a_lead(self):
        self.assertIsNone(page_revision({"pageid": 42, "title": "Deleted page"}))

    def test_revision_url_uses_the_wikipedia_language_host(self):
        self.assertEqual(
            revision_url("ar", 1234),
            "https://ar.wikipedia.org/w/index.php?oldid=1234",
        )


if __name__ == "__main__":
    unittest.main()
