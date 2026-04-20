import { useState } from 'react'
import { Reveal } from './ui/Reveal'
import data from '../data/portfolio-data'

export function Certifications() {
  const [expanded, setExpanded] = useState<number | null>(null)
  const d = data.certifications

  return (
    <section id="certifications" style={{ padding: '120px clamp(16px,8vw,140px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <Reveal>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: '#555', textTransform: 'uppercase', marginBottom: 16 }}>
          06 / Certifications
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', color: '#fff', margin: '0 0 64px', letterSpacing: '-0.02em' }}>
          Credentials
        </h2>
      </Reveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {d.map((cert, i) => (
          <Reveal key={i} delay={i * 0.07}>
            <div style={{ border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div
                style={{ padding: '32px 40px', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 24, cursor: cert.courses ? 'pointer' : 'default', transition: 'background 0.2s' }} className="cert-row"
                onClick={() => cert.courses && setExpanded(expanded === i ? null : i)}
                onMouseEnter={e => { if (cert.courses) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                    {cert.type === 'specialization' && (
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#888', border: '1px solid rgba(255,255,255,0.15)', padding: '2px 8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Specialization</span>
                    )}
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#444', letterSpacing: '0.1em' }}>{cert.year}</span>
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 6, lineHeight: 1.3 }}>{cert.name}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#555' }}>{cert.issuer}</div>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexShrink: 0 }}>
                  <a href={cert.verify} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#555', letterSpacing: '0.1em', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 14px', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}>
                    VERIFY →
                  </a>
                  {cert.courses && (
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: '#444', transform: expanded === i ? 'rotate(90deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>▶</span>
                  )}
                </div>
              </div>

              {cert.courses && expanded === i && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '8px 40px 24px', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#444', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16, marginTop: 16 }}>Included Courses</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {cert.courses.map((c, ci) => (
                      <div key={ci} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#777' }}>↳ {c.name}</span>
                        <a href={c.verify} target="_blank" rel="noopener noreferrer"
                          style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#444', letterSpacing: '0.1em', textDecoration: 'none', flexShrink: 0, transition: 'color 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#444')}>
                          verify ↗
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
