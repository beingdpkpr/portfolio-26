import matter from 'gray-matter'
import type { BlogPost } from '../types'

const modules = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true })

export function getAllPosts(): BlogPost[] {
  return Object.entries(modules)
    .map(([path, raw]) => {
      const slug = path.replace('../content/blog/', '').replace('.md', '')
      const { data, content } = matter(raw as string)
      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        tag: data.tag as string,
        excerpt: data.excerpt as string,
        readTime: data.readTime as string,
        content,
      }
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1))
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find(p => p.slug === slug)
}
