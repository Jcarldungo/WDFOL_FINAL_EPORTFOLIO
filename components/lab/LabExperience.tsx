'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDeveloperMode } from '@/components/DeveloperModeProvider';
import { suppressNextModeTransition } from '@/components/ModeTransition';
import { useMotionEnabled } from '@/lib/useMotionEnabled';
import { requestLabWipe } from '@/lib/labWipeSignal';
import { DEFAULT_LAB_MODULE, type LabModuleId } from '@/lib/lab/modules';
import { LabBackdrop } from './LabBackdrop';
import { LabRail } from './LabRail';
import { LabStage } from './LabStage';
import { LabIntro } from './LabIntro';
import { LabIntroGate } from './LabIntroGate';
import { LabExitControl } from './LabExitControl';

const LAB_EXIT_FOCUS_FLAG = 'portfolio-lab-exit';

export function LabExperience() {
  const router = useRouter();
  const { devMode, setDevMode } = useDeveloperMode();
  const motionEnabled = useMotionEnabled();
  const [activeId, setActiveId] = useState<LabModuleId>(DEFAULT_LAB_MODULE);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // A direct/bookmarked/shared visit arrives with devMode still false from
    // a fresh browser — without this, every Motion-gated thing in Lab would
    // silently render as a flat, static husk. Only touch it when it would
    // actually change: the entry-toggle click on `/` may have already set
    // this, and re-flipping a no-op value would still (wrongly) arm the
    // suppress-next-flash flag below for a later, unrelated devMode change.
    if (!devMode) {
      suppressNextModeTransition();
      setDevMode(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleIntroDecision = useCallback((shouldPlay: boolean) => {
    if (shouldPlay) setShowIntro(true);
  }, []);

  const handleIntroDone = useCallback(() => {
    setShowIntro(false);
  }, []);

  const handleExit = useCallback(() => {
    setDevMode(false);
    try {
      sessionStorage.setItem(LAB_EXIT_FOCUS_FLAG, '1');
    } catch {
      /* ignore */
    }
    if (!motionEnabled) {
      router.push('/');
      return;
    }
    // Fixed origin matching .lab-exit's CSS position (top: 20px; right:
    // 20px) rather than measuring the real button — LabExitControl is a
    // separate presentational component and threading a ref through it for
    // one approximate coordinate isn't worth the coupling.
    requestLabWipe({ x: window.innerWidth - 40, y: 40 }, 'site').then(() => router.push('/'));
  }, [motionEnabled, router, setDevMode]);

  return (
    <div className="lab-root">
      <LabBackdrop />

      {/* The shell always renders — including in the static HTML a crawler
          sees, since this route is meant to be discoverable, not hidden
          behind a client-only gate. The entrance sequence is purely an
          overlay that covers it, resolved client-side only (query params
          never affect the static HTML this route serves). */}
      <div className="lab-shell">
        <LabRail activeId={activeId} onSelect={setActiveId} />
        <LabStage activeId={activeId} />
      </div>

      <Suspense fallback={null}>
        <LabIntroGate onDecision={handleIntroDecision} />
      </Suspense>
      {showIntro && <LabIntro onDone={handleIntroDone} />}

      <LabExitControl onExit={handleExit} />
    </div>
  );
}
