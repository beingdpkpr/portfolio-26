# Dark / Light Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a toggleable dark/light theme via CSS custom properties, a fixed-corner toggle button, localStorage persistence, and `prefers-color-scheme` fallback.

**Architecture:** `data-theme` attribute on `<html>` selects the palette. All color values live only in `global.css` under `:root` (dark) and `[data-theme="light"]` (light). Every component uses `var(--token)` strings — zero hardcoded hex or rgba in `.tsx` files after the refactor.

**Tech Stack:** CSS custom properties, React `useLayoutEffect`, localStorage, Vitest + React Testing Library

---

## Token Reference

All 21 tokens — dark (`:root`) → light (`[data-theme="light"]`):

| Token | Dark | Light | Replaces |
|---|---|---|---|
| `--bg` | `#08080a` | `#f0f0f0` | `#08080a`, page bg |
| `--bg-nav` | `rgba(8,8,10,0.92)` | `rgba(240,240,240,0.92)` | nav scrolled bg |
| `--bg-overlay` | `rgba(8,8,10,0.94)` | `rgba(240,240,240,0.94)` | modal overlay |
| `--bg-menu` | `rgba(8,8,10,0.97)` | `rgba(240,240,240,0.97)` | mobile menu bg |
| `--fg` | `#ffffff` | `#111111` | `#fff` primary text/white elements |
| `--fg-inv` | `#000000` | `#ffffff` | `#000` on filled buttons |
| `--fg-dim` | `#cccccc` | `#444444` | `#ccc` (SkillBar visible, CodeBlock hover) |
| `--fg-hover` | `#e0e0e0` | `#222222` | `#e0e0e0` filled-button hover bg |
| `--text-hi` | `#888888` | `#555555` | `#888`, `#777` |
| `--text-mid` | `#666666` | `#777777` | `#666` |
| `--text-lo` | `#555555` | `#888888` | `#555` |
| `--text-dim` | `#444444` | `#999999` | `#444` |
| `--text-ghost` | `#333333` | `#aaaaaa` | `#333` |
| `--line` | `rgba(255,255,255,0.06)` | `rgba(0,0,0,0.08)` | borders 0.06–0.08 |
| `--line-mid` | `rgba(255,255,255,0.12)` | `rgba(0,0,0,0.14)` | borders 0.10–0.15 |
| `--line-hi` | `rgba(255,255,255,0.25)` | `rgba(0,0,0,0.25)` | borders 0.20–0.30 |
| `--surf` | `rgba(255,255,255,0.04)` | `rgba(0,0,0,0.04)` | fills 0.02–0.05 |
| `--surf-hi` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.07)` | fills 0.08–0.10 |
| `--surf-hover` | `rgba(255,255,255,0.12)` | `rgba(0,0,0,0.10)` | hover fills 0.12 |
| `--selection` | `rgba(255,255,255,0.15)` | `rgba(0,0,0,0.12)` | `::selection` |
| `--error` | `#c0392b` | `#c0392b` | validation errors |

---

### Task 1: CSS token foundation

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Replace `:root`, update `body`, `::selection`, scrollbar, placeholder, and article-body in global.css**

Replace the entire contents of `src/styles/global.css` with:

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  /* Backgrounds */
  --bg:           #08080a;
  --bg-nav:       rgba(8,8,10,0.92);
  --bg-overlay:   rgba(8,8,10,0.94);
  --bg-menu:      rgba(8,8,10,0.97);

  /* Foreground / text */
  --fg:           #ffffff;
  --fg-inv:       #000000;
  --fg-dim:       #cccccc;
  --fg-hover:     #e0e0e0;
  --text-hi:      #888888;
  --text-mid:     #666666;
  --text-lo:      #555555;
  --text-dim:     #444444;
  --text-ghost:   #333333;

  /* Borders */
  --line:         rgba(255,255,255,0.06);
  --line-mid:     rgba(255,255,255,0.12);
  --line-hi:      rgba(255,255,255,0.25);

  /* Surface fills */
  --surf:         rgba(255,255,255,0.04);
  --surf-hi:      rgba(255,255,255,0.08);
  --surf-hover:   rgba(255,255,255,0.12);

  /* Semantic */
  --selection:    rgba(255,255,255,0.15);
  --error:        #c0392b;
}

[data-theme="light"] {
  --bg:           #f0f0f0;
  --bg-nav:       rgba(240,240,240,0.92);
  --bg-overlay:   rgba(240,240,240,0.94);
  --bg-menu:      rgba(240,240,240,0.97);

  --fg:           #111111;
  --fg-inv:       #ffffff;
  --fg-dim:       #444444;
  --fg-hover:     #222222;
  --text-hi:      #555555;
  --text-mid:     #777777;
  --text-lo:      #888888;
  --text-dim:     #999999;
  --text-ghost:   #aaaaaa;

  --line:         rgba(0,0,0,0.08);
  --line-mid:     rgba(0,0,0,0.14);
  --line-hi:      rgba(0,0,0,0.25);

  --surf:         rgba(0,0,0,0.04);
  --surf-hi:      rgba(0,0,0,0.07);
  --surf-hover:   rgba(0,0,0,0.10);

  --selection:    rgba(0,0,0,0.12);
  --error:        #c0392b;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
}

body {
  background: var(--bg);
  color: var(--fg);
  overflow-x: hidden;
  transition: background 0.2s, color 0.2s;
}

::selection {
  background: var(--selection);
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--text-ghost); }
::-webkit-scrollbar-thumb:hover { background: var(--text-lo); }

input::placeholder,
textarea::placeholder {
  color: var(--text-dim);
  font-family: 'Inter', sans-serif;
}
textarea { font-family: 'Inter', sans-serif; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%       { transform: translateX(-50%) translateY(8px); }
}

/* ── Responsive grid helpers ── */
@media (max-width: 768px) {
  .nav-links { display: none !important; }
  .hamburger { display: flex !important; }
}

@media (max-width: 900px) {
  .about-grid   { grid-template-columns: 1fr !important; }
  .exp-grid     { grid-template-columns: 1fr !important; }
  .exp-detail   { padding: 32px 0 0 0 !important; }
  .contact-grid { grid-template-columns: 1fr !important; }
  .edu-card     { grid-template-columns: 1fr !important; }
  .cert-row          { grid-template-columns: 1fr !important; }
  .testimonials-grid { grid-template-columns: 1fr !important; }
}

