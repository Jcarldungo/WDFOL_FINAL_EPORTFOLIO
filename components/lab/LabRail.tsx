'use client';

import { useCallback, useRef, type KeyboardEvent } from 'react';
import { LAB_MODULES, type LabModuleId } from '@/lib/lab/modules';
import { useMotionEnabled } from '@/lib/useMotionEnabled';
import { LabRailIndicator } from './LabRailIndicator';

/** Plain nav + real buttons, not ARIA tabs — the modules behind each item are
 *  whole rich, page-like sections (one nests its own tablist), which is a
 *  poor fit for the tabpanel pattern. Roving tabindex is kept as a keyboard
 *  nicety. Both arrow-axis pairs are accepted so the same handler works for
 *  the vertical sidebar (desktop) and the horizontal bottom bar (mobile)
 *  without detecting the breakpoint in JS. */
export function LabRail({ activeId, onSelect }: { activeId: LabModuleId; onSelect: (id: LabModuleId) => void }) {
  const itemRefs = useRef<Partial<Record<LabModuleId, HTMLButtonElement | null>>>({});
  const animated = useMotionEnabled();

  const focusAndSelect = useCallback(
    (id: LabModuleId) => {
      onSelect(id);
      itemRefs.current[id]?.focus();
    },
    [onSelect]
  );

  const move = useCallback(
    (delta: number) => {
      const i = LAB_MODULES.findIndex((m) => m.id === activeId);
      const next = LAB_MODULES[(i + delta + LAB_MODULES.length) % LAB_MODULES.length];
      focusAndSelect(next.id);
    },
    [activeId, focusAndSelect]
  );

  function onKeyDown(e: KeyboardEvent<HTMLElement>) {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        move(-1);
        break;
      case 'Home':
        e.preventDefault();
        focusAndSelect(LAB_MODULES[0].id);
        break;
      case 'End':
        e.preventDefault();
        focusAndSelect(LAB_MODULES[LAB_MODULES.length - 1].id);
        break;
    }
  }

  return (
    <nav
      className={`lab-rail${animated ? ' lab-rail--animated' : ''}`}
      aria-label="Developer Mode navigation"
      onKeyDown={onKeyDown}
    >
      {LAB_MODULES.map((m) => (
        <button
          key={m.id}
          type="button"
          ref={(el) => {
            itemRefs.current[m.id] = el;
          }}
          className={`lab-rail-item${m.id === activeId ? ' active' : ''}`}
          aria-current={m.id === activeId ? 'true' : undefined}
          tabIndex={m.id === activeId ? 0 : -1}
          onClick={() => onSelect(m.id)}
        >
          <span className="lab-rail-index">{m.index}</span>
          <span className="lab-rail-label">{m.label}</span>
          {m.id === activeId && <LabRailIndicator />}
        </button>
      ))}
    </nav>
  );
}
