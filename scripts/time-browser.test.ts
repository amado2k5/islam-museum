import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildRecords, spreadAcrossTime, TOPICS, LAUNCH_PER_TOPIC, type GraphNode } from './time-browser.ts'

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

    it(`${topic}: sorted by timelineKey`, () => {
      for (let i = 1; i < recs.length; i++) {
        expect(recs[i].timelineKey).toBeGreaterThanOrEqual(recs[i - 1].timelineKey)
      }
    })

    it(`${topic}: every record has sources`, () => {
      for (const r of recs) expect(r.sources.length).toBeGreaterThan(0)
    })

    it(`${topic}: kids exclude contested records`, () => {
      const contested = new Set(
        graph.nodes.filter((n) => n.data?.perspectives).map((n) => n.id),
      )
      for (const r of recs) {
        for (const k of r.kids) expect(contested.has(k)).toBe(false)
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
