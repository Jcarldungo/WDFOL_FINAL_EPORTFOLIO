'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ProjectScreen } from '@/lib/content';

/** The screenshot walker: one large screen in a browser frame, a caption,
 *  a thumbnail strip, and ← / → / number-key navigation. Degrades to a
 *  single static frame when a project has one screen or none. */
export function ScreenWalker({ screens, frameUrl }: { screens: ProjectScreen[]; frameUrl?: string }) {
  const [i, setI] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const count = screens.length;
  const many = count > 1;

  const go = useCallback(
    (next: number) => setI((next + count) % count),
    [count],
  );

  useEffect(() => {
    if (!many) return;
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
      else if (/^[1-9]$/.test(e.key)) {
        const n = Number(e.key) - 1;
        if (n < count) { e.preventDefault(); setI(n); }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [i, count, many, go]);

  useEffect(() => {
    stripRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({
      inline: 'center', block: 'nearest', behavior: 'smooth',
    });
  }, [i]);

  const active = screens[i];

  return (
    <div className="walker">
      <div className="walker-stage">
        {many && (
          <button className="walker-arrow walker-arrow--prev" onClick={() => go(i - 1)} aria-label="Previous screen">
            <span aria-hidden="true">‹</span>
          </button>
        )}

        <figure className="walker-frame">
          <div className="wf">
            <div className="wf-bar">
              <i /><i /><i />
              {frameUrl && <span className="wf-url">{frameUrl}</span>}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={active.src + i} src={active.src} alt={active.label} width={1600} height={1000} />
          </div>
          <figcaption className="walker-caption">
            <span className="walker-caption-n">{String(i + 1).padStart(2, '0')}</span>
            <span className="walker-caption-label">{active.label}</span>
            {active.caption && <span className="walker-caption-text">{active.caption}</span>}
          </figcaption>
        </figure>

        {many && (
          <button className="walker-arrow walker-arrow--next" onClick={() => go(i + 1)} aria-label="Next screen">
            <span aria-hidden="true">›</span>
          </button>
        )}
      </div>

      {many && (
        <>
          <div className="walker-strip" ref={stripRef} role="tablist" aria-label="Screens">
            {screens.map((s, n) => (
              <button
                key={s.src + n}
                role="tab"
                aria-selected={n === i}
                data-active={n === i}
                className="walker-thumb"
                onClick={() => setI(n)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt="" width={160} height={100} loading="lazy" />
                <span className="walker-thumb-n">{String(n + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </div>
          <p className="walker-hint">
            <kbd>←</kbd> <kbd>→</kbd> or <kbd>1</kbd>–<kbd>{count}</kbd> to switch screens
          </p>
        </>
      )}
    </div>
  );
}
