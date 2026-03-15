/**
 * @module navbar
 * Manages navbar scroll behavior, scroll progress bar, and mobile menu.
 *
 * Separation rationale: Navbar has its own DOM lifecycle and event loop
 * concerns (scroll, resize). Isolating it prevents memory leaks from
 * stale listeners if the navbar HTML were ever hot-swapped.
 *
 * @exports { init }
 */

let scrollListenerAttached = false;

/** Update navbar appearance and progress bar based on scroll position */
function onScroll() {
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('progress-bar');

  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }

  if (progressBar) {
    const doc      = document.documentElement;
    const scrolled = window.scrollY / (doc.scrollHeight - doc.clientHeight);
    progressBar.style.width = `${Math.min(scrolled * 100, 100)}%`;
  }
}

/** Close the mobile menu and restore body scroll */
export function closeMobileMenu() {
  const menu      = document.getElementById('mobile-menu');
  const hamburger = document.getElementById('hamburger');

  if (menu)      { menu.classList.remove('open'); }
  if (hamburger) {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  document.body.style.overflow = '';
}

/** Toggle the mobile menu open/closed */
function toggleMobileMenu() {
  const menu      = document.getElementById('mobile-menu');
  const hamburger = document.getElementById('hamburger');
  if (!menu || !hamburger) return;

  const isOpen = menu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

/**
 * Initialize navbar module.
 * Safe to call multiple times — scroll listener is only attached once.
 */
export function init() {
  // Scroll listener (passive for performance)
  if (!scrollListenerAttached) {
    window.addEventListener('scroll', onScroll, { passive: true });
    scrollListenerAttached = true;
  }

  // Hamburger button
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    // Remove existing listener before re-adding (navbar may be re-injected)
    hamburger.replaceWith(hamburger.cloneNode(true));
    document.getElementById('hamburger').addEventListener('click', toggleMobileMenu);
  }

  // Close mobile menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  }, { once: false });

  // Close mobile menu when a page link is clicked (handled via router delegation)
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-page]')) closeMobileMenu();
  });
}
