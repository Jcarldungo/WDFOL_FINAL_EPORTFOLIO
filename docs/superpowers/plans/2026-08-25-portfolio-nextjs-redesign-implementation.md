# Portfolio Next.js Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `WDFOL_FINAL_EPORTFOLIO` from a vanilla HTML/CSS/JS SPA into a Next.js (App Router) + Tailwind CSS site that reads as a professional developer/product portfolio instead of a student portfolio, on branch `nextjs-redesign`.

**Architecture:** Next.js App Router with 4 top-level routes (`/`, `/about`, `/projects`, `/contact`) plus a dynamic `/projects/[slug]` case-study route, replacing the old client-side router/loader entirely. Tailwind CSS is configured with the site's existing monochrome design tokens (from `css/base/variables.css`) exposed as theme colors, and is used to author every new piece of markup (mobile menu, contact form, project cards, case-study layout). The large body of already-approved, hand-authored CSS (buttons, cards, forms, tags, effects, animations, navbar, footer, page-specific layout) is ported nearly verbatim into `app/styles/**` and aggregated through one `app/globals.css`, preserving the exact visual system rather than re-deriving it as Tailwind utilities. All page content becomes real JSX driven by a typed content layer (`lib/content.ts`) instead of static HTML fragments.

**Tech Stack:** Next.js 15 (App Router, TypeScript), React 19, Tailwind CSS 3.4, `@emailjs/browser` for the contact form, `next/font/google` for Syne/DM Sans/JetBrains Mono, `next/image` for photos/screenshots.

**Spec:** `docs/superpowers/specs/2026-08-23-portfolio-nextjs-redesign-design.md`

## Global Constraints

