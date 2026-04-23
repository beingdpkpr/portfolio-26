import { Reveal } from './ui/Reveal'
import data from '../data/portfolio-data'

export function Testimonials() {
  return (
    <section id="testimonials" style={{
      padding: '120px clamp(16px,8vw,140px)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      <Reveal>
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 11,
          letterSpacing: '0.2em', color: '#555', textTransform: 'uppercase', marginBottom: 16,
        }}>
          07 / Testimonials
        </div>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
          fontSize: 'clamp(28px,3.5vw,48px)', color: '#fff',
          margin: '0 0 64px', letterSpacing: '-0.02em',
        }}>
          What colleagues say
        </h2>
      </Reveal>

      <div className="testimonials-grid" style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1,
      }}>
        {data.testimonials.map((t, i) => (
          <Reveal key={i} delay={i * 0.07}>
            <div style={{
              border: '1px solid rgba(255,255,255,0.06)',
              padding: 32, display: 'flex', flexDirection: 'column', height: '100%',
            }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: 64,
                color: 'rgba(255,255,255,0.08)', lineHeight: 1, marginBottom: 16,
              }}>
                "
              </div>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 14,
                color: '#888', lineHeight: 1.8, marginBottom: 24, flex: 1,
              }}>
                {t.text}
              </p>
              <div>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                  fontSize: 15, color: '#fff',
                }}>
                  {t.name}
                </div>
                <div style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 13,
                  color: '#555', marginTop: 4,
                }}>
                  {t.title} · {t.company}
                </div>
                <div style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 10,
                  color: '#333', marginTop: 4,
                }}>
                  {t.relationship} · {t.date}
                </div>
                {t.linkedinUrl && (
                  <a
                    href={t.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View on LinkedIn"
                    style={{
                      display: 'inline-block', marginTop: 16,
                      fontFamily: "'Space Mono', monospace", fontSize: 10,
                      letterSpacing: '0.1em', color: '#555', textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#555')}
                  >
                    View on LinkedIn →
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