/* ── Blog article typography ── */
.article-body { font-family: 'Inter', sans-serif; font-size: 15px; color: var(--text-hi); line-height: 1.85; }
.article-body h2 { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 22px; color: var(--fg); margin: 40px 0 16px; letter-spacing: -0.01em; }
.article-body h3 { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 17px; color: var(--fg-dim); margin: 28px 0 12px; }
.article-body p  { margin-bottom: 20px; }
.article-body ul,
.article-body ol { padding-left: 24px; margin-bottom: 20px; }
.article-body li { margin-bottom: 8px; }
.article-body blockquote { border-left: 2px solid var(--line-mid); padding: 4px 0 4px 20px; color: var(--text-mid); margin: 24px 0; }
.article-body code { font-family: 'Space Mono', monospace; font-size: 13px; background: var(--surf); padding: 2px 6px; color: var(--fg-dim); }
.article-body pre  { background: var(--surf); border: 1px solid var(--line); padding: 20px 24px; overflow-x: auto; margin-bottom: 24px; position: relative; }
.article-body pre code { background: none; padding: 0; }
.article-body a { color: var(--fg); text-underline-offset: 3px; }
.article-body a:hover { opacity: 0.7; }
.article-body hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }
```

- [ ] **Step 2: Run tests to confirm nothing broke**

```bash
npm run test:run
```

Expected: 11 passed

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add CSS color token system for dark/light theming"
```

---

### Task 2: useTheme hook

**Files:**
- Create: `src/hooks/useTheme.ts`
- Create: `src/hooks/useTheme.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/hooks/useTheme.test.ts`:

```ts
import { renderHook, act } from '@testing-library/react'
import { useTheme } from './useTheme'

function mockMatchMedia(prefersLight: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: prefersLight && query === '(prefers-color-scheme: light)',
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  })
}

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    mockMatchMedia(false)
  })

  it('defaults to dark when no preference stored', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBeNull()
  })

  it('reads saved light theme from localStorage', () => {
    localStorage.setItem('dp_theme', 'light')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('toggles dark→light and persists to localStorage', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('light')
    expect(localStorage.getItem('dp_theme')).toBe('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('toggles light→dark and removes data-theme attribute', () => {
    localStorage.setItem('dp_theme', 'light')
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBeNull()
  })

  it('detects prefers-color-scheme: light when no localStorage', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
  })
})
```

- [ ] **Step 2: Run to confirm tests fail**

```bash
npm run test:run
```

Expected: FAIL — `Cannot find module './useTheme'`

- [ ] **Step 3: Implement the hook**

Create `src/hooks/useTheme.ts`:

```ts
import { useLayoutEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('dp_theme') as Theme | null
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useLayoutEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
    localStorage.setItem('dp_theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  return { theme, toggleTheme }
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm run test:run
```

Expected: 16 passed (11 existing + 5 new)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useTheme.ts src/hooks/useTheme.test.ts
git commit -m "feat: add useTheme hook with localStorage and prefers-color-scheme support"
```

---

### Task 3: ThemeToggle component + wiring

**Files:**
- Create: `src/components/ui/ThemeToggle.tsx`
- Create: `src/components/ui/ThemeToggle.test.tsx`
- Modify: `src/pages/Home.tsx`
- Modify: `src/pages/Blog.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/ui/ThemeToggle.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from './ThemeToggle'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (q: string) => ({ matches: false, media: q, addEventListener: () => {}, removeEventListener: () => {} }),
  })
})

describe('ThemeToggle', () => {
  it('shows moon icon and correct aria-label in dark mode', () => {
    render(<ThemeToggle />)
    const btn = screen.getByRole('button', { name: /switch to light mode/i })
    expect(btn).toBeInTheDocument()
    expect(btn.textContent).toBe('🌙')
  })

  it('switches to sun icon after clicking', async () => {
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button'))
    const btn = screen.getByRole('button', { name: /switch to dark mode/i })
    expect(btn.textContent).toBe('☀️')
  })
})
```

- [ ] **Step 2: Run to confirm tests fail**

```bash
npm run test:run
```

Expected: FAIL — `Cannot find module './ThemeToggle'`

- [ ] **Step 3: Implement ThemeToggle**

Create `src/components/ui/ThemeToggle.tsx`:

```tsx
import { useTheme } from '../../hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 1100,
        width: 44, height: 44, borderRadius: '50%',
        background: 'var(--surf-hover)',
        border: '1px solid var(--line)',
        cursor: 'pointer', fontSize: 18,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surf-hi)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'var(--surf-hover)')}
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}
```

- [ ] **Step 4: Wire into Home.tsx**

In `src/pages/Home.tsx`, add import and render `<ThemeToggle />` just before `</div>`:

```tsx
import { ThemeToggle } from '../components/ui/ThemeToggle'

// inside JSX, just before closing </div>:
      <Footer />
      <ThemeToggle />
    </div>
```

- [ ] **Step 5: Wire into Blog.tsx**

In `src/pages/Blog.tsx`, add import and render `<ThemeToggle />`:

```tsx
import { ThemeToggle } from '../components/ui/ThemeToggle'

// inside JSX, just before closing </div>:
      {activePost && (
        <PostModal post={activePost} posts={posts} onClose={() => navigate('/blog')} />
      )}
      <ThemeToggle />
    </div>
```

- [ ] **Step 6: Run all tests**

```bash
npm run test:run
```

Expected: 18 passed

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/ThemeToggle.tsx src/components/ui/ThemeToggle.test.tsx src/pages/Home.tsx src/pages/Blog.tsx
git commit -m "feat: add ThemeToggle button, wire into Home and Blog pages"
```

---

### Task 4: Convert Nav + Hero

**Files:**
- Modify: `src/components/Nav.tsx`
- Modify: `src/components/Hero.tsx`

- [ ] **Step 1: Replace Nav.tsx**

