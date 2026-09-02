export type LabWipeOrigin = { x: number; y: number };
type WipeRequest = { origin: LabWipeOrigin; theme: 'lab' | 'site'; resolve: () => void };
type Listener = (req: WipeRequest) => void;

let listener: Listener | null = null;

/** ModeWipeOverlay (components/ModeWipeOverlay.tsx) is the sole subscriber,
 *  registered once from the root layout. Returns an unregister function for
 *  its effect cleanup, though in practice the overlay never unmounts. */
export function registerLabWipeListener(fn: Listener): () => void {
  listener = fn;
  return () => {
    if (listener === fn) listener = null;
  };
}

/** Resolves once the overlay reports the viewport is fully covered — the
 *  caller navigates inside that resolution, so the route change always
 *  happens hidden behind the wipe, never before or after it. If no overlay
 *  is registered (shouldn't happen in practice — it's mounted in the root
 *  layout) this resolves immediately so a caller never hangs. */
export function requestLabWipe(origin: LabWipeOrigin, theme: 'lab' | 'site'): Promise<void> {
  return new Promise((resolve) => {
    if (!listener) {
      resolve();
      return;
    }
    listener({ origin, theme, resolve });
  });
}
