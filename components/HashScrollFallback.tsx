'use client';

import { useEffect } from 'react';

/** Safety net for a hash arriving via a cross-route navigation (e.g. the
 *  404 page linking to "/#projects") — App Router's built-in hash-scroll
 *  doesn't reliably fire on every browser/timing combination. Runs once on
 *  mount; same-page anchor clicks are already handled natively. */
export function HashScrollFallback() {
  useEffect(() => {
    if (!location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    el?.scrollIntoView();
  }, []);

  return null;
}