```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useActiveSection } from '../hooks/useActiveSection'

const SECTIONS = ['about', 'experience', 'projects', 'skills', 'education', 'certifications', 'testimonials', 'blog', 'contact']

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
    if (el) { scrollTo(id) } else { navigate('/#' + id) }
  }

  useState(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  })

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'var(--bg-nav)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--line)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 clamp(16px,4vw,64px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 64,
    }}>
      <button onClick={() => handleNav('hero')} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--fg)', fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700, fontSize: 16, letterSpacing: '0.05em',
      }}>
        DKP<span style={{ color: 'var(--text-hi)' }}>.</span>
      </button>

      <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="nav-links">
        {SECTIONS.map(s => (
          <button key={s} onClick={() => handleNav(s)} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
            fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: active === s ? 'var(--fg)' : 'var(--text-mid)',
            borderBottom: active === s ? '1px solid var(--fg)' : '1px solid transparent',
            transition: 'all 0.2s',
          }}>{s}</button>
        ))}
        <a href={`${import.meta.env.BASE_URL}assets/deepak_prasad_26.pdf`} download="Deepak_Kumar_Prasad_Resume.pdf"
          style={{
            fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--fg-inv)', background: 'var(--fg)',
            padding: '6px 16px', textDecoration: 'none', transition: 'background 0.2s', whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--fg-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--fg)')}>
          RÉSUMÉ ↓
        </a>
      </div>

      <button onClick={() => setMenuOpen(m => !m)} className="hamburger" style={{
        background: 'none', border: '1px solid var(--line-hi)', cursor: 'pointer',
        padding: '6px 10px', display: 'none', color: 'var(--fg)', fontSize: 18,
      }}>☰</button>

      {menuOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, bottom: 0,
          background: 'var(--bg-menu)', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 32, zIndex: 999,
        }}>
          {SECTIONS.map(s => (
            <button key={s} onClick={() => { setMenuOpen(false); handleNav(s) }} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 24,
              color: 'var(--fg)', textTransform: 'capitalize',
            }}>{s}</button>
          ))}
        </div>
      )}
    </nav>
  )
}
```

- [ ] **Step 2: Replace Hero.tsx**

```tsx
import { useTypingEffect } from '../hooks/useTypingEffect'
import data, { yearsExperience } from '../data/portfolio-data'

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' })
}

export function Hero() {
  const typed = useTypingEffect(data.title)

  return (
    <section id="hero" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', padding: '0 clamp(16px,8vw,140px)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'linear-gradient(var(--surf) 1px, transparent 1px), linear-gradient(90deg, var(--surf) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900 }}>
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: '0.2em',
          color: 'var(--text-lo)', textTransform: 'uppercase', marginBottom: 24,
          animation: 'fadeUp 0.8s ease both',
        }}>
          Application Architect · Software Engineer
        </div>

        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
          fontSize: 'clamp(48px,8vw,112px)', lineHeight: 0.95,
          color: 'var(--fg)', margin: '0 0 24px',
          animation: 'fadeUp 0.8s ease 0.1s both',
          letterSpacing: '-0.02em',
        }}>
          {data.name.split(' ')[0]}<br />
          <span style={{ color: 'transparent', WebkitTextStroke: '1px var(--line-hi)' }}>
            {data.name.split(' ').slice(1).join(' ')}
          </span>
        </h1>

        <div style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(18px,2.5vw,28px)',
          color: 'var(--text-hi)', marginBottom: 40, height: 36,
          animation: 'fadeUp 0.8s ease 0.2s both',
        }}>
          <span style={{ color: 'var(--fg)' }}>{typed}</span>
          <span style={{ animation: 'blink 1s step-end infinite', color: 'var(--fg)' }}>|</span>
        </div>

        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 16, color: 'var(--text-lo)', maxWidth: 520,
          lineHeight: 1.7, marginBottom: 48,
          animation: 'fadeUp 0.8s ease 0.3s both',
        }}>
          {data.tagline}
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', animation: 'fadeUp 0.8s ease 0.4s both' }}>
          <button onClick={() => scrollTo('experience')} style={{
            background: 'var(--fg)', color: 'var(--fg-inv)', border: 'none', cursor: 'pointer',
            padding: '14px 32px', fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: 14, letterSpacing: '0.05em', transition: 'all 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--fg-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--fg)')}>
            VIEW WORK ↓
          </button>
          <button onClick={() => scrollTo('contact')} style={{
            background: 'transparent', color: 'var(--fg)',
            border: '1px solid var(--line-hi)', cursor: 'pointer',
            padding: '14px 32px', fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: 14, letterSpacing: '0.05em', transition: 'all 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--fg)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line-hi)')}>
            GET IN TOUCH
          </button>
          <a
            href={`${import.meta.env.BASE_URL}assets/deepak_prasad_26.pdf`}
            download="Deepak_Kumar_Prasad_Resume.pdf"
            aria-label="Download résumé"
            style={{
              background: 'transparent', color: 'var(--fg)',
              border: '1px solid var(--line-hi)',
              padding: '14px 32px', fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: 14, letterSpacing: '0.05em',
              textDecoration: 'none', transition: 'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--fg)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line-hi)')}
          >
            RÉSUMÉ ↓
          </a>
        </div>

        <div style={{
          display: 'flex', gap: 48, marginTop: 80, paddingTop: 48,
          borderTop: '1px solid var(--line)',
          animation: 'fadeUp 0.8s ease 0.5s both', flexWrap: 'wrap',
        }}>
          {([
            [`${yearsExperience}+ yrs`, 'Experience'],
            ['150+', 'Global Clients'],
            ['10+', 'Engineers Led'],
            ['50%', 'Runtime Reduction'],
          ] as [string, string][]).map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 32, color: 'var(--fg)' }}>{n}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'var(--text-lo)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        animation: 'bounce 2s ease infinite', color: 'var(--text-dim)',
        fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.15em',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        <span>SCROLL</span><span>↓</span>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Run tests**

```bash
npm run test:run
```

Expected: 18 passed

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.tsx src/components/Hero.tsx
git commit -m "refactor: convert Nav and Hero to CSS tokens"
```

---

### Task 5: Convert About + Experience + Projects

**Files:**
- Modify: `src/components/About.tsx`
- Modify: `src/components/Experience.tsx`
- Modify: `src/components/Projects.tsx`

- [ ] **Step 1: Replace About.tsx**

