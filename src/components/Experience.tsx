import { useState } from 'react'
import { Reveal } from './ui/Reveal'
import data from '../data/portfolio-data'

export function Experience() {
  const [active, setActive] = useState(0)
  const d = data.experience

  return (
    <section id="experience" style={{ padding: '120px clamp(16px,8vw,140px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <Reveal>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: '#555', textTransform: 'uppercase', marginBottom: 16 }}>
          02 / Experience
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', color: '#fff', margin: '0 0 64px', letterSpacing: '-0.02em' }}>
          Career Timeline
        </h2>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 0 }} className="exp-grid">
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.08)' }}>
          {d.map((job, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <button onClick={() => setActive(i)} style={{
                width: '100%', background: 'none', border: 'none',
                borderLeft: active === i ? '2px solid #fff' : '2px solid transparent',
                cursor: 'pointer', padding: '20px 32px 20px 28px', textAlign: 'left',
                transition: 'all 0.2s', display: 'block',
              }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.15em', color: '#444', textTransform: 'uppercase', marginBottom: 4 }}>
                  {job.period}
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, color: active === i ? '#fff' : '#666', marginBottom: 3, lineHeight: 1.3 }}>
                  {job.title}
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: active === i ? '#888' : '#444' }}>
                  {job.company}
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <div style={{ padding: '8px 0 8px 56px' }} className="exp-detail">
          <Reveal key={active} delay={0}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#555', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
              {d[active].period} · {d[active].duration} · {d[active].location}
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 28, color: '#fff', margin: '0 0 8px' }}>
              {d[active].title}
            </h3>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, color: '#555', marginBottom: 32 }}>
              @ {d[active].company}
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {d[active].bullets.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <span style={{ color: '#fff', marginTop: 3, flexShrink: 0 }}>→</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#888', lineHeight: 1.7 }}>{b}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
