# Developer Mode Elevation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the existing, working Developer Mode (`/lab`) on three specific axes — visual identity, module navigation, and the mode-entry/exit transition — without touching its content, data, or accessibility mechanisms.

**Architecture:** Additive changes on top of the existing `useMotionEnabled()`-gated Motion.dev architecture (`components/motion/enhancements.tsx`, `components/lab/labMotion.tsx`). New motion primitives follow the established pattern: a thin `'use client'` wrapper checks `useMotionEnabled()` and `dynamic()`-imports the real implementation from the shared `labMotion.tsx` chunk, with a static/instant fallback when motion is off. The mode-entry/exit transition adds one new cross-route piece — a `ModeWipeOverlay` mounted once in the root layout — coordinated with `Nav.tsx` and `LabExperience.tsx` via a tiny module-scoped signal (`lib/labWipeSignal.ts`), following the same "one-shot signal between unrelated components" pattern already used by `suppressNextModeTransition()`.

**Tech Stack:** Next.js 15 (App Router), React 19, `motion` (Motion for React) — already installed (`^13.1.1`), no new dependencies.

## Global Constraints

- No new npm dependencies — `motion` is already installed; everything here uses it.
- Every new animation must be gated behind `useMotionEnabled()` (`devMode && !prefersReducedMotion`) with a static/instant fallback — never an ungated animation. This project has no separate "reduced motion" flag to thread through by hand; the hook already accounts for it.
- No invented data. Any animated value (e.g. archive stats) must come from `lib/content.ts` as it exists today — do not add fake metrics or copy.
- This project has no test runner (`package.json` only defines `dev`/`build`/`start`/`lint`). The verification loop for every task is: `npx tsc --noEmit` (must exit clean), `npm run lint` (must exit clean), and a manual check against `npm run dev` as described in that task's verification step. Do not add a test framework as part of this plan.
- Follow existing file conventions exactly: real `motion/react` usage for `/lab` lives only in `components/lab/labMotion.tsx`; real `motion/react` usage for the homepage's "bonus polish" primitives lives only in `components/motion/enhancements.tsx`. Every call site is a thin gate + `dynamic()` import, never a direct import of `motion/react` outside those two files.
- Keep commits small and scoped to one task each.

---

## Task 0: Lift Developer Mode color tokens to global scope

**Files:**
- Modify: `app/styles/base/variables.css`
- Modify: `app/styles/lab/lab.css:12-31`