```tsx
import { Reveal } from './ui/Reveal'
import data from '../data/portfolio-data'

export function About() {
  const d = data
  return (
    <section id="about" style={{ padding: '120px clamp(16px,8vw,140px)', borderTop: '1px solid var(--line)' }}>
      <Reveal>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: 'var(--text-lo)', textTransform: 'uppercase', marginBottom: 48 }}>
          01 / About
        </div>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }} className="about-grid">
        <div>
          <Reveal delay={0.1}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(32px,4vw,56px)', color: 'var(--fg)', lineHeight: 1.1, margin: '0 0 32px', letterSpacing: '-0.02em' }}>
              Building systems<br />that matter.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: 'var(--text-hi)', lineHeight: 1.8, marginBottom: 24 }}>
              {d.about}
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ display: 'flex', gap: 16, marginTop: 32, flexWrap: 'wrap' }}>
              {([['✉', d.email, `mailto:${d.email}`], ['↗', d.linkedinLabel, d.linkedin], ['⌥', d.githubLabel, d.github]] as const).map(([icon, label, href]) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'var(--text-lo)',
                  border: '1px solid var(--line-mid)', padding: '8px 16px',
                  letterSpacing: '0.05em', textDecoration: 'none', transition: 'color 0.2s, border-color 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--fg)'; e.currentTarget.style.borderColor = 'var(--line-hi)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-lo)'; e.currentTarget.style.borderColor = 'var(--line-mid)' }}>
                  {icon} {label}
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} direction="left">
          <div style={{ aspectRatio: '3/4', maxWidth: 340, overflow: 'hidden', border: '1px solid var(--line)', position: 'relative' }}>
            <img src={`${import.meta.env.BASE_URL}assets/headshot.jpg`} alt="Deepak Kumar Prasad"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', filter: 'grayscale(20%)' }} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Replace Experience.tsx**

```tsx
import { useState } from 'react'
import { Reveal } from './ui/Reveal'
import data from '../data/portfolio-data'

export function Experience() {
  const [active, setActive] = useState(0)
  const d = data.experience

  return (
    <section id="experience" style={{ padding: '120px clamp(16px,8vw,140px)', borderTop: '1px solid var(--line)' }}>
      <Reveal>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: 'var(--text-lo)', textTransform: 'uppercase', marginBottom: 16 }}>
          02 / Experience
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', color: 'var(--fg)', margin: '0 0 64px', letterSpacing: '-0.02em' }}>
          Career Timeline
        </h2>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 0 }} className="exp-grid">
        <div style={{ borderRight: '1px solid var(--line)' }}>
          {d.map((job, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <button onClick={() => setActive(i)} style={{
                width: '100%', background: 'none', border: 'none',
                borderLeft: active === i ? '2px solid var(--fg)' : '2px solid transparent',
                cursor: 'pointer', padding: '20px 32px 20px 28px', textAlign: 'left',
                transition: 'all 0.2s', display: 'block',
              }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.15em', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4 }}>
                  {job.period}
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, color: active === i ? 'var(--fg)' : 'var(--text-mid)', marginBottom: 3, lineHeight: 1.3 }}>
                  {job.title}
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: active === i ? 'var(--text-hi)' : 'var(--text-dim)' }}>
                  {job.company}
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <div style={{ padding: '8px 0 8px 56px' }} className="exp-detail">
          <Reveal key={active} delay={0}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'var(--text-lo)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
              {d[active].period} · {d[active].duration} · {d[active].location}
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 28, color: 'var(--fg)', margin: '0 0 8px' }}>
              {d[active].title}
            </h3>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, color: 'var(--text-lo)', marginBottom: 32 }}>
              @ {d[active].company}
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {d[active].bullets.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--fg)', marginTop: 3, flexShrink: 0 }}>→</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: 'var(--text-hi)', lineHeight: 1.7 }}>{b}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Replace Projects.tsx**

```tsx
import { useState } from 'react'
import { Reveal } from './ui/Reveal'
import data from '../data/portfolio-data'

export function Projects() {
  const [hovered, setHovered] = useState<number | null>(null)
  const d = data.projects

  return (
    <section id="projects" style={{ padding: '120px clamp(16px,8vw,140px)', borderTop: '1px solid var(--line)' }}>
      <Reveal>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: 'var(--text-lo)', textTransform: 'uppercase', marginBottom: 16 }}>
          03 / Projects
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', color: 'var(--fg)', margin: '0 0 64px', letterSpacing: '-0.02em' }}>
          Selected Work
        </h2>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))', gap: 1, alignItems: 'stretch' }}>
        {d.map((p, i) => (
          <Reveal key={i} delay={i * 0.07} style={{ height: '100%' }}>
            <div
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: '40px', border: '1px solid var(--line)',
                background: hovered === i ? 'var(--surf)' : 'transparent',
                transition: 'all 0.25s ease', cursor: 'default',
                position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', height: '100%',
              }}>
              <div style={{ position: 'absolute', top: 24, right: 24, fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'var(--surf-hover)', letterSpacing: '0.1em' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{
                display: 'inline-block', background: 'var(--surf)', border: '1px solid var(--line-mid)',
                fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-hi)',
                letterSpacing: '0.1em', padding: '4px 10px', marginBottom: 20, textTransform: 'uppercase',
              }}>
                {p.highlight}
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: 'var(--fg)', margin: '0 0 12px', lineHeight: 1.3 }}>
                {p.title}
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.7, margin: '0 0 24px', flex: 1 }}>
                {p.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {p.tags.map(t => (
                  <span key={t} style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-lo)', border: '1px solid var(--line)', padding: '3px 10px', letterSpacing: '0.08em' }}>{t}</span>
                ))}
              </div>
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
                background: 'var(--fg)',
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
```

- [ ] **Step 4: Run tests**

```bash
npm run test:run
```

Expected: 18 passed

- [ ] **Step 5: Commit**

```bash
git add src/components/About.tsx src/components/Experience.tsx src/components/Projects.tsx
git commit -m "refactor: convert About, Experience, Projects to CSS tokens"
```

---

### Task 6: Convert Skills (+ SkillBar) + Education + Certifications

**Files:**
- Modify: `src/components/Skills.tsx`
- Modify: `src/components/ui/SkillBar.tsx`
- Modify: `src/components/Education.tsx`
- Modify: `src/components/Certifications.tsx`

- [ ] **Step 1: Replace SkillBar.tsx**

