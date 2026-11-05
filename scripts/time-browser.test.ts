import { describe, it, expect } from 'vitest'
import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildRecords, spreadAcrossTime, tourSubset, TOUR_IDS, TOPICS, LAUNCH_PER_TOPIC, type GraphNode } from './time-browser.ts'

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

describe('time-browser required tour stops', () => {
  const polityPool = (): GraphNode[] => Array.from({ length: 155 }, (_, i) => {
    const slug = i === 108 ? 'qutlughkhanid-kirman' : `test-${i}`
    return {
      id: `polity/${slug}`,
      class: 'polity',
      slug,
      label: { ar: 'اختبار', en: 'Test' },
      summary: { ar: 'ملخص', en: 'Summary' },
      span: { earliest: 1000 + i, latest: 1000 + i },
      data: { sources: ['source/test'] },
    }
  })

  it('retains a required stop omitted by ordinary sampling without exceeding the cap', () => {
    const pool = polityPool()
    const required = 'polity/qutlughkhanid-kirman'
    expect(spreadAcrossTime(pool, LAUNCH_PER_TOPIC).some(n => n.id === required)).toBe(false)
    const records = buildRecords(pool, 'polity')
    expect(records).toHaveLength(LAUNCH_PER_TOPIC)
    expect(records.some(r => r.id === required)).toBe(true)
    expect(new Set(records.map(r => r.id)).size).toBe(LAUNCH_PER_TOPIC)
    expect(records[0].id).toBe(pool[0].id)
    expect(records.at(-1)?.id).toBe(pool.at(-1)?.id)
    expect(records.map(r => r.timelineKey)).toEqual(records.map(r => r.timelineKey).sort((a, b) => a - b))
    expect(buildRecords([...pool].reverse(), 'polity')).toEqual(records)
  })

  it('retains every required stop in the current production graph', () => {
    const records = TOPICS.flatMap(topic => buildRecords(graph.nodes, topic))
    expect(tourSubset(records).map(r => r.id)).toEqual(TOUR_IDS)
  })

  it('retains multiple required stops in the same topic', () => {
    const required = TOUR_IDS.filter(id => id.startsWith('period/'))
    const pool = polityPool().map((n, i) => {
      const id = required[[21, 47, 83].indexOf(i)] ?? `period/test-${i}`
      return { ...n, id, class: 'period', slug: id.slice('period/'.length) }
    })
    const records = buildRecords(pool, 'period')
    expect(records).toHaveLength(LAUNCH_PER_TOPIC)
    for (const id of required) expect(records.some(r => r.id === id)).toBe(true)
    expect(new Set(records.map(r => r.id)).size).toBe(LAUNCH_PER_TOPIC)
    expect(records.map(r => r.timelineKey)).toEqual(records.map(r => r.timelineKey).sort((a, b) => a - b))
  })

  it('keeps the ordinary sample unchanged when it already contains the required stop', () => {
    const pool = polityPool()
    pool[108].id = 'polity/test-108'
    pool[0].id = 'polity/qutlughkhanid-kirman'
    expect(buildRecords(pool, 'polity').map(r => r.id)).toEqual(
      spreadAcrossTime(pool, LAUNCH_PER_TOPIC).map(n => n.id),
    )
  })

  it('leaves small pools and topics without required stops unchanged', () => {
    const pool = polityPool()
    const small = pool.slice(100, 110)
    expect(buildRecords(small, 'polity').map(r => r.id)).toEqual(small.map(n => n.id))
    const optional = pool.filter(n => !TOUR_IDS.includes(n.id))
    expect(buildRecords(optional, 'polity').map(r => r.id)).toEqual(
      spreadAcrossTime(optional, LAUNCH_PER_TOPIC).map(n => n.id),
    )
  })

  it('does not make an uncited tour stop eligible or hide missing tour stops', () => {
    const pool = polityPool()
    pool[108].data = { sources: [] }
    const records = buildRecords(pool, 'polity')
    expect(records.some(r => r.id === 'polity/qutlughkhanid-kirman')).toBe(false)
    const otherStops = TOPICS.flatMap(topic => buildRecords(graph.nodes, topic))
      .filter(r => r.kind !== 'polity')
    expect(() => tourSubset([...otherStops, ...records])).toThrow(
      'time-browser: tour stop polity/qutlughkhanid-kirman is not a prepared stop',
    )
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

describe('time-browser date and period metadata', () => {
  const period: GraphNode = {
    id: 'period/known',
    class: 'period',
    slug: 'known',
    label: { ar: 'فترة', en: 'Period' },
    summary: { ar: '', en: '' },
    span: { earliest: 900, latest: 910 },
    data: { sources: ['source/period'] },
  }
  const shared = {
    label: { ar: 'حدث', en: 'Event' },
    summary: { ar: 'ملخص', en: 'Summary' },
    data: { sources: ['source/event'], status: { review: 'published' } },
  }

  it('preserves date ordering and existing fields while exporting explicit ranges and periods', () => {
    const records = buildRecords([
      {
        ...shared,
        id: 'event/undated-derived',
        class: 'event',
        slug: 'undated-derived',
        periods: [period.id],
      },
      {
        ...shared,
        id: 'event/ranged',
        class: 'event',
        slug: 'ranged',
        span: { earliest: 866, latest: 868 },
        periods: [period.id],
        display: { start: { edtf: '0866' }, end: { edtf: '0868' } },
      },
      {
        ...shared,
        id: 'event/early',
        class: 'event',
        slug: 'early',
        span: { earliest: 850, latest: 850 },
        display: { start: { edtf: '0850' } },
      },
      period,
    ], 'event')

    expect(records.map((record) => record.id)).toEqual([
      'event/early',
      'event/ranged',
      'event/undated-derived',
    ])

    const early = records[0]
    expect(early.date).toBe('0850')
    expect(early.dateRange).toEqual({ start: '0850', end: null })
    expect(early.periods).toEqual([])

    const ranged = records[1]
    expect(ranged.date).toBe('0866')
    expect(ranged.dateRange).toEqual({ start: '0866', end: '0868' })
    expect(ranged.periods).toEqual([period.id])
    expect(ranged.sources).toEqual(['source/event'])
    expect(ranged.draft).toBe(false)
    expect(Object.keys(ranged).sort()).toEqual([
      'date', 'dateRange', 'derived', 'draft', 'href', 'id', 'kids', 'kind',
      'periods', 'related', 'sources', 'summary', 'timelineKey', 'title',
    ])

    const undated = records[2]
    expect(undated.date).toBe('')
    expect(undated.dateRange).toEqual({ start: null, end: null })
    expect(undated.periods).toEqual([period.id])
    expect(undated.timelineKey).toBe(900)
    expect(undated.derived).toBe(true)
  })
})