- Monochrome palette only, in both light and dark themes — colors come from the ported `css/base/variables.css` tokens (bridged into Tailwind as theme colors). `--green`/`--red`/`--yellow` stay real color (status only); everything else is grayscale. Do not reintroduce the old cyan/violet accent.
- No emoji as UI chrome: no emoji in nav links, section labels, contact-detail rows, experience-card markers, skill-category headings, soft-skill tags, or button icons. Emoji as actual sentence content (e.g. a casual greeting) is being dropped too in this pass for tone consistency — see Task 6 and Task 9 notes. Arrow glyphs (`→`) are typographic, not emoji, and stay. Social link icons (GitHub/Email/LinkedIn SVGs) are brand marks, not decorative chrome — they stay as-is.
- Keep the existing motion/transition system as-is: scroll reveals (`.reveal`/`.reveal-left`/`.reveal-right`), hover states, the avatar counter-spin, the scroll indicator, the ambient blobs, the particle canvas, and the noise overlay all carry over. Only the rotating typewriter title is dropped (content gimmick, not the animation system).
- Home drops: the stat-counter row (Live Projects / Certifications / Year), the "Currently learning" strip, and the rotating typewriter — replaced by one confident static title line.
- Exactly 2 project case studies (WeePlay, gastos) — ATS/DentalCRM are not added as case studies in this pass.
- Certifications render as a compact text list (name, issuer, date, verify link) — no images, no lightbox. `assets/certificates/*` images are removed from the working tree in Task 1 (still recoverable from git history and `main`).
- Contact form keeps EmailJS client-side send — no server API route. Public key `LwJqauSQo1Xu0WEHk`, service id `service_6vyl1sy`, template id `template_6enn7yh` are carried forward as the ones actually wired (confirmed by reading `js/modules/form.js` and the dead-code comment in `pages/contact.html` — the other candidate service id, `service_t50fkkn`, was traced to a duplicate handler that never fired). Note for the user in Task 9: still worth a one-time check of the EmailJS dashboard to confirm that service is active/within quota, but the ambiguity itself is resolved by the code, not left open.
- No automated test suite (this is a content site, per the spec's own "Error handling & testing" section) — every task's verification step is `npm run build` (or `npx tsc --noEmit` for a data-only task) plus a manual QA checklist in the browser, covering both themes (toggle via the theme button) and at least one mobile breakpoint (~390px wide). Run `npm run dev` once at the start of a work session and leave it running; each task's QA step assumes it's already up at `http://localhost:3000`.
- Out of scope for this plan (per spec): ATS/DentalCRM case studies, custom domain changes, a server-side contact API route, regenerating `assets/resume.pdf`, resolving the phone-number-visibility question. Do not touch these unless the user raises them.
- Do not merge `nextjs-redesign` into `main` as part of this plan — that's an explicit, separate user decision after QA (see Task 10).

---

## File Structure

```
app/
  layout.tsx              — RootLayout: fonts, ThemeProvider, AmbientBackground, Nav, Footer, metadata
  globals.css             — Tailwind directives + @imports of app/styles/**
  icon.png                — favicon (Next.js file convention)
  page.tsx                — Home
  about/page.tsx
  projects/page.tsx        — Projects index
  projects/[slug]/page.tsx — Case study (generateStaticParams)
  contact/page.tsx
  styles/
    base/variables.css, reset.css, typography.css, animations.css
    layout/grid.css, navbar.css, footer.css, responsive.css
    components/buttons.css, cards.css, forms.css, tags.css, effects.css
    pages/home.css, about.css, projects.css, contact.css, services.css
components/
  Nav.tsx
  Footer.tsx
  ThemeProvider.tsx
  AmbientBackground.tsx
  ProjectCard.tsx
  ContactForm.tsx
lib/
  content.ts               — typed data: projects, skills, certifications, experience, capabilities
  useScrollReveal.ts        — IntersectionObserver hook
public/
  icons/logo.png, logo.svg
  images/profile.jpg, project-weeplay.jpg, project-gastos.jpg, og-image.jpg
  resume.pdf
tailwind.config.ts
next.config.mjs
tsconfig.json
postcss.config.mjs
package.json
```

Removed entirely (content already captured above / in this plan; still recoverable from git history and `main`): `index.html`, `pages/`, `components/*.html`, `js/`, `vercel.json`, `assets/` (once its contents are moved into `public/`), `css/` (once ported into `app/styles/`), `README.md`'s vanilla-stack description (rewritten in Task 10).

---

### Task 1: Scaffold Next.js + Tailwind, remove vanilla site, move assets

**Files:**
- Delete: `index.html`, `pages/about.html`, `pages/contact.html`, `pages/home.html`, `pages/projects.html`, `pages/resume.html`, `pages/services.html`, `components/navbar.html`, `components/footer.html`, `js/main.js`, `js/modules/*.js`, `vercel.json`, `assets/certificates/*`
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts`, `.eslintrc.json`, `app/layout.tsx` (placeholder shell), `app/page.tsx` (placeholder), `app/globals.css` (Tailwind directives only for now), `app/icon.png`
- Move: `assets/images/*` → `public/images/*`, `assets/icons/logo.png` and `assets/icons/logo.svg` → `public/icons/*`, `assets/resume.pdf` → `public/resume.pdf`, a copy of `assets/icons/logo.png` → `app/icon.png`
- Modify: `.gitignore` (add `node_modules/`, `.next/`, `.env*.local`)

**Interfaces:**
- Produces: a working `npm run dev` Next.js app at `http://localhost:3000` serving a placeholder page, with all static assets available under `/images/*`, `/icons/*`, `/resume.pdf`. Later tasks build real pages on top of this.

- [ ] **Step 1: Remove the vanilla site's entry files and JS router/loader**

```bash
git rm index.html vercel.json
git rm -r pages components js
```

- [ ] **Step 2: Remove the certificate images (unused by the new compact-text cert list)**

```bash
git rm -r assets/certificates
```

- [ ] **Step 3: Move the remaining assets into `public/`**

```bash
mkdir -p public/images public/icons
git mv assets/images/profile.jpg public/images/profile.jpg
git mv assets/images/project-weeplay.jpg public/images/project-weeplay.jpg
git mv assets/images/project-gastos.jpg public/images/project-gastos.jpg
git mv assets/images/og-image.jpg public/images/og-image.jpg
git mv assets/icons/logo.png public/icons/logo.png
git mv assets/icons/logo.svg public/icons/logo.svg
git mv assets/resume.pdf public/resume.pdf
rmdir assets/images assets/icons assets 2>/dev/null || true
```

- [ ] **Step 4: Initialize the npm project and install dependencies**

```bash
npm init -y
npm install next@^15 react@^19 react-dom@^19 @emailjs/browser@^4
npm install -D typescript@^5 @types/node@^20 @types/react@^19 @types/react-dom@^19 tailwindcss@^3.4 postcss@^8 autoprefixer@^10 eslint@^8 eslint-config-next@^15
```

- [ ] **Step 5: Write `package.json` scripts** (keep the fields `npm init` generated, just replace `"scripts"` and add `"private": true`)

```json
{
  "name": "jann-carl-dungo-portfolio",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

- [ ] **Step 6: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 7: Create `next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```

- [ ] **Step 8: Create `postcss.config.mjs`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 9: Create `.eslintrc.json`**

```json
{
  "extends": "next/core-web-vitals"
}
```

- [ ] **Step 10: Create a placeholder `tailwind.config.ts`** (real token bridge lands in Task 2)

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
};

export default config;
```

- [ ] **Step 11: Create a placeholder `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 12: Create a placeholder `app/layout.tsx`**

```tsx
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 13: Create a placeholder `app/page.tsx`**

```tsx
export default function Home() {
  return <main style={{ padding: 40 }}>Scaffold OK — replaced in Task 6.</main>;
}
```

- [ ] **Step 14: Copy the logo to the Next.js favicon convention path**

```bash
cp public/icons/logo.png app/icon.png
```

- [ ] **Step 15: Update `.gitignore`** — add these lines if not already present:

```
node_modules/
.next/
.env*.local
```

- [ ] **Step 16: Verify the build and dev server**

```bash
npm run build
```
Expected: `Compiled successfully`.

```bash
npm run dev
```
Expected: server starts on `http://localhost:3000`; visiting it shows "Scaffold OK — replaced in Task 6." with no console errors. Leave this running for the rest of the plan.

- [ ] **Step 17: Commit**

```bash
git add -A
git commit -m "Scaffold Next.js + Tailwind, remove vanilla site infra, move assets to public/"
```

---

### Task 2: Design tokens, fonts, and global styles

**Files:**
- Create: `app/styles/base/variables.css`, `app/styles/base/reset.css`, `app/styles/base/typography.css`, `app/styles/base/animations.css`, `app/styles/layout/grid.css`, `app/styles/layout/navbar.css`, `app/styles/layout/footer.css`, `app/styles/layout/responsive.css`, `app/styles/components/buttons.css`, `app/styles/components/cards.css`, `app/styles/components/forms.css`, `app/styles/components/tags.css`, `app/styles/components/effects.css`, `app/styles/pages/home.css`, `app/styles/pages/about.css`, `app/styles/pages/projects.css`, `app/styles/pages/contact.css`, `app/styles/pages/services.css`
- Modify: `app/globals.css`, `tailwind.config.ts`, `app/layout.tsx`
- Delete: `css/` (entire folder, once every file below is ported)

**Interfaces:**
- Produces: every CSS class name used by the old site (`.btn`, `.card`, `.hero-*`, `.section-*`, `.reveal`, etc. — full list already used verbatim in the original `pages/*.html`, which Tasks 6–9 reuse in JSX) is available globally once `app/globals.css` is imported from `app/layout.tsx`. Tailwind's `bg-*`/`text-*`/`border-*` utilities using the tokens below (`bg`, `bg-2`, `surface`, `surface-2`, `text`, `text-2`, `text-3`, `accent`, `accent-2`, `border`, `border-2`, `green`, `red`, `yellow`, `purple`) are available for any new markup.

- [ ] **Step 1: Copy `css/base/variables.css` to `app/styles/base/variables.css` verbatim** (full existing content — design tokens, `:root` dark theme, `[data-theme="light"]` overrides). No changes needed; this file has no router coupling.

- [ ] **Step 2: Copy `css/base/reset.css` to `app/styles/base/reset.css` verbatim.** No changes needed.

- [ ] **Step 3: Copy `css/base/typography.css` to `app/styles/base/typography.css` verbatim.** No changes needed.

- [ ] **Step 4: Copy `css/base/animations.css` to `app/styles/base/animations.css`**, with one trim: delete the `@keyframes fadeInPage` block (lines 49–52 in the original) — it was only ever used by the old SPA router's `.page.active` class, which Step 6 below removes. Keep every other keyframe and the `.reveal`/`.reveal-left`/`.reveal-right`/`.reveal-delay-*` classes as-is — the reveal system is reused by `lib/useScrollReveal.ts` in Task 5.

- [ ] **Step 5: Copy `css/layout/navbar.css`, `css/layout/footer.css`, and `css/layout/responsive.css`** to `app/styles/layout/` verbatim. No changes needed — none of these three reference the old router.

- [ ] **Step 6: Copy `css/layout/grid.css` to `app/styles/layout/grid.css`, with one trim**: delete the "SPA Page system" block —

```css
/* delete this block, it existed only for the old router:
.page          { display: none; position: relative; z-index: var(--z-base); }
.page.active   { display: block; animation: fadeInPage 0.5s ease; }
*/
```

and delete the "Loading state" block (`.page-loading` and its `::before`) for the same reason — Next.js routes don't need a manually-toggled loading class. Keep everything else in the file (`.container`, `.section`, `.glass-card`, `.two-col*`, `.auto-grid`, `.section-alt`, `.section-head*`) verbatim.

- [ ] **Step 7: Copy `css/components/buttons.css`, `css/components/cards.css`, `css/components/forms.css`, `css/components/tags.css`, and `css/components/effects.css`** to `app/styles/components/` verbatim. None of these reference the old router.

- [ ] **Step 8: Copy `css/pages/home.css`, `css/pages/about.css`, `css/pages/projects.css`, `css/pages/contact.css`, and `css/pages/services.css`** to `app/styles/pages/` verbatim. (`css/pages/resume.css` is intentionally NOT ported — the resume page is dropped per the spec, and nothing else references its classes.)

- [ ] **Step 9: Replace `app/globals.css`** with the Tailwind directives plus the same import order the old `css/main.css` used:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import './styles/base/variables.css';
@import './styles/base/reset.css';
@import './styles/base/typography.css';
@import './styles/base/animations.css';

@import './styles/layout/grid.css';
@import './styles/layout/navbar.css';
@import './styles/layout/footer.css';
@import './styles/layout/responsive.css';

@import './styles/components/buttons.css';
@import './styles/components/cards.css';
@import './styles/components/forms.css';
@import './styles/components/tags.css';
@import './styles/components/effects.css';

@import './styles/pages/home.css';
@import './styles/pages/about.css';
@import './styles/pages/projects.css';
@import './styles/pages/contact.css';
@import './styles/pages/services.css';
```

- [ ] **Step 10: Set the color-scheme meta and delete the ported `css/` source folder**

```bash
git rm -r css
```

- [ ] **Step 11: Wire up fonts in `app/layout.tsx`** and bridge them to the CSS variables the ported files expect (`--font-display`, `--font-body`, `--font-mono`):

```tsx
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-display-family',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body-family',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-family',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${syne.variable} ${dmSans.variable} ${jetBrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
```

`next/font` injects each font's actual family name into the CSS variable it's given via its `variable` option. To avoid that variable colliding with the same-named token `app/styles/base/variables.css` already declares, the `next/font` calls in Step 11 above use the suffixed names `--font-display-family`, `--font-body-family`, `--font-mono-family` (not `--font-display` etc.) — confirm that's what you wrote in Step 11 before continuing. Then update `app/styles/base/variables.css` to reference those suffixed variables instead of the hardcoded family names:

```css
/* app/styles/base/variables.css — replace these three lines: */
--font-display : var(--font-display-family), sans-serif;
--font-body    : var(--font-body-family), sans-serif;
--font-mono    : var(--font-mono-family), monospace;
```

- [ ] **Step 12: Add the Tailwind token bridge to `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-2': 'var(--bg-2)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        text: 'var(--text)',
        'text-2': 'var(--text-2)',
        'text-3': 'var(--text-3)',
        accent: 'var(--accent)',
        'accent-2': 'var(--accent-2)',
        border: 'var(--border)',
        'border-2': 'var(--border-2)',
        green: 'var(--green)',
        red: 'var(--red)',
        yellow: 'var(--yellow)',
        purple: 'var(--purple)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius-lg)',
        pill: 'var(--radius-pill)',
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 13: Verify the build**

```bash
npm run build
```
Expected: `Compiled successfully`, no CSS import errors.

- [ ] **Step 14: Manual QA** at `http://localhost:3000` (still showing the Task 1 placeholder text): confirm the page background is the dark monochrome `--bg` color (near-black, `#0b0d10`) and the placeholder text renders in the DM Sans body font, not the browser default serif/sans. Open DevTools, toggle `<html data-theme="...">` between `"dark"` and `"light"` manually in the Elements panel, and confirm the background/text colors swap to the light palette (`#f6f7f8` bg / `#14171a` text) with no flash of unstyled content.

- [ ] **Step 15: Commit**

```bash
git add -A
git commit -m "Port design tokens, fonts, and global styles into Next.js"
```

---

### Task 3: Theme system + ambient background (kept motion)

**Files:**
- Create: `components/ThemeProvider.tsx`, `components/AmbientBackground.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `<ThemeProvider>` wrapping `children`, exposing `useTheme(): { theme: 'dark' | 'light'; toggleTheme: () => void }` via context, matching the old `localStorage` key `'portfolio-theme'` and default `'dark'`. `<AmbientBackground />` renders the blob layer + particle canvas with no props, self-contained (mount/unmount safe).
- Consumes: nothing from earlier tasks besides the CSS classes ported in Task 2 (`.blob-wrap`, `.blob`, `.blob-1/2/3`, `#particle-canvas`).

- [ ] **Step 1: Create `components/ThemeProvider.tsx`**

```tsx
'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

const STORAGE_KEY = 'portfolio-theme';
const DEFAULT_THEME: Theme = 'dark';

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? DEFAULT_THEME;
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
```

- [ ] **Step 2: Add a blocking inline script in `app/layout.tsx`** so the saved theme applies before first paint (avoids the flash the old module-script version had):

```tsx
import Script from 'next/script';
// ...existing imports

const THEME_INIT_SCRIPT = `
(function() {
  try {
    var saved = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
  } catch (e) {}
})();
`;
```

Add `<Script id="theme-init" strategy="beforeInteractive">{THEME_INIT_SCRIPT}</Script>` as the first child inside `<body>`, before `{children}`.

- [ ] **Step 3: Create `components/AmbientBackground.tsx`**, porting `js/modules/particles.js` and the blob markup from `index.html` into one client component:

```tsx
'use client';

import { useEffect, useRef } from 'react';

const CONNECTION_DISTANCE = 120;
const getParticleCount = () => Math.min(80, Math.floor(window.innerWidth / 20));

class Particle {
  x = 0; y = 0; vx = 0; vy = 0; r = 0; a = 0;
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.r = Math.random() * 1.5 + 0.5;
    this.a = Math.random() * 0.5 + 0.1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > this.canvas.width || this.y < 0 || this.y > this.canvas.height) {
      this.reset();
    }
  }

  draw(ctx: CanvasRenderingContext2D, rgb: string) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rgb}, ${this.a})`;
    ctx.fill();
  }
}