```tsx
import { useInView } from '../../hooks/useInView'

interface SkillBarProps {
  label: string
  delay?: number
}

export function SkillBar({ label, delay = 0 }: SkillBarProps) {
  const [ref, vis] = useInView(0.1)
  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 6, height: 6,
        background: vis ? 'var(--fg)' : 'transparent',
        border: '1px solid var(--line-hi)',
        flexShrink: 0,
        transition: `all 0.4s ease ${delay + 0.2}s`,
      }} />
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 14,
        color: vis ? 'var(--fg-dim)' : 'var(--text-dim)',
        transition: `color 0.4s ease ${delay + 0.2}s`,
      }}>
        {label}
      </span>
    </div>
  )
}
```

- [ ] **Step 2: Replace Skills.tsx**

```tsx
import { Reveal } from './ui/Reveal'
import { SkillBar } from './ui/SkillBar'
import data from '../data/portfolio-data'

export function Skills() {
  const d = data.skills
  return (
    <section id="skills" style={{ padding: '120px clamp(16px,8vw,140px)', borderTop: '1px solid var(--line)' }}>
      <Reveal>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: 'var(--text-lo)', textTransform: 'uppercase', marginBottom: 16 }}>
          04 / Skills
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', color: 'var(--fg)', margin: '0 0 64px', letterSpacing: '-0.02em' }}>
          Technical Stack
        </h2>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 40 }}>
        {d.map((group, gi) => (
          <Reveal key={gi} delay={gi * 0.06}>
            <div>
              <div style={{
                fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-dim)',
                letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20,
                paddingBottom: 12, borderBottom: '1px solid var(--line)',
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
```

- [ ] **Step 3: Replace Education.tsx**

```tsx
import { useState } from 'react'
import { Reveal } from './ui/Reveal'
import data from '../data/portfolio-data'

export function Education() {
  const [openProj, setOpenProj] = useState<string | null>(null)
  const d = data.education

  return (
    <section id="education" style={{ padding: '120px clamp(16px,8vw,140px)', borderTop: '1px solid var(--line)' }}>
      <Reveal>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: 'var(--text-lo)', textTransform: 'uppercase', marginBottom: 16 }}>
          05 / Education
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', color: 'var(--fg)', margin: '0 0 64px', letterSpacing: '-0.02em' }}>
          Academic Background
        </h2>
      </Reveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {d.map((edu, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div style={{ padding: '40px', border: '1px solid var(--line)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start' }} className="edu-card">
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--fg)', marginBottom: 8 }}>{edu.degree}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: 'var(--text-mid)', marginBottom: 8 }}>{edu.institution}</div>
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.08em' }}>{edu.detail}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'var(--text-hi)', letterSpacing: '0.08em' }}>GPA: {edu.gpa}</span>
                  </div>
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 40, color: 'var(--surf-hover)', letterSpacing: '-0.02em', flexShrink: 0 }}>{edu.year}</div>
              </div>

              {edu.projects && (
                <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid var(--line)' }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 20 }}>Academic Projects</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 1 }}>
                    {edu.projects.map((p, pi) => {
                      const key = `${i}-${pi}`
                      return (
                        <div key={pi}
                          onClick={() => setOpenProj(openProj === key ? null : key)}
                          style={{
                            padding: '24px', border: '1px solid var(--line)', cursor: 'pointer',
                            background: openProj === key ? 'var(--surf)' : 'transparent', transition: 'background 0.2s',
                          }}>
                          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, color: 'var(--fg)', marginBottom: 8 }}>{p.title}</div>
                          {openProj === key && (
                            <div>
                              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.7, margin: '0 0 12px' }}>{p.description}</p>
                              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-lo)', border: '1px solid var(--line)', padding: '3px 10px', letterSpacing: '0.08em' }}>{p.tech}</span>
                            </div>
                          )}
                          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-dim)', marginTop: 8 }}>
                            {openProj === key ? 'collapse' : '+ details'}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {edu.achievements && (
                <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid var(--line)' }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>Achievements</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {edu.achievements.map((a, ai) => (
                      <div key={ai} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--text-lo)', flexShrink: 0, marginTop: 2 }}>→</span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: 'var(--text-hi)', lineHeight: 1.6 }}>{a}</span>
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
```

- [ ] **Step 4: Replace Certifications.tsx**

```tsx
import { useState } from 'react'
import { Reveal } from './ui/Reveal'
import data from '../data/portfolio-data'

export function Certifications() {
  const [expanded, setExpanded] = useState<number | null>(null)
  const d = data.certifications

  return (
    <section id="certifications" style={{ padding: '120px clamp(16px,8vw,140px)', borderTop: '1px solid var(--line)' }}>
      <Reveal>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: 'var(--text-lo)', textTransform: 'uppercase', marginBottom: 16 }}>
          06 / Certifications
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', color: 'var(--fg)', margin: '0 0 64px', letterSpacing: '-0.02em' }}>
          Credentials
        </h2>
      </Reveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {d.map((cert, i) => (
          <Reveal key={i} delay={i * 0.07}>
            <div style={{ border: '1px solid var(--line)', overflow: 'hidden' }}>
              <div
                style={{ padding: '32px 40px', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 24, cursor: cert.courses ? 'pointer' : 'default', transition: 'background 0.2s' }} className="cert-row"
                onClick={() => cert.courses && setExpanded(expanded === i ? null : i)}
                onMouseEnter={e => { if (cert.courses) e.currentTarget.style.background = 'var(--surf)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                    {cert.type === 'specialization' && (
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: 'var(--text-hi)', border: '1px solid var(--line-mid)', padding: '2px 8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Specialization</span>
                    )}
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.1em' }}>{cert.year}</span>
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: 'var(--fg)', marginBottom: 6, lineHeight: 1.3 }}>{cert.name}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'var(--text-lo)' }}>{cert.issuer}</div>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexShrink: 0 }}>
                  <a href={cert.verify} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-lo)', letterSpacing: '0.1em', textDecoration: 'none', border: '1px solid var(--line-mid)', padding: '6px 14px', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--fg)'; e.currentTarget.style.borderColor = 'var(--line-hi)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-lo)'; e.currentTarget.style.borderColor = 'var(--line-mid)' }}>
                    VERIFY →
                  </a>
                  {cert.courses && (
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: 'var(--text-dim)', transform: expanded === i ? 'rotate(90deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>▶</span>
                  )}
                </div>
              </div>

              {cert.courses && expanded === i && (
                <div style={{ borderTop: '1px solid var(--line)', padding: '8px 40px 24px', background: 'var(--surf)' }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16, marginTop: 16 }}>Included Courses</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {cert.courses.map((c, ci) => (
                      <div key={ci} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: 'var(--text-hi)' }}>↳ {c.name}</span>
                        <a href={c.verify} target="_blank" rel="noopener noreferrer"
                          style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.1em', textDecoration: 'none', flexShrink: 0, transition: 'color 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}>
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
```

