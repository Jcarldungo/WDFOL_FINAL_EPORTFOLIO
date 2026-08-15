/**
 * @module router
 * Client-side SPA router. Dynamically fetches HTML page fragments and
 * injects them into #main-content. Re-executes inline scripts after injection
 * (innerHTML does NOT run <script> tags by default).
 *
 * Real URL routing: navigating between pages calls history.pushState() so
 * the address bar reflects the current page (e.g. /projects), the browser
 * back/forward buttons work, and a hard refresh on a sub-page loads that
 * page directly (via vercel.json rewriting every path to /index.html, then
 * this module reading location.pathname on boot).
 */

import { observeReveal }      from './scrollReveal.js';
import { initForm }           from './form.js';
import { initTypewriter }     from './typewriter.js';

/** Known page ids — also the *.html fragment name in /pages/ */
const PAGES = ['home', 'about', 'projects', 'services', 'resume', 'contact'];

/** Cache loaded page fragments to avoid repeated network requests */
const pageCache = new Map();

/**
 * FIX: Start as null so the first navigateTo() always loads.
 * Previously was 'home' which caused the guard to fire early on init,
 * leaving the page blank until another route was clicked.
 */
let currentPage = null;

/** Convert a URL pathname to a known pageId. Falls back to 'home'. */
function pathToPage(pathname) {
  const slug = pathname.replace(/^\/+|\/+$/g, ''); // strip leading/trailing slashes
  if (slug === '' ) return 'home';
  return PAGES.includes(slug) ? slug : 'home';
}

/** Convert a pageId to the canonical URL path. */
function pageToPath(pageId) {
  return pageId === 'home' ? '/' : `/${pageId}`;
}

/**
 * Fetch an HTML fragment from /pages/<pageId>.html
 */
async function fetchPage(pageId) {
  if (pageCache.has(pageId)) return pageCache.get(pageId);

  try {
    const res  = await fetch(`pages/${pageId}.html`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    pageCache.set(pageId, html);
    return html;
  } catch (err) {
    console.error(`[router] Failed to load page: ${pageId}`, err);
    return `<div style="padding:120px 24px;text-align:center;color:var(--text-2);">
              <p>Could not load page. Make sure you're running via a local server.</p>
              <code style="font-size:.8rem;">npx serve .</code>
            </div>`;
  }
}

/**
 * FIX: Re-execute all <script> tags found inside injected HTML.
 * When innerHTML is set, the browser parses but does NOT run scripts.
 * We must clone each <script> as a live element and append it to the DOM.
 */
function executeScripts(container) {
  container.querySelectorAll('script').forEach(oldScript => {
    const newScript = document.createElement('script');
    // Copy all attributes (type, src, etc.)
    Array.from(oldScript.attributes).forEach(attr => {
      newScript.setAttribute(attr.name, attr.value);
    });
    newScript.textContent = oldScript.textContent;
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

function showLoader(container) {
  container.innerHTML = '<div class="page-loading" aria-live="polite" aria-label="Loading page"></div>';
}

function updateNavLinks(pageId) {
  document.querySelectorAll('.nav-link, .mobile-link, .footer-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageId);
  });
}

function runPageHooks(pageId) {
  requestAnimationFrame(() => {
    observeReveal();

    switch (pageId) {
      case 'home':
        initTypewriter();
        break;
      case 'contact':
        initForm();
        break;
    }
  });
}

/**
 * Navigate to a page.
 * @param {string} pageId
 * @param {{ push?: boolean }} [options] - pass { push: false } when called
 *   from a popstate handler or on initial boot, where the URL is already
 *   correct and should not be pushed onto the history stack again.
 */
export async function navigateTo(pageId, { push = true } = {}) {
  if (!PAGES.includes(pageId)) pageId = 'home';

  // FIX: Only skip if it's ALREADY the current page AND has already been loaded once
  if (pageId === currentPage && currentPage !== null) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const container = document.getElementById('main-content');
  if (!container) return;

  currentPage = pageId;
  updateNavLinks(pageId);
  showLoader(container);
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (push) {
    history.pushState({ pageId }, '', pageToPath(pageId));
  }

  const html = await fetchPage(pageId);
  container.innerHTML = html;

  // FIX: Re-execute any inline <script> blocks in the injected HTML
  executeScripts(container);

  runPageHooks(pageId);
}

export function getCurrentPage() {
  return currentPage;
}

export function init() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-page]');
    if (!link) return;
    e.preventDefault();
    navigateTo(link.dataset.page);
  });

  // Browser back/forward — re-render the page for the new URL without
  // pushing a duplicate history entry.
  window.addEventListener('popstate', (e) => {
    const pageId = e.state?.pageId || pathToPage(window.location.pathname);
    navigateTo(pageId, { push: false });
  });

  // Initial load: read the current URL so a direct link or a hard refresh
  // on a sub-page (e.g. /projects) opens that page instead of always
  // defaulting to home. Replace (not push) so we don't create an extra
  // history entry for the page that's already showing.
  const initialPage = pathToPage(window.location.pathname);
  history.replaceState({ pageId: initialPage }, '', pageToPath(initialPage));
  navigateTo(initialPage, { push: false });
}
