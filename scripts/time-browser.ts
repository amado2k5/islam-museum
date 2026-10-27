// Time Browser data build (TB1). Reads .cache/graph.json and writes one
// staging JSON per language and per topic, for upload to R2 (DESIGN §8 item 7).
// No model call, no network: the output is deterministic from the graph.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

export const TIME_BROWSER_BASE = '/time-browser-data'
export const TOPICS = [
  'event', 'person', 'place', 'polity', 'period', 'theme',
  'work', 'concept', 'practice',
] as const
export type Topic = (typeof TOPICS)[number]
export const LAUNCH_PER_TOPIC = 50
const LANGS = ['ar', 'en', 'ur'] as const

export interface GraphNode {
  id: string
  class: string
  slug: string
  label: Record<string, string>
  summary: Record<string, string>
  span?: { earliest: number; latest: number }
  display?: { start?: { edtf?: string } }
  data?: {
    sources?: string[]
    status?: { review?: string }
    perspectives?: unknown
  }
}

export interface Record_ {
  id: string
  kind: Topic
  timelineKey: number
  date: string
  title: Record<string, string>
  summary: Record<string, string>
  href: string
  sources: string[]
  draft: boolean
  kids: string[]
}

// Sorted by earliest year, then id. Contested records (with perspectives) are
// kept as stops but never listed as kids (DESIGN §3 rule).
export function buildRecords(nodes: GraphNode[], topic: Topic): Record_[] {
  const pool = nodes
    .filter((n) => n.class === topic && n.span)
    .filter((n) => (n.data?.sources ?? []).length > 0)
    .sort((a, b) => (a.span!.earliest - b.span!.earliest) || a.id.localeCompare(b.id))
    .slice(0, LAUNCH_PER_TOPIC)

  return pool.map((n) => {
    const summary: Record<string, string> = { ar: n.summary.ar ?? '', en: n.summary.en ?? '' }
    if (n.summary.ur) summary.ur = n.summary.ur
    return {
      id: n.id,
      kind: topic,
      timelineKey: n.span!.earliest,
      date: n.display?.start?.edtf ?? '',
      title: { ar: n.label.ar ?? '', en: n.label.en ?? '', ...(n.label.ur ? { ur: n.label.ur } : {}) },
      summary,
      href: '',
      sources: n.data!.sources!,
      draft: n.data?.status?.review !== 'published',
      kids: [],
    }
  })
}

export function writeAll(graphPath: string, outDir: string): number {
  const graph = JSON.parse(readFileSync(graphPath, 'utf8')) as { nodes: GraphNode[] }
  let files = 0
  for (const lang of LANGS) {
    const dir = join(outDir, lang)
    mkdirSync(dir, { recursive: true })
    const topics: Record<string, Record_[]> = {}
    for (const t of TOPICS) {
      const recs = buildRecords(graph.nodes, t).map((r) => ({
        ...r,
        href: `/${lang}/${r.id}/`,
      }))
      topics[t] = recs
      writeFileSync(join(dir, `${t}.json`), JSON.stringify(recs))
      files++
    }
    writeFileSync(join(dir, 'index.json'), JSON.stringify({ base: TIME_BROWSER_BASE, topics }))
    files++
  }
  return files
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const out = join(process.cwd(), '.cache', 'time-browser')
  const n = writeAll(join(process.cwd(), '.cache', 'graph.json'), out)
  console.log(`time-browser: wrote ${n} files to ${out}`)
}
