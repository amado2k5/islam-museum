import { describe, it, expect } from 'vitest'
import { wireRecord, type loadMedia } from './time-browser-wire.ts'

type Media = ReturnType<typeof loadMedia>

function fakeMedia(stops: Media['stopIndex'] extends Map<string, infer V> ? V[] : never): Media {
  return {
    mediaById: new Map(),
    stopIndex: new Map(stops.map((s) => [s.id, s])),
    cardByStop: new Map(),
    clusterById: new Map(),
    mapStops: {},
  } as unknown as Media
}

describe('time-browser media wiring', () => {
  it('fails the build when a record names a media id that is not in the index', () => {
    const m = fakeMedia([{ id: 'event/x', coverage: 'image', candidates: ['media/missing'] }])
    expect(() => wireRecord('event/x', 'en', m)).toThrow(/missing media id media\/missing/)
  })

  it('never uses a remote file as an image', () => {
    const m = fakeMedia([{ id: 'event/y', coverage: 'image', candidates: ['media/remote'] }])
    m.mediaById.set('media/remote', { id: 'media/remote', file: 'https://example.org/a.jpg' } as never)
    expect(() => wireRecord('event/y', 'en', m)).toThrow(/none has a local file/)
  })
})
