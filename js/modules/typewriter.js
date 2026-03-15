/**
 * @module typewriter
 * Animates a cycling typed-text effect in the hero section.
 *
 * Separation rationale: Typewriter is a stateful animation with its own
 * timer loop. Encapsulating it allows clean start/stop lifecycle management,
 * preventing runaway setTimeouts when the home page is navigated away from.
 *
 * @exports { initTypewriter, destroyTypewriter }
 */

const PHRASES = [
  'Backend Developer',
  'Full Stack Developer',
  'BSIT Student @ HAU',,
  'REST API Builder',
  'Problem Solver',
];

const TYPE_SPEED   = 70;   // ms per character when typing
const DELETE_SPEED = 45;   // ms per character when deleting
const PAUSE_TYPED  = 1800; // ms pause after full phrase is typed
const PAUSE_DELETED = 400;  // ms pause after phrase is fully deleted

/** Active timeout ID — stored so it can be cancelled */
let timerId = null;
let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;

/**
 * Core typing loop.
 * @param {HTMLElement} el - The element to type into
 */
function tick(el) {
  const phrase = PHRASES[phraseIndex];

  if (isDeleting) {
    el.textContent = phrase.substring(0, --charIndex);

    if (charIndex === 0) {
      isDeleting  = false;
      phraseIndex = (phraseIndex + 1) % PHRASES.length;
      timerId = setTimeout(() => tick(el), PAUSE_DELETED);
      return;
    }

    timerId = setTimeout(() => tick(el), DELETE_SPEED);
  } else {
    el.textContent = phrase.substring(0, ++charIndex);

    if (charIndex === phrase.length) {
      isDeleting = true;
      timerId = setTimeout(() => tick(el), PAUSE_TYPED);
      return;
    }

    timerId = setTimeout(() => tick(el), TYPE_SPEED);
  }
}

/**
 * Initialize the typewriter effect.
 * Resets state and starts the animation loop.
 * Safe to call on every home page visit.
 */
export function initTypewriter() {
  destroyTypewriter();

  const el = document.getElementById('typed-text');
  if (!el) return;

  // Reset state for fresh start
  phraseIndex = 0;
  charIndex   = 0;
  isDeleting  = false;

  timerId = setTimeout(() => tick(el), 600);
}

/**
 * Stop the typewriter animation and clean up the timer.
 * Called by the router before navigating away from the home page.
 */
export function destroyTypewriter() {
  if (timerId !== null) {
    clearTimeout(timerId);
    timerId = null;
  }
}
