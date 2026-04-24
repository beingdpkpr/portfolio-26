import { Reveal } from './ui/Reveal'
import data from '../data/portfolio-data'

export function Testimonials() {
  return (
    <section id="testimonials" style={{
      padding: '120px clamp(16px,8vw,140px)',
      borderTop: '1px solid var(--line)',
    }}>
      <Reveal>
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 11,
          letterSpacing: '0.2em', color: 'var(--text-lo)', textTransform: 'uppercase', marginBottom: 16,
        }}>
          07 / Testimonials
        </div>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
          fontSize: 'clamp(28px,3.5vw,48px)', color: 'var(--fg)',
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
              border: '1px solid var(--line)',
              padding: 32, display: 'flex', flexDirection: 'column', height: '100%',
            }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: 64,
                color: 'var(--surf-hover)', lineHeight: 1, marginBottom: 16,
              }}>
                "
              </div>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 14,
                color: 'var(--text-hi)', lineHeight: 1.8, marginBottom: 24, flex: 1,
              }}>
                {t.text}
              </p>
              <div>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                  fontSize: 15, color: 'var(--fg)',
                }}>
                  {t.name}
                </div>
                <div style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 13,
                  color: 'var(--text-lo)', marginTop: 4,
                }}>
                  {t.title} · {t.company}
                </div>
                <div style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 10,
                  color: 'var(--text-ghost)', marginTop: 4,
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
                      letterSpacing: '0.1em', color: 'var(--text-lo)', textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-lo)')}
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
