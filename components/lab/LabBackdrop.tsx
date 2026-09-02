'use client';

import dynamic from 'next/dynamic';
import { useMotionEnabled } from '@/lib/useMotionEnabled';

const InteractiveField = dynamic(() => import('./labMotion').then((m) => ({ default: m.InteractiveField })), {
  ssr: false,
});

/** Deep layered background + a cursor-reactive grid/spotlight for depth — no
 *  canvas particles, no WebGL, nothing that reacts to touch (there's no
 *  hover to react to). Static (motionless grid, no spotlight) under reduced
 *  motion or Professional Mode. */
export function LabBackdrop() {
  const enabled = useMotionEnabled();

  return (
    <div className="lab-backdrop" aria-hidden="true">
      {enabled ? <InteractiveField /> : <div className="lab-backdrop-grid" />}
    </div>
  );
}
