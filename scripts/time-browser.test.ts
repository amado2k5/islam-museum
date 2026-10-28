import { describe, it, expect } from 'vitest'
import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildRecords, spreadAcrossTime, TOPICS, LAUNCH_PER_TOPIC, type GraphNode } from './time-browser.ts'

// The CI test job runs `npm test` without the build, so compile the graph once here when it is missing
// (the same guard as scripts/edu.test.ts).
if (!existsSync(join(process.cwd(), '.cache', 'graph.json'))) {
  execSync('npm run graph', { stdio: 'inherit' })
}

const graph = JSON.parse(
  readFileSync(join(process.cwd(), '.cache', 'graph.json'), 'utf8'),
) as { nodes: GraphNode[] }

describe('time-browser batch spread', () => {
  it('spreadAcrossTime takes evenly spaced items across the whole range', () => {
    const items = Array.from({ length: 1000 }, (_, i) => i)
    const picked = spreadAcrossTime(items, 50)
    expect(picked.length).toBe(50)
    expect(picked[0]).toBe(0)
    expect(picked[49]).toBe(999)
    expect(new Set(picked).size).toBe(50)
  })
})

describe('time-browser records', () => {
  for (const topic of TOPICS) {
    const recs = buildRecords(graph.nodes, topic)

    it(`${topic}: at most ${LAUNCH_PER_TOPIC} records, shape complete`, () => {
      expect(recs.length).toBeLessThanOrEqual(LAUNCH_PER_TOPIC)
      for (const r of recs) {
        expect(r.kind).toBe(topic)
        expect(r.id.startsWith(`${topic}/`)).toBe(true)
        expect(typeof r.timelineKey).toBe('number')
        expect(r.title.ar.length).toBeGreaterThan(0)
        expect(r.title.en.length).toBeGreaterThan(0)
      }
    })

    it(`${topic}: no citation markers in summaries`, () => {
      for (const r of recs) for (const v of Object.values(r.summary)) expect(v).not.toMatch(/\{cite:/)
    })

    it(`${topic}: sorted by timelineKey`, () => {
      for (let i = 1; i < recs.length; i++) {
        expect(recs[i].timelineKey).toBeGreaterThanOrEqual(recs[i - 1].timelineKey)
      }
    })

    it(`${topic}: every record has sources`, () => {
      for (const r of recs) expect(r.sources.length).toBeGreaterThan(0)
    })

    it(`${topic}: related stops exclude contested records and self`, () => {
      const contested = new Set(
        graph.nodes.filter((n) => n.data?.perspectives).map((n) => n.id),
      )
      for (const r of recs) {
        expect(r.related).not.toContain(r.id)
        for (const k of r.related) expect(contested.has(k)).toBe(false)
      }
    })

    it(`${topic}: kids text is null or has non-empty strings`, () => {
      for (const r of recs) {
        if (r.kids === null) continue
        for (const v of Object.values(r.kids)) expect(v?.length ?? 0).toBeGreaterThan(0)
      }
    })

    it(`${topic}: ur differs from en when present`, () => {
      for (const r of recs) {
        if (r.title.ur) expect(r.title.ur).not.toBe(r.title.en)
        if (r.summary.ur) expect(r.summary.ur).not.toBe(r.summary.en)
      }
    })
  }
})
