// The games' side of the wall between the games and the website (founder's instruction, 25 November 2026): the
// games' workflows build, test and deploy the games' own code and files and nothing of the website's. The website's
// side of the same wall is guarded in its own suite, scripts/games-separation.test.ts.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const dir = new URL("../../../.github/workflows/", import.meta.url);
const read = (name) => readFileSync(new URL(name, dir), "utf8");
const games = readdirSync(dir).filter((f) => /^games-.*\.yml$/.test(f));
/** A workflow's text without its comments, so that an explanation may name what the workflow does not touch. */
const code = (text) => text.split("\n").map((line) => line.replace(/(^|\s)#.*$/, "")).join("\n");

test("the games have their five workflows, and no other workflow is named like them", () => {
  assert.deepEqual(games.sort(), ["games-build.yml", "games-deploy-env.yml", "games-deploy-uat.yml", "games-deploy.yml", "games-media.yml"]);
});

test("no games workflow builds, publishes or deploys anything of the website", () => {
  for (const name of games) {
    const text = code(read(name));
    for (const forbidden of ["workers/site", "dist-assets", "pages deploy", "r2-sync/batch", "publish.mjs --dist", "npm run build\n", "npm run validate", "site/", "PAGES_PROJECT", "R2_SYNC_TOKEN"]) assert.ok(!text.includes(forbidden), `${name} mentions ${forbidden}`);
    // The website's own workflows are never called or looked up: only the games' (games-*.yml).
    assert.ok(!/(?<!games-)(deploy-env|deploy-uat|deploy|build|validate)\.yml/.test(text), `${name} names one of the website's workflows`);
    // The only uploads are the build's artifact and the publisher's, which is confined to games/ (publish.test.mjs).
    assert.ok(!/aws s3|wrangler r2|s3api/.test(text), `${name} talks to the bucket directly instead of through the publisher`);
  }
});

test("the build runs only for the games' own files, and the deploys only when a person starts them", () => {
  const build = read("games-build.yml");
  const paths = [...build.matchAll(/^\s+- "([^"]+)"$/gm)].map((m) => m[1]);
  assert.deepEqual([...new Set(paths)].sort(), [".github/workflows/games-*.yml", "gaming/**", "workers/games/**"]);
  assert.ok(!/secrets\./.test(code(build)), "the build needs no secret");
  for (const name of ["games-deploy-uat.yml", "games-deploy.yml", "games-media.yml"]) {
    const text = code(read(name));
    const triggers = text.slice(text.indexOf("\non:"), text.indexOf("\npermissions:"));
    assert.match(triggers, /workflow_dispatch:/);
    assert.ok(!/\b(push|pull_request|schedule|workflow_run):/.test(triggers), `${name} can start without a person`);
    if (name !== "games-media.yml") assert.match(text, /uses: \.\/\.github\/workflows\/games-deploy-env\.yml/);
    else assert.match(text, /Only the repository owner or an admin may start this workflow/);
  }
  const shared = code(read("games-deploy-env.yml"));
  assert.match(shared, /\non:\n  workflow_call:/);
  assert.match(shared, /Only the repository owner or an admin may start this workflow/);
  // Production and UAT never share a concurrency group, and neither shares one with the website's deploys.
  assert.match(read("games-deploy-uat.yml"), /group: games-deploy-uat/);
  assert.match(read("games-deploy.yml"), /group: games-deploy-production/);
});

test("a UAT run is refused if it names anything of production", () => {
  const shared = read("games-deploy-env.yml");
  for (const guard of ['[ "$R2_BUCKET" = "islam-museum-search" ] || fail', '[ "$R2_BUCKET" != "islam-museum-search" ] || fail', '[ "$WRANGLER_ENV" = "$ENVIRONMENT" ] || fail', 'a $ENVIRONMENT run may not take the production host', '[ "$bucket" = "$R2_BUCKET" ]']) {
    assert.ok(shared.includes(guard), guard);
  }
});
