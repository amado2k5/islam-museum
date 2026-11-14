import { describe, expect, it, afterAll } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { checkPacket } from "./check-packet";

const made: string[] = [];
afterAll(() => { for (const d of made) rmSync(d, { recursive: true, force: true }); });

const MANIFEST = (entities: string[], extra = "") => `id: test-packet-1
lane: test
stage: verified
author_agent: a
verifier_agent: b
model: m
date: 2026-11-14
base_commit: abc
entities: [${entities.join(", ")}]
new_entities: [${entities.join(", ")}]
canary: {kind: Data, text: "A test entry."}
ledger: {file: docs/delegation/test.md, lines: ["x"]}
${extra}`;
const PROV = `provenance: {generated_by: "t", model: "m", run: "r", source: "s"}`;
const dataYaml = (id: string, extra = "") => `id: ${id}
class: ${id.split("/")[0]}
label: { ar: "اسم", en: "Name" }
summary: { ar: "موجز", en: "Summary" }
sources: [source/5pillars]
${PROV}
status: { review: draft }
${extra}`;
const prose = (id: string, lang: string, body: string) => `---\nid: ${id}\nlang: ${lang}\nsource_lang: ar\n${PROV.replace(": {", ":\n  ").replace(/, /g, "\n  ").replace("}", "")}\n---\n${body}\n`;

function packet(files: Record<string, string>, manifest: string): string {
  const dir = mkdtempSync(join(tmpdir(), "packet-"));
  made.push(dir);
  writeFileSync(join(dir, "manifest.yaml"), manifest);
  for (const [rel, text] of Object.entries(files)) {
    const f = join(dir, "files", rel);
    mkdirSync(dirname(f), { recursive: true });
    writeFileSync(f, text);
  }
  return dir;
}
const good = (extraBody = "") => {
  const id = "place/zz-test-town";
  const f: Record<string, string> = { [`data/${id}.yaml`]: dataYaml(id) };
  for (const l of ["ar", "en", "ur"]) f[`content/${l}/${id}.md`] = prose(id, l, `## Summary\nText about [[person/muhammad|him]]. {cite:5pillars p. 1}${extraBody}`);
  return packet(f, MANIFEST([id]));
};
const has = (r: { errors: string[] }, re: RegExp) => r.errors.some((e) => re.test(e));

