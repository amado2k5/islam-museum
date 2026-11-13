import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { check, linesWithReplacementChar } from "./check-encoding";

const dir = mkdtempSync(join(tmpdir(), "check-encoding-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe("check-encoding", () => {
  it("names the lines that hold U+FFFD, each once", () => {
    expect(linesWithReplacementChar(Buffer.from("a\nb��c\nd\n�"))).toEqual([2, 4]);
    expect(linesWithReplacementChar(Buffer.from("نص سليم\nclean"))).toEqual([]);
  });

  it("finds the character in a field validate.ts does not walk (a passage's text)", () => {
    mkdirSync(join(dir, "data", "passage"), { recursive: true });
    mkdirSync(join(dir, "content", "ar", "person"), { recursive: true });
    writeFileSync(join(dir, "data", "passage", "good.yaml"), 'id: passage/good\ntext: "ولم يفطر"\n');
    writeFileSync(join(dir, "data", "passage", "bad.yaml"), 'id: passage/bad\ntext: "ولم ي��طر"\n');
    writeFileSync(join(dir, "content", "ar", "person", "bad.md"), "---\nid: person/bad\n---\nسطر\nسطر �\n");
    writeFileSync(join(dir, "data", "passage", "picture.png"), Buffer.from([0xef, 0xbf, 0xbd]));
    const { files, errors } = check([join(dir, "data"), join(dir, "content"), join(dir, "absent")]);
    expect(files).toBe(3);
    expect(errors).toHaveLength(2);
    expect(errors.find((e) => e.includes("bad.yaml"))).toContain("line 2");
    expect(errors.find((e) => e.includes("bad.md"))).toContain("line 5");
  });
});
