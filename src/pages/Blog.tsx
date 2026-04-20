import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAllPosts } from '../lib/markdown'
import { PostModal } from '../components/PostModal'
import { Reveal } from '../components/ui/Reveal'
import { Nav } from '../components/Nav'

export function Blog() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const posts = getAllPosts()
  const [activeTag, setActiveTag] = useState('All')

  const tags = ['All', ...Array.from(new Set(posts.map(p => p.tag)))]
  const filtered = activeTag === 'All' ? posts : posts.filter(p => p.tag === activeTag)
  const activePost = slug ? posts.find(p => p.slug === slug) ?? null : null

  return (
    <div style={{ background: '#08080a', minHeight: '100vh', color: '#fff' }}>
      <Nav />
      <div style={{ padding: '120px clamp(16px,8vw,140px) 80px' }}>
        <Reveal>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#555', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 48, padding: 0, transition: 'color 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#555' }}
          >Back to Home</button>
        </Reveal>

        <Reveal>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', color: '#fff', margin: '0 0 48px', letterSpacing: '-0.02em' }}>
            Writing
          </h1>
        </Reveal>

        <Reveal delay={0.05}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 64 }}>
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                style={{
                  background: activeTag === tag ? '#fff' : 'none',
                  border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
                  padding: '6px 16px', fontFamily: "'Space Mono', monospace",
                  fontSize: 10, color: activeTag === tag ? '#000' : '#555',
                  letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.2s',
                }}
              >{tag}</button>
            ))}
          </div>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {filtered.length === 0 ? (
            <p style={{ fontFamily: "'Inter', sans-serif", color: '#444', fontSize: 14 }}>No posts yet.</p>
          ) : filtered.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.05}>
              <div
                onClick={() => navigate('/blog/' + post.slug)}
                style={{ padding: '32px 40px', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#555', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{post.tag}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#444' }}>{post.date}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#333' }}>{post.readTime}</span>
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 8, lineHeight: 1.3 }}>{post.title}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#555', lineHeight: 1.6 }}>{post.excerpt}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {activePost && (
        <PostModal post={activePost} posts={posts} onClose={() => navigate('/blog')} />
      )}
    </div>
  )
}
