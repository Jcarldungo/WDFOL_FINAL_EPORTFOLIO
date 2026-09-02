'use client';

import dynamic from 'next/dynamic';
import { useMotionEnabled } from '@/lib/useMotionEnabled';

const RailIndicatorMotion = dynamic(() => import('./labMotion').then((m) => ({ default: m.RailIndicator })), {
  ssr: false,
});

/** Professional Mode / reduced motion: nothing rendered — the existing
 *  .lab-rail-item.active CSS background is the only indicator (see
 *  lab.css's .lab-rail--animated override). Developer Mode: a shared-layout
 *  pill that slides between rail items instead of snapping. */
export function LabRailIndicator() {
  const enabled = useMotionEnabled();
  if (!enabled) return null;
  return <RailIndicatorMotion />;
}
