# Visitor Notification Email — Design Spec

**Date:** 2026-04-23  
**Author:** Deepak Kumar Prasad  
**Status:** Approved

## Goal

Send an email to the site owner the first time a new visitor lands on the portfolio, including their IP address, city, country, ISP, browser, and timestamp.

## Approach

Client-side first-visit detection using `localStorage`, IP geolocation via the free `ipapi.co` API (no API key required), and EmailJS for delivery using a dedicated new template. Reuses the `@emailjs/browser` package already installed.

## Data Flow

1. `App.tsx` mounts → `useEffect` runs once
2. Check `localStorage.getItem('dp_visited')`
3. If already set → exit, do nothing
4. Fetch `https://ipapi.co/json/` → returns `{ ip, city, country_name, org }`
5. Call `sendVisitorAlert()` with visitor details + `navigator.userAgent` + `window.location.href`
6. `localStorage.setItem('dp_visited', '1')` — set regardless of email success/failure
7. Any error → silently swallowed, visitor experience unaffected

## Code Changes

### `src/lib/emailjs.ts`
Add a new exported interface and function alongside the existing ones:

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

export async function sendVisitorAlert(payload: VisitorPayload): Promise<void>
```

Uses a separate env var `VITE_EMAILJS_VISITOR_TEMPLATE_ID` so the visitor template is independent of the contact form template.

### `src/App.tsx`
Add a `useEffect` with an empty dependency array that runs the first-visit logic on mount. No new component or file needed.

## EmailJS Template Setup (manual step)

Create a new template in the EmailJS dashboard with these template variables:

| Variable | Example value |
|---|---|
| `visitor_ip` | 203.0.113.42 |
| `visitor_city` | Dallas |
| `visitor_country` | United States |
| `visitor_isp` | AS7922 Comcast |
| `visitor_ua` | Mozilla/5.0 ... Chrome/124 |
| `visited_at` | 2026-04-23T10:32:00.000Z |
| `page_url` | https://beingdpkpr.github.io/deepak-prasad/ |

Suggested subject line: `New visitor on your portfolio — {{visitor_city}}, {{visitor_country}}`

## Environment Variables

| Variable | Where |
|---|---|
| `VITE_EMAILJS_VISITOR_TEMPLATE_ID` | `.env.local` (dev) + Netlify/Vercel dashboard (prod) |

Existing `VITE_EMAILJS_SERVICE_ID` and `VITE_EMAILJS_PUBLIC_KEY` are reused — no new credentials needed.

## Error Handling

- IP API failure → skip email, set localStorage flag, continue silently
- EmailJS failure → set localStorage flag, continue silently
- No error is surfaced to the visitor under any circumstance

## Limitations

- Detection is per-browser/device via `localStorage`. Incognito mode or a cleared browser will re-trigger the notification.
- `ipapi.co` free tier allows 30,000 requests/month — sufficient for a personal portfolio.

## Out of Scope

- Server-side visit logging
- Deduplication across browsers/devices
- Notification throttling (e.g. max one email per hour)
