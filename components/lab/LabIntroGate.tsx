'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
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
  // Guards against React StrictMode's dev-only double-invoke of this effect
  // (mount → cleanup → mount): without it, the second invoke would find the
  // WIPE_FLAG already consumed by the first and wrongly decide `true`,
  // re-arming the full intro it had just correctly skipped. A no-op outside
  // that double-invoke (i.e. in production), since the effect only ever
  // runs once there anyway.
  const ranRef = useRef(false);

  useIsomorphicLayoutEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

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
