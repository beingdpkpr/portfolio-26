import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useActiveSection } from '../hooks/useActiveSection'

const SECTIONS = ['about', 'experience', 'projects', 'skills', 'education', 'certifications', 'blog', 'contact']

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' })
}

export function Nav() {
  const active = useActiveSection(['hero', ...SECTIONS])
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleNav = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      scrollTo(id)
    } else {
      navigate('/#' + id)
    }
  }

  useState(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  })

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(8,8,10,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 clamp(16px,4vw,64px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 64,
    }}>
      <button onClick={() => handleNav('hero')} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#fff', fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700, fontSize: 16, letterSpacing: '0.05em',
      }}>
        DKP<span style={{ color: '#888' }}>.</span>
      </button>

      <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="nav-links">
        {SECTIONS.map(s => (
          <button key={s} onClick={() => handleNav(s)} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
            fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: active === s ? '#fff' : '#666',
            borderBottom: active === s ? '1px solid #fff' : '1px solid transparent',
            transition: 'all 0.2s',
          }}>{s}</button>
        ))}
        <a href={`${import.meta.env.BASE_URL}assets/deepak_prasad_26.pdf`} download="Deepak_Kumar_Prasad_Resume.pdf"
          style={{
            fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#000', background: '#fff',
            padding: '6px 16px', textDecoration: 'none', transition: 'background 0.2s', whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#e0e0e0')}
          onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
          RÉSUMÉ ↓
        </a>
      </div>

      <button onClick={() => setMenuOpen(m => !m)} className="hamburger" style={{
        background: 'none', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
        padding: '6px 10px', display: 'none', color: '#fff', fontSize: 18,
      }}>☰</button>

      {menuOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, bottom: 0,
          background: 'rgba(8,8,10,0.97)', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 32, zIndex: 999,
        }}>
          {SECTIONS.map(s => (
            <button key={s} onClick={() => { setMenuOpen(false); handleNav(s) }} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 24,
              color: '#fff', textTransform: 'capitalize',
            }}>{s}</button>
          ))}
        </div>
      )}
    </nav>
  )
}
