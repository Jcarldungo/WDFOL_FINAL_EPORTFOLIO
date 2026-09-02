'use client';

import dynamic from 'next/dynamic';
import { useCallback } from 'react';
import { useMotionEnabled } from '@/lib/useMotionEnabled';
import { LAB_MODULES, type LabModuleId } from '@/lib/lab/modules';

const StageTransition = dynamic(() => import('./labMotion').then((m) => ({ default: m.StageTransition })), {
  ssr: false,
});
const StageTraceLine = dynamic(() => import('./labMotion').then((m) => ({ default: m.StageTraceLine })), {
  ssr: false,
});

export function LabStage({ activeId }: { activeId: LabModuleId }) {
  const motionEnabled = useMotionEnabled();
  const active = LAB_MODULES.find((m) => m.id === activeId) ?? LAB_MODULES[0];
  const Module = active.Component;

  // A ref callback, not a persistent ref + effect: with AnimatePresence
  // potentially keeping an outgoing panel mounted during its exit animation,
  // a shared ref object risks the wrong node winning. The callback fires
  // exactly once per fresh mount of *this* panel — guaranteed by the
  // key={activeId} below forcing a remount on every module switch, in both
  // the motion and non-motion branch. Resets scroll and moves focus into the
  // new region, since App Router doesn't manage focus across a client-side
  // state change like this on its own.
  const attachPanel = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    node.scrollTop = 0;
    node.focus({ preventScroll: true });
  }, []);

  const content = (
    <div
      key={activeId}
      ref={attachPanel}
      className="lab-stage-panel"
      role="region"
      aria-label={`${active.label} — Developer Mode`}
      tabIndex={-1}
    >
      {motionEnabled && <StageTraceLine id={activeId} />}
      <Module />
    </div>
  );

  return <div className="lab-stage">{motionEnabled ? <StageTransition id={activeId}>{content}</StageTransition> : content}</div>;
}
