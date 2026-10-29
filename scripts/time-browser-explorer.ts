// Timeline Explorer subject pipeline (correction prompt §5 Step 2). Reads .cache/graph.json and writes
// .cache/time-browser/explorer.json: the curated subjects (people, eras, places), each with its ordered, cited
// nodes and the rail references. Language-neutral: labels and summaries carry ar/en/ur, dates stay as date
// objects and the pages format them per locale. No model call, no network.
//
// Eligibility follows the founder's decision of 28 Oct 2026: a record is shown when it meets the publication
// standard (it cites defined sources), whatever its draft flag; the draft flag is never published.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { existsSync, readdirSync } from 'node:fs'
import { parse } from 'yaml'

type Lang = 'ar' | 'en' | 'ur'
type Text = Partial<Record<Lang, string>>

export interface GNode {
  id: string
  class: string
  label: Text
  summary: Text
  span?: { earliest: number; latest: number }
  periods?: string[]
  coordinates?: [number, number]
  data?: Record<string, any>
}
export interface GEdge { from: string; to: string; type: string; sources?: string[]; inverse?: boolean }

// Subjects live one per file in scripts/explorer-subjects/<class>-<slug>.json, so several sessions can add stories
// at the same time without editing a shared list: { "id", "kind": "person" | "era" | "place", "journey"?: true,
// "regionPlaces"?: [place ids], "owner": "claude" | "devin" }. Each must reach MIN_NODES dated, cited nodes or it
// does not ship.
export interface SubjectDef { id: string; kind: 'person' | 'era' | 'place'; journey?: boolean; regionPlaces?: string[]; owner?: string; years?: [number, number] }
export const SUBJECT_DIR = join(process.cwd(), 'scripts', 'explorer-subjects')
export function loadSubjectDefs(dir = SUBJECT_DIR): SubjectDef[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir).filter((f) => f.endsWith('.json')).sort()
    .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')) as SubjectDef)
}

export const MIN_NODES = 4
export const MAX_NODES = 14

export interface DateObj { edtf?: string; hijri?: string; calendar?: string; precision?: string; status?: string; derived?: boolean }
export interface ExplorerNode {
  id: string
  role: 'birth' | 'event' | 'death'
  entity: string
  title: Text
  summary: Text
  kids: Text | null
  date: DateObj
  key: number
  sources: string[]
  place: { id: string; label: Text; coordinates: [number, number] | null } | null
}
export interface Subject {
  id: string
  kind: 'person' | 'era' | 'place'
  title: Text
  summary: Text
  sources: string[]
  journey: boolean
  nodes: ExplorerNode[]
  persons: { id: string; label: Text }[]
  places: { id: string; label: Text; coordinates: [number, number] | null }[]
  sourceLabels: Record<string, string>
}

const plain = (t: Text): Text => {
  const out: Text = {}
  for (const [k, v] of Object.entries(t ?? {})) {
    if (v) out[k as Lang] = v.replace(/\{cite:[^}]*\}/g, '').replace(/\s+/g, ' ').trim()
  }
  return out
}
// The publication standard (docs/agents/publication-standard.md): citations to defined sources plus recorded provenance.
const cited = (n: GNode | undefined) => (n?.data?.sources ?? []).length > 0 && !!n?.data?.provenance?.source && !!n?.data?.provenance?.generated_by
const dateOf = (n: GNode): DateObj | undefined => n.data?.date?.start ?? n.data?.born ?? n.data?.founded

function ownParticipation(id: string): string[] {
  const file = join(process.cwd(), 'data', `${id}.yaml`)
  if (!existsSync(file)) return []
  const rec = parse(readFileSync(file, 'utf8')) as { relations?: { type: string; target: string }[] }
  return (rec.relations ?? []).filter((r) => r.type === 'participated_in').map((r) => r.target)
}