function particleRGB() {
  return document.documentElement.getAttribute('data-theme') === 'light'
    ? '20, 24, 28'
    : '255, 255, 255';
}

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let rafId = 0;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      particles = Array.from({ length: getParticleCount() }, () => new Particle(canvas!));
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECTION_DISTANCE) {
            const opacity = (1 - d / CONNECTION_DISTANCE) * 0.08;
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(${particleRGB()}, ${opacity})`;
            ctx!.lineWidth = 0.5;
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const rgb = particleRGB();
      particles.forEach((p) => { p.update(); p.draw(ctx!, rgb); });
      drawConnections();
      rafId = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <div className="blob-wrap" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>
      <canvas id="particle-canvas" ref={canvasRef} aria-hidden="true" />
    </>
  );
}
```

- [ ] **Step 4: Wire both into `app/layout.tsx`**

```tsx
import { ThemeProvider } from '@/components/ThemeProvider';
import { AmbientBackground } from '@/components/AmbientBackground';
// ...

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${syne.variable} ${dmSans.variable} ${jetBrainsMono.variable}`}>
      <body>
        <Script id="theme-init" strategy="beforeInteractive">{THEME_INIT_SCRIPT}</Script>
        <ThemeProvider>
          <AmbientBackground />
          <a href="#main-content" className="skip-link">Skip to main content</a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify the build**

```bash
npm run build
```
Expected: `Compiled successfully`.

- [ ] **Step 6: Manual QA** at `http://localhost:3000`: confirm the ambient blobs are faintly visible drifting in the background and the particle canvas shows faint moving dots connected by thin lines. Reload the page a few times — no console errors about `canvas` being null. Resize the browser window — particle count/canvas size should adjust without throwing.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Add theme system and ambient background (blobs + particles)"
```

---

### Task 4: Content data layer + scroll-reveal hook

**Files:**
- Create: `lib/content.ts`, `lib/useScrollReveal.ts`

**Interfaces:**
- Produces: `projects: Project[]`, `skills: SkillCategory[]`, `certifications: Certification[]`, `experience: ExperienceEntry[]`, `capabilities: Capability[]`, `siteInfo` (name, email, phone, location, socials, EmailJS constants) — all typed and exported from `lib/content.ts`. `useScrollReveal(): void` — a hook, called once per page component, with no return value and no arguments.
- Consumes: nothing (this is the base data layer every later page task reads from).

- [ ] **Step 1: Create `lib/content.ts`**

```ts
export type Project = {
  slug: string;
  title: string;
  eyebrow: string;
  shortDesc: string;
  lede: string;
  roles: string[];
  liveUrl: string;
  githubUrl?: string;
  heroImage: string;
  frameUrl: string;
  builtWith: string[];
  problem: string;
  whatIDid: string[];
  outcome: string[];
};

export const projects: Project[] = [
  {
    slug: 'weeplay',
    title: 'WeePlay Therapy Center',
    eyebrow: 'Client project',
    shortDesc:
      'Live client website for a pediatric therapy clinic in Pampanga — custom CSS design system, mobile-first and accessible, no framework.',
    lede: 'A production website for a pediatric therapy clinic in Mabalacat, Pampanga — live and serving actual families.',
    roles: ['Frontend Developer', 'UI Implementation'],
    liveUrl: 'https://weeplay-therapy.vercel.app',
    heroImage: '/images/project-weeplay.jpg',
    frameUrl: 'weeplay-therapy.vercel.app',
    builtWith: ['HTML5', 'CSS3', 'Vanilla JS', 'Vercel'],
    problem:
      'A therapy clinic needed a site that communicated warmth and trust to parents, while staying fast on the low-end phones most of them actually browse on.',
    whatIDid: [
      'Built it from scratch with no framework — hand-written semantic HTML and a custom CSS design system.',
      'Made it mobile-first and accessible: skip links, ARIA labels, and full keyboard navigation.',
      'Wired up the paths a parent actually uses — click-to-call, Messenger, and an inquiry form.',
      'Added Open Graph and SEO meta so shared links preview cleanly.',
    ],
    outcome: [
      'Live and in use by a working business — not a practice project.',
      'Loads fast on low-end phones, which is most of the clinic’s traffic.',
      'Deployed on Vercel with continuous deployment from GitHub.',
    ],
  },
  {
    slug: 'gastos',
    title: 'gastos',
    eyebrow: 'Personal project',
    shortDesc:
      'Offline-first expense tracker built around a free-tier function limit — 32 routes folded into 10 dispatchers with zero URL changes.',
    lede: 'An offline-first expense tracker for logging a purchase in three taps, even with no signal.',
    roles: ['Full-Stack Developer', 'Database Design'],
    liveUrl: 'https://gastos-xi-rose.vercel.app',
    githubUrl: 'https://github.com/Jcarldungo/gastos',
    heroImage: '/images/project-gastos.jpg',
    frameUrl: 'gastos-xi-rose.vercel.app',
    builtWith: ['Vanilla JS', 'Vercel Serverless', 'Neon PostgreSQL', 'Service Worker / PWA', 'Web Push'],
    problem:
      'Logging an expense needed to survive a dead signal, and the whole app had to fit on a free plan that caps a deployment at 12 serverless functions — while the app needed about 32 routes.',
    whatIDid: [
      'Consolidated ~32 routes into 10 thin dispatcher functions, routed by a single vercel.json rewrite table shared by production and local dev — with zero change to any URL or response shape.',
      'Built an offline outbox: a service worker queues entries made with no signal and syncs them once the connection returns.',
      'Derived card balances from the transaction ledger instead of storing a typed-in number, so the balance can’t drift from the history.',
      'Kept money as strings end to end (never a JS float) and read dates back as calendar strings, not Date objects, to avoid timezone drift.',
    ],
    outcome: [
      'Runs entirely within the free tier — 10 of 12 functions used.',
      'Works with no connection and reconciles itself once back online.',
      'Installable to a phone’s home screen, with Web Push alerts for bills and budgets.',
    ],
  },
];

export type SkillCategory = { title: string; items: string[] };

export const skills: SkillCategory[] = [
  {
    title: 'Backend Engineering',
    items: ['Node.js / Express.js', 'Laravel', 'RESTful API Architecture', 'JWT Authentication', 'PHP'],
  },
  { title: 'Languages', items: ['JavaScript (ES6+)', 'Java', 'SQL', 'Python'] },
  { title: 'Databases', items: ['MongoDB (NoSQL)', 'MySQL (Relational)', 'DB Normalization'] },
  {
    title: 'Frontend & Tools',
    items: ['HTML5 / CSS3', 'React / Inertia.js', 'Vue.js / Angular', 'Tailwind CSS', 'Git / GitHub', 'Figma / Postman'],
  },
];

export type Certification = { name: string; issuer: string; date: string; verifyUrl: string };

export const certifications: Certification[] = [
  { name: 'Responsive Web Design', issuer: 'freeCodeCamp', date: 'September 7, 2024', verifyUrl: 'https://www.freecodecamp.org/certification/janncarldungo/responsive-web-design' },
  { name: 'Backend Development and APIs V8', issuer: 'freeCodeCamp', date: 'October 4, 2025', verifyUrl: 'https://www.freecodecamp.org/certification/janncarldungo/back-end-development-and-apis' },
  { name: 'Legacy JS Algorithms and Data Structures V7', issuer: 'freeCodeCamp', date: 'October 4, 2025', verifyUrl: 'https://www.freecodecamp.org/certification/janncarldungo/javascript-algorithms-and-data-structures' },
  { name: 'Introduction to Figma', issuer: 'Simplilearn', date: 'September 21, 2024', verifyUrl: 'https://simpli-web.app.link/e/E3zXoWTQZ0b' },
  { name: 'Work with Components in Figma', issuer: 'Coursera Project Network', date: 'September 23, 2024', verifyUrl: 'https://coursera.org/verify/EE1VVECBQ8DE' },
  { name: 'JavaScript Essentials 1', issuer: 'Cisco Networking Academy', date: 'October 25, 2024', verifyUrl: 'https://www.credly.com/badges/634d8a44-d734-428a-9666-da71fd2d9526' },
  { name: 'Introduction to PHP', issuer: 'Simplilearn', date: 'February 9, 2025', verifyUrl: 'https://simpli-web.app.link/e/Zx7oBtVQZ0b' },
  { name: 'Design Thinking for Beginners', issuer: 'Simplilearn', date: 'July 25, 2025', verifyUrl: 'https://simpli-web.app.link/e/dz8n50OQZ0b' },
];

