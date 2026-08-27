# Portfolio — Layout, UX & Motion Redesign

**Branch:** `portfolio-ui-redesign` · **Date:** 2026-08-27 · **Delivery:** one branch, phased commits, single PR at end.

---

## Context

The portfolio (Next.js 15 App Router, hand-authored global CSS, no animation library) has a
solid visual identity — monochrome palette, Syne/DM Sans/JetBrains Mono, dark/light theme — but
its **composition, hierarchy, spacing rhythm, responsive behaviour, and motion** are weak. It
reads as a stack of same-sized sections rather than one art-directed developer experience.

This is **not a rebrand.** Palette, fonts, theme, logo, photography, project content, and the
case-study concept are preserved. The work is: recompose the pages, fix the hero hierarchy, give
projects real visual weight, establish a deliberate spacing rhythm, build a coherent motion
language that is fast on mobile and honest about `prefers-reduced-motion`, and delete the ~400+
lines of dead CSS accumulated across earlier iterations.

Outcome: the site still looks unmistakably like the same portfolio, significantly more polished.

### Decisions locked with the user
- **Email:** keep `jcdungo20@gmail.com` (one "o") as-is. *(Note: the user's account email is
  `jcdungoo20@gmail.com` — two "o"s. Re-confirm once before shipping; if wrong it breaks every
  `mailto:`. One-line fix in `lib/content.ts` if so.)*
- **Canonical domain:** `https://janncarl.vercel.app` — update `metadataBase`, `openGraph.url`,
  canonical, and per-page metadata to match.
- **No new heavy dependencies.** Two ~15-line hooks are fine. One build-time-only dev dep
  (`postcss-custom-media`) is proposed for breakpoint consolidation; if refused, fall back to a
  documented breakpoint comment block.

---

## Guiding constraints

- Keep the hand-CSS + design-token architecture. Improve it (add a font-size scale, a shared
  numbered-row component, consolidated breakpoints) only where it serves the work.
- Every hover interaction gets a keyboard/focus **and** touch equivalent. No essential
  information communicated only through animation or hover.
- Primarily animate `transform` / `opacity`. No JS animation loops running on mobile.
- All five route types are addressed: `/`, `/about`, `/projects`, `/projects/[slug]`, `/contact`.
- `npm run build` + `npm run lint` green at every phase boundary; branch stays shippable.

---

## Key design choices

### Project data (`lib/content.ts`)
Add three fields to the `Project` type — minimal, no array of invented metrics:
```ts
focus: string;        // "Full-stack offline-first PWA" / "Client marketing site"
achievement: string;  // ONE technical headline, e.g.
                      // "32 API routes folded into 10 serverless functions — zero URL changes"
stackLabel?: string;  // clean tech-category label when builtWith[0] reads badly (weeplay → "HTML/CSS")
```
`focus` + `achievement` + `stackLabel` give project cards "type + one achievement + tech
category" without a migration. `problem` / `whatIDid` / `outcome` stay the case-study body.
`achievement` also renders as a callout under `.pv-lede` on the case-study page.

### Homepage section order (`app/page.tsx`)
| # | Section | Source | Vertical density |
|---|---------|--------|------------------|
| 1 | Hero | rebuilt | generous |
| 2 | Selected Work (2 richer project cards) | `projects` | medium |
| 3 | What I Build (numbered rows) | `capabilities` | medium |
| 4 | About strip | current `.quick-about` (+`id`, real heading) | generous |
| 5 | Contact CTA | current `.svc-cta` | generous |
| 6 | Footer | unchanged | — |

