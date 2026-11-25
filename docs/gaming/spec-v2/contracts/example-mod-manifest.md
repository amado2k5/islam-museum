# Illustrative pack manifest

This example is intentionally non-installable. Fable must define the actual JSON Schema, validation and sample assets. No arbitrary executable URL.

```json
{
  "manifestVersion": 1,
  "id": "example.creator.library",
  "version": "1.0.0",
  "kind": "content-pack",
  "apiRange": "^1.0.0",
  "targetGames": [
    "architects",
    "golden-age"
  ],
  "license": "CC0-1.0",
  "author": "Example creator (fictional)",
  "capabilities": [
    "content:buildings"
  ],
  "dependencies": [],
  "assets": [
    {
      "path": "models/library.glb",
      "sha256": "EXAMPLE_REPLACE_WITH_ACTUAL_DIGEST",
      "bytes": 0
    }
  ],
  "note": "Illustrative only. Not a valid installable pack; generate actual schema, digest, bytes and assets."
}
```
