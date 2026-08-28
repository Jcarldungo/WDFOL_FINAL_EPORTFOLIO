export type SectionMeta = { id: string; label: string };

/** Single source of truth for nav/footer anchor order and labels. Section
 *  render order in `app/page.tsx` is explicit JSX, not driven by this list —
 *  with only six sections that stays more debuggable than a registry loop. */
export const SECTIONS: SectionMeta[] = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Work' },
  { id: 'stack', label: 'Stack' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export const SECTION_IDS: string[] = SECTIONS.map((s) => s.id);
