# Testimonials Section — Design Spec

**Date:** 2026-04-23  
**Author:** Deepak Kumar Prasad  
**Status:** Approved

## Goal

Add a Testimonials section to the portfolio displaying three LinkedIn recommendations, positioned between Certifications and BlogLink.

## Architecture

Follows the exact pattern of existing sections: numbered label + h2 + `Reveal` wrappers + data from `portfolio-data.ts`. New `Testimonial` type added to `src/types/index.ts`. New `testimonials` array added to `Portfolio` interface and `portfolio-data.ts`. New `Testimonials` component in `src/components/Testimonials.tsx`. Section added to `Home.tsx` and `Nav.tsx`.

## Data

Three testimonials from LinkedIn recommendations:

### Rahul Bajaj
- **Title:** Senior Manager — Supply Chain Planning
- **Company:** o9 Solutions
- **Relationship:** Rahul managed Deepak directly
- **Date:** April 2025
- **Text:**
  > "I had the pleasure of working with Deepak during our joint stint at o9, and his technical/programming expertise was truly top-notch. He consistently delivered clean, efficient solutions and approached every challenge with a thoughtful, problem-solving mindset. He has a very high ability of exploring new technologies to solve a problem.
  >
  > Beyond technical skill, Deepak is a great team player—reliable and always ready to help others. His contribution made a real difference, and I'd highly recommend him for any role that values strong programming skill and collaboration."

### Yashad Kasar
- **Title:** Product Manager — Supply Chain
- **Company:** o9 Solutions
- **Relationship:** Yashad was senior to Deepak
- **Date:** June 2020
- **Text:**
  > "Worked with Deepak on Industry Solutions projects at o9. I find him to be an extremely diligent, hard working and focused person. He is also a team player and I have experienced it first hand. His development skills are great and he is surely an asset for any team he works with."

### Vinayak Samant
- **Title:** Consultant — Supply Chain Product Management, Development & Implementations
- **Company:** o9 Solutions
- **Relationship:** Vinayak managed Deepak directly
- **Date:** March 2020
- **Text:**
  > "Deepak played the role of a developer in our team. He was very diligent, hard-working and always enthusiastic about learning new technologies. His hunger for knowledge and skills is very visible while working with him. He is also very flexible with work and owns up the complete software development included testing to a great extent. This is a very rare combination I have seen. Any dev assignment was delivered with very high quality in terms of both code and usability (UI perspective)."

## Type Definition

Add to `src/types/index.ts`:

```ts
export interface Testimonial {
  name: string
  title: string
  company: string
  relationship: string
  date: string
  text: string
}
```

Add to `Portfolio` interface:
```ts
testimonials: Testimonial[]
```

## Component: `src/components/Testimonials.tsx`

- Section `id="testimonials"`, padding matches other sections (`120px clamp(16px,8vw,140px)`), `borderTop: '1px solid rgba(255,255,255,0.06)'`
- Section label: `07 / Testimonials` (Space Mono, 11px, uppercase, muted)
- h2: "What colleagues say" (Space Grotesk, 800 weight, clamp font size)
- Grid: 3 columns desktop (`repeat(3, 1fr)`), 1 column mobile via `.testimonials-grid` CSS class in `global.css`
- Each card:
  - Border: `1px solid rgba(255,255,255,0.06)`
  - Padding: `32px`
  - Opening quote `"` in Space Grotesk, 64px, `rgba(255,255,255,0.08)`, margin-bottom 16px
  - Quote text: Inter, 14px, `#888`, line-height 1.8, margin-bottom 24px
  - Name: Space Grotesk, 700, 15px, `#fff`
  - Title + Company: Inter, 13px, `#555`, margin-top 4px
  - Relationship + Date: Space Mono, 10px, `#333`, margin-top 4px
  - "View on LinkedIn →" link at bottom: Space Mono, 10px, `#555`, href `https://linkedin.com/in/dpkpr1`, target `_blank`, hover color `#fff`

## Navigation

Add `'testimonials'` to the `SECTIONS` array in `src/components/Nav.tsx` (between `'certifications'` and `'blog'`).

## Home.tsx

Import and render `<Testimonials />` between `<Certifications />` and `<BlogLink />`.

## global.css

Add responsive rule:
```css
@media (max-width: 900px) {
  .testimonials-grid { grid-template-columns: 1fr !important; }
}
```

## File Map

| File | Action |
|---|---|
| `src/types/index.ts` | Add `Testimonial` interface, add `testimonials` to `Portfolio` |
| `src/data/portfolio-data.ts` | Add `testimonials` array with 3 entries |
| `src/components/Testimonials.tsx` | Create new section component |
| `src/components/Nav.tsx` | Add `'testimonials'` to SECTIONS |
| `src/pages/Home.tsx` | Import and render `<Testimonials />` |
| `src/styles/global.css` | Add `.testimonials-grid` responsive rule |

## Out of Scope
- Dynamic LinkedIn API integration
- Testimonial photos/avatars
- More than 3 testimonials
