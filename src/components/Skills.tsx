import { Reveal } from './ui/Reveal'
import { SkillBar } from './ui/SkillBar'
import data from '../data/portfolio-data'

export function Skills() {
  const d = data.skills
  return (
    <section id="skills" style={{ padding: '120px clamp(16px,8vw,140px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <Reveal>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: '#555', textTransform: 'uppercase', marginBottom: 16 }}>
          04 / Skills
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', color: '#fff', margin: '0 0 64px', letterSpacing: '-0.02em' }}>
          Technical Stack
        </h2>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 40 }}>
        {d.map((group, gi) => (
          <Reveal key={gi} delay={gi * 0.06}>
            <div>
              <div style={{
                fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#444',
                letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20,
                paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                {group.category}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {group.items.map((item, ii) => (
                  <SkillBar key={ii} label={item} delay={gi * 0.06 + ii * 0.04} />
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
