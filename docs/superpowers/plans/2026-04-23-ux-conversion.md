# UX Conversion Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Download Resume button to the Hero CTA row and a reading progress bar to the blog post modal, with a Vitest + React Testing Library test suite for future-proofing.

**Architecture:** Two fully independent UI changes — one `<a>` tag appended to an existing button row in Hero.tsx, and a sticky scroll-tracking bar added to PostModal.tsx via a ref + onScroll handler. Task 0 installs the test framework shared by both feature tasks.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, @testing-library/react, jsdom

---

## File Map

| File | Action | What changes |
|---|---|---|
| `package.json` | Modify | Add vitest, @testing-library/react, @testing-library/jest-dom, jsdom as devDependencies |
| `vite.config.ts` | Modify | Add `test` block with jsdom environment |
| `src/test/setup.ts` | Create | Import @testing-library/jest-dom matchers |
| `src/components/Hero.tsx` | Modify | Add résumé `<a>` button as third item in CTA row |
| `src/components/Hero.test.tsx` | Create | Tests for resume button rendering |
| `src/components/PostModal.tsx` | Modify | Add `scrollRef`, `progress` state, `handleScroll`, sticky progress bar |
| `src/components/PostModal.test.tsx` | Create | Tests for progress bar initial state |

---

### Task 0: Set up Vitest + React Testing Library

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Install test dependencies**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Expected: packages added to `node_modules`, no errors.

- [ ] **Step 2: Add test script to package.json**

Open `package.json` and add `"test": "vitest"` and `"test:run": "vitest run"` to the `scripts` block:

```json
{
  "name": "portfolio-26",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run"
  },
  "dependencies": {
    "@emailjs/browser": "^4",
    "react": "^18",
    "react-dom": "^18",
    "react-markdown": "^9",
    "react-router-dom": "^6",
    "gray-matter": "^4",
    "remark-gfm": "^4"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6",
    "@testing-library/react": "^16",
    "@testing-library/user-event": "^14",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@vitejs/plugin-react": "^4",
    "jsdom": "^26",
    "typescript": "^5",
    "vite": "^5",
    "vitest": "^3"
  }
}
```

- [ ] **Step 3: Configure Vitest in vite.config.ts**

Replace the entire contents of `vite.config.ts` with:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/deepak-prasad/',
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    globals: true,
  },
})
```

- [ ] **Step 4: Create the test setup file**

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors. (If TS complains about `test` in vite.config, add `/// <reference types="vitest" />` at the top of `vite.config.ts`.)

- [ ] **Step 6: Run the (empty) test suite to confirm setup works**

```bash
npm run test:run
```

Expected: `No test files found` or 0 tests, 0 failures — no crashes.

- [ ] **Step 7: Commit**

```bash
git add package.json vite.config.ts src/test/setup.ts
git commit -m "chore: add Vitest + React Testing Library"
```

---

### Task 1: Add Download Resume button to Hero

**Files:**
- Modify: `src/components/Hero.tsx`
- Create: `src/components/Hero.test.tsx`

- [ ] **Step 1: Read the current file**

Read `src/components/Hero.tsx` in full to locate the CTA button row (the `<div>` with `display: 'flex', gap: 16` containing "VIEW WORK" and "GET IN TOUCH").

- [ ] **Step 2: Write the failing test first**

Create `src/components/Hero.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Hero } from './Hero'

function renderHero() {
  return render(
    <MemoryRouter>
      <Hero />
    </MemoryRouter>
  )
}

describe('Hero', () => {
  it('renders a résumé download link', () => {
    renderHero()
    const link = screen.getByRole('link', { name: /résumé/i })
    expect(link).toBeInTheDocument()
  })

  it('résumé link has download attribute', () => {
    renderHero()
    const link = screen.getByRole('link', { name: /résumé/i })
    expect(link).toHaveAttribute('download', 'Deepak_Kumar_Prasad_Resume.pdf')
  })

  it('résumé link points to the PDF', () => {
    renderHero()
    const link = screen.getByRole('link', { name: /résumé/i })
    expect(link.getAttribute('href')).toContain('deepak_prasad_26.pdf')
  })
})
```

