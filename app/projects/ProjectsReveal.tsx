'use client';

import { useScrollReveal } from '@/lib/useScrollReveal';

export function ProjectsReveal({ children }: { children: React.ReactNode }) {
  useScrollReveal();
  return <>{children}</>;
}
