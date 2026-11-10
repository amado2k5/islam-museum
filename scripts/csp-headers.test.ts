import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { p } from "./lib";

// The footer version is filled in by shell.js fetching /api/v1/meta/deploy.json, which the
// site Worker redirects to the environment's API host (production: api.islam.museum, UAT:
// uat-api.islam.museum). The Content Security Policy in site/public/_headers must allow BOTH
// hosts in connect-src, or the browser blocks the fetch on that environment and the footer
// keeps showing the bare changelog link (found on UAT, 6 Nov 2026).
describe("site/public/_headers Content Security Policy", () => {
  const headers = readFileSync(p("site", "public", "_headers"), "utf8");
  const csp = headers.split("\n").find((l) => l.includes("Content-Security-Policy:")) ?? "";
  const connectSrc = csp.split(";").map((d) => d.trim()).find((d) => d.startsWith("connect-src")) ?? "";

  it("has a connect-src directive", () => {
    expect(connectSrc).not.toBe("");
  });

  it("allows the production API host", () => {
    expect(connectSrc).toContain("https://api.islam.museum");
  });

  it("allows the UAT API host", () => {
    expect(connectSrc).toContain("https://uat-api.islam.museum");
  });
});
