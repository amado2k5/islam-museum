import contextlib
import io
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import yaml

import translations


PASSAGE = """text: "Arabic text fixture"
text_search: "search fixture"
translations:
  en: { text: "English fixture", translator: Pickthall, license: PD }
  ur: { text: "Urdu fixture", translator: Jalandhari, license: PD }
relations: []
sources: [source/tanzil-quran, source/tanzil-translations, source/another-edition]
"""


class TranslationImportTest(unittest.TestCase):
    def test_requires_exact_tanzil_reference_set(self):
        with tempfile.TemporaryDirectory() as directory:
            translation = Path(directory) / "fr"
            rows = [f"{s}|{a}|Exemple\n" for s, a in translations.REFS]
            translation.write_text("".join(rows), encoding="utf-8")
            self.assertEqual(len(translations.parse(translation)), 6236)
            translation.write_text("".join(rows[:-1]) + "115|1|Hors limites\n", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "expected exactly the 6236 Tanzil verse references"):
                translations.parse(translation)

    def test_french_import_preserves_arabic_other_translations_and_citations(self):
        verse = ' Une « citation » avec "guillemets", un | et un accent. '
        with tempfile.TemporaryDirectory() as directory, contextlib.redirect_stdout(io.StringIO()):
            folder = Path(directory)
            record = folder / "quran-1-1.yaml"
            record.write_text(PASSAGE, encoding="utf-8")
            translation = folder / "fr"
            translation.write_text(f"# Source metadata\n1|1|{verse}\n", encoding="utf-8")
            with patch.object(translations, "PDIR", folder), patch.object(translations, "REFS", [(1, 1)]):
                translations.main(["--fr-kazimirski", str(translation)])
            updated = record.read_text(encoding="utf-8")

        parsed = yaml.safe_load(updated)
        self.assertEqual(parsed["translations"]["fr"], {
            "text": verse,
            "translator": "Albert Kazimirski de Biberstein",
            "license": "PD",
        })
        self.assertEqual(parsed["sources"][-1], "source/kazimirski-quran-1869")
        self.assertIn("source/another-edition", parsed["sources"])
        without_fr = "".join(line for line in updated.splitlines(keepends=True) if not line.startswith("  fr:"))
        self.assertEqual(without_fr.replace(", source/kazimirski-quran-1869", ""), PASSAGE)
        self.assertEqual(translations.merge(updated, {"fr": verse}), updated)

    def test_legacy_positional_import_does_not_remove_french(self):
        updated = translations.merge(PASSAGE, {"fr": "Exemple"})
        with tempfile.TemporaryDirectory() as directory, contextlib.redirect_stdout(io.StringIO()):
            folder = Path(directory)
            record = folder / "quran-1-1.yaml"
            record.write_text(updated, encoding="utf-8")
            en, ur = (folder / lang for lang in ("en", "ur"))
            en.write_text("1|1|New English fixture\n", encoding="utf-8")
            ur.write_text("1|1|New Urdu fixture\n", encoding="utf-8")
            with patch.object(translations, "PDIR", folder), patch.object(translations, "REFS", [(1, 1)]):
                translations.main([str(en), str(ur)])
            data = yaml.safe_load(record.read_text(encoding="utf-8"))
        self.assertEqual(data["translations"]["en"]["text"], "New English fixture")
        self.assertEqual(data["translations"]["ur"]["text"], "New Urdu fixture")
        self.assertEqual(data["translations"]["fr"]["text"], "Exemple")
        self.assertEqual(data["sources"].count("source/tanzil-translations"), 1)

    def test_incomplete_or_invalid_alignment_writes_nothing(self):
        with tempfile.TemporaryDirectory() as directory, contextlib.redirect_stderr(io.StringIO()):
            folder = Path(directory)
            record = folder / "quran-1-1.yaml"
            record.write_text(PASSAGE, encoding="utf-8")
            translation = folder / "fr"
            for rows in ("", "1|2|Hors limites\n", "1|1|Exemple\n1|1|Doublon\n", "1|1|  \n"):
                with self.subTest(rows=rows):
                    translation.write_text(rows, encoding="utf-8")
                    with patch.object(translations, "PDIR", folder), patch.object(translations, "REFS", [(1, 1)]):
                        with self.assertRaises(SystemExit) as error:
                            translations.main(["--fr-kazimirski", str(translation)])
                    self.assertEqual(error.exception.code, 2)
                    self.assertEqual(record.read_text(encoding="utf-8"), PASSAGE)


if __name__ == "__main__":
    unittest.main()
