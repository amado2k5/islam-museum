import { describe, expect, it } from "vitest";
import { gitDates, parseNameOnlyLog, parsePorcelain } from "./git-dates";
import { ROOT } from "./lib";

describe("git-dates: per-file last-changed dates (the entity citation date)", () => {
  it("takes the newest commit date per path from a name-only log", () => {
    const log = ["\0" + "2026-10-20", "data/person/a.yaml", "content/ar/person/a.md", "", "\0" + "2026-10-01", "data/person/a.yaml", "data/person/b.yaml", ""].join("\n");
    const m = parseNameOnlyLog(log);
    expect(m.get("data/person/a.yaml")).toBe("2026-10-20");
    expect(m.get("content/ar/person/a.md")).toBe("2026-10-20");
    expect(m.get("data/person/b.yaml")).toBe("2026-10-01");
    expect(m.has("")).toBe(false);
  });
  it("reads uncommitted paths from porcelain status, renames by their new name", () => {
    expect(parsePorcelain(" M data/person/a.yaml\n?? data/person/new.yaml\nR  data/person/x.yaml -> data/person/y.yaml\n"))
      .toEqual(["data/person/a.yaml", "data/person/new.yaml", "data/person/y.yaml"]);
  });
  it("in this checkout, dates an entity file from history and never invents one outside YYYY-MM-DD", () => {
    const d = gitDates(ROOT, ["data/event/expedition-of-al-sawiq.yaml"]);
    expect(d.commit).toMatch(/^[0-9a-f]{40}$/);
    expect(d.dateOf("data/event/expedition-of-al-sawiq.yaml")).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    // a path git never saw falls back to HEAD's day, so the result is still a function of the commit
    expect(d.dateOf("data/person/does-not-exist.yaml")).toBe(d.committed!.slice(0, 10));
  });
});
