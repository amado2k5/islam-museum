// The Job Browser's shared reads (docs/jobs/site.md, docs/jobs/schema.md): the job records, their domains and their holders,
// all taken from the compiled graph at build time. A holder is a person whose `occupations:` block names the job
// (schema.md section 2); nothing is inferred from roles.
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { realNodes } from "./graph";
import { repoPath } from "./paths";
import type { Node } from "../../../scripts/build-graph";
import type { Lang } from "./i18n";

export interface Domain { id: string; label: Record<Lang, string> }
/** The fourteen domains, in the order of schema/enums/job-domains.yaml. */
export const DOMAINS: Domain[] = parse(readFileSync(repoPath("schema", "enums", "job-domains.yaml"), "utf8"));
export const domainLabel = (id: string, lang: Lang): string => {
  const d = DOMAINS.find((x) => x.id === id);
  return d ? d.label[lang] ?? d.label.en : id;
};

export const jobNodes: Node[] = realNodes.filter((n) => n.class === "job");
const personNodes: Node[] = realNodes.filter((n) => n.class === "person");

// job id -> the persons who hold it (one entry per person, however many stints the occupations block lists)
const holdersByJob = new Map<string, Node[]>();
for (const p of personNodes) {
  for (const job of new Set<string>((p.data.occupations ?? []).map((o: any) => o.job))) {
    const list = holdersByJob.get(job) ?? [];
    list.push(p);
    holdersByJob.set(job, list);
  }
}
export const holdersOf = (jobId: string): Node[] => holdersByJob.get(jobId) ?? [];
/** Persons with at least one occupations entry: the "people recorded" count of the browser home. */
export const peopleWithJobs: Node[] = personNodes.filter((p) => (p.data.occupations?.length ?? 0) > 0);
/** A job has an article when it has prose in at least one language. */
export const hasArticle = (n: Node): boolean => Object.keys(n.prose ?? {}).length > 0;

/** The headings that mark a job article's "not yet covered" section, in the three languages it is written in. */
export const JOB_NOT_YET = ["Not yet covered", "ما لم يُستوفَ بعد", "ابھی تحریر نہیں ہوا"];