export function buildSubjects(nodes: GNode[], edges: GEdge[], defs: SubjectDef[] = loadSubjectDefs()): { subjects: Subject[]; skipped: { id: string; reason: string }[] } {
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const degree = new Map<string, number>()
  const placeEdge = new Map<string, string>()
  for (const e of edges) {
    degree.set(e.from, (degree.get(e.from) ?? 0) + 1)
    degree.set(e.to, (degree.get(e.to) ?? 0) + 1)
    if (byId.get(e.to)?.class === 'place' && !placeEdge.has(`${e.type}|${e.from}`)) placeEdge.set(`${e.type}|${e.from}`, e.to)
  }
  const out: Subject[] = []
  const skipped: { id: string; reason: string }[] = []
  const placeOf = (eventId: string, type = 'occurred_at') => {
    const to = placeEdge.get(`${type}|${eventId}`)
    const p = to ? byId.get(to) : undefined
    return p ? { id: p.id, label: p.label, coordinates: p.coordinates ?? null } : null
  }
  const eventNode = (ev: GNode): ExplorerNode => ({
    id: ev.id,
    role: 'event',
    entity: ev.id,
    title: ev.label,
    summary: plain(ev.summary),
    kids: ev.data?.kids ?? null,
    date: dateOf(ev)!,
    key: ev.span!.earliest,
    sources: ev.data!.sources,
    place: placeOf(ev.id),
  })
  // A usable event: dated, cited, with an Arabic title.
  const usable = (n: GNode | undefined): n is GNode =>
    !!n && n.class === 'event' && !!n.span && cited(n) && !!n.label?.ar && !!dateOf(n)
  // Events the subject's own record names come first (they are the curated ones); the rest fill by connections.
  const pickSpread = (list: GNode[], preferred: Set<string> = new Set()) => {
    const sorted = [...list].sort((a, b) => a.span!.earliest - b.span!.earliest || a.id.localeCompare(b.id))
    if (sorted.length <= MAX_NODES) return sorted
    // Keep the most connected events, then restore time order.
    const deg = (n: GNode) => degree.get(n.id) ?? 0
    const rank = (n: GNode) => (preferred.has(n.id) ? 1e9 : 0) + deg(n)
    return [...sorted].sort((a, b) => rank(b) - rank(a)).slice(0, MAX_NODES).sort((a, b) => a.span!.earliest - b.span!.earliest || a.id.localeCompare(b.id))
  }

  for (const s of defs) {
    const subj = byId.get(s.id)
    if (!subj) { skipped.push({ id: s.id, reason: 'no record' }); continue }
    let events: GNode[] = []
    // Only the links written in the subject's own record (data/<class>/<slug>.yaml): the graph stores every
    // participation the same way, whichever record wrote it.
    const preferred = new Set(ownParticipation(s.id))
    if (s.kind === 'person') {
      const ids = edges
        .filter((e) => (e.type === 'participated_in' && e.from === s.id) || (e.type === 'had_participant' && e.to === s.id))
        .map((e) => (e.from === s.id ? e.to : e.from))
      events = [...new Set(ids)].map((id) => byId.get(id)).filter(usable)
    } else if (s.kind === 'era') {
      const span = subj.span
      events = nodes.filter((n) => usable(n) && (n.periods ?? []).includes(s.id) &&
        (!span || (n.span!.earliest >= span.earliest - 1 && n.span!.earliest <= span.latest + 1)))
    } else {
      const targets = new Set([s.id, ...(s.regionPlaces ?? [])])
      const ids = edges.filter((e) => e.type === 'occurred_at' && targets.has(e.to)).map((e) => e.from)
      // Optional year window (for a place story limited to one period): only events that start inside it.
      const window = s.years
      events = [...new Set(ids)].map((id) => byId.get(id)).filter(usable)
        .filter((n) => !window || (n.span!.earliest >= window[0] && n.span!.earliest <= window[1]))
    }
    const nodesOut: ExplorerNode[] = pickSpread(events, preferred).map(eventNode)
    if (s.kind === 'person') {
      const born = subj.data?.born
      const died = subj.data?.died
      if (born && subj.span && cited(subj)) {
        nodesOut.unshift({ id: `${s.id}#birth`, role: 'birth', entity: s.id, title: subj.label, summary: plain(subj.summary),
          kids: null, date: born, key: subj.span.earliest, sources: born.sources ?? subj.data!.sources, place: placeOf(s.id, 'born_in') })
      }
      if (died && subj.span && cited(subj)) {
        nodesOut.push({ id: `${s.id}#death`, role: 'death', entity: s.id, title: subj.label, summary: plain(subj.summary),
          kids: null, date: died, key: subj.span.latest, sources: died.sources ?? subj.data!.sources, place: placeOf(s.id, 'died_in') })
      }
    }
    if (nodesOut.length < MIN_NODES) { skipped.push({ id: s.id, reason: `${nodesOut.length} dated, cited nodes` }); continue }

    // Rail: people linked to the subject or its nodes, and the places of the nodes.
    const nodeIds = new Set(nodesOut.map((n) => n.entity))
    const personCount = new Map<string, number>()
    for (const e of edges) {
      const touches = nodeIds.has(e.from) ? e.to : nodeIds.has(e.to) ? e.from : null
      if (!touches || touches === s.id) continue
      const p = byId.get(touches)
      if (p?.class === 'person' && p.label?.ar) personCount.set(p.id, (personCount.get(p.id) ?? 0) + 1)
    }
    const persons = [...personCount.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 12)
      .map(([id]) => ({ id, label: byId.get(id)!.label }))
    const places = [...new Map(nodesOut.filter((n) => n.place).map((n) => [n.place!.id, n.place!])).values()]
    const allSources = new Set<string>([...(subj.data?.sources ?? []), ...nodesOut.flatMap((n) => n.sources)])
    const sourceLabels: Record<string, string> = {}
    for (const id of allSources) {
      const src = byId.get(id)
      sourceLabels[id] = src?.label?.ar ?? src?.label?.en ?? (src?.data?.title as string | undefined) ?? id
    }
    out.push({
      id: s.id, kind: s.kind, title: subj.label, summary: plain(subj.summary), sources: subj.data?.sources ?? [],
      journey: !!s.journey, nodes: nodesOut, persons, places, sourceLabels,
    })
  }
  return { subjects: out, skipped }
}