- [ ] **Step 5: Run tests**

```bash
npm run test:run
```

Expected: 18 passed

- [ ] **Step 6: Commit**

```bash
git add src/components/Skills.tsx src/components/ui/SkillBar.tsx src/components/Education.tsx src/components/Certifications.tsx
git commit -m "refactor: convert Skills, SkillBar, Education, Certifications to CSS tokens"
```

---

### Task 7: Convert Testimonials + BlogLink + Contact + Footer

**Files:**
- Modify: `src/components/Testimonials.tsx`
- Modify: `src/components/BlogLink.tsx`
- Modify: `src/components/Contact.tsx`
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Replace Testimonials.tsx**

```tsx
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
```

- [ ] **Step 2: Replace BlogLink.tsx**

```tsx
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
```

- [ ] **Step 3: Replace Contact.tsx**

```tsx
import { useState, useRef } from 'react'
import { Reveal } from './ui/Reveal'
import { sendEmail, isEmailJSConfigured } from '../lib/emailjs'
import type { FormState } from '../types'
import data from '../data/portfolio-data'

const COOLDOWN_MS = 30_000
const STORAGE_KEY = 'contact_last_sent'

function validate(name: string, email: string, message: string): string | null {
  if (name.trim().length < 2)        return 'Name must be at least 2 characters.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.'
  if (message.trim().length < 5)     return 'Please enter a message.'
  if (message.trim().length > 3000)  return 'Message must be under 3000 characters.'
  return null
}

function isCoolingDown(): boolean {
  const last = sessionStorage.getItem(STORAGE_KEY)
  if (!last) return false
  return Date.now() - Number(last) < COOLDOWN_MS
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'transparent',
  border: 'none', borderBottom: '1px solid var(--line-mid)',
  color: 'var(--fg)', fontFamily: "'Inter', sans-serif", fontSize: 16,
  padding: '16px 0', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

export function Contact() {
  const d = data
  const configured = isEmailJSConfigured()
  const [formState, setFormState] = useState<FormState>('idle')
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [message, setMessage] = useState('')
  const [error, setError]     = useState<string | null>(null)
  const [sendError, setSendError] = useState<string | null>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (honeypotRef.current?.value) return
    const validationError = validate(name, email, message)
    if (validationError) { setError(validationError); return }
    if (isCoolingDown()) { setError('Please wait a moment before sending another message.'); return }
    setError(null); setSendError(null); setFormState('sending')
    try {
      await sendEmail({ from_name: name, from_email: email, message })
      sessionStorage.setItem(STORAGE_KEY, String(Date.now()))
      setFormState('success')
      setName(''); setEmail(''); setMessage('')
    } catch (err) {
      setSendError(err instanceof Error ? err.message : String(err))
      setFormState('error')
    }
  }

  return (
    <section id="contact" style={{ padding: '120px clamp(16px,8vw,140px)', borderTop: '1px solid var(--line)' }}>
      <Reveal>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: 'var(--text-lo)', textTransform: 'uppercase', marginBottom: 16 }}>
          08 / Contact
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', color: 'var(--fg)', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
          Let's Talk
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: 'var(--text-lo)', marginBottom: 80, maxWidth: 480, lineHeight: 1.7 }}>
          Open to interesting problems, architecture challenges, and meaningful collaborations.
        </p>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }} className="contact-grid">
        <Reveal delay={0.1}>
          {!configured ? (
            <div style={{ padding: '32px', border: '1px solid var(--line)' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'var(--text-lo)', lineHeight: 1.8 }}>
                Contact form temporarily unavailable.<br />
                Reach out directly at <a href={`mailto:${d.email}`} style={{ color: 'var(--text-hi)' }}>{d.email}</a>
              </div>
            </div>
          ) : formState === 'success' ? (
            <div style={{ padding: '48px', border: '1px solid var(--line-mid)', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, color: 'var(--fg)', marginBottom: 12 }}>
                Message sent ✓
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: 'var(--text-lo)', marginBottom: 32 }}>
                I'll be in touch soon.
              </div>
              <button onClick={() => setFormState('idle')} style={{ background: 'none', border: '1px solid var(--line-hi)', color: 'var(--text-lo)', cursor: 'pointer', padding: '8px 20px', fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.1em', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--fg)'; e.currentTarget.style.borderColor = 'var(--fg)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-lo)'; e.currentTarget.style.borderColor = 'var(--line-hi)' }}>
                SEND ANOTHER
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }} noValidate>
              <input ref={honeypotRef} type="text" name="website" tabIndex={-1} aria-hidden="true" style={{ display: 'none' }} />
              <div>
                <input type="text" placeholder="Your Name" value={name} required
                  onChange={e => setName(e.target.value)} style={inputStyle}
                  onFocus={e => (e.target.style.borderBottomColor = 'var(--fg)')}
                  onBlur={e => (e.target.style.borderBottomColor = 'var(--line-mid)')} />
              </div>
              <div>
                <input type="email" placeholder="Your Email" value={email} required
                  onChange={e => setEmail(e.target.value)} style={inputStyle}
                  onFocus={e => (e.target.style.borderBottomColor = 'var(--fg)')}
                  onBlur={e => (e.target.style.borderBottomColor = 'var(--line-mid)')} />
              </div>
              <div>
                <textarea placeholder="Your Message" value={message} required rows={4}
                  onChange={e => setMessage(e.target.value)}
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={e => (e.target.style.borderBottomColor = 'var(--fg)')}
                  onBlur={e => (e.target.style.borderBottomColor = 'var(--line-mid)')} />
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: 'var(--text-dim)', marginTop: 6, textAlign: 'right' }}>
                  {message.length} / 3000
                </div>
              </div>
              {error && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'var(--error)' }}>{error}</div>}
              {formState === 'error' && (
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'var(--error)' }}>
                  {sendError ?? 'Something went wrong. Please try again or email directly.'}
                </div>
              )}
              <button type="submit" disabled={formState === 'sending'}
                style={{
                  background: 'var(--fg)', color: 'var(--fg-inv)',
                  border: 'none', cursor: formState === 'sending' ? 'not-allowed' : 'pointer',
                  padding: '16px 40px', fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: 14, letterSpacing: '0.05em',
                  alignSelf: 'flex-start', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (formState !== 'sending') e.currentTarget.style.background = 'var(--fg-hover)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--fg)' }}>
                {formState === 'sending' ? 'SENDING…' : 'SEND MESSAGE →'}
              </button>
            </form>
          )}
        </Reveal>

        <Reveal delay={0.2}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {([
              ['Location', d.location, null],
              ['Email',    d.email,    `mailto:${d.email}`],
              ['Phone',    d.phone,    `tel:${d.phone}`],
              ['LinkedIn', d.linkedinLabel, d.linkedin],
              ['GitHub',   d.githubLabel,   d.github],
            ] as const).map(([label, val, href]) => (
              <div key={label} style={{ borderBottom: '1px solid var(--line)', paddingBottom: 24 }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
                {href ? (
                  <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, color: 'var(--text-hi)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-hi)')}>
                    {val}
                  </a>
                ) : (
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, color: 'var(--text-hi)' }}>{val}</div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Replace Footer.tsx**

```tsx
export function Footer() {
  return (
    <div style={{
      padding: '48px clamp(16px,8vw,140px)',
      borderTop: '1px solid var(--line)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
    }}>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'var(--text-ghost)', letterSpacing: '0.1em' }}>
        © 2026 DEEPAK KUMAR PRASAD
      </div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'var(--text-ghost)', letterSpacing: '0.08em' }}>
        DESIGNED & BUILT WITH CARE
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Run tests**