export type ExperienceEntry = { index: string; title: string; org: string; period: string; bullets: string[] };

export const experience: ExperienceEntry[] = [
  {
    index: '01',
    title: 'Student Aide — University Library',
    org: 'Holy Angel University',
    period: 'June 2025 – May 2026',
    bullets: [
      'Resolved student inquiries regarding research tools and digital resources',
      'Processed check-in/check-out transactions ensuring accurate record-keeping',
      'Improved communication skills in a service-oriented environment',
    ],
  },
  {
    index: '02',
    title: 'Student Aide — HAU Store',
    org: 'Holy Angel University',
    period: 'Dec 2024 – June 2025',
    bullets: [
      'Resolved customer inquiries during peak university hours with composure',
      'Streamlined customer service, strengthening ability to multitask under pressure',
      'Supported daily store operations including inventory and transactions',
    ],
  },
];

export type Capability = { num: string; title: string; desc: string };

export const capabilities: Capability[] = [
  {
    num: '01',
    title: 'Full-Stack Web Development',
    desc: 'Complete web apps built from scratch — semantic markup, a custom CSS system, and the server side behind it. No page-builder, no template.',
  },
  {
    num: '02',
    title: 'REST API Design & Development',
    desc: 'Clean, predictable endpoints with real auth, validation, and error handling — including working within tight hosting limits when the plan caps you.',
  },
  {
    num: '03',
    title: 'Database Design',
    desc: 'Schemas modelled on how the data is actually queried — normalised tables, sane constraints, and columns that mean one thing each.',
  },
  {
    num: '04',
    title: 'Responsive & Accessible Frontends',
    desc: 'Mobile-first layouts tuned for low-end phones, with skip links, ARIA labels, and keyboard navigation built in rather than bolted on.',
  },
];

export const softSkills = [
  'Problem Solving',
  'Team Collaboration',
  'Time Management',
  'Patience',
  'Adaptability',
  'Works Under Pressure',
];

export const siteInfo = {
  name: 'Jann Carl Dungo',
  handle: 'jcdungoo20',
  email: 'jcdungo20@gmail.com',
  phone: '0915-246-8287',
  phoneHref: 'tel:09152468287',
  location: 'Sapang Maisac, Mexico, Pampanga',
  university: 'Holy Angel University — BSIT (Web Dev)',
  github: 'https://github.com/Jcarldungo',
  linkedin: 'https://www.linkedin.com/in/jann-carl-dungo-3948272a1/',
  emailjs: {
    publicKey: 'LwJqauSQo1Xu0WEHk',
    serviceId: 'service_6vyl1sy',
    templateId: 'template_6enn7yh',
  },
};
```

- [ ] **Step 2: Create `lib/useScrollReveal.ts`**, porting `js/modules/scrollReveal.js` as a hook (no more `.page.active` scoping needed — each route only ever renders one page's worth of `.reveal` elements at a time):

```ts
'use client';

import { useEffect } from 'react';

const THRESHOLD = 0.12;

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: THRESHOLD }
    );

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => {
      if (!el.classList.contains('visible')) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}
```

- [ ] **Step 3: Verify types**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add typed content data layer and scroll-reveal hook"
```

---

### Task 5: Nav + Footer + root layout wiring

**Files:**
- Create: `components/Nav.tsx`, `components/Footer.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `useTheme()` from Task 3, `siteInfo` from Task 4.
- Produces: `<Nav />` and `<Footer />`, rendered once each from `app/layout.tsx` so every route gets them automatically.

- [ ] **Step 1: Create `components/Nav.tsx`**, porting `components/navbar.html` + `js/modules/navbar.js` (scroll progress bar, `.scrolled` toggle, hamburger/mobile menu, Escape-to-close, active-link highlighting) as one client component using `usePathname()` instead of the old `data-page` delegation:

```tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
];

export function Nav() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      setProgress(scrollable > 0 ? Math.min((window.scrollY / scrollable) * 100, 100) : 0);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  // Close the mobile menu on every route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <div id="progress-bar" role="progressbar" aria-label="Reading progress" style={{ width: `${progress}%` }} />

      <nav className={`mobile-menu${menuOpen ? ' open' : ''}`} aria-label="Mobile navigation" aria-hidden={!menuOpen}>
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="mobile-link">
            {link.label}
          </Link>
        ))}
      </nav>

      <header id="navbar" role="banner" className={scrolled ? 'scrolled' : ''}>
        <div className="container">
          <div className="nav-inner">
            <Link href="/" className="nav-logo" aria-label="Jann Carl Dungo — Home">
              <Image src="/icons/logo.png" alt="JD Logo" width={46} height={46} className="logo-img" />
            </Link>

            <nav className="nav-links" aria-label="Primary navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link${pathname === link.href ? ' active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="nav-actions">
              <button className="theme-toggle" aria-label="Toggle light/dark mode" onClick={toggleTheme}>
                {theme === 'dark' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
                  </svg>
                )}
              </button>
              <Link href="/contact" className="btn btn-primary btn-sm">Hire Me</Link>
              <button
                className={`hamburger${menuOpen ? ' open' : ''}`}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMenuOpen((o) => !o)}
              >
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
```

- [ ] **Step 2: Create `components/Footer.tsx`**, porting `components/footer.html`:

```tsx
import Link from 'next/link';
import { siteInfo } from '@/lib/content';

const FOOTER_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
];

