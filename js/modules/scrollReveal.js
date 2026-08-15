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

/** Intersection threshold — element must be this % visible to trigger */
const THRESHOLD = 0.12;

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
    { threshold: THRESHOLD }
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
