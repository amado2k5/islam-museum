// The Inventions Browser's shared reads (docs/inventions/README.md): the invention records, their domains and their
// makers, all taken from the compiled graph at build time.
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { realNodes } from "./graph";
import { repoPath } from "./paths";
import { ui, type Lang } from "./i18n";
import type { Node } from "../../../scripts/build-graph";

/** The domains, in the order of schema/enums/invention-domains.yaml. */
export const INVENTION_DOMAINS: string[] = parse(readFileSync(repoPath("schema", "enums", "invention-domains.yaml"), "utf8"));
export const inventionDomainLabel = (id: string, lang: Lang): string => ui(lang).inventionDomains?.[id] ?? id;

export const inventionNodes: Node[] = realNodes.filter((n) => n.class === "invention");
export const hasInventionArticle = (n: Node): boolean => Object.keys(n.prose ?? {}).length > 0;
export const makerIds = (n: Node): string[] => [...new Set<string>((n.data.makers ?? []).map((m: any) => m.person).filter(Boolean))];
export const inventionMakers: string[] = [...new Set(inventionNodes.flatMap(makerIds))];