// Fails the build on a chronology inversion or an uncited node (§5 Step 2).
export function checkSubjects(subjects: Subject[]): string[] {
  const problems: string[] = []
  for (const s of subjects) {
    for (let i = 1; i < s.nodes.length; i++) {
      if (s.nodes[i].key < s.nodes[i - 1].key) problems.push(`${s.id}: ${s.nodes[i].id} comes before ${s.nodes[i - 1].id}`)
    }
    for (const n of s.nodes) if (!n.sources.length) problems.push(`${s.id}: ${n.id} has no citation`)
  }
  return problems
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const graph = JSON.parse(readFileSync(join(process.cwd(), '.cache', 'graph.json'), 'utf8')) as { nodes: GNode[]; edges: GEdge[] }
  const { subjects, skipped } = buildSubjects(graph.nodes, graph.edges)
  const problems = checkSubjects(subjects)
  if (problems.length) {
    console.error(problems.join('\n'))
    throw new Error(`time-browser-explorer: ${problems.length} problem(s)`)
  }
  const dir = join(process.cwd(), '.cache', 'time-browser')
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'explorer.json'), JSON.stringify({ subjects }))
  const index = subjects.map((s) => ({ id: s.id, kind: s.kind, title: s.title, nodes: s.nodes.length, journey: s.journey,
    span: [s.nodes[0].date, s.nodes[s.nodes.length - 1].date] }))
  writeFileSync(join(dir, 'explorer-index.json'), JSON.stringify(index))
  for (const k of skipped) console.log(`time-browser-explorer: skipped ${k.id} (${k.reason})`)
  console.log(`time-browser-explorer: ${subjects.length} subjects, ${subjects.reduce((n, s) => n + s.nodes.length, 0)} nodes`)
}
