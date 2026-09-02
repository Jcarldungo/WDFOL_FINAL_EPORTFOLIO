'use client';

// Every actual `motion/react` usage for /lab lives in this one module, same
// convention as components/motion/enhancements.tsx — every call site is a
// thin useMotionEnabled() gate in front of a dynamic() import of a named
// export here, so they all share one lazily-loaded chunk instead of each
// paying for their own copy of the library, and a reduced-motion visitor on
// /lab downloads none of it.

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useTransform } from 'motion/react';

// ---------------------------------------------------------------------------
// Entrance sequence
// ---------------------------------------------------------------------------

const INTRO_BEATS = ['Loading the archive…', 'Warming up the workspace…', 'Ready.'];
const BEAT_MS = 380;
const LAST_BEAT_MS = 500;

export function IntroSequence({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  useEffect(() => {
    if (step >= INTRO_BEATS.length - 1) {
      const t = setTimeout(finish, LAST_BEAT_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), BEAT_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    function onKey() {
      finish();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="lab-intro"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      onClick={finish}
      role="status"
      aria-live="polite"
    >
      <motion.div
        className="lab-intro-iris"
        initial={{ clipPath: 'circle(0% at 50% 8%)' }}
        animate={{ clipPath: 'circle(150% at 50% 8%)' }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          className="lab-intro-line"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
        >
          {INTRO_BEATS[step]}
        </motion.p>
      </AnimatePresence>
      <p className="lab-intro-skip">click anywhere to skip</p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Cursor-reactive backdrop: grid gets a subtle parallax nudge, plus the
// spotlight glow — one component, one pointer subscription, so the two
// effects always read as a single reaction to the same cursor rather than
// two independently-moving pieces.
// ---------------------------------------------------------------------------

export function InteractiveField() {
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (e.pointerType !== 'mouse') return;
      x.set(e.clientX);
      y.set(e.clientY);
    }
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [x, y]);

  // Off-screen sentinel (-9999) reads as "pointer hasn't moved yet" — clamped
  // to 0 nudge rather than snapping the grid toward a phantom position.
  const gridX = useTransform(x, (v) => (v < -1000 ? 0 : (v - window.innerWidth / 2) * 0.012));
  const gridY = useTransform(y, (v) => (v < -1000 ? 0 : (v - window.innerHeight / 2) * 0.012));
  const background = useMotionTemplate`radial-gradient(560px circle at ${x}px ${y}px, var(--lab-spot), transparent 68%)`;

  return (
    <>
      <motion.div className="lab-backdrop-grid" style={{ x: gridX, y: gridY }} />
      <motion.div className="lab-spotlight" style={{ background }} aria-hidden="true" />
    </>
  );
}

// ---------------------------------------------------------------------------
// Stage module-switch transition
// ---------------------------------------------------------------------------

export function StageTransition({ id, children }: { id: string; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={id}
        initial={{ opacity: 0, y: 14, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.99 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Archive slab shared-layout expand
// ---------------------------------------------------------------------------

export function SlabMotion({
  layoutId,
  className,
  style,
  children,
}: {
  layoutId: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <motion.div
      layoutId={layoutId}
      className={className}
      style={style}
      transition={{ type: 'spring', stiffness: 260, damping: 30, mass: 0.8 }}
    >
      {children}
    </motion.div>
  );
}
