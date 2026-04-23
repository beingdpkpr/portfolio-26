# Testimonials Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Testimonials section displaying four recommendations (three LinkedIn + one Letter of Recommendation) between Certifications and BlogLink, wired into the nav and data layer.

**Architecture:** New `Testimonial` type and `testimonials` array added to the existing type/data files. New `Testimonials` component follows the established section pattern (numbered label + h2 + Reveal + grid). `linkedinUrl` is optional on `Testimonial` — the LinkedIn link only renders when present (the LOR entry has none). Nav gains a `'testimonials'` entry. No new dependencies.

**Tech Stack:** React 18, TypeScript, existing CSS pattern (inline styles + global.css class for responsive grid)

---

## File Map

| File | Action |
|---|---|
| `src/types/index.ts` | Add `Testimonial` interface; add `testimonials: Testimonial[]` to `Portfolio` |
| `src/data/portfolio-data.ts` | Add `testimonials` array with 4 entries |
| `src/components/Testimonials.tsx` | Create new section component |
| `src/styles/global.css` | Add `.testimonials-grid` responsive breakpoint |
| `src/components/Nav.tsx` | Add `'testimonials'` to `SECTIONS` between `'certifications'` and `'blog'` |
| `src/pages/Home.tsx` | Import and render `<Testimonials />` between `<Certifications />` and `<BlogLink />` |
| `src/components/Testimonials.test.tsx` | Tests for the component |

---

### Task 1: Add `Testimonial` type and wire into `Portfolio`

**Files:**
- Modify: `src/types/index.ts`
- Create: `src/components/Testimonials.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/Testimonials.test.tsx`:

```tsx
import type { Testimonial } from '../types'

describe('Testimonial type', () => {
  it('has required fields', () => {
    const t: Testimonial = {
      name: 'Test Person',
      title: 'Engineer',
      company: 'Acme',
      relationship: 'managed directly',
      date: 'Jan 2025',
      text: 'Great work.',
    }
    expect(t.name).toBe('Test Person')
    expect(t.text).toBe('Great work.')
  })

  it('accepts optional linkedinUrl', () => {
    const t: Testimonial = {
      name: 'Test Person',
      title: 'Engineer',
      company: 'Acme',
      relationship: 'managed directly',
      date: 'Jan 2025',
      text: 'Great work.',
      linkedinUrl: 'https://linkedin.com/in/someone',
    }
    expect(t.linkedinUrl).toBe('https://linkedin.com/in/someone')
  })
})
```

- [ ] **Step 2: Run — confirm it fails**

```bash
npm run test:run
```

Expected: FAIL — `Testimonial` not exported from `../types`.

- [ ] **Step 3: Add `Testimonial` interface to `src/types/index.ts`**

Open `src/types/index.ts`. After the `Certification` interface and before the `Portfolio` interface, add:

```ts
export interface Testimonial {
  name: string
  title: string
  company: string
  relationship: string
  date: string
  text: string
  linkedinUrl?: string
}
```

Then add `testimonials: Testimonial[]` inside the `Portfolio` interface, after `certifications: Certification[]`:

```ts
testimonials: Testimonial[]
```

- [ ] **Step 4: Run — confirm tests pass**

```bash
npm run test:run
```

Expected: PASS.

- [ ] **Step 5: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: one error — `portfolio-data.ts` missing `testimonials` on `Portfolio`. This is expected and fixed in Task 2.

- [ ] **Step 6: Commit**

```bash
git add src/types/index.ts src/components/Testimonials.test.tsx
git commit -m "feat: add Testimonial type to types/index.ts"
```

---

### Task 2: Add testimonials data to `portfolio-data.ts`

**Files:**
- Modify: `src/data/portfolio-data.ts`

- [ ] **Step 1: Add the `testimonials` array**

Open `src/data/portfolio-data.ts`. Add the following as the last property inside the `data` object (after `certifications: [...]`). No import change needed — TypeScript infers element types from `Portfolio`.

```ts
  testimonials: [
    {
      name: 'Rahul Bajaj',
      title: 'Senior Manager — Supply Chain Planning',
      company: 'o9 Solutions',
      relationship: 'Rahul managed Deepak directly',
      date: 'April 2025',
      linkedinUrl: 'https://www.linkedin.com/in/dpkpr1/details/recommendations/?detailScreenTabIndex=0',
      text: 'I had the pleasure of working with Deepak during our joint stint at o9, and his technical/programming expertise was truly top-notch. He consistently delivered clean, efficient solutions and approached every challenge with a thoughtful, problem-solving mindset. He has a very high ability of exploring new technologies to solve a problem. Beyond technical skill, Deepak is a great team player—reliable and always ready to help others. His contribution made a real difference, and I\'d highly recommend him for any role that values strong programming skill and collaboration.',
    },
    {
      name: 'Yashad Kasar',
      title: 'Product Manager — Supply Chain',
      company: 'o9 Solutions',
      relationship: 'Yashad was senior to Deepak',
      date: 'June 2020',
      linkedinUrl: 'https://www.linkedin.com/in/dpkpr1/details/recommendations/?detailScreenTabIndex=0',
      text: 'Worked with Deepak on Industry Solutions projects at o9. I find him to be an extremely diligent, hard working and focused person. He is also a team player and I have experienced it first hand. His development skills are great and he is surely an asset for any team he works with.',
    },
    {
      name: 'Vinayak Samant',
      title: 'Consultant — Supply Chain Product Management, Development & Implementations',
      company: 'o9 Solutions',
      relationship: 'Vinayak managed Deepak directly',
      date: 'March 2020',
      linkedinUrl: 'https://www.linkedin.com/in/dpkpr1/details/recommendations/?detailScreenTabIndex=0',
      text: 'Deepak played the role of a developer in our team. He was very diligent, hard-working and always enthusiastic about learning new technologies. His hunger for knowledge and skills is very visible while working with him. He is also very flexible with work and owns up the complete software development included testing to a great extent. This is a very rare combination I have seen. Any dev assignment was delivered with very high quality in terms of both code and usability (UI perspective).',
    },
    {
      name: 'Dhanesh Pai',
      title: 'Project Manager',
      company: 'PrimeSoft IP Solutions',
      relationship: 'Dhanesh managed Deepak directly',
      date: 'March 2018',
      text: 'I have known Deepak in my capacity as his Project Manager for over two years, during which he worked on cloud-native application backend and frontend development. He is proficient in Java, Python, C/C++, and AngularJS and is a full stack developer. Deepak is a quick learner and hardworking — consistently the top performer in my team. He is highly intelligent with strong analytical skills and excellent communication skills; his written work is both clear and concise. He is an excellent team player who has helped team members during shortfalls and crisis situations, actively participated in sprint planning and standups, and is skilled at pushing back professionally when needed. He went well beyond project requirements in quantity and quality, completing additional research and professional certifications throughout. Deepak demonstrated great perseverance and initiative in all fields — he has my highest endorsement.',
    },
  ],
```

