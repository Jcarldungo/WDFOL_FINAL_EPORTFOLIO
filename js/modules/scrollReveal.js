/**
 * @module scrollReveal
 * Uses IntersectionObserver to trigger CSS reveal animations when elements
 * enter the viewport. Applies to .reveal, .reveal-left, .reveal-right.
 *
 * Separation rationale: Scroll-driven animations are a cross-cutting concern
 * shared by all pages. One module owns the observer pool so we never leak
 * disconnected observers when pages are dynamically swapped.
 *
 * @exports { observeReveal }
 */

/** Reusable observer instance — shared across all pages */
let observer = null;

/**
 * Intersection threshold — 0 means "fires as soon as one pixel is visible"
 * rather than waiting for 12% of a tall card to have scrolled in. Combined
 * with rootMargin below, this makes reveals fire on entry instead of after
 * the user has already scrolled most of the way past a tall element —
 * previously up to ~1.2s of blank viewport on normal-speed scrolling.
 */
const THRESHOLD = 0;
const ROOT_MARGIN = '0px 0px -12% 0px';

/**
 * Create the IntersectionObserver (once).
 * When an observed element intersects, add .visible and unobserve.
 */
function createObserver() {
  if (observer) return;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: THRESHOLD, rootMargin: ROOT_MARGIN }
  );
}

/**
 * Find all un-triggered reveal targets in the current active page
 * and start observing them.
 *
 * Called by the router after each page injection, and on initial load.
 */
export function observeReveal() {
  createObserver();

  // Scope to the active page to avoid observing hidden pages
  const context = document.querySelector('.page.active') || document;
  const selector = '.reveal, .reveal-left, .reveal-right';

  context.querySelectorAll(selector).forEach(el => {
    // Don't re-observe already-visible elements
    if (!el.classList.contains('visible')) {
      observer.observe(el);
    }
  });
}
