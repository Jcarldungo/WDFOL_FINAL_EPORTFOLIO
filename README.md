# Jann Carl Dungo — Developer Portfolio (`jcdungoo20`)

A full-stack developer portfolio built with **Next.js (App Router)**, **TypeScript**,
and a hand-written CSS design system (Tailwind is present and bridged to the same
tokens, but the site's own stylesheets do the work).

**Full-Stack Developer · 4th Year BSIT · Holy Angel University · Web Development Major · Sapang Maisac, Mexico, Pampanga**

Live at <https://janncarl.vercel.app>.

## Stack

- Next.js 15 (App Router) + TypeScript
- CSS custom properties for every visual value (`app/styles/base/variables.css`)
- Tailwind CSS 3, bridged to those tokens in `tailwind.config.ts`
- `@emailjs/browser` for the contact form
- Deployed on Vercel

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build + type check
npm run lint
```

## Routes

| Route           | What it is                                                             |
| --------------- | ---------------------------------------------------------------------- |
| `/`             | The whole portfolio, as anchor-linked sections: `#home`, `#projects`, `#stack`, `#about`, `#experience`, `#contact` |
| `/work/[slug]`  | A full-screen case study per published project, with its own chrome     |
| `/sitemap.xml`  | Generated from the published project list                              |

## Where the content lives

Everything editorial is in **`lib/content.ts`** — projects, the toolkit, certifications,
experience, and `siteInfo`. No copy is hard-coded in components.

### Adding a project

1. Add an entry to `projects` in `lib/content.ts`.
2. Drop real screenshots in `public/images/work/`. They ship at the aspect
   recorded in `--shot-ratio` (`app/styles/base/variables.css`); capture at that
   ratio, or change the token once and every frame on the site follows.
3. Fill `screens`, `theBuild`, `whatItDoes`, `underTheHood`, `builtWith`.

Set `draft: true` to hold a project back. A draft is hidden everywhere — the
catalogue, the sitemap, and the detail routes. There is deliberately **no
placeholder card**: an empty slot on a portfolio reads worse than a shorter list.

## Styling conventions

- `app/styles/base/` — tokens, reset, type, keyframes
- `app/styles/layout/` — container, navbar, footer, cross-cutting breakpoints
- `app/styles/components/` — buttons, forms, ambient effects
- `app/styles/sections/` — one file per home section
- `app/styles/work/` — the case-study route

Breakpoints are documented in `app/styles/base/breakpoints.css`; use only those
values. Never hard-code a colour, space, or radius — add a token instead.
