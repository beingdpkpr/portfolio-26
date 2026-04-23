# Dark / Light Mode — Design Spec

## Goal

Add a toggleable dark/light theme to the portfolio site with a fixed-corner toggle button, localStorage persistence, and `prefers-color-scheme` fallback.

## Architecture

A `data-theme` attribute on `<html>` controls the active theme. `global.css` defines all color tokens under `:root` (dark default) and `[data-theme="light"]` (light overrides). Inline styles across all components are converted from hardcoded hex/rgba to `var(--token)` strings. A `useTheme` hook manages toggle state and localStorage. No React context, no re-renders on theme switch — the browser handles all color transitions via CSS.

## Color Token Map

| Token | Dark | Light |
|---|---|---|
| `--bg` | `#08080a` | `#f0f0f0` |
| `--bg-nav` | `rgba(8,8,10,0.92)` | `rgba(240,240,240,0.92)` |
| `--bg-overlay` | `rgba(8,8,10,0.94)` | `rgba(240,240,240,0.94)` |
| `--bg-mobile-menu` | `rgba(8,8,10,0.97)` | `rgba(240,240,240,0.97)` |
| `--fg` | `#ffffff` | `#111111` |
| `--fg-inv` | `#000000` | `#ffffff` |
| `--text-2` | `#888888` | `#555555` |
| `--text-3` | `#555555` | `#888888` |
| `--text-4` | `#444444` | `#999999` |
| `--text-5` | `#333333` | `#aaaaaa` |
| `--border` | `rgba(255,255,255,0.06)` | `rgba(0,0,0,0.10)` |
| `--border-2` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.12)` |
| `--fill-subtle` | `rgba(255,255,255,0.03)` | `rgba(0,0,0,0.04)` |
| `--fill-code` | `rgba(255,255,255,0.04)` | `rgba(0,0,0,0.05)` |
| `--fill-hover` | `rgba(255,255,255,0.10)` | `rgba(0,0,0,0.08)` |
| `--selection` | `rgba(255,255,255,0.15)` | `rgba(0,0,0,0.12)` |
| `--error` | `#c0392b` | `#c0392b` |

These tokens cover every hardcoded color found in the codebase. The `--text-3` / `--text-4` / `--text-5` intentionally invert lightness: what was dim (#555, #444, #333) in dark mode becomes the prominent shade in light mode.

## Files Changed

| File | Change |
|---|---|
| `src/styles/global.css` | Add full token set to `:root`, add `[data-theme="light"]` overrides, add `transition: background 0.2s, color 0.2s` to `body` |
| `src/hooks/useTheme.ts` | New hook — reads/writes `localStorage('dp_theme')`, falls back to `prefers-color-scheme`, toggles `data-theme` on `<html>` |
| `src/components/ui/ThemeToggle.tsx` | New component — fixed bottom-right 44×44px circle button, 🌙/☀️ icon, calls `useTheme` |
| `src/pages/Home.tsx` | Render `<ThemeToggle />` |
| `src/pages/Blog.tsx` | Render `<ThemeToggle />` |
| `src/components/Nav.tsx` | Convert all hardcoded colors to `var(--token)` |
| `src/components/Hero.tsx` | Convert all hardcoded colors to `var(--token)` |
| `src/components/About.tsx` | Convert all hardcoded colors to `var(--token)` |
| `src/components/Experience.tsx` | Convert all hardcoded colors to `var(--token)` |
| `src/components/Projects.tsx` | Convert all hardcoded colors to `var(--token)` |
| `src/components/Skills.tsx` | Convert all hardcoded colors to `var(--token)` |
| `src/components/Education.tsx` | Convert all hardcoded colors to `var(--token)` |
| `src/components/Certifications.tsx` | Convert all hardcoded colors to `var(--token)` |
| `src/components/Testimonials.tsx` | Convert all hardcoded colors to `var(--token)` |
| `src/components/BlogLink.tsx` | Convert all hardcoded colors to `var(--token)` |
| `src/components/Contact.tsx` | Convert all hardcoded colors to `var(--token)` |
| `src/components/Footer.tsx` | Convert all hardcoded colors to `var(--token)` |
| `src/components/PostModal.tsx` | Convert all hardcoded colors to `var(--token)` |
| `src/components/CodeBlock.tsx` | Convert all hardcoded colors to `var(--token)` |

## ThemeToggle Component

- Position: `fixed`, `bottom: 24px`, `right: 24px`, `zIndex: 1100`
- Size: 44×44px circle (`borderRadius: '50%'`)
- Background: `var(--fill-hover)`, border: `1px solid var(--border)`
- Icon: `🌙` when dark, `☀️` when light (font-size 18px)
- `aria-label`: `"Switch to light mode"` / `"Switch to dark mode"`
- Transition: `background 0.2s`

## useTheme Hook

```ts
// Returns { theme: 'dark' | 'light', toggleTheme: () => void }
// Init: localStorage('dp_theme') ?? prefers-color-scheme ?? 'dark'
// On toggle: flip state, set document.documentElement.setAttribute('data-theme', next), localStorage.setItem('dp_theme', next)
// On init: apply saved/detected theme immediately (runs before first paint via useLayoutEffect)
```

## Excluded Hardcoded Colors

- `#c0392b` (error red in Contact form) — same in both themes, no token substitution needed
- `#e0e0e0` (Résumé button hover in Nav) — this is the light-mode button hover color; it maps to `--fg-inv` hover computed value. In the implementation, replace with a slightly-off-white computed from `--fg-inv`.

## Testing

- `useTheme.test.ts`: initial theme from localStorage, initial theme from `prefers-color-scheme`, toggle updates `data-theme` attribute and localStorage
- `ThemeToggle.test.tsx`: renders correct icon per theme, `aria-label` updates on toggle, click calls toggle
