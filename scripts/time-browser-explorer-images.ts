// Timeline Explorer image jobs: one adult backdrop and one kids backdrop per node, generated before deployment on
// the founder's Mac (scripts/time-browser-explorer-gen.py, local SDXL). Nothing is generated at runtime.
//
// Files follow a naming convention, so several sessions (Claude, Devin) can add images for different subjects at
// the same time without a shared manifest:
//   site/public/media/time-browser/explorer/<node-slug>.webp        adult backdrop and detail image
//   site/public/media/time-browser/explorer/<node-slug>-kids.webp   kids backdrop
// <node-slug> is the node id with "/" and "#" turned into "-" (event/battle-of-hattin-583 → event-battle-of-hattin-583).
//
// Content rules (AGENTS.md, illustrations lane): no people, no faces, no text, in both styles, so no image can depict
// a prophet or a Companion and none is a portrait. Places, buildings, landscapes, objects and animals only.
//
// Usage: npx tsx scripts/time-browser-explorer-images.ts [--subject person/salah-al-din-yusuf-ibn-ayyub ...]
// Writes .cache/time-browser/explorer-image-jobs.json (jobs whose files do not exist yet).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

export const IMAGE_DIR = 'site/public/media/time-browser/explorer'
export const nodeSlug = (id: string) => id.replace(/[/#]/g, '-')

interface Node { id: string; role: string; title: Record<string, string>; place: { label: Record<string, string> } | null; key: number }
interface Subject { id: string; kind: string; title: Record<string, string>; nodes: Node[] }

const ADULT = 'Painted museum illustration, cinematic soft light, muted historical palette, wide landscape view'
const KIDS = 'Bright friendly picture-book illustration for children, simple shapes, warm cheerful colours, wide view'
const RULES = 'No people, no faces, no human figures, no text, no letters, no modern objects.'

const era = (y: number) => (y < 0 ? `${Math.ceil(-y)} BCE` : `${Math.floor(y)} CE`)
const clean = (t: string) => t.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim()

// The scene describes a place and a time, never a person: a birth or a death node shows the town, not the person.
export function scene(n: Node, subject: Subject): string {
  const place = n.place?.label?.en ? clean(n.place.label.en) : ''
  const when = era(n.key)
  if (n.role === 'birth') return `the town of ${place || 'the birthplace'} around ${when}`
  if (n.role === 'death') return `${place || 'a historic city'} around ${when}, quiet and calm`
  const title = clean(n.title.en ?? subject.title.en ?? '')
  return `a historical setting evocative of "${title}"${place ? `, in ${place}` : ''}, around ${when}, architecture and landscape only`
}

export function jobsFor(subjects: Subject[], root = process.cwd()) {
  const jobs: { slug: string; subject: string; node: string; prompt: string; kidsPrompt: string }[] = []
  for (const s of subjects) {
    for (const n of s.nodes) {
      const slug = nodeSlug(n.id)
      const adult = existsSync(join(root, IMAGE_DIR, `${slug}.webp`))
      const kids = existsSync(join(root, IMAGE_DIR, `${slug}-kids.webp`))
      if (adult && kids) continue
      const sc = scene(n, s)
      jobs.push({ slug, subject: s.id, node: n.id, prompt: `${ADULT}: ${sc}. ${RULES}`, kidsPrompt: `${KIDS}: ${sc}. ${RULES}` })
    }
  }
  return jobs
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const all = (JSON.parse(readFileSync(join(process.cwd(), '.cache', 'time-browser', 'explorer.json'), 'utf8')) as { subjects: Subject[] }).subjects
  const want = process.argv.flatMap((a, i) => (process.argv[i - 1] === '--subject' ? [a] : []))
  const subjects = want.length ? all.filter((s) => want.includes(s.id)) : all
  const jobs = jobsFor(subjects)
  mkdirSync(join(process.cwd(), IMAGE_DIR), { recursive: true })
  writeFileSync(join(process.cwd(), '.cache', 'time-browser', 'explorer-image-jobs.json'), JSON.stringify(jobs, null, 1))
  console.log(`explorer-images: ${jobs.length} node(s) need images across ${subjects.length} subject(s)`)
}
