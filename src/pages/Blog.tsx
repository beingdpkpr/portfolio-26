import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Reveal } from '../components/ui/Reveal'
import { PostModal } from '../components/PostModal'
import { getAllPosts } from '../lib/markdown'

export function Blog() {
  const { slug } = useParams<{ slug?: string }>()
  const navigate = useNavigate()
  const posts = useMemo(() => getAllPosts(), [])
  const [activeTag, setActiveTag] = useState('All')
  const [scrolled, setScrolled] = useState(false)

  useState(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  })

  const tags = ['All', ...Array.from(new Set(posts.map(p => p.tag)))]
  const filtered = activeTag === 'All' ? posts : posts.filter(p => p.tag === activeTag)
  const openPost = slug ? posts.find(p => p.slug === slug) : null

  return (
    <div style={{ background: '#08080a', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(8,8,10,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
        transition: 'all 0.3s', padding: '0 clamp(16px,4vw,64px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64,
      }}>
        <a href="/" style={{ color: '#fff', textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: '0.05em' }}>
          DKP<span style={{ color: '#888' }}>.</span>
        </a>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <a href="/" style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#555', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
            ← Portfolio
          </a>
          <a href="/assets/deepak_prasad_26.pdf" download="Deepak_Kumar_Prasad_Resume.pdf"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#000', background: '#fff', padding: '6px 16px', textDecoration: 'none', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            RÉSUMÉ ↓
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding: '160px clamp(16px,8vw,140px) 80px' }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: '#555', textTransform: 'uppercase', marginBottom: 16, animation: 'fadeUp 0.8s ease both' }}>
          Writing
        </div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(40px,7vw,96px)', color: '#fff', lineHeight: 0.95, letterSpacing: '-0.02em', margin: '0 0 24px', animation: 'fadeUp 0.8s ease 0.1s both' }}>
          Blog &<br />
          <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>Articles</span>
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, color: '#555', maxWidth: 480, lineHeight: 1.7, animation: 'fadeUp 0.8s ease 0.2s both' }}>
          Thoughts on software architecture, supply chain engineering, performance optimization, and building systems that scale.
        </p>
      </div>

      {/* Tag filter */}
      <div style={{ padding: '0 clamp(16px,8vw,140px) 64px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {tags.map(t => (
          <button key={t} onClick={() => setActiveTag(t)} style={{
            background: activeTag === t ? '#fff' : 'transparent',
            color: activeTag === t ? '#000' : '#555',
            border: '1px solid', borderColor: activeTag === t ? '#fff' : 'rgba(255,255,255,0.12)',
            fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.12em',
            textTransform: 'uppercase', padding: '8px 20px', cursor: 'pointer', transition: 'all 0.2s',
          }}>{t}</button>
        ))}
      </div>

      {/* Posts grid */}
      <div style={{ padding: '0 clamp(16px,8vw,140px) 120px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 1 }} className="blog-grid">
          {filtered.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.07}>
              <div
                onClick={() => navigate(`/blog/${post.slug}`)}
                style={{
                  padding: '40px', border: '1px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer', transition: 'background 0.2s', position: 'relative',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#555', border: '1px solid rgba(255,255,255,0.1)', padding: '3px 10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{post.tag}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#444' }}>{post.date}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#333' }}>{post.readTime}</span>
                </div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: '#fff', margin: '0 0 16px', lineHeight: 1.3 }}>
                  {post.title}
                </h2>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#555', lineHeight: 1.7, margin: '0 0 32px' }}>
                  {post.excerpt}
                </p>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#444', letterSpacing: '0.08em' }}>
                  READ MORE →
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: '#444', padding: '80px 0', textAlign: 'center' }}>
            No articles in this category yet.
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '48px clamp(16px,8vw,140px)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#333' }}>© 2026 DEEPAK KUMAR PRASAD</div>
        <a href="/" style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#444', textDecoration: 'none', letterSpacing: '0.08em', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = '#444')}>
          ← BACK TO PORTFOLIO
        </a>
      </div>

      {openPost && (
        <PostModal
          post={openPost}
          allPosts={posts}
          onClose={() => navigate('/blog', { replace: true })}
        />
      )}

      {slug && !openPost && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: '#0f0f11', border: '1px solid rgba(255,255,255,0.1)', padding: '48px', maxWidth: 480, textAlign: 'center' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#555', marginBottom: 16 }}>POST NOT FOUND</div>
            <button onClick={() => navigate('/blog')} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', padding: '10px 24px', fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.1em' }}>
              ← BACK TO BLOG
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