- [ ] **Step 2: TypeScript check — must pass cleanly**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/portfolio-data.ts
git commit -m "feat: add testimonials data to portfolio-data.ts"
```

---

### Task 3: Create `Testimonials` component + responsive CSS

**Files:**
- Create: `src/components/Testimonials.tsx`
- Modify: `src/styles/global.css`
- Modify: `src/components/Testimonials.test.tsx`

- [ ] **Step 1: Add `.testimonials-grid` breakpoint to `global.css`**

Open `src/styles/global.css`. In the existing `@media (max-width: 900px)` block (which contains `.about-grid`, `.exp-grid`, etc.), add:

```css
  .testimonials-grid { grid-template-columns: 1fr !important; }
```

- [ ] **Step 2: Write the failing component tests**

Open `src/components/Testimonials.test.tsx` and replace its entire contents with:

```tsx
import { render, screen } from '@testing-library/react'
import { Testimonials } from './Testimonials'

describe('Testimonials', () => {
  beforeEach(() => render(<Testimonials />))

  it('renders the section heading', () => {
    expect(screen.getByText(/what colleagues say/i)).toBeInTheDocument()
  })

  it('renders all four testimonial names', () => {
    expect(screen.getByText('Rahul Bajaj')).toBeInTheDocument()
    expect(screen.getByText('Yashad Kasar')).toBeInTheDocument()
    expect(screen.getByText('Vinayak Samant')).toBeInTheDocument()
    expect(screen.getByText('Dhanesh Pai')).toBeInTheDocument()
  })

  it('renders LinkedIn links only for LinkedIn recommendations', () => {
    const links = screen.getAllByRole('link', { name: /view on linkedin/i })
    expect(links).toHaveLength(3)
    links.forEach(link => {
      expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/dpkpr1/details/recommendations/?detailScreenTabIndex=0')
      expect(link).toHaveAttribute('target', '_blank')
    })
  })

  it('does not render a LinkedIn link for the LOR testimonial', () => {
    const dhaneshCard = screen.getByText('Dhanesh Pai').closest('div')
    const link = dhaneshCard?.querySelector('a')
    expect(link).toBeNull()
  })
})
```

- [ ] **Step 3: Run — confirm tests fail**

```bash
npm run test:run
```

Expected: FAIL — `Testimonials` not found.

- [ ] **Step 4: Create `src/components/Testimonials.tsx`**

```tsx
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
```

- [ ] **Step 5: Run — confirm all tests pass**

```bash
npm run test:run
```

Expected: all tests PASS (including previous Hero and PostModal tests).

- [ ] **Step 6: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/Testimonials.tsx src/components/Testimonials.test.tsx src/styles/global.css
git commit -m "feat: add Testimonials section component"
```

---

### Task 4: Wire into Nav and Home

**Files:**
- Modify: `src/components/Nav.tsx`
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: Add `'testimonials'` to Nav SECTIONS**

Open `src/components/Nav.tsx`. Line 5 currently reads:

```ts
const SECTIONS = ['about', 'experience', 'projects', 'skills', 'education', 'certifications', 'blog', 'contact']
```

Change it to:

```ts
const SECTIONS = ['about', 'experience', 'projects', 'skills', 'education', 'certifications', 'testimonials', 'blog', 'contact']
```

- [ ] **Step 2: Add `<Testimonials />` to Home.tsx**

Open `src/pages/Home.tsx`. Add the import after the `Certifications` import:

```tsx
import { Testimonials } from '../components/Testimonials'
```

Then add `<Testimonials />` between `<Certifications />` and `<BlogLink />`:

```tsx
<Certifications />
<Testimonials />
<BlogLink />
```

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Run all tests**

```bash
npm run test:run
```

Expected: all tests PASS.

- [ ] **Step 5: Smoke test in browser**

```bash
npm run dev
```

1. Load `http://localhost:5173`
2. Confirm "TESTIMONIALS" appears in the nav between "CERTIFICATIONS" and "BLOG"
3. Click "TESTIMONIALS" in nav — page scrolls to the section
4. Confirm 4 cards render: Rahul Bajaj, Yashad Kasar, Vinayak Samant, Dhanesh Pai
5. Confirm first 3 cards have "View on LinkedIn →" link; Dhanesh Pai card has no link
6. Resize to mobile — confirm cards stack to 1 column

- [ ] **Step 6: Commit**

```bash
git add src/components/Nav.tsx src/pages/Home.tsx
git commit -m "feat: wire Testimonials into Nav and Home"
```
