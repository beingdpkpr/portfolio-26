# Visitor Notification Email Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Send an email to the site owner the first time a new visitor loads the portfolio, including their IP, city, country, ISP, browser, and timestamp.

**Architecture:** On app mount, check `localStorage` for a `dp_visited` flag. If absent, fetch geo data from `ipapi.co/json/` then send a visitor alert email via a new dedicated EmailJS template. Set the flag regardless of email success so the visitor experience is never interrupted.

**Tech Stack:** React 18, TypeScript, `@emailjs/browser` (already installed), `ipapi.co` free API (no key required)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/lib/emailjs.ts` | Modify | Add `VisitorPayload` interface + `sendVisitorAlert()` function |
| `src/App.tsx` | Modify | Add first-visit `useEffect` on mount |
| `.env.local` | Modify | Add `VITE_EMAILJS_VISITOR_TEMPLATE_ID` |

---

## Prerequisites (manual — do before coding)

1. Log in to [emailjs.com](https://emailjs.com) → Email Templates → **Create new template**
2. Set subject: `New visitor on your portfolio — {{visitor_city}}, {{visitor_country}}`
3. Set body to include all variables: `{{visitor_ip}}`, `{{visitor_city}}`, `{{visitor_country}}`, `{{visitor_isp}}`, `{{visitor_ua}}`, `{{visited_at}}`, `{{page_url}}`
4. Save the template — copy the **Template ID** (format: `template_xxxxxxx`)
5. Add to `.env.local`:
   ```
   VITE_EMAILJS_VISITOR_TEMPLATE_ID=template_xxxxxxx
   ```

---

### Task 1: Add `sendVisitorAlert` to `src/lib/emailjs.ts`

**Files:**
- Modify: `src/lib/emailjs.ts`

- [ ] **Step 1: Add `VisitorPayload` interface and `sendVisitorAlert` function**

Open `src/lib/emailjs.ts` and append the following after the existing `sendEmail` function (keep all existing code untouched):

```ts
export interface VisitorPayload {
  visitor_ip: string
  visitor_city: string
  visitor_country: string
  visitor_isp: string
  visitor_ua: string
  visited_at: string
  page_url: string
}

export async function sendVisitorAlert(payload: VisitorPayload): Promise<void> {
  const visitorTemplateId = import.meta.env.VITE_EMAILJS_VISITOR_TEMPLATE_ID as string | undefined
  if (!SERVICE_ID || !visitorTemplateId || !PUBLIC_KEY) return

  await emailjs.send(SERVICE_ID, visitorTemplateId, {
    visitor_ip:      payload.visitor_ip,
    visitor_city:    payload.visitor_city,
    visitor_country: payload.visitor_country,
    visitor_isp:     payload.visitor_isp,
    visitor_ua:      payload.visitor_ua,
    visited_at:      payload.visited_at,
    page_url:        payload.page_url,
  })
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/emailjs.ts
git commit -m "feat: add sendVisitorAlert to emailjs lib"
```

---

### Task 2: Add first-visit effect to `src/App.tsx`

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add the first-visit `useEffect`**

Replace the entire contents of `src/App.tsx` with:

```tsx
import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Blog } from './pages/Blog'
import { sendVisitorAlert } from './lib/emailjs'

const VISITED_KEY = 'dp_visited'

async function notifyFirstVisit(): Promise<void> {
  if (localStorage.getItem(VISITED_KEY)) return

  try {
    const res = await fetch('https://ipapi.co/json/')
    const geo = await res.json()
    await sendVisitorAlert({
      visitor_ip:      geo.ip ?? 'unknown',
      visitor_city:    geo.city ?? 'unknown',
      visitor_country: geo.country_name ?? 'unknown',
      visitor_isp:     geo.org ?? 'unknown',
      visitor_ua:      navigator.userAgent,
      visited_at:      new Date().toISOString(),
      page_url:        window.location.href,
    })
  } catch {
    // silently swallow — visitor experience must not be affected
  } finally {
    localStorage.setItem(VISITED_KEY, '1')
  }
}

export default function App() {
  useEffect(() => { notifyFirstVisit() }, [])

  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Blog />} />
      </Routes>
    </HashRouter>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Smoke test locally**

```bash
npm run dev
```

1. Open browser DevTools → Application → Local Storage → clear `dp_visited` if present
2. Load `http://localhost:5173`
3. Check Network tab — you should see a request to `ipapi.co/json/` and a request to `api.emailjs.com`
4. Check your inbox at `deepak.prasad.ai@gmail.com` for the visitor notification email
5. Reload the page — confirm no second email is sent (flag is set)

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: send visitor notification email on first visit"
```

---

### Task 3: Add env var to `.env.local`

**Files:**
- Modify: `.env.local`

- [ ] **Step 1: Add the visitor template ID**

Open `.env.local` and add:

```
VITE_EMAILJS_VISITOR_TEMPLATE_ID=template_xxxxxxx
```

Replace `template_xxxxxxx` with the real Template ID from the EmailJS dashboard.

> `.env.local` is gitignored — do not commit this file.

- [ ] **Step 2: Restart dev server**

Stop and restart `npm run dev` so Vite picks up the new env var.

- [ ] **Step 3: Re-run smoke test**

Repeat the smoke test from Task 2 Step 3 to confirm the email now arrives with all fields populated.

---

### Task 4: Production env var

- [ ] **Step 1: Add env var to your hosting dashboard**

If hosted on **Netlify**: Site settings → Environment variables → Add `VITE_EMAILJS_VISITOR_TEMPLATE_ID`

If hosted on **GitHub Pages via GitHub Actions**: Add as a repository secret and reference it in your workflow.

- [ ] **Step 2: Deploy and verify**

Deploy the site and visit it in an incognito window (to bypass any existing `localStorage` flag) and confirm the notification email arrives.