- [ ] **Step 3: Run the tests — confirm they fail**

```bash
npm run test:run
```

Expected: 3 tests FAIL with "Unable to find role link".

- [ ] **Step 4: Add the résumé button to Hero.tsx**

Add the following `<a>` element as the third child of the CTA flex div (after "GET IN TOUCH"):

```tsx
<a
  href={`${import.meta.env.BASE_URL}assets/deepak_prasad_26.pdf`}
  download="Deepak_Kumar_Prasad_Resume.pdf"
  style={{
    background: 'transparent', color: '#fff',
    border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer',
    padding: '14px 32px', fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700, fontSize: 14, letterSpacing: '0.05em',
    textDecoration: 'none', transition: 'all 0.2s', display: 'inline-block',
  }}
  onMouseEnter={e => (e.currentTarget.style.borderColor = '#fff')}
  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}
>
  RÉSUMÉ ↓
</a>
```

The full updated CTA div:

```tsx
<div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', animation: 'fadeUp 0.8s ease 0.4s both' }}>
  <button onClick={() => scrollTo('experience')} style={{
    background: '#fff', color: '#000', border: 'none', cursor: 'pointer',
    padding: '14px 32px', fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700, fontSize: 14, letterSpacing: '0.05em', transition: 'all 0.2s',
  }}
    onMouseEnter={e => (e.currentTarget.style.background = '#e0e0e0')}
    onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
    VIEW WORK ↓
  </button>
  <button onClick={() => scrollTo('contact')} style={{
    background: 'transparent', color: '#fff',
    border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer',
    padding: '14px 32px', fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700, fontSize: 14, letterSpacing: '0.05em', transition: 'all 0.2s',
  }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = '#fff')}
    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}>
    GET IN TOUCH
  </button>
  <a
    href={`${import.meta.env.BASE_URL}assets/deepak_prasad_26.pdf`}
    download="Deepak_Kumar_Prasad_Resume.pdf"
    style={{
      background: 'transparent', color: '#fff',
      border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer',
      padding: '14px 32px', fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 700, fontSize: 14, letterSpacing: '0.05em',
      textDecoration: 'none', transition: 'all 0.2s', display: 'inline-block',
    }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = '#fff')}
    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}
  >
    RÉSUMÉ ↓
  </a>
</div>
```

- [ ] **Step 5: Run tests — confirm they pass**

```bash
npm run test:run
```

Expected: 3 tests PASS.

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Smoke test in browser**

```bash
npm run dev
```

1. Load `http://localhost:5173`
2. Confirm three buttons in Hero: "VIEW WORK ↓", "GET IN TOUCH", "RÉSUMÉ ↓"
3. Hover RÉSUMÉ ↓ — border brightens to white
4. Click RÉSUMÉ ↓ — browser downloads `Deepak_Kumar_Prasad_Resume.pdf`

- [ ] **Step 8: Commit**

```bash
git add src/components/Hero.tsx src/components/Hero.test.tsx
git commit -m "feat: add download resume button to Hero CTA row"
```

---

### Task 2: Add reading progress bar to PostModal

**Files:**
- Modify: `src/components/PostModal.tsx`
- Create: `src/components/PostModal.test.tsx`

- [ ] **Step 1: Read the current file**

Read `src/components/PostModal.tsx` in full. Note:
- Imports: `useEffect`, `useRef` from React (line 1)
- Outer overlay div (the scroll container): `position: fixed, inset: 0, zIndex: 2000, overflow: auto` (line 38)
- Inner content div: `maxWidth: 760, margin: '0 auto'` (line 42)

- [ ] **Step 2: Write the failing tests first**

