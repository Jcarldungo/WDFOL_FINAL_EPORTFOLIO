'use client';

import { useScrollReveal } from '@/lib/useScrollReveal';

export function AboutReveal({ children }: { children: React.ReactNode }) {
  useScrollReveal();
  return <>{children}</>;
}
