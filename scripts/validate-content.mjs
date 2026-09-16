import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const contentDirectory = resolve(root, 'src/content/notes')
const requiredFields = ['slug', 'title', 'deck', 'date', 'category', 'readTime', 'tags', 'featured']
const allowedCategories = new Set(['Guide', 'Field note', 'Story'])
const forbiddenPatterns = [
  /<script\b/i,
  /\bon(?:error|load|click)\s*=/i,
  /javascript\s*:/i,
  /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /(?:file:\/\/|\/(?:home|Users)\/[A-Za-z0-9_.-]+\/)/i,
  /\]\((?:\.\.\/)*(?:\.tmp|\.memories)\//i,
]

const files = (await readdir(contentDirectory)).filter((file) => file.endsWith('.md')).sort()
const slugs = new Set()
const errors = []

for (const file of files) {
  const source = await readFile(resolve(contentDirectory, file), 'utf8')
  const match = source.match(/^---\n([\s\S]*?)\n---\n/)

  if (!match) {
    errors.push(`${file}: missing frontmatter delimiters`)
    continue
  }

  const metadata = {}
  for (const line of match[1].split('\n').filter((item) => item.includes(':'))) {
    const separator = line.indexOf(':')
    const key = line.slice(0, separator).trim()
    const value = line.slice(separator + 1).trim()
    if (key in metadata) errors.push(`${file}: duplicate frontmatter field '${key}'`)
    metadata[key] = value
  }

  for (const field of requiredFields) {
    if (!metadata[field]) errors.push(`${file}: missing frontmatter field '${field}'`)
  }

  if (metadata.slug && slugs.has(metadata.slug)) {
    errors.push(`${file}: duplicate slug '${metadata.slug}'`)
  }
  if (metadata.slug) slugs.add(metadata.slug)

  if (metadata.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.slug)) {
    errors.push(`${file}: slug must contain lowercase letters, numbers, and single hyphens only`)
  }

  if (metadata.category && !allowedCategories.has(metadata.category)) {
    errors.push(`${file}: unsupported category '${metadata.category}'`)
  }

  if (metadata.date) {
    const validShape = /^\d{4}-\d{2}-\d{2}$/.test(metadata.date)
    const parsed = validShape ? new Date(`${metadata.date}T00:00:00Z`) : null
    const isCalendarDate = parsed && !Number.isNaN(parsed.valueOf())
      && parsed.toISOString().slice(0, 10) === metadata.date
    if (!isCalendarDate) errors.push(`${file}: date must be a valid YYYY-MM-DD calendar date`)
  }

  if (metadata.readTime && !/^[1-9]\d* min read$/.test(metadata.readTime)) {
    errors.push(`${file}: readTime must use the format '<positive number> min read'`)
  }

  if (metadata.featured && !/^(true|false)$/.test(metadata.featured)) {
    errors.push(`${file}: featured must be true or false`)
  }

  if (metadata.tags && !/^\[\s*[^,\]]+(?:\s*,\s*[^,\]]+)*\s*\]$/.test(metadata.tags)) {
    errors.push(`${file}: tags must be a non-empty single-line list such as [Sample, Note]`)
  }

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(source)) errors.push(`${file}: contains a forbidden public-content pattern ${pattern}`)
  }
}

if (files.length === 0) errors.push('src/content/notes: no Markdown notes found')

if (errors.length > 0) {
  console.error('Placeholder-content validation failed:')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`Placeholder-content validation passed for ${files.length} Markdown note(s).`)