Projects move from position 3 → 2 (primary proof directly under the hero). A separate "How I
Work" section is **optional and not shippable-blocking** — `lib/content.ts` has no
approach/principles content; either condense a 3-item strip from phrases already in
`capabilities`/project prose (needs the user's copy sign-off) or fold it into "What I Build".

### Spacing rhythm — new tokens in `app/styles/base/variables.css`
```css
--section-pad-tight    : clamp(48px, 7vw, 80px);
--section-pad          : clamp(64px, 9vw, 108px);    /* new .section default */
--section-pad-generous : clamp(96px, 13vw, 172px);
--section-pad-page-top : clamp(112px, 14vw, 176px);  /* first section clears fixed nav */
```
`.section` uses `--section-pad`; modifiers `.section--tight` / `--generous` / `--page-top`
replace the inline `style={{ paddingTop: 120 }}` on `/about`, `/contact`, `/projects`,
`/projects/[slug]`. Hero stops being `min-height:100vh`:
```css
.hero { min-height: min(880px, 100svh);
        padding-block: var(--section-pad-page-top) var(--section-pad-generous); }
```
Add `html { scroll-padding-top: 88px; }`.

### Hero rebuild (`app/page.tsx` + `home.css` + `animations.css`)
Single DOM order — **no `order` property anywhere**, so the decorative visual can never precede
identity on any viewport:
```
section.hero > .container > .hero-layout
  .hero-lead
    p.hero-kicker    "Available for internships"            (mono)
    h1.hero-name     Jann Carl Dungo
                     <span class="hero-role">Full-Stack Developer</span>   (display:block, inside h1)
    p.hero-support   BSIT — Web Development · Holy Angel University
    p.hero-desc      "Full-stack developer building structured, efficient systems with
                      React, Vue.js, Node.js, PHP, and REST APIs."   (no "Aspiring")
    p.hero-stack     React · Node.js · Laravel · SQL          (mono, tracked)
    .hero-cta        [View My Work → /projects] (primary)  [Let's Connect → /contact] (outline)
    a.hero-resume    "Download résumé (PDF)"                  (tertiary text link)
  .hero-media  aria-hidden="true"                            (comes AFTER lead in DOM)
    figure.hero-portrait   next/image profile.jpg, priority
    .hero-code-card        jann.js snippet (max-width:100%; min-width:0; overflow-x:auto)
```
- Role `<span>` **inside** the `h1` fixes "role is a non-heading span"; still one `h1`.
- Student status demoted to `.hero-support`, no longer the lede.
- Drop `avatar-ring` infinite spin + `counterSpin`. Static framed portrait
  (`border:2px solid var(--border-2)`, `--radius-lg`, `--shadow`); optional static conic ring, no rotation.
- **Responsive:** ≥1024 two-col `1.1fr 0.9fr`, portrait above code card. 768–1024 single col,
  portrait ~200px, code card `display:none`. <768 portrait only ~140px, code card hidden.
- **Entrance** (CSS-only, above the fold): reuse `@keyframes slideUp` on `.hero-lead > *`,
  ~70ms stagger (kicker 0 · h1 70 · support 140 · desc 210 · stack 280 · cta 350),
  `.hero-media` fades as one block at ~200ms. Total <700ms, `--transition-spring`,
  `animation-fill-mode: both`. Neutralised by the existing reduced-motion block.
- Remove the decorative scroll indicator.

### Motion architecture — CSS-first + two tiny hooks
- **`lib/usePrefersReducedMotion.ts`** — SSR-safe boolean, live `matchMedia` `change` listener (~15 lines).
- **`lib/useInView.ts`** — generic one-shot IntersectionObserver `[ref, inView]`.
- **`components/RevealScope.tsx`** — replaces the 4 byte-identical `*Reveal.tsx` wrappers; mounted
  on every route including `/projects/[slug]` (currently has none). In `useScrollReveal.ts`: under
  reduced-motion, skip the observer and add `.visible` to all targets immediately.

| Level | What | Gate |
|-------|------|------|
| 1 always | focus rings, ≤200ms color/opacity, reveal opacity | none |
| 2 default | entrance transforms, hover `translateY(-2/-4px)`, image scale, row fill | CSS; off under `prefers-reduced-motion: reduce` |
| 3 desktop ambient | particle canvas, blob float, sticky-preview crossfade | JS: `(min-width:1024px)` && `(pointer:fine)` && `(prefers-reduced-motion: no-preference)` |

**`components/AmbientBackground.tsx`:** gate Level-3 on mount — if any query fails, render blobs
only (or nothing), never start `requestAnimationFrame`. Pause on `visibilitychange`
(`document.hidden`) and when the hero is scrolled away. Live reduced-motion listener stops the
loop. Lower particle cap (~40); drop O(n²) connection lines below 1440px. rAF-debounce `resize`.

**`components/Nav.tsx`:** only `setScrolled` on the actual boolean flip, wrapped in rAF. Progress
bar writes `transform: scaleX()` to a ref inside rAF — no React state per scroll tick.

Add `--ease-out-soft: cubic-bezier(0.33, 1, 0.68, 1)` for small UI; keep `--transition-spring` as
the signature curve.

### Shared numbered-row component
**`components/IndexRow.tsx`** + **`app/styles/components/index-row.css`** (into the `globals.css`
components group). Delete `.svc-row*` from `services.css` and `.proj-row*` from `projects.css`.
```
props: num, title, titleAs?: 'h2'|'h3', href?, desc?, meta?: ReactNode,
       media?: ReactNode, trailing?: ReactNode, onActivate?: () => void
```
One `.index-row` grid `[num] [body] [trailing]`, left accent bar in the row's own padding,
`:hover`/`:focus-within` surface fill, `:focus-visible` outline, single responsive rule set.
Consumers: Home "What I Build" (`titleAs="h3"`, `<ol>`), Projects index (`titleAs="h2"`, `href`,
`meta` = achievement + chips, `media` = `<Image>`, `onActivate`). `ProjectCard.tsx` deleted or
becomes a 3-line adapter.

### Projects index mobile/touch fallback (`app/projects/ProjectsIndex.tsx`)
- Cutover moves from ad-hoc `980px` to the consolidated `1024px`.
- **Below 1024:** drop the sticky preview; each row becomes a self-contained card with its own
  inline `<Image>` (`previewImage ?? heroImage`) and a **real `alt`**, plus `focus`,
  `achievement`, tech chips, and a full-width "Read case study →" control (≥44px). Kills the
  981–1024px "static unchangeable image" dead zone.
- **Above 1024:** keep list + sticky preview; make each row's title a real link (or wrap the
  whole row) so hover-swap is pure enhancement. Keep `onMouseEnter`/`onFocus`.
