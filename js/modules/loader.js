/**
 * @module loader
 * Fetches and injects HTML component fragments (navbar, footer) into
 * designated placeholder elements in index.html.
 *
 * Separation rationale: index.html should be a dumb shell. Component HTML
 * lives in /components/ and is fetched once. This mirrors how frameworks like
 * Next.js handle layouts without requiring a build pipeline.
 *
 * @exports { loadComponents }
 */

/**
 * Fetch an HTML fragment and inject it into a target element.
 * @param {string} url       - Path to the HTML fragment
 * @param {string} targetId  - ID of the element to inject into
 */
async function loadComponent(url, targetId) {
  const target = document.getElementById(targetId);
  if (!target) {
    console.warn(`[loader] Target #${targetId} not found`);
    return;
  }

  try {
    const res  = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const html = await res.text();
    target.innerHTML = html;
  } catch (err) {
    console.error(`[loader] Failed to load component: ${url}`, err);
  }
}

/**
 * Load all layout components (navbar + footer) in parallel.
 * Returns a Promise that resolves when both are injected.
 */
export async function loadComponents() {
  await Promise.all([
    loadComponent('components/navbar.html', 'navbar-placeholder'),
    loadComponent('components/footer.html', 'footer-placeholder'),
  ]);
}
