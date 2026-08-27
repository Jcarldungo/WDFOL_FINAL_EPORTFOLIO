'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from './ThemeProvider';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
];

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

export function Nav() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

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

  // Close the mobile menu on every route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <div id="progress-bar" ref={progressRef} role="progressbar" aria-label="Reading progress" />

      <nav
        id="mobile-menu"
        ref={menuRef}
        className={`mobile-menu${menuOpen ? ' open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`mobile-link${pathname === link.href ? ' active' : ''}`}
            onClick={closeMenu}
          >
            {link.label}
          </Link>
        ))}
        <div className="mobile-menu-actions">
          <button className="theme-toggle" aria-label="Toggle light/dark mode" onClick={toggleTheme}>
            {theme === 'dark' ? SunIcon : MoonIcon}
          </button>
          <Link href="/contact" className="btn btn-primary" onClick={closeMenu}>Hire Me</Link>
        </div>
      </nav>

      <header id="navbar" role="banner" className={scrolled ? 'scrolled' : ''}>
        <div className="container">
          <div className="nav-inner">
            <Link href="/" className="nav-logo" aria-label="Jann Carl Dungo — Home">
              <Image src="/icons/logo.png" alt="JD Logo" width={46} height={46} className="logo-img" />
            </Link>

            <nav className="nav-links" aria-label="Primary navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link${pathname === link.href ? ' active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="nav-actions">
              <button className="theme-toggle nav-actions-toggle" aria-label="Toggle light/dark mode" onClick={toggleTheme}>
                {theme === 'dark' ? SunIcon : MoonIcon}
              </button>
              <Link href="/contact" className="btn btn-primary btn-sm">Hire Me</Link>
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