```bash
npm run test:run
```

Expected: 18 passed

- [ ] **Step 6: Commit**

```bash
git add src/components/Testimonials.tsx src/components/BlogLink.tsx src/components/Contact.tsx src/components/Footer.tsx
git commit -m "refactor: convert Testimonials, BlogLink, Contact, Footer to CSS tokens"
```

---

### Task 8: Convert PostModal + CodeBlock + Blog page + Home page

**Files:**
- Modify: `src/components/PostModal.tsx`
- Modify: `src/components/CodeBlock.tsx`
- Modify: `src/pages/Blog.tsx`
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: Replace PostModal.tsx**

```tsx
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { BlogPost } from '../types'
import { CodeBlock } from './CodeBlock'

interface PostModalProps {
  post: BlogPost
  posts: BlogPost[]
  onClose: () => void
}

export function PostModal({ post, posts, onClose }: PostModalProps) {
  const navigate = useNavigate()
  const closeRef = useRef<HTMLButtonElement>(null)
  const idx = posts.findIndex(p => p.slug === post.slug)
  const prev = posts[idx - 1]
  const next = posts[idx + 1]

  const scrollRef = useRef<HTMLDivElement>(null)
  const [progressFraction, setProgressFraction] = useState(0)

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const pct = el.scrollTop / (el.scrollHeight - el.clientHeight)
    setProgressFraction(isNaN(pct) ? 0 : Math.min(1, pct))
  }

  useEffect(() => {
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [onClose])

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
    setProgressFraction(0)
  }, [post.slug])

  const copyLink = () => { navigator.clipboard.writeText(window.location.href).catch(() => {}) }

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'var(--bg-overlay)', backdropFilter: 'blur(16px)', overflow: 'auto' }}
      onClick={onClose}
    >
      <div style={{ position: 'sticky', top: 0, zIndex: 1, height: 2, background: 'var(--surf-hi)' }}>
        <div
          data-testid="progress-bar"
          style={{ height: '100%', width: `${progressFraction * 100}%`, background: 'var(--fg)', transition: 'width 0.1s linear' }}
        />
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '80px 24px 120px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 56 }}>
          <button ref={closeRef} onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-lo)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: 0, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-lo)')}>← Close</button>
          <button onClick={copyLink}
            style={{ background: 'none', border: '1px solid var(--line-mid)', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-lo)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 14px', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--fg)'; e.currentTarget.style.borderColor = 'var(--line-hi)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-lo)'; e.currentTarget.style.borderColor = 'var(--line-mid)' }}>Copy Link</button>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: 'var(--text-lo)', border: '1px solid var(--line-mid)', padding: '2px 8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{post.tag}</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-dim)' }}>{post.date}</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-ghost)' }}>{post.readTime}</span>
        </div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(24px,3vw,40px)', color: 'var(--fg)', margin: '0 0 56px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          {post.title}
        </h1>

        <div className="article-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
            pre: ({ children }) => {
              const code = (children as React.ReactElement)?.props
              return <CodeBlock className={code?.className}>{code?.children}</CodeBlock>
            },
          }}>{post.content}</ReactMarkdown>
        </div>

        {(prev || next) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginTop: 80, borderTop: '1px solid var(--line)', paddingTop: 40 }}>
            {prev ? (
              <button onClick={() => navigate(`/blog/${prev.slug}`)}
                style={{ background: 'none', border: '1px solid var(--line)', cursor: 'pointer', padding: 24, textAlign: 'left', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surf)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>← Previous</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: 'var(--fg)', lineHeight: 1.3 }}>{prev.title}</div>
              </button>
            ) : <div />}
            {next ? (
              <button onClick={() => navigate(`/blog/${next.slug}`)}
                style={{ background: 'none', border: '1px solid var(--line)', cursor: 'pointer', padding: 24, textAlign: 'right', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surf)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Next →</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: 'var(--fg)', lineHeight: 1.3 }}>{next.title}</div>
              </button>
            ) : <div />}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Replace CodeBlock.tsx**

```tsx
import { useState } from 'react'

