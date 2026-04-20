import { Reveal } from './ui/Reveal'

export function BlogLink() {
  return (
    <section id="blog" style={{ padding: '120px clamp(16px,8vw,140px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <Reveal>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: '#555', textTransform: 'uppercase', marginBottom: 16 }}>
          07 / Writing
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', color: '#fff', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
          Blog & Articles
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: '#555', maxWidth: 480, lineHeight: 1.7, marginBottom: 64 }}>
          Thoughts on software architecture, supply chain engineering, and building systems at scale.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <a href="/blog" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '48px 56px', border: '1px solid rgba(255,255,255,0.08)',
          textDecoration: 'none', transition: 'background 0.2s, border-color 0.2s', maxWidth: 700,
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#444', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Open Blog</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 8 }}>Read Articles & Writing</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#555' }}>Architecture · Engineering · Supply Chain · Python</div>
          </div>
          <div style={{ fontSize: 32, color: '#444', flexShrink: 0, marginLeft: 32 }}>→</div>
        </a>
      </Reveal>
    </section>
  )
}
