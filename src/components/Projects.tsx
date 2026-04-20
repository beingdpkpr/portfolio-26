import { useState } from 'react'
import { Reveal } from './ui/Reveal'
import data from '../data/portfolio-data'

export function Projects() {
  const [hovered, setHovered] = useState<number | null>(null)
  const d = data.projects

  return (
    <section id="projects" style={{ padding: '120px clamp(16px,8vw,140px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <Reveal>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: '#555', textTransform: 'uppercase', marginBottom: 16 }}>
          03 / Projects
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', color: '#fff', margin: '0 0 64px', letterSpacing: '-0.02em' }}>
          Selected Work
        </h2>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 1 }}>
        {d.map((p, i) => (
          <Reveal key={i} delay={i * 0.07}>
            <div
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: '40px', border: '1px solid rgba(255,255,255,0.06)',
                background: hovered === i ? 'rgba(255,255,255,0.04)' : 'transparent',
                transition: 'all 0.25s ease', cursor: 'default',
                position: 'relative', overflow: 'hidden',
              }}>
              <div style={{ position: 'absolute', top: 24, right: 24, fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.12)', letterSpacing: '0.1em' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{
                display: 'inline-block', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#888',
                letterSpacing: '0.1em', padding: '4px 10px', marginBottom: 20, textTransform: 'uppercase',
              }}>
                {p.highlight}
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: '#fff', margin: '0 0 12px', lineHeight: 1.3 }}>
                {p.title}
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#666', lineHeight: 1.7, margin: '0 0 24px' }}>
                {p.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {p.tags.map(t => (
                  <span key={t} style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#555', border: '1px solid rgba(255,255,255,0.08)', padding: '3px 10px', letterSpacing: '0.08em' }}>{t}</span>
                ))}
              </div>
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
                background: '#fff',
                transform: hovered === i ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'left', transition: 'transform 0.3s ease',
              }} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