Create `src/components/PostModal.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PostModal } from './PostModal'
import type { BlogPost } from '../types'

const mockPost: BlogPost = {
  slug: 'test-post',
  title: 'Test Post',
  date: 'Jan 2025',
  tag: 'Architecture',
  excerpt: 'A test post.',
  readTime: '2 min read',
  content: 'Hello world',
}

function renderModal() {
  return render(
    <MemoryRouter>
      <PostModal post={mockPost} posts={[mockPost]} onClose={() => {}} />
    </MemoryRouter>
  )
}

describe('PostModal', () => {
  it('renders the post title', () => {
    renderModal()
    expect(screen.getByText('Test Post')).toBeInTheDocument()
  })

  it('renders a progress bar track at initial 0% width', () => {
    renderModal()
    const bars = document.querySelectorAll('[style*="width: 0%"]')
    expect(bars.length).toBeGreaterThan(0)
  })

  it('renders the close button', () => {
    renderModal()
    expect(screen.getByText(/close/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run the tests — confirm they fail**

```bash
npm run test:run
```

Expected: "renders a progress bar track at initial 0% width" FAILS (bar not in DOM yet). The other two may pass already.

- [ ] **Step 4: Add useState to React import**

In `src/components/PostModal.tsx`, update line 1:

```tsx
import { useEffect, useRef, useState } from 'react'
```

- [ ] **Step 5: Add scrollRef, progress state, and handleScroll**

Inside the `PostModal` function body, add these lines directly after `const idx = posts.findIndex(...)`:

```tsx
const scrollRef = useRef<HTMLDivElement>(null)
const [progress, setProgress] = useState(0)

const handleScroll = () => {
  const el = scrollRef.current
  if (!el) return
  const pct = el.scrollTop / (el.scrollHeight - el.clientHeight)
  setProgress(isNaN(pct) ? 0 : pct)
}
```

- [ ] **Step 6: Attach ref and onScroll to the overlay div**

Update the outer overlay `<div>` to add `ref={scrollRef}` and `onScroll={handleScroll}`:

```tsx
<div
  ref={scrollRef}
  onScroll={handleScroll}
  style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(8,8,10,0.94)', backdropFilter: 'blur(16px)', overflow: 'auto' }}
  onClick={onClose}
>
```

- [ ] **Step 7: Add progress bar as first child of the overlay div**

Insert the following immediately after the opening overlay `<div>` tag, before the inner content div:

```tsx
<div style={{ position: 'sticky', top: 0, zIndex: 1, height: 2, background: 'rgba(255,255,255,0.08)' }}>
  <div style={{ height: '100%', width: `${progress * 100}%`, background: '#fff', transition: 'width 0.1s linear' }} />
</div>
```

The updated overlay div structure:

```tsx
<div
  ref={scrollRef}
  onScroll={handleScroll}
  style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(8,8,10,0.94)', backdropFilter: 'blur(16px)', overflow: 'auto' }}
  onClick={onClose}
>
  <div style={{ position: 'sticky', top: 0, zIndex: 1, height: 2, background: 'rgba(255,255,255,0.08)' }}>
    <div style={{ height: '100%', width: `${progress * 100}%`, background: '#fff', transition: 'width 0.1s linear' }} />
  </div>
  <div
    style={{ maxWidth: 760, margin: '0 auto', padding: '80px 24px 120px' }}
    onClick={e => e.stopPropagation()}
  >
    {/* all existing modal content unchanged */}
  </div>
</div>
```

- [ ] **Step 8: Run tests — confirm they all pass**

```bash
npm run test:run
```

Expected: all tests across Hero.test.tsx and PostModal.test.tsx PASS.

- [ ] **Step 9: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 10: Smoke test in browser**

1. Open any blog post modal
2. Confirm a faint 2px track at the very top of the modal
3. Scroll down — white bar grows left to right smoothly
4. Scroll to the bottom — bar reaches 100% width
5. Close and reopen another post — bar resets to 0%

- [ ] **Step 11: Commit**

```bash
git add src/components/PostModal.tsx src/components/PostModal.test.tsx
git commit -m "feat: add reading progress bar to blog post modal"
```
