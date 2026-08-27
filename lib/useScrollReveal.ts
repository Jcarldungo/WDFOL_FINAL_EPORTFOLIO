'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const THRESHOLD = 0.12;
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
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: THRESHOLD }
    );

    els.forEach((el) => {
      if (!el.classList.contains('visible')) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);
}
