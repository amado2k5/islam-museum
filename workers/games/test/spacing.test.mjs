// Founder rule, 28 November 2026: production is deployed at most once an hour, to keep R2 Class A operations down.
// The games' production release starts with its own "Hourly spacing" job; a check (which writes nothing) skips it,
// and the release job runs only when the spacing job passed or was skipped.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const text = readFileSync(new URL("../../../.github/workflows/games-deploy.yml", import.meta.url), "utf8");

test("a games production release waits for the hourly spacing job", () => {
  assert.match(text, /\n  spacing:\n    name: Hourly spacing\n    if: inputs\.action != 'check'\n/);
  assert.match(text, /\n  production:\n    needs: \[spacing\]\n    # [^\n]*\n    if: \$\{\{ !cancelled\(\) && \(needs\.spacing\.result == 'success' \|\| needs\.spacing\.result == 'skipped'\) \}\}\n/);
  assert.match(text, /MINUTES: "60"/);
  assert.match(text, /workflows\/games-deploy\.yml\/runs/);
});

test("only the founder's urgent input lets a release through within the hour, and it is off by default", () => {
  assert.match(text, /\n      urgent:\n        description: "Founder only:[^\n]*"\n        required: false\n        type: boolean\n        default: false\n/);
  assert.match(text, /if \[ "\$URGENT" = "true" \]/);
});
