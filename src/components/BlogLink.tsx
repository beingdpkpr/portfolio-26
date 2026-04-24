import { useNavigate } from 'react-router-dom'
import { Reveal } from './ui/Reveal'
import { getAllPosts } from '../lib/markdown'

export function BlogLink() {
  const navigate = useNavigate()
  const count = getAllPosts().length

  return (
    <section id="blog" style={{ padding: '120px clamp(16px,8vw,140px)', borderTop: '1px solid var(--line)' }}>
      <Reveal>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: 'var(--text-lo)', textTransform: 'uppercase', marginBottom: 16 }}>
          07 / Blog
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', color: 'var(--fg)', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
          Writing
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: 'var(--text-lo)', marginBottom: 48, lineHeight: 1.6 }}>
          {count} post{count !== 1 ? 's' : ''} on architecture, performance engineering, and Python.
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <button
          onClick={() => navigate('/blog')}
          style={{
            background: 'none', border: '1px solid var(--line-hi)', cursor: 'pointer',
            fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'var(--text-hi)',
            letterSpacing: '0.15em', textTransform: 'uppercase', padding: '14px 32px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--fg)'; e.currentTarget.style.color = 'var(--fg)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-hi)'; e.currentTarget.style.color = 'var(--text-hi)' }}
        >
          Open Blog →
        </button>
      </Reveal>
    </section>
  )
}
