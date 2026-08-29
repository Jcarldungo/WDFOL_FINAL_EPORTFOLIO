import type { Metadata } from 'next';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { StackSection } from '@/components/sections/StackSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { HashScrollFallback } from '@/components/HashScrollFallback';

export const metadata: Metadata = { alternates: { canonical: '/' } };

export default function Home() {
  return (
    <>
      <HashScrollFallback />
      <HeroSection />
      <ProjectsSection />
      <StackSection />
      <AboutSection />
      <ExperienceSection />
      <ContactSection />
    </>
  );
}