- Sticky-preview crossfade on active change = Level 3 only; instant swap otherwise.

---

## Phases (each ends: build green, lint clean, committed, no half-migrated component)

- **Phase 1 — Tokens & dead-code (invisible).** Add font-size scale, rhythm tokens, easing,
  breakpoint custom-media (`base/breakpoints.css`); add `.sr-only`, `scroll-padding-top`. Delete
  all confirmed dead CSS (`.testimonials-*`, `.blog-*`, `.blog-teasers*`, `.certs-grid`,
  `.cert-card`, `.cert-image-grid`, `.cert-lightbox*`, `.hero-stats`/`.stat-*`, `.hero-learning*`
  + `@keyframes dotPulse`, `.projects-filter`/`.filter-btn`/`.tech-tag`/`.resume-skill-chip`/
  `.blog-tag`, `@keyframes blink` + `.typed-cursor`, duplicated `.quick-about`/`.quick-photo-img`
  block). Fix broken `fadeInPage` ref and the `.btn .spinner` selector (ContactForm spinner is
  currently unstyled). Site looks identical, bundle smaller.
- **Phase 2 — Shared primitives.** `IndexRow` + `index-row.css`; migrate Home capabilities and
  the projects index. Collapse the 4 reveal wrappers → `RevealScope`, add reduced-motion guard,
  wire `/projects/[slug]`.
- **Phase 3 — Motion architecture.** `usePrefersReducedMotion`, `useInView`,
  `AmbientBackground` gating + visibility pause, Nav rAF/ref refactor. Desktop visuals
  unchanged; CPU down; motion honestly off under reduced-motion.
- **Phase 4 — Hero rebuild.** `app/page.tsx` hero block + `home.css` hero rules +
  `animations.css` stagger.
- **Phase 5 — Homepage recomposition.** `content.ts` gets `focus`/`achievement`/`stackLabel`;
  reorder sections; richer project cards; apply rhythm modifiers; fix the whole-card
  `cursor:pointer` (make the card a link or drop the pointer). Optional "How I Work" section.
- **Phase 6 — Inner routes.** `/about`, `/contact`, `/projects/[slug]` — heading levels + `id`s
  (`/contact` h1→h3 gap; case-study section `<div>`s → `<h2>`/`<h3>`; about skill/cert/exp
  titles → headings), rhythm classes, case-study reveal, narrow container for case body,
  per-page canonical + OG.
