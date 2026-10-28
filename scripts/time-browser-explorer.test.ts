import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildSubjects, checkSubjects, MIN_NODES, type GNode, type GEdge } from './time-browser-explorer.ts'

const graph = JSON.parse(readFileSync(join(process.cwd(), '.cache', 'graph.json'), 'utf8')) as { nodes: GNode[]; edges: GEdge[] }
const { subjects } = buildSubjects(graph.nodes, graph.edges)
const byId = new Map(subjects.map((s) => [s.id, s]))

describe('timeline explorer subjects', () => {
  it('ships only subjects with enough dated, cited nodes, in time order', () => {
    expect(subjects.length).toBeGreaterThan(0)
    expect(checkSubjects(subjects)).toEqual([])
    for (const s of subjects) expect(s.nodes.length).toBeGreaterThanOrEqual(MIN_NODES)
  })

  it('Saladin: at least 8 nodes, birth first and death last, every node cited', () => {
    const s = byId.get('person/salah-al-din-yusuf-ibn-ayyub')!
    expect(s).toBeTruthy()
    expect(s.nodes.length).toBeGreaterThanOrEqual(8)
    expect(s.nodes[0].role).toBe('birth')
    expect(s.nodes[s.nodes.length - 1].role).toBe('death')
    for (const n of s.nodes) expect(n.sources.length).toBeGreaterThan(0)
  })

  it('the landing chips name subjects that exist', () => {
    for (const id of ['person/salah-al-din-yusuf-ibn-ayyub', 'place/al-andalus', 'place/baghdad', 'period/abbasid-early']) {
      expect(byId.has(id)).toBe(true)
    }
  })

  it('no citation markers or draft wording reach node text', () => {
    for (const s of subjects) for (const n of s.nodes) {
      for (const v of Object.values(n.summary)) {
        expect(v).not.toMatch(/\{cite:/)
        expect(v).not.toMatch(/مسودة/)
      }
    }
  })

  it('era subjects keep only in-range events', () => {
    const era = graph.nodes.find((n) => n.id === 'period/crusades-ayyubid-mamluk')!
    const s = byId.get(era.id)!
    for (const n of s.nodes) {
      expect(n.key).toBeGreaterThanOrEqual(era.span!.earliest - 1)
      expect(n.key).toBeLessThanOrEqual(era.span!.latest + 1)
    }
  })
})
