'use client';

import { useScrollReveal } from '@/lib/useScrollReveal';

/**
 * Mounted once in the root layout. Runs the scroll-reveal observer and
 * re-scans on every route change, so every route — including
 * /projects/[slug] — gets reveal behaviour without a per-page wrapper.
 */
export function RevealScope() {
  useScrollReveal();
  return null;
}
