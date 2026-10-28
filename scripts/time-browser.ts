// Time Browser data build (TB1). Reads .cache/graph.json and writes one
// staging JSON per language and per topic, for upload to R2 (DESIGN §8 item 7).
// No model call, no network: the output is deterministic from the graph.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { loadMedia, wireRecord } from './time-browser-wire.ts'

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
  periods?: string[]
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
  derived: boolean
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
export interface Position { earliest: number; latest: number; derived: boolean }

// A node's place on the timeline (DESIGN §3): its own span, else its founded
// date (sourced), else the span of its first dated linked period (derived).
export function positionOf(n: GraphNode, byId: Map<string, GraphNode>): Position | null {
  if (n.span) return { earliest: n.span.earliest, latest: n.span.latest, derived: false }
  const founded = (n.data as { founded?: { edtf?: string } } | undefined)?.founded?.edtf
  const year = founded ? Number.parseInt(founded, 10) : Number.NaN
  if (!Number.isNaN(year)) return { earliest: year, latest: year, derived: false }
  for (const pid of n.periods ?? []) {
    const p = byId.get(pid)
    if (p?.span) return { earliest: p.span.earliest, latest: p.span.latest, derived: true }
  }
  return null
}

// Take `count` items spread evenly across the sorted timeline, so one batch
// covers the whole range instead of only the earliest years (DESIGN §8).
export function spreadAcrossTime<T>(sorted: T[], count: number): T[] {
  if (sorted.length <= count) return sorted
  const picked: T[] = []
  for (let i = 0; i < count; i++) {
    picked.push(sorted[Math.round((i * (sorted.length - 1)) / (count - 1))])
  }
  return picked
}

export function buildRecords(nodes: GraphNode[], topic: Topic): Record_[] {
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const pool = nodes
    .filter((n) => n.class === topic)
    .filter((n) => (n.data?.sources ?? []).length > 0)
    .filter((n) => Boolean(n.label.ar) && Boolean(n.label.en))
    .map((n) => ({ n, pos: positionOf(n, byId) }))
    .filter((x): x is { n: GraphNode; pos: Position } => x.pos !== null)
    .sort((a, b) => (a.pos.earliest - b.pos.earliest) || a.n.id.localeCompare(b.n.id))
  const records = spreadAcrossTime(pool, LAUNCH_PER_TOPIC)
  return records.map(({ n, pos }) => {
    // Citation markers ({cite:...}) belong to the entity page, not to the stop card.
    const plain = (x: string) => x.replace(/\{cite:[^}]*\}/g, '').replace(/\s+/g, ' ').trim()
    const summary: Record<string, string> = { ar: plain(n.summary.ar ?? ''), en: plain(n.summary.en ?? '') }
    if (n.summary.ur) summary.ur = plain(n.summary.ur)
    return {
      id: n.id,
      kind: topic,
      timelineKey: pos.earliest,
      derived: pos.derived,
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

// Production launch set: this many records in total across every type, spread
// over the whole timeline (founder request: go live with a small set first).
export const LIVE_TOTAL = 10

// Tour stops (DESIGN decision 14): six stops from the live set, in timeline order.
// The tour reads only these records and never searches.
export const TOUR_IDS = [
  'polity/achaemenid-empire',
  'concept/labba-fiqh',
  'polity/ghaznavid-empire',
  'event/salah-al-din-mosul-581',
  'event/battle-of-ohrid-1464',
  'event/battle-of-akhaltsikhe-1853',
]

export function tourSubset(live: Record_[]): Record_[] {
  const byId = new Map(live.map((r) => [r.id, r]))
  return TOUR_IDS.map((id) => {
    const r = byId.get(id)
    if (!r) throw new Error(`time-browser: tour stop ${id} is not in the live set`)
    return r
  })
}

export function liveSubset(topics: Record<string, Record_[]>): Record_[] {
  const all = Object.values(topics).flat().sort((a, b) => (a.timelineKey - b.timelineKey) || a.id.localeCompare(b.id))
  return spreadAcrossTime(all, LIVE_TOTAL)
}

export function writeAll(graphPath: string, outDir: string): number {
  const graph = JSON.parse(readFileSync(graphPath, 'utf8')) as { nodes: GraphNode[] }
  let files = 0
  const media = loadMedia(process.cwd())
  for (const lang of LANGS) {
    const dir = join(outDir, lang)
    mkdirSync(dir, { recursive: true })
    const topics: Record<string, Record_[]> = {}
    for (const t of TOPICS) {
      const recs = buildRecords(graph.nodes, t).map((r) => ({
        ...r,
        href: `/${lang}/${r.id}/`,
        ...wireRecord(r.id, lang, media),
      }))
      topics[t] = recs
      writeFileSync(join(dir, `${t}.json`), JSON.stringify(recs))
      files++
    }
    writeFileSync(join(dir, 'index.json'), JSON.stringify({ base: TIME_BROWSER_BASE, topics }))
    const live = liveSubset(topics)
    writeFileSync(join(dir, 'live.json'), JSON.stringify(live))
    writeFileSync(join(dir, 'tour.json'), JSON.stringify(tourSubset(live)))
    files++
  }
  return files
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const out = join(process.cwd(), '.cache', 'time-browser')
  const n = writeAll(join(process.cwd(), '.cache', 'graph.json'), out)
  console.log(`time-browser: wrote ${n} files to ${out}`)
}
