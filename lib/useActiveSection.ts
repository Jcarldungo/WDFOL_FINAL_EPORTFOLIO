'use client';

import { useEffect, useState } from 'react';

/** A section counts as current once its top passes this line — a third of the
 *  way down, just under the fixed header, so the nav flips at the moment the
 *  new heading actually arrives rather than half a screen later. */
const ACTIVATION_LINE = 0.34;

/**
 * Tracks which of the given section ids the reader is currently in, driving
 * nav/footer active-link state.
 *
 * Reads scroll position directly rather than using IntersectionObserver: the
 * observer version picked "topmost currently intersecting a centre band",
 * which held a stale value whenever nothing intersected and could never mark
 * a short trailing section active at all. This is exact at every position,
 * costs one rAF-batched measurement per scroll, and always resolves the last
 * section when the page is scrolled to the bottom.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    let ticking = false;
    let last = '';

    function measure() {
      ticking = false;
      const line = window.innerHeight * ACTIVATION_LINE;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

      let current = ids[0] ?? '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        // Bottom of the page: whatever section is last wins, however short.
        if (atBottom) current = id;
        else if (el.getBoundingClientRect().top <= line) current = id;
      }

      if (current !== last) {
        last = current;
        setActive(current);
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ids]);

  return active;
}
