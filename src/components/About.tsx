import { Reveal } from './ui/Reveal'
import data from '../data/portfolio-data'

export function About() {
  const d = data
  return (
    <section id="about" style={{ padding: '120px clamp(16px,8vw,140px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <Reveal>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: '#555', textTransform: 'uppercase', marginBottom: 48 }}>
          01 / About
        </div>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }} className="about-grid">
        <div>
          <Reveal delay={0.1}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(32px,4vw,56px)', color: '#fff', lineHeight: 1.1, margin: '0 0 32px', letterSpacing: '-0.02em' }}>
              Building systems<br />that matter.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: '#888', lineHeight: 1.8, marginBottom: 24 }}>
              {d.about}
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ display: 'flex', gap: 16, marginTop: 32, flexWrap: 'wrap' }}>
              {([['✉', d.email, `mailto:${d.email}`], ['↗', d.linkedinLabel, d.linkedin], ['⌥', d.githubLabel, d.github]] as const).map(([icon, label, href]) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#555',
                  border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px',
                  letterSpacing: '0.05em', textDecoration: 'none', transition: 'color 0.2s, border-color 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}>
                  {icon} {label}
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} direction="left">
          <div style={{ aspectRatio: '3/4', maxWidth: 340, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
            <img src={`${import.meta.env.BASE_URL}assets/headshot.jpg`} alt="Deepak Kumar Prasad"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', filter: 'grayscale(20%)' }} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