**Interfaces:**
- Produces: `--lab-bg`, `--lab-bg-2`, `--lab-surface`, `--lab-surface-2`, `--lab-border`, `--lab-border-2`, `--lab-text`, `--lab-text-2`, `--lab-text-3`, `--lab-accent`, `--lab-spot` as global `:root` custom properties (previously scoped only under `.lab-root`). Every later task that needs a lab color (Task 8's `ModeWipeOverlay`, which renders outside `.lab-root`) reads these directly.

`--lab-bg` etc. currently only exist inside `.lab-root`'s own selector in `lab.css`, so nothing outside `/lab` can reference them. Task 8 needs `--lab-bg` from a component mounted in the root layout, above and outside `/lab`. Move the token definitions to the site's single source of truth for design tokens (`variables.css`), then have `.lab-root` reference them instead of redefining them.

- [ ] **Step 1: Add the lab tokens to `variables.css`**

Open `app/styles/base/variables.css` and add this new block immediately after the `[data-theme="light"] { ... }` block (after line 138, at the end of the file):

```css

/* ── DEVELOPER MODE TOKENS (theme-independent) ──────────
   /lab is deliberately dark regardless of the light/dark toggle (see
   app/styles/lab/lab.css's header comment) — these live here, not scoped
   under .lab-root, so cross-route pieces like the mode-transition wipe
   overlay (components/ModeWipeOverlay.tsx) can read them without
   duplicating the values or hard-coding a hex outside this file. */
:root {
  --lab-bg: #08090b;
  --lab-bg-2: #0e1013;
  --lab-surface: #121519;
  --lab-surface-2: #191d22;
  --lab-border: rgba(255, 255, 255, 0.08);
  --lab-border-2: rgba(255, 255, 255, 0.16);
  --lab-text: #eef0f2;
  --lab-text-2: #99a0a8;
  --lab-text-3: #6c7278;
  --lab-accent: #7dd3fc;
  --lab-spot: rgba(125, 211, 252, 0.10);
}
```

- [ ] **Step 2: Remove the duplicate definitions from `lab.css`**

In `app/styles/lab/lab.css`, replace lines 12–31:

```css
.lab-root {
  --lab-bg: #08090b;
  --lab-bg-2: #0e1013;
  --lab-surface: #121519;
  --lab-surface-2: #191d22;
  --lab-border: rgba(255, 255, 255, 0.08);
  --lab-border-2: rgba(255, 255, 255, 0.16);
  --lab-text: #eef0f2;
  --lab-text-2: #99a0a8;
  --lab-text-3: #6c7278;
  --lab-accent: #7dd3fc;
  --lab-spot: rgba(125, 211, 252, 0.10);

  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background: var(--lab-bg);
  color: var(--lab-text);
  font-family: var(--font-mono);
}
```

with:

```css
.lab-root {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background: var(--lab-bg);
  color: var(--lab-text);
  font-family: var(--font-mono);
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no output, exit 0.

Run: `npm run dev`, visit `http://localhost:3000/lab?enter=1` (or whichever port it starts on).
Expected: `/lab` renders pixel-identical to before this change — same dark background, same rail/stage colors. This is a pure token relocation; nothing should look different yet.

- [ ] **Step 4: Commit**

```bash
git add app/styles/base/variables.css app/styles/lab/lab.css
git commit -m "Lift Developer Mode color tokens to global scope"
```

---

## Task 1: Rail glass-plane + module headline contrast

**Files:**
- Modify: `app/styles/lab/lab.css:74-119` (`.lab-rail` and related), `app/styles/lab/lab.css:133-147` (`.lab-module-eyebrow`/`.lab-module-head h2`)

**Interfaces:**
- Consumes: `--lab-*` tokens from Task 0.
- Produces: no new class names other than what's listed below; purely visual refinement of existing selectors.

- [ ] **Step 1: Give the rail a floating glass-plane treatment**

In `app/styles/lab/lab.css`, find the `.lab-rail` rule (around line 74):

```css
.lab-rail {
  flex: 0 0 232px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 40px 16px;
  border-right: 1px solid var(--lab-border);
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}
```

Replace it with:

```css
.lab-rail {
  flex: 0 0 232px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 40px 16px;
  border-right: 1px solid var(--lab-border);
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  background: color-mix(in srgb, var(--lab-bg) 72%, transparent);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.25);
}
```

- [ ] **Step 2: Give module headlines more display presence**

Find `.lab-module-head h2` (around line 141):

```css
.lab-module-head h2 {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3.2vw, 2.6rem);
  font-weight: 700;
  margin: 0;
  color: var(--lab-text);
}
```

Replace with:

```css
.lab-module-head h2 {
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.8vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0;
  color: var(--lab-text);
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` — expect clean.
Run: `npm run dev`, visit `/lab?enter=1`.
Expected: the rail now reads as a distinct blurred panel floating above the backdrop grid (the grid should be faintly visible through it), and each module's headline (e.g. "About", "Archive") is visibly larger/bolder than before.

- [ ] **Step 4: Commit**

```bash
git add app/styles/lab/lab.css
git commit -m "Give the lab rail a floating glass-plane treatment, bolder module headlines"
```

---

## Task 2: Cursor-driven backdrop depth (interactive field)

**Files:**
- Modify: `components/lab/labMotion.tsx:82-103` (replace `Spotlight` with `InteractiveField`)
- Modify: `components/lab/LabBackdrop.tsx`
- Modify: `app/styles/lab/lab.css:50-64` (`.lab-backdrop-grid`, `.lab-spotlight`)

**Interfaces:**
- Consumes: nothing new.
- Produces: `InteractiveField` (named export from `labMotion.tsx`, no props) — replaces the old `Spotlight` export, which no consumer outside `LabBackdrop.tsx` used.

The existing `Spotlight` component only draws a radial glow that follows the pointer. This task folds the backdrop grid into the same component so the grid itself gets a subtle parallax nudge from the same pointer position — one coherent "the environment reacts to you" effect instead of two separate pieces.

- [ ] **Step 1: Replace `Spotlight` with `InteractiveField` in `labMotion.tsx`**

In `components/lab/labMotion.tsx`, the import line currently reads:

```tsx
import { AnimatePresence, motion, useMotionTemplate, useMotionValue } from 'motion/react';
```

Change it to:

```tsx
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useTransform } from 'motion/react';
```

Then replace the whole `Spotlight` section (lines 82–103):

```tsx
// ---------------------------------------------------------------------------
// Cursor-reactive backdrop spotlight
// ---------------------------------------------------------------------------

export function Spotlight() {
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (e.pointerType !== 'mouse') return;
      x.set(e.clientX);
      y.set(e.clientY);
    }
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [x, y]);

  const background = useMotionTemplate`radial-gradient(560px circle at ${x}px ${y}px, var(--lab-spot), transparent 68%)`;

  return <motion.div className="lab-spotlight" style={{ background }} aria-hidden="true" />;
}
```

with:

```tsx
// ---------------------------------------------------------------------------
// Cursor-reactive backdrop: grid gets a subtle parallax nudge, plus the
// spotlight glow — one component, one pointer subscription, so the two
// effects always read as a single reaction to the same cursor rather than
// two independently-moving pieces.
// ---------------------------------------------------------------------------

export function InteractiveField() {
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (e.pointerType !== 'mouse') return;
      x.set(e.clientX);
      y.set(e.clientY);
    }
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [x, y]);

  // Off-screen sentinel (-9999) reads as "pointer hasn't moved yet" — clamped
  // to 0 nudge rather than snapping the grid toward a phantom position.
  const gridX = useTransform(x, (v) => (v < -1000 ? 0 : (v - window.innerWidth / 2) * 0.012));
  const gridY = useTransform(y, (v) => (v < -1000 ? 0 : (v - window.innerHeight / 2) * 0.012));
  const background = useMotionTemplate`radial-gradient(560px circle at ${x}px ${y}px, var(--lab-spot), transparent 68%)`;

  return (
    <>
      <motion.div className="lab-backdrop-grid" style={{ x: gridX, y: gridY }} />
      <motion.div className="lab-spotlight" style={{ background }} aria-hidden="true" />
    </>
  );
}
```

- [ ] **Step 2: Update `LabBackdrop.tsx` to render the grid unconditionally, delegating to `InteractiveField` only when motion is on**

Replace the full contents of `components/lab/LabBackdrop.tsx`:

```tsx
'use client';

import dynamic from 'next/dynamic';
import { useMotionEnabled } from '@/lib/useMotionEnabled';

const InteractiveField = dynamic(() => import('./labMotion').then((m) => ({ default: m.InteractiveField })), {
  ssr: false,
});

/** Deep layered background + a cursor-reactive grid/spotlight for depth — no
 *  canvas particles, no WebGL, nothing that reacts to touch (there's no
 *  hover to react to). Static (motionless grid, no spotlight) under reduced
 *  motion or Professional Mode. */
export function LabBackdrop() {
  const enabled = useMotionEnabled();

  return (
    <div className="lab-backdrop" aria-hidden="true">
      {enabled ? <InteractiveField /> : <div className="lab-backdrop-grid" />}
    </div>
  );
}
```

- [ ] **Step 3: Widen the grid's edge margin so the parallax nudge never reveals a gap**

In `app/styles/lab/lab.css`, find `.lab-backdrop-grid` (around line 50):

```css
.lab-backdrop-grid {
  position: absolute;
  inset: -1px;
  background-image:
    linear-gradient(var(--lab-border) 1px, transparent 1px),
    linear-gradient(90deg, var(--lab-border) 1px, transparent 1px);
  background-size: 64px 64px;
  opacity: 0.5;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 80%);
}
```

Change only the `inset` value from `-1px` to `-40px`:

```css
.lab-backdrop-grid {
  position: absolute;
  inset: -40px;
  background-image:
    linear-gradient(var(--lab-border) 1px, transparent 1px),
    linear-gradient(90deg, var(--lab-border) 1px, transparent 1px);
  background-size: 64px 64px;
  opacity: 0.5;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 80%);
}
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` — expect clean.
Run: `npm run dev`, visit `/lab?enter=1` with a mouse (not touch/trackpad-only emulation).
Expected: moving the mouse around the page produces both the existing soft glow AND a very subtle shift of the background grid opposite/toward the cursor (a few pixels — subtle, not dizzying). With Developer Mode off, or under `prefers-reduced-motion: reduce`, the grid is present but completely static and there's no spotlight glow.

- [ ] **Step 5: Commit**

```bash
git add components/lab/labMotion.tsx components/lab/LabBackdrop.tsx app/styles/lab/lab.css
git commit -m "Fold backdrop grid into the cursor-reactive field for subtle parallax depth"
```

---

## Task 3: Rail sliding indicator + stage trace-line

**Files:**
- Modify: `components/lab/labMotion.tsx` (add `RailIndicator`, `StageTraceLine`)
- Create: `components/lab/LabRailIndicator.tsx`
- Modify: `components/lab/LabRail.tsx`
- Modify: `components/lab/LabStage.tsx`
- Modify: `app/styles/lab/lab.css` (rail item positioning + new indicator/trace-line rules)

**Interfaces:**
- Produces (from `labMotion.tsx`): `RailIndicator()` (no props, renders a `layoutId="lab-rail-active"` pill); `StageTraceLine({ id }: { id: string })`.
- Produces (from `LabRailIndicator.tsx`): `LabRailIndicator()` (no props) — the gated wrapper `LabRail.tsx` mounts.
- Consumes: `useMotionEnabled` from `lib/useMotionEnabled.ts` (already exists).

This is the "trace line" visual device from the spec, scoped down from a literal geometric line drawn between two arbitrary DOM elements (fragile across the desktop-rail/mobile-bottom-bar layout switch) to two coordinated, robust pieces: a `layoutId`-animated highlight that slides smoothly between rail items, and a short line that draws itself in at the top of each incoming stage panel. Together they read as "a connection being made" without any cross-component position measurement.

- [ ] **Step 1: Add `RailIndicator` and `StageTraceLine` to `labMotion.tsx`**

Add these two exports to the end of `components/lab/labMotion.tsx` (after the existing `SlabMotion` export):

```tsx
// ---------------------------------------------------------------------------
// Rail active-item indicator
// ---------------------------------------------------------------------------

export function RailIndicator() {
  return (
    <motion.span
      layoutId="lab-rail-active"
      className="lab-rail-indicator"
      aria-hidden="true"
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
    />
  );
}

// ---------------------------------------------------------------------------
// Stage entry trace line
// ---------------------------------------------------------------------------

export function StageTraceLine({ id }: { id: string }) {
  return (
    <motion.span
      key={id}
      className="lab-trace-line"
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
```

- [ ] **Step 2: Create the gated wrapper `LabRailIndicator.tsx`**

```tsx
'use client';

import dynamic from 'next/dynamic';
import { useMotionEnabled } from '@/lib/useMotionEnabled';

const RailIndicatorMotion = dynamic(() => import('./labMotion').then((m) => ({ default: m.RailIndicator })), {
  ssr: false,
});

/** Professional Mode / reduced motion: nothing rendered — the existing
 *  .lab-rail-item.active CSS background is the only indicator (see
 *  lab.css's .lab-rail--animated override). Developer Mode: a shared-layout
 *  pill that slides between rail items instead of snapping. */
export function LabRailIndicator() {
  const enabled = useMotionEnabled();
  if (!enabled) return null;
  return <RailIndicatorMotion />;
}
```

- [ ] **Step 3: Mount the indicator in `LabRail.tsx`**

In `components/lab/LabRail.tsx`, add two imports at the top:

```tsx
import { useMotionEnabled } from '@/lib/useMotionEnabled';
import { LabRailIndicator } from './LabRailIndicator';
```

Inside the `LabRail` function body, add right after the existing `const itemRefs = ...` line:

```tsx
const animated = useMotionEnabled();
```

Then find the returned JSX:

```tsx
  return (
    <nav className="lab-rail" aria-label="Developer Mode navigation" onKeyDown={onKeyDown}>
      {LAB_MODULES.map((m) => (
        <button
          key={m.id}
          type="button"
          ref={(el) => {
            itemRefs.current[m.id] = el;
          }}
          className={`lab-rail-item${m.id === activeId ? ' active' : ''}`}
          aria-current={m.id === activeId ? 'true' : undefined}
          tabIndex={m.id === activeId ? 0 : -1}
          onClick={() => onSelect(m.id)}
        >
          <span className="lab-rail-index">{m.index}</span>
          <span className="lab-rail-label">{m.label}</span>
        </button>
      ))}
    </nav>
  );
```

Replace it with:

```tsx
  return (
    <nav
      className={`lab-rail${animated ? ' lab-rail--animated' : ''}`}
      aria-label="Developer Mode navigation"
      onKeyDown={onKeyDown}
    >
      {LAB_MODULES.map((m) => (
        <button
          key={m.id}
          type="button"
          ref={(el) => {
            itemRefs.current[m.id] = el;
          }}
          className={`lab-rail-item${m.id === activeId ? ' active' : ''}`}
          aria-current={m.id === activeId ? 'true' : undefined}
          tabIndex={m.id === activeId ? 0 : -1}
          onClick={() => onSelect(m.id)}
        >
          <span className="lab-rail-index">{m.index}</span>
          <span className="lab-rail-label">{m.label}</span>
          {m.id === activeId && <LabRailIndicator />}
        </button>
      ))}
    </nav>
  );
```

- [ ] **Step 4: Mount the trace line in `LabStage.tsx`**

In `components/lab/LabStage.tsx`, add a second `dynamic()` import right after the existing `StageTransition` one:

```tsx
const StageTraceLine = dynamic(() => import('./labMotion').then((m) => ({ default: m.StageTraceLine })), {
  ssr: false,
});
```

Then find the `content` block:

```tsx
  const content = (
    <div
      key={activeId}
      ref={attachPanel}
      className="lab-stage-panel"
      role="region"
      aria-label={`${active.label} — Developer Mode`}
      tabIndex={-1}
    >
      <Module />
    </div>
  );
```

Replace it with:

```tsx
  const content = (
    <div
      key={activeId}
      ref={attachPanel}
      className="lab-stage-panel"
      role="region"
      aria-label={`${active.label} — Developer Mode`}
      tabIndex={-1}
    >
      {motionEnabled && <StageTraceLine id={activeId} />}
      <Module />
    </div>
  );
```

- [ ] **Step 5: Add the CSS for both**

In `app/styles/lab/lab.css`, find `.lab-rail-item` (around line 87) and add `position: relative;` to it:

```css
.lab-rail-item {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 13px 14px;
  border-radius: var(--radius-sm);
  background: none;
  border: 1px solid transparent;
  color: var(--lab-text-2);
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  position: relative;
  transition: color var(--transition-fast), border-color var(--transition-fast), background var(--transition-fast);
}
```

Then find `.lab-rail-item.active` (around line 102) and, immediately after it, add the animated-mode override plus the new indicator/trace-line rules:

```css
.lab-rail-item.active {
  color: var(--lab-text);
  background: var(--lab-surface);
  border-color: var(--lab-border-2);
}
/* When the JS indicator can render (see LabRailIndicator.tsx), it owns the
   fill exclusively — otherwise the static background above and the sliding
   pill would double up. */
.lab-rail--animated .lab-rail-item.active {
  background: none;
  border-color: transparent;
}
.lab-rail-indicator {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--lab-surface);
  border: 1px solid var(--lab-border-2);
  border-radius: var(--radius-sm);
}
```

Finally, add this new rule near the end of the "Shell: rail + stage" section (after `.lab-module-head` rules, around line 147):

```css
.lab-trace-line {
  display: block;
  height: 1px;
  width: 100%;
  margin-bottom: 28px;
  background: var(--lab-accent);
  transform-origin: left;
  opacity: 0.6;
}
```

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit` — expect clean.
Run: `npm run lint` — expect clean.
Run: `npm run dev`, visit `/lab?enter=1`.
Expected: clicking a different rail item (e.g. Archive → Stack) smoothly slides the highlight pill from one item to the next (not an instant snap), and a thin accent-colored line draws itself in from the left edge at the top of the new module's content, just above the header. With Developer Mode off, the rail's `.active` item still shows its plain static highlight exactly as before, and there's no trace line.

- [ ] **Step 7: Commit**

```bash
git add components/lab/labMotion.tsx components/lab/LabRailIndicator.tsx components/lab/LabRail.tsx components/lab/LabStage.tsx app/styles/lab/lab.css
git commit -m "Add sliding rail indicator and stage entry trace line"
```

---

## Task 4: Depth-push stage transition

**Files:**
- Modify: `components/lab/labMotion.tsx` (`StageTransition`)

**Interfaces:**
- No signature change to `StageTransition({ id, children })` — visual-only.

- [ ] **Step 1: Give the module-switch transition a depth cue**

In `components/lab/labMotion.tsx`, find `StageTransition`:

```tsx
export function StageTransition({ id, children }: { id: string; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={id}
        initial={{ opacity: 0, y: 14, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.99 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

Replace with:

```tsx
export function StageTransition({ id, children }: { id: string; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={id}
        initial={{ opacity: 0, y: 14, scale: 1.02, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -10, scale: 0.97, filter: 'blur(4px)' }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

The incoming panel now arrives from slightly *larger* than final size (was smaller), and the outgoing panel recedes further (0.97 vs 0.99) with a brief blur on both ends — reads as the outgoing module physically moving away in depth and the incoming one settling into place, rather than a flat crossfade.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` — expect clean.
Run: `npm run dev`, visit `/lab?enter=1`, switch between modules a few times.
Expected: the switch still takes roughly the same ~0.3s (must not feel slow), but now has a distinct sense of the old module receding/blurring and the new one settling in, rather than a flat fade.

- [ ] **Step 3: Commit**

```bash
git add components/lab/labMotion.tsx
git commit -m "Give the stage module-switch transition a depth cue"
```

---

## Task 5: Archive sibling recede

**Files:**
- Modify: `components/lab/modules/ArchiveModule.tsx`
- Modify: `components/lab/modules/ArchiveEntry.tsx`
- Modify: `app/styles/lab/lab-modules.css`

**Interfaces:**
- Modifies: `ArchiveEntry`'s props — adds a required `receded: boolean` prop. `ArchiveModule` is the only caller and is updated in the same task.

Today, expanding one project's slab collapses the grid to one column, but the *other* project's slab still renders as a plain full-width row — it doesn't visually communicate that you've focused into the expanded one. This task dims and slightly de-emphasizes the non-expanded sibling.

- [ ] **Step 1: Compute and pass `receded` in `ArchiveModule.tsx`**

In `components/lab/modules/ArchiveModule.tsx`, find the map:

```tsx
        {publishedProjects.map((project) => (
          <ArchiveEntry
            key={project.slug}
            project={project}
            expanded={expandedSlug === project.slug}
            onToggle={() => setExpandedSlug((s) => (s === project.slug ? null : project.slug))}
          />
        ))}
```

Replace with:

```tsx
        {publishedProjects.map((project) => (
          <ArchiveEntry
            key={project.slug}
            project={project}
            expanded={expandedSlug === project.slug}
            receded={expandedSlug !== null && expandedSlug !== project.slug}
            onToggle={() => setExpandedSlug((s) => (s === project.slug ? null : project.slug))}
          />
        ))}
```

- [ ] **Step 2: Accept and apply `receded` in `ArchiveEntry.tsx`**

In `components/lab/modules/ArchiveEntry.tsx`, find the function signature:

```tsx
export function ArchiveEntry({
  project,
  expanded,
  onToggle,
}: {
  project: Project;
  expanded: boolean;
  onToggle: () => void;
}) {
```

Replace with:

```tsx
export function ArchiveEntry({
  project,
  expanded,
  receded,
  onToggle,
}: {
  project: Project;
  expanded: boolean;
  receded: boolean;
  onToggle: () => void;
}) {
```

Then find the `<Slab ...>` opening tag:

```tsx
    <Slab layoutId={`archive-slab-${project.slug}`} className={`lab-slab${expanded ? ' lab-slab--expanded' : ''}`} style={style}>
```

Replace with:

```tsx
    <Slab
      layoutId={`archive-slab-${project.slug}`}
      className={`lab-slab${expanded ? ' lab-slab--expanded' : ''}${receded ? ' lab-slab--receded' : ''}`}
      style={style}
    >
```

- [ ] **Step 3: Add the CSS**

In `app/styles/lab/lab-modules.css`, find `.lab-slab--expanded` (around line 58):

```css
.lab-slab--expanded { grid-column: 1 / -1; }
```

Add immediately after it:

```css
/* Opacity only — never transform/scale here. .lab-slab is a motion.div with
   a layoutId when Developer Mode's motion is on (see labMotion.tsx's
   SlabMotion), and Motion owns that element's transform for the
   expand/collapse grow animation; a competing CSS transform would fight it
   on the next layout measurement. */
.lab-slab--receded {
  opacity: 0.4;
  transition: opacity var(--transition-base);
}
.lab-slab--receded:hover,
.lab-slab--receded:focus-within {
  opacity: 0.7;
}
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` — expect clean.
Run: `npm run dev`, visit `/lab?enter=1` → Archive.
Expected: expanding one project's case file visibly dims the other project's slab (hovering it brings it partway back up), and collapsing (clicking the expanded one again) restores both to full opacity. The shared-layout grow/shrink animation still works exactly as before.

- [ ] **Step 5: Commit**

```bash
git add components/lab/modules/ArchiveModule.tsx components/lab/modules/ArchiveEntry.tsx app/styles/lab/lab-modules.css
git commit -m "Dim the non-expanded sibling when an archive project is focused"
```

---

## Task 6: Archive stat staggered reveal

**Files:**
- Modify: `components/lab/labMotion.tsx` (add `StatReveal`)
- Modify: `components/lab/modules/ArchiveEntry.tsx`

**Interfaces:**
- Produces (from `labMotion.tsx`): `StatReveal({ index, children }: { index: number; children: ReactNode })`.
- Produces (from `ArchiveEntry.tsx`, internal): `StatItem({ label, value, index }: { label: string; value: string; index: number })` — not exported outside the file.

**Correction from the written spec:** the spec described a numeric "count-up" for stat values. The real data in `lib/content.ts` (`project.stats`) is mostly non-numeric strings — `"10 / 12"`, `"Full outbox"`, `"$0 / mo"`, `"Live"`, `"None"`, `"Real business"`, `"Vercel"` — so a numeric counter doesn't fit most of them. This task substitutes a staggered fade/rise reveal per stat instead, which fits every value regardless of whether it's a number, and still delivers the "the system is presenting information to you" feeling without touching the data.

- [ ] **Step 1: Add `StatReveal` to `labMotion.tsx`**

Add this export to the end of `components/lab/labMotion.tsx`:

```tsx
// ---------------------------------------------------------------------------
// Archive stat staggered reveal
// ---------------------------------------------------------------------------

export function StatReveal({ index, children }: { index: number; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: 0.08 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Add a gated `StatItem` and use it in `ArchiveEntry.tsx`**

In `components/lab/modules/ArchiveEntry.tsx`, the file already imports `dynamic` and `useMotionEnabled`. Add one more dynamic import near the top, right after the existing `SlabMotion` one:

```tsx
const StatReveal = dynamic(() => import('../labMotion').then((m) => ({ default: m.StatReveal })), {
  ssr: false,
});
```

Add this small component right before `export function ArchiveEntry(...)`:

```tsx
function StatItem({ label, value, index }: { label: string; value: string; index: number }) {
  const enabled = useMotionEnabled();
  const body = (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
  if (!enabled) return body;
  return <StatReveal index={index}>{body}</StatReveal>;
}
```

Then find the stats block inside `ArchiveEntry`:

```tsx
          {project.stats && (
            <dl className="lab-slab-stats">
              {project.stats.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
```

Replace with:

```tsx
          {project.stats && (
            <dl className="lab-slab-stats">
              {project.stats.map((s, i) => (
                <StatItem key={s.label} label={s.label} value={s.value} index={i} />
              ))}
            </dl>
          )}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` — expect clean.
Run: `npm run dev`, visit `/lab?enter=1` → Archive, expand a project.
Expected: the stat row (e.g. "Serverless functions / 10 of 12", "Works offline / Full outbox"...) fades/rises in one at a time with a slight stagger, rather than all appearing at once. Values are exactly what's in `lib/content.ts` — nothing invented.

- [ ] **Step 4: Commit**

```bash
git add components/lab/labMotion.tsx components/lab/modules/ArchiveEntry.tsx
git commit -m "Stagger the archive stat reveal on expand"
```

---

## Task 7: Cross-route wipe signal module

**Files:**
- Create: `lib/labWipeSignal.ts`

**Interfaces:**
- Produces: `type LabWipeOrigin = { x: number; y: number }`; `registerLabWipeListener(fn: (req: { origin: LabWipeOrigin; theme: 'lab' | 'site'; resolve: () => void }) => void): () => void`; `requestLabWipe(origin: LabWipeOrigin, theme: 'lab' | 'site'): Promise<void>`.
- Consumed by: Task 8's `ModeWipeOverlay` (registers the listener), Task 9's `Nav.tsx` and Task 10's `LabExperience.tsx` (call `requestLabWipe`).

`Nav.tsx` (inside the `(site)` route group) and the overlay that will live in the root layout (above every route group) don't share a natural React context boundary for this — and the interaction itself is a one-shot "fire this, wait for it to finish covering the screen, then I'll navigate" signal, not shared render state. This follows the same module-scoped-signal pattern the codebase already uses for `suppressNextModeTransition()` in `components/ModeTransition.tsx`.

- [ ] **Step 1: Write the module**

```ts
export type LabWipeOrigin = { x: number; y: number };
type WipeRequest = { origin: LabWipeOrigin; theme: 'lab' | 'site'; resolve: () => void };
type Listener = (req: WipeRequest) => void;

let listener: Listener | null = null;

/** ModeWipeOverlay (components/ModeWipeOverlay.tsx) is the sole subscriber,
 *  registered once from the root layout. Returns an unregister function for
 *  its effect cleanup, though in practice the overlay never unmounts. */
export function registerLabWipeListener(fn: Listener): () => void {
  listener = fn;
  return () => {
    if (listener === fn) listener = null;
  };
}

/** Resolves once the overlay reports the viewport is fully covered — the
 *  caller navigates inside that resolution, so the route change always
 *  happens hidden behind the wipe, never before or after it. If no overlay
 *  is registered (shouldn't happen in practice — it's mounted in the root
 *  layout) this resolves immediately so a caller never hangs. */
export function requestLabWipe(origin: LabWipeOrigin, theme: 'lab' | 'site'): Promise<void> {
  return new Promise((resolve) => {
    if (!listener) {
      resolve();
      return;
    }
    listener({ origin, theme, resolve });
  });
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` — expect clean (this file has no consumers yet, so this just confirms it type-checks standalone).

- [ ] **Step 3: Commit**

```bash
git add lib/labWipeSignal.ts
git commit -m "Add cross-route signal module for the mode-transition wipe"
```

---

## Task 8: `ModeWipeOverlay` component

**Files:**
- Create: `components/ModeWipeOverlay.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/styles/components/effects.css`

**Interfaces:**
- Consumes: `registerLabWipeListener`, `LabWipeOrigin` from `lib/labWipeSignal.ts` (Task 7); `usePrefersReducedMotion` from `lib/usePrefersReducedMotion.ts` (existing).
- Produces: `ModeWipeOverlay()` (no props) — mounted once in `app/layout.tsx`.

This is the component that makes entering/exiting Developer Mode read as the interface transforming rather than a flash-then-reload. It covers the viewport with an expanding circle from wherever the triggering control sits, resolves the caller's promise once fully covered (so the caller can navigate underneath it), holds briefly, then fades itself out to reveal what's there.

- [ ] **Step 1: Write the component**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { registerLabWipeListener, type LabWipeOrigin } from '@/lib/labWipeSignal';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';

const REVEAL_HOLD_MS = 280;

/** Mounted once in the root layout — the transition overlay that makes
 *  entering/exiting Developer Mode read as the interface itself
 *  transforming, rather than a flash followed by a page reload. Covers the
 *  viewport (expanding from the control the visitor just pressed) before
 *  the route change happens underneath it, then reveals what's there.
 *  Triggered via lib/labWipeSignal.ts by Nav.tsx (entering /lab) and
 *  LabExperience.tsx (exiting back to /) — see LabIntroGate.tsx for how
 *  /lab knows to skip its own entrance sequence when it arrives via this
 *  path, so the two transitions never stack. */
export function ModeWipeOverlay() {
  const [active, setActive] = useState<{ origin: LabWipeOrigin; theme: 'lab' | 'site' } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(
    () =>
      registerLabWipeListener(({ origin, theme, resolve }) => {
        if (reduced) {
          // No visible wipe under reduced motion — resolve immediately so
          // the caller still navigates, just without the covering animation.
          resolve();
          return;
        }
        setActive({ origin, theme });

        // rAF gives the browser one paint with the overlay mounted (and its
        // clip-path implicitly at the CSS default, fully visible) before the
        // animation starts, so the circle visibly grows from a point instead
        // of the whole screen snapping to covered on the first frame.
        requestAnimationFrame(async () => {
          const el = overlayRef.current;
          if (!el) {
            resolve();
            return;
          }
          const { animate } = await import('motion');
          const maxRadius = Math.hypot(window.innerWidth, window.innerHeight);
          await animate(
            el,
            {
              clipPath: [
                `circle(0px at ${origin.x}px ${origin.y}px)`,
                `circle(${maxRadius}px at ${origin.x}px ${origin.y}px)`,
              ],
            },
            { duration: 0.5, ease: [0.65, 0, 0.35, 1] }
          ).finished;

          resolve();

          await new Promise((r) => setTimeout(r, REVEAL_HOLD_MS));
          await animate(el, { opacity: [1, 0] }, { duration: 0.4, ease: [0.22, 1, 0.36, 1] }).finished;
          setActive(null);
        });
      }),
    [reduced]
  );

  if (!active) return null;
  return (
    <div
      ref={overlayRef}
      className={`mode-wipe-overlay mode-wipe-overlay--${active.theme}`}
      // Set inline, synchronously, in the same render that mounts this div —
      // not via the later animate() call — so the very first paint already
      // shows the circle at 0px. Without this the element would paint fully
      // visible for one frame (clip-path: none is the default) before the
      // animation had a chance to run, flashing full coverage before
      // shrinking back to a point and regrowing.
      style={{ clipPath: `circle(0px at ${active.origin.x}px ${active.origin.y}px)` }}
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 2: Mount it in `app/layout.tsx`**

Add the import alongside the existing `ModeTransition` import:

```tsx
import { ModeTransition } from '@/components/ModeTransition';
```

becomes:

```tsx
import { ModeTransition } from '@/components/ModeTransition';
import { ModeWipeOverlay } from '@/components/ModeWipeOverlay';
```

Then find:

```tsx
        <ThemeProvider>
          <DeveloperModeProvider>
            <AmbientBackground />
            <RevealScope />
            <ModeTransition />
            {children}
          </DeveloperModeProvider>
        </ThemeProvider>
```

Replace with:

```tsx
        <ThemeProvider>
          <DeveloperModeProvider>
            <AmbientBackground />
            <RevealScope />
            <ModeTransition />
            <ModeWipeOverlay />
            {children}
          </DeveloperModeProvider>
        </ThemeProvider>
```

- [ ] **Step 3: Add the CSS**

In `app/styles/components/effects.css`, add this block right after the existing `.mode-transition-overlay` rule:

```css
/* ── Mode wipe overlay (enter/exit Developer Mode) ───────── */
/* Animated imperatively by components/ModeWipeOverlay.tsx via motion's
   animate() — clip-path and opacity keyframes live in JS, this just
   positions and colors it per direction. --lab-bg / --bg are both global
   tokens (app/styles/base/variables.css) so this never needs to duplicate
   a hex value. */
.mode-wipe-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  pointer-events: none;
  opacity: 1;
}
.mode-wipe-overlay--lab { background: var(--lab-bg); }
.mode-wipe-overlay--site { background: var(--bg); }
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` — expect clean.
Run: `npm run lint` — expect clean.
Run: `npm run dev`, visit `/`.
Expected: the page loads with no visible overlay (nothing renders until `active` is set — `ModeWipeOverlay` returns `null` at rest). No consumer calls `requestLabWipe` yet, so nothing should be visibly different from before this task; this step only confirms the component mounts cleanly with no console errors.

- [ ] **Step 5: Commit**

```bash
git add components/ModeWipeOverlay.tsx app/layout.tsx app/styles/components/effects.css
git commit -m "Add ModeWipeOverlay: the cross-route wipe transition component"
```

---

## Task 9: Wire `Nav.tsx` to trigger the wipe on entry

**Files:**
- Modify: `components/Nav.tsx`

**Interfaces:**
- Consumes: `requestLabWipe` from `lib/labWipeSignal.ts` (Task 7).

- [ ] **Step 1: Add a ref on the dev-toggle button**

In `components/Nav.tsx`, find the existing refs near the top of the `Nav` function:

```tsx
  const progressRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
```

Add one more:

```tsx
  const progressRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const devToggleRef = useRef<HTMLButtonElement>(null);
```

- [ ] **Step 2: Import `requestLabWipe`**

Add to the imports:

```tsx
import { requestLabWipe } from '@/lib/labWipeSignal';
```

- [ ] **Step 3: Rewrite `handleDevToggle`'s entering branch**

Find:

```tsx
  const handleDevToggle = useCallback(() => {
    if (devMode) {
      toggleDevMode();
      return;
    }
    suppressNextModeTransition();
    toggleDevMode();
    router.push('/lab?enter=1');
  }, [devMode, toggleDevMode, router]);
```

Replace with:

```tsx
  const handleDevToggle = useCallback(() => {
    if (devMode) {
      toggleDevMode();
      return;
    }
    suppressNextModeTransition();
    toggleDevMode();
    const rect = devToggleRef.current?.getBoundingClientRect();
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: window.innerWidth, y: 0 };
    requestLabWipe(origin, 'lab').then(() => {
      try {
        sessionStorage.setItem('portfolio-lab-wiped', '1');
      } catch {
        /* ignore */
      }
      router.push('/lab?enter=1');
    });
  }, [devMode, toggleDevMode, router]);
```

- [ ] **Step 4: Attach the ref to the button**

Find:

```tsx
              <button
                className={`dev-toggle${devMode ? ' active' : ''}`}
                aria-pressed={devMode}
                aria-label={devMode ? 'Switch to Professional Mode' : 'Enter Developer Mode'}
                onClick={handleDevToggle}
              >
```

Replace with:

```tsx
              <button
                ref={devToggleRef}
                className={`dev-toggle${devMode ? ' active' : ''}`}
                aria-pressed={devMode}
                aria-label={devMode ? 'Switch to Professional Mode' : 'Enter Developer Mode'}
                onClick={handleDevToggle}
              >
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit` — expect clean.
Run: `npm run lint` — expect clean.
Run: `npm run dev`, visit `/`, click the Developer Mode toggle in the header.
Expected: a dark circle visibly expands from the toggle button, covering the whole screen — then, once fully covered, the URL changes to `/lab` underneath it (you won't see the change since the screen is covered), and shortly after the circle fades out to reveal the Lab environment. This should feel like one continuous ~1s gesture, not two separate animations with a gap.

- [ ] **Step 6: Commit**

```bash
git add components/Nav.tsx
git commit -m "Wire the Developer Mode toggle to the wipe transition"
```

---

## Task 10: `LabIntroGate` skip logic + `LabExperience` exit wipe

**Files:**
- Modify: `components/lab/LabIntroGate.tsx`
- Modify: `components/lab/LabExperience.tsx`
- Modify: `app/styles/lab/lab.css` (remove now-dead `.lab-root--leaving`)

**Interfaces:**
- Consumes: `requestLabWipe` from `lib/labWipeSignal.ts` (Task 7).
- `LabIntroGate`'s `onDecision` callback signature is unchanged (`(shouldPlayIntro: boolean) => void`); only the logic deciding what value it's called with changes.

- [ ] **Step 1: Make `LabIntroGate` skip the full intro when arriving via the wipe**

Replace the full contents of `components/lab/LabIntroGate.tsx`:

```tsx
'use client';

import { useEffect, useLayoutEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const WIPE_FLAG = 'portfolio-lab-wiped';

/** Isolated in its own leaf component, wrapped in a <Suspense> by its caller
 *  — useSearchParams() requires that boundary in App Router, and keeping it
 *  scoped to this one small component (rather than the whole /lab shell)
 *  is what lets /lab stay statically prerendered. Reads `enter=1` once on
 *  mount, reports the decision up, then strips the param so a refresh or
 *  back/forward doesn't replay the entrance sequence. */
export function LabIntroGate({ onDecision }: { onDecision: (shouldPlayIntro: boolean) => void }) {
  const params = useSearchParams();
  const router = useRouter();

  useIsomorphicLayoutEffect(() => {
    const enteredViaParam = params.get('enter') === '1';

    // Set by ModeWipeOverlay (components/ModeWipeOverlay.tsx) right before
    // it navigates here — a wiped arrival already got its transition from
    // that overlay, which is still mid-reveal, mounted above this page.
    // Playing the full iris-wipe LabIntro on top of that would stack a
    // second, redundant transition. Only a direct/bookmarked/shared-link
    // arrival (enter=1 with no wipe flag) still gets it.
    let arrivedViaWipe = false;
    try {
      arrivedViaWipe = sessionStorage.getItem(WIPE_FLAG) === '1';
      if (arrivedViaWipe) sessionStorage.removeItem(WIPE_FLAG);
    } catch {
      /* ignore */
    }

    onDecision(enteredViaParam && !arrivedViaWipe);
    if (enteredViaParam) {
      router.replace('/lab', { scroll: false });
    }
    // Deliberately once on mount — this reads the URL's initial state, not a
    // value that should re-trigger the decision on every param change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
```

- [ ] **Step 2: Make `LabExperience`'s exit use the wipe instead of the blur-fade**

In `components/lab/LabExperience.tsx`, add the import:

```tsx
import { requestLabWipe } from '@/lib/labWipeSignal';
```

Remove the now-unused constant and state — find:

```tsx
const EXIT_FADE_MS = 260;
const LAB_EXIT_FOCUS_FLAG = 'portfolio-lab-exit';
```

Replace with:

```tsx
const LAB_EXIT_FOCUS_FLAG = 'portfolio-lab-exit';
```

Find:

```tsx
  const [activeId, setActiveId] = useState<LabModuleId>(DEFAULT_LAB_MODULE);
  const [showIntro, setShowIntro] = useState(false);
  const [leaving, setLeaving] = useState(false);
```

Replace with:

```tsx
  const [activeId, setActiveId] = useState<LabModuleId>(DEFAULT_LAB_MODULE);
  const [showIntro, setShowIntro] = useState(false);
```

Find `handleExit`:

```tsx
  const handleExit = useCallback(() => {
    setDevMode(false);
    try {
      sessionStorage.setItem(LAB_EXIT_FOCUS_FLAG, '1');
    } catch {
      /* ignore */
    }
    if (!motionEnabled) {
      router.push('/');
      return;
    }
    setLeaving(true);
    window.setTimeout(() => router.push('/'), EXIT_FADE_MS);
  }, [motionEnabled, router, setDevMode]);
```

Replace with:

```tsx
  const handleExit = useCallback(() => {
    setDevMode(false);
    try {
      sessionStorage.setItem(LAB_EXIT_FOCUS_FLAG, '1');
    } catch {
      /* ignore */
    }
    if (!motionEnabled) {
      router.push('/');
      return;
    }
    // Fixed origin matching .lab-exit's CSS position (top: 20px; right:
    // 20px) rather than measuring the real button — LabExitControl is a
    // separate presentational component and threading a ref through it for
    // one approximate coordinate isn't worth the coupling.
    requestLabWipe({ x: window.innerWidth - 40, y: 40 }, 'site').then(() => router.push('/'));
  }, [motionEnabled, router, setDevMode]);
```

Find the returned root div:

```tsx
    <div className={`lab-root${leaving ? ' lab-root--leaving' : ''}`}>
```

Replace with:

```tsx
    <div className="lab-root">
```

- [ ] **Step 3: Remove the now-dead `.lab-root--leaving` CSS**

In `app/styles/lab/lab.css`, remove these rules entirely:

```css
@media (prefers-reduced-motion: no-preference) {
  .lab-root--leaving {
    transition: opacity 0.26s ease, filter 0.26s ease;
    opacity: 0;
    filter: blur(6px);
  }
}
.lab-root--leaving { opacity: 0; }
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` — expect clean.
Run: `npm run lint` — expect clean.
Run: `npm run dev`.

Check the wiped-arrival path: from `/`, click the Developer Mode toggle. Expected: wipe covers, `/lab` arrives already covered (no flash of the LabIntro's "Loading the archive…" beats), then the wipe fades out directly onto the Lab environment.

Check the direct-link path: visit `http://localhost:3000/lab?enter=1` directly (typing the URL, simulating a bookmark/shared link) with no prior toggle click. Expected: the original full iris-wipe LabIntro ("Loading the archive… / Warming up the workspace… / Ready.") plays exactly as it did before this task — this path is unchanged.

Check exit: from inside `/lab`, click "Exit". Expected: a dark-to-site-background circle wipe expands from the top-right (where Exit sits) and closes back to `/`, replacing the old blur-fade.

- [ ] **Step 5: Commit**

```bash
git add components/lab/LabIntroGate.tsx components/lab/LabExperience.tsx app/styles/lab/lab.css
git commit -m "Route the /lab exit through the wipe transition; skip the double intro on wiped entry"
```

---

## Task 11: Final integration pass

**Files:** none (verification only).

- [ ] **Step 1: Full type-check and lint**

Run: `npx tsc --noEmit`
Expected: no output, exit 0.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 2: Full production build**

Run: `npm run build`
Expected: build completes successfully; `/lab` still appears in the route list (it should remain statically prerendered per its existing design — check the build output doesn't newly mark it as dynamic).

- [ ] **Step 3: Manual walkthrough with motion on**

With `npm run dev` running and Developer Mode off, on `/`:
1. Click the Developer Mode toggle. Confirm the wipe covers from the button, `/lab` arrives underneath it, wipe reveals.
2. In `/lab`, tab through the rail with the keyboard (arrow keys, Home/End) — confirm the sliding indicator follows focus and each switch shows the trace line + depth-push transition.
3. Go to Archive, expand a project — confirm the sibling dims, the stats stagger in, and the shared-layout grow animation still works.
4. Collapse it, expand the other project — confirm the same behavior both directions.
5. Click Exit — confirm the reverse wipe from the Exit button back to `/`, and that focus lands on the homepage's main content (existing `LabExitFocus` behavior).
6. Visit `http://localhost:3000/lab?enter=1` directly in a fresh tab (no prior toggle click) — confirm the original full iris-wipe intro still plays.

- [ ] **Step 4: Manual walkthrough with reduced motion**

Enable "prefers reduced motion" (OS setting, or Chrome DevTools → Rendering tab → "Emulate CSS media feature prefers-reduced-motion: reduce"), reload `/`.
1. Click the Developer Mode toggle — confirm navigation to `/lab` happens instantly, with no wipe animation, no LabIntro, no rail indicator, no trace line, no backdrop parallax, no stat stagger, no archive sibling-recede transition (opacity may still change instantly, that's fine — only the *transition* must be gone, per the existing `--transition-base` var, which itself isn't reduced-motion-gated; visually confirm nothing feels like it's "animating" over time).
2. Confirm every module is still fully readable and navigable with only CSS-level (non-JS) transitions, exactly as before this plan.

- [ ] **Step 5: Manual walkthrough at mobile width**

Resize the browser (or use DevTools device emulation) to a narrow viewport (e.g. 390px).
1. Confirm the rail becomes the bottom tab bar exactly as before, and the sliding indicator (if any) still tracks correctly in the horizontal layout.
2. Confirm Archive's expand/recede still works with touch/click (no pointer-only interaction required).
3. Confirm no horizontal overflow anywhere.

- [ ] **Step 6: Commit (only if any fixes were needed during this pass)**

If Steps 1–5 surfaced any issues, fix them and commit with a message describing the specific fix. If everything passed cleanly, there is nothing to commit for this task.

---
