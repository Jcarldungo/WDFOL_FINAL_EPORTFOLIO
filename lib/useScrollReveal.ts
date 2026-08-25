'use client';

import { useEffect } from 'react';

const THRESHOLD = 0.12;

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: THRESHOLD }
    );

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => {
      if (!el.classList.contains('visible')) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}