interface CodeBlockProps {
  children?: React.ReactNode
  className?: string
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const text = typeof children === 'string' ? children : String(children ?? '')

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }).catch(() => {})
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={copy}
        style={{
          position: 'absolute', top: 10, right: 10,
          background: copied ? 'var(--surf-hover)' : 'var(--surf)',
          border: '1px solid var(--line-mid)',
          cursor: 'pointer',
          fontFamily: "'Space Mono', monospace",
          fontSize: 9,
          color: copied ? 'var(--fg)' : 'var(--text-lo)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '4px 10px',
          transition: 'all 0.2s',
          zIndex: 1,
        }}
        onMouseEnter={e => { if (!copied) e.currentTarget.style.color = 'var(--fg-dim)' }}
        onMouseLeave={e => { if (!copied) e.currentTarget.style.color = 'var(--text-lo)' }}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre className={className}><code>{children}</code></pre>
    </div>
  )
}
```

- [ ] **Step 3: Update Blog.tsx page root div and tag filter buttons**

In `src/pages/Blog.tsx`, make these changes:

```tsx
// Line 19 — page root div:
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--fg)' }}>

// Back button (line 25):
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-lo)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 48, padding: 0, transition: 'color 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--fg)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-lo)' }}

// h1 (line 32):
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', color: 'var(--fg)', margin: '0 0 48px', letterSpacing: '-0.02em' }}

// Tag filter buttons (lines 42-50):
                style={{
                  background: activeTag === tag ? 'var(--fg)' : 'none',
                  border: '1px solid var(--line-mid)', cursor: 'pointer',
                  padding: '6px 16px', fontFamily: "'Space Mono', monospace",
                  fontSize: 10, color: activeTag === tag ? 'var(--fg-inv)' : 'var(--text-lo)',
                  letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.2s',
                }}

// "No posts yet" (line 57):
            <p style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-dim)', fontSize: 14 }}>No posts yet.</p>

// Post row (line 62):
                style={{ padding: '32px 40px', border: '1px solid var(--line)', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surf)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}

// Tag badge (line 67):
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: 'var(--text-lo)', border: '1px solid var(--line-mid)', padding: '2px 8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{post.tag}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-dim)' }}>{post.date}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-ghost)' }}>{post.readTime}</span>

// Post title (line 71):
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: 'var(--fg)', marginBottom: 8, lineHeight: 1.3 }}>{post.title}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: 'var(--text-lo)', lineHeight: 1.6 }}>{post.excerpt}</div>
```

The full replacement for `src/pages/Blog.tsx`:

```tsx
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAllPosts } from '../lib/markdown'
import { PostModal } from '../components/PostModal'
import { Reveal } from '../components/ui/Reveal'
import { Nav } from '../components/Nav'
import { ThemeToggle } from '../components/ui/ThemeToggle'

export function Blog() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const posts = getAllPosts()
  const [activeTag, setActiveTag] = useState('All')

  const tags = ['All', ...Array.from(new Set(posts.map(p => p.tag)))]
  const filtered = activeTag === 'All' ? posts : posts.filter(p => p.tag === activeTag)
  const activePost = slug ? posts.find(p => p.slug === slug) ?? null : null

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--fg)' }}>
      <Nav />
      <div style={{ padding: '120px clamp(16px,8vw,140px) 80px' }}>
        <Reveal>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-lo)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 48, padding: 0, transition: 'color 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--fg)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-lo)' }}
          >Back to Home</button>
        </Reveal>

        <Reveal>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', color: 'var(--fg)', margin: '0 0 48px', letterSpacing: '-0.02em' }}>
            Writing
          </h1>
        </Reveal>

        <Reveal delay={0.05}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 64 }}>
            {tags.map(tag => (
              <button key={tag} onClick={() => setActiveTag(tag)} style={{
                background: activeTag === tag ? 'var(--fg)' : 'none',
                border: '1px solid var(--line-mid)', cursor: 'pointer',
                padding: '6px 16px', fontFamily: "'Space Mono', monospace",
                fontSize: 10, color: activeTag === tag ? 'var(--fg-inv)' : 'var(--text-lo)',
                letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.2s',
              }}>{tag}</button>
            ))}
          </div>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {filtered.length === 0 ? (
            <p style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-dim)', fontSize: 14 }}>No posts yet.</p>
          ) : filtered.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.05}>
              <div
                onClick={() => navigate('/blog/' + post.slug)}
                style={{ padding: '32px 40px', border: '1px solid var(--line)', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surf)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: 'var(--text-lo)', border: '1px solid var(--line-mid)', padding: '2px 8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{post.tag}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-dim)' }}>{post.date}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-ghost)' }}>{post.readTime}</span>
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: 'var(--fg)', marginBottom: 8, lineHeight: 1.3 }}>{post.title}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: 'var(--text-lo)', lineHeight: 1.6 }}>{post.excerpt}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {activePost && (
        <PostModal post={activePost} posts={posts} onClose={() => navigate('/blog')} />
      )}
      <ThemeToggle />
    </div>
  )
}
```

- [ ] **Step 4: Update Home.tsx root div**

In `src/pages/Home.tsx`, change the root div background:

```tsx
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--fg)' }}>
```

- [ ] **Step 5: Run all tests**

```bash
npm run test:run
```

Expected: 18 passed

- [ ] **Step 6: Commit**

```bash
git add src/components/PostModal.tsx src/components/CodeBlock.tsx src/pages/Blog.tsx src/pages/Home.tsx
git commit -m "refactor: convert PostModal, CodeBlock, Blog, Home to CSS tokens"
```

---

### Task 9: Verification — zero hardcoded colors remain

**Files:** None (read-only verification)

- [ ] **Step 1: Grep for hardcoded hex colors in component and page files**

```bash
grep -rn "#[0-9a-fA-F]\{3,8\}\|rgba(" src/components src/pages --include="*.tsx"
```

Expected output: only `var(--error)` definition (which is `#c0392b` in CSS, not in TSX) and the `ThemeToggle` emoji characters. Zero hex or rgba literals in any `.tsx` file.

If any appear, fix them using the token map at the top of this plan before proceeding.

- [ ] **Step 2: Run full test suite**

```bash
npm run test:run
```

Expected: 18 passed

- [ ] **Step 3: TypeScript check**

```bash
npm run build 2>&1 | tail -20
```

Expected: no TypeScript errors, build succeeds.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: complete dark/light mode — all colors via CSS tokens, zero hardcoded values in TSX"
```