export function Footer() {
  return (
    <footer role="contentinfo">
      <div className="container">
        <div className="footer-inner">
          <div>
            <div className="footer-brand">{siteInfo.name}</div>
            <div className="footer-copy">&copy; 2026 {siteInfo.handle}. Built with Next.js &amp; Tailwind CSS.</div>
            <div className="footer-socials">
              <a href={siteInfo.github} target="_blank" rel="noopener" className="footer-social-link" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </a>
              <a href={`mailto:${siteInfo.email}`} className="footer-social-link" aria-label="Email">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </a>
              <a href={siteInfo.linkedin} target="_blank" rel="noopener" className="footer-social-link" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="footer-link">{link.label}</Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Wire both into `app/layout.tsx`**, replacing the placeholder body from Task 3 Step 4:

```tsx
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
// ...

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${syne.variable} ${dmSans.variable} ${jetBrainsMono.variable}`}>
      <body>
        <Script id="theme-init" strategy="beforeInteractive">{THEME_INIT_SCRIPT}</Script>
        <ThemeProvider>
          <AmbientBackground />
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <Nav />
          <main id="main-content" role="main">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify the build**

```bash
npm run build
```
Expected: `Compiled successfully`.

- [ ] **Step 5: Manual QA** at `http://localhost:3000`: the fixed navbar shows the logo, 4 nav links, theme toggle, "Hire Me" button, and hamburger (hamburger hidden above 768px width). Scroll down — navbar gets a glass background and the progress bar at the very top fills as you scroll. Click the theme toggle — icon and page colors swap, and reloading the page keeps the chosen theme. Resize DevTools to ~390px wide — nav links and the Hire Me button disappear, hamburger appears; click it — a full-screen mobile menu slides in with 4 links; press Escape — it closes. Footer at the bottom shows the brand, copyright, 3 social icons, and 4 footer links.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add Nav and Footer, wire into root layout"
```

---

### Task 6: Home page

**Files:**
- Modify: `app/page.tsx` (replace Task 1 placeholder)

**Interfaces:**
- Consumes: `projects`, `capabilities`, `siteInfo` from `lib/content.ts`; `useScrollReveal` from `lib/useScrollReveal.ts`.

- [ ] **Step 1: Replace `app/page.tsx`**, porting `pages/home.html` with the spec's content cuts applied (no typewriter, no stat row, no "Currently learning" strip, jann.js fields updated, a new closing CTA reusing the `.svc-cta` classes from `services.css`, and dropping the "👋" wave emoji from the quick-about heading for tone consistency with the rest of this pass's emoji-as-chrome removal):

```tsx
import Image from 'next/image';
import Link from 'next/link';
import { projects, capabilities } from '@/lib/content';
import { HomeReveal } from './HomeReveal';

export const metadata = {
  title: 'Jann Carl Dungo | Full-Stack Developer',
  description:
    'Jann Carl Dungo (jcdungoo20) — Full-Stack Developer building efficient full-stack systems with React, Vue.js, Node.js, PHP, and REST APIs.',
};

export default function Home() {
  return (
    <HomeReveal>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-text">
              <div className="hero-eyebrow">
                <span className="status-dot" aria-hidden="true"></span>
                4th Year BSIT · Holy Angel University · Web Development
              </div>
              <h1 className="hero-name" id="hero-heading">
                Jann Carl<br /><span className="gradient-text">Dungo</span>
              </h1>
              <div className="hero-title-wrap">
                <span className="page-title" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>Full-Stack Developer</span>
              </div>
              <p className="hero-desc">
                Aspiring full-stack developer passionate about building{' '}
                <strong>structured, efficient systems</strong> using React, Vue.js, Node.js, PHP, REST APIs,
                and databases. Committed to continuous learning and eager to collaborate on meaningful projects.
              </p>

              <div className="hero-cta">
                <a className="btn btn-primary" href="/resume.pdf" download="JannCarlDungo_Resume.pdf">Download Resume</a>
                <Link className="btn btn-outline" href="/projects">View Projects →</Link>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="hero-avatar-wrap">
                <div className="avatar-ring">
                  <div className="avatar-inner avatar-photo">
                    <Image src="/images/profile.jpg" alt="Jann Carl Dungo" width={220} height={220} className="profile-photo" />
                  </div>
                </div>
              </div>

              <div className="hero-code-card" role="img" aria-label="Code snippet">
                <div className="code-header">
                  <span className="dot-red"></span><span className="dot-yellow"></span><span className="dot-green"></span>
                  <span className="code-filename">jann.js</span>
                </div>
                <div>
                  <span className="c-keyword">const</span> jann = {'{'}<br />
                  &nbsp;&nbsp;name: <span className="c-string">&apos;Jann Carl Dungo&apos;</span>,<br />
                  &nbsp;&nbsp;role: <span className="c-string">&apos;Full-Stack Developer&apos;</span>,<br />
                  &nbsp;&nbsp;frontend: [<span className="c-string">&apos;React&apos;</span>, <span className="c-string">&apos;Vue.js&apos;</span>, <span className="c-string">&apos;Angular&apos;</span>],<br />
                  &nbsp;&nbsp;backend: [<span className="c-string">&apos;Node.js&apos;</span>, <span className="c-string">&apos;Express&apos;</span>, <span className="c-string">&apos;Laravel&apos;</span>, <span className="c-string">&apos;PHP&apos;</span>],<br />
                  &nbsp;&nbsp;db: [<span className="c-string">&apos;MongoDB&apos;</span>, <span className="c-string">&apos;MySQL&apos;</span>],<br />
                  &nbsp;&nbsp;<span className="c-fn">serve</span>: <span className="c-keyword">async</span> (req, res) =&gt; {'{'}<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="c-keyword">const</span> data = <span className="c-keyword">await</span> <span className="c-fn">db.query</span>(req);<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;res.<span className="c-fn">json</span>({'{'} status: <span className="c-string">&apos;200 OK&apos;</span>, data {'}'});<br />
                  &nbsp;&nbsp;{'}'}<br />
                  {'}'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator" aria-hidden="true">
          <div className="scroll-mouse"><div className="scroll-wheel"></div></div>
          <span>scroll</span>
        </div>
      </section>

      <section className="section" aria-labelledby="capabilities-title">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-label">What I Do</div>
            <h2 className="section-title" id="capabilities-title">Where I <span className="gradient-text">add value</span></h2>
          </div>
          <ol className="svc-list" aria-label="Capabilities">
            {capabilities.map((cap, i) => (
              <li key={cap.num} className={`svc-row reveal reveal-delay-${(i % 4) + 1}`}>
                <span className="svc-num">{cap.num}</span>
                <div className="svc-body">
                  <h3 className="svc-title">{cap.title}</h3>
                  <p className="svc-desc">{cap.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="feat-title">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-label">Selected Work</div>
            <h2 className="section-title" id="feat-title">Featured <span className="gradient-text">Projects</span></h2>
            <p className="section-subtitle">Two live builds: a real client site, and a full-stack app built around a hard hosting constraint. More landing here soon.</p>
          </div>

          <div className="feat-projects-grid">
            {projects.map((project, i) => (
              <article key={project.slug} className={`feat-card reveal reveal-delay-${i + 1}`}>
                <div className="feat-card-img feat-card-img--photo">
                  <Image src={project.heroImage} alt={`${project.title} screenshot`} width={640} height={400} className="feat-card-photo" />
                  <div className="feat-card-img-overlay"></div>
                </div>
                <div className="feat-card-body">
                  <div className="feat-card-tags">
                    {project.builtWith.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  <h3 className="feat-card-title">{project.title}</h3>
                  <p className="feat-card-desc">{project.shortDesc}</p>
                  <div className="feat-card-links">
                    <Link href={`/projects/${project.slug}`} className="card-link">Read case study →</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 44 }} className="reveal">
            <Link className="btn btn-outline" href="/projects">See All Projects →</Link>
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-label="Quick intro">
        <div className="container">
          <div className="quick-about reveal">
            <div className="quick-about-photo">
              <Image src="/images/profile.jpg" alt="Jann Carl Dungo" width={200} height={200} className="quick-photo-img" />
            </div>
            <div className="quick-about-text">
              <div className="section-label">Who I Am</div>
              <h2 className="section-title" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: 12 }}>
                Hi, I&apos;m <span className="gradient-text">Jann Carl</span>
              </h2>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 20 }}>
                A BSIT student at Holy Angel University passionate about full-stack development.
                I build structured, efficient systems and explore new technologies —
                from RESTful APIs to full-stack deployments.
              </p>
              <Link className="btn btn-primary" href="/about">Read More About Me →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="cta-title">
        <div className="container">
          <div className="svc-cta reveal">
            <h2 className="svc-cta-title" id="cta-title">Have something in mind?</h2>
            <p className="svc-cta-desc">Tell me what you&apos;re building and I&apos;ll tell you honestly whether I&apos;m the right fit — and what I&apos;d have to learn first if I&apos;m not.</p>
            <div className="svc-cta-actions">
              <Link className="btn btn-primary" href="/contact">Get in touch →</Link>
              <Link className="btn btn-outline" href="/projects">See what I&apos;ve built</Link>
            </div>
          </div>
        </div>
      </section>
    </HomeReveal>
  );
}
```

- [ ] **Step 2: Create `app/HomeReveal.tsx`**, a tiny client wrapper so `useScrollReveal` (a hook, client-only) can run for this page while `app/page.tsx` itself stays a server component (needed for the `metadata` export):

```tsx
'use client';

import { useScrollReveal } from '@/lib/useScrollReveal';

export function HomeReveal({ children }: { children: React.ReactNode }) {
  useScrollReveal();
  return <>{children}</>;
}
```

- [ ] **Step 3: Verify the build**

```bash
npm run build
```
Expected: `Compiled successfully`.

- [ ] **Step 4: Manual QA** at `http://localhost:3000`: hero shows name, the fixed "Full-Stack Developer" title line (no cycling text, no cursor blinking through multiple phrases), the updated `jann.js` card (frontend: React/Vue.js/Angular, backend: Node.js/Express/Laravel/PHP), and no stat row or "Currently learning" strip anywhere. Scroll down — "What I Do" (4 rows), "Featured Projects" (WeePlay + gastos cards with working "Read case study →" links — they 404 until Task 8, that's expected for now), "Quick About", and the new closing CTA all fade in on scroll (reveal animation). Toggle dark/light theme — everything restyles correctly. At ~390px width, the hero grid stacks to one column.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Build Home page: hero, capabilities, featured projects, closing CTA"
```

---

### Task 7: About page

**Files:**
- Create: `app/about/page.tsx`, `app/about/AboutReveal.tsx`

**Interfaces:**
- Consumes: `skills`, `certifications`, `experience`, `softSkills`, `siteInfo` from `lib/content.ts`; `useScrollReveal`.

- [ ] **Step 1: Create `app/about/AboutReveal.tsx`** (same pattern as Task 6 Step 2):

```tsx
'use client';

import { useScrollReveal } from '@/lib/useScrollReveal';

export function AboutReveal({ children }: { children: React.ReactNode }) {
  useScrollReveal();
  return <>{children}</>;
}
```

- [ ] **Step 2: Create `app/about/page.tsx`**, porting `pages/about.html`'s bio/skills/experience content, replacing the 8-image certificate grid with a compact text list, dropping all emoji (contact-detail icons removed entirely — the label text already identifies each row; `.exp-icon` boxes keep their existing sizing but now hold the plain index text `01`/`02` instead of an emoji glyph; soft-skill tags and skill-category headings drop their emoji prefixes):

```tsx
import Image from 'next/image';
import Link from 'next/link';
import { skills, certifications, experience, softSkills, siteInfo } from '@/lib/content';
import { AboutReveal } from './AboutReveal';

export const metadata = {
  title: 'About | Jann Carl Dungo',
  description: 'Full-stack developer bio, skills, experience, and certifications for Jann Carl Dungo.',
};

export default function About() {
  return (
    <AboutReveal>
      <section className="section" style={{ paddingTop: 120 }} aria-labelledby="about-heading">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-label">Who I Am</div>
            <h1 className="section-title" id="about-heading">About <span className="gradient-text">Me</span></h1>
          </div>

          <div className="two-col two-col--offset" style={{ marginTop: 48 }}>
            <div className="about-photo reveal-left">
              <div className="about-photo-frame">
                <Image src="/images/profile.jpg" alt="Jann Carl Dungo — profile photo" width={320} height={400} className="about-photo-real" />
              </div>
              <div className="about-logo-below">
                <Image src="/icons/logo.png" alt="JD Logo" width={40} height={40} className="about-logo-img" />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem' }}>{siteInfo.handle}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Full-Stack Developer</div>
                </div>
              </div>
            </div>

            <div className="reveal-right">
              <div className="about-bio">
                <p>Hi, I&apos;m <strong>Jann Carl Dungo</strong> — a 4th year BSIT student at <strong>Holy Angel University</strong>, majoring in Web Development, with a strong interest in full-stack development and building structured, efficient systems.</p>
                <p>I enjoy working on academic and personal projects that improve my programming and problem-solving skills. My core focus spans the full stack — backend technologies like Node.js, Express.js, PHP, JWT Authentication, and RESTful API design, paired with frontend frameworks like React, Vue.js, and Angular.</p>
                <p>Previously served as a <strong>Student Aide at the HAU University Library</strong> and the HAU Store. Based in Sapang Maisac, Mexico, Pampanga. Open to internships, freelance full-stack work, and collaborations.</p>
              </div>

              <div className="about-contact-list">
                <div className="contact-detail">
                  <div><div className="contact-detail-label">Phone</div><a href={siteInfo.phoneHref} className="contact-detail-val">{siteInfo.phone}</a></div>
                </div>
                <div className="contact-detail">
                  <div><div className="contact-detail-label">Email</div><a href={`mailto:${siteInfo.email}`} className="contact-detail-val">{siteInfo.email}</a></div>
                </div>
                <div className="contact-detail">
                  <div><div className="contact-detail-label">Location</div><div className="contact-detail-val">{siteInfo.location}</div></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 24 }}>
                <a className="btn btn-primary" href="/resume.pdf" download="JannCarlDungo_Resume.pdf">Download Resume</a>
                <Link className="btn btn-outline" href="/contact">Get in Touch</Link>
              </div>

              <div className="soft-skills-row" style={{ marginTop: 24 }}>
                {softSkills.map((skill) => (
                  <span key={skill} className="soft-skill">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="skills-heading">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-label">Technical Skills</div>
            <h2 className="section-title" id="skills-heading">Skills &amp; <span className="gradient-text">Technologies</span></h2>
          </div>
          <div className="skill-categories">
            {skills.map((cat, i) => (
              <div key={cat.title} className={`skill-cat-card reveal reveal-delay-${i + 1}`}>
                <div className="skill-cat-title">{cat.title}</div>
                <ul className="skill-list">
                  {cat.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="certs-heading">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-label">Credentials</div>
            <h2 className="section-title" id="certs-heading">My <span className="gradient-text">Certifications</span></h2>
            <p className="section-subtitle">All certifications are real and verifiable — click through to confirm any of them.</p>
          </div>

          <ul className="cert-list reveal" aria-label="Certifications">
            {certifications.map((cert) => (
              <li key={cert.name} className="cert-row">
                <div className="cert-row-body">
                  <div className="cert-row-name">{cert.name}</div>
                  <div className="cert-row-meta">{cert.issuer} · {cert.date}</div>
                </div>
                <a href={cert.verifyUrl} target="_blank" rel="noopener" className="card-link">Verify →</a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="exp-heading">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-label">Work Experience</div>
            <h2 className="section-title" id="exp-heading">Student <span className="gradient-text">Experience</span></h2>
          </div>
          <div className="exp-grid">
            {experience.map((job, i) => (
              <div key={job.title} className={`exp-card reveal reveal-delay-${i + 1}`}>
                <div className="exp-icon">{job.index}</div>
                <div className="exp-body">
                  <div className="exp-title">{job.title}</div>
                  <div className="exp-org">{job.org} · {job.period}</div>
                  <ul className="exp-list">
                    {job.bullets.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AboutReveal>
  );
}
```

- [ ] **Step 3: Add the compact certification list styles** — `.cert-list`/`.cert-row`/`.cert-row-body`/`.cert-row-name`/`.cert-row-meta` are new (the old design only ever had the image-card version). Append to `app/styles/pages/about.css`:

```css
/* ── Compact certification list (replaces the old image-grid) ── */
.cert-list { display: flex; flex-direction: column; }
.cert-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
}
.cert-row:last-child { border-bottom: none; }
.cert-row-name { font-weight: 700; font-size: 0.95rem; }
.cert-row-meta { font-size: 0.8rem; color: var(--text-3); font-family: var(--font-mono); margin-top: 2px; }

@media (max-width: 480px) {
  .cert-row { flex-direction: column; align-items: flex-start; gap: 6px; }
}
```

- [ ] **Step 4: Verify the build**

```bash
npm run build
```
Expected: `Compiled successfully`.

- [ ] **Step 5: Manual QA** at `http://localhost:3000/about`: bio renders 3 paragraphs, contact rows show Phone/Email/Location as plain label+value pairs (no icon boxes), soft-skill tags show plain text (no emoji), 4 skill categories render with plain headings, the certifications section shows 8 rows (no images) each with a working "Verify →" link opening in a new tab, and the experience section shows 2 cards with `01`/`02` in the icon box instead of an emoji. Toggle theme and check ~390px width — cert rows stack to one column per the added media query.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Build About page with compact certification list"
```

---

### Task 8: Projects index + case-study route + ProjectCard

**Files:**
- Create: `app/projects/page.tsx`, `app/projects/ProjectsReveal.tsx`, `app/projects/[slug]/page.tsx`, `components/ProjectCard.tsx`

**Interfaces:**
- Consumes: `projects: Project[]` from `lib/content.ts`.
- Produces: `<ProjectCard project={Project} />` (used by the projects index; Home already builds its own featured-card markup directly in Task 6, so this component is index-only — keeps the index's card layout in one place without forcing Home to use an identical layout it doesn't need).

- [ ] **Step 1: Create `components/ProjectCard.tsx`**

```tsx
import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/lib/content';

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <li className={`proj-row reveal reveal-delay-${index + 1}`}>
      <span className="proj-row-num">{String(index + 1).padStart(2, '0')}</span>
      <div className="proj-row-body">
        <h2 className="proj-row-title">{project.title}</h2>
        <p className="proj-row-desc">{project.shortDesc}</p>
        <span className="proj-row-meta"><span className="proj-row-dot" aria-hidden="true"></span>{project.frameUrl}</span>
      </div>
      <Link href={`/projects/${project.slug}`} className="proj-row-btn" aria-label={`Open ${project.title} case study`}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M6 14 14 6M14 6H8M14 6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </Link>
    </li>
  );
}
```

- [ ] **Step 2: Create `app/projects/ProjectsReveal.tsx`** (same reveal-wrapper pattern as Tasks 6–7):

```tsx
'use client';

import { useScrollReveal } from '@/lib/useScrollReveal';

export function ProjectsReveal({ children }: { children: React.ReactNode }) {
  useScrollReveal();
  return <>{children}</>;
}
```

- [ ] **Step 3: Create `app/projects/page.tsx`**, porting the index half of `pages/projects.html` (the hover-swaps-preview behavior and the modal are dropped — each row now links straight to its own real route):

```tsx
import Image from 'next/image';
import { projects } from '@/lib/content';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectsReveal } from './ProjectsReveal';

export const metadata = {
  title: 'Projects | Jann Carl Dungo',
  description: 'Real client and personal projects built by Jann Carl Dungo — WeePlay Therapy Center and gastos.',
};

export default function Projects() {
  return (
    <ProjectsReveal>
      <section className="section" style={{ paddingTop: 120 }} aria-labelledby="proj-heading">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-label">Portfolio</div>
            <h1 className="section-title" id="proj-heading">What I&apos;ve built — <span className="gradient-text">and what I can do</span></h1>
            <p className="section-subtitle">Real client and personal work. Open any one to read how it was built and what it had to solve.</p>
          </div>

          <div className="proj-index reveal">
            <ol className="proj-rows" aria-label="Project list">
              {projects.map((project, i) => (
                <ProjectCard key={project.slug} project={project} index={i} />
              ))}
            </ol>

            <div className="proj-preview" aria-hidden="true">
              <div className="proj-preview-frame">
                <div className="proj-preview-bar">
                  <span className="proj-preview-dot"></span><span className="proj-preview-dot"></span><span className="proj-preview-dot"></span>
                </div>
                <Image src={projects[0].heroImage} alt="" width={640} height={400} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </ProjectsReveal>
  );
}
```

- [ ] **Step 4: Create `app/projects/[slug]/page.tsx`**, replacing the old JS-driven modal (`#proj-viewer` + `<template>` tags) with a real, linkable route:

```tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects, siteInfo } from '@/lib/content';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return {};
  return { title: `${project.title} | Jann Carl Dungo`, description: project.lede };
}

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const index = projects.findIndex((p) => p.slug === params.slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <section className="section" style={{ paddingTop: 120 }}>
      <div className="container">
        <div className="pv-hero">
          <span className="pv-watermark" aria-hidden="true">{project.title}</span>
          <div className="pv-hero-text">
            <div className="pv-eyebrow">{project.eyebrow}</div>
            <h1 className="pv-title">{project.title}</h1>
            <p className="pv-lede">{project.lede}</p>
            <div className="pv-roles">
              {project.roles.map((role) => <span key={role} className="pv-role">{role}</span>)}
            </div>
            <div className="pv-links">
              <a href={project.liveUrl} target="_blank" rel="noopener" className="btn btn-primary">Live site →</a>
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener" className="btn btn-outline">GitHub</a>
              )}
            </div>
          </div>
          <div className="pv-frame">
            <div className="pv-frame-bar">
              <span className="pv-frame-dot"></span><span className="pv-frame-dot"></span><span className="pv-frame-dot"></span>
              <span className="pv-frame-url">{project.frameUrl}</span>
            </div>
            <Image src={project.heroImage} alt={`${project.title} screenshot`} width={960} height={600} />
          </div>
        </div>

        <div className="pv-case">
          <div className="pv-case-label">Case study</div>

          <div className="pv-case-block">
            <div className="pv-case-head">The problem</div>
            <p>{project.problem}</p>
          </div>

          <div className="pv-case-block">
            <div className="pv-case-head">What I did</div>
            <ul className="pv-case-list pv-case-list--did">
              {project.whatIDid.map((line) => <li key={line}>{line}</li>)}
            </ul>
          </div>

          <div className="pv-case-block">
            <div className="pv-case-head">Outcome</div>
            <ul className="pv-case-list pv-case-list--out">
              {project.outcome.map((line) => <li key={line}>{line}</li>)}
            </ul>
          </div>
        </div>

        <div className="pv-built">
          <div className="pv-built-label">Built with</div>
          <div className="pv-built-chips">
            {project.builtWith.map((tech) => <span key={tech} className="pv-chip">{tech}</span>)}
          </div>
        </div>

        <div className="pv-cta">
          <h2 className="pv-cta-title">Want something like this built for you?</h2>
          <p className="pv-cta-desc">Tell me what you have in mind — no obligation, just a quick chat to see if we&apos;re a fit.</p>
          <div className="pv-cta-actions">
            <a className="btn btn-primary" href={`mailto:${siteInfo.email}`}>{siteInfo.email}</a>
          </div>
        </div>

        <div className="pv-next">
          <span className="pv-next-label">Next project</span>
          <Link href={`/projects/${next.slug}`} className="pv-next-btn">{next.title} →</Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Adjust `app/styles/pages/projects.css` for the route-based layout** — the old `.pv-hero`/`.pv-case`/`.pv-built`/`.pv-cta`/`.pv-next` rules were originally scoped for use *inside* `#proj-viewer` (a fixed-position modal panel with its own scroll container). Open `app/styles/pages/projects.css` and remove any rule scoped under `.proj-viewer`/`#proj-viewer`/`.pv-body` ancestor selectors (e.g. `.proj-viewer .pv-hero { ... }`), keeping the bare `.pv-hero`, `.pv-case`, etc. rules so they apply directly inside the new page's `.section`/`.container`. Also delete the now-unused `.proj-viewer`, `.proj-viewer-backdrop`, `.proj-viewer-panel`, `.pv-topbar*`, `.pv-counter`, `.pv-nav-btn`, `.pv-close` rules — those were the modal chrome, which no longer exists.

- [ ] **Step 6: Verify the build**

```bash
npm run build
```
Expected: `Compiled successfully`. Confirm the build output lists `/projects/weeplay` and `/projects/gastos` as prerendered static routes.

- [ ] **Step 7: Manual QA**: at `http://localhost:3000/projects`, confirm 2 numbered rows (WeePlay, gastos) each with a working arrow-button link. Click into `/projects/weeplay` — full case study renders (problem/what I did/outcome/built-with/CTA/next-project link to gastos); click "gastos →" at the bottom — navigates to `/projects/gastos` and its next-project link points back to weeplay. Visit `/projects/does-not-exist` directly — confirm Next's default 404 page renders (via `notFound()`). Check both themes and ~390px width on both the index and a case-study page.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Build Projects index and dynamic case-study route"
```

---

### Task 9: Contact page + EmailJS form

**Files:**
- Create: `app/contact/page.tsx`, `app/contact/ContactReveal.tsx`, `components/ContactForm.tsx`

**Interfaces:**
- Consumes: `siteInfo` from `lib/content.ts` (including `siteInfo.emailjs`); `useScrollReveal` from `lib/useScrollReveal.ts`.
- Produces: `<ContactForm />`, a self-contained client component (no props) rendering the form and handling its own validation/submit/success/error states.

- [ ] **Step 1: Create `components/ContactForm.tsx`**, porting `js/modules/form.js`'s validation rules and EmailJS call into React state (no more manual DOM class toggling or form-cloning to strip old listeners — React re-render replaces that entirely):

```tsx
'use client';

import { useState, type FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { siteInfo } from '@/lib/content';

type FieldName = 'name' | 'email' | 'subject' | 'message';

const VALIDATORS: Record<FieldName, (v: string) => boolean> = {
  name: (v) => v.trim().length > 1,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  subject: (v) => v.trim().length > 2,
  message: (v) => v.trim().length >= 20,
};

const ERROR_MESSAGES: Record<FieldName, string> = {
  name: 'Please enter your name.',
  email: 'Please enter a valid email.',
  subject: 'Please enter a subject.',
  message: 'Please write a message (min. 20 characters).',
};

type Status = 'idle' | 'sending' | 'success' | 'error';

export function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');

  function update(field: FieldName, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  function clearError(field: FieldName) {
    setErrors((e) => ({ ...e, [field]: false }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const nextErrors: Partial<Record<FieldName, boolean>> = {};
    (Object.keys(VALIDATORS) as FieldName[]).forEach((field) => {
      nextErrors[field] = !VALIDATORS[field](values[field]);
    });
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setStatus('sending');
    try {
      await emailjs.send(
        siteInfo.emailjs.serviceId,
        siteInfo.emailjs.templateId,
        {
          from_name: values.name,
          from_email: values.email,
          subject: values.subject,
          message: values.message,
        },
        { publicKey: siteInfo.emailjs.publicKey }
      );
      setStatus('success');
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <h3>Message Sent!</h3>
        <p>Thanks for reaching out! I&apos;ll get back to you as soon as possible.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
      <div className="form-group">
        <label className="form-label" htmlFor="cf-name">Your Name</label>
        <input
          className={`form-input${errors.name ? ' error' : ''}`}
          type="text" id="cf-name" name="from_name" placeholder="Juan dela Cruz" autoComplete="name"
          aria-required="true" aria-invalid={errors.name || undefined}
          value={values.name} onChange={(e) => update('name', e.target.value)} onBlur={() => clearError('name')}
        />
        {errors.name && <span className="form-error visible" role="alert">{ERROR_MESSAGES.name}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="cf-email">Your Email</label>
        <input
          className={`form-input${errors.email ? ' error' : ''}`}
          type="email" id="cf-email" name="from_email" placeholder="juan@example.com" autoComplete="email"
          aria-required="true" aria-invalid={errors.email || undefined}
          value={values.email} onChange={(e) => update('email', e.target.value)} onBlur={() => clearError('email')}
        />
        {errors.email && <span className="form-error visible" role="alert">{ERROR_MESSAGES.email}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="cf-subject">Subject</label>
        <input
          className={`form-input${errors.subject ? ' error' : ''}`}
          type="text" id="cf-subject" name="subject" placeholder="Internship / Collaboration / etc." autoComplete="off"
          aria-required="true" aria-invalid={errors.subject || undefined}
          value={values.subject} onChange={(e) => update('subject', e.target.value)} onBlur={() => clearError('subject')}
        />
        {errors.subject && <span className="form-error visible" role="alert">{ERROR_MESSAGES.subject}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="cf-message">Message</label>
        <textarea
          className={`form-textarea${errors.message ? ' error' : ''}`}
          id="cf-message" name="message" placeholder="Tell me about the opportunity..." rows={5}
          aria-required="true" aria-invalid={errors.message || undefined}
          value={values.message} onChange={(e) => update('message', e.target.value)} onBlur={() => clearError('message')}
        />
        {errors.message && <span className="form-error visible" role="alert">{ERROR_MESSAGES.message}</span>}
      </div>

      {status === 'error' && (
        <p className="form-error visible" role="alert" style={{ marginBottom: 12 }}>
          Couldn&apos;t send that — try again, or email {siteInfo.email} directly.
        </p>
      )}

      <button type="submit" className={`submit-btn${status === 'sending' ? ' loading' : ''}`} disabled={status === 'sending'} aria-label="Send message">
        {status === 'sending' && <div className="spinner" aria-hidden="true" />}
        <span className="btn-text">{status === 'sending' ? 'Sending…' : 'Send Message →'}</span>
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Create `app/contact/ContactReveal.tsx`** (same reveal-wrapper pattern as Tasks 6–8, needed because `page.tsx` must stay a server component for its `metadata` export, while `useScrollReveal` is a client-only hook):

```tsx
'use client';

import { useScrollReveal } from '@/lib/useScrollReveal';

export function ContactReveal({ children }: { children: React.ReactNode }) {
  useScrollReveal();
  return <>{children}</>;
}
```

- [ ] **Step 3: Create `app/contact/page.tsx`**, porting `pages/contact.html`'s info column (contact detail rows now plain text, no emoji icons) plus `<ContactForm />`, wrapped in `<ContactReveal>`:

```tsx
import { siteInfo } from '@/lib/content';
import { ContactForm } from '@/components/ContactForm';
import { ContactReveal } from './ContactReveal';

export const metadata = {
  title: 'Contact | Jann Carl Dungo',
  description: 'Get in touch with Jann Carl Dungo for internships, freelance full-stack work, or collaborations.',
};

export default function Contact() {
  return (
    <ContactReveal>
    <section className="section" style={{ paddingTop: 120 }} aria-labelledby="contact-heading">
      <div className="container">
        <div className="section-head reveal">
          <div className="section-label">Get In Touch</div>
          <h1 className="section-title" id="contact-heading">Let&apos;s <span className="gradient-text">Connect</span></h1>
          <p className="section-subtitle">Open to internship opportunities, freelance full-stack projects, and academic collaborations.</p>
        </div>

        <div className="contact-grid">
          <div className="reveal-left">
            <div className="contact-info">
              <h3>Say Hello</h3>
              <p>Whether you&apos;re looking for a full-stack developer intern, want to collaborate on a project, or just want to connect — feel free to reach out!</p>

              <div className="contact-detail">
                <div><div className="contact-detail-label">Phone</div><a href={siteInfo.phoneHref} className="contact-detail-val">{siteInfo.phone}</a></div>
              </div>
              <div className="contact-detail">
                <div><div className="contact-detail-label">Email</div><a href={`mailto:${siteInfo.email}`} className="contact-detail-val">{siteInfo.email}</a></div>
              </div>
              <div className="contact-detail">
                <div><div className="contact-detail-label">Location</div><div className="contact-detail-val">{siteInfo.location}</div></div>
              </div>
              <div className="contact-detail">
                <div><div className="contact-detail-label">University</div><div className="contact-detail-val">{siteInfo.university}</div></div>
              </div>
              <div className="contact-detail">
                <div><div className="contact-detail-label">Status</div><div className="contact-detail-val" style={{ color: 'var(--green)' }}>● Open to opportunities</div></div>
              </div>
              <div className="contact-detail">
                <div><div className="contact-detail-label">Response Time</div><div className="contact-detail-val">I typically reply within <strong>24–48 hours</strong>.</div></div>
              </div>

              <div className="social-links" aria-label="Social media links">
                <a href={siteInfo.github} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub" title="GitHub">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                </a>
                <a href={`mailto:${siteInfo.email}`} className="social-link" aria-label="Email" title="Email">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </a>
                <a href={siteInfo.linkedin} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn" title="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="reveal-right">
            <div className="contact-form">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
    </ContactReveal>
  );
}
```

- [ ] **Step 4: Verify the build**

```bash
npm run build
```
Expected: `Compiled successfully`.

- [ ] **Step 5: Manual QA** at `http://localhost:3000/contact`: info column shows Say Hello copy, 6 contact-detail rows (Phone/Email/Location/University/Status/Response Time) as plain label+value text with no icons, and 3 working social links. Fill the form with an invalid email and a 5-character message, submit — inline errors appear under email and message, nothing sends. Fix both fields and submit with real values — button shows "Sending…" with a spinner, then either the success panel replaces the form ("Message Sent!") or, if EmailJS rejects the request (e.g. dashboard quota), the inline error line appears below the fields with the fallback "email jcdungo20@gmail.com directly" message and the button re-enables. Either outcome confirms the wiring is correct; if it errors, check the EmailJS dashboard for `service_6vyl1sy` per the Global Constraints note before assuming a code bug.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Build Contact page with EmailJS-powered form"
```

---

### Task 10: Final cleanup, README, and full QA pass

**Files:**
- Modify: `README.md`
- Verify only (no source changes expected): everything from Tasks 1–9

**Interfaces:** none (integration/QA task).

- [ ] **Step 1: Confirm no stray references to the deleted vanilla infra remain**

```bash
grep -rn "data-page=" app components lib 2>/dev/null
grep -rn "main.js\|router.js\|loader.js" app components lib 2>/dev/null
```
Expected: no matches (both commands print nothing).

- [ ] **Step 2: Rewrite `README.md`** to describe the actual current stack instead of the vanilla one. Replace the "About" tech description and the "Features" section's "SPA routing" bullet with:

```markdown
# Jann Carl Dungo — Developer Portfolio (`jcdungoo20`)

A professional full-stack developer portfolio built with **Next.js (App Router)**,
**TypeScript**, and **Tailwind CSS**.

**Full-Stack Developer · 4th Year BSIT · Holy Angel University · Web Development Major · Sapang Maisac, Mexico, Pampanga**

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 3, bridged to the site's existing monochrome design tokens
- `@emailjs/browser` for the contact form
- Deployed on Vercel

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

## Routes

- `/` — Home
- `/about` — Bio, skills, certifications, experience
- `/projects` — Project index
- `/projects/[slug]` — Case studies (`weeplay`, `gastos`)
- `/contact` — Contact form
```

Keep the rest of the file (License section etc.) as-is if present below this point.

- [ ] **Step 3: Run the full build one more time**

```bash
npm run build
```
Expected: `Compiled successfully`, with `/`, `/about`, `/projects`, `/contact`, `/projects/weeplay`, and `/projects/gastos` all listed in the route summary.

- [ ] **Step 4: Run lint**

```bash
npm run lint
```
Expected: no errors (warnings are acceptable but should be looked at).

- [ ] **Step 5: Full manual QA pass** across all 4 top-level routes plus both case-study pages, at `http://localhost:3000`:
  - Both themes (toggle button) on every route — no unstyled flashes, no leftover cyan/violet accent color anywhere.
  - Desktop width and ~390px width on every route — nav collapses to hamburger, grids collapse to one column, no horizontal scrollbar anywhere (check by watching for a horizontal scrollbar or content overflowing the viewport at 390px).
  - Every internal link (`Nav`, `Footer`, hero CTAs, "See All Projects", "Read case study", "Next project", "Read More About Me", closing CTA) resolves to a real page — no dead links, no reliance on `data-page`.
  - The contact form end-to-end send (already covered in Task 9 Step 5) — re-confirm once more here since it's the one piece of user-facing functionality with an external dependency.
  - `assets/resume.pdf` downloads correctly from both the Home hero and the About page buttons (same file, now served from `/public/resume.pdf`) — note for the user that its content is still stale (3rd year / Backend Developer / Library "Present") per the existing open item; that regeneration is out of scope for this plan.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Update README for Next.js stack, final QA pass"
```

- [ ] **Step 7: Report status to the user** — do NOT push to `origin/nextjs-redesign` or open a PR to `main` automatically. Summarize what was built, flag the still-open items carried over from the spec (EmailJS dashboard confirmation, stale `resume.pdf`, phone-number-visibility decision), and let the user decide when to push commits and whether/when to merge into `main`.

---

## Self-Review Notes

- **Spec coverage:** stack (Task 1–2), palette/tokens (Task 2), 4-page nav + dynamic project routes (Tasks 5, 6–9), resume page dropped / PDF still downloadable (Tasks 6, 7), services folded into Home (Task 6), 2 case studies only (Task 4, 8), compact-text certifications (Task 7), no emoji as chrome (Tasks 5–9, called out explicitly per page), EmailJS kept + service-id ambiguity resolved (Task 9, Global Constraints), kept motion system incl. ambient blobs/particles (Task 3), dropped typewriter/stat-row/learning-strip (Task 6), manual QA in lieu of automated tests (every task's verification step + Task 10) — all covered.
- **Type consistency:** `Project`, `SkillCategory`, `Certification`, `ExperienceEntry`, `Capability` types defined once in Task 4 and consumed with matching field names (`slug`, `heroImage`, `frameUrl`, `builtWith`, `whatIDid`, `outcome`, etc.) in Tasks 6, 8, and 9 — no renamed fields across tasks. `useTheme()`'s `{ theme, toggleTheme }` shape (Task 3) matches its only consumer, `Nav.tsx` (Task 5). `useScrollReveal()` has the same no-argument, no-return signature everywhere it's called (Tasks 6–9).
- **Placeholder scan:** every code step contains real, complete code or a fully-specified mechanical file operation (exact source path → exact destination path) rather than a vague instruction — no "TBD"/"add appropriate handling"/"similar to Task N" patterns.
