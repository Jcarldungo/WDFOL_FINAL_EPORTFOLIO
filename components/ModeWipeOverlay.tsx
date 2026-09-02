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
