# Developer Mode elevation — design spec

**Date:** 2026-09-02
**Status:** Approved by user, proceeding to implementation plan

## Context

A working "Developer Mode" already exists on the `devmode` branch: a `DeveloperModeProvider` (SSR-safe, localStorage-persisted), a `ModeTransition` glow flash, a full separate `/lab` route (rail navigation across six modules — About, Archive, Stack, Experience, Certifications, Contact), a shared-layout project "slab" expand in the Archive module, a cursor-reactive spotlight backdrop, an iris-wipe entrance sequence, and a set of Motion.dev primitives (`TiltCard`, `MagneticButton`, `NavActiveIndicator`, `Crossfade`) that quietly activate on the homepage itself once dev mode is on. Everything funnels through one `useMotionEnabled()` gate (`devMode && !prefersReducedMotion`), lazy-loads via `next/dynamic`, and has real accessibility work already in place (roving tabindex, focus management, `aria-current`, reduced-motion fallbacks throughout).

This is a strong, working foundation — not a rebuild. `npx tsc --noEmit` is clean and `/lab` compiles and serves with no runtime errors. The goal of this spec is a **targeted elevation pass** on the three places the current build under-delivers against the creative brief (see prior conversation for the full brief): visual identity reads as a generic "dark technical portfolio" rather than something distinctive; the rail+stage navigation reads as a settings panel rather than a space being explored; and the mode transition is a flash-then-page-reload rather than a single continuous transformation.

The Developer Mode entry point stays exactly as it is today: a button in `Nav.tsx` (`dev-toggle`) that turns dev mode on and redirects (`router.push('/lab?enter=1')`) into `/lab`. This spec changes how that redirect *feels*, not whether it happens.

## 1. Visual identity — "layered workbench"

Keep the existing tokens (`--lab-bg`, `--lab-accent` cyan, mono type as primary voice) — they're restrained and on-brand, not the problem. The problem is everything sits on one flat plane. Introduce three real depth layers under `.lab-root`:

- **Backdrop layer** (existing `LabBackdrop`/grid): unchanged content, but gains a slow, subtle drift and a scroll-linked parallax offset (via `useScroll`/`useTransform`) inside the active stage panel, so scrolling a longer module (e.g. Experience) reads as moving through the space rather than scrolling a static list.
- **Rail layer**: becomes a distinct floating glass plane — a soft backdrop-blur, faint shadow, and a hairline border that reads as sitting *above* the backdrop rather than flush against it. No new component; this is a CSS treatment on `.lab-rail`.
- **Stage layer**: unchanged position (closest to viewer), but module headlines get more display-type contrast (larger, tighter tracking) to read as designed content rather than a docs page.

**New visual device — the trace line.** A single thin accent-colored line/SVG path that animates from the clicked rail item to the incoming module's header on every switch. This is the one original, memorable touch the brief calls for; it must stay restrained (1–2px, one color, no glow bloom) so it doesn't slide into the "excessive glowing borders" anti-pattern. Implemented as a small SVG overlay positioned between `.lab-rail` and `.lab-stage`, animated with Motion's `pathLength`/`opacity` on module change, gated by `useMotionEnabled()` with an instant (no-line) fallback under reduced motion.

## 2. Navigation — depth-push module switching

