# UX / Conversion Improvements — Design Spec

**Date:** 2026-04-23  
**Author:** Deepak Kumar Prasad  
**Status:** Approved

## Scope

Two self-contained UX improvements:

1. **Download Resume button in Hero** — one-click PDF download from the Hero CTA row
2. **Reading progress bar in PostModal** — sticky white bar tracking scroll position in blog posts

Dark/light mode is explicitly out of scope (separate effort).

---

## Feature 1: Download Resume Button in Hero

### Goal
Give recruiters immediate one-click resume access from the Hero section without scrolling to the Nav.

### Change
**File:** `src/components/Hero.tsx`

Add a third `<a>` element to the existing CTA button row (after "VIEW WORK" and "GET IN TOUCH"):

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

### Notes
- Same PDF path and filename as the Nav's existing RÉSUMÉ button
- Style mirrors "GET IN TOUCH" (transparent bg, white border, hover brightens border)
- No new component or file needed

---

## Feature 2: Reading Progress Bar in PostModal

### Goal
Show a thin white progress bar at the top of the blog post modal that fills as the reader scrolls, signalling content depth and engagement.

### Changes
**File:** `src/components/PostModal.tsx`

**State & ref:**
```ts
const scrollRef = useRef<HTMLDivElement>(null)
const [progress, setProgress] = useState(0)
```

**Scroll handler** (attached as `onScroll` to the overlay div):
```ts
const handleScroll = () => {
  const el = scrollRef.current
  if (!el) return
  const pct = el.scrollTop / (el.scrollHeight - el.clientHeight)
  setProgress(isNaN(pct) ? 0 : pct)
}
```

**Progress bar element** — rendered as the first child inside the overlay div, before all other content:
```tsx
<div style={{ position: 'sticky', top: 0, zIndex: 1, height: 2, background: 'rgba(255,255,255,0.08)' }}>
  <div style={{ height: '100%', width: `${progress * 100}%`, background: '#fff', transition: 'width 0.1s linear' }} />
</div>
```

**Updated overlay div** — add `ref` and `onScroll`:
```tsx
<div
  ref={scrollRef}
  onScroll={handleScroll}
  style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(8,8,10,0.94)', backdropFilter: 'blur(16px)', overflow: 'auto' }}
  onClick={onClose}
>
```

### Behaviour
- Bar width goes from `0%` (top) to `100%` (bottom of post)
- `transition: width 0.1s linear` gives smooth motion without lag
- `position: sticky; top: 0` pins the bar to the top of the scroll container as content scrolls beneath it
- `isNaN` guard handles edge case where post is too short to scroll (bar stays at 0)
- No changes to modal close/keyboard/navigation logic

---

## File Map

| File | Action |
|---|---|
| `src/components/Hero.tsx` | Add resume `<a>` button to CTA row |
| `src/components/PostModal.tsx` | Add `scrollRef`, `progress` state, `handleScroll`, progress bar element |

## Out of Scope
- Dark/light mode toggle
- Any changes to Nav, Blog, or other components
