import { useNavigate } from 'react-router-dom'
import { Reveal } from './ui/Reveal'
import { getAllPosts } from '../lib/markdown'

export function BlogLink() {
  const navigate = useNavigate()
  const count = getAllPosts().length

  return (
    <section id="blog" style={{ padding: '120px clamp(16px,8vw,140px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <Reveal>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: '#555', textTransform: 'uppercase', marginBottom: 16 }}>
          07 / Blog
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', color: '#fff', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
          Writing
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#555', marginBottom: 48, lineHeight: 1.6 }}>
          {count} post{count !== 1 ? 's' : ''} on architecture, performance engineering, and Python.
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <button
          onClick={() => navigate('/blog')}
          style={{
            background: 'none', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
            fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#888',
            letterSpacing: '0.15em', textTransform: 'uppercase', padding: '14px 32px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#888' }}
        >
          Open Blog →
        </button>
      </Reveal>
    </section>
  )
}