`StageTransition` (in `labMotion.tsx`) currently does opacity + y + scale on module change. Extend it: the outgoing panel also gets a slight blur and recedes (scales further down, e.g. 0.97 vs today's 0.99) while incoming arrives a hair closer (scale from 1.02 → 1), paired with the trace-line animating into the new header. Timing stays close to the current 0.32s — the brief is explicit that transitions must never feel slow. `LabRail` itself is unchanged functionally (same keyboard model, same `aria-current`); only the stage-transition visuals and the new trace-line change.

## 3. Project Archive — the hero interaction

Two concrete upgrades to `ArchiveModule`/`ArchiveEntry`, no change to the underlying data model or shared-layout mechanism (`layoutId` grow is the right call, kept as-is):

- **Sibling recede.** Today, when one project slab expands, `.lab-archive-grid--focused` just collapses the grid to one column — the other project's slab head still renders as a plain second row. Change: the non-expanded sibling gets a `lab-slab--receded` state (reduced opacity, slight scale-down, `pointer-events` kept for re-collapse) so expanding one project visibly reads as "focusing into it," not "the grid reflowed."
- **Stat count-up.** `project.stats` (already real data — e.g. "10 / 12 serverless functions", "$0/mo") animate from 0 (or from a dash) to their real value on expand, using Motion's `animate()` on a numeric motion value with a text-formatting `onUpdate`. Purely additive to the existing `<dl>` markup; falls back to the plain static value under reduced motion / `useMotionEnabled() === false`.

No change to `ScreenWalker`/`Crossfade` usage inside the expanded panel — that's already solid.

## 4. Mode transition — one continuous gesture

**Current behavior:** click `dev-toggle` → `ModeTransition`'s radial glow flash plays *if* not suppressed → `router.push('/lab?enter=1')` → new page mounts → `LabIntroGate` detects `enter=1` → `LabIntro` plays its own independent iris-wipe + "Loading the archive… / Warming up the workspace… / Ready." beats. Two disconnected animations (flash, then a second wipe after a route change) rather than one transformation.

**New behavior:**
1. On `handleDevToggle`'s "entering" branch (`Nav.tsx`), instead of `suppressNextModeTransition()` + immediate `router.push`, trigger a wipe animation *on the current page*: a `clip-path: circle()` overlay expanding from the toggle button's screen position (top-right, where it visually sits) to full coverage. This reuses the existing iris-wipe visual language from `IntroSequence`, just relocated to fire pre-navigation instead of post-navigation.
2. Once the wipe fully covers the viewport (overlay opaque, ~450–550ms), set a short-lived `sessionStorage` flag (same pattern as the existing `portfolio-lab-exit` flag) and call `router.push('/lab?enter=1')`.
3. `/lab` mounts underneath the still-opaque overlay (already dark, so there's no flash-of-unstyled-content). `LabIntroGate` reads the new flag alongside `enter=1`: if present, skip the full iris-wipe (already played) and run only the short "Ready." beat as the reveal, then clear the overlay. If a visitor arrives at `/lab?enter=1` *without* the flag (direct link, bookmark, shared URL — the case `LabIntroGate` exists for today), the full iris-wipe still plays exactly as it does now — this path is unchanged.
4. Exit (`LabExperience.handleExit`) gets the mirrored treatment: replace the current blur+opacity fade with a matching wipe-close (circle collapsing back toward the exit button's position) before `router.push('/')`.

**Engineering note (the one real trade-off):** this needs the wipe overlay to survive the route boundary without becoming a heavyweight persistent cross-route component. Approach: a small dedicated overlay component mounted once in the root layout (sibling to the existing `ModeTransition`, same module-scoped-signal pattern already used for `suppressNextModeTransition`) that owns just the wipe animation and the sessionStorage handoff flag — no shared context, no re-render cost on unrelated pages. This is additive to the existing architecture, not a rework of `DeveloperModeProvider` or the routing model.

## What's explicitly out of scope

- The six-module set and their content (About/Archive/Stack/Experience/Certifications/Contact) — unchanged.
- `lib/content.ts` data — no invented achievements/technologies; all animated values (stat count-ups) come from existing real fields.
- Mobile rail-as-bottom-bar pattern — kept; depth/parallax effects degrade gracefully (backdrop parallax and trace-line both already sit behind `useMotionEnabled()`, which itself doesn't distinguish input type, so touch visitors get the same motion minus anything hover-only).
- Professional Mode's homepage bonus-polish primitives (`TiltCard`, `MagneticButton`, `NavActiveIndicator`, `Crossfade`, spring scroll-reveal) — unchanged.
- Accessibility mechanisms already in place (focus trap, roving tabindex, `aria-current`, reduced-motion fallbacks) — preserved as-is; all new motion (trace line, depth-push, stat count-up, wipe transition) is added *behind* the existing `useMotionEnabled()` gate with a static/instant fallback, never a new ungated animation.
