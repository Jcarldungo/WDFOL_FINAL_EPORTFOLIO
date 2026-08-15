/**
 * @module filter
 * Handles project category filtering on the Projects page.
 * Shows/hides .project-card elements based on data-category attribute.
 *
 * Separation rationale: UI filtering is a stateless interaction pattern
 * with no dependencies on routing or theme. A standalone module makes it
 * testable and reusable for any future filterable grid.
 *
 * @exports { initFilter }
 */

/** CSS animation applied to cards as they reappear */
const REVEAL_ANIMATION = 'fadeInPage 0.4s ease';

/**
 * Filter project cards by category.
 * @param {string} filter - Category string or 'all'
 */
function filterProjects(filter) {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    const match = filter === 'all' || card.dataset.category === filter;

    if (match) {
      card.style.display    = '';    // restore grid display
      card.style.animation  = REVEAL_ANIMATION;
    } else {
      card.style.display    = 'none';
      card.style.animation  = '';
    }
  });
}
/**
 * Initialize project filter buttons.
 * Attaches click listeners to all .filter-btn elements.
 * Safe to call on every projects page visit.
 */
export function initFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      filterProjects(btn.dataset.filter);
    });
  });
}
