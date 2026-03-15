/**
 * @file main.js — Application entry point.
 *
 * Initialization order (intentional — do not reorder):
 *  1. loadComponents  — Inject navbar + footer HTML into the DOM shell
 *  2. theme.init      — Apply saved theme ASAP (before first paint)
 *  3. navbar.init     — Attach scroll + hamburger listeners
 *  4. particles.init  — Start canvas animation loop (non-blocking)
 *  5. router.init     — Attach click delegation + load initial page
 *
 * Architecture rationale:
 * - ES6 modules enforce explicit dependency graphs (no globals)
 * - Each module has a single responsibility and exports a clean API
 * - The router owns page lifecycle; other modules react to its hooks
 * - No module directly imports another module's DOM state
 *
 * To add a new page:
 *  1. Create /pages/new-page.html
 *  2. Add a data-page="new-page" link in navbar.html + mobile menu
 *  3. Add a case to router.js runPageHooks() if the page needs JS
 *  4. Create /css/pages/new-page.css and import it in css/main.css
 */

import { loadComponents } from './modules/loader.js';
import { init as initTheme }  from './modules/theme.js';
import { init as initNavbar } from './modules/navbar.js';
import { init as initParticles } from './modules/particles.js';
import { init as initRouter } from './modules/router.js';

/**
 * Bootstrap the application.
 * All async operations are awaited in sequence where order matters.
 */
async function bootstrap() {
  // 1. Load navbar & footer HTML into DOM shell first
  //    (theme toggle and hamburger buttons must exist before listeners attach)
  await loadComponents();

  // 2. Apply saved theme immediately — prevents flash of wrong theme
  initTheme();

  // 3. Attach navbar scroll + mobile menu listeners
  initNavbar();

  // 4. Start particle canvas (visual enhancement — non-blocking)
  initParticles();

  // 5. Init router — fetches and injects the initial page (home)
  initRouter();
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
