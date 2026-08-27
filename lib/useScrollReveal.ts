'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SELECTOR = '.reveal, .reveal-left, .reveal-right';

/**
 * Reveals `.reveal*` elements as they scroll into view. Re-scans on every
 * route change (App Router keeps the layout mounted, so a one-time effect
 * would miss pages navigated to client-side). Under `prefers-reduced-motion`
 * it shows everything immediately and never observes — matching the CSS
 * reduced-motion reset rather than depending on it.
 */
export function useScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      els.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Reveal when it scrolls into view, and also if it was scrolled
          // past faster than the observer could fire (top above the fold) —
          // otherwise a quick flick leaves whole sections stuck invisible.
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    );

    const vh = window.innerHeight;
    els.forEach((el) => {
      if (el.classList.contains('visible')) return;
      // Anything already on screen at mount reveals immediately (its
      // entrance transition still plays); the rest waits for scroll.
      if (el.getBoundingClientRect().top < vh) el.classList.add('visible');
      else observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);
}
