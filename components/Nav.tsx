'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { NAV_SECTIONS, SECTION_IDS } from '@/lib/sections';
import { useActiveSection } from '@/lib/useActiveSection';
import { useTheme } from './ThemeProvider';
import { useDeveloperMode } from './DeveloperModeProvider';
import { suppressNextModeTransition } from './ModeTransition';
import { NavActiveIndicator } from './motion/NavActiveIndicator';
import { requestLabWipe } from '@/lib/labWipeSignal';

const SunIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const MoonIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </svg>
);
const CodeIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 8 4 12 9 16" /><polyline points="15 8 20 12 15 16" />
  </svg>
);
const TerminalIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="4 6 10 12 4 18" /><line x1="12" y1="18" x2="20" y2="18" />
  </svg>
);

export function Nav() {
  const { theme, toggleTheme } = useTheme();
  const { devMode, toggleDevMode } = useDeveloperMode();
  const router = useRouter();
  const active = useActiveSection(SECTION_IDS);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const devToggleRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Turning it on from here means "take me to the full Developer Mode
  // environment" — /lab's own entrance sequence owns that transition, so the
  // local glow flash is suppressed rather than playing underneath it.
  // Turning it off (devMode was already true, e.g. persisted from a prior
  // visit) just reverts the homepage's bonus polish in place — no navigation.
  const handleDevToggle = useCallback(() => {
    if (devMode) {
      toggleDevMode();
      return;
    }
    suppressNextModeTransition();
    toggleDevMode();
    const rect = devToggleRef.current?.getBoundingClientRect();
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: window.innerWidth, y: 0 };
    requestLabWipe(origin, 'lab').then(() => {
      try {
        sessionStorage.setItem('portfolio-lab-wiped', '1');
      } catch {
        /* ignore */
      }
      router.push('/lab?enter=1');
    });
  }, [devMode, toggleDevMode, router]);

  // One rAF-batched read per frame. The progress bar is written straight
  // to the DOM (transform: scaleX) so scrolling never triggers a render;
  // `scrolled` only flips state when the boolean actually changes.
  useEffect(() => {
    let ticking = false;
    let lastScrolled = false;

    function apply() {
      ticking = false;
      const y = window.scrollY;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const ratio = scrollable > 0 ? Math.min(y / scrollable, 1) : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${ratio})`;
      }
      const next = y > 40;
      if (next !== lastScrolled) {
        lastScrolled = next;
        setScrolled(next);
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    apply();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock scroll, trap focus, and manage focus in/out while the menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (!menuOpen) return;

    const menu = menuRef.current;
    const hamburger = hamburgerRef.current;
    const focusables = menu
      ? Array.from(
          menu.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        )
      : [];
    focusables[0]?.focus();

    function onKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        return;
      }
      if (e.key !== 'Tab' || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeydown);
    return () => {
      document.removeEventListener('keydown', onKeydown);
      document.body.style.overflow = '';
      hamburger?.focus();
    };
  }, [menuOpen]);

  // Close the mobile menu whenever the URL hash changes (anchor nav that
  // isn't a direct link click — e.g. browser back/forward).
  useEffect(() => {
    window.addEventListener('hashchange', closeMenu);
    return () => window.removeEventListener('hashchange', closeMenu);
  }, [closeMenu]);

  return (
    <>
      <div id="progress-bar" ref={progressRef} aria-hidden="true" />

      <nav
        id="mobile-menu"
        ref={menuRef}
        className={`mobile-menu${menuOpen ? ' open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        {NAV_SECTIONS.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`mobile-link${active === s.id ? ' active' : ''}`}
            style={{ '--i': i } as CSSProperties}
            onClick={closeMenu}
          >
            {s.label}
          </a>
        ))}
        {/* No theme or dev-mode toggle here — both live in the header on
            mobile, where they stay reachable and show their effect
            immediately. */}
        <div className="mobile-menu-actions">
          <a href="#contact" className="btn btn-primary" onClick={closeMenu}>Start a project</a>
        </div>
      </nav>

      <header id="navbar" role="banner" className={scrolled ? 'scrolled' : ''}>
        <div className="container">
          <div className="nav-inner">
            {/* Typographic wordmark, not an image: the old 117 KB PNG needed a
                filter hack to be visible on dark and still read as a faint grey.
                Set in the site's own display face it themes for free, stays
                crisp at any density, and matches the /work top bar. */}
            <a href="#home" className="nav-logo">
              <span className="nav-logo-mark" aria-hidden="true">JD</span>
              <span className="sr-only">Jann Carl Dungo — back to top</span>
            </a>

            <nav className="nav-links" aria-label="Primary navigation">
              {NAV_SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`nav-link${active === s.id ? ' active' : ''}`}
                >
                  {s.label}
                  {active === s.id && <NavActiveIndicator />}
                </a>
              ))}
            </nav>

            <div className="nav-actions">
              <button
                ref={devToggleRef}
                className={`dev-toggle${devMode ? ' active' : ''}`}
                aria-pressed={devMode}
                aria-label={devMode ? 'Switch to Professional Mode' : 'Enter Developer Mode'}
                onClick={handleDevToggle}
              >
                {devMode ? TerminalIcon : CodeIcon}
              </button>
              <button className="theme-toggle" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} onClick={toggleTheme}>
                {theme === 'dark' ? SunIcon : MoonIcon}
              </button>
              <a href="#contact" className="btn btn-primary btn-sm">Start a project</a>
              <button
                ref={hamburgerRef}
                className={`hamburger${menuOpen ? ' open' : ''}`}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMenuOpen((o) => !o)}
              >
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
