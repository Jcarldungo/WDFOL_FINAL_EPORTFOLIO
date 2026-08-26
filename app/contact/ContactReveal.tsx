'use client';

import { useScrollReveal } from '@/lib/useScrollReveal';

export function ContactReveal({ children }: { children: React.ReactNode }) {
  useScrollReveal();
  return <>{children}</>;
}
