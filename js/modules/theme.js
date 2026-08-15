/**
 * @module theme
 * Handles dark/light mode toggle with localStorage persistence.
 *
 * Separation rationale: Theme state is global side-effect code. Isolating it
 * prevents it from coupling with router, form, or UI logic.
 *
 * @exports { init }
 */

const STORAGE_KEY = 'portfolio-theme';
const DEFAULT_THEME = 'dark';

/**
 * Apply a theme by setting the data-theme attribute on <html>
 * and updating the toggle button icon.
 * @param {'dark'|'light'} theme
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

/**
 * Initialize theme module.
 * - Reads saved preference from localStorage
 * - Applies it immediately (before paint)
 * - Attaches toggle button event listener
 */
export function init() {
  const savedTheme = localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
  applyTheme(savedTheme);

  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });
}
