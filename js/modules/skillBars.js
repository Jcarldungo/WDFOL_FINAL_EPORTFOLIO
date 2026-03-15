/**
 * @module skillBars
 * Animates skill bars ONLY when they scroll into the user's viewport.
 * Uses IntersectionObserver so bars fill up as the user reaches that section.
 */

export function animateSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  // Reset all bars to 0 first so animation is visible on each navigation
  fills.forEach(bar => { bar.style.width = '0%'; });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const target = bar.dataset.w;
        if (target) {
          // Small delay so CSS transition is visible
          requestAnimationFrame(() => {
            setTimeout(() => { bar.style.width = `${target}%`; }, 120);
          });
        }
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

  fills.forEach(bar => observer.observe(bar));
}
