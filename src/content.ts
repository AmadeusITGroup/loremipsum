import DOMPurify from 'dompurify'
import { marked } from 'marked'

export type NoteCategory = 'Guide' | 'Field note' | 'Story'

export interface Note {
  slug: string
  title: string
  deck: string
  date: string
  category: NoteCategory
  readTime: string
  tags: string[]
  featured: boolean
  body: string
}

const rawNoteFiles = import.meta.glob('./content/notes/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

type FrontmatterValue = string | string[] | boolean

function parseFrontmatterValue(value: string): FrontmatterValue {
  const trimmed = value.trim()

  if (trimmed === 'true' || trimmed === 'false') {
    return trimmed === 'true'
  }

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean)
  }

  return trimmed.replace(/^['"]|['"]$/g, '')
}

function parseFrontmatter(source: string): { metadata: Record<string, FrontmatterValue>; body: string } {
  const normalized = source.replace(/\r\n/g, '\n')
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)

  if (!match) {
    return { metadata: {}, body: normalized }
  }

  const metadata: Record<string, FrontmatterValue> = {}
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':')
    if (separator === -1) continue
    metadata[line.slice(0, separator).trim()] = parseFrontmatterValue(line.slice(separator + 1))
  }

  return { metadata, body: match[2].trim() }
}

function getString(metadata: Record<string, FrontmatterValue>, key: string, fallback: string): string {
  const value = metadata[key]
  return typeof value === 'string' ? value : fallback
}

function getStringArray(metadata: Record<string, FrontmatterValue>, key: string): string[] {
  const value = metadata[key]
  return Array.isArray(value) ? value : []
}

function getBoolean(metadata: Record<string, FrontmatterValue>, key: string): boolean {
  return metadata[key] === true
}

function fileSlug(path: string): string {
  return path.split('/').pop()?.replace(/\.md$/, '') ?? 'note'
}

export const notes: Note[] = Object.entries(rawNoteFiles)
  .map(([path, source]) => {
    const { metadata, body } = parseFrontmatter(source)

    return {
      slug: getString(metadata, 'slug', fileSlug(path)),
      title: getString(metadata, 'title', 'Untitled note'),
      deck: getString(metadata, 'deck', ''),
      date: getString(metadata, 'date', '2026-01-01'),
      category: getString(metadata, 'category', 'Field note') as NoteCategory,
      readTime: getString(metadata, 'readTime', '3 min read'),
      tags: getStringArray(metadata, 'tags'),
      featured: getBoolean(metadata, 'featured'),
      body,
    }
  })
  .sort((first, second) => second.date.localeCompare(first.date))

marked.setOptions({
  gfm: true,
  breaks: false,
})

export function renderMarkdown(markdown: string): string {
  const rendered = marked.parse(markdown, { async: false }) as string
  return DOMPurify.sanitize(rendered)
}

export const signals = [
  { number: '01', title: 'Notice', text: 'Lorem ipsum context for the next move.' },
  { number: '02', title: 'Shape', text: 'Dolor sit amet patterns made visible.' },
  { number: '03', title: 'Share', text: 'Consectetur notes that travel further.' },
]