- **Phase 7 — Responsive consolidation.** Replace the 6 ad-hoc breakpoints
  (1024/980/768/720/560/480) with the documented set; single `.nav-links{display:none}` (remove
  3 duplicates). Nav mobile menu: focus trap + focus return + dynamic `aria-label` ("Open"/"Close
  menu") + include "Hire Me" and the theme toggle. All touch targets ≥44px (`.btn-sm`,
  `.theme-toggle`, `.hamburger`, `.nav-link`, `.proj-row-btn`).
- **Phase 8 — Performance & metadata.** `priority` on hero portrait; convert
  `public/images/*` to static `import` (auto width/height + `blurDataURL`); `sizes` everywhere;
  image `formats` in `next.config.mjs`; `metadataBase`/canonical/OG → `janncarl.vercel.app` +
  consistency pass; the email re-confirm; add `app/sitemap.ts`, `app/robots.ts`,
  `app/not-found.tsx`.
- **Phase 9 — A11y & final review.** Hover→focus/touch equivalence sweep; bump `--text-3`
  contrast in both themes; add `prefers-color-scheme` to `ThemeProvider` + the inline theme-init
  script; form focus ring visible in light theme; full verification matrix.

---

## Critical files

- `app/page.tsx` — hero rebuild, section reorder, richer cards
- `app/styles/pages/home.css` — hero rules, dead-code removal, rhythm
- `app/styles/base/variables.css` — font-size scale, rhythm tokens, easing
- `lib/content.ts` — `Project` type + `focus`/`achievement`/`stackLabel`; `siteInfo` email re-confirm
- `components/AmbientBackground.tsx` — Level-3 gating, visibility pause, particle cap
- `components/Nav.tsx` — rAF scroll, mobile-menu a11y, touch targets
- `app/projects/ProjectsIndex.tsx` + `components/ProjectCard.tsx` — mobile card fallback, `IndexRow`
- `app/projects/[slug]/page.tsx` — heading semantics, reveal wrapper, `achievement` callout
- `app/about/page.tsx`, `app/contact/page.tsx` — heading levels, rhythm, per-page metadata
- `app/styles/layout/responsive.css` + `navbar.css` — breakpoint consolidation
- `app/layout.tsx` — `metadataBase`, `scroll-padding-top`, theme-init script
- **New:** `components/IndexRow.tsx`, `components/RevealScope.tsx`,
  `lib/usePrefersReducedMotion.ts`, `lib/useInView.ts`,
  `app/styles/components/index-row.css`, `app/styles/base/breakpoints.css`,
  `app/sitemap.ts`, `app/robots.ts`, `app/not-found.tsx`

---

## Verification (per phase + final)

1. `npm run build` and `npm run lint` — green. (Watch: TS errors from the `Project` type change;
   unused-var lint after deleting `*Reveal.tsx`.)
2. `npm run dev` + Chrome MCP: navigate all 5 route types, screenshot at
   **1440 / 1280 / 1024 / 768 / 430 / 390 / 375 / 360**, both themes; diff against Phase 0 baseline.
3. **Reduced motion:** emulate `prefers-reduced-motion: reduce` — no particle rAF running
   (Performance panel), hero entrance instant, reveals visible without transform, zero infinite spins.
4. **Keyboard:** Tab through nav → open mobile menu → focus trapped → Esc → focus returns to
   hamburger. Tab through project rows, cards, contact form — every hover affordance reachable
   with a visible focus state.
5. **Theme:** dark/light each route — form focus ring visible in light, `--text-3` passes
   contrast (axe/Lighthouse).
6. **No horizontal scroll** at any tested width; no clipped text, no overlap.
7. **Lighthouse mobile** on `/` and `/projects/weeplay`: Performance / LCP / TBT / CLS / a11y —
   no regression vs baseline; expect LCP improvement (hero `priority` + blur, dropped
   `min-height:100vh`). Confirm LCP element is the hero `h1`/portrait, not a lazy image.
8. **Final gate:** full grid (5 routes × 8 widths × 2 themes) + reduced-motion grid for `/`,
   `/projects`, `/projects/weeplay`. Then open the PR.
