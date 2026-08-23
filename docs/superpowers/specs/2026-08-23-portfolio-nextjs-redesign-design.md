# Portfolio Redesign — Professional/Product Feel + Next.js Rebuild — Design

**Date:** 2026-08-23
**Status:** Approved by user, ready for implementation planning
**Branch:** `nextjs-redesign` (worktree at `.worktrees/nextjs-redesign/`)

## Context

The portfolio (`jcdungo.vercel.app` / `janncarldungo.vercel.app`, repo
`WDFOL_FINAL_EPORTFOLIO`) currently reads as a **student portfolio**: emoji
used as UI icons throughout, a certificate image wall, a rotating-title
typewriter effect, floating skill badges, stat counters ("8+
Certifications", "HAU"), and a 6-page structure that duplicates the same
bio/contact/skills content across About and Resume.

Goal: rebuild it to read as a **professional developer / product
portfolio**, for a broad audience (internship recruiters, full-time
hiring managers, and freelance/direct clients equally) — while keeping the
monochrome dark/light palette that's already been confirmed twice as a
design constraint.

## Decisions made during brainstorming

| Decision | Choice |
|---|---|
| Stack | Rebuild in **Next.js (App Router) + Tailwind CSS** — not a same-stack redesign. User is currently learning this stack; matches the "professional" signal in the repo itself. |
| Color palette | **Keep monochrome**, both themes — not up for revisit. |
| Resume page | **Dropped as a dedicated page.** Duplicated About's content and was a "student portfolio" tell. Resume PDF stays downloadable (nav/footer + About). |
| Services page | **Folded into Home** as a short "What I do" section, not a standalone page. |
| Project case studies | **Stay at 2** (WeePlay, gastos). ATS/DentalCRM are represented only via the Skills section (Laravel/React/Inertia.js/Tailwind — already added 2026-08-23), not as case studies, since neither is deployed live and both are still WIP. |
| Certificates | **Compact text list** (name + issuer + verify link) — no image grid/lightbox. |
| Emoji as UI icons | **Dropped everywhere they act as icons** (section markers, contact detail rows, nav). Not a blanket ban on emoji as content, just as chrome. |
| Contact form | **Keep EmailJS** (not moving to a server-side API route). Implementation should also finally resolve which service ID is live (`service_t50fkkn` vs `service_6vyl1sy` — see `pages/contact.html`'s existing comment in the old repo) since that's been an open item since the last redesign. |
| Isolation | Work happens in git worktree `.worktrees/nextjs-redesign` on branch `nextjs-redesign`. `main` (production) is untouched until this is explicitly merged/pushed. |

## Site structure & navigation

Drops from 6 pages to 4:

- **Home** (`/`) — hero, "What I do" (absorbs Services), featured projects (WeePlay + gastos), closing CTA.
- **About** (`/about`) — bio, skills, experience timeline, certifications (compact list), resume PDF download.
- **Projects** (`/projects`) — project index; each case study becomes a real route (`/projects/[slug]`) instead of a JS-driven modal overlay — more linkable, better for SEO, more "product site."
- **Contact** (`/contact`) — form + contact info, plain labeled text instead of emoji-icon rows.

Nav: 4 items (Home / About / Projects / Contact), down from 6.

## Visual language

Move away from "portfolio starter kit" motifs (gradient-text headings,
emoji icons, floating badges, multiple competing decorative devices) toward:

- **Typography- and whitespace-led design.** A confident type scale
  (real size/weight contrast between hero, section heads, body) does more
  of the "professional" work than decoration.
- **One signature visual device, not several**: the `jann.js` code-snippet
  card is kept and refined as *the* motif — it's specific to this person,
  not generic. It should not compete with gradient text, badges, or icon
  soup.
- **No emoji as UI chrome** (see decisions table). A small monochrome
  line-icon set is acceptable if icons are needed at all, but plain
  typographic labels are the default.
- **Restrained motion** — purposeful reveal-on-scroll is fine; anything
  decorative-only competes with the "considered product" feel.
- **No rotating typewriter title** on Home — a single, confident title
  line instead. The rotating-phrase gimmick is another template signal.
- **Drop the stat-counter row** (Live Projects / Certifications / Year)
  from Home — reads as reassurance-seeking rather than confident.
  "Currently learning" strip is also dropped from Home for the same reason.

## Page-by-page content

### Home
- Hero: name, one clear title line, short description, primary CTAs
  (View Projects / Download Resume). `jann.js` snippet as the signature
  visual — update its `role`/`frontend`/`backend` fields to match current
  reality (Full-Stack Developer, frontend: React/Vue.js/Angular, backend:
  Node.js/Express/Laravel/PHP) at implementation time.
- "What I do" — 3-4 capability lines (absorbing what `services.html`
  currently covers), not a full services page.
- Featured projects: WeePlay + gastos as real preview cards.
- Closing CTA into Contact.

### About
- Full bio narrative (current: 4th year BSIT, full-stack identity —
  already accurate as of the 2026-08-23 content pass on the old site).
- Skills, grouped, text-based, no pill/badge decoration beyond simple
  tags.
- Experience timeline: Library (June 2025 – May 2026), HAU Store (Dec
  2024 – June 2025).
- Certifications: compact list — name, issuer, verify link. No images.
- Resume PDF download action.

### Projects
- Index of WeePlay + gastos, each with its own case-study route
  (`/projects/weeplay`, `/projects/gastos` or similar slugs) covering
  problem / what I did / outcome / built-with, carried over from the
  current case-study modal content in `pages/projects.html`.

### Contact
- Form (EmailJS-powered, same field set as current: name/email/subject/
  message with client-side validation).
- Contact info as plain labeled text (Phone/Email/Location/University/
  Status/Response time) — no emoji icons.
- Social links (GitHub/Email/LinkedIn) — icons here are fine since they're
  actual brand marks, not decorative UI icons.

## Technical architecture

- **Next.js App Router**, 4 top-level routes plus dynamic project routes
  under `/projects/[slug]`.
- **Tailwind CSS**, configured with the existing monochrome tokens from
  `css/base/variables.css` (both light and dark values) ported into
  `tailwind.config` as custom theme colors — the palette itself doesn't
  change, only how it's authored.
- **Components**: `Nav`, `Footer`, `ProjectCard`, case-study page template,
  `ContactForm`.
- **Images** via `next/image` — profile photo, project screenshots
  (auto-optimized, responsive).
- **Deploys to the same Vercel project** — same domain, same GitHub repo.
  This branch (`nextjs-redesign`) merges into `main` only when the user
  explicitly decides to. Preview deployments still sit behind the
  pre-existing Deployment Protection setting (unresolved from the last
  redesign) — doesn't block this work, just means only the account owner
  can view previews until that toggle is flipped.
- **EmailJS integration** carries over from the current site; resolving
  which service ID is actually live is part of this implementation
  (needs the EmailJS dashboard — user-only step).

## Error handling & testing

- Keep existing client-side form validation (required fields, email
  format, min-length message); add a visible error state for EmailJS send
  failures (current site only handles the success path).
- Next.js gives real 404s for unknown routes for free.
- Image fallback/placeholder handling if a project screenshot isn't ready
  at implementation time.
- No automated test suite planned — this is a content site, not app
  logic. Verification is manual QA: both themes (light/dark), mobile +
  desktop breakpoints, and a real form-submission smoke test before
  merging to `main`.

## Explicitly out of scope for this pass

- ATS/DentalCRM as full project case studies (may become its own future
  spec once/if either project is further along or deployed).
- Custom domain changes.
- A server-side (API route) contact form — EmailJS stays.
- Resolving the two other long-standing open items from
  `[[portfolio-redesign-branch]]` memory (phone number visibility on
  About/Contact, the two resume.pdf typos) unless the user raises them
  during implementation — they're independent of this redesign.
