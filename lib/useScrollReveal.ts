'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SELECTOR = '.reveal, .reveal-left, .reveal-right';

/** Reveal a little before an element reaches the fold, so the transition is
 *  finishing as it arrives rather than starting. */
const LEAD = 0.18;

/**
 * Reveals `.reveal*` elements as they approach the viewport, and re-scans on
 * every route change (App Router keeps the layout mounted, so a one-time
 * effect would miss client-side navigations).
 *
 * Deliberately a rAF-throttled scroll pass rather than an IntersectionObserver.
 * The observer only fires when an intersection ratio *changes*: an instant jump
 * — a `#contact` anchor, End, a restored scroll position — can carry a whole
 * section from below the fold to above it inside one frame, so the ratio never
 * leaves 0 and no callback ever runs. Those sections then stayed at opacity 0
 * for as long as the visitor stayed past them, and scrolling back up showed
 * blank space. Measuring position directly has no such blind spot; the pending
 * list only shrinks, and the listeners detach once it is empty.
 *
 * Under `prefers-reduced-motion` everything is shown at once and nothing is
 * observed, matching the CSS reduced-motion reset rather than depending on it.
 */
export function useScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    let pending = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR)).filter(
      (el) => !el.classList.contains('visible')
    );
    if (pending.length === 0) return;

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      pending.forEach((el) => el.classList.add('visible'));
      return;
    }

    let ticking = false;
    let detached = false;

    function sweep() {
      ticking = false;
      const line = window.innerHeight * (1 + LEAD);
      const next: HTMLElement[] = [];
      for (const el of pending) {
        if (el.getBoundingClientRect().top < line) el.classList.add('visible');
        else next.push(el);
      }
      pending = next;
      if (pending.length === 0) detach();
    }

    function onScroll() {
      if (ticking || detached) return;
      ticking = true;
      requestAnimationFrame(sweep);
    }

    function detach() {
      if (detached) return;
      detached = true;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }

    sweep();
    if (!detached) {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
    }

    return detach;
  }, [pathname]);
}
