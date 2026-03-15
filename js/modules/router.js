/**
 * @module router
 * Client-side SPA router. Dynamically fetches HTML page fragments and
 * injects them into #main-content. Re-executes inline scripts after injection
 * (innerHTML does NOT run <script> tags by default).
 */

import { observeReveal }   from './scrollReveal.js';
import { animateSkillBars } from './skillBars.js';
import { initFilter }      from './filter.js';
import { initForm }        from './form.js';
import { initTypewriter }  from './typewriter.js';

/** Cache loaded page fragments to avoid repeated network requests */
const pageCache = new Map();

/**
 * FIX: Start as null so the first navigateTo('home') always loads.
 * Previously was 'home' which caused the guard to fire early on init,
 * leaving the page blank until another route was clicked.
 */
let currentPage = null;

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
  document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
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
      case 'about':
        setTimeout(animateSkillBars, 400);
        break;
      case 'projects':
        initFilter();
        break;
      case 'contact':
        initForm();
        break;
    }
  });
}

export async function navigateTo(pageId) {
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

  // FIX: currentPage is null so this will always load on init
  navigateTo('home');
}
