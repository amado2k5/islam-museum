// TB2: attach Devin's prepared media (image, card, map) to Time Browser records.
// Reads the outputs of scripts/time-browser-media*.ts. Creates no images here.
// A record that names a media id which does not exist fails the build.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Served location of the media files; a later host move is a config change here.
export const TIME_BROWSER_MEDIA_BASE = '/time-browser-media'

export interface MediaRef {
  id: string
  src: string
  alt?: string
  credit?: string
  licence?: string
}

export interface WiredMedia {
  image?: MediaRef
  card?: { id: string; src: string }
  map?: { id: string; src: string }
}

interface MediaIndex {
  media: { id: string; file?: string; license?: string; alt?: Record<string, string> }[]
  stops: { id: string; coverage: 'image' | 'card'; candidates: string[] }[]
}
interface CardsFile {
  cards: Record<string, { id: string; file: string; stops: string[] }>
}
interface MapsFile {
  clusters: { id: string; file: string }[]
  stops: Record<string, string>
}

const read = <T>(root: string, rel: string): T =>
  JSON.parse(readFileSync(join(root, rel), 'utf8')) as T

const src = (file: string) => `${TIME_BROWSER_MEDIA_BASE}/${file.replace(/^media\//, '')}`

export function loadMedia(root: string) {
  const index = read<MediaIndex>(root, 'data/time-browser-media-index.json')
  const cards = read<CardsFile>(root, 'data/time-browser-cards.json')
  const maps = read<MapsFile>(root, 'data/time-browser-maps.json')
  const mediaById = new Map(index.media.map((m) => [m.id, m]))
  const stopIndex = new Map(index.stops.map((s) => [s.id, s]))
  const cardByStop = new Map<string, { id: string; file: string }>()
  for (const c of Object.values(cards.cards)) {
    for (const stop of c.stops) cardByStop.set(stop, { id: c.id, file: c.file })
  }
  const clusterById = new Map(maps.clusters.map((c) => [c.id, c]))
  return { mediaById, stopIndex, cardByStop, clusterById, mapStops: maps.stops }
}

// Wire one record. Throws if it names a media id that is not in the files.
export function wireRecord(
  id: string,
  lang: string,
  m: ReturnType<typeof loadMedia>,
): WiredMedia {
  const out: WiredMedia = {}
  const stop = m.stopIndex.get(id)
  if (stop?.coverage === 'image' && stop.candidates.length > 0) {
    // Use the first candidate that exists with a file. An id missing from the
    // media list, or a media item without a file, fails the build.
    for (const mediaId of stop.candidates) {
      if (!m.mediaById.has(mediaId)) throw new Error(`time-browser-wire: ${id} names missing media id ${mediaId}`)
    }
    // A remote file (an https URL) is a third-party request from the page, so
    // only a local file counts (DESIGN §3: no third-party request from the page).
    const media = stop.candidates
      .map((cid) => m.mediaById.get(cid)!)
      .find((x) => x.file && !/^https?:/.test(x.file))
    if (!media) throw new Error(`time-browser-wire: ${id} has candidates but none has a local file: ${stop.candidates.join(", ")}`)
    out.image = {
      id: media.id,
      src: src(media.file),
      alt: media.alt?.[lang] ?? media.alt?.en ?? '',
      licence: media.license ?? '',
    }
  }
  const card = m.cardByStop.get(id)
  if (card) out.card = { id: card.id, src: src(card.file) }
  const cluster = m.mapStops[id]
  if (cluster) {
    const c = m.clusterById.get(cluster)
    if (!c) throw new Error(`time-browser-wire: ${id} names missing map ${cluster}`)
    out.map = { id: cluster, src: src(c.file) }
  }
  return out
}
