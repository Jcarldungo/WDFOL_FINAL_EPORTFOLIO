'use client';

import Image from 'next/image';
import { useCallback, useId, useRef, useState } from 'react';
import type { ProjectScreen } from '@/lib/content';
import { BLUR_DATA_URL } from '@/lib/blur';

/** The screenshot walker: one large screen in a browser frame, a caption, and
 *  a thumbnail strip. Implemented as a real tablist — arrow keys move between
 *  thumbnails only while the strip has focus, so the page's own arrow-key
 *  scrolling is never hijacked (the previous version bound keydown to
 *  `window` and called preventDefault on every ← / → anywhere on the page).
 *  Degrades to a single static frame when a project has one screen. */
export function ScreenWalker({ screens, frameUrl }: { screens: ProjectScreen[]; frameUrl?: string }) {
  const [i, setI] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const count = screens.length;
  const many = count > 1;

  const go = useCallback(
    (next: number, focus = false) => {
      const n = (next + count) % count;
      setI(n);
      if (focus) {
        stripRef.current?.querySelector<HTMLElement>(`[data-n="${n}"]`)?.focus();
      }
    },
    [count],
  );

  function onStripKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1, true); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1, true); }
    else if (e.key === 'Home') { e.preventDefault(); go(0, true); }
    else if (e.key === 'End') { e.preventDefault(); go(count - 1, true); }
  }

  const active = screens[i];
  const panelId = `${uid}-panel`;

  return (
    <div className="walker">
      <div className="walker-stage">
        {many && (
          <button
            type="button"
            className="walker-arrow walker-arrow--prev"
            onClick={() => go(i - 1)}
            aria-label="Previous screen"
            aria-controls={panelId}
          >
            <span aria-hidden="true">‹</span>
          </button>
        )}

        <figure
          className="walker-frame"
          id={panelId}
          role={many ? 'tabpanel' : undefined}
          aria-live="polite"
        >
          <div className="wf">
            <div className="wf-bar">
              <i /><i /><i />
              {frameUrl && <span className="wf-url">{frameUrl}</span>}
            </div>
            <Image
              key={active.src}
              src={active.src}
              alt={`${active.label} — ${active.caption ?? 'screenshot'}`}
              width={1600}
              height={741}
              sizes="(max-width: 900px) 92vw, 1030px"
              priority={i === 0}
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          </div>
          <figcaption className="walker-caption">
            <span className="walker-caption-n">{String(i + 1).padStart(2, '0')}</span>
            <span className="walker-caption-label">{active.label}</span>
            {active.caption && <span className="walker-caption-text">{active.caption}</span>}
          </figcaption>
        </figure>

        {many && (
          <button
            type="button"
            className="walker-arrow walker-arrow--next"
            onClick={() => go(i + 1)}
            aria-label="Next screen"
            aria-controls={panelId}
          >
            <span aria-hidden="true">›</span>
          </button>
        )}
      </div>

      {many && (
        <>
          <div
            className="walker-strip"
            ref={stripRef}
            role="tablist"
            aria-label="Screens"
            onKeyDown={onStripKeyDown}
          >
            {screens.map((s, n) => (
              <button
                key={s.src}
                type="button"
                role="tab"
                data-n={n}
                aria-selected={n === i}
                aria-controls={panelId}
                /* Roving tabindex: one stop for the whole strip. */
                tabIndex={n === i ? 0 : -1}
                className="walker-thumb"
                onClick={() => go(n)}
              >
                <Image src={s.src} alt="" width={320} height={148} sizes="128px" />
                <span className="walker-thumb-n">{String(n + 1).padStart(2, '0')}</span>
                <span className="sr-only">{s.label}</span>
              </button>
            ))}
          </div>
          <p className="walker-hint">
            <kbd>←</kbd> <kbd>→</kbd> to move through the screens
          </p>
        </>
      )}
    </div>
  );
}
