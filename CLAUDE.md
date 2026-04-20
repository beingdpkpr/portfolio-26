# Deepak Kumar Prasad — Portfolio

Personal portfolio site for Deepak Kumar Prasad, Senior Application Architect.

## Stack

| Concern | Choice |
|---|---|
| Build | Vite |
| UI | React 18 + TypeScript |
| Routing | react-router-dom v6 |
| Blog | Markdown files via gray-matter + react-markdown |
| Contact form | EmailJS (sends to deepak.prasad.ai@gmail.com) |
| Styling | CSS Modules + global.css (inline styles preserved from design) |
| Hosting | Static — GitHub Pages / Netlify / Vercel |

## Project Structure

```
portfolio-26/
├── public/
│   ├── assets/              # headshot.jpg
│   └── uploads/             # resume PDF, certificate images
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Reveal.tsx         # scroll-triggered fade-in wrapper
│   │   │   ├── SkillBar.tsx       # animated dot + label
│   │   │   └── SectionHeader.tsx  # "01 / About" label + h2
│   │   ├── Nav.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Experience.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   ├── Education.tsx
│   │   ├── Certifications.tsx
│   │   ├── BlogLink.tsx           # "Open Blog" card on main page
│   │   ├── Contact.tsx            # form + EmailJS
│   │   └── Footer.tsx
│   ├── content/
│   │   └── blog/                  # one .md file per post
│   ├── data/
│   │   └── portfolio-data.ts      # single source of truth for all content
│   ├── hooks/
│   │   ├── useInView.ts           # IntersectionObserver → visible boolean
│   │   ├── useActiveSection.ts    # tracks active nav section on scroll
│   │   └── useTypingEffect.ts     # hero typewriter animation
│   ├── lib/
│   │   ├── emailjs.ts             # EmailJS wrapper
│   │   └── markdown.ts            # gray-matter + react-markdown helpers
│   ├── pages/
│   │   ├── Home.tsx               # renders all portfolio sections in order
│   │   └── Blog.tsx               # blog listing page + post modal/route
│   ├── styles/
│   │   └── global.css             # reset, CSS vars, keyframes, scrollbar
│   ├── types/
│   │   └── index.ts               # all shared TypeScript interfaces
│   ├── App.tsx                    # react-router-dom routes
│   └── main.tsx                   # Vite entry point
├── CLAUDE.md                      # this file
├── index.html
├── tsconfig.json
├── vite.config.ts
└── package.json
```

## TypeScript Types

All interfaces live in `src/types/index.ts`. Never use `any`.

```ts
interface Experience      { title, company, period, duration, location, bullets[] }
interface Project         { title, tags[], description, highlight }
interface SkillGroup      { category, items[] }
interface AcademicProject { title, description, tech }
interface Education       { degree, institution, year, detail, gpa, projects[]?, achievements[]? }
interface Certification   { name, issuer, year, type: 'course'|'specialization', verify, courses[]? }
interface BlogFrontmatter { title, date, tag, excerpt, readTime }
interface Portfolio       { name, title, tagline, email, phone, linkedin, github, location, about,
                            experience[], projects[], skills[], education[], certifications[] }
```

## Content Updates

**To update personal info / career data:** edit `src/data/portfolio-data.ts` only — it is the single source of truth. No other file holds content.

**To add a blog post:** create `src/content/blog/<slug>.md` with this frontmatter:
```md
---
title: "Post Title"
date: "Jan 2025"
tag: "Architecture"
excerpt: "One-sentence summary shown on the listing page."
readTime: "5 min read"
---

Post body in Markdown here.
```
The post appears automatically on the blog listing page — no code changes needed.

## Contact Form

Uses **EmailJS**. Credentials are stored as environment variables — never hardcoded:
```
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```
For local dev, put these in `.env.local` (gitignored). For production, set them as environment variables in Netlify/Vercel dashboard.

## Routing

| Path | Component |
|---|---|
| `/` | `Home.tsx` — all portfolio sections |
| `/blog` | `Blog.tsx` — listing page |
| `/blog/:slug` | `Blog.tsx` — same page, post modal opens |

Uses `HashRouter` for GitHub Pages compatibility (no server config needed). Use `BrowserRouter` on Netlify/Vercel.

## Build & Deploy

```bash
npm run dev      # local dev server (Vite HMR)
npm run build    # TypeScript check + Vite build → dist/
npm run preview  # preview the dist/ output locally
```

`dist/` is fully static — drop it on any host. For GitHub Pages, set the `base` in `vite.config.ts` to the repo name if deploying to a subpath.

## Design Conventions

- **One component per file.** No multi-component files.
- **No magic strings.** All content from `portfolio-data.ts`, all colours from CSS vars.
- **CSS custom properties** for theming: `--accent`, `--bg` defined in `global.css`.
- **No comments explaining what code does.** Names should be self-explanatory. Only add a comment for a non-obvious *why*.
- **Responsive breakpoints** via CSS classes `.about-grid`, `.exp-grid`, `.contact-grid` etc. — defined in `global.css`, applied as `className` on the element.

## Key Dependencies

```json
{
  "react": "^18",
  "react-dom": "^18",
  "react-router-dom": "^6",
  "react-markdown": "^9",
  "gray-matter": "^4",
  "@emailjs/browser": "^4",
  "remark-gfm": "^4"
}
```

Dev:
```json
{
  "vite": "^5",
  "@vitejs/plugin-react": "^4",
  "typescript": "^5"
}
```
