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
  // Synchronous in-flight guard — separate from `active` state because a
  // second wipe request can arrive in the same tick a setState from the
  // first hasn't flushed yet. Read/written only inside the listener and its
  // rAF callback below, both on the main thread, so no race between checks.
  const inFlightRef = useRef(false);
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
        if (inFlightRef.current) {
          // A wipe is already animating. Starting a second animate() call on
          // the same element/property would race the first WAAPI animation
          // (and risk interrupting it — see the try/finally below). Queuing
          // or canceling-and-restarting is unnecessary complexity for what
          // should be a rare edge case; just resolve immediately so the new
          // caller isn't blocked — the same "fail open" behavior as the
          // no-listener-registered fallback in labWipeSignal.ts.
          resolve();
          return;
        }
        inFlightRef.current = true;
        setActive({ origin, theme });

        // rAF gives the browser one paint with the overlay mounted (and its
        // clip-path implicitly at the CSS default, fully visible) before the
        // animation starts, so the circle visibly grows from a point instead
        // of the whole screen snapping to covered on the first frame.
        requestAnimationFrame(async () => {
          const el = overlayRef.current;
          if (!el) {
            resolve();
            inFlightRef.current = false;
            return;
          }
          // Guards resolve() being called more than once: it's normally
          // fired from the inner finally below (as soon as the cover
          // animation settles), but if the dynamic import itself throws —
          // e.g. a chunk-load failure — there's no cover animation to wait
          // on, so the outer finally has to fire it instead. Calling a
          // Promise executor's resolve twice is harmless in JS, but tracking
          // this keeps the "fires exactly once" contract explicit.
          let resolved = false;
          const resolveOnce = () => {
            if (resolved) return;
            resolved = true;
            resolve();
          };
          try {
            // The import (and the hypot call that only needs its result) live
            // inside this try too: if the dynamic import rejects, nothing
            // below it can run, so without this the catch/finally pair would
            // never fire — resolve() would hang the caller forever and
            // inFlightRef would stay true forever, silently locking out every
            // later requestLabWipe() call for the rest of the page's life.
            const { animate } = await import('motion');
            const maxRadius = Math.hypot(window.innerWidth, window.innerHeight);
            try {
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
            } finally {
              // Resolve as soon as the cover animation settles — whether it
              // completed or was interrupted/rejected. The caller can
              // navigate now either way; worst case the overlay is left in
              // some intermediate covered-ish state, which still beats
              // hanging the navigation forever.
              resolveOnce();
            }

            await new Promise((r) => setTimeout(r, REVEAL_HOLD_MS));
            await animate(el, { opacity: [1, 0] }, { duration: 0.4, ease: [0.22, 1, 0.36, 1] }).finished;
          } catch {
            // The import failed, or either animation was interrupted/
            // rejected. Fall through to the finally below so the overlay
            // never stays stuck mounted over the viewport with no recovery
            // short of a reload, and so resolve() still fires even when the
            // import itself is what threw.
          } finally {
            resolveOnce();
            setActive(null);
            inFlightRef.current = false;
          }
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
