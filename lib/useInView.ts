'use client';

import { useEffect, useRef, useState } from 'react';

/** One-shot in-view detection. Returns a ref to attach and whether the
 *  element has entered the viewport at least once. */
export function useInView<T extends Element = HTMLDivElement>(
  { rootMargin = '0px', threshold = 0 }: { rootMargin?: string; threshold?: number } = {}
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return [ref, inView];
}
