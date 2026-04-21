# Google Analytics 4 — Design Spec

**Date:** 2026-04-21  
**Author:** Deepak Kumar Prasad  
**Status:** Approved

## Goal

Add basic traffic analytics (pageviews, unique visitors, geography, referrers) to the portfolio site using Google Analytics 4.

## Approach

Embed GA4's standard `gtag.js` snippet directly in `index.html`. No npm packages, no React code changes, no environment variables.

## Changes

### `index.html` — only file modified

Add two `<script>` tags inside `<head>`, after the font preconnect links:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Replace both instances of `G-XXXXXXXXXX` with the real Measurement ID from the GA4 property.

## Prerequisites

- GA4 property created at analytics.google.com
- Measurement ID (`G-XXXXXXXXXX`) obtained from the property settings

## Notes

- The Measurement ID is a **public identifier** — safe to commit directly into `index.html`. It is visible in page source by design.
- The `async` attribute on the loader script ensures zero impact on page load performance.
- Page tracking scope: GA4 will track the initial page load and navigation events. For the `HashRouter` SPA, hash-based route changes (`#/blog/:slug`) are captured as the same page — acceptable for basic traffic monitoring.
- No `.env` changes, no `vite.config.ts` changes, no new dependencies required.

## Out of Scope

- Custom event tracking (blog post reads, contact form submissions)
- SPA route-change tracking per hash segment
- Cookie consent banner (not legally required for a personal portfolio in most jurisdictions)
