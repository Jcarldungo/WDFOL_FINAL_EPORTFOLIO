/**
 * @module constraintMeter
 * Reusable "constraint meter" — a gauge that shows a real measured quantity
 * against a real, labelled ceiling. It exists in exactly two places on the
 * site: the Home hero constraint band (10/12 Vercel serverless functions)
 * and the gastos project card on the Projects page. Per the design plan it
 * is intentionally NOT used anywhere else, and never as a decorative skill
 * indicator — it stays rare so it stays credible.
 *
 * Markup contract (see pages/home.html or pages/projects.html for a live
 * example):
 *   <div class="constraint-meter" data-value="10" data-max="12">
 *     <div class="cm-track" role="meter" aria-valuenow="10" aria-valuemin="0"
 *          aria-valuemax="12" aria-label="10 of 12 serverless functions used">
 *       <div class="cm-fill" style="width:83.33%"></div>
 *       <div class="cm-ceiling-line"></div>
 *     </div>
 *     <div class="cm-labels"> ... </div>
 *     <p class="cm-readout"><span class="cm-numeral" data-count-to="10">10</span> / 12 ...</p>
 *   </div>
 *
 * The fill width and numeral text are baked into the HTML as the correct
 * FINAL values, so the meter is fully correct and accessible even if this
 * module never runs (no-JS, or reduced motion). When JS is available and
 * the user has not requested reduced motion, init() resets each meter to
 * zero and animates it once — 600ms ease-out — the first time it scrolls
 * into view.
 */

const prefersReducedMotion = () =>
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let observer = null;

function animateMeter(root) {
  const fill    = root.querySelector('.cm-fill');
  const numeral = root.querySelector('.cm-numeral');
  const value   = parseFloat(root.dataset.value);
  const max     = parseFloat(root.dataset.max);
  if (!fill || Number.isNaN(value) || Number.isNaN(max) || max <= 0) return;

  const targetPct = Math.min(100, Math.max(0, (value / max) * 100));
  const duration  = 600; // ms, per plan
  const start     = performance.now();

  function tick(now) {
    const t     = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
    fill.style.width = `${targetPct * eased}%`;
    if (numeral) numeral.textContent = String(Math.round(value * eased));

    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      fill.style.width = `${targetPct}%`;
      if (numeral) numeral.textContent = String(value);
    }
  }

  requestAnimationFrame(tick);
}

function createObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateMeter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
  return observer;
}

/**
 * Find all constraint meters on the current page and arm them for a
 * once-only animate-on-scroll-into-view. Safe to call on every page
 * navigation — already-armed meters are skipped so re-visiting a page
 * doesn't replay the animation.
 */
export function initConstraintMeters() {
  const meters = document.querySelectorAll('.constraint-meter:not([data-cm-armed])');
  if (!meters.length) return;

  const reduced = prefersReducedMotion();

  meters.forEach(root => {
    root.setAttribute('data-cm-armed', 'true');

    // Reduced motion: leave the baked-in final fill/numeral exactly as
    // authored in the HTML — pre-filled, no animation.
    if (reduced) return;

    const fill    = root.querySelector('.cm-fill');
    const numeral = root.querySelector('.cm-numeral');
    if (fill)    fill.style.width = '0%';
    if (numeral) numeral.textContent = '0';

    createObserver().observe(root);
  });
}