describe("check-packet", () => {
  it("passes a well-formed packet", () => {
    const r = checkPacket(good());
    expect(r.errors).toEqual([]);
    expect(r.entities).toEqual(["place/zz-test-town"]);
  });
  it("fails on a missing manifest, bad YAML and a missing verifier", () => {
    expect(has(checkPacket(mkdtempSync(join(tmpdir(), "packet-"))), /manifest.yaml: missing/)).toBe(true);
    const bad = packet({ "data/place/zz-a.yaml": "id: [unclosed" }, MANIFEST(["place/zz-a"]));
    expect(has(checkPacket(bad), /YAML does not parse/)).toBe(true);
    const noVerifier = packet({}, MANIFEST([]).replace("verifier_agent: b\n", ""));
    expect(has(checkPacket(noVerifier), /verifier_agent/)).toBe(true);
  });
  it("fails on more than 25 entities", () => {
    const ids = Array.from({ length: 26 }, (_, i) => `place/zz-t${i}`);
    const files: Record<string, string> = {};
    for (const id of ids) files[`data/${id}.yaml`] = dataYaml(id);
    expect(has(checkPacket(packet(files, MANIFEST(ids))), /limit is 25/)).toBe(true);
  });
  it("accepts the landed-packet shape: prose frontmatter with id, lang and status only, provenance kept in the data record", () => {
    const id = "place/zz-test-town";
    const f: Record<string, string> = { [`data/${id}.yaml`]: dataYaml(id) };
    for (const l of ["ar", "en", "ur"]) f[`content/${l}/${id}.md`] = `---\nid: ${id}\nlang: ${l}\nsource_lang: ar\ntranslators: ["x, draft translation"]\nstatus:\n  review: draft\n---\n## Summary\nText. {cite:5pillars p. 1}\n`;
    const r = checkPacket(packet(f, MANIFEST([id])));
    expect(r.errors).toEqual([]);
    expect(r.warnings.filter((w) => /provenance/.test(w))).toEqual([]);
  });
  it("only warns about missing provenance, as validate does not require it", () => {
    const id = "place/zz-test-town";
    const f = { [`data/${id}.yaml`]: dataYaml(id).replace(PROV, "") };
    const r = checkPacket(packet(f, MANIFEST([id])));
    expect(r.errors).toEqual([]);
    expect(r.warnings.some((w) => /no provenance block/.test(w))).toBe(true);
  });
  it("fails when a language of new prose is missing", () => {
    const id = "place/zz-test-town";
    const f = { [`data/${id}.yaml`]: dataYaml(id), [`content/ar/${id}.md`]: prose(id, "ar", "نص"), [`content/en/${id}.md`]: `---\nid: ${id}\nlang: en\n---\nText\n` };
    const r = checkPacket(packet(f, MANIFEST([id])));
    expect(has(r, /no ur file/)).toBe(true);
  });
  it("fails on an unresolved link and an unresolved citation", () => {
    const r = checkPacket(good(" [[person/zz-nobody-here]] {cite:zz-no-such-source}"));
    expect(has(r, /unresolved link \[\[person\/zz-nobody-here\]\]/)).toBe(true);
    expect(has(r, /zz-no-such-source/)).toBe(true);
  });
  it("accepts a link to an entity inside the same packet", () => {
    const a = "place/zz-a", b = "place/zz-b";
    const f: Record<string, string> = { [`data/${a}.yaml`]: dataYaml(a), [`data/${b}.yaml`]: dataYaml(b) };
    for (const id of [a, b]) for (const l of ["ar", "en", "ur"]) f[`content/${l}/${id}.md`] = prose(id, l, id === a ? "See [[place/zz-b]]." : "Text.");
    expect(checkPacket(packet(f, MANIFEST([a, b]))).errors).toEqual([]);
  });
  it("fails on honorifics, Qur'an markers, ellipses and unwrapped Arabic parentheses", () => {
    expect(has(checkPacket(good(" peace be upon him")), /honorifics/)).toBe(true);
    expect(has(checkPacket(good(" ﴿x﴾")), /Qur'an text markers/)).toBe(true);
    expect(has(checkPacket(good(" and so on...")), /ellipsis/)).toBe(true);
    expect(has(checkPacket(good(" and so on…")), /ellipsis/)).toBe(true);
    const id = "place/zz-test-town";
    const f: Record<string, string> = { [`data/${id}.yaml`]: dataYaml(id) };
    for (const l of ["ar", "en", "ur"]) f[`content/${l}/${id}.md`] = prose(id, l, l === "ar" ? "مدينة (مكة) قديمة" : "Text");
    expect(has(checkPacket(packet(f, MANIFEST([id]))), /U\+2066/)).toBe(true);
    f["content/ar/" + id + ".md"] = prose(id, "ar", "مدينة ⁦(مكة)⁩ قديمة");
    expect(checkPacket(packet(f, MANIFEST([id]))).errors).toEqual([]);
  });
  it("fails on a mention of a blocked organisation", () => {
    expect(has(checkPacket(good(" The Taliban took the town.")), /blocked organisation/)).toBe(true);
  });
  it("rejects a staged Qur'an passage file and warns on a self-promoted published status", () => {
    const q = packet({ "data/passage/quran-1-1.yaml": "id: passage/quran-1-1\n" }, MANIFEST(["passage/quran-1-1"]));
    expect(has(checkPacket(q), /never staged/)).toBe(true);
    const id = "place/zz-test-town";
    const pub = packet({ [`data/${id}.yaml`]: dataYaml(id).replace("review: draft", "review: published") }, MANIFEST([id]));
    expect(checkPacket(pub).warnings.some((w) => /self-promotes/.test(w))).toBe(true);
  });
});
