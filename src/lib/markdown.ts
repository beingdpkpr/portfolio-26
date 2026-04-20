import type { BlogFrontmatter, BlogPost } from '../types'

const modules = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }
  const data: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const val = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '')
    data[key] = val
  }
  return { data, content: match[2] }
}

export function getAllPosts(): BlogPost[] {
  return Object.entries(modules).map(([path, raw]) => {
    const slug = path.split('/').pop()!.replace('.md', '')
    const { data, content } = parseFrontmatter(raw)
    return { slug, content, ...(data as unknown as BlogFrontmatter) }
  })
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find(p => p.slug === slug)
}
